import type { CurriculumTopic } from '@/types'

/** Mobile Development — Phase 6: Concurrency & Background Execution (8 topics). */
export const MOBILE_P6: CurriculumTopic[] = [
  {
    "id": "threading-models",
    "phase": 6,
    "phaseName": "Concurrency & Background Execution",
    "orderIndex": 1,
    "estimatedMins": 30,
    "prerequisites": [
      "main-ui-thread"
    ],
    "title": "Threading Models on Mobile",
    "eli5": "Your app has one special worker whose only job is to draw the screen and listen for taps. If you make that worker do slow chores like downloading a file, nobody is left to redraw the screen, so the app looks frozen. The trick is to hand slow chores to other workers.",
    "analogy": "The UI thread is the cashier at a coffee shop. The cashier should only take orders and hand over drinks (fast interactions). If the cashier stops to roast beans (slow work), the whole line freezes. Baristas in the back (worker threads) roast beans and hand finished drinks to the cashier to serve.",
    "explanation": "Every mobile app runs its user interface on a single thread — the main or UI thread. This thread runs an event loop that processes touch events, lays out views, and paints frames (ideally 60 or 120 times per second). Any code that runs on this thread blocks all three. So the golden rule is: do slow or blocking work (network, disk, heavy computation) on a background/worker thread, then hand only the final result back to the UI thread to display.\n\n[Android vs iOS] Android calls it the 'main thread' (also 'UI thread') and enforces the rule harshly: touch the network on it and you get a NetworkOnMainThreadException; a UI update from a background thread throws CalledFromWrongThreadException. iOS calls it the 'main thread' too, driven by the main RunLoop; UIKit and SwiftUI are not thread-safe and must be mutated on the main thread, but iOS historically crashed less loudly — you got glitches or the main-thread checker firing in debug.",
    "technicalDeep": "The UI thread is a loop: it pulls messages/events off a queue and processes each to completion before the next. A single frame budget is ~16.6ms at 60fps (~8.3ms at 120fps). Exceed it and you drop frames ('jank'). Blocking the loop long enough triggers OS watchdogs. Worker threads have no such loop by default — they run a task and exit — which is why higher-level primitives (thread pools, dispatchers, executors) exist to reuse threads and schedule work.\n\n[Android vs iOS] Android's loop is Looper + Handler + MessageQueue; the ANR (Application Not Responding) watchdog fires if the main thread is blocked ~5s during input. iOS uses CFRunLoop; the springboard watchdog kills apps that block the main thread too long (e.g. ~20s at launch), and the Main Thread Checker instruments UIKit calls off-main in debug builds.",
    "whatBreaks": "Blocking the UI thread: the app janks, then shows a frozen screen, then the OS shows an ANR dialog (Android) or the watchdog kills the process (iOS). Updating UI from a background thread: crashes on Android, corrupts view state or crashes intermittently on iOS. Over-threading: spawning a raw thread per task exhausts memory and thrashes the CPU with context switches.",
    "efficientWay": {
      "title": "Keeping the UI Thread Free",
      "approaches": [
        {
          "name": "Offload slow work to a managed pool, marshal results back to main",
          "verdict": "best",
          "reason": "A pool reuses threads and caps concurrency; marshalling the final result to main keeps UI updates safe. This is the model behind coroutines, GCD, and executors."
        },
        {
          "name": "Spawn a raw thread per task",
          "verdict": "ok",
          "reason": "Works for a one-off, but unbounded thread creation exhausts resources and you must hand-marshal results back to the UI thread every time."
        },
        {
          "name": "Do the work on the UI thread but 'keep it small'",
          "verdict": "weak",
          "reason": "Work grows, devices vary, and networks stall. What is fast on your flagship janks on a budget phone. Never gamble the UI thread."
        }
      ],
      "recommendation": "Treat the UI thread as sacred: only layout, drawing, and event handling. Push everything else to a managed dispatcher/pool and post only the finished result back to main."
    },
    "commonMistakes": [
      "Updating a view or observable UI state from a background thread and assuming it will 'usually work'",
      "Doing JSON parsing or image decoding on the UI thread because a single item felt fast in testing",
      "Spawning a new raw thread for every request instead of using a pool or structured concurrency",
      "Blocking the main thread on a lock or synchronous network call hidden inside a library"
    ],
    "seniorNotes": "The main thread is a shared, serialized resource — think of it as a queue with a hard latency SLA (one frame). Senior engineers profile for main-thread stalls (Android Systrace/Perfetto, iOS Instruments Time Profiler) rather than eyeballing. Also remember the inverse mistake: not everything belongs off-main. Cheap work that must be ordered with UI updates is often correct on main, and hopping threads unnecessarily adds latency and race surface.",
    "interviewQuestions": [
      "Why must UI updates happen on the main thread, and what actually goes wrong if they don't?",
      "What is the frame budget at 60fps and how does exceeding it manifest to the user?",
      "How do Android and iOS detect and react to a blocked main thread?"
    ],
    "interviewAnswers": [
      "UI toolkits keep view state in non-thread-safe data structures mutated by a single-threaded render loop. Off-thread mutation causes torn reads, corrupted layout, or crashes. On Android an off-thread view update throws CalledFromWrongThreadException; on iOS it produces intermittent glitches or main-thread-checker crashes. Serializing all UI mutation on one thread makes ordering deterministic.",
      "About 16.6ms per frame at 60fps (8.3ms at 120fps). If any task on the main thread overruns that window the frame is dropped, producing visible stutter (jank); sustained overruns freeze the UI and eventually trip the OS watchdog.",
      "Android's Looper watchdog raises an ANR if the main thread is unresponsive to input for ~5 seconds, showing the 'App isn't responding' dialog. iOS's watchdog kills processes that block the main thread past a threshold (e.g. ~20s at launch) and the debug Main Thread Checker flags UIKit calls made off-main."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: offload work, return result to UI",
        "code": "function onButtonTap():\n    showSpinner()                       // runs on UI thread\n    runOnBackground(() => {             // hand slow work to a worker\n        data = network.fetchProfile()   // blocking — safe off-main\n        image = decode(data.avatarBytes)\n        runOnMain(() => {              // marshal result back\n            hideSpinner()\n            profileView.render(data, image)\n        })\n    })\n\n// RULE: touch UI only inside runOnMain(...)"
      }
    ],
    "resources": [
      {
        "label": "Kotlin Coroutines Overview",
        "url": "https://kotlinlang.org/docs/coroutines-overview.html",
        "kind": "docs"
      },
      {
        "label": "Swift Concurrency",
        "url": "https://developer.apple.com/documentation/swift/concurrency",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "async-concurrency",
    "phase": 6,
    "phaseName": "Concurrency & Background Execution",
    "orderIndex": 2,
    "estimatedMins": 35,
    "prerequisites": [
      "threading-models"
    ],
    "title": "Async/Await, Coroutines, Isolates & GCD",
    "eli5": "Instead of standing at the microwave watching your food, you press start and go do other things; when it beeps you come back. Async code is that: start a slow task, let the app keep responding, and pick up the result when it's ready — without freezing the screen.",
    "analogy": "A restaurant waiter takes your order, sends it to the kitchen, and immediately serves other tables instead of standing frozen by the stove. When your dish is ready, the waiter delivers it. 'await' is the moment the waiter is free to help others while your dish cooks.",
    "explanation": "Async programming lets a thread start a long operation and be released to do other work instead of blocking. When the operation completes, execution resumes where it left off. Under the hood every modern model does the same thing — suspend, free the thread, resume on completion — they just spell it differently. The mental model to carry across platforms: mark a function as async, 'await' the slow calls inside it, and the runtime handles freeing and resuming the thread for you.\n\n[Android vs iOS] Android/Kotlin uses coroutines: a 'suspend fun' can pause at a suspension point and resume later, scheduled onto Dispatchers (Main, IO, Default). iOS/Swift uses async/await built into the language with a cooperative thread pool; 'await' marks a suspension point. Dart (Flutter, both platforms) uses async/await too, but heavy CPU work goes to an Isolate — a separate memory heap that communicates by message passing rather than shared memory.",
    "technicalDeep": "'Concurrency' (making progress on many tasks by interleaving) is not 'parallelism' (running simultaneously on multiple cores). Async/await gives you concurrency cheaply on one thread; true parallelism needs multiple threads/cores. Suspension points are where a coroutine/async function can yield the thread — nothing between two suspension points runs concurrently within a single logical task. Isolates are a different model entirely: no shared mutable memory, so no data races, at the cost of copying messages across the boundary.\n\n[Android vs iOS] Kotlin coroutines are cooperative and multiplexed over Dispatcher thread pools; you pick the dispatcher (IO for blocking calls, Default for CPU). Swift's model uses actors for safe shared state and a cooperative pool sized to core count — blocking a task starves the pool, so you must not do blocking I/O in an async context without offloading. Dart's isolate model sidesteps shared-state races but you serialize data across the port.",
    "whatBreaks": "Blocking inside an async context: calling a synchronous network or disk API inside a coroutine/async function on a small cooperative pool starves it and stalls everything. Forgetting to switch dispatchers: doing CPU-heavy work on the Main dispatcher janks the UI. Assuming async means parallel: awaiting calls sequentially when they could run concurrently wastes time. Shared mutable state across tasks without protection causes data races.",
    "efficientWay": {
      "title": "Choosing How to Run Async Work",
      "approaches": [
        {
          "name": "Suspend with async/await + coroutines and pick the right dispatcher/pool",
          "verdict": "best",
          "reason": "Structured, readable, cheap concurrency; the runtime frees threads at suspension points and you route blocking vs CPU work to the correct pool."
        },
        {
          "name": "Callbacks / completion handlers",
          "verdict": "ok",
          "reason": "Works and is explicit, but nesting leads to 'callback hell', error handling scatters, and cancellation is hard to wire up correctly."
        },
        {
          "name": "Manual threads + shared mutable state",
          "verdict": "weak",
          "reason": "You reimplement scheduling, get data races, and pay full thread cost. Only justified for niche low-level control."
        }
      ],
      "recommendation": "Default to language-native async/await (coroutines on Kotlin, async/await on Swift, async on Dart with Isolates for CPU). Route blocking I/O to an IO pool and CPU work to a Default/compute context; keep shared state behind an actor or message passing."
    },
    "commonMistakes": [
      "Calling a blocking synchronous API inside an async function and starving the cooperative pool",
      "Confusing concurrency with parallelism and expecting a single async chain to use multiple cores",
      "Awaiting independent calls sequentially instead of launching them concurrently and awaiting all",
      "Mutating shared state from multiple coroutines/tasks without an actor, mutex, or isolate boundary"
    ],
    "seniorNotes": "The unifying idea is a state machine the compiler generates: your function is chopped at each suspension point, and the continuation is resumed by the scheduler. Once you see async/await, coroutines, and futures as three surfaces over 'suspend-and-resume', porting mental models across platforms is trivial. Watch for the subtle trap: Swift's cooperative pool is core-sized, so a single blocking call is far more damaging than on Kotlin's elastic IO dispatcher. For CPU-bound work choose parallelism deliberately (Default dispatcher, TaskGroup, or an isolate) — async alone won't add cores.",
    "interviewQuestions": [
      "What is the difference between concurrency and parallelism, and which does async/await give you?",
      "What is a suspension point and why does blocking inside an async context cause problems?",
      "How does Dart's Isolate model differ from Kotlin coroutines or Swift async/await?"
    ],
    "interviewAnswers": [
      "Concurrency is interleaving multiple tasks so they all make progress, even on one thread; parallelism is literally running on multiple cores at once. Async/await gives concurrency by default — it frees the thread during waits — but it does not itself add cores. For parallelism you must dispatch work across multiple threads (Default dispatcher, TaskGroup, isolates).",
      "A suspension point is a place (an 'await'/suspend call) where a task can yield its thread back to the scheduler and resume later. If you instead make a blocking synchronous call, the thread is not yielded; on a small cooperative pool (like Swift's) that starves other tasks and can deadlock or stall the whole app. Blocking calls must be offloaded to an IO pool.",
      "Isolates have no shared mutable memory — each has its own heap and event loop, and they communicate by passing copied messages over ports. This eliminates data races by construction, at the cost of serialization overhead. Kotlin coroutines and Swift async/await share memory across tasks, so they rely on dispatchers/actors and synchronization to stay safe."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: sequential vs concurrent awaits",
        "code": "// SLOW: each await waits for the previous (3 x 200ms = 600ms)\nasync function loadDashboardSlow():\n    user   = await api.getUser()\n    orders = await api.getOrders()\n    feed   = await api.getFeed()\n    return combine(user, orders, feed)\n\n// FAST: launch all, then await together (~200ms)\nasync function loadDashboardFast():\n    userJob   = launchAsync(api.getUser)\n    ordersJob = launchAsync(api.getOrders)\n    feedJob   = launchAsync(api.getFeed)\n    return combine(await userJob, await ordersJob, await feedJob)"
      },
      {
        "lang": "kotlin",
        "label": "Kotlin: dispatcher selection + concurrent awaits",
        "code": "suspend fun loadDashboard(): Dashboard = coroutineScope {\n    // IO dispatcher for blocking network; runs concurrently\n    val user   = async(Dispatchers.IO) { api.getUser() }\n    val orders = async(Dispatchers.IO) { api.getOrders() }\n    // Default dispatcher for CPU-bound merge\n    withContext(Dispatchers.Default) {\n        mergeExpensive(user.await(), orders.await())\n    }\n}"
      }
    ],
    "resources": [
      {
        "label": "Kotlin Coroutines Overview",
        "url": "https://kotlinlang.org/docs/coroutines-overview.html",
        "kind": "docs"
      },
      {
        "label": "Swift Concurrency",
        "url": "https://developer.apple.com/documentation/swift/concurrency",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "structured-concurrency",
    "phase": 6,
    "phaseName": "Concurrency & Background Execution",
    "orderIndex": 3,
    "estimatedMins": 35,
    "prerequisites": [
      "async-concurrency"
    ],
    "title": "Structured Concurrency & Cancellation",
    "eli5": "If you send three friends to fetch groceries and then decide you don't need groceries, you call them all back — you don't let them keep shopping forever. Structured concurrency ties every background task to a 'scope' so when the scope ends (like a screen closing), all its tasks are automatically called back.",
    "analogy": "A tour guide (the scope) is responsible for a group of tourists (child tasks). The guide won't leave the museum until every tourist is accounted for, and if the tour is cancelled, the guide recalls everyone at once. No tourist is left wandering the halls after the tour ends — that would be a 'leaked' task.",
    "explanation": "Structured concurrency means every background task lives inside a scope with a defined lifetime, arranged as a parent-child tree. A parent scope does not complete until all its children complete, and cancelling a parent cancels all children. This makes leaks and orphaned work impossible by construction: when the screen that owns a scope is destroyed, its scope is cancelled and every in-flight task stops. Cancellation is cooperative — tasks must reach a suspension/check point to actually stop.\n\n[Android vs iOS] Android/Kotlin ties coroutines to a CoroutineScope; UI layers use lifecycleScope / viewModelScope so work is cancelled automatically when the Activity/ViewModel is destroyed. Suspending functions check for cancellation at suspension points; long CPU loops must call ensureActive() or isActive. iOS/Swift uses Task and TaskGroup; cancellation sets a flag you observe via Task.isCancelled or by calling Task.checkCancellation(), and SwiftUI's .task modifier cancels the task when the view disappears.",
    "technicalDeep": "The parent-child tree gives two guarantees: (1) lifetime — a scope awaits all children, so you never 'fire and forget' by accident; (2) cancellation propagation — cancel flows down the tree. Cancellation is cooperative, not preemptive: the runtime sets a cancelled flag and throws a CancellationException (Kotlin) / CancellationError (Swift) at the next suspension point. Code that never suspends (a tight CPU loop) will ignore cancellation unless it polls the flag. Cleanup uses structured teardown — finally blocks / defer — which still run during cancellation so you can release resources.\n\n[Android vs iOS] Kotlin: cancelling a scope cancels its Job tree; CancellationException is swallowed by the machinery (don't catch-and-ignore it, or you break cancellation). Swift: cancellation is a cooperative flag; withTaskCancellationHandler lets you react immediately, and a detached Task (Task.detached) escapes the structure — use it sparingly because it reintroduces leak risk.",
    "whatBreaks": "Leaked tasks: launching work on a global/detached scope that outlives the screen keeps running, holds references, and may call back into a dead UI (crash or wasted battery/network). Ignoring cancellation: a CPU loop that never checks isActive keeps burning cycles after the user navigated away. Swallowing CancellationException: catching a generic exception and continuing defeats cancellation and can hang the scope. Updating destroyed UI: a task that completes after the view is gone touches null/dead references.",
    "efficientWay": {
      "title": "Scoping Background Work to Screens",
      "approaches": [
        {
          "name": "Bind tasks to a lifecycle-aware scope (viewModelScope / .task)",
          "verdict": "best",
          "reason": "Work is auto-cancelled when the owner dies; no manual bookkeeping, no leaks, cleanup runs via finally/defer."
        },
        {
          "name": "Manual task handles you cancel in teardown callbacks",
          "verdict": "ok",
          "reason": "Correct if disciplined, but every screen must remember to cancel in onDestroy/deinit — one missed path leaks."
        },
        {
          "name": "Global/detached scope with fire-and-forget launches",
          "verdict": "weak",
          "reason": "Nothing owns the task's lifetime; it outlives the UI, leaks memory, and can crash by touching dead views."
        }
      ],
      "recommendation": "Always launch UI-related work in a lifecycle-bound scope. Reserve detached/global scopes for genuinely app-lifetime work, and make CPU loops cancellation-aware by polling isActive/checkCancellation."
    },
    "commonMistakes": [
      "Launching network work in a global scope so it outlives the screen and leaks or crashes on completion",
      "Catching CancellationException/CancellationError in a broad try/catch and swallowing it",
      "Writing tight CPU loops with no suspension point, so cancellation never takes effect",
      "Forgetting cleanup — not using finally/defer to release resources when a task is cancelled"
    ],
    "seniorNotes": "Structured concurrency is really RAII for concurrency: the scope is the resource, children are its lifetime. The senior instinct is to ask 'who owns this task's lifetime?' for every launch — if the answer is 'nobody', it's a leak waiting to happen. Also internalize that cancellation is cooperative: your job is to make code reach check points promptly, and to keep cleanup in finally/defer so it runs on the cancellation path. Detached tasks are an escape hatch that trades safety for reach — justify each one.",
    "interviewQuestions": [
      "What guarantees does structured concurrency provide, and how do they prevent leaked tasks?",
      "Why is cancellation described as 'cooperative', and what must your code do to honor it?",
      "What happens if you launch UI work in a scope that outlives the screen, and how do you avoid it?"
    ],
    "interviewAnswers": [
      "It arranges tasks in a parent-child tree with two guarantees: a parent scope will not complete until all children finish (no accidental fire-and-forget), and cancelling a parent cancels all descendants. Because every task has an owning scope with a bounded lifetime, orphaned/leaked tasks can't happen — when the owner is destroyed, its scope cancels everything it started.",
      "Cooperative means the runtime only sets a cancelled flag and throws at the next suspension point; it does not forcibly kill the thread. Code must reach a suspension point or explicitly poll (isActive / Task.checkCancellation) to notice and stop, and should keep resource cleanup in finally/defer blocks that still run during cancellation.",
      "The task keeps running after the UI is gone: it holds references (memory leak), may perform useless network/CPU work (battery drain), and can crash when it completes and touches destroyed views. Avoid it by binding the launch to a lifecycle-aware scope (viewModelScope, lifecycleScope, SwiftUI's .task) so teardown auto-cancels it."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: scope tied to a screen",
        "code": "class ProfileScreen:\n    scope = new Scope()            // owns all this screen's tasks\n\n    function onOpen():\n        scope.launch(() => {\n            try:\n                data = await api.getProfile()   // cancellation checkpoint\n                for row in bigList:              // CPU loop\n                    if not scope.isActive: return // honor cancellation\n                    process(row)\n                render(data)\n            finally:\n                releaseResources()               // runs even if cancelled\n        })\n\n    function onClose():\n        scope.cancel()   // cancels ALL child tasks at once — no leaks"
      },
      {
        "lang": "swift",
        "label": "Swift: task cancelled when the view disappears",
        "code": "struct ProfileView: View {\n    @State private var profile: Profile?\n    var body: some View {\n        content\n            .task {                       // auto-cancelled on disappear\n                do {\n                    let p = try await api.getProfile()\n                    try Task.checkCancellation()   // honor cancellation\n                    profile = p\n                } catch is CancellationError {\n                    // expected on navigate-away: do not treat as error\n                } catch { showError(error) }\n            }\n    }\n}"
      }
    ],
    "resources": [
      {
        "label": "Kotlin Coroutines Overview",
        "url": "https://kotlinlang.org/docs/coroutines-overview.html",
        "kind": "docs"
      },
      {
        "label": "Swift Concurrency",
        "url": "https://developer.apple.com/documentation/swift/concurrency",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "background-execution-limits",
    "phase": 6,
    "phaseName": "Concurrency & Background Execution",
    "orderIndex": 4,
    "estimatedMins": 30,
    "prerequisites": [
      "threading-models"
    ],
    "title": "Why the OS Limits Background Work",
    "eli5": "Your phone's battery is a shared pizza, and every app wants a slice. If apps could run whatever they wanted while your phone is in your pocket, the pizza would vanish by lunchtime. So the operating system is the strict parent that puts sleeping apps in timeout and only wakes them for good reasons.",
    "analogy": "Think of the OS as a landlord enforcing quiet hours in an apartment building. After midnight (screen off, phone idle), tenants (apps) can't run noisy machinery. They can submit a request to run the dishwasher, and the landlord batches everyone's requests to run at a convenient time — protecting the shared utilities (battery, data, CPU).",
    "explanation": "On a phone, background work is a privilege, not a right, because it drains a shared, finite battery and mobile data. Both platforms aggressively restrict what an app can do once it's not in the foreground: they suspend the process, defer its background tasks, and batch wake-ups across all apps to save power. You cannot assume your code keeps running after the user leaves the app — you must declare what you need and let the OS decide when to grant it.\n\n[Android vs iOS] Android suspends via Doze (deep sleep when the device is stationary and screen-off, batching maintenance windows) and App Standby buckets (apps used less get less background access); it also caps background services and background location. iOS is stricter: leaving the foreground gives you a few seconds, then the process is suspended (frozen, not running); background execution happens only through specific opt-in modes (background fetch, processing tasks, audio, location) that the system schedules opportunistically.",
    "technicalDeep": "The OS models background work as deferrable and coalescable. Doze creates periodic 'maintenance windows' where deferred jobs, alarms, and syncs for all apps fire together, so the radio and CPU wake once instead of constantly (wakeups are expensive — the cellular radio has a high 'tail energy' cost after each use). App Standby buckets (active/working-set/frequent/rare/restricted) throttle job frequency and network by usage. iOS suspends the app's threads entirely; to run later you register tasks that the scheduler runs when it predicts a good time (charging, on Wi-Fi, historically-used hours), and it learns per-user launch patterns.\n\n[Android vs iOS] Android exempts some categories (foreground services, high-priority FCM, exact alarms with permission) and lets OEMs add even harsher killers (aggressive task killers on some vendors). iOS gives no guaranteed schedule at all for background fetch/processing — you get best-effort windows and a hard time budget per run; overruns get your task killed and your app deprioritized.",
    "whatBreaks": "Assuming code runs after backgrounding: a timer, socket, or upload started in the foreground is frozen/killed once suspended, so half-finished work silently stalls. Draining battery: apps that hold wakelocks or poll aggressively get flagged, throttled into the 'restricted' bucket, or killed by the user. Missing exemptions: relying on background execution for time-critical delivery without using the right OS mechanism (foreground service, high-priority push) means it simply won't run when the device is dozing.",
    "efficientWay": {
      "title": "Working With OS Background Limits",
      "approaches": [
        {
          "name": "Declare intent via the OS scheduler and accept best-effort timing",
          "verdict": "best",
          "reason": "WorkManager/BGTaskScheduler let the OS batch your work into efficient windows; you get guaranteed eventual execution without fighting Doze."
        },
        {
          "name": "Use a foreground service / background mode for genuinely user-visible ongoing work",
          "verdict": "ok",
          "reason": "Correct when the user expects continuous work (navigation, playback, active upload), but it costs a persistent notification and battery — don't abuse it."
        },
        {
          "name": "Hold wakelocks / poll on a background thread to 'stay alive'",
          "verdict": "weak",
          "reason": "Fights the OS, drains battery, and gets you throttled, killed, or restricted. It also breaks the moment Doze or a vendor killer intervenes."
        }
      ],
      "recommendation": "Design for suspension: assume you get frozen the moment the user leaves. Express work as deferrable jobs with constraints, and reserve foreground services/background modes for work the user actively expects to continue."
    },
    "commonMistakes": [
      "Assuming a background thread or timer keeps running after the app is backgrounded or the device dozes",
      "Holding a wakelock or polling to keep the app awake, then getting throttled into a restricted bucket",
      "Expecting background fetch/processing to run on a predictable schedule instead of best-effort windows",
      "Ignoring OEM-specific task killers and battery optimizers when testing only on stock Android or one device"
    ],
    "seniorNotes": "The root cause is thermodynamic, not arbitrary: radio tail energy and CPU wakeups dominate idle battery, so the OS coalesces everyone's work to amortize the cost of waking hardware. Senior engineers design the sync/notification architecture around 'the device will be asleep' rather than treating limits as bugs to work around. Test on real devices across vendors (Doze via adb, aggressive OEM killers) and instrument what actually ran in the background — logs from a debugger-attached device lie because attaching a debugger disables suspension.",
    "interviewQuestions": [
      "Why does the OS restrict background execution at all — what is the underlying cost being protected?",
      "What is Android Doze and how do maintenance windows change when your background work runs?",
      "On iOS, what happens to your app's threads shortly after it goes to the background?"
    ],
    "interviewAnswers": [
      "The battery and cellular data are shared, finite resources, and waking the CPU and radio has a high fixed cost (radio tail energy, wakeup overhead). If every app ran freely in the background, idle drain would be catastrophic. So the OS suspends apps and batches deferred work across all of them to wake the hardware as rarely as possible.",
      "Doze is a deep-sleep state Android enters when the device is stationary, screen-off, and unplugged. It defers background jobs, alarms, and network access, then releases them together in periodic 'maintenance windows' that grow farther apart the longer the device stays idle. So your deferred work runs in batched bursts, not continuously.",
      "They get suspended — frozen. After moving to the background the app has only a few seconds of runtime, then iOS suspends its threads entirely; it isn't scheduled again until it comes to the foreground or the system grants a specific background execution window (background fetch/processing, or an active background mode like location/audio)."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: design for suspension, not continuous run",
        "code": "// WRONG: assumes the thread keeps running in the background\nonAppBackgrounded():\n    startThread(() => {\n        while true:                 // frozen the moment we suspend\n            uploadNextChunk()\n            sleep(5s)\n    })\n\n// RIGHT: hand the work to the OS scheduler with constraints\nonAppBackgrounded():\n    scheduler.enqueue(\n        task = \"upload-photos\",\n        constraints = { network: UNMETERED, charging: false },\n        policy = { retry: EXPONENTIAL, guaranteed: EVENTUAL }\n    )\n    // OS runs it during a maintenance window / good time"
      }
    ],
    "resources": [
      {
        "label": "Android Guide to Background Work",
        "url": "https://developer.android.com/guide/background",
        "kind": "docs"
      },
      {
        "label": "Apple User Notifications & Background Execution",
        "url": "https://developer.apple.com/documentation/usernotifications",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "scheduled-deferred-work",
    "phase": 6,
    "phaseName": "Concurrency & Background Execution",
    "orderIndex": 5,
    "estimatedMins": 35,
    "prerequisites": [
      "background-execution-limits"
    ],
    "title": "Scheduled & Deferred Work",
    "eli5": "Instead of doing your laundry the instant it's dirty, you leave a note: 'wash these, but only when the machine is free and there's cheap electricity.' The OS reads everyone's notes and runs the loads at the best time. Your app leaves similar notes for tasks that can wait.",
    "analogy": "It's like leaving letters at the post office with instructions: 'deliver when it stops raining (constraint), and if the truck breaks down, try again tomorrow (retry).' You don't drive the truck yourself — you trust the postal system to deliver eventually, even if the power blinks (survives reboot).",
    "explanation": "Deferred work is anything that must happen eventually but not right now: uploading logs, syncing a database, compressing photos. You describe the job and the conditions it needs (on Wi-Fi, while charging, when storage is free), enqueue it, and the OS-backed scheduler runs it at an efficient time — batching it with other apps' work. The scheduler persists jobs across app restarts and device reboots and retries failures, so you get a guarantee of eventual execution rather than immediate execution.\n\n[Android vs iOS] Android uses WorkManager: you define a Worker, attach Constraints (network type, charging, idle, storage), pick one-time vs periodic, set a backoff/retry policy, and enqueue with a unique name to avoid duplicates. It persists work in a database and survives reboot. iOS uses BGTaskScheduler with two task types — BGAppRefreshTask (short, frequent freshness updates) and BGProcessingTask (longer maintenance, can require charging/network). You register task identifiers, submit requests with constraints, and the system decides when (best-effort, no exact schedule).",
    "technicalDeep": "The scheduler is a constraint solver over the whole device: it holds pending jobs, waits until each job's constraints are satisfied AND a batched wake window opens, then runs them. Guarantees differ by API: WorkManager guarantees the work will run eventually (it re-enqueues after reboot from its DB) and offers expedited work for urgent-but-deferrable tasks; iOS guarantees nothing about timing and gives each run a hard time budget, after which it calls your expiration handler and you must checkpoint and exit or be killed. Retries use exponential (or linear) backoff so a failing job doesn't hammer the system. Idempotency matters: a job may run more than once (retry after a crash), so effects must be safe to repeat.\n\n[Android vs iOS] WorkManager chains work (sequential/parallel graphs), dedupes via unique work policies (KEEP/REPLACE/APPEND), and reports observable state (ENQUEUED/RUNNING/SUCCEEDED/FAILED). BGTaskScheduler requires you to re-submit the next request from within the current task's handler (it doesn't auto-repeat), and you must register handlers before app launch finishes; testing uses a debugger command to force a task to run since real scheduling is opaque.",
    "whatBreaks": "Expecting exact timing: neither API promises 'run in 5 minutes' — periodic work has a minimum interval and drifts to batch windows. Non-idempotent jobs: assuming exactly-once execution corrupts data when a retry re-runs a job. Constraints never met: requiring 'unmetered + charging' on a device that's rarely both means the job effectively never runs. iOS budget overrun: not handling the expiration handler gets the task killed mid-write and the app deprioritized. Reboot loss on iOS: pending BG tasks don't survive as strongly as WorkManager's DB-backed queue.",
    "efficientWay": {
      "title": "Scheduling Work That Must Run Eventually",
      "approaches": [
        {
          "name": "Declarative jobs with constraints + retry via WorkManager/BGTaskScheduler",
          "verdict": "best",
          "reason": "The OS batches and persists the work, honors constraints, retries with backoff, and survives restarts — you get guaranteed-eventual execution efficiently."
        },
        {
          "name": "Trigger the work opportunistically from a push or app launch",
          "verdict": "ok",
          "reason": "Great as a supplement (a silent push can nudge a sync), but on its own it's unreliable — pushes are best-effort and the user may not open the app."
        },
        {
          "name": "Roll your own alarm/timer loop to poll and do the work",
          "verdict": "weak",
          "reason": "Fights Doze/suspension, ignores constraints, doesn't survive reboot cleanly, and drains battery. The OS will throttle or kill it."
        }
      ],
      "recommendation": "Model deferrable work as constrained, idempotent jobs on the platform scheduler. Set realistic constraints, an exponential backoff, and unique-work dedup; on iOS always re-submit the next request and handle the expiration handler by checkpointing."
    },
    "commonMistakes": [
      "Assuming periodic work runs at an exact interval instead of a minimum interval that drifts to batch windows",
      "Writing non-idempotent jobs that corrupt data when the scheduler retries after a crash",
      "Over-constraining a job (unmetered AND charging AND idle) so its conditions are almost never all true",
      "On iOS, not re-submitting the next BGTask request or ignoring the expiration handler, so work stops or gets killed"
    ],
    "seniorNotes": "The mental shift is from imperative ('do it now') to declarative ('here's what and under which conditions; you decide when'). Senior engineers make every job idempotent and observable, choose constraints from real telemetry (what device states users actually spend time in), and treat WorkManager's stronger guarantees vs iOS's best-effort model as a first-class design difference — often pairing deferred jobs with a silent push to nudge freshness. Always test the retry and reboot paths; the happy path hides the hard bugs.",
    "interviewQuestions": [
      "What guarantees does WorkManager give versus iOS BGTaskScheduler, and how do they differ on timing?",
      "Why must scheduled/deferred jobs be idempotent?",
      "How do constraints and backoff policies shape when and how often a job runs?"
    ],
    "interviewAnswers": [
      "WorkManager guarantees the work will execute eventually: it persists jobs in a database, honors constraints, retries with backoff, and re-enqueues after reboot. BGTaskScheduler guarantees nothing about timing — it's fully best-effort, gives each run a hard time budget, and requires you to re-submit the next request yourself. So Android gives durable, eventual execution; iOS gives opportunistic, system-chosen windows.",
      "Because the scheduler may run a job more than once — a crash or process kill during execution causes a retry, and periodic jobs repeat. If the job isn't idempotent, a retry double-applies its effects (double upload, double charge, corrupted counters). Making effects safe to repeat (dedup keys, upserts, checkpoints) keeps data correct under retries.",
      "Constraints gate eligibility: the job only becomes runnable when all its conditions (network type, charging, storage, idle) hold, and even then it waits for a batched wake window — so tighter constraints mean rarer runs. Backoff controls retry cadence after failure: exponential backoff spaces out retries so a persistently failing job doesn't hammer the battery or servers."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: enqueue a constrained, idempotent job",
        "code": "job = defineWork(\"sync-database\") {\n    run():\n        changes = localDb.pendingChanges()\n        server.applyIdempotent(changes, key = deviceId + batchId)  // safe to retry\n        localDb.markSynced(changes)\n        return SUCCESS   // or RETRY on transient failure\n}\n\nscheduler.enqueueUnique(\n    name        = \"sync-database\",      // dedup: don't stack duplicates\n    policy      = KEEP,\n    constraints = { network: CONNECTED },\n    backoff     = EXPONENTIAL(startSeconds = 30),\n    repeat      = every(6h)              // MINIMUM interval, drifts to batch\n)"
      },
      {
        "lang": "swift",
        "label": "Swift: BGProcessingTask with expiration + re-submit",
        "code": "func handleSync(_ task: BGProcessingTask) {\n    scheduleNextSync()                    // must re-submit the next request\n    let op = SyncOperation()\n    task.expirationHandler = {            // hard time budget hit\n        op.cancel()                       // checkpoint + stop, don't get killed\n    }\n    op.completion = { success in task.setTaskCompleted(success: success) }\n    queue.addOperation(op)\n}\n\nfunc scheduleNextSync() {\n    let req = BGProcessingTaskRequest(identifier: \"com.app.sync\")\n    req.requiresNetworkConnectivity = true\n    try? BGTaskScheduler.shared.submit(req)   // system decides WHEN\n}"
      }
    ],
    "resources": [
      {
        "label": "Android WorkManager",
        "url": "https://developer.android.com/topic/libraries/architecture/workmanager",
        "kind": "docs"
      },
      {
        "label": "Android Guide to Background Work",
        "url": "https://developer.android.com/guide/background",
        "kind": "docs"
      },
      {
        "label": "Apple User Notifications & Background Execution",
        "url": "https://developer.apple.com/documentation/usernotifications",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "foreground-services",
    "phase": 6,
    "phaseName": "Concurrency & Background Execution",
    "orderIndex": 6,
    "estimatedMins": 30,
    "prerequisites": [
      "background-execution-limits"
    ],
    "title": "Foreground Services & Long-Running Tasks",
    "eli5": "If an app needs to keep working while you use other apps — like playing music or guiding you with GPS — it has to hang a little 'I'm busy doing this' badge in your notification bar. That badge is the deal: the OS lets it keep running, but you always know it's running.",
    "analogy": "A foreground service is like a food-delivery courier wearing a bright uniform. Because they're clearly visible and accountable (the notification), they're allowed into the building's back corridors (background runtime) that anonymous strangers can't enter. No uniform, no access.",
    "explanation": "When work is genuinely ongoing and the user knows about it — media playback, turn-by-turn navigation, a fitness tracker, an active large upload — the app needs to keep running even while backgrounded. The OS grants this only in exchange for visible accountability: a persistent, user-dismissible-only-by-stopping notification that shows the work is happening. This is the deliberate trade: continuous runtime for transparency, so the user can always see (and stop) what's draining their battery.\n\n[Android vs iOS] Android calls this a Foreground Service: you start it, post an ongoing Notification within a few seconds, and declare a foregroundServiceType (mediaPlayback, location, dataSync, etc.) in the manifest; recent Android versions require a matching runtime permission and restrict which types can be started from the background. iOS has no exact equivalent — instead you declare specific background modes (audio, location, voip, external-accessory) in the app capabilities; the system keeps you running only while you're actively using that capability (e.g. audio is actually playing, location updates are flowing).",
    "technicalDeep": "A foreground service elevates the process's importance so the OS won't suspend or kill it under normal memory pressure, and exempts it (largely) from Doze for the duration. The mandatory notification is the enforcement mechanism — you cannot run this way silently. Android ties each service to a type that scopes what it may do and how it can be started; misusing a type (e.g. a dataSync service that runs indefinitely) risks the system stopping it. iOS background modes are capability-gated: 'audio' keeps you alive only while producing audio; 'location' only while the location manager is delivering updates; abusing a mode (declaring audio but not playing) gets the app rejected in review or suspended at runtime.\n\n[Android vs iOS] Android: foreground services have startForeground timing requirements (post the notification quickly or crash), background-start restrictions, and per-type permissions; long syncs should prefer WorkManager unless truly continuous. iOS: there's no persistent 'service' — you keep execution by keeping the capability active, and for long finite work you combine background modes with BGTaskScheduler or beginBackgroundTask for a short finishing window.",
    "whatBreaks": "No notification / late notification: Android crashes the service if you don't post the ongoing notification in time. Wrong service type or background-start: newer Android blocks starting certain foreground service types from the background, so navigation/upload started while backgrounded silently fails. iOS mode abuse: declaring a background mode you don't actively use gets you rejected in review or suspended, and silence in an 'audio' app ends your runtime. Battery reputation: a foreground service that runs longer than the user expects shows up in battery stats and gets the app uninstalled or restricted.",
    "efficientWay": {
      "title": "Keeping Genuinely Ongoing Work Alive",
      "approaches": [
        {
          "name": "Foreground service / active background mode with an honest, matching notification",
          "verdict": "best",
          "reason": "The right tool for user-visible continuous work; you get sustained runtime and Doze exemption in exchange for transparency the user actually wants."
        },
        {
          "name": "Deferred job (WorkManager/BGTask) for finite, interruptible work",
          "verdict": "ok",
          "reason": "Better when the work can pause and resume later (a sync, a compression). Cheaper on battery, but not for work that must be continuous and immediate."
        },
        {
          "name": "Background thread / wakelock with no user-visible indicator",
          "verdict": "weak",
          "reason": "Prohibited for sustained work on modern OSes: no notification means the OS suspends or kills you, and it hides battery cost from the user."
        }
      ],
      "recommendation": "Use a foreground service or active background mode only when the user genuinely expects continuous work, and make the notification honest and controllable. If the work can be deferred or chunked, prefer a scheduled job — it's kinder to battery and less brittle."
    },
    "commonMistakes": [
      "Not posting (or delaying) the mandatory ongoing notification and crashing the Android foreground service",
      "Trying to start a restricted foreground service type from the background on newer Android",
      "Declaring an iOS background mode (e.g. audio) the app doesn't actively use, risking rejection or suspension",
      "Using a foreground service for work that could be a deferred job, needlessly draining battery and annoying users"
    ],
    "seniorNotes": "The design question is always 'must this be continuous, and does the user expect it?' If yes, a foreground service/background mode with an honest notification is correct; if the work can pause, a scheduled job is almost always better. Senior engineers scope service types tightly, keep the notification actionable (pause/stop controls), and finish promptly — the OS and the battery-stats screen are both watching. On iOS, treat background modes as capability leases: you keep runtime only while the capability is genuinely active.",
    "interviewQuestions": [
      "Why does a foreground service require a persistent notification — what is the trade being made?",
      "How does iOS achieve continuous background work without an equivalent 'foreground service'?",
      "When should you choose a foreground service over a WorkManager/BGTaskScheduler job?"
    ],
    "interviewAnswers": [
      "The notification is the accountability the OS demands in exchange for letting the app run continuously in the background and skip Doze. Continuous runtime drains shared battery, so the system requires the work to be visible and user-controllable — the user can always see what's running and stop it. No notification, no sustained background runtime.",
      "iOS has no persistent service; instead you declare specific background modes (audio, location, voip, etc.) as capabilities, and the system keeps the app running only while that capability is actively in use — audio actually playing, location updates actually flowing. For finite finishing work you use beginBackgroundTask for a short window or schedule a BGTask.",
      "Choose a foreground service when the work is continuous, immediate, and user-visible — media playback, live navigation, an active recording or upload the user is watching. Choose a scheduled job when the work is finite and can be deferred or resumed later (a periodic sync, photo compression). Foreground services cost battery and a persistent notification, so reserve them for genuinely ongoing work."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: decide service vs deferred job",
        "code": "function runWork(kind):\n    if kind.isContinuous and kind.userVisible:\n        // e.g. navigation, playback, live upload\n        service = startForegroundService(type = kind.type)\n        service.postOngoingNotification(          // REQUIRED, promptly\n            title = \"Navigating to \" + destination,\n            actions = [ STOP ]                    // user stays in control\n        )\n        service.run(kind)\n        service.stopWhenDone()                    // free it ASAP\n    else:\n        // finite / interruptible -> scheduler handles it efficiently\n        scheduler.enqueue(kind, constraints, backoff)"
      }
    ],
    "resources": [
      {
        "label": "Android Guide to Background Work",
        "url": "https://developer.android.com/guide/background",
        "kind": "docs"
      },
      {
        "label": "Apple User Notifications & Background Execution",
        "url": "https://developer.apple.com/documentation/usernotifications",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "push-notifications-pipeline",
    "phase": 6,
    "phaseName": "Concurrency & Background Execution",
    "orderIndex": 7,
    "estimatedMins": 40,
    "prerequisites": [
      "background-execution-limits"
    ],
    "title": "Push Notifications: The Full Pipeline",
    "eli5": "Your app can't shout at your phone directly while it's asleep. Instead it whispers to a giant central messenger (run by Google or Apple) that's always awake and connected to every phone. The messenger taps your phone on the shoulder and delivers the note. It usually works, but the messenger doesn't promise every note arrives.",
    "analogy": "It's a relay race, not a direct throw. Your app hands the baton to your server, your server hands it to the platform's push gateway (FCM/APNs), and the gateway carries it the last mile to the device — using the phone's one always-on connection. Each handoff can drop the baton, which is why delivery is best-effort, not guaranteed.",
    "explanation": "A phone can't keep a live connection open for every app — that would drain the battery. So each OS maintains a single, always-on connection to its own push gateway, and every app's notifications ride that shared pipe. The flow is: (1) the app registers and gets a unique device token; (2) it sends that token to your backend; (3) when you want to notify the user, your server calls the push gateway (FCM for Android, APNs for Apple) with the token and a payload; (4) the gateway delivers it to the device, which wakes your app or shows the notification. Because it crosses networks and a sleeping device, delivery is best-effort — treat a push as a hint, not a guaranteed message.\n\n[Android vs iOS] Android uses FCM (Firebase Cloud Messaging). FCM messages come in two shapes: 'notification' messages the system tray displays automatically, and 'data' messages your app code handles. iOS uses APNs (Apple Push Notification service); your server authenticates to APNs (token-based JWT or certificate) and sends a payload with an 'aps' dictionary. Apple also offers 'silent' pushes (content-available) for background data, and FCM can route to APNs for you so one FCM call reaches both platforms.",
    "technicalDeep": "Tokens are per-app-per-device and can rotate — on reinstall, restore, or at the OS's discretion — so your backend must treat tokens as ephemeral: store them, refresh on the client's onNewToken callback, and prune tokens that the gateway reports as unregistered. Payloads are small (a few KB) and structured: a visible portion (title/body/badge/sound) and optional custom data. Silent/data pushes (content-available on iOS, data-only on FCM) wake the app briefly to fetch or sync without showing anything — but the OS throttles them heavily and may coalesce or drop them under Doze/Low Power Mode, so they're unreliable for anything time-critical. Priority matters: high-priority pushes can wake a dozing device; normal-priority are batched.\n\n[Android vs iOS] Android: FCM 'notification' messages are shown by the system when the app is backgrounded (your handler isn't called for the display), while 'data' messages always invoke your handler — mixing them causes the classic 'my onMessageReceived isn't called in the background' confusion. iOS: silent pushes require the content-available flag plus the remote-notification background mode, are rate-limited per app, and won't be delivered in Low Power Mode; user-facing pushes require notification permission, which the user can deny or revoke.",
    "whatBreaks": "Stale tokens: sending to an old token silently fails or the gateway returns 'unregistered' — not pruning them wastes quota and misses users. Expecting guaranteed delivery: relying on a push to deliver critical state (it may be dropped, coalesced, or arrive late) loses data. Silent-push abuse: leaning on silent/data pushes for real-time sync fails because the OS throttles/drops them, especially in Doze/Low Power Mode. Background-handler confusion on Android: sending a 'notification' payload and wondering why your code never runs in the background. Permission denied: on iOS/newer Android the user can refuse notification permission, so you must handle the no-permission path.",
    "efficientWay": {
      "title": "Building a Reliable-Enough Push System",
      "approaches": [
        {
          "name": "Push as a hint + authoritative fetch/sync on open",
          "verdict": "best",
          "reason": "Treats delivery as best-effort: the push nudges the app, but the real data is pulled from your server so nothing is lost if a push drops. Robust against throttling and Low Power Mode."
        },
        {
          "name": "Data/silent push carrying the full payload",
          "verdict": "ok",
          "reason": "Fine for non-critical, small updates, but the OS throttles and may drop silent pushes, and payload size is limited — never rely on it for critical or ordered delivery."
        },
        {
          "name": "Assume every push arrives, in order, exactly once",
          "verdict": "weak",
          "reason": "False on both platforms. Pushes can be dropped, duplicated, reordered, or delayed; building state transfer on this guarantee loses data and confuses users."
        }
      ],
      "recommendation": "Use pushes to signal 'something changed', then have the app fetch the authoritative state from your backend. Keep tokens fresh, prune unregistered ones, request notification permission at a good moment, and never depend on silent pushes for time-critical work."
    },
    "commonMistakes": [
      "Treating device tokens as permanent instead of refreshing on rotation and pruning unregistered ones",
      "Relying on push delivery as guaranteed/ordered when it is best-effort and can be dropped or coalesced",
      "Using an FCM 'notification' payload and expecting your background handler to run for it on Android",
      "Depending on silent/data pushes for real-time sync despite OS throttling and Low Power Mode dropping them",
      "Not handling the case where the user denies or revokes notification permission"
    ],
    "seniorNotes": "Model the pipeline as an unreliable transport and design for it: idempotent handlers (dedupe by message id), a 'push nudges, app reconciles' pattern, and server-side token hygiene driven by gateway feedback (unregistered/invalid responses). Senior engineers separate the notification (UX) from the data (correctness) — the push may show a banner, but the source of truth is always a fetch. Watch platform-specific traps: FCM notification-vs-data handling, APNs auth key rotation, per-app silent-push rate limits, and permission being revocable at any time.",
    "interviewQuestions": [
      "Walk through the full path of a push notification from your app to the user's device.",
      "Why is push delivery best-effort, and how do you design a feature that must not lose updates?",
      "What is a silent/data push, and why is it unreliable for real-time synchronization?"
    ],
    "interviewAnswers": [
      "The app registers with the OS push service and receives a device token, which it sends to your backend. To notify a user, your server calls the platform gateway — FCM for Android, APNs for Apple — with the target token and a payload. The gateway delivers over the device's single always-on push connection, and the OS either shows the notification or wakes the app to handle it. Each handoff (app to server, server to gateway, gateway to device) can fail, which is why it's best-effort.",
      "It's best-effort because it crosses multiple networks and a possibly-sleeping, possibly-offline device; the OS may batch, coalesce, delay, or drop messages (especially under Doze or Low Power Mode), and tokens can be stale. For a feature that can't lose updates, use the push only as a hint that something changed and have the app fetch the authoritative state from your server, with idempotent, deduplicated handling so a missing or duplicate push doesn't corrupt state.",
      "A silent (content-available on iOS) or data-only (FCM) push carries no user-visible alert and instead wakes the app in the background to fetch or sync. It's unreliable for real-time sync because the OS heavily throttles and rate-limits these pushes, coalesces them, and drops them entirely in Doze or Low Power Mode — so they arrive late, rarely, or not at all. Use them as opportunistic nudges, backed by a scheduled sync and an on-open fetch."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: end-to-end push pipeline",
        "code": "// 1) CLIENT: get token, keep it fresh\nonAppStart():\n    token = push.getToken()\n    backend.registerToken(userId, token, platform)\nonTokenRefresh(newToken):        // tokens rotate!\n    backend.registerToken(userId, newToken, platform)\n\n// 2) SERVER: send via the platform gateway\nfunction notify(userId, event):\n    for token in db.tokensFor(userId):\n        resp = gateway.send(token, {\n            notification: { title: event.title },   // visible part\n            data:         { type: event.type },      // app-handled part\n            priority:     HIGH\n        })\n        if resp == UNREGISTERED: db.removeToken(token)  // hygiene\n\n// 3) CLIENT: push is a HINT -> fetch source of truth\nonMessageReceived(msg):\n    if seen(msg.id): return           // idempotent / dedup\n    latest = backend.fetchState()     // authoritative, never trust payload alone\n    ui.update(latest)"
      }
    ],
    "resources": [
      {
        "label": "Firebase Cloud Messaging (FCM)",
        "url": "https://firebase.google.com/docs/cloud-messaging",
        "kind": "docs"
      },
      {
        "label": "Apple UserNotifications / APNs",
        "url": "https://developer.apple.com/documentation/usernotifications",
        "kind": "docs"
      },
      {
        "label": "Android Guide to Background Work",
        "url": "https://developer.android.com/guide/background",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "background-sync",
    "phase": 6,
    "phaseName": "Concurrency & Background Execution",
    "orderIndex": 8,
    "estimatedMins": 35,
    "prerequisites": [
      "scheduled-deferred-work",
      "push-notifications-pipeline"
    ],
    "title": "Background Sync & Data Fetch",
    "eli5": "You want your app to already have fresh news the moment you open it, without draining the battery checking every minute. So the phone quietly refreshes it at smart times — when you're on Wi-Fi, charging, or about to wake up — and bundles that check with everyone else's.",
    "analogy": "It's like a milkman who restocks your fridge before you wake up, but only comes when he's already on your street (opportunistic) and combines your delivery with the neighbors' so the truck makes one trip (coalescing) instead of driving back and forth all night.",
    "explanation": "Background sync keeps local data reasonably fresh so the app feels instant on open, without constant polling. Three ideas make it efficient: periodic sync (refresh on a loose schedule the OS batches), opportunistic sync (piggyback on moments the radio is already awake — connectivity regained, device charging, a push arrived), and coalescing (merge many pending sync requests into one round-trip instead of many). You combine the scheduler (for guaranteed-eventual refresh), connectivity triggers (to sync the instant Wi-Fi returns), and push hints (to sync right when something changed) into one strategy.\n\n[Android vs iOS] Android: periodic WorkManager work with a network constraint handles scheduled sync; you can also observe connectivity and enqueue an expedited sync when the network returns, and a high-priority FCM data message can trigger an immediate sync. iOS: BGAppRefreshTask gives short, frequent freshness windows the system schedules around user habits, BGProcessingTask handles heavier syncs (often requiring charging/network), and a content-available push can nudge a fetch — all best-effort.",
    "technicalDeep": "Efficiency comes from amortizing the expensive part (waking the radio) across as much work as possible. Coalescing batches multiple logical syncs into one network session so the radio powers up once; deduping (unique work / debouncing) prevents stacking redundant syncs when many triggers fire close together. Opportunistic sync exploits states where the cost is already paid — connectivity just returned, the screen is on, the device is charging — to run sync 'for free'. Delta sync (send only what changed since a cursor/timestamp) shrinks payloads so each wake transfers less. Conflict handling matters when the device synced offline edits: last-write-wins, merge, or server-authoritative reconciliation must be chosen deliberately, and syncs must be idempotent because the scheduler can retry.\n\n[Android vs iOS] Android: WorkManager periodic work has a minimum interval (~15 min) and drifts to Doze windows; connectivity-triggered work uses network constraints so it fires when a suitable network appears; batching multiple syncs into a unique coalesced job avoids duplicate radio wakeups. iOS: BGAppRefresh has a tight per-run time budget and no guaranteed cadence (the system learns when the user opens the app), so you keep each refresh small and delta-based, and lean on push hints for timeliness.",
    "whatBreaks": "Aggressive polling: a fixed short-interval sync ignores batching, drains battery, and gets throttled. No coalescing/debounce: many triggers (connectivity flaps, several pushes) each spawn a sync, hammering the radio. Full re-fetch every time: syncing everything instead of a delta wastes data and time and blows the iOS time budget. Ignoring conflicts: overwriting server or local changes on merge corrupts data after offline edits. Assuming timeliness: expecting periodic/refresh sync to be near-real-time fails — it's best-effort and batched, so time-critical freshness needs a push nudge.",
    "efficientWay": {
      "title": "Keeping Data Fresh Without Draining Battery",
      "approaches": [
        {
          "name": "Periodic scheduled sync + opportunistic triggers + delta payloads, all coalesced",
          "verdict": "best",
          "reason": "Guaranteed-eventual freshness from the scheduler, timeliness from connectivity/push triggers, and minimal cost from delta sync and coalescing one radio wake."
        },
        {
          "name": "Sync only on app open (foreground pull)",
          "verdict": "ok",
          "reason": "Simple and always correct at open, but the first screen shows stale data until the fetch finishes — acceptable for low-freshness apps, weak for feeds/messaging."
        },
        {
          "name": "Fixed short-interval background polling",
          "verdict": "weak",
          "reason": "Fights Doze/suspension, ignores batching, drains battery, and gets throttled or killed. It also re-fetches redundantly without coalescing."
        }
      ],
      "recommendation": "Layer the strategies: a batched periodic sync for baseline freshness, opportunistic syncs when connectivity/charging make it cheap, and push hints for immediacy — with delta payloads, coalescing/debounce, and idempotent, conflict-aware writes."
    },
    "commonMistakes": [
      "Polling on a fixed short interval instead of using batched, constraint-driven scheduled sync",
      "Not debouncing/coalescing so connectivity flaps or multiple pushes each trigger a redundant sync",
      "Re-fetching the full dataset every sync instead of a delta since the last cursor/timestamp",
      "Ignoring conflict resolution after offline edits, silently overwriting local or server changes",
      "Expecting periodic/refresh sync to be real-time instead of pairing it with a push nudge"
    ],
    "seniorNotes": "Background sync is an optimization problem: maximize perceived freshness per unit of battery. The senior playbook combines a durable periodic job (baseline), opportunistic triggers that ride already-awake states, and push hints for the tail of latency — all funneled into one coalesced, idempotent, delta-based sync path with explicit conflict resolution. Instrument what actually ran versus what you scheduled (the OS drops and drifts), keep each iOS refresh under its time budget, and remember that 'sync on open' is the cheap correctness backstop behind everything else.",
    "interviewQuestions": [
      "What are periodic, opportunistic, and coalesced sync, and how do they combine into one strategy?",
      "Why is delta sync important for background refresh, especially on iOS?",
      "How do you keep background sync from draining battery while still feeling fresh?"
    ],
    "interviewAnswers": [
      "Periodic sync refreshes on a loose, OS-batched schedule for baseline freshness. Opportunistic sync piggybacks on moments the radio is already awake — connectivity returns, device charging, a push arrives — so the sync is nearly free. Coalescing merges multiple pending sync requests into a single network round-trip so the radio wakes once instead of many times. Combined, they give guaranteed-eventual freshness (periodic), timeliness (opportunistic + push), and low cost (coalescing).",
      "Delta sync transfers only what changed since a cursor or timestamp instead of the whole dataset, so each wake moves far less data — faster, cheaper on battery and mobile data, and less likely to blow iOS's tight per-refresh time budget (BGAppRefreshTask runs are short). Full re-fetches waste the limited window and may not finish, leaving data no fresher.",
      "Avoid fixed polling; instead use the platform scheduler with network/charging constraints so work batches into Doze windows, add opportunistic triggers that ride already-awake states, and use push hints only when immediacy matters. Keep payloads small with delta sync, coalesce and debounce triggers so redundant syncs collapse into one, and make writes idempotent. That maximizes freshness per unit of battery."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: layered, coalesced sync strategy",
        "code": "// Baseline: batched periodic sync (guaranteed-eventual)\nscheduler.enqueuePeriodic(\"sync\", every = 30m,\n    constraints = { network: CONNECTED })\n\n// Opportunistic: sync the moment connectivity returns\nonConnectivityRegained():\n    syncQueue.request(reason = \"connectivity\")\n\n// Immediacy: a push says something changed\nonDataPush(msg):\n    syncQueue.request(reason = \"push:\" + msg.type)\n\n// Coalesce + debounce many triggers into ONE round-trip\nsyncQueue.onRequest(debounce = 5s) {\n    cursor  = localDb.lastCursor()\n    delta   = server.fetchSince(cursor)      // delta, not full re-fetch\n    localDb.applyIdempotent(delta)           // safe to retry\n    localDb.resolveConflicts(strategy = SERVER_WINS)\n    localDb.saveCursor(delta.nextCursor)\n}"
      }
    ],
    "resources": [
      {
        "label": "Android WorkManager",
        "url": "https://developer.android.com/topic/libraries/architecture/workmanager",
        "kind": "docs"
      },
      {
        "label": "Android Guide to Background Work",
        "url": "https://developer.android.com/guide/background",
        "kind": "docs"
      },
      {
        "label": "Apple User Notifications & Background Execution",
        "url": "https://developer.apple.com/documentation/usernotifications",
        "kind": "docs"
      }
    ]
  }
]
