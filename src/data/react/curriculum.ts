import type { CurriculumTopic } from '@/types'
import { REACT_EXTRA_TOPICS } from './curriculum-extra'
import { weaveTopics } from '@/lib/mergeCurriculum'

/** All React+Next.js curriculum topics — 78 topics across 9 phases. */
const REACT_CURRICULUM_BASE: CurriculumTopic[] = [

  /* â”€â”€ PHASE 0: JS & TS Essentials â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'js-essentials', phase: 0, phaseName: 'JS & TS Essentials',
    orderIndex: 1, estimatedMins: 30, prerequisites: [],
    title: 'Modern JavaScript Must-Knows',
    eli5: 'Before you can build with React you need to speak modern JavaScript — things like unpacking boxes (destructuring), copying lists (spread), asking "is this thing here?" (optional chaining), and short ways to write functions.',
    analogy: 'React code is like a recipe written in a dialect of JavaScript. You have to understand the dialect before you can read the recipe.',
    explanation: 'Modern JS (ES6+) introduced syntax that React code uses constantly: destructuring, spread/rest, template literals, optional chaining (?.), nullish coalescing (??), and short-circuit evaluation. Without these, you will misread React props and state code on your first day.',
    technicalDeep: 'Destructuring works on arrays and objects: `const { name, age = 0 } = user` pulls fields out and provides defaults. Spread copies shallowly: `{ ...obj, key: newVal }` is how React state updates are written. Optional chaining short-circuits: `user?.profile?.avatar` returns undefined instead of throwing. Nullish coalescing `??` only falls back on null/undefined, not 0 or "". Template literals `` `Hello ${name}` `` replace string concat. Arrow functions `(x) => x * 2` capture the surrounding `this` — critical for event handlers.',
    whatBreaks: 'Mutating objects/arrays directly instead of spreading them is the #1 React bug — it fools the equality check and state updates are silently ignored.',
    efficientWay: {
      title: 'Learning modern JS for React',
      approaches: [
        { name: 'Practice each feature in the browser console', verdict: 'best', reason: 'Instant feedback. Destructure some real data, spread some objects, see the result.' },
        { name: 'Read the MDN page per feature', verdict: 'ok', reason: 'Good reference but passive — you need to type it, not just read it.' },
        { name: 'Skip it and learn as you go in React', verdict: 'weak', reason: 'You will spend 50% of React debugging time confused by JS syntax, not React concepts.' }
      ],
      recommendation: 'Spend one session (2h) running each feature in the browser console on real data. The goal is recognition, not mastery — you will deepen understanding while writing React.'
    },
    commonMistakes: [
      'Mutating state objects directly (`state.count++`) — always return a new reference.',
      'Confusing `||` and `??` — `||` falls back on ANY falsy value including 0 and "", which breaks number inputs.',
      'Arrow functions vs function declarations in class methods — in React hooks this rarely matters, but know the difference.'
    ],
    seniorNotes: 'In code review, spread misuse (`[...arr]` at the wrong level) is the most common subtle bug. The team\'s ESLint config usually catches direct mutation — know what "no-mutating-props" and "prefer-const" rules enforce.',
    interviewQuestions: [
      'What is the difference between `??` and `||`?',
      'Why does `{ ...obj, key: val }` create a new object reference instead of mutating?',
      'What does optional chaining return when it short-circuits?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Essential patterns you will see in every React file',
        code: `// Destructuring with defaults
const { name, role = 'user', address: { city } = {} } = userObj;

// Spread for immutable updates (the React way)
const newState = { ...oldState, count: oldState.count + 1 };
const newList  = [...items, newItem];           // add
const filtered = items.filter(i => i.id !== id); // remove

// Optional chaining + nullish coalescing
const avatar = user?.profile?.avatar ?? '/default.png';

// Short-circuit rendering (used EVERYWHERE in JSX)
const el = isLoggedIn && <Dashboard />;
const label = count > 0 ? \`\${count} items\` : 'Empty';

// Template literals
const url = \`/api/users/\${userId}/posts?page=\${page}\`;`
      }
    ]
  },

  {
    id: 'arrow-functions-closures', phase: 0, phaseName: 'JS & TS Essentials',
    orderIndex: 2, estimatedMins: 20, prerequisites: ['js-essentials'],
    title: 'Arrow Functions & Closures',
    eli5: 'A closure is a function that "remembers" the variables from where it was created, like a sticky note attached to a backpack. Arrow functions are a short way to write functions that automatically keep that sticky note.',
    analogy: 'A closure is a backpack. The function is the traveler. Whatever was in the room when the backpack was packed, the traveler carries with them forever.',
    explanation: 'Closures allow inner functions to access outer variables even after the outer function returns. In React, closures are everywhere: event handlers capture state values, useEffect callbacks capture deps, and stale closures are a common bug. Arrow functions (`=>`) inherit `this` from their surrounding scope — critical for object methods used as callbacks.',
    technicalDeep: 'Each call to a function creates a new closure scope. In React: `const handleClick = () => setCount(count + 1)` — this handler "closes over" the current `count` value. If `count` is stale (the component re-rendered), you get a stale closure bug. Fix: use the functional update form `setCount(c => c + 1)`. Arrow functions do NOT have their own `this`, `arguments`, or `prototype`. IIFE pattern `(() => { ... })()` is how the existing tutors are structured.',
    whatBreaks: 'Stale closures in useEffect: capturing a value in the dependency array but forgetting to list it — the effect runs with an outdated snapshot of the value.',
    efficientWay: {
      title: 'Understanding closures deeply',
      approaches: [
        { name: 'Build a counter using closures manually before hooks', verdict: 'best', reason: 'Once you see a closure-based counter, useState\'s mental model clicks instantly.' },
        { name: 'Read Kyle Simpson\'s "You Don\'t Know JS" closures chapter', verdict: 'ok', reason: 'Deep but slow — good for understanding, not for shipping.' },
        { name: 'Memorize arrow function syntax and move on', verdict: 'weak', reason: 'Stale closures will haunt you in every useEffect until you actually understand why.' }
      ],
      recommendation: 'Write a manual counter with closures (no React). Then write the same thing with useState. The comparison reveals exactly what the hook does for you.'
    },
    commonMistakes: [
      'Using `function` inside useEffect and expecting it to see updated state.',
      'Creating functions inside loops expecting each to capture a different value (classic closure-in-loop bug).',
      'Using arrow functions as React class component methods without understanding why `this` binding matters.'
    ],
    seniorNotes: 'The functional update pattern `setState(prev => ...)` is the closure-safe form — it receives the latest state rather than closing over a potentially stale snapshot. Always use it when new state depends on old state.',
    interviewQuestions: [
      'What is a stale closure and how does it manifest in React hooks?',
      'Why do arrow functions not have their own `this`?',
      'What is the functional update form of useState and when should you use it?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Stale closure vs functional update fix',
        code: `// BUG: stale closure — count is captured once
const [count, setCount] = useState(0);
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // always adds 1 to the INITIAL 0
  }, 1000);
  return () => clearInterval(id);
}, []); // [] means count is never updated in the closure

// FIX: functional update — always uses latest value
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1); // c is the CURRENT state, not a closure
  }, 1000);
  return () => clearInterval(id);
}, []);`
      }
    ]
  },

  {
    id: 'array-methods', phase: 0, phaseName: 'JS & TS Essentials',
    orderIndex: 3, estimatedMins: 25, prerequisites: ['js-essentials'],
    title: 'Array Methods for React',
    eli5: 'React uses arrays to show lists of things. The magic tricks — map, filter, find, reduce — let you transform, search, and summarize those lists without writing big loops.',
    analogy: 'An array is a factory conveyor belt. `map` transforms every item, `filter` lets some fall off, `find` stops at the first match, `reduce` smashes everything into one result.',
    explanation: '`map` turns every element into a new element — this is how you render lists in JSX. `filter` keeps elements that pass a test — used for search, hiding completed items. `find`/`findIndex` locate one item. `reduce` aggregates. `some`/`every` check conditions. None of these mutate the original array, which is exactly what React requires.',
    technicalDeep: '`[].map(fn)` returns a NEW array of the same length. `[].filter(fn)` returns a subset. Both are O(n). For React lists, every mapped element needs a stable `key` prop — React uses it to reconcile. `reduce` with object accumulator is the pattern for grouping data for charts/summaries. `flatMap` maps then flattens one level — useful when one item produces multiple elements. Array spreading is O(n) so avoid it inside tight render loops.',
    whatBreaks: 'Returning `undefined` from a map (forgetting `return` in a multi-line arrow) gives an array of undefined — JSX renders nothing. Forgetting `key` on mapped elements causes React to re-render everything instead of patching.',
    efficientWay: {
      title: 'Mastering array methods',
      approaches: [
        { name: 'Practice on real API data (JSONPlaceholder)', verdict: 'best', reason: 'Filtering todos, mapping user names to <li> tags — this is literally what you will do in React.' },
        { name: 'LeetCode array problems', verdict: 'ok', reason: 'Builds skill but the problems are contrived — context differs from React usage.' },
        { name: 'Just use for loops', verdict: 'weak', reason: 'Imperative loops work but miss the declarative mental model React expects.' }
      ],
      recommendation: 'Fetch the JSONPlaceholder `/todos` endpoint in the browser console and practice: map titles to strings, filter by completed, find a specific id, reduce to a count by userId. 30 minutes is enough.'
    },
    commonMistakes: [
      'Mutating inside map/filter (`item.checked = true; return item`) — creates the same reference, React skips the update.',
      'Using the array index as the key when the list can reorder — causes wrong diffs.',
      'Chaining map().filter() when filter().map() is faster (filter first, then map fewer items).'
    ],
    seniorNotes: 'For large lists (500+ items), `Array.prototype` methods are still fast, but consider virtualization (react-window) before reaching for memoization. The real bottleneck is DOM nodes, not the JS transforms.',
    interviewQuestions: [
      'Why should you not use the array index as a key for a sortable list?',
      'What does `flatMap` do that `map` does not?',
      'How does `reduce` differ from `map` and `filter`?'
    ],
    codeExamples: [
      {
        lang: 'jsx',
        label: 'Array methods in React JSX',
        code: `const todos = [
  { id: 1, text: 'Learn React', done: true },
  { id: 2, text: 'Build an app', done: false },
  { id: 3, text: 'Deploy', done: false },
];

// map → render a list
const items = todos.map(todo => (
  <li key={todo.id} style={{ opacity: todo.done ? 0.5 : 1 }}>
    {todo.text}
  </li>
));

// filter → show only incomplete
const pending = todos.filter(t => !t.done);

// find → get one
const first = todos.find(t => t.id === 2);  // { id:2, text:'Build...' }

// reduce → count done
const doneCount = todos.reduce((acc, t) => acc + (t.done ? 1 : 0), 0);`
      }
    ]
  },

  {
    id: 'async-await', phase: 0, phaseName: 'JS & TS Essentials',
    orderIndex: 4, estimatedMins: 25, prerequisites: ['arrow-functions-closures'],
    title: 'Promises & async/await',
    eli5: 'Fetching data from the internet takes time. A Promise is a ticket that says "your data will be ready soon." async/await lets you write "wait for the ticket" in a style that looks like normal code instead of nested callbacks.',
    analogy: 'A Promise is a restaurant buzzer. You order (start the async work), get a buzzer (the Promise), go sit down (continue other code), and the buzzer vibrates when your food is ready (`.then` / `await`).',
    explanation: 'All data fetching in React uses Promises. `async/await` is syntax sugar over `.then/.catch` chains. In React components, you cannot use `await` directly inside render — you use it inside `useEffect` callbacks or event handlers. Network errors must be caught with try/catch or `.catch()`.',
    technicalDeep: 'The JS event loop: synchronous code runs first, then microtasks (Promises), then macrotasks (setTimeout). `await` suspends the async function at that point and yields control back to the event loop — the UI thread keeps painting. `Promise.all([a,b,c])` runs all concurrently and resolves when all complete. `Promise.allSettled` resolves even if some reject. `Promise.race` resolves/rejects with the first to finish. `fetch()` returns a Promise that resolves to a `Response` — you must `await response.json()` to get the body.',
    whatBreaks: 'Forgetting to `await response.json()` returns a Response object, not data. Uncaught Promise rejections crash silently in React unless an Error Boundary catches them. Creating async functions inside `useEffect` directly returns a Promise which React warns about — wrap in an immediately-invoked async function instead.',
    efficientWay: {
      title: 'Getting comfortable with async',
      approaches: [
        { name: 'Build a simple fetch-and-display component', verdict: 'best', reason: 'Loading/error/success states are the core pattern — you will write it hundreds of times.' },
        { name: 'Study Promise internals (micro/macro task queue)', verdict: 'ok', reason: 'Deep understanding but overkill before you have hands-on experience.' },
        { name: 'Just use an async library (axios, react-query) and skip Promises', verdict: 'weak', reason: 'When something breaks you will have no mental model to debug it.' }
      ],
      recommendation: 'Write a fetch-user component three times: once with raw `.then()`, once with async/await, once with a loading/error state. The third version is what you will write for real.'
    },
    commonMistakes: [
      '`useEffect(async () => { ... })` — useEffect cannot accept an async function directly; wrap the call inside.',
      'Not handling the component-unmounted case — setState on an unmounted component causes memory leaks.',
      'Missing the second `await` for `response.json()` when using `fetch`.'
    ],
    seniorNotes: 'Use `AbortController` to cancel in-flight fetches when a component unmounts. The pattern is: `const controller = new AbortController(); fetch(url, { signal: controller.signal })` and `return () => controller.abort()` in the useEffect cleanup.',
    interviewQuestions: [
      'Why can\'t you pass an async function directly to useEffect?',
      'What is the difference between Promise.all and Promise.allSettled?',
      'How do you cancel a fetch when a component unmounts?'
    ],
    codeExamples: [
      {
        lang: 'jsx',
        label: 'Correct async data fetching in useEffect',
        code: `function UserProfile({ userId }) {
  const [user, setUser]   = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUser() {
      try {
        const res  = await fetch(\`/api/users/\${userId}\`, { signal: controller.signal });
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
    return () => controller.abort(); // cleanup on unmount
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;
  return <h1>{user.name}</h1>;
}`
      }
    ]
  },

  {
    id: 'es-modules', phase: 0, phaseName: 'JS & TS Essentials',
    orderIndex: 5, estimatedMins: 15, prerequisites: ['js-essentials'],
    title: 'ES Modules (import/export)',
    eli5: 'Modules let you split code into files and share pieces between them. `export` is like putting something in a store window. `import` is like taking it off the shelf in another store.',
    analogy: 'A module is a LEGO set box. Each box exports specific pieces. Other boxes can import exactly the pieces they need — nobody dumps all the pieces into one pile.',
    explanation: 'React apps are built from dozens of files, each a module. Named exports (`export const`) let you export multiple things from one file. Default exports (`export default`) export one main thing. `import` statements tell bundlers (Vite/Webpack) to link the files — tree-shaking removes unused imports from the final bundle.',
    technicalDeep: 'ES modules are static: `import` statements are hoisted and analyzed at compile time, which enables tree-shaking. Dynamic `import()` is a function that returns a Promise — this is how React.lazy works for code splitting. Re-exports `export { X } from "./y"` create barrel files (index.ts). Barrels are convenient but can break tree-shaking if the bundler cannot statically analyze them — some teams ban barrel files for this reason. `import type { User }` imports TypeScript types only; erased at build time, no runtime cost.',
    whatBreaks: 'Circular imports (A imports B, B imports A) cause undefined values at runtime — one module loads before its dependency. Barrel files with side-effect imports can cause unexpected code to run. Mixing CommonJS (`require`) with ESM (`import`) breaks in Node without configuration.',
    efficientWay: {
      title: 'Learning modules',
      approaches: [
        { name: 'Read how Vite handles imports while building a project', verdict: 'best', reason: 'Seeing the module graph in the Vite build output makes it concrete.' },
        { name: 'Memorize named vs default export syntax', verdict: 'ok', reason: 'Necessary but not sufficient — you need to understand what bundlers do with it.' },
        { name: 'Use all default exports to keep it simple', verdict: 'weak', reason: 'Large codebases need named exports for good auto-import and tree-shaking.' }
      ],
      recommendation: 'Always prefer named exports. Default exports make refactoring harder (rename the export, every importer can choose any name). The one exception: React components in files that each export one thing.'
    },
    commonMistakes: [
      'Mixing `module.exports` (CommonJS) with `import/export` (ESM) in the same project.',
      'Barrel files (`index.ts` that re-exports everything) that prevent tree-shaking.',
      'Using `export default` for utilities — named exports are easier to refactor and auto-import.'
    ],
    seniorNotes: 'Dynamic `import()` is the foundation of React.lazy and Next.js `next/dynamic` — both code-split at that boundary. The browser downloads that chunk only when the component is first rendered, improving initial load.',
    interviewQuestions: [
      'What is tree-shaking and what enables it in ES modules?',
      'What is the difference between a named and default export?',
      'How does `React.lazy` use dynamic imports under the hood?'
    ],
    codeExamples: [
      {
        lang: 'javascript',
        label: 'Named exports, default exports, dynamic import',
        code: `// utils.ts — named exports (preferred for utilities)
export function formatDate(d: Date) { return d.toLocaleDateString(); }
export const API_URL = 'https://api.example.com';

// UserCard.tsx — default export (ok for components)
export default function UserCard({ name }: { name: string }) {
  return <div>{name}</div>;
}

// page.tsx — importing both styles
import UserCard from './UserCard';          // default
import { formatDate, API_URL } from './utils'; // named

// Code splitting with dynamic import
const HeavyChart = React.lazy(() => import('./HeavyChart'));`
      }
    ]
  },

  {
    id: 'ts-types-interfaces', phase: 0, phaseName: 'JS & TS Essentials',
    orderIndex: 6, estimatedMins: 30, prerequisites: ['es-modules'],
    title: 'TypeScript: Types & Interfaces',
    eli5: 'TypeScript is JavaScript with labels on everything. Instead of guessing what a function expects, TypeScript tells you: "this needs a name (string) and an age (number)." If you give it the wrong thing, it yells before the code even runs.',
    analogy: 'TypeScript is a strict receptionist at a party. Every guest (variable) needs the right wristband (type). If you show up with the wrong one, you are turned away at compile time, not after embarrassing yourself at the door.',
    explanation: 'TypeScript catches type errors at development time, not runtime. `type` creates aliases for any type expression. `interface` describes object shapes and can be extended with `extends`. In React, you type props with interfaces, state with generics, and API responses with mapped types. TypeScript is compiled away — zero runtime cost.',
    technicalDeep: 'Type vs Interface: interfaces support `extends` and declaration merging (two files can add to the same interface). Types support unions, intersections, and mapped types. For React props, both work; teams pick one convention. Union types `string | null` model nullable data. Intersection `A & B` merges shapes. Literal types `\'asc\' | \'desc\'` restrict to exact string values — perfect for enums. `as const` makes an object\'s values literal types. The `satisfies` operator (TS 4.9) checks a type without widening, preserving inference.',
    whatBreaks: '`any` defeats the purpose of TypeScript — treat it as a red flag in code review. `unknown` is the safe alternative: you must narrow before using. Type assertions `as SomeType` can lie to the compiler and cause runtime crashes.',
    efficientWay: {
      title: 'Learning TypeScript for React',
      approaches: [
        { name: 'Type every React component prop from day one', verdict: 'best', reason: 'Props are the most common TS usage in React — instant feedback, always in context.' },
        { name: 'Read the TypeScript handbook end-to-end first', verdict: 'ok', reason: 'Good reference but you\'ll forget 80% before you apply it.' },
        { name: 'Skip TypeScript until you are comfortable with React', verdict: 'weak', reason: 'Adding TS later to an existing codebase is painful — it\'s easier to start typed.' }
      ],
      recommendation: 'Start every project in TypeScript. For the first week, type only props and state. Reach for utility types (Partial, Pick) when you notice repetition. TypeScript gets easier fast.'
    },
    commonMistakes: [
      'Using `any` to silence errors instead of fixing the type.',
      'Confusing `interface` declaration merging with class inheritance.',
      'Forgetting that optional props `name?: string` mean `string | undefined`, not `string | null`.'
    ],
    seniorNotes: 'In code review, `// @ts-ignore` and `as any` are red flags that warrant a comment explaining WHY. Prefer `// @ts-expect-error` (fails if the error disappears) over `// @ts-ignore` (silently continues). Typed API response shapes are worth the effort — they catch backend contract breaks at compile time.',
    interviewQuestions: [
      'What is the difference between `type` and `interface` in TypeScript?',
      'When would you use `unknown` instead of `any`?',
      'What does `as const` do to an object literal?'
    ],
    codeExamples: [
      {
        lang: 'typescript',
        label: 'Types and interfaces in a React context',
        code: `// Interface for props
interface UserCardProps {
  name: string;
  age: number;
  role?: 'admin' | 'user';  // optional, literal union
  onDelete: (id: number) => void;
}

// Type alias for a union
type Status = 'idle' | 'loading' | 'success' | 'error';

// Type alias for an API shape
type ApiUser = {
  id: number;
  email: string;
  createdAt: string; // ISO date string from API
};

// Extending an interface
interface AdminUser extends ApiUser {
  permissions: string[];
}

// as const — values become literal types
const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number]; // 'admin' | 'user' | 'guest'`
      }
    ]
  },

  {
    id: 'ts-generics', phase: 0, phaseName: 'JS & TS Essentials',
    orderIndex: 7, estimatedMins: 25, prerequisites: ['ts-types-interfaces'],
    title: 'TypeScript Generics',
    eli5: 'A generic is a type with a blank to fill in. `Array<string>` is "an array, filled in with: string." You write a function once, and TypeScript figures out the types automatically depending on what you pass in.',
    analogy: 'Generics are cookie cutters. The cutter defines the shape; you choose the dough (the type). One cutter, many cookies.',
    explanation: 'Generics let you write reusable code that works with different types while remaining type-safe. `useState<User | null>(null)` tells React the state holds a User or null. Custom hooks are almost always generic. Component props can be generic to accept varying data shapes.',
    technicalDeep: 'Syntax: `function identity<T>(val: T): T { return val; }`. TypeScript infers `T` from the argument most of the time — you rarely need to annotate explicitly. Constraints `<T extends object>` restrict what types can fill the blank. Multiple type params `<T, K extends keyof T>` are common in utility functions. `useState<T>` in React is `function useState<S>(initial: S | (() => S)): [S, Dispatch<SetStateAction<S>>]`. Generic components in TSX need a workaround: `<T,>` (trailing comma) or `<T extends unknown>` to avoid JSX parser ambiguity with `<T>`.',
    whatBreaks: 'Using `any` instead of a generic defeats type inference. Over-constraining generics makes them too rigid. In `.tsx` files, `<T>` is interpreted as a JSX tag — always write `<T,>` or `<T extends unknown>` for generic arrow functions.',
    efficientWay: {
      title: 'Learning generics',
      approaches: [
        { name: 'Read how useState is typed in the React source', verdict: 'best', reason: 'It is a generic you use every day — understanding it makes all others easier.' },
        { name: 'Write a generic fetch function for the API response type', verdict: 'best', reason: 'Immediately useful and teaches constraints at the same time.' },
        { name: 'Skip generics and annotate types explicitly every time', verdict: 'weak', reason: 'You will end up duplicating types and they will drift out of sync.' }
      ],
      recommendation: 'Write a `useFetch<T>(url: string): { data: T | null, loading, error }` hook. It forces you to use generics meaningfully in about 20 lines.'
    },
    commonMistakes: [
      'Writing `<T>` instead of `<T,>` in `.tsx` arrow functions — TS parses it as a JSX tag.',
      'Defaulting to `any` when generics feel complicated — `unknown` with narrowing is almost always better.',
      'Over-constraining: `<T extends string>` when you just need `T` — adds friction with no benefit.'
    ],
    seniorNotes: 'Mapped types `{ [K in keyof T]: ... }` and conditional types `T extends U ? X : Y` are advanced generics that power libraries like Zod and tRPC. You don\'t need to write them often, but reading them is essential for understanding library types.',
    interviewQuestions: [
      'Why do generic arrow functions in `.tsx` need a trailing comma: `<T,>`?',
      'What is a type constraint and why would you use `<T extends object>`?',
      'How does TypeScript infer the generic type parameter when you call a generic function?'
    ],
    codeExamples: [
      {
        lang: 'typescript',
        label: 'Generic useFetch hook',
        code: `// A generic hook — T is inferred from the call site
function useFetch<T>(url: string) {
  const [data, setData]     = useState<T | null>(null);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then((d: T) => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoad(false));
  }, [url]);

  return { data, loading, error };
}

// Usage — T is inferred as User
interface User { id: number; name: string; }
const { data: user } = useFetch<User>('/api/me');
//    user is User | null — fully typed!`
      }
    ]
  },

  {
    id: 'ts-utility-types', phase: 0, phaseName: 'JS & TS Essentials',
    orderIndex: 8, estimatedMins: 20, prerequisites: ['ts-types-interfaces'],
    title: 'TypeScript Utility Types',
    eli5: 'Utility types are shortcuts for common type transformations. `Partial<User>` means "User but everything is optional." `Pick<User, "name">` means "only the name field." They prevent you from rewriting the same type in slightly different ways.',
    analogy: 'Utility types are like dress-up accessories for your types. The same base outfit (User), but Partial adds a question mark to every button, Pick takes only the jacket.',
    explanation: 'TypeScript ships with utility types that transform existing types. These appear constantly in React code: `Partial<T>` for form states, `Pick<T, K>` for component props that only need some fields, `Omit<T, K>` for stripping sensitive fields, `Record<K, V>` for lookup objects, `ReturnType<F>` for inferring hook return types.',
    technicalDeep: 'Key built-in utilities: `Partial<T>` — all keys optional. `Required<T>` — all keys required. `Readonly<T>` — immutable. `Pick<T, "a"|"b">` — keep those keys. `Omit<T, "password">` — exclude those keys. `Record<string, number>` — object with that key/value type. `Extract<T, U>` — intersection of unions. `Exclude<T, U>` — remove U from T union. `NonNullable<T>` — removes null/undefined. `ReturnType<typeof fn>` — the return type of a function. `Parameters<typeof fn>` — tuple of param types. These are implemented with mapped and conditional types under the hood.',
    whatBreaks: 'Over-using `Partial<T>` for forms means every field is `string | undefined`, which causes null checks everywhere. Better to have a separate FormValues type with only the fields the form touches.',
    efficientWay: {
      title: 'Learning utility types',
      approaches: [
        { name: 'Find a place in your app where you duplicate a type and replace it with a utility', verdict: 'best', reason: 'Immediately useful and memorable because it solves a real pain.' },
        { name: 'Read the TypeScript docs page of utility types end-to-end', verdict: 'ok', reason: 'Good reference but you need a real use case to make them stick.' },
        { name: 'Avoid them and write every type manually', verdict: 'weak', reason: 'You will end up with duplicate types that drift apart as the base type changes.' }
      ],
      recommendation: 'Learn Partial, Pick, Omit, and Record first — they appear in 90% of React code. Learn ReturnType and Parameters when you start writing utility hooks.'
    },
    commonMistakes: [
      'Using `Partial<User>` for form values when only some fields are present — creates confusing optionality.',
      'Forgetting `ReturnType<typeof hook>` when you need to type the return value without duplicating it.',
      'Using `Record<string, any>` — defeats type safety; use `Record<string, User>` or a mapped type.'
    ],
    seniorNotes: '`ReturnType<typeof useSomeHook>` is the key pattern for sharing the hook\'s return type without coupling to its internals. Context providers often export their type this way: `export type AuthContextType = ReturnType<typeof useAuthProvider>`.',
    interviewQuestions: [
      'What is the difference between `Pick` and `Omit`?',
      'When would you use `Partial<T>` vs creating a new type with optional fields?',
      'How does `ReturnType<typeof fn>` work?'
    ],
    codeExamples: [
      {
        lang: 'typescript',
        label: 'Common utility types in React patterns',
        code: `interface User {
  id: number;
  name: string;
  email: string;
  password: string; // never send to client
  createdAt: Date;
}

// Omit sensitive field for the API response
type PublicUser = Omit<User, 'password'>;

// Pick only what a card component needs
type UserCardProps = Pick<User, 'id' | 'name' | 'email'>;

// Partial for update/patch payloads
type UserPatch = Partial<Pick<User, 'name' | 'email'>>;

// Record for a lookup table
const userMap: Record<number, PublicUser> = {};
users.forEach(u => { userMap[u.id] = u; });

// ReturnType for hook return types
function useAuth() {
  return { user: null as User | null, logout: () => {} };
}
type AuthContext = ReturnType<typeof useAuth>;`
      }
    ]
  },

  {
    id: 'ts-narrowing', phase: 0, phaseName: 'JS & TS Essentials',
    orderIndex: 9, estimatedMins: 20, prerequisites: ['ts-types-interfaces'],
    title: 'Type Narrowing & Guards',
    eli5: 'Narrowing is TypeScript checking your "is this thing what I think it is?" tests. If you check `if (typeof x === "string")` TypeScript knows x is a string inside the block — it gets smarter as you write more checks.',
    analogy: 'Narrowing is like a bouncer who checks IDs. After the check, TypeScript knows exactly who got in — it stops treating everyone as a suspicious `unknown`.',
    explanation: 'TypeScript narrows types based on control flow: `typeof`, `instanceof`, `in`, truthiness checks, and discriminated unions all narrow. In React, narrowing matters when handling API responses, event targets, and prop unions. Discriminated unions (a union where each member has a unique literal field) make exhaustive narrowing possible.',
    technicalDeep: 'Type guards: `typeof x === "string"` narrows primitives. `x instanceof Date` narrows class instances. `"field" in obj` narrows to types that have that field. `Array.isArray(x)` narrows to array. Custom type predicates: `function isUser(x: unknown): x is User { return ... }` — the `is` keyword tells TS what the true branch knows. Discriminated unions: `{ kind: "circle"; radius: number } | { kind: "rect"; width: number }` — switch on `kind` and TypeScript knows which branch you\'re in. Exhaustive check pattern: `const _: never = state` after a switch — TS errors if you miss a case.',
    whatBreaks: '`as SomeType` is NOT narrowing — it is an assertion that bypasses the check and can lie. Use `is` predicates instead. Forgetting to narrow after `JSON.parse()` (returns `any`) means you lose all type safety.',
    efficientWay: {
      title: 'Learning narrowing',
      approaches: [
        { name: 'Model API loading states as a discriminated union', verdict: 'best', reason: '`type State = { status: "loading" } | { status: "error"; message: string } | { status: "ok"; data: User }` is the single most useful pattern.' },
        { name: 'Read the TS handbook narrowing chapter', verdict: 'ok', reason: 'Good reference, with good examples — solid 30 min read.' },
        { name: 'Use optional fields instead of discriminated unions', verdict: 'weak', reason: '`{ data?: User; error?: string; loading?: boolean }` allows illegal states like both data and error being set simultaneously.' }
      ],
      recommendation: 'Replace your next `{ data?: T, error?: string, loading?: boolean }` state with a discriminated union. The exhaustive switch will immediately show you why narrowing is worth it.'
    },
    commonMistakes: [
      'Using `as SomeType` (assertion) instead of writing a real type guard.',
      'Not handling all union members — TypeScript\'s `never` check catches this at compile time.',
      'Treating `null` and `undefined` as the same — `x != null` narrows both, but `x !== null` only narrows null.'
    ],
    seniorNotes: 'Discriminated unions eliminate the "impossible state" bug class. `{ data: User; error: null } | { data: null; error: string }` makes it structurally impossible to have both or neither. This pattern is used by tRPC, React Query\'s result types, and most well-typed APIs.',
    interviewQuestions: [
      'What is a discriminated union and why is it useful for React state?',
      'What is the difference between a type assertion (`as`) and a type guard?',
      'How do you write an exhaustive type check in TypeScript?'
    ],
    codeExamples: [
      {
        lang: 'typescript',
        label: 'Discriminated union for fetch state',
        code: `type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

function UserView() {
  const [state, setState] = useState<FetchState<User>>({ status: 'idle' });

  // Narrowing via discriminated union
  switch (state.status) {
    case 'idle':    return <button onClick={fetch}>Load</button>;
    case 'loading': return <Spinner />;
    case 'error':   return <p>Error: {state.message}</p>; // TS knows .message exists
    case 'success': return <UserCard user={state.data} />; // TS knows .data exists
    default: {
      const _exhaustive: never = state; // compile error if a case is missing
      return null;
    }
  }
}`
      }
    ]
  },

  {
    id: 'dom-events', phase: 0, phaseName: 'JS & TS Essentials',
    orderIndex: 10, estimatedMins: 20, prerequisites: ['js-essentials'],
    title: 'DOM & Browser Events',
    eli5: 'The DOM is the browser\'s model of your webpage as a tree of boxes. Events are things that happen (click, type, scroll). React replaces direct DOM manipulation with a Virtual DOM — understanding what React abstracts away helps you know when you need to go around it.',
    analogy: 'The DOM is the room\'s furniture. Native events are when someone touches furniture. React is an interior designer who works with blueprints (Virtual DOM) and only physically moves furniture when the blueprint changes.',
    explanation: 'React wraps native DOM events with `SyntheticEvent` — a cross-browser wrapper. You almost never touch the real DOM in React, but you need to know it exists for: third-party libraries that manipulate DOM directly, `useRef` for DOM access, `document.addEventListener` for global events, and `getBoundingClientRect()` for positioning.',
    technicalDeep: 'React 17+ uses event delegation on the root element instead of individual elements — all events bubble up to one listener. `SyntheticEvent` is pooled in React 16 (no longer in 17+). Event propagation: capture phase (down the tree) → target → bubble phase (up the tree). `e.stopPropagation()` stops bubbling. `e.preventDefault()` prevents default browser behavior (like form submit navigating the page). `useRef` gives a stable reference to the actual DOM node for cases like: focus management, scroll control, measuring element size, integrating non-React libraries.',
    whatBreaks: '`e.target.value` works for input events; `e.target` is typed as `EventTarget` in TypeScript which has no `.value` — cast to `HTMLInputElement`. Attaching event listeners to `document` inside useEffect without removing them in cleanup causes memory leaks.',
    efficientWay: {
      title: 'Understanding the DOM in a React context',
      approaches: [
        { name: 'Use useRef to integrate a non-React chart library', verdict: 'best', reason: 'Forces you to understand exactly when React interacts with the real DOM.' },
        { name: 'Read the MDN event reference', verdict: 'ok', reason: 'Good when you need a specific event, not as a starting point.' },
        { name: 'Avoid DOM APIs entirely and rely on React abstractions', verdict: 'weak', reason: 'You will hit a wall the first time you need to measure an element or focus an input programmatically.' }
      ],
      recommendation: 'Build a tooltip component that uses `getBoundingClientRect()` to position itself. It forces useRef, real DOM events, and understanding of when React paints.'
    },
    commonMistakes: [
      'Casting `e.target` as `HTMLInputElement` without checking it is actually an input.',
      'Not removing `document.addEventListener` in useEffect cleanup.',
      'Directly manipulating `ref.current` style during render instead of in an effect.'
    ],
    seniorNotes: 'React\'s event system means you never call `removeEventListener` for JSX handlers — React handles it. But `useEffect`-attached `document` / `window` listeners need manual cleanup. This distinction is one of the top causes of memory leaks in React apps.',
    interviewQuestions: [
      'What is the difference between event capturing and event bubbling?',
      'Why does React use a SyntheticEvent wrapper instead of native DOM events?',
      'When would you use useRef to access a DOM node directly?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'useRef for DOM access + typed event handler',
        code: `function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Access real DOM after React renders
    inputRef.current?.focus();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // e.target IS HTMLInputElement here — React types it correctly
    console.log(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') e.currentTarget.blur();
    if (e.key === 'Enter')  e.preventDefault(); // stop form submission
  }

  return <input ref={inputRef} onChange={handleChange} onKeyDown={handleKeyDown} />;
}`
      }
    ]
  },

  /* â”€â”€ PHASE 1: React Foundations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'what-is-react', phase: 1, phaseName: 'React Foundations',
    orderIndex: 11, estimatedMins: 25, prerequisites: ['js-essentials'],
    title: 'What is React? Virtual DOM & Reconciliation',
    eli5: 'React is a tool for building web pages that update smartly. Instead of redrawing the whole page when something changes, React keeps a pretend copy of the page in memory, figures out the smallest possible change, and only updates that tiny part in the real browser.',
    analogy: 'The real DOM is an Etch A Sketch — to change one line you have to shake the whole thing. React\'s Virtual DOM is a rough sketch on paper. You change the sketch, then transfer only the differences to the Etch A Sketch.',
    explanation: 'React is a UI library (not a framework) for building component trees. The Virtual DOM is React\'s in-memory representation of the UI. When state changes, React creates a new Virtual DOM tree, diffs it against the previous one (reconciliation), and applies the minimum changes to the real DOM. This makes updates fast and the developer experience declarative.',
    technicalDeep: 'React\'s reconciliation algorithm (Fiber, introduced in React 16) breaks rendering into units of work that can be paused, prioritized, and resumed. Key insight: same position + same component type = update in place; different type = destroy and recreate. React 18 introduced concurrent features: `useTransition`, `useDeferredValue`, and the new root API allow React to work on multiple state updates simultaneously, yielding to the browser between chunks to keep the UI responsive. The `key` prop is the reconciler\'s identity signal — changing a key forces full unmount + remount.',
    whatBreaks: 'Returning different component types from the same conditional position causes the reconciler to unmount/remount instead of update, losing component state. Using unstable `Math.random()` or array-index keys on reorderable lists causes wrong diffs.',
    efficientWay: {
      title: 'Learning React\'s mental model',
      approaches: [
        { name: 'Build a counter, then break it with a key change to see remounting', verdict: 'best', reason: 'Seeing reconciliation in action in the DevTools is faster than reading about it.' },
        { name: 'Read the React Fiber architecture blog post', verdict: 'ok', reason: 'Deep and accurate, but dense — better after you have hands-on experience.' },
        { name: 'Skip the theory and jump straight to coding', verdict: 'weak', reason: 'You will misread performance issues and fight the reconciler instead of using it.' }
      ],
      recommendation: 'Open React DevTools Profiler on any component tree. Record an interaction. Look at what re-rendered and why. This single exercise teaches reconciliation more than any article.'
    },
    commonMistakes: [
      'Thinking React updates the whole page on every state change — it only updates the changed subtree.',
      'Nesting component definitions inside render functions — creates a new component type every render, forcing unmount/remount.',
      'Treating the Virtual DOM as a performance win in all cases — for very simple UIs, direct DOM manipulation is faster. React wins at scale.'
    ],
    seniorNotes: 'In interviews: React\'s reconciliation is O(n) (linear scan of both trees), not the theoretical O(n³) of arbitrary tree diffing — it makes two assumptions: elements of different types produce different trees, and the key prop is stable identity. Both are your responsibility as the developer.',
    interviewQuestions: [
      'What is the Virtual DOM and how does reconciliation work?',
      'What does changing a component\'s `key` prop do?',
      'How does React Fiber improve on the original reconciler?'
    ],
    codeExamples: [
      {
        lang: 'jsx',
        label: 'How key affects reconciliation',
        code: `// SAME key — React UPDATES the existing Input (keeps focus, value, state)
function App() {
  const [tab, setTab] = useState('home');
  return (
    <>
      <button onClick={() => setTab('home')}>Home</button>
      <button onClick={() => setTab('about')}>About</button>
      {tab === 'home' ? <Input key="shared" /> : <Input key="shared" />}
    </>
  );
}

// DIFFERENT key — React UNMOUNTS old, MOUNTS new (resets all state)
// Use this intentionally to reset a form when userId changes:
<UserForm key={userId} userId={userId} />`
      }
    ]
  },

  {
    id: 'vite-setup', phase: 1, phaseName: 'React Foundations',
    orderIndex: 12, estimatedMins: 20, prerequisites: ['es-modules'],
    title: 'Project Setup with Vite + TypeScript',
    eli5: 'Vite is the tool that sets up your React workshop. It creates all the files, starts a fast preview server, and when you\'re ready, packages everything up neatly to send to the internet.',
    analogy: 'Vite is the scaffolding crew. They set up the construction site (project files, server, build pipeline) so the builders (you) can start building immediately without worrying about the crane.',
    explanation: 'Vite is the de-facto React build tool in 2024+. It uses ES module native imports in development (instant HMR — hot module replacement) and Rollup for production builds. Create a TypeScript React project in seconds: `npm create vite@latest my-app -- --template react-ts`. No configuration needed to start.',
    technicalDeep: 'Vite\'s dev server serves source files as ES modules — the browser requests each file, Vite transforms on demand (no bundling). This is why HMR is instant regardless of app size. In production, Vite uses Rollup with code splitting at dynamic `import()` boundaries. Key config: `vite.config.ts` for aliases (`@/` → `./src/`), proxy (for dev API calls to avoid CORS), and environment variables. `.env` files: `VITE_` prefix makes vars available in client code via `import.meta.env.VITE_API_URL`. Non-prefixed vars stay server-only. `tsconfig.json` `paths` must match Vite aliases for TypeScript to resolve correctly.',
    whatBreaks: '`process.env.REACT_APP_*` (Create React App convention) does not work in Vite — use `import.meta.env.VITE_*`. The `public/` folder is served as-is; `src/assets/` goes through the bundler (gets hashed for cache busting).',
    efficientWay: {
      title: 'Getting started with Vite',
      approaches: [
        { name: 'npm create vite@latest, follow the prompts, start coding', verdict: 'best', reason: 'You\'re building in 2 minutes. Config can come later.' },
        { name: 'Set up Webpack manually to understand the pipeline', verdict: 'ok', reason: 'Good education, bad use of time when Vite exists.' },
        { name: 'Use Create React App', verdict: 'weak', reason: 'CRA is deprecated, slow, and not maintained. Vite is the standard.' }
      ],
      recommendation: 'Run `npm create vite@latest`. Pick React + TypeScript + SWC (faster compiler). Immediately add your ESLint + Prettier config. Then start building.'
    },
    commonMistakes: [
      'Using `process.env.REACT_APP_X` from old CRA habits — Vite uses `import.meta.env.VITE_X`.',
      'Not configuring `@/` path aliases — leads to relative import hell (`../../../../components/`).',
      'Committing `.env` files — use `.env.example` as a template, `.env.local` for real values.'
    ],
    seniorNotes: 'For monorepos, Turborepo + Vite workspaces is the current best practice. Vite\'s `preview` command (`npm run preview`) serves the production build locally — always run this before deploying to catch asset and routing issues the dev server hides.',
    interviewQuestions: [
      'How is Vite\'s dev server different from Webpack\'s in how it serves files?',
      'How do you expose an environment variable to client code in Vite?',
      'What is the difference between the `public/` folder and `src/assets/` in a Vite project?'
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'Scaffold and configure a React+TS project',
        code: `# Create the project
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install

# Add path aliases (vite.config.ts)
# import { defineConfig } from 'vite'
# import react from '@vitejs/plugin-react-swc'
# import path from 'path'
# export default defineConfig({
#   plugins: [react()],
#   resolve: { alias: { '@': path.resolve(__dirname, './src') } }
# })

# Add to tsconfig.json compilerOptions:
# "paths": { "@/*": ["./src/*"] }

# Install dev tools
npm i -D eslint prettier eslint-plugin-react-hooks

# .env.local (gitignored)
# VITE_API_URL=http://localhost:3001`
      }
    ]
  },

  {
    id: 'jsx-tsx', phase: 1, phaseName: 'React Foundations',
    orderIndex: 13, estimatedMins: 20, prerequisites: ['vite-setup'],
    title: 'JSX & TSX',
    eli5: 'JSX lets you write HTML-looking code inside JavaScript. It\'s not real HTML — it gets compiled into `React.createElement()` calls. TSX is the same thing but in TypeScript files.',
    analogy: 'JSX is HTML wearing a JavaScript costume. It looks like HTML at the party, but backstage it\'s pure JavaScript function calls.',
    explanation: 'JSX is syntactic sugar compiled by Babel/SWC to `React.createElement(type, props, ...children)` calls. Rules: class → className, for → htmlFor, all tags must close (`<br />`), one root element (or use `<>` fragment), expressions in `{}`. TSX adds TypeScript — all JSX rules plus prop types.',
    technicalDeep: 'Modern React (17+) uses the new JSX transform — no more `import React from "react"` at the top of every file. The transform imports `jsx` from `react/jsx-runtime` automatically. JSX expressions can contain any JS expression; statements (if, for) cannot appear directly — use ternary `? :` or `&&` for conditionals, `array.map()` for lists. String props don\'t need `{}`: `<Btn label="Click" />`. Non-string props always need `{}`: `<Btn count={5} />`. Spreading props: `<Comp {...props} />` — equivalent to listing every prop individually. Self-closing tags: any component without children should self-close: `<Avatar />` not `<Avatar></Avatar>`.',
    whatBreaks: '`class` instead of `className` silently adds an unknown DOM attribute — no error, just missing styles. Returning adjacent elements without a wrapper throws "JSX must have one parent element". Falsy values: `0` renders as the text "0" — use `condition !== 0 && <X>` or `!!condition && <X>`.',
    efficientWay: {
      title: 'Learning JSX',
      approaches: [
        { name: 'Write a component, see the compiled output in Babel REPL', verdict: 'best', reason: 'Seeing `<h1>` become `React.createElement("h1", null, ...)` makes JSX demystified forever.' },
        { name: 'Memorize the rules list and move on', verdict: 'ok', reason: 'Works but you will keep hitting the `0` rendering bug until you understand expressions vs statements.' },
        { name: 'Use a template engine instead of JSX', verdict: 'weak', reason: 'JSX is the universal React convention — avoiding it adds friction with the entire ecosystem.' }
      ],
      recommendation: 'Open Babel REPL (babeljs.io/repl), paste 10 lines of JSX, and read the output. Do it once and JSX is never mysterious again.'
    },
    commonMistakes: [
      '`class` instead of `className` — 100% of beginners hit this at least once.',
      'Rendering `{condition && <X>}` when condition can be `0` — renders the literal "0".',
      'Multi-line JSX without parentheses after `return` — ASI (automatic semicolon insertion) inserts a semicolon after `return` on its own line, returning undefined.'
    ],
    seniorNotes: 'The new JSX transform (React 17+) means you no longer need `import React from "react"` — but many existing codebases still have it. ESLint rule `react/react-in-jsx-scope` should be turned off for the new transform. When you see it in old code, it\'s not wrong — just vestigial.',
    interviewQuestions: [
      'What does JSX compile to?',
      'Why does React use `className` instead of `class`?',
      'Why does `{0 && <Component />}` render "0" to the screen?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'JSX rules in one file',
        code: `// ✅ One root element (or fragment)
function Card({ title, count, isAdmin }: { title: string; count: number; isAdmin: boolean }) {
  return (
    <div className="card">          {/* className not class */}
      <h2>{title}</h2>

      {/* Conditional: ternary */}
      <p>{isAdmin ? 'Admin view' : 'User view'}</p>

      {/* Conditional: short-circuit (count > 0 guards against 0-renders-"0") */}
      {count > 0 && <span className="badge">{count}</span>}

      {/* Self-closing */}
      <hr />
    </div>
  );
}

