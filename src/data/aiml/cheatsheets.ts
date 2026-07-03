import type { Cheatsheet } from '@/types'

/** AI/ML quick-reference cheat sheets. */
export const AIML_CHEATSHEETS: Cheatsheet[] = [
  {
    id: 'numpy-pandas-reference',
    title: 'NumPy & Pandas Quick Reference',
    subtitle: 'The array and dataframe ops you use every day',
    icon: '🔢',
    sections: [
      {
        heading: 'NumPy — creating arrays',
        entries: [
          { label: 'From list', value: 'np.array([1, 2, 3], dtype=np.float64)', code: true },
          { label: 'Zeros / ones', value: 'np.zeros((3, 4)); np.ones((2, 2))', code: true },
          { label: 'Ranges', value: 'np.arange(0, 10, 2); np.linspace(0, 1, 50)', code: true },
          { label: 'Random', value: 'rng = np.random.default_rng(42); rng.normal(0, 1, size=(100, 3))', code: true },
          { label: 'Identity', value: 'np.eye(3)  # 3x3 identity matrix', code: true },
        ],
      },
      {
        heading: 'NumPy — shapes and math',
        entries: [
          { label: 'Reshape', value: 'a.reshape(3, -1)  # -1 infers the dimension', code: true },
          { label: 'Matrix multiply', value: 'A @ B  # or np.dot(A, B)', code: true },
          { label: 'Transpose', value: 'A.T', code: true },
          { label: 'Aggregate by axis', value: 'X.mean(axis=0)  # column means; axis=1 for rows', code: true },
          { label: 'Boolean mask', value: 'a[a > 0]  # filter elements', code: true },
          { label: 'Broadcasting', value: 'X - X.mean(axis=0)  # (n,d) minus (d,) centers each column', code: true },
          { label: 'Linear algebra', value: 'np.linalg.inv(A); np.linalg.eig(A); np.linalg.svd(X)', code: true },
        ],
      },
      {
        heading: 'Pandas — loading and inspecting',
        entries: [
          { label: 'Read CSV', value: 'df = pd.read_csv("data.csv", parse_dates=["date"])', code: true },
          { label: 'Peek', value: 'df.head(); df.info(); df.describe()', code: true },
          { label: 'Shape / dtypes', value: 'df.shape; df.dtypes', code: true },
          { label: 'Missing values', value: 'df.isna().sum()', code: true },
          { label: 'Unique counts', value: 'df["city"].value_counts()', code: true },
        ],
      },
      {
        heading: 'Pandas — selecting and filtering',
        entries: [
          { label: 'Columns', value: 'df[["age", "income"]]', code: true },
          { label: 'Rows by label / position', value: 'df.loc[10, "age"]; df.iloc[0:5, 0:3]', code: true },
          { label: 'Filter rows', value: 'df[(df.age > 30) & (df.city == "NYC")]', code: true },
          { label: 'Query syntax', value: 'df.query("age > 30 and city == \'NYC\'")', code: true },
        ],
      },
      {
        heading: 'Pandas — transforming',
        entries: [
          { label: 'New column', value: 'df["bmi"] = df.weight / df.height ** 2', code: true },
          { label: 'Group + aggregate', value: 'df.groupby("city")["income"].agg(["mean", "count"])', code: true },
          { label: 'Merge (SQL join)', value: 'pd.merge(orders, users, on="user_id", how="left")', code: true },
          { label: 'Pivot', value: 'df.pivot_table(values="sales", index="month", columns="region", aggfunc="sum")', code: true },
          { label: 'Handle missing', value: 'df.fillna({"income": df.income.median()}); df.dropna(subset=["age"])', code: true },
          { label: 'Apply function', value: 'df["name"].str.lower(); df["col"].map(lookup_dict)', code: true },
          { label: 'Sort', value: 'df.sort_values("income", ascending=False)', code: true },
        ],
      },
    ],
  },
  {
    id: 'statistics-formulas',
    title: 'Statistics Formulas & Intuitions',
    subtitle: 'The math one-liners behind every model',
    icon: '📊',
    sections: [
      {
        heading: 'Center and spread',
        entries: [
          { label: 'Mean', value: 'mean = (1/n) * sum(x_i) — the balance point of the data.' },
          { label: 'Median', value: 'Middle value when sorted — robust to outliers, unlike the mean.' },
          { label: 'Variance', value: 'var = (1/(n-1)) * sum((x_i - mean)^2) — average squared distance from the mean (n-1 = Bessel correction for samples).' },
          { label: 'Std deviation', value: 'sd = sqrt(var) — spread in the original units of the data.' },
          { label: 'Standard error', value: 'SE = sd / sqrt(n) — how much the sample mean itself wobbles across samples.' },
        ],
      },
      {
        heading: 'Relationships between variables',
        entries: [
          { label: 'Covariance', value: 'cov(X,Y) = (1/(n-1)) * sum((x_i - mx)(y_i - my)) — do X and Y move together? Sign matters, magnitude is scale-dependent.' },
          { label: 'Correlation', value: 'r = cov(X,Y) / (sd_X * sd_Y) — covariance normalized to [-1, 1]. Measures linear association only.' },
          { label: 'Key trap', value: 'Correlation is not causation, and r = 0 does not rule out nonlinear relationships.' },
        ],
      },
      {
        heading: 'Probability essentials',
        entries: [
          { label: 'Conditional probability', value: 'P(A|B) = P(A and B) / P(B) — probability of A once you know B happened.' },
          { label: 'Bayes theorem', value: 'P(H|D) = P(D|H) * P(H) / P(D) — posterior = likelihood x prior / evidence. Flips "prob of data given hypothesis" into "prob of hypothesis given data".' },
          { label: 'Independence', value: 'P(A and B) = P(A) * P(B) — knowing one tells you nothing about the other.' },
          { label: 'Expectation', value: 'E[X] = sum(x * P(x)) — the probability-weighted average outcome.' },
          { label: 'Linearity', value: 'E[aX + bY] = aE[X] + bE[Y] — always holds, even when X and Y are dependent.' },
        ],
      },
      {
        heading: 'Distributions to recognize',
        entries: [
          { label: 'Normal (Gaussian)', value: 'Bell curve set by mean and sd; 68/95/99.7 percent within 1/2/3 sd. Shows up everywhere thanks to the CLT.' },
          { label: 'Bernoulli / Binomial', value: 'One coin flip with prob p / count of successes in n flips. Mean np, variance np(1-p).' },
          { label: 'Poisson', value: 'Count of rare events per interval with rate lambda; mean = variance = lambda.' },
          { label: 'Uniform', value: 'All values in [a, b] equally likely — the "know nothing" distribution.' },
        ],
      },
      {
        heading: 'Big theorems, one line each',
        entries: [
          { label: 'Central Limit Theorem', value: 'Averages of n iid samples become Normal as n grows, no matter the original distribution — why confidence intervals work.' },
          { label: 'Law of Large Numbers', value: 'The sample mean converges to the true mean as n grows — why more data beats cleverness.' },
          { label: 'Maximum likelihood', value: 'Pick parameters that maximize P(data | params); in practice minimize negative log-likelihood — which is exactly what loss functions like MSE and cross-entropy do.' },
        ],
      },
      {
        heading: 'Hypothesis testing',
        entries: [
          { label: 'p-value', value: 'Probability of seeing data this extreme if the null hypothesis were true. NOT the probability the null is true.' },
          { label: 'Type I / Type II error', value: 'Type I = false positive (reject a true null, rate alpha). Type II = false negative (miss a real effect, rate beta). Power = 1 - beta.' },
          { label: 'Confidence interval', value: '95 percent CI ≈ estimate ± 1.96 * SE — the procedure captures the true value in 95 percent of repeated experiments.' },
        ],
      },
    ],
  },
  {
    id: 'sklearn-recipes',
    title: 'scikit-learn Recipes',
    subtitle: 'The fit/predict patterns for everyday modeling',
    icon: '🧪',
    sections: [
      {
        heading: 'The core pattern',
        entries: [
          { label: 'Split', value: 'X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)', code: true },
          { label: 'Fit', value: 'model = LogisticRegression(max_iter=1000).fit(X_train, y_train)', code: true },
          { label: 'Predict', value: 'y_pred = model.predict(X_test); y_proba = model.predict_proba(X_test)[:, 1]', code: true },
          { label: 'Score', value: 'model.score(X_test, y_test)  # accuracy (clf) or R^2 (reg)', code: true },
          { label: 'Golden rule', value: 'fit() only ever sees training data — fit_transform on train, transform on test.' },
        ],
      },
      {
        heading: 'Preprocessing',
        entries: [
          { label: 'Standardize', value: 'scaler = StandardScaler(); X_tr = scaler.fit_transform(X_train); X_te = scaler.transform(X_test)', code: true },
          { label: 'One-hot encode', value: 'OneHotEncoder(handle_unknown="ignore")', code: true },
          { label: 'Impute missing', value: 'SimpleImputer(strategy="median")', code: true },
          { label: 'Mixed columns', value: 'ColumnTransformer([("num", num_pipe, num_cols), ("cat", cat_pipe, cat_cols)])', code: true },
        ],
      },
      {
        heading: 'Pipelines (do this by default)',
        entries: [
          { label: 'Build', value: 'pipe = Pipeline([("scale", StandardScaler()), ("clf", LogisticRegression())])', code: true },
          { label: 'Use like a model', value: 'pipe.fit(X_train, y_train); pipe.predict(X_test)', code: true },
          { label: 'Why', value: 'A pipeline locks preprocessing inside cross-validation, preventing data leakage from test folds into fitted transformers.' },
        ],
      },
      {
        heading: 'Cross-validation and tuning',
        entries: [
          { label: 'CV score', value: 'cross_val_score(pipe, X, y, cv=5, scoring="roc_auc").mean()', code: true },
          { label: 'Grid search', value: 'GridSearchCV(pipe, {"clf__C": [0.01, 0.1, 1, 10]}, cv=5).fit(X_train, y_train)', code: true },
          { label: 'Random search', value: 'RandomizedSearchCV(pipe, param_dist, n_iter=50, cv=5)  # better when params are many', code: true },
          { label: 'Best result', value: 'search.best_params_; search.best_score_; search.best_estimator_', code: true },
        ],
      },
      {
        heading: 'Common estimators',
        entries: [
          { label: 'Linear regression', value: 'from sklearn.linear_model import LinearRegression, Ridge, Lasso', code: true },
          { label: 'Logistic regression', value: 'LogisticRegression(C=1.0)  # C = 1/lambda: smaller C = stronger regularization', code: true },
          { label: 'Random forest', value: 'RandomForestClassifier(n_estimators=300, max_depth=None, n_jobs=-1, random_state=42)', code: true },
          { label: 'Gradient boosting', value: 'HistGradientBoostingClassifier(learning_rate=0.1, early_stopping=True)', code: true },
          { label: 'SVM', value: 'SVC(kernel="rbf", C=1.0, gamma="scale")  # scale features first', code: true },
          { label: 'K-Means', value: 'KMeans(n_clusters=5, n_init="auto", random_state=42).fit(X_scaled)', code: true },
          { label: 'PCA', value: 'PCA(n_components=0.95)  # keep 95 percent of variance', code: true },
        ],
      },
      {
        heading: 'Persistence',
        entries: [
          { label: 'Save', value: 'import joblib; joblib.dump(pipe, "model.joblib")', code: true },
          { label: 'Load', value: 'pipe = joblib.load("model.joblib")', code: true },
        ],
      },
    ],
  },
  {
    id: 'model-evaluation-sheet',
    title: 'Model Evaluation Cheat Sheet',
    subtitle: 'Every metric, what it means, and when to reach for it',
    icon: '🎯',
    sections: [
      {
        heading: 'The confusion matrix',
        entries: [
          { label: 'TP / FP / TN / FN', value: 'TP = correctly flagged positive. FP = false alarm. TN = correctly ignored. FN = missed positive. Every classification metric is built from these four.' },
          { label: 'Compute it', value: 'confusion_matrix(y_test, y_pred)', code: true },
        ],
      },
      {
        heading: 'Classification metrics',
        entries: [
          { label: 'Accuracy', value: '(TP + TN) / all — fine for balanced classes; meaningless when 99 percent of labels are one class.' },
          { label: 'Precision', value: 'TP / (TP + FP) — trust in positive predictions. Optimize when false positives are costly (spam, moderation).' },
          { label: 'Recall (sensitivity)', value: 'TP / (TP + FN) — coverage of actual positives. Optimize when misses are costly (medical screening, fraud).' },
          { label: 'F1', value: '2PR / (P + R) — harmonic mean; punishes whichever of precision/recall is worse. Default single number for imbalanced data.' },
          { label: 'ROC-AUC', value: 'Threshold-free ranking quality; 0.5 = random, 1.0 = perfect. Compare models before choosing a threshold.' },
          { label: 'PR-AUC', value: 'Area under precision-recall curve — more honest than ROC-AUC when positives are rare.' },
          { label: 'Log loss', value: 'Penalizes confident wrong probabilities — use when calibrated probabilities matter (pricing risk, ranking).' },
        ],
      },
      {
        heading: 'Regression metrics',
        entries: [
          { label: 'MAE', value: 'mean(|y - yhat|) — average miss in original units; robust to outliers.' },
          { label: 'MSE / RMSE', value: 'mean squared error / its root — squaring punishes big misses hard; RMSE is back in original units.' },
          { label: 'R-squared', value: 'Fraction of variance explained vs predicting the mean; 1 is perfect, 0 matches the mean baseline, negative is worse than the mean.' },
          { label: 'MAPE', value: 'Mean absolute percentage error — intuitive for stakeholders, but explodes when true values are near zero.' },
          { label: 'Rule of thumb', value: 'Report MAE or RMSE with units, plus R-squared for context. Pick MAE when outliers should not dominate.' },
        ],
      },
      {
        heading: 'Validation strategy',
        entries: [
          { label: 'Hold-out split', value: 'Train / validation / test — tune on validation, touch test exactly once at the end.' },
          { label: 'K-fold CV', value: 'Average score across k rotating folds — lower-variance estimate; use k=5 or 10.' },
          { label: 'Stratified K-fold', value: 'Keeps class proportions in every fold — always use for imbalanced classification.' },
          { label: 'Time-series split', value: 'Train on past, validate on future — never shuffle temporal data or you leak the future.' },
          { label: 'Leakage check', value: 'If test performance looks too good, hunt for leakage: preprocessing fit on full data, duplicate rows across splits, or features derived from the target.' },
        ],
      },
      {
        heading: 'Choosing thresholds',
        entries: [
          { label: 'Default 0.5 is arbitrary', value: 'Sweep thresholds on the precision-recall curve and pick the point matching your cost of FP vs FN.' },
          { label: 'Cost-based pick', value: 'Choose the threshold minimizing expected cost: cost_fp * FP + cost_fn * FN on validation data.' },
          { label: 'Calibration', value: 'If probabilities feed decisions, check a calibration curve; fix with CalibratedClassifierCV (Platt/isotonic).' },
        ],
      },
    ],
  },
]
