import type { CurriculumTopic } from '@/types'

/** AI/ML In-Depth — Phase 2: Linear Algebra (6 topics). */
export const AIML_P2: CurriculumTopic[] = [
  {
    id: 'scalars-vectors-tensors',
    phase: 2,
    phaseName: 'Linear Algebra',
    orderIndex: 1,
    estimatedMins: 30,
    prerequisites: ['numpy-fundamentals'],
    title: 'Scalars, Vectors, Matrices & Tensors',
    eli5: 'A scalar is one number, a vector is a list of numbers, a matrix is a grid of numbers, and a tensor is a stack of grids. In ML, every customer, image or sentence gets turned into one of these so the computer can do math on it.',
    analogy: 'Think of a person’s profile: their height is a scalar; their whole profile (height, age, income) is a vector; a spreadsheet of 1000 profiles is a matrix; a video — many color-image grids over time — is a tensor. Same numbers, increasingly organized boxes.',
    explanation: 'Machine learning runs on one big idea: represent everything as arrays of numbers. A single data point becomes a vector — each feature is one dimension, so a customer with 20 attributes is a point in 20-dimensional space. A dataset is a matrix X of shape (n_samples, n_features): rows are examples, columns are features. This convention is baked into every library — sklearn’s fit(X, y) expects exactly this layout. Tensors generalize the idea to more axes: a color image is (height, width, channels), a batch of images is (batch, height, width, channels).',
    technicalDeep: 'Formally, a vector lives in R^n, and geometry gives meaning to the numbers: the norm (length) measures magnitude, and the dot product a . b = sum(a_i * b_i) = |a||b|cos(theta) measures alignment — positive when vectors point the same way, zero when perpendicular (orthogonal). This is why cosine similarity powers recommendation and embedding search: similar users or documents are vectors pointing in similar directions. A matrix is simultaneously a data container (the dataset X) and, as the next topics show, a function that transforms vectors. Tensor rank here means number of axes: scalar rank 0, vector rank 1, matrix rank 2, and deep learning routinely handles rank-4 batches. In NumPy these are all ndarrays distinguished only by .ndim and .shape.',
    whatBreaks: 'Shape mismatches are the everyday failure: sklearn refuses a 1-D array where it expects (n_samples, 1), and a (n,) versus (n, 1) confusion changes broadcasting behavior entirely. In high dimensions, intuition itself breaks: distances between random points concentrate (the curse of dimensionality), so nearest-neighbor methods degrade as features pile up. Comparing raw dot products without normalizing lets long vectors dominate similarity rankings.',
    efficientWay: {
      title: 'Building the data-as-vectors mental model',
      approaches: [
        {
          name: 'Anchor on geometry: every data point is an arrow in feature space; dot product = alignment; dataset = cloud of points',
          verdict: 'best',
          reason: 'You need good intuition, not ultra depth. The arrow picture makes similarity, projections, and later PCA feel obvious instead of symbolic.'
        },
        {
          name: 'Work through formal vector-space axioms and proofs first',
          verdict: 'weak',
          reason: 'Axioms of closure and associativity build no ML intuition. Rigor can come later if you ever need it; geometry pays off immediately.'
        },
        {
          name: 'Learn by wiring NumPy shapes to the concepts: build vectors, dot products, and a tiny dataset matrix by hand',
          verdict: 'ok',
          reason: 'Concrete and reinforces the geometry, but code alone without the mental picture leaves you shape-shuffling blindly.'
        }
      ],
      recommendation: 'Watch the first 3Blue1Brown episodes, then re-create each idea in NumPy: a vector as an arrow, dot product as alignment score, your dataset as rows-in-space. When you can say what a row, a column, and X.shape mean geometrically, you have what ML actually requires.'
    },
    commonMistakes: [
      'Mixing up rows and columns: X is (n_samples, n_features) — feeding the transpose trains a model on nonsense without an error in some APIs',
      'Treating a (n,) 1-D array and a (n, 1) column as interchangeable — broadcasting and matrix multiply behave differently for each',
      'Comparing similarity with raw dot products when magnitudes differ — normalize (cosine similarity) or the longest vector always wins',
      'Assuming 2-D/3-D geometric intuition scales up — in 1000 dimensions nearly all vectors are almost orthogonal and distances concentrate'
    ],
    seniorNotes: 'Seniors read shapes like sentences: (batch, seq_len, d_model) in a transformer tells the whole story of what the code does. They also know feature scale is part of geometry — a salary axis in rupees dwarfs an age axis, so distance-based methods (kNN, k-means, PCA) require standardization or the geometry is silently dominated by one unit. Embeddings — turning words, users, products into learned vectors — are this topic industrialized.',
    interviewQuestions: [
      'How is a dataset represented as a matrix, and what do rows and columns mean?',
      'What does the dot product of two vectors tell you? Where is it used in ML?',
      'What is a tensor, and what would the shape of a batch of 32 RGB images of size 64x64 be?'
    ],
    interviewAnswers: [
      'The convention is X with shape (n_samples, n_features): each row is one example represented as a vector, each column is one feature measured across all examples. Every mainstream API assumes it — sklearn’s fit(X, y), where y holds one label per row. Geometrically the dataset is n points in feature space.',
      'The dot product sums element-wise products and equals |a||b|cos(theta), so it measures alignment: large positive means pointing the same way, zero means orthogonal (unrelated), negative means opposed. Normalized, it is cosine similarity — the backbone of embedding search and recommenders — and inside every neural layer, each output is a dot product of the input with a learned weight vector.',
      'A tensor is an n-dimensional array — scalar, vector and matrix are ranks 0, 1 and 2. A batch of 32 RGB 64x64 images is rank 4 with shape (32, 64, 64, 3) channels-last, or (32, 3, 64, 64) channels-first as PyTorch prefers.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Scalars to tensors, and dot product as similarity',
        code: 'import numpy as np\n\nscalar = 3.5                                  # rank 0\nuser_a = np.array([25, 60000, 4])             # rank 1: age, income, purchases\nuser_b = np.array([27, 58000, 5])\nuser_c = np.array([60, 20000, 0])\nX = np.stack([user_a, user_b, user_c])        # rank 2: dataset (3 samples, 3 features)\nimages = np.zeros((32, 64, 64, 3))            # rank 4: batch of RGB images\nprint(X.shape, X.ndim, images.ndim)           # (3, 3) 2 4\n\n# Dot product = alignment. Normalize first so magnitude does not cheat.\ndef cosine(u, v):\n    return u @ v / (np.linalg.norm(u) * np.linalg.norm(v))\n\n# Standardize features so one unit (income) cannot dominate the geometry\nXz = (X - X.mean(axis=0)) / X.std(axis=0)\nprint(round(cosine(Xz[0], Xz[1]), 3))   # ~1.0  -> a and b are similar users\nprint(round(cosine(Xz[0], Xz[2]), 3))   # negative -> a and c are opposites'
      }
    ],
    resources: [
      { label: '3Blue1Brown — Essence of Linear Algebra (episodes 1-2)', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', kind: 'video' },
      { label: 'Khan Academy — Linear Algebra (vectors unit)', url: 'https://www.khanacademy.org/math/linear-algebra', kind: 'course' },
      { label: 'Mathematics for Machine Learning, Ch. 2 (free book)', url: 'https://mml-book.github.io/', kind: 'book' }
    ]
  },
  {
    id: 'matrix-operations',
    phase: 2,
    phaseName: 'Linear Algebra',
    orderIndex: 2,
    estimatedMins: 35,
    prerequisites: ['scalars-vectors-tensors'],
    title: 'Matrix Operations',
    eli5: 'You can add two grids of numbers cell by cell, flip a grid along its diagonal (transpose), and — the big one — multiply grids. Matrix multiplication is a machine that takes in vectors and moves them: rotating, stretching, squashing whole spaces of points at once.',
    analogy: 'A matrix is a recipe converter. You have quantities of raw ingredients (input vector); the matrix is a table saying how much of each ingredient goes into each dish; multiplying gives you the dishes you can make (output vector). A neural network layer is exactly this: features in, weighted combinations out.',
    explanation: 'Addition and scalar multiplication work element-wise and are unremarkable. Transpose flips rows and columns — X.T turns (n, d) into (d, n), and it appears everywhere (e.g. X.T @ X computes all feature-pair relationships in one shot). Matrix multiplication is the operation to internalize: (m, n) @ (n, p) gives (m, p), where each output entry is a dot product of a row from the left with a column from the right. The deep meaning: a matrix is a linear transformation — it moves every vector in space in a consistent way (rotate, scale, shear) — and multiplying matrices composes transformations. A neural network layer is literally output = activation(W @ x + b): the entire "learning" is finding good matrices.',
    technicalDeep: 'For C = A @ B, entry C[i, j] = sum_k A[i, k] * B[k, j] — row i of A dotted with column j of B. Inner dimensions must match, and the product is generally not commutative (A @ B != B @ A — rotating then stretching differs from stretching then rotating) but is associative, which is why you can chain layers. Geometrically, the columns of a matrix tell you where the basis vectors land: column j is the image of unit vector e_j, and every other vector follows by linearity. That is the 3Blue1Brown picture worth burning in. Applied to a dataset: X @ w (shape (n, d) @ (d,)) computes a prediction score for every sample simultaneously — linear regression is one matrix-vector product. Transpose rules: (A @ B).T = B.T @ A.T. Naive multiplication is O(mnp); BLAS libraries under NumPy make it cache-efficient and multi-threaded, which is why GPUs — machines built for matrix multiplies — power deep learning.',
    whatBreaks: 'Using * when you mean @: in NumPy, * is element-wise, so A * B on same-shaped matrices silently computes the wrong thing — no error, just garbage results. Dimension mismatches ((m, n) @ (p, q) with n != p) throw immediately, which is at least honest. Assuming commutativity when reordering computations changes the answer. Chaining multiplications in a poor order also matters: (A @ B) @ v with huge A and B costs vastly more than A @ (B @ v).',
    efficientWay: {
      title: 'Internalizing matrix multiplication',
      approaches: [
        {
          name: 'Learn the transformation view: a matrix moves space, columns show where basis vectors land, multiplication composes moves',
          verdict: 'best',
          reason: 'This intuition — not mechanical drilling — is what makes neural layers, PCA and embeddings click. You need the picture, not ultra depth in computation.'
        },
        {
          name: 'Drill the row-times-column mechanics on paper until fluent',
          verdict: 'ok',
          reason: 'Worth doing for a handful of small examples so shapes feel physical, but mechanics alone never explains WHY multiplication is defined this way.'
        },
        {
          name: 'Skip the math since NumPy computes it for you',
          verdict: 'weak',
          reason: 'You will be able to run models but not reason about them — every architecture diagram and shape error assumes you see multiplies as transformations.'
        }
      ],
      recommendation: 'Watch 3Blue1Brown episodes 3-4, then verify the ideas in NumPy: build a rotation matrix, watch it move points, compose two transforms and confirm order matters. One evening of this beats a semester of hand-computation.'
    },
    commonMistakes: [
      'Confusing element-wise * with matrix multiply @ — the most expensive single-character bug in ML code',
      'Getting shapes backwards: (m, n) @ (n, p) works, and forgetting the inner-dimensions rule causes chains of transposes added by trial and error',
      'Assuming A @ B == B @ A — matrix multiplication does not commute, and transform order genuinely changes the result',
      'Writing (A @ B) @ v where A @ (B @ v) is dramatically cheaper — associativity lets you choose the fast order'
    ],
    seniorNotes: 'Seniors think in shapes before code: a linear layer mapping 512 features to 128 is just a (512, 128) matrix, and a whole MLP is a chain of shape rewrites. They exploit associativity for speed (matrix-vector before matrix-matrix), know X.T @ X shows up in least squares and covariance, and recognize that attention in transformers is three matrix multiplies and a softmax. When performance matters, the question is always: is this hitting BLAS, or is a Python loop hiding somewhere?',
    interviewQuestions: [
      'Why is matrix multiplication defined as row-times-column instead of element-wise?',
      'What is the connection between a matrix multiply and a neural network layer?',
      'Is matrix multiplication commutative? Associative? Why does the second property matter in practice?'
    ],
    interviewAnswers: [
      'Because a matrix represents a linear transformation, and row-times-column is exactly function composition: each output coordinate is a linear combination (dot product) of the inputs. Element-wise multiplication would not compose transformations — with the standard definition, applying B then A to a vector equals applying the single matrix A @ B, which is the property everything in ML builds on.',
      'A dense layer computes activation(W @ x + b): the weight matrix W IS the layer. Each output neuron is one row of W dotted with the input — a learned weighted combination of features. Stacking layers composes transformations, and nonlinear activations between them prevent the whole stack from collapsing into one equivalent matrix.',
      'Not commutative — A @ B and B @ A generally differ, because transform order matters (rotate-then-stretch vs stretch-then-rotate). It is associative — (A @ B) @ C = A @ (B @ C) — which matters twice: it lets deep networks be treated as one composed function, and it lets you pick the cheap evaluation order, e.g. A @ (B @ v) does two matrix-vector products instead of a huge matrix-matrix product.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Matrices as transformations, composition, and a neural layer',
        code: 'import numpy as np\n\n# A matrix moves space: its columns are where basis vectors land\ntheta = np.pi / 2\nR = np.array([[np.cos(theta), -np.sin(theta)],   # 90-degree rotation\n              [np.sin(theta),  np.cos(theta)]])\nS = np.array([[2.0, 0.0],                         # stretch x by 2\n              [0.0, 1.0]])\nv = np.array([1.0, 0.0])\nprint(R @ v)            # [0, 1] — east becomes north\n\n# Composition = multiplication, and ORDER MATTERS\nprint((S @ R) @ v)      # rotate first, then stretch -> [0, 1]\nprint((R @ S) @ v)      # stretch first, then rotate -> [0, 2]\n\n# * is element-wise, @ is matrix multiply — not the same!\nA = np.array([[1, 2], [3, 4]])\nprint(A * A)            # [[1 4],[9 16]]  element-wise\nprint(A @ A)            # [[7 10],[15 22]] true matrix product\n\n# A neural network layer IS a matrix multiply\nrng = np.random.default_rng(0)\nX = rng.normal(size=(32, 512))          # batch of 32 samples, 512 features\nW = rng.normal(size=(512, 128)) * 0.02  # learned weights\nb = np.zeros(128)\nhidden = np.maximum(0, X @ W + b)       # ReLU(XW + b)\nprint(hidden.shape)                     # (32, 128)'
      }
    ],
    resources: [
      { label: '3Blue1Brown — Linear transformations & matrix multiplication', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', kind: 'video' },
      { label: 'Khan Academy — Matrix transformations', url: 'https://www.khanacademy.org/math/linear-algebra', kind: 'course' },
      { label: 'Imperial College — Mathematics for ML specialization', url: 'https://www.coursera.org/specializations/mathematics-machine-learning', kind: 'course' },
      { label: 'NumPy beginner guide (matmul and shapes)', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', kind: 'docs' }
    ]
  },
  {
    id: 'determinants-inverses',
    phase: 2,
    phaseName: 'Linear Algebra',
    orderIndex: 3,
    estimatedMins: 30,
    prerequisites: ['matrix-operations'],
    title: 'Determinants & Inverses',
    eli5: 'The determinant is one number that says how much a matrix stretches or squashes space — 2 means areas double, 0 means space gets flattened into something thinner. The inverse is the undo button: it reverses whatever the matrix did. If the determinant is 0, information was destroyed and there is no undo.',
    analogy: 'A matrix with determinant 0 is like summarizing a book into one sentence: the compression destroys information, and no machine can reconstruct the book from the sentence. Invertible matrices are lossless translations — every transformation can be perfectly undone.',
    explanation: 'The determinant det(A) measures the volume-scaling factor of the transformation A: |det| = 2 doubles areas/volumes, |det| = 1 preserves them (rotations), a negative sign means orientation flipped, and det = 0 means the transformation collapses space onto a lower-dimensional subspace — a plane squashed to a line. Such matrices are called singular. The inverse A^-1 is the transformation that undoes A, satisfying A^-1 @ A = I (the identity, the do-nothing matrix). It exists exactly when det(A) != 0, because you cannot un-flatten what was flattened. The classic application: a linear system Ax = b has the formal solution x = A^-1 b — this is how the normal equations of linear regression are usually written.',
    technicalDeep: 'For a 2x2 matrix [[a, b], [c, d]], det = ad - bc; larger determinants expand by cofactors, but numerically they are computed via LU factorization in O(n^3). Key identities: det(AB) = det(A)det(B) and det(A^-1) = 1/det(A). In ML the determinant appears in the multivariate Gaussian density (det of the covariance — the volume of the uncertainty ellipsoid) and in normalizing flows (log-det tracks how the model warps probability volume). Practically, you should almost never compute an explicit inverse: solving Ax = b via np.linalg.solve (LU decomposition) is faster and far more numerically stable than np.linalg.inv(A) @ b. Near-singular matrices are the real production issue — the condition number measures how close to singular a matrix is, and ill-conditioned systems amplify tiny input noise into huge solution errors. This is exactly why multicollinear features destabilize linear regression: X.T @ X becomes nearly singular, and ridge regression fixes it by adding lambda * I, pushing the matrix safely away from singularity.',
    whatBreaks: 'Inverting a singular or near-singular matrix: NumPy either raises LinAlgError or, worse, returns huge unstable numbers that look like an answer. Linear regression with duplicated or highly correlated features fails exactly this way — the normal-equations matrix is not invertible, and coefficients explode or flip signs between runs. Testing det(A) == 0 with floats is meaningless; near-zero determinants and high condition numbers are the practical danger.',
    efficientWay: {
      title: 'Getting the determinant/inverse intuition that ML needs',
      approaches: [
        {
          name: 'Intuition-first: determinant = volume scaling, det 0 = information destroyed = no inverse; verify with 2x2 examples in NumPy',
          verdict: 'best',
          reason: 'This single picture explains singular matrices, why multicollinearity breaks regression, and why ridge works. You need that intuition, not skill at hand-computing 4x4 cofactor expansions.'
        },
        {
          name: 'Master manual computation techniques (cofactor expansion, adjugate inverses)',
          verdict: 'weak',
          reason: 'Nobody computes these by hand past coursework, and the mechanics teach little about what the numbers mean. Time is better spent on the geometry.'
        },
        {
          name: 'Learn through the linear-systems lens: when does Ax = b have a unique solution?',
          verdict: 'ok',
          reason: 'A solid complementary view that connects directly to regression, but without the volume picture, det = 0 stays an arbitrary algebraic condition.'
        }
      ],
      recommendation: 'Watch 3Blue1Brown episodes 6-7, then break linear regression yourself: duplicate a feature column and watch the normal equations fail, then fix it with ridge. Once you have seen singularity cause a real bug and a real fix, the concept is permanently yours.'
    },
    commonMistakes: [
      'Computing np.linalg.inv(A) @ b instead of np.linalg.solve(A, b) — slower and numerically worse; explicit inverses are almost never needed',
      'Checking det(A) == 0 exactly in floating point — use the condition number or rank to judge near-singularity',
      'Believing a tiny determinant means a nearly-singular matrix in general — scaling a matrix shrinks its determinant without changing its conditioning',
      'Ignoring multicollinearity warnings: near-singular X.T @ X makes regression coefficients huge, unstable and uninterpretable'
    ],
    seniorNotes: 'The senior rule: never invert when you can solve. Production numerical code uses factorizations (LU, Cholesky for symmetric positive-definite covariance matrices, QR for least squares) instead of inverses. Condition number is the health metric seniors actually check — np.linalg.cond(A) above ~1e8 in float64 means the results deserve suspicion. Regularization (ridge’s lambda * I) is best understood here: it is a deliberate nudge away from singularity, trading a little bias for a lot of stability.',
    interviewQuestions: [
      'What does the determinant of a matrix tell you geometrically?',
      'When does a matrix have no inverse, and what does that mean for solving Ax = b?',
      'Why does linear regression break when two features are highly correlated, and what is the fix?'
    ],
    interviewAnswers: [
      'It is the volume-scaling factor of the transformation: |det| tells how much areas (2-D) or volumes (n-D) get multiplied, the sign says whether orientation flipped, and det = 0 means space collapses onto a lower-dimensional subspace — the transformation destroys a dimension of information.',
      'Exactly when det(A) = 0 (singular): the transformation flattens space, many inputs map to the same output, so no unique undo exists. For Ax = b this means either no solution (b lies off the collapsed subspace) or infinitely many (a whole family of x maps to b) — never a unique one. Numerically, nearly-singular is the practical version: solutions exist but amplify noise enormously, measured by the condition number.',
      'With highly correlated features, columns of X are nearly linearly dependent, so X.T @ X in the normal equations is nearly singular — its near-zero directions let coefficients grow huge and flip signs with tiny data changes. Ridge regression adds lambda * I to X.T @ X, shifting it away from singularity: a small bias buys stable, sensible coefficients. Alternatively, drop or combine the redundant features.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Determinant as volume, singularity breaking regression, ridge fixing it',
        code: 'import numpy as np\n\n# Determinant = volume scaling\nS = np.array([[2.0, 0.0], [0.0, 3.0]])\nprint(np.linalg.det(S))          # 6.0 -> areas scale by 6\nflat = np.array([[1.0, 2.0], [2.0, 4.0]])   # second row = 2x first\nprint(np.linalg.det(flat))       # 0.0 -> collapses 2D onto a line, no inverse\n\n# Solve, do not invert\nA = np.array([[3.0, 1.0], [1.0, 2.0]])\nb = np.array([9.0, 8.0])\nprint(np.linalg.solve(A, b))     # preferred: LU-based solve -> [2. 3.]\n\n# Multicollinearity = near-singularity in regression\nrng = np.random.default_rng(1)\nx1 = rng.normal(size=200)\nx2 = x1 + rng.normal(scale=1e-6, size=200)   # x2 is x1 + tiny noise\nX = np.column_stack([x1, x2])\ny = 3 * x1 + rng.normal(scale=0.1, size=200)\n\nXtX = X.T @ X\nprint(f\'condition number: {np.linalg.cond(XtX):.1e}\')   # astronomically large\nw = np.linalg.solve(XtX, X.T @ y)\nprint(\'unstable weights:\', w.round(1))       # huge opposite-signed pair\n\n# Ridge: push the matrix away from singularity\nlam = 0.1\nw_ridge = np.linalg.solve(XtX + lam * np.eye(2), X.T @ y)\nprint(\'ridge weights:\', w_ridge.round(3))    # ~[1.5, 1.5] — stable, sums to 3'
      }
    ],
    resources: [
      { label: '3Blue1Brown — The determinant & inverse matrices', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', kind: 'video' },
      { label: 'Khan Academy — Determinants and inverses', url: 'https://www.khanacademy.org/math/linear-algebra', kind: 'course' },
      { label: 'Mathematics for Machine Learning, Ch. 4 (free book)', url: 'https://mml-book.github.io/', kind: 'book' }
    ]
  },
  {
    id: 'rank-independence',
    phase: 2,
    phaseName: 'Linear Algebra',
    orderIndex: 4,
    estimatedMins: 30,
    prerequisites: ['determinants-inverses'],
    title: 'Rank & Linear Independence',
    eli5: 'Rank counts how many truly different directions of information a matrix contains. If one column of your data is just other columns in disguise — like having both "price in dollars" and "price in cents" — it adds zero new information, and the rank tells you so.',
    analogy: 'Imagine hiring five consultants, but two of them just repeat a mix of what the others said. You are paying for five reports but receiving three reports’ worth of insight. Rank is the number of consultants with genuinely original things to say.',
    explanation: 'Vectors are linearly independent when none of them can be built as a weighted combination of the others — each adds a genuinely new direction. The rank of a matrix is the number of linearly independent columns (equivalently rows): the true dimensionality of the information it carries. A dataset with 10 feature columns but rank 7 contains only 7 dimensions of real signal; three columns are redundant combinations of the rest. Full rank means no redundancy; rank deficiency is the matrix-level fact behind duplicate features, perfectly correlated variables, and one-hot encodings that sum to a constant.',
    technicalDeep: 'Formally, columns v1..vk are independent iff c1*v1 + ... + ck*vk = 0 only when all ci = 0. Rank = dimension of the column space (the span of the columns — every output the matrix can reach). A transformation from R^n with rank r squashes space onto an r-dimensional image; the directions that get crushed to zero form the null space, with dimension n - r (rank-nullity theorem). Connections: a square matrix is invertible iff full rank iff det != 0 — rank deficiency IS singularity, described by counting. In practice exact rank is fragile under float noise, so numerical rank is computed by counting singular values above a tolerance (np.linalg.matrix_rank does this via SVD). ML manifestations: the dummy-variable trap (one-hot columns summing to the intercept column collapse rank), feature collapse in representation learning (embeddings occupying a lower-dimensional subspace than their width allows), and low-rank structure being deliberately exploited — LoRA fine-tunes huge models by learning small low-rank update matrices.',
    whatBreaks: 'Rank-deficient design matrices make linear regression non-identifiable — infinitely many coefficient vectors fit equally well, so the solver returns an arbitrary or unstable one. The dummy-variable trap does this silently: one-hot encode a category, keep all levels plus an intercept, and your matrix is exactly rank-deficient. In deep learning, dimensional collapse quietly wastes capacity: a 512-dim embedding space where representations occupy 30 effective dimensions. And near-rank-deficiency (rank technically full, condition number huge) is worse than the exact kind because nothing errors.',
    efficientWay: {
      title: 'Learning rank as information content',
      approaches: [
        {
          name: 'Think of rank as "number of independent directions of information" and connect it straight to feature redundancy in datasets',
          verdict: 'best',
          reason: 'This intuition explains the dummy-variable trap, multicollinearity, and why PCA works — the payoffs ML actually cares about. Formal subspace theory can wait; intuition cannot.'
        },
        {
          name: 'Study span, basis, null space and rank-nullity formally with proofs',
          verdict: 'ok',
          reason: 'Genuinely deepens the picture and helps later math courses, but for ML practice it is background — do it after the intuition is in place, not instead of it.'
        },
        {
          name: 'Row-reduce matrices by hand (Gaussian elimination) to find rank',
          verdict: 'weak',
          reason: 'Tedious mechanics that neither computers (they use SVD) nor your intuition benefit from. One or two toy examples are plenty.'
        }
      ],
      recommendation: 'Build redundant datasets in NumPy — duplicate a column, make one column the sum of two others, one-hot encode with all levels — and check matrix_rank each time. Seeing rank drop as YOU inject redundancy makes the concept concrete in twenty minutes.'
    },
    commonMistakes: [
      'One-hot encoding all category levels alongside an intercept — the columns sum to 1 and collapse the design matrix rank (dummy-variable trap); drop one level',
      'Believing more feature columns always means more information — rank, not column count, measures what the model can actually use',
      'Checking redundancy only with pairwise correlations — three features can be pairwise-moderate yet exactly linearly dependent as a trio',
      'Treating numerical rank as exact truth — float noise makes truly dependent columns look independent; judge with singular values and tolerances'
    ],
    seniorNotes: 'Seniors see low rank as both a bug and a feature. Bug: rank-deficient design matrices, collapsed embeddings, non-identifiable models. Feature: real-world data is usually approximately low-rank, which is why compression works — recommender matrix factorization, PCA, and LoRA (rank-8 updates to billion-parameter weight matrices) all monetize the gap between nominal and effective dimensionality. A useful habit: on any new dataset, compare matrix_rank(X) to X.shape[1]; a gap is a data-quality finding worth chasing.',
    interviewQuestions: [
      'What does it mean for vectors to be linearly independent, and how does that relate to the rank of a matrix?',
      'What is the dummy-variable trap?',
      'Why is low rank often a useful property rather than a problem in ML systems?'
    ],
    interviewAnswers: [
      'Vectors are independent when no one of them is a weighted combination of the others — each contributes a new direction. Rank is the count of independent columns (equivalently rows): the dimension of the space the matrix actually spans. A 10-column matrix with rank 7 carries only 7 dimensions of information; the other 3 columns are rebuildable from the rest.',
      'One-hot encoding a categorical with all k levels while keeping an intercept: the k indicator columns sum to exactly 1 — the intercept column — creating exact linear dependence and a rank-deficient design matrix. OLS then has no unique solution. Fix: drop one level (it becomes the baseline) or drop the intercept, or use regularization which restores identifiability.',
      'Because real data is usually approximately low-rank — a few underlying factors explain most variation. That structure enables compression and generalization: PCA keeps the top directions and discards noise, recommenders factor a huge ratings matrix into thin user and item matrices, and LoRA fine-tunes LLMs by learning tiny low-rank weight updates. Low rank is the mathematical reason these methods are cheap and effective.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Watching rank detect redundancy you inject',
        code: 'import numpy as np\n\nrng = np.random.default_rng(7)\nX = rng.normal(size=(100, 4))            # 4 genuinely independent features\nprint(np.linalg.matrix_rank(X))          # 4 — full rank\n\n# Redundancy 1: duplicated feature (price in dollars AND cents)\nX_dup = np.column_stack([X, X[:, 0] * 100])\nprint(X_dup.shape[1], np.linalg.matrix_rank(X_dup))   # 5 columns, rank 4\n\n# Redundancy 2: a column that is the sum of two others\nX_sum = np.column_stack([X, X[:, 1] + X[:, 2]])\nprint(np.linalg.matrix_rank(X_sum))      # still 4 — no pairwise corr would catch this trio\n\n# The dummy-variable trap\ncats = rng.integers(0, 3, size=100)\nonehot = np.eye(3)[cats]                 # all 3 levels\nintercept = np.ones((100, 1))\ndesign = np.column_stack([intercept, onehot])\nprint(design.shape[1], np.linalg.matrix_rank(design))  # 4 columns, rank 3!\n\ndesign_fixed = np.column_stack([intercept, onehot[:, 1:]])  # drop one level\nprint(design_fixed.shape[1], np.linalg.matrix_rank(design_fixed))  # 3, rank 3'
      }
    ],
    resources: [
      { label: '3Blue1Brown — Span, basis and rank (episodes 5-7)', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', kind: 'video' },
      { label: 'Khan Academy — Linear independence & span', url: 'https://www.khanacademy.org/math/linear-algebra', kind: 'course' },
      { label: 'Mathematics for Machine Learning, Ch. 2-3 (free book)', url: 'https://mml-book.github.io/', kind: 'book' }
    ]
  },
  {
    id: 'eigenvalues-eigenvectors',
    phase: 2,
    phaseName: 'Linear Algebra',
    orderIndex: 5,
    estimatedMins: 35,
    prerequisites: ['matrix-operations', 'determinants-inverses'],
    title: 'Eigenvalues & Eigenvectors',
    eli5: 'When a matrix transforms space, most arrows get knocked off their direction. A few special arrows keep pointing exactly the same way — they only get longer or shorter. Those are eigenvectors, and the stretch factor for each is its eigenvalue.',
    analogy: 'Spin a globe: every city moves, except the two poles stay put — the spin axis is the eigenvector of the rotation. Or push your hands through wet sand: most grains swirl, but grains along the push direction just slide straight. Eigenvectors are the transformation’s natural axes.',
    explanation: 'An eigenvector of matrix A is a nonzero vector v whose direction A does not change: A @ v = lambda * v, where the scalar lambda (the eigenvalue) is the stretch factor along that invariant direction — bigger than 1 stretches, between 0 and 1 shrinks, negative flips. Eigenvectors reveal a transformation’s skeleton: along these axes, a complicated matrix acts like simple scalar multiplication. This is why they show up wherever repeated linear updates happen — each application of A multiplies eigen-components by their eigenvalues again, so the largest eigenvalue quickly dominates behavior.',
    technicalDeep: 'Eigenvalues solve det(A - lambda * I) = 0; in practice np.linalg.eig (or eigh for symmetric matrices) computes them iteratively. If A has a full set of eigenvectors, A = V diag(lambdas) V^-1, and powers become trivial: A^k = V diag(lambdas^k) V^-1 — the mathematics of "what happens if I apply this update forever". That question is everywhere in ML. Stability and convergence: iterating x_{k+1} = A x_k converges toward the dominant eigenvector, exploding if |lambda_max| > 1 and vanishing if < 1 — the exact mechanism of exploding/vanishing gradients in RNNs and the reason gradient descent on a quadratic converges only when the learning rate is below 2 over the largest eigenvalue of the Hessian. The eigenvalue spread (condition number of the Hessian) dictates how slow that convergence is. PageRank is the dominant eigenvector of the web’s link matrix. Symmetric matrices (covariance, Hessians, kernels) are the nice case: real eigenvalues, orthogonal eigenvectors (spectral theorem) — the foundation PCA stands on in the next topic.',
    whatBreaks: 'Repeated linear updates with a top eigenvalue above 1 explode — this is literally exploding gradients in deep nets, and eigenvalues below 1 give vanishing gradients. Gradient descent with a learning rate exceeding 2/lambda_max diverges: loss oscillates and blows up, a bug every practitioner meets. Using np.linalg.eig on a symmetric covariance matrix instead of eigh wastes precision and can return complex-typed results with tiny imaginary noise. Non-symmetric matrices may have complex eigenvalues (rotations have no real invariant direction) — code assuming real values breaks.',
    efficientWay: {
      title: 'Eigen-intuition without the algebra grind',
      approaches: [
        {
          name: 'Intuition-first: invariant directions + "repeat the map and the top eigenvalue wins", verified visually in NumPy',
          verdict: 'best',
          reason: 'These two ideas explain PCA, gradient descent stability, PageRank and vanishing gradients. That is the ML payoff — you need this intuition, not fluency in characteristic-polynomial algebra.'
        },
        {
          name: 'Solve characteristic polynomials by hand for many matrices',
          verdict: 'weak',
          reason: 'Past one 2x2 example, hand-solving builds arithmetic stamina, not understanding — and no one computes eigenvalues that way in practice.'
        },
        {
          name: 'Meet eigenvectors only inside applications (PCA, PageRank) when needed',
          verdict: 'ok',
          reason: 'Motivating, but each application then feels like a separate magic trick; twenty minutes on the shared concept first makes them all one idea.'
        }
      ],
      recommendation: 'Watch 3Blue1Brown episode 14, then run the experiment yourself: take a 2x2 matrix, repeatedly apply it to a random vector, and watch it align with the dominant eigenvector while its length follows lambda_max^k. Stability and convergence intuition falls out of that one loop.'
    },
    commonMistakes: [
      'Forgetting eigenvectors are directions: any scalar multiple is the same eigenvector, and libraries return them normalized with arbitrary sign — do not read meaning into the sign',
      'Using eig on symmetric matrices instead of eigh, getting complex dtype noise and unsorted eigenvalues',
      'Expecting real eigenvalues from every matrix — 2-D rotations have none, which makes geometric sense: no direction survives a rotation',
      'Ignoring the eigenvalue spread of the Hessian when tuning learning rates — ill-conditioned curvature is exactly why training zigzags slowly'
    ],
    seniorNotes: 'Seniors reach for the spectrum as a diagnostic: Hessian eigenvalues describe the loss landscape (large spread = ill-conditioned = slow, zigzagging SGD), the spectral norm (top singular/eigen value) of weight matrices controls stability — spectral normalization in GANs and weight-decay lore both live here — and power iteration is the cheap trick to estimate lambda_max without full decomposition. The heuristic worth remembering: any time a linear-ish update repeats — RNN steps, gradient steps, Markov chains, graph propagation — ask where the eigenvalues sit relative to 1.',
    interviewQuestions: [
      'What are eigenvectors and eigenvalues, intuitively?',
      'Why does repeatedly applying a matrix to a vector align it with the dominant eigenvector?',
      'How do eigenvalues relate to gradient descent convergence and exploding/vanishing gradients?'
    ],
    interviewAnswers: [
      'A matrix transforms space, generally changing every vector’s direction — except eigenvectors, which keep their direction and only scale by their eigenvalue (A v = lambda v). They are the transformation’s natural axes: along them, the complicated matrix behaves like simple multiplication by a number.',
      'Write the starting vector as a mix of eigenvectors. Each application of A multiplies each component by its eigenvalue, so after k steps components scale by lambda_i^k. The largest |lambda| grows fastest and exponentially swamps the rest, leaving the vector pointing along the dominant eigenvector. This is power iteration — and the mechanism behind PageRank and Markov chain steady states.',
      'Both are the "repeat a linear map" story. Gradients backpropagated through repeated weight multiplications scale by eigenvalues each step: top eigenvalue above 1 compounds into exploding gradients, below 1 into vanishing ones. In optimization, gradient descent on a quadratic converges only if the learning rate is under 2/lambda_max of the Hessian, and the ratio lambda_max/lambda_min (condition number) sets the speed — a wide spread forces a small step size along the steep direction, so progress along the flat direction crawls.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Invariant directions, power iteration, and stability at |lambda| = 1',
        code: 'import numpy as np\n\nA = np.array([[2.0, 1.0],\n              [1.0, 2.0]])          # symmetric: nice real, orthogonal eigens\nvals, vecs = np.linalg.eigh(A)\nprint(vals)                          # [1. 3.]\nprint(vecs.round(3))                 # columns are eigenvectors\n\n# Check the definition: A v = lambda v\nv = vecs[:, 1]\nprint(A @ v, vals[1] * v)            # same vector\n\n# Power iteration: repeated application aligns with dominant eigenvector\nx = np.array([1.0, 0.0])\nfor _ in range(25):\n    x = A @ x\n    x = x / np.linalg.norm(x)        # keep length 1, watch direction\nprint(x.round(4))                    # converged to [0.7071, 0.7071]\n\n# Stability: |lambda|>1 explodes, <1 vanishes — gradient flow in a nutshell\nfor lam in [0.9, 1.0, 1.1]:\n    M = lam * np.eye(2)\n    g = np.array([1.0, 1.0])\n    for _ in range(50):\n        g = M @ g\n    print(f\'lambda={lam}: norm after 50 steps = {np.linalg.norm(g):.4f}\')\n# 0.9 -> ~0.007 (vanishing) | 1.0 -> stable | 1.1 -> ~156 (exploding)'
      }
    ],
    resources: [
      { label: '3Blue1Brown — Eigenvectors and eigenvalues (episode 14)', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', kind: 'video' },
      { label: 'Khan Academy — Eigen-everything unit', url: 'https://www.khanacademy.org/math/linear-algebra', kind: 'course' },
      { label: 'Mathematics for Machine Learning, Ch. 4 (free book)', url: 'https://mml-book.github.io/', kind: 'book' },
      { label: 'StatQuest — eigen concepts explained gently', url: 'https://www.youtube.com/@statquest', kind: 'video' }
    ]
  },
  {
    id: 'svd-pca',
    phase: 2,
    phaseName: 'Linear Algebra',
    orderIndex: 6,
    estimatedMins: 40,
    prerequisites: ['rank-independence', 'eigenvalues-eigenvectors'],
    title: 'SVD & PCA',
    eli5: 'SVD breaks any matrix into simple pieces ranked by importance, like splitting a song into loud main melodies and quiet background hiss. PCA uses this to shrink data: keep the few directions where the data really varies, throw away the rest, and you keep the story while dropping the noise.',
    analogy: 'A shadow is a projection: a 3-D hand becomes a 2-D shape, and a well-chosen light angle keeps the hand recognizable. PCA finds the best light angle for your data — project 100 dimensions down to 2 while losing as little of the shape as possible. SVD is the machinery that finds those angles for any matrix.',
    explanation: 'The singular value decomposition factors any matrix as A = U S V^T: rotate (V^T), scale along perpendicular axes (S, the singular values, sorted by importance), rotate again (U). Keeping only the top k singular values gives the best possible rank-k approximation of A — the mathematical statement of "keep the signal, drop the details". PCA applies this to data: center the features, then find the orthogonal directions (principal components) along which the data varies most. Projecting onto the top k components compresses n features into k while retaining maximum variance — used for visualization (100-D embeddings on a 2-D screen), speeding up downstream models, and noise filtering, since small components are often mostly noise.',
    technicalDeep: 'The principal components are the eigenvectors of the covariance matrix C = X_c^T X_c / (n - 1) (X_c centered), with eigenvalues equal to the variance along each component — this is the spectral theorem cashing in: covariance is symmetric, so the directions are orthogonal. Equivalently and more stably, PCA comes from the SVD of the centered data itself: X_c = U S V^T, where V’s columns are the components and the eigenvalues are S^2/(n-1); good implementations (sklearn’s PCA) use SVD to avoid explicitly forming the covariance matrix. Explained variance ratio — each eigenvalue over the total — is the tool for choosing k (common heuristic: keep 90-95%). The Eckart-Young theorem guarantees truncated SVD is the optimal low-rank approximation in the least-squares sense, which underwrites image compression, latent semantic analysis, and matrix-factorization recommenders. Caveats: PCA is linear (it cannot unroll curved manifolds — that is what t-SNE/UMAP are for), unsupervised (max variance is not necessarily max class separation), and scale-sensitive.',
    whatBreaks: 'Running PCA without standardizing features lets whichever column has the biggest unit dominate: income in rupees crushes age in years, and component 1 is just "the income axis". Forgetting to center makes the first component point at the data’s mean instead of its main variance direction. Fitting PCA on the full dataset before the train/test split leaks test statistics. Blindly keeping 2 components for a pretty plot can discard the dimension that actually separates the classes — check explained variance and downstream metrics, not just the picture.',
    efficientWay: {
      title: 'Learning SVD/PCA with the right depth',
      approaches: [
        {
          name: 'Intuition + practice: "find perpendicular axes of most variance, keep the top few", then apply sklearn PCA to a real dataset and read the explained-variance curve',
          verdict: 'best',
          reason: 'This is the level ML work and interviews actually demand — you need the geometric intuition and the ability to use and validate it, not ultra depth in decomposition theory.'
        },
        {
          name: 'Derive SVD existence and Eckart-Young optimality proofs first',
          verdict: 'weak',
          reason: 'Beautiful mathematics, near-zero marginal value for applying PCA well. Read the proofs later if the theory itself becomes your interest.'
        },
        {
          name: 'Implement PCA from scratch once via covariance eigendecomposition in NumPy',
          verdict: 'ok',
          reason: 'A genuinely great one-time exercise that cements the eigen connection — but do it once for understanding, then use sklearn, which is more numerically careful than your version.'
        }
      ],
      recommendation: 'Implement PCA from scratch once (center, covariance, eigh, project — ten lines), confirm it matches sklearn, then move on to using it well: standardize first, choose k from explained variance, and always ask whether a linear projection suits the data. Intuition plus honest validation beats theoretical depth here.'
    },
    commonMistakes: [
      'Skipping standardization, so the largest-unit feature becomes principal component 1 regardless of actual structure',
      'Choosing the number of components for plot aesthetics instead of from the explained-variance curve or downstream performance',
      'Fitting PCA before the train/test split — the components memorize test-set structure, leaking information',
      'Over-interpreting components as real-world concepts — they are variance-maximizing math directions, and their signs are arbitrary'
    ],
    seniorNotes: 'Seniors treat PCA as an honest workhorse: a preprocessing step (decorrelate + compress before clustering or kNN), a diagnostic (a scree curve collapsing after 5 components on 200 features is a data-quality insight — effective rank made visible), and a baseline that fancier methods must beat. They know the ecosystem: TruncatedSVD for sparse text matrices, randomized SVD for speed at scale, whitening when downstream methods want unit variance, and t-SNE/UMAP for visualization when the manifold is nonlinear — while remembering those distort global distances and PCA does not.',
    interviewQuestions: [
      'Explain PCA to a non-mathematician, then precisely.',
      'How do you choose the number of principal components?',
      'What is the relationship between PCA and SVD, and why do libraries prefer SVD?'
    ],
    interviewAnswers: [
      'Plain: PCA finds the few directions along which your data actually varies and describes each point by its position along them — like summarizing a cigar-shaped cloud by its long axis. Precise: center (and usually standardize) X, then the principal components are the orthogonal eigenvectors of the covariance matrix, ordered by eigenvalue = variance captured; projecting onto the top k gives the k-dimensional representation with maximum retained variance, optimal in the least-squares sense.',
      'Plot cumulative explained variance versus k and pick the elbow or a threshold like 90-95%; eigenvalues near zero mark directions that are redundancy or noise. When PCA feeds a downstream model, let that model vote: cross-validate performance across k. For pure 2-D visualization, k = 2 is forced — so report how much variance those two components actually carry.',
      'The principal components are the eigenvectors of the covariance matrix, but the SVD of the centered data X_c = U S V^T delivers the same answer directly: V holds the components and S^2/(n-1) the variances. Libraries prefer SVD because forming X^T X squares the condition number — small variance directions drown in float error — while SVD works on X directly, is numerically stabler, and has fast truncated and randomized variants for big or sparse data.'
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'PCA from scratch vs sklearn, on real data',
        code: 'import numpy as np\nfrom sklearn.datasets import load_iris\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\n\nX = load_iris().data                       # (150, 4)\nXs = StandardScaler().fit_transform(X)     # standardize: PCA is scale-sensitive\n\n# --- From scratch: covariance -> eigendecomposition -> project\nC = np.cov(Xs, rowvar=False)               # (4, 4) covariance matrix\nvals, vecs = np.linalg.eigh(C)             # symmetric -> eigh\norder = np.argsort(vals)[::-1]             # sort descending by variance\nvals, vecs = vals[order], vecs[:, order]\nexplained = vals / vals.sum()\nprint(\'explained variance:\', explained.round(3))   # [0.73 0.23 0.04 0.01]\nZ_scratch = Xs @ vecs[:, :2]               # project onto top 2 components\n\n# --- sklearn (uses SVD internally — more stable, same answer)\npca = PCA(n_components=2)\nZ_sk = pca.fit_transform(Xs)\nprint(\'sklearn explained:\', pca.explained_variance_ratio_.round(3))\n\n# Same subspace (columns may differ by sign — signs are arbitrary)\nprint(np.allclose(np.abs(Z_scratch), np.abs(Z_sk), atol=1e-8))   # True\n\n# 2 of 4 dimensions keep ~96% of the variance — that is the whole pitch'
      },
      {
        lang: 'python',
        label: 'Truncated SVD as optimal low-rank compression / noise filter',
        code: 'import numpy as np\n\n# Build a rank-3 signal buried in noise\nrng = np.random.default_rng(0)\nsignal = rng.normal(size=(100, 3)) @ rng.normal(size=(3, 50))   # rank 3\nnoisy = signal + rng.normal(scale=0.3, size=signal.shape)\n\nU, s, Vt = np.linalg.svd(noisy, full_matrices=False)\nprint(s[:6].round(1))       # first 3 singular values dominate, then a cliff\n\n# Keep top-3 components: best possible rank-3 approximation (Eckart-Young)\nk = 3\ndenoised = U[:, :k] @ np.diag(s[:k]) @ Vt[:k, :]\n\nerr_noisy = np.linalg.norm(noisy - signal)\nerr_denoised = np.linalg.norm(denoised - signal)\nprint(f\'error vs truth — noisy: {err_noisy:.1f}, rank-3 SVD: {err_denoised:.1f}\')\n# Truncation threw away mostly noise: the low-rank copy is CLOSER to the truth'
      }
    ],
    resources: [
      { label: '3Blue1Brown — change of basis & eigen groundwork for PCA', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', kind: 'video' },
      { label: 'StatQuest — PCA step-by-step', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Mathematics for Machine Learning, Ch. 10 (free book)', url: 'https://mml-book.github.io/', kind: 'book' },
      { label: 'Imperial College — Math for ML (PCA course)', url: 'https://www.coursera.org/specializations/mathematics-machine-learning', kind: 'course' }
    ]
  },
]
