import type { CaseStudy } from '@/types'

/** Real-world React / frontend engineering case studies from industry leaders. */
export const REACT_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'facebook-react-origin',
    company: 'Facebook',
    logo: '📘',
    title: 'Why Facebook Invented React: Solving the News Feed Performance Problem',
    industry: 'Social Media',
    scale: '3B users · 100B News Feed impressions/day · 10,000+ frontend engineers',
    problem: `In 2011, Facebook\'s News Feed was built in traditional MVC JavaScript. Every time a user received a new notification, liked a post, or someone posted to their timeline, the JavaScript code had to figure out exactly which part of the DOM to update. With a complex, interactive UI — unread message count in the header, notification badge, News Feed updating, chat sidebar — keeping all these UI elements consistent when data changed was a nightmare of manual DOM manipulation.

Engineers kept introducing bugs where the notification count would show "1" but no notification existed, or the chat count didn\'t update when a message was read. The root cause: two-way data binding and manual DOM mutation made it impossible to reason about state. Any event handler could modify any part of the UI, and there was no single source of truth. Facebook had 10,000+ engineers working on the product — coordination at this scale with mutable shared DOM state was fundamentally broken.`,
    solution: `Jordan Walke at Facebook built the first prototype of React in 2011, drawing inspiration from XHP (Facebook\'s server-side PHP component library). The core idea: instead of manipulating the DOM directly, describe what the UI should look like as a function of state. When state changes, re-render the entire component tree from scratch and diff the result against the real DOM. Only the changed nodes get updated.

This "virtual DOM" approach sounds wasteful — re-rendering everything on every update — but it\'s actually faster in practice because: (1) JavaScript object manipulation is 100x faster than real DOM operations, (2) the diffing algorithm (reconciliation) only touches DOM nodes that actually changed, (3) renders can be batched so multiple state updates in the same event handler cause only one re-render.

The component model (every UI element is a function from state to UI) made it trivial to reason about a piece of UI in isolation. The chat sidebar doesn\'t know about the News Feed. The notification badge doesn\'t know about the chat. Each component manages its own local state and receives data from parent components via props. No shared mutable state between unrelated components.`,
    architecture: `React introduced a unidirectional data flow that became the defining principle of modern frontend architecture. Data flows down (from parent to children via props). Events flow up (from children to parents via callbacks). This one-directional flow makes state changes predictable and debuggable — when something looks wrong, you trace the data upstream.

The reconciliation algorithm (Fiber, rebuilt in React 16) works in two phases: the render phase (pure, no side effects, can be interrupted) and the commit phase (applies DOM mutations, runs effects, cannot be interrupted). This split allows React to pause and resume rendering, enabling concurrent rendering for large component trees without blocking the browser\'s UI thread.

React\'s Hooks (introduced in 2019) solved the problem of sharing stateful logic between components. Before Hooks, sharing logic required Higher Order Components or Render Props — patterns that nested components deeply and made component trees hard to follow. Hooks allow any function component to use state, effects, context, and reducers without class syntax.`,
    techStack: ['React', 'JavaScript', 'JSX', 'Webpack', 'Babel', 'GraphQL', 'Relay', 'Flow', 'Jest'],
    keyDecisions: [
      {
        decision: 'Virtual DOM and full re-renders instead of surgical DOM updates',
        why: 'Manual DOM updates require engineers to know what changed and update precisely. This is error-prone at scale. Full re-renders make the component a pure function: UI = f(state). Dramatically easier to reason about.',
        tradeoffs: 'Virtual DOM has overhead vs no-framework DOM manipulation. For simple UIs, it\'s slower. For complex UIs with many updates, it\'s faster and drastically more maintainable.',
      },
      {
        decision: 'JSX (HTML in JavaScript) instead of templates',
        why: 'Templates (like Handlebars, Angular\'s template syntax) are limited programming environments. JSX is full JavaScript — conditional rendering is an if statement, lists are array.map, dynamic classes are template literals.',
        tradeoffs: 'JSX feels strange at first. Requires a build step (Babel). But the power of full JavaScript in rendering logic far outweighs the learning curve.',
      },
      {
        decision: 'Unidirectional data flow over two-way binding',
        why: 'Angular and Knockout\'s two-way binding is convenient for forms but creates webs of dependencies. When anything can update anything, debugging "why did X change?" becomes archaeology.',
        tradeoffs: 'More boilerplate (need to lift state up, pass callbacks down). But explicit data flow means debugging is O(1): follow the props.',
      },
    ],
    results: [
      'Eliminated entire categories of UI consistency bugs at Facebook',
      'React became the most popular frontend library (used by 40%+ of web apps)',
      'React Native extended the model to iOS and Android from the same codebase',
      '10,000+ Facebook engineers successfully collaborate on one codebase using component model',
      '300+ companies (Netflix, Airbnb, Uber, Twitter, Shopify) adopted React as primary UI layer',
    ],
    lessonsLearned: [
      'Making state explicit and flow unidirectional is worth the boilerplate',
      'Full re-renders + diffing beats surgical DOM updates for maintainability at scale',
      'Components as pure functions of state is the mental model that makes large UI codebases manageable',
      'The best abstractions feel like removing code, not adding it',
      'Performance problems with virtual DOM are real but solvable (memoization, shouldComponentUpdate, useMemo)',
    ],
    relevantTopics: ['react-fundamentals', 'state-management', 'component-patterns', 'hooks', 'performance-optimization', 'virtual-dom', 'reconciliation'],
    estimatedMins: 25,
  },

  {
    id: 'netflix-react-performance',
    company: 'Netflix',
    logo: '🎬',
    title: 'Netflix\'s TV UI: React Performance Optimization for 10-Year-Old Hardware',
    industry: 'Streaming',
    scale: '238M subscribers · 2,000+ TV device types · 60fps UI target on low-end TVs',
    problem: `Netflix\'s TV application runs on over 2,000 different device types: smart TVs, game consoles, Blu-ray players, Roku sticks — many of which are 5-10 years old with processors far weaker than a modern laptop. The target device might be a 2013 Samsung smart TV with 256MB RAM and a 500MHz ARM processor. Running React on such hardware is a significant challenge.

The Netflix TV UI must deliver 60fps animations for row scrolling, load content artwork progressively, handle remote control input with zero perceptible lag, and recover gracefully when the device\'s memory fills up. A standard React application generated for modern browsers simply doesn\'t perform acceptably on this hardware profile.`,
    solution: `Netflix\'s TV team made a controversial decision in 2018: they removed React from their TV application and replaced it with custom vanilla JavaScript. Their reasoning: React\'s startup cost (parsing and executing the React runtime) on a 500MHz processor took 4-8 seconds before a single pixel was painted. Users would see a blank screen for 8 seconds on launch.

They built a custom framework called Gibbon (later, they contributed learnings back to the React team). Gibbon uses a linear layout engine instead of a flexbox/CSS layout engine — CSS layout is expensive on embedded devices. Every UI element is absolutely positioned with precalculated coordinates. There are no CSS transitions — animations are implemented as frame-by-frame JavaScript coordinate updates using requestAnimationFrame.

For the web experience (modern browsers and newer TVs), Netflix kept React. The optimization strategy there focused on code splitting (loading JavaScript only for the current page), prefetching (loading the next route\'s JavaScript before the user navigates), and aggressive image lazy loading (loading artwork for off-screen rows only when they\'re about to scroll into view).`,
    architecture: `Netflix\'s performance architecture centers on what they call "Time to First Interaction" — the metric that matters to a TV user is how quickly they can start scrolling after the app opens. They measure and optimize every millisecond of the startup sequence.

The rendering pipeline for TV: the server sends a pre-rendered HTML shell with the above-the-fold content inlined as critical CSS. The main JavaScript bundle is split into: (1) the bootstrap module (launches the app, paints UI), (2) the route-specific bundle (current page), (3) prefetched bundles for likely next pages. On a smart TV with 256MB RAM, this keeps the resident memory below 100MB while still feeling responsive.

For image optimization, Netflix\'s backend generates artwork at dozens of sizes and formats (WebP, AVIF, JPEG). The frontend uses the picture element with srcset to serve the right format and size based on the device\'s capabilities and screen resolution. Artwork is lazy-loaded with IntersectionObserver and preloaded for the first visible row using link rel=preload.`,
    techStack: ['React', 'JavaScript', 'Node.js', 'Webpack', 'Gibbon (internal)', 'WebP/AVIF', 'IntersectionObserver', 'Service Workers'],
    keyDecisions: [
      {
        decision: 'Remove React for TV, keep for web',
        why: 'React\'s runtime cost is acceptable on modern hardware. On 500MHz ARM, the startup cost makes the app unusable. Different platforms require different rendering strategies.',
        tradeoffs: 'Two codebases for TV and web. Increases engineering overhead. Netflix judged the UX benefit (8-second → 1-second startup) worth maintaining separate implementations.',
      },
      {
        decision: 'Route-based code splitting with aggressive prefetching',
        why: 'Loading all JavaScript upfront delays Time to First Interaction. Split by route, load the minimum needed to paint the current page, then prefetch likely next routes in idle time.',
        tradeoffs: 'More complex webpack configuration. Risk of prefetching wrong routes (wasted bandwidth). Netflix uses viewing behavior ML models to predict likely next navigation.',
      },
      {
        decision: 'Server-side rendering for above-the-fold content',
        why: 'The initial HTML render should not require JavaScript to execute before pixels appear. SSR sends pre-rendered HTML that the browser can paint immediately, then React hydrates.',
        tradeoffs: 'SSR adds server complexity and latency. Netflix mitigates by caching SSR output by user segment (not per user) and serving from edge CDN nodes.',
      },
    ],
    results: [
      'TV app startup time reduced from 8+ seconds to under 1 second',
      '60fps scrolling on devices with 500MHz processors',
      'Time to First Interaction under 3 seconds on 3G connections for web',
      'Web bundle size reduced 50% via route-based code splitting',
      '20% increase in streaming starts attributed to UI performance improvements',
    ],
    lessonsLearned: [
      'Performance optimization is device-specific — test on your actual target hardware, not a MacBook',
      'Framework choice matters: React\'s runtime cost is a real consideration for constrained environments',
      'Code splitting + prefetching is the most impactful optimization for web app load performance',
      'Measure Time to First Interaction, not just Time to First Byte — the whole pipeline matters',
      'Image optimization is often the highest-ROI performance improvement for content-heavy apps',
    ],
    relevantTopics: ['performance-optimization', 'code-splitting', 'server-side-rendering', 'lazy-loading', 'bundle-optimization', 'web-vitals'],
    estimatedMins: 25,
  },

  {
    id: 'airbnb-design-system',
    company: 'Airbnb',
    logo: '🏠',
    title: 'Airbnb\'s Design Language System: Scaling UI Consistency Across 50+ Products',
    industry: 'Travel / Marketplace',
    scale: '150M users · 50+ product surfaces · 200+ designers · 1,000+ engineers',
    problem: `By 2016, Airbnb had grown to 50+ distinct product surfaces: the main web app, iOS app, Android app, host tools, business travel, the guest app, the messaging system, the payments flow — each built by different teams, each with subtly different button styles, typography scales, spacing units, and color values. A primary blue button was 5 different shades across 5 apps. Spacing was measured in arbitrary pixels by different teams. Typography wasn\'t standardized.

The consequences were real: a designer couldn\'t share mockups between teams because components meant different things. Engineers re-implemented the same button component 20 different ways. A brand refresh required touching hundreds of components across dozens of codebases. User testing showed trust signals decreased when the host interface looked different from the guest interface — inconsistency reads as unprofessionalism.`,
    solution: `Airbnb built DLS (Design Language System), a shared React component library used across all their web products. The foundational insight: instead of building "an Airbnb button component", build a design token system — a set of abstract variables (--color-primary, --spacing-4, --font-size-body) that all components consume. When the design team decides to shift the primary color from #FF5A5F to #FF385C, one token change propagates across all 1,000+ components instantly.

DLS is structured in three layers: (1) Tokens — the base design decisions (colors, typography, spacing, shadows), (2) Primitives — simple atoms like Text, Button, Icon, Image that consume tokens, (3) Composites — more complex components like SearchBar, ListingCard, ReviewBlock that compose primitives. This layering means primitives never break when design decisions change, because they\'re parameterized by tokens, not hardcoded values.

The library is published as an npm package and consumed by all web teams. Major versions are published with migration guides. Airbnb uses Storybook to document every component with every variant, making the component catalog browsable without reading code.`,
    architecture: `The technical architecture of DLS uses CSS custom properties (variables) for theming. Each token maps to a CSS variable defined at the :root level. Components use these variables in their styles. This enables runtime theming — switching between light and dark mode, or between different brand themes, requires only changing the CSS variable values, not re-rendering components.

Airbnb also built a code generator that bridges the gap between Figma designs and React code. When a designer creates a component in Figma using DLS components, the Figma plugin generates React JSX that uses the correct DLS components and token values. This "design-to-code" pipeline reduces the translation errors that happen when engineers re-implement designs by hand.

For accessibility, every DLS component is built with WCAG 2.1 AA compliance by default: focus management, ARIA attributes, keyboard navigation, sufficient color contrast. Accessibility is a first-class constraint in the component design, not a retrofit. Engineers using DLS components get accessibility for free without thinking about it.`,
    techStack: ['React', 'TypeScript', 'Sass/CSS Custom Properties', 'Storybook', 'Figma', 'Jest', 'React Testing Library', 'Webpack', 'Lerna', 'Chromatic'],
    keyDecisions: [
      {
        decision: 'Design tokens as the foundation, not components',
        why: 'Components change frequently. Design decisions (primary color, base spacing unit, font scale) change rarely. Anchoring the system in tokens means component changes don\'t require rethinking design fundamentals.',
        tradeoffs: 'Tokens require upfront investment in design system thinking before a single component is built. Many teams skip this and pay for it later.',
      },
      {
        decision: 'Publish as npm package with semantic versioning',
        why: 'DLS is a dependency, not a copy-paste library. Teams pin to a version and upgrade deliberately. Breaking changes are major versions. Teams can audit their upgrade path.',
        tradeoffs: 'Slow adoption of new features if teams don\'t upgrade. Airbnb solved this with automated codemod scripts that apply mechanical upgrades (rename prop, change API) automatically.',
      },
      {
        decision: 'Storybook as the living design system documentation',
        why: 'Documentation that\'s separate from code becomes stale immediately. Storybook is generated from the actual components — it cannot be wrong by definition.',
        tradeoffs: 'Maintaining Storybook stories for every component state adds engineering time. Worth it: it also serves as the component\'s test harness for visual regression testing.',
      },
    ],
    results: [
      'Brand refresh applied across all 50+ surfaces in 2 days (was estimated 6 months)',
      'New features ship with consistent UI on first attempt, not after design review loops',
      'Accessibility compliance achieved across all surfaces by default',
      'Designer-to-engineer handoff time reduced 40%',
      'Component re-implementation eliminated — zero duplicated Button or Input components',
    ],
    lessonsLearned: [
      'Design tokens are the right abstraction level for a design system — not components',
      'A design system is a product that needs product management, not just engineering',
      'Accessible by default is achievable — bake it into primitives so engineers don\'t have to think about it',
      'Documentation is part of the component — Storybook stories should be required, not optional',
      'Automated codemods make major version upgrades non-events — invest in migration tooling',
    ],
    relevantTopics: ['component-patterns', 'css-architecture', 'typescript', 'testing', 'accessibility', 'performance-optimization'],
    estimatedMins: 20,
  },

  {
    id: 'shopify-storefront-performance',
    company: 'Shopify',
    logo: '🛍️',
    title: 'Shopify\'s Storefront Rendering: How Core Web Vitals Directly Impact Revenue',
    industry: 'E-commerce Platform',
    scale: '4.6M merchants · $235B GMV/year · 700M+ shoppers · every 28ms = 1% conversion loss',
    problem: `Shopify powers storefronts for 4.6 million merchants, from small Etsy-competitor stores to major brands like Gymshark, Allbirds, and Kylie Cosmetics. Their core business metric is GMV (Gross Merchandise Value) — the total dollar value of items sold through their platform. Shopify discovered through large-scale A/B testing that storefront performance has a direct, measurable impact on GMV: every 100ms of latency in page load correlates with a 1% reduction in conversion rate.

At $235 billion in annual GMV, a 1% conversion impact is $2.35 billion in merchant revenue. Every 28ms of latency costs approximately 1 basis point of conversion — and Shopify\'s average storefront was loading in 4.2 seconds on mobile. Google\'s Core Web Vitals research shows 53% of mobile users abandon a page that takes longer than 3 seconds to load.`,
    solution: `Shopify launched Hydrogen — a React-based storefront framework built specifically for e-commerce performance. Hydrogen\'s default rendering strategy is server components + streaming SSR (Server-Side Rendering). The server sends HTML in chunks: the product title and price arrive first (rendered on the server without JavaScript), the dynamic content (stock status, reviews, recommended products) streams in as it becomes available from downstream APIs.

For Core Web Vitals specifically, Shopify optimized three metrics: LCP (Largest Contentful Paint — when the main image loads), CLS (Cumulative Layout Shift — unexpected layout movement), and FID/INP (Input Delay — how quickly the page responds to interaction). LCP optimization: the product image uses fetchpriority="high" to tell the browser it\'s the most important resource. CLS optimization: every image and video element has explicit width and height attributes, so the browser reserves space before media loads. FID optimization: third-party scripts (analytics, chat widgets) are deferred or loaded as web workers.`,
    architecture: `Hydrogen is built on Remix (the React framework from the React Router authors). Remix\'s architecture is loader-based: each route exports a loader function that fetches data server-side. The component receives data as props, not via client-side API calls. This eliminates the "waterfall" problem where a component renders, discovers it needs data, fetches it, then renders again — a sequence that can take 3-4 round trips on mobile.

For the CDN layer, Shopify serves storefronts from 300+ edge locations globally. The HTML for a product page is cached at the edge with a short TTL (30-60 seconds). This means most page loads never reach Shopify\'s origin servers — the edge cache serves them. Personalized content (cart contents, logged-in state) is excluded from cache and injected client-side after the static shell loads.

Image optimization is automated: Shopify\'s CDN serves images in WebP/AVIF format to browsers that support them, resizes images to the exact display size of the element using URL parameters, and adds lazy loading by default for all below-the-fold images.`,
    techStack: ['React', 'Remix', 'TypeScript', 'GraphQL', 'Cloudflare Workers', 'Webpack', 'Vite', 'React Server Components', 'Hydrogen'],
    keyDecisions: [
      {
        decision: 'Server components + streaming SSR over client-side rendering',
        why: 'CSR sends a blank page until JavaScript downloads, parses, and fetches data. SSR sends meaningful HTML immediately. Streaming SSR improves on this further by sending critical content first.',
        tradeoffs: 'Server infrastructure required. Streaming SSR complicates error handling and caching. Worth it: LCP improves by 2-3 seconds vs CSR for e-commerce.',
      },
      {
        decision: 'Explicit image dimensions everywhere',
        why: 'Without explicit dimensions, the browser doesn\'t know how much space to reserve for images. As images load, content shifts down — CLS score increases. This directly correlates to user frustration.',
        tradeoffs: 'Requires knowing image dimensions at render time. Shopify\'s media CDN provides dimensions via API. Minor engineering overhead, major UX improvement.',
      },
      {
        decision: 'Loader-based data fetching (Remix) over useEffect fetching',
        why: 'useEffect fetching creates request waterfalls: render → discover data need → fetch → re-render. Loaders run before the component renders, eliminating the waterfall entirely.',
        tradeoffs: 'Loader data is route-specific, not component-specific. Sharing data between components requires careful loader design. Remix\'s nested routes handle this elegantly.',
      },
    ],
    results: [
      'Average storefront LCP reduced from 4.2s to 1.8s on mobile',
      'Merchants using Hydrogen see 15-30% conversion improvement vs legacy themes',
      'CLS reduced to below 0.1 threshold across 95% of storefronts',
      'Every 1% conversion improvement = ~$2.3B additional merchant GMV',
      'Time to First Byte (TTFB) under 100ms from edge cache globally',
    ],
    lessonsLearned: [
      'Core Web Vitals are business metrics, not just engineering metrics — quantify their revenue impact',
      'SSR with streaming is the right default for content-heavy pages; CSR is right for highly interactive applications',
      'Request waterfalls (fetch-on-render) are the most common, most fixable React performance problem',
      'Image optimization alone can account for 40-60% of LCP improvement — don\'t overlook it',
      'Performance work requires measurement: A/B test changes against conversion, not just Lighthouse scores',
    ],
    relevantTopics: ['server-side-rendering', 'performance-optimization', 'web-vitals', 'code-splitting', 'caching', 'lazy-loading'],
    estimatedMins: 25,
  },

  {
    id: 'twitter-react-migration',
    company: 'Twitter (X)',
    logo: '🐦',
    title: 'Twitter\'s Progressive Migration to React and the Progressive Web App Strategy',
    industry: 'Social Media',
    scale: '450M users · 500M tweets/day · 65% mobile traffic · 2017 PWA launch',
    problem: `By 2017, Twitter had a JavaScript-heavy web application that performed poorly on mid-range Android devices — exactly the devices used by their fastest-growing user base in emerging markets (India, Brazil, Nigeria). The Twitter web app downloaded 2MB+ of JavaScript before any content appeared. On a 3G connection (still common globally), this meant a 15-30 second blank screen before the timeline appeared.

Twitter\'s mobile web team discovered that 65% of their web traffic came from mobile devices, with a significant portion on older Android phones on 2G/3G. They needed to rebuild the web experience from scratch to be fast on constrained devices and networks. The challenge: do it without breaking 450M users\' experience.`,
    solution: `Twitter launched Twitter Lite in 2017 — a Progressive Web App (PWA) built with React. The defining constraints they designed for: maximum 30KB per route of JavaScript (gzipped), offline support for reading tweets, and first meaningful paint under 5 seconds on 3G.

The performance strategy: (1) every route is code-split — navigating to /home loads only home-related code, navigating to a tweet loads only tweet-related code; (2) Service Workers cache application code and API responses, enabling offline viewing of previously loaded content; (3) the app shell (header, navigation, empty containers) loads first from Service Worker cache, content streams in; (4) images use lazy loading with blur-up placeholders — a blurred tiny version of the image appears immediately while the full image loads.

The PWA also supports "Add to Home Screen" on Android, giving the experience of a native app without App Store installation. Push notifications work via the Web Push API, matching native app behavior. Offline mode shows cached timeline content when the network is unavailable.`,
    architecture: `Twitter Lite\'s architecture uses server-side rendering for the first request (fast first paint) and client-side rendering for navigation (instant subsequent navigation). The React component tree is hydrated on the client from the SSR markup — no content flashes or repaints.

State management uses Redux for global state (authentication, settings, cached timeline data). Timeline data is cached in Redux with LRU eviction — old timeline data is removed to keep memory bounded. This prevents the app from accumulating unbounded data over a long session, which would crash low-memory devices.

The rendering strategy for tweets uses windowing (react-window) — only the tweets currently visible in the viewport are rendered as DOM nodes. A timeline of 1,000 tweets renders as 20 DOM nodes, with the virtual list maintaining the illusion of all 1,000 being present. This is critical for memory and paint performance on low-end devices.`,
    techStack: ['React', 'Redux', 'Service Workers', 'Webpack', 'Node.js', 'GraphQL', 'TypeScript', 'react-window', 'Workbox'],
    keyDecisions: [
      {
        decision: 'Progressive Web App instead of native Android/iOS redesign',
        why: 'PWA installs from the browser with no App Store friction. In emerging markets, App Store installation rates are lower due to device storage constraints. A PWA is 1MB downloaded vs 50-100MB for a native app.',
        tradeoffs: 'PWA capabilities are a subset of native. Camera, biometric auth, and some push notification features required native. Twitter maintained native apps alongside the PWA.',
      },
      {
        decision: 'Virtual scrolling for timelines (react-window)',
        why: 'A Twitter timeline can have thousands of tweets in a session. Rendering 1,000 tweet DOM nodes exhausts a 1GB RAM phone. Virtual lists render only visible items, keeping DOM size constant.',
        tradeoffs: 'Virtual scrolling breaks native browser scroll restoration. Back navigation can\'t restore exact scroll position. Twitter mitigated with custom scroll position tracking in Redux.',
      },
      {
        decision: '30KB per-route JavaScript budget with hard linting enforcement',
        why: 'Without a hard limit, bundles grow unchecked. Each added dependency seems small; together they compound to 2MB+. A hard budget forces engineers to justify every byte.',
        tradeoffs: 'Constrains which libraries can be used. Engineers must write more code by hand (no lodash, no moment.js). This investment pays off in performance for constrained networks.',
      },
    ],
    results: [
      '65% reduction in pages loaded per session (fewer bounces due to faster loading)',
      '75% reduction in tweets sent from Twitter Lite vs web (shows re-engagement)',
      '20% reduction in bounce rate for Twitter Lite vs web',
      'Data usage reduced 70% vs prior web experience',
      'Time to First Tweet under 5 seconds on 3G connections',
    ],
    lessonsLearned: [
      'Your fastest-growing users may be on your worst-performing devices — design for the bottom of your device spectrum',
      'Progressive Web Apps close the gap with native, especially for content consumption apps',
      'Hard performance budgets enforced by linting prevent gradual degradation',
      'Virtual scrolling is mandatory for infinite content feeds on mobile devices',
      'Service Workers + caching strategy can make web apps feel native for returning users',
    ],
    relevantTopics: ['performance-optimization', 'code-splitting', 'state-management', 'server-side-rendering', 'web-vitals', 'lazy-loading'],
    estimatedMins: 25,
  },
]
