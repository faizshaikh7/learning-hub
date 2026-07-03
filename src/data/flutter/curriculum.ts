import type { CurriculumTopic } from '@/types'
import { FLUTTER_EXTRA_TOPICS } from './curriculum-extra'
import { weaveTopics } from '@/lib/mergeCurriculum'

/** All Flutter/Dart curriculum topics — 62 topics across 8 phases. */
const FLUTTER_CURRICULUM_BASE: CurriculumTopic[] = [
  /* â”€â”€ PHASE 0: Dart Fundamentals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'flutter-intro', phase: 0, phaseName: 'Dart Fundamentals',
    orderIndex: 1, estimatedMins: 25, prerequisites: [],
    title: 'What is Flutter & How It Works',
    eli5: 'Flutter lets you write one app that runs on iPhone, Android, web, and desktop. Instead of using each platform\'s buttons and menus, Flutter paints every pixel itself — like bringing your own LEGO set instead of borrowing each house\'s furniture.',
    analogy: 'Native development is hiring two builders who each build the same house with local materials. Flutter is one builder with a 3D printer that prints the identical house anywhere.',
    explanation: 'Flutter is Google\'s UI toolkit for building natively compiled, multi-platform apps from a single Dart codebase. Unlike React Native (which bridges to native widgets), Flutter renders everything itself with its own engine (Impeller/Skia), giving identical pixels on every platform and excellent performance.',
    technicalDeep: 'Architecture layers: your Dart code → Flutter framework (widgets, rendering, animation libraries — all Dart) → Flutter engine (C++, Impeller graphics, text layout, Dart runtime) → platform embedder (iOS/Android/web/desktop glue). Compilation: dev mode uses JIT (enables sub-second hot reload — injects new code into the running Dart VM, preserving state); release mode compiles AOT to native ARM/x64 machine code. Everything on screen is a widget composed into a tree; Flutter diffs and repaints at up to 120fps.',
    whatBreaks: 'Assuming Flutter widgets ARE native widgets — they\'re drawn replicas, so brand-new iOS design changes need Flutter updates to appear. Heavy platform-specific features (advanced camera, background services) need platform channels. Web output is a canvas — SEO-hostile for content sites.',
    efficientWay: {
      title: 'Starting with Flutter',
      approaches: [
        { name: 'Build a real app while learning', verdict: 'best', reason: 'The freeCodeCamp notes-app path (auth → CRUD → cloud → release) teaches everything in context.' },
        { name: 'Widget-of-the-week videos + docs', verdict: 'ok', reason: 'Great supplements, but passive watching doesn\'t build muscle memory.' },
        { name: 'Learning all of Dart before touching Flutter', verdict: 'weak', reason: 'You need core Dart, but Dart sticks fastest when used inside real widgets.' }
      ],
      recommendation: 'Learn core Dart first (1-2 weeks max), then immediately build apps. Use hot reload aggressively — change, save, see it instantly. The feedback loop is Flutter\'s superpower.'
    },
    commonMistakes: [
      'Comparing Flutter to web dev — there\'s no HTML/CSS; layout is widget composition and constraints.',
      'Judging performance by debug builds — always profile in release/profile mode.',
      'Skipping the "everything is a widget" mental model and fighting the framework.'
    ],
    seniorNotes: 'In interviews, explain the rendering pipeline difference vs React Native: RN bridges JS to native widgets (serialization overhead, platform look); Flutter owns the canvas (consistent pixels, no bridge). Know when NOT to choose Flutter: content-heavy SEO sites, apps needing bleeding-edge platform APIs day one.',
    interviewQuestions: [
      'How does Flutter differ from React Native architecturally?',
      'What is the difference between JIT and AOT compilation in Flutter?',
      'How does hot reload work and what are its limits?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Minimal Flutter app (Dart)',
        code: `import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My First App',
      home: Scaffold(
        appBar: AppBar(title: const Text('Hello Flutter')),
        body: const Center(child: Text('Everything is a widget!')),
      ),
    );
  }
}`
      }
    ]
  },
  {
    id: 'dev-environment', phase: 0, phaseName: 'Dart Fundamentals',
    orderIndex: 2, estimatedMins: 40, prerequisites: ['flutter-intro'],
    title: 'Development Environment Setup',
    eli5: 'Before building apps you need your workshop set up: the Flutter tool itself, an editor (VS Code or Android Studio), and the simulators that pretend to be phones on your computer.',
    analogy: 'Setting up Flutter is like setting up a kitchen before cooking: stove (Flutter SDK), knives (IDE), and taste-testers (emulators). A well-set kitchen makes every future meal faster.',
    explanation: 'A complete Flutter environment includes: the Flutter SDK, platform toolchains (Xcode for iOS, Android Studio/SDK for Android), an IDE with Flutter plugins, device emulators, and developer accounts for eventual store releases. flutter doctor diagnoses what\'s missing.',
    technicalDeep: 'Install: download Flutter SDK, add to PATH, run flutter doctor and fix every ✗. iOS (Mac only): Xcode + CocoaPods + simulator. Android: Android Studio, SDK, accept licenses (flutter doctor --android-licenses), create an AVD. IDEs: VS Code (lightweight, great Flutter extension) or Android Studio (full-featured, built-in emulator controls). FVM (Flutter Version Management): pin Flutter versions per project — essential when maintaining multiple apps. DartPad: zero-install browser playground for Dart experiments. Developer accounts: Apple Developer ($99/yr), Google Play ($25 once) — register early, verification takes days.',
    whatBreaks: 'PATH not set → "flutter: command not found". Unaccepted Android licenses block builds. CocoaPods version conflicts break iOS builds. Different Flutter versions across team members cause "works on my machine" — FVM fixes this.',
    efficientWay: {
      title: 'Setting up efficiently',
      approaches: [
        { name: 'flutter doctor-driven setup', verdict: 'best', reason: 'Fix each ✗ it reports, in order. It tells you exactly what\'s missing.' },
        { name: 'VS Code + Flutter extension', verdict: 'best', reason: 'Fast, light, excellent debugging — most popular choice for Flutter.' },
        { name: 'Skipping emulators, using only a real device', verdict: 'ok', reason: 'Real devices are great, but you need emulators to test multiple screen sizes.' }
      ],
      recommendation: 'Use VS Code + Flutter extension, install FVM from your second project onward, and keep one Android emulator + (on Mac) one iOS simulator ready. Run flutter doctor after any OS/Xcode update.'
    },
    commonMistakes: [
      'Ignoring flutter doctor warnings — they always bite later, usually at build time.',
      'Not registering developer accounts early — Apple verification can take days.',
      'Editing platform files (ios/, android/) without understanding them — most config has a Flutter-side solution.'
    ],
    seniorNotes: 'Teams pin Flutter versions with FVM and commit .fvmrc so CI and every developer build with identical toolchains. Know your build artifacts: flutter build apk (universal), appbundle (Play Store), ipa (App Store).',
    interviewQuestions: [
      'What does flutter doctor check?',
      'Why would a team use FVM?',
      'What is the difference between an APK and an App Bundle?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'Environment setup commands',
        code: `# Verify everything is installed correctly
flutter doctor -v

# Accept Android licenses
flutter doctor --android-licenses

# List connected devices and emulators
flutter devices
flutter emulators --launch Pixel_7_API_34

# Create and run a new app
flutter create my_app
cd my_app
flutter run            # hot reload: press r, hot restart: R

# Pin Flutter version per-project with FVM
dart pub global activate fvm
fvm use 3.24.0
fvm flutter run`
      }
    ]
  },
  {
    id: 'dart-basics', phase: 0, phaseName: 'Dart Fundamentals',
    orderIndex: 3, estimatedMins: 45, prerequisites: ['dev-environment'],
    title: 'Dart Basics: Variables, Types & Functions',
    eli5: 'Dart is the language Flutter speaks. It looks a lot like JavaScript or Java: you make variables to store things, functions to do things, and types so the computer knows what kind of thing each variable holds.',
    analogy: 'If languages were vehicles, Dart is a modern hybrid: the familiarity of Java\'s structure with JavaScript\'s ease, plus type safety as standard airbags.',
    explanation: 'Dart is a statically-typed, object-oriented language with type inference. Core concepts: variables (var/final/const), built-in types (int, double, String, bool), functions (named/optional parameters, arrow syntax), and string interpolation. If you know JS/Java/Kotlin, Dart takes days, not weeks.',
    technicalDeep: 'var infers type at assignment and the type is then fixed (var x = 5; x = "hi" → error). final = set once at runtime; const = compile-time constant (deep-immutable, canonicalized). dynamic opts out of type checking — avoid. Numbers: int and double (both subtypes of num). Strings: single/double quotes, interpolation with $variable and ${expression}, multi-line with triple quotes. Functions are first-class objects: named parameters {required int a, int b = 0}, positional optional [int? c], arrow shorthand =>. Type system is sound: if it compiles to type T, it IS T at runtime.',
    whatBreaks: 'Using dynamic everywhere defeats the type system and moves errors to runtime. Confusing final vs const: const requires compile-time values (const now = DateTime.now() → error). Integer division: 5 / 2 is 2.5 (double); use 5 ~/ 2 for integer 2.',
    efficientWay: {
      title: 'Learning Dart fast',
      approaches: [
        { name: 'DartPad + the official language tour', verdict: 'best', reason: 'Zero setup, instant feedback, the tour covers everything in ~2 hours of doing.' },
        { name: 'Learn through Flutter code', verdict: 'ok', reason: 'Works, but framework noise obscures language fundamentals.' },
        { name: 'Deep-diving the language spec first', verdict: 'weak', reason: 'You need working knowledge, not specification mastery.' }
      ],
      recommendation: 'Spend one focused day in DartPad: variables, functions, classes, collections, null safety. Then everything in Flutter reads naturally.'
    },
    commonMistakes: [
      'Using var when final is correct — default to final; mutate only when needed.',
      'Forgetting ${} for expressions in interpolation: "$user.name" prints the object then ".name".',
      'Declaring dynamic instead of proper types — you lose autocomplete and compile-time safety.'
    ],
    seniorNotes: 'Idiomatic Dart: prefer final everywhere, use expression bodies (=>) for one-liners, named parameters for any function with 2+ args. The analyzer + lints (flutter_lints package) enforce most of this — turn them on day one.',
    interviewQuestions: [
      'What is the difference between final and const in Dart?',
      'How do named and positional optional parameters differ?',
      'What does it mean that Dart\'s type system is "sound"?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Dart fundamentals (Dart)',
        code: `// Variables
var inferred = 'Dart infers String';
final runtimeOnce = DateTime.now();   // set once at runtime
const compileTime = 3.14159;          // compile-time constant

// Functions: named params with defaults, arrow syntax
String greet({required String name, String greeting = 'Hello'}) =>
    '$greeting, $name!';

// Positional optional
int add(int a, int b, [int c = 0]) => a + b + c;

void main() {
  print(greet(name: 'Faiz'));            // Hello, Faiz!
  print(add(1, 2, 3));                   // 6
  print('Sum is \${add(1, 2)}');          // interpolation
  print(5 ~/ 2);                          // 2 (integer division)
  print(5 / 2);                           // 2.5 (always double)
}`
      }
    ]
  },
  {
    id: 'dart-control-flow', phase: 0, phaseName: 'Dart Fundamentals',
    orderIndex: 4, estimatedMins: 30, prerequisites: ['dart-basics'],
    title: 'Control Flow & Operators',
    eli5: 'Control flow is how your program makes decisions and repeats things: "if it\'s raining, take an umbrella", "for each item in the cart, add its price". Dart has the classics plus some powerful shortcuts.',
    analogy: 'Control flow statements are traffic signals for your code: if/else are forks in the road, loops are roundabouts, switch is a multi-exit junction, and break/continue are emergency exits.',
    explanation: 'Dart provides if/else, for, while, do-while, switch (with powerful pattern matching since Dart 3), and the operators you expect — plus Dart-specific ones: ?? (null-coalescing), ?. (null-aware access), .. (cascade), and the ternary you\'ll use constantly in widget code.',
    technicalDeep: 'Switch in Dart 3 supports patterns: matching shapes of data, destructuring records, guards with when. No fall-through — each case is exhaustiveness-checked for enums and sealed classes (compiler error if you miss a case — superb for state management). Operators: ?? returns left if non-null else right; ??= assigns only if null; ?. short-circuits on null; .. cascade calls multiple methods on the same object; spread ... and collection-if/for inside list literals power dynamic widget lists.',
    whatBreaks: 'Forgetting exhaustiveness when adding a new enum value — the compiler catches it for switch but not if/else chains. Ternaries nested 3 deep in widget code — extract a method instead. Infinite while loops freeze the UI (Dart UI is single-threaded).',
    efficientWay: {
      title: 'Mastering control flow',
      approaches: [
        { name: 'Switch patterns for state handling', verdict: 'best', reason: 'Exhaustive switches over sealed states make missing-case bugs impossible — the compiler enforces it.' },
        { name: 'Collection-if/for in widget lists', verdict: 'best', reason: 'Build conditional UI lists declaratively without .add() imperative noise.' },
        { name: 'Nested ternaries for complex UI logic', verdict: 'weak', reason: 'Unreadable past one level; extract helper methods or use switch expressions.' }
      ],
      recommendation: 'Learn switch expressions and collection-if/for early — they\'re the idioms that make Flutter UI code clean, and most tutorials underteach them.'
    },
    commonMistakes: [
      'Using == on doubles for equality — floating point precision makes this unreliable.',
      'Ignoring the cascade operator and repeating obj.a(); obj.b(); obj.c();.',
      'Writing imperative list-building when collection-for does it inline.'
    ],
    seniorNotes: 'Dart 3 pattern matching transformed state handling: switch (state) { case Loading(): …; case Loaded(:final data): …; case Error(:final message): … } with sealed classes gives compile-time guarantees that every UI state is handled. This is the foundation of robust BLoC code.',
    interviewQuestions: [
      'What does the ?? operator do?',
      'How do switch expressions with sealed classes improve state handling?',
      'What is the cascade operator and when is it useful?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Dart control flow idioms (Dart)',
        code: `// Null-aware operators
String? nickname;
final display = nickname ?? 'Anonymous';   // fallback if null
nickname ??= 'Guest';                       // assign only if null

// Switch expression with patterns (Dart 3)
sealed class UiState {}
class Loading extends UiState {}
class Loaded extends UiState { final List<String> items; Loaded(this.items); }
class Failed extends UiState { final String msg; Failed(this.msg); }

String describe(UiState state) => switch (state) {
  Loading() => 'Spinner…',
  Loaded(:final items) => '\${items.length} items',
  Failed(:final msg) => 'Error: $msg',
};  // compiler ERROR if a case is missing

// Collection-if and collection-for (everywhere in widget lists)
final isAdmin = true;
final menu = [
  'Home',
  'Profile',
  if (isAdmin) 'Admin Panel',
  for (final p in ['A', 'B']) 'Plugin $p',
];`
      }
    ]
  },
  {
    id: 'dart-collections', phase: 0, phaseName: 'Dart Fundamentals',
    orderIndex: 5, estimatedMins: 35, prerequisites: ['dart-control-flow'],
    title: 'Collections: Lists, Maps & Sets',
    eli5: 'Collections hold groups of things: a List is an ordered row of boxes, a Map is a dictionary where you look things up by name, and a Set is a bag that refuses duplicates.',
    analogy: 'A List is a numbered parking lot. A Map is a hotel front desk — give the key (room number), get the guest. A Set is a guest list — each name appears exactly once.',
    explanation: 'Lists, Maps, and Sets are the workhorses of every Flutter app: lists of messages, maps of JSON data, sets of selected IDs. Mastering their methods (map, where, fold, firstWhere) is mastering data manipulation in Dart.',
    technicalDeep: 'List<T>: ordered, indexed, growable by default. Map<K,V>: insertion-ordered hash map. Set<T>: unique elements, fast contains. Functional methods: .map() transforms (returns a lazy Iterable — call .toList()), .where() filters, .fold()/.reduce() aggregates, .firstWhere(orElse:), .any()/.every(), .expand() flat-maps. Spread ... and ...? (null-safe spread) merge collections. Records (Dart 3): lightweight tuples (int, String) and named ({int id, String name}) — great for returning multiple values without a class. Immutability: List.unmodifiable, const literals.',
    whatBreaks: 'Forgetting .toList() after .map() then wondering why the UI shows nothing (lazy Iterable never evaluated). Mutating a list while iterating it → ConcurrentModificationError. firstWhere without orElse → StateError crash when nothing matches.',
    efficientWay: {
      title: 'Working with collections',
      approaches: [
        { name: 'Functional chains (map/where/fold)', verdict: 'best', reason: 'Declarative, composable, and the standard idiom in Flutter codebases.' },
        { name: 'Classic for loops', verdict: 'ok', reason: 'Fine for complex multi-step logic; verbose for simple transforms.' },
        { name: 'Mutating shared lists from multiple places', verdict: 'weak', reason: 'Untrackable state changes — the root of many UI bugs. Prefer creating new lists.' }
      ],
      recommendation: 'Default to transformation over mutation: newList = old.where(...).map(...).toList(). This style feeds directly into state management patterns where immutable state is required.'
    },
    commonMistakes: [
      'map() without toList() in widget children — lazy Iterable never builds.',
      'Modifying state lists in place instead of copying — breaks change detection in Provider/BLoC.',
      'Using List when Set is correct (membership checks) — contains() is O(n) on List, O(1) on Set.'
    ],
    seniorNotes: 'Immutable collections are the contract of modern Flutter state management: BLoC and Riverpod compare old vs new state by equality, and in-place mutation makes old == new (no rebuild triggered). Always emit copies: state.copyWith(items: [...state.items, newItem]).',
    interviewQuestions: [
      'Why does map() return an Iterable and what is lazy evaluation?',
      'Why must state lists be copied rather than mutated in BLoC/Provider?',
      'When would you choose a Set over a List?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Collection operations (Dart)',
        code: `final cart = [
  {'name': 'Keyboard', 'price': 49.0, 'qty': 1},
  {'name': 'Mouse', 'price': 25.0, 'qty': 2},
  {'name': 'Monitor', 'price': 199.0, 'qty': 1},
];

// Transform + filter + aggregate
final names = cart.map((i) => i['name'] as String).toList();
final cheap = cart.where((i) => (i['price'] as double) < 100).toList();
final total = cart.fold<double>(
  0, (sum, i) => sum + (i['price'] as double) * (i['qty'] as int));
print('Total: \\$$total');   // Total: $298.0

// Records (Dart 3): return multiple values without a class
({double total, int count}) summarize(List<Map> items) =>
    (total: 298.0, count: items.length);

// Immutable update (the state-management idiom)
final selected = <String>{'a', 'b'};
final newSelected = {...selected, 'c'};   // new set, original untouched`
      }
    ]
  },
  {
    id: 'dart-null-safety', phase: 0, phaseName: 'Dart Fundamentals',
    orderIndex: 6, estimatedMins: 35, prerequisites: ['dart-basics'],
    title: 'Sound Null Safety',
    eli5: 'Null means "nothing here". The billion-dollar bug in most languages is using a value that turned out to be nothing. Dart makes you declare upfront whether a box can be empty — and stops you from opening possibly-empty boxes carelessly.',
    analogy: 'Null safety is like labeled cans: regular cans (String) are guaranteed to have food; cans marked with a question (String?) might be empty — the kitchen rules force you to check before pouring one into the pan.',
    explanation: 'Dart has sound null safety: types are non-nullable by default (String can never hold null), nullable types are explicit (String?), and the compiler enforces checks before use. NullPointerException-class crashes become compile errors instead of production incidents.',
    technicalDeep: 'Non-nullable by default: String s = null is a compile error. Nullable: String? s. Flow analysis promotes types: after if (s != null), s is treated as String inside the branch. Operators: ?. (safe access), ?? (default), ??= (assign-if-null), ! (assertion — "I promise it\'s not null"; throws at runtime if wrong). late: defer initialization of non-nullable fields (late final controller — set in initState); throws LateInitializationError if used before set. required for mandatory named params. Soundness: once checked, the runtime never re-checks — enabling compiler optimizations.',
    whatBreaks: 'The ! operator is a loaded gun: every user.name! is a potential runtime crash — prefer ?? or proper checks. Class fields can\'t be flow-promoted (another method may mutate between check and use) — copy to a local variable first. Abusing late as a "silence the compiler" tool reintroduces null crashes under a new name.',
    efficientWay: {
      title: 'Working with null safety',
      approaches: [
        { name: 'Model the domain to minimize nullables', verdict: 'best', reason: 'Most "nullable" fields actually have a sensible default or belong in a different state class.' },
        { name: 'Check-and-promote with local variables', verdict: 'best', reason: 'final name = user.name; if (name != null) { use(name); } — clean and compiler-verified.' },
        { name: 'Sprinkle ! until it compiles', verdict: 'weak', reason: 'Converts compile-time safety back into runtime crashes — the exact thing null safety prevents.' }
      ],
      recommendation: 'Treat every ! in code review as a question: "why can\'t this be designed away?" Aim for codebases where ! appears only with a comment explaining the invariant.'
    },
    commonMistakes: [
      'user!.profile!.avatar! chains — one null anywhere crashes; use user?.profile?.avatar ?? defaultAvatar.',
      'Expecting class field promotion — copy the field to a local first.',
      'late everywhere instead of restructuring initialization order.'
    ],
    seniorNotes: 'Sound null safety is why Dart 3 sealed-class state patterns work so well: instead of one Loaded class with nullable data and nullable error fields, model Loading/Loaded(data)/Failed(error) as separate types — impossible states become unrepresentable.',
    interviewQuestions: [
      'What makes Dart\'s null safety "sound"?',
      'When is the ! operator acceptable?',
      'Why doesn\'t type promotion work on class fields?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Null safety patterns (Dart)',
        code: `class User {
  final String name;
  final String? nickname;   // explicitly nullable
  User(this.name, {this.nickname});
}

void greet(User? user) {
  // Safe navigation + default
  print('Hi, \${user?.nickname ?? user?.name ?? 'stranger'}!');

  // Flow analysis: type promotion
  if (user != null) {
    print(user.name);   // user is User (not User?) in here
  }
}

class ProfilePage {
  // late: initialized in initState, guaranteed before use
  late final ScrollController controller;

  void initState() {
    controller = ScrollController();
  }
}

// Field promotion workaround: copy to local
class Repo {
  String? cache;
  void use() {
    final c = cache;          // local copy
    if (c != null) print(c.length);   // promotes fine
  }
}`
      }
    ]
  },
  {
    id: 'dart-oop', phase: 0, phaseName: 'Dart Fundamentals',
    orderIndex: 7, estimatedMins: 45, prerequisites: ['dart-null-safety'],
    title: 'Classes, Objects & Enums',
    eli5: 'A class is a blueprint (Car), an object is a thing built from it (my red Tesla). Enums are fixed multiple-choice lists (Small/Medium/Large). Flutter itself is just thousands of classes — every widget you use is one.',
    analogy: 'Classes are cookie cutters; objects are the cookies. Constructors decide the dough that goes in. Enums are the fixed flavor menu — you can\'t order a flavor that isn\'t on it.',
    explanation: 'Dart is deeply object-oriented: everything is an object (even numbers and functions). Understanding classes, constructors (default, named, factory, const), inheritance, interfaces, and enhanced enums is mandatory — every StatelessWidget you write is a subclass with an overridden method.',
    technicalDeep: 'Constructors: generative Person(this.name) with initializing formals; named Person.guest(); factory (can return cached instances or subtypes — used for singletons and fromJson); const constructors enable compile-time widget instances (huge for performance: const Text(\'hi\') is canonicalized and never rebuilt). Inheritance: extends (single), implements (any class is an implicit interface — must reimplement everything), with mixins (reusable behavior injection — TickerProviderStateMixin in animations). Enhanced enums (Dart 2.17+): fields, methods, constructors. Getters/setters, @override, toString, == and hashCode overriding (or use Equatable package).',
    whatBreaks: 'Forgetting ==/hashCode overrides → two identical-looking objects aren\'t equal → state comparisons fail, Sets hold duplicates, BLoC emits "new" states that look the same. Deep inheritance hierarchies — Flutter favors composition (widgets containing widgets) over inheritance.',
    efficientWay: {
      title: 'Dart OOP for Flutter',
      approaches: [
        { name: 'Composition over inheritance', verdict: 'best', reason: 'Flutter\'s own design: complex widgets are built BY combining simple ones, not extending them.' },
        { name: 'Equatable/freezed for data classes', verdict: 'best', reason: 'Auto-generates ==, hashCode, copyWith — eliminates the most error-prone boilerplate.' },
        { name: 'Java-style deep class hierarchies', verdict: 'weak', reason: 'Fights the framework; Flutter widgets compose, they don\'t inherit features.' }
      ],
      recommendation: 'Learn constructors deeply (especially const and factory), use mixins when Flutter asks for them (TickerProvider), and adopt Equatable or freezed for every state/model class.'
    },
    commonMistakes: [
      'Missing const on constructors and widget instantiations — loses free performance.',
      'implements when extends was meant — implements forces reimplementing every member.',
      'Data classes without value equality — then if (newState == oldState) never works.'
    ],
    seniorNotes: 'factory constructors power two key patterns: Model.fromJson(Map json) for API parsing, and singletons (factory Db() => _instance). const constructors matter at scale: a const widget subtree is skipped entirely during rebuilds — measurable jank reduction in long lists.',
    interviewQuestions: [
      'What is a factory constructor and when do you use one?',
      'Why do const constructors improve Flutter performance?',
      'extends vs implements vs with — explain the differences.'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Dart classes & enums (Dart)',
        code: `// Data class with named + factory constructors
class Note {
  final String id;
  final String text;
  const Note({required this.id, required this.text});

  // factory for JSON parsing — the API-model idiom
  factory Note.fromJson(Map<String, dynamic> json) =>
      Note(id: json['id'], text: json['text']);

  Map<String, dynamic> toJson() => {'id': id, 'text': text};

  // copyWith — immutable update pattern
  Note copyWith({String? text}) => Note(id: id, text: text ?? this.text);

  @override
  bool operator ==(Object other) =>
      other is Note && other.id == id && other.text == text;
  @override
  int get hashCode => Object.hash(id, text);
}

// Enhanced enum with fields and methods
enum Plan {
  free(price: 0), pro(price: 9.99), team(price: 29.99);
  final double price;
  const Plan({required this.price});
  bool get isPaid => price > 0;
}`
      }
    ]
  },
  {
    id: 'dart-advanced', phase: 0, phaseName: 'Dart Fundamentals',
    orderIndex: 8, estimatedMins: 45, prerequisites: ['dart-oop', 'dart-collections'],
    title: 'Advanced Dart: Generics, Mixins & Functional',
    eli5: 'Advanced Dart is the power-tool drawer: generics let one class work with any type safely, mixins let you share abilities between unrelated classes, and functional programming treats functions like ingredients you pass around.',
    analogy: 'Generics are adjustable wrenches — one tool, any bolt size, still a perfect grip. Mixins are skill badges — any scout (class) can earn the "swimming" badge without being in the swim-team family tree.',
    explanation: 'These features appear constantly in real Flutter code: generics in Future<T> and List<Widget>, mixins in TickerProviderStateMixin, extension methods on BuildContext, and functions-as-values in every onPressed callback. Mastering them is the difference between copying snippets and understanding them.',
    technicalDeep: 'Generics: class Cache<T> { T? value; } with constraints <T extends num>. Generic methods: T pick<T>(List<T> list). Mixins: mixin Logger { void log(String m) => print(m); } applied with with; can declare on SomeClass to restrict usage. Extension methods: extension on String { bool get isEmail => contains(\'@\'); } — add capabilities to types you don\'t own (context.screenWidth is the famous Flutter use). First-class functions: typedef Validator = String? Function(String?); closures capture variables. Sealed classes (Dart 3): compiler knows every subtype → exhaustive switches. Lambdas and higher-order functions everywhere.',
    whatBreaks: 'Overusing dynamic in generics (Cache<dynamic>) silently disables type safety. Mixin ordering matters — with A, B: B overrides A on conflicts. Extension method conflicts when two imports add the same name — resolve with import show/hide.',
    efficientWay: {
      title: 'Learning advanced Dart',
      approaches: [
        { name: 'Learn each feature from its Flutter use case', verdict: 'best', reason: 'TickerProviderStateMixin teaches mixins, Future<T> teaches generics — the framework is the textbook.' },
        { name: 'Extensions for context shortcuts', verdict: 'best', reason: 'context.theme, context.push() — clean codebases define these on day one.' },
        { name: 'Forcing functional purity everywhere', verdict: 'weak', reason: 'Dart is multi-paradigm; idiomatic Flutter mixes OOP structure with functional transforms.' }
      ],
      recommendation: 'Write one generic class, one mixin, and one extension on BuildContext as practice. Then sealed classes + exhaustive switch — that combination is modern Flutter state handling.'
    },
    commonMistakes: [
      'Ignoring generics and using List<dynamic> from JSON without casting.',
      'Putting shared logic in a base class when a mixin is more flexible.',
      'Writing utils.dart helper functions where an extension method reads naturally.'
    ],
    seniorNotes: 'Sealed classes + pattern matching replaced many enum+if chains: sealed class AuthState with subclasses, switched exhaustively in the UI. Combined with freezed for codegen, this is the dominant 2024+ Flutter architecture idiom.',
    interviewQuestions: [
      'What problem do generics solve? Give a Flutter example.',
      'How does a mixin differ from an abstract class?',
      'What are extension methods and when would you create one?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Generics, mixins, extensions (Dart)',
        code: `// Generic Result type with sealed classes
sealed class Result<T> {}
class Success<T> extends Result<T> { final T data; Success(this.data); }
class Failure<T> extends Result<T> { final String error; Failure(this.error); }

Future<Result<List<String>>> fetchNotes() async {
  try { return Success(['note1', 'note2']); }
  catch (e) { return Failure(e.toString()); }
}

// Mixin: reusable capability
mixin Logging {
  void log(String msg) => print('[\$runtimeType] $msg');
}
class NotesService with Logging {
  void save() => log('saving…');
}

// Extension methods: the BuildContext idiom
extension ContextX on BuildContext {
  ThemeData get theme => Theme.of(this);
  double get screenWidth => MediaQuery.of(this).size.width;
  void showSnack(String msg) => ScaffoldMessenger.of(this)
      .showSnackBar(SnackBar(content: Text(msg)));
}
// Usage anywhere: context.showSnack('Saved!');`
      }
    ]
  },
  {
    id: 'dart-async', phase: 0, phaseName: 'Dart Fundamentals',
    orderIndex: 9, estimatedMins: 50, prerequisites: ['dart-advanced'],
    title: 'Async Dart: Futures, Streams & Isolates',
    eli5: 'Your app can\'t freeze while waiting for the internet. A Future is a promise of "one value, later". A Stream is a tap delivering "many values over time". Isolates are separate workers for truly heavy jobs.',
    analogy: 'A Future is ordering one pizza — it arrives once. A Stream is a pizza subscription — deliveries keep coming until you cancel. An Isolate is hiring a second cook with their own kitchen so yours stays clean.',
    explanation: 'Async programming is unavoidable in Flutter: every network call, database read, and file access is async. Dart\'s single-threaded event loop plus async/await keeps UIs responsive; Streams power real-time data (Firestore listeners, BLoC); isolates handle CPU-heavy work without jank.',
    technicalDeep: 'Event loop: Dart runs one thread per isolate; await yields control so the UI keeps painting. Future<T>: then/catchError or async/await with try/catch. Future.wait([a, b]) for parallel awaits. Streams: single-subscription (default) vs broadcast (many listeners). Create with async* + yield, transform with map/where/debounce (rxdart). StreamController for manual control — always close() it. await for to consume. Isolates: true parallelism with no shared memory — communicate via messages. Isolate.run(() => heavyParse(json)) (Dart 2.19+) or compute() in Flutter for one-off background work. Use for: JSON parsing >100KB, image processing, crypto.',
    whatBreaks: 'Blocking the event loop with synchronous heavy work → frozen UI and dropped frames (jank). Forgetting await → fire-and-forget bugs where errors vanish. Unclosed StreamControllers/subscriptions → memory leaks. Calling setState after the widget was disposed (async completes late) → crash; check mounted.',
    efficientWay: {
      title: 'Async patterns',
      approaches: [
        { name: 'async/await with try/catch everywhere', verdict: 'best', reason: 'Reads like synchronous code; error handling is explicit and local.' },
        { name: '.then() chains', verdict: 'ok', reason: 'Works but nests badly; await is cleaner for multi-step flows.' },
        { name: 'Isolates for everything "slow"', verdict: 'weak', reason: 'Network waits are NOT CPU work — they don\'t block the loop. Isolates are only for compute-heavy tasks.' }
      ],
      recommendation: 'Default to async/await. Reach for Streams when data arrives repeatedly (auth state, Firestore). Reach for Isolate.run only when profiling shows a CPU-bound frame drop.'
    },
    commonMistakes: [
      'Marking everything async "just in case" — only when you actually await.',
      'Not cancelling StreamSubscriptions in dispose() — leaks and ghost callbacks.',
      'Using setState after await without checking mounted.'
    ],
    seniorNotes: 'Understand WHY await doesn\'t freeze the UI (cooperative yielding on one thread) vs why heavy JSON parsing DOES (no yield points). The interview classic: "Dart is single-threaded — how does it stay responsive during network calls?" Answer: the I/O happens outside the Dart thread; the event loop just gets notified.',
    interviewQuestions: [
      'How can Dart be single-threaded yet handle concurrent network requests?',
      'Single-subscription vs broadcast streams — what\'s the difference?',
      'When do you need an isolate instead of just await?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Futures, Streams, Isolates (Dart)',
        code: `// Future: one value later
Future<List<Note>> fetchNotes() async {
  final res = await http.get(Uri.parse('$api/notes'));
  if (res.statusCode != 200) throw Exception('Failed');
  return parseNotes(res.body);
}

// Parallel futures
final results = await Future.wait([fetchNotes(), fetchProfile()]);

// Stream: many values over time
Stream<int> countdown(int from) async* {
  for (var i = from; i >= 0; i--) {
    await Future.delayed(const Duration(seconds: 1));
    yield i;
  }
}
// Consume: await for (final n in countdown(5)) print(n);

// Isolate: CPU-heavy work off the UI thread
final notes = await Isolate.run(() => parseHugeJson(jsonString));

// The dispose + mounted discipline
StreamSubscription? _sub;
void initState() {
  _sub = authStateStream.listen((user) {
    if (mounted) setState(() => _user = user);
  });
}
void dispose() { _sub?.cancel(); }`
      }
    ]
  },

  /* â”€â”€ PHASE 1: Flutter Foundations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'flutter-project-setup', phase: 1, phaseName: 'Flutter Foundations',
    orderIndex: 10, estimatedMins: 35, prerequisites: ['dart-async'],
    title: 'Project Setup & Structure',
    eli5: 'flutter create gives you a folder full of files. Knowing what each one does — and where YOUR code should live — turns a confusing pile into an organized workshop.',
    analogy: 'A Flutter project is like a restaurant: lib/ is your kitchen (where you cook), pubspec.yaml is the supplier contract (ingredients you order), android/ and ios/ are the dining rooms you rarely redecorate.',
    explanation: 'Every Flutter project shares a standard layout: lib/ for Dart code (main.dart is the entry), pubspec.yaml for dependencies and assets, android//ios//web/ for platform shells, and test/ for tests. A scalable internal structure of lib/ is your responsibility — and it matters from day one.',
    technicalDeep: 'pubspec.yaml: dependencies (runtime), dev_dependencies (codegen, lints, tests), assets and fonts declarations — every asset must be listed or it won\'t bundle. flutter pub get installs; pubspec.lock pins exact versions (commit it for apps). Project structures: by-layer (screens/, widgets/, services/, models/) works for small apps; by-feature (features/auth/, features/notes/ — each with views, logic, data) scales better and matches team ownership. Entry flow: main() → runApp() → MaterialApp(routes/theme/home). iOS: bundle ID, signing via Xcode, Info.plist permissions. Android: applicationId in build.gradle, AndroidManifest permissions, minSdkVersion.',
    whatBreaks: 'Assets not declared in pubspec → runtime "Unable to load asset" crash. Wrong indentation in pubspec.yaml (it\'s YAML — spaces matter). Dumping every widget into main.dart — unmaintainable by week two. Renaming applicationId/bundle ID after release breaks updates.',
    efficientWay: {
      title: 'Structuring a project',
      approaches: [
        { name: 'Feature-first folders from the start', verdict: 'best', reason: 'features/auth, features/notes — code that changes together lives together; scales to teams.' },
        { name: 'Layer-first (screens/widgets/services)', verdict: 'ok', reason: 'Fine under ~10 screens; related code scatters across folders as the app grows.' },
        { name: 'Everything in main.dart until it hurts', verdict: 'weak', reason: 'It hurts at ~300 lines, and untangling later costs more than starting organized.' }
      ],
      recommendation: 'Adopt feature-first immediately: lib/features/<feature>/{presentation,logic,data}. Add lib/core/ for shared theme, constants, and extensions. Your future self (and team) will thank you.'
    },
    commonMistakes: [
      'Editing generated platform files when a pubspec/Flutter-side config exists.',
      'Not committing pubspec.lock for apps — teammates resolve different versions.',
      'Storing secrets in code or assets — use --dart-define or .env with gitignore.'
    ],
    seniorNotes: 'Set the foundations before feature one: flutter_lints enabled, CI running flutter analyze + flutter test, feature-first folders, and a core/theme.dart. Retrofitting structure on a grown codebase is a multi-week project; starting right is free.',
    interviewQuestions: [
      'How do you structure a Flutter project that will grow to 50+ screens?',
      'What is the difference between dependencies and dev_dependencies?',
      'Why commit pubspec.lock in an app but not in a package?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'Feature-first project structure',
        code: `lib/
â”œâ”€â”€ main.dart                  # entry: runApp + top-level providers
â”œâ”€â”€ core/
â”‚   â”œâ”€â”€ theme.dart             # ThemeData, colors, text styles
â”‚   â”œâ”€â”€ constants.dart
â”‚   â””â”€â”€ extensions.dart        # BuildContext shortcuts
â””â”€â”€ features/
    â”œâ”€â”€ auth/
    â”‚   â”œâ”€â”€ presentation/      # login_view.dart, register_view.dart
    â”‚   â”œâ”€â”€ logic/             # auth_bloc.dart / auth_provider.dart
    â”‚   â””â”€â”€ data/              # auth_service.dart, user_model.dart
    â””â”€â”€ notes/
        â”œâ”€â”€ presentation/
        â”œâ”€â”€ logic/
        â””â”€â”€ data/

# pubspec.yaml essentials
# dependencies:
#   flutter: { sdk: flutter }
#   http: ^1.2.0
# flutter:
#   assets:
#     - assets/images/
#   fonts:
#     - family: Inter
#       fonts: [{ asset: assets/fonts/Inter.ttf }]`
      }
    ]
  },
  {
    id: 'widgets-intro', phase: 1, phaseName: 'Flutter Foundations',
    orderIndex: 11, estimatedMins: 35, prerequisites: ['flutter-project-setup'],
    title: 'Widgets & The Widget Tree',
    eli5: 'In Flutter, EVERYTHING you see is a widget: text, buttons, padding, even the invisible centering of things. Widgets nest inside widgets, forming a tree — like Russian dolls describing your whole screen.',
    analogy: 'Widgets are LEGO bricks. A screen isn\'t one molded piece — it\'s thousands of small bricks (text, padding, rows) snapped together. Want rounded corners? Snap your content into a rounded-corner brick.',
    explanation: 'The widget is Flutter\'s unit of UI composition. Widgets are immutable descriptions ("configuration") of a piece of interface; Flutter turns the widget tree into actual pixels. UI development in Flutter = composing widget trees and letting the framework rebuild them efficiently when data changes.',
    technicalDeep: 'Three trees: Widget tree (your immutable configs, rebuilt cheaply all the time) → Element tree (mutable instances managing lifecycle and state, mostly stable) → RenderObject tree (layout + paint, expensive, reused aggressively). build() returns a new widget tree; Flutter diffs against the old one (by runtimeType + key) and only updates changed elements/render objects — this is why rebuilds are cheap. Core widgets: Container, Row/Column, Stack, Text, Image, Icon, Scaffold, Center, Padding, SizedBox, Expanded/Flexible. BuildContext: a widget\'s location in the tree — Theme.of(context) walks UP the tree to find data.',
    whatBreaks: 'Treating rebuilds as expensive and avoiding them with hacks — rebuilds are designed to be cheap; the render layer is what\'s smartly reused. Misunderstanding BuildContext: using a context from above a Provider/Navigator and wondering why .of() can\'t find it.',
    efficientWay: {
      title: 'Learning widgets',
      approaches: [
        { name: 'Compose small widgets into custom ones', verdict: 'best', reason: 'Extract any repeated pattern into its own widget class — this IS Flutter development.' },
        { name: 'Flutter Inspector to explore real trees', verdict: 'best', reason: 'Visualizes the tree of any running app — fastest way to internalize composition.' },
        { name: 'Memorizing the whole widget catalog', verdict: 'weak', reason: '~15 widgets cover 90% of UIs; learn the rest on demand.' }
      ],
      recommendation: 'Master the core 15 (Scaffold, Container, Row, Column, Stack, Text, Image, ListView, Padding, Center, SizedBox, Expanded, Icon, ElevatedButton, TextField), and practice extracting widget classes early and often.'
    },
    commonMistakes: [
      'Helper METHODS returning widgets instead of widget CLASSES — classes get const/diffing benefits, methods rebuild everything.',
      'Deep nesting without extraction — 8-level indented build methods are unreadable.',
      'Container for everything — SizedBox for spacing, Padding for padding; Container is heavier.'
    ],
    seniorNotes: 'The widget/element/render-object split is THE Flutter internals interview topic. Key insight: widgets are cheap immutable configs (recreate freely); elements persist and hold state; render objects do expensive layout/paint and are reused via the diff. Keys (ValueKey, GlobalKey) control how the diff matches up children — critical in reorderable lists.',
    interviewQuestions: [
      'Explain the widget, element, and render object trees.',
      'Why are widget rebuilds cheap in Flutter?',
      'What is BuildContext really?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Widget composition (Dart)',
        code: `// Extract repeated UI into widget classes (not helper methods)
class NoteCard extends StatelessWidget {
  final String title;
  final VoidCallback onTap;
  const NoteCard({super.key, required this.title, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: const Icon(Icons.note),
        title: Text(title),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}

// Compose into a screen
Scaffold(
  appBar: AppBar(title: const Text('My Notes')),
  body: Column(
    children: [
      const Padding(
        padding: EdgeInsets.all(16),
        child: Text('Recent'),
      ),
      NoteCard(title: 'Shopping list', onTap: () {}),
      NoteCard(title: 'Ideas', onTap: () {}),
    ],
  ),
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: const Icon(Icons.add),
  ),
)`
      }
    ]
  },
  {
    id: 'stateless-stateful-widgets', phase: 1, phaseName: 'Flutter Foundations',
    orderIndex: 12, estimatedMins: 40, prerequisites: ['widgets-intro'],
    title: 'StatelessWidget vs StatefulWidget',
    eli5: 'A StatelessWidget is a printed poster — it never changes once shown. A StatefulWidget is a whiteboard — it remembers things (state) and can redraw itself when those things change, like a counter going 1, 2, 3.',
    analogy: 'Stateless is a photo of a clock — always shows the same time. Stateful is an actual clock — it holds internal state (current time) and updates its display as that state changes.',
    explanation: 'StatelessWidget renders purely from its constructor inputs. StatefulWidget pairs an immutable widget with a mutable State object that survives rebuilds; calling setState() tells Flutter "my data changed — rebuild me". Knowing which to use, and the State lifecycle, is fundamental to everything that follows.',
    technicalDeep: 'StatefulWidget creates a State<T> via createState(); the State lives in the element tree and persists across widget rebuilds. Lifecycle: createState → initState (once — init controllers, subscriptions; no context-dependent lookups) → didChangeDependencies (after initState and when inherited deps change) → build (many times) → didUpdateWidget (parent rebuilt with new config) → dispose (cleanup — controllers, subscriptions; no setState after). setState(() {…}): mutate inside the callback, marks the element dirty, schedules rebuild of THIS subtree only. The mounted property guards async callbacks. const stateless widgets are skipped entirely during parent rebuilds.',
    whatBreaks: 'setState after dispose (late async result) → crash; guard with if (mounted). Heavy work inside build() — it runs often; build must be fast and side-effect free. Forgetting dispose() on AnimationControllers/TextEditingControllers → leaks. Initializing things needing context in initState → use didChangeDependencies.',
    efficientWay: {
      title: 'Choosing widget types',
      approaches: [
        { name: 'Default to StatelessWidget', verdict: 'best', reason: 'Most widgets just render inputs. Reach for State only when the widget itself owns changing data.' },
        { name: 'setState for local UI state only', verdict: 'best', reason: 'Toggles, animations, text input — local. App data (user, notes) belongs in state management, not setState.' },
        { name: 'StatefulWidget everywhere "to be safe"', verdict: 'weak', reason: 'Unneeded lifecycle complexity and lost const optimization.' }
      ],
      recommendation: 'Ask: "does this widget OWN data that changes over time?" No → Stateless. Yes, and it\'s purely local UI state → Stateful + setState. Yes, and other screens care → state management (Phase 3).'
    },
    commonMistakes: [
      'Calling setState outside its callback or after dispose.',
      'Doing network calls in build() — it runs on every rebuild; use initState/FutureBuilder.',
      'Recreating controllers in build() instead of initState — resets state every frame.'
    ],
    seniorNotes: 'The lifecycle question every Flutter interview asks: walk initState → didChangeDependencies → build → didUpdateWidget → dispose, and WHEN each fires. Bonus points: explain why State persists when the widget rebuilds (the element tree holds it; matched by type+key in the diff).',
    interviewQuestions: [
      'Walk through the complete StatefulWidget lifecycle.',
      'Why does setState only rebuild a subtree, not the whole app?',
      'When does didUpdateWidget fire and what is it for?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Stateful counter with lifecycle (Dart)',
        code: `class CounterPage extends StatefulWidget {
  const CounterPage({super.key});
  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _count = 0;
  late final TextEditingController _noteCtrl;

  @override
  void initState() {
    super.initState();
    _noteCtrl = TextEditingController();   // init ONCE here, never in build
  }

  @override
  void dispose() {
    _noteCtrl.dispose();                    // always clean up
    super.dispose();
  }

  void _increment() => setState(() => _count++);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Text('Count: $_count',
          style: Theme.of(context).textTheme.headlineMedium)),
      floatingActionButton: FloatingActionButton(
        onPressed: _increment, child: const Icon(Icons.add)),
    );
  }
}`
      }
    ]
  },
  {
    id: 'material-cupertino', phase: 1, phaseName: 'Flutter Foundations',
    orderIndex: 13, estimatedMins: 30, prerequisites: ['stateless-stateful-widgets'],
    title: 'Material & Cupertino Design',
    eli5: 'Material widgets make your app look like a Google/Android app; Cupertino widgets make it look like an iPhone app. Flutter ships both complete design systems — you pick the vibe, or mix them.',
    analogy: 'Material and Cupertino are two complete furniture catalogs for the same house. Most teams furnish everything from one catalog (Material) and maybe swap in a few iOS-style pieces where iPhone users expect them.',
    explanation: 'Material (Google\'s design language, now Material 3) is Flutter\'s primary widget set: Scaffold, AppBar, FloatingActionButton, Cards, dialogs, theming. Cupertino mirrors iOS: CupertinoNavigationBar, CupertinoButton, iOS-style switches and pickers. Most production apps use Material everywhere with platform-adaptive touches.',
    technicalDeep: 'MaterialApp sets up theming, navigation, localization, and Material behaviors; CupertinoApp is its iOS twin. Material 3 (useMaterial3: true, default since Flutter 3.16): ColorScheme.fromSeed(seedColor) generates a full palette from one brand color. Key Material widgets: Scaffold, AppBar, NavigationBar, FAB, Card, ListTile, SnackBar, Drawer, BottomSheet, dialogs. Cupertino: CupertinoPageScaffold, CupertinoTabBar, CupertinoAlertDialog, CupertinoDatePicker. Adaptive options: Switch.adaptive() renders per-platform; Theme.of(context).platform or Platform.isIOS for conditional widgets; page transitions adapt automatically (slide-from-right on iOS).',
    whatBreaks: 'Cupertino widgets inside MaterialApp lacking a CupertinoTheme look off. Mixing both styles on one screen confuses users. Hardcoding colors instead of using Theme/ColorScheme breaks dark mode and Material You theming.',
    efficientWay: {
      title: 'Choosing a design system',
      approaches: [
        { name: 'Material 3 everywhere + adaptive details', verdict: 'best', reason: 'One consistent system, with .adaptive() constructors and iOS transitions where users notice.' },
        { name: 'Full per-platform UI (Material AND Cupertino)', verdict: 'ok', reason: 'Maximum native feel, but near-double UI code — justified for few apps.' },
        { name: 'Custom design system ignoring both', verdict: 'ok', reason: 'Brands do this — but build ON Material theming rather than fighting it.' }
      ],
      recommendation: 'Use Material 3 with ColorScheme.fromSeed for instant cohesive theming. Add adaptive touches (Switch.adaptive, iOS back-swipe just works) rather than maintaining two UI trees.'
    },
    commonMistakes: [
      'Hardcoding Colors.blue instead of Theme.of(context).colorScheme.primary.',
      'Rebuilding iOS-style UI manually when CupertinoX widgets exist.',
      'Ignoring dark mode — define both theme and darkTheme from day one.'
    ],
    seniorNotes: 'Production theming discipline: every color from colorScheme, every text style from textTheme, defined once in core/theme.dart. This makes dark mode, rebrands, and white-labeling configuration changes instead of find-and-replace projects.',
    interviewQuestions: [
      'How do you support both light and dark themes cleanly?',
      'What does ColorScheme.fromSeed do in Material 3?',
      'How would you give iOS users platform-appropriate UI without duplicating screens?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Material 3 theming (Dart)',
        code: `MaterialApp(
  themeMode: ThemeMode.system,   // follow device setting
  theme: ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0EA5E9)),
  ),
  darkTheme: ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF0EA5E9),
      brightness: Brightness.dark,
    ),
  ),
  home: const HomePage(),
);

// Always consume via theme — never hardcode
Widget build(BuildContext context) {
  final colors = Theme.of(context).colorScheme;
  final text = Theme.of(context).textTheme;
  return Card(
    color: colors.surfaceContainerHighest,
    child: Text('Hello', style: text.titleLarge?.copyWith(color: colors.primary)),
  );
}

// Platform-adaptive controls
Switch.adaptive(value: isOn, onChanged: toggle)  // Material on Android, iOS style on iPhone`
      }
    ]
  },
  {
    id: 'styling-theming', phase: 1, phaseName: 'Flutter Foundations',
    orderIndex: 14, estimatedMins: 35, prerequisites: ['material-cupertino'],
    title: 'Styling: Containers, Decoration & Text',
    eli5: 'Styling in Flutter isn\'t CSS — you style by wrapping widgets in styling widgets. Want a blue rounded box with a shadow? Wrap your content in a Container with a BoxDecoration that describes all of that.',
    analogy: 'CSS styles are sticky labels you attach to elements. Flutter styles are gift boxes — you place your content inside a decorated box, and boxes inside boxes build up the look.',
    explanation: 'Visual styling flows through dedicated widgets and style objects: Container + BoxDecoration (color, gradient, border, radius, shadow), TextStyle for typography, Padding/SizedBox for spacing, ClipRRect for rounding anything. Consistency comes from pulling values out of ThemeData rather than scattering literals.',
    technicalDeep: 'Container combines: padding, margin, width/height, alignment, decoration, constraints. BoxDecoration: color, gradient (Linear/Radial), border, borderRadius, boxShadow, image, shape. Conflict rule: Container color and decoration are mutually exclusive (color goes inside decoration). TextStyle: fontSize, fontWeight, height (line-height multiplier), letterSpacing, color, fontFamily, shadows. Text scaling: respect user accessibility settings (MediaQuery.textScalerOf). WidgetStateProperty for button styles that vary by pressed/hovered/disabled. Component themes: ElevatedButtonThemeData, CardThemeData, InputDecorationTheme — style once in ThemeData, apply app-wide.',
    whatBreaks: 'Both color and decoration on Container → runtime assertion error. Fixed pixel font sizes ignoring textScaler → broken layouts for accessibility users. Styling each button inline → inconsistent UI and unmaintainable changes; component themes exist for this.',
    efficientWay: {
      title: 'Styling strategy',
      approaches: [
        { name: 'Central theme + component themes', verdict: 'best', reason: 'Define button/card/input styles once in ThemeData; every instance inherits. One-line restyle later.' },
        { name: 'Reusable styled wrapper widgets', verdict: 'best', reason: 'AppCard, PrimaryButton — your design system as widgets.' },
        { name: 'Inline styles on every widget', verdict: 'weak', reason: 'The 50-shades-of-your-brand-color problem; impossible to restyle consistently.' }
      ],
      recommendation: 'Create core/theme.dart in week one: ColorScheme, TextTheme, and component themes. Then build 3-5 branded wrapper widgets (AppButton, AppCard). Every screen after that styles itself.'
    },
    commonMistakes: [
      'Container with both color: and decoration: — assertion error at runtime.',
      'Margin via Container when the Padding widget is clearer.',
      'Magic numbers everywhere — extract spacing constants (8/16/24 scale).'
    ],
    seniorNotes: 'ThemeExtension<T> lets you add custom design tokens (success/warning colors, brand gradients) to ThemeData with proper light/dark variants and lerping. It\'s the professional answer to "where do non-Material design tokens live?"',
    interviewQuestions: [
      'How do you keep styling consistent across a large Flutter app?',
      'What is WidgetStateProperty and where does it appear?',
      'How do you add custom design tokens to the theme?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Decoration & component themes (Dart)',
        code: `// A decorated container
Container(
  padding: const EdgeInsets.all(16),
  decoration: BoxDecoration(
    gradient: const LinearGradient(colors: [Color(0xFF0EA5E9), Color(0xFF6366F1)]),
    borderRadius: BorderRadius.circular(16),
    boxShadow: [BoxShadow(
      color: Colors.black.withOpacity(0.2),
      blurRadius: 12, offset: const Offset(0, 4),
    )],
  ),
  child: const Text('Styled card',
      style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
)

// Style ALL buttons once — in ThemeData
ThemeData(
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      textStyle: const TextStyle(fontWeight: FontWeight.w600),
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
  ),
)`
      }
    ]
  },
  {
    id: 'assets-fonts-images', phase: 1, phaseName: 'Flutter Foundations',
    orderIndex: 15, estimatedMins: 25, prerequisites: ['flutter-project-setup'],
    title: 'Assets, Fonts & Images',
    eli5: 'Assets are the files your app ships with: pictures, custom fonts, icons, JSON files. You put them in folders, list them in pubspec.yaml, and Flutter bundles them inside the app.',
    analogy: 'Assets are the ingredients you pack for a camping trip — everything must go in the backpack (pubspec) before you leave. Forget to pack it, and you can\'t cook it at the campsite.',
    explanation: 'Flutter bundles declared assets into the app binary. Images load via Image.asset (bundled) or Image.network (remote); custom fonts are declared with family/weights; resolution-aware variants (2x/3x folders) serve the right density per device.',
    technicalDeep: 'Declare in pubspec under flutter: assets: (folder paths end with /) and fonts: (family + asset + weight). Resolution awareness: assets/img.png plus assets/2.0x/img.png and 3.0x/ — Flutter picks by devicePixelRatio. Image widget: fit (BoxFit.cover/contain), loadingBuilder, errorBuilder (always handle network failures). Network images: Image.network caches in memory only; cached_network_image adds disk cache + placeholders — the production standard. SVGs need flutter_svg. Other files: rootBundle.loadString(\'assets/config.json\'). Compress images before bundling — asset bloat is the top cause of fat APKs.',
    whatBreaks: 'Undeclared assets crash at runtime, not compile time. Huge uncompressed PNGs balloon app size past store cellular-download limits. Image.network without errorBuilder shows ugly errors on flaky connections. Wrong font weight declarations silently fall back to regular.',
    efficientWay: {
      title: 'Managing assets',
      approaches: [
        { name: 'cached_network_image for all remote images', verdict: 'best', reason: 'Disk caching, placeholders, fade-in — production-grade behavior for free.' },
        { name: 'WebP images + compression pipeline', verdict: 'best', reason: '30-70% smaller than PNG with equal quality; smaller APK, faster loads.' },
        { name: 'Bundling every image at full resolution', verdict: 'weak', reason: 'App size explodes; users on slow connections skip the download.' }
      ],
      recommendation: 'Compress everything (WebP where possible), provide 2x/3x variants for crisp rendering, use cached_network_image for remote content, and audit asset size before each release with flutter build apk --analyze-size.'
    },
    commonMistakes: [
      'Forgetting the trailing / when declaring a folder of assets.',
      'No errorBuilder/placeholder on network images.',
      'Bundling fonts with weights you never use — each weight file adds size.'
    ],
    seniorNotes: 'Asset discipline shows up in app-size reviews: flutter build appbundle --analyze-size produces a size treemap. Fonts and images dominate most bloated apps. Know google_fonts package: fetches fonts at runtime (no bundling) — great for prototyping, but bundle for offline-first production apps.',
    interviewQuestions: [
      'How does Flutter pick between 1x/2x/3x asset variants?',
      'How would you reduce a Flutter app\'s download size?',
      'Why use cached_network_image over Image.network?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Assets & images (Dart)',
        code: `// pubspec.yaml
// flutter:
//   assets:
//     - assets/images/        # whole folder (note trailing /)
//   fonts:
//     - family: Inter
//       fonts:
//         - asset: assets/fonts/Inter-Regular.ttf
//         - asset: assets/fonts/Inter-Bold.ttf
//           weight: 700

// Bundled image with resolution awareness (2.0x/3.0x auto-picked)
Image.asset('assets/images/logo.png', width: 120)

// Production network image
CachedNetworkImage(
  imageUrl: note.imageUrl,
  placeholder: (ctx, url) => const Center(child: CircularProgressIndicator()),
  errorWidget: (ctx, url, err) => const Icon(Icons.broken_image),
  fit: BoxFit.cover,
)

// Load a bundled JSON file
final config = await rootBundle.loadString('assets/config.json');
final data = jsonDecode(config);`
      }
    ]
  },
  {
    id: 'responsive-widgets', phase: 1, phaseName: 'Flutter Foundations',
    orderIndex: 16, estimatedMins: 35, prerequisites: ['styling-theming'],
    title: 'Responsive & Adaptive Design',
    eli5: 'Your app runs on tiny phones, big phones, tablets, and desktops. Responsive design means the layout flexes to fit — like water taking the shape of its container instead of overflowing.',
    analogy: 'A responsive layout is a stretchy waistband, not a fixed belt. MediaQuery tells you the waist size; Expanded and Flexible are the elastic; LayoutBuilder lets each section tailor itself to the space it actually got.',
    explanation: 'Flutter gives you the device\'s dimensions (MediaQuery), per-widget available space (LayoutBuilder), and flexible sizing primitives (Expanded, Flexible, FractionallySizedBox, AspectRatio). Responsive apps combine these with breakpoints to swap layouts — list on phones, side-by-side on tablets.',
    technicalDeep: 'MediaQuery.sizeOf(context): screen size (prefer over .of().size — rebuilds less). LayoutBuilder: constraints of THIS widget\'s slot — the right tool for component-level responsiveness. Expanded fills remaining flex space; Flexible can be smaller; flex: ratios divide space. Overflow: Row children exceeding width → yellow-black stripes in debug; fix with Expanded, Flexible, or scrolling. SafeArea avoids notches/status bars. OrientationBuilder for portrait/landscape. Breakpoint pattern: width < 600 phone, 600-1024 tablet, > 1024 desktop. Adaptive vs responsive: responsive = same UI scaled; adaptive = different UI per form factor (NavigationBar on phone → NavigationRail on tablet/desktop).',
    whatBreaks: 'Hardcoded widths overflow on small phones — the #1 beginner crash course in yellow stripes. Text in fixed-size containers breaks when users increase system font size. Designing only on your emulator — real-world devices range 320px to 1600px+ wide.',
    efficientWay: {
      title: 'Building responsive UIs',
      approaches: [
        { name: 'Flex-first (Expanded/Flexible), constraints second', verdict: 'best', reason: 'Most layouts need zero math — let flex distribute space, only branch on size for structural changes.' },
        { name: 'LayoutBuilder breakpoints for structure swaps', verdict: 'best', reason: 'Component decides its own layout from actual available space — composable and testable.' },
        { name: 'Pixel-perfect scaling of one design', verdict: 'weak', reason: 'Scaling a phone design to tablets wastes space; adaptive structure beats scaled structure.' }
      ],
      recommendation: 'Default to Row/Column + Expanded with zero fixed dimensions. Add one breakpoint helper (isPhone/isTablet) and swap structure — not sizes — at boundaries. Test at 320px width and with 1.5x text scale.'
    },
    commonMistakes: [
      'Fixed-width Rows that overflow — wrap children in Expanded/Flexible.',
      'Forgetting SafeArea — content hidden under notches and system bars.',
      'ListView inside Column without Expanded — unbounded height error.'
    ],
    seniorNotes: 'The "unbounded constraints" error family (RenderFlex overflow, viewport unbounded height) all trace to one model: constraints go DOWN, sizes go UP, parent positions. Internalize that sentence and 90% of layout errors become predictable. That model is also a top interview question.',
    interviewQuestions: [
      'Explain Flutter\'s constraint model: "constraints down, sizes up".',
      'Expanded vs Flexible — what\'s the difference?',
      'How would you adapt one codebase to phones AND tablets?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Responsive layout patterns (Dart)',
        code: `// Adaptive structure with LayoutBuilder
LayoutBuilder(builder: (context, constraints) {
  final isWide = constraints.maxWidth >= 600;
  return isWide
      ? Row(children: [
          const SizedBox(width: 280, child: NotesList()),
          const VerticalDivider(width: 1),
          Expanded(child: NoteDetail()),       // side-by-side on tablets
        ])
      : NotesList();                            // single column on phones
});

// Flex ratios: distribute space without math
Row(children: [
  Expanded(flex: 2, child: SearchField()),      // 2/3 of space
  const SizedBox(width: 12),
  Expanded(flex: 1, child: FilterButton()),     // 1/3 of space
])

// Respect notches and system UI
Scaffold(body: SafeArea(child: content))

// Screen-size helpers
extension Responsive on BuildContext {
  double get width => MediaQuery.sizeOf(this).width;
  bool get isPhone => width < 600;
  bool get isTablet => width >= 600 && width < 1024;
}`
      }
    ]
  },
  {
    id: 'git-for-flutter', phase: 1, phaseName: 'Flutter Foundations',
    orderIndex: 17, estimatedMins: 25, prerequisites: ['flutter-project-setup'],
    title: 'Git & GitHub for Flutter Projects',
    eli5: 'Git saves snapshots of your app as you build it — so you can experiment fearlessly and roll back mistakes. GitHub keeps that history online, backs it up, and later lets robots build and test your app automatically.',
    analogy: 'Building an app without Git is sculpting without photos of your progress — one bad cut and there\'s no going back. Git photographs every stage; GitHub puts the album safely in the cloud.',
    explanation: 'Every Flutter project should be a Git repo from minute one. Flutter adds specific considerations: a proper .gitignore (build artifacts, IDE files), committing pubspec.lock, never committing secrets/keystores, and later wiring GitHub Actions for automated builds. (Deep Git fundamentals live in the Backend track — this covers the Flutter-specific layer.)',
    technicalDeep: 'flutter create generates a solid .gitignore: /build/, .dart_tool/, .idea/, *.iml. Commit: pubspec.lock (apps — reproducible builds), android/ and ios/ platform folders (they hold real config). Never commit: keystores (*.jks, *.keystore), key.properties, .env files, App Store API keys. Generated code (*.g.dart, *.freezed.dart): teams differ — committing avoids requiring codegen on checkout; ignoring keeps diffs clean. Branching: feature branches per screen/feature; tag releases (v1.2.0) matching store versions for traceable rollbacks. Secrets at build time: --dart-define=KEY=value, read with String.fromEnvironment.',
    whatBreaks: 'Committing a keystore + key.properties to a public repo = anyone can sign as you. Losing the keystore (not backing it up anywhere safe) = you can NEVER update your Play Store app — store it in a password manager/secure vault. Messy repos with build/ committed → 100MB+ clones.',
    efficientWay: {
      title: 'Git hygiene for Flutter',
      approaches: [
        { name: 'Repo + first commit before any code', verdict: 'best', reason: 'flutter create → git init → commit. A clean baseline makes every later diff meaningful.' },
        { name: 'Secrets via --dart-define + CI secrets', verdict: 'best', reason: 'Keys live in the build environment, never in history.' },
        { name: 'Adding Git "once the app works"', verdict: 'weak', reason: 'You\'ll want to undo something on day two — without Git, you can\'t.' }
      ],
      recommendation: 'Initialize Git immediately after flutter create, verify .gitignore covers build artifacts, set up the GitHub repo, and store your release keystore in a secure vault — never in the repo, never ONLY on your laptop.'
    },
    commonMistakes: [
      'Committing google-services.json / keystores to public repos.',
      'Not backing up the Android keystore — losing it permanently locks you out of app updates.',
      'Giant commits mixing dependency bumps with features.'
    ],
    seniorNotes: 'The keystore story is the one that ends careers: a lost release keystore means your published Android app can never be updated under the same listing (Play App Signing mitigates this — enroll in it). Treat signing assets like production database credentials.',
    interviewQuestions: [
      'What should and shouldn\'t be committed in a Flutter repo?',
      'How do you keep API keys out of a Flutter app\'s Git history?',
      'What happens if you lose your Android release keystore?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'Flutter repo setup',
        code: `flutter create notes_app && cd notes_app
git init
git add . && git commit -m "chore: fresh flutter create"

# Extra ignores for secrets (append to .gitignore)
cat >> .gitignore << 'EOF'
# Secrets & signing
*.jks
*.keystore
android/key.properties
.env
EOF

# Secrets via dart-define instead of hardcoding
flutter run --dart-define=API_KEY=dev_key_here
# In Dart: const apiKey = String.fromEnvironment('API_KEY');

# Tag releases to match store versions
git tag v1.0.0 && git push origin v1.0.0`
      }
    ]
  },

  /* â”€â”€ PHASE 2: UI Building & Navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'layouts-constraints', phase: 2, phaseName: 'UI Building & Navigation',
    orderIndex: 18, estimatedMins: 40, prerequisites: ['responsive-widgets'],
    title: 'Layouts & The Constraint Model',
    eli5: 'Flutter layout is a negotiation: parents tell children how big they\'re ALLOWED to be (constraints), children answer how big they WANT to be (size), and parents decide WHERE they go (position).',
    analogy: 'It\'s like a parking garage: the garage tells your car the maximum space available (constraints), your car takes the space it needs (size), and the attendant decides which spot you get (position).',
    explanation: 'One rule governs all Flutter layout: constraints go down, sizes go up, parent sets position. Every confusing layout behavior — why Container ignores its width, why ListView crashes in Column, why Expanded fixes overflows — is this rule in action. Master it and layout becomes predictable.',
    technicalDeep: 'Constraints are min/max width/height passed down. Tight constraints (min == max) force a size — that\'s why a Container in the screen root fills everything (Scaffold passes tight constraints). Unbounded constraints (max = infinity) come from scrollables — a ListView gives children infinite height; a child that wants "all available height" crashes. Row/Column: lay out non-flex children first with unbounded main-axis, then divide remaining space among Expanded/Flexible by flex factor. Common fixes: Expanded (take remaining space), SizedBox (fixed), ConstrainedBox/LimitedBox (add bounds), IntrinsicHeight (size to child — expensive), Align/Center (loosen tight constraints).',
    whatBreaks: 'ListView inside Column → "Vertical viewport was given unbounded height" — wrap in Expanded. Container with width: 200 inside a tight-constraint parent ignores your width (tight wins). Row with unbounded-width children (TextField) → "BoxConstraints forces an infinite width" — wrap in Expanded.',
    efficientWay: {
      title: 'Debugging layout',
      approaches: [
        { name: 'Learn the rule + Flutter Inspector', verdict: 'best', reason: 'Inspector shows actual constraints/sizes per widget — turns mystery errors into visible logic.' },
        { name: 'debugPaintSizeEnabled = true', verdict: 'ok', reason: 'Paints layout bounds on screen — quick visual check of what\'s where.' },
        { name: 'Randomly wrapping things in Expanded until it works', verdict: 'weak', reason: 'Sometimes works, never teaches — same bug returns next week.' }
      ],
      recommendation: 'Read "Understanding constraints" on docs.flutter.dev once — the single highest-ROI hour in Flutter education. Then use Inspector whenever a layout surprises you.'
    },
    commonMistakes: [
      'ListView/GridView inside Column without Expanded — unbounded height crash.',
      'Expecting width/height on Container to always win — tight parent constraints override.',
      'IntrinsicHeight/IntrinsicWidth everywhere — O(n²) layout cost; use sparingly.'
    ],
    seniorNotes: '"Explain Flutter\'s constraint model" is a standard interview question. The expert answer covers: constraints down / sizes up / parent positions, tight vs loose vs unbounded constraints, why scrollables create unbounded constraints, and how Expanded works inside flex layout (it imposes tight constraints from the leftover space).',
    interviewQuestions: [
      'Why does a ListView inside a Column crash, and what are two fixes?',
      'Why might a Container ignore its width parameter?',
      'What are tight vs loose vs unbounded constraints?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Constraint fixes (Dart)',
        code: `// BROKEN: unbounded height crash
// Column(children: [ListView(...)])

// FIX: Expanded gives the ListView bounded height
Column(children: [
  const Text('My Notes'),
  Expanded(
    child: ListView.builder(
      itemCount: notes.length,
      itemBuilder: (ctx, i) => NoteCard(note: notes[i]),
    ),
  ),
])

// BROKEN: TextField in Row → infinite width error
// Row(children: [TextField()])

// FIX: Expanded bounds the width
Row(children: [
  const Icon(Icons.search),
  const SizedBox(width: 8),
  Expanded(child: TextField(decoration: InputDecoration(hintText: 'Search'))),
])

// Why Container "ignores" width: tight constraints win.
// Loosen them with Align/Center:
Center(child: Container(width: 200, height: 100, color: Colors.blue))`
      }
    ]
  },
  {
    id: 'scrollable-widgets', phase: 2, phaseName: 'UI Building & Navigation',
    orderIndex: 19, estimatedMins: 35, prerequisites: ['layouts-constraints'],
    title: 'ListView, GridView & Scrolling',
    eli5: 'Phone screens are small but lists are long. ListView and GridView show scrolling content — and the .builder versions are smart enough to only build the items currently on screen, even for a million-item list.',
    analogy: 'ListView.builder is a conveyor-belt sushi restaurant: plates (widgets) are made just before they reach you and recycled after they pass. A plain Column would cook all 10,000 plates up front.',
    explanation: 'Scrollables are the backbone of most screens: ListView (linear), GridView (grid), and their lazy .builder constructors that virtualize rendering. CustomScrollView with slivers handles advanced effects (collapsing app bars, mixed lists and grids in one scroll).',
    technicalDeep: 'ListView.builder(itemCount, itemBuilder): builds only visible items + a small cache window (cacheExtent); elements/render objects are recycled as you scroll. ListView.separated adds dividers cleanly. GridView.builder with SliverGridDelegateWithFixedCrossAxisCount (n columns) or MaxCrossAxisExtent (responsive column count). shrinkWrap: true measures all children — defeats laziness, O(n); avoid in long lists. Nested scrolling: NestedScrollView for app-bar + tabs scenarios. Slivers: CustomScrollView([SliverAppBar(pinned/floating), SliverList, SliverGrid]) — everything composable in one scroll viewport. Infinite scroll: listen to ScrollController, fetch more when position.pixels nears maxScrollExtent. Keys in lists: ValueKey(item.id) keeps state attached to the right item across reorders.',
    whatBreaks: 'Using ListView(children: [...10000 items]) builds everything immediately — jank and memory spikes; always .builder for dynamic lists. shrinkWrap+NeverScrollableScrollPhysics nested in another scrollable as a "fix" — works but loses virtualization. Missing keys on stateful list items → state (checkboxes, text) sticks to positions, not items.',
    efficientWay: {
      title: 'Building lists',
      approaches: [
        { name: 'ListView.builder for anything dynamic', verdict: 'best', reason: 'Lazy by default; scales from 10 to 1M items with constant memory.' },
        { name: 'Slivers for complex scroll effects', verdict: 'best', reason: 'Collapsing headers, mixed content — slivers are the proper tool, not stacked hacks.' },
        { name: 'shrinkWrap everywhere to silence errors', verdict: 'weak', reason: 'Hides the constraint problem by measuring all children — performance debt.' }
      ],
      recommendation: 'ListView.builder + Expanded covers 90% of list screens. Learn one sliver recipe (SliverAppBar + SliverList) for the fancy screens. Add ValueKey(item.id) the moment list items hold any state.'
    },
    commonMistakes: [
      'Non-builder ListView for API data — builds the entire list up front.',
      'shrinkWrap: true on long lists — O(n) layout every frame.',
      'Forgetting itemExtent/prototypeItem when rows are fixed-height — free scroll performance.'
    ],
    seniorNotes: 'List performance checklist for jank: .builder constructor, const item widgets where possible, itemExtent if fixed height, cached_network_image for thumbnails, RepaintBoundary around complex items, and no Opacity/ClipRRect per-item when avoidable. Profile with DevTools — don\'t guess.',
    interviewQuestions: [
      'How does ListView.builder achieve constant memory on huge lists?',
      'Why is shrinkWrap: true a performance concern?',
      'How would you implement infinite scroll with pagination?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Lists, grids, infinite scroll (Dart)',
        code: `// Lazy list with separators
ListView.separated(
  itemCount: notes.length,
  separatorBuilder: (_, __) => const Divider(height: 1),
  itemBuilder: (ctx, i) => NoteTile(key: ValueKey(notes[i].id), note: notes[i]),
)

// Responsive grid: as many 180px columns as fit
GridView.builder(
  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
    maxCrossAxisExtent: 180, mainAxisSpacing: 12, crossAxisSpacing: 12),
  itemCount: photos.length,
  itemBuilder: (ctx, i) => PhotoCard(photo: photos[i]),
)

// Infinite scroll
final _ctrl = ScrollController();
void initState() {
  super.initState();
  _ctrl.addListener(() {
    if (_ctrl.position.pixels > _ctrl.position.maxScrollExtent - 300) {
      _loadNextPage();   // debounce/guard against duplicate fetches
    }
  });
}

// Collapsing header with slivers
CustomScrollView(slivers: [
  const SliverAppBar(pinned: true, expandedHeight: 200,
    flexibleSpace: FlexibleSpaceBar(title: Text('Notes'))),
  SliverList.builder(itemCount: 50, itemBuilder: (c, i) => NoteTile(i)),
])`
      }
    ]
  },
  {
    id: 'forms-input', phase: 2, phaseName: 'UI Building & Navigation',
    orderIndex: 20, estimatedMins: 35, prerequisites: ['stateless-stateful-widgets'],
    title: 'Forms, TextFields & Validation',
    eli5: 'Forms are how users type things into your app — login screens, sign-ups, search bars. Flutter gives you TextField for input and Form/TextFormField to check that what users typed makes sense before accepting it.',
    analogy: 'A Form is a passport control desk: each TextFormField is one document check (validator), and form.validate() is the officer reviewing everything before stamping approval (submit).',
    explanation: 'Text input flows through TextEditingController (read/set value), focus through FocusNode, and validation through Form + TextFormField validators. The registration/login screens of every app — including the course\'s notes app — are built from exactly these pieces.',
    technicalDeep: 'TextEditingController: .text to read/write, .addListener for changes; create in initState, dispose in dispose. TextField vs TextFormField: the latter integrates with Form for validation. Form with GlobalKey<FormState>: formKey.currentState!.validate() runs all validators (return null = valid, String = error shown), .save() triggers onSaved. Validators compose: required → format (email regex) → length. keyboardType (emailAddress, number, phone), textInputAction (next/done) + onFieldSubmitted with FocusScope.of(context).nextFocus() for field-to-field flow. obscureText for passwords. autovalidateMode: onUserInteraction shows errors as users type (after first interaction). InputDecoration: label, hint, errorText, prefix/suffix icons (password visibility toggle).',
    whatBreaks: 'Controllers created in build() — wiped every rebuild, cursor jumps, state lost. Forgetting controller/focusNode dispose — leaks. Validating only client-side — servers must re-validate everything (client checks are UX, not security). Submitting without unfocusing — keyboard stays up over the loading state.',
    efficientWay: {
      title: 'Building forms',
      approaches: [
        { name: 'Form + TextFormField + validators', verdict: 'best', reason: 'Declarative validation, integrated error display, one-call validate-all.' },
        { name: 'Raw TextFields + manual checks', verdict: 'ok', reason: 'Fine for one-field cases (search); reinvents Form for real forms.' },
        { name: 'Validate only on submit, no field feedback', verdict: 'weak', reason: 'Users fix five errors one resubmit at a time — frustrating UX.' }
      ],
      recommendation: 'Standard recipe: Form + GlobalKey, TextFormField per input, autovalidateMode.onUserInteraction, extract reusable validators (Validators.email, Validators.minLength(8)), disable the submit button while processing.'
    },
    commonMistakes: [
      'TextEditingController created in build() instead of initState.',
      'No keyboardType — users get the wrong keyboard for emails/numbers.',
      'Error messages like "invalid input" — say what\'s wrong and how to fix it.'
    ],
    seniorNotes: 'Production forms handle the full lifecycle: disable submit while in-flight (prevents double-submission), map backend errors to specific fields (email-already-in-use → show under the email field), and preserve user input through failures. The course\'s register/login error-handling chapters are exactly this discipline.',
    interviewQuestions: [
      'How does Form validation work in Flutter?',
      'Why must TextEditingControllers be created in initState and disposed?',
      'How do you show a backend "email already in use" error on the right field?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Login form with validation (Dart)',
        code: `final _formKey = GlobalKey<FormState>();
final _email = TextEditingController();
final _password = TextEditingController();
bool _submitting = false;

Form(
  key: _formKey,
  autovalidateMode: AutovalidateMode.onUserInteraction,
  child: Column(children: [
    TextFormField(
      controller: _email,
      keyboardType: TextInputType.emailAddress,
      textInputAction: TextInputAction.next,
      decoration: const InputDecoration(labelText: 'Email'),
      validator: (v) {
        if (v == null || v.isEmpty) return 'Email is required';
        if (!v.contains('@')) return 'Enter a valid email address';
        return null;
      },
    ),
    TextFormField(
      controller: _password,
      obscureText: true,
      textInputAction: TextInputAction.done,
      decoration: const InputDecoration(labelText: 'Password'),
      validator: (v) =>
          (v == null || v.length < 8) ? 'At least 8 characters' : null,
      onFieldSubmitted: (_) => _submit(),
    ),
    const SizedBox(height: 16),
    FilledButton(
      onPressed: _submitting ? null : _submit,   // disable while in flight
      child: _submitting
          ? const CircularProgressIndicator()
          : const Text('Log in'),
    ),
  ]),
)

Future<void> _submit() async {
  if (!_formKey.currentState!.validate()) return;
  setState(() => _submitting = true);
  try { await auth.logIn(_email.text, _password.text); }
  finally { if (mounted) setState(() => _submitting = false); }
}`
      }
    ]
  },
  {
    id: 'navigation-routing', phase: 2, phaseName: 'UI Building & Navigation',
    orderIndex: 21, estimatedMins: 40, prerequisites: ['stateless-stateful-widgets'],
    title: 'Navigation & Routing',
    eli5: 'Navigation is moving between screens: tap a note to open it, press back to return. Flutter keeps screens in a stack — opening pushes a new screen on top, going back pops it off, like a stack of plates.',
    analogy: 'The Navigator is a deck of cards: push deals a new card on top (only the top is visible), pop removes it revealing the previous one, and pushReplacement swaps the top card (no going back to it — perfect after login).',
    explanation: 'Navigator 1.0 manages a stack of routes imperatively: push, pop, pushNamed, pushReplacement, pushAndRemoveUntil. Named routes centralize screen registration. Cleaning up routes — pushReplacement after login, pushAndRemoveUntil after logout — is what the course\'s "Cleaning Up our Routes" chapter is about; getting it wrong leaves users backing into screens they shouldn\'t see.',
    technicalDeep: 'Navigator.push(context, MaterialPageRoute(builder: ...)) / .pop(context, result) — pop can return a value to the awaiting pusher. Named routes: MaterialApp(routes: {\'/login\': (c) => LoginView()}), Navigator.pushNamed(context, \'/login\', arguments: x). Stack surgery: pushReplacementNamed (login → home: replace so back doesn\'t return to login), pushNamedAndRemoveUntil(\'/home\', (route) => false) (clear everything — logout), popUntil. WillPopScope/PopScope intercepts back. Dialogs and bottom sheets are also routes (showDialog pushes). Navigator 2.0/Router API: declarative, needed for web URL sync — most teams use go_router instead: declarative paths, deep links, redirect guards (auth!), nested navigation, type-safe params.',
    whatBreaks: 'push after login instead of pushReplacement → back button returns to the login screen. Not awaiting pop results when the next screen returns data. context.mounted check needed after await before navigating. Deep links and web URLs don\'t work with pure Navigator 1.0 — that\'s what go_router solves.',
    efficientWay: {
      title: 'Choosing navigation',
      approaches: [
        { name: 'go_router for apps with auth/deep links', verdict: 'best', reason: 'Declarative routes, redirect guards for auth, deep links and web URLs — the de facto standard.' },
        { name: 'Navigator 1.0 named routes for simple apps', verdict: 'ok', reason: 'Perfectly fine for a handful of screens without deep linking.' },
        { name: 'Hand-rolled Navigator 2.0', verdict: 'weak', reason: 'Notoriously complex API; go_router wraps it properly.' }
      ],
      recommendation: 'Learn Navigator 1.0 mechanics first (push/pop/replacement — the mental model), then adopt go_router when your app gets auth flows or deep links. Auth redirect logic belongs in the router, not scattered through screens.'
    },
    commonMistakes: [
      'push instead of pushReplacement after auth — back into login.',
      'Logout that just pushes login on top — entire authenticated stack still there underneath.',
      'Navigating after await without checking context.mounted.'
    ],
    seniorNotes: 'The auth-routing pattern from the course (separating app initialization from login/register, confirming identity before main UI) matures into: a root widget listening to auth state, with go_router redirect: sending unauthenticated users to /login and verified users to /notes. Route guards centralize what beginners scatter across screens.',
    interviewQuestions: [
      'push vs pushReplacement vs pushAndRemoveUntil — when do you use each?',
      'How do you pass data forward to a screen and receive a result back?',
      'How would you implement auth-guarded routes?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Navigation patterns (Dart)',
        code: `// Push and await a result
final created = await Navigator.push<Note>(
  context,
  MaterialPageRoute(builder: (_) => const NewNoteView()),
);
if (created != null && context.mounted) showSnack('Note saved');

// In NewNoteView: return the result
Navigator.pop(context, note);

// After successful LOGIN: replace so back doesn't return here
Navigator.pushReplacementNamed(context, '/notes');

// LOGOUT: nuke the whole stack
Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);

// go_router with an auth guard
final router = GoRouter(
  redirect: (context, state) {
    final loggedIn = auth.currentUser != null;
    final goingToLogin = state.matchedLocation == '/login';
    if (!loggedIn && !goingToLogin) return '/login';
    if (loggedIn && goingToLogin) return '/notes';
    return null;   // no redirect
  },
  routes: [
    GoRoute(path: '/login', builder: (c, s) => const LoginView()),
    GoRoute(path: '/notes', builder: (c, s) => const NotesView(),
      routes: [GoRoute(path: ':id', builder: (c, s) =>
          NoteDetail(id: s.pathParameters['id']!))]),
  ],
);`
      }
    ]
  },
  {
    id: 'dialogs-loading', phase: 2, phaseName: 'UI Building & Navigation',
    orderIndex: 22, estimatedMins: 30, prerequisites: ['navigation-routing'],
    title: 'Dialogs, Snackbars & Loading States',
    eli5: 'Apps need to talk back to users: "Are you sure you want to delete?" (dialog), "Note saved!" (snackbar), and "working on it…" (loading spinner). These small moments decide whether your app feels polished or janky.',
    analogy: 'Dialogs are a waiter stopping you to confirm the order. Snackbars are the kitchen bell — a brief "order\'s up!" that doesn\'t interrupt. Loading states are the "your food is being prepared" sign that stops you wondering if anyone heard you.',
    explanation: 'Flutter provides showDialog (blocking decisions), SnackBar (transient feedback), showModalBottomSheet (mobile-friendly action menus), and loading patterns (button spinners, full-screen overlays). The course dedicates whole chapters to error dialogs and loading screens because every async action needs all three states: loading, success, error.',
    technicalDeep: 'showDialog<T> returns Future<T?> — awaits the user\'s choice; AlertDialog(title, content, actions). Confirmation idiom: final ok = await showDialog<bool>(...); barrierDismissible controls tap-outside. SnackBar via ScaffoldMessenger.of(context).showSnackBar — works across screen pops (it\'s scoped to the Scaffold, messenger survives). showModalBottomSheet for action sheets. Loading: per-button (replace label with spinner + disable), full-screen overlay (Stack + ModalBarrier or a dialog you pop programmatically), skeleton screens (shimmer) for content loads. Generic error dialog helper: one showErrorDialog(context, message) reused app-wide — the course builds exactly this. Reusable confirmation helper too.',
    whatBreaks: 'Showing dialogs with a context that\'s gone (after await without mounted check). Forgetting to pop a programmatic loading dialog on error path → app stuck behind a spinner forever. SnackBar via Scaffold.of instead of ScaffoldMessenger (pre-2.0 pattern) breaks across navigation.',
    efficientWay: {
      title: 'Feedback patterns',
      approaches: [
        { name: 'Shared dialog/snack helpers in core/', verdict: 'best', reason: 'showErrorDialog, showConfirmDialog, context.showSnack — consistent UX, one place to restyle.' },
        { name: 'State-driven overlays (loading in BLoC state)', verdict: 'best', reason: 'UI renders from state (isLoading) instead of imperatively pushing/popping spinners — fewer stuck states.' },
        { name: 'Inline one-off dialogs per screen', verdict: 'weak', reason: 'Six subtly different error dialogs by month two.' }
      ],
      recommendation: 'Build three helpers early: showErrorDialog, showConfirmDialog (returns Future<bool>), and a LoadingOverlay tied to state. Every async flow then reads: loading state → action → success snack / error dialog.'
    },
    commonMistakes: [
      'No loading state at all — users double-tap submit and fire duplicate requests.',
      'Raw exception text in error dialogs — map exceptions to human messages.',
      'Dialog logic after await without if (context.mounted) guard.'
    ],
    seniorNotes: 'The mature pattern: UI never imperatively shows loading dialogs; it renders from state. BlocConsumer listener shows dialogs/snacks on state transitions (Failure → error dialog), builder renders spinner when state.isLoading. Imperative overlay management is where "stuck spinner" bugs live.',
    interviewQuestions: [
      'How do you return a confirmation result from a dialog?',
      'Why use ScaffoldMessenger rather than Scaffold.of for snackbars?',
      'Describe a robust loading-state pattern for async actions.'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Reusable dialog helpers (Dart)',
        code: `// Generic confirm dialog — returns true/false
Future<bool> showConfirmDialog(BuildContext context, String title, String body) async {
  final result = await showDialog<bool>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: Text(title),
      content: Text(body),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
        FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Delete')),
      ],
    ),
  );
  return result ?? false;   // null = dismissed = not confirmed
}

// Usage with the full feedback cycle
Future<void> _deleteNote(Note note) async {
  final ok = await showConfirmDialog(context, 'Delete note?', 'This cannot be undone.');
  if (!ok || !context.mounted) return;
  try {
    await notesService.delete(note.id);
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Note deleted')));
    }
  } on Exception {
    if (context.mounted) await showErrorDialog(context, 'Could not delete. Try again.');
  }
}`
      }
    ]
  },
  {
    id: 'inherited-widgets', phase: 2, phaseName: 'UI Building & Navigation',
    orderIndex: 23, estimatedMins: 35, prerequisites: ['widgets-intro'],
    title: 'InheritedWidget & Data Down the Tree',
    eli5: 'Passing data through 10 widget layers by hand is exhausting. InheritedWidget is a broadcast tower at the top of the tree — any widget below can tune in to its data directly, no relay race needed.',
    analogy: 'Constructor passing is whispering a message down a long line of people. InheritedWidget is the office PA system: announce once at the top, anyone below who cares just listens.',
    explanation: 'InheritedWidget is Flutter\'s built-in mechanism for sharing data down the tree without constructor drilling. It\'s how Theme.of(context), MediaQuery.of(context), and Navigator.of(context) work — and it\'s the foundation underneath Provider, Riverpod, and BLoC. Understanding it demystifies all state management.',
    technicalDeep: 'An InheritedWidget sits in the tree holding data; descendants call context.dependOnInheritedWidgetOfExactType<MyInherited>() (wrapped in a static .of(context) by convention). dependOn registers the calling element as a dependent: when the InheritedWidget updates and updateShouldNotify(old) returns true, exactly the dependent widgets rebuild — surgical, efficient updates. getInheritedWidgetOfExactType reads WITHOUT subscribing (read-once). Limitation: InheritedWidget is immutable — to change data you pair it with a StatefulWidget above that rebuilds it with new values; this pairing is essentially what Provider automates. The .of(context) pattern: static MyData of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<MyInherited>()!.data.',
    whatBreaks: '.of(context) above the provider in the tree → null/throws ("could not find ancestor") — the classic Provider-not-found error, now explicable: the lookup walks UP from context. Subscribing (dependOn) when you only need a one-time read → unnecessary rebuilds. updateShouldNotify always true → every dependent rebuilds on every change.',
    efficientWay: {
      title: 'Learning inherited widgets',
      approaches: [
        { name: 'Build one InheritedWidget by hand, then use Provider', verdict: 'best', reason: 'One hand-built example makes Provider/Riverpod/BLoC "obvious" instead of magic.' },
        { name: 'Jump straight to Provider', verdict: 'ok', reason: 'Productive immediately, but Provider errors stay mysterious without the foundation.' },
        { name: 'Raw InheritedWidget for app state in production', verdict: 'weak', reason: 'Boilerplate Provider already eliminates; use the ecosystem.' }
      ],
      recommendation: 'Spend one hour implementing a hand-rolled InheritedWidget with a counter. Every "could not find Provider" error and every scoped-rebuild behavior afterwards will make sense.'
    },
    commonMistakes: [
      'Calling .of(context) with a context ABOVE the inherited widget (e.g., the same build that creates it).',
      'Using dependOn (subscribes) in callbacks where a read-only lookup is right.',
      'Thinking InheritedWidget stores mutable state — it\'s an immutable conduit; mutation lives above it.'
    ],
    seniorNotes: 'Interview gold: "How does Provider work under the hood?" Answer: it\'s an InheritedWidget; of(listen: true) calls dependOnInheritedWidgetOfExactType registering a dependency; notifyListeners triggers the InheritedWidget to rebuild, and the element tree rebuilds exactly the registered dependents. Also explains why context.read exists (lookup without subscription).',
    interviewQuestions: [
      'How does Theme.of(context) find the theme and rebuild on changes?',
      'What does updateShouldNotify control?',
      'How does Provider relate to InheritedWidget?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Hand-rolled InheritedWidget (Dart)',
        code: `class SessionScope extends InheritedWidget {
  final User? user;
  const SessionScope({super.key, required this.user, required super.child});

  // The conventional accessor
  static User? of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<SessionScope>()?.user;

  // Rebuild dependents only when user actually changed
  @override
  bool updateShouldNotify(SessionScope old) => old.user != user;
}

// Provide near the root (paired with state that can rebuild it)
SessionScope(
  user: currentUser,
  child: const MaterialApp(home: NotesView()),
)

// Consume anywhere below — no constructor drilling
class ProfileBadge extends StatelessWidget {
  const ProfileBadge({super.key});
  @override
  Widget build(BuildContext context) {
    final user = SessionScope.of(context);   // subscribes to changes
    return Text(user?.email ?? 'Guest');
  }
}`
      }
    ]
  },
  {
    id: 'packages-pubdev', phase: 2, phaseName: 'UI Building & Navigation',
    orderIndex: 24, estimatedMins: 25, prerequisites: ['flutter-project-setup'],
    title: 'Packages & pub.dev',
    eli5: 'pub.dev is Flutter\'s app store for code: thousands of free packages solving problems you\'d otherwise build yourself — image caching, HTTP clients, state management. Add a line to pubspec.yaml and it\'s yours.',
    analogy: 'Packages are pre-made furniture vs. carpentry. IKEA (pub.dev) has a tested wardrobe for every need — you only hand-build the pieces that make your app special.',
    explanation: 'The pub ecosystem is central to Flutter productivity. Knowing how to evaluate packages (scores, maintenance, popularity), manage versions (semver, caret syntax), and resolve conflicts separates smooth projects from dependency hell.',
    technicalDeep: 'pubspec.yaml: http: ^1.2.0 (caret = compatible up to next major; semver). flutter pub get resolves and writes pubspec.lock; pub upgrade moves within constraints; pub outdated reports newer versions. Evaluating on pub.dev: likes, pub points (static quality score), download counts, Flutter Favorite badge, last-publish date, open issues, null-safety + platform support. dependency_overrides forces a version during conflicts (temporary fix). Path/git dependencies for local or forked packages. dev_dependencies: build_runner, lints, mocktail — not shipped. Essential packages by domain: http/dio (network), shared_preferences (KV storage), sqflite/drift (DB), provider/riverpod/flutter_bloc (state), go_router (nav), cached_network_image, intl (i18n), firebase_* family.',
    whatBreaks: 'Depending on abandoned packages — Flutter upgrades eventually break them with no fix coming. Version conflicts when two packages require incompatible versions of a third. Importing a heavy package for one function (left-pad syndrome) — audit transitive dependencies.',
    efficientWay: {
      title: 'Managing dependencies',
      approaches: [
        { name: 'Few, well-maintained, popular packages', verdict: 'best', reason: 'Every dependency is a liability across Flutter upgrades; choose boring and maintained.' },
        { name: 'Wrap third-party APIs behind your own interfaces', verdict: 'best', reason: 'Swapping http→dio touches one file, not 40 — abstraction pays at upgrade time.' },
        { name: 'A package for every tiny problem', verdict: 'weak', reason: '60-dependency apps break on every Flutter release; some of that code is 5 lines to write.' }
      ],
      recommendation: 'Check (1) Flutter Favorite / verified publisher, (2) recent commits, (3) pub points before adopting. Wrap external services (HTTP, storage, analytics) behind your own thin interface so packages stay replaceable.'
    },
    commonMistakes: [
      'Adopting packages by first-search-result instead of evaluating maintenance.',
      'flutter pub upgrade on release day — upgrade early in a cycle, test thoroughly.',
      'Leaving dependency_overrides in place permanently — it\'s a temporary patch.'
    ],
    seniorNotes: 'Teams maintain an approved-package policy and audit dependencies quarterly: unmaintained packages get replacement plans before they block a Flutter upgrade. flutter pub deps shows the full transitive graph — know what you actually ship.',
    interviewQuestions: [
      'How do you evaluate whether a pub.dev package is production-safe?',
      'What does the caret (^) in version constraints mean?',
      'How do you handle a dependency version conflict?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'Dependency management',
        code: `# Add packages
flutter pub add http go_router cached_network_image
flutter pub add --dev mocktail build_runner

# Inspect and update
flutter pub outdated          # what has newer versions
flutter pub upgrade            # within pubspec constraints
flutter pub deps               # full dependency tree

# pubspec.yaml version syntax
# http: ^1.2.0      → >=1.2.0 <2.0.0 (recommended)
# http: 1.2.0       → exactly 1.2.0
# http: any         → never do this

# Temporary conflict fix (remove ASAP)
# dependency_overrides:
#   meta: 1.12.0`
      }
    ]
  },
  {
    id: 'design-principles', phase: 2, phaseName: 'UI Building & Navigation',
    orderIndex: 25, estimatedMins: 40, prerequisites: ['dart-oop', 'inherited-widgets'],
    title: 'Design Principles: SOLID, DI & Patterns',
    eli5: 'Design principles are the difference between a junk drawer and an organized toolbox. SOLID is five rules for organizing code so changes stay easy; dependency injection means handing tools to workers instead of making workers find their own tools.',
    analogy: 'A well-designed codebase is a professional kitchen: each station does one job (single responsibility), stations are swappable (dependency injection), and the head chef coordinates without doing every station\'s work (separation of concerns).',
    explanation: 'As apps grow past a few screens, structure decides velocity. SOLID principles, dependency injection, and common patterns (repository, service, singleton, factory, observer) keep Flutter codebases testable and changeable — and they\'re what the course applies when it extracts an AuthService from raw Firebase calls.',
    technicalDeep: 'SOLID in Flutter terms: S — widgets render, services do logic, repositories fetch (the course\'s AuthService extraction); O — extend via new implementations of an interface, not edits to working code; L — any AuthProvider implementation must honor the same contract; I — small focused abstract classes beat god-interfaces; D — depend on abstractions: NotesBloc takes a NotesRepository interface, not FirebaseFirestore directly. DI in Flutter: constructor injection (best for testability), Provider/Riverpod as injection containers, get_it as a service locator. Patterns: Repository (abstract data source behind an interface — swap Firebase for SQLite without touching UI), Service (stateless domain operations), Singleton via factory constructor, Observer (Streams/Listenable — the basis of all Flutter state management).',
    whatBreaks: 'UI calling Firebase directly: untestable (real network in widget tests), unswappable (Firestore → Supabase = rewrite every screen), and unmockable. God classes (AppManager doing auth+notes+settings). Premature abstraction is real too — interfaces with one forever-implementation for a todo app is ceremony, not engineering.',
    efficientWay: {
      title: 'Applying principles',
      approaches: [
        { name: 'Repository + service layers, constructor injection', verdict: 'best', reason: 'The 20% of architecture that gives 80% of testability and flexibility.' },
        { name: 'Abstract interfaces for external services', verdict: 'best', reason: 'AuthProvider interface with FirebaseAuthProvider impl — the course does exactly this before testing.' },
        { name: 'Full clean-architecture ceremony on day one', verdict: 'ok', reason: 'Use-cases/entities/data-sources per feature is justified at team scale; overkill for solo MVPs.' }
      ],
      recommendation: 'Minimum viable architecture: UI → state management → service/repository (interface) → data source. Inject dependencies through constructors. That single discipline makes unit testing (Phase 6) possible.'
    },
    commonMistakes: [
      'Business logic inside build() methods or onPressed callbacks.',
      'new-ing dependencies inside classes instead of injecting them — untestable.',
      'Singletons holding mutable state accessed from everywhere — global variables in disguise.'
    ],
    seniorNotes: 'The interview framing: "How would you structure a Flutter app for a team of 5?" Expected answer touches layers (presentation/domain/data), DI mechanism, repository interfaces enabling mock-based tests, and feature-first foldering. Name-dropping patterns matters less than explaining WHY each boundary exists.',
    interviewQuestions: [
      'How does dependency injection improve testability in Flutter?',
      'What is the repository pattern and what does it buy you?',
      'Apply the single responsibility principle to a Flutter screen.'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Repository pattern + DI (Dart)',
        code: `// 1. Abstraction — what the app needs, not how it's done
abstract class NotesRepository {
  Future<List<Note>> getNotes(String userId);
  Future<Note> create(String userId, String text);
  Future<void> delete(String noteId);
}

// 2. Implementation — swappable detail
class FirestoreNotesRepository implements NotesRepository {
  final FirebaseFirestore _db;
  FirestoreNotesRepository(this._db);   // injected, not constructed inside

  @override
  Future<List<Note>> getNotes(String userId) async {
    final snap = await _db.collection('notes')
        .where('ownerId', isEqualTo: userId).get();
    return snap.docs.map(Note.fromDoc).toList();
  }
  // ... create, delete
}

// 3. Consumer depends on the interface
class NotesBloc {
  final NotesRepository repo;            // ANY implementation works
  NotesBloc({required this.repo});
}

// 4. Test with a fake — no Firebase, no network
class FakeNotesRepo implements NotesRepository {
  final notes = <Note>[];
  @override
  Future<List<Note>> getNotes(String userId) async => notes;
  // ...
}`
      }
    ]
  },

  /* â”€â”€ PHASE 3: State Management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'state-management-intro', phase: 3, phaseName: 'State Management',
    orderIndex: 26, estimatedMins: 35, prerequisites: ['inherited-widgets', 'design-principles'],
    title: 'What is State Management?',
    eli5: 'State is everything your app remembers: who\'s logged in, what\'s in the cart, which tab is open. State management is deciding WHERE that memory lives and HOW screens find out when it changes.',
    analogy: 'A small shop keeps notes on paper behind the counter (setState — local and fine). A chain store needs a shared inventory system every branch can read and update (app-level state management) — paper notes per branch would drift into chaos.',
    explanation: 'The core problem: multiple widgets need the same changing data. Ephemeral state (a checkbox, an animation) belongs in setState. App state (auth, notes, cart) needs a home above the widgets with a notification mechanism — that\'s what Provider, Riverpod, BLoC, and GetX all provide with different trade-offs.',
    technicalDeep: 'Two state categories: ephemeral (single-widget UI state — setState is correct, not a code smell) and app state (shared, long-lived). Every solution answers three questions: where does state live (above the widgets needing it), how do widgets read it (InheritedWidget-based lookup), how do they update on change (Listenable/Stream subscriptions triggering targeted rebuilds). Lifting state up: move state to the lowest common ancestor; pass data down, callbacks up — works fine for shallow trees and IS the right answer for simple cases. The scaling failure: prop-drilling through 10 layers and setState cascades rebuilding whole screens — the moment for a real solution. Unidirectional data flow: events flow up, state flows down — the shared philosophy of all serious patterns.',
    whatBreaks: 'Global mutable singletons as "state management" — no change notifications, untestable, race-prone. Putting EVERYTHING in app state — your text field cursor doesn\'t belong in BLoC. Choosing a library before understanding the problem — cargo-culting Redux patterns into a 3-screen app.',
    efficientWay: {
      title: 'Approaching state management',
      approaches: [
        { name: 'setState → lift up → Provider/BLoC when it hurts', verdict: 'best', reason: 'Feel each tool\'s limits before adopting the next — you\'ll use each correctly forever after.' },
        { name: 'Adopt the team standard immediately', verdict: 'ok', reason: 'Joining a BLoC team? Learn BLoC. But still understand WHAT it solves.' },
        { name: 'Mixing three state libraries in one app', verdict: 'weak', reason: 'Pick one app-state solution; consistency beats theoretical per-case optimality.' }
      ],
      recommendation: 'Internalize the decision tree: single widget → setState; subtree → lift state up; app-wide → one of Provider (simplest), Riverpod (modern), BLoC (structured, this course\'s choice). Learn one deeply rather than three shallowly.'
    },
    commonMistakes: [
      'Treating setState as "bad" — it\'s the right tool for local UI state.',
      'App state in StatefulWidgets passed through 8 constructors.',
      'Business logic in widgets regardless of which library manages state.'
    ],
    seniorNotes: 'Interviewers ask "which state management do you prefer and why" to probe judgment, not loyalty. Strong answer: classify state (ephemeral vs shared), name the trade-offs (Provider simplicity vs BLoC structure/testability vs Riverpod compile-safety), and tie the choice to team size and app complexity.',
    interviewQuestions: [
      'What is the difference between ephemeral state and app state?',
      'What does "lifting state up" mean and when does it stop scaling?',
      'What is unidirectional data flow?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Lifting state up (Dart)',
        code: `// State lives at the lowest common ancestor
class CartScreen extends StatefulWidget {
  const CartScreen({super.key});
  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final List<Item> _items = [];

  void _addItem(Item item) => setState(() => _items.add(item));

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      CartSummary(count: _items.length),          // data flows DOWN
      Expanded(child: ProductList(onAdd: _addItem)), // events flow UP
    ]);
  }
}

// Works great at this scale. The pain that motivates Provider/BLoC:
// - CartSummary is 10 layers deep → drilling count through 10 constructors
// - Another SCREEN needs the cart → no common ancestor except the app root
// - setState here rebuilds the whole screen for every change`
      }
    ]
  },
  {
    id: 'provider-changenotifier', phase: 3, phaseName: 'State Management',
    orderIndex: 27, estimatedMins: 40, prerequisites: ['state-management-intro'],
    title: 'Provider & ChangeNotifier',
    eli5: 'Provider puts your app\'s data in a box at the top of the widget tree. Any screen can open the box (read) or subscribe to it (watch) — and when the data changes, exactly the subscribed widgets redraw.',
    analogy: 'ChangeNotifier is a YouTube channel: it publishes updates (notifyListeners) and subscribers (watching widgets) get notified automatically. Provider is the platform hosting the channel where anyone can find it.',
    explanation: 'Provider is the gateway drug of Flutter state management — simple, official-recommended for years, and built directly on InheritedWidget. A ChangeNotifier model holds state and calls notifyListeners() on change; ChangeNotifierProvider exposes it; context.watch rebuilds on changes, context.read accesses without subscribing.',
    technicalDeep: 'ChangeNotifier: mixin with addListener/removeListener/notifyListeners; ValueNotifier<T> is its single-value sibling (pairs with ValueListenableBuilder — zero-dependency mini state management). ChangeNotifierProvider(create: (_) => CartModel()) owns lifecycle (auto-dispose). Reading: context.watch<T>() subscribes (build-time only), context.read<T>() one-shot (callbacks), context.select<T,R>((m) => m.count) subscribes to a SLICE — rebuild only when that slice changes. Consumer<T> for narrowing rebuild scope within a big build method. MultiProvider composes several. ProxyProvider derives one provider from another (NotesModel needs AuthModel\'s userId). Pitfalls: watch in callbacks throws; read in build silently never updates.',
    whatBreaks: 'context.watch inside onPressed → assertion error (subscriptions only make sense during build). context.read in build → UI silently never updates. Forgetting notifyListeners() after mutation — state changed, nobody heard. Provider placed below the navigator → new routes can\'t find it (it\'s tree-based lookup).',
    efficientWay: {
      title: 'Using Provider well',
      approaches: [
        { name: 'watch in build, read in callbacks, select for hot paths', verdict: 'best', reason: 'The three-rule discipline that prevents both stale UI and over-rebuilding.' },
        { name: 'ValueNotifier for tiny shared state', verdict: 'best', reason: 'A theme toggle doesn\'t need a library — ValueListenableBuilder is built in.' },
        { name: 'One giant AppModel with everything', verdict: 'weak', reason: 'Every widget rebuilds on any change; split models by domain (auth, cart, settings).' }
      ],
      recommendation: 'Split state into focused ChangeNotifiers per domain. Follow watch/read/select discipline religiously. When you find yourself wanting compile-time safety and less context-dependency, that\'s the Riverpod signal.'
    },
    commonMistakes: [
      'watch in event handlers (crash) or read in build (stale UI) — the classic pair.',
      'Mutating state without notifyListeners().',
      'Creating providers inside build with create: — recreated on rebuilds, state lost.'
    ],
    seniorNotes: 'Performance review of Provider apps almost always finds the same fix: replace broad context.watch<BigModel>() with context.select on the few fields actually used, and wrap expensive subtrees in Consumer with a const child parameter (the child is built once and passed through rebuilds).',
    interviewQuestions: [
      'watch vs read vs select — when do you use each?',
      'How does Provider deliver updates under the hood?',
      'How do you prevent unnecessary rebuilds in a Provider app?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Provider + ChangeNotifier (Dart)',
        code: `class CartModel extends ChangeNotifier {
  final List<Item> _items = [];
  List<Item> get items => List.unmodifiable(_items);
  double get total => _items.fold(0, (s, i) => s + i.price);

  void add(Item item) {
    _items.add(item);
    notifyListeners();        // ← tell subscribers
  }
}

// Provide above whoever needs it
void main() => runApp(
  MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_) => AuthModel()),
      ChangeNotifierProvider(create: (_) => CartModel()),
    ],
    child: const MyApp(),
  ),
);

// Consume
class CartBadge extends StatelessWidget {
  const CartBadge({super.key});
  @override
  Widget build(BuildContext context) {
    // select: rebuild ONLY when count changes
    final count = context.select<CartModel, int>((c) => c.items.length);
    return Badge(label: Text('$count'), child: const Icon(Icons.shopping_cart));
  }
}

// Callbacks use read (no subscription)
onPressed: () => context.read<CartModel>().add(item),`
      }
    ]
  },
  {
    id: 'riverpod', phase: 3, phaseName: 'State Management',
    orderIndex: 28, estimatedMins: 45, prerequisites: ['provider-changenotifier'],
    title: 'Riverpod',
    eli5: 'Riverpod is Provider\'s smarter sibling: same idea (shared state widgets can watch), but providers are declared as global variables the compiler can check — so "provider not found" crashes become impossible.',
    analogy: 'Provider is a filing system bolted to the building (widget tree) — go to the wrong floor and the file isn\'t there. Riverpod is cloud storage: files exist independently of the building, accessible from anywhere, with permissions checked at compile time.',
    explanation: 'Riverpod (by Provider\'s author) removes Provider\'s structural weaknesses: providers live outside the widget tree (no scoping bugs), are compile-time safe, auto-dispose by default, and compose elegantly. Async state is first-class via FutureProvider/StreamProvider and AsyncValue.',
    technicalDeep: 'Providers are top-level finals: Provider (computed/immutable), StateProvider (simple mutable), NotifierProvider/AsyncNotifierProvider (class-based logic — the modern core), FutureProvider/StreamProvider (async sources). Widgets: ConsumerWidget with ref.watch(myProvider) / ref.read (callbacks) / ref.listen (side effects like snackbars). AsyncValue<T>: union of loading/data/error — .when(loading:, data:, error:) forces handling all three (no forgotten spinners). Composition: a provider can ref.watch another — dependency graph with automatic recomputation. autoDispose tears down unwatched state; family parameterizes providers (notesProvider(userId)). Code generation (@riverpod annotation) reduces boilerplate further. Testing: ProviderContainer with overrides — swap any provider for a mock without widgets.',
    whatBreaks: 'Mixing Riverpod and old Provider mental models — ref vs context confusion. Overusing StateProvider for complex logic that belongs in a Notifier. Forgetting autoDispose on per-screen state → stale data on revisit; forgetting to REMOVE it for app-wide state → logout-on-navigation surprises.',
    efficientWay: {
      title: 'Adopting Riverpod',
      approaches: [
        { name: 'NotifierProvider + AsyncValue everywhere', verdict: 'best', reason: 'One consistent pattern for sync and async state with compile-time safety and forced error handling.' },
        { name: 'Code generation (@riverpod)', verdict: 'best', reason: 'Less boilerplate, more inference; the recommended modern style.' },
        { name: 'Treating Riverpod as Provider-with-new-names', verdict: 'weak', reason: 'Misses the actual wins: composition, AsyncValue, testability via overrides.' }
      ],
      recommendation: 'For new apps where you\'re choosing freely: Riverpod with codegen is arguably the best default in 2025+. Model every async resource as AsyncNotifierProvider and render with .when — entire categories of bugs disappear.'
    },
    commonMistakes: [
      'ref.watch inside callbacks (use ref.read) — same discipline as Provider.',
      'Not handling AsyncValue.error — .when forces it; .value! sidesteps it back into crashes.',
      'Putting ProviderScope anywhere but the app root.'
    ],
    seniorNotes: 'Riverpod\'s killer feature for seniors is testability: ProviderContainer(overrides: [notesRepoProvider.overrideWithValue(FakeRepo())]) tests business logic with zero widgets and zero mocking frameworks. Also: ref.listen for navigation/snackbar side effects keeps build methods pure.',
    interviewQuestions: [
      'What problems does Riverpod solve that Provider has?',
      'What is AsyncValue and why does it improve error handling?',
      'How do provider overrides enable testing?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Riverpod async state (Dart)',
        code: `// Provider declared OUTSIDE the widget tree — compile-time safe
final notesRepoProvider = Provider((ref) => FirestoreNotesRepository());

final notesProvider =
    AsyncNotifierProvider<NotesNotifier, List<Note>>(NotesNotifier.new);

class NotesNotifier extends AsyncNotifier<List<Note>> {
  @override
  Future<List<Note>> build() =>
      ref.watch(notesRepoProvider).getNotes();   // composition

  Future<void> addNote(String text) async {
    final repo = ref.read(notesRepoProvider);
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await repo.create(text);
      return repo.getNotes();
    });
  }
}

// UI: all three states handled, by construction
class NotesView extends ConsumerWidget {
  const NotesView({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notes = ref.watch(notesProvider);
    return notes.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => ErrorRetry(error: e,
          onRetry: () => ref.invalidate(notesProvider)),
      data: (list) => NotesList(notes: list),
    );
  }
}`
      }
    ]
  },
  {
    id: 'bloc-basics', phase: 3, phaseName: 'State Management',
    orderIndex: 29, estimatedMins: 50, prerequisites: ['state-management-intro', 'dart-async'],
    title: 'BLoC Pattern: Events, States & Cubit',
    eli5: 'BLoC puts a strict mailroom between your UI and your logic: the UI can only send letters (events) like "user pressed login", and the mailroom can only reply with status updates (states) like "logging in…" then "logged in!". Nothing else gets through.',
    analogy: 'BLoC is a restaurant kitchen with a ticket system: waiters (UI) submit order tickets (events), the kitchen (bloc) works through them and updates the order board (states). Waiters never cook; cooks never take orders — total separation.',
    explanation: 'BLoC (Business Logic Component) enforces unidirectional flow: UI dispatches Events → Bloc processes them (calling services) → Bloc emits States → UI rebuilds from state. Maximum structure, maximum testability — which is why large teams and this course\'s notes app use it. Cubit is the lighter sibling: direct method calls instead of events.',
    technicalDeep: 'flutter_bloc package. Cubit<State>: methods call emit(newState) — less ceremony, great for simple features. Bloc<Event, State>: on<EventType>((event, emit) {...}) handlers; events are classes (LoginRequested), states are classes (AuthLoading, AuthSuccess, AuthFailure — model as sealed class hierarchy for exhaustive switching). States must be immutable with value equality (Equatable/freezed) — bloc skips emitting states equal to current. Widgets: BlocProvider (DI + lifecycle), BlocBuilder (rebuild on state), BlocListener (side effects: navigation, dialogs — fires once per state change), BlocConsumer (both), buildWhen/listenWhen filters. context.read<AuthBloc>().add(LoginRequested(email, pw)). Event transformers (droppable, restartable from bloc_concurrency) control concurrent event handling — e.g., restartable search-as-you-type cancels stale lookups.',
    whatBreaks: 'Mutating state objects instead of emitting new ones → equality says nothing changed → UI frozen. Doing navigation inside BlocBuilder (it builds many times) instead of BlocListener (fires once per transition). Calling emit after an await without checking the handler is still active. God-blocs handling six features.',
    efficientWay: {
      title: 'Learning BLoC',
      approaches: [
        { name: 'Cubit first, Bloc where event semantics pay', verdict: 'best', reason: 'Cubit teaches the state-emission half simply; upgrade to events for traceability and transformers.' },
        { name: 'Sealed states + BlocConsumer discipline', verdict: 'best', reason: 'Exhaustive state handling at compile time; listener for effects, builder for UI — no misplaced logic.' },
        { name: 'Bloc-per-widget for everything', verdict: 'weak', reason: 'A toggle doesn\'t need an event system; match tool weight to feature weight.' }
      ],
      recommendation: 'Model each feature\'s states as a sealed class hierarchy first — Loading/Loaded/Failure with their payloads. The states ARE the design; events and handlers follow naturally. Use BlocListener for every dialog/navigation side effect.'
    },
    commonMistakes: [
      'States without Equatable — duplicate emissions and missed rebuilds both.',
      'Navigation/snackbars in builder instead of listener.',
      'Emitting after await in a cancelled handler — guard with isClosed/emit.isDone.'
    ],
    seniorNotes: 'BLoC\'s real sell is auditability: every state change traces to a named event with a timestamp (BlocObserver logs all transitions app-wide — gold for production debugging). Teams choose BLoC over lighter options when traceability and uniform structure across 20 developers matter more than brevity.',
    interviewQuestions: [
      'Walk through the data flow of the BLoC pattern.',
      'Cubit vs Bloc — trade-offs?',
      'Why must BLoC states be immutable with value equality?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Auth bloc (Dart)',
        code: `// Events: what happened
sealed class AuthEvent {}
class LoginRequested extends AuthEvent {
  final String email, password;
  LoginRequested(this.email, this.password);
}
class LogoutRequested extends AuthEvent {}

// States: what the UI should show
sealed class AuthState {}
class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}
class AuthSuccess extends AuthState { final User user; AuthSuccess(this.user); }
class AuthFailure extends AuthState { final String message; AuthFailure(this.message); }

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthService _auth;
  AuthBloc(this._auth) : super(AuthInitial()) {
    on<LoginRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        final user = await _auth.logIn(event.email, event.password);
        emit(AuthSuccess(user));
      } on AuthException catch (e) {
        emit(AuthFailure(e.userMessage));
      }
    });
  }
}

// UI: listener for effects, builder for rendering
BlocConsumer<AuthBloc, AuthState>(
  listener: (context, state) {
    if (state is AuthFailure) showErrorDialog(context, state.message);
    if (state is AuthSuccess) context.go('/notes');
  },
  builder: (context, state) => LoginForm(
    isLoading: state is AuthLoading,
    onSubmit: (email, pw) =>
        context.read<AuthBloc>().add(LoginRequested(email, pw)),
  ),
)`
      }
    ]
  },
  {
    id: 'bloc-advanced', phase: 3, phaseName: 'State Management',
    orderIndex: 30, estimatedMins: 45, prerequisites: ['bloc-basics'],
    title: 'Advanced BLoC: Architecture & Routing',
    eli5: 'Once login works in BLoC, you graduate to running the WHOLE app on it: one auth bloc deciding which screen tree to show, blocs talking to repositories, and exceptions mapped into friendly error states instead of crashes.',
    analogy: 'Basic BLoC is one well-run kitchen station. Advanced BLoC is the whole restaurant on the ticket system: the front door (root widget) seats guests based on reservation status (auth state), stations coordinate through the manager (repositories), and mistakes become polite apologies (mapped exceptions), never kitchen fires in the dining room.',
    explanation: 'Production BLoC architecture: the root widget switches entire screen trees off auth state (bloc-driven routing), every exception is caught and mapped to a typed failure state, loading overlays render from state, and blocs depend on injected repositories. This is the course\'s final architecture after migrating the notes app to BLoC.',
    technicalDeep: 'Bloc-driven routing: root BlocBuilder<AuthBloc, AuthState> returns LoginView / VerifyEmailView / NotesView based on state — navigation becomes a pure function of state (the course\'s "Moving to Bloc for Routing" chapter). With go_router: refreshListenable bridges bloc streams into router redirects. Exception mapping: services throw typed exceptions (UserNotFoundAuthException, WeakPasswordAuthException — the course defines these); blocs catch and emit states carrying user-presentable messages; raw Exceptions never reach widgets. Bloc-to-bloc communication: NEVER bloc references bloc; either a shared repository exposes a Stream both consume, or a parent widget listens to A and adds events to B. Loading UX: dedicated overlay rendered from state.isLoading with optional message. Hydrated_bloc persists state across restarts (offline-tolerant UIs). BlocObserver: one class logging every event/transition/error app-wide.',
    whatBreaks: 'Blocs importing other blocs — circular dependencies and untestable coupling. Pushing routes imperatively from deep widgets while root also switches on auth state — two navigation authorities fight. Unmapped exceptions crossing the service boundary — raw Firebase errors in dialogs. Loading dialogs pushed imperatively get stuck when the failure path forgets to pop.',
    efficientWay: {
      title: 'Production BLoC architecture',
      approaches: [
        { name: 'State-driven root + typed exceptions + repositories', verdict: 'best', reason: 'Navigation, errors, and data each have one authority — the architecture debugs itself.' },
        { name: 'BlocObserver from day one', verdict: 'best', reason: 'Full event/transition log answers "what happened before the bug" instantly.' },
        { name: 'Gradual migration screen-by-screen', verdict: 'ok', reason: 'How the course does it — works, but define the target architecture first so you migrate toward something.' }
      ],
      recommendation: 'Three rules: (1) navigation renders from state, never pushed from business logic; (2) every service call is wrapped — typed exceptions to typed failure states; (3) blocs receive repositories via constructor. Add BlocObserver logging before you need it.'
    },
    commonMistakes: [
      'Two sources of navigation truth — state-driven root AND imperative pushes.',
      'catch (e) { emit(Failure(e.toString())) } — leaking raw errors to users.',
      'Sharing state by reaching into another bloc instead of via repository streams.'
    ],
    seniorNotes: 'The auth flow is the canonical system-design-in-Flutter interview question. The senior answer: AuthRepository exposing Stream<AuthStatus>, AuthBloc mapping it to states, root router redirecting off those states, typed exceptions mapped to user messages, and tests for each transition — exactly the shape this course builds toward.',
    interviewQuestions: [
      'How would you architect auth-based navigation with BLoC?',
      'How should exceptions flow from services to the UI in BLoC?',
      'How do two blocs share data without referencing each other?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'State-driven root routing (Dart)',
        code: `// Navigation as a pure function of auth state
class AppRoot extends StatelessWidget {
  const AppRoot({super.key});
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) => switch (state) {
        AuthInitial() || AuthLoading() => const SplashView(),
        AuthNeedsVerification() => const VerifyEmailView(),
        AuthLoggedIn() => const NotesView(),
        AuthLoggedOut() || AuthFailure() => const LoginView(),
      },   // sealed states → compiler guarantees every case is handled
    );
  }
}

// Typed exceptions at the service boundary
class AuthService {
  Future<User> logIn(String email, String pw) async {
    try {
      return await _firebase.signIn(email, pw);
    } on FirebaseAuthException catch (e) {
      throw switch (e.code) {
        'user-not-found' => UserNotFoundAuthException(),
        'wrong-password' => WrongPasswordAuthException(),
        _ => GenericAuthException(),
      };
    }
  }
}

// App-wide transition logging
class AppBlocObserver extends BlocObserver {
  @override
  void onTransition(Bloc bloc, Transition transition) {
    log('\${bloc.runtimeType}: \${transition.event} → \${transition.nextState}');
    super.onTransition(bloc, transition);
  }
}`
      }
    ]
  },
  {
    id: 'getx-redux-overview', phase: 3, phaseName: 'State Management',
    orderIndex: 31, estimatedMins: 30, prerequisites: ['state-management-intro'],
    title: 'GetX, Redux & The Wider Ecosystem',
    eli5: 'Beyond the big three (Provider, Riverpod, BLoC) live other approaches: GetX promises everything-in-one with minimal typing, Redux brings the strict single-store pattern from the web, and ValueNotifier needs no package at all.',
    analogy: 'State management libraries are kitchen philosophies: BLoC is a French brigade (strict roles, scales to big teams), Riverpod is modern fusion (safe and composable), GetX is a food truck (fast, everything within reach, gets messy at scale), Redux is a single central pantry with paperwork for every ingredient.',
    explanation: 'You\'ll meet these in existing codebases and interview questions even if you don\'t choose them. GetX: hugely popular, controversial — reactive .obs variables, plus routing/DI/snackbars without context. Redux: single immutable store + reducers — predictable, verbose, rare in new Flutter. ValueNotifier/ChangeNotifier raw: zero dependencies, fine for small apps.',
    technicalDeep: 'GetX: final count = 0.obs; Obx(() => Text(\'$count\')) auto-tracks; GetxController with onInit/onClose; Get.to(Page()) routing without context; Get.put/Get.find DI. Criticisms: hides Flutter fundamentals (context-free magic via global state), encourages untestable god-controllers, single-maintainer risk, "GetX apps" become their own dialect. Redux (flutter_redux): one Store<AppState>, actions dispatched, pure reducers compute next state, StoreConnector rebuilds — time-travel debugging possible; verbose for mobile CRUD. MobX: observable/computed/action with codegen — fine but niche. ValueNotifier raw: ValueListenableBuilder — genuinely underrated for small scope. Ecosystem reality (2025): Riverpod and BLoC dominate serious new projects; Provider remains everywhere in legacy; GetX huge in tutorial-land and some agencies.',
    whatBreaks: 'GetX\'s context-free magic breaks when you need real context (theming, localization) and its global registry makes test isolation painful. Redux boilerplate (action/reducer/selector per field) buries small teams. Choosing by GitHub stars instead of team fit.',
    efficientWay: {
      title: 'Navigating the ecosystem',
      approaches: [
        { name: 'Deep in one (BLoC or Riverpod), conversant in all', verdict: 'best', reason: 'Jobs need depth; interviews and legacy code need breadth.' },
        { name: 'GetX for quick prototypes you\'ll discard', verdict: 'ok', reason: 'It IS fast for hackathons — just don\'t let prototypes become production.' },
        { name: 'Redux because you loved it in React', verdict: 'weak', reason: 'Flutter\'s ecosystem solved these problems differently; flutter_redux is a small island.' }
      ],
      recommendation: 'Be able to read GetX and Redux code (you will encounter both), explain their trade-offs fairly in interviews, and steer new projects toward Riverpod or BLoC with reasons rather than fashion.'
    },
    commonMistakes: [
      'Dismissing GetX without knowing it — many real jobs maintain GetX apps.',
      'Adopting GetX for a long-lived team product without weighing testability.',
      'Mixing paradigms in one app — one app-state library per app.'
    ],
    seniorNotes: 'The fair GetX assessment interviewers respect: it optimizes typing speed over architectural clarity; acceptable for small scopes and rapid delivery, risky for large teams (global state, hidden coupling, test difficulty). Showing you can critique without tribalism signals seniority.',
    interviewQuestions: [
      'Compare GetX and BLoC for a 10-developer product team.',
      'What is the Redux pattern and why is it less common in Flutter?',
      'When is plain ValueNotifier enough?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'GetX vs ValueNotifier flavors (Dart)',
        code: `// GetX reactive style
class CartController extends GetxController {
  final items = <Item>[].obs;            // observable list
  double get total => items.fold(0, (s, i) => s + i.price);
  void add(Item i) => items.add(i);      // Obx widgets auto-update
}
// UI: Obx(() => Text('\${Get.find<CartController>().total}'))
// Routing without context: Get.to(() => const CheckoutPage());

// Zero-dependency alternative: ValueNotifier
final cartCount = ValueNotifier<int>(0);

ValueListenableBuilder<int>(
  valueListenable: cartCount,
  builder: (context, count, _) => Badge(
    label: Text('$count'),
    child: const Icon(Icons.shopping_cart),
  ),
);
// Update from anywhere: cartCount.value++;
// For a 5-screen app, this might be ALL you need.`
      }
    ]
  },
  {
    id: 'reactive-rxdart', phase: 3, phaseName: 'State Management',
    orderIndex: 32, estimatedMins: 40, prerequisites: ['dart-async', 'bloc-basics'],
    title: 'Reactive Programming & RxDart',
    eli5: 'Reactive programming treats everything as flowing streams: keystrokes, auth changes, database updates. Instead of asking "what\'s the value now?", you declare "whenever a value flows by, transform it like this" — and the pipeline runs itself.',
    analogy: 'Imperative code is fetching buckets of water from the well each time. Reactive code is installing plumbing: connect pipes (operators) once — filtering, mixing hot and cold (combining streams) — and water just arrives transformed, forever.',
    explanation: 'Flutter is already reactive (Firestore snapshots, auth state changes, BLoC states are all Streams). RxDart extends Dart streams with powerful operators: debounce for search-as-you-type, combineLatest to merge sources, switchMap to cancel stale requests, and BehaviorSubject for streams that remember their latest value.',
    technicalDeep: 'RxDart adds: BehaviorSubject (broadcast + replays latest value to new listeners — solves "subscribed after the value was emitted"; the classic auth-state holder), ReplaySubject, PublishSubject. Operators: debounceTime(300ms) (wait for typing pause), distinct() (skip duplicates), switchMap (map to inner stream, auto-cancelling the previous — THE search pattern), combineLatest2(notes$, filter$, apply) (recompute when either changes), merge, throttleTime, startWith, scan (running accumulation). The search pipeline: input.debounceTime(300).distinct().switchMap(api.search) — four operators replacing a page of timer-and-flag bookkeeping. StreamBuilder renders any of this. The course\'s "Working with Streams in Notes Service" — caching notes in a local list and exposing a stream — is a hand-rolled BehaviorSubject.',
    whatBreaks: 'Unclosed Subjects — leaks plus "Stream already closed" crashes elsewhere. Plain StreamController where BehaviorSubject is needed → late subscribers miss the current value (UI blank until next change). flatMap where switchMap is right → stale search results racing back out of order.',
    efficientWay: {
      title: 'Using reactive patterns',
      approaches: [
        { name: 'RxDart at the service/repository layer', verdict: 'best', reason: 'Repositories exposing BehaviorSubject-backed streams give every consumer current-value + updates.' },
        { name: 'Learn 6 operators deeply', verdict: 'best', reason: 'debounce, distinct, switchMap, combineLatest, map, where cover 95% of real use.' },
        { name: 'Rx-everything', verdict: 'weak', reason: 'A simple Future doesn\'t improve as a stream; reactive where data genuinely flows over time.' }
      ],
      recommendation: 'Reach for RxDart when you catch yourself writing timers, "is a request in flight" flags, or manual latest-value caches — those are debounce, switchMap, and BehaviorSubject respectively, each in one line.'
    },
    commonMistakes: [
      'Not closing Subjects in dispose/close.',
      'Wrong subject type — Publish (no replay) when Behavior (replay latest) is needed.',
      'Nesting listens inside listens instead of composing with operators.'
    ],
    seniorNotes: 'The search-box pipeline (debounce → distinct → switchMap) is a favorite practical interview question — answering it in four operator names, with WHY each is there (rate-limit, dedupe, cancel-stale), demonstrates real reactive fluency. Bloc\'s event transformers expose the same concepts (restartable ≈ switchMap).',
    interviewQuestions: [
      'What does BehaviorSubject add over a broadcast StreamController?',
      'Design search-as-you-type that never shows stale results.',
      'What does combineLatest do — give a UI example.'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'RxDart pipelines (Dart)',
        code: `// The canonical search pipeline
final _query = PublishSubject<String>();

late final Stream<List<Note>> results = _query
    .debounceTime(const Duration(milliseconds: 300))  // wait for pause
    .distinct()                                       // skip same query
    .switchMap((q) => Stream.fromFuture(api.search(q))); // cancel stale

// TextField: onChanged: _query.add

// BehaviorSubject: stream that remembers — service-layer state
class NotesService {
  final _notes = BehaviorSubject<List<Note>>.seeded([]);
  Stream<List<Note>> get stream => _notes.stream;  // late subscribers get current value

  Future<void> add(Note n) async {
    await _db.insert(n);
    _notes.add([..._notes.value, n]);    // emit new immutable list
  }
  void dispose() => _notes.close();
}

// combineLatest: notes + filter → visible list, auto-recomputed
final visible$ = Rx.combineLatest2(
  notesService.stream,
  filter$,
  (List<Note> notes, NoteFilter f) => notes.where(f.matches).toList(),
);`
      }
    ]
  },
  {
    id: 'choosing-state-management', phase: 3, phaseName: 'State Management',
    orderIndex: 33, estimatedMins: 25, prerequisites: ['provider-changenotifier', 'riverpod', 'bloc-advanced', 'getx-redux-overview'],
    title: 'Choosing Your State Management',
    eli5: 'You\'ve now seen all the options — so which one? Like choosing a vehicle: a bike (setState), a car (Provider/Riverpod), or a truck with logging and paperwork (BLoC). The answer depends on the cargo and the crew, not fashion.',
    analogy: 'Choosing state management is choosing a team sport\'s playbook: a pickup game needs three plays (Provider), a professional league team needs the full structured playbook every player runs identically (BLoC). The playbook doesn\'t win games — fit does.',
    explanation: 'A decision topic: consolidate the trade-offs into a usable framework. The honest answer to "which is best" is a decision tree over app complexity, team size, async intensity, and existing codebase — plus the meta-skill of recognizing that all of them implement the same three primitives (state location, lookup, change notification).',
    technicalDeep: 'Decision factors: (1) Scope — single widget: setState; shared-but-simple: ValueNotifier/Provider; complex app: Riverpod or BLoC. (2) Team — solo/small: Riverpod\'s brevity wins; large team needing uniformity and audit trails: BLoC\'s ceremony IS the feature. (3) Async intensity — heavy streams/cancellation: Riverpod AsyncValue or Bloc transformers both excel. (4) Legacy — Provider apps: Riverpod migrates incrementally (same author, riverpod\'s ChangeNotifierProvider bridge); GetX apps: usually stay GetX. (5) Hiring/market — BLoC dominates job listings in many markets; Riverpod rising fast. Universal architecture beneath any choice: UI → state holder → repository interface → data source, with constructor injection. Migration cost is mostly in widgets; keeping logic in plain Dart classes (services/repos) makes the state layer swappable.',
    whatBreaks: 'Choosing by hype then fighting the tool for years. Mixing two app-state libraries "temporarily" — temporary becomes permanent. Letting the library dictate architecture — repositories and services should be identical Dart regardless of what notifies the UI.',
    efficientWay: {
      title: 'Making the choice',
      approaches: [
        { name: 'Riverpod for new solo/small-team apps', verdict: 'best', reason: 'Compile-safe, async-first, minimal boilerplate, modern default.' },
        { name: 'BLoC for large teams / audit-heavy domains', verdict: 'best', reason: 'Uniform structure, event traceability, the strongest convention enforcement.' },
        { name: 'Rewriting a working Provider app for fashion', verdict: 'weak', reason: 'Migration cost with zero user value; migrate when you hit actual walls.' }
      ],
      recommendation: 'For YOUR learning path: you\'ve built with BLoC (the course) — now rebuild one feature in Riverpod to feel the contrast. In interviews, present the decision tree, not a favorite. In jobs, master whatever the codebase uses.'
    },
    commonMistakes: [
      'Asking "which is best" instead of "which fits this app and team".',
      'Underestimating consistency — a mediocre choice used uniformly beats a perfect mix.',
      'Coupling business logic to the state library — keep logic in plain Dart.'
    ],
    seniorNotes: 'The strongest interview answer template: "All of them solve state location, lookup, and notification — Provider/Riverpod/BLoC differ in safety, ceremony, and traceability. For this team/app I\'d pick X because Y, and structure repositories so the choice stays reversible." That last clause is what separates seniors.',
    interviewQuestions: [
      'Which state management would you choose for a 3-person startup MVP and why?',
      'How do you keep a codebase migratable between state solutions?',
      'What do all Flutter state management solutions have in common?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'The library-agnostic core (Dart)',
        code: `// Keep this layer identical no matter what you choose:

// 1. Repository interface — pure Dart, no Flutter, no state library
abstract class NotesRepository {
  Stream<List<Note>> watchNotes(String userId);
  Future<void> create(String userId, String text);
}

// 2. Logic in plain classes where possible
class NotesFilterLogic {
  List<Note> apply(List<Note> notes, String query) =>
      notes.where((n) => n.text.contains(query)).toList();
}

// 3. Only the THIN notification layer differs per library:

// Provider:  class NotesModel extends ChangeNotifier { ... notifyListeners(); }
// Riverpod:  class NotesNotifier extends AsyncNotifier<List<Note>> { ... }
// BLoC:      class NotesBloc extends Bloc<NotesEvent, NotesState> { ... }
// GetX:      class NotesController extends GetxController { ... }

// Swap cost when logic lives in repos/services: days.
// Swap cost when logic lives in the state classes: months.`
      }
    ]
  },

  /* â”€â”€ PHASE 4: Data, APIs & Firebase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'http-rest-flutter', phase: 4, phaseName: 'Data, APIs & Firebase',
    orderIndex: 34, estimatedMins: 40, prerequisites: ['dart-async', 'design-principles'],
    title: 'REST APIs with http & dio',
    eli5: 'Most apps are pretty windows onto data living on servers. Your Flutter app asks a server for data using HTTP — "GET me the notes", "POST this new note" — and the server answers in JSON.',
    analogy: 'Calling a REST API is mail-ordering from a catalog: you send a structured order form (request) to a known address (endpoint), and the warehouse posts back your package (JSON response) — or a "sorry, out of stock" note (error status).',
    explanation: 'Flutter has two main HTTP clients: http (simple, official) and dio (interceptors, cancellation, retries — the production favorite). A clean API layer wraps the client behind service classes, maps status codes to typed exceptions, and never lets raw network details leak into widgets.',
    technicalDeep: 'http package: http.get/post/put/delete(Uri.parse(url), headers, body). Check res.statusCode explicitly — non-2xx does NOT throw. dio: BaseOptions(baseUrl, connectTimeout, headers), interceptors (auth token injection, logging, 401-refresh-retry), CancelToken (cancel in-flight on screen dispose), FormData for uploads, built-in timeout errors. Auth pattern: interceptor adds Authorization: Bearer header; on 401, refresh token and replay request (queue concurrent 401s behind one refresh). Error taxonomy: connectivity (SocketException/DioException.connectionError), timeouts, 4xx (client — don\'t retry), 5xx (server — retry with backoff). Retries: exponential backoff with jitter, idempotent requests only. Always set timeouts — defaults are infinite-ish.',
    whatBreaks: 'Not checking statusCode with http package → parsing an HTML error page as JSON. No timeouts → spinners forever on dead networks. Retrying POSTs blindly → duplicate orders. Hardcoded URLs scattered through widgets → environment switching requires find-and-replace.',
    efficientWay: {
      title: 'Building the network layer',
      approaches: [
        { name: 'dio + interceptors + typed exceptions', verdict: 'best', reason: 'Auth, logging, retry, and cancellation are cross-cutting — interceptors put them in one place.' },
        { name: 'http package for simple apps', verdict: 'ok', reason: 'Totally fine for a handful of endpoints; you\'ll hand-roll what dio includes as you grow.' },
        { name: 'fetch calls inline in widgets', verdict: 'weak', reason: 'Untestable, unswappable, and error handling gets duplicated per screen.' }
      ],
      recommendation: 'One ApiClient (dio) with auth/logging interceptors and timeouts, consumed by per-domain services (NotesApi, AuthApi) that return typed models and throw typed exceptions. Widgets never see dio.'
    },
    commonMistakes: [
      'Assuming non-2xx throws with the http package — it doesn\'t; check statusCode.',
      'No CancelToken — responses landing on disposed screens.',
      'Logging full responses with tokens/PII in production builds.'
    ],
    seniorNotes: 'The 401-refresh interceptor is a classic interview whiteboard: intercept error → if 401 and not the refresh endpoint itself → pause queue → refresh token once → replay queued requests with the new token → on refresh failure, force logout. Race-safety (one refresh for N concurrent 401s) is the senior detail.',
    interviewQuestions: [
      'Design a Flutter network layer with auth token refresh.',
      'http vs dio — when is each appropriate?',
      'Which requests are safe to retry automatically and why?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'dio client with auth interceptor (Dart)',
        code: `final dio = Dio(BaseOptions(
  baseUrl: 'https://api.myapp.com/v1',
  connectTimeout: const Duration(seconds: 10),
  receiveTimeout: const Duration(seconds: 15),
));

dio.interceptors.add(InterceptorsWrapper(
  onRequest: (options, handler) async {
    final token = await tokenStore.accessToken;
    if (token != null) options.headers['Authorization'] = 'Bearer $token';
    handler.next(options);
  },
  onError: (error, handler) async {
    if (error.response?.statusCode == 401) {
      final ok = await tokenStore.refresh();          // one refresh, queued
      if (ok) {
        final retried = await dio.fetch(error.requestOptions);
        return handler.resolve(retried);              // replay original
      }
      authBloc.add(LogoutRequested());                // refresh failed
    }
    handler.next(error);
  },
));

// Typed service the rest of the app uses
class NotesApi {
  final Dio _dio;
  NotesApi(this._dio);

  Future<List<Note>> fetchNotes() async {
    try {
      final res = await _dio.get('/notes');
      return (res.data as List).map((j) => Note.fromJson(j)).toList();
    } on DioException catch (e) {
      throw switch (e.type) {
        DioExceptionType.connectionError => NoInternetException(),
        DioExceptionType.connectionTimeout ||
        DioExceptionType.receiveTimeout => ApiTimeoutException(),
        _ => ApiException(e.response?.statusCode),
      };
    }
  }
}`
      }
    ]
  },
  {
    id: 'json-serialization', phase: 4, phaseName: 'Data, APIs & Firebase',
    orderIndex: 35, estimatedMins: 35, prerequisites: ['http-rest-flutter'],
    title: 'JSON Serialization & Models',
    eli5: 'Servers speak JSON (text), your app speaks Dart objects. Serialization is the translation booth: fromJson turns server text into typed objects your code can safely use; toJson turns objects back into text to send.',
    analogy: 'JSON is flat-packed IKEA furniture arriving at your door. fromJson is assembling it into a real chair (typed object with guarantees). toJson is disassembling it back into the flat box to ship elsewhere.',
    explanation: 'Every API-connected app needs model classes with fromJson/toJson. Hand-written works for small models; code generation (json_serializable or freezed) scales better — generating the boilerplate, handling nulls, nested objects, and lists consistently. Typed models catch API surprises at the boundary instead of deep in the UI.',
    technicalDeep: 'jsonDecode(body) → Map<String, dynamic> / List<dynamic>. Hand-written: factory Note.fromJson(Map<String, dynamic> json) with explicit casts and defaults — total control, tedious at scale. json_serializable: @JsonSerializable() class + part file + build_runner generates _$NoteFromJson; @JsonKey(name: \'created_at\', defaultValue:) maps snake_case and absences. freezed: data classes + unions + json in one — generates copyWith, ==, hashCode AND serialization; the de facto standard for model layers. Nested models compose (Author.fromJson inside Note.fromJson). Defensive boundary: validate enums (unknown → fallback), dates (tryParse), and never trust field presence. Large payloads: parse in an isolate (compute(parseNotes, body)) to avoid jank.',
    whatBreaks: 'json[\'price\'] as double when the API sends an int → cast error in production (use (json[\'price\'] as num).toDouble()). New enum value from the server crashing old app versions — always provide unknown fallbacks. Parsing megabyte payloads on the UI thread → visible jank.',
    efficientWay: {
      title: 'Model strategy',
      approaches: [
        { name: 'freezed for all model classes', verdict: 'best', reason: 'Immutability, copyWith, equality, unions, AND json — one annotation, every data-class need solved.' },
        { name: 'json_serializable only', verdict: 'ok', reason: 'Solid serialization; you\'ll still hand-write copyWith and == that freezed includes.' },
        { name: 'Hand-written everywhere', verdict: 'ok', reason: 'Fine under ~10 small models and great for learning; boilerplate compounds beyond that.' }
      ],
      recommendation: 'Hand-write your first few models to understand the mechanics, then switch to freezed + json_serializable. Defend the boundary: defaults for missing fields, fallbacks for unknown enums, num→toDouble for numerics.'
    },
    commonMistakes: [
      'as double on JSON numbers — servers send 5 not 5.0; use (x as num).toDouble().',
      'No defaults for nullable/missing fields — one absent key crashes the parse.',
      'Forgetting build_runner after model changes — stale generated code, confusing errors.'
    ],
    seniorNotes: 'Senior teams separate DTOs (exact API shape, generated) from domain models (what the app needs) with mappers between — API renames then touch one mapper, not forty screens. Overkill for small apps; essential when you don\'t own the API.',
    interviewQuestions: [
      'Why can json[\'price\'] as double crash, and what\'s the safe pattern?',
      'What does freezed generate beyond json_serializable?',
      'When should JSON parsing move to an isolate?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'freezed model (Dart)',
        code: `// note.dart
import 'package:freezed_annotation/freezed_annotation.dart';
part 'note.freezed.dart';
part 'note.g.dart';

@freezed
class Note with _$Note {
  const factory Note({
    required String id,
    required String text,
    @JsonKey(name: 'owner_id') required String ownerId,
    @Default(false) bool isPinned,          // safe default if absent
    DateTime? updatedAt,
  }) = _Note;

  factory Note.fromJson(Map<String, dynamic> json) => _$NoteFromJson(json);
}
// Generated free: copyWith, ==, hashCode, toString, toJson
// dart run build_runner build --delete-conflicting-outputs

// Defensive numeric + enum parsing (hand-written boundary)
double parsePrice(Map<String, dynamic> j) => (j['price'] as num).toDouble();

NoteStatus parseStatus(String? raw) =>
    NoteStatus.values.asNameMap()[raw] ?? NoteStatus.unknown;

// Big payloads: off the UI thread
final notes = await compute(
  (String body) => (jsonDecode(body) as List)
      .map((j) => Note.fromJson(j as Map<String, dynamic>)).toList(),
  responseBody,
);`
      }
    ]
  },
  {
    id: 'websockets-graphql-flutter', phase: 4, phaseName: 'Data, APIs & Firebase',
    orderIndex: 36, estimatedMins: 30, prerequisites: ['http-rest-flutter', 'reactive-rxdart'],
    title: 'WebSockets & GraphQL in Flutter',
    eli5: 'REST is sending letters back and forth — fine until you need live chat. WebSockets keep a phone line open so the server can speak the instant something happens. GraphQL is a different ordering style: instead of fixed meals, you list exactly the ingredients you want.',
    analogy: 'REST is knocking on the server\'s door for each question. A WebSocket is moving in together — either side just speaks. GraphQL is a bespoke tailor: you specify exactly the measurements (fields) you want, and that\'s precisely what gets made — no more, no less.',
    explanation: 'Two API styles beyond REST you\'ll meet in Flutter jobs: WebSockets for real-time (chat, live scores, collaborative editing) via web_socket_channel, and GraphQL (query exactly the fields you need) via graphql_flutter. Both integrate naturally with Flutter\'s stream-based UI.',
    technicalDeep: 'WebSockets: WebSocketChannel.connect(Uri.parse(\'wss://...\')) → channel.stream (listen) + channel.sink.add (send). It\'s just a Stream — StreamBuilder renders it directly. Production needs: heartbeat ping/pong, reconnection with exponential backoff, message protocol (JSON envelopes with type field), resubscribe-on-reconnect. web_socket_channel is the standard package. GraphQL: one POST endpoint, body = query string + variables; graphql_flutter provides GraphQLClient with normalized caching, Query/Mutation widgets or direct client.query(QueryOptions). Subscriptions (GraphQL over WebSocket) for real-time. Codegen (graphql_codegen) generates typed Dart from .graphql files. When to use which: GraphQL shines when mobile needs differ from web needs (fetch exactly mobile\'s fields — less data over cellular); WebSockets whenever server-initiated push matters.',
    whatBreaks: 'No reconnect logic → one subway tunnel kills the connection until app restart. Unclosed channels → leaks. GraphQL: over-nesting queries (server N+1 amplification), cache normalization confusion (stale UI after mutations — refetch or update cache explicitly).',
    efficientWay: {
      title: 'Real-time & GraphQL',
      approaches: [
        { name: 'Wrap WebSocket in a reconnecting service', verdict: 'best', reason: 'UI subscribes to one resilient stream; connection chaos handled in one class.' },
        { name: 'graphql_flutter with codegen for GraphQL backends', verdict: 'best', reason: 'Typed queries beat string literals; caching handled by the client.' },
        { name: 'Polling REST every 2 seconds for "real-time"', verdict: 'weak', reason: 'Battery drain, lag, and server load — WebSockets exist for this.' }
      ],
      recommendation: 'Learn web_socket_channel + a reconnection wrapper (the pattern transfers to chat, live data, and Firebase\'s internals). Touch GraphQL enough to read queries and run one — depth can wait until a job demands it.'
    },
    commonMistakes: [
      'Treating a WebSocket as always-connected — mobile networks churn constantly.',
      'Sending without checking connection state — silently dropped messages.',
      'GraphQL fragments duplicated everywhere instead of shared.'
    ],
    seniorNotes: 'The reconnecting-WebSocket service (backoff, heartbeat, resubscribe, buffered outbound queue) is a reusable asset worth building once well. Note Firestore\'s realtime listeners (next topics) ARE WebSocket-like push under the hood — Firebase just hides this plumbing.',
    interviewQuestions: [
      'When do WebSockets beat REST polling, and what does production-grade reconnection involve?',
      'What problem does GraphQL solve for mobile clients specifically?',
      'How do GraphQL subscriptions work?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Reconnecting WebSocket service (Dart)',
        code: `class LiveService {
  final _messages = StreamController<ChatMessage>.broadcast();
  Stream<ChatMessage> get messages => _messages.stream;
  WebSocketChannel? _channel;
  int _retry = 0;

  void connect() {
    _channel = WebSocketChannel.connect(Uri.parse('wss://api.myapp.com/live'));
    _retry = 0;
    _channel!.stream.listen(
      (raw) => _messages.add(ChatMessage.fromJson(jsonDecode(raw))),
      onDone: _scheduleReconnect,           // server closed
      onError: (_) => _scheduleReconnect(), // network died
    );
  }

  void _scheduleReconnect() {
    final delay = Duration(seconds: math.min(30, math.pow(2, _retry++).toInt()));
    Timer(delay, connect);                  // exponential backoff, capped
  }

  void send(ChatMessage msg) =>
      _channel?.sink.add(jsonEncode(msg.toJson()));

  void dispose() { _channel?.sink.close(); _messages.close(); }
}

// GraphQL: ask for exactly what the screen needs
const noteQuery = r'''
  query NoteTitles($limit: Int!) {
    notes(limit: $limit) { id title }     # no body, no metadata — just these
  }
''';
final result = await client.query(QueryOptions(
  document: gql(noteQuery), variables: {'limit': 20}));`
      }
    ]
  },
  {
    id: 'local-storage-sqlite', phase: 4, phaseName: 'Data, APIs & Firebase',
    orderIndex: 37, estimatedMins: 45, prerequisites: ['dart-async', 'design-principles'],
    title: 'Local Storage: SharedPreferences & SQLite',
    eli5: 'Apps need to remember things after closing: settings, the logged-in user, and sometimes whole databases of notes. SharedPreferences is a sticky-note drawer for small values; SQLite is a real filing cabinet with search.',
    analogy: 'SharedPreferences is your pocket — keys, a few coins, quick to reach but tiny. SQLite is the garage with labeled shelves and an index — more setup, but you can store thousands of things and find any of them fast.',
    explanation: 'The local persistence ladder: SharedPreferences (key-value: settings, flags, tokens-ish), sqflite (raw SQLite: relational data with SQL), drift (type-safe reactive SQLite), and flutter_secure_storage (encrypted: real tokens/secrets). The course builds full CRUD on local SQLite before moving to the cloud — the local layer remains the offline backbone.',
    technicalDeep: 'SharedPreferences: async init, get/setString/Bool/Int — plaintext XML/plist, so NEVER secrets. flutter_secure_storage: Keychain (iOS) / EncryptedSharedPreferences-Keystore (Android) for tokens. sqflite: openDatabase(path, version, onCreate, onUpgrade) — onUpgrade migrations are YOUR job (if oldVersion < 2 ALTER TABLE...); db.query(table, where: \'owner = ?\', whereArgs: [id]) — parameterized always (injection + correctness); db.insert/update/delete; transactions via db.transaction. drift: tables as Dart classes, compile-time-checked queries, and .watch() returning Streams — query results that auto-update the UI when underlying data changes (pairs beautifully with StreamBuilder/BLoC). CRUD service pattern from the course: NotesService wrapping the DB, caching list in memory, exposing a stream — UI never touches SQL.',
    whatBreaks: 'Tokens in SharedPreferences — readable on rooted/jailbroken devices; use secure storage. Schema change without onUpgrade migration → crash on update for every existing user. String-built SQL with user input. Heavy queries on the UI thread (sqflite helps but big result sets still cost — paginate).',
    efficientWay: {
      title: 'Choosing local storage',
      approaches: [
        { name: 'drift for relational app data', verdict: 'best', reason: 'Type-safe SQL + reactive watch() streams — compile-time errors instead of runtime typos, auto-updating UIs.' },
        { name: 'sqflite raw for learning + simple needs', verdict: 'ok', reason: 'Understanding real SQL underneath is valuable; boilerplate grows with the schema.' },
        { name: 'SharedPreferences as a database', verdict: 'weak', reason: 'JSON blobs in prefs = no queries, no migrations, corruption-prone — the classic shortcut that becomes a rewrite.' }
      ],
      recommendation: 'Rule of thumb: scalar settings → SharedPreferences; secrets → flutter_secure_storage; anything you\'d call "records" → drift (or sqflite while learning). Wrap whichever behind a repository interface — the cloud swap in two topics depends on it.'
    },
    commonMistakes: [
      'Secrets in SharedPreferences instead of secure storage.',
      'No migration plan from schema v1 → v2 — existing users crash on update.',
      'SQL string interpolation instead of whereArgs parameters.'
    ],
    seniorNotes: 'The offline-first architecture interviews love: local DB is the single source of truth for the UI (drift watch() streams), network sync updates the DB in the background, and pending writes queue locally with retry. The UI never waits on the network — it renders local state that syncs eventually.',
    interviewQuestions: [
      'Where do you store an auth token in Flutter and why?',
      'How do you handle SQLite schema migrations for shipped apps?',
      'Sketch an offline-first data layer for a notes app.'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'SQLite CRUD service (Dart)',
        code: `class NotesDb {
  static const _version = 2;
  Database? _db;

  Future<Database> get db async => _db ??= await openDatabase(
    join(await getDatabasesPath(), 'notes.db'),
    version: _version,
    onCreate: (db, v) => db.execute('''
      CREATE TABLE notes(
        id TEXT PRIMARY KEY,
        owner_id TEXT NOT NULL,
        text TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      )'''),
    onUpgrade: (db, oldV, newV) async {
      if (oldV < 2) {
        await db.execute('ALTER TABLE notes ADD COLUMN is_pinned INTEGER DEFAULT 0');
      }   // every shipped schema version needs a path forward
    },
  );

  Future<List<Note>> notesFor(String userId) async {
    final rows = await (await db).query(
      'notes',
      where: 'owner_id = ?', whereArgs: [userId],   // parameterized, always
      orderBy: 'updated_at DESC',
    );
    return rows.map(Note.fromRow).toList();
  }

  Future<void> upsert(Note n) async => (await db).insert(
    'notes', n.toRow(), conflictAlgorithm: ConflictAlgorithm.replace);
}

// Secrets go in secure storage, not prefs
const storage = FlutterSecureStorage();
await storage.write(key: 'refresh_token', value: token);   // Keychain/Keystore`
      }
    ]
  },
  {
    id: 'firebase-setup', phase: 4, phaseName: 'Data, APIs & Firebase',
    orderIndex: 38, estimatedMins: 35, prerequisites: ['flutter-project-setup'],
    title: 'Firebase Backend Setup',
    eli5: 'Firebase is a rent-a-backend from Google: login systems, databases, file storage, and push notifications — all ready-made. Instead of building a server, you plug your Flutter app into Firebase and get backend superpowers in an afternoon.',
    analogy: 'Building your own backend is constructing a house from foundations up. Firebase is moving into a serviced apartment: electricity (auth), plumbing (database), and security (rules) already installed — you pay rent (usage) and follow house rules.',
    explanation: 'Firebase is the fastest path to a full-featured backend for Flutter apps — and Flutter\'s most common production backend. Setup involves: creating a Firebase project, registering iOS/Android apps, and wiring with FlutterFire CLI which generates configuration automatically. The course\'s notes app runs entirely on it.',
    technicalDeep: 'Modern setup: firebase login (Firebase CLI) → dart pub global activate flutterfire_cli → flutterfire configure (selects project, registers all platforms, generates firebase_options.dart) → Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform) in main() before runApp. Packages: firebase_core (required), then per-product: firebase_auth, cloud_firestore, firebase_storage, firebase_messaging, firebase_analytics, firebase_crashlytics. Platform artifacts: google-services.json (Android) and GoogleService-Info.plist (iOS) — flutterfire manages them. Spark plan (free): generous auth/Firestore quotas — entire learning path fits free. Blaze (pay-as-you-go): needed for Cloud Functions. Environments: separate Firebase projects per stage (myapp-dev / myapp-prod) with flavor-specific configs — never develop against prod data.',
    whatBreaks: 'Forgetting await Firebase.initializeApp before any Firebase call → crash on launch. Mismatched bundle ID/applicationId between app and Firebase registration → silent auth failures. One Firebase project for dev AND prod → test data pollution and accidental prod writes. Stale flutterfire configure after adding platforms.',
    efficientWay: {
      title: 'Setting up Firebase',
      approaches: [
        { name: 'FlutterFire CLI (flutterfire configure)', verdict: 'best', reason: 'Automates per-platform registration and config generation — eliminates the classic manual-setup errors.' },
        { name: 'Manual console + config file downloads', verdict: 'weak', reason: 'The pre-CLI path: more steps, more mistakes, no dart options file.' },
        { name: 'Dev/prod project separation from day one', verdict: 'best', reason: 'Costs five minutes now; prevents prod-data accidents forever.' }
      ],
      recommendation: 'flutterfire configure for everything. Create -dev and -prod projects immediately. Initialize in main() with the generated options, and add only the product packages you actually use (each adds app size).'
    },
    commonMistakes: [
      'Calling Firebase services before initializeApp completes.',
      'Skipping WidgetsFlutterBinding.ensureInitialized() before async main work.',
      'Adding every firebase_* package at once "to be ready" — size and config burden.'
    ],
    seniorNotes: 'Know the trade-off conversation: Firebase buys speed and managed scaling at the price of vendor lock-in (Firestore\'s NoSQL model and rules don\'t port), opaque costs at scale, and limited query power. Alternatives worth naming: Supabase (Postgres-based, open source), AWS Amplify, or your own backend (Backend track!). For MVPs and most app-scale products, Firebase wins on velocity.',
    interviewQuestions: [
      'Walk through wiring a Flutter app to Firebase.',
      'Why separate dev and prod Firebase projects?',
      'What are Firebase\'s trade-offs versus a custom backend?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'FlutterFire setup',
        code: `# One-time tooling
npm install -g firebase-tools && firebase login
dart pub global activate flutterfire_cli

# Per project: registers iOS+Android, generates firebase_options.dart
flutterfire configure --project=mynotes-dev

# Add the products you need
flutter pub add firebase_core firebase_auth cloud_firestore

# main.dart
# import 'firebase_options.dart';
#
# Future<void> main() async {
#   WidgetsFlutterBinding.ensureInitialized();
#   await Firebase.initializeApp(
#     options: DefaultFirebaseOptions.currentPlatform,
#   );
#   runApp(const MyApp());
# }`
      }
    ]
  },
  {
    id: 'firebase-auth-flow', phase: 4, phaseName: 'Data, APIs & Firebase',
    orderIndex: 39, estimatedMins: 50, prerequisites: ['firebase-setup', 'forms-input', 'navigation-routing'],
    title: 'Firebase Auth: Register, Login & Verification',
    eli5: 'Firebase Auth is a complete bouncer service for your app: it checks IDs (passwords), issues wristbands (tokens), remembers who\'s inside (sessions), and even mails verification letters — all without you building any of it.',
    analogy: 'Building auth yourself is training your own security team (password hashing, token signing, session storage — months of risky work). Firebase Auth is hiring a professional firm: show them your guest policy, they handle the door.',
    explanation: 'The complete email/password journey — register, verify email, login, logout, session persistence — is the heart of the course\'s app and of most real apps. Firebase Auth provides it: createUser, signIn, sendEmailVerification, authStateChanges stream, plus social providers (Google/Apple) when you\'re ready.',
    technicalDeep: 'Core API: FirebaseAuth.instance.createUserWithEmailAndPassword / signInWithEmailAndPassword / signOut; currentUser (sync snapshot); authStateChanges() — THE stream: emits user/null on every auth change; the root widget listens and switches trees (state-driven routing from Phase 3 — it all connects). Email verification: user.sendEmailVerification(), check user.emailVerified after reload() — gate the main UI on it (the course\'s VerifyEmailView). Errors: FirebaseAuthException codes (email-already-in-use, user-not-found, wrong-password, weak-password, too-many-requests) — map each to a friendly message on the right field. Sessions persist across restarts automatically (secure platform storage). Password reset: sendPasswordResetEmail. Social: google_sign_in / Sign in with Apple (REQUIRED by App Store if you offer any social login). The course\'s AuthService wraps all this behind an interface — swap-able, testable.',
    whatBreaks: 'Trusting emailVerified without user.reload() — it\'s cached stale. Showing raw e.message to users instead of mapped friendly text. Forgetting Apple Sign-In when shipping Google Sign-In to iOS → App Store rejection. Building UI off currentUser once instead of listening to authStateChanges → UI doesn\'t react to logout/expiry.',
    efficientWay: {
      title: 'Implementing auth',
      approaches: [
        { name: 'AuthService interface + authStateChanges-driven root', verdict: 'best', reason: 'The course\'s architecture: service abstracts Firebase, stream drives navigation, everything testable.' },
        { name: 'Exception-code → message mapping table', verdict: 'best', reason: 'One switch maps every FirebaseAuthException code to UX copy — no raw errors leak.' },
        { name: 'Firebase calls inline in button handlers', verdict: 'weak', reason: 'Untestable, unswappable, and error handling duplicates per screen — the exact mess the course refactors away.' }
      ],
      recommendation: 'Follow the course\'s arc deliberately: raw calls → extract AuthService (interface + Firebase implementation) → BLoC consuming the service → root routing off auth state. That refactor sequence IS the lesson.'
    },
    commonMistakes: [
      'No reload() before checking emailVerified.',
      'Generic "something went wrong" for every auth error — map the codes.',
      'Navigation pushed from handlers instead of reacting to authStateChanges.'
    ],
    seniorNotes: 'Auth edge cases that separate production from tutorial: token revocation handling, account-exists-with-different-credential (email used by Google AND password), anonymous-to-permanent account linking (linkWithCredential — keeps user data), and rate limiting (too-many-requests → cooldown UI). Mentioning linking in interviews lands well.',
    interviewQuestions: [
      'How does authStateChanges drive app navigation?',
      'How do you enforce verified email before app access?',
      'A user signs in with Google using an email that already has a password account — what happens?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'AuthService over Firebase (Dart)',
        code: `class FirebaseAuthService implements AuthService {
  final _auth = FirebaseAuth.instance;

  @override
  Stream<AppUser?> get userStream => _auth.authStateChanges()
      .map((u) => u == null ? null : AppUser.fromFirebase(u));

  @override
  Future<AppUser> register(String email, String password) async {
    try {
      final cred = await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
      await cred.user!.sendEmailVerification();       // verify before main UI
      return AppUser.fromFirebase(cred.user!);
    } on FirebaseAuthException catch (e) {
      throw mapAuthError(e);
    }
  }

  @override
  Future<bool> checkVerified() async {
    await _auth.currentUser?.reload();                 // refresh cached flag
    return _auth.currentUser?.emailVerified ?? false;
  }
}

AuthException mapAuthError(FirebaseAuthException e) => switch (e.code) {
  'email-already-in-use' => AuthException('An account already exists for that email.'),
  'weak-password' => AuthException('Password must be at least 6 characters.'),
  'user-not-found' || 'wrong-password' || 'invalid-credential' =>
      AuthException('Incorrect email or password.'),   // don't reveal which
  'too-many-requests' => AuthException('Too many attempts. Try again later.'),
  _ => AuthException('Authentication failed. Please try again.'),
};`
      }
    ]
  },
  {
    id: 'cloud-firestore', phase: 4, phaseName: 'Data, APIs & Firebase',
    orderIndex: 40, estimatedMins: 50, prerequisites: ['firebase-auth-flow', 'local-storage-sqlite'],
    title: 'Cloud Firestore: CRUD & Realtime',
    eli5: 'Firestore is a cloud database that calls YOU: instead of asking "any new notes?" over and over, you subscribe once and Firestore pushes every change to your app instantly — even changes made on the user\'s other phone.',
    analogy: 'A REST database is a newspaper you must go buy each morning. Firestore is a news app with notifications: subscribe to topics (queries) and updates arrive the moment they happen, on every device at once.',
    explanation: 'Cloud Firestore is Firebase\'s NoSQL document database: data lives in documents (JSON-like) grouped into collections, queried with chainable filters, and — its superpower — watched via snapshot listeners that stream live updates. The course migrates the notes app from local SQLite to Firestore, gaining sync across devices.',
    technicalDeep: 'Model: collections/documents/subcollections (notes/{noteId}); documents max 1MB; design for your QUERIES (denormalize freely — NoSQL â‰  normalized). CRUD: col.add(data) (auto-ID), doc.set (create/overwrite, merge: true to upsert), doc.update (fails if missing), doc.delete. Queries: col.where(\'ownerId\', isEqualTo: uid).orderBy(\'updatedAt\', descending: true).limit(20) — compound queries may demand composite indexes (the error message links the create-index console page). Realtime: col.snapshots() → Stream<QuerySnapshot> — feed straight into StreamBuilder/BLoC; includes latency compensation (your writes appear instantly, reconcile later) and offline persistence (cached data + queued writes by default on mobile). Security Rules: request.auth.uid == resource.data.ownerId — THE authorization layer; client access means rules are not optional (the course learns this via a post-release rules fix!). Pagination: startAfterDocument cursors, not offset. Pricing: per read/write/delete — a 1000-document read costs 1000 reads; design queries narrow.',
    whatBreaks: 'Default-open rules in production → anyone can read/write everything (a rite-of-passage incident the course itself hits). Unindexed compound queries throw at runtime. snapshots() without limits on big collections → cost explosion and slow first paint. Treating Firestore like SQL — no joins; restructure or duplicate data instead.',
    efficientWay: {
      title: 'Firestore patterns',
      approaches: [
        { name: 'snapshots() streams into state management', verdict: 'best', reason: 'Realtime sync, offline cache, and latency compensation free — the reactive architecture Phase 3 prepared you for.' },
        { name: 'Rules written WITH the schema, tested in emulator', verdict: 'best', reason: 'Authorization designed alongside data, verified before deploy — not patched after an incident.' },
        { name: 'get() everywhere, manual refresh', verdict: 'ok', reason: 'Sometimes right (one-shot lookups), but discards Firestore\'s realtime value.' }
      ],
      recommendation: 'NotesService exposing Stream<List<Note>> from snapshots(), scoped by ownerId, limited and ordered. Write security rules the same day you write the schema, and test them with the Firebase emulator before shipping.'
    },
    commonMistakes: [
      'Shipping test-mode (allow read, write: if true) rules.',
      'Queries without limit() — unbounded reads, unbounded bills.',
      'Ignoring the composite-index error until production.'
    ],
    seniorNotes: 'Cost-aware Firestore design is the senior skill: every snapshot listener re-reads changed docs; a chat app naÃ¯vely listening to whole conversations re-reads entire histories. Patterns: limit + paginate, aggregate documents (counters via Cloud Functions), bundle static data. Also know when Firestore is WRONG: heavy relational queries, full-text search (pair with Algolia/Typesense), analytics workloads.',
    interviewQuestions: [
      'How do Firestore realtime listeners differ from REST polling?',
      'Design Firestore security rules so users only access their own notes.',
      'How does Firestore offline persistence behave during a write?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Firestore notes service + rules (Dart)',
        code: `class FirestoreNotesService {
  final _notes = FirebaseFirestore.instance.collection('notes');

  // Realtime stream, scoped + ordered + bounded
  Stream<List<Note>> watchNotes(String ownerId) => _notes
      .where('ownerId', isEqualTo: ownerId)
      .orderBy('updatedAt', descending: true)
      .limit(50)
      .snapshots()
      .map((snap) => snap.docs.map(Note.fromDoc).toList());

  Future<void> create(String ownerId, String text) => _notes.add({
    'ownerId': ownerId,
    'text': text,
    'updatedAt': FieldValue.serverTimestamp(),   // server time, not device time
  });

  Future<void> updateText(String id, String text) =>
      _notes.doc(id).update({'text': text, 'updatedAt': FieldValue.serverTimestamp()});

  Future<void> delete(String id) => _notes.doc(id).delete();
}

// firestore.rules — authorization lives HERE, not in app code
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{db}/documents {
//     match /notes/{noteId} {
//       allow read, update, delete:
//         if request.auth != null && request.auth.uid == resource.data.ownerId;
//       allow create:
//         if request.auth != null && request.auth.uid == request.resource.data.ownerId;
//     }
//   }
// }`
      }
    ]
  },
  {
    id: 'firebase-services', phase: 4, phaseName: 'Data, APIs & Firebase',
    orderIndex: 41, estimatedMins: 40, prerequisites: ['cloud-firestore'],
    title: 'Storage, Push, Remote Config & Functions',
    eli5: 'Beyond login and database, Firebase has more rooms: Storage holds big files (photos), Cloud Messaging sends notifications to phones, Remote Config changes app behavior without an update, and Cloud Functions run your code on Google\'s servers.',
    analogy: 'If Firebase is a serviced apartment building, these are the amenities: a storage unit (files), a concierge who delivers messages to residents (push), switchable building rules posted in the lobby (remote config), and an on-call handyman who reacts to events (functions).',
    explanation: 'Four services that complete most production apps: Firebase Storage (user file uploads with progress and rules), Firebase Cloud Messaging (push notifications — the mobile engagement backbone), Remote Config (feature flags and A/B without releases), and Cloud Functions (server-side logic triggered by events or HTTPS).',
    technicalDeep: 'Storage: ref.child(\'avatars/$uid.jpg\').putFile(file) → UploadTask (progress stream, pause/resume) → getDownloadURL(); storage rules mirror Firestore rules (auth-scoped paths); compress client-side first (flutter_image_compress). FCM: firebase_messaging — getToken() (send to your backend), foreground messages via FirebaseMessaging.onMessage (show local notification yourself — flutter_local_notifications), background/terminated taps via onMessageOpenedApp/getInitialMessage (deep-link into content), iOS needs APNs key + capability + explicit permission request; Android 13+ needs runtime permission. Topics (subscribeToTopic(\'news\')) vs token-targeted sends. Remote Config: setDefaults, fetchAndActivate, getBool(\'new_checkout_enabled\') — kill switches, gradual rollouts, A/B tests (pairs with Analytics); minimumFetchInterval caching gotcha in dev. Cloud Functions (Node/TS on Blaze plan): HTTPS callables (FirebaseFunctions.instance.httpsCallable) and triggers (onDocumentCreated → send notification, update counters) — where trusted logic lives (Stripe webhooks, moderation, fan-out).',
    whatBreaks: 'Push on iOS without APNs setup → tokens but no delivery. Expecting system notification UI for foreground messages — you must render those. Remote Config\'s default 12h fetch cache confusing "my flag didn\'t change" in dev. Client-side "admin" logic instead of Functions — clients can\'t be trusted with privileged operations.',
    efficientWay: {
      title: 'Adopting the services',
      approaches: [
        { name: 'FCM early — it shapes architecture', verdict: 'best', reason: 'Token lifecycle, permission UX, and deep-linking touch many layers; bolting on later is painful.' },
        { name: 'Remote Config as kill switches from launch', verdict: 'best', reason: 'Flagging risky features (new checkout) means production incidents become config flips, not emergency releases.' },
        { name: 'Cloud Functions for everything server-ish', verdict: 'ok', reason: 'Right for event fan-out and trusted ops; watch cold starts and per-invocation costs at scale.' }
      ],
      recommendation: 'Adopt in value order: FCM (engagement), Remote Config kill switches (safety), Storage when files appear, Functions when you need trusted logic (counters, webhooks, notification fan-out).'
    },
    commonMistakes: [
      'Requesting push permission on first launch with zero context — denial rates soar; ask in-context.',
      'Uploading full-resolution photos — compress first.',
      'Secrets in Remote Config — it\'s readable client config, not a vault.'
    ],
    seniorNotes: 'The notification fan-out pattern ties it together: Firestore onDocumentCreated(messages/{id}) Function reads participants, fetches their FCM tokens, sends targeted pushes with deep-link payloads — client taps land directly on the right screen via onMessageOpenedApp routing. That end-to-end flow is a strong portfolio piece and interview story.',
    interviewQuestions: [
      'Walk through FCM message handling in foreground, background, and terminated states.',
      'How would you use Remote Config to de-risk a feature launch?',
      'When must logic move from the Flutter client into Cloud Functions?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'FCM + Remote Config (Dart)',
        code: `// â”€â”€ Push notifications setup
final fcm = FirebaseMessaging.instance;
await fcm.requestPermission();                    // ask IN CONTEXT, not at launch
final token = await fcm.getToken();               // ship to your backend

// Foreground: YOU render the notification
FirebaseMessaging.onMessage.listen((msg) {
  localNotifications.show(msg.notification?.title, msg.notification?.body,
      payload: msg.data['route']);
});

// User tapped a notification (app was background) → deep link
FirebaseMessaging.onMessageOpenedApp.listen((msg) {
  router.go(msg.data['route'] ?? '/');            // e.g. /notes/abc123
});

// App launched FROM a notification (was terminated)
final initial = await fcm.getInitialMessage();
if (initial != null) router.go(initial.data['route'] ?? '/');

// â”€â”€ Remote Config: kill switch
final rc = FirebaseRemoteConfig.instance;
await rc.setDefaults({'new_editor_enabled': false});
await rc.fetchAndActivate();

if (rc.getBool('new_editor_enabled')) {
  // new feature path — disable remotely in seconds if it misbehaves
}`
      }
    ]
  },
  {
    id: 'service-repository-pattern', phase: 4, phaseName: 'Data, APIs & Firebase',
    orderIndex: 42, estimatedMins: 35, prerequisites: ['cloud-firestore', 'design-principles'],
    title: 'Service Architecture & Migrations',
    eli5: 'The course migrates the notes app twice — local SQLite to Firestore, raw calls to services — and barely touches the screens. That\'s not luck: it\'s the payoff of hiding every data source behind interfaces the UI depends on.',
    analogy: 'A restaurant that prints supplier names on the menu must reprint menus to change suppliers. A menu that just says "fresh fish" lets the kitchen switch suppliers overnight. Interfaces are menus without supplier names.',
    explanation: 'This topic consolidates the architectural arc of the whole phase: define service/repository interfaces (AuthService, NotesRepository), implement per backend (SQLite, Firestore, REST), inject implementations, and migrate by swapping. Plus the practical migration playbook: dual-running, data backfill, and stream-based caching.',
    technicalDeep: 'The course\'s sequence as a pattern: (1) UI calls Firebase directly (works, untestable, coupled); (2) extract AuthService interface + FirebaseAuthProvider implementation ("Migrating to Auth Service" chapter); (3) NotesService with in-memory cache + BehaviorSubject-style stream over SQLite; (4) swap SQLite → Firestore behind the SAME interface ("Migrating to our Firestore Service") — screens untouched. Migration playbook: define target interface first; adapter per source; feature-flag the switch (Remote Config!); for data: backfill job copies local → cloud on first cloud login, dedupe by ID, tombstones for deletes. Caching layers: repository returns local stream immediately, refreshes from network in background (stale-while-revalidate). Composition root: main.dart (or DI container) is the ONE place implementations are chosen — everything else sees interfaces.',
    whatBreaks: 'Leaky abstractions: interface methods returning QuerySnapshot or Database rows — now every consumer imports Firestore anyway. Interfaces designed after one implementation tend to mirror it (Firestore-shaped methods that SQLite can\'t honor). Migration without a rollback path — flag it.',
    efficientWay: {
      title: 'Architecture for change',
      approaches: [
        { name: 'Interface-first, domain-typed contracts', verdict: 'best', reason: 'Methods speak Note and Stream<List<Note>> — never DocumentSnapshot — so any backend can implement them.' },
        { name: 'Composition root + feature-flagged swaps', verdict: 'best', reason: 'One file decides implementations; Remote Config flips between them safely in production.' },
        { name: 'Abstracting AFTER the second backend appears', verdict: 'ok', reason: 'Pragmatic for MVPs — but budget the refactor; the course shows it\'s genuinely doable.' }
      ],
      recommendation: 'Adopt the contract test trick: one shared test suite that runs against EVERY implementation of NotesRepository (fake, SQLite, Firestore-emulator). If all pass, swaps are provably safe.'
    },
    commonMistakes: [
      'Backend types (DocumentSnapshot, Database) leaking through interface signatures.',
      'God-services (one DataService for auth+notes+settings) — split per domain.',
      'No rollback flag during a storage migration.'
    ],
    seniorNotes: 'This is dependency inversion earning its keep — the "D" from Phase 2 made concrete twice in one course. Interview framing: "I structure data layers so the storage backend is a configuration detail; in my notes app I swapped SQLite for Firestore without modifying a single widget, validated by a shared contract test suite." That sentence is a hire signal.',
    interviewQuestions: [
      'How would you migrate a shipped app from local SQLite to Firestore safely?',
      'What is a contract test and how does it de-risk swapping implementations?',
      'Where should the choice of concrete implementations live?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Swappable backends + contract test (Dart)',
        code: `// Domain-typed contract — no backend types anywhere
abstract class NotesRepository {
  Stream<List<Note>> watch(String userId);
  Future<Note> create(String userId, String text);
  Future<void> delete(String noteId);
}

// Two interchangeable implementations
class SqliteNotesRepository implements NotesRepository { /* Phase-4 local */ }
class FirestoreNotesRepository implements NotesRepository { /* cloud */ }

