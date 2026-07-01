import type { ConceptMap } from '@/types'

/** How the big ideas of React & Next.js development connect. */
export const REACT_CONCEPT_MAP: ConceptMap = {
  title: 'React & Next.js Concept Map',
  intro:
    'Modern React is a graph of connected ideas: JavaScript and types underpin components, components render from state via hooks, state gets organized into architecture, and Next.js decides where and when that UI is rendered on its way to production. Tap any concept to see how it links to the rest.',
  clusters: [
    {
      id: 'js-ts',
      name: 'JS & TS',
      concepts: [
        { id: 'js-fundamentals', label: 'JS Fundamentals', summary: 'Closures, async/await, immutability — the base React sits on.', relatesTo: [{ id: 'components', relation: 'powers' }, { id: 'typescript', relation: 'typed by' }] },
        { id: 'typescript', label: 'TypeScript', summary: 'Static types that catch bugs before runtime.', relatesTo: [{ id: 'typing-props-node', relation: 'enables' }] },
        { id: 'modules-bundling', label: 'Modules & Bundling', summary: 'ES modules bundled/tree-shaken for the browser.', relatesTo: [{ id: 'performance', relation: 'affects' }] },
        { id: 'immutability', label: 'Immutability', summary: 'Never mutate state — return new objects/arrays.', relatesTo: [{ id: 'state', relation: 'required by' }, { id: 'rerender', relation: 'drives' }] },
      ],
    },
    {
      id: 'react-foundations',
      name: 'React Foundations',
      concepts: [
        { id: 'components', label: 'Components', summary: 'Functions that return JSX — the unit of UI.', topicId: 'what-is-react', relatesTo: [{ id: 'jsx', relation: 'return' }, { id: 'props', relation: 'accept' }] },
        { id: 'jsx', label: 'JSX / TSX', summary: 'HTML-like syntax compiled to createElement calls.', topicId: 'jsx-tsx', relatesTo: [{ id: 'components', relation: 'describes' }] },
        { id: 'props', label: 'Props', summary: 'Read-only inputs passed parent → child.', topicId: 'props', relatesTo: [{ id: 'components', relation: 'configure' }, { id: 'lifting-state', relation: 'flow via' }] },
        { id: 'state', label: 'State', summary: 'Data that changes over time and triggers re-render.', topicId: 'useState', relatesTo: [{ id: 'rerender', relation: 'triggers' }, { id: 'lifting-state', relation: 'can be shared by' }] },
        { id: 'rerender', label: 'Rendering & Re-renders', summary: 'React re-runs components when state/props change.', topicId: 'lists-keys', relatesTo: [{ id: 'performance', relation: 'tuned by' }] },
        { id: 'events', label: 'Event Handling', summary: 'Synthetic events wired via onClick/onChange.', topicId: 'event-handling', relatesTo: [{ id: 'state', relation: 'updates' }] },
        { id: 'forms', label: 'Controlled Forms', summary: 'React state as the source of truth for inputs.', topicId: 'forms-controlled', relatesTo: [{ id: 'state', relation: 'bound to' }, { id: 'events', relation: 'driven by' }] },
        { id: 'lifting-state', label: 'Lifting State Up', summary: 'Move shared state to the closest common parent.', topicId: 'lifting-state-up', relatesTo: [{ id: 'state', relation: 'relocates' }, { id: 'context', relation: 'alternative to' }] },
      ],
    },
    {
      id: 'hooks',
      name: 'Hooks',
      concepts: [
        { id: 'useeffect', label: 'useEffect', summary: 'Synchronize a component with an external system.', topicId: 'useEffect', relatesTo: [{ id: 'hooks-rules', relation: 'governed by' }, { id: 'data-fetching', relation: 'sometimes does' }] },
        { id: 'useref', label: 'useRef', summary: 'Mutable box + DOM access without re-rendering.', topicId: 'useRef', relatesTo: [{ id: 'rerender', relation: 'bypasses' }] },
        { id: 'usememo', label: 'useMemo / useCallback', summary: 'Cache values/functions to keep references stable.', topicId: 'useMemo', relatesTo: [{ id: 'react-memo', relation: 'supports' }, { id: 'performance', relation: 'optimizes' }] },
        { id: 'usecontext', label: 'useContext', summary: 'Read a Context value without prop drilling.', topicId: 'useContext', relatesTo: [{ id: 'context', relation: 'consumes' }] },
        { id: 'usereducer', label: 'useReducer', summary: 'Reducer-driven state for complex transitions.', topicId: 'useReducer', relatesTo: [{ id: 'state', relation: 'manages' }] },
        { id: 'custom-hooks', label: 'Custom Hooks', summary: 'Extract reusable stateful logic into use* fns.', topicId: 'custom-hooks', relatesTo: [{ id: 'hooks-rules', relation: 'follows' }, { id: 'useeffect', relation: 'compose' }] },
        { id: 'react-memo', label: 'React.memo', summary: 'Skip re-render when props are shallow-equal.', topicId: 'react-memo', relatesTo: [{ id: 'usememo', relation: 'paired with' }] },
        { id: 'hooks-rules', label: 'Rules of Hooks', summary: 'Call at top level, only from components/hooks.', topicId: 'hooks-rules', relatesTo: [{ id: 'custom-hooks', relation: 'constrains' }] },
      ],
    },
    {
      id: 'architecture-state',
      name: 'Architecture & State',
      concepts: [
        { id: 'context', label: 'Context API', summary: 'Inject values deep without prop drilling.', topicId: 'context-api', relatesTo: [{ id: 'usecontext', relation: 'read via' }, { id: 'zustand', relation: 'compared with' }] },
        { id: 'zustand', label: 'Zustand', summary: 'Tiny selector-based store for shared state.', topicId: 'zustand', relatesTo: [{ id: 'context', relation: 'alternative to' }, { id: 'performance', relation: 'limits re-renders' }] },
        { id: 'composition', label: 'Composition', summary: 'children/slots over inheritance for reuse.', topicId: 'props', relatesTo: [{ id: 'components', relation: 'structures' }] },
        { id: 'error-boundaries', label: 'Error Boundaries', summary: 'Catch render errors and show fallback UI.', topicId: 'error-boundaries', relatesTo: [{ id: 'suspense', relation: 'pairs with' }] },
        { id: 'suspense', label: 'Suspense & Lazy', summary: 'Declarative loading states + code splitting.', topicId: 'suspense-lazy', relatesTo: [{ id: 'streaming', relation: 'enables' }, { id: 'performance', relation: 'improves' }] },
        { id: 'performance', label: 'Performance Patterns', summary: 'Cut re-renders, split code, virtualize lists.', topicId: 'performance-patterns', relatesTo: [{ id: 'react-memo', relation: 'uses' }] },
      ],
    },
    {
      id: 'ts-with-react',
      name: 'TypeScript with React',
      concepts: [
        { id: 'typing-props-node', label: 'Typing Props', summary: 'Type component props, children, and unions.', topicId: 'typing-props', relatesTo: [{ id: 'typescript', relation: 'built on' }, { id: 'components', relation: 'describe' }] },
        { id: 'typing-hooks', label: 'Typing Hooks', summary: 'Generics for useState/useRef/useReducer.', topicId: 'typing-props', relatesTo: [{ id: 'usereducer', relation: 'types' }] },
        { id: 'typing-events', label: 'Typing Events', summary: 'React.ChangeEvent / MouseEvent / FormEvent.', topicId: 'typing-props', relatesTo: [{ id: 'events', relation: 'annotate' }] },
      ],
    },
    {
      id: 'ecosystem',
      name: 'Ecosystem',
      concepts: [
        { id: 'react-router', label: 'React Router', summary: 'Client-side routing for SPAs.', topicId: 'react-router', relatesTo: [{ id: 'app-router', relation: 'compared with' }] },
        { id: 'data-fetching', label: 'Data Fetching (Query/SWR)', summary: 'Cache, dedup, and revalidate server state.', topicId: 'data-fetching-patterns', relatesTo: [{ id: 'useeffect', relation: 'replaces' }, { id: 'rsc', relation: 'or done in' }] },
        { id: 'styling', label: 'Styling (Tailwind)', summary: 'Utility-first, zero-runtime styling.', topicId: 'performance-patterns', relatesTo: [{ id: 'rsc', relation: 'fits' }] },
        { id: 'testing', label: 'Testing (RTL/Vitest)', summary: 'Test behavior via React Testing Library.', topicId: 'custom-hooks', relatesTo: [{ id: 'components', relation: 'verifies' }] },
      ],
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      concepts: [
        { id: 'app-router', label: 'App Router', summary: 'File-system routing with nested layouts.', topicId: 'react-router', relatesTo: [{ id: 'rsc', relation: 'built on' }, { id: 'layouts', relation: 'uses' }] },
        { id: 'rsc', label: 'Server Components', summary: 'Render on the server; ship zero JS.', topicId: 'server-vs-client', relatesTo: [{ id: 'client-components', relation: 'boundary with' }, { id: 'server-actions', relation: 'call' }] },
        { id: 'client-components', label: 'Client Components', summary: '"use client" for interactivity at the leaves.', topicId: 'server-vs-client', relatesTo: [{ id: 'rsc', relation: 'nested in' }] },
        { id: 'layouts', label: 'Layouts & Streaming', summary: 'Persistent shells that stream with Suspense.', topicId: 'rendering-strategies', relatesTo: [{ id: 'suspense', relation: 'streams via' }] },
        { id: 'server-actions', label: 'Server Actions', summary: '"use server" mutations called from the client.', topicId: 'server-actions', relatesTo: [{ id: 'forms', relation: 'handle' }, { id: 'caching', relation: 'revalidate' }] },
      ],
    },
    {
      id: 'data-rendering',
      name: 'Data & Rendering',
      concepts: [
        { id: 'rendering-strategies', label: 'CSR/SSR/SSG/ISR', summary: 'Where and when HTML is produced.', topicId: 'rendering-strategies', relatesTo: [{ id: 'caching', relation: 'controlled by' }, { id: 'rsc', relation: 'chosen per route' }] },
        { id: 'caching', label: 'Fetch & Caching', summary: 'force-cache, no-store, revalidate, tags.', topicId: 'fetch-caching', relatesTo: [{ id: 'rendering-strategies', relation: 'determines' }, { id: 'server-actions', relation: 'invalidated by' }] },
        { id: 'streaming-suspense', label: 'Streaming & Suspense', summary: 'Send UI progressively with loading.tsx.', topicId: 'suspense-lazy', relatesTo: [{ id: 'layouts', relation: 'used in' }] },
      ],
    },
    {
      id: 'auth-production',
      name: 'Auth & Production',
      concepts: [
        { id: 'auth', label: 'Auth (NextAuth/Clerk)', summary: 'Sessions, providers, and route protection.', topicId: 'nextauth', relatesTo: [{ id: 'middleware', relation: 'enforced by' }, { id: 'rsc', relation: 'read in' }] },
        { id: 'middleware', label: 'Middleware', summary: 'Run code before a request (redirects, auth).', topicId: 'nextauth', relatesTo: [{ id: 'app-router', relation: 'guards' }] },
        { id: 'accessibility', label: 'Accessibility', summary: 'Semantic HTML, ARIA, focus, keyboard nav.', topicId: 'react-accessibility', relatesTo: [{ id: 'forms', relation: 'labels' }] },
        { id: 'i18n', label: 'Internationalization', summary: 'Locale routing and translated content.', topicId: 'react-i18n', relatesTo: [{ id: 'app-router', relation: 'routed by' }] },
        { id: 'realtime', label: 'Real-time', summary: 'WebSockets/SSE for live UI updates.', topicId: 'react-realtime', relatesTo: [{ id: 'client-components', relation: 'runs in' }] },
        { id: 'deployment', label: 'Deployment', summary: 'Build, env vars, and ship on Vercel.', topicId: 'deployment-production', relatesTo: [{ id: 'rendering-strategies', relation: 'realizes' }, { id: 'caching', relation: 'configures' }] },
      ],
    },
  ],
}
