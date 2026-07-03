import type { InterviewQuestion } from '@/types'

/**
 * Production-scenario interview questions for the React course.
 * Client-side angles on real backend/infra incidents: partial API failure,
 * breaking API changes, stale deploys, and duplicate submissions.
 */
export const REACT_SCENARIO_QUESTIONS: InterviewQuestion[] = [
  {
    id: 're-sc-1',
    level: 'technical',
    difficulty: 'senior',
    category: 'tradeoff',
    question:
      'Your dashboard calls 6 different APIs to render its widgets, and one of them is slow or down. The whole page hangs or errors. How do you fix the experience?',
    modelAnswer:
      'The root cause is coupling: the page treats six independent data sources as one all-or-nothing load, so the slowest or broken API dictates the whole experience. The immediate client fix is to fetch in parallel and isolate failure per widget — each widget gets its own query, its own skeleton while loading, and its own error boundary with a retry, so five widgets render fine while the sixth shows a contained error state. Every request gets a timeout enforced with AbortController so a hung API degrades into that error state instead of spinning forever, and React Query gives you stale-while-revalidate caching so a flaky API can keep showing last-known-good data while refetching in the background. The longer-term architectural question is client orchestration versus a BFF: a backend-for-frontend can aggregate the six calls into one shaped response and hide partial failures server-side, at the cost of owning and deploying another service. The trade-off is failure isolation and independent iteration on the client versus fewer round trips and centralized policy in the BFF — for a dashboard, per-widget isolation is usually the right first move.',
    keyPoints: [
      'Parallel per-widget fetching with independent error boundaries and skeletons — partial failure, partial UI',
      'Timeouts via AbortController so a hung API degrades instead of hanging the page',
      'Stale-while-revalidate caching (React Query) to show last-known-good data during flakiness',
      'Can articulate BFF vs client orchestration and when the aggregation layer earns its cost',
    ],
    followUp: 'The failing API is the one that provides the user context the other five depend on. Now what?',
    redFlags: [
      'Promise.all with no error handling, so one rejection blanks the entire dashboard',
      'A single page-level spinner and a single page-level error state',
      'No timeout story — assumes fetch will fail fast on its own',
    ],
    topicId: 'data-fetching-patterns',
  },
  {
    id: 're-sc-2',
    level: 'technical',
    difficulty: 'senior',
    category: 'debugging',
    question:
      'The backend ships a breaking API change and users with the web app already open start seeing crashes. How do you make the client resilient to API changes?',
    modelAnswer:
      'The root cause is a brittle client: it assumes the response shape is exactly what it was at build time, and a long-lived SPA tab can run days-old JavaScript against a new API. The immediate mitigation is defensive parsing at the boundary — validate every response with zod, be a tolerant reader that ignores unknown fields, and turn a shape mismatch into a handled degraded state instead of an uncaught TypeError deep in a component. Structurally, the client should pin the API version it was built against (a version header or versioned path) so the server can keep serving the old contract, and feature flags let you ship the new-codepath client dark and flip it when the backend is ready. For the stale-tab problem specifically, the app should detect that a newer build exists — poll a version endpoint or compare a build hash — and prompt or force a refresh rather than letting week-old code limp along. The trade-off is real cost: tolerant parsing and dual codepaths add code and can mask genuine contract bugs, so validation failures must be reported to monitoring, not silently swallowed.',
    keyPoints: [
      'Runtime validation at the API boundary (zod) — a schema mismatch becomes a handled state, not a crash',
      'Tolerant reader: ignore unknown fields, never assume exhaustive shapes',
      'API version pinning plus feature flags to migrate codepaths safely',
      'Stale-tab strategy: detect new build at runtime and prompt/force refresh; report parse failures to monitoring',
    ],
    followUp: 'How do you roll out a client that must work against both the old and new API versions during the migration window?',
    redFlags: [
      'Blames the backend and proposes no client-side defense',
      'Casts API responses with as SomeType and calls TypeScript the safety net',
      'Silently swallows validation errors so contract drift goes unnoticed',
    ],
    topicId: 'fetch-caching',
  },
  {
    id: 're-sc-3',
    level: 'technical',
    difficulty: 'mid',
    category: 'debugging',
    question:
      'After every deploy, users report seeing the old version of the site — or a broken mix of old and new. What is going on and how do you fix caching for a SPA?',
    modelAnswer:
      'The root cause is a caching strategy that is inverted or missing: either index.html is being cached so browsers keep loading the old entry point, or old hashed chunks were deleted on deploy so an old index.html requests JS files that no longer exist. The correct split is that content-hashed assets (app.3f9a2c.js) are immutable and get cache-control immutable with a max-age of a year, while index.html gets no-cache so every navigation revalidates and picks up the new hashes; keep the previous build\'s chunks available for a while so in-flight old tabs do not 404 on lazy-loaded routes. If a service worker is involved it is often the real culprit — a precached shell serves stale HTML until the new worker activates, so you need an update flow (skipWaiting plus a user-facing "new version available" prompt) rather than hoping. Operationally, purge or invalidate the CDN for index.html on deploy, and have the running app detect a newer build (version endpoint or chunk-load failure handler) and prompt a reload. The trade-off is between forcing refreshes aggressively — which can interrupt users mid-task — and tolerating a window of staleness; most teams prompt rather than force.',
    keyPoints: [
      'Split strategy: immutable long max-age for hashed assets, no-cache for index.html',
      'Keep old chunks deployed briefly so open tabs do not 404 on lazy routes',
      'Service worker update pitfalls: stale precached shell, skipWaiting + update prompt',
      'CDN purge for the HTML on deploy; runtime new-build detection with a reload prompt',
    ],
    followUp: 'A user has the app open mid-checkout when you deploy. What should their experience be?',
    redFlags: [
      'Answers only "tell users to hard-refresh / clear cache"',
      'Sets one blanket cache policy for HTML and hashed assets alike',
    ],
    topicId: 'deployment-production',
  },
  {
    id: 're-sc-4',
    level: 'technical',
    difficulty: 'mid',
    category: 'debugging',
    question:
      'A user double-clicks the "Submit order" button and two orders show up on their account. What do you fix on the client, and is that enough?',
    modelAnswer:
      'The root cause is that the mutation is not guarded: two clicks fire two POSTs, and the network happily delivers both. The immediate client fix is single-flight submission — disable the button and gate the handler on the mutation\'s pending state (isPending from React Query or equivalent) so a second click while one is in flight is a no-op, with the UI showing a clear submitting state. The robust approach adds an idempotency key: the client generates a unique key (UUID) when the order form is ready, sends it in a header with the request, and reuses the same key on retry — so even a retried or duplicated request resolves to one order server-side. If you render the order optimistically, a failure must roll the optimistic entry back and offer retry with that same key. The essential caveat is that client-side guards alone are insufficient — a laggy UI, a retried request, or a hostile client can always double-submit, so the server must enforce idempotency; the button-disable is UX polish on top of a server guarantee, not a substitute for it.',
    keyPoints: [
      'Single-flight mutation: disable during pending state, driven by mutation state not a hand-rolled flag',
      'Client-generated idempotency key sent with the request and reused across retries',
      'Optimistic update paired with rollback on failure',
      'States explicitly that the server must enforce idempotency — the client alone cannot',
    ],
    followUp: 'The request times out and you do not know whether the order was created. What does the client do next?',
    redFlags: [
      'Stops at "disable the button" with no idempotency or retry story',
      'Believes the client-side guard alone fully solves duplicate orders',
    ],
    topicId: 'data-fetching-patterns',
  },
]
