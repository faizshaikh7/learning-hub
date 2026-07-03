import type { InterviewQuestion } from '@/types'

/**
 * Production-scenario interview questions for the Flutter course.
 * Client-side angles on real backend/infra incidents: offline outbox,
 * startup performance, forced logout, and large uploads from mobile.
 */
export const FLUTTER_SCENARIO_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'fl-sc-1',
    level: 'technical',
    difficulty: 'senior',
    category: 'debugging',
    question:
      'Users of your chat app report that messages they send while offline (in a tunnel, on flaky wifi) simply vanish. How do you make sending reliable from the client side?',
    modelAnswer:
      'The root cause is that the app fires the message straight at the network and treats a failed request as a dropped message — there is no local record to recover from. The immediate fix is an outbox pattern: persist every outgoing message to local storage (Hive or SQLite) with a pending status before any network call, and render it optimistically in the thread with a "sending" indicator. A background sender then drains the outbox with retry and exponential backoff whenever connectivity returns, and because retries can double-send, each message carries a client-generated ID (UUID) so the server can deduplicate idempotently. Ordering is reconciled on acknowledgement — the server assigns the canonical sequence number and the client re-sorts on ack rather than trusting local send order. The trade-off is added complexity: you now own a local queue, a sync status per message, and a failure UI (retry/delete), but that is exactly what makes chat feel reliable on mobile networks.',
    keyPoints: [
      'Persist to a local outbox (Hive/SQLite) before the network call — local store is the source of truth',
      'Optimistic UI with an explicit pending/failed state per message',
      'Retry with exponential backoff on reconnect, deduped via client-generated message IDs',
      'Ordering settled by server sequence numbers on acknowledgement, not client send time',
    ],
    followUp: 'The user force-kills the app while three messages are pending. What happens on next launch, and what code path handles it?',
    redFlags: [
      'Only adds a retry loop in memory — messages still die when the app is killed',
      'No deduplication story, so retries create duplicate messages server-side',
      'Blocks the send button on the network instead of writing locally first',
    ],
    topicId: 'local-storage-sqlite',
  },
  {
    id: 'fl-sc-2',
    level: 'technical',
    difficulty: 'mid',
    category: 'debugging',
    question:
      'Your app takes over 3 seconds from tap to first usable frame and reviews are complaining. How do you diagnose and fix slow startup?',
    modelAnswer:
      'First I measure instead of guessing: run in profile mode, use the DevTools timeline and startup tracing to see exactly where time goes between process start, first frame, and interactive. The usual culprits are heavy synchronous work before runApp or in main (opening databases, reading large files, initializing every SDK eagerly), expensive work in initState of the first screen, a huge widget tree rebuilt on launch, and oversized images or fonts decoded up front. The immediate fix is to defer: keep main lean, move non-critical initialization (analytics, remote config, secondary SDKs) to after the first frame or make it lazy on first use, and show a real splash-to-interactive path so the user sees progress. Longer term I use const constructors to cheapen the initial build, downscale and cache launch images, and add a startup-time budget tracked in CI so it cannot silently regress. The trade-off of deferral is that some features are briefly unavailable right after launch, so you have to handle the not-yet-initialized state explicitly.',
    keyPoints: [
      'Measures first — profile mode and DevTools timeline, never debug-mode numbers',
      'Names the real causes: sync I/O before runApp, eager SDK init, heavy initState, unoptimized assets',
      'Defers or lazy-loads non-critical initialization until after first frame',
      'Sets a startup budget/guardrail so the regression cannot return',
    ],
    followUp: 'Which parts of initialization genuinely must complete before the first frame, and how do you decide?',
    redFlags: [
      'Profiles in debug mode and trusts the numbers',
      'Suggests a longer splash screen animation to hide the delay instead of fixing it',
    ],
    topicId: 'performance-optimization',
  },
  {
    id: 'fl-sc-3',
    level: 'technical',
    difficulty: 'senior',
    category: 'debugging',
    question:
      'A user changes their password on another device, so all existing tokens are invalidated. How should your Flutter app detect this and handle the forced logout cleanly?',
    modelAnswer:
      'The client finds out the hard way: its next request comes back 401 because the server bumped the token version. The right place to handle this is a single auth interceptor on the HTTP client (e.g. a Dio interceptor) that catches the 401, attempts one token refresh, and — critically — if the refresh itself also fails with 401, treats the session as dead instead of looping refresh attempts forever. On forced logout it clears everything from secure storage (tokens, cached user data), then does a full navigation reset to the login screen (pushAndRemoveUntil or resetting the router) so no authenticated screen remains on the stack. In-flight requests should fail gracefully — they get cancelled or their errors are swallowed into the logout flow rather than each one popping its own error dialog. The trade-off is centralization: the interceptor becomes security-critical shared code, and you must guard against a refresh stampede where ten concurrent 401s each trigger their own refresh — a single-flight lock on the refresh call fixes that.',
    keyPoints: [
      'Central auth interceptor handles 401 + token-version mismatch in one place, not per-screen',
      'Refresh attempted once; a 401 on the refresh call itself means logout, never a retry loop',
      'Clears secure storage and does a full navigation stack reset to login',
      'Single-flight refresh so concurrent 401s do not stampede; in-flight requests fail quietly',
    ],
    followUp: 'Ten requests are in flight when the token dies. How do you prevent ten refresh calls and ten error dialogs?',
    redFlags: [
      'Handles 401 ad hoc in every screen or repository',
      'Retries refresh on failure indefinitely, creating an infinite loop',
      'Navigates to login but leaves tokens in secure storage or screens on the back stack',
    ],
    topicId: 'firebase-auth-flow',
  },
  {
    id: 'fl-sc-4',
    level: 'technical',
    difficulty: 'senior',
    category: 'tradeoff',
    question:
      'Your app lets users upload a 2GB video from their phone. Walk me through how you would build the upload path on the client.',
    modelAnswer:
      'The first decision is what not to do: never stream 2GB through your own API server — it ties up server memory and connections and doubles the transfer. Instead the app asks the backend for presigned URLs and uploads directly to object storage (S3/GCS) using a chunked, resumable protocol, so a dropped connection on a flaky mobile network only costs the current chunk, retried with backoff, not the whole file. Because users background the app or lock the phone during a long upload, the transfer must survive that — workmanager or a background isolate on Android and URLSession background transfers on iOS keep it going and resume after process death. On top of that you build honest progress UI from bytes-per-chunk, pause/resume controls, and a wifi-only option since 2GB can wipe out a mobile data plan. The trade-off of presigned direct upload is that your server loses inline visibility, so completion is confirmed via a finalize callback or storage event, and validation/scanning happens after upload rather than in the request path.',
    keyPoints: [
      'Direct-to-storage with presigned URLs — the API server never proxies the bytes',
      'Chunked/resumable upload with per-chunk retry and backoff for flaky networks',
      'Background continuation: workmanager / URLSession so backgrounding or process death does not kill it',
      'User-respecting UX: real progress, pause/resume, wifi-only option; completion confirmed server-side',
    ],
    followUp: 'The upload is at 80% and the OS kills your app. What exactly happens next, and what state did you need to have persisted?',
    redFlags: [
      'Uploads the whole file in one POST through the API server',
      'No resume story — a network blip at 1.9GB restarts from zero',
      'Ignores backgrounding, so the upload dies the moment the user switches apps',
    ],
    topicId: 'http-rest-flutter',
  },
]
