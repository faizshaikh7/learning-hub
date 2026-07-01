import type { ConceptMap } from '@/types'

/** How the big ideas of Flutter & Dart engineering connect. */
export const FLUTTER_CONCEPT_MAP: ConceptMap = {
  title: 'Flutter Concept Map',
  intro:
    'Flutter is a web of connected ideas: everything is a widget, widgets are configured by Dart, driven by state, wired together by navigation, fed by data, animated by the engine, and proven by tests before release. Tap any concept to see how it links to the rest.',
  clusters: [
    {
      id: 'dart-language',
      name: 'Dart Language',
      concepts: [
        { id: 'dart-null-safety', label: 'Null Safety', summary: 'Types are non-null by default; ? marks nullable.', topicId: 'dart-null-safety', relatesTo: [{ id: 'dart-async', relation: 'used with' }, { id: 'widgets', relation: 'safer' }] },
        { id: 'dart-async', label: 'Async / Futures / Streams', summary: 'async/await for Futures, Streams for continuous data.', topicId: 'dart-async', relatesTo: [{ id: 'builders', relation: 'feeds' }, { id: 'http', relation: 'powers' }] },
        { id: 'dart-records', label: 'Records & Patterns', summary: 'Dart 3 tuples, destructuring, and exhaustive switch.', topicId: 'dart-null-safety', relatesTo: [{ id: 'dart-null-safety', relation: 'part of Dart 3' }] },
        { id: 'json-ser', label: 'JSON Serialization', summary: 'Map JSON to typed models (json_serializable/freezed).', topicId: 'json-serialization', relatesTo: [{ id: 'http', relation: 'decodes' }, { id: 'sqlite', relation: 'persists' }] },
      ],
    },
    {
      id: 'widgets-ui',
      name: 'Widgets & UI',
      concepts: [
        { id: 'widgets', label: 'Widgets (Stateless/Stateful)', summary: 'Immutable UI config; the building block of everything.', topicId: 'stateless-stateful-widgets', relatesTo: [{ id: 'layouts', relation: 'composed via' }, { id: 'setstate', relation: 'updated by' }] },
        { id: 'widgets-intro', label: 'Everything is a Widget', summary: 'UI, layout, even padding and themes are widgets.', topicId: 'widgets-intro', relatesTo: [{ id: 'widgets', relation: 'defines' }] },
        { id: 'layouts', label: 'Layouts & Constraints', summary: 'Constraints down, sizes up: Row/Column/Stack/Flex.', topicId: 'layouts-constraints', relatesTo: [{ id: 'scrollable', relation: 'hosts' }, { id: 'internals', relation: 'laid out by' }] },
        { id: 'scrollable', label: 'Scrollable Widgets', summary: 'ListView/GridView/CustomScrollView with lazy builders.', topicId: 'scrollable-widgets', relatesTo: [{ id: 'performance', relation: 'tuned by' }] },
        { id: 'accessibility', label: 'Accessibility', summary: 'Semantics, contrast, and screen-reader support.', topicId: 'flutter-accessibility', relatesTo: [{ id: 'widgets', relation: 'annotates' }] },
      ],
    },
    {
      id: 'state-management',
      name: 'State Management',
      concepts: [
        { id: 'setstate', label: 'setState', summary: 'Local, ephemeral state inside a StatefulWidget.', topicId: 'state-management-intro', relatesTo: [{ id: 'widgets', relation: 'rebuilds' }] },
        { id: 'inherited', label: 'InheritedWidget', summary: 'Propagates data down the tree; basis of Provider.', topicId: 'inherited-widgets', relatesTo: [{ id: 'provider', relation: 'underlies' }] },
        { id: 'provider', label: 'Provider + ChangeNotifier', summary: 'Expose & listen to state via BuildContext.', topicId: 'provider-changenotifier', relatesTo: [{ id: 'riverpod', relation: 'evolved into' }, { id: 'inherited', relation: 'built on' }] },
        { id: 'riverpod', label: 'Riverpod', summary: 'Compile-safe, testable providers with AsyncValue.', topicId: 'riverpod', relatesTo: [{ id: 'dart-async', relation: 'wraps' }, { id: 'choosing-sm', relation: 'compared in' }] },
        { id: 'bloc', label: 'BLoC / Cubit', summary: 'Event → state streams for large, structured apps.', topicId: 'bloc-basics', relatesTo: [{ id: 'dart-async', relation: 'built on streams' }, { id: 'choosing-sm', relation: 'compared in' }] },
        { id: 'choosing-sm', label: 'Choosing State Mgmt', summary: 'Match the tool to app size, team, and complexity.', topicId: 'choosing-state-management', relatesTo: [{ id: 'riverpod', relation: 'often picks' }] },
      ],
    },
    {
      id: 'navigation',
      name: 'Navigation',
      concepts: [
        { id: 'nav-routing', label: 'Navigation & Routing', summary: 'Move between screens; go_router for declarative routes.', topicId: 'navigation-routing', relatesTo: [{ id: 'deep-linking', relation: 'enables' }, { id: 'widgets', relation: 'swaps' }] },
        { id: 'deep-linking', label: 'Deep Linking', summary: 'Open specific screens from URLs/notifications.', topicId: 'deep-linking', relatesTo: [{ id: 'nav-routing', relation: 'handled by' }, { id: 'firebase-auth', relation: 'guards with' }] },
      ],
    },
    {
      id: 'data-apis',
      name: 'Data & APIs',
      concepts: [
        { id: 'http', label: 'HTTP / REST (dio)', summary: 'Call REST APIs; interceptors for auth & retries.', topicId: 'http-rest-flutter', relatesTo: [{ id: 'json-ser', relation: 'parsed via' }, { id: 'builders', relation: 'rendered by' }] },
        { id: 'sqlite', label: 'Local Storage (SQLite/Isar)', summary: 'On-device persistence for offline-first apps.', topicId: 'local-storage-sqlite', relatesTo: [{ id: 'json-ser', relation: 'stores' }, { id: 'firestore', relation: 'caches' }] },
        { id: 'firebase-auth', label: 'Firebase Auth', summary: 'Sign-in flows: email, Google, Apple, tokens.', topicId: 'firebase-auth-flow', relatesTo: [{ id: 'firestore', relation: 'secures' }, { id: 'deep-linking', relation: 'guards' }] },
        { id: 'firestore', label: 'Cloud Firestore', summary: 'Real-time NoSQL DB with streaming queries.', topicId: 'cloud-firestore', relatesTo: [{ id: 'builders', relation: 'streams to' }, { id: 'firebase-auth', relation: 'secured by' }] },
        { id: 'builders', label: 'Future/StreamBuilder', summary: 'Bind async data to the widget tree.', topicId: 'streams-builders-ui', relatesTo: [{ id: 'dart-async', relation: 'consumes' }, { id: 'widgets', relation: 'rebuilds' }] },
      ],
    },
    {
      id: 'animations-internals',
      name: 'Animations & Internals',
      concepts: [
        { id: 'animations', label: 'Animations', summary: 'AnimationController, Tween, implicit AnimatedX widgets.', topicId: 'animations-basics', relatesTo: [{ id: 'internals', relation: 'ticked by' }, { id: 'performance', relation: 'must stay 60fps' }] },
        { id: 'internals', label: 'Flutter Internals', summary: 'Widget → Element → RenderObject trees; build/layout/paint.', topicId: 'flutter-internals', relatesTo: [{ id: 'widgets', relation: 'realizes' }, { id: 'performance', relation: 'explains' }] },
        { id: 'performance', label: 'Performance Optimization', summary: 'const widgets, RepaintBoundary, avoid rebuilds & jank.', topicId: 'performance-optimization', relatesTo: [{ id: 'scrollable', relation: 'optimizes' }, { id: 'internals', relation: 'guided by' }] },
      ],
    },
    {
      id: 'testing',
      name: 'Testing',
      concepts: [
        { id: 'unit-test', label: 'Unit Testing', summary: 'Test pure Dart logic, notifiers, and repositories.', topicId: 'unit-testing-flutter', relatesTo: [{ id: 'riverpod', relation: 'verifies' }, { id: 'widget-test', relation: 'complements' }] },
        { id: 'widget-test', label: 'Widget Testing', summary: 'Pump widgets, find, tap, and expect in a fake tree.', topicId: 'widget-testing', relatesTo: [{ id: 'widgets', relation: 'exercises' }, { id: 'integration-test', relation: 'scales to' }] },
        { id: 'integration-test', label: 'Integration Testing', summary: 'Drive full flows on a real device/emulator.', topicId: 'integration-testing', relatesTo: [{ id: 'cicd', relation: 'run in' }] },
      ],
    },
    {
      id: 'release',
      name: 'Release',
      concepts: [
        { id: 'cicd', label: 'CI/CD', summary: 'Automate analyze → test → build → distribute.', topicId: 'cicd-flutter', relatesTo: [{ id: 'android-release', relation: 'ships' }, { id: 'ios-release', relation: 'ships' }] },
        { id: 'android-release', label: 'Android Release', summary: 'Signed App Bundle to Google Play.', topicId: 'android-release', relatesTo: [{ id: 'cicd', relation: 'built by' }] },
        { id: 'ios-release', label: 'iOS Release', summary: 'Signed IPA to App Store via TestFlight.', topicId: 'ios-release', relatesTo: [{ id: 'cicd', relation: 'built by' }] },
        { id: 'platform-channels', label: 'Platform Channels', summary: 'Call native Kotlin/Swift code from Dart.', topicId: 'platform-channels', relatesTo: [{ id: 'internals', relation: 'bridges' }, { id: 'android-release', relation: 'may need' }] },
      ],
    },
  ],
}
