import type { CurriculumTopic } from '@/types'

/**
 * Newly-added, current (2025-2026) AI topics kept separate from the base
 * curriculum so they can be woven into the correct learning sequence.
 */
export const AI_NEW_TOPICS: CurriculumTopic[] = [
  {
    id: 'beyond-rag',
    phase: 4,
    phaseName: 'RAG Systems',
    orderIndex: 99,
    estimatedMins: 35,
    prerequisites: ['rag-fundamentals', 'advanced-rag'],
    title: 'Beyond RAG: CAG, RIG & Managed Retrieval',
    eli5: "Classic RAG is like sending a librarian to fetch a few pages every time you ask a question. But now some models have huge memories, so instead you can hand them the WHOLE book once and just ask away (that's CAG). Google built another trick where the model, while answering, pauses to look up exact numbers from a trusted stats database and swaps out its guesses (that's RIG). And some tools now do all the fetching for you behind one button (managed retrieval).",
    analogy: "RAG = a research assistant who runs to the archive for each question. CAG = you photocopied the entire archive into the assistant's desk drawer, so no running needed. RIG = the assistant writes the essay but, whenever they state a statistic, they phone the official records office mid-sentence to replace their estimate with the verified figure. Managed retrieval (like Google File Search) = you drop your files in a box and a service files, indexes, and cites them automatically.",
    explanation: "\"Google replaced RAG\" is a headline, not the full story — RAG isn't dead, but the retrieval landscape has genuinely evolved. Here are the approaches now competing with and complementing classic retrieve-then-generate:\n\n1. CAG (Cache-Augmented Generation): instead of retrieving chunks at query time, you preload the entire knowledge source into the model's context window once, and reuse the model's KV cache across queries. Modern long-context models (e.g. Gemini's 1M–2M token windows) make this viable for small-to-medium corpora. No retriever, no vector DB, lower per-query latency once warm.\n\n2. RIG (Retrieval Interleaved Generation) — Google's approach: the model is fine-tuned to emit natural-language data queries (function-call style, e.g. `DC(\"population of India 2020\")`) DURING generation, which fetch ground-truth values from Google's Data Commons (a unified knowledge graph of public statistics from sources like the UN, CDC, and census bureaus). The model's guessed numbers get replaced with verified ones inline. RAG retrieves context UP FRONT; RIG interleaves retrieval WHILE generating.\n\n3. Managed retrieval (e.g. Google File Search in the Gemini API): a hosted service that ingests your files, chunks + embeds + indexes them automatically, and exposes a searchable, citation-aware corpus to your prompts — collapsing the whole DIY RAG pipeline into one managed capability.\n\n4. KAG (Knowledge-Augmented Generation): couples a knowledge graph with the LLM so it can reason over structured relationships (similar in spirit to GraphRAG) — stronger for multi-hop, logical questions than pure vector similarity.",
    technicalDeep: "CAG mechanics: load documents into the prompt, run one forward pass to build the KV cache, then answer many questions reusing that cache (prompt caching makes repeated queries cheap). Bounded by context length and the cost of very long prompts; there's no retrieval step to get wrong, but also no way to exceed the window. Best when the corpus is stable and fits (e.g. a product manual, a policy set).\n\nRIG mechanics: fine-tune the model to interleave `DC(question)`-style calls; each call resolves against Data Commons and substitutes a verified statistic for the model's estimate. This specifically targets numerical/statistical hallucination — the class of error long-context and vanilla RAG still get wrong when the right number simply isn't in the retrieved text. Tradeoff: it's scoped to what Data Commons covers, and requires the tuned model.\n\nManaged retrieval mechanics: you lose fine-grained control of chunking/embedding/reranking but gain speed-to-ship and built-in citations; good default for teams that don't want to run a vector DB.\n\nThe long-context debate: bigger windows reduce — but don't eliminate — the need for retrieval. For huge (billions of tokens), frequently-changing, or access-controlled corpora, retrieval still wins on cost, freshness, and security. In practice, production systems increasingly COMBINE these: retrieve a candidate set, stuff a large context (RAG+long-context), and let an agent call tools/APIs for exact facts (agentic RAG / RIG-style grounding).",
    whatBreaks: "Assuming CAG scales to any corpus: it's capped by the context window and gets expensive as prompts grow — it doesn't replace RAG for large or dynamic data. Assuming long context kills retrieval: for private, huge, or fast-changing knowledge, retrieval is still cheaper, fresher, and enforces access control. Using RIG for non-statistical grounding: RIG shines for numbers/stats in Data Commons — it's not a general document-QA replacement. Trusting managed retrieval blindly: you inherit its chunking/citation choices; verify recall and citation quality for YOUR data.",
    efficientWay: {
      title: 'Picking a grounding strategy',
      approaches: [
        { name: 'RAG (retrieve-then-generate)', verdict: 'best', reason: 'Default for large, dynamic, or access-controlled corpora needing citations and cost control. Still the workhorse.' },
        { name: 'CAG (preload + KV cache)', verdict: 'ok', reason: 'Great when the whole corpus is small, stable, and fits the context window — simplest pipeline, lowest latency.' },
        { name: 'RIG / tool-grounded facts', verdict: 'ok', reason: 'Best for verified numeric/statistical grounding; pair it with RAG rather than treating it as a full replacement.' },
        { name: 'Managed retrieval (File Search etc.)', verdict: 'ok', reason: 'Fastest path to a working, cited RAG when you don\'t want to run retrieval infra — at the cost of control.' },
      ],
      recommendation: "Match the tool to the corpus: small + stable → CAG; large/dynamic/private → RAG; numbers-must-be-exact → add RIG/tool grounding; ship-fast, don't-run-infra → managed retrieval. The strongest production systems blend them — retrieve, fill a long context, and call tools for exact facts — rather than betting on one.",
    },
    commonMistakes: [
      "Declaring 'RAG is dead' — the alternatives complement it for specific corpus shapes, they don't universally replace it",
      "Using CAG for a corpus that doesn't fit (or barely fits) the context window, blowing up cost and latency",
      "Expecting RIG to answer general document questions — it's built for verified statistics via Data Commons",
      "Adopting managed retrieval without checking recall/citation quality on your own data",
    ],
    seniorNotes: "The real 2025-2026 shift isn't 'X replaced RAG' — it's that grounding became a portfolio decision driven by corpus size, volatility, and the cost of being wrong. Long-context models made CAG viable and shrank naive RAG's advantage for small corpora; RIG/tool-use pushed factual grounding INTO the generation loop for exact values; managed services commoditized DIY pipelines. As an architect, decide per-use-case and instrument it: measure faithfulness/citation accuracy, freshness (staleness window), cost per answer, and latency — then let those numbers pick the strategy, and expect to combine several.",
    interviewQuestions: [
      "What is Cache-Augmented Generation and when does it beat RAG?",
      "How does Google's RIG differ from RAG in when and how it retrieves?",
      "Does a 2M-token context window make RAG obsolete? Argue both sides.",
      "What problem does RIG specifically target that vanilla RAG often gets wrong?",
      "When would you choose managed retrieval (e.g. Gemini File Search) over building your own RAG pipeline?",
    ],
    interviewAnswers: [
      "CAG preloads the whole knowledge source into the context window and reuses the KV cache instead of retrieving per query; it beats RAG when the corpus is small, stable, and fits the window — you get a simpler pipeline and lower per-query latency with no retriever to tune.",
      "RAG retrieves relevant context up front and prepends it before generation; RIG fine-tunes the model to emit data queries (function-call style) DURING generation that fetch verified values from Data Commons and replace the model's estimates inline.",
      "It doesn't: for large, frequently-changing, or access-controlled corpora, retrieval is cheaper, fresher, and enforces permissions, and huge prompts are costly and can dilute attention; but for small stable corpora, long context (CAG) is simpler and often better — so it's a per-corpus decision.",
      "Numerical/statistical accuracy — RIG replaces the model's guessed numbers with ground-truth values from Data Commons, addressing the case where the correct figure simply isn't present in retrieved text.",
      "When you want a working, citation-aware RAG quickly without operating a vector database and are comfortable delegating chunking/embedding/indexing choices to the provider — trading fine-grained control for speed-to-ship.",
    ],
    codeExamples: [
      {
        lang: 'python',
        label: 'CAG: preload the whole corpus, reuse via prompt caching',
        code: "# Cache-Augmented Generation: no retriever — the corpus lives in context.\n# Works when the corpus fits a long-context model (e.g. Gemini 1M-2M tokens).\nKNOWLEDGE = open('company_handbook.md').read()   # small, stable corpus\n\nsystem = f\"Answer ONLY from this handbook.\\n<handbook>\\n{KNOWLEDGE}\\n</handbook>\"\n\n# The handbook is sent once and cached; each question reuses the KV cache,\n# so repeated queries are fast and cheap (no vector DB, no retrieval step).\ndef ask(question: str) -> str:\n    return llm.generate(system=system, user=question, cache='handbook-v1')\n\nask('How many vacation days do new hires get?')\nask('What is the expense-approval limit for an L4?')",
      },
      {
        lang: 'text',
        label: 'RIG: retrieval interleaved DURING generation',
        code: "User: \"Compare the population growth of India and China since 2000.\"\n\nModel (drafts, but interleaves verified lookups instead of guessing):\n  \"India's population grew from DC(\"population India 2000\")\n   to DC(\"population India 2020\"), while China went from\n   DC(\"population China 2000\") to DC(\"population China 2020\")...\"\n\n# Each DC(...) call resolves against Google's Data Commons knowledge graph\n# and the verified number is substituted inline — so the final answer's\n# statistics are grounded, not hallucinated.\n#\n# RAG:  retrieve context  -> then generate.\n# RIG:  generate + call for exact facts  -> interleaved.",
      },
    ],
  },
]
