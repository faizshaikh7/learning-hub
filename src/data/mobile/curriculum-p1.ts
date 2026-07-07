import type { CurriculumTopic } from '@/types'

/** Phase 1 — App Lifecycle & Process Model. Concept-first, framework-agnostic. */
export const MOBILE_P1: CurriculumTopic[] = [
  {
    "id": "app-launch-types",
    "phase": 1,
    "phaseName": "App Lifecycle & Process Model",
    "orderIndex": 1,
    "estimatedMins": 35,
    "prerequisites": [],
    "title": "App Launch: Cold, Warm & Hot Start",
    "eli5": "Opening an app can be fast or slow depending on how much of it the phone already has ready. If the phone has to build everything from scratch, that is a cold start and it feels slow. If some of it is still lying around from before, it is a warm start. If the app is basically already there and just needs to show its face again, that is a hot start and it is instant.",
    "analogy": "Cold start is arriving at a restaurant before it opens — the staff has to unlock, turn on the lights, fire up the ovens, and prep before serving you. Warm start is the restaurant already open but your table needs setting. Hot start is you stepped out for a phone call and walked right back to your table, food still warm. Same meal, wildly different wait.",
    "explanation": "When a user taps your app's icon, how fast it appears depends on what state the app is already in, and this falls into three categories. A cold start happens when the app's process does not exist at all — the OS must create a fresh process, initialize the runtime, load your code, construct the first screen, and only then can anything appear. This is the slowest and the one users judge you on. A warm start happens when the process still exists but the app was pushed out of the foreground and its top screen needs rebuilding — some initialization is skipped, so it is faster. A hot start happens when the app is still fully in memory and just needs to be brought back to the front — near-instant, because almost nothing has to be recreated. The key insight is that you do not fully control which one happens; the OS does, based on memory pressure and how long the app has been away. So you optimize the cold start (the worst case) and design so warm and hot starts restore the user exactly where they left off.\n\nAndroid vs iOS callout: On Android a cold start creates a new Linux process, initializes the ART runtime, runs the Application object's onCreate, then the launch Activity's onCreate/onStart/onResume before the first frame draws. A warm start may reuse the process but recreate the Activity; a hot start just brings the existing Activity back to the foreground. On iOS a cold launch spins up the process, runs the app delegate's launch sequence and the scene setup, and builds the first view controller; a warm/hot resume brings a suspended or backgrounded app forward with much of its state intact. Same three-tier model, different callback names.",
    "technicalDeep": "Cold start cost is dominated by process creation, runtime initialization, loading and linking your code, running app-level startup code, and building the first screen's view hierarchy plus its initial data. Anything you do synchronously in the earliest startup callbacks is directly on the critical path to the first frame, so heavy work there (initializing SDKs, reading large files, blocking network calls) directly inflates the number users feel. Warm start skips process and runtime setup but still rebuilds UI. Hot start mostly just re-displays existing UI. The system decides the tier: after you background an app, the OS keeps its process around opportunistically, but under memory pressure it reclaims that process, forcing the next launch to be cold. This is why the same app can feel instant one moment and slow the next.\n\nAndroid vs iOS callout: Android shows a starting window (a themed placeholder or splash) during cold start so the app does not look frozen while the first frame is prepared, and defers heavy init with lazy initialization and app-startup libraries. iOS shows a launch screen storyboard during launch for the same reason and encourages moving non-essential work off the launch path. Both platforms measure time-to-first-frame and time-to-interactive as the metrics that matter, and both punish heavy synchronous startup work.",
    "whatBreaks": "The classic failure is a slow cold start caused by cramming initialization into the earliest startup callback: initializing every SDK, analytics, database, and dependency synchronously before the first screen can draw, producing a multi-second blank or frozen splash that users abandon. Another break is failing to distinguish the tiers — assuming the app always resumes with its state, then losing the user's place on a cold start because the process was killed and nothing was restored. Blocking the startup path on a network call is especially bad, because on a slow connection the app appears broken. And measuring startup only on a fast dev device hides how bad the cold start is on the budget phones most users have.",
    "efficientWay": {
      "title": "Optimizing Startup",
      "approaches": [
        {
          "name": "Minimize and defer work on the cold-start critical path; lazy-init non-essential SDKs and load data asynchronously",
          "verdict": "best",
          "reason": "Cold start is the worst case users judge, and its cost is dominated by synchronous startup work. Deferring anything not needed for the first frame directly cuts the number that matters."
        },
        {
          "name": "Show a splash/launch screen and initialize everything behind it",
          "verdict": "ok",
          "reason": "A launch screen avoids a frozen look, but if you still do all the heavy init synchronously the app is slow to become interactive — the splash just hides, not fixes, the problem."
        },
        {
          "name": "Initialize all SDKs and load all data up front so everything is ready",
          "verdict": "weak",
          "reason": "Puts maximum work on the critical path, producing the slowest possible cold start; most of that work is not needed for the first screen."
        }
      ],
      "recommendation": "Treat the cold start as your startup budget. Do only what the first frame needs synchronously, lazily initialize everything else on first use, load initial data asynchronously with a fast placeholder, and always restore the user's location so warm and hot starts feel seamless. Measure time-to-interactive on a mid-range device."
    },
    "commonMistakes": [
      "Initializing every SDK, database, and dependency synchronously before the first frame, causing a slow cold start",
      "Blocking the startup path on a network call so the app looks frozen on slow connections",
      "Assuming the app always resumes with state and losing the user's place after a cold start",
      "Measuring startup only on a fast dev device, hiding the real cold-start time on budget phones"
    ],
    "seniorNotes": "Senior engineers treat time-to-interactive on cold start as a first-class metric with a budget, because it is the first impression and a direct driver of retention. The discipline is aggressive laziness: nothing runs on the startup path unless the first screen genuinely needs it, SDKs initialize on first use, and initial content streams in behind a fast skeleton. They also design for the fact that the OS chooses the tier — the app must restore the user's exact position regardless of whether the launch was cold, warm, or hot, so state restoration (covered later) is inseparable from startup. Profiling is done on representative low-end hardware, because cold start on a budget device is where the pain and the churn actually live.",
    "interviewQuestions": [
      "Explain the difference between cold, warm, and hot start, and who decides which one happens.",
      "Why is cold start the one you should optimize, and what dominates its cost?",
      "What kinds of work should never be on the cold-start critical path, and where should they go instead?"
    ],
    "interviewAnswers": [
      "A cold start is when the app's process does not exist, so the OS must create the process, initialize the runtime, load your code, and build the first screen from scratch — the slowest case. A warm start reuses the existing process but rebuilds the top screen, so it is faster. A hot start is when the app is still fully in memory and just needs to be brought to the foreground — near-instant. The OS decides which one happens based on memory pressure and how long the app has been away; you do not fully control it, so you optimize the cold start and make warm/hot starts restore state seamlessly.",
      "Because it is the worst case and the first impression users judge you on, and its cost is dominated by work you can influence: process and runtime initialization, loading and linking code, and — most controllably — your own synchronous startup work and first-screen construction. Warm and hot starts skip much of this, so they are already fast. Anything heavy you run in the earliest startup callback sits directly on the critical path to the first frame, so cutting or deferring it is the highest-leverage optimization.",
      "Anything not required to draw and make the first screen interactive: initializing analytics and third-party SDKs, opening and migrating databases, preloading data for later screens, and especially any blocking network call. These should be lazily initialized on first use or moved to asynchronous background work that runs after the first frame, ideally behind a fast placeholder or skeleton. The first-frame path should do the minimum, and everything else should stream in afterward."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Keep the cold-start path minimal (pseudocode)",
        "code": "// BAD: everything synchronous before the first screen shows\nonAppCreate():\n    analytics.init()          // network + disk\n    database.openAndMigrate() // slow on big DBs\n    adsSdk.init()\n    prefetchNextScreens()     // not needed yet\n    // ...first frame is delayed by ALL of this -> slow cold start\n\n// GOOD: do the minimum, defer the rest\nonAppCreate():\n    setupCrashReporting()     // tiny, genuinely needed early\n    // that is it -- let the first frame draw fast\n\nonFirstScreenShown():\n    showSkeleton()\n    async loadInitialData(then = renderContent)   // off critical path\n\nlazy analytics  = { analytics.init() }     // runs on first real use\nlazy adsSdk     = { adsSdk.init() }\n\n// The OS picks cold/warm/hot; ALWAYS restore where the user was\nonStart():\n    restoreUserPosition()"
      }
    ],
    "resources": [
      {
        "label": "Android app fundamentals (process and components)",
        "url": "https://developer.android.com/guide/components/fundamentals",
        "kind": "docs"
      },
      {
        "label": "Android activity lifecycle",
        "url": "https://developer.android.com/guide/components/activities/activity-lifecycle",
        "kind": "docs"
      },
      {
        "label": "iOS managing your app's life cycle",
        "url": "https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "app-lifecycle-states",
    "phase": 1,
    "phaseName": "App Lifecycle & Process Model",
    "orderIndex": 2,
    "estimatedMins": 35,
    "prerequisites": [
      "app-launch-types"
    ],
    "title": "Application Lifecycle States",
    "eli5": "An app is always in one of a few situations: it is in front and you are using it, it is in the background because you switched away, it is frozen so it uses no power, or it is completely shut down. The phone moves your app between these situations, and the app has to behave correctly in each one — like doing your work when you are on stage and going quiet when you step off.",
    "analogy": "Think of an actor in a play. On stage under the spotlight, they perform (foreground/active). Waiting in the wings, still in costume, they are ready but not performing (background). Sitting frozen in the dressing room, told not to move to save energy (suspended). Sent home entirely because the theater needs the room (terminated). The director (the OS) decides every move; the actor just responds to cues.",
    "explanation": "At the whole-app level, an app moves through a small set of states, and understanding them is the backbone of everything else in mobile. In the foreground/active state the app is visible and receiving user input — this is the only time it should assume it has full attention and resources. In the background state the app is no longer front-and-center (the user switched apps or went home) but may still be briefly running to finish work. In the suspended state the app is in memory but frozen — it executes no code, consuming no CPU or battery, ready to resume quickly. In the terminated state the app's process no longer exists; the next launch will be cold. The crucial point is who drives the transitions: the OS does, in response to user actions and resource pressure. The user tapping home sends you to the background; the OS suspends you to save power; the OS terminates you when it needs the memory. Your job is to react correctly at each transition — grab resources when you become active, release them and save state when you leave.\n\nAndroid vs iOS callout: iOS names these states almost directly — not running, inactive, active, background, and suspended — delivered through app-delegate and scene lifecycle callbacks (for example scene became active, scene will resign active, scene entered background). Android expresses the same idea through the visibility and foreground/background status of its components plus process importance: an Activity that is resumed maps to active, stopped-but-alive maps to background, and a killed process maps to terminated; Android also formalizes overall foreground/background at the process level (for example ProcessLifecycleOwner). The state model is shared; iOS exposes explicit named app states while Android derives them from component visibility and process importance.",
    "technicalDeep": "Each transition is a signal about what resources you may use. Becoming active is when you should acquire what you need for interaction: start sensors and location, resume animations and timers, refresh data. Leaving active (going to background) is your reliable moment to save state, because the OS may suspend or kill you shortly after, and once suspended you run no code. Suspension is powerful for battery precisely because your app is frozen — but it means any in-flight work must be finished or handed off before you are suspended, or it simply stops. Termination can happen without any further callback while suspended, so you cannot rely on a 'goodbye' event to save state; the save must happen at the transition to background. Background execution is strictly limited and metered on both platforms — you get short, bounded windows for finishing work, not open-ended runtime.\n\nAndroid vs iOS callout: On iOS, when you move to the background you can request a short background task to finish critical work before suspension, and the system may terminate a suspended app silently to reclaim memory — so state is saved on entering background, not on termination. On Android, a backgrounded app's components are stopped and the process becomes a candidate for the low-memory killer with no guaranteed final callback, so onStop / onSaveInstanceState at the point of leaving the foreground is your safe save point. Both enforce that background time is short and suspension/termination can be silent.",
    "whatBreaks": "The most common break is treating the app as if it is always active: continuing to run timers, animations, sensors, GPS, or network polling after the app is backgrounded, which drains battery and often does nothing useful because the app is not visible. The mirror-image break is saving state too late — waiting for a termination callback that never comes because the OS killed the suspended app silently, so the user's state is lost. Assuming background work runs indefinitely also breaks: developers kick off a long task as the app backgrounds and it is cut off when the app suspends. And forgetting to reacquire resources on becoming active leaves the app in a stale state — a frozen video, an out-of-date screen, sensors that never restarted.",
    "efficientWay": {
      "title": "Handling State Transitions",
      "approaches": [
        {
          "name": "Acquire resources on becoming active, release them and save state on leaving the foreground, assume suspension/termination can be silent",
          "verdict": "best",
          "reason": "Matches the OS-driven model exactly: it saves battery, protects user state against silent kills, and keeps the app fresh when it returns."
        },
        {
          "name": "Do cleanup and state-saving only in a termination handler",
          "verdict": "weak",
          "reason": "The OS often terminates a suspended app with no further callback, so this handler may never run and state is lost."
        },
        {
          "name": "Keep sensors, timers, and polling running across background to be ready instantly on return",
          "verdict": "weak",
          "reason": "Drains battery for work that is usually invisible and wasted, and background execution is throttled anyway, so it rarely delivers the intended benefit."
        }
      ],
      "recommendation": "Bind resource acquisition to becoming active and resource release plus state saving to leaving the foreground. Treat the background as short-lived and suspension or termination as possibly silent, so persist everything important at the moment you go to the background, not later."
    },
    "commonMistakes": [
      "Keeping timers, animations, sensors, or GPS running after the app is backgrounded, wasting battery",
      "Saving state only in a termination handler that the OS may never call before killing a suspended app",
      "Starting a long background task as the app backgrounds and having it cut off at suspension",
      "Forgetting to reacquire resources on becoming active, leaving the screen stale when the app returns"
    ],
    "seniorNotes": "The load-bearing rule is: save state when you leave the foreground, not when you are terminated, because suspension and termination can be silent with no final callback. Senior engineers bind resource lifecycles tightly to the active state — sensors, location, media, and network work start on active and stop on background — both to save battery and because background execution is strictly budgeted anyway. They also design the app to reconstruct itself from persisted state at any time, treating termination as normal rather than exceptional. A good mental test for any screen: if the OS froze and killed it right now, then the user returned in an hour, would everything be exactly as they left it?",
    "interviewQuestions": [
      "Describe the main application lifecycle states and what your app should and should not do in each.",
      "Who drives the transitions between lifecycle states, and why does that matter for where you save state?",
      "Why should you save state when entering the background rather than waiting for a termination callback?"
    ],
    "interviewAnswers": [
      "The main states are foreground/active (visible and receiving input — the only time to assume full attention and resources), background (no longer front-and-center but maybe briefly running to finish work), suspended (in memory but frozen, running no code to save battery), and terminated (process gone, next launch is cold). In active you acquire resources and drive the UI; in background you should release resources and save state quickly; in suspended you do nothing because you cannot run code; and terminated means you must be able to rebuild from persisted state. The rule is to match resource use to the state.",
      "The OS drives them, in response to user actions and resource pressure — the user tapping home backgrounds you, the OS suspends you to save power, and the OS terminates you when it needs memory. That matters because you do not get to choose when you stop running: once suspended you execute no code, and the OS can terminate a suspended app with no further callback. So the only reliable place to save state is at the transition to the background, while you are still allowed to run — anything you defer past that point may never execute.",
      "Because the OS often kills a suspended app silently to reclaim memory, with no termination callback delivered. If your save logic lives in a 'goodbye' handler, it may never run, and the user's state is lost. Entering the background is the last moment you are guaranteed to be running, so persisting there guarantees the state exists regardless of whether the OS later suspends and silently terminates the process. It turns termination from a data-loss event into a routine, recoverable one."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "React correctly to each lifecycle state (pseudocode)",
        "code": "// The OS moves you between states; you just respond.\n\nonBecameActive():          // foreground, has focus\n    startSensors()\n    resumeTimersAndAnimations()\n    refreshDataIfStale()\n\nonLeavingForeground():      // going to background\n    saveStateNow()          // LAST guaranteed moment to run\n    stopSensors()\n    pauseTimersAndAnimations()\n    releaseExpensiveResources()\n\nonSuspended():             // frozen -- no code runs here\n    // (nothing; you are not executing)\n\nonTerminated():            // may NEVER be called before a kill\n    // do NOT rely on this to save state\n\n// Mental test: if the OS killed this app right now, could the\n// user return later and find everything exactly as they left it?"
      },
      {
        "lang": "swift",
        "label": "iOS: react to scene phase changes (SwiftUI)",
        "code": "// iOS exposes explicit named app/scene states.\n@Environment(\\.scenePhase) private var scenePhase\n\n.onChange(of: scenePhase) { _, phase in\n    switch phase {\n    case .active:\n        startSensors()          // foreground, interactive\n    case .background:\n        saveStateNow()          // last safe moment before suspend\n        releaseResources()\n    case .inactive:\n        pauseAnimations()       // transitioning, not interactive\n    @unknown default:\n        break\n    }\n}\n// The system may terminate a suspended app silently, so state is\n// saved on .background -- never assume a termination callback."
      }
    ],
    "resources": [
      {
        "label": "iOS managing your app's life cycle",
        "url": "https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle",
        "kind": "docs"
      },
      {
        "label": "Android processes and app lifecycle",
        "url": "https://developer.android.com/guide/components/activities/process-lifecycle",
        "kind": "docs"
      },
      {
        "label": "Android activity lifecycle",
        "url": "https://developer.android.com/guide/components/activities/activity-lifecycle",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "screen-lifecycle",
    "phase": 1,
    "phaseName": "App Lifecycle & Process Model",
    "orderIndex": 3,
    "estimatedMins": 40,
    "prerequisites": [
      "app-lifecycle-states"
    ],
    "title": "Screen Lifecycle (Activity = ViewController)",
    "eli5": "Every screen in an app is born, comes to the front, goes to the back, and eventually dies — just like the whole app does, but for one screen at a time. The phone tells the screen 'you are being created', 'you are visible now', 'you are in front', 'someone covered you', 'you are hidden', and 'you are being destroyed', and the screen has to do the right thing at each step.",
    "analogy": "A screen's life is like a shopkeeper's day at a stall. Set up the stall in the morning (create). Open the shutters so customers can see (start). Stand at the counter ready to serve (resume). Step back when a bigger truck blocks the view (pause). Close the shutters when the market ends (stop). Pack up and leave (destroy). Each cue tells the shopkeeper exactly what to do next.",
    "explanation": "Below the whole-app lifecycle sits the per-screen lifecycle, and the deep insight is that Android's Activity and iOS's UIViewController are the same concept: a single screen with a birth-to-death sequence of callbacks. Think of it as one universal flow — create, start, resume, pause, stop, destroy — even though each platform names the steps differently. Create is where the screen is constructed and its views are set up, but it is not visible yet. Start / become visible is when the screen appears on screen but may not yet have focus. Resume / did appear is when the screen is fully in front and interactive — the moment to start animations, sensors, and data refresh. Pause / will disappear is when something partially covers the screen or it is about to leave the front — the moment to pause ongoing work and save lightweight state. Stop / did disappear is when the screen is fully hidden — release heavier resources. Destroy is final teardown. The same discipline applies as at the app level: acquire on the way up (resume), release and save on the way down (pause/stop), and never assume the screen stays alive.\n\nAndroid vs iOS callout: Side by side, Android's Activity callbacks are onCreate, onStart, onResume, onPause, onStop, onDestroy. iOS's UIViewController callbacks are viewDidLoad (once, on construction), viewWillAppear and viewDidAppear (becoming visible and then front-and-interactive), and viewWillDisappear and viewDidDisappear (leaving and then hidden), with deinit for teardown. onResume maps to viewDidAppear, onPause maps to viewWillDisappear, onStop maps to viewDidDisappear. The names differ but the ladder is the same: created, visible, focused, losing focus, hidden, destroyed.",
    "technicalDeep": "The pairing of callbacks is the key to correctness: whatever you acquire in the 'coming to front' callback you release in the matching 'leaving front' callback. Start sensors in resume, stop them in pause. Register listeners in start, unregister them in stop. This symmetry prevents leaks and wasted battery. The 'pause/will disappear' callback is especially important because it is the reliable point where the screen is losing the foreground — brief and guaranteed enough to save quick state and stop work, whereas 'stop/destroy' may be delayed or, in some kill scenarios, skipped. Construction callbacks (onCreate / viewDidLoad) run once per screen instance and are for wiring up views and one-time setup, not for work that must repeat each time the screen becomes visible — that belongs in start/resume, which can fire multiple times as the user navigates back and forth.\n\nAndroid vs iOS callout: On Android, rotation or other configuration changes destroy and recreate the Activity, so onCreate can run many times for what the user sees as 'the same screen', and transient view state must be saved via onSaveInstanceState. On iOS, a UIViewController is generally not destroyed on rotation — it receives size/trait change callbacks instead and viewDidLoad runs once — so the recreation pattern is far less frequent. This is a major practical divergence: Android developers must design for frequent screen recreation, while iOS developers handle rotation as an in-place resize.",
    "whatBreaks": "The signature bugs come from mismatched pairs and wrong-callback placement. Registering a listener or starting a sensor in a 'coming to front' callback but forgetting to stop it in the matching 'leaving' callback leaks memory and drains battery, and can crash when a background callback touches a destroyed screen. Doing per-appearance work (like refreshing data) in the construct-once callback means it never repeats when the user navigates back. On Android specifically, assuming the Activity survives rotation leads to lost view state and re-run initialization, because rotation destroys and recreates it. And doing heavy work in the appear/resume callback janks the transition animation because it runs right as the screen is coming into view.",
    "efficientWay": {
      "title": "Managing the Screen Lifecycle",
      "approaches": [
        {
          "name": "Pair every acquire with its release across matching callbacks, do one-time setup in construction and per-appearance work in resume/appear",
          "verdict": "best",
          "reason": "The symmetric pairing prevents leaks and battery drain, and placing work in the right callback keeps behavior correct across navigation and (on Android) recreation."
        },
        {
          "name": "Put all setup in the construction callback and all teardown in destroy",
          "verdict": "weak",
          "reason": "Construction runs once and destroy can be delayed or skipped, so per-appearance work never repeats and resources leak while the screen is merely hidden."
        },
        {
          "name": "Use lifecycle-aware components that bind resources to the lifecycle automatically",
          "verdict": "ok",
          "reason": "A strong pattern that reduces manual errors, but you still must understand the callbacks to know what to bind and when, especially around recreation."
        }
      ],
      "recommendation": "Treat Activity and ViewController as one concept with a shared ladder. Acquire in resume/appear and release in the matching pause/disappear, keep one-time setup in construction, and design (especially on Android) for the screen being destroyed and recreated at any time."
    },
    "commonMistakes": [
      "Registering a listener or sensor in a 'coming to front' callback but not stopping it in the matching 'leaving' one, causing leaks and battery drain",
      "Doing per-appearance work like data refresh in the construct-once callback so it never repeats on return",
      "Assuming an Android Activity survives rotation, losing view state when it is destroyed and recreated",
      "Running heavy work in the appear/resume callback and janking the screen transition animation"
    ],
    "seniorNotes": "The unifying mental model — Activity equals ViewController, one screen with a create-to-destroy ladder — is what lets an engineer move between platforms fluently and reason about lifecycle bugs quickly. The senior discipline is strict callback symmetry (acquire up, release down, always in matching pairs) and knowing the one big divergence: Android recreates screens on configuration changes while iOS resizes in place, so Android code must be robust to frequent recreation and iOS code must handle trait/size changes. Lifecycle-aware components and observers are the modern way to make the pairing automatic and leak-proof, but they are a convenience on top of the callback model, not a replacement for understanding it.",
    "interviewQuestions": [
      "Explain why an Android Activity and an iOS UIViewController are the same concept, and map their callbacks to one another.",
      "Why should acquiring and releasing a resource happen in matching lifecycle callbacks, and what breaks if they do not?",
      "What is the key difference between how Android and iOS handle a device rotation at the screen level?"
    ],
    "interviewAnswers": [
      "Both represent a single screen with a birth-to-death sequence of callbacks — created, visible, focused, losing focus, hidden, destroyed — so they are the same concept under different names. Android's Activity uses onCreate, onStart, onResume, onPause, onStop, onDestroy. iOS's UIViewController uses viewDidLoad (once), viewWillAppear and viewDidAppear, viewWillDisappear and viewDidDisappear, and deinit. onResume maps to viewDidAppear, onPause to viewWillDisappear, onStop to viewDidDisappear. Recognizing this one ladder lets you reason about screen lifecycle on either platform with the same rules.",
      "Because the lifecycle is symmetric: the 'coming to front' and 'leaving front' callbacks come in pairs, and binding acquire to one and release to its match guarantees you never leave a resource running while the screen is not using it. If you acquire a sensor or register a listener on the way up but forget to release it on the way down, you leak memory, drain battery for invisible work, and risk a crash when a stale callback touches a screen that is gone. Pairing acquire-with-release across matching callbacks is the core discipline that prevents this whole class of bug.",
      "On Android, a rotation is a configuration change that by default destroys and recreates the Activity, so onCreate runs again and any unsaved view state is lost unless you save it via onSaveInstanceState — the screen is rebuilt. On iOS, the view controller is generally not destroyed; it stays alive and receives size and trait-change callbacks, handling rotation as an in-place resize with viewDidLoad running only once. So Android developers must design for frequent recreation, while iOS developers treat rotation as a layout update."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "One screen lifecycle ladder, both platforms (pseudocode)",
        "code": "// The SAME ladder; only the names differ.\n//\n//   Android onCreate    ==  iOS viewDidLoad      (build views, once)\n//   Android onStart     ==  iOS viewWillAppear   (becoming visible)\n//   Android onResume    ==  iOS viewDidAppear    (front + interactive)\n//   Android onPause     ==  iOS viewWillDisappear(losing the front)\n//   Android onStop      ==  iOS viewDidDisappear (fully hidden)\n//   Android onDestroy   ==  iOS deinit           (teardown)\n\nonCreate / viewDidLoad:      buildViews()          // ONCE\nonResume / viewDidAppear:    startSensors(); refreshData()  // each time\nonPause  / viewWillDisappear: stopSensors(); saveQuickState()\nonStop   / viewDidDisappear:  releaseHeavyResources()\nonDestroy/ deinit:           finalCleanup()\n\n// Rule: acquire on the way UP, release in the MATCHING callback\n// on the way DOWN. Never leave work running on a hidden screen."
      },
      {
        "lang": "kotlin",
        "label": "Android: symmetric acquire/release across Activity callbacks",
        "code": "class MapActivity : AppCompatActivity() {\n    override fun onCreate(state: Bundle?) {   // once: wire up views\n        super.onCreate(state)\n        setContentView(R.layout.map)\n    }\n    override fun onResume() {                 // front + interactive\n        super.onResume()\n        locationClient.start()                // ACQUIRE\n    }\n    override fun onPause() {                   // losing the front\n        super.onPause()\n        locationClient.stop()                 // matching RELEASE\n        saveQuickState()                      // last safe moment\n    }\n    // Rotation destroys & recreates this Activity, so transient\n    // UI state must go through onSaveInstanceState -- unlike iOS,\n    // where the view controller is resized in place.\n}"
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
    "id": "process-death-restoration",
    "phase": 1,
    "phaseName": "App Lifecycle & Process Model",
    "orderIndex": 4,
    "estimatedMins": 40,
    "prerequisites": [
      "app-lifecycle-states",
      "screen-lifecycle"
    ],
    "title": "Process Death & State Restoration",
    "eli5": "When you switch away from an app, the phone might quietly shut it down to free up memory for whatever you are using now. Later, when you come back, the app has to pretend nothing happened — showing you the same screen with the same text you had typed. To do that, it has to save a little note before it dies and read that note when it comes back.",
    "analogy": "It is like leaving a hotel room for the day. Housekeeping might clear and reset the whole room while you are out (process death). A good hotel keeps a card with your preferences — your side of the bed, your pillow choice, the book you left on the nightstand — and restores it before you return, so it feels like you never left. The card is your saved instance state.",
    "explanation": "Process death is one of the defining realities of mobile: the OS routinely kills backgrounded apps to reclaim memory for the foreground app, and it does so silently, often with no chance to run cleanup code. When the user later returns, the OS relaunches the app from scratch (a cold start) but — and this is the important part — it expects the app to look as if it was never gone. Bridging that gap is state restoration: before the app goes to the background, it writes a small bundle of transient UI state (which screen was open, scroll position, text half-typed into a field, selected tab), and when it is recreated it reads that bundle back and rebuilds the exact screen. The user should never be able to tell that the process was destroyed and rebuilt underneath them. This is distinct from saved user data (which belongs in a database); restoration state is the small, ephemeral, in-the-moment UI state that would otherwise be lost. Getting this right is the difference between an app that feels solid and one that mysteriously 'forgets' where you were.\n\nAndroid vs iOS callout: Android provides a saved instance state Bundle — you write transient UI state in onSaveInstanceState and read it back in onCreate or onRestoreInstanceState, and the platform automatically restores basic view state (like text in fields) if views have IDs; ViewModel plus SavedStateHandle is the modern approach. iOS provides state restoration through encode/decode restoration APIs and, in modern apps, scene-based state restoration where you persist a small user-activity or restoration payload and rebuild the interface from it on relaunch. Same problem, same solution shape: save a small transient-state payload on the way out, restore from it on the way back in.",
    "technicalDeep": "The critical subtlety is that process death is not the same as the user closing the app. If the user explicitly swipes the app away, you generally should not restore into the middle of a flow — that is an intentional exit. But if the OS kills the process to reclaim memory while the app is backgrounded, the user did not choose to leave, so returning must feel seamless. The system distinguishes these cases and only triggers restoration for the involuntary kind. The save must happen at the transition to the background (the last guaranteed moment to run code), and the payload must be small — it is serialized and held by the system, so large data does not belong there; store large or durable data in a database and keep only references or ids in the restoration state. Restoration also composes with the screen lifecycle: on relaunch the app rebuilds its back stack / navigation and each recreated screen restores its own transient state.\n\nAndroid vs iOS callout: On Android the saved instance state Bundle is intentionally size-limited (it crosses an IPC boundary via Binder), so putting large objects in it risks a failure — you store ids and re-fetch from your repository. ViewModels survive configuration changes but not process death, which is exactly why SavedStateHandle exists to bridge them across a real kill. On iOS, restoration encodes a compact representation and the system decides when to restore versus start fresh; you rebuild view controllers from the restoration identifiers or the persisted user activity. Both platforms cap the payload size and expect large data to live in persistent storage.",
    "whatBreaks": "The defining bug is the app that 'forgets': the user fills a long form, switches to another app to check something, comes back, and the form is blank because the process was killed and nothing was restored. Or a deep navigation stack collapses back to the home screen after returning from the background. Another break is stuffing large objects into the restoration payload, which either fails outright (Android's Bundle size limit) or bloats and slows restoration. Confusing ViewModel survival with process-death survival is common — developers assume a ViewModel keeps state across a kill, but it does not, so state vanishes on real process death. And restoring after an intentional user swipe-away can be its own bug, dropping the user back into a flow they meant to leave.",
    "efficientWay": {
      "title": "Surviving Process Death",
      "approaches": [
        {
          "name": "Save small transient UI state on entering background, keep durable data in a database, and restore the exact screen on relaunch",
          "verdict": "best",
          "reason": "Matches how the platforms work: the small payload survives the kill, durable data lives where it belongs, and the user sees a seamless return."
        },
        {
          "name": "Rely on in-memory holders like ViewModels to keep state across backgrounding",
          "verdict": "weak",
          "reason": "In-memory holders survive configuration changes but not process death, so state is lost exactly when the OS kills the backgrounded process."
        },
        {
          "name": "Persist everything, including large objects, into the restoration payload for safety",
          "verdict": "weak",
          "reason": "The restoration payload is size-capped and IPC-bound; large objects cause failures or slow restoration. Large data belongs in persistent storage."
        }
      ],
      "recommendation": "Split state by nature: durable user data goes to a database, small transient UI state (current screen, scroll, half-typed input, selection) goes into the restoration payload saved on entering the background. On relaunch, rebuild the navigation stack and restore each screen so the user cannot tell the process was killed. Store ids in the payload and re-fetch the rest."
    },
    "commonMistakes": [
      "Losing a half-filled form or deep navigation stack because nothing was saved before the OS killed the backgrounded process",
      "Putting large objects into the size-capped restoration payload, causing failures or slow restoration",
      "Assuming a ViewModel or in-memory holder survives process death when it only survives configuration changes",
      "Restoring the user back into a flow they intentionally swiped away from"
    ],
    "seniorNotes": "Process death is normal, frequent, and silent, so senior engineers design for it as a baseline rather than an edge case, and they test it deliberately (both platforms offer a way to simulate a background kill). The core discipline is separating durable data (database) from transient restoration state (small payload saved on entering background), and never conflating in-memory survival (configuration changes) with real process-death survival. They also respect the voluntary-versus-involuntary distinction — restore after an OS kill, but honor an intentional swipe-away — and keep the restoration payload tiny by storing ids and re-fetching. The gold standard is that a user can be killed and relaunched at any moment and never notice.",
    "interviewQuestions": [
      "What is process death, why does it happen, and how does state restoration make it invisible to the user?",
      "Why is a ViewModel or other in-memory holder insufficient to survive process death, and what do you use instead?",
      "What should and should not go into the restoration payload, and why is it size-limited?"
    ],
    "interviewAnswers": [
      "Process death is when the OS silently kills a backgrounded app to reclaim memory for the foreground app, usually with no chance to run cleanup. When the user returns, the OS relaunches the app cold but expects it to look as if it never left. State restoration bridges that gap: before going to the background the app saves a small bundle of transient UI state — current screen, scroll position, half-typed text, selected tab — and on recreation it reads that bundle back and rebuilds the exact screen. Done right, the user cannot tell the process was destroyed and rebuilt.",
      "Because in-memory holders like ViewModels are designed to survive configuration changes (such as rotation) by outliving the recreated screen, but they still live in the app's process — and process death destroys the whole process, taking them with it. So state kept only in a ViewModel vanishes on a real background kill. To survive process death you persist transient UI state into the platform's restoration payload (Android's saved instance state Bundle, often via SavedStateHandle; iOS's state restoration), and durable data into a database, then rebuild from those on relaunch.",
      "The payload should hold only small, transient UI state needed to rebuild the current screen: which screen is open, scroll position, half-entered input, current selection, and ids referencing larger data. It should not hold large objects or durable user data, because the payload is serialized and held by the system across an IPC boundary and is size-capped — on Android the saved instance state Bundle crosses Binder and will fail if oversized. Large or durable data belongs in persistent storage; you keep just an id in the payload and re-fetch the rest on restore."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Save small state out, restore it back in (pseudocode)",
        "code": "// The OS can kill a backgrounded app at any time, silently.\n\nonLeavingForeground():                  // last safe moment\n    payload.put(\"screen\", currentScreenId)\n    payload.put(\"scroll\", list.scrollPosition)\n    payload.put(\"draft\", inputField.text)   // half-typed input\n    payload.put(\"itemId\", selectedItemId)    // id, NOT the object\n    // durable data was already written to the database earlier\n\nonRecreatedAfterKill(payload):          // cold start, but restore\n    goToScreen(payload.get(\"screen\"))\n    list.scrollTo(payload.get(\"scroll\"))\n    inputField.text = payload.get(\"draft\")\n    item = database.load(payload.get(\"itemId\"))  // re-fetch big data\n    render(item)\n\n// Keep the payload TINY (it is size-capped and crosses IPC).\n// Restore only for OS-initiated kills, not an intentional swipe-away."
      },
      {
        "lang": "kotlin",
        "label": "Android: bridge state across process death with SavedStateHandle",
        "code": "// A plain ViewModel survives rotation but NOT process death.\n// SavedStateHandle persists small state across a real kill.\nclass FormViewModel(\n    private val state: SavedStateHandle\n) : ViewModel() {\n\n    // Backed by saved instance state -> survives process death\n    var draft: String\n        get() = state[\"draft\"] ?: \"\"\n        set(value) { state[\"draft\"] = value }   // small + transient\n\n    // Large/durable data lives in the database; keep only the id\n    var itemId: Long?\n        get() = state[\"itemId\"]\n        set(value) { state[\"itemId\"] = value }\n}\n// iOS mirrors this via scene state restoration: persist a compact\n// payload on backgrounding, rebuild the UI from it on relaunch."
      }
    ],
    "resources": [
      {
        "label": "Android processes and app lifecycle",
        "url": "https://developer.android.com/guide/components/activities/process-lifecycle",
        "kind": "docs"
      },
      {
        "label": "Android activity lifecycle (saving state)",
        "url": "https://developer.android.com/guide/components/activities/activity-lifecycle",
        "kind": "docs"
      },
      {
        "label": "iOS managing your app's life cycle",
        "url": "https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "main-ui-thread",
    "phase": 1,
    "phaseName": "App Lifecycle & Process Model",
    "orderIndex": 5,
    "estimatedMins": 35,
    "prerequisites": [
      "screen-lifecycle"
    ],
    "title": "The Main (UI) Thread Rule",
    "eli5": "There is one special worker in every app whose only job is to draw the screen and respond to your taps, about sixty times a second. If you hand that worker a slow chore — like downloading a file — it stops drawing, the screen freezes, and if it stays stuck too long the phone declares the app broken and may shut it down. So you must give slow chores to other workers and keep the special one free.",
    "analogy": "The main thread is the single cashier at a busy shop who must serve every customer quickly to keep the line moving. If the cashier stops to go into the back room and count the entire inventory (a slow task), the whole line freezes and customers walk out. The fix is to send a stock clerk (a background thread) to count inventory while the cashier keeps serving. One cashier, kept free, is the whole game.",
    "explanation": "Every mobile app has one special thread — the main thread, also called the UI thread — and it is the only thread allowed to draw the screen and handle user input. It runs a tight loop that must process each frame in a few milliseconds to hit the target of roughly 60 (or more) frames per second. The single most important performance rule in all of mobile is: never block the main thread. If you do slow work on it — a network request, a large file read, a heavy computation, an image decode — the loop cannot draw the next frame, the UI freezes, taps stop registering, and animations stutter (jank). Worse, if you block it for too long, the OS decides the app is unresponsive and kills it outright with an error shown to the user. The solution is always the same: keep the main thread doing only fast UI work, and offload anything slow to a background thread, then hand the result back to the main thread to update the screen. This one rule underlies most of what 'good mobile performance' means.\n\nAndroid vs iOS callout: Android enforces this with the ANR (Application Not Responding) watchdog — if the main thread does not respond to input within a few seconds (about 5 seconds for input events), the system shows the ANR dialog and can kill the app; Android even throws NetworkOnMainThreadException to forbid network calls on the UI thread outright. iOS enforces it with its own watchdog that terminates apps whose main thread hangs too long (surfacing as a hang or a watchdog crash), and UIKit requires that all UI updates happen on the main thread. Same rule, two watchdogs.",
    "technicalDeep": "The main thread runs an event loop (a run loop / looper) that pulls work items — input events, layout, draw commands, posted callbacks — and processes them one at a time. To render smoothly at 60fps you have about 16 milliseconds per frame for everything the main thread does; exceed it and you drop a frame (visible jank). Any single blocking operation on the main thread that takes longer than a frame budget causes a stutter, and one that takes seconds causes a freeze and a watchdog kill. The correct pattern is to move blocking work to a background execution context and post the result back to the main thread for the UI update — because updating the UI itself must happen on the main thread. Concurrency primitives exist precisely to make this easy: thread pools, async tasks, coroutines, and dispatch queues let you say 'do this off the main thread, then run this bit back on it'.\n\nAndroid vs iOS callout: On Android the offload tools are Kotlin coroutines (with Dispatchers.IO for work and Dispatchers.Main for UI), plus executors and WorkManager for deferrable jobs; touching a UI view off the main thread throws. On iOS the tools are Grand Central Dispatch (a background DispatchQueue for work, DispatchQueue.main for UI) and Swift async/await with actors, and UIKit similarly requires UI mutations on the main thread. Both give you the same shape: run the slow part off-main, hop back to main to update the screen.",
    "whatBreaks": "The visible breaks are jank and freezes: a list stutters while scrolling because each row does a synchronous image decode on the main thread; the whole UI locks up for a few seconds because a network call or database query ran on the main thread; a spinner never even appears because the code that would show it is stuck behind the blocking work on the same thread. The catastrophic break is the watchdog kill — the app hangs long enough that the OS terminates it (an ANR on Android, a watchdog crash on iOS), which counts as a crash and tanks reliability metrics. The subtle break is the opposite mistake: doing work on a background thread but then touching the UI from that background thread, which crashes because UI updates must be on the main thread.",
    "efficientWay": {
      "title": "Keeping the Main Thread Free",
      "approaches": [
        {
          "name": "Do all slow work on a background thread and hop back to the main thread only for the UI update",
          "verdict": "best",
          "reason": "It keeps the frame loop free so the UI stays smooth and responsive, respects the rule that UI updates must be on the main thread, and avoids watchdog kills."
        },
        {
          "name": "Do the slow work on the main thread but show a spinner first",
          "verdict": "weak",
          "reason": "The spinner cannot even animate because the main thread is blocked; the UI still freezes and can still trigger a watchdog kill."
        },
        {
          "name": "Do everything, including UI updates, on background threads to be safe",
          "verdict": "weak",
          "reason": "Touching the UI off the main thread crashes on both platforms; only non-UI work belongs off-main, and results must be posted back to the main thread."
        }
      ],
      "recommendation": "Treat the main thread as sacred: it does UI and only fast UI work. Offload every network call, disk read, heavy computation, and image decode to a background context, then dispatch just the final UI update back to the main thread. Never block it, and never touch UI off it."
    },
    "commonMistakes": [
      "Running a network call or database query on the main thread and freezing the whole UI",
      "Decoding images synchronously in a list row, causing scroll jank",
      "Showing a spinner but running the slow work on the same main thread so the spinner cannot animate",
      "Updating UI from a background thread, which crashes because UI must be touched on the main thread"
    ],
    "seniorNotes": "Never block the main thread is the single highest-value rule in mobile performance, and senior engineers treat any main-thread work over the frame budget (~16ms) as a bug. The discipline is a clean split: slow work runs off-main, and only the minimal final UI mutation hops back to the main thread. They also watch for the inverse error — background code reaching into UI objects — which crashes because UI is main-thread-only on both platforms. Watchdog kills (ANRs on Android, hang terminations on iOS) are counted as crashes and directly hurt store ratings and reliability dashboards, so keeping the main thread responsive is both a UX and a reliability mandate. Profiling for dropped frames on real mid-range devices is how they catch regressions early.",
    "interviewQuestions": [
      "What is the main (UI) thread, and why is 'never block it' the most important performance rule in mobile?",
      "What happens if you block the main thread for a few seconds, and how do Android and iOS respond?",
      "What is the correct pattern for doing slow work while keeping the UI responsive, and what is the common inverse mistake?"
    ],
    "interviewAnswers": [
      "The main thread, or UI thread, is the single thread allowed to draw the screen and handle user input, running a loop that must render each frame in about 16 milliseconds to stay smooth. 'Never block it' is the top rule because any slow work on it — a network call, disk read, heavy computation, or image decode — stops the loop from drawing the next frame, so the UI freezes, taps stop registering, and animations stutter. Since responsiveness is the core of a good app and blocking it can even get the app killed by the OS, keeping it free is the foundation of mobile performance.",
      "The UI freezes: no frames draw, input is not processed, and spinners cannot animate. If it stays blocked too long, the OS decides the app is unresponsive and terminates it. On Android this is the ANR (Application Not Responding) mechanism — the watchdog trips when the main thread does not handle input within a few seconds and shows the ANR dialog, and Android even throws NetworkOnMainThreadException to forbid network calls on it. On iOS, a separate watchdog terminates apps whose main thread hangs too long, surfacing as a hang or watchdog crash. Both count as crashes against your reliability.",
      "The correct pattern is to run the slow work on a background execution context — a background thread, coroutine, or dispatch queue — and then post only the final UI update back to the main thread, because UI mutations must happen on the main thread. So you do the fetch or computation off-main and hop back to main just to render the result. The common inverse mistake is doing the work in the background but then touching a UI object directly from that background thread, which crashes on both platforms; the UI update must be dispatched back to the main thread."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Offload slow work, hop back to main for UI (pseudocode)",
        "code": "// BAD: blocks the main thread -> freeze, jank, watchdog kill\nonButtonClick():\n    data = network.get(\"/report\")   // slow, ON the main thread\n    label.text = data.title         // UI never updates until done\n\n// GOOD: slow work off-main, UI update back on main\nonButtonClick():\n    showSpinner()                   // fast, on main\n    background {\n        data = network.get(\"/report\")   // off the main thread\n        main {\n            hideSpinner()\n            label.text = data.title      // UI update MUST be on main\n        }\n    }\n\n// Two rules, always:\n//   1. Never do slow work on the main thread.\n//   2. Never touch UI off the main thread."
      },
      {
        "lang": "swift",
        "label": "iOS: background work with GCD, UI update back on main",
        "code": "func loadReport() {\n    showSpinner()                               // on main, fast\n    DispatchQueue.global(qos: .userInitiated).async {\n        let data = self.network.getReport()     // off the main thread\n        DispatchQueue.main.async {              // hop back for UI\n            self.hideSpinner()\n            self.titleLabel.text = data.title   // UIKit: main only\n        }\n    }\n}\n// If the main thread hangs too long, iOS's watchdog terminates\n// the app -- the equivalent of an Android ANR."
      }
    ],
    "resources": [
      {
        "label": "Android app fundamentals (processes and threads)",
        "url": "https://developer.android.com/guide/components/fundamentals",
        "kind": "docs"
      },
      {
        "label": "Android activity lifecycle",
        "url": "https://developer.android.com/guide/components/activities/activity-lifecycle",
        "kind": "docs"
      },
      {
        "label": "iOS managing your app's life cycle",
        "url": "https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "config-changes",
    "phase": 1,
    "phaseName": "App Lifecycle & Process Model",
    "orderIndex": 6,
    "estimatedMins": 30,
    "prerequisites": [
      "screen-lifecycle",
      "process-death-restoration"
    ],
    "title": "Configuration Changes & Recreation",
    "eli5": "When you rotate your phone, switch to dark mode, or change the language, the app's screen sometimes has to be rebuilt from scratch so it looks right in the new situation. If the app is not careful, that rebuild can throw away what you were doing — like the text you typed — so the app has to save and restore it around the rebuild.",
    "analogy": "A configuration change is like redecorating a room for a different season. You need new curtains and layout (a fresh screen built for the new setup), but you must carefully carry out the personal items — the photos, the half-finished puzzle — and put them back after, or the redecoration erases the life in the room. Rebuild the room, preserve the belongings.",
    "explanation": "A configuration change is when something about the device environment changes that the UI depends on: rotating the screen, switching between light and dark mode, changing the system language or region, resizing the window in multi-window/split-screen, or a font-size accessibility change. Because layouts, strings, and resources may all differ for the new configuration, the platform may respond by recreating the affected screen so it picks up the correct resources. Recreation means the screen is torn down and rebuilt — and that is exactly when in-progress state can be lost if you have not preserved it. So there are two strategies: let the platform recreate the screen (the default and usually correct choice) and make sure your transient state survives the recreation, or handle the change yourself in place without recreation when recreation would be wasteful or disruptive. The right default is to embrace recreation and design state to survive it, using the same save/restore mechanisms as process death, because a configuration change is a fast, in-memory recreation of the same kind.\n\nAndroid vs iOS callout: This is one of the biggest concrete divergences between the platforms. On Android, a configuration change like rotation by default destroys and recreates the Activity — onDestroy then onCreate run — so you must preserve state via onSaveInstanceState or a ViewModel that survives the recreation; you can opt to handle certain changes yourself by declaring them and overriding onConfigurationChanged. On iOS, the view controller is generally not destroyed on rotation or dark-mode changes; instead it stays alive and receives callbacks like trait-collection changes and view size changes, so you update the existing UI in place. Android recreates by default; iOS updates in place by default.",
    "technicalDeep": "The reason recreation is the default (on Android) is correctness: resources are selected by configuration — a different layout for landscape, different colors for dark mode, different strings for a locale — so the cleanest way to apply them is to rebuild the screen and let the resource system pick the right variants. The cost is that recreation runs the screen lifecycle again, so any state held only in the destroyed instance is gone unless saved. This is why an in-memory holder that survives configuration changes (but not process death) exists: it lets you keep expensive, non-persistent state (like loaded data or scroll position) across the fast recreation without re-fetching, while genuinely transient view state goes into the saved-state bundle. Handling a change in place (overriding the recreation) avoids the teardown but makes you responsible for manually re-applying every configuration-dependent resource, which is error-prone and only worth it for specific cases like a custom view that would be expensive or jarring to rebuild.\n\nAndroid vs iOS callout: On Android, a ViewModel survives configuration-change recreation (that is its primary purpose) but not process death, so you combine a ViewModel for expensive in-memory state with SavedStateHandle for transient state that must also survive a kill. Declaring android:configChanges and handling onConfigurationChanged opts out of recreation for those changes. On iOS, because the controller is not destroyed, you respond to traitCollectionDidChange / UITraitChangeObservable and viewWillTransition(to size:) to adapt in place — there is usually nothing to save and restore because the object persists.",
    "whatBreaks": "The archetypal Android bug: the user rotates the device mid-task and loses their work — a half-filled form clears, a loaded list reloads from the network, scroll position jumps to the top — because the Activity was recreated and nothing was preserved. Another break is re-running expensive work on every rotation (re-fetching data, re-decoding images) because state was not kept in a survives-recreation holder, causing flicker and wasted battery. Over-using the opt-out (handling config changes manually to avoid recreation) leads to subtle bugs where dark mode or a locale change does not fully apply because the developer forgot to re-apply some resource by hand. On iOS, assuming the controller is recreated (as on Android) leads to putting setup in the wrong place, since it actually persists.",
    "efficientWay": {
      "title": "Handling Configuration Changes",
      "approaches": [
        {
          "name": "Let the platform recreate the screen and design transient state to survive it (survives-recreation holder plus saved-state bundle)",
          "verdict": "best",
          "reason": "Recreation cleanly applies the correct resources for the new configuration, and preserving state around it gives correct visuals with no lost work."
        },
        {
          "name": "Opt out of recreation and handle every configuration change manually in place",
          "verdict": "ok",
          "reason": "Occasionally justified for a specific expensive or custom view, but it makes you re-apply every config-dependent resource by hand, which is error-prone."
        },
        {
          "name": "Ignore configuration changes and hope state survives",
          "verdict": "weak",
          "reason": "On Android the screen is recreated by default, so unpreserved state is lost and the user's work disappears on something as common as a rotation."
        }
      ],
      "recommendation": "Default to letting the platform recreate the screen and make state survive it: keep expensive in-memory state in a survives-recreation holder and transient view state in the saved-state bundle. Only handle a change in place for a specific view where recreation is genuinely too expensive or disruptive, and then re-apply all affected resources carefully."
    },
    "commonMistakes": [
      "Losing a half-filled form, loaded list, or scroll position when an Android Activity is recreated on rotation",
      "Re-fetching data or re-decoding images on every configuration change because state was not kept in a survives-recreation holder",
      "Over-using the recreation opt-out and then failing to re-apply dark mode, locale, or layout resources by hand",
      "Assuming an iOS view controller is recreated like an Android Activity, putting setup in the wrong callback"
    ],
    "seniorNotes": "Configuration-change recreation is really process death's fast, in-memory cousin, and the senior move is to unify the handling: design every screen to be recreated at any moment and restore itself, and both rotation and a real kill are covered by the same discipline. The nuance is the platform split — Android recreates by default so you must preserve state, while iOS updates the persisting controller in place — and knowing which holder survives what (a ViewModel survives recreation but not process death; the saved-state bundle survives both). The opt-out (handling changes manually) is a sharp tool for specific expensive views, not a general escape hatch, because it shifts the burden of correctly re-applying every configuration-dependent resource onto you.",
    "interviewQuestions": [
      "What is a configuration change, and why does it sometimes cause a screen to be recreated?",
      "How do Android and iOS differ in their default response to a rotation, and what does that mean for your state handling?",
      "When would you opt out of recreation and handle a configuration change in place, and what is the risk?"
    ],
    "interviewAnswers": [
      "A configuration change is any change to the device environment the UI depends on — rotation, dark mode, system language or region, window resizing in split-screen, or a font-size accessibility change. It can cause recreation because resources like layouts, colors, and strings are selected per configuration, so the cleanest way to apply the correct variants is to tear down and rebuild the affected screen. The catch is that recreation runs the screen lifecycle again, so any transient state held only in the destroyed instance is lost unless you save and restore it around the rebuild.",
      "On Android, a rotation by default destroys and recreates the Activity, so onDestroy and onCreate run and you must preserve transient state via onSaveInstanceState and keep expensive state in a ViewModel that survives recreation. On iOS, the view controller is generally not destroyed; it stays alive and receives trait-collection and size-transition callbacks, so you adapt the existing UI in place. Practically, Android developers must design for frequent recreation and preserve state around it, while iOS developers update the persisting controller and usually have nothing to save and restore.",
      "I opt out of recreation only for a specific view where rebuilding would be too expensive or visually jarring — for example a complex custom rendering or an in-progress media surface — by declaring that I will handle those changes and responding to the change callback in place. The risk is that I then become responsible for manually re-applying every configuration-dependent resource — the correct dark-mode colors, the landscape layout, the localized strings — and it is easy to miss one, so the UI ends up partially applying the new configuration. That is why it is a targeted tool, not a default."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Survive recreation with the right state holders (pseudocode)",
        "code": "// A config change (rotation, dark mode, locale) may recreate the\n// screen. Preserve state around the rebuild.\n\n// Expensive, non-persistent state -> survives-recreation holder\nsurvivesRecreation state:\n    loadedList      // do NOT re-fetch on every rotation\n    scrollPosition\n\n// Genuinely transient view state -> saved-state bundle\nonLeavingForeground():\n    bundle.put(\"draft\", inputField.text)   // survives kill too\n\nonRecreated(bundle):\n    render(state.loadedList)                // reused, no reload\n    list.scrollTo(state.scrollPosition)\n    inputField.text = bundle.get(\"draft\")\n\n// Android: recreation is the DEFAULT on rotation -> must preserve.\n// iOS: controller persists -> adapt in place via trait/size change:\n//   onTraitOrSizeChange(): applyDarkModeColors(); relayout()"
      },
      {
        "lang": "kotlin",
        "label": "Android: ViewModel survives recreation; SavedStateHandle survives death",
        "code": "class ListViewModel(\n    private val saved: SavedStateHandle\n) : ViewModel() {\n    // Expensive state: survives rotation recreation, no re-fetch\n    val items = MutableLiveData<List<Item>>()\n\n    // Transient UI state: survives BOTH recreation and process death\n    var scrollPos: Int\n        get() = saved[\"scrollPos\"] ?: 0\n        set(v) { saved[\"scrollPos\"] = v }\n\n    fun loadOnce() {\n        if (items.value == null) fetch()   // guard against reload\n    }\n}\n// On iOS there is usually nothing to save/restore here: the view\n// controller persists and you adapt in traitCollectionDidChange\n// and viewWillTransition(to:) instead of being recreated."
      }
    ],
    "resources": [
      {
        "label": "Android activity lifecycle (configuration changes)",
        "url": "https://developer.android.com/guide/components/activities/activity-lifecycle",
        "kind": "docs"
      },
      {
        "label": "Android app fundamentals",
        "url": "https://developer.android.com/guide/components/fundamentals",
        "kind": "docs"
      },
      {
        "label": "iOS managing your app's life cycle",
        "url": "https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "app-memory-model",
    "phase": 1,
    "phaseName": "App Lifecycle & Process Model",
    "orderIndex": 7,
    "estimatedMins": 40,
    "prerequisites": [
      "app-lifecycle-states",
      "mobile-hardware-constraints"
    ],
    "title": "Memory Management: GC vs ARC & Leaks",
    "eli5": "An app is constantly borrowing bits of memory to hold things like images and data, and it has to give that memory back when done or it slowly fills up and the app gets killed. Some systems have an automatic janitor that periodically sweeps up unused memory (GC). Others count how many things are still using each item and free it the instant nobody needs it (ARC). Either way, if you accidentally keep pointing at something you no longer need, it never gets cleaned up — that is a leak.",
    "analogy": "Memory is like library books. GC is a librarian who periodically walks the building, finds books no one is reading, and reshelves them all at once — efficient, but the sweep briefly pauses the reading room. ARC is a strict checkout counter that tracks exactly how many people hold each book and reshelves it the moment the last person returns it — no big sweeps, but if two people refuse to return each other's books (a retain cycle), those books are lost forever.",
    "explanation": "Mobile apps run in memory-constrained environments where the OS kills apps that use too much, so managing memory is a survival skill, and the two dominant models work very differently. Garbage collection (GC) tracks which objects are still reachable and periodically reclaims the unreachable ones automatically; you rarely free anything by hand, but the collector runs in bursts that can briefly pause the app. Automatic Reference Counting (ARC) instead keeps a count of how many references point to each object and frees it immediately when the count hits zero; there is no periodic sweep and freeing is deterministic, but it cannot automatically break a retain cycle — two objects that reference each other keep each other's count above zero forever, so neither is freed. Under both models, the practical enemy is the leak: memory that is no longer needed but is still referenced, so it is never reclaimed. Leaks accumulate until the app hits a memory warning or gets killed. On top of both, the OS sends low-memory warnings asking every app to shed memory, and apps that ignore them are terminated first.\n\nAndroid vs iOS callout: Android (Kotlin/Java on the ART runtime) uses tracing garbage collection — you do not free objects manually, and the collector reclaims unreachable ones, occasionally pausing briefly. iOS (Swift/Objective-C) uses ARC — the compiler inserts retain and release calls so objects are freed the instant their reference count drops to zero, with no GC pauses, but you must manually break retain cycles using weak or unowned references. So the classic Android leak is holding a reference (for example a static or long-lived object pointing at an Activity or Context) that keeps it reachable, while the classic iOS leak is a strong retain cycle (for example two objects, or a closure capturing self strongly).",
    "technicalDeep": "GC reclaims by reachability: starting from roots (stack, statics, active references) it marks everything reachable and collects the rest, so an object leaks precisely when something still reachable points to it even though logically it is dead. This is why long-lived references to short-lived objects — a static field holding a screen, a background task capturing a Context, an unremoved listener registered on a long-lived subject — are the canonical GC leaks: they keep dead objects reachable. ARC reclaims by count: each strong reference increments the count and each release decrements it, freeing at zero; a retain cycle is when a chain of strong references loops back on itself so no count ever reaches zero. The fix is to make one link in the cycle non-owning (weak/unowned) so it does not contribute to the count. Both runtimes also react to system memory pressure by asking apps to trim caches, and both will kill apps that fail to respond — so bounded caches and prompt release under warnings are essential regardless of the reclamation model.\n\nAndroid vs iOS callout: On Android the leak-hunting tools are the heap profiler and libraries like LeakCanary that detect retained Activities/Fragments; common culprits are static references to Context, non-static inner classes / anonymous listeners holding the outer screen, and handlers or coroutines outliving the screen. On iOS the tools are Instruments (Leaks/Allocations) and the memory graph debugger; the common culprit is a closure capturing self strongly, fixed with a weak self capture list, or a delegate reference that should be weak. Different failure modes — reachability leaks versus retain cycles — but the same outcome and the same discipline of scoping references to lifecycles.",
    "whatBreaks": "The slow-motion break is the leak that grows over a session: each time the user opens and closes a screen, a leaked reference keeps the old screen (and everything it holds — views, bitmaps, data) alive, so memory climbs until the app hits warnings and is killed in the background, losing state, or crashes with an out-of-memory error outright. On Android, a static reference to an Activity or a background task capturing a Context is the classic culprit; on iOS, a closure capturing self or a strong delegate creates a retain cycle that never frees. Ignoring low-memory warnings is another break: an app that holds an unbounded image cache and does not trim it on warning is a prime kill target. GC-specific: allocating churn in a tight loop (creating many short-lived objects) triggers frequent collections and jank; ARC-specific: forgetting a weak reference silently leaks with no error until memory runs out.",
    "efficientWay": {
      "title": "Managing Memory and Preventing Leaks",
      "approaches": [
        {
          "name": "Scope references to lifecycles, use weak references to break cycles, bound caches, and release on memory warnings",
          "verdict": "best",
          "reason": "Directly addresses both leak types — reachability leaks and retain cycles — and keeps the app lean enough to survive memory pressure and background kills."
        },
        {
          "name": "Rely entirely on GC or ARC to handle memory automatically",
          "verdict": "weak",
          "reason": "Automatic reclamation does not fix leaks: GC cannot collect still-reachable dead objects and ARC cannot break retain cycles, so both leak without deliberate care."
        },
        {
          "name": "Cache aggressively and keep large objects around to avoid re-loading",
          "verdict": "weak",
          "reason": "Unbounded caches and retained large objects inflate memory, making the app the first thing the OS kills under pressure and risking out-of-memory crashes."
        }
      ],
      "recommendation": "Tie the lifetime of every reference to a lifecycle: unregister listeners, cancel tasks, and drop references when a screen goes away. Break retain cycles with weak/unowned references (especially in closures and delegates), keep caches bounded, and release memory promptly when the OS sends a low-memory warning. Profile with the platform leak tools regularly."
    },
    "commonMistakes": [
      "Holding a static or long-lived reference to a screen or Context on Android, keeping a dead screen reachable (a leak)",
      "Creating a retain cycle on iOS with a closure that captures self strongly or a strong delegate reference",
      "Keeping an unbounded image or data cache and ignoring low-memory warnings, becoming the first app killed",
      "Forgetting to unregister listeners or cancel background tasks when a screen is destroyed, leaking everything they hold"
    ],
    "seniorNotes": "Automatic memory management removes manual free() but not the responsibility to prevent leaks, and the two models fail differently: GC leaks are reachability leaks (something alive still points at something dead), while ARC leaks are retain cycles (a strong loop that never hits zero). Senior engineers internalize this asymmetry — on GC platforms they hunt long-lived references to short-lived objects (statics, Context captures, unremoved listeners), and on ARC platforms they reach for weak/unowned by reflex in closures and delegates. Across both, they scope every reference to a lifecycle, keep caches bounded, respond to low-memory warnings as a survival requirement, and profile with LeakCanary/heap tools or Instruments/memory-graph as part of normal development. Staying lean is not just performance — it is what keeps the app alive in the background.",
    "interviewQuestions": [
      "Compare garbage collection and automatic reference counting, including the failure mode unique to each.",
      "What is a memory leak under a GC system versus under ARC, and give a concrete example of each.",
      "Why does automatic memory management not free you from thinking about memory, and how do memory warnings fit in?"
    ],
    "interviewAnswers": [
      "Garbage collection tracks which objects are still reachable and periodically reclaims the unreachable ones automatically, so you rarely free anything by hand, but the collector runs in bursts that can briefly pause the app. Automatic reference counting keeps a count of references to each object and frees it the instant the count hits zero, giving deterministic freeing with no GC pauses. Their unique failure modes differ: GC can be tricked by a still-reachable reference to a logically dead object, and ARC cannot automatically break a retain cycle where two objects strongly reference each other so neither count reaches zero. Android uses GC; iOS uses ARC.",
      "Under GC, a leak is an object that is logically dead but still reachable, so the collector never reclaims it — for example an Android static field or a long-lived background task holding a reference to an Activity or Context, which keeps that whole screen alive after it should be gone. Under ARC, a leak is a retain cycle where strong references form a loop that never drops to zero — for example an iOS closure that captures self strongly, or two objects each holding a strong reference to the other. The GC fix is to drop the stray reference; the ARC fix is to make one link weak or unowned.",
      "Because neither model fixes leaks: GC cannot collect an object you are still (accidentally) referencing, and ARC cannot break a retain cycle on its own — both require you to scope references correctly. So you still hunt long-lived references to dead objects on GC and break cycles with weak references on ARC. Memory warnings fit on top of both: the OS asks every app to shed memory under pressure and kills the ones that do not comply first, so responding to low-memory warnings by trimming caches and releasing non-essential memory is a survival requirement independent of which reclamation model you are on."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Two leak models, two fixes (pseudocode)",
        "code": "// GC world (e.g. Android): a leak is a REACHABILITY leak.\nstatic var cached = null\nonScreenCreated(screen):\n    cached = screen        // BUG: static now keeps the screen alive\n                           // forever -> screen + its views/bitmaps leak\n// Fix: do not hold long-lived refs to short-lived objects;\n//      unregister listeners and cancel tasks on destroy.\n\n// ARC world (e.g. iOS): a leak is a RETAIN CYCLE.\nself.onTap = () => { self.doThing() }   // BUG: closure strongly\n                                        // captures self, self holds\n                                        // closure -> neither frees\n// Fix: capture weakly so the loop can break:\nself.onTap = weak(self) => { self?.doThing() }\n\n// Both worlds: respond to memory pressure or be killed first.\nonLowMemoryWarning():\n    imageCache.trim()\n    releaseNonEssential()"
      },
      {
        "lang": "swift",
        "label": "iOS: break a retain cycle with a weak self capture",
        "code": "final class FeedViewController: UIViewController {\n    var loader = DataLoader()\n\n    func start() {\n        // BAD: strong capture of self -> retain cycle, leaks\n        // loader.onDone = { self.render() }\n\n        // GOOD: weak capture breaks the cycle so ARC can free it\n        loader.onDone = { [weak self] in\n            self?.render()\n        }\n    }\n\n    override func didReceiveMemoryWarning() {\n        super.didReceiveMemoryWarning()\n        imageCache.removeAll()      // shed memory or risk a Jetsam kill\n    }\n}\n// On Android the mirror bug is a static/Context reference keeping\n// an Activity reachable; tools like LeakCanary catch it."
      }
    ],
    "resources": [
      {
        "label": "Android processes and app lifecycle (memory and kills)",
        "url": "https://developer.android.com/guide/components/activities/process-lifecycle",
        "kind": "docs"
      },
      {
        "label": "Android platform architecture (runtime and ART)",
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
