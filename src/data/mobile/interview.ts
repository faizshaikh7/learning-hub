import type { InterviewBank } from '@/types'

/** Mobile Development interview bank: roles + 3-round, framework-agnostic question set. */
export const MOBILE_INTERVIEW: InterviewBank = {
  roles: [
    {
      id: 'mobile-generalist',
      title: 'Mobile Engineer (Generalist)',
      seniority: 'Junior → Senior',
      icon: '📱',
      description:
        'Ships and maintains a production app end to end, regardless of the framework in play. Owns the app lifecycle, UI rendering, local persistence, networking, and release — the person who understands how a phone actually runs an app rather than one specific SDK.',
      focus: ['App & screen lifecycle', 'UI rendering & jank', 'Local storage & offline', 'Networking & error handling', 'Release & app size'],
      demandNote: 'The most hirable mobile profile — teams want engineers whose knowledge transfers when they switch from one framework to the next.',
    },
    {
      id: 'android-engineer',
      title: 'Android Engineer',
      seniority: 'Mid → Senior',
      icon: '🤖',
      description:
        'Builds Android apps and lives inside the platform: Activity/Fragment lifecycle, the Android process model, background execution limits, and the ART runtime with its tracing garbage collector. Judged on handling the fragmentation, memory pressure, and aggressive process death that define the platform.',
      focus: ['Activity/process lifecycle', 'ART & garbage collection', 'Background limits (Doze, WorkManager)', 'Jetpack & Compose rendering', 'Keystore & app signing'],
      demandNote: 'Deep, steady demand — Android is the majority of the global install base, and platform depth commands strong senior comp.',
    },
    {
      id: 'ios-engineer',
      title: 'iOS Engineer',
      seniority: 'Mid → Senior',
      icon: '🍎',
      description:
        'Builds iOS apps on a tighter, more opinionated platform: the app state machine, ARC-based memory management with retain cycles, and strict background execution windows. Judged on smooth 120Hz rendering, correct memory ownership, and shipping through App Store review.',
      focus: ['App state machine', 'ARC & retain cycles', 'Background modes & BGTaskScheduler', 'SwiftUI/UIKit rendering', 'Keychain & code signing'],
      demandNote: 'Premium comp per capita — a smaller talent pool and high-value iOS users make strong iOS engineers hard to hire.',
    },
    {
      id: 'cross-platform-engineer',
      title: 'Cross-Platform Engineer (Flutter / React Native)',
      seniority: 'Mid → Senior',
      icon: '🔀',
      description:
        'Delivers one codebase to both stores using Flutter or React Native. Owns the bridge between framework and native platform, the extra rendering layer, and the platform-specific gaps that any cross-platform stack eventually hits. Must reason about both the framework AND the native OS underneath it.',
      focus: ['Framework-to-native bridging', 'Rendering pipeline & jank', 'Platform channels & native modules', 'Shared vs platform-specific code', 'Bundle size & startup cost'],
      demandNote: 'Fast-growing at startups and product teams optimizing for velocity — one team shipping two platforms is a strong business case.',
    },
    {
      id: 'mobile-architect',
      title: 'Mobile Architect',
      seniority: 'Senior → Staff',
      icon: '🏛️',
      description:
        'Sets the technical direction for a mobile org: framework choice, offline and sync strategy, modularization, release process, and performance budgets across many teams. Interviews go deep on tradeoffs — native vs cross-platform, offline-first vs online-only, and how to keep startup time and app size in check at scale.',
      focus: ['Framework & platform strategy', 'Offline-first architecture & sync', 'Modularization & build scaling', 'Release, rollout & signing strategy', 'Performance budgets (startup, size, jank)'],
      demandNote: 'Scarce and highly paid — few engineers can defend framework and offline decisions across a whole mobile org.',
    },
  ],

  questions: [
    // ── Round 1: Phone Screen (fundamentals, breadth) ──────────────────────────
    {
      id: 'mob-s1',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'Walk me through what happens to an app when the user presses Home and later reopens it. Why does the lifecycle matter?',
      modelAnswer:
        'Pressing Home does not kill the app — it moves to the background. The OS sends a lifecycle callback (onPause/onStop on Android, sceneWillResignActive/didEnterBackground on iOS) that is your signal to pause work: stop animations, release the camera, save any unsaved UI state. The process then sits in the background and can be killed by the OS at any time under memory pressure, without any further callback. When the user returns, either the process is still alive and you get a resume callback, or it was killed and the app cold-starts and must restore state from what you persisted. The lifecycle matters because the OS, not your app, controls the process — anything you did not save before backgrounding can be gone when you come back.',
      keyPoints: [
        'Home backgrounds the app; it is not killed immediately',
        'Save state on the background callback because a background kill gives no warning',
        'On return: either resume the live process or cold-start and restore persisted state',
      ],
      followUp: 'Where exactly should you save transient UI state, and where should you save durable user data?',
      topicId: 'app-lifecycle',
    },
    {
      id: 'mob-s2',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'What does it mean for an app to feel "janky", and what frame budget are you working against?',
      modelAnswer:
        'Jank is any visible stutter or dropped frame during animation or scrolling. At 60Hz the display asks for a new frame every ~16.7ms, so all layout, drawing, and paint for that frame must finish inside that budget; at 120Hz it drops to ~8.3ms. If your work on the UI thread overruns the budget, the display shows the previous frame again — a dropped frame the user perceives as a hitch. The root cause is almost always doing too much on the main/UI thread: parsing JSON, decoding a large bitmap, a synchronous disk or network read, or an over-complex view hierarchy that is expensive to lay out. The fix is to keep the UI thread free — move heavy work to background threads and only touch the UI to apply the finished result.',
      keyPoints: [
        'Jank = missed frame deadline: ~16.7ms at 60Hz, ~8.3ms at 120Hz',
        'Cause is heavy work on the main/UI thread blocking the frame',
        'Fix: move parsing/IO/decoding off the UI thread; simplify the view tree',
      ],
      followUp: 'The UI thread is the only thread allowed to touch the UI. How do you do heavy work AND update the screen safely?',
      topicId: 'rendering-jank',
    },
    {
      id: 'mob-s3',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'Where would you store a user auth token, a list of cached articles, and a "dark mode" preference? Why different places?',
      modelAnswer:
        'Three different needs, three different stores. The auth token is a secret, so it goes in the platform secure store — the Keychain on iOS, the Keystore-backed EncryptedSharedPreferences or DataStore on Android — never in plain preferences or plain files. The dark-mode preference is a tiny non-secret key-value flag, so a lightweight key-value store fits: UserDefaults on iOS, SharedPreferences or DataStore on Android. The cached articles are structured, queryable, and can grow large, so they belong in a real database like SQLite (usually via Room or Core Data). The principle is match the store to the data: secrets go in hardware-backed secure storage, small flags in key-value, and structured or large collections in a database.',
      keyPoints: [
        'Secrets → Keychain / Keystore-backed encrypted store, never plain prefs',
        'Small non-secret flags → key-value (UserDefaults / SharedPreferences / DataStore)',
        'Structured, growing, queryable data → SQLite / Room / Core Data',
      ],
      followUp: 'Why is a JWT in plain SharedPreferences or UserDefaults a real risk on a rooted or jailbroken device?',
      topicId: 'local-storage',
    },
    {
      id: 'mob-s4',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'Your app needs to work on a subway with no signal. What does "offline-first" actually mean in practice?',
      modelAnswer:
        'Offline-first means the local store is the source of truth for the UI, and the network is a background sync mechanism rather than a prerequisite for the screen to render. In practice the UI always reads and writes to a local database, so it works instantly whether or not there is signal. Writes are recorded locally and queued as pending operations; when connectivity returns, a sync layer replays them to the server and pulls remote changes down. That forces you to handle the hard parts up front: assigning stable IDs on the client so records exist before the server sees them, tracking sync state per record, and resolving conflicts when the same data changed on two devices. The payoff is an app that feels instant and never shows a spinner-of-death just because the train went into a tunnel.',
      keyPoints: [
        'Local DB is the source of truth; network is background sync, not a gate',
        'Writes queue locally and replay on reconnect; client generates stable IDs',
        'Must handle sync state per record and conflict resolution',
      ],
      followUp: 'Two devices edit the same note offline. When both come online, how do you decide the winner?',
      topicId: 'offline-sync',
    },
    {
      id: 'mob-s5',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'A user says "the app is huge, it took forever to download." What contributes to app size, and why do you care beyond the download?',
      modelAnswer:
        'App size is the sum of compiled code, bundled assets (images, fonts, video), embedded libraries, and for cross-platform apps the framework runtime itself. You care beyond the one-time download because size correlates with install abandonment — above certain store thresholds users on cellular are warned or blocked — and larger binaries mean more to load and map into memory at startup, which hurts launch time. Concretely you shrink it by removing unused code and resources (R8/ProGuard shrinking on Android, dead-code stripping on iOS), compressing and right-sizing images, and shipping per-device slices instead of one universal binary. That last point is why Android App Bundles and iOS app thinning exist: the store delivers only the code and resources a given device needs.',
      keyPoints: [
        'Size = code + assets + libraries + (cross-platform) framework runtime',
        'Bigger size → install abandonment and slower startup, not just a long download',
        'Levers: code/resource shrinking, image compression, per-device delivery (AAB / app thinning)',
      ],
      followUp: 'How does an Android App Bundle deliver a smaller install than a universal APK?',
      topicId: 'app-size-startup',
    },
    {
      id: 'mob-s6',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'What is the difference between the UI thread and background threads on mobile, and what is the one hard rule?',
      modelAnswer:
        'Every mobile app has a single main thread — the UI thread — that owns the event loop, processes touch input, and is the only thread allowed to read or mutate UI objects. The hard rule follows directly: never do slow work on the UI thread, and never touch UI from a background thread. Slow work (network calls, disk IO, JSON parsing, image decoding) goes to background threads or a concurrency primitive — coroutines and Dispatchers on Android, async/await and GCD queues on iOS, isolates or the JS event loop on cross-platform frameworks. When the background work finishes, you hop back to the main thread to apply the result to the UI. Break the rule and you get one of two failures: freezing the UI thread triggers an Application Not Responding dialog or a watchdog kill, and mutating UI off the main thread causes crashes or corrupted rendering.',
      keyPoints: [
        'One UI/main thread owns the event loop and is the only thread that may touch UI',
        'Hard rule: heavy work off the UI thread, UI updates only on the UI thread',
        'Violations: frozen UI thread → ANR/watchdog kill; off-thread UI access → crashes',
      ],
      followUp: 'How does an ANR (Android) or the iOS watchdog decide your app is unresponsive?',
      topicId: 'threading-concurrency',
    },

    // ── Round 2: Technical Deep Dive (depth, problem-solving) ──────────────────
    {
      id: 'mob-t1',
      level: 'technical',
      difficulty: 'senior',
      category: 'concept',
      question: 'Compare how iOS and Android manage memory. What is a retain cycle, and how does a tracing GC differ from reference counting?',
      modelAnswer:
        'iOS uses ARC — automatic reference counting — where each object keeps a count of strong references and is deallocated deterministically the instant that count hits zero. Android/ART uses a tracing garbage collector that periodically walks the object graph from roots and reclaims anything unreachable, so collection is non-deterministic and can introduce pauses. ARC has no runtime collector overhead but is vulnerable to retain cycles: if object A strongly holds B and B strongly holds A, their counts never reach zero and both leak — the classic fix is making one reference weak or unowned, which is why closures capturing self need a weak capture list. A tracing GC handles cycles for free because it reasons about reachability, not counts, but it pays for that with GC pauses that, if they land mid-frame, cause jank, plus memory churn from short-lived allocations. Both models still leak in the same higher-level way: a live long-lived object holding a reference it should have dropped, like a static registry pinning a screen or a never-removed listener.',
      keyPoints: [
        'ARC = deterministic, count-to-zero frees immediately; tracing GC = periodic reachability sweep, non-deterministic',
        'Retain cycle: mutual strong references never reach zero; fix with weak/unowned',
        'GC handles cycles automatically but risks pause-induced jank and churn',
        'Both leak via long-lived objects holding references they should release (static refs, unremoved listeners)',
      ],
      followUp: 'A GC pause drops a frame during a scroll. What can you change to reduce collection pressure?',
      redFlags: ['Thinks a garbage collector makes memory leaks impossible'],
      topicId: 'memory-management',
    },
    {
      id: 'mob-t2',
      level: 'technical',
      difficulty: 'mid',
      category: 'debugging',
      question: 'A list scrolls smoothly on your flagship test phone but stutters badly on a mid-range device. How do you diagnose and fix it?',
      modelAnswer:
        'First reproduce with data: profile on the slow device with the frame/GPU profiler (Android Studio profiler or Perfetto, Instruments Core Animation on iOS) to see which frames blow the budget and why — is it long CPU work, GPU overdraw, or GC pauses. The usual culprits in a list: doing work per-row that should be cached (decoding or resizing full images inline instead of loading right-sized thumbnails off-thread), a deep or overlapping view hierarchy causing overdraw, synchronous IO or JSON parsing during binding, and allocating objects on every bind which feeds GC pressure. Fixes: make sure the list recycles/reuses views (RecyclerView, lazy lists, FlatList windowing) rather than inflating fresh ones, move image decode and any parsing off the UI thread with proper caching, flatten the layout to cut overdraw, and hoist allocations out of the hot bind path. The meta-point is that the flagship masks the problem with raw headroom — you must profile on representative low-end hardware, because that is what most of your users actually hold.',
      keyPoints: [
        'Profile on the SLOW device first; measure which frames miss and why (CPU vs overdraw vs GC)',
        'Recycle/reuse rows; never inflate a fresh view per item',
        'Move image decode/parse off the UI thread with right-sized assets and caching',
        'Flatten hierarchy to cut overdraw; hoist per-bind allocations to reduce GC pressure',
      ],
      followUp: 'Why does view recycling specifically cause the "wrong image flashing in the wrong row" bug, and how do you prevent it?',
      topicId: 'rendering-jank',
    },
    {
      id: 'mob-t3',
      level: 'technical',
      difficulty: 'senior',
      category: 'concept',
      question: 'The OS killed your app in the background while a photo upload was in progress. How do modern platforms want you to do deferrable background work?',
      modelAnswer:
        'The mental model shift is that you do not own the background — the OS reclaims it aggressively to save battery (Android Doze and background execution limits, iOS suspends apps within seconds of backgrounding). So you never run a long task on a thread you spawned and hope it survives; you hand a durable, deferrable job to the platform scheduler and let it choose when to run it. On Android that is WorkManager: you enqueue work with constraints (network available, charging, unmetered) and it persists across process death and reboots, retrying with backoff. On iOS you register a BGProcessingTask or BGAppRefreshTask and the system runs it in a granted window based on usage and power. For genuinely user-visible ongoing work you use the escalated primitives — a foreground service with a notification on Android, or a background upload/download URLSession task on iOS that the system continues even if your app is suspended. The wrong answer is a bare background thread or a timer, which the OS will kill.',
      keyPoints: [
        'You do not control the background; the OS suspends/kills to save battery (Doze, iOS suspension)',
        'Hand durable, deferrable work to the scheduler: WorkManager / BGTaskScheduler with constraints',
        'Work must survive process death and retry with backoff',
        'User-visible ongoing work needs foreground service / background URLSession, not a raw thread',
      ],
      followUp: 'When is a foreground service (Android) or background URLSession (iOS) justified over a deferrable job?',
      redFlags: ['Proposes a plain background thread or repeating timer and assumes it keeps running'],
      topicId: 'background-execution',
    },
    {
      id: 'mob-t4',
      level: 'technical',
      difficulty: 'mid',
      category: 'tradeoff',
      question: 'Two devices edited the same record offline. Walk me through conflict resolution strategies and their tradeoffs.',
      modelAnswer:
        'There is no free lunch — you are picking who loses data and when. Last-write-wins is simplest: attach a timestamp or version and the latest write overwrites, but it silently discards the other edit and depends on trustworthy clocks, which phones do not have. Version vectors or a server-assigned version let you detect a true conflict (both edited since the last common version) rather than blindly overwriting, and then you choose a policy: auto-merge at the field level when edits touched different fields, or surface the conflict to the user to resolve when they touched the same field. CRDTs go further, structuring the data so concurrent edits merge deterministically without a central arbiter — powerful for collaborative text or counters, but they add complexity and storage overhead and do not fit every data shape. The right answer depends on the domain: a settings toggle can be last-write-wins, a shopping cart wants field or item-level merge, and collaborative documents justify CRDTs. Always design the merge before you build the sync, because retrofitting it is painful.',
      keyPoints: [
        'Last-write-wins is simple but loses data and trusts unreliable device clocks',
        'Version vectors detect real conflicts vs blind overwrite; then auto-merge or ask the user',
        'CRDTs merge concurrent edits deterministically but add real complexity/overhead',
        'Choose per data shape: toggles → LWW, carts → item merge, docs → CRDT',
      ],
      followUp: 'Why are wall-clock timestamps a fragile basis for last-write-wins across devices?',
      topicId: 'offline-sync',
    },
    {
      id: 'mob-t5',
      level: 'technical',
      difficulty: 'senior',
      category: 'concept',
      question: 'How do you store a secret and authenticate a sensitive action on a device you fundamentally do not trust?',
      modelAnswer:
        'Start from the threat model: a device can be rooted or jailbroken, so anything you write to normal storage or bundle in the binary is readable by an attacker. Secrets therefore go into hardware-backed secure storage — the iOS Keychain and the Android Keystore — where the private key material is generated and held inside a secure element or TEE and never leaves it; your app can ask the hardware to sign or decrypt but cannot extract the key. You bind sensitive keys to user presence with biometric authentication (Face ID / Touch ID / BiometricPrompt), so using the key requires a fresh local auth, and the key can be invalidated if biometrics change. Critically, biometric and client-side checks are a UX and key-gating layer, not a security boundary you can trust alone — the server must still authorize every sensitive action, because a jailbroken client can bypass any check you run locally. And you never hardcode API secrets in the app: a determined attacker will extract them from the binary, so treat the client as public and keep real authority on the server.',
      keyPoints: [
        'Threat model: rooted/jailbroken device means local storage and the binary are readable',
        'Secrets in hardware-backed Keychain/Keystore; keys never leave the secure element',
        'Biometrics gate key use but are a client-side layer — the server must authorize sensitive actions',
        'Never hardcode secrets in the app; treat the client as untrusted/public',
      ],
      followUp: 'Why does moving the security decision to the server not remove the value of the Keystore/Keychain?',
      redFlags: ['Treats a biometric or client-side check as sufficient authorization for a sensitive action'],
      topicId: 'mobile-security',
    },
    {
      id: 'mob-t6',
      level: 'technical',
      difficulty: 'mid',
      category: 'concept',
      question: 'Contrast imperative UI (manually mutating views) with declarative UI (describing state). What actually changes in your mental model?',
      modelAnswer:
        'In the imperative model — classic UIKit or Android Views — you hold references to view objects and mutate them by hand in response to events: set this label text, hide that spinner, add a row. You own the transitions between states, and the common bug is the UI drifting out of sync with the data because you forgot to update one view on one code path. In the declarative model — SwiftUI, Jetpack Compose, React Native — you write a pure function from state to UI: given this state, here is what the screen looks like, and when state changes the framework diffs and re-renders only what differs. You stop thinking about transitions and start thinking about states; the framework owns making the screen match. The tradeoff is you must think in terms of a single source of truth and immutable state flowing down, and you have to understand recomposition/re-render cost so you do not rebuild the world on every tiny change. Declarative removes a whole class of "forgot to update the view" bugs but introduces "why is this recomposing too often" as the new performance concern.',
      keyPoints: [
        'Imperative: hold view refs and mutate them; you own state transitions and can desync UI from data',
        'Declarative: pure state → UI function; framework diffs and re-renders the delta',
        'Shift from thinking in transitions to thinking in states with a single source of truth',
        'New concern becomes recomposition/re-render cost, not forgotten updates',
      ],
      followUp: 'In a declarative framework, what causes an unnecessary re-render and how do you scope it down?',
      topicId: 'ui-rendering-models',
    },

    // ── Round 3: System Design / Senior (architecture, tradeoffs) ──────────────
    {
      id: 'mob-d1',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['mobile-generalist', 'cross-platform-engineer', 'mobile-architect'],
      question: 'Your company wants one app on both iOS and Android. Make the native-vs-cross-platform decision and defend it.',
      modelAnswer:
        'I frame it as a business-constraints decision, not a religious one. Native (Swift/Kotlin) wins when the app leans hard on platform capabilities and feel — heavy camera/AR, tight OS integration, bleeding-edge widgets, or a large existing native team — and you can staff two codebases. Cross-platform (Flutter or React Native) wins when the app is mostly product surface (feeds, forms, commerce), time-to-market and a single team matter, and you accept a thin bridge to native for the few device features you need. Then I separate the two cross-platform options: Flutter renders its own UI with its own engine, giving pixel-consistent results and strong performance at the cost of a larger runtime and a non-JS language; React Native leans on native components and the JS ecosystem, which is great for web-adjacent teams but historically pays a bridge tax on chatty native interop. I would also name the escape hatch: every serious cross-platform app still writes native modules for the hard 10 percent, so the real question is what fraction of the app needs native and whether one team shipping both platforms outweighs the peak fidelity of two native teams. Concretely: a fintech dashboard, cross-platform; a pro camera app, native.',
      keyPoints: [
        'Decide from business constraints: team size, time-to-market, how platform-heavy the app is',
        'Native for deep platform/feel-critical apps; cross-platform for product-surface apps with velocity pressure',
        'Flutter (own rendering engine, consistent, bigger runtime) vs React Native (native components + JS ecosystem, bridge cost)',
        'Every cross-platform app still needs native modules for the hard part — size that fraction honestly',
      ],
      followUp: 'Six months in, one platform needs a feature the framework cannot express. How is your architecture prepared for that?',
      topicId: 'framework-strategy',
    },
    {
      id: 'mob-d2',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['mobile-generalist', 'mobile-architect', 'android-engineer', 'ios-engineer'],
      question: 'Design the offline and sync architecture for a note-taking app used across phone, tablet, and web. Walk me through it.',
      modelAnswer:
        'The core decision is offline-first: the local database is the source of truth and the UI only ever reads and writes locally, so it is instant and works with no signal. Each note gets a client-generated stable ID (a UUID) at creation so it exists before the server ever sees it, plus per-record sync metadata — a dirty flag, a last-synced version, and updatedAt. A sync engine runs on connectivity changes and on a schedule: it pushes dirty records, pulls changes since the last sync cursor, and reconciles. For conflicts I would not use naive last-write-wins on wall-clock time; I would carry a server-assigned version to detect genuine conflicts and merge at the field level where edits are disjoint, escalating to a user-visible resolution or a CRDT-backed body for the note text itself where concurrent editing is common. The server exposes a delta/changes endpoint keyed by a cursor so clients pull only what changed, and push notifications (FCM/APNs) nudge idle clients to sync so edits propagate quickly. I would make sync idempotent and resumable — replaying a partially-applied batch must be safe — and monitor sync failure and conflict rates as first-class metrics, because sync bugs silently lose user data.',
      keyPoints: [
        'Offline-first: local DB is source of truth; UI never blocks on the network',
        'Client-generated stable IDs plus per-record sync metadata (dirty flag, version, updatedAt)',
        'Delta/cursor-based pull; conflict detection via server version, field merge or CRDT for note body',
        'Push (FCM/APNs) to trigger sync; make sync idempotent, resumable, and monitored',
      ],
      followUp: 'The web client and phone both edited the same note body while the phone was offline for a day. Trace exactly what your engine does on reconnect.',
      topicId: 'offline-sync',
    },
    {
      id: 'mob-d3',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['mobile-generalist', 'mobile-architect', 'cross-platform-engineer'],
      question: 'Users complain the app is slow to open. Design an approach to diagnose and improve cold start.',
      modelAnswer:
        'First define terms and measure. Cold start is launching with no process alive — the OS forks a process, loads and links the binary, initializes the runtime, then your code runs and builds the first frame; warm start reuses a live process with fresh UI; hot start just brings an existing UI back to the foreground. So the complaint is almost always cold start, and I measure it with the platform metric (Android time-to-initial-display / fully-drawn, iOS launch metrics in MetricKit/Instruments) on real low-end devices, not a flagship. The usual offenders are all things done eagerly at launch: heavy initialization in Application/AppDelegate startup, synchronously constructing SDKs and analytics and DI graphs before the first frame, reading large files or a slow migration on the main thread, and for cross-platform apps loading a big JS bundle or engine. The fixes are to do as little as possible before first frame: lazy-initialize everything not needed to draw, defer third-party SDK init to after first frame or to a background thread, show a real first screen fast (even skeleton UI) instead of a blocking splash, and shrink the binary/bundle since more to map is more to load. Then I set a startup budget and add a regression guard in CI so a new SDK cannot quietly add 400ms next quarter.',
      keyPoints: [
        'Distinguish cold / warm / hot start; the complaint is cold start — measure it on low-end devices',
        'Find eager launch work: SDK/analytics/DI init, main-thread IO or migrations, large JS bundle',
        'Fix by deferring everything not needed for first frame; lazy init; draw a skeleton fast',
        'Set a startup budget and guard it in CI against regressions',
      ],
      followUp: 'Why is showing a skeleton screen quickly better for perceived performance than a correct-but-later full screen?',
      topicId: 'app-size-startup',
    },
    {
      id: 'mob-d4',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['mobile-generalist', 'mobile-architect', 'android-engineer', 'ios-engineer'],
      question: 'Design a safe release and rollout process for a mobile app. What is different from shipping a web service?',
      modelAnswer:
        'The defining constraint is that mobile releases are not instant and not fully in your control: builds go through store review, users update on their own schedule, and you cannot force everyone forward — so old versions live in the wild for months and you can never assume everyone is on latest. That shapes everything. Builds are signed with keys you must protect: an Android upload/app-signing key and an iOS signing certificate plus provisioning profile — lose or leak these and you cannot ship updates, so they live in secure CI storage, never on a laptop. I would ship via staged rollout — release to 1 percent, then 5, 10, 50, 100, watching crash-free rate and key metrics at each gate, with the store halt-rollout as the emergency brake since you cannot instantly recall a bad build. To decouple release from launch I gate risky features behind server-controlled feature flags so I can turn a feature off without a new build, and I keep a kill switch for anything dangerous. Because clients lag, the backend must stay backward compatible with old app versions and I enforce a minimum-supported-version with a forced-update path for security-critical fixes. And I watch post-release crash and ANR dashboards (Crashlytics/Sentry) as the real signal, because unlike a web deploy I cannot just roll back the servers and be done.',
      keyPoints: [
        'Releases are slow and not universal: store review, user-controlled updates, many old versions live for months',
        'Protect signing keys (Android app-signing key, iOS cert + provisioning) in secure CI, never on laptops',
        'Staged rollout gated on crash-free rate; feature flags and kill switches decouple release from launch',
        'Backend stays backward compatible; enforce min-supported-version + forced update for security fixes',
      ],
      followUp: 'A crash spikes at 20% rollout. Exactly what levers do you pull, and in what order?',
      redFlags: [
        'Assumes you can instantly roll back a mobile release like a web deploy',
        'Keeps signing keys on a developer machine or in the repo',
      ],
      topicId: 'release-signing',
    },
  ],
}
