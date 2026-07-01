import type { InterviewBank } from '@/types'

/** Flutter / mobile-engineering interview bank: roles + 3-round question set. */
export const FLUTTER_INTERVIEW: InterviewBank = {
  roles: [
    {
      id: 'flutter-developer',
      title: 'Flutter Developer',
      seniority: 'Junior → Mid',
      icon: '📱',
      description:
        'Builds app screens and features from designs using the widget tree. Owns UI correctness, local state, navigation, and wiring the app to REST/Firebase backends across iOS and Android from one codebase.',
      focus: ['Widgets & layout', 'State (setState/Provider)', 'Navigation', 'Async & networking', 'Forms & lists'],
      demandNote: 'The highest-volume Flutter role — startups and agencies hire these constantly.',
    },
    {
      id: 'mobile-engineer',
      title: 'Mobile Engineer',
      seniority: 'Mid → Senior',
      icon: '🛠️',
      description:
        'Owns whole features end to end across platforms, dips into native (platform channels, plugins), and cares about the widget/element/render pipeline, testing, and shipping to both stores.',
      focus: ['Widget internals', 'Platform channels', 'Testing', 'CI/CD & release', 'Performance basics'],
      demandNote: 'Broad demand — the reliable generalist every mobile team needs.',
    },
    {
      id: 'senior-flutter-lead',
      title: 'Senior Flutter Engineer / Mobile Lead',
      seniority: 'Senior → Staff',
      icon: '🧭',
      description:
        'Sets app architecture, chooses and enforces the state-management approach, owns the performance budget, and unblocks the team. Makes the high-leverage calls: layering, data flow, offline strategy, and release process.',
      focus: ['App architecture', 'State management at scale', 'Performance / jank', 'Offline & sync', 'Mentoring & tradeoffs'],
      demandNote: 'Senior+ role — architecture and performance judgment is the whole interview.',
    },
    {
      id: 'cross-platform-engineer',
      title: 'Cross-Platform Engineer',
      seniority: 'Mid → Senior',
      icon: '🔌',
      description:
        'Specialises in the seam between Flutter and the host OS: platform channels, native SDK integration, background work, push, and getting builds signed and shipped to the App Store and Play Store.',
      focus: ['Platform channels / FFI', 'Native SDK interop', 'Background & push', 'Signing & store release', 'Build tooling'],
      demandNote: 'Higher comp — teams pay for engineers comfortable in Dart, Swift/Kotlin, and the build systems.',
    },
  ],

  questions: [
    // ── Round 1: Phone Screen (fundamentals, breadth) ──────────────────────────
    {
      id: 'fl-s1',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'What is the difference between a StatelessWidget and a StatefulWidget, and when do you reach for each?',
      modelAnswer:
        'A StatelessWidget is immutable: given the same inputs it always renders the same thing, so it has only a build method and no mutable state. A StatefulWidget pairs an immutable widget with a separate, long-lived State object that can hold mutable fields and call setState to trigger a rebuild. Use Stateless for pure, config-driven UI (a label, an icon, a layout) and Stateful when the widget must remember something that changes over its lifetime — form input, animation controllers, toggles, or fetched data. A good instinct is to keep widgets stateless by default and lift state as high as it needs to be.',
      keyPoints: [
        'Stateless is immutable; Stateful has a separate mutable State object',
        'setState triggers a rebuild of that subtree',
        'Prefers stateless by default, adds state only when needed',
      ],
      followUp: 'Why is the State object a separate class from the StatefulWidget rather than fields on the widget itself?',
      topicId: 'stateless-stateful-widgets',
    },
    {
      id: 'fl-s2',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'Everything in Flutter is a widget — so what actually is a widget, and how does it become pixels on screen?',
      modelAnswer:
        'A widget is just an immutable description (a configuration) of part of the UI — it is cheap to create and throw away. Flutter keeps three parallel trees: the Widget tree (the blueprint you write), the Element tree (the mutable instances that hold state and link widgets to render objects), and the RenderObject tree (which does layout, painting, and hit testing). On rebuild Flutter diffs new widgets against the existing elements and only mutates the render objects that actually changed, which is why rebuilding widgets is cheap.',
      keyPoints: [
        'Widget = immutable description/configuration, cheap to recreate',
        'Names the three trees: Widget, Element, RenderObject',
        'Elements are the mutable middle layer that enables efficient diffing',
      ],
      followUp: 'If widgets are recreated every build, where does a StatefulWidget’s state actually live?',
      topicId: 'flutter-internals',
    },
    {
      id: 'fl-s3',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'Walk me through the lifecycle of a StatefulWidget’s State object.',
      modelAnswer:
        'createState runs once to create the State. Then initState runs once for one-time setup (subscriptions, controllers) — you cannot use InheritedWidgets here. didChangeDependencies runs right after initState and again whenever an inherited dependency changes, so it is the right place to react to Provider/Theme changes. build runs on every rebuild and must be pure. didUpdateWidget fires when the parent rebuilds this widget with a new configuration, letting you diff oldWidget against the new one. Finally dispose runs once when the element is removed — you cancel timers, close streams, and dispose controllers there to avoid leaks.',
      keyPoints: [
        'Correct order: createState → initState → didChangeDependencies → build',
        'didUpdateWidget on new parent config; dispose for cleanup',
        'Knows initState can’t touch inherited widgets, didChangeDependencies can',
      ],
      followUp: 'You subscribe to a stream in initState. Where and why must you unsubscribe?',
      redFlags: [
        'Thinks build runs only once',
        'Forgets dispose, or does cleanup in the wrong callback',
      ],
      topicId: 'stateless-stateful-widgets',
    },
    {
      id: 'fl-s4',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'What is a BuildContext, and what does it actually give you access to?',
      modelAnswer:
        'A BuildContext is a handle to the location of a widget in the Element tree — practically, it is the Element itself. It lets you walk up the tree to find inherited state and ancestors, which is how Theme.of(context), MediaQuery.of(context), Navigator.of(context), and Provider.of(context) resolve their values. A common bug is using the wrong context — for example, calling ScaffoldMessenger.of(context) with a context above the Scaffold, or using a context after its widget has been disposed (the "don’t use BuildContext across async gaps" warning).',
      keyPoints: [
        'Context = the widget’s position in the Element tree',
        'Powers .of(context) lookups by walking up to ancestors',
        'Aware of wrong-context and async-gap pitfalls',
      ],
      followUp: 'Why does calling showDialog sometimes fail with "no MaterialLocalizations found" and how does context relate?',
      topicId: 'flutter-internals',
    },
    {
      id: 'fl-s5',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'How does Flutter’s layout work? What does "constraints go down, sizes go up" mean?',
      modelAnswer:
        'Layout is a single-pass negotiation down and back up the tree. A parent passes constraints (min/max width and height) down to each child; the child chooses its own size within those constraints and passes that size back up; then the parent positions the child. A widget can never be bigger than the constraints it is given, and it cannot know its own size until layout runs. That is why an unbounded widget (like a Column inside a scroll view, or a ListView with no height) throws — the constraints don’t give it enough information to size itself.',
      keyPoints: [
        'Single pass: constraints down, sizes up, parent sets position',
        'A child sizes itself within the parent’s constraints',
        'Explains unbounded-constraint errors (overflow / infinite height)',
      ],
      followUp: 'You get "RenderFlex overflowed" on a Row of text. What’s happening and how do you fix it?',
      topicId: 'layouts-constraints',
    },
    {
      id: 'fl-s6',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'What are Keys in Flutter and when do you actually need one?',
      modelAnswer:
        'Keys give elements a stable identity so Flutter can match the right element to the right widget during a rebuild, instead of matching purely by position and type. You usually don’t need them, but they matter when you reorder, add, or remove items in a list of stateful widgets — without a key, state can attach to the wrong item (the classic "dismiss one item and the wrong row keeps its color"). Use ValueKey/ObjectKey to tie identity to your data, and GlobalKey when you need to access a widget’s state or preserve it across the tree — though GlobalKeys are expensive and should be rare.',
      keyPoints: [
        'Keys preserve element identity across rebuilds',
        'Needed when reordering/inserting stateful list items',
        'Distinguishes ValueKey/ObjectKey from the heavier GlobalKey',
      ],
      followUp: 'A list of checkboxes loses its checked state when you remove the top item. Why, and which key fixes it?',
      topicId: 'scrollable-widgets',
    },

    // ── Round 2: Technical Deep Dive (depth, problem-solving, debugging) ────────
    {
      id: 'fl-t1',
      level: 'technical',
      difficulty: 'mid',
      category: 'debugging',
      question: 'Your list scrolls but drops frames and feels janky. How do you diagnose and fix it?',
      modelAnswer:
        'Jank means a frame missed the ~16ms budget (at 60Hz). I’d profile with the DevTools performance overlay and timeline in profile mode — never debug mode — to see whether the UI thread or raster thread is blowing the budget. Common causes: a ListView building all children instead of ListView.builder, heavy work in build (parsing, sync I/O), rebuilding too large a subtree, expensive images without caching/resizing, or costly layers that should be isolated with RepaintBoundary. Fixes are targeted: lazy-build the list, hoist const widgets, move computation off the build path (or into an isolate), cache/downscale images, and add RepaintBoundary around animating subtrees.',
      keyPoints: [
        'Names the 16ms/60fps budget and UI vs raster thread',
        'Profiles in profile mode with DevTools, not by guessing',
        'Concrete fixes: ListView.builder, const, RepaintBoundary, isolates for heavy work',
      ],
      followUp: 'The raster thread specifically is the bottleneck. What kinds of things cause that versus the UI thread?',
      redFlags: [
        'Profiles in debug mode and trusts the numbers',
        'Reaches for setState/rebuild tweaks when the cost is actually in painting',
      ],
      topicId: 'performance-optimization',
    },
    {
      id: 'fl-t2',
      level: 'technical',
      difficulty: 'mid',
      category: 'concept',
      question: 'Explain Future vs Stream in Dart, and how the event loop keeps the UI responsive.',
      modelAnswer:
        'Dart is single-threaded per isolate and uses an event loop with a microtask queue and an event queue. A Future is a single asynchronous value that completes once (a network call); a Stream is a sequence of asynchronous events over time (websocket messages, sensor updates, user input). async/await doesn’t create threads — it suspends the function and yields back to the event loop so the UI keeps rendering, then resumes when the Future completes. Because it’s all one thread, CPU-bound work (parsing a huge JSON, image processing) still blocks the UI and must be pushed to an isolate via compute or Isolate.run.',
      keyPoints: [
        'Future = one value; Stream = many values over time',
        'Single-threaded event loop; await yields, doesn’t spawn threads',
        'CPU-bound work needs an isolate; await alone won’t unblock the UI',
      ],
      followUp: 'You await a heavy JSON parse and the UI still freezes. Why, and what do you change?',
      topicId: 'dart-async',
    },
    {
      id: 'fl-t3',
      level: 'technical',
      difficulty: 'mid',
      category: 'debugging',
      question: 'A FutureBuilder re-runs its network call every time the screen rebuilds. What’s wrong and how do you fix it?',
      modelAnswer:
        'The classic mistake is calling the async function inline in build — future: fetchUser() — so a new Future is created on every rebuild and FutureBuilder starts over, causing flicker and duplicate requests. The fix is to create the Future once (in initState, or via a memoized field / a state-management layer) and pass that same Future instance to the builder. More broadly, FutureBuilder/StreamBuilder are for binding an existing async source to the UI, not for kicking off the work. For repeated data I’d move the fetch into a Provider/Riverpod/BLoC layer and let the widget just render state.',
      keyPoints: [
        'Root cause: new Future created inline in build each rebuild',
        'Fix: create the Future once (initState/memoized/state layer)',
        'Understands builders bind to async sources, don’t own the fetch',
      ],
      followUp: 'When would you use StreamBuilder instead, and what does snapshot.connectionState tell you?',
      redFlags: ['Adds a manual "hasLoaded" bool hack instead of fixing where the Future is created'],
      topicId: 'streams-builders-ui',
    },
    {
      id: 'fl-t4',
      level: 'technical',
      difficulty: 'senior',
      category: 'tradeoff',
      question: 'setState vs Provider vs Riverpod vs BLoC — how do you decide which to use?',
      modelAnswer:
        'setState is right for local, ephemeral UI state that lives in one widget — a toggle, a text field, an animation. Once state must be shared across widgets or survive navigation you need something above the widget. Provider (with ChangeNotifier) is the simple, official baseline for sharing state via InheritedWidget. Riverpod is essentially Provider’s successor: compile-safe, no BuildContext needed, testable, and better for complex dependency graphs. BLoC enforces a strict event-in/state-out stream pattern that shines on large teams needing predictability and traceability, at the cost of boilerplate. The honest answer is there’s no universal winner — I match the tool to team size, app complexity, and testability needs, and I keep it consistent across the codebase.',
      keyPoints: [
        'setState for local/ephemeral; lift state out once it’s shared',
        'Provider = simple baseline; Riverpod = compile-safe successor, no context',
        'BLoC = event→state discipline, good for scale, more boilerplate',
        'Chooses by team/app complexity and stays consistent',
      ],
      followUp: 'You inherit a codebase mixing Provider and BLoC randomly. What do you do?',
      redFlags: ['Declares one tool universally "best" with no context', 'Puts shared, cross-screen state in setState'],
      topicId: 'choosing-state-management',
    },
    {
      id: 'fl-t5',
      level: 'technical',
      difficulty: 'senior',
      category: 'concept',
      question: 'How do platform channels work when you need native functionality Flutter doesn’t provide?',
      modelAnswer:
        'A MethodChannel is a named, asynchronous bridge between Dart and the host platform. Dart invokes a method by name with arguments; the message is serialized by a codec and passed to the platform side (Kotlin/Java on Android, Swift/Objective-C on iOS), which runs the native code and returns a result — all async, so Dart awaits a Future. Channel names must match on both sides, calls hop to the platform’s main thread, and you handle MissingPluginException/PlatformException. For streaming native data (sensors, battery events) you use an EventChannel instead, and for high-throughput or synchronous C interop you reach for FFI (dart:ffi).',
      keyPoints: [
        'MethodChannel = named async bridge, codec-serialized args/results',
        'Native side in Kotlin/Swift; matching channel names; error handling',
        'EventChannel for streams, FFI for high-throughput/C interop',
      ],
      followUp: 'The native call is fast but you see UI stutter every time it runs. Where would you look?',
      topicId: 'flutter-internals',
    },
    {
      id: 'fl-t6',
      level: 'technical',
      difficulty: 'mid',
      category: 'concept',
      question: 'What is sound null safety in Dart and how does it change the way you write code?',
      modelAnswer:
        'With sound null safety, types are non-nullable by default: String can never be null, and you must write String? to allow null. "Sound" means the compiler and runtime guarantee that a non-nullable variable is genuinely never null, which eliminates a whole class of null-dereference crashes and lets the compiler optimize. Practically you use ? for nullable types, ! to assert non-null when you know better (sparingly — it can still throw), ?? and ?. for null-aware handling, and late for values initialized after declaration but before use. It pushes you to model "can this be absent?" explicitly at the type level instead of guarding everywhere.',
      keyPoints: [
        'Non-nullable by default; ? opts into nullability',
        '"Sound" = compile-time + runtime guarantee, not just hints',
        'Uses ?/!/??/?./late correctly and treats ! as a code smell',
      ],
      followUp: 'When is `late` genuinely the right tool, and how can it still blow up at runtime?',
      topicId: 'dart-null-safety',
    },

    // ── Round 3: App Architecture / Senior (design + behavioral) ───────────────
    {
      id: 'fl-d1',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['mobile-engineer', 'senior-flutter-lead', 'cross-platform-engineer'],
      question: 'Architect a real-time chat app in Flutter. Walk me through the layers, state, and data flow.',
      modelAnswer:
        'I’d layer it: a UI layer of widgets, a state/presentation layer (BLoC or Riverpod) exposing conversation and message state, a repository layer that abstracts data sources, and data sources for the network and local cache. Messages arrive over a stream — a websocket or Firestore snapshot listener — surfaced to the UI via StreamBuilder or the state layer, with the message list rendered by a reversed ListView.builder for lazy, performant scrolling. I’d make sending optimistic: append the message locally with a "sending" status immediately, persist it to a local DB (SQLite/Isar) as the source of truth, then reconcile with the server ack. Offline messages queue locally and flush on reconnect. Cross-cutting concerns: pagination of history via cursors, image/attachment upload through a queue, and push notifications through platform channels for background delivery.',
      keyPoints: [
        'Clear layering: UI → state (BLoC/Riverpod) → repository → data sources',
        'Streams for realtime; reversed ListView.builder for the message list',
        'Optimistic send + local DB as source of truth + offline queue',
        'Handles pagination, attachments, and background push',
      ],
      followUp: 'Two devices send messages at the same time offline. How do you order and de-duplicate them on sync?',
      topicId: 'streams-builders-ui',
    },
    {
      id: 'fl-d2',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['senior-flutter-lead', 'mobile-engineer', 'flutter-developer'],
      question: 'How would you structure state management for a large multi-screen app with auth, feeds, and settings?',
      modelAnswer:
        'I’d separate state by scope and lifetime. Global/app-scoped state (auth session, user profile, feature flags, theme) lives in long-lived providers/BLoCs created near the root. Feature-scoped state (a feed’s pagination, a form) is created and disposed with its screen so memory and rebuilds stay bounded. Ephemeral UI state (a dropdown’s open flag) stays local with setState. I’d enforce a unidirectional flow — UI dispatches intents, the state layer talks to repositories, new state flows back — and keep business logic out of widgets so it’s testable. Consistency matters more than the specific library: one chosen approach (say Riverpod), a clear folder-per-feature structure, and repositories abstracting data so screens never touch HTTP or Firestore directly.',
      keyPoints: [
        'Scopes state: global vs feature-scoped vs ephemeral local',
        'Feature state disposed with its screen to bound memory/rebuilds',
        'Unidirectional flow, logic out of widgets, repositories abstract data',
        'Prioritizes one consistent approach and a feature-based structure',
      ],
      followUp: 'A settings change must instantly reflect on three already-open screens. How does your design propagate it?',
      redFlags: ['Puts everything in one giant global store', 'Business logic living inside widget build methods'],
      topicId: 'choosing-state-management',
    },
    {
      id: 'fl-d3',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['senior-flutter-lead', 'mobile-engineer', 'cross-platform-engineer'],
      question: 'Design an offline-first app (e.g. notes or tasks) that syncs to a backend. What’s your strategy?',
      modelAnswer:
        'Offline-first means the local database is the source of truth, not the network. The UI reads and writes to a local store (SQLite/Isar/Drift) and always renders instantly; every mutation is recorded locally with a sync status and a change log or outbox. A background sync process pushes pending local changes and pulls remote changes when connectivity returns, so the app is fully usable offline. The hard part is conflict resolution: I’d attach versions/timestamps (or vector clocks for stronger guarantees) and pick a policy — last-write-wins for simple fields, field-level merge or CRDTs where concurrent edits must both survive. I’d also make sync idempotent with stable client-generated IDs so retries don’t duplicate records, and surface sync state to the user.',
      keyPoints: [
        'Local DB is the source of truth; UI never waits on the network',
        'Outbox/change-log of pending mutations, background push/pull sync',
        'Explicit conflict policy: LWW vs field-merge/CRDT with versions',
        'Idempotent sync via stable client-generated IDs',
      ],
      followUp: 'The same note is edited on two offline devices. Walk me through exactly what your sync does on reconnect.',
      redFlags: ['Treats the server as source of truth and blocks the UI on network', 'No story for conflicts or duplicate writes'],
      topicId: 'local-storage-sqlite',
    },
    {
      id: 'fl-d4',
      level: 'design',
      difficulty: 'senior',
      category: 'behavioral',
      question: 'Tell me about a time an app you built had a serious performance or jank problem. How did you find and fix it?',
      modelAnswer:
        'A strong answer is specific and data-driven: it starts with the symptom and how it was noticed (a janky scroll, slow startup, a complaint), then how it was measured — profile mode, the DevTools timeline, the performance overlay, or frame-timing metrics — rather than guessing. It identifies the actual bottleneck (a non-lazy list, rebuilding too much, heavy work on the UI thread, un-cached images, missing RepaintBoundary) and describes a targeted fix with a before/after number to prove impact. The best answers close the loop: they add a guardrail — a performance budget, a lint, or a regression check in CI — so the problem can’t silently return, and they’re honest about what they’d do differently.',
      keyPoints: [
        'Measures before fixing (profile mode, DevTools, frame timings)',
        'Identifies a concrete root cause, not a vague "it was slow"',
        'Quantifies impact with before/after numbers',
        'Adds a guardrail so the regression can’t silently return',
      ],
      followUp: 'How would you catch this class of regression automatically before it ships next time?',
      topicId: 'performance-optimization',
    },
  ],
}
