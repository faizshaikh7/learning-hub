import type { Lifecycle } from '@/types'

/** AI/ML engineering lifecycles every AI engineer must know cold. */
export const AI_LIFECYCLES: Lifecycle[] = [
  {
    id: 'ml-model-lifecycle',
    title: 'ML Model Lifecycle (MLOps)',
    subtitle: 'From problem framing to monitoring and retraining',
    icon: '🔁',
    flow: 'cyclic',
    overview:
      'A production ML system is never "done." It\'s a continuous loop: frame the problem, gather and prepare data, train, evaluate, deploy, monitor, and — as the world drifts — retrain. The engineering discipline around this loop is MLOps. Most model failures in production are data and monitoring failures, not modeling failures.',
    stages: [
      {
        name: 'Problem framing',
        shortLabel: 'frame',
        description: 'Define the task, the success metric, and whether ML is even the right tool.',
        durationHint: 'first',
        details: [
          'Translate a business goal into a measurable ML objective (and a baseline)',
          'Decide the framing: classification, regression, ranking, generation, retrieval',
          'Ask "can a heuristic or a call to an existing LLM solve this?" before training anything',
        ],
        gotchas: ['Optimizing a metric that doesn\'t map to business value (e.g. accuracy on an imbalanced dataset)'],
      },
      {
        name: 'Data collection & labeling',
        shortLabel: 'data',
        description: 'Gather representative data and produce trustworthy labels.',
        durationHint: 'ongoing',
        details: [
          'Data quality and coverage dominate model quality — garbage in, garbage out',
          'Track provenance and versioning of datasets (DVC, feature stores)',
          'Labeling strategy: human, weak supervision, or model-assisted labeling',
        ],
        gotchas: [
          'Label leakage — a feature that encodes the answer inflates offline metrics and fails in prod',
          'Train/serve skew from collecting training data differently than production data',
        ],
      },
      {
        name: 'Data prep & feature engineering',
        shortLabel: 'prep',
        description: 'Clean, split, and transform data into features the model consumes.',
        durationHint: 'per iteration',
        details: [
          'Split train/validation/test BEFORE any fitting to avoid leakage',
          'Handle missing values, scaling, encoding; compute embeddings for text/images',
          'A feature store keeps training and serving transformations identical',
        ],
      },
      {
        name: 'Training',
        shortLabel: 'train',
        description: 'Fit the model (or fine-tune/prompt an existing one) on the prepared data.',
        durationHint: 'compute-heavy',
        details: [
          'For LLM apps this may be prompt engineering, RAG, or fine-tuning — not training from scratch',
          'Track experiments (hyperparameters, data version, code) with MLflow / W&B',
          'Reproducibility = fixed seeds + versioned data + versioned code',
        ],
      },
      {
        name: 'Evaluation',
        shortLabel: 'eval',
        description: 'Measure performance on held-out data against the baseline and business metric.',
        durationHint: 'gate to ship',
        details: [
          'Offline metrics (accuracy, F1, nDCG) plus task-specific evals (LLM-as-judge, RAGAS)',
          'Slice metrics by segment — a model can be great overall and terrible for a subgroup',
          'Compare against the current production model, not just against zero',
        ],
        gotchas: ['Evaluating on data that leaked into training gives a false green light'],
      },
      {
        name: 'Deployment',
        shortLabel: 'deploy',
        description: 'Ship the model behind an API, batch job, or edge runtime — safely.',
        durationHint: 'gradual',
        details: [
          'Roll out with shadow mode, canary, or A/B to limit blast radius',
          'Version the model and keep instant rollback available',
          'Serving concerns: latency, batching, caching, cost per request',
        ],
      },
      {
        name: 'Monitoring & drift detection',
        shortLabel: 'monitor',
        description: 'Watch live quality, latency, cost, and data/concept drift.',
        durationHint: 'continuous',
        details: [
          'Data drift (inputs change) and concept drift (input→output relationship changes) degrade models silently',
          'Monitor prediction distributions, not just system metrics',
          'Capture real traffic + outcomes to build the next training set',
        ],
        gotchas: ['No monitoring = a model that quietly rots for months before anyone notices'],
      },
      {
        name: 'Retrain (loop back)',
        shortLabel: 'retrain',
        description: 'Drift or new data triggers a return to data prep and training — the cycle repeats.',
        durationHint: 'triggered',
        details: [
          'Retraining can be scheduled (nightly/weekly) or triggered by a drift alarm',
          'Automate the loop so retraining is a pipeline run, not a heroic manual effort',
        ],
      },
    ],
    keyTakeaways: [
      'ML in production is a loop, not a project — the retrain cycle never ends',
      'Data quality and monitoring cause most real-world failures, not the model architecture',
      'Prevent leakage: split before you fit, and keep training/serving transforms identical',
      'Version everything (data, code, model) so any result is reproducible and rollback-able',
      'For LLM apps, "training" is often prompting, RAG, or fine-tuning — same lifecycle applies',
    ],
    interviewNotes: [
      'Walk through the end-to-end ML lifecycle for a real system.',
      'What is train/serve skew and how do you prevent it?',
      'Define data drift vs concept drift and how you\'d detect each.',
      'What is data leakage and give an example.',
      'How do you deploy a new model safely?',
    ],
    relatedTopics: ['llm-observability', 'production-ai-patterns', 'regression-testing-ai', 'cost-latency-monitoring'],
  },

  {
    id: 'rag-pipeline-lifecycle',
    title: 'RAG Pipeline Lifecycle',
    subtitle: 'From raw docs to a grounded answer',
    icon: '📚',
    flow: 'linear',
    overview:
      'Retrieval-Augmented Generation grounds an LLM in your data. The pipeline has two halves: an offline indexing phase (chunk → embed → store) and an online query phase (embed query → retrieve → rerank → augment → generate). Most RAG quality problems live in chunking and retrieval, not in the LLM.',
    stages: [
      {
        name: 'Ingest & chunk',
        shortLabel: 'chunk',
        description: 'Load source documents and split them into retrievable chunks.',
        durationHint: 'offline',
        details: [
          'Chunk size is a tradeoff: too big dilutes relevance, too small loses context',
          'Semantic/structural chunking (by heading, paragraph) beats naive fixed-size splits',
          'Keep metadata (source, title, section) for filtering and citations',
        ],
        gotchas: ['Bad chunking is the #1 cause of poor RAG — the LLM can\'t use what retrieval never surfaced'],
      },
      {
        name: 'Embed',
        shortLabel: 'embed',
        description: 'Convert each chunk into a vector using an embedding model.',
        durationHint: 'offline',
        details: [
          'The same embedding model must be used for chunks and for queries',
          'Model choice affects recall, cost, and dimensionality',
          'Normalize and store embeddings for cosine/dot-product similarity',
        ],
      },
      {
        name: 'Store & index',
        shortLabel: 'index',
        description: 'Persist vectors (plus metadata) in a vector database with an ANN index.',
        durationHint: 'offline',
        details: [
          'ANN indexes (HNSW, IVF) trade a little recall for huge speed',
          'Store original text + metadata alongside the vector for retrieval and citations',
        ],
      },
      {
        name: 'Query embed & retrieve',
        shortLabel: 'retrieve',
        description: 'Embed the user question and fetch the top-k most similar chunks.',
        durationHint: 'per request',
        details: [
          'Hybrid search (dense vectors + keyword/BM25) beats pure vector search on many queries',
          'Metadata filters scope retrieval (tenant, date, permissions)',
          'Tune k — too few misses context, too many adds noise and cost',
        ],
      },
      {
        name: 'Rerank',
        shortLabel: 'rerank',
        description: 'Reorder retrieved chunks with a cross-encoder for precision.',
        durationHint: 'optional',
        details: [
          'A reranker scores query–chunk pairs jointly and is far more accurate than embedding similarity',
          'Retrieve a wide net (k=50), rerank, keep the top few for the prompt',
        ],
      },
      {
        name: 'Augment & generate',
        shortLabel: 'generate',
        description: 'Insert the chunks into the prompt and have the LLM answer, grounded and cited.',
        durationHint: 'per request',
        details: [
          'Instruct the model to answer only from context and to say "I don\'t know" otherwise',
          'Return citations so users can verify — this is what makes RAG trustworthy',
          'Watch the context budget: too many chunks crowd out the instruction',
        ],
        gotchas: ['Without grounding instructions the model ignores context and hallucinates from its weights'],
      },
    ],
    keyTakeaways: [
      'RAG = offline indexing (chunk→embed→store) + online querying (embed→retrieve→rerank→generate)',
      'Chunking and retrieval quality dominate — fix those before touching the LLM or prompt',
      'Use the SAME embedding model for documents and queries',
      'Hybrid search + a reranker is the highest-ROI upgrade over naive vector search',
      'Always instruct grounding and return citations to control hallucination',
    ],
    interviewNotes: [
      'Draw the full RAG pipeline, offline and online halves.',
      'Why is chunking so important and how do you choose a strategy?',
      'What does a reranker add over embedding similarity?',
      'How do you reduce hallucination in a RAG system?',
      'When is hybrid search better than pure vector search?',
    ],
    relatedTopics: ['rag-fundamentals', 'document-chunking', 'rag-retrieval', 'rag-generation', 'advanced-rag'],
  },

  {
    id: 'agent-loop-lifecycle',
    title: 'AI Agent Loop (ReAct)',
    subtitle: 'Reason → Act → Observe, until the goal is met',
    icon: '🤖',
    flow: 'cyclic',
    overview:
      'An agent is an LLM in a loop with tools. It reasons about what to do, calls a tool, observes the result, and repeats until it can answer. The ReAct pattern (Reason + Act) is the backbone of modern agents. Controlling the loop — tool design, stopping conditions, and error handling — is what separates a reliable agent from one that spins forever.',
    stages: [
      {
        name: 'Goal & context',
        shortLabel: 'goal',
        description: 'The agent receives the task plus system prompt, tools, and memory.',
        durationHint: 'start',
        details: [
          'System prompt defines role, constraints, and available tools',
          'Context includes conversation history and any retrieved knowledge',
        ],
      },
      {
        name: 'Reason (think)',
        shortLabel: 'reason',
        description: 'The model decides the next step: answer directly or call a tool.',
        durationHint: 'per iteration',
        details: [
          'The model produces a thought and a chosen action (often a tool call)',
          'Good tool descriptions are what let the model pick correctly',
        ],
        gotchas: ['Vague or overlapping tool descriptions cause wrong-tool selection'],
      },
      {
        name: 'Act (call a tool)',
        shortLabel: 'act',
        description: 'The runtime executes the requested tool with the model\'s arguments.',
        durationHint: 'per iteration',
        details: [
          'Validate arguments before executing — the model can produce malformed input',
          'Tools should be idempotent and safe; gate destructive actions behind confirmation',
        ],
        code: {
          lang: 'python',
          label: 'a tool call step',
          code: 'while not done:\n    step = llm.next_action(context)\n    if step.type == "final":\n        return step.answer\n    result = tools[step.tool](**step.args)  # Act\n    context.append(observation(result))    # Observe',
        },
      },
      {
        name: 'Observe',
        shortLabel: 'observe',
        description: 'The tool result is fed back into the context for the next reasoning step.',
        durationHint: 'per iteration',
        details: [
          'Truncate/summarize large tool outputs to protect the context window',
          'Surface tool errors as observations so the model can recover',
        ],
      },
      {
        name: 'Check stop condition',
        shortLabel: 'stop?',
        description: 'If the goal is met the agent answers; otherwise it loops back to reason.',
        durationHint: 'per iteration',
        details: [
          'Always enforce a max-steps / max-tokens / timeout budget',
          'Detect loops (same action repeated) and break out',
        ],
        gotchas: [
          'No step budget → an agent can loop forever and burn tokens/money',
          'No loop detection → the agent repeats a failing action indefinitely',
        ],
      },
    ],
    keyTakeaways: [
      'An agent is an LLM in a loop with tools: Reason → Act → Observe → repeat',
      'Tool descriptions are the steering wheel — invest in them',
      'Always bound the loop with max steps, timeouts, and loop detection',
      'Validate tool arguments and treat destructive actions as high-risk',
      'Summarize tool outputs to keep the context window from overflowing',
    ],
    interviewNotes: [
      'Explain the ReAct pattern and the agent loop.',
      'How do you stop an agent from looping forever?',
      'Why are tool descriptions so important to agent reliability?',
      'How do you handle a tool that returns an error mid-loop?',
    ],
    relatedTopics: ['ai-agents-intro', 'react-pattern', 'tool-use-agents', 'multi-agent-systems'],
  },

  {
    id: 'llm-inference-lifecycle',
    title: 'LLM Inference Lifecycle',
    subtitle: 'Prompt → tokens → forward pass → sampling → text',
    icon: '⚡',
    flow: 'linear',
    overview:
      'When you call an LLM, a lot happens between your string and the streamed response. Understanding tokenization, the prefill vs decode split, sampling, and the KV cache explains latency, cost, and why parameters like temperature and max_tokens behave the way they do.',
    stages: [
      {
        name: 'Tokenize',
        shortLabel: 'tokenize',
        description: 'Your text is split into tokens (subword units) and mapped to integer IDs.',
        durationHint: 'fast',
        details: [
          'Tokens ≈ 0.75 words on average in English; you pay per token, not per word',
          'Different models use different tokenizers — token counts vary across providers',
        ],
        gotchas: ['Long system prompts silently inflate cost — every request re-pays for them unless cached'],
      },
      {
        name: 'Prefill (process the prompt)',
        shortLabel: 'prefill',
        description: 'The model runs one forward pass over all prompt tokens, building the KV cache.',
        durationHint: 'scales with prompt',
        details: [
          'Prefill cost grows with prompt length — this drives time-to-first-token',
          'The KV cache stores attention state so future tokens don\'t reprocess the prompt',
          'Prompt caching reuses this work across requests with the same prefix',
        ],
      },
      {
        name: 'Decode (generate tokens)',
        shortLabel: 'decode',
        description: 'The model generates one token at a time, each conditioned on all previous tokens.',
        durationHint: 'per output token',
        details: [
          'Autoregressive: one token per forward pass, reusing the KV cache',
          'Output latency scales with the number of tokens generated (cap it with max_tokens)',
          'This is the streamed text you see appear token by token',
        ],
      },
      {
        name: 'Sample',
        shortLabel: 'sample',
        description: 'Each step produces a probability distribution; sampling picks the next token.',
        durationHint: 'per token',
        details: [
          'temperature flattens/sharpens the distribution (0 = near-deterministic, high = creative)',
          'top-p / top-k restrict sampling to the most probable tokens',
          'For structured output, constrained decoding / JSON mode forces valid shapes',
        ],
        gotchas: ['High temperature increases hallucination and breaks structured outputs'],
      },
      {
        name: 'Detokenize & stop',
        shortLabel: 'stop',
        description: 'Token IDs become text; generation stops at a stop sequence, max_tokens, or EOS.',
        durationHint: 'end',
        details: [
          'Stop sequences and max_tokens bound the response',
          'The response is detokenized back into a human-readable string',
        ],
      },
    ],
    keyTakeaways: [
      'You are billed in tokens (~0.75 words); prompt length directly drives cost and first-token latency',
      'Prefill processes the whole prompt once; decode generates one token per pass — output length drives latency',
      'The KV cache (and prompt caching) is why reusing a prefix is cheap',
      'temperature/top-p shape sampling; keep them low for factual or structured output',
      'Cap responses with max_tokens and stop sequences to control cost',
    ],
    interviewNotes: [
      'Explain what happens between sending a prompt and receiving a response.',
      'What is the difference between prefill and decode?',
      'How do temperature and top-p affect generation?',
      'What is the KV cache and why does prompt caching save money?',
      'Why does a longer prompt increase both cost and latency?',
    ],
    relatedTopics: ['llm-fundamentals', 'core-llm-parameters', 'prompt-caching', 'api-cost-optimization'],
  },
]
