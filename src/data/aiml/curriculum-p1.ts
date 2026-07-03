import type { CurriculumTopic } from '@/types'

/**
 * AI/ML In-Depth — Phase 1: Statistics & Probability.
 * The deepest phase of the course: statistics is the language ML is written in.
 * Every loss function, every evaluation metric, and every "why does this work"
 * question traces back to the ideas in these 11 lessons.
 */
export const AIML_P1: CurriculumTopic[] = [
  {
    id: 'populations-sampling',
    phase: 1,
    phaseName: 'Statistics & Probability',
    orderIndex: 1,
    estimatedMins: 40,
    prerequisites: ['numpy-fundamentals', 'pandas-fundamentals'],
    title: 'Populations & Sampling',
    eli5: 'Imagine you want to know the average height of everyone in your country. You cannot measure millions of people, so you measure 1,000 of them and guess from that. The whole country is the population, your 1,000 people are the sample. If you only measured basketball players, your guess would be way off — that is sampling bias.',
    analogy: 'Tasting soup. The pot is the population, the spoonful is the sample. If you stir well before tasting (random sampling), one spoonful tells you about the whole pot. If you only skim the top where the oil floats (biased sampling), you conclude the soup is greasy when it is not. ML models are chefs who only ever taste the spoon — they never see the pot.',
    explanation: 'A population is the complete set of things you actually care about: all users, all future emails, all possible images of cats. A sample is the subset you can actually observe and measure. Statistics exists because we almost never get the population — we get samples, and we must reason carefully about what the sample can and cannot tell us.\n\nThis is exactly the situation of machine learning. Your training set is a sample; the population is all the data your model will ever see in production. A model that performs well on the training sample but poorly on the population has failed to generalize — and most generalization failures are, at their root, sampling failures. The sample was too small, was collected in a biased way, or the population shifted after the sample was taken (distribution shift).\n\nRepresentativeness is the key property: a sample is representative when every relevant slice of the population appears in it with roughly the right frequency. Random sampling is the standard tool to achieve this, because randomness removes the human tendency to pick convenient or interesting cases. Stratified sampling goes further by deliberately guaranteeing that important subgroups (e.g. rare classes) appear in correct proportions.',
    technicalDeep: 'Formally, we model the population as a probability distribution P over some space X (or X x Y for supervised learning), and a sample as n independent, identically distributed (i.i.d.) draws x1, ..., xn from P. Nearly every guarantee in ML theory — the law of large numbers, generalization bounds, cross-validation validity — assumes i.i.d. sampling. When that assumption breaks, the guarantees break with it.\n\nCommon sampling pathologies map directly to ML failures. Selection bias: the mechanism that decides which points enter the sample depends on the values themselves (loan-default models trained only on approved loans never see the rejected applicants). Survivorship bias: only the "survivors" are observed (analyzing returned WWII planes for bullet holes ignores the planes that never came back). Coverage bias: parts of the population have zero probability of entering the sample (a voice assistant trained only on adult speech fails on children). Temporal drift: the population changes between sampling and deployment, so even a perfectly random historical sample stops being representative.\n\nTwo more distinctions matter constantly in practice. Sampling with vs without replacement: bootstrap resampling (with replacement) underlies bagging and random forests; each bootstrap sample leaves out about 36.8 percent of the original points (the limit of (1 - 1/n)^n is 1/e). And the difference between a statistic and a parameter: parameters (population mean mu, population variance sigma squared) are fixed but unknown; statistics (sample mean x-bar, sample variance s squared) are random variables that change with each sample. The entire machinery of estimation, confidence intervals, and hypothesis testing lives in the gap between the two.',
    whatBreaks: 'A fraud model trained on last year\'s transactions silently decays as fraud patterns shift (temporal drift). A medical model trained at one hospital fails at another because patient demographics differ (coverage bias). A recommendation model trained on clicks from power users mispredicts casual users (selection bias). Random train/test splits on time-series data leak the future into training and produce wildly optimistic offline metrics that collapse in production. Class imbalance without stratification means a random split can put nearly all rare-class examples in one fold.',
    efficientWay: {
      title: 'Building Sampling Intuition',
      approaches: [
        {
          name: 'Simulate sampling in numpy and watch estimates converge and biases distort',
          verdict: 'best',
          reason: 'Ten lines of code make sampling error and bias visceral. You see the sample mean wobble around the true mean and see biased samples miss it entirely.'
        },
        {
          name: 'Study survey-methodology theory (sampling frames, design effects) in depth',
          verdict: 'weak',
          reason: 'Valuable for statisticians running surveys, but far more depth than ML practice requires. You need the failure modes, not the census machinery.'
        },
        {
          name: 'Memorize a checklist of bias types by name',
          verdict: 'ok',
          reason: 'Useful vocabulary for reviews and interviews, but names without simulated experience do not help you spot bias in a real dataset.'
        }
      ],
      recommendation: 'Simulate first: draw samples of increasing size from a known distribution, plot the sample mean converging, then deliberately bias the sampling and watch the estimate stay wrong no matter how large n gets. That one experiment — bias does not shrink with more data — is the deepest lesson in this topic.'
    },
    commonMistakes: [
      'Believing more data fixes bias — a biased sample of 10 million points is still wrong; variance shrinks with n, bias does not',
      'Splitting time-series data randomly instead of chronologically, leaking future information into the training set',
      'Evaluating a model on a test set drawn from a different population than production traffic, then trusting the offline metric',
      'Ignoring the sampling mechanism: treating "data we happen to have" (convenience sample) as if it were a random sample of the population'
    ],
    seniorNotes: 'In production ML, "the population" is a moving target — senior engineers treat train/serve skew and distribution shift as permanent operational concerns, not one-time checks. Standard practice: log a random sample of production inputs, compare feature distributions against training data (population stability index, KL divergence, or simple quantile diffs), and alert on drift. When labeling budgets are limited, stratified or importance sampling of production traffic buys far more evaluation power per label than uniform sampling. And when someone proposes training on "all available data," the first question is always: what mechanism generated this data, and who is missing from it?',
    interviewQuestions: [
      'Your model has 99 percent accuracy offline but underperforms badly in production. Walk me through sampling-related causes.',
      'What does i.i.d. mean and why does almost all ML theory assume it? Give a real case where it fails.',
      'You can label only 5,000 of 10 million production events for evaluation. How do you choose which ones?'
    ],
    interviewAnswers: [
      'Start with train/serve mismatch: the training sample was not representative of production traffic. Concrete causes: temporal drift (trained on old data, world changed), selection bias (training data came through a filtered funnel, e.g. only approved loans or only logged-in users), coverage gaps (segments absent from training appear in production), leakage in the split (random split of temporally or user-correlated data made offline metrics optimistic), and label shift (class proportions differ between offline test set and production). The diagnostic move is to compare feature and prediction distributions between the training sample and live traffic slice by slice.',
      'i.i.d. means each data point is drawn independently from the same fixed distribution. Independence lets errors average out (law of large numbers, CLT); identical distribution means the past is informative about the future. Generalization bounds, cross-validation, and confidence intervals all lean on it. It fails for time series (autocorrelation plus drift — yesterday\'s stock price is neither independent of today\'s nor drawn from a stable distribution), and for grouped data like multiple records per user, where random splitting puts the same user in train and test and inflates metrics.',
      'Do not sample uniformly — most labels would go to easy, common cases. Stratify by the dimensions you must be confident about: predicted class, model confidence bands, key user segments, and any rare-but-costly slice. Oversample rare and high-uncertainty strata, then reweight by inverse sampling probability when computing overall metrics so the estimate is still unbiased for the population. This gives tight per-slice estimates and an unbiased global estimate from the same 5,000 labels.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Sampling error shrinks with n — sampling bias never does',
        code: "import numpy as np\n\nrng = np.random.default_rng(42)\n\n# Population: incomes of 1,000,000 people (log-normal, true mean known)\npopulation = rng.lognormal(mean=10.5, sigma=0.6, size=1_000_000)\ntrue_mean = population.mean()\nprint(f'True population mean: {true_mean:,.0f}')\n\nfor n in [50, 500, 5000, 50000]:\n    # Unbiased: simple random sample\n    random_sample = rng.choice(population, size=n, replace=False)\n\n    # Biased: only sample people above the 30th percentile\n    # (like surveying only people who answer their phone at work)\n    cutoff = np.percentile(population, 30)\n    eligible = population[population > cutoff]\n    biased_sample = rng.choice(eligible, size=n, replace=False)\n\n    print(f'n={n:>6}  random: {random_sample.mean():>9,.0f}  '\n          f'biased: {biased_sample.mean():>9,.0f}')\n\n# Random sample error shrinks toward 0 as n grows.\n# Biased sample stays ~20% too high at every n: more data does not fix bias."
      },
      {
        lang: 'python',
        label: 'Stratified vs random split on imbalanced classes',
        code: "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(0)\n# 2% positive class, like fraud\ny = (rng.random(2000) < 0.02).astype(int)\nX = rng.normal(size=(2000, 4))\n\n_, _, y_tr_rand, y_te_rand = train_test_split(X, y, test_size=0.2, random_state=1)\n_, _, y_tr_strat, y_te_strat = train_test_split(\n    X, y, test_size=0.2, random_state=1, stratify=y)\n\nprint(f'Overall positive rate:      {y.mean():.3f}')\nprint(f'Random split test rate:     {y_te_rand.mean():.3f}')\nprint(f'Stratified split test rate: {y_te_strat.mean():.3f}')\n# Random split can land far from 0.02 in the test fold;\n# stratification pins it, so metrics on rare classes are stable."
      }
    ],
    resources: [
      { label: 'Khan Academy — Statistics & Probability (sampling units)', url: 'https://www.khanacademy.org/math/statistics-probability', kind: 'course' },
      { label: 'StatQuest — sampling, populations and estimation, visually', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'An Introduction to Statistical Learning (ch. 2 on the data-generating view)', url: 'https://www.statlearning.com/', kind: 'book' }
    ]
  },
  {
    id: 'descriptive-statistics',
    phase: 1,
    phaseName: 'Statistics & Probability',
    orderIndex: 2,
    estimatedMins: 45,
    prerequisites: ['populations-sampling'],
    title: 'Descriptive Statistics & Expected Value',
    eli5: 'If your test scores are 70, 80, and 90, your average is 80 — one number that summarizes all three. The median is the middle score, and the mode is the most common one. Expected value is the average you would get if you could repeat something forever: a lottery ticket that pays 100 with a 1-in-a-thousand chance is "worth" 10 cents on average, even though no single ticket ever pays 10 cents.',
    analogy: 'Expected value is a see-saw balance point. Put weights (probabilities) at positions (values) along a plank: the expected value is exactly where the plank balances. The median is the point with half the total weight on each side — move the heaviest weight far to the right and the balance point (mean) chases it, but the half-weight point (median) barely moves. That is why medians resist outliers and means do not.',
    explanation: 'Descriptive statistics compress a pile of numbers into a few that capture its character. The mean is the arithmetic average, the median is the middle value when sorted, the mode is the most frequent value. For symmetric data they agree; for skewed data (incomes, latencies, house prices) they diverge, and which one you report changes the story: mean income is pulled up by billionaires, median income is not.\n\nExpected value generalizes the mean from "data we have" to "outcomes weighted by probability." E[X] is the sum of each possible value times its probability — the long-run average over infinite repetitions. This single idea is the bridge from statistics into machine learning: when we train a model, we want it to do well on average over the whole population of future data, so the thing we actually minimize is an expected value.\n\nThat quantity has a name: risk. The risk of a model is the expected loss E[L(y, f(x))] over the data distribution. We cannot compute it (we do not have the population), so we minimize the average loss on our sample instead — the empirical risk. Training a neural network is empirical risk minimization: replacing an expectation we cannot evaluate with a sample mean we can. Every loss curve you will ever stare at is a sample estimate of an expected value.',
    technicalDeep: 'For a discrete random variable, E[X] = sum over x of x * P(X = x); for a continuous one, E[X] = integral of x * f(x) dx where f is the density. Expectation is linear — E[aX + bY] = aE[X] + bE[Y] — with no independence assumption required, which is why it is the most manipulable object in probability and why so many proofs and estimators are built out of expectations.\n\nThe law of large numbers is the license for everything: the sample mean of n i.i.d. draws converges to E[X] as n grows. This is precisely why empirical risk (training loss averaged over a sample) approximates true risk (expected loss over the population), and why minibatch gradients — averages of per-example gradients over a random batch — are unbiased estimates of the full-dataset gradient. SGD works because the expectation of the minibatch gradient equals the true gradient.\n\nDifferent summary statistics are themselves optimal answers to different questions. The mean is the constant c minimizing E[(X - c)^2] (squared-error loss); the median minimizes E[|X - c|] (absolute loss); the mode maximizes probability (0-1 loss). This is a deep pattern: choosing a loss function is implicitly choosing which summary of the target distribution your model will learn to predict. A regression trained with MSE learns the conditional mean E[Y | X]; trained with MAE it learns the conditional median; quantile loss (pinball loss) learns any conditional quantile you ask for. Robustness follows the same logic — one corrupted label with an enormous value drags an MSE-trained model far more than an MAE-trained one, exactly as one billionaire drags the mean but not the median.',
    whatBreaks: 'Reporting mean latency hides disasters: a service with 50ms mean can have a 5-second p99 that ruins user experience — this is why SLOs use percentiles, never means. Training a demand-forecasting model with MSE on skewed sales data makes it systematically overpredict typical items because a few blockbusters dominate the squared loss. The mean of heavy-tailed data barely converges: with distributions like Pareto (some financial and network data), sample means stay unstable at huge n, and for infinite-variance cases the LLN guarantee weakens or fails. And a single mislabeled outlier (a price entered in cents instead of dollars) can visibly bend an MSE-trained regression line.',
    efficientWay: {
      title: 'Learning Summaries and Expectation',
      approaches: [
        {
          name: 'Plot every dataset before summarizing it, then connect each summary to the loss it minimizes',
          verdict: 'best',
          reason: 'A histogram tells you instantly whether mean or median is the honest summary, and the loss connection turns descriptive stats into ML foundations rather than trivia.'
        },
        {
          name: 'Learn formulas for mean, median, mode, skewness, kurtosis as a definitions list',
          verdict: 'weak',
          reason: 'Definitions without distributional pictures produce engineers who report means of skewed data and never notice.'
        },
        {
          name: 'Jump straight to fitting models and pick up statistics as needed',
          verdict: 'ok',
          reason: 'You can get far, but you will not understand why your model overpredicts on skewed targets or why MAE fixed it — you will just be pattern-matching Stack Overflow.'
        }
      ],
      recommendation: 'Anscombe\'s quartet is the mandatory first stop: four datasets with identical means, variances, and correlations that look wildly different when plotted. Internalize "always plot first," then do the mean-minimizes-MSE / median-minimizes-MAE derivation once by simulation. Those two exercises pay off for your entire ML career.'
    },
    commonMistakes: [
      'Using the mean to summarize skewed data (incomes, latencies, session lengths) where the median is the honest answer',
      'Forgetting that expectation is linear but almost nothing else is: E[X^2] is not E[X]^2, and E[1/X] is not 1/E[X] (Jensen\'s inequality gap)',
      'Treating the training-loss number as the true risk instead of a noisy sample estimate of it — the gap between them is exactly overfitting',
      'Choosing MSE by default without asking whether the conditional mean is even the quantity the product needs (delivery-time promises need a high quantile, not the mean)'
    ],
    seniorNotes: 'Senior ML engineers read loss functions as statements about which statistic of the target distribution is being learned. When a stakeholder says "the forecast is always too low on big days," the senior diagnosis is often "we are predicting the conditional mean of a right-skewed distribution — do you want a quantile instead?" Similarly, offline metric aggregation is a descriptive-statistics decision: averaging accuracy over examples weights power users more than averaging over users. And in experimentation, heavy-tailed metrics like revenue-per-user make means noisy — trimmed means or winsorization are standard, deliberate trade-offs of a little bias for a lot of variance reduction.',
    interviewQuestions: [
      'Why does training a regression with MSE make it predict the conditional mean, and when is that the wrong target?',
      'Your dashboard shows mean request latency of 60ms but users complain the app is slow. What is going on?',
      'What is the relationship between expected value, risk, and the loss you minimize during training?'
    ],
    interviewAnswers: [
      'For a fixed input x, the constant prediction c that minimizes E[(Y - c)^2 | X = x] is c = E[Y | X = x] — differentiate the expected squared error with respect to c, set to zero, and the conditional mean falls out. So an MSE-trained model with enough capacity approximates the conditional mean. That is wrong when the business cares about a different functional: delivery ETAs need a high quantile (promise you can keep 90 percent of the time), skewed targets are better summarized by the median (MAE), and multimodal targets (e.g. two plausible future trajectories) make the mean a value that never actually occurs.',
      'Latency is right-skewed, so the mean is dominated by the fast majority and hides the tail. A 60ms mean is fully compatible with a p95 of 800ms and p99 of 3s — and the slow tail is what users remember, and often correlates with your heaviest users or biggest payloads. The fix is to monitor percentiles (p50/p95/p99) and set SLOs on them. Same lesson for ML metrics: report the distribution or key quantiles, not just the average.',
      'Risk is expected loss over the true data distribution: R(f) = E[L(y, f(x))]. It is the thing we actually want to minimize but cannot compute, because we do not have the distribution — only a sample. So we minimize empirical risk, the average loss over the training set, which by the law of large numbers approximates true risk. Training loss is therefore a sample estimate of an expectation; the train/test gap is the estimation error of that approximation, and regularization exists to keep empirical minimization from exploiting sample noise.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Mean minimizes squared loss, median minimizes absolute loss',
        code: "import numpy as np\n\nrng = np.random.default_rng(7)\n# Right-skewed data: most values small, a few huge (like latencies)\ndata = rng.lognormal(mean=3.0, sigma=1.0, size=10_000)\n\nprint(f'mean   = {data.mean():8.1f}')\nprint(f'median = {np.median(data):8.1f}')  # far below the mean\n\n# Search over constant predictions c: which c minimizes each loss?\ncandidates = np.linspace(data.min(), np.percentile(data, 99), 2000)\nmse = [np.mean((data - c) ** 2) for c in candidates]\nmae = [np.mean(np.abs(data - c)) for c in candidates]\n\nbest_mse_c = candidates[int(np.argmin(mse))]\nbest_mae_c = candidates[int(np.argmin(mae))]\nprint(f'c minimizing MSE = {best_mse_c:8.1f}  (matches the mean)')\nprint(f'c minimizing MAE = {best_mae_c:8.1f}  (matches the median)')\n# Your loss function silently chooses which statistic your model learns."
      },
      {
        lang: 'python',
        label: 'Empirical risk converges to true risk (law of large numbers)',
        code: "import numpy as np\n\nrng = np.random.default_rng(1)\n\n# True setup: y = 2x + Gaussian noise. Fixed model: f(x) = 1.8x (slightly wrong)\ndef sample_losses(n):\n    x = rng.uniform(0, 10, size=n)\n    y = 2.0 * x + rng.normal(0, 1, size=n)\n    pred = 1.8 * x\n    return (y - pred) ** 2\n\n# True risk = E[(y - 1.8x)^2] = E[(0.2x + noise)^2]\n# = 0.04 * E[x^2] + 1 = 0.04 * (100/3) + 1 = 2.333...\ntrue_risk = 0.04 * (100 / 3) + 1\n\nfor n in [10, 100, 1_000, 10_000, 100_000]:\n    emp = sample_losses(n).mean()\n    print(f'n={n:>7}  empirical risk={emp:6.3f}   true risk={true_risk:.3f}')\n# The number your training loop prints is a sample mean\n# estimating an expectation — noisy at small n, tight at large n."
      }
    ],
    resources: [
      { label: 'StatQuest — mean, expected value and loss functions explained', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Khan Academy — summarizing quantitative data', url: 'https://www.khanacademy.org/math/statistics-probability', kind: 'course' },
      { label: 'Mathematics for Machine Learning (ch. 6, probability and expectation)', url: 'https://mml-book.github.io/', kind: 'book' },
      { label: 'Kaggle Learn — hands-on data exercises in pandas', url: 'https://www.kaggle.com/learn', kind: 'practice' }
    ]
  },
  {
    id: 'variance-covariance',
    phase: 1,
    phaseName: 'Statistics & Probability',
    orderIndex: 3,
    estimatedMins: 45,
    prerequisites: ['descriptive-statistics'],
    title: 'Variance, Covariance & Correlation',
    eli5: 'Two archers both hit the target center "on average," but one lands every arrow near the middle while the other sprays arrows everywhere. Variance measures the spray. Covariance asks about two things at once: when one goes up, does the other go up too? Ice cream sales and sunburns rise together (positive), umbrella sales and sunshine move oppositely (negative).',
    analogy: 'Variance is the wobble of a washing machine: same average position, but a big wobble shakes everything around it. Correlation is two dancers: at +1 they mirror each other perfectly, at 0 they dance in separate rooms, at -1 one rises exactly as the other dips. But two dancers moving together does not mean one is leading — maybe they both hear the same music (a confounder).',
    explanation: 'Variance measures spread: the average squared distance from the mean, Var(X) = E[(X - E[X])^2]. Its square root, the standard deviation, is in the same units as the data and is the natural "typical distance from average." In ML, variance is the mathematical face of uncertainty and noise — the variance of a gradient estimate controls how stable training is, the variance of a model across resampled training sets is the "variance" in the bias-variance trade-off, and the variance of an A/B metric decides how long an experiment must run.\n\nCovariance extends this to pairs: Cov(X, Y) = E[(X - E[X])(Y - E[Y])] is positive when X and Y tend to be above their means together, negative when they move oppositely. Correlation is covariance rescaled to [-1, 1] so it is comparable across units. A correlation of 0.9 between two features means they carry largely overlapping information.\n\nThis matters everywhere in ML. Highly correlated features (multicollinearity) make linear-model coefficients unstable and uninterpretable — the model can trade weight between two near-duplicate features almost freely. The covariance matrix of your features is the object PCA diagonalizes to find the directions of greatest variation. And correlation between models is why ensembles work: averaging models only reduces variance to the extent the models\' errors are not correlated.',
    technicalDeep: 'Key identities: Var(X) = E[X^2] - (E[X])^2; Var(aX + b) = a^2 Var(X); and for sums, Var(X + Y) = Var(X) + Var(Y) + 2Cov(X, Y) — variances add only under zero covariance. The variance of a sample mean of n i.i.d. draws is sigma^2 / n, which is the engine behind "averaging reduces noise": minibatch gradient variance falls as batch size grows, and A/B test precision improves with the square root of sample size (to halve the error bar you need 4x the users).\n\nFor a feature vector x in R^d, the covariance matrix Sigma = E[(x - mu)(x - mu)^T] is symmetric positive semi-definite; its eigenvectors are the principal axes of the data cloud and its eigenvalues the variance along each axis — that is PCA in one sentence. In linear regression, the coefficient covariance is sigma^2 (X^T X)^{-1}: when features are strongly correlated, X^T X is nearly singular, its inverse explodes, and coefficient estimates get enormous variance. That is multicollinearity, and it is why ridge regression adds lambda*I to X^T X — literally repairing the ill-conditioned covariance structure.\n\nThree correlation caveats that decide real ML debates. First, Pearson correlation measures only linear association: y = x^2 on symmetric data has correlation near zero despite perfect dependence — use Spearman (rank) correlation or mutual information for monotone or general dependence. Second, correlation is not causation: features can be predictive purely through confounders, which is fine for prediction but disastrous when someone treats model coefficients as levers to pull. Third, zero correlation does not imply independence (except in the special multivariate-Gaussian world); independence is the far stronger statement P(X, Y) = P(X)P(Y).',
    whatBreaks: 'Multicollinearity makes coefficient-based feature importance meaningless: two correlated features can show one huge positive and one huge negative weight that nearly cancel, and tiny data changes flip their signs — stakeholders then draw opposite business conclusions from successive retrains. Correlated errors break ensemble math: ten deep nets trained on the same data with the same architecture are highly correlated, so the ensemble gains far less than the 1/n variance reduction naive math promises. Unstandardized features make covariance-based methods (PCA) latch onto whichever feature has the largest units — a salary column in rupees dominates one in lakhs. And correlation-driven feature selection silently drops one of a correlated pair that was, in fact, the causal one.',
    efficientWay: {
      title: 'Building Spread-and-Dependence Intuition',
      approaches: [
        {
          name: 'Scatter-plot pairs at various correlations and study a real correlation heatmap of a dataset',
          verdict: 'best',
          reason: 'Correlation only becomes intuition when you can look at a cloud of points and guess r within 0.1. Heatmaps of real features teach multicollinearity better than any definition.'
        },
        {
          name: 'Work through the matrix algebra of covariance matrices and eigendecomposition immediately',
          verdict: 'ok',
          reason: 'Essential eventually (it is the doorway to PCA), but doing it before visual intuition makes it symbol-pushing. Do it second, not first.'
        },
        {
          name: 'Rely on library defaults (df.corr(), VIF warnings) without understanding what they compute',
          verdict: 'weak',
          reason: 'You will miss nonlinear dependence that Pearson cannot see and misread coefficient instability as a data bug.'
        }
      ],
      recommendation: 'Play the "guess the correlation" game with generated scatter plots until you are calibrated, then compute a correlation heatmap on a real dataset (e.g. a housing dataset) and fit a linear regression with and without one of a correlated pair — watching the surviving coefficient change is the multicollinearity lesson that sticks. Save the eigendecomposition for the PCA lesson.'
    },
    commonMistakes: [
      'Reading Pearson correlation of 0 as "no relationship" — it only rules out linear relationships; plot the data or use rank correlation',
      'Interpreting regression coefficients causally ("increasing this feature by 1 will raise revenue by X") when features are observational and correlated',
      'Adding variances of correlated quantities as if independent — portfolio risk and ensemble error both require covariance terms',
      'Running PCA or distance-based methods on unstandardized features, letting unit choices masquerade as importance'
    ],
    seniorNotes: 'Senior practitioners treat the covariance structure of features as an artifact to engineer, not an accident to discover. Feature stores dedupe near-duplicate features precisely because multicollinearity destabilizes models and confuses attribution. In experimentation, variance reduction is a first-class technique: CUPED uses covariance between pre-experiment and in-experiment metrics to cut A/B test variance by 30-50 percent, shortening experiments by weeks. In deep learning, this topic shows up as gradient-noise scale (guiding batch-size choices) and as ensembling strategy — the whole point of bagging, random feature subsets, and diverse architectures is to decorrelate errors so averaging actually helps.',
    interviewQuestions: [
      'Two features have correlation 0.95. What happens if you put both in a linear regression, and what would you do about it?',
      'Why does averaging n models reduce variance, and what limits the benefit in practice?',
      'Give an example where correlation is nearly zero but the variables are strongly dependent. How would you detect it?'
    ],
    interviewAnswers: [
      'Prediction accuracy is largely unaffected — the model can still fit the shared signal — but the individual coefficients become unstable and uninterpretable: X^T X is near-singular, coefficient variance blows up, and the two weights can take large offsetting values that flip between retrains. Options: drop one feature, combine them (average, PCA component, or a domain-driven ratio), or use ridge regression, which shrinks the offsetting weights and stabilizes the solution. Which option you pick depends on whether you need interpretability or just predictions.',
      'For models with individual variance sigma^2 and pairwise error correlation rho, the variance of the average is rho*sigma^2 + (1 - rho)*sigma^2/n. With independent errors (rho = 0) you get the ideal sigma^2/n; with correlated errors the first term never shrinks no matter how many models you add. In practice models trained on the same data with similar architectures have high rho, so ensembling gives diminishing returns — which is why bagging, feature subsampling (random forests), different seeds/architectures, and different data views exist: they lower rho, not sigma.',
      'y = x^2 with x symmetric around zero: Pearson correlation is essentially 0 because the relationship is non-monotone, yet y is a deterministic function of x. Detection: always plot; use Spearman correlation for monotone-but-nonlinear cases (it would still be ~0 here), and mutual information or distance correlation for general dependence (both would be high here). A model-based check also works: if a flexible model predicts y from x far better than the correlation suggests, dependence is present.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Multicollinearity: coefficients go wild, predictions stay fine',
        code: "import numpy as np\n\nrng = np.random.default_rng(3)\nn = 500\n\nx1 = rng.normal(size=n)\nx2 = x1 + rng.normal(scale=0.05, size=n)   # nearly a copy of x1 (r ~ 0.999)\ny = 3.0 * x1 + rng.normal(scale=1.0, size=n)  # truth uses only x1\n\nprint(f'corr(x1, x2) = {np.corrcoef(x1, x2)[0, 1]:.4f}')\n\n# Fit OLS on two bootstrap resamples and compare coefficients\nfor seed in [1, 2]:\n    idx = np.random.default_rng(seed).integers(0, n, size=n)\n    X = np.column_stack([x1[idx], x2[idx]])\n    coef, *_ = np.linalg.lstsq(X, y[idx], rcond=None)\n    pred_err = np.mean((X @ coef - y[idx]) ** 2)\n    print(f'resample {seed}: w1={coef[0]:7.2f}  w2={coef[1]:7.2f}  mse={pred_err:.3f}')\n# Weights swing wildly between resamples (and nearly cancel),\n# while MSE barely moves: predictions stable, interpretation broken."
      },
      {
        lang: 'python',
        label: 'Ensemble variance: correlation between models caps the gain',
        code: "import numpy as np\n\nrng = np.random.default_rng(9)\nsigma, n_models, trials = 1.0, 10, 200_000\n\nfor rho in [0.0, 0.5, 0.9]:\n    # Build n_models errors with pairwise correlation rho\n    shared = rng.normal(size=trials) * np.sqrt(rho)\n    own = rng.normal(size=(trials, n_models)) * np.sqrt(1 - rho)\n    errors = shared[:, None] + own          # each column: one model's error\n    ens_var = errors.mean(axis=1).var()\n    theory = rho * sigma**2 + (1 - rho) * sigma**2 / n_models\n    print(f'rho={rho:.1f}  ensemble var={ens_var:.3f}  theory={theory:.3f}')\n# rho=0.0 -> ~0.10 (full 1/n benefit)\n# rho=0.9 -> ~0.91 (ten models barely better than one)\n# Decorrelating models matters more than adding models."
      }
    ],
    resources: [
      { label: 'StatQuest — covariance and correlation, clearly explained', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Khan Academy — bivariate data and correlation', url: 'https://www.khanacademy.org/math/statistics-probability', kind: 'course' },
      { label: 'An Introduction to Statistical Learning (ch. 3, collinearity)', url: 'https://www.statlearning.com/', kind: 'book' }
    ]
  },
  {
    id: 'random-variables',
    phase: 1,
    phaseName: 'Statistics & Probability',
    orderIndex: 4,
    estimatedMins: 45,
    prerequisites: ['descriptive-statistics'],
    title: 'Random Variables, PMFs & PDFs',
    eli5: 'A random variable is a number that comes from a random process: the number you get when you roll a die, or the exact height of the next person to walk through the door. Die rolls can only be 1-6 (countable outcomes: discrete), heights can be 170.1cm or 170.0001cm (any value in a range: continuous). Discrete variables have a probability for each value; continuous ones have a smooth curve where area under the curve gives probability.',
    analogy: 'A PMF is a vending machine with labeled buttons: each button (value) has a sticker saying how likely it is, and the stickers sum to 1. A PDF is a landscape of rainfall: you cannot ask "how much rain fell on this exact geometric point" (zero — a point has no area), but you can ask "how much fell on this field" — probability lives in regions, and the density tells you where the rain is concentrated.',
    explanation: 'A random variable formalizes "a numeric outcome of a random process." Discrete random variables take countable values (class labels, word tokens, click counts) and are described by a probability mass function (PMF): p(x) = P(X = x), with all values non-negative and summing to 1. Continuous random variables take values in a continuum (weights, temperatures, embedding coordinates) and are described by a probability density function (PDF): probability is the area under the density curve over an interval, and the probability of any exact single value is zero.\n\nThe crucial mental shift is that a density is not a probability. A PDF can exceed 1 (a uniform distribution on [0, 0.1] has density 10), and its values only become probabilities when integrated over a region. The cumulative distribution function (CDF), F(x) = P(X <= x), unifies both worlds and is what samplers, quantiles, and many statistics are actually built from.\n\nMachine learning is full of both types, often in the same model. A classifier outputs a PMF over labels — softmax exists precisely to turn arbitrary scores into a valid PMF. A language model outputs a PMF over the next token. Regression with uncertainty outputs a PDF over the target. VAEs and diffusion models are machines for learning complicated PDFs. When you read "the model learns a distribution," this lesson is what that sentence means.',
    technicalDeep: 'Formally a random variable is a function from outcomes to numbers, but the working toolkit is: PMF p(x) with sum_x p(x) = 1; PDF f(x) >= 0 with integral f(x) dx = 1; CDF F(x) = P(X <= x), which is non-decreasing from 0 to 1, and for continuous variables f(x) = dF/dx. Expectations generalize: E[g(X)] = sum g(x)p(x) or integral g(x)f(x) dx — variance, entropy, and every loss function are instances of this with different g.\n\nTwo operational ideas matter constantly. Inverse-transform sampling: if U is uniform on (0,1), then F^{-1}(U) has CDF F — this is how libraries turn uniform random bits into samples from arbitrary distributions, and quantile functions are exactly F^{-1}. Change of variables: if Y = g(X) with g invertible, the density of Y picks up a Jacobian factor, f_Y(y) = f_X(g^{-1}(y)) * |d g^{-1} / dy|. Densities are not preserved under transformation — this Jacobian is the mathematical core of normalizing flows and the reason "just take the log of the feature" changes the distribution shape.\n\nIn ML practice, log-probabilities are the working currency. Probabilities of long sequences underflow float precision (a 1,000-token sentence with per-token probability 0.1 has probability 10^-1000), so we sum log p rather than multiply p. Cross-entropy loss is a negative mean log-PMF evaluated at the true labels; the log-likelihood of a regression under a Gaussian noise model is a sum of log-PDF values. Numerically, this is why log-sum-exp tricks and log_softmax exist: they compute log-PMFs stably without ever materializing the underflowing probabilities.',
    whatBreaks: 'Treating densities as probabilities produces "probabilities" above 1 and nonsense like comparing a discrete likelihood with a continuous one on the same scale. Multiplying many raw probabilities underflows to exactly 0.0 in float32 within a few dozen factors — every naive Bayes or HMM implementation that skips log-space dies this way. Softmax without the max-subtraction trick overflows exp() for large logits and returns NaN, killing training. Histogram-as-density mistakes: forgetting to normalize by bin width makes shapes incomparable across binnings. And applying a nonlinear transform to a variable while forgetting the Jacobian silently corrupts any density-based method (flows, importance sampling, likelihood evaluation).',
    efficientWay: {
      title: 'Getting Comfortable with Distributions as Objects',
      approaches: [
        {
          name: 'Use scipy.stats hands-on: sample, plot PMF/PDF/CDF, and verify areas and sums numerically',
          verdict: 'best',
          reason: 'Distributions become concrete when you can call .pdf, .cdf, .ppf and check that the pieces agree. Verifying "area under PDF over [a,b] equals CDF(b) - CDF(a)" once beats reading it ten times.'
        },
        {
          name: 'Study measure-theoretic probability (sigma-algebras, Lebesgue integration) first',
          verdict: 'weak',
          reason: 'Beautiful and eventually relevant for research, but it delays practical fluency by months and none of it is needed to build or debug real models.'
        },
        {
          name: 'Learn distributions only through the losses that use them (cross-entropy, MSE)',
          verdict: 'ok',
          reason: 'Efficient for getting started, but without the PMF/PDF foundation you will be confused the first time a density exceeds 1 or a likelihood is positive.'
        }
      ],
      recommendation: 'Spend an hour with scipy.stats: pick one discrete (binomial) and one continuous (normal) distribution, plot PMF/PDF and CDF, verify normalization numerically, sample 10,000 draws and overlay the histogram. Then implement softmax and log_softmax by hand with the stability trick. That is the full practical toolkit for everything downstream.'
    },
    commonMistakes: [
      'Reading a PDF value as a probability — density is probability per unit length and can exceed 1; only areas are probabilities',
      'Asking for P(X = x) of a continuous variable (it is 0) instead of P(x - eps < X < x + eps) or using the CDF',
      'Multiplying raw probabilities across many events instead of summing log-probabilities, causing underflow to zero',
      'Forgetting that histograms must be normalized by bin width to approximate a density, so shapes depend on binning'
    ],
    seniorNotes: 'Senior ML engineers think of model outputs as distributions, not numbers, because every serious downstream decision needs the whole distribution: thresholding a classifier requires the PMF to be calibrated (predicted 0.8 should be right 80 percent of the time — check with reliability diagrams); language-model sampling strategies (temperature, top-k, nucleus) are all surgeries on a PMF; and anomaly detection is literally "flag inputs where the learned density is low." Numerics are a production concern, not pedantry: log-space computation, log-sum-exp, and float64 accumulators for likelihood sums are the difference between a model that trains and one that NaNs at 3am.',
    interviewQuestions: [
      'What is the difference between a PMF and a PDF, and why can a PDF take values greater than 1?',
      'Why do we work with log-probabilities in ML instead of raw probabilities?',
      'What does softmax actually do, and why does the naive implementation fail?'
    ],
    interviewAnswers: [
      'A PMF assigns actual probabilities to countable outcomes: p(x) = P(X = x), summing to 1. A PDF describes a continuous variable, where individual points have probability zero and probability is area: P(a < X < b) is the integral of f over [a, b]. A PDF is probability per unit length, so its height depends on the units and spread — uniform on [0, 0.1] has density 10, and a very narrow Gaussian has a tall peak. Only the constraint "total area = 1" applies, not "height <= 1."',
      'Joint probabilities of many events are products of small numbers, which underflow floating point extremely fast — a 1,000-token sequence at 0.1 per token is 10^-1000, far below float64 minimum. Logs turn products into sums, which stay in a safe numeric range, and they also turn likelihood maximization into a sum-decomposable objective that is friendlier for gradients (sum of per-example terms). Practically, cross-entropy, log-likelihood, ELBOs, and log-sum-exp all exist because of this: never leave log-space until the final answer, if ever.',
      'Softmax maps a real vector of scores to a valid PMF: exponentiate each score and normalize by the sum, so outputs are positive and sum to 1, with larger scores getting larger shares. Naively computing exp(logit) overflows for logits around 89 in float32, giving inf/inf = NaN. The fix is to subtract the maximum logit first — mathematically identical because softmax is shift-invariant — and to use log_softmax (log-sum-exp trick) when the next step is a log, as in cross-entropy.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'PMF vs PDF vs CDF with scipy.stats, verified numerically',
        code: "import numpy as np\nfrom scipy import stats\n\n# Discrete: Binomial(n=10, p=0.3) — PMF sums to 1\nbinom = stats.binom(n=10, p=0.3)\nks = np.arange(0, 11)\nprint(f'PMF sums to: {binom.pmf(ks).sum():.6f}')\nprint(f'P(X = 3)   = {binom.pmf(3):.4f}   # a real probability')\n\n# Continuous: Normal(0, 0.1) — density can exceed 1\nnorm = stats.norm(loc=0, scale=0.1)\nprint(f'pdf(0)     = {norm.pdf(0):.3f}   # ~3.99, NOT a probability')\n\n# Probability is AREA: integrate pdf over [-0.1, 0.1] and compare to CDF\nxs = np.linspace(-0.1, 0.1, 100_001)\narea = np.trapz(norm.pdf(xs), xs)\nprint(f'area under pdf on [-0.1, 0.1] = {area:.4f}')\nprint(f'cdf(0.1) - cdf(-0.1)          = {norm.cdf(0.1) - norm.cdf(-0.1):.4f}')\n\n# Inverse-transform sampling: uniform -> any distribution via ppf (F inverse)\nu = np.random.default_rng(0).uniform(size=100_000)\nsamples = norm.ppf(u)\nprint(f'sampled std = {samples.std():.4f}  (target 0.1)')"
      },
      {
        lang: 'python',
        label: 'Log-space or die: underflow and the stable softmax',
        code: "import numpy as np\n\nrng = np.random.default_rng(2)\n\n# 500 'token probabilities' around 0.1: product underflows, log-sum survives\nprobs = rng.uniform(0.05, 0.15, size=500)\nprint(f'naive product : {np.prod(probs)}')          # 0.0 — underflow\nprint(f'sum of logs   : {np.sum(np.log(probs)):.1f}  # finite, usable')\n\n# Softmax: naive vs stable\nlogits = np.array([1000.0, 1001.0, 999.0])\nnaive = np.exp(logits) / np.exp(logits).sum()        # overflow -> nan\nshifted = logits - logits.max()\nstable = np.exp(shifted) / np.exp(shifted).sum()\nprint(f'naive softmax : {naive}')\nprint(f'stable softmax: {stable.round(4)}')  # a valid PMF, sums to 1"
      }
    ],
    resources: [
      { label: 'Khan Academy — random variables and distributions', url: 'https://www.khanacademy.org/math/statistics-probability', kind: 'course' },
      { label: '3Blue1Brown — why probability of exact values is zero (densities)', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
      { label: 'Mathematics for Machine Learning (ch. 6, probability distributions)', url: 'https://mml-book.github.io/', kind: 'book' }
    ]
  },
  {
    id: 'probability-distributions',
    phase: 1,
    phaseName: 'Statistics & Probability',
    orderIndex: 5,
    estimatedMins: 50,
    prerequisites: ['random-variables'],
    title: 'Common Probability Distributions',
    eli5: 'Distributions are the standard shapes randomness comes in. Coin-flip-style yes/no outcomes counted up make the Binomial shape. Lots of small independent nudges added together make the bell-curve Normal shape — that is why heights and measurement errors look like bells. When every outcome is equally likely, like a fair lottery, that is Uniform: totally flat. Knowing the shapes lets you say "this data looks like coin flips" or "this looks like accumulated noise."',
    analogy: 'Distributions are like standard Lego bricks for randomness. The Bernoulli/Binomial brick models anything that is a yes/no (click or not, fraud or not) and counts of yes. The Normal brick models "many tiny influences summed" (noise, errors). The Uniform brick is the blank tile — "I know the range and nothing else." Choosing a model is choosing which bricks you believe generated your data; choosing wrong is forcing a curved wall out of straight bricks.',
    explanation: 'A parametric distribution is a family of shapes indexed by a few parameters. Bernoulli(p): a single yes/no with success probability p — the model behind every binary label. Binomial(n, p): the count of successes in n independent Bernoullis — clicks in n impressions, defects in n units. Normal(mu, sigma^2): the bell curve, arising whenever many small independent effects add up (the Central Limit Theorem, next lesson), which makes it the default model for noise and measurement error. Uniform(a, b): equal density everywhere in a range — the "maximum ignorance" baseline and the raw material every random number generator starts from.\n\nThe deep point is that choosing a distribution is making an assumption about the process that generated the data. Saying "residuals are Normal" says "the target is the model\'s prediction plus the sum of many small independent influences." Saying "clicks are Binomial" says "each impression is an independent trial with the same click probability." When these generative stories are roughly right, the matching methods (MSE for Gaussian noise, log-loss for Bernoulli labels) are not arbitrary conventions but optimal procedures — a connection made precise in the MLE lesson.\n\nA few more family members matter in ML: Categorical (a die with k faces — the distribution every softmax classifier outputs), Poisson (counts of rare events in a window: arrivals, log lines), Exponential (waiting times between such events), and heavy-tailed laws like the log-normal and Pareto (incomes, file sizes, viral content) where extreme values are far more common than any Gaussian would allow.',
    technicalDeep: 'Reference card. Bernoulli(p): mean p, variance p(1-p) — variance peaks at p = 0.5, which is why uncertain labels are noisiest. Binomial(n, p): mean np, variance np(1-p); it is a sum of Bernoullis, so CLT makes it approximately Normal for large np(1-p). Normal(mu, sigma^2): density (1/(sigma*sqrt(2*pi))) * exp(-(x-mu)^2 / (2*sigma^2)); closed under linear combinations (sums of independent Gaussians are Gaussian — the analytic magic behind Kalman filters, Gaussian processes, and diffusion models); roughly 68/95/99.7 percent of mass within 1/2/3 sigma. Uniform(a, b): mean (a+b)/2, variance (b-a)^2/12; the seed distribution for inverse-transform sampling.\n\nTail behavior is the property that bites hardest in practice. Gaussian tails decay like exp(-x^2): a 6-sigma event is a once-in-500-million rarity, so any Gaussian model treats extremes as impossible. Log-normal and power-law tails decay polynomially: extremes are rare but expected. Fitting a Gaussian to latency, revenue, or social-share data will catastrophically underestimate tail risk. Quick diagnostics: Q-Q plots against a reference distribution, log-log survival plots for power laws, and always plotting on log scale when data spans orders of magnitude.\n\nDistributions connect to ML architecture more than beginners expect. The softmax-cross-entropy pairing is the Categorical likelihood; Poisson regression (exponential of a linear predictor as the rate) is the standard model for counts; diffusion models work by gradually turning data into pure Gaussian noise and learning to reverse it, exploiting the Gaussian\'s closure properties at every step. And the exponential family — the umbrella covering Bernoulli, Binomial, Categorical, Normal, Poisson, Exponential — is why generalized linear models all look the same: linear predictor, link function, family-specific variance.',
    whatBreaks: 'Gaussian assumptions on heavy-tailed data are the classic quiet failure: anomaly detectors using z-scores flag nothing until a 50-sigma "impossible" event wipes out the system (finance has repeatedly relearned this). Binomial models on clustered trials (users who click in bursts, correlated impressions) underestimate variance badly — the independence assumption is doing hidden work — leading to overconfident A/B conclusions. Modeling bounded quantities (rates in [0,1], strictly positive prices) with an unbounded Normal produces predictions outside the feasible range. And forgetting that a Uniform prior is a real assumption, not an absence of assumptions: a Uniform prior on p in [0, 1] behaves differently from a Uniform prior on log-odds, and both influence results at small n.',
    efficientWay: {
      title: 'Learning the Distribution Zoo',
      approaches: [
        {
          name: 'Learn each distribution as a generative story plus a simulation, not a formula',
          verdict: 'best',
          reason: '"Binomial = count of n independent coin flips" plus five lines of numpy that reproduce the histogram is durable knowledge. The formula follows from the story; the reverse never happens.'
        },
        {
          name: 'Memorize the density formulas and moment tables for 20 distributions',
          verdict: 'weak',
          reason: 'Formulas without stories evaporate in weeks and never tell you WHICH distribution fits a new problem — the only question that matters.'
        },
        {
          name: 'Learn only Normal and Bernoulli deeply, look the rest up as needed',
          verdict: 'ok',
          reason: 'Defensible minimalism — those two cover most of ML — but you will misdiagnose count data and heavy tails without at least recognizing Poisson and log-normal shapes.'
        }
      ],
      recommendation: 'For each of Bernoulli, Binomial, Normal, Uniform, Poisson, and log-normal: write one sentence for its generative story, simulate 10,000 draws in numpy, and overlay the scipy PDF/PMF on the histogram. Six stories, six plots. Then take one real dataset column and argue which story fits — that habit of "which process generated this?" is the actual skill.'
    },
    commonMistakes: [
      'Defaulting to Normal for everything — latencies, incomes, and counts are not Gaussian, and the tails are where the damage happens',
      'Using Binomial math on non-independent trials (bursty user behavior), which understates variance and inflates false confidence',
      'Confusing "Uniform prior" with "no assumption" — flat on one scale is curved on another',
      'Checking distribution fit with mean and variance alone instead of Q-Q plots — two distributions can share both moments and differ wildly in tails'
    ],
    seniorNotes: 'Experienced ML engineers treat distributional assumptions as design decisions with failure modes, and they know where each assumption is hiding: MSE hides a Gaussian, log-loss hides a Bernoulli, and most "the metric moved" debates hide an independence assumption. Practical habits: model counts with Poisson or negative-binomial (the latter when variance exceeds the mean, which is almost always in user data), take logs of heavy-tailed features before anything Gaussian-flavored touches them, and stress-test anomaly thresholds against log-normal tails rather than Gaussian ones. In deep learning, the zoo reappears in initialization schemes (Gaussians scaled by fan-in), noise injection, and diffusion schedules — the Gaussian\'s closure under addition is load-bearing infrastructure there.',
    interviewQuestions: [
      'How would you decide whether a dataset column is better modeled as Normal, log-normal, or Poisson?',
      'Why is the Normal distribution such a common choice for modeling noise, and when is that choice dangerous?',
      'An A/B test treats 10,000 impressions as independent Bernoulli trials, but each user contributes many impressions. What goes wrong?'
    ],
    interviewAnswers: [
      'First interrogate the data type and generative story: counts of events in a window suggest Poisson (integer, variance roughly equal to mean — if variance is much larger, negative binomial); strictly positive, right-skewed values spanning orders of magnitude (income, latency, file size) suggest log-normal — take logs and see if it looks Gaussian; symmetric measurements clustered around a center suggest Normal. Then verify visually: histogram on linear and log scales, Q-Q plot against each candidate. Formal tests exist (Kolmogorov-Smirnov) but at large n they reject everything; the plots plus the story are the real decision.',
      'Three reasons: the CLT makes sums of many small independent effects approximately Gaussian, which genuinely describes measurement error and aggregate noise; it is analytically closed under linear operations, making math tractable (least squares, Kalman filters, Gaussian processes); and it is the maximum-entropy distribution for a fixed mean and variance — the least additional assumption given those constraints. It is dangerous when the process has heavy tails (a few huge events dominate: finance, virality, latency) because Gaussian tails assign essentially zero probability to extremes that actually occur, or when effects multiply rather than add (then log-normal is the honest model).',
      'The trials are not independent: impressions from the same user share that user\'s click propensity, so outcomes are positively correlated within user. The effective sample size is closer to the number of users than the number of impressions, and the Binomial variance formula p(1-p)/n understates true variance — sometimes by several fold. Consequences: confidence intervals too narrow, p-values too small, false positives. Fixes: randomize and analyze at the user level, use cluster-robust standard errors, or model per-user rates (e.g. beta-binomial to absorb overdispersion).'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Generative stories: simulate each distribution from its mechanism',
        code: "import numpy as np\nfrom scipy import stats\n\nrng = np.random.default_rng(11)\nN = 100_000\n\n# Binomial = count of successes in n independent Bernoulli trials\nflips = rng.random((N, 20)) < 0.3         # 20 trials, p = 0.3\nbinom_sim = flips.sum(axis=1)\nprint(f'Binomial  sim mean={binom_sim.mean():.3f}  theory={20*0.3:.3f}')\nprint(f'Binomial  sim var ={binom_sim.var():.3f}  theory={20*0.3*0.7:.3f}')\n\n# Normal = sum of many small independent effects (CLT preview)\nnormal_sim = rng.uniform(-1, 1, (N, 50)).sum(axis=1)\nprint(f'Normal    sim skew={stats.skew(normal_sim):.4f}  (bell: ~0)')\n\n# Log-normal = PRODUCT of many small independent effects\nlogn_sim = np.exp(rng.normal(0, 0.3, (N, 20)).sum(axis=1))\nprint(f'LogNormal mean={logn_sim.mean():.2f}  median={np.median(logn_sim):.2f}')\n# mean > median: multiplicative processes are right-skewed\n\n# Poisson = count of rare events: n huge, p tiny, np fixed\npois_sim = (rng.random((N, 10_000)) < 0.0005).sum(axis=1)  # np = 5\nprint(f'Poisson   sim mean={pois_sim.mean():.3f}  var={pois_sim.var():.3f}')\n# mean ~ var ~ 5: the Poisson signature"
      },
      {
        lang: 'python',
        label: 'Tail risk: Gaussian vs log-normal on the same mean and variance',
        code: "import numpy as np\nfrom scipy import stats\n\nrng = np.random.default_rng(5)\n\n# Heavy-tailed 'latency' data (log-normal, ms)\nlatency = rng.lognormal(mean=4.0, sigma=0.8, size=200_000)\nmu, sd = latency.mean(), latency.std()\n\n# Analyst wrongly fits a Gaussian with matching mean/std\ngauss = stats.norm(loc=mu, scale=sd)\n\nthreshold = 1000.0  # ms — the 'impossible' slow request\nempirical = (latency > threshold).mean()\ngaussian_says = 1 - gauss.cdf(threshold)\n\nprint(f'mean={mu:.0f}ms  std={sd:.0f}ms')\nprint(f'P(latency > {threshold:.0f}ms)  empirical: {empirical:.5f}')\nprint(f'P(latency > {threshold:.0f}ms)  gaussian : {gaussian_says:.7f}')\nprint(f'Gaussian underestimates the tail by ~{empirical/gaussian_says:.0f}x')\n# Same mean, same variance — wildly different tails.\n# This is how z-score anomaly detectors miss real disasters."
      }
    ],
    resources: [
      { label: 'StatQuest — the main distributions, one clear video each', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Khan Academy — binomial and normal distributions', url: 'https://www.khanacademy.org/math/statistics-probability', kind: 'course' },
      { label: 'Mathematics for Machine Learning (ch. 6, exponential family)', url: 'https://mml-book.github.io/', kind: 'book' },
      { label: 'Kaggle Learn — practice distributions on real datasets', url: 'https://www.kaggle.com/learn', kind: 'practice' }
    ]
  },
  {
    id: 'central-limit-theorem',
    phase: 1,
    phaseName: 'Statistics & Probability',
    orderIndex: 6,
    estimatedMins: 45,
    prerequisites: ['probability-distributions'],
    title: 'The Central Limit Theorem',
    eli5: 'Roll one die and every number 1-6 is equally likely — a flat shape. Roll two dice and add them: 7 is common, 2 and 12 are rare — a triangle. Roll ten dice and add: the totals form a beautiful bell curve. The Central Limit Theorem says this always happens: add up enough independent random things and the total makes a bell curve, no matter what shape each individual thing had.',
    analogy: 'The CLT is a blender for distributions. Throw in any shape — flat, lumpy, skewed — and the act of averaging many independent scoops blends them into the same smooth bell-shaped result. The blender needs enough scoops (larger n for weirder shapes) and the scoops must be independent — pour in correlated sludge and the blender jams.',
    explanation: 'The Central Limit Theorem: take n independent draws from almost any distribution with mean mu and finite variance sigma^2. The sample mean is then approximately Normal with mean mu and standard deviation sigma / sqrt(n), and the approximation improves as n grows. Two separate miracles are packed in here: the distribution of the average becomes Gaussian regardless of the original shape, and its spread shrinks at the precise rate 1/sqrt(n).\n\nThis explains why Gaussians appear everywhere in nature and in ML. Heights, measurement errors, and aggregate noise are each the sum of many small independent influences — genetic factors, tiny instrument perturbations — so the CLT bells them out. It is not that nature loves Gaussians; it is that nature loves sums, and sums love Gaussians.\n\nFor ML and data work the CLT is a license: it justifies Gaussian-based methods even when the raw data is not Gaussian, because the quantities we actually compute — average losses, average metrics, average gradients, A/B test means — are averages, and averages go Gaussian. Every confidence interval on a model metric, every A/B significance test, every error bar on a benchmark ultimately leans on the CLT. The sqrt(n) rate is equally practical: to halve your error bar you need four times the data, which is why the last decimal of benchmark accuracy is so expensive to trust.',
    technicalDeep: 'Statement: for i.i.d. X1..Xn with E[Xi] = mu and Var(Xi) = sigma^2 < infinity, sqrt(n) * (Xbar - mu) / sigma converges in distribution to N(0, 1). Contrast with the law of large numbers, which only says Xbar converges to mu; the CLT upgrades that to the shape and scale of the fluctuations around mu. The standard error sigma / sqrt(n) — estimated by s / sqrt(n) — is the most-used formula in applied statistics: a 95 percent confidence interval for a mean is approximately Xbar plus or minus 1.96 * s / sqrt(n).\n\nConditions and failure modes deserve equal attention. Independence: correlated draws (time series, multiple events per user) slow or break convergence, and the naive standard error becomes too small — the effective sample size is what matters. Finite variance: power-law distributions with infinite variance (Pareto with alpha <= 2) escape the CLT entirely; their sums converge to non-Gaussian stable laws, and averages remain wild at any n. Skewness: the CLT still applies to skewed data but needs larger n — the Berry-Esseen bound quantifies this, with the error in the Normal approximation shrinking like (skewness-related constant) / sqrt(n). The folk rule "n >= 30" is only honest for mildly skewed data; heavy skew can demand thousands.\n\nIn ML systems the CLT surfaces in specific places: minibatch gradients are averages of per-example gradients, so gradient noise is approximately Gaussian with variance shrinking as batch size grows — a fact used in learning-rate/batch-size scaling heuristics and in analyses of SGD as a stochastic differential equation. The bootstrap complements the CLT when it is shaky: resample your data with replacement, recompute the statistic thousands of times, and read the interval off the resampling distribution — no normality assumption, at the cost of compute. For medians, ratios, and AUCs, the bootstrap is often the more trustworthy tool.',
    whatBreaks: 'Applying t-test/CLT machinery to per-user revenue (extremely skewed, near power-law) at modest n produces confidence intervals that miss the truth far more often than the promised 5 percent — experiments "significant" at day 3 evaporate by day 14. Correlated observations break the sqrt(n): computing the standard error of a time-series mean as if points were independent can understate uncertainty several-fold, and the same trap hits per-impression metrics with per-user correlation. Infinite-variance regimes (some financial returns) make averages themselves unstable — no n rescues them, and the honest move is medians or trimmed means. And the CLT says nothing about the tails of the raw data: it Gaussianizes the mean, not the distribution — modeling raw latencies as Normal "because CLT" is a category error.',
    efficientWay: {
      title: 'Internalizing the CLT',
      approaches: [
        {
          name: 'Simulate it: draw sample means from wild distributions and watch histograms turn Gaussian',
          verdict: 'best',
          reason: 'Fifteen lines of numpy make the theorem undeniable, and varying n and skewness teaches you the honest convergence speed — the part textbooks gloss over.'
        },
        {
          name: 'Study the characteristic-function proof of the CLT',
          verdict: 'weak',
          reason: 'Elegant mathematics, but the proof technique offers nothing for daily ML judgment. Read it once out of curiosity, after the intuition exists.'
        },
        {
          name: 'Learn the n >= 30 rule and the standard-error formula as recipes',
          verdict: 'ok',
          reason: 'The formulas are genuinely the daily tools, but recipes without the simulation experience fail exactly when data is skewed or correlated — the cases that matter.'
        }
      ],
      recommendation: 'Run the simulation with three source distributions — uniform, exponential, and a nasty log-normal — at n = 2, 5, 30, 500. Watch uniform go bell-shaped by n = 5 while the log-normal is still visibly skewed at n = 30. That single picture recalibrates the "n >= 30" folklore forever. Then verify the sqrt(n) law by plotting standard error against n on log-log axes.'
    },
    commonMistakes: [
      'Believing the CLT makes your data Normal — it makes averages of your data Normal; the raw distribution keeps its shape',
      'Trusting n >= 30 universally — heavily skewed metrics like revenue can need thousands of samples before intervals are honest',
      'Using CLT-based standard errors on correlated data (time series, clustered users), understating uncertainty by the correlation factor',
      'Forgetting the finite-variance condition — power-law data with infinite variance never obeys the CLT, and averages stay unstable at any n'
    ],
    seniorNotes: 'In experimentation platforms, the CLT is the engine under every significance test — and senior engineers know exactly where the engine strains: skewed revenue metrics (fix: trimmed/winsorized means, or CUPED plus longer runs), clustered randomization (fix: analyze at the randomization unit, or the delta method for ratio metrics like CTR), and peeking (a sequential-testing problem, not a CLT problem, but they compound). For model evaluation, the professional habit is error bars on every reported metric: a benchmark accuracy of 84.2 vs 84.6 on 1,000 test examples is a coin flip (standard error is about 1.2 points), and knowing that prevents entire teams from chasing noise. When the statistic is awkward — median latency, AUC, per-slice deltas — reach for the bootstrap instead of forcing CLT formulas.',
    interviewQuestions: [
      'State the CLT precisely and explain what it does and does not say about your raw data.',
      'Your A/B test metric is revenue per user, which is extremely skewed. How does this affect the validity of a t-test, and what would you do?',
      'Why does the standard error shrink as 1/sqrt(n), and what does that imply about the cost of more precise estimates?'
    ],
    interviewAnswers: [
      'For i.i.d. samples with finite mean mu and variance sigma^2, the standardized sample mean sqrt(n)(Xbar - mu)/sigma converges in distribution to a standard Normal — equivalently, Xbar is approximately N(mu, sigma^2/n) for large n. It speaks only about the sampling distribution of averages (and sums): the raw data distribution is untouched and can stay as skewed or multimodal as it likes. It also requires independence and finite variance, and it is an asymptotic statement — convergence speed depends on skewness, so "large n" is context-dependent, not a fixed 30.',
      'The t-test relies on the sample mean being approximately Gaussian. With extreme skew, that approximation is poor at typical n: intervals are miscalibrated (often anti-conservative on the side that matters) and a few whale users can single-handedly flip significance. Mitigations: run longer to earn more effective n; winsorize or trim the metric (declare the trade-off openly); use CUPED with pre-period revenue to slash variance; check robustness with a bootstrap confidence interval; and consider a rank-based test (Mann-Whitney) as a sanity check, noting it answers a slightly different question. Also verify independence — revenue per user is fine if randomization is per user, but per-session metrics with per-user correlation need cluster-aware analysis.',
      'The variance of a mean of n i.i.d. draws is sigma^2/n because variances of independent terms add while the 1/n^2 from averaging divides — so the standard deviation is sigma/sqrt(n). The implication is a brutal cost curve: each halving of the error bar costs 4x the data; a 10x precision gain costs 100x. This is why experiments are sized before launch (power analysis), why variance-reduction tricks like CUPED are worth real engineering effort, and why chasing the last 0.1 percent difference between models requires test sets far larger than people expect.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Watch any distribution turn Gaussian when averaged',
        code: "import numpy as np\nfrom scipy import stats\n\nrng = np.random.default_rng(21)\ntrials = 20_000\n\nsources = {\n    'uniform    ': lambda size: rng.uniform(0, 1, size),\n    'exponential': lambda size: rng.exponential(1.0, size),\n    'lognormal  ': lambda size: rng.lognormal(0, 1.5, size),  # nasty skew\n}\n\nfor name, draw in sources.items():\n    print(f'--- source: {name} (raw skew = '\n          f'{stats.skew(draw(200_000)):.2f})')\n    for n in [2, 5, 30, 500]:\n        means = draw((trials, n)).mean(axis=1)\n        print(f'  n={n:>4}: skew of sample means = {stats.skew(means):+.3f}')\n# Uniform is bell-shaped by n=5. The skewed lognormal is STILL\n# noticeably non-Gaussian at n=30 — the folk rule is not universal."
      },
      {
        lang: 'python',
        label: 'The sqrt(n) law and a CLT confidence interval, verified',
        code: "import numpy as np\n\nrng = np.random.default_rng(8)\npop_mean, pop_std = 5.0, 2.0\n\n# 1) Standard error shrinks like 1/sqrt(n)\nfor n in [100, 400, 1600, 6400]:\n    means = rng.gamma(shape=6.25, scale=0.8, size=(50_000, n)).mean(axis=1)\n    print(f'n={n:>5}  SE(sim)={means.std():.4f}  '\n          f'theory={pop_std/np.sqrt(n):.4f}')\n# Quadrupling n halves the standard error, every time.\n\n# 2) Do 95% CIs actually cover the truth 95% of the time?\nn, covered = 400, 0\nfor _ in range(10_000):\n    sample = rng.gamma(shape=6.25, scale=0.8, size=n)\n    se = sample.std(ddof=1) / np.sqrt(n)\n    lo, hi = sample.mean() - 1.96 * se, sample.mean() + 1.96 * se\n    covered += (lo <= pop_mean <= hi)\nprint(f'CI coverage: {covered/10_000:.3f}  (target 0.950)')"
      }
    ],
    resources: [
      { label: '3Blue1Brown — the Central Limit Theorem, visualized', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
      { label: 'StatQuest — CLT and standard errors, clearly explained', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Khan Academy — sampling distributions unit', url: 'https://www.khanacademy.org/math/statistics-probability', kind: 'course' }
    ]
  },
  {
    id: 'conditional-probability',
    phase: 1,
    phaseName: 'Statistics & Probability',
    orderIndex: 7,
    estimatedMins: 45,
    prerequisites: ['random-variables'],
    title: 'Conditional Probability',
    eli5: 'What is the chance a random person is a professional basketball player? Tiny. But what if I first tell you the person is over 7 feet tall? Now the chance is much bigger. Conditional probability is how chances change when you learn something. Every prediction works this way: "given what I know about this email, what is the chance it is spam?"',
    analogy: 'Conditioning is zooming into one slice of a map. P(rain) asks about the whole country; P(rain | you are in Mumbai in July) throws away the rest of the map and recomputes chances inside that slice — where rain is nearly certain. All prediction is map-slicing: a model takes the features you give it, zooms into the slice of the world matching those features, and reports the odds inside the slice.',
    explanation: 'Conditional probability P(A | B) is the probability of A once you know B happened: P(A | B) = P(A and B) / P(B). The division is a renormalization — B becomes your new universe, and probabilities are recomputed relative to it. Learning information means shrinking the universe and rescaling.\n\nThis is the mathematical shape of prediction itself. A supervised model is an approximation of a conditional distribution: a classifier estimates P(label | features), a language model estimates P(next token | previous tokens), a recommender estimates P(click | user, item). Training data provides samples from the joint distribution of features and labels; the model\'s whole job is to extract the conditional. When you grasp this, "machine learning" stops being a bag of algorithms and becomes one repeated question: what is the conditional distribution, and how do we estimate it?\n\nTwo companion concepts complete the toolkit. Independence: A and B are independent when P(A | B) = P(A) — knowing B teaches you nothing about A; this is the assumption behind naive Bayes and behind every "multiply the probabilities" shortcut. The law of total probability: P(A) = sum over scenarios of P(A | scenario) * P(scenario) — the weighted-average rule that lets you compute an overall rate from per-slice rates, and the source of aggregation paradoxes when slices differ in size.',
    technicalDeep: 'From the definition follow the two workhorses. Chain rule: P(A, B, C) = P(A) * P(B | A) * P(C | A, B) — any joint distribution factors into a cascade of conditionals, in any order. Autoregressive language models are the chain rule made silicon: P(sentence) = product over t of P(token_t | tokens before t). Law of total probability: partition the world into disjoint scenarios B1..Bk, then P(A) = sum of P(A | Bi) * P(Bi). Together with Bayes\' theorem (next lesson), these three identities are most of applied probability.\n\nConditional independence is the subtler, more load-bearing idea: A and B are conditionally independent given C when P(A, B | C) = P(A | C) * P(B | C). Naive Bayes assumes all features are conditionally independent given the class — wrong in detail, useful in practice. Graphical models are entire architectures built from conditional-independence statements: a Bayesian network is a directed graph whose missing edges declare which conditionals simplify, and Markov models assume the future is conditionally independent of the past given the present. Crucially, conditional independence neither implies nor is implied by marginal independence: two features can be dependent overall yet independent within each class, and — more treacherously — independent overall yet dependent once you condition (collider/selection effects: among admitted students, test scores and essay quality look negatively correlated even if independent in the population, because admission selected on their sum).\n\nSimpson\'s paradox is the law of total probability weaponized: a treatment can win inside every subgroup yet lose overall, because subgroup sizes differ between arms. The classic Berkeley admissions data showed higher male acceptance overall while most departments accepted women at equal-or-higher rates — women applied to more selective departments. For ML this is a daily hazard: aggregate metrics can move opposite to every per-slice metric, and observational feature-outcome correlations can invert once you condition on a confounder. Conditioning is also the doorway to causal reasoning: P(outcome | treatment observed) is not P(outcome | treatment imposed), and telling those apart is the entire subject of causal inference.',
    whatBreaks: 'Confusing P(A | B) with P(B | A) — the prosecutor\'s fallacy — corrupts real decisions: P(positive test | disease) = 99 percent feels like P(disease | positive test) = 99 percent, but with a rare disease the latter can be under 10 percent. Assuming independence where correlation lives multiplies probabilities into fiction — this exact error (treating housing defaults as independent) sat inside the 2008 CDO risk models. Simpson\'s paradox silently flips dashboard conclusions when traffic mix shifts between segments. And selection effects manufacture fake correlations: any dataset filtered on an outcome (admitted students, surviving companies, approved loans) contains conditional dependencies that do not exist in the population your model will face.',
    efficientWay: {
      title: 'Making Conditioning Second Nature',
      approaches: [
        {
          name: 'Compute conditionals from concrete count tables and pandas groupbys before touching formulas',
          verdict: 'best',
          reason: 'With natural frequencies ("of 1,000 emails, 300 are spam; of those, 240 contain FREE...") conditional probability is just filtering and dividing counts — the formula becomes obvious rather than memorized.'
        },
        {
          name: 'Drill formula manipulation (chain rule, total probability) with abstract symbol exercises',
          verdict: 'ok',
          reason: 'The identities must eventually be automatic — the chain rule especially — but symbols before counts produces people who can derive and still fall for the prosecutor\'s fallacy.'
        },
        {
          name: 'Rely on intuition and skip the formalism since "conditioning is just filtering"',
          verdict: 'weak',
          reason: 'Unaided intuition reliably fails on inverse probabilities, Simpson\'s paradox, and selection effects — the three most expensive mistakes in this topic.'
        }
      ],
      recommendation: 'Take a real dataset (Titanic works perfectly) and compute a dozen conditionals with groupby: P(survived), P(survived | female), P(survived | female, third class). Then deliberately build a Simpson\'s paradox from the same data. One afternoon of counting beats a semester of symbol-pushing, and afterward the formulas read as descriptions of what you already did.'
    },
    commonMistakes: [
      'Swapping P(A | B) for P(B | A) — the direction of conditioning matters enormously when base rates are uneven',
      'Multiplying probabilities of correlated events as if independent, drastically underestimating joint risks',
      'Comparing aggregate rates across groups with different composition — Simpson\'s paradox territory — instead of slicing first',
      'Forgetting that filtering a dataset on any outcome creates conditional dependencies (selection bias) absent in the full population'
    ],
    seniorNotes: 'Senior ML engineers read every model as a conditional distribution and every metric as a conditional expectation, which changes how they debug: "the model is bad" becomes "P(label | features) is poorly estimated on THIS slice," and slice-based evaluation becomes the default rather than an afterthought. They are paranoid about conditioning direction in analytics (churned users used feature X vs feature-X users churned), about mix shift when dashboards move (always decompose a metric change into per-segment changes plus composition change), and about training-data filters (models trained only on approved/served/clicked items inherit collider distortions). In LLM work, the chain rule is the product itself: prompting is literally engineering the conditioning context.',
    interviewQuestions: [
      'A test for a disease affecting 1 in 1,000 people has 99 percent sensitivity and 95 percent specificity. A random person tests positive — what is the chance they have the disease, roughly, and why does intuition fail here?',
      'What is conditional independence, and where does naive Bayes use it? Why does the method work despite the assumption being false?',
      'Explain Simpson\'s paradox with an example, and describe how it shows up in ML metric dashboards.'
    ],
    interviewAnswers: [
      'Use natural frequencies over 100,000 people: about 100 have the disease and roughly 99 test positive; of the 99,900 healthy, 5 percent — about 4,995 — also test positive. So positives total about 5,094, of whom 99 are sick: P(disease | positive) is roughly 2 percent. Intuition fails because people equate P(positive | disease) = 99 percent with P(disease | positive), ignoring the base rate: true positives are drawn from a tiny pool while false positives are drawn from an enormous one. The general lesson: inverse conditional probabilities are linked through base rates, which is exactly Bayes\' theorem.',
      'A and B are conditionally independent given C when, once C is known, B adds no further information about A: P(A | B, C) = P(A | C). Naive Bayes assumes every feature is conditionally independent of every other given the class, so the class-conditional likelihood factorizes into a product of per-feature terms — turning an intractable joint estimation into d simple one-dimensional estimates. It works despite falsity because classification only needs the argmax over classes to be right, not the probabilities: the factorized model often ranks the true class first even while its confidence values are badly miscalibrated (typically overconfident, since correlated evidence gets double-counted).',
      'Simpson\'s paradox: an association reverses when data is aggregated versus split by a lurking variable. Berkeley admissions is canonical — men were admitted at higher rates overall, yet within most departments women did as well or better; women applied disproportionately to competitive departments, so composition drove the aggregate. In ML dashboards this appears whenever traffic mix shifts: a new model can improve accuracy on every user segment yet show worse overall accuracy because the hard segment grew; or overall CTR rises purely because easy inventory increased. The professional defense is decomposition: report per-slice metrics alongside the aggregate and attribute any aggregate move to within-slice change versus mix change.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Conditionals as filtered counts, plus a Simpson\'s paradox',
        code: "import numpy as np\nimport pandas as pd\n\nrng = np.random.default_rng(4)\n\n# Simulate a helpdesk: two agents, two ticket difficulties\nn = 20_000\ndifficulty = rng.choice(['easy', 'hard'], size=n, p=[0.5, 0.5])\n# Agent A gets mostly hard tickets, Agent B mostly easy ones\nagent = np.where(\n    difficulty == 'hard',\n    rng.choice(['A', 'B'], size=n, p=[0.8, 0.2]),\n    rng.choice(['A', 'B'], size=n, p=[0.2, 0.8]))\n# Agent A is BETTER at both difficulties\np_solve = {('A', 'easy'): 0.95, ('B', 'easy'): 0.90,\n           ('A', 'hard'): 0.55, ('B', 'hard'): 0.50}\nsolved = np.array([rng.random() < p_solve[(a, d)]\n                   for a, d in zip(agent, difficulty)])\n\ndf = pd.DataFrame({'agent': agent, 'difficulty': difficulty, 'solved': solved})\n\nprint('P(solved | agent) — aggregate:')\nprint(df.groupby('agent')['solved'].mean().round(3))\nprint()\nprint('P(solved | agent, difficulty) — sliced:')\nprint(df.groupby(['difficulty', 'agent'])['solved'].mean().round(3))\n# Aggregate says B looks better; every slice says A is better.\n# Composition (who gets hard tickets) drives the reversal."
      },
      {
        lang: 'python',
        label: 'The chain rule: scoring a sequence like a language model',
        code: "import numpy as np\n\n# Toy bigram model over a 4-word vocabulary\nvocab = ['<s>', 'the', 'cat', 'sat']\n# P(next | current): rows = current word, cols = next word\nP = np.array([\n    # <s>   the   cat   sat\n    [0.00, 0.90, 0.05, 0.05],   # after <s>\n    [0.00, 0.05, 0.75, 0.20],   # after 'the'\n    [0.00, 0.10, 0.05, 0.85],   # after 'cat'\n    [0.40, 0.40, 0.10, 0.10],   # after 'sat'\n])\nidx = {w: i for i, w in enumerate(vocab)}\n\ndef sequence_logprob(words):\n    # Chain rule: log P(w1..wn) = sum of log P(w_t | w_{t-1})\n    total = 0.0\n    prev = '<s>'\n    for w in words:\n        total += np.log(P[idx[prev], idx[w]])\n        prev = w\n    return total\n\nfor seq in [['the', 'cat', 'sat'], ['cat', 'the', 'sat']]:\n    lp = sequence_logprob(seq)\n    print(f'{\" \".join(seq):<15} log P = {lp:7.3f}   P = {np.exp(lp):.5f}')\n# Every LLM is this idea scaled up: a product of conditionals,\n# computed in log-space, with a transformer estimating each factor."
      }
    ],
    resources: [
      { label: '3Blue1Brown — Bayes and conditional probability, geometrically', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
      { label: 'Khan Academy — conditional probability and independence', url: 'https://www.khanacademy.org/math/statistics-probability', kind: 'course' },
      { label: 'StatQuest — conditional probability walkthroughs', url: 'https://www.youtube.com/@statquest', kind: 'video' }
    ]
  },
  {
    id: 'bayes-theorem',
    phase: 1,
    phaseName: 'Statistics & Probability',
    orderIndex: 8,
    estimatedMins: 50,
    prerequisites: ['conditional-probability'],
    title: "Bayes' Theorem",
    eli5: 'You think your friend rarely lies — maybe 1 time in 100. Then you catch their story contradicting a photo. Bayes\' theorem is the recipe for updating your belief: you start with what you believed before (the prior), weigh how surprising the new evidence would be if they were lying versus honest, and end with an updated belief (the posterior). It is math for changing your mind by exactly the right amount.',
    analogy: 'Bayes\' theorem is a courtroom. The prior is the presumption before evidence. Each exhibit is weighed by its likelihood ratio: how much more consistent is this evidence with guilt than innocence? Strong priors need strong evidence to overturn — a single grainy photo should not convict, and a single spammy word should not condemn an email from your boss. The verdict (posterior) becomes the prior for the next exhibit.',
    explanation: 'Bayes\' theorem inverts conditional probabilities: P(H | E) = P(E | H) * P(H) / P(E). In words — posterior = likelihood times prior, divided by evidence. Its power is that the two directions of conditioning are usually not equally accessible: it is easy to know how often spam contains the word FREE, P(word | spam); what you want at prediction time is the reverse, P(spam | word). Bayes is the bridge, and the base rate P(spam) is the toll — ignore it and you get the base-rate fallacy from the previous lesson.\n\nThe spam filter is the canonical worked example. Prior: 30 percent of mail is spam. Likelihoods: FREE appears in 40 percent of spam but 2 percent of legitimate mail. A message containing FREE: posterior = 0.4 * 0.3 / (0.4 * 0.3 + 0.02 * 0.7) = 0.12 / 0.134, roughly 90 percent spam. Naive Bayes stacks this update across all words, multiplying likelihood ratios (in log-space) as if words were conditionally independent given the class — historically the first serious spam-filtering technology, and still a strong baseline for text.\n\nBeyond the formula lies a worldview: Bayesian inference treats unknown parameters themselves as uncertain quantities with distributions. You start with a prior over parameters, observe data, and obtain a posterior — beliefs about parameters after evidence. This gives ML a principled language for uncertainty: instead of "the conversion rate is 3.2 percent," a Bayesian answer is "the conversion rate is probably between 2.9 and 3.5 percent, with this exact distribution." Uncertainty-aware ML — A/B testing with credible intervals, Thompson sampling in bandits, Bayesian optimization for hyperparameters — is this worldview in production.',
    technicalDeep: 'Mechanics: the evidence term P(E) = sum over hypotheses of P(E | H_i) P(H_i) is just the law of total probability and acts as a normalizer, so Bayes is often used in proportional form: posterior proportional to likelihood times prior. The odds form is the cleanest for intuition and for stacking evidence: posterior odds = prior odds times the likelihood ratio (Bayes factor). In log-odds, updates become additive — log posterior odds = log prior odds + sum of log likelihood ratios — which is precisely the linear functional form of logistic regression and explains why naive Bayes and logistic regression are siblings (generative vs discriminative estimates of the same log-odds).\n\nSequential updating is built in: today\'s posterior is tomorrow\'s prior, and for i.i.d. evidence the result is order-independent. Conjugate priors make this loop closed-form: a Beta(a, b) prior on a coin\'s bias updated with k heads in n flips yields Beta(a + k, b + n - k) — the parameters are literally pseudo-counts of imagined prior flips. Beta-Bernoulli, Gamma-Poisson, and Normal-Normal conjugacies power real-time systems (bandits, click-rate estimation) because updates are arithmetic, not integration. As data grows, the likelihood overwhelms any fixed prior and Bayesian and frequentist answers converge; with little data, the prior dominates — which is a feature: it is exactly the regularization that keeps small-sample estimates sane (a Beta(2,2) prior stops a 1-for-1 item from being scored as 100 percent).\n\nThe bridge to ML training: maximum a posteriori (MAP) estimation picks the posterior mode, maximizing log-likelihood plus log-prior. A Gaussian prior on weights makes the log-prior a negative L2 penalty — ridge regression IS MAP with a Gaussian prior; a Laplace prior gives L1/lasso. Weight decay in deep learning is a prior in disguise. Full Bayesian inference (keeping the whole posterior rather than its mode) is usually intractable and is approximated with MCMC or variational inference — the ELBO objective of a VAE is variational Bayes — while cheaper uncertainty proxies (deep ensembles, MC dropout) approximate the posterior predictive in production systems.',
    whatBreaks: 'Ignoring the prior wrecks decisions wherever base rates are skewed: a 99-percent-accurate fraud model firing on 0.1-percent-prevalent fraud produces mostly false alarms, and teams that read alert confidence as posterior probability drown their analysts. Zero-probability likelihoods are fatal in naive Bayes — one unseen word makes an entire class impossible forever; Laplace smoothing exists precisely to ban zeros. Double-counting correlated evidence (naive Bayes\' sin) yields absurdly overconfident posteriors — the same information multiplied in twice. Bad priors mislead at small n and, more subtly, "uninformative" priors are not assumption-free (flat on p is not flat on log-odds). And Bayesian updating is only as sound as the likelihood model: garbage P(E | H) in, confidently wrong posterior out.',
    efficientWay: {
      title: 'Learning Bayes Deeply',
      approaches: [
        {
          name: 'Work in natural frequencies and 2x2 count tables, then build a tiny naive Bayes spam filter from scratch',
          verdict: 'best',
          reason: 'Counts make the base-rate logic transparent, and implementing the spam filter — priors, likelihoods, log-space, smoothing — forces every concept through your fingers in an afternoon.'
        },
        {
          name: 'Start with Bayesian statistics frameworks (PyMC, Stan) and full posterior inference',
          verdict: 'ok',
          reason: 'Powerful tools you may genuinely want later, but MCMC machinery on top of shaky fundamentals produces cargo-cult Bayesians. Earn the formula first.'
        },
        {
          name: 'Memorize the formula and practice plug-in textbook problems',
          verdict: 'weak',
          reason: 'The formula is trivial; the skill is recognizing prior, likelihood, and evidence in a messy real situation — plug-in drills never build that.'
        }
      ],
      recommendation: 'Three exercises in order: (1) solve the medical-test problem with a 100,000-person count table until the base-rate effect feels obvious; (2) build a naive Bayes spam classifier in numpy with Laplace smoothing and log-space scoring; (3) simulate Beta-Binomial updating on a coin, plotting the posterior sharpening as flips accumulate. Together they cover Bayes as a formula, as an algorithm, and as a worldview.'
    },
    commonMistakes: [
      'Dropping the prior — reading a model\'s likelihood-flavored score as the posterior probability of the event, disastrous under class imbalance',
      'Allowing zero-count likelihoods in naive Bayes instead of smoothing, letting one unseen feature veto an entire class',
      'Treating correlated features as independent evidence, double-counting information and producing absurd overconfidence',
      'Believing a flat prior means "no assumptions" — uniformity depends on parameterization, and at small n every prior speaks'
    ],
    seniorNotes: 'Bayes shows up in senior ML work less as a formula and more as a discipline about base rates and uncertainty. Concretely: alert and moderation systems are tuned in posterior terms (precision at operating threshold given true prevalence), not raw model confidence; cold-start estimation uses conjugate pseudo-counts (a Beta prior on new-item CTR) so fresh items are neither buried nor absurdly boosted; Thompson sampling — sample from each arm\'s posterior, act greedily on the sample — is often the simplest production-grade bandit and is pure sequential Bayes. Seniors also recognize regularization as priors (weight decay = Gaussian prior), which demystifies hyperparameters: choosing lambda is choosing how strongly you believe weights should be small. And in LLM-era evaluation, base-rate awareness returns constantly: a 95-percent-accurate hallucination detector run on mostly-correct outputs still yields majority-false alarms.',
    interviewQuestions: [
      'Derive the spam-filter posterior: 30 percent of email is spam, FREE appears in 40 percent of spam and 2 percent of ham. A message contains FREE — what is P(spam)?',
      'How does naive Bayes classify text, and what are its two classic failure modes and their fixes?',
      'What is the relationship between regularization and Bayesian priors?'
    ],
    interviewAnswers: [
      'Bayes: P(spam | FREE) = P(FREE | spam) P(spam) / P(FREE). Numerator: 0.4 * 0.3 = 0.12. Evidence by total probability: 0.4 * 0.3 + 0.02 * 0.7 = 0.12 + 0.014 = 0.134. Posterior: 0.12 / 0.134, approximately 0.896 — about 90 percent. Worth narrating the structure: prior odds are 3:7; the likelihood ratio of FREE is 0.4/0.02 = 20; posterior odds = 20 * 3/7 = 60/7, and 60/67 is about 0.896. The odds form shows how evidence strength (20x) and base rate (3:7) combine.',
      'Naive Bayes picks the class maximizing log P(class) + sum over words of log P(word | class), estimating each per-word likelihood by counting word frequencies within each class — the conditional-independence assumption turns an impossible joint estimation into counting. Failure mode one: zero counts — a word never seen in a class makes that class\'s probability exactly zero regardless of other evidence; fix with Laplace (add-one or add-alpha) smoothing. Failure mode two: correlated features — near-duplicate words get counted as independent evidence, producing wildly overconfident posteriors; mitigations include feature pruning, and in practice treating naive Bayes scores as rankings rather than calibrated probabilities (or recalibrating with Platt scaling / isotonic regression).',
      'MAP estimation maximizes log-likelihood plus log-prior, so any additive regularizer can be read as a log-prior on parameters. A zero-mean Gaussian prior on weights gives a penalty proportional to the sum of squared weights — exactly ridge regression / weight decay, with the regularization strength lambda equal to the noise-to-prior variance ratio; a Laplace prior gives the L1 penalty of lasso, whose sharp peak at zero is why it produces exact sparsity. This correspondence has practical force: regularization strength encodes prior belief about parameter scale, its effect fades as data grows (likelihood outweighs prior), and wanting uncertainty rather than a point estimate means going beyond MAP to the posterior — via MCMC, variational inference, or ensembles as a rough approximation.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Naive Bayes spam filter from scratch (counts, smoothing, log-space)',
        code: "import numpy as np\n\n# Tiny corpus: (text, label)\ndocs = [\n    ('free money win prize now', 1), ('win free entry claim prize', 1),\n    ('free offer limited claim now', 1), ('meeting agenda for monday', 0),\n    ('lunch plans this week', 0), ('project deadline moved monday', 0),\n    ('claim your free prize now', 1), ('agenda notes and deadline', 0),\n]\n\nvocab = sorted({w for text, _ in docs for w in text.split()})\nw_idx = {w: i for i, w in enumerate(vocab)}\n\n# Count word occurrences per class\ncounts = np.zeros((2, len(vocab)))\nclass_docs = np.zeros(2)\nfor text, y in docs:\n    class_docs[y] += 1\n    for w in text.split():\n        counts[y, w_idx[w]] += 1\n\n# Laplace smoothing: add 1 to every count so nothing is impossible\nalpha = 1.0\nlog_likelihood = np.log((counts + alpha) /\n                        (counts.sum(axis=1, keepdims=True) + alpha * len(vocab)))\nlog_prior = np.log(class_docs / class_docs.sum())\n\ndef classify(text):\n    scores = log_prior.copy()   # start from the prior\n    for w in text.split():\n        if w in w_idx:\n            scores += log_likelihood[:, w_idx[w]]  # add log evidence\n    post = np.exp(scores - scores.max())\n    post /= post.sum()\n    return post  # [P(ham), P(spam)]\n\nfor msg in ['free prize claim now', 'monday meeting agenda', 'free lunch monday']:\n    p = classify(msg)\n    print(f'{msg:<25} P(spam) = {p[1]:.3f}')"
      },
      {
        lang: 'python',
        label: 'Sequential Bayesian updating: Beta posterior for a conversion rate',
        code: "import numpy as np\nfrom scipy import stats\n\nrng = np.random.default_rng(13)\ntrue_rate = 0.04              # unknown in real life\nprior_a, prior_b = 2, 50      # prior belief: rates are usually a few percent\n\na, b = prior_a, prior_b\nfor batch in range(1, 6):\n    visitors = 200\n    conversions = rng.binomial(visitors, true_rate)\n    a += conversions                 # posterior update is just\n    b += visitors - conversions      # adding counts (conjugacy)\n\n    post = stats.beta(a, b)\n    lo, hi = post.ppf(0.025), post.ppf(0.975)\n    print(f'after {batch*200:>4} visitors: '\n          f'mean={post.mean():.4f}  95% CI=({lo:.4f}, {hi:.4f})')\n\nprint(f'true rate: {true_rate}')\n# The interval tightens around the truth as evidence accumulates;\n# early on, the prior keeps the estimate from swinging wildly.\n# This exact pattern powers Thompson-sampling bandits in production."
      }
    ],
    resources: [
      { label: '3Blue1Brown — Bayes theorem, the geometry of changing beliefs', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
      { label: 'StatQuest — Bayes and naive Bayes, clearly explained', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Khan Academy — Bayes theorem practice problems', url: 'https://www.khanacademy.org/math/statistics-probability', kind: 'course' },
      { label: 'Mathematics for Machine Learning (ch. 6 and 9, Bayesian view)', url: 'https://mml-book.github.io/', kind: 'book' }
    ]
  },
  {
    id: 'maximum-likelihood',
    phase: 1,
    phaseName: 'Statistics & Probability',
    orderIndex: 9,
    estimatedMins: 60,
    prerequisites: ['probability-distributions', 'bayes-theorem'],
    title: 'Maximum Likelihood Estimation (MLE)',
    eli5: 'You find a coin, flip it 10 times, and get 7 heads. What is the coin\'s true heads-chance? MLE answers: whichever value makes what you actually saw most likely — here, 0.7. That is the whole idea: try every possible setting of the dials, and keep the setting under which your data would have been least surprising. Training a neural network is this exact game with millions of dials.',
    analogy: 'MLE is detective work in reverse. Each suspect (parameter value) implies a story about how the crime scene (data) would look. The detective asks of each suspect: "if you did it, how plausible is this exact scene?" — and arrests the suspect whose story fits best. The likelihood function is the plausibility score of every suspect, and training a model is interrogating millions of suspects with gradient descent.',
    explanation: 'Maximum likelihood estimation is THE principle for fitting parameters to data. Given a model that assigns a probability (or density) to data as a function of parameters theta, the likelihood L(theta) is the probability of the observed dataset viewed as a function of theta. MLE picks the theta maximizing it. Because products of many probabilities are numerically hopeless, we maximize the log-likelihood — a sum over data points — or equivalently minimize the negative log-likelihood (NLL). That reframing is the punchline of this whole phase: a loss function is a negative log-likelihood in disguise.\n\nHere is the key insight, worked in both directions. Assume your regression targets are the model\'s prediction plus Gaussian noise: y = f(x) + noise, noise ~ Normal(0, sigma^2). Write the NLL: each point contributes (y - f(x))^2 / (2 sigma^2) plus a constant. Minimizing NLL is minimizing the sum of squared errors — MSE is not an arbitrary choice; it is EXACTLY maximum likelihood under Gaussian noise. Now assume binary labels are Bernoulli with probability p = model output: the NLL per point is -[y log p + (1-y) log(1-p)] — which is precisely binary cross-entropy. Every mainstream loss is an assumed noise model wearing a mask: MSE = Gaussian, MAE = Laplace, cross-entropy = Bernoulli/Categorical, Poisson loss = Poisson counts.\n\nThis transforms how you think about training. "Choosing a loss" becomes "declaring a probabilistic story about how targets deviate from predictions," and loss-function debugging becomes assumption-checking: if MSE behaves badly on your data, the Gaussian story is wrong (heavy tails? try Laplace/MAE; counts? try Poisson). It also unifies the field: linear regression, logistic regression, deep networks, and language models (next-token cross-entropy) are all the same procedure — maximize the log-probability of data under a parameterized distribution.',
    technicalDeep: 'The mechanics: log-likelihood ell(theta) = sum over i of log p(x_i; theta) for i.i.d. data. Setting the derivative to zero gives estimators in closed form for simple models: the Bernoulli MLE is the sample frequency k/n; the Gaussian MLEs are the sample mean and the variance with divisor n (biased — Bessel\'s 1/(n-1) correction fixes it, a first hint that MLE is imperfect at small n). For models without closed forms — logistic regression onward — we do numerical optimization on the NLL, which is exactly what deep learning frameworks do: autograd on a log-probability.\n\nThe Gaussian-to-MSE derivation in full: NLL = sum_i [(y_i - f(x_i))^2 / (2 sigma^2)] + n log(sigma sqrt(2 pi)). With sigma fixed, argmin over f is argmin of sum (y_i - f(x_i))^2 — MSE, with the noise variance setting the scale of the loss. The Bernoulli-to-cross-entropy derivation: likelihood = product p_i^{y_i} (1-p_i)^{1-y_i}; NLL = -sum [y_i log p_i + (1-y_i) log(1-p_i)]. The categorical version gives softmax cross-entropy. There is also an information-theoretic reading: maximizing average log-likelihood is minimizing the KL divergence from the empirical data distribution to the model distribution — MLE fits the model distribution to the data distribution in KL, and cross-entropy is named for exactly this.\n\nProperties worth knowing: under regularity conditions the MLE is consistent (converges to the truth), asymptotically efficient (lowest possible variance among consistent estimators, the Cramer-Rao bound), and asymptotically Gaussian with covariance given by the inverse Fisher information — the curvature of the log-likelihood, which is why sharp likelihood peaks mean confident estimates. Failure modes: at small n MLE overfits (a coin seen once landing heads gets p-hat = 1); the remedy is MAP — add a log-prior, i.e. regularize — connecting back to the Bayes lesson: weight decay is a Gaussian prior tempering the MLE. Some likelihoods are unbounded or multimodal (Gaussian mixtures: a component collapsing onto one point sends the likelihood to infinity), which is why EM needs variance floors and restarts.',
    whatBreaks: 'MLE with a wrong noise model inherits every pathology of that model: MSE on heavy-tailed targets lets outliers dominate the fit (one corrupted label bends the whole regression — the Gaussian story says huge residuals are impossible, so the optimizer moves mountains to shrink them); cross-entropy on mislabeled data forces the model to fit label noise with growing confidence. Small-n MLE is overconfident: zero-frequency estimates poison downstream products (the naive Bayes zero problem is an MLE artifact). Perfect separation makes logistic-regression MLE diverge — weights grow without bound pushing probabilities to 0/1; regularization (MAP) restores a finite answer. And numerically, likelihood work outside log-space underflows immediately, while mixture-model likelihoods can blow up to infinity via variance collapse.',
    efficientWay: {
      title: 'Making MLE Click',
      approaches: [
        {
          name: 'Derive MSE and cross-entropy from their noise models by hand once, then verify by plotting and optimizing likelihoods in numpy/scipy',
          verdict: 'best',
          reason: 'These are two short derivations — ten lines each — and they permanently change how you read every loss function. The numerical verification (scipy.optimize recovering true parameters) makes it concrete.'
        },
        {
          name: 'Study the asymptotic theory (Fisher information, Cramer-Rao, efficiency proofs) first',
          verdict: 'weak',
          reason: 'Real theory, wrong order: efficiency proofs mean nothing until the likelihood-loss connection is visceral. Return to Fisher information when you care about error bars on parameters.'
        },
        {
          name: 'Trust the framework: use nn.MSELoss and nn.CrossEntropyLoss and skip the origins',
          verdict: 'ok',
          reason: 'You can ship models this way — most people do — but you lose the ability to design losses for nonstandard targets (counts, quantiles, censored data), which is exactly where seniors earn their title.'
        }
      ],
      recommendation: 'The one-week plan: day one, coin-flip MLE by grid search — plot the likelihood curve, see the peak at k/n. Day two, derive MSE from Gaussian NLL on paper. Day three, derive binary cross-entropy from Bernoulli NLL. Day four, use scipy.optimize.minimize on a NLL to fit a distribution and recover known parameters. Day five, break it: fit MSE to data with outliers, switch to Laplace NLL (MAE), watch the fit repair itself. After that week, loss functions are never mysterious again.'
    },
    commonMistakes: [
      'Treating loss functions as arbitrary conventions instead of noise-model declarations — then being surprised when MSE buckles under heavy-tailed targets',
      'Maximizing raw likelihood instead of log-likelihood and hitting underflow, or comparing likelihood values across different dataset sizes without normalizing',
      'Trusting MLE point estimates at tiny n — the 1-flip coin with p-hat = 1 problem — instead of adding a prior (smoothing / regularization)',
      'Confusing likelihood with probability: L(theta) is a function of parameters with data fixed; it need not integrate to 1 over theta and its absolute value is meaningless — only comparisons and curvature matter'
    ],
    seniorNotes: 'The MLE lens is the closest thing ML has to a unified theory, and seniors use it daily without ceremony: reading an unfamiliar loss, they ask "what distribution is this the NLL of?" — which instantly reveals the assumptions and the failure modes. Designing models for nonstandard targets becomes mechanical: counts get Poisson or negative-binomial NLL, always-positive skewed targets get log-normal or Gamma NLL, ETAs needing asymmetric risk get quantile (pinball) loss. Two production-grade insights follow directly: label smoothing and confidence penalties are ways of softening the Bernoulli/Categorical MLE\'s drive toward certainty, and predicted-variance heads (heteroscedastic regression — the model outputs both mean and sigma) fall straight out of writing the Gaussian NLL with sigma as a function of x. LLM training is pure MLE at scale: next-token cross-entropy is the NLL of the chain-rule factorization, and perplexity is exponentiated NLL.',
    interviewQuestions: [
      'Show that minimizing MSE is equivalent to maximum likelihood under Gaussian noise. What does this imply when the noise is not Gaussian?',
      'Where does binary cross-entropy come from? Derive it from a probabilistic assumption.',
      'Your logistic regression training diverges — weights grow without bound — on a small, cleanly separated dataset. Explain why through the MLE lens and fix it.'
    ],
    interviewAnswers: [
      'Assume y_i = f(x_i; theta) + eps_i with eps_i i.i.d. Normal(0, sigma^2). The likelihood of the data is the product of Gaussian densities at the residuals; the negative log-likelihood is sum_i (y_i - f(x_i))^2 / (2 sigma^2) plus terms free of theta. With sigma fixed, minimizing NLL is exactly minimizing the sum of squared residuals — so least squares IS the MLE under Gaussian noise. Implication: when noise is non-Gaussian, MSE is the wrong MLE. Heavy tails (outliers) call for Laplace noise, whose NLL is MAE, or Huber as a compromise; multiplicative noise calls for MSE on logs; count noise calls for Poisson NLL. The loss should be chosen by asking what the residual distribution actually looks like.',
      'Model each binary label as Bernoulli: P(y_i | x_i) = p_i^{y_i} (1 - p_i)^{1 - y_i}, where p_i is the model output. The dataset likelihood is the product over i; taking negative logs gives NLL = -sum_i [y_i log p_i + (1 - y_i) log(1 - p_i)] — which is binary cross-entropy, term for term. So BCE is not a heuristic: it is the exact MLE objective for probabilistic binary classification, and its famous property of punishing confident wrong predictions (log of a near-zero probability) is inherited from the Bernoulli likelihood. The multiclass version with a Categorical likelihood yields softmax cross-entropy identically.',
      'With linearly separable data, the Bernoulli likelihood can be pushed arbitrarily close to 1: scaling the weight vector up makes every predicted probability approach 0 or 1 on the correct side, so the NLL strictly decreases forever and the MLE does not exist — the optimizer chases weights to infinity. The MLE lens makes the fix obvious: add a prior. L2 regularization (MAP with a Gaussian prior) adds a quadratic penalty that guarantees a finite optimum; even tiny lambda suffices. Alternatives with the same effect: label smoothing (targets of 0.99/0.01 bound the achievable likelihood) or early stopping. It is worth noting this is a data-regime issue, not a bug — it appears exactly when data is small or dimensionality high relative to n.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'MLE three ways: grid search, closed form, and scipy.optimize',
        code: "import numpy as np\nfrom scipy import optimize, stats\n\nrng = np.random.default_rng(17)\n\n# --- 1) Coin flips: likelihood curve peaks at k/n ---\nflips = rng.random(50) < 0.7      # true p = 0.7\nk, n = flips.sum(), len(flips)\nps = np.linspace(0.01, 0.99, 981)\nlog_lik = k * np.log(ps) + (n - k) * np.log(1 - ps)\nprint(f'grid-search MLE p = {ps[np.argmax(log_lik)]:.3f}   closed form k/n = {k/n:.3f}')\n\n# --- 2) Gaussian: MLE of mu is the sample mean ---\ndata = rng.normal(loc=3.0, scale=1.5, size=1000)\nprint(f'Gaussian MLE mu = {data.mean():.3f}  sigma = {data.std():.3f}')\n\n# --- 3) Numerical MLE for a Gamma distribution (no simple closed form) ---\ntrue_shape, true_scale = 2.5, 1.2\nsamples = rng.gamma(true_shape, true_scale, size=5000)\n\ndef neg_log_lik(params):\n    shape, scale = params\n    if shape <= 0 or scale <= 0:\n        return np.inf\n    return -np.sum(stats.gamma.logpdf(samples, a=shape, scale=scale))\n\nres = optimize.minimize(neg_log_lik, x0=[1.0, 1.0], method='Nelder-Mead')\nprint(f'Gamma MLE: shape={res.x[0]:.3f} (true {true_shape}), '\n      f'scale={res.x[1]:.3f} (true {true_scale})')\n# Deep learning training is case 3 with a million parameters and autograd."
      },
      {
        lang: 'python',
        label: 'Losses ARE noise models: MSE vs MAE under outliers',
        code: "import numpy as np\nfrom scipy import optimize\n\nrng = np.random.default_rng(23)\n\n# True line y = 2x + 1 with Gaussian noise...\nx = np.linspace(0, 10, 200)\ny = 2 * x + 1 + rng.normal(0, 1, size=200)\n# ...plus 5 corrupted labels (sensor glitch)\ny[rng.choice(200, 5, replace=False)] += 80\n\ndef fit(loss):\n    def objective(w):\n        resid = y - (w[0] * x + w[1])\n        if loss == 'mse':      # Gaussian noise NLL\n            return np.mean(resid ** 2)\n        else:                  # Laplace noise NLL -> MAE\n            return np.mean(np.abs(resid))\n    return optimize.minimize(objective, x0=[0.0, 0.0], method='Nelder-Mead').x\n\nw_mse = fit('mse')\nw_mae = fit('mae')\nprint(f'true params      : slope=2.000  intercept=1.000')\nprint(f'MSE fit (Gaussian): slope={w_mse[0]:.3f}  intercept={w_mse[1]:.3f}')\nprint(f'MAE fit (Laplace) : slope={w_mae[0]:.3f}  intercept={w_mae[1]:.3f}')\n# MSE is dragged toward the outliers because the Gaussian story says\n# an 80-unit residual is 'impossible'. The Laplace story shrugs at it.\n# Changing the loss = changing your assumed noise distribution."
      }
    ],
    resources: [
      { label: 'StatQuest — maximum likelihood, clearly explained', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Mathematics for Machine Learning (ch. 8-9, models via MLE)', url: 'https://mml-book.github.io/', kind: 'book' },
      { label: 'An Introduction to Statistical Learning (ch. 4, likelihood-based models)', url: 'https://www.statlearning.com/', kind: 'book' },
      { label: 'Imperial College — Mathematics for Machine Learning specialization', url: 'https://www.coursera.org/specializations/mathematics-machine-learning', kind: 'course' }
    ]
  },
  {
    id: 'hypothesis-testing',
    phase: 1,
    phaseName: 'Statistics & Probability',
    orderIndex: 10,
    estimatedMins: 50,
    prerequisites: ['central-limit-theorem'],
    title: 'Hypothesis Testing & A/B Tests',
    eli5: 'Your friend claims their "lucky coin" lands heads more often. You flip it 100 times and get 58 heads. Is the coin special, or is 58 just normal luck for a fair coin? Hypothesis testing answers by asking: "if the coin were perfectly fair, how often would 100 flips give a result at least this extreme?" If that would be really rare — say under 5 percent of the time — you start believing the coin is special. That rarity number is the p-value.',
    analogy: 'A hypothesis test is a criminal trial for an idea. The null hypothesis ("nothing is happening") sits in the defendant\'s chair, presumed innocent. Your data is the evidence. The p-value asks: could an innocent defendant plausibly produce this evidence? Only when the evidence would be truly bizarre under innocence do you convict. Crucially, "not guilty" is not "proven innocent" — failing to reject the null never proves the null.',
    explanation: 'Hypothesis testing is the discipline for separating real effects from luck. You set up a null hypothesis H0 (the boring default: the coin is fair, the new model is no better, the button color does not matter) and an alternative H1. You compute a test statistic from the data and ask: if H0 were true, how surprising would a result at least this extreme be? That tail probability is the p-value. Below a pre-chosen threshold alpha (conventionally 0.05), you "reject the null" and call the effect statistically significant.\n\nThe p-value is the single most misread number in science, so nail the definition: it is P(data at least this extreme | H0 is true) — NOT P(H0 is true | data). A p-value of 0.03 does not mean a 3 percent chance the null is true; converting evidence into belief about hypotheses requires priors — that is Bayes\' territory. Confidence intervals are the more informative twin: a 95 percent CI gives the range of effect sizes compatible with the data, simultaneously conveying magnitude and uncertainty, where a p-value collapses everything to one bit.\n\nA/B testing is hypothesis testing running the modern internet. Randomly split users into control (A) and treatment (B), ship the change to B, and test whether the metric difference exceeds what chance would produce. Randomization is what buys causality — it severs every confounder by making the groups statistically identical before treatment. The operational discipline matters as much as the math: fix the metric, the sample size (via power analysis), and the analysis plan BEFORE launching; run to the planned n; and resist the deadly temptation to peek at p-values daily and stop the moment significance appears — that practice alone can quintuple your false-positive rate.',
    technicalDeep: 'The standard two-sample machinery: for means, the t-statistic is (mean_B - mean_A) / SE of the difference, with SE = sqrt(s_A^2/n_A + s_B^2/n_B) (Welch\'s test — the default; classic Student\'s t assumes equal variances for no good reason). Under H0 and CLT conditions the statistic is approximately t/Normal, and the p-value is a tail area. For proportions (conversion rates), the two-proportion z-test or a chi-square test on the 2x2 table. Everything inherits the CLT\'s conditions: independence (randomize and analyze at the same unit — users, not pageviews) and enough effective n for skewed metrics.\n\nError taxonomy and power: Type I error (false positive) has rate alpha by construction; Type II error (false negative) has rate beta, and power = 1 - beta is the probability of detecting a real effect of a given size. Power grows with effect size and n, shrinks with variance. Power analysis inverts the relationship: to detect a given minimum effect with 80 percent power at alpha = 0.05, you need approximately n = 16 sigma^2 / delta^2 per arm (the "rule of 16"). Practical consequence: small effects on noisy metrics need astonishing sample sizes — a 1 percent relative lift on a metric with coefficient of variation 3 needs hundreds of thousands of users per arm. Underpowered experiments are not neutral: conditional on reaching significance, an underpowered test grossly exaggerates the effect size (the winner\'s curse).\n\nThe two failure industries: multiple comparisons and peeking. Test 20 metrics at alpha = 0.05 and the chance of at least one false positive is 1 - 0.95^20, about 64 percent; corrections include Bonferroni (divide alpha by the number of tests — blunt but safe) and Benjamini-Hochberg (controls the false discovery rate — the standard for metric dashboards). Peeking is sequential multiple testing: checking a running experiment daily and stopping at the first p < 0.05 inflates the false-positive rate far above 5 percent because you give noise many chances to cross the line. Legitimate sequential methods exist — group-sequential boundaries (O\'Brien-Fleming), always-valid p-values / confidence sequences (mSPRT, used by several experimentation platforms) — and mature orgs build one of them into the platform rather than trusting humans not to peek.',
    whatBreaks: 'Peeking with naive p-values quietly turns a 5 percent false-positive guarantee into 20-40 percent — teams ship neutral changes believing them wins, and the metric "regresses" after launch (it was never up). Randomizing at one unit and analyzing at another (user-randomized, pageview-analyzed) shreds independence and produces overconfident intervals. The winner\'s curse poisons roadmaps: underpowered tests that do reach significance systematically overstate effects, so launch forecasts based on experiment lifts persistently disappoint. Sample-ratio mismatch — arms that should be 50/50 landing at 50.4/49.6 — signals broken randomization or differential data loss and invalidates the whole test (check it with a chi-square before reading any metric). And statistically significant is not practically significant: with millions of users, a p of 0.001 can accompany an effect too small to pay for the feature\'s maintenance.',
    efficientWay: {
      title: 'Learning Testing Without the Folklore',
      approaches: [
        {
          name: 'Simulate the null: generate no-effect experiments in numpy and watch p-values, peeking, and multiple testing behave and misbehave',
          verdict: 'best',
          reason: 'Seeing p-values distribute uniformly under H0, then watching the peeking simulation hit "significance" 25 percent of the time with zero true effect, inoculates you better than any lecture.'
        },
        {
          name: 'Learn the test-selection flowchart (t vs z vs chi-square vs Mann-Whitney) as the core skill',
          verdict: 'ok',
          reason: 'You do need the right test, but test selection is the easy 10 percent; the failures that cost companies money are peeking, power, and unit-of-analysis errors, which the flowchart never mentions.'
        },
        {
          name: 'Trust the experimentation dashboard and read the significance stars',
          verdict: 'weak',
          reason: 'Dashboards happily compute valid-looking p-values on invalid designs. Without understanding, you cannot spot sample-ratio mismatch, unit mismatch, or a peeked result.'
        }
      ],
      recommendation: 'Three simulations, one afternoon: (1) 10,000 null A/A tests — verify p-values are uniform and exactly 5 percent fall under 0.05; (2) the same with daily peeking and optional stopping — watch false positives triple or worse; (3) power: inject a real 2 percent lift and see how often n = 500 vs n = 50,000 detects it. Then do one real power analysis for a hypothetical product change. These four exercises are the entire practical core of the subject.'
    },
    commonMistakes: [
      'Reading the p-value as the probability the null is true, or 1 - p as the probability the effect is real — it is neither; it conditions on H0, not on the data',
      'Peeking: monitoring a live test and stopping at the first significant reading, which massively inflates false positives',
      'Ignoring power: declaring "no effect" from an underpowered test, or trusting the exaggerated effect size of an underpowered win',
      'Testing many metrics/segments and reporting the significant ones without multiple-comparison correction — guaranteed false discoveries at scale'
    ],
    seniorNotes: 'In mature product orgs, experimentation is an engineered system with guardrails, because humans cannot be trusted with raw p-values: platforms enforce pre-registered metrics and sample sizes, compute sequential-safe statistics (mSPRT or group-sequential boundaries) so "peeking" is mathematically legal, auto-check sample-ratio mismatch, and apply FDR control across metric dashboards. Seniors reviewing an experiment ask, in order: was randomization at the analysis unit? was the sample size planned and reached? is SRM clean? is the effect size practically meaningful with an honest CI, and does the launch decision survive the winner\'s-curse haircut? For ML specifically: comparing models on a shared test set is also a hypothesis test — a 0.3 percent accuracy gap on 5,000 examples is noise, use paired tests (McNemar or bootstrap over examples) since both models see the same data, and re-using one test set across dozens of model iterations is multiple testing against a fixed benchmark — the quiet source of much leaderboard overfitting.',
    interviewQuestions: [
      'Define the p-value precisely and explain the most common misinterpretation. Why do confidence intervals often communicate more?',
      'Your PM checks the A/B dashboard every morning and wants to stop the test the first day p < 0.05. What do you tell them?',
      'How do you determine how long an A/B test needs to run? Walk through a power analysis.'
    ],
    interviewAnswers: [
      'The p-value is the probability, computed assuming the null hypothesis is true, of observing a test statistic at least as extreme as the one obtained. It is a statement about the data given H0 — not about H0 given the data. The canonical misreading, "p = 0.03 means 97 percent chance the effect is real," is wrong because converting to a belief about hypotheses requires a prior (Bayes); with implausible hypotheses and multiple testing, most p < 0.05 findings can still be false. Confidence intervals communicate more because they carry the effect size and its uncertainty: a CI of [+0.1 percent, +0.3 percent] says "real but tiny — maybe not worth shipping," while [-2 percent, +9 percent] says "inconclusive but potentially large — keep testing." The p-value alone cannot distinguish those worlds.',
      'Explain that daily checks with optional stopping inflate false positives severely: under a true null, the running p-value is a random walk that gets many chances to dip below 0.05, so stopping at the first dip can turn a nominal 5 percent error rate into 20-40 percent — wins that later "disappear" in production. Offer the constructive paths: fix the sample size via power analysis up front and read the result once at the end; or, better, use a sequential method designed for continuous monitoring (always-valid p-values / mSPRT, or group-sequential boundaries like O\'Brien-Fleming), which allow legal early stopping with controlled error. Most modern experimentation platforms support one of these — the PM can peek all they want if the statistics are built for peeking.',
      'Four inputs: the minimum detectable effect worth acting on (from business context, e.g. a 2 percent relative lift), the metric\'s variance (from historical data), alpha (usually 0.05, two-sided), and desired power (usually 0.8). Then n per arm is approximately 16 sigma^2 / delta^2 for the rule-of-thumb case. Convert n to duration using traffic, respecting two floors: run at least one full week (ideally two) to average over day-of-week effects, and never stop mid-cycle. Sanity checks: if required duration is months, the effect is too small to test as-is — reach for variance reduction (CUPED), a more sensitive proxy metric, or a bigger treatment. Also state the unit: n counts randomization units (users), and clustered metrics need effective-sample-size adjustments.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'A/B test end to end: t-test, CI, and a power check',
        code: "import numpy as np\nfrom scipy import stats\n\nrng = np.random.default_rng(31)\n\n# Simulated experiment: control converts at 4.0%, treatment at 4.4%\nn = 25_000\ncontrol = rng.random(n) < 0.040\ntreatment = rng.random(n) < 0.044\n\np_a, p_b = control.mean(), treatment.mean()\ndiff = p_b - p_a\nse = np.sqrt(p_a*(1-p_a)/n + p_b*(1-p_b)/n)\nz = diff / se\np_value = 2 * (1 - stats.norm.cdf(abs(z)))\nci = (diff - 1.96*se, diff + 1.96*se)\n\nprint(f'control {p_a:.4f} vs treatment {p_b:.4f}')\nprint(f'lift={diff:+.4f}  p={p_value:.4f}  95% CI=({ci[0]:+.4f}, {ci[1]:+.4f})')\n\n# Power: how often would this design detect the true 0.4pt lift?\ndetections = 0\nfor _ in range(2000):\n    a = rng.random(n) < 0.040\n    b = rng.random(n) < 0.044\n    d = b.mean() - a.mean()\n    s = np.sqrt(a.mean()*(1-a.mean())/n + b.mean()*(1-b.mean())/n)\n    detections += abs(d / s) > 1.96\nprint(f'power at n={n:,} per arm: {detections/2000:.2f}')\n# If power is only ~0.6, a 'no significant difference' result is\n# more likely ignorance than evidence of no effect."
      },
      {
        lang: 'python',
        label: 'Why peeking is cheating: false-positive inflation, simulated',
        code: "import numpy as np\nfrom scipy import stats\n\nrng = np.random.default_rng(37)\n\ndef run_null_experiment(n_days=14, users_per_day=2000):\n    # NO true effect: both arms convert at exactly 5%\n    a = rng.random((n_days, users_per_day)) < 0.05\n    b = rng.random((n_days, users_per_day)) < 0.05\n    peeked_significant = False\n    for day in range(1, n_days + 1):\n        ca, cb = a[:day].ravel(), b[:day].ravel()\n        se = np.sqrt(ca.mean()*(1-ca.mean())/ca.size +\n                     cb.mean()*(1-cb.mean())/cb.size)\n        if se > 0 and abs((cb.mean() - ca.mean()) / se) > 1.96:\n            peeked_significant = True   # PM stops the test here\n            break\n    # Disciplined analyst: one look at the end\n    se = np.sqrt(a.mean()*(1-a.mean())/a.size + b.mean()*(1-b.mean())/b.size)\n    final_significant = abs((b.mean() - a.mean()) / se) > 1.96\n    return peeked_significant, final_significant\n\nresults = np.array([run_null_experiment() for _ in range(2000)])\nprint(f'false positive rate, peek daily + stop early: {results[:, 0].mean():.3f}')\nprint(f'false positive rate, single planned analysis: {results[:, 1].mean():.3f}')\n# Planned analysis: ~0.05 as promised. Daily peeking: ~3-5x worse —\n# with zero real effect. This is why platforms use sequential statistics."
      }
    ],
    resources: [
      { label: 'StatQuest — p-values, power, and hypothesis testing series', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Khan Academy — significance tests and confidence intervals', url: 'https://www.khanacademy.org/math/statistics-probability', kind: 'course' },
      { label: 'Google ML Crash Course — experimentation and metrics mindset', url: 'https://developers.google.com/machine-learning/crash-course', kind: 'course' },
      { label: 'Kaggle Learn — practice with real experiment-style data', url: 'https://www.kaggle.com/learn', kind: 'practice' }
    ]
  },
  {
    id: 'regression-statistics',
    phase: 1,
    phaseName: 'Statistics & Probability',
    orderIndex: 11,
    estimatedMins: 60,
    prerequisites: ['maximum-likelihood', 'variance-covariance'],
    title: 'Linear & Logistic Regression as Statistics',
    eli5: 'Linear regression draws the best straight line through a cloud of points, so you can predict a number: "a 1,200 square-foot house costs about this much." Logistic regression answers yes/no questions with a confidence: "this email is 92 percent likely spam." They look like just two more algorithms, but they are the two atoms of machine learning — almost everything bigger, including neural networks, is built by stacking and bending these two ideas.',
    analogy: 'Linear regression is a taut rubber sheet stretched through data points — each point pulls with force proportional to squared distance, and the sheet settles where the pulls balance (that is why one far-away outlier drags it so hard). Logistic regression is a dimmer switch on a doorway: features push the switch up or down in log-odds, and the S-curve translates the switch position into a probability of walking through. A neural network is thousands of these dimmer switches wired into each other.',
    explanation: 'Everything in this phase converges here. Linear regression is the statistical model y = w dot x + b + noise, with noise ~ Normal(0, sigma^2) — in words: the target is a linear function of features plus Gaussian randomness. From the MLE lesson, maximizing likelihood under this story is exactly minimizing MSE; from the descriptive-statistics lesson, the fitted model estimates the conditional mean E[y | x]. Linear regression is not "an algorithm that happens to use squared error" — it is continuous prediction under a declared Gaussian noise model, and every diagnostic (residual plots, prediction intervals) is a check of that declaration.\n\nLogistic regression is the same move for binary outcomes: model P(y = 1 | x) = sigmoid(w dot x + b), i.e. the log-odds are linear in the features. The Bernoulli likelihood from the MLE lesson gives cross-entropy as the training objective; the Bayes lesson\'s log-odds accounting explains the functional form — each feature contributes additively in evidence space, and exp(w_j) is an odds ratio: the multiplicative change in odds per unit of feature j. It is a probabilistic classifier first and a decision rule second: the model outputs calibrated probabilities (when its assumptions hold), and thresholding them is a separate, business-driven choice.\n\nThese two models are the gateways to all of ML. A neural network for regression is linear regression with learned features: the final layer is literally w dot h + b with an MSE (Gaussian) loss. A neural classifier ends in logistic regression on learned features: linear layer, sigmoid/softmax, cross-entropy. GLMs generalize the pair to Poisson counts and beyond; regularized versions (ridge, lasso) are their MAP siblings. Master these two — assumptions, diagnostics, failure modes — and deep learning becomes "the same statistics with a feature extractor bolted on."',
    technicalDeep: 'Linear regression mechanics: stacking data into matrix X, the least-squares solution is w-hat = (X^T X)^{-1} X^T y — the projection of y onto the column space of X. The Gauss-Markov theorem says OLS is the best linear unbiased estimator under exogeneity, homoscedasticity, and uncorrelated errors; add Gaussian errors and you get exact inference: standard errors from sigma^2 (X^T X)^{-1}, t-tests on coefficients, and prediction intervals. Each classical assumption maps to a named ML failure: nonlinearity (underfitting — fix with feature engineering or nonlinear models), heteroscedastic noise (point predictions fine, intervals wrong — fix with weighted least squares or predicted-variance heads), correlated errors (time series — intervals badly overconfident), collinearity (unstable coefficients, the variance-covariance lesson — fix with ridge), and outliers vs high-leverage points (the rubber-sheet problem — diagnose with residual and leverage plots, fix with Huber or data cleaning). R-squared measures variance explained, and adjusted R-squared penalizes free parameters; neither certifies causality or correctness.\n\nLogistic regression mechanics: log-odds ell(x) = w dot x + b; p = 1 / (1 + exp(-ell)). The NLL (cross-entropy) is convex, so optimization finds the global optimum — one of the few honest guarantees in ML. The gradient has the beautiful form X^T (p - y): error times features, identical in shape to the linear-regression gradient, because both are exponential-family GLMs with canonical links. No closed form exists; iteratively reweighted least squares or gradient methods fit it. Coefficients are log-odds-ratios, the decision boundary w dot x + b = 0 is a hyperplane, and perfect separation makes the MLE diverge (the MLE lesson\'s pathology) — regularization fixes it.\n\nEvaluation and calibration close the loop with the rest of the phase. For probabilistic classifiers, threshold-free quality is measured by log-loss and ROC-AUC (rank quality), while precision/recall at a chosen threshold is a product decision driven by base rates and error costs — a fraud model at 0.1 percent prevalence lives at a completely different threshold than 0.5. Calibration — do predicted 0.8s come true 80 percent of the time? — is checked with reliability diagrams; well-specified logistic regression is naturally calibrated, while boosted trees and deep nets typically are not and need Platt scaling (which is literally fitting a logistic regression on the scores) or isotonic regression. Class imbalance folklore ("always downsample") is usually miscalibration folklore: downsampling shifts the intercept by a known log-odds offset, and you can correct it analytically instead of mangling the data.',
    whatBreaks: 'Extrapolation: a linear model trained on 500-2,000 sqft homes cheerfully prices a 20,000 sqft mansion — linearly, and absurdly; polynomial features make extrapolation explosively worse. Omitted-variable bias flips coefficient signs: ice-cream sales "cause" drownings until temperature enters the model — reading observational coefficients causally is the most common analytical injury in industry. Heteroscedasticity and correlated errors do not bias predictions but silently invalidate every interval and p-value the model reports. In logistic land: perfect separation sends weights to infinity; unregularized fits on wide data (many features, few rows) memorize noise; and threshold-at-0.5-by-default deploys a fraud model that flags nothing because prevalence is 0.3 percent. Finally, evaluating a probabilistic classifier by accuracy alone on imbalanced data — the 99-percent-accurate model that predicts "not fraud" always — remains the industry\'s most reliable self-own.',
    efficientWay: {
      title: 'Learning the Two Gateway Models',
      approaches: [
        {
          name: 'Implement both from scratch in numpy (closed form + gradient descent), then break each assumption on purpose and watch the diagnostics catch it',
          verdict: 'best',
          reason: 'Fifty lines total. Writing X^T(p - y) yourself and then injecting outliers, collinearity, and separation teaches more than any course — you will recognize every failure in production because you have manufactured each one.'
        },
        {
          name: 'Learn them through sklearn with attention to the docs and metrics',
          verdict: 'ok',
          reason: 'Fine for shipping, and you should know the library — but sklearn hides the likelihood, the gradient, and the assumptions, which are exactly the parts that transfer to deep learning.'
        },
        {
          name: 'Skim them as "toy models" and rush to gradient boosting and neural nets',
          verdict: 'weak',
          reason: 'The standard self-taught mistake. Without the statistical reading of these two models, deep learning stays a bag of incantations — and you will be out-debugged by people who learned the atoms first.'
        }
      ],
      recommendation: 'Build both in numpy: linear regression via the normal equations AND gradient descent (verify they agree), logistic regression via gradient descent on cross-entropy. Then run the sabotage suite: add one huge outlier (watch MSE bend), duplicate a feature (watch coefficients destabilize), separate the classes perfectly (watch weights diverge), and fix each with the statistical remedy — Huber, ridge, regularization. Finish by fitting the same models in sklearn and matching numbers. That is one weekend, and it is the best-value weekend in this entire course.'
    },
    commonMistakes: [
      'Interpreting regression coefficients as causal effects in observational data — omitted variables and collinearity make signs and magnitudes treacherous',
      'Judging classifiers by accuracy under class imbalance instead of log-loss/AUC plus precision-recall at a business-chosen threshold',
      'Trusting the default 0.5 threshold — the optimal threshold depends on base rates and asymmetric error costs, and rarely equals 0.5',
      'Ignoring residual diagnostics: heteroscedasticity and autocorrelation leave predictions okay but make every reported interval and p-value fictional',
      'Fitting unregularized logistic regression on wide or separable data and shipping the divergent, overconfident result'
    ],
    seniorNotes: 'Senior ML engineers keep these two models in production far more than outsiders expect: they are interpretable, calibrated, cheap to serve, trivially monitorable, and a properly feature-engineered logistic regression remains a brutal baseline that many deep models fail to beat on tabular problems. The senior playbook: always fit the linear/logistic baseline FIRST — it sets the floor, surfaces data bugs (leakage shows up as a suspiciously perfect coefficient), and its coefficients act as a sanity check on feature semantics. In the deep-learning era the payoff compounds: the last layer of every network IS one of these models, so intuitions about calibration, separation, log-odds, and regularization transfer directly — temperature scaling an LLM head and Platt-scaling a GBM are both "fit a tiny logistic regression on top." And when stakeholders demand "why did the model say no," an odds-ratio table from a logistic model is still the gold standard of explainability that survives legal review.',
    interviewQuestions: [
      'Why is linear regression "prediction under Gaussian noise," and which of its classical assumptions matter for prediction versus for inference?',
      'Explain logistic regression as a statistical model: where does the sigmoid come from, and what exactly do the coefficients mean?',
      'You deploy a logistic-regression fraud model and it flags almost nothing, despite good AUC offline. Diagnose.'
    ],
    interviewAnswers: [
      'The model asserts y = w dot x + b + eps with eps ~ N(0, sigma^2): predictions plus Gaussian scatter. MLE under this story is least squares, and the fit estimates E[y | x]. For pure prediction, the load-bearing assumptions are correct functional form (linearity in the features you chose) and stable data distribution — violations mean biased predictions. The other classical assumptions — homoscedasticity, uncorrelated errors, Gaussian errors — barely affect point predictions but entirely control inference: standard errors, coefficient p-values, and prediction intervals are all derived from them, so heteroscedastic or autocorrelated residuals make the intervals fiction while the predictions stay usable. That split — what breaks predictions versus what breaks uncertainty statements — is the practical way to remember the assumption list.',
      'Model the log-odds of the positive class as linear: log(p / (1 - p)) = w dot x + b. Inverting that relationship IS the sigmoid — it is not an arbitrary squashing choice but the inverse of the log-odds link, the canonical link for the Bernoulli exponential family. Training maximizes the Bernoulli likelihood, i.e. minimizes cross-entropy, which is convex with gradient X^T (p - y). Each coefficient w_j is a log-odds ratio: one unit of feature j multiplies the odds by exp(w_j), holding other features fixed — with the usual caveat that "holding fixed" is shaky under collinearity, and coefficients are causal only if the features are exogenous. The output is a probability estimate; the decision threshold is a separate cost-sensitive choice.',
      'Work through the probabilistic pipeline. First suspect the threshold: with fraud prevalence around 0.1-1 percent, calibrated probabilities rarely exceed 0.5, so the default threshold flags nothing even when ranking (AUC) is good — pick the threshold from the precision-recall trade-off at business costs, not 0.5. Second, check calibration and any train-time resampling: if the training set was rebalanced (downsampled negatives) without correcting the intercept, every predicted probability is inflated or deflated by a known log-odds offset — fix analytically (subtract log of the sampling ratio from the intercept) or recalibrate on unsampled data. Third, confirm base-rate consistency between offline evaluation and production traffic (prior shift moves the optimal threshold). The unifying point: AUC measures ranking, deployment operates on thresholded probabilities — connecting them is a statistics exercise, and this failure is almost never "the model is bad."'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Both gateway models from scratch in numpy',
        code: "import numpy as np\n\nrng = np.random.default_rng(41)\n\n# ---------- Linear regression: normal equations vs gradient descent ----\nn = 400\nX = np.column_stack([rng.uniform(0, 10, n), rng.uniform(0, 5, n)])\ntrue_w, true_b = np.array([2.0, -1.5]), 4.0\ny = X @ true_w + true_b + rng.normal(0, 1.0, n)   # Gaussian noise story\n\nXb = np.column_stack([X, np.ones(n)])             # absorb bias\nw_closed = np.linalg.solve(Xb.T @ Xb, Xb.T @ y)    # (X'X)^-1 X'y\n\nw_gd = np.zeros(3)\nfor _ in range(5000):\n    grad = Xb.T @ (Xb @ w_gd - y) / n              # d(MSE)/dw\n    w_gd -= 0.01 * grad\nprint(f'true    : {[2.0, -1.5, 4.0]}')\nprint(f'closed  : {w_closed.round(3)}')\nprint(f'grad dsc: {w_gd.round(3)}   # same answer, two roads')\n\n# ---------- Logistic regression: gradient descent on cross-entropy -----\nn2 = 1000\nX2 = rng.normal(size=(n2, 2))\ntrue_w2 = np.array([1.5, -2.0])\np_true = 1 / (1 + np.exp(-(X2 @ true_w2 + 0.5)))\ny2 = (rng.random(n2) < p_true).astype(float)       # Bernoulli labels\n\nX2b = np.column_stack([X2, np.ones(n2)])\nw2 = np.zeros(3)\nfor _ in range(8000):\n    p = 1 / (1 + np.exp(-(X2b @ w2)))\n    w2 -= 0.1 * X2b.T @ (p - y2) / n2              # X'(p - y): the GLM gradient\nprint(f'logistic true w: [1.5, -2.0, 0.5]  fitted: {w2.round(3)}')\nprint(f'odds ratio for feature 0: {np.exp(w2[0]):.2f}x per unit')"
      },
      {
        lang: 'python',
        label: 'The sabotage suite: outliers, imbalance, and thresholds',
        code: "import numpy as np\n\nrng = np.random.default_rng(43)\n\n# --- Sabotage 1: one outlier vs the Gaussian noise assumption ---------\nx = np.linspace(0, 10, 100)\ny = 3 * x + rng.normal(0, 1, 100)\nXb = np.column_stack([x, np.ones(100)])\nslope_clean = np.linalg.lstsq(Xb, y, rcond=None)[0][0]\ny_bad = y.copy(); y_bad[95] += 300                  # one corrupted label\nslope_dirty = np.linalg.lstsq(Xb, y_bad, rcond=None)[0][0]\nprint(f'slope clean={slope_clean:.3f}  with 1 outlier={slope_dirty:.3f}')\n\n# --- Sabotage 2: accuracy lies under class imbalance ------------------\nn = 20_000\nX = rng.normal(size=(n, 3))\nlogits = X @ np.array([2.0, -1.0, 0.5]) - 6.0       # ~1% positive rate\ny = (rng.random(n) < 1/(1+np.exp(-logits))).astype(int)\nprint(f'positive rate: {y.mean():.4f}')\nprint(f'accuracy of always predicting 0: {(y == 0).mean():.4f}')\n\n# Fit logistic regression, then choose threshold by cost, not 0.5\nXb = np.column_stack([X, np.ones(n)])\nw = np.zeros(4)\nfor _ in range(6000):\n    p = 1/(1+np.exp(-(Xb @ w)))\n    w -= 0.3 * Xb.T @ (p - y) / n\np = 1/(1+np.exp(-(Xb @ w)))\nfor thresh in [0.5, 0.1, 0.02]:\n    flag = p > thresh\n    recall = flag[y == 1].mean()\n    precision = y[flag].mean() if flag.any() else 0.0\n    print(f'threshold {thresh:>4}: flags {flag.mean()*100:5.2f}%  '\n          f'precision={precision:.2f}  recall={recall:.2f}')\n# At 0.5 the model flags ~nothing — the threshold, not the model, was broken."
      }
    ],
    resources: [
      { label: 'An Introduction to Statistical Learning (ch. 3-4 — the definitive treatment)', url: 'https://www.statlearning.com/', kind: 'book' },
      { label: 'StatQuest — linear and logistic regression series', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Google ML Crash Course — regression, classification and thresholds', url: 'https://developers.google.com/machine-learning/crash-course', kind: 'course' },
      { label: 'Roadmap: how these models gate the rest of ML', url: 'https://www.youtube.com/watch?v=wOTFGRSUQ6Q', kind: 'video' }
    ]
  }
]
