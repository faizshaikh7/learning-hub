import type { CurriculumTopic, FlashcardData } from '@/types'

/**
 * Extra foundational Mobile Development topics. These teach core concepts that
 * transfer to ANY framework (Flutter, React Native, Kotlin/Compose, Swift/SwiftUI):
 * animation & motion, touch/gesture/input handling, and reactive data flow.
 */

/** Phase 2 add-on: Animation & Motion (UI Rendering & the Frame Pipeline). */
export const MOBILE_ANIMATION: CurriculumTopic[] = [
  {
    "id": "frame-animation-motion",
    "phase": 2,
    "phaseName": "UI Rendering & the Frame Pipeline",
    "orderIndex": 8,
    "estimatedMins": 30,
    "prerequisites": [
      "frame-rendering-pipeline",
      "gpu-compositing",
      "frame-budget-jank"
    ],
    "title": "Animation & Motion",
    "eli5": "An animation is not one instruction like 'move the box to the right'. It is the phone drawing the box in a slightly different spot on every single frame — dozens of tiny steps a second — so your eye sees smooth motion instead of a jump. The phone works out where the box should be at each moment between the start and the end.",
    "analogy": "Animation is a flip-book. You do not draw 'the ball is now at the bottom'; you draw the ball a little lower on each page, and flipping the pages fast makes it fall smoothly. The animation system is the artist that fills in every in-between page (the tween) for you, deciding how fast the ball speeds up and slows down (the easing) between the first page and the last.",
    "explanation": "An animation is a value that changes over time and is sampled once per frame. You give the system a start value, an end value, and a duration; on every frame it computes where the value should be right now and the UI is redrawn with that value. Filling in the in-between values is called tweening (in-betweening), and the object that maps 'how far through the animation are we' (a 0..1 progress) to 'how far along the value are we' is the easing curve or interpolator. Linear easing moves at constant speed; ease-in-out starts slow, speeds up, and settles — which looks far more natural because real objects have inertia. Keyframes let you define several waypoints (at 0 percent do this, at 60 percent do that) and the system tweens between them.\n\nThere are two broad families. Value/property animation drives a concrete property (position, opacity, scale, color) from A to B over a fixed duration with a chosen curve — deterministic and repeatable. Physics/spring animation instead models the value like a mass on a spring: you give it a target, a stiffness, and a damping, and it settles naturally over a duration the physics decides, not one you hard-code. Springs feel alive and, crucially, are interruptible — if the target changes mid-flight the spring continues smoothly from its current position and velocity, whereas a fixed-duration tween tends to jump or restart.\n\nThe non-negotiable rule: because the value must be resampled every frame, an animation is only smooth if that per-frame work fits the frame budget and, ideally, runs on the compositor rather than the main thread. Animating a compositor-friendly property (transform, opacity) lets the animation advance on the render/compositor thread without re-running your layout or even waking your app code each frame, which is how you hold 60 or 120fps.\n\nHow Android does it vs How iOS does it: Android offers ValueAnimator/ObjectAnimator and the property-animation system with Interpolators, plus a physics-based SpringAnimation/FlingAnimation (DynamicAnimation) and, in Compose, animate*AsState / Animatable / updateTransition. iOS uses Core Animation (CABasicAnimation, CAKeyframeAnimation) and UIView animation, with UIViewPropertyAnimator for interruptible animations and spring APIs; SwiftUI exposes withAnimation and .animation with .easeInOut, .spring, and interpolatingSpring. Different names, identical model: a value tweened by a curve, sampled each frame.",
    "technicalDeep": "An animation is driven off the same VSync pulse as the render loop. Each frame the animator receives the elapsed time, converts it to a normalized progress t in 0..1 (t = elapsed / duration, clamped), passes t through the easing function to get an eased fraction, and interpolates the value: current = lerp(from, to, eased(t)). That value is written to a property and the affected node is invalidated. A keyframe animation is the same idea across segments: find which two keyframes t falls between, remap t to a local 0..1 for that segment, and interpolate between those two keyframe values. Spring animations do not use a fixed duration or an easing table at all; they integrate a differential equation each frame from the current position and velocity toward the target given stiffness and damping, stopping when both displacement and velocity fall below a threshold.\n\nWhere the animation runs decides whether it is smooth. If a property can be handled by the compositor (transform, opacity on an already-rasterized layer), the platform can hand the animation description to the render/compositor thread, which advances it every frame and re-composites without re-running measure/layout/draw and often without waking the main thread at all. This is why transform/opacity animations survive even when the main thread is briefly busy, while animating layout properties (width, height, top) forces a full measure/layout/draw pass every frame and drops frames under load. Interruptibility matters for touch-driven UI: a good system lets you retarget or cancel an in-flight animation and continue from the current value and velocity, so a user can grab a moving object without it snapping. Shared-element transitions are a special case: the same logical element on two screens is animated (position, size, corner radius) from its source frame to its destination frame so it appears to fly between screens rather than one screen cutting to another.\n\nCallout — How Android does it vs How iOS does it: Android's Core Animation equivalent is the property-animation system plus RenderThread — animations of transform/alpha can run on RenderThread (RenderNode properties) independent of the main thread; SpringAnimation provides physics, and MotionLayout/Transitions handle shared-element and choreographed motion. iOS Core Animation is explicitly a compositor-level animation engine: you set animations on CALayer and the separate render server advances them, so they keep running even if the main thread stalls; UIViewPropertyAnimator adds pause/scrub/reverse/retarget, and matchedGeometryEffect (SwiftUI) / UINavigationController transitions do shared elements. Both converge on: describe the animation declaratively, let the compositor drive it off the main thread.",
    "whatBreaks": "Animating layout properties (width, height, margins, top/left) instead of transform/scale forces a full measure/layout/draw pass every frame and drops frames. Driving an animation with your own timer/loop and mutating a value on the main thread each tick ties it to main-thread load, so any hitch stutters the motion. Using a fixed-duration tween for something the user can interrupt makes it jump or restart when the target changes mid-flight, instead of continuing smoothly. Forgetting to cancel an animation when its view is recycled or its screen is destroyed leaks work and can crash on a released target. Chaining long linear easings makes motion feel robotic; over-long durations make the app feel sluggish. Running many simultaneous animations that each invalidate large subtrees blows the GPU budget and janks.",
    "efficientWay": {
      "title": "Making Motion Smooth and Natural",
      "approaches": [
        {
          "name": "Animate compositor-friendly properties (transform/opacity) with the platform animator, use springs/eased curves, and make animations interruptible",
          "verdict": "best",
          "reason": "The animation advances on the compositor off the main thread, so it holds 60/120fps even under load, and springs/interruptibility make touch-driven motion feel natural and grabbable."
        },
        {
          "name": "Use the platform animator but animate layout properties or run moderately heavy per-frame work",
          "verdict": "ok",
          "reason": "Correct and declarative, but re-running layout each frame or heavy invalidations can drop frames on mid-range devices during complex motion; fine for small, infrequent animations."
        },
        {
          "name": "Hand-roll a timer/loop that mutates values on the main thread every tick",
          "verdict": "weak",
          "reason": "Tied to main-thread load so it stutters whenever the thread is busy, usually skips easing/physics, and is hard to interrupt or cancel cleanly — the classic janky, robotic animation."
        }
      ],
      "recommendation": "Let the platform's animation system drive motion off VSync, animate transform/opacity so the compositor can run it off the main thread, prefer springs or ease-in-out over linear, keep durations short (roughly 200-300ms for most UI), and always make user-interruptible animations retargetable and cancelable."
    },
    "commonMistakes": [
      "Animating width/height/margins instead of transform/scale, forcing a full layout pass every frame",
      "Driving animation from a hand-written main-thread timer so it stutters under load and ignores easing/physics",
      "Using linear easing everywhere, making motion feel mechanical instead of natural",
      "Not canceling animations when the view is recycled or the screen is destroyed, leaking work or crashing"
    ],
    "seniorNotes": "Judge motion by whether it survives a busy main thread: if a transform/opacity animation keeps running while the app decodes an image, it is on the compositor where it belongs. Prefer physics/springs for anything the user can interact with because they carry velocity across interruptions, which fixed-duration tweens cannot. Watch for animations that invalidate large subtrees — a cheap-looking fade over a complex layer can be expensive to composite. The model is fully cross-framework: Flutter's AnimationController + Tween + Curve and CurvedAnimation, React Native's Animated / Reanimated (which explicitly runs animations on the UI thread), Compose, and Core Animation all express the same 'value tweened by a curve, sampled per frame, ideally on the compositor' idea.",
    "interviewQuestions": [
      "What actually happens, frame by frame, when a UI element animates from one position to another?",
      "Why is animating transform/opacity cheaper and smoother than animating width/height, and what does 'running on the compositor' mean?",
      "What is the difference between a fixed-duration tween and a spring animation, and when would you choose a spring?"
    ],
    "interviewAnswers": [
      "The animation is a value sampled once per frame off VSync. Each frame the system computes progress t = elapsed/duration, passes t through an easing curve, and interpolates the property with lerp(from, to, eased(t)); it writes that value and redraws the affected node. Filling in those in-between values is tweening, and the curve decides how the motion accelerates and decelerates. It repeats every refresh until t reaches 1, so smooth motion is really dozens of tiny redraws per second.",
      "Transform and opacity are properties the compositor can apply to an already-rasterized layer texture, so animating them needs no measure, layout, or repaint — just a cheap GPU blend/transform each frame. 'Running on the compositor' means the platform hands the animation to the render/compositor thread, which advances it every frame and re-composites without re-running your layout or even waking your app code, so it stays smooth even if the main thread is briefly busy. Animating width/height changes geometry, forcing a fresh measure/layout/draw pass on the subtree every frame, which is far more work and drops frames under load.",
      "A fixed-duration tween interpolates from A to B over a duration you set using an easing curve; it is deterministic and repeatable but jumps or restarts if the target changes mid-flight. A spring models the value as a mass on a spring with stiffness and damping, settling over a duration the physics decides and carrying position and velocity across interruptions. I choose a spring for anything the user can grab or that can be retargeted mid-animation — like a dragged sheet or a card that follows the finger — because it continues smoothly from its current velocity instead of snapping."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Per-frame animation sampling (pseudocode)",
        "code": "// A fixed-duration, eased value animation, sampled each VSYNC.\nanim = {\n    from: 0, to: 300,        // e.g. translateX in logical units\n    duration: 250,           // ms\n    easing: easeInOut,       // maps 0..1 progress -> 0..1 eased\n    startTime: now(),\n    onFrame: (v) => view.translationX = v   // compositor property\n}\n\non VSYNC:\n    elapsed = now() - anim.startTime\n    t = clamp(elapsed / anim.duration, 0, 1)  // raw progress\n    e = anim.easing(t)                         // apply the curve\n    value = anim.from + (anim.to - anim.from) * e   // lerp\n    anim.onFrame(value)                        // write property\n    if t >= 1: finish(anim)                     // else wait next VSYNC\n\n// A spring instead integrates physics each frame (no fixed duration):\non VSYNC (spring):\n    force = -stiffness * (position - target) - damping * velocity\n    velocity += force * dt\n    position += velocity * dt\n    view.translationX = position\n    if abs(position - target) < eps and abs(velocity) < eps:\n        finish()   // settled naturally; interruptible: just change target"
      },
      {
        "lang": "kotlin",
        "label": "Declarative animation in Jetpack Compose",
        "code": "@Composable\nfun Expandable(expanded: Boolean) {\n    // animateDpAsState drives the value off VSync on each frame,\n    // using a spring so a change to `expanded` mid-flight retargets smoothly.\n    val height by animateDpAsState(\n        targetValue = if (expanded) 240.dp else 64.dp,\n        animationSpec = spring(\n            dampingRatio = Spring.DampingRatioMediumBouncy,\n            stiffness = Spring.StiffnessLow\n        ),\n        label = \"height\"\n    )\n    Box(Modifier.fillMaxWidth().height(height)) { /* content */ }\n}"
      }
    ],
    "resources": [
      {
        "label": "Android: Animations overview",
        "url": "https://developer.android.com/develop/ui/views/animations/overview",
        "kind": "docs"
      },
      {
        "label": "iOS: Core Animation (QuartzCore)",
        "url": "https://developer.apple.com/documentation/quartzcore",
        "kind": "docs"
      },
      {
        "label": "SwiftUI: Animation",
        "url": "https://developer.apple.com/documentation/swiftui/animation",
        "kind": "docs"
      }
    ]
  }
]

