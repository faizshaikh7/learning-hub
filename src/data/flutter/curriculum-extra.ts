import type { CurriculumTopic } from '@/types'

/**
 * Advanced, senior/CTO-level Flutter topics that extend the core curriculum.
 * Current as of 2025 (Flutter 3.x / Dart 3.x). Each topic reuses the exact
 * phase numbers and phaseName strings from FLUTTER_CURRICULUM.
 */
export const FLUTTER_EXTRA_TOPICS: CurriculumTopic[] = [
  /* ── PHASE 5: Animations & Internals ─────────────────────────────────────── */
  {
    id: 'platform-channels', phase: 5, phaseName: 'Animations & Internals',
    orderIndex: 99, estimatedMins: 55, prerequisites: ['flutter-intro'],
    title: 'Platform Channels & Native Interop',
    eli5: 'Flutter paints its own screen, but sometimes it needs to ask the phone\'s "home country" (iOS or Android) to do something only that country knows how to do — like reading the battery level or opening a native health API. Platform channels are the phone line Flutter uses to call the native side and get an answer back.',
    analogy: 'Think of your Dart app as a traveller who speaks only Dart, standing at a border. Native code (Kotlin/Swift) lives on the other side. A MethodChannel is a translator on a phone: you pass a message and an argument, they walk into the native building, do the work, and hand you the result. FFI is different — instead of a translator, you dig a tunnel straight into a C library and shake its hand directly, no phone call, no waiting.',
    explanation: 'Platform channels are Flutter\'s asynchronous message-passing bridge between Dart and host-platform native code (Kotlin/Java on Android, Swift/Objective-C on iOS, plus C++/JS on desktop/web). You use them when a capability simply doesn\'t exist in Dart or in an existing plugin: a proprietary SDK, a niche sensor, deep OS integration. Messages are serialized with a codec, sent across the channel, handled natively, and a result (or error) comes back as a Future. For calling C/C++ libraries directly with no serialization overhead, Flutter offers dart:ffi (Foreign Function Interface) instead. For anything you can, you should prefer a well-maintained pub.dev plugin over hand-writing channels — plugins ARE channels, packaged.',
    technicalDeep: 'Three channel types share the same BinaryMessenger transport but differ in shape. (1) MethodChannel: request/response RPC — invokeMethod(name, args) returns a Future; the native side registers a MethodCallHandler and replies with result()/error()/notImplemented(). (2) EventChannel: a native-to-Dart stream — you listen() and native code pushes events via an EventSink (sensor updates, connectivity changes, scan results). (3) BasicMessageChannel: bidirectional, codec-based raw messages, no method semantics — good for free-form or high-frequency passing. Codecs: StandardMessageCodec (default, handles primitives/lists/maps/typed data), StringCodec, JSONMessageCodec, BinaryCodec. Threading is the subtle part: platform-channel handlers run on the platform (main/UI) thread of the host — heavy native work there jank\'s the app, so offload to a background thread/Dispatcher/GCD queue and hop back to the platform thread only to reply. Pigeon is Google\'s code generator that eliminates stringly-typed channels: you define messages and APIs in a Dart schema file, run pigeon, and it emits type-safe Dart + Kotlin + Swift glue — no magic method-name strings, compile-time safety on both sides. dart:ffi bypasses channels entirely: it loads a dynamic library (DynamicLibrary.open) and binds C symbols to Dart typedefs, calling synchronously on the same thread with zero serialization — ideal for CPU-heavy C/Rust libs (image codecs, crypto, SQLite). ffigen generates the bindings from C headers. Since Dart 2.19+/Flutter 3.x, ffi also supports isolate-local callbacks (NativeCallable) so C can call back into Dart from any thread.',
    whatBreaks: 'Calling a MethodChannel before the native handler is registered → MissingPluginException. Doing heavy CPU work inside a channel handler on the platform thread → dropped frames and ANRs. Assuming a channel call is cheap — every call crosses an async boundary and serializes args, so chatty per-frame calls kill performance (batch them or use FFI). Mismatched method-name strings between Dart and native (a typo) fails silently as notImplemented — Pigeon exists precisely to kill this class of bug. Blocking the Dart UI isolate waiting on a synchronous-looking channel (they are always async). FFI callbacks invoked from a non-Dart thread without NativeCallable.listener → crashes. Forgetting that channel messages must run on the platform thread means calling platform APIs from a background isolate won\'t reach the registered handler.',
    efficientWay: {
      title: 'Choosing the right native-interop mechanism',
      approaches: [
        { name: 'Existing pub.dev plugin (federated)', verdict: 'best', reason: 'If a maintained plugin already wraps the capability, use it — it is battle-tested channel code with platform-specific implementations already split out.' },
        { name: 'Pigeon for custom method channels', verdict: 'best', reason: 'Type-safe generated Dart+Kotlin+Swift removes stringly-typed method names and codec drift — the modern default for hand-rolled channels.' },
        { name: 'dart:ffi + ffigen for C/C++/Rust libs', verdict: 'best', reason: 'Zero-serialization synchronous calls into native libraries; the right tool for CPU-bound work and existing C SDKs.' },
        { name: 'Raw MethodChannel with string method names', verdict: 'ok', reason: 'Fine for a one-off single method, but typo-prone and unsafe as surface area grows — graduate to Pigeon.' },
        { name: 'BasicMessageChannel for RPC-style calls', verdict: 'weak', reason: 'Lacks method semantics and error channels; reserve it for free-form/high-frequency messaging, not request/response.' }
      ],
      recommendation: 'Default order: (1) find a maintained plugin; (2) if you must write native glue, use Pigeon; (3) if you are wrapping a C/Rust library or doing heavy compute, use dart:ffi with ffigen. Reserve raw MethodChannel/EventChannel for tiny surfaces or streams, and always push heavy native work off the platform thread before replying.'
    },
    commonMistakes: [
      'Running expensive native work directly in the channel handler on the platform thread, causing jank and ANRs instead of dispatching to a background queue.',
      'Hard-coding matching method-name strings on both sides and shipping typos that fail as notImplemented — use Pigeon to generate the contract.',
      'Making per-frame channel calls (e.g. reading a sensor value each build) — batch, cache, or switch to an EventChannel stream or FFI.',
      'Registering the channel with a name that differs between Dart and native, producing MissingPluginException at runtime.',
      'Reaching for FFI when a plugin exists, or reaching for channels when the work is pure Dart — pick the lowest-friction tool that fits.'
    ],
    seniorNotes: 'In interviews, articulate the decision tree crisply: pure Dart → do it in Dart; OS/SDK capability → plugin, else Pigeon-generated channel; C/C++/Rust or heavy compute → dart:ffi. Explain that channels are asynchronous and codec-serialized, so they are a poor fit for hot paths, whereas FFI is synchronous and zero-copy but shares the calling thread (so long FFI calls must move to a background isolate). Know the threading contract: channel handlers run on the host platform thread; you offload with Kotlin coroutines/Dispatchers.IO or GCD and hop back to reply. Mention that plugins are "federated" (a platform-interface package + per-platform implementations) so you can add a platform without touching consumers. Bring up Pigeon as the maturity signal — teams that scale native interop standardize on it to eliminate an entire bug class. For desktop, note channels also bridge to C++ embedders. This topic separates people who have shipped real hardware/SDK integrations from those who have only glued plugins together.',
    interviewQuestions: [
      'What are the three platform-channel types and when would you use each?',
      'On which thread do platform-channel handlers execute, and why does that matter for performance?',
      'When would you choose dart:ffi over a MethodChannel, and what are the trade-offs?',
      'What problem does Pigeon solve that raw MethodChannels do not?',
      'How does a MissingPluginException differ from a notImplemented result, and what causes each?'
    ],
    interviewAnswers: [
      'MethodChannel is request/response RPC (invokeMethod returns a Future) for "call native, get an answer" calls. EventChannel is a native-to-Dart stream you listen() to, for continuous data like sensors or connectivity. BasicMessageChannel is codec-based bidirectional free-form messaging with no method semantics, for high-frequency or non-RPC passing. All three ride the same BinaryMessenger; they differ in shape and codec.',
      'Handlers run on the host platform (main/UI) thread of Android/iOS, not a Dart isolate. That matters because any heavy work there blocks the UI and causes dropped frames or ANRs. The correct pattern is to dispatch native work to a background thread (Dispatchers.IO / a GCD queue) and hop back to the platform thread only to send the reply.',
      'Use dart:ffi when calling C/C++/Rust libraries or doing CPU-heavy work: it is synchronous with zero serialization, so it is far faster than a channel per call. Trade-offs: FFI runs on the calling thread (long calls must move to a background isolate), you manage memory across the boundary, and you write/generate bindings (ffigen). Channels are better for OS/SDK capabilities and are inherently async and safer across the platform boundary.',
      'Raw channels rely on matching method-name strings and codec assumptions on both sides, which drift and produce silent runtime failures. Pigeon generates type-safe Dart + Kotlin + Swift from one schema, giving compile-time checking, no stringly-typed names, and consistent serialization — eliminating a whole bug class as the native surface grows.',
      'MissingPluginException means no handler is registered for that channel/method (channel name mismatch, plugin not registered, or called too early). notImplemented is an explicit reply the native handler sends when it recognizes the channel but does not handle that specific method name (often a method-name typo). One is "no one is listening", the other is "someone listened but declined that method".'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'MethodChannel — Dart side (invoke native)',
        code: `import 'package:flutter/services.dart';

class BatteryService {
  // Channel name must match EXACTLY on the native side.
  static const _channel = MethodChannel('com.example.app/battery');

  Future<int> getBatteryLevel() async {
    try {
      final level = await _channel.invokeMethod<int>('getBatteryLevel');
      return level ?? -1;
    } on PlatformException catch (e) {
      // Native side called result.error(...)
      throw Exception('Failed to get battery level: \${e.message}');
    } on MissingPluginException {
      // No handler registered for this channel/method.
      return -1;
    }
  }
}`
      },
      {
        lang: 'kotlin',
        label: 'MethodChannel — Android/Kotlin handler (off-thread work)',
        code: `// MainActivity.kt
class MainActivity : FlutterActivity() {
  private val CHANNEL = "com.example.app/battery"
  private val scope = CoroutineScope(Dispatchers.Main)

  override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)
    MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
      .setMethodCallHandler { call, result ->
        when (call.method) {
          "getBatteryLevel" -> {
            // Handler runs on the platform (UI) thread — offload heavy work.
            scope.launch {
              val level = withContext(Dispatchers.IO) { readBatteryLevel() }
              if (level >= 0) result.success(level)
              else result.error("UNAVAILABLE", "Battery info unavailable", null)
            }
          }
          else -> result.notImplemented()
        }
      }
  }

  private fun readBatteryLevel(): Int {
    val bm = getSystemService(Context.BATTERY_SERVICE) as BatteryManager
    return bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
  }
}`
      },
      {
        lang: 'swift',
        label: 'MethodChannel — iOS/Swift handler',
        code: `// AppDelegate.swift
@main
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let controller = window?.rootViewController as! FlutterViewController
    let channel = FlutterMethodChannel(
      name: "com.example.app/battery",
      binaryMessenger: controller.binaryMessenger)

    channel.setMethodCallHandler { (call, result) in
      guard call.method == "getBatteryLevel" else {
        result(FlutterMethodNotImplemented); return
      }
      let device = UIDevice.current
      device.isBatteryMonitoringEnabled = true
      if device.batteryState == .unknown {
        result(FlutterError(code: "UNAVAILABLE",
                            message: "Battery info unavailable", details: nil))
      } else {
        result(Int(device.batteryLevel * 100))
      }
    }
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}`
      },
      {
        lang: 'javascript',
        label: 'EventChannel stream + Pigeon schema + dart:ffi',
        code: `// 1) EventChannel — subscribe to a native stream (Dart side)
const _events = EventChannel('com.example.app/accelerometer');
Stream<List<double>> get accelerometer =>
    _events.receiveBroadcastStream().map((e) => List<double>.from(e));

// 2) Pigeon schema (pigeons/api.dart) — run: dart run pigeon --input pigeons/api.dart
// Generates type-safe Dart + Kotlin + Swift glue, no method-name strings.
// @HostApi()
// abstract class BatteryApi {
//   int getBatteryLevel();
// }
// Usage after codegen:  final level = await BatteryApi().getBatteryLevel();

// 3) dart:ffi — call a C function directly, zero serialization
import 'dart:ffi';
import 'dart:io';

typedef _NativeAdd = Int32 Function(Int32 a, Int32 b);   // C signature
typedef _DartAdd = int Function(int a, int b);           // Dart signature

final _lib = DynamicLibrary.open(
  Platform.isAndroid ? 'libnative_math.so' : 'native_math.framework/native_math');
final int Function(int, int) nativeAdd =
    _lib.lookupFunction<_NativeAdd, _DartAdd>('native_add');
// nativeAdd(2, 3) runs synchronously in C — no channel, no codec.`
      }
    ]
  },
  /* ── PHASE 2: UI Building & Navigation ───────────────────────────────────── */
  {
    id: 'flutter-accessibility', phase: 2, phaseName: 'UI Building & Navigation',
    orderIndex: 99, estimatedMins: 45, prerequisites: ['flutter-intro'],
    title: 'Accessibility (a11y) in Flutter',
    eli5: 'Some people use your app without seeing the screen — a screen reader speaks the buttons aloud. Others need bigger text, or can only tap large targets. Accessibility means your app describes itself out loud correctly, scales its text, and has taps big enough for everyone. Because Flutter paints its own pixels, it has to explicitly tell the phone what each thing IS.',
    analogy: 'A screen reader is a friend reading the app to someone with their eyes closed. If your buttons are just painted shapes with no labels, your friend can only say "button, button, button" — useless. The Semantics widget is the caption you write under each shape so your friend can say "Add to cart, button" instead. Flutter builds a parallel "semantics tree" — a described, audio-friendly version of your visual tree.',
    explanation: 'Flutter renders everything on a canvas, so unlike native UIKit/Android views it has no built-in accessibility metadata — it must generate a semantics tree that the OS accessibility services (TalkBack on Android, VoiceOver on iOS) read. Most Material/Cupertino widgets already produce good semantics (a Text is read aloud, an IconButton exposes its tooltip as a label). Your job is to fill gaps: label icon-only buttons, group related elements, hide decorative pixels, respect the user\'s text-scale setting, ensure sufficient color contrast, and keep touch targets large enough. The Semantics widget is the primary tool; MergeSemantics, ExcludeSemantics, and the Semantics debugger refine it. Good accessibility overlaps heavily with good widget-testing selectors, so it pays double.',
    technicalDeep: 'The framework walks the render tree and produces a SemanticsNode tree via each RenderObject\'s SemanticsConfiguration. Semantics(...) annotates a subtree with properties: label, hint, value, button/header/image/textField flags, onTap/onLongPress actions, liveRegion (announce changes), and sort keys for traversal order. MergeSemantics collapses descendants into one node so a screen reader reads "Price 12 dollars" as a unit rather than two stops. ExcludeSemantics removes a subtree from the tree (decorative images, redundant icons). BlockSemantics hides everything visually behind it (e.g. a modal barrier). Traversal/focus order defaults to reading order (top-to-bottom, start-to-end) but can be overridden with OrdinalSortKey/SemanticsSortKey inside a Semantics(sortKey:). Text scaling: MediaQuery.textScalerOf(context) — since Flutter 3.16 the old textScaleFactor double is deprecated in favor of TextScaler (which supports non-linear scaling); never hard-code font sizes assuming a fixed scale, and test at 200%+. Contrast: WCAG AA requires 4.5:1 for normal text, 3:1 for large text — verify with a contrast checker. Touch targets: Material spec is 48x48 logical px (iOS HIG 44x44); Flutter enforces a minimum via MaterialTapTargetSize.padded and warns in tests via the "tap target size" guideline. Testing: enable the semantics debugger (showSemanticsDebugger: true on MaterialApp) to see the tree overlay; in widget tests use SemanticsTester and expect(tester.getSemantics(finder), matchesSemantics(...)), plus meetsGuideline(textContrastGuideline / androidTapTargetGuideline / iOSTapTargetGuideline / labeledTapTargetGuideline). announceForAccessibility / SemanticsService.announce pushes a spoken message for transient events.',
    whatBreaks: 'Icon-only buttons with no label read as "button, unlabeled" or nothing. GestureDetector on a bare Container gives no semantic action, so screen-reader users cannot activate it (use a Semantics(button:true, onTap:...) or a real button). Hard-coded font sizes ignore the user\'s text scale and clip or overflow at 200%. Decorative images without ExcludeSemantics add noise stops. CustomPaint with no Semantics is invisible to screen readers. Reordered visual layout (via Stack/Transform) can leave traversal order illogical. Low-contrast "designer grey on white" text fails WCAG and is unreadable in sunlight. Removing focus outlines/target padding for aesthetics breaks keyboard and switch-control users. Announcing every state change with liveRegion spams the user.',
    efficientWay: {
      title: 'Building accessible Flutter UI efficiently',
      approaches: [
        { name: 'Lean on semantic-rich Material/Cupertino widgets', verdict: 'best', reason: 'Buttons, TextFields, and Text already emit correct semantics — using real widgets instead of painted GestureDetectors gets you 80% of a11y for free.' },
        { name: 'Semantics + MergeSemantics/ExcludeSemantics for gaps', verdict: 'best', reason: 'Precisely label icon buttons, group related text, and hide decorative pixels where the defaults fall short.' },
        { name: 'Automated guideline tests (meetsGuideline) in CI', verdict: 'best', reason: 'textContrastGuideline and tap-target guidelines catch regressions on every PR instead of at manual audit time.' },
        { name: 'Manual TalkBack/VoiceOver passes each release', verdict: 'ok', reason: 'Essential for real-world validation, but slow and easy to skip — pair it with automated checks, do not rely on it alone.' },
        { name: 'Bolting on accessibility right before launch', verdict: 'weak', reason: 'Retrofitting semantics, contrast, and scaling into a finished UI is far costlier than designing for it from the first screen.' }
      ],
      recommendation: 'Design with accessibility from the start: use real semantic widgets, respect MediaQuery.textScalerOf and never hard-code sizes, keep targets ≥48px and contrast ≥4.5:1, label every icon-only control, and hide decorative art with ExcludeSemantics. Then lock it in with meetsGuideline tests in CI and a per-release TalkBack + VoiceOver pass. The semantics debugger is your fastest feedback loop while building.'
    },
    commonMistakes: [
      'Using GestureDetector on a plain Container for tappable UI, leaving screen-reader users with no activatable, labeled control.',
      'Shipping icon-only IconButtons/InkWells without a semantic label or tooltip, so they read as unlabeled buttons.',
      'Hard-coding font sizes and fixed heights that overflow or clip when the user sets large text (200%+).',
      'Forgetting ExcludeSemantics on decorative images/icons, cluttering the screen reader with meaningless stops.',
      'Using low-contrast text (grey-on-white) that fails WCAG AA 4.5:1 and is unreadable in bright light.',
      'Never running the semantics debugger or meetsGuideline tests, so a11y regressions ship unnoticed.'
    ],
    seniorNotes: 'Senior signal: treat accessibility as an architectural constraint, not a checklist. Explain the semantics tree as a parallel tree Flutter must synthesize precisely because it owns the canvas — this is the key contrast with native frameworks that inherit a11y from platform views. Bake meetsGuideline (contrast + tap-target + labeledTapTarget) into CI so it is enforced, not aspirational. Know the 2024/2025 migration from textScaleFactor (double) to TextScaler (supports non-linear/clamped scaling) and audit layouts at extreme scales. Discuss the legal dimension — ADA/Section 508/EN 301 549/the EU Accessibility Act (in force June 2025) make a11y a compliance requirement for many products, not a nicety. Mention accessibility overlaps with testability (semantic labels double as robust widget-test finders) and with internationalization (RTL, text expansion). A strong candidate also raises reduced-motion (MediaQuery.disableAnimations / accessibleNavigation) and bold-text/high-contrast OS settings. Framing a11y as "we serve more users, reduce legal risk, and get better test hooks" is the CTO-level pitch.',
    interviewQuestions: [
      'Why does Flutter need an explicit semantics tree when native frameworks seem to get accessibility "for free"?',
      'What is the difference between MergeSemantics, ExcludeSemantics, and BlockSemantics?',
      'How do you correctly support user text scaling in Flutter 3.x, and what changed from textScaleFactor?',
      'How would you make a custom icon-only, GestureDetector-based control accessible?',
      'How do you test accessibility (contrast, tap targets, labels) automatically in CI?'
    ],
    interviewAnswers: [
      'Because Flutter renders to its own canvas rather than composing native OS views, there is no underlying UIView/View tree carrying accessibility metadata for TalkBack/VoiceOver to read. Flutter must synthesize a parallel semantics tree from its render objects. Most built-in widgets do this for you, but any custom-painted or gesture-only UI is invisible to screen readers until you annotate it with Semantics.',
      'MergeSemantics collapses a subtree\'s nodes into a single node so related content is read as one unit (e.g. a label and its value). ExcludeSemantics removes a subtree from the semantics tree entirely — used to hide decorative images/icons. BlockSemantics drops the semantics of everything painted before it in the same layer, typically for a modal barrier so the screen reader cannot reach the obscured content behind a dialog.',
      'Read the scale from MediaQuery.textScalerOf(context) and let text size respond to it; never hard-code font sizes or fixed-height text containers. Flutter 3.16 deprecated the linear textScaleFactor double in favor of TextScaler, which supports non-linear and clamped scaling curves the OS may apply. Practically: use flexible layouts, test at 200%+, and clamp only when necessary via TextScaler, not by ignoring the setting.',
      'Wrap it in a Semantics widget with button: true, an explicit label, and an onTap action that mirrors the visual gesture, or better, replace the raw GestureDetector with a real button/InkWell that already exposes semantics. The key is that the control must expose both a descriptive label and an activatable action to the accessibility layer, not just a visual tap region.',
      'Use widget tests with meetsGuideline: expect(tester, meetsGuideline(textContrastGuideline)), androidTapTargetGuideline / iOSTapTargetGuideline for size, and labeledTapTargetGuideline for labels. Combine with matchesSemantics/SemanticsTester to assert specific labels and flags. Wiring these into CI catches contrast, tap-target, and missing-label regressions on every PR, complemented by periodic manual TalkBack/VoiceOver passes.'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Semantics: labeling an icon-only control',
        code: `// BAD: a painted, tappable box the screen reader cannot describe or activate.
GestureDetector(
  onTap: _addToCart,
  child: Container(padding: const EdgeInsets.all(12), child: const Icon(Icons.add_shopping_cart)),
);

// GOOD: expose a label + button role + activatable action.
Semantics(
  button: true,
  label: 'Add to cart',
  onTap: _addToCart,
  child: GestureDetector(
    onTap: _addToCart,
    child: Container(
      padding: const EdgeInsets.all(12),
      child: ExcludeSemantics(child: const Icon(Icons.add_shopping_cart)), // icon is decorative now
    ),
  ),
);

// BEST: use a real button — it already emits correct semantics.
IconButton(
  onPressed: _addToCart,
  tooltip: 'Add to cart',      // becomes the semantic label
  icon: const Icon(Icons.add_shopping_cart),
);`
      },
      {
        lang: 'javascript',
        label: 'MergeSemantics + text scaling + live announcement',
        code: `import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';

class PriceRow extends StatelessWidget {
  const PriceRow({super.key, required this.label, required this.amount});
  final String label;
  final String amount;

  @override
  Widget build(BuildContext context) {
    // Read the user's text scale — never hard-code sizes (Flutter 3.16+ TextScaler).
    final scaler = MediaQuery.textScalerOf(context);

    // MergeSemantics: read "Total 12 dollars" as ONE stop, not two.
    return MergeSemantics(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, textScaler: scaler),
          Text(amount, textScaler: scaler,
              style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

// Announce a transient change (e.g. item added) to the screen reader.
void announceAdded(BuildContext context) {
  SemanticsService.announce('Item added to cart', Directionality.of(context));
}`
      },
      {
        lang: 'javascript',
        label: 'Testing a11y: contrast, tap targets, labels in CI',
        code: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('checkout button meets accessibility guidelines', (tester) async {
    final handle = tester.ensureSemantics(); // build the semantics tree for the test
    await tester.pumpWidget(const MyApp());

    // Sufficient color contrast (WCAG AA 4.5:1 for normal text).
    await expectLater(tester, meetsGuideline(textContrastGuideline));

    // Minimum touch-target size (48x48 Android / 44x44 iOS).
    await expectLater(tester, meetsGuideline(androidTapTargetGuideline));

    // Every tappable control has a semantic label.
    await expectLater(tester, meetsGuideline(labeledTapTargetGuideline));

    // Assert a specific label exists.
    expect(
      tester.getSemantics(find.bySemanticsLabel('Add to cart')),
      matchesSemantics(isButton: true, hasTapAction: true, label: 'Add to cart'),
    );
    handle.dispose();
  });
}`
      }
    ]
  },
  {
    id: 'deep-linking', phase: 2, phaseName: 'UI Building & Navigation',
    orderIndex: 99, estimatedMins: 50, prerequisites: ['flutter-intro'],
    title: 'Deep Linking & App Links',
    eli5: 'A deep link is a URL that opens a specific page inside your app instead of the app\'s home screen — like a link that jumps straight to one product, not just the shop\'s front door. On phones you also want tapping "myshop.com/item/42" in a browser or email to open your app on that exact item, and to work even if the app was closed.',
    analogy: 'A normal app icon is the front door of a building — you always start in the lobby. A deep link is an elevator with a "floor 7, apartment 3" button that drops the visitor directly at the right door. Android App Links and iOS Universal Links are the building signing a verified lease with a web domain, so the OS trusts that myshop.com really owns this app and skips the "which app should open this?" chooser.',
    explanation: 'Deep linking maps external URIs to in-app destinations so links from browsers, emails, notifications, ads, or other apps land users on the exact screen. There are two flavors of link. Custom-scheme links (myapp://product/42) are simple and always route to your app, but any app can claim the scheme and browsers will not open them — they are fine for internal/OAuth callbacks but weak for public sharing. HTTP(S) links via Android App Links and iOS Universal Links use your real https domain, are cryptographically verified against a file you host, open your app with no disambiguation dialog, and gracefully fall back to the website if the app is not installed — this is the modern default for shareable links. In Flutter, go_router turns incoming URIs into route matches and rebuilds the navigation stack, and you must handle both the cold-start case (app launched by the link) and the running-app case (link arrives while the app is alive).',
    technicalDeep: 'Platform verification is the crux. Android App Links: declare an intent-filter with android:autoVerify="true" for your https host/scheme in AndroidManifest.xml, and host /.well-known/assetlinks.json on that domain listing your package name and the app\'s SHA-256 signing-certificate fingerprints (include both Play App Signing and upload keys). The OS fetches and verifies this at install/update; if it matches, links open your app directly, otherwise they fall back to the browser or a chooser. iOS Universal Links: add the Associated Domains capability with applinks:yourdomain.com, and host /.well-known/apple-app-site-association (AASA) — a JSON (served as application/json, NO .json extension, over HTTPS, no redirects) mapping your Team ID + bundle ID (appID) to URL path patterns. iOS fetches AASA on install (and via a CDN), so propagation can lag. Flutter routing: modern Flutter enables the Android v2 embedding deep-link handling; set FlutterDeepLinkingEnabled appropriately and let the Router/go_router parse. go_router uses a RouteInformationParser under the hood; the initial URI populates the first route (cold start), and platform link events update it while running. Read path/query params via GoRouterState (state.pathParameters, state.uri.queryParameters). For custom logic (auth gating, rewriting), use go_router redirect. When you need lower-level control or non-go_router setups, the app_links package exposes getInitialLink() (cold start) and a uriLinkStream (running app) — the classic uni_links is now largely superseded by app_links. Cold-start vs warm: on cold start the URI must be consumed as the initialRoute before your first frame; on a running app the OS delivers the link via a stream/callback and you push/replace onto the existing stack — miss this and warm-state links silently do nothing. Testing: adb shell am start -W -a android.intent.action.VIEW -d "https://yourdomain.com/item/42" for Android; xcrun simctl openurl booted "https://yourdomain.com/item/42" for iOS; and Android Studio\'s App Links Assistant plus the Digital Asset Links API (digitalassetlinks.googleapis.com) to validate assetlinks.json.',
    whatBreaks: 'Serving apple-app-site-association with a .json extension, wrong content-type, behind a redirect, or requiring auth → Universal Links silently fail and links open Safari instead. Wrong or missing SHA-256 fingerprint in assetlinks.json (forgetting the Play App Signing cert vs the upload cert) → Android shows a chooser or opens the browser. Handling only the cold-start link and forgetting the uriLinkStream → links do nothing when the app is already open. Assuming custom schemes work from browsers/email — they do not, and any app can hijack the scheme. Not deduplicating an initial link that both getInitialLink() and the stream deliver → the destination opens twice. iOS AASA propagation delay makes it "not work" right after deploy even when configured correctly. Path patterns in AASA/intent-filter not matching your real URLs. Deep-linking into an auth-gated screen without a redirect guard → users land on a screen they cannot see or a broken back stack. Not building a sensible back stack (link drops user 3 levels deep with no way back to home).',
    efficientWay: {
      title: 'Implementing deep links that actually open the app',
      approaches: [
        { name: 'https App Links / Universal Links with verification files', verdict: 'best', reason: 'Verified https links open your app with no chooser, fall back to the web when uninstalled, and cannot be hijacked — the correct default for shareable links.' },
        { name: 'go_router for URI → route parsing', verdict: 'best', reason: 'Declarative routes, typed path/query params via GoRouterState, and redirect guards handle both cold-start and running-app links cleanly.' },
        { name: 'app_links package for low-level link events', verdict: 'ok', reason: 'Great when you are not on go_router or need explicit getInitialLink()/uriLinkStream control, but you must wire routing and de-duplication yourself.' },
        { name: 'Custom scheme (myapp://) for public sharing', verdict: 'weak', reason: 'Not openable from browsers/email and hijackable by any app — acceptable only for OAuth callbacks or internal navigation, not shareable links.' },
        { name: 'Handling only the cold-start link', verdict: 'weak', reason: 'Ignores links that arrive while the app is running, so warm-state deep links silently fail — you must also listen to the stream.' }
      ],
      recommendation: 'Use verified https App Links + Universal Links as the primary mechanism, host correct assetlinks.json and apple-app-site-association files (AASA: no extension, application/json, HTTPS, no redirect), and route with go_router — parse params from GoRouterState and gate protected destinations with redirect. Always handle BOTH cold start and the running-app link stream, de-duplicate the initial link, and construct a sensible back stack. Reserve custom schemes for OAuth callbacks only.',
    },
    commonMistakes: [
      'Misconfiguring apple-app-site-association: wrong content-type, a .json extension, HTTP, or a redirect — Universal Links then silently open Safari instead of the app.',
      'Putting the wrong SHA-256 fingerprint in assetlinks.json (using the upload key but not the Play App Signing key), so Android never verifies the link.',
      'Handling only the cold-start initial link and never subscribing to the running-app link stream, so warm-state links do nothing.',
      'Using a custom scheme (myapp://) for links shared via browser/email/SMS, where they cannot open the app and can be hijacked.',
      'Deep-linking straight into an auth-gated screen without a go_router redirect guard, landing users on a broken or invisible page.',
      'Failing to de-duplicate the initial URI delivered by both getInitialLink() and the stream, opening the destination twice.'
    ],
    seniorNotes: 'Senior signal: lead with the verification model, because that is where deep links actually break in production. Be able to recite the exact AASA gotchas (no .json extension, application/json, HTTPS, no redirects, appID = TeamID.BundleID) and the assetlinks.json requirement to include BOTH the Play App Signing and upload SHA-256 fingerprints — teams routinely ship broken links by omitting one. Distinguish custom schemes (unverified, hijackable, browser-hostile — fine for OAuth callbacks) from verified https links (the shareable default). Explain the cold-start vs warm-start lifecycle explicitly and why you must consume the initial link AND subscribe to the stream, with de-duplication. Discuss architecture: centralize link parsing in go_router with redirect for auth gating and deferred deep links (store the target, complete login, then navigate), build a correct back stack rather than dumping users deep with no way home, and consider deferred deep linking / attribution (Branch, Firebase Dynamic Links — note FDL is deprecated/shutting down in 2025, so plan a migration). Mention security: never trust link params blindly (validate/authorize server-side), watch for open-redirect and link-spoofing, and treat deep links as untrusted input. This topic is a favorite because it spans native config, routing, lifecycle, security, and growth/attribution — a full-stack mobile concern.',
    interviewQuestions: [
      'What is the difference between a custom-scheme deep link and an Android App Link / iOS Universal Link?',
      'Walk me through the verification files needed for App Links and Universal Links and their common pitfalls.',
      'How do you handle a deep link when the app is cold-started versus already running?',
      'How would you deep-link into an authentication-gated screen safely with go_router?',
      'Firebase Dynamic Links is going away — how would you architect deferred deep linking / attribution instead?'
    ],
    interviewAnswers: [
      'A custom-scheme link (myapp://path) always routes to your app but is unverified — any app can register the same scheme, and browsers/email clients will not open it, so it is unsuitable for public sharing (fine for OAuth callbacks). An App Link/Universal Link uses your real https domain, is cryptographically verified against a file you host on that domain, opens your app with no disambiguation chooser, and falls back to your website when the app is not installed — the correct choice for shareable links.',
      'Android needs /.well-known/assetlinks.json listing your package name and the SHA-256 fingerprints of BOTH the Play App Signing cert and the upload cert, plus android:autoVerify="true" on the intent-filter. iOS needs /.well-known/apple-app-site-association: valid JSON served as application/json, NO .json extension, over HTTPS, with NO redirects, mapping appID (TeamID.BundleID) to path patterns, plus the Associated Domains capability (applinks:domain). Common pitfalls: wrong/omitted fingerprint on Android; on iOS a .json extension, wrong content-type, a redirect, or AASA CDN propagation delay after deploy.',
      'On cold start the launching URI must be consumed before the first frame and used as the initial route — with go_router it seeds the initial location, or with app_links you read getInitialLink(). While the app is running the OS delivers the link asynchronously via a stream (app_links uriLinkStream / platform Router callback), and you push or replace onto the existing navigation stack. You must handle both, and de-duplicate because the initial link can arrive via both paths, otherwise the screen opens twice or warm links do nothing.',
      'Put the parsed link through a go_router redirect that checks auth state: if the user is unauthenticated, store the intended location (deferred deep link), send them to sign-in, and after login navigate to the stored target. Protected routes therefore never render for signed-out users, the back stack stays coherent, and you validate/authorize the resource server-side since link params are untrusted input.',
      'Because FDL is deprecated (shutting down in 2025), use a dedicated attribution/deferred-deep-link provider (e.g. Branch, Adjust, AppsFlyer) or roll your own: on first install, the SDK matches the click to the install and hands you the original link so you can route post-onboarding. Architecturally, keep https App Links/Universal Links for direct opens, add a deferred layer for the "not installed yet" path, store the pending destination, complete install/login, then navigate — and validate all link data server-side.'
    ],
    codeExamples: [
      {
        lang: 'json',
        label: 'Verification files: assetlinks.json + apple-app-site-association',
        code: `// Android: https://yourdomain.com/.well-known/assetlinks.json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.myshop",
    "sha256_cert_fingerprints": [
      "AB:CD:...:Play_App_Signing_cert_SHA256",
      "12:34:...:Upload_cert_SHA256"
    ]
  }
}]

