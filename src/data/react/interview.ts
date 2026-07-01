import type { InterviewBank } from '@/types'

/** React / Next.js frontend interview bank: roles + 3-round question set. */
export const REACT_INTERVIEW: InterviewBank = {
  roles: [
    {
      id: 'frontend-engineer',
      title: 'Frontend Engineer',
      seniority: 'Junior → Senior',
      icon: '💻',
      description:
        'Builds the user-facing product in React — components, state, forms, and interactions. Owns the correctness, responsiveness, and polish of the UI and how it talks to APIs.',
      focus: ['React fundamentals', 'Hooks & state', 'Component design', 'API integration', 'Accessibility'],
      demandNote: 'The highest-volume frontend role — nearly every product team hires these.',
    },
    {
      id: 'react-developer',
      title: 'React Developer',
      seniority: 'Junior → Mid',
      icon: '⚛️',
      description:
        'A component and hooks specialist who lives inside the React render model. Focuses on reusable components, custom hooks, and keeping renders correct and predictable.',
      focus: ['Hooks internals', 'Reconciliation & keys', 'Custom hooks', 'Referential equality', 'Render behavior'],
      demandNote: 'Strong demand at agencies and product teams; the deep-React specialist track.',
    },
    {
      id: 'fullstack-engineer',
      title: 'Full-Stack Engineer',
      seniority: 'Mid → Senior',
      icon: '🧱',
      description:
        'Owns a feature end to end with Next.js — React UI, Server Components, API routes/Server Actions, and the database behind them. Thinks about the whole request, from render to data.',
      focus: ['Next.js App Router', 'Server vs Client Components', 'Data fetching & caching', 'API/DB integration', 'Auth'],
      demandNote: 'Very high demand at startups where one engineer owns the whole slice.',
    },
    {
      id: 'frontend-platform-engineer',
      title: 'UI / Frontend Platform Engineer',
      seniority: 'Senior → Staff',
      icon: '🏗️',
      description:
        'Builds the design system, shared components, and performance/a11y foundations other frontend engineers build on. Optimizes for consistency, reusability, and Core Web Vitals at scale.',
      focus: ['Design systems', 'Performance & Web Vitals', 'Accessibility', 'Bundle/code splitting', 'DX & tooling'],
      demandNote: 'Senior+ leverage role — fewer seats, premium comp at scale-ups.',
    },
  ],

  questions: [
    // ── Round 1: Phone Screen (fundamentals, breadth) ──────────────────────────
    {
      id: 're-s1',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'What is the virtual DOM and how does React use it to update the UI?',
      modelAnswer:
        'The virtual DOM is a lightweight JavaScript representation of the UI tree that React keeps in memory. When state changes, React builds a new virtual tree and diffs it against the previous one (reconciliation) to compute the minimal set of real DOM mutations, then applies just those in the commit phase. This matters because direct DOM manipulation is expensive and error-prone, so batching and minimizing real DOM writes keeps updates fast. A strong answer also notes that the virtual DOM is a means to an end — declarative UI — not magic that makes everything free.',
      keyPoints: [
        'In-memory tree diffed against the previous render (reconciliation)',
        'Computes minimal real DOM mutations, applied in commit phase',
        'Enables declarative UI; not automatically "fast"',
      ],
      followUp: 'What role do keys play in making reconciliation efficient and correct?',
      topicId: 'what-is-react',
    },
    {
      id: 're-s2',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'What is the difference between props and state? When do you reach for each?',
      modelAnswer:
        'Props are inputs passed from a parent — read-only from the child\'s perspective and owned by whoever renders the component. State is data a component owns and can change over time via a setter, and updating it triggers a re-render. You reach for state when a value changes in response to user interaction or time and the component is the source of truth; you use props to pass data and callbacks down. If two components need the same changing value, you lift the state to their nearest common parent and pass it down as props.',
      keyPoints: [
        'Props = read-only inputs from parent; state = component-owned, mutable via setter',
        'State changes trigger re-render; props changes come from parent re-rendering',
        'Lifting state up for shared data',
      ],
      followUp: 'A child needs to change a value the parent owns — how do you wire that?',
      topicId: 'props',
    },
    {
      id: 're-s3',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'What is JSX and what does it compile to?',
      modelAnswer:
        'JSX is a syntax extension that lets you write markup-like code inside JavaScript. It is not HTML — it compiles to function calls, historically React.createElement and in the modern transform to jsx() calls from react/jsx-runtime, which return plain element objects describing what to render. Because it is just JavaScript, you can embed expressions with braces, map over arrays, and use conditionals. Key gotchas: attributes use camelCase (className, onClick), you must return a single root (or a Fragment), and everything must be closed.',
      keyPoints: [
        'Syntax sugar compiling to jsx()/createElement calls returning element objects',
        'Expressions in braces; camelCase props; single root / Fragment',
        'JSX is JavaScript, not HTML — enables map/conditionals inline',
      ],
      topicId: 'jsx-tsx',
    },
    {
      id: 're-s4',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'What is a controlled component and why are controlled inputs usually preferred?',
      modelAnswer:
        'A controlled input has its value driven by React state — the input reads value from state and updates it in an onChange handler, so React is the single source of truth. An uncontrolled input keeps its own value in the DOM and you read it via a ref when needed. Controlled inputs are preferred because they make validation, conditional disabling, formatting, and derived UI trivial since the value is always in state. The tradeoff is a re-render per keystroke, which for huge or performance-sensitive forms may push you toward uncontrolled inputs or a form library.',
      keyPoints: [
        'Controlled: value + onChange bound to state (React = source of truth)',
        'Uncontrolled: DOM holds value, read via ref',
        'Controlled eases validation/derived UI; costs a render per keystroke',
      ],
      followUp: 'When would you deliberately choose an uncontrolled input?',
      topicId: 'forms-controlled',
    },
    {
      id: 're-s5',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'Why does React need a key when rendering a list, and why is the array index a poor choice?',
      modelAnswer:
        'Keys give each list item a stable identity so reconciliation can match elements between renders and know which were added, removed, or reordered — instead of diffing positionally. Using the array index as a key ties identity to position, so when the list is reordered, filtered, or has items inserted, React reuses the wrong DOM nodes and component state. That causes bugs like input values or checkbox states sticking to the wrong row. The right key is a stable, unique id from the data.',
      keyPoints: [
        'Keys = stable identity for correct add/remove/reorder matching',
        'Index keys break on reorder/insert/filter — state attaches to wrong item',
        'Use a stable unique id from the data',
      ],
      redFlags: ['Thinks keys are just to silence the console warning'],
      topicId: 'lists-keys',
    },
    {
      id: 're-s6',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'How do hooks like useState and useEffect replace the old class lifecycle methods?',
      modelAnswer:
        'Instead of scattering logic across componentDidMount, componentDidUpdate, and componentWillUnmount, hooks organize code by concern. useState holds local state, and useEffect runs side effects after render, synchronizing the component with something external. The dependency array controls when it runs — [] mimics mount-only, listing deps re-runs on their change, and the cleanup function returned from the effect handles unmount and pre-update teardown. The mental shift is that you no longer think in lifecycle timings but in "keep this effect in sync with these values."',
      keyPoints: [
        'Hooks group logic by concern, not by lifecycle timing',
        'Deps array: [] = mount, [deps] = on change; cleanup = unmount/teardown',
        'Mental model: synchronize with external systems, not "fire on mount"',
      ],
      followUp: 'Why is thinking of useEffect as "onMount" a common source of bugs?',
      topicId: 'useEffect',
    },

    // ── Round 2: Technical Deep Dive (depth, problem-solving, debugging) ────────
    {
      id: 're-t1',
      level: 'technical',
      difficulty: 'mid',
      category: 'debugging',
      question: 'A useEffect logs a value that is always one step behind the current state. What is happening and how do you fix it?',
      modelAnswer:
        'This is a stale closure. The effect (or a callback/interval it created) captured the state variable from the render in which it was defined, so it keeps seeing that old value even as state moves on. It usually happens with an empty dependency array around a setInterval or event handler, or a missing dependency that ESLint would flag. The fix is to include the value in the dependency array so the effect re-subscribes with fresh values, or use the functional updater form setCount(c => c + 1) so you never read the stale variable, or store the latest value in a ref that the callback reads.',
      keyPoints: [
        'Identifies it as a stale closure over a captured render value',
        'Root cause: missing dependency / empty deps around interval or handler',
        'Fixes: correct deps, functional updater, or a ref holding latest value',
      ],
      followUp: 'Why can\'t you just "read the latest state" directly inside the interval callback?',
      redFlags: ['Blindly disables the exhaustive-deps lint rule to make it go away'],
      topicId: 'useEffect',
    },
    {
      id: 're-t2',
      level: 'technical',
      difficulty: 'senior',
      category: 'concept',
      question: 'Explain referential equality and how useMemo, useCallback, and React.memo relate to it.',
      modelAnswer:
        'On every render, object and function literals get new identities even if their contents are identical, because JavaScript compares references, not structure. React.memo skips re-rendering a child when its props are referentially equal to last time, so passing a fresh inline object or callback defeats it. useCallback memoizes a function\'s identity and useMemo memoizes a computed value\'s identity across renders (given stable dependencies), so they stay stable and let React.memo or effect dependency arrays behave. The key insight is these hooks are about preserving identity, not about "caching for speed" — using them everywhere adds overhead for no gain.',
      keyPoints: [
        'New object/function identity each render; JS compares by reference',
        'React.memo bails only on referentially equal props',
        'useCallback/useMemo stabilize identity for memo\'d children and effect deps',
        'They preserve identity, not general "speed" — don\'t over-apply',
      ],
      followUp: 'You wrapped a child in React.memo but it still re-renders every time — why?',
      redFlags: ['Wraps everything in useMemo/useCallback by default with no measurement'],
      topicId: 'react-memo',
    },
    {
      id: 're-t3',
      level: 'technical',
      difficulty: 'mid',
      category: 'debugging',
      question: 'A component using useContext re-renders far more than expected and is janky. Why, and how do you fix it?',
      modelAnswer:
        'Every consumer of a context re-renders whenever the context value\'s reference changes — and if the provider passes a new object literal each render (or the value is a giant blob of unrelated state), all consumers re-render even for data they do not use. Fixes: memoize the provider value with useMemo, split one mega-context into smaller focused contexts so unrelated updates do not fan out, and separate rarely-changing values from frequently-changing ones. If the state is genuinely large and hot, a selector-based store like Zustand or Redux with useSelector lets components subscribe only to the slice they read.',
      keyPoints: [
        'All consumers re-render on any context value reference change',
        'Unmemoized provider value / mega-context fans out updates',
        'Fixes: memoize value, split contexts, or use a selector-based store',
      ],
      followUp: 'When is context the wrong tool and a store the right one?',
      topicId: 'useContext',
    },
    {
      id: 're-t4',
      level: 'technical',
      difficulty: 'senior',
      category: 'tradeoff',
      question: 'When would you reach for useReducer instead of useState, and how does it help testing and complex state?',
      modelAnswer:
        'useReducer shines when the next state depends on the previous state, when several values change together, or when update logic is complex enough that scattered setState calls become hard to follow. You centralize transitions in a pure reducer function of (state, action), which makes the logic testable in isolation and the state changes explicit and traceable. It also plays well with dispatch being stable, so you can pass it down without breaking memoization. For a couple of independent primitive values, useState is simpler and reducer is overkill.',
      keyPoints: [
        'Use when next state depends on prev / multiple fields move together',
        'Pure reducer centralizes transitions — testable and traceable',
        'Stable dispatch is memo-friendly; useState fine for simple independent values',
      ],
      followUp: 'How would you combine useReducer with context to build a small global store?',
      topicId: 'useReducer',
    },
    {
      id: 're-t5',
      level: 'technical',
      difficulty: 'mid',
      category: 'debugging',
      question: 'A page shows a "Text content did not match" hydration error in Next.js. What causes hydration mismatches and how do you resolve them?',
      modelAnswer:
        'Hydration attaches React to server-rendered HTML, and it errors when the first client render produces different markup than the server sent. Common causes are rendering values that differ between server and client — Date.now(), Math.random(), locale/timezone formatting, window/localStorage access during render, or invalid HTML nesting that the browser auto-corrects. Fixes: make the initial render deterministic, move client-only reads into useEffect (which runs after hydration), gate truly client-only UI behind a mounted flag or dynamic import with ssr:false, and fix nesting issues. The goal is that the server and the first client render are byte-for-byte identical.',
      keyPoints: [
        'Hydration requires server HTML to match the first client render',
        'Causes: random/time/locale values, window access in render, bad HTML nesting',
        'Fixes: deterministic first render, client reads in useEffect, ssr:false / mounted gate',
      ],
      followUp: 'Why does moving the browser-only code into useEffect avoid the mismatch?',
      topicId: 'server-vs-client',
    },
    {
      id: 're-t6',
      level: 'technical',
      difficulty: 'senior',
      category: 'debugging',
      question: 'Your dashboard loads a list, then each row fetches its own detail, and the page feels slow. What is the anti-pattern and how do you fix it?',
      modelAnswer:
        'This is a request waterfall — the parent fetches, renders, and only then do children start their own dependent fetches, so latency stacks sequentially instead of overlapping. Fixes: hoist and parallelize fetches that do not depend on each other (Promise.all or firing queries together), fetch the list plus its details in one batched request or a single query, and prefetch data before it is needed. With React Query/SWR you dedupe and cache requests and can kick off queries in parallel; in the Next.js App Router you fetch in Server Components and can start requests concurrently, streaming with Suspense so the shell renders immediately.',
      keyPoints: [
        'Names the waterfall: sequential dependent fetches stacking latency',
        'Fix: parallelize/hoist/batch independent requests, prefetch',
        'React Query/SWR dedupe+cache; RSC + Suspense streaming for the shell',
      ],
      followUp: 'How does Suspense with streaming change the perceived load time here?',
      topicId: 'data-fetching-patterns',
    },

    // ── Round 3: System / Frontend Design (architecture, tradeoffs, behavioral) ──
    {
      id: 're-d1',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['frontend-engineer', 'react-developer', 'frontend-platform-engineer'],
      question: 'Design a reusable, accessible autocomplete/combobox component. Walk me through the API, state, and a11y.',
      modelAnswer:
        'I would model it as a controlled-friendly component with a text input, an async or filtered options list, and internal state for the query, the open/closed menu, the highlighted index, and the selected value. Data-wise I debounce the query, cancel stale in-flight requests, and cache results; I keep it uncontrolled internally but expose value/onChange and onInputChange so callers can control it. For accessibility I follow the ARIA combobox pattern: the input gets role="combobox" with aria-expanded, aria-controls, and aria-activedescendant pointing at the highlighted option, the listbox and options get proper roles, and full keyboard support — arrow keys move the highlight, Enter selects, Escape closes, and focus stays on the input. I also handle loading, empty, and error states and make sure screen readers announce result counts via a live region.',
      keyPoints: [
        'Clear API: controlled value/onChange plus onInputChange, render/option props',
        'State: query, open, highlighted index, selection; debounce + cancel stale fetches',
        'ARIA combobox pattern: roles, aria-activedescendant, aria-expanded',
        'Full keyboard nav (arrows/Enter/Escape) + loading/empty/error and live region',
      ],
      followUp: 'How do you prevent a slow request from overwriting results of a newer keystroke?',
      redFlags: ['Ignores keyboard navigation and ARIA entirely', 'No handling of stale/out-of-order async responses'],
      topicId: 'custom-hooks',
    },
    {
      id: 're-d2',
      level: 'design',
      difficulty: 'senior',
      category: 'tradeoff',
      roleIds: ['frontend-engineer', 'fullstack-engineer', 'frontend-platform-engineer'],
      question: 'Architect state management for a large dashboard with server data, filters, and cross-widget UI state. What lives where?',
      modelAnswer:
        'I separate state by kind rather than dumping it all in one place. Server/async data lives in a data-fetching cache like React Query or SWR (or Server Components in the App Router), which handles caching, revalidation, and dedup — this is not "state" you should hand-roll in useState. URL/query params hold shareable, bookmarkable UI like active filters and pagination so a link reproduces the view. Local ephemeral state (a menu open, an input draft) stays in the component with useState. Genuinely global client UI shared across widgets goes in a lightweight selector-based store like Zustand so components subscribe only to their slice and avoid context re-render fan-out. Redux is justified when you need strict middleware, time-travel, or a large team needing rigid conventions.',
      keyPoints: [
        'Separates server-cache vs URL state vs local vs global UI state',
        'Server data in React Query/SWR/RSC — not manual useState',
        'Shareable filters in the URL; global UI in a selector store (Zustand)',
        'Justifies Redux only for its specific strengths, not by default',
      ],
      followUp: 'Why is putting server data in a global store often a mistake?',
      redFlags: ['Puts everything in one global store / Redux by reflex', 'Treats server cache as ordinary client state'],
      topicId: 'zustand',
    },
    {
      id: 're-d3',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['frontend-engineer', 'react-developer', 'fullstack-engineer'],
      question: 'Design an infinite-scrolling feed with optimistic updates (like posting a comment). Cover data, rendering, and failure handling.',
      modelAnswer:
        'For the feed I use cursor-based pagination (a stable key like created_at+id, not offset) so pages stay consistent under inserts, loading the next page via an IntersectionObserver sentinel and an infinite-query hook that caches and appends pages. For huge lists I virtualize so only visible rows are in the DOM. For optimistic updates I write the new comment into the cache immediately with a temporary id and a pending flag so the UI feels instant, fire the mutation, and on success reconcile with the server\'s real record; on failure I roll back to the snapshot and surface a retry. I also handle scroll position on new items, de-duplication of pages, and empty/error/end-of-feed states.',
      keyPoints: [
        'Cursor/keyset pagination + IntersectionObserver sentinel; virtualize long lists',
        'Optimistic write to cache with temp id, then reconcile on success',
        'Rollback to snapshot on failure with retry affordance',
        'Handles dedup, scroll anchoring, empty/error/end states',
      ],
      followUp: 'How do you avoid duplicate items when a new post arrives while paginating?',
      redFlags: ['Uses offset pagination for an infinite feed', 'No rollback path when the optimistic mutation fails'],
      topicId: 'data-fetching-patterns',
    },
    {
      id: 're-d4',
      level: 'design',
      difficulty: 'senior',
      category: 'behavioral',
      question: 'Tell me about a performance problem you diagnosed and fixed on the frontend — for example a re-render storm.',
      modelAnswer:
        'A strong answer names a concrete symptom (typing lag, a janky list, high CPU), the measurement done with the React Profiler or DevTools flame chart to find what was re-rendering and why, and the actual root cause rather than a guess — for instance an unmemoized context value re-rendering every consumer, a new callback identity breaking React.memo, or a giant list rendering without virtualization. It describes the targeted fix (split the context, stabilize identity with useCallback, virtualize the list, or move state down closer to where it is used) and closes with the measured result and a guardrail to prevent regression. Interviewers want measurement before optimization, not premature memoization everywhere.',
      keyPoints: [
        'Starts from a measured symptom, profiles before changing code',
        'Names a real root cause (context fan-out, broken memo, no virtualization)',
        'Targeted fix + measured before/after result',
        'Measure-first mindset, not reflexive useMemo everywhere',
      ],
      followUp: 'How did you make sure the fix did not silently regress later?',
      redFlags: ['Optimizes by adding memoization everywhere without profiling', 'Cannot state how the improvement was measured'],
      topicId: 'performance-patterns',
    },
  ],
}