/** Phase 3 add-on: Touch, Gestures & Input Handling (Adaptive UI, Navigation & Accessibility). */
export const MOBILE_GESTURES: CurriculumTopic[] = [
  {
    "id": "touch-gestures-input",
    "phase": 3,
    "phaseName": "Adaptive UI, Navigation & Accessibility",
    "orderIndex": 8,
    "estimatedMins": 32,
    "prerequisites": [
      "frame-rendering-pipeline",
      "main-ui-thread"
    ],
    "title": "Touch, Gestures & Input Handling",
    "eli5": "When your finger touches the screen, the phone does not just get 'a tap'. It gets a stream of tiny reports: finger went down here, moved to there, moved again, then lifted. Software watches that stream and decides what you meant — a tap, a long press, a swipe, a pinch — and figures out which button or list your finger was actually on.",
    "analogy": "Touch handling is like a relay of messages down a chain of people. Your finger press is a note dropped at the top of a tower (the screen). It is passed down to whoever is standing where you touched (hit-testing finds the right view). Each person along the way can read the note and either handle it or pass it on (propagation). Meanwhile a referee watches the sequence of notes — down, move, move, up — and blows the whistle for the gesture it recognizes: 'that was a swipe!' If two referees both want it (scroll vs drag), a rule decides who wins.",
    "explanation": "All touch input arrives as an event stream, not as high-level gestures. A single interaction produces a sequence: a DOWN when a finger contacts the screen, a series of MOVE events as it slides (each with new coordinates), and an UP when it lifts (or a CANCEL if the system takes the gesture away). Multiple fingers produce multiple simultaneous pointer streams. Everything higher-level — taps, swipes, pinches — is derived by watching this raw stream over time.\n\nWhen a DOWN arrives, the system must decide which UI element it belongs to. It does this by hit-testing: starting at the root of the view tree and walking down to find the deepest element whose bounds contain the touch point (respecting z-order and any transforms). Once a target is found, the event propagates through the tree. Typically there is a capture/dispatch phase going down toward the target and a bubbling phase coming back up, and any element along that path can choose to handle the event or let it continue. This is how a button inside a scrollable list can receive a tap while the list still gets a chance to interpret a drag.\n\nGesture recognition sits on top of the stream. A recognizer is a small state machine that watches events and fires when its pattern is met: a tap is a down-then-up with little movement inside a short time; a long-press is a down held past a time threshold without moving; a pan/drag is a down followed by movement beyond a small threshold; a pinch tracks two pointers and reports the changing distance; a swipe is a fast pan that ends with velocity. The small movement threshold before a drag begins is called touch slop — it exists because fingers are imprecise and a 'tap' almost always jitters a pixel or two; without slop, taps would be misread as tiny drags. When several gestures are possible on the same element (tap vs scroll vs drag), the system must disambiguate: it delays committing, watches whether the finger moves far enough or fast enough, and hands the stream to exactly one recognizer, canceling the others.\n\nA large, often-forgotten part of input is the soft keyboard (the IME, input method editor). When a text field gains focus the keyboard animates up and covers part of the screen; the app must react so the focused field is not hidden — scrolling or resizing content to keep it visible (scroll-to-avoid-keyboard). The field's input type (email, number, password) tells the keyboard which layout to show, and the app is responsible for dismissing the keyboard when the user taps away or submits.\n\nHow Android does it vs How iOS does it: Android delivers input as MotionEvent objects through onTouchEvent / dispatchTouchEvent, with onInterceptTouchEvent letting a parent (like a scroll container) steal the stream; ViewConfiguration.getScaledTouchSlop defines slop, GestureDetector/ScaleGestureDetector recognize gestures, and requestDisallowInterceptTouchEvent resolves conflicts. In Compose it is pointerInput + detectTapGestures/detectDragGestures. The soft keyboard is the IME, configured via inputType and windowSoftInputMode (adjustResize/adjustPan) and controlled with WindowInsets. iOS delivers UITouch objects in a UIEvent through touchesBegan/Moved/Ended, uses UIGestureRecognizer subclasses (tap, long-press, pan, pinch, swipe) with delegate methods and require(toFail:) to disambiguate, and handles the keyboard via UIResponder becomeFirstResponder, keyboard notifications, and keyboardLayoutGuide; SwiftUI uses gesture modifiers and .focused. Same pipeline: raw touches, hit-test, propagate, recognize, plus IME handling.",
    "technicalDeep": "The input pipeline runs on the main/UI thread because it can change the view tree, so touch dispatch competes with layout and draw for the frame budget — a janky main thread makes touch feel laggy. Each frame, queued input events are delivered before animations and layout. Hit-testing walks the tree depth-first honoring z-order, clipping, and transforms; a point outside a parent's bounds normally cannot reach its children (which is why elements drawn outside their parent are untouchable). After the target is found, dispatch has two logical directions: a downward pass where ancestors may intercept (a scroll view watching for enough vertical movement to claim the gesture) and an upward bubble where unhandled events climb back up. An element that begins handling a stream generally receives the rest of that stream (down through up) unless the system cancels it — a CANCEL event is sent when a recognizer or parent steals the gesture, and code must treat CANCEL as 'this interaction is over, undo any in-progress visual state'.\n\nGesture recognizers are concurrent state machines with states like possible, began, changed, ended, failed, canceled. Disambiguation is the hard part: to tell a tap from the start of a scroll, the system cannot decide on DOWN — it waits. If the finger lifts quickly with little movement, the tap wins; if it moves past touch slop, the pan/scroll wins and the tap recognizer fails. Recognizers can be ordered by dependency (this one only fires if that one fails), which is how single-tap vs double-tap or tap vs drag coexist. Velocity, tracked from recent move deltas and timestamps, distinguishes a swipe (fast, ends moving) from a slow drag that stops (which may become a pan or nothing). Multi-touch adds pointer ids so each finger's stream is tracked independently for pinch/rotate.\n\nSoft-keyboard handling is a layout problem driven by insets. When the IME appears it publishes its height as an inset into the window; the app either resizes its content area to the reduced space (so scrollable content can bring the focused field into view) or pans the whole window up. Getting this right means listening to keyboard/inset changes, animating content in sync with the keyboard, computing whether the focused field is now occluded, and scrolling it into view. Input type drives which keyboard variant and return-key action appears, and autofill/IME actions (next/done/search) are part of the contract. Dismissal (tap outside, swipe down, or submit) must release focus and let the inset collapse.\n\nCallout — How Android does it vs How iOS does it: Android resolves parent/child conflicts via onInterceptTouchEvent (parent claims the stream) and requestDisallowInterceptTouchEvent (child forbids it), slop comes from ViewConfiguration, and IME insets are handled with windowSoftInputMode plus the modern WindowInsetsAnimation API to move content in lockstep with the keyboard. iOS resolves conflicts with gesture recognizer relationships — require(toFail:), canBePrevented/shouldRecognizeSimultaneously delegates — and handles the keyboard via keyboard-will-show/hide notifications or the keyboardLayoutGuide to constrain content above the keyboard. Both expose the same primitives underneath: a raw touch stream, hit-testing, a propagation/interception model, recognizer state machines with disambiguation, and keyboard insets you must respect.",
    "whatBreaks": "Treating every DOWN as a tap (acting on touch-down instead of a completed tap-up) fires actions when the user actually meant to scroll or drag. Ignoring touch slop makes buttons feel unclickable because a tiny finger jitter is misread as a drag. Nested scrollable/draggable areas without conflict resolution fight over the gesture, so scrolling gets stuck or a drag never starts. Not handling CANCEL leaves a pressed/highlighted state stuck when the system steals the gesture. Placing tappable content outside its parent's bounds makes it visually present but untouchable because hit-testing stops at the parent. On the keyboard side: not reacting to the IME leaves the focused text field hidden behind the keyboard; using the wrong input type shows the wrong keyboard (letters for a phone number); and failing to dismiss the keyboard traps the user with content covered. Doing heavy work in a touch handler blocks the main thread and makes all input feel laggy.",
    "efficientWay": {
      "title": "Handling Input Correctly and Responsively",
      "approaches": [
        {
          "name": "Use the platform gesture recognizers with proper disambiguation (fail relationships / interception), respect touch slop and CANCEL, and drive keyboard insets to keep the focused field visible",
          "verdict": "best",
          "reason": "Recognizers encode the tap/scroll/drag state machines and slop correctly, conflict rules give the gesture to exactly one owner, and inset-driven keyboard handling keeps text fields visible on every device size."
        },
        {
          "name": "Use recognizers but hand-tune thresholds and handle simple keyboard cases with a fixed offset",
          "verdict": "ok",
          "reason": "Works for straightforward screens, but hard-coded thresholds and fixed keyboard offsets break across densities, keyboard heights, and nested scroll areas."
        },
        {
          "name": "Parse the raw down/move/up stream by hand and act on touch-down, ignoring slop and IME insets",
          "verdict": "weak",
          "reason": "Reinvents fragile state machines, misreads taps as drags, fights nested scrolling, leaves stuck highlight state on CANCEL, and hides fields behind the keyboard — a catalog of input bugs."
        }
      ],
      "recommendation": "Reach for the platform's gesture recognizers rather than parsing raw touches, act on completed gestures (tap-up) not touch-down, respect touch slop, always handle CANCEL by resetting in-progress visual state, resolve nested-scroll conflicts with the platform's interception/fail mechanism, and treat the soft keyboard as an inset: set the right input type, keep the focused field visible, and provide a clear way to dismiss."
    },
    "commonMistakes": [
      "Acting on touch-down instead of a completed tap, so actions fire when the user meant to scroll or drag",
      "Ignoring touch slop, making taps register as tiny drags and buttons feel unresponsive",
      "Not handling CANCEL, leaving pressed/highlighted state stuck when the system steals the gesture",
      "Forgetting the soft keyboard: wrong input type, focused field hidden behind the IME, or no way to dismiss it"
    ],
    "seniorNotes": "Most 'unresponsive UI' bugs are really input bugs: a busy main thread delays touch dispatch, or a parent/child gesture conflict swallows the stream. Learn your platform's interception model cold — it is where nested scrolling and drag-inside-scroll are won or lost. Treat CANCEL as a first-class event and always reset transient state on it. For the keyboard, drive content off insets (and animate in lockstep) rather than nudging by a hard-coded height, because keyboard height varies by device, language, and autofill bars. The whole model is cross-framework: Flutter's GestureDetector/Listener with the gesture arena for disambiguation, React Native's responder system and Gesture Handler, Compose pointerInput, and UIGestureRecognizer all implement the same raw-stream, hit-test, recognize, disambiguate pipeline plus keyboard-inset handling.",
    "interviewQuestions": [
      "Walk me through what happens from the moment a finger touches the screen to a gesture being recognized.",
      "How does the system decide between a tap, a scroll, and a drag on the same element, and what is touch slop?",
      "What do you have to handle for the soft keyboard, and why is a fixed pixel offset a bad way to do it?"
    ],
    "interviewAnswers": [
      "A touch arrives as a raw event stream: a DOWN, a series of MOVE events, then an UP or CANCEL, with one stream per finger. On DOWN the system hit-tests, walking the view tree from the root to the deepest element whose bounds contain the point, respecting z-order and transforms. The event then propagates: a downward pass where ancestors like a scroll view may intercept, and an upward bubble for anything unhandled. On top of the stream, gesture recognizers run as state machines that watch the sequence over time and fire when their pattern matches — a down-up with little movement is a tap, a held down is a long-press, movement past a threshold is a pan. All of this runs on the main thread, so it shares the frame budget with layout and draw.",
      "The system cannot decide on DOWN, so it waits and watches. If the finger lifts quickly with almost no movement, it is a tap. If it moves past a small distance threshold, that is the start of a scroll or drag and the tap recognizer fails. That threshold is touch slop: the few pixels of movement allowed before motion counts as a drag rather than a tap. It exists because fingers are imprecise and a real tap always jitters slightly; without slop, taps would be misread as tiny drags. When a parent scroll view and a child both want the gesture, the platform's interception/fail mechanism hands the stream to exactly one owner and sends CANCEL to the loser.",
      "When a text field gains focus the keyboard animates up and covers part of the screen, so I have to keep the focused field visible, usually by resizing or scrolling the content using the keyboard's inset (its published height), and animate that in sync with the keyboard. I also set the right input type so the correct keyboard and return action appear (email, number, password), and provide a way to dismiss it — tap outside or a submit/done action. A fixed pixel offset is bad because keyboard height varies by device, orientation, language, and by autofill/suggestion bars; hard-coding it either leaves the field covered or over-scrolls. Driving off the actual inset adapts to all of those automatically."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "From raw touch stream to recognized gesture (pseudocode)",
        "code": "// 1) Raw events arrive on the main thread, one stream per pointer.\non TOUCH(event):\n    switch event.type:\n        case DOWN:\n            target = hitTest(rootView, event.x, event.y)  // deepest view under point\n            startTracking(event.pointerId, event.x, event.y, now())\n        case MOVE:\n            dx = event.x - start.x; dy = event.y - start.y\n            if not draggingYet and hypot(dx, dy) > TOUCH_SLOP:\n                draggingYet = true          // crossed slop -> it's a drag/scroll\n                claimGesture(scrollOrDrag)  // tap recognizer now FAILS\n            if draggingYet: pan(dx, dy)\n        case UP:\n            if not draggingYet and (now() - start.time) < TAP_TIMEOUT:\n                fireTap(target)             // down + up, little movement = TAP\n            endTracking(event.pointerId)\n        case CANCEL:\n            resetPressedState(target)       // system stole the gesture: undo visuals\n\n// 2) Disambiguation between parent scroll and child button:\n//    parent.onInterceptTouchEvent watches for vertical movement > slop;\n//    if it intercepts, child receives CANCEL and parent starts scrolling."
      },
      {
        "lang": "swift",
        "label": "iOS: gesture recognizers + keyboard inset handling",
        "code": "// Recognizers encode the state machines; require(toFail:) disambiguates.\nlet tap = UITapGestureRecognizer(target: self, action: #selector(onTap))\nlet pan = UIPanGestureRecognizer(target: self, action: #selector(onPan))\ntap.require(toFail: pan)   // tap only fires if pan does NOT start\nview.addGestureRecognizer(tap)\nview.addGestureRecognizer(pan)\n\n// Keep the focused text field visible by reacting to the keyboard inset.\nNotificationCenter.default.addObserver(\n    forName: UIResponder.keyboardWillShowNotification, object: nil, queue: .main\n) { note in\n    guard let frame = note.userInfo?[UIResponder.keyboardFrameEndUserInfoKey]\n        as? NSValue else { return }\n    let keyboardHeight = frame.cgRectValue.height   // actual inset, not hard-coded\n    scrollView.contentInset.bottom = keyboardHeight // scroll-to-avoid-keyboard\n    scrollView.scrollRectToVisible(activeField.frame, animated: true)\n}"
      }
    ],
    "resources": [
      {
        "label": "Android: Gestures and touch input",
        "url": "https://developer.android.com/develop/ui/views/touch-and-input/gestures",
        "kind": "docs"
      },
      {
        "label": "iOS: UIGestureRecognizer",
        "url": "https://developer.apple.com/documentation/uikit/uigesturerecognizer",
        "kind": "docs"
      },
      {
        "label": "Android: Keyboard (IME) input",
        "url": "https://developer.android.com/develop/ui/views/touch-and-input/keyboard-input",
        "kind": "docs"
      }
    ]
  }
]