// Composition root: the ONE place that picks
final notesRepo = remoteConfig.getBool('use_cloud_notes')
    ? FirestoreNotesRepository(FirebaseFirestore.instance)
    : SqliteNotesRepository(localDb);

// Contract test: same suite, every implementation
void notesRepositoryContract(NotesRepository Function() make) {
  group('NotesRepository contract', () {
    test('created note appears in watch stream', () async {
      final repo = make();
      final futureList = repo.watch('u1').firstWhere((l) => l.isNotEmpty);
      await repo.create('u1', 'hello');
      expect((await futureList).first.text, 'hello');
    });
    test('delete removes from stream', () async { /* ... */ });
  });
}
// main: notesRepositoryContract(() => FakeNotesRepo());
//       notesRepositoryContract(() => SqliteNotesRepository(testDb));`
      }
    ]
  },

  /* â”€â”€ PHASE 5: Animations & Internals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'animations-basics', phase: 5, phaseName: 'Animations & Internals',
    orderIndex: 43, estimatedMins: 45, prerequisites: ['stateless-stateful-widgets'],
    title: 'Animations: Controllers, Tweens & Curves',
    eli5: 'Animation is just changing a number smoothly over time — a position sliding from 0 to 200, an opacity fading 0 to 1 — and repainting fast enough (60+ times a second) that it looks like motion.',
    analogy: 'An AnimationController is a film director with a stopwatch: it counts time precisely (0.0 → 1.0), a Tween is the script translating time into values ("at halftime, be halfway across the screen"), and a Curve is the acting style (start slow, end fast).',
    explanation: 'Flutter\'s animation system has two levels: implicit animations (AnimatedContainer, AnimatedOpacity — set a new value, Flutter animates the change automatically) for 80% of needs, and explicit animations (AnimationController + Tween + AnimatedBuilder) when you need control: repeat, reverse, sequence, or physics.',
    technicalDeep: 'Implicit: AnimatedContainer/Opacity/Positioned/Padding/DefaultTextStyle — give duration + curve, change the property, transition runs automatically. TweenAnimationBuilder for one-shot custom implicit animations. Explicit: AnimationController(vsync: this, duration) requires TickerProviderStateMixin (vsync ties to the frame clock, pauses offscreen — battery); .forward()/.reverse()/.repeat(); always dispose(). Tween(begin, end).animate(CurvedAnimation(parent: controller, curve: Curves.easeOutCubic)) maps 0-1 to your values. AnimatedBuilder(animation, builder, child:) rebuilds ONLY the builder closure each tick — pass static subtrees via child (the key perf pattern). Staggered: Interval(0.0, 0.5) curves run multiple tweens on one controller. Transition widgets (Fade/Slide/ScaleTransition) consume animations directly without builder.',
    whatBreaks: 'Forgetting vsync mixin or dispose() — errors and leaks. Rebuilding huge subtrees every tick (no child param) — janky animation, the opposite of the goal. setState per tick instead of AnimatedBuilder. Curves.bounce on serious UI — animation style is UX tone.',
    efficientWay: {
      title: 'Choosing animation tools',
      approaches: [
        { name: 'Implicit widgets first, always', verdict: 'best', reason: 'AnimatedContainer covers most real needs in one line — controllers are for when implicit can\'t.' },
        { name: 'One controller + Intervals for staggered sequences', verdict: 'best', reason: 'Coordinated chains stay in sync and dispose together.' },
        { name: 'Explicit controllers for every fade', verdict: 'weak', reason: 'Ten lines of lifecycle for what AnimatedOpacity does in one.' }
      ],
      recommendation: 'Decision ladder: property change → Animated* widget; one-shot custom → TweenAnimationBuilder; repeat/reverse/sequencing/gesture-driven → AnimationController. Keep durations 150-300ms for UI feedback; respect MediaQuery.disableAnimations for accessibility.'
    },
    commonMistakes: [
      'No child param in AnimatedBuilder — rebuilding the world per frame.',
      'Controllers without dispose — the classic leak.',
      'Animating layout-heavy properties when transform/opacity (compositor-cheap) would do.'
    ],
    seniorNotes: 'Animation performance model: transform and opacity changes can stay on the compositor (cheap); width/height/padding changes trigger relayout every frame (expensive). Prefer Transform.translate over animating Positioned offsets in hot paths. Profile with the performance overlay — animation jank is the most VISIBLE jank.',
    interviewQuestions: [
      'Implicit vs explicit animations — when does each fit?',
      'What does vsync do and why is it required?',
      'Why is the child parameter of AnimatedBuilder important?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Implicit + explicit animations (Dart)',
        code: `// IMPLICIT: change a value, Flutter animates the difference
AnimatedContainer(
  duration: const Duration(milliseconds: 250),
  curve: Curves.easeOutCubic,
  width: expanded ? 300 : 120,
  decoration: BoxDecoration(
    color: expanded ? Colors.sky : Colors.indigo,
    borderRadius: BorderRadius.circular(expanded ? 24 : 12),
  ),
  child: content,
)
// onTap: () => setState(() => expanded = !expanded)

// EXPLICIT: full control
class PulseState extends State<Pulse> with SingleTickerProviderStateMixin {
  late final _ctrl = AnimationController(
      vsync: this, duration: const Duration(seconds: 1))..repeat(reverse: true);
  late final _scale = Tween(begin: 1.0, end: 1.15)
      .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _scale,
    child: const HeartIcon(),            // built ONCE, reused every tick
    builder: (context, child) =>
        Transform.scale(scale: _scale.value, child: child),
  );
}`
      }
    ]
  },
  {
    id: 'hero-implicit-animations', phase: 5, phaseName: 'Animations & Internals',
    orderIndex: 44, estimatedMins: 30, prerequisites: ['animations-basics', 'navigation-routing'],
    title: 'Hero, Page Transitions & Motion Polish',
    eli5: 'Hero animations make an image fly smoothly from a list into the detail screen — the same photo appears to travel between pages. It\'s the single trick that makes apps feel expensive.',
    analogy: 'Without Hero, switching screens is a hard cut between camera angles. With Hero, it\'s a tracking shot — the camera follows the subject from one scene into the next, and your brain reads it as one continuous space.',
    explanation: 'Motion polish lives here: Hero (shared-element transitions between routes), AnimatedSwitcher (cross-fade when content changes), custom page transitions (PageRouteBuilder), and the animations package (Material motion: container transform, shared axis). Small effort, outsized perceived quality.',
    technicalDeep: 'Hero(tag: noteId, child: image) on BOTH screens with matching tags — during the route transition Flutter lifts the child to an overlay and tweens its rect between positions; tags must be unique per screen; mismatched child shapes use flightShuttleBuilder. AnimatedSwitcher(duration, child: Text(key: ValueKey(value))) — cross-fades when the child\'s key/type changes (the key is mandatory for same-type swaps). Page transitions: PageRouteBuilder(transitionsBuilder: (c, anim, sec, child) => SlideTransition(...)); themed globally via PageTransitionsTheme. animations package: OpenContainer (card morphs into page — the Material container transform), SharedAxisTransition (paged flows). AnimatedList/SliverAnimatedList for insert/remove row animations. Skeleton loaders (shimmer) > spinners for content-shaped waits.',
    whatBreaks: 'Duplicate Hero tags on one screen → runtime exception mid-transition. AnimatedSwitcher without distinct keys → no animation (same-type children look identical to the diff). Heavy widgets in Hero flights — jank exactly when the user is staring. Overdone motion: 600ms transitions feel broken, not fancy.',
    efficientWay: {
      title: 'Polish that pays',
      approaches: [
        { name: 'Hero on list→detail images + OpenContainer for cards', verdict: 'best', reason: 'The two highest-perceived-value transitions, both nearly free to add.' },
        { name: 'AnimatedSwitcher on changing text/icons', verdict: 'best', reason: 'Counters, status chips, toggles — one wrapper makes every change smooth.' },
        { name: 'Custom transitions on every route', verdict: 'weak', reason: 'Platform defaults are familiar; nonstandard everywhere reads as wrong, not premium.' }
      ],
      recommendation: 'Add Hero to your primary list→detail flow, AnimatedSwitcher to dynamic labels, and stop. Respect platform transition defaults elsewhere. Test reduced-motion accessibility settings.'
    },
    commonMistakes: [
      'Hero tag collisions from using a constant tag in a list — tag with the item ID.',
      'Forgetting keys in AnimatedSwitcher children.',
      'Animating during scroll (parallax everywhere) — scroll smoothness beats decoration.'
    ],
    seniorNotes: 'Motion design has a system: Material motion defines container transform (parent-child), shared axis (siblings/steps), fade-through (unrelated), fade (utility). Naming the pattern you chose and why ("container transform because the card IS the page") signals design literacy beyond engineering.',
    interviewQuestions: [
      'How does Hero actually animate a widget between two routes?',
      'Why does AnimatedSwitcher need keys on its children?',
      'Which Material motion pattern fits a list→detail navigation?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Hero + AnimatedSwitcher (Dart)',
        code: `// Screen A: the list
Hero(
  tag: 'note-\${note.id}',                  // unique per item
  child: NoteThumbnail(note: note),
)

// Screen B: the detail — same tag, Flutter animates between them
Hero(
  tag: 'note-\${note.id}',
  child: NoteHeaderImage(note: note),
)

// AnimatedSwitcher: smooth content swaps
AnimatedSwitcher(
  duration: const Duration(milliseconds: 200),
  transitionBuilder: (child, anim) =>
      FadeTransition(opacity: anim, child: ScaleTransition(scale: anim, child: child)),
  child: Text(
    '$unreadCount',
    key: ValueKey(unreadCount),             // key change triggers the animation
  ),
)

// Card that morphs into its detail page (animations package)
OpenContainer(
  closedBuilder: (context, open) => NoteCard(note: note, onTap: open),
  openBuilder: (context, close) => NoteDetailPage(note: note),
  transitionType: ContainerTransitionType.fadeThrough,
)`
      }
    ]
  },
  {
    id: 'flutter-internals', phase: 5, phaseName: 'Animations & Internals',
    orderIndex: 45, estimatedMins: 45, prerequisites: ['widgets-intro', 'stateless-stateful-widgets'],
    title: 'Flutter Internals: The Three Trees',
    eli5: 'Behind your widget code, Flutter secretly maintains three parallel structures: your blueprints (widgets), the construction managers (elements), and the actual buildings (render objects). Knowing this explains nearly every "why does Flutter…" mystery.',
    analogy: 'Widgets are architectural drawings — cheap to redraw and throw away. Elements are the site managers who compare new drawings to the standing building and order only the needed changes. RenderObjects are the physical structure — expensive, so reused whenever the drawings allow.',
    explanation: 'The widget/element/render-object trio is Flutter\'s core design: immutable widget configs rebuilt constantly, persistent elements diffing and holding state, and heavyweight render objects doing layout/paint only when truly needed. Keys, GlobalKeys, state preservation, and performance all derive from this.',
    technicalDeep: 'Reconciliation: on rebuild, each element checks canUpdate(oldWidget, newWidget) — same runtimeType AND same key → element survives, updates config, render object mutates in place; different → element (and its State!) is torn down and rebuilt. This is WHY State persists across rebuilds and why keys matter in lists: without keys, a removed first row makes every element shift identity (state sticks to position); ValueKey(id) lets elements follow their data. GlobalKey: element findable from anywhere (FormState access), and subtree REPARENTING without losing state (moving a player widget between layouts). Immutability everywhere: widgets are const-able because they\'re pure config — the diff makes immutability cheap. RenderObject layer: performLayout (the constraints protocol from Phase 2), paint, compositing layers; RepaintBoundary inserts a layer so a repainting child doesn\'t dirty its parent (use around frequently-updating regions). BuildOwner/PipelineOwner orchestrate the frame: build → layout → paint → composite.',
    whatBreaks: 'Stateful list items without keys → checkbox states attached to row POSITIONS, chaos on reorder. GlobalKey collisions (same key, two places) → crash. RepaintBoundary everywhere "for performance" — each costs memory; place by measurement. Misreading "rebuild" as "re-layout" — most rebuilds never touch render objects.',
    efficientWay: {
      title: 'Internalizing internals',
      approaches: [
        { name: 'Learn via the bugs keys fix', verdict: 'best', reason: 'Build a stateful list, reorder it, watch state misattach, add ValueKeys, watch it heal — unforgettable.' },
        { name: 'DevTools widget rebuild stats', verdict: 'best', reason: 'See the diff working: what rebuilt, what didn\'t, and why const subtrees skip.' },
        { name: 'Reading framework source cold', verdict: 'ok', reason: 'Genuinely readable (framework.dart), but land the mental model first.' }
      ],
      recommendation: 'Anchor on one sentence: "elements persist and diff; widgets describe; render objects work." Then explain three phenomena with it: why State survives rebuilds, why list keys matter, why const helps. If you can teach those, you own the model.'
    },
    commonMistakes: [
      'Believing rebuilds recreate everything — elements and render objects mostly survive.',
      'Keys everywhere or nowhere — they matter exactly where children of the same type reorder.',
      'GlobalKeys as a state-access convenience — they\'re for identity, not a Provider substitute.'
    ],
    seniorNotes: 'THE Flutter senior interview chain: "Explain the three trees" → "so why do keys exist?" → "when does an element NOT survive?" → "what does GlobalKey enable?" Practice that chain aloud. Bonus depth: how RepaintBoundary creates compositor layers and when Flutter inserts them automatically (scrollables do).',
    interviewQuestions: [
      'Walk through what happens, tree by tree, when setState is called.',
      'Why do keys fix state misbehavior in reorderable lists?',
      'What can a GlobalKey do that a ValueKey cannot?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Keys and element identity (Dart)',
        code: `// BUG: stateful tiles without keys
// Remove item 0 → every element shifts → checkbox states
// now belong to the WRONG items (state stuck to position)
ListView(
  children: todos.map((t) => TodoTile(todo: t)).toList(),
)

// FIX: keys let elements follow their data
ListView(
  children: todos.map((t) =>
      TodoTile(key: ValueKey(t.id), todo: t)).toList(),
)

// canUpdate — the diff's core rule (framework source, simplified):
// static bool canUpdate(Widget old, Widget neu) =>
//     old.runtimeType == neu.runtimeType && old.key == neu.key;
// true  → element survives, State survives, render object updates
// false → subtree torn down and rebuilt from scratch

// RepaintBoundary: isolate a hot-repainting region
Column(children: [
  const ExpensiveStaticHeader(),       // const: skipped in rebuilds entirely
  RepaintBoundary(                     // ticking clock repaints alone,
    child: LiveTickingClock(),         // header's layer untouched
  ),
])`
      }
    ]
  },
  {
    id: 'performance-optimization', phase: 5, phaseName: 'Animations & Internals',
    orderIndex: 46, estimatedMins: 45, prerequisites: ['flutter-internals', 'scrollable-widgets'],
    title: 'Performance & Memory Optimization',
    eli5: 'Phones draw your app 60-120 times per second. Each drawing must finish in ~8-16 milliseconds — miss the deadline and users see stutter (jank). Performance work is finding what makes frames late and fixing exactly that.',
    analogy: 'A frame budget is a kitchen pushing out a dish every 16 seconds flat. One slow station (heavy build, giant image decode) and dishes leave late — customers notice immediately. You don\'t renovate the whole kitchen; you time each station and fix the bottleneck.',
    explanation: 'Flutter performance discipline: measure first (DevTools timeline, profile mode), then apply the standard fixes — const constructors, narrowed rebuild scopes, lazy lists, RepaintBoundary, image sizing, and isolates for CPU work. Memory: leaks come from undisposed controllers/subscriptions and oversized image caches.',
    technicalDeep: 'Frame anatomy: UI thread (build/layout/paint commands) + raster thread (GPU execution) — jank in DevTools shows which is guilty. UI-thread fixes: const widgets (diff skips them), pull state DOWN (rebuild leaves, not screens — select/buildWhen from Phase 3), avoid Opacity widget (saveLayer — use FadeTransition/colors with alpha), itemExtent on lists, compute() for parsing. Raster-thread fixes: fewer saveLayers (Opacity, some clips), RepaintBoundary around hot regions, cheaper shadows. Images: cacheWidth/cacheHeight to decode at display size (a 4000px photo in a 100px tile decodes 40x the pixels!), cached_network_image, imageCache.maximumSizeBytes tuning. Memory: DevTools memory view; usual suspects — undisposed AnimationControllers/StreamSubscriptions/TextEditingControllers, listeners added but never removed, images. Always measure in profile mode on a REAL device — debug mode is 5-10x slower and emulators lie.',
    whatBreaks: 'Optimizing in debug mode — you\'ll fix phantom problems and miss real ones. const-spamming without measuring (helps, but the 80% win is usually one giant rebuild scope or one unsized image). Premature RepaintBoundaries costing memory for nothing.',
    efficientWay: {
      title: 'Performance workflow',
      approaches: [
        { name: 'Profile mode + DevTools timeline → fix the worst frame', verdict: 'best', reason: 'The flame chart names the expensive widget; fixing measured problems is 10x more effective than guessing.' },
        { name: 'Rebuild-scope hygiene as you code', verdict: 'best', reason: 'const, select, child params — free habits that prevent most jank before it exists.' },
        { name: 'Optimization sprint after "the app feels slow"', verdict: 'weak', reason: 'Vague complaints, accumulated debt, no baselines — measure continuously instead.' }
      ],
      recommendation: 'The four-step loop: reproduce in profile mode on a real device → DevTools timeline → identify UI vs raster and the exact widget → apply the targeted fix → re-measure. Decode images at display size TODAY — it\'s the most common silent win.'
    },
    commonMistakes: [
      'Network images without cacheWidth — decoding wallpaper-sized bitmaps for thumbnails.',
      'Spinners powered by setState rebuilding entire screens 60fps.',
      'Forgetting dispose() — memory creep that ANRs after ten minutes of use.'
    ],
    seniorNotes: 'Senior performance answers are workflow answers: "profile mode, real device, timeline, UI-vs-raster diagnosis, targeted fix, regression guard." Add jank budgets to CI with integration_test\'s traceAction + frame stats for hot flows. Knowing Impeller (the modern renderer eliminating shader-compilation jank on iOS) is current-events credit.',
    interviewQuestions: [
      'A screen janks during scroll — walk me through your diagnosis.',
      'Why is the Opacity widget expensive and what replaces it?',
      'How do oversized images hurt, and what\'s the one-line fix?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'The standard performance fixes (Dart)',
        code: `// 1. Decode images at DISPLAY size, not file size
Image.network(url,
  cacheWidth: 200,            // decode 200px, not 4000px
  fit: BoxFit.cover)

// 2. Narrow rebuild scope: only the count rebuilds, not the screen
final count = context.select<CartModel, int>((c) => c.items.length);

// 3. const subtrees are skipped by the diff entirely
const ExpensiveStaticHeader()

// 4. Fixed-height rows: scroll math becomes O(1)
ListView.builder(itemExtent: 72, ...)

// 5. FadeTransition over Opacity (no saveLayer)
FadeTransition(opacity: animation, child: card)

// 6. CPU work off the UI thread
final parsed = await compute(parseBigJson, body);

// 7. Profile properly
// flutter run --profile          ← never judge perf in debug
// DevTools → Performance → record → inspect the tallest frame`
      }
    ]
  },
  {
    id: 'dev-tools-inspector', phase: 5, phaseName: 'Animations & Internals',
    orderIndex: 47, estimatedMins: 30, prerequisites: ['flutter-internals'],
    title: 'DevTools, Inspector & Debugging',
    eli5: 'Flutter DevTools is your app\'s X-ray machine: see the widget tree of the running app, watch which widgets rebuild, track memory, inspect network calls, and read every log — all live while you click around.',
    analogy: 'Debugging without DevTools is fixing a car engine by listening to it. DevTools opens the hood with sensors attached: every part labeled, temperatures live, and a slow-motion replay of any misfire (frame).',
    explanation: 'The Flutter tooling suite: Widget Inspector (explore/select widgets, view constraints, toggle guidelines), Performance view (frame timeline), Memory, Network, Logging, and CPU profiler — plus in-code tools: debugPrint, debugger() breakpoints, assert-only code, and error customization. Daily fluency here is a productivity multiplier.',
    technicalDeep: 'Inspector: select-widget mode taps a widget on device → jumps to source; Layout Explorer visualizes flex/constraints (THE tool for layout mysteries); Debug Paint (guidelines), Slow Animations (5x), Repaint Rainbow (flashing colors = repaint regions — find over-painting). Performance: frame chart, UI/raster split, "Track widget rebuilds" in IDE shows rebuild counts inline. Network tab: every http call with timing/payloads. Logging: structured dart:developer log() over print (levels, names); debugPrint throttles to avoid dropped lines. Breakpoints in VS Code/Android Studio; conditional breakpoints; debugger(when:) programmatic. Error surfaces: FlutterError.onError (framework errors), PlatformDispatcher.onError (uncaught async) — route both to Crashlytics in production (Phase 7). kDebugMode guards and assert(() {...}()) for debug-only code.',
    whatBreaks: 'print-debugging production-grade problems that the timeline answers in seconds. Leaving Repaint Rainbow conclusions unverified in profile mode. Debugging release-build-only crashes without symbolication (Phase 7 covers it).',
    efficientWay: {
      title: 'Debugging workflow',
      approaches: [
        { name: 'Inspector select-mode + Layout Explorer for UI bugs', verdict: 'best', reason: 'Tap the wrong-looking widget, see its constraints — most layout bugs solve themselves on sight.' },
        { name: 'Breakpoints over prints for logic bugs', verdict: 'best', reason: 'Full variable state, step-through, conditions — prints are stone tools by comparison.' },
        { name: 'print() everywhere always', verdict: 'weak', reason: 'Fine for a quick trace; a habit that caps your debugging ceiling.' }
      ],
      recommendation: 'Bind the Inspector to muscle memory this week: every layout surprise → select mode → Layout Explorer. Every logic bug → breakpoint, not print. Every jank → Performance tab in profile mode.'
    },
    commonMistakes: [
      'Debugging layout by code-staring when Layout Explorer draws the answer.',
      'print in hot paths shipping to release (and slowing debug).',
      'Never opening DevTools because the IDE inline tools feel "enough".'
    ],
    seniorNotes: 'Teams standardize observability: dart:developer log with named channels, FlutterError.onError + PlatformDispatcher.onError wired to crash reporting from day one, and a debug screen (build info, flags, environment) in internal builds. "How do you debug X?" interview answers should name specific DevTools views, not just "I\'d debug it".',
    interviewQuestions: [
      'Which DevTools view answers "why is this widget this size?"',
      'How do you find which widgets rebuild too often?',
      'How do you capture uncaught async errors in Flutter?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Debug tooling setup (Dart)',
        code: `// Structured logging beats print
import 'dart:developer' as dev;
dev.log('note created', name: 'notes.service', error: null);

// Debug-only code, stripped from release
if (kDebugMode) {
  dev.log('cache size: \${cache.length}', name: 'debug');
}
assert(() {
  // expensive checks that only run in debug builds
  validateStateInvariants();
  return true;
}());

// Catch EVERYTHING (wire to Crashlytics in production)
void main() {
  FlutterError.onError = (details) {
    FlutterError.presentError(details);        // framework errors
    // crashlytics.recordFlutterError(details);
  };
  PlatformDispatcher.instance.onError = (error, stack) {
    // crashlytics.recordError(error, stack);   // uncaught async errors
    return true;
  };
  runApp(const MyApp());
}

// Programmatic breakpoint when a condition hits
import 'dart:developer';
void onWeirdState(Order order) {
  debugger(when: order.total < 0);   // pauses the debugger right here
}`
      }
    ]
  },
  {
    id: 'streams-builders-ui', phase: 5, phaseName: 'Animations & Internals',
    orderIndex: 48, estimatedMins: 35, prerequisites: ['dart-async', 'cloud-firestore'],
    title: 'FutureBuilder & StreamBuilder',
    eli5: 'FutureBuilder and StreamBuilder are widgets that watch async data and rebuild themselves when it arrives: show a spinner while loading, the data when it comes, an error message if it fails — all declared in one place.',
    analogy: 'A StreamBuilder is a departures board at an airport: permanently wired to the data feed, it re-renders itself every time the feed updates — you don\'t refresh it, it refreshes itself.',
    explanation: 'These two widgets glue async Dart (Phase 0) to widget trees: FutureBuilder renders one eventual value (an API call), StreamBuilder renders a live sequence (Firestore snapshots, auth state). Used well they\'re elegant; used carelessly they cause the most classic Flutter bugs (re-fired futures, missed states).',
    technicalDeep: 'FutureBuilder(future, builder): builder receives AsyncSnapshot — connectionState (waiting/active/done), hasData/data, hasError/error. THE bug: creating the future IN build (future: fetchNotes()) — every rebuild refires the request (spinner loops, duplicate calls); fix: create once in initState, reference the field. StreamBuilder: same snapshot API over a stream; waiting = before first event; remember a stream CAN emit errors then continue. initialData skips the first spinner when a cached value exists. Exhaustive snapshot handling: waiting → spinner; hasError → retryable error UI; hasData → content; else (done, no data) → empty state. Beyond basics: multiple builders nesting → lift to one combined stream (combineLatest, Phase 3) or proper state management; for whole-feature state, BLoC/Riverpod\'s AsyncValue patterns supersede builders (they ARE StreamBuilder, structured). The course\'s notes list = StreamBuilder over the notes service stream.',
    whatBreaks: 'future: in build → infinite refetch loop (the #1 FutureBuilder bug, easily a top-5 all-Flutter bug). Ignoring snapshot.hasError → silent blank screens on failure. Streams without initialData flashing spinners over already-known data. Nesting four builders → pyramid of doom; restructure.',
    efficientWay: {
      title: 'Async UI patterns',
      approaches: [
        { name: 'Future created in initState, builder renders all 4 states', verdict: 'best', reason: 'Stable future identity + exhaustive states = correct by construction.' },
        { name: 'StreamBuilder directly over service streams', verdict: 'best', reason: 'Firestore/auth streams into UI with zero ceremony — perfect for read-only live views.' },
        { name: 'Builders for complex multi-action features', verdict: 'weak', reason: 'Loading-while-mutating, retries, optimistic updates — that\'s state management\'s job (Phase 3).' }
      ],
      recommendation: 'Builders for read-only async display; BLoC/Riverpod when the screen also mutates. Either way, write the four-state handling (waiting/error/data/empty) every single time — blank-screen bugs live in the skipped branches.'
    },
    commonMistakes: [
      'Future construction inside build — refetch on every rebuild.',
      'No error branch — failures render as eternal spinners or blanks.',
      'Forgetting the empty state (hasData but list is empty) — different UX than loading.'
    ],
    seniorNotes: 'Connect the dots for interviews: StreamBuilder is just a StatefulWidget managing a subscription and calling setState per event — you could write it in 30 lines (great exercise). AsyncValue.when (Riverpod) and BlocBuilder are the same pattern with better state modeling. One mental model, four APIs.',
    interviewQuestions: [
      'Why must FutureBuilder\'s future not be created in build?',
      'Walk through all AsyncSnapshot states and the UI for each.',
      'When do you graduate from StreamBuilder to BLoC/Riverpod?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Correct builder usage (Dart)',
        code: `class NotesListView extends StatefulWidget {
  const NotesListView({super.key});
  @override
  State<NotesListView> createState() => _NotesListViewState();
}

class _NotesListViewState extends State<NotesListView> {
  late final Future<List<Note>> _notesFuture;   // created ONCE

  @override
  void initState() {
    super.initState();
    _notesFuture = notesApi.fetchNotes();        // NOT in build!
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Note>>(
      future: _notesFuture,
      builder: (context, snap) {
        if (snap.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snap.hasError) {
          return ErrorRetry(error: snap.error!,
              onRetry: () => setState(() => _notesFuture = notesApi.fetchNotes()));
        }
        final notes = snap.data ?? [];
        if (notes.isEmpty) return const EmptyNotesPlaceholder();  // 4th state!
        return NotesList(notes: notes);
      },
    );
  }
}

// StreamBuilder over a live source — same four-state discipline
StreamBuilder<List<Note>>(
  stream: notesService.watchNotes(userId),
  initialData: notesService.cached,     // skip spinner if we have data
  builder: (context, snap) { /* same exhaustive handling */ },
)`
      }
    ]
  },

  /* â”€â”€ PHASE 6: Testing & Quality â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'unit-testing-flutter', phase: 6, phaseName: 'Testing & Quality',
    orderIndex: 49, estimatedMins: 45, prerequisites: ['service-repository-pattern'],
    title: 'Unit Testing & Mocking',
    eli5: 'A unit test is a robot that checks one piece of your code automatically: "when I call login with a wrong password, does it throw the right error?" Write the check once, and the robot re-verifies it forever — on every change.',
    analogy: 'Unit tests are smoke detectors installed per room: each one watches one specific thing, costs little, and the moment a change starts a fire in the logic, the right alarm names the exact room.',
    explanation: 'Unit tests verify pure Dart logic — services, blocs, models, validators — without widgets or devices. This is where the architecture investment pays out: code depending on injected interfaces tests in milliseconds with fakes. The course unit-tests its AuthService; you\'ll test everything below the widget line.',
    technicalDeep: 'flutter_test (bundled): test(\'description\', () {...}), group, setUp/tearDown, expect(actual, matcher) — matchers: equals, isA<T>(), throwsA(isA<AuthException>()), emitsInOrder for streams, completion for futures. Async tests: just async/await; fakeAsync/FakeTimer for time control (debounce tests without real waits). Mocking: mocktail (no codegen) — class MockAuthService extends Mock implements AuthService; when(() => mock.logIn(any(), any())).thenAnswer((_) async => user); verify(() => mock.logIn(\'a@b.c\', any())).called(1); registerFallbackValue for custom arg types. bloc_test package: blocTest(build:, act:, expect: [AuthLoading, AuthSuccess]) — bloc testing as data. Coverage: flutter test --coverage → lcov; chase meaningful coverage (logic branches), not %. AAA structure: Arrange (mocks/inputs), Act (call), Assert (expect + verify).',
    whatBreaks: 'Testing implementation details (verifying internal call order) → tests break on every refactor while catching nothing. Real dependencies (network/DB) in unit tests → slow, flaky, CI-hostile. Untestable code (static singletons, new-ed dependencies) discovered at test-writing time — the architecture lesson, learned backwards.',
    efficientWay: {
      title: 'What to unit test',
      approaches: [
        { name: 'Blocs/services first — the logic core', verdict: 'best', reason: 'Highest bug density, cheapest to test (pure Dart + fakes), the tests that catch real regressions.' },
        { name: 'bloc_test for every bloc', verdict: 'best', reason: 'Event-in → states-out as declarative data; the entire state machine verified per test.' },
        { name: '100% coverage as the goal', verdict: 'weak', reason: 'Testing getters to hit a number wastes time; cover branches where bugs actually live.' }
      ],
      recommendation: 'Test pyramid: many unit tests (logic), some widget tests (UI behavior), few integration tests (critical journeys). Start with your AuthBloc: wrong-password, success, and network-failure paths — three tests that would each catch a real production bug.'
    },
    commonMistakes: [
      'Mocking the class under test instead of its dependencies.',
      'One mega-test per feature instead of one behavior per test.',
      'No failure-path tests — the error branches are where bugs hide.'
    ],
    seniorNotes: 'The senior habit: every bug fix starts with a failing test reproducing it — the fix turns it green, and that bug is extinct forever. Combined with the contract tests from Phase 4 (one suite, every repository implementation), your data layer becomes provably swappable.',
    interviewQuestions: [
      'How does dependency injection enable unit testing?',
      'What does blocTest verify and how?',
      'Mock vs fake vs stub — what\'s the difference?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Bloc unit tests with mocktail (Dart)',
        code: `class MockAuthService extends Mock implements AuthService {}

