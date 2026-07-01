import type { Cheatsheet } from '@/types'

/** React & Next.js quick-reference cheat sheets. */
export const REACT_CHEATSHEETS: Cheatsheet[] = [
  {
    id: 'hooks-reference',
    title: 'React Hooks Reference',
    subtitle: 'Core hooks, signatures, and the rules that govern them',
    icon: '🪝',
    sections: [
      {
        heading: 'State & reducers',
        entries: [
          { label: 'useState', value: 'const [n, setN] = useState(0) — updater setN(p => p + 1) for prev-based updates.', code: true },
          { label: 'useReducer', value: 'const [s, dispatch] = useReducer(reducer, init) — for complex/related transitions.', code: true },
          { label: 'Lazy init', value: 'useState(() => expensive()) — initializer runs once, not every render.', code: true },
          { label: 'useOptimistic', value: 'React 19: show optimistic UI while an async action (e.g. Server Action) is pending.', code: true },
        ],
      },
      {
        heading: 'Effects & refs',
        entries: [
          { label: 'useEffect', value: 'useEffect(fn, deps) — runs after paint; return a cleanup fn. For synchronizing with external systems.', code: true },
          { label: 'useLayoutEffect', value: 'Runs synchronously before paint — measure/mutate DOM to avoid flicker. Use sparingly.', code: true },
          { label: 'useRef', value: 'const r = useRef(null) — mutable box that survives renders and does NOT trigger re-render.', code: true },
          { label: 'ref as prop (19)', value: 'React 19: pass ref directly as a prop; forwardRef is no longer required.', code: true },
          { label: 'useImperativeHandle', value: 'Expose a custom imperative API from a component via its ref.', code: true },
        ],
      },
      {
        heading: 'Performance',
        entries: [
          { label: 'useMemo', value: 'Cache an expensive computed value: useMemo(() => compute(a), [a]).', code: true },
          { label: 'useCallback', value: 'Cache a function identity: useCallback(fn, deps) === useMemo(() => fn, deps).', code: true },
          { label: 'React.memo', value: 'Skip re-render when props are shallow-equal. Wrap the child component.', code: true },
          { label: 'useDeferredValue', value: 'Render a non-urgent value at low priority to keep input responsive.', code: true },
          { label: 'useTransition', value: 'const [isPending, startTransition] = useTransition() — mark updates as non-urgent.', code: true },
          { label: 'Compiler note', value: 'React 19 Compiler auto-memoizes; add manual memo only to fix a measured problem.' },
        ],
      },
      {
        heading: 'Context & external',
        entries: [
          { label: 'useContext', value: 'const v = useContext(MyContext) — read the nearest provider value.', code: true },
          { label: '<Context> as provider (19)', value: 'React 19: render <MyContext value={v}> directly; .Provider is optional.', code: true },
          { label: 'use()', value: 'React 19: read a promise or context inside render; unwraps with Suspense.', code: true },
          { label: 'useSyncExternalStore', value: 'Subscribe to an external store safely (used by Zustand/Redux internally).', code: true },
          { label: 'useId', value: 'Stable unique id for a11y (label/aria) that is SSR-safe.', code: true },
        ],
      },
      {
        heading: 'Actions (React 19)',
        entries: [
          { label: 'useActionState', value: 'const [state, action, isPending] = useActionState(fn, initial) — form action + result state.', code: true },
          { label: 'useFormStatus', value: 'Read pending state of the parent <form> from a child (e.g. a submit button).', code: true },
        ],
      },
      {
        heading: 'Rules of Hooks',
        entries: [
          { label: 'Top level only', value: 'Never call hooks inside conditions, loops, or nested functions — call order must be stable.' },
          { label: 'React functions only', value: 'Call hooks from components or other hooks, not plain functions.' },
          { label: 'Deps must be honest', value: 'List every reactive value the effect/memo reads; do not lie to the linter.' },
          { label: 'Custom hook = use*', value: 'Prefix with "use" so the linter enforces the rules on it.' },
        ],
      },
    ],
  },
  {
    id: 'jsx-rendering-gotchas',
    title: 'JSX & Rendering Gotchas',
    subtitle: 'The subtle rules that bite in real components',
    icon: '⚛️',
    sections: [
      {
        heading: 'JSX basics',
        entries: [
          { label: 'className', value: 'Use className, not class (JSX is JS — class is reserved).', code: true },
          { label: 'htmlFor', value: 'Use htmlFor instead of for on <label>.', code: true },
          { label: 'One root', value: 'Return one parent — use a Fragment <>...</> to avoid an extra wrapper div.', code: true },
          { label: 'Expressions only', value: '{ } takes expressions, not statements — no if/for; use ternary, &&, or .map().' },
          { label: 'Inline styles', value: 'style={{ marginTop: 8 }} — camelCased object, not a CSS string.', code: true },
        ],
      },
      {
        heading: 'Lists & keys',
        entries: [
          { label: 'Stable keys', value: 'key must be a stable id, not the array index (index breaks on reorder/insert).' },
          { label: 'Why keys matter', value: 'Keys let React match elements across renders to preserve state and diff efficiently.' },
          { label: 'Key placement', value: 'Put key on the outermost element returned by .map(), not inside the child.' },
        ],
      },
      {
        heading: 'Conditional rendering traps',
        entries: [
          { label: '0 leaks', value: '{count && <List/>} renders "0" when count is 0 — use count > 0 && ... instead.', code: true },
          { label: 'Ternary for else', value: '{ok ? <A/> : <B/>} — && only handles the truthy branch.', code: true },
          { label: 'Empty vs null', value: 'Return null (or false/undefined) to render nothing.' },
        ],
      },
      {
        heading: 'Re-render mental model',
        entries: [
          { label: 'What triggers render', value: 'State/props change, parent re-renders, or context value changes.' },
          { label: 'New object each render', value: 'Inline {} / [] / () => {} are new references every render — can break memoized children.' },
          { label: 'Derive, don\'t sync', value: 'Compute values during render instead of mirroring props into state via useEffect.' },
          { label: 'State updates batch', value: 'Multiple setState calls in one handler batch into a single re-render (auto in React 18+).' },
          { label: 'setState is async', value: 'Reading state right after setState gives the old value; use the updater form.' },
        ],
      },
      {
        heading: 'Effect gotchas',
        entries: [
          { label: 'StrictMode double-run', value: 'In dev, effects mount→unmount→mount to surface missing cleanup — that is intentional.' },
          { label: 'Cleanup races', value: 'Cancel fetches / ignore stale responses in the cleanup to avoid setting state after unmount.' },
          { label: 'Object/array deps', value: 'Non-primitive deps compare by reference — memoize them or depend on primitives.' },
          { label: 'You may not need an effect', value: 'Event? handle in the handler. Derived data? compute in render. Effects are for external systems.' },
        ],
      },
    ],
  },
  {
    id: 'typescript-react',
    title: 'TypeScript + React',
    subtitle: 'Typing props, hooks, events, and children',
    icon: '🧩',
    sections: [
      {
        heading: 'Component & props',
        entries: [
          { label: 'Props type', value: 'type Props = { title: string; count?: number }', code: true },
          { label: 'Function component', value: 'function Card({ title }: Props) { ... } — prefer typing props over React.FC.', code: true },
          { label: 'children', value: 'children: React.ReactNode — anything renderable.', code: true },
          { label: 'Extend element props', value: 'type Props = React.ComponentProps<\'button\'> & { variant: string }', code: true },
          { label: 'Discriminated union', value: 'type Props = { kind: \'a\'; a: string } | { kind: \'b\'; b: number } — exhaustive variants.', code: true },
        ],
      },
      {
        heading: 'Typing hooks',
        entries: [
          { label: 'useState explicit', value: 'useState<User | null>(null) — needed when initial is null/[].', code: true },
          { label: 'useRef DOM', value: 'const r = useRef<HTMLInputElement>(null); r.current?.focus()', code: true },
          { label: 'useRef mutable', value: 'useRef<number>(0) — value box, not a DOM node.', code: true },
          { label: 'useReducer', value: 'Type State and Action union; reducer: (s: State, a: Action) => State.', code: true },
          { label: 'Custom hook return', value: 'Return `as const` for a tuple: return [value, setValue] as const.', code: true },
        ],
      },
      {
        heading: 'Event handlers',
        entries: [
          { label: 'Click', value: '(e: React.MouseEvent<HTMLButtonElement>) => void', code: true },
          { label: 'Change (input)', value: '(e: React.ChangeEvent<HTMLInputElement>) => void', code: true },
          { label: 'Submit (form)', value: '(e: React.FormEvent<HTMLFormElement>) => void; e.preventDefault()', code: true },
          { label: 'Keyboard', value: '(e: React.KeyboardEvent<HTMLInputElement>) => void', code: true },
          { label: 'Inline is inferred', value: 'onClick={(e) => ...} — e is inferred; annotate only standalone handlers.' },
        ],
      },
      {
        heading: 'Patterns & pitfalls',
        entries: [
          { label: 'Avoid any', value: 'Prefer unknown + narrowing, or generics, over any.' },
          { label: 'ReactNode vs JSX.Element', value: 'Use ReactNode for children/props; JSX.Element is a single element only.' },
          { label: 'Generic component', value: 'function List<T>({ items, render }: { items: T[]; render: (t: T) => React.ReactNode })', code: true },
          { label: 'satisfies', value: 'const cfg = {...} satisfies Config — validate shape while keeping literal types.', code: true },
          { label: 'Async Server Component', value: 'async function Page(): Promise<React.ReactElement> — RSCs may be async.', code: true },
        ],
      },
    ],
  },
  {
    id: 'nextjs-app-router',
    title: 'Next.js App Router',
    subtitle: 'File conventions, rendering, and data (Next.js 15)',
    icon: '▲',
    sections: [
      {
        heading: 'Special files (app/)',
        entries: [
          { label: 'page.tsx', value: 'The route\'s UI. app/blog/page.tsx → /blog.', code: true },
          { label: 'layout.tsx', value: 'Shared, persistent wrapper for a segment; must render {children}.', code: true },
          { label: 'loading.tsx', value: 'Instant Suspense fallback while the segment streams.', code: true },
          { label: 'error.tsx', value: 'Client error boundary for the segment (has reset()).', code: true },
          { label: 'not-found.tsx', value: 'UI for notFound() calls or unmatched routes.', code: true },
          { label: 'route.ts', value: 'Route Handler — export GET/POST etc. for an API endpoint.', code: true },
          { label: 'template.tsx', value: 'Like layout but re-mounts per navigation (fresh state).', code: true },
        ],
      },
      {
        heading: 'Routing conventions',
        entries: [
          { label: 'Dynamic segment', value: 'app/blog/[slug]/page.tsx → params.slug', code: true },
          { label: 'Catch-all', value: 'app/docs/[...path] / optional [[...path]]', code: true },
          { label: 'Route groups', value: 'app/(marketing)/about — organize without affecting the URL.', code: true },
          { label: 'Parallel routes', value: '@slot folders render into named layout slots.', code: true },
          { label: 'params is async (15)', value: 'const { slug } = await params — params/searchParams are Promises.', code: true },
        ],
      },
      {
        heading: 'Rendering & caching',
        entries: [
          { label: 'Default', value: 'Components are Server Components; static unless you use dynamic data/APIs.' },
          { label: 'Force dynamic', value: "export const dynamic = 'force-dynamic' (SSR every request).", code: true },
          { label: 'Revalidate (ISR)', value: 'export const revalidate = 60 — regenerate at most every 60s.', code: true },
          { label: 'fetch cache', value: "fetch(url, { cache: 'force-cache' | 'no-store', next: { revalidate: 60 } })", code: true },
          { label: 'Tag + revalidate', value: 'fetch(url, { next: { tags: [\'posts\'] } }) then revalidateTag(\'posts\').', code: true },
          { label: 'generateStaticParams', value: 'Pre-render dynamic routes at build time (SSG).', code: true },
        ],
      },
      {
        heading: 'Data & mutations',
        entries: [
          { label: 'Fetch in RSC', value: 'async function Page(){ const data = await getData() } — no useEffect needed.', code: true },
          { label: 'Server Action', value: "'use server' fn called from a form action or event — runs on the server.", code: true },
          { label: 'Revalidate after write', value: 'Call revalidatePath(\'/blog\') or revalidateTag() inside the action.', code: true },
          { label: 'Redirect', value: 'redirect(\'/login\') / notFound() — control flow helpers.', code: true },
          { label: 'Metadata', value: 'export const metadata = {...} or async generateMetadata() for SEO.', code: true },
        ],
      },
      {
        heading: 'Client vs Server',
        entries: [
          { label: 'use client', value: 'First line of a file to opt that subtree into the client (state/effects/handlers).', code: true },
          { label: 'Keep boundary low', value: 'Push "use client" to leaves so most of the tree ships zero JS.' },
          { label: 'Server-only secrets', value: 'DB calls and secrets live in Server Components/Actions — never in client files.' },
          { label: 'next/link & next/image', value: 'Client-side nav prefetch + optimized, lazy images out of the box.' },
        ],
      },
    ],
  },
]
