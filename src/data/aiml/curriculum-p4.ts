import type { CurriculumTopic } from '@/types'

/** AI/ML In-Depth — Phase 4: Core Machine Learning (10 topics). */
export const AIML_P4: CurriculumTopic[] = [
  {
    id: 'ml-project-workflow',
    phase: 4,
    phaseName: 'Core Machine Learning',
    orderIndex: 1,
    estimatedMins: 45,
    prerequisites: ['eda-process', 'pandas-fundamentals', 'regression-statistics'],
    title: 'The ML Project Workflow',
    eli5:
      'Before a doctor prescribes medicine, they ask questions, examine you, and form a theory about what is wrong. Machine learning works the same way: before touching any algorithm, you study the industry, stare at the data, guess what might drive the thing you want to predict, and check those guesses with simple charts. Only then do you try models — starting with the simplest ones, like trying rest and water before surgery.',
    analogy:
      'A good ML project is detective work, not a slot machine. The bad data scientist is a slot-machine player: throw the data at XGBoost, pull the lever, pray. The detective first studies the neighborhood (the industry), interviews witnesses (EDA), forms suspects (hypotheses about what influences the target), checks alibis (correlations and scatter plots), gathers hard evidence (engineered features from domain knowledge), and only accuses someone when the simple explanation fails. Simple model first, complex model only when the evidence demands it.',
    explanation:
      'The workflow that separates professionals from tutorial-followers has a fixed order. Step 1: research the industry — read about how the domain works, what experts believe drives outcomes, what data is typically available and what is illegal or leaky to use. Step 2: look at the data — distributions, missing values, outliers, target balance; no modeling yet. Step 3: write explicit hypotheses about what influences the target (for house prices: location, area, age, school quality). Step 4: test each hypothesis with correlations and scatter plots — keep what the data supports, discard what it refutes, and note surprises. Step 5: design features from domain knowledge (price per square meter, distance to city center, rooms per person). Step 6: model with SIMPLE algorithms first — linear regression, logistic regression, a small decision tree. They train in seconds, are interpretable, and set an honest baseline. Step 7: only if the baseline is insufficient, move to complex models — random forests, gradient boosting, SVMs — and now you can quantify exactly what the complexity buys you. Alongside this workflow, learn every algorithm with the Genius Move, a 3-step method: (1) implement it from scratch in Python/NumPy so you understand the machinery, (2) implement it with scikit-learn on a toy dataset so you learn the production API, (3) run BOTH on a real dataset and compare results — if they disagree, you have found a bug or a lesson. This triple pass turns every algorithm from a black box into a tool you own.',
    technicalDeep:
      'Why simple-first is technically sound, not just pedagogy: (a) Baselines bound your problem — if logistic regression gets 88% and XGBoost gets 89%, the signal is mostly linear and you should invest in features, not models; if the gap is 15 points, you have strong interactions/non-linearity worth modeling. (b) Simple models expose data problems fast: a linear regression with an R-squared of 0.99 on real-world tabular data almost always means target leakage — a feature that would not exist at prediction time. Complex models hide the same leak inside high accuracy you might believe. (c) Occam and variance: with n samples and p features, complex models carry higher estimation variance; when n/p is small, simple models are often genuinely optimal, not just convenient. (d) Interpretability compounds: linear coefficients and tree splits feed back into your hypothesis list, improving features for every later model. The hypothesis-driven loop also mirrors the statistical framing: EDA generates hypotheses, correlation analysis is a cheap screen (remember r only captures linear/monotonic association — always plot), feature engineering encodes the surviving hypotheses, and model comparison is the controlled experiment. Finally, the Genius Move has a deep rationale: the from-scratch pass forces you to internalize the loss function and update rule (where all debugging knowledge lives), the sklearn toy pass teaches API contracts (fit/predict/transform, hyperparameters), and the real-data comparison teaches numerical reality — regularization defaults, scaling sensitivity, convergence warnings — differences that only surface when the data is messy.',
    whatBreaks:
      'Skipping industry research produces leaky features (using data recorded after the target event, like using days_in_hospital to predict admission) and illegal ones (protected attributes). Skipping EDA means outliers and 999-coded missing values silently poison training. Starting with complex models breaks debugging: when XGBoost underperforms you cannot tell whether the problem is data, features, hyperparameters, or the model — with no baseline there is no reference point. Hypothesis-free feature engineering degenerates into generating hundreds of random features, which inflates spurious correlations and overfits validation through repeated peeking. Believing correlation heatmaps without scatter plots misses non-linear relationships (r near 0 for a perfect U-shape) and outlier-driven fake correlations.',
    efficientWay: {
      title: 'Running an ML project end to end',
      approaches: [
        {
          name: 'Hypothesis-driven workflow: industry research -> EDA -> hypotheses -> correlation/scatter checks -> domain features -> simple models -> complex models, learning each algorithm with the Genius Move 3-step (from scratch -> sklearn toy -> both on real data)',
          verdict: 'best',
          reason: 'Every step feeds the next: research prevents leakage, EDA grounds hypotheses, verified hypotheses become features, baselines quantify what complexity buys. The Genius Move ensures you understand every tool you deploy.',
        },
        {
          name: 'Kaggle-style: jump to gradient boosting plus heavy hyperparameter tuning immediately',
          verdict: 'ok',
          reason: 'Competitive on leaderboards where data is pre-cleaned and leakage is curated away, but it trains no diagnostic skill and fails hard on real business problems where data quality and problem framing dominate.',
        },
        {
          name: 'Auto-ML or copy-paste a notebook and change the file path',
          verdict: 'weak',
          reason: 'Zero understanding transfers. The first distribution shift, leak, or stakeholder question about WHY the model predicts something leaves you helpless.',
        },
      ],
      recommendation:
        'Pick one Kaggle dataset in a domain you can research (housing, churn, credit). Spend the first session with zero modeling: write 5 hypotheses, verify each with a plot, engineer 3 features from domain sense. Then fit linear/logistic regression as the baseline, and only afterwards a random forest — and write one paragraph on what the extra complexity bought. Repeat this ritual until it is reflex.',
    },
    commonMistakes: [
      'Opening the dataset and calling model.fit within the first ten minutes — no research, no hypotheses, no EDA',
      'Testing hypotheses only with a correlation heatmap and never scatter plots, missing non-linear and outlier-driven relationships',
      'Starting with the most powerful model, then having no baseline to explain what it adds or to detect leakage when accuracy is suspiciously high',
      'Treating the workflow as one-way: hypotheses that fail should update your industry understanding, and model errors should generate new hypotheses',
    ],
    seniorNotes:
      'In industry, the workflow steps have owners and artifacts: industry research becomes a problem-framing doc reviewed with domain experts; the hypothesis list becomes the feature spec; the simple baseline goes in the experiment tracker as the reference every candidate must beat by a pre-agreed margin. Seniors kill projects at step 2 when EDA shows the target is unpredictable or the data is leaky — the cheapest possible failure. A suspiciously strong baseline (R-squared > 0.95 on messy business data) triggers a leakage audit before celebration. And the number-one signal in hiring: candidates who explain WHAT they would look at before modeling versus candidates whose first word is XGBoost.',
    interviewQuestions: [
      'Walk me through how you would approach a brand-new ML problem, say predicting customer churn for a telecom company.',
      'Why start with simple models like linear or logistic regression instead of going straight to gradient boosting?',
      'Your first model gets 99% accuracy. What do you do?',
    ],
    interviewAnswers: [
      'First, research the domain: how telecom churn works, typical drivers (contract type, tenure, price increases, service complaints), and what data would leak (e.g., a cancellation-call flag). Second, EDA: churn rate (class balance), distributions, missing data patterns. Third, explicit hypotheses: month-to-month contracts churn more, churn spikes after price increases, tenure is protective. Fourth, verify each with plots and group-by rates. Fifth, engineer features encoding the surviving hypotheses (tenure buckets, price-change deltas, complaint counts in last 90 days). Sixth, baseline with logistic regression — interpretable coefficients double-check the hypotheses. Only then try random forest or boosting, and report what the added complexity buys in the business metric, not just AUC.',
      'Three reasons. Baselines: a simple model quantifies how much signal is linear, so you know whether complexity is worth its cost in latency, interpretability, and maintenance. Diagnostics: simple models surface data problems — leakage shows up as impossible coefficients, and scaling issues show up immediately — whereas complex models absorb and hide them. Statistics: with limited data, low-variance simple models often genuinely generalize better. If logistic regression gets within a point of the ensemble, ship the simple one; it is cheaper to serve, explain, and debug.',
      'Suspect leakage before success. Check whether any feature is recorded after or because of the target (post-outcome timestamps, IDs correlated with the label, aggregates computed over the full dataset including the future). Verify the train/test split respects time if the data is temporal, and that no duplicate rows straddle the split. Retrain with suspicious features removed and see if accuracy falls to a plausible level. Also confirm the metric is meaningful — 99% accuracy on a 99%-negative class is the majority-class baseline. Celebration comes only after the audit passes.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'The workflow skeleton: hypotheses -> verification -> features -> simple baseline first',
        code: "import numpy as np\nimport pandas as pd\nfrom sklearn.datasets import fetch_california_housing\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.metrics import r2_score\n\n# STEP 2: look at the data (after STEP 1: reading about housing markets)\ndata = fetch_california_housing(as_frame=True)\ndf = data.frame\nprint(df.describe().T[['mean', 'std', 'min', 'max']])\nprint('missing values:', df.isna().sum().sum())\n\n# STEP 3: hypotheses (written BEFORE testing)\n# H1: median income drives house value (wealth buys houses)\n# H2: more rooms per household -> higher value (bigger homes)\n# H3: house age matters less than income (CA market intuition)\n\n# STEP 4: verify with correlations (and in a notebook: scatter plots!)\ntarget = 'MedHouseVal'\nfor col in ['MedInc', 'AveRooms', 'HouseAge']:\n    r = df[col].corr(df[target])\n    print('corr(', col, ',', target, ') =', round(r, 3))\n# MedInc ~0.69 (H1 supported), AveRooms ~0.15 (H2 weak!), HouseAge ~0.11 (H3 supported)\n\n# STEP 5: domain features encoding surviving hypotheses\ndf['rooms_per_person'] = df['AveRooms'] / df['AveOccup']\ndf['bedroom_ratio'] = df['AveBedrms'] / df['AveRooms']\n\nfeatures = ['MedInc', 'HouseAge', 'rooms_per_person', 'bedroom_ratio',\n            'Latitude', 'Longitude', 'Population']\nX_tr, X_te, y_tr, y_te = train_test_split(\n    df[features], df[target], test_size=0.2, random_state=42)\n\n# STEP 6: SIMPLE first — this is the baseline everything must beat\nlin = LinearRegression().fit(X_tr, y_tr)\nprint('linear baseline R2 :', round(r2_score(y_te, lin.predict(X_te)), 3))\n\n# STEP 7: complexity only now — and quantify what it buys\nrf = RandomForestRegressor(n_estimators=100, random_state=42).fit(X_tr, y_tr)\nprint('random forest  R2 :', round(r2_score(y_te, rf.predict(X_te)), 3))\n# The GAP between these two numbers is the value of non-linearity here\n# (mostly geography) — that gap, not hype, justifies the complex model.",
      },
      {
        lang: 'python',
        label: 'The Genius Move in miniature: from-scratch model vs sklearn on the same data',
        code: "import numpy as np\nfrom sklearn.datasets import fetch_california_housing\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\n\nX, y = fetch_california_housing(return_X_y=True)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Step 1 of the Genius Move: from scratch (normal equation)\nXb = np.column_stack([np.ones(len(X_tr)), X_tr])   # add bias column\ntheta = np.linalg.lstsq(Xb, y_tr, rcond=None)[0]    # solve least squares\npred_scratch = np.column_stack([np.ones(len(X_te)), X_te]) @ theta\n\n# Step 2 of the Genius Move: sklearn\nsk = LinearRegression().fit(X_tr, y_tr)\npred_sklearn = sk.predict(X_te)\n\n# Step 3 of the Genius Move: compare on REAL data\nprint('max prediction difference:', np.abs(pred_scratch - pred_sklearn).max())\n# ~1e-10 -> the library is doing exactly what you built. No more black box.\nprint('scratch intercept:', theta[0], '| sklearn intercept:', sk.intercept_)",
      },
    ],
    resources: [
      { label: 'ML roadmap — how to actually learn ML (video)', url: 'https://www.youtube.com/watch?v=wOTFGRSUQ6Q', kind: 'video' },
      { label: 'Kaggle Datasets — real data to practice the workflow', url: 'https://www.kaggle.com/datasets', kind: 'practice' },
      { label: 'Kaggle Learn — hands-on micro-courses', url: 'https://www.kaggle.com/learn', kind: 'practice' },
      { label: 'An Introduction to Statistical Learning', url: 'https://www.statlearning.com/', kind: 'book' },
    ],
  },
  {
    id: 'train-test-cross-validation',
    phase: 4,
    phaseName: 'Core Machine Learning',
    orderIndex: 2,
    estimatedMins: 40,
    prerequisites: ['ml-project-workflow', 'pandas-fundamentals'],
    title: 'Train/Test Split & Cross-Validation',
    eli5:
      'If a teacher gives students the exam questions to study from, everyone aces the exam but nobody actually learned. Models are the same: you must grade them on questions they have never seen. So you hide part of your data in a vault (the test set), train on the rest, and open the vault exactly once at the very end.',
    analogy:
      'The test set is a sealed exam kept in the principal safe. The training set is homework. Cross-validation is running five mock exams: each time a different fifth of the homework is held back as a mock exam, and you average the five mock scores to estimate real ability. Data leakage is a student who photographs the sealed exam — scores become fiction. And peeking at the sealed exam repeatedly to tune your studying is just slow-motion cheating.',
    explanation:
      'Generalization — performance on unseen data — is the only thing that matters in ML, and you can only measure it with data the model never touched. The holdout split reserves typically 20% as a test set used exactly once, at the end, for the final honest number. But a single split has two problems: the estimate is noisy (a lucky or unlucky 20% misleads you), and if you tune hyperparameters against it, you gradually overfit to it. K-fold cross-validation fixes the noise: split the training data into k folds (usually 5 or 10), train k times each holding out a different fold for validation, and average the k scores — every point gets used for both training and validation, giving a stabler estimate plus a standard deviation. The professional setup is three-way: train (fit models), validation or CV folds (tune hyperparameters, select models), test (final report, touched once). Stratified k-fold preserves class proportions per fold — essential for imbalanced classification. Time-series data forbids random splits entirely: you must train on the past and validate on the future, using expanding- or rolling-window splits. Data leakage — any path by which information from validation/test reaches training — is the most expensive bug in ML because it inflates offline metrics and only reveals itself as production failure.',
    technicalDeep:
      'Leakage taxonomy every practitioner must know: (1) Preprocessing leakage — fitting scalers, imputers, encoders, or feature selectors on the full dataset before splitting; the test distribution contaminates training statistics. Fix: fit transforms on training folds only, which is what sklearn Pipeline inside cross_val_score guarantees. (2) Duplicate/group leakage — near-duplicate rows or multiple rows per entity (patient, user) straddling the split; the model memorizes the entity. Fix: GroupKFold keyed on the entity ID. (3) Temporal leakage — random splits on time-ordered data let the model train on the future; features computed with future information (rolling means centered on the point) do the same. Fix: TimeSeriesSplit and strictly causal features. (4) Target leakage — features that are proxies for or consequences of the label. Statistics of the estimate: k-fold CV error is nearly unbiased for the error of a model trained on (k-1)/k of the data, but fold scores are correlated (shared training data), so the naive variance across folds understates true variance — treat CV std as a rough guide, not a confidence interval. Choosing k: k=5 or 10 balances bias (small k trains on less data, pessimistic bias) versus cost and variance; leave-one-out is nearly unbiased but expensive and can have high variance. Repeated k-fold with different seeds tightens comparisons between models. Nested CV — an outer loop for evaluation, an inner loop for hyperparameter tuning — is required when you need an unbiased estimate of a tuned pipeline, because tuning on the same folds you report on biases scores upward.',
    whatBreaks:
      'Scaling before splitting: the classic silent killer — test-set means and variances leak into training, inflating scores by a few points in ways that vanish in production. Tuning hyperparameters against the test set: after 50 experiments the test set has effectively become a validation set and your final number is a lie. Random splits on time series: the model learns from the future, looks brilliant offline, and collapses on deployment day one. Ignoring groups: two chest X-rays of the same patient on opposite sides of the split teach the model to recognize the patient, not the disease. Unstratified splits on a 2% positive-rate dataset can produce validation folds with almost no positives, making metrics meaningless.',
    efficientWay: {
      title: 'Setting up honest evaluation',
      approaches: [
        {
          name: 'Sklearn Pipeline (preprocessing + model as one object) evaluated with stratified/grouped/time-aware cross-validation; test set opened once at the end',
          verdict: 'best',
          reason: 'The Pipeline structurally prevents preprocessing leakage — transforms are re-fit inside each training fold automatically — and the CV choice matching the data structure (class imbalance, groups, time) closes the remaining leak paths.',
        },
        {
          name: 'Manual single train/test split with careful discipline about fitting transforms on train only',
          verdict: 'ok',
          reason: 'Correct when done carefully and fine for quick experiments, but the estimate is noisy, discipline erodes across a growing notebook, and every manual step is a leak opportunity.',
        },
        {
          name: 'Evaluate on training data, or tune hyperparameters directly against the test set',
          verdict: 'weak',
          reason: 'Training accuracy measures memorization, not learning. Tuning on the test set is unfalsifiable self-deception — the number you report has no relationship to production performance.',
        },
      ],
      recommendation:
        'Make this muscle memory: split off the test set FIRST and forget it exists; wrap every preprocessing step and the model in a Pipeline; evaluate with cross_val_score using StratifiedKFold (classification), GroupKFold (repeated entities), or TimeSeriesSplit (temporal). Report mean plus-or-minus std across folds. Touch the test set exactly once.',
    },
    commonMistakes: [
      'Fitting the scaler/imputer/encoder on the full dataset before splitting — the most common leakage bug in real code and Kaggle notebooks alike',
      'Running dozens of experiments against the test set, then reporting the best test score as if it were unbiased',
      'Using random k-fold on time-series or grouped data (multiple rows per user/patient), letting the model cheat via the future or via entity memorization',
      'Reporting a single CV mean with no standard deviation, then declaring a 0.2-point improvement a win when fold noise is 1.5 points',
    ],
    seniorNotes:
      'In production teams the evaluation protocol is designed BEFORE modeling and reviewed like code: split strategy, CV scheme, metric, and the rule for when the test set may be opened. Offline-online gaps are usually leakage or distribution shift, so seniors audit: is every feature available at prediction time, computed only from the past, and free of target contamination? For temporal products, backtesting with expanding windows replaces vanilla CV entirely. A cultural marker of mature teams: the test-set-touched-once rule is enforced socially — anyone caught iterating against the test set has their results voided. Also budget-aware: 5-fold CV means 5x training cost, so at deep-learning scale a single well-sized validation set plus multiple seeds is the standard compromise.',
    interviewQuestions: [
      'Why do we split data into train and test sets, and why should the test set be used only once?',
      'What is data leakage? Give three concrete examples and how to prevent each.',
      'When would you use k-fold cross-validation versus a single holdout split, and what changes for time-series data?',
    ],
    interviewAnswers: [
      'The goal of ML is generalization to unseen data, and training performance cannot measure that — a model can memorize its way to perfect training accuracy. The test set simulates unseen data, so it must stay untouched during training AND tuning. Every time you make a decision based on the test score, information flows from test to model; over many decisions the test set becomes an implicit validation set and its score drifts optimistically away from true production performance. Hence: tune on validation or CV folds, open the test vault once for the final report.',
      'Leakage is any channel through which information unavailable at prediction time influences training. Examples: (1) preprocessing leakage — fitting a StandardScaler on all data before splitting leaks test statistics into training; prevent with sklearn Pipelines so transforms fit only on training folds. (2) Group leakage — multiple records of the same patient split across train and test lets the model recognize the patient; prevent with GroupKFold on patient ID. (3) Target/temporal leakage — features computed after or because of the outcome, like account_closed_date for churn prediction, or random splits on time-ordered data; prevent with feature-availability audits and TimeSeriesSplit. The symptom is always the same: great offline metrics, production collapse.',
      'Use k-fold when data is small-to-medium and you need a low-variance estimate or a fair comparison between models — the mean and std across folds tell you whether a difference is real. Use a single holdout when training is expensive (deep learning) or data is plentiful enough that one validation set is representative. For time series, random CV is invalid because it trains on the future: use forward-chaining schemes (TimeSeriesSplit) where each fold trains on an initial segment and validates on the following window, mimicking deployment.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Leakage in action: scaling before vs after the split, measured',
        code: "import numpy as np\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold, train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.datasets import make_classification\n\n# Small, noisy, high-dim data makes leakage effects visible\nX, y = make_classification(n_samples=200, n_features=50, n_informative=5,\n                           flip_y=0.2, random_state=0)\n\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)\n\n# WRONG: fit the scaler on ALL data, then cross-validate\nX_leaky = StandardScaler().fit_transform(X)   # test stats leaked into transform\nleaky = cross_val_score(KNeighborsClassifier(), X_leaky, y, cv=cv)\n\n# RIGHT: Pipeline re-fits the scaler inside each training fold\nclean_model = make_pipeline(StandardScaler(), KNeighborsClassifier())\nclean = cross_val_score(clean_model, X, y, cv=cv)\n\nprint('leaky  CV accuracy: %.3f +/- %.3f' % (leaky.mean(), leaky.std()))\nprint('clean  CV accuracy: %.3f +/- %.3f' % (clean.mean(), clean.std()))\n# The leaky number is optimistically inflated — and the inflation is\n# exactly the gap you would 'lose' in production and never understand why.",
      },
      {
        lang: 'python',
        label: 'Choosing the right CV scheme: stratified, grouped, and time-series splits',
        code: "import numpy as np\nfrom sklearn.model_selection import (StratifiedKFold, GroupKFold, TimeSeriesSplit,\n                                     cross_val_score)\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.datasets import make_classification\n\nX, y = make_classification(n_samples=300, n_features=10, weights=[0.9, 0.1],\n                           random_state=1)\n\n# 1) Imbalanced classes -> StratifiedKFold keeps 10% positives in every fold\nskf = StratifiedKFold(n_splits=5, shuffle=True, random_state=1)\nprint('stratified:', cross_val_score(LogisticRegression(max_iter=1000), X, y, cv=skf).round(3))\n\n# 2) Repeated entities (e.g. 60 patients, 5 rows each) -> GroupKFold\n#    keeps all rows of one patient on ONE side of the split\ngroups = np.repeat(np.arange(60), 5)\ngkf = GroupKFold(n_splits=5)\nprint('grouped   :', cross_val_score(LogisticRegression(max_iter=1000), X, y,\n                                     cv=gkf, groups=groups).round(3))\n\n# 3) Temporal data -> TimeSeriesSplit trains on past, validates on future\ntscv = TimeSeriesSplit(n_splits=5)\nfor i, (tr_idx, va_idx) in enumerate(tscv.split(X)):\n    print('fold', i, '| train rows 0..%d' % tr_idx.max(),\n          '| validate rows %d..%d' % (va_idx.min(), va_idx.max()))\n# Note: validation indices are ALWAYS after training indices — no future peeking.",
      },
    ],
    resources: [
      { label: 'scikit-learn User Guide — cross-validation', url: 'https://scikit-learn.org/stable/user_guide.html', kind: 'docs' },
      { label: 'StatQuest — cross-validation, clearly explained', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Kaggle Learn — intermediate ML (leakage lesson)', url: 'https://www.kaggle.com/learn', kind: 'practice' },
    ],
  },
  {
    id: 'linear-regression-ml',
    phase: 4,
    phaseName: 'Core Machine Learning',
    orderIndex: 3,
    estimatedMins: 50,
    prerequisites: ['ml-project-workflow', 'train-test-cross-validation', 'gradient-descent', 'regression-statistics'],
    title: 'Linear Regression from Scratch to sklearn',
    eli5:
      'Linear regression draws the best straight line through a cloud of points. If bigger houses cost more, the line captures roughly how much more per square meter. Best line means the one whose total miss (measured as squared distances from the points to the line) is smallest. Everything else — the formulas, the code — is just machinery for finding that line.',
    analogy:
      'Imagine every data point pulling on a rigid rod with a rubber band. Each band pulls with force proportional to its stretch, and squared error means long stretches pull disproportionately hard. The rod settles where all the pulls balance — that equilibrium is the least-squares fit. The normal equation computes the equilibrium instantly with algebra; gradient descent finds it by letting the rod physically settle, one small adjustment at a time.',
    explanation:
      'The model: y_hat = w1 x1 + w2 x2 + ... + wn xn + b, or compactly y_hat = X theta with a column of ones absorbed into X for the bias. The loss is mean squared error, MSE = (1/m) sum (y_hat_i - y_i)^2 — a convex bowl in theta, so there is exactly one best answer. Two roads lead to it. Road 1, the normal equation: calculus says the minimum is where the gradient is zero, which solves in closed form to theta = (X^T X)^(-1) X^T y — one matrix computation, no learning rate, no iterations. Road 2, gradient descent: repeat theta <- theta - lr * (2/m) X^T (X theta - y) until convergence — scales to huge data and streaming settings where the normal equation cannot go. The Genius Move applies perfectly here: implement both roads in NumPy (about 15 lines), fit sklearn LinearRegression on a toy dataset, then run all of them on a real dataset like California Housing and confirm the coefficients agree to many decimal places. Reading the fit: coefficients are the predicted change in y per unit change of a feature holding others fixed (only meaningful when features are on comparable scales or standardized), and R-squared is the fraction of target variance the model explains.',
    technicalDeep:
      'Derivation sketch: L(theta) = (1/m) |X theta - y|^2; gradient = (2/m) X^T (X theta - y); setting to zero gives the normal equations X^T X theta = X^T y. If X^T X is invertible (full column rank), theta = (X^T X)^(-1) X^T y — this is also the maximum-likelihood estimate under Gaussian noise, connecting back to MLE. Numerics: never literally invert X^T X. Its condition number is the square of X condition number, so inversion amplifies floating-point error on correlated features; production solvers (including sklearn) use QR or SVD factorizations — np.linalg.lstsq is the NumPy equivalent. Perfect multicollinearity (a feature that is a linear combination of others, e.g., one-hot encoding all categories plus keeping the bias) makes X^T X singular: infinitely many solutions, wild coefficient signs. Complexity: normal equation costs O(m n^2 + n^3) — fine to n in the low thousands; gradient descent costs O(m n) per epoch and mini-batch SGD extends to arbitrarily large m. Gradient descent on unscaled features is crippled: the loss bowl becomes an elongated ravine with condition number driven by feature-scale ratios, forcing tiny learning rates — standardize first, always. Gauss-Markov theorem: among linear unbiased estimators, OLS has minimum variance if errors are homoscedastic and uncorrelated; violations (heteroscedasticity, autocorrelation) do not bias coefficients but invalidate their standard errors. Residual plots diagnose everything: curvature means missing non-linearity, funnel shape means heteroscedasticity, and both suggest transforms or richer features.',
    whatBreaks:
      'Multicollinearity: two nearly-identical features (house area in sq ft AND sq meters) make coefficients huge, opposite-signed, and meaningless — predictions stay fine, interpretation dies, and the normal equation may fail outright. Unscaled features silently destroy gradient descent convergence while leaving the normal equation untouched — a classic source of my from-scratch GD does not match sklearn confusion. Outliers: squared loss means one point 10x off pulls 100x hard; a single corrupted row can rotate the whole line. Extrapolation: the line happily predicts negative house prices outside the training range. Fitting a line to obviously curved data underfits no matter how much data you add — check residuals, not hope.',
    efficientWay: {
      title: 'Learning linear regression properly',
      approaches: [
        {
          name: 'The Genius Move 3-step: (1) implement the normal equation AND batch gradient descent from scratch in NumPy, (2) fit sklearn LinearRegression on a toy dataset, (3) run all three on a real dataset and compare coefficients and R-squared',
          verdict: 'best',
          reason: 'The scratch pass teaches the loss geometry, the algebra, and why scaling matters (your GD will visibly fail without it). The sklearn pass teaches the production API. The comparison pass proves they are the same thing and builds the verification habit.',
        },
        {
          name: 'Learn only sklearn: fit, predict, score, read the coefficients',
          verdict: 'ok',
          reason: 'Productive immediately and honestly sufficient for much applied work — but interviews ask for the derivation, and when GD diverges on unscaled features or coefficients look insane from collinearity, you will have no mental model to debug with.',
        },
        {
          name: 'Derive OLS theory exhaustively (Gauss-Markov, distribution of estimators) before writing any code',
          verdict: 'weak',
          reason: 'Theory-first without computation leaves you unable to actually fit a model, and most of the deep theory only clicks after you have seen the machinery run.',
        },
      ],
      recommendation:
        'Do the Genius Move today: 15 lines for the normal equation, 15 for gradient descent, 3 for sklearn, then California Housing for the comparison. When your GD disagrees with sklearn, do not skip past it — that disagreement (almost always scaling or learning rate) is the lesson.',
    },
    commonMistakes: [
      'Forgetting the bias column of ones in the from-scratch implementation, forcing the line through the origin and silently wrecking the fit',
      'Running gradient descent on unscaled features, watching it diverge or crawl, and concluding the algorithm is broken',
      'Interpreting raw coefficient magnitude as feature importance when features are on wildly different scales — standardize before comparing',
      'One-hot encoding all k categories while keeping the intercept, creating perfect multicollinearity (the dummy variable trap)',
    ],
    seniorNotes:
      'Linear regression remains the most-deployed model in industry — pricing, forecasting baselines, marketing mix, A/B effect estimation — because it is auditable, stable, cheap to serve, and its failure modes are fully understood. Seniors reach for statsmodels (not sklearn) when inference matters: standard errors, confidence intervals, p-values on coefficients. Know the collinearity playbook: variance inflation factor to detect, then drop/combine features or move to ridge. In interviews, the money question is normal equation versus gradient descent — the expected answer covers the O(n^3) solve versus O(mn) iterations tradeoff, conditioning, and why sklearn uses SVD-based least squares rather than matrix inversion.',
    interviewQuestions: [
      'Derive the gradient of the MSE loss for linear regression. What update rule does gradient descent follow?',
      'Compare the normal equation and gradient descent for fitting linear regression. When would you choose each?',
      'Your linear model has two highly correlated features and their coefficients have huge opposite signs. What is happening and what would you do?',
    ],
    interviewAnswers: [
      'With predictions y_hat = X theta and loss L = (1/m)|X theta - y|^2, expand and differentiate: grad L = (2/m) X^T (X theta - y) — the transpose of the design matrix times the residual vector, scaled. Gradient descent updates theta <- theta - lr * (2/m) X^T (X theta - y). Intuition: each feature column votes on its coefficient in proportion to how correlated it is with the current residuals; when residuals are orthogonal to every feature, the gradient is zero and you are at the unique minimum of the convex bowl.',
      'The normal equation theta = (X^T X)^(-1) X^T y is exact and hyperparameter-free but costs O(n^3) in the feature count and needs X^T X well-conditioned — great for n up to a few thousand, and in practice you solve via QR/SVD (lstsq) rather than inverting. Gradient descent is iterative, O(mn) per pass, needs a learning rate and feature scaling, but scales to millions of samples/features and to online settings. Rule of thumb: closed-form (or sklearn, which uses SVD) for typical tabular sizes; mini-batch SGD when data no longer fits or arrives as a stream.',
      'That is multicollinearity. The two columns carry nearly the same information, so infinitely many coefficient pairs produce almost identical predictions — the optimizer picks an unstable one, often huge and opposite-signed, and tiny data changes flip them. Predictions may remain fine; interpretation is destroyed and variance is inflated. Fixes: drop one feature, combine them (average, ratio, or a domain-meaningful composite), or use ridge regression, whose L2 penalty makes the solution unique and shrinks the pair toward shared, stable values. Diagnose with correlation matrices or VIF.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Genius Move step 1: linear regression from scratch — normal equation AND gradient descent',
        code: "import numpy as np\nnp.random.seed(42)\n\n# Toy data: y = 4 + 3x + noise\nm = 200\nX = 2 * np.random.rand(m, 1)\ny = 4 + 3 * X[:, 0] + np.random.randn(m)\n\nXb = np.column_stack([np.ones(m), X])   # bias column — do NOT forget this\n\n# --- Road 1: normal equation (closed form) ---\ntheta_ne = np.linalg.inv(Xb.T @ Xb) @ Xb.T @ y\n# production-grade equivalent (QR/SVD, numerically stable):\ntheta_lstsq = np.linalg.lstsq(Xb, y, rcond=None)[0]\nprint('normal equation :', theta_ne.round(4))     # ~[4, 3]\n\n# --- Road 2: batch gradient descent ---\ntheta = np.zeros(2)\nlr, epochs = 0.1, 500\nfor _ in range(epochs):\n    grad = (2 / m) * Xb.T @ (Xb @ theta - y)\n    theta = theta - lr * grad\nprint('gradient descent:', theta.round(4))         # ~[4, 3] — same answer\n\n# The two roads MUST agree (convex bowl, one minimum). If they do not,\n# the bug is yours: usually the bias column, the lr, or unscaled features.",
      },
      {
        lang: 'python',
        label: 'Genius Move steps 2-3: sklearn on real data, compared against your scratch build',
        code: "import numpy as np\nfrom sklearn.datasets import fetch_california_housing\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import r2_score\n\nX, y = fetch_california_housing(return_X_y=True)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Scale (fit on train only!) — required for GD, harmless for closed form\nscaler = StandardScaler().fit(X_tr)\nX_tr_s, X_te_s = scaler.transform(X_tr), scaler.transform(X_te)\n\n# sklearn (uses SVD-based least squares internally)\nsk = LinearRegression().fit(X_tr_s, y_tr)\n\n# scratch: normal equation via lstsq\nXb = np.column_stack([np.ones(len(X_tr_s)), X_tr_s])\ntheta = np.linalg.lstsq(Xb, y_tr, rcond=None)[0]\n\n# scratch: mini-batch SGD\nrng = np.random.default_rng(0)\nth = np.zeros(Xb.shape[1])\nfor epoch in range(50):\n    idx = rng.permutation(len(Xb))\n    for start in range(0, len(Xb), 64):\n        b = idx[start:start + 64]\n        th -= 0.01 * (2 / len(b)) * Xb[b].T @ (Xb[b] @ th - y_tr[b])\n\nXb_te = np.column_stack([np.ones(len(X_te_s)), X_te_s])\nprint('R2 sklearn        :', round(r2_score(y_te, sk.predict(X_te_s)), 4))\nprint('R2 normal equation:', round(r2_score(y_te, Xb_te @ theta), 4))\nprint('R2 mini-batch SGD :', round(r2_score(y_te, Xb_te @ th), 4))\nprint('coef diff (sk vs scratch):', np.abs(sk.coef_ - theta[1:]).max())\n# All three agree -> you now own this algorithm end to end.",
      },
    ],
    resources: [
      { label: 'StatQuest — Linear Regression, clearly explained', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'An Introduction to Statistical Learning — Ch. 3', url: 'https://www.statlearning.com/', kind: 'book' },
      { label: 'scikit-learn User Guide — linear models', url: 'https://scikit-learn.org/stable/user_guide.html', kind: 'docs' },
      { label: 'Andrew Ng — ML Specialization (regression course)', url: 'https://www.coursera.org/specializations/machine-learning-introduction', kind: 'course' },
    ],
  },
  {
    id: 'logistic-regression-ml',
    phase: 4,
    phaseName: 'Core Machine Learning',
    orderIndex: 4,
    estimatedMins: 50,
    prerequisites: ['linear-regression-ml', 'maximum-likelihood', 'gradient-descent'],
    title: 'Logistic Regression from Scratch to sklearn',
    eli5:
      'Sometimes the answer is not a number but a yes or no: will this email be spam, will this customer leave? Logistic regression computes a score from the inputs, then squashes it through an S-shaped curve so it lands between 0 and 1 — a probability. Score very negative: probability near 0. Very positive: near 1. Then you draw a line: above 50%, predict yes.',
    analogy:
      'Think of a strict but fair judge. Evidence for and against gets weighed and summed into a single score (the linear part). The sigmoid is the judge converting that score into a confidence: overwhelming evidence maps to 99% sure, weak evidence to 55%. Cross-entropy loss is how the judge is trained: being confidently wrong (said 99% guilty, was innocent) is punished brutally, being mildly wrong barely at all. The decision boundary is the tipping point where the evidence balances 50/50.',
    explanation:
      'Despite the name, logistic regression is THE fundamental classification algorithm. Mechanics: compute a linear score z = w . x + b, then map it to a probability with the sigmoid p = 1 / (1 + e^(-z)). The sigmoid squashes any real number into (0, 1), crossing 0.5 exactly at z = 0 — so the decision boundary (where the model is maximally unsure) is the hyperplane w . x + b = 0, a straight line in 2D. Training cannot use squared error (it becomes non-convex through the sigmoid and its gradients vanish when badly wrong); instead we maximize likelihood, equivalently minimize cross-entropy loss: L = -(1/m) sum [y log p + (1 - y) log(1 - p)]. This loss is convex in the weights, punishes confident wrong predictions without bound, and — the small miracle — its gradient works out to exactly the same form as linear regression: (1/m) X^T (p - y), residuals times features. Gradient descent (or better second-order solvers) finds the unique optimum. Outputs are genuine probabilities (reasonably well calibrated), coefficients are interpretable as log-odds changes, and the 0.5 threshold is adjustable: lower it when missing a positive is expensive (disease screening), raise it when false alarms are expensive.',
    technicalDeep:
      'The likelihood view: model y | x as Bernoulli(p(x)) with p = sigmoid(w.x + b). The negative log-likelihood IS the cross-entropy — so logistic regression is MLE, connecting directly to Phase 1. Derivation of the gradient: dL/dz for one sample is (p - y) — the beautiful cancellation of sigmoid derivative s(1-s) against the log terms — hence grad_w L = (1/m) X^T (p - y). The log-odds view: log(p / (1 - p)) = w . x + b, so each unit increase in x_j multiplies the odds by e^(w_j) — the standard interpretation in medicine and credit scoring. Convexity: the Hessian is (1/m) X^T S X with S diagonal, entries p_i (1 - p_i) > 0, hence PSD — a unique global optimum. Solvers: sklearn defaults to lbfgs (quasi-Newton, uses curvature, converges in tens of iterations versus thousands for vanilla GD); newton-cholesky excels when n_samples >> n_features; saga handles L1 and huge sparse data. Perfect separation pathology: if a hyperplane separates classes perfectly, MLE pushes |w| to infinity (probabilities to hard 0/1) — sklearn applies L2 regularization by default (C=1.0) partly for this reason; statsmodels will instead warn. Multiclass: softmax (multinomial) generalizes sigmoid; cross-entropy carries over. Calibration: logistic regression is naturally well calibrated because it directly optimizes a proper scoring rule — unlike SVMs or boosted trees whose scores need Platt scaling or isotonic post-calibration.',
    whatBreaks:
      'Accuracy on imbalanced data lies: 99% accuracy on 1% fraud data is the do-nothing classifier — use precision/recall/AUC and consider class weights. Perfect separation sends weights to infinity without regularization: coefficients explode, convergence warnings appear, and single-feature p-values become garbage. Non-linear boundaries defeat it: a circle of positives inside negatives is unlearnable without engineered features (add x^2, y^2 and it becomes linear again in the extended space). Unscaled features slow solver convergence and make coefficient comparison meaningless. Extrapolated confidence: far from training data z is huge, so the model outputs 0.999 certainty in regions it has never seen.',
    efficientWay: {
      title: 'Learning logistic regression properly',
      approaches: [
        {
          name: 'The Genius Move 3-step: (1) implement sigmoid + cross-entropy + gradient descent from scratch in NumPy, (2) sklearn LogisticRegression on a toy 2D dataset with the decision boundary plotted, (3) both on a real dataset (breast cancer, churn) comparing coefficients and AUC',
          verdict: 'best',
          reason: 'The scratch pass makes cross-entropy and the (p - y) gradient permanent knowledge — the same loss and gradient reappear in every neural network output layer. Plotting the boundary makes linear separability concrete. The real-data comparison surfaces regularization: sklearn regularizes by default, your scratch version does not, and reconciling them is the lesson.',
        },
        {
          name: 'Sklearn-only usage with attention to the metrics and threshold choice',
          verdict: 'ok',
          reason: 'Gets real work done, but cross-entropy will stay a magic incantation, and neural networks (whose final layer IS logistic regression) will feel harder than they are.',
        },
        {
          name: 'Treat it as a legacy algorithm and skip to gradient boosting for all classification',
          verdict: 'weak',
          reason: 'Logistic regression is the most deployed classifier in industry (credit, medicine, ads baselines) precisely because it is calibrated, auditable, and fast. Skipping it also skips the foundation of every neural classifier.',
        },
      ],
      recommendation:
        'Do the Genius Move with the breast cancer dataset as the real-data step. Key experiment: your unregularized scratch model versus sklearn default (C=1.0) — the coefficient differences you observe ARE regularization, seen with your own eyes. Then sweep the decision threshold and watch precision and recall trade off.',
    },
    commonMistakes: [
      'Using squared error instead of cross-entropy — the loss becomes non-convex through the sigmoid and gradients vanish exactly when the model is confidently wrong',
      'Reading the sigmoid output as a hard class label and ignoring that the 0.5 threshold is a business decision, not a law',
      'Evaluating with accuracy on imbalanced classes and shipping a model that never predicts the minority class',
      'Comparing your from-scratch coefficients to sklearn and panicking — sklearn applies L2 regularization by default (C=1.0); set penalty=None to match an unregularized implementation',
    ],
    seniorNotes:
      'Logistic regression is the default first classifier in industry and often the last: in credit scoring and healthcare it may be effectively mandated because coefficients are auditable as odds ratios. Seniors know sklearn regularizes by default and that C is the INVERSE of regularization strength — a perennial gotcha. Class weights (class_weight=balanced) are the first lever for imbalance, threshold tuning against the business cost matrix is the second; SMOTE is rarely the answer. Its calibration makes it the standard meta-layer too: stacking ensembles and post-calibrating other models both typically use logistic regression. And in deep learning interviews: a sigmoid output layer with binary cross-entropy IS logistic regression on learned features — being able to say so precisely scores points.',
    interviewQuestions: [
      'Why does logistic regression use cross-entropy loss instead of mean squared error?',
      'What exactly is the decision boundary of logistic regression, and how could you make it handle non-linear class boundaries?',
      'Your fraud model outputs probabilities. The business says missing fraud costs 50x more than a false alarm. What do you change?',
    ],
    interviewAnswers: [
      'Two reasons, one optimization-theoretic and one statistical. Optimization: MSE composed with a sigmoid is non-convex (multiple local minima) and its gradient contains the sigmoid derivative s(1-s), which vanishes when the model saturates — so a confidently WRONG model learns almost nothing. Cross-entropy is convex in the weights, and its gradient simplifies to (p - y): large error means large gradient, exactly the behavior you want. Statistical: cross-entropy is the negative log-likelihood of the Bernoulli model, so minimizing it is maximum likelihood estimation — it is the principled loss, and it produces calibrated probabilities.',
      'The boundary is the set where p = 0.5, i.e., where w . x + b = 0 — a hyperplane (straight line in 2D). Everything on one side gets probability above one half. For non-linear boundaries, transform the features: adding polynomial terms (x1^2, x1 x2, ...) or other basis functions makes the boundary linear in the EXPANDED space but curved in the original — a circle boundary falls out of adding squared terms. Alternatively use an intrinsically non-linear model (trees, kernels, neural nets), which is effectively learning the feature transform instead of hand-crafting it.',
      'Do not retrain first — change the threshold. With cost ratio 50:1, the expected-cost-minimizing threshold is roughly cost_fp / (cost_fp + cost_fn) = 1/51, about 0.02 instead of 0.5: flag anything with fraud probability above 2%. This exploits the fact that logistic regression outputs calibrated probabilities. Then consider class_weight in training to shift the learned boundary, evaluate with precision-recall curves rather than accuracy, and confirm calibration on a held-out set so the 2% threshold means what it claims.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Genius Move step 1: logistic regression from scratch — sigmoid, cross-entropy, gradient descent',
        code: "import numpy as np\nnp.random.seed(0)\n\ndef sigmoid(z):\n    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))   # clip for stability\n\ndef cross_entropy(p, y, eps=1e-12):\n    p = np.clip(p, eps, 1 - eps)   # never log(0)\n    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))\n\n# Toy 2D data: two Gaussian blobs\nn = 200\nX = np.vstack([np.random.randn(n, 2) + [2, 2],\n               np.random.randn(n, 2) + [-2, -2]])\ny = np.array([1] * n + [0] * n)\n\nXb = np.column_stack([np.ones(len(X)), X])\ntheta = np.zeros(3)\nlr = 0.1\nfor epoch in range(1000):\n    p = sigmoid(Xb @ theta)\n    grad = Xb.T @ (p - y) / len(y)     # the famous (p - y) gradient\n    theta -= lr * grad\n    if epoch % 250 == 0:\n        print('epoch', epoch, '| loss', round(cross_entropy(p, y), 4))\n\npred = (sigmoid(Xb @ theta) >= 0.5).astype(int)\nprint('accuracy:', (pred == y).mean())\nprint('boundary: %.2f + %.2f x1 + %.2f x2 = 0' % tuple(theta))\n# The boundary is a LINE where the score is 0 (probability exactly 0.5).",
      },
      {
        lang: 'python',
        label: 'Genius Move steps 2-3: sklearn on real data + threshold tuning for asymmetric costs',
        code: "import numpy as np\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.metrics import roc_auc_score, precision_score, recall_score\n\nX, y = load_breast_cancer(return_X_y=True)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25,\n                                          stratify=y, random_state=42)\n\n# Pipeline = no scaling leakage; note sklearn regularizes by default (C=1.0)\nmodel = make_pipeline(StandardScaler(),\n                      LogisticRegression(C=1.0, max_iter=5000))\nmodel.fit(X_tr, y_tr)\nproba = model.predict_proba(X_te)[:, 1]\nprint('AUC:', round(roc_auc_score(y_te, proba), 4))\n\n# The 0.5 threshold is a CHOICE. Sweep it and watch the tradeoff:\nfor t in [0.9, 0.5, 0.1]:\n    pred = (proba >= t).astype(int)\n    print('threshold', t,\n          '| precision', round(precision_score(y_te, pred), 3),\n          '| recall   ', round(recall_score(y_te, pred), 3))\n# Lower threshold -> catch more positives (recall up), more false alarms\n# (precision down). Pick the point the BUSINESS cost structure demands.\n\n# Interpretation: top odds-ratio features\nlr = model.named_steps['logisticregression']\ntop = np.argsort(np.abs(lr.coef_[0]))[-3:]\nfor i in top:\n    print(load_breast_cancer().feature_names[i],\n          '-> odds ratio per +1 std:', round(float(np.exp(lr.coef_[0][i])), 3))",
      },
    ],
    resources: [
      { label: 'StatQuest — Logistic Regression, clearly explained', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'An Introduction to Statistical Learning — Ch. 4', url: 'https://www.statlearning.com/', kind: 'book' },
      { label: 'scikit-learn User Guide — LogisticRegression', url: 'https://scikit-learn.org/stable/user_guide.html', kind: 'docs' },
      { label: 'Andrew Ng — ML Specialization (classification course)', url: 'https://www.coursera.org/specializations/machine-learning-introduction', kind: 'course' },
    ],
  },
  {
    id: 'decision-trees',
    phase: 4,
    phaseName: 'Core Machine Learning',
    orderIndex: 5,
    estimatedMins: 45,
    prerequisites: ['ml-project-workflow', 'train-test-cross-validation'],
    title: 'Decision Trees',
    eli5:
      'A decision tree plays twenty questions with your data. Is income above 50k? Is age under 30? Each answer narrows things down until the tree is confident enough to guess. The clever part is that the tree LEARNS which questions to ask, always picking the question that best separates the answers — like a doctor who learned from thousands of patients which symptom to check first.',
    analogy:
      'Airport security triage: passengers stream to a first checkpoint question (one-way ticket?), split into lanes, hit follow-up questions, and eventually each lane gets a verdict. A good checkpoint question splits the crowd into purer groups — mostly-fine versus needs-attention. A tree that has memorized the training set is a paranoid officer with a rule for every individual passenger ever seen (carry-on exactly 7.31kg AND blue jacket => flag): perfectly accurate on the past, useless on tomorrow crowd. Pruning is management deleting those over-specific rules.',
    explanation:
      'A decision tree recursively partitions feature space with axis-aligned questions (feature <= threshold), forming a tree whose leaves hold predictions — the majority class (classification) or mean value (regression). Growing the tree is greedy: at each node, try every feature and threshold, and keep the split that maximally purifies the children, measured by impurity: Gini impurity (sum p(1-p), the default) or entropy (-sum p log p); the drop in impurity is the information gain. Recurse until leaves are pure or limits are hit. Strengths: zero preprocessing (no scaling — thresholds are scale-invariant; native handling of mixed feature types), captures non-linearities and interactions automatically, and the model is a readable flowchart — you can show a stakeholder exactly why a prediction happened. The fatal weakness: unrestricted trees overfit catastrophically, growing until they memorize noise, one leaf per training quirk. Control complexity via pre-pruning (max_depth, min_samples_leaf, min_samples_split) or post-pruning (grow full, then cut branches that do not earn their keep on validation data — cost-complexity pruning with ccp_alpha in sklearn). Trees are also unstable — small data changes can flip the root split and reshape everything below — which is exactly the weakness that ensembles (random forests, boosting) later exploit and fix.',
    technicalDeep:
      'Impurity math: for class proportions p_k at a node, Gini = 1 - sum p_k^2 (probability two random samples disagree) and entropy = -sum p_k log2 p_k (bits of uncertainty). Both peak at uniform mixtures and hit zero at purity; they choose nearly identical splits in practice, and Gini avoids computing logs, hence the default. Split search: for a numeric feature, sort values (O(m log m)) and evaluate the impurity change at each boundary between consecutive sorted values with running class counts — total training complexity roughly O(n_features x m log m) per node. Regression trees minimize within-node variance (equivalently squared error against the leaf mean). Why greedy: finding the globally optimal tree is NP-complete, so CART commits to locally best splits — this is why a tree can miss an XOR pattern that needs a two-step lookahead. Cost-complexity pruning: minimize total_leaf_impurity + alpha x n_leaves; increasing alpha trades accuracy for simplicity, and sklearn cost_complexity_pruning_path enumerates the critical alphas for CV selection. Inductive bias: axis-aligned splits mean diagonal boundaries become staircases (rotate your features if needed), and predictions are piecewise-constant — trees CANNOT extrapolate beyond the training target range, a crucial fact for regression on trending data. Feature-importance caveats: impurity-based importances are biased toward high-cardinality features and computed on training data; prefer permutation importance on a validation set. Single trees are high-variance estimators — the formal motivation for bagging (random forest averages many decorrelated trees) and boosting (sequential error-correcting shallow trees).',
    whatBreaks:
      'Unlimited depth on noisy data yields near-100% training accuracy and mediocre test accuracy — the textbook overfit; one leaf per noise spike. High-cardinality categorical features (zip code, user ID) look like fantastic splitters because they can carve the training set finely — and generalize terribly. Instability: retrain on 95% of the data and the whole tree may reorganize, which is fatal if stakeholders memorized the old flowchart. Regression trees predict a constant beyond the training range — a housing-price tree trained through 2020 caps all 2024 predictions at 2020 levels. Class imbalance makes purity trivially achievable by predicting the majority everywhere — set class_weight. Smooth linear relationships are approximated by clumsy staircases, wasting depth a linear model would spend on one coefficient.',
    efficientWay: {
      title: 'Learning decision trees properly',
      approaches: [
        {
          name: 'The Genius Move 3-step: (1) implement Gini impurity and best-split search from scratch in NumPy, (2) sklearn DecisionTreeClassifier on a toy dataset with plot_tree visualization, (3) both on a real dataset, then sweep max_depth to watch overfitting live',
          verdict: 'best',
          reason: 'Writing the split search demystifies the entire algorithm — it is just try every threshold, keep the purest. The plot_tree pass builds reading fluency. The depth sweep on real data makes the train/test divergence — the overfitting curve — something you have personally generated.',
        },
        {
          name: 'Sklearn-only, tuning max_depth and min_samples_leaf by cross-validation',
          verdict: 'ok',
          reason: 'Perfectly serviceable for applied work, but split criteria stay abstract, and when the tree does something surprising (a weird root split, a zip-code obsession) you will lack the mental model to explain it.',
        },
        {
          name: 'Skip single trees and jump straight to random forests and XGBoost',
          verdict: 'weak',
          reason: 'Ensembles are built FROM trees — depth, leaf size, and impurity are their hyperparameters too. Skipping the base learner means tuning ensembles by superstition.',
        },
      ],
      recommendation:
        'Implement find_best_split in about 30 lines of NumPy — the whole algorithm is inside that function. Then on a real dataset, plot train and test accuracy versus max_depth from 1 to 20: the widening gap is overfitting made visible, and it is the single most instructive plot in classical ML. Finish by pruning with ccp_alpha and comparing.',
    },
    commonMistakes: [
      'Leaving depth unrestricted (the sklearn default!) and celebrating near-perfect training accuracy that evaporates on the test set',
      'Trusting impurity-based feature_importances_ blindly — they are biased toward high-cardinality features and computed on training data; use permutation importance on validation data',
      'Using a regression tree to forecast a trending quantity — trees cannot predict values outside the training target range',
      'Wasting effort scaling features for trees — splits compare feature <= threshold, so monotone transforms change nothing (and knowing WHY is the interview point)',
    ],
    seniorNotes:
      'Single decision trees ship less often than their ensembles, but seniors keep them for two jobs: interpretable models where a flowchart must be defended to a regulator or domain expert (a depth-3 tree is often the deliverable), and fast data exploration — the top splits of a quick tree instantly reveal the strongest interactions in a new dataset, feeding the hypothesis workflow. Know the instability story cold: it is why bagging works (variance reduction through averaging decorrelated trees) — the standard interview bridge from trees to forests. In sklearn specifically: max_depth=None is the default and will overfit; set it, along with min_samples_leaf, every time. For churn/credit-style tabular work, a pruned tree is also the classic segmentation tool: leaves double as named customer segments.',
    interviewQuestions: [
      'How does a decision tree decide which feature and threshold to split on? Explain Gini impurity or entropy.',
      'Why do decision trees overfit so easily, and what are the main ways to prevent it?',
      'Why do trees not require feature scaling, and what IS a real preprocessing concern for them?',
    ],
    interviewAnswers: [
      'At each node the tree tries every feature and every candidate threshold, evaluating how much the split purifies the children. Purity is measured by Gini impurity (1 - sum p_k^2, the chance two random samples in the node have different labels) or entropy (-sum p_k log p_k, uncertainty in bits); the chosen split maximizes the impurity decrease — information gain — weighted by child sizes. For numeric features, sorting values lets you scan all thresholds in one pass with running counts. The process recurses greedily; global tree optimization is NP-complete, so no lookahead: a locally mediocre split that would enable a great one below can be missed.',
      'A tree can keep splitting until every leaf is pure — with enough depth it will fit noise perfectly, one rule per training quirk, and its axis-aligned memorization does not transfer. Formally, trees are low-bias, high-variance models. Controls: pre-pruning caps growth (max_depth, min_samples_leaf — requiring, say, 20 samples per leaf forbids single-point rules; min_impurity_decrease), post-pruning grows fully then removes branches that fail to justify themselves (cost-complexity pruning, tuning ccp_alpha by CV). The other route is ensembling: bagging many trees (random forest) averages away the variance instead of restricting each tree.',
      'Splits are threshold comparisons — feature <= t — and any monotone rescaling of the feature just moves t correspondingly, choosing exactly the same partition. So standardization is a no-op for trees. Real concerns instead: high-cardinality categoricals (they enable fine, non-generalizing splits and inflate importances — target-encode or group them), missing values (sklearn trees historically require imputation), class imbalance (purity is trivial by always predicting the majority — use class_weight), and for regression, remembering the model cannot extrapolate beyond the training target range.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Genius Move step 1: Gini impurity and best-split search from scratch',
        code: "import numpy as np\n\ndef gini(y):\n    if len(y) == 0:\n        return 0.0\n    p = np.bincount(y) / len(y)\n    return 1.0 - np.sum(p ** 2)\n\ndef find_best_split(X, y):\n    m, n_features = X.shape\n    parent = gini(y)\n    best = {'gain': 0.0, 'feature': None, 'threshold': None}\n    for f in range(n_features):\n        for t in np.unique(X[:, f]):          # candidate thresholds\n            left = y[X[:, f] <= t]\n            right = y[X[:, f] > t]\n            if len(left) == 0 or len(right) == 0:\n                continue\n            child = (len(left) * gini(left) + len(right) * gini(right)) / m\n            gain = parent - child              # information gain (Gini version)\n            if gain > best['gain']:\n                best = {'gain': gain, 'feature': f, 'threshold': t}\n    return best\n\n# Tiny dataset: does income (col 0) or age (col 1) separate the classes better?\nX = np.array([[30, 25], [45, 30], [80, 35], [95, 45],\n              [28, 52], [90, 23], [35, 60], [70, 40]], dtype=float)\ny = np.array([0, 0, 1, 1, 0, 1, 0, 1])   # 1 = bought the product\n\nprint('root gini:', round(gini(y), 3))\nbest = find_best_split(X, y)\nprint('best split: feature', best['feature'], '<=', best['threshold'],\n      '| gain', round(best['gain'], 3))\n# The tree 'chose its question'. A full tree is just this, applied recursively\n# to each side until leaves are pure or a depth/leaf-size limit stops it.",
      },
      {
        lang: 'python',
        label: 'Genius Move steps 2-3: sklearn tree on real data + the overfitting sweep',
        code: "import numpy as np\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.tree import DecisionTreeClassifier, export_text\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_breast_cancer(return_X_y=True)\nnames = load_breast_cancer().feature_names\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25,\n                                          stratify=y, random_state=42)\n\n# THE overfitting experiment: sweep depth, watch train and test diverge\nprint('depth | train acc | test acc')\nfor depth in [1, 2, 3, 5, 8, None]:\n    tree = DecisionTreeClassifier(max_depth=depth, random_state=42)\n    tree.fit(X_tr, y_tr)\n    print(str(depth).ljust(5), '|',\n          round(tree.score(X_tr, y_tr), 3), '     |',\n          round(tree.score(X_te, y_te), 3))\n# Typical: train accuracy climbs to 1.000 with depth while test accuracy\n# peaks around depth 3-5 then declines. That divergence IS overfitting.\n\n# A depth-3 tree is also a READABLE model — print the actual rules:\nsmall = DecisionTreeClassifier(max_depth=3, min_samples_leaf=10,\n                               random_state=42).fit(X_tr, y_tr)\nprint(export_text(small, feature_names=list(names), max_depth=2))\n\n# Post-pruning alternative: cost-complexity path\npath = DecisionTreeClassifier(random_state=42).cost_complexity_pruning_path(X_tr, y_tr)\nbest_alpha, best_acc = 0.0, 0.0\nfor alpha in path.ccp_alphas[::5]:\n    t = DecisionTreeClassifier(ccp_alpha=alpha, random_state=42).fit(X_tr, y_tr)\n    acc = t.score(X_te, y_te)\n    if acc > best_acc:\n        best_alpha, best_acc = alpha, acc\nprint('best ccp_alpha:', round(float(best_alpha), 5), '| test acc:', round(best_acc, 3))",
      },
    ],
    resources: [
      { label: 'StatQuest — Decision Trees, clearly explained', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'An Introduction to Statistical Learning — Ch. 8', url: 'https://www.statlearning.com/', kind: 'book' },
      { label: 'scikit-learn User Guide — decision trees', url: 'https://scikit-learn.org/stable/user_guide.html', kind: 'docs' },
    ],
  },
  {
    id: 'knn-naive-bayes',
    phase: 4,
    phaseName: 'Core Machine Learning',
    orderIndex: 6,
    estimatedMins: 40,
    prerequisites: ['ml-project-workflow', 'train-test-cross-validation', 'maximum-likelihood'],
    title: 'k-NN & Naive Bayes',
    eli5:
      'Two totally different ways to guess. k-NN: to judge a new thing, look at the k most similar things you have seen and copy the majority — like guessing a house price by checking what the five nearest similar houses sold for. Naive Bayes: keep a tally of clues — the word FREE appears in 40% of spam but 1% of normal mail — and multiply the clue-strengths together to reach a verdict, naively pretending the clues are unrelated.',
    analogy:
      'k-NN is asking the neighbors: no studying, no rules learned in advance; when a question arrives you run around the neighborhood comparing, which makes learning instant and answering slow. Naive Bayes is a detective with a notebook of clue frequencies compiled in advance: answering is instant — flip through the notebook and multiply — but the detective naively assumes clues never interact (as if wet umbrella and wet shoes were independent evidence of rain, counting the same storm twice).',
    explanation:
      'These two algorithms represent the two poles of learning. k-NN is instance-based (lazy): training is just storing the data; to predict, compute the distance (usually Euclidean) from the query to every stored point, take the k nearest, and vote (classification) or average (regression). All the modeling lives in three choices: the distance metric, k (small k = flexible and noisy, large k = smooth and potentially oversmoothed), and — critically — feature scaling, because distance treats every unit equally: an income feature in dollars will drown an age feature in years unless standardized. Naive Bayes is model-based and probabilistic: apply Bayes theorem P(class | features) proportional to P(class) x P(features | class), with the naive assumption that features are conditionally independent given the class, so the likelihood factorizes into a product of simple per-feature probabilities you can estimate by counting. Variants per feature type: Gaussian NB (continuous), Multinomial NB (counts — the classic spam filter), Bernoulli NB (binary). When each shines: k-NN when decision boundaries are genuinely irregular and local, data is dense, dimensions are few, and you can afford slow predictions; NB when features are high-dimensional and sparse (text!), data is scarce, and you need training and prediction to be near-instant. Both make superb baselines to run before anything complex.',
    technicalDeep:
      'k-NN theory: it is non-parametric with model complexity growing with data; the classic Cover-Hart result bounds the asymptotic error of 1-NN by twice the Bayes-optimal error. Complexity: zero training, but naive prediction is O(m x n) per query; space-partitioning structures (KD-trees, ball trees — what sklearn auto-selects) help in low dimensions but degrade toward brute force as dimensions grow. The curse of dimensionality is the real killer: in high dimensions, distances concentrate — the ratio between nearest and farthest neighbor distances approaches 1 — so nearest becomes meaningless; k-NN is rarely useful beyond a few dozen effective dimensions without dimensionality reduction or learned embeddings (where it returns triumphantly as vector similarity search powering recommendations and RAG retrieval). Weighted k-NN (weights=distance) softens the fixed-k cliff. Naive Bayes theory: it is a generative model — it models P(x, y) rather than the discriminative P(y | x) of logistic regression; NB and logistic regression form a classic generative-discriminative pair (Ng and Jordan 2001: NB reaches its (higher) asymptotic error faster — better with tiny data; LR wins with more data). Why NB works despite false independence: classification needs only the argmax over classes, so the probability ESTIMATES can be badly miscalibrated while the RANKING stays correct — double-counted correlated features push confidences toward 0/1 but often preserve the decision. Laplace smoothing (add-alpha) fixes the zero-frequency catastrophe: an unseen word-class pair would otherwise multiply the whole product to zero. Implementation is always in log space: sum of logs, not product of tiny floats, to avoid underflow.',
    whatBreaks:
      'k-NN without feature scaling: the largest-unit feature dictates all distances and other features become decoration — the number-one k-NN bug. High dimensions silently break the notion of nearest — accuracy decays toward random while the code runs fine. Prediction latency: 10 million stored points times a thousand queries per second does not work without approximate-nearest-neighbor infrastructure. Imbalanced classes rig the vote — the majority class wins ties by sheer population. For NB: zero-frequency without smoothing zeroes entire class posteriors; duplicated or highly correlated features double-count evidence and produce absurd 0.9999 confidences; and treating NB probability outputs as calibrated (for thresholds or expected-cost decisions) is a mistake — recalibrate first or use them only for ranking.',
    efficientWay: {
      title: 'Learning the lazy and the probabilistic baselines',
      approaches: [
        {
          name: 'The Genius Move 3-step: (1) implement k-NN (distance matrix + vote) and Gaussian NB (per-class means/variances + log-posteriors) from scratch in NumPy, (2) sklearn KNeighborsClassifier and GaussianNB/MultinomialNB on toy data, (3) both on a real dataset, sweeping k and comparing NB vs logistic regression',
          verdict: 'best',
          reason: 'Both algorithms are under 25 lines from scratch — the highest understanding-per-line in ML. The k sweep makes the bias-variance knob physical, and racing NB against logistic regression on the same data teaches the generative-discriminative tradeoff empirically.',
        },
        {
          name: 'Sklearn-only with GridSearchCV over k and smoothing',
          verdict: 'ok',
          reason: 'Fine for applied use, but you will miss WHY scaling is life-or-death for k-NN and irrelevant for NB — the kind of understanding that transfers to every distance-based method (clustering, embeddings, retrieval).',
        },
        {
          name: 'Dismiss both as toy algorithms not worth learning',
          verdict: 'weak',
          reason: 'k-NN is conceptually the backbone of modern vector search and recommendation retrieval; NB still ships in production text classifiers where latency and tiny training sets rule. And both are interview staples precisely because they test fundamentals.',
        },
      ],
      recommendation:
        'Write both from scratch in one sitting — k-NN is a distance matrix and an argsort; Gaussian NB is per-class means, variances, and a log-sum. Then on real data: sweep k from 1 to 50 plotting train/test accuracy (bias-variance in one picture), and run MultinomialNB on a text dataset to feel why it owned spam filtering for a decade.',
    },
    commonMistakes: [
      'Running k-NN on unscaled features, letting the biggest-unit feature single-handedly define similarity',
      'Choosing k = 1 because training accuracy is perfect — 1-NN training accuracy is ALWAYS perfect (every point is its own nearest neighbor); it says nothing',
      'Forgetting Laplace smoothing in from-scratch NB, so one unseen feature value vetoes an entire class with probability zero',
      'Reading Naive Bayes confidence scores as real probabilities — correlated features double-count evidence, pushing outputs to extremes; rank with them, do not bet on them',
    ],
    seniorNotes:
      'The modern k-NN story is embeddings: encode items with a neural network, then nearest-neighbor search in embedding space IS the retrieval layer of recommender systems, semantic search, and RAG — at scale via approximate-NN libraries (FAISS, ScaNN, HNSW indexes) trading a little recall for orders-of-magnitude speed. So the k-NN fundamentals (metrics, scaling, curse of dimensionality) transfer directly to the hottest infrastructure of the decade. NB survives where speed and small data dominate: real-time text triage, cold-start classifiers, and as the honesty baseline — if your fine-tuned transformer beats MultinomialNB plus TF-IDF by two points, say so in the review. Both are also great leakage detectors: if 1-NN gets suspiciously high test accuracy, look for duplicate rows across your split.',
    interviewQuestions: [
      'Why is k-NN called a lazy learner, and what are the practical consequences at prediction time?',
      'Explain the naive assumption in Naive Bayes. Why does the classifier often work well even when the assumption is false?',
      'How does the choice of k in k-NN relate to overfitting and underfitting?',
    ],
    interviewAnswers: [
      'Lazy means no work at training time — the model IS the stored dataset; all computation is deferred to prediction, where each query requires distances to every stored point: O(m x n) per query. Consequences: training is instant and trivially updatable (just append data), but serving is slow and memory-heavy — the opposite profile of eager models like logistic regression that compress data into parameters. At scale you need KD/ball trees (low dimensions) or approximate-nearest-neighbor indexes (high dimensions), trading exactness for speed. Also, since the data is the model, feature scaling and noisy points directly reshape predictions.',
      'Naive Bayes assumes features are conditionally independent given the class, so P(x1,...,xn | c) factorizes into the product of P(xi | c) — reducing estimation to simple per-feature counts. In reality features correlate (words co-occur), so the assumption is almost always false. It still works because classification only needs the RIGHT CLASS to win the argmax, not correct probabilities: correlated features double-count evidence, distorting confidence toward 0/1, but they typically distort in a direction-preserving way, so the decision boundary stays sensible. The cost appears exactly where miscalibration matters — thresholding and expected-cost decisions — where you should recalibrate or prefer a discriminative model.',
      'k is a direct bias-variance dial. k=1: maximally flexible, jagged boundary tracing individual points, training accuracy trivially 100%, high variance — classic overfitting. Large k: predictions average over wide neighborhoods, boundary smooths out, and at k = m you predict the global majority class everywhere — maximal bias, underfitting. Choose k by cross-validation (odd k avoids ties in binary problems); distance-weighted voting softens the choice by letting nearer neighbors count more.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Genius Move step 1: k-NN and Gaussian Naive Bayes from scratch',
        code: "import numpy as np\nnp.random.seed(1)\n\n# ---------- k-NN from scratch ----------\ndef knn_predict(X_train, y_train, X_query, k=5):\n    preds = []\n    for q in X_query:\n        dists = np.sqrt(((X_train - q) ** 2).sum(axis=1))   # Euclidean\n        nearest = np.argsort(dists)[:k]\n        votes = y_train[nearest]\n        preds.append(np.bincount(votes).argmax())            # majority vote\n    return np.array(preds)\n\n# ---------- Gaussian Naive Bayes from scratch ----------\nclass ScratchGaussianNB:\n    def fit(self, X, y):\n        self.classes = np.unique(y)\n        self.priors = {c: np.mean(y == c) for c in self.classes}\n        self.mu = {c: X[y == c].mean(axis=0) for c in self.classes}\n        self.var = {c: X[y == c].var(axis=0) + 1e-9 for c in self.classes}\n        return self\n\n    def predict(self, X):\n        preds = []\n        for x in X:\n            log_post = {}\n            for c in self.classes:\n                # log P(c) + sum log N(x_i | mu, var)  — log space avoids underflow\n                log_lik = -0.5 * np.sum(np.log(2 * np.pi * self.var[c])\n                                        + (x - self.mu[c]) ** 2 / self.var[c])\n                log_post[c] = np.log(self.priors[c]) + log_lik\n            preds.append(max(log_post, key=log_post.get))\n        return np.array(preds)\n\n# Test both on two Gaussian blobs\nn = 150\nX = np.vstack([np.random.randn(n, 2) + [2, 0], np.random.randn(n, 2) + [-2, 0]])\ny = np.array([0] * n + [1] * n)\nshuffle = np.random.permutation(len(y))\nX, y = X[shuffle], y[shuffle]\nX_tr, X_te, y_tr, y_te = X[:240], X[240:], y[:240], y[240:]\n\nprint('scratch kNN accuracy:', (knn_predict(X_tr, y_tr, X_te, k=5) == y_te).mean())\nprint('scratch GNB accuracy:', (ScratchGaussianNB().fit(X_tr, y_tr).predict(X_te) == y_te).mean())",
      },
      {
        lang: 'python',
        label: 'Genius Move steps 2-3: sklearn versions, the k sweep, and why scaling is life-or-death',
        code: "import numpy as np\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.naive_bayes import GaussianNB\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.model_selection import train_test_split, cross_val_score\n\nX, y = load_breast_cancer(return_X_y=True)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25,\n                                          stratify=y, random_state=42)\n\n# Scaling: irrelevant for NB, LIFE-OR-DEATH for k-NN\nknn_raw = KNeighborsClassifier(5).fit(X_tr, y_tr)\nknn_scaled = make_pipeline(StandardScaler(), KNeighborsClassifier(5)).fit(X_tr, y_tr)\nprint('kNN unscaled:', round(knn_raw.score(X_te, y_te), 3))\nprint('kNN scaled  :', round(knn_scaled.score(X_te, y_te), 3))\n# Large gap: unscaled distances are dominated by the biggest-unit features.\n\n# The k sweep = the bias-variance dial, in numbers\nprint('k  | train | test')\nfor k in [1, 3, 7, 15, 51]:\n    m = make_pipeline(StandardScaler(), KNeighborsClassifier(k)).fit(X_tr, y_tr)\n    print(str(k).ljust(2), '|', round(m.score(X_tr, y_tr), 3),\n          '|', round(m.score(X_te, y_te), 3))\n# k=1: train 1.000 (always!), test lower -> variance. Big k: both sag -> bias.\n\n# Generative vs discriminative on the same data\nfor name, model in [('GaussianNB', GaussianNB()),\n                    ('LogisticReg', make_pipeline(StandardScaler(),\n                                                  LogisticRegression(max_iter=5000)))]:\n    scores = cross_val_score(model, X_tr, y_tr, cv=5)\n    print(name, 'CV: %.3f +/- %.3f' % (scores.mean(), scores.std()))\n# NB trains instantly and is competitive; LR usually edges ahead with enough data\n# — the classic generative-vs-discriminative tradeoff, measured yourself.",
      },
    ],
    resources: [
      { label: 'StatQuest — k-NN and Naive Bayes videos', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'An Introduction to Statistical Learning — Ch. 2 & 4', url: 'https://www.statlearning.com/', kind: 'book' },
      { label: 'scikit-learn User Guide — neighbors & naive_bayes', url: 'https://scikit-learn.org/stable/user_guide.html', kind: 'docs' },
    ],
  },
  {
    id: 'model-evaluation',
    phase: 4,
    phaseName: 'Core Machine Learning',
    orderIndex: 7,
    estimatedMins: 45,
    prerequisites: ['logistic-regression-ml', 'train-test-cross-validation'],
    title: 'Model Evaluation Metrics',
    eli5:
      'Imagine a disease test that just says healthy to everyone. If only 1 person in 100 is sick, the test is 99% accurate — and completely useless, because it never catches the sick person. That is the accuracy trap. Real evaluation asks sharper questions: of the alarms you raised, how many were real (precision)? Of the real cases out there, how many did you catch (recall)? You usually cannot max out both, so the business decides which mistake hurts more.',
    analogy:
      'A smoke detector has two failure modes. Screaming at burnt toast: false positives — annoying, you start ignoring it (low precision destroys trust). Sleeping through a real fire: false negatives — catastrophic (low recall destroys the point). The sensitivity dial trades one against the other, and where to set it depends on whether you are protecting a fireworks warehouse (crank recall, tolerate toast alarms) or a smoky restaurant kitchen (raise the threshold, but accept the risk). ROC-AUC asks a dial-independent question: across ALL settings, how good is this detector at ranking real fires above burnt toast?',
    explanation:
      'Every binary classification outcome lands in one of four confusion-matrix cells: true positive, true negative, false positive (false alarm), false negative (miss). All headline metrics are ratios of these cells. Accuracy = (TP + TN) / all — meaningless under class imbalance, where predicting the majority class scores high while doing nothing. Precision = TP / (TP + FP): when you fire an alarm, how often are you right — the metric of alert fatigue and wasted investigation cost. Recall = TP / (TP + FN): of all true positives, how many you caught — the metric of missed frauds and undiagnosed patients. They trade off through the decision threshold: lowering it raises recall and lowers precision. F1 is their harmonic mean — a single number that punishes neglecting either, useful when you must summarize but hiding the tradeoff. ROC-AUC measures ranking quality across all thresholds: the probability a random positive scores above a random negative; 0.5 = coin flip, 1.0 = perfect. Under heavy imbalance, precision-recall curves and average precision are more informative than ROC (which can look rosy because true negatives are abundant). For regression: MAE (average miss, robust, in target units), RMSE (punishes large errors quadratically — use when big misses are disproportionately bad), R-squared (variance explained). The meta-skill: pick the metric by asking which error costs the business more — the metric is the objective, and teams optimize what they measure.',
    technicalDeep:
      'Formal footing: ROC-AUC equals the Mann-Whitney U statistic normalized — a pure ranking measure, invariant to monotone transforms of scores and to class balance; PR curves are NOT balance-invariant, which is exactly why they are the honest view under 1% positive rates (precision directly divides by alarm volume). The threshold-free/threshold-dependent split matters operationally: AUC evaluates the scorer, precision/recall/F1 evaluate the scorer PLUS a deployed threshold — production monitoring needs both. Optimal thresholding under known costs: minimize expected cost with threshold t* = C_fp / (C_fp + C_fn) for calibrated probabilities; uncalibrated scores must be calibrated first (Platt scaling or isotonic regression on held-out data; check with reliability diagrams and Brier score — a proper scoring rule decomposable into calibration + refinement). Multiclass: per-class precision/recall with macro (unweighted mean — treats rare classes equally), micro (pools all decisions — dominated by frequent classes), or weighted averaging; know which your library reports. Metric uncertainty: AUC and F1 from one test set are point estimates — bootstrap the test set for confidence intervals before declaring a champion model. Regression subtleties: RMSE is sensitive to a handful of outliers (it optimizes the conditional mean, MAE the conditional median); R-squared can be negative on a test set (model worse than predicting the mean) and rises mechanically with feature count on training data — never select features by training R-squared. MAPE explodes near zero targets. And Goodhart: optimizing a proxy metric hard enough decouples it from the business outcome — pair every offline metric with an online/business metric.',
    whatBreaks:
      'Accuracy on imbalanced data ships do-nothing models with impressive-sounding scores — the single most common evaluation failure. Reporting AUC alone hides that the deployed threshold produces 40 false alarms per catch — operations teams then ignore the alerts and the model dies socially, not statistically. Comparing F1 across datasets with different base rates is meaningless. Optimizing recall in isolation (predict everyone positive: recall 100%) or precision in isolation (predict only the single most confident case: precision 100%) — always constrain the other side. Selecting the threshold on the test set is leakage — tune it on validation. Choosing RMSE when stakeholders think in absolute error, or MAPE when targets touch zero, produces models optimized for the wrong pain.',
    efficientWay: {
      title: 'Evaluating classifiers honestly',
      approaches: [
        {
          name: 'Start from the business cost matrix: name the price of a false positive and a false negative, choose the metric that reflects it (recall-focused, precision-focused, or cost-weighted), report the confusion matrix + PR/ROC curves, tune the threshold on validation data',
          verdict: 'best',
          reason: 'The metric is a business decision wearing a math costume. Anchoring on real error costs makes every later choice (threshold, class weights, model selection) principled instead of cargo-culted.',
        },
        {
          name: 'Report a standard battery — accuracy, F1, ROC-AUC — for every model',
          verdict: 'ok',
          reason: 'Better than accuracy alone and fine for quick comparisons, but a battery without a cost rationale invites picking whichever number flatters, and F1 silently assumes false positives and false negatives cost the same.',
        },
        {
          name: 'Report accuracy, full stop',
          verdict: 'weak',
          reason: 'On the imbalanced problems that dominate real ML (fraud, churn, diagnosis, defects), accuracy rewards the model that never fires. It is how useless models pass review.',
        },
      ],
      recommendation:
        'Ritual for every classifier: print the confusion matrix FIRST (it cures all abstraction), then classification_report, then plot PR and ROC curves. Write one sentence: a false positive costs us X, a false negative costs us Y, therefore we optimize Z at threshold t. If you cannot write that sentence, you are not ready to pick a model.',
    },
    commonMistakes: [
      'Celebrating 99% accuracy on a 99-to-1 imbalanced dataset — exactly the majority-class baseline, catching nothing',
      'Comparing models by ROC-AUC on a 0.5% positive-rate problem where the PR curve reveals precision collapses at any useful recall',
      'Tuning the decision threshold on the test set, then reporting test metrics as unbiased',
      'Averaging multiclass F1 without knowing whether it is macro or weighted — the two can differ wildly under imbalance and quietly reverse model rankings',
    ],
    seniorNotes:
      'Seniors treat metric selection as requirements engineering: the metric review happens BEFORE modeling, with the stakeholder signing off on the cost asymmetry. In production, dashboards track threshold-dependent metrics (precision/recall at the deployed threshold, alert volume) because that is what operations experiences — AUC is for offline model comparison. Expect calibration drift: a threshold tuned in January misfires by June as the score distribution shifts; monitor score histograms and recalibrate on schedule. For imbalanced problems, precision-at-top-k (can the fraud team review the top 100 daily alerts?) often matches operational reality better than any curve. And bootstrap your test metrics — a 0.01 AUC improvement is usually noise, and knowing that saves quarters of wasted migration work.',
    interviewQuestions: [
      'Your model is 99% accurate. Why might it still be useless, and what would you look at instead?',
      'Explain precision versus recall with a concrete scenario where each should be prioritized.',
      'What does ROC-AUC measure, and when would you prefer a precision-recall curve instead?',
    ],
    interviewAnswers: [
      'If the positive class is 1% of the data, a model that predicts negative for everyone is 99% accurate and catches zero positives — accuracy is dominated by the majority class. I would look at the confusion matrix first, then precision (of flagged cases, how many are real) and recall (of real cases, how many we flagged), the PR curve for the imbalanced view, and ROC-AUC for threshold-free ranking quality. The right headline metric follows from the cost asymmetry between false positives and false negatives for this specific business problem.',
      'Precision = TP/(TP+FP): the trustworthiness of your alarms. Recall = TP/(TP+FN): your coverage of the real positives. Prioritize recall in cancer screening — a missed cancer can be fatal while a false positive costs a follow-up test; push the threshold low and accept more false alarms. Prioritize precision in an automated system that suspends user accounts for fraud — each false positive is an innocent customer locked out and a support fire; flag only when confident. The threshold is the dial, and the cost matrix — not the math — decides where it sits.',
      'ROC-AUC is the probability the model ranks a randomly chosen positive above a randomly chosen negative — a threshold-independent measure of ranking quality, invariant to class balance and monotone score transforms. Prefer the PR curve under heavy class imbalance: ROC uses the false-positive RATE, whose denominator (all negatives) is huge, so even a flood of false alarms barely moves it and AUC looks flattering; precision divides by predicted positives, so it directly reflects the alert-quality collapse the operations team will actually feel. Rule of thumb: rare positives and alarm-cost concerns mean PR curve and average precision; balanced classes mean ROC is fine.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'The accuracy trap, measured — and the metrics that expose it',
        code: "import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.metrics import (accuracy_score, precision_score, recall_score,\n                             f1_score, confusion_matrix, roc_auc_score,\n                             classification_report)\n\n# 2% positive rate — like fraud or rare-disease data\nX, y = make_classification(n_samples=10000, n_features=20, weights=[0.98, 0.02],\n                           random_state=42)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3,\n                                          stratify=y, random_state=42)\n\n# The useless model: always predict the majority class\ndummy = DummyClassifier(strategy='most_frequent').fit(X_tr, y_tr)\nreal = LogisticRegression(max_iter=2000, class_weight='balanced').fit(X_tr, y_tr)\n\nfor name, model in [('dummy', dummy), ('logreg', real)]:\n    pred = model.predict(X_te)\n    print('---', name, '---')\n    print('accuracy :', round(accuracy_score(y_te, pred), 3))\n    print('precision:', round(precision_score(y_te, pred, zero_division=0), 3))\n    print('recall   :', round(recall_score(y_te, pred), 3))\n    print('f1       :', round(f1_score(y_te, pred), 3))\n    print(confusion_matrix(y_te, pred))\n# Dummy: ~0.98 accuracy, recall 0.0 — high score, zero value.\n# The confusion matrix makes the fraud it caught (none) impossible to hide.",
      },
      {
        lang: 'python',
        label: 'Threshold tuning against a business cost matrix (on validation, never test)',
        code: "import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import precision_recall_curve, roc_auc_score, average_precision_score\n\nX, y = make_classification(n_samples=20000, n_features=20, weights=[0.97, 0.03],\n                           random_state=7)\n# Three-way split: train / validation (tune threshold here) / test (final report)\nX_tr, X_tmp, y_tr, y_tmp = train_test_split(X, y, test_size=0.4, stratify=y, random_state=7)\nX_va, X_te, y_va, y_te = train_test_split(X_tmp, y_tmp, test_size=0.5,\n                                          stratify=y_tmp, random_state=7)\n\nmodel = LogisticRegression(max_iter=2000).fit(X_tr, y_tr)\nva_scores = model.predict_proba(X_va)[:, 1]\nprint('ROC-AUC (ranking quality)   :', round(roc_auc_score(y_va, va_scores), 3))\nprint('Avg precision (PR summary)  :', round(average_precision_score(y_va, va_scores), 3))\n\n# Business costs: a missed positive costs 500, a false alarm costs 25\nC_FN, C_FP = 500, 25\nbest_t, best_cost = 0.5, np.inf\nfor t in np.linspace(0.01, 0.99, 99):\n    pred = (va_scores >= t).astype(int)\n    fp = np.sum((pred == 1) & (y_va == 0))\n    fn = np.sum((pred == 0) & (y_va == 1))\n    cost = C_FP * fp + C_FN * fn\n    if cost < best_cost:\n        best_t, best_cost = t, cost\nprint('cost-optimal threshold:', round(best_t, 2), '(vs default 0.50)')\n\n# Final honest numbers: apply the FROZEN threshold to the untouched test set\nte_scores = model.predict_proba(X_te)[:, 1]\npred = (te_scores >= best_t).astype(int)\nfp = np.sum((pred == 1) & (y_te == 0)); fn = np.sum((pred == 0) & (y_te == 1))\nprint('test cost at tuned threshold :', C_FP * fp + C_FN * fn)\npred05 = (te_scores >= 0.5).astype(int)\nfp = np.sum((pred05 == 1) & (y_te == 0)); fn = np.sum((pred05 == 0) & (y_te == 1))\nprint('test cost at default 0.5     :', C_FP * fp + C_FN * fn)\n# Same model, better threshold, real money saved — evaluation IS modeling.",
      },
    ],
    resources: [
      { label: 'StatQuest — confusion matrix, ROC and AUC videos', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Google ML Crash Course — classification metrics', url: 'https://developers.google.com/machine-learning/crash-course', kind: 'course' },
      { label: 'scikit-learn User Guide — model evaluation', url: 'https://scikit-learn.org/stable/user_guide.html', kind: 'docs' },
    ],
  },
  {
    id: 'bias-variance-tradeoff',
    phase: 4,
    phaseName: 'Core Machine Learning',
    orderIndex: 8,
    estimatedMins: 40,
    prerequisites: ['model-evaluation', 'decision-trees', 'loss-landscapes'],
    title: 'Bias-Variance Tradeoff & Over/Underfitting',
    eli5:
      'Two ways to fail a test. Underfitting: you only learned one crude rule (all birds fly), so you miss everything subtle — penguins confuse you. Overfitting: you memorized every practice question word-for-word, including the typos, so any new question throws you. The sweet spot is learning the actual patterns — deep enough to be right, general enough to transfer.',
    analogy:
      'Fitting a suit. High bias is buying one-size-fits-all: cheap, fast, fits everyone equally badly — no amount of extra customers (data) fixes a fundamentally rigid design. High variance is a suit sewn to your body on one specific day, capturing every temporary detail — eat one big dinner and it no longer fits; it modeled the noise of that day, not your shape. The tailor with the right number of measurements captures your real shape and ignores the daily fluctuations. Learning curves are the fitting-room mirror telling you which failure you have.',
    explanation:
      'For a fixed learning problem, expected test error decomposes into three parts: bias squared (error from the model being too simple to represent the truth — wrong even with infinite data), variance (error from sensitivity to the particular training sample — the model would change a lot if you redrew the data), and irreducible noise (randomness in the target no model can capture). Simple models (linear regression on complex data) have high bias, low variance: they underfit — poor training AND test performance, and more data barely helps. Complex models (deep trees, k-NN with k=1, high-degree polynomials) have low bias, high variance: they overfit — excellent training performance, much worse test performance, and the train-test gap is the tell. As model capacity grows, bias falls and variance rises; total error is U-shaped, and model selection is finding the bottom of the U. The diagnostic tool is learning curves: plot training and validation error versus training-set size. High bias signature: the two curves converge to a HIGH error plateau — more data will not help; you need a more expressive model or better features. High variance signature: a persistent GAP between low training error and high validation error, narrowing as data grows — more data helps, as do regularization, simplification, or ensembling. This single diagnosis determines your next move, which is why it is the most valuable debugging skill in classical ML.',
    technicalDeep:
      'The decomposition, precisely (regression, squared loss): for y = f(x) + eps with noise variance sigma^2, and f_hat trained on a random dataset D, the expected error at x is E_D[(y - f_hat(x))^2] = (f(x) - E_D[f_hat(x)])^2 + Var_D[f_hat(x)] + sigma^2 — bias squared plus variance plus noise. Bias and variance are properties of the LEARNING PROCEDURE averaged over datasets, not of one fitted model — you can estimate them empirically by training on many bootstrap resamples and measuring the spread of predictions at fixed points. Concrete dials and their direction: polynomial degree up = bias down/variance up; tree depth up = same; k in k-NN up = variance DOWN/bias UP (note the inversion); regularization strength up = bias up/variance down; more training data = variance down, bias unchanged. Ensembles cheat the tradeoff: bagging averages B high-variance estimators, cutting variance toward the limit set by inter-tree correlation (random forests decorrelate via feature subsampling precisely to push that limit lower) at almost no bias cost; boosting instead reduces bias by sequentially fitting residuals, with variance controlled by learning-rate shrinkage and depth limits. Modern caveat: the classical U-shape is not the whole story — heavily overparameterized neural networks exhibit double descent, where past the interpolation threshold test error falls AGAIN as width grows; implicit regularization of SGD is implicated. The classical framework remains the right mental model for classical-scale models and for the interview answer, but do not claim the U-curve is universal law.',
    whatBreaks:
      'Misdiagnosis wastes months: teams collect 10x more data to fix what is actually high bias (curves already converged — data cannot help), or add model capacity to fix what is actually high variance (making the gap worse). Judging by training error alone: a 1-NN classifier or unlimited-depth tree always aces training — that number carries zero information about generalization. Chasing validation score through dozens of hyperparameter iterations overfits the validation set itself — the third kind of overfitting nobody warns you about (fix: nested CV or a fresh final test set). Comparing models of different capacity on training metrics mechanically favors the overfitter. And single train/validation splits on small data make the diagnosis itself noisy — repeat with CV before trusting the curve shapes.',
    efficientWay: {
      title: 'Diagnosing under- and overfitting',
      approaches: [
        {
          name: 'Learning curves plus a capacity sweep: plot train/validation error versus data size to classify the failure (converged-high = bias, gap = variance), and versus model complexity to locate the U-bottom; then apply the matching fix',
          verdict: 'best',
          reason: 'This is the decision procedure, not a vibe: the two plots point unambiguously at the bottleneck, and each diagnosis has a known prescription — capacity/features for bias, data/regularization/ensembles for variance.',
        },
        {
          name: 'Compare train vs validation score for your current model and reason from the gap',
          verdict: 'ok',
          reason: 'The 30-second version — a big gap does suggest variance, similar-and-bad suggests bias — but without the curve versus data size you cannot tell whether collecting more data will pay, which is often the most expensive decision on the table.',
        },
        {
          name: 'Skip diagnosis: throw regularization, more data, and a bigger model at every problem simultaneously',
          verdict: 'weak',
          reason: 'The fixes pull in opposite directions — regularizing an underfit model makes it worse, growing an overfit model makes IT worse. Undiagnosed treatment is how projects burn quarters.',
        },
      ],
      recommendation:
        'Memorize the two signatures until they are reflexes: converging-high curves = bias = add capacity or features (more data will NOT help); persistent train-validation gap = variance = more data, regularization, or ensembles. Run sklearn learning_curve on every serious model — it costs minutes and routinely saves the wrong quarter-long fix.',
    },
    commonMistakes: [
      'Prescribing more data for a high-bias model whose learning curves have already converged — the plateau is the model ceiling, not a data shortage',
      'Reading perfect training accuracy as model quality instead of as a variance warning light',
      'Forgetting that k in k-NN works backwards: INCREASING k reduces variance and increases bias, the opposite direction of most capacity knobs',
      'Overfitting the validation set through relentless hyperparameter search, then acting surprised when the test score disappoints — validation is a resource you spend',
    ],
    seniorNotes:
      'The bias-variance question in industry is usually is more data worth buying — labeling budgets are real money, and learning curves are the honest forecast: extrapolate the validation curve and you know the value of the next 100k labels before paying for them. Under distribution shift, favor slightly higher-bias models: high-variance fits latch onto brittle correlations that shift first. The ensemble playbook is variance management: random forests when you want variance reduction with near-zero tuning, boosting when residual bias is the problem and you can afford tuning care. And know the double-descent caveat for deep-learning conversations: modern overparameterized nets do not obey the classical U-curve, so do not apply classical intuitions to a 100M-parameter model without checking. In interviews, the decomposition plus the two learning-curve signatures plus one fix for each is the complete, expected answer.',
    interviewQuestions: [
      'Explain the bias-variance tradeoff. How do bias and variance each contribute to test error?',
      'How do you tell whether a model is underfitting or overfitting, and what do you do in each case?',
      'Why does gathering more training data help an overfit model but not an underfit one?',
    ],
    interviewAnswers: [
      'Expected test error decomposes into bias squared plus variance plus irreducible noise. Bias is the systematic error of a model family too rigid for the truth — a straight line fit to a curve is wrong on average no matter the sample. Variance is sensitivity to the particular training draw — a deep tree refit on new data changes wildly, meaning it modeled sampling noise. Capacity trades one for the other: as complexity grows, bias falls and variance rises, making test error U-shaped; model selection means finding the bottom. Both terms are properties of the learning procedure over repeated datasets, not of a single fitted model.',
      'Compare training and validation performance, ideally as learning curves. Underfitting: training AND validation error both high and close — the model cannot even fit what it sees; fix with more capacity, better features, less regularization, longer training. Overfitting: low training error with a large persistent validation gap; fix with more data, regularization, a simpler model, early stopping, or ensembling/bagging. The curves versus data size disambiguate the expensive decision: converged curves mean more data is wasted money; a narrowing gap means data will pay.',
      'Variance is the component of error caused by fitting quirks of a finite sample; with more samples, noise averages out, the model cannot memorize its way through, and the fitted function stabilizes — variance shrinks roughly with sample size, closing the train-validation gap. Bias is structural: a linear model fit to a quadratic truth is wrong in the same way on ten points or ten million — E[f_hat] itself is off target, and no amount of data moves it. That is exactly why the learning-curve plateau matters: it shows where the variance component has been exhausted and only bias (and noise) remains.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'The U-curve made real: polynomial degree sweep with train/test error',
        code: "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import PolynomialFeatures\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_squared_error\nnp.random.seed(3)\n\n# Truth: a sine wave. Data: 40 noisy samples.\nn = 40\nX = np.sort(np.random.uniform(0, 1, n)).reshape(-1, 1)\ny = np.sin(2 * np.pi * X[:, 0]) + np.random.randn(n) * 0.25\nX_test = np.linspace(0, 1, 200).reshape(-1, 1)\ny_test_true = np.sin(2 * np.pi * X_test[:, 0])\n\nprint('degree | train MSE | test MSE')\nfor degree in [1, 3, 9, 15]:\n    model = make_pipeline(PolynomialFeatures(degree), LinearRegression())\n    model.fit(X, y)\n    tr = mean_squared_error(y, model.predict(X))\n    te = mean_squared_error(y_test_true, model.predict(X_test))\n    print(str(degree).ljust(6), '|', format(tr, '.4f'), '  |', format(te, '.4f'))\n# degree 1 : both errors high            -> HIGH BIAS (underfit)\n# degree 3 : both low                    -> sweet spot (truth is sine-like)\n# degree 15: train ~0, test explodes     -> HIGH VARIANCE (overfit)\n# The test-MSE column traces the U-curve with your own numbers.",
      },
      {
        lang: 'python',
        label: 'Learning curves: the diagnostic that tells you whether more data will pay',
        code: "import numpy as np\nfrom sklearn.model_selection import learning_curve\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.datasets import make_classification\n\nX, y = make_classification(n_samples=3000, n_features=25, n_informative=8,\n                           flip_y=0.1, random_state=0)\n\ndef diagnose(name, model):\n    sizes, tr, va = learning_curve(model, X, y, cv=5,\n                                   train_sizes=np.linspace(0.1, 1.0, 5),\n                                   scoring='accuracy', random_state=0)\n    print('---', name, '---')\n    print('size | train | valid | gap')\n    for s, t, v in zip(sizes, tr.mean(axis=1), va.mean(axis=1)):\n        print(str(s).ljust(4), '|', round(t, 3), '|', round(v, 3),\n              '|', round(t - v, 3))\n\n# High-bias candidate: heavily regularized linear model\ndiagnose('logreg C=0.001 (high bias)', LogisticRegression(C=0.001, max_iter=2000))\n# Signature: train and valid CONVERGE at a mediocre level, gap ~0.\n# Verdict: more data will NOT help. Add capacity or features.\n\n# High-variance candidate: unlimited-depth tree\ndiagnose('deep tree (high variance)', DecisionTreeClassifier(random_state=0))\n# Signature: train ~1.000 throughout, valid much lower, gap large but\n# shrinking as size grows. Verdict: more data, pruning, or ensembles help.",
      },
    ],
    resources: [
      { label: 'StatQuest — bias and variance, clearly explained', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'An Introduction to Statistical Learning — Ch. 2', url: 'https://www.statlearning.com/', kind: 'book' },
      { label: 'Andrew Ng — ML Specialization (advice for applying ML)', url: 'https://www.coursera.org/specializations/machine-learning-introduction', kind: 'course' },
    ],
  },
  {
    id: 'regularization',
    phase: 4,
    phaseName: 'Core Machine Learning',
    orderIndex: 9,
    estimatedMins: 40,
    prerequisites: ['linear-regression-ml', 'bias-variance-tradeoff'],
    title: 'Regularization: Ridge, Lasso & Elastic Net',
    eli5:
      'An overfitting model is a student inventing wildly elaborate theories to explain every quirk of the practice problems. Regularization is the teacher adding a rule: every bit of complexity in your theory costs points. Now elaborate theories must EARN their complexity by genuinely predicting better. Ridge charges a gentle fee that shrinks all the wild ideas; Lasso charges a flat toll per idea, so weak ideas get dropped to exactly zero.',
    analogy:
      'You are packing for a trip and every coefficient is an item begging to come along. Ridge is a weight-based airline fee: quadratic in heaviness, so you shrink everything — smaller shampoo, lighter jacket — but you still pack a tiny bit of everything. Lasso is a strict per-item fee: marginal items are not worth their toll, so they stay home entirely — you leave with a genuinely shorter packing list (feature selection). Elastic net mixes both fees, which matters when items come in near-duplicate pairs: pure Lasso arbitrarily keeps one twin and drops the other; the mixed fee keeps both, each half-shrunk.',
    explanation:
      'Regularization fights overfitting by adding a complexity penalty to the loss, so the optimizer balances fitting the data against keeping the model tame: total loss = MSE + alpha x penalty(weights). Large weights are how linear models contort to chase noise (especially with many or correlated features), so penalizing weight size directly attacks variance — at the price of a little bias: the bias-variance tradeoff with an explicit dial, alpha. Ridge (L2) penalizes the sum of squared weights: it shrinks all coefficients smoothly toward zero but never exactly to zero, handles correlated features gracefully by splitting credit among them, and always has a unique stable solution — the default for pure prediction. Lasso (L1) penalizes the sum of absolute values: its geometry drives weak coefficients to EXACTLY zero, performing automatic feature selection and yielding sparse, interpretable models — but among correlated features it arbitrarily picks one and zeroes the rest, and it can be unstable. Elastic net mixes the two (l1_ratio controls the blend), getting sparsity with grouped selection of correlated features — the robust choice when features are many and correlated. Two operational rules: standardize features first (the penalty treats all coefficients equally, so scales must be comparable — and the intercept is never penalized), and choose alpha by cross-validation (RidgeCV, LassoCV, ElasticNetCV do this efficiently). The concept generalizes everywhere: L2 on neural network weights (weight decay), tree constraints, dropout, early stopping — all are complexity taxes.',
    technicalDeep:
      'Ridge in closed form: theta = (X^T X + alpha I)^(-1) X^T y — adding alpha to every eigenvalue of X^T X, which simultaneously guarantees invertibility (fixing multicollinearity: this is why ridge is THE cure for correlated features) and shrinks directions of low data variance hardest. Ridge is also MAP estimation with a Gaussian prior on weights; Lasso is MAP with a Laplace prior — sharper at zero, hence sparsity. The geometric picture: minimizing MSE subject to a weight-norm budget; the L2 ball is round, so the loss contours touch it at generic points (no zeros), while the L1 ball is a diamond whose corners sit ON the axes — contours hit corners with positive probability, zeroing coordinates. Lasso has no closed form (the absolute value is non-differentiable at zero); solvers use coordinate descent with the soft-thresholding operator S(z, alpha) = sign(z) x max(|z| - alpha, 0) — each coefficient is shrunk by alpha and clipped to zero, which IS the sparsity mechanism in one formula. Statistical properties: ridge dominates OLS in MSE for some alpha > 0 (Stein-type result); Lasso achieves consistent selection only under conditions (irrepresentable condition) that correlated designs violate — hence elastic net in practice. Degrees of freedom: for Lasso, the expected number of nonzero coefficients; for ridge, sum of s_i^2/(s_i^2 + alpha) over singular values — shrinkage as continuous complexity control. Paths: coefficient trajectories versus alpha (lars_path/lasso_path) are the standard diagnostic — features that survive large alpha are your strongest signals. In deep learning, note the AdamW subtlety: L2-penalty-in-the-loss and decoupled weight decay differ under adaptive optimizers, which is the entire point of AdamW.',
    whatBreaks:
      'Forgetting to standardize: the penalty crushes coefficients of large-scale features (whose numeric coefficients are naturally small... wait, inverse) — concretely, a feature measured in millimeters needs a numerically larger coefficient than the same feature in meters, so unstandardized L1/L2 penalizes features by their unit choices, which is meaningless. Penalizing the intercept (a from-scratch bug — sklearn excludes it) biases all predictions toward zero. Alpha too high underfits everything into mush; alpha chosen on the test set is leakage. Lasso with correlated features flip-flops selections across CV folds — treating the selected set as THE truth misleads stakeholders; elastic net or stability selection is honest. Lasso also saturates at n nonzero coefficients when features exceed samples. And interpreting shrunken coefficients as causal effect sizes compounds two errors at once — regularization deliberately biases coefficients toward zero.',
    efficientWay: {
      title: 'Choosing and tuning a penalty',
      approaches: [
        {
          name: 'Standardize inside a Pipeline, then RidgeCV / LassoCV / ElasticNetCV over a log-spaced alpha grid; default to ridge for pure prediction, lasso when you need sparsity/selection, elastic net for many correlated features',
          verdict: 'best',
          reason: 'The CV variants tune alpha efficiently along the regularization path, the pipeline kills scaling leakage, and the three-way decision rule matches penalty geometry to the actual goal (prediction vs interpretation vs correlated designs).',
        },
        {
          name: 'Plain OLS, and manually drop features when coefficients look unstable',
          verdict: 'ok',
          reason: 'Works for a handful of well-understood features, but manual selection scales terribly, invites p-hacking, and forfeits the variance reduction that shrinkage gives even when you keep every feature.',
        },
        {
          name: 'One fixed alpha (say 1.0) for every problem, no scaling',
          verdict: 'weak',
          reason: 'Optimal alpha varies by orders of magnitude across datasets, and without standardization the penalty is arbitrarily distributed by feature units — the model quietly optimizes nonsense.',
        },
      ],
      recommendation:
        'Muscle memory: make_pipeline(StandardScaler(), RidgeCV/LassoCV with a log-spaced alpha grid). Plot the coefficient path versus alpha once per project — watching which features survive shrinkage is a feature-importance analysis for free. Reach for elastic net the moment features are many and correlated.',
    },
    commonMistakes: [
      'Regularizing unstandardized features, so the penalty strength on each feature is secretly determined by its units',
      'Sweeping alpha linearly instead of log-spaced — the useful range spans 1e-4 to 1e2',
      'Treating the exact Lasso-selected feature set as ground truth when correlated features make selection unstable across folds',
      'Applying regularization to a model that is already underfitting — shrinkage adds bias and makes it strictly worse; diagnose first',
    ],
    seniorNotes:
      'Default posture in industry: some regularization always, zero regularization never — sklearn LogisticRegression regularizes by default (and C is INVERSE strength, the eternal gotcha). Ridge is the pragmatic default for tabular prediction; Lasso earns its keep when a 200-feature model must ship as a 12-feature scorecard for latency, cost, or explainability; elastic net when features come in correlated families (marketing channels, sensor arrays). Communicate shrinkage honestly: regularized coefficients are deliberately biased toward zero, so never present them as unbiased effect estimates in a causal discussion — that is statsmodels/OLS territory. The concept is also your bridge to deep learning interviews: weight decay, dropout, and early stopping are the same complexity-tax idea, and knowing that L2-in-loss differs from decoupled weight decay under Adam (the AdamW paper) is a senior-level flex.',
    interviewQuestions: [
      'What problem does regularization solve, and how does adding a penalty term accomplish it?',
      'Why does L1 regularization produce exactly-zero coefficients while L2 only shrinks them?',
      'When would you choose ridge versus lasso versus elastic net?',
    ],
    interviewAnswers: [
      'Regularization combats overfitting — high variance — by adding a complexity penalty to the training loss: total = data loss + alpha x penalty(weights). Overfitting linear models express themselves through large, unstable coefficients (especially under multicollinearity, where huge opposite-signed pairs cancel); taxing weight magnitude forces the model to spend coefficient budget only where the data genuinely pays for it. Mechanically it trades a small increase in bias for a large reduction in variance, with alpha as the explicit dial, tuned by cross-validation. Equivalently, it is MAP estimation: L2 corresponds to a Gaussian prior on weights, L1 to a Laplace prior.',
      'Geometry. Penalized fitting is equivalent to minimizing the loss subject to a norm budget: the solution is where the elliptical loss contours first touch the constraint region. The L2 region is a sphere — smooth everywhere — so the touch point is generically off-axis: every coefficient shrinks but stays nonzero. The L1 region is a diamond with corners ON the coordinate axes; corners protrude, so contours hit them with high probability, and a corner means some coordinates are exactly zero. Algebraically, the L1 subgradient produces the soft-thresholding update sign(z) x max(|z| - alpha, 0): any coefficient whose unpenalized value is below alpha is clipped to exactly zero, whereas the L2 update is pure multiplicative shrinkage that never reaches zero.',
      'Ridge when the goal is prediction and you suspect many small contributions or correlated features — it is stable, unique, handles collinearity by sharing credit, and usually wins on pure accuracy. Lasso when you need sparsity: feature selection, an interpretable scorecard, cheaper serving — accepting that among correlated features it arbitrarily keeps one. Elastic net when features are numerous and correlated (p >> n, feature families): the L2 component stabilizes and group-selects, the L1 component still zeroes the noise. In practice: RidgeCV as default, ElasticNetCV when correlation structure is strong, LassoCV when the sparse model IS the deliverable — always with standardized features and log-spaced alpha.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Soft-thresholding from scratch: watching L1 create exact zeros',
        code: "import numpy as np\nnp.random.seed(0)\n\n# Sparse truth: 10 features, only 3 matter\nn, p = 100, 10\nX = np.random.randn(n, p)\ntrue_w = np.array([3.0, -2.0, 1.5, 0, 0, 0, 0, 0, 0, 0])\ny = X @ true_w + np.random.randn(n) * 0.5\n\ndef soft_threshold(z, alpha):\n    return np.sign(z) * np.maximum(np.abs(z) - alpha, 0.0)   # THE sparsity mechanism\n\ndef lasso_coordinate_descent(X, y, alpha, iters=100):\n    m, p = X.shape\n    w = np.zeros(p)\n    col_sq = (X ** 2).sum(axis=0)\n    for _ in range(iters):\n        for j in range(p):\n            residual_j = y - X @ w + X[:, j] * w[j]   # residual excluding feature j\n            rho = X[:, j] @ residual_j\n            w[j] = soft_threshold(rho, alpha * m) / col_sq[j]\n    return w\n\ndef ridge_closed_form(X, y, alpha):\n    p = X.shape[1]\n    return np.linalg.solve(X.T @ X + alpha * np.eye(p), X.T @ y)\n\nprint('true    :', true_w)\nprint('ridge   :', ridge_closed_form(X, y, alpha=10.0).round(2))\n# ridge: every coefficient shrunk, NONE exactly zero\nprint('lasso   :', lasso_coordinate_descent(X, y, alpha=0.2).round(2))\n# lasso: the 7 irrelevant features are EXACTLY 0.0 — selection, not just shrinkage",
      },
      {
        lang: 'python',
        label: 'Ridge vs Lasso vs Elastic Net on real data with CV-tuned alpha',
        code: "import numpy as np\nfrom sklearn.datasets import fetch_california_housing\nfrom sklearn.linear_model import LinearRegression, RidgeCV, LassoCV, ElasticNetCV\nfrom sklearn.preprocessing import StandardScaler, PolynomialFeatures\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import r2_score\n\nX, y = fetch_california_housing(return_X_y=True)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)\n\nalphas = np.logspace(-4, 2, 50)   # ALWAYS log-spaced\n\n# Polynomial expansion inflates features (8 -> 44), inviting overfitting —\n# exactly the regime where regularization earns its keep.\ndef pipe(model):\n    return make_pipeline(PolynomialFeatures(2, include_bias=False),\n                         StandardScaler(), model)\n\nmodels = {\n    'OLS (no penalty)': pipe(LinearRegression()),\n    'RidgeCV': pipe(RidgeCV(alphas=alphas)),\n    'LassoCV': pipe(LassoCV(alphas=alphas, max_iter=20000, random_state=0)),\n    'ElasticNetCV': pipe(ElasticNetCV(alphas=alphas, l1_ratio=[0.2, 0.5, 0.8],\n                                      max_iter=20000, random_state=0)),\n}\nfor name, model in models.items():\n    model.fit(X_tr, y_tr)\n    print(name.ljust(17), '| test R2:', round(r2_score(y_te, model.predict(X_te)), 4))\n\n# Sparsity report: how many features did Lasso actually keep?\nlasso = models['LassoCV'].named_steps['lassocv']\nprint('LassoCV chose alpha =', round(float(lasso.alpha_), 5),\n      '| nonzero coefs:', int(np.sum(lasso.coef_ != 0)), 'of', len(lasso.coef_))\n# Typical: regularized models match or beat OLS while Lasso uses a\n# fraction of the 44 expanded features — simpler AND at least as good.",
      },
    ],
    resources: [
      { label: 'StatQuest — Ridge, Lasso and Elastic Net videos', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'An Introduction to Statistical Learning — Ch. 6', url: 'https://www.statlearning.com/', kind: 'book' },
      { label: 'scikit-learn User Guide — linear models (regularization)', url: 'https://scikit-learn.org/stable/user_guide.html', kind: 'docs' },
    ],
  },
  {
    id: 'feature-engineering',
    phase: 4,
    phaseName: 'Core Machine Learning',
    orderIndex: 10,
    estimatedMins: 45,
    prerequisites: ['ml-project-workflow', 'train-test-cross-validation', 'regularization', 'eda-process'],
    title: 'Feature Engineering & Preprocessing',
    eli5:
      'Models are like picky eaters: they only eat numbers, all portions should be similar sizes, and nothing can be missing from the plate. Feature engineering is the cooking: turn words into numbers, resize the portions (scaling), fill the gaps sensibly (imputation), and — the real magic — combine raw ingredients into tastier dishes, like turning price and size into price-per-square-meter, which says far more than either alone.',
    analogy:
      'Raw data is crude oil; models are engines. Pouring crude into a race car achieves nothing — refining is where the power comes from. Scaling is standardizing the fuel grade so no cylinder dominates. Encoding is converting a fuel the engine cannot burn (categories) into one it can (numbers). Imputation is patching contaminated batches instead of discarding the whole shipment. And domain-driven features are the additives a chemist adds because they understand engines: the refinery, not the engine, is where seasoned teams win — better fuel beats a fancier engine burning crude.',
    explanation:
      'Feature engineering transforms raw data into the representation a model learns from, and on tabular problems it moves metrics more than model choice does. Scaling: standardization (subtract mean, divide by std) or min-max normalization — mandatory for anything distance- or gradient-based (k-NN, SVMs, linear/logistic with regularization, neural nets), a no-op for trees; always fit the scaler on training data only. Encoding categoricals: one-hot for low-cardinality nominal features (drop one column to dodge the dummy trap with linear models); ordinal encoding only when order is real (S < M < L); for high-cardinality features (zip codes, merchants), target encoding — replacing each category with a smoothed mean of the target — is powerful but the most leakage-prone technique in ML, so it must be computed out-of-fold. Missing data: first ask WHY it is missing (a lab value absent because the patient looked healthy is information, not noise); impute with median/mode for simple cases, add missing-indicator columns to preserve the signal of absence, use model-based imputers sparingly, and never drop rows casually under real-world missingness rates. Domain-driven features — the highest-leverage act in classical ML: encode the hypotheses from your workflow as ratios (debt-to-income), rates (complaints per month), differences (price minus neighborhood median), time decompositions (hour-of-day, is-weekend, days-since-last-purchase), aggregations (customer transaction counts), and interactions. A linear model with excellent features routinely beats a boosted ensemble on raw columns — and everything must live in a Pipeline so the exact same transforms run identically at training and serving time.',
    technicalDeep:
      'Scaling menu and when each wins: StandardScaler (mean 0, std 1) is the default for roughly symmetric features; MinMaxScaler preserves zero-sparsity and bounded ranges but is fragile to a single outlier (it defines the range); RobustScaler (median/IQR) for outlier-heavy data; log or Box-Cox/Yeo-Johnson transforms for heavy right skew (income, prices) — often the difference between a linear model working and failing, since it makes multiplicative relationships additive. Target encoding leakage math: encoding category c with the mean target INCLUDING row i leaks y_i into x_i — with rare categories this approaches copying the label into a feature; correct practice is out-of-fold encoding (compute each fold encoding from other folds) plus smoothing toward the global mean weighted by category count (the standard shrinkage formula: (n x cat_mean + m x global_mean) / (n + m)). Missingness taxonomy — MCAR (completely random: imputation is safe), MAR (explainable by observed variables: conditional imputation works), MNAR (the absence itself depends on the value, e.g. high earners hiding income: no imputation fixes it; the indicator column carries the real signal). Categorical alternatives at scale: hashing trick (fixed-width, collision-tolerant, stateless — good for streaming), frequency encoding, and learned entity embeddings in deep models. Interactions and polynomial features explode dimensionality combinatorially — pair them with regularization (previous topic) or let tree ensembles discover interactions natively. The serving contract: training-serving skew — any discrepancy between offline transforms and the online path — is among the most common production ML failures; sklearn Pipelines (or feature stores at org scale) exist to make the transform a single versioned artifact. Feature selection closes the loop: mutual information and permutation importance beat raw correlation for non-linear relevance; regularization paths (Lasso) do selection inside the model.',
    whatBreaks:
      'Fitting any statistic on the full dataset before splitting — scaler means, imputation medians, target encodings, even the vocabulary of a text vectorizer — is leakage, and target encoding computed naively (with the row own label) can fabricate near-perfect validation scores that evaporate in production. One-hot encoding a 10,000-category column detonates memory and starves each dummy of signal. Ordinal-encoding a nominal feature (red=1, green=2, blue=3) invents a fictitious order that linear models will obediently learn. Median-imputing an MNAR feature erases its most informative pattern — absence. Min-max scaling with one extreme outlier compresses 99% of values into a hair-width interval. Unseen categories at serving time crash naive encoders (set handle_unknown). And any hand-rolled transform applied in a notebook but reimplemented slightly differently in the serving code produces training-serving skew — correct model, wrong inputs, silent degradation.',
    efficientWay: {
      title: 'Building features without leaking',
      approaches: [
        {
          name: 'ColumnTransformer + Pipeline: declare numeric transforms (impute + scale), categorical transforms (impute + encode with handle_unknown), and domain-feature construction as one fitted artifact, cross-validated end to end; engineer features FROM your verified workflow hypotheses',
          verdict: 'best',
          reason: 'The pipeline makes leakage structurally impossible (every statistic fits inside training folds), guarantees the serving path equals the training path, and ties feature creation to domain hypotheses instead of random column mashing.',
        },
        {
          name: 'Transform the DataFrame step by step in a notebook with careful manual train/test discipline',
          verdict: 'ok',
          reason: 'Fine for exploration and quick EDA-driven prototyping, but discipline decays as the notebook grows, and shipping requires reimplementing every step — the birthplace of training-serving skew.',
        },
        {
          name: 'Feed raw columns to a gradient-boosting model and let it figure everything out',
          verdict: 'weak',
          reason: 'Trees do handle scale and some interactions, but they cannot invent ratios, aggregations, or time-decompositions that need domain knowledge, cannot fix leakage or MNAR missingness, and the approach collapses entirely for linear/distance/neural models.',
        },
      ],
      recommendation:
        'Standard skeleton for every tabular project: ColumnTransformer with (SimpleImputer + StandardScaler) for numerics and (SimpleImputer + OneHotEncoder(handle_unknown=ignore)) for categoricals, model at the end, cross_val_score on the whole object. Then earn your pay: add 3-5 domain features encoding your verified hypotheses and measure the lift — that number is your feature-engineering ROI, and it is usually bigger than any model swap.',
    },
    commonMistakes: [
      'Fitting scalers, imputers, or target encodings on the full dataset before splitting — the most common leakage source in real projects and competitions alike',
      'Ordinal-encoding nominal categories, inventing an order (red < green < blue) that linear and distance models faithfully learn as fact',
      'Imputing missing values without adding an indicator column, silently deleting the often-predictive signal that the value was absent',
      'Engineering features in a notebook and reimplementing them by hand in the serving code — training-serving skew that no offline metric will ever catch',
    ],
    seniorNotes:
      'Ask any senior on tabular ML where the wins come from: features, features, features — a mediocre model on great features beats a great model on raw columns, and feature work compounds across every future model while hyperparameter tuning does not. At organization scale this becomes the feature store problem: computing features once, versioned, with guaranteed offline/online parity — because training-serving skew is the top silent killer of production models. Target encoding is the sharpest knife in the drawer: massive lift on high-cardinality features, catastrophic leakage when done lazily — insist on out-of-fold computation in code review. Log-transform skewed money-like features by reflex. And treat missingness as data: the pattern of what is absent (which fields, for which users, when) frequently carries more signal than the imputed values themselves.',
    interviewQuestions: [
      'Which models require feature scaling and why? Which do not?',
      'How would you encode a categorical feature with 10,000 unique values, and what is the danger with target encoding?',
      'How do you handle missing data, and why is the mechanism of missingness (MCAR/MAR/MNAR) important?',
    ],
    interviewAnswers: [
      'Scaling matters wherever the algorithm compares or combines raw feature magnitudes. Distance-based models (k-NN, K-means, SVMs with RBF kernels) need it because unscaled distances are dominated by the largest-unit feature. Gradient-descent-trained models (linear/logistic regression, neural networks) need it because unequal scales create ill-conditioned, ravine-shaped loss surfaces that cripple convergence. Regularized models need it because L1/L2 penalties compare coefficient magnitudes, which are only commensurate on standardized features. Tree-based models (decision trees, random forests, gradient boosting) are scale-invariant — splits are order-based thresholds, unaffected by monotone transforms — so scaling is a harmless no-op there.',
      'One-hot is out — 10,000 columns of nearly-all-zeros. Options: target encoding (replace each category with a smoothed mean of the target — powerful, the usual choice), frequency encoding, the hashing trick for streaming/stateless settings, or learned embeddings in deep models. The danger with target encoding is leakage: naively including a row own label in its category mean writes the answer into the feature — for rare categories it nearly copies the label — producing stellar validation and dead production performance. Correct practice: out-of-fold encoding (each fold encoded using only other folds), smoothing rare categories toward the global mean, and a fallback value for unseen categories at serving time.',
      'First diagnose, then treat. Quantify missingness per feature, then classify the mechanism: MCAR (a sensor randomly dropping readings) — simple median/mode imputation is unbiased; MAR (missingness explained by other observed columns) — conditional or model-based imputation works; MNAR (absence depends on the hidden value itself, like high earners omitting income) — no imputation recovers the truth, and the honest move is a missing-indicator column so the model learns from the absence pattern, plus domain investigation. Practical defaults: median/mode imputation PLUS indicator columns inside a Pipeline (so statistics fit on training data only), never casually dropping rows (bias plus data loss), and remembering the indicator often ends up among the most important features — absence is information.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'The production skeleton: ColumnTransformer pipeline + domain features, leak-free',
        code: "import numpy as np\nimport pandas as pd\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\nnp.random.seed(0)\n\n# Synthetic churn-like data with the usual real-world mess\nn = 2000\ndf = pd.DataFrame({\n    'tenure_months': np.random.exponential(24, n).round(),\n    'monthly_charge': np.random.normal(65, 20, n).round(2),\n    'support_tickets': np.random.poisson(2, n),\n    'contract': np.random.choice(['monthly', 'yearly', 'two_year'], n, p=[0.5, 0.3, 0.2]),\n    'payment': np.random.choice(['card', 'bank', 'check', None], n, p=[0.4, 0.3, 0.2, 0.1]),\n})\nrisk = (df['contract'] == 'monthly') * 1.2 + df['support_tickets'] * 0.3 \\\n       - df['tenure_months'] * 0.03 + np.random.randn(n)\ny = (risk > np.percentile(risk, 75)).astype(int)\n\n# DOMAIN FEATURES first (from hypotheses): ratios and rates say more than raw columns\ndf['charge_per_tenure'] = df['monthly_charge'] / (df['tenure_months'] + 1)\ndf['tickets_per_year'] = df['support_tickets'] / ((df['tenure_months'] + 1) / 12)\n\nnumeric = ['tenure_months', 'monthly_charge', 'support_tickets',\n           'charge_per_tenure', 'tickets_per_year']\ncategorical = ['contract', 'payment']\n\npre = ColumnTransformer([\n    ('num', Pipeline([('impute', SimpleImputer(strategy='median', add_indicator=True)),\n                      ('scale', StandardScaler())]), numeric),\n    ('cat', Pipeline([('impute', SimpleImputer(strategy='most_frequent')),\n                      ('onehot', OneHotEncoder(handle_unknown='ignore'))]), categorical),\n])\nmodel = Pipeline([('pre', pre),\n                  ('clf', LogisticRegression(max_iter=2000, class_weight='balanced'))])\n\n# Everything — imputation stats, scaler stats, encodings — fits INSIDE each\n# training fold. Leakage is structurally impossible; serving uses this same object.\nscores = cross_val_score(model, df, y, cv=5, scoring='roc_auc')\nprint('CV ROC-AUC: %.3f +/- %.3f' % (scores.mean(), scores.std()))",
      },
      {
        lang: 'python',
        label: 'Target encoding: the naive (leaky) way vs the out-of-fold (correct) way',
        code: "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import KFold\nnp.random.seed(42)\n\n# High-cardinality categorical (200 merchants), target NOT related to merchant\nn = 1000\ndf = pd.DataFrame({'merchant': np.random.randint(0, 200, n)})\ndf['y'] = np.random.binomial(1, 0.3, n)   # pure noise w.r.t. merchant!\n\n# NAIVE target encoding: each row's own label participates in its category mean\nnaive = df.groupby('merchant')['y'].transform('mean')\nprint('naive encoding corr with target   :', round(np.corrcoef(naive, df.y)[0, 1], 3))\n# ~0.45 correlation with a target it should have ZERO relation to — pure leakage.\n# Rare merchants (1-2 rows) nearly copy their own label into the feature.\n\n# OUT-OF-FOLD encoding with smoothing: each row encoded WITHOUT its own fold\ndef oof_target_encode(df, col, target, n_splits=5, m=20):\n    global_mean = df[target].mean()\n    encoded = np.full(len(df), global_mean)\n    for tr_idx, va_idx in KFold(n_splits, shuffle=True, random_state=0).split(df):\n        tr = df.iloc[tr_idx]\n        stats = tr.groupby(col)[target].agg(['mean', 'count'])\n        # shrink small categories toward the global mean\n        smooth = (stats['count'] * stats['mean'] + m * global_mean) / (stats['count'] + m)\n        encoded[va_idx] = df.iloc[va_idx][col].map(smooth).fillna(global_mean).values\n    return encoded\n\noof = oof_target_encode(df, 'merchant', 'y')\nprint('out-of-fold encoding corr with target:', round(np.corrcoef(oof, df.y)[0, 1], 3))\n# ~0.0 — the honest answer, since merchant truly carries no signal here.\n# The 0.45 vs 0.0 gap is exactly the fake lift a leaky pipeline would report.",
      },
    ],
    resources: [
      { label: 'Kaggle Learn — feature engineering course', url: 'https://www.kaggle.com/learn', kind: 'practice' },
      { label: 'scikit-learn User Guide — preprocessing & pipelines', url: 'https://scikit-learn.org/stable/user_guide.html', kind: 'docs' },
      { label: 'Kaggle Datasets — practice on messy real data', url: 'https://www.kaggle.com/datasets', kind: 'practice' },
      { label: 'Google ML Crash Course — representation & feature crosses', url: 'https://developers.google.com/machine-learning/crash-course', kind: 'course' },
    ],
  },
]
