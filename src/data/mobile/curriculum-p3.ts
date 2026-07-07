import type { CurriculumTopic } from '@/types'

/** Phase 3 of the Mobile Development course: Adaptive UI, Navigation & Accessibility. */
export const MOBILE_P3: CurriculumTopic[] = [
  {
    "id": "screen-diversity",
    "phase": 3,
    "phaseName": "Adaptive UI, Navigation & Accessibility",
    "orderIndex": 1,
    "estimatedMins": 35,
    "prerequisites": [
      "layout-systems"
    ],
    "title": "Screen Diversity: Notches, Foldables, Tablets",
    "eli5": "Phones and tablets come in wildly different shapes. Some have a notch or a camera hole punched into the screen, some fold in half, some are tiny and some are huge. Your app has to keep the important stuff out from under the notch and the rounded corners, and use the extra room on big screens instead of just stretching everything.",
    "analogy": "Designing for one screen is like framing a photo for one exact frame size. Real mobile is like shipping a painting that must look right in dozens of frames — some with a chunk cut out of a corner (notch), some that hinge in the middle (foldable), some poster-sized (tablet). You leave safe margins so nothing important sits where the frame eats it, and you rearrange the composition when the canvas gets much bigger.",
    "explanation": "Modern devices vary along many axes: physical size (small phones to large tablets), aspect ratio (tall skinny phones vs squarer tablets), display cutouts (notches, punch-holes, rounded corners), system UI overlays (status bar, navigation bar, home indicator), foldable hinges and dual screens, and orientation (portrait vs landscape). The two foundational concepts for coping are safe areas and insets. The safe area is the region of the screen where it is safe to place interactive and important content without it being clipped by a cutout, rounded corner, or covered by system UI. Insets are the numeric margins describing how far in the safe area sits from each edge (and there are several kinds — the status bar inset, gesture/navigation inset, keyboard inset). You read these insets from the system and pad your content so nothing critical lands under the notch, behind the home indicator, or under the keyboard.\n\nBeyond safe areas, large and foldable screens require rethinking layout, not just stretching it: a list-detail screen that shows one pane on a phone should show both panes side by side on a tablet or an unfolded device, and it must handle the device folding/unfolding at runtime. Orientation changes similarly change available width and height and may destroy/recreate UI.\n\nHow Android does it vs How iOS does it: Android exposes cutouts via DisplayCutout and system spacing via WindowInsets (statusBars, navigationBars, ime for keyboard, displayCutout); Jetpack WindowManager reports foldable hinge posture and window size classes for adaptive layout. iOS exposes the safe area via safeAreaInsets / the safe area layout guide (accounting for notch, Dynamic Island, and home indicator) and describes size via size classes and split-view; SwiftUI provides safeAreaInsets and .ignoresSafeArea. The concept — read insets, respect the safe area, adapt to size — is the same.",
    "technicalDeep": "Insets come in categories and can overlap: content insets from cutouts and rounded corners, system-bar insets (status bar at top, navigation/gesture bar at bottom), and the keyboard (IME) inset that appears dynamically. Edge-to-edge designs deliberately draw behind the system bars for immersive visuals but must then apply the insets as padding to interactive content so buttons are not hidden under the bars. Insets are dynamic: rotating the device, folding/unfolding, and showing the keyboard all change them, so you must observe changes rather than read once.\n\nForm-factor adaptation is driven by size classes / window size classes (compact vs expanded width/height buckets) rather than exact pixel sizes, so the same code responds to a phone in landscape, a foldable unfolded, or a tablet by choosing a layout appropriate to the bucket. Foldables add posture (folded, half-open/tabletop, flat) and a hinge that may occlude a strip of the screen; robust apps avoid placing critical content across the hinge. Orientation and configuration changes can trigger UI recreation, so state must survive them.\n\nCallout — How Android does it vs How iOS does it: Android uses WindowInsets + insets APIs (with edge-to-edge via WindowCompat.setDecorFitsSystemWindows(false)) and WindowSizeClass / WindowManager foldable APIs for adaptive and hinge-aware layouts; configuration changes may recreate the activity, so state is saved via ViewModel/saved state. iOS uses the safe area layout guide and safeAreaInsets, size classes (horizontal/vertical regular/compact) and UISplitViewController for list-detail, plus multitasking (Split View/Slide Over on iPad) that changes your window's size at runtime. Both demand that you never hard-code a single device's geometry.",
    "whatBreaks": "Ignoring safe-area insets puts buttons under the notch, behind the home indicator, or under the keyboard where they cannot be tapped. Assuming a fixed aspect ratio letterboxes or stretches content on tall or square screens. Placing key UI across a foldable hinge splits or hides it. Not handling the keyboard inset lets the keyboard cover the text field being typed into. Treating a tablet as a big phone wastes space with one giant stretched column. Losing state on rotation/fold because the UI was recreated frustrates users mid-task.",
    "efficientWay": {
      "title": "Designing for Many Form Factors",
      "approaches": [
        {
          "name": "Respect dynamic insets, draw edge-to-edge with padded content, and adapt layout by size class including foldable postures",
          "verdict": "best",
          "reason": "Content is always tappable and unclipped on any device, big screens gain real multi-pane layouts, and folding/rotation is handled gracefully with preserved state."
        },
        {
          "name": "Respect safe areas but ship one phone layout scaled up to tablets",
          "verdict": "ok",
          "reason": "Nothing is clipped and it works everywhere, but large screens are underused with stretched single-column UI; fine as a first release, weak long term."
        },
        {
          "name": "Hard-code margins and a single aspect ratio for the developer's own device",
          "verdict": "weak",
          "reason": "Breaks under notches, home indicators, keyboards, foldables, and tablets — the classic 'looks perfect only on my phone' failure."
        }
      ],
      "recommendation": "Read insets from the system and observe their changes; keep interactive content inside the safe area even when drawing edge-to-edge. Drive layout from size classes rather than pixel sizes so one codebase adapts from small phones to unfolded foldables and tablets, and preserve state across configuration changes."
    },
    "commonMistakes": [
      "Not applying safe-area insets, so controls hide under the notch, home indicator, or keyboard",
      "Assuming a single aspect ratio and letterboxing or stretching on tall/square screens",
      "Placing important content across a foldable hinge where it is split or occluded",
      "Treating tablets as scaled-up phones instead of using multi-pane adaptive layouts"
    ],
    "seniorNotes": "Insets are dynamic and layered — treat them as a live stream (rotation, fold, keyboard) not a constant, and remember edge-to-edge means you own the padding. Size classes, not device models, are the right abstraction; designing to buckets future-proofs you against new form factors. Foldable posture and continuity (resuming across fold) are increasingly table stakes. The same principles appear in Flutter (MediaQuery padding/viewInsets, LayoutBuilder) and React Native (SafeAreaView, useWindowDimensions), so inset-and-size-class thinking transfers directly.",
    "interviewQuestions": [
      "What is a safe area and what are insets?",
      "How would you adapt a list-detail screen from a phone to a tablet or unfolded foldable?",
      "Why must insets be treated as dynamic rather than read once?"
    ],
    "interviewAnswers": [
      "The safe area is the region of the screen where it is safe to place important, interactive content without it being clipped by a display cutout or rounded corner or covered by system UI like the status bar and home indicator. Insets are the numeric margins that describe how far the safe area sits from each edge, and there are several kinds — status bar, navigation/gesture bar, display cutout, and the keyboard. You pad content by the insets so nothing critical lands in an unsafe region.",
      "I drive it off window size classes rather than pixel dimensions. In a compact width (a phone) I show a single pane and navigate from the list to the detail. In an expanded width (a tablet or an unfolded foldable) I show both panes side by side in a split view. I make the layout react to size-class changes at runtime so folding, unfolding, or entering split-view multitasking switches between the two presentations, and I preserve selection and scroll state across that transition.",
      "Because they change while the app is running: rotating the device swaps which edges have bars, showing the keyboard adds a large bottom inset, folding or unfolding and entering split-view multitasking all change the safe area. If you read insets once at startup, the layout will be wrong after any of these events — content ends up under the keyboard or behind a bar. So you observe inset changes and re-apply padding whenever they update."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Applying insets and adapting by size class (pseudocode)",
        "code": "on layout(window):\n    insets = window.currentInsets   // dynamic! re-read on change\n    // insets = { top, bottom, left, right, keyboard }\n\n    // draw background edge-to-edge, pad interactive content\n    content.padding = {\n        top:    insets.top,               // clear status bar / notch\n        bottom: max(insets.bottom, insets.keyboard), // bar or IME\n        left:   insets.left,\n        right:  insets.right\n    }\n\n    // adapt structure by size class, not pixels\n    switch window.widthSizeClass:\n        case COMPACT:                     // phone portrait\n            show(SinglePane(selectedItem or list))\n        case EXPANDED:                    // tablet / unfolded\n            if foldPosture == HALF_OPEN:\n                avoidHingeRegion(window.hingeBounds)\n            show(TwoPane(list, detail))\n\non insetsChanged or configurationChanged:\n    relayout(window)   // rotation, fold, keyboard, split-view"
      }
    ],
    "resources": [
      {
        "label": "Apple Human Interface Guidelines: Layout",
        "url": "https://developer.apple.com/design/human-interface-guidelines/",
        "kind": "docs"
      },
      {
        "label": "Material Design 3",
        "url": "https://m3.material.io/",
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
    "id": "responsive-adaptive-layout",
    "phase": 3,
    "phaseName": "Adaptive UI, Navigation & Accessibility",
    "orderIndex": 2,
    "estimatedMins": 35,
    "prerequisites": [
      "screen-diversity",
      "layout-systems"
    ],
    "title": "Responsive & Adaptive Layout",
    "eli5": "Instead of building a separate app for phones and tablets, you build one that rearranges itself based on how much room it has. When it is narrow it stacks things in a column; when it is wide it spreads them out and shows more at once. Same code, many shapes.",
    "analogy": "Think of water taking the shape of its container: pour it in a tall glass and it is narrow and deep; pour it in a wide bowl and it spreads out. Responsive layout is your UI behaving like water — the same content flows to fill whatever container it is given, and at certain sizes it reorganizes into a smarter arrangement.",
    "explanation": "Responsive and adaptive layout let one codebase serve many form factors. Responsive usually means content fluidly resizes and reflows with the available space (a grid that shows more columns when wider). Adaptive usually means the UI switches between distinct layouts at defined thresholds (a bottom navigation bar on a phone becomes a side navigation rail on a tablet). In practice you combine both. The mechanism is breakpoints or size classes: buckets of available width (and sometimes height) — commonly compact, medium, and expanded — that you design distinct layouts for. You react to the size class you are in, not to exact pixel counts, so the app behaves consistently across the huge range of real device sizes and across multitasking windows that can be any size.\n\nThe design goal is to use space meaningfully: a phone shows one thing at a time, a tablet or unfolded foldable shows a list and a detail together, and navigation moves from bottom bar to rail to permanent drawer as width grows. Adaptive components (navigation, panes, dialogs vs full screens) are the building blocks that swap presentation by size class while keeping the same underlying content and state.\n\nHow Android does it vs How iOS does it: Android formalizes this with Window Size Classes (compact/medium/expanded width and height) and canonical adaptive layouts (list-detail, supporting-pane, feed); navigation adapts from bottom bar to navigation rail to permanent drawer. iOS uses size classes (horizontal/vertical, regular/compact), UISplitViewController for list-detail, and adapts presentations (a popover on regular width becomes a sheet on compact). Both steer you toward reacting to size buckets rather than device type.",
    "technicalDeep": "Breakpoints/size classes are derived from the current window size, which on modern OSes is not the same as the physical screen: split-view multitasking, freeform windows, and foldables mean the window can be any size and can change at runtime. So layout must be a function of the window's current size class and must recompute when it changes. Canonical adaptive patterns map size classes to structure: list-detail (single pane in compact, two panes in expanded), supporting pane (a secondary panel appears when there is room), and navigation that promotes from bottom bar (compact) to rail (medium) to permanent drawer (expanded).\n\nA robust implementation keeps the content and state layer independent of presentation, so switching layouts across a size-class change preserves selection, scroll position, and in-progress input. Avoid device sniffing ('is this an iPad?') in favor of capability/size queries, because window sizes no longer map cleanly to device types. Combine with the density and inset concepts from prior topics: breakpoints are expressed in logical units (dp/pt) and layouts still respect safe-area insets.\n\nCallout — How Android does it vs How iOS does it: Android's WindowSizeClass plus material adaptive libraries provide ready-made list-detail and navigation-suite scaffolds that switch by width class; Compose's BoxWithConstraints/LayoutBuilder-style APIs let you branch on available size. iOS reacts to trait collections (size class changes deliver traitCollectionDidChange / SwiftUI horizontalSizeClass environment) and UISplitViewController handles collapse/expand automatically. In both, the anti-pattern is hard-coding device types; the pattern is reacting to size classes derived from the live window.",
    "whatBreaks": "Designing to exact pixel widths breaks on the next device size and on resizable multitasking windows. Device sniffing (treating 'tablet' as one fixed layout) fails on foldables and split-view where the window is tablet-sized but narrow. Not recomputing layout when the window resizes leaves a stale phone layout in a large window. Losing selection/scroll/input state when switching between compact and expanded layouts frustrates users. Building two entirely separate UIs for phone and tablet doubles maintenance and drifts out of sync.",
    "efficientWay": {
      "title": "One Codebase, Many Form Factors",
      "approaches": [
        {
          "name": "React to window size classes with canonical adaptive patterns and a presentation-independent state layer",
          "verdict": "best",
          "reason": "One codebase adapts across phones, foldables, tablets, and multitasking windows, uses space meaningfully, and preserves state across layout switches."
        },
        {
          "name": "A single fluid/responsive layout that reflows but never restructures",
          "verdict": "ok",
          "reason": "Simple and works everywhere, but wide screens just get a stretched single column instead of a genuinely better multi-pane experience."
        },
        {
          "name": "Separate hard-coded layouts selected by device type (phone vs tablet)",
          "verdict": "weak",
          "reason": "Breaks on foldables and resizable windows that do not match device assumptions, and doubles the code you must keep in sync."
        }
      ],
      "recommendation": "Express layout decisions in terms of size classes derived from the live window, use the platform's canonical adaptive patterns (list-detail, adaptive navigation), and keep state in a layer independent of presentation so switching layouts is seamless. Never branch on device type."
    },
    "commonMistakes": [
      "Using exact pixel breakpoints or device sniffing instead of window size classes",
      "Not recomputing layout when the window resizes (multitasking, fold/unfold)",
      "Losing selection, scroll, or input state when switching between compact and expanded layouts",
      "Maintaining two separate phone/tablet UIs that drift out of sync"
    ],
    "seniorNotes": "The window, not the device, is the unit of adaptation — split-view and foldables decoupled them permanently, so size-class thinking is mandatory, not a nicety. Canonical patterns (list-detail, supporting pane, adaptive navigation) exist because teams kept reinventing them badly; prefer the platform scaffolds. Keep presentation separate from state so a size-class change is a re-layout, not a reset. Web/React responsive design taught the same lesson with CSS breakpoints and container queries, and Flutter (LayoutBuilder/MediaQuery) mirrors it, so the skill is portable.",
    "interviewQuestions": [
      "What is the difference between responsive and adaptive layout?",
      "Why react to size classes instead of device type or exact pixels?",
      "How do you keep one codebase working well from a small phone to a tablet?"
    ],
    "interviewAnswers": [
      "Responsive layout means the content fluidly resizes and reflows to fill the available space — for example a grid that shows more columns as it gets wider. Adaptive layout means the UI switches between distinct layouts at defined thresholds — for example a bottom navigation bar becoming a side rail on a wider screen. Responsive is continuous stretching and reflowing; adaptive is discrete restructuring at breakpoints. Real apps combine both.",
      "Because the window is no longer the device. Split-view multitasking, freeform windows, and foldables mean a device can present a window of almost any size that changes at runtime, so a 'tablet' can be showing a narrow window. Reacting to size classes derived from the live window makes the layout correct in all those cases, while device sniffing or fixed pixel breakpoints break as soon as the window does not match the assumption.",
      "I express every layout decision as a function of the current window's size class rather than device type, and use the canonical adaptive patterns — single pane in compact, list-detail in expanded, navigation that promotes from bottom bar to rail to drawer as width grows. I recompute layout when the window resizes, and I keep content and selection/scroll state in a layer independent of presentation so switching between compact and expanded layouts preserves state instead of resetting it."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Size-class-driven adaptive layout (pseudocode)",
        "code": "// derive buckets from the LIVE window, not the device\nfunction sizeClass(windowWidthDp):\n    if windowWidthDp < 600:  return COMPACT   // phone portrait\n    if windowWidthDp < 840:  return MEDIUM    // large phone / small tablet\n    return EXPANDED                            // tablet / unfolded / desktop\n\nfunction buildScreen(window, state):\n    switch sizeClass(window.widthDp):\n        case COMPACT:\n            navigation = BottomBar()\n            body = state.selected ? Detail(state.selected) : List(state.items)\n        case MEDIUM:\n            navigation = NavigationRail()\n            body = state.selected ? Detail(state.selected) : List(state.items)\n        case EXPANDED:\n            navigation = PermanentDrawer()\n            body = TwoPane(List(state.items), Detail(state.selected))\n    return Scaffold(navigation, body)\n\non windowResized:   // multitasking, fold/unfold, rotation\n    buildScreen(window, state)   // state (selection, scroll) preserved"
      }
    ],
    "resources": [
      {
        "label": "Material Design 3: Adaptive layouts",
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
    "id": "navigation-models",
    "phase": 3,
    "phaseName": "Adaptive UI, Navigation & Accessibility",
    "orderIndex": 3,
    "estimatedMins": 35,
    "prerequisites": [
      "screen-lifecycle"
    ],
    "title": "Navigation Models & the Back Stack",
    "eli5": "Apps have many screens, and you move between them. The app remembers the trail of screens you came through like a stack of cards — the newest on top. Going back pops the top card off to reveal the one underneath. There are a few standard ways to move around: pushing new cards, switching between tabs, sliding out a side menu, and popping up temporary sheets.",
    "analogy": "The back stack is a stack of plates: each screen you open puts a plate on top; pressing back lifts the top plate off to reveal the one below. Tabs are like several separate plate stacks side by side — switching tabs swaps which stack you are looking at. A modal is a tray held above the stack that you dismiss to return exactly where you were.",
    "explanation": "Navigation is how users move among an app's screens, and the central data structure is the back stack: an ordered history of destinations where the top entry is what you see. Pushing navigates forward (adds an entry); popping goes back (removes the top and reveals the previous). The common navigation patterns are: stack navigation (push/pop, the fundamental forward/back flow), tabs (several parallel sections, often each with its own back stack, that you switch between without losing each one's history), a navigation drawer (a slide-out menu for top-level destinations, common when there are more sections than fit in a tab bar), and modals/sheets (temporary screens presented over the current one for a focused task, dismissed to return exactly where you were). Deep, correct back-stack behavior is what makes navigation feel predictable: back should undo the last forward step and eventually exit, without surprising jumps or loops.\n\nA good navigation design keeps the back stack meaningful (each entry is a place the user chose to be), preserves per-tab history, and treats modals as interruptions that do not disturb the underlying stack. It also needs to survive process death and configuration changes by saving and restoring the stack.\n\nHow Android does it vs How iOS does it: Android has a system-level Back concept (the hardware/gesture Back button and the predictive back gesture) that pops the back stack and ultimately exits the app; the Navigation component manages the back stack and per-tab stacks. iOS has no global back button — navigation is typically a UINavigationController stack with a Back button in the top bar and an interactive swipe-from-left-edge gesture to pop; tab bars (UITabBarController) hold parallel stacks and modals are presented sheets. The back-stack model is shared; the trigger for 'back' differs (a system button vs an edge swipe).",
    "technicalDeep": "The back stack is a stack (LIFO) of destination entries, each of which may carry arguments and saved UI state. Push appends; pop removes the top; popTo a destination unwinds multiple entries. Tabbed apps typically keep an independent back stack per tab so switching tabs preserves each tab's position, plus a policy for what Back does at a tab's root (go to the start tab, or exit). Modals are usually modeled as a separate presentation on top of the current stack rather than a normal push, so dismissing them returns to the exact prior state without altering history. Well-designed navigation also handles: deep links that must synthesize a sensible back stack (so Back from a deep-linked screen goes somewhere reasonable), state restoration after process death (persist the stack and each entry's saved state), and single-top / launch behaviors to avoid duplicate copies of the same destination.\n\nGetting the back stack wrong produces classic bugs: Back that exits the app when the user expected to return to the previous screen, Back loops between two screens, lost scroll/form state on return, and duplicated destinations from repeated navigation. Declarative navigation frameworks increasingly model the whole stack as state (a list of destinations) so it is serializable and testable.\n\nCallout — How Android does it vs How iOS does it: Android routes the system Back event through the back stack (now with predictive back previewing the destination), supports per-tab stacks and deep-link stack synthesis via the Navigation component, and must save state across activity recreation. iOS relies on the navigation controller's stack and the interactive pop gesture with no OS-level back button, presents modals as sheets/full-screen covers separate from the stack, and uses state restoration to rebuild the stack. Both must reconstruct a coherent back stack for deep links and after being killed in the background.",
    "whatBreaks": "Mismanaging the back stack makes Back exit the app unexpectedly or bounce in a loop between screens. Losing per-tab history resets a tab to its root every time the user switches tabs. Treating a modal as a normal push corrupts history so dismissing it lands on the wrong screen. Failing to restore the stack after process death drops the user at the home screen mid-task. Navigating without single-top handling stacks duplicate copies of the same screen. Deep links that do not synthesize a back stack leave Back with nowhere sensible to go.",
    "efficientWay": {
      "title": "Predictable Navigation",
      "approaches": [
        {
          "name": "A single serializable back stack model with per-tab stacks, modals as separate presentations, and state restoration",
          "verdict": "best",
          "reason": "Back always undoes the last step, tab history is preserved, modals do not corrupt history, and the stack survives process death and deep links."
        },
        {
          "name": "Framework-managed navigation using defaults without customizing back or deep-link behavior",
          "verdict": "ok",
          "reason": "Correct for simple linear apps, but complex tab/modal/deep-link flows need explicit back-stack handling the defaults do not cover."
        },
        {
          "name": "Ad hoc screen swapping with manually tracked history flags",
          "verdict": "weak",
          "reason": "Hand-rolled history drifts out of sync, producing back loops, wrong-screen returns, and lost state — the most common navigation bug source."
        }
      ],
      "recommendation": "Model navigation as an explicit, serializable back stack (ideally per-tab), present modals as separate overlays rather than pushes, handle single-top to avoid duplicates, synthesize a sensible back stack for deep links, and persist/restore the stack so Back is always predictable and state survives being killed."
    },
    "commonMistakes": [
      "Corrupting history so Back exits the app or loops between two screens",
      "Not keeping a separate back stack per tab, resetting tabs to root on every switch",
      "Modeling modals as normal pushes so dismissing them lands on the wrong screen",
      "Failing to restore the back stack after process death or to synthesize one for deep links"
    ],
    "seniorNotes": "Treat the back stack as first-class serializable state — that makes navigation testable, restorable after process death, and correct for deep links. The hardest cases are always tabs-with-history and deep-link stack synthesis; design those explicitly rather than relying on defaults. The Android system Back vs iOS edge-swipe difference is a UX contract: Android users expect Back to eventually exit, iOS users expect a top-bar Back and edge swipe, so cross-platform apps must honor each. This model is universal — Flutter's Navigator 2.0 (a pages list as state) and React Navigation's stack/tab/modal navigators express the same back-stack concepts.",
    "interviewQuestions": [
      "What is the back stack and how do push/pop relate to it?",
      "How should tabs and modals interact with the back stack?",
      "How does Android's Back button model differ from iOS navigation, and why does it matter?"
    ],
    "interviewAnswers": [
      "The back stack is an ordered LIFO history of the destinations the user has visited, with the top entry being the currently visible screen. Navigating forward pushes a new entry onto the stack; going back pops the top entry off and reveals the previous one. popTo unwinds several entries at once. Because it is a stack, Back naturally undoes the most recent forward step and eventually empties to exit, which is what makes navigation feel predictable.",
      "Tabs should each keep an independent back stack so switching tabs preserves where the user was in each section rather than resetting to its root, plus a defined policy for what Back does at a tab root. Modals should be modeled as a separate presentation layered over the current stack, not as a normal push, so dismissing a modal returns to the exact previous state without altering the underlying history. Mixing these up causes tabs to reset and modals to land the user on the wrong screen.",
      "Android has a system-level Back (a button or predictive gesture) that pops the back stack and ultimately exits the app, so users expect Back to always work and eventually leave. iOS has no global back button — it uses a Back control in the top bar plus an interactive swipe from the left edge to pop the navigation stack. It matters because the 'go back' trigger and user expectations differ: a cross-platform app must route Android's system Back through its stack and provide iOS's top-bar Back and edge-swipe, or navigation will feel broken to users on one platform."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Back stack operations and per-tab history (pseudocode)",
        "code": "// per-tab back stacks + a modal overlay\ntabs = {\n    home:    [ Screen(\"HomeRoot\") ],      // top = last element\n    search:  [ Screen(\"SearchRoot\") ],\n}\ncurrentTab = \"home\"\nmodal = null\n\nfunction navigate(destination):\n    tabs[currentTab].push(destination)     // forward\n\nfunction back():\n    if modal != null:\n        modal = null                       // dismiss overlay first\n        return CONSUMED\n    stack = tabs[currentTab]\n    if stack.size > 1:\n        stack.pop()                        // reveal previous screen\n        return CONSUMED\n    if currentTab != \"home\":\n        currentTab = \"home\"                // back-to-start policy\n        return CONSUMED\n    return NOT_CONSUMED                     // let system exit the app\n\nfunction present(sheet):  modal = sheet    // modal != push\nfunction switchTab(t):    currentTab = t   // preserves each history\n\n// deep link: synthesize a sensible stack, don't just jump\nfunction openDeepLink(item):\n    tabs[\"home\"] = [ Screen(\"HomeRoot\"), Detail(item) ]\n    currentTab = \"home\"   // Back now returns to HomeRoot"
      }
    ],
    "resources": [
      {
        "label": "Material Design 3: Navigation",
        "url": "https://m3.material.io/",
        "kind": "docs"
      },
      {
        "label": "Apple Human Interface Guidelines: Navigation",
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
    "id": "deep-linking-mobile",
    "phase": 3,
    "phaseName": "Adaptive UI, Navigation & Accessibility",
    "orderIndex": 4,
    "estimatedMins": 35,
    "prerequisites": [
      "navigation-models"
    ],
    "title": "Deep Links, Universal & App Links",
    "eli5": "A deep link is a link that opens a specific screen inside an app instead of just launching its home page — like a link that jumps straight to one product. Some links use a made-up address only your app understands, and some use a normal web address that the phone knows belongs to your app, so tapping it opens the app right on the matching page.",
    "analogy": "A normal app launch is walking into a building's front door. A deep link is a hallway sign that takes a visitor straight to room 412. A custom-scheme link is a private code word only your building's staff recognize; a verified https link is like the building being officially listed at a street address, so the city's map app knows that address belongs to you and routes visitors directly inside instead of to a lookalike.",
    "explanation": "Deep linking lets an external trigger (a tapped URL, a notification, another app) open a specific destination inside your app rather than its default landing screen. There are two broad kinds. Custom-scheme links use a made-up URL scheme like myapp://product/42 that only your app registers; they are simple but insecure and fragile — any app can claim the same scheme, and if the app is not installed the link just fails. Verified web links use ordinary https URLs (https://example.com/product/42) that are cryptographically associated with your app, so the OS knows that domain belongs to you and opens the app directly on the matching screen (falling back to the website in the browser if the app is not installed). Android calls these App Links and iOS calls them Universal Links; both rely on a signed association file hosted on your website that the OS verifies.\n\nA correct deep-link implementation must parse the incoming URL into a destination plus parameters, then place the user there while building a sensible back stack (so Back goes somewhere reasonable). It must also handle two runtime states: cold start (the app was not running and must launch, initialize, and route to the destination) and warm/running (the app is already open and must route to the destination in place, ideally without losing current state).\n\nHow Android does it vs How iOS does it: Android uses App Links — an intent filter for your https domain plus a Digital Asset Links JSON file at /.well-known/assetlinks.json that the OS verifies to open links without a chooser; custom schemes still work but are unverified. iOS uses Universal Links — an associated domains entitlement plus an apple-app-site-association file that the OS checks to route the https URL into your app; custom URL schemes exist but are unverified and can be hijacked. Both verify domain ownership via a hosted association file.",
    "technicalDeep": "Verified links solve the trust and fallback problems of custom schemes. Ownership is proven by hosting a signed/served association file (Android assetlinks.json, iOS apple-app-site-association) at a well-known path on the exact domain; the OS fetches and verifies it so that only your app can claim your https URLs and there is no app-chooser prompt. If the app is not installed, the same URL simply opens in the browser — graceful degradation that custom schemes cannot offer.\n\nRouting has to handle process state. On cold start the URL arrives as part of the launch, so you must defer routing until core initialization/auth is ready, then build a back stack (often synthesizing parent destinations so Back is sensible). On warm start the app receives the URL via a callback while already running and should navigate in place. Robust implementations centralize URL parsing (a single router that maps paths to destinations + params), validate and sanitize parameters (never trust link input), and gate destinations that require auth (route to login, then continue to the target). Related concepts: deferred deep links (preserve the destination through an install so a newly installed app can route to it) and link attribution.\n\nCallout — How Android does it vs How iOS does it: Android declares intent filters with autoVerify for the domain and serves assetlinks.json; verification can be checked with the App Links tooling, and unverified http(s) or custom schemes fall back to a chooser or the browser. iOS declares associated domains (applinks:example.com) and serves apple-app-site-association (no file extension, served over https, JSON) that lists paths your app handles; the system routes matching URLs to your app delegate. Both must still parse the URL and construct a coherent back stack once the OS hands the link to the app.",
    "whatBreaks": "Relying on custom schemes lets another app hijack your links and gives no fallback when the app is not installed. A missing, misplaced, or malformed association file makes verified links silently open the website instead of the app. Not handling cold start routes the user to the home screen instead of the linked destination, or crashes because the app tried to navigate before initialization. Not synthesizing a back stack leaves Back with nowhere to go. Trusting link parameters without validation opens injection and unauthorized-access bugs. Ignoring auth-gated destinations dumps unauthenticated users onto protected screens.",
    "efficientWay": {
      "title": "Robust Deep Linking",
      "approaches": [
        {
          "name": "Verified https App/Universal Links via a hosted association file, with a central router, back-stack synthesis, and cold/warm handling",
          "verdict": "best",
          "reason": "Only your app can claim your URLs, links degrade gracefully to the website, and users always land on the right screen with a sensible Back — in every launch state."
        },
        {
          "name": "Verified links for the main flows plus custom schemes for internal-only navigation",
          "verdict": "ok",
          "reason": "Reasonable when custom schemes are used strictly inside your own ecosystem, but any externally shareable link should be a verified https link."
        },
        {
          "name": "Custom-scheme links only, routed without back-stack or cold-start handling",
          "verdict": "weak",
          "reason": "Hijackable, no install fallback, and users frequently land on the home screen or with a broken Back — the fragile classic approach."
        }
      ],
      "recommendation": "Use verified https links (App Links / Universal Links) backed by a correctly hosted association file for anything users can share. Centralize URL parsing in one router, validate parameters, synthesize a coherent back stack, gate auth-required destinations, and explicitly handle both cold-start and already-running cases."
    },
    "commonMistakes": [
      "Using custom schemes for shareable links, exposing them to hijacking with no install fallback",
      "A missing or malformed association file so verified links silently open the website instead of the app",
      "Not handling cold start, landing the user on home or crashing before initialization completes",
      "Trusting link parameters without validation, or dropping unauthenticated users onto protected screens"
    ],
    "seniorNotes": "Verified links are as much a web-ops task as an app task: the association file must be served correctly over https on the exact domain(s), and a broken deploy silently downgrades every link to the browser, so monitor it. Centralize routing so URL-to-destination mapping is testable and consistent, and always design the synthesized back stack. Cold vs warm start is the perennial bug source — test both. The model is cross-platform: Flutter (app_links/uni_links, GoRouter deep-link parsing) and React Native (Linking + verified domains) implement the same custom-scheme-vs-verified-https distinction and the same cold/warm routing.",
    "interviewQuestions": [
      "What is the difference between a custom-scheme deep link and a verified App/Universal Link?",
      "Why do verified links require a file hosted on your website?",
      "How does deep-link handling differ between cold start and an already-running app?"
    ],
    "interviewAnswers": [
      "A custom-scheme link uses a made-up scheme like myapp://product/42 that only your app registers; it is simple but any app can claim the same scheme and there is no fallback if your app is not installed. A verified App Link (Android) or Universal Link (iOS) uses an ordinary https URL that is cryptographically associated with your app via a file hosted on your domain, so the OS knows the domain belongs to you and opens the app directly on the matching screen — and gracefully opens the website in the browser if the app is not installed. Verified links are secure and degrade gracefully; custom schemes are neither.",
      "Because the OS needs proof that you actually own the domain before it will route that domain's https URLs into your app instead of the browser. You demonstrate ownership by serving a signed/known association file (Android assetlinks.json, iOS apple-app-site-association) at a well-known path on the exact domain; the OS fetches and verifies it. This prevents another app from claiming your URLs, which is exactly the hijacking weakness that custom schemes have.",
      "On cold start the app was not running, so the URL arrives as part of launch and you must wait until core initialization and auth are ready before routing, then build a back stack so Back is sensible — routing too early can crash or land on the home screen. When the app is already running, it receives the URL via a callback and should navigate in place to the destination, ideally without discarding current state. Both paths should funnel through the same central router, but they are triggered differently and cold start needs the extra deferral until the app is ready."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Central deep-link router with cold/warm handling (pseudocode)",
        "code": "// association file proves domain ownership to the OS:\n//   Android: https://example.com/.well-known/assetlinks.json\n//   iOS:     https://example.com/.well-known/apple-app-site-association\n\nfunction routeUrl(url, isColdStart):\n    dest = parse(url)          // ONE parser: path -> destination + params\n    if dest == null:\n        return openFallback(url)          // unknown -> home or website\n\n    validate(dest.params)                  // never trust link input\n\n    if dest.requiresAuth and not loggedIn:\n        pendingDeepLink = dest             // continue after login\n        return goToLogin()\n\n    if isColdStart and not appInitialized:\n        pendingDeepLink = dest             // defer until ready\n        return\n\n    // synthesize a sensible back stack, then land the user\n    setBackStack([ Home(), parentOf(dest), dest ])\n\non appLaunchedWithUrl(url):   routeUrl(url, isColdStart = true)\non urlReceivedWhileRunning(url): routeUrl(url, isColdStart = false)\non appInitialized(): if pendingDeepLink: routeUrl(pendingDeepLink.url, false)"
      }
    ],
    "resources": [
      {
        "label": "Android: App Links",
        "url": "https://developer.android.com/training/app-links",
        "kind": "docs"
      },
      {
        "label": "iOS: Universal Links (Allowing apps and websites to link to your content)",
        "url": "https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content",
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
    "id": "mobile-accessibility",
    "phase": 3,
    "phaseName": "Adaptive UI, Navigation & Accessibility",
    "orderIndex": 5,
    "estimatedMins": 40,
    "prerequisites": [
      "imperative-vs-declarative-ui"
    ],
    "title": "Accessibility on Mobile",
    "eli5": "Not everyone sees, hears, or taps the screen the same way. Some people listen to the screen with a voice that reads everything aloud, some make the text huge, some cannot tap tiny buttons. Building for accessibility means giving every button a name the voice can read, letting text grow, keeping enough color contrast, and making tap targets big enough.",
    "analogy": "Accessibility is like adding ramps, braille signs, and clear announcements to a building. The building still works for everyone who used the stairs, but now people using a wheelchair, who are blind, or who are hard of hearing can also get around. In an app, the screen reader is the braille sign and audio announcement, dynamic type is the large-print edition, and big touch targets are the wide, easy-to-open doors.",
    "explanation": "Accessibility (a11y) means people with disabilities can perceive, understand, and operate your app. The main areas on mobile are: screen readers, which let blind and low-vision users navigate by having the UI read aloud and activated by gestures — this requires every meaningful element to expose a text label, a role (button, heading, image), and its state (selected, disabled, checked). Focus order matters: the screen reader moves through elements in a sequence, and that order must be logical (top-to-bottom, following reading order), not random. Dynamic type / scalable text lets users enlarge fonts system-wide, so your layouts must grow gracefully instead of clipping. Color contrast between text and background must be high enough to read for low-vision and color-blind users, and color must never be the only signal (pair it with text or icons). Touch target size must be large enough (a widely used minimum is around 44-48 logical units) so users with motor differences can hit controls. Additional concerns include captions for media, reduced-motion preferences, and not relying solely on hearing or fine gestures.\n\nThe unifying idea is semantics: the visual UI is only half the story; you must also expose a parallel semantic description (labels, roles, states, grouping, and actions) that assistive technologies consume. Decorative elements should be hidden from assistive tech so they do not add noise.\n\nHow Android does it vs How iOS does it: Android's screen reader is TalkBack; you expose semantics via contentDescription, roles, and state, group related nodes, and mark decorative views as not-important-for-accessibility; text scales via sp and the font-size setting. iOS's screen reader is VoiceOver; you expose semantics via accessibilityLabel, accessibilityTraits (button, header, selected), and accessibilityValue, control order with accessibility elements, and support Dynamic Type for scalable text. Both provide accessibility inspectors/scanners to audit your screens.",
    "technicalDeep": "Assistive tech builds an accessibility tree parallel to the visual tree. Each node should expose: a label (what it is / says), a role/trait (button, header, image, adjustable), a value/state (on/off, selected, 50%), and available actions (activate, increment, custom actions). Screen-reader navigation is linear or by rotor/gesture, so focus order and logical grouping are essential — related elements (an icon plus its label) should be merged into one focusable node rather than read as fragments, and dynamic changes should announce via live regions/announcements so users are not left behind after content updates. Dynamic type support means using text styles that scale and testing at the largest sizes; layouts must reflow (wrap, allow multiple lines, avoid fixed heights around text). Contrast follows WCAG-style ratios (commonly 4.5:1 for normal text, 3:1 for large text) and must not depend on color alone. Touch targets have platform minimums; small visual controls can still expose a larger hit area.\n\nCommon deep issues: custom-drawn controls that expose no semantics (invisible to screen readers), images of text (unreadable and non-scaling), focus traps in modals, and animations that trigger vestibular discomfort (honor reduce-motion). Accessibility overlaps heavily with earlier topics — dynamic type is the text-scaling axis from density independence, and reflow depends on the layout system handling growth.\n\nCallout — How Android does it vs How iOS does it: Android exposes semantics through the accessibility node tree (contentDescription, stateDescription, roles, mergeDescendants/grouping) and announces changes via live regions; audit with Accessibility Scanner and TalkBack. iOS exposes them through the accessibility API (accessibilityLabel/Value/Traits, accessibilityElements ordering, UIAccessibility.post announcements) and supports Dynamic Type and reduce-motion; audit with the Accessibility Inspector and VoiceOver. The semantics-tree model and the checklist (labels, roles, states, order, contrast, scalable text, target size) are identical.",
    "whatBreaks": "Custom controls with no exposed semantics are invisible or unusable to screen-reader users. Missing or wrong labels make VoiceOver/TalkBack read 'button, button' or the raw resource id. Illogical focus order makes navigation confusing and can trap focus inside a modal. Hard-coded font sizes and fixed-height containers clip when dynamic type is enlarged. Low contrast or color-only signaling (red/green with no text) excludes low-vision and color-blind users. Touch targets below the minimum are hard or impossible to hit. Motion-heavy UI without a reduce-motion path causes discomfort. Not announcing dynamic updates leaves screen-reader users unaware content changed.",
    "efficientWay": {
      "title": "Building Accessible Screens",
      "approaches": [
        {
          "name": "Expose full semantics (labels, roles, states, order, grouping), support dynamic type and reduce-motion, meet contrast and target-size minimums, and audit with the platform tools",
          "verdict": "best",
          "reason": "Works for screen-reader, low-vision, color-blind, and motor-impaired users, scales with system settings, and is verified rather than assumed."
        },
        {
          "name": "Use standard platform components (which carry built-in semantics) and add labels to custom bits",
          "verdict": "ok",
          "reason": "Standard controls get you most semantics, scaling, and target sizes for free, but custom controls and dynamic announcements still need explicit work."
        },
        {
          "name": "Ship visual-only UI and add accessibility later if someone complains",
          "verdict": "weak",
          "reason": "Custom controls end up invisible to screen readers, text clips at large sizes, and retrofitting a11y late is far more expensive and often incomplete."
        }
      ],
      "recommendation": "Design semantics alongside visuals: give every meaningful element a label, role, and state; ensure logical focus order and group related nodes; support dynamic type and reduce-motion; meet contrast and touch-target minimums; and audit every screen with the platform's screen reader and accessibility scanner before shipping."
    },
    "commonMistakes": [
      "Custom-drawn controls that expose no label/role/state, making them invisible to TalkBack/VoiceOver",
      "Hard-coded font sizes and fixed-height containers that clip when dynamic type is enlarged",
      "Using color alone (red/green) to convey state, excluding color-blind and low-vision users",
      "Touch targets smaller than the ~44-48 unit minimum, or illogical/ trapped focus order"
    ],
    "seniorNotes": "Accessibility is a semantics problem, not a cosmetic one: the fix is exposing labels/roles/states and logical order, which also makes UI automatable and testable. Standard components carry most of this for free, so favor them and reserve custom controls for when you will do the semantics work. Dynamic type is the same text-scaling axis from density independence, so accessible layout and adaptive layout reinforce each other. It is also increasingly a legal requirement (WCAG/ADA/EAA). The concepts port directly to Flutter (Semantics widget, MediaQuery textScaler/reduceMotion) and React Native (accessibilityLabel/Role/State), so the checklist is universal.",
    "interviewQuestions": [
      "What information must a UI element expose for a screen reader to be usable?",
      "Why must you support dynamic type, and what breaks if you do not?",
      "Why is color alone an insufficient way to convey state, and what are the touch-target and contrast rules of thumb?"
    ],
    "interviewAnswers": [
      "Each meaningful element must expose a label (what it is or says), a role or trait (button, heading, image, adjustable), and its state or value (selected, disabled, checked, 50%), plus any available actions. It also needs a logical position in the focus order and, where appropriate, grouping so related pieces (an icon and its text) are read as one node rather than fragments. Without these, the screen reader either skips the element or reads something meaningless like 'button, button', making the app unusable for blind and low-vision users.",
      "Because low-vision users enlarge the system font, and your app must honor that so text they need to read is actually readable. If you support it, layouts grow gracefully — text wraps, containers expand, nothing clips. If you do not — hard-coded font sizes or fixed-height containers around text — the enlarged text overflows, truncates, or overlaps, so the very users who increased the font can no longer read the content. Dynamic type is the same text-scaling axis as density independence, applied for accessibility.",
      "Color alone excludes color-blind users and is hard to distinguish for some low-vision users, so state must also be conveyed with text, an icon, or shape — color can reinforce but never be the sole signal. Rules of thumb: contrast of about 4.5:1 for normal text and 3:1 for large text (WCAG), and touch targets of roughly 44-48 logical units minimum so users with motor differences can reliably hit them (a small visual control can still expose a larger hit area)."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Exposing semantics and honoring settings (pseudocode)",
        "code": "// visual tree has a parallel SEMANTICS tree for assistive tech\nfavoriteButton = IconButton(icon = heartIcon) {\n    semantics {\n        label = isFav ? \"Remove from favorites\" : \"Add to favorites\"\n        role  = BUTTON\n        state = { selected: isFav }        // announce on/off\n        onActivate = toggleFavorite\n    }\n    minTouchTarget = 48   // logical units, even if icon is small\n}\n\n// group related nodes so they read as ONE focusable item\nrow = Group(merge = true) { Icon(star); Text(\"4.8 rating\") }\n\n// decorative-only -> hide from screen reader (reduce noise)\nbackgroundSwirl.importantForAccessibility = false\n\n// honor system settings\ntext.size = baseSize * system.fontScale     // dynamic type\nif system.reduceMotion: useCrossfade() else useSlide()\n\n// don't rely on color alone: pair with icon + text\nstatusBadge = Row(errorIcon, Text(\"Failed\"), color = red)\n\n// announce dynamic changes so users aren't left behind\non itemsLoaded: announce(\"Loaded \" + count + \" results\")"
      }
    ],
    "resources": [
      {
        "label": "Android: Accessibility",
        "url": "https://developer.android.com/guide/topics/ui/accessibility",
        "kind": "docs"
      },
      {
        "label": "Apple: Accessibility",
        "url": "https://developer.apple.com/accessibility/",
        "kind": "docs"
      },
      {
        "label": "Material Design 3: Accessibility",
        "url": "https://m3.material.io/",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "i18n-rtl",
    "phase": 3,
    "phaseName": "Adaptive UI, Navigation & Accessibility",
    "orderIndex": 6,
    "estimatedMins": 35,
    "prerequisites": [
      "responsive-adaptive-layout"
    ],
    "title": "Internationalization & RTL",
    "eli5": "People around the world read in different languages, some from right to left, and write dates, numbers, and money differently. Instead of gluing English text into your screens, you keep all the words in a separate list so they can be translated, and you let the layout flip for languages like Arabic that read right to left.",
    "analogy": "Internationalization is like building a stage set with removable signs instead of painting the words on the walls. You can swap the English signs for Arabic or Japanese ones without rebuilding the set, and for right-to-left languages you mirror the whole stage so the entrance is on the other side — everything the audience expects to be 'first' is now on the right.",
    "explanation": "Internationalization (i18n) is designing your app so it can be adapted to different languages and regions without code changes; localization (l10n) is the actual adaptation for a specific locale. The foundations are: externalizing strings — never hard-code user-facing text; store it in resource files keyed by locale so translators can supply each language. Pluralization — languages have different plural rules (some have one plural form, some have several), so you use plural-aware formatting rather than gluing an 's' onto words. Right-to-left (RTL) support — languages like Arabic, Hebrew, and Persian read right to left, so the layout must mirror: navigation, back arrows, alignment, and reading order flip horizontally, while things like phone numbers and embedded media stay as-is. Formatting — dates, times, numbers, currencies, and units differ by locale (decimal separators, date order, currency symbols and placement), so you format via locale-aware APIs instead of manual string building. A locale (language + region, e.g. en-US, ar-EG) drives all of this.\n\nThe core discipline is separating content and formatting rules from layout and logic. Text length also varies dramatically between languages (German can be much longer than English), so layouts must tolerate expansion. Getting i18n right from the start is far cheaper than retrofitting.\n\nHow Android does it vs How iOS does it: Android stores strings in per-locale res/values-<lang>/strings.xml, uses plurals resources for quantity strings, enables RTL with supportsRtl and start/end (instead of left/right) attributes so layouts auto-mirror, and formats via locale-aware classes. iOS stores strings in localized string catalogs/.strings files, uses stringsdict/automatic grammar for plurals, mirrors layout automatically via leading/trailing constraints and the semantic content attribute for RTL, and formats dates/numbers/currency with locale-aware formatters. Both auto-mirror when you use start/end (leading/trailing) rather than hard-coded left/right.",
    "technicalDeep": "String externalization uses locale-qualified resource lookup: the system picks the best matching resource for the user's locale with a fallback chain (ar-EG -> ar -> default). Interpolation must be locale-safe: use positional/named placeholders because word order changes between languages, and never concatenate sentence fragments. Pluralization uses CLDR plural categories (zero/one/two/few/many/other) which vary per language; plural-aware APIs select the right form for the count. RTL mirroring is driven by using start/end (leading/trailing) instead of left/right for padding, alignment, and constraints, plus mirroring directional icons (a back chevron flips) while leaving non-directional and inherently-LTR content (numbers, code, media controls sometimes) unmirrored; bidirectional text (Arabic with embedded Latin/numbers) is handled by the Unicode bidi algorithm. Formatting relies on locale data: number grouping and decimal separators, date field order and names, currency symbol and position, and measurement units all come from the locale, so you pass values through formatters rather than building strings.\n\nDeeper concerns: text expansion (design flexible layouts and avoid fixed-width text containers), font/script coverage (ensure fonts support the target scripts, including complex shaping for Arabic/Indic), sorting/collation (locale-aware comparison), and input (keyboards, IME). This ties back to adaptive layout — expansion and mirroring are layout-flexibility requirements.\n\nCallout — How Android does it vs How iOS does it: Android resolves strings.xml by locale qualifier with fallback, uses <plurals> with quantity, auto-mirrors when you use layoutDirection start/end and set autoMirrored on directional drawables, and formats via locale-aware formatters. iOS resolves localized resources by preferred-language order, uses stringsdict plural rules, auto-mirrors with leading/trailing and semanticContentAttribute, flips SF Symbols marked as directional, and formats via locale-aware formatters. Both follow CLDR/Unicode standards under the hood, so the concepts transfer.",
    "whatBreaks": "Hard-coded strings cannot be translated and leak English into every locale. Concatenating sentence fragments produces broken grammar in languages with different word order. Appending 's' for plurals is wrong in most languages. Using left/right instead of start/end leaves layouts unmirrored in RTL so navigation and alignment point the wrong way, and un-mirrored directional icons confuse users. Manual date/number/currency formatting shows the wrong separators, order, or currency for the locale. Fixed-width text containers clip longer translations. Missing font/script coverage renders boxes or broken shaping. Assuming the device language is the region breaks formatting (an English speaker in France expects euros and day-month order).",
    "efficientWay": {
      "title": "Internationalizing Correctly",
      "approaches": [
        {
          "name": "Externalize all strings with placeholders, use plural-aware and locale-aware formatting, and lay out with start/end so RTL auto-mirrors",
          "verdict": "best",
          "reason": "Any locale can be added by supplying translations, grammar and plurals stay correct, formatting matches the region, and RTL works without a separate layout."
        },
        {
          "name": "Externalized strings and locale formatting but left/right layout patched per-screen for RTL",
          "verdict": "ok",
          "reason": "Text and formatting are correct, but manually patching mirroring per screen is error-prone and easy to miss; start/end would auto-mirror everything."
        },
        {
          "name": "Hard-coded English strings, manual formatting, and left/right layout, localized later",
          "verdict": "weak",
          "reason": "Nothing can be translated or mirrored without rework, grammar and formatting are wrong per locale, and retrofitting i18n across a built app is expensive."
        }
      ],
      "recommendation": "Externalize every user-facing string with positional placeholders, use plural-aware formatting and locale-aware date/number/currency formatters, and build layouts with start/end (leading/trailing) so RTL mirrors automatically. Design for text expansion and verify script/font coverage. Bake i18n in from day one rather than retrofitting."
    },
    "commonMistakes": [
      "Hard-coding user-facing strings so they cannot be translated",
      "Concatenating sentence fragments or appending 's' for plurals, breaking grammar across languages",
      "Using left/right instead of start/end so layouts and directional icons do not mirror in RTL",
      "Manually formatting dates/numbers/currency instead of using locale-aware formatters"
    ],
    "seniorNotes": "i18n is architectural, not a translation step at the end: externalized strings with placeholders, plural rules, locale formatting, and start/end layout must be designed in, because retrofitting them touches every screen. RTL is the highest-leverage test — if you use start/end and locale formatters consistently, enabling RTL exposes most mirroring and hard-coding bugs at once, so test in a pseudo-locale and in Arabic/Hebrew early. Watch text expansion and script/font coverage. The model is standardized (CLDR/Unicode) and portable: Flutter (intl, MaterialLocalizations, Directionality) and React Native (i18n libs, I18nManager.isRTL) implement the same concepts.",
    "interviewQuestions": [
      "What is the difference between internationalization and localization, and what does externalizing strings mean?",
      "Why is appending 's' for plurals and concatenating sentence fragments wrong?",
      "How do you support RTL layouts, and what should and should not be mirrored?"
    ],
    "interviewAnswers": [
      "Internationalization (i18n) is designing the app so it can be adapted to any language or region without code changes; localization (l10n) is the actual adaptation for a specific locale, like supplying Arabic translations and Egyptian formatting. Externalizing strings means never hard-coding user-facing text in code — instead you store it in per-locale resource files keyed by a string id, so translators can provide each language and the system picks the right one for the user's locale with a fallback chain.",
      "Because languages differ. Plural rules vary — many languages have several plural forms (not just singular and 's'), and some inflect differently for 2, few, or many — so appending 's' is grammatically wrong almost everywhere except English; you use plural-aware formatting that selects the correct form for the count. Concatenating fragments is wrong because word order changes between languages, so a sentence assembled from pieces in English order becomes ungrammatical when translated. You use whole strings with positional placeholders so translators can reorder as their grammar requires.",
      "You support RTL by laying out with start/end (leading/trailing) instead of left/right for padding, alignment, and constraints, so the framework mirrors the layout automatically for right-to-left locales — navigation, alignment, and reading order flip. You mirror directional icons like back arrows and chevrons. What you do not mirror is content that is inherently left-to-right or non-directional: numbers, phone numbers, code, and typically media playback controls, plus embedded Latin text within Arabic (handled by the Unicode bidi algorithm). The rule of thumb is: mirror the chrome and directional affordances, preserve inherently-directional content."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Externalized strings, plurals, RTL, and formatting (pseudocode)",
        "code": "// 1. Externalize strings, keyed by locale, with placeholders\n// strings(en): greeting = \"Hello, {name}\"\n// strings(ar): greeting = \"{name}، مرحبا\"   // word order differs!\ntext = t(\"greeting\", name = user.name)   // never concatenate\n\n// 2. Plurals: pick the right form for the count + locale\n// en: { one: \"{n} item\", other: \"{n} items\" }\n// ar: has zero/one/two/few/many/other forms\nlabel = plural(\"items\", count = n, locale = current)\n\n// 3. RTL: use START/END, not LEFT/RIGHT -> auto-mirrors\nrow.padding = { start: 16, end: 8 }      // flips in RTL\nbackIcon.autoMirrored = true             // chevron flips\nphoneNumber.direction = LTR              // do NOT mirror numbers\n\n// 4. Locale-aware formatting (never build these by hand)\nprice = formatCurrency(1234.5, locale = \"de-DE\")  // 1.234,50 €\ndate  = formatDate(now, locale = \"en-GB\")         // 07/07/2026\nnum   = formatNumber(1000000, locale = \"en-IN\")   // 10,00,000\n\n// 5. Design for text expansion; verify the font covers the script"
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
    "id": "design-systems-mobile",
    "phase": 3,
    "phaseName": "Adaptive UI, Navigation & Accessibility",
    "orderIndex": 7,
    "estimatedMins": 35,
    "prerequisites": [
      "responsive-adaptive-layout",
      "mobile-accessibility"
    ],
    "title": "Design Systems & Theming",
    "eli5": "A design system is a shared kit of parts — colors, fonts, spacing, and ready-made buttons — so every screen looks like it belongs to the same app. Theming means you can flip the whole app between light and dark, or swap the brand colors, by changing the kit once instead of editing every screen. And each phone platform has its own house style you should respect.",
    "analogy": "A design system is like a LEGO set with a fixed palette of bricks and instructions: everyone builds with the same pieces, so the results are consistent. Design tokens are the labeled bins of bricks (this bin is 'primary color', this one is 'medium spacing'); theming is swapping the whole set of bins for a night-time palette. Following the platform's house style is like building in the local architectural style so the house fits the neighborhood.",
    "explanation": "A design system is a single source of truth for how an app looks and behaves: a coordinated set of design tokens (named values for color, typography, spacing, shape, elevation), reusable components (buttons, inputs, cards) built from those tokens, and usage guidelines. It exists so screens are consistent, faster to build, and cheap to restyle. Design tokens are the key mechanism — instead of hard-coding a hex color or a pixel size in each screen, you reference a semantic token (colorPrimary, spacingMedium, textBody) and define its value in one place. Theming is changing the token values to restyle the whole app at once: the most common case is light/dark theming (swap the color tokens for a dark palette so every component follows), but tokens also enable brand theming and high-contrast variants.\n\nMobile also has strong platform conventions. The two dominant systems are Material Design (Google's system, the default idiom on Android) and Apple's Human Interface Guidelines (the idiom on iOS). They differ in navigation patterns, typography, component shapes, motion, and controls. Respecting the platform's conventions makes an app feel native and predictable; ignoring them makes it feel foreign. Cross-platform apps must decide how much to adopt a unified brand look versus platform-native behavior.\n\nHow Android does it vs How iOS does it: Android follows Material Design 3, with a token-based color system (including dynamic color), Material components, and Material theming for light/dark; the platform provides a coherent component library and motion system. iOS follows Apple's Human Interface Guidelines, with system typography (San Francisco / Dynamic Type), system colors that adapt to light/dark automatically, SF Symbols, and standard UIKit/SwiftUI controls; light/dark is a first-class system trait. Both give you semantic, theme-adaptive color and type systems so you build against tokens rather than raw values.",
    "technicalDeep": "Tokens are usually layered: primitive tokens (raw palette values like blue-500), semantic/alias tokens (colorPrimary, colorSurface, colorOnSurface) that map to primitives per theme, and sometimes component tokens (buttonBackground) mapping to semantics. This indirection is what makes theming cheap: light and dark themes redefine the semantic layer while components only ever reference semantic tokens, so switching themes recolors everything without touching component code. Dark theme is more than inverting colors — you design a separate dark palette (often desaturated, with elevation conveyed by surface tint rather than shadow) and must maintain contrast in both. Themes must respond at runtime to the system light/dark setting and to user overrides.\n\nComponents encapsulate both look and behavior (states, accessibility semantics, touch feedback), so building from a shared component library propagates fixes and consistency everywhere. This ties into accessibility (components carry correct semantics and honor dynamic type) and adaptive layout (components adapt to size classes). Platform-convention decisions are architectural for cross-platform teams: fully native per platform (best fit, more work), a shared brand system approximated on both, or one look everywhere (consistent brand, less native feel). Motion, haptics, and iconography are part of the system too.\n\nCallout — How Android does it vs How iOS does it: Material 3 formalizes tokens (color roles, type scale, shape, elevation) and supports dynamic color derived from the wallpaper; light/dark are theme variants of the same token set. Apple's HIG leans on system-provided semantic colors and materials that adapt to appearance automatically, San Francisco type with Dynamic Type, and SF Symbols that match the system weight — so much theming is 'use the system semantics and it adapts for free'. Both converge on: reference semantic, theme-adaptive tokens instead of raw values, and follow the platform's component and motion conventions.",
    "whatBreaks": "Hard-coding raw colors and sizes in each screen makes restyling and dark mode a massive manual edit and causes inconsistency (slightly different blues everywhere). A dark theme built by naive inversion produces poor contrast and muddy colors. Not responding to the system light/dark setting at runtime leaves the app mismatched with the OS. Ignoring platform conventions (an iOS app that looks like Android or vice versa) feels foreign and confuses users. Rebuilding components ad hoc per screen instead of sharing them fragments behavior and accessibility. Tokens that skip the semantic layer (components referencing primitive palette values directly) break themeability.",
    "efficientWay": {
      "title": "Consistent, Themeable UI",
      "approaches": [
        {
          "name": "Semantic design tokens with a shared component library, runtime light/dark theming, respecting platform conventions",
          "verdict": "best",
          "reason": "One change restyles the whole app, dark mode and brand variants come from swapping token values, components stay consistent and accessible, and the app feels native on each platform."
        },
        {
          "name": "A shared component library and tokens but a single cross-platform look on both platforms",
          "verdict": "ok",
          "reason": "Consistent and maintainable with strong brand identity, but sacrifices some platform-native feel; acceptable when brand consistency outweighs native idiom."
        },
        {
          "name": "Per-screen hard-coded colors, sizes, and bespoke components",
          "verdict": "weak",
          "reason": "Inconsistent, painful to theme or dark-mode, and duplicates behavior and accessibility work — the classic unmaintainable UI."
        }
      ],
      "recommendation": "Build against semantic design tokens and a shared component library so the whole app restyles from one place, support light/dark (and high-contrast) by swapping token values and reacting to the system setting at runtime, and respect each platform's conventions (Material on Android, HIG on iOS) unless a deliberate brand decision says otherwise."
    },
    "commonMistakes": [
      "Hard-coding raw colors and sizes per screen instead of referencing semantic tokens",
      "Building dark mode by naive color inversion, producing poor contrast and muddy surfaces",
      "Not reacting to the system light/dark setting at runtime, leaving the app out of sync with the OS",
      "Ignoring platform conventions so the app feels foreign, or rebuilding components ad hoc per screen"
    ],
    "seniorNotes": "The leverage in a design system is the semantic token layer: components reference semantic tokens, and themes redefine those tokens, so light/dark/brand/high-contrast are all just alternate token sets — insist components never reference raw palette values. Dark mode is a design exercise (separate palette, elevation via surface tint, contrast maintained), not an inversion. The platform-convention decision (native per platform vs unified brand) is a strategic trade-off, so make it explicitly. Design systems reinforce accessibility and adaptive layout because components carry semantics and adapt to size. The tokens-plus-components model is universal: Flutter (ThemeData, Material/Cupertino widgets) and React Native (theme providers, design-token libraries) implement the same idea.",
    "interviewQuestions": [
      "What are design tokens and how do they make theming (like dark mode) cheap?",
      "Why is a dark theme more than inverting the colors?",
      "How should a cross-platform app handle Material Design vs Apple's HIG conventions?"
    ],
    "interviewAnswers": [
      "Design tokens are named values for design decisions — colors, typography, spacing, shape, elevation — that components reference instead of hard-coded raw values. They are usually layered: primitive palette values, semantic tokens like colorPrimary or colorSurface that map to primitives per theme, and sometimes component-level tokens. Theming is cheap because components only reference semantic tokens, so a theme (light, dark, brand, high-contrast) just redefines what those semantic tokens point to, and every component follows automatically with no code changes.",
      "Because a good dark theme is a distinct design, not a mathematical inversion. Inverting colors produces muddy, over-saturated results and often fails contrast. A proper dark theme uses a separately designed palette — typically desaturated colors on dark surfaces, elevation conveyed by lighter surface tint rather than drop shadows, and carefully maintained text/background contrast. You define these as an alternate set of token values and must preserve contrast and legibility in both light and dark, then react to the system setting at runtime.",
      "It is a deliberate trade-off between native feel and brand consistency. The most native approach adopts each platform's conventions — Material Design components, navigation, and motion on Android; Apple HIG typography, controls, and patterns on iOS — so each app feels at home, at the cost of more platform-specific work. The alternative is a unified brand look on both, which maximizes brand identity and reuse but feels less native. Most teams pick based on priorities: consumer apps leaning on brand may unify, while apps that must feel native honor each platform's conventions. The key is to decide explicitly and encode it in the design system rather than drifting."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Layered tokens and runtime theming (pseudocode)",
        "code": "// 1. primitive palette (raw values, referenced by NO component)\nprimitive = { blue500: #2563EB, gray900: #111827, white: #FFFFFF }\n\n// 2. semantic tokens mapped PER THEME\nlightTheme = {\n    colorPrimary:   primitive.blue500,\n    colorSurface:   primitive.white,\n    colorOnSurface: primitive.gray900,\n    spacingMd: 16, radiusMd: 12, textBody: 16,\n}\ndarkTheme = {\n    colorPrimary:   #93B4FF,          // desaturated for dark\n    colorSurface:   #1C1C1E,          // designed, not inverted\n    colorOnSurface: #F2F2F7,\n    spacingMd: 16, radiusMd: 12, textBody: 16,\n}\n\n// 3. components reference SEMANTIC tokens only\nfunction PrimaryButton(theme, label):\n    return Box(\n        background = theme.colorPrimary,     // never a raw hex\n        padding    = theme.spacingMd,\n        radius     = theme.radiusMd,\n        child      = Text(label, color = theme.colorSurface)\n    )\n\n// 4. pick theme from the live system setting -> whole app restyles\ntheme = system.isDarkMode ? darkTheme : lightTheme\non systemAppearanceChanged: rebuildWithTheme(theme)\n\n// 5. respect platform idiom: Material on Android, HIG on iOS"
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
  }
]