/** Phase 4 add-on: Reactive Programming & Data Streams (State, Data & Local Storage). */
export const MOBILE_REACTIVE: CurriculumTopic[] = [
  {
    "id": "reactive-data-flow",
    "phase": 4,
    "phaseName": "State, Data & Local Storage",
    "orderIndex": 8,
    "estimatedMins": 32,
    "prerequisites": [
      "state-management-concepts",
      "async-concurrency"
    ],
    "title": "Reactive Programming & Data Streams",
    "eli5": "Normally you ask for data once: 'what is the temperature?' and you get one answer. Reactive programming flips it: you subscribe to a stream — 'tell me the temperature every time it changes' — and values keep arriving over time. Your screen listens to the stream and redraws itself whenever a new value shows up, so it is always in sync without you asking again.",
    "analogy": "A normal function call is ordering a single coffee: you ask, you get one cup, done. A stream is a magazine subscription: you sign up once and new issues keep arriving at your door over time until you cancel. Operators are like instructions to the mailroom — 'only forward the issues about sports' (filter), 'translate each one to French before delivering' (map), 'combine this magazine with my newspaper into one daily digest' (combine). Your mailbox (the UI) just reacts to whatever gets delivered.",
    "explanation": "Reactive programming models data as streams of values that arrive over time, rather than single values you fetch once. A stream (also called an observable, publisher, or flow) is a source you can subscribe to; once subscribed, you receive a sequence of emitted values, and usually a terminal signal when the stream completes or errors. This is the shared idea behind Kotlin Flow, Swift Combine, Dart Streams, and RxJS — different libraries, one mental model: produce values over time, observe them, react.\n\nThe power comes from operators: small, composable transformations you chain onto a stream to build a pipeline. map transforms each value; filter drops values that do not match; combine/merge join multiple streams; debounce/throttle control timing; scan accumulates state. Because operators return new streams, you declaratively describe how raw inputs become the data your UI needs — for example, a stream of search-box keystrokes, debounced, mapped to network requests, whose results feed the list. Nothing runs until someone subscribes; subscribing wires the pipeline and starts the flow, and unsubscribing (canceling) tears it down and releases resources.\n\nTwo distinctions matter constantly. Hot vs cold: a cold stream starts producing only when subscribed and runs a fresh, independent sequence for each subscriber (like a function that re-runs) — a network request stream is typically cold. A hot stream emits regardless of subscribers and all subscribers share the same live sequence (like a live broadcast) — UI events, location updates, or a shared state holder are hot; late subscribers miss earlier values unless the stream replays them. Backpressure: when a producer emits faster than a consumer can handle (sensor firing hundreds of times a second into a slow UI), the system needs a strategy — buffer, drop, or slow the producer — or memory and latency blow up.\n\nFor UI, the payoff is reactive rendering: you expose application state as a stream, the UI subscribes, and every time the state stream emits a new value the UI re-renders from it. This is unidirectional and eliminates the classic bug of forgetting to refresh a view — the view is a function of the latest emitted state, always.\n\nHow Android does it vs How iOS does it: Android/Kotlin uses coroutines + Flow (cold) and StateFlow/SharedFlow (hot, state-holding) with operators like map/filter/combine/debounce, collected in the UI which recomposes on each emission; LiveData is an older lifecycle-aware hot stream. iOS uses Combine, where a Publisher emits to Subscribers through operators (map/filter/combineLatest/debounce), with @Published and CurrentValueSubject/PassthroughSubject as hot sources, and SwiftUI re-renders when an observed publisher emits; async sequences are the newer language-level equivalent. Same concepts — cold vs hot, operators, subscribe, backpressure — under different names.",
    "technicalDeep": "A stream is defined by a small contract: a producer emits zero or more values, then optionally a completion or error terminal event, and a subscriber provides callbacks for value, error, and completion plus a way to cancel. Subscription returns a handle (a cancellable/disposable/Job) whose lifetime you must manage — dropping it without canceling leaks the pipeline and any upstream work (timers, sockets, sensors). Operators are lazy: they build a description of the pipeline and only execute when a terminal subscriber pulls/receives, which is why cold streams re-run per subscriber. Because operators compose, complex asynchronous coordination (combine latest values of A and B, debounce, switch to the newest request and cancel the previous) becomes a declarative chain instead of tangled callbacks and manual state flags.\n\nHot vs cold is really about where the producer lives relative to subscription. Cold: the producer is created inside subscribe, so each subscriber gets its own execution and receives every value from the start — ideal for one-shot work like a request. Hot: the producer exists independently and multicasts to current subscribers, so subscribers share one sequence and late ones miss past emissions unless the stream is designed to replay or hold state (a state stream holds the current value and replays it to new subscribers — this is the reactive state-holder pattern that drives UI). Converting cold to hot (sharing/replaying) avoids re-running expensive work for multiple observers. Backpressure strategies formalize producer/consumer speed mismatch: buffer (queue, risking memory growth), drop oldest/newest (lose data, bound memory), conflate/keep-latest (UI usually wants only the freshest value), or suspend the producer until the consumer is ready (true backpressure, as with suspending Flow collectors). Threading is orthogonal and explicit: operators run where you schedule them (a background dispatcher for I/O, the main thread for UI), and a correct pipeline does heavy work upstream off the main thread and only delivers final values to the UI thread.\n\nCallout — How Android does it vs How iOS does it: Kotlin Flow is cold and integrates with structured concurrency — collection is a suspending function tied to a CoroutineScope, so canceling the scope cancels the flow (lifecycle-safe by construction), and StateFlow is a hot, conflated state-holder that always replays its latest value; backpressure is handled by suspension plus buffer/conflate operators. Combine publishers are driven by demand (subscribers request N values, giving built-in backpressure), use AnyCancellable whose deallocation cancels the subscription, and @Published/CurrentValueSubject provide hot state that SwiftUI observes. Both make the same guarantees: a managed subscription lifetime, operator pipelines, hot state-holders for UI, and an explicit answer to producer/consumer speed mismatch.",
    "whatBreaks": "Subscribing without ever canceling leaks the subscription and its upstream work (sockets, timers, sensors keep running), and can crash by delivering to a destroyed screen — the classic lifecycle leak. Assuming a cold stream is shared causes duplicate work: two subscribers to a cold network stream fire two requests. Assuming a hot stream replays makes late subscribers silently miss values they expected. Ignoring backpressure lets a fast producer (scroll, sensor, websocket) overwhelm a slow consumer, growing buffers until memory or latency explodes. Running the whole pipeline on the main thread janks the UI; running UI updates off the main thread crashes or corrupts rendering. Overusing operators or building deep chains for trivial cases makes flow hard to debug — you cannot see intermediate values without adding taps/logging.",
    "efficientWay": {
      "title": "Modeling Data Flow Reactively",
      "approaches": [
        {
          "name": "Expose UI state as a hot, latest-value state stream; build pipelines with operators off the main thread; tie subscription lifetime to the screen and pick an explicit backpressure strategy",
          "verdict": "best",
          "reason": "The UI always renders the freshest state with no manual refresh, heavy work stays off the main thread, subscriptions are canceled with the screen so nothing leaks, and fast producers cannot overwhelm the consumer."
        },
        {
          "name": "Use streams and operators but manage subscriptions manually and leave threading/backpressure implicit",
          "verdict": "ok",
          "reason": "Works and is composable, but manual cancellation is leak-prone and implicit threading/backpressure causes subtle jank or memory growth under load."
        },
        {
          "name": "Skip streams: fetch once and imperatively poke the UI, or add ad-hoc callbacks and manual refresh flags",
          "verdict": "weak",
          "reason": "Reintroduces the state-out-of-sync bug, tangles asynchronous coordination into nested callbacks, and has no principled answer to timing, combination, or producer/consumer speed."
        }
      ],
      "recommendation": "Model changing data as streams and derive UI data with operators (map/filter/combine/debounce) rather than manual callbacks and refresh flags. Expose UI state as a hot state-holder that replays its latest value, run the pipeline off the main thread and deliver only final values to the UI, always bind the subscription's lifetime to the screen so it is canceled automatically, and choose an explicit backpressure strategy (usually keep-latest for UI)."
    },
    "commonMistakes": [
      "Never canceling subscriptions, leaking upstream work and delivering to a destroyed screen (lifecycle leak)",
      "Confusing hot and cold: expecting a cold stream to be shared (duplicate requests) or a hot one to replay (missed values)",
      "Ignoring backpressure so a fast producer overwhelms a slow consumer and buffers grow unbounded",
      "Running the whole pipeline on the main thread (jank) or updating the UI off the main thread (crash)"
    ],
    "seniorNotes": "The unifying insight is that Flow, Combine, Dart Streams, and RxJS are the same idea — values over time, transformed by operators, observed by subscribers — so learning one transfers directly to the others. The two questions that separate correct from buggy reactive code are always: (1) is this stream hot or cold, and does its replay/sharing behavior match what subscribers expect; and (2) what is the producer/consumer speed mismatch strategy. Prefer structured lifetimes (structured concurrency in Kotlin, cancellable lifetime in Combine) so subscriptions cannot outlive their screen. For UI specifically, a conflated hot state-holder (StateFlow, @Published/CurrentValueSubject) is the canonical shape: it always has a current value, replays it to new subscribers, and keeps only the latest — exactly what a declarative UI needs to render as a function of state.",
    "interviewQuestions": [
      "What does it mean to model data as a stream, and how is subscribing to an observable different from calling a function that returns a value?",
      "Explain hot vs cold streams and why the distinction matters in practice.",
      "What is backpressure, and how would you handle a producer that emits faster than the UI can consume?"
    ],
    "interviewAnswers": [
      "A stream models data as a sequence of values that arrive over time, plus a terminal completion or error, rather than a single value returned once. Calling a normal function gives you one result and returns; subscribing to an observable registers callbacks and then receives many values over time as the source emits, until you cancel. You compose operators like map, filter, and combine onto the stream to declaratively transform raw inputs into the data you need, and for UI you subscribe so the view re-renders every time a new value is emitted, keeping it in sync automatically. It is the shared model behind Kotlin Flow, Combine, Dart Streams, and RxJS.",
      "A cold stream starts producing only when you subscribe and runs a fresh, independent sequence for each subscriber — like a function that re-executes — so two subscribers to a cold network stream trigger two requests, and each receives all values from the start. A hot stream produces independently of subscribers and multicasts one shared sequence to whoever is currently listening, so late subscribers miss earlier values unless the stream replays or holds state. It matters because getting it wrong causes real bugs: assuming cold is shared duplicates expensive work, and assuming hot replays makes late subscribers silently miss data. For UI state you want a hot, latest-value holder that replays its current value to new subscribers.",
      "Backpressure is what happens when a producer emits faster than the consumer can process — a sensor, websocket, or scroll firing far quicker than the UI can render. Without a strategy, buffers grow until memory and latency blow up. The strategies are: buffer (queue, bounded or you risk memory growth), drop oldest or newest, conflate/keep-latest (deliver only the freshest value), or suspend the producer until the consumer is ready (true backpressure). For a UI I almost always keep-latest/conflate, because the screen only needs the newest value, not every intermediate one; I also run the transforming pipeline off the main thread and deliver just the final value to the UI thread."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "A reactive pipeline: search box to results (pseudocode)",
        "code": "// A stream emits values over time; operators build a pipeline;\n// the UI subscribes and re-renders on each emission.\n\nkeystrokes = stream()          // HOT: user types over time -> emits query text\n\nresults = keystrokes\n    .debounce(300ms)           // wait for typing to pause\n    .filter(q => q.length >= 2)// ignore too-short queries\n    .map(q => searchRequest(q))// COLD per value: build a request stream\n    .switchLatest()            // cancel previous request, keep newest\n    .map(response => response.items)\n\n// Nothing runs until we subscribe:\nsubscription = results.subscribe(\n    onNext:  items => ui.render(items),   // reactive re-render\n    onError: e     => ui.showError(e),\n    onDone:  ()    => {}\n)\n\n// Lifetime is managed: cancel when the screen is destroyed,\n// which tears down the whole pipeline and stops upstream work.\nonScreenDestroyed:\n    subscription.cancel()\n\n// Backpressure note: keystrokes can outpace the network; switchLatest\n// keeps only the newest request (keep-latest), so slow responses\n// for stale queries are dropped instead of piling up."
      },
      {
        "lang": "kotlin",
        "label": "Kotlin Flow: hot state-holder driving the UI",
        "code": "class SearchViewModel : ViewModel() {\n    private val query = MutableStateFlow(\"\")            // HOT, holds latest value\n\n    // Derive UI state reactively; runs off the main thread.\n    val results: StateFlow<List<Item>> = query\n        .debounce(300)\n        .filter { it.length >= 2 }\n        .mapLatest { q -> repository.search(q) }        // cancels stale request\n        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(), emptyList())\n\n    fun onQueryChanged(text: String) { query.value = text }\n    // Collection in the UI is tied to the lifecycle scope, so the\n    // subscription is cancelled automatically -> no leak.\n}"
      }
    ],
    "resources": [
      {
        "label": "Kotlin: Asynchronous Flow",
        "url": "https://kotlinlang.org/docs/flow.html",
        "kind": "docs"
      },
      {
        "label": "Apple: Combine",
        "url": "https://developer.apple.com/documentation/combine",
        "kind": "docs"
      },
      {
        "label": "ReactiveX: Intro",
        "url": "https://reactivex.io/intro.html",
        "kind": "article"
      }
    ]
  }
]

