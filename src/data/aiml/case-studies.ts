import type { CaseStudy } from '@/types'

/** Real-world ML case studies for the AI/ML In-Depth (math-first) course. */
export const AIML_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'netflix-prize-recommenders',
    company: 'Netflix',
    logo: '🎬',
    title: 'The Netflix Prize: Matrix Factorization, the $1M Ensemble That Never Shipped, and Modern Recommenders',
    industry: 'Streaming / Recommendations',
    scale: '2006-2009 competition · 100M ratings, 480K users, 17,770 movies · 10% RMSE improvement target',
    problem:
      'In 2006 Netflix ran on Cinematch, a recommender predicting how a user would rate a movie, and offered $1 million to any team that improved its root-mean-squared error by 10%. The public dataset — about 100 million ratings from 480,000 users across 17,770 movies — became the defining benchmark of collaborative filtering. The core difficulty is extreme sparsity: the full user-movie matrix has roughly 8.5 billion cells but barely 1% are filled, so the model must infer taste from very few observations per user while avoiding overfitting to quirks of who happens to rate what.\n\nBeyond sparsity, the data hid structural effects that simple neighborhood methods missed: systematic user biases (some people rate everything harshly), item biases (blockbusters get inflated ratings), and temporal dynamics — a user\'s standards drift over years, and movies age differently. Squeezing out the final percentage points of RMSE meant modeling all of these simultaneously, which is what turned a ratings contest into a three-year applied research marathon involving thousands of teams.',
    solution:
      'The breakthrough workhorse was matrix factorization, popularized by Simon Funk\'s SVD-style approach: represent each user and each movie as a low-dimensional latent vector (say 50-200 factors) such that the predicted rating is the dot product of the two, plus learned user and item bias terms. Instead of computing a classical SVD (impossible with missing entries), the factors are learned by stochastic gradient descent directly on the observed ratings with L2 regularization — a beautiful, concrete instance of "define a loss, take gradients, regularize." Latent dimensions turned out to capture interpretable axes like serious-vs-escapist or male-vs-female skew without being told to.\n\nRefinements stacked up: SVD++ folded in implicit feedback (the mere fact that a user rated a movie is signal, regardless of the score), and timeSVD++ added time-dependent user and item biases to capture drift. The final 10.06% winning entry from BellKor\'s Pragmatic Chaos in 2009 was a blend of over 100 models — factorization variants, neighborhood models, and restricted Boltzmann machines — combined with gradient boosted trees.\n\nThe famous punchline: Netflix never fully deployed the winning ensemble. They adopted two component models (an SVD variant and RBMs) that delivered most of the gain, and judged that the remaining accuracy from the 100+ model blend was not worth the engineering cost of building, serving, and maintaining it in production. By then the business had also shifted from DVD-queue star ratings to streaming, where implicit signals (what you actually watch and finish) mattered far more than predicted star ratings.',
    architecture:
      'The matrix factorization architecture is the conceptual ancestor of modern embedding systems: users and items as learned vectors in a shared latent space, trained by SGD on observed interactions with bias terms and regularization. This exact idea — co-embedding two entity types so a cheap similarity operation predicts affinity — reappears in today\'s two-tower neural recommenders, where deep networks encode users and items into embeddings whose dot product drives retrieval.\n\nModern production recommenders (including Netflix\'s) are two-stage systems shaped by latency: a candidate generation stage uses embeddings with approximate nearest-neighbor search to cut millions of items to hundreds in milliseconds, then a heavier ranking model — gradient boosting or a deep network with rich contextual features — precisely orders that shortlist. Training moved from explicit star ratings to implicit feedback (plays, completion rates, time of day), which is more abundant and more honest about actual behavior.\n\nThe lasting architectural lesson from the Prize is the accuracy-complexity frontier: offline metric gains follow diminishing returns while serving complexity grows roughly linearly with ensemble size. Production systems sit deliberately below the leaderboard-optimal point, choosing models that are retrainable daily, debuggable, and cheap to serve over blends that win benchmarks.',
    techStack: ['Matrix factorization (Funk SVD)', 'SVD++ / timeSVD++', 'Stochastic gradient descent', 'L2 regularization', 'Restricted Boltzmann Machines', 'Gradient boosted trees (blending)', 'Two-tower embeddings (modern)', 'Approximate nearest neighbor search'],
    keyDecisions: [
      {
        decision: 'Learn latent factors via SGD on observed ratings instead of classical SVD on the full matrix',
        why: 'Classical SVD requires a complete matrix, and imputing 99% missing values both distorts the signal and is computationally infeasible at 8.5B cells. SGD touches only the 100M observed entries and lets regularization control overfitting directly.',
        tradeoffs: 'Iterative optimization gives up the closed-form guarantees of true SVD, introduces hyperparameters (learning rate, factor count, regularization strength), and requires careful tuning — but it is the only approach that scales and it generalizes far better.',
      },
      {
        decision: 'Model user and item biases explicitly before any interaction term',
        why: 'A large share of rating variance is explained by "this user rates harshly" and "this movie is broadly loved" — effects that have nothing to do with personalized taste. Separating biases lets the latent factors spend their capacity on genuine user-item interaction.',
        tradeoffs: 'More parameters and a slightly more complex model, and bias terms need their own regularization. But without them, factors waste dimensions re-deriving global effects, hurting both accuracy and interpretability.',
      },
      {
        decision: 'Deploy only two component models from the winning 100+ model ensemble',
        why: 'The two models captured most of the accuracy gain at a fraction of the engineering cost. Serving a 100-model blend means 100 pipelines to retrain, monitor, version, and debug — for a marginal RMSE gain users barely perceive, on a star-rating objective the streaming business was outgrowing anyway.',
        tradeoffs: 'Leaves measurable offline accuracy on the table and means the prize-winning artifact was partly symbolic. But it traded leaderboard optimality for maintainability, iteration speed, and alignment with where the product was actually heading.',
      },
    ],
    results: [
      'BellKor\'s Pragmatic Chaos achieved a 10.06% RMSE improvement in 2009, winning the $1M prize after three years',
      'Netflix productionized two component models (SVD variant + RBMs), which delivered the bulk of the practical gain',
      'The full winning ensemble was never deployed — engineering cost outweighed the marginal accuracy',
      'Matrix factorization became the standard collaborative filtering technique across the industry for a decade',
      'The competition popularized latent factor models and directly influenced modern embedding-based recommenders',
    ],
    lessonsLearned: [
      'Offline metric gains follow diminishing returns while system complexity compounds — production models live below the leaderboard frontier',
      'Simple structure captures most signal: bias terms plus a modest factorization got most of the way; the last 1-2% needed 100+ models',
      'Model the objective you actually care about — star-rating RMSE lost relevance once streaming made implicit engagement the real signal',
      'Embeddings learned by gradient descent on interactions is a foundational, transferable pattern — from Funk SVD to two-tower networks',
      'Competitions optimize accuracy under no operational constraints; production optimizes accuracy per unit of maintenance cost',
    ],
    relevantTopics: ['ml-system-design', 'maximum-likelihood', 'model-evaluation', 'gradient-boosting', 'feature-engineering'],
    estimatedMins: 25,
  },

  {
    id: 'tabular-boosting-dominance',
    company: 'Kaggle / Industry',
    logo: '🌲',
    title: 'Why Gradient Boosting Dominates Tabular Data: The XGBoost/LightGBM Story',
    industry: 'Cross-industry (finance, insurance, e-commerce, ads)',
    scale: 'Majority of winning solutions on tabular Kaggle competitions since 2015 · default model for structured data across industry',
    problem:
      'By the mid-2010s deep learning had conquered images, speech, and text, and the natural expectation was that neural networks would displace everything else. Yet on tabular data — the rows-and-columns data of credit scoring, churn, pricing, fraud, and demand forecasting that constitutes most business ML — deep models kept losing. Kaggle provided an unusually clean natural experiment: thousands of teams, identical data, pure leaderboard selection pressure. The consistent winner on structured data was gradient boosted decision trees, first via XGBoost (2014) and later LightGBM and CatBoost.\n\nThe question practitioners had to answer was why. Tabular data differs fundamentally from images: features are heterogeneous (a column of ages next to a column of countries next to a transaction amount), individually meaningful, uncorrelated in structure, and frequently riddled with missing values and outliers. There is no spatial or sequential regularity for convolutions or attention to exploit, and datasets are often thousands to millions of rows rather than billions — too small for deep nets to learn robust representations from scratch.',
    solution:
      'Gradient boosting builds an ensemble of shallow decision trees sequentially, where each new tree is fit to the negative gradient of the loss with respect to the current ensemble\'s predictions — literally gradient descent in function space. Squared error makes this "fit the residuals"; the framework generalizes to any differentiable loss, giving one algorithm for regression, classification, and ranking. The math-first insight: boosting attacks bias step by step with a learning rate shrinking each tree\'s contribution, while tree depth, subsampling, and regularization keep variance in check.\n\nXGBoost\'s contribution was making this rigorous and fast: a second-order Taylor expansion of the loss (using both gradient and Hessian) yields closed-form optimal leaf weights and a principled split-gain formula with explicit L1/L2 regularization built into the objective. Add native missing-value handling (each split learns a default direction for missing entries), column and row subsampling, sparsity-aware algorithms, and parallelized split-finding, and you get a model that digests messy real-world tables with minimal preprocessing. LightGBM pushed speed further with histogram-based splits and leaf-wise growth; CatBoost solved principled categorical encoding with ordered target statistics.\n\nWhy trees beat neural nets here: axis-aligned splits natively match the decision-boundary structure of heterogeneous features, are invariant to monotonic transforms (no scaling or normalization needed), are robust to outliers (splits depend on order, not magnitude), and act as built-in feature selection by simply ignoring uninformative columns. Neural networks must learn all of that from data — smooth function approximators struggle with the sharp, irregular conditional structure tabular targets typically have, a finding formalized by Grinsztajn et al. (2022), who showed tree ensembles retain an edge on typical-scale tabular benchmarks.',
    architecture:
      'A production tabular ML stack is refreshingly compact. Features flow from a warehouse or feature store into a training pipeline; the model is a single gradient-boosted ensemble trained in minutes to hours on CPUs — no GPU cluster required. Hyperparameter search (learning rate, tree depth or leaf count, subsampling rates, regularization) runs with early stopping against a validation set, and the artifact ships as a small file servable at sub-millisecond latency per row. Retraining daily or weekly is cheap enough to be routine, which matters more in drifting business domains than any single-shot accuracy edge.\n\nThe practitioner playbook this created: establish a boosting baseline first, then spend the project budget on feature engineering rather than architecture search. Point-in-time correct aggregates, ratios, and recency features move tabular metrics far more than model swaps. Interpretability tooling matured around trees too — split-gain importances and SHAP values give per-prediction attributions that satisfy regulators in credit and insurance, something deep tabular models still struggle to match cleanly.\n\nDeep learning does earn its place at the edges: when tables mix with text, images, or sequences (multimodal), when embeddings of very high-cardinality entities must transfer across tasks, or at extreme data scale where learned representations pay off. Architectures like TabNet and FT-Transformer occasionally match boosting on benchmarks, but rarely beat it consistently enough to displace it, and hybrid systems often feed neural embeddings INTO a boosted model as features — using each tool for the structure it exploits best.',
    techStack: ['XGBoost', 'LightGBM', 'CatBoost', 'scikit-learn', 'Optuna / hyperparameter search', 'SHAP (interpretability)', 'Pandas / Polars', 'Feature stores'],
    keyDecisions: [
      {
        decision: 'Fit each tree to the gradient of the loss rather than to the raw targets',
        why: 'Framing boosting as gradient descent in function space decouples the algorithm from any specific loss: plug in a differentiable objective (log loss, quantile, ranking) and the same machinery optimizes it. Second-order (Hessian) information gives closed-form leaf values and principled, regularized split gains.',
        tradeoffs: 'Sequential fitting cannot parallelize across trees (only within them), training is sensitive to learning rate and tree count, and boosting will chase label noise in residuals if not restrained by early stopping and subsampling.',
      },
      {
        decision: 'Handle missing values natively with learned default split directions instead of requiring imputation',
        why: 'Real tables are full of missing values, and missingness is frequently informative (a blank income field correlates with outcomes). Learning which branch missing values should take preserves that signal and eliminates an error-prone preprocessing stage.',
        tradeoffs: 'The learned defaults are optimized for training-time missingness patterns; if the missingness mechanism shifts in production, the routing can silently degrade. Explicit imputation plus indicators is more transparent when auditability is paramount.',
      },
      {
        decision: 'Default to gradient boosting for tabular problems; reserve deep learning for multimodal or representation-transfer cases',
        why: 'Trees exploit the actual structure of tabular data — heterogeneous, individually meaningful features with sharp conditional effects — while training in minutes on CPUs with strong out-of-the-box accuracy and mature interpretability. That default maximizes accuracy per unit of engineering effort.',
        tradeoffs: 'Boosted trees cannot extrapolate beyond the training range of a feature, do not produce reusable embeddings, and plateau on raw unstructured inputs. Teams over-committed to the default can miss cases where joint neural modeling of text/image/tabular signals wins.',
      },
    ],
    results: [
      'Gradient boosting became the winning approach in the large majority of tabular Kaggle competitions since roughly 2015',
      'XGBoost/LightGBM became the industry default for credit risk, fraud, churn, pricing, and demand forecasting',
      'Training runs on CPUs in minutes-to-hours — orders of magnitude cheaper than deep tabular alternatives',
      'Rigorous benchmarks (e.g. Grinsztajn et al. 2022) confirmed tree ensembles still outperform deep models on typical tabular datasets',
      'SHAP-on-trees became a de facto interpretability standard, enabling deployment in regulated domains',
    ],
    lessonsLearned: [
      'Inductive bias beats raw capacity: the model whose structural assumptions match the data wins, and tabular structure fits axis-aligned splits',
      'Boosting reduces bias sequentially, bagging reduces variance in parallel — knowing which error term dominates tells you which ensemble to reach for',
      'On tabular problems, feature engineering moves metrics more than model architecture — budget accordingly',
      'Cheap retraining and interpretability are production features as real as accuracy, and trees deliver both',
      'Benchmark hype generalizes poorly across data modalities — validate on your own data before importing conclusions from images and text',
    ],
    relevantTopics: ['gradient-boosting', 'bias-variance-tradeoff', 'feature-engineering', 'model-evaluation', 'train-test-cross-validation'],
    estimatedMins: 25,
  },

  {
    id: 'realtime-fraud-detection',
    company: 'PayPal / Stripe (pattern)',
    logo: '💳',
    title: 'Real-Time Fraud Detection: Streaming Features, Extreme Imbalance, and the Precision-Recall Business Tradeoff',
    industry: 'Payments / Fintech',
    scale: 'Thousands of transactions/sec · decisions in under ~100ms · fraud rate well under 1% of transactions',
    problem:
      'Payment processors like PayPal and Stripe must decide, for every transaction, whether to approve, decline, or escalate — in roughly 100 milliseconds, while the customer waits at checkout. The statistical problem is brutal: fraud is typically a small fraction of one percent of transactions, so a model that approves everything is 99.9% accurate and completely useless. Every metric, threshold, and training decision has to be built for extreme class imbalance.\n\nThe errors have asymmetric and quantifiable business costs. A false negative (missed fraud) costs the transaction amount plus chargeback fees and, if rates climb, penalties from card networks. A false positive (declining a legitimate customer) costs the sale, support load, and often the customer relationship — industry studies repeatedly find false-decline losses rival or exceed direct fraud losses. On top of this, the adversary adapts: fraudsters actively probe defenses and shift tactics within days, so any static model decays quickly. And ground-truth labels arrive weeks late, since fraud is often only confirmed when a chargeback lands 30-90 days after the transaction.',
    solution:
      'The modeling core is supervised classification — gradient boosted trees remain the workhorse, sometimes alongside neural models — trained on historical transactions with confirmed outcomes. Imbalance is handled with class weighting and, critically, by abandoning accuracy for precision-recall analysis: the operating threshold is chosen on a validation set by minimizing expected cost, where each false negative costs the fraud amount and each false positive costs margin and customer lifetime value. That turns an abstract PR curve into a concrete business dial: move the threshold and you are literally trading fraud losses against declined revenue. Different segments get different thresholds — a $5,000 first-time transaction and a $10 repeat purchase deserve different risk appetites.\n\nThe decisive engineering is in features, not the classifier. Predictive power comes from behavioral velocity: transactions per card in the last 5 minutes, distinct merchants in the last hour, deviation of amount from the customer\'s history, distance between current and previous transaction locations, device and network fingerprints. These are computed by stream processors (Kafka plus Flink-style aggregation) and materialized into an online feature store for millisecond reads at decision time, with the same feature definitions used to backfill training data — killing train/serve skew.\n\nNo production system is model-only: a rules layer runs alongside the model. Rules encode hard constraints (sanctions lists, impossible-travel checks) and give the fraud operations team a same-day response to a new attack pattern, while the model handles subtle statistical patterns and gets retrained on a rapid cadence. Mid-risk scores route to human review queues or step-up authentication (3-D Secure), and analyst decisions feed back as fresh labels. Delayed chargeback labels are handled by training on data old enough for outcomes to mature and by monitoring leading indicators — score distributions, decline rates, feature drift — instead of waiting on lagged precision numbers.',
    architecture:
      'The serving path is a low-latency pipeline: the transaction event hits a decision service, which fetches dozens of precomputed features from the online store (single-digit milliseconds), runs model inference (a boosted-tree forward pass is sub-millisecond), applies the rules engine and thresholds, and returns approve/decline/review with a full audit trail. The heavy computation lives off the request path in stream processors maintaining sliding-window aggregates and entity graphs (cards linked to devices, emails, addresses — fraud rings surface as dense subgraphs).\n\nThe offline half mirrors the online half: the same feature definitions backfill point-in-time-correct training sets, models retrain on schedules measured in days rather than months, and every candidate ships through shadow mode first — scoring live traffic without acting — so its decisions can be compared with the incumbent before a gradual rollout. Rollback is instant because model artifacts are versioned and the previous model stays hot.\n\nMonitoring is unusually rich because the adversary is active: score-distribution shift, per-segment decline rates, feature drift, rule hit rates, and review-queue precision all alert long before chargeback-confirmed metrics move. The system is explicitly a human-machine loop — models catch what rules cannot generalize, rules react faster than retraining, review analysts arbitrate uncertainty and generate labels — and the design goal is not maximizing any single metric but minimizing total cost (fraud losses plus false declines plus review operations) under a hard latency budget.',
    techStack: ['XGBoost / LightGBM', 'Kafka (event streaming)', 'Flink / Spark Streaming (aggregations)', 'Redis-class online feature store', 'Rules engine', 'Graph features (entity linking)', 'Python / scikit-learn', 'Shadow deployment & canary rollout'],
    keyDecisions: [
      {
        decision: 'Choose the decision threshold from an explicit business cost matrix, not a default 0.5 or max-F1',
        why: 'False negatives and false positives have measurable, very different dollar costs. Minimizing expected cost on the validation set aligns the classifier with actual economics, and makes the tradeoff legible to non-ML stakeholders: this threshold means X fraud loss versus Y declined revenue.',
        tradeoffs: 'Requires maintaining honest cost estimates (customer lifetime value is fuzzy) and revisiting them as the business changes. Per-segment thresholds multiply tuning and monitoring surface area, and a wrong cost estimate silently mis-calibrates the whole system.',
      },
      {
        decision: 'Run a hybrid of ML model plus hand-written rules instead of a pure model',
        why: 'Rules deploy in hours when a new attack pattern emerges — retraining and validating a model takes days. Rules also encode hard compliance constraints that must never be probabilistic, and give fraud analysts direct, auditable control.',
        tradeoffs: 'Rule sets accumulate into unmanaged complexity that fights the model (double-penalizing some segments), and their interactions are hard to reason about. Requires governance: rule expiry dates, hit-rate monitoring, and periodic migration of stable rules into model features.',
      },
      {
        decision: 'Invest in streaming velocity features and an online feature store before more sophisticated models',
        why: 'Fraud signal lives in short-horizon behavior — a stolen card is burned fast and unusually. A simple model with 5-minute velocity features beats a sophisticated model on stale batch features, and the online store is what makes such features available within the latency budget.',
        tradeoffs: 'Streaming infrastructure is a significant operational commitment (exactly-once semantics, backfill correctness, late events), and keeping offline training features exactly consistent with online serving values is a permanent engineering discipline, not a one-time task.',
      },
    ],
    results: [
      'Decisions delivered within the ~100ms checkout budget across thousands of transactions per second',
      'Fraud loss rates held to small fractions of a percent of volume while limiting false declines on legitimate customers',
      'New attack patterns countered same-day via the rules layer, with model retraining following in days',
      'Shadow deployment and versioned rollback made model updates routine and low-risk',
      'Review-queue feedback loop supplied fresh labels, partially compensating for 30-90 day chargeback label delay',
    ],
    lessonsLearned: [
      'Under extreme imbalance, accuracy is meaningless — precision-recall tradeoffs priced in dollars are the real objective',
      'The threshold is a business decision wearing a math costume: cost matrices make it explicit and negotiable with stakeholders',
      'Feature freshness beats model sophistication when behavior changes in minutes — invest in streaming features first',
      'Against an adaptive adversary, drift is guaranteed: continuous retraining, leading-indicator monitoring, and a fast rules layer are structural requirements',
      'Delayed labels reshape everything downstream — training windows, evaluation honesty, and what monitoring can even tell you in the first weeks',
    ],
    relevantTopics: ['anomaly-detection', 'model-evaluation', 'ml-system-design', 'mlops-pipelines', 'feature-engineering', 'gradient-boosting'],
    estimatedMins: 30,
  },
]