// iOS: https://yourdomain.com/.well-known/apple-app-site-association
// MUST be application/json, NO .json extension, HTTPS, no redirects.
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAMID1234.com.example.myshop",
      "paths": ["/item/*", "/order/*", "NOT /admin/*"]
    }]
  }
}`
      },
      {
        lang: 'xml',
        label: 'Native config: AndroidManifest intent-filter + iOS Associated Domains',
        code: `<!-- android/app/src/main/AndroidManifest.xml (inside <activity>) -->
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="yourdomain.com" />
</intent-filter>

<!-- Tell the Flutter engine to hand deep links to the Router/go_router -->
<meta-data android:name="flutter_deeplinking_enabled" android:value="true" />

<!-- iOS: Runner.entitlements (Associated Domains capability) -->
<!--
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:yourdomain.com</string>
</array>
-->`
      },
      {
        lang: 'javascript',
        label: 'go_router deep-link config with typed params + auth redirect',
        code: `import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

final router = GoRouter(
  initialLocation: '/',
  // Runs on cold-start AND running-app links; gate protected destinations.
  redirect: (context, state) {
    final loggedIn = AuthService.instance.isLoggedIn;
    final goingToOrder = state.matchedLocation.startsWith('/order');
    if (goingToOrder && !loggedIn) {
      // Deferred deep link: remember where they wanted to go.
      return '/login?from=\${Uri.encodeComponent(state.uri.toString())}';
    }
    return null; // no redirect
  },
  routes: [
    GoRoute(path: '/', builder: (c, s) => const HomeScreen()),
    GoRoute(
      // Matches https://yourdomain.com/item/42?ref=email  and  myapp://item/42
      path: '/item/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;              // path param
        final ref = state.uri.queryParameters['ref'];        // query param
        return ProductScreen(productId: id, referrer: ref);
      },
    ),
    GoRoute(path: '/order/:orderId', builder: (c, s) =>
        OrderScreen(orderId: s.pathParameters['orderId']!)),
    GoRoute(path: '/login', builder: (c, s) =>
        LoginScreen(returnTo: s.uri.queryParameters['from'])),
  ],
);

// MaterialApp.router(routerConfig: router)
// go_router parses the launch URI (cold start) and platform link stream
// (running app) for you — no manual getInitialLink()/stream wiring needed.`
      },
      {
        lang: 'bash',
        label: 'Testing deep links from the command line',
        code: `# Android — simulate an https App Link (cold start or running app)
adb shell am start -W -a android.intent.action.VIEW \\
  -d "https://yourdomain.com/item/42?ref=test" com.example.myshop

# Android — verify App Links domain association status
adb shell pm get-app-links com.example.myshop

# iOS Simulator — open a Universal Link
xcrun simctl openurl booted "https://yourdomain.com/item/42?ref=test"

# Validate assetlinks.json via Google's Digital Asset Links API
curl "https://digitalassetlinks.googleapis.com/v1/statements:list?\\
source.web.site=https://yourdomain.com&\\
relation=delegate_permission/common.handle_all_urls"`
      }
    ]
  }
]