// Fragment shorthand — no extra DOM node
function Wrapper() {
  return (
    <>
      <h1>Title</h1>
      <p>Body</p>
    </>
  );
}`
      }
    ]
  },

  {
    id: 'functional-components', phase: 1, phaseName: 'React Foundations',
    orderIndex: 14, estimatedMins: 20, prerequisites: ['jsx-tsx'],
    title: 'Functional Components',
    eli5: 'A component is a reusable piece of UI — like a LEGO brick. A functional component is just a JavaScript function that returns JSX. You call it like an HTML tag: `<MyButton />` and React puts it on the screen.',
    analogy: 'A component is a cookie cutter. Call it with different dough (props) and you get the same shape but different flavors.',
    explanation: 'Functional components are the standard React component type since hooks arrived in 2019. They are plain functions: receive props as an argument, return JSX (or null). Component names MUST start with a capital letter — lowercase names are treated as DOM elements. A component must be pure for the same props: same output every time during render.',
    technicalDeep: 'React calls your component function on every render. The function must be pure during render — no side effects, no random values, no mutations. Hooks (`useState`, `useEffect`) let you opt into React features from a functional component. Component identity is defined by the function reference — if you define a component inside another component\'s render, React sees a new type every render and unmounts/remounts instead of updating. `React.FC<Props>` (or `React.FunctionComponent`) is the TypeScript annotation — but many teams now prefer the simpler `function Component(props: Props): JSX.Element` form, which avoids the implicit `children` prop that `React.FC` used to include.',
    whatBreaks: 'Defining a component inside another component\'s body causes it to be treated as a new type every render — its state resets on every parent render. Always define components at module scope.',
    efficientWay: {
      title: 'Writing good functional components',
      approaches: [
        { name: 'Write small, single-responsibility components from day one', verdict: 'best', reason: 'Breaking UI into small pieces is the skill — you will refactor if you start big.' },
        { name: 'Learn class components first, then hooks', verdict: 'weak', reason: 'Class components are legacy. No new React code should use them. Start with functions.' },
        { name: 'Use React.FC for all component types', verdict: 'ok', reason: 'Works but the simpler function syntax is now preferred by most of the community.' }
      ],
      recommendation: 'Use plain function declarations: `function UserCard(props: UserCardProps): JSX.Element`. Reserve arrow functions for short utilities. Never define a component inside another component\'s body.'
    },
    commonMistakes: [
      'Lowercase component names — `<myButton />` is treated as a DOM element, not a component.',
      'Defining components inside other components — causes state loss on every parent render.',
      'Side effects directly in the function body instead of useEffect — runs during render, breaks Strict Mode double-invoke.'
    ],
    seniorNotes: 'React Strict Mode (on by default in Vite) calls your component function twice in development to surface impure renders. If your component breaks on double-invocation, it has a side effect in the body — this is intentional. Fix the component, not Strict Mode.',
    interviewQuestions: [
      'Why must React component names start with a capital letter?',
      'What does it mean for a component function to be "pure"?',
      'What problem does defining a component inside another component\'s body cause?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Anatomy of a functional component',
        code: `interface UserCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

// Function declaration — preferred over arrow function for components
function UserCard({ name, email, avatarUrl }: UserCardProps): JSX.Element {
  // ✅ Hooks here — always at the top level
  const [expanded, setExpanded] = useState(false);

  // ✅ Derived values — computed from props/state
  const initials = name.split(' ').map(n => n[0]).join('');

  // ✅ Event handlers — defined in component body
  function handleToggle() { setExpanded(e => !e); }

  // ✅ Return JSX — the only required output
  return (
    <div className="card" onClick={handleToggle}>
      {avatarUrl
        ? <img src={avatarUrl} alt={name} />
        : <span className="avatar">{initials}</span>}
      <h3>{name}</h3>
      {expanded && <p>{email}</p>}
    </div>
  );
}

export default UserCard;`
      }
    ]
  },

  {
    id: 'props', phase: 1, phaseName: 'React Foundations',
    orderIndex: 15, estimatedMins: 20, prerequisites: ['functional-components'],
    title: 'Props & Component Communication',
    eli5: 'Props are the settings you hand to a component. Like filling out a form for a pizza order: you choose the toppings (props) and the pizza shop (component) makes the pizza (UI) with exactly those toppings.',
    analogy: 'Props are function arguments. A component is a function. When you write `<Button color="red" />` you are calling `Button({ color: "red" })`.',
    explanation: 'Props are read-only data passed from parent to child. They flow in one direction: parent → child (unidirectional data flow). To "pass data up," a parent passes a callback function as a prop; the child calls it. All React components must treat their props as immutable.',
    technicalDeep: 'Props are plain objects received as the first argument. Destructuring is idiomatic: `function Btn({ label, onClick }: BtnProps)`. Default values: `function Btn({ label = "Click" })`. Spread props `<Child {...parentProps} />` passes all parent props — useful for wrappers but can leak unwanted props to DOM elements (TypeScript catches this). `children` is a special prop: `React.ReactNode` type, passed between opening/closing tags. Prop drilling (passing props many levels deep) is a smell — Context or state management is the fix. Never mutate props — React relies on props being immutable to optimize renders.',
    whatBreaks: 'Mutating props directly (`props.user.name = "new"`) causes subtle bugs — React may not re-render because the reference didn\'t change. Spreading all props onto a DOM element passes unknown HTML attributes — TypeScript\'s `HTMLDivElement` props type catches this.',
    efficientWay: {
      title: 'Working with props',
      approaches: [
        { name: 'Type every prop interface before writing the component body', verdict: 'best', reason: 'The props interface IS the component\'s contract — defining it first forces you to think about the API.' },
        { name: 'Use PropTypes (legacy)', verdict: 'weak', reason: 'PropTypes are runtime-only, catch nothing at compile time, and are not needed with TypeScript.' },
        { name: 'Pass everything via a single "config" object prop', verdict: 'weak', reason: 'Makes every consumer read the source to understand the shape. Named props are self-documenting.' }
      ],
      recommendation: 'Define the props interface first, think about which props are required vs optional, add defaults for optional ones. The component body almost writes itself after that.'
    },
    commonMistakes: [
      'Modifying a prop value inside the child component.',
      'Passing a new object literal as a prop on every render: `<Comp style={{ margin: 0 }} />` — creates a new reference each time, breaks memoization.',
      'Prop drilling 3+ levels deep instead of lifting state or using Context.'
    ],
    seniorNotes: '`children` as `React.ReactNode` is flexible but untyped. For more control, use explicit render props or named slot props: `header: ReactNode; footer?: ReactNode`. The "component API design" skill — knowing which things should be props vs internal state — separates good component libraries from hard-to-use ones.',
    interviewQuestions: [
      'What does "unidirectional data flow" mean in React?',
      'How do you pass data from a child component to a parent?',
      'What is prop drilling and how do you solve it?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Props: defaults, callbacks, children',
        code: `interface AlertProps {
  type?: 'info' | 'success' | 'error';
  onClose?: () => void;
  children: React.ReactNode;
}

