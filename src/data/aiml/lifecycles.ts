import type { Lifecycle } from '@/types'

/** Core AI/ML lifecycles every ML practitioner must know cold. */
export const AIML_LIFECYCLES: Lifecycle[] = [
  {
    id: 'ml-project-lifecycle',
    title: 'The ML Project Lifecycle',
    subtitle: 'From business problem to a monitored model — and around again',
    icon: '🔄',
    flow: 'cyclic',
    overview:
      'Real ML projects are iterative loops, not waterfalls. You frame the problem, explore the data, form hypotheses, ship a deliberately simple baseline, and only then earn the right to add complexity. Most projects fail at framing or data quality, not modeling — and once shipped, the model starts decaying the moment the world changes, so monitoring feeds the next iteration.',
    stages: [
      {
        name: 'Frame the problem',
        shortLabel: 'frame',
        description: 'Translate a business goal into a measurable ML task — or decide ML is not needed.',
        durationHint: 'first, revisited',
        details: [
          'Define the prediction target, the unit of prediction, and the decision the output drives',
          'Pick a success metric tied to the business (recall at fixed precision, revenue lift), not just accuracy',
          'Establish what the non-ML baseline is: a heuristic, a rule, or the current human process',
        ],
        gotchas: [
          'Optimizing a metric no one acts on — a model without a downstream decision is a science project',
          'Skipping the "do we even need ML?" question; a SQL rule often captures 80% of the value',
        ],
      },
      {
        name: 'Get & explore data (EDA)',
        shortLabel: 'explore',
        description: 'Acquire the data and understand its shape, quality, and quirks before modeling anything.',
        durationHint: 'largest time sink',
        details: [
          'Profile distributions, missingness, outliers, and class balance for every candidate feature',
          'Check label quality and how labels were generated — noisy labels cap model quality',
          'Plot the target over time; seasonality and regime changes dictate your validation strategy',
        ],
        code: {
          lang: 'python',
          label: 'first-pass EDA',
          code: 'import pandas as pd\n\ndf = pd.read_parquet("transactions.parquet")\nprint(df.info())\nprint(df.describe(include="all"))\nprint(df["label"].value_counts(normalize=True))  # class balance\nprint(df.isna().mean().sort_values(ascending=False).head(10))  # missingness',
        },
        gotchas: ['Skipping EDA and discovering mid-project that 40% of a key column is null or that labels are wrong'],
      },
      {
        name: 'Hypotheses & features',
        shortLabel: 'features',
        description: 'Turn domain knowledge into candidate features and testable hypotheses about what predicts the target.',
        durationHint: 'per iteration',
        details: [
          'Write hypotheses down: "recent usage decline predicts churn" — then build the feature that tests it',
          'Ensure point-in-time correctness: every feature must be computable at prediction time, from data available then',
          'Prefer a few strong, interpretable features over hundreds of speculative ones for the first pass',
        ],
        gotchas: ['Features that encode the label (leakage) — the classic is aggregates computed over a window that includes the outcome'],
      },
      {
        name: 'Baseline simple model',
        shortLabel: 'baseline',
        description: 'Ship the dumbest thing that could work: majority class, a heuristic, or logistic regression.',
        durationHint: 'days, not weeks',
        details: [
          'The baseline anchors every later claim of improvement — without it, "the model has 0.82 AUC" means nothing',
          'Logistic regression or a small gradient-boosted model on 10 features is a strong first baseline',
          'A baseline also flushes out pipeline bugs cheaply before you invest in complexity',
        ],
        gotchas: ['Starting with deep learning and spending weeks before knowing whether a linear model gets 95% of the way'],
      },
      {
        name: 'Evaluate honestly',
        shortLabel: 'evaluate',
        description: 'Measure on held-out data with a split that mirrors production conditions.',
        durationHint: 'gate to iterate',
        details: [
          'Use a time-based split if predictions happen over time — random splits leak temporal patterns',
          'Slice metrics by segment (new vs tenured users, region); overall metrics hide subgroup failures',
          'Compare against the baseline and the current production process, not against zero',
        ],
        gotchas: ['Tuning against the test set repeatedly until it is effectively a validation set — the final number becomes a lie'],
      },
      {
        name: 'Iterate with complexity',
        shortLabel: 'iterate',
        description: 'Only now add better features, stronger models, and hyperparameter tuning — one change at a time.',
        durationHint: 'diminishing returns',
        details: [
          'Error analysis drives iteration: look at what the model gets wrong and hypothesize why',
          'Feature improvements usually beat model swaps on tabular data',
          'Track every experiment (data version, features, params, score) so results are reproducible',
        ],
        gotchas: ['Changing five things at once — when the score moves, you cannot attribute why'],
      },
      {
        name: 'Ship it',
        shortLabel: 'ship',
        description: 'Deploy behind an API or batch job, with versioning, rollback, and a gradual rollout.',
        durationHint: 'gradual',
        details: [
          'Shadow-deploy first: score live traffic without acting on it and compare to the incumbent',
          'Version the model artifact, the feature code, and the training data together',
          'Define the fallback: what happens when the model times out or the feature store is down',
        ],
        gotchas: ['Train/serve skew — the serving path reimplements feature logic slightly differently than training did'],
      },
      {
        name: 'Monitor & retrain (loop back)',
        shortLabel: 'monitor',
        description: 'Watch input drift, prediction distributions, and realized outcomes; retrain when quality decays.',
        durationHint: 'continuous',
        details: [
          'Monitor feature distributions and prediction distributions — outcome labels often arrive too late to be your only signal',
          'Set retraining triggers: scheduled (weekly) or drift-alarm driven',
          'Production predictions plus matured outcomes become the next training set — the loop closes',
        ],
        gotchas: ['No monitoring means a silently rotting model — the most common production ML failure mode'],
      },
    ],
    keyTakeaways: [
      'Iterate in loops: frame → explore → baseline → evaluate → improve — never waterfall into a complex model',
      'A simple baseline early beats a sophisticated model late; it anchors all improvement claims and flushes out pipeline bugs',
      'Most project failures are framing and data-quality failures, not modeling failures',
      'Validation must mirror production: time-based splits, point-in-time features, sliced metrics',
      'Shipping is the midpoint, not the end — drift monitoring and retraining are part of the project',
    ],
    interviewNotes: [
      'Walk me through how you would take an ML project from business ask to production.',
      'Why start with a simple baseline instead of the best model you know?',
      'How do you decide whether a problem needs ML at all?',
      'What breaks between offline evaluation and production, and how do you defend against it?',
    ],
    relatedTopics: ['ml-system-design', 'mlops-pipelines', 'model-evaluation', 'feature-engineering', 'train-test-cross-validation'],
  },

  {
    id: 'gradient-descent-loop',
    title: 'The Training Loop',
    subtitle: 'Forward pass → loss → backprop → update, until validation says stop',
    icon: '🔁',
    flow: 'cyclic',
    overview:
      'Every gradient-trained model — from logistic regression to a transformer — learns through the same loop: run the data forward to get predictions, measure how wrong they are with a loss function, backpropagate gradients of that loss to every parameter, and step the weights downhill. Validation checks after each epoch decide whether to keep going or stop early. Internalize this loop and most deep learning behavior (learning rates, overfitting, vanishing gradients) becomes explainable.',
    stages: [
      {
        name: 'Forward pass',
        shortLabel: 'forward',
        description: 'Feed a batch of inputs through the model to produce predictions, caching intermediate activations.',
        durationHint: 'per batch',
        details: [
          'Each layer transforms its input: linear combination, then a non-linear activation',
          'Activations are cached because backprop will need them to compute gradients',
          'Batching amortizes computation — the batch size trades gradient noise against memory and speed',
        ],
      },
      {
        name: 'Compute loss',
        shortLabel: 'loss',
        description: 'Compare predictions to true labels with a single differentiable number measuring wrongness.',
        durationHint: 'per batch',
        details: [
          'Cross-entropy for classification, MSE for regression — each is the negative log-likelihood of a noise model',
          'The loss must be differentiable; accuracy is not, which is why you train on loss and report accuracy',
          'Regularization terms (L2, etc.) are added to the loss here',
        ],
        gotchas: ['A loss that goes to NaN usually means the learning rate is too high or inputs are unnormalized'],
      },
      {
        name: 'Backprop gradients',
        shortLabel: 'backprop',
        description: 'Apply the chain rule backwards through the network to get the gradient of the loss for every weight.',
        durationHint: 'per batch',
        details: [
          'Gradients flow output → input, multiplying local derivatives layer by layer',
          'This is where vanishing gradients happen: many small derivatives multiplied shrink exponentially with depth',
          'Autograd frameworks (PyTorch, JAX) build the computation graph in the forward pass and traverse it backwards',
        ],
        code: {
          lang: 'python',
          label: 'one training step in PyTorch',
          code: 'for xb, yb in train_loader:\n    optimizer.zero_grad()        # clear old gradients\n    preds = model(xb)            # forward pass\n    loss = loss_fn(preds, yb)    # compute loss\n    loss.backward()              # backprop gradients\n    optimizer.step()             # update weights',
        },
        gotchas: ['Forgetting zero_grad() accumulates gradients across batches — a classic silent bug'],
      },
      {
        name: 'Update weights',
        shortLabel: 'update',
        description: 'The optimizer steps each weight against its gradient, scaled by the learning rate.',
        durationHint: 'per batch',
        details: [
          'Vanilla SGD: weight = weight - lr * gradient; Adam adds per-parameter adaptive step sizes and momentum',
          'The learning rate is the single most important hyperparameter: too high diverges, too low crawls',
          'Learning-rate schedules (warmup, cosine decay) change lr over training and matter at scale',
        ],
        gotchas: ['Loss oscillating or exploding → lr too high; loss flat from the start → lr too low or gradients not flowing'],
      },
      {
        name: 'Validate',
        shortLabel: 'validate',
        description: 'After each epoch, measure loss/metrics on held-out validation data the model never trains on.',
        durationHint: 'per epoch',
        details: [
          'Training loss almost always falls; validation loss is the honest signal of generalization',
          'Validation loss falling then rising while training loss keeps falling = overfitting has begun',
          'Run in inference mode: no gradient tracking, dropout off, batch-norm in eval mode',
        ],
      },
      {
        name: 'Early-stop or repeat',
        shortLabel: 'stop?',
        description: 'If validation stops improving for a patience window, stop and keep the best checkpoint; otherwise loop.',
        durationHint: 'per epoch',
        details: [
          'Early stopping is free regularization: it halts training right where generalization peaks',
          'Keep the checkpoint with the best validation score, not the last one',
          'Also stop on budget: max epochs, wall-clock, or compute cost',
        ],
        gotchas: ['Selecting the stopping point using the test set — that decision makes it a validation set and burns your unbiased estimate'],
      },
    ],
    keyTakeaways: [
      'All gradient training is the same loop: forward → loss → backward → update → validate',
      'The loss function is a modeling choice — it encodes what "wrong" means and maps to a likelihood assumption',
      'The learning rate dominates training dynamics; diagnose divergence and stalls through it first',
      'Validation loss, not training loss, tells you when to stop — early stopping is built-in regularization',
      'Most training bugs are loop bugs: unzeroed gradients, wrong mode (train vs eval), leaky validation',
    ],
    interviewNotes: [
      'Walk through one training step of a neural network in detail.',
      'Training loss decreases but validation loss increases — what is happening and what do you do?',
      'Why do we train on cross-entropy but report accuracy?',
      'What does the learning rate control, and how do you know it is wrong?',
    ],
    relatedTopics: ['backpropagation', 'maximum-likelihood', 'bias-variance-tradeoff', 'model-evaluation'],
  },

  {
    id: 'data-pipeline-lifecycle',
    title: 'From Raw Data to Features',
    subtitle: 'Collect → clean → split → transform → engineer → reuse',
    icon: '🧹',
    flow: 'linear',
    overview:
      'Feature preparation is where most ML wins and most ML bugs live. The pipeline runs from raw collection to reusable features, and one rule towers over everything: split your data BEFORE fitting any transformation. Every scaler, encoder, and imputer must learn its parameters from the training set only — fitting on all data leaks test information into training and inflates every metric you report.',
    stages: [
      {
        name: 'Collect',
        shortLabel: 'collect',
        description: 'Gather raw data from databases, event streams, logs, and third parties — with provenance.',
        durationHint: 'ongoing',
        details: [
          'Record where each field comes from and when it becomes available — this determines what is usable at prediction time',
          'Snapshot or version the raw data so any training run is reproducible',
          'Check collection bias early: does the data cover the population the model will serve?',
        ],
        gotchas: ['Training on data collected differently than production inputs — train/serve skew starts at collection'],
      },
      {
        name: 'Clean (missing & outliers)',
        shortLabel: 'clean',
        description: 'Handle missing values, outliers, duplicates, and inconsistent types — deliberately, not silently.',
        durationHint: 'per dataset',
        details: [
          'Missingness is often informative: add a "was_missing" indicator rather than only imputing',
          'Decide outlier policy per feature: cap (winsorize), transform (log), or keep — fraud outliers ARE the signal',
          'Deduplicate before splitting; duplicate rows spanning train and test are hidden leakage',
        ],
        gotchas: [
          'Dropping every row with any missing value can silently discard a biased half of your data',
          'Imputing with the global mean computed over ALL data — that is leakage; compute it on train only',
        ],
      },
      {
        name: 'Split BEFORE fitting',
        shortLabel: 'split',
        description: 'Carve out train/validation/test now — before any statistic is computed or transformer is fit.',
        durationHint: 'once, sacred',
        details: [
          'Every downstream step (imputer, scaler, encoder, feature selector) fits on the training split only',
          'Use time-based splits for temporal problems and group-based splits when rows share an entity (same user in train and test is leakage)',
          'Stratify classification splits so class balance is preserved in each set',
        ],
        code: {
          lang: 'python',
          label: 'split first, then fit transforms on train only',
          code: 'from sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, stratify=y, random_state=42\n)\n\nscaler = StandardScaler()\nX_train_s = scaler.fit_transform(X_train)  # fit on train ONLY\nX_test_s = scaler.transform(X_test)        # apply, never re-fit',
        },
        gotchas: ['fit_transform on the full dataset before splitting is the single most common leakage bug in ML code'],
      },
      {
        name: 'Scale & encode',
        shortLabel: 'transform',
        description: 'Standardize numeric features and encode categoricals into model-consumable form.',
        durationHint: 'per pipeline run',
        details: [
          'Standardize or min-max scale for distance- and gradient-based models; trees do not need it',
          'One-hot encode low-cardinality categoricals; use target encoding or embeddings for high-cardinality ones',
          'Wrap everything in a Pipeline object so the exact fitted transforms travel with the model to serving',
        ],
        gotchas: [
          'Target encoding fit on the full data leaks the label — fit it within cross-validation folds',
          'Unseen categories at serving time crash naive encoders; always define a fallback bucket',
        ],
      },
      {
        name: 'Feature engineering',
        shortLabel: 'engineer',
        description: 'Create the derived signals that actually carry predictive power: ratios, windows, interactions.',
        durationHint: 'highest leverage',
        details: [
          'Aggregations over time windows (count of events in last 7/30 days) are the workhorse of tabular ML',
          'Encode domain knowledge: ratios (spend per visit), recency (days since last action), trends (this week vs last)',
          'Every feature must be point-in-time correct — computable at prediction time from data available then',
        ],
        gotchas: ['A feature computed over a window that includes the label event is leakage wearing a disguise'],
      },
      {
        name: 'Feature store & reuse',
        shortLabel: 'reuse',
        description: 'Publish features to a shared store so training and serving read identical, versioned values.',
        durationHint: 'infrastructure',
        details: [
          'A feature store keeps one definition per feature, serving offline (training) and online (inference) from the same logic',
          'Point-in-time joins let you rebuild historically accurate training sets without future leakage',
          'Shared features stop every team from re-deriving "customer 30-day spend" with subtle inconsistencies',
        ],
        gotchas: ['Reimplementing feature logic separately for serving — the drift between the two copies becomes train/serve skew'],
      },
    ],
    keyTakeaways: [
      'Split BEFORE you fit anything — every imputer, scaler, and encoder learns from the training set only',
      'Cleaning decisions are modeling decisions: missingness indicators and outlier policy change what the model can learn',
      'Feature engineering is the highest-leverage activity in tabular ML — windows, ratios, and recency beat model swaps',
      'Point-in-time correctness everywhere: if a feature uses future data, offline metrics are fiction',
      'One feature definition for training and serving (pipelines / feature stores) kills train/serve skew',
    ],
    interviewNotes: [
      'Why must you split before scaling, and what exactly leaks if you do not?',
      'How do you handle missing values, and when is missingness itself a feature?',
      'How would you encode a categorical feature with 10,000 unique values?',
      'What is train/serve skew and how does a feature store prevent it?',
    ],
    relatedTopics: ['feature-engineering', 'train-test-cross-validation', 'mlops-pipelines', 'model-evaluation'],
  },
]
