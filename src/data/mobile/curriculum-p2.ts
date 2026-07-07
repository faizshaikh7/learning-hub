import type { CurriculumTopic } from '@/types'

/** Phase 2 of the Mobile Development course: UI Rendering & the Frame Pipeline. */
export const MOBILE_P2: CurriculumTopic[] = [
  {
    "id": "frame-rendering-pipeline",
    "phase": 2,
    "phaseName": "UI Rendering & the Frame Pipeline",
    "orderIndex": 1,
    "estimatedMins": 35,
    "prerequisites": [
      "screen-lifecycle"
    ],
    "title": "How a Frame Is Drawn",
    "eli5": "A phone screen is like a flip-book. To make things move smoothly, the phone has to draw a brand-new picture 60 times every second. Each picture is called a frame, and there is an assembly line that builds it: figure out how big things are, where they go, paint them, then hand the painting to the screen chip.",
    "analogy": "Think of a theatre production for every single frame. The stage manager first measures each actor and prop (measure), decides where everyone stands (layout), the painters paint the backdrops and costumes (draw), the photographer turns it into a flat photo (rasterize), the editor stacks the photos into one image (composite), and finally the projector (GPU) throws it on the wall. All of this happens in under 17 milliseconds, then the whole crew does it again.",
    "explanation": "Every visible UI on a phone is produced by a repeating render loop that runs once per display refresh. The loop turns your description of the UI (a tree of elements) into colored pixels. The classic stages are: MEASURE (ask each node how big it wants to be), LAYOUT (assign each node a final position and size within its parent), DRAW / RECORD (record the paint commands: rectangles, text, images, gradients), RASTERIZE (convert those vector commands into a grid of pixels, usually on the GPU), COMPOSITE (stack all the separate layers into one final image, applying opacity and transforms), and PRESENT (hand the finished buffer to the display hardware to be scanned out). A signal called VSync fires at the start of each refresh interval and kicks off the loop; the platform tries to have the next frame ready before the following VSync.\n\nThe key mental model: the UI is not painted once and left alone. Anything that animates, scrolls, or reacts to a state change triggers a new pass through some or all of these stages. A well-behaved app does the minimum work per frame so the whole pipeline finishes inside the frame budget.\n\nHow Android does it vs How iOS does it: On Android the platform issues a VSync via the Choreographer, then runs measure/layout/draw on the main thread to record a display list, which is handed to a dedicated RenderThread that rasterizes via Skia on the GPU and composites through SurfaceFlinger. On iOS, UIKit/Core Animation run the layout and drawing, produce a tree of CALayers, and hand them to the render server (backboardd/Core Animation render server) which composites on the GPU; Core Animation can animate many layer properties without waking your app code each frame.",
    "technicalDeep": "The render loop is driven by VSync, a hardware timing pulse from the display. Modern pipelines are pipelined: while the GPU rasterizes frame N, the CPU is already building frame N+1. Double or triple buffering provides the swap chain so the display always has a completed buffer to scan out while the next one is being drawn. Measure and layout together form a two-pass constraint resolution: parents pass down constraints, children report desired sizes, parents place children. Draw does not usually touch pixels directly; it RECORDS a list of drawing operations (a display list / command buffer). Rasterization executes that list on the GPU, turning triangles, glyphs, and paths into a pixel grid, often tiled. Compositing then blends cached layer textures using transforms, clips, and alpha. The final buffer is presented and scanned out row by row. If your app-side work (measure+layout+draw recording) plus the GPU work does not complete before the next VSync, the display re-shows the previous buffer and you have dropped a frame.\n\nSeparating what runs where matters: layout and your business logic run on the UI/main thread, while rasterization and compositing are offloaded to the GPU and (on Android) a separate render thread. Property-only changes (moving, fading, scaling an existing layer) can often be handled by the compositor alone, skipping measure/layout/draw entirely, which is why transform/opacity animations are cheap.\n\nCallout — How Android does it vs How iOS does it: Android exposes the pipeline through Choreographer.postFrameCallback and the RenderThread; Skia is the rasterizer and SurfaceFlinger is the system compositor. iOS uses Core Animation as both the layer model and the animation engine; CATransaction batches changes, and the separate render server composites. In both, the golden rule is identical: keep per-frame main-thread work tiny and let the GPU/compositor do the heavy lifting.",
    "whatBreaks": "Doing heavy work inside the per-frame path breaks smoothness: decoding a large image, parsing JSON, or running a synchronous database query on the UI thread stalls measure/layout and the frame is missed. Deeply nested layouts cause multiple measure passes (measure explosion), blowing the budget. Forcing a synchronous layout in the middle of a frame (layout thrash) recomputes everything repeatedly. Allocating memory every frame triggers garbage collection pauses that show up as periodic stutters. Overriding draw to do expensive path or blur work rasterizes slowly on the GPU and drops frames during scroll.",
    "efficientWay": {
      "title": "Keeping the Pipeline Fast",
      "approaches": [
        {
          "name": "Do minimal work per frame; move heavy work off the UI thread and animate compositor-friendly properties",
          "verdict": "best",
          "reason": "Only transform/opacity change per frame, so the compositor handles animation without re-running measure/layout/draw. Everything expensive happens ahead of time or on a background thread."
        },
        {
          "name": "Rebuild and re-measure the whole screen on every state change",
          "verdict": "ok",
          "reason": "Fine for static or rarely-updated screens, but during scroll or animation it re-runs the full pipeline and risks jank on mid-range devices."
        },
        {
          "name": "Animate layout properties (width, height, top/left) directly each frame",
          "verdict": "weak",
          "reason": "Every frame triggers a fresh measure/layout/draw pass across the subtree, which is the most expensive path and the classic cause of dropped frames."
        }
      ],
      "recommendation": "Understand which stage each change touches. If you are only moving or fading something, keep it to transform/opacity so the compositor can do it alone. Push decoding, parsing, and I/O off the UI thread so measure/layout/draw stays trivially fast."
    },
    "commonMistakes": [
      "Believing the UI is drawn once — in reality the loop runs every refresh and any change re-enters the pipeline",
      "Running I/O, image decode, or JSON parsing on the UI thread and blaming the framework for jank",
      "Animating width/height/margins instead of transform/scale, forcing full layout each frame",
      "Assuming the GPU is the bottleneck when it is usually main-thread measure/layout or allocations"
    ],
    "seniorNotes": "Learn to read a frame timeline (Android GPU rendering profiler / Perfetto, iOS Instruments Core Animation & Time Profiler). Attribute each dropped frame to a stage: is it long main-thread work (layout/logic), long GPU time (overdraw/complex shaders), or a GC/allocation spike? The fix differs completely per stage. A framework like Flutter runs its own pipeline (build -> layout -> paint -> composite via Skia/Impeller) but the mental model is identical, which is why this concept transfers across every toolkit.",
    "interviewQuestions": [
      "Walk me through the stages a UI framework goes through to turn a widget tree into pixels on screen.",
      "What is VSync and how does it drive the render loop?",
      "Why is animating transform/opacity cheaper than animating width/height?"
    ],
    "interviewAnswers": [
      "The framework measures each node (how big it wants to be given parent constraints), lays it out (final size and position), records draw commands into a display list, rasterizes those commands into pixels on the GPU, composites the resulting layers into one buffer applying transforms and alpha, and presents that buffer to the display. It repeats this once per refresh, pipelined so the CPU builds the next frame while the GPU rasterizes the current one.",
      "VSync is a hardware timing pulse from the display marking the start of each refresh interval. The platform schedules the render loop off VSync so it starts building the next frame right after one is presented, aiming to have the buffer ready before the following VSync. Missing that deadline means the previous frame is re-shown and a frame is dropped.",
      "Transform and opacity are properties the compositor can apply to an already-rasterized layer texture, so no measure, layout, or repaint is needed — just a cheap GPU blend. Changing width or height alters the geometry, forcing a fresh measure/layout pass and re-recording draw commands for that subtree every frame, which is far more work."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "The per-frame render loop (pseudocode)",
        "code": "on VSYNC (fires once per refresh, e.g. every 16.6ms):\n    handleInput()            // touch, gestures\n    runAnimations(deltaTime) // advance animation values\n\n    dirtyNodes = collectChangedNodes()\n    for node in dirtyNodes:\n        node.measure(parentConstraints)   // how big?\n        node.layout(finalPosition)        // where?\n        node.recordDrawCommands()         // paint list (no pixels yet)\n\n    displayList = buildDisplayList(rootNode)\n\n    // handed to GPU / render thread:\n    layers = rasterize(displayList)        // commands -> pixels\n    frame  = composite(layers)             // stack + transform + alpha\n    present(frame)                         // scan out on next VSYNC\n\n// If the work above overruns the budget, the display\n// re-shows the previous frame => a dropped frame (jank)."
      }
    ],
    "resources": [
      {
        "label": "Android: Rendering & performance",
        "url": "https://developer.android.com/topic/performance/rendering",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh: Android developer roadmap",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      }
    ]
  },
  {
    "id": "frame-budget-jank",
    "phase": 2,
    "phaseName": "UI Rendering & the Frame Pipeline",
    "orderIndex": 2,
    "estimatedMins": 30,
    "prerequisites": [
      "frame-rendering-pipeline"
    ],
    "title": "The Frame Budget & Jank",
    "eli5": "The screen refreshes many times a second, and the phone has a tiny amount of time to finish drawing each new picture before the screen shows it. If it does not finish in time, you see a stutter — the same picture shows twice and the animation looks like it hiccuped. That hiccup is called jank.",
    "analogy": "Imagine you are drawing one frame of a cartoon and a metronome ticks every 16.6 milliseconds. You must have each drawing ready before the next tick. If a drawing takes too long, the metronome ticks with nothing new to show, so the last drawing stays up an extra beat. Do that a few times and the smooth motion turns into a jerky mess.",
    "explanation": "The frame budget is the fixed amount of time you have to produce one frame, set by the display's refresh rate. At 60Hz the display refreshes every 1000/60 = 16.6ms, so all of your app's per-frame work plus the GPU's work must finish within ~16.6ms. At 120Hz the budget shrinks to 1000/120 = 8.3ms. Whatever the rate, if the completed buffer is not ready by the next VSync, the display re-shows the previous frame; that missed frame is a dropped frame, and a run of them is perceived as jank or stutter.\n\nCrucially the budget is not just for your code. The system needs some of that window for compositing and presentation, so the practical time available to your UI thread is a bit less than the nominal figure. A single frame that takes 40ms during a smooth 60fps scroll is very visible: it drops two frames and the scroll visibly jumps.\n\nHow Android does it vs How iOS does it: Android reports jank via the frame stats and jankStats/FrameMetrics APIs, and modern devices support variable and high refresh rates (90/120Hz) where the budget changes dynamically. iOS uses ProMotion displays that scale from 10Hz up to 120Hz; Core Animation and CADisplayLink expose the target timestamp so you can pace work to the current refresh rate rather than assuming 60fps.",
    "technicalDeep": "Refresh rate defines the cadence; the budget is 1000/refreshRate milliseconds. Two independent deadlines exist: the CPU/main-thread deadline (input handling, animation ticks, measure/layout/draw recording) and the GPU deadline (rasterize + composite). Missing either drops the frame. With double/triple buffering the presentation is decoupled, but a buffer must still be finished before VSync or the swap does not happen.\n\nJank has characteristic signatures. A steady stream of dropped frames during scroll points to per-frame work that is simply too heavy (complex layouts, overdraw). Periodic single hitches every second or two often indicate garbage-collection pauses from per-frame allocations. A one-time long freeze at the start of an animation usually means synchronous work (image decode, layout inflation, disk read) on the UI thread. High refresh rate makes all of this stricter: at 120Hz you have half the time, so work that was fine at 60fps can start dropping frames.\n\nCallout — How Android does it vs How iOS does it: On Android you measure with the on-device GPU rendering bars, Perfetto/systrace, and the JankStats library, and you must handle dynamic refresh rate because the device may switch between 60/90/120Hz. On iOS you profile with Instruments (Core Animation, Time Profiler, Hangs) and pace animations with CADisplayLink.targetTimestamp so your work matches whatever rate ProMotion has selected. Both platforms increasingly expose the target present time so you can budget precisely instead of hard-coding 16.6ms.",
    "whatBreaks": "Assuming a fixed 60fps / 16.6ms budget breaks on 120Hz devices where you only have 8.3ms. Allocating objects inside scroll or animation callbacks triggers GC pauses that manifest as rhythmic stutter. Long synchronous work (decoding a bitmap, inflating a complex layout, reading a file) on the UI thread freezes the pipeline and drops a burst of frames. Nested or over-invalidated layouts push per-frame CPU time over budget so scroll never feels smooth even though nothing looks obviously wrong.",
    "efficientWay": {
      "title": "Staying Under the Frame Budget",
      "approaches": [
        {
          "name": "Budget to the actual refresh rate and profile real dropped frames on mid-range hardware",
          "verdict": "best",
          "reason": "Reading the present timestamps and testing on a slow device surfaces the frames you actually drop and adapts to 60/90/120Hz automatically."
        },
        {
          "name": "Optimize only after users complain about lag",
          "verdict": "ok",
          "reason": "Reactive but sometimes pragmatic; the risk is that jank is device-specific and your flagship phone hides it until it ships."
        },
        {
          "name": "Assume 60fps everywhere and hard-code a 16ms budget",
          "verdict": "weak",
          "reason": "On 120Hz displays you are already over budget by design, and the assumption hides real jank on high-refresh devices."
        }
      ],
      "recommendation": "Measure on a low-end device with the platform's frame profiler, treat the budget as refresh-rate-dependent, and hunt for the three classic causes: heavy per-frame CPU work, per-frame allocations causing GC, and synchronous I/O/decoding on the UI thread."
    },
    "commonMistakes": [
      "Hard-coding 16.6ms and ignoring 90/120Hz displays where the budget is much smaller",
      "Profiling only on a fast flagship phone where jank is invisible",
      "Allocating in scroll/animation callbacks and getting rhythmic GC stutter",
      "Blaming the framework for jank that is actually a synchronous decode or disk read on the UI thread"
    ],
    "seniorNotes": "Perceived smoothness is about consistency, not average FPS: 55fps with no long hitches feels better than 60fps average with a 120ms freeze. Track the worst frames (p95/p99 frame time and long-hang counts), not the mean. On high-refresh devices, consider whether an animation truly needs 120Hz — pacing to the current rate via the present timestamp keeps you correct as the OS switches refresh rates for battery.",
    "interviewQuestions": [
      "What is the frame budget at 60Hz versus 120Hz, and why does it matter?",
      "What causes jank, and how would you diagnose it?",
      "Why can an app feel janky even when its average FPS is 60?"
    ],
    "interviewAnswers": [
      "At 60Hz the display refreshes every 1000/60 = 16.6ms, so all per-frame work must finish in that window; at 120Hz it is 1000/120 = 8.3ms, half the time. It matters because work that comfortably fits at 60fps can blow the budget at 120fps, and the system also needs part of that window for compositing, so your real budget is a bit less than the nominal number.",
      "Jank is one or more dropped frames — the buffer was not ready by VSync so the previous frame was re-shown. I diagnose it with the platform frame profiler (Android GPU rendering bars / Perfetto, iOS Instruments), then attribute the overrun: heavy main-thread work points to layout/logic, periodic hitches point to GC from per-frame allocations, and a one-off freeze points to synchronous I/O or image decode. The fix depends on which one it is.",
      "Because average FPS hides distribution. A single 120ms freeze surrounded by fast frames still averages near 60fps but is very visible as a stutter. Smoothness is about consistent frame times, so I look at worst-case frame time and long-hang counts (p95/p99), not the mean."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Frame budget math and drop detection",
        "code": "budget(refreshHz) = 1000 / refreshHz   // milliseconds per frame\n\n  60Hz  -> 16.6 ms per frame\n  90Hz  -> 11.1 ms per frame\n 120Hz  ->  8.3 ms per frame\n\n// Detecting a dropped frame at runtime:\nexpectedInterval = 1000 / currentRefreshHz\nactualInterval   = thisFrameTime - lastFrameTime\n\nif actualInterval > expectedInterval * 1.5:\n    droppedFrames = floor(actualInterval / expectedInterval) - 1\n    report(\"jank\", droppedFrames)\n\n// Rule of thumb: keep main-thread work per frame well under\n// the budget (leave headroom for compositing + spikes)."
      }
    ],
    "resources": [
      {
        "label": "Android: Rendering & performance",
        "url": "https://developer.android.com/topic/performance/rendering",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh: Android developer roadmap",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      }
    ]
  },
  {
    "id": "imperative-vs-declarative-ui",
    "phase": 2,
    "phaseName": "UI Rendering & the Frame Pipeline",
    "orderIndex": 3,
    "estimatedMins": 35,
    "prerequisites": [
      "frame-rendering-pipeline"
    ],
    "title": "Imperative vs Declarative UI",
    "eli5": "There are two ways to tell a phone what to show. The old way: you hold onto each button and label and personally reach in to change it whenever something happens (imperative). The new way: you write a recipe that says what the screen should look like for the current situation, and the framework figures out what to change (declarative). The recipe way means you never forget to update a label.",
    "analogy": "Imperative UI is like being a stage hand who must personally move every actor and prop each time the script changes — miss one and the scene is wrong. Declarative UI is like handing the director a fresh script for the current scene and letting them arrange the stage; you describe the desired end state and the system reconciles the difference.",
    "explanation": "Imperative UI means you create widget objects and then mutate them over time in response to events: you keep references to a label and a button and write code like label.setText(newValue) or button.hide(). You are responsible for keeping the UI in sync with your data by hand. Declarative UI means you write a function that takes the current state and returns a description of what the UI should look like; when the state changes you produce a new description, and the framework diffs it against the previous one and applies the minimal set of changes. You never manually mutate a widget — you change state and re-describe.\n\nThe declarative shift matters because the number-one source of UI bugs is state that drifts out of sync with the view: you updated the model but forgot one of the five places that display it. Declarative UI makes the view a pure function of state, so there is exactly one source of truth and the framework guarantees the view matches it. The cost is that the framework must re-run your description and diff efficiently, so declarative frameworks invest heavily in making re-render cheap.\n\nHow Android does it vs How iOS does it: Android's original toolkit is the imperative View system (XML layouts inflated into View objects you mutate via findViewById and setters); Jetpack Compose is the declarative successor where composable functions emit UI from state and recompose on change. iOS's original toolkit is imperative UIKit (UIView/UIViewController with outlets you mutate); SwiftUI is the declarative successor where a View struct's body describes the UI as a function of state and the framework re-renders on change. Both platforms made the same journey for the same reason.",
    "technicalDeep": "In an imperative model the widget tree is long-lived, mutable state. Your code and the framework both hold references and mutate nodes; consistency is your responsibility. In a declarative model the description you return is cheap and often immutable — it is not the real UI, it is a blueprint. The framework keeps a persistent backing tree (the real views/layers) and reconciles the new blueprint against it: it diffs the two, reuses nodes that are unchanged, updates properties that changed, and inserts/removes nodes as needed. This is the same reconciliation idea across Compose (the composition + slot table), SwiftUI (identity-based diffing of the view tree), and React/React Native (the virtual DOM/fiber tree).\n\nState management is central. Declarative UIs rebuild the description when observed state changes, so they need a way to know what changed and what to re-run: Compose tracks reads of snapshot state and recomposes only affected scopes; SwiftUI uses @State/@Observable and dependency tracking; React uses hooks and a re-render + diff. Keys/identity matter enormously — giving list items stable identity lets the framework match old and new nodes instead of destroying and recreating them (which would lose scroll position, animation state, and focus).\n\nCallout — How Android does it vs How iOS does it: Compose recomposes only the composables that read changed state, then remeasures/redraws the affected subtree; it relies on stable parameters and keys to skip work. SwiftUI diffs the value-type view tree using each view's identity (structural or explicit .id()) and only mutates the underlying UIViews/layers that changed. Under the hood both still drive the same measure/layout/draw pipeline from the previous topics — declarative is a programming model layered on top of it, not a different renderer.",
    "whatBreaks": "In imperative code, forgetting to update one view when state changes leaves stale UI (the classic 'the badge count didn't refresh' bug). In declarative code, putting side effects directly in the render/body function causes them to fire on every re-render (duplicate network calls, flicker). Unstable list identity — using array index or no key — makes the framework recreate rows, dropping scroll position and animation. Over-broad state (one giant state object) causes the whole screen to re-render on any change, hurting performance. Mixing the two models naively (mutating a view the declarative framework owns) leads to the framework overwriting your change on the next re-render.",
    "efficientWay": {
      "title": "Choosing and Structuring a UI Model",
      "approaches": [
        {
          "name": "Declarative UI with view as a pure function of well-scoped state and stable item identity",
          "verdict": "best",
          "reason": "One source of truth eliminates sync bugs, and narrow state plus stable keys keeps re-renders cheap and preserves scroll/animation/focus."
        },
        {
          "name": "Imperative UI with disciplined one-way data binding",
          "verdict": "ok",
          "reason": "Works well for simple or highly custom screens and is unavoidable in legacy code, but you carry the burden of keeping views in sync by hand."
        },
        {
          "name": "Imperative UI mutating scattered view references from many event handlers",
          "verdict": "weak",
          "reason": "State drifts out of sync as the screen grows; the missed-update bug becomes routine and hard to track down."
        }
      ],
      "recommendation": "Prefer declarative on new work: model the screen as UI = f(state), keep state narrowly scoped so only affected parts re-render, and always give list items stable identity. Understand the imperative model too — you will meet it in legacy code and when bridging to native views."
    },
    "commonMistakes": [
      "Putting side effects (network calls, navigation) directly in the render/body function so they run on every re-render",
      "Using array index or no key for list items, causing rows to be recreated and losing scroll/animation state",
      "Keeping one giant state object so any change re-renders the entire screen",
      "Reaching in to mutate a widget the declarative framework owns, which gets overwritten on the next render"
    ],
    "seniorNotes": "Declarative does not mean free: the framework still runs measure/layout/draw, so a cheap-looking re-render can be expensive if it re-lays-out a large subtree. Learn your framework's skipping rules (Compose stability/@Stable, SwiftUI Equatable views, React memo) and its identity model. The deeper principle — unidirectional data flow with a single source of truth — is framework-agnostic and is exactly why Flutter (build methods), Compose, SwiftUI, and React all converged on it.",
    "interviewQuestions": [
      "What is the difference between imperative and declarative UI, and why did the industry shift to declarative?",
      "In a declarative framework, why does item identity/keys matter in lists?",
      "What is reconciliation and what does it do?"
    ],
    "interviewAnswers": [
      "Imperative UI means you create widgets and then mutate them by hand in response to events, so you are responsible for keeping the view in sync with your data. Declarative UI means you write UI as a function of state — you return a description and let the framework diff it against the previous one and apply minimal changes. The industry shifted because the biggest class of UI bugs is state drifting out of sync with the view; making the view a pure function of a single source of truth eliminates that whole category.",
      "The framework reconciles the new description against the existing backing tree by matching nodes. Stable identity lets it recognize that an existing row is the same logical item that just moved or changed, so it updates it in place and preserves scroll position, animation, and focus. Without stable keys (e.g. using array index) it can mismatch or recreate rows, causing flicker and lost state.",
      "Reconciliation is the process a declarative framework uses to turn a new UI description into the minimal set of mutations on the real, persistent view/layer tree. It diffs the new blueprint against the previous one, reuses unchanged nodes, updates changed properties, and inserts or removes nodes — so you describe the desired end state and the framework computes the delta."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Same counter, both models (pseudocode)",
        "code": "// IMPERATIVE: you hold references and mutate them\nlabel  = createLabel(\"0\")\nbutton = createButton(\"+\")\ncount  = 0\nbutton.onClick = () => {\n    count = count + 1\n    label.setText(str(count))   // must remember to update every view\n}\n\n// DECLARATIVE: describe UI from state; framework diffs\nstate count = 0\n\nfunction Screen(count):\n    return Column(\n        Text(str(count)),                 // always reflects state\n        Button(\"+\", onClick = () => count = count + 1)\n    )\n// changing `count` re-runs Screen(); framework updates only the Text"
      },
      {
        "lang": "kotlin",
        "label": "Declarative (Jetpack Compose) — UI as a function of state",
        "code": "@Composable\nfun Counter() {\n    var count by remember { mutableStateOf(0) }\n\n    Column {\n        Text(text = count.toString())        // recomposes when count changes\n        Button(onClick = { count++ }) {      // change state, not the view\n            Text(\"Increment\")\n        }\n    }\n}"
      }
    ],
    "resources": [
      {
        "label": "Material Design 3",
        "url": "https://m3.material.io/",
        "kind": "docs"
      },
      {
        "label": "Apple Human Interface Guidelines",
        "url": "https://developer.apple.com/design/human-interface-guidelines/",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh: Android developer roadmap",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      }
    ]
  },
  {
    "id": "layout-systems",
    "phase": 2,
    "phaseName": "UI Rendering & the Frame Pipeline",
    "orderIndex": 4,
    "estimatedMins": 35,
    "prerequisites": [
      "frame-rendering-pipeline",
      "imperative-vs-declarative-ui"
    ],
    "title": "Layout Systems: Constraints, Flex & Stacks",
    "eli5": "Before the phone can paint anything, it has to decide how big each box is and where it goes. Parents tell children the rules (you can be this wide at most), children say how big they want to be, and then parents place them. Some layouts stack things in a row or column, some pin things by rules like 'stay 8 pixels from the edge', and some pile things on top of each other.",
    "analogy": "Layout is like arranging furniture in a room. The room (parent) says how much space is available (constraints). Each piece of furniture (child) says how big it is or asks to fill the space. Then you place them: in a line along a wall (flex row/column), pinned relative to each other and the walls (constraints), or stacked in the same corner overlapping (stack). Only after everything has a size and position can you start decorating (drawing).",
    "explanation": "Layout is the stage that assigns every element a size and a position. It almost always works in two passes: constraints flow DOWN the tree (a parent tells each child the space it may occupy — often a min/max width and height), and sizes flow UP (each child reports the size it wants within those constraints); then the parent POSITIONS each child. Three families of layout dominate mobile: constraint-based (each element's edges are pinned relative to siblings or the parent, and a solver computes positions), flex/linear (children are arranged in a single row or column, with rules for how leftover space is distributed and how items align on the cross axis), and stack/overlay (children occupy the same region and are layered on top of each other, aligned within it).\n\nUnderstanding the direction of information flow is the key insight: a child cannot know its final size until it knows its constraints, and a parent cannot finish until its children report their sizes. This is why circular sizing (a child that wants to be as big as its parent inside a parent that wants to be as big as its child) is undefined and why some layouts require the framework to make a guess or run extra passes.\n\nHow Android does it vs How iOS does it: Android's flexible layout is ConstraintLayout (declare constraints between views and a solver resolves them) plus LinearLayout for simple rows/columns; in Compose it is Row/Column/Box with modifiers. iOS uses Auto Layout, where you declare constraints (NSLayoutConstraint / anchors) and a solver computes frames, plus UIStackView for linear arrangement; in SwiftUI it is HStack/VStack/ZStack. The concepts — constraints down, sizes up, then positioning — are identical across both.",
    "technicalDeep": "The two-pass model is a constraint negotiation. In flex/linear layouts the parent measures children, sums their sizes along the main axis, then distributes any remaining space according to weight/grow factors and aligns them on the cross axis. In constraint layouts, the parent feeds a linear constraint solver (Android ConstraintLayout uses a Cassowary-style solver; iOS Auto Layout uses Cassowary directly) that resolves a system of equalities and inequalities with priorities into concrete frames. Stacks place all children in the same rectangle and use an alignment to position each.\n\nCost is dominated by how many times measure runs. Naive nested layouts can trigger multiple measure passes per node (a node measured once to learn its children, again to finalize), and this multiplies with depth — the 'double taxation' problem. Flat hierarchies (constraint layouts, or single flex containers) reduce depth and passes. Intrinsic sizing (asking text how tall it is at a given width) and content that changes size (wrapping text, images loading) can force re-layout. Frameworks cache measured sizes and only re-measure dirty subtrees to keep this within the frame budget.\n\nCallout — How Android does it vs How iOS does it: Android historically warned that nested LinearLayout with weights causes double measure passes, and recommends ConstraintLayout to flatten the tree; Compose intentionally allows only a single measure pass per node by default and requires special handling (intrinsics/SubcomposeLayout) for content-dependent sizing. iOS Auto Layout resolves a global constraint system, which is powerful but can be expensive with many constraints; SwiftUI uses a parent-proposes / child-chooses size negotiation that is conceptually the same constraints-down/sizes-up flow. In every case, shallower trees and fewer measure passes mean faster frames.",
    "whatBreaks": "Deeply nested layouts multiply measure passes and blow the frame budget, especially inside scrolling lists where layout runs per item. Conflicting or under-constrained constraints leave elements with ambiguous position/size (they collapse to zero, overflow, or jump). Circular sizing (child sized to parent while parent sizes to child) is unresolvable and either errors or produces a wrong guess. Fixed pixel sizes break when text scales up (accessibility) or on different screen sizes, clipping content. Overusing weight/grow with intrinsic content can cause expensive repeated measurement during scroll.",
    "efficientWay": {
      "title": "Structuring Layout for Correctness and Speed",
      "approaches": [
        {
          "name": "Flat constraint-based or single-flex layouts sized by content and constraints, not fixed pixels",
          "verdict": "best",
          "reason": "Shallow trees minimize measure passes, constraints adapt to different screens and text sizes, and there is no ambiguity about who determines size."
        },
        {
          "name": "Moderately nested flex (rows inside columns) with clear sizing rules",
          "verdict": "ok",
          "reason": "Readable and adequate for most screens, but watch depth inside list items where extra measure passes are multiplied per row."
        },
        {
          "name": "Deeply nested containers with fixed pixel sizes and weighted children everywhere",
          "verdict": "weak",
          "reason": "Multiplies measure passes, breaks on different densities and accessibility text sizes, and is a common source of scroll jank."
        }
      ],
      "recommendation": "Keep the tree shallow (prefer constraints or a single flex container over deep nesting), size by content and constraints rather than hard-coded pixels, and be especially careful with layout inside list items since it runs for every visible row."
    },
    "commonMistakes": [
      "Nesting layouts deeply and causing multiple measure passes that show up as scroll jank",
      "Leaving constraints ambiguous or conflicting so elements collapse, overflow, or jump around",
      "Hard-coding pixel sizes that clip when the user increases system font size or on smaller screens",
      "Creating circular sizing where child depends on parent size and parent depends on child size"
    ],
    "seniorNotes": "Layout is where a lot of hidden CPU time lives because it runs before draw on every frame that changes size, and per-item inside lists. Profiling should attribute time to measure/layout separately from draw. The parent-proposes/child-chooses negotiation is the unifying mental model across Auto Layout, ConstraintLayout, Compose, SwiftUI, and Flutter's BoxConstraints — once you internalize 'constraints go down, sizes come up, parent positions', every framework's layout system reads the same way.",
    "interviewQuestions": [
      "Describe the two-pass layout model. Which direction do constraints flow and which direction do sizes flow?",
      "Why can deeply nested layouts hurt performance?",
      "When would you choose a constraint-based layout over nested flex containers?"
    ],
    "interviewAnswers": [
      "Layout negotiates size and position in two passes. Constraints flow down: a parent tells each child the space it may occupy (typically min/max width and height). Sizes flow up: each child reports the size it wants within those constraints. Then the parent positions each child within itself. A child cannot finalize its size without its constraints, and a parent cannot finish until children report sizes.",
      "Because measurement cost multiplies with depth. Some containers measure children more than once (once to learn desired sizes, again to finalize with distributed space), and nesting compounds those passes. Inside a scrolling list this runs per visible row every frame, so a deep tree can easily push per-frame layout time over the budget and cause jank.",
      "When the relationships between elements are better expressed as rules than as nesting — for example pinning a label to the end of an image and centering both — a flat constraint layout resolves everything in one solver pass without the extra depth. It flattens the hierarchy, reduces measure passes, and adapts cleanly to different screen sizes, whereas expressing the same relationships with nested flex containers would add depth and cost."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Constraints down, sizes up (pseudocode)",
        "code": "function layout(node, constraints):\n    // constraints = { minW, maxW, minH, maxH }  <-- flows DOWN\n\n    if node is Column:\n        remaining = constraints.maxH\n        childSizes = []\n        for child in node.children:\n            childC = { minW:0, maxW:constraints.maxW,\n                       minH:0, maxH:remaining }\n            size = layout(child, childC)        // recurse down\n            childSizes.append(size)\n            remaining = remaining - size.height  // sizes come UP\n\n        // parent now POSITIONS children\n        y = 0\n        for (child, size) in zip(node.children, childSizes):\n            child.position = (0, y)\n            y = y + size.height\n\n        return { width: constraints.maxW, height: y }\n\n// Flex adds: distribute leftover space by grow factor,\n//            align children on the cross axis.\n// Stack: give every child the same rect, align within it.\n// Constraint: hand edges+priorities to a solver -> frames."
      }
    ],
    "resources": [
      {
        "label": "Material Design 3: Layout",
        "url": "https://m3.material.io/",
        "kind": "docs"
      },
      {
        "label": "Apple Human Interface Guidelines: Layout",
        "url": "https://developer.apple.com/design/human-interface-guidelines/",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "list-virtualization",
    "phase": 2,
    "phaseName": "UI Rendering & the Frame Pipeline",
    "orderIndex": 5,
    "estimatedMins": 35,
    "prerequisites": [
      "layout-systems",
      "frame-budget-jank"
    ],
    "title": "Lists & Recycling (Virtualization)",
    "eli5": "A list might have ten thousand rows, but the screen only shows about ten at a time. Instead of building all ten thousand, the phone builds just the visible ones plus a few spare. As you scroll, a row that leaves the top gets its content swapped and reused at the bottom. It is like a small set of stage props being repainted and reused instead of building a prop for every scene.",
    "analogy": "Imagine a conveyor belt of window frames in front of a very long mural. You only own about a dozen frames. As the mural scrolls past, a frame that slides off one edge is carried around, re-glazed with the next part of the mural, and placed back on the other edge. You never build ten thousand frames — you recycle a handful.",
    "explanation": "Virtualization (also called recycling or windowing) is the technique of only creating UI for the items currently visible plus a small buffer, and reusing those item views as the user scrolls. Rendering every item in a large list would allocate thousands of views, run layout on all of them, and exhaust memory — all to display a dozen. Instead the list keeps a small pool of item containers. When an item scrolls off-screen, its container is detached and returned to the pool; when a new item scrolls on, a container is pulled from the pool and re-bound with the new item's data. This keeps the number of live views roughly constant regardless of list length.\n\nThe critical discipline is separating the container (the reusable view structure) from the data binding (filling it with a specific item's content). Because containers are reused, any state you set on one item must be fully reset/overwritten when it is bound to a different item — otherwise you get 'recycling bugs' where a checkbox or image from a previous item bleeds through. Binding must also be cheap, since it runs during scroll inside the frame budget.\n\nHow Android does it vs How iOS does it: Android uses RecyclerView with a ViewHolder pattern and a RecycledViewPool; you bind data in onBindViewHolder. In Compose it is LazyColumn/LazyRow which composes only visible items. iOS uses UITableView and UICollectionView with dequeueReusableCell(withIdentifier:); you configure the cell in the data source. In SwiftUI, List and LazyVStack lazily realize rows. All of them implement the same recycle-and-rebind idea.",
    "technicalDeep": "A recycling list maintains: a viewport, a small set of active item views mapped to data indices, and a scrap/recycle pool of detached views keyed by item type. On scroll it computes which indices are now visible (given item sizes or an estimate), recycles views whose indices left the viewport into the pool, and for newly visible indices either reuses a pooled view of the matching type or inflates a new one, then binds data. Multiple view types are supported by keying the pool on a type id so a header cell is not accidentally reused as a photo cell. Item size handling varies: fixed-height items make offset math trivial; variable-height items require measuring or estimating heights and correcting scroll offsets as real sizes become known.\n\nPerformance rules follow directly: keep bind cheap (no synchronous decode/parse in bind — kick off async image loads and show a placeholder), keep item layouts shallow (layout runs per row), avoid per-bind allocations (reuse holders and avoid creating new objects each bind to prevent GC stutter), and give items stable identity/keys so diffing can animate insertions/removals and avoid rebinding unchanged rows. Prefetching a few items ahead of the viewport hides bind cost. Nested horizontal-in-vertical lists need shared pools to avoid re-creating cells.\n\nCallout — How Android does it vs How iOS does it: RecyclerView separates ViewHolder (structure) from onBindViewHolder (data) explicitly, exposes getItemViewType for heterogeneous lists, and uses DiffUtil + stable ids for efficient updates. UITableView/UICollectionView dequeue reusable cells by identifier and use prepareForReuse to reset stale state, with diffable data sources for animated updates. Compose LazyColumn and SwiftUI List do the realization for you but you must still provide stable item keys and keep item content cheap. The failure mode — expensive bind or stale reused state — is the same everywhere.",
    "whatBreaks": "Rendering all items instead of virtualizing exhausts memory and freezes on large lists. Forgetting to reset reused views causes recycling bugs: a checked checkbox, wrong image, or leftover text from a previous item appears (especially when async image loads complete on an already-recycled view). Heavy work in bind (synchronous image decode, layout inflation, database calls) drops frames during scroll. Missing or unstable keys make updates rebind everything and lose animation/position. Variable item heights without estimation cause scroll-position jumps as real sizes resolve.",
    "efficientWay": {
      "title": "Building Smooth Long Lists",
      "approaches": [
        {
          "name": "Virtualized list with a reuse pool, cheap async bind, stable keys, and per-item state reset",
          "verdict": "best",
          "reason": "Constant memory regardless of length, no recycling bugs, and bind stays inside the frame budget so scroll is smooth even on huge datasets."
        },
        {
          "name": "Virtualized list but with somewhat heavy bind (sync formatting, complex item layout)",
          "verdict": "ok",
          "reason": "Correct and memory-safe, but bind cost can cause occasional dropped frames during fast scroll; fixable by moving work off the bind path."
        },
        {
          "name": "Render all items eagerly (e.g. a big column/loop with every row built up front)",
          "verdict": "weak",
          "reason": "Allocates and lays out thousands of views, spikes memory, and freezes on large datasets — it defeats the entire purpose of a list."
        }
      ],
      "recommendation": "Always use the platform's virtualized list for anything beyond a short fixed set. Separate container from bind, reset every mutable field on reuse (or rely on the framework's prepareForReuse), load images asynchronously with placeholders, and provide stable item keys so updates diff instead of rebinding."
    },
    "commonMistakes": [
      "Rendering the entire dataset instead of using a recycling list, causing memory spikes and freezes",
      "Not resetting reused item state, so images/checkboxes/text from a previous item bleed through",
      "Doing synchronous image decode or heavy formatting inside bind and dropping frames while scrolling",
      "Omitting stable keys, so list updates rebind everything and lose animations and scroll position"
    ],
    "seniorNotes": "Recycling correctness and bind cost are the two axes reviewers should watch. Async image loads are the classic recycling bug source: always associate the load with the current item and cancel/ignore it when the view is rebound. For heterogeneous lists, key the pool on view type. Diffing (DiffUtil / diffable data sources / keyed Lazy items) plus stable ids gives you animated, minimal updates. The concept is universal — Flutter's ListView.builder and React Native's FlatList/RecyclerListView do exactly the same windowing — so 'never render 10k rows' is a cross-framework law.",
    "interviewQuestions": [
      "Why do mobile lists recycle views instead of creating one per item?",
      "What is a recycling bug and how do you prevent it?",
      "What work should and should not happen when binding a list item?"
    ],
    "interviewAnswers": [
      "Because the screen only shows a handful of items at once, but a list can have thousands. Creating a view per item would allocate thousands of views, run layout on all of them, and exhaust memory to display a dozen. Recycling keeps a small pool of item containers and rebinds them as you scroll, so the number of live views stays roughly constant and memory and layout cost are bounded regardless of list length.",
      "A recycling bug is when a reused item view still shows state from the item it previously displayed — a leftover image, a checkbox left checked, or an async image load completing on a view that has since been rebound to a different item. You prevent it by fully resetting every mutable field when the container is reused (the platform hook is prepareForReuse / onBindViewHolder overwriting all fields), and by associating async loads with the current item so a stale load is ignored or cancelled when the view is rebound.",
      "Binding runs during scroll inside the frame budget, so it must be cheap: set text, kick off asynchronous image loads with a placeholder, and reset any reused state. What should not happen is synchronous work — decoding a full-size image, parsing JSON, running a database query, or inflating a complex layout — because that blocks the UI thread and drops frames. Move that work off the bind path (async, precomputed, or cached)."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Recycle-and-rebind loop (pseudocode)",
        "code": "pool = []              // detached, reusable item views\nactive = {}            // dataIndex -> view currently on screen\n\non scroll:\n    visible = indicesInViewport(scrollOffset, itemSizes)\n\n    // recycle views that scrolled off\n    for (index, view) in active:\n        if index not in visible:\n            view.detach()\n            view.cancelPendingImageLoads()   // avoid recycle bugs\n            pool.push(view)\n            remove active[index]\n\n    // realize newly visible items\n    for index in visible:\n        if index not in active:\n            view = pool.pop() or inflateNewItemView()\n            resetAllFields(view)             // clear stale state\n            bind(view, data[index])          // CHEAP: text + async img\n            view.attachAt(index)\n            active[index] = view\n\nfunction bind(view, item):\n    view.title.text = item.title\n    view.image.setPlaceholder()\n    loadImageAsync(item.url, into = view.image, tag = item.id)"
      },
      {
        "lang": "kotlin",
        "label": "Android RecyclerView: container vs bind",
        "code": "class ItemHolder(val row: View) : RecyclerView.ViewHolder(row) {\n    val title: TextView = row.findViewById(R.id.title)\n    val photo: ImageView = row.findViewById(R.id.photo)\n}\n\noverride fun onCreateViewHolder(parent: ViewGroup, type: Int): ItemHolder {\n    // structure created rarely, then pooled and reused\n    val row = inflate(R.layout.item_row, parent)\n    return ItemHolder(row)\n}\n\noverride fun onBindViewHolder(holder: ItemHolder, pos: Int) {\n    val item = items[pos]\n    holder.title.text = item.title          // cheap\n    holder.photo.setImageDrawable(null)     // reset stale state\n    imageLoader.load(item.url).into(holder.photo)  // async\n}"
      }
    ],
    "resources": [
      {
        "label": "Android: Rendering & performance",
        "url": "https://developer.android.com/topic/performance/rendering",
        "kind": "docs"
      },
      {
        "label": "Apple Human Interface Guidelines",
        "url": "https://developer.apple.com/design/human-interface-guidelines/",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh: Android developer roadmap",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      }
    ]
  },
  {
    "id": "density-independence",
    "phase": 2,
    "phaseName": "UI Rendering & the Frame Pipeline",
    "orderIndex": 6,
    "estimatedMins": 30,
    "prerequisites": [
      "layout-systems"
    ],
    "title": "Density Independence (dp/pt, @1x/2x/3x)",
    "eli5": "Two phones can be the same physical size but one crams way more tiny dots (pixels) into that space. If you sized a button in dots, it would look huge on the low-dot phone and tiny on the high-dot phone. So instead you measure in a fake unit that stays the same physical size, and the phone multiplies it by how dense its screen is.",
    "analogy": "Think of describing a poster in inches, not in threads of the fabric it is printed on. A silk poster has far more threads per inch than a burlap one, but 'ten inches wide' looks the same size on both. Logical units (dp/pt) are the inches; physical pixels are the threads; the density is how many threads make up one inch.",
    "explanation": "Screens differ wildly in pixel density — the number of physical pixels packed into a given physical distance. If you specified UI sizes directly in physical pixels, the same design would appear large on a low-density screen and tiny on a high-density one. Density independence solves this with a logical unit that represents a roughly constant physical size, and the system multiplies it by the screen's density factor to get physical pixels. Android calls this unit the dp (density-independent pixel); iOS calls it the point (pt). You lay out everything in these logical units and let the device do the conversion.\n\nBecause devices come in density tiers, bitmap assets (icons, photos) must be provided at multiple resolutions so they stay crisp: an image that is 24 logical units square needs more actual pixels on a 3x screen than on a 1x screen. You either ship the asset at several densities (@1x/@2x/@3x, or Android's mdpi/hdpi/xhdpi/xxhdpi buckets) or use vector/scalable assets that render sharp at any density. Text uses a related but separate scale that also respects the user's font-size accessibility setting.\n\nHow Android does it vs How iOS does it: Android measures in dp where 1dp = 1px at 160dpi (mdpi) baseline, so physicalPixels = dp * (dpi/160); it groups devices into density buckets (mdpi ~1x, hdpi ~1.5x, xhdpi ~2x, xxhdpi ~3x) and picks the matching drawable, and uses sp for text so it also scales with the user's font setting. iOS measures in points where the scale is @2x or @3x, so physicalPixels = pt * scale; it selects @1x/@2x/@3x image assets automatically and uses Dynamic Type for scalable text. Same principle, different names and baselines.",
    "technicalDeep": "The core formula is physicalPixels = logicalUnits * densityScale. On Android densityScale = dpi/160 (the density bucket approximates this); on iOS densityScale is the device scale (2 or 3). The framework does this conversion at layout/draw time, so you almost never work in raw pixels. Density buckets exist so the system can pick the nearest pre-rendered asset; if an exact match is missing, it scales the closest one, which can look soft (upscaled) or waste memory (downscaled). Vector assets (Android VectorDrawable, iOS SF Symbols / PDF/vector image assets) sidestep this by rendering per-density at runtime, at the cost of some GPU/CPU work for complex paths.\n\nText scaling is a distinct axis: Android's sp and iOS's Dynamic Type multiply font sizes by both density and the user's accessibility text-size preference, so text can grow independently of layout units. This is why hard-coding pixel heights around text breaks: the text can outgrow its container. Density also interacts with asset memory: a full-screen background at 3x holds ~9x the pixels of 1x, so shipping only the largest asset and downscaling wastes RAM on low-density devices, while shipping only the smallest and upscaling looks blurry on high-density ones.\n\nCallout — How Android does it vs How iOS does it: Android resolves the right drawable via resource qualifiers (drawable-xxhdpi, plus -sw600dp etc. for size) and prefers VectorDrawable for icons; sizes in dp, text in sp. iOS uses asset catalogs with @1x/@2x/@3x slots (and vector PDFs / SF Symbols) resolved automatically; sizes in pt, text via Dynamic Type. Both convert logical to physical for you — your job is to never hard-code physical pixels and to provide assets that stay sharp across densities.",
    "whatBreaks": "Specifying sizes in physical pixels makes UI huge on low-density and tiny on high-density screens. Shipping a single bitmap density makes icons blurry (upscaled) or memory-heavy (downscaled) on mismatched devices. Ignoring text scaling / Dynamic Type means text overflows or clips when a user increases font size for accessibility. Assuming a fixed device scale (always @2x) breaks on @3x phones and on devices with fractional densities. Fixed pixel touch targets can become too small to tap on high-density screens.",
    "efficientWay": {
      "title": "Handling Density Correctly",
      "approaches": [
        {
          "name": "Size everything in logical units (dp/pt), use vector assets for icons and density-bucketed bitmaps for photos, and honor system text scaling",
          "verdict": "best",
          "reason": "Layout stays a constant physical size across devices, icons are crisp at any density with no memory waste, and text respects accessibility settings without clipping."
        },
        {
          "name": "Logical units plus a single high-resolution bitmap set that the system downscales",
          "verdict": "ok",
          "reason": "Looks sharp everywhere and is simple to maintain, but wastes memory and bandwidth on low-density devices; acceptable for a few small assets, wasteful for large ones."
        },
        {
          "name": "Hard-code sizes in physical pixels and ship one bitmap density",
          "verdict": "weak",
          "reason": "UI scales wrong across devices and assets are either blurry or bloated; this is the classic 'looks fine on my phone only' bug."
        }
      ],
      "recommendation": "Never think in physical pixels for layout — use dp/pt. Use vector/scalable assets for icons and provide bitmaps at the standard density buckets for photos. Test with the system font size turned up to catch text-scaling breakage, and keep touch targets sized in logical units."
    },
    "commonMistakes": [
      "Specifying UI sizes in raw pixels so the design scales wrong across densities",
      "Shipping one bitmap density, causing blurry upscales or memory-heavy downscales",
      "Ignoring Dynamic Type / sp so text clips or overflows when users enlarge fonts",
      "Assuming a single device scale (always 2x) and breaking on 3x or fractional-density devices"
    ],
    "seniorNotes": "Density independence and text scaling are separate axes — do not conflate them. Layout uses dp/pt (density only); text uses sp/Dynamic Type (density plus user preference), which is why fixed containers around text are fragile. For assets, prefer vectors for anything geometric and reserve multi-density bitmaps for photographic content, watching the memory cost of large images at 3x. This concept is fully cross-framework: Flutter's logical pixels and MediaQuery.devicePixelRatio, React Native's density-independent units and PixelRatio, all express the same physicalPixels = logical * scale relationship.",
    "interviewQuestions": [
      "What is a density-independent unit (dp/pt) and why is it needed?",
      "Why do you ship image assets at @1x/@2x/@3x or multiple density buckets?",
      "How is text scaling different from layout density, and why does it matter for accessibility?"
    ],
    "interviewAnswers": [
      "A density-independent unit represents a roughly constant physical size regardless of how many pixels a screen packs into that space. It is needed because screens vary enormously in pixel density; if you sized UI in physical pixels it would look large on low-density screens and tiny on high-density ones. You lay out in dp (Android) or pt (iOS) and the system multiplies by the device's density scale to get physical pixels, so the design stays the same physical size everywhere.",
      "Because a bitmap that is, say, 24 logical units square needs more actual pixels on a denser screen to stay sharp. Providing the asset at multiple densities lets the system pick the one matching the device instead of upscaling (which looks blurry) or downscaling a huge asset (which wastes memory). Vectors avoid the need entirely by rendering per-density at runtime, but photographic assets still need multiple bitmap resolutions.",
      "Layout density (dp/pt) accounts only for the screen's pixel density and is fixed per device. Text scaling (sp / Dynamic Type) multiplies font size by density and by the user's accessibility font-size preference, so text can grow independently of layout units. It matters because users with low vision enlarge system text; if you hard-code container sizes or use non-scaling units, that enlarged text overflows or clips, breaking accessibility."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Logical to physical pixel conversion",
        "code": "// The universal relationship:\nphysicalPixels = logicalUnits * densityScale\n\n// Android (baseline 160dpi = 1x):\n//   densityScale = dpi / 160\n//   buckets: mdpi 1.0, hdpi 1.5, xhdpi 2.0, xxhdpi 3.0\n16 dp on an xxhdpi (3x) phone  -> 16 * 3.0 = 48 px\n16 dp on an mdpi  (1x) phone  -> 16 * 1.0 = 16 px\n\n// iOS (points, scale 2 or 3):\n//   physicalPixels = pt * scale\n16 pt on an @3x phone         -> 16 * 3   = 48 px\n16 pt on an @2x phone         -> 16 * 2   = 32 px\n\n// Same logical size -> same physical size on screen.\n// A 24-unit icon therefore needs 24/48/72 real px of\n// artwork at 1x/2x/3x -> ship those, or use a vector.\n\n// Text adds the user's font-scale on top:\ntextPx = pointSize * densityScale * userFontScale"
      }
    ],
    "resources": [
      {
        "label": "Material Design 3",
        "url": "https://m3.material.io/",
        "kind": "docs"
      },
      {
        "label": "Apple Human Interface Guidelines",
        "url": "https://developer.apple.com/design/human-interface-guidelines/",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "gpu-compositing",
    "phase": 2,
    "phaseName": "UI Rendering & the Frame Pipeline",
    "orderIndex": 7,
    "estimatedMins": 35,
    "prerequisites": [
      "frame-rendering-pipeline",
      "frame-budget-jank"
    ],
    "title": "GPU, Layers & Overdraw",
    "eli5": "The screen chip (GPU) is great at stacking flat pictures on top of each other and sliding them around fast. The UI is broken into a few such pictures called layers. Trouble comes when you paint the same pixel many times over (overdraw) or ask for fancy effects like blur and shadow, which force the chip to draw off to the side first and then bring it back — that is slow.",
    "analogy": "Think of transparent sheets on an overhead projector. Each sheet is a layer; sliding a sheet around is cheap because you do not redraw it. But if you stack ten opaque sheets, the projector wastes light drawing pixels that are completely hidden underneath (overdraw). And a blur is like having to photograph a sheet, smudge the photo in a darkroom, and bring it back before projecting — a whole extra round trip.",
    "explanation": "The GPU composites the final frame by taking a set of pre-rasterized layers (textures) and blending them together with transforms, clipping, and opacity. Splitting the UI into layers is what makes animation cheap: to move or fade a layer the GPU just re-blends existing textures, with no need to repaint content. But three things make compositing expensive. Overdraw is painting the same pixel multiple times in one frame — for example a screen background, then an opaque card on top, then an opaque row on top of that; the hidden pixels underneath were drawn for nothing, wasting GPU fill-rate. Offscreen rendering is when an effect cannot be applied in a single pass, so the GPU must render a subtree into a separate buffer, process it, and then bring it back to composite — an extra round trip that is much slower. Blurs, shadows (especially soft/rounded ones), and certain masks/clips trigger this. Overusing layers has its own cost: each layer consumes memory and adds a compositing step.\n\nThe practical takeaway: transforms and opacity on existing layers are cheap; heavy fill (lots of overlapping opaque or translucent content) and effects that force offscreen passes are expensive. Good UI minimizes overdraw and uses expensive effects sparingly, especially during scroll or animation.\n\nHow Android does it vs How iOS does it: Android composites via SurfaceFlinger and rasterizes with Skia/Hardware-accelerated Canvas; it offers a GPU Overdraw debug overlay that tints the screen by how many times each pixel was drawn, and hardware layers you can promote a view to. iOS composites via Core Animation's render server; each CALayer is a compositing unit, and effects like shouldRasterize, shadows, and masks can force offscreen passes that Instruments' Core Animation tool flags with color. Both give you tools to see overdraw and offscreen work directly.",
    "technicalDeep": "The GPU is fill-rate bound during compositing: it can only write so many pixels per frame. Overdraw multiplies the pixels written — an overdraw factor of 3 means every screen pixel was painted three times on average. Because fill-rate is finite, high overdraw directly eats the frame budget, and it hurts most on high-resolution/high-density screens where there are more pixels to fill. Eliminating overdraw means removing invisible backgrounds (do not paint a background you will fully cover), flattening opaque layers, and clipping to only the dirty region.\n\nOffscreen rendering breaks single-pass compositing. Effects like a Gaussian blur sample many neighboring pixels, so the source subtree must first be rendered into an offscreen texture, then the blur kernel is applied, then the result is composited back. Each offscreen pass is a context switch for the GPU (render target change) plus extra memory bandwidth, which is why blurs and soft shadows are among the most expensive UI effects and can wreck scroll performance if applied per-item. Rounded-corner clipping, masks, and group opacity on complex subtrees can also force offscreen passes. Promoting a view to its own hardware/rasterized layer can help if it is static and reused (cache the texture) but hurts if its content changes every frame (you pay to re-rasterize plus the layer overhead).\n\nCallout — How Android does it vs How iOS does it: Android's Debug GPU Overdraw overlay colors pixels blue/green/pink/red by draw count, and you reduce overdraw by removing window/background layering and using clipping; hardware layers (View.setLayerType) cache static content. iOS flags offscreen passes in Instruments' Core Animation (color blend/offscreen options); rasterizing a layer (shouldRasterize) caches it but must be used carefully to avoid re-rasterization thrash, and precomputed shadow paths (shadowPath) avoid expensive offscreen shadow computation. The universal rules: reduce overdraw, avoid unnecessary offscreen passes, and only cache layers whose content is stable.",
    "whatBreaks": "High overdraw (stacked opaque backgrounds, full-screen translucent overlays) exhausts GPU fill-rate and drops frames, worst on dense/large screens. Blurs and soft shadows applied per list item or animated every frame force repeated offscreen passes and cause scroll jank. Rounded-corner clipping or masks on complex, changing subtrees trigger offscreen rendering each frame. Over-promoting views to layers wastes memory and, if the content changes, causes constant re-rasterization. Large translucent images composited over busy backgrounds combine heavy fill with blending cost.",
    "efficientWay": {
      "title": "Cheap Compositing",
      "approaches": [
        {
          "name": "Flat opaque UI with minimal overdraw, effects used sparingly, and only static content cached as layers",
          "verdict": "best",
          "reason": "Keeps GPU fill-rate and offscreen passes low, so animation stays a cheap re-blend of existing textures and scroll holds its frame rate."
        },
        {
          "name": "Moderate use of shadows/blur on a few non-scrolling elements with precomputed shadow paths",
          "verdict": "ok",
          "reason": "Fine for static chrome like a top bar or a single hero card, but must be kept off per-item scroll paths where the offscreen cost repeats."
        },
        {
          "name": "Blurs, soft shadows, and translucency layered everywhere, including inside scrolling lists",
          "verdict": "weak",
          "reason": "Forces repeated offscreen passes and high overdraw every frame, which is a leading cause of scroll jank on all but the fastest GPUs."
        }
      ],
      "recommendation": "Measure overdraw with the platform overlay and drive it down by removing hidden backgrounds and flattening opaque content. Treat blur and soft shadow as premium effects — keep them off scroll/animation paths, precompute shadow paths, and only cache a view as its own layer when its content is genuinely static."
    },
    "commonMistakes": [
      "Stacking opaque backgrounds (window + container + item) and paying to draw hidden pixels",
      "Applying blur or soft shadows per list item and causing repeated offscreen passes during scroll",
      "Clipping rounded corners or masking complex, changing subtrees every frame",
      "Promoting frequently-changing views to hardware layers and paying constant re-rasterization plus memory"
    ],
    "seniorNotes": "Attribute GPU-side jank precisely: high overdraw is a fill-rate problem (fix by flattening and removing hidden paint), while blur/shadow/mask jank is an offscreen-pass problem (fix by removing the effect from hot paths or precomputing it). Layer caching is a double-edged tool — great for static content, harmful for animated content. These are hardware-composition realities, so they apply identically in Flutter (RepaintBoundary, saveLayer costs, Impeller) and any GPU-composited toolkit; 'why are blurs and shadows expensive' has the same answer everywhere: they break single-pass compositing.",
    "interviewQuestions": [
      "What is overdraw and why does it hurt performance?",
      "Why are blurs and soft shadows expensive to render?",
      "When does promoting a view to its own layer help, and when does it hurt?"
    ],
    "interviewAnswers": [
      "Overdraw is painting the same pixel more than once in a single frame — for instance a screen background covered by an opaque card covered by an opaque row, where the hidden pixels underneath were drawn for nothing. It hurts because the GPU is fill-rate bound: it can only write so many pixels per frame, so redundant painting eats the frame budget directly, and it gets worse on high-density and large screens where there are more pixels to fill. You reduce it by removing hidden backgrounds and flattening opaque content.",
      "Because they cannot be produced in a single compositing pass. A blur samples many neighboring pixels, so the GPU must first render the source subtree into a separate offscreen buffer, apply the effect, then composite the result back — an extra round trip with a render-target switch and extra memory bandwidth. Soft shadows are similar (they blur an alpha mask). That offscreen pass is far more expensive than a normal blend, so doing it per item or every frame during scroll causes jank.",
      "Promoting a view to its own cached layer helps when the content is static and reused: the GPU rasterizes it once into a texture and then just re-blends that texture to move or fade it, avoiding repaint. It hurts when the content changes frequently, because you pay to re-rasterize the layer every frame plus the extra memory and compositing overhead — often more than just drawing it normally. So cache stable content, never animated content."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Overdraw and offscreen cost (pseudocode)",
        "code": "// OVERDRAW: same pixel painted repeatedly\ndrawFullScreen(windowBackground)   // pass 1 over every pixel\ndrawFullScreen(containerBackground) // pass 2 (hides pass 1!)\ndrawRow(rowBackground)             // pass 3 over row pixels\n// overdrawFactor ~ 3x  -> 3x the GPU fill work\n\n// FIX: don't paint what you'll fully cover\nif container.isOpaque and coversScreen:\n    skip(windowBackground)         // remove hidden paint\n\n// OFFSCREEN PASS: effect that breaks single-pass compositing\nfunction drawWithBlur(subtree):\n    tex = renderToOffscreenBuffer(subtree)  // extra render target\n    blurred = applyGaussianKernel(tex)       // samples neighbors\n    composite(blurred)                       // bring it back\n// each frame during scroll repeats all three -> jank\n\n// CHEAP by contrast: move/fade an already-rasterized layer\nlayer.transform = translate(x, y)   // GPU re-blends texture\nlayer.opacity   = 0.5               // no repaint, no offscreen"
      }
    ],
    "resources": [
      {
        "label": "Android: Rendering & performance",
        "url": "https://developer.android.com/topic/performance/rendering",
        "kind": "docs"
      },
      {
        "label": "Apple Human Interface Guidelines",
        "url": "https://developer.apple.com/design/human-interface-guidelines/",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh: Android developer roadmap",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      }
    ]
  }
]