function Alert({ type = 'info', onClose, children }: AlertProps) {
  const colors = { info: '#61DAFB', success: '#22c55e', error: '#ef4444' };

  return (
    <div style={{ borderLeft: \`4px solid \${colors[type]}\`, padding: 12 }}>
      {children}
      {onClose && (
        <button onClick={onClose}>✕</button>
      )}
    </div>
  );
}

// Usage — parent passes callback to receive "close" signal
function App() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <Alert type="success" onClose={() => setVisible(false)}>
      Profile saved successfully!
    </Alert>
  );
}`
      }
    ]
  },

  {
    id: 'useState', phase: 1, phaseName: 'React Foundations',
    orderIndex: 16, estimatedMins: 25, prerequisites: ['functional-components'],
    title: 'useState — Local Component State',
    eli5: 'useState gives a component its own memory. When that memory changes, React redraws the component. Without useState, every value resets when the component re-renders.',
    analogy: 'useState is a whiteboard in the room. When you change what\'s on the whiteboard, everyone in the room (the component) immediately sees the update and acts on it.',
    explanation: '`const [value, setValue] = useState(initial)` returns the current value and a setter. Calling the setter schedules a re-render with the new value. State is local to each instance — multiple `<Counter />` components have independent counts. State updates are batched in React 18, so multiple `setState` calls in one event handler trigger one render.',
    technicalDeep: 'React stores state in a linked list tied to each Fiber (component instance). Each `useState` call claims a slot in that list — which is why hooks must be called in the same order every render (no conditionals, loops, or early returns before hooks). State updates are not immediate — the setter schedules an update; the new value is available on the NEXT render. Batching: in React 18, all state updates (even in async callbacks) are batched by default. The functional updater `setValue(v => v + 1)` is closure-safe and should be used whenever new state depends on old state. `useState(fn)` lazy initialization: if the initial value is expensive to compute, pass a function — it runs once on mount, not every render.',
    whatBreaks: 'Reading state immediately after calling the setter returns the OLD value — state has not updated yet. Storing derived data in state that should be computed from other state/props causes sync bugs.',
    efficientWay: {
      title: 'Using useState well',
      approaches: [
        { name: 'Model state as the minimal, non-derivable data', verdict: 'best', reason: 'Derived values should be computed during render, not stored as state. Fewer state variables = fewer sync bugs.' },
        { name: 'Reach for useReducer when useState gets complex', verdict: 'best', reason: 'Spread-in-setState for objects is error-prone; useReducer makes complex state explicit and testable.' },
        { name: 'Store everything in state including derived data', verdict: 'weak', reason: 'Derived state must be kept in sync manually — the source of countless bugs.' }
      ],
      recommendation: 'Derive don\'t store. If a value can be computed from existing state or props, compute it during render. Only put in state what truly cannot be derived.'
    },
    commonMistakes: [
      'Reading the new state value immediately after calling the setter — it\'s still the old value in the current render.',
      'Storing computed/derived data in state instead of calculating it from existing state.',
      'Directly mutating state objects: `state.count++` — React detects changes by reference, so mutation is invisible.'
    ],
    seniorNotes: 'The "minimal state" principle: identify the minimal set of state your app needs, then derive everything else. Over-stated components are harder to debug, test, and reason about. If you find yourself writing `useEffect` to sync two state variables, that\'s a sign one should be derived instead.',
    interviewQuestions: [
      'Why can\'t you call useState inside an if block?',
      'What is the functional update form and when should you use it?',
      'What is lazy initialization of useState?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'useState patterns: primitive, object, lazy init',
        code: `// Primitive state
const [count, setCount] = useState(0);
const [name, setName]   = useState('');

// Object state — spread to update immutably
const [user, setUser] = useState({ name: '', email: '' });
function updateEmail(email: string) {
  setUser(prev => ({ ...prev, email })); // functional update — closure-safe
}

// Derived value — NOT in state, computed from state
const isValid = name.length >= 3; // re-computed every render, always in sync

// Lazy init — computeExpensiveDefault runs ONCE, not every render
const [config, setConfig] = useState(() => {
  const saved = localStorage.getItem('config');
  return saved ? JSON.parse(saved) : defaultConfig;
});

// What NOT to do
const [doubled, setDoubled] = useState(count * 2); // âŒ derived state, will get stale
// ✅ Instead: const doubled = count * 2;`
      }
    ]
  },

  {
    id: 'event-handling', phase: 1, phaseName: 'React Foundations',
    orderIndex: 17, estimatedMins: 15, prerequisites: ['useState'],
    title: 'Event Handling in React',
    eli5: 'Events are things the user does — clicking, typing, submitting a form. React lets you attach functions to these events. When the event happens, your function runs.',
    analogy: 'Event handlers are security guards at different doors. Each door (event) has its own guard (handler function). When someone knocks (event fires), the guard responds.',
    explanation: 'React events use camelCase (`onClick`, `onChange`, `onSubmit`). Pass a function reference, not a call: `onClick={handleClick}` not `onClick={handleClick()}`. TypeScript provides specific event types: `React.MouseEvent`, `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`.',
    technicalDeep: 'React wraps native events in `SyntheticEvent` — normalized across browsers. Event delegation: React attaches one listener at the root (React 17+), not on each element. `e.preventDefault()` stops default browser behavior (form navigation, link following). `e.stopPropagation()` stops bubbling — use sparingly as it breaks higher-level event listeners. For inline functions `onClick={() => doThing(id)}` — creates a new function on every render. For lists this causes every item to re-render if the parent re-renders. Fix: `useCallback` + `React.memo` on list items (measure first — premature optimization is real).',
    whatBreaks: '`onClick={handleClick()}` with parentheses calls the function during render, not on click. Forgetting `e.preventDefault()` on form submit causes the page to reload. Accessing `e.target.value` asynchronously (after a setTimeout) in React 16 returned null because of event pooling — this is fixed in React 17+.',
    efficientWay: {
      title: 'Event handling patterns',
      approaches: [
        { name: 'Always type event parameters for TypeScript hints', verdict: 'best', reason: 'TypeScript tells you exactly which properties exist — no guessing what\'s on `e.target`.' },
        { name: 'Use inline arrow functions everywhere', verdict: 'ok', reason: 'Fine for most cases, but creates new function references that break shallow equality checks in memoized components.' },
        { name: 'Attach event listeners with addEventListener', verdict: 'weak', reason: 'Raw DOM listeners bypass React\'s event system, need manual cleanup, and won\'t work correctly with React 18 concurrent features.' }
      ],
      recommendation: 'Define named handler functions inside the component body for clarity. Use inline `() =>` only when passing an argument to a reusable handler (e.g., `onClick={() => handleDelete(item.id)}`).'
    },
    commonMistakes: [
      '`onClick={doThing()}` — the () calls it immediately during render.',
      'Not calling `e.preventDefault()` on form submit — page reloads and state is lost.',
      'Using `onChange` on a checkbox to read `e.target.value` — use `e.target.checked` instead.'
    ],
    seniorNotes: '`useCallback` is only beneficial when the handler is passed to a child wrapped in `React.memo`. Profile before adding `useCallback` everywhere — the cost of creating a new function on each render is far less than the overhead of unnecessary `useCallback` deps tracking.',
    interviewQuestions: [
      'What is the difference between `onClick={fn}` and `onClick={fn()}`?',
      'When should you call `e.preventDefault()`?',
      'What TypeScript type do you use for an onChange handler on an `<input>`?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Typed event handlers',
        code: `function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Typed onChange — React.ChangeEvent<HTMLInputElement>
  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  // Form submit — prevent page reload
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={handleEmailChange} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}`
      }
    ]
  },

  {
    id: 'conditional-rendering', phase: 1, phaseName: 'React Foundations',
    orderIndex: 18, estimatedMins: 15, prerequisites: ['jsx-tsx'],
    title: 'Conditional Rendering',
    eli5: 'Conditional rendering means showing different things depending on a condition — like only showing a "Welcome back!" message if you\'re logged in. In JSX you use `?` (if-else) or `&&` (show-if-true).',
    analogy: 'Conditional rendering is a light switch. `condition && <Bulb />` is: if the switch is on, the bulb lights up. If the switch is off, nothing is there at all.',
    explanation: 'React does not have if/for in JSX directly. Use: ternary `condition ? <A /> : <B />` for if-else, short-circuit `condition && <A />` for show-or-nothing, or extract to a variable/function before the return. For complex conditions, extract to a helper function or component.',
    technicalDeep: 'JSX accepts: strings, numbers, booleans (false, null, undefined render nothing), arrays of elements, or JSX. `false && <X>` renders nothing. `0 && <X>` renders "0" — the number zero is truthy-adjacent but renders! Fix: `items.length > 0 && <X>` or `!!items.length && <X>`. Returning `null` from a component renders nothing. Early return pattern: `if (loading) return <Spinner />` is cleaner than deeply nested ternaries. Enum pattern with `Record<Status, JSX.Element>` maps status strings to components without if chains.',
    whatBreaks: '`{items.length && <List />}` renders "0" when the array is empty. `{undefined && <X>}` renders nothing (fine). `{null && <X>}` renders nothing (fine). Beginners get bit by the 0 case constantly.',
    efficientWay: {
      title: 'Conditional rendering patterns',
      approaches: [
        { name: 'Use early returns for loading/error states, ternaries for content', verdict: 'best', reason: 'Early returns keep the happy path readable. Ternary is fine for two-option content swaps.' },
        { name: 'Nest ternaries deeply', verdict: 'weak', reason: 'Unreadable. Extract to a switch or function after 2 levels.' },
        { name: 'Always use &&', verdict: 'ok', reason: 'Simple but the 0 bug bites everyone eventually.' }
      ],
      recommendation: 'Pattern: early return for loading/error, ternary for two outcomes, map over data for lists. If you have 3+ conditions, use a switch or object map.'
    },
    commonMistakes: [
      '`{count && <List />}` — renders "0" when count is zero.',
      'Deeply nested ternaries — extract to a named function or switch statement.',
      'Showing a loading spinner AND the content at the same time by forgetting to return early.'
    ],
    seniorNotes: 'The enum-map pattern eliminates chains of ternaries: `const views = { loading: <Spinner />, error: <ErrorMsg />, success: <Data /> }; return views[status]`. TypeScript ensures you handle every status.',
    interviewQuestions: [
      'Why does `{0 && <Component />}` render "0" instead of nothing?',
      'What are three patterns for conditional rendering in React?',
      'When should you use an early return vs a ternary in a component?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Conditional rendering patterns',
        code: `type Status = 'loading' | 'error' | 'success';
function DataView({ status, data }: { status: Status; data?: string }) {
  // Pattern 1: early return
  if (status === 'loading') return <Spinner />;
  if (status === 'error')   return <ErrorMsg />;

  // Pattern 2: ternary
  return (
    <div>
      {data ? <p>{data}</p> : <p>No data yet.</p>}

      {/* Pattern 3: && (guard against falsy non-boolean) */}
      {data && data.length > 0 && <ExportButton />}
    </div>
  );
}

// Pattern 4: object map (for many conditions)
const STATUS_UI: Record<Status, JSX.Element> = {
  loading: <Spinner />,
  error:   <ErrorMsg />,
  success: <DataView status="success" />,
};
function Page({ status }: { status: Status }) {
  return STATUS_UI[status];
}`
      }
    ]
  },

  {
    id: 'lists-keys', phase: 1, phaseName: 'React Foundations',
    orderIndex: 19, estimatedMins: 20, prerequisites: ['array-methods', 'jsx-tsx'],
    title: 'Lists & Keys',
    eli5: 'To show a list in React, you use `.map()` to turn an array into JSX. Each item needs a `key` — a unique ID that React uses to tell items apart when the list changes.',
    analogy: 'Keys are name tags at a conference. Without them, if Bob leaves and Carol moves to his seat, React thinks Carol is Bob. With name tags, React knows exactly who is who.',
    explanation: 'Use `array.map(item => <Li key={item.id}>{item.name}</Li>)`. Keys must be unique among siblings, stable (not change between renders), and predictable. Use the item\'s database ID as the key. Never use array index for lists that can reorder, filter, or be added to from the front.',
    technicalDeep: 'React uses keys to match elements between renders during reconciliation. Same key = update the existing element (keeps DOM state: scroll, focus, animation). Different key = unmount old, mount new. Missing key = React warns and falls back to index (with the associated bugs). Key only needs to be unique among siblings, not globally. Fragment keys: `<React.Fragment key={id}>` when you need to group multiple elements per item. For large lists (500+ items), windowing (react-window, react-virtual) renders only visible items — React\'s native rendering has no built-in virtualization.',
    whatBreaks: 'Index as key on a reorderable list: if item at index 0 changes, React thinks it\'s the "same" item and updates instead of remounting — causes mismatched state (e.g., an open dropdown stays on the wrong item after sort). Random keys `key={Math.random()}` cause every item to remount every render — catastrophic performance.',
    efficientWay: {
      title: 'Rendering lists',
      approaches: [
        { name: 'Always use a stable, unique database ID as the key', verdict: 'best', reason: 'IDs from the backend are guaranteed unique and stable — no edge cases.' },
        { name: 'Use the array index as key for static lists', verdict: 'ok', reason: 'Acceptable only for truly static, never-reordered, never-filtered lists.' },
        { name: 'Use Math.random() as a key', verdict: 'weak', reason: 'Forces remount of every item every render. Never do this.' }
      ],
      recommendation: 'If your API does not return IDs, add them on the client with a library like `nanoid` when the data first loads. Never compute keys during render.'
    },
    commonMistakes: [
      'Array index as key for a list that can be filtered, sorted, or prepended to.',
      'Forgetting the `key` prop entirely — React warns but falls back to index behavior.',
      'Not lifting the `key` to the outermost element returned by map — key must be on the map\'s direct output.'
    ],
    seniorNotes: 'The `key` prop is React\'s identity signal, not a prop you can read inside the component (`props.key` is undefined). To pass the key value as data, also pass it as a named prop: `<Item key={id} id={id} />`. Fragment keys `<React.Fragment key={id}>` are the only way to key a multi-element group.',
    interviewQuestions: [
      'Why should you not use the array index as a key for a sortable list?',
      'What happens when two sibling elements have the same key?',
      'How do you add a key to a React Fragment?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Correct key usage in lists',
        code: `interface Todo { id: number; text: string; done: boolean; }

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map(todo => (
        // ✅ Use the stable database ID
        <li key={todo.id} style={{ opacity: todo.done ? 0.4 : 1 }}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// Fragment key — group multiple elements per item
function Table({ rows }: { rows: Todo[] }) {
  return (
    <tbody>
      {rows.map(row => (
        <React.Fragment key={row.id}>
          <tr><td>{row.text}</td></tr>
          <tr><td>{row.done ? 'Done' : 'Pending'}</td></tr>
        </React.Fragment>
      ))}
    </tbody>
  );
}`
      }
    ]
  },

  {
    id: 'forms-controlled', phase: 1, phaseName: 'React Foundations',
    orderIndex: 20, estimatedMins: 25, prerequisites: ['useState', 'event-handling'],
    title: 'Forms & Controlled Inputs',
    eli5: 'A controlled input is an input whose value is stored in React state. Every keystroke updates the state, and the state updates the input — React is the boss of what the input shows.',
    analogy: 'An uncontrolled input is like a notebook you write in directly. A controlled input is like a dictation system: you speak (type), the transcriber (React state) writes it down, and the screen shows what the transcriber wrote.',
    explanation: 'Controlled: `<input value={state} onChange={e => setState(e.target.value)} />`. Value comes FROM state; changes go THROUGH setState. Uncontrolled: `<input ref={ref} />` — the DOM holds the value, you read it on submit. Controlled is the React standard for forms with validation, formatting, or conditional behavior.',
    technicalDeep: 'Controlled inputs create a React-DOM round trip on each keystroke: event → handler → setState → re-render → DOM update. This is fast but means: (a) you can validate/transform on every keystroke, (b) the input value is always in sync with state. Uncontrolled inputs (`useRef`) bypass this loop — better for file inputs (`<input type="file">`) which cannot be controlled, and for performance-sensitive forms. `defaultValue` vs `value`: `value` = controlled (React owns it), `defaultValue` = uncontrolled initial value. Mixing both creates a warning. Form libraries (React Hook Form, Formik) use refs + controlled inputs strategically to minimize re-renders.',
    whatBreaks: '`<input value={state} />` without an `onChange` creates a read-only input (React warns). `<input value={undefined} />` starts as uncontrolled; if state later becomes a string, React switches it to controlled — warning about "uncontrolled to controlled" change.',
    efficientWay: {
      title: 'Building forms',
      approaches: [
        { name: 'Use controlled inputs for forms with validation', verdict: 'best', reason: 'You can validate on every keystroke, format as you type, and enable/disable submit.' },
        { name: 'React Hook Form for non-trivial forms (5+ fields)', verdict: 'best', reason: 'Reduces re-renders to near zero by using refs internally. Better performance, less code.' },
        { name: 'Formik', verdict: 'ok', reason: 'Good but heavier and slower than React Hook Form. Legacy choice.' }
      ],
      recommendation: 'Learn controlled inputs first — you need to understand them to debug React Hook Form. Switch to RHF + Zod for any form beyond a simple login.'
    },
    commonMistakes: [
      '`<input value={value}>` without onChange — read-only warning and non-interactive input.',
      'Setting `value={undefined}` initially then a string later — uncontrolled/controlled switch warning.',
      'One setState per field when a single object state is cleaner for related fields.'
    ],
    seniorNotes: 'React Hook Form\'s performance advantage (`register` uses refs, re-renders only on submit or validated fields) is significant for large forms. But even with 20 fields, a controlled approach is often fast enough — measure before optimizing.',
    interviewQuestions: [
      'What is the difference between a controlled and uncontrolled input?',
      'Why does `<input value={state} />` without onChange create a read-only field?',
      'When would you choose an uncontrolled input over a controlled one?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Controlled form with validation',
        code: `function SignupForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error as user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.email.includes('@'))     errs.email = 'Valid email required';
    if (form.password.length < 8)      errs.password = 'Min 8 characters';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    // submit...
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email"    value={form.email}    onChange={handleChange} type="email" />
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      <input name="password" value={form.password} onChange={handleChange} type="password" />
      {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}`
      }
    ]
  },

  {
    id: 'component-composition', phase: 1, phaseName: 'React Foundations',
    orderIndex: 21, estimatedMins: 20, prerequisites: ['props'],
    title: 'Component Composition',
    eli5: 'Composition means building big things from small pieces. A `<Page>` is made of `<Header>`, `<Sidebar>`, and `<Content>`. Each piece does one thing well, and they combine into the full page.',
    analogy: 'Composition is LEGO. You have standard bricks (Button, Card, Icon). You snap them together in different ways to build different things (Form, Dashboard, Modal). The bricks don\'t need to know what they\'ll become.',
    explanation: 'Prefer composition over complex configuration. Instead of a `<Modal type="confirm" hasFooter showCloseBtn>`, compose: `<Modal><Modal.Header>…</Modal.Header><Modal.Footer>…</Modal.Footer></Modal>`. The `children` prop is the simplest composition primitive. Slot props (`header`, `footer`) offer named injection points.',
    technicalDeep: 'React favors composition over inheritance — you cannot meaningfully extend components via prototype chains; you compose them via props/children. Key patterns: (1) Children composition — `<Card>{anyContent}</Card>` is maximally flexible. (2) Slot props — `<Layout header={<Nav/>} sidebar={<Menu/>}>` lets the parent control each region. (3) Render props — `<List renderItem={(item) => <Row data={item} />}` injects rendering logic. (4) Compound components (Context-based) — `<Select>` + `<Select.Option>` share state invisibly. (5) HOCs (higher-order components) — legacy pattern, mostly replaced by hooks.',
    whatBreaks: 'Trying to extend a component via inheritance (class-based OOP style) — React doesn\'t support meaningful component inheritance. Deeply nested composition with many layers of `children` can make the render tree hard to trace in DevTools.',
    efficientWay: {
      title: 'Mastering composition',
      approaches: [
        { name: 'Build a Card component that accepts any children', verdict: 'best', reason: 'Once you see how flexible `children` is, you stop reaching for config props.' },
        { name: 'Build a compound Select component (Select + Select.Option)', verdict: 'best', reason: 'Compound components are the most powerful composition pattern in real UI libraries.' },
        { name: 'Extend components by passing many boolean props', verdict: 'weak', reason: 'Boolean prop explosion is a code smell — use composition instead.' }
      ],
      recommendation: 'Rule of thumb: if you have more than 3 boolean or enum props controlling the layout of a component, it should be broken into composed sub-components.'
    },
    commonMistakes: [
      'Passing too many configuration props instead of composing smaller components.',
      'Using React.cloneElement to inject props into children — Context or explicit props are cleaner.',
      'Not typing `children: React.ReactNode` — causes TypeScript errors when you pass JSX as children.'
    ],
    seniorNotes: 'The "Composition vs Configuration" tension is a UI library design decision. Libraries like Radix UI lean heavily into composition (compound components, slots), giving maximum flexibility. Internal business components can lean into configuration for speed. Know the trade-off.',
    interviewQuestions: [
      'What is the difference between composition and inheritance in React?',
      'What are compound components and when would you use them?',
      'What is the difference between the `children` prop and a named slot prop?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Composition patterns: children, slots, compound',
        code: `// 1. Children composition
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={\`card \${className}\`}>{children}</div>;
}

// 2. Slot props — named injection points
function PageLayout({
  header, sidebar, children
}: {
  header: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="layout">
      <header>{header}</header>
      {sidebar && <aside>{sidebar}</aside>}
      <main>{children}</main>
    </div>
  );
}

// Usage: caller controls each region
<PageLayout
  header={<Nav user={user} />}
  sidebar={<Menu items={navItems} />}
>
  <DashboardContent />
</PageLayout>`
      }
    ]
  },

  {
    id: 'lifting-state-up', phase: 1, phaseName: 'React Foundations',
    orderIndex: 22, estimatedMins: 15, prerequisites: ['useState', 'props'],
    title: 'Lifting State Up',
    eli5: 'When two components need to share the same information, you move the state into their common parent. The parent holds the state and passes it down to both children via props.',
    analogy: 'Two kids both need to know the current score of a game. Instead of each keeping their own scoreboard (which would get out of sync), Mom holds the official score and tells both kids.',
    explanation: 'If sibling components need to share state, move the state to their closest common ancestor. The ancestor owns the state and passes data/callbacks down. This is the core of React\'s data flow and the primary solution before reaching for Context or state management.',
    technicalDeep: 'Lifting state up is O(1) complexity — just move `useState` from a child to the parent and pass it as a prop. The trade-off is that the parent now re-renders when the shared state changes, potentially causing sibling components to re-render too. For frequently changing state (e.g., a search input), this can cause visible performance issues — solutions: `React.memo` on expensive siblings, debouncing the state update, or eventually using Context with a selector (or Zustand). Colocation principle: state should live as close to where it\'s used as possible. Lifting state up is a tool when sharing is needed, not a pattern to apply everywhere.',
    whatBreaks: 'Lifting too much state to a global ancestor causes every component in the tree to re-render on every change. Lift only as high as necessary.',
    efficientWay: {
      title: 'Lifting state effectively',
      approaches: [
        { name: 'Start state in the component that needs it, lift only when sharing is required', verdict: 'best', reason: 'Colocation keeps code local and minimizes unnecessary re-renders.' },
        { name: 'Put everything in a top-level state object from the start', verdict: 'weak', reason: 'Causes unrelated components to re-render on every state change.' },
        { name: 'Lift state and then memoize child components', verdict: 'ok', reason: 'Valid but add memoization only after measuring a real performance problem.' }
      ],
      recommendation: 'Start local. When a second component needs the same state, lift it to their nearest common parent. When too many components need it, that\'s the signal to reach for Context or Zustand.'
    },
    commonMistakes: [
      'Lifting state all the way to the root when only two sibling components need it.',
      'Passing callbacks 3+ levels deep — use Context for callbacks that cross many levels.',
      'Forgetting to also lift the setter function (callback) alongside the state value.'
    ],
    seniorNotes: 'State lifting is the mechanical step; knowing WHEN to stop lifting is the skill. The signal to reach for Context: you are passing props through 2+ intermediate components that don\'t use the prop themselves (prop drilling). The signal to reach for Zustand: the shared state changes frequently and causes performance issues with Context.',
    interviewQuestions: [
      'What is lifting state up and when should you do it?',
      'What is prop drilling and how does lifting state relate to it?',
      'When does lifting state up become a performance problem?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Sibling communication via lifted state',
        code: `// âŒ Before: two components with their own counters — can't sync
function CounterA() { const [n, setN] = useState(0); return <button onClick={() => setN(n+1)}>{n}</button>; }
function CounterB() { const [n, setN] = useState(0); return <div>Same as A? No: {n}</div>; }

// ✅ After: state lifted to common parent
function Parent() {
  const [count, setCount] = useState(0); // shared state lives here

  return (
    <>
      {/* A can change it */}
      <button onClick={() => setCount(c => c + 1)}>Increment ({count})</button>
      {/* B reads it */}
      <p>Counter is: {count}</p>
    </>
  );
}`
      }
    ]
  },

  {
    id: 'css-in-react', phase: 1, phaseName: 'React Foundations',
    orderIndex: 23, estimatedMins: 20, prerequisites: ['functional-components'],
    title: 'Styling in React',
    eli5: 'You can style React components in several ways: regular CSS files, CSS that\'s scoped to one component (CSS Modules), styles written in JavaScript objects (inline styles), or a utility library like Tailwind where you put class names directly in your JSX.',
    analogy: 'Styling approaches are like painting a house. Global CSS is painting with no tape — color can bleed everywhere. CSS Modules is masking tape per room. Inline styles is painting each object individually. Tailwind is color-by-number stickers.',
    explanation: 'React accepts `className` (string) and `style` (object with camelCase properties). CSS Modules scope styles to the component file: `import styles from "./Card.module.css"; className={styles.card}`. Tailwind CSS uses utility classes directly in JSX. Most production codebases use Tailwind + a component library (shadcn/ui).',
    technicalDeep: 'CSS Modules: Vite supports them out-of-the-box. `.module.css` files export an object of local class names. The actual class names are hashed (e.g., `Card_root__x7Qk`) to avoid collisions. Inline styles: `style={{ backgroundColor: "#fff", marginTop: 8 }}` — camelCase, no units for 0 values. Only use for truly dynamic values (e.g., a variable color from props). Tailwind: utility-first CSS — all styling is done with class names. `cn()` utility (clsx + tailwind-merge) merges conditional class names correctly. CSS-in-JS (Styled Components, Emotion): runtime-generated CSS, more dynamic but slower than static CSS. Falling out of favor vs Tailwind + CSS Modules.',
    whatBreaks: 'Global CSS class name collisions — two `.card` classes in different files clash. Inline styles bypass media queries and pseudo-selectors — only use for dynamic values. Tailwind\'s `tw-merge` conflict: `px-2 px-4` — without merging, both are applied; the last one wins but specificity is confusing.',
    efficientWay: {
      title: 'Choosing a styling approach',
      approaches: [
        { name: 'Tailwind CSS (utility-first)', verdict: 'best', reason: 'Industry standard for new projects. Fast to write, easy to customize, great with shadcn/ui components.' },
        { name: 'CSS Modules', verdict: 'best', reason: 'Zero runtime, scoped, works with any CSS. Good fallback if Tailwind is not an option.' },
        { name: 'CSS-in-JS (Styled Components)', verdict: 'weak', reason: 'Server component incompatible (runtime CSS injection), slower. Avoid for new Next.js projects.' }
      ],
      recommendation: 'Start with Tailwind. Add shadcn/ui for interactive components. Use CSS Modules for complex animations or global layout that Tailwind struggles with.'
    },
    commonMistakes: [
      'Using inline `style={{ color: \'red\' }}` for static styles — hard to override, no dev tools support.',
      'Forgetting to import the `.module.css` file — the class works but styles are not applied (silent failure).',
      'Using global CSS class names in React without modules — guaranteed collision as the codebase grows.'
    ],
    seniorNotes: 'The Tailwind vs CSS-in-JS debate is mostly settled for Next.js: CSS-in-JS requires runtime style injection which conflicts with Server Components (which render without a JS context). Tailwind and CSS Modules are both static and work with RSC. This architectural constraint drove the industry toward Tailwind.',
    interviewQuestions: [
      'What are CSS Modules and how do they prevent class name collisions?',
      'Why is CSS-in-JS problematic with React Server Components?',
      'What is the `cn()` utility and what problem does it solve with Tailwind?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Three styling approaches in one file',
        code: `// 1. CSS Modules — scope to this file
import styles from './Button.module.css'; // .btn { background: blue; }
<button className={styles.btn}>Click</button>

// 2. Tailwind utilities
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  Click
</button>

// 3. Conditional Tailwind with cn() (clsx + tailwind-merge)
import { cn } from '@/lib/utils';
<button className={cn(
  'px-4 py-2 rounded font-medium',
  variant === 'primary'   && 'bg-[#61DAFB] text-black',
  variant === 'secondary' && 'border border-gray-300 text-gray-700',
  disabled                && 'opacity-50 cursor-not-allowed',
)}>
  Click
</button>

// 4. Inline style — only for truly dynamic values from props
<div style={{ width: \`\${progress}%\`, backgroundColor: color }} />`
      }
    ]
  },

  {
    id: 'react-devtools', phase: 1, phaseName: 'React Foundations',
    orderIndex: 24, estimatedMins: 15, prerequisites: ['functional-components'],
    title: 'React DevTools & Debugging',
    eli5: 'React DevTools is a browser extension that lets you peek inside your React components — see their state, props, and how fast they render. It\'s like X-ray vision for your app.',
    analogy: 'React DevTools is the dashboard of a car. Without it you just drive and hope. With it you see the engine temperature, fuel level, and which parts are working overtime.',
    explanation: 'React DevTools (browser extension) adds two panels: Components (inspect the tree, state, props of any component) and Profiler (record and analyze renders, find what re-renders and why). Essential for understanding and debugging React apps.',
    technicalDeep: 'Components panel: click any element in the DevTools component tree to see its current state and props. You can even edit state directly for testing. Highlight updates: Settings → "Highlight updates when components render" — flashes a colored border on every re-rendering component. Profiler: record a user interaction, then see a flame graph of render times. Each bar is a component; wide bars are expensive. Hooks are listed under "hooks" in the component inspector — each hook\'s current value is shown. `displayName`: React DevTools shows the function name; anonymous arrow functions show as "Anonymous" — prefer named functions or set `MyComp.displayName = "MyComp"`. `__REACT_DEVTOOLS_GLOBAL_HOOK__` is the extension API — you cannot use DevTools to inspect production builds unless you use `react-dom/profiler` and a special build.',
    whatBreaks: 'React DevTools do not work on apps served from `file://` — use a local dev server. Production builds minify component names — use the profiler build or a source map for production profiling.',
    efficientWay: {
      title: 'Using DevTools',
      approaches: [
        { name: 'Install DevTools on day one, use Highlight Updates immediately', verdict: 'best', reason: 'Seeing which components re-render is the fastest way to understand the component tree.' },
        { name: 'Open the Profiler only when you see a perf problem', verdict: 'best', reason: 'The Profiler is powerful but complex — save it for real perf issues.' },
        { name: 'Debug by adding console.log everywhere', verdict: 'weak', reason: 'Works but slow. DevTools state inspection is instant and non-destructive.' }
      ],
      recommendation: 'Install DevTools extension immediately. Turn on "Highlight Updates" for your first week — you will learn more about React\'s rendering from watching the highlights than from any tutorial.'
    },
    commonMistakes: [
      'Not using DevTools at all — debugging React without them is like debugging without a console.',
      'Profiling in development mode — development React is 2-3× slower due to extra checks. Profile in production build.',
      'Naming all components as arrow functions assigned to `const` — they show as "Anonymous" in DevTools until you add displayName.'
    ],
    seniorNotes: 'The Profiler flame chart shows "Why did this render?" when you enable that setting — it lists exactly which state or props change triggered each render. This is the fastest path to finding unnecessary re-renders without guessing.',
    interviewQuestions: [
      'What are the two main panels in React DevTools?',
      'Why should you profile in a production build rather than development mode?',
      'What does "Highlight Updates" in React DevTools show you?'
    ],
    codeExamples: [
      {
        lang: 'jsx',
        label: 'displayName for readable DevTools labels',
        code: `// Anonymous arrow functions show as "Anonymous" in DevTools
const MysteryComponent = ({ value }) => <div>{value}</div>;

// Fix 1: use a named function declaration
function UserCard({ name }) { return <div>{name}</div>; }

// Fix 2: set displayName explicitly (useful for HOCs and factory functions)
const withAuth = (Component) => {
  const AuthWrapper = (props) => {
    const { user } = useAuth();
    if (!user) return <Login />;
    return <Component {...props} />;
  };
  AuthWrapper.displayName = \`withAuth(\${Component.displayName || Component.name})\`;
  return AuthWrapper;
};`
      }
    ]
  },

  {
    id: 'fragments-portals', phase: 1, phaseName: 'React Foundations',
    orderIndex: 25, estimatedMins: 15, prerequisites: ['jsx-tsx'],
    title: 'Fragments & Portals',
    eli5: 'A Fragment is an invisible wrapper — it lets you return multiple elements without adding an extra `<div>` to the page. A Portal lets you put a component\'s output somewhere else in the HTML (like a modal that goes at the bottom of the page but lives in your component).',
    analogy: 'A Fragment is a clear plastic bag — you can bundle items together without a visible box. A Portal is a teleportation device — your component lives in the kitchen but its output appears in the living room.',
    explanation: 'Fragments `<></>` group elements without adding DOM nodes. Use keyed fragments `<React.Fragment key={id}>` for lists. Portals render children into a different DOM node: `ReactDOM.createPortal(children, document.getElementById("modal-root"))` — used for modals, tooltips, and dropdowns that need to escape overflow:hidden or z-index stacking contexts.',
    technicalDeep: 'Fragment implementation: `React.Fragment` compiles to an internal type that the reconciler handles specially — no DOM node is created, just the children are flattened. Short syntax `<>` does not support `key` or other props. `ReactDOM.createPortal(content, targetDOMNode)` renders `content` into `targetDOMNode` but keeps it in the React tree for event bubbling and context purposes. Events on portal content still bubble through the React component tree (not the DOM tree) — a click inside a modal portal fires onClick handlers up through its React parents even though the DOM parent is `#modal-root`. Portals require `targetDOMNode` to exist in the HTML — typically `<div id="modal-root"></div>` in `index.html`.',
    whatBreaks: 'Using `<>` (short fragment) when you need a `key` — `<>` doesn\'t accept props. Using portals for non-overlay content — unnecessary complexity. Forgetting to add `#modal-root` to index.html before using a portal to it.',
    efficientWay: {
      title: 'Fragments and portals',
      approaches: [
        { name: 'Always use <> fragment instead of <div> wrapper when not needed', verdict: 'best', reason: 'Cleaner DOM, less CSS fighting with unexpected wrapper divs.' },
        { name: 'Build modals as portals', verdict: 'best', reason: 'Portals correctly escape z-index and overflow contexts — modals without portals require CSS hacks.' },
        { name: 'Add wrapper divs everywhere to make the structure clear', verdict: 'weak', reason: 'Unnecessary DOM nodes bloat the tree and complicate CSS selectors.' }
      ],
      recommendation: 'Default to `<>` fragments. Add `<div>` wrappers only when you need a DOM element for styling or event handling. Build modals as portals — the escaping behavior is essential for correct z-index stacking.'
    },
    commonMistakes: [
      'Using `<>` syntax when the fragment needs a `key` prop — use `<React.Fragment key={id}>`.',
      'Building modals without portals — they get trapped under overflow:hidden or z-index stacking context.',
      'Querying for the portal target in the component body instead of after mount — the element might not exist during SSR.'
    ],
    seniorNotes: 'Portal event bubbling through the React tree (not DOM tree) is both a feature and a gotcha. A click outside a modal portal should close it — but `document.addEventListener("click")` fires for ALL clicks including those inside the portal. Solution: `e.stopPropagation()` inside the modal content or an `onMouseDown` on the overlay background.',
    interviewQuestions: [
      'What is a React Fragment and why would you use it?',
      'What is a Portal and what problem does it solve for modals?',
      'Do events from a portal bubble through the React component tree or the DOM tree?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Fragment and Portal patterns',
        code: `// Fragment — no extra DOM node
function TableRow({ item }: { item: Item }) {
  return (
    <>
      <td>{item.name}</td>
      <td>{item.value}</td>
    </>
  );
}

// Keyed fragment for lists
function Table({ rows }: { rows: Item[] }) {
  return <tbody>{rows.map(r => <React.Fragment key={r.id}><TableRow item={r} /></React.Fragment>)}</tbody>;
}

// Portal — render into #modal-root, outside the app div
function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
}`
      }
    ]
  },

  {
    id: 'strict-mode', phase: 1, phaseName: 'React Foundations',
    orderIndex: 26, estimatedMins: 10, prerequisites: ['functional-components'],
    title: 'StrictMode & Development Behavior',
    eli5: 'StrictMode is a special wrapper that makes React complain louder in development about code that could cause bugs. It also runs certain things twice to catch mistakes — but only while you\'re developing, not in the real app.',
    analogy: 'StrictMode is your code\'s stress test. It shakes the car harder on the test track than on real roads to find parts that are about to break.',
    explanation: 'Wrap your app in `<React.StrictMode>` (Vite does this by default). In development: renders components twice to detect side effects, runs effects twice (mount → unmount → mount), warns about deprecated APIs. None of this runs in production. The double-invoke is intentional — your render function must be pure.',
    technicalDeep: 'Strict Mode in React 18: components render twice in development to surface non-pure render functions. This means `console.log` in a component body fires twice — confusing but intentional. `useEffect` also runs twice: mount → cleanup → mount. This catches effects that don\'t clean up properly. If your app breaks on double-invoke, the render or effect has a side effect that\'s not idempotent. Strict Mode also warns about: string refs (legacy), legacy lifecycle methods (`componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`), `findDOMNode`, and legacy Context API. In Next.js, Strict Mode is on by default in `next.config.js`.',
    whatBreaks: 'Effects that don\'t clean up subscriptions/timers break when Strict Mode runs them twice — but this reveals a real bug that would happen in production with rapid navigation. The fix is always to add proper cleanup.',
    efficientWay: {
      title: 'Working with StrictMode',
      approaches: [
        { name: 'Keep StrictMode on and fix the warnings it reveals', verdict: 'best', reason: 'Every StrictMode warning is a real bug that will appear in production eventually.' },
        { name: 'Remove StrictMode to silence the double-render', verdict: 'weak', reason: 'You\'re hiding a bug. Double-render in dev catches impure renders before they cause user-facing issues.' },
        { name: 'Add checks like `if (called) return` to prevent double execution', verdict: 'weak', reason: 'This fights the tool instead of fixing the root cause — the impure render.' }
      ],
      recommendation: 'Never remove StrictMode. When double-render reveals a bug, fix the component to be pure. This process makes your code more robust.'
    },
    commonMistakes: [
      'Removing `<React.StrictMode>` to silence double renders — hiding real bugs.',
      'Being surprised that console.log fires twice in development — expected behavior of StrictMode.',
      'Writing fetch calls directly in the render body — they fire twice in StrictMode, revealing that they belong in useEffect.'
    ],
    seniorNotes: 'React 18\'s off-screen feature (not yet stable) will unmount/remount components as a performance optimization — meaning the double-effect behavior StrictMode emulates in dev will happen in production. Every app built with proper StrictMode compliance is already prepared for this.',
    interviewQuestions: [
      'What does React StrictMode do to component rendering in development?',
      'Why does `useEffect` run twice in StrictMode?',
      'What are some deprecated APIs that StrictMode warns about?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'StrictMode setup and effect double-run',
        code: `// main.tsx — Vite default setup
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// This effect RUNS TWICE in dev (intentional):
useEffect(() => {
  const sub = eventBus.subscribe(handler);
  return () => sub.unsubscribe(); // MUST clean up — StrictMode proves it
}, []);

// Without cleanup, StrictMode reveals the bug:
// mount → subscribe (#1) → cleanup ??? → mount → subscribe (#2)
// Result: two active subscriptions in the same session.
// With cleanup: mount → subscribe → unsubscribe → mount → subscribe (1 active = correct)`
      }
    ]
  },


  /* â”€â”€ PHASE 2: React Hooks Deep Dive â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'useEffect', phase: 2, phaseName: 'React Hooks',
    orderIndex: 27, estimatedMins: 30, prerequisites: ['useState', 'async-await'],
    title: 'useEffect — Side Effects',
    eli5: 'useEffect says "after React draws the component, do this thing." It\'s for anything that reaches outside of React: fetching data, setting up a timer, talking to a browser API.',
    analogy: 'useEffect is the "after-school job." The school day (render) finishes, then you go do your side job (fetch data, update the document title). You don\'t do the job DURING class.',
    explanation: '`useEffect(fn, deps)` runs `fn` after every render by default. With `[]` it runs once after mount. With `[dep1, dep2]` it re-runs when those values change. The effect must not return anything except optionally a cleanup function.',
    technicalDeep: 'Effects run after the browser paints — they do not block the UI. `useLayoutEffect` runs synchronously before paint (for DOM measurements). Dependency array: every reactive value (state, props, context, functions defined in render) used inside the effect MUST be in the deps array — the `exhaustive-deps` ESLint rule enforces this. Omitting a dep causes stale closure bugs. Object/array deps: `useEffect` compares by reference — `{}` !== `{}`. Memoize objects with `useMemo` or `useCallback` before using them as deps. Effects fire after every render where deps changed, not on a schedule. The order: render → browser paint → cleanup previous effect → run new effect.',
    whatBreaks: 'Missing deps cause stale closures. Empty `[]` with a value that changes inside — the effect sees the initial value forever. Functions defined in render used as deps — they change reference every render, causing infinite loops. Fix: move functions inside the effect or wrap with `useCallback`.',
    efficientWay: {
      title: 'Using useEffect correctly',
      approaches: [
        { name: 'Install the exhaustive-deps ESLint rule and follow it', verdict: 'best', reason: 'The rule catches 99% of stale closure bugs before they reach production.' },
        { name: 'Disable the ESLint rule and manage deps manually', verdict: 'weak', reason: 'You will ship stale closure bugs. The rule exists because this is hard to get right manually.' },
        { name: 'Move data fetching to a library (React Query) instead', verdict: 'best', reason: 'Removes most manual useEffect-for-fetching code and its deps complexity.' }
      ],
      recommendation: 'Enable `eslint-plugin-react-hooks` from day one. Follow the exhaustive-deps rule religiously. For fetching, prefer TanStack Query over raw useEffect — it handles caching, deduplication, and stale data automatically.'
    },
    commonMistakes: [
      'Putting an object/array literal in the deps array — new reference every render → infinite loop.',
      'Fetching data in useEffect without handling the unmounted component case.',
      'Using `async` directly in useEffect — it returns a Promise; use an inner async function instead.'
    ],
    seniorNotes: 'The React team\'s recommendation (React 18+): derive as much as possible in render, not in effects. The new `use()` hook and React Query address the data-fetching-in-effects pattern. If you find yourself writing `useEffect` to sync two pieces of state, something is wrong — effects are for synchronizing React with external systems, not for intra-React sync.',
    interviewQuestions: [
      'What is the difference between useEffect with no deps, [], and [dep]?',
      'Why should you not pass an async function directly to useEffect?',
      'What is a "stale closure" in useEffect and how do you prevent it?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'useEffect: mount, deps, cleanup',
        code: `function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);

  // Re-runs whenever userId changes
  useEffect(() => {
    let cancelled = false;           // guard for unmount
    const controller = new AbortController();

    async function load() {
      const res  = await fetch(\`/api/users/\${userId}\`, { signal: controller.signal });
      const data = await res.json();
      if (!cancelled) setUser(data); // only set if still mounted
    }
    load();

    return () => {                   // cleanup
      cancelled = true;
      controller.abort();
    };
  }, [userId]);   // ← re-run when userId changes

  // Document title side effect — runs after every render
  useEffect(() => {
    document.title = user ? \`\${user.name} | App\` : 'Loading...';
  }, [user]);

  return user ? <h1>{user.name}</h1> : <Spinner />;
}`
      }
    ]
  },

  {
    id: 'useRef', phase: 2, phaseName: 'React Hooks',
    orderIndex: 28, estimatedMins: 20, prerequisites: ['useEffect'],
    title: 'useRef — Stable References',
    eli5: 'useRef gives you a box that persists between renders. You can put anything in it. Two uses: hold a reference to a real DOM element (like grabbing a handle to an input), or store a value that changes without causing a re-render.',
    analogy: 'useRef is a sticky note on the back of the whiteboard. The front (state/render) changes all the time; the sticky note persists and doesn\'t trigger a re-draw.',
    explanation: '`const ref = useRef(initial)` returns `{ current: initial }`. The `current` property is mutable and its changes do NOT trigger re-renders. Used for: DOM node access (`ref={inputRef}`), storing previous values, storing timers/intervals, storing values shared with effects without causing re-runs.',
    technicalDeep: 'Refs are instance variables for functional components. The same ref object persists across all renders of the same component instance. `ref.current` is synchronously mutable — you can read and write it from anywhere (render, effects, callbacks) without React knowing. DOM refs: `useRef<HTMLInputElement>(null)` — typed with the element type, initial `null`. After mount, `ref.current` points to the actual DOM node. Cleanup: when a component unmounts, React sets `ref.current` to `null` for DOM refs. `useRef` vs `useState`: if reading the value in render, use state. If the value should NOT trigger re-render (e.g., a timer ID, a previous value comparison), use ref. `forwardRef` lets parent components pass a ref into a child component — needed when a parent needs to focus/scroll a child\'s DOM element.',
    whatBreaks: 'Reading `ref.current` in the render body during the first render — DOM refs are null until after mount. Writing to `ref.current` directly to "update" displayed content — it won\'t re-render. Using refs instead of state for values that should appear in the UI.',
    efficientWay: {
      title: 'Using useRef',
      approaches: [
        { name: 'Use ref for DOM access and timer/interval IDs', verdict: 'best', reason: 'The two canonical uses that appear in every real project.' },
        { name: 'Use ref instead of state to avoid re-renders', verdict: 'ok', reason: 'Valid optimization, but if the value should appear in the UI, state is correct.' },
        { name: 'Use useRef to store previous state (ref.current = value after render)', verdict: 'ok', reason: 'Useful pattern for comparing current vs previous value.' }
      ],
      recommendation: 'Decision: "Does changing this value need to update the UI?" Yes → state. No → ref.'
    },
    commonMistakes: [
      'Reading DOM ref.current during render (before mount) — it\'s null.',
      'Using ref instead of state for values shown in JSX — they won\'t update the display.',
      'Forgetting to type the ref: `useRef<HTMLInputElement>(null)` vs `useRef(null)` — the typed version avoids null-check errors.'
    ],
    seniorNotes: '`useRef` is the foundation of `forwardRef` — used in every custom input component that needs to be focus-able by parent. React 19 introduces the `ref` prop directly (no `forwardRef` needed) — a welcome simplification.',
    interviewQuestions: [
      'What is the difference between useRef and useState?',
      'Why is the initial value of a DOM ref `null`?',
      'What is forwardRef and when do you need it?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'useRef: DOM access and mutable storage',
        code: `function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const inputRef  = useRef<HTMLInputElement>(null);   // DOM ref
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null); // timer ID

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (timerRef.current) clearTimeout(timerRef.current); // debounce
    timerRef.current = setTimeout(() => onSearch(e.target.value), 300);
  }

  useEffect(() => {
    inputRef.current?.focus(); // focus on mount — safe here (after paint)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current); // cleanup timer
    };
  }, []);

  return <input ref={inputRef} onChange={handleChange} placeholder="Search..." />;
}

// forwardRef — parent needs to focus the input
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <input ref={ref} {...props} />
));`
      }
    ]
  },

  {
    id: 'useMemo', phase: 2, phaseName: 'React Hooks',
    orderIndex: 29, estimatedMins: 20, prerequisites: ['useEffect'],
    title: 'useMemo — Memoized Values',
    eli5: 'useMemo saves the result of an expensive calculation. If the inputs haven\'t changed, it gives you the saved answer instead of recalculating. Like remembering the answer to 12 × 543 so you don\'t have to multiply it every time someone asks.',
    analogy: 'useMemo is a calculator with a memory button. Press M+ after a complex calculation; next time, just press MR instead of doing the math again.',
    explanation: '`const result = useMemo(() => expensiveCalc(a, b), [a, b])` — memoizes the return value of the function and only recomputes when `a` or `b` changes. Use for: expensive calculations, creating stable object/array references for other hooks\' deps.',
    technicalDeep: 'useMemo runs its function synchronously during render, caches the result, and returns the cached value on subsequent renders where deps haven\'t changed. Unlike `useCallback` (memoizes a function), `useMemo` memoizes the function\'s RETURN VALUE. The dependency comparison is Object.is (reference equality for objects). useMemo has a cost: the deps comparison runs every render. Only use when the calculation is actually expensive (>1ms) OR when you need a stable reference for another hook\'s deps array. React may discard the memo cache (e.g., between tab switches) — `useMemo` is an optimization hint, not a guarantee.',
    whatBreaks: 'Using `useMemo` for cheap calculations (adds overhead without benefit). Putting object/array literals inside deps of `useMemo` — they are new references every render, breaking the memoization. Using `useMemo` to "prevent" renders — that\'s `React.memo`\'s job.',
    efficientWay: {
      title: 'When to use useMemo',
      approaches: [
        { name: 'Profile first, memoize second', verdict: 'best', reason: 'Most calculations are fast enough. Add useMemo only after measuring > ~1ms in the profiler.' },
        { name: 'useMemo for stable deps references used in useEffect or useCallback', verdict: 'best', reason: 'Prevents infinite loops caused by object deps that change reference every render.' },
        { name: 'Wrap everything in useMemo proactively', verdict: 'weak', reason: 'Premature optimization — adds cognitive load and the deps comparison cost without benefit.' }
      ],
      recommendation: 'Two clear use cases: (1) filtering/sorting large lists (>1000 items), (2) stabilizing object/array references used as useEffect/useCallback deps. For everything else, compute directly in render.'
    },
    commonMistakes: [
      'Using useMemo for simple calculations (`useMemo(() => a + b, [a, b])` — just write `const sum = a + b`).',
      'Putting a new object literal in the deps: `useMemo(() => f(), [{ id }])` — `{ id }` is new every render.',
      'Expecting useMemo to prevent re-renders of the component — it does not, it only caches values.'
    ],
    seniorNotes: 'React Compiler (in React 19) automatically memoizes components and hooks without manual `useMemo`/`useCallback`. This will eventually make manual memoization largely unnecessary. Learn the concepts to debug the compiler\'s decisions, not to write memoization everywhere.',
    interviewQuestions: [
      'What is the difference between useMemo and useCallback?',
      'When should you NOT use useMemo?',
      'Why can React discard the useMemo cache?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'useMemo for expensive filter and stable ref',
        code: `function ProductList({ products, search, minPrice }: Props) {
  // Memoize expensive filter — only recomputes when inputs change
  const filtered = useMemo(() => {
    return products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter(p => p.price >= minPrice)
      .sort((a, b) => a.price - b.price);
  }, [products, search, minPrice]);

  // Memoize a config object to use as a stable useEffect dep
  const chartConfig = useMemo(() => ({
    type: 'bar',
    data: filtered.map(p => p.price),
  }), [filtered]);

  useEffect(() => {
    chart.update(chartConfig); // chartConfig is stable — won't loop
  }, [chartConfig]);

  return <>{filtered.map(p => <ProductCard key={p.id} product={p} />)}</>;
}`
      }
    ]
  },

  {
    id: 'useCallback', phase: 2, phaseName: 'React Hooks',
    orderIndex: 30, estimatedMins: 15, prerequisites: ['useMemo'],
    title: 'useCallback — Stable Function References',
    eli5: 'useCallback saves a function between renders. Without it, every render creates a brand new function — which can cause child components to think something changed and re-render unnecessarily.',
    analogy: 'useCallback is a laminating machine. You laminate the function once; every time someone asks for it you hand them the same laminated card, not a freshly printed new one.',
    explanation: '`const fn = useCallback(() => doThing(a), [a])` — returns the same function reference between renders unless `a` changes. Primarily useful when passing callbacks to memoized children (`React.memo`) or using them as `useEffect` deps.',
    technicalDeep: '`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)` — it memoizes the function itself (the value) not its return. A function defined in render has a new reference every render. This matters ONLY when: (1) the function is passed to a `React.memo` child — child re-renders because prop reference changed. (2) the function is in a `useEffect` deps array — effect re-runs because function reference changed. Without these two scenarios, `useCallback` adds overhead without benefit. The `exhaustive-deps` rule applies: all values from the component scope used in the function must be in the deps array.',
    whatBreaks: 'Wrapping every event handler in `useCallback` by default — adds deps array management overhead without benefit for non-memoized children. Omitting deps in the array — stale closure.',
    efficientWay: {
      title: 'When to use useCallback',
      approaches: [
        { name: 'Only use with React.memo children or useEffect deps', verdict: 'best', reason: 'These are the only two cases where reference stability actually matters.' },
        { name: 'Use everywhere "just in case"', verdict: 'weak', reason: 'Adds cognitive and runtime overhead — deps arrays can have bugs, adding more is counterproductive.' },
        { name: 'Profile to confirm re-render cost before adding useCallback', verdict: 'best', reason: 'If re-rendering the child is cheap, useCallback saves nothing.' }
      ],
      recommendation: 'Start without useCallback. Add it when: (a) you see in the Profiler that a child re-renders unnecessarily because a callback prop changed, (b) you have a function in a useEffect deps array that creates an infinite loop.'
    },
    commonMistakes: [
      'Wrapping every handler in useCallback — almost never beneficial without React.memo.',
      'Omitting state/prop dependencies — stale closure inside the callback.',
      'Using useCallback on inline onClick handlers that are not passed to memoized children.'
    ],
    seniorNotes: 'The "when to memoize" question is one of the most debated in React. The React team\'s answer (2024): measure first, the React Compiler will automate this in the future. Today: useCallback at API boundaries between feature modules, where prop contracts are explicit.',
    interviewQuestions: [
      'What is the difference between useCallback and useMemo?',
      'When does useCallback provide a performance benefit?',
      'What happens if you omit a dependency from useCallback\'s deps array?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'useCallback with React.memo',
        code: `// Child is expensive to render — wrap in memo
const ExpensiveList = React.memo(function ExpensiveList({
  items, onDelete
}: { items: Item[]; onDelete: (id: number) => void }) {
  return <ul>{items.map(i => <li key={i.id} onClick={() => onDelete(i.id)}>{i.name}</li>)}</ul>;
});

function Parent({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('');

  // Without useCallback: new function every render → ExpensiveList re-renders despite memo
  // With useCallback: same reference → memo comparison passes → no re-render
  const handleDelete = useCallback((id: number) => {
    // delete item from server/store
    console.log('delete', id);
  }, []); // no deps — function doesn't close over any state

  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ExpensiveList items={items} onDelete={handleDelete} />
    </>
  );
}`
      }
    ]
  },

  {
    id: 'useContext', phase: 2, phaseName: 'React Hooks',
    orderIndex: 31, estimatedMins: 20, prerequisites: ['lifting-state-up'],
    title: 'useContext — Consuming Context',
    eli5: 'Context is like a radio station. The provider broadcasts a signal. Any component anywhere in the tree that tunes in (useContext) hears the signal — without the signal needing to be passed through every component between them.',
    analogy: 'Context is electrical wiring. State is a battery. Without wiring (context), you carry the battery by hand down every staircase (prop drilling). Wiring lets any room tap power without the hallways holding cables.',
    explanation: '`const value = useContext(MyContext)` subscribes a component to the nearest `<MyContext.Provider>` above it in the tree. When the context value changes, all consumers re-render. Used for: auth state, theme, locale, anything needed by many components at different nesting levels.',
    technicalDeep: 'Creating context: `const ThemeCtx = createContext<ThemeType>(defaultValue)`. The default is used when a consumer renders outside a Provider. Context value comparison: React uses Object.is — if you pass `value={{ theme, toggle }}` (new object every render), every consumer re-renders on every parent render. Fix: memoize the value with `useMemo`. Context does NOT prevent re-renders of consumers — every subscriber re-renders on ANY value change, even if they only use a slice. Fix: split context (one per concern) or use a context selector library. `useContext` must be inside a component or hook — not at the module level.',
    whatBreaks: 'Passing a new object literal as the context value every render causes all consumers to re-render on every parent render — often unnecessary. Single large context (auth + theme + locale) means a theme change re-renders everything reading the context.',
    efficientWay: {
      title: 'Using context well',
      approaches: [
        { name: 'One context per concern (auth, theme, locale)', verdict: 'best', reason: 'Changing the theme doesn\'t re-render auth-dependent components.' },
        { name: 'Memoize the context value with useMemo', verdict: 'best', reason: 'Prevents unnecessary re-renders caused by new object reference on each parent render.' },
        { name: 'One big app context for everything', verdict: 'weak', reason: 'Any state change re-renders every consumer in the entire tree.' }
      ],
      recommendation: 'Split contexts by update frequency. Auth context (rarely changes) and theme context (changes on toggle) should be separate providers. For frequently-updating data (like a search query), use Zustand instead of context.'
    },
    commonMistakes: [
      'Passing `value={{ ...stuff }}` inline to Provider — new object every render triggers all consumers.',
      'Using context for frequently-updating data (like a live counter) — every consumer re-renders on every tick.',
      'Not providing a default value in `createContext` — results in TypeScript requiring non-null assertions everywhere.'
    ],
    seniorNotes: 'The "Context vs Zustand" decision: Context is great for low-frequency-update values (auth, theme). Zustand is better for state that many components read AND write frequently — it has a built-in subscription model that only re-renders components that subscribed to the specific slice that changed.',
    interviewQuestions: [
      'What is the difference between React Context and state management libraries like Redux?',
      'Why does passing a new object literal to a context Provider cause performance issues?',
      'When would you choose Context over prop drilling?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Context: creation, provider, consumer',
        code: `// 1. Create
interface AuthCtx { user: User | null; logout: () => void; }
const AuthContext = createContext<AuthCtx | null>(null);

// 2. Custom hook for type-safe consumption
function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

// 3. Provider — memoize value to prevent unnecessary re-renders
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const logout = useCallback(() => { setUser(null); }, []);
  const value = useMemo(() => ({ user, logout }), [user, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Consumer — anywhere in the tree
function NavBar() {
  const { user, logout } = useAuth();
  return <header>{user ? <button onClick={logout}>Logout</button> : <Link href="/login">Login</Link>}</header>;
}`
      }
    ]
  },

  {
    id: 'useReducer', phase: 2, phaseName: 'React Hooks',
    orderIndex: 32, estimatedMins: 25, prerequisites: ['useState'],
    title: 'useReducer — Complex State',
    eli5: 'useReducer is like useState but for when state gets complicated. Instead of updating state directly, you send an "action" (a message saying what happened). A "reducer" function decides what the new state should be based on that message.',
    analogy: 'useReducer is a vending machine. You press a button (dispatch an action). The machine (reducer) decides what to give you based on the button and what\'s currently inside (current state). You never reach inside and grab things.',
    explanation: '`const [state, dispatch] = useReducer(reducer, initialState)`. `reducer` is a pure function `(state, action) => newState`. Dispatch an action: `dispatch({ type: "INCREMENT" })`. Use when: state has multiple sub-values that change together, next state depends on current state in complex ways, state transitions need to be centralized.',
    technicalDeep: 'The reducer pattern is borrowed from Redux (Flux architecture). It enforces: (1) state is immutable — always return a new object. (2) transitions are explicit — you can read every possible state change in one function. (3) testable — pure function, no side effects. TypeScript with discriminated union actions: `type Action = { type: "inc" } | { type: "set"; payload: number }` — the switch is exhaustive. Reducer + Context is a lightweight state manager — pass `dispatch` via context for shared state. The `useReducer` initializer: third argument is a function `(arg) => initialState` for lazy initialization (same as useState lazy init).',
    whatBreaks: 'Mutating state inside a reducer instead of returning a new object — React won\'t detect the change. Dispatching actions inside the reducer instead of from effects/handlers — reducers must be pure.',
    efficientWay: {
      title: 'When to use useReducer',
      approaches: [
        { name: 'Switch from useState to useReducer when you have 3+ related state vars', verdict: 'best', reason: 'Multiple related `useState` calls that need to change together are the exact signal.' },
        { name: 'Use useReducer for all state from the start', verdict: 'ok', reason: 'Valid but adds boilerplate for simple cases.' },
        { name: 'Use Zustand instead of useReducer for shared state', verdict: 'best', reason: 'Zustand is less boilerplate and more ergonomic for app-wide state.' }
      ],
      recommendation: 'useReducer shines for local, complex state with multiple transition types. For app-wide state, Zustand. For simple counters/toggles, useState.'
    },
    commonMistakes: [
      'Mutating state in the reducer: `state.count++; return state` — same reference, React skips re-render.',
      'Dispatching inside effects synchronously without checking if the component is mounted.',
      'Making the reducer impure (async calls, Math.random inside) — reducers must be pure.'
    ],
    seniorNotes: 'The `useReducer` + `Context` pattern (Reducer + Provider) is a micro-Redux. It\'s suitable for feature-level state in medium apps. For large apps with shared state across many features, Redux Toolkit or Zustand provides better DevTools and middleware support.',
    interviewQuestions: [
      'When would you choose useReducer over useState?',
      'What makes a reducer function "pure"?',
      'How does the useReducer pattern compare to Redux?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'useReducer for a shopping cart',
        code: `type CartItem = { id: number; name: string; qty: number; price: number };
type CartState = { items: CartItem[]; total: number };
type Action =
  | { type: 'ADD';    item: CartItem }
  | { type: 'REMOVE'; id: number }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.item.id);
      const items = existing
        ? state.items.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...action.item, qty: 1 }];
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    }
    case 'REMOVE': {
      const items = state.items.filter(i => i.id !== action.id);
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    }
    case 'CLEAR': return { items: [], total: 0 };
    default: return state;
  }
}

function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  return (
    <div>
      <p>Total: ${'{'}cart.total{'}'}</p>
      <button onClick={() => dispatch({ type: 'CLEAR' })}>Clear</button>
    </div>
  );
}`
      }
    ]
  },

  {
    id: 'custom-hooks', phase: 2, phaseName: 'React Hooks',
    orderIndex: 33, estimatedMins: 25, prerequisites: ['useEffect', 'useRef'],
    title: 'Custom Hooks',
    eli5: 'Custom hooks let you extract reusable logic out of components and share it. If two components do the same stateful thing (like fetching a user), you write the logic once in a custom hook and both components use it.',
    analogy: 'Custom hooks are like creating your own power tools. Instead of rewiring the same circuit in every room, you build a drill (hook) once and plug it in wherever you need it.',
    explanation: 'A custom hook is a function that starts with `use` and can call other hooks. It extracts stateful logic from a component. Name must start with `use` — this is how React (and ESLint) enforces the rules of hooks on it. Returns whatever the calling component needs.',
    technicalDeep: 'Custom hooks share stateful logic, not state itself — each component calling the hook gets its own isolated state. Rules of hooks apply inside custom hooks: no conditional hook calls. Custom hooks compose: `useAutoSave` might call `useDebounce` and `useMutation`. Testing: custom hooks can be tested with `@testing-library/react`\'s `renderHook`. TypeScript: return type should be explicitly typed for consumer IDE support. Common patterns: `useBoolean` (toggle), `useLocalStorage` (persisted state), `useDebounce`, `useFetch<T>`, `usePrevious`, `useWindowSize`, `useOnClickOutside`, `useMediaQuery`.',
    whatBreaks: 'Not starting the name with `use` — the ESLint rules-of-hooks plugin won\'t enforce hook rules inside it. Calling a custom hook conditionally — same error as conditional useState.',
    efficientWay: {
      title: 'Building custom hooks',
      approaches: [
        { name: 'Extract a hook the moment you copy-paste stateful logic between two components', verdict: 'best', reason: 'The duplication signal is the right trigger — hooks should emerge from real need, not be designed upfront.' },
        { name: 'Design a hook library before building any components', verdict: 'weak', reason: 'You won\'t know what the real abstractions are until you\'ve built 2-3 features.' },
        { name: 'Use community hook libraries (react-use, ahooks)', verdict: 'ok', reason: 'Good for common patterns; own your critical logic to avoid dependency risks.' }
      ],
      recommendation: 'Extract a custom hook when: (1) you copy-paste stateful logic between components, (2) a component has >2 related `useEffect`/`useState` calls that belong together, (3) you want to test stateful logic in isolation.'
    },
    commonMistakes: [
      'Not starting the function name with `use` — rules of hooks not enforced.',
      'Returning too many things from a hook — group related returns in an object.',
      'Sharing state across callers (trying to use a hook as a singleton) — each call gets its own isolated state.'
    ],
    seniorNotes: 'The "hook boundary" in a codebase is where imperative logic (subscriptions, DOM, browser APIs) meets declarative React. A well-designed hook hides the imperative complexity and exposes a clean, typed API. This is the same boundary principle as port adapters in clean architecture.',
    interviewQuestions: [
      'Why must custom hook names start with "use"?',
      'Does calling the same custom hook in two components share state between them?',
      'How do you test a custom hook in isolation?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Custom hooks: useLocalStorage and useDebounce',
        code: `// useLocalStorage<T> — persisted state
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? initial; }
    catch { return initial; }
  });
  const set = useCallback((v: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);
  return [value, set] as const;
}

// useDebounce<T> — debounced value
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// Usage
function Search() {
  const [query, setQuery] = useLocalStorage('search', '');
  const debouncedQuery    = useDebounce(query, 400);
  // debouncedQuery triggers the API call — not every keystroke
}`
      }
    ]
  },

  {
    id: 'use-transition', phase: 2, phaseName: 'React Hooks',
    orderIndex: 34, estimatedMins: 20, prerequisites: ['useState', 'what-is-react'],
    title: 'useTransition & useDeferredValue',
    eli5: 'Some updates are urgent (typing in an input) and some can wait (filtering a 10,000-item list). useTransition lets you mark an update as "non-urgent" so React can keep the urgent parts fast.',
    analogy: 'A hospital triage system. Urgent patients (typing) go straight to a doctor. Non-urgent patients (filtering results) wait in the queue. useTransition is the triage nurse.',
    explanation: '`const [isPending, startTransition] = useTransition()`. Wrap low-priority updates in `startTransition(() => setHeavyState(val))`. React renders the current state immediately (keeping typing responsive) and processes the heavy update in the background. `useDeferredValue(value)` defers a value for rendering — similar but for values you don\'t control.',
    technicalDeep: 'Concurrent React (React 18+) can pause and resume rendering. `startTransition` marks updates as "concurrent" — interruptible by urgent updates. While the transition is in progress, `isPending` is true — use to show a subtle loading indicator. `useDeferredValue` keeps showing the old value while a new expensive render computes in the background. Both require the expensive rendering to be memoized (wrapped in `useMemo` or `React.memo`) to actually defer work. Without memoization, the deferred value still triggers an immediate re-render.',
    whatBreaks: 'Transitions don\'t help if the expensive component isn\'t memoized — React renders it synchronously anyway. Don\'t wrap state updates that must be synchronous (like navigation) in transitions.',
    efficientWay: {
      title: 'Using concurrent features',
      approaches: [
        { name: 'Add useTransition to search/filter that causes typing lag', verdict: 'best', reason: 'The canonical use case — keeps the input responsive during expensive list re-renders.' },
        { name: 'Use for every state update', verdict: 'weak', reason: 'Adds complexity for no benefit when renders are fast.' },
        { name: 'Virtualize long lists instead', verdict: 'best', reason: 'react-window/virtual eliminates the rendering cost entirely — better than deferring it.' }
      ],
      recommendation: 'Before reaching for `useTransition`, virtualize long lists (react-virtual). Use transitions as a secondary tool for unavoidably expensive renders.'
    },
    commonMistakes: [
      'Expecting useTransition to speed up network requests — it only helps with expensive renders.',
      'Not memoizing the expensive component — the transition has no effect without React.memo or useMemo.',
      'Using for navigation state — navigation should be synchronous and immediate.'
    ],
    seniorNotes: 'The React 18 root API (`createRoot`) is required for concurrent features — the legacy `ReactDOM.render` does not support them. Both Vite\'s `react` template and Next.js 13+ use `createRoot` by default.',
    interviewQuestions: [
      'What problem does useTransition solve?',
      'What is the difference between useTransition and useDeferredValue?',
      'Why must the expensive component be memoized for useTransition to help?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'useTransition for a responsive search filter',
        code: `function SearchPage({ items }: { items: Item[] }) {
  const [query, setQuery]         = useState('');
  const [filtered, setFiltered]   = useState(items);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q); // urgent — update input immediately

    startTransition(() => {
      // non-urgent — can be deferred if user keeps typing
      setFiltered(items.filter(i => i.name.toLowerCase().includes(q.toLowerCase())));
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Filtering...</span>}
      {/* This renders the PREVIOUS filtered results until the transition finishes */}
      <MemoizedList items={filtered} />
    </>
  );
}
const MemoizedList = React.memo(({ items }: { items: Item[] }) => (
  <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
));`
      }
    ]
  },

  {
    id: 'react-memo', phase: 2, phaseName: 'React Hooks',
    orderIndex: 35, estimatedMins: 15, prerequisites: ['useCallback', 'useMemo'],
    title: 'React.memo — Skipping Re-renders',
    eli5: 'React.memo wraps a component and tells React: "only re-render this if the props actually changed." Without it, the component re-renders every time its parent re-renders, even if nothing passed to it changed.',
    analogy: 'React.memo is a guard at a component\'s door. It checks "Did the props change?" If no, it turns away the re-render request. The component doesn\'t even answer the door.',
    explanation: '`const MemoComp = React.memo(MyComp)` — shallow-compares props before re-rendering. If all props are the same reference (or primitive value), the component skips re-rendering. Must pair with `useCallback`/`useMemo` for function/object props to be stable.',
    technicalDeep: 'React.memo wraps the component in a HOC that does `Object.is` comparison on each prop. Same: skip render. Different: render. For objects/functions, "same" means same reference. Without stable references (from `useCallback`/`useMemo`), every parent render creates new prop references, and `React.memo` never helps. Custom comparison: `React.memo(Comp, (prevProps, nextProps) => prevProps.id === nextProps.id)` — return `true` to skip render, `false` to render. The default comparison is shallow (one level deep). `React.memo` should be measured before applied — each memo adds comparison overhead every parent render; if the component is cheap, that overhead may be more expensive than the render.',
    whatBreaks: 'Object/array/function props that are recreated every parent render defeat React.memo — the comparison always fails. Custom comparison functions that compare incorrectly (returning true when props are different) cause stale renders that show incorrect data.',
    efficientWay: {
      title: 'When to use React.memo',
      approaches: [
        { name: 'Profile first, add memo when you see unnecessary re-renders of expensive components', verdict: 'best', reason: 'Avoid premature optimization — most components are fast enough without memo.' },
        { name: 'Wrap all leaf components in memo proactively', verdict: 'ok', reason: 'Reduces future surprises but adds maintenance overhead for deps.' },
        { name: 'Add React.memo to every component', verdict: 'weak', reason: 'Comparison cost can exceed render cost for simple components.' }
      ],
      recommendation: 'The memo triangle: `React.memo` (component) + `useCallback` (function props) + `useMemo` (object props) all three must work together. One without the others rarely helps.'
    },
    commonMistakes: [
      'Using React.memo without also stabilizing function/object props — comparisons always fail.',
      'Memoizing components that re-render because their context changed — memo only checks props.',
      'Writing a custom comparison function that omits some props — stale data shown in UI.'
    ],
    seniorNotes: 'React Compiler (2024, opt-in in React 19) automatically applies memoization — making manual `React.memo`, `useCallback`, and `useMemo` largely unnecessary. When it\'s widely adopted, the current best practice will shift to "let the compiler do it."',
    interviewQuestions: [
      'What does React.memo compare to decide whether to re-render?',
      'Why does React.memo often not help when a parent passes a callback prop?',
      'How do you provide a custom comparison function to React.memo?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'React.memo with stable props',
        code: `// Expensive child — wrap in memo
