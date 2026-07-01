import type { Lifecycle } from '@/types'

/** React / Next.js lifecycles every frontend engineer must know cold. */
export const REACT_LIFECYCLES: Lifecycle[] = [
  {
    id: 'component-lifecycle',
    title: 'Component Lifecycle',
    subtitle: 'Mount → Update → Unmount, the hooks way',
    icon: '⚛️',
    flow: 'linear',
    overview:
      'Every React component goes through three phases: mounting (first render onto the DOM), updating (re-rendering when props or state change), and unmounting (removal). With hooks, useEffect models all three. Knowing exactly when render runs versus when effects run — and in what order — is fundamental to avoiding stale state, infinite loops, and memory leaks.',
    stages: [
      {
        name: 'Mount — first render',
        shortLabel: 'mount',
        description: 'The component function runs for the first time and React builds the initial DOM.',
        durationHint: 'once',
        details: [
          'The component body runs top to bottom; useState initializers run once',
          'React commits the output to the DOM (the "commit phase")',
          'This maps to the old componentDidMount',
        ],
        code: {
          lang: 'tsx',
          label: 'mount effect',
          code: 'useEffect(() => {\n  // runs once after first paint\n  const sub = api.subscribe(setData)\n  return () => sub.unsubscribe() // cleanup on unmount\n}, []) // empty deps = mount only',
        },
      },
      {
        name: 'Effects run (after paint)',
        shortLabel: 'effects',
        description: 'After the browser paints, React runs useEffect callbacks for this render.',
        durationHint: 'after commit',
        details: [
          'Effects run AFTER the DOM is updated and painted — never during render',
          'Effect with [] deps runs once; with [a, b] runs when a or b change; with no array runs every render',
          'useLayoutEffect runs synchronously before paint (use for measurements)',
        ],
        gotchas: [
          'Doing setState in an effect with missing deps → infinite loop',
          'Reading state in an effect closure captures the value from that render (stale closure)',
        ],
      },
      {
        name: 'Update — re-render',
        shortLabel: 'update',
        description: 'A state or prop change re-runs the component function and React diffs the output.',
        durationHint: 'on state/prop change',
        details: [
          'setState/props change schedules a re-render; the function body runs again',
          'React reconciles the new tree against the previous (virtual DOM diff)',
          'Before running new effects, React runs the PREVIOUS effect\'s cleanup',
        ],
        gotchas: [
          'Creating new object/array/function props every render breaks memoization — use useMemo/useCallback',
          'Updating state during render (outside an event/effect) throws',
        ],
      },
      {
        name: 'Cleanup before next effect',
        shortLabel: 'cleanup',
        description: 'The cleanup function returned by useEffect runs before the effect re-runs and on unmount.',
        durationHint: 'before re-run / unmount',
        details: [
          'Return a function from useEffect to unsubscribe, clear timers, abort fetches',
          'Cleanup runs with the values from the render that created it',
          'On dependency change: old cleanup → new effect, in that order',
        ],
        code: {
          lang: 'tsx',
          label: 'cleanup on dep change',
          code: 'useEffect(() => {\n  const id = setInterval(tick, 1000)\n  return () => clearInterval(id) // clears old timer before making a new one\n}, [tick])',
        },
      },
      {
        name: 'Unmount',
        shortLabel: 'unmount',
        description: 'The component is removed; all its effect cleanups run one final time.',
        durationHint: 'once, at end',
        details: [
          'Every active effect\'s cleanup fires — this is your last chance to release resources',
          'Maps to the old componentWillUnmount',
          'After unmount, calling setState warns/no-ops — guard async setState',
        ],
        gotchas: [
          'Not returning cleanup for subscriptions/timers = memory leak',
          'setState after unmount from a late async response — abort or check a mounted ref',
        ],
      },
    ],
    keyTakeaways: [
      'Render is pure and can run many times; effects run after paint and model side effects',
      'useEffect deps control frequency: [] once, [x] on change, none every render',
      'Cleanup runs before the next effect AND on unmount — subscriptions must always clean up',
      'Stale closures come from effects capturing a render\'s values — fix with correct deps or refs',
      'useLayoutEffect is synchronous pre-paint; useEffect is async post-paint',
    ],
    interviewNotes: [
      'Map the class lifecycle methods (didMount/didUpdate/willUnmount) to hooks.',
      'When exactly does a useEffect cleanup run?',
      'What is a stale closure and how do you avoid it?',
      'Difference between useEffect and useLayoutEffect?',
      'Why does an effect with missing dependencies cause an infinite loop?',
    ],
    relatedTopics: ['hooks', 'react-fundamentals', 'state-management'],
  },

  {
    id: 'useeffect-lifecycle',
    title: 'useEffect Deep Dive',
    subtitle: 'setup, dependencies, cleanup, and the render commit',
    icon: '🪝',
    flow: 'cyclic',
    overview:
      'useEffect is the most misunderstood hook. It synchronizes your component with an external system (network, timers, subscriptions, the DOM). Think of it not as "run on mount" but as "keep this in sync with these dependencies." Each render can produce a new effect, and React runs cleanup + setup as dependencies change.',
    stages: [
      {
        name: 'Render produces the effect',
        shortLabel: 'render',
        description: 'During render, the effect callback and its dependency array are captured as a closure.',
        durationHint: 'every render',
        details: [
          'The effect function is not called yet — it\'s stored with the values it closed over',
          'Dependencies are compared by Object.is against the previous render',
        ],
      },
      {
        name: 'Commit & compare deps',
        shortLabel: 'compare',
        description: 'After committing to the DOM, React compares this render\'s deps to the last render\'s.',
        durationHint: 'after commit',
        details: [
          'If every dependency is unchanged, React skips the effect entirely',
          'If any changed (or no array given), React schedules cleanup + setup',
        ],
        gotchas: ['Objects/arrays/functions are compared by reference — a new one each render always "changed"'],
      },
      {
        name: 'Cleanup previous',
        shortLabel: 'cleanup',
        description: 'Before running the new effect, the previous effect\'s returned cleanup runs.',
        durationHint: 'if deps changed',
        details: [
          'Unsubscribe, clear intervals, abort in-flight requests here',
          'On first run there is nothing to clean up yet',
        ],
      },
      {
        name: 'Run setup',
        shortLabel: 'setup',
        description: 'The effect body runs, establishing the new subscription/timer/sync.',
        durationHint: 'if deps changed',
        details: [
          'This is where you connect to the external system with current values',
          'Return a cleanup function to undo exactly what this run set up',
        ],
        code: {
          lang: 'tsx',
          label: 'sync to a room id',
          code: 'useEffect(() => {\n  const conn = chat.connect(roomId)   // setup with current roomId\n  return () => conn.disconnect()      // cleanup when roomId changes/unmount\n}, [roomId])',
        },
      },
    ],
    keyTakeaways: [
      'Model effects as "synchronize with these deps," not "run at this lifecycle moment"',
      'Every dependency your effect reads must be in the array — the linter is right',
      'Referential deps (objects/functions) need useMemo/useCallback or they re-run every render',
      'The cleanup + setup pair should be perfectly symmetric',
    ],
    interviewNotes: [
      'Why does React run cleanup before every re-run, not just on unmount?',
      'How does React decide whether to skip an effect?',
      'Your effect re-runs every render even though the value "looks" the same — why?',
      'When would you use a ref instead of a dependency?',
    ],
    relatedTopics: ['hooks', 'performance-optimization'],
  },

  {
    id: 'render-commit-phases',
    title: 'Render & Commit Phases',
    subtitle: 'How React turns your JSX into DOM updates',
    icon: '🎞️',
    flow: 'linear',
    overview:
      'A React update happens in two phases. The render phase is pure and interruptible — React calls your components and builds a work-in-progress tree, diffing it against the current one. The commit phase applies the minimal DOM mutations and runs layout effects. Concurrent React can pause and resume the render phase, which is why render must have no side effects.',
    stages: [
      {
        name: 'Trigger',
        shortLabel: 'trigger',
        description: 'An update is scheduled by initial mount, setState, or a context change.',
        durationHint: 'on update',
        details: [
          'State updates are batched — multiple setStates in one handler = one render',
          'React assigns a priority (urgent vs transition) to the update',
        ],
      },
      {
        name: 'Render phase (pure, interruptible)',
        shortLabel: 'render',
        description: 'React calls components to produce a new virtual tree and diffs it (reconciliation).',
        durationHint: 'can be paused',
        details: [
          'Your component functions run here — they must be pure with no side effects',
          'React builds a work-in-progress fiber tree and computes what changed',
          'Concurrent features (useTransition) can interrupt and restart this phase',
        ],
        gotchas: [
          'Side effects in render (mutating refs, subscribing, logging to a server) break concurrency',
          'Non-pure render can run twice in StrictMode dev — that\'s intentional to surface bugs',
        ],
      },
      {
        name: 'Commit phase (DOM mutations)',
        shortLabel: 'commit',
        description: 'React applies the diff to the real DOM in one synchronous, uninterruptible pass.',
        durationHint: 'synchronous',
        details: [
          'Only the changed DOM nodes are mutated — this is why the virtual DOM is fast',
          'Refs are attached here; useLayoutEffect runs synchronously before the browser paints',
          'After paint, useEffect callbacks run asynchronously',
        ],
      },
      {
        name: 'Browser paint',
        shortLabel: 'paint',
        description: 'The browser paints the updated DOM; then passive effects (useEffect) fire.',
        durationHint: 'after commit',
        details: [
          'useLayoutEffect already ran before this — use it for measurements to avoid flicker',
          'useEffect runs after paint so it never blocks visual updates',
        ],
      },
    ],
    keyTakeaways: [
      'Render phase = pure and interruptible; commit phase = synchronous DOM writes',
      'Because render can be paused/restarted, it must never have side effects',
      'React mutates only the DOM nodes that actually changed',
      'useLayoutEffect fires before paint (measurements); useEffect fires after paint (most side effects)',
      'StrictMode double-invokes render/effects in dev to catch impurity',
    ],
    interviewNotes: [
      'What are the render and commit phases and how do they differ?',
      'Why must render be pure?',
      'Where do refs get attached and where does useLayoutEffect run?',
      'How does concurrent rendering change the mental model of render?',
    ],
    relatedTopics: ['virtual-dom', 'reconciliation', 'performance-optimization'],
  },

  {
    id: 'nextjs-rendering-lifecycle',
    title: 'Next.js Rendering Lifecycle',
    subtitle: 'SSG, SSR, ISR, CSR — where and when your page is built',
    icon: '▲',
    flow: 'linear',
    overview:
      'Next.js can render a page at four different times: at build time (SSG), on each request on the server (SSR), on a revalidation schedule (ISR), or in the browser (CSR). Choosing the right strategy per route is a core Next.js skill that directly drives performance, SEO, and infrastructure cost.',
    stages: [
      {
        name: 'Build time — Static Generation (SSG)',
        shortLabel: 'SSG',
        description: 'The page is pre-rendered to static HTML at build time and served from the CDN.',
        durationHint: 'once, at build',
        details: [
          'Fastest possible delivery — plain HTML from the edge, no server work per request',
          'Best for content that\'s the same for all users (marketing, docs, blog)',
          'App Router: default for components without dynamic data',
        ],
        gotchas: ['Content is frozen until the next build unless you add revalidation (ISR)'],
      },
      {
        name: 'Request time — Server Rendering (SSR)',
        shortLabel: 'SSR',
        description: 'HTML is generated on the server for every request, with fresh per-request data.',
        durationHint: 'every request',
        details: [
          'Use when content is personalized or must be up-to-the-second',
          'Slower TTFB than SSG (server runs per request) but always fresh and SEO-friendly',
          'App Router: triggered by dynamic functions (cookies(), headers()) or no-store fetches',
        ],
        gotchas: ['A slow data source makes every request slow — cache what you can'],
      },
      {
        name: 'Revalidation — Incremental Static Regeneration (ISR)',
        shortLabel: 'ISR',
        description: 'Serve static HTML, but regenerate it in the background on a schedule or on-demand.',
        durationHint: 'on interval',
        details: [
          'Best of both: CDN-fast delivery with periodically fresh content',
          'revalidate: 60 serves cached HTML and rebuilds at most once per 60s',
          'On-demand revalidation lets a CMS webhook refresh a specific page instantly',
        ],
        code: {
          lang: 'tsx',
          label: 'ISR with revalidate',
          code: "export const revalidate = 60 // seconds\n\nexport default async function Page() {\n  const posts = await fetch('/api/posts').then(r => r.json())\n  return <PostList posts={posts} />\n}",
        },
      },
      {
        name: 'Hydration & Client Rendering (CSR)',
        shortLabel: 'CSR',
        description: 'The browser attaches React to the server HTML (hydration); Client Components run in the browser.',
        durationHint: 'in browser',
        details: [
          'Server HTML shows instantly; hydration wires up interactivity',
          'Client Components ("use client") handle state, effects, and browser APIs',
          'Data that only matters after interaction can be fetched client-side (SWR/React Query)',
        ],
        gotchas: [
          'Hydration mismatch (server HTML ≠ first client render) throws — keep them identical',
          'Shipping too much to the client kills the SSR performance win — keep components server-side by default',
        ],
      },
    ],
    keyTakeaways: [
      'Pick rendering per route: SSG for static, SSR for personalized/fresh, ISR for the middle ground, CSR for post-load interactivity',
      'ISR gives you CDN speed with scheduled freshness — the default answer for most content sites',
      'Server Components are the default; add "use client" only where you need interactivity',
      'Hydration mismatches are a top Next.js bug — server and first client render must match',
    ],
    interviewNotes: [
      'Compare SSG, SSR, ISR, and CSR and when to use each.',
      'What is ISR and what problem does it solve?',
      'What causes a hydration mismatch and how do you fix it?',
      'Why are Server Components the default in the App Router?',
    ],
    relatedTopics: ['server-side-rendering', 'code-splitting', 'web-vitals', 'performance-optimization'],
  },
]
