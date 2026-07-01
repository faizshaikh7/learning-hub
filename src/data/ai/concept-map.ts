import type { ConceptMap } from '@/types'

/** How the big ideas of AI/LLM engineering connect. */
export const AI_CONCEPT_MAP: ConceptMap = {
  title: 'AI Engineering Concept Map',
  intro:
    'Building with LLMs is a chain of connected ideas: text becomes tokens, a model predicts the next one, and you shape its behavior with prompts, ground it with retrieval, extend it with tools, and keep it safe, evaluated, and cheap in production. Tap any concept to see how it links to the rest.',
  clusters: [
    {
      id: 'foundations',
      name: 'Foundations',
      concepts: [
        { id: 'llm', label: 'LLM', summary: 'A transformer that predicts the next token to generate text.', topicId: 'llm-fundamentals', relatesTo: [{ id: 'tokens', relation: 'operates on' }, { id: 'params', relation: 'controlled by' }, { id: 'prompt', relation: 'steered by' }] },
        { id: 'tokens', label: 'Tokens', summary: 'Sub-word units; models read/write and are priced in tokens.', topicId: 'llm-fundamentals', relatesTo: [{ id: 'context', relation: 'fill' }, { id: 'cost', relation: 'drive' }] },
        { id: 'params', label: 'Parameters', summary: 'Temperature, top_p, max_tokens, stop — how sampling behaves.', topicId: 'core-llm-parameters', relatesTo: [{ id: 'llm', relation: 'configure' }, { id: 'hallucination', relation: 'influence' }] },
        { id: 'hallucination', label: 'Hallucination', summary: 'Confident but wrong output; grounding and evals fight it.', topicId: 'hallucination-detection', relatesTo: [{ id: 'rag', relation: 'reduced by' }, { id: 'eval', relation: 'measured by' }] },
      ],
    },
    {
      id: 'prompt-context',
      name: 'Prompt & Context',
      concepts: [
        { id: 'prompt', label: 'Prompt Engineering', summary: 'Clear instructions, roles, and few-shot examples to steer output.', topicId: 'prompt-engineering-basics', relatesTo: [{ id: 'cot', relation: 'includes' }, { id: 'context', relation: 'fills' }] },
        { id: 'cot', label: 'Chain-of-Thought', summary: 'Make the model reason step by step before answering.', topicId: 'chain-of-thought', relatesTo: [{ id: 'react', relation: 'basis for' }, { id: 'prompt', relation: 'technique of' }] },
        { id: 'context', label: 'Context Engineering', summary: 'Curating what fills the window: instructions, data, history.', topicId: 'context-engineering', relatesTo: [{ id: 'rag', relation: 'fed by' }, { id: 'caching', relation: 'optimized by' }] },
        { id: 'caching', label: 'Prompt Caching', summary: 'Reuse stable prompt prefixes to cut cost and latency.', topicId: 'prompt-caching', relatesTo: [{ id: 'cost', relation: 'lowers' }, { id: 'context', relation: 'speeds up' }] },
      ],
    },
    {
      id: 'apis-platforms',
      name: 'APIs & Platforms',
      concepts: [
        { id: 'chatapi', label: 'Chat / Completion API', summary: 'Send messages, get generated text; the core call.', topicId: 'llm-fundamentals', relatesTo: [{ id: 'llm', relation: 'invokes' }, { id: 'functioncall', relation: 'supports' }] },
        { id: 'functioncall', label: 'Function Calling', summary: 'Model returns a structured call to a tool you defined.', topicId: 'function-calling', relatesTo: [{ id: 'tools', relation: 'enables' }, { id: 'mcp', relation: 'standardized by' }] },
        { id: 'cost', label: 'Cost & Latency', summary: 'Token pricing, p95 latency, and caching shape unit economics.', topicId: 'cost-latency-monitoring', relatesTo: [{ id: 'caching', relation: 'reduced by' }, { id: 'obs', relation: 'tracked by' }] },
        { id: 'finetune', label: 'Fine-Tuning (LoRA)', summary: 'Adapt weights to teach tone, format, or a narrow task.', topicId: 'fine-tuning-lora', relatesTo: [{ id: 'llm', relation: 'specializes' }, { id: 'quant', relation: 'paired with' }] },
        { id: 'quant', label: 'Quantization', summary: 'Shrink models (4/8-bit) to run cheaper and faster.', topicId: 'quantization-distillation', relatesTo: [{ id: 'finetune', relation: 'complements' }] },
      ],
    },
    {
      id: 'embeddings-vectors',
      name: 'Embeddings & Vectors',
      concepts: [
        { id: 'embeddings', label: 'Embeddings', summary: 'Vectors that place similar meaning near each other.', topicId: 'what-are-embeddings', relatesTo: [{ id: 'vectordb', relation: 'stored in' }, { id: 'retrieval', relation: 'power' }] },
        { id: 'vectordb', label: 'Vector Database', summary: 'Stores embeddings and does fast similarity search.', topicId: 'vector-database-intro', relatesTo: [{ id: 'embeddings', relation: 'indexes' }, { id: 'retrieval', relation: 'serves' }] },
        { id: 'pinecone', label: 'Pinecone', summary: 'Managed, serverless vector DB for production RAG.', topicId: 'pinecone', relatesTo: [{ id: 'vectordb', relation: 'is a' }] },
        { id: 'qdrant', label: 'Qdrant / Weaviate', summary: 'OSS vector DBs with strong filtering & hybrid search.', topicId: 'weaviate-qdrant', relatesTo: [{ id: 'vectordb', relation: 'are' }] },
        { id: 'chroma', label: 'Chroma / FAISS', summary: 'Local-first vector stores for prototypes & notebooks.', topicId: 'chroma-faiss', relatesTo: [{ id: 'vectordb', relation: 'are' }] },
      ],
    },
    {
      id: 'rag',
      name: 'RAG',
      concepts: [
        { id: 'rag', label: 'RAG', summary: 'Retrieve relevant chunks, then generate a grounded answer.', topicId: 'rag-fundamentals', relatesTo: [{ id: 'chunking', relation: 'starts with' }, { id: 'retrieval', relation: 'uses' }, { id: 'generation', relation: 'ends with' }] },
        { id: 'chunking', label: 'Chunking', summary: 'Split documents into coherent, retrievable pieces.', topicId: 'document-chunking', relatesTo: [{ id: 'embeddings', relation: 'feeds' }] },
        { id: 'retrieval', label: 'Retrieval', summary: 'Hybrid search + rerank to find the best chunks.', topicId: 'rag-retrieval', relatesTo: [{ id: 'vectordb', relation: 'queries' }, { id: 'generation', relation: 'feeds' }] },
        { id: 'generation', label: 'Generation', summary: 'LLM answers from retrieved context with citations.', topicId: 'rag-generation', relatesTo: [{ id: 'llm', relation: 'calls' }, { id: 'hallucination', relation: 'curbs' }] },
        { id: 'advancedrag', label: 'Advanced RAG', summary: 'Query rewriting, reranking, HyDE, graph & agentic RAG.', topicId: 'advanced-rag', relatesTo: [{ id: 'retrieval', relation: 'improves' }, { id: 'agents', relation: 'combines with' }] },
        { id: 'llamaindex', label: 'LlamaIndex', summary: 'Data framework for indexing & advanced retrieval.', topicId: 'llamaindex-framework', relatesTo: [{ id: 'rag', relation: 'builds' }] },
      ],
    },
    {
      id: 'agents-mcp',
      name: 'Agents & MCP',
      concepts: [
        { id: 'agents', label: 'AI Agents', summary: 'LLMs that plan, act with tools, and loop toward a goal.', topicId: 'ai-agents-intro', relatesTo: [{ id: 'react', relation: 'run on' }, { id: 'tools', relation: 'use' }] },
        { id: 'react', label: 'ReAct Pattern', summary: 'Reason → Act → Observe loop driving tool use.', topicId: 'react-pattern', relatesTo: [{ id: 'cot', relation: 'extends' }, { id: 'agents', relation: 'powers' }] },
        { id: 'tools', label: 'Tool Use', summary: 'Give the model APIs, search, code, and DB access.', topicId: 'tool-use-agents', relatesTo: [{ id: 'functioncall', relation: 'built on' }, { id: 'mcp', relation: 'shared via' }] },
        { id: 'mcp', label: 'MCP', summary: 'Open protocol connecting models to reusable tool/data servers.', topicId: 'mcp-protocol', relatesTo: [{ id: 'tools', relation: 'standardizes' }, { id: 'langchain', relation: 'integrated by' }] },
        { id: 'langchain', label: 'LangChain / LangGraph', summary: 'Orchestrate multi-step agents and tool routing.', topicId: 'langchain-framework', relatesTo: [{ id: 'agents', relation: 'orchestrates' }] },
      ],
    },
    {
      id: 'safety-eval',
      name: 'Safety & Eval',
      concepts: [
        { id: 'safety', label: 'AI Safety', summary: 'Guardrails, moderation, and safe defaults for LLM apps.', topicId: 'ai-safety-basics', relatesTo: [{ id: 'injection', relation: 'defends' }, { id: 'eval', relation: 'verified by' }] },
        { id: 'injection', label: 'Prompt Injection', summary: 'Malicious input hijacking instructions; treat data as data.', topicId: 'prompt-injection', relatesTo: [{ id: 'safety', relation: 'threatens' }, { id: 'retrieval', relation: 'risk in' }] },
        { id: 'eval', label: 'LLM Evaluation', summary: 'Deterministic, LLM-as-judge, and human scoring of outputs.', topicId: 'llm-evaluation-intro', relatesTo: [{ id: 'judge', relation: 'includes' }, { id: 'evalframeworks', relation: 'run in' }] },
        { id: 'judge', label: 'Model-Based Evals', summary: 'A strong model grades outputs against a rubric at scale.', topicId: 'model-based-evals', relatesTo: [{ id: 'eval', relation: 'method of' }] },
        { id: 'evalframeworks', label: 'Eval Frameworks', summary: 'Tools & datasets to run regression evals in CI.', topicId: 'eval-frameworks', relatesTo: [{ id: 'eval', relation: 'operationalize' }, { id: 'obs', relation: 'feed' }] },
      ],
    },
    {
      id: 'production',
      name: 'Production',
      concepts: [
        { id: 'obs', label: 'LLM Observability', summary: 'Trace prompts, tokens, tool calls, and outputs in prod.', topicId: 'llm-observability', relatesTo: [{ id: 'cost', relation: 'monitors' }, { id: 'eval', relation: 'closes loop with' }] },
        { id: 'prodpatterns', label: 'Production Patterns', summary: 'Retries, fallbacks, guardrails, caching, model routing.', topicId: 'production-ai-patterns', relatesTo: [{ id: 'obs', relation: 'relies on' }, { id: 'caching', relation: 'uses' }] },
        { id: 'costmon', label: 'Cost & Latency Monitoring', summary: 'Track token spend and p95 latency to stay economical.', topicId: 'cost-latency-monitoring', relatesTo: [{ id: 'prodpatterns', relation: 'guides' }] },
      ],
    },
  ],
}