const DataRow = React.memo(function DataRow({
  item, onEdit, onDelete
}: { item: Item; onEdit: (id: number) => void; onDelete: (id: number) => void }) {
  console.log('DataRow rendered:', item.id);
  return (
    <tr>
      <td>{item.name}</td>
      <td><button onClick={() => onEdit(item.id)}>Edit</button></td>
      <td><button onClick={() => onDelete(item.id)}>Del</button></td>
    </tr>
  );
});

function Table({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('');

  // MUST stabilize these — otherwise DataRow memo never helps
  const handleEdit   = useCallback((id: number) => { /* ... */ }, []);
  const handleDelete = useCallback((id: number) => { /* ... */ }, []);

  return (
    <table>
      <tbody>
        {items.map(item => (
          <DataRow key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </tbody>
    </table>
  );
}`
      }
    ]
  },

  {
    id: 'hooks-rules', phase: 2, phaseName: 'React Hooks',
    orderIndex: 36, estimatedMins: 15, prerequisites: ['useState', 'useEffect'],
    title: 'Rules of Hooks',
    eli5: 'Hooks have two important rules: always call them at the top of your component (not inside if-blocks or loops), and only call them from React functions (not regular JS functions). These rules are enforced by an ESLint plugin.',
    analogy: 'Hook calls are seats on a train. React tracks which seat is which by their ORDER in the train, not by their name. If you add or remove a seat mid-journey (conditional hook), all subsequent seats get the wrong passengers.',
    explanation: 'Rule 1: Call hooks only at the top level — not inside loops, conditions, or nested functions. Rule 2: Call hooks only from React function components or custom hooks — not from regular functions, classes, or event handlers. These rules ensure hooks are called in the same order every render.',
    technicalDeep: 'React stores hook state in a linked list indexed by call order. Hook #1 (first useState) is always slot 0, hook #2 is slot 1, etc. If you call a hook conditionally, some renders skip slot N, and every subsequent hook reads from the wrong slot — getting another hook\'s state. ESLint plugin `eslint-plugin-react-hooks` with rules `rules-of-hooks` and `exhaustive-deps` enforces both rules. The plugin statically analyzes the code — it cannot catch runtime conditions (`if (typeof window !== "undefined")`) inside hooks, so be careful with those. React will throw a helpful error "Rendered more hooks than during previous render" if the rule is violated at runtime.',
    whatBreaks: 'Any conditional hook call (including inside try/catch): React throws "Rendered fewer/more hooks than during previous render" — usually immediately visible. Using hooks inside event handlers, `setTimeout` callbacks, or class component methods — same error.',
    efficientWay: {
      title: 'Following the rules',
      approaches: [
        { name: 'Install eslint-plugin-react-hooks in every project', verdict: 'best', reason: 'Catches violations before you run the code. Vite template includes it already.' },
        { name: 'Memorize the rules and rely on code review', verdict: 'weak', reason: 'The ESLint rule catches violations instantly — no reason to rely on review.' },
        { name: 'Put the condition INSIDE the hook body', verdict: 'best', reason: 'If you need conditional logic, move it inside the hook, not around the hook call.' }
      ],
      recommendation: 'Never fight the rules of hooks. If you feel the need to conditionally call a hook, restructure: move the condition inside the hook, use a boolean param, or split into two components that each always call the hook.'
    },
    commonMistakes: [
      'Calling a hook inside an `if` block to "skip" it when not needed — always call it, use the result conditionally.',
      'Early `return` before all hooks are called — same violation as a conditional call.',
      'Calling hooks in regular utility functions — they must be in components or custom hooks.'
    ],
    seniorNotes: 'The rules of hooks exist because React\'s hook model relies on call order, not a registration system with names. Alternative frameworks (Solid.js, Svelte) use reactive primitives that don\'t have this constraint — it\'s a deliberate trade-off React made for simplicity of implementation.',
    interviewQuestions: [
      'What are the two rules of hooks?',
      'Why can\'t you call a hook inside an if statement?',
      'How does the ESLint plugin enforce the rules of hooks?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Violations and their fixes',
        code: `// âŒ VIOLATION: conditional hook call
function Profile({ userId }: { userId?: number }) {
  if (!userId) return <p>Not logged in</p>; // early return before hooks
  const [user, setUser] = useState(null);   // ERROR: called fewer hooks than last render
}

// ✅ FIX: call hooks first, condition after
function Profile({ userId }: { userId?: number }) {
  const [user, setUser] = useState(null); // always called
  if (!userId) return <p>Not logged in</p>; // condition AFTER all hooks
}

// âŒ VIOLATION: hook in conditional
function Search({ enabled }: { enabled: boolean }) {
  if (enabled) {
    const [q, setQ] = useState(''); // conditional hook
  }
}

// ✅ FIX: always call, use enabled inside
function Search({ enabled }: { enabled: boolean }) {
  const [q, setQ] = useState('');
  if (!enabled) return null; // after all hooks
}`
      }
    ]
  },

  {
    id: 'hook-patterns', phase: 2, phaseName: 'React Hooks',
    orderIndex: 37, estimatedMins: 20, prerequisites: ['custom-hooks', 'useReducer'],
    title: 'Hook Composition Patterns',
    eli5: 'Once you have a few custom hooks, you can build new hooks on top of them — like stacking LEGO bricks. A `useUserProfile` hook might use `useFetch`, `useLocalStorage`, and `useDebounce` all together inside it.',
    analogy: 'Hook composition is like a recipe that calls other recipes. "Make pizza" calls "make dough" and "make sauce" — each a recipe itself.',
    explanation: 'Hooks compose: custom hooks can call other custom hooks. This enables building complex behaviors from small, tested units. Common compositions: `useAsync` = `useReducer` + `useCallback`. `useForm` = `useState` + validation logic. `useEntityCache` = `useFetch` + `useLocalStorage`.',
    technicalDeep: 'Composition principles: (1) each hook does one thing. (2) hooks that call other hooks must still follow rules of hooks. (3) testing hooks in isolation (renderHook) is easier when they\'re simple and focused. State machines in hooks: model loading states as discriminated unions (`FetchState<T>`) rather than booleans. The "options object" pattern for hook params: `useQuery(url, { enabled, staleTime, onSuccess })` — more extensible than positional args. `useRef` for imperative handles: return `{ ref, focus, blur, measure }` to expose imperative operations alongside reactive state.',
    whatBreaks: 'Composing too many hooks in one custom hook makes it hard to test and reason about. Each composed hook\'s deps must be respected — missing deps propagate bugs silently through the chain.',
    efficientWay: {
      title: 'Hook composition',
      approaches: [
        { name: 'Compose small focused hooks into larger feature hooks', verdict: 'best', reason: 'Small hooks are easy to test in isolation; large feature hooks are easy to use in components.' },
        { name: 'Put all logic in one large custom hook per feature', verdict: 'ok', reason: 'Works but the hook becomes hard to unit test.' },
        { name: 'Avoid custom hooks and put logic in components directly', verdict: 'weak', reason: 'Logic duplication across components; hard to test.' }
      ],
      recommendation: 'Think in layers: primitive hooks (useState, useEffect) → utility hooks (useDebounce, useLocalStorage) → domain hooks (useUserProfile, useCart) → component hooks (useCheckoutPage).'
    },
    commonMistakes: [
      'Building a "god hook" that manages all state for a whole feature — untestable and hard to maintain.',
      'Not typing the return value of composed hooks — consumers lose IDE hints.',
      'Forgetting that each hook in the chain still needs proper deps.'
    ],
    seniorNotes: 'The hook composition model is one of React\'s strongest design decisions — it allows sharing stateful logic without HOC wrapper hell or render prop depth. The tradeoff: hooks are harder to use outside React (testing requires `renderHook`); class-based services in Angular can be instantiated anywhere.',
    interviewQuestions: [
      'Can a custom hook call other custom hooks?',
      'What is the advantage of composing hooks vs putting all logic in one large hook?',
      'How would you structure a hook that depends on two other hooks?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Hook composition layers',
        code: `// Layer 1: Primitive
function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [state, dispatch] = useReducer(asyncReducer, { status: 'idle' });
  const run = useCallback(() => {
    dispatch({ type: 'LOADING' });
    fn().then(data => dispatch({ type: 'SUCCESS', data }))
        .catch(err => dispatch({ type: 'ERROR', error: err.message }));
  }, deps);
  return { ...state, run };
}

// Layer 2: Domain
function useUser(userId: number) {
  const { status, data, error, run } = useAsync(
    () => fetch(\`/api/users/\${userId}\`).then(r => r.json()),
    [userId]
  );
  useEffect(() => { run(); }, [run]);
  return { user: data, loading: status === 'loading', error };
}

// Layer 3: Feature — uses domain hooks
function useProfilePage(userId: number) {
  const { user, loading } = useUser(userId);
  const [editing, setEditing] = useBoolean(false);
  const { toast } = useToast();
  return { user, loading, editing, startEdit: setEditing.setTrue, toast };
}`
      }
    ]
  },

  /* â”€â”€ PHASE 3: React Architecture & Patterns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'context-api', phase: 3, phaseName: 'React Architecture',
    orderIndex: 38, estimatedMins: 25, prerequisites: ['useContext', 'useReducer'],
    title: 'Context API — Patterns & Performance',
    eli5: 'Context lets you share data across many components without passing it through every level. But if you\'re not careful, changing the data makes EVERYTHING using context re-render — even parts that don\'t need to change.',
    analogy: 'Context without optimization is a school PA system — one announcement wakes up every classroom. Context with split providers is individual classroom phones — only relevant classrooms are called.',
    explanation: 'Context is best for low-frequency-update data (theme, locale, user). Patterns to control re-renders: split context by update frequency, memoize context values with `useMemo`, use separate contexts for state and dispatch (the dispatch context never changes). For high-frequency data, use Zustand instead.',
    technicalDeep: 'Context re-render propagation: when Provider value changes, all consumers re-render regardless of which part of the value they use. Patterns to mitigate: (1) Split value and setter into separate contexts — `ThemeContext` (value) + `ThemeDispatchContext` (dispatch never changes). Setters from useState are stable between renders; dispatch from useReducer is always stable. (2) `useMemo` on the value object: `const value = useMemo(() => ({ theme, toggle }), [theme])`. (3) Context selector (use-context-selector library): `const theme = useContextSelector(ThemeCtx, ctx => ctx.theme)` — only re-renders when the selected slice changes. This pattern is what Zustand implements natively.',
    whatBreaks: 'Deeply nested context that changes on every keystroke (e.g., form context) re-renders the entire subtree consuming it. Multiple context providers with the same value object pattern at scale.',
    efficientWay: {
      title: 'Context patterns',
      approaches: [
        { name: 'Split value and dispatch into separate contexts', verdict: 'best', reason: 'Components that only dispatch never re-render when the value changes.' },
        { name: 'Use Zustand for state that changes more than once per second', verdict: 'best', reason: 'Zustand subscriptions only re-render components that use the changed slice.' },
        { name: 'One big application context', verdict: 'weak', reason: 'Every consumer re-renders on every state change — app gets sluggish quickly.' }
      ],
      recommendation: 'Rule: auth/theme/locale in Context (change rarely). Search state/filter state/counters in Zustand (change often). Never put rapidly-changing state in Context.'
    },
    commonMistakes: [
      'Single context with many state values — a theme change re-renders auth consumers.',
      'Inline object `value={{ user, logout }}` in Provider — new object every parent render.',
      'Not defaulting context to null and doing null checks in the custom hook — leads to misleading "no value" errors.'
    ],
    seniorNotes: 'The "value and dispatch" pattern (two contexts, one for data, one for the setter) is used in the React docs themselves. It ensures button components that only dispatch events never re-render when data updates — a meaningful performance win for complex forms.',
    interviewQuestions: [
      'Why does putting an object literal as context value cause performance issues?',
      'What is the "split value and dispatch" context pattern?',
      'When should you choose Zustand over Context?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Split value/dispatch pattern',
        code: `type Theme = 'light' | 'dark';
const ThemeCtx    = createContext<Theme>('dark');
const SetThemeCtx = createContext<React.Dispatch<React.SetStateAction<Theme>>>(() => {});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  return (
    <ThemeCtx.Provider value={theme}>
      <SetThemeCtx.Provider value={setTheme}>
        {children}
      </SetThemeCtx.Provider>
    </ThemeCtx.Provider>
  );
}

// Only re-renders when theme changes
function ThemedDiv({ children }: { children: React.ReactNode }) {
  const theme = useContext(ThemeCtx);
  return <div data-theme={theme}>{children}</div>;
}

// NEVER re-renders (setTheme reference is stable)
function ThemeToggle() {
  const setTheme = useContext(SetThemeCtx);
  return <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>Toggle</button>;
}`
      }
    ]
  },

  {
    id: 'react-router', phase: 3, phaseName: 'React Architecture',
    orderIndex: 39, estimatedMins: 30, prerequisites: ['functional-components'],
    title: 'React Router v6',
    eli5: 'React Router makes a single-page app behave like a multi-page website. When you click a link, only the JavaScript changes (no full page reload), but the URL updates and the browser back button still works.',
    analogy: 'React Router is a TV remote. Clicking a button doesn\'t change the TV (the page doesn\'t reload), but it changes the channel (the URL and what\'s displayed). The channel history lets you go back.',
    explanation: 'React Router v6 uses `<BrowserRouter>`, `<Routes>`, and `<Route>` to map URLs to components. `<Link>` replaces `<a>` for SPA navigation. `useParams()`, `useNavigate()`, `useSearchParams()`, and `useLocation()` are the key hooks.',
    technicalDeep: 'BrowserRouter uses the History API (pushState) for URL changes without reloads. Route nesting: `<Route path="/user/:id" element={<User />}>` can have child routes rendered via `<Outlet />` in the parent. Protected routes: wrap with a component that checks auth and redirects if unauthenticated. Lazy loading: `<Route lazy={async () => ({ Component: (await import("./Page")).default })} />`. URL parameters: `useParams<{ id: string }>()`. Query strings: `useSearchParams()` — returns a URLSearchParams object. Programmatic navigation: `const navigate = useNavigate(); navigate(\'/home\', { replace: true })`. `<NavLink>` auto-adds `active` class when the current URL matches. Data router (v6.4+): `createBrowserRouter` + `loader` functions enable data loading before navigation — similar to Next.js but in CSR.',
    whatBreaks: 'Using `<a href="/page">` instead of `<Link to="/page">` triggers a full page reload — all React state is lost. Not wrapping the app in `<BrowserRouter>` causes "useNavigate must be used within a Router" error. 404 on direct URL access: the server must serve `index.html` for all routes (SPA fallback), otherwise a page refresh on `/user/5` returns a 404.',
    efficientWay: {
      title: 'Using React Router',
      approaches: [
        { name: 'v6 nested routes with Outlet for layout', verdict: 'best', reason: 'Nested routes enable shared layouts (nav + sidebar) without prop drilling the layout components.' },
        { name: 'Flat route list with manual layout in every page', verdict: 'ok', reason: 'Works but repeats layout code — hard to maintain.' },
        { name: 'Implement routing manually with state', verdict: 'weak', reason: 'The browser back button won\'t work. Never do this.' }
      ],
      recommendation: 'Learn nested routes and `<Outlet>` — they model the "layout with changing content" pattern that every real app needs. Add route-level code splitting from day one.'
    },
    commonMistakes: [
      '`<a href>` instead of `<Link to>` — full page reload on every navigation.',
      'Not setting up a SPA fallback on the server — direct URL access returns 404.',
      'Putting `useNavigate()` call inside non-component functions — must be called inside a component.'
    ],
    seniorNotes: 'React Router v6.4\'s data router (`createBrowserRouter`) introduced `loader`, `action`, and `errorElement` — enabling data fetching and mutations at the route level with proper pending/error states. This is the evolution toward Next.js-style data handling in CSR apps.',
    interviewQuestions: [
      'What is the difference between <Link> and <a href>?',
      'How do you implement a protected route in React Router?',
      'What is an <Outlet> in React Router v6?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'React Router v6: nested routes and protected route',
        code: `import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';

// Layout component — renders nav + child route content
function AppLayout() {
  return (
    <div>
      <nav><Link to="/dashboard">Dashboard</Link> | <Link to="/settings">Settings</Link></nav>
      <main><Outlet /></main> {/* child route renders here */}
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="user/:id"  element={<UserProfile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*"     element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`
      }
    ]
  },

  {
    id: 'tanstack-router',
    phase: 3, phaseName: 'React Architecture',
    orderIndex: 39.5, estimatedMins: 20, prerequisites: ['react-router', 'ts-types-interfaces'],
    title: 'TanStack Router — Type-Safe Routing',
    eli5: 'TanStack Router is like React Router but with a GPS that knows your exact destination type — if you try to navigate to a route with the wrong URL params, TypeScript catches it before you even start driving.',
    analogy: 'React Router is a map where you write any destination by hand (and might misspell). TanStack Router is a GPS with verified destinations — if the route or params are wrong, it refuses to navigate and tells you at compile time, not at runtime.',
    explanation: 'TanStack Router is a fully type-safe client-side router for React. Unlike React Router, it types your route params, search params, and loaders end-to-end — a typo in a route name is a TypeScript error, not a runtime 404. Uses file-based route generation (like Next.js) or code-based config. Growing fast in Vite-first projects.',
    technicalDeep: 'File-based routing: `routes/users/$userId.tsx` creates `/users/:userId` with `userId` typed as string. Code-based: `createRoute({ path: "/users/$userId", validateSearch: z.object({ tab: z.string() }) })`. `useParams()` returns `{ userId: string }` — fully inferred. `useSearch()` returns validated search params (Zod schema). Loaders: `loader: ({ params }) => fetchUser(params.userId)` — runs before the component renders, result available via `Route.useLoaderData()`. Router devtools: `<TanStackRouterDevtools />`. Route tree generated by CLI: `tsr generate` — creates `routeTree.gen.ts` which provides all type information. Link: `<Link to="/users/$userId" params={{ userId: "123" }}>` — TypeScript error if the route or params don\'t match. Key difference from React Router v6.4 loaders: TanStack loaders are end-to-end typed including the return data; React Router\'s are not. Search param validation: define a Zod schema per route — invalid search params throw a typed error.',
    whatBreaks: 'Forgetting to commit `routeTree.gen.ts` — teammates can\'t build. Not running the route generator after adding new route files — types are stale. Mixing TanStack Router and React Router in the same app.',
    efficientWay: {
      title: 'When to use TanStack Router vs React Router vs Next.js',
      approaches: [
        { name: 'TanStack Router for Vite + TypeScript SPAs', verdict: 'best', reason: 'End-to-end type safety eliminates an entire class of runtime routing bugs in large apps.' },
        { name: 'React Router for existing projects or smaller apps', verdict: 'best', reason: 'Larger ecosystem, more tutorials, no codegen step required.' },
        { name: 'Next.js App Router for SSR/SSG needs', verdict: 'best', reason: 'File-based routing + SSR + streaming — the production choice for content or SEO-heavy apps.' }
      ],
      recommendation: 'New Vite project with TypeScript: use TanStack Router. The type safety pays significant dividends in apps with 20+ routes. For learning: React Router is fine. For production Next.js apps: App Router is already file-based and type-safe.'
    },
    commonMistakes: [
      'Using string literals in `router.navigate()` instead of typed route objects — loses all type safety.',
      'Not running `tsr generate` after adding new route files — types become stale.',
      'Choosing TanStack Router then not using its type-safe APIs — you gain nothing if you use string paths.'
    ],
    seniorNotes: 'TanStack Router solves the biggest pain point in large SPAs: discovering routing bugs at runtime. When a teammate renames a route, every `<Link>` and `navigate()` call to that route becomes a TypeScript error instantly — before anyone runs the app. In large teams with many routes, this is a major DX improvement. The concept (type-safe file-based routing) is also what Next.js App Router provides at the framework level.',
    interviewQuestions: [
      'What is the main advantage of TanStack Router over React Router?',
      'How does TanStack Router achieve type-safe route params?',
      'What is a loader in TanStack Router and when does it run?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'TanStack Router: typed params and loaders',
        code: `// routes/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/users/$userId')({
  loader: ({ params }) => fetchUser(params.userId),  // params.userId: string (typed)
  component: UserPage,
});

function UserPage() {
  const { userId } = Route.useParams();       // { userId: string }
  const user       = Route.useLoaderData();   // typed to fetchUser return type

  return <h1>{user.name}</h1>;
}

// In another component — TypeScript error if route/params don't match
import { Link } from '@tanstack/react-router';
<Link to="/users/$userId" params={{ userId: '123' }}>
  View User
</Link>` }
    ]
  },

  {
    id: 'error-boundaries', phase: 3, phaseName: 'React Architecture',
    orderIndex: 40, estimatedMins: 15, prerequisites: ['functional-components'],
    title: 'Error Boundaries',
    eli5: 'An error boundary is like a circuit breaker. If a component crashes, instead of the whole app going dark, only that section breaks and you show a friendly "something went wrong" message.',
    analogy: 'Error boundaries are like fire doors in a building. A fire in one room (component crash) is contained there. The rest of the building (app) keeps running normally.',
    explanation: 'Error boundaries catch JavaScript errors in the component tree below them during rendering. They must be class components (no hook equivalent for catching render errors). Use the `react-error-boundary` library for a function-friendly wrapper. Errors in event handlers are NOT caught (use try/catch there).',
    technicalDeep: 'Implementation: `class ErrorBoundary extends Component { static getDerivedStateFromError(err) { return { hasError: true }; } componentDidCatch(err, info) { logErrorToService(err, info); } render() { return this.state.hasError ? <FallbackUI /> : this.props.children; } }`. react-error-boundary library: `<ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>` — provides `useErrorBoundary()` hook for imperative error reporting and `resetKeys` for auto-reset when key changes. Error boundaries do NOT catch: event handler errors (try/catch), async errors (they happen outside render), SSR errors, errors in the boundary itself. For async errors in React Query: the library bridges the gap by throwing in render when the query fails.',
    whatBreaks: 'Not wrapping async errors thrown in effects with a manual `setState({ hasError: true, error })` — the error boundary won\'t catch them. Errors in the `FallbackComponent` itself propagate to the nearest outer boundary.',
    efficientWay: {
      title: 'Using error boundaries',
      approaches: [
        { name: 'Install react-error-boundary library and use it everywhere', verdict: 'best', reason: 'Handles the class component requirement for you and provides reset capabilities.' },
        { name: 'One top-level error boundary for the whole app', verdict: 'ok', reason: 'Catches everything but shows the same fallback for all errors — not user-friendly.' },
        { name: 'Multiple boundaries at route and feature levels', verdict: 'best', reason: 'Route-level boundary shows the route fallback; feature-level boundary keeps the nav functional.' }
      ],
      recommendation: 'Place error boundaries at: (1) the app root (last resort), (2) each route, (3) around expensive data-loading components. Use `resetKeys={[userId]}` to auto-reset when the relevant data changes.'
    },
    commonMistakes: [
      'Expecting error boundaries to catch async errors in effects — they don\'t; handle those in try/catch.',
      'One giant error boundary at the root — shows an empty screen for any minor error.',
      'Not logging errors in `componentDidCatch` — you need to know about production crashes.'
    ],
    seniorNotes: 'Error boundaries + `Suspense` is the React data model for "loading and error states at the component level" rather than the traditional `if (loading) / if (error)` pattern. React Query\'s `throwOnError` option bridges the gap for the async case.',
    interviewQuestions: [
      'What errors do React error boundaries NOT catch?',
      'Why must error boundaries be class components?',
      'What is the difference between an error in render vs an error in an event handler?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Error boundary with react-error-boundary',
        code: `import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert" style={{ padding: 20, border: '1px solid red' }}>
      <h2>Something went wrong</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState(1);
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(err, info) => console.error(err, info)} // log to Sentry etc
      resetKeys={[userId]} // auto-reset when userId changes
    >
      <UserProfile userId={userId} />
    </ErrorBoundary>
  );
}`
      }
    ]
  },

  {
    id: 'suspense-lazy', phase: 3, phaseName: 'React Architecture',
    orderIndex: 41, estimatedMins: 20, prerequisites: ['es-modules'],
    title: 'Suspense & Code Splitting',
    eli5: 'Suspense says "if the component below me is waiting for something (loading code or data), show this fallback instead." Code splitting splits your app into chunks that only download when needed — making the initial load faster.',
    analogy: 'Code splitting is a library that only delivers the chapters you\'ve asked for. Suspense is the reading lamp that stays on while you wait for the courier.',
    explanation: '`React.lazy(() => import("./Component"))` creates a lazy component that loads its code chunk on first render. Wrap with `<Suspense fallback={<Spinner />}>`. Without Suspense, lazy components throw a Promise — Suspense catches it and shows the fallback until the Promise resolves.',
    technicalDeep: 'Under the hood: `React.lazy()` returns a component that throws a Promise on first render. Suspense catches the Promise, shows the fallback, and re-renders the lazy component when the Promise resolves (code chunk downloaded). Route-level code splitting is the most impactful: each route\'s component in a separate chunk. In React 18+, Suspense works with data too — libraries like React Query and Relay can throw Promises for pending data (experimental). Nested Suspense boundaries: inner boundary catches specific loading, outer boundary is the last resort. `<Suspense>` in server rendering (SSR): Next.js uses Suspense for streaming HTML — Server Components stream data, Suspense marks the boundary where HTML streaming happens.',
    whatBreaks: 'Lazy components with named exports: `React.lazy(() => import("./Comp").then(m => ({ default: m.NamedExport })))` — lazy only supports default exports directly. Using `React.lazy` outside of `<Suspense>` causes an uncaught Promise.',
    efficientWay: {
      title: 'Code splitting strategy',
      approaches: [
        { name: 'Route-level splitting first (biggest impact)', verdict: 'best', reason: 'Each route in its own chunk cuts initial bundle by 50-80% for large apps.' },
        { name: 'Component-level splitting for heavy single components (charts, editors)', verdict: 'best', reason: 'A text editor or chart library can be 500KB — only load when that feature is used.' },
        { name: 'Split every component into its own chunk', verdict: 'weak', reason: 'Too many small chunks; network waterfall of fetches during navigation.' }
      ],
      recommendation: 'Start with route-level lazy loading. Then identify heavy components (>50KB) and lazy-load them. For Next.js, use `next/dynamic` — it wraps `React.lazy` with SSR support.'
    },
    commonMistakes: [
      'Using `React.lazy` with named exports — only default exports are supported without a wrapper.',
      'Not wrapping lazy components in Suspense — causes uncaught error.',
      'Lazy-loading every tiny component — creates a waterfall of network requests.'
    ],
    seniorNotes: 'Bundle analysis (`npm run build -- --analyze` with vite-bundle-analyzer plugin) reveals what\'s in each chunk. If a library appears in many chunks, it\'s in the shared chunk — good. If a 500KB library appears in only one chunk, lazy-loading that route is worth it.',
    interviewQuestions: [
      'How does React.lazy work under the hood?',
      'What is route-level code splitting and why is it valuable?',
      'Can you use React.lazy with a named export?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Route-level code splitting',
        code: `import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Each route is a separate chunk — only downloaded when the user visits
const Home      = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings  = lazy(() => import('./pages/Settings'));

// Named export wrapper
const Chart = lazy(() =>
  import('./components/HeavyChart').then(m => ({ default: m.HeavyChart }))
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="page-loader">Loading...</div>}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings"  element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}`
      }
    ]
  },

  {
    id: 'data-fetching-patterns', phase: 3, phaseName: 'React Architecture',
    orderIndex: 42, estimatedMins: 20, prerequisites: ['useEffect', 'async-await'],
    title: 'Data Fetching Patterns',
    eli5: 'There are several ways to load data in React. The simplest is fetching in useEffect. The smarter way is using a library like TanStack Query that handles caching, re-fetching, loading states, and errors automatically.',
    analogy: 'Manual useEffect fetching is driving to the store every time you need milk. TanStack Query is a smart fridge that auto-orders milk when you\'re low, caches what you have, and only refills when it\'s actually stale.',
    explanation: 'Patterns in order of sophistication: (1) useEffect + fetch (manual, covered already). (2) TanStack Query (`useQuery`, `useMutation`) — caching, deduplication, background refetch. (3) SWR (similar to React Query, made by Vercel). (4) Next.js Server Components — fetch on the server, stream to client.',
    technicalDeep: 'TanStack Query concepts: `queryKey` — unique key per query, used for caching and invalidation. `staleTime` — how long data is considered fresh (no refetch). `gcTime` (formerly cacheTime) — how long unused data stays in cache. `useQuery` returns `{ data, isLoading, isError, error, refetch }`. `useMutation` returns `{ mutate, isPending, isError }`. Cache invalidation: `queryClient.invalidateQueries({ queryKey: [\'users\'] })` triggers refetch of all matching queries. Optimistic updates: `useMutation` `onMutate` callback. Infinite queries: `useInfiniteQuery` for paginated lists. DevTools: `@tanstack/react-query-devtools` shows all queries, their state, and data.',
    whatBreaks: 'Fetching in the render body instead of useEffect (or React Query) causes infinite loops. Forgetting to provide a `QueryClient` via `QueryClientProvider` at the app root causes every `useQuery` call to fail.',
    efficientWay: {
      title: 'Choosing a data fetching approach',
      approaches: [
        { name: 'TanStack Query for all server state', verdict: 'best', reason: 'Handles every edge case (caching, refetch, error retry, optimistic updates) out of the box.' },
        { name: 'useEffect + fetch for learning', verdict: 'ok', reason: 'Learn this first to understand the problem TanStack Query solves.' },
        { name: 'SWR (Vercel\'s library)', verdict: 'ok', reason: 'Similar to React Query, slightly simpler API, less configurable.' }
      ],
      recommendation: 'Learn raw useEffect fetching for one week. Then switch to TanStack Query for all projects. The difference in reliability and developer experience is significant.'
    },
    commonMistakes: [
      'Fetching in the render body — infinite loop.',
      'Not providing `QueryClientProvider` at the app root.',
      'Using `isLoading` for mutations — use `isPending` instead (renamed in TanStack Query v5).'
    ],
    seniorNotes: 'The separation of "server state" (data from APIs — use React Query) and "client state" (UI state like modal open/closed — use useState/Zustand) is a key architectural insight. Zustand + React Query handle all state without Redux in 90% of apps.',
    interviewQuestions: [
      'What is staleTime in TanStack Query?',
      'How do you invalidate and refetch a query after a mutation?',
      'What is the difference between isLoading and isFetching in TanStack Query?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'TanStack Query: useQuery and useMutation',
        code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn:  () => fetch('/api/users').then(r => r.json()),
    staleTime: 5 * 60 * 1000, // data fresh for 5 min
  });
}