void main() {
  late MockAuthService auth;
  setUp(() => auth = MockAuthService());

  blocTest<AuthBloc, AuthState>(
    'emits [Loading, Success] when login succeeds',
    build: () {
      when(() => auth.logIn(any(), any()))
          .thenAnswer((_) async => const AppUser(id: 'u1', email: 'a@b.c'));
      return AuthBloc(auth);
    },
    act: (bloc) => bloc.add(LoginRequested('a@b.c', 'password123')),
    expect: () => [isA<AuthLoading>(), isA<AuthSuccess>()],
    verify: (_) => verify(() => auth.logIn('a@b.c', 'password123')).called(1),
  );

  blocTest<AuthBloc, AuthState>(
    'emits [Loading, Failure] with friendly message on wrong password',
    build: () {
      when(() => auth.logIn(any(), any()))
          .thenThrow(AuthException('Incorrect email or password.'));
      return AuthBloc(auth);
    },
    act: (bloc) => bloc.add(LoginRequested('a@b.c', 'nope')),
    expect: () => [
      isA<AuthLoading>(),
      isA<AuthFailure>().having((s) => s.message, 'message',
          'Incorrect email or password.'),
    ],
  );

  test('validator rejects short passwords', () {
    expect(Validators.password('12345'), isNotNull);   // returns error text
    expect(Validators.password('longenough1'), isNull); // valid
  });
}`
      }
    ]
  },
  {
    id: 'widget-testing', phase: 6, phaseName: 'Testing & Quality',
    orderIndex: 50, estimatedMins: 40, prerequisites: ['unit-testing-flutter', 'forms-input'],
    title: 'Widget Testing',
    eli5: 'Widget tests run your actual UI in a simulated environment: "render the login screen, type into the email field, tap the button — did the right thing happen?" No emulator needed; it runs in milliseconds.',
    analogy: 'A widget test is a flight simulator for one screen: real controls, real instrument responses, scripted scenarios — but no airplane, no fuel, and a crash costs nothing.',
    explanation: 'Widget tests sit between unit tests (no UI) and integration tests (real device): they pump widget trees into a test harness, find elements, simulate gestures, and assert what renders. The sweet spot for testing form validation, conditional rendering, and per-state UI.',
    technicalDeep: 'testWidgets(\'…\', (tester) async {...}): tester.pumpWidget(harness) renders; wrap targets in MaterialApp/Scaffold (and providers — the harness mirrors the real ancestry). Finders: find.text, find.byType, find.byKey(Key(\'login-button\')) (stable test IDs), find.byIcon, find.descendant. Actions: tester.tap/enterText/drag/longPress — then tester.pump() (one frame), pump(duration) (advance time), pumpAndSettle() (until animations finish — beware infinite animations hanging it). Assertions: expect(finder, findsOneWidget/findsNothing/findsNWidgets(n)). Async UI: pump() after triggering futures. Fake dependencies injected via the same DI as production (BlocProvider(create: (_) => mockBloc)) — mocktail mocks work directly. Golden tests: expect(find.byType(Card), matchesGoldenFile(\'card.png\')) — pixel-regression for design systems. Run headless: flutter test, in CI, milliseconds per test.',
    whatBreaks: 'pumpAndSettle hanging forever on repeating animations (use bounded pumps). Tests coupled to copy text (find.text(\'Submit\')) breaking on every wording tweak — prefer Keys for actionable elements. Missing ancestors (no MaterialApp → "No Directionality widget found" and friends).',
    efficientWay: {
      title: 'Widget testing strategy',
      approaches: [
        { name: 'Test behavior per state: given state X, UI shows Y', verdict: 'best', reason: 'Pump the widget with a mocked bloc per state — loading shows spinner, failure shows dialog — fast and meaningful.' },
        { name: 'Keys on interactive elements', verdict: 'best', reason: 'find.byKey survives redesigns and copy changes; find.text doesn\'t.' },
        { name: 'Golden tests for everything', verdict: 'ok', reason: 'Great for design systems; brittle for whole screens (every font/platform change breaks them).' }
      ],
      recommendation: 'A reusable pumpApp(tester, child, {blocs}) harness extension pays for itself by test ten. Test each screen\'s state-to-UI mapping: one test per meaningful state, plus the critical interactions (validation errors, button-disabled-while-loading).'
    },
    commonMistakes: [
      'Forgetting await tester.pump() after actions — asserting against the pre-action frame.',
      'Testing through real services because the harness lacks DI — inject mocks like production does.',
      'One test asserting forty things — failures become archaeology.'
    ],
    seniorNotes: 'The high-value widget tests mirror the course\'s error-handling chapters: "wrong password → error dialog appears", "submit disables while loading", "empty notes → placeholder renders". State-driven UI (Phase 3) makes these nearly free: mock the bloc, emit the state, assert the widgets.',
    interviewQuestions: [
      'pump vs pumpAndSettle — when does each apply and what\'s the hang risk?',
      'How do you provide mocked blocs/providers inside a widget test?',
      'What belongs in widget tests vs integration tests?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Login screen widget test (Dart)',
        code: `extension PumpApp on WidgetTester {
  Future<void> pumpApp(Widget child, {AuthBloc? authBloc}) => pumpWidget(
    MaterialApp(home: BlocProvider.value(
      value: authBloc ?? MockAuthBloc(), child: child)),
  );
}

