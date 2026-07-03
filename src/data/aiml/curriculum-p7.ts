import type { CurriculumTopic } from '@/types'

/** AI/ML Phase 7 — Production ML & Career (6 topics). */
export const AIML_P7: CurriculumTopic[] = [
  {
    id: 'sklearn-pipelines',
    phase: 7,
    phaseName: 'Production ML & Career',
    orderIndex: 1,
    estimatedMins: 50,
    prerequisites: ['ml-project-workflow', 'feature-engineering', 'model-evaluation'],
    title: 'scikit-learn Pipelines & AutoML',
    eli5: 'Instead of doing each cooking step by hand every time (chop, season, cook), you write down the whole recipe once. A Pipeline is that recipe: it runs every preprocessing step and the model in the right order, the same way, every single time.',
    analogy: 'A Pipeline is a factory assembly line. Raw data enters at one end, each station (imputer, scaler, encoder) does one job, and a finished prediction rolls off the other end. ColumnTransformer is having parallel lanes for different part types — numeric parts go down one lane, categorical parts down another — before they merge at final assembly.',
    explanation: 'scikit-learn Pipelines chain transformers and a final estimator into one object with fit and predict. This guarantees that preprocessing learned on training data (means for imputation, scales for standardization) is applied identically at prediction time, and — critically — that it is re-learned only on training folds during cross-validation, preventing data leakage. ColumnTransformer routes different columns through different preprocessing. GridSearchCV wraps the whole pipeline so you can tune preprocessing choices and model hyperparameters together. AutoML tools push this further by searching over pipelines automatically.',
    technicalDeep: 'A Pipeline is a list of (name, estimator) steps where all but the last must implement fit/transform. Calling pipeline.fit(X, y) calls fit_transform on each transformer in order, then fit on the final estimator; predict runs transform through the same fitted transformers. Inside cross_val_score or GridSearchCV, the entire pipeline is cloned and refit per fold, so statistics like the imputation mean are computed only from that fold\'s training split — this is the mechanical fix for preprocessing leakage. Hyperparameters are addressed with the step__param convention (e.g. model__n_estimators, prep__num__imputer__strategy), which lets a single grid search span preprocessing and modeling decisions. ColumnTransformer applies transformers to column subsets and concatenates outputs (sparse-aware); handle_unknown=\'ignore\' on OneHotEncoder keeps serving robust to unseen categories. AutoML systems (auto-sklearn, TPOT, FLAML, H2O AutoML) automate the search over pipeline structure + hyperparameters using Bayesian optimization, genetic programming, or successive halving, plus ensembling of the best candidates. They are strong baselines, not replacements for understanding: you still own data quality, leakage checks, and the metric definition.',
    whatBreaks: 'Fitting a scaler on the full dataset before train_test_split silently leaks test statistics into training — scores look great, production disappoints. Forgetting handle_unknown on encoders crashes at serving time on a new category. GridSearchCV over a big grid with cv=10 explodes combinatorially (fits = candidates x folds). AutoML overfits the validation signal if you let it search too long against a small validation set.',
    efficientWay: {
      title: 'Building preprocessing + model workflows',
      approaches: [
        {
          name: 'Pipeline + ColumnTransformer end to end',
          verdict: 'best',
          reason: 'One object to fit, tune, cross-validate, and pickle. Leakage-proof by construction.'
        },
        {
          name: 'Manual preprocessing in separate steps',
          verdict: 'weak',
          reason: 'Easy to leak statistics across splits and to drift between training and serving code.'
        },
        {
          name: 'Jump straight to AutoML',
          verdict: 'ok',
          reason: 'Great baseline generator, but a black box if you cannot read the pipeline it produced.'
        }
      ],
      recommendation: 'Always wrap preprocessing and model into a single Pipeline. Tune it with GridSearchCV or RandomizedSearchCV using step__param names. Use AutoML to sanity-check that your hand-built pipeline is in the right ballpark.'
    },
    commonMistakes: [
      'Calling fit_transform on the test set instead of transform — the whole point is to reuse training statistics',
      'Scaling or imputing before the train/test split, leaking test-set information into training',
      'Grid-searching only model params and hand-fixing preprocessing, when the encoder/imputer choice often matters more',
      'Treating the AutoML leaderboard score as production truth without a held-out test set'
    ],
    seniorNotes: 'In real teams the pipeline object is the deployment artifact: it gets pickled, versioned, and served as one unit, so training/serving skew becomes structurally impossible for anything inside it. Prefer RandomizedSearchCV or HalvingGridSearchCV over exhaustive grids once the space grows. Custom transformers (subclassing BaseEstimator + TransformerMixin) let domain feature logic live inside the pipeline instead of in untracked notebook cells.',
    interviewQuestions: [
      'Why does putting preprocessing inside a Pipeline prevent data leakage during cross-validation?',
      'How would you tune both an imputation strategy and a model hyperparameter in one search?',
      'When would you reach for AutoML, and what are its limits?'
    ],
    interviewAnswers: [
      'Because cross-validation clones and refits the whole pipeline per fold, every transformer learns its statistics (means, scales, category vocabularies) only from that fold\'s training portion. If you preprocess before splitting, those statistics include validation rows, so the model indirectly sees validation data and scores are optimistically biased.',
      'Give pipeline steps names, then use the step__param convention in the search space: for example a param grid with prep__num__imputer__strategy set to mean or median, and model__max_depth over several values, passed to GridSearchCV wrapping the whole pipeline. The search then evaluates every combination with proper per-fold refitting.',
      'AutoML is ideal for fast strong baselines, tabular problems where you want breadth over many model families, and for teams without deep ML expertise. Limits: it cannot fix bad labels, leaky features, or a wrong metric; it can overfit the validation protocol; and the winning ensemble may be too slow or opaque for the serving constraints, so you still need a held-out test set and an inspection of what it built.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Leakage-proof pipeline with ColumnTransformer + GridSearchCV',
        code: "from sklearn.pipeline import Pipeline\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import GridSearchCV, train_test_split\n\nnum_cols = ['age', 'income']\ncat_cols = ['city', 'plan']\n\nprep = ColumnTransformer([\n    ('num', Pipeline([\n        ('imputer', SimpleImputer(strategy='median')),\n        ('scaler', StandardScaler()),\n    ]), num_cols),\n    ('cat', OneHotEncoder(handle_unknown='ignore'), cat_cols),\n])\n\npipe = Pipeline([\n    ('prep', prep),\n    ('model', RandomForestClassifier(random_state=42)),\n])\n\nparam_grid = {\n    'prep__num__imputer__strategy': ['mean', 'median'],\n    'model__n_estimators': [200, 400],\n    'model__max_depth': [None, 12],\n}\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=42)\nsearch = GridSearchCV(pipe, param_grid, cv=5, scoring='roc_auc', n_jobs=-1)\nsearch.fit(X_train, y_train)\nprint(search.best_params_)\nprint('test AUC:', search.score(X_test, y_test))"
      }
    ],
    resources: [
      { label: 'scikit-learn User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', kind: 'docs' },
      { label: 'Kaggle Learn — hands-on pipelines practice', url: 'https://www.kaggle.com/learn', kind: 'practice' },
      { label: 'An Introduction to Statistical Learning', url: 'https://www.statlearning.com/', kind: 'book' }
    ]
  },
  {
    id: 'mlops-pipelines',
    phase: 7,
    phaseName: 'Production ML & Career',
    orderIndex: 2,
    estimatedMins: 55,
    prerequisites: ['sklearn-pipelines', 'ml-project-workflow'],
    title: 'MLOps: From Notebook to Pipeline',
    eli5: 'A notebook is like cooking one great meal at home. MLOps is running a restaurant: the same dish must come out right every night, you track which recipe version is on the menu, and if customers stop liking it you notice fast and update the recipe.',
    analogy: 'MLOps is DevOps with two extra moving parts: the data and the model. Regular software is a play with a fixed script; an ML system is improv theatre where the audience (data) changes nightly — so you need cameras (monitoring), recorded rehearsals (experiment tracking), and archived scripts (data + model versioning) to know what was on stage when something goes wrong.',
    explanation: 'MLOps is the discipline of getting models from experimentation into reliable, repeatable production operation. Its pillars: experiment tracking (log params, metrics, artifacts for every run), data and model versioning (know exactly which data produced which model), CI/CD for ML (tests for data, code, and model quality gates), and automated retraining loops that respond to drift. The core mindset shift from notebook work is reproducibility: any model in production must be traceable to code version + data version + config.',
    technicalDeep: 'Experiment tracking tools (MLflow, Weights & Biases) record runs as params + metrics + artifacts, giving you a queryable history and a model registry with stage transitions (staging, production, archived). Data versioning (DVC, lakeFS, Delta Lake time travel) hashes datasets so training is a pure function: model = train(code@commit, data@version, config). CI for ML extends normal CI with data validation (schema checks, distribution tests with tools like Great Expectations), training smoke tests on data samples, and model quality gates — a candidate must beat the incumbent on held-out metrics before promotion. Deployment maturity is often described in levels: level 0 is manual notebook-to-serving handoff; level 1 automates the training pipeline so retraining is a parameterized job; level 2 adds full CI/CD where a merged commit can retrain, validate, and progressively roll out a model. Retraining triggers are scheduled (weekly), data-driven (drift detector fires), or performance-driven (online metric drops). Orchestrators (Airflow, Prefect, Kubeflow Pipelines, Vertex AI Pipelines) express training as a DAG of steps — ingest, validate, transform, train, evaluate, register — each containerized and independently retryable.',
    whatBreaks: 'Un-versioned training data makes incidents undebuggable: you cannot reproduce the model that is misbehaving. Notebooks with hidden execution-order state produce models that cannot be rebuilt from a clean run. Retraining blindly on drifted or corrupted data automates the production of bad models. A model registry without quality gates lets a worse model silently replace a better one.',
    efficientWay: {
      title: 'Making ML work reproducible',
      approaches: [
        {
          name: 'Track everything: code commit + data hash + config per run',
          verdict: 'best',
          reason: 'Any production model can be traced and rebuilt. Debugging and audits become tractable.'
        },
        {
          name: 'Save model files with descriptive names (model_final_v2_best.pkl)',
          verdict: 'weak',
          reason: 'Filename archaeology does not scale past week one; nobody knows what data or code produced it.'
        },
        {
          name: 'Adopt a full Kubeflow-style platform on day one',
          verdict: 'ok',
          reason: 'Right for large orgs, but heavy machinery before you have a working model is premature.'
        }
      ],
      recommendation: 'Start lightweight: MLflow (or W&B) for tracking from the first experiment, git for code, DVC for data, a simple quality-gated promotion step. Add orchestration when retraining becomes routine, not before.'
    },
    commonMistakes: [
      'Treating the notebook as the deliverable instead of refactoring into testable pipeline modules',
      'Versioning code but not data — half the reproducibility equation is missing',
      'Retraining on a schedule without validating the new data or comparing against the incumbent model',
      'Logging metrics only to the console, so last month\'s best hyperparameters are lost forever'
    ],
    seniorNotes: 'The highest-leverage MLOps investment is usually boring: a single command that retrains, evaluates, and registers a model from scratch. Teams that have this iterate 10x faster and recover from incidents in hours instead of weeks. Also budget for the human loop — many production failures are label pipeline or upstream schema changes, which no amount of model-side tooling catches without data contracts and validation at ingestion.',
    interviewQuestions: [
      'How is CI/CD for ML different from CI/CD for regular software?',
      'What exactly do you need to record to make a training run reproducible?',
      'How would you design an automated retraining loop, and what safeguards would you add?'
    ],
    interviewAnswers: [
      'Regular CI/CD tests deterministic code and ships artifacts built from that code. ML adds two more change surfaces — data and model — so the pipeline also needs data validation (schema and distribution checks), training pipeline tests, and model quality gates where a candidate must beat the current production model on agreed metrics before promotion. Deployments also differ: models are rolled out progressively (shadow, canary) because offline metrics do not guarantee online behavior.',
      'Four things: the exact code version (git commit), the exact data version (dataset hash or snapshot, e.g. via DVC), the full configuration (hyperparameters, feature list, random seeds), and the environment (library versions, ideally a container image). With those, training is a repeatable function; missing any one of them means you cannot rebuild the model behind an incident.',
      'A DAG triggered on schedule or by a drift alert: ingest fresh data, validate it against expectations (schema, null rates, distribution shift), train the candidate, evaluate on a held-out and a recent time-sliced set, compare against the incumbent with a quality gate, register on pass, then roll out gradually with monitoring. Safeguards: automatic abort on data validation failure, human approval for large metric swings, canary deployment with rollback, and alerting on the loop itself failing silently.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'MLflow experiment tracking with a quality gate',
        code: "import mlflow\nimport mlflow.sklearn\nfrom sklearn.metrics import roc_auc_score\n\nmlflow.set_experiment('churn-model')\n\nwith mlflow.start_run() as run:\n    mlflow.log_params({'n_estimators': 400, 'max_depth': 12, 'data_version': 'v2026.06'})\n    model = pipe.fit(X_train, y_train)\n    auc = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])\n    mlflow.log_metric('test_auc', auc)\n    mlflow.sklearn.log_model(model, 'model')\n\n# Promotion gate: only register if better than production\nPROD_AUC = 0.871  # fetched from the registry in real life\nif auc > PROD_AUC + 0.002:\n    mlflow.register_model('runs:/' + run.info.run_id + '/model', 'churn-model')\n    print('Candidate promoted:', auc)\nelse:\n    print('Kept incumbent. Candidate AUC:', auc)"
      },
      {
        lang: 'bash',
        label: 'Versioning data alongside code with DVC',
        code: "# One-time setup\npip install dvc\ndvc init\ndvc remote add -d storage s3://my-bucket/dvc\n\n# Track a dataset — git stores the small .dvc pointer, DVC stores the data\ndvc add data/train.parquet\ngit add data/train.parquet.dvc .gitignore\ngit commit -m 'data: training snapshot 2026-06'\ndvc push\n\n# Reproduce any historical model: check out code + matching data\ngit checkout <commit>\ndvc pull   # fetches the exact data version for that commit"
      }
    ],
    resources: [
      { label: 'ML-Ops.org — MLOps principles and levels', url: 'https://ml-ops.org/', kind: 'article' },
      { label: 'Made With ML — production ML course', url: 'https://madewithml.com/', kind: 'course' },
      { label: 'MLOps talk: ML systems in production', url: 'https://www.youtube.com/watch?v=wOTFGRSUQ6Q', kind: 'video' }
    ]
  },
  {
    id: 'model-deployment-ml',
    phase: 7,
    phaseName: 'Production ML & Career',
    orderIndex: 3,
    estimatedMins: 55,
    prerequisites: ['mlops-pipelines', 'model-evaluation'],
    title: 'Deploying ML Models',
    eli5: 'You trained a smart brain in your lab. Deployment is putting that brain inside a vending machine so anyone can walk up, press a button (send data), and instantly get an answer — without you being in the room.',
    analogy: 'Batch serving is a newspaper: predictions printed overnight for everyone, read in the morning. Real-time serving is a call center: each request gets a live answer in milliseconds, which costs more and needs staff (servers) always on. Drift monitoring is the smoke detector — the kitchen looked fine when you left, but you still want an alarm.',
    explanation: 'Deployment turns a trained model into a service or job that other systems consume. Key decisions: serialization format (pickle/joblib for Python-only, ONNX for portable cross-runtime inference), serving pattern (real-time API vs batch scoring vs streaming), and infrastructure (a FastAPI container is the workhorse for real-time). After launch, the job becomes monitoring: input data drift, prediction drift, latency, and — when labels arrive — actual model quality. Deployment is a lifecycle, not an event.',
    technicalDeep: 'Serialization: pickle/joblib snapshot Python objects but are version-fragile (a scikit-learn upgrade can break loading) and unsafe to load from untrusted sources since unpickling executes code. ONNX exports the computation graph to a standard format runnable via onnxruntime in C++, C#, JS, or mobile, decoupling training and serving stacks and often speeding up CPU inference. Serving patterns: real-time (REST/gRPC endpoint, latency budget in the tens of milliseconds, needs autoscaling and preloaded models), batch (score millions of rows on a schedule, cheap and simple — the right default when consumers can tolerate staleness), and streaming (score events from Kafka-like buses). A FastAPI service loads the model once at startup, validates inputs with pydantic, and exposes predict + health endpoints; containerized behind a load balancer with N workers. Rollout uses shadow mode (new model sees traffic, responses discarded) then canary (small traffic share) before full cutover. Monitoring distinguishes data drift (input distribution shifts, detected with PSI or KS tests per feature), concept drift (the input-to-label relationship changes, visible in delayed-label metrics), and prediction drift (output distribution shifts — a cheap early-warning proxy). Log a sample of features + predictions to enable all of this.',
    whatBreaks: 'Pickle loaded under a different scikit-learn version raises errors — or worse, silently misbehaves. Fitting-at-request-time bugs (calling fit_transform instead of transform in the endpoint) corrupt predictions. A model that is 94% accurate offline degrades to 78% in month three because the world drifted and nobody was watching. Latency SLOs blow up because the model is re-read from disk per request.',
    efficientWay: {
      title: 'Choosing a serving pattern',
      approaches: [
        {
          name: 'Batch scoring where freshness allows',
          verdict: 'best',
          reason: 'Radically simpler ops: no latency SLO, no autoscaling, failures are retryable jobs.'
        },
        {
          name: 'Real-time FastAPI endpoint for interactive needs',
          verdict: 'best',
          reason: 'The standard for user-facing inference; well-understood tooling and scaling story.'
        },
        {
          name: 'Real-time serving for everything by default',
          verdict: 'weak',
          reason: 'You pay always-on infra, latency engineering, and on-call cost for freshness nobody asked for.'
        }
      ],
      recommendation: 'Ask how fresh predictions must be. If the consumer can read yesterday\'s scores from a table, batch. Only pay the real-time tax when the input is only known at request time (search queries, fraud checks at checkout).'
    },
    commonMistakes: [
      'Deploying only the model instead of the full preprocessing + model pipeline, recreating features slightly differently in the API',
      'Loading the model inside the request handler instead of once at startup',
      'No input validation, so a missing field becomes a NaN that the model happily scores garbage on',
      'Declaring victory at deployment with no drift monitoring or prediction logging'
    ],
    seniorNotes: 'Version everything at the serving boundary: pin the model version in the response payload and logs so any bad prediction can be attributed. Keep a rollback path that takes minutes, not a retraining cycle. For drift, prediction-distribution monitoring catches most incidents earliest because labels are delayed; treat drift alerts as a trigger for investigation, not automatic retraining. And measure the latency of the whole pipeline including feature fetching — the model is often the fast part.',
    interviewQuestions: [
      'When would you choose ONNX over pickle for model serialization?',
      'Batch vs real-time serving — how do you decide?',
      'Your model\'s production accuracy is degrading but training metrics were great. How do you diagnose it?'
    ],
    interviewAnswers: [
      'Pickle is fine when training and serving are both Python with identical library versions, and the artifact never crosses a trust boundary. Choose ONNX when serving runs on a different stack (C#, JS, mobile, edge), when you need faster portable CPU/GPU inference through onnxruntime, or when you want to decouple serving from Python dependency churn. Also remember pickle executes code on load, so it is unsafe for untrusted artifacts.',
      'The deciding question is prediction freshness versus input availability. If inputs are known ahead of time (all customers, all products) and consumers tolerate hours of staleness, batch scoring into a table is cheaper and operationally simpler. If the input only exists at request time — a search query, a checkout transaction — you need a real-time endpoint with a latency budget, autoscaling, and monitoring. Many systems mix both: batch-precompute heavy features, real-time score at the edge.',
      'First separate the failure classes. Check data drift: compare current input feature distributions to the training snapshot with PSI or KS tests — a broken upstream field or new category often shows up immediately. Check prediction drift: has the output distribution shifted? Check for training/serving skew: are features computed identically in the API and in training? Then, once delayed labels arrive, confirm concept drift by evaluating on recent labeled data. The fix differs: pipeline bug means repair the feature; genuine drift means retrain on recent data; concept shift may mean redesigning features.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'FastAPI model serving with validation and versioning',
        code: "import joblib\nimport pandas as pd\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel, Field\n\napp = FastAPI(title='churn-model')\n\nMODEL_VERSION = '2026.06.1'\nmodel = joblib.load('artifacts/churn_pipeline.joblib')  # loaded ONCE at startup\n\nclass CustomerFeatures(BaseModel):\n    age: int = Field(ge=18, le=120)\n    income: float\n    city: str\n    plan: str\n\n@app.get('/health')\ndef health():\n    return {'status': 'ok', 'model_version': MODEL_VERSION}\n\n@app.post('/predict')\ndef predict(payload: CustomerFeatures):\n    X = pd.DataFrame([payload.model_dump()])\n    proba = float(model.predict_proba(X)[0, 1])\n    # log features + prediction elsewhere for drift monitoring\n    return {'churn_probability': proba, 'model_version': MODEL_VERSION}"
      },
      {
        lang: 'python',
        label: 'Simple data drift check with PSI',
        code: "import numpy as np\n\ndef psi(expected, actual, bins=10):\n    cuts = np.percentile(expected, np.linspace(0, 100, bins + 1))\n    cuts[0], cuts[-1] = -np.inf, np.inf\n    e_pct = np.histogram(expected, cuts)[0] / len(expected)\n    a_pct = np.histogram(actual, cuts)[0] / len(actual)\n    e_pct = np.clip(e_pct, 1e-4, None)\n    a_pct = np.clip(a_pct, 1e-4, None)\n    return float(np.sum((a_pct - e_pct) * np.log(a_pct / e_pct)))\n\n# Rule of thumb: < 0.1 stable, 0.1-0.25 investigate, > 0.25 significant drift\nscore = psi(train_df['income'].values, live_df['income'].values)\nprint('income PSI:', round(score, 3))"
      }
    ],
    resources: [
      { label: 'Made With ML — deployment and serving lessons', url: 'https://madewithml.com/', kind: 'course' },
      { label: 'ML-Ops.org — model serving patterns', url: 'https://ml-ops.org/', kind: 'article' },
      { label: 'scikit-learn User Guide — model persistence', url: 'https://scikit-learn.org/stable/user_guide.html', kind: 'docs' }
    ]
  },
  {
    id: 'distributed-ml',
    phase: 7,
    phaseName: 'Production ML & Career',
    orderIndex: 4,
    estimatedMins: 45,
    prerequisites: ['mlops-pipelines', 'training-deep-networks'],
    title: 'Distributed ML & Big Data',
    eli5: 'One person can count the beans in a jar. But to count all the beans in a warehouse, you hire a hundred people, give each a shelf, and add up their answers. Distributed ML splits data or work across many machines and combines the results.',
    analogy: 'Data parallelism is a hundred students grading identical copies of different exam stacks, then meeting to average their notes about common mistakes (gradient averaging). Model parallelism is an assembly line where the machine itself is too big for one room, so different rooms hold different stages. Spark is the school administrator who assigns stacks, replaces sick graders, and collects results.',
    explanation: 'Scale ML in two situations: the data does not fit one machine (use Spark/Dask to distribute preprocessing and classic training), or the model/training run is too slow or big for one device (use data-parallel or model-parallel deep learning). Spark MLlib provides distributed DataFrames, pipelines, and algorithms over a cluster with fault tolerance. In deep learning, data parallelism replicates the model on each GPU, feeds different mini-batches, and synchronizes gradients (all-reduce) every step. The golden rule: distribution adds serious complexity, so exhaust single-machine options first.',
    technicalDeep: 'Spark executes lazy transformations over partitioned data and only materializes work at actions; wide transformations (groupBy, join) trigger shuffles — the expensive network stage that dominates job cost. MLlib mirrors scikit-learn concepts (Transformer, Estimator, Pipeline) over DataFrames, with distributed implementations of logistic regression, random forests, gradient-boosted trees, ALS, and k-means. For deep learning, synchronous data parallelism (PyTorch DDP, Horovod) all-reduces gradients each step: near-linear speedups until communication dominates, with the effective batch size growing with worker count (often requiring learning-rate scaling and warmup). Model parallelism splits layers or tensors across devices when parameters exceed one GPU\'s memory; pipeline parallelism stages micro-batches through layer groups; ZeRO/FSDP shard optimizer state, gradients, and parameters to fit larger models in data-parallel setups. Parameter servers are the asynchronous alternative — workers push/pull to central state, tolerating stragglers at the cost of gradient staleness. Practical heuristics: pandas handles single-machine data; Dask or Polars stretch that ceiling; Spark earns its overhead in the multi-hundred-GB-to-TB range or when the org already runs a cluster. Sampling is criminally underrated — a well-sampled 2 GB slice often answers the modeling question a 2 TB job was about to burn a cluster on.',
    whatBreaks: 'Shuffle-heavy Spark jobs die with out-of-memory executors or run for hours due to data skew (one hot key lands on one partition). collect() on a big DataFrame pulls the whole dataset to the driver and kills it. Naive multi-GPU training with an unadjusted learning rate diverges at large effective batch sizes. Network bandwidth silently becomes the bottleneck, so 8 GPUs deliver 3x, not 8x.',
    efficientWay: {
      title: 'When one machine is not enough',
      approaches: [
        {
          name: 'Sample first, scale only if the question demands it',
          verdict: 'best',
          reason: 'Most modeling insight comes from a representative sample at 1% of the cost.'
        },
        {
          name: 'Single big machine (more RAM, one strong GPU)',
          verdict: 'best',
          reason: 'Vertical scaling has zero coordination complexity; a 768 GB RAM box covers most tabular work.'
        },
        {
          name: 'Reach for a Spark cluster for a 5 GB CSV',
          verdict: 'weak',
          reason: 'Cluster startup and shuffle overhead exceed the compute; pandas or Polars would finish first.'
        }
      ],
      recommendation: 'Escalate in order: sample, then a bigger machine, then Dask/Polars, then Spark for true big data, then distributed deep learning only when a single modern GPU genuinely cannot do the job.'
    },
    commonMistakes: [
      'Distributing before profiling — the bottleneck is often IO or a bad join, not compute',
      'Calling collect() or toPandas() on cluster-scale data and crashing the driver',
      'Ignoring data skew, so one straggler partition makes 99 idle executors wait',
      'Assuming N GPUs means N-times faster training without accounting for communication overhead'
    ],
    seniorNotes: 'Interviewers probing distributed ML mostly want judgment, not trivia: can you say when NOT to distribute? Know rough numbers — single-GPU training handles most models under a few hundred million parameters; Spark pays off past hundreds of GB; all-reduce scales well to single-digit nodes on commodity networks. In practice the highest-leverage skill is making the pipeline reproducible and cheap at small scale first, because distributed debugging costs 10x.',
    interviewQuestions: [
      'Explain data parallelism vs model parallelism. When do you need each?',
      'Your pandas preprocessing job runs out of memory on 200 GB of data. Walk through your options.',
      'Why do wide transformations like groupBy make Spark jobs slow?'
    ],
    interviewAnswers: [
      'Data parallelism copies the full model to each device, gives each a different slice of the batch, and averages gradients every step (all-reduce) — use it when the model fits on one device but training is too slow. Model parallelism splits the model itself across devices — required when parameters and activations exceed one device\'s memory, as with large transformers. Modern large-model training combines both, plus sharding techniques like FSDP/ZeRO that partition optimizer state and parameters across data-parallel workers.',
      'In cost order: first check whether a representative sample answers the question. Then reduce memory on one machine — read only needed columns, downcast dtypes, use categorical types, process in chunks, or switch to Polars/DuckDB which stream and use memory far better. Then rent a bigger machine — very cheap compared to engineering time. Only if the full data genuinely must be processed repeatedly at this scale do I move to Dask or Spark, accepting cluster and shuffle complexity.',
      'Narrow transformations (filter, map) work within a partition, so they pipeline with no network traffic. Wide transformations need rows with the same key on the same machine, forcing a shuffle: every executor writes partitioned outputs to disk and ships them across the network, then reads and re-sorts. That disk plus network stage dominates job time, and it is vulnerable to skew — one hot key creates a straggler partition. Mitigations: reduce data before shuffling, broadcast small join sides, salt hot keys, and tune partition counts.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Spark MLlib pipeline — sklearn-like at cluster scale',
        code: "from pyspark.sql import SparkSession\nfrom pyspark.ml import Pipeline\nfrom pyspark.ml.feature import StringIndexer, VectorAssembler\nfrom pyspark.ml.classification import RandomForestClassifier\nfrom pyspark.ml.evaluation import BinaryClassificationEvaluator\n\nspark = SparkSession.builder.appName('churn').getOrCreate()\ndf = spark.read.parquet('s3://bucket/events/')  # far bigger than RAM\n\nindexer = StringIndexer(inputCol='plan', outputCol='plan_idx', handleInvalid='keep')\nassembler = VectorAssembler(inputCols=['age', 'income', 'plan_idx'], outputCol='features')\nrf = RandomForestClassifier(labelCol='churned', numTrees=200)\n\npipeline = Pipeline(stages=[indexer, assembler, rf])\ntrain, test = df.randomSplit([0.8, 0.2], seed=42)\nmodel = pipeline.fit(train)\n\nauc = BinaryClassificationEvaluator(labelCol='churned').evaluate(model.transform(test))\nprint('AUC:', auc)"
      }
    ],
    resources: [
      { label: 'Made With ML — scaling and distributed lessons', url: 'https://madewithml.com/', kind: 'course' },
      { label: 'Kaggle Learn — practice on real datasets', url: 'https://www.kaggle.com/learn', kind: 'practice' },
      { label: 'ML-Ops.org — architecting scalable ML', url: 'https://ml-ops.org/', kind: 'article' }
    ]
  },
  {
    id: 'ml-system-design',
    phase: 7,
    phaseName: 'Production ML & Career',
    orderIndex: 5,
    estimatedMins: 60,
    prerequisites: ['model-deployment-ml', 'mlops-pipelines', 'feature-engineering'],
    title: 'ML System Design',
    eli5: 'Designing an ML system is like planning a whole restaurant, not just one recipe. Where do ingredients come from (data)? Who preps them (pipelines)? How fast must meals arrive (serving)? And how do you learn from what customers leave on the plate (feedback loops)?',
    analogy: 'The model is the engine, but an ML system is the entire car: fuel lines (data pipelines), a fuel depot (feature store), the dashboard (monitoring), and a mechanic schedule (retraining). Interviewers who ask you to design a recommendation system are asking you to design the car — candidates who only talk about the engine fail.',
    explanation: 'ML system design is the interview format and real-world skill of architecting an end-to-end ML product: recommendations, feed ranking, fraud detection, search. The canonical walkthrough: (1) frame the problem — business goal to ML task to metrics; (2) data — sources, labels, freshness; (3) features — engineering and a feature store for training/serving consistency; (4) model — start simple, justify complexity; (5) serving — latency, throughput, architecture; (6) feedback loops — logging, monitoring, retraining. Interviewers grade structure and tradeoff reasoning much more than exotic model knowledge.',
    technicalDeep: 'Framing: translate a business objective (increase watch time) into an ML task (rank candidate videos by predicted engagement) and split metrics into offline (AUC, NDCG, recall at K) and online (CTR, dwell time, retention) — and name the gap between them. Labels are the hard part: implicit feedback (clicks) is biased by position and by what the current model chose to show, creating a feedback loop the design must acknowledge (mitigations: exploration traffic, position de-biasing, logging propensities). Large-scale ranking uses a funnel: candidate generation (cheap retrieval — two-tower embeddings + approximate nearest neighbor — narrowing millions to hundreds) then ranking (expensive model over rich features) then business re-ranking (diversity, freshness, policy). Feature stores solve two problems: reuse of feature definitions across teams, and point-in-time-correct training data — features joined as of the label event time to avoid look-ahead leakage — with an offline store (historical, for training) and online store (low-latency key-value, for serving) fed by the same definitions. Serving architecture is a latency budget exercise: for a 100 ms budget, retrieval maybe 20 ms, feature fetch 20 ms, model inference 30 ms, leaving headroom. Evaluation runs offline first, then online A/B tests as the final arbiter, with guardrail metrics (latency, revenue, abuse) alongside the target metric.',
    whatBreaks: 'Training on features that were not available at prediction time (look-ahead leakage) yields models that ace offline eval and flop online. Training/serving skew — features computed by different code paths — silently degrades quality. Feedback loops entrench themselves: the model only learns about items it already shows, so the catalog tail never gets a chance. Optimizing a proxy metric (clicks) damages the true goal (long-term satisfaction) — clickbait wins.',
    efficientWay: {
      title: 'Structuring an ML design interview answer',
      approaches: [
        {
          name: 'Fixed walkthrough: framing, data, features, model, serving, feedback',
          verdict: 'best',
          reason: 'Guarantees coverage, shows senior-style systematic thinking, easy for the interviewer to follow.'
        },
        {
          name: 'Jump straight to the model architecture',
          verdict: 'weak',
          reason: 'Signals junior thinking — the model is maybe 20% of the system and rarely the failure point.'
        },
        {
          name: 'Deep-dive one component exhaustively',
          verdict: 'ok',
          reason: 'Good when the interviewer steers you there, but cover the skeleton first, then go deep on request.'
        }
      ],
      recommendation: 'Open by clarifying scope and constraints (scale, latency, label availability), state the metric mapping explicitly, sketch the whole pipeline in five minutes, then let the interviewer choose where to zoom. Always mention monitoring and the retraining loop — most candidates forget them.'
    },
    commonMistakes: [
      'Never asking about scale, latency budget, or label availability before designing',
      'Proposing the fanciest model instead of a logistic-regression baseline plus an upgrade path',
      'Ignoring position bias and feedback loops when clicks are the training signal',
      'Forgetting point-in-time correctness when describing training data construction'
    ],
    seniorNotes: 'The differentiator in these interviews is naming tradeoffs unprompted: freshness vs cost of retraining, recall vs latency in candidate generation, offline metric gains vs online A/B truth, personalization vs cold-start coverage. Real systems also carry unglamorous load-bearing parts — dedup, filtering, business rules — mentioning them signals production experience. Anchor estimates with numbers: queries per second, candidate set sizes, feature counts, latency budgets.',
    interviewQuestions: [
      'Design a video recommendation system for a platform with 100M users.',
      'What is a feature store and what two problems does it solve?',
      'How do feedback loops corrupt an ML system trained on its own outputs, and what do you do about it?'
    ],
    interviewAnswers: [
      'Clarify: scale (100M users, millions of videos), latency (~200 ms), goal (long-term engagement, not raw clicks). Frame as ranking with a two-stage funnel: candidate generation via two-tower embeddings + ANN retrieval narrowing millions of videos to a few hundred per request, then a ranking model (start GBDT, evolve to a neural ranker) scoring rich user-video features from an online feature store. Labels from engagement logs with position de-biasing and some exploration traffic. Offline metrics recall at K and NDCG; the real arbiter is an online A/B on watch time with guardrails. Close the loop: log impressions and outcomes, monitor drift, retrain candidates on a schedule with quality gates, and re-rank for diversity and freshness to fight popularity feedback loops.',
      'A feature store is a system for defining, computing, storing, and serving features consistently. Problem one: training/serving skew — one feature definition feeds both the offline store (historical values for training) and the online store (low-latency lookup at inference), so the model sees identically computed features in both worlds. Problem two: point-in-time correctness — when building training sets it joins feature values as of each label\'s event time, preventing look-ahead leakage where tomorrow\'s data sneaks into today\'s training rows. It also enables feature reuse and discovery across teams.',
      'The model influences what users see, users can only interact with what is shown, and those interactions become the next training set — so the model increasingly confirms its own past choices: popular items get more exposure and more clicks, the tail starves, and offline metrics look fine because eval data has the same bias. Mitigations: dedicate a small slice of traffic to exploration (random or bandit-driven), log propensity scores and train with inverse-propensity weighting, de-bias for position, add diversity constraints at re-ranking, and track ecosystem health metrics (catalog coverage, tail exposure), not just accuracy.'
    ],
    codeExamples: [
      {
        lang: 'text',
        label: 'The 6-step ML system design walkthrough (memorize this skeleton)',
        code: "1. FRAME    business goal -> ML task -> offline metric + online metric\n            'increase watch time' -> 'rank by p(engagement)' -> NDCG / A-B watch time\n\n2. DATA     sources, label definition, volume, freshness, bias in labels\n\n3. FEATURES user, item, context, cross features\n            feature store: offline (training) + online (serving), point-in-time joins\n\n4. MODEL    baseline first (LR / GBDT) -> justify each step up in complexity\n            funnel at scale: retrieval (ANN) -> ranking -> business re-rank\n\n5. SERVING  latency budget breakdown, batch vs real-time, caching, fallbacks\n\n6. FEEDBACK log impressions + outcomes, monitor drift + guardrails,\n            retrain loop with quality gates, A-B test every change"
      }
    ],
    resources: [
      { label: 'Made With ML — end-to-end system lessons', url: 'https://madewithml.com/', kind: 'course' },
      { label: 'ML-Ops.org — reference architectures', url: 'https://ml-ops.org/', kind: 'article' },
      { label: 'LLM Engineer Handbook — modern ML system components', url: 'https://github.com/SylphAI-Inc/LLM-engineer-handbook', kind: 'repo' }
    ]
  },
  {
    id: 'ml-career-projects',
    phase: 7,
    phaseName: 'Production ML & Career',
    orderIndex: 6,
    estimatedMins: 45,
    prerequisites: ['ml-system-design', 'neural-networks-scratch'],
    title: 'Your ML Portfolio & Career Path',
    eli5: 'Saying you can swim convinces nobody — jumping in the pool does. A portfolio is your pool: real projects people can see, run, and read about. And just like pools have lanes, ML has different career lanes: analyst, data scientist, ML engineer.',
    analogy: 'The 22-project ladder is a climbing gym: you start on the easy wall (EDA, Iris), build grip strength on mid-grade routes (churn prediction, neural nets from scratch), and finish on overhangs (MLOps pipelines, distributed systems). Recruiters are belayers watching which routes you completed — three hard, well-documented climbs beat thirty scrambles up the beginner wall.',
    explanation: 'This capstone maps the road from learner to hired. The project ladder runs 22 rungs from an EDA portfolio to a distributed ML system, deliberately ramping through classic ML, deep learning, and production skills. Roles differ: Data Analysts turn data into decisions (SQL, dashboards, statistics), Data Scientists build and validate models (experimentation, statistics, ML), ML Engineers productionize them (software engineering, deployment, MLOps). Presentation matters as much as the work: each flagship project needs a problem statement, honest metrics, decisions-and-tradeoffs notes, and ideally a live demo.',
    technicalDeep: 'The ladder\'s architecture: rungs 1-5 (EDA portfolio, Iris, linear regression from scratch, Titanic, housing prices) build the workflow — cleaning, cross-validation, leakage awareness, honest evaluation. Rungs 6-12 (image classification, sentiment analysis, churn, stock prediction, NN from scratch, face recognition, recommender) add deep learning and specialty domains — and stock prediction teaches the humility lesson that some things barely predict. Rungs 13-18 (automated pipeline, language model from scratch, A/B framework, image generation, multilingual NLP, RL game AI) hit modern differentiators. Rungs 19-22 (real-time fraud detection, build-your-own AutoML, MLOps pipeline, distributed ML) are the production tier that separates ML engineer candidates. Role reality: Data Analyst (SQL-heavy, BI tools, stats literacy — fastest entry), Data Scientist (modeling + experiment design + stakeholder communication), ML Engineer (strongest coding bar — data structures, system design, MLOps; often the highest-paid of the three and the natural fit after this course), plus adjacent paths like MLOps engineer and applied research. Presenting projects: a README that opens with the problem and result, a metrics table against a stated baseline, a decisions section (why this model, what failed), reproducible setup, and a deployed demo where feasible. In interviews, use a STAR-like arc: problem, constraints, approach, tradeoffs, measured result, what you would do differently. Three polished flagship projects with depth beat twenty tutorial clones — depth is what interview follow-up questions probe.',
    whatBreaks: 'A GitHub full of unmodified tutorial notebooks signals copy-paste, not competence — interviewers ask one follow-up and the facade collapses. Claiming 99% accuracy on a leaky pipeline destroys credibility instantly. Grinding all 22 projects superficially instead of finishing flagships means no project survives a deep dive. Applying only to Data Scientist roles when your profile is engineering-shaped (or vice versa) wastes months.',
    efficientWay: {
      title: 'Building a portfolio that gets interviews',
      approaches: [
        {
          name: 'Three flagship projects, deployed and documented deeply',
          verdict: 'best',
          reason: 'Survives interview probing, demonstrates end-to-end ownership, gives you stories with metrics.'
        },
        {
          name: 'Complete all 22 projects at tutorial depth',
          verdict: 'weak',
          reason: 'Breadth without depth: none survive follow-up questions, and recruiters cannot tell them from clones.'
        },
        {
          name: 'One giant moonshot project',
          verdict: 'ok',
          reason: 'Impressive if finished, but high abandonment risk and shows range poorly.'
        }
      ],
      recommendation: 'Climb the ladder in order but budget unevenly: move briskly through rungs 1-9, then pick 3 flagships aligned with your target role (ML engineer: fraud detection, MLOps pipeline, recommender; data scientist: churn, A/B framework, EDA showcase) and take them to deployed, documented, demo-able depth.'
    },
    commonMistakes: [
      'Reporting accuracy on imbalanced problems instead of precision/recall or AUC — a red flag interviewers screen for',
      'READMEs that describe the code but never the problem, the baseline, or the result',
      'Using toy datasets for flagship projects when a messier real dataset would show real skill',
      'Ignoring the software engineering bar for ML engineer roles — many strong modelers fail the coding rounds'
    ],
    seniorNotes: 'Hiring managers scan portfolios for exactly three signals: can you frame a problem, can you evaluate honestly (baseline comparisons and error analysis impress more than high scores), and can you ship. Write a short post per flagship explaining decisions — communication is scored in every ML interview. Target roles empirically: read 20 job postings for each title in your market, tally required skills, and let that tally pick your flagships. Contributions to ML open source count as portfolio, often more than another solo repo.',
    interviewQuestions: [
      'Walk me through the ML project you are proudest of. What were the hardest decisions?',
      'What is the difference between a Data Scientist and an ML Engineer, and which are you targeting?',
      'Your model beat the baseline offline. How did you know it would actually help in the real world?'
    ],
    interviewAnswers: [
      'Strong answers follow an arc: the problem and why it mattered, the constraints (data size, label quality, latency), the baseline you started from, two or three real decisions with tradeoffs (e.g. chose gradient boosting over a neural net because tabular data and interpretability requirements; handled class imbalance with class weights after resampling hurt calibration), the measured result versus baseline, and one honest thing you would do differently. Interviewers probe decisions, so pick a project where you genuinely made them — this is why flagship depth beats tutorial breadth.',
      'A Data Scientist owns the question-to-model stage: framing problems, exploring data, building and validating models, designing experiments, and communicating findings — statistics and experimentation are the core bar. An ML Engineer owns the model-to-production stage: pipelines, serving infrastructure, monitoring, retraining loops — the software engineering bar is much higher and the modeling bar somewhat lower. Then state your target and back it with evidence: my flagship projects are a deployed fraud detector and an MLOps pipeline, so I am targeting ML engineer roles.',
      'Offline improvement is necessary but not sufficient — the offline metric is a proxy computed on historical data with its own biases. I checked three things: leakage (point-in-time correctness of every feature), a time-based holdout to simulate genuine future prediction rather than a random split, and error analysis by segment to confirm gains were not concentrated where they do not matter. The real confirmation is an online A/B test against the incumbent with guardrail metrics; where that was not possible, I shadow-deployed and compared live predictions to delayed labels before claiming victory.'
    ],
    codeExamples: [
      {
        lang: 'text',
        label: 'Flagship project README skeleton that survives interviews',
        code: "# Real-Time Fraud Detection\n\n## Problem\nCard-not-present fraud costs X; goal: flag transactions in < 50 ms\nwith precision high enough to keep false-positive reviews affordable.\n\n## Result (headline first)\nPR-AUC 0.83 vs 0.61 logistic-regression baseline.\nAt 90% precision: 71% recall. p95 latency 34 ms.\n\n## Data\n284k transactions, 0.17% fraud -> accuracy is meaningless here;\nreport precision/recall + PR-AUC. Time-based split, no random shuffle.\n\n## Decisions & tradeoffs\n- Gradient boosting over NN: tabular, faster iteration, explains scores\n- Class weights over SMOTE: resampling hurt probability calibration\n- Feature store lookups capped at 20 ms of the latency budget\n\n## What I'd do differently\nOnline learning for drift; the model degrades ~2% PR-AUC per month.\n\n## Run it\ndocker compose up  ->  demo at localhost:8000/docs"
      }
    ],
    resources: [
      { label: 'Kaggle Learn — competitions to anchor portfolio projects', url: 'https://www.kaggle.com/learn', kind: 'practice' },
      { label: 'Neural Networks: Zero to Hero — build flagship DL depth', url: 'https://karpathy.ai/zero-to-hero.html', kind: 'course' },
      { label: 'LLM Engineer Handbook — the modern ML engineer skill map', url: 'https://github.com/SylphAI-Inc/LLM-engineer-handbook', kind: 'repo' },
      { label: 'An Introduction to Statistical Learning — interview theory backbone', url: 'https://www.statlearning.com/', kind: 'book' }
    ]
  }
]
