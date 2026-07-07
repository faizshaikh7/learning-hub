import type { CaseStudy } from '@/types'

/** Real-world mobile engineering case studies for the concept-first Mobile Development course. */
export const MOBILE_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'instagram-feed-image-pipeline',
    company: 'Instagram',
    logo: '📸',
    title: 'Scrolling a Billion-Image Feed at 60fps: Instagram’s Image Pipeline and the War on Jank',
    industry: 'Social / Media',
    scale: 'Billions of users · image-dense infinite feed · target 60fps on a huge range of devices',
    problem:
      'Instagram’s core experience is an infinite, image-heavy feed that must scroll perfectly smoothly on everything from flagship phones to cheap devices with 1-2GB of RAM on slow networks. Images are the worst-case mobile workload: they are large to download (bandwidth and battery), expensive to decode on the CPU, and enormous in memory once decoded — a single full-resolution photo can expand to tens of megabytes of bitmap. Multiply that across a fast-scrolling feed and the naive approach either drops frames constantly or triggers out-of-memory kills.\n\nThe frame budget makes this brutal: at 60Hz the app has about 16.7ms per frame for everything — layout, binding the row, and the GPU’s work. If a row that scrolls into view synchronously decodes an image, allocates large buffers, or lays out a deep view tree, that single frame blows the budget and the user sees a visible hitch. And because the feed is effectively endless, any per-row inefficiency is paid thousands of times per session, so death is by a thousand small stalls rather than one big freeze.',
    solution:
      'The foundation is list virtualization plus view recycling: only a screenful of cells (plus a small buffer) ever exist, and cells are reused as they scroll, with only their data re-bound — never the full view structure rebuilt. That keeps a small, fixed pool of views regardless of feed length, avoiding the memory blowup and constant allocation that would otherwise wreck both memory and the frame budget.\n\nOn top of that sits a disciplined image pipeline. Images are requested in the size the cell will display, and the server delivers appropriately sized variants (thumbnails vs full) so the client never downloads or decodes far more pixels than it will show — downsampling to the target dimensions cuts decode time and bitmap memory dramatically (halving dimensions quarters the memory). Decoding happens off the main thread; only the finished bitmap is handed back to the UI thread to display. A two-tier cache — an in-memory cache for images currently and recently on screen, backed by a disk cache that survives restarts — means scrolling back is instant and repeat launches avoid re-downloading. Crucially, every image request is bound to its cell and cancelled when that cell is recycled, so a slow response for a row that has scrolled away neither wastes bandwidth nor flashes the wrong photo into a reused cell.\n\nBeyond images, the team pushed all non-trivial work off the scroll path: prefetching upcoming cells’ data and images before they appear, preparing/measuring content ahead of time, and keeping the per-row bind step down to near-constant, allocation-free work. The guiding metric was not average FPS but frame-time consistency — because users perceive the single worst frame during a scroll, not the average — so the effort concentrated on eliminating the occasional 40ms spike, not nudging an already-fine average.',
    architecture:
      'The architecture is a layered pipeline: a virtualized list feeds a request layer that dedupes and prioritizes image loads, which sits atop a two-level cache (memory → disk → network). Each layer respects the mobile constraints it is closest to — the list layer respects the frame budget, the image layer respects memory and battery, the cache layer respects offline and repeat-visit performance.\n\nA key architectural principle is that expensive, unpredictable work (network, decode, layout of complex content) is moved off the critical rendering path and off the main thread, then results are delivered back to the UI thread only when ready. This is the universal mobile pattern — compute anywhere, mutate UI only on the main thread — applied relentlessly to the one screen that dominates usage. Prefetching converts latency into background work done during idle scroll time so content is ready before the user reaches it.\n\nThe same shape appears in every high-performance feed (Facebook, Twitter/X, TikTok, Pinterest): virtualization for memory and layout cost, server-side image resizing plus client downsampling for decode and bandwidth, layered caching for offline and repeat performance, and per-cell request cancellation for correctness. The lesson generalizes beyond one framework — this is what "make a list smooth" means at the platform level, whether you build it in native UIKit/RecyclerView, React Native, or Flutter.',
    techStack: ['List virtualization / view recycling', 'Off-main-thread image decode', 'Server-side image resizing', 'Client-side downsampling', 'Two-tier memory + disk image cache', 'Request cancellation on cell recycle', 'Prefetching', 'Frame profilers (Systrace / Instruments)'],
    keyDecisions: [
      {
        decision: 'Virtualize the feed and recycle cells instead of instantiating a view per item',
        why: 'Materializing thousands of cells would exhaust memory and blow the layout budget, since only a screenful is ever visible. Recycling keeps a small fixed pool of views and only re-binds data, holding memory flat regardless of feed length.',
        tradeoffs: 'Recycling requires careful cell reuse and cancellation logic — bind steps must be cheap and stateless, and stale async results must be discarded, or you get wrong-image bugs and subtle state bleed between reused cells.',
      },
      {
        decision: 'Request/decode images at display size and cache them in two tiers',
        why: 'Decoding full-resolution images into small cells wastes memory proportional to pixel count and can OOM the app; downsampling plus memory+disk caching cuts decode time, bandwidth, and battery while making scroll-back and re-launch instant.',
        tradeoffs: 'Server-side resizing adds backend variants to generate and store, and a memory cache must be size-bounded and evict correctly under pressure or it becomes the very memory problem it was meant to solve.',
      },
      {
        decision: 'Bind image requests to cells and cancel on recycle',
        why: 'In a fast scroll, cells are reused within milliseconds; without cancellation a late response paints the wrong photo into a reused cell and wastes bandwidth. Tying request lifetime to the cell guarantees correctness and saves work.',
        tradeoffs: 'Adds lifecycle bookkeeping to every request and requires the image library to support cancellation cleanly; get it wrong and you either leak requests or cancel ones you actually still need.',
      },
    ],
    results: [
      'Sustained smooth scrolling on an infinite, image-dense feed across a wide device and network range',
      'Flat memory footprint regardless of how far the user scrolls, reducing OOM kills and background termination',
      'Instant scroll-back and faster repeat launches via layered memory/disk caching',
      'Eliminated wrong-image and flicker bugs by cancelling stale requests on cell recycle',
      'The virtualized-list + image-pipeline pattern became the template for every high-performance mobile feed',
    ],
    lessonsLearned: [
      'Optimize for worst-frame consistency, not average FPS — users perceive the single hitch, not the mean',
      'Never create a view per item in a long list; virtualization and recycling are non-negotiable',
      'Images are the classic mobile performance trap: download, decode, and bitmap memory must all be bounded',
      'Move network, decode, and heavy layout off the main thread and off the scroll path via prefetching',
      'Correctness in recycled UIs requires cancelling stale async work bound to reused cells',
    ],
    relevantTopics: ['list-virtualization', 'image-loading-caching', 'frame-budget-jank', 'frame-rendering-pipeline', 'main-ui-thread'],
    estimatedMins: 22,
  },
  {
    id: 'whatsapp-offline-first-messaging',
    company: 'WhatsApp',
    logo: '💬',
    title: 'Messages That Always Send: WhatsApp’s Offline-First Architecture and Sync Model',
    industry: 'Messaging / Communications',
    scale: '2B+ users · 100B+ messages/day · must work on flaky 2G/3G networks worldwide',
    problem:
      'WhatsApp’s promise is that messaging just works — even on a crowded 2G network, in a tunnel, or when the app was killed in the background five minutes ago. That collides head-on with mobile reality: the network is intermittent and high-latency, the OS can suspend or terminate the app at any moment, and a message send can succeed on the server while the response is lost to a dropped connection. A design that waits on the network before showing the user their own message, or that keeps send state only in memory, would feel broken constantly across the low-connectivity markets where WhatsApp is dominant.\n\nThe hard requirements are: a sent message must never be silently lost even if the app dies immediately after tapping send; the same message must never be delivered twice despite retries over a lossy link; and the conversation must feel instant regardless of network conditions. This is fundamentally an offline-first and distributed-state problem wearing the clothes of a chat app.',
    solution:
      'The core is offline-first: the local database is the source of truth the UI reads from and writes to, and the network is a background sync mechanism, not a gatekeeper. When the user sends a message, it is written to the local store and rendered immediately with a "pending" state (the single check mark), then handed to a durable outbox — a persistent queue of unsent operations. Because the outbox lives on disk, the message survives process death: if the OS kills the app the instant after send, a sync worker replays the outbox when the app or network returns. The UI feels instant because it never waits on the network to show the user their own action.\n\nReliable delivery over a flaky link is handled with retries plus idempotency. Each message carries a unique client-generated id, so if a send succeeds but the acknowledgement is lost and the client retries, the server recognizes the duplicate and does not deliver it twice. Retries use backoff so a struggling network is not hammered. Delivery and read state flow back as acknowledgements that update the local message (one check → two checks → blue), which is really a small distributed-state-machine per message reconciling client and server views. End-to-end encryption adds per-device key management on top, but the transport reliability model underneath is the classic outbox-plus-idempotent-retry pattern.\n\nSync across the account’s history and (later) multiple devices is designed to converge rather than assume a perfect connection: the client pulls what it missed while offline, merges it with local state deterministically, and resolves ordering so all participants eventually see a consistent conversation. The whole system is built to degrade gracefully — offline you still read history and compose messages; they simply flush when connectivity returns — which is exactly why it feels reliable on networks that are anything but.',
    architecture:
      'Architecturally, WhatsApp is a local-first application with the server as an eventually-consistent sync partner. The layers are: a local encrypted database (source of truth) → a durable outbox for pending writes → a sync/transport worker that flushes the outbox and pulls updates with retry and backoff → acknowledgement handling that advances each message’s state machine. The UI observes the local store reactively, so every state change (pending → sent → delivered → read) updates automatically without manual refresh.\n\nThe defining architectural decision is inverting the usual client-server relationship: instead of the UI calling the network and waiting, the UI touches only local state, and a separate background pipeline reconciles that state with the server. This decoupling is what makes the app resilient to suspension, process death, and connectivity loss — the network layer can fail and retry indefinitely without the user ever seeing a spinner or losing a message.\n\nThis is the same offline-first pattern behind reliable email clients, note apps, and collaborative tools: a local source of truth, optimistic local writes, a durable operation queue, idempotent sync, and eventual convergence. The mobile-specific pressure — aggressive process death and terrible networks — is precisely why messaging apps pioneered this architecture, and why "just retry the network call" is never sufficient on a phone.',
    techStack: ['Local database (source of truth)', 'Durable outbox / pending-operations queue', 'Client-generated message ids (idempotency)', 'Exponential backoff retries', 'Acknowledgement-driven state machine', 'Reactive UI over local store', 'End-to-end encryption / key management', 'Background sync worker'],
    keyDecisions: [
      {
        decision: 'Make the local store the source of truth and treat the network as background sync',
        why: 'On intermittent, high-latency networks, waiting on the server before showing the user their own message feels broken. Reading and writing locally makes the app instant and fully usable offline, with the network reconciling in the background.',
        tradeoffs: 'The client and server can temporarily diverge, so you must design deterministic merge/convergence and per-message state reconciliation — genuinely distributed-systems work that is harder than a simple request/response client.',
      },
      {
        decision: 'Persist unsent messages in a durable outbox before confirming send',
        why: 'The OS can kill the app immediately after the user taps send; an in-memory send would be lost. A disk-backed outbox survives process death and lets a worker replay it whenever connectivity returns, so messages are never silently dropped.',
        tradeoffs: 'You must manage queue lifecycle, ordering, retry limits, and surfacing permanently-failed sends, plus reconcile the outbox with server acknowledgements — more moving parts than a fire-and-forget POST.',
      },
      {
        decision: 'Attach a client-generated id to every message for idempotent delivery',
        why: 'Over a lossy link a send can succeed while its acknowledgement is lost, triggering a retry that would otherwise duplicate the message. A stable client id lets the server dedupe retries and deliver exactly once.',
        tradeoffs: 'Requires the server to track seen ids and the client to generate stable ones before send; it adds bookkeeping, but it is the only safe way to retry writes on an unreliable network.',
      },
    ],
    results: [
      'Messaging that feels instant and reliable even on 2G/3G and after aggressive background process death',
      'Messages are never silently lost — pending sends survive app kills and flush when connectivity returns',
      'Exactly-once delivery despite inevitable retries, via client-generated message ids',
      'Full offline usability: read history and compose messages with no connection, auto-syncing later',
      'The outbox + idempotent-retry + local-source-of-truth pattern became the reference design for mobile messaging',
    ],
    lessonsLearned: [
      'Offline-first is a UX win even when online: local reads/writes remove spinners and feel instant',
      'A durable outbox is what makes writes survive process death — in-memory send state is unsafe',
      'Retries are inevitable on mobile; idempotency keys/ids are what make them safe against duplicates',
      'Treat client and server as eventually-consistent replicas and design explicit convergence',
      'The network layer should be able to fail and retry forever without the user ever noticing',
    ],
    relevantTopics: ['offline-first', 'data-sync-conflict', 'flaky-network-design', 'local-databases', 'process-death-restoration'],
    estimatedMins: 24,
  },
  {
    id: 'banking-app-mobile-security',
    company: 'Mobile Banking (industry pattern)',
    logo: '🏦',
    title: 'Defending an App on a Hostile Device: Mobile Banking Security, Pinning, and Attestation',
    industry: 'FinTech / Banking',
    scale: 'Millions of users · high-value transactions · attacker often controls the device',
    problem:
      'A banking app faces the defining mobile security truth: the attacker frequently controls the device. It may be rooted or jailbroken (removing the OS sandbox), the binary can be decompiled and repackaged, functions can be hooked at runtime with tools like Frida, and network traffic can be intercepted with a man-in-the-middle proxy. Yet the app moves real money, so any weakness — a secret hidden in the binary, a client-side "is this transfer allowed" check, an unpinned TLS connection — is a direct path to fraud. The server cannot see the device, so it must decide how much to trust a client it fundamentally cannot verify from the outside.\n\nThe naive assumptions that work on a trusted server all fail here: you cannot safely store secrets on the device, you cannot trust client-side authorization, and you cannot assume TLS alone protects traffic when the device’s own trust store can be manipulated. The engineering problem is to raise the attacker’s cost across every surface while ensuring that the actual authorization of money movement is enforced somewhere the attacker cannot reach.',
    solution:
      'The architecture is defense in depth with a hard rule at its center: every security-critical decision is enforced server-side. Client-side checks (is the user premium, is the balance sufficient, is this action allowed) are UX conveniences only; the server independently authorizes every transaction, because a determined attacker can patch out any in-app check. This single principle neutralizes the entire class of "bypass the client" attacks.\n\nOn the transport layer, the app uses TLS with certificate pinning, hardcoding the expected server public key so that even a validly-signed certificate from a rogue or user-installed CA is rejected — defeating the MITM proxy interception that is trivial otherwise. Pinning is done against the public key (so certificate renewal does not brick the app) with backup pins and a remote-updatable pin set to avoid a self-inflicted outage. Secrets and tokens never live in plain storage or the binary; they live in the hardware-backed keystore (iOS Keychain, Android Keystore/StrongBox), where key material is non-exportable and access is gated behind device unlock and biometrics. Authentication uses short-lived access tokens plus refresh tokens with PKCE (since a mobile app is a public client that cannot keep a secret), so a leaked token expires quickly and sessions are revocable server-side.\n\nBecause a rooted device breaks the platform’s guarantees, the app adds root/jailbreak detection, code obfuscation, and anti-hooking checks to raise attacker cost — while accepting these are imperfect since they run on the very device they judge. The decisive layer is hardware attestation: Play Integrity / App Attest have secure hardware and platform servers cryptographically vouch for device and app integrity, and the bank’s server verifies that signed attestation before permitting sensitive actions. This moves the trust decision off the compromised client onto hardware and the server, which is far harder to forge than any in-app check.',
    architecture:
      'The security architecture is layered so no single bypass is catastrophic: secure storage (keystore) for secrets, pinned TLS for transport, obfuscation and root/hook detection to raise attacker cost, hardware attestation to establish device trust, and — as the backstop that must never be skipped — server-side authorization of every sensitive operation. Each layer is defeatable in isolation; together they make an attack expensive and contain the blast radius when one layer falls.\n\nThe organizing principle is that the client is untrusted by design. Instead of asking "how do we make the app tamper-proof" (impossible), the architecture asks "how do we make client compromise not equal money loss." The answer is to treat the app as an untrusted terminal: it can be inspected and modified, but it holds no exploitable secrets, its checks are advisory, and the authority to move money lives on servers that verify hardware-backed attestation and re-authorize every transaction.\n\nThis mirrors how the whole regulated-mobile industry (banking, payments, healthcare) approaches the problem, and it maps directly onto the OWASP Mobile Top 10 and MASVS: improper credential storage, insufficient transport security, and insufficient authorization are the top risks, and the fixes are exactly hardware-backed secure storage, pinned/validated TLS, and server-side authorization plus attestation.',
    techStack: ['TLS certificate/public-key pinning', 'Hardware-backed keystore (Keychain / Android Keystore / StrongBox)', 'OAuth/OIDC with PKCE + short-lived tokens', 'Play Integrity / App Attest attestation', 'Root/jailbreak detection', 'Code obfuscation / anti-hooking', 'Server-side authorization', 'Biometric-gated key access'],
    keyDecisions: [
      {
        decision: 'Enforce every security-critical decision on the server, never on the client',
        why: 'A determined attacker can decompile, patch, and re-sign the app or hook it at runtime, bypassing any client-side check. Only server-side authorization, which the attacker cannot reach, can safely gate money movement.',
        tradeoffs: 'Adds a network round-trip and server complexity to actions that might otherwise be validated locally, and requires designing every sensitive flow as a server-authorized operation — but it is the only defensible model.',
      },
      {
        decision: 'Pin the server public key and back it with attestation rather than trusting plain TLS',
        why: 'Plain TLS trusts the whole CA ecosystem, so a rogue or user-installed CA enables MITM interception. Public-key pinning rejects unexpected certs, and hardware attestation proves device/app integrity to the server, shifting trust off the compromised client.',
        tradeoffs: 'Pinning risks a self-inflicted outage if keys rotate without backup pins or remote updatability, and attestation can exclude legitimate rooted/custom-ROM users — so both need careful operational planning and graceful degradation.',
      },
      {
        decision: 'Store all secrets in the hardware keystore and never embed them in the binary',
        why: 'The binary ships to every device and can be decompiled or memory-dumped, so any hardcoded secret is effectively public. Hardware-backed keystores keep key material non-exportable and gate it behind device unlock/biometrics.',
        tradeoffs: 'Keystore APIs differ across platforms and versions and add complexity (key invalidation on biometric changes, secure-hardware availability), but plain storage of credentials is simply indefensible on an untrusted device.',
      },
    ],
    results: [
      'Client compromise (root, repackaging, hooking) no longer implies unauthorized money movement, because authorization lives server-side',
      'MITM traffic interception is defeated by public-key pinning even against user-installed/rogue CAs',
      'Credentials and tokens are non-exportable and biometric-gated in hardware, resistant to storage extraction',
      'Hardware attestation gives the server a strong, hard-to-forge signal of device and app integrity',
      'A layered defense contains the blast radius so any single bypassed control is not catastrophic',
    ],
    lessonsLearned: [
      'Assume the attacker owns the device — the mobile client is fundamentally untrusted',
      'Secrets cannot hide in an app binary; put them in hardware-backed secure storage',
      'Client-side security checks are UX only — authorization must be enforced server-side',
      'Certificate pinning stops MITM but needs backup pins and remote updatability to avoid outages',
      'Root detection and obfuscation raise cost but are imperfect; hardware attestation is the stronger signal',
    ],
    relevantTopics: ['mobile-threat-model', 'tls-cert-pinning', 'secure-storage-mobile', 'root-jailbreak-detection', 'owasp-mobile-top10', 'mobile-auth'],
    estimatedMins: 26,
  },
  {
    id: 'uber-background-location-battery',
    company: 'Uber (industry pattern)',
    logo: '🚗',
    title: 'Tracking a Trip Without Draining the Battery: Background Location at Scale',
    industry: 'Ride-hailing / Logistics',
    scale: 'Millions of concurrent trips · continuous location on driver and rider devices · strict battery and privacy limits',
    problem:
      'A ride-hailing app needs continuous, accurate location during an active trip — to match riders and drivers, show live position, and compute ETAs — while running mostly in the background on a device whose OS is actively trying to suspend it and preserve battery. This is a direct collision of three constraints. Continuous high-accuracy GPS is one of the single biggest battery drains on a phone. The OS aggressively limits background execution and, via Doze/App Nap and background-location restrictions, will throttle or kill location updates for a backgrounded app. And background location is the most privacy-sensitive permission there is, gated behind a separate "always allow" grant, ongoing OS indicators, and heavy store scrutiny.\n\nSo the engineering problem is: keep location flowing reliably during a trip even when the app is backgrounded and the OS wants to suspend it, without destroying battery life or violating the tightening privacy rules — and do it across thousands of device models with different power-management behavior.',
    solution:
      'The first move is to be honest with the OS about what is happening: during an active trip the app runs a foreground service on Android (with the required persistent notification declaring location use) and uses the appropriate background location mode on iOS. This is the sanctioned way to keep running while backgrounded — the persistent notification is the transparency price the OS demands, and it is exactly the right tool because trip tracking is genuinely ongoing, user-aware work rather than silent background activity. Outside an active trip, the app drops back to no or minimal location use, so the expensive capability is scoped tightly to when it is actually needed.\n\nBattery is managed by refusing to treat all location the same. The app requests only the accuracy the current situation requires — high-accuracy GPS during active navigation, coarser network-based location when precision does not matter — and tunes update frequency and distance filters so it does not burn fixes it will not use. Fixes are batched and uploaded efficiently rather than streamed one-by-one (each radio wakeup costs power), and updates stop the moment the trip ends. For location-triggered behavior that does not need continuous tracking — like detecting arrival at a pickup — geofencing offloads monitoring to low-power system hardware instead of the app polling GPS in a loop.\n\nOn privacy, the app requests background/"always" location only when a trip actually needs it, with clear in-context rationale, and degrades gracefully to "while using the app" where possible — because the OS increasingly offers approximate-only and one-time grants that the app must handle. The result is location that is reliable during trips, respectful of battery between them, and defensible under both OS policy and store review.',
    architecture:
      'The architecture scopes an expensive, restricted capability to a well-defined session. A trip is modeled as an explicit lifecycle: on trip start, elevate to a foreground service / background mode and begin high-accuracy updates; during the trip, adapt accuracy and frequency to context and batch uploads; on trip end, tear everything down. This session-scoping is the same lifecycle-symmetry discipline that governs sensors and observers — start work when it is needed, stop it the instant it is not — applied to the most battery- and privacy-sensitive resource on the device.\n\nThe core architectural insight is matching the mechanism to the work’s true nature. Ongoing, user-visible tracking uses foreground services/background modes (with their mandatory notification); occasional location-triggered events use geofencing offloaded to system hardware; and nothing runs continuously that does not have to. Battery, background limits, and privacy are treated as first-class design inputs, not afterthoughts, so the app cooperates with the OS’s power management instead of fighting it.\n\nThis pattern generalizes to any app doing sustained background sensing — fitness trackers, navigation, delivery and field-service apps: declare the ongoing work honestly to the OS, adapt sensor accuracy/frequency to context, batch network to amortize radio wakeups, offload to low-power system features (geofencing, significant-location-change, activity recognition) whenever continuous sensing is not truly required, and request the least-privileged, coarsest permission that still does the job.',
    techStack: ['Foreground service (Android) / background location modes (iOS)', 'Fused/adaptive location providers', 'Accuracy & frequency tuning + distance filters', 'Geofencing (system-offloaded monitoring)', 'Batched location upload', 'Background execution limits (Doze / App Nap) handling', 'Granular background-location permissions', 'Session-scoped lifecycle management'],
    keyDecisions: [
      {
        decision: 'Use a foreground service / background mode with a persistent notification during active trips',
        why: 'It is the OS-sanctioned way to keep genuinely ongoing, user-aware work running while backgrounded; without it, the OS throttles or kills background location. The notification provides the transparency the platform requires.',
        tradeoffs: 'A persistent notification is intrusive and, if used for anything other than truly ongoing user-facing work, annoys users and increasingly gets restricted by the OS and stores — so it must be scoped strictly to active trips.',
      },
      {
        decision: 'Adapt location accuracy and frequency to context instead of always using high-accuracy GPS',
        why: 'Continuous high-accuracy GPS is a top battery drain; most moments do not need it. Requesting the lowest sufficient accuracy, tuning frequency, batching uploads, and stopping when idle cuts power dramatically while preserving trip quality.',
        tradeoffs: 'Adaptive logic is more complex and can momentarily under-sample if mis-tuned, and batching trades a little real-time freshness for battery — requiring careful balancing per situation.',
      },
      {
        decision: 'Offload location-triggered events to geofencing rather than polling GPS continuously',
        why: 'Geofencing lets low-power system hardware watch regions and notify the app on enter/exit, delivering location-triggered behavior (arrival detection) at a fraction of the battery cost of the app running GPS in a loop.',
        tradeoffs: 'Geofences have limits on count, minimum radius, and trigger latency, and are less precise/immediate than continuous tracking — so they fit event triggers, not moment-to-moment tracking.',
      },
    ],
    results: [
      'Reliable continuous location during active trips even while the app is backgrounded and the OS wants to suspend it',
      'Substantially reduced battery drain by scoping high-accuracy GPS to when it is actually needed and batching uploads',
      'Compliance with tightening background-location privacy rules and store scrutiny via honest, scoped permission use',
      'Lower-power arrival/geo triggers by offloading monitoring to system geofencing hardware',
      'A session-scoped model that cleanly starts and stops the most expensive capability on the device',
    ],
    lessonsLearned: [
      'Match the background mechanism to the work: foreground service for ongoing user-visible tracking, geofencing for events',
      'Continuous high-accuracy GPS is a top battery drain — adapt accuracy/frequency and stop when idle',
      'Background execution and location are restricted by design; cooperate with OS power management, do not fight it',
      'Background location is the most privacy-sensitive permission — request it only when truly needed, with rationale',
      'Batch network and offload sensing to low-power system features to amortize radio and CPU wakeups',
    ],
    relevantTopics: ['location-maps', 'background-execution-limits', 'foreground-services', 'mobile-privacy', 'permission-model'],
    estimatedMins: 24,
  },
  {
    id: 'news-app-cold-start-optimization',
    company: 'News App (industry pattern)',
    logo: '📰',
    title: 'Making Launch Feel Instant: Cold-Start Optimization for a Content App',
    industry: 'News / Media / Content',
    scale: 'Millions of daily opens · success measured by time-to-first-content and launch-abandonment',
    problem:
      'For a news or content app, launch speed is an existential metric: users open the app dozens of times a day for quick check-ins, and every extra second of a blank or spinning screen at startup drives abandonment and hurts retention. The problem is that cold start — where the OS must create the process, initialize the runtime, run the app entry point, and only then build and draw the first screen — is the slowest launch path, and it runs on the main thread on the critical path before anything is visible. Worse, the median user is on a mid- or low-end device far weaker than the developers’ phones, so work that feels instant in development can be seconds of frozen startup in the field.\n\nThe typical culprit is accumulated startup bloat: a dozen SDKs (analytics, crash reporting, ads, A/B testing, feature flags, DI graphs) all initialized eagerly in the Application/AppDelegate, plus synchronous disk or network work, plus a heavy first screen that lays out and fetches everything before showing anything. Each addition seems small, but stacked on the cold-start critical path they add up to a launch that misses frames and tests users’ patience.',
    solution:
      'The team started by measuring rather than guessing — profiling cold start on real low-end devices with startup tracing (Macrobenchmark / Instruments) to see exactly where the milliseconds went between process creation and first frame. That almost always reveals that the app entry point is doing far too much synchronous work before any screen appears.\n\nThe central fix is to defer and parallelize initialization. Only what the first screen truly needs is initialized eagerly; everything else (analytics, ads, non-critical SDKs) is initialized lazily, on a background thread, or after first frame, so it no longer blocks time-to-interactive. Dependency-injection graphs and SDK setup are trimmed and moved off the critical path. Disk and network work is pushed off the main thread, and the first screen is designed to render immediately from cached content rather than waiting on a fresh network fetch — an offline-first touch where the local store provides instant content while a background refresh updates it moments later. A system launch/splash screen covers the unavoidable process-start gap with branding so the app feels responsive, but the team treated that as hiding latency, not a substitute for removing it.\n\nFurther gains came from rendering a lightweight, meaningful first frame fast — showing cached headlines or a skeleton immediately and progressively filling in images and fresh data — so perceived launch is fast even while secondary work continues. The whole effort is anchored on time-to-first-content as the north-star metric, validated with lab benchmarks in CI to catch regressions and field startup metrics (Android Vitals / Firebase Performance) to confirm real users on real devices actually experienced the improvement.',
    architecture:
      'The architecture treats the cold-start critical path as a scarce, protected resource. Initialization is tiered: a minimal set of "must run before first frame" work, a set of "can run after first frame" work, and a set of "run lazily when first used" work. SDKs and dependencies are placed in the latest tier that still meets their needs, and anything that can move off the main thread does. The first screen reads from a local cache so it can paint instantly, decoupling launch from network latency.\n\nThe organizing principle is separating perceived launch from actual completeness: the app shows meaningful, cached content as fast as possible and continues loading fresh data and non-critical systems in the background. This maps directly onto the frame-rendering and main-thread constraints — the goal is to get a good first frame within budget and never block the UI thread with startup work that the first frame does not require.\n\nThe pattern is universal for content and commerce apps: measure cold start on low-end devices, defer non-essential initialization off the critical path, render from cache for an instant first frame, use the launch screen to mask the irreducible process-start gap, and guard the win with both lab benchmarks (regression detection in CI) and field metrics (real-world truth). It is a concrete application of "the median device is much weaker than yours" and "measure before optimizing."',
    techStack: ['Startup tracing (Macrobenchmark / Instruments)', 'Lazy / deferred SDK initialization', 'Off-main-thread startup work', 'Cache-first first screen (offline-first)', 'System splash / launch screen API', 'Skeleton / progressive rendering', 'App Startup libraries / DI trimming', 'Field startup metrics (Android Vitals / Firebase Performance)'],
    keyDecisions: [
      {
        decision: 'Profile cold start on real low-end devices before changing anything',
        why: 'Performance intuition is usually wrong and the median user’s device is far weaker than a developer’s. Startup tracing shows exactly where time goes between process creation and first frame, so effort targets the real bottleneck.',
        tradeoffs: 'Setting up representative low-end-device benchmarking and field measurement takes upfront investment, but optimizing without it wastes effort on non-problems and can miss the actual cause.',
      },
      {
        decision: 'Defer non-essential SDK/initialization work off the cold-start critical path',
        why: 'Eagerly initializing every SDK in the app entry point runs on the main thread before any screen appears, directly delaying time-to-interactive. Deferring, lazily loading, or backgrounding that work frees the critical path for the first frame.',
        tradeoffs: 'Deferred initialization adds ordering complexity and the risk that something is used before it is ready, so dependencies must be tracked carefully and lazily but safely resolved.',
      },
      {
        decision: 'Render the first screen from cache instead of waiting on a network fetch',
        why: 'Waiting for a fresh fetch ties launch to network latency, which is slow and unreliable on mobile. Showing cached content instantly (then refreshing in the background) makes launch feel immediate and works offline.',
        tradeoffs: 'The user may briefly see slightly stale content until the background refresh completes, requiring clear update behavior and a cache freshness policy so staleness never misleads.',
      },
    ],
    results: [
      'Substantially faster time-to-first-content, especially on the mid/low-end devices most users actually carry',
      'Reduced launch abandonment and improved retention from a launch that feels instant',
      'Cold-start critical path freed by deferring non-essential SDK initialization off the main thread',
      'Instant, offline-capable first screen by rendering cached content and refreshing in the background',
      'Regressions caught early via lab startup benchmarks in CI, with wins confirmed by field metrics',
    ],
    lessonsLearned: [
      'Measure before optimizing, on real low-end devices — the median user’s phone is far weaker than yours',
      'The app entry point runs on the cold-start critical path; heavy work there delays first frame directly',
      'Defer, background, or lazily load non-essential initialization to protect time-to-interactive',
      'Render from cache for an instant first frame; a splash screen hides latency but does not remove it',
      'Guard performance with both lab benchmarks (CI regressions) and field metrics (real-world truth)',
    ],
    relevantTopics: ['app-launch-types', 'mobile-profiling', 'main-ui-thread', 'caching-strategies-mobile', 'app-size-optimization'],
    estimatedMins: 22,
  },
  {
    id: 'slack-push-notification-scale',
    company: 'Slack (industry pattern)',
    logo: '🔔',
    title: 'Reliable Notifications at Scale: Push Delivery, Best-Effort Reality, and Sync-on-Wake',
    industry: 'Enterprise Collaboration / Messaging',
    scale: 'Millions of users · huge notification volume · delivery across FCM/APNs to every device state',
    problem:
      'A collaboration app lives and dies by notifications: a message, mention, or call must reach the user promptly even when the app has been suspended or killed in the background for hours. But a suspended app has no live connection of its own, and keeping one open would drain the battery — so the app is entirely dependent on the OS-level push services, FCM on Android and APNs on iOS, whose delivery is fundamentally best-effort. Messages can arrive late, be coalesced, or be dropped if the device is offline or in a low-power state; device tokens rotate and expire; and users can revoke notification permission at any time. Building "reliable" notifications on top of an explicitly unreliable transport is the crux of the problem.\n\nCompounding it, silent/background pushes (used to pre-sync content so a notification tap opens instantly) are heavily throttled by the OS and never guaranteed, so they cannot be the sole mechanism keeping the app’s data fresh. And at scale, sending huge volumes of pushes through FCM/APNs requires handling token management, per-device targeting, priority, and failures without hammering the services or spamming users.',
    solution:
      'The foundation is to use push as a signal to sync, not as the data channel. When a push arrives, the app does not trust the payload as the source of truth; it treats the notification as a hint and, on wake or on tap, fetches the actual authoritative state from Slack’s servers. This makes correctness independent of push reliability: if a push is late, duplicated, or dropped, the app still converges to the right state the next time it syncs (on open, on a subsequent push, or on a periodic background sync). Notifications become an optimization for immediacy, while the server remains the single source of truth.\n\nToken and delivery management is handled explicitly. The app registers with FCM/APNs, uploads the device token to the backend, and — critically — listens for token refresh and re-uploads, while the server prunes stale/expired tokens so it does not keep pushing into the void. Messages are sent with appropriate priority (high priority for time-sensitive mentions/calls that must wake through low-power modes, normal otherwise, justified because abusing high priority gets throttled), and the backend targets the right device tokens per user. The system is designed to tolerate best-effort delivery: it dedupes on the client (so a duplicated push does not double-notify), and it never assumes exactly-once or in-order arrival.\n\nBecause silent background pushes are throttled and unreliable, they are used opportunistically to pre-fetch content for a snappier open, but the app also syncs on foreground and can fall back to fetching on tap — so a tapped notification always deep-links to the right conversation with fresh data, rebuilding a sensible back stack, even if the pre-sync never ran. The net effect is notifications that feel prompt and reliable to users, built on an honest acceptance that the underlying transport is not.',
    architecture:
      'The architecture cleanly separates the transport (best-effort push via FCM/APNs) from the truth (server state synced by the client). Push flows one way as a trigger: server → FCM/APNs → device → wake/notify. Data flows separately and authoritatively: on wake, tap, or foreground, the client pulls current state from the server and reconciles it locally. This decoupling is what converts an unreliable delivery mechanism into a reliable user experience — the notification’s job is only to prompt a sync, and the sync is what guarantees correctness.\n\nThe key architectural insight is designing for best-effort delivery as a first-class assumption: the system assumes pushes can be late, duplicated, or missing, and layers idempotent client-side handling (dedupe), token lifecycle management (refresh + server-side pruning), and multiple sync triggers (push, foreground, periodic background) so no single missed push breaks the experience. Priority is used sparingly and honestly to work with, not against, OS low-power throttling.\n\nThis is the standard pattern for every serious mobile messaging/collaboration product (Slack, Teams, Signal, WhatsApp): one shared OS push socket for battery efficiency, push-as-a-hint rather than push-as-data, server as source of truth, robust token management, and graceful handling of the OS’s best-effort, throttled delivery. It is a direct application of the push pipeline and background-limits concepts — you cannot keep your own connection alive, and the OS will not guarantee delivery, so you architect around both realities.',
    techStack: ['FCM (Android) / APNs (iOS)', 'Device token registration + refresh handling', 'Server-side token pruning & targeting', 'Push priority tiers', 'Push-as-hint sync-on-wake', 'Client-side notification dedupe', 'Silent/background push (opportunistic pre-sync)', 'Deep linking with back-stack reconstruction'],
    keyDecisions: [
      {
        decision: 'Treat push as a hint to sync, with the server as the single source of truth',
        why: 'Push delivery is best-effort — late, duplicated, or dropped — so trusting the payload as truth produces inconsistent state. Fetching authoritative state on wake/tap makes correctness independent of push reliability.',
        tradeoffs: 'Requires a network fetch on notification handling (slightly slower than trusting the payload) and robust sync logic, but it is the only way to stay correct on an unreliable transport.',
      },
      {
        decision: 'Manage device-token lifecycle explicitly with refresh handling and server-side pruning',
        why: 'Tokens rotate and expire; without listening for refresh and pruning stale tokens, notifications silently stop being deliverable and the backend wastes sends pushing into dead tokens.',
        tradeoffs: 'Adds token-management infrastructure and bookkeeping on both client and server, but skipping it guarantees gradually degrading, hard-to-debug delivery failures.',
      },
      {
        decision: 'Use high push priority sparingly and rely on multiple sync triggers, not just silent push',
        why: 'Silent/background pushes are throttled and unreliable, and abusing high priority gets an app throttled by the OS. Combining sparing high-priority pushes with foreground and periodic sync keeps data fresh without depending on any single unreliable mechanism.',
        tradeoffs: 'Multiple sync paths add complexity and some redundant fetching, and conservative priority use can mean marginally less-instant pre-sync — a deliberate trade for reliability and staying within OS limits.',
      },
    ],
    results: [
      'Notifications that feel prompt and reliable to users despite an explicitly best-effort transport',
      'State stays correct regardless of late, duplicated, or dropped pushes, because the client always syncs from the server',
      'Sustained deliverability at scale via token refresh handling and server-side pruning of stale tokens',
      'Battery-efficient delivery by relying on the shared OS push socket instead of a per-app connection',
      'A tapped notification always deep-links to fresh content with a sensible back stack, even if pre-sync never ran',
    ],
    lessonsLearned: [
      'A suspended app has no connection of its own — push depends entirely on the shared OS socket (FCM/APNs)',
      'Push delivery is best-effort: design for late, duplicated, and missing notifications, and dedupe on the client',
      'Use push as a hint to sync from the server (source of truth), never as a reliable data channel',
      'Token lifecycle management (refresh + pruning) is essential or deliverability silently rots over time',
      'Silent background pushes are throttled and unreliable — pair them with foreground and periodic sync',
    ],
    relevantTopics: ['push-notifications-pipeline', 'background-sync', 'background-execution-limits', 'realtime-mobile', 'deep-linking-mobile'],
    estimatedMins: 23,
  },
]
