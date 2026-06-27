import type { FlashcardData } from '@/types'

/** React+Next.js flashcard deck keyed by topic id. */
export const REACT_FLASHCARDS: FlashcardData = {

  /* ── Phase 0: JS/TS Essentials ─────────────────────────────────────── */
  'js-closures': [
    { id: 'jsc-1', q: 'What is a closure in JavaScript?', a: 'A closure is a function that retains access to its outer scope\'s variables even after the outer function has returned. It "closes over" the variables it references.' },
    { id: 'jsc-2', q: 'Why do stale closures happen in React hooks?', a: 'A handler created during one render captures that render\'s state value. If state updates but the handler isn\'t recreated (missing dep in deps array), it still reads the old value — a stale closure.' },
    { id: 'jsc-3', q: 'How do you fix a stale closure in useEffect?', a: 'Add the captured variable to the dependency array so React recreates the effect (and the function inside it) whenever that variable changes, giving the function access to the latest value.' },
    { id: 'jsc-4', q: 'What does the closure over loop variable problem look like?', a: 'In a for loop with var, each iteration\'s callback captures the same variable. By the time callbacks fire, the loop is done and all see the final value. Fix: use let (block scope) or a factory function.' },
    { id: 'jsc-5', q: 'How is a closure different from a class with private fields?', a: 'Both hide data, but a closure hides it in the function scope stack (no inheritance, no prototype chain). Classes with # fields use the class declaration itself as the privacy boundary.' },
  ],

  'js-async': [
    { id: 'jsa-1', q: 'What is the Event Loop and how does it relate to async/await?', a: 'The Event Loop picks tasks off the Microtask Queue (Promises, await) and Macro Task Queue (setTimeout). await suspends the function and resumes it via a microtask when the Promise settles — no thread blocking.' },
    { id: 'jsa-2', q: 'What is the difference between Promise.all and Promise.allSettled?', a: 'Promise.all rejects immediately if ANY promise rejects. Promise.allSettled waits for ALL and returns { status, value/reason } for each — use it when you need results even if some fail.' },
    { id: 'jsa-3', q: 'When should you use Promise.race?', a: 'When you want the result of the FASTEST promise — e.g., a timeout race: Promise.race([fetch(url), timeout(5000)]) rejects/resolves based on whichever settles first.' },
    { id: 'jsa-4', q: 'Why can\'t you return a value directly from an async function inside useEffect?', a: 'useEffect\'s callback must return either nothing or a cleanup function. async functions return Promises, which are truthy objects — React would try to call them as cleanup. Define an async inner function and call it instead.' },
    { id: 'jsa-5', q: 'What is the difference between concurrency and parallelism in JS?', a: 'JS is single-threaded — it achieves CONCURRENCY (interleaving tasks) via the Event Loop but not true parallelism. Web Workers add real parallelism but can\'t access the DOM.' },
  ],

  'ts-basics': [
    { id: 'tsb-1', q: 'What is the difference between interface and type in TypeScript?', a: 'Both define shapes. interface supports declaration merging (multiple declarations combine). type supports unions, intersections, and mapped types. For object shapes: prefer interface. For unions/intersections: use type.' },
    { id: 'tsb-2', q: 'What does the "unknown" type do and when do you use it?', a: 'unknown is the type-safe version of any. You can\'t call methods or access properties on unknown without first narrowing it (with typeof, instanceof, or a type guard). Use it for values from external APIs.' },
    { id: 'tsb-3', q: 'What is a type guard?', a: 'A function with return type "param is Type" that TypeScript uses to narrow a type inside an if block. Example: function isUser(x: unknown): x is User { return typeof x === "object" && x !== null && "id" in x; }' },
    { id: 'tsb-4', q: 'What is a discriminated union and why is it useful?', a: 'A union where each member has a shared "tag" field with a unique literal value. TypeScript narrows inside switch/if on the tag. Eliminates impossible state — e.g., { status: "loading" } | { status: "error"; error: string }.' },
    { id: 'tsb-5', q: 'What does "satisfies" do in TypeScript?', a: '"satisfies" validates that an expression matches a type WITHOUT widening the inferred type. Useful when you want to check a config object matches a type but keep the literal types for autocompletion.' },
  ],

  /* ── Phase 1: React Foundations ────────────────────────────────────── */
  'jsx-basics': [
    { id: 'jsx-1', q: 'What does JSX compile to?', a: 'JSX compiles to React.createElement() calls (pre-React 17) or calls to the jsx() import from "react/jsx-runtime" (React 17+ automatic transform). Both return plain JavaScript objects describing the UI.' },
    { id: 'jsx-2', q: 'Why must JSX have a single root element?', a: 'Because JSX compiles to a single function call return value. A function can only return one value. Use <></> (Fragment) to group multiple elements without adding a DOM node.' },
    { id: 'jsx-3', q: 'What is the difference between an expression and a statement in JSX?', a: 'JSX curly braces {} can only contain EXPRESSIONS (values: variables, ternary, function calls, map). Statements (if, for, switch) can\'t appear inside {}. Use ternary or && for conditionals, map() for lists.' },
    { id: 'jsx-4', q: 'Why do you need "key" when rendering lists?', a: 'React uses keys to identify which items changed, were added, or removed during re-renders. Without keys, React re-renders all list items. Keys must be stable and unique among siblings — not index if the list can reorder.' },
    { id: 'jsx-5', q: 'What happens if you use an index as a key in a reorderable list?', a: 'If items reorder, the keys stay the same (0,1,2...) but now refer to different data. React sees "key 0 is still there" and reuses the old component instance, causing stale state and missed updates.' },
  ],

  'component-fundamentals': [
    { id: 'cf-1', q: 'What triggers a React component to re-render?', a: 'Three things: 1) State changes (setState/useState setter). 2) Props changes from the parent. 3) Context value changes. A re-render runs the function body again and diffs the output — it doesn\'t necessarily repaint the DOM.' },
    { id: 'cf-2', q: 'What is the difference between a re-render and a DOM update?', a: 'Re-render = React runs your function component again and produces new virtual DOM. DOM update = React compares old vs new virtual DOM (reconciliation) and only patches the actual DOM where differences exist.' },
    { id: 'cf-3', q: 'What is the difference between controlled and uncontrolled components?', a: 'Controlled: React state drives the value, onChange syncs back. Uncontrolled: the DOM owns the value; you read it with a ref. Controlled = single source of truth. Uncontrolled = needed for file inputs or 3rd-party DOM libs.' },
    { id: 'cf-4', q: 'Why are React components named with a capital letter?', a: 'JSX uses the case to distinguish HTML (lowercase = native DOM element) from React components (uppercase = function/class call). <button> → createElement("button"). <Button> → createElement(Button).' },
    { id: 'cf-5', q: 'Can a React component return null? What happens?', a: 'Yes. Returning null renders nothing — the component mounts (so effects still run) but produces no DOM nodes. This is useful for conditional rendering where an empty container is undesirable.' },
  ],

  'use-state': [
    { id: 'ust-1', q: 'Why is setState asynchronous? When does state actually update?', a: 'React batches state updates and applies them before the next render. State updates in event handlers are batched in React 18+ (automatic batching). Inside setTimeout or async code, they were synchronous pre-18; batched post-18.' },
    { id: 'ust-2', q: 'What happens if you call the setState setter with the same value?', a: 'React bails out (skips re-render) if the new state is identical to the old state (Object.is comparison). For objects/arrays this means the same reference — mutating an object and setting it won\'t re-render.' },
    { id: 'ust-3', q: 'Why should you use the functional form of setState?', a: 'setState(fn) receives the LATEST state as an argument, even inside closures. setState(val) uses the value captured when the closure was created, which can be stale if multiple updates are batched.' },
    { id: 'ust-4', q: 'What is the difference between useState and useRef for storing values?', a: 'useState triggers a re-render when changed. useRef is a plain object (.current) that persists across renders but changing it does NOT trigger a re-render. Use useRef for values that track render internals (interval IDs, prev values).' },
    { id: 'ust-5', q: 'What is the "lifting state up" pattern?', a: 'When two sibling components need to share state, move the state to their nearest common ancestor and pass it down as props. This makes the ancestor the single source of truth.' },
  ],

  'use-effect': [
    { id: 'uef-1', q: 'What are the three ways to use useEffect\'s dependency array?', a: '1) No array: runs after EVERY render. 2) Empty []: runs only on mount (and cleanup on unmount). 3) [dep1, dep2]: runs when any dep changes. Always use the exhaustive-deps ESLint rule.' },
    { id: 'uef-2', q: 'What does the useEffect cleanup function do?', a: 'It runs before the effect re-runs (on dep change) and on unmount. Use it to cancel subscriptions, clear intervals/timeouts, or abort fetch requests — prevents memory leaks and stale callbacks.' },
    { id: 'uef-3', q: 'Why does React run effects twice in StrictMode in development?', a: 'To detect side effects that don\'t clean up properly. React intentionally mounts → unmounts → mounts to verify your effect + cleanup pair is idempotent. This only happens in dev with StrictMode.' },
    { id: 'uef-4', q: 'How do you safely fetch data in useEffect?', a: 'Create an AbortController, pass its signal to fetch, and in cleanup call controller.abort(). Also check an `isMounted` flag or the abort signal before setting state to avoid updating an unmounted component.' },
    { id: 'uef-5', q: 'What is the difference between useEffect and useLayoutEffect?', a: 'useEffect runs asynchronously AFTER the browser paints. useLayoutEffect runs synchronously AFTER DOM mutations but BEFORE the browser paints. Use useLayoutEffect to read layout (getBoundingClientRect) without flicker.' },
  ],

  'use-ref': [
    { id: 'urf-1', q: 'What are the two main uses of useRef?', a: '1) DOM access: attach to a JSX element via ref={myRef} to get myRef.current pointing to the DOM node. 2) Persistent value: store a value that survives re-renders without triggering one (timers, previous state, mutable flags).' },
    { id: 'urf-2', q: 'How do you focus an input programmatically in React?', a: 'const ref = useRef(null); attach ref={ref} to the <input>; call ref.current.focus() inside useEffect or an event handler. Never in the render body — the DOM node isn\'t available until after render.' },
    { id: 'urf-3', q: 'What is forwardRef and when do you need it?', a: 'By default you can\'t pass a ref to a function component. forwardRef wraps the component and receives (props, ref) — it can attach the ref to an inner DOM node. React 19 passes ref as a regular prop without forwardRef.' },
    { id: 'urf-4', q: 'What is useImperativeHandle used for?', a: 'Combined with forwardRef, it lets you expose a custom object on the forwarded ref instead of the raw DOM node. Useful for component libraries that expose specific methods (like .scrollTo()) to the parent.' },
    { id: 'urf-5', q: 'Why shouldn\'t you read ref.current during render?', a: 'During render, the ref may not be populated yet (first render) or may point to a stale DOM node. Refs are set AFTER the render is committed to the DOM. Read refs only in effects or event handlers.' },
  ],

  'use-context': [
    { id: 'uc-1', q: 'What problem does Context solve?', a: 'Prop drilling — passing data through many intermediate components that don\'t need it just to reach a deep descendant. Context provides a way to share values globally within a component tree without props.' },
    { id: 'uc-2', q: 'When does a context consumer re-render?', a: 'Every time the context VALUE changes (not just when the Provider re-renders). If the value is an object literal created inline, it\'s a new reference on every parent render — wrap it in useMemo to prevent unnecessary consumer re-renders.' },
    { id: 'uc-3', q: 'What is the pattern for separating data context from action context?', a: 'Create two contexts: one for state (changes frequently, causes re-renders) and one for dispatch/setters (stable, wrapped in useCallback or Zustand actions). Consumers that only dispatch don\'t re-render when state changes.' },
    { id: 'uc-4', q: 'What is the difference between Context and Zustand/Redux?', a: 'Context is a React primitive for sharing values — it doesn\'t optimize re-renders for frequently updated data. Zustand/Redux are external stores with subscription-based selective re-renders (only subscribed components re-render).' },
    { id: 'uc-5', q: 'How do you create a typed custom context hook?', a: 'Create context with createContext<T | null>(null), then write useMyContext() that calls useContext and throws if the value is null. This enforces that the hook is only used inside its Provider.' },
  ],

  'use-reducer': [
    { id: 'ur-1', q: 'When should you use useReducer instead of useState?', a: 'When you have: 3+ related state values, state transitions that depend on multiple current values, or complex update logic. useReducer centralizes logic and makes state machines testable as pure functions.' },
    { id: 'ur-2', q: 'What signature does a reducer function have?', a: '(state: S, action: Action) => S. It must be a PURE function — same inputs always produce same outputs, no side effects. The new state is returned, never mutate the existing state.' },
    { id: 'ur-3', q: 'How do you handle async operations with useReducer?', a: 'Dispatch a "loading" action, then after the async operation dispatches "success" or "error" with the data. The async logic lives in the event handler (or a custom hook), NOT in the reducer itself.' },
    { id: 'ur-4', q: 'What is the action pattern / flux standard action?', a: 'Each action is an object with a "type" discriminant and optional "payload". TypeScript discriminated unions work perfectly: type Action = { type: "inc" } | { type: "set"; payload: number }.' },
    { id: 'ur-5', q: 'Can you use useReducer instead of Redux for global state?', a: 'Yes — combine useReducer with Context. But for large apps, external stores like Zustand are better because they don\'t re-render all Context consumers on every action — only components that subscribe to changed slices.' },
  ],

  'custom-hooks': [
    { id: 'ch-1', q: 'What are the rules for naming a custom hook?', a: 'MUST start with "use". React uses this prefix to apply the Rules of Hooks linter and to detect hook calls in unexpected places. The name should describe what it does: useWindowSize, useLocalStorage, useDebounce.' },
    { id: 'ch-2', q: 'What is the benefit of extracting logic into a custom hook?', a: 'Reuse stateful logic across components without duplicating code. Unlike HOCs or render props, custom hooks don\'t change the component tree. They keep components clean — the component only handles rendering.' },
    { id: 'ch-3', q: 'Can two components using the same custom hook share state?', a: 'No. Each component gets its own isolated hook instance. To share state between components, lift it into a shared parent, or use Context, or an external store (Zustand).' },
    { id: 'ch-4', q: 'What is the "as const" trick for custom hook return types?', a: 'Return an array with "as const" — e.g., return [value, toggle] as const — so TypeScript infers a typed tuple [boolean, () => void] instead of (boolean | (() => void))[], which loses positional types.' },
    { id: 'ch-5', q: 'How do you test a custom hook in isolation?', a: 'Use @testing-library/react\'s renderHook() utility. It renders the hook in a minimal component wrapper and lets you call act() to trigger state updates without testing the rendering output.' },
  ],

  'use-memo-callback': [
    { id: 'umc-1', q: 'What is the core purpose of useMemo?', a: 'To memoize an expensive computed value — the function only re-runs when deps change. Also used to maintain a stable object/array reference so it can be used safely in other hook dependency arrays.' },
    { id: 'umc-2', q: 'What is the core purpose of useCallback?', a: 'To return a stable function reference that only changes when deps change. This prevents creating a new function object on every render — only useful when the function is passed to a React.memo-wrapped child component.' },
    { id: 'umc-3', q: 'Why is useCallback pointless without React.memo?', a: 'useCallback gives you a stable function reference, but if the child isn\'t wrapped in React.memo it re-renders regardless of props. You need BOTH: React.memo to skip renders + useCallback to make the function reference stable.' },
    { id: 'umc-4', q: 'How do you measure if useMemo is actually helping?', a: 'Use console.time() or the Performance API around the computation, or use React DevTools Profiler. If the computation takes < 1ms, the memoization overhead may cost more than the computation itself.' },
    { id: 'umc-5', q: 'What does React.memo do?', a: 'Wraps a component and skips re-rendering if props haven\'t changed (shallow comparison). Only the parent\'s re-render is skipped — the child still re-renders on its own state changes or consumed context changes.' },
  ],

  /* ── Phase 4: TypeScript with React ────────────────────────────────── */
  'typing-props': [
    { id: 'tp-1', q: 'What TypeScript type represents anything that can be rendered by React?', a: 'React.ReactNode — includes JSX elements, strings, numbers, null, undefined, and arrays of these. ReactElement is stricter (JSX only). PropsWithChildren<P> adds children: React.ReactNode to any props type.' },
    { id: 'tp-2', q: 'How do you extend native HTML element props in TypeScript?', a: 'Use React.ComponentProps<"button"> or React.ButtonHTMLAttributes<HTMLButtonElement> as the base type, then spread with ...rest. This gives you all native button props without listing them manually.' },
    { id: 'tp-3', q: 'How do you type a component that accepts any HTML element\'s ref?', a: 'Use forwardRef with the element type: React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => <button ref={ref} {...props} />). React 19 removes the need for forwardRef — pass ref as a regular prop.' },
    { id: 'tp-4', q: 'What is a discriminated union prop and why is it useful?', a: 'Mutually exclusive prop combinations enforced at compile time. Example: { variant: "icon"; icon: ReactNode } | { variant: "text"; label: string } — TypeScript prevents mixing icon and text props.' },
    { id: 'tp-5', q: 'How do you type a generic component in TSX files?', a: 'Use <T,> (with trailing comma) to avoid TSX parsing it as a JSX tag: function List<T,>({ items }: { items: T[] }). Or use <T extends unknown> to be explicit.' },
  ],

  'typing-hooks': [
    { id: 'th-1', q: 'When do you need to explicitly type useState?', a: 'When the initial value is null, undefined, or [] — TypeScript can\'t infer the full type. Example: useState<User | null>(null) instead of useState(null) which gives type never.' },
    { id: 'th-2', q: 'How do you type the return value of a custom hook that returns a tuple?', a: 'Return [value, setter] as const — TypeScript infers [boolean, Dispatch<...>] instead of (boolean | Dispatch<...>)[]. Or explicitly annotate the return type: : [boolean, () => void].' },
    { id: 'th-3', q: 'How do you type a useRef for a DOM element?', a: 'useRef<HTMLInputElement>(null) — the generic specifies the element type, giving you typed access to .current.value, .focus(), etc. Without a generic, .current is RefObject<unknown>.' },
    { id: 'th-4', q: 'How do you type useReducer?', a: 'TypeScript infers from the reducer function: useReducer(reducer, initialState). Define a discriminated union for Action type and an interface for State. The reducer\'s type annotation constrains everything.' },
    { id: 'th-5', q: 'How do you infer a context type without duplicating the interface?', a: 'Use ReturnType<typeof useAuth> or createContext<ReturnType<typeof makeContextValue>>(null!). The context type is derived from the value-producing function — one source of truth.' },
  ],

  'zod-rhf': [
    { id: 'zr-1', q: 'What is the benefit of using Zod with React Hook Form?', a: 'Zod schema = validation rules + TypeScript types in ONE declaration. @hookform/resolvers/zod connects them. You get runtime validation on submit AND compile-time types for field values — zero duplication.' },
    { id: 'zr-2', q: 'How do you get the TypeScript type from a Zod schema?', a: 'z.infer<typeof schema> — e.g., type FormValues = z.infer<typeof loginSchema>. Pass this type to useForm<FormValues>() for fully typed register(), watch(), and setValue().' },
    { id: 'zr-3', q: 'What is the difference between z.string().email() and z.string().refine()?', a: 'Built-in validators like .email() have standard error messages and are composable. .refine() lets you write any custom validation with a predicate and custom error. .superRefine() gives access to the ctx for multiple issues.' },
    { id: 'zr-4', q: 'How do you display Zod validation errors in React Hook Form?', a: 'Destructure errors from formState: const { errors } = formState. Access per field: errors.email?.message. RHF automatically maps Zod issues to the errors object keyed by field name.' },
    { id: 'zr-5', q: 'What is z.discriminatedUnion and when is it better than z.union?', a: 'z.discriminatedUnion("type", [...schemas]) is faster for large unions — it picks the schema to try based on the discriminant key. z.union tries every schema; discriminatedUnion only tries the matching one.' },
  ],

  /* ── Phase 6: Next.js Foundations ──────────────────────────────────── */
  'what-is-nextjs': [
    { id: 'nxt-1', q: 'What problems does Next.js solve that plain React doesn\'t?', a: 'File-based routing, server-side rendering, static generation, API routes, image optimization, font optimization, and React Server Components — all without manual webpack/babel configuration.' },
    { id: 'nxt-2', q: 'What is the difference between Next.js and Create React App?', a: 'CRA is a client-side SPA bundler with no server. Next.js is a full-stack framework with SSR, SSG, API routes, and middleware. CRA is effectively deprecated; Next.js is the production standard for React apps.' },
    { id: 'nxt-3', q: 'What is the Next.js App Router?', a: 'A file-system-based router using the app/ directory where folders map to URL segments. Special files (page.tsx, layout.tsx, loading.tsx) have reserved meanings. Components are Server Components by default.' },
    { id: 'nxt-4', q: 'What are the core performance optimizations Next.js provides out of the box?', a: 'Automatic code splitting per route, image optimization with next/image (WebP, lazy load, size hints), font optimization with next/font (no FOUT, self-hosted), and prefetching visible links.' },
    { id: 'nxt-5', q: 'What is Turbopack and when should you use it?', a: 'Turbopack is a Rust-based bundler replacing Webpack in Next.js. Enable it with next dev --turbo. Dramatically faster cold starts and HMR. Stable for dev in Next.js 14+. Use it unless you hit compatibility issues.' },
  ],

  'server-vs-client': [
    { id: 'svc-1', q: 'What is a React Server Component (RSC)?', a: 'A component that renders on the server only. It can directly await databases, file systems, and APIs — no useEffect, no useState, no event handlers. Its output is serialized and streamed to the client. Zero client bundle impact.' },
    { id: 'svc-2', q: 'How do you make a Client Component in the App Router?', a: 'Add "use client" at the TOP of the file. This marks the file and all its imports as the boundary — everything in this file is included in the client bundle. Push this boundary as deep as possible.' },
    { id: 'svc-3', q: 'Can a Server Component import a Client Component?', a: 'Yes — SC can import CC. The CC will render on the server for the initial HTML and then hydrate on the client. The SC cannot pass non-serializable values (functions, class instances) to the CC as props.' },
    { id: 'svc-4', q: 'Can a Client Component import a Server Component?', a: 'No — once you\'re in the client bundle, imports stay client. EXCEPTION: you can pass a SC as a prop (children or a slot) from a parent SC to a CC. The SC renders on the server; the output passes through as props.' },
    { id: 'svc-5', q: 'What is the "use client" boundary rule?', a: '"use client" marks a MODULE boundary — every import in that file is now in the client bundle. Components that use hooks, event handlers, or browser APIs must be Client Components. Everything else should stay as Server Components.' },
  ],

  'fetch-caching': [
    { id: 'fc-1', q: 'How does Next.js extend the native fetch API?', a: 'Next.js patches global fetch to add a cache option: { cache: "force-cache" } (default, cached), "no-store" (always fresh), and { next: { revalidate: N } } for ISR-style revalidation every N seconds.' },
    { id: 'fc-2', q: 'What is Request Memoization in Next.js?', a: 'Identical fetch() calls with the same URL+options within a single request are deduplicated automatically by Next.js — even if called in multiple components during the same render. The response is shared.' },
    { id: 'fc-3', q: 'What is the difference between revalidatePath and revalidateTag?', a: 'revalidatePath("/blog") clears the cache for a specific URL. revalidateTag("posts") clears all fetches tagged with fetch(url, { next: { tags: ["posts"] } }). Tags are more granular and reusable.' },
    { id: 'fc-4', q: 'What does "no-store" do in a fetch call?', a: 'Bypasses the Next.js data cache — the response is never stored. The route becomes dynamic (per-request). Equivalent to getServerSideProps behavior in the Pages Router.' },
    { id: 'fc-5', q: 'What is the difference between the Data Cache and the Router Cache?', a: 'Data Cache: persists fetch responses across requests (server-side). Router Cache: client-side in-memory cache of RSC payloads for visited routes — enables instant back/forward navigation without re-fetching.' },
  ],

  'server-actions': [
    { id: 'sa-1', q: 'What is a Server Action in Next.js?', a: 'An async function marked with "use server" that runs on the server. It can be called from a Client Component or a form\'s action prop. The browser sends a POST request; Next.js routes it to the function. No API endpoint needed.' },
    { id: 'sa-2', q: 'How do you define a Server Action in a Client Component file?', a: 'You CANNOT — "use client" and "use server" can\'t coexist in the same file. Define the action in a separate file with "use server" at the top (or per-function) and import it into the Client Component.' },
    { id: 'sa-3', q: 'How do you show loading state while a Server Action is pending?', a: 'In a form: use useFormStatus() in a child component — its pending prop is true while the action runs. In a button handler: useTransition() gives you [isPending, startTransition] to wrap the action call.' },
    { id: 'sa-4', q: 'How do you return validation errors from a Server Action?', a: 'Return a plain object — e.g., { errors: { email: "Invalid email" } }. The Client Component reads this return value from useActionState(action, null). Pair with Zod for server-side validation.' },
    { id: 'sa-5', q: 'When should you use a Server Action vs an API route?', a: 'Server Action: mutations from components, form submissions within the app. API route: when you need a public HTTP endpoint consumed by external clients, mobile apps, or third-party webhooks.' },
  ],

  /* ── Phase 7: Next.js Data ──────────────────────────────────────────── */
  'rendering-strategies': [
    { id: 'rs-1', q: 'How does Next.js determine if a route is static or dynamic?', a: 'Static by default. Becomes dynamic when the component uses: cookies(), headers(), searchParams, or fetch with no-store. You can override with export const dynamic = "force-static" | "force-dynamic".' },
    { id: 'rs-2', q: 'What is Incremental Static Regeneration (ISR) in the App Router?', a: 'Set export const revalidate = N (seconds) in a page/layout. Next.js serves the cached static page and regenerates it in the background after N seconds have passed since the last generation.' },
    { id: 'rs-3', q: 'What is streaming in Next.js and why does it matter?', a: 'Server-side rendering that sends HTML in chunks. Fast components stream first; slow ones send when ready. Users see content progressively instead of waiting for the slowest piece. Enabled by Suspense boundaries.' },
    { id: 'rs-4', q: 'What is generateStaticParams used for?', a: 'In dynamic routes ([slug]/page.tsx), it returns an array of param objects to pre-generate at build time. Equivalent to getStaticPaths in the Pages Router. Runs at build time, not per-request.' },
    { id: 'rs-5', q: 'What is the Partial Prerendering (PPR) feature in Next.js?', a: 'A Next.js 14+ experimental feature. The page shell is statically generated (instant from CDN); dynamic parts (wrapped in Suspense) are streamed in. Combines SSG speed with SSR freshness in one page.' },
  ],

  /* ── Phase 8: Auth & Production ─────────────────────────────────────── */
  'nextauth': [
    { id: 'na-1', q: 'What is the entry point to configure NextAuth (Auth.js v5)?', a: 'Create auth.ts at the root with: import NextAuth from "next-auth". Export { handlers, signIn, signOut, auth } = NextAuth({ providers: [...] }). The handlers go in app/api/auth/[...nextauth]/route.ts.' },
    { id: 'na-2', q: 'How do you protect a page using NextAuth in the App Router?', a: 'Call auth() from next-auth inside a Server Component or middleware: const session = await auth(). If null, redirect to sign-in. Or use NextAuth middleware with a matcher config to guard routes automatically.' },
    { id: 'na-3', q: 'How do you access the session in a Client Component?', a: 'Use SessionProvider from "next-auth/react" in the root layout (Client Component), then call useSession() in any Client Component to read the session. On the server, call auth() directly instead.' },
    { id: 'na-4', q: 'What is a Credentials provider and what are its risks?', a: 'A provider for email/password login. You write the authorize() function that validates credentials. Risk: you\'re responsible for hashing passwords (bcrypt), rate limiting, and secure session management — more surface area for mistakes.' },
    { id: 'na-5', q: 'What is the difference between the JWT and database session strategies?', a: 'JWT: session stored in a signed cookie — no DB lookup per request, stateless, but can\'t instantly revoke. Database: session stored in DB, looked up per request — can revoke instantly but adds a DB query to every request.' },
  ],

  'prisma-database': [
    { id: 'pd-1', q: 'What is Prisma and how does it differ from writing raw SQL?', a: 'Prisma is a type-safe ORM. Your schema.prisma file is the source of truth — npx prisma generate creates a fully-typed client. prisma.user.findMany() gives autocomplete and TypeScript type safety; raw SQL gives none.' },
    { id: 'pd-2', q: 'What is the Prisma singleton pattern and why is it needed in Next.js?', a: 'In dev, Next.js hot-reload creates new module instances, which would create a new PrismaClient each time — exhausting DB connections. Store the client on global so it survives hot-reloads: global.prisma ?? new PrismaClient().' },
    { id: 'pd-3', q: 'What is the difference between prisma migrate dev and migrate deploy?', a: 'migrate dev: for local development — creates migration files, applies them, resets if there are conflicts. migrate deploy: for production — only applies existing migration files, never resets. Use in CI/CD pipelines.' },
    { id: 'pd-4', q: 'What is the N+1 query problem and how does Prisma solve it?', a: 'Loading N items then making 1 additional query per item = N+1 queries. Prisma\'s include: { relation: true } performs a JOIN or batches queries — all data in one roundtrip instead of N+1.' },
    { id: 'pd-5', q: 'How do you run Prisma queries in Next.js Server Components?', a: 'Import the prisma singleton and await it directly: const posts = await prisma.post.findMany(). Server Components can run async code. No API route needed. Never import prisma in Client Components.' },
  ],

}
