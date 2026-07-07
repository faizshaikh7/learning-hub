import type { CurriculumTopic } from '@/types'

/** Phase 0 — Mobile Foundations. Concept-first, framework-agnostic. */
export const MOBILE_P0: CurriculumTopic[] = [
  {
    "id": "what-is-mobile",
    "phase": 0,
    "phaseName": "Mobile Foundations",
    "orderIndex": 1,
    "estimatedMins": 30,
    "prerequisites": [],
    "title": "What Makes Mobile Different",
    "eli5": "A phone is a tiny computer that runs on a battery, fits in your pocket, and can lose its internet at any moment. Because of that, apps have to be polite: use little power, little memory, and keep working even when the signal drops. A desktop app never has to worry about any of that.",
    "analogy": "Building for desktop is like cooking in a home kitchen with unlimited gas, water, and counter space. Building for mobile is like cooking on a camping stove with one small gas canister — you plan every burn, reuse every pot, and assume the gas could run out mid-meal.",
    "explanation": "Mobile development is defined less by a language and more by a set of hard constraints that never go away. Every mobile device runs on a finite battery, so CPU, GPS, and radio use directly drain the thing the user cares about most. Memory is limited and shared, so the OS will kill your app to keep the foreground app alive. The network is intermittent — a user walks into an elevator and connectivity vanishes — so an app that assumes a connection is a broken app. Input is touch-first (imprecise fingers, gestures, no hover), the screen is small (you cannot show everything at once), and the device is packed with sensors (GPS, accelerometer, camera) that are powerful but expensive to use. Finally, distribution goes through app stores with review, signing, and update lag, unlike a web page you can redeploy in seconds.\n\nAndroid vs iOS callout: Both platforms enforce these constraints, but differently. Android exposes more knobs (background services, foreground service notifications, WorkManager) and runs on thousands of hardware tiers from budget to flagship, so you must design for the low end. iOS runs on a narrow, controlled hardware range and enforces constraints more aggressively — background execution is tightly limited and the system suspends apps quickly to protect battery. The constraints are the same; iOS is stricter about how you are allowed to respond to them.",
    "technicalDeep": "Concretely, these constraints show up as OS-level mechanisms. Battery: radios (cellular, WiFi, GPS) are the biggest drain, and waking the radio has a fixed tail-energy cost, so batching network calls matters more than reducing bytes. Memory: the OS runs a low-memory killer that terminates background processes under pressure; your process is not guaranteed to exist between two user interactions. Network: bandwidth varies from 5G to 2G to nothing, latency spikes, and packets drop, so retries, timeouts, and offline caches are mandatory. Input: touch targets need a minimum physical size (fingers are ~9mm), and there is no reliable hover or right-click. Sensors and distribution add their own rules (permissions, store review).\n\nAndroid vs iOS callout: Android's low-memory killer (lmkd) uses oom_adj scores tied to process importance, and apps get onTrimMemory callbacks warning of pressure. iOS uses Jetsam, which posts memory-warning notifications and then jetsams (kills) the app if it does not shed memory fast enough. Both mean the same rule: hold as little as you can, and be ready to be killed.",
    "whatBreaks": "Apps built with a desktop or web mindset break in predictable ways: they assume the network is always up and hang forever on a spinner in a tunnel; they hold large bitmaps in memory and get killed the moment they are backgrounded; they poll a server every second and drain the battery to 20% by lunch; they use tiny tap targets designed for a mouse and users mis-tap constantly. The worst failure is silent: everything works on the developer's fast WiFi and flagship phone, then falls apart on a mid-range device on 3G.",
    "efficientWay": {
      "title": "How to Internalize Mobile Constraints",
      "approaches": [
        {
          "name": "Design against the constraints from day one (battery, memory, offline, touch)",
          "verdict": "best",
          "reason": "The constraints are permanent and shape every later decision. Treating them as first-class requirements avoids expensive rewrites."
        },
        {
          "name": "Build like a web app, then optimize later",
          "verdict": "weak",
          "reason": "Constraints are architectural, not a final polish pass. Offline support and lifecycle handling cannot be bolted on cheaply."
        },
        {
          "name": "Pick one platform's rules and assume the other matches",
          "verdict": "ok",
          "reason": "Fine for learning the concept, but ships bugs — Android and iOS enforce the same constraints with different, incompatible mechanisms."
        }
      ],
      "recommendation": "Treat battery, memory, network, and touch as non-negotiable requirements from the first sketch. Test early on a mid-range device with throttled network — that is your real user, not your dev machine."
    },
    "commonMistakes": [
      "Assuming the network is always available and never testing airplane mode or a flaky connection",
      "Developing only on a flagship phone and fast WiFi, hiding memory and performance problems",
      "Designing touch targets as if a mouse pointer will click them, causing constant mis-taps",
      "Polling servers or holding GPS/wake locks continuously and silently draining the battery"
    ],
    "seniorNotes": "Senior mobile engineers think in resource budgets, not features. Every feature has a cost in milliamp-hours, megabytes, and milliseconds, and the OS is an adversary that will kill you to protect the user. The mark of maturity is designing for the P90 device on a P90 network — the cheap phone on bad signal — because that is where your reviews and churn come from, not the flagship in the demo.",
    "interviewQuestions": [
      "Name the core constraints that make mobile development fundamentally different from web or desktop, and explain why each one matters.",
      "Why is the intermittent network the constraint that most changes how you architect an app?",
      "Why is testing on a flagship device and fast WiFi dangerous, and what would you test on instead?"
    ],
    "interviewAnswers": [
      "The core constraints are finite battery, limited and shared memory, intermittent network, touch-first input, small screen, sensors, and store distribution. Battery matters because radios and CPU directly drain what users care about. Memory matters because the OS kills background apps under pressure, so your process is not guaranteed to persist. Network matters because connectivity drops constantly, so offline tolerance is mandatory. Touch and screen size change the entire interaction model, and store distribution adds review and update lag. Together they mean every decision is a resource tradeoff.",
      "Because it invalidates the core assumption of most application code: that a request you send will complete. On mobile, connectivity drops in elevators, tunnels, and dead zones, and switches between WiFi and cellular mid-session. If you assume a connection, the app hangs or loses data. Handling it right forces architectural choices — local caching, an offline queue, optimistic UI, retries with backoff — that must exist before you write features, not after.",
      "Because it hides your real users. Flagships have fast CPUs, lots of RAM, and you are on strong WiFi, so memory kills, slow cold starts, jank, and network timeouts never appear. Most users are on mid-range or budget devices with less RAM and variable cellular signal. I would test on a representative mid-range device with a throttled, high-latency network profile and airplane-mode toggling to surface the failures real users hit."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "The mobile resource budget mindset (pseudocode)",
        "code": "// Every action has a hidden cost. Budget it.\n\nfunction loadFeed():\n    if not network.isAvailable():\n        return cache.readFeed()        // offline-first, never hang\n\n    // Batch requests so the radio wakes once, not many times\n    requests = [fetchPosts(), fetchAvatars(), fetchAds()]\n    results = network.batch(requests, timeout = 10s)\n\n    if results.failed():\n        return cache.readFeed()        // degrade, do not crash\n\n    cache.writeFeed(results)           // survive the next process kill\n    return results\n\n// Cost ledger for one feed load:\n//   radio wake      ~ high battery (tail energy)\n//   decoded images  ~ high memory  (risk of low-memory kill)\n//   round trip      ~ variable latency (assume it can fail)"
      }
    ],
    "resources": [
      {
        "label": "Android platform architecture overview",
        "url": "https://developer.android.com/guide/platform",
        "kind": "docs"
      },
      {
        "label": "Apple Human Interface Guidelines",
        "url": "https://developer.apple.com/design/human-interface-guidelines/",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh Android developer path",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      }
    ]
  },
  {
    "id": "mobile-os-architecture",
    "phase": 0,
    "phaseName": "Mobile Foundations",
    "orderIndex": 2,
    "estimatedMins": 35,
    "prerequisites": [
      "what-is-mobile"
    ],
    "title": "Mobile OS Architecture (Layers)",
    "eli5": "A phone's software is built in layers, like a cake. At the bottom is the part that talks to the actual chips and battery. On top of that is a translator so the same code works on different hardware. Above that is the engine that runs your app's code, then a big toolbox of ready-made screen and button pieces, and finally your app sitting on the very top.",
    "analogy": "Think of an office building. The foundation and utilities (kernel) keep everything powered and safe. The building management (HAL) knows how to work with this specific building's plumbing and wiring. The staff (runtime) actually does the work. The furnished offices (app framework) come with desks and phones ready to use. You (your app) just move in and start working — you never touch the wiring.",
    "explanation": "Every mobile OS is a stack of layers, each hiding the messy details of the one below. At the bottom is the kernel: it manages processes, memory, and scheduling, and enforces isolation between apps. Above it sits the Hardware Abstraction Layer (HAL), which gives a uniform interface to specific hardware — camera, sensors, GPS — so higher layers do not need to know the exact chip. Next is the runtime, which executes your app's code (garbage collection, threading, JIT/AOT compilation). On top of that is the app framework: the huge library of UI components, activity/screen management, notifications, and system services you actually call. Your app sits at the very top, composed from framework pieces. You only ever write against the top layers, but understanding what is beneath explains why things behave as they do.\n\nAndroid vs iOS callout: Android's stack is Linux kernel at the bottom, then a HAL, then the Android Runtime (ART) which runs your Dalvik bytecode, then the Java/Kotlin framework layer (Activities, Views, system services), then your app. iOS's stack is the Darwin/XNU kernel (a hybrid Mach + BSD kernel) at the bottom, then core services and the Objective-C/Swift runtime, then frameworks like UIKit/SwiftUI, then your app. Different kernels and runtimes, identical shape.",
    "technicalDeep": "The kernel provides the process/thread model, virtual memory, and the security boundary (each app gets its own user id and memory space). The runtime is where language behavior lives: Android's ART compiles Kotlin/Java bytecode ahead-of-time at install (with JIT and profile-guided optimization at runtime) and does tracing garbage collection; iOS compiles Swift/Objective-C to native machine code ahead-of-time and uses Automatic Reference Counting instead of a tracing GC. The framework layer exposes system services through inter-process communication to privileged system processes — you call a normal-looking API and it crosses a process boundary into a system server. This is why some calls are surprisingly expensive: they are IPC, not local function calls.\n\nAndroid vs iOS callout: On Android, framework calls often go through Binder IPC to system_server (the ActivityManager, WindowManager, and PackageManager all live there). On iOS, apps talk to system daemons via XPC and Mach ports. In both cases the lesson is the same: the friendly API on top hides a cross-process, kernel-mediated call underneath.",
    "whatBreaks": "Confusing the layers leads to real bugs. Developers assume a framework call is cheap and call it in a tight loop, not realizing it is IPC to a system process, causing jank. They assume the runtime behaves like their desktop language and get surprised by GC pauses (Android) or retain cycles (iOS). They try to reach around the framework to touch hardware directly and hit permission or HAL boundaries. When a device from a different manufacturer behaves differently, it is usually the HAL or a vendor-modified layer, not your code.",
    "efficientWay": {
      "title": "Learning the OS Stack",
      "approaches": [
        {
          "name": "Learn top-down: your app, then the framework, then runtime, then kernel",
          "verdict": "best",
          "reason": "Matches how you actually build. You understand each layer when you hit its edge, keeping the mental model grounded in real APIs."
        },
        {
          "name": "Study the kernel internals first",
          "verdict": "weak",
          "reason": "Fascinating but rarely actionable for app developers. You can ship for years without touching kernel details."
        },
        {
          "name": "Ignore the layers and just learn the framework APIs",
          "verdict": "ok",
          "reason": "Gets you productive fast, but you will be baffled by GC pauses, IPC costs, and cross-device differences you cannot explain."
        }
      ],
      "recommendation": "Learn the framework APIs deeply, but keep a one-line mental model of each layer beneath. When something behaves strangely, ask which layer owns it — that alone resolves most confusion."
    },
    "commonMistakes": [
      "Assuming a framework API is a cheap local call when it is actually IPC to a system process",
      "Treating the runtime like a desktop language and being surprised by GC pauses or reference-counting rules",
      "Blaming your own code when cross-manufacturer differences come from a vendor-modified HAL or OS layer",
      "Trying to bypass the framework to touch hardware directly and hitting permission or abstraction boundaries"
    ],
    "seniorNotes": "The layered model is the single best debugging tool in mobile. When a bug appears, locating which layer owns it — is this my code, the framework, the runtime, the HAL, or the kernel — narrows the search space enormously. Senior engineers also know that vendor customizations (especially on Android) live between the framework and kernel, which is why 'works on Pixel, broken on Samsung' is a HAL/OEM-layer story, not an app bug.",
    "interviewQuestions": [
      "Walk me through the layers of a mobile operating system from the hardware up to your app.",
      "Where does the difference between Android's ART and iOS's runtime sit in the stack, and why does it matter to your code?",
      "Why can a seemingly simple framework API call be surprisingly expensive?"
    ],
    "interviewAnswers": [
      "From the bottom: the kernel manages processes, memory, scheduling, and the security boundary between apps. Above it, the HAL gives a uniform interface to specific hardware like camera and sensors. The runtime executes your app's code and handles memory management. The app framework provides the UI toolkit and system services you call. Your app sits on top, composed from framework pieces. On Android that is Linux kernel, HAL, ART runtime, Java/Kotlin framework; on iOS it is the Darwin/XNU kernel, core services, the Swift/Objective-C runtime, and UIKit/SwiftUI. Same shape, different implementations.",
      "The runtime layer, which sits between the framework and the kernel. Android's ART uses ahead-of-time compilation with a tracing garbage collector, so you get automatic memory reclamation but occasional GC pauses. iOS compiles Swift/Objective-C ahead-of-time and uses Automatic Reference Counting, so there is no GC pause but you must avoid retain cycles that leak memory. It matters because memory-management behavior — pauses versus manual cycle-breaking — comes directly from which runtime you are on.",
      "Because many framework APIs are not local function calls — they cross a process boundary via IPC into a privileged system process. On Android, ActivityManager and WindowManager calls go through Binder to system_server; on iOS, apps talk to system daemons over XPC. The friendly method hides a context switch and cross-process round trip, so calling it in a tight loop causes jank. Knowing it is IPC tells you to batch or cache the result."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "The layered stack, and where a call really goes (pseudocode)",
        "code": "// Layers, top to bottom:\n//   [ Your App        ]  <- you write here\n//   [ App Framework   ]  <- UI toolkit, system services\n//   [ Runtime         ]  <- executes code, manages memory\n//   [ HAL             ]  <- uniform interface to hardware\n//   [ Kernel          ]  <- processes, memory, isolation\n//   [ Hardware        ]  <- CPU, radio, sensors\n\n// What looks like a local call...\nlocation = systemService.getLocation()\n\n// ...actually crosses layers:\n//   your app  --IPC-->  system location process\n//   system process  -->  HAL  -->  GPS chip driver\n//   result travels all the way back up\n// Lesson: cache it; do not call it in a loop."
      }
    ],
    "resources": [
      {
        "label": "Android platform architecture",
        "url": "https://developer.android.com/guide/platform",
        "kind": "docs"
      },
      {
        "label": "Android app fundamentals",
        "url": "https://developer.android.com/guide/components/fundamentals",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh iOS developer path",
        "url": "https://roadmap.sh/ios",
        "kind": "course"
      }
    ]
  },
  {
    "id": "app-sandbox-model",
    "phase": 0,
    "phaseName": "Mobile Foundations",
    "orderIndex": 3,
    "estimatedMins": 30,
    "prerequisites": [
      "mobile-os-architecture"
    ],
    "title": "The App Sandbox & Security Model",
    "eli5": "Every app on your phone lives in its own locked room. It has its own drawers for its stuff, and it cannot walk into another app's room or read another app's drawers. If it wants something shared — like your photos or camera — it has to ask you for a key first, and you can say no.",
    "analogy": "Apps are tenants in an apartment building. Each has a private apartment (its own storage and process) with a lock only they hold. Shared facilities like the gym (camera), mailroom (contacts), or parking (location) require a key from the building manager (the OS), and the manager only hands one over after you, the resident, approve it. No tenant can pick another tenant's lock.",
    "explanation": "The sandbox is the core security guarantee of mobile: each app runs isolated from every other app. It gets its own private storage directory that no other app can read, runs in its own process under its own operating-system user identity, and cannot see or touch another app's memory or files. Anything shared or sensitive — the camera, microphone, location, contacts, photos, external storage — is gated behind permissions that the user must explicitly grant. This is a fundamental departure from desktop, where a program you run typically has the same access you do to the whole filesystem. On mobile, installing an app grants it almost nothing by default; it must ask for each capability, and the user (and the OS) can refuse or revoke.\n\nAndroid vs iOS callout: Android gives each app a unique Linux user id (UID) at install time, and the kernel's normal file-permission system enforces isolation — your files are literally owned by your app's UID. Permissions are declared in the manifest and, for dangerous ones, requested at runtime with a system dialog. iOS runs every app under the same underlying user but confines each in its own container directory enforced by the kernel and code signing, and gates capabilities through entitlements plus runtime permission prompts (TCC — Transparency, Consent, and Control). Different mechanisms, same guarantee: isolation by default, shared access only with consent.",
    "technicalDeep": "On Android, the sandbox is built on standard Linux discretionary access control: the installer assigns a distinct UID/GID per app, files in the app's private directory are owned by that UID, and SELinux mandatory access control adds a second enforced layer on top. Inter-app communication is only possible through explicit, OS-mediated channels (Intents, ContentProviders, bound services) — never by reaching into another app's memory. iOS enforces the sandbox through a kernel-level sandbox profile (seatbelt) plus mandatory code signing: every binary must be signed, entitlements declare what the app may do, and the container directory is the only place the app can freely read and write. Sensitive access on iOS flows through the TCC subsystem, which records and enforces user consent per capability.\n\nAndroid vs iOS callout: On Android you can inspect this directly — app data lives under /data/data/<package> owned by the app's UID, and other apps get permission-denied. On iOS the app's container is a randomized path, code-signed and unreadable by other apps. Both platforms have moved toward scoped, revocable, one-time, and 'while using the app' permission grants rather than permanent all-or-nothing access.",
    "whatBreaks": "Developers coming from desktop assume they can write anywhere on the filesystem and hit permission-denied outside their sandbox. They forget to request a runtime permission and the camera or location call silently fails or throws. They assume a permission granted once is permanent, but the user can revoke it in Settings at any time, so code that does not re-check permissions crashes later. They try to share data between two of their own apps by writing to a shared path and find the sandbox blocks it — they must use an OS-sanctioned sharing mechanism. Over-requesting permissions also breaks trust and gets apps rejected from stores.",
    "efficientWay": {
      "title": "Working With the Sandbox and Permissions",
      "approaches": [
        {
          "name": "Request the minimum permissions, at the moment of use, and always re-check before use",
          "verdict": "best",
          "reason": "Respects the user, survives revocation, passes store review, and matches how both platforms are evolving toward just-in-time consent."
        },
        {
          "name": "Request every permission up front at first launch",
          "verdict": "weak",
          "reason": "Users deny a wall of prompts, stores flag over-permissioning, and you still must handle denial and revocation anyway."
        },
        {
          "name": "Assume a granted permission stays granted for the app's lifetime",
          "verdict": "weak",
          "reason": "Users revoke permissions in Settings and the OS grants one-time access, so unchecked calls crash or fail silently later."
        }
      ],
      "recommendation": "Ask for each capability just in time, explain why before the system prompt, and re-check the permission every time you use it. Store only what belongs in your sandbox and use OS-sanctioned channels to share."
    },
    "commonMistakes": [
      "Trying to read or write files outside the app's private storage and hitting permission-denied",
      "Calling a sensitive API without requesting the runtime permission first, causing a silent failure or crash",
      "Assuming a permission granted once is permanent and never re-checking after the user can revoke it",
      "Requesting many permissions up front, eroding user trust and risking store rejection"
    ],
    "seniorNotes": "The sandbox is why mobile is more secure than desktop by default, and senior engineers lean into it rather than fight it. Treat every capability as a privilege the user lends you and can take back. Design features to degrade gracefully when a permission is denied or revoked, prefer the least-powerful scoped API (for example, a photo picker that returns one image over full photo-library access), and never store secrets in shared or world-readable locations. Cross-app data flows should always go through documented, OS-mediated channels — reaching around the sandbox is both a bug and a security smell.",
    "interviewQuestions": [
      "What is the app sandbox and what security guarantee does it provide?",
      "How do Android and iOS each enforce isolation between apps at the OS level?",
      "Why must you re-check a permission before every use instead of assuming it stays granted?"
    ],
    "interviewAnswers": [
      "The app sandbox is the OS guarantee that each app runs isolated from every other app: its own private storage, its own process, and no ability to read another app's files or memory. Anything shared or sensitive — camera, location, contacts, photos — is gated behind user-granted permissions. It flips the desktop model where a program has your full access; on mobile an app starts with almost nothing and must ask for each capability, which the user or OS can refuse or revoke.",
      "Android assigns each app a unique Linux UID at install, so the kernel's file ownership and permission system enforces isolation, with SELinux adding a mandatory-access-control layer; apps communicate only through OS-mediated channels like Intents and ContentProviders. iOS confines each app in a code-signed container directory enforced by a kernel sandbox profile, requires every binary to be signed, and uses entitlements plus the TCC consent system for sensitive access. Different mechanisms — per-UID Linux permissions versus code-signed containers — but the same guarantee of isolation by default.",
      "Because a permission is not a permanent grant. Users can revoke it in Settings at any time, and both platforms now offer one-time and 'while using' grants that expire. If your code assumes it is still held, the sensitive call fails silently or throws and can crash the app. Re-checking before each use lets you handle denial gracefully — prompt again with context or degrade the feature — instead of breaking."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Permission-gated access, done defensively (pseudocode)",
        "code": "// The sandbox blocks this by default; you must ask.\n\nfunction takeProfilePhoto():\n    // Re-check EVERY time -- the grant can be revoked or one-time\n    if not permissions.has(CAMERA):\n        explainWhyWeNeedCamera()          // context before the prompt\n        result = permissions.request(CAMERA)\n        if result != GRANTED:\n            return offerManualUpload()     // degrade gracefully\n\n    photo = camera.capture()\n\n    // Write only inside our own sandbox directory\n    path = sandbox.privateDir + \"/profile.jpg\"\n    storage.write(path, photo)             // other apps cannot read this\n\n    // To SHARE it, use an OS-sanctioned channel, not a shared path\n    return share.viaSystemProvider(path)"
      },
      {
        "lang": "kotlin",
        "label": "Android: runtime permission check before a sensitive call",
        "code": "// Android gates 'dangerous' permissions at runtime.\nfun capturePhotoIfAllowed(activity: Activity) {\n    val granted = ContextCompat.checkSelfPermission(\n        activity, Manifest.permission.CAMERA\n    ) == PackageManager.PERMISSION_GRANTED\n\n    if (granted) {\n        openCamera()\n    } else {\n        // System shows the consent dialog; user may deny\n        ActivityCompat.requestPermissions(\n            activity,\n            arrayOf(Manifest.permission.CAMERA),\n            REQUEST_CAMERA\n        )\n    }\n    // Note: files written to context.filesDir are owned by this\n    // app's Linux UID and unreadable by any other app.\n}"
      }
    ],
    "resources": [
      {
        "label": "Android app fundamentals (process, UID, isolation)",
        "url": "https://developer.android.com/guide/components/fundamentals",
        "kind": "docs"
      },
      {
        "label": "Android platform architecture",
        "url": "https://developer.android.com/guide/platform",
        "kind": "docs"
      },
      {
        "label": "Apple Human Interface Guidelines (privacy and permissions)",
        "url": "https://developer.apple.com/design/human-interface-guidelines/",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "native-vs-crossplatform",
    "phase": 0,
    "phaseName": "Mobile Foundations",
    "orderIndex": 4,
    "estimatedMins": 35,
    "prerequisites": [
      "mobile-os-architecture"
    ],
    "title": "Native vs Cross-Platform vs Hybrid vs PWA",
    "eli5": "There are a few different ways to build a phone app. You can build it twice, once specially for each phone brand (native). You can write it once and use a tool that turns it into both (cross-platform). You can wrap a website so it looks like an app (hybrid). Or you can just make a really good website that phones can save like an app (PWA). Each way trades effort for how good and how fast the app feels.",
    "analogy": "It is like choosing how to translate a book into two languages. Native is hiring two expert native translators — perfect in each language but double the work. Cross-platform is a skilled bilingual author who writes both versions from one manuscript — one effort, very good results, occasional idiom that does not carry over. Hybrid is photocopying the English pages and gluing on a translated cover. A PWA is publishing online and letting readers auto-translate in their browser.",
    "explanation": "There are four broad approaches, and the real map is about how close your code sits to the platform. Native means writing directly against one platform's own language and toolkit (Kotlin on Android, Swift on iOS) — you build the app twice but get maximum performance, full access to every OS feature the day it ships, and the truest platform feel. Cross-platform means one codebase compiled or bridged to both platforms: Flutter draws its own UI on a fast engine, React Native runs JavaScript that drives real native views, and Kotlin Multiplatform (KMP) shares business logic while letting UI stay native. Hybrid wraps a web app inside a native shell (a WebView) — you ship your website as an app. A PWA is a web app with offline support and an installable icon that runs in the browser engine, no store required. The choice trades developer effort and reach against performance, native feel, and hardware access.\n\nAndroid vs iOS callout: Native tooling differs completely — Android uses Kotlin/Java with Jetpack Compose or XML views in Android Studio, while iOS uses Swift/Objective-C with SwiftUI or UIKit in Xcode. Cross-platform frameworks exist precisely to hide this split: with Flutter or React Native you write once and the framework talks to each platform's native layer for you. Hybrid and PWA lean on each platform's system WebView (Android's WebView/Chromium, iOS's WKWebView/WebKit), so subtle rendering differences between the two engines still leak through.",
    "technicalDeep": "The approaches differ in what runs at runtime. Native compiles to the platform's own machine code and calls framework APIs directly — no bridge, no extra runtime. Flutter ships its own rendering engine (Skia/Impeller) and draws every pixel itself, so it does not use the platform's native widgets at all; its Dart code is AOT-compiled to native. React Native runs your JavaScript in a JS engine and communicates with real platform views (historically over an async bridge, now via the JSI interface for synchronous calls), so the widgets are genuinely native but driven by JS. KMP compiles shared Kotlin to native binaries and JVM bytecode, sharing logic while UI stays fully native per platform. Hybrid runs your HTML/CSS/JS inside a system WebView with a bridge (like Capacitor/Cordova) to reach native APIs. A PWA runs entirely in the browser engine, using service workers for offline and a web app manifest for install.\n\nAndroid vs iOS callout: On Android, native = Kotlin/Java compiled to ART bytecode; on iOS, native = Swift/Objective-C compiled ahead-of-time to machine code. Hybrid and PWA depend on the platform browser engine — Chromium on Android, WebKit on iOS — and Apple requires WebKit for web content, which is why PWAs historically have had weaker capabilities and install support on iOS than on Android.",
    "whatBreaks": "Picking the wrong approach shows up late and expensive. Teams choose hybrid or PWA for a graphics-heavy or gesture-heavy app and ship something that feels sluggish and 'not quite right'. They choose native for a simple content app and burn double the budget maintaining two codebases. Cross-platform teams hit a wall when they need a brand-new OS feature the framework has not wrapped yet, forcing them to write native platform code anyway. PWAs on iOS run into WebKit limits and missing capabilities. And every approach that touches a WebView inherits web rendering quirks and the two engines behaving differently.",
    "efficientWay": {
      "title": "Choosing an Approach",
      "approaches": [
        {
          "name": "Match the approach to the product: native for platform-critical/high-performance, cross-platform for shared business apps, PWA/hybrid for simple content",
          "verdict": "best",
          "reason": "There is no universally right choice — the correct answer depends on performance needs, team size, budget, and how much you rely on cutting-edge OS features."
        },
        {
          "name": "Always go native for the best possible quality",
          "verdict": "ok",
          "reason": "Highest ceiling on quality and access, but doubles the cost and team size; overkill for many apps and slower to market."
        },
        {
          "name": "Always go cross-platform to save money",
          "verdict": "ok",
          "reason": "Great for most business apps, but you still hit native for new OS features and deep platform integration, and heavy graphics can strain some frameworks."
        }
      ],
      "recommendation": "Decide from the product's real needs. If success depends on peak performance and same-day OS features, go native. If you need one team to ship a solid app to both platforms, go cross-platform. If it is essentially a content site, a PWA or hybrid may be plenty. Understand the tradeoffs before you commit — switching later is costly."
    },
    "commonMistakes": [
      "Choosing hybrid or PWA for a graphics- or gesture-heavy app and shipping something that feels sluggish",
      "Going native for a simple content app and paying to maintain two codebases needlessly",
      "Assuming cross-platform means never writing native code — you still do for new OS features and deep integration",
      "Ignoring that iOS forces WebKit, so PWA and hybrid capabilities differ from Android"
    ],
    "seniorNotes": "There is no 'best' approach in the abstract — the senior skill is matching the tool to constraints: performance ceiling, team skills, time to market, budget, and how bleeding-edge your OS-feature needs are. A pragmatic pattern is hybrid architecture: share business logic (KMP or a common module) while keeping performance-critical or platform-specific UI native. Also weigh the maintenance tail: cross-platform saves upfront cost but ties you to a framework's release cadence and its ability to keep up with new OS versions. The decision is a long-term bet, not just a first-ship optimization.",
    "interviewQuestions": [
      "Compare native, cross-platform, hybrid, and PWA approaches and the core tradeoff each makes.",
      "When would you choose native over a cross-platform framework, and when the reverse?",
      "Why does Flutter feel different from React Native under the hood even though both are 'cross-platform'?"
    ],
    "interviewAnswers": [
      "Native means writing directly in each platform's language and toolkit (Kotlin/Swift) — best performance, full OS access, truest feel, but you build twice. Cross-platform (Flutter, React Native, KMP) uses one codebase for both — big savings and near-native quality, but you can hit walls on brand-new OS features. Hybrid wraps a web app in a native WebView shell — cheapest and web-skill-friendly, but it inherits web performance and rendering quirks. A PWA is an installable, offline-capable web app running in the browser engine with no store — lowest friction and reach, but the weakest hardware access and native feel. The tradeoff axis is effort and reach versus performance and platform fidelity.",
      "I go native when the product's success depends on peak performance, heavy graphics or custom gestures, deep platform integration, or using new OS features the day they ship — and when the team and budget can support two codebases. I go cross-platform when one team needs to deliver a solid app to both platforms on a reasonable budget and the feature set maps to what the framework already wraps, which covers most business and content-driven apps. A common middle path is sharing logic via KMP while keeping UI native.",
      "Because they take opposite strategies at runtime. Flutter ships its own rendering engine and draws every pixel of its UI itself with AOT-compiled Dart, so it does not use platform widgets at all — consistent look everywhere, but it re-implements platform UI. React Native runs your JavaScript and drives real native platform views through an interface layer, so the widgets are genuinely native but controlled by JS, which means it inherits true platform look-and-feel but adds a JS-to-native communication layer. One paints its own canvas; the other puppeteers native components."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "How each approach reaches the screen (pseudocode)",
        "code": "// NATIVE: your code calls the platform UI directly\nplatformToolkit.render(Button(\"Save\"))       // Kotlin/Swift\n\n// CROSS-PLATFORM (Flutter): framework paints its OWN pixels\nflutterEngine.paint(Button(\"Save\"))          // draws via Skia/Impeller,\n                                             // not native widgets\n\n// CROSS-PLATFORM (React Native): JS drives REAL native views\njsRuntime.run(() => {\n    nativeBridge.createView(\"Button\", { text: \"Save\" })  // real native button\n})\n\n// HYBRID: a web app inside a native WebView shell\nnativeShell.loadWebView(\"index.html\")        // HTML/CSS/JS + bridge\n\n// PWA: a web app the browser can install\nbrowser.install(manifest)                    // service worker = offline"
      }
    ],
    "resources": [
      {
        "label": "Android platform architecture",
        "url": "https://developer.android.com/guide/platform",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh Android developer path",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      },
      {
        "label": "roadmap.sh iOS developer path",
        "url": "https://roadmap.sh/ios",
        "kind": "course"
      }
    ]
  },
  {
    "id": "mobile-dev-mindset",
    "phase": 0,
    "phaseName": "Mobile Foundations",
    "orderIndex": 5,
    "estimatedMins": 30,
    "prerequisites": [
      "what-is-mobile",
      "app-sandbox-model"
    ],
    "title": "The Mobile Developer Mindset",
    "eli5": "On a computer, your program is the boss — it starts, runs, and stops when it wants. On a phone, the phone is the boss. It can pause your app, hide it, or shut it down whenever it needs to, and you just have to react politely. A good phone app expects to be interrupted at any moment and never loses the user's work.",
    "analogy": "A desktop app is the host of its own house — it decides when guests arrive and leave. A mobile app is a guest in someone else's house (the OS). The host can tell you to step outside (background), be quiet (suspend), or leave entirely (terminate) at any time, and you have to handle it gracefully without spilling anything. You never overstay, you never assume you will be invited back, and you always keep your coat on.",
    "explanation": "The mobile mindset is a genuine shift from web and desktop thinking. On desktop your program is in control: it owns the main loop, runs until it decides to exit, and assumes stable resources. On mobile the OS is in charge — it decides when your app runs, pauses, or dies, based on what the user is doing and how scarce resources are. So you write event-driven code that reacts to system callbacks rather than driving a loop. You write lifecycle-aware code that saves state whenever you might be backgrounded, because you might not come back. You write offline-tolerant code that assumes the network can vanish. And you write resource-conscious code that treats battery, memory, and CPU as budgets, not infinities. The core reframe: you are not running a program, you are responding to a system that is running you.\n\nAndroid vs iOS callout: Both platforms embody 'the OS is in charge', but their callback vocabularies differ. Android delivers lifecycle events through Activity/Fragment callbacks (onCreate, onStart, onResume, onPause, onStop, onDestroy) and enforces the main-thread rule with the ANR (Application Not Responding) watchdog. iOS delivers them through app and scene lifecycle methods and UIViewController callbacks (viewDidLoad, viewWillAppear, viewDidAppear, viewWillDisappear) and enforces responsiveness with its own watchdog that kills apps that hang. Same philosophy, different method names.",
    "technicalDeep": "Event-driven means your code is a set of handlers the system invokes: a lifecycle transition, a touch, a sensor update, a low-memory warning, a push notification. Between events your app may be frozen or gone. Lifecycle-aware means treating every 'you are about to lose focus' callback as a possible last moment — persist unsaved input, pause timers and sensors, release expensive resources. Offline-tolerant means an architecture with a local source of truth (a cache or database) that the UI reads from, with network sync as a background reconciliation rather than a blocking dependency. Resource-conscious means batching network and sensor work, releasing memory under pressure, and never blocking the UI thread. These are not optimizations; they are the baseline for an app that survives real-world usage.\n\nAndroid vs iOS callout: On Android you subscribe to lifecycle with Lifecycle-aware components (LifecycleObserver) and offload work to coroutines/WorkManager; onTrimMemory tells you to shed memory. On iOS you observe scene-phase changes and app-state notifications and offload work with Grand Central Dispatch or async tasks; didReceiveMemoryWarning tells you to shed memory. The disciplines map one-to-one across platforms.",
    "whatBreaks": "Developers carrying a desktop or web mindset write apps that break under normal use: they assume the app keeps running in the background and lose in-progress work when the OS reclaims it; they block the UI thread doing network or disk work and trigger an ANR or watchdog kill; they treat the network as always-on and hang or crash offline; they hold resources (sensors, wake locks, large buffers) as if memory were infinite and get killed under pressure. The tell-tale symptom is an app that works perfectly in a quick demo and falls apart the moment it is interrupted by a call, backgrounded, rotated, or run on a bad connection.",
    "efficientWay": {
      "title": "Adopting the Mindset",
      "approaches": [
        {
          "name": "Assume interruption and resource scarcity by default; react to the system, save state early, tolerate offline",
          "verdict": "best",
          "reason": "Matches reality — the OS is genuinely in control. Designing for it from the start prevents the whole class of 'works in demo, breaks in the wild' bugs."
        },
        {
          "name": "Add lifecycle and offline handling after the happy path works",
          "verdict": "weak",
          "reason": "These concerns are structural. Retrofitting state saving and offline support means reworking your data flow, not adding a patch."
        },
        {
          "name": "Rely on the framework's defaults to handle lifecycle for you",
          "verdict": "ok",
          "reason": "Frameworks help, but they cannot know which state matters to save or when your work is safe to lose — you still must design for interruption."
        }
      ],
      "recommendation": "Internalize that the OS runs you, not the other way around. Design every screen to be interrupted at any instant: react to lifecycle callbacks, persist state early and often, keep a local source of truth, and never block the UI thread. Make interruption the default assumption, not an edge case."
    },
    "commonMistakes": [
      "Assuming the app keeps running in the background and losing in-progress work when the OS reclaims it",
      "Blocking the UI thread with network or disk work and triggering an ANR or watchdog kill",
      "Treating the network as always available and hanging or crashing when offline",
      "Holding sensors, wake locks, or large buffers as if memory and battery were infinite"
    ],
    "seniorNotes": "The single most important mental model in mobile is 'the OS is in charge'. Senior engineers design every feature around involuntary interruption and involuntary death: any screen can be backgrounded and killed between two taps, so state persistence and restoration are not features but table stakes. They also default to a local-first data architecture — the UI reads from a local store that syncs in the background — because it makes offline tolerance and fast startup fall out for free. If you find yourself assuming 'the app will still be alive when the network call returns', you have reverted to the desktop mindset.",
    "interviewQuestions": [
      "How does the mobile developer mindset differ from the web or desktop mindset, and why?",
      "What does 'the OS is in charge' mean in practice for how you structure an app?",
      "Why is event-driven, lifecycle-aware code the default on mobile rather than a program with its own main loop?"
    ],
    "interviewAnswers": [
      "On desktop or web, your program is largely in control — it owns its main loop, runs until it exits, and can assume stable resources. On mobile the OS is in control: it starts, pauses, backgrounds, and kills your app based on what the user is doing and how scarce resources are. So the mindset shifts to writing event-driven code that reacts to system callbacks, lifecycle-aware code that saves state whenever it might be backgrounded, offline-tolerant code that assumes the network can vanish, and resource-conscious code that treats battery, memory, and CPU as budgets. You are not running a program; you are responding to a system that runs you.",
      "It means I never assume my app is alive, focused, or resourced. In practice: I persist unsaved state at every 'about to lose focus' callback because I may not resume; I keep a local source of truth so the UI works when the network is gone; I offload any slow work off the UI thread so the OS watchdog does not kill me; and I release sensors, memory, and wake locks the moment I am backgrounded. Every screen is designed to be interrupted and killed at any instant and to restore cleanly.",
      "Because control genuinely belongs to the OS, so there is no long-lived main loop for you to own — between events your app may be frozen or terminated. The system hands you discrete moments: a lifecycle transition, a touch, a sensor reading, a low-memory warning, a notification. Structuring code as handlers for those events, and treating each 'losing focus' event as a chance to save state, is the only design that survives being paused and reclaimed at arbitrary times. A self-driven loop would fight the platform and lose work."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Desktop loop vs mobile event handlers (pseudocode)",
        "code": "// DESKTOP: you own the loop; you decide when to stop\nfunction main():\n    while running:\n        input = waitForInput()\n        update(input)\n        render()\n    // exits when YOU decide\n\n// MOBILE: the OS owns you; you react to its callbacks\nonCreate():   loadState()            // system created you\nonResume():   startSensors()         // you are in front\nonPause():    saveStateNow()         // you MIGHT not come back\nonStop():     releaseResources()     // you are hidden\nonLowMemory(): shedCaches()          // OS is under pressure\nonDestroy():  cleanup()              // OS reclaimed you\n\n// Rule: treat onPause as your last safe moment to persist."
      }
    ],
    "resources": [
      {
        "label": "Android activity lifecycle",
        "url": "https://developer.android.com/guide/components/activities/activity-lifecycle",
        "kind": "docs"
      },
      {
        "label": "iOS managing your app's life cycle",
        "url": "https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle",
        "kind": "docs"
      },
      {
        "label": "Android app fundamentals",
        "url": "https://developer.android.com/guide/components/fundamentals",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "mobile-hardware-constraints",
    "phase": 0,
    "phaseName": "Mobile Foundations",
    "orderIndex": 6,
    "estimatedMins": 35,
    "prerequisites": [
      "what-is-mobile",
      "mobile-dev-mindset"
    ],
    "title": "Hardware Constraints: Battery, Memory, CPU, Network",
    "eli5": "A phone has a small battery, a small amount of memory, a chip that gets hot if it works too hard, and an internet connection that costs battery every time it turns on. So a phone app is like packing for a hike: you carry as little as possible, use each resource carefully, and know that if you overload your pack you will run out of energy before you reach the top.",
    "analogy": "Managing a phone's resources is like running a tiny food truck instead of a big restaurant. You have one small fridge (memory), one generator with limited fuel (battery), a couple of burners that overheat if you run them full-blast (CPU/thermal), and deliveries that only come sometimes (network). Success is not doing more — it is doing exactly enough with what little you have, and never letting the generator run dry.",
    "explanation": "On mobile, every design decision is a resource tradeoff, because the four core resources — battery, memory, CPU, and network — are all scarce and interlinked. Battery is the master constraint: CPU cycles, screen brightness, and especially the radios all draw from it, and once it is gone the device is useless. Memory is limited and shared across every running app, so when it runs low the OS kills background apps to protect the foreground — meaning your app's continued existence depends on staying lean. CPU is fast but generates heat, and sustained heavy work triggers thermal throttling, where the system deliberately slows the chip to cool it, so a burst of work is fine but a long grind backfires. Network is the most expensive of all in battery terms because activating the cellular radio has a large fixed energy cost with a long tail, so many small requests cost far more than one batched request. Every feature you add spends from these budgets, and the art of mobile engineering is spending them wisely.\n\nAndroid vs iOS callout: Android surfaces these limits explicitly — onTrimMemory and the low-memory killer (lmkd) for memory pressure, Doze mode and App Standby to cut background battery use, and JobScheduler/WorkManager to batch and defer work to efficient windows. iOS surfaces them through didReceiveMemoryWarning and the Jetsam killer for memory, aggressive app suspension and background-task budgets for battery, and BackgroundTasks / coalesced networking to batch radio use. Both give you the same signals: shed memory when warned, and batch background and network work.",
    "technicalDeep": "The radio energy model is the key insight most developers miss: cellular radios have power states, and moving from idle to active is expensive and stays elevated for a tail period after your transfer ends. So ten separate requests keep the radio hot far longer than one combined request of the same total size — batching and coalescing save more battery than shrinking payloads. Memory pressure escalates in stages: the OS first asks apps to trim caches, then kills the least-important background processes; your app can be terminated purely for being backgrounded while memory is tight. Thermal throttling is a feedback loop: sustained CPU or GPU load raises die temperature, the governor lowers clock speed to protect the hardware, and your app gets slower precisely when it is doing the most work — so heavy tasks should be chunked, deferred, or moved to more efficient cores. Network additionally costs the user money on metered connections, so respecting metered state matters beyond battery.\n\nAndroid vs iOS callout: On Android, Doze batches deferred work into maintenance windows when the device is idle, and WorkManager lets you declare constraints (charging, unmetered network) so the system runs your job at an efficient time. On iOS, the system coalesces discretionary network tasks and background refresh into energy-efficient windows and enforces strict background execution budgets. The unifying rule: tell the system what your work needs and let it schedule for efficiency, rather than forcing work to run now.",
    "whatBreaks": "Ignoring the resource budgets produces the most common one-star reviews. Chatty networking — polling every few seconds or firing many small requests — keeps the radio hot and drains the battery noticeably, and users blame your app. Holding large bitmaps, unbounded caches, or leaked objects inflates memory until the OS kills the app in the background, so users return to find it restarted and their state gone. Grinding the CPU (heavy parsing, decoding, or animation on the main thread) triggers thermal throttling and jank, and on a budget device it is far worse than on the flagship you tested on. Ignoring metered-network state runs up users' data bills. Each of these works fine in a short demo on a good device and fails in sustained real-world use.",
    "efficientWay": {
      "title": "Spending the Resource Budget Well",
      "approaches": [
        {
          "name": "Batch and defer network and background work, cap memory, chunk heavy CPU work, and let the OS schedule for efficiency",
          "verdict": "best",
          "reason": "Attacks the biggest costs directly: batching cuts radio tail-energy, memory caps prevent background kills, and deferring to system windows uses the most efficient conditions."
        },
        {
          "name": "Optimize payload size and code speed but keep the same request cadence",
          "verdict": "ok",
          "reason": "Helps, but misses the dominant cost — radio wake frequency and background scheduling matter more than bytes or microseconds for battery."
        },
        {
          "name": "Do the work eagerly now and rely on the device being powerful enough",
          "verdict": "weak",
          "reason": "Fails on the mid-range and budget devices most users carry, and drains battery and triggers throttling under sustained load."
        }
      ],
      "recommendation": "Treat every resource as a budget. Coalesce network calls and defer non-urgent work to system-scheduled windows (charging, unmetered, idle); keep memory bounded and release it on pressure warnings; chunk or offload heavy CPU work to avoid throttling and UI jank. Let the OS decide when to run deferrable work — it knows the most efficient moment."
    },
    "commonMistakes": [
      "Polling or firing many small network requests, keeping the radio hot and draining the battery",
      "Holding large bitmaps or unbounded caches until the OS kills the app in the background",
      "Running heavy CPU work on the main thread, causing thermal throttling and jank on real devices",
      "Ignoring metered-network state and running up the user's mobile data bill"
    ],
    "seniorNotes": "The most valuable and least intuitive lesson is the radio energy model: on cellular, request frequency dominates battery cost far more than payload size, because waking the radio has a large fixed cost and a long tail. So the highest-leverage battery optimization is usually to coalesce and defer network work, not to compress it. Senior engineers profile on real mid-range hardware, watch for thermal throttling under sustained load, and lean on the OS schedulers (declaring constraints like charging and unmetered rather than forcing work to run immediately). They also treat memory as a survival budget: staying lean is what keeps your app alive in the background, so unbounded caches and leaks are reliability bugs, not just performance nits.",
    "interviewQuestions": [
      "Why do many small network requests cost more battery than one larger batched request?",
      "What is thermal throttling, and how should it change the way you schedule heavy work?",
      "Why does memory usage affect whether your app survives in the background, and what should you do about it?"
    ],
    "interviewAnswers": [
      "Because of the cellular radio's energy model. Moving the radio from idle to active has a large fixed energy cost and stays in an elevated-power state for a tail period after the transfer finishes. Ten separate requests wake and re-wake the radio and keep it hot across a long span, while one batched request of the same total bytes pays that wake cost once. So request frequency, not payload size, dominates battery use — coalescing and batching are the highest-leverage battery optimization, which is exactly what schedulers like WorkManager on Android and coalesced background networking on iOS are designed to enable.",
      "Thermal throttling is when the system deliberately lowers the CPU or GPU clock speed to reduce heat and protect the hardware after sustained heavy load. The effect is a feedback trap: your app gets slower precisely when it is working hardest, and it is far worse on budget devices with weaker cooling. So heavy work should be chunked into short bursts, deferred to idle or charging windows, or offloaded off the main thread and onto more efficient cores. A brief burst is fine; a long sustained grind backfires into throttling and jank.",
      "Because memory is shared across all apps, and when it runs low the OS kills background processes to keep the foreground app responsive — least-important and largest first. If your app holds large bitmaps, unbounded caches, or leaked objects, it becomes a prime target and gets terminated while backgrounded, so the user returns to a cold restart with lost state. The fix is to keep memory bounded, release caches on the system's low-memory warnings (onTrimMemory on Android, didReceiveMemoryWarning on iOS), and avoid leaks — staying lean is what keeps the app alive."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Batch and defer instead of firing eagerly (pseudocode)",
        "code": "// BAD: chatty polling keeps the radio hot -> battery drain\nevery(5.seconds):\n    fetch(\"/updates\")            // wakes radio again and again\n\n// GOOD: batch, and defer non-urgent work to an efficient window\nworkQueue.enqueue(\n    task     = syncAllUpdates,   // one combined round trip\n    requires = [ UNMETERED_NETWORK, DEVICE_IDLE ],  // constraints\n    urgency  = DEFERRABLE\n)\n// The OS runs it in a batched maintenance window (e.g. Doze /\n// coalesced background networking) -> radio wakes once.\n\n// Memory: respond to pressure or be killed in the background\nonLowMemory():\n    imageCache.clear()\n    releaseNonEssentialBuffers()\n\n// CPU: chunk heavy work so it does not overheat/throttle\nfunction processLargeDataset(items):\n    for chunk in items.inChunksOf(200):\n        offloadToBackgroundThread(chunk)   // keep UI thread free\n        yieldBriefly()                     // avoid a long hot grind"
      },
      {
        "lang": "kotlin",
        "label": "Android: defer work to an efficient window with WorkManager",
        "code": "// Declare WHAT the work needs; let the OS pick WHEN to run it.\nval constraints = Constraints.Builder()\n    .setRequiredNetworkType(NetworkType.UNMETERED)  // no data bill\n    .setRequiresCharging(true)                      // save battery\n    .build()\n\nval syncWork = OneTimeWorkRequestBuilder<SyncWorker>()\n    .setConstraints(constraints)\n    .build()\n\nWorkManager.getInstance(context).enqueue(syncWork)\n// The system batches this into an efficient window instead of\n// waking the radio and CPU right now. iOS mirrors this with\n// BGTaskScheduler and coalesced background tasks."
      }
    ],
    "resources": [
      {
        "label": "Android processes and app lifecycle (memory and kills)",
        "url": "https://developer.android.com/guide/components/activities/process-lifecycle",
        "kind": "docs"
      },
      {
        "label": "Android platform architecture",
        "url": "https://developer.android.com/guide/platform",
        "kind": "docs"
      },
      {
        "label": "iOS managing your app's life cycle",
        "url": "https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle",
        "kind": "docs"
      }
    ]
  }
]