// Mutate
function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fetch(\`/api/users/\${id}\`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }), // refetch list
  });
}

function UserList() {
  const { data: users, isLoading, error } = useUsers();
  const { mutate: deleteUser, isPending } = useDeleteUser();

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return users.map(u => (
    <div key={u.id}>
      {u.name}
      <button onClick={() => deleteUser(u.id)} disabled={isPending}>Delete</button>
    </div>
  ));
}`
      }
    ]
  },

  {
    id: 'zustand', phase: 3, phaseName: 'React Architecture',
    orderIndex: 43, estimatedMins: 20, prerequisites: ['useContext'],
    title: 'Zustand — Client State Management',
    eli5: 'Zustand is a simple state management library. Think of it as a shared useState that works across components without passing props or wrapping everything in Context providers.',
    analogy: 'Zustand is a shared Google Doc. Any component can read it, any component can update it, and every reader sees the update instantly — without passing the doc through every door in between.',
    explanation: 'Zustand stores are created with `create()` and accessed via hooks. Components subscribe to specific slices — only re-render when that slice changes. No Provider needed. No boilerplate. Use for: UI state shared across many components (sidebar open, filters, cart).',
    technicalDeep: 'Zustand store: `const useStore = create<State>((set, get) => ({ count: 0, inc: () => set(s => ({ count: s.count + 1 })) }))`. `set()` merges shallow — no need to spread existing state (unlike useState with objects). `get()` reads current state inside actions. Slice pattern: split large stores into slices combined at `create()` time. Selector for performance: `const count = useStore(s => s.count)` — component only re-renders when `s.count` changes. Without selector: `useStore()` — re-renders on any store change. Middleware: `devtools()` wraps the store for Redux DevTools support. `persist()` persists to localStorage. `immer()` allows mutating syntax. Zustand vs Context: Context re-renders all consumers on any change; Zustand subscribers only re-render when their selected slice changes.',
    whatBreaks: 'Not using selectors: `const store = useStore()` re-renders the component on every store change. Storing server-fetched data in Zustand — use React Query (it handles caching). Circular actions that call each other via `get()`.',
    efficientWay: {
      title: 'Using Zustand',
      approaches: [
        { name: 'One store per domain area with selectors', verdict: 'best', reason: 'Small focused stores are easier to debug and don\'t cause cross-concern re-renders.' },
        { name: 'One global store for everything', verdict: 'ok', reason: 'Simple but any state change can cause re-renders in unrelated components without selectors.' },
        { name: 'Redux Toolkit instead', verdict: 'ok', reason: 'More boilerplate but better DevTools, middleware ecosystem, and team familiarity.' }
      ],
      recommendation: 'Zustand for client UI state. React Query for server state. This combination replaces Redux in most applications with less code and better performance.'
    },
    commonMistakes: [
      'Calling `useStore()` without a selector — subscribes to all changes.',
      'Storing API data in Zustand instead of React Query — misses caching, background refetch.',
      'Mutating state in actions without `set()` — Zustand won\'t detect the change.'
    ],
    seniorNotes: 'Zustand\'s devtools middleware integrates with Redux DevTools extension — you get time-travel debugging without Redux\'s overhead. For teams migrating from Redux, this is often the compelling argument.',
    interviewQuestions: [
      'How does Zustand avoid re-rendering components that don\'t need to update?',
      'What is a selector in Zustand?',
      'When would you use Zustand vs React Context?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Zustand store with slices and selectors',
        code: `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  total: () => number;
}

const useCartStore = create<CartState>()(
  devtools(persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set(s => ({ items: [...s.items, item] })),
      removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: 'cart-storage' } // persists to localStorage
  ))
);

// Selector — only re-renders when items.length changes
function CartBadge() {
  const count = useCartStore(s => s.items.length);
  return <span>{count}</span>;
}

// Selector for action only — NEVER re-renders (function ref is stable)
function AddToCartButton({ item }: { item: CartItem }) {
  const addItem = useCartStore(s => s.addItem);
  return <button onClick={() => addItem(item)}>Add to Cart</button>;
}`
      }
    ]
  },

  {
    id: 'performance-patterns', phase: 3, phaseName: 'React Architecture',
    orderIndex: 44, estimatedMins: 20, prerequisites: ['react-memo', 'useMemo', 'useCallback'],
    title: 'React Performance Patterns',
    eli5: 'Making React fast means: don\'t re-render things that didn\'t change, don\'t do heavy work every render, and don\'t put everything in one giant component. Measure first, then optimize.',
    analogy: 'Performance optimization is like a restaurant kitchen. You don\'t restock the whole pantry every time a customer orders one thing. You batch orders, cache popular items at the counter, and delegate specific tasks.',
    explanation: 'The optimization hierarchy: (1) Find the problem with the Profiler. (2) Move expensive renders down the tree (colocation). (3) Virtualize long lists. (4) Lazy-load heavy components. (5) Memoize with React.memo + useCallback + useMemo. (6) `useTransition` for non-urgent updates. In this order — earlier steps give the most value.',
    technicalDeep: 'Colocation: state should live as close to where it\'s used as possible. If a heavy component tree doesn\'t need a piece of state, don\'t put the state above it — moving state down avoids re-rendering the expensive subtree. Virtualization: `@tanstack/react-virtual` renders only visible items in a list — O(viewport_size) DOM nodes instead of O(list_size). Core Web Vitals: LCP (Largest Contentful Paint) — time to render biggest visible element. FID/INP (Interaction to Next Paint) — time from user input to response. CLS (Cumulative Layout Shift) — layout stability. React DevTools Profiler flame chart shows which components render and how long. Chrome Performance tab shows the actual CPU cost.',
    whatBreaks: 'Premature memoization adds overhead without benefit for fast components. Over-splitting components reduces cohesion and adds reconciliation overhead for many tiny components.',
    efficientWay: {
      title: 'Performance optimization',
      approaches: [
        { name: 'Profile with React DevTools before optimizing', verdict: 'best', reason: 'Optimizing the wrong thing wastes time. The profiler shows exactly what\'s expensive.' },
        { name: 'Virtualize long lists first (>100 items)', verdict: 'best', reason: 'Biggest single performance win in most apps — drops DOM nodes from thousands to tens.' },
        { name: 'Memoize everything proactively', verdict: 'weak', reason: 'React Compiler will do this automatically. Manual memoization everywhere adds bugs and maintenance cost.' }
      ],
      recommendation: 'Performance checklist: (1) Profile. (2) Colocate state. (3) Virtualize lists. (4) Code-split routes and heavy components. (5) Memoize ONLY what the profiler confirms is re-rendering unnecessarily.'
    },
    commonMistakes: [
      'Optimizing before profiling — fixing the wrong bottleneck.',
      'Rendering 1000+ items in a list without virtualization.',
      'Putting global state above expensive components that don\'t need it — re-renders on every state change.'
    ],
    seniorNotes: 'The 90/10 rule applies to React performance: 90% of performance gains come from virtualization and code splitting, not from memoization. Invest in the former first. Track Core Web Vitals in production with tools like Vercel Analytics or web-vitals npm package.',
    interviewQuestions: [
      'What is list virtualization and when should you use it?',
      'What is the React Profiler and how do you use it to find performance issues?',
      'What is the correct order of steps for optimizing a slow React component?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Virtualized list with TanStack Virtual',
        code: `import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,  // estimated row height in px
  });

  return (
    <div ref={parentRef} style={{ height: 500, overflow: 'auto' }}>
      {/* Total height — keeps scrollbar accurate */}
      <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={items[virtualRow.index].id}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              height: virtualRow.size,
              width: '100%',
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
// Renders ~15 DOM nodes regardless of whether items has 100 or 100,000 elements`
      }
    ]
  },

  {
    id: 'compound-components', phase: 3, phaseName: 'React Architecture',
    orderIndex: 45, estimatedMins: 20, prerequisites: ['context-api', 'component-composition'],
    title: 'Compound Components & Render Props',
    eli5: 'Compound components are a family of components that share hidden state. Think of `<select>` and `<option>` — they work together but look separate. Render props let a component share its data with whatever you want to render.',
    analogy: 'Compound components are like a burger restaurant: the `<Burger>` knows what you ordered; `<Burger.Bun>`, `<Burger.Patty>`, `<Burger.Toppings>` each render their part. You control the layout; the Burger manages the order details.',
    explanation: 'Compound components use Context to share state between parent and children components invisibly. The parent provides state; children consume it. Render props pass the component\'s internals to a function prop: `<List renderItem={(item) => <Row data={item} />}` — the consumer controls rendering.',
    technicalDeep: 'Compound pattern: create a context inside the parent; child components use `useContext` to access shared state without explicit prop passing. This is how `<Select>/<Option>`, `<Tabs>/<Tab>`, `<Accordion>/<AccordionItem>` work. Attach children as static properties: `Tabs.Tab = Tab; Tabs.Panel = Panel;` for import ergonomics. Render props: `children` as a function `(data: T) => ReactNode` — maximally flexible, caller controls rendering completely. Inversion of control pattern: the library gives you the data, you decide how to render it. Both patterns are used by Radix UI (compound) and Headless UI (compound + render props).',
    whatBreaks: 'Compound children used outside their parent — the context won\'t exist and `useContext` returns the default. Check with `if (!ctx) throw new Error(...)` in the custom hook.',
    efficientWay: {
      title: 'Advanced composition',
      approaches: [
        { name: 'Build a compound Tabs component to learn the pattern', verdict: 'best', reason: 'Tabs are simple enough to implement but complex enough to need compound components — perfect teaching example.' },
        { name: 'Use Radix UI/Headless UI and read their source', verdict: 'best', reason: 'Production-quality implementations of compound patterns — reading them is the best education.' },
        { name: 'Use a single component with many props instead', verdict: 'ok', reason: 'Simpler to start; becomes unwieldy for complex interactive components.' }
      ],
      recommendation: 'For your own component library, use compound components for interactive UI pieces (tabs, accordions, dropdowns, dialogs). For business logic, use Radix UI primitives rather than building from scratch.'
    },
    commonMistakes: [
      'Using compound children outside their parent without a helpful error message.',
      'Passing props between compound components via DOM attributes instead of context.',
      'Overcomplicating simple components with compound patterns — use regular props for 1-2 options.'
    ],
    seniorNotes: 'Radix UI\'s entire API is compound components with render slots — understanding the pattern lets you use and extend Radix primitives confidently. The `asChild` prop (Radix-specific) is a polymorphic pattern where the component renders as its child instead of a wrapper div.',
    interviewQuestions: [
      'What is the compound components pattern?',
      'How do compound components share state without explicit prop passing?',
      'What is a render prop and when would you use it?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Compound Tabs component',
        code: `const TabsCtx = createContext<{ active: string; setActive: (id: string) => void } | null>(null);
function useTabs() {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error('Tab must be inside Tabs');
  return ctx;
}

function Tabs({ defaultTab, children }: { defaultTab: string; children: React.ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button onClick={() => setActive(id)} aria-selected={active === id}
      style={{ fontWeight: active === id ? 700 : 400 }}>
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const { active } = useTabs();
  return active === id ? <div>{children}</div> : null;
}

Tabs.Tab   = Tab;
Tabs.Panel = TabPanel;

// Usage
<Tabs defaultTab="home">
  <Tabs.Tab id="home">Home</Tabs.Tab>
  <Tabs.Tab id="about">About</Tabs.Tab>
  <Tabs.Panel id="home"><HomeContent /></Tabs.Panel>
  <Tabs.Panel id="about"><AboutContent /></Tabs.Panel>
</Tabs>`
      }
    ]
  },

  {
    id: 'render-props-hoc',
    phase: 3, phaseName: 'React Architecture',
    orderIndex: 45.5, estimatedMins: 15, prerequisites: ['custom-hooks', 'component-composition', 'compound-components'],
    title: 'Render Props & Higher-Order Components',
    eli5: 'Before hooks, React had two patterns for sharing logic: HOCs (wrap a component to inject superpowers) and Render Props (a component that calls a function to decide what to render). You\'ll see both in old code and some libraries still use them.',
    analogy: 'HOC is a superhero cape factory — you take any hero (component) and wrap them to add a cape (logic). Render Props is a cafeteria that asks "how do you want your data served?" — you hand them a function, they call it with the ingredients.',
    explanation: 'Before custom hooks (React 16.8, 2019), HOCs and Render Props were the main patterns for reusing stateful logic across components. You\'ll encounter them in legacy codebases and some popular libraries (old React Router `withRouter`, Redux `connect`, class-based component libraries). Custom hooks replaced most new uses, but reading and understanding these patterns is essential.',
    technicalDeep: 'HOC: `const withAuth = (Wrapped) => (props) => isAuth ? <Wrapped {...props} /> : <Redirect to="/login" />`. Naming convention: `with*`. HOC pitfalls: loses `displayName` in DevTools (fix: `WrappedComponent.displayName = "withAuth(Component)"`), doesn\'t forward refs automatically (fix: `React.forwardRef`), prop collision if HOC and component use the same prop name. Always spread props: `<Wrapped {...props} injectedProp={x} />`. Render Props: `<DataFetcher url="/api/users" render={(data) => <UserList users={data} />} />` — or via `children` prop: `<Mouse>{({ x, y }) => <Tracker x={x} y={y} />}</Mouse>`. Modern libraries using HOCs: react-redux `connect()` (replaced by `useSelector`/`useDispatch`), `styled-components` `withTheme` (replaced by `useTheme()`). Custom hook equivalent is always simpler: `const { x, y } = useMouse()`. The evolution: HOC → Render Props → Custom Hook all solve the same problem — sharing stateful logic — with progressively simpler syntax.',
    whatBreaks: 'Creating HOCs inside a render function — a new component is created on every render, breaking React\'s reconciliation and unmounting/remounting on every render. Forgetting to spread original props in HOC — parent-passed props are silently lost.',
    efficientWay: {
      title: 'When to use these patterns',
      approaches: [
        { name: 'Custom hooks for all new code', verdict: 'best', reason: 'Simpler, composable, no extra wrapper layers in DevTools.' },
        { name: 'Read HOC/Render Props to understand existing code', verdict: 'best', reason: 'You will encounter these in real codebases and technical interviews.' },
        { name: 'Write new HOCs', verdict: 'weak', reason: 'Only if integrating with a library that requires the HOC pattern (class component APIs).' }
      ],
      recommendation: 'Understand both patterns well enough to read and refactor legacy code. Write custom hooks for all new logic sharing. The mental model — "inject behavior into a component" — is still valid; only the syntax changed.'
    },
    commonMistakes: [
      'Creating HOCs inside render functions — creates a new component type on every render, breaks state and causes constant unmount/remount.',
      'Not forwarding refs through HOCs — breaks parent components that need a DOM ref.',
      'Reaching for Render Props when a custom hook is simpler and available.'
    ],
    seniorNotes: 'The progression HOC → Render Props → Custom Hooks all solve the same problem: sharing stateful logic without inheritance. Understanding this history explains *why* hooks exist and why `useSelector` replaced `connect()`. In senior interviews, explaining this evolution — including the specific problems each pattern solved and introduced — signals deep React understanding beyond just "hooks are better."',
    interviewQuestions: [
      'What problem do HOCs and Render Props solve, and why were they largely replaced by hooks?',
      'What are the main pitfalls of Higher-Order Components?',
      'How would you convert a Render Prop component to a custom hook?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'HOC → Render Prop → Custom Hook: the same logic across three eras',
        code: `// 1. HOC (2016-2019 era) — wraps the component
function withWindowSize<P extends { width: number; height: number }>(
  Wrapped: React.ComponentType<P>
) {
  return function WithSize(props: Omit<P, 'width' | 'height'>) {
    const [size, setSize] = useState({ width: innerWidth, height: innerHeight });
    useEffect(() => {
      const h = () => setSize({ width: innerWidth, height: innerHeight });
      addEventListener('resize', h);
      return () => removeEventListener('resize', h);
    }, []);
    return <Wrapped {...(props as P)} {...size} />;
  };
}
// const SizedComponent = withWindowSize(MyComponent);

// 2. Render Prop (2017-2019 era) — component calls your function
function WindowSize({ children }: { children: (s: { width: number; height: number }) => React.ReactNode }) {
  const [size, setSize] = useState({ width: innerWidth, height: innerHeight });
  // ... same effect
  return <>{children(size)}</>;
}
// <WindowSize>{({ width }) => <div>Width: {width}</div>}</WindowSize>

// 3. Custom Hook (2019+ — use this)
function useWindowSize() {
  const [size, setSize] = useState({ width: innerWidth, height: innerHeight });
  // ... same effect
  return size; // { width, height }
}
// const { width } = useWindowSize();` }
    ]
  },


  /* â”€â”€ PHASE 4: TypeScript with React â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'typing-props', phase: 4, phaseName: 'TypeScript with React',
    orderIndex: 46, estimatedMins: 20, prerequisites: ['ts-types-interfaces', 'functional-components'],
    title: 'Typing Props & Components',
    eli5: 'TypeScript lets you label exactly what each component expects. If you pass the wrong thing, the editor tells you before you even run the code.',
    analogy: 'Typed props are a labeled connector panel. Each port has a shape — you cannot plug the wrong cable in.',
    explanation: 'Type props with an interface; destructure in the function signature. Use union types for limited options, optional `?` for props with defaults, and `React.ReactNode` for children. Avoid `React.FC` — the simpler function form is now preferred.',
    technicalDeep: 'Discriminated union props: `type ButtonProps = { variant: "solid"; color: string } | { variant: "ghost" }` — TypeScript narrows inside if/switch. `ComponentProps<"button">` and `ComponentPropsWithoutRef<"input">` extend native HTML props. `HTMLAttributes<HTMLDivElement>` for div wrappers. `as` polymorphic prop: `function Box<T extends React.ElementType = "div">({ as: Comp = "div", ...props }: PolymorphicProps<T>)` — advanced pattern used by Radix. `React.ReactNode` = any renderable value. `React.ReactElement` = only JSX elements. `JSX.Element` = alias for `React.ReactElement<any>`.',
    whatBreaks: '`React.FC` implicitly allowed children in older React + TS versions — this caused confusing errors. Prefer explicit `children?: React.ReactNode` in the interface.',
    efficientWay: {
      title: 'Typing components',
      approaches: [
        { name: 'Interface first, component body second', verdict: 'best', reason: 'The interface is the public API — define it first, the implementation follows.' },
        { name: 'Inline type in the function signature', verdict: 'ok', reason: 'Fine for simple props, hard to reuse or extend.' },
        { name: 'Use React.FC everywhere', verdict: 'weak', reason: 'Adds implicit children (fixed in newer TS/React), harder to read generic components.' }
      ],
      recommendation: 'Define an interface for every component that has more than 2 props. Export it if other files need the type.'
    },
    commonMistakes: [
      '`React.FC` with generics — syntax is awkward; prefer plain function.',
      'Not exporting prop types when they\'re needed by parent components.',
      'Using `any` for event callbacks — `(e: React.MouseEvent<HTMLButtonElement>) => void` is specific.'
    ],
    seniorNotes: 'The `ComponentPropsWithRef`/`ComponentPropsWithoutRef` helpers let you build wrapper components that accept all native HTML attributes plus your custom ones — essential for design system primitives.',
    interviewQuestions: ['What is the difference between React.ReactNode and React.ReactElement?', 'How do you extend native HTML element props in a wrapper component?', 'Why is React.FC no longer recommended?'],
    codeExamples: [{ lang: 'tsx', label: 'Typed component patterns', code: `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost' | 'outline';
  loading?: boolean;
  children: React.ReactNode;
}

function Button({ variant = 'solid', loading = false, children, ...rest }: ButtonProps) {
  return (
    <button disabled={loading || rest.disabled} className={\`btn btn-\${variant}\`} {...rest}>
      {loading ? <Spinner /> : children}
    </button>
  );
}

// Usage — TypeScript catches wrong props
<Button variant="ghost" onClick={() => {}}>Save</Button>
<Button variant="invalid">X</Button> // âŒ TS error: not assignable to 'solid'|'ghost'|'outline'` }]
  },

  {
    id: 'typing-hooks', phase: 4, phaseName: 'TypeScript with React',
    orderIndex: 47, estimatedMins: 15, prerequisites: ['ts-generics', 'useState'],
    title: 'Typing Hooks',
    eli5: 'When you use TypeScript with React hooks, you tell the hook what TYPE of data it\'s storing. `useState<User | null>(null)` means "state is a User or null."',
    analogy: 'Typing a hook is labeling a box before you put anything in it: "this box holds User objects or nothing."',
    explanation: 'Most hooks infer types automatically, but when the initial value is `null` or `[]`, you must annotate explicitly. `useState<User | null>(null)`. `useRef<HTMLInputElement>(null)`. `useReducer<Reducer<State, Action>>(reducer, init)`.',
    technicalDeep: '`useState<T>` — TypeScript infers `T` from the initial value. `useState(0)` → `[number, ...]`. `useState(null)` → `[null, ...]` (wrong — add generic). `useRef<T>(null)` — generic needed for DOM nodes. `useCallback<(id: number) => void>(() => ..., [])` — explicit return type catches mistakes. `useReducer` signature: TypeScript infers state and action from the reducer function type — usually no explicit annotation needed. Custom hook return types: `as const` on a tuple return: `return [state, setState] as const` so TypeScript knows it\'s `[S, Dispatch<S>]` not `(S | Dispatch<S>)[]`.',
    whatBreaks: '`useState(null)` without a generic makes state permanently `null` type — TypeScript errors when you try to set a User. `useRef(null)` without a type creates `RefObject<unknown>` — no `.current.value` autocomplete.',
    efficientWay: {
      title: 'Typing hooks',
      approaches: [
        { name: 'Add generic only when inference fails', verdict: 'best', reason: 'TypeScript is smart — add generics where inference gives wrong or overly narrow types.' },
        { name: 'Always annotate all hooks explicitly', verdict: 'weak', reason: 'Redundant annotations add noise and maintenance burden.' },
        { name: 'Use as const for tuple returns from custom hooks', verdict: 'best', reason: 'Ensures callers get destructuring with correct types.' }
      ],
      recommendation: 'Learn which hooks need explicit generics by the TypeScript errors you encounter. The two most common: useState with null initial, useRef with DOM nodes.'
    },
    commonMistakes: ['`useState(null)` — state is permanently null type.', '`useRef(null)` without generic — no DOM type info.', 'Custom hooks returning tuples without `as const` — wrong inferred type.'],
    seniorNotes: 'For complex custom hooks, annotate the return type explicitly: `function useFetch<T>(url: string): { data: T | null; loading: boolean; error: string | null }`. This keeps consumers independent of the internal implementation.',
    interviewQuestions: ['When does useState need an explicit generic?', 'Why use `as const` on a custom hook\'s tuple return?', 'How do you type useRef for a DOM element?'],
    codeExamples: [{ lang: 'tsx', label: 'Typing common hooks', code: `// useState needs explicit generic when initial is null/[]
const [user, setUser]   = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);

// useRef — DOM node type
const inputRef = useRef<HTMLInputElement>(null);
// inputRef.current?.focus() — safe with optional chaining

// useReducer — inferred from reducer fn type
const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

// Custom hook — tuple with as const
function useToggle(init = false) {
  const [on, setOn] = useState(init);
  return [on, () => setOn(v => !v)] as const; // [boolean, () => void]
}
const [open, toggleOpen] = useToggle();` }]
  },

  {
    id: 'typing-events', phase: 4, phaseName: 'TypeScript with React',
    orderIndex: 48, estimatedMins: 15, prerequisites: ['ts-types-interfaces', 'event-handling'],
    title: 'Typing Events & Handlers',
    eli5: 'TypeScript knows the difference between a click on a button and a change on an input. When you type your event handlers, the editor tells you exactly what properties are available.',
    analogy: 'Event types are the specific forms for each situation: a click form has x/y coordinates, a change form has the new value, a submit form has the form data.',
    explanation: 'React provides specific event types: `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`, `React.MouseEvent<HTMLButtonElement>`, `React.KeyboardEvent<HTMLInputElement>`. Each gives access to the right properties on `e.target` and `e.currentTarget`.',
    technicalDeep: 'Event type hierarchy: `React.SyntheticEvent<T>` → `React.MouseEvent<T>`, `React.ChangeEvent<T>`, etc. `e.target` is typed as `EventTarget & T` — `e.target.value` works for `HTMLInputElement`. `e.currentTarget` is always typed as `T` (the element the handler is on). For checkboxes: `e.target.checked`. For selects: `e.target.value`. Handler type aliases: `type InputHandler = React.ChangeEventHandler<HTMLInputElement>` = `(e: React.ChangeEvent<HTMLInputElement>) => void`. `React.MouseEventHandler<HTMLButtonElement>` similarly. These are useful for prop types when you pass handlers down.',
    whatBreaks: '`e.target as HTMLInputElement` is sometimes necessary when the event listener is on a parent element — the target could be a child. `e.currentTarget` is always the element with the handler.',
    efficientWay: {
      title: 'Typing events',
      approaches: [
        { name: 'Use React.ChangeEventHandler<T> type alias for prop types', verdict: 'best', reason: 'Cleaner than writing the full event type every time.' },
        { name: 'Cast e.target as HTMLInputElement everywhere', verdict: 'weak', reason: 'Defeats the point — use the properly typed event type instead.' },
        { name: 'Use React.FormEvent for all form events', verdict: 'ok', reason: 'Works for submit; use ChangeEvent for individual field changes.' }
      ],
      recommendation: 'Memorize four: ChangeEvent for inputs, FormEvent for form submit, MouseEvent for clicks, KeyboardEvent for keyboard. Everything else follows the same pattern.'
    },
    commonMistakes: ['Using `React.MouseEvent` on an input `onChange` — should be `React.ChangeEvent<HTMLInputElement>`.', 'Accessing `e.target.value` on a checkbox — use `e.target.checked`.', 'Not typing `e.currentTarget` for keyboard events on non-input elements.'],
    seniorNotes: 'The distinction between `target` (element that triggered the event) and `currentTarget` (element the handler is attached to) is especially important for event delegation — when one parent handles events for many children.',
    interviewQuestions: ['What is the TypeScript type for an onChange handler on an input?', 'What is the difference between e.target and e.currentTarget?', 'How do you type a click handler prop on a component?'],
    codeExamples: [{ lang: 'tsx', label: 'Typed event handlers', code: `// Types for common handlers
type InputChange  = React.ChangeEvent<HTMLInputElement>;
type SelectChange = React.ChangeEvent<HTMLSelectElement>;
type FormSubmit   = React.FormEvent<HTMLFormElement>;
type BtnClick     = React.MouseEvent<HTMLButtonElement>;

interface SearchProps {
  onSearch: React.ChangeEventHandler<HTMLInputElement>; // type alias
  onSubmit: (query: string) => void;
}

function SearchBar({ onSearch, onSubmit }: SearchProps) {
  const [q, setQ] = useState('');

  function handleChange(e: InputChange) {
    setQ(e.target.value);
    onSearch(e);
  }

  function handleSubmit(e: FormSubmit) {
    e.preventDefault();
    onSubmit(q);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') e.currentTarget.blur();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={q} onChange={handleChange} onKeyDown={handleKey} />
    </form>
  );
}` }]
  },

  {
    id: 'typing-context', phase: 4, phaseName: 'TypeScript with React',
    orderIndex: 49, estimatedMins: 15, prerequisites: ['useContext', 'ts-types-interfaces'],
    title: 'Typing Context',
    eli5: 'When you use TypeScript with Context, you declare what the context will hold — so every component that reads it gets full autocomplete and type checking.',
    analogy: 'A typed context is a labeled power strip. Every outlet knows what voltage it provides; anything plugging in knows exactly what to expect.',
    explanation: 'Create context with a specific type: `const AuthCtx = createContext<AuthContextType | null>(null)`. Use a custom hook that throws if used outside the provider — this eliminates null checks everywhere.',
    technicalDeep: 'Two approaches: (1) `createContext<T | null>(null)` — consumers must handle null. Custom hook throws: `if (!ctx) throw new Error(...)` — removes null at every call site. (2) `createContext({} as T)` — no null, but consumers outside a Provider get an empty object (silent bugs). Approach 1 is safer. `ReturnType<typeof useAuthProvider>` for inferring context type from the provider function — avoids duplicating the type definition. When the context value has actions (functions), type them explicitly: `logout: () => Promise<void>` not `logout: Function`. For large contexts, split into data and actions contexts.',
    whatBreaks: '`createContext(undefined as unknown as AuthCtx)` — bypasses the null check with a lie to the compiler. Consumers outside a Provider get undefined at runtime.',
    efficientWay: {
      title: 'Typing context',
      approaches: [
        { name: 'null default + custom hook that throws', verdict: 'best', reason: 'Type-safe and surfaces missing Provider as a clear error.' },
        { name: '`{} as T` default', verdict: 'weak', reason: 'Consumers outside Provider silently get empty object — hard to debug.' },
        { name: 'Separate interface for context type', verdict: 'best', reason: 'Export the type for use in tests and child components.' }
      ],
      recommendation: 'Always null default + custom hook. Export the interface so child components can accept the context values as typed function arguments.'
    },
    commonMistakes: ['`{} as T` default — silent bugs when no Provider.', 'Mixing context type and internal implementation — export the interface separately.', 'Returning new object from custom hook: `return { user, logout }` — creates new ref each call; the context value memoization handles stability.'],
    seniorNotes: 'Testing components that use context: wrap in the Provider in tests with controlled values. Export a `TestAuthProvider` that accepts override props for easy test setup.',
    interviewQuestions: ['Why use null as a context default instead of an empty object?', 'How do you avoid null checks in every consumer of a typed context?', 'How would you type a context that holds both data and action functions?'],
    codeExamples: [{ lang: 'tsx', label: 'Fully typed context with custom hook', code: `// types.ts
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login:  (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// context.tsx
const AuthCtx = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]     = useState<User | null>(null);
  const [isLoading, setLoad] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
  }, []);

  const logout = useCallback(() => { setUser(null); }, []);

  const value = useMemo<AuthContextType>(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout]
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}` }]
  },

  {
    id: 'zod-rhf', phase: 4, phaseName: 'TypeScript with React',
    orderIndex: 50, estimatedMins: 25, prerequisites: ['ts-utility-types', 'forms-controlled'],
    title: 'Zod + React Hook Form',
    eli5: 'Zod defines WHAT your form data must look like — email must be valid, password at least 8 chars. React Hook Form connects that definition to your form inputs, shows errors automatically, and re-renders only when needed.',
    analogy: 'Zod is the rule book. React Hook Form is the referee that enforces the rules on the field and tells players which rules they broke.',
    explanation: 'Zod creates a schema that validates at runtime and generates TypeScript types. React Hook Form uses refs (not controlled inputs), re-renders only on submit or validated fields, and integrates with Zod via `@hookform/resolvers/zod`.',
    technicalDeep: 'Zod schema: `const schema = z.object({ email: z.string().email(), password: z.string().min(8) })`. Infer type: `type FormData = z.infer<typeof schema>`. RHF `useForm<FormData>({ resolver: zodResolver(schema) })` — validation runs on blur, change, or submit per the `mode` option. `register("fieldName")` returns `{ ref, name, onChange, onBlur }` — spreads onto `<input>`. `formState.errors.email?.message` shows the Zod error message. `handleSubmit(onValid, onInvalid)` — `onValid` receives typed `FormData`. `Controller` component wraps non-native inputs (custom selects, date pickers). `watch("field")` subscribes to a field value for conditional fields. Performance: RHF renders the form once on mount; each field manages itself via refs — no re-renders during typing.',
    whatBreaks: 'Forgetting the `resolver` — no schema validation, all data passes. Using controlled inputs with RHF\'s `register` — they conflict; use `Controller` for controlled components.',
    efficientWay: {
      title: 'Form validation stack',
      approaches: [
        { name: 'Zod + React Hook Form (the industry standard)', verdict: 'best', reason: 'Runtime validation + TypeScript types from one schema. Zero duplication.' },
        { name: 'Formik + Yup', verdict: 'ok', reason: 'Older stack, more controlled re-renders, larger bundle. Still widely used.' },
        { name: 'Manual controlled inputs + validation', verdict: 'ok', reason: 'Learn this first to understand what RHF abstracts. Use RHF in production.' }
      ],
      recommendation: 'Zod + React Hook Form for any form with 3+ fields or non-trivial validation. Plain controlled inputs for small login forms where simplicity is worth it.'
    },
    commonMistakes: ['Using `register` on a custom select — use `Controller` instead.', 'Not importing `zodResolver` from `@hookform/resolvers/zod`.', '`z.infer` returns the OUTPUT type — if you transform fields, the input and output types differ.'],
    seniorNotes: 'Zod schemas are reusable: define one schema for the form, use `.pick()` for update forms, `.partial()` for PATCH endpoints, `.strip()` for removing extra fields before API calls. The schema is the single source of truth for shape and validation.',
    interviewQuestions: ['What does `z.infer<typeof schema>` return?', 'Why does React Hook Form use refs instead of controlled state?', 'How do you validate a custom dropdown with React Hook Form?'],
    codeExamples: [{ lang: 'tsx', label: 'Zod + React Hook Form', code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(8, 'Min 8 characters'),
  role:     z.enum(['admin', 'user']),
});
type FormData = z.infer<typeof schema>;

function SignupForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'user' },
  });

  async function onSubmit(data: FormData) {
    await api.createUser(data); // data is fully typed and validated
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register('password')} type="password" />
      {errors.password && <p>{errors.password.message}</p>}

      <select {...register('role')}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Sign up'}
      </button>
    </form>
  );
}` }]
  },

  {
    id: 'advanced-ts-react', phase: 4, phaseName: 'TypeScript with React',
    orderIndex: 51, estimatedMins: 20, prerequisites: ['ts-generics', 'ts-utility-types', 'typing-props'],
    title: 'Advanced TypeScript Patterns for React',
    eli5: 'Advanced TypeScript lets you build components that change their type based on what you give them — like a box that knows it holds strings if you put strings in, or numbers if you put numbers in.',
    analogy: 'Generic components are a smart mold. Pour in metal and it makes a metal part; pour in plastic and it makes a plastic part. Same mold, different output type.',
    explanation: 'Key patterns: generic components that infer types from props, discriminated union props for variant behavior, polymorphic `as` prop, template literal types for event names, `satisfies` for config objects.',
    technicalDeep: 'Generic component: `function Select<T>({ options, getLabel }: { options: T[]; getLabel: (o: T) => string })` — T is inferred from `options`. Polymorphic `as`: `type PolymorphicProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>`. `satisfies` operator (TS 4.9): `const routes = { home: "/", about: "/about" } satisfies Record<string, string>` — TypeScript checks the type but keeps literal types for autocomplete. Template literal types: `type EventName<T extends string> = \`on\${Capitalize<T>}\`` — generates `onClick | onChange | onSubmit`. `NoInfer<T>` (TS 5.4): prevents a type param from being inferred from one argument.',
    whatBreaks: 'Generic components in `.tsx` files: `<T>` is parsed as JSX — use `<T,>` or `<T extends unknown>`. Complex discriminated union props with 5+ variants — TypeScript error messages become unreadable.',
    efficientWay: {
      title: 'Advanced TS patterns',
      approaches: [
        { name: 'Learn by reading library types (React, Zod, TanStack Query)', verdict: 'best', reason: 'Production-quality type-level code you can study and adapt.' },
        { name: 'Build a generic Table component', verdict: 'best', reason: 'Forces you to write a generic that infers column types from data — real-world challenge.' },
        { name: 'Avoid advanced patterns until needed', verdict: 'ok', reason: 'Valid — don\'t over-engineer. But know the patterns so you can reach for them.' }
      ],
      recommendation: 'Build a typed Table<T> that infers column definitions from the data type. This single exercise covers generics, constraints, keyof, and mapped types in one practical challenge.'
    },
    commonMistakes: ['`<T>` in .tsx files without trailing comma — JSX parse error.', 'Overusing generics where a union type is simpler.', 'Using `any` to escape complex type situations — try `unknown` with narrowing first.'],
    seniorNotes: '`satisfies` is underused. `const config = { ... } satisfies AppConfig` checks the shape without widening — you keep `config.key` as a literal type, not `string`. Use it for route maps, color palettes, and event name maps.',
    interviewQuestions: ['How do you write a generic React component in a .tsx file?', 'What does the `satisfies` operator do differently from a type annotation?', 'What is a polymorphic component and how do you type the `as` prop?'],
    codeExamples: [{ lang: 'tsx', label: 'Generic Table component', code: `// Generic Table — column types inferred from data
interface Column<T> {
  key:    keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

function Table<T extends Record<string, unknown>>({
  data, columns
}: {
  data: T[];
  columns: Column<T>[];
}) {
  return (
    <table>
      <thead>
        <tr>{columns.map(c => <th key={String(c.key)}>{c.header}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map(col => (
              <td key={String(col.key)}>
                {col.render ? col.render(row[col.key], row) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Usage — T inferred as User from data
type User = { id: number; name: string; email: string };
const columns: Column<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email', render: v => <a href={\`mailto:\${v}\`}>{String(v)}</a> },
];
<Table data={users} columns={columns} />` }]
  },

  /* â”€â”€ PHASE 5: React Ecosystem â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'styling-tailwind', phase: 5, phaseName: 'React Ecosystem',
    orderIndex: 52, estimatedMins: 25, prerequisites: ['css-in-react'],
    title: 'Tailwind CSS in Depth',
    eli5: 'Tailwind gives you tiny CSS building blocks as class names. Instead of writing a CSS file, you build styles right in your JSX: `className="text-lg font-bold text-blue-500 hover:text-blue-700"`.',
    analogy: 'Tailwind is a set of stamps. Regular CSS is painting freehand. With stamps you place exactly what you need, where you need it, fast.',
    explanation: 'Tailwind is a utility-first CSS framework — all styling via class names. No custom CSS files for most components. Benefits: no naming things, no unused CSS in production (tree-shaken), consistent spacing/color scale. Pair with `cn()` (clsx + tailwind-merge) for conditional classes.',
    technicalDeep: 'Installation: `npm i -D tailwindcss postcss autoprefixer; npx tailwindcss init -p`. Configure `content` array to point to your source files — this is how Tailwind scans for used class names and removes unused CSS. JIT (Just-In-Time) mode: default since Tailwind 3 — generates CSS for only used classes on demand. Arbitrary values: `w-[142px]`, `bg-[#61DAFB]` — use CSS values not in the scale. `@apply` in CSS files — encapsulate utility groups for reuse (use sparingly; defeats the tree-shaking benefit). Dark mode: `darkMode: "class"` — add `.dark` class to `<html>`, use `dark:bg-gray-900`. Responsive prefixes: `md:flex lg:grid`. `cn()` implementation: `import { clsx } from "clsx"; import { twMerge } from "tailwind-merge"; export function cn(...args) { return twMerge(clsx(args)); }`. shadcn/ui requires this pattern.',
    whatBreaks: '`content` not configured — Tailwind generates 0 CSS. Dynamic class names (`text-${color}-500`) are stripped by JIT — use full class names or safelist them. Conflicting utilities (`px-2 px-4`) — last class wins without tailwind-merge.',
    efficientWay: {
      title: 'Mastering Tailwind',
      approaches: [
        { name: 'Use Tailwind\'s docs search or a cheat sheet', verdict: 'best', reason: 'The class names follow a consistent pattern — you internalize them within a week.' },
        { name: 'Tailwind CSS IntelliSense VS Code extension', verdict: 'best', reason: 'Autocomplete + hover preview for every class — not optional.' },
        { name: 'Write all styles in a CSS file using @apply', verdict: 'weak', reason: 'Negates Tailwind\'s main advantages — worse tree-shaking, defeats the colocation benefit.' }
      ],
      recommendation: 'Install the IntelliSense extension immediately. Use the Tailwind docs search for specific properties. The `cn()` utility is non-negotiable for conditional classes.'
    },
    commonMistakes: ['Dynamic class names built with string concatenation — JIT strips them.', 'Not configuring content paths — Tailwind generates nothing.', 'Using Tailwind for complex animations — CSS or Framer Motion is better.'],
    seniorNotes: 'Tailwind\'s design token system (the scale for spacing, colors, typography) is also its consistency system — using arbitrary values breaks that. Reserve arbitrary values for brand-specific colors that don\'t fit the scale. Extend the config (`theme.extend`) rather than override.',
    interviewQuestions: ['How does Tailwind remove unused CSS in production?', 'Why can\'t you construct class names dynamically in Tailwind?', 'What problem does tailwind-merge solve?'],
    codeExamples: [{ lang: 'tsx', label: 'Tailwind with cn() for conditional classes', code: `import { cn } from '@/lib/utils';

interface BadgeProps {
  variant: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

function Badge({ variant, size = 'md', children }: BadgeProps) {
  return (
    <span className={cn(
      // Base styles
      'inline-flex items-center rounded-full font-medium',
      // Size variants
      size === 'sm' && 'px-2 py-0.5 text-xs',
      size === 'md' && 'px-2.5 py-1 text-sm',
      // Color variants
      variant === 'default' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      variant === 'success' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      variant === 'warning' && 'bg-yellow-100 text-yellow-700',
      variant === 'error'   && 'bg-red-100 text-red-700',
    )}>
      {children}
    </span>
  );
}` }]
  },

  {
    id: 'css-modules',
    phase: 5, phaseName: 'React Ecosystem',
    orderIndex: 52.5, estimatedMins: 15, prerequisites: ['css-in-react', 'what-is-react'],
    title: 'CSS Modules & Sass',
    eli5: 'CSS Modules let you write normal CSS but each class is automatically scoped to one component — no more accidental style collisions across the whole app. Sass adds superpowers like variables, nesting, and mixins to regular CSS.',
    analogy: 'Global CSS is a town bulletin board — anyone can post and read, names collide. CSS Modules is private mailboxes — each component has its own box, and the bundler gives each class a unique hashed name so nothing conflicts.',
    explanation: 'CSS Modules scope class names to the component file — `.button` in `Button.module.css` becomes `Button_button__xyz` in the DOM, preventing global collisions. Next.js ships with CSS Modules built in (no setup). Sass (`.scss`) adds variables, nesting, and `@use` imports — many enterprise codebases use Sass + CSS Modules together.',
    technicalDeep: 'CSS Modules: filename must end in `.module.css`. Import: `import styles from "./Button.module.css"`. Apply: `<button className={styles.button}>`. Multiple classes: use `clsx` library — `clsx(styles.button, isPrimary && styles.primary)`. Dynamic key: `styles[variantName]`. Global override: `:global(.some-class) { }` for third-party classes. Compose from another module: `composes: baseBtn from "./Base.module.css"`. TypeScript: `*.module.css` declaration file or `typescript-plugin-css-modules` for typed imports (`styles.button` autocompletes). Sass: `npm i sass` — rename to `.module.scss`, both features work together. Nesting: `.card { &:hover { box-shadow: ...; } }`. Variables: `$primary: #a78bfa`. Mixins: `@mixin flex-center { display: flex; align-items: center; justify-content: center; } .container { @include flex-center; }`. Use `@use` (modern) not `@import` (deprecated). Naming convention: camelCase in CSS Modules — `.primaryButton` not `.primary-button` (bracket notation works but is ugly).',
    whatBreaks: 'Forgetting `.module.css` extension — classes become global and collide. Dynamic class names with typos: `styles[dynamicClassName]` silently returns `undefined`, no error. Vendor-prefixed properties still need PostCSS autoprefixer even in CSS Modules.',
    efficientWay: {
      title: 'Choosing a CSS approach',
      approaches: [
        { name: 'Tailwind CSS for new projects', verdict: 'best', reason: 'No context switching, design tokens built in, pairs perfectly with Shadcn/ui.' },
        { name: 'CSS Modules for enterprise/library work', verdict: 'best', reason: 'Full CSS power, scoped, zero runtime, supported everywhere — common in older enterprise codebases.' },
        { name: 'styled-components / emotion', verdict: 'ok', reason: 'Runtime CSS-in-JS — fine for teams that prefer it, but adds runtime cost and complexity.' }
      ],
      recommendation: 'Learn Tailwind for new projects. Learn CSS Modules to read existing enterprise code — Next.js docs use them, many company codebases do. You will encounter both in job environments.'
    },
    commonMistakes: [
      'Using hyphenated class names without camelCase — `styles["primary-button"]` works but `styles.primaryButton` is cleaner and autocompletes.',
      'Writing global styles inside a module file without `:global()` wrapper — accidentally scopes things you wanted global.',
      'Nesting too deep in Sass — 3 levels max, or specificity becomes unmanageable.'
    ],
    seniorNotes: 'Many enterprise React/Next.js codebases (Vercel, Shopify, GitHub) still use CSS Modules as their primary styling — Tailwind was not the default 4-5 years ago when those codebases started. Reading `.module.css` files is a day-one required skill for any large codebase. When you join a company using CSS Modules, the mental model transfers instantly from any CSS you already know.',
    interviewQuestions: [
      'What problem do CSS Modules solve?',
      'How do you apply multiple CSS Module classes conditionally?',
      'What is the difference between Sass @use and @import?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'CSS Modules with clsx for conditional classes',
        code: `// Button.module.scss
.button  { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; }
.primary { background: #a78bfa; color: white; }
.danger  { background: #f87171; color: white; }
.loading { opacity: 0.7; cursor: not-allowed; }

// Button.tsx
import styles from './Button.module.scss';
import clsx from 'clsx';

type Variant = 'primary' | 'danger';

export function Button({
  variant = 'primary',
  loading = false,
  children,
}: {
  variant?: Variant;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],              // dynamic lookup — 'primary' | 'danger'
        loading && styles.loading,    // conditional
      )}
      disabled={loading}
    >
      {children}
    </button>
  );
}` }
    ]
  },

  {
    id: 'shadcn-ui', phase: 5, phaseName: 'React Ecosystem',
    orderIndex: 53, estimatedMins: 20, prerequisites: ['styling-tailwind', 'component-composition'],
    title: 'shadcn/ui — Component Library',
    eli5: 'shadcn/ui is a collection of beautiful, accessible React components built on Radix UI + Tailwind. Instead of installing a package you can\'t edit, you copy the component code directly into your project and customize it.',
    analogy: 'shadcn/ui is a recipe book where you own the kitchen. You copy the recipe (component code) into your project, then change any ingredient you want. No locked black box.',
    explanation: 'shadcn/ui is not a npm package — components are added via CLI (`npx shadcn-ui@latest add button`) into your `src/components/ui/` folder. You own and edit the code. Built on Radix UI primitives (accessible, headless) + Tailwind CSS. Requires the `cn()` utility.',
    technicalDeep: 'Architecture: Radix UI provides behavior + accessibility (focus management, keyboard nav, ARIA). Tailwind provides styling. You provide customization. Setup: `npx shadcn-ui@latest init` — creates `components.json`, adds `cn()` to `lib/utils.ts`, configures Tailwind CSS variables. Add components: `npx shadcn@latest add dialog card button` — each component is added as a file you own. `cva` (class-variance-authority) creates variant classes: `const buttonVariants = cva("base classes", { variants: { variant: { solid: "...", ghost: "..." } } })`. `Slot` from Radix (`asChild` prop): renders the component as its child element — polymorphic without TypeScript generics complexity.',
    whatBreaks: 'Not running `shadcn init` first — components won\'t have the right CSS variable setup. Editing shadcn components in node_modules instead of your `ui/` folder — your edits are lost on `npm install`.',
    efficientWay: {
      title: 'Using shadcn/ui',
      approaches: [
        { name: 'Start every new project with shadcn/ui', verdict: 'best', reason: 'Zero design decisions for common components — focus on the product, not the button.' },
        { name: 'Build all components from scratch', verdict: 'ok', reason: 'Educational but slow for production.' },
        { name: 'Use a fully packaged library (MUI, Chakra)', verdict: 'ok', reason: 'Less customizable but faster to start. Good for internal tools.' }
      ],
      recommendation: 'Run `npx shadcn@latest init` at project start. Add components as you need them. Customize via the CSS variables in `globals.css` for theming — don\'t edit each component.'
    },
    commonMistakes: ['Editing components in a package instead of the owned file.', 'Not setting up CSS variables — components display with wrong colors.', 'Trying to npm install shadcn/ui — it\'s not a package, it\'s a CLI.'],
    seniorNotes: 'The "copy into your project" model solves the most common pain with component libraries: you can\'t change internal behavior or styles without forking. shadcn/ui makes that the default — you own the code, upgrade is opt-in per component.',
    interviewQuestions: ['How is shadcn/ui different from a traditional npm component library?', 'What is Radix UI and how does shadcn/ui use it?', 'What is the `asChild` prop in Radix UI?'],
    codeExamples: [{ lang: 'bash', label: 'shadcn/ui setup', code: `# Initialize (one time per project)
npx shadcn@latest init
# Choose: TypeScript, Tailwind, app router, src/ dir

# Add components as needed
npx shadcn@latest add button dialog card input select toast

# Components appear in src/components/ui/ — you own them
# src/components/ui/button.tsx  ← edit this freely
# src/components/ui/dialog.tsx` }]
  },

  {
    id: 'testing-react', phase: 5, phaseName: 'React Ecosystem',
    orderIndex: 54, estimatedMins: 25, prerequisites: ['custom-hooks', 'functional-components'],
    title: 'Testing with Vitest + React Testing Library',
    eli5: 'Tests check that your components work as expected. React Testing Library tests components from the user\'s perspective — click this button, see if this text appears. Vitest is the fast test runner that runs the tests.',
    analogy: 'Testing Library is a robotic user that clicks, types, and reads the screen exactly like a human would. Vitest is the test track where the robot runs.',
    explanation: 'React Testing Library (RTL) renders components into a virtual DOM and provides queries like `getByText`, `getByRole`, `findByText` (async). Vitest is the Jest-compatible test runner used with Vite projects. `@testing-library/user-event` simulates real user interactions.',
    technicalDeep: 'Setup: `npm i -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom`. `vitest.config.ts`: `environment: "jsdom"`. `setupFiles`: import `@testing-library/jest-dom` for matchers like `toBeInTheDocument`. Query priority: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByTestId`. Role-based queries (`getByRole("button", { name: /submit/i })`) are most resilient to refactoring. `userEvent.setup()` simulates real browser events with timing. `screen.findBy*` returns a Promise — use `await` for async rendering. `renderHook` from RTL tests custom hooks. `vi.mock("module")` mocks imports. MSW (Mock Service Worker) intercepts fetch calls — better than mocking `fetch` directly.',
    whatBreaks: 'Testing implementation details (`getByTestId`, querying CSS classes) makes tests fragile — they break on refactoring even when behavior is correct. `act()` warnings mean your test has unhandled async updates — use `await userEvent` and `await findBy*`.',
    efficientWay: {
      title: 'Testing React components',
      approaches: [
        { name: 'Test user behavior, not implementation', verdict: 'best', reason: 'Tests that click and read like a user survive refactoring.' },
        { name: 'Test every internal state transition', verdict: 'weak', reason: 'White-box tests break on refactoring. Test the output, not how you got there.' },
        { name: 'Use MSW for API mocking', verdict: 'best', reason: 'Mock at the network layer — components don\'t know they\'re in a test.' }
      ],
      recommendation: 'Write one test per user flow: "user fills login form, clicks submit, sees dashboard." Use `getByRole` and `getByLabelText`. Avoid `getByTestId` except as last resort.'
    },
    commonMistakes: ['`getByTestId` overuse — brittle tests that break on restructure.', '`act()` warnings ignored — they indicate async state updates not handled in the test.', 'Mocking the entire module instead of just the network layer.'],
    seniorNotes: 'The testing trophy (Kent C. Dodds): most tests should be integration tests (component trees with mock network), fewer unit tests (pure functions, custom hooks), and a handful of e2e tests (Playwright). Not the testing pyramid from backend — React integration tests are cheap.',
    interviewQuestions: ['What is the recommended query priority in React Testing Library?', 'Why should you avoid testing implementation details?', 'What is MSW and why is it better than mocking fetch directly?'],
    codeExamples: [{ lang: 'tsx', label: 'RTL + Vitest component test', code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('calls onSubmit with email and password when valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    // Interact like a user
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('shows error when email is invalid', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'notanemail');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });
});` }]
  },

  {
    id: 'e2e-testing',
    phase: 5, phaseName: 'React Ecosystem',
    orderIndex: 54.5, estimatedMins: 20, prerequisites: ['testing-react', 'react-router'],
    title: 'E2E Testing with Playwright',
    eli5: 'Unit tests check one function. Integration tests check one component. E2E (end-to-end) tests check that a real user can complete a real task — like registering, logging in, and checking out — in a real browser.',
    analogy: 'Unit tests are checking each car part. Integration tests are checking the engine assembly. E2E tests are a test driver completing the full driving exam — get in, start car, drive the route, park, pass.',
    explanation: 'Playwright automates a real browser (Chromium, Firefox, WebKit). You write tests that navigate pages, fill forms, click buttons, and assert what the user sees. E2E tests are slower than unit tests but give the highest confidence — they catch bugs that only appear in the full running app.',
    technicalDeep: 'Setup: `npm init playwright@latest` — creates `playwright.config.ts` and `tests/` folder. Core API: `test("name", async ({ page }) => { })`. `page.goto("/")` navigates. `page.getByRole("button", { name: /submit/i })` finds by ARIA role (same priority as RTL). `page.getByLabel("Email")` for form inputs. `expect(page).toHaveURL("/dashboard")`. `expect(page.getByText("Welcome")).toBeVisible()`. `page.fill()` or `.fill()` on a locator. Authentication: create a `storageState` fixture that logs in once and reuses auth cookies — avoids logging in for every test (10x speed improvement). Visual regression: `await expect(page).toHaveScreenshot()` — pixel diff vs baseline. Trace viewer: `npx playwright show-trace trace.zip` — shows every action + screenshot + network request. CI: headless by default, `npx playwright test --reporter=html`. Page Object Model: class encapsulating page interactions — `class LoginPage { async login(email, pass) { ... } }` — makes tests readable and resilient to UI changes.',
    whatBreaks: 'Using `setTimeout()` waits — root cause of flaky tests. Playwright auto-waits; never sleep. Hardcoding `localhost:3000` — use `baseURL` in `playwright.config.ts`. Running E2E tests against production DB accidentally.',
    efficientWay: {
      title: 'E2E testing strategy',
      approaches: [
        { name: 'E2E for critical user flows only', verdict: 'best', reason: 'Login, signup, checkout — 5-10 flows. E2E is slow; don\'t replace RTL integration tests.' },
        { name: 'E2E for everything', verdict: 'weak', reason: 'Slow, occasionally flaky, overkill for pure UI interactions that RTL handles cheaper.' },
        { name: 'No E2E tests', verdict: 'weak', reason: 'You won\'t catch auth flows, multi-page interactions, or real browser-specific bugs.' }
      ],
      recommendation: 'Follow the testing trophy: many integration tests (RTL), few E2E tests (Playwright), very few pure unit tests. Write E2E for the flows that break most painfully: auth, payment, core user journey.'
    },
    commonMistakes: [
      'Using `setTimeout` instead of Playwright\'s auto-waiting — root cause of flaky tests.',
      'Not using `storageState` for auth — logging in for every test slows the suite 10x.',
      'Writing E2E for things RTL already covers (component rendering, isolated form validation).'
    ],
    seniorNotes: 'Playwright\'s auto-waiting is its killer feature — every `click()`, `fill()`, `getByRole()` automatically waits for the element to be visible, enabled, and stable. This eliminates the #1 cause of flaky tests in Selenium/Cypress. The trace viewer makes debugging CI failures trivial — you see a video + screenshot + network log of exactly what happened.',
    interviewQuestions: [
      'What is the difference between unit, integration, and E2E tests?',
      'How does Playwright\'s auto-waiting work and why does it matter?',
      'What is the Page Object Model and why is it useful for maintainability?'
    ],
    codeExamples: [
      {
        lang: 'ts',
        label: 'Playwright: login flow E2E test',
        code: `// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can log in and see dashboard', async ({ page }) => {
    await page.goto('/login');

    // Auto-waits for elements to be visible and enabled
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Assert redirect + content
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});

// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: { baseURL: 'http://localhost:3000' },
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI },
});` }
    ]
  },

  {
    id: 'framer-motion', phase: 5, phaseName: 'React Ecosystem',
    orderIndex: 55, estimatedMins: 20, prerequisites: ['functional-components'],
    title: 'Framer Motion Animations',
    eli5: 'Framer Motion makes animating React components easy. Instead of writing complex CSS animations, you describe: where the element starts, where it ends, and how it gets there — Framer handles the rest.',
    analogy: 'Framer Motion is a stage director for your components. You tell actors "enter from the left, exit upward" and the director (Framer) choreographs the movement.',
    explanation: '`motion.div` is an animated `div`. Set `initial`, `animate`, and `exit` props to define the animation. `AnimatePresence` enables exit animations when components unmount. `useAnimation` for programmatic control. `useSpring` for physics-based animations.',
    technicalDeep: '`motion.div` wraps any HTML element. Props: `initial={{ opacity: 0, y: -20 }}` — start state. `animate={{ opacity: 1, y: 0 }}` — end state. `exit={{ opacity: 0 }}` — unmount state (requires `<AnimatePresence>`). `transition={{ duration: 0.3, ease: "easeOut" }}`. `whileHover={{ scale: 1.05 }}` — gesture states. `variants` prop for complex animations: define named states, animate by name. `staggerChildren` in the parent variant staggers child animations. Layout animations: `layout` prop — animates a component\'s position/size change automatically when surrounding DOM changes. `LayoutGroup` for animating layout changes across multiple components. `useMotionValue` + `useTransform` for scroll-linked animations.',
    whatBreaks: 'Missing `<AnimatePresence>` around conditionally rendered `motion.*` components — exit animations don\'t play. Animating CSS properties that cause layout reflow (width, height, top, left) instead of `transform` equivalents — janky 60fps performance.',
    efficientWay: {
      title: 'Using Framer Motion',
      approaches: [
        { name: 'Start with opacity + translate animations (GPU-accelerated)', verdict: 'best', reason: 'Smooth 60fps. Use transform properties, not layout-reflow properties.' },
        { name: 'CSS transitions for simple hover/state changes', verdict: 'best', reason: 'CSS transitions are lighter for simple cases — use Framer for orchestration and complex sequences.' },
        { name: 'Animate width/height directly', verdict: 'weak', reason: 'Causes layout reflow, jank. Use `scaleX/Y` or layout animations instead.' }
      ],
      recommendation: 'Use Framer Motion for: page transitions, list item enter/exit, modal animations, gesture interactions. Use CSS transitions for simple hover effects and color changes.'
    },
    commonMistakes: ['No AnimatePresence for exit animations.', 'Animating properties that cause reflow (width, margin) — use transform instead.', 'Importing the whole library — use `framer-motion/dist/framer-motion` selective import or the slim build.'],
    seniorNotes: 'Framer Motion\'s `layout` prop is magic: add it to a component and Framer automatically animates any positional/size change caused by surrounding DOM changes (siblings added/removed, parent resize). This is what makes "shared element transitions" possible.',
    interviewQuestions: ['What is AnimatePresence and why is it needed?', 'Why should you animate transform instead of width/height?', 'What does the `layout` prop do in Framer Motion?'],
    codeExamples: [{ lang: 'tsx', label: 'Framer Motion: list with enter/exit', code: `import { motion, AnimatePresence } from 'framer-motion';

const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
  exit:   { opacity: 0, x: -20 },
};

function AnimatedList({ items }: { items: Item[] }) {
  return (
    <AnimatePresence mode="popLayout">
      {items.map(i => (
        <motion.div
          key={i.id}
          variants={item}
          initial="hidden"
          animate="show"
          exit="exit"
          layout // animates position change when list reorders
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {i.name}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}` }]
  },

  {
    id: 'react-ecosystem-tools', phase: 5, phaseName: 'React Ecosystem',
    orderIndex: 56, estimatedMins: 20, prerequisites: ['functional-components', 'ts-types-interfaces'],
    title: 'Essential Ecosystem Tools',
    eli5: 'Several tools make React development much smoother: ESLint catches code problems, Prettier formats everything automatically, Husky runs checks before every commit, and Storybook shows each component in isolation.',
    analogy: 'ESLint is a grammar checker, Prettier is auto-formatting, Husky is a guard at the commit gate, and Storybook is a showroom for your components.',
    explanation: 'The essential React toolchain beyond Vite: ESLint (with react-hooks plugin), Prettier, lint-staged + Husky for pre-commit checks, Storybook for component development in isolation, Playwright for end-to-end tests.',
    technicalDeep: 'ESLint config for React: `eslint-plugin-react`, `eslint-plugin-react-hooks` (critical — enforces hooks rules), `eslint-plugin-jsx-a11y` (accessibility). `.eslintrc` with `extends: ["plugin:react-hooks/recommended"]`. Prettier: runs after ESLint (`eslint-plugin-prettier` or run separately). lint-staged: runs linters only on staged files — fast pre-commit. Husky: `npx husky init` — creates `.husky/pre-commit` hook. Storybook: `npx storybook@latest init` — each story is one component state. Stories drive component-first development and serve as living documentation. Playwright: `npm init playwright@latest` — real browser E2E tests. `page.getByRole()` mirrors RTL\'s accessibility-first approach. `page.goto()`, `page.click()`, `expect(page).toHaveURL()`.',
    whatBreaks: 'Not running `eslint-plugin-react-hooks` — hooks rules violations make it to production. Prettier + ESLint conflicts — use `eslint-config-prettier` to disable conflicting ESLint formatting rules.',
    efficientWay: {
      title: 'Toolchain setup',
      approaches: [
        { name: 'Set up linting and formatting on day one', verdict: 'best', reason: 'Retrofitting an existing codebase is painful. Start with it.' },
        { name: 'Run Prettier only manually', verdict: 'weak', reason: 'Formatting debates waste review time. Automate it.' },
        { name: 'Add Storybook for every component', verdict: 'ok', reason: 'Great for design systems; overkill for business logic components.' }
      ],
      recommendation: 'Day one: Vite + TypeScript + ESLint (react-hooks plugin) + Prettier + Husky pre-commit. Add Storybook when you start building a design system. Add Playwright for critical user flows.'
    },
    commonMistakes: ['Missing `eslint-plugin-react-hooks` — the most impactful plugin.', 'ESLint and Prettier fighting each other without `eslint-config-prettier`.', 'Committing without running tests — add `npm test -- --run` to the Husky pre-commit hook.'],
    seniorNotes: 'The Husky + lint-staged setup is non-negotiable in team projects — it prevents code style debates and catches hooks violations before they land in CI. The 30 seconds of pre-commit time is worth it.',
    interviewQuestions: ['What does eslint-plugin-react-hooks check?', 'What is the difference between ESLint and Prettier?', 'What is Storybook used for?'],
    codeExamples: [{ lang: 'json', label: 'package.json scripts and lint-staged config', code: `{
  "scripts": {
    "lint":   "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "test":   "vitest",
    "storybook": "storybook dev -p 6006"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}

// .husky/pre-commit
// npx lint-staged` }]
  },

  /* â”€â”€ PHASE 6: Next.js Foundations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'what-is-nextjs', phase: 6, phaseName: 'Next.js Foundations',
    orderIndex: 57, estimatedMins: 25, prerequisites: ['what-is-react', 'es-modules'],
    title: 'What is Next.js?',
    eli5: 'Next.js is React with superpowers. It adds: pages that load from the server (faster first paint, better SEO), automatic file-based routing, image/font optimization, and built-in API routes — all with one `npm run dev`.',
    analogy: 'React is an engine. Next.js is the full car — engine + chassis + transmission + navigation + air conditioning. You could assemble all those from parts, but why when the car is ready to drive?',
    explanation: 'Next.js is the most popular React framework. It handles: routing (file-based), rendering (SSR, SSG, ISR, RSC), optimization (images, fonts, scripts), and deployment (Vercel-optimized). The App Router (Next.js 13+) uses React Server Components by default.',
    technicalDeep: 'Next.js rendering modes: (1) Static Generation (SSG) — HTML built at build time. (2) SSR — HTML rendered on each request. (3) ISR — static HTML regenerated after N seconds on request. (4) Client-side rendering (CSR) — React running in browser only. (5) React Server Components (RSC) — component runs on server, streams HTML to client, zero client JS. App Router (`app/`) vs Pages Router (`pages/`): App Router is the new default — uses RSC, layouts, streaming. Pages Router is stable legacy — uses `getServerSideProps`, `getStaticProps`. File conventions: `page.tsx` (route), `layout.tsx` (shared wrapper), `loading.tsx` (Suspense fallback), `error.tsx` (error boundary), `not-found.tsx`. TypeScript: Next.js generates types for routes and params automatically — use `PageProps` and `LayoutProps` from `next`.',
    whatBreaks: 'Mixing App and Pages routers in the same project — possible but confusing. Using `useState` in a Server Component — Server Components have no client-side state. Third-party libraries that access `window`/`localStorage` in Server Component context — they crash on the server.',
    efficientWay: {
      title: 'Starting with Next.js',
      approaches: [
        { name: 'npx create-next-app@latest with TypeScript + Tailwind + App Router', verdict: 'best', reason: 'Official scaffolder sets up everything correctly. Start here every time.' },
        { name: 'Migrate from Vite React to Next.js', verdict: 'ok', reason: 'Doable but requires understanding routing changes, Server Components, and fetch differences.' },
        { name: 'Learn Pages Router first, then App Router', verdict: 'ok', reason: 'Pages Router is simpler to understand; many job codebases still use it.' }
      ],
      recommendation: 'Start with App Router for new projects — it\'s the future of Next.js. Learn Pages Router conceptually for job interviews, since many existing projects use it.'
    },
    commonMistakes: ['Using `useState` or `useEffect` in a Server Component — add `"use client"` at the top.', 'Not understanding which components run on server vs client.', 'Fetching data in client components when Server Components could do it more efficiently.'],
    seniorNotes: 'Next.js\'s default behavior changed significantly with the App Router: components are Server Components by default. This inverts the "everything is client-side" React mental model. The key insight: Server Components run once at request time on the server, no JS sent to client — perfect for database queries and large dependencies.',
    interviewQuestions: ['What is the difference between the App Router and Pages Router in Next.js?', 'What is a React Server Component?', 'Name the five rendering modes in Next.js.'],
    codeExamples: [{ lang: 'bash', label: 'Create a Next.js project', code: `npx create-next-app@latest my-app \\
  --typescript \\
  --tailwind \\
  --eslint \\
  --app \\
  --src-dir \\
  --import-alias "@/*"

cd my-app && npm run dev
# App at http://localhost:3000

# App Router directory structure:
# src/
#   app/
#     layout.tsx    ← root layout
#     page.tsx      ← / route
#     about/
#       page.tsx    ← /about route
#     blog/
#       [slug]/
#         page.tsx  ← /blog/:slug route` }]
  },

  {
    id: 'graphql-concepts',
    phase: 5, phaseName: 'React Ecosystem',
    orderIndex: 56.5, estimatedMins: 25, prerequisites: ['data-fetching-patterns', 'async-await'],
    title: 'GraphQL Mental Model & Apollo Client',
    eli5: 'REST APIs are like a fixed restaurant menu — you order dish A and get exactly what\'s listed. GraphQL is like ordering custom — you describe exactly what fields you want, and get precisely that, nothing more, nothing less.',
    analogy: 'REST: call the waiter, they bring the set meal. GraphQL: you write your own order ("give me name and email of all users, plus their last 3 orders") and the kitchen assembles exactly that.',
    explanation: 'GraphQL is a query language for APIs. Instead of multiple REST endpoints, there\'s one endpoint (`/graphql`) where the client specifies exactly which fields it needs. This eliminates over-fetching (getting unused fields) and under-fetching (needing multiple requests). Many large companies — GitHub, Twitter/X, Shopify, Meta — use GraphQL.',
    technicalDeep: '`gql` tagged template: `const GET_USER = gql\\`query GetUser($id: ID!) { user(id: $id) { name email } }\\``. Apollo Client setup: `new ApolloClient({ uri: "/graphql", cache: new InMemoryCache() })`, wrap app in `<ApolloProvider client={client}>`. `useQuery(GET_USER, { variables: { id } })` returns `{ data, loading, error }`. `useMutation(CREATE_POST)` returns `[createPost, { loading, error }]`. Cache normalization: Apollo stores responses by `__typename + id` — mutations that return the right fields auto-update every `useQuery` for that entity. `refetchQueries` for explicit cache invalidation. Fragments: `fragment UserFields on User { id name email }` for reusable field sets. Codegen: `graphql-codegen` generates TypeScript types from the schema — never manually type API responses. Core concepts: Query (read), Mutation (write), Subscription (real-time over WebSocket). N+1 problem: one GraphQL query can trigger hundreds of DB queries without DataLoader on the server.',
    whatBreaks: 'Not handling `loading` state — briefly shows undefined data. Ignoring N+1 on the server — GraphQL queries can fan out to hundreds of DB calls. Not using codegen — manually typed responses drift from the schema.',
    efficientWay: {
      title: 'REST vs GraphQL — when to choose what',
      approaches: [
        { name: 'REST + TanStack Query for most projects', verdict: 'best', reason: 'Simpler, widely understood, excellent HTTP caching, easier to debug — covers 90% of use cases.' },
        { name: 'GraphQL when client needs vary widely', verdict: 'best', reason: 'Mobile vs web needing different fields, deep entity relationships, or a public API for multiple client teams.' },
        { name: 'Learn GraphQL to READ existing APIs', verdict: 'best', reason: 'GitHub, Shopify, and Contentful all have GraphQL APIs — you will encounter it in the wild.' }
      ],
      recommendation: 'Learn GraphQL to read and consume existing GraphQL APIs. Build new projects with REST + TanStack Query unless the use case specifically benefits from client-driven field selection.'
    },
    commonMistakes: [
      'Not using codegen — manually typing API responses is slow and drifts from the schema.',
      'Using Apollo where TanStack Query + REST would work fine — Apollo adds significant bundle and complexity.',
      'Ignoring the N+1 problem on the server — one GraphQL query can trigger hundreds of DB queries without DataLoader.'
    ],
    seniorNotes: 'The real value of GraphQL isn\'t the query syntax — it\'s the Apollo Client cache that normalizes entities globally (update a user in one mutation and every `useQuery` that includes that user auto-updates without refetching). At scale with multiple client teams consuming the same API, this is transformative. But it adds engineering overhead — evaluate the tradeoff honestly before committing.',
    interviewQuestions: [
      'What is the difference between over-fetching and under-fetching, and how does GraphQL solve both?',
      'What is the purpose of the Apollo Client InMemoryCache?',
      'When would you choose GraphQL over REST?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Apollo Client: useQuery and useMutation',
        code: `import { gql, useQuery, useMutation } from '@apollo/client';

const GET_USER = gql\`
  query GetUser($id: ID!) {
    user(id: $id) { id name email posts { id title } }
  }
\`;

const UPDATE_USER = gql\`
  mutation UpdateUser($id: ID!, $name: String!) {
    updateUser(id: $id, name: $name) { id name }  // id needed for cache
  }
\`;

function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useQuery(GET_USER, { variables: { id: userId } });
  const [updateUser, { loading: saving }] = useMutation(UPDATE_USER);

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{data.user.name}</h1>
      <button
        disabled={saving}
        onClick={() => updateUser({ variables: { id: userId, name: 'New Name' } })}
      >
        {saving ? 'Saving...' : 'Rename'}
      </button>
    </div>
  );
}` }
    ]
  },

  {
    id: 'app-router', phase: 6, phaseName: 'Next.js Foundations',
    orderIndex: 58, estimatedMins: 25, prerequisites: ['what-is-nextjs'],
    title: 'App Router Architecture',
    eli5: 'The App Router uses a folder structure where folders = URL segments and special files (`page.tsx`, `layout.tsx`) define what shows at each URL. Nesting folders nests layouts automatically.',
    analogy: 'App Router is a building blueprint where each floor (folder) has a standard plan (layout.tsx) and each room (page.tsx) is the specific content. Floors share their plumbing (layouts) with all rooms on that floor.',
    explanation: 'App Router maps `app/` folder structure to URLs. `page.tsx` renders a route. `layout.tsx` wraps a route and its children — persists across navigation. `loading.tsx` is the Suspense fallback. `error.tsx` is the error boundary. All are Server Components by default.',
    technicalDeep: 'Route segments: `app/dashboard/settings/page.tsx` → `/dashboard/settings`. Dynamic segments: `app/blog/[slug]/page.tsx` → `/blog/any-slug`. Catch-all: `[...slug]`. Optional catch-all: `[[...slug]]`. Route groups: `(marketing)/about/page.tsx` — parentheses exclude from URL, used to share layouts without URL nesting. Parallel routes: `@modal/page.tsx` — render multiple pages in the same layout simultaneously. Intercepting routes: `(.)photo/[id]/page.tsx` — intercept route and show modal instead of full page. `generateStaticParams()` in dynamic routes for static generation. `generateMetadata()` for dynamic SEO metadata. Layout persistence: layouts re-render on navigation ONLY if their segment is different — the root layout NEVER re-renders between navigations (preserving scroll position, form state, etc.).',
    whatBreaks: 'Trying to use `useState` directly in a layout or page file without `"use client"`. Layouts re-render when params change — if you need the layout to NOT re-render on param change, use the group pattern.',
    efficientWay: {
      title: 'Understanding App Router',
      approaches: [
        { name: 'Build a multi-page app with nested layouts', verdict: 'best', reason: 'Nested layouts with a shell, sidebar, and content reveal the layout persistence behavior.' },
        { name: 'Read the Next.js App Router docs section by section', verdict: 'ok', reason: 'Good reference but abstract without building.' },
        { name: 'Start with Pages Router because it\'s simpler', verdict: 'ok', reason: 'Valid for learning, but App Router is the future and worth learning directly.' }
      ],
      recommendation: 'Build an app with at least: root layout, dashboard layout with sidebar, a dynamic `[id]` route, and a loading state. This covers 90% of real App Router usage.'
    },
    commonMistakes: ['No `"use client"` on interactive components — Server Component has no state/effects.', 'Putting the wrong content in layout vs page — layout persists, page changes.', 'Not using route groups for shared layouts without URL coupling.'],
    seniorNotes: 'Layout persistence is Next.js\'s answer to the "navigation loses scroll position" problem. Because layouts never unmount between same-segment navigations, you can keep a sidebar scroll position, open accordion state, or playing audio across page navigations — React state in the layout survives.',
    interviewQuestions: ['What is the difference between layout.tsx and page.tsx?', 'What is a route group in Next.js?', 'When does a layout component re-render during navigation?'],
    codeExamples: [{ lang: 'tsx', label: 'App Router file structure and layout nesting', code: `// app/layout.tsx — root layout (NEVER unmounts)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}

// app/(dashboard)/layout.tsx — dashboard layout (persists within /dashboard/*)
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />          {/* persistent — keeps scroll, state */}
      <main>{children}</main>
    </div>
  );
}