/** Flashcard decks for the three extra topics, keyed by topic id. */
export const MOBILE_EXTRA_FLASHCARDS: FlashcardData = {
  "frame-animation-motion": [
    {
      "id": "mbfc_anim_1",
      "q": "What is an animation, at the frame level?",
      "a": "A value that changes over time and is resampled once per frame off VSync. Each frame the system computes progress t = elapsed/duration, passes it through an easing curve, and interpolates the property with lerp(from, to, eased(t)), then redraws. Smooth motion is really dozens of tiny redraws per second.",
      "hint": "Flip-book: draw the in-between pages"
    },
    {
      "id": "mbfc_anim_2",
      "q": "Why is animating transform/opacity smoother than animating width/height?",
      "a": "Transform and opacity apply to an already-rasterized layer, so the compositor can advance the animation off the main thread each frame with just a cheap GPU blend — no measure/layout/draw. Width/height change geometry, forcing a full measure/layout/draw pass on the subtree every frame, which drops frames under load.",
      "hint": "Compositor property vs layout property"
    },
    {
      "id": "mbfc_anim_3",
      "q": "What is an easing curve (interpolator) and why not just use linear?",
      "a": "It maps a 0..1 progress to a 0..1 eased fraction, controlling how the value accelerates and decelerates. Real objects have inertia, so ease-in-out (slow, fast, settle) looks natural while linear (constant speed) feels mechanical.",
      "hint": "Maps time-progress to value-progress"
    },
    {
      "id": "mbfc_anim_4",
      "q": "Fixed-duration tween vs spring animation — key difference?",
      "a": "A tween interpolates A to B over a duration you set with an easing curve; deterministic but jumps/restarts if retargeted mid-flight. A spring integrates physics (stiffness, damping) toward a target, settling in a duration the physics decides and carrying position and velocity across interruptions — so it is naturally interruptible/grabbable.",
      "hint": "Mass on a spring carries velocity"
    },
    {
      "id": "mbfc_anim_5",
      "q": "What is a shared-element transition?",
      "a": "The same logical element on two screens is animated (position, size, corner radius) from its source frame to its destination frame, so it appears to fly between screens instead of one screen cutting to the next. Android: MotionLayout/Transitions; iOS: matchedGeometryEffect / navigation transitions.",
      "hint": "One element flies from screen A to screen B"
    }
  ],
  "touch-gestures-input": [
    {
      "id": "mbfc_gesture_1",
      "q": "In what form does touch input actually arrive?",
      "a": "As a raw event stream, not a high-level gesture: a DOWN when the finger contacts, a series of MOVE events as it slides, then an UP (or CANCEL). Each finger is its own pointer stream. Taps, swipes, and pinches are all derived by watching this stream over time.",
      "hint": "down / move / move / up"
    },
    {
      "id": "mbfc_gesture_2",
      "q": "What is hit-testing?",
      "a": "On DOWN, the system walks the view tree from the root to the deepest element whose bounds contain the touch point (respecting z-order and transforms) to find the target. This is why an element drawn outside its parent's bounds is visible but untappable.",
      "hint": "Find the deepest view under the point"
    },
    {
      "id": "mbfc_gesture_3",
      "q": "What is touch slop and why does it exist?",
      "a": "A small movement threshold the finger must cross before motion counts as a drag/scroll instead of a tap. It exists because fingers are imprecise and a real tap always jitters a pixel or two; without slop, taps would be misread as tiny drags.",
      "hint": "Jitter allowance before it's a drag"
    },
    {
      "id": "mbfc_gesture_4",
      "q": "How does the system disambiguate a tap from a scroll on the same element?",
      "a": "It does not decide on DOWN — it waits. If the finger lifts quickly with little movement, the tap wins; if it moves past touch slop, the pan/scroll wins and the tap recognizer fails. A parent (scroll view) can intercept the stream, sending CANCEL to the child.",
      "hint": "Wait and watch; slop decides"
    },
    {
      "id": "mbfc_gesture_5",
      "q": "What must you handle for the soft keyboard (IME)?",
      "a": "Keep the focused field visible by reacting to the keyboard's inset (scroll/resize content, animated in sync), set the right input type so the correct keyboard/return action shows (email, number, password), and provide a way to dismiss it. Use the actual inset, not a hard-coded height, since keyboard height varies by device/language.",
      "hint": "Inset-driven scroll-to-avoid + input type + dismiss"
    }
  ],
  "reactive-data-flow": [
    {
      "id": "mbfc_reactive_1",
      "q": "What does it mean to model data as a stream?",
      "a": "Data becomes a sequence of values that arrive over time (an observable/publisher/flow) plus a terminal complete/error, instead of one value fetched once. You subscribe to receive values, transform them with operators, and the UI re-renders on each emission. It is the shared idea behind Kotlin Flow, Combine, Dart Streams, and RxJS.",
      "hint": "Magazine subscription, not a single coffee"
    },
    {
      "id": "mbfc_reactive_2",
      "q": "What are operators in a reactive pipeline?",
      "a": "Composable transformations chained onto a stream that each return a new stream: map (transform each value), filter (drop non-matching), combine/merge (join streams), debounce/throttle (control timing), scan (accumulate). They let you declaratively describe how raw inputs become the data the UI needs.",
      "hint": "map / filter / combine / debounce"
    },
    {
      "id": "mbfc_reactive_3",
      "q": "Hot vs cold streams?",
      "a": "Cold: produces only when subscribed and runs a fresh independent sequence per subscriber (like a re-running function) — a network request stream. Hot: produces regardless of subscribers and multicasts one shared sequence; late subscribers miss earlier values unless it replays/holds state — UI events, a StateFlow/@Published state-holder.",
      "hint": "Function re-run vs live broadcast"
    },
    {
      "id": "mbfc_reactive_4",
      "q": "What is backpressure and how do you handle it for UI?",
      "a": "When a producer emits faster than the consumer can process (sensor/websocket/scroll). Strategies: buffer, drop oldest/newest, conflate/keep-latest, or suspend the producer. For UI you usually keep-latest, since the screen only needs the freshest value, not every intermediate one.",
      "hint": "Fast producer, slow consumer -> keep-latest"
    },
    {
      "id": "mbfc_reactive_5",
      "q": "Why must you manage a subscription's lifetime?",
      "a": "Subscribing returns a handle (cancellable/disposable/Job). If you never cancel it, you leak the pipeline and its upstream work (sockets, timers, sensors keep running) and may deliver to a destroyed screen and crash. Bind the subscription to the screen lifecycle (structured concurrency / cancellable lifetime) so it is torn down automatically.",
      "hint": "Cancel on screen destroy or leak/crash"
    }
  ]
}
