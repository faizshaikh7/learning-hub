import type { CurriculumTopic } from '@/types'

/** AI/ML In-Depth — Phase 0: Python & Data Toolkit (6 topics). */
export const AIML_P0: CurriculumTopic[] = [
  {
    id: 'python-for-ml',
    phase: 0,
    phaseName: 'Python & Data Toolkit',
    orderIndex: 1,
    estimatedMins: 35,
    prerequisites: [],
    title: 'Python for ML',
    eli5: 'Python is the language almost all machine learning is written in. It reads like English, so you spend your brainpower on the ideas (the math, the data) instead of fighting the language.',
    analogy: 'Python is like a kitchen with pre-made ingredients. Other languages make you grow the wheat and mill the flour; Python hands you the dough (libraries like NumPy and Pandas) so you can focus on the recipe — your model.',
    explanation: 'For ML you need a focused slice of Python: core syntax, the built-in data structures (lists, dicts, tuples, sets), comprehensions for transforming data in one line, and functions with default and keyword arguments. You also need environment hygiene: virtual environments (venv) isolate each project so its packages do not clash with other projects, and pip installs packages from PyPI. ML code is mostly gluing libraries together, so reading and writing idiomatic Python matters more than advanced language features.',
    technicalDeep: 'Lists are dynamic arrays (append is amortized O(1), insert at front is O(n)); dicts are hash maps with O(1) average lookup — most feature lookups and label mappings live in dicts. Comprehensions like [x * 2 for x in nums if x > 0] compile to faster bytecode than equivalent for-loops and signal intent. Functions are first-class objects, which is why you can pass a metric function into a training loop. A venv is just a directory with its own interpreter symlink and site-packages; activating it rewrites PATH so pip installs land inside the project. requirements.txt (or pyproject.toml) pins versions so experiments are reproducible.',
    whatBreaks: 'Installing packages globally leads to version conflicts — project A needs numpy 1.x, project B needs 2.x, and both break. Mutable default arguments (def f(items=[])) silently share state across calls. Mixing Python 2-era habits or shadowing built-ins (naming a variable list or dict) causes confusing errors deep inside library code.',
    efficientWay: {
      title: 'How deep to go on Python before ML',
      approaches: [
        {
          name: 'Learn the 20% used in ML code: data structures, comprehensions, functions, imports, venv',
          verdict: 'best',
          reason: 'You need good intuition for reading and writing data-transforming code, not ultra depth. This subset covers nearly all notebook and sklearn code you will see.'
        },
        {
          name: 'Complete a full Python mastery course first (metaclasses, asyncio, descriptors)',
          verdict: 'weak',
          reason: 'Months of detour. ML code almost never uses these features; you can learn them later if a real need appears.'
        },
        {
          name: 'Skip fundamentals and copy-paste from tutorials',
          verdict: 'ok',
          reason: 'Gets you moving, but you will stall the first time you must debug a shape error or adapt someone else’s code.'
        }
      ],
      recommendation: 'Spend about a week on the ML-relevant subset, then learn the rest on demand. Intuition for how lists, dicts and functions behave beats encyclopedic knowledge — you can always look up syntax, but you cannot look up fluency.'
    },
    commonMistakes: [
      'Using a mutable default argument (def train(layers=[])) — the list persists between calls and accumulates state',
      'Not using a virtual environment, then losing hours to version conflicts between projects',
      'Writing C-style index loops (for i in range(len(xs))) instead of iterating directly or using enumerate',
      'Confusing assignment with copying — b = a on a list makes both names point to the same object, so mutating b changes a'
    ],
    seniorNotes: 'In production ML teams, environment reproducibility is treated as seriously as the model itself: pinned dependencies, lockfiles, and often Docker on top of venv. Senior engineers also insist on type hints (def score(X: np.ndarray) -> float) in shared code — notebooks can be loose, libraries cannot.',
    interviewQuestions: [
      'What is the difference between a list and a tuple, and when would you use each?',
      'Explain what a list comprehension is and rewrite a simple for-loop as one.',
      'Why do we use virtual environments in Python projects?'
    ],
    interviewAnswers: [
      'A list is mutable (you can append, remove, reorder); a tuple is immutable and hashable, so it can be a dict key. Use lists for collections that change (training losses per epoch) and tuples for fixed records (an (x, y) coordinate or a dataset shape).',
      'A comprehension builds a new list from an iterable in one expression: squares = [x * x for x in nums if x % 2 == 0] replaces a 4-line loop that appends. It is faster, shorter, and reads as a description of the result rather than the mechanics.',
      'A venv isolates each project’s packages and interpreter so dependencies never clash across projects, and it makes the environment reproducible — a teammate can recreate it exactly from requirements.txt. Without it, upgrading a package for one project can silently break another.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'The Python subset ML code actually uses',
        code: '# Data structures you will touch daily\nsamples = [0.9, 0.4, 0.7, 0.2]          # list: ordered, mutable\nlabel_map = {0: \'cat\', 1: \'dog\'}          # dict: O(1) lookup\nshape = (32, 32, 3)                        # tuple: immutable record\n\n# Comprehensions: transform + filter in one line\nconfident = [s for s in samples if s > 0.5]\nnames = [label_map[i] for i in [0, 1, 1, 0]]\nprint(confident)   # [0.9, 0.7]\nprint(names)       # [\'cat\', \'dog\', \'dog\', \'cat\']\n\n# Functions with defaults + keyword args (every sklearn API works like this)\ndef normalize(values, low=0.0, high=1.0):\n    mn, mx = min(values), max(values)\n    return [low + (v - mn) * (high - low) / (mx - mn) for v in values]\n\nprint(normalize(samples))\nprint(normalize(samples, high=100))'
      },
      {
        lang: 'python',
        label: 'Project setup: venv + pip (run in a terminal)',
        code: '# Create and activate an isolated environment\n# python -m venv .venv\n# source .venv/bin/activate        (Linux/macOS)\n# .venv\\Scripts\\activate           (Windows)\n\n# Install the core ML stack and freeze versions\n# pip install numpy pandas matplotlib scikit-learn jupyter\n# pip freeze > requirements.txt\n\n# Verify from Python\nimport sys\nprint(sys.executable)   # should point inside .venv\nimport numpy as np\nprint(np.__version__)'
      }
    ],
    resources: [
      { label: 'Official Python Tutorial', url: 'https://docs.python.org/3/tutorial/', kind: 'docs' },
      { label: 'Kaggle Learn: Python (free micro-course)', url: 'https://www.kaggle.com/learn', kind: 'practice' },
      { label: 'ML Roadmap — where Python fits', url: 'https://www.youtube.com/watch?v=wOTFGRSUQ6Q', kind: 'video' }
    ]
  },
  {
    id: 'jupyter-notebooks',
    phase: 0,
    phaseName: 'Python & Data Toolkit',
    orderIndex: 2,
    estimatedMins: 25,
    prerequisites: ['python-for-ml'],
    title: 'Jupyter Notebooks & Workflow',
    eli5: 'A notebook is a document where you write small chunks of code, run each chunk, and see the result right below it — text, tables, and charts all mixed together. It is like a lab journal that can execute itself.',
    analogy: 'A Python script is a printed recipe you must cook start-to-finish. A notebook is a kitchen counter: you taste (inspect data) after every step, adjust seasoning (parameters), and keep notes next to each pot. Perfect for experimenting, messy if you never clean the counter.',
    explanation: 'Jupyter is the default workspace for data exploration and ML experimentation. Code lives in cells you run independently; results (numbers, DataFrames, plots) render inline, and Markdown cells document your reasoning. This tight feedback loop is why EDA and model prototyping happen in notebooks. The catch is hidden state: cells can be run in any order, so a notebook can look correct while depending on a variable defined by a cell you deleted or edited.',
    technicalDeep: 'A notebook is a JSON file (.ipynb) of cells; a kernel — a persistent Python process — executes them and holds all variables in memory between runs. The execution counter (In [7]) records run order, which is how you detect out-of-order execution. Magics extend the kernel: %timeit micro-benchmarks a statement, %matplotlib inline renders plots into the output, %run executes an external script, and !pip installs into the kernel environment. Notebook hygiene means: restart kernel and Run All before trusting results, keep cells small and top-to-bottom, move stable code into .py modules, and clear outputs before committing to git (outputs bloat diffs).',
    whatBreaks: 'Hidden state is the classic failure: you rename a variable but an old cell already defined the previous name, so everything works — until the kernel restarts and the notebook is broken. Out-of-order execution makes results non-reproducible. Giant notebooks with 200 cells become unmaintainable, and merging notebook JSON in git produces painful conflicts.',
    efficientWay: {
      title: 'Using notebooks without shooting yourself in the foot',
      approaches: [
        {
          name: 'Notebooks for exploration, .py modules for anything reused; restart-and-run-all before trusting results',
          verdict: 'best',
          reason: 'You get the fast feedback loop where it helps and reproducibility where it matters. This is the working intuition — no deep tooling knowledge required.'
        },
        {
          name: 'Do everything in one ever-growing notebook, including final training pipelines',
          verdict: 'weak',
          reason: 'Hidden state and copy-pasted cells make results irreproducible; sooner or later restart-and-run-all fails and you cannot tell why.'
        },
        {
          name: 'Avoid notebooks entirely and work only in scripts with print statements',
          verdict: 'ok',
          reason: 'Reproducible, but you lose inline plots and instant data inspection — the main reasons EDA is faster in notebooks.'
        }
      ],
      recommendation: 'Treat the notebook as a lab bench, not a product. Explore freely, but the moment code stabilizes, promote it to a module and import it back. The one habit that pays for everything: Restart Kernel and Run All before you believe any number.'
    },
    commonMistakes: [
      'Running cells out of order and trusting the outputs — the notebook state no longer matches the code on screen',
      'Never restarting the kernel, so deleted variables and stale imports silently keep working',
      'Putting hours of work into one unnamed Untitled7.ipynb with no Markdown structure',
      'Committing notebooks with huge embedded outputs, making git diffs and reviews useless'
    ],
    seniorNotes: 'Mature teams draw a hard line: notebooks are for exploration and reporting, production code lives in packages with tests. Tools like papermill (parameterized notebook runs) and jupytext (notebook-as-.py for clean diffs) bridge the gap. A senior habit worth stealing: number your notebooks (01-eda.ipynb, 02-features.ipynb) so the analysis reads as an ordered story.',
    interviewQuestions: [
      'What is the hidden state problem in Jupyter notebooks and how do you avoid it?',
      'When would you move code out of a notebook into a .py module?',
      'What are Jupyter magics? Give two examples you actually use.'
    ],
    interviewAnswers: [
      'The kernel keeps every variable ever defined in memory, so cells can depend on state that no visible code produces (edited or deleted cells, out-of-order runs). Avoid it by keeping cells top-to-bottom, restarting the kernel and running all cells before trusting results, and keeping each cell small enough to reason about.',
      'As soon as code is reused across notebooks or stabilizes — data loading, cleaning functions, feature builders. Modules give you imports, tests, and version control that diffs cleanly; the notebook then imports them and stays a thin layer of exploration and narrative.',
      'Magics are kernel commands prefixed with % (line) or %% (cell) that are not Python itself. %timeit gives reliable micro-benchmarks by running a statement many times, and %matplotlib inline renders plots directly under the cell — both are everyday tools during EDA.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Notebook workflow essentials (run in Jupyter)',
        code: '# Cell 1 — imports and display settings\nimport numpy as np\nimport pandas as pd\n%matplotlib inline\n\n# Cell 2 — quick data inspection: the whole point of notebooks\ndf = pd.DataFrame({\'age\': [22, 35, 58], \'income\': [28000, 52000, 71000]})\ndf.head()          # last expression renders as a nice table\n\n# Cell 3 — micro-benchmark with a magic\n%timeit np.arange(1_000_000).sum()\n\n# Cell 4 — shell escape: install into THIS kernel\'s env\n# !pip install seaborn\n\n# Hygiene checklist before sharing:\n# 1. Kernel -> Restart & Run All  (must succeed top to bottom)\n# 2. Markdown headers explain each section\n# 3. Stable helpers moved to utils.py and imported'
      }
    ],
    resources: [
      { label: 'Jupyter Documentation', url: 'https://docs.jupyter.org/en/latest/', kind: 'docs' },
      { label: 'Kaggle Learn — practice in hosted notebooks', url: 'https://www.kaggle.com/learn', kind: 'practice' },
      { label: 'Official Python Tutorial (reference while exploring)', url: 'https://docs.python.org/3/tutorial/', kind: 'docs' }
    ]
  },
  {
    id: 'numpy-fundamentals',
    phase: 0,
    phaseName: 'Python & Data Toolkit',
    orderIndex: 3,
    estimatedMins: 40,
    prerequisites: ['python-for-ml', 'jupyter-notebooks'],
    title: 'NumPy: Arrays & Vectorization',
    eli5: 'NumPy lets you do math on whole grids of numbers at once. Instead of telling the computer "add these two numbers, now the next two, now the next two..." a million times, you say "add these two lists" once and it happens almost instantly.',
    analogy: 'A Python loop is a clerk stamping documents one at a time. NumPy is an industrial printing press: you load the whole stack and it processes everything in one pass. Same job, a machine built for bulk.',
    explanation: 'NumPy’s ndarray is the data structure underneath the entire ML stack — Pandas, scikit-learn, PyTorch and TensorFlow all speak arrays. An ndarray is a grid of same-typed numbers with a shape, like (1000, 20) for 1000 samples with 20 features. Vectorization means expressing math as whole-array operations (X * 2, X.mean(axis=0)) instead of Python loops; broadcasting lets arrays of different shapes combine sensibly, like subtracting a per-column mean from every row in one line.',
    technicalDeep: 'An ndarray is a contiguous C memory buffer plus metadata: dtype (e.g. float64), shape, and strides. Vectorized operations run as compiled C loops over that buffer and use SIMD, which is why they are 10-100x faster than Python loops — the per-element interpreter overhead (type checks, object boxing) disappears. Broadcasting rules: compare shapes right-to-left; dimensions are compatible when equal or when one is 1, and size-1 dimensions are virtually stretched without copying. So (1000, 20) minus (20,) applies the vector to every row. Slices return views (no copy — mutating a view mutates the original); fancy indexing and boolean masks return copies. axis=0 aggregates down columns, axis=1 across rows.',
    whatBreaks: 'Broadcasting a (1000,) array against a (1000, 1) array silently produces a (1000, 1000) matrix — a classic source of wrong results and memory blowups. Mutating a slice unexpectedly changes the parent array because slices are views. Integer overflow in small dtypes (int8 wrapping past 127) corrupts data without any error. Loops over big arrays make code 100x slower than it should be.',
    efficientWay: {
      title: 'Getting fast at array thinking',
      approaches: [
        {
          name: 'Drill shape intuition: predict the shape and result of every operation before running it',
          verdict: 'best',
          reason: 'Nearly all NumPy bugs are shape bugs. Intuition for shapes and broadcasting transfers directly to Pandas, sklearn, and deep learning tensors — you need that instinct, not exhaustive API knowledge.'
        },
        {
          name: 'Write the loop first, then translate it to vectorized form',
          verdict: 'ok',
          reason: 'Fine while learning — the loop states your intent clearly — but plan to grow out of it; production code should be born vectorized.'
        },
        {
          name: 'Memorize the NumPy API surface function by function',
          verdict: 'weak',
          reason: 'Hundreds of functions, and docs exist. Knowing every ufunc does not help if you cannot predict what shape comes out.'
        }
      ],
      recommendation: 'Master five things cold: shape, dtype, indexing/masking, broadcasting rules, and axis semantics. Say the expected output shape out loud before running a cell. That intuition is what interviews and real debugging actually test.'
    },
    commonMistakes: [
      'Looping over array elements in Python instead of using vectorized operations — correct but 10-100x slower',
      'Confusing shape (n,) with (n, 1): one is a 1-D vector, the other a column matrix, and they broadcast completely differently',
      'Forgetting slices are views: b = a[:10]; b[0] = 99 also changes a — use .copy() when you need independence',
      'Mixing up axis=0 and axis=1 in reductions, e.g. taking row means when you wanted per-feature column means'
    ],
    seniorNotes: 'In real pipelines, memory matters as much as speed: float64 everywhere doubles RAM versus float32 for negligible benefit in most ML, and chained operations create hidden temporaries — out= parameters and in-place ops help on big data. Seniors also profile before optimizing: np.einsum and clever tricks are fun, but a single unnecessary copy of a 10 GB array is usually the real problem.',
    interviewQuestions: [
      'Why is vectorized NumPy code so much faster than an equivalent Python loop?',
      'Explain broadcasting. What is the result shape of adding a (3, 4) array and a (4,) array?',
      'What is the difference between a view and a copy in NumPy, and when does each occur?'
    ],
    interviewAnswers: [
      'A Python loop pays interpreter overhead per element: each number is a heap-allocated object that must be type-checked and unboxed. NumPy stores data in one contiguous typed buffer and runs the whole operation in a compiled C loop with SIMD, so per-element overhead vanishes — typically a 10-100x speedup.',
      'Broadcasting aligns shapes from the right; dimensions match if equal or if one is 1, and size-1 dims are stretched without copying. (3, 4) + (4,): the (4,) is treated as (1, 4) and stretched across 3 rows, giving a (3, 4) result — the vector is added to every row.',
      'A view shares the original memory buffer, a copy is independent. Basic slicing (a[2:5], a[:, 0]) returns views, so mutations propagate to the parent; boolean-mask and fancy (integer-array) indexing return copies. When independence matters, call .copy() explicitly.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Vectorization vs loop — and broadcasting for feature scaling',
        code: 'import numpy as np\nimport time\n\nX = np.random.rand(1_000_000)\n\n# Slow: Python loop\nstart = time.perf_counter()\nout = [x * 2 + 1 for x in X]\nloop_t = time.perf_counter() - start\n\n# Fast: vectorized — one C-level pass\nstart = time.perf_counter()\nout_v = X * 2 + 1\nvec_t = time.perf_counter() - start\nprint(f\'loop {loop_t:.3f}s vs vectorized {vec_t:.4f}s -> {loop_t / vec_t:.0f}x faster\')\n\n# Broadcasting: standardize each feature column in one line\ndata = np.random.rand(1000, 20) * 100      # 1000 samples, 20 features\nz = (data - data.mean(axis=0)) / data.std(axis=0)   # (1000,20) op (20,)\nprint(z.shape, z.mean(axis=0).round(2)[:3])  # means ~0 per column'
      },
      {
        lang: 'python',
        label: 'Views vs copies, and boolean masking',
        code: 'import numpy as np\n\na = np.arange(10)\nview = a[2:5]        # view: shares memory\nview[0] = 99\nprint(a)             # [ 0  1 99  3 ...] — parent changed!\n\nsafe = a[2:5].copy() # independent copy\nsafe[0] = -1\nprint(a[2])          # still 99\n\n# Boolean masks: the workhorse of data filtering (returns a copy)\nscores = np.array([0.91, 0.42, 0.77, 0.13, 0.68])\nprint(scores[scores > 0.5])          # [0.91 0.77 0.68]\nprint((scores > 0.5).sum())          # 3 — count matching\nscores[scores < 0.2] = 0.0           # mask assignment edits in place\nprint(scores)'
      }
    ],
    resources: [
      { label: 'NumPy: The Absolute Basics for Beginners', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', kind: 'docs' },
      { label: '3Blue1Brown — Essence of Linear Algebra (see the math behind arrays)', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', kind: 'video' },
      { label: 'Kaggle Learn — practice with real datasets', url: 'https://www.kaggle.com/learn', kind: 'practice' }
    ]
  },
  {
    id: 'pandas-fundamentals',
    phase: 0,
    phaseName: 'Python & Data Toolkit',
    orderIndex: 4,
    estimatedMins: 40,
    prerequisites: ['numpy-fundamentals'],
    title: 'Pandas: DataFrames & Wrangling',
    eli5: 'Pandas gives you a super-powered spreadsheet inside Python. You can load a table of data, filter rows, add columns, group things together and compute averages — with a line or two of code instead of clicking around.',
    analogy: 'If NumPy is a warehouse of identical crates (pure numbers), Pandas is a well-run office: every column has a name, every row has a label, and you can ask questions like "average salary by department" the way you would ask a good office manager.',
    explanation: 'A DataFrame is a table of labeled columns (each a Series backed by arrays); it is where real-world messy data gets cleaned into model-ready form. The core skills: selecting with loc (label-based) and iloc (position-based), filtering with boolean conditions, groupby for split-apply-combine aggregations ("mean revenue per region"), merge for joining tables like SQL, and handling missing data with isna, fillna, and dropna. Most ML projects spend more time here than in the model itself.',
    technicalDeep: 'loc slices by label and is end-inclusive (df.loc[0:5] gives 6 rows); iloc slices by integer position and is end-exclusive like Python. Filtering combines boolean Series with & and | (parenthesize each condition — Python’s and/or fail on Series). groupby implements split-apply-combine: hash rows into groups by key, apply an aggregation per group, and combine results indexed by group key; .agg accepts multiple named aggregations at once. merge mirrors SQL joins (how=\'inner\'|\'left\'|\'right\'|\'outer\') and its validate parameter (e.g. \'one_to_many\') catches accidental row-multiplying duplicate keys. Missing data is NaN (float) or pd.NA; NaN is contagious in arithmetic and silently ignored by most aggregations — know which behavior you are getting.',
    whatBreaks: 'The SettingWithCopyWarning: df[df.age > 30][\'salary\'] = 0 may modify a temporary copy, silently doing nothing — chained indexing is the number-one Pandas bug. Merging on keys with unexpected duplicates multiplies rows and inflates your dataset. fillna(0) on a column where 0 is meaningful (temperature, balance) corrupts statistics. Comparing with == np.nan never works — NaN is not equal to itself; use isna().',
    efficientWay: {
      title: 'Learning Pandas without drowning in the API',
      approaches: [
        {
          name: 'Master the core five — loc/iloc, boolean filtering, groupby-agg, merge, missing-data handling — on a real dataset',
          verdict: 'best',
          reason: 'These five cover ~90% of real wrangling. Intuition for what each returns (Series vs DataFrame, view vs copy) beats memorizing the hundreds of remaining methods.'
        },
        {
          name: 'Think in SQL and translate: WHERE -> boolean mask, GROUP BY -> groupby, JOIN -> merge',
          verdict: 'ok',
          reason: 'A great mental bridge if you know SQL, but Pandas’ index semantics and copy/view behavior have no SQL analogue and still must be learned.'
        },
        {
          name: 'Read the full API reference before touching data',
          verdict: 'weak',
          reason: 'The API is enormous and you will retain none of it without a real question to answer. Learn by interrogating a dataset.'
        }
      ],
      recommendation: 'Pick a real messy CSV (Kaggle has thousands) and answer ten questions about it using only the core five operations. When something surprises you — a warning, doubled rows, NaN propagation — stop and understand it; those surprises are the actual curriculum.'
    },
    commonMistakes: [
      'Chained indexing for assignment (df[mask][\'col\'] = x) instead of df.loc[mask, \'col\'] = x — triggers SettingWithCopyWarning and may not write anything',
      'Forgetting parentheses in filters: df[df.a > 1 & df.b < 5] parses wrong; write df[(df.a > 1) & (df.b < 5)]',
      'Merging without checking key uniqueness, silently exploding a 10k-row table into 500k rows',
      'Filling missing values before the train/test split, leaking test-set statistics into training'
    ],
    seniorNotes: 'On production data, seniors validate at boundaries: assert expected shapes after merges, use merge(validate=\'one_to_many\'), and check df.isna().sum() before and after transforms. For datasets beyond memory, know the escape hatches — chunked reads, categorical dtypes to shrink strings, or switching to Polars/DuckDB — but reach for them only when profiling says so. Method chaining with .assign and .pipe keeps transforms readable and reviewable.',
    interviewQuestions: [
      'What is the difference between loc and iloc?',
      'Explain the split-apply-combine pattern in a groupby.',
      'How do you handle missing values in a dataset, and what can go wrong?'
    ],
    interviewAnswers: [
      'loc selects by label (index and column names) and its slices are end-inclusive; iloc selects by integer position with Python’s end-exclusive slicing. df.loc[10] is the row labeled 10, which after filtering or sorting may not be the 11th row — df.iloc[10] always is.',
      'groupby splits rows into groups by key values, applies a function to each group independently (mean, count, or a custom function), then combines the per-group results into a new structure indexed by the keys. df.groupby(\'region\')[\'sales\'].mean() answers "average sales per region" in one expression.',
      'First diagnose: how much is missing, and is it random or systematic (a sensor offline, a field added later)? Then choose per column: drop rows/columns when missingness is rare, impute with median/mode when reasonable, or add an is-missing indicator when absence itself is informative. Pitfalls: filling with 0 where 0 has meaning distorts distributions, and imputing using full-dataset statistics before the train/test split leaks information.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Core wrangling: filter, loc/iloc, groupby, merge, missing data',
        code: 'import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    \'dept\': [\'eng\', \'eng\', \'sales\', \'sales\', \'hr\'],\n    \'salary\': [95000, 105000, 60000, np.nan, 52000],\n    \'years\': [3, 6, 2, 4, 5],\n})\n\n# Filtering: parenthesize each condition, combine with & |\nsenior_eng = df[(df.dept == \'eng\') & (df.years >= 5)]\n\n# loc = labels, iloc = positions\nprint(df.loc[0, \'salary\'])    # 95000.0\nprint(df.iloc[0, 1])          # same cell by position\n\n# Correct assignment: one .loc, never chained indexing\ndf.loc[df.dept == \'hr\', \'salary\'] = 55000\n\n# Missing data: diagnose, then impute per-group\nprint(df.isna().sum())\ndf[\'salary\'] = df.groupby(\'dept\')[\'salary\'].transform(lambda s: s.fillna(s.median()))\n\n# groupby-agg: split-apply-combine\nsummary = df.groupby(\'dept\').agg(avg_salary=(\'salary\', \'mean\'), headcount=(\'dept\', \'size\'))\nprint(summary)\n\n# merge = SQL join; validate catches duplicate-key explosions\nlocations = pd.DataFrame({\'dept\': [\'eng\', \'sales\', \'hr\'], \'city\': [\'Pune\', \'Delhi\', \'Mumbai\']})\nfull = df.merge(locations, on=\'dept\', how=\'left\', validate=\'many_to_one\')\nprint(full.head())'
      }
    ],
    resources: [
      { label: '10 Minutes to Pandas (official)', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', kind: 'docs' },
      { label: 'Kaggle Learn: Pandas micro-course', url: 'https://www.kaggle.com/learn', kind: 'practice' },
      { label: 'NumPy beginner guide (Pandas is built on it)', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', kind: 'docs' }
    ]
  },
  {
    id: 'data-visualization',
    phase: 0,
    phaseName: 'Python & Data Toolkit',
    orderIndex: 5,
    estimatedMins: 30,
    prerequisites: ['pandas-fundamentals'],
    title: 'Data Visualization: Matplotlib & Seaborn',
    eli5: 'Charts turn columns of numbers into pictures your brain can instantly understand. A histogram shows you the shape of your data, a scatter plot shows whether two things move together — things a table of numbers hides.',
    analogy: 'Summary statistics are a text description of a face — "two eyes, average nose". A chart is the photograph. Anscombe’s quartet is four datasets with identical means and correlations that look wildly different when plotted; only the photo reveals the truth.',
    explanation: 'Matplotlib is the low-level plotting engine (full control over every axis and pixel); Seaborn sits on top with statistical plots that understand DataFrames directly. The real skill is chart choice: histograms and KDE plots for a single distribution, box/violin plots for distributions across categories, scatter plots for two numeric variables, line plots for trends over time, bar plots for categorical comparisons, and correlation heatmaps for a fast pairwise overview of all numeric features. In ML, plots are diagnostic instruments — they expose skew, outliers, and relationships that decide your preprocessing and features.',
    technicalDeep: 'Matplotlib’s object-oriented API is the reliable path: fig, ax = plt.subplots() gives explicit Figure and Axes objects, and you call ax.scatter, ax.set_xlabel, etc. — this scales to multi-panel figures where the implicit plt.* state machine becomes confusing. Seaborn functions (histplot, boxplot, scatterplot, heatmap, pairplot) accept data=df with column names for x, y and hue, handling grouping and legends automatically. A correlation heatmap is sns.heatmap(df.corr(numeric_only=True), annot=True, cmap=\'coolwarm\', vmin=-1, vmax=1) — remember it shows only linear pairwise relationships. Histograms are bin-sensitive: too few bins hide structure (bimodality), too many show noise.',
    whatBreaks: 'The wrong chart hides the story: a bar of means conceals that one group is bimodal (a box or violin plot would show it). Truncated y-axes exaggerate tiny differences. Overplotting in scatter plots (100k points as one ink blob) hides density — use alpha or sampling. Reading a correlation heatmap as causation, or missing a strong nonlinear relationship because r is near 0, leads to wrong feature decisions.',
    efficientWay: {
      title: 'Which chart when — building the reflex',
      approaches: [
        {
          name: 'Map question types to chart types and drill it: distribution -> histogram/box, relationship -> scatter, comparison -> bar, trend -> line, all-pairs -> heatmap',
          verdict: 'best',
          reason: 'Visualization is decision-making, not API knowledge. This mapping is the intuition you actually need; the exact function call is a two-second lookup.'
        },
        {
          name: 'Learn Matplotlib’s architecture deeply before plotting anything',
          verdict: 'weak',
          reason: 'Figure/Axes/Artist internals matter for publication-grade figures, not for EDA. Depth here does not improve your data understanding.'
        },
        {
          name: 'Default to sns.pairplot and a heatmap on every dataset, then zoom in',
          verdict: 'ok',
          reason: 'A decent opening move on small datasets — instant overview — but it is slow beyond ~10 columns and no substitute for targeted questions.'
        }
      ],
      recommendation: 'Before every plot, say the question out loud ("is income skewed?", "does age relate to churn?"), then pick the chart the mapping gives you. Ten deliberate charts on a real dataset teach more than any gallery tour — you need chart-choice intuition, not API depth.'
    },
    commonMistakes: [
      'Plotting means as bars when the distributions matter — box/violin plots reveal spread, skew and outliers that bars hide',
      'Using too few or too many histogram bins and drawing conclusions from the artifact',
      'Scatter-plotting 100k points with full opacity — set alpha=0.1 or sample, or you are looking at an ink blob',
      'Forgetting axis labels, units and titles — a chart that needs verbal explanation has failed'
    ],
    seniorNotes: 'Seniors treat plots as arguments: every figure in a report answers one stated question, and its title states the finding ("Churn doubles above age 60"), not the chart type. For model work, diagnostic plots (residuals vs predicted, learning curves, calibration) matter more than pretty EDA. Beyond ~50k points, move to hexbin or 2-D histograms; and always fix vmin/vmax on heatmaps so color scales are comparable across figures.',
    interviewQuestions: [
      'How do you choose between a histogram, a box plot and a scatter plot?',
      'What does a correlation heatmap show, and what are its limitations?',
      'You have 100,000 points in a scatter plot and it looks like a solid blob. What do you do?'
    ],
    interviewAnswers: [
      'It depends on the question. One numeric variable’s shape -> histogram or KDE. Comparing a numeric variable across categories -> box or violin plot (shows median, spread, outliers per group). Relationship between two numeric variables -> scatter plot. The chart follows the question, never the reverse.',
      'It colors the pairwise linear correlation matrix of numeric features, giving a fast overview of which features move together and which relate to the target. Limits: it only captures linear relationships (a strong U-shape can show r ~ 0), it says nothing about causation, and it is pairwise only — it cannot show three-way interactions.',
      'Reduce overplotting: lower alpha so density shows as darkness, sample a subset, or switch to a density representation — hexbin or a 2-D histogram. If structure differs by category, facet into small multiples. The goal is to see density, and raw opaque points stop conveying it long before 100k.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'The EDA plot toolkit: distribution, category comparison, relationship, heatmap',
        code: 'import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\nrng = np.random.default_rng(42)\ndf = pd.DataFrame({\n    \'age\': rng.normal(40, 12, 500).clip(18, 75).round(),\n    \'income\': rng.lognormal(10.8, 0.5, 500).round(-2),\n    \'dept\': rng.choice([\'eng\', \'sales\', \'hr\'], 500),\n})\ndf[\'spend\'] = df.income * 0.3 + rng.normal(0, 4000, 500)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 8))\n\n# 1. Distribution -> histogram (income is right-skewed: log-ish data)\nsns.histplot(data=df, x=\'income\', bins=40, ax=axes[0, 0])\naxes[0, 0].set_title(\'Income is right-skewed -> consider log transform\')\n\n# 2. Numeric across categories -> box plot\nsns.boxplot(data=df, x=\'dept\', y=\'income\', ax=axes[0, 1])\naxes[0, 1].set_title(\'Income by department\')\n\n# 3. Two numerics -> scatter with alpha against overplotting\naxes[1, 0].scatter(df.income, df.spend, alpha=0.3, s=12)\naxes[1, 0].set_xlabel(\'income\'); axes[1, 0].set_ylabel(\'spend\')\naxes[1, 0].set_title(\'Income vs spend: strong linear relationship\')\n\n# 4. All pairwise relationships -> correlation heatmap\nsns.heatmap(df.corr(numeric_only=True), annot=True, cmap=\'coolwarm\',\n            vmin=-1, vmax=1, ax=axes[1, 1])\naxes[1, 1].set_title(\'Correlation heatmap\')\n\nplt.tight_layout()\nplt.show()'
      }
    ],
    resources: [
      { label: 'Matplotlib Tutorials (official)', url: 'https://matplotlib.org/stable/tutorials/index.html', kind: 'docs' },
      { label: 'Seaborn Tutorial (official)', url: 'https://seaborn.pydata.org/tutorial.html', kind: 'docs' },
      { label: 'Kaggle Learn: Data Visualization', url: 'https://www.kaggle.com/learn', kind: 'practice' },
      { label: 'StatQuest — statistics intuition behind the plots', url: 'https://www.youtube.com/@statquest', kind: 'video' }
    ]
  },
  {
    id: 'eda-process',
    phase: 0,
    phaseName: 'Python & Data Toolkit',
    orderIndex: 6,
    estimatedMins: 40,
    prerequisites: ['pandas-fundamentals', 'data-visualization'],
    title: 'Exploratory Data Analysis (EDA)',
    eli5: 'Before building any model, you become a detective: look at the data, form guesses about what drives the thing you want to predict, check those guesses with charts, and invent new clues (features) from what you know about the problem.',
    analogy: 'EDA is a doctor’s examination before prescribing. The doctor looks at the patient (inspect the data), forms hypotheses ("could be the diet"), runs targeted tests (correlations, scatter plots), and uses medical knowledge to ask non-obvious questions (domain-driven features). Prescribing a model without the exam is malpractice.',
    explanation: 'EDA is a repeatable process, not random plotting. Step 1 — look at the data: shapes, dtypes, head(), missing values, duplicates, and per-column distributions; understand what each row and column physically means. Step 2 — form hypotheses about the target: before computing anything, write down which factors you believe drive it and why ("older customers churn less because switching is effort"). Step 3 — test with correlations and scatter plots: check each hypothesis against the data, and let the data surprise you. Step 4 — design features from domain knowledge: combine and transform raw columns into quantities that better express the mechanism (price per square meter, days since last purchase, debt-to-income ratio). This loop repeats — features suggest new hypotheses.',
    technicalDeep: 'Step 1 tooling: df.info(), df.describe(), df.isna().sum(), df.duplicated().sum(), value_counts() on categoricals, histograms on numerics — you are hunting for skew, outliers, impossible values (age 999, negative prices) and encoding quirks (missing coded as 0 or \'unknown\'). Step 3: df.corr(numeric_only=True)[\'target\'] ranks linear relationships; scatter plots (or box plots against a binary target) then reveal shape — nonlinearity, thresholds, interactions that r misses. Beware correlated predictors (multicollinearity) and remember correlation is not causation: ice cream sales correlate with drownings via summer. Step 4 is where models are won: linear models cannot invent ratios or interactions, so total_income = income_1 + income_2 or rooms_per_household hands the model structure it cannot learn on its own. Validate a new feature by checking its correlation with the target exceeds its parents’.',
    whatBreaks: 'Skipping EDA means training on garbage: duplicated rows inflate confidence, a leaked column (e.g. "churn_date" when predicting churn) gives a perfect model that fails in production, and outliers or coded-as-zero missing values silently distort everything. Fishing for correlations without hypotheses produces spurious findings — test enough columns and something correlates by chance. Building features using target statistics computed on the full dataset leaks test information.',
    efficientWay: {
      title: 'Running EDA as a process instead of wandering',
      approaches: [
        {
          name: 'Follow the four-step loop — inspect, hypothesize about the target, test with correlations/plots, engineer domain features — writing hypotheses BEFORE looking at answers',
          verdict: 'best',
          reason: 'Hypotheses-first keeps you honest (no data fishing) and builds causal intuition about the problem. That intuition, not exhaustive statistics, is what makes your features and model choices good.'
        },
        {
          name: 'Run an automated profiler (ydata-profiling) and read the report',
          verdict: 'ok',
          reason: 'A fine accelerator for step 1 — it surfaces missingness and distributions fast — but it cannot form hypotheses or invent domain features; the thinking steps remain yours.'
        },
        {
          name: 'Skip EDA and let a gradient-boosted model plus feature importance figure it out',
          verdict: 'weak',
          reason: 'The model happily learns from leaks, duplicates and artifacts, and importance scores will not tell you the data was wrong — you find out in production.'
        }
      ],
      recommendation: 'Timebox a first pass: 30 minutes inspecting, 15 writing hypotheses, an hour testing them with plots, then feature sketches. Depth of statistical rigor matters less than the discipline of hypotheses-before-peeking — intuition about the mechanism is the deliverable.'
    },
    commonMistakes: [
      'Jumping straight to modeling and discovering data problems (leaks, duplicates, coded missing values) only after weeks of confusing results',
      'Computing 200 correlations with no prior hypotheses and treating the best one as a discovery — multiple comparisons guarantee false positives',
      'Ignoring domain knowledge: raw latitude/longitude mean little, but distance-to-city-center might be the strongest feature in the set',
      'Using the target to build features or imputations on the full dataset, leaking test-set information into training'
    ],
    seniorNotes: 'Senior data scientists interrogate provenance before statistics: who produced each column, when, and could it postdate the target event (leakage)? They keep EDA notebooks as evidence — every accepted or rejected hypothesis documented — because six months later someone asks why a feature exists. And they treat a feature’s stability over time as seriously as its correlation: a signal that drifts is a production incident waiting to happen. A polished EDA notebook on a dataset you care about is also the single best first portfolio piece.',
    interviewQuestions: [
      'Walk me through how you would approach EDA on a brand-new dataset.',
      'Why is it important to form hypotheses before computing correlations?',
      'Give an example of a domain-knowledge feature and why it beats the raw columns.'
    ],
    interviewAnswers: [
      'First understand what a row means and inspect structure: shapes, dtypes, missingness, duplicates, per-column distributions, impossible values. Then write hypotheses about what should drive the target and why. Test each with correlations, scatter/box plots against the target, noting surprises. Finally engineer features from domain knowledge — ratios, differences, time gaps — and re-test. I iterate this loop and document what I accepted, rejected, and why.',
      'Two reasons. Statistically, testing dozens of relationships without priors guarantees spurious hits — with 100 columns at the 5% level, about five correlate with the target by pure chance. Cognitively, hypotheses-first builds a causal story of the problem, so when the data contradicts you, you learn something real about the mechanism instead of rationalizing noise after the fact.',
      'Predicting house prices: raw total_price and raw area both correlate with price, but price_per_square_meter and rooms_per_household encode the mechanism buyers actually use, and distance-to-city-center converts meaningless raw coordinates into a strong signal. Linear models cannot construct ratios themselves, and even tree models learn faster when the structure is handed to them — domain features inject knowledge the algorithm has no way to invent.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'The four-step EDA loop on the California housing dataset',
        code: 'import pandas as pd\nfrom sklearn.datasets import fetch_california_housing\n\nraw = fetch_california_housing(as_frame=True)\ndf = raw.frame            # features + MedHouseVal target\n\n# STEP 1 — look at the data\nprint(df.shape)\nprint(df.info())\nprint(df.describe().T[[\'mean\', \'min\', \'max\']])\nprint(\'missing:\', df.isna().sum().sum(), \'dupes:\', df.duplicated().sum())\n\n# STEP 2 — hypotheses about the target (write these BEFORE peeking):\n# H1: higher median income -> higher house value\n# H2: coastal areas (location) matter more than house age\n# H3: rooms per household beats raw room counts\n\n# STEP 3 — test with correlations, then plots for shape\ncorr = df.corr(numeric_only=True)[\'MedHouseVal\'].sort_values(ascending=False)\nprint(corr)   # H1 confirmed: MedInc ~0.69, strongest by far\n# df.plot.scatter(x=\'MedInc\', y=\'MedHouseVal\', alpha=0.1)  # check shape\n\n# STEP 4 — engineer features from domain knowledge, then re-test\ndf[\'rooms_per_household\'] = df.AveRooms / df.AveOccup\ndf[\'bedroom_ratio\'] = df.AveBedrms / df.AveRooms\nnew_corr = df.corr(numeric_only=True)[\'MedHouseVal\']\nprint(new_corr[[\'AveRooms\', \'rooms_per_household\', \'bedroom_ratio\']])\n# rooms_per_household correlates far better than raw AveRooms -> H3 confirmed'
      }
    ],
    resources: [
      { label: 'Kaggle Learn — datasets + EDA practice for a portfolio project', url: 'https://www.kaggle.com/learn', kind: 'practice' },
      { label: '10 Minutes to Pandas (your EDA toolbox)', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', kind: 'docs' },
      { label: 'StatQuest — correlation and statistics intuition', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Seaborn tutorial — the plots EDA runs on', url: 'https://seaborn.pydata.org/tutorial.html', kind: 'docs' }
    ]
  },
]
