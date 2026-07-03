import type { CurriculumTopic } from '@/types'

/** Phase 6 — Deep Learning (8 topics). */
export const AIML_P6: CurriculumTopic[] = [
  {
    "id": "neural-networks-scratch",
    "phase": 6,
    "phaseName": "Deep Learning",
    "orderIndex": 1,
    "estimatedMins": 55,
    "prerequisites": ["gradient-descent", "matrix-operations", "jacobian-hessian-chain-rule"],
    "title": "Neural Networks from Scratch",
    "eli5": "A neuron is a tiny voter: it takes several numbers, weighs each one by how much it trusts it, adds them up, and shouts only if the total is exciting enough. Stack thousands of these voters in layers — each layer voting on the previous layer's shouts — and the crowd can learn to recognize handwriting, even though no single voter understands anything.",
    "analogy": "A neural network is an assembly line for meaning. Raw pixels enter at one end. The first station's workers detect simple things (edges, blobs). The next station combines those into parts (loops, strokes). The final station reads parts as digits. Nobody designed the stations' skills — training slowly adjusts each worker until the line's final output stops being wrong. The activation function is each worker's rule for when to bother passing anything along; without it, the whole line would collapse into one station that can only draw straight lines.",
    "explanation": "A feedforward network is alternating layers of two operations: an affine map z = W x + b (matrix multiply plus bias) and an elementwise nonlinearity a = f(z) such as ReLU or sigmoid. The nonlinearity is essential — composing linear maps yields just another linear map, so without activations a 100-layer net equals 1-layer linear regression. With them, the universal approximation theorem says even one wide hidden layer can approximate any continuous function; depth makes that approximation exponentially more parameter-efficient by reusing features hierarchically. Training means choosing a loss (cross-entropy for classification, MSE for regression) and running gradient descent on all weights — the gradients come from backpropagation, which is the next topic. The Genius Move of this phase: build the whole thing in NumPy first. Once you have written forward pass, loss, and the update loop yourself, PyTorch stops being magic and becomes an autodiff-and-GPU convenience layer over math you own.",
    "technicalDeep": "Shapes discipline is 90% of scratch-building: for a batch X of shape (B, d_in), layer weights W of shape (d_in, d_out) give Z = X @ W + b of shape (B, d_out). A 2-layer MNIST-class net is: Z1 = X W1 + b1; A1 = relu(Z1); Z2 = A1 W2 + b2; probabilities via softmax(Z2) with the log-sum-exp trick (subtract the row max before exponentiating, or exp overflows). Cross-entropy loss combines with softmax to give the famously clean output gradient dZ2 = (probs - one_hot(y)) / B. Activations to know: sigmoid (squashes to (0,1); saturates — gradient at most 0.25, vanishing in depth), tanh (zero-centered, still saturates), ReLU max(0, z) (default: cheap, non-saturating for positive z, but units can die if they land permanently negative), and modern smooth variants (GELU in transformers). Initialization is not cosmetic: all-zeros makes every unit in a layer compute identical gradients forever (symmetry never breaks); He initialization (std = sqrt(2/fan_in)) keeps activation variance stable through ReLU layers, and Xavier/Glorot suits tanh/sigmoid.",
    "whatBreaks": "Forgetting the nonlinearity silently gives a deep-looking model with linear capacity — it trains, plateaus early, and nobody knows why. Zero initialization freezes learning through symmetry; too-large initialization saturates sigmoids or explodes activations. Naive softmax overflows on logits above ~700 (exp of float64 limit) — the log-sum-exp trick is mandatory, not optional. Shape bugs are the scratch-builder's tax: NumPy broadcasting will happily 'succeed' at adding a (B,) bias where you meant (1, d_out), corrupting math without an error. And a learning rate 10x too high makes the loss bounce or NaN within a few steps — the first diagnostic for any diverging network.",
    "efficientWay": {
      "title": "The Scratch-First Path",
      "approaches": [
        {
          "name": "NumPy 2-layer net on MNIST-like data, verify gradients numerically, then rebuild the identical net in PyTorch and confirm matching loss curves",
          "verdict": "best",
          "reason": "This is the Genius Move: scratch first makes every framework concept (autograd, nn.Linear, optimizers) land as 'oh, that automates the thing I wrote'. The gradient check and the matching-curves test prove correctness instead of hoping."
        },
        {
          "name": "Start directly in PyTorch following the official tutorial",
          "verdict": "ok",
          "reason": "You will ship something quickly, but nn.Module stays a black box, and the first silent shape bug or NaN loss will cost you the week you saved."
        },
        {
          "name": "Watch neural-network videos until it 'makes sense', then move on",
          "verdict": "weak",
          "reason": "Passive intuition evaporates under a shape error. The gap between watching 3Blue1Brown and writing a working forward pass is exactly the learning."
        }
      ],
      "recommendation": "Write forward pass, cross-entropy, manual gradients, and the SGD loop in ~80 lines of NumPy; validate with a numerical gradient check (should agree to ~1e-7). Then rebuild in PyTorch with nn.Sequential and confirm the loss curves overlap. Karpathy's Zero to Hero micrograd lecture is the ideal companion."
    },
    "commonMistakes": [
      "Stacking linear layers without activations and wondering why depth adds nothing",
      "Initializing weights to zeros (symmetry never breaks) or with the wrong scale for the activation (use He for ReLU, Xavier for tanh)",
      "Computing softmax without the log-sum-exp stabilization and getting NaN on the first confident prediction",
      "Ignoring tensor shapes until something crashes — assert shapes at every layer while learning; broadcasting hides bugs that do not crash"
    ],
    "seniorNotes": "Every senior deep-learning engineer has a mental checklist born from scratch-building: check shapes, check init, check the loss at step 0 (a 10-class classifier should start near ln(10) = 2.303 — if not, the wiring is wrong), overfit a tiny batch of 32 examples to near-zero loss before training on everything (if you cannot overfit 32 examples, you have a bug, not a hard problem). These sanity rituals come from Karpathy's 'recipe' and catch 80% of deep-learning bugs before a GPU-hour is spent. The NumPy net you build here is also the honest answer to the interview classic 'could you implement a neural net without a framework?' — and surprisingly many candidates cannot.",
    "interviewQuestions": [
      "Why do neural networks need nonlinear activation functions?",
      "Why is initializing all weights to zero a fatal mistake?",
      "Your new classifier's initial loss is 8.2 on a 10-class problem. What does that tell you?"
    ],
    "interviewAnswers": [
      "A composition of affine maps is affine: W2(W1 x + b1) + b2 collapses to a single W x + b, so any depth of purely linear layers has exactly the capacity of one linear layer — it can only draw hyperplanes. Elementwise nonlinearities between layers break this collapse, letting each layer bend the representation so later layers can separate what earlier layers could not. That composition of simple nonlinear steps is what gives depth its exponential expressiveness.",
      "With identical (zero) weights, every neuron in a layer receives the same inputs, computes the same output, and — critically — receives the identical gradient during backprop. They update in lockstep and remain permanently identical: the layer has effectively one neuron regardless of its width. Random initialization breaks this symmetry; scaled random initialization (He/Xavier) additionally keeps activation and gradient variance stable across layers so signals neither vanish nor explode at step 0.",
      "With balanced classes and random init, predictions should start near uniform, so cross-entropy should be about -ln(1/10) = 2.303. A starting loss of 8.2 means the model is confidently wrong before seeing any data — classic symptoms: bad initialization scale blowing up the logits, a missing softmax/log somewhere, mislabeled or shifted targets, or inputs not normalized. The step-0 loss check is a free unit test on the entire wiring, which is exactly why seniors always look at it first."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Two-layer neural net in pure NumPy (forward, backward, SGD)",
        "code": "import numpy as np\nfrom sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_digits(return_X_y=True)          # 8x8 digit images, 10 classes\nX = X / 16.0                                   # scale pixels to [0,1]\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)\n\nrng = np.random.default_rng(0)\nD, H, C = 64, 128, 10\nW1 = rng.normal(0, np.sqrt(2.0 / D), (D, H)); b1 = np.zeros(H)   # He init\nW2 = rng.normal(0, np.sqrt(2.0 / H), (H, C)); b2 = np.zeros(C)\n\ndef softmax(z):\n    z = z - z.max(axis=1, keepdims=True)       # log-sum-exp stability\n    e = np.exp(z)\n    return e / e.sum(axis=1, keepdims=True)\n\nlr, B = 0.5, 64\nfor step in range(2001):\n    idx = rng.choice(len(X_tr), B)\n    x, t = X_tr[idx], y_tr[idx]\n    # forward\n    z1 = x @ W1 + b1\n    a1 = np.maximum(0, z1)                     # ReLU\n    probs = softmax(a1 @ W2 + b2)\n    if step % 500 == 0:\n        loss = -np.log(probs[np.arange(B), t] + 1e-12).mean()\n        acc = (softmax(np.maximum(0, X_te @ W1 + b1) @ W2 + b2)\n               .argmax(1) == y_te).mean()\n        print('step %4d  loss %.3f  test acc %.3f' % (step, loss, acc))\n    # backward (hand-derived gradients)\n    dz2 = probs.copy(); dz2[np.arange(B), t] -= 1; dz2 /= B\n    dW2 = a1.T @ dz2; db2 = dz2.sum(0)\n    da1 = dz2 @ W2.T\n    dz1 = da1 * (z1 > 0)                       # ReLU gradient\n    dW1 = x.T @ dz1; db1 = dz1.sum(0)\n    # SGD update\n    W1 -= lr * dW1; b1 -= lr * db1\n    W2 -= lr * dW2; b2 -= lr * db2"
      },
      {
        "lang": "python",
        "label": "The same network in PyTorch (the payoff of scratch-first)",
        "code": "import torch\nimport torch.nn as nn\nfrom sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_digits(return_X_y=True)\nX_tr, X_te, y_tr, y_te = train_test_split(X / 16.0, y, random_state=0)\nX_tr = torch.tensor(X_tr, dtype=torch.float32)\ny_tr = torch.tensor(y_tr)\nX_te = torch.tensor(X_te, dtype=torch.float32)\ny_te = torch.tensor(y_te)\n\nmodel = nn.Sequential(nn.Linear(64, 128), nn.ReLU(), nn.Linear(128, 10))\nopt = torch.optim.SGD(model.parameters(), lr=0.5)\nloss_fn = nn.CrossEntropyLoss()               # softmax + NLL fused\n\nfor step in range(2001):\n    idx = torch.randint(0, len(X_tr), (64,))\n    loss = loss_fn(model(X_tr[idx]), y_tr[idx])\n    opt.zero_grad()\n    loss.backward()                            # autograd = your backward pass\n    opt.step()\n    if step % 500 == 0:\n        with torch.no_grad():\n            acc = (model(X_te).argmax(1) == y_te).float().mean().item()\n        print('step %4d  loss %.3f  test acc %.3f' % (step, loss.item(), acc))"
      }
    ],
    "resources": [
      { "label": "3Blue1Brown — Neural Networks (visual foundations)", "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", "kind": "video" },
      { "label": "Karpathy — Neural Networks: Zero to Hero", "url": "https://karpathy.ai/zero-to-hero.html", "kind": "course" },
      { "label": "PyTorch official tutorials", "url": "https://pytorch.org/tutorials/", "kind": "docs" }
    ]
  },
  {
    "id": "backpropagation",
    "phase": 6,
    "phaseName": "Deep Learning",
    "orderIndex": 2,
    "estimatedMins": 55,
    "prerequisites": ["neural-networks-scratch", "jacobian-hessian-chain-rule"],
    "title": "Backpropagation",
    "eli5": "A factory makes a bad toy. The inspector at the end says 'this is 30% too wobbly'. That blame flows backward station by station: the last station figures out how much of the wobble it caused and passes the rest back, and so on to the first station. Every station then adjusts its own dial by exactly its share of the blame. Backprop is that blame-passing, done with calculus.",
    "analogy": "Backprop is like tracing a wrong figure in a spreadsheet with chained formulas. Cell C depends on B, which depends on A. When the final number is off, you do not recompute the world — you ask 'how sensitive is C to B?' then 'how sensitive is B to A?' and multiply the sensitivities down the chain. A computational graph is exactly that spreadsheet, and backprop visits each cell once, backwards, reusing every intermediate sensitivity instead of re-deriving it per input.",
    "explanation": "Backpropagation computes the gradient of the loss with respect to every parameter by applying the chain rule over the network's computational graph — the DAG of primitive operations recorded during the forward pass. Each node knows only its local derivative; backprop multiplies incoming upstream gradients by these local derivatives and passes them along, accumulating where paths merge. The crucial insight is efficiency: because the loss is a single scalar, reverse-mode differentiation computes the gradient for ALL n parameters in one backward sweep costing roughly one more forward pass — versus n forward passes for forward-mode or numerical differentiation. That asymmetry is the reason training billion-parameter models is possible at all. Autograd frameworks (PyTorch) simply automate the bookkeeping: record ops on a tape, then walk it backwards.",
    "technicalDeep": "For a layer Z = X W + b inside a batch graph with upstream gradient dZ (same shape as Z): dW = X^T dZ, dX = dZ W^T, db = sum of dZ over the batch axis — three formulas that cover most of deep learning; you can rederive them by matching shapes. Elementwise activations multiply pointwise: dZ_pre = dA * f'(Z). Gradients vanish or explode by the same mechanism: the backward pass is a product of per-layer Jacobians, so if their typical singular values are below 1 the product shrinks geometrically with depth (sigmoid's max slope of 0.25 makes 20 sigmoid layers attenuate gradients by up to 0.25^20 ~ 1e-12), and above 1 it grows geometrically until float overflow — this, not the forward pass, is why depth was historically hard. The modern fixes each target that product: ReLU (slope exactly 1 where active), careful init keeping Jacobian scale near 1, residual connections (the +x skip contributes an identity term to the Jacobian, giving gradients a highway), normalization layers, and gradient clipping for the exploding side (standard in RNNs). Always verify a hand-written backward with a numerical gradient check: (f(w + h) - f(w - h)) / 2h, agreement to ~1e-7 in float64.",
    "whatBreaks": "Vanishing gradients show up as early layers whose weights barely move while late layers train — the network 'learns' but plateaus far below capacity. Exploding gradients show up as loss spikes then NaN; the product of Jacobians overflowed. Subtler killers: forgetting to zero gradients between steps in PyTorch (grads accumulate by design, so you silently train with a running sum of stale gradients), detaching a tensor mid-graph and cutting the gradient path so upstream layers get exactly zero signal, and in-place operations that overwrite values autograd still needs (PyTorch raises an error if it notices; hand-rolled NumPy backprop just goes quietly wrong — which is why the numerical gradient check is non-negotiable).",
    "efficientWay": {
      "title": "Owning the Backward Pass",
      "approaches": [
        {
          "name": "Build a micrograd-style scalar autograd engine, verify with numerical gradient checks, then inspect PyTorch .grad on the same tiny graph",
          "verdict": "best",
          "reason": "Karpathy's micrograd exercise (~100 lines: a Value class with .backward() doing topological-sort chain rule) permanently demystifies autograd. Matching your engine's gradients against both numerical checks and PyTorch is proof, not vibes."
        },
        {
          "name": "Derive the matrix backward formulas for one 2-layer net on paper and implement them once",
          "verdict": "ok",
          "reason": "You did this in the previous topic — necessary but not sufficient; without the graph view you will not understand why arbitrary architectures (branches, skips, shared weights) 'just work' in autograd."
        },
        {
          "name": "Trust loss.backward() and never look inside",
          "verdict": "weak",
          "reason": "Fine until the first NaN, silent detach, or vanishing-gradient plateau — then the black box costs you days that one week of scratch-building would have saved."
        }
      ],
      "recommendation": "Do the micrograd build (Zero to Hero lecture 1), gradient-check it numerically, then rebuild the same graph in PyTorch and compare .grad tensors elementwise. Finish by intentionally breaking things: stack 20 sigmoid layers and plot per-layer gradient norms to watch vanishing happen in real time."
    },
    "commonMistakes": [
      "Forgetting optimizer.zero_grad() so gradients accumulate across steps — the classic silent PyTorch bug",
      "Confusing the gradient of the loss with the local derivative of a layer — backprop multiplies the upstream gradient by the local Jacobian; neither alone is the update signal",
      "Skipping numerical gradient checks on hand-written backward passes, letting sign or transpose errors 'train' anyway at degraded quality",
      "Believing vanishing gradients are only an RNN problem — any deep stack of saturating activations without skips or normalization suffers the same geometric attenuation"
    ],
    "seniorNotes": "Seniors treat gradient flow as a observable system property, not theory: logging per-layer gradient norms is standard in serious training runs, and a norm histogram collapsing toward zero (or spiking) is diagnosed like a memory leak. Residual connections are understood mechanically — the identity term in the Jacobian is why 100+ layer networks train at all, and why 'just add skips' fixes more stuck models than any optimizer swap. Know memory too: backprop must store forward activations (that is what fills GPU memory, not parameters), and activation checkpointing trades ~30% more compute for O(sqrt(n)) activation memory — the standard lever for training large models. Reverse-mode autodiff is also why one scalar loss is cheap but per-sample Jacobians are expensive.",
    "interviewQuestions": [
      "Why is backpropagation so much cheaper than numerically estimating each parameter's gradient?",
      "Mechanically, why do gradients vanish or explode with depth, and name three architectural fixes.",
      "In PyTorch, what goes wrong if you forget optimizer.zero_grad()?"
    ],
    "interviewAnswers": [
      "Numerical differentiation perturbs one parameter at a time, requiring a full forward pass per parameter — O(n) forward passes for n parameters, hopeless at millions. Reverse-mode autodiff exploits the fact that the loss is one scalar: a single backward sweep over the computational graph propagates sensitivities from loss to every parameter simultaneously, reusing shared intermediate derivatives, at a cost of roughly one extra forward pass total. It trades memory (stored activations) for that speed, which is exactly the trade GPUs are provisioned around.",
      "The backward pass multiplies the Jacobians of every layer between the loss and a given weight. A product of many matrices whose typical singular values are below 1 decays geometrically toward zero (vanishing — early layers get no learning signal); above 1 it grows geometrically (exploding — loss NaNs). Fixes: (1) non-saturating activations like ReLU whose derivative is 1 in the active region; (2) initialization schemes (He/Xavier) that keep Jacobian scale near 1 at the start; (3) residual/skip connections, whose identity term gives gradients an attenuation-free path; plus batch/layer normalization to keep activations in well-behaved ranges, and gradient clipping to cap the exploding side.",
      "PyTorch accumulates into .grad on every backward() call by design (to support gradient accumulation across micro-batches). Without zero_grad(), each step's update uses the running SUM of all previous gradients — effectively an ever-growing, stale momentum. Symptoms are a model that trains erratically or diverges, with no error raised. The fix is calling optimizer.zero_grad() (or model.zero_grad()) each iteration before backward(), or intentionally exploiting accumulation to simulate larger batch sizes on limited GPU memory."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Numerical gradient check + watching gradients vanish through sigmoid stacks",
        "code": "import numpy as np\n\nrng = np.random.default_rng(0)\n\n# --- 1) numerical gradient check for a tiny 1-layer net ---\nX = rng.normal(size=(5, 4)); y = np.array([0, 1, 1, 0, 1])\nW = rng.normal(size=(4, 2)) * 0.1\n\ndef loss_fn(W):\n    z = X @ W\n    z = z - z.max(1, keepdims=True)\n    p = np.exp(z) / np.exp(z).sum(1, keepdims=True)\n    return -np.log(p[np.arange(5), y]).mean()\n\n# analytic gradient (softmax + CE)\nz = X @ W; z -= z.max(1, keepdims=True)\np = np.exp(z) / np.exp(z).sum(1, keepdims=True)\ndz = p.copy(); dz[np.arange(5), y] -= 1; dz /= 5\ndW_analytic = X.T @ dz\n\n# numerical gradient (centered differences)\nh, dW_num = 1e-5, np.zeros_like(W)\nfor i in range(W.shape[0]):\n    for j in range(W.shape[1]):\n        Wp = W.copy(); Wp[i, j] += h\n        Wm = W.copy(); Wm[i, j] -= h\n        dW_num[i, j] = (loss_fn(Wp) - loss_fn(Wm)) / (2 * h)\nerr = np.abs(dW_analytic - dW_num).max()\nprint('max gradient error: %.2e (should be < 1e-7)' % err)\n\n# --- 2) vanishing gradients: product of sigmoid-layer Jacobians ---\ndef sigmoid(x):\n    return 1.0 / (1.0 + np.exp(-x))\n\nx = rng.normal(size=64)\ngrad = np.ones(64)\nfor depth in range(1, 21):\n    Wl = rng.normal(size=(64, 64)) * (1.0 / np.sqrt(64))\n    a = sigmoid(Wl @ x)\n    grad = (Wl.T @ grad) * a * (1 - a)   # chain rule through the layer\n    x = a\n    if depth % 5 == 0:\n        print('depth %2d  gradient norm: %.3e' % (depth, np.linalg.norm(grad)))\n# norm collapses geometrically -> early layers learn nothing"
      }
    ],
    "resources": [
      { "label": "Karpathy — Zero to Hero (micrograd: build backprop yourself)", "url": "https://karpathy.ai/zero-to-hero.html", "kind": "course" },
      { "label": "3Blue1Brown — What is backpropagation really doing?", "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", "kind": "video" },
      { "label": "CS231n — backprop notes and matrix gradient derivations", "url": "https://cs231n.github.io/", "kind": "course" }
    ]
  },
  {
    "id": "training-deep-networks",
    "phase": 6,
    "phaseName": "Deep Learning",
    "orderIndex": 3,
    "estimatedMins": 50,
    "prerequisites": ["backpropagation"],
    "title": "Training Deep Networks",
    "eli5": "Training a deep network is like teaching a huge orchestra a new song. SGD is the conductor making tiny corrections after each attempt. Adam is a smarter conductor who remembers which musicians consistently drift and adjusts each one differently. Dropout randomly sends some musicians home each rehearsal so nobody becomes irreplaceable. Early stopping ends rehearsals the day the concert-hall run-through stops improving, before the orchestra memorizes the rehearsal room's echo.",
    "analogy": "The learning-rate schedule is like annealing metal. Start hot (high learning rate): atoms jump freely, exploring configurations and escaping bad arrangements. Cool gradually (decay/cosine schedule): movements shrink until the structure settles into a strong final form. Quench too fast and you freeze in defects (converge to a poor sharp minimum); stay hot forever and it never solidifies (loss oscillates and never converges).",
    "explanation": "Modern training is a toolkit, and each tool fixes a specific failure. Optimizers: SGD with momentum accumulates a velocity vector to power through ravines; Adam keeps per-parameter running averages of the gradient (first moment) and its square (second moment), scaling each parameter's step by its own noise level — fast, forgiving defaults (lr=3e-4 to 1e-3). Batch normalization normalizes each layer's pre-activations over the batch, then re-scales with learned gamma/beta — it smooths the loss landscape, permits much higher learning rates, and adds regularizing noise. Dropout zeroes a random fraction of activations each step so the network cannot rely on any single pathway — an implicit ensemble. Early stopping monitors validation loss and halts (restoring the best checkpoint) when it stops improving — the cheapest, most reliable regularizer. Learning-rate schedules (warmup then cosine decay being the modern default) reconcile the need for large exploratory steps early with small precise steps late.",
    "technicalDeep": "Adam's update: m = beta1*m + (1-beta1)*g; v = beta2*v + (1-beta2)*g^2; bias-correct both (divide by 1-beta^t, which matters in early steps), then step = lr * m_hat / (sqrt(v_hat) + eps). The division by sqrt(v_hat) is per-parameter adaptive scaling — rarely-updated or low-noise parameters take larger relative steps. Use AdamW, which decouples weight decay from the gradient (L2-in-the-gradient interacts wrongly with Adam's scaling). SGD+momentum sometimes generalizes slightly better on vision tasks but needs real LR tuning; Adam/AdamW is the default elsewhere and for all transformer work. BatchNorm caveats: it couples examples in a batch (train/eval behave differently — running statistics at eval; model.eval() matters), degrades at batch sizes under ~8, and is replaced by LayerNorm in transformers/RNNs for exactly that reason. Dropout must also be disabled at eval (inverted dropout scales at train time so eval is a no-op). Batch size interacts with LR (larger batches support larger LR, roughly linearly up to a point); warmup exists because early Adam steps with uncorrected variance estimates are violent. The debugging workflow is fixed: overfit ~32 samples to zero loss first; if impossible, the bug is in wiring, not hyperparameters.",
    "whatBreaks": "Forgetting model.eval() at inference leaves dropout on and batchnorm using batch statistics — predictions become noisy and irreproducible, a top-3 production deep-learning bug. Weight decay applied via Adam's gradient instead of decoupled (Adam vs AdamW) quietly under-regularizes. Too-high learning rate: loss spikes or NaNs in the first hundred steps; too low: weeks of slow convergence misread as 'model capacity is the problem'. BatchNorm with batch size 2-4 injects so much statistics noise that training destabilizes. Early stopping on a noisy validation metric with zero patience halts on a random dip. And any train/eval discrepancy — augmentation left on, normalization statistics computed on the wrong split — produces the classic 'great in training, garbage in production'.",
    "efficientWay": {
      "title": "A Reproducible Training Recipe",
      "approaches": [
        {
          "name": "Karpathy's recipe: overfit one batch, then add data, then regularize, changing ONE thing at a time with logged runs",
          "verdict": "best",
          "reason": "Deep-learning failures are silent, so the only defense is incremental verification: prove the pipeline can memorize 32 samples, prove it learns on real data, only then tune regularization and schedules — each with a tracked experiment."
        },
        {
          "name": "Start from a known-good architecture + hyperparameter set for your domain and adjust cautiously",
          "verdict": "ok",
          "reason": "Sensible in practice — defaults like AdamW at 3e-4 with cosine decay are strong — but without the overfit-one-batch check you cannot distinguish a hyperparameter issue from a broken data pipeline."
        },
        {
          "name": "Launch a large hyperparameter sweep before any sanity checks",
          "verdict": "weak",
          "reason": "A grid search over a buggy pipeline burns GPU budget ranking 200 variations of the same bug."
        }
      ],
      "recommendation": "Adopt the fixed ritual: (1) overfit a tiny batch to ~0 loss; (2) train small on real data with AdamW lr=3e-4, no regularization, verify learning; (3) add dropout/weight decay/augmentation one at a time against a validation curve; (4) add warmup+cosine schedule last; (5) early stopping with patience ~5-10 evals and best-checkpoint restore. Log every run."
    },
    "commonMistakes": [
      "Missing model.eval() / model.train() toggles, so dropout and batchnorm behave wrongly at inference",
      "Using Adam with weight_decay instead of AdamW — the decay leaks through the adaptive scaling and barely regularizes",
      "Changing three hyperparameters at once, making it impossible to attribute the improvement or regression",
      "Treating the training loss as the target — validation curves drive every regularization and stopping decision"
    ],
    "seniorNotes": "Senior practice is experiment discipline more than optimizer trivia: seeded runs, config files, and a tracker (W&B/MLflow) so any result can be reproduced in one command. Know the loss-curve pathologies on sight: spike-then-NaN (LR too high or bad batch — add clipping/warmup), train falling with validation flat (leakage or too-small capacity elsewhere), both plateauing immediately (data or wiring bug — rerun the overfit-one-batch test). Modern defaults have converged: AdamW + warmup + cosine decay + mixed precision covers 90% of 2020s training. Gradient clipping at norm 1.0 is cheap insurance. And the most cost-effective 'hyperparameter' in industry remains getting more or cleaner data — a fact seniors internalize and juniors resist.",
    "interviewQuestions": [
      "How does Adam differ from SGD with momentum, and when would you still choose SGD?",
      "What problem does batch normalization solve and why does it behave differently at train vs eval time?",
      "Why is dropout scaled at training time (inverted dropout), and what happens if you forget to disable it at inference?"
    ],
    "interviewAnswers": [
      "Both maintain a momentum-style running mean of gradients, but Adam additionally tracks a running mean of squared gradients and divides each parameter's step by its own sqrt of that — per-parameter adaptive learning rates plus bias correction for early steps. This makes Adam robust to LR choice and gradient scale differences, ideal for transformers and sparse-gradient problems. SGD+momentum, with a well-tuned LR schedule, sometimes finds flatter minima that generalize marginally better on vision benchmarks and costs less memory (no second-moment state); it is still common for CNNs. Default advice: AdamW unless you have a tuned SGD recipe for the domain.",
      "Deeper layers see their input distribution shift constantly as earlier layers update, forcing tiny learning rates. BatchNorm normalizes each unit's pre-activation to zero mean/unit variance over the current mini-batch (then re-scales with learned gamma/beta), which smooths the optimization landscape and permits much higher LRs plus adds mild regularization noise. At training time the statistics come from the current batch; at eval there is no meaningful batch, so it uses running averages accumulated during training — hence model.eval() switches behavior, and forgetting it makes inference depend on whatever happens to be in the batch.",
      "With dropout rate p, only (1-p) of units are active during training, so activations are scaled by 1/(1-p) at train time to keep their expected magnitude constant — that way inference can simply use the full network with no correction, and eval is a clean no-op. Forgetting model.eval() leaves the random mask on at inference: predictions become stochastic (different outputs for identical inputs), systematically noisier, and any downstream system expecting deterministic scores — caching, A/B measurement, alerting thresholds — silently corrupts. It is one of the most common real-world PyTorch deployment bugs."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Full modern training loop: AdamW, schedule, early stopping, eval mode",
        "code": "import torch\nimport torch.nn as nn\nfrom torch.utils.data import DataLoader, TensorDataset\nfrom sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_digits(return_X_y=True)\nX_tr, X_val, y_tr, y_val = train_test_split(X / 16.0, y, random_state=0)\ntrain_dl = DataLoader(TensorDataset(torch.tensor(X_tr, dtype=torch.float32),\n                                    torch.tensor(y_tr)), batch_size=64,\n                      shuffle=True)\nXv = torch.tensor(X_val, dtype=torch.float32); yv = torch.tensor(y_val)\n\nmodel = nn.Sequential(\n    nn.Linear(64, 256), nn.BatchNorm1d(256), nn.ReLU(), nn.Dropout(0.3),\n    nn.Linear(256, 10))\nopt = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)\nsched = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=50)\nloss_fn = nn.CrossEntropyLoss()\n\nbest_val, patience, bad_epochs = float('inf'), 8, 0\nbest_state = None\nfor epoch in range(50):\n    model.train()                              # dropout + BN in train mode\n    for xb, yb in train_dl:\n        loss = loss_fn(model(xb), yb)\n        opt.zero_grad()\n        loss.backward()\n        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)\n        opt.step()\n    sched.step()\n    model.eval()                               # BN running stats, no dropout\n    with torch.no_grad():\n        val_loss = loss_fn(model(Xv), yv).item()\n    if val_loss < best_val - 1e-4:\n        best_val, bad_epochs = val_loss, 0\n        best_state = {k: v.clone() for k, v in model.state_dict().items()}\n    else:\n        bad_epochs += 1\n        if bad_epochs >= patience:\n            print('early stop at epoch', epoch)\n            break\nmodel.load_state_dict(best_state)              # restore best checkpoint\nmodel.eval()\nwith torch.no_grad():\n    acc = (model(Xv).argmax(1) == yv).float().mean().item()\nprint('best val loss %.4f  val acc %.3f' % (best_val, acc))"
      }
    ],
    "resources": [
      { "label": "Karpathy — Zero to Hero (training diagnostics throughout)", "url": "https://karpathy.ai/zero-to-hero.html", "kind": "course" },
      { "label": "CS231n — optimization, batchnorm, dropout notes", "url": "https://cs231n.github.io/", "kind": "course" },
      { "label": "PyTorch tutorials — training loops and schedulers", "url": "https://pytorch.org/tutorials/", "kind": "docs" }
    ]
  },
  {
    "id": "cnns",
    "phase": 6,
    "phaseName": "Deep Learning",
    "orderIndex": 4,
    "estimatedMins": 50,
    "prerequisites": ["training-deep-networks"],
    "title": "Convolutional Neural Networks",
    "eli5": "Instead of looking at a whole photo at once, a CNN slides a tiny magnifying glass across it, asking the same small question everywhere: 'is there an edge here? a corner?'. The next layer slides its glass over those answers, spotting bigger things like eyes or wheels. By the last layer, the network has built up from 'tiny edge' to 'this is a cat' — using the same few questions everywhere instead of memorizing every pixel position.",
    "analogy": "A convolution filter is a rubber stamp of a pattern. You press it at every position of the image; where the image matches the stamp, you get strong ink (high activation). One layer owns a boxful of stamps (edges, colors, textures). The next layer's stamps are patterns OF stamp-marks — combinations like 'vertical edge above horizontal edge = corner'. Pooling then shrinks the inked map, keeping only the strongest mark in each neighborhood, so a pattern found a few pixels off still counts. Weight sharing means one stamp works everywhere — that is why a CNN needs thousands of times fewer parameters than a dense net on pixels.",
    "explanation": "A convolutional layer slides small learnable kernels (typically 3x3) across the input, computing a dot product at each position and producing a feature map per kernel. Two structural priors make this dramatically better than dense layers for images: locality (nearby pixels relate; a 3x3 kernel looks at neighborhoods) and translation equivariance via weight sharing (the same kernel detects its pattern anywhere, so a cat in the corner is as detectable as one in the center). Pooling (or strided convolution) downsamples feature maps, buying translation tolerance and growing the receptive field. A classic architecture stacks conv-ReLU-pool blocks — channels increasing as spatial size shrinks — then a small dense head for classification. Depth builds a feature hierarchy: layer 1 learns edges and color blobs, middle layers learn textures and parts, late layers learn object-level concepts. This hierarchy is not designed; it emerges from training and is directly visualizable.",
    "technicalDeep": "Output spatial size: (N + 2P - K)/S + 1 for input N, kernel K, padding P, stride S — 'same' padding P=(K-1)/2 preserves size for odd K. Parameters per conv layer: K*K*C_in*C_out + C_out — a 3x3 conv from 64 to 128 channels costs 73,856 parameters regardless of image size, whereas a dense layer on a 224x224x3 image costs 150M+ per 1000 units; that is the weight-sharing win. Receptive field grows with depth: two stacked 3x3 convs see 5x5 with fewer parameters and more nonlinearity than one 5x5 — the VGG insight. ResNets added residual blocks (out = F(x) + x), fixing gradient flow and enabling 50-150+ layer networks; batchnorm after convs is standard. Modern classification heads use global average pooling instead of giant flatten-dense layers. Data augmentation (random crops, flips, color jitter) is the domain-specific regularizer that encodes 'these transforms preserve the label'. Know the lineage in one line each: LeNet (proof of concept), AlexNet (GPUs + ReLU, 2012 ImageNet moment), VGG (3x3 stacking), ResNet (skips enable real depth) — and that vision transformers now rival CNNs at large scale, while CNNs retain superior data efficiency from their built-in inductive biases.",
    "whatBreaks": "Feeding channels-last (H, W, C) arrays where PyTorch expects channels-first (C, H, W) either crashes or — worse — trains badly without erroring. Forgetting normalization (and at transfer time, using the wrong per-channel mean/std) quietly costs accuracy. Miscomputing padding shrinks feature maps until a deep network hits a 1x1 map and crashes, or silently loses border information. Small datasets overfit CNNs trained from scratch within epochs — augmentation and transfer learning are the fixes, not more dropout. Aggressive early pooling throws away fine spatial detail that dense prediction tasks (segmentation, detection) need. And evaluating with different preprocessing than training (resize vs crop, different interpolation) causes mysterious accuracy gaps between notebook and production.",
    "efficientWay": {
      "title": "Learning CNNs Hierarchically",
      "approaches": [
        {
          "name": "Implement 2D convolution in NumPy, then a small PyTorch CNN on CIFAR-10/FashionMNIST, visualize first-layer filters and feature maps, then fine-tune a pretrained ResNet",
          "verdict": "best",
          "reason": "The NumPy conv nails the sliding-window mechanics and shape math; the small CNN teaches the training realities; filter/feature-map visualization makes 'feature hierarchy' something you have SEEN; the ResNet step is how all real vision work starts."
        },
        {
          "name": "Follow the PyTorch CIFAR-10 tutorial end to end",
          "verdict": "ok",
          "reason": "A solid start, but without hand-computing shapes and parameter counts you will be helpless the first time you must modify an architecture."
        },
        {
          "name": "Only ever call pretrained models through a high-level API",
          "verdict": "weak",
          "reason": "Fine for shipping features, but you cannot debug shape errors, adapt architectures, or reason about receptive fields — the difference between using and understanding."
        }
      ],
      "recommendation": "Write the naive nested-loop conv2d in NumPy and verify against PyTorch's F.conv2d. Build a 3-block CNN for FashionMNIST/CIFAR-10, computing every layer's output shape and parameter count on paper first. Plot first-layer kernels after training (they become edge/color detectors — see it yourself). Then do the production pattern: fine-tune a pretrained ResNet-18."
    },
    "commonMistakes": [
      "Shape/layout confusion — channels-first vs channels-last, or forgetting the batch dimension — the number one beginner CNN bug",
      "Training from scratch on a few thousand images when fine-tuning a pretrained backbone would be faster and far more accurate",
      "Skipping data augmentation and burning capacity memorizing the training set",
      "Not computing parameter counts and receptive fields by hand, then being unable to explain why an architecture over- or under-fits"
    ],
    "seniorNotes": "In industry, nobody trains image models from scratch below web scale — the workflow is: pick a pretrained backbone (ResNet/EfficientNet/ConvNeXt or a ViT), fine-tune, and spend your time on data quality, augmentation policy, and evaluation splits. Seniors reason in receptive fields and FLOPs: dense prediction tasks need architectures preserving spatial resolution (U-Nets, FPNs), edge deployment needs depthwise-separable convs (MobileNet) and quantization. Feature-map and Grad-CAM visualization is not a toy — it is how you discover the model latched onto watermarks or backgrounds instead of the object. The 2020s twist: CNN inductive biases (locality, equivariance) are what make CNNs the data-efficient choice at small-to-medium scale even as transformers win at massive scale — know how to argue that trade-off.",
    "interviewQuestions": [
      "Why do CNNs use far fewer parameters than dense networks on images, and why does that help beyond memory savings?",
      "What is a receptive field and why do stacked 3x3 convolutions beat one large kernel?",
      "What does pooling contribute, and what does it cost?"
    ],
    "interviewAnswers": [
      "Two priors: locality (each unit connects only to a small neighborhood, so kernels are tiny) and weight sharing (one kernel is reused at every spatial position, so parameter count is independent of image size). Beyond memory, weight sharing is a hard-coded translation-equivariance constraint — the network does not need to relearn 'edge' separately at every location — which acts as strong regularization and is why CNNs generalize from far less data than dense nets or vision transformers at small scale.",
      "The receptive field is the input region that can influence a given unit — it grows with every conv or pooling layer, and a unit can only recognize patterns no larger than its receptive field. Two stacked 3x3 convs cover a 5x5 field using 2*(9 C^2) parameters versus 25 C^2 for a single 5x5 kernel — fewer parameters AND an extra nonlinearity between them, so more expressive per parameter. This 'small kernels, more depth' principle is the VGG insight and remains the default; dilated convolutions are the alternative when you need large receptive fields without losing resolution.",
      "Pooling downsamples feature maps, delivering three benefits: computation drops quadratically with spatial size, small translations of a feature stop changing the output (local invariance), and deeper layers gain receptive field faster. The cost is spatial precision — max pooling keeps 'the feature is here-ish' and discards exactly where, which is fine for classification but harmful for segmentation and detection; those architectures either avoid aggressive pooling, use strided convs, or restore resolution with skip connections (U-Net) and feature pyramids. Global average pooling at the head replaced giant flatten-dense layers, cutting parameters massively."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "conv2d from scratch in NumPy, verified against PyTorch",
        "code": "import numpy as np\nimport torch\nimport torch.nn.functional as F\n\ndef conv2d_naive(img, kernel):\n    H, W = img.shape\n    K = kernel.shape[0]\n    out = np.zeros((H - K + 1, W - K + 1))\n    for i in range(out.shape[0]):\n        for j in range(out.shape[1]):\n            out[i, j] = (img[i:i + K, j:j + K] * kernel).sum()\n    return out\n\nrng = np.random.default_rng(0)\nimg = rng.normal(size=(8, 8))\nsobel_x = np.array([[-1., 0., 1.], [-2., 0., 2.], [-1., 0., 1.]])\n\nmine = conv2d_naive(img, sobel_x)\nref = F.conv2d(torch.tensor(img).view(1, 1, 8, 8),\n               torch.tensor(sobel_x).view(1, 1, 3, 3)).squeeze().numpy()\nprint('matches PyTorch:', np.allclose(mine, ref))\nprint('output shape (8-3+1):', mine.shape)"
      },
      {
        "lang": "python",
        "label": "A small CNN in PyTorch with shape math in comments",
        "code": "import torch\nimport torch.nn as nn\n\nclass SmallCNN(nn.Module):\n    def __init__(self, n_classes=10):\n        super().__init__()\n        self.features = nn.Sequential(\n            # in: (B, 1, 28, 28)\n            nn.Conv2d(1, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(),\n            nn.MaxPool2d(2),                     # -> (B, 32, 14, 14)\n            nn.Conv2d(32, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(),\n            nn.MaxPool2d(2),                     # -> (B, 64, 7, 7)\n            nn.Conv2d(64, 128, 3, padding=1), nn.ReLU(),\n            nn.AdaptiveAvgPool2d(1),             # -> (B, 128, 1, 1)\n        )\n        self.head = nn.Linear(128, n_classes)\n\n    def forward(self, x):\n        x = self.features(x).flatten(1)          # (B, 128)\n        return self.head(x)\n\nmodel = SmallCNN()\nn_params = sum(p.numel() for p in model.parameters())\nprint('parameters:', n_params)                   # ~100k, vs 25M+ dense\nout = model(torch.randn(4, 1, 28, 28))\nprint('output shape:', tuple(out.shape))          # (4, 10)"
      }
    ],
    "resources": [
      { "label": "CS231n — Convolutional Neural Networks for Visual Recognition", "url": "https://cs231n.github.io/", "kind": "course" },
      { "label": "3Blue1Brown — convolutions explained visually", "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", "kind": "video" },
      { "label": "PyTorch tutorials — vision and transfer learning", "url": "https://pytorch.org/tutorials/", "kind": "docs" },
      { "label": "Kaggle Learn — computer vision practice", "url": "https://www.kaggle.com/learn", "kind": "practice" }
    ]
  },
  {
    "id": "rnns-lstms",
    "phase": 6,
    "phaseName": "Deep Learning",
    "orderIndex": 5,
    "estimatedMins": 45,
    "prerequisites": ["training-deep-networks"],
    "title": "RNNs & LSTMs",
    "eli5": "Reading a sentence word by word, you keep a running summary in your head — that summary is the RNN's hidden state. Each new word updates the summary. The problem: with a plain RNN, the summary is like a whisper passed down a long line of people — by word fifty, whatever word one said is garbled away. An LSTM gives the line a written notepad with strict rules about who may erase (forget gate) or add (input gate) notes, so important early information survives the trip.",
    "analogy": "An LSTM's cell state is a conveyor belt running through the whole sequence. At each timestep, three gatekeepers stand by the belt: one decides what old cargo to throw off (forget gate), one decides what new cargo to load (input gate), and one decides what part of the cargo to show the outside world right now (output gate). Because cargo can ride the belt untouched — the gates are learned, not fixed — information from timestep 3 can survive to timestep 300, which the whisper-chain of a vanilla RNN could never do.",
    "explanation": "Recurrent networks process sequences one element at a time, maintaining a hidden state: h_t = tanh(W_hh h_(t-1) + W_xh x_t + b). The same weights apply at every timestep — weight sharing across time, the sequential cousin of a CNN's sharing across space — so an RNN handles variable-length input naturally. Training unrolls the network through time and backpropagates through the unrolled graph (BPTT). The flaw is structural: gradients flowing back through T steps get multiplied by roughly the same Jacobian T times, so they vanish (long-range dependencies unlearnable) or explode (NaN). LSTMs solve the vanishing side with an additive cell state — a memory track modified by learned gates (forget, input, output) rather than overwritten each step — giving gradients a multiplication-free path backward. GRUs are the lighter two-gate variant with similar performance. This made LSTMs the backbone of NLP, speech, and translation from about 2014 to 2018.",
    "technicalDeep": "LSTM equations: f_t = sigmoid(W_f [h_(t-1), x_t] + b_f); i_t = sigmoid(W_i ...); c_tilde = tanh(W_c ...); c_t = f_t * c_(t-1) + i_t * c_tilde; o_t = sigmoid(W_o ...); h_t = o_t * tanh(c_t). The decisive line is c_t = f_t * c_(t-1) + i_t * c_tilde: the cell state updates ADDITIVELY, so dc_t/dc_(t-1) = f_t — a learned gate value rather than a fixed shrinking Jacobian, letting the network learn to hold gradients near 1 along important paths (initialize forget-gate bias positive, ~1.0, so early training defaults to remembering). Exploding gradients remain possible; gradient clipping at norm ~1-5 is standard RNN hygiene. Practical machinery: sequences in a batch are padded to equal length and losses masked; packed sequences avoid wasted compute. But two structural limits could not be gated away, and they are exactly why transformers won: (1) sequentiality — h_t needs h_(t-1), so computation cannot parallelize across the sequence, wasting GPUs and capping model scale; (2) the fixed-size hidden state is an information bottleneck — a whole document squeezed into one vector (the seq2seq problem). Attention was invented (2015) to bypass the bottleneck for translation, and the 2017 transformer removed the recurrence entirely, keeping only attention. RNNs survive today in low-latency streaming/edge niches, and their modern descendants (state-space models like Mamba) are an active research revival.",
    "whatBreaks": "Vanilla RNNs cannot learn dependencies much beyond 10-20 steps — a model asked to close a quote opened 80 tokens ago simply never learns it. Exploding gradients NaN a run in one bad batch without clipping. Padding leaks: computing loss over pad tokens teaches the model to predict padding, inflating metrics while ruining the model — masks are mandatory. Stateful pitfalls: carrying hidden state across unrelated sequences (forgetting to reset between batches) contaminates predictions. Even LSTMs degrade past several hundred timesteps in practice. And BPTT memory scales with sequence length (all timestep activations retained), so long sequences force truncated BPTT, which silently caps the longest dependency the model can learn to the truncation window.",
    "efficientWay": {
      "title": "Learning RNNs Post-Transformer",
      "approaches": [
        {
          "name": "Build a character-level RNN in NumPy/raw PyTorch, watch it fail on long dependencies, then swap in nn.LSTM and measure the difference",
          "verdict": "best",
          "reason": "The scratch char-RNN (Karpathy's classic exercise) makes hidden state and BPTT mechanical, and the vanilla-vs-LSTM comparison on a long-memory task shows WHY gates matter instead of taking it on faith — plus it is the cleanest lens for later understanding what transformers fixed."
        },
        {
          "name": "Read the LSTM equations alongside an annotated diagram and use nn.LSTM directly",
          "verdict": "ok",
          "reason": "Faster, and honestly sufficient for the transformer era — but 'gates' remain plumbing you memorized rather than machinery you have watched work."
        },
        {
          "name": "Skip RNNs entirely because transformers won",
          "verdict": "weak",
          "reason": "You lose the conceptual bridge: hidden state, BPTT, and the bottleneck-then-attention story are exactly the context that makes transformers comprehensible rather than arbitrary — and interviewers still love 'why did transformers replace LSTMs?'."
        }
      ],
      "recommendation": "Train a character-level vanilla RNN on toy text, observe the loss plateau and gradient norms collapsing over distance; switch to nn.LSTM with clipping and see long-range structure (quotes, brackets) start working. Cap it at a day — the goal is understanding the lineage, not RNN mastery."
    },
    "commonMistakes": [
      "Training RNNs without gradient clipping and losing runs to a single exploding batch",
      "Computing loss over padding tokens instead of masking them — inflated metrics, broken model",
      "Mixing up hidden state h and cell state c in LSTMs, or forgetting to reset/detach state between unrelated sequences",
      "Reaching for an RNN in 2026 where a small transformer or a pretrained encoder is strictly better — know the history, choose the modern tool"
    ],
    "seniorNotes": "Treat this topic as intellectual infrastructure: the concepts — weight sharing over time, BPTT, gating, the encoder bottleneck — are prerequisites for genuinely understanding attention, and the 'RNN to attention to transformer' narrative is a staple senior interview question. Production reality in the 2020s: transformers own NLP; LSTMs/GRUs persist in streaming ASR, on-device wake-word models, and some time-series systems where O(1) per-step inference and tiny memory beat attention's O(n) context cost. Watch state-space models (Mamba, RWKV) — recurrence is being rediscovered for linear-cost long-context modeling, so the ideas here are cyclical, not dead. If you do ship an LSTM: clip gradients, mask padding, initialize forget bias to 1, and benchmark against a fine-tuned small transformer before committing.",
    "interviewQuestions": [
      "Why do vanilla RNNs fail to learn long-range dependencies, and how does the LSTM cell state fix it?",
      "Why did transformers replace LSTMs for NLP?",
      "What is truncated BPTT and what does it trade away?"
    ],
    "interviewAnswers": [
      "BPTT multiplies gradients by the recurrent Jacobian once per timestep; with tanh saturation and a fixed W_hh, that product shrinks geometrically (or explodes), so the learning signal linking timestep 100's loss to timestep 1's input is numerically zero — the dependency is unlearnable, not merely hard. The LSTM replaces the overwrite h_t = tanh(...) with an additive cell-state update c_t = f_t * c_(t-1) + i_t * c_tilde, whose backward derivative is the learned forget gate f_t itself. The network can set f_t near 1 along paths that matter, creating an uninterrupted gradient highway — the same additive-path idea as ResNet skips, discovered earlier.",
      "Three compounding reasons. Parallelism: an RNN must compute timestep t after t-1, so training cannot parallelize across the sequence, while a transformer processes all positions simultaneously — a perfect match for GPUs that made 100x larger training runs economical. Path length: information between positions i and j crosses |i - j| recurrent steps in an RNN but a single attention hop in a transformer, so long-range dependencies stop degrading with distance. Capacity: the RNN's fixed-size hidden state is a bottleneck compressing everything seen so far, whereas attention gives direct random access to every previous position. Scaling laws did the rest — transformer quality kept improving with size and data where LSTMs plateaued.",
      "Full BPTT stores activations for and backpropagates through the entire sequence — memory and compute grow with length, untenable for long streams. Truncated BPTT processes the sequence in windows of k steps: carry the hidden state forward (so the forward pass has unbounded memory), but detach it between windows and only backpropagate within each window. The trade: no gradient crosses the truncation boundary, so the model cannot LEARN dependencies longer than k — it can only exploit ones expressible through the carried state. Choosing k is a memory-versus-longest-learnable-dependency dial, and forgetting to detach turns it back into full BPTT with an out-of-memory crash."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Vanilla RNN cell from scratch vs nn.LSTM on a long-memory task",
        "code": "import torch\nimport torch.nn as nn\n\n# Task: output the FIRST token of the sequence after seeing all 50 tokens.\n# Vanilla RNN must carry token 1 across 50 steps -> vanishing gradients.\ntorch.manual_seed(0)\nB, T, V, H = 128, 50, 8, 64\n\ndef make_batch():\n    x = torch.randint(0, V, (B, T))\n    return x, x[:, 0]                     # label = first token\n\nclass ScratchRNN(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.emb = nn.Embedding(V, H)\n        self.Wxh = nn.Linear(H, H)\n        self.Whh = nn.Linear(H, H, bias=False)\n        self.head = nn.Linear(H, V)\n    def forward(self, x):\n        h = torch.zeros(x.size(0), H)\n        for t in range(x.size(1)):        # explicit recurrence\n            h = torch.tanh(self.Wxh(self.emb(x[:, t])) + self.Whh(h))\n        return self.head(h)\n\nclass LSTMModel(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.emb = nn.Embedding(V, H)\n        self.lstm = nn.LSTM(H, H, batch_first=True)\n        self.head = nn.Linear(H, V)\n    def forward(self, x):\n        out, _ = self.lstm(self.emb(x))\n        return self.head(out[:, -1])      # last hidden state\n\nfor name, model in [('vanilla RNN', ScratchRNN()), ('LSTM', LSTMModel())]:\n    opt = torch.optim.Adam(model.parameters(), lr=3e-3)\n    for step in range(400):\n        x, y = make_batch()\n        loss = nn.functional.cross_entropy(model(x), y)\n        opt.zero_grad(); loss.backward()\n        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)  # RNN hygiene\n        opt.step()\n    x, y = make_batch()\n    acc = (model(x).argmax(1) == y).float().mean().item()\n    print('%-11s acc after 400 steps: %.2f' % (name, acc))\n# vanilla RNN hovers near chance (~0.12); LSTM's gated cell learns it"
      }
    ],
    "resources": [
      { "label": "StatQuest — RNNs and LSTMs clearly explained", "url": "https://www.youtube.com/@statquest", "kind": "video" },
      { "label": "Karpathy — Zero to Hero (builds sequence models from scratch)", "url": "https://karpathy.ai/zero-to-hero.html", "kind": "course" },
      { "label": "PyTorch tutorials — sequence models", "url": "https://pytorch.org/tutorials/", "kind": "docs" }
    ]
  },
  {
    "id": "transformers-nlp",
    "phase": 6,
    "phaseName": "Deep Learning",
    "orderIndex": 6,
    "estimatedMins": 55,
    "prerequisites": ["rnns-lstms", "backpropagation"],
    "title": "Transformers for NLP",
    "eli5": "Reading with an RNN is like hearing a story one word at a time through a keyhole, trying to remember everything. A transformer spreads the whole story on a table and lets every word look directly at every other word and ask 'are you relevant to me?'. The word 'it' can stare straight at 'the cat' from three sentences back — no whisper chain, no fading memory.",
    "analogy": "Self-attention is a conference where every attendee (token) wears three badges: what I am looking for (query), what I offer (key), and what I will actually tell you if we talk (value). Each attendee compares their query against everyone's keys, decides how much attention to pay to each person, and walks away with a weighted blend of the values — updated by the whole room at once. Multi-head attention runs several such conferences in parallel, each themed differently: one head tracks grammar, another tracks who 'it' refers to, another tracks nearby words.",
    "explanation": "The transformer (Vaswani et al. 2017, 'Attention Is All You Need') removed recurrence entirely: every layer is self-attention (each position computes attention weights over all positions and takes a weighted sum of their value vectors) followed by a per-position feedforward network, with residual connections and layer norm around both. Because attention is order-blind, positional information is injected explicitly (sinusoidal or learned position encodings; RoPE in modern LLMs). The payoff over RNNs: all positions process in parallel (GPU-friendly training), and any two positions are one attention hop apart, so long-range dependencies do not decay with distance. The original architecture was an encoder-decoder for translation; the field then split into families. BERT keeps only the encoder — bidirectional attention, trained by masking words and predicting them — ideal for understanding tasks (classification, NER, retrieval embeddings). GPT keeps only the decoder — causal attention where each token sees only its past, trained to predict the next token — ideal for generation, and the architecture behind modern LLMs. T5-style models keep both for sequence-to-sequence tasks.",
    "technicalDeep": "Scaled dot-product attention: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V, where Q = X W_Q, K = X W_K, V = X W_V are linear projections of the token representations. The sqrt(d_k) scaling stops dot products growing with dimension and saturating softmax into near-one-hot (killing gradients). Multi-head attention splits d_model into h subspaces, attends independently in each, concatenates, and projects — letting different heads learn different relation types. A decoder applies a causal mask (upper-triangular -inf before softmax) so position t attends only to positions <= t; an encoder attends bidirectionally. Each block is: x = x + MHA(LN(x)); x = x + FFN(LN(x)) (pre-norm ordering, which trains more stably than the original post-norm), with the FFN typically 4x d_model wide and holding roughly two-thirds of parameters. Costs: attention is O(n^2) in sequence length for both compute and memory — the fundamental constraint driving context-window engineering (FlashAttention reorganizes the computation for memory efficiency; sparse/linear attention variants approximate it). Training objectives define the families: masked-LM (BERT) sees both sides but cannot generate; causal-LM (GPT) generates and, scaled up with instruction tuning and RLHF, becomes the chat models of the 2020s. Tokenization (BPE subwords) is the unsung layer where many practical failures originate.",
    "whatBreaks": "Forgetting the causal mask when training a generative model lets tokens peek at the future — training loss looks miraculous, generation is gibberish. Omitting positional encodings makes the model a bag-of-words: attention is permutation-equivariant, so 'dog bites man' equals 'man bites dog'. The O(n^2) memory wall: doubling context quadruples attention memory, and naive long-document processing OOMs — chunking, sliding windows, or efficient attention are required. Missing the sqrt(d_k) scaling or bad LR warmup destabilizes early training (transformers are notoriously warmup-sensitive). Using BERT to generate text or GPT embeddings where bidirectional context matters — family mismatch — wastes quality. And tokenizer mismatches between pretraining and fine-tuning silently shred performance.",
    "efficientWay": {
      "title": "The Attention Ladder",
      "approaches": [
        {
          "name": "Implement scaled dot-product and multi-head attention in NumPy/PyTorch, build a mini-GPT following Karpathy's nanoGPT walkthrough, then fine-tune a pretrained BERT for classification",
          "verdict": "best",
          "reason": "Attention is 15 lines of code — writing it removes all mystique. The nanoGPT build assembles every component (masking, positions, blocks) into a working generator; the BERT fine-tune covers the encoder family and the transfer workflow you will use professionally."
        },
        {
          "name": "Study 'The Illustrated Transformer' style visual guides, then use HuggingFace pipelines",
          "verdict": "ok",
          "reason": "Good conceptual grounding and immediate productivity, but attention stays a diagram — the first shape mismatch or masking bug in real work will expose the gap."
        },
        {
          "name": "Jump straight to prompting LLM APIs and skip the internals",
          "verdict": "weak",
          "reason": "Legitimate for application work, but this curriculum's goal is understanding: without the QKV mechanics you cannot reason about context limits, why models attend to irrelevant tokens, or any interview question in this space."
        }
      ],
      "recommendation": "Write single-head attention from scratch and verify shapes and weights by hand on a 4-token example. Follow Karpathy's 'GPT from scratch' lecture to a working character-level mini-GPT. Then the applied step: fine-tune a small pretrained encoder for sentiment classification. You now own both families."
    },
    "commonMistakes": [
      "Forgetting the causal mask in a decoder — spectacular training metrics, useless generation",
      "Treating position encodings as optional plumbing — without them the model cannot distinguish word order at all",
      "Confusing the families: BERT-style encoders do not generate; GPT-style decoders see only leftward context",
      "Ignoring the sqrt(d_k) scaling and warmup schedule, then blaming the architecture for divergence"
    ],
    "seniorNotes": "Transformers are the substrate of the modern AI economy, so seniors are expected to reason about them quantitatively: parameter counting (embeddings + L blocks of roughly 12 d^2 each), the O(n^2) attention cost versus the FFN's O(n d^2), why KV-caching makes generation memory-bound, and why FlashAttention is an IO optimization rather than an approximation. Architecture selection is a standard design question: encoder for embeddings/retrieval/classification, decoder for generation and few-shot flexibility, cross-attention when fusing modalities. In practice almost nobody pretrains — the leverage is in fine-tuning (often parameter-efficient: LoRA), tokenizer awareness, and evaluation design. The interview canon is stable: derive attention, explain multi-head motivation, BERT vs GPT, and the RNN-to-transformer 'why' — all four should be automatic after this topic.",
    "interviewQuestions": [
      "Walk through scaled dot-product attention. Why divide by sqrt(d_k)?",
      "Compare BERT and GPT: architecture, training objective, and what each is for.",
      "Why can transformers be trained in parallel when RNNs cannot?"
    ],
    "interviewAnswers": [
      "Project each token's representation into a query, key, and value vector. Compute all pairwise query-key dot products (Q K^T), scale by 1/sqrt(d_k), softmax each row into attention weights, and output each position's weighted sum of value vectors — every token's new representation is a mixture of all tokens it found relevant. The scaling matters because dot products of d_k-dimensional random vectors have variance proportional to d_k: unscaled, large dimensions push softmax into saturation where it behaves like a hard argmax, gradients vanish, and training stalls. Dividing by sqrt(d_k) normalizes the variance to keep softmax in its trainable regime.",
      "BERT is encoder-only: bidirectional self-attention (every token sees both sides), trained with masked-language modeling — mask ~15% of tokens, predict them from full context. That yields rich contextual representations perfect for understanding tasks: classification, NER, question answering, embedding/retrieval. It cannot naturally generate text. GPT is decoder-only: causal self-attention (each token sees only its predecessors), trained to predict the next token — which makes it a generative model, and at scale the substrate for instruction-following chat systems. Rule of thumb: representation and scoring tasks lean BERT-family; generation and open-ended few-shot tasks are GPT-family; full seq2seq (translation, summarization with strong input grounding) suits encoder-decoder models like T5.",
      "An RNN's hidden state at step t is a function of step t-1, so the sequence must be processed serially — 512 tokens means 512 dependent steps, and GPUs sit idle. In a transformer, each layer's output for every position depends only on the PREVIOUS layer's outputs at all positions, never on the same layer's other positions being computed first — so attention for all n positions is a few big matrix multiplies, executed simultaneously. Causality during training is enforced by masking rather than by ordering computation: the decoder computes all positions' next-token predictions in one parallel pass over the (masked) sequence. Serial computation returns only at inference-time generation, where each new token genuinely requires the last — which is why generation is slow and KV-caching exists."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Scaled dot-product + causal self-attention from scratch",
        "code": "import torch\nimport torch.nn.functional as F\nimport math\n\ntorch.manual_seed(0)\nB, T, d_model, n_heads = 2, 5, 32, 4\nd_k = d_model // n_heads\nx = torch.randn(B, T, d_model)              # token representations\n\nW_q = torch.nn.Linear(d_model, d_model, bias=False)\nW_k = torch.nn.Linear(d_model, d_model, bias=False)\nW_v = torch.nn.Linear(d_model, d_model, bias=False)\n\n# project and split into heads: (B, heads, T, d_k)\ndef heads(t):\n    return t.view(B, T, n_heads, d_k).transpose(1, 2)\nQ, K, V = heads(W_q(x)), heads(W_k(x)), heads(W_v(x))\n\nscores = Q @ K.transpose(-2, -1) / math.sqrt(d_k)   # (B, h, T, T)\ncausal_mask = torch.triu(torch.ones(T, T), diagonal=1).bool()\nscores = scores.masked_fill(causal_mask, float('-inf'))  # no peeking ahead\nattn = F.softmax(scores, dim=-1)\nout = (attn @ V).transpose(1, 2).reshape(B, T, d_model)\n\nprint('attention weights, head 0, batch 0 (rows sum to 1):')\nprint(attn[0, 0].round(decimals=2))\n# lower-triangular: token t attends only to tokens 0..t\nprint('output shape:', tuple(out.shape))     # (2, 5, 32)\n\n# sanity: matches PyTorch's built-in\nref = F.scaled_dot_product_attention(Q, K, V, is_causal=True)\nprint('matches torch SDPA:',\n      torch.allclose(out, ref.transpose(1, 2).reshape(B, T, d_model),\n                     atol=1e-6))"
      }
    ],
    "resources": [
      { "label": "Karpathy — Zero to Hero (GPT from scratch, nanoGPT)", "url": "https://karpathy.ai/zero-to-hero.html", "kind": "course" },
      { "label": "3Blue1Brown — visualizing attention and transformers", "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", "kind": "video" },
      { "label": "Hands-On Large Language Models — code companion repo", "url": "https://github.com/HandsOnLLM/Hands-On-Large-Language-Models", "kind": "repo" },
      { "label": "PyTorch tutorials — transformer implementations", "url": "https://pytorch.org/tutorials/", "kind": "docs" }
    ]
  },
  {
    "id": "embeddings-representations",
    "phase": 6,
    "phaseName": "Deep Learning",
    "orderIndex": 7,
    "estimatedMins": 45,
    "prerequisites": ["neural-networks-scratch", "transformers-nlp"],
    "title": "Embeddings & Representation Learning",
    "eli5": "Computers cannot compare words like 'king' and 'queen' — they only see different spellings. An embedding gives every word a point on a giant map, learned so that words used in similar sentences land near each other. Suddenly the computer can measure meaning with a ruler: 'king' is close to 'queen', far from 'toaster', and the direction from 'man' to 'woman' roughly matches the direction from 'king' to 'queen'.",
    "analogy": "Hand-crafted features are like describing people with a fixed government form: height, age, zip code — whatever the form's designer thought mattered. Learned representations are like letting a brilliant matchmaker meet everyone and invent her own private notes; you cannot always read her notes (dimension 173 has no name), but her matches are uncannily good because the notes were optimized for matching, not for the form's designer. That is the deep-learning bargain: give up interpretable columns, gain task-optimized geometry.",
    "explanation": "An embedding maps discrete things — words, users, products, whole sentences — to dense vectors such that geometric closeness encodes semantic similarity. Word2vec (2013) proved the idea at scale with a beautifully simple objective built on the distributional hypothesis ('you shall know a word by the company it keeps'): train a tiny network to predict a word from its context (CBOW) or context from a word (skip-gram); the hidden-layer weights, a mere byproduct, turn out to be meaning-laden vectors where vector arithmetic like king - man + woman lands near queen. This is the essence of representation learning: instead of engineering features by hand (TF-IDF, edge detectors, ratio features), design a training objective and let gradient descent discover the features. Deep networks do this internally at every layer — the layers of a CNN or transformer ARE a learned feature hierarchy — and modern practice extracts those internal representations as products in their own right: sentence embeddings for semantic search and RAG, user/item embeddings for recommendation, image embeddings for visual search.",
    "technicalDeep": "Word2vec's skip-gram with negative sampling avoids a full-vocabulary softmax by training binary classifiers: for each (word, context) pair, push their vectors' dot product up, and push down the dot product with k randomly sampled 'negative' words — logistic loss on sigmoid(u . v). The result: co-occurrence statistics compressed into geometry (Levy and Goldberg showed it implicitly factorizes a shifted PMI matrix). Static embeddings assign one vector per type, so 'bank' (river) and 'bank' (money) collide; contextual embeddings from transformers produce a different vector per token occurrence, resolving polysemy — this is BERT's core upgrade. Sentence-level embeddings need more than averaging: contrastive objectives (SBERT, SimCSE, CLIP) train encoders so that positive pairs (paraphrases, image-caption pairs) are close and negatives far — InfoNCE loss over in-batch negatives is the workhorse. Practical geometry: cosine similarity is standard (normalize vectors; then cosine equals dot product and Euclidean ranking matches); dimensions run 100-300 (word2vec) to 384-3072 (modern sentence encoders). At retrieval scale, exact nearest-neighbor search is too slow, so approximate NN indexes (HNSW graphs, IVF via k-means — your Phase 5 clustering, working a real job) trade tiny recall for orders-of-magnitude speed. Embedding drift matters operationally: vectors from different model versions live in incompatible spaces, so an index must be fully rebuilt when the encoder changes.",
    "whatBreaks": "Comparing embeddings from different models or versions — the spaces are unrelated, similarities are meaningless, and this breaks silently with plausible-looking numbers. Averaging word vectors for sentences collapses word order and negation ('good, not bad' equals 'bad, not good'). Static vectors on polysemous words retrieve rivers for finance queries. Embeddings inherit and amplify training-data bias (occupation vectors carrying gender directions) — a known, measurable, sometimes regulated harm. Un-normalized vectors make cosine and dot-product rankings disagree, a classic vector-database misconfiguration. And out-of-vocabulary or out-of-domain inputs (medical jargon through a general web encoder) embed somewhere arbitrary, making confident nonsense retrievals.",
    "efficientWay": {
      "title": "From Counting to Contrastive",
      "approaches": [
        {
          "name": "Train skip-gram word2vec from scratch in NumPy/PyTorch on a small corpus, verify analogies, then use pretrained sentence-transformer embeddings to build a small semantic search over your own documents",
          "verdict": "best",
          "reason": "Scratch word2vec is a shockingly small program whose emergent geometry (analogies working!) is the most persuasive demo in ML; the semantic-search build is the exact pattern behind RAG and modern search, using the pro tool the pro way."
        },
        {
          "name": "Load pretrained embeddings and explore nearest neighbors and analogy arithmetic",
          "verdict": "ok",
          "reason": "You will see the geometry, which is the key intuition — but the training objective (why the geometry emerges) stays secondhand."
        },
        {
          "name": "Treat embeddings as an opaque API call in a RAG stack",
          "verdict": "weak",
          "reason": "Adequate until retrieval quality drops and you cannot reason about domain shift, normalization, chunking, or why two models' vectors cannot be mixed."
        }
      ],
      "recommendation": "Implement skip-gram with negative sampling on text8 or similar (a weekend project), confirm king - man + woman ~ queen, then switch to a pretrained sentence encoder and build cosine-similarity search over 100 of your own notes. Finish by breaking it: query with out-of-domain jargon and watch retrieval degrade — the production failure mode, experienced safely."
    },
    "commonMistakes": [
      "Mixing vectors from different embedding models or versions in one index — geometrically meaningless, and it fails silently",
      "Forgetting to normalize before cosine similarity, or mixing cosine and dot-product conventions across the stack",
      "Using static word embeddings where polysemy matters instead of contextual encoders",
      "Assuming embedding dimensions have human-readable meanings — the space's geometry is meaningful, individual axes are not"
    ],
    "seniorNotes": "Embeddings are the workhorse asset of applied AI in the 2020s: semantic search, RAG retrieval, recommendation, deduplication, clustering, and anomaly detection all reduce to 'embed, then do geometry'. Senior concerns are operational: version-pin the encoder and plan full index rebuilds on upgrades; choose chunking strategy deliberately (it moves retrieval quality more than model choice); evaluate retrieval with labeled query-document pairs (recall@k, MRR) rather than eyeballing; and know your ANN index trade-offs (HNSW: fast queries, heavy memory; IVF: cheaper, needs k-means training). Domain shift is the quiet killer — a general-purpose encoder on legal or medical text deserves benchmarking against a domain-tuned one. And bias auditing of embedding spaces is increasingly a compliance requirement, not a courtesy.",
    "interviewQuestions": [
      "How does word2vec learn meaningful vectors from raw text without any labels?",
      "Static vs contextual embeddings — what is the difference and when does it matter?",
      "Why do we say deep learning replaced feature engineering, and what did we trade for it?"
    ],
    "interviewAnswers": [
      "It converts unlabeled text into a self-supervised prediction task: skip-gram trains a model to predict context words from a center word (with negative sampling turning the giant softmax into cheap binary discriminations between true context words and random negatives). Words appearing in similar contexts must develop similar vectors to solve this task, so the distributional structure of language gets compressed into geometry. The vectors are the hidden-layer weights — a byproduct of the prediction task, not its goal — and the emergent linear structure (king - man + woman ~ queen) reflects the model implicitly factorizing co-occurrence (PMI) statistics.",
      "Static embeddings (word2vec, GloVe) assign one fixed vector per vocabulary word regardless of usage, so all senses of 'bank' share one point — cheap, fast, fine for coarse tasks. Contextual embeddings (BERT-era and later) run the sentence through a transformer and give each token occurrence a vector conditioned on its context, so 'bank' near 'river' and 'bank' near 'loan' land in different places. It matters wherever polysemy, negation, or word order affect the task — search, QA, entity disambiguation — which is most serious NLP; static vectors survive in latency-critical or embedded settings and as a pedagogical foundation.",
      "Classical ML pipelines spent most human effort designing input features (TF-IDF, SIFT descriptors, hand-built ratios) — the model could only be as good as the features. Deep learning moves that effort into architecture and objective design: the network learns its own features, layer by layer, optimized end-to-end for the task, which is why CNN features beat SIFT and learned embeddings beat TF-IDF almost everywhere at scale. The trade: interpretability (dimension 173 means nothing), data hunger (learned features need much more signal — hence pretraining and transfer), and new failure modes like inherited bias and domain shift. On small tabular problems the trade often is not worth it — gradient boosting on good hand-crafted features still wins there, which is exactly the judgment call seniors are paid to make."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Skip-gram with negative sampling from scratch (tiny corpus)",
        "code": "import numpy as np\n\ncorpus = ('king rules the kingdom . queen rules the kingdom . '\n          'man works the farm . woman works the farm . '\n          'king is a man . queen is a woman .').split()\nvocab = sorted(set(corpus))\nw2i = {w: i for i, w in enumerate(vocab)}\nV, D = len(vocab), 16\nrng = np.random.default_rng(1)\nW_in = rng.normal(0, 0.1, (V, D))    # center-word vectors (the embeddings)\nW_out = rng.normal(0, 0.1, (V, D))   # context vectors\n\ndef sigmoid(x):\n    return 1.0 / (1.0 + np.exp(-x))\n\nlr, window, k_neg = 0.05, 2, 5\nfor epoch in range(300):\n    for i, w in enumerate(corpus):\n        for j in range(max(0, i - window), min(len(corpus), i + window + 1)):\n            if i == j:\n                continue\n            c, o = w2i[w], w2i[corpus[j]]\n            # positive pair: push dot product up\n            score = sigmoid(W_in[c] @ W_out[o])\n            g = (score - 1.0)\n            W_out[o] -= lr * g * W_in[c]\n            W_in[c] -= lr * g * W_out[o]\n            # negative samples: push random words down\n            for n in rng.integers(0, V, k_neg):\n                s = sigmoid(W_in[c] @ W_out[n])\n                W_out[n] -= lr * s * W_in[c]\n                W_in[c] -= lr * s * W_out[n]\n\ndef nearest(word, n=3):\n    v = W_in[w2i[word]]\n    sims = W_in @ v / (np.linalg.norm(W_in, axis=1) * np.linalg.norm(v) + 1e-9)\n    return [vocab[i] for i in np.argsort(-sims)[1:n + 1]]\n\nprint('nearest to king :', nearest('king'))\nprint('nearest to woman:', nearest('woman'))\n# analogy: king - man + woman -> ?\nq = W_in[w2i['king']] - W_in[w2i['man']] + W_in[w2i['woman']]\nsims = W_in @ q / (np.linalg.norm(W_in, axis=1) * np.linalg.norm(q) + 1e-9)\nprint('king - man + woman ~', vocab[int(np.argsort(-sims)[0])])"
      }
    ],
    "resources": [
      { "label": "Karpathy — Zero to Hero (embeddings built from first principles)", "url": "https://karpathy.ai/zero-to-hero.html", "kind": "course" },
      { "label": "Hands-On Large Language Models — embeddings and semantic search chapters", "url": "https://github.com/HandsOnLLM/Hands-On-Large-Language-Models", "kind": "repo" },
      { "label": "StatQuest — word embeddings explained", "url": "https://www.youtube.com/@statquest", "kind": "video" }
    ]
  },
  {
    "id": "transfer-learning-dl",
    "phase": 6,
    "phaseName": "Deep Learning",
    "orderIndex": 8,
    "estimatedMins": 45,
    "prerequisites": ["cnns", "transformers-nlp"],
    "title": "Transfer Learning & Fine-Tuning",
    "eli5": "You do not teach a new employee to read before teaching them your filing system — they arrive already knowing how to read. Transfer learning hires a network that already learned to 'see' (edges, shapes, textures) or 'read' (grammar, facts) from millions of examples, and just teaches it your specific job with your small dataset. Days of training and mountains of data shrink to hours and hundreds of examples.",
    "analogy": "A pretrained backbone is a medical-school graduate; fine-tuning is residency. Feature extraction (freezing the backbone) is asking the graduate to apply textbook knowledge unchanged to your clinic — safe, fast, fine when your patients resemble the textbook. Full fine-tuning is retraining their instincts for a specialty — more powerful, but push too hard too fast (high learning rate) and they forget medical school entirely (catastrophic forgetting). The residency rule: adjust the newest instincts most (later layers), disturb the fundamentals least (early layers).",
    "explanation": "Transfer learning reuses a network pretrained on a large source task (ImageNet classification, next-token prediction on web text) as the starting point for a target task with far less data. It works because early layers learn broadly reusable features — edge and texture detectors in vision, syntax and word meaning in language — and only later layers specialize to the source task. Two regimes: feature extraction freezes the backbone and trains just a new head (fast, safe, best when data is tiny or similar to pretraining), and fine-tuning unfreezes some or all layers at a small learning rate so representations adapt (better when the domain differs or data is plentiful). The decision matrix: little + similar data means freeze; lots + different data means fine-tune everything; the middle ground is gradual unfreezing — train the head first, then unfreeze top blocks with discriminative learning rates (smaller for earlier layers). This is the default workflow of applied deep learning: almost no one trains from random initialization anymore.",
    "technicalDeep": "Mechanics that decide success: (1) Learning rate — fine-tuning uses 10-100x smaller LRs than scratch training (1e-5 to 3e-4 typical); the pretrained weights are a good optimum, and large steps destroy it (catastrophic forgetting). (2) New-head initialization — a randomly-initialized head sends large, noisy gradients into the backbone in early steps, so train the head with the backbone frozen first, or warm up. (3) Normalization statistics — in vision, keep or carefully re-estimate BatchNorm running stats; naively updating them on a tiny dataset can hurt more than weight updates help; also reuse the source model's input preprocessing (channel means/stds, tokenizer) exactly. (4) Discriminative LRs and gradual unfreezing (ULMFiT's recipe) formalize 'later layers change more'. In NLP, full fine-tuning of large models is memory-hungry (optimizer states are 2x parameters for Adam), which is why parameter-efficient fine-tuning (PEFT) dominates: LoRA freezes the pretrained weights and learns low-rank update matrices (W + BA with rank r 4-64), training under 1% of parameters at near-parity quality — cheap to store per-task, mergeable at inference. Linear probing (training only a linear head) doubles as a representation-quality diagnostic. When target data is large and truly far from the source domain (medical imaging from scratch vs ImageNet transfer is a live research question), transfer's edge shrinks — measure, do not assume.",
    "whatBreaks": "Fine-tuning at scratch-training learning rates (1e-2) destroys pretrained features within an epoch — loss improves briefly then the model performs worse than feature extraction: catastrophic forgetting. Mismatched preprocessing — wrong normalization constants, different image resize, or the wrong tokenizer — silently degrades everything downstream; the model 'works' but sees distorted inputs. Unfreezing everything with a random head first lets the head's noisy early gradients wreck the backbone. Tiny datasets with fully unfrozen large backbones overfit in a handful of epochs. BatchNorm layers left in train mode during partial freezing update running stats on your small dataset and shift behavior unexpectedly (freeze BN or put it in eval mode). And domain gaps that look small to humans (photos to sketches, news to legal text) can be large in feature space — always benchmark a frozen baseline before assuming transfer helps.",
    "efficientWay": {
      "title": "The Transfer Workflow",
      "approaches": [
        {
          "name": "Three-stage ladder on one dataset: linear probe (frozen backbone), then gradual unfreeze with discriminative LRs, then compare against LoRA on a small transformer — measuring all three",
          "verdict": "best",
          "reason": "Running the regimes side by side on the same data teaches the decision matrix empirically: you see exactly when unfreezing pays, what catastrophic forgetting looks like on a curve, and why PEFT took over NLP."
        },
        {
          "name": "Follow the PyTorch transfer-learning tutorial: fine-tune ResNet-18 on a small image dataset",
          "verdict": "ok",
          "reason": "The canonical exercise and a fine start — but one recipe on one dataset does not teach when to freeze vs unfreeze, which is the actual skill."
        },
        {
          "name": "Always fully fine-tune everything with default learning rates",
          "verdict": "weak",
          "reason": "On small datasets this reliably underperforms a frozen backbone while costing 10x the compute — the most common transfer-learning mistake in the wild."
        }
      ],
      "recommendation": "Take a pretrained ResNet-18 and a few-hundred-image dataset: (1) linear probe, record accuracy; (2) unfreeze the last block at LR 1e-4 with the head at 1e-3, record; (3) unfreeze all at LR 1e-5, record; (4) deliberately fine-tune at LR 1e-2 and watch catastrophic forgetting happen. Then repeat the spirit of it in NLP by fine-tuning a small BERT with and without LoRA. Keep the results table — it IS the decision matrix."
    },
    "commonMistakes": [
      "Fine-tuning with a scratch-training learning rate and wiping out the pretrained features (catastrophic forgetting)",
      "Not reproducing the source model's exact preprocessing — normalization constants, input size, tokenizer",
      "Unfreezing the backbone while the new head is still random, letting noisy head gradients corrupt good features",
      "Skipping the frozen-baseline comparison, so you never learn whether unfreezing (10x the cost) actually bought anything"
    ],
    "seniorNotes": "Transfer learning is the economic foundation of applied deep learning: pretraining costs millions, fine-tuning costs dollars, so the leverage question in any project is 'what is the best pretrained starting point?' — not 'what architecture shall we invent?'. Senior heuristics: linear-probe first (cheap diagnostic of representation fit), always match preprocessing bit-for-bit, freeze BatchNorm on small data, and use LoRA/PEFT by default for LLM-scale models — per-task adapters are megabytes instead of full model copies, which transforms deployment and multi-tenant serving. Watch licensing and provenance of pretrained weights (a compliance issue, not a footnote), and version-pin checkpoints — 'the same model from the hub' can change under you. Modern context: instruction tuning and RLHF are themselves transfer learning on top of pretrained LLMs, and the freeze-vs-adapt reasoning in this topic is exactly the mental model for those too.",
    "interviewQuestions": [
      "When would you freeze a pretrained backbone versus fine-tune it end to end?",
      "What is catastrophic forgetting and how do you prevent it during fine-tuning?",
      "Explain LoRA: what does it change about fine-tuning and why is it so widely used?"
    ],
    "interviewAnswers": [
      "It is a two-axis decision: dataset size and domain similarity to the pretraining data. Small dataset + similar domain: freeze the backbone and train only a head — the pretrained features already fit, and unfreezing just invites overfitting. Large dataset + different domain: fine-tune extensively, possibly everything — you have the signal to adapt representations and the domain gap demands it. The middle cases use partial adaptation: gradual unfreezing from the top, discriminative learning rates (early layers smallest), or PEFT. Always benchmark the frozen linear probe first — it is nearly free and sets the bar that any costlier regime must beat.",
      "Catastrophic forgetting is the destruction of pretrained knowledge when aggressive updates on the new task overwrite the weights encoding it — the network 'forgets' general features while chasing the small new dataset, often ending worse than a frozen baseline. Preventions are all forms of gentleness: learning rates 10-100x below scratch levels, warming up the new head before unfreezing the backbone, gradual unfreezing with discriminative LRs so foundational early layers barely move, early stopping on validation, and PEFT methods like LoRA that freeze the original weights entirely and confine learning to small side matrices — making forgetting structurally impossible in the base weights.",
      "LoRA (low-rank adaptation) freezes the pretrained weight matrices and learns only a low-rank correction: the effective weight is W + B A, where A and B are thin matrices of rank r (typically 4-64), so trainable parameters drop to well under 1% of the model. The bet — empirically strong — is that task adaptation lives in a low-dimensional subspace of weight space. Consequences that made it ubiquitous: optimizer memory collapses (you can fine-tune large LLMs on a single GPU), each task ships as a megabyte-scale adapter instead of a full model copy, adapters can be merged into W at inference for zero latency cost or hot-swapped for multi-task serving, and the frozen base weights cannot be catastrophically forgotten. Quality is at or near full fine-tuning for most downstream tasks."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Feature extraction vs fine-tuning a pretrained ResNet (the decision in code)",
        "code": "import torch\nimport torch.nn as nn\nfrom torchvision import models\n\n# --- regime 1: feature extraction (freeze backbone, new head only) ---\nmodel = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)\nfor p in model.parameters():\n    p.requires_grad = False                  # freeze everything\nmodel.fc = nn.Linear(model.fc.in_features, 5)  # new 5-class head (trainable)\n\ntrainable = [n for n, p in model.named_parameters() if p.requires_grad]\nprint('regime 1 trainable tensors:', trainable)   # only fc.weight, fc.bias\nopt = torch.optim.AdamW(model.fc.parameters(), lr=1e-3)\n\n# --- regime 2: gradual unfreeze with discriminative learning rates ---\nfor p in model.layer4.parameters():          # unfreeze ONLY the last block\n    p.requires_grad = True\nopt = torch.optim.AdamW([\n    {'params': model.fc.parameters(),     'lr': 1e-3},  # new head: fastest\n    {'params': model.layer4.parameters(), 'lr': 1e-4},  # top block: gentle\n])                                            # earlier layers: stay frozen\n\n# BatchNorm hygiene on small datasets: keep frozen BN in eval mode\ndef set_frozen_bn_eval(m):\n    if isinstance(m, nn.BatchNorm2d) and not m.weight.requires_grad:\n        m.eval()\nmodel.train()\nmodel.apply(set_frozen_bn_eval)\n\nn_train = sum(p.numel() for p in model.parameters() if p.requires_grad)\nn_total = sum(p.numel() for p in model.parameters())\nprint('training %.1f%% of %.1fM params' % (100 * n_train / n_total,\n                                           n_total / 1e6))\n\n# NOTE: preprocessing must match pretraining EXACTLY:\nweights = models.ResNet18_Weights.DEFAULT\npreprocess = weights.transforms()            # correct resize + normalization\nprint(preprocess)"
      }
    ],
    "resources": [
      { "label": "CS231n — transfer learning notes", "url": "https://cs231n.github.io/", "kind": "course" },
      { "label": "PyTorch tutorials — transfer learning for computer vision", "url": "https://pytorch.org/tutorials/", "kind": "docs" },
      { "label": "Hands-On Large Language Models — fine-tuning and PEFT chapters", "url": "https://github.com/HandsOnLLM/Hands-On-Large-Language-Models", "kind": "repo" },
      { "label": "Andrew Ng — ML Specialization (transfer learning module)", "url": "https://www.coursera.org/specializations/machine-learning-introduction", "kind": "course" }
    ]
  }
]