// app/(dashboard)/users/[id]/page.tsx — dynamic route
export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) notFound();
  return <UserProfile user={user} />;
}` }]
  },

  {
    id: 'nextjs-parallel-routes',
    phase: 6, phaseName: 'Next.js Foundations',
    orderIndex: 58.5, estimatedMins: 20, prerequisites: ['app-router', 'nextjs-navigation'],
    title: 'Parallel & Intercepting Routes',
    eli5: 'Parallel routes show two different pages in the same layout simultaneously (like a sidebar and main panel that each update independently). Intercepting routes let you open something like a photo modal, but if you refresh you see the full photo page.',
    analogy: 'Parallel routes are like a split-screen TV — two channels running simultaneously, each controllable. Intercepting routes are like a photo lightbox — click a photo and a modal appears, but if someone pastes you the direct link they see the full photo page.',
    explanation: 'Parallel Routes (`@slot` folders) render multiple pages simultaneously in one layout — used for dashboards with independent panels. Intercepting Routes (`(.)folder`) show a different UI when navigating from the same layout, but the full page when navigating directly — the pattern behind Instagram/Pinterest-style modals.',
    technicalDeep: 'Parallel Routes: create `@`-prefixed folders — `app/dashboard/@analytics/page.tsx` and `app/dashboard/@team/page.tsx`. The dashboard layout receives both as props: `export default function Layout({ analytics, team, children }: Props)`. Each slot has independent loading/error states and its own navigation. `default.tsx` is required as a fallback when a slot has no active match (else hard navigation breaks). Soft (client-side) navigation shows both slots; hard navigation (refresh) uses `default.tsx`. Intercepting Routes: `(.)` intercepts same level, `(..)` one level up, `(...)` root level. Example: `app/feed/@modal/(.)photo/[id]/page.tsx` intercepts `/photo/[id]` when navigating from `/feed` — shows as modal. Navigating directly to `/photo/[id]` shows the real page. The full Instagram modal pattern: (1) Parallel route `@modal` in the feed layout. (2) Intercepting route `(.)photo/[id]` inside `@modal`. (3) Modal component with `router.back()` to close. (4) `default.tsx` returning `null` so `@modal` is invisible by default.',
    whatBreaks: 'Missing `default.tsx` in parallel route slots — page refresh returns 404 for the slot. Forgetting that intercepting routes only work with soft navigation — direct URL always shows the unintercepted page. Using parallel routes when a simple flex layout would do.',
    efficientWay: {
      title: 'When to use these advanced patterns',
      approaches: [
        { name: 'Parallel Routes for dashboard with independent panels', verdict: 'best', reason: 'Analytics + activity feed side by side, each with independent loading states and navigation.' },
        { name: 'Intercepting Routes for the "modal with shareable URL" pattern', verdict: 'best', reason: 'The canonical Next.js solution — open in modal from list, full page from direct link.' },
        { name: 'Avoid for simple use cases', verdict: 'best', reason: 'Both patterns add file structure complexity — only use them when the navigation behavior requires it.' }
      ],
      recommendation: 'Learn by building the photo gallery modal example — it\'s the clearest demo of both features together. This is a common technical interview topic for mid-senior Next.js roles.'
    },
    commonMistakes: [
      'Missing `default.tsx` in `@modal` slot — page refresh crashes the layout with 404.',
      'Using intercepting routes when a simple `<Dialog>` component is sufficient.',
      'Confusing parallel routes (two things simultaneously) with intercepting routes (different view based on navigation origin).'
    ],
    seniorNotes: 'The `@modal` + intercepting route pattern solves a painful problem: a URL that shows a modal from the feed but the full page from a direct link. Twitter\'s "expand tweet" in a modal is this exact pattern. Next.js building it into the router eliminates the custom client-side state hacks teams used to write. The architectural win: the URL is always correct and shareable.',
    interviewQuestions: [
      'What is a parallel route in Next.js and when would you use one?',
      'How do intercepting routes enable the "Instagram photo modal" pattern?',
      'What is the purpose of default.tsx in a parallel route slot?'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Photo modal: parallel + intercepting routes',
        code: `// File structure:
