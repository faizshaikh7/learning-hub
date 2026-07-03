import type { CurriculumTopic } from '@/types'

/** AI/ML In-Depth — Phase 3: Calculus & Optimization (4 topics). */
export const AIML_P3: CurriculumTopic[] = [
  {
    id: 'derivatives-gradients',
    phase: 3,
    phaseName: 'Calculus & Optimization',
    orderIndex: 1,
    estimatedMins: 45,
    prerequisites: ['python-for-ml', 'numpy-fundamentals'],
    title: 'Derivatives & Gradients',
    eli5:
      'A derivative tells you how fast something is changing right now. If you are driving and the speedometer says 60, that is the derivative of your position. A gradient is the same idea for functions with many inputs: it is an arrow pointing in the direction where the function grows fastest. Machine learning is basically: look at the arrow, walk the opposite way, repeat.',
    analogy:
      'Imagine standing on a foggy hillside where you can only feel the ground under your feet. The slope you feel in each direction is a partial derivative. The gradient is the compass needle that combines all those slopes and points straight uphill. To find the valley (the lowest error), you take a small step directly against the needle. Every neural network ever trained is just doing this millions of times.',
    explanation:
      'The derivative of f at x measures the instantaneous rate of change: the limit of (f(x+h) - f(x)) / h as h shrinks to zero. Geometrically it is the slope of the tangent line. For a function of many variables f(x1, ..., xn), the partial derivative with respect to xi measures how f changes when only xi moves. Stacking all partial derivatives into a vector gives the gradient, written as nabla f. Two facts make the gradient the engine of machine learning: (1) it points in the direction of steepest ascent, so its negative points toward steepest descent, and (2) its magnitude tells you how steep that direction is. Training a model means defining a loss function that measures how wrong the model is, computing the gradient of that loss with respect to the model parameters, and nudging the parameters against the gradient. When the gradient is (near) zero, you have reached a flat point — hopefully a minimum. Everything else in deep learning (backprop, optimizers, learning-rate schedules) exists to compute or use this vector well.',
    technicalDeep:
      'Formally, for f: R^n -> R that is differentiable at x, the gradient nabla f(x) is the unique vector such that f(x + v) ~ f(x) + nabla f(x) . v for small v (a first-order Taylor expansion). The directional derivative along unit vector u is nabla f(x) . u = |nabla f(x)| cos(theta), maximized at theta = 0 — this is the proof that the gradient is the steepest-ascent direction. Numerically, derivatives can be approximated with finite differences: the central difference (f(x+h) - f(x-h)) / (2h) has O(h^2) error versus O(h) for the forward difference, but suffers from floating-point cancellation when h is too small (h ~ 1e-5 is a common sweet spot for float64). In practice, ML frameworks never use finite differences for training — they use automatic differentiation, which applies the chain rule to the exact operations in the computation graph and is both exact (to machine precision) and cheap: reverse-mode autodiff computes the gradient of a scalar loss with respect to millions of parameters in roughly the cost of one extra forward pass. Finite differences survive as gradient checkers: comparing an analytic gradient against a numerical one is the standard way to verify a from-scratch backprop implementation.',
    whatBreaks:
      'Non-differentiable points break naive gradient reasoning: ReLU has no derivative at exactly 0 (frameworks just pick 0 or 1 as the subgradient). Finite-difference checks blow up if h is too large (truncation error) or too small (cancellation error). Vanishing gradients: if the slope is nearly zero over a wide region (saturated sigmoid), learning stalls because the update signal is tiny. Exploding gradients: steep cliffs in the loss surface produce huge updates that catapult parameters into garbage regions. Confusing the gradient of the loss with respect to parameters versus with respect to inputs leads to subtle bugs — you update parameters, not data.',
    efficientWay: {
      title: 'Building real gradient intuition',
      approaches: [
        {
          name: 'Compute derivatives by hand for tiny functions, then verify with NumPy finite differences and plot the tangent lines',
          verdict: 'best',
          reason: 'Hand computation builds the symbolic skill, numerical checking builds the verification habit you will reuse for backprop, and plotting cements the geometry. All three views reinforce each other.',
        },
        {
          name: 'Watch visual courses (3Blue1Brown) and move on without computing anything',
          verdict: 'ok',
          reason: 'Excellent for geometric intuition and highly recommended as a first pass, but intuition without computation evaporates in interviews and when debugging real gradients.',
        },
        {
          name: 'Memorize a table of derivative rules and formulas',
          verdict: 'weak',
          reason: 'Rules without the limit definition or the geometric picture leave you unable to reason about novel functions, subgradients, or why vanishing gradients happen.',
        },
      ],
      recommendation:
        'Watch Essence of Calculus for the pictures, then for five functions (x^2, sigmoid, ReLU, exp, a 2-variable bowl) derive the derivative by hand, verify it with a central-difference check in NumPy, and plot function plus tangent. One evening of this beats a month of passive reading.',
    },
    commonMistakes: [
      'Treating the gradient as a scalar — for n parameters it is an n-dimensional vector, and each component is a partial derivative',
      'Forgetting that the gradient points uphill: gradient DESCENT subtracts it. Sign errors here are the single most common from-scratch bug',
      'Using a forward difference with a tiny h (like 1e-12) for gradient checking and concluding the analytic gradient is wrong when it is floating-point cancellation',
      'Believing zero gradient always means minimum — it can be a maximum or a saddle point; you need second-order information to tell them apart',
    ],
    seniorNotes:
      'In production ML, you almost never write derivatives by hand, but the engineers who debug training failures fastest are the ones who can. Loss-not-decreasing tickets usually resolve to one of: a sign error, a saturated activation killing gradients, a broken custom op whose autodiff is wrong (caught with a finite-difference check), or gradients silently detached from the graph. Also know the cost model: reverse-mode autodiff gives you all million partial derivatives for ~2-3x the cost of the forward pass, which is why deep learning is economically feasible at all.',
    interviewQuestions: [
      'What does the gradient of a function represent geometrically, and why do we move against it during training?',
      'Your loss stops decreasing early in training. Walk me through how gradients could explain this and how you would diagnose it.',
      'How would you verify that a hand-written gradient implementation is correct?',
    ],
    interviewAnswers: [
      'The gradient is the vector of partial derivatives; it points in the direction of steepest ascent of the function, and its magnitude is the rate of increase in that direction. Since training seeks to minimize a loss, we step in the negative gradient direction — the direction of steepest descent. Locally, this is the best first-order move: the first-order Taylor expansion says f decreases fastest along -grad f.',
      'Flat loss can mean vanishing gradients: saturated sigmoids/tanh produce near-zero slopes, so parameter updates become negligible. It can also mean a too-small learning rate, a plateau or saddle region in the loss surface, or dead ReLUs stuck at zero. I would log gradient norms per layer — norms near zero in early layers indicate vanishing gradients; then check activation histograms for saturation, try a larger learning rate or better initialization, and switch saturating activations to ReLU-family ones.',
      'Gradient checking: compare the analytic gradient against a central finite difference (f(x+h) - f(x-h)) / (2h) with h around 1e-5, using relative error |a - n| / max(|a|, |n|) — accept below roughly 1e-7 for float64. Check a random subset of parameters, run it with regularization and randomness (dropout) disabled, and only in debug mode since it costs two forward passes per parameter.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Derivatives numerically: finite differences vs analytic, plus a 2D gradient',
        code: "import numpy as np\n\n# --- 1D: derivative of f(x) = x^2 at x = 3 (analytic answer: 2x = 6) ---\nf = lambda x: x ** 2\n\ndef central_diff(f, x, h=1e-5):\n    return (f(x + h) - f(x - h)) / (2 * h)\n\nprint('numeric :', central_diff(f, 3.0))   # 5.999999999...\nprint('analytic:', 2 * 3.0)                 # 6.0\n\n# --- 2D: gradient of the bowl f(x, y) = x^2 + 3y^2 ---\ndef bowl(p):\n    x, y = p\n    return x ** 2 + 3 * y ** 2\n\ndef numerical_gradient(f, p, h=1e-5):\n    p = np.asarray(p, dtype=float)\n    grad = np.zeros_like(p)\n    for i in range(p.size):\n        step = np.zeros_like(p)\n        step[i] = h\n        grad[i] = (f(p + step) - f(p - step)) / (2 * h)\n    return grad\n\npoint = np.array([1.0, 2.0])\nprint('numeric gradient :', numerical_gradient(bowl, point))  # [ 2. 12.]\nprint('analytic gradient:', np.array([2 * point[0], 6 * point[1]]))\n\n# --- Walk downhill: 20 steps of gradient descent on the bowl ---\np = np.array([1.0, 2.0])\nlr = 0.1\nfor step in range(20):\n    p = p - lr * numerical_gradient(bowl, p)\nprint('after descent:', p, 'loss:', bowl(p))  # near [0, 0], loss near 0",
      },
      {
        lang: 'python',
        label: 'Gradient checking a sigmoid derivative (the habit you will reuse for backprop)',
        code: "import numpy as np\n\ndef sigmoid(x):\n    return 1.0 / (1.0 + np.exp(-x))\n\ndef sigmoid_grad_analytic(x):\n    s = sigmoid(x)\n    return s * (1 - s)\n\ndef relative_error(a, b):\n    return np.abs(a - b) / np.maximum(np.abs(a) + np.abs(b), 1e-12)\n\nxs = np.linspace(-6, 6, 13)\nh = 1e-5\nnumeric = (sigmoid(xs + h) - sigmoid(xs - h)) / (2 * h)\nanalytic = sigmoid_grad_analytic(xs)\n\nprint('max relative error:', relative_error(numeric, analytic).max())\n# ~1e-11 -> the analytic derivative is correct\n\n# Note the vanishing-gradient problem in the numbers themselves:\nprint('grad at x=0 :', sigmoid_grad_analytic(0.0))   # 0.25 (max possible)\nprint('grad at x=6 :', sigmoid_grad_analytic(6.0))   # ~0.0025 -> saturated, learning stalls",
      },
    ],
    resources: [
      { label: '3Blue1Brown — Essence of Calculus', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr', kind: 'video' },
      { label: 'Khan Academy — Differential Calculus', url: 'https://www.khanacademy.org/math/differential-calculus', kind: 'course' },
      { label: 'Mathematics for Machine Learning (free book)', url: 'https://mml-book.github.io/', kind: 'book' },
    ],
  },
  {
    id: 'jacobian-hessian-chain-rule',
    phase: 3,
    phaseName: 'Calculus & Optimization',
    orderIndex: 2,
    estimatedMins: 50,
    prerequisites: ['derivatives-gradients', 'numpy-fundamentals'],
    title: 'Jacobian, Hessian & the Chain Rule',
    eli5:
      'The chain rule says: if A affects B and B affects C, then how A affects C is just the two effects multiplied together. A neural network is a long chain of A-affects-B steps, so to know how the first weight affects the final error you multiply all the little effects along the chain. The Jacobian is a table of all these effects when there are many inputs and many outputs, and the Hessian tells you how the slope itself is curving.',
    analogy:
      'Think of a factory assembly line. If speeding up machine 1 by 1% makes machine 2 produce 3% more, and machine 2 producing 1% more makes final output rise 2%, then machine 1 has a 3 x 2 = 6% effect on the output. That multiplication of local effects along the line is the chain rule. The Jacobian is the full spreadsheet of every-machine versus every-product sensitivities, and the Hessian is like knowing whether the conveyor is on a curve — whether pushing harder gives accelerating or diminishing returns.',
    explanation:
      'When a function maps many inputs to many outputs, f: R^n -> R^m, its derivative is the Jacobian: an m x n matrix where entry (i, j) is the partial derivative of output i with respect to input j. It is the best linear approximation of f near a point. When the output is a single scalar (like a loss), the Jacobian collapses to the gradient (a 1 x n row). The Hessian is the derivative of the gradient — an n x n symmetric matrix of second partial derivatives — and it encodes curvature: positive-definite Hessian means a local bowl (minimum), negative-definite means a dome (maximum), mixed eigenvalue signs mean a saddle. The chain rule for compositions f(g(x)) says the total derivative is the product of the Jacobians: J_fg(x) = J_f(g(x)) @ J_g(x). Backpropagation is exactly this: a neural network is a composition layer_L(...layer_2(layer_1(x))), and the gradient of the loss with respect to any layer parameters is a product of Jacobians flowing backwards from the loss. Understanding this one matrix product is understanding backprop.',
    technicalDeep:
      'Reverse-mode automatic differentiation never materializes full Jacobians — it computes vector-Jacobian products (VJPs). For loss L and layer output h, backprop propagates the row vector dL/dh backwards: dL/dh_prev = (dL/dh) @ J_layer. Since dL/dh is 1 x m, each step is a cheap vector-matrix multiply instead of an m x n matrix build. This is why reverse mode costs O(1) forward passes regardless of parameter count, while forward mode (Jacobian-vector products) is efficient when inputs are few and outputs many. The Hessian for modern networks (n in the millions to billions) is never formed explicitly — O(n^2) memory is impossible — but Hessian-vector products can be computed with two backprop passes (Pearlmutter trick), enabling curvature analysis and second-order-ish optimizers. Eigenvalues of the Hessian at a critical point classify it: all positive = local min; any negative = escape direction exists. The chain rule also explains vanishing/exploding gradients quantitatively: the gradient at layer 1 of an L-layer network contains a product of L Jacobians, so if their singular values are typically below 1 the product shrinks exponentially (vanishing), and above 1 it grows exponentially (exploding). Residual connections fix this by making each layer Jacobian approximately I + something small, keeping the product well-conditioned.',
    whatBreaks:
      'Getting Jacobian dimensions wrong is the classic from-scratch backprop failure: shapes must satisfy (1 x m) @ (m x n) = (1 x n), and NumPy will happily broadcast your mistake into silent garbage instead of erroring. Products of many Jacobians vanish or explode exponentially with depth — the mathematical root cause of why plain deep networks without residual connections or careful initialization fail to train. Assuming the Hessian is computable: forming it explicitly for even a small modern network exhausts memory. Forgetting the Hessian is symmetric (Schwarz theorem) and computing both triangles wastes half your work. Non-smooth points (ReLU kinks) make second derivatives undefined, so curvature-based reasoning needs care there.',
    efficientWay: {
      title: 'Learning vector calculus for backprop',
      approaches: [
        {
          name: 'Derive backprop for a 2-layer network on paper as explicit Jacobian products, then implement it in NumPy and verify with gradient checking',
          verdict: 'best',
          reason: 'This is the exact skill interviews and debugging demand. Once you have multiplied the Jacobians yourself and matched them to a numerical check, autodiff frameworks stop being magic.',
        },
        {
          name: 'Study matrix-calculus identity tables (matrix cookbook style) and pattern-match',
          verdict: 'ok',
          reason: 'Useful as a reference once you understand the underlying chain rule, but pattern-matching identities without derivation skills fails on any non-standard architecture.',
        },
        {
          name: 'Rely on autograd and skip the math entirely',
          verdict: 'weak',
          reason: 'Fine until the first NaN loss, custom layer, or interview question about backprop. You cannot debug what you cannot derive.',
        },
      ],
      recommendation:
        'On paper, write a 2-layer MLP as L(softmax(W2 @ relu(W1 @ x))), draw the computation graph, and write dL/dW1 as a product of Jacobians. Then implement it in under 50 lines of NumPy and confirm against finite differences. This single exercise is the highest-value hour in all of ML math.',
    },
    commonMistakes: [
      'Mixing up Jacobian orientation (m x n vs n x m) and numerator vs denominator layout — pick one convention, write shapes above every term, and check them like types',
      'Materializing full Jacobians in code when only a vector-Jacobian product is needed, turning an O(n) backprop step into an O(mn) memory bomb',
      'Applying the scalar chain rule blindly to matrices — matrix products do not commute, and the order of Jacobians in the chain matters',
      'Believing you need the full Hessian for curvature information, when Hessian-vector products give eigenvalue estimates cheaply',
    ],
    seniorNotes:
      'Senior ML engineers use the chain rule as a diagnostic lens, not just a derivation tool. Vanishing/exploding gradients, why residual connections and LayerNorm help, why initialization scales matter (Xavier/He are chosen so layer Jacobians have unit-ish singular values) — all are one-line consequences of gradient = product of Jacobians. When you write custom autograd Functions (custom CUDA ops, non-standard losses), you implement the VJP by hand and must gradient-check it in CI. Also: know that frameworks compute VJPs, so asking for full Jacobians (torch.autograd.functional.jacobian) is an expensive loop over outputs — avoid it in hot paths.',
    interviewQuestions: [
      'What is the Jacobian of a function, and how does the chain rule generalize to vector-valued functions?',
      'Explain backpropagation in terms of Jacobians. Why is reverse mode the right choice for training neural networks?',
      'What does the Hessian tell you at a point where the gradient is zero, and why do we not compute it explicitly for deep networks?',
    ],
    interviewAnswers: [
      'For f: R^n -> R^m the Jacobian is the m x n matrix of all partial derivatives d f_i / d x_j; it is the best linear approximation of f near the point. For a composition f(g(x)) the chain rule says the Jacobian of the composite is the matrix product of the Jacobians: J = J_f @ J_g, evaluated at the appropriate points. The scalar chain rule is the 1 x 1 special case.',
      'A network is a composition of layers, so by the chain rule the gradient of the loss with respect to early parameters is a product of layer Jacobians. Backprop computes this product right-to-left starting from the scalar loss, propagating a vector-Jacobian product at each layer — each step is a vector-matrix multiply, never a full Jacobian. Because the loss is a single scalar and parameters number in the millions, reverse mode gets every partial derivative in about one extra forward-pass worth of compute, whereas forward mode would need one pass per parameter.',
      'With zero gradient, the Hessian eigenvalues classify the point: all positive means local minimum, all negative means local maximum, mixed signs mean a saddle point with escape directions along negative-eigenvalue eigenvectors. For a network with n parameters the Hessian is n x n — at n = 10^8 that is 10^16 entries, impossible to store. Instead we use Hessian-vector products (two backprop passes) to estimate top eigenvalues or curvature along specific directions.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Backprop as Jacobian products: 2-layer network from scratch with gradient check',
        code: "import numpy as np\nnp.random.seed(0)\n\n# Tiny 2-layer regression net: x -> ReLU(W1 x + b1) -> W2 h + b2 -> squared loss\nX = np.random.randn(8, 3)          # 8 samples, 3 features\ny = np.random.randn(8, 1)\nW1 = np.random.randn(3, 4) * 0.5   # layer 1: 3 -> 4\nb1 = np.zeros(4)\nW2 = np.random.randn(4, 1) * 0.5   # layer 2: 4 -> 1\nb2 = np.zeros(1)\n\ndef forward(X, W1, b1, W2, b2):\n    z1 = X @ W1 + b1               # pre-activation\n    h = np.maximum(z1, 0)          # ReLU\n    yhat = h @ W2 + b2\n    loss = np.mean((yhat - y) ** 2)\n    return loss, (X, z1, h, yhat)\n\ndef backward(cache, W2):\n    X, z1, h, yhat = cache\n    n = X.shape[0]\n    # Chain rule, right to left. Shapes annotated like types.\n    dyhat = 2 * (yhat - y) / n          # (8,1)  dL/dyhat\n    dW2 = h.T @ dyhat                    # (4,1)  = J of (h@W2) wrt W2, applied to dyhat\n    db2 = dyhat.sum(axis=0)              # (1,)\n    dh = dyhat @ W2.T                    # (8,4)  VJP through layer 2\n    dz1 = dh * (z1 > 0)                  # (8,4)  ReLU Jacobian is diagonal 0/1 mask\n    dW1 = X.T @ dz1                      # (3,4)\n    db1 = dz1.sum(axis=0)                # (4,)\n    return dW1, db1, dW2, db2\n\nloss, cache = forward(X, W1, b1, W2, b2)\ndW1, db1, dW2, db2 = backward(cache, W2)\n\n# Gradient check on W1: perturb one entry, compare slope\nh_eps = 1e-5\ni, j = 1, 2\nW1p = W1.copy(); W1p[i, j] += h_eps\nW1m = W1.copy(); W1m[i, j] -= h_eps\nnumeric = (forward(X, W1p, b1, W2, b2)[0] - forward(X, W1m, b1, W2, b2)[0]) / (2 * h_eps)\nprint('analytic dW1[1,2]:', dW1[i, j])\nprint('numeric  dW1[1,2]:', numeric)   # matches to ~1e-10 -> backprop is correct",
      },
      {
        lang: 'python',
        label: 'Hessian eigenvalues classify critical points (min vs saddle)',
        code: "import numpy as np\n\n# f(x, y) = x^2 + y^2 -> bowl.   g(x, y) = x^2 - y^2 -> saddle.\n# Both have zero gradient at the origin; the Hessian tells them apart.\n\nH_bowl = np.array([[2.0, 0.0],\n                   [0.0, 2.0]])   # d2f/dx2=2, d2f/dy2=2, mixed=0\nH_saddle = np.array([[2.0, 0.0],\n                     [0.0, -2.0]])\n\nfor name, H in [('bowl', H_bowl), ('saddle', H_saddle)]:\n    eig = np.linalg.eigvalsh(H)   # symmetric -> real eigenvalues\n    if np.all(eig > 0):\n        kind = 'local minimum'\n    elif np.all(eig < 0):\n        kind = 'local maximum'\n    else:\n        kind = 'saddle point (escape along negative-eigenvalue direction)'\n    print(name, '-> eigenvalues', eig, '->', kind)\n\n# Why gradients vanish/explode with depth: product of L Jacobians\nJ = np.array([[0.9, 0.0], [0.0, 0.8]])   # singular values < 1\nprod = np.linalg.matrix_power(J, 50)\nprint('norm after 50 layers (contracting):', np.linalg.norm(prod))  # ~0 -> vanishing\nJ2 = J * 1.5                               # singular values > 1\nprint('norm after 50 layers (expanding):', np.linalg.norm(np.linalg.matrix_power(J2, 50)))  # huge -> exploding",
      },
    ],
    resources: [
      { label: 'Mathematics for Machine Learning — Ch. 5 (Vector Calculus)', url: 'https://mml-book.github.io/', kind: 'book' },
      { label: '3Blue1Brown — Neural Networks (backprop chapters)', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', kind: 'video' },
      { label: 'Khan Academy — Differential Calculus (chain rule)', url: 'https://www.khanacademy.org/math/differential-calculus', kind: 'course' },
    ],
  },
  {
    id: 'gradient-descent',
    phase: 3,
    phaseName: 'Calculus & Optimization',
    orderIndex: 3,
    estimatedMins: 50,
    prerequisites: ['derivatives-gradients', 'jacobian-hessian-chain-rule'],
    title: 'Gradient Descent & Learning Rates',
    eli5:
      'You are lost on a mountain in thick fog and want to reach the valley. Strategy: feel which way the ground slopes down, take a step that way, repeat. The learning rate is your step size. Tiny steps mean you will take forever; giant steps mean you might leap right over the valley and end up on the opposite slope, bouncing back and forth forever.',
    analogy:
      'Batch gradient descent is surveying the entire mountain with a drone before each step — accurate but painfully slow. Stochastic gradient descent is asking one random hiker for directions each step — fast, noisy, but the noise averages out and sometimes even shakes you free of bad spots. Mini-batch is polling a small group of hikers: mostly accurate, still fast, and it happens to be exactly what GPUs are good at. Momentum is rolling a heavy ball instead of walking: it builds up speed in consistent directions and plows through small bumps.',
    explanation:
      'Gradient descent minimizes a loss L(theta) by iterating theta <- theta - lr * grad L(theta). Three variants differ in how much data computes each gradient. Batch GD uses the entire dataset: exact gradient, one slow step per epoch, infeasible for large data. Stochastic GD (SGD) uses a single random example: extremely noisy but cheap steps, and the noise can help escape shallow traps. Mini-batch GD uses 32-512 examples: a low-variance gradient estimate at GPU-friendly cost, and it is what everyone actually uses (confusingly also called SGD in papers). The learning rate lr is the single most important hyperparameter in ML: too small and training crawls and can stall on plateaus; too large and the loss oscillates or diverges to NaN. Momentum keeps an exponential moving average of past gradients and steps along that average, accelerating along consistent directions and damping oscillation across ravines. Adam additionally keeps a per-parameter moving average of squared gradients and divides the step by its square root, giving each parameter an adaptive learning rate — it is the robust default that usually works with lr = 1e-3 out of the box. Learning-rate schedules (step decay, cosine, warmup) reduce lr over time so you take big exploratory steps early and fine polishing steps late.',
    technicalDeep:
      'Convergence theory: for L-smooth convex functions, gradient descent with lr <= 1/L converges at O(1/t); with strong convexity it is linear (geometric). The critical threshold is lr < 2/L where L is the largest Hessian eigenvalue — beyond that, divergence along the sharpest direction. This is why the ratio of largest to smallest Hessian eigenvalue (the condition number) governs difficulty: a badly conditioned loss forces lr small enough for the steep direction, making progress along the shallow direction glacial. Momentum (Polyak) update: v <- beta * v + grad; theta <- theta - lr * v, with beta ~ 0.9 effectively amplifying the step along persistent directions by up to 1/(1-beta) = 10x. Nesterov momentum evaluates the gradient at the look-ahead point, improving the effective condition-number dependence from kappa to sqrt(kappa). Adam: m <- beta1 m + (1-beta1) g; v <- beta2 v + (1-beta2) g^2; with bias corrections m_hat = m/(1-beta1^t), v_hat = v/(1-beta2^t); step = lr * m_hat / (sqrt(v_hat) + eps). Defaults beta1=0.9, beta2=0.999, eps=1e-8. SGD noise scales inversely with batch size — larger batches give lower-variance gradients, which is why the linear scaling heuristic (double batch size, double lr) works up to a point. Warmup exists because early Adam steps have poorly estimated v, and large early steps in a random-init landscape are destructive.',
    whatBreaks:
      'Learning rate too high: loss oscillates, then explodes to NaN — the signature is loss going down briefly then blowing up. Learning rate too low: loss decreases imperceptibly slowly, easily misread as model has converged. Forgetting to shuffle data before mini-batching: if data is ordered by class, each batch gradient is biased and training zigzags or diverges. Using SGD tuning intuitions with Adam or vice versa — good SGD lr (0.1) is 100x a good Adam lr (0.001). Loss plateaus caused by saddle points or dead ReLUs get misdiagnosed as converged. Batch size too large without lr adjustment silently degrades generalization. No gradient clipping on RNNs/transformers lets one bad batch produce an exploding update that destroys the model mid-training.',
    efficientWay: {
      title: 'Learning and using gradient descent',
      approaches: [
        {
          name: 'The Genius Move: implement GD, momentum, and Adam from scratch in NumPy on a 2D loss you can plot, then use sklearn/PyTorch optimizers on a toy dataset, then compare both on a real dataset',
          verdict: 'best',
          reason: 'Plotting the optimization path on a 2D surface makes learning-rate and momentum behavior visceral, the library step teaches the production API, and the real-data comparison teaches you what actually matters at scale.',
        },
        {
          name: 'Start with library optimizers and tune lr by trial and error',
          verdict: 'ok',
          reason: 'You will get working models, and lr-finding by sweeping is a legitimate professional technique — but without the from-scratch pass you cannot explain or predict optimizer behavior, which shows in interviews and debugging.',
        },
        {
          name: 'Study convergence proofs before writing any code',
          verdict: 'weak',
          reason: 'Convex convergence theory barely describes deep-learning practice; leading with proofs delays the practical intuition that plots and experiments build in an hour.',
        },
      ],
      recommendation:
        'Implement vanilla GD, momentum, and Adam in NumPy (under 40 lines total) and race them on an ill-conditioned 2D bowl, plotting the paths. Then sweep lr across powers of 10 on a real dataset and watch the loss curves. After this you will read any loss curve like an ECG.',
    },
    commonMistakes: [
      'Sweeping learning rates linearly (0.01, 0.02, 0.03) instead of logarithmically (1e-4, 1e-3, 1e-2, 1e-1) — lr effects span orders of magnitude',
      'Judging convergence from training loss alone — a plateau can be a saddle, a dead-ReLU problem, or an lr too low, and validation loss may tell a different story',
      'Forgetting to zero/reset gradients between steps when hand-rolling training loops, so gradients accumulate and steps are garbage',
      'Copying a paper learning rate without copying its batch size, schedule, and warmup — lr is meaningless out of that context',
    ],
    seniorNotes:
      'Real-world default: AdamW at lr 1e-3 (or 3e-4 for transformers) with cosine decay and linear warmup covers 90% of cases; plain SGD with momentum 0.9 still wins on some vision tasks and generalizes slightly better when tuned. Learn the loss-curve diagnostics cold: NaN = lr too high or missing gradient clipping; smooth-but-slow = lr too low; noisy plateau = reduce lr or increase batch; train-val gap widening = overfitting, not an optimizer issue. At scale, the lr-batch size coupling matters: if you scale batch size 8x for throughput, scale lr and re-tune warmup or accuracy silently drops. Gradient clipping (norm 1.0) is cheap insurance on any attention-based model.',
    interviewQuestions: [
      'Compare batch, mini-batch, and stochastic gradient descent. Why does everyone use mini-batches in practice?',
      'What happens when the learning rate is too high or too low, and how do you find a good one?',
      'Explain momentum and Adam intuitively. When might plain SGD with momentum still be preferred over Adam?',
    ],
    interviewAnswers: [
      'Batch GD computes the exact gradient over the full dataset per step — accurate but one expensive step per epoch and infeasible memory-wise at scale. SGD uses one sample — cheap, very noisy, sequential. Mini-batch (32-512 samples) is the practical middle: the gradient estimate has low enough variance, the matrix math saturates GPU parallelism, and the residual noise even acts as a regularizer and helps escape saddles. In papers, SGD almost always means mini-batch SGD.',
      'Too high: updates overshoot the minimum, loss oscillates or diverges to NaN — the model can also bounce around a wide basin and never settle. Too low: convergence is painfully slow and can stall on plateaus, wasting compute and masquerading as convergence. To find a good one: sweep on a log scale (1e-4 to 1), or run an lr range test — increase lr each batch and pick a value about 10x below where loss starts exploding. Then add a decay schedule so late training uses smaller steps.',
      'Momentum keeps an exponential moving average of gradients: consistent directions accumulate speed while oscillating directions cancel, like a heavy ball rolling downhill — this accelerates progress along ravines. Adam adds a second moving average of squared gradients and divides each parameter step by its RMS, giving per-parameter adaptive rates plus bias correction — robust across problems with minimal tuning. SGD+momentum is still often preferred in vision because, when well tuned with a schedule, it can generalize slightly better than Adam, and its behavior is simpler to reason about; AdamW is the default for transformers and sparse-gradient problems.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'GD vs momentum vs Adam from scratch, raced on an ill-conditioned bowl',
        code: "import numpy as np\n\n# Ill-conditioned loss: f(x, y) = x^2 + 25 y^2  (steep in y, shallow in x)\ndef loss(p):\n    return p[0] ** 2 + 25 * p[1] ** 2\n\ndef grad(p):\n    return np.array([2 * p[0], 50 * p[1]])\n\nstart = np.array([-8.0, 2.0])\nsteps = 60\n\n# --- Vanilla gradient descent ---\np = start.copy()\nlr = 0.03   # limited by the steep y direction (lr < 2/50)\nfor _ in range(steps):\n    p = p - lr * grad(p)\nprint('vanilla GD  :', p, 'loss', round(loss(p), 6))\n\n# --- Momentum ---\np, v = start.copy(), np.zeros(2)\nlr, beta = 0.03, 0.9\nfor _ in range(steps):\n    v = beta * v + grad(p)\n    p = p - lr * v\nprint('momentum    :', p, 'loss', round(loss(p), 6))\n\n# --- Adam ---\np = start.copy()\nm, v = np.zeros(2), np.zeros(2)\nlr, b1, b2, eps = 0.5, 0.9, 0.999, 1e-8\nfor t in range(1, steps + 1):\n    g = grad(p)\n    m = b1 * m + (1 - b1) * g\n    v = b2 * v + (1 - b2) * g ** 2\n    m_hat = m / (1 - b1 ** t)\n    v_hat = v / (1 - b2 ** t)\n    p = p - lr * m_hat / (np.sqrt(v_hat) + eps)\nprint('adam        :', p, 'loss', round(loss(p), 6))\n# Momentum and Adam reach the minimum far faster than vanilla GD\n# because the ill-conditioning (25x curvature ratio) cripples plain GD.",
      },
      {
        lang: 'python',
        label: 'Mini-batch SGD on real data with sklearn, sweeping learning rates',
        code: "import numpy as np\nfrom sklearn.datasets import fetch_california_housing\nfrom sklearn.linear_model import SGDRegressor\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import mean_squared_error\n\nX, y = fetch_california_housing(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42)\n\n# Scaling is NOT optional for gradient descent: unscaled features\n# create exactly the ill-conditioned bowl from the previous example.\nscaler = StandardScaler().fit(X_train)\nX_train_s = scaler.transform(X_train)\nX_test_s = scaler.transform(X_test)\n\nfor lr in [1e-4, 1e-3, 1e-2, 1e-1]:   # always sweep on a log scale\n    model = SGDRegressor(learning_rate='constant', eta0=lr,\n                         max_iter=1000, tol=1e-4, random_state=42)\n    model.fit(X_train_s, y_train)\n    mse = mean_squared_error(y_test, model.predict(X_test_s))\n    print('lr =', lr, '-> test MSE =', round(mse, 4))\n# Typical result: 1e-4 underfits (too slow), 1e-1 is unstable,\n# 1e-2 lands near the closed-form linear regression solution.",
      },
    ],
    resources: [
      { label: '3Blue1Brown — Gradient descent, how neural networks learn', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', kind: 'video' },
      { label: 'Andrew Ng — Machine Learning Specialization', url: 'https://www.coursera.org/specializations/machine-learning-introduction', kind: 'course' },
      { label: 'Google ML Crash Course (gradient descent + lr playground)', url: 'https://developers.google.com/machine-learning/crash-course', kind: 'course' },
      { label: 'StatQuest — Gradient Descent, clearly explained', url: 'https://www.youtube.com/@statquest', kind: 'video' },
    ],
  },
  {
    id: 'loss-landscapes',
    phase: 3,
    phaseName: 'Calculus & Optimization',
    orderIndex: 4,
    estimatedMins: 40,
    prerequisites: ['gradient-descent', 'jacobian-hessian-chain-rule'],
    title: 'Loss Landscapes: Minima, Saddles & Convexity',
    eli5:
      'Picture the error of your model as a landscape: every location is a different setting of the knobs, and the height is how wrong the model is. Some landscapes are one smooth bowl — roll a ball anywhere and it finds the bottom. Others are mountain ranges full of dips, ridges, and mountain passes. Training is rolling a ball on this landscape, and the shape of the landscape decides whether that is easy or a nightmare.',
    analogy:
      'A convex loss is a satellite-guided descent into a single crater: any downhill path ends at the one true bottom, guaranteed. A neural-network loss is hiking the Himalayas at night: countless valleys (local minima), and — the surprising part — the thing that actually slows you down is not fake valleys but mountain passes (saddle points): places that are downhill in some directions and uphill in others, where the ground feels flat and you wander. In millions of dimensions, almost every flat spot is a pass, not a valley.',
    explanation:
      'The loss landscape is the graph of the loss as a function of all model parameters. Key features: a global minimum is the lowest point anywhere; a local minimum is lower than all its neighbors but maybe not the lowest overall; a saddle point has zero gradient but is a minimum along some directions and a maximum along others; a plateau is a wide, nearly flat region. A function is convex if the line segment between any two points on its graph never dips below the graph — equivalently, any local minimum is automatically global. Linear regression with squared loss and logistic regression with cross-entropy are convex, which is why they train reliably and reproducibly. Neural network losses are highly non-convex, and the classical fear was getting stuck in bad local minima. The modern understanding is different: in very high dimensions, critical points with zero gradient are overwhelmingly saddle points rather than minima, and the local minima that exist tend to have similar, good loss values. What actually slows training is the flat neighborhoods around saddles and plateaus — which is precisely why momentum, Adam, and SGD noise (which perturbs you off the unstable saddle directions) matter so much in practice.',
    technicalDeep:
      'Formal convexity: f is convex iff f(a x + (1-a) y) <= a f(x) + (1-a) f(y) for a in [0,1]; for twice-differentiable f this is equivalent to a positive semi-definite Hessian everywhere. Convexity gives the strongest guarantee in optimization: every stationary point is a global minimum, and gradient descent with proper step size provably converges to it. For non-convex landscapes, the random-matrix heuristic explains saddle dominance: at a critical point, classify by Hessian eigenvalue signs; if each of n eigenvalues were independently positive or negative with even odds, the probability all n are positive (a true local minimum) is 2^-n — vanishingly small for n in the millions. Empirically (Dauphin et al. 2014), critical points with higher loss have more negative eigenvalues, and the local minima that exist cluster near the global loss value. Saddles are slow for first-order methods because the gradient is small nearby while the escape direction (negative-curvature eigenvector) is only revealed by second-order information; SGD noise implicitly kicks the iterate along it. Related practical geometry: flat minima (small Hessian eigenvalues, wide basins) empirically generalize better than sharp minima — one motivation for small/medium batch sizes, whose gradient noise biases search toward wide basins. Skip connections and normalization visibly smooth the landscape (Li et al. 2018 loss-landscape visualizations), which is a large part of why very deep networks became trainable.',
    whatBreaks:
      'Assuming convexity where there is none: averaging the weights of two independently trained neural networks usually produces a terrible model (the midpoint of a non-convex landscape can be a hill), whereas averaging two logistic-regression solutions is safe. Treating a plateau as convergence and stopping training right before the optimizer would have escaped a saddle. Blaming bad local minima for what is actually a data, learning-rate, or initialization problem. Non-convexity also breaks reproducibility: different seeds land in different basins, so single-seed comparisons of architectures can be pure noise. Sharp minima found by huge-batch training can ace the training set and quietly generalize worse.',
    efficientWay: {
      title: 'Understanding optimization landscapes',
      approaches: [
        {
          name: 'Visualize concrete 2D landscapes in NumPy/matplotlib — a convex bowl, a saddle, a multi-minima surface — and watch gradient descent paths on each; verify convexity claims via Hessian eigenvalues',
          verdict: 'best',
          reason: 'The concepts are geometric, so seeing an optimizer stall on a saddle and escape with momentum teaches more than any definition. The Hessian check connects the picture back to the math.',
        },
        {
          name: 'Memorize the definitions (convexity inequality, critical point taxonomy) from a textbook',
          verdict: 'ok',
          reason: 'You need the definitions for interviews, but without the pictures and experiments they stay inert and you will not recognize a saddle stall in a real loss curve.',
        },
        {
          name: 'Dismiss the topic because optimizers handle it automatically',
          verdict: 'weak',
          reason: 'The landscape explains WHY Adam/momentum/warmup/batch-size choices work. Without it, hyperparameter tuning is cargo-culting.',
        },
      ],
      recommendation:
        'Plot three 2D surfaces (bowl, saddle, egg-carton) and overlay gradient-descent trajectories from several starts with and without momentum. Then compute Hessian eigenvalues at each critical point to classify it. Two hours, and saddle points stop being abstract forever.',
    },
    commonMistakes: [
      'Believing local minima are the main enemy in deep learning — in high dimensions saddle points and plateaus dominate, and reachable minima are mostly fine',
      'Concluding a model has converged because loss is flat, when it is actually creeping across a saddle or plateau that a schedule change would escape',
      'Assuming a convex loss means the whole ML problem is solved — convex optimization can still be ill-conditioned, and the model can still underfit badly',
      'Comparing two architectures with one seed each — different basins of a non-convex landscape can easily produce differences bigger than the true architecture effect',
    ],
    seniorNotes:
      'Convexity is a system-design property, not just math trivia: convex models (linear/logistic regression, SVMs) train deterministically to the same answer every time, which matters for regulated, auditable, or frequently-retrained pipelines — sometimes you choose them over deep nets for exactly this reason. For deep models, run multi-seed experiments before believing improvements; know that warmup exists partly because early training navigates the most chaotic region of the landscape; and remember the flat-minima heuristic when someone proposes 32x-ing the batch size for throughput. Loss-landscape smoothing is a hidden reason architectural staples (residual connections, normalization) work — the interview-grade answer to why can we train 100-layer networks now.',
    interviewQuestions: [
      'What is a convex function, and why is convexity such a valuable property for machine learning?',
      'In high-dimensional neural network training, are local minima the main obstacle? What actually slows optimization down?',
      'What is a saddle point, and how do practical optimizers escape them?',
    ],
    interviewAnswers: [
      'A function is convex if every chord lies on or above the graph — equivalently, for twice-differentiable functions, the Hessian is positive semi-definite everywhere. The payoff: any local minimum is global, so gradient descent with a sane step size is guaranteed to find the best solution, training is reproducible across seeds, and convergence theory gives real rates. Linear regression (squared loss) and logistic regression (cross-entropy) are convex, which is why they are the reliable workhorses of the field.',
      'No — that was the classical fear, but modern evidence says otherwise. In n dimensions, a zero-gradient point needs all n Hessian eigenvalues positive to be a minimum; heuristically that is exponentially unlikely, so almost all critical points are saddles. Empirically, the local minima that do exist in large networks tend to have loss values close to the global one. The real slowdowns are the nearly-flat plateaus around saddle points and ill-conditioned ravines — regions where the gradient is tiny — plus sharp minima that generalize poorly.',
      'A saddle point has zero gradient but mixed Hessian curvature: uphill along some eigenvector directions, downhill along others — a mountain pass. Plain gradient descent stalls because the gradient vanishes there while first-order methods cannot see the negative-curvature escape direction. In practice, SGD mini-batch noise randomly perturbs the iterate off the unstable direction, momentum carries accumulated velocity through the flat region, and adaptive methods like Adam amplify the small gradients. Saddles are unstable equilibria, so any perturbation eventually escapes — the cost is wasted time, not permanent capture.',
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'Convex bowl vs saddle vs multi-minima: classify critical points and watch GD behave',
        code: "import numpy as np\n\n# Three landscapes on R^2\nbowl = {\n    'f': lambda p: p[0] ** 2 + p[1] ** 2,\n    'grad': lambda p: np.array([2 * p[0], 2 * p[1]]),\n    'H': lambda p: np.array([[2, 0], [0, 2]]),\n}\nsaddle = {\n    'f': lambda p: p[0] ** 2 - p[1] ** 2,\n    'grad': lambda p: np.array([2 * p[0], -2 * p[1]]),\n    'H': lambda p: np.array([[2, 0], [0, -2]]),\n}\n# Non-convex 'egg carton' with many minima\ncarton = {\n    'f': lambda p: np.sin(3 * p[0]) * np.cos(3 * p[1]) + 0.1 * (p[0] ** 2 + p[1] ** 2),\n}\n\nfor name, land in [('bowl', bowl), ('saddle', saddle)]:\n    eig = np.linalg.eigvalsh(land['H'](np.zeros(2)))\n    convex_here = bool(np.all(eig >= 0))\n    print(name, '| Hessian eigenvalues at origin:', eig, '| PSD (locally convex):', convex_here)\n\n# GD starting EXACTLY on the saddle axis stalls; a tiny perturbation escapes\nfor start in [np.array([0.0, 0.0]), np.array([0.0, 1e-6])]:\n    p = start.copy()\n    for _ in range(200):\n        p = p - 0.05 * saddle['grad'](p)\n    print('saddle GD from', start, '-> ended at', p, '| f =', saddle['f'](p))\n# From (0,0): stuck forever at the saddle (zero gradient).\n# From (0,1e-6): the negative-curvature direction amplifies and f -> -inf.\n# This is exactly the role SGD noise plays in real training.",
      },
      {
        lang: 'python',
        label: 'Convexity in practice: averaging two logistic regressions is safe, averaging two neural nets is not',
        code: "import numpy as np\nfrom sklearn.datasets import make_moons\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.neural_network import MLPClassifier\nfrom sklearn.model_selection import train_test_split\n\nX, y = make_moons(n_samples=1000, noise=0.25, random_state=0)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)\n\ndef acc_from_linear(w, b):\n    return np.mean(((X_te @ w + b) > 0).astype(int) == y_te)\n\n# Convex model: two seeds converge to (essentially) the same solution,\n# and the midpoint of the two weight vectors is just as good.\nlrs = [LogisticRegression(max_iter=2000).fit(X_tr, y_tr) for _ in range(2)]\nw_avg = (lrs[0].coef_[0] + lrs[1].coef_[0]) / 2\nb_avg = (lrs[0].intercept_[0] + lrs[1].intercept_[0]) / 2\nprint('logreg seed accs :', [m.score(X_te, y_te) for m in lrs])\nprint('logreg averaged  :', acc_from_linear(w_avg, b_avg))\n\n# Non-convex model: different seeds land in different basins;\n# averaging their weights can land on a hill between basins.\nnets = [MLPClassifier(hidden_layer_sizes=(16,), max_iter=3000,\n                      random_state=s).fit(X_tr, y_tr) for s in (0, 1)]\navg = MLPClassifier(hidden_layer_sizes=(16,), max_iter=1, random_state=0).fit(X_tr, y_tr)\navg.coefs_ = [(a + b) / 2 for a, b in zip(nets[0].coefs_, nets[1].coefs_)]\navg.intercepts_ = [(a + b) / 2 for a, b in zip(nets[0].intercepts_, nets[1].intercepts_)]\nprint('net seed accs    :', [m.score(X_te, y_te) for m in nets])\nprint('net averaged     :', avg.score(X_te, y_te))\n# Typical: both nets ~0.97 individually, the averaged net far worse -> non-convexity, visible.",
      },
    ],
    resources: [
      { label: 'StatQuest — optimization and ML fundamentals', url: 'https://www.youtube.com/@statquest', kind: 'video' },
      { label: 'Mathematics for Machine Learning — Ch. 7 (Continuous Optimization)', url: 'https://mml-book.github.io/', kind: 'book' },
      { label: '3Blue1Brown — Neural Networks playlist (landscape visuals)', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', kind: 'video' },
    ],
  },
]
