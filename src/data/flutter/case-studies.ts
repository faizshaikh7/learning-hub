import type { CaseStudy } from '@/types'

/** Real-world Flutter / cross-platform mobile case studies from industry leaders. */
export const FLUTTER_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'alibaba-xianyu',
    company: 'Alibaba (Xianyu)',
    logo: '🛒',
    title: 'Xianyu: Flutter in a 50M-User Marketplace App',
    industry: 'E-commerce / Second-hand marketplace',
    scale: '50M+ users · 2.8B items listed · First major production Flutter deployment at scale',
    problem: `Xianyu (Idle Fish) is Alibaba\'s second-hand goods marketplace — China\'s equivalent of eBay. By 2017, Xianyu had separate iOS and Android codebases maintained by separate teams. This created persistent problems: features launched on iOS took weeks to reach Android. UI inconsistencies between platforms confused users. Two code reviews for every feature doubled engineering cost. With 50 million users and 2.8 billion listed items, maintaining two native codebases was unsustainable.

Alibaba was part of Google\'s Flutter early access program. Xianyu became one of the first production deployments of Flutter at meaningful scale, before Flutter even reached 1.0 (they adopted Flutter in beta in 2017). The engineering challenge: prove that Flutter could handle a high-traffic e-commerce app with complex animations, real-time chat, image-heavy feeds, and integration with Alibaba\'s existing native SDKs (payments, login, analytics).`,
    solution: `Xianyu didn\'t do a full rewrite. Instead, they adopted Flutter using a "hybrid" approach: the app shell (navigation, authentication) remained native (iOS/Android), while specific screens and flows were built in Flutter. This let them migrate page by page, proving Flutter\'s capabilities before committing fully.

The most demanding UI requirements were: (1) the item detail page with complex animations (parallax header, sticky detail panel, animated price reveal), (2) the in-app chat system with real-time message updates and media sending, and (3) the image browsing experience with pinch-to-zoom and swipe gestures. Flutter\'s Skia-based rendering engine handled all three without frame drops — the Flutter team noted Xianyu was one of the first apps to stress-test Flutter\'s animation subsystem in production.

For native SDK integration (Alipay payment, Alibaba account system, analytics), Xianyu built Flutter Platform Channels — a bidirectional communication bridge between Flutter Dart code and native iOS/Android code. Platform channels allowed Flutter to call native Alipay\'s payment flow (which is deeply integrated with the OS) and receive the result back in Flutter.`,
    architecture: `Xianyu\'s architecture became the blueprint for large-scale Flutter hybrid integration. The core insight: Flutter doesn\'t have to replace your entire app. The FlutterEngine can be embedded in a native app and activated for specific screens. When the user navigates to a Flutter screen, the FlutterEngine renders to a native view surface.

For performance, Xianyu pre-warms the FlutterEngine at app startup (before it\'s needed). This avoids the 1-2 second initialization delay that would be noticeable if the engine starts on first navigation. Pre-warmed engines have the Dart VM initialized and the Flutter framework mounted, so the first Flutter screen appears instantly.

State management across the hybrid boundary was the trickiest engineering problem. The native app had state (user session, cart contents). Flutter screens needed access to this state. Xianyu solved this with a custom "bridging" Dart layer that serializes native state to JSON, passes it via platform channel at screen launch, and propagates any changes back to native via reverse channel calls. This pattern is now standard in hybrid Flutter architectures.`,
    techStack: ['Flutter', 'Dart', 'Kotlin', 'Swift', 'Platform Channels', 'Alibaba Cloud', 'Alipay SDK', 'Bloc (state management)'],
    keyDecisions: [
      {
        decision: 'Hybrid native + Flutter instead of full Flutter rewrite',
        why: 'Full rewrite risk is enormous for a 50M user app. Hybrid lets you prove Flutter page by page while keeping the existing native infrastructure intact.',
        tradeoffs: 'Hybrid apps have the complexity of two rendering engines. Navigation stack management across Flutter and native screens requires careful coordination.',
      },
      {
        decision: 'Pre-warm FlutterEngine at startup',
        why: 'Cold-starting the Dart VM + Flutter framework takes 1-2 seconds — noticeable as a blank screen on first Flutter navigation. Pre-warming amortizes this cost to app startup (where users expect some loading).',
        tradeoffs: 'Pre-warmed engine uses ~50MB additional memory even when no Flutter screen is visible. Acceptable on modern devices with 4GB+ RAM.',
      },
      {
        decision: 'Platform Channels for native SDK integration',
        why: 'Payment, identity, and analytics SDKs are deeply OS-integrated. Rewriting them in Dart would be months of work with no quality guarantee. Platform Channels call existing native code from Flutter with a structured message-passing API.',
        tradeoffs: 'Platform Channels are asynchronous (no return value without await). Complex native flows (multi-step payment authorization) require careful async state management on the Flutter side.',
      },
    ],
    results: [
      'Engineering velocity 2x — same features reach iOS and Android simultaneously',
      'UI consistency: pixel-identical experiences across both platforms',
      'Developer count for UI features reduced from 2 teams to 1',
      'Complex animations run at 60fps on mid-range Android devices',
      'Became the reference implementation for hybrid Flutter integration (Flutter team documentation)',
    ],
    lessonsLearned: [
      'Hybrid integration is the right first step for large apps — full rewrite risk is too high',
      'Pre-warming the FlutterEngine is mandatory for hybrid apps — cold start is a dealbreaker',
      'Platform Channels work well for discrete native SDK calls but poorly for real-time native state sync',
      'Flutter\'s animation system is genuinely competitive with native — complex animations are a Flutter strength, not weakness',
      'Adopting in beta requires close partnership with the Flutter team — Xianyu filed dozens of bug reports that improved Flutter for everyone',
    ],
    relevantTopics: ['platform-channels', 'flutter-architecture', 'state-management', 'flutter-performance', 'hybrid-apps', 'animations'],
    estimatedMins: 20,
  },

  {
    id: 'google-pay-flutter',
    company: 'Google Pay',
    logo: '💳',
    title: 'Google Pay\'s Flutter Migration: Cross-Platform Payments at Global Scale',
    industry: 'Fintech / Payments',
    scale: '180M+ users · 70+ countries · Payments must be 100% reliable · iOS + Android parity',
    problem: `Google Pay had separate iOS and Android codebases maintained by separate teams. A payments application has uniquely stringent requirements: every pixel of UI must communicate trust and security. An animation glitch or layout inconsistency during payment authorization can cause users to abandon the transaction. Both platforms had to look and feel identical because inconsistency reads as buggy to financial app users.

The feature velocity problem: when Google introduced Tap to Pay (holding your phone to a card reader), the iOS implementation lagged Android by 4 months. Users complained about being the "second-class" Google Pay platform. Security reviews had to be duplicated for both codebases. With 70+ countries and multiple payment networks (cards, bank transfers, UPI, QR codes), the complexity of maintaining two codebases with full feature parity was causing significant drag.`,
    solution: `Google\'s Payments team chose Flutter after an internal evaluation in 2021. The decision factors: (1) Flutter\'s single codebase produces pixel-identical UI on both platforms — critical for payment trust signals, (2) Flutter\'s testing infrastructure (widget tests, integration tests, golden file tests) allowed the security team to audit one codebase instead of two, (3) Flutter\'s rendering pipeline could handle the complex animations Google Pay uses (card flip animations, NFC contactless indicators, payment status sequences) at 60fps on all devices.

The migration strategy: the team built new payment flows in Flutter while maintaining existing flows in native. New countries\' implementations were Flutter-first. Over 18 months, existing flows were migrated page by page. Google\'s Material Design team worked directly with the Flutter team to ensure that Google Pay\'s Material You theming (Android 12\'s dynamic color system) worked seamlessly in Flutter.

For payment security, Google Pay\'s Flutter code runs in the same process as native — it shares the device\'s secure enclave access and NFC hardware abstraction layer via platform channels. The payment token generation and cryptographic operations run in native code; Flutter handles only the UI layer.`,
    architecture: `Google Pay\'s Flutter architecture is organized around a "payment flow" state machine. Each payment has states: initiated → amount confirmed → authentication → authorization → complete (or failed). The Flutter UI reflects this state machine — transitions between states drive animations and screen changes. Using a state machine makes it impossible to show a "Payment Successful" screen without authorization completing — a security property guaranteed by the architecture.

For global localization, Google Pay uses Flutter\'s Intl package and custom locale-specific UI configurations. A payment flow in India shows UPI options and QR codes; Germany shows bank transfer; US shows cards. Flutter\'s conditional widget composition makes this clean: the \`PaymentOptionsWidget\` selects different widget subtrees based on locale configuration, all sharing the same state management and payment logic.

Testing strategy: Google Pay uses golden file tests extensively. Every screen in every locale at every state has a reference screenshot ("golden file"). CI runs these tests on every commit — if any pixel changes unexpectedly, the test fails. This pixel-level regression testing gives the security team high confidence that UI changes don\'t inadvertently alter payment flow UI in ways that could mislead users.`,
    techStack: ['Flutter', 'Dart', 'Kotlin', 'Swift', 'Platform Channels', 'Riverpod (state management)', 'Intl', 'Google Cloud', 'Firebase'],
    keyDecisions: [
      {
        decision: 'Flutter for UI layer, native for cryptographic operations',
        why: 'Flutter runs in the Dart VM — not the right environment for cryptographic key operations that require hardware security module access. Native code handles security; Flutter handles UX.',
        tradeoffs: 'Platform channel calls for cryptographic operations add latency. Google measured this at <2ms — acceptable for user-initiated operations.',
      },
      {
        decision: 'State machine architecture for payment flows',
        why: 'Payment flows must not allow invalid state transitions (can\'t show "success" without authorization). State machines make invalid transitions impossible by construction.',
        tradeoffs: 'State machines are verbose to define and update. Google used code generation to reduce boilerplate.',
      },
      {
        decision: 'Golden file tests for visual regression',
        why: 'A payment UI that looks different from what users expect triggers distrust. Golden file tests catch unintended visual changes at the pixel level, before they reach users.',
        tradeoffs: 'Golden files must be updated intentionally when UI changes. Requires discipline to update intentionally vs blindly approving diffs.',
      },
    ],
    results: [
      'iOS and Android feature parity achieved and maintained continuously',
      'New country launch time reduced from 4 months to 6 weeks',
      'Security audit scope halved (one codebase vs two)',
      'Payment flow animations run at 60fps on devices as old as 2017 flagships',
      'Developer headcount for UI features reduced 30% with same output',
    ],
    lessonsLearned: [
      'For fintech, visual consistency isn\'t cosmetic — inconsistency erodes payment trust',
      'State machine architecture for flows with strict sequential requirements is worth the upfront complexity',
      'Golden file tests are underused — they catch visual regressions that unit tests miss entirely',
      'Security-sensitive operations belong in native code; Flutter handles UX',
      'A/B testing payment flows requires Flutter\'s experiment infrastructure from day one — don\'t retrofit it',
    ],
    relevantTopics: ['platform-channels', 'flutter-architecture', 'state-management', 'testing', 'animations', 'flutter-performance'],
    estimatedMins: 20,
  },

  {
    id: 'bmw-connected-car',
    company: 'BMW',
    logo: '🚗',
    title: 'BMW\'s My BMW App: Flutter for Connected Car Experiences',
    industry: 'Automotive',
    scale: '10M+ app users · 30+ countries · 1.5M connected BMWs · iOS + Android + CarPlay',
    problem: `BMW\'s My BMW app allows owners to remotely control their car: check fuel and battery level, lock/unlock doors, pre-condition the cabin temperature, track the car\'s location, and start the engine remotely. BMW had separate iOS and Android teams, and the apps frequently diverged — a feature released on Android in January might reach iOS in April, or have subtle UI differences that confused users who switched devices.

BMW\'s engineering challenge was unique: the app had to integrate with BMW\'s proprietary vehicle communication protocols, present complex real-time vehicle telemetry (range, charge level, door state), and do it for 30+ countries with different EV incentive programs, different connected services features, and different legal requirements for remote start. The dual codebase was a maintenance burden that grew with each new BMW model and connected feature.`,
    solution: `BMW chose Flutter for the My BMW app redesign in 2021. The key factors: Flutter\'s single codebase with platform-specific adaptations, the ability to implement BMW\'s design language (curved lines, dark UI, cinematic animations) identically across platforms, and Flutter\'s native performance for animations on mobile.

The app\'s signature feature — the 3D car visualization that rotates and highlights as you interact with different car systems — was implemented using Flutter\'s canvas drawing API and a custom 3D projection library. When you unlock the doors, the 3D model animates the doors opening. When you check the charge level, animated lightning bolts flow from the charger plug. These animations would have required platform-specific Metal (iOS) or Vulkan (Android) code without Flutter; in Flutter, they\'re pure Dart.

For real-time vehicle telemetry, the app uses WebSockets to BMW\'s Connected Drive cloud backend. Vehicle state updates (charge percentage, range, door status) stream from the car via BMW\'s cellular modem to the cloud and then to the app. Flutter\'s reactive state management (Riverpod) propagates these updates through the UI without manual update calls.`,
    architecture: `BMW structured the app around a "vehicle model" — a Dart object that represents the complete state of a connected BMW. This object is the single source of truth: it receives updates from BMW\'s cloud API and emits change notifications to any widget that depends on it. This Clean Architecture separation means BMW\'s engineering team can update the API layer (vehicle communication protocol) without touching the UI layer, and vice versa.

For the 3D visualization, BMW built a custom Flutter rendering pipeline using Flutter\'s Canvas API and a perspective projection matrix. Car body panels are defined as polygon meshes in a configuration file. The rendering layer projects these 3D coordinates to 2D screen coordinates, draws them with gradients for the metallic effect, and handles depth sorting for correct occlusion. This custom renderer runs at 60fps on all supported devices.

Integration with CarPlay (iOS) and Android Auto (Android) required platform channels: BMW\'s Flutter app sends vehicle state data to native CarPlay extensions, which render the CarPlay-specific UI using native UIKit. Flutter doesn\'t support CarPlay natively — the native extensions are thin wrappers that receive data from Flutter and display it in platform-required CarPlay format.`,
    techStack: ['Flutter', 'Dart', 'Riverpod', 'WebSockets', 'Firebase', 'REST APIs', 'Platform Channels', 'CarPlay SDK', 'Android Auto SDK'],
    keyDecisions: [
      {
        decision: 'Custom 3D renderer in Flutter Canvas instead of Unity/WebGL',
        why: 'Unity integration adds 50MB to app size. WebGL requires a WebView (slow, heavy). Simple 3D visualization with polygon meshes is achievable with Flutter\'s Canvas API at lower size and better performance.',
        tradeoffs: 'Custom renderer requires dedicated maintenance. 3D engine updates (new car models) require code changes. BMW built internal tooling to convert CAD models to Flutter polygon meshes.',
      },
      {
        decision: 'WebSocket streaming for vehicle telemetry',
        why: 'Vehicle state changes continuously (battery charges, location moves). Polling via REST would miss updates or require high-frequency polling. WebSocket maintains a persistent connection for real-time push.',
        tradeoffs: 'WebSocket connections drain battery. BMW uses exponential backoff reconnection and pauses the connection when the app is backgrounded.',
      },
      {
        decision: 'Platform Channels for CarPlay/Android Auto',
        why: 'CarPlay and Android Auto have strict UI templates. BMW cannot render custom Flutter UI inside CarPlay — Apple requires UIKit-based extensions. Platform channels bridge Flutter state to native CarPlay rendering.',
        tradeoffs: 'Adds native code that must be maintained. CarPlay updates may require changes to both the native extension and the Flutter data layer.',
      },
    ],
    results: [
      '10M app downloads with consistent iOS/Android experience',
      '3D vehicle visualization at 60fps across all supported devices',
      'Feature parity across iOS and Android maintained on same release schedule',
      'Development velocity 40% higher vs dual-codebase approach',
      'App size 30% smaller vs equivalent React Native implementation (benchmark)',
    ],
    lessonsLearned: [
      'Flutter\'s Canvas API is a powerful 2D/pseudo-3D graphics tool — don\'t default to Unity for simple 3D',
      'Connected IoT apps need WebSocket-first architecture — polling is too slow and battery-expensive',
      'Clean Architecture (separate data/domain/presentation layers) is more important in Flutter than in native — shared codebase means bad architecture affects both platforms',
      'CarPlay/Android Auto require native code — design for platform channels from the start',
      'Real-time state management (Riverpod/BLoC) shines for IoT apps where device state changes continuously',
    ],
    relevantTopics: ['platform-channels', 'flutter-architecture', 'state-management', 'animations', 'flutter-performance', 'networking'],
    estimatedMins: 20,
  },

  {
    id: 'nubank-banking',
    company: 'Nubank',
    logo: '💜',
    title: 'Nubank: Building a $45B Neobank Entirely on Flutter',
    industry: 'Fintech / Digital Banking',
    scale: '80M customers · $45B valuation · Largest neobank in the world · Brazil → Mexico → Colombia',
    problem: `Nubank launched in Brazil in 2013 with a simple premise: banking that doesn\'t suck. Brazilian banking had historically terrible UX — branch-only operations, paper forms, 3-week processing times. Nubank\'s product hypothesis was that a beautiful, fast, entirely digital bank account could attract customers who were underserved by traditional banks.

The engineering challenge: build a full-featured banking app (credit card, debit account, investments, insurance) that passes Brazil\'s BACEN (central bank) security requirements, works on low-end Android devices (Brazil\'s market is predominantly Android with significant mid-range/low-end device usage), and supports rapid feature iteration (Nubank releases every 2 weeks). Maintaining two native codebases for their pace of iteration was slowing them down.`,
    solution: `Nubank adopted Flutter for their entire mobile app in 2019. As one of the first major fintech companies to fully commit to Flutter (not a hybrid approach), Nubank became a case study the Flutter team references. The decision was driven by three factors specific to their market: (1) Flutter performs well on mid-range Android devices that dominate the Brazilian market, (2) a single codebase enables their 2-week release cadence without separate iOS/Android release trains, (3) Flutter\'s testing infrastructure (widget tests, integration tests) supports the rigorous quality standards BACEN requires.

The app\'s signature experience is its minimalist purple UI: large typography, maximum whitespace, one action per screen. This design is actually easier to implement in Flutter than in native — Flutter\'s layout system (Column, Row, Expanded, Padding) composites to exactly this style with less code than UIKit\'s AutoLayout constraints or Android\'s ConstraintLayout.

For biometric authentication (fingerprint, Face ID), Nubank uses the \`local_auth\` Flutter plugin, which wraps iOS Secure Enclave and Android BiometricPrompt via platform channels. The Dart code calls \`await auth.authenticate()\` — the native code handles the platform-specific UI and returns a boolean. The payment cryptography (token generation, transaction signing) runs entirely in native code; Flutter never touches cryptographic material.`,
    architecture: `Nubank\'s architecture uses the BLoC (Business Logic Component) pattern throughout. Each screen has a BLoC that:
- Receives events (user tapped "Pay", user entered amount)
- Emits states (loading, success, error, data)
- Communicates with repositories (network, local storage)

This architecture cleanly separates UI (Flutter widgets) from business logic (BLoC) from data (repositories). Nubank\'s BACEN compliance team can audit the BLoC layer without understanding Flutter widgets. The network layer can be replaced without touching the UI. Widget tests test UI in isolation with mock BLoCs.

For offline support (viewing account balance without connectivity), Nubank caches the most recent API responses using Hive (a local key-value database written in Dart). When the network is unavailable, the repository falls back to cached data with a "showing cached data" indicator. This is critical in Brazil where connectivity can be intermittent.

Feature flags are used extensively: new features deploy to 1% of users first. The feature flag system is implemented in the BLoC layer — the same Dart code runs on all users, but a BLoC factory creates either the "old" or "new" BLoC based on the feature flag value. This makes flag rollout invisible to the UI layer.`,
    techStack: ['Flutter', 'Dart', 'BLoC pattern', 'Hive', 'Dio', 'Platform Channels', 'Firebase', 'Firebase Crashlytics', 'local_auth'],
    keyDecisions: [
      {
        decision: 'Full Flutter commitment instead of hybrid',
        why: 'Hybrid apps still require native engineers for the shell and integrations. Nubank wanted to maximize the benefit of a single-team cross-platform approach. Full Flutter means one team owns the entire mobile app.',
        tradeoffs: 'Flutter community and plugin ecosystem was smaller in 2019. Some native capabilities (CarPlay, certain payment SDKs) had no Flutter support — required writing custom platform channels.',
      },
      {
        decision: 'BLoC for all business logic',
        why: 'BLoC\'s strict event → state flow is auditable. Every state change has a corresponding event. This traceability is critical for BACEN compliance — the auditor can see every state the payment flow can enter.',
        tradeoffs: 'BLoC is verbose. A simple form with validation requires defining events (FieldChanged, Submitted), states (Valid, Invalid, Loading, Success, Error), and the BLoC itself. More code than simpler approaches.',
      },
      {
        decision: 'Feature flags via BLoC factory',
        why: 'Deploying a new feature to 100% of 80M customers simultaneously is too risky. BLoC factories allow the same UI code to instantiate different business logic based on a flag, enabling graduated rollout.',
        tradeoffs: 'Old BLoCs must be maintained alongside new BLoCs until the flag reaches 100% and old BLoC is deleted. This creates temporary technical debt that must be actively cleaned up.',
      },
    ],
    results: [
      '80M customers served by a single Flutter codebase',
      '2-week release cadence maintained across iOS and Android simultaneously',
      '$45B valuation — world\'s largest neobank by customer count',
      'App Store rating: 4.8/5.0 (Brazil) — among highest-rated banking apps',
      'Engineering team 40% smaller than equivalent dual-codebase org per mobile feature delivered',
    ],
    lessonsLearned: [
      'BLoC\'s auditability is a genuine advantage for regulated industries — verbose is worth it when regulators need to review your code',
      'Offline-first is required for emerging markets — assume connectivity will fail and design accordingly',
      'Feature flags via BLoC factories allow safe progressive rollout of risky features like payment flows',
      'Flutter\'s performance on mid-range Android is genuinely good — don\'t assume premium device only',
      'Full Flutter commitment enables true one-team mobile ownership — hybrid perpetuates the need for separate native expertise',
    ],
    relevantTopics: ['flutter-architecture', 'state-management', 'platform-channels', 'testing', 'flutter-performance', 'networking'],
    estimatedMins: 25,
  },
]
