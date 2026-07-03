import type { InterviewBank } from '@/types'

/** AI/ML In-Depth interview bank: roles + 3-round question set. */
export const AIML_INTERVIEW: InterviewBank = {
  roles: [
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      seniority: 'Junior → Senior',
      icon: '📊',
      description:
        'Turns business questions into analyses and models. Owns the path from raw data to insight: EDA, statistical testing, feature engineering, and building/validating models that inform decisions or ship as products.',
      focus: ['Statistics & hypothesis testing', 'EDA & feature engineering', 'Model building & validation', 'Experiment design (A/B tests)', 'Communicating findings'],
      demandNote: 'The broadest ML role — every data-driven company hires these, and statistics depth is the differentiator.',
    },
    {
      id: 'ml-engineer',
      title: 'ML Engineer',
      seniority: 'Mid → Senior',
      icon: '⚙️',
      description:
        'Takes models to production and keeps them healthy. Builds training pipelines, feature stores, serving infrastructure, and monitoring. Half software engineer, half ML practitioner — judged on systems that work, not notebooks.',
      focus: ['Training & serving pipelines', 'Feature stores & data engineering', 'Model deployment & versioning', 'Monitoring & drift detection', 'Software engineering rigor'],
      demandNote: 'Fastest-growing ML role — companies have models, they need people who can ship and operate them.',
    },
    {
      id: 'data-analyst',
      title: 'Data Analyst',
      seniority: 'Entry → Mid',
      icon: '📈',
      description:
        'Answers business questions with SQL, dashboards, and exploratory analysis. Owns metrics definitions, reporting, and the first pass of statistical rigor. The most common entry path into data science and ML.',
      focus: ['SQL & data wrangling', 'EDA & visualization', 'Dashboards & metrics', 'Basic statistics', 'Stakeholder communication'],
      demandNote: 'Highest-volume entry role into data careers — strong SQL plus statistical literacy gets you hired.',
    },
    {
      id: 'applied-scientist',
      title: 'Applied Scientist / Research Engineer',
      seniority: 'Senior → Staff',
      icon: '🧪',
      description:
        'Pushes the modeling frontier inside a product company. Reads papers, derives methods from first principles, and adapts state-of-the-art techniques to messy real-world constraints. Interviews go deep on math: probability, optimization, and derivations.',
      focus: ['Probability & linear algebra depth', 'Optimization & loss derivations', 'Model architecture design', 'Reading & implementing papers', 'Rigorous experimentation'],
      demandNote: 'Premium comp at FAANG and AI labs — expects graduate-level math fluency and derivations on a whiteboard.',
    },
  ],

  questions: [
    // ── Round 1: Phone Screen (fundamentals, breadth) ──────────────────────────
    {
      id: 'ml-s1',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'Explain the bias-variance tradeoff. How does it show up when you train a model?',
      modelAnswer:
        'Bias is error from a model being too simple to capture the true pattern — it underfits and does poorly on both training and test data. Variance is error from a model being too sensitive to the specific training sample — it overfits, doing great on training data but poorly on new data. Total generalization error decomposes into bias squared plus variance plus irreducible noise, and reducing one typically increases the other. In practice you see it as the gap between training and validation error: high bias means both are bad, high variance means training error is low but validation error is much higher. You manage the tradeoff with model complexity, regularization, and more data.',
      keyPoints: [
        'Bias = underfitting (too simple), variance = overfitting (too sensitive to the sample)',
        'Connects the decomposition to the train-vs-validation error gap',
        'Names concrete levers: complexity, regularization, more data',
      ],
      followUp: 'Which typically has higher variance: a decision tree or linear regression, and why?',
      topicId: 'bias-variance-tradeoff',
    },
    {
      id: 'ml-s2',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'What is the difference between precision and recall, and when would you optimize for each?',
      modelAnswer:
        'Precision is the fraction of your positive predictions that are actually positive — of everything I flagged, how much was right. Recall is the fraction of actual positives you caught — of everything real, how much did I find. They trade off via the decision threshold: lowering it catches more positives (higher recall) but adds false alarms (lower precision). Optimize recall when missing a positive is costly, like cancer screening or fraud; optimize precision when false alarms are costly, like spam filtering where flagging a real email is bad. F1 balances the two, but the right choice always comes from the business cost of each error type.',
      keyPoints: [
        'Precision = TP/(TP+FP), recall = TP/(TP+FN) — stated intuitively, not just as formulas',
        'Explains the threshold-driven tradeoff between them',
        'Maps each to a concrete use case via error costs',
      ],
      followUp: 'Why is accuracy misleading on a dataset with 1% positives?',
      topicId: 'model-evaluation',
    },
    {
      id: 'ml-s3',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'Why do we split data into train/validation/test sets? What is cross-validation and what is data leakage?',
      modelAnswer:
        'The train set fits the model, the validation set tunes hyperparameters and selects models, and the test set gives one final unbiased estimate of generalization — it must be touched only once. K-fold cross-validation rotates the validation role across k splits and averages the scores, giving a lower-variance estimate when data is limited. Data leakage is any way information from outside the training fold influences training: fitting a scaler on the full dataset before splitting, using features computed from the future, or duplicated rows spanning splits. Leakage inflates offline metrics and produces models that collapse in production, which is why every preprocessing step must be fit inside the training fold only.',
      keyPoints: [
        'Distinct purpose of each split; test set used exactly once',
        'K-fold CV as a lower-variance estimate for small data',
        'Concrete leakage examples: scaling before splitting, future features',
      ],
      redFlags: ['Describing leakage only as "test set contamination" without a preprocessing example'],
      topicId: 'train-test-cross-validation',
    },
    {
      id: 'ml-s4',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'Explain what a p-value actually is. What does p = 0.03 mean, and what does it NOT mean?',
      modelAnswer:
        'A p-value is the probability of observing data at least as extreme as what you saw, assuming the null hypothesis is true. So p = 0.03 means: if there were truly no effect, you would see a result this extreme only 3% of the time. It does NOT mean there is a 97% chance your hypothesis is true, and it does not measure effect size — a tiny, meaningless effect can be highly significant with enough data. A strong answer also mentions the multiple-comparisons problem: test 20 hypotheses at alpha 0.05 and you expect one false positive by chance, which is why analysts report effect sizes and confidence intervals alongside p-values.',
      keyPoints: [
        'Correct definition: probability of data this extreme GIVEN the null is true',
        'Explicitly rejects the "probability the hypothesis is true" misreading',
        'Separates statistical significance from practical effect size',
        'Bonus: multiple comparisons / p-hacking awareness',
      ],
      followUp: 'You ran an A/B test and got p = 0.06. The PM asks if we can just run it a few more days. What do you say?',
      topicId: 'hypothesis-testing',
    },
    {
      id: 'ml-s5',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'Why do we scale features before training? Which models need it and which do not?',
      modelAnswer:
        'Many algorithms compute distances or take gradient steps in feature space, so a feature ranging 0-1,000,000 dominates one ranging 0-1 for reasons of units, not importance. Scaling (standardization or min-max) puts features on comparable ranges so distance-based models like k-NN, k-means, and SVMs treat them fairly, and gradient descent converges faster because the loss surface is better conditioned. Regularized linear models also need it so the penalty hits coefficients evenly. Tree-based models like random forests and gradient boosting do not need scaling because splits depend only on the ordering of values, not their magnitude. Critically, the scaler must be fit on the training set only and applied to validation and test — fitting on all data is leakage.',
      keyPoints: [
        'Distance-based and gradient-based models need it; trees do not',
        'Explains WHY: dominance by magnitude, gradient conditioning, even regularization',
        'Fit the scaler on train only — leakage awareness',
      ],
      topicId: 'feature-engineering',
    },
    {
      id: 'ml-s6',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'What is the difference between linear regression and logistic regression?',
      modelAnswer:
        'Linear regression predicts a continuous value as a weighted sum of features, fit by minimizing squared error. Logistic regression predicts a probability of a binary class by passing that same weighted sum through a sigmoid, squashing it into (0, 1), and is fit by maximizing likelihood — equivalently minimizing log loss, not squared error. Despite the name, logistic regression is a classifier. Its coefficients are interpretable as log-odds changes: each unit increase in a feature multiplies the odds by e to the power of its coefficient. A strong answer notes you cannot just threshold linear regression for classification because its outputs are unbounded and squared error punishes confident correct predictions.',
      keyPoints: [
        'Continuous output vs probability via sigmoid',
        'Squared-error loss vs log loss / maximum likelihood',
        'Coefficient interpretation as log-odds',
      ],
      followUp: 'Why is log loss the right loss for logistic regression rather than mean squared error?',
      topicId: 'regression-statistics',
    },

    // ── Round 2: Technical Deep Dive (depth, problem-solving) ──────────────────
    {
      id: 'ml-t1',
      level: 'technical',
      difficulty: 'senior',
      category: 'concept',
      question: 'Explain maximum likelihood estimation and derive how it connects to common loss functions.',
      modelAnswer:
        'MLE picks the parameters that make the observed data most probable: maximize the product of the likelihoods of each data point, or equivalently the sum of log-likelihoods since log is monotonic and turns products into sums. The key insight is that standard loss functions ARE negative log-likelihoods under specific noise assumptions. Assume the targets are the model output plus Gaussian noise and maximizing likelihood becomes minimizing squared error — the exponent of the Gaussian gives you the squared term. Assume Bernoulli-distributed labels with the model outputting the probability, and maximizing likelihood becomes minimizing binary cross-entropy. So when you choose MSE or log loss you are implicitly choosing a noise model, and adding an L2 penalty corresponds to a Gaussian prior on the weights (MAP estimation).',
      keyPoints: [
        'Maximize likelihood → maximize log-likelihood → minimize negative log-likelihood',
        'Gaussian noise assumption yields MSE; Bernoulli yields cross-entropy',
        'Regularization as a prior (MAP) is the senior-level connection',
      ],
      followUp: 'What noise assumption would lead you to mean absolute error instead of MSE?',
      redFlags: ['Can state the definition but cannot connect it to any loss function'],
      topicId: 'maximum-likelihood',
    },
    {
      id: 'ml-t2',
      level: 'technical',
      difficulty: 'mid',
      category: 'debugging',
      question: 'You plot learning curves: training error is near zero but validation error is high and flat as data grows. Diagnose and fix it.',
      modelAnswer:
        'Near-zero training error with a large persistent gap to validation error is the signature of high variance — the model is memorizing the training set. Fixes in rough order of leverage: get more training data if the validation curve is still improving with data; add regularization (L2, dropout, early stopping); reduce model complexity (shallower trees, fewer features, smaller network); and use stronger data augmentation where applicable. Contrast this with high bias, where both curves converge to a high error — there, more data does nothing and you need a more expressive model or better features. A strong answer also checks for leakage or duplicated rows first, because a too-good training fit sometimes means the problem is the data, not the model.',
      keyPoints: [
        'Reads the gap correctly as overfitting / high variance',
        'Orders fixes: more data, regularization, less complexity',
        'Contrasts with the high-bias curve shape (both errors high and converged)',
        'Sanity-checks for leakage before reaching for regularization',
      ],
      followUp: 'What would the curves look like if the model had high bias instead?',
      topicId: 'bias-variance-tradeoff',
    },
    {
      id: 'ml-t3',
      level: 'technical',
      difficulty: 'mid',
      category: 'tradeoff',
      question: 'Your fraud dataset is 0.5% positive. Walk me through how you would handle the class imbalance.',
      modelAnswer:
        'First, fix the metric: accuracy is useless at 0.5% positives — a model predicting "never fraud" scores 99.5%. Use precision-recall curves, PR-AUC, or recall at a fixed precision tied to business cost. Second, adjust the learning signal: class weights or a weighted loss make each positive count more; resampling (undersample the majority, or oversample/SMOTE the minority) rebalances the training set — but only ever resample the training fold, never validation or test, or your metrics become fiction. Third, tune the decision threshold on validation data against the actual cost matrix rather than defaulting to 0.5. Finally, at extreme imbalance consider reframing as anomaly detection. The senior signal is knowing that class weights plus threshold tuning usually beats aggressive resampling.',
      keyPoints: [
        'Metric first: PR-AUC / recall at fixed precision, never accuracy',
        'Class weights vs resampling, and resampling the training fold only',
        'Threshold tuning against a business cost matrix',
      ],
      redFlags: ['Applying SMOTE before splitting, or evaluating on a resampled test set'],
      topicId: 'model-evaluation',
    },
    {
      id: 'ml-t4',
      level: 'technical',
      difficulty: 'senior',
      category: 'concept',
      question: 'Why does gradient boosting typically beat bagging (random forests) on tabular data? When would you prefer bagging?',
      modelAnswer:
        'Bagging trains deep trees independently on bootstrap samples and averages them — it reduces variance but each tree carries the same bias, so the ensemble cannot fix systematic errors. Boosting trains shallow trees sequentially, each one fit to the residual errors (the negative gradient of the loss) of the ensemble so far — it directly reduces bias, step by step, like gradient descent in function space. On tabular data with informative features and moderate noise, this targeted error-correction usually wins, which is why XGBoost and LightGBM dominate Kaggle and industry tabular problems. Prefer bagging when you want robustness with near-zero tuning, when labels are noisy (boosting will chase noise in residuals and overfit), or when you need embarrassingly parallel training. Boosting demands careful tuning of learning rate, tree depth, and early stopping.',
      keyPoints: [
        'Bagging reduces variance; boosting reduces bias via sequential residual fitting',
        'Frames boosting as gradient descent in function space',
        'Names when bagging wins: noisy labels, low tuning budget, parallelism',
      ],
      followUp: 'Why do boosted trees stay shallow while random forest trees grow deep?',
      topicId: 'gradient-boosting',
    },
    {
      id: 'ml-t5',
      level: 'technical',
      difficulty: 'mid',
      category: 'debugging',
      question: 'What assumptions does k-means make, and how does it fail when they are violated? How do you choose k?',
      modelAnswer:
        'K-means minimizes within-cluster squared Euclidean distance, which implicitly assumes clusters are spherical, similar in size and density, and separable in Euclidean space — and it requires k up front. It fails on elongated or crescent-shaped clusters (splits them or merges neighbors), on clusters of very different densities, and it drags centroids toward outliers because squared error is unbounded. Unscaled features also break it since distance is dominated by large-magnitude features. Choosing k: the elbow method plots within-cluster variance versus k and looks for the bend; silhouette score measures cohesion versus separation more rigorously; and often k is dictated by the business context, like a fixed number of customer segments. Alternatives when assumptions fail: DBSCAN for arbitrary shapes and noise, Gaussian mixtures for elliptical clusters and soft assignment.',
      keyPoints: [
        'Assumptions: spherical, similar-size clusters, Euclidean space, k known',
        'Concrete failure modes: non-convex shapes, outliers, unscaled features',
        'Elbow and silhouette for k, plus DBSCAN/GMM as alternatives',
      ],
      followUp: 'Why does k-means depend on initialization, and what does k-means++ change?',
      topicId: 'kmeans-clustering',
    },
    {
      id: 'ml-t6',
      level: 'technical',
      difficulty: 'senior',
      category: 'concept',
      question: 'Explain backpropagation. What causes vanishing gradients and how do modern architectures address it?',
      modelAnswer:
        'Backprop is the chain rule applied efficiently: a forward pass computes and caches each layer\'s activations, then a backward pass propagates the loss gradient layer by layer, multiplying local derivatives to get the gradient of the loss with respect to every weight, which the optimizer then steps against. Because gradients are products across layers, if each local derivative is below one the product shrinks exponentially with depth — early layers receive vanishing gradients and stop learning. Sigmoid and tanh are the classic culprits since their derivatives max out at 0.25 and 1 and saturate to zero. Modern fixes: ReLU-family activations keep the derivative at 1 in the active region; residual connections give gradients an additive skip path around layers; batch/layer normalization keeps activations out of saturation; and careful initialization (Xavier/He) keeps signal variance stable across depth. The mirror problem, exploding gradients, is handled with gradient clipping.',
      keyPoints: [
        'Chain rule with cached activations — forward then backward pass',
        'Vanishing = repeated multiplication of small derivatives across depth',
        'Names concrete fixes: ReLU, residual connections, normalization, initialization',
      ],
      followUp: 'Why do residual connections help gradients flow, mechanically?',
      redFlags: ['Hand-waves backprop as "the network learns from errors" with no chain-rule content'],
      topicId: 'backpropagation',
    },

    // ── Round 3: System Design / Senior (architecture, tradeoffs) ──────────────
    {
      id: 'ml-d1',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['data-scientist', 'ml-engineer', 'applied-scientist'],
      question: 'Design an end-to-end churn prediction system for a subscription product. Walk me through it.',
      modelAnswer:
        'Start with framing: define churn precisely (no renewal within 30 days of expiry), pick the prediction window (who churns in the next 30 days), and choose a metric tied to action — recall at a precision the retention team can act on. Build the training set with point-in-time correctness: features must use only data available as of each snapshot date, or you leak the future. Features: recency/frequency of usage, support tickets, billing events, tenure, engagement trends. Baseline first — logistic regression on a handful of features — then gradient boosting, validated with a time-based split since random splits leak temporal patterns. Ship as a batch pipeline: score all users nightly, write to a table the CRM consumes, and monitor feature drift and precision of past predictions as outcomes mature. Close the loop with an A/B test on the retention intervention, because the model only matters if acting on it saves revenue.',
      keyPoints: [
        'Precise churn definition and prediction window before any modeling',
        'Point-in-time features and time-based validation split — leakage awareness',
        'Baseline before complex models; batch scoring is fine here (no real-time need)',
        'Measures business impact via intervention A/B test, not just AUC',
      ],
      followUp: 'Your model\'s top feature is "days since last login." The retention team says that is obvious. What is your response?',
      topicId: 'ml-system-design',
    },
    {
      id: 'ml-d2',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['ml-engineer', 'applied-scientist', 'data-scientist'],
      question: 'Design a real-time fraud detection pipeline for payment transactions. Latency budget: under 100ms per decision.',
      modelAnswer:
        'The request path: a transaction arrives, the service fetches precomputed features from an online feature store (Redis-class latency), scores a model, applies a threshold plus hard business rules, and returns approve/decline/review inside the budget. Features split by freshness: streaming aggregates (transactions per card in the last 5 minutes, velocity across merchants) computed by a stream processor like Flink and pushed to the online store; batch features (customer history, merchant risk) computed offline and synced — with identical transform definitions in both paths to avoid train/serve skew. The model handles extreme imbalance with class weights and a threshold set from the cost matrix: a false positive blocks a legitimate customer, a false negative eats the fraud loss. Keep a rules layer for known patterns and instant response to new attacks, since retraining takes hours. Route uncertain scores to human review, which also generates labels. Monitor score distributions and precision/recall as chargebacks confirm outcomes, and expect adversarial drift — fraudsters adapt, so retraining is continuous.',
      keyPoints: [
        'Online feature store + streaming aggregates to hit the latency budget',
        'Same feature transforms offline and online — train/serve skew awareness',
        'Model + rules hybrid, threshold from an explicit business cost matrix',
        'Human review queue as a label source; adversarial drift means continuous retraining',
      ],
      followUp: 'Fraud labels arrive weeks later via chargebacks. How does that delay affect training and monitoring?',
      topicId: 'ml-system-design',
    },
    {
      id: 'ml-d3',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['ml-engineer', 'applied-scientist'],
      question: 'Design a recommendation system for a content platform with millions of items and users.',
      modelAnswer:
        'Use the standard two-stage architecture: candidate generation narrows millions of items to a few hundred cheaply, then ranking scores those precisely with a heavier model. Candidates come from multiple sources: collaborative filtering via matrix factorization or a two-tower neural model whose user and item embeddings enable fast approximate nearest-neighbor lookup, plus content-based retrieval for freshness and a popularity fallback for cold-start users. The ranker is typically gradient boosting or a neural net over rich features (user history, item metadata, context like time of day) trained on engagement signals. Key design decisions: implicit feedback (clicks, watch time) rather than sparse explicit ratings; cold start handled with content features and exploration; and training on logged interactions creates feedback loops — the model only learns about items it already showed, so inject exploration and correct for position bias. Evaluate offline with ranking metrics like nDCG but decide with online A/B tests on long-term engagement, because offline gains routinely fail to transfer.',
      keyPoints: [
        'Two-stage retrieval-then-ranking architecture with the why (latency vs precision)',
        'Embeddings + ANN search for candidate generation; cold-start strategy',
        'Feedback loops and position bias in logged training data',
        'Offline ranking metrics vs online A/B as the real decision gate',
      ],
      followUp: 'Watch time as the objective maximizes clickbait. How would you adjust the objective?',
      topicId: 'ml-system-design',
    },
    {
      id: 'ml-d4',
      level: 'design',
      difficulty: 'senior',
      category: 'behavioral',
      roleIds: ['data-scientist', 'ml-engineer', 'data-analyst', 'applied-scientist'],
      question: 'Tell me about a model that failed in production. What went wrong, and what did you change?',
      modelAnswer:
        'A strong answer names a specific failure with an honest mechanism: offline metrics looked great but a feature was leaking future information; the input distribution drifted after a product change and nobody was monitoring; train/serve skew from reimplemented feature logic; or the model optimized a proxy metric that diverged from the business goal. It then walks the response like an incident: how it was detected (ideally monitoring, honestly often a stakeholder complaint), how it was mitigated fast (rollback to the previous model or a rules fallback), and root-caused after. The lasting changes matter most: drift monitoring and alerting, a shared feature pipeline to kill skew, leakage checks in CI, and shadow deployment before full rollout. Interviewers want ownership without blame-shifting, and evidence the failure changed the system, not just the model.',
      keyPoints: [
        'Specific, technically honest failure mechanism (leakage, drift, skew, bad proxy metric)',
        'Mitigate first (rollback/fallback), root-cause second',
        'Systemic fixes: monitoring, shared feature pipelines, shadow deploys',
        'Ownership of their role without blaming others',
      ],
      redFlags: [
        'Claims no model of theirs ever failed',
        'Blames data engineering or stakeholders with no personal ownership',
        'No lasting process change — they just retrained and moved on',
      ],
      topicId: 'mlops-pipelines',
    },
  ],
}
