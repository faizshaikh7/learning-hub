import type { CurriculumTopic } from '@/types'

/** Phase 5 — Ensembles & Unsupervised Learning (7 topics). */
export const AIML_P5: CurriculumTopic[] = [
  {
    "id": "random-forests",
    "phase": 5,
    "phaseName": "Ensembles & Unsupervised Learning",
    "orderIndex": 1,
    "estimatedMins": 45,
    "prerequisites": ["decision-trees"],
    "title": "Random Forests & Bagging",
    "eli5": "One decision tree is like asking one friend for advice — they might be biased. A random forest asks 500 friends, each of whom saw slightly different information, and takes a vote. The crowd is almost always smarter than any single friend.",
    "analogy": "Bagging is like estimating the weight of a bull at a county fair. Any single guess is noisy, but the average of hundreds of independent guesses is eerily accurate. Bootstrap sampling and feature randomness exist purely to keep the guesses independent — if everyone whispers to each other first, the average stops being magic.",
    "explanation": "A random forest trains many deep decision trees, each on a bootstrap sample (random draw with replacement) of the training data, and each split considers only a random subset of features. Predictions are averaged (regression) or majority-voted (classification). Individual trees are low-bias but high-variance; averaging many decorrelated trees keeps the low bias while slashing the variance. The feature-subset trick (typically sqrt(n_features) for classification) is what makes the trees decorrelated — without it, every tree would greedily pick the same strong feature at the root and the ensemble would be hundreds of near-copies.",
    "technicalDeep": "Bootstrap sampling draws n examples with replacement, so each tree sees about 63.2% of unique rows (1 - 1/e); the remaining ~36.8% are that tree's out-of-bag (OOB) rows. The OOB score is computed by predicting each row only with trees that never saw it — a free, built-in cross-validation estimate. Variance of an average of B correlated estimators is rho*sigma^2 + (1-rho)*sigma^2/B: as B grows, the second term vanishes but the correlation term rho*sigma^2 remains. This is why feature randomness (lowering rho) matters more than adding trees past a few hundred. Random forests do not overfit as trees are added — the test error curve flattens, it does not U-turn. Feature importance comes in two flavors: impurity-based (fast, but biased toward high-cardinality features) and permutation importance (slower, more honest).",
    "whatBreaks": "Forests extrapolate terribly — a tree can only predict values seen in leaves, so on regression targets outside the training range (e.g., forecasting a growing metric) predictions clip to the training max. Impurity importance on a dataset with an ID-like column will rank that column as the 'most important feature'. Highly imbalanced classes make majority voting nearly always predict the majority class unless you set class_weight or resample. And with thousands of trees on wide data, inference latency and model size (hundreds of MB) can break production deployment budgets.",
    "efficientWay": {
      "title": "Learning Random Forests Properly",
      "approaches": [
        {
          "name": "Implement bagging from scratch on one small dataset, then sklearn on a toy set, then a real Kaggle tabular dataset",
          "verdict": "best",
          "reason": "Writing the bootstrap loop and vote yourself makes OOB and decorrelation obvious. sklearn then feels like a shortcut you understand, not a black box."
        },
        {
          "name": "Jump straight to RandomForestClassifier with default hyperparameters",
          "verdict": "ok",
          "reason": "Defaults are genuinely strong (that is the forest's superpower), but you will not know why n_estimators=2000 wastes compute or why max_features matters."
        },
        {
          "name": "Memorize the algorithm pseudocode without running anything",
          "verdict": "weak",
          "reason": "You will confuse bagging with boosting in interviews and never develop intuition for variance reduction."
        }
      ],
      "recommendation": "Build a 20-line bagging ensemble in NumPy over sklearn's DecisionTreeClassifier, verify OOB score matches a holdout set, then graduate to RandomForestClassifier on a real dataset and compare permutation vs impurity importance."
    },
    "commonMistakes": [
      "Tuning n_estimators as if more trees can overfit — they cannot; find the plateau (usually 100-500) and stop paying compute",
      "Trusting impurity-based feature importance on mixed-cardinality data — always cross-check with permutation importance",
      "Using random forests for extrapolation tasks like time-series trend forecasting, where tree ensembles clip to the training range",
      "Forgetting that OOB score already estimates generalization — running an extra cross-validation loop wastes 5x the compute for the same answer"
    ],
    "seniorNotes": "In production, random forests are the 'reliable diesel engine' of tabular ML: nearly tuning-free, robust to outliers and unscaled features, and naturally parallel (n_jobs=-1 trains trees across cores). Seniors reach for them as a strong baseline before spending a week on gradient boosting. Watch model size: 500 unrestricted trees on 1M rows can exceed 1GB serialized — cap max_depth or min_samples_leaf for deployment. Permutation importance on a holdout set is the defensible answer when a stakeholder asks 'which features drive this model?'.",
    "interviewQuestions": [
      "Why does bagging reduce variance but not bias?",
      "What is the out-of-bag score and why is it a valid generalization estimate?",
      "Why does a random forest restrict the features considered at each split?"
    ],
    "interviewAnswers": [
      "Averaging B estimators leaves the expected prediction unchanged (bias stays the same) but shrinks the variance of the average roughly by 1/B for the uncorrelated component. Since deep trees are low-bias/high-variance, averaging attacks exactly the weakness they have. Boosting, by contrast, targets bias by sequentially fitting residuals.",
      "Each bootstrap sample leaves out ~36.8% of rows for that tree. For any row, roughly one third of the trees never trained on it, so predicting that row using only those trees is a genuine out-of-sample prediction. Aggregating this over all rows gives a cross-validation-quality estimate with zero extra training cost.",
      "If every split could see every feature, all trees would pick the same dominant features and be highly correlated. The variance of an average of correlated estimators has an irreducible rho*sigma^2 term, so decorrelating the trees (max_features=sqrt(p) is the classic choice) is what actually lets averaging pay off."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Bagging from scratch, then verify against sklearn's forest with OOB",
        "code": "import numpy as np\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_breast_cancer(return_X_y=True)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=42)\n\n# --- Bagging by hand: bootstrap + majority vote ---\nrng = np.random.default_rng(42)\nn_trees, n = 100, len(X_tr)\npreds = np.zeros((n_trees, len(X_te)))\nfor b in range(n_trees):\n    idx = rng.integers(0, n, size=n)          # sample WITH replacement\n    tree = DecisionTreeClassifier(max_features='sqrt', random_state=b)\n    tree.fit(X_tr[idx], y_tr[idx])\n    preds[b] = tree.predict(X_te)\nmanual_acc = ((preds.mean(axis=0) > 0.5).astype(int) == y_te).mean()\nprint('hand-rolled bagging acc:', round(manual_acc, 4))\n\n# --- sklearn forest with free OOB estimate ---\nrf = RandomForestClassifier(n_estimators=300, oob_score=True,\n                            n_jobs=-1, random_state=42)\nrf.fit(X_tr, y_tr)\nprint('sklearn forest acc   :', round(rf.score(X_te, y_te), 4))\nprint('OOB score (free CV)  :', round(rf.oob_score_, 4))"
      }
    ],
    "resources": [
      { "label": "StatQuest — Random Forests clearly explained", "url": "https://www.youtube.com/@statquest", "kind": "video" },
      { "label": "An Introduction to Statistical Learning (Ch. 8: Tree-Based Methods)", "url": "https://www.statlearning.com/", "kind": "book" },
      { "label": "scikit-learn User Guide — Ensemble methods", "url": "https://scikit-learn.org/stable/user_guide.html", "kind": "docs" },
      { "label": "Kaggle Learn — practice on real tabular data", "url": "https://www.kaggle.com/learn", "kind": "practice" }
    ]
  },
  {
    "id": "gradient-boosting",
    "phase": 5,
    "phaseName": "Ensembles & Unsupervised Learning",
    "orderIndex": 2,
    "estimatedMins": 55,
    "prerequisites": ["random-forests", "gradient-descent"],
    "title": "Gradient Boosting: XGBoost & LightGBM",
    "eli5": "Instead of asking 500 friends at once, you ask one friend, look at where they were wrong, and then ask the next friend to focus only on fixing those mistakes. Repeat 500 times. Each new friend is a specialist in the errors everyone before them made.",
    "analogy": "Boosting is like editing an essay in passes. Draft one gets the ideas down (a rough first tree). Pass two fixes the biggest structural problems (the largest residuals). Pass three fixes grammar. Each pass makes a small correction (the learning rate) rather than rewriting everything — small careful edits compound into a polished result, while aggressive rewrites (high learning rate) can wreck what already worked.",
    "explanation": "Gradient boosting builds trees sequentially. Each new tree is fit to the negative gradient of the loss with respect to the current ensemble's predictions — for squared error, that is literally the residuals. The new tree's output is added to the ensemble scaled by a small learning rate (0.01-0.3). It is gradient descent, but the 'step' is a whole tree in function space instead of a vector in parameter space. Unlike bagging (parallel, variance reduction), boosting is sequential and attacks bias — which is why shallow trees (depth 3-8) work best as weak learners.",
    "technicalDeep": "XGBoost's innovation is a second-order Taylor expansion of the loss: each leaf's optimal weight is -G/(H+lambda) where G and H are sums of gradients and Hessians of the examples in that leaf, and the split gain has a closed form from the same statistics — plus explicit regularization (lambda on leaf weights, gamma as a minimum split gain). LightGBM adds histogram binning (features discretized into ~255 bins so split-finding is O(bins) not O(rows)), leaf-wise growth (always split the leaf with max gain, giving deeper asymmetric trees), and GOSS sampling. Boosting wins tabular Kaggle because tabular data has heterogeneous features, sharp non-smooth interactions, and meaningful individual columns — trees handle all three natively, while neural nets must burn capacity learning axis-aligned splits that trees get for free. The learning-rate/n_estimators trade-off is the core tuning axis: lower eta plus more rounds plus early stopping almost always wins.",
    "whatBreaks": "Unlike forests, boosting absolutely overfits as rounds increase — without early stopping on a validation set, test error U-turns. Label leakage is amplified: boosting will find and exploit a leaked feature within a few rounds and look miraculous until production. Boosted trees still cannot extrapolate beyond the training target range. Overly deep trees (depth 12+) as weak learners destroy the bias-correction dynamic and memorize noise. And retraining pipelines that fix n_estimators from an old tuning run silently under- or over-fit when data volume changes — early stopping should pick the round count every retrain.",
    "efficientWay": {
      "title": "Mastering Boosting",
      "approaches": [
        {
          "name": "Code the residual-fitting loop from scratch, then XGBoost on a toy set, then a real Kaggle competition dataset",
          "verdict": "best",
          "reason": "Ten lines of 'fit tree to residuals, add prediction * lr' demystifies the whole family. Then XGBoost's knobs (eta, max_depth, subsample, early stopping) map to concepts you own."
        },
        {
          "name": "Start with LightGBM defaults and tune with Optuna",
          "verdict": "ok",
          "reason": "Effective in practice and how much industry work happens, but you will treat overfitting symptoms without understanding the sequential bias-correction causing them."
        },
        {
          "name": "Copy a Kaggle notebook's 40-line parameter grid verbatim",
          "verdict": "weak",
          "reason": "Cargo-culting hyperparameters from a different dataset teaches nothing and often performs worse than tuned defaults."
        }
      ],
      "recommendation": "Write the 10-line gradient boosting loop for squared error in NumPy + sklearn trees, watch train/validation error diverge as rounds grow, then reproduce the fix with XGBoost's early_stopping_rounds on a real dataset. Tune learning_rate, max_depth, and subsample before anything else."
    },
    "commonMistakes": [
      "Training without early stopping and a held-out validation set — the single most common way boosting overfits in the wild",
      "Tuning ten hyperparameters at once instead of the big three: learning_rate, max_depth/num_leaves, and n_estimators-via-early-stopping",
      "One-hot encoding high-cardinality categoricals for LightGBM, which handles categorical splits natively and does it better",
      "Assuming boosting needs feature scaling or normal distributions — tree splits are invariant to monotonic transforms; spend that effort on leakage checks instead"
    ],
    "seniorNotes": "For tabular problems under ~10M rows, gradient boosting remains the default winner over deep learning — multiple published benchmarks (Grinsztajn et al. 2022) confirm it, and every serious Kaggle tabular leaderboard is XGBoost/LightGBM/CatBoost blends. Seniors care about: deterministic retraining (seed everything, log the early-stopped round count), monotonic constraints when the business requires 'price up implies risk up' behavior, and SHAP values for regulator-facing explanations. LightGBM trains 5-20x faster than XGBoost on wide data thanks to histograms; XGBoost is more battle-tested for exact reproducibility. Know both, benchmark once per project.",
    "interviewQuestions": [
      "Explain the difference between bagging and boosting in terms of bias and variance.",
      "Why is the learning rate in gradient boosting coupled to the number of trees?",
      "Why do gradient-boosted trees usually beat neural networks on tabular data?"
    ],
    "interviewAnswers": [
      "Bagging trains high-variance, low-bias learners (deep trees) independently in parallel and averages them — variance drops, bias is untouched. Boosting trains low-variance, high-bias learners (shallow trees) sequentially, each correcting the ensemble's remaining errors — bias drops with each round, but variance grows if you run too long, hence early stopping. They are complementary answers to opposite failure modes.",
      "Each tree's contribution is scaled by the learning rate, so halving it means each round corrects half as much error and you need roughly twice the rounds to reach the same training fit. Small learning rates take smaller steps in function space, which regularizes: the ensemble explores a smoother path and generalizes better. Standard practice is to fix a small eta (0.01-0.1) and let early stopping choose the number of rounds.",
      "Tabular data has heterogeneous feature scales, irrelevant columns, and sharp threshold-style interactions (e.g., 'age > 65 AND income < X'). Axis-aligned tree splits express these natively, are invariant to feature scaling, and ignore irrelevant features via split selection. Neural networks favor smooth functions, need careful preprocessing, and must spend capacity approximating step functions — a poor inductive-bias match that only flips at very large scale or with heavy pretraining."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Gradient boosting from scratch (fit trees to residuals)",
        "code": "import numpy as np\nfrom sklearn.datasets import fetch_california_housing\nfrom sklearn.tree import DecisionTreeRegressor\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error\n\nX, y = fetch_california_housing(return_X_y=True)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)\n\nlr, n_rounds = 0.1, 200\npred_tr = np.full(len(y_tr), y_tr.mean())   # F0 = mean\npred_te = np.full(len(y_te), y_tr.mean())\ntrees = []\nfor m in range(n_rounds):\n    residuals = y_tr - pred_tr               # negative gradient of MSE\n    tree = DecisionTreeRegressor(max_depth=3)\n    tree.fit(X_tr, residuals)\n    pred_tr += lr * tree.predict(X_tr)\n    pred_te += lr * tree.predict(X_te)\n    if (m + 1) % 50 == 0:\n        print('round', m + 1, 'test MSE:',\n              round(mean_squared_error(y_te, pred_te), 4))"
      },
      {
        "lang": "python",
        "label": "XGBoost with early stopping (the production pattern)",
        "code": "import xgboost as xgb\nfrom sklearn.datasets import fetch_california_housing\nfrom sklearn.model_selection import train_test_split\n\nX, y = fetch_california_housing(return_X_y=True)\nX_tr, X_val, y_tr, y_val = train_test_split(X, y, random_state=0)\n\nmodel = xgb.XGBRegressor(\n    n_estimators=2000,        # generous ceiling...\n    learning_rate=0.05,\n    max_depth=6,\n    subsample=0.8,\n    colsample_bytree=0.8,\n    early_stopping_rounds=50, # ...early stopping picks the real count\n    eval_metric='rmse',\n)\nmodel.fit(X_tr, y_tr, eval_set=[(X_val, y_val)], verbose=100)\nprint('best iteration:', model.best_iteration)\nprint('val RMSE      :', round(model.best_score, 4))"
      }
    ],
    "resources": [
      { "label": "StatQuest — Gradient Boost & XGBoost series", "url": "https://www.youtube.com/@statquest", "kind": "video" },
      { "label": "XGBoost official documentation", "url": "https://xgboost.readthedocs.io/", "kind": "docs" },
      { "label": "An Introduction to Statistical Learning (boosting section)", "url": "https://www.statlearning.com/", "kind": "book" },
      { "label": "Kaggle Learn — Intro to ML & competitions practice", "url": "https://www.kaggle.com/learn", "kind": "practice" }
    ]
  },
  {
    "id": "svm",
    "phase": 5,
    "phaseName": "Ensembles & Unsupervised Learning",
    "orderIndex": 3,
    "estimatedMins": 50,
    "prerequisites": ["gradient-descent", "matrix-operations"],
    "title": "Support Vector Machines",
    "eli5": "Imagine two groups of kids on a playground and you must draw a chalk line between them. Lots of lines work, but the safest one stays as far as possible from the nearest kid on each side. SVMs find that safest line, and only the kids closest to the line — the support vectors — decide where it goes.",
    "analogy": "The kernel trick is like judging whether two crumpled sheets of paper started as the same drawing. Instead of painstakingly un-crumpling each sheet into a flat (high-dimensional) form and comparing point by point, you have a magic function that tells you their similarity directly from the crumpled balls. Kernels compute similarity 'as if' you had mapped the data to a huge feature space, without ever going there.",
    "explanation": "An SVM finds the hyperplane w.x + b = 0 that separates classes with maximum margin — the largest distance to the nearest training points. Maximizing the margin equals minimizing ||w||^2 subject to every point being on the correct side by at least 1. Real data is not separable, so the soft-margin version adds slack variables with penalty C: large C means 'punish violations hard' (tighter fit, higher variance), small C means 'allow violations' (wider margin, more regularized). The prediction depends only on the support vectors — points on or inside the margin — which is why SVMs are sparse in examples.",
    "technicalDeep": "The dual formulation reveals that training and prediction touch data only through inner products x_i . x_j. Replace that inner product with a kernel k(x_i, x_j) = phi(x_i) . phi(x_j) and you have trained a linear classifier in the implicit feature space of phi — without materializing it. The RBF kernel exp(-gamma * ||x - x'||^2) corresponds to an infinite-dimensional feature space; gamma controls locality (large gamma means each support vector influences only a tiny neighborhood, which memorizes; small gamma approaches a linear-ish smooth boundary). Mercer's condition (positive semi-definite kernel matrix) guarantees a valid implicit space. Hinge loss max(0, 1 - y * f(x)) plus L2 penalty is the loss-function view — SVMs are just another regularized linear model, but with a loss that goes exactly to zero past the margin, producing sparsity. Training is O(n^2)-O(n^3) for kernel SVMs, which is why they fade past ~100k examples.",
    "whatBreaks": "Forgetting to scale features destroys the RBF kernel — distance is dominated by whatever feature has the largest units, and the margin geometry becomes meaningless. Kernel SVMs on 1M+ rows will simply never finish training (quadratic kernel matrix); use LinearSVC or SGDClassifier with hinge loss instead. Large gamma plus large C yields a spiky boundary that shatters the training set and fails on anything new. SVM decision scores are not probabilities — feeding them into a system expecting calibrated probabilities without Platt scaling / CalibratedClassifierCV misleads downstream thresholds.",
    "efficientWay": {
      "title": "Building SVM Intuition",
      "approaches": [
        {
          "name": "Implement a linear SVM via hinge-loss gradient descent from scratch, then sklearn SVC on 2D toy data with plotted boundaries, then a real text or bio dataset",
          "verdict": "best",
          "reason": "The scratch version proves an SVM is 'just' a regularized linear model with hinge loss; the 2D plots make C and gamma visceral; a real dataset shows where kernels still shine (small-n, wide-p)."
        },
        {
          "name": "Study the Lagrangian dual derivation line by line before touching code",
          "verdict": "ok",
          "reason": "The dual is where the kernel trick lives, so it rewards effort — but doing math for a week with no plots usually stalls intuition."
        },
        {
          "name": "Treat SVC as a black box inside a grid search",
          "verdict": "weak",
          "reason": "Without understanding C and gamma you will grid-search absurd ranges and conclude SVMs 'don't work' when the real issue was unscaled features."
        }
      ],
      "recommendation": "Write hinge-loss SGD in NumPy (15 lines), visualize SVC decision boundaries on make_moons while sweeping C and gamma, then apply an RBF SVM to a small high-dimensional dataset where it still beats trees. Always inside a Pipeline with StandardScaler."
    },
    "commonMistakes": [
      "Skipping feature scaling — the number one cause of 'SVM performs terribly' reports; always pipeline with StandardScaler",
      "Using kernel SVC on hundreds of thousands of rows and waiting hours — switch to LinearSVC/SGDClassifier at that scale",
      "Interpreting decision_function outputs as probabilities without calibration",
      "Grid-searching C and gamma on linear scales instead of log scales (C in 10^-2..10^3, gamma in 10^-4..10^1)"
    ],
    "seniorNotes": "SVMs have ceded the tabular throne to gradient boosting and the perception throne to deep nets, but seniors keep them in the toolbox for small-n/wide-p regimes (bioinformatics, some NLP baselines with TF-IDF) where max-margin regularization genuinely resists overfitting, and for interviews — the margin/dual/kernel story is a favorite test of mathematical maturity. The lasting conceptual export is the kernel trick itself (reappearing in Gaussian processes and attention-as-kernel-smoothing arguments) and hinge loss as the archetype of margin-based losses.",
    "interviewQuestions": [
      "What is the kernel trick and why does it not blow up computationally?",
      "What roles do C and gamma play in an RBF SVM, and how do they interact?",
      "Why are only some training points 'support vectors'?"
    ],
    "interviewAnswers": [
      "In the dual, data appears only through inner products x_i . x_j. A kernel replaces this with k(x_i, x_j), which equals the inner product after some feature map phi — possibly into infinite dimensions (RBF). You get the expressive power of that huge space while only ever computing the n-by-n kernel matrix, so cost scales with the number of examples, not the dimension of the implicit space.",
      "C prices margin violations: high C forces the boundary to fit training points tightly (low bias, high variance); low C tolerates misclassified points for a wider, smoother margin. Gamma sets the RBF radius of influence: high gamma makes each support vector affect only a tiny neighborhood (wiggly, memorizing boundary); low gamma smooths toward near-linear. They interact — a high-gamma model can be partially rescued by low C — so they must be tuned jointly on a log grid.",
      "The hinge loss is exactly zero for points beyond the margin on the correct side, so those points have zero dual coefficient and contribute nothing to the solution. Only points on the margin or violating it have nonzero alpha — these support vectors alone define the hyperplane. Delete every other training point and retraining gives the identical model; that sparsity is also why prediction cost scales with the number of support vectors."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Linear SVM from scratch (hinge loss + SGD), then sklearn RBF comparison",
        "code": "import numpy as np\nfrom sklearn.datasets import make_moons\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\n\nX, y = make_moons(n_samples=500, noise=0.25, random_state=7)\ny_pm = np.where(y == 1, 1, -1)              # SVM wants {-1,+1}\nX_tr, X_te, ytr, yte = train_test_split(X, y_pm, random_state=7)\n\n# --- linear SVM: minimize ||w||^2/2 + C * hinge, via SGD ---\nw, b, C, lr = np.zeros(2), 0.0, 1.0, 0.01\nfor epoch in range(200):\n    for i in np.random.permutation(len(X_tr)):\n        margin = ytr[i] * (X_tr[i] @ w + b)\n        if margin < 1:                       # inside margin: hinge active\n            w -= lr * (w - C * ytr[i] * X_tr[i])\n            b += lr * C * ytr[i]\n        else:                                # outside: only regularizer\n            w -= lr * w\nlin_acc = (np.sign(X_te @ w + b) == yte).mean()\nprint('scratch linear SVM acc:', round(lin_acc, 3))\n\n# --- RBF kernel SVM handles the curved boundary ---\nrbf = make_pipeline(StandardScaler(), SVC(kernel='rbf', C=1.0, gamma='scale'))\nrbf.fit(X_tr, ytr)\nprint('RBF SVM acc           :', round(rbf.score(X_te, yte), 3))\nprint('support vectors       :', rbf.named_steps['svc'].n_support_)"
      }
    ],
    "resources": [
      { "label": "StatQuest — Support Vector Machines series", "url": "https://www.youtube.com/@statquest", "kind": "video" },
      { "label": "An Introduction to Statistical Learning (Ch. 9: SVMs)", "url": "https://www.statlearning.com/", "kind": "book" },
      { "label": "scikit-learn User Guide — Support Vector Machines", "url": "https://scikit-learn.org/stable/user_guide.html", "kind": "docs" }
    ]
  },
  {
    "id": "kmeans-clustering",
    "phase": 5,
    "phaseName": "Ensembles & Unsupervised Learning",
    "orderIndex": 4,
    "estimatedMins": 40,
    "prerequisites": ["matrix-operations"],
    "title": "K-Means Clustering",
    "eli5": "Imagine dropping k magnets onto a table covered in iron filings. Each filing sticks to its nearest magnet, then you slide each magnet to the middle of its own pile, and the filings re-sort. Repeat until the magnets stop moving. The piles are your clusters.",
    "analogy": "K-means is like deciding where to build k pizza depots in a city. Assign every house to its nearest depot, then move each depot to the center of the houses it serves, and repeat. The catch: you must choose the number of depots before seeing the demand, and if the city has ring-shaped or snake-shaped neighborhoods, 'nearest depot by straight-line distance' carves them up nonsensically.",
    "explanation": "K-means partitions n points into k clusters by minimizing inertia — the sum of squared distances from each point to its cluster centroid. Lloyd's algorithm alternates two steps: (1) assign every point to the nearest centroid, (2) recompute each centroid as the mean of its assigned points. Both steps can only lower inertia, so it always converges — but only to a local optimum, which is why sklearn runs n_init restarts and keeps the best. Choosing k is external to the algorithm: the elbow method plots inertia vs k and looks for the bend; silhouette score measures how much closer points are to their own cluster than the next one.",
    "technicalDeep": "K-means is equivalent to fitting a Gaussian mixture with equal spherical covariances and hard assignments — this is exactly why it fails on elongated, unequal-variance, or non-convex clusters: the model class assumes round, similar-size blobs. Each iteration costs O(n*k*d); k-means++ initialization (sample initial centroids proportional to squared distance from existing ones) gives an O(log k) approximation guarantee in expectation and is the default everywhere. Inertia decreases monotonically in k, so 'elbow' is a heuristic, not a statistic — silhouette (mean over points of (b - a) / max(a, b), where a is intra-cluster and b is nearest-other-cluster mean distance) is more principled. MiniBatchKMeans trades a small quality loss for order-of-magnitude speed on millions of rows. Because the objective uses Euclidean distance, feature scaling is mandatory, and the mean-centroid step is what breaks for categorical data (use k-modes) or general metrics (use k-medoids).",
    "whatBreaks": "K-means confidently returns garbage on non-convex shapes: two concentric rings get split by a diameter, not by ring. Unequal cluster sizes and densities make it steal points from big clusters to pad small ones. One unscaled feature in large units hijacks the entire distance metric. Outliers drag centroids since the mean is not robust. And k-means always returns exactly k clusters, even on pure noise — it never says 'there is no structure here', so validation (silhouette, stability across seeds/subsamples) is on you.",
    "efficientWay": {
      "title": "Learning K-Means Honestly",
      "approaches": [
        {
          "name": "Implement Lloyd's loop in NumPy, watch it fail on make_moons, then sklearn KMeans with k-means++ and silhouette on a real dataset",
          "verdict": "best",
          "reason": "The scratch version is ~15 lines and makes the local-optimum problem tangible. Seeing it butcher moons/circles teaches its assumptions better than any lecture."
        },
        {
          "name": "Run sklearn KMeans and pick k from a single elbow plot",
          "verdict": "ok",
          "reason": "The standard workflow, but elbows are frequently ambiguous — pairing with silhouette and multiple seeds is the difference between analysis and numerology."
        },
        {
          "name": "Accept whatever clusters appear with default k and present them to stakeholders",
          "verdict": "weak",
          "reason": "K-means clusters anything, including noise. Unvalidated clusters presented as 'customer segments' is how ML teams lose credibility."
        }
      ],
      "recommendation": "Write the two-step loop yourself, break it on make_moons, then do the real workflow: scale features, run KMeans with several k values, compare elbow + silhouette, and check cluster stability across random seeds before believing any segmentation."
    },
    "commonMistakes": [
      "Clustering unscaled features, letting the largest-unit column define all distances",
      "Reading the elbow plot as ground truth — inertia always decreases with k; corroborate with silhouette score",
      "Applying k-means to non-globular data (rings, moons, varying densities) where DBSCAN or spectral clustering is the right tool",
      "Running a single initialization — always use n_init >= 10 (or 'auto') and k-means++ to dodge bad local optima"
    ],
    "seniorNotes": "In industry, k-means is less often 'the answer' and more often infrastructure: vector-database IVF indexes cluster embeddings with k-means to accelerate similarity search, color quantization compresses images, and it provides quick unsupervised features for downstream models. Seniors treat any clustering deliverable with suspicion until they see stability checks — rerun with different seeds and subsamples; if the segments reshuffle, they are artifacts. Also remember the objective is spherical-Euclidean: on text/embedding data, normalize vectors first so Euclidean approximates cosine distance.",
    "interviewQuestions": [
      "Why does k-means always converge, and why is the result still not guaranteed optimal?",
      "How do you choose k?",
      "Describe a dataset where k-means fails badly and what you would use instead."
    ],
    "interviewAnswers": [
      "Both steps monotonically decrease the inertia objective: reassignment moves each point to a nearer centroid, and the mean minimizes summed squared distance for a fixed assignment. Since inertia is bounded below and there are finitely many partitions, the loop must terminate. But it is coordinate descent on a non-convex objective, so it halts at a local optimum determined by initialization — hence k-means++ and multiple restarts.",
      "There is no oracle. Practical answer: sweep k, plot inertia (elbow) as a first filter, then use silhouette score to compare candidates, and check that clusters are stable across seeds and bootstrap subsamples. Above all, apply domain constraints — if marketing can act on at most five segments, k=5 with slightly worse silhouette beats k=11. If k itself is unknown and clusters are irregular, that is a signal to consider DBSCAN or hierarchical methods instead.",
      "Two concentric circles (or half-moon shapes): the clusters are non-convex, but k-means can only produce convex Voronoi cells around centroids, so it slices the rings by a diameter. DBSCAN handles it by growing clusters through density-connected neighborhoods, and spectral clustering handles it by clustering in the eigenspace of a similarity graph. The general lesson: k-means assumes round, similar-sized, similar-density blobs in a scaled Euclidean space."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "K-means from scratch vs sklearn, plus elbow and silhouette",
        "code": "import numpy as np\nfrom sklearn.datasets import make_blobs\nfrom sklearn.cluster import KMeans\nfrom sklearn.metrics import silhouette_score\nfrom sklearn.preprocessing import StandardScaler\n\nX, _ = make_blobs(n_samples=600, centers=4, cluster_std=1.2, random_state=3)\nX = StandardScaler().fit_transform(X)\n\n# --- Lloyd's algorithm by hand ---\nrng = np.random.default_rng(0)\nk = 4\ncentroids = X[rng.choice(len(X), k, replace=False)]\nfor _ in range(100):\n    d = ((X[:, None, :] - centroids[None, :, :]) ** 2).sum(axis=2)\n    labels = d.argmin(axis=1)                      # assign step\n    new_c = np.array([X[labels == j].mean(axis=0) for j in range(k)])\n    if np.allclose(new_c, centroids):\n        break\n    centroids = new_c                              # update step\nprint('scratch inertia:', round(((X - centroids[labels]) ** 2).sum(), 2))\n\n# --- choosing k: elbow + silhouette ---\nfor kk in range(2, 8):\n    km = KMeans(n_clusters=kk, n_init='auto', random_state=0).fit(X)\n    sil = silhouette_score(X, km.labels_)\n    print('k=%d  inertia=%8.1f  silhouette=%.3f' % (kk, km.inertia_, sil))\n# inertia always falls; silhouette should PEAK near the true k=4"
      }
    ],
    "resources": [
      { "label": "StatQuest — K-means clustering", "url": "https://www.youtube.com/@statquest", "kind": "video" },
      { "label": "scikit-learn User Guide — Clustering", "url": "https://scikit-learn.org/stable/user_guide.html", "kind": "docs" },
      { "label": "An Introduction to Statistical Learning (Ch. 12: Unsupervised Learning)", "url": "https://www.statlearning.com/", "kind": "book" },
      { "label": "Kaggle Learn — hands-on clustering practice", "url": "https://www.kaggle.com/learn", "kind": "practice" }
    ]
  },
  {
    "id": "hierarchical-dbscan",
    "phase": 5,
    "phaseName": "Ensembles & Unsupervised Learning",
    "orderIndex": 5,
    "estimatedMins": 45,
    "prerequisites": ["kmeans-clustering"],
    "title": "Hierarchical Clustering & DBSCAN",
    "eli5": "Hierarchical clustering is like building a family tree for data: every point starts alone, then the two closest 'relatives' merge, then the next closest, until everything is one big family — and you can cut the tree at any height to get however many families you want. DBSCAN is different: it walks through crowded areas and calls each connected crowd a cluster, and anyone standing alone in an empty field is labeled an outlier.",
    "analogy": "DBSCAN is how you would spot cities from a night flight: dense patches of light are cities (clusters), dim connected roads of light join suburbs to the city, and isolated single lights in the countryside are just noise. You never told it how many cities to find — density did that. A dendrogram, meanwhile, is like a corporate org chart drawn by merger history: cut near the top for 2 mega-divisions, lower for 12 teams.",
    "explanation": "Agglomerative hierarchical clustering starts with every point as its own cluster and repeatedly merges the two closest clusters, producing a dendrogram — a merge tree whose vertical axis is merge distance. 'Closest' depends on linkage: single (min pairwise distance, chains through data), complete (max), average, or Ward (minimizes within-cluster variance growth, most k-means-like). You choose the number of clusters after the fact by cutting the tree. DBSCAN instead defines clusters by density: a core point has at least min_samples neighbors within radius eps; clusters grow by connecting core points within eps of each other; border points tag along; everything unreachable is noise (-1). No k required, arbitrary shapes found, outliers labeled for free.",
    "technicalDeep": "Agglomerative clustering costs O(n^2) memory for the distance matrix and O(n^2 log n) time typically — fine to ~50k points, painful beyond. Single linkage suffers chaining (a thin bridge of points welds two real clusters); Ward is the robust default but implicitly assumes Euclidean, blob-like clusters. The dendrogram's cophenetic distances let you inspect cluster structure at every granularity — something flat methods cannot offer. DBSCAN runs in O(n log n) with a spatial index; its results are exquisitely sensitive to eps: the standard tuning method is the k-distance plot (sort each point's distance to its k-th nearest neighbor, look for the knee, set eps there, with k = min_samples, often 2*dim). DBSCAN's core weakness is varying density — one eps cannot fit both a tight cluster and a diffuse one; HDBSCAN fixes this by effectively sweeping eps and extracting the most stable clusters across scales, and is what practitioners usually reach for today (e.g., clustering UMAP-reduced text embeddings in topic-modeling pipelines like BERTopic).",
    "whatBreaks": "DBSCAN with slightly-too-large eps merges everything into one mega-cluster; slightly-too-small eps declares most of the dataset noise — always tune via the k-distance plot, never guess. In high dimensions (much beyond ~15-20 raw features), distances concentrate and 'density' loses meaning: everything becomes equidistant, so both algorithms degrade — reduce dimensions first. Single-linkage dendrograms chain across noise bridges, welding distinct clusters. Hierarchical clustering on a million points exhausts memory (the n^2 distance matrix alone is terabytes). And clusters DBSCAN labels as noise are not necessarily errors or anomalies — sparse-but-real segments get discarded if min_samples is too high.",
    "efficientWay": {
      "title": "Density and Hierarchy Workflow",
      "approaches": [
        {
          "name": "Implement a naive DBSCAN region-growing loop on toy data, then scipy dendrograms + sklearn DBSCAN with a k-distance plot, then HDBSCAN on real embeddings",
          "verdict": "best",
          "reason": "Writing the neighbor-expansion queue makes core/border/noise concrete; the k-distance plot ritual makes eps tuning principled; HDBSCAN on embeddings is the modern production pattern."
        },
        {
          "name": "Use sklearn defaults (eps=0.5) and adjust eps by trial and error",
          "verdict": "ok",
          "reason": "You will converge eventually on 2D data, but on real feature spaces blind eps twiddling wastes hours the k-distance plot solves in minutes."
        },
        {
          "name": "Run every clustering algorithm and keep whichever 'looks best'",
          "verdict": "weak",
          "reason": "Without matching algorithm assumptions to data shape and validating stability, this is p-hacking for clusters."
        }
      ],
      "recommendation": "Start on make_moons where k-means fails: scratch-DBSCAN it, draw the scipy dendrogram with Ward vs single linkage to see chaining, then tune eps via the k-distance knee. For real high-dimensional work, reduce with PCA/UMAP first and prefer HDBSCAN."
    },
    "commonMistakes": [
      "Guessing eps instead of reading it off the k-distance plot knee",
      "Running density clustering on raw high-dimensional data where distance concentration makes density meaningless — reduce dimensions first",
      "Treating DBSCAN's -1 label as a cluster in downstream group-bys and reports, when it means 'noise / unassigned'",
      "Using single linkage by default and getting one long chained cluster — Ward or average linkage are safer defaults"
    ],
    "seniorNotes": "The senior-level decision is matching assumptions to data: k-means for round blobs at scale, DBSCAN/HDBSCAN for arbitrary shapes plus built-in outlier labeling, hierarchical when the taxonomy itself (the dendrogram) is the deliverable — e.g., customer hierarchies or gene-expression heatmaps. In modern NLP pipelines, HDBSCAN-on-UMAP-reduced-embeddings is the de facto topic discovery stack. Remember DBSCAN is non-parametric with no predict() for new points in sklearn — production scoring needs approximate assignment (nearest core point) or a classifier trained on the cluster labels. Standardize features before any distance-based method; that instinct should be automatic by now.",
    "interviewQuestions": [
      "What advantages does DBSCAN have over k-means, and what is its main weakness?",
      "How do you choose eps for DBSCAN in a principled way?",
      "Explain linkage criteria in hierarchical clustering and when the choice matters."
    ],
    "interviewAnswers": [
      "DBSCAN needs no preset k, discovers arbitrarily-shaped clusters (rings, moons, snakes) since clusters are density-connected regions rather than Voronoi cells, and labels outliers natively. Weaknesses: a single global eps cannot handle clusters of different densities — either the sparse cluster dissolves into noise or the dense ones merge — and it degrades in high dimensions where density is ill-defined. HDBSCAN addresses the varying-density problem by extracting stable clusters across all density levels.",
      "Fix min_samples first (rule of thumb: about 2 times the dimensionality, minimum 4-5). Then compute each point's distance to its min_samples-th nearest neighbor, sort those distances, and plot them. The curve stays flat through dense regions and turns sharply upward where noise begins — set eps at that knee. This grounds eps in the data's actual density structure rather than trial and error, though you should still sanity-check the resulting cluster count and noise fraction.",
      "Linkage defines the distance between clusters: single uses the minimum pairwise distance (finds elongated shapes but chains through noise bridges), complete uses the maximum (compact clusters, sensitive to outliers), average balances the two, and Ward merges the pair minimizing within-cluster variance increase (round, even-sized clusters — closest to k-means, and the usual default). The choice matters exactly when cluster geometry is non-spherical or noise is present: on clean blobs all linkages roughly agree; on messy real data single linkage may return one giant chain while Ward returns sensible groups."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Moons: k-means fails, DBSCAN succeeds; dendrogram + k-distance eps tuning",
        "code": "import numpy as np\nfrom sklearn.datasets import make_moons\nfrom sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering\nfrom sklearn.neighbors import NearestNeighbors\nfrom scipy.cluster.hierarchy import linkage, fcluster\n\nX, y_true = make_moons(n_samples=400, noise=0.06, random_state=1)\n\nkm = KMeans(n_clusters=2, n_init='auto', random_state=0).fit(X)\nprint('k-means matches true moons:',\n      round(max((km.labels_ == y_true).mean(),\n                (km.labels_ != y_true).mean()), 3))  # ~0.75-0.85: fails\n\n# --- principled eps: k-distance knee ---\nmin_samples = 5\nnn = NearestNeighbors(n_neighbors=min_samples).fit(X)\ndists, _ = nn.kneighbors(X)\nkth = np.sort(dists[:, -1])\nprint('k-dist 90th pct (knee region):', round(np.quantile(kth, 0.90), 3))\n\ndb = DBSCAN(eps=0.15, min_samples=min_samples).fit(X)\nn_clusters = len(set(db.labels_)) - (1 if -1 in db.labels_ else 0)\nprint('DBSCAN clusters:', n_clusters, ' noise pts:', (db.labels_ == -1).sum())\n\n# --- hierarchical: cut the Ward dendrogram at 2 clusters ---\nZ = linkage(X, method='ward')\nhier_labels = fcluster(Z, t=2, criterion='maxclust')\nprint('agglomerative cluster sizes:', np.bincount(hier_labels)[1:])"
      }
    ],
    "resources": [
      { "label": "StatQuest — Hierarchical clustering & DBSCAN videos", "url": "https://www.youtube.com/@statquest", "kind": "video" },
      { "label": "scikit-learn User Guide — Clustering (DBSCAN, Agglomerative)", "url": "https://scikit-learn.org/stable/user_guide.html", "kind": "docs" },
      { "label": "An Introduction to Statistical Learning (Ch. 12)", "url": "https://www.statlearning.com/", "kind": "book" }
    ]
  },
  {
    "id": "pca-practice",
    "phase": 5,
    "phaseName": "Ensembles & Unsupervised Learning",
    "orderIndex": 6,
    "estimatedMins": 45,
    "prerequisites": ["matrix-operations", "jacobian-hessian-chain-rule"],
    "title": "PCA in Practice",
    "eli5": "Imagine photographing a 3D sculpture to print in a 2D catalog. You walk around it looking for the angle that shows the most detail — the angle where the sculpture's shape 'spreads out' the most. PCA finds that best camera angle for data with hundreds of dimensions, so you can look at it in 2D and lose as little as possible.",
    "analogy": "PCA is like summarizing a 50-question personality survey. Many questions secretly measure the same trait ('do you like parties?' and 'do you talk to strangers?' both measure extraversion). PCA discovers those underlying trait axes, orders them by how much of people's variation they explain, and lets you keep the 5 traits that capture 95% of the differences instead of storing all 50 correlated answers.",
    "explanation": "PCA finds new orthogonal axes (principal components) — linear combinations of the original features — ordered by the variance of the data along them. Component 1 is the direction of maximum variance; each next component is the max-variance direction orthogonal to all previous ones. Projecting onto the top k components gives the best possible k-dimensional linear compression in the least-squares sense. In practice you use it for three things: killing multicollinearity and dimensionality before a model, 2D visualization of high-dimensional data, and denoising (small-variance directions are often noise). The explained variance ratio tells you what fraction of total variance each component keeps — the scree plot or a cumulative threshold (90-95%) guides how many to retain.",
    "technicalDeep": "Center the data (and almost always standardize — PCA on covariances lets large-unit features dominate; PCA on correlations treats features equally). The principal components are the eigenvectors of the covariance matrix (1/n) X^T X, with eigenvalues equal to the variance along each; equivalently and more numerically stable, take the SVD X = U S V^T, where rows of V^T are the components and explained variance is S^2/(n-1). The Eckart-Young theorem makes rank-k PCA the optimal rank-k approximation in Frobenius norm. Costs: full SVD is O(min(n^2 d, n d^2)); randomized SVD (sklearn's default for large problems) gets top-k components dramatically faster. Caveats that matter: components are unique only up to sign; PCA is linear (a spiral manifold defeats it — that is what t-SNE/UMAP or kernel PCA are for); and maximizing variance is not maximizing class separability — the top component can be exactly the wrong axis for classification (LDA is the supervised counterpart).",
    "whatBreaks": "Fitting PCA on the full dataset before the train/test split leaks test-set statistics into training — PCA must live inside the Pipeline and be fit on training folds only. Skipping standardization lets one feature measured in large units become 'component 1' by sheer scale. Interpreting components as clean real-world concepts is often wishful thinking — each is a soup of all original features, and sign flips across runs break naive dashboards. Keeping components by an arbitrary 95% variance rule can discard the low-variance direction that actually separates your classes. And applying vanilla PCA to visualize nonlinear manifolds produces smeared, overlapping blobs that hide real structure.",
    "efficientWay": {
      "title": "PCA Workflow That Holds Up",
      "approaches": [
        {
          "name": "Compute PCA from scratch via covariance eigendecomposition and SVD, verify against sklearn, then use it in a Pipeline on a real wide dataset",
          "verdict": "best",
          "reason": "Ten lines of NumPy connect the linear algebra you learned to the tool you will use; matching sklearn's output (up to sign) proves you understand it; the Pipeline habit prevents leakage forever."
        },
        {
          "name": "Use sklearn PCA(n_components=0.95) and move on",
          "verdict": "ok",
          "reason": "A sane default for compression, but blind variance thresholds can throw away discriminative low-variance directions — check downstream metrics, not just variance kept."
        },
        {
          "name": "Use PCA on every problem as a mandatory preprocessing step",
          "verdict": "weak",
          "reason": "Tree ensembles neither need nor benefit from PCA in most cases, and you sacrifice feature interpretability for nothing."
        }
      ],
      "recommendation": "Derive it once in NumPy (center, SVD, project; compare with sklearn), then adopt the production pattern: StandardScaler + PCA inside a Pipeline, choose n_components from the scree plot AND downstream cross-validated score, and reserve t-SNE/UMAP for pure visualization of nonlinear structure."
    },
    "commonMistakes": [
      "Fitting PCA before the train/test split or outside the Pipeline — a textbook data leak",
      "Not standardizing first, so the largest-unit feature masquerades as the dominant component",
      "Choosing components purely by cumulative explained variance when the goal is classification — variance is not separability",
      "Over-interpreting components as real-world factors and forgetting their signs are arbitrary run to run"
    ],
    "seniorNotes": "In production, PCA earns its keep in three places: as a decorrelating compressor in front of linear models and k-means, as a cheap first-pass reduction (e.g., 768-dim embeddings to 50 dims) before UMAP/HDBSCAN in modern embedding pipelines, and as whitening for anomaly detection via reconstruction error. Seniors know its boundaries: it is unsupervised (use LDA when labels should guide the projection), linear (use UMAP/kernel PCA for manifolds), and interpretability-destroying (regulated domains often forbid it on model inputs). Incremental PCA handles datasets that do not fit in memory. For visualization slides, always print the explained variance of the two plotted axes — a 2D plot capturing 18% of variance is a sketch, not a summary.",
    "interviewQuestions": [
      "What is PCA actually optimizing, and what is the connection to eigenvectors/SVD?",
      "When would PCA hurt rather than help a supervised model?",
      "How do you decide how many components to keep?"
    ],
    "interviewAnswers": [
      "Two equivalent objectives: find orthogonal directions maximizing projected variance, or find the rank-k linear projection minimizing squared reconstruction error — they are the same solution. The optimum is the top eigenvectors of the covariance matrix (variance along each equals its eigenvalue), computed in practice via SVD of the centered data matrix for numerical stability: X = U S V^T, components are rows of V^T, explained variance is S squared over n-1.",
      "PCA maximizes variance, which is label-blind: if classes are separated along a low-variance direction, truncating components deletes precisely the signal. It also destroys sparsity and interpretability, and for tree ensembles it usually removes the axis-aligned structure trees exploit while adding no accuracy. Concrete red flags: features already few and meaningful, a downstream model that regularizes fine on its own, or a compliance requirement to explain inputs. The fix when labels exist and separation is the goal is LDA or just letting the supervised model do its own feature selection.",
      "Triangulate three signals: the scree plot's elbow (where eigenvalues flatten into a noise floor), a cumulative explained-variance threshold like 90-95% for compression use cases, and — decisive when a downstream model exists — cross-validated performance as a function of n_components, treating it as a hyperparameter. For visualization the answer is simply 2 or 3, but report how much variance those axes actually carry so nobody over-reads the picture."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "PCA from scratch (SVD) verified against sklearn, plus scree plot data",
        "code": "import numpy as np\nfrom sklearn.datasets import load_wine\nfrom sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\n\nX, y = load_wine(return_X_y=True)\nXs = StandardScaler().fit_transform(X)\n\n# --- scratch PCA via SVD ---\nXc = Xs - Xs.mean(axis=0)\nU, S, Vt = np.linalg.svd(Xc, full_matrices=False)\nexpl_var = S ** 2 / (len(Xc) - 1)\nratio = expl_var / expl_var.sum()\nZ_scratch = Xc @ Vt[:2].T                 # project onto top-2 components\n\npca = PCA(n_components=2).fit(Xs)\nprint('scratch var ratio:', np.round(ratio[:2], 3))\nprint('sklearn var ratio:', np.round(pca.explained_variance_ratio_, 3))\n# projections match up to per-component sign flips:\nprint('projections match:',\n      np.allclose(np.abs(Z_scratch), np.abs(pca.transform(Xs)), atol=1e-8))\n\n# --- choose n_components by downstream CV, not variance alone ---\nfor k in (2, 5, 8, 13):\n    pipe = make_pipeline(StandardScaler(), PCA(n_components=k),\n                         LogisticRegression(max_iter=2000))\n    acc = cross_val_score(pipe, X, y, cv=5).mean()\n    kept = ratio[:k].sum()\n    print('k=%2d  var kept=%.2f  CV acc=%.3f' % (k, kept, acc))"
      }
    ],
    "resources": [
      { "label": "StatQuest — PCA step-by-step", "url": "https://www.youtube.com/@statquest", "kind": "video" },
      { "label": "An Introduction to Statistical Learning (Ch. 12: PCA)", "url": "https://www.statlearning.com/", "kind": "book" },
      { "label": "scikit-learn User Guide — Decomposition (PCA)", "url": "https://scikit-learn.org/stable/user_guide.html", "kind": "docs" }
    ]
  },
  {
    "id": "anomaly-detection",
    "phase": 5,
    "phaseName": "Ensembles & Unsupervised Learning",
    "orderIndex": 7,
    "estimatedMins": 45,
    "prerequisites": ["random-forests", "pca-practice"],
    "title": "Anomaly Detection",
    "eli5": "Imagine a game of 20 questions to find a hidden person in a crowd. A normal person standing in the middle of the crowd takes many questions to pin down. A weirdo standing alone on a hill can be isolated in two or three questions. Isolation forests flag the people who are 'too easy to find' — those are your anomalies.",
    "analogy": "A credit-card fraud system works like a seasoned bartender who knows the regulars. When a regular orders their usual, no reaction. When someone orders 14 drinks at 6am, pays from three different wallets, and claims to be in two cities at once, the bartender does not need a definition of 'fraud' to raise an eyebrow — the behavior is simply far from everything normal they have ever seen. Anomaly detection formalizes that eyebrow.",
    "explanation": "Anomaly detection finds points that deviate substantially from the mass of the data — usually without labeled examples of 'anomalous', because anomalies are rare, expensive to label, and adversaries keep inventing new ones. The simplest tool is the z-score: how many standard deviations a value sits from the mean (|z| > 3 is the classic flag), with the median/MAD robust variant when outliers themselves poison the mean. Isolation Forest scales this idea to many dimensions: build random trees that split on random features at random thresholds; anomalies get isolated in few splits (short paths), normal points take many. The average path length converts to a score in a bounded scale. The contamination parameter — your prior on the fraction of anomalies — sets the alerting threshold.",
    "technicalDeep": "Isolation Forest scores are normalized as s = 2^(-E[h(x)]/c(n)) where E[h(x)] is a point's mean path depth over trees and c(n) is the average path length of an unsuccessful BST search — s near 1 means anomalous, near 0.5 means ordinary. It runs in O(n log n), needs no distance metric, and handles high dimensions far better than density methods; each tree trains on a small subsample (default 256), which counterintuitively improves detection by sharpening the contrast between common and rare regions. Alternatives to know: Local Outlier Factor (density ratio vs neighbors — catches anomalies inside locally sparse regions that global methods miss), One-Class SVM (boundary around normal data, kernel-flexible but scaling-sensitive), and reconstruction-based methods (PCA or autoencoders — model normal data compactly; anomalies reconstruct poorly). Evaluation must use precision/recall/PR-AUC on whatever labeled incidents exist — accuracy is meaningless at 0.1% base rates, and the operating threshold is a business decision balancing analyst workload against miss cost.",
    "whatBreaks": "Plain z-scores break exactly when needed most: outliers inflate the mean and standard deviation, masking themselves — use median/MAD. Contamination set to 0.1 when true fraud is 0.001 floods analysts with 100x false positives and the alert queue gets ignored (alarm fatigue kills more fraud systems than model quality). Training the detector on data that already contains rampant fraud teaches it that fraud is normal. Concept drift is brutal in adversarial domains — fraudsters adapt to your detector, so a static model decays in months. And 'anomalous' is not 'bad': a flash sale, a celebrity endorsement, or a new marketing campaign all look like attacks to a naive detector.",
    "efficientWay": {
      "title": "From Z-Scores to Production Detectors",
      "approaches": [
        {
          "name": "Implement z-score and a mini isolation tree from scratch, then sklearn IsolationForest on synthetic data, then a real credit-card fraud dataset with PR-AUC evaluation",
          "verdict": "best",
          "reason": "The scratch isolation tree (random split, measure depth) is a revelation — the idea fits in 20 lines. The Kaggle credit-card dataset then forces you to confront 0.17% base rates and the precision/recall trade-off that defines the field."
        },
        {
          "name": "Apply IsolationForest with default contamination and report flagged rows",
          "verdict": "ok",
          "reason": "Reasonable exploration, but the default contamination is a guess about YOUR data's anomaly rate — untuned thresholds are the top source of useless alert volume."
        },
        {
          "name": "Threshold each feature independently at mean plus 3 sigma",
          "verdict": "weak",
          "reason": "Misses multivariate anomalies entirely — a transaction can be normal in every single feature yet impossible in combination (small amount, but 3am, new device, foreign IP)."
        }
      ],
      "recommendation": "Build the intuition ladder: robust z-scores on one feature, a hand-rolled isolation tree to feel path-length scoring, then IsolationForest on the Kaggle credit-card fraud dataset. Evaluate with PR curves against the labels, pick the threshold from analyst capacity, and compare against LOF to see what each method misses."
    },
    "commonMistakes": [
      "Using mean/std z-scores in data that contains the very outliers being hunted — switch to median and MAD",
      "Reporting accuracy or ROC-AUC alone on 0.1%-base-rate problems instead of precision/recall at the operating threshold",
      "Setting contamination arbitrarily instead of deriving it from historical incident rates or alert-handling capacity",
      "Deploying a detector without a drift/retraining plan in adversarial domains where attackers adapt to it"
    ],
    "seniorNotes": "Real fraud systems are layered: hard business rules (impossible travel, blocklists) catch the known-bad instantly, unsupervised detectors (isolation forest, autoencoder reconstruction) surface novel patterns, and a supervised model trained on confirmed past fraud does the precision work — with a human review queue as the final layer. The unsung engineering is feature velocity: aggregates like 'transactions in the last 10 minutes' and 'distance from last purchase' matter more than the algorithm choice. Track precision-at-analyst-capacity as the real KPI. Expect feedback loops: once you block a pattern, it vanishes from your training data — keep honeypot/holdout traffic to measure true recall. And always time-split evaluation; random splits leak future fraud rings into training.",
    "interviewQuestions": [
      "Why does an isolation forest isolate anomalies in fewer splits, and why is that a good anomaly score?",
      "You built a fraud detector with 99.9% accuracy. Why might it be useless?",
      "When do z-scores fail for outlier detection and what do you use instead?"
    ],
    "interviewAnswers": [
      "Random axis-aligned splits are more likely to fall in the empty space around an isolated point than inside a dense region, so a lone outlier gets its own partition within a few random cuts, while points deep in a dense cluster need many cuts to separate from neighbors. Average path depth across many random trees is therefore a monotone proxy for 'how alone is this point', normalized to a score via 2^(-E[h]/c(n)). It needs no distance metric or density estimate, which is why it stays cheap (O(n log n)) and robust in higher dimensions.",
      "With a 0.1% fraud rate, predicting 'never fraud' scores 99.9% accuracy while catching nothing — accuracy is dominated by the majority class. The honest metrics are precision and recall at the chosen alert threshold (and PR-AUC overall): of alerts raised, how many are fraud, and of fraud, how much is caught. The threshold itself is a business decision — analyst review capacity and the asymmetric cost of a missed fraud versus a false alarm — not a number the model picks for you.",
      "Three failure modes: (1) masking — outliers inflate the mean and std, lowering their own z-scores, fixed by robust statistics (median and MAD); (2) non-normal data — heavy-tailed or multimodal distributions make 'three sigma' meaningless, fixed by quantile-based thresholds or transforming first; (3) multivariate anomalies — points normal per-feature but bizarre in combination are invisible to per-feature z-scores, requiring joint methods such as Mahalanobis distance, isolation forest, or LOF."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Robust z-scores vs Isolation Forest on multivariate anomalies",
        "code": "import numpy as np\nfrom sklearn.ensemble import IsolationForest\nfrom sklearn.metrics import precision_score, recall_score\n\nrng = np.random.default_rng(42)\n# normal traffic: amount and hour are correlated (day = bigger purchases)\nn = 5000\nhour = rng.normal(14, 3, n)\namount = 30 + 4 * hour + rng.normal(0, 15, n)\nnormal = np.c_[amount, hour]\n# fraud: each feature individually plausible, combination is not (3am, big)\nfraud = np.c_[rng.normal(120, 10, 25), rng.normal(3, 0.5, 25)]\nX = np.vstack([normal, fraud])\ny = np.r_[np.zeros(n), np.ones(25)]\n\n# --- per-feature robust z-score misses combination anomalies ---\nmed = np.median(X, axis=0)\nmad = np.median(np.abs(X - med), axis=0) * 1.4826\nz = np.abs((X - med) / mad)\nz_flag = (z > 3.5).any(axis=1)\nprint('z-score  recall:', recall_score(y, z_flag).round(2),\n      'precision:', precision_score(y, z_flag, zero_division=0).round(2))\n\n# --- isolation forest sees the joint structure ---\niso = IsolationForest(n_estimators=300,\n                      contamination=25 / len(X),  # informed prior\n                      random_state=0).fit(X)\niso_flag = iso.predict(X) == -1\nprint('isoforest recall:', recall_score(y, iso_flag).round(2),\n      'precision:', precision_score(y, iso_flag).round(2))\nscores = -iso.score_samples(X)   # higher = more anomalous\nprint('top-5 most anomalous are fraud:', y[np.argsort(-scores)[:5]])"
      }
    ],
    "resources": [
      { "label": "StatQuest — anomaly/outlier detection concepts", "url": "https://www.youtube.com/@statquest", "kind": "video" },
      { "label": "scikit-learn User Guide — Novelty and outlier detection", "url": "https://scikit-learn.org/stable/user_guide.html", "kind": "docs" },
      { "label": "Kaggle Learn + credit-card fraud dataset practice", "url": "https://www.kaggle.com/learn", "kind": "practice" }
    ]
  }
]
