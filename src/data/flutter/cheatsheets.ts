import type { Cheatsheet } from '@/types'

/** Flutter & Dart quick-reference cheat sheets. */
export const FLUTTER_CHEATSHEETS: Cheatsheet[] = [
  {
    id: 'core-widgets',
    title: 'Core Widgets',
    subtitle: 'The layout and common widgets you reach for daily',
    icon: '🧱',
    sections: [
      {
        heading: 'Single-child layout',
        entries: [
          { label: 'Container', value: 'Box with padding, margin, color, decoration, size.' },
          { label: 'Padding', value: 'Insets a child: Padding(padding: EdgeInsets.all(16), child: ...)', code: true },
          { label: 'Center / Align', value: 'Position a child within available space.' },
          { label: 'SizedBox', value: 'Fixed size or spacing: SizedBox(height: 12)', code: true },
          { label: 'Expanded / Flexible', value: 'Fill remaining space inside a Row/Column.' },
        ],
      },
      {
        heading: 'Multi-child layout',
        entries: [
          { label: 'Column / Row', value: 'Vertical / horizontal stacks; use main/crossAxisAlignment.' },
          { label: 'Stack / Positioned', value: 'Overlap children; Positioned pins edges.' },
          { label: 'Wrap', value: 'Flows children to the next line when out of room.' },
          { label: 'ListView.builder', value: 'Lazily builds long/infinite scrollable lists.', code: true },
          { label: 'GridView.builder', value: 'Lazy 2D grid of items.', code: true },
        ],
      },
      {
        heading: 'Common / scaffolding',
        entries: [
          { label: 'Scaffold', value: 'Page skeleton: appBar, body, FAB, bottomNavigationBar, drawer.' },
          { label: 'Text / RichText', value: 'Text("Hi", style: Theme.of(context).textTheme.titleLarge)', code: true },
          { label: 'Image', value: 'Image.network / Image.asset (+ cached_network_image).' },
          { label: 'ElevatedButton / TextButton', value: 'Material buttons with onPressed callbacks.' },
          { label: 'GestureDetector / InkWell', value: 'Tap/drag handling; InkWell adds ripple.' },
        ],
      },
      {
        heading: 'Async & lists in UI',
        entries: [
          { label: 'FutureBuilder', value: 'Render a one-shot Future via AsyncSnapshot.' },
          { label: 'StreamBuilder', value: 'Render a live Stream of values.' },
          { label: 'RefreshIndicator', value: 'Pull-to-refresh wrapper around a scrollable.' },
          { label: 'SafeArea', value: 'Pads around notches, status bar, and system insets.' },
        ],
      },
    ],
  },
  {
    id: 'dart-syntax',
    title: 'Dart Syntax Essentials',
    subtitle: 'Dart 3.x language features you use constantly',
    icon: '🎯',
    sections: [
      {
        heading: 'Null safety',
        entries: [
          { label: 'Nullable type', value: 'String? name;  // may be null', code: true },
          { label: 'Null-aware access', value: 'user?.email  // null if user is null', code: true },
          { label: 'Default if null', value: 'name ?? "Guest"', code: true },
          { label: 'Assert non-null', value: 'value!  // throws if null — use sparingly', code: true },
          { label: 'late', value: 'late final Repo repo;  // init before first use', code: true },
        ],
      },
      {
        heading: 'Variables & functions',
        entries: [
          { label: 'Inferred / const', value: 'final x = 3; const pi = 3.14; // compile-time const', code: true },
          { label: 'Arrow fn', value: 'int square(int n) => n * n;', code: true },
          { label: 'Named + default args', value: 'void f({int page = 1, bool loud = false}) {}', code: true },
          { label: 'Required named', value: 'const Card({required this.title});', code: true },
          { label: 'Cascade', value: 'obj..a = 1..b = 2;  // operate on same object', code: true },
        ],
      },
      {
        heading: 'Async',
        entries: [
          { label: 'async / await', value: 'Future<User> load() async { return await api.get(); }', code: true },
          { label: 'Stream listen', value: 'stream.listen((event) { ... });', code: true },
          { label: 'Future.wait', value: 'await Future.wait([a(), b()]);  // parallel', code: true },
          { label: 'async* / yield', value: 'Stream<int> count() async* { yield 1; }', code: true },
        ],
      },
      {
        heading: 'Dart 3 collections & patterns',
        entries: [
          { label: 'Spread / collection-if', value: '[...items, if (loggedIn) LogoutButton()]', code: true },
          { label: 'Records', value: '(int, String) pair = (1, "a"); pair.$1;', code: true },
          { label: 'Pattern / destructure', value: 'final (id, name) = pair;', code: true },
          { label: 'Switch expression', value: 'final label = switch (status) { 0 => "off", _ => "on" };', code: true },
          { label: 'sealed class', value: 'sealed class Result {}  // exhaustive switch', code: true },
        ],
      },
    ],
  },
  {
    id: 'flutter-cli',
    title: 'Flutter & Dart CLI',
    subtitle: 'Commands for building, running, and shipping',
    icon: '⌨️',
    sections: [
      {
        heading: 'Project & run',
        entries: [
          { label: 'Create app', value: 'flutter create my_app', code: true },
          { label: 'Run', value: 'flutter run  # r=hot reload, R=hot restart', code: true },
          { label: 'Pick device', value: 'flutter run -d chrome  (flutter devices to list)', code: true },
          { label: 'Doctor', value: 'flutter doctor -v  # diagnose toolchain', code: true },
          { label: 'Analyze / format', value: 'flutter analyze  |  dart format .', code: true },
        ],
      },
      {
        heading: 'Packages',
        entries: [
          { label: 'Add dependency', value: 'flutter pub add dio', code: true },
          { label: 'Add dev dependency', value: 'flutter pub add --dev build_runner', code: true },
          { label: 'Get / upgrade', value: 'flutter pub get  |  flutter pub upgrade', code: true },
          { label: 'Outdated', value: 'flutter pub outdated', code: true },
          { label: 'Codegen (once/watch)', value: 'dart run build_runner build --delete-conflicting-outputs', code: true },
        ],
      },
      {
        heading: 'Test & clean',
        entries: [
          { label: 'Run tests', value: 'flutter test', code: true },
          { label: 'Coverage', value: 'flutter test --coverage', code: true },
          { label: 'Integration test', value: 'flutter test integration_test', code: true },
          { label: 'Clean build', value: 'flutter clean && flutter pub get', code: true },
        ],
      },
      {
        heading: 'Build & release',
        entries: [
          { label: 'Android App Bundle', value: 'flutter build appbundle --release', code: true },
          { label: 'Android APK', value: 'flutter build apk --release --split-per-abi', code: true },
          { label: 'iOS (no codesign)', value: 'flutter build ios --release --no-codesign', code: true },
          { label: 'Web', value: 'flutter build web --release', code: true },
          { label: 'Flavors / dart-define', value: 'flutter run --flavor prod --dart-define=ENV=prod', code: true },
        ],
      },
    ],
  },
  {
    id: 'layout-constraints',
    title: 'Layout & Constraints',
    subtitle: 'The rules that stop "unbounded height" errors',
    icon: '📐',
    sections: [
      {
        heading: 'The golden rule',
        entries: [
          { label: 'Flutter\'s layout', value: 'Constraints go DOWN. Sizes go UP. Parent sets position.' },
          { label: 'Constraint', value: 'A parent passes min/max width & height to each child.' },
          { label: 'A widget can\'t', value: 'know or decide its own position — only its size within constraints.' },
          { label: 'Tight vs loose', value: 'Tight = one allowed size; loose = anything up to a max.' },
        ],
      },
      {
        heading: 'Fixing common errors',
        entries: [
          { label: 'Unbounded height', value: 'ListView/Column inside Column → wrap child in Expanded or give a height.' },
          { label: 'Row overflow (yellow/black stripes)', value: 'Wrap flexible children in Expanded or Flexible; or use Wrap.' },
          { label: 'ListView in Column', value: 'Use Expanded, or set shrinkWrap: true (small lists only).', code: true },
          { label: 'Infinite width in Row', value: 'Give the child bounded width or use Expanded.' },
        ],
      },
      {
        heading: 'Flex & sizing',
        entries: [
          { label: 'Expanded', value: 'Forces a child to fill remaining main-axis space (flex).' },
          { label: 'Flexible', value: 'Lets a child take up to its content size, no more.' },
          { label: 'FittedBox', value: 'Scales/fits a child within the given box.' },
          { label: 'AspectRatio', value: 'Sizes a child to a width:height ratio.' },
          { label: 'IntrinsicHeight/Width', value: 'Match children\'s natural size — expensive, use rarely.' },
        ],
      },
      {
        heading: 'Debugging layout',
        entries: [
          { label: 'debugPaintSizeEnabled', value: 'Visualize boxes/padding: set true in main().', code: true },
          { label: 'LayoutBuilder', value: 'Read incoming constraints to build responsively.' },
          { label: 'MediaQuery.sizeOf', value: 'Screen size, padding, text scale (context-scoped).', code: true },
          { label: 'Flutter DevTools', value: 'Layout Explorer shows the constraint/flex tree live.' },
        ],
      },
    ],
  },
]
