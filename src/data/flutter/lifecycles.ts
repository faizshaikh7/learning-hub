import type { Lifecycle } from '@/types'

/** Flutter/Dart lifecycles every mobile engineer must know cold. */
export const FLUTTER_LIFECYCLES: Lifecycle[] = [
  {
    id: 'stateful-widget-lifecycle',
    title: 'StatefulWidget Lifecycle',
    subtitle: 'From createState to dispose — the classic interview question',
    icon: '🧬',
    flow: 'linear',
    overview:
      'Every StatefulWidget has a State object whose methods Flutter calls in a strict, predictable order. Knowing exactly when each fires — and what you must and must not do in each — is the difference between a smooth app and one that leaks memory, throws after dispose, or rebuilds needlessly. This is the single most asked Flutter interview question.',
    stages: [
      {
        name: 'createState()',
        shortLabel: 'createState',
        description: 'Flutter calls this once when the widget is inserted into the tree, creating the mutable State object.',
        durationHint: 'once',
        details: [
          'Returns your State<T> instance — the object that survives across rebuilds',
          'The widget itself is immutable and thrown away on every rebuild; the State persists',
          'Do not do heavy work here — just return the State',
        ],
        code: {
          lang: 'dart',
          label: 'createState',
          code: 'class Counter extends StatefulWidget {\n  const Counter({super.key});\n  @override\n  State<Counter> createState() => _CounterState();\n}',
        },
      },
      {
        name: 'initState()',
        shortLabel: 'initState',
        description: 'Called once, immediately after the State is created. Your setup hook.',
        durationHint: 'once',
        details: [
          'Initialize controllers (AnimationController, TextEditingController, ScrollController)',
          'Subscribe to streams, start listeners, kick off one-time async loads',
          'super.initState() must be called first',
          'context is available but InheritedWidgets are NOT safe to read here — use didChangeDependencies',
        ],
        code: {
          lang: 'dart',
          label: 'initState',
          code: '@override\nvoid initState() {\n  super.initState();\n  _controller = AnimationController(vsync: this, duration: const Duration(seconds: 1));\n  _subscription = stream.listen(_onData);\n}',
        },
        gotchas: [
          'Calling Provider.of / context.watch here throws — dependencies aren\'t wired yet',
          'Forgetting super.initState() breaks the framework contract',
          'Doing async work without checking `mounted` before setState later',
        ],
      },
      {
        name: 'didChangeDependencies()',
        shortLabel: 'didChangeDeps',
        description: 'Called right after initState, and again whenever an InheritedWidget this State depends on changes.',
        durationHint: 'initState + on dep change',
        details: [
          'The correct place to read InheritedWidget data (Theme.of, MediaQuery.of, Provider)',
          'Fires again if an ancestor InheritedWidget updates — react to locale/theme changes here',
          'Good place to re-fetch data that depends on an inherited value',
        ],
        gotchas: ['Can fire multiple times — make the work idempotent or guard it'],
      },
      {
        name: 'build()',
        shortLabel: 'build',
        description: 'Returns the widget subtree. Called on first render and on every rebuild.',
        durationHint: 'every render',
        details: [
          'Must be pure and fast — it can run 60+ times per second during animations',
          'Never trigger side effects, network calls, or setState inside build',
          'Fires after initState, after didChangeDependencies, after didUpdateWidget, and after every setState',
        ],
        gotchas: [
          'Calling setState() inside build causes an infinite rebuild loop',
          'Creating controllers/objects inside build leaks them every rebuild — create in initState',
        ],
      },
      {
        name: 'didUpdateWidget()',
        shortLabel: 'didUpdateWidget',
        description: 'Called when the parent rebuilds and gives this State a new widget configuration of the same type.',
        durationHint: 'on parent rebuild',
        details: [
          'Compare oldWidget to the new widget and react to changed props',
          'Re-subscribe controllers if a config they depend on changed (e.g. new animation duration)',
          'The State object is reused; only the immutable widget is swapped',
        ],
        code: {
          lang: 'dart',
          label: 'didUpdateWidget',
          code: '@override\nvoid didUpdateWidget(covariant Counter old) {\n  super.didUpdateWidget(old);\n  if (old.duration != widget.duration) {\n    _controller.duration = widget.duration;\n  }\n}',
        },
      },
      {
        name: 'setState()',
        shortLabel: 'setState',
        description: 'You call this to signal state changed; Flutter schedules a rebuild (build runs again).',
        durationHint: 'on demand',
        details: [
          'Mutate your state fields inside the callback, then Flutter reruns build',
          'Batches synchronously — multiple field changes in one setState = one rebuild',
          'Always check `mounted` before calling setState in async callbacks',
        ],
        gotchas: [
          'Calling setState after dispose throws "setState() called after dispose()"',
          'Heavy work inside the setState callback blocks the frame — do work first, then setState with the result',
        ],
      },
      {
        name: 'deactivate() & dispose()',
        shortLabel: 'dispose',
        description: 'deactivate fires when removed from the tree (may be reinserted); dispose is the final teardown.',
        durationHint: 'once, at end',
        details: [
          'Dispose ALL controllers, cancel ALL stream subscriptions, remove listeners',
          'super.dispose() must be called last',
          'After dispose the State is dead — never call setState again',
        ],
        code: {
          lang: 'dart',
          label: 'dispose',
          code: '@override\nvoid dispose() {\n  _controller.dispose();\n  _subscription.cancel();\n  _scrollController.dispose();\n  super.dispose();\n}',
        },
        gotchas: [
          'Forgetting to dispose controllers = memory leak + "A TextEditingController was used after being disposed"',
          'Not cancelling stream subscriptions keeps the State alive and firing callbacks',
        ],
      },
    ],
    keyTakeaways: [
      'The widget is immutable and rebuilt constantly; the State object persists — that split is the whole point',
      'initState = one-time setup, dispose = one-time teardown, and they must be symmetric (every subscribe has a cancel)',
      'Read InheritedWidgets in didChangeDependencies, never in initState',
      'build() must be pure — no side effects, no object creation, no setState',
      'Always guard async setState with `if (mounted)`',
    ],
    interviewNotes: [
      'Explain the full order of lifecycle calls from createState to dispose.',
      'Why can\'t you access Provider/Theme in initState but you can in didChangeDependencies?',
      'What happens if you forget to dispose an AnimationController?',
      'When does didUpdateWidget fire and how is it different from didChangeDependencies?',
      'How do you safely call setState after an await?',
    ],
    relatedTopics: ['stateless-stateful-widgets', 'widgets-intro', 'animations-basics'],
  },

  {
    id: 'app-lifecycle-states',
    title: 'App Lifecycle States',
    subtitle: 'resumed, inactive, paused, hidden, detached',
    icon: '📱',
    flow: 'cyclic',
    overview:
      'The OS moves your app between foreground and background states as the user switches apps, takes calls, or locks the screen. Listening to AppLifecycleState lets you pause animations, save drafts, release the camera, and stop expensive work when the user isn\'t looking — critical for battery life and not losing user data.',
    stages: [
      {
        name: 'resumed',
        shortLabel: 'resumed',
        description: 'App is visible and responding to user input — the normal foreground state.',
        durationHint: 'foreground',
        details: [
          'Resume animations, re-acquire camera/sensors, refresh data that may be stale',
          'This is the only state where the app is fully interactive',
        ],
      },
      {
        name: 'inactive',
        shortLabel: 'inactive',
        description: 'App is in the foreground but not receiving input (incoming call, app switcher, system dialog).',
        durationHint: 'transitional',
        details: [
          'Transient state — often a brief hop on the way to paused',
          'On iOS this fires when the app switcher opens or a call comes in',
          'Pause anything that shouldn\'t run while the user is distracted',
        ],
      },
      {
        name: 'hidden',
        shortLabel: 'hidden',
        description: 'App is not visible (newer unified state across platforms before paused).',
        durationHint: 'transitional',
        details: [
          'Introduced to unify behavior across platforms',
          'Treat similarly to inactive/paused — stop visual work',
        ],
      },
      {
        name: 'paused',
        shortLabel: 'paused',
        description: 'App is in the background and not visible. The user has switched away.',
        durationHint: 'background',
        details: [
          'Save unsaved work / drafts NOW — the OS may kill the app without further warning',
          'Stop timers, pause video, release the camera and microphone',
          'Persist any in-memory state you need to restore',
        ],
        code: {
          lang: 'dart',
          label: 'Listening to lifecycle',
          code: 'class _MyState extends State<MyApp> with WidgetsBindingObserver {\n  @override\n  void initState() {\n    super.initState();\n    WidgetsBinding.instance.addObserver(this);\n  }\n  @override\n  void didChangeAppLifecycleState(AppLifecycleState state) {\n    if (state == AppLifecycleState.paused) _saveDraft();\n  }\n  @override\n  void dispose() {\n    WidgetsBinding.instance.removeObserver(this);\n    super.dispose();\n  }\n}',
        },
        gotchas: ['Don\'t assume you\'ll get another callback — the OS can terminate a paused app at any time'],
      },
      {
        name: 'detached',
        shortLabel: 'detached',
        description: 'The Flutter engine is still running but detached from any view — the app is being torn down.',
        durationHint: 'end',
        details: [
          'Last chance for cleanup before the process ends',
          'Flush critical writes; don\'t rely on heavy async work completing',
        ],
      },
    ],
    keyTakeaways: [
      'Register a WidgetsBindingObserver and implement didChangeAppLifecycleState to react to state changes',
      'paused is your "save everything now" signal — the app may never resume',
      'Release scarce resources (camera, mic, location) when backgrounded to save battery and avoid OS kills',
      'Always removeObserver in dispose to avoid leaks',
    ],
    interviewNotes: [
      'Name the AppLifecycleState values and when each fires.',
      'Where should you save user data to guarantee it survives a background kill?',
      'How do you subscribe to app lifecycle events in Flutter?',
      'Why release the camera when the app is paused?',
    ],
    relatedTopics: ['flutter-internals', 'performance-optimization', 'local-storage-sqlite'],
  },

  {
    id: 'three-trees-build-lifecycle',
    title: 'The Three Trees: Build → Layout → Paint',
    subtitle: 'Widget, Element, and RenderObject — how a frame is drawn',
    icon: '🌳',
    flow: 'linear',
    overview:
      'Flutter keeps three parallel trees: the Widget tree (your immutable config), the Element tree (the mutable instance that manages lifecycle and links widgets to render objects), and the RenderObject tree (does layout and painting). Understanding this pipeline explains why keys matter, why const constructors boost performance, and how Flutter rebuilds only what changed.',
    stages: [
      {
        name: 'Widget tree (configuration)',
        shortLabel: 'Widget',
        description: 'Immutable descriptions of what the UI should look like. Cheap to create and throw away.',
        durationHint: 'every build',
        details: [
          'Widgets are blueprints, not objects on screen — they hold no mutable state',
          'const widgets are cached and skip rebuilds entirely',
          'Rebuilding a widget subtree is cheap; it\'s just new config objects',
        ],
      },
      {
        name: 'Element tree (lifecycle & diffing)',
        shortLabel: 'Element',
        description: 'The mutable middle layer. Each Element holds a widget and manages its position in the tree.',
        durationHint: 'persists across rebuilds',
        details: [
          'Elements decide whether to update in place or rebuild by comparing widget runtimeType + key',
          'This is where reconciliation happens — matching new widgets to existing elements',
          'Keys control element identity: same key + same type = reuse element and its State',
        ],
        gotchas: [
          'Missing keys in a reorderable list cause wrong State to attach to wrong item',
          'Changing widget type forces Flutter to destroy the element and its State',
        ],
      },
      {
        name: 'RenderObject tree (layout)',
        shortLabel: 'Layout',
        description: 'Computes size and position. Constraints go down, sizes come back up.',
        durationHint: 'per frame if dirty',
        details: [
          'Parent passes constraints down; child chooses a size within them; parent positions the child',
          '"Constraints go down, sizes go up, parent sets position" — the core layout rule',
          'Only render objects marked dirty are re-laid-out (relayout boundaries limit the work)',
        ],
        gotchas: [
          'Unbounded constraints (e.g. Column inside Column) cause "RenderFlex overflowed" or infinite height errors',
          'Expensive layout in a hot path (large lists) drops frames — use ListView.builder',
        ],
      },
      {
        name: 'Paint & composite',
        shortLabel: 'Paint',
        description: 'Render objects paint into layers, which the GPU composites into the final frame.',
        durationHint: 'per frame',
        details: [
          'Painting produces layers; repaint boundaries isolate expensive painters',
          'The compositor hands layers to Skia/Impeller for GPU rasterization',
          'RepaintBoundary prevents a repainting child from forcing parents to repaint',
        ],
        gotchas: ['Overusing Opacity/ClipRR  and missing RepaintBoundary causes costly repaints'],
      },
    ],
    keyTakeaways: [
      'Widget = immutable config, Element = mutable instance + lifecycle, RenderObject = layout + paint',
      'const constructors let Flutter skip rebuilding whole subtrees — use them everywhere you can',
      'Keys control element/State identity — essential for lists and reordering',
      'Layout follows one rule: constraints go down, sizes go up, parent sets position',
      'RepaintBoundary and relayout boundaries limit how much work each frame does',
    ],
    interviewNotes: [
      'Explain the three trees and what each is responsible for.',
      'Why does adding const improve performance?',
      'What problem do keys solve and when do you need them?',
      'Describe Flutter\'s layout algorithm in one sentence.',
      'What causes a RenderFlex overflow and how do you fix it?',
    ],
    relatedTopics: ['flutter-internals', 'layouts-constraints', 'performance-optimization'],
  },

  {
    id: 'navigation-route-lifecycle',
    title: 'Navigation & Route Lifecycle',
    subtitle: 'push, pop, and what happens to screens on the stack',
    icon: '🧭',
    flow: 'linear',
    overview:
      'Navigator manages a stack of routes. Understanding push/pop, how the underlying screen stays alive, and how to pass and return data keeps navigation predictable and prevents leaks from screens that never dispose.',
    stages: [
      {
        name: 'push (navigate to a new route)',
        shortLabel: 'push',
        description: 'A new route is placed on top of the stack; its widget is built and initState runs.',
        durationHint: 'on navigate',
        details: [
          'Navigator.push / context.push (go_router) adds a route above the current one',
          'The previous route stays mounted underneath — its State is NOT disposed',
          'You can await the pushed route to receive a result when it pops',
        ],
        code: {
          lang: 'dart',
          label: 'push and await result',
          code: 'final result = await Navigator.push<String>(\n  context,\n  MaterialPageRoute(builder: (_) => const EditScreen()),\n);\nif (result != null) _apply(result);',
        },
      },
      {
        name: 'route becomes active',
        shortLabel: 'active',
        description: 'The new screen is on top and interactive; the one below is paused but alive.',
        durationHint: 'while on top',
        details: [
          'The screen below keeps its scroll position and State',
          'Use RouteAware / didPushNext to know when you\'re covered',
        ],
        gotchas: ['The background screen\'s timers/streams keep running unless you pause them on didPushNext'],
      },
      {
        name: 'pop (return)',
        shortLabel: 'pop',
        description: 'The top route is removed; its State is disposed and an optional result is returned.',
        durationHint: 'on back',
        details: [
          'Navigator.pop(context, result) returns data to the awaiting push',
          'The popped screen\'s dispose runs — clean up here',
          'The revealed screen\'s didPopNext fires (via RouteAware)',
        ],
        code: {
          lang: 'dart',
          label: 'pop with result',
          code: 'Navigator.pop(context, _editedText);',
        },
        gotchas: [
          'Popping a route whose controllers aren\'t disposed leaks them',
          'Calling pop when the stack has one route can close the app',
        ],
      },
    ],
    keyTakeaways: [
      'Navigator is a stack: push adds, pop removes — the screen below stays mounted',
      'await a push to receive a result; return it with pop(context, result)',
      'Screens beneath the top do not dispose — pause their work with RouteAware if needed',
      'Every pushed screen eventually pops and disposes — clean up controllers there',
    ],
    interviewNotes: [
      'What happens to the previous screen when you push a new route?',
      'How do you return data from a pushed screen back to the caller?',
      'How do you detect that your screen has been covered by another route?',
      'Why might a backgrounded screen keep consuming resources?',
    ],
    relatedTopics: ['navigation-routing', 'stateless-stateful-widgets'],
  },
]