// app/feed/page.tsx                          ← photo grid
// app/feed/layout.tsx                        ← receives @modal slot
// app/feed/@modal/default.tsx                ← null (no modal by default)
// app/feed/@modal/(.)photo/[id]/page.tsx     ← modal (intercepts from /feed)
// app/photo/[id]/page.tsx                    ← full photo page (direct URL)

// app/feed/layout.tsx
export default function FeedLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal} {/* renders null by default, modal when intercepted */}
    </>
  );
}

// app/feed/@modal/default.tsx
export default function Default() { return null; }

// app/feed/@modal/(.)photo/[id]/page.tsx
'use client';
import { useRouter } from 'next/navigation';
export default function PhotoModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  return (
    <div className="modal-overlay" onClick={() => router.back()}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <Photo id={params.id} />
      </div>
    </div>
  );
}` }
    ]
  },

  {
    id: 'server-vs-client', phase: 6, phaseName: 'Next.js Foundations',
    orderIndex: 59, estimatedMins: 30, prerequisites: ['app-router'],
    title: 'Server vs Client Components',
    eli5: 'Server Components run on the server and send HTML — they can talk to databases and keep secrets. Client Components run in the browser — they can react to clicks and remember state. Most components should be Server Components.',
    analogy: 'Server Components are chefs in the kitchen — they see all the raw ingredients (database, secrets) and prepare the dish. Client Components are waiters — they interact with the customer and bring the food, but they never see the kitchen.',
    explanation: 'All components in App Router are Server Components by default. Add `"use client"` directive to make a component a Client Component. Server Components: async, can fetch, can read server secrets. Client Components: can use hooks, handle events, access browser APIs.',
    technicalDeep: 'Server Components: run at request time on the server. Zero client JavaScript. Can `await` data, use Node APIs, access environment secrets. Serialized as HTML + JSON flight data. Cannot use: useState, useEffect, browser APIs, event handlers. Client Components: `"use client"` at top of file — this marks a "client boundary." All imports of a Client Component are also client-bundled. Server Components CAN be children/props of Client Components (they\'re rendered by the server and passed as already-rendered HTML). This is the "server component as children" pattern — critical for keeping the server/client boundary in the right place. Data flow: Server Component fetches data → passes as props to Client Component (which is serialized as JSON — no class instances, functions, or Dates without serialization).',
    whatBreaks: 'Passing non-serializable values (functions, class instances, Dates) from Server to Client Components as props — they cannot cross the serialization boundary. Using browser APIs (localStorage, window) in a Server Component — they don\'t exist on the server.',
    efficientWay: {
      title: 'Deciding server vs client',
      approaches: [
        { name: 'Start everything as Server Component, add "use client" only when needed', verdict: 'best', reason: 'Push client boundary as far down the tree as possible — minimize client JS.' },
        { name: 'Add "use client" to all components for simplicity', verdict: 'weak', reason: 'Defeats the purpose of Server Components — you\'re back to a plain React SPA.' },
        { name: 'Separate files for server data fetching and client interaction', verdict: 'best', reason: 'Server Component fetches data, passes to Client Component for interactivity.' }
      ],
      recommendation: 'Decision tree: "Does this component need state/effects/events/browser APIs?" → Client Component. Everything else → Server Component. Push the `"use client"` boundary as far down the tree as possible.'
    },
    commonMistakes: ['`"use client"` on a parent when only one child needs interactivity — add it to the child instead.', 'Importing a client-only library (e.g., chart.js) in a Server Component — crashes.', 'Passing a Date object as prop to a Client Component — serialize to ISO string first.'],
    seniorNotes: 'The "donut" pattern: Server Component (outer) → Client Component shell (with "use client") → Server Component children (passed via props). This lets you have a client-side interactive wrapper with server-rendered content inside — common for modals, sidebars, and carousels.',
    interviewQuestions: ['What can Server Components do that Client Components cannot, and vice versa?', 'How do you pass data from a Server Component to a Client Component?', 'Can a Server Component be a child of a Client Component?'],
    codeExamples: [{ lang: 'tsx', label: 'Server → Client boundary', code: `// app/users/page.tsx — Server Component (no "use client")
async function UsersPage() {
  // ✅ Direct DB access, no fetch needed
  const users = await db.user.findMany({ take: 20 });

  return (
    <div>
      <h1>Users</h1>
      {/* Pass serializable data to Client Component */}
      <UserTable users={users} />
    </div>
  );
}

// components/UserTable.tsx — Client Component
'use client';
function UserTable({ users }: { users: User[] }) {
  const [filter, setFilter] = useState('');
  const filtered = users.filter(u => u.name.includes(filter));

  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter..." />
      <table>
        {filtered.map(u => <tr key={u.id}><td>{u.name}</td></tr>)}
      </table>
    </>
  );
}` }]
  },

  {
    id: 'nextjs-metadata', phase: 6, phaseName: 'Next.js Foundations',
    orderIndex: 60, estimatedMins: 15, prerequisites: ['app-router'],
    title: 'Metadata & SEO',
    eli5: 'Next.js lets you set the page title, description, and social card images that search engines and social networks use when they look at your pages.',
    analogy: 'Metadata is the label on a package. Before anyone opens it (visits the page), they read the label — title, description, preview image. Next.js writes the label automatically.',
    explanation: 'Export a `metadata` object (static) or `generateMetadata` function (dynamic) from `page.tsx` or `layout.tsx`. Next.js injects the correct `<title>`, `<meta>`, and OG tags. Layouts\' metadata merges with pages\' metadata — pages override.',
    technicalDeep: 'Static: `export const metadata: Metadata = { title: "Home", description: "..." }`. Dynamic: `export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> { const post = await getPost(params.id); return { title: post.title, openGraph: { images: [post.image] } } }`. Template: `title: { template: "%s | My Site", default: "My Site" }` — child pages fill `%s`. `Metadata` type from `next`: covers title, description, openGraph, twitter, icons, robots, canonical, alternates. Robots: `export const metadata = { robots: { index: false, follow: false } }` for private/draft pages. `viewport` metadata moved to a separate `export const viewport: Viewport = { themeColor: "#000" }` in Next.js 14+.',
    whatBreaks: 'Using `<title>` directly in JSX inside a layout — Next.js metadata system handles this. Duplicate `<title>` tags break SEO.',
    efficientWay: {
      title: 'SEO with Next.js',
      approaches: [
        { name: 'Static metadata for most pages, generateMetadata for dynamic', verdict: 'best', reason: 'Simple pages get a const export; blog posts, products get dynamic generation.' },
        { name: 'react-helmet (React SPA approach)', verdict: 'weak', reason: 'Helmet manipulates the DOM — Server Components render metadata in the HTML, not client-side.' },
        { name: 'Manual head tags in layout', verdict: 'weak', reason: 'Error-prone and overrides Next.js\'s merge/deduplication logic.' }
      ],
      recommendation: 'Define base metadata in `app/layout.tsx` (site name, favicon, default OG image). Override with page-level metadata. Use `generateMetadata` for dynamic routes.'
    },
    commonMistakes: ['Missing `og:image` — social sharing shows no preview.', 'Not using the title template — every page shows the bare page title with no site name.', 'Setting robots noindex on production pages accidentally.'],
    seniorNotes: 'OG image generation: Next.js has built-in `ImageResponse` from `next/og` — generates OG images on-demand with JSX. No design tool needed: `export async function GET(req) { return new ImageResponse(<div style={{...}}>Post Title</div>) }`.',
    interviewQuestions: ['How does Next.js handle page metadata in the App Router?', 'What is generateMetadata and when do you need it?', 'How do title templates work in Next.js metadata?'],
    codeExamples: [{ lang: 'tsx', label: 'Static and dynamic metadata', code: `// app/layout.tsx — base metadata for the whole site
export const metadata: Metadata = {
  title: { template: '%s | MyApp', default: 'MyApp' },
  description: 'The best app ever.',
  openGraph: { siteName: 'MyApp', locale: 'en_US', type: 'website' },
};

// app/blog/[slug]/page.tsx — dynamic metadata per post
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,          // → "My Post | MyApp"
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
  };
}` }]
  },

  {
    id: 'nextjs-navigation', phase: 6, phaseName: 'Next.js Foundations',
    orderIndex: 61, estimatedMins: 15, prerequisites: ['app-router'],
    title: 'Navigation in Next.js',
    eli5: 'Next.js has its own version of links and a navigation hook. They work like React Router\'s `<Link>` and `useNavigate`, but they also prefetch pages in the background and work with Server Components.',
    analogy: 'Next.js Link is a smart highway — it pre-builds the exit ramp before you arrive so you drive through instantly.',
    explanation: '`<Link href="/about">` from `next/link` replaces `<a>` tags. It prefetches the route on hover. `useRouter()` from `next/navigation` (not `next/router`) for programmatic navigation. `usePathname()` for the current URL. `useSearchParams()` for query params.',
    technicalDeep: 'Link prefetching: in production, `<Link>` components in the viewport are prefetched automatically — the target page\'s Server Component data is fetched and cached before the user clicks. `prefetch={false}` to disable. Soft navigation: Next.js uses the browser history API — no full page reload, React state in persistent layouts is preserved. `useRouter` from `next/navigation` (App Router) has: `push(href)`, `replace(href)`, `back()`, `forward()`, `refresh()` (re-fetches Server Component data). `redirect(url)` in Server Components/server actions for server-side redirects — throws internally, don\'t wrap in try/catch. `permanentRedirect` for 308 redirects. `notFound()` renders the `not-found.tsx` file. `<Link scroll={false}>` prevents scroll-to-top on navigation. `useSelectedLayoutSegment()` — active segment for sidebar highlighting.',
    whatBreaks: 'Using `useRouter` from `next/router` (Pages Router) in the App Router — different API, will error. Calling `redirect()` inside a try/catch — it throws internally.',
    efficientWay: {
      title: 'Navigation patterns',
      approaches: [
        { name: 'Link for all navigational links', verdict: 'best', reason: 'Gets prefetching and soft navigation for free.' },
        { name: 'useRouter.push for form submit redirects and programmatic nav', verdict: 'best', reason: 'After form submit, redirect to the result page.' },
        { name: 'window.location.href for navigation', verdict: 'weak', reason: 'Full page reload, loses all React state, no prefetching.' }
      ],
      recommendation: 'Rule: use `<Link>` for all clickable nav. Use `useRouter().push()` for programmatic redirects after mutations. Use server-side `redirect()` in Server Actions.'
    },
    commonMistakes: ['Importing `useRouter` from `next/router` in App Router — use `next/navigation`.', 'Using `<a href>` instead of `<Link>` — full page reload.', 'Calling `redirect()` inside try/catch — it throws, catch blocks suppress it.'],
    seniorNotes: '`<Link prefetch>` in production is one of Next.js\'s biggest DX wins — users experience near-instant navigations because the next page\'s data is already fetched. In development, prefetching is disabled to avoid excessive network calls.',
    interviewQuestions: ['What is the difference between next/navigation and next/router?', 'How does Next.js Link prefetching work?', 'When would you use redirect() instead of useRouter().push()?'],
    codeExamples: [{ lang: 'tsx', label: 'Navigation patterns', code: `'use client';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

