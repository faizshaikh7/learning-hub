import type { CurriculumTopic, FlashcardData } from '@/types'

/** Phase 0 — Mobile Foundations (orientation). Concept-first, but concrete about the real tools, files, and terms you meet in any mobile repo. */
export const MOBILE_TOOLCHAIN: CurriculumTopic[] = [
  {
    "id": "why-native-exists",
    "phase": 0,
    "phaseName": "Mobile Foundations",
    "orderIndex": 7,
    "estimatedMins": 30,
    "prerequisites": [
      "native-vs-crossplatform",
      "mobile-os-architecture"
    ],
    "title": "Why Native Exists (and When You Drop to It)",
    "eli5": "No matter how you build a phone app, deep down it always ends up as code the phone's own system understands — that is called native. The screen you see, the camera, the buttons, the newest phone features: all of them are native underneath. Tools like Flutter or React Native let you write once, but they are really just clever engines sitting on top of native, quietly talking to it for you. Sometimes those engines have not learned a brand-new phone trick yet, and then you have to write a little native code yourself.",
    "analogy": "Native is the bedrock a house is built on. You can put any kind of house on top — a prefab kit home (Flutter), a modular home wired to the local grid (React Native), or a custom-built one (pure native) — but every single one still rests on the same bedrock and connects to the same city water, power, and gas mains. When the city adds a brand-new utility line, the prefab catalog might not offer a hookup for it yet, so you dig down and connect to the mains yourself.",
    "explanation": "Every mobile app, without exception, ultimately runs as native platform code. The operating system only speaks native: the OS APIs, the UI toolkit that actually draws pixels, hardware access (camera, GPS, sensors, secure element), and every brand-new OS feature ship first and only as native interfaces. This is the floor that everything else stands on. Cross-platform frameworks do not replace native — they sit on top of it. Flutter is an engine that renders your UI onto a native surface (a native window/view the OS gives it) and reaches down to native APIs for hardware and system services. React Native runs your JavaScript but drives real native views and calls native modules underneath. So 'write once' never means 'no native' — it means the framework wrote the native glue for you. The reason native still matters to you directly is that frameworks lag: when the OS ships a new sensor API, a new platform SDK, or you need maximum performance the engine cannot squeeze out, you drop down and write a native module yourself. Understanding native is understanding the ground truth of the whole stack.\n\nOn Android you'll see native surfaces as Activities and Views (or Jetpack Compose) written in Kotlin/Java, and a cross-platform app is hosted inside a single native Activity that owns the rendering surface. On iOS you'll see native surfaces as UIViewControllers and UIViews (or SwiftUI) written in Swift/Objective-C, and the same cross-platform app is hosted inside a root view controller. In both cases the framework is a guest renting a native window.",
    "technicalDeep": "Concretely, 'drops to native' has a precise meaning per framework. A Flutter app is a native application whose single hosted view runs the Flutter engine; when you need something the framework does not expose, you write a platform channel that marshals a call from Dart across to native Kotlin/Swift code and back. A React Native app runs a JS engine and communicates with native through the bridge/JSI; a 'native module' is Kotlin/Swift code you register so JS can call it. Even a fully native app is 'dropping to native' by definition — it is calling the framework APIs directly with no engine in between. The root things you cannot get from the cross-platform layer are: brand-new OS APIs the framework has not wrapped yet, vendor or third-party SDKs shipped only as native libraries (payments, maps, ML kits), tight hardware integration (custom camera pipelines, Bluetooth profiles, secure enclave), and performance-critical paths where the bridge overhead or the engine's abstractions are too costly.\n\nOn Android you'll see the native drop-down as a platform channel handler in a Kotlin file (MainActivity or a plugin) using MethodChannel, or a ReactPackage exposing a native module. On iOS you'll see the equivalent in a Swift/Objective-C file implementing a FlutterMethodChannel handler or an RCTBridgeModule. The shape is identical: named method in, serialized arguments across, native result back.",
    "whatBreaks": "Teams break when they assume the cross-platform framework is a complete, sealed universe. They pick a framework, then discover the brand-new OS feature their product depends on has no plugin yet, and they have no one on the team who can write the native module — the project stalls. They assume 'write once' means they never need to open Android Studio or Xcode, then hit a native build error they cannot read. They wrap a performance-critical feature (video processing, real-time audio) in the framework's abstractions and ship something laggy because they never dropped to native where it mattered. The underlying mistake is forgetting that native is the floor: the framework can only expose what someone has already bridged.",
    "efficientWay": {
      "title": "Relating to Native as the Foundation",
      "approaches": [
        {
          "name": "Treat native as the floor: know that every app is native underneath and be ready to drop down for root things the framework has not wrapped",
          "verdict": "best",
          "reason": "Matches reality — frameworks are engines on top of native, and the ability to write a native module for new APIs, native SDKs, and performance is what unblocks real projects."
        },
        {
          "name": "Assume the cross-platform framework covers everything you will ever need",
          "verdict": "weak",
          "reason": "Frameworks always lag new OS features and cannot wrap every native SDK, so this assumption stalls projects the moment you need something not yet bridged."
        },
        {
          "name": "Write everything natively per platform to avoid ever depending on a framework",
          "verdict": "ok",
          "reason": "Gives maximum access and control, but doubles the work for the large majority of features that a cross-platform layer would have handled fine."
        }
      ],
      "recommendation": "Understand that native is the ground truth beneath every approach. Use a cross-platform framework for the bulk of your app, but keep the skill (or a teammate) to drop to native for new OS APIs, native-only SDKs, and performance-critical paths. Never assume the framework is a sealed box."
    },
    "commonMistakes": [
      "Believing a cross-platform framework means you never touch native code, then stalling on a feature it has not wrapped yet",
      "Not knowing that Flutter and React Native render onto a native surface and call native APIs underneath",
      "Wrapping a performance-critical or brand-new-OS-feature path in the framework instead of dropping to a native module",
      "Assuming a third-party SDK will 'just work' when it ships only as a native library with no plugin"
    ],
    "seniorNotes": "The senior mental model is that native is non-negotiable bedrock and cross-platform frameworks are convenience engines layered on it. That reframes the whole native-versus-cross-platform debate: the question is never 'native or not', because it is always native underneath — the question is how much of the native surface the framework can hide for you, and whether your product needs something below that line. Senior engineers keep at least a reading knowledge of both native platforms even on a cross-platform team, because the day you need a new OS API, a native-only SDK, or peak performance, someone has to write the platform channel or native module, and being blind to native turns a one-day task into a blocked sprint.",
    "interviewQuestions": [
      "Every mobile app is said to be native underneath — what does that actually mean for a Flutter or React Native app?",
      "When must you drop to native code even though you chose a cross-platform framework?",
      "What is a 'native module' or 'platform channel', and why does it exist?"
    ],
    "interviewAnswers": [
      "It means the operating system only executes native platform code, so whatever framework you use, the pixels are ultimately drawn on a native surface and the hardware and system services are reached through native APIs. A Flutter app is a native application hosting the Flutter engine, which renders onto a native view and calls down to native for hardware; a React Native app runs JavaScript that drives real native views and native modules. 'Write once' means the framework authored the native glue for you — it never means native is absent. Native is the floor everything stands on.",
      "You drop to native when the cross-platform layer cannot reach something: a brand-new OS API the framework has not wrapped yet, a vendor or third-party SDK shipped only as a native library, tight hardware integration like a custom camera or Bluetooth pipeline, or a performance-critical path where the engine's abstractions or bridge overhead are too costly. In those cases you write native Kotlin/Swift and expose it to your framework code. Frameworks always lag the platform, so dropping to native is how you stay unblocked.",
      "It is a small piece of native code you write and register so your cross-platform code can call it. In Flutter it is a platform channel (MethodChannel) that marshals a named call with serialized arguments from Dart to native Kotlin/Swift and returns a result; in React Native it is a native module exposed to JavaScript. It exists because the framework cannot pre-wrap every native capability — new OS APIs and native-only SDKs need a bridge, and the native module is that bridge you build when no plugin exists."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Native is the floor: how each app reaches it (pseudocode)",
        "code": "// The OS only speaks NATIVE. Everything else sits on top of it.\n//\n//   [ Pure native app ]  --> platform UI toolkit + OS APIs   (direct)\n//   [ Flutter app     ]  --> engine paints on a NATIVE surface,\n//                            platform channel --> native APIs\n//   [ React Native app]  --> JS drives REAL native views,\n//                            native module --> native APIs\n//\n// All three ultimately bottom out here:\n//   native UI toolkit | camera | GPS | sensors | new OS feature\n\n// Dropping to native for a 'root thing' the framework lacks:\nframeworkCode.call(\"readNewSensor\")     // Dart / JS side\n        |\n        v   (platform channel / native module boundary)\nnativeModule readNewSensor():           // Kotlin / Swift side\n    value = PlatformSensorApi.read()     // brand-new native OS API\n    return value                         // marshalled back up"
      },
      {
        "lang": "text",
        "label": "A Flutter platform channel handler on the native side (illustrative)",
        "code": "// Android side (Kotlin), inside MainActivity:\n//   the framework asked for something only native can give.\n\nMethodChannel(messenger, \"app/sensor\").setMethodCallHandler {\n    call, result ->\n    if (call.method == \"readNewSensor\") {\n        val v = PlatformSensorApi.read()   // native-only OS API\n        result.success(v)\n    } else {\n        result.notImplemented()\n    }\n}\n\n// iOS side (Swift) mirrors this with FlutterMethodChannel and\n// the same method name -- identical shape, different language."
      }
    ],
    "resources": [
      {
        "label": "Android platform architecture overview",
        "url": "https://developer.android.com/guide/platform",
        "kind": "docs"
      },
      {
        "label": "Xcode overview",
        "url": "https://developer.apple.com/xcode/",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "mobile-toolchain",
    "phase": 0,
    "phaseName": "Mobile Foundations",
    "orderIndex": 8,
    "estimatedMins": 32,
    "prerequisites": [
      "why-native-exists"
    ],
    "title": "The Mobile Toolchain: SDKs, IDEs & Emulators",
    "eli5": "To build a phone app you install a toolbox. First is the SDK, a big bundle of the platform's ready-made building blocks and the programs that turn your code into an app. Then an IDE, the main app you actually work in, which has your text editor, a build button, a debugger to pause and inspect your app, and a manager to spin up fake phones. A fake phone on your screen is an emulator or simulator; a real phone plugged in over USB is even better. And a helper called ADB lets you talk to that phone — install the app, read its log messages. Tools like flutter and react-native are shortcuts you type in the terminal that drive all of this for you.",
    "analogy": "Setting up to build an app is like setting up a woodworking workshop. The SDK is the crate of standard lumber and pre-made joints plus the power tools. The IDE is the workbench with all your tools mounted within arm's reach — the saw (editor), the clamp-and-cut jig (build), the magnifying inspection lamp (debugger), the scale that weighs your effort (profiler), and the rack of test pieces (device manager). The emulator is a foam mock-up you shape quickly on the bench; the real device is the actual hardwood you must eventually test on because foam behaves differently. ADB is the intercom to the workshop next door where the real piece sits.",
    "explanation": "The mobile toolchain is the concrete set of programs you install and open every day. At its base is the platform SDK (Software Development Kit): the libraries, headers, build tools, and command-line utilities for a platform, plus the API levels you compile against. Alongside it may be an NDK (Native Development Kit) for writing parts of the app in C/C++ for performance or to use native libraries. On top of the SDK sits the IDE (Integrated Development Environment) — the single application where you actually work. A mobile IDE bundles a code editor, the build system integration (a button that compiles and packages your app), a debugger (set breakpoints, step through code, inspect variables), a profiler (measure CPU, memory, network, battery), and a device manager (create and launch virtual devices). To run your app you need a device: an emulator/simulator is a virtual phone running on your computer — fast to launch and great for quick iteration — while a real physical device is slower to set up but the only place performance, sensors, and real-world behavior are truthful. Tying it together is a device bridge: ADB (Android Debug Bridge) is the command-line tool that installs your app onto a device, streams its log output, opens a shell, and forwards ports. Cross-platform CLIs like flutter and react-native sit on top of all of this: when you run them they invoke the underlying SDKs, build tools, and device bridge for you.\n\nOn Android you'll see Android Studio as the IDE, the Android SDK (and optional NDK), the Android Emulator managed by the AVD (Android Virtual Device) Manager, and adb for device communication and logcat for logs. On iOS you'll see Xcode as the IDE, the iOS SDK, the iOS Simulator, and Instruments for profiling, with the device talking over Xcode's own tooling rather than ADB. Same roles, different names.",
    "technicalDeep": "Each tool maps to a concrete step in build-run-debug. The SDK provides the compiler targets and platform APIs; you pick a compile SDK version (the API level you build against) and a minimum SDK version (the oldest OS you support). The IDE orchestrates the build system (Gradle on Android, the Xcode build system on iOS) rather than replacing it — the same build can run from the command line, which is what CI uses. The emulator is a full system image running on a virtualized or hardware-accelerated CPU, so it can be nearly as fast as a device for UI work but cannot faithfully reproduce real GPS, camera, thermals, or cellular behavior; a real device connected over USB (or wireless debugging) is authoritative for those. ADB is a client-server tool: an adb client on your machine talks to an adb daemon (adbd) on the device through a server process, exposing commands like adb install, adb logcat (device logs), adb shell, and adb forward. Cross-platform CLIs are orchestrators: flutter run detects a connected device, invokes Gradle or the Xcode build, installs the artifact via the platform bridge, and attaches a debugger; react-native / the Expo or community CLI does the same over Metro plus the native build.\n\nOn Android you'll see logs via adb logcat and can list devices with adb devices; the emulator images come from the SDK Manager. On iOS you'll see logs and diagnostics through Xcode's console and Instruments, simulators are managed with simctl, and there is no ADB — Apple's own device tooling handles install and logging. The daily verbs (install, run, view logs, profile) are the same; the commands differ.",
    "whatBreaks": "Newcomers lose days to toolchain setup rather than code. They install the IDE but not the right SDK platform/API level and the build fails with a cryptic missing-SDK error. They develop only on the emulator and ship features that break on real hardware — GPS that never moves, a camera that returns a fake image, performance that looks fine virtualized but janks on a budget phone. They cannot see why the app crashes because they never learned to read device logs (logcat / the Xcode console), so they debug blind. On cross-platform teams they treat flutter or react-native as self-contained and are baffled when the underlying native SDK, emulator, or device bridge is missing or misconfigured, because the CLI is really just driving those tools. Version drift — SDK, IDE, and CLI expecting different versions of each other — is a constant source of broken builds.",
    "efficientWay": {
      "title": "Setting Up and Using the Toolchain",
      "approaches": [
        {
          "name": "Install the full native toolchain (SDK + IDE + device bridge), iterate fast on an emulator, and verify on a real device before shipping",
          "verdict": "best",
          "reason": "The emulator gives speed for UI work while the real device gives truth for sensors, performance, and behavior — using both matches how professionals actually build."
        },
        {
          "name": "Do everything on the emulator/simulator and skip real devices",
          "verdict": "weak",
          "reason": "Emulators cannot faithfully reproduce GPS, camera, thermals, cellular, or real performance, so you ship bugs that only appear on hardware."
        },
        {
          "name": "Rely only on the cross-platform CLI and never install or understand the underlying native SDKs",
          "verdict": "ok",
          "reason": "Works until a native build error, a missing SDK component, or a device-bridge issue appears — then you are stuck because the CLI is just orchestrating tools you never learned."
        }
      ],
      "recommendation": "Install the platform SDK, the IDE, and the device bridge, and learn to read device logs early — it is your primary debugging sense. Iterate on an emulator for speed, but always validate sensors, performance, and behavior on a real mid-range device before you ship. If you use a cross-platform CLI, know it is driving the native tools underneath."
    },
    "commonMistakes": [
      "Installing the IDE but not the matching SDK platform/API level, causing cryptic build failures",
      "Developing only on the emulator and shipping features that break on real hardware sensors and performance",
      "Never learning to read device logs (logcat or the Xcode console) and debugging crashes blind",
      "Treating flutter or react-native as self-contained and forgetting they drive the native SDK, emulator, and device bridge underneath"
    ],
    "seniorNotes": "Senior engineers treat the toolchain as infrastructure to be pinned and reproduced, not clicked through once. They lock SDK, build-tool, IDE, and CLI versions so every teammate and the CI machine build identically, because 'works on my machine' is almost always version drift in the toolchain. They lean on device logs and the profiler as first-class debugging senses rather than sprinkling print statements. And they know the emulator is a productivity tool, not a source of truth — anything involving sensors, GPU, thermals, or real network gets validated on physical hardware, ideally a representative low-to-mid-range device, because that is where the toolchain's virtualized comfort diverges from users' reality.",
    "interviewQuestions": [
      "What does a mobile IDE give you beyond a text editor, and how does it relate to the SDK and build system?",
      "When is an emulator/simulator the right tool, and when must you use a real device?",
      "What is ADB and what do you use it for day to day?"
    ],
    "interviewAnswers": [
      "The IDE bundles the tools you use around the code: a code editor, integration with the build system so a single action compiles and packages the app, a debugger for breakpoints and inspecting variables, a profiler for CPU, memory, network, and battery, and a device manager for creating and launching virtual devices. It does not replace the SDK or the build system — the SDK provides the platform libraries and API levels you compile against, and the IDE orchestrates the underlying build tool (Gradle on Android, the Xcode build system on iOS), which is why the same build can also run headless in CI. It is Android Studio on Android and Xcode on iOS.",
      "An emulator or simulator is a virtual phone on your computer — fast to launch and iterate on, ideal for UI work, layout, and quick logic checks. But it cannot faithfully reproduce real GPS movement, the camera, thermal throttling, cellular behavior, or true performance, so anything that depends on those must be validated on a real physical device. The professional pattern is to iterate on the emulator for speed and then verify on a real, ideally mid-range, device before shipping, because that hardware is where performance and sensor bugs actually surface.",
      "ADB, the Android Debug Bridge, is the command-line tool that lets your computer talk to an Android device or emulator. It is a client-server tool: commands go through an adb server to a daemon on the device. Day to day I use adb install to push a build, adb logcat to stream the device's log output while debugging, adb devices to confirm a device is connected, adb shell to open a shell on the device, and adb forward for port forwarding. It is my primary channel for installing, inspecting, and reading logs from a device; iOS achieves the same through Xcode's own device tooling rather than ADB."
    ],
    "codeExamples": [
      {
        "lang": "bash",
        "label": "Everyday ADB commands you will actually type (Android)",
        "code": "# List every attached device and emulator\nadb devices\n\n# Install a built app onto the connected device\nadb install app/build/outputs/apk/debug/app-debug.apk\n\n# Stream the device's live logs, filtered to your app's tag\nadb logcat -s MyAppTag\n\n# Open a shell on the device itself\nadb shell\n\n# iOS has no adb: you install and read logs through Xcode\n# and manage simulators with 'xcrun simctl list' instead."
      },
      {
        "lang": "bash",
        "label": "A cross-platform CLI drives the native tools for you",
        "code": "# 'flutter run' is an ORCHESTRATOR, not a separate runtime:\n#   1. finds a connected device or emulator\n#   2. invokes Gradle (Android) or the Xcode build (iOS)\n#   3. installs the artifact via the platform device bridge\n#   4. attaches a debugger and streams logs\nflutter devices        # what it can deploy to\nflutter run            # build + install + run on a device\n\n# React Native mirrors this:\nnpx react-native run-android   # drives the Android SDK + Gradle\nnpx react-native run-ios       # drives Xcode + the iOS SDK"
      }
    ],
    "resources": [
      {
        "label": "Android Studio",
        "url": "https://developer.android.com/studio",
        "kind": "docs"
      },
      {
        "label": "Android Debug Bridge (adb)",
        "url": "https://developer.android.com/tools/adb",
        "kind": "docs"
      },
      {
        "label": "Xcode",
        "url": "https://developer.apple.com/xcode/",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "project-anatomy",
    "phase": 0,
    "phaseName": "Mobile Foundations",
    "orderIndex": 9,
    "estimatedMins": 34,
    "prerequisites": [
      "mobile-toolchain"
    ],
    "title": "Anatomy of a Mobile Project (What You'll See)",
    "eli5": "When you open a real phone-app project, it looks like a pile of unfamiliar files and folders. Most of them fall into a few groups. Some are configuration files written in a tag-based format called XML — plain text where information is wrapped in labels like a name-tag on everything. One special config file, the manifest, is the app's ID card: it announces the app's name, its icon, what permissions it needs, and where it starts. Another group is resources: your text, images, and icons kept in their own folders so they are separate from the code. Then there is the actual source code, the build files that describe how to assemble the app, and a couple of housekeeping files that tell tools what to ignore or which exact versions to use.",
    "analogy": "A mobile project is like a film production kit. The manifest is the movie's registration papers — title, rating, who is allowed in, which scene plays first. The XML config and layout files are the labeled scene cards and set blueprints, everything tagged so any crew member can read it. The resource folders are the prop and wardrobe departments — images, text, and icons stored by department and by size, pulled in by reference rather than glued into the script. The source folders are the screenplay (the actual acting logic). The build files are the shooting schedule that says how to assemble it all into a finished film. And .gitignore plus the lockfile are the 'do not ship these' bin and the exact-parts manifest.",
    "explanation": "Opening a real repo stops being intimidating once you can name the categories of files. First, XML: XML (eXtensible Markup Language) is a plain-text, tag-based markup format for structured data. Everything is wrapped in opening and closing tags, tags can nest, and tags carry attributes — it looks like HTML's stricter cousin. If you have never seen it, read it as a labeled outline: each piece of information sits inside a tag that names what it is. Mobile platforms use XML heavily for configuration and sometimes for UI layouts, precisely because it is human-readable structured text rather than code. Second, the manifest (or its property-list equivalent): a declaration file that tells the OS the essential facts about your app — its unique application id, the permissions it requests, its entry points (which screen launches first), its icon, and supported versions. It declares; it does not do. Third, resources: externalized assets — strings, images, colors, icons — kept in dedicated folders separate from code, so they can vary by language, screen density, and device without touching logic. The build often generates a reference index (a table of ids) so code can refer to a resource by a stable handle rather than a file path. Fourth, source folders holding the actual code; build files describing how to compile and package; a .gitignore listing files that should never be committed (build outputs, secrets, local settings); and a lockfile pinning the exact versions of every dependency. The deep distinction running through all of this is declarative config (files that describe what the app is) versus imperative code (files that describe what the app does).\n\nOn Android you'll see AndroidManifest.xml (the manifest), a res/ folder with subfolders like values/ for strings and colors and mipmap/drawable for icons and images, XML layout files under res/layout/, and build.gradle files. On iOS you'll see Info.plist (a property list declaring the same kind of facts), Assets.xcassets for images and icons, and the project described by an .xcodeproj or .xcworkspace bundle. Different filenames, same four categories: manifest, resources, source, build.",
    "technicalDeep": "Each category has concrete mechanics. XML documents have exactly one root element, elements nest to form a tree, and attributes are key-value pairs on a tag; the same tree could be expressed as JSON, but the platforms standardized on XML for config and legacy layouts. The manifest is parsed by the OS and the store before your code ever runs: it is how the system knows what permissions to prompt for, which component is the launcher entry point, and what the app id and version are — this is why an unregistered screen or a missing permission declaration fails even though your code is correct. Resource externalization powers localization and adaptation: the system picks the right resource variant at runtime based on qualifiers (language, screen density, orientation), so res/values-es/ supplies Spanish strings and a high-density bucket supplies a sharper icon, all selected automatically. The generated reference (the R class on Android) turns each resource into a compile-time id, so a typo in a resource name is a build error rather than a runtime crash. Build files are themselves partly declarative (dependencies, versions, app id) and partly imperative (custom tasks), and the lockfile guarantees that everyone resolves the identical dependency graph.\n\nOn Android you'll see the manifest declare a launcher activity with an intent filter, resources compiled and indexed into the generated R class (R.string.app_name, R.drawable.icon), and density buckets like drawable-hdpi/xxhdpi. On iOS you'll see Info.plist keys such as CFBundleIdentifier and permission-purpose strings like NSCameraUsageDescription, and asset catalogs (Assets.xcassets) providing @1x/@2x/@3x image scales that the system resolves per device. The concept — declare facts in config, externalize and auto-select resources — is identical across both.",
    "whatBreaks": "Not recognizing the file categories causes confusing, code-is-fine-but-app-is-broken failures. A developer adds a new screen but forgets to declare it in the manifest, and the app crashes at launch even though the code compiles. They request the camera in code but never declare the permission in the manifest/plist, so the OS silently refuses. They hardcode text and image paths directly in code instead of using resources, then cannot localize or support multiple screen densities without rewriting logic. They edit a generated reference file (the R index) by hand and it gets regenerated, wiping their change. They commit build outputs or secret files because they never set up .gitignore, bloating the repo and leaking credentials. And they confuse declarative config with imperative code — trying to put logic in a manifest or expecting a config file to run.",
    "efficientWay": {
      "title": "Reading an Unfamiliar Mobile Repo",
      "approaches": [
        {
          "name": "Sort every file into four buckets — manifest/config, resources, source, build — and learn what each declares before touching code",
          "verdict": "best",
          "reason": "The categories are stable across platforms and frameworks, so classifying files first turns an intimidating repo into a small number of known roles you can navigate."
        },
        {
          "name": "Ignore the config and resource files and only read the source code",
          "verdict": "weak",
          "reason": "The manifest, permissions, entry points, and resources define how the app actually launches and behaves, so skipping them hides the causes of the most common launch and permission bugs."
        },
        {
          "name": "Memorize one platform's exact filenames and assume the other platform matches",
          "verdict": "ok",
          "reason": "The categories transfer, but the specific files differ (AndroidManifest.xml versus Info.plist, res/ versus Assets.xcassets), so exact-name assumptions cause mistakes on the other platform."
        }
      ],
      "recommendation": "When you open any mobile repo, first classify files into manifest/config, resources, source, and build, and read what the manifest declares — app id, permissions, entry point, icon. Keep text and images in resources, never edit generated reference files by hand, and make sure .gitignore excludes build outputs and secrets. Recognize the categories and nothing is a mystery."
    },
    "commonMistakes": [
      "Adding a new screen or component in code but forgetting to declare it in the manifest, causing a launch crash",
      "Requesting a capability in code without declaring the matching permission in the manifest or Info.plist",
      "Hardcoding strings and image paths in code instead of using externalized resources, blocking localization and density support",
      "Hand-editing generated reference files (the R index) or committing build outputs and secrets because .gitignore was not set up"
    ],
    "seniorNotes": "Senior engineers read a repo by its structure before its logic, because the manifest and resource layout reveal what an app is faster than the source does — the declared permissions hint at what it accesses, the entry points show its surface area, and the resource qualifiers reveal which languages and form factors it supports. They guard the declarative/imperative boundary carefully: config files declare facts the OS and build read before code runs, so a correct code change with a missing manifest declaration is still a broken app. They treat generated reference files as build outputs (never hand-edited, always gitignored), keep every user-facing string and image in resources from day one so localization and density support come for free, and are strict about .gitignore and lockfiles so builds are reproducible and secrets never leak.",
    "interviewQuestions": [
      "What is XML, and where does it show up in a mobile project?",
      "What does the app manifest declare, and why can a correct code change still break the app if the manifest is wrong?",
      "Why are strings and images kept as externalized resources instead of hardcoded in the source?"
    ],
    "interviewAnswers": [
      "XML, eXtensible Markup Language, is a plain-text, tag-based markup format for structured data: information is wrapped in named, nestable tags that can carry attributes, forming a tree with a single root — think of it as a strict, labeled outline, HTML's stricter cousin. Mobile platforms use it heavily because it is human-readable structured text rather than code. In an Android project you see it as AndroidManifest.xml, as XML layout files under res/layout, and as resource files like strings.xml and colors.xml under res/values. iOS uses a related plist format for its Info.plist. It is the standard format for declarative configuration and legacy UI layouts.",
      "The manifest declares the essential facts the OS and app store need before your code runs: the unique application id, the permissions the app requests, its entry points (which screen launches first), its icon, and supported versions. It declares rather than executes. A correct code change can still break the app because the system reads the manifest first — if you add a new screen but do not register it, or call a sensitive API without declaring its permission, the OS refuses or crashes at launch even though the code compiles perfectly. The declaration is a required part of the app, not documentation. iOS carries the same facts in Info.plist.",
      "Because externalizing them separates content from logic and lets the system adapt automatically. Strings kept in resource files can be translated per language, and images kept in density-specific folders let the system pick the sharpest version for each screen, all without touching code. The build also generates a stable id for each resource, so code refers to a resource by a compile-checked handle instead of a fragile file path, turning typos into build errors. Hardcoding text and paths in source blocks localization and multi-density support and forces a code rewrite for what should be a resource swap. Android uses res/ and the R index; iOS uses asset catalogs and plist strings for the same purpose."
    ],
    "codeExamples": [
      {
        "lang": "xml",
        "label": "A tiny AndroidManifest.xml — what the app DECLARES",
        "code": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\"\n          package=\"com.example.myapp\">\n\n    <!-- DECLARE a permission the OS must grant at runtime -->\n    <uses-permission android:name=\"android.permission.CAMERA\" />\n\n    <application android:icon=\"@mipmap/ic_launcher\"\n                 android:label=\"@string/app_name\">\n\n        <!-- The ENTRY POINT: the screen launched first -->\n        <activity android:name=\".MainActivity\">\n            <intent-filter>\n                <action android:name=\"android.intent.action.MAIN\" />\n                <category android:name=\"android.intent.category.LAUNCHER\" />\n            </intent-filter>\n        </activity>\n\n    </application>\n</manifest>\n<!-- Note @string/app_name and @mipmap/ic_launcher: the manifest\n     REFERENCES externalized resources instead of hardcoding them. -->"
      },
      {
        "lang": "xml",
        "label": "An externalized string resource (res/values/strings.xml)",
        "code": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<resources>\n    <!-- One place to change text; translate by adding\n         res/values-es/strings.xml for Spanish, etc. -->\n    <string name=\"app_name\">My App</string>\n    <string name=\"welcome\">Welcome back</string>\n</resources>\n<!-- Code refers to these by a generated id: R.string.welcome.\n     On iOS the parallel is Localizable.strings + Assets.xcassets. -->"
      }
    ],
    "resources": [
      {
        "label": "Android app manifest overview",
        "url": "https://developer.android.com/guide/topics/manifest/manifest-intro",
        "kind": "docs"
      },
      {
        "label": "Android app resources overview",
        "url": "https://developer.android.com/guide/topics/resources/providing-resources",
        "kind": "docs"
      },
      {
        "label": "Information Property List (iOS Info.plist)",
        "url": "https://developer.apple.com/documentation/bundleresources/information_property_list",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "build-tools-deps",
    "phase": 0,
    "phaseName": "Mobile Foundations",
    "orderIndex": 10,
    "estimatedMins": 34,
    "prerequisites": [
      "project-anatomy"
    ],
    "title": "Build Tools & Dependency Managers: Gradle, CocoaPods, SPM",
    "eli5": "Your app is not one file — it is your code, plus a bunch of outside libraries other people wrote, plus your images and text. A build system is the robot that assembles all of that into one installable app. On Android that robot is called Gradle: it reads a recipe file, downloads the libraries you asked for, compiles your code, merges in your resources, and packages the final app. Other platforms have their own robots — CocoaPods and Swift Package Manager on iPhone, npm for React Native, pub for Flutter — but they all do the same job: fetch the parts and put the app together. A 'dependency' is just a library you depend on, a 'lockfile' remembers the exact versions so everyone gets the same parts, and a 'repository' is the online warehouse the parts are downloaded from.",
    "analogy": "A build system is an automated factory line. Raw materials arrive at one end — your source code, third-party parts ordered from suppliers (dependencies), and your labels and packaging (resources). The factory's instruction sheet (the build script) tells the line what to order, which machines to run, and in what order. The line fetches the ordered parts from warehouses (repositories like Maven Central), machines your code, snaps in the parts, applies the labels, and boxes up a finished, shippable product (the installable app). The parts list with exact serial numbers is the lockfile, so every factory that runs the same instruction sheet builds an identical product.",
    "explanation": "A build system is the tool that turns a folder of source code, dependencies, and resources into a single installable app, automatically and repeatably. You could compile and package by hand, but on a real project with dozens of libraries and multiple build flavors, you need automation — that is what a build system provides. On Android that build system is Gradle. Gradle reads your build.gradle files (the build script), and from them it resolves and downloads the dependencies you declared, compiles your Kotlin/Java code, merges and processes your resources, and packages everything into an installable APK or AAB (Android App Bundle). It also defines build variants — for example a debug build and a release build, or free and paid flavors — from the same source. Around the build system sits a dependency manager, which is the part that handles libraries: a dependency (or package) is a library your app relies on, declared by name and version; a repository (like Maven Central) is the online warehouse those libraries are downloaded from; and a lockfile records the exact resolved versions so every machine builds with an identical set of parts. 'Adding a library' really means: write one line declaring the dependency and its version, let the tool resolve it (and everything it in turn depends on — its transitive dependencies) from a repository, download and cache it, and link it into your build. The parallel tools per ecosystem do the same job under different names.\n\nOn Android you'll see Gradle with build.gradle (or build.gradle.kts) files, dependencies pulled from Maven Central and Google's Maven repository. On iOS you'll see CocoaPods (a Podfile listing pods, resolved into a Podfile.lock) or Swift Package Manager (SPM, integrated into Xcode, pinning versions in Package.resolved). For cross-platform you'll see npm or yarn for React Native (package.json plus a lockfile, pulling from the npm registry) and pub for Flutter (pubspec.yaml plus pubspec.lock, pulling from pub.dev). Every one of them declares dependencies, resolves them from a repository, records a lockfile, and feeds the build. This topic is the orientation to these tools; a later topic covers signing and release in depth.",
    "technicalDeep": "The build is a pipeline of well-defined steps, and the build system runs them as tasks in dependency order: resolve dependencies, compile source to bytecode or machine code, process and merge resources, and package plus (for release) shrink, optimize, and sign. Dependency resolution is the subtle part: you declare direct dependencies with version constraints, the resolver walks the transitive graph of everything those libraries themselves need, reconciles version conflicts to a single chosen version per library, and writes the outcome to a lockfile so the resolution is frozen and reproducible. Repositories are keyed by coordinates — on Maven a dependency is group:artifact:version — and the tool downloads and caches artifacts locally so it does not re-fetch every build. Gradle specifically models the build as a task graph and caches task outputs, so an incremental build only reruns what changed, which is why the first build is slow and later ones are fast. Build variants come from combining build types (debug/release) with product flavors, each able to override dependencies, resources, and config.\n\nOn Android you'll see a dependency line like implementation 'com.squareup.retrofit2:retrofit:2.9.0' in build.gradle and the resolved graph reflected in the build. On iOS with CocoaPods you'll see pod 'Alamofire', '~> 5.0' in a Podfile with the exact version frozen in Podfile.lock, while SPM pins versions in Package.resolved. React Native's package.json plus package-lock.json/yarn.lock and Flutter's pubspec.yaml plus pubspec.lock encode the identical declare-resolve-lock pattern. The vocabulary differs; the resolve-compile-merge-package-lock pipeline is universal.",
    "whatBreaks": "Misunderstanding the build system produces the classic 'works on my machine' failures. Someone adds a dependency but does not commit the lockfile, so another developer resolves different transitive versions and gets a build that behaves differently or breaks. Two libraries demand incompatible versions of a shared dependency and the build fails with a conflict the developer does not know how to reconcile. People commit the downloaded dependency cache or build outputs into the repo instead of gitignoring them, bloating it enormously. They expect the first build to be fast and panic when it takes minutes, not realizing later incremental builds are quick. They edit generated build artifacts by hand. And on cross-platform projects they forget that adding a native dependency may require running the native dependency manager (Gradle sync, pod install) in addition to the JavaScript or Dart package step, leaving the native side unlinked.",
    "efficientWay": {
      "title": "Working With Build Tools and Dependencies",
      "approaches": [
        {
          "name": "Declare dependencies with explicit versions, commit the lockfile, and let the build system resolve, cache, and package",
          "verdict": "best",
          "reason": "Committing the lockfile makes every machine build the identical dependency graph, and letting the tool handle resolution and packaging is exactly what it is built to do reproducibly."
        },
        {
          "name": "Add dependencies freely without pinning versions or committing the lockfile",
          "verdict": "weak",
          "reason": "Unpinned versions and a missing lockfile let different machines resolve different transitive versions, producing 'works on my machine' bugs and non-reproducible builds."
        },
        {
          "name": "Vendor libraries by copying their source into your repo instead of using a dependency manager",
          "verdict": "ok",
          "reason": "Gives full control and offline builds, but you lose automatic transitive resolution and updates and must maintain every copied library by hand, which does not scale."
        }
      ],
      "recommendation": "Let the build system do its job: declare each dependency with an explicit version, always commit the lockfile so builds are reproducible, and gitignore the dependency cache and build outputs. Understand that the first build is slow because it resolves and downloads, while later incremental builds are fast. On cross-platform projects, remember a native dependency may need the native manager to run too."
    },
    "commonMistakes": [
      "Not committing the lockfile, so other machines resolve different transitive versions and builds diverge",
      "Hitting a version conflict between two libraries and not knowing it must be reconciled to one resolved version",
      "Committing the downloaded dependency cache or build outputs into the repo instead of gitignoring them",
      "On cross-platform projects, adding a JS or Dart package but forgetting to run the native manager (Gradle sync, pod install) so the native side stays unlinked"
    ],
    "seniorNotes": "Senior engineers treat the build and its dependency graph as a reliability and security surface, not a black box. They pin versions and commit lockfiles religiously so builds are byte-for-byte reproducible across developers and CI, because non-reproducible builds are a debugging nightmare. They watch the transitive dependency graph — every library you pull drags in its own dependencies, expanding attack surface, app size, and conflict risk — and they prune aggressively. They understand their build system's caching and task model well enough to keep builds fast (incremental builds, avoiding cache-busting changes) since build time is a daily productivity tax. And they know each ecosystem's tool is interchangeable in concept — Gradle, CocoaPods, SPM, npm, pub all declare, resolve, lock, and package — so learning one deeply makes the rest legible.",
    "interviewQuestions": [
      "What is a build system, and what does Gradle do specifically on Android?",
      "What is a dependency manager, and what actually happens when you 'add a library'?",
      "Why does a lockfile matter, and what goes wrong without one?"
    ],
    "interviewAnswers": [
      "A build system is the tool that turns source code, dependencies, and resources into a single installable app automatically and repeatably, running the compile-and-package steps so you do not do them by hand. On Android that build system is Gradle. Gradle reads your build.gradle scripts and from them resolves and downloads the dependencies you declared, compiles your Kotlin/Java code, merges and processes your resources, and packages the result into an installable APK or AAB. It also defines build variants like debug and release, or free and paid flavors, from the same source, and it models the work as a cached task graph so incremental builds are fast. iOS uses the Xcode build system for the same role.",
      "A dependency manager is the part of the toolchain that handles external libraries: a dependency, or package, is a library your app relies on, declared by name and version. When you 'add a library' you write one declaration line with the version, and the tool resolves it — it walks the transitive graph of everything that library itself depends on, reconciles version conflicts to one chosen version each, downloads the artifacts from a repository like Maven Central, caches them locally, records the exact resolved versions in a lockfile, and links them into your build. So one declared line can pull in many transitive libraries. Gradle does this on Android; CocoaPods and SPM on iOS; npm and pub for cross-platform.",
      "A lockfile records the exact resolved version of every dependency, including transitive ones, so the whole graph is frozen. It matters because version declarations often allow ranges, and without a lockfile two machines can resolve different transitive versions at different times, producing the classic 'works on my machine' bug where builds behave differently or break for one developer and not another. Committing the lockfile guarantees every developer and the CI machine build the identical set of parts, making builds reproducible. Without one you lose reproducibility, and subtle version drift becomes extremely hard to debug. Every ecosystem has its lockfile: Gradle's, Podfile.lock, Package.resolved, package-lock.json, pubspec.lock."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "What Gradle does: source + deps + resources -> installable app",
        "code": "// A build system runs the pipeline as an ordered task graph:\n//\n//   build.gradle (the recipe)\n//        |\n//   1. RESOLVE  declared deps -> walk transitive graph\n//               -> download from repos (Maven Central, Google)\n//               -> freeze exact versions in a lockfile\n//   2. COMPILE  Kotlin/Java source -> bytecode\n//   3. MERGE    process + merge resources (res/, manifest)\n//   4. PACKAGE  bundle everything -> APK / AAB (installable)\n//               (release also shrinks, optimizes, and signs)\n//\n// First build is slow (resolve + download + full compile);\n// later builds are fast (cached tasks, incremental compile).\n//\n// iOS parallel: CocoaPods/SPM resolve pods, the Xcode build\n// system compiles + packages an .ipa. Same shape, other names."
      },
      {
        "lang": "text",
        "label": "The same declare-resolve-lock idea across every ecosystem",
        "code": "// ANDROID (Gradle) - build.gradle\nimplementation 'com.squareup.retrofit2:retrofit:2.9.0'\n//   group:artifact:version  -> resolved from Maven Central\n\n// iOS (CocoaPods) - Podfile           lock: Podfile.lock\npod 'Alamofire', '~> 5.0'\n\n// iOS (Swift Package Manager)          lock: Package.resolved\n//   add package URL + version rule in Xcode\n\n// REACT NATIVE (npm) - package.json    lock: package-lock.json\n//   \"axios\": \"^1.6.0\"   -> resolved from the npm registry\n\n// FLUTTER (pub) - pubspec.yaml         lock: pubspec.lock\n//   http: ^1.2.0        -> resolved from pub.dev\n//\n// Every one: DECLARE a dependency + version, RESOLVE it (with\n// transitives) from a REPOSITORY, freeze it in a LOCKFILE,\n// feed it to the build. Learn one, read them all."
      }
    ],
    "resources": [
      {
        "label": "Configure your build (Gradle on Android)",
        "url": "https://developer.android.com/build",
        "kind": "docs"
      },
      {
        "label": "Gradle build tool",
        "url": "https://gradle.org/",
        "kind": "docs"
      },
      {
        "label": "Swift Package Manager",
        "url": "https://www.swift.org/documentation/package-manager/",
        "kind": "docs"
      },
      {
        "label": "CocoaPods",
        "url": "https://cocoapods.org/",
        "kind": "docs"
      }
    ]
  }
]

/** Flashcard decks for the orientation topics, keyed by topic id. */
export const MOBILE_TOOLCHAIN_FLASHCARDS: FlashcardData = {
  "why-native-exists": [
    {
      "id": "mbfc_native_1",
      "q": "What does it mean that every mobile app is 'native underneath'?",
      "a": "The operating system only executes native platform code, so no matter what framework you use, the UI is ultimately drawn on a native surface and hardware and system services are reached through native APIs. Cross-platform frameworks are engines layered on top of native, not replacements for it.",
      "hint": "The OS only speaks one language."
    },
    {
      "id": "mbfc_native_2",
      "q": "How do Flutter and React Native relate to native code at runtime?",
      "a": "Flutter is an engine that renders your UI onto a native surface and calls native APIs for hardware and system services. React Native runs JavaScript that drives real native views and calls native modules. Both sit on top of native and wrote the native glue for you.",
      "hint": "One paints on a native window; the other puppeteers native views."
    },
    {
      "id": "mbfc_native_3",
      "q": "When must you drop to native code even on a cross-platform project?",
      "a": "When the framework has not wrapped something yet: a brand-new OS API, a vendor or third-party SDK shipped only as a native library, tight hardware integration (custom camera, Bluetooth), or a performance-critical path the engine cannot handle. You write native Kotlin/Swift and expose it to your framework code.",
      "hint": "Frameworks always lag the platform."
    },
    {
      "id": "mbfc_native_4",
      "q": "What is a native module (or platform channel)?",
      "a": "A small piece of native Kotlin/Swift code you write and register so your cross-platform code can call it. Flutter uses a platform channel (MethodChannel) to marshal a named call from Dart to native and back; React Native calls it a native module. It exists because the framework cannot pre-wrap every native capability.",
      "hint": "A bridge you build when no plugin exists."
    }
  ],
  "mobile-toolchain": [
    {
      "id": "mbfc_toolchain_1",
      "q": "What does a mobile IDE give you beyond a text editor?",
      "a": "A code editor plus build-system integration (one action compiles and packages the app), a debugger (breakpoints, stepping, variable inspection), a profiler (CPU, memory, network, battery), and a device manager for creating and launching virtual devices. It is Android Studio on Android and Xcode on iOS.",
      "hint": "Editor + build + debug + profile + devices in one app."
    },
    {
      "id": "mbfc_toolchain_2",
      "q": "Emulator/simulator versus a real device: when do you use each?",
      "a": "An emulator/simulator is a virtual phone on your computer — fast to launch, great for UI and quick iteration. A real device is authoritative for GPS, camera, thermals, cellular, and true performance, which emulators cannot faithfully reproduce. Iterate on the emulator, then verify on real hardware before shipping.",
      "hint": "Speed on virtual, truth on hardware."
    },
    {
      "id": "mbfc_toolchain_3",
      "q": "What is ADB and what do you use it for?",
      "a": "ADB (Android Debug Bridge) is the command-line tool that lets your computer talk to an Android device or emulator. You use adb install to push a build, adb logcat to stream device logs, adb devices to confirm a connection, and adb shell to open a shell. iOS does the same through Xcode's own tooling instead of ADB.",
      "hint": "Install, read logs, shell into the device."
    },
    {
      "id": "mbfc_toolchain_4",
      "q": "What is the platform SDK (and NDK) for?",
      "a": "The SDK (Software Development Kit) provides the platform libraries, API levels you compile against, build tools, and command-line utilities. The NDK (Native Development Kit) lets you write parts of the app in C/C++ for performance or to use native libraries. You pick a compile SDK version and a minimum SDK version.",
      "hint": "The building blocks and API levels you build against."
    },
    {
      "id": "mbfc_toolchain_5",
      "q": "What does a cross-platform CLI like 'flutter' or 'react-native' actually do?",
      "a": "It orchestrates the native tools: it finds a connected device, invokes the underlying build (Gradle on Android, the Xcode build on iOS), installs the artifact via the device bridge, and attaches a debugger. It is not a separate runtime — it drives the SDKs, build tools, and device bridge you already have.",
      "hint": "An orchestrator on top of the native toolchain."
    }
  ],
  "project-anatomy": [
    {
      "id": "mbfc_anatomy_1",
      "q": "What is XML, and where does it show up in a mobile project?",
      "a": "XML (eXtensible Markup Language) is a plain-text, tag-based markup format for structured data — information wrapped in named, nestable tags with attributes, forming a tree with one root. On Android it appears as AndroidManifest.xml, XML layouts under res/layout, and resource files like strings.xml. iOS uses the related plist format for Info.plist.",
      "hint": "A strict, labeled outline — HTML's stricter cousin."
    },
    {
      "id": "mbfc_anatomy_2",
      "q": "What is the app manifest, and what does it declare?",
      "a": "A declaration file the OS and app store read before your code runs. It declares the app's unique application id, the permissions it requests, its entry points (which screen launches first), its icon, and supported versions. It declares facts; it does not run logic. Android: AndroidManifest.xml. iOS: Info.plist.",
      "hint": "The app's ID card."
    },
    {
      "id": "mbfc_anatomy_3",
      "q": "Why can a correct code change still break the app if the manifest is wrong?",
      "a": "Because the OS reads the manifest first. If you add a new screen but do not register it, or call a sensitive API without declaring its permission, the system refuses or crashes at launch even though the code compiles. The manifest declaration is a required part of the app, not documentation.",
      "hint": "The system checks the declaration before running any code."
    },
    {
      "id": "mbfc_anatomy_4",
      "q": "Why are strings and images kept as externalized resources instead of hardcoded?",
      "a": "So content is separate from logic and the system can adapt automatically: strings can be translated per language and images picked per screen density, with no code change. The build also generates a stable, compile-checked id for each resource. Android uses res/ and the R index; iOS uses Assets.xcassets and plist strings.",
      "hint": "Separate content from code so localization and density come free."
    },
    {
      "id": "mbfc_anatomy_5",
      "q": "What is the difference between declarative config and imperative code?",
      "a": "Declarative config files (the manifest, resource files) describe what the app IS — its id, permissions, entry point, assets — and are read by the OS and build before code runs. Imperative code describes what the app DOES. Putting logic in a manifest, or expecting a config file to run, confuses the two.",
      "hint": "Config declares facts; code performs actions."
    }
  ],
  "build-tools-deps": [
    {
      "id": "mbfc_build_1",
      "q": "What is a build system, and what does Gradle do on Android?",
      "a": "A build system turns source code, dependencies, and resources into a single installable app automatically and repeatably. On Android that system is Gradle: it reads build.gradle, resolves and downloads declared dependencies, compiles your Kotlin/Java, merges resources, packages an APK/AAB, and defines build variants like debug and release.",
      "hint": "The robot that assembles your app from a recipe file."
    },
    {
      "id": "mbfc_build_2",
      "q": "What is a dependency manager, and what happens when you 'add a library'?",
      "a": "It is the tool that handles external libraries. Adding a library means declaring one line with a name and version; the tool resolves it — walking the transitive graph of everything it depends on, reconciling versions, downloading from a repository, caching, and recording exact versions in a lockfile, then linking it into the build.",
      "hint": "One declared line can pull in many transitive libraries."
    },
    {
      "id": "mbfc_build_3",
      "q": "What are a dependency, a repository, and a lockfile?",
      "a": "A dependency (package) is a library your app relies on, declared by name and version. A repository (like Maven Central) is the online warehouse the libraries are downloaded from. A lockfile records the exact resolved versions of every dependency, including transitive ones, so every machine builds an identical set of parts.",
      "hint": "The part, the warehouse, and the exact-parts list."
    },
    {
      "id": "mbfc_build_4",
      "q": "Why does a lockfile matter, and what goes wrong without one?",
      "a": "It freezes the exact resolved version of every dependency, making builds reproducible. Without it, version ranges let two machines resolve different transitive versions at different times, producing the classic 'works on my machine' bug where a build behaves differently or breaks for one developer. Always commit the lockfile.",
      "hint": "Freezes the graph so everyone builds identical parts."
    },
    {
      "id": "mbfc_build_5",
      "q": "What are the iOS and cross-platform parallels to Gradle?",
      "a": "On iOS: CocoaPods (Podfile, Podfile.lock) and Swift Package Manager / SPM (Package.resolved). For cross-platform: npm or yarn for React Native (package.json, package-lock.json) and pub for Flutter (pubspec.yaml, pubspec.lock). All declare dependencies, resolve them from a repository, record a lockfile, and feed the build.",
      "hint": "Same declare-resolve-lock pattern, different names."
    }
  ]
}
