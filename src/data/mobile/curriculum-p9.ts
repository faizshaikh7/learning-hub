import type { CurriculumTopic } from '@/types'

/** Phase 9 — Performance, Testing & Observability. Concept-first, framework-agnostic. */
export const MOBILE_P9: CurriculumTopic[] = [
  {
    "id": "mobile-profiling",
    "phase": 9,
    "phaseName": "Performance, Testing & Observability",
    "orderIndex": 1,
    "estimatedMins": 35,
    "prerequisites": [],
    "title": "Profiling: Startup, Memory, Battery, Network",
    "eli5": "Before you try to make an app faster, you have to measure where it is actually slow. Guessing wastes time. Profilers are like a doctor's tests: they tell you what is really wrong instead of you assuming.",
    "analogy": "Optimizing without profiling is like renovating a house because you think a room is cold, when the real problem is a broken window somewhere else. A profiler is the thermal camera that shows you exactly where the heat is leaking so you fix the right thing.",
    "explanation": "The first rule of performance is: measure before you optimize. Intuition about what is slow is wrong often enough that untargeted optimization usually wastes effort and can even make things worse. A profiler records what the app actually does — where time goes, where memory is allocated, what drains the battery, what hits the network — so you fix the real bottleneck.\n\nMobile performance has four dimensions worth profiling. Startup time: how long from tap to a usable screen (cold start from nothing, warm start from background). Memory: heap usage, leaks that grow over time, and being killed by the OS for using too much. Battery: CPU wakeups, GPS, radio usage, and background work that drains the device. Network: request count, payload size, redundant calls, and time spent waiting. Each has its own tools and its own units, and you optimize them separately.\n\nHow Android does it vs How iOS does it: Android uses Android Studio Profiler (CPU, memory, energy, network views), plus Macrobenchmark and Baseline Profiles for startup, and systrace/Perfetto for system-level traces. iOS uses Xcode Instruments with templates like Time Profiler, Allocations/Leaks, Energy Log, and Network. Different tools, identical discipline: capture a trace on a real device, find the biggest cost, fix it, measure again.",
    "technicalDeep": "Profile on real devices, ideally low-end ones, because emulators and flagship phones hide the problems your median user feels. Distinguish cold start (process created, app + first frame drawn from scratch) from warm/hot start (process or activity reused) — they have very different costs and fixes. For startup, the wins are usually deferring work off the critical path: lazy-initialize SDKs, avoid heavy work on the main thread before first frame, and (on Android) ship a Baseline Profile so hot code paths are precompiled. For memory, watch for retained references (leaked contexts/controllers, unbounded caches, listeners never removed) that make the heap grow until the OS kills the app. For battery, minimize wakeups and radio use by batching network and background work. For network, measure payload sizes and round-trips; a profiler plus a proxy shows redundant or oversized calls.\n\nHow Android does it vs How iOS does it: Android's Macrobenchmark library measures startup and jank in a repeatable, CI-friendly way and Baseline Profiles cut cold start via ahead-of-time compilation; iOS uses XCTest performance metrics (XCTApplicationLaunchMetric and friends) and Instruments for the same measurements. Both let you turn a one-off trace into a tracked, regression-guarded metric.",
    "whatBreaks": "Optimizing the wrong thing because nobody profiled — rewriting a function that costs 2ms while a synchronous 400ms disk read on startup goes untouched. Profiling only on a fast device, so the median user's jank and slow start never show up. Confusing the four dimensions: shrinking memory while ignoring that the real complaint is battery drain from GPS. Measuring in a debug build (which is far slower and allocates differently) and drawing conclusions that do not hold in release.",
    "efficientWay": {
      "title": "Approaching a performance problem",
      "approaches": [
        {
          "name": "Profile on a real low-end device, fix the biggest cost, re-measure",
          "verdict": "best",
          "reason": "Targets the actual bottleneck your median user feels, and the re-measure confirms the fix worked rather than assuming it did. This is the whole discipline in one loop."
        },
        {
          "name": "Add metrics/logging around suspected hotspots and analyze",
          "verdict": "ok",
          "reason": "Useful when a profiler is impractical (production, intermittent issues), but manual instrumentation is coarse and can miss the real cost or add its own overhead."
        },
        {
          "name": "Optimize based on intuition without measuring",
          "verdict": "weak",
          "reason": "Intuition about performance is frequently wrong, so you often speed up code that was never the bottleneck and sometimes add complexity or bugs for no gain."
        }
      ],
      "recommendation": "Always measure first, on a representative (low-end, release-build) device. Identify the single biggest cost in the relevant dimension, fix that, then measure again. Promote the metrics that matter (cold start, key screen memory) into automated benchmarks so regressions are caught in CI."
    },
    "commonMistakes": [
      "Optimizing before profiling and speeding up code that was never the bottleneck",
      "Profiling only on high-end devices, hiding the jank and slow startup real users experience",
      "Measuring in a debug build and assuming the numbers hold in release",
      "Conflating the four dimensions and fixing memory when the real complaint is battery or network"
    ],
    "seniorNotes": "Turn ad-hoc profiling into tracked metrics. A one-time fix regresses the moment someone adds a synchronous init on the startup path; a benchmark in CI catches it. Pick a small set of headline numbers — cold start on a low-end device, memory on your heaviest screen, requests per key flow — and guard them. Also learn to read a trace: the skill that separates seniors is looking at a flame graph or systrace and immediately spotting the main-thread stall, not just reading a summary number.",
    "interviewQuestions": [
      "Why is 'measure before you optimize' the first rule of performance work?",
      "What are the four dimensions of mobile performance and why profile them separately?",
      "Why should you profile on a low-end device and in a release build?"
    ],
    "interviewAnswers": [
      "Because intuition about where time and resources go is frequently wrong, so untargeted optimization wastes effort and can add complexity or bugs while the real bottleneck goes untouched. A profiler shows the actual cost, so you fix the thing that matters and can verify the fix by re-measuring.",
      "Startup time, memory, battery, and network. They have different causes, tools, and units — a memory leak, a GPS-driven battery drain, and a chatty network flow are unrelated problems — so you measure and optimize each on its own rather than assuming one fix helps another.",
      "Low-end devices reveal the jank and slow starts your median user actually feels, which flagship phones hide. Release builds have different optimization, allocation, and (on Android) compilation behavior than debug builds, so debug numbers can be misleading; you want measurements that reflect what ships."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "The profile-fix-remeasure loop (pseudocode)",
        "code": "// 1. MEASURE first, on a real low-end device, release build\ntrace = profiler.captureColdStart(device = \"low_end\", build = \"release\")\n\n// 2. Find the single biggest cost (do not guess)\nhotspot = trace.topCost()\n// e.g. \"MainThread: 380ms synchronous DB read before first frame\"\n\n// 3. Fix that one thing (move off the critical path)\ndeferToBackground(dbRead)\nlazyInit(analyticsSdk)   // was blocking startup\n\n// 4. MEASURE again to confirm the win\nafter = profiler.captureColdStart(device = \"low_end\", build = \"release\")\nassert after.coldStartMs < trace.coldStartMs\n\n// 5. Lock it in: promote to a CI benchmark so it cannot regress\nci.benchmark(\"cold_start_low_end\", budgetMs = 1500)"
      }
    ],
    "resources": [
      {
        "label": "Android Performance",
        "url": "https://developer.android.com/topic/performance",
        "kind": "docs"
      },
      {
        "label": "Android Testing (benchmarking)",
        "url": "https://developer.android.com/training/testing",
        "kind": "docs"
      },
      {
        "label": "Apple Security Framework (platform docs hub)",
        "url": "https://developer.apple.com/documentation/security",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "render-performance",
    "phase": 9,
    "phaseName": "Performance, Testing & Observability",
    "orderIndex": 2,
    "estimatedMins": 35,
    "prerequisites": [
      "mobile-profiling"
    ],
    "title": "Rendering Performance & Jank Hunting",
    "eli5": "A smooth app draws a new picture many times a second. If it takes too long to draw one picture, the screen stutters — that stutter is called jank. Hunting jank means finding what makes a single frame take too long.",
    "analogy": "Animation is a flip-book: flip the pages fast and steady and it looks smooth. Jank is when one page takes too long to draw, so the whole book hitches. Your job is to find the page that is doing too much work and lighten it.",
    "explanation": "The screen refreshes at a fixed rate (commonly 60Hz, so ~16.7ms per frame; 120Hz means ~8.3ms). To feel smooth, your app must produce each frame within that budget. When a frame misses the deadline, the previous frame is shown again — a dropped frame, perceived as a stutter or 'jank'. Jank hunting is the systematic search for whatever pushes a frame over budget.\n\nThe usual culprits: doing heavy work on the main/UI thread (parsing, disk or network I/O, big computations) so it cannot draw in time; overdraw (painting the same pixel many times through stacked opaque layers); expensive or deeply nested layout that recalculates too much; and large or un-decoded images processed during the frame. The fix pattern is consistent: get non-UI work off the main thread, flatten and simplify layouts, reduce overdraw, and move image decoding and heavy computation off the critical path.\n\nHow Android does it vs How iOS does it: Android exposes frame timing via the Profiler, systrace/Perfetto, and the Jank stats (FrameMetrics / JankStats library), and the GPU overdraw debug overlay; the golden rule is keep work off the main thread. iOS uses Instruments (Core Animation / Time Profiler) and the frame rate is driven by the render loop; the equivalent rule is keep work off the main thread so the CADisplayLink-driven commit finishes in time. Same physics — a fixed per-frame budget — with platform-specific tools to see where it is blown.",
    "technicalDeep": "A frame is produced by a pipeline: handle input, run app logic, lay out and record drawing commands (on the main/UI thread), then hand off to the GPU for rasterization and composition. Jank appears when any main-thread stage overruns the budget. Diagnose by capturing a frame timeline and finding long main-thread segments: a synchronous decode, a layout pass triggered by a change that invalidates the whole tree, or allocation-driven GC pauses. Overdraw is measured as how many times each pixel is painted; opaque backgrounds stacked on opaque backgrounds waste GPU time, so you remove redundant backgrounds and flatten view hierarchies. For lists, recycle/reuse item views and avoid per-frame allocations. Long-scrolling jank is often item layout cost or image decode on the scroll thread; precompute or decode ahead of time. The recurring theme: the main thread is sacred — anything that can happen elsewhere must.\n\nHow Android does it vs How iOS does it: Android's JankStats and FrameMetrics report per-frame durations you can log in production; iOS uses Instruments' Core Animation FPS and hitches metrics (and MetricKit's hitch data in production). Both let you move from 'it feels janky' to 'this frame took 41ms and here is the main-thread stall'.",
    "whatBreaks": "Running I/O, JSON parsing, or bitmap decode on the main thread so scrolling stutters. Deep view hierarchies and heavy layout recalculated every frame. Overdraw from stacked opaque backgrounds burning GPU time. Allocating in the hot path so garbage collection pauses land mid-animation. Loading full-resolution images into small views, decoding them synchronously as they scroll into view. Each shows up as dropped frames precisely when the user is interacting, which is the worst time.",
    "efficientWay": {
      "title": "Fixing a janky screen",
      "approaches": [
        {
          "name": "Capture frame timing, find the main-thread stall, move that work off-thread",
          "verdict": "best",
          "reason": "Directly attacks the cause — a specific over-budget frame stage — and offloading from the main thread is the fix that reliably restores smoothness. Data-driven and verifiable."
        },
        {
          "name": "Reduce overdraw and flatten layouts across the screen broadly",
          "verdict": "ok",
          "reason": "Real, worthwhile wins and good general hygiene, but applied blindly without frame timing you may polish areas that were not the actual bottleneck."
        },
        {
          "name": "Sprinkle caching and 'optimizations' by intuition",
          "verdict": "weak",
          "reason": "Without frame data you often add complexity and memory pressure without fixing the stall, and caching the wrong thing can create new bugs and even more jank."
        }
      ],
      "recommendation": "Capture the frame timeline first, locate the specific over-budget stage, and move that work off the main thread (I/O, decode, computation). Then apply broad hygiene — flatten layouts, cut overdraw, avoid hot-path allocation — and re-measure against the frame budget."
    },
    "commonMistakes": [
      "Doing I/O, parsing, or image decoding on the main/UI thread",
      "Deep, complex view hierarchies that trigger expensive layout every frame",
      "Overdraw from stacked opaque backgrounds wasting GPU time",
      "Allocating in the hot path so GC pauses interrupt animations and scrolling"
    ],
    "seniorNotes": "Internalize the frame budget as a hard deadline: at 60Hz you have ~16ms to do everything, and the main thread must spend most of it drawing, not working. The highest-leverage habit is ruthless main-thread discipline — treat any I/O, decode, or nontrivial computation on it as a bug. In production, sample real-device jank (JankStats / MetricKit hitches) so you see the stutters users actually hit on devices you do not own, not just the smooth experience on your dev phone. And remember higher refresh rates shrink the budget: 120Hz halves your time.",
    "interviewQuestions": [
      "What is jank, and how does the frame budget cause it?",
      "What are the most common causes of dropped frames and how do you fix them?",
      "Why is keeping work off the main thread the central rule of rendering performance?"
    ],
    "interviewAnswers": [
      "Jank is a visible stutter caused by a frame missing its deadline. The screen refreshes on a fixed budget — about 16.7ms at 60Hz — and if the app cannot produce the next frame in time, the old frame is shown again, which the eye perceives as a hitch, especially during scrolling or animation.",
      "The big ones are main-thread work (I/O, parsing, image decode), overly deep layouts recalculated each frame, overdraw from stacked opaque backgrounds, and hot-path allocations causing GC pauses. You fix them by moving non-UI work off the main thread, flattening hierarchies, removing redundant backgrounds, and decoding/precomputing ahead of the frame.",
      "Because the main/UI thread is the only thread that can lay out and record the frame, so anything else running on it steals from the frame budget and directly causes dropped frames. Offloading I/O, decoding, and computation to background threads keeps the main thread free to hit its deadline every frame."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Jank diagnosis and fix (pseudocode)",
        "code": "FRAME BUDGET: 60Hz -> ~16.7ms per frame (120Hz -> ~8.3ms)\n\n// Capture per-frame timings while scrolling\nframes = jankStats.record(scrollSession)\njanky  = frames.filter { it.durationMs > 16.7 }\n// janky[0]: 41ms  -> main thread: \"decodeBitmap 28ms\"\n\n// BAD: decode on the main thread as items scroll in\nonBindItem(item):\n    imageView.set(decode(item.fullResBytes))   // 28ms on UI thread = jank\n\n// GOOD: decode off-thread, at the right size, then hand back a ready bitmap\nonBindItem(item):\n    background {\n        bmp = decodeScaled(item.bytes, targetSize = imageView.size)\n    } then onMain { imageView.set(bmp) }        // main thread just draws\n\n// Also: flatten the item layout, remove the opaque bg behind an opaque card\n// Re-measure: janky frames should drop to ~0"
      }
    ],
    "resources": [
      {
        "label": "Android Performance (rendering & jank)",
        "url": "https://developer.android.com/topic/performance",
        "kind": "docs"
      },
      {
        "label": "Android Testing (benchmarking jank)",
        "url": "https://developer.android.com/training/testing",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "app-size-optimization",
    "phase": 9,
    "phaseName": "Performance, Testing & Observability",
    "orderIndex": 3,
    "estimatedMins": 30,
    "prerequisites": [
      "mobile-profiling"
    ],
    "title": "App Size Optimization",
    "eli5": "The bigger your app's download, the more people give up before it finishes installing, especially on slow networks. Making the app smaller means more people actually install it.",
    "analogy": "App size is like the price tag on an impulse buy. A small, quick download is grabbed without thinking; a huge one makes people hesitate and walk away — the checkout line where you lose customers is the install progress bar.",
    "explanation": "Install size directly affects conversion: larger downloads have measurably higher abandonment, worse on slow or metered connections and low-storage devices. So shrinking the app is a growth lever, not just tidiness. Size comes from code, resources (images, fonts, media), native libraries, and bundled assets — and each has a reduction technique.\n\nThe main levers: code shrinking and dead-code elimination remove unused classes and methods; resource shrinking strips unreferenced assets; compressing and right-sizing images and using efficient formats cuts the biggest resource offender; and — most impactfully — delivering only what each device needs instead of one universal package that contains every screen density, CPU architecture, and language. That last idea, split delivery, is where the largest wins usually live.\n\nHow Android does it vs How iOS does it: Android uses the Android App Bundle (AAB): you upload one bundle and the store generates optimized APKs per device (only the needed density, ABI, and language), plus R8 for code/resource shrinking and Play Feature Delivery / Play Asset Delivery for on-demand modules and assets. iOS uses App Thinning: the App Store slices the app so each device downloads only its needed variant, plus on-demand resources for assets fetched after install and bitcode/optimization from the compiler. Same principle — deliver the minimum this device needs — with platform-specific packaging.",
    "technicalDeep": "A universal build is wasteful because it ships resources for every device: multiple screen-density image sets, every CPU architecture's native libraries, and all localized strings, when any one device needs just one slice of each. Split delivery (App Bundle / App Thinning) reduces download size substantially by generating per-device artifacts. On top of that, code shrinking (R8/tree-shaking) removes unreachable code and, combined with obfuscation, also shrinks method names; resource shrinking removes assets nothing references. Beyond the base install, on-demand delivery lets rarely used features or large media download only when needed (Play Feature/Asset Delivery, iOS On-Demand Resources), keeping the initial install lean. Practically you audit the size breakdown with the platform's APK/app-size analyzer to see whether code, images, or native libs dominate, then attack the biggest slice first — usually images or an over-broad set of bundled architectures.\n\nHow Android does it vs How iOS does it: Android's bundle explorer / APK Analyzer shows the per-device split sizes; Xcode's App Thinning size report and the App Store Connect size report show per-variant download and install sizes. Both let you verify the delivered size, not just the build size.",
    "whatBreaks": "Shipping a universal APK with every density and ABI, doubling or tripling the download for no benefit. Bundling uncompressed or oversized images and full-resolution art for thumbnails. Including every architecture's native libraries when the store could slice them. Never enabling code/resource shrinking, so dead code from dependencies ships to users. Packing large media (videos, ML models) into the base install instead of downloading on demand, inflating the very first download users must complete.",
    "efficientWay": {
      "title": "Reducing install size",
      "approaches": [
        {
          "name": "Split delivery (App Bundle / App Thinning) + code/resource shrinking + on-demand assets",
          "verdict": "best",
          "reason": "Each device downloads only its slice, dead code and unused resources are stripped, and large or rare assets load on demand — the combination gives the biggest, broadest reduction with no feature loss."
        },
        {
          "name": "Compress and right-size images and media only",
          "verdict": "ok",
          "reason": "Images are often the largest slice so this genuinely helps, but on its own it leaves the multi-density/multi-ABI universal-build waste and dead code on the table."
        },
        {
          "name": "Ship a universal build and hope users tolerate the size",
          "verdict": "weak",
          "reason": "Every device downloads resources it will never use, install conversion suffers on slow networks and low-storage phones, and you leave easy, no-downside wins unclaimed."
        }
      ],
      "recommendation": "Use the platform's split-delivery mechanism so devices download only their variant, turn on code and resource shrinking, right-size and compress media, and move large or infrequently used assets to on-demand delivery. Verify with the size analyzer that the delivered (not build) size actually dropped."
    },
    "commonMistakes": [
      "Shipping a universal package with all densities, architectures, and languages instead of split delivery",
      "Bundling uncompressed or full-resolution images where smaller/efficient formats would do",
      "Leaving code and resource shrinking disabled so dead dependency code ships to users",
      "Packing large media or models into the base install instead of downloading them on demand"
    ],
    "seniorNotes": "Measure delivered size, not build size — the number that affects conversion is what the store actually sends a given device after slicing, and that can be far smaller than your build output. Attack the biggest slice first using the size analyzer; teams often spend hours on code shrinking while a few oversized images or an extra bundled ABI dwarf the savings. Treat install size as a tracked metric with a budget, because dependencies and assets creep upward release over release, and a size regression quietly costs installs.",
    "interviewQuestions": [
      "Why does install size affect conversion, and where does app size usually come from?",
      "What is split delivery (App Bundle / App Thinning) and why is it the biggest lever?",
      "When would you use on-demand asset delivery instead of bundling assets in the install?"
    ],
    "interviewAnswers": [
      "Larger downloads have higher abandonment, especially on slow or metered networks and low-storage devices, so a smaller app converts more installs. Size comes from code, resources (mainly images and media), native libraries, and bundled assets, and you reduce each with its own technique.",
      "Split delivery means uploading one artifact and letting the store generate per-device downloads that contain only the needed screen density, CPU architecture, and language, instead of a universal build with all of them. It is the biggest lever because a universal package ships large amounts of data no single device uses, and slicing removes that waste with zero feature loss.",
      "When assets are large, optional, or used by only some users — think high-res media packs, extra levels, or ML models. Delivering them on demand keeps the initial install small so first-download conversion stays high, and the user only pays the size cost if and when they actually use the feature."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Where size goes and how to cut it (pseudocode)",
        "code": "// Universal build (BAD): every device downloads everything\nuniversal.apk = code\n              + images@[mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi]  // 5x density sets\n              + nativeLibs@[arm64, armv7, x86, x86_64]    // 4x ABIs\n              + strings@[all 30 locales]\n// one phone needs ~1 density + 1 ABI + 1 locale -> most of this is waste\n\n// Split delivery (GOOD): store slices per device\nupload(appBundle)      // Android AAB / iOS App Thinning\n// device A downloads: code + images@xxhdpi + arm64 + en  -> much smaller\n\n// Plus shrink and defer\nenable(codeShrinking)      // R8 / tree-shaking removes dead code\nenable(resourceShrinking)  // strips unreferenced assets\ndeliverOnDemand(largeVideoPack, mlModel)  // not in base install\n\n// Verify DELIVERED size, not build size\nassert sizeAnalyzer.deliveredSize(device = \"A\") < budgetMB"
      }
    ],
    "resources": [
      {
        "label": "Android Performance (app size)",
        "url": "https://developer.android.com/topic/performance",
        "kind": "docs"
      },
      {
        "label": "Android Testing",
        "url": "https://developer.android.com/training/testing",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "mobile-testing-pyramid",
    "phase": 9,
    "phaseName": "Performance, Testing & Observability",
    "orderIndex": 4,
    "estimatedMins": 35,
    "prerequisites": [],
    "title": "The Mobile Testing Pyramid",
    "eli5": "You want lots of tiny fast tests, some medium ones, and just a few big slow ones that drive the whole app like a real user. Too many big slow tests and your test suite becomes slow and flaky.",
    "analogy": "The testing pyramid is like quality control in a factory: cheap fast checks on every small part (unit), a few checks on assembled sub-modules (integration), and a small number of final full-product test drives (E2E). You do not road-test every screw; you road-test the finished car a few times.",
    "explanation": "The testing pyramid is a guideline for how to balance test types. The base is many fast, isolated unit tests (pure logic, no UI, no device). Above that, UI/widget tests that render a component or screen in isolation and assert on its behavior. Then integration tests that check several pieces working together (for example, a screen plus its data layer). At the narrow top, a few end-to-end (E2E) tests that drive the whole app on a device or emulator like a real user. The shape is intentional: lots of cheap fast tests at the bottom, few expensive slow tests at the top.\n\nWhy the shape? Unit tests are fast, deterministic, and pinpoint failures, so you want many. E2E tests give the most realistic confidence but are slow, expensive to run, and prone to flakiness (timing, animations, network), so you want few — reserved for critical user journeys. Getting the balance wrong (an 'ice-cream cone' of mostly E2E tests) yields a slow, flaky suite people learn to ignore.\n\nHow Android does it vs How iOS does it: Android uses JUnit/Robolectric for unit tests, Compose UI tests or Espresso for UI, and Espresso/UI Automator for on-device E2E. iOS uses XCTest for unit tests, XCUITest for UI/E2E, and view/snapshot tests for components. The tools differ but the pyramid — many unit, some UI/integration, few E2E — is the same on both.",
    "technicalDeep": "Decide what to test at each level by cost and what the level can catch. Unit level: business logic, validation, reducers, formatting, edge cases — no framework, runs in milliseconds, so exhaustively cover branches here. UI/widget level: does this component render the right states (loading/empty/error/data) and respond to input; run these off-device where possible for speed. Integration level: do real collaborators wire together correctly — repository plus network/DB with a fake server, navigation between screens. E2E level: a handful of critical journeys (sign in, checkout) on a real device to catch integration gaps nothing below can see. Flakiness is the tax at the top: control it with explicit waits (idling resources / expectations, never sleeps), deterministic test data, hermetic networking (mock servers), and quarantining/retrying known-flaky tests while you fix root causes. A flaky suite erodes trust faster than a missing test.\n\nHow Android does it vs How iOS does it: Android's Espresso uses IdlingResource to synchronize with async work and avoid sleeps; XCUITest uses expectations/waiters for the same reason. Both provide the synchronization primitives that keep E2E tests from flaking on timing.",
    "whatBreaks": "An inverted pyramid — mostly slow E2E tests — so CI takes forever, flakes constantly, and developers stop trusting or running it. Testing trivial getters at the unit level for coverage vanity while critical logic goes untested. E2E tests with hard-coded sleeps that flake on slow CI. Non-hermetic tests hitting real networks, so a backend hiccup fails unrelated tests. No integration tests, so units pass individually but the wired-together app is broken.",
    "efficientWay": {
      "title": "Structuring a mobile test suite",
      "approaches": [
        {
          "name": "Many unit, some UI/integration, few well-chosen E2E (true pyramid)",
          "verdict": "best",
          "reason": "Fast feedback and precise failures from the wide base, realistic confidence from a few E2E on critical journeys, and a suite that stays fast and trustworthy so people actually run it."
        },
        {
          "name": "Heavy UI/integration coverage with minimal unit tests",
          "verdict": "ok",
          "reason": "Catches real wiring bugs and can work for UI-heavy apps, but slower and less precise than unit tests, so feedback lags and failures are harder to localize."
        },
        {
          "name": "Mostly E2E tests (ice-cream cone)",
          "verdict": "weak",
          "reason": "Slow, expensive, and flaky; CI becomes a bottleneck people learn to ignore, and a single failing journey masks which underlying unit actually broke."
        }
      ],
      "recommendation": "Push logic down to fast unit tests, use UI/widget and integration tests for rendering and wiring, and reserve E2E for a small set of critical journeys. Make every async test synchronize explicitly (no sleeps), keep tests hermetic, and treat flakiness as a bug to fix, not tolerate."
    },
    "commonMistakes": [
      "Inverting the pyramid with too many slow, flaky E2E tests",
      "Chasing coverage on trivial code while critical logic stays untested",
      "Using hard-coded sleeps instead of proper synchronization, causing timing flakiness",
      "Writing non-hermetic tests that hit real networks or shared state and flake unpredictably"
    ],
    "seniorNotes": "The real enemy at scale is flakiness, not missing coverage: a suite that fails randomly gets ignored, and an ignored suite catches nothing. Invest early in synchronization primitives (idling resources / expectations), hermetic test doubles, and deterministic data, and put a flaky-test quarantine + fix process in place. Push as much logic as possible below the UI so it can be tested fast and deterministically; the more your critical behavior lives in plain, framework-free code, the wider and cheaper your pyramid base.",
    "interviewQuestions": [
      "What is the testing pyramid and why is its shape deliberately wide at the bottom?",
      "What do you test at each level, and why keep E2E tests few?",
      "Why is flakiness so damaging, and how do you control it?"
    ],
    "interviewAnswers": [
      "It is a guideline to have many fast isolated unit tests at the base, fewer UI/integration tests in the middle, and only a few full end-to-end tests at the top. The base is wide because unit tests are fast, deterministic, and pinpoint failures, so you can afford many; the top is narrow because E2E tests are slow, costly, and flaky.",
      "Unit: business logic and edge cases, no framework. UI/widget: that components render their states and handle input. Integration: that collaborators wire together, using fakes. E2E: a handful of critical user journeys on a real device. E2E stays small because it is slow and flaky, so you reserve it for confidence that only a full run can give.",
      "A flaky suite fails randomly, so developers stop trusting it and start ignoring or bypassing it, at which point it protects nothing. You control it with explicit synchronization instead of sleeps, hermetic networking and deterministic data, and a process to quarantine and fix flaky tests rather than letting them rot in the suite."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pyramid allocation and a hermetic E2E (pseudocode)",
        "code": "// Rough allocation (illustrative, not a rule)\nUNIT         ~70%   fast, no device: logic, validation, formatting\nUI/WIDGET    ~20%   render states, handle input, off-device where possible\nINTEGRATION  ~ 8%   repo + fake server, navigation between screens\nE2E          ~ 2%   a few critical journeys on a real device\n\n// GOOD E2E: hermetic + explicit synchronization (no sleeps)\ntest \"checkout journey\":\n    startFakeServer(scenario = \"happy_path\")   // hermetic, deterministic\n    launchApp()\n    tapProduct(\"Coffee Mug\")\n    tapAddToCart()\n    tapCheckout()\n    waitUntil { screen.shows(\"Order confirmed\") }  // idling/expectation, NOT sleep(3)\n    assert server.received(\"POST /orders\")\n\n// BAD: sleep(3000) then assert  -> flakes on slow CI"
      }
    ],
    "resources": [
      {
        "label": "Android Testing",
        "url": "https://developer.android.com/training/testing",
        "kind": "docs"
      },
      {
        "label": "Android Performance",
        "url": "https://developer.android.com/topic/performance",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "device-testing-farms",
    "phase": 9,
    "phaseName": "Performance, Testing & Observability",
    "orderIndex": 5,
    "estimatedMins": 30,
    "prerequisites": [
      "mobile-testing-pyramid"
    ],
    "title": "Device Fragmentation & Test Farms",
    "eli5": "There are thousands of different phones with different screen sizes, chips, and OS versions. Your app has to work on all of them, but you cannot buy every phone — so you rent them from a cloud that has all of them.",
    "analogy": "It is like designing clothing that must fit thousands of body shapes. You cannot keep a mannequin for each, so you use a fitting service that already has them all. A device farm is that fitting service for apps.",
    "explanation": "Mobile fragmentation is the reality that your app runs on an enormous range of devices: thousands of Android models with different screen sizes and densities, aspect ratios, RAM, chipsets, and manufacturer OS customizations, across many OS versions. iOS is far less fragmented but still spans several device sizes and OS versions. A bug can be specific to one screen size, one OS version, one GPU, or one vendor's tweaks — things you will never see on your single dev device.\n\nBecause you cannot own every device, you use cloud device farms: services that host real (and sometimes virtual) devices you can run your tests on remotely. You define a device matrix — a representative selection of models and OS versions chosen from your actual user analytics — and run your test suite across it, so a layout that breaks on a short-and-wide screen or a crash on an older OS is caught before release. Matrix testing is picking that representative set rather than trying to cover everything.\n\nHow Android does it vs How iOS does it: Android leans heavily on device farms (Firebase Test Lab and third-party farms) because fragmentation is severe — many vendors, skins, and OS versions in active use. iOS has a smaller matrix (a bounded set of device families and recent OS versions), so simulators plus a modest real-device set often suffice, though cloud farms still help for older hardware and edge cases. Same strategy — test a representative matrix on real devices — with Android needing a wider net.",
    "technicalDeep": "You cannot test every device, so you test a representative sample chosen from data. Pull your install base analytics and rank by device model, OS version, screen size/density bucket, and (for graphics) GPU; pick a matrix that covers the high-volume devices plus deliberate edge cases (smallest/largest screen, oldest supported OS, a low-RAM device, a notch/cutout, a foldable). Run automated E2E/UI tests across that matrix in a cloud farm, which returns per-device logs, screenshots, videos, and crash traces so you can see exactly where it failed. Prioritize real devices over emulators for anything touching graphics, camera, sensors, or vendor-specific behavior, since emulators do not reproduce those faithfully. Combine with a tighter local set for fast iteration and reserve the full matrix for pre-release runs to control cost and time.\n\nHow Android does it vs How iOS does it: Firebase Test Lab (Android, with some iOS support) and commercial farms run your instrumentation/XCUITest suite across many models and report per-device artifacts; Xcode + simulators cover the iOS size/OS matrix cheaply, with real-device farms for the remainder. Both aim at the same output: coverage of a representative matrix without owning the hardware.",
    "whatBreaks": "Testing only on the team's few flagship phones, so layout breaks on small/large screens, crashes on older OS versions, and vendor-specific bugs ship to users and surface as one-star reviews. Choosing the matrix by guesswork instead of analytics, missing the exact devices your users actually have. Relying on emulators for camera/GPU/sensor features they cannot faithfully emulate. Running the full expensive matrix on every commit, blowing the CI budget, or the opposite — never running it, so fragmentation bugs escape.",
    "efficientWay": {
      "title": "Covering device fragmentation",
      "approaches": [
        {
          "name": "Analytics-driven device matrix on a cloud farm, real devices for the tricky bits",
          "verdict": "best",
          "reason": "Focuses effort on the devices your users actually have plus deliberate edge cases, uses real hardware where emulators lie, and gets broad coverage without owning the phones. Highest bug-catch per dollar."
        },
        {
          "name": "A handful of owned real devices covering the main size/OS spread",
          "verdict": "ok",
          "reason": "Cheap and good for daily iteration and catching obvious layout issues, but a small owned set cannot cover the long tail of models, OS versions, and vendor quirks."
        },
        {
          "name": "Test only on the team's dev phones (or only emulators)",
          "verdict": "weak",
          "reason": "Misses the fragmentation that causes real-world crashes and layout breaks; emulators do not reproduce GPU/camera/sensor or vendor behavior, so device-specific bugs ship."
        }
      ],
      "recommendation": "Choose a representative matrix from your install-base analytics (top devices plus edge cases), run automated tests across it on a cloud farm using real devices for graphics/camera/sensor paths, and keep a small local device set for fast iteration. Run the full matrix pre-release to balance coverage against cost."
    },
    "commonMistakes": [
      "Testing only on the team's flagship devices and shipping layout/OS-specific bugs",
      "Picking the device matrix by intuition instead of from user analytics",
      "Trusting emulators for camera, GPU, or sensor features they cannot faithfully reproduce",
      "Either running the full costly matrix on every commit or never running it at all"
    ],
    "seniorNotes": "Let data drive the matrix: your users concentrate on a surprisingly small set of models and OS versions, so a well-chosen matrix from analytics catches most fragmentation bugs cheaply, while a few deliberate edge cases (oldest OS, smallest/largest screen, low-RAM, foldable, cutout) catch the nasty ones. Split your strategy by cadence — a tiny fast set for every PR, the full farm matrix pre-release — to keep both speed and coverage. And always prefer real devices for anything hardware-adjacent; the bugs that reach production are usually the ones emulators structurally cannot show you.",
    "interviewQuestions": [
      "What is device fragmentation and why does it make mobile testing hard?",
      "How do you choose which devices to test on when you cannot test them all?",
      "When do you need a real device farm rather than emulators/simulators?"
    ],
    "interviewAnswers": [
      "Fragmentation is the huge diversity of devices your app must run on — thousands of Android models with different screens, chipsets, RAM, and vendor OS customizations across many OS versions (iOS less so). It is hard because bugs can be specific to one screen size, OS version, GPU, or vendor tweak that you will never see on your own device.",
      "Drive the choice from install-base analytics: rank by device model, OS version, and screen bucket, then pick a matrix covering the high-volume devices plus deliberate edge cases like the oldest supported OS, smallest and largest screens, a low-RAM device, and a foldable/cutout. That focuses limited testing on what users actually run.",
      "When the behavior depends on real hardware — GPU rendering, camera, sensors, or manufacturer-specific OS changes — because emulators and simulators do not reproduce those faithfully. Cloud farms give you many real devices and OS versions on demand, with per-device logs, screenshots, and crash traces, without buying the hardware."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Building a device matrix from analytics (pseudocode)",
        "code": "// 1. Pull real usage, do not guess\ntopDevices = analytics.rankBy(model, osVersion, screenBucket, gpu)\n\n// 2. Cover the bulk of users + deliberate edge cases\nmatrix = topDevices.take(coverage = 0.85)   // ~85% of the install base\n       + edgeCases([\n           oldestSupportedOs, newestOs,\n           smallestScreen, largestScreen,\n           lowRamDevice, foldable, displayCutout\n         ])\n\n// 3. Run automated tests on a cloud farm, real devices for hw paths\nfarm.run(testSuite, matrix, preferRealDevices = true)\n// returns per-device: logs, screenshots, video, crash traces\n\n// 4. Cadence: small local set per PR, full matrix pre-release\nonPullRequest   -> run(testSuite, localSmallSet)\nprePrelease     -> farm.run(testSuite, matrix)"
      }
    ],
    "resources": [
      {
        "label": "Android Testing (Test Lab & instrumentation)",
        "url": "https://developer.android.com/training/testing",
        "kind": "docs"
      },
      {
        "label": "Android Performance",
        "url": "https://developer.android.com/topic/performance",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "crash-reporting-analytics",
    "phase": 9,
    "phaseName": "Performance, Testing & Observability",
    "orderIndex": 6,
    "estimatedMins": 35,
    "prerequisites": [
      "mobile-profiling"
    ],
    "title": "Crash Reporting, Logging & Analytics",
    "eli5": "You cannot watch over the shoulder of millions of users, so the app quietly reports when it crashes, keeps useful notes about what happened, and measures which features people use — while being careful not to record private information.",
    "analogy": "Observability is the black box flight recorder on an aircraft. You are not in the cockpit of every user's flight, so the recorder captures what happened before a crash and the routine flight data, letting you diagnose problems you never personally witnessed.",
    "explanation": "Once your app is on devices you do not control, observability is how you know what is actually happening. Three pillars. Crash reporting: capture crashes and non-fatal errors with a stack trace, device/OS context, and breadcrumbs, aggregate them, and track your crash-free rate (the percentage of sessions/users without a crash) as a headline quality metric. Logging: structured, queryable records of notable events (not noisy print statements) that let you reconstruct what led to a problem. Product analytics: measure which features are used, funnels, and retention, to guide product decisions — distinct from crash reporting, which is about stability.\n\nThe catch specific to native mobile: released binaries are optimized and stripped, so a raw crash stack is unreadable addresses. You need symbolication — mapping those addresses back to human-readable file/method/line using symbol files you generated at build time. Without uploading those symbols, your crash reports are useless. And across all three pillars, privacy is a constraint: do not log or send PII, respect consent, and minimize what you collect.\n\nHow Android does it vs How iOS does it: Android deobfuscates crash traces using the R8/ProGuard mapping file (and native symbols for NDK code), commonly via Crashlytics or Play Console vitals which also reports ANRs (Application Not Responding). iOS symbolicates using dSYM files uploaded to the crash reporter (Crashlytics, or Xcode Organizer / MetricKit for on-device metrics). Same idea — upload the symbol mapping so stack traces become readable — with platform-specific symbol formats (mapping.txt vs dSYM).",
    "technicalDeep": "Symbolication works because the compiler emits a mapping from the stripped/optimized binary back to source: on Android the R8 mapping file (plus native debug symbols for C/C++), on iOS the dSYM bundle. You upload these to your crash service keyed by build/version, so incoming crash reports are automatically translated to readable frames. Crash-free rate (per session and per user) is the metric to alert on; a drop after a release is your fastest signal of a bad rollout. Non-fatals and ANRs matter too — an app that hangs is as bad as one that crashes. For logging, prefer structured events (key-value/JSON with a level, timestamp, and correlation id) over free-text prints, so you can query and correlate; attach recent logs as breadcrumbs to crash reports for context. For analytics, define events deliberately with a schema, and separate stability telemetry from product telemetry. Privacy runs through all of it: scrub PII before it leaves the device, honor consent (tie collection to the tracking-transparency/consent state), and retain the minimum.\n\nHow Android does it vs How iOS does it: Android reports ANRs and crashes through Play Console vitals and Crashlytics with mapping-file deobfuscation; iOS surfaces crashes and power/performance metrics via MetricKit and Xcode Organizer with dSYM symbolication. Both give you aggregated, symbolicated reports; you must wire the symbol upload into your build/release pipeline or the reports are noise.",
    "whatBreaks": "Shipping without uploading symbol files, so every crash report is unreadable hex addresses and you cannot diagnose anything. Watching only fatal crashes while ANRs/hangs and non-fatal errors quietly ruin the experience. Free-text logging that cannot be queried or correlated when you need it. Logging PII (emails, tokens, precise location) into crash breadcrumbs or analytics, creating a privacy incident. Treating analytics events as an afterthought with no schema, so the data is inconsistent and unusable. No alert on crash-free rate, so a release-breaking crash spreads for hours before anyone notices.",
    "efficientWay": {
      "title": "Instrumenting an app for observability",
      "approaches": [
        {
          "name": "Symbolicated crash reporting + crash-free-rate alerts + structured logs + schema'd, privacy-safe analytics",
          "verdict": "best",
          "reason": "Readable crashes, a headline quality metric you can alert on, queryable context to diagnose fast, and product data that is consistent and consent-respecting. Full, responsible observability."
        },
        {
          "name": "Crash reporting with symbols but ad-hoc logging and analytics",
          "verdict": "ok",
          "reason": "You can diagnose crashes, which is the priority, but unstructured logs and unplanned events make deeper investigation and product analysis slower and less reliable."
        },
        {
          "name": "Print-statement logging and no symbol upload",
          "verdict": "weak",
          "reason": "Crash reports are unreadable addresses, logs cannot be queried or correlated, and you have no reliable stability metric — effectively flying blind once the app ships."
        }
      ],
      "recommendation": "Wire symbol upload (mapping.txt / dSYM) into your release pipeline so crashes are readable, alert on crash-free rate to catch bad releases fast, emit structured logs as breadcrumbs, and treat analytics as a designed schema. Scrub PII and honor consent everywhere data leaves the device."
    },
    "commonMistakes": [
      "Not uploading symbol files, leaving crash reports as unreadable memory addresses",
      "Tracking only fatal crashes and ignoring ANRs/hangs and non-fatal errors",
      "Using free-text prints instead of structured, queryable logs with correlation ids",
      "Logging PII into breadcrumbs or analytics and ignoring consent/retention"
    ],
    "seniorNotes": "The two things that separate a mature setup: symbolication wired into the release pipeline (so a crash is diagnosable the moment it lands) and an alert on crash-free rate keyed to release, which is your fastest detector of a bad rollout — pair it with staged rollout so you can halt before it spreads. Do not neglect ANRs/hangs; users rate a frozen app as harshly as a crashing one. And treat privacy as a design input, not cleanup: scrub PII at the source, gate collection on consent, and minimize retention, because a crash breadcrumb full of personal data is a breach waiting to happen.",
    "interviewQuestions": [
      "What is symbolication and why are crash reports useless without it?",
      "What is crash-free rate and how would you use it to catch a bad release?",
      "How do you keep crash reporting, logging, and analytics privacy-safe?"
    ],
    "interviewAnswers": [
      "Symbolication maps the optimized, stripped addresses in a release crash back to readable file/method/line using symbol files generated at build time — the R8 mapping file on Android, dSYM on iOS. Without uploading those symbols the stack trace is just hex addresses, so you cannot tell where or why the app crashed.",
      "Crash-free rate is the percentage of sessions or users that experienced no crash, and it is the headline stability metric. You alert on it keyed to app version, so when a new release drops the crash-free rate you get paged immediately; combined with staged rollout you can halt the rollout before the crash reaches most users.",
      "Scrub PII before anything leaves the device, so emails, tokens, and precise location never end up in breadcrumbs or events; gate collection on the user's consent/tracking-transparency state; keep event schemas minimal and retain data for the shortest necessary time. Privacy is designed in at the point of collection, not cleaned up later."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Observability wiring with symbolication and privacy (pseudocode)",
        "code": "// BUILD/RELEASE: upload symbols so crashes are readable\nrelease.build()\ncrashService.uploadSymbols(mappingFile)   // Android R8 mapping.txt\ncrashService.uploadSymbols(dSYM)          // iOS dSYM\n// without this -> reports are unreadable hex addresses\n\n// RUNTIME: structured logs as breadcrumbs, scrub PII\nlog.event(level = INFO, name = \"checkout_started\",\n          data = { cartSize: 3, userId: hash(userId) })  // no raw PII\n\n// CRASH: captured with context automatically\nonCrash -> crashService.report(stack, deviceCtx, recentBreadcrumbs)\n\n// ANALYTICS: schema'd events, gated on consent\nif (consent.analyticsAllowed)\n    analytics.track(\"feature_used\", { feature: \"dark_mode\" })\n\n// ALERTS: crash-free rate keyed to release\nalertIf(crashFreeRate(version = current) < 99.5%)  // catch a bad rollout fast\n// pair with staged rollout so you can halt before it spreads"
      }
    ],
    "resources": [
      {
        "label": "Android Performance (vitals & ANRs)",
        "url": "https://developer.android.com/topic/performance",
        "kind": "docs"
      },
      {
        "label": "Android Testing",
        "url": "https://developer.android.com/training/testing",
        "kind": "docs"
      },
      {
        "label": "Apple App Tracking Transparency (privacy/consent)",
        "url": "https://developer.apple.com/documentation/apptrackingtransparency",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "feature-flags-ab",
    "phase": 9,
    "phaseName": "Performance, Testing & Observability",
    "orderIndex": 7,
    "estimatedMins": 30,
    "prerequisites": [
      "crash-reporting-analytics"
    ],
    "title": "Feature Flags & A/B Testing",
    "eli5": "You cannot instantly fix an app once it is on people's phones like you can a website — updates take time to roll out and users must install them. So you build remote switches into the app that you can flip from your server to turn features on or off, or to try two versions and see which works better.",
    "analogy": "Feature flags are like dimmer switches wired into a building before the walls go up. You ship the wiring in the app, then from a control room (your server) you can turn a light on for 5% of rooms, dim it, or switch it off — without sending an electrician back to every room. On mobile you must pre-wire, because you cannot rewire after move-in.",
    "explanation": "Unlike a website you can redeploy in seconds, a mobile app is on the user's device and cannot be hot-fixed instantly: an update must pass store review and then users have to install it, so old versions linger for weeks. Feature flags (remote config) solve this by shipping features in a disabled or controllable state and deciding at runtime — from a server-controlled config — whether each user sees them. This decouples 'deploy the code' from 'release the feature'.\n\nThis enables three things. Staged (percentage) rollout: enable a new feature for 1%, then 10%, then 100%, watching your crash-free rate and metrics, so a problem hits few users and you can roll back by flipping the flag instead of shipping a new build. Kill switches: instantly disable a broken or risky feature remotely. A/B testing / experimentation: show variant A to some users and B to others, measure which performs better on a chosen metric, and ship the winner. All of it hinges on the config being fetched and applied on the client without a new release.\n\nHow Android does it vs How iOS does it: Both platforms use a remote config service (for example Firebase Remote Config) plus experimentation tooling; the pattern is identical — the client fetches flag values keyed to user/segment and reads them instead of hard-coding behavior. Server-driven config and experimentation are platform-agnostic, so the main platform difference is just the SDK, not the concept.",
    "technicalDeep": "A flag system has three parts: a server that stores flag values and targeting rules (by percentage, user segment, app version, country), a client SDK that fetches and caches the current values, and code that reads a flag instead of a constant. Because mobile is offline-capable and fetches are asynchronous, you must ship safe defaults so the app behaves correctly before the first fetch or when offline, and decide caching/refresh timing (fetch on launch, use cached values meanwhile). For staged rollout you increase the percentage gradually while watching stability and product metrics; the flag is your instant rollback, which is essential because a code rollback would require another store release. For A/B tests you assign each user deterministically to a variant (stable across sessions), expose the variant, and analyze against a predefined metric with enough sample size — avoiding peeking and mid-flight changes that invalidate results. Clean up stale flags: long-lived dead flags become confusing, risky technical debt.\n\nHow Android does it vs How iOS does it: The mechanics — fetch, cache, default, target, assign — are the same on both, typically via the same cross-platform SDK. The only platform-specific concern is respecting each store's rules (you must not use remote config to smuggle in behavior that violates review policy), which applies to both.",
    "whatBreaks": "No safe defaults, so the app misbehaves or crashes before the first config fetch or when offline. Flipping a flag to 100% with no staged rollout and shipping a bug to everyone at once. A/B tests with non-deterministic assignment (users flip between variants) or too small a sample, producing meaningless results. Peeking at results and stopping early, inflating false positives. Flag debt: dozens of stale flags nobody remembers, creating untested combinations and risky code paths. Trying to use remote config to change behavior in ways the store prohibits.",
    "efficientWay": {
      "title": "Rolling out a risky new feature on mobile",
      "approaches": [
        {
          "name": "Feature flag with safe defaults, staged rollout, and a kill switch",
          "verdict": "best",
          "reason": "You ship the code dark, ramp exposure while watching crash-free rate and metrics, and can disable instantly by flipping the flag — the only fast rollback when you cannot hot-fix a client. Low blast radius by design."
        },
        {
          "name": "Ship the feature on for everyone but keep a remote kill switch",
          "verdict": "ok",
          "reason": "The kill switch gives fast recovery, but shipping to 100% at once means a bug hits everyone before you notice, so the blast radius is large even if recovery is quick."
        },
        {
          "name": "Hard-code the feature on and rely on a new app release to fix issues",
          "verdict": "weak",
          "reason": "A fix requires store review plus user installs, so a bug lingers for weeks with no fast rollback. This is exactly the situation feature flags exist to avoid."
        }
      ],
      "recommendation": "Ship features behind a remote flag with safe offline defaults, roll out by percentage while monitoring stability and product metrics, and keep a kill switch for instant rollback. For experiments, assign variants deterministically, size the sample, decide the metric up front, and remove flags once a decision is made."
    },
    "commonMistakes": [
      "No safe default value, so the app misbehaves before the first fetch or when offline",
      "Going straight to 100% with no staged rollout or kill switch",
      "A/B tests with unstable assignment, tiny samples, or peeking that invalidate the results",
      "Letting stale flags accumulate into untested, risky technical debt"
    ],
    "seniorNotes": "The core insight is that on mobile you cannot instantly fix the client, so a remotely controllable flag is your only fast rollback — treat every risky launch as flag-gated and ramp it. Always ship a safe default and design for the pre-fetch/offline case, because a flag system that misbehaves before config loads is worse than no flag. Run experiments with statistical discipline (deterministic assignment, pre-committed metric and sample size, no peeking) or the data will mislead you. And budget time to delete flags; flag debt quietly multiplies the untested state combinations your app can be in, which is a real reliability risk.",
    "interviewQuestions": [
      "Why are feature flags especially important on mobile compared to the web?",
      "How does a staged rollout with a kill switch limit the blast radius of a bad release?",
      "What makes a mobile A/B test trustworthy, and what invalidates one?"
    ],
    "interviewAnswers": [
      "Because you cannot hot-fix a mobile client: an update must pass store review and then users must install it, so old versions persist for weeks. Feature flags let you control features from the server without a new release, decoupling deploying code from releasing the feature and giving you an instant remote rollback that the web gets for free via redeploy.",
      "You enable the feature for a small percentage first and increase gradually while watching crash-free rate and product metrics, so any problem affects few users. If something breaks, you flip the kill switch to disable it instantly instead of shipping a new build, which on mobile would take weeks — so both exposure and recovery time are minimized.",
      "Trustworthy tests assign each user deterministically to a variant so they stay in it across sessions, define the success metric and required sample size before starting, run until that size is reached, and do not peek and stop early. It is invalidated by unstable assignment, too small a sample, changing the test mid-flight, or early stopping, all of which inflate false results."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Flag-gated staged rollout and A/B assignment (pseudocode)",
        "code": "// Client fetches remote config, but ALWAYS has a safe default\nconfig = remoteConfig.fetchOrCached()\nshowNewCheckout = config.getBool(\"new_checkout\",\n                                 default = false)  // safe pre-fetch/offline\n\nif (showNewCheckout) renderNewCheckout() else renderOldCheckout()\n\n// STAGED ROLLOUT (server side): ramp while watching metrics\n// day 1: 1%   day 2: 10%   day 3: 50%   day 4: 100%\n// if crashFreeRate drops -> flip \"new_checkout\" = false  (instant kill switch)\n\n// A/B TEST: deterministic, stable assignment\nvariant = hash(userId + \"checkout_exp\") % 2 == 0 ? \"A\" : \"B\"\nanalytics.track(\"exp_exposure\", { exp: \"checkout\", variant })\n// pre-commit metric (conversion) + sample size; do NOT peek and stop early\n\n// CLEANUP: once B wins and ships to 100%, DELETE the flag + dead branch"
      }
    ],
    "resources": [
      {
        "label": "Android Performance",
        "url": "https://developer.android.com/topic/performance",
        "kind": "docs"
      },
      {
        "label": "Android Testing",
        "url": "https://developer.android.com/training/testing",
        "kind": "docs"
      },
      {
        "label": "OWASP Mobile Top 10 (safe remote config usage)",
        "url": "https://owasp.org/www-project-mobile-top-10/",
        "kind": "article"
      }
    ]
  }
]
