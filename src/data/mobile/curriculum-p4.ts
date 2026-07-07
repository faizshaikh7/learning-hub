import type { CurriculumTopic } from '@/types'

/** Mobile Development — Phase 4: State, Data & Local Storage (concept-first, framework-agnostic). */
export const MOBILE_P4: CurriculumTopic[] = [
  {
    "id": "state-types",
    "phase": 4,
    "phaseName": "State, Data & Local Storage",
    "orderIndex": 1,
    "estimatedMins": 30,
    "prerequisites": [],
    "title": "State: UI vs App vs Persisted",
    "eli5": "Some things your app remembers only while a screen is open (like whether a menu is expanded). Some things it remembers while the app is running (like who is logged in). And some things it must remember even after you close and reopen the app (like your saved notes). Those are three different kinds of memory.",
    "analogy": "Think of a whiteboard, a notebook, and a filing cabinet. The whiteboard (UI state) is wiped when you leave the room. The notebook (app state) you carry around the building all day but it is gone when you go home. The filing cabinet (persisted state) keeps everything until you deliberately remove it.",
    "explanation": "Every mobile app juggles three tiers of state. UI (view) state is ephemeral: scroll position, whether a field is focused, an animation frame. It belongs to a single screen and can be recreated. App state is shared across screens for the current session: the logged-in user, a shopping cart, a feature flag. Persisted state must survive process death and restarts: preferences, cached data, offline records. Choosing the wrong tier is the root of most mobile state bugs — either you lose data you needed to keep, or you keep data that should have been thrown away.\n\nAndroid vs iOS: On Android, UI state is often held in a ViewModel that survives configuration changes (rotation) but not process death, while truly persisted state goes to DataStore or a Room database; the system can kill your process at any time and restore it via saved instance state. On iOS, ephemeral view state lives in @State/@StateObject, session state in an ObservableObject or the app's environment, and persisted state in UserDefaults or Core Data; iOS also snapshots and restores scenes, but backgrounded apps can still be terminated under memory pressure.",
    "technicalDeep": "The critical distinction is lifecycle scope. UI state is bound to a view's lifetime and should be derived or trivially reconstructable. App state is bound to the process/session and is the source of truth for cross-screen coordination. Persisted state is bound to durable storage and is the only tier guaranteed to survive process death. A common architecture rule: never store in a higher (more durable) tier than necessary, and always be able to rebuild lower tiers from higher ones. Process death is the sharp edge — mobile OSes reclaim backgrounded app memory aggressively, so anything only in RAM (UI or app state) can vanish. You defend against this by saving a minimal restoration key (a scroll index, a selected id) to a survivable bundle, not the whole object graph.\n\nAndroid vs iOS: Android exposes this explicitly through onSaveInstanceState (a small Bundle for UI state that survives process death) versus ViewModel (survives rotation only). iOS uses state restoration via NSUserActivity / scene restoration and, in SwiftUI, @SceneStorage for small per-scene values versus @AppStorage which writes through to UserDefaults. Both platforms punish you for putting large objects in the restoration path — keep it to identifiers and reload the rest.",
    "whatBreaks": "Rotating the device or getting a phone call wipes UI state that was not saved, so the user loses their half-typed form. Storing a huge object in the restoration bundle throws a TransactionTooLarge-style error or silently drops data. Treating app state as persisted means the cart is empty after the OS kills the backgrounded app. Treating persisted state as app-only means a setting resets every launch. Leaking session state (like an auth token) into persisted storage without encryption is a security hole.",
    "efficientWay": {
      "title": "Placing state in the right tier",
      "approaches": [
        {
          "name": "Classify each piece of state by required lifetime, store at the lowest sufficient tier, rebuild downward",
          "verdict": "best",
          "reason": "Minimizes what must survive process death, keeps restoration cheap, and makes the source of truth obvious."
        },
        {
          "name": "Keep everything in an in-memory app-wide store and hope the process stays alive",
          "verdict": "ok",
          "reason": "Simple and fine for short sessions, but loses data on the routine background kill that mobile OSes perform."
        },
        {
          "name": "Persist every field to disk immediately, including ephemeral UI state",
          "verdict": "weak",
          "reason": "Wastes I/O, bloats storage, complicates migrations, and creates stale data that outlives its usefulness."
        }
      ],
      "recommendation": "Default UI state to ephemeral holders, promote to a survivable restoration key only when losing it hurts the user, and reserve disk persistence for data that genuinely must outlive the process. When unsure, ask: if the OS kills this app right now, must the user get this back?"
    },
    "commonMistakes": [
      "Assuming a backgrounded app keeps running and its memory intact — mobile OSes routinely kill it",
      "Putting large objects (bitmaps, lists) into the save-instance-state / scene-restoration path instead of an id",
      "Confusing survives-rotation with survives-process-death; a ViewModel does the former, not the latter",
      "Persisting sensitive session tokens in plaintext preferences instead of secure storage"
    ],
    "seniorNotes": "Draw the state tiers explicitly in design docs; most mid-level bugs are a piece of state sitting in the wrong tier. Model persisted state as the source of truth and treat UI/app state as caches derived from it — this makes offline-first and process-death handling fall out naturally. Test restoration by enabling Don't Keep Activities on Android and forcing scene termination on iOS; if the app can't rebuild from cold, the state design is wrong.",
    "interviewQuestions": [
      "What is the difference between UI state, app state, and persisted state, and how do you decide where a given value lives?",
      "What is process death on mobile and how does it change how you store state?",
      "Why does surviving a screen rotation not guarantee surviving a background kill?"
    ],
    "interviewAnswers": [
      "UI state is ephemeral and screen-scoped (scroll, focus, animation) and can be recreated. App state is session-scoped and shared across screens (current user, cart). Persisted state must survive restart and lives on disk. I decide by asking the required lifetime: pick the lowest tier that still guarantees the value survives long enough, and rebuild lower tiers from higher ones so the source of truth is unambiguous.",
      "Process death is the OS reclaiming a backgrounded app's process to free memory; the app is fully terminated but the user expects to return to where they left off. It means anything held only in RAM is gone, so I must save a minimal restoration key to durable storage and reload the rest, rather than assuming in-memory state persists.",
      "Rotation is a configuration change handled within the live process — holders scoped to survive configuration changes keep their data. A background kill destroys the whole process and its memory, so only values written to a survivable bundle or disk come back. They are different lifecycles, so surviving one says nothing about the other."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Classifying state by tier (pseudocode)",
        "code": "// UI state: recreate freely, scoped to the screen\nuiState = {\n  isMenuExpanded: false,\n  scrollIndex: 0,\n  focusedField: null\n}\n\n// App/session state: shared across screens, lost on process death\nappState = {\n  currentUser: User(id, name),\n  cart: [ItemRef(id), ItemRef(id)]\n}\n\n// Persisted state: source of truth, survives restart\npersisted = {\n  db: LocalDatabase(),      // notes, cached feed\n  prefs: KeyValueStore()    // theme, lastOpenedTab\n}\n\n// On process death, save only restoration keys:\nonSaveRestoration():\n  save('scrollIndex', uiState.scrollIndex)\n  save('selectedItemId', appState.selectedId)\n  // NOT the whole User or the whole list — reload those from persisted"
      }
    ],
    "resources": [
      {
        "label": "Android: Data and file storage overview",
        "url": "https://developer.android.com/training/data-storage",
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
    "id": "state-management-concepts",
    "phase": 4,
    "phaseName": "State, Data & Local Storage",
    "orderIndex": 2,
    "estimatedMins": 35,
    "prerequisites": [
      "state-types"
    ],
    "title": "State Management & Unidirectional Data Flow",
    "eli5": "Imagine one master to-do list that everyone reads from, and the only way to change it is to hand a note to one person who updates it. Nobody scribbles on their own copy. That way everyone always sees the same, correct list, and you always know who changed what.",
    "analogy": "It is like a restaurant kitchen with a single order screen. Waiters submit orders (actions) to one queue, the kitchen updates the one screen (state), and every waiter reads the same screen. Chaos happens when each waiter keeps a private list and they drift out of sync.",
    "explanation": "State management is how you keep the many pieces of your UI agreeing about what is true. The dominant idea is a single source of truth: one authoritative store holds the state, the UI observes it and re-renders when it changes, and changes flow one direction — events go in, new state comes out, the UI reflects it. This is unidirectional data flow (UDF). Because the UI never mutates state directly, you get predictability: given the same state you get the same screen, and every change is traceable to an event. This concept underlies Redux, BLoC, MVI, and ViewModel-based architectures alike.\n\nAndroid vs iOS: On Android, the common shape is a ViewModel exposing observable state (LiveData or a StateFlow) that the UI collects; events call ViewModel functions which produce a new immutable state. Jetpack Compose leans hard into UDF with state hoisting. On iOS, SwiftUI's @Observable / ObservableObject publishes state and the view re-renders on change; The Composable Architecture (TCA) and MVI-style setups formalize the reducer/action loop. Both platforms converge on observe-state, dispatch-events, render.",
    "technicalDeep": "UDF has three moving parts: state (an immutable snapshot), events/actions (intents to change), and a reducer/handler (a pure function state + event => new state). Observability is what makes it feel automatic — the store notifies subscribers on change, and the diffing layer re-renders only what differs. Keeping state immutable is what makes it safe: you replace the whole snapshot rather than mutating in place, so subscribers can compare old vs new by reference and you avoid torn reads across threads. Side effects (network, disk) are pushed to the edges — the reducer stays pure, and effects are dispatched and their results fed back in as new events. This is why UDF scales: debugging becomes replaying a list of events, and time-travel/undo become trivial.\n\nAndroid vs iOS: Android's StateFlow is a hot, conflated stream that always has a current value and drops intermediate states to the latest — ideal for UI state; you collect it lifecycle-aware so you don't leak or update a dead view. iOS's Combine/@Observable publishes on change and SwiftUI recomputes the view body; effects in TCA run through an Effect type that funnels async results back as actions. The shared risk on both is doing effects inside the reducer, which breaks purity and testability.",
    "whatBreaks": "Multiple sources of truth drift apart — one screen shows the item as favorited, another does not. Mutating shared state directly causes race conditions and missed re-renders because subscribers never learn it changed. Deriving state incorrectly (storing something you should compute) leads to stale, contradictory values. Emitting a new state object on every keystroke without conflation can flood the UI. Doing network/disk work inside the reducer makes state transitions non-deterministic and untestable.",
    "efficientWay": {
      "title": "Structuring app state flow",
      "approaches": [
        {
          "name": "Single source of truth with immutable state, UDF, and side effects at the edges",
          "verdict": "best",
          "reason": "Predictable, testable, debuggable via event replay, and safe across threads because snapshots are replaced not mutated."
        },
        {
          "name": "Local component state with prop/callback passing, lifted only when shared",
          "verdict": "ok",
          "reason": "Perfect for small or leaf UI, but sharing across many distant screens gets awkward and error-prone as the app grows."
        },
        {
          "name": "Global mutable singletons that any code can read and write",
          "verdict": "weak",
          "reason": "No traceability, hidden coupling, race conditions, and missed re-renders; the classic source of 'works on my screen' bugs."
        }
      ],
      "recommendation": "Adopt one source of truth per domain with unidirectional flow and immutable snapshots. Keep reducers pure and push effects out. Start with local state for isolated widgets and hoist to a shared store only when multiple screens must agree."
    },
    "commonMistakes": [
      "Keeping the same fact in two stores and manually syncing them instead of one source of truth",
      "Mutating state objects in place so observers never get notified of the change",
      "Storing derivable values (like a filtered list) instead of computing them from base state",
      "Running network or database calls inside the reducer, breaking purity and testability"
    ],
    "seniorNotes": "The pattern name (Redux, BLoC, MVI, TCA) matters far less than the invariants: one source of truth, immutable state, events in / state out, effects at the edges. Interviewers probe whether you understand why UDF works, not which library you memorized. Watch for over-centralization — not every checkbox needs to live in a global store; excessive hoisting couples unrelated features and causes needless recomposition. The senior skill is choosing the right scope for each store.",
    "interviewQuestions": [
      "What is unidirectional data flow and why does it make apps more predictable?",
      "Why is immutability important in state management, and what breaks without it?",
      "Where should side effects like network calls live in a UDF architecture, and why not in the reducer?"
    ],
    "interviewAnswers": [
      "UDF means data moves in one direction: the UI dispatches events, a pure handler produces a new state snapshot, and the UI observes and renders it. Because the UI never mutates state directly, the same state always yields the same screen and every change is traceable to an event. That determinism is what makes the app predictable, debuggable via event replay, and easy to test.",
      "Immutability means each change produces a new snapshot rather than editing the existing one. Observers can then detect change by reference comparison, you avoid torn reads when multiple threads touch state, and you can keep history for undo or time-travel. Without it, in-place mutation means subscribers may never learn state changed, causing missed re-renders and race conditions.",
      "Side effects belong at the edges — in an effect handler or middleware — not in the reducer. The reducer must stay a pure function of state and event so transitions are deterministic and unit-testable. Effects are dispatched, run asynchronously, and their results feed back in as new events, keeping the core state machine pure while still doing real I/O."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Unidirectional data flow loop (pseudocode)",
        "code": "// Single source of truth\nstate = { items: [], isLoading: false }\n\n// Events describe intent, not mutation\nevent LoadItems\nevent ItemsLoaded(list)\n\n// Pure reducer: state + event => new state (no I/O here)\nreduce(state, event):\n  match event:\n    LoadItems      -> copy(state, isLoading = true)\n    ItemsLoaded(l) -> copy(state, items = l, isLoading = false)\n\n// Effects live at the edge\nonEvent(LoadItems):\n  dispatch(reduce)                 // flip isLoading\n  result = api.fetchItems()        // side effect, outside reducer\n  dispatch(ItemsLoaded(result))    // feed result back as an event\n\n// UI observes state and re-renders on change\nrender(state):\n  if state.isLoading: showSpinner()\n  else: showList(state.items)"
      },
      {
        "lang": "kotlin",
        "label": "Observable state with StateFlow (Android example)",
        "code": "class FeedViewModel(private val repo: FeedRepo) : ViewModel() {\n    private val _state = MutableStateFlow(FeedState(isLoading = true))\n    val state: StateFlow<FeedState> = _state.asStateFlow()\n\n    fun load() {\n        _state.value = _state.value.copy(isLoading = true)\n        viewModelScope.launch {              // side effect at the edge\n            val items = repo.fetchItems()\n            _state.value = FeedState(items = items, isLoading = false)\n        }\n    }\n}\n// UI collects state lifecycle-aware and renders; it never mutates it directly."
      }
    ],
    "resources": [
      {
        "label": "roadmap.sh: Android developer roadmap",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      },
      {
        "label": "Android: Data and file storage overview",
        "url": "https://developer.android.com/training/data-storage",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "keyvalue-file-storage",
    "phase": 4,
    "phaseName": "State, Data & Local Storage",
    "orderIndex": 3,
    "estimatedMins": 30,
    "prerequisites": [
      "state-types"
    ],
    "title": "Key-Value & File Storage",
    "eli5": "Some things are tiny, like which color theme you picked — you just jot them on a sticky note. Other things are bigger, like a downloaded picture — you put those in a folder. Your app has a sticky-note store for small settings and a private folder for files.",
    "analogy": "Key-value storage is a coat-check counter: you hand over a small item, get a ticket (the key), and grab it back instantly by ticket. File storage is your own locker room: bigger stuff, organized in folders, and only you have the key to your lockers.",
    "explanation": "Not all local data deserves a database. Small, simple values — a theme choice, the last opened tab, a boolean flag — fit a key-value store: you write value-by-key and read it back fast. Larger blobs — images, downloaded documents, exported files — go to the file system in your app's private directory. The two are different tools: key-value for structured small settings, files for bytes. Both live in app-private storage that other apps can't read, which is the default sandbox on mobile.\n\nAndroid vs iOS: Android historically used SharedPreferences (a synchronous XML-backed key-value store) and now recommends DataStore, an asynchronous, coroutine/Flow-based replacement that avoids the main-thread and consistency problems of SharedPreferences; files go to the app-specific internal storage (filesDir) or cache dir. iOS uses UserDefaults for small key-value settings (backed by a plist) and writes files into the app sandbox's Documents (backed up, user data) or Caches (purgeable) directories. On both platforms, key-value stores are the wrong home for large or sensitive data.",
    "technicalDeep": "Key-value stores optimize for tiny, frequently read values and typically keep the whole set in memory, flushing to disk on change. That is why writing large blobs to them is an anti-pattern — you bloat memory and serialize the entire file on every commit. File storage gives you control over layout, streaming, and lifecycle: choose the right directory (persistent user data vs purgeable cache), because the OS can delete the cache directory under storage pressure without warning. Threading matters: key-value reads that block the main thread cause jank, which is exactly why modern APIs are async. For anything sensitive (tokens, keys), neither plain key-value nor plain files are enough — you need the platform's encrypted/keystore-backed storage.\n\nAndroid vs iOS: DataStore returns a Flow you collect off the main thread and handles consistency/transactionality, unlike SharedPreferences whose apply() writes asynchronously but whose in-memory commit is synchronous. iOS UserDefaults is fine for small values but has no encryption; secrets go to the Keychain. For file lifecycle, iOS distinguishes Documents (backed up to iCloud, counts against user data) from Caches and tmp (evictable); Android distinguishes internal filesDir (persistent, private) from cacheDir (evictable) and external/scoped storage for shared media.",
    "whatBreaks": "Storing large JSON or images in key-value preferences bloats memory and causes slow, blocking writes. Reading SharedPreferences on the main thread janks the UI on first access. Putting must-keep files in the cache directory means the OS silently deletes them under storage pressure. Writing secrets (auth tokens) to plain preferences or files exposes them on rooted/jailbroken devices or via backups. Assuming key-value writes are instantly durable can lose the last write if the process dies before flush.",
    "efficientWay": {
      "title": "Choosing local storage for small data",
      "approaches": [
        {
          "name": "Async key-value store for small settings, file system for blobs, keystore for secrets",
          "verdict": "best",
          "reason": "Each data type lands in the right home: fast reads for settings, streaming for files, encryption for secrets, no main-thread blocking."
        },
        {
          "name": "Synchronous key-value store for everything small-ish, accessed on demand",
          "verdict": "ok",
          "reason": "Simple and works for genuinely tiny settings, but risks main-thread jank and tempts you to overstuff it as data grows."
        },
        {
          "name": "One giant serialized blob in a single preferences key",
          "verdict": "weak",
          "reason": "Every tiny change rewrites the whole blob, memory balloons, and a partial write can corrupt all your settings at once."
        }
      ],
      "recommendation": "Reach for an asynchronous key-value store for small, discrete settings; write files to the correct persistent-vs-cache directory; and route anything sensitive through the platform keystore/keychain. Keep key-value entries small and structured, never a dumping ground."
    },
    "commonMistakes": [
      "Serializing large objects or images into a single preferences key instead of using files",
      "Reading a synchronous key-value store on the main thread and causing UI jank",
      "Saving must-keep files to the purgeable cache directory that the OS can delete",
      "Storing tokens or personal data in plaintext preferences instead of the keystore/keychain"
    ],
    "seniorNotes": "Treat key-value storage as a settings bag, not a database — the moment you have relationships, queries, or lists that grow, move to a real local DB. Know the durability semantics: most key-value writes are eventually flushed, so a crash can lose the very last write; if that matters, use a store with transactional guarantees. Be deliberate about backup: on iOS the Documents directory gets backed up to iCloud (and secrets must be excluded), and on Android auto-backup can ship preferences to the cloud unless you exclude them. Directory choice is a lifecycle decision, not a convenience.",
    "interviewQuestions": [
      "When would you use a key-value store versus writing to a file versus a local database?",
      "Why is writing large data to preferences (SharedPreferences/UserDefaults) a bad idea?",
      "Where should sensitive values like auth tokens be stored on mobile, and why not in preferences?"
    ],
    "interviewAnswers": [
      "Key-value stores are for small, discrete settings read by key — theme, flags, last-tab. Files are for byte blobs like images or documents where I need streaming and directory lifecycle control. A local database is for structured, queryable, related data that grows or needs transactions. I pick by size, structure, and query needs: tiny and flat goes to key-value, bytes go to files, relational or growing goes to a DB.",
      "Preferences typically keep their whole dataset in memory and rewrite it on each commit, so a large value bloats memory and makes every write slow and blocking. It also loses the type-safety and query ability you'd want for structured data. Large data belongs in a file or database where you can stream and update incrementally instead of rewriting one giant blob.",
      "Sensitive values go in the platform-backed secure store — the Android Keystore-backed storage or the iOS Keychain — because those encrypt at rest and are protected by hardware-backed keys and device credentials. Plain preferences and files are readable on rooted/jailbroken devices and can leak into cloud backups, so putting tokens there exposes them."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Routing data to the right store (pseudocode)",
        "code": "// Small setting -> async key-value store\nprefs.set('themeMode', 'dark')          // fast, tiny\nlastTab = prefs.get('lastTab', default = 'home')\n\n// Blob -> app-private file, persistent vs cache chosen deliberately\nfile = filesDir + '/reports/2026-q3.pdf'   // must-keep -> persistent dir\nwriteBytes(file, pdfBytes)\nthumb = cacheDir + '/thumb_42.png'          // regenerable -> cache dir\n\n// Secret -> platform keystore/keychain, never plain prefs\nsecureStore.put('authToken', token)      // encrypted at rest\n\n// Anti-pattern (do NOT do this):\n// prefs.set('userProfileJson', bigJsonString)  // bloats memory, slow writes"
      },
      {
        "lang": "swift",
        "label": "UserDefaults for settings vs Keychain for secrets (iOS example)",
        "code": "// Small setting: fine in UserDefaults\nUserDefaults.standard.set(\"dark\", forKey: \"themeMode\")\nlet mode = UserDefaults.standard.string(forKey: \"themeMode\") ?? \"system\"\n\n// Secret: Keychain, not UserDefaults\nfunc saveToken(_ token: String) {\n    let query: [String: Any] = [\n        kSecClass as String: kSecClassGenericPassword,\n        kSecAttrAccount as String: \"authToken\",\n        kSecValueData as String: Data(token.utf8)\n    ]\n    SecItemDelete(query as CFDictionary)\n    SecItemAdd(query as CFDictionary, nil)   // encrypted at rest\n}"
      }
    ],
    "resources": [
      {
        "label": "Android: Data and file storage overview",
        "url": "https://developer.android.com/training/data-storage",
        "kind": "docs"
      },
      {
        "label": "Apple: Core Data (persistence framework)",
        "url": "https://developer.apple.com/documentation/coredata",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "local-databases",
    "phase": 4,
    "phaseName": "State, Data & Local Storage",
    "orderIndex": 4,
    "estimatedMins": 40,
    "prerequisites": [
      "keyvalue-file-storage"
    ],
    "title": "Local Databases (SQLite) & ORMs",
    "eli5": "When your app has lots of related information — like a contacts list with names, numbers, and groups — a sticky note won't do. You need a filing system that can find, sort, and connect things instantly. That filing system on your phone is a tiny database called SQLite, and an ORM is a helper that lets you talk to it in your own words instead of raw database language.",
    "analogy": "SQLite is a librarian who lives inside your app: no separate building (no server), instant answers, and a perfect catalog for finding any book by author, title, or shelf. An ORM is your assistant who translates 'give me all sci-fi books after 2020' into the librarian's exact request language for you.",
    "explanation": "Once local data has structure and relationships — lists, filters, sorting, joins — you want a real database. On mobile that almost always means SQLite: a fast, embedded, serverless SQL engine that ships with both platforms and stores everything in a single file. It gives you tables, indexes, transactions, and queries without running a separate process. An ORM (object-relational mapper) or query builder sits on top so you work with objects and typed queries instead of hand-writing SQL and mapping rows by hand. Because your schema evolves, migrations let you change tables across app versions without losing user data.\n\nAndroid vs iOS: Android's Room is an ORM over SQLite — you declare entities and DAO query methods, it generates the SQL and verifies queries at compile time, and it integrates with Flow/LiveData for observable reads. iOS offers Core Data (a mature object graph and persistence framework, often backed by SQLite) and the newer SwiftData, which wraps it with a modern Swift API; both manage objects, relationships, and migrations for you. Underneath the differing APIs, it is the same SQLite engine doing the heavy lifting on both platforms.",
    "technicalDeep": "SQLite is embedded and single-writer: reads can be concurrent, but writes serialize, and Write-Ahead Logging (WAL) mode lets readers proceed while a writer commits. Transactions are your correctness and performance lever — wrapping many inserts in one transaction turns thousands of fsyncs into one and keeps data consistent under crash. Indexes turn full-table scans into logarithmic lookups but cost write time and space, so you index the columns you filter/sort on, not everything. ORMs trade a little control for safety and speed of development: compile-time-checked queries, automatic row-to-object mapping, and relationship loading — but they can hide N+1 query patterns and generate suboptimal SQL, so you still read the emitted queries. Migrations must be forward-only and tested: each schema version needs a deterministic upgrade path, because users can jump several versions at once.\n\nAndroid vs iOS: Room verifies your SQL against the schema at compile time and forces you to provide Migration objects (or a destructive fallback) between versions; heavy queries must run off the main thread, which Room enforces. Core Data uses managed object contexts tied to threads/queues — you must not pass managed objects across threads, and it supports lightweight (automatic) migrations for simple schema changes and mapping models for complex ones. Both punish main-thread database work with UI jank and both need explicit migration strategies.",
    "whatBreaks": "Running queries on the main thread freezes the UI, especially on first launch when the DB warms up. Missing indexes make list screens slow as data grows, turning a snappy app sluggish at 10k rows. Doing thousands of inserts without a transaction is orders of magnitude slower and can corrupt on crash. A missing or wrong migration crashes the app on update or wipes user data via destructive fallback. N+1 queries from lazy relationship loading flood the DB with tiny queries. Passing managed objects across threads (Core Data) or ignoring WAL checkpointing can corrupt state or bloat the file.",
    "efficientWay": {
      "title": "Persisting structured local data",
      "approaches": [
        {
          "name": "SQLite via a typed ORM/query builder, off-main-thread, with indexes, transactions, and tested migrations",
          "verdict": "best",
          "reason": "Fast queries, safe schema evolution, compile-time-checked SQL, and no UI jank — the standard for structured local data at scale."
        },
        {
          "name": "Raw SQLite with hand-written SQL and manual row mapping",
          "verdict": "ok",
          "reason": "Maximum control and no ORM overhead, but tedious, error-prone mapping and easy to miss thread-safety and migration discipline."
        },
        {
          "name": "A pile of files or key-value entries emulating tables and joins",
          "verdict": "weak",
          "reason": "Reinvents a database badly: no indexes, no transactions, O(n) scans, and consistency bugs the moment relationships appear."
        }
      ],
      "recommendation": "Use SQLite through your platform's ORM (Room, Core Data/SwiftData). Keep all DB work off the main thread, index the columns you filter and sort on, batch writes in transactions, and treat every schema change as a tested, forward-only migration."
    },
    "commonMistakes": [
      "Executing queries on the main thread and freezing the UI, especially during cold start",
      "Forgetting indexes on filtered/sorted columns so screens degrade as the dataset grows",
      "Inserting many rows without wrapping them in a single transaction",
      "Shipping a schema change without a tested migration (or relying on destructive fallback that wipes data)"
    ],
    "seniorNotes": "The database file is your most valuable local asset — losing it via a botched migration is a data-loss incident, so migrations get the same rigor as production DB changes: versioned, tested against real old-version data, and reversible in plan if not in code. Watch WAL: it improves concurrency but the -wal file grows until checkpointed, and copying just the main DB file without checkpointing loses recent writes. Read the SQL your ORM emits — the abstraction hides N+1s and full scans that only appear at scale. Model the local DB as the offline source of truth so the network becomes a sync detail rather than a hard dependency.",
    "interviewQuestions": [
      "Why is SQLite the default for local databases on mobile, and what does 'embedded/serverless' mean here?",
      "What is a database migration and why must you test it against real old data?",
      "How do indexes and transactions each affect local database performance, and what are their trade-offs?"
    ],
    "interviewAnswers": [
      "SQLite is a self-contained SQL engine that runs inside your app process and stores the whole database in one file — no separate server to install, connect to, or keep alive. That fits mobile perfectly: zero-config, low overhead, transactional, and it ships on both platforms. Embedded/serverless means the query engine is a library linked into your app rather than a daemon you talk to over a socket, so reads and writes are just local function calls on a file.",
      "A migration is the code that transforms the database schema from one app version to the next while preserving user data — adding columns, tables, or reshaping data. You test it against real old-version data because users can update from any prior version, sometimes skipping several, and an untested migration can crash on launch or silently drop data. Testing proves the upgrade path is deterministic and lossless.",
      "Indexes speed up reads by letting the engine find rows via a sorted structure instead of scanning the whole table, turning list/filter queries from O(n) to roughly O(log n); the trade-off is extra disk space and slower writes since each index must be updated. Transactions batch many writes into one atomic, durable commit — hugely faster than committing each row and safe under crash; the trade-off is holding a write lock, so you keep transactions focused rather than long-lived."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Schema, indexed query, batched write, migration (pseudocode)",
        "code": "// Schema with an index on the column we filter/sort by\ntable Note(id PK, folderId, title, updatedAt)\nindex idx_note_folder on Note(folderId, updatedAt desc)\n\n// Query runs OFF the main thread, uses the index\nasync getNotes(folderId):\n  return db.query(\n    'SELECT * FROM Note WHERE folderId = ? ORDER BY updatedAt DESC',\n    [folderId])\n\n// Batch insert in ONE transaction (fast + crash-safe)\nasync importNotes(list):\n  db.transaction(tx =>\n    for note in list: tx.insert('Note', note))   // one commit, not N\n\n// Forward-only migration between schema versions\nmigration v3 -> v4:\n  'ALTER TABLE Note ADD COLUMN pinned INTEGER NOT NULL DEFAULT 0'"
      },
      {
        "lang": "kotlin",
        "label": "Room entity, DAO, and observable query (Android example)",
        "code": "@Entity(indices = [Index(value = [\"folderId\", \"updatedAt\"])])\ndata class Note(\n    @PrimaryKey val id: String,\n    val folderId: String,\n    val title: String,\n    val updatedAt: Long\n)\n\n@Dao\ninterface NoteDao {\n    // Verified against the schema at compile time; returns off-main-thread\n    @Query(\"SELECT * FROM Note WHERE folderId = :fid ORDER BY updatedAt DESC\")\n    fun notesIn(fid: String): Flow<List<Note>>   // observable\n\n    @Insert\n    suspend fun insertAll(notes: List<Note>)     // suspend = off main thread\n}"
      }
    ],
    "resources": [
      {
        "label": "Android: Save data in a local database using Room",
        "url": "https://developer.android.com/training/data-storage/room",
        "kind": "docs"
      },
      {
        "label": "Apple: Core Data",
        "url": "https://developer.apple.com/documentation/coredata",
        "kind": "docs"
      },
      {
        "label": "Android: Data and file storage overview",
        "url": "https://developer.android.com/training/data-storage",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "caching-strategies-mobile",
    "phase": 4,
    "phaseName": "State, Data & Local Storage",
    "orderIndex": 5,
    "estimatedMins": 35,
    "prerequisites": [
      "local-databases"
    ],
    "title": "Caching Strategies & Invalidation",
    "eli5": "Instead of asking the internet for the same picture every time, your app keeps a copy nearby so it shows instantly. But copies go out of date, so you also need rules for when to throw the old copy away and fetch a fresh one.",
    "analogy": "A cache is like keeping snacks in your desk drawer instead of walking to the store each time. The fast drawer (memory) holds a few snacks; the pantry (disk) holds more but is a bit slower. And every snack has a use-by date — after that you toss it and restock.",
    "explanation": "Caching means keeping a local copy of expensive-to-fetch data so future reads are instant. On mobile it saves battery, cellular data, and time, and it is what makes an app feel fast. Caches are usually tiered: a small, super-fast in-memory cache backed by a larger, slower on-disk cache; you check memory first, then disk, then the network. The hard part isn't storing data — it's invalidation: knowing when a cached copy is stale and must be refreshed. You control this with TTL (time-to-live) expiries, eviction policies like LRU (least-recently-used) to bound size, and staleness rules that decide whether to show old data while fetching new.\n\nAndroid vs iOS: Android apps commonly layer an in-memory LRU cache (like LruCache) over a disk cache, and HTTP clients such as OkHttp provide an HTTP cache honoring Cache-Control headers; Room/DataStore act as a structured on-disk cache. iOS provides NSCache for in-memory caching (which auto-evicts under memory pressure) and URLCache for HTTP responses, with Core Data/files as durable caches. Both platforms give you memory-pressure signals you should use to shrink caches proactively.",
    "technicalDeep": "A read path checks tiers in order (memory to disk to network) and populates upward on a miss, so a disk hit warms the memory tier. Bounding the cache is essential on memory-constrained devices: LRU eviction discards the entry unused longest, while size/count caps keep memory in check; the memory tier should also drop entries when the OS signals pressure, since holding a large cache can get your whole app killed. Invalidation strategies span a spectrum: TTL (expire after N seconds) is simple but can serve stale or refetch too often; validation-based (ETag/Last-Modified) asks the server 'still fresh?' cheaply; and event-based invalidation drops entries when you know they changed (after a write, a push, or a version bump). Stale-while-revalidate is the mobile-favorite: show cached data instantly, kick off a background refresh, and update the UI when it lands — perceived speed without serving forever-stale content. The subtle bug class is coherence between tiers: a write must invalidate or update every tier, or memory and disk disagree.\n\nAndroid vs iOS: HTTP-level caches on both platforms key off response headers (Cache-Control, ETag) and can do conditional revalidation for you — leaning on them avoids reinventing invalidation. NSCache differs from a plain dictionary by auto-purging under pressure and being thread-safe, which is why it's preferred for image/memory caches on iOS; Android's LruCache needs you to size it (often a fraction of available heap) and clear on onTrimMemory. Both benefit from separating the durable structured cache (DB) from the volatile image/response caches.",
    "whatBreaks": "An unbounded memory cache grows until the OS kills the app for using too much memory. No invalidation means users see stale prices, old avatars, or deleted items lingering. Aggressive TTL of near-zero defeats the cache and hammers the network and battery. Tier incoherence — updating disk but not memory after a write — shows contradictory data depending on which tier answered. Caching per-user or sensitive data in a shared or unencrypted cache leaks it. Treating the cache as the source of truth (never refreshing) freezes the app in the past.",
    "efficientWay": {
      "title": "Designing a cache with sane invalidation",
      "approaches": [
        {
          "name": "Tiered memory+disk cache with bounded LRU, TTL plus validation, and stale-while-revalidate",
          "verdict": "best",
          "reason": "Instant reads, bounded memory, cheap freshness checks, and fresh data arriving in the background — fast and correct."
        },
        {
          "name": "Single-tier cache with a fixed TTL and simple size cap",
          "verdict": "ok",
          "reason": "Easy to reason about and fine for uniform data, but a blunt TTL either serves stale or refetches too eagerly for varied content."
        },
        {
          "name": "Cache forever with no expiry or eviction",
          "verdict": "weak",
          "reason": "Memory grows unbounded until the OS kills the app, and users are stuck with permanently stale data and no path to refresh."
        }
      ],
      "recommendation": "Layer a bounded in-memory LRU over a disk cache, pick invalidation per data type (TTL for volatile feeds, validation for large rarely-changing blobs, event-based after writes), and default user-facing reads to stale-while-revalidate. Always shrink caches on memory-pressure signals and keep tiers coherent on every write."
    },
    "commonMistakes": [
      "Letting the memory cache grow unbounded until the OS kills the app under memory pressure",
      "Updating one cache tier after a write but not the others, so tiers disagree",
      "Using a near-zero TTL that defeats the cache and drains battery/data with constant refetches",
      "Caching sensitive or per-user data in a shared/unencrypted cache that leaks across accounts"
    ],
    "seniorNotes": "Invalidation is the whole game — 'there are only two hard things: cache invalidation and naming things' is a mobile daily reality. Choose the invalidation strategy per data type rather than one global TTL: a stock price and a user avatar have opposite freshness needs. Lean on HTTP validators (ETag/Last-Modified) so revalidation is a cheap 304 rather than a full re-download on metered connections. Instrument hit/miss rates and cache size in the field; a cache you can't observe is a memory leak and a staleness bug waiting to happen. And always wire cache-shrinking to the OS memory-pressure callbacks — the cache that helps at rest can be what gets you killed under load.",
    "interviewQuestions": [
      "Walk me through a tiered cache read/write path and where memory vs disk fit.",
      "What is cache invalidation and what strategies (TTL, validation, event-based, stale-while-revalidate) would you choose for different data?",
      "How do you keep a mobile cache from growing unbounded and getting your app killed?"
    ],
    "interviewAnswers": [
      "On a read I check the fastest tier first: in-memory, then on-disk, then the network. A memory miss that hits disk populates memory on the way up so the next read is instant; a full miss fetches from the network and writes into both tiers. On a write I update or invalidate every tier so they stay coherent. Memory is small and volatile for hot data; disk is larger and durable for the working set.",
      "Invalidation decides when a cached copy is too stale to serve. TTL expires entries after a fixed time — simple, good for volatile feeds. Validation uses ETag/Last-Modified to ask the server cheaply if the copy is still fresh — good for large, rarely-changing blobs since a 304 avoids re-download. Event-based invalidation drops entries when I know they changed, like after a write or a push. Stale-while-revalidate shows the cached copy instantly and refreshes in the background — ideal for user-facing reads where perceived speed matters.",
      "I bound every cache: the memory tier gets an LRU with a size or count cap sized to a fraction of available memory, and I evict least-recently-used entries when it fills. I also subscribe to the OS memory-pressure callbacks and shrink or clear the memory cache when the system warns me, because an unbounded cache is what pushes the app over the memory limit and gets it terminated. The disk tier gets its own size cap and periodic pruning."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Tiered read with stale-while-revalidate (pseudocode)",
        "code": "memory = LruCache(maxEntries = 100)\ndisk   = DiskCache(maxBytes = 50_MB)\n\nasync read(key):\n  // 1. fastest tier first\n  hit = memory.get(key)\n  if hit and not expired(hit): return hit.value\n\n  // 2. disk tier, populate memory on the way up\n  d = disk.get(key)\n  if d and not expired(d):\n    memory.put(key, d)\n    if soonStale(d): backgroundRefresh(key)   // stale-while-revalidate\n    return d.value\n\n  // 3. miss -> network, then write both tiers coherently\n  fresh = network.fetch(key)\n  memory.put(key, fresh); disk.put(key, fresh)\n  return fresh.value\n\n// On any write, invalidate ALL tiers so they agree\nasync onWrite(key, value):\n  api.update(key, value)\n  memory.remove(key); disk.remove(key)\n\n// Shrink under OS memory pressure\nonMemoryPressure(): memory.clear()"
      }
    ],
    "resources": [
      {
        "label": "Android: Optimize network data usage and caching",
        "url": "https://developer.android.com/training/efficient-downloads",
        "kind": "docs"
      },
      {
        "label": "Android: Data and file storage overview",
        "url": "https://developer.android.com/training/data-storage",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "offline-first",
    "phase": 4,
    "phaseName": "State, Data & Local Storage",
    "orderIndex": 6,
    "estimatedMins": 40,
    "prerequisites": [
      "local-databases",
      "caching-strategies-mobile"
    ],
    "title": "Offline-First Architecture",
    "eli5": "Your app should work even in a tunnel with no signal. It does that by trusting its own local notebook first — showing you your stuff instantly and letting you make changes — and quietly syncing with the internet whenever the signal comes back.",
    "analogy": "Offline-first is like writing checks. You don't wait for the bank to be open to record what you spent — you write it in your own ledger immediately, and the bank reconciles later. Your ledger is the truth you act on; the bank catches up when it can.",
    "explanation": "Offline-first flips the usual assumption: instead of the network being the source of truth and the local copy a cache, the local database becomes the primary source of truth and the network is a background synchronizer. The UI always reads and writes locally, so it works instantly whether or not there is a connection. When the user makes a change, you update the local DB and the UI immediately (optimistic UI), then queue the change to be sent to the server when connectivity returns. This makes the app feel instant and resilient — the network becomes a detail, not a dependency.\n\nAndroid vs iOS: On Android, this is typically Room as the local source of truth plus WorkManager to run deferrable, retryable sync jobs that survive process death and respect network/battery constraints; the UI observes Room via Flow so it updates automatically when sync writes land. On iOS, Core Data/SwiftData holds the local truth and background tasks (BGTaskScheduler / URLSession background transfers) drive sync; SwiftUI observes the store and re-renders. Both platforms provide managed background execution so queued writes get flushed even after the app is closed.",
    "technicalDeep": "The core pattern is: UI => local DB (immediately) => sync engine => server, with the UI observing the local DB so reads are always local and reactive. Writes are recorded locally and enqueued into a durable outbox (a table of pending operations) so they survive app kill; a sync worker drains the outbox when online, with retries and backoff for failures. Optimistic UI means you apply the expected result locally before the server confirms, then reconcile — rolling back or correcting if the server rejects it. Because operations may be retried, they must be idempotent (safe to apply twice) — usually by assigning each a client-generated id so the server can dedupe. Each record often carries sync metadata: a dirty/pending flag, a local version, and a server-assigned id once acknowledged. The consequence you must design for is conflicts: two devices editing the same record while offline, which the next topic resolves.\n\nAndroid vs iOS: Android's WorkManager gives you constraint-based, guaranteed-eventually execution with automatic backoff — ideal for draining the outbox — and it coalesces work to save battery. iOS background execution is more restricted and opportunistic: BGProcessingTask windows are granted by the system, and background URLSession hands transfers to the OS daemon, so you design the outbox to flush whenever a window or app launch occurs rather than assuming immediate execution. Both require the outbox itself to be durable (in the DB), because the process can die between enqueue and send.",
    "whatBreaks": "Treating the network as the source of truth means the app is a blank, spinning screen the moment signal drops. Holding the outbox only in memory loses queued writes when the OS kills the app. Non-idempotent operations get applied twice on retry, creating duplicate orders or double-charges. Optimistic UI with no rollback path leaves the screen showing a change the server rejected. Ignoring conflicts silently overwrites another device's edits. Firing sync eagerly on every keystroke drains battery and data instead of batching. Never marking records clean means you re-sync everything forever.",
    "efficientWay": {
      "title": "Building an offline-first data layer",
      "approaches": [
        {
          "name": "Local DB as source of truth, reactive reads, optimistic writes, durable idempotent outbox drained by a constrained background worker",
          "verdict": "best",
          "reason": "Instant and resilient offline, survives process death, retries safely, and batches sync to save battery and data."
        },
        {
          "name": "Network-first with a read cache and write-through on send",
          "verdict": "ok",
          "reason": "Simpler and fine for read-heavy apps with good connectivity, but writes and cold reads stall or fail when offline."
        },
        {
          "name": "Direct network calls from the UI with a spinner and no local persistence",
          "verdict": "weak",
          "reason": "Unusable offline, loses in-flight work on kill, and every action is hostage to the weakest bar of signal."
        }
      ],
      "recommendation": "Make the local database the source of truth and have the UI read and write it directly. Record writes optimistically, enqueue them in a durable, idempotent outbox, and drain that outbox with a platform background worker that respects network and battery constraints. Design for conflict from the start."
    },
    "commonMistakes": [
      "Keeping the pending-writes queue only in memory so it's lost when the process is killed",
      "Making sync operations non-idempotent, so a retry duplicates the action",
      "Applying optimistic updates with no rollback when the server rejects the change",
      "Syncing eagerly on every change instead of batching, draining battery and mobile data"
    ],
    "seniorNotes": "Offline-first is a mindset shift interviewers look for: the local DB is authoritative and the server is a peer you reconcile with, not a master you obey. The two make-or-break details are durability of the outbox (it must be in the DB, not RAM) and idempotency (every operation carries a client id so retries and duplicate deliveries are safe). Lean on the platform's managed background scheduler rather than rolling your own retry loop — it handles constraints, backoff, and process death for you, and it plays nicely with battery optimization. Finally, decide your conflict policy explicitly up front; 'we'll deal with conflicts later' means last-write-wins by accident, which quietly loses user data.",
    "interviewQuestions": [
      "What does offline-first mean and how does it change what the source of truth is?",
      "How do you make queued writes survive app termination and be safe to retry?",
      "What is optimistic UI and what has to happen when the server later rejects the change?"
    ],
    "interviewAnswers": [
      "Offline-first means the local database is the source of truth and the UI always reads and writes locally, while the network syncs in the background. The app works instantly regardless of connectivity because it never waits on the server to render or accept input. It inverts the usual model where the server is authoritative and local data is just a cache — here the server is a background peer that the local store reconciles with when online.",
      "I put the pending writes in a durable outbox table in the database, not in memory, so they survive process death. Each operation carries a client-generated id so it's idempotent — the server can dedupe if the same op is delivered twice after a retry. A background worker with retry and exponential backoff drains the outbox when connectivity returns, and only marks an op done after the server acknowledges it.",
      "Optimistic UI applies the expected result to the local store and screen immediately, before the server confirms, so the app feels instant. If the server later rejects it, I reconcile: roll back the optimistic change or replace it with the server's authoritative state, and surface an error or retry to the user. That requires keeping enough information to undo the local change and a clear path for the rejection to flow back to the UI."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Optimistic write with a durable outbox (pseudocode)",
        "code": "// UI writes go to the LOCAL DB first; the UI observes the DB\nasync addTodo(text):\n  op = {\n    clientId: uuid(),          // idempotency key -> safe to retry\n    type: 'CREATE_TODO',\n    payload: { text },\n    status: 'pending'\n  }\n  db.transaction(tx =>\n    tx.insert('Todo', { id: op.clientId, text, dirty: true })  // optimistic\n    tx.insert('Outbox', op))   // durable queue survives process death\n  scheduleSync()               // hand to platform background worker\n\n// Background worker drains the outbox when online, with backoff\nasync syncOutbox():\n  for op in db.query('SELECT * FROM Outbox WHERE status = pending'):\n    try:\n      serverId = api.apply(op)          // idempotent via op.clientId\n      db.update('Todo', op.clientId, { serverId, dirty: false })\n      db.delete('Outbox', op.clientId)\n    catch Rejected:\n      rollback(op)                       // reconcile optimistic change\n    catch NetworkError:\n      retryWithBackoff(op)               // stays queued"
      },
      {
        "lang": "kotlin",
        "label": "Enqueue constrained, retryable sync work (Android example)",
        "code": "// Local DB (Room) is the source of truth; WorkManager drains the outbox.\nfun scheduleSync(context: Context) {\n    val work = OneTimeWorkRequestBuilder<SyncWorker>()\n        .setConstraints(\n            Constraints.Builder()\n                .setRequiredNetworkType(NetworkType.CONNECTED)\n                .build())\n        .setBackoffCriteria(                       // safe retries\n            BackoffPolicy.EXPONENTIAL,\n            10, TimeUnit.SECONDS)\n        .build()\n    // Guaranteed to run eventually, survives process death\n    WorkManager.getInstance(context)\n        .enqueueUniqueWork(\"sync\", ExistingWorkPolicy.APPEND, work)\n}"
      }
    ],
    "resources": [
      {
        "label": "Android: Save data in a local database using Room",
        "url": "https://developer.android.com/training/data-storage/room",
        "kind": "docs"
      },
      {
        "label": "Android: Optimize downloads for efficient network access",
        "url": "https://developer.android.com/training/efficient-downloads",
        "kind": "docs"
      },
      {
        "label": "Apple: Core Data",
        "url": "https://developer.apple.com/documentation/coredata",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "data-sync-conflict",
    "phase": 4,
    "phaseName": "State, Data & Local Storage",
    "orderIndex": 7,
    "estimatedMins": 40,
    "prerequisites": [
      "offline-first"
    ],
    "title": "Data Sync & Conflict Resolution",
    "eli5": "If you and a friend both edit the same shared shopping list while offline, then reconnect, whose changes win? Data sync is the app figuring out how to combine both of your edits so nothing important gets lost.",
    "analogy": "It's like two people editing the same document on paper in different rooms. When they meet, they compare notes. Sometimes the newest note simply wins; sometimes they merge line-by-line; the worst outcome is one person silently tearing up the other's page.",
    "explanation": "When the same data can be changed on multiple devices (or on the server) while offline, syncing has to reconcile divergent versions — that's conflict resolution. The simplest rule is last-write-wins (LWW): whichever edit has the newest timestamp overwrites the other. It's easy but loses data when both edits mattered. Smarter approaches merge changes — combining edits to different fields, or using data structures (CRDTs) mathematically designed to merge without conflicts. To sync efficiently you also track what has changed since last time using sync tokens (a cursor or version the server returns), so each sync transfers only the delta, not everything.\n\nAndroid vs iOS: On Android you typically build sync logic yourself over your API — sending changed records with versions, receiving a sync token/cursor, and applying a chosen merge policy into Room; some teams use Firebase or other backends that provide LWW or realtime merge out of the box. On iOS, Core Data with CloudKit (NSPersistentCloudKitContainer) provides managed sync across a user's devices with its own conflict handling, and you can also implement custom reconciliation. In both cases the framework may move bytes, but you still own the semantic policy for what a conflict means in your domain.",
    "technicalDeep": "Sync needs three things: change detection, transport of deltas, and a merge policy. Change detection uses per-record versions or dirty flags plus a server-issued sync token (opaque cursor or logical clock) so each side asks 'what changed since token X?' and gets only the delta — critical on metered mobile networks. The merge policy is the hard part. LWW resolves by comparing timestamps or version vectors, but wall-clock timestamps are unreliable across devices (clock skew), so robust systems use logical clocks (Lamport timestamps) or version vectors to establish causal order rather than trusting device clocks. Field-level merge reduces data loss by treating non-overlapping field edits as compatible. CRDTs (Conflict-free Replicated Data Types) go further: they define merge as a commutative, associative, idempotent operation so any two replicas converge to the same state regardless of order — at the cost of extra metadata and complexity. Whatever the policy, reconciliation must be deterministic: given the same two versions, every device must reach the same result, or replicas permanently diverge.\n\nAndroid vs iOS: Core Data + CloudKit gives you built-in merge policies (e.g., which store wins) and handles the transport and change tokens for you, but you still choose the policy and handle domain conflicts it can't decide. Android teams more often hand-roll: an updatedAt/version column, a server change cursor, and explicit merge code, or adopt a sync backend. Both must confront clock skew — trusting client timestamps for LWW across devices is a classic silent-data-loss bug that logical clocks avoid.",
    "whatBreaks": "Naive LWW using device wall-clock time silently discards the loser's edits and misbehaves under clock skew, so a device with a fast clock always wins. Non-deterministic merge makes two devices reach different results, so replicas never converge. Syncing the full dataset every time instead of deltas wastes battery and mobile data and gets slow as data grows. A lost or mismatched sync token causes either missed changes or a full re-sync. Ignoring tombstones (deletion markers) resurrects deleted records on the next sync. Merging without idempotency double-applies changes on retry.",
    "efficientWay": {
      "title": "Reconciling divergent copies",
      "approaches": [
        {
          "name": "Delta sync with sync tokens plus a domain-appropriate merge (field-level or CRDT) using logical clocks",
          "verdict": "best",
          "reason": "Transfers only changes, converges deterministically, avoids clock-skew data loss, and preserves concurrent edits that don't truly conflict."
        },
        {
          "name": "Last-write-wins with server-authoritative timestamps and clear conflict surfacing to the user",
          "verdict": "ok",
          "reason": "Simple and acceptable for single-user-per-record data, but loses concurrent edits and needs the server (not the device) to assign the clock."
        },
        {
          "name": "Naive last-write-wins using each device's local clock, silently overwriting",
          "verdict": "weak",
          "reason": "Clock skew makes the wrong edit win, edits vanish with no trace, and users lose data they can't recover."
        }
      ],
      "recommendation": "Sync deltas using a server-issued token, and choose a merge policy that matches the data: field-level or CRDT merge for genuinely collaborative records, server-authoritative LWW (never device-clock LWW) for single-owner records. Establish order with logical clocks or version vectors, handle deletes with tombstones, and make reconciliation deterministic and idempotent."
    },
    "commonMistakes": [
      "Using device wall-clock timestamps for last-write-wins and losing edits under clock skew",
      "Re-syncing the entire dataset each time instead of deltas via a sync token/cursor",
      "Non-deterministic merge logic so two devices converge to different states",
      "Forgetting tombstones, so deleted records reappear after the next sync"
    ],
    "seniorNotes": "The interview signal here is knowing that last-write-wins is a data-loss policy, not a neutral default, and that device clocks can't be trusted — logical clocks or version vectors are how you order events correctly. Match the policy to the domain: a personal note field can tolerate LWW, but a collaborative document or a counter demands merge or CRDT semantics. Sync tokens are the efficiency backbone; design them as opaque server-issued cursors so you can evolve the server's change-tracking without breaking clients. Always plan deletes as tombstones with their own lifecycle, and make every sync operation idempotent so retries and duplicate deliveries never corrupt state. Above all, reconciliation must be deterministic — non-determinism means permanent divergence that's brutal to debug in the field.",
    "interviewQuestions": [
      "What is last-write-wins, and why is using device timestamps for it dangerous?",
      "What are sync tokens and how do they make syncing efficient on mobile?",
      "When would you choose CRDTs or field-level merge over last-write-wins?"
    ],
    "interviewAnswers": [
      "Last-write-wins resolves a conflict by keeping the edit with the newest timestamp and discarding the other. It's dangerous with device timestamps because device clocks drift and can be wrong — a device with a fast clock always wins, and legitimate edits get silently overwritten with no recovery. If I use LWW at all, the server assigns the ordering, and I prefer logical clocks or version vectors so ordering reflects causality rather than an untrusted wall clock.",
      "A sync token is an opaque cursor the server returns after each sync that represents 'you're caught up to here.' On the next sync the client sends the token and the server responds with only the changes since then — the delta — instead of the whole dataset. That minimizes bytes transferred, which saves battery and mobile data and keeps sync fast as the dataset grows. Because it's opaque, the server can change how it tracks changes internally without breaking clients.",
      "I choose CRDTs or field-level merge when data is genuinely concurrent — collaborative documents, shared lists, counters — where losing one side's edit is unacceptable. Field-level merge treats edits to different fields as compatible so both survive. CRDTs define merge as commutative, associative, and idempotent so replicas converge to the same state regardless of order, at the cost of extra metadata. LWW is only acceptable when each record has effectively a single owner and concurrent edits are rare and low-stakes."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Delta sync with a token and field-level merge (pseudocode)",
        "code": "// Pull only what changed since last time using a sync token\nasync pull():\n  token = prefs.get('syncToken')\n  { changes, nextToken } = api.changesSince(token)   // delta, not full set\n  for remote in changes:\n    local = db.get(remote.id)\n    merged = resolve(local, remote)\n    db.upsert(merged)\n  prefs.set('syncToken', nextToken)\n\n// Deterministic merge: field-level, ordered by a logical clock (not wall time)\nresolve(local, remote):\n  if local == null: return remote\n  if remote.deleted: return tombstone(remote)         // honor deletions\n  out = copy(local)\n  for field in fields:\n    // higher logical version wins per field -> concurrent edits to\n    // different fields both survive\n    if remote.versionOf(field) > local.versionOf(field):\n      out[field] = remote[field]\n  return out"
      }
    ],
    "resources": [
      {
        "label": "Apple: Core Data (with CloudKit sync)",
        "url": "https://developer.apple.com/documentation/coredata",
        "kind": "docs"
      },
      {
        "label": "Android: Save data in a local database using Room",
        "url": "https://developer.android.com/training/data-storage/room",
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
