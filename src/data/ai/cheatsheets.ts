import type { Cheatsheet } from '@/types'

/** AI/LLM engineering quick-reference cheat sheets. */
export const AI_CHEATSHEETS: Cheatsheet[] = [
  {
    id: 'prompting-patterns',
    title: 'Prompting Patterns',
    subtitle: 'The techniques that reliably move quality',
    icon: '💬',
    sections: [
      {
        heading: 'Core patterns',
        entries: [
          { label: 'Zero-shot', value: 'Just ask. Give a clear task + constraints, no examples. The baseline.' },
          { label: 'Few-shot', value: 'Show 2–5 input→output examples so the model mimics the pattern/format.' },
          { label: 'Chain-of-Thought', value: '"Think step by step" — let the model reason before answering hard/math/logic tasks.' },
          { label: 'ReAct', value: 'Reason → Act (call a tool) → Observe → repeat. The loop behind most agents.' },
          { label: 'Self-consistency', value: 'Sample the reasoning N times, take the majority answer. Trades cost for accuracy.' },
        ],
      },
      {
        heading: 'Structure a good prompt',
        entries: [
          { label: 'Role/system', value: 'Set persona, rules, and boundaries once in the system prompt.' },
          { label: 'Context', value: 'Provide retrieved docs/data, clearly delimited (e.g. XML tags or ###).' },
          { label: 'Task', value: 'State the single objective + explicit constraints and output format.' },
          { label: 'Examples', value: 'Few-shot demos of the exact shape you want back.' },
          { label: 'Output format', value: 'Ask for JSON/markdown/schema explicitly; give a template to fill.' },
        ],
      },
      {
        heading: 'Reliability tricks',
        entries: [
          { label: 'Delimit inputs', value: 'Wrap user/retrieved text in <doc>...</doc> to resist prompt injection & confusion.' },
          { label: 'Ground it', value: '"Answer ONLY from the context. If not present, say you don\'t know."' },
          { label: 'Give an out', value: 'Allow "I don\'t know" to cut hallucinations on unanswerable questions.' },
          { label: 'Prefill / lead-in', value: 'Start the assistant turn (e.g. with `{`) to force JSON or a format.' },
          { label: 'Decompose', value: 'Break a big ask into chained smaller prompts; each is easier to verify.' },
        ],
      },
      {
        heading: 'Anti-patterns',
        entries: [
          { label: 'Vague asks', value: '"Make it better" — the model can\'t read your mind. Be specific.' },
          { label: 'Negation overload', value: 'Long lists of "don\'t" work worse than stating what TO do.' },
          { label: 'CoT on trivial tasks', value: 'Wastes tokens/latency; reserve for genuinely hard reasoning.' },
          { label: 'Kitchen-sink prompt', value: 'Ten tasks in one call → decompose instead.' },
        ],
      },
    ],
  },
  {
    id: 'llm-parameters',
    title: 'LLM Parameters',
    subtitle: 'The knobs on every chat/completion call',
    icon: '🎛️',
    sections: [
      {
        heading: 'Sampling',
        entries: [
          { label: 'temperature', value: '0–2. Randomness. Low = focused/repeatable, high = diverse. Default ~0.7.' },
          { label: 'top_p', value: 'Nucleus sampling: keep tokens up to cumulative prob p (e.g. 0.9). Tune this OR temperature.' },
          { label: 'top_k', value: 'Sample only from the k most likely tokens (some providers/local models).' },
          { label: 'seed', value: 'Fix for (best-effort) reproducible outputs — great for tests/evals.' },
        ],
      },
      {
        heading: 'Length & stopping',
        entries: [
          { label: 'max_tokens', value: 'Cap on tokens generated. Too low → truncated JSON/answers.' },
          { label: 'stop', value: 'Up to N sequences that end generation early (e.g. "\\n\\n", "</answer>").', code: true },
          { label: 'context window', value: 'Total input+output token budget of the model — everything must fit.' },
        ],
      },
      {
        heading: 'Repetition control',
        entries: [
          { label: 'frequency_penalty', value: '−2..2. Penalizes tokens by how often they\'ve appeared. Reduces verbatim loops.' },
          { label: 'presence_penalty', value: '−2..2. Penalizes tokens that appeared at all. Nudges new topics.' },
        ],
      },
      {
        heading: 'Structure & tools',
        entries: [
          { label: 'response_format', value: 'Force JSON / a JSON Schema (OpenAI Structured Outputs) so parsing never breaks.' },
          { label: 'tools / tool_choice', value: 'Define callable functions; force, auto, or forbid tool use.' },
          { label: 'system prompt', value: 'Persistent instructions/persona applied to the whole conversation.' },
          { label: 'reasoning_effort', value: 'On reasoning models: trade thinking depth vs latency/cost (low/med/high).' },
        ],
      },
      {
        heading: 'Rules of thumb',
        entries: [
          { label: 'Extraction / code / tools', value: 'temperature 0–0.3, response_format JSON.' },
          { label: 'Chat / drafting', value: 'temperature 0.5–0.7, sensible max_tokens.' },
          { label: 'Brainstorm / creative', value: 'temperature 0.8–1.0, top_p ~0.95.' },
          { label: 'Don\'t double-tune', value: 'Adjust temperature OR top_p, not both at once.' },
        ],
      },
    ],
  },
  {
    id: 'api-quick-reference',
    title: 'API Quick Reference',
    subtitle: 'OpenAI & Anthropic chat + tool-call basics',
    icon: '🔌',
    sections: [
      {
        heading: 'OpenAI — chat',
        entries: [
          { label: 'Endpoint', value: 'client.responses.create({ model, input }) — or chat.completions.create({ model, messages })', code: true },
          { label: 'Models (2025)', value: 'gpt-5, gpt-5-mini, gpt-4.1, o4-mini (reasoning). Pick by cost/latency/reasoning.' },
          { label: 'Messages', value: 'roles: system | user | assistant | tool. Ordered array.' },
          { label: 'JSON out', value: 'response_format: { type: "json_schema", json_schema: {...} } — guaranteed valid.', code: true },
          { label: 'Stream', value: 'stream: true → iterate server-sent token deltas.', code: true },
        ],
      },
      {
        heading: 'Anthropic — messages',
        entries: [
          { label: 'Endpoint', value: 'client.messages.create({ model, max_tokens, system, messages })', code: true },
          { label: 'Models (2025)', value: 'claude-opus-4, claude-sonnet-4.5, claude-haiku-4.5. Sonnet is the workhorse default.' },
          { label: 'System', value: 'Top-level `system` param (not a message role).', code: true },
          { label: 'max_tokens', value: 'Required — cap on the response length.' },
          { label: 'Extended thinking', value: 'thinking: { type: "enabled", budget_tokens } for hard reasoning.', code: true },
        ],
      },
      {
        heading: 'Tool / function calling',
        entries: [
          { label: 'Define', value: 'Give each tool a name, description, and JSON-Schema parameters.' },
          { label: 'Loop', value: 'Call → model returns tool_use → you run it → send tool_result back → model answers.' },
          { label: 'OpenAI shape', value: 'tools:[{type:"function",function:{name,parameters}}], read tool_calls.', code: true },
          { label: 'Anthropic shape', value: 'tools:[{name,input_schema}], read content blocks of type tool_use.', code: true },
          { label: 'Force a tool', value: 'tool_choice to require/auto/none. Great for structured extraction.' },
        ],
      },
      {
        heading: 'Cost & reliability',
        entries: [
          { label: 'Prompt caching', value: 'Cache stable prefixes (system + docs) → big cost/latency cut on repeat calls.' },
          { label: 'Token = ~4 chars', value: '~0.75 words. Count with tiktoken (OpenAI) / provider tokenizer to budget.' },
          { label: 'Retry', value: 'Handle 429/5xx with exponential backoff + jitter; respect Retry-After.' },
          { label: 'Never hardcode keys', value: 'Load from env/secret manager; keys are server-side only.' },
          { label: 'Set timeouts', value: 'LLM calls are slow & variable — always timeout + stream for UX.' },
        ],
      },
    ],
  },
  {
    id: 'rag-pipeline-checklist',
    title: 'RAG Pipeline Checklist',
    subtitle: 'From raw docs to a grounded, cited answer',
    icon: '📚',
    sections: [
      {
        heading: '1. Ingest & chunk',
        entries: [
          { label: 'Parse', value: 'Extract clean text (handle PDF/HTML/markdown; keep tables & code intact).' },
          { label: 'Chunk', value: 'Recursive split ~500–800 tokens, 10–20% overlap. Chunk to one coherent idea.' },
          { label: 'Enrich', value: 'Prepend section/heading context to each chunk (contextual retrieval).' },
          { label: 'Metadata', value: 'Store source, title, date, section, permissions for filtering & citations.' },
        ],
      },
      {
        heading: '2. Embed & index',
        entries: [
          { label: 'Embed', value: 'One model for docs AND queries (e.g. text-embedding-3-small / BGE-M3).' },
          { label: 'Store', value: 'Vector DB (pgvector / Qdrant / Pinecone) with metadata payloads.' },
          { label: 'Re-embed on change', value: 'Switching embedding models = re-embed the whole corpus.' },
        ],
      },
      {
        heading: '3. Retrieve',
        entries: [
          { label: 'Hybrid search', value: 'Dense (vector) + sparse (BM25/keyword) beats either alone.' },
          { label: 'Filter', value: 'Apply metadata filters (tenant, ACL, date) BEFORE/at search time.' },
          { label: 'Rerank', value: 'Over-fetch top-k (e.g. 20) then rerank to top 3–5 with a cross-encoder/Cohere Rerank.' },
          { label: 'Query rewrite', value: 'Expand/rephrase the query (or HyDE) for better recall.' },
        ],
      },
      {
        heading: '4. Generate',
        entries: [
          { label: 'Ground the prompt', value: 'Insert chunks delimited; "answer only from context, else say you don\'t know".' },
          { label: 'Cite', value: 'Require source ids/quotes so answers are verifiable.' },
          { label: 'Low temperature', value: 'Keep it factual and repeatable (0–0.3).' },
          { label: 'Guard injection', value: 'Treat retrieved text as data, not instructions.' },
        ],
      },
      {
        heading: '5. Evaluate & monitor',
        entries: [
          { label: 'Retrieval metrics', value: 'recall@k / precision@k / MRR on a labeled question set.' },
          { label: 'Answer metrics', value: 'Faithfulness (grounded?), relevance, correctness (LLM-as-judge + spot human).' },
          { label: 'Trace', value: 'Log query → retrieved chunks → prompt → answer for every request.' },
          { label: 'Watch cost/latency', value: 'Track tokens, p95 latency, and cache hit rate in production.' },
        ],
      },
    ],
  },
]