function NavBar() {
  const pathname = usePathname();
  const router   = useRouter();
  const params   = useSearchParams();

  async function handleLogout() {
    await authService.logout();
    router.push('/login');   // programmatic navigation after action
  }

  return (
    <nav>
      {/* Link — prefetches on hover in production */}
      <Link href="/dashboard"
        className={pathname === '/dashboard' ? 'active' : ''}>
        Dashboard
      </Link>

      {/* Preserve existing query params while adding new ones */}
      <Link href={\`?sort=asc&\${params.toString()}\`}>Sort ASC</Link>

      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}` }]
  },

  {
    id: 'loading-error-ui', phase: 6, phaseName: 'Next.js Foundations',
    orderIndex: 62, estimatedMins: 15, prerequisites: ['app-router', 'suspense-lazy'],
    title: 'Loading UI & Error Handling',
    eli5: 'Next.js has special files for loading screens and error messages. Put `loading.tsx` in a folder and it shows automatically while the page loads. Put `error.tsx` and it catches crashes in that part of the app.',
    analogy: 'loading.tsx is the "Please Wait" screen that shows while the data kitchen prepares your meal. error.tsx is the chef who comes out when something went wrong and offers an apology.',
    explanation: '`loading.tsx` in a route segment automatically wraps the `page.tsx` in a Suspense boundary. Shows while Server Component data fetches. `error.tsx` is an error boundary for that segment — shows on runtime errors. `not-found.tsx` shows when you call `notFound()`.',
    technicalDeep: '`loading.tsx` exports a default component — Next.js wraps `<Suspense fallback={<Loading />}><Page /></Suspense>` automatically. The loading UI renders immediately, page content streams in. This enables instant route transitions with skeleton screens. `error.tsx` must include `"use client"` — it receives `error: Error` and `reset: () => void` props. `reset()` re-renders the error boundary content (retries the Server Component). Global error: `app/global-error.tsx` catches root layout errors. Segment-level `error.tsx` catches that segment without affecting the rest of the page. `not-found.tsx`: `notFound()` in Server Components triggers this — use for missing records. Route-level `not-found.tsx` shows for that route; root `app/not-found.tsx` is the global 404.',
    whatBreaks: 'Missing `"use client"` on `error.tsx` — Next.js requires it to be a Client Component. Returning a Promise from `loading.tsx` — it must be a synchronous component.',
    efficientWay: {
      title: 'Loading and error patterns',
      approaches: [
        { name: 'loading.tsx for every data-heavy route segment', verdict: 'best', reason: 'Instant perceived navigation — users see a skeleton while data loads.' },
        { name: 'Manual loading state in each component', verdict: 'weak', reason: 'More code, no automatic Suspense integration, no instant navigation feel.' },
        { name: 'Skeleton UI matching the actual layout', verdict: 'best', reason: 'Reduces CLS (layout shift) — skeleton same size as real content.' }
      ],
      recommendation: 'Add `loading.tsx` to any route that fetches data. Use a skeleton that matches the page layout, not a centered spinner. Add `error.tsx` with a retry button to all data-loading routes.'
    },
    commonMistakes: ['error.tsx without "use client" — will not work.', 'loading.tsx that doesn\'t match the page layout size — causes layout shift.', 'Not calling notFound() when a record doesn\'t exist — showing an empty page instead.'],
    seniorNotes: '`loading.tsx` + streaming is Next.js\'s implementation of progressive HTML: the shell (nav, layout) is sent to the browser immediately, content slots stream in as they resolve. This is better than the old "wait for all data, then render" model — users see content faster.',
    interviewQuestions: ['How does loading.tsx create a Suspense boundary automatically?', 'What props does error.tsx receive?', 'What is the difference between error.tsx and global-error.tsx?'],
    codeExamples: [{ lang: 'tsx', label: 'loading.tsx, error.tsx, not-found.tsx', code: `// app/dashboard/loading.tsx — instant skeleton while data fetches
export default function DashboardLoading() {
  return (
    <div className="space-y-4 p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

// app/dashboard/error.tsx — catches fetch/render errors
'use client';
export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6 text-center">
      <h2>Dashboard failed to load</h2>
      <p className="text-gray-500">{error.message}</p>
      <button onClick={reset} className="btn btn-primary mt-4">Try again</button>
    </div>
  );
}

// app/users/[id]/not-found.tsx
export default function UserNotFound() {
  return <div><h2>User not found</h2><Link href="/users">Back to users</Link></div>;
}` }]
  },

  {
    id: 'nextjs-image-fonts', phase: 6, phaseName: 'Next.js Foundations',
    orderIndex: 63, estimatedMins: 15, prerequisites: ['what-is-nextjs'],
    title: 'Image & Font Optimization',
    eli5: 'Next.js has a special `<Image>` component that automatically resizes images, picks the right format (WebP), and loads them lazily. It also has a font optimizer that loads Google Fonts without layout shift.',
    analogy: 'Next.js Image is a smart photographer\'s assistant — they deliver the perfect size print for each frame, never more, never less.',
    explanation: '`next/image` serves images in optimal formats (WebP/AVIF), resizes for the requesting device, prevents CLS (you must provide `width`/`height` or `fill`), and lazy-loads by default. `next/font` downloads Google Fonts at build time — zero CLS, no external request.',
    technicalDeep: 'Image component: `<Image src="/photo.jpg" alt="desc" width={800} height={600} />`. For dynamic size (fill the parent): `<div style={{ position: "relative" }}><Image src={url} fill alt="..." className="object-cover" /></div>`. `priority` prop on above-the-fold images — disables lazy loading, preloads. Remote images: add the domain to `next.config.js` `images.remotePatterns`. The optimization happens in an edge function — Vercel handles it; self-hosted needs a custom loader or `sharp`. Font: `import { Inter } from "next/font/google"; const inter = Inter({ subsets: ["latin"] })`. Apply: `className={inter.className}` or as a CSS variable. Fonts are downloaded at build time and served self-hosted — no Flash of Unstyled Text (FOUT), no layout shift (CLS = 0 for text). Local fonts: `next/font/local` with `src` pointing to the font file.',
    whatBreaks: 'No `width`/`height` or `fill` on `<Image>` — CLS error. Remote images from unconfigured domains — blocked by default. `<img>` tags bypassing next/image — no optimization, potential CLS.',
    efficientWay: {
      title: 'Images and fonts',
      approaches: [
        { name: 'Always use next/image for all images', verdict: 'best', reason: 'Automatic WebP, lazy loading, and CLS prevention with one component.' },
        { name: 'Always use next/font for web fonts', verdict: 'best', reason: 'Zero FOUT, zero layout shift, no external network request at runtime.' },
        { name: 'Use <img> and link to Google Fonts directly', verdict: 'weak', reason: 'Manual optimization, CLS, and performance regressions — defeats the purpose of Next.js.' }
      ],
      recommendation: 'Replace every `<img>` with `<Image>` from `next/image`. Configure fonts in `layout.tsx` with `next/font/google`. These two changes can dramatically improve Core Web Vitals scores.'
    },
    commonMistakes: ['Missing `width`/`height` — Next.js throws.', 'Not adding `priority` to the hero image — LCP score suffers.', 'Remote images without adding the domain to remotePatterns.'],
    seniorNotes: 'Core Web Vitals: Next.js Image prevents CLS (Cumulative Layout Shift) by reserving space with `aspect-ratio`. `priority` on the hero image improves LCP (Largest Contentful Paint). These two fixes alone can raise a CrUX score by 20+ points.',
    interviewQuestions: ['What is the advantage of next/image over a regular img tag?', 'How does next/font eliminate layout shift?', 'When should you use the `priority` prop on an Image?'],
    codeExamples: [{ lang: 'tsx', label: 'Optimized image and font setup', code: `// app/layout.tsx — font setup
import { Inter, JetBrains_Mono } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${mono.variable}\`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

// components/HeroSection.tsx
import Image from 'next/image';
function HeroSection() {
  return (
    <section>
      {/* Above-fold image — priority prevents lazy loading */}
      <Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />

      {/* Responsive fill image */}
      <div className="relative h-64">
        <Image src="/bg.jpg" fill alt="" className="object-cover" />
      </div>
    </section>
  );
}` }]
  },

  /* â”€â”€ PHASE 7: Next.js Data & Rendering â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'fetch-caching', phase: 7, phaseName: 'Next.js Data',
    orderIndex: 64, estimatedMins: 25, prerequisites: ['server-vs-client'],
    title: 'Data Fetching & Caching in Next.js',
    eli5: 'In Next.js Server Components, you use `fetch()` directly — no useEffect needed. Next.js caches the response automatically so the same request isn\'t repeated on every page view.',
    analogy: 'Fetching in Server Components is like a chef making stock once and keeping it on the stove — everyone who needs it gets it from the pot, not from a fresh batch.',
    explanation: 'In Server Components, `fetch()` is enhanced by Next.js — it caches, deduplicates, and supports revalidation. Fetch in the component that needs the data (no prop drilling). Multiple fetches for the same URL in one request are deduplicated automatically.',
    technicalDeep: 'Next.js extends the native `fetch`: `cache` option controls caching behavior. `fetch(url, { cache: "force-cache" })` — static, cache forever (default for SSG). `fetch(url, { cache: "no-store" })` — dynamic, never cache (SSR). `fetch(url, { next: { revalidate: 60 } })` — ISR, revalidate after 60 seconds. In Next.js 15, `cache: "no-store"` is the new default (opt-in to caching). Deduplication: same URL + same options fetched by two components in one render cycle → one request. Data fetching waterfall: if component A awaits before rendering B which also fetches, they run sequentially. Fix: use `Promise.all` for parallel fetches, or fetch at the page level and pass data down. `cache()` function from React for memoizing arbitrary async functions across a request. `unstable_cache` from `next/cache` for cross-request caching of non-fetch async functions (e.g., database queries).',
    whatBreaks: 'Fetching in a loop (fetch per item) → N sequential requests. Use `Promise.all(items.map(id => fetch(...)))` for parallel. Forgetting `{ cache: "no-store" }` on user-specific data — shared cached response across users.',
    efficientWay: {
      title: 'Data fetching patterns',
      approaches: [
        { name: 'Fetch in the Server Component that uses the data', verdict: 'best', reason: 'Colocation — the data and its rendering are in the same file.' },
        { name: 'Fetch in the root layout and pass everything down', verdict: 'weak', reason: 'Prop drilling, unnecessary data loaded for routes that don\'t use it.' },
        { name: 'Use React Query for server data in Client Components', verdict: 'ok', reason: 'Valid for highly dynamic, user-specific data in Client Components.' }
      ],
      recommendation: 'Server Components: fetch directly with `await fetch()` at the top of the async component. Client Components: use React Query. Never fetch in Server Components AND React Query for the same data.'
    },
    commonMistakes: ['User-specific data without `no-store` — shared cache across users, security issue.', 'Sequential awaits for independent data — use Promise.all.', 'Fetching in useEffect when a Server Component could do it without client JS.'],
    seniorNotes: '`unstable_cache` is the Server Component equivalent of React Query\'s `staleTime` for database queries — caches the result across requests and revalidates on a schedule or on-demand. It\'s the key primitive for making database-backed pages fast.',
    interviewQuestions: ['What does fetch deduplication mean in Next.js?', 'What is the difference between no-store and revalidate in fetch cache options?', 'How do you avoid a data waterfall in Server Components?'],
    codeExamples: [{ lang: 'tsx', label: 'Fetch patterns in Server Components', code: `// app/dashboard/page.tsx — parallel fetches
async function DashboardPage() {
  // ✅ Parallel — both start at the same time
  const [user, stats] = await Promise.all([
    fetch('/api/me',    { cache: 'no-store' }).then(r => r.json()),
    fetch('/api/stats', { next: { revalidate: 60 } }).then(r => r.json()),
  ]);

  return <Dashboard user={user} stats={stats} />;
}

// Memoize a DB function per request (cache from React)
import { cache } from 'react';
export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } });
});
// Called in multiple components — runs DB query once per request

// unstable_cache — persists across requests
import { unstable_cache } from 'next/cache';
const getCachedConfig = unstable_cache(
  async () => db.config.findMany(),
  ['config'],
  { revalidate: 3600 } // cache for 1 hour
);` }]
  },

  {
    id: 'rendering-strategies', phase: 7, phaseName: 'Next.js Data',
    orderIndex: 65, estimatedMins: 25, prerequisites: ['fetch-caching'],
    title: 'SSG, SSR, ISR & Streaming',
    eli5: 'Next.js can build pages ahead of time (SSG — super fast), build them fresh for each request (SSR — always up to date), rebuild them occasionally (ISR — best of both), or stream parts of the page as data arrives.',
    analogy: 'SSG is a printed brochure — made once, given to everyone. SSR is a custom letter — written each time. ISR is a brochure that reprints itself every hour. Streaming is handing pages out as the printer prints them.',
    explanation: 'SSG: `fetch(url, { cache: "force-cache" })` or no fetch — page built at build time. SSR: `fetch(url, { cache: "no-store" })` — rendered per request. ISR: `{ next: { revalidate: N } }` — static HTML rebuilt after N seconds. Streaming: multiple `<Suspense>` boundaries let Next.js send HTML in chunks.',
    technicalDeep: 'The rendering strategy is inferred from the fetch options in a route segment. Any `no-store` fetch makes the route dynamic (SSR). All `force-cache` or revalidated fetches → static. `generateStaticParams()` in dynamic routes: `export async function generateStaticParams() { const posts = await getPosts(); return posts.map(p => ({ slug: p.slug })); }` — pre-generates pages for each slug at build time. ISR on-demand revalidation: `revalidatePath("/blog/my-post")` or `revalidateTag("posts")` — called from a Server Action or API route to immediately invalidate cache. Streaming: wrap slow Server Components in `<Suspense>` — faster data resolves first, slow ones stream in. `loading.tsx` is the route-level Suspense fallback. Nested Suspense for granular streaming.',
    whatBreaks: 'Dynamic route without `generateStaticParams()` — 404 at build time for static export. Using `revalidatePath` in a Client Component — it only works on the server.',
    efficientWay: {
      title: 'Choosing a rendering strategy',
      approaches: [
        { name: 'Default to ISR — revalidate every 60-3600 seconds', verdict: 'best', reason: 'Static performance + fresh data after a short delay. Best of both worlds for most content.' },
        { name: 'SSR for user-specific or real-time data', verdict: 'best', reason: 'Authenticated dashboards, live prices, personalized feeds need per-request rendering.' },
        { name: 'SSG for marketing/docs pages', verdict: 'best', reason: 'Fastest possible load — HTML is pre-built and served from CDN edge.' }
      ],
      recommendation: 'Decision: "Does the content change per user?" → SSR (no-store). "Does content change every few minutes?" → ISR (revalidate: 60-300). "Rarely changes?" → SSG (force-cache or static).'
    },
    commonMistakes: ['No-store on public pages — SSR overhead for content that could be static.', 'force-cache on user-specific pages — serving one user\'s data to another.', 'Missing generateStaticParams for dynamic SSG routes.'],
    seniorNotes: 'On-demand ISR (`revalidatePath` / `revalidateTag`) is the production-grade pattern: pages stay static until a content change triggers a revalidation. CMS webhooks call a Next.js API route that calls `revalidatePath` — the next request gets the freshly built page.',
    interviewQuestions: ['What determines whether a Next.js route is static or dynamic?', 'What is ISR and how does on-demand revalidation work?', 'How does streaming with Suspense improve perceived performance?'],
    codeExamples: [{ lang: 'tsx', label: 'Rendering strategies in one app', code: `// SSG — blog post, built at build time
export async function generateStaticParams() {
  const posts = await db.post.findMany({ select: { slug: true } });
  return posts.map(p => ({ slug: p.slug }));
}
async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetch(\`/api/posts/\${params.slug}\`, {
    cache: 'force-cache' // ← SSG
  }).then(r => r.json());
  return <Article post={post} />;
}

// SSR — user dashboard
async function DashboardPage() {
  const user = await fetch('/api/me', { cache: 'no-store' }).then(r => r.json()); // ← SSR
  return <Dashboard user={user} />;
}

// ISR + streaming — product page with streamed reviews
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetch(\`/api/products/\${params.id}\`, {
    next: { revalidate: 300 } // ISR — fresh every 5 min
  }).then(r => r.json());
  return (
    <div>
      <ProductDetails product={product} /> {/* rendered immediately */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsSection productId={params.id} /> {/* streams in */}
      </Suspense>
    </div>
  );
}` }]
  },

  {
    id: 'route-handlers', phase: 7, phaseName: 'Next.js Data',
    orderIndex: 66, estimatedMins: 20, prerequisites: ['what-is-nextjs', 'async-await'],
    title: 'Route Handlers (API Routes)',
    eli5: 'Route Handlers are server-side functions that respond to HTTP requests. They live inside your Next.js app and act as a mini API server — perfect for handling forms, webhooks, and authenticated requests.',
    analogy: 'Route Handlers are the restaurant\'s kitchen phone line. The dining room (browser) calls with an order; the kitchen (server) prepares and responds. Nobody eats in the kitchen.',
    explanation: 'Create `app/api/[path]/route.ts` — export named functions for HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`. They receive a `Request` object and return a `Response`. Used for: webhooks, file uploads, authenticated API calls, third-party service proxies.',
    technicalDeep: 'Route handler: `export async function GET(request: Request) { return Response.json({ data }) }`. Dynamic segments: `app/api/users/[id]/route.ts` → params in second argument: `(request, { params }: { params: { id: string } })`. `NextRequest` extends `Request` with helpers: `nextUrl.searchParams`, cookies, geo. `NextResponse` extends `Response`: `NextResponse.json()`, `NextResponse.redirect()`, `NextResponse.rewrite()`. Cookies: `request.cookies.get("token")`. Auth pattern: read the cookie/header, validate the session, return 401 if invalid. CORS: set headers in the Response. Caching: GET handlers are cached by default; `request.nextUrl.searchParams` or cookies opt them out. Edge runtime: add `export const runtime = "edge"` for low-latency, globally distributed handlers.',
    whatBreaks: 'Naming the file `api.ts` instead of `route.ts` — Next.js won\'t recognize it. Not returning a Response — handler returns undefined, Next.js sends 500. Using `GET` and `POST` in the same export — separate named function exports.',
    efficientWay: {
      title: 'API routes',
      approaches: [
        { name: 'Use Route Handlers for webhooks and auth-sensitive requests', verdict: 'best', reason: 'Keeps secrets server-side. Ideal for Stripe webhooks, OAuth callbacks, token refresh.' },
        { name: 'Server Actions instead of POST route handlers for form mutations', verdict: 'best', reason: 'Server Actions are simpler — no fetch in the client, works with progressive enhancement.' },
        { name: 'Build a full backend REST API as Next.js route handlers', verdict: 'ok', reason: 'Fine for small apps; for large APIs, a separate Node/Bun/Go backend is more maintainable.' }
      ],
      recommendation: 'Use Server Actions for mutations from forms. Use Route Handlers for: webhooks (Stripe, GitHub), OAuth callbacks, streaming responses, or when clients outside Next.js need to call your API.'
    },
    commonMistakes: ['File named api.ts instead of route.ts.', 'Forgetting to return a Response — causes 500.', 'Not validating the request body before processing — add Zod parsing.'],
    seniorNotes: 'Never call your own Next.js Route Handlers from Server Components or Server Actions — call the underlying service (database, external API) directly. Internal HTTP round-trips add latency and bypass all server-side optimization.',
    interviewQuestions: ['How do you create a Route Handler in Next.js App Router?', 'When should you use a Route Handler vs a Server Action?', 'How do you access URL parameters in a Route Handler?'],
    codeExamples: [{ lang: 'ts', label: 'Route Handler: GET + POST with auth', code: `// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createSchema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
});

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const user = await db.user.create({ data: parsed.data });
  return NextResponse.json(user, { status: 201 });
}` }]
  },

  {
    id: 'nextjs-middleware',
    phase: 7, phaseName: 'Next.js Data',
    orderIndex: 66.5, estimatedMins: 20, prerequisites: ['app-router', 'server-vs-client'],
    title: 'Next.js Middleware',
    eli5: 'Middleware is code that runs before every request reaches your page — like a security guard at the entrance. You can check ID (auth token), send people somewhere else (redirect), or stamp their badge (set headers) before they even get in.',
    analogy: 'Middleware is the airport security checkpoint — every passenger (request) goes through it before boarding (reaching the page). You can let them through, redirect to another gate, or stamp their passport (set headers).',
    explanation: 'Next.js Middleware runs at the Edge (globally, before the page loads) and can inspect every incoming request — checking auth cookies, redirecting, rewriting URLs, or setting response headers. It runs before any page renders, making it ideal for auth guards, A/B testing, and geolocation routing.',
    technicalDeep: 'File location: `middleware.ts` at the project root. `export function middleware(request: NextRequest) { ... }`. Runs in Edge Runtime — no Node.js APIs, no file system, no database calls. `NextResponse.redirect(new URL("/login", request.url))` — hard redirect. `NextResponse.rewrite(new URL("/us/dashboard", request.url))` — serve different content at same URL. `NextResponse.next()` — continue to the page. `matcher` config: `export const config = { matcher: ["/dashboard/:path*"] }` — critical for performance, skips static assets. Auth pattern: read cookie with `request.cookies.get("session")?.value`, verify JWT using `jose` (NOT `jsonwebtoken` — Node.js only). Geolocation: `request.geo?.country`. A/B testing: rewrite to different page based on a cookie value. Header injection: `const res = NextResponse.next(); res.headers.set("x-custom", "value"); return res`. Important: Middleware is a fast first-line guard, NOT a replacement for server-side auth checks — still verify auth in Server Components for sensitive data.',
    whatBreaks: 'Using Node.js APIs in middleware — it runs in Edge Runtime. Forgetting `matcher` — middleware runs on every `/_next/static/` request too, causing unnecessary overhead. Doing database queries in middleware — it\'s on the hot path of every single request.',
    efficientWay: {
      title: 'Middleware use cases',
      approaches: [
        { name: 'Auth redirect guard', verdict: 'best', reason: 'Redirect to login before the page even loads — no flash of protected content.' },
        { name: 'URL rewriting for i18n or A/B tests', verdict: 'best', reason: 'Transparent to the user, runs at global edge, zero added latency.' },
        { name: 'Complex business logic in middleware', verdict: 'weak', reason: 'Middleware is fast and lightweight by design — heavy logic belongs in route handlers or server actions.' }
      ],
      recommendation: 'Use middleware for: auth redirects, protecting route groups, header injection, simple A/B routing. For everything else, use Server Components or Route Handlers. Always add a `matcher` config.'
    },
    commonMistakes: [
      'Forgetting `matcher` — middleware then runs on static files too.',
      'Using Node.js-only packages like `jsonwebtoken` — use `jose` for JWT at edge.',
      'Doing DB calls in middleware — too slow for every request; use an edge KV store (Upstash) if caching is needed.'
    ],
    seniorNotes: 'Middleware runs in V8 Isolates at Vercel\'s global edge — ~1ms latency worldwide. This is why it\'s ideal for auth checks: the user is redirected before a backend even receives the request. The architectural rule: "middleware decides WHERE to route, server components decide WHAT to show." Never mix these concerns.',
    interviewQuestions: [
      'What is the difference between Next.js Middleware and a Route Handler?',
      'Why can\'t you use Node.js APIs in Next.js Middleware?',
      'How would you implement protected routes using Middleware?'
    ],
    codeExamples: [
      {
        lang: 'ts',
        label: 'Auth redirect middleware',
        code: `// middleware.ts (project root — NOT inside /app)
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // edge-compatible JWT

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next(); // verified — continue
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Only run on protected paths (skips static assets, public pages)
export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};` }
    ]
  },

  {
    id: 'server-actions', phase: 7, phaseName: 'Next.js Data',
    orderIndex: 67, estimatedMins: 25, prerequisites: ['server-vs-client', 'zod-rhf'],
    title: 'Server Actions',
    eli5: 'Server Actions are functions that run on the server but can be called from a form or button in a Client Component — without you writing an API route. Next.js handles the network call automatically.',
    analogy: 'A Server Action is a direct phone to the chef. You press a button (submit the form), Next.js dials the chef (server function), the chef cooks and updates the menu (database), and your table gets refreshed.',
    explanation: 'Server Actions are async functions marked with `"use server"`. They can be called from `<form action={action}>` or from Client Components as regular async functions. On call, Next.js POSTs to the server, runs the function, and returns the result — no manual fetch, no API route.',
    technicalDeep: '`"use server"` directive at the top of a function (inside a Server Component) or a file. Inline: `async function create(formData: FormData) { "use server"; ... }`. Separate file: add `"use server"` at the top, all exports are server actions. Form integration: `<form action={create}>` — works without JS (progressive enhancement). Client Component call: `<button onClick={() => create(data)}>` — or `useTransition` + `action` for pending state. `useFormState` (App Router) and `useFormStatus` track state. Validation: parse `formData.get("name")` or use Zod. Revalidation: call `revalidatePath("/users")` inside the action to update cached pages. `redirect()` inside an action navigates the user after success. Security: actions are POST endpoints — validate input (Zod), check auth, use CSRF protection (Next.js adds it automatically for same-origin forms).',
    whatBreaks: 'Returning non-serializable values from a Server Action — only JSON-serializable types cross the boundary. Calling `redirect()` inside a try/catch — it throws and the catch suppresses it.',
    efficientWay: {
      title: 'Server Actions',
      approaches: [
        { name: 'Server Actions for all form mutations', verdict: 'best', reason: 'No API route needed, works without JS, co-located with the form component.' },
        { name: 'Route Handlers for mutations from non-form sources (webhooks, scripts)', verdict: 'best', reason: 'Route Handlers are HTTP endpoints — any client can call them.' },
        { name: 'Client-side fetch to an API route for all mutations', verdict: 'ok', reason: 'More code, loses progressive enhancement, extra network round-trip.' }
      ],
      recommendation: 'Default to Server Actions for all mutations triggered by forms or buttons. Use Route Handlers for external webhooks and non-browser clients. Never fetch your own Route Handlers from Server Actions.'
    },
    commonMistakes: ['`redirect()` inside try/catch — catch block suppresses the throw redirect needs.', 'Not validating form data with Zod before using it.', 'Forgetting `revalidatePath` after a mutation — UI shows stale data.'],
    seniorNotes: 'Server Actions with `useOptimistic` enable optimistic UI updates that feel instant — update the UI immediately, revert if the action fails. This pattern matches React Query\'s optimistic update capability without client-side state management.',
    interviewQuestions: ['What is a Server Action and how is it different from a Route Handler?', 'How do you handle a Server Action\'s loading state in a Client Component?', 'Why can\'t you call redirect() inside a try/catch in a Server Action?'],
    codeExamples: [{ lang: 'tsx', label: 'Server Action: create user', code: `// actions/users.ts
'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(2), email: z.string().email() });

export async function createUser(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };

  await db.user.create({ data: parsed.data });
  revalidatePath('/users'); // invalidate the users list page
  redirect('/users');       // navigate after success
}

// components/CreateUserForm.tsx
'use client';
import { useFormStatus } from 'react-dom';
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Saving...' : 'Create'}</button>;
}

export function CreateUserForm() {
  return (
    <form action={createUser}>
      <input name="name"  placeholder="Name" />
      <input name="email" placeholder="Email" type="email" />
      <SubmitButton />
    </form>
  );
}` }]
  },

  {
    id: 'nextjs-runtimes',
    phase: 7, phaseName: 'Next.js Data',
    orderIndex: 67.5, estimatedMins: 15, prerequisites: ['server-vs-client', 'route-handlers', 'nextjs-middleware'],
    title: 'Node.js vs Edge Runtime',
    eli5: 'Next.js can run your server code in two environments: the full Node.js environment (all APIs, one region) or the lightweight Edge environment (limited APIs, runs everywhere worldwide in milliseconds). Choose based on what your code needs to do.',
    analogy: 'Node.js runtime is a full kitchen with every appliance — but only in one city. Edge runtime is a tiny kitchenette in every city in the world — instant service, but no oven, no heavy appliances.',
    explanation: 'Pages, route handlers, and middleware can declare which runtime they use. Node.js runtime has full access to all Node APIs, database clients, and the file system. Edge runtime is a V8 Isolate (no Node.js) — it starts faster, runs globally, and is cheaper, but can only use Web Platform APIs.',
    technicalDeep: '`export const runtime = "nodejs"` (default) or `export const runtime = "edge"`. Node.js runtime: full Node.js APIs, can connect to databases (Prisma, pg, mongoose), file system, native modules. Runs as a Serverless Function in one region. Cold starts: ~200ms-1s. Edge runtime: Web APIs only (fetch, crypto, URL, Headers, TextEncoder). No Node.js builtins (no `Buffer`, no `fs`, no `path`). Runs in V8 Isolates globally at all edge locations. Cold starts: ~0ms (always warm). Use cases — Edge: middleware, auth checks, A/B tests, geolocation routing, streaming responses. Node.js: database queries, file processing, libraries that require Node APIs. Choosing: default to Node.js, opt into Edge when latency matters AND you can write edge-compatible code. ORM compatibility: Prisma requires Node.js. Edge-compatible alternatives: Drizzle (with SQLite/D1/Turso), Kysely. Database via HTTP: PlanetScale/Neon/Turso all offer HTTP APIs usable at the edge.',
    whatBreaks: 'Importing `jsonwebtoken`, `bcrypt`, or `prisma` in an Edge route — these use Node.js APIs and throw at build or runtime. Not specifying runtime on a route that imports edge-incompatible packages.',
    efficientWay: {
      title: 'Runtime selection guide',
      approaches: [
        { name: 'Default to Node.js runtime', verdict: 'best', reason: 'No compatibility surprises; full ecosystem. Most apps don\'t need global edge compute.' },
        { name: 'Edge for middleware and latency-critical endpoints', verdict: 'best', reason: 'Auth redirects and geolocation routing should be global-edge fast.' },
        { name: 'Edge everywhere', verdict: 'ok', reason: 'Requires rethinking data access; worth it for truly global apps with edge KV stores.' }
      ],
      recommendation: 'Start with Node.js everywhere. Opt specific routes into Edge when: (1) it\'s middleware, (2) no DB connection needed, (3) latency is the primary concern. Use Drizzle + Turso or Neon HTTP adapter for DB access at the edge.'
    },
    commonMistakes: [
      'Importing Node.js packages in Edge routes — error at runtime or build time.',
      'Using Edge everywhere just because it sounds faster — the latency win disappears if you still hit a single-region DB.',
      'Not checking ORM/package compatibility before choosing Edge runtime.'
    ],
    seniorNotes: 'The Edge vs Node choice reflects a deeper architectural question: "where does the data live?" If your DB is in one region, making the API globally edge is pointless — the DB roundtrip still adds 200ms. Edge wins when the computation itself (auth check, redirect decision, personalization) is the bottleneck, and data lives in a global edge KV store (Upstash, Cloudflare KV) or isn\'t needed at all.',
    interviewQuestions: [
      'What are the limitations of the Edge runtime in Next.js?',
      'When would you choose Edge over Node.js runtime?',
      'Why can\'t Prisma run in the Edge runtime?'
    ],
    codeExamples: [
      {
        lang: 'ts',
        label: 'Explicit runtime declarations',
        code: `// app/api/geo/route.ts — geolocation, no DB needed → Edge
export const runtime = 'edge';

export function GET(request: Request) {
  const country = (request as any).geo?.country ?? 'US';
  return Response.json({ country, message: \`Hello from \${country}!\` });
}

// app/api/users/route.ts — database query → Node.js (default)
export const runtime = 'nodejs'; // explicit for clarity

import { db } from '@/lib/db'; // Prisma — requires Node.js
export async function GET() {
  const users = await db.user.findMany({ select: { id: true, name: true } });
  return Response.json(users);
}` }
    ]
  },

  /* â”€â”€ PHASE 8: Auth, Database & Production â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    id: 'nextauth', phase: 8, phaseName: 'Auth & Production',
    orderIndex: 68, estimatedMins: 30, prerequisites: ['route-handlers', 'server-actions'],
    title: 'Authentication with NextAuth.js (Auth.js)',
    eli5: 'NextAuth lets users sign in with their Google/GitHub account (or email+password) without you building the whole login system yourself. It handles the tokens, sessions, and security.',
    analogy: 'NextAuth is a complete doorbell system — camera, lock, intercom, and visitor log. You plug it in and it handles who gets in, who doesn\'t, and keeps a record.',
    explanation: 'Auth.js (v5, formerly NextAuth) supports 60+ OAuth providers, email magic links, and credentials (username/password). Session stored in a signed JWT cookie. App Router integration: single `auth.ts` config, middleware for route protection.',
    technicalDeep: 'Setup: `npm i next-auth@beta`. Create `auth.ts`: `import NextAuth from "next-auth"; import GitHub from "next-auth/providers/github"; export const { auth, handlers, signIn, signOut } = NextAuth({ providers: [GitHub] })`. Route handler: `app/api/auth/[...nextauth]/route.ts` — `export const { GET, POST } = handlers`. Session in Server Components: `const session = await auth()`. Middleware protection: `middleware.ts` — `export { auth as middleware } from "./auth"`. Callbacks: `jwt` callback to add user role to the token; `session` callback to expose it to the client. Database adapter: `@auth/prisma-adapter` — stores users, sessions, accounts in your DB. `signIn("github")` from a Client Component triggers OAuth flow. `signOut()` clears the session. `useSession()` from `next-auth/react` for Client Components. Credentials provider: hash passwords with bcrypt, validate in the `authorize` function.',
    whatBreaks: 'Missing `NEXTAUTH_SECRET` env var — Auth.js throws. OAuth callbacks blocked by wrong redirect URI in the provider dashboard. Accessing session in Server Components without `await` — `auth()` is async.',
    efficientWay: {
      title: 'Authentication setup',
      approaches: [
        { name: 'NextAuth (Auth.js) for OAuth + session management', verdict: 'best', reason: 'Handles 95% of auth use cases. JWT sessions by default, database sessions optionally.' },
        { name: 'Clerk (hosted auth service)', verdict: 'best', reason: 'Zero setup, great DX, handles user management UI — paid for production volume.' },
        { name: 'Build auth from scratch (JWT + bcrypt)', verdict: 'ok', reason: 'Good for learning; don\'t do it in production — too many security pitfalls.' }
      ],
      recommendation: 'NextAuth for most projects — free, self-hosted, widely used. Clerk for projects where user management UI and hosted auth justify the cost.'
    },
    commonMistakes: ['Missing AUTH_SECRET in production.', 'Not protecting routes in middleware — auth check in each page is error-prone.', 'Using JWT sessions when database sessions are needed for immediate revocation.'],
    seniorNotes: 'Middleware-based route protection is essential: `matcher: ["/dashboard/:path*", "/api/:path*"]` in middleware.ts protects all matching routes in one place. Per-page auth checks create gaps. Protect at the edge, not in each page.',
    interviewQuestions: ['What is the difference between JWT sessions and database sessions in NextAuth?', 'How do you protect routes globally in Next.js with Auth.js?', 'How do you add a custom field (like user role) to the session?'],
    codeExamples: [{ lang: 'ts', label: 'Auth.js setup with GitHub + middleware', code: `// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [GitHub],
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role; // add role from DB
      return session;
    },
  },
});

// middleware.ts — protect all dashboard + api routes
export { auth as middleware } from './auth';
export const config = { matcher: ['/dashboard/:path*', '/api/:path*'] };

// Server Component — read session
async function Page() {
  const session = await auth();
  if (!session) redirect('/login');
  return <h1>Hello {session.user.name}</h1>;
}

// Client Component — sign in button
'use client';
import { signIn, signOut } from 'next-auth/react';
<button onClick={() => signIn('github')}>Sign in with GitHub</button>
<button onClick={() => signOut()}>Sign out</button>` }]
  },

  {
    id: 'prisma-database', phase: 8, phaseName: 'Auth & Production',
    orderIndex: 69, estimatedMins: 25, prerequisites: ['server-actions', 'ts-types-interfaces'],
    title: 'Prisma ORM & Database',
    eli5: 'Prisma lets you talk to a database using TypeScript instead of raw SQL. You define your data shape in a schema file, and Prisma generates typed functions for reading and writing data.',
    analogy: 'Prisma is an interpreter between you and the database. You speak TypeScript; Prisma translates to the database\'s language (SQL) and brings back typed results.',
    explanation: 'Prisma ORM: define models in `schema.prisma` → generate a typed client → use `db.user.findMany()` etc. in Server Components and Server Actions. Works with PostgreSQL, MySQL, SQLite, MongoDB. Recommended database hosts: Neon (Postgres serverless), PlanetScale (MySQL serverless), Supabase.',
    technicalDeep: 'Prisma setup: `npm i prisma @prisma/client`. `npx prisma init`. Define schema: `model User { id String @id @default(cuid()) name String email String @unique posts Post[] }`. Generate client: `npx prisma generate`. Migrations: `npx prisma migrate dev --name add-user-model` — creates migration SQL and applies it. Prisma Client: singleton pattern for serverless environments: `const globalForPrisma = global as unknown as { prisma: PrismaClient }; export const db = globalForPrisma.prisma ?? new PrismaClient(); if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db`. Query types: `findUnique`, `findMany`, `create`, `update`, `upsert`, `delete`. Relations: `include: { posts: true }`, `select: { id: true, name: true }`. Transactions: `db.$transaction([...])`. Prisma Accelerate: connection pooling for serverless (Neon provides this natively).',
    whatBreaks: 'Creating a new PrismaClient instance on every request in serverless — each lambda gets a new connection, exhausting the DB connection pool. Use the global singleton. Forgetting `npx prisma generate` after schema changes — client is out of date.',
    efficientWay: {
      title: 'Database with Prisma',
      approaches: [
        { name: 'Prisma + Neon (serverless Postgres)', verdict: 'best', reason: 'Typed queries, migration management, and serverless-compatible free tier — perfect for Next.js.' },
        { name: 'Drizzle ORM (SQL-first alternative)', verdict: 'best', reason: 'Lighter, closer to SQL, faster queries — growing in popularity alongside Prisma.' },
        { name: 'Raw SQL with pg/mysql2', verdict: 'ok', reason: 'Teaches SQL fundamentals; not type-safe, harder to maintain at scale.' }
      ],
      recommendation: 'Prisma for teams and projects with complex relations. Drizzle for performance-critical or SQL-heavy projects. Use Neon or PlanetScale as the database host for serverless Next.js.'
    },
    commonMistakes: ['New PrismaClient per request in serverless — connection pool exhausted.', 'Forgetting `npx prisma generate` after schema update.', 'Not running migrations in production — `npx prisma migrate deploy` (not `dev`) for production.'],
    seniorNotes: 'Prisma Migrate\'s shadow database pattern: every migration runs against a shadow copy to verify it\'s safe before touching the real database. In production, `migrate deploy` applies pending migrations without the shadow DB — suitable for CI/CD.',
    interviewQuestions: ['Why do you need a Prisma Client singleton in a serverless environment?', 'What is the difference between prisma migrate dev and prisma migrate deploy?', 'How do you query related data in Prisma?'],
    codeExamples: [{ lang: 'ts', label: 'Prisma setup and queries', code: `// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}
model Post {
  id        String   @id @default(cuid())
  title     String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}

// lib/db.ts — singleton for serverless
import { PrismaClient } from '@prisma/client';
const g = global as unknown as { prisma?: PrismaClient };
export const db = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') g.prisma = db;

// Server Action using Prisma
async function getUser(id: string) {
  return db.user.findUnique({
    where: { id },
    include: { posts: { where: { published: true }, orderBy: { createdAt: 'desc' } } },
    select: { id: true, name: true, email: true, posts: true },
  });
}` }]
  },

  {
    id: 'deployment-production', phase: 8, phaseName: 'Auth & Production',
    orderIndex: 70, estimatedMins: 25, prerequisites: ['what-is-nextjs'],
    title: 'Deployment, Performance & Production Checklist',
    eli5: 'Deploying to Vercel is as simple as connecting your GitHub repo. Vercel runs your Next.js app, handles scaling, and gives you a URL. Before deploying, you should check images, fonts, security headers, and environment variables.',
    analogy: 'Deploying is like opening a restaurant to the public. Vercel is the building (infrastructure). Your environment variables are the staff training manual. The production checklist is the health inspector\'s visit before opening day.',
    explanation: 'Vercel is the natural Next.js host — zero-config deployment, automatic edge optimization. The production checklist covers: environment variables, security headers, error monitoring, Core Web Vitals, and bundle size.',
    technicalDeep: 'Vercel deployment: connect GitHub repo → automatic CI/CD on every push. Preview deployments on every PR. Environment variables: add in Vercel dashboard, never commit `.env.local`. Security headers: add in `next.config.js` `headers()` function — Content-Security-Policy, X-Frame-Options, X-Content-Type-Options. CSP is the most impactful security header. Bundle analysis: `npm i @next/bundle-analyzer`. `ANALYZE=true npm run build` — opens a treemap of chunk sizes. Web Vitals monitoring: `npm i web-vitals` + `export function reportWebVitals(metric)` in layout — send to analytics. Sentry: `npm i @sentry/nextjs; npx @sentry/wizard@latest -i nextjs` — captures unhandled errors and performance traces. `next.config.js` optimizations: `compress: true` (gzip), `poweredByHeader: false` (remove X-Powered-By), `images.formats: ["image/avif", "image/webp"]`. Rate limiting: use Upstash Redis + `@upstash/ratelimit` in Middleware for API routes.',
    whatBreaks: 'Missing environment variables in Vercel — `undefined` in production, hard to debug. Missing `NEXTAUTH_SECRET` — auth fails silently. Open CORS headers on all origins — security vulnerability.',
    efficientWay: {
      title: 'Production deployment',
      approaches: [
        { name: 'Vercel for Next.js (official host)', verdict: 'best', reason: 'Zero configuration, automatic edge optimization, preview deployments, analytics.' },
        { name: 'Netlify', verdict: 'best', reason: 'Good alternative — slightly less Next.js-specific optimization.' },
        { name: 'Self-hosted with Docker', verdict: 'ok', reason: 'More control, more ops work — necessary if data residency requirements exist.' }
      ],
      recommendation: 'Deploy to Vercel for every project. Run Lighthouse in CI (`lighthouse-ci`) to catch performance regressions before they ship. Add Sentry on day one — production errors are invisible without it.'
    },
    commonMistakes: ['Not setting environment variables in Vercel dashboard.', 'Committing .env.local to git — use .gitignore and check with `git status`.', 'No error monitoring — bugs in production are invisible without Sentry.'],
    seniorNotes: 'Vercel\'s Edge Middleware (running in V8 Isolates globally) executes in ~1ms worldwide — it\'s where auth checks, A/B testing, and geo-routing should live. Database queries must never run in Edge Middleware — use it for lightweight decisions that route to the right regional compute.',
    interviewQuestions: ['What is the difference between Vercel\'s Serverless Functions and Edge Functions?', 'How do you prevent environment variables from being exposed to the client?', 'What are Core Web Vitals and which ones does Next.js help with?'],
    codeExamples: [{ lang: 'ts', label: 'next.config.js production settings', code: `// next.config.js
const securityHeaders = [
  { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy',        value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy',     value: 'camera=(), microphone=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};
module.exports = nextConfig;` }]
  },


]

export const REACT_CURRICULUM: CurriculumTopic[] = weaveTopics(
  REACT_CURRICULUM_BASE,
  REACT_EXTRA_TOPICS,
  {
    'react-realtime': 'data-fetching-patterns',
    'react-accessibility': 'shadcn-ui',
    'react-i18n': 'react-ecosystem-tools',
  },
)