void main() {
  testWidgets('shows validation error for invalid email', (tester) async {
    await tester.pumpApp(const LoginView());

    await tester.enterText(find.byKey(const Key('email-field')), 'not-an-email');
    await tester.tap(find.byKey(const Key('login-button')));
    await tester.pump();                       // let validation render

    expect(find.text('Enter a valid email address'), findsOneWidget);
  });

  testWidgets('disables button and shows spinner while loading', (tester) async {
    final bloc = MockAuthBloc();
    whenListen(bloc, Stream.value(AuthLoading()), initialState: AuthInitial());

    await tester.pumpApp(const LoginView(), authBloc: bloc);
    await tester.pump();

    final button = tester.widget<FilledButton>(find.byKey(const Key('login-button')));
    expect(button.onPressed, isNull);          // disabled
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
}`
      }
    ]
  },
  {
    id: 'integration-testing', phase: 6, phaseName: 'Testing & Quality',
    orderIndex: 51, estimatedMins: 35, prerequisites: ['widget-testing'],
    title: 'Integration Testing',
    eli5: 'Integration tests run your WHOLE app on a real device or emulator and act like a robot user: launch, register, create a note, log out — verifying the entire journey works end-to-end, exactly as users experience it.',
    analogy: 'Unit tests check each car part on a bench; widget tests check the dashboard works when wired up; integration tests put a crash-test dummy in the driver\'s seat and drive the actual car around the track.',
    explanation: 'Integration tests (integration_test package) execute full user flows on real devices/emulators with everything live: real rendering, real navigation, real plugins (and optionally real-ish backends via emulators). Slow but irreplaceable for the critical paths — the flows where breakage means losing users.',
    technicalDeep: 'Setup: integration_test in dev_dependencies; tests in integration_test/ folder; IntegrationTestWidgetsFlutterBinding.ensureInitialized(); same testWidgets API — pump your REAL main app (app.main() or pumpWidget(const MyApp())). Run: flutter test integration_test -d <device>. Backends: Firebase Emulator Suite (auth + Firestore local — useAuthEmulator/useFirestoreEmulator) keeps tests hermetic: no prod data, free, resettable per test. Performance capture: traceAction + reportData for frame timings of hot flows (jank budgets in CI). Device farms: Firebase Test Lab runs them across real device matrices. Patrol package extends to NATIVE interactions (permission dialogs, notifications) that plain integration_test can\'t touch. Screenshots: binding.takeScreenshot for visual artifacts. Flakiness discipline: explicit waits on finders (no arbitrary sleeps), unique test accounts, reset state per test.',
    whatBreaks: 'Tests against production Firebase — polluted data, costs, and rate limits. Sleep-based waits → flaky in CI, slow everywhere. Testing every feature at this level — minutes per test makes broad coverage unmaintainable; that\'s what the lower pyramid layers are for.',
    efficientWay: {
      title: 'Integration test scope',
      approaches: [
        { name: '3-5 critical journeys only', verdict: 'best', reason: 'Register→verify→login, create→edit→delete note, logout — the flows that page you at night.' },
        { name: 'Firebase Emulator Suite as the backend', verdict: 'best', reason: 'Hermetic, fast, free, resettable — production parity without production risk.' },
        { name: 'Full regression suite as integration tests', verdict: 'weak', reason: 'Hour-long flaky CI runs that teams learn to ignore — the pyramid inverted.' }
      ],
      recommendation: 'Keep integration tests few, fat, and critical: complete journeys touching auth + data + navigation. Everything narrower belongs in widget/unit tests. Wire the emulator suite once; every test after is free.'
    },
    commonMistakes: [
      'Arbitrary Duration sleeps instead of pumping until a finder appears.',
      'Shared test accounts across runs — state bleed makes failures random.',
      'Skipping integration tests entirely because "widget tests pass" — plugins and navigation only break for real on devices.'
    ],
    seniorNotes: 'CI reality: integration tests on emulators in GitHub Actions (Android easy, iOS needs macOS runners) on every PR for the critical 3-5; the full device-matrix run (Test Lab) nightly. Tie frame-timing budgets (traceAction) to the same runs — performance regressions caught with correctness ones.',
    interviewQuestions: [
      'What belongs at each level of the test pyramid in Flutter?',
      'How do you make integration tests hermetic with a Firebase backend?',
      'How would you fight flakiness in device tests?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'End-to-end journey test (Dart)',
        code: `// integration_test/auth_flow_test.dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  setUpAll(() async {
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    await FirebaseAuth.instance.useAuthEmulator('localhost', 9099);
    FirebaseFirestore.instance.useFirestoreEmulator('localhost', 8080);
  });

  testWidgets('register → create note → logout journey', (tester) async {
    await tester.pumpWidget(const MyApp());
    await tester.pumpAndSettle();

    // Register a unique account (no state bleed between runs)
    final email = 'test+\${DateTime.now().millisecondsSinceEpoch}@e2e.dev';
    await tester.enterText(find.byKey(const Key('email-field')), email);
    await tester.enterText(find.byKey(const Key('password-field')), 'Passw0rd!');
    await tester.tap(find.byKey(const Key('register-button')));
    await tester.pumpAndSettle();

    // Create a note
    await tester.tap(find.byKey(const Key('new-note-fab')));
    await tester.pumpAndSettle();
    await tester.enterText(find.byKey(const Key('note-text')), 'integration test note');
    await tester.tap(find.byKey(const Key('save-note')));
    await tester.pumpAndSettle();
    expect(find.text('integration test note'), findsOneWidget);

    // Logout returns to login
    await tester.tap(find.byKey(const Key('logout-action')));
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('login-button')), findsOneWidget);
  });
}
// Run: flutter test integration_test -d emulator-5554`
      }
    ]
  },
  {
    id: 'tdd-bdd-flutter', phase: 6, phaseName: 'Testing & Quality',
    orderIndex: 52, estimatedMins: 30, prerequisites: ['unit-testing-flutter'],
    title: 'TDD & BDD',
    eli5: 'TDD flips the order: write the test FIRST (it fails — the feature doesn\'t exist), write just enough code to pass it, clean up, repeat. The tests stop being homework after the fact and become the blueprint you build against.',
    analogy: 'Building without tests-first is sculpting freehand and inspecting at the end. TDD is setting up guide rails before each cut — every move is checked the moment you make it, and the rails remain forever to catch anyone who bumps the work later.',
    explanation: 'TDD (Test-Driven Development): red → green → refactor cycles where tests precede implementation. BDD (Behavior-Driven Development): specs written as behaviors ("Given a logged-in user, When they delete a note, Then it disappears") — readable by non-engineers. In Flutter both shine for logic layers (blocs, services); pragmatic teams apply them selectively.',
    technicalDeep: 'TDD cycle: (1) RED — write a failing test naming the next small behavior; (2) GREEN — minimal code to pass (resist gold-plating); (3) REFACTOR — clean both code and tests under green. Benefits compound where logic is complex: bloc state machines TDD beautifully (blocTest the AuthFailure path before writing the catch). Design pressure: TDD makes untestable design painful immediately — DI violations surface at step 1, not at testing-week. BDD in Flutter: plain bloc_test names following Given/When/Then; or bdd_widget_test / gherkin packages generating tests from .feature files for stakeholder-readable specs. Where TDD strains in Flutter: exploratory UI work (pixel-pushing has no spec yet) — TDD the logic, iterate the UI visually, backfill widget tests for settled behavior.',
    whatBreaks: 'Dogmatic TDD on visual experiments — specs for layouts you\'re still discovering waste cycles. Test-after rationalized as "TDD-ish" — the design pressure (the actual point) is lost. BDD ceremony (cucumber files, step definitions) for a team of two engineers — tooling without the audience it serves.',
    efficientWay: {
      title: 'Applying TDD pragmatically',
      approaches: [
        { name: 'TDD for blocs, services, and bug fixes', verdict: 'best', reason: 'Specs are clear, feedback is instant, and failing-test-first bug fixes prevent regressions forever.' },
        { name: 'Visual-first UI, tests backfilled when settled', verdict: 'best', reason: 'Honest about how UI exploration works; behavior gets locked in once it exists.' },
        { name: 'Full Gherkin BDD for small teams', verdict: 'weak', reason: 'The .feature layer earns its cost only when non-engineers actually read the specs.' }
      ],
      recommendation: 'Adopt two rules this week: every new bloc event handler starts with a failing blocTest; every bug fix starts with a failing reproduction test. That\'s 80% of TDD\'s value with zero dogma.'
    },
    commonMistakes: [
      'Writing ten failing tests upfront — TDD is ONE failing test at a time.',
      'Skipping refactor because green feels done — the third step is where design improves.',
      'Tests mirroring implementation structure instead of behavior — refactors shatter them.'
    ],
    seniorNotes: 'In interviews, the credible TDD story is selective: "I TDD logic layers — blocs and services — where it doubles as design feedback; UI behavior gets widget tests once it stabilizes; every bugfix ships with its reproduction test." Absolutists in either direction read as inexperienced.',
    interviewQuestions: [
      'Walk through one red-green-refactor cycle for a login bloc.',
      'Where does TDD fit poorly in Flutter development?',
      'What is BDD and when does its ceremony pay off?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'TDD a bloc: red → green → refactor (Dart)',
        code: `// STEP 1 — RED: spec the behavior that doesn't exist yet
blocTest<NotesBloc, NotesState>(
  'emits updated list after DeleteRequested',
  build: () {
    when(() => repo.delete('n1')).thenAnswer((_) async {});
    when(() => repo.getNotes()).thenAnswer((_) async => []);
    return NotesBloc(repo)..emit(NotesLoaded([Note(id: 'n1', text: 'bye')]));
  },
  act: (bloc) => bloc.add(DeleteRequested('n1')),
  expect: () => [isA<NotesLoaded>().having((s) => s.notes, 'notes', isEmpty)],
);
// flutter test → FAILS: DeleteRequested doesn't exist. Good.

// STEP 2 — GREEN: minimal implementation
on<DeleteRequested>((event, emit) async {
  await repo.delete(event.noteId);
  emit(NotesLoaded(await repo.getNotes()));
});
// flutter test → PASSES.

// STEP 3 — REFACTOR under green:
// extract a _reload() helper shared with other handlers,
// add error mapping (which starts as... another failing test).`
      }
    ]
  },
  {
    id: 'error-handling-flutter', phase: 6, phaseName: 'Testing & Quality',
    orderIndex: 53, estimatedMins: 35, prerequisites: ['bloc-advanced', 'dev-tools-inspector'],
    title: 'Error Handling Architecture',
    eli5: 'Things WILL go wrong: networks die, servers hiccup, users type nonsense. Error handling architecture decides what happens next — a helpful message and a retry button, or a frozen screen and a one-star review.',
    analogy: 'Errors are kitchen fires. Amateur kitchens have a panicked cook yelling different things each time. Professional kitchens have a fire plan: every station knows what to catch, what to escalate, and exactly what to tell the dining room ("your order needs five more minutes") — never the gory details.',
    explanation: 'Production-grade error handling is layered: typed exceptions at service boundaries (Phase 4), failure states in blocs (Phase 3), friendly UI per failure type, global handlers for the unexpected (Phase 5\'s onError hooks), and crash reporting closing the loop. This topic assembles the complete architecture.',
    technicalDeep: 'The error taxonomy: expected domain failures (wrong password, no internet, validation) — typed, caught, rendered with recovery actions; unexpected bugs (null deref, state corruption) — caught globally, reported, generic apology UI. Layered flow: data layer throws typed exceptions (NetworkException, AuthException with user-presentable messages) → bloc catches, emits Failure states → UI renders per type (retry button for network, field error for validation) → anything escaping reaches FlutterError.onError / PlatformDispatcher.onError / runZonedGuarded → Crashlytics + graceful fallback. Result types as an alternative: Result<T>/Either<Failure, T> (fpdart) make failures explicit in signatures — no invisible throws; heavier syntax, stronger guarantees. ErrorWidget.builder replaces red-screen-of-death with branded fallback in release. Retry design: exponential backoff for transient network; never auto-retry non-idempotent writes; circuit-break repeated failures. Empty vs error vs offline states are DIFFERENT screens — design all three.',
    whatBreaks: 'catch (e) { print(e); } — the error black hole: user sees nothing, you learn nothing. Raw exception strings in dialogs (FirebaseAuthException codes, stack traces). One generic "Something went wrong" for everything — no recovery path, support tickets instead of retries. Swallowing errors in streams (onError missing) killing subscriptions silently.',
    efficientWay: {
      title: 'Error architecture',
      approaches: [
        { name: 'Typed exceptions → failure states → typed UI', verdict: 'best', reason: 'Each layer translates: technical → domain → presentable. Every error has one home and one rendering.' },
        { name: 'Result/Either types at service boundaries', verdict: 'ok', reason: 'Compile-enforced handling — excellent discipline if the team embraces functional style.' },
        { name: 'Global catch-all with generic toast', verdict: 'weak', reason: 'One handler can\'t know recovery actions; "an error occurred" helps no one.' }
      ],
      recommendation: 'Define your exception hierarchy once (AppException → Network/Auth/Validation/Unknown, each with userMessage). Every service maps platform errors into it; every bloc catches it into states; every screen renders failure states with a recovery action. Wire global handlers + Crashlytics for the rest.'
    },
    commonMistakes: [
      'Empty catch blocks — errors deserve handling or propagation, never silence.',
      'Mapping exceptions in the UI layer — too late; do it at the service boundary.',
      'No offline state distinct from error state — "check your connection" beats "error" enormously.'
    ],
    seniorNotes: 'The maturity test of any codebase: grep for catch and read ten of them. Seniors leave a trail of typed translation and deliberate propagation; juniors leave print(e) and empty blocks. Also: error UX is product design — work with design on failure screens like any other screen; they\'re seen millions of times in aggregate.',
    interviewQuestions: [
      'Design the error flow from a failed Firestore write to what the user sees.',
      'Typed exceptions vs Result types — trade-offs?',
      'Which errors should auto-retry, and which must never?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Layered error architecture (Dart)',
        code: `// 1. Domain exception hierarchy — userMessage is part of the contract
sealed class AppException implements Exception {
  String get userMessage;
}
class NetworkException extends AppException {
  @override String get userMessage => 'No connection. Check your internet and retry.';
}
class PermissionException extends AppException {
  @override String get userMessage => 'You don\\'t have access to this item.';
}

// 2. Service boundary: platform errors → domain errors
Future<void> deleteNote(String id) async {
  try {
    await _firestore.collection('notes').doc(id).delete();
  } on FirebaseException catch (e) {
    throw switch (e.code) {
      'unavailable' => NetworkException(),
      'permission-denied' => PermissionException(),
      _ => UnknownException(cause: e),
    };
  }
}

// 3. Bloc: domain errors → failure states (never re-throw to UI)
on<DeleteRequested>((event, emit) async {
  try {
    await repo.deleteNote(event.id);
    emit(NotesLoaded(await repo.getNotes()));
  } on AppException catch (e) {
    emit(NotesFailure(message: e.userMessage, retryEvent: event));
  }
});

// 4. UI: failure state → message + RECOVERY ACTION
if (state is NotesFailure) {
  return ErrorPanel(
    message: state.message,
    onRetry: () => context.read<NotesBloc>().add(state.retryEvent),
  );
}`
      }
    ]
  },
  {
    id: 'linting-code-quality', phase: 6, phaseName: 'Testing & Quality',
    orderIndex: 54, estimatedMins: 25, prerequisites: ['dart-basics'],
    title: 'Linting, Analysis & Code Quality',
    eli5: 'The Dart analyzer is a tireless reviewer reading your code as you type: catching bugs before you run, flagging risky patterns, and enforcing the style rules your whole team agreed on — automatically, on every line.',
    analogy: 'Lints are the spell-check and grammar-check of code: invisible when you write well, instantly underlining the mistake when you don\'t — and far cheaper than a human catching it in review (or a user catching it in production).',
    explanation: 'Dart\'s static analysis is exceptional: the analyzer catches type errors, dead code, and bug patterns live; lint rules (flutter_lints, or stricter sets) enforce idioms; analysis_options.yaml configures it all; CI runs flutter analyze as a merge gate. Free quality, configured once.',
    technicalDeep: 'analysis_options.yaml: include: package:flutter_lints/flutter.yaml (the sane default) → stricter tiers: lints/recommended, very_good_analysis (the strictest popular set). Key rules worth enforcing: always_use_package_imports, prefer_const_constructors (+ literals — your Phase 5 performance wins, automated), avoid_dynamic_calls, unawaited_futures (catches fire-and-forget bugs — a real production-incident class), use_build_context_synchronously (the mounted-check bug from Phase 0, caught statically!), require_trailing_commas (formatter-friendly diffs). language: strict-casts/strict-raw-types for maximum type rigor. dart format: non-negotiable, zero-config, CI-checked (--set-exit-if-changed). dart fix --apply auto-fixes many violations. Custom ignores: // ignore: rule_name (with justification comment) — auditable escape hatches. CI gate: flutter analyze + dart format check + flutter test = the minimum merge bar.',
    whatBreaks: 'Lint debt: enabling strict rules on a mature codebase → 3,000 warnings → team ignores ALL warnings including real ones — ratchet up gradually instead. Ignoring use_build_context_synchronously and unawaited_futures specifically — those two catch real crash classes, not style nits.',
    efficientWay: {
      title: 'Quality automation',
      approaches: [
        { name: 'very_good_analysis + format check in CI from day one', verdict: 'best', reason: 'Strictness is free on greenfield; every rule prevents a category of review comment forever.' },
        { name: 'flutter_lints default for existing codebases', verdict: 'ok', reason: 'The baseline everyone should meet; tighten rule-by-rule with dart fix assists.' },
        { name: 'Style enforcement via human review', verdict: 'weak', reason: 'Burns reviewer goodwill on machine-detectable issues; humans should review design, not commas.' }
      ],
      recommendation: 'New projects: very_good_analysis, dart format in CI, pre-commit hook running both. Existing projects: flutter_lints now, then enable one stricter rule per week with dart fix --apply doing the bulk work.'
    },
    commonMistakes: [
      '// ignore: comments without justification — silent rule erosion.',
      'Formatting wars in review because CI doesn\'t enforce dart format.',
      'Treating analyzer warnings as suggestions — warnings are bugs with patience.'
    ],
    seniorNotes: 'The two lints that pay rent: unawaited_futures (every unawaited async call is either intentional — wrap in unawaited() — or a bug) and use_build_context_synchronously (statically catches the post-await context crash). A codebase at zero-warnings with these enabled has measurably fewer production incidents.',
    interviewQuestions: [
      'Which lint rules catch real bugs rather than style issues?',
      'How do you introduce strict linting to a legacy codebase without chaos?',
      'What does use_build_context_synchronously protect against?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'Quality setup',
        code: `# analysis_options.yaml
# include: package:very_good_analysis/analysis_options.yaml
# analyzer:
#   language:
#     strict-casts: true
#     strict-raw-types: true
#   errors:
#     unawaited_futures: error        # promote to build-breaking
#     use_build_context_synchronously: error

# The CI quality gate (every PR)
dart format --set-exit-if-changed .
flutter analyze
flutter test --coverage

# Auto-fix the easy violations
dart fix --dry-run     # preview
dart fix --apply       # apply

# Pre-commit hook (.git/hooks/pre-commit)
#!/bin/sh
dart format --set-exit-if-changed . || exit 1
flutter analyze || exit 1`
      }
    ]
  },

  /* â”€â”€ PHASE 7: Release & Production â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'app-icons-splash', phase: 7, phaseName: 'Release & Production',
    orderIndex: 55, estimatedMins: 25, prerequisites: ['flutter-project-setup'],
    title: 'App Icons, Name & Splash Screen',
    eli5: 'Before strangers download your app, they see three things: its icon on the store, its name under the icon, and the splash screen while it loads. These are your app\'s handshake — worth getting right.',
    analogy: 'Icon, name, and splash are your app\'s storefront, sign, and lobby. The product may be great inside, but a clip-art sign and a flickering lobby light tell customers to expect clip-art quality everywhere.',
    explanation: 'The polish trio before release: launcher icons (per-platform sizes and shapes, automated by flutter_launcher_icons), display name (per-platform config files), and the native splash screen (flutter_native_splash) shown by the OS before Flutter boots — eliminating the default white flash.',
    technicalDeep: 'Icons: one 1024×1024 master → flutter_launcher_icons generates all densities; Android adaptive icons (separate background + foreground layers, OS masks to circle/squircle — test both; keep foreground content in the inner 66% safe zone); iOS forbids transparency. App name: Android — android:label in AndroidManifest.xml; iOS — CFBundleDisplayName in Info.plist (max ~12 chars before truncation under icon). Splash: the OS-level launch screen exists BEFORE the Flutter engine starts — flutter_native_splash generates Android 12+ themed splash (centered icon on color — Android 12 enforces this layout) and iOS storyboard; match your app\'s first frame background to avoid a visible "double splash" jump. Extended branded loading (animated logo while bootstrapping) is a separate FLUTTER-side screen after engine start — keep total perceived wait under ~2s. Version identity: name + applicationId/bundle ID are permanent after first store release.',
    whatBreaks: 'Adaptive icon foreground touching edges → logo clipped to a circle on half of Android devices. White default splash flashing before a dark app — the "cheap app" tell. Renaming applicationId after release = a NEW app on the store, reviews and installs orphaned.',
    efficientWay: {
      title: 'Polish workflow',
      approaches: [
        { name: 'flutter_launcher_icons + flutter_native_splash', verdict: 'best', reason: 'Two dev-dependencies automate ~40 hand-cropped files and per-platform configs.' },
        { name: 'Hand-managing platform icon sets', verdict: 'weak', reason: 'Error-prone tedium the tools solved years ago.' },
        { name: 'Skipping splash config until "later"', verdict: 'weak', reason: 'The white flash is every user\'s first frame of your app; it\'s a 10-minute fix.' }
      ],
      recommendation: 'One config block in pubspec for both tools, run the generators, then verify on a real Android (adaptive masking) and iOS device (no transparency artifacts). Match splash background to first-frame background exactly.'
    },
    commonMistakes: [
      'Logo with fine detail — illegible at the 48px launcher size; test small.',
      'Splash background â‰  first app frame → jarring color jump at engine start.',
      'Forgetting to re-run generators after icon updates — stale icons ship.'
    ],
    seniorNotes: 'Time-to-interactive is a product metric: defer non-critical initialization (analytics, remote config fetch) until after first frame rather than padding the splash. deferFirstFrame/allowFirstFrame exists for genuinely-required async boot work — but the bar for "required before ANY pixel" should be high.',
    interviewQuestions: [
      'How do Android adaptive icons work and what\'s the safe zone?',
      'Why does the native splash exist separately from any Flutter loading screen?',
      'What app identifiers become immutable after first release?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'Icons + splash automation',
        code: `# pubspec.yaml
# dev_dependencies:
#   flutter_launcher_icons: ^0.13.0
#   flutter_native_splash: ^2.4.0
#
# flutter_launcher_icons:
#   android: true
#   ios: true
#   image_path: "assets/brand/icon-1024.png"
#   adaptive_icon_background: "#0EA5E9"
#   adaptive_icon_foreground: "assets/brand/icon-fg.png"  # 66% safe zone!
#
# flutter_native_splash:
#   color: "#0F172A"                 # match your app's first frame
#   image: assets/brand/splash-logo.png
#   android_12:
#     color: "#0F172A"
#     image: assets/brand/splash-icon-1152.png

dart run flutter_launcher_icons
dart run flutter_native_splash:create

# App display name
# Android: android/app/src/main/AndroidManifest.xml → android:label="My Notes"
# iOS: ios/Runner/Info.plist → CFBundleDisplayName = "My Notes"`
      }
    ]
  },
  {
    id: 'localization-flutter', phase: 7, phaseName: 'Release & Production',
    orderIndex: 56, estimatedMins: 35, prerequisites: ['material-cupertino'],
    title: 'Localization & Internationalization',
    eli5: 'Localization makes your app speak the user\'s language: every label lives in translation files instead of code, and the app picks the right set automatically — English for London, Hindi for Mumbai, Arabic (flowing right-to-left!) for Cairo.',
    analogy: 'Hardcoded strings are signs painted directly on walls — repainting the building for every country. Localization is a digital signboard system: one switch and every sign in the building displays the chosen language, including mirroring the layout for right-to-left readers.',
    explanation: 'Flutter\'s official l10n: ARB files (JSON-like, one per language) hold strings; flutter gen-l10n generates a typed AppLocalizations class; context.l10n.welcomeMessage replaces every literal. The system handles plurals, placeholders, dates/numbers (intl), and RTL layouts — the course covers it as the final feature before outro for good reason: retrofitting is painful.',
    technicalDeep: 'Setup: flutter_localizations + intl in pubspec; l10n.yaml (arb-dir, template-arb-file, output-class); lib/l10n/app_en.arb as template with @-metadata (description, placeholders); per-language app_es.arb, app_hi.arb. Codegen: flutter gen-l10n (auto on build). Wire: localizationsDelegates: AppLocalizations.delegates, supportedLocales — MaterialApp resolves device locale with fallback chain. Usage: AppLocalizations.of(context)!.noteCount(n) — plurals via ICU syntax ({count, plural, =0{No notes} one{1 note} other{{count} notes}}), placeholders typed from metadata. Dates/numbers: DateFormat.yMMMd(locale).format(date), NumberFormat.currency — NEVER hand-format. RTL: Directionality flows automatically from locale IF you used EdgeInsetsDirectional.only(start:) instead of left: — the discipline that makes Arabic/Hebrew free. Locale override (in-app language picker): locale: on MaterialApp from user preference. Missing keys fall back to template language.',
    whatBreaks: 'Retrofitting 400 hardcoded strings — why l10n starts early even single-language. EdgeInsets.only(left:) everywhere → broken RTL mirroring later. String concatenation for sentences ("You have " + n + " notes") — grammar breaks across languages; placeholders + plurals exist for this. Hardcoded date formats (MM/DD/YY) confusing the non-US world.',
    efficientWay: {
      title: 'i18n strategy',
      approaches: [
        { name: 'gen-l10n from day one, even monolingual', verdict: 'best', reason: 'Typed string access costs nothing extra to write; the second language becomes a translation task, not an engineering project.' },
        { name: 'Directional EdgeInsets/Alignment habitually', verdict: 'best', reason: 'start/end instead of left/right is free while writing; RTL support arrives without a layout audit.' },
        { name: 'Third-party l10n packages (easy_localization)', verdict: 'ok', reason: 'Convenient APIs, but the official gen-l10n is typed, fast, and zero-runtime-dependency.' }
      ],
      recommendation: 'Adopt the lint-able rule "no string literals in widgets" early. Use ICU plurals for every count, intl for every date/number, and Directional variants for every inset. Shipping Hindi or Arabic later becomes a translator\'s afternoon.'
    },
    commonMistakes: [
      'Concatenating translated fragments — word order differs across languages.',
      'Forgetting !  — AppLocalizations.of(context) is nullable before delegates load.',
      'Testing only English — German strings run 30-40% longer and break tight layouts.'
    ],
    seniorNotes: 'Localization is market access: shipping India without Hindi or the Gulf without Arabic leaves users (and revenue) untouched. Pseudo-localization testing (accented elongated strings) catches layout breaks before translators are even hired. Also remember: store listings localize separately (Phase 7 store topics).',
    interviewQuestions: [
      'How does Flutter\'s gen-l10n pipeline work end to end?',
      'How do ICU plurals handle languages with multiple plural forms?',
      'What coding habits make RTL support nearly free?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'ARB + typed localization (Dart)',
        code: `// lib/l10n/app_en.arb
// {
//   "welcomeUser": "Welcome back, {name}!",
//   "@welcomeUser": {
//     "placeholders": { "name": { "type": "String" } }
//   },
//   "noteCount": "{count, plural, =0{No notes yet} one{1 note} other{{count} notes}}",
//   "@noteCount": {
//     "placeholders": { "count": { "type": "int" } }
//   }
// }
// lib/l10n/app_hi.arb  → same keys, Hindi values

// MaterialApp wiring
MaterialApp(
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  locale: userPickedLocale,        // null = follow device
)

// Usage — typed, autocompleted, impossible to typo
final l10n = AppLocalizations.of(context)!;
Text(l10n.welcomeUser(user.name));
Text(l10n.noteCount(notes.length));   // correct plural per language

// Dates/numbers respect locale automatically
Text(DateFormat.yMMMd(Localizations.localeOf(context).toString())
    .format(note.updatedAt));

// RTL-ready spacing: start/end, not left/right
Padding(
  padding: const EdgeInsetsDirectional.only(start: 16, end: 8),
  child: content,    // mirrors automatically for Arabic/Hebrew
)`
      }
    ]
  },
  {
    id: 'android-release', phase: 7, phaseName: 'Release & Production',
    orderIndex: 57, estimatedMins: 45, prerequisites: ['app-icons-splash', 'git-for-flutter'],
    title: 'Android Release: Signing & Play Store',
    eli5: 'Releasing on Android means: cryptographically sign your app (proving updates come from you), build a release bundle, and walk it through the Google Play Console — store listing, content forms, testing track, then production rollout.',
    analogy: 'The keystore is your wax seal: every update must carry it, the store rejects any letter without it, and losing the seal means never writing to your readers again under that name. Play Console is the publishing house: manuscript (AAB), cover art (listing), content rating forms, then the printing press.',
    explanation: 'The Android pipeline: generate an upload keystore → configure Gradle signing → flutter build appbundle --release → Play Console (one-time $25): app content declarations, data safety form, store listing, then internal → closed → production tracks with staged rollouts. The course releases its notes app through exactly this gauntlet.',
    technicalDeep: 'Keystore: keytool -genkey → upload-keystore.jks; android/key.properties (gitignored!) holds paths/passwords; build.gradle signingConfigs.release reads it. Play App Signing (default, enroll always): Google holds the APP signing key, your keystore is just the UPLOAD key — losable keys become a support ticket instead of a tombstone. Build: flutter build appbundle (AAB required — Play generates optimized per-device APKs); versionCode (integer, MUST increase every upload) + versionName (display) from pubspec version: 1.2.0+7 (name+code). Shrinking: R8 minification default; add proguard keep-rules if reflection-using plugins crash in release. Console gauntlet: app content (privacy policy URL — required; ads declaration; target audience; data safety form — what you collect and why, mirrors your actual SDKs!), store listing (title 30 chars, short desc 80, full 4000, screenshots per form factor, feature graphic), content rating questionnaire. Tracks: internal (instant, 100 testers) → closed → open → production with staged rollout (5% → 20% → 100%, halt on crash spikes). Review: hours to a few days typically. Pre-launch report: Play\'s robo-tests on real devices — free crash intel.',
    whatBreaks: 'Lost upload keystore WITHOUT Play App Signing enrolled → permanent update lockout (the career-story incident from git-for-flutter). versionCode not incremented → upload rejected. Data safety form contradicting actual SDK behavior (Firebase Analytics collects identifiers!) → rejection or later takedown. Release-only crashes from R8 stripping reflective code — always test the RELEASE build before upload.',
    efficientWay: {
      title: 'Play release workflow',
      approaches: [
        { name: 'Internal track first, always', verdict: 'best', reason: 'Real store delivery to your devices in minutes — catches signing/config issues before any review wait.' },
        { name: 'Staged production rollouts', verdict: 'best', reason: '5% rollout converts a catastrophic bug into a contained incident with a halt button.' },
        { name: 'Straight to 100% production', verdict: 'weak', reason: 'Your first signal of a crash loop becomes ten thousand one-star reviews.' }
      ],
      recommendation: 'Enroll in Play App Signing, vault the upload keystore + passwords (password manager + offline backup), script the build (the CI/CD topic automates it), and never skip the internal-track smoke test of the actual release artifact.'
    },
    commonMistakes: [
      'Testing only debug builds — R8/minification bugs appear exclusively in release.',
      'Screenshots from the emulator with debug banners — instant amateur signal.',
      'Privacy policy URL pointing nowhere — automated rejection.'
    ],
    seniorNotes: 'Production Android discipline: monitor Android vitals (ANR rate, crash rate — Play demotes poor-vitals apps in search), respond to pre-launch report warnings, and keep a release runbook (bump version, changelog, build, internal, promote, stage, monitor). The runbook becomes the CI/CD spec one topic later.',
    interviewQuestions: [
      'Explain upload key vs app signing key under Play App Signing.',
      'What is a staged rollout and when do you halt one?',
      'Why can a release build crash when debug worked perfectly?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'Android release pipeline',
        code: `# One-time: generate upload keystore (then VAULT it)
keytool -genkey -v -keystore upload-keystore.jks \\
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload

# android/key.properties (GITIGNORED)
# storePassword=***
# keyPassword=***
# keyAlias=upload
# storeFile=/secure/path/upload-keystore.jks

# pubspec.yaml — versionName + versionCode
# version: 1.2.0+7        ← name 1.2.0, code 7 (code must always increase)

# Build the signed bundle
flutter build appbundle --release \\
  --dart-define=ENV=prod \\
  --obfuscate --split-debug-info=build/symbols   # smaller + symbolicated crashes

# Smoke-test the RELEASE build before uploading
flutter install --release -d <device>

# Upload build/app/outputs/bundle/release/app-release.aab
# Play Console → Internal testing → promote → staged production (5% → 100%)`
      }
    ]
  },
  {
    id: 'ios-release', phase: 7, phaseName: 'Release & Production',
    orderIndex: 58, estimatedMins: 45, prerequisites: ['app-icons-splash', 'git-for-flutter'],
    title: 'iOS Release: App Store Connect',
    eli5: 'Releasing on iPhone means joining Apple\'s developer program ($99/year), letting Xcode handle the signing certificates, uploading your build to App Store Connect, testing via TestFlight, and then passing Apple\'s famously picky human review.',
    analogy: 'If Google Play is a bustling marketplace with spot checks, the App Store is a luxury department store with a doorman: stricter dress code (guidelines), an actual human inspecting your goods (review), and higher rejection rates — but the same shelf access for everyone who passes.',
    explanation: 'The iOS pipeline: Apple Developer Program enrollment → signing (let Xcode manage certificates/profiles automatically) → flutter build ipa → upload to App Store Connect → TestFlight beta → store listing + privacy nutrition labels → human review (1-2 days typically) → release. The course walks this for the notes app, including a security-rules fix and resubmission — a very realistic detail.',
    technicalDeep: 'Signing: development vs distribution certificates + provisioning profiles — "Automatically manage signing" in Xcode handles 95% of cases; bundle ID registered in the developer portal. Build: flutter build ipa → Xcode Organizer or Transporter app uploads; build number must increase per upload (CFBundleVersion). TestFlight: internal testers (your team, instant) vs external (up to 10K, requires lightweight beta review); builds expire in 90 days. Listing requirements: screenshots per device class (6.7", 6.5", 5.5", iPad if supported — no simulator chrome), privacy nutrition labels (the data-collection disclosure grid — must match your SDKs), age rating, support URL. Review gotchas that reject Flutter apps: crashes on launch (test release on REAL device), broken links, sign-in apps without Sign in with Apple (required when offering other social logins), demo account missing for login-gated apps, "minimum functionality" (thin webview-like apps), payments bypassing IAP for digital goods. Rejections: respond in Resolution Center, fix, resubmit — normal lifecycle, not catastrophe (the course resubmits!). Phased release: 7-day automatic gradual rollout option.',
    whatBreaks: 'Login-gated app without a demo account in review notes → guaranteed rejection. Google Sign-In without Apple Sign-In → rejection (guideline 4.8). Selling digital content via Stripe instead of IAP → rejection (and the 30%/15% commission reality). Privacy labels missing SDK-collected data → rejection or post-approval removal.',
    efficientWay: {
      title: 'App Store workflow',
      approaches: [
        { name: 'TestFlight external beta before first submission', verdict: 'best', reason: 'The beta review is a soft preview of full review — surfaces guideline issues with lower stakes.' },
        { name: 'Review-notes discipline (demo account, feature map)', verdict: 'best', reason: 'Reviewers spend minutes; making their path obvious halves rejection odds.' },
        { name: 'Submitting the first-ever build straight to review', verdict: 'weak', reason: 'Signing/upload/listing/guideline issues stack into multi-week rejection loops.' }
      ],
      recommendation: 'Enroll in the developer program on day one (verification takes days). Ship to TestFlight early and often. Write generous review notes: demo credentials, what the app does, where the tricky features live. Read guidelines 2.1, 4.2, 4.8, and 3.1.1 before designing auth and payments.'
    },
    commonMistakes: [
      'Screenshots with simulator bezels or debug overlays.',
      'Forgetting the export compliance question (standard HTTPS = exempt, declare it).',
      'Treating rejection as disaster — respond, fix, resubmit; everyone iterates.'
    ],
    seniorNotes: 'iOS release maturity: automate with Fastlane (next topic) including match for team signing, maintain a review-notes template, and design auth/payment flows WITH guidelines 4.8 and 3.1.1 in mind rather than retrofitting after rejection. App Store optimization (keywords field, localized listings) is post-launch leverage most engineers ignore.',
    interviewQuestions: [
      'Walk through zero-to-App-Store for a Flutter app.',
      'What are the most common App Store rejection reasons?',
      'When is Sign in with Apple mandatory?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'iOS release pipeline',
        code: `# Prereqs: Apple Developer Program ($99/yr), Xcode, real device
# Xcode → Runner → Signing & Capabilities → "Automatically manage signing"
# Bundle ID: com.yourname.mynotes (registered in developer portal)

# Version: pubspec version: 1.2.0+7 → CFBundleShortVersionString 1.2.0, build 7

# Build the archive
flutter build ipa --release \\
  --obfuscate --split-debug-info=build/symbols

# Upload: either open in Xcode Organizer...
open build/ios/archive/Runner.xcarchive
# ...or use Transporter app / altool with the .ipa:
# build/ios/ipa/mynotes.ipa

# App Store Connect checklist:
# 1. TestFlight → internal testers → install on real devices
# 2. App Information: name (30 chars), subtitle, category
# 3. Privacy nutrition labels — match your actual SDKs (Firebase!)
# 4. Screenshots: 6.7" + 6.5" + 5.5" (+ iPad if supported)
# 5. REVIEW NOTES: demo account email/password, feature walkthrough
# 6. Submit → typically 24-48h → respond to any rejection in Resolution Center`
      }
    ]
  },
  {
    id: 'cicd-flutter', phase: 7, phaseName: 'Release & Production',
    orderIndex: 59, estimatedMins: 45, prerequisites: ['android-release', 'ios-release', 'linting-code-quality'],
    title: 'CI/CD: Fastlane, Codemagic & Actions',
    eli5: 'CI/CD replaces "build it on my laptop and pray" with robots: every code push gets automatically tested, built, signed, and shipped to testers or stores — the same way every time, with no human forgetting a step.',
    analogy: 'Manual releases are home cooking for a banquet: possible, exhausting, and one distracted moment ruins course seven. CI/CD is a commercial kitchen line — every dish assembled identically, quality-checked at each station, plated and delivered without the head chef touching a pan.',
    explanation: 'The Flutter delivery stack: CI (GitHub Actions running analyze/test/build per PR) + build automation (Fastlane lanes for signing and store upload) + optional managed services (Codemagic, Bitrise — Flutter-native CI with macOS runners included) + distribution (Firebase App Distribution for testers, TestFlight, Play tracks). The roadmap names all of these; together they\'re one pipeline.',
    technicalDeep: 'GitHub Actions: PR workflow — checkout, subosito/flutter-action (pinned version), pub get, format check, analyze, test, build apk (the quality gate from the linting topic). Release workflow on tags: build signed artifacts → deploy. Secrets: keystore/certificates base64-encoded into repo secrets, decoded in-job; --dart-define values from secrets. iOS on CI needs macOS runners (10x Linux cost) — why managed services exist. Fastlane: Ruby DSL — lanes scripting store interactions; match solves team iOS signing (certificates in an encrypted repo, synced across machines/CI); supply (Play upload), deliver/pilot (App Store/TestFlight upload), gym/build per platform. Codemagic: Flutter-first managed CI — YAML or UI workflows, macOS included, automatic signing integrations, direct store publishing; Bitrise similar with step marketplace. Firebase App Distribution: post-build hook ships APK/IPA to tester groups with release notes — the team dogfood loop. Versioning: CI injects build number from run number/git tag — humans never bump integers. Caching (pub, gradle) halves build times.',
    whatBreaks: 'Secrets committed instead of injected — keystore in repo history is compromised forever. Unpinned Flutter version in CI → builds break the day stable channel moves. iOS signing on CI without match/managed tooling → certificate hell that consumes sprints. No artifact retention → "which commit is build 47?" archaeology during incident response.',
    efficientWay: {
      title: 'Pipeline strategy',
      approaches: [
        { name: 'Actions for CI + Codemagic for store delivery', verdict: 'best', reason: 'Free fast quality gates on every PR; managed macOS signing/publishing where it\'s genuinely hard.' },
        { name: 'Full Fastlane on self-managed runners', verdict: 'ok', reason: 'Maximum control, no per-build fees — worth it at team scale with platform expertise.' },
        { name: 'Laptop releases forever', verdict: 'weak', reason: 'Works until the laptop dies, the engineer leaves, or a step gets skipped under deadline pressure.' }
      ],
      recommendation: 'Stage it: (1) PR quality gate in Actions this week — analyze + test + build; (2) Firebase App Distribution on merges to main — continuous dogfooding; (3) tag-triggered store deployment via Codemagic or Fastlane when release cadence justifies it.'
    },
    commonMistakes: [
      'CI without format/analyze — robots building unvetted code faster.',
      'One workflow doing PR checks AND deployment — separate triggers, separate permissions.',
      'No release notes automation — testers get builds with zero context.'
    ],
    seniorNotes: 'The pipeline IS the release runbook, executable and versioned. Senior moves: build numbers from CI run numbers, changelogs generated from conventional commits, symbol files (--split-debug-info) uploaded to Crashlytics per build, and a one-click rollback path (previous artifact re-promotion). Interview answer shape: "push → gate → build → distribute → monitor", with tools named at each arrow.',
    interviewQuestions: [
      'Design a CI/CD pipeline for a Flutter app shipping to both stores.',
      'How do you handle signing secrets safely in CI?',
      'What does Fastlane match solve?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'GitHub Actions quality gate + delivery',
        code: `# .github/workflows/ci.yml — every PR
# jobs:
#   quality:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       - uses: subosito/flutter-action@v2
#         with: { flutter-version: '3.24.0', cache: true }   # PINNED
#       - run: flutter pub get
#       - run: dart format --set-exit-if-changed .
#       - run: flutter analyze
#       - run: flutter test --coverage
#       - run: flutter build apk --debug      # compile check

# .github/workflows/deploy.yml — on version tags
#   deploy-android:
#     steps:
#       - run: echo "\$KEYSTORE_B64" | base64 -d > android/upload.jks
#         env: { KEYSTORE_B64: \${{ secrets.KEYSTORE_B64 }} }
#       - run: flutter build appbundle --release
#           --build-number=\${{ github.run_number }}
#       - uses: r0adkll/upload-google-play@v1   # → internal track

# Fastlane lane (ios/fastlane/Fastfile)
# lane :beta do
#   match(type: "appstore")                    # team signing, solved
#   build_app(scheme: "Runner")
#   upload_to_testflight(changelog: changelog_from_git_commits)
# end

# Tester distribution after merge to main
firebase appdistribution:distribute build/app/outputs/flutter-apk/app-release.apk \\
  --app \$FIREBASE_APP_ID --groups internal-testers \\
  --release-notes "\$(git log -1 --pretty=%B)"`
      }
    ]
  },
  {
    id: 'analytics-crashlytics', phase: 7, phaseName: 'Release & Production',
    orderIndex: 60, estimatedMins: 40, prerequisites: ['firebase-services', 'error-handling-flutter'],
    title: 'Analytics, Crashlytics & Monitoring',
    eli5: 'Once your app is on thousands of phones, you\'re blind without instruments: Crashlytics tells you when and why it crashes out there, analytics tells you what users actually do (not what you hoped), and performance monitoring tells you where it\'s slow.',
    analogy: 'Shipping without monitoring is launching a satellite with no telemetry: it\'s out there, something\'s happening, and your only signal is angry one-star transmissions. Instrumentation is mission control — dashboards for every system, alarms before users notice.',
    explanation: 'The production observability stack: Firebase Crashlytics (crash + non-fatal error reporting with symbolicated stacks), Firebase Analytics (events, funnels, audiences — feeds Remote Config A/B tests), alternatives/complements (Mixpanel, Segment as event router), and Sentry as the strong non-Firebase contender. The roadmap\'s analytics block, turned into an architecture.',
    technicalDeep: 'Crashlytics: firebase_crashlytics — wire BOTH hooks (FlutterError.onError → recordFlutterFatalError; PlatformDispatcher.onError → recordError — Phase 5\'s setup completed); recordError(e, stack, fatal: false) for caught-but-notable exceptions (your AppException handler\'s unknown branch); setCustomKey/setUserIdentifier for crash context (screen, feature flags); obfuscated builds need symbol upload (--split-debug-info files → Crashlytics) or stacks are hex soup. Velocity alerts: crash spikes page you — the staged-rollout halt trigger. Analytics: logEvent(name, parameters) — design a SMALL taxonomy (10-20 events: note_created, signup_completed) with consistent params; screen tracking via observer; user properties segment audiences; funnels expose drop-off (signup_started → completed at 40%? UX bug found). Feeds Remote Config experiments — A/B tests measured by YOUR events. Segment: one SDK fan-outs events to many tools — adopt when tool count > 2. Sentry: sentry_flutter — superior issue grouping/breadcrumbs, backend correlation (your Backend track services + app in one trace view). Privacy: consent gates (GDPR), no PII in event params, store disclosure alignment (the labels from the release topics!).',
    whatBreaks: 'Symbol files not uploaded → obfuscated crash stacks are unreadable → bugs unfixable. Event taxonomy sprawl (300 ad-hoc events, inconsistent naming) → analytics nobody trusts or uses. PII in event parameters → GDPR incident. Analytics declared "not collected" in store privacy forms while Firebase Analytics runs → policy violation.',
    efficientWay: {
      title: 'Observability rollout',
      approaches: [
        { name: 'Crashlytics + 12-event taxonomy at launch', verdict: 'best', reason: 'Crash visibility is non-negotiable; a dozen well-named events answer 90% of product questions.' },
        { name: 'Sentry when you also own the backend', verdict: 'best', reason: 'App release ↔ API error correlation in one tool — debugging compound incidents in one view.' },
        { name: 'Track-everything-decide-later', verdict: 'weak', reason: 'Event swamps produce dashboards nobody reads and bills everybody questions.' }
      ],
      recommendation: 'Before first release: Crashlytics with both error hooks + symbol upload in CI, velocity alerts on. Write the event taxonomy as a reviewed doc (name, params, trigger, owner) — 12 events, consistently named. Add funnels for your activation flow week one.'
    },
    commonMistakes: [
      'Only FlutterError.onError wired — async errors (most crashes!) never reported.',
      'Testing Crashlytics in debug mode — it batches/disables; use test crash in release.',
      'Event names like "click7" and "newEvent_final2" — taxonomy or chaos.'
    ],
    seniorNotes: 'Close the loop into engineering practice: crash-free rate (target >99.5%) on the team dashboard, staged rollouts halted by velocity alerts automatically, every Crashlytics issue triaged like a failing test (reproduce → failing test → fix → ship). Analytics maturity: events reviewed in PRs like schema changes, because they are.',
    interviewQuestions: [
      'Wire up complete crash reporting for Flutter — what are the pieces?',
      'How do you design an analytics event taxonomy that stays useful?',
      'A crash spike hits 2% of users mid-rollout — walk through your response.'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Production monitoring setup (Dart)',
        code: `Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  // BOTH crash hooks — framework AND async
  FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
  PlatformDispatcher.instance.onError = (error, stack) {
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
    return true;
  };

  runApp(const MyApp());
}

// Context that makes crashes debuggable
await FirebaseCrashlytics.instance.setUserIdentifier(user.id);  // no email/PII
await FirebaseCrashlytics.instance.setCustomKey('screen', 'note_editor');
await FirebaseCrashlytics.instance.setCustomKey('flag_new_editor', true);

// Caught-but-notable errors (the unknown branch of your error handling)
} on UnknownException catch (e, stack) {
  await FirebaseCrashlytics.instance.recordError(e.cause, stack, fatal: false);
  emit(NotesFailure(message: e.userMessage));
}

// Analytics: small taxonomy, consistent params
await FirebaseAnalytics.instance.logEvent(
  name: 'note_created',
  parameters: {'source': 'fab', 'length_bucket': 'short'},  // no content/PII
);

// CI: upload symbols so obfuscated stacks symbolicate
// firebase crashlytics:symbols:upload --app=\$APP_ID build/symbols`
      }
    ]
  },
  {
    id: 'store-guidelines', phase: 7, phaseName: 'Release & Production',
    orderIndex: 61, estimatedMins: 30, prerequisites: ['android-release', 'ios-release'],
    title: 'Store Guidelines, Policies & Updates',
    eli5: 'The app stores are private clubs with rulebooks: what your app may do, how it may charge money, what it must disclose, and how it must treat users\' data. Knowing the rules before you build saves you from designing features the bouncers will reject.',
    analogy: 'Store policies are building codes: you CAN design a house that violates them, but it won\'t pass inspection — and the expensive time to learn the code is before pouring the foundation (auth and payment flows), not at inspection day.',
    explanation: 'The compliance layer around shipping: Apple\'s App Review Guidelines and Google\'s Developer Programme Policies — payments rules (IAP commissions), data/privacy disclosure regimes, account-deletion mandates, update cadence requirements (target API levels), and the operational rhythm of keeping a published app alive and compliant.',
    technicalDeep: 'Payments: digital goods/subscriptions MUST use IAP (Apple 3.1.1, Play Billing) — 15-30% commission (15% under $1M/small-business programs); physical goods/services exempt (Uber model); in_app_purchase package or RevenueCat (receipt validation, cross-platform entitlements — strongly preferred). Account deletion: BOTH stores mandate in-app account deletion for apps with account creation (not just a support email). Privacy regimes: iOS nutrition labels + ATT prompt (only if cross-app tracking) + Privacy Manifests (SDK declarations); Play Data Safety form; both must match actual SDK behavior — audits happen. Android target API ratchet: Play requires targeting recent API levels (~1 year window) — an annual forced maintenance update even with zero features; abandoning an app gets it delisted. Update mechanics: no partial updates in stores (full binary through review every time) — hence Remote Config/feature flags for logic switches (code push à la Shorebird exists; mind policy boundaries). Review re-runs on EVERY update — a previously-approved feature can be re-flagged. Subscriptions: mandatory management links, price-change consent flows, grace periods.',
    whatBreaks: 'Stripe checkout for premium features → rejection (or post-approval takedown + payout clawback risk). Account signup without account deletion → rejection under current policies. Skipping the annual target-API bump → Play delisting warnings. Assuming approval is permanent — re-review on update flags two-year-old features.',
    efficientWay: {
      title: 'Compliance strategy',
      approaches: [
        { name: 'Read payment/privacy/account rules BEFORE building those flows', verdict: 'best', reason: 'Auth, payments, and data flows are expensive to redesign after rejection; the rules are short reads.' },
        { name: 'RevenueCat for any subscription product', verdict: 'best', reason: 'Receipt validation, entitlements, cross-platform sync, and policy-correct flows — solved category.' },
        { name: 'Compliance as a pre-submission checklist item', verdict: 'weak', reason: 'By submission time the violating architecture is built; rules are design inputs, not QA items.' }
      ],
      recommendation: 'Maintain a living compliance sheet per app: monetization model vs IAP rules, data collected vs both stores\' disclosures, account deletion path, target API deadline, subscription management links. Review it each release; assign the annual API bump a calendar date.'
    },
    commonMistakes: [
      'Reading guidelines for the first time inside a rejection email.',
      'Privacy disclosures written from memory instead of an SDK audit.',
      'No annual maintenance budget for stores\' moving requirements.'
    ],
    seniorNotes: 'Policy fluency is rare and valued: teams routinely lose release windows to preventable rejections. The senior contribution is boring and decisive — a compliance checklist in the release runbook, monetization designed against 3.1.1/Play Billing from the first architecture diagram, and calendar ownership of the target-API ratchet.',
    interviewQuestions: [
      'When must an app use in-app purchases vs external payments?',
      'What ongoing obligations come with a published Play Store app?',
      'How do feature flags interact with store update policies?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Policy-aware monetization (Dart)',
        code: `// Digital goods → IAP required. RevenueCat handles the hard parts.
import 'package:purchases_flutter/purchases_flutter.dart';

await Purchases.configure(PurchasesConfiguration(revenueCatApiKey));

// Present offerings (configured per-store in RevenueCat dashboard)
final offerings = await Purchases.getOfferings();
final monthly = offerings.current?.monthly;

// Purchase → validated receipt → entitlement (cross-platform)
final info = await Purchases.purchasePackage(monthly!);
final isPro = info.entitlements.active.containsKey('pro');

// Check entitlement anywhere (survives reinstall, syncs iOS↔Android)
final customerInfo = await Purchases.getCustomerInfo();
if (customerInfo.entitlements.active.containsKey('pro')) {
  // unlock premium features
}

// MANDATORY: account deletion path in-app (both stores)
// Settings → Delete Account → confirm →
//   await user.delete() + cascade Firestore data + entitlement cleanup

// MANDATORY (subscriptions): link to manage/cancel
// iOS: https://apps.apple.com/account/subscriptions
// Android: https://play.google.com/store/account/subscriptions`
      }
    ]
  },
  {
    id: 'flutter-career', phase: 7, phaseName: 'Release & Production',
    orderIndex: 62, estimatedMins: 30, prerequisites: ['cicd-flutter', 'analytics-crashlytics', 'store-guidelines'],
    title: 'Flutter Career & Next Steps',
    eli5: 'You can now build, test, and ship real apps to real stores — that\'s a job skill, not a hobby. The final step is packaging it: a portfolio that proves it, interview prep that shows it, and a plan for what to learn next.',
    analogy: 'Finishing the curriculum is earning the chef\'s knife skills; getting hired is the tasting menu — a few polished signature dishes (portfolio apps), confident technique under observation (live coding), and enough culinary theory to discuss any course (system design + internals).',
    explanation: 'The capstone: converting skills into employment. What Flutter interviews actually test (Dart + lifecycle + state management + internals + one system design), what a hireable portfolio looks like (shipped > sophisticated), how Flutter fits the wider mobile market (vs native, vs React Native), and the adjacent tracks that compound (native platform basics, backend — your other track!).',
    technicalDeep: 'Interview canon (you\'ve seen every answer in this curriculum): three trees + keys (Phase 5), StatefulWidget lifecycle (Phase 1), constraint model (Phase 2), your state library deep + comparisons (Phase 3), async/isolates (Phase 0), and a system design ("architect a chat app": auth flow, repository interfaces, realtime stream choice, offline strategy, error architecture, testing pyramid — Phases 3-6 assembled aloud). Live coding: build a small UI from a mock with clean state handling — practice timed. Portfolio that converts: 1-2 SHIPPED store apps (store links beat repo links — shipping proves the last 20% most candidates lack) + one architecture-showcase repo (tests, CI badge, README with decisions). The market: Flutter dominates cross-platform job growth; pay parity with native; companies value the native-basics-plus-Flutter combo (platform channels confidence). Adjacent compounding skills: Kotlin/Swift basics (debug platform issues, write channels), backend (your parallel track — full-stack mobile engineers are rare and prized), Firebase depth. Community: contributing to pub packages is visible proof of competence.',
    whatBreaks: 'Portfolio of 12 tutorial clones — reviewers recognize the course apps instantly; one original shipped app outweighs all of them. Memorized definitions without the connecting why ("widgets are immutable" — so what? → because the element diff makes rebuilds cheap, which is why composition works). Applying only to "Flutter Developer" titles — "Mobile Engineer" roles increasingly mean Flutter.',
    efficientWay: {
      title: 'Path to hired',
      approaches: [
        { name: 'Ship one original app to both stores, then apply', verdict: 'best', reason: 'Store presence + the war stories from review/signing/release = the differentiation interviews probe for.' },
        { name: 'Grind LeetCode-style Dart puzzles only', verdict: 'weak', reason: 'Flutter roles test framework depth and product judgment far more than algorithm golf.' },
        { name: 'Open-source contributions to known packages', verdict: 'ok', reason: 'Strong signal, slower path — pair with shipping, don\'t substitute.' }
      ],
      recommendation: 'Six-week sprint: weeks 1-4 build and SHIP an original app (small scope, polished, monitored — use every phase of this curriculum); week 5 write the README/portfolio and rehearse the interview canon aloud; week 6 apply broadly while iterating on the app from real user feedback. The Backend track in parallel makes you a full-stack mobile engineer — a genuinely rare profile.'
    },
    commonMistakes: [
      'Waiting to feel "ready" — shipping the imperfect app teaches the exact gaps.',
      'Portfolio READMEs describing WHAT instead of WHY (decisions, trade-offs, metrics).',
      'Interview answers reciting facts without connecting them to incidents you handled.'
    ],
    seniorNotes: 'The hiring bar, from the other side of the table: juniors who have SHIPPED (store account, review scars, a crash they diagnosed via Crashlytics) interview like mid-levels. Your storyset from this curriculum — the Firestore rules incident, the keystore discipline, the state-management trade-off decision — IS the interview. Tell decisions, not definitions.',
    interviewQuestions: [
      'Walk me through an app you shipped — architecture, hardest bug, what you\'d change.',
      'Design a real-time chat app in Flutter end to end.',
      'Why Flutter over native for this product — and when would you say the opposite?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'The portfolio checklist',
        code: `# The hireable Flutter portfolio
#
# 1. SHIPPED app (the differentiator)
#    ✓ Original idea, small scope, polished UX
#    ✓ Live on Play Store (+ App Store if possible) — store links in CV
#    ✓ Crashlytics + analytics wired (mention crash-free % in interviews)
#    ✓ Built with: state management, Firebase/API, tests, CI
#
# 2. Architecture showcase repo
#    ✓ README: decisions and WHY (state mgmt choice, layer diagram)
#    ✓ Tests: unit (blocs/services) + widget + 1 integration journey
#    ✓ CI badge: analyze + format + test on every PR
#    ✓ Feature-first structure, typed errors, l10n-ready
#
# 3. Interview canon — rehearse ALOUD:
#    ✓ Three trees, keys, GlobalKey          (internals)
#    ✓ Lifecycle + constraint model           (foundations)
#    ✓ Your state library vs alternatives     (judgment)
#    ✓ "Design a chat app" end-to-end         (system design)
#    ✓ A production story: bug → diagnosis → fix → prevention
#
# 4. Parallel track: Backend (you're already on it) → full-stack mobile`
      }
    ]
  },
]

export const FLUTTER_CURRICULUM: CurriculumTopic[] = weaveTopics(
  FLUTTER_CURRICULUM_BASE,
  FLUTTER_EXTRA_TOPICS,
  {
    'deep-linking': 'navigation-routing',
    'flutter-accessibility': 'forms-input',
    'platform-channels': 'flutter-internals',
  },
)
