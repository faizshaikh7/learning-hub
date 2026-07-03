import type { ConceptMap } from '@/types'

/** How the mathematical foundations and practice of machine learning connect. */
export const AIML_CONCEPT_MAP: ConceptMap = {
  title: 'AI/ML Concept Map',
  intro:
    'Machine learning is math made executable: statistics tells you what data can say, linear algebra gives it shape, calculus makes models learn, and engineering keeps them alive in production. Tap any concept to see how it links to the rest.',
  clusters: [
    {
      id: 'data-toolkit',
      name: 'Data Toolkit',
      concepts: [
        { id: 'python-ml', label: 'Python for ML', summary: 'The lingua franca gluing the whole stack together.', topicId: 'python-for-ml', relatesTo: [{ id: 'numpy', relation: 'hosts' }, { id: 'pandas', relation: 'hosts' }] },
        { id: 'numpy', label: 'NumPy Arrays', summary: 'Fast n-dimensional arrays and vectorized math.', topicId: 'numpy-fundamentals', relatesTo: [{ id: 'matrices', relation: 'implements' }, { id: 'pandas', relation: 'underpins' }] },
        { id: 'pandas', label: 'Pandas DataFrames', summary: 'Labeled tables for cleaning, joining, and reshaping data.', topicId: 'pandas-fundamentals', relatesTo: [{ id: 'eda', relation: 'powers' }, { id: 'features', relation: 'feeds' }] },
        { id: 'eda', label: 'Exploratory Data Analysis', summary: 'Look before you model: distributions, outliers, relationships.', topicId: 'eda-process', relatesTo: [{ id: 'descriptive', relation: 'applies' }, { id: 'workflow', relation: 'starts' }] },
      ],
    },
    {
      id: 'statistics',
      name: 'Statistics & Probability',
      concepts: [
        { id: 'sampling', label: 'Populations & Sampling', summary: 'Data is a sample; conclusions target the population.', topicId: 'populations-sampling', relatesTo: [{ id: 'clt', relation: 'grounded by' }, { id: 'traintest', relation: 'motivates' }] },
        { id: 'descriptive', label: 'Descriptive Statistics', summary: 'Mean, median, spread — summarizing data honestly.', topicId: 'descriptive-statistics', relatesTo: [{ id: 'variance-cov', relation: 'extends to' }] },
        { id: 'variance-cov', label: 'Variance & Covariance', summary: 'How much things vary and whether they move together.', topicId: 'variance-covariance', relatesTo: [{ id: 'pca', relation: 'is decomposed by' }, { id: 'biasvariance', relation: 'names half of' }] },
        { id: 'distributions', label: 'Probability Distributions', summary: 'Normal, binomial, Poisson — the shapes randomness takes.', topicId: 'probability-distributions', relatesTo: [{ id: 'mle', relation: 'parameterized by' }, { id: 'clt', relation: 'converge via' }] },
        { id: 'clt', label: 'Central Limit Theorem', summary: 'Averages become Normal — the engine of inference.', topicId: 'central-limit-theorem', relatesTo: [{ id: 'hypothesis', relation: 'justifies' }] },
        { id: 'bayes', label: 'Bayes Theorem', summary: 'Update beliefs with evidence: posterior from prior and likelihood.', topicId: 'bayes-theorem', relatesTo: [{ id: 'mle', relation: 'generalizes' }, { id: 'logistic', relation: 'interprets' }] },
        { id: 'mle', label: 'Maximum Likelihood', summary: 'Choose parameters that make the observed data most probable.', topicId: 'maximum-likelihood', relatesTo: [{ id: 'losses', relation: 'gives rise to' }, { id: 'linreg', relation: 'derives' }] },
        { id: 'hypothesis', label: 'Hypothesis Testing', summary: 'p-values, errors, and power — is the effect real?', topicId: 'hypothesis-testing', relatesTo: [{ id: 'evaluation', relation: 'disciplines' }] },
        { id: 'regstats', label: 'Regression (Statistical View)', summary: 'Coefficients, confidence intervals, and inference on fits.', topicId: 'regression-statistics', relatesTo: [{ id: 'linreg', relation: 'is the ML twin of' }] },
      ],
    },
    {
      id: 'linear-algebra',
      name: 'Linear Algebra',
      concepts: [
        { id: 'matrices', label: 'Matrix Operations', summary: 'Vectors, dot products, and matrix multiplication — data as geometry.', topicId: 'matrix-operations', relatesTo: [{ id: 'nnets', relation: 'is the substrate of' }, { id: 'eigen', relation: 'leads to' }] },
        { id: 'eigen', label: 'Eigenvalues & Eigenvectors', summary: 'Directions a transformation only stretches, never rotates.', topicId: 'eigenvalues-eigenvectors', relatesTo: [{ id: 'pca', relation: 'enable' }] },
        { id: 'svd', label: 'SVD & PCA (Theory)', summary: 'Factor any matrix into rotations and stretches; compress along top directions.', topicId: 'svd-pca', relatesTo: [{ id: 'pca', relation: 'implements' }, { id: 'embeddings', relation: 'foreshadows' }] },
      ],
    },
    {
      id: 'calculus-optimization',
      name: 'Calculus & Optimization',
      concepts: [
        { id: 'gradients', label: 'Derivatives & Gradients', summary: 'The direction of steepest increase — and how to walk against it.', topicId: 'derivatives-gradients', relatesTo: [{ id: 'gd', relation: 'drives' }, { id: 'chainrule', relation: 'composes into' }] },
        { id: 'chainrule', label: 'Jacobian, Hessian & Chain Rule', summary: 'Differentiating compositions — derivatives through layered functions.', topicId: 'jacobian-hessian-chain-rule', relatesTo: [{ id: 'backprop', relation: 'powers' }] },
        { id: 'gd', label: 'Gradient Descent', summary: 'Iteratively step downhill on the loss to fit parameters.', topicId: 'gradient-descent', relatesTo: [{ id: 'losses', relation: 'minimizes' }, { id: 'training-dl', relation: 'scaled up by' }] },
        { id: 'losses', label: 'Loss Landscapes', summary: 'The terrain being descended: convex bowls vs neural ravines.', topicId: 'loss-landscapes', relatesTo: [{ id: 'gd', relation: 'shapes the path of' }, { id: 'regularization', relation: 'reshaped by' }] },
      ],
    },
    {
      id: 'core-ml',
      name: 'Core ML',
      concepts: [
        { id: 'workflow', label: 'ML Project Workflow', summary: 'Frame → data → model → evaluate → iterate → ship.', topicId: 'ml-project-workflow', relatesTo: [{ id: 'traintest', relation: 'is disciplined by' }, { id: 'mlops', relation: 'matures into' }] },
        { id: 'traintest', label: 'Train/Test Split & Cross-Validation', summary: 'Honest estimates of how a model handles unseen data.', topicId: 'train-test-cross-validation', relatesTo: [{ id: 'evaluation', relation: 'feeds' }, { id: 'biasvariance', relation: 'diagnoses' }] },
        { id: 'linreg', label: 'Linear Regression', summary: 'Fit a line by least squares — the first and most interpretable model.', topicId: 'linear-regression-ml', relatesTo: [{ id: 'logistic', relation: 'extends to' }, { id: 'regularization', relation: 'stabilized by' }] },
        { id: 'logistic', label: 'Logistic Regression', summary: 'Squash a linear score through a sigmoid to get class probabilities.', topicId: 'logistic-regression-ml', relatesTo: [{ id: 'losses', relation: 'trained by cross-entropy from' }, { id: 'nnets', relation: 'is one neuron of' }] },
        { id: 'trees', label: 'Decision Trees', summary: 'Learn if/else splits that carve the feature space.', topicId: 'decision-trees', relatesTo: [{ id: 'forest', relation: 'ensemble into' }, { id: 'boosting', relation: 'ensemble into' }] },
        { id: 'evaluation', label: 'Model Evaluation', summary: 'Precision, recall, ROC, RMSE — measuring what matters.', topicId: 'model-evaluation', relatesTo: [{ id: 'biasvariance', relation: 'reveals' }] },
        { id: 'biasvariance', label: 'Bias-Variance Tradeoff', summary: 'Underfit vs overfit — the tension behind every modeling choice.', topicId: 'bias-variance-tradeoff', relatesTo: [{ id: 'regularization', relation: 'is managed by' }, { id: 'forest', relation: 'motivates' }] },
        { id: 'regularization', label: 'Regularization (L1/L2)', summary: 'Penalize complexity so models memorize less and generalize more.', topicId: 'regularization', relatesTo: [{ id: 'training-dl', relation: 'reappears in' }] },
        { id: 'features', label: 'Feature Engineering', summary: 'Encode, scale, and construct the signals models consume.', topicId: 'feature-engineering', relatesTo: [{ id: 'pipelines', relation: 'automated by' }, { id: 'embeddings', relation: 'is learned as' }] },
      ],
    },
    {
      id: 'ensembles-unsupervised',
      name: 'Ensembles & Unsupervised',
      concepts: [
        { id: 'forest', label: 'Random Forests', summary: 'Average many decorrelated trees to slash variance.', topicId: 'random-forests', relatesTo: [{ id: 'boosting', relation: 'contrasts with' }] },
        { id: 'boosting', label: 'Gradient Boosting', summary: 'Stack shallow trees sequentially, each fixing the last one\'s errors.', topicId: 'gradient-boosting', relatesTo: [{ id: 'gd', relation: 'is gradient descent in function space via' }] },
        { id: 'svm', label: 'Support Vector Machines', summary: 'Maximize the margin; kernels lift data into richer spaces.', topicId: 'svm', relatesTo: [{ id: 'matrices', relation: 'built on inner products from' }] },
        { id: 'kmeans', label: 'K-Means Clustering', summary: 'Partition points around k centroids without labels.', topicId: 'kmeans-clustering', relatesTo: [{ id: 'anomaly', relation: 'neighbors' }, { id: 'pca', relation: 'often preceded by' }] },
        { id: 'pca', label: 'PCA in Practice', summary: 'Project data onto top variance directions to compress and visualize.', topicId: 'pca-practice', relatesTo: [{ id: 'eigen', relation: 'built from' }, { id: 'embeddings', relation: 'is a linear ancestor of' }] },
        { id: 'anomaly', label: 'Anomaly Detection', summary: 'Flag points that do not belong — fraud, faults, intrusions.', topicId: 'anomaly-detection', relatesTo: [{ id: 'distributions', relation: 'defines normal via' }] },
      ],
    },
    {
      id: 'deep-learning',
      name: 'Deep Learning',
      concepts: [
        { id: 'nnets', label: 'Neural Networks from Scratch', summary: 'Stacked linear layers plus nonlinearities approximate anything.', topicId: 'neural-networks-scratch', relatesTo: [{ id: 'backprop', relation: 'trained by' }, { id: 'matrices', relation: 'computed as' }] },
        { id: 'backprop', label: 'Backpropagation', summary: 'The chain rule applied backwards to assign blame to every weight.', topicId: 'backpropagation', relatesTo: [{ id: 'chainrule', relation: 'is powered by' }, { id: 'gd', relation: 'supplies gradients to' }] },
        { id: 'training-dl', label: 'Training Deep Networks', summary: 'Optimizers, batch norm, dropout, schedules — making descent behave.', topicId: 'training-deep-networks', relatesTo: [{ id: 'losses', relation: 'navigates' }, { id: 'regularization', relation: 'borrows from' }] },
        { id: 'cnns', label: 'CNNs', summary: 'Convolutions share weights across space to see images.', topicId: 'cnns', relatesTo: [{ id: 'nnets', relation: 'specialize' }] },
        { id: 'transformers', label: 'Transformers & NLP', summary: 'Attention relates every token to every other, in parallel.', topicId: 'transformers-nlp', relatesTo: [{ id: 'embeddings', relation: 'consume' }, { id: 'matrices', relation: 'are attention matmuls from' }] },
        { id: 'embeddings', label: 'Embeddings & Representations', summary: 'Learned dense vectors where distance means similarity.', topicId: 'embeddings-representations', relatesTo: [{ id: 'transformers', relation: 'feed' }, { id: 'svd', relation: 'echo' }] },
      ],
    },
    {
      id: 'production',
      name: 'Production',
      concepts: [
        { id: 'pipelines', label: 'sklearn Pipelines', summary: 'Chain preprocessing and models so nothing leaks.', topicId: 'sklearn-pipelines', relatesTo: [{ id: 'traintest', relation: 'protect' }, { id: 'mlops', relation: 'graduate into' }] },
        { id: 'mlops', label: 'MLOps Pipelines', summary: 'Versioned data, automated training, CI/CD for models.', topicId: 'mlops-pipelines', relatesTo: [{ id: 'deployment', relation: 'delivers to' }] },
        { id: 'deployment', label: 'Model Deployment', summary: 'Serve predictions behind an API with monitoring and rollback.', topicId: 'model-deployment-ml', relatesTo: [{ id: 'sysdesign', relation: 'is one piece of' }, { id: 'evaluation', relation: 'monitored with' }] },
        { id: 'sysdesign', label: 'ML System Design', summary: 'Data flows, retraining loops, drift, and failure modes end to end.', topicId: 'ml-system-design', relatesTo: [{ id: 'workflow', relation: 'scales up' }] },
      ],
    },
  ],
}
