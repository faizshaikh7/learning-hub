import type { CurriculumTopic, FlashcardData } from '@/types'

/**
 * Advanced production-AI topics promoted from being mentioned inside other
 * lessons to first-class, concept-first topics. Kept separate so they can be
 * woven into the correct learning sequence (orderIndex is auto-renumbered on
 * merge).
 */
export const AI_ADVANCED_TOPICS: CurriculumTopic[] = [
  {
    id: 'ai-gateway',
    phase: 7,
    phaseName: 'Production AI & Observability',
    orderIndex: 99,
    estimatedMins: 35,
    prerequisites: ['openrouter', 'production-ai-patterns', 'api-cost-optimization'],
    title: 'The AI Gateway Pattern',
    eli5: "Imagine every part of your app that wants to talk to an AI has to go through one front desk instead of each person walking straight up to OpenAI or Anthropic on their own. That front desk (the gateway) checks the request, picks which AI to use, retries if one is down, keeps the API keys locked in a drawer, counts the cost, and writes it all in a logbook. Your app code just says \"I need an answer\" and the front desk handles the rest.",
    analogy: "An AI gateway is like a hotel switchboard from the old days. Guests (your services) never dial the outside world directly — they call the switchboard, which knows every number, routes the call to whoever is available, keeps a log, blocks calls that aren't allowed, and bills the room. Swap the phone company (OpenAI to Anthropic) and the guests never notice, because they only ever dialed \"0\".",
    explanation: "An AI gateway is a single internal service that ALL of your app's LLM calls flow through, instead of every service calling OpenAI, Anthropic, or Google directly. It's the same idea as an API gateway, applied to model traffic.\n\nWhy centralize? Because the cross-cutting concerns of calling an LLM — keys, retries, fallback, cost tracking, rate limits, caching, logging, safety — are identical for every feature. If each service implements them itself, you get five slightly-different, half-broken versions and secrets sprinkled across the codebase. Put them in ONE place and every feature inherits them for free.\n\nWhat a gateway centralizes:\n\n1. Provider abstraction — your app speaks one API (usually the OpenAI-compatible schema); the gateway translates to whichever provider actually serves the request. Swap OpenAI for Anthropic or Google without touching application code.\n\n2. Routing + automatic fallback/failover — pick a model per request, and if a provider is down, rate-limited, or slow, transparently retry on a backup provider/model.\n\n3. Retries with backoff — transient 429s and 5xx errors are retried with exponential backoff, so callers don't each reinvent it.\n\n4. ONE place for API-key/secret management — provider keys live in the gateway, not in a dozen services. Rotating a key is a single change.\n\n5. Rate limiting and per-team / per-user budgets & quotas — cap spend and request rate centrally so one runaway loop can't burn the monthly budget.\n\n6. Response caching — identical or semantically-similar prompts return a cached answer instead of paying for the call again.\n\n7. Cost attribution & logging — tag every call with a team/user/feature and log tokens + dollars, so you can actually answer \"what does this feature cost?\".\n\n8. A hook point for observability and guardrails — the gateway is the natural chokepoint to attach tracing, metrics, and runtime input/output validation.\n\n9. Model allow-lists — restrict which models a given team or environment is allowed to call.\n\nReal tools: OpenRouter, Portkey, Cloudflare AI Gateway, LiteLLM, and Kong AI Gateway. A key distinction: OpenRouter-the-product is a HOSTED gateway (a public endpoint you route through), whereas LiteLLM or Portkey (self-hosted) or Kong let you BUILD/RUN your own gateway inside your own infrastructure. Both are the same pattern; the choice is buy-vs-build for the chokepoint.",
    technicalDeep: "Mechanically, a gateway sits behind one endpoint that mirrors a provider's schema — almost always the OpenAI Chat Completions shape, because it's the de-facto lingua franca. Your SDK points its baseURL at the gateway; the gateway parses the request, applies policy, and forwards to the real provider.\n\nRouting is config-driven: a request names a logical model (\"fast-cheap\", \"smart\") and the gateway maps it to a concrete provider+model, with an ordered fallback list. On a 429/5xx/timeout it walks the list. Fallback should preserve semantics — don't silently downgrade a JSON-mode call to a model that can't do structured output.\n\nCaching has two flavors: exact-match (hash the normalized request) and semantic (embed the prompt, return a cached hit within a similarity threshold). Semantic caching is powerful but dangerous for prompts where small wording changes must change the answer — scope it carefully.\n\nBudgets/quotas require identity on every call: an API key or header that maps to a team/user. The gateway increments a counter (usually in Redis) and rejects once a window's budget is exceeded. This is also where cost attribution comes from — you already have the identity + token counts, so you log dollars per tag.\n\nObservability: because 100% of traffic passes through, the gateway emits one consistent trace/metric schema (latency, tokens, cost, cache-hit, provider, fallback-count) regardless of which provider served the request — something you cannot get if services call providers directly.\n\nThe cost of the pattern: it's a new hop (adds a little latency and is a potential single point of failure — so it must be horizontally scaled and itself fault-tolerant), and a hosted gateway means your prompts transit a third party (a data-governance question).",
    whatBreaks: "Making the gateway a hard single point of failure — if it's a single instance and it goes down, EVERY AI feature goes down at once. It must be replicated and health-checked. Blind fallback that changes behavior — failing over from a model that supports tool-calling/JSON mode to one that doesn't produces silently malformed responses. Over-aggressive semantic caching returns a stale/nearby answer for a prompt that genuinely needed a fresh one. Forgetting to pass identity through means no per-user budgets and no cost attribution — you get one anonymous bill. And baking the gateway's own base URL/keys into clients insecurely just moves the secret-sprawl problem instead of solving it.",
    efficientWay: {
      title: 'Buy a hosted gateway vs build/run your own',
      approaches: [
        { name: 'Hosted gateway (OpenRouter, Cloudflare AI Gateway, Portkey cloud)', verdict: 'best', reason: 'Fastest path to fallback, caching, cost logging, and one key vault with zero infra to run — ideal for most teams until scale or data-governance forces self-hosting.' },
        { name: 'Self-hosted gateway (LiteLLM proxy, Portkey OSS, Kong AI Gateway)', verdict: 'ok', reason: 'Full control, prompts never leave your VPC, custom routing/guardrails — at the cost of running and scaling the service yourself.' },
        { name: 'No gateway — each service calls providers directly', verdict: 'weak', reason: 'Duplicated retry/fallback logic, scattered secrets, no unified cost view, and no single place to attach guardrails; only fine for a throwaway prototype.' },
      ],
      recommendation: "Start with a hosted gateway to get fallback, caching, budgets, and cost attribution on day one for near-zero effort. Move to self-hosted (LiteLLM or Portkey OSS) when data governance requires prompts stay in your VPC, when you need custom routing/guardrails, or when hosted per-request overhead stops making sense at your volume. Either way, route 100% of LLM traffic through the chokepoint — the value is in there being exactly one path.",
    },
    commonMistakes: [
      "Running the gateway as a single instance, turning it into a company-wide single point of failure for all AI features",
      "Configuring fallback across models with different capabilities (tool-calling, JSON mode, context length) so failover silently corrupts responses",
      "Enabling semantic caching everywhere, including on prompts where tiny wording changes must produce different answers",
      "Not threading a team/user/feature identity through each call, leaving you with no per-user budgets and one un-attributable bill",
    ],
    seniorNotes: "The AI gateway is the same architectural instinct as an API gateway or a service mesh: move cross-cutting concerns out of every service and into one governed chokepoint. The senior framing is that a gateway isn't primarily about swapping providers — it's about OWNING your model traffic: one place to enforce budgets, attribute cost, attach guardrails and tracing, rotate keys, and change providers as a config edit rather than a code migration. Buy it hosted until data governance or scale makes you build it. And treat the gateway itself as tier-0 infrastructure — it needs the same redundancy and SLOs as your load balancer, because everything now depends on it.",
    interviewQuestions: [
      "What is an AI gateway and what problem does it solve?",
      "How does an AI gateway provide provider fallback, and what can go wrong with naive fallback?",
      "How do you get per-feature cost attribution and per-user budgets out of a gateway?",
    ],
    interviewAnswers: [
      "An AI gateway is a single internal service that all of an app's LLM calls flow through instead of each service calling providers directly. It centralizes the cross-cutting concerns of LLM traffic — provider abstraction, routing and automatic fallback, retries with backoff, one key/secret vault, rate limits and budgets, response caching, cost attribution and logging, and a hook point for observability and guardrails — so every feature inherits them from one governed place rather than reimplementing them.",
      "The app calls a logical model; the gateway maps it to a concrete provider+model with an ordered fallback list, and on a 429/5xx/timeout it retries the next entry with backoff. The danger is failing over to a model with different capabilities — if the primary supported tool-calling or JSON mode and the backup doesn't, the response comes back silently malformed. Fallback lists must be capability-compatible, and semantics (structured output, context length) must be preserved across the whole list.",
      "Every request carries an identity header (team/user/feature key). The gateway already sees the token counts, so it multiplies tokens by the provider's price and logs dollars tagged with that identity — that's cost attribution. For budgets, it increments a per-identity counter in a store like Redis over a time window and rejects requests once the window's cap is exceeded. Because 100% of traffic passes through one place, both the accounting and the enforcement are consistent and complete.",
    ],
    codeExamples: [
      {
        lang: 'typescript',
        label: 'A thin AI gateway wrapper: provider abstraction + fallback + cost logging',
        code: "// Every service imports THIS, never the provider SDKs directly.\n// One logical call -> routing, fallback, retries, and cost attribution.\n\ntype Provider = { name: string; model: string; pricePer1M: { in: number; out: number } }\n\nconst ROUTES: Record<string, Provider[]> = {\n  // logical name -> ordered fallback list (primary first)\n  smart: [\n    { name: 'anthropic', model: 'claude-opus', pricePer1M: { in: 15, out: 75 } },\n    { name: 'openai', model: 'gpt-4o', pricePer1M: { in: 5, out: 15 } },\n  ],\n  cheap: [\n    { name: 'openai', model: 'gpt-4o-mini', pricePer1M: { in: 0.15, out: 0.6 } },\n  ],\n}\n\nasync function callProvider(p: Provider, prompt: string) {\n  // ...translate to the provider's schema and POST. Throws on 429/5xx.\n  return callRealApi(p.name, p.model, prompt) // -> { text, tokensIn, tokensOut }\n}\n\nfunction dollars(p: Provider, tIn: number, tOut: number) {\n  return (tIn * p.pricePer1M.in + tOut * p.pricePer1M.out) / 1_000_000\n}\n\nexport async function aiGateway(opts: {\n  route: keyof typeof ROUTES\n  prompt: string\n  userId: string   // identity -> budgets + cost attribution\n  feature: string\n}) {\n  const chain = ROUTES[opts.route]\n  let lastErr: unknown\n\n  for (const provider of chain) {           // automatic failover\n    for (let attempt = 0; attempt < 3; attempt++) {  // retries w/ backoff\n      try {\n        const r = await callProvider(provider, opts.prompt)\n        const cost = dollars(provider, r.tokensIn, r.tokensOut)\n        logUsage({ user: opts.userId, feature: opts.feature, provider: provider.name, cost }) // attribution\n        return r.text\n      } catch (err) {\n        lastErr = err\n        await new Promise(res => setTimeout(res, 250 * 2 ** attempt)) // backoff\n      }\n    }\n    // exhausted this provider -> fall through to the next in the chain\n  }\n  throw new Error('All providers failed: ' + String(lastErr))\n}",
      },
    ],
    resources: [
      { label: 'Cloudflare AI Gateway docs', url: 'https://developers.cloudflare.com/ai-gateway/', kind: 'docs' },
      { label: 'Portkey AI Gateway docs', url: 'https://portkey.ai/docs', kind: 'docs' },
      { label: 'LiteLLM docs (self-hosted proxy/gateway)', url: 'https://docs.litellm.ai/', kind: 'docs' },
    ],
  },
  {
    id: 'guardrails',
    phase: 6,
    phaseName: 'AI Safety & Evaluation',
    orderIndex: 99,
    estimatedMins: 35,
    prerequisites: ['ai-safety-basics', 'prompt-injection'],
    title: 'Guardrails: Runtime Input & Output Validation',
    eli5: "Guardrails are the bouncers on either side of the AI. One bouncer stands at the door and checks what goes IN (is this a sneaky trick prompt? does it leak someone's phone number?). Another bouncer stands at the exit and checks what comes OUT (is this valid, is it made-up, is it rude?). If something fails the check, the bouncer either fixes it, blocks it, or asks the AI to try again — all in real time, on every single request.",
    analogy: "Think of guardrails as the airport security and customs around the model. Security (input guardrails) screens passengers BEFORE they board — no weapons, no forbidden items, no fake IDs. Customs (output guardrails) inspects everything BEFORE it leaves the terminal — nothing contraband gets through. Evals, by contrast, are the aircraft's pre-season safety inspection done in the hangar: thorough, offline, and NOT happening on every flight. You need both, but they run at different times for different reasons.",
    explanation: "Guardrails are a runtime validation LAYER that wraps the model — they run live, on every request, before and/or after the model call. This is the crucial thing to internalize: guardrails are enforcement, not testing.\n\nINPUT guardrails run BEFORE the model sees the request:\n- PII detection/redaction — strip or mask emails, phone numbers, card numbers before they reach the model or your logs.\n- Topic / allow-list restriction — keep a support bot on-topic; reject requests for medical, legal, or off-domain advice.\n- Jailbreak / prompt-injection filters — catch \"ignore your instructions\" style attacks and injected instructions hidden in retrieved content.\n- Moderation — block hateful, sexual, or violent input up front.\n\nOUTPUT guardrails run AFTER the model responds, before the user sees it:\n- Schema / format validation — reject or REPAIR malformed JSON so downstream code doesn't crash.\n- Groundedness / hallucination checks — verify the answer is supported by the provided context and doesn't invent facts.\n- PII / toxicity / competitor-mention filters — stop the model from leaking data, being toxic, or recommending a competitor.\n- Safe refusal handling — when a check fails, return a graceful refusal rather than the raw unsafe output.\n\nWhen a guardrail trips, you make a retry-or-block decision: repair the output, re-prompt the model, fall back to a safe canned response, or block and refuse.\n\nThe distinction you must never blur: EVALS are offline quality testing (run in CI / during development against a dataset to measure whether the system is good). GUARDRAILS are live runtime enforcement on every production request (do we allow THIS specific input/output right now). Evals tell you if you should ship; guardrails protect you after you've shipped.\n\nFrameworks: Guardrails AI (Python, validators + repair), NVIDIA NeMo Guardrails (programmable rails via Colang), Meta Llama Guard (an LLM classifier for safe/unsafe content, both input and output), and the OpenAI moderation API (a hosted content classifier).",
    technicalDeep: "A guardrail is a validator function: input -> pass | fail(+reason) | fixed_value. You compose a pipeline: input guardrails run in sequence (some can short-circuit and block), the model is called, then output guardrails run on the response.\n\nGuardrails come in two implementation styles. Cheap/deterministic ones use regex, dictionaries, or small classifiers (PII regex, blocklists, JSON schema validation with a library like Pydantic/zod) — fast and near-free. Expensive/probabilistic ones use a model to judge (Llama Guard classifying safe/unsafe, an LLM-as-judge groundedness check, moderation endpoints) — more capable but they add a whole extra model call of latency and cost to every request. A common design is to run cheap deterministic checks first and only escalate to a model-based check when needed.\n\nFail-open vs fail-closed is the key policy decision. Fail-closed (block/refuse when a guardrail errors or trips) maximizes safety — right for medical, financial, or child-facing products. Fail-open (let the request through if the guardrail itself errors) maximizes availability — sometimes right for low-risk features where a guardrail outage shouldn't take down the product. You choose per guardrail based on the cost of a miss.\n\nOutput guardrails introduce a retry loop: on a schema failure you can ask the model to fix its own JSON (re-ask), on a groundedness failure you can re-prompt with stronger grounding instructions or fall back to \"I don't know\". Cap the retries — an unbounded repair loop is a latency and cost bomb.\n\nEvery guardrail adds latency and cost. Deterministic checks are microseconds; a Llama Guard or moderation call can double your per-request latency and add another billable model call. Budget for it: guardrails are not free safety, they're a latency/cost line item you accept in exchange for risk reduction.",
    whatBreaks: "Confusing guardrails with evals — teams run a great offline eval suite, ship, and then have NOTHING enforcing safety on live traffic (or vice versa: they add runtime checks but never measure quality). Fail-open by accident — when a guardrail service errors and the code lets everything through, your safety layer silently disappears exactly when you needed it. Only guarding the output — skipping input guardrails leaves you open to prompt injection and PII entering your logs. Unbounded repair loops — retrying malformed-JSON fixes forever spikes latency and cost. Guardrail latency tax ignored — stacking several model-based checks can add seconds and double the bill per request. And treating guardrails as a substitute for a well-designed prompt/system — they're a safety net, not the primary control.",
    efficientWay: {
      title: 'How to layer runtime guardrails',
      approaches: [
        { name: 'Cheap deterministic checks first, escalate to model-based only when needed', verdict: 'best', reason: 'Regex/schema/blocklist checks catch most cases for near-zero latency; you pay for a Llama Guard / moderation call only on the ambiguous requests, keeping cost and latency down.' },
        { name: 'A model-based guardrail (Llama Guard / LLM judge) on every request', verdict: 'ok', reason: 'Strong coverage and easy to reason about, but doubles per-request latency and cost — acceptable for high-risk, low-QPS flows.' },
        { name: 'Prompt the model to \"be safe\" and skip runtime validation', verdict: 'weak', reason: 'A system-prompt instruction is not enforcement — it is bypassable by injection and gives you no schema/PII/groundedness guarantees on the actual output.' },
      ],
      recommendation: "Wrap the model on BOTH sides. Put fast deterministic guardrails (PII redaction, allow-list, JSON schema validation) inline on every request, and reserve expensive model-based checks (Llama Guard, groundedness LLM-judge, moderation) for high-risk paths or as an escalation. Choose fail-open vs fail-closed per guardrail by the cost of a miss, cap any repair/retry loop, and — critically — keep your offline EVAL suite separate: evals decide if you ship, guardrails protect you once you have.",
    },
    commonMistakes: [
      "Treating evals and guardrails as the same thing — shipping with offline tests but no runtime enforcement, or runtime checks but no quality measurement",
      "Defaulting to fail-open, so the safety layer silently vanishes the moment the guardrail service errors",
      "Guarding only the output and skipping input guardrails, leaving prompt injection and PII-in-logs wide open",
      "Running an unbounded output-repair/retry loop, turning a malformed-JSON fix into a latency and cost blowup",
    ],
    seniorNotes: "The senior mental model: guardrails and evals are the two halves of AI quality, split by WHEN they run. Evals are offline, dataset-driven, and answer \"is this system good enough to ship?\"; guardrails are online, per-request, and answer \"is THIS input/output allowed right now?\". You need both and they are not interchangeable. Architecturally, treat guardrails as a middleware layer around the model call, not logic sprinkled into features — that gives you one place to add PII redaction, injection filters, schema validation, and groundedness checks. Be deliberate about the latency/cost budget (each model-based guardrail is another LLM call) and about fail-open vs fail-closed per check. And remember guardrails are a net, not the primary control: a good system prompt, grounding, and least-privilege tool access prevent problems; guardrails catch what slips through.",
    interviewQuestions: [
      "What are guardrails and how do input guardrails differ from output guardrails?",
      "What is the difference between guardrails and evals?",
      "Explain fail-open vs fail-closed for a guardrail and how you'd choose.",
    ],
    interviewAnswers: [
      "Guardrails are a runtime validation layer wrapping the model that runs on every request. Input guardrails run BEFORE the model — PII detection/redaction, topic/allow-list restriction, jailbreak and prompt-injection filters, and moderation — to control what the model is allowed to see. Output guardrails run AFTER the model — schema/format validation (reject or repair malformed JSON), groundedness/hallucination checks, PII/toxicity/competitor filters, and safe refusal handling — to control what the user is allowed to receive. When a check trips you decide to repair, retry, block, or refuse.",
      "Evals are OFFLINE quality testing: you run the system against a dataset in CI or during development to measure whether it's good, which tells you if you should ship. Guardrails are LIVE runtime enforcement on every production request: they decide whether this specific input or output is allowed right now. Same goal (a safe, high-quality system) but different time and purpose — evals gate the release, guardrails protect production. They are not substitutes; you need both.",
      "Fail-closed means if a guardrail trips OR the guardrail itself errors, you block/refuse the request — maximizing safety at the cost of availability. Fail-open means if the guardrail errors you let the request through — maximizing availability at the cost of a possible unsafe result. You choose per guardrail by the cost of a miss: fail-closed for high-stakes domains (medical, financial, child-facing) where a bad output is unacceptable; fail-open for low-risk features where a guardrail outage shouldn't take down the product.",
    ],
    codeExamples: [
      {
        lang: 'typescript',
        label: 'Wrapping a model call with input + output guardrails',
        code: "// Guardrails are a LAYER around the model, run live on every request.\n// Input guardrails gate what goes in; output guardrails gate what comes out.\n\ntype GuardResult = { ok: true; value: string } | { ok: false; reason: string }\n\n// --- INPUT guardrails (run BEFORE the model) ---\nfunction redactPII(input: string): GuardResult {\n  const cleaned = input\n    .replace(/[\\w.+-]+@[\\w-]+\\.[\\w.-]+/g, '[EMAIL]')\n    .replace(/\\b\\d{3}[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b/g, '[PHONE]')\n  return { ok: true, value: cleaned }\n}\nfunction blockInjection(input: string): GuardResult {\n  if (/ignore (all |your |previous )?(instructions|rules)/i.test(input))\n    return { ok: false, reason: 'prompt_injection_detected' }\n  return { ok: true, value: input }\n}\n\n// --- OUTPUT guardrails (run AFTER the model) ---\nfunction validateJson(output: string): GuardResult {\n  try { JSON.parse(output); return { ok: true, value: output } }\n  catch { return { ok: false, reason: 'malformed_json' } }\n}\nasync function checkGrounded(output: string, context: string): Promise<GuardResult> {\n  // model-based check (Llama Guard / LLM-as-judge) -> escalation only\n  const supported = await llmJudgeIsGrounded(output, context)\n  return supported ? { ok: true, value: output } : { ok: false, reason: 'ungrounded' }\n}\n\nconst FAIL_CLOSED = true // block on guardrail failure (safety > availability)\n\nexport async function guardedCall(userInput: string, context: string) {\n  // 1) INPUT guardrails\n  let prompt = userInput\n  for (const g of [redactPII, blockInjection]) {\n    const r = g(prompt)\n    if (!r.ok) return safeRefusal(r.reason)   // block\n    prompt = r.value                           // e.g. PII-redacted\n  }\n\n  // 2) MODEL call — with a bounded output-repair loop\n  for (let attempt = 0; attempt < 2; attempt++) {\n    const raw = await callModel(prompt, context)\n\n    // 3) OUTPUT guardrails\n    const schema = validateJson(raw)\n    if (!schema.ok) { prompt = repairPrompt(prompt, raw); continue } // retry\n\n    const grounded = await checkGrounded(raw, context)\n    if (!grounded.ok) return FAIL_CLOSED ? safeRefusal('ungrounded') : raw\n\n    return raw // passed every guardrail\n  }\n  return safeRefusal('could_not_produce_valid_output')\n}",
      },
    ],
    resources: [
      { label: 'Guardrails AI docs', url: 'https://www.guardrailsai.com/docs', kind: 'docs' },
      { label: 'NVIDIA NeMo Guardrails docs', url: 'https://docs.nvidia.com/nemo/guardrails/', kind: 'docs' },
      { label: 'Meta Llama Guard 3 model card', url: 'https://www.llama.com/docs/model-cards-and-prompt-formats/llama-guard-3/', kind: 'docs' },
      { label: 'OpenAI Moderation guide', url: 'https://platform.openai.com/docs/guides/moderation', kind: 'docs' },
    ],
  },
  {
    id: 'inference-economics',
    phase: 7,
    phaseName: 'Production AI & Observability',
    orderIndex: 99,
    estimatedMins: 35,
    prerequisites: ['api-cost-optimization', 'cost-latency-monitoring'],
    title: 'Inference Economics: Tokens, Cost & Margin',
    eli5: "Every time your app talks to an AI, it pays by the word — sort of. It pays for the words it sends in AND the words it gets back, and the words coming back usually cost a lot more. If you charge users a flat monthly fee but a few super-heavy users chat all day, you can end up paying the AI more for those users than they pay you. Inference economics is the math that keeps your AI feature from losing money.",
    analogy: "Running an AI feature is like running an all-you-can-eat buffet where YOUR cost is the food each guest eats (tokens) but you charge one flat price at the door (subscription). Most guests eat a normal plate and you profit. But a few \"whales\" camp out and eat all day — and on those guests you lose money on every visit. Inference economics is knowing your food cost per guest, your margin, and which levers (smaller portions, cheaper ingredients, a cap per guest) keep the buffet profitable.",
    explanation: "Inference economics is the unit economics of shipping AI: what a request actually costs you, and whether the feature makes money.\n\nToken pricing. LLM APIs bill per token, quoted per 1 million tokens, and — critically — INPUT tokens, OUTPUT tokens, and CACHED-INPUT tokens are priced differently. Output is usually the most expensive (often 3-5x input); cached input (a prompt prefix you've reused) is heavily discounted. So a request's cost is: (input_tokens x input_rate) + (output_tokens x output_rate) + (cached_tokens x cached_rate), all divided by 1,000,000.\n\nRolling that up. From cost-per-request you compute cost-per-user or cost-per-session (requests x cost each), then cost-per-feature (all users' usage). Map that token spend onto a P&L: it's the Cost of Goods Sold (COGS) for your AI feature.\n\nGross margin. Gross margin = (revenue - COGS) / revenue. For an AI feature, COGS is dominated by inference cost. If a user pays you $20/month and their inference costs $4, gross margin on that user is (20 - 4)/20 = 80%. Healthy.\n\nThe whale trap. Here's why flat-fee AI products are dangerous: a subscription charges every user the same, but usage is wildly unequal. A power user who hammers the feature can rack up inference costs that EXCEED their subscription price — that user has NEGATIVE gross margin. A small tail of whales can quietly erase the profit from thousands of light users. This is the single most important risk in AI product pricing.\n\nThe levers that protect margin:\n- Cheaper/smaller models — use a mini model where quality allows; often 10-30x cheaper.\n- Prompt caching — reuse a cached system prompt/context for the discounted cached-input rate.\n- Routing / cascading — send easy requests to a cheap model, escalate only the hard ones to the expensive model.\n- Token budgets / caps per user — cap tokens or requests per user/period so a whale can't run unbounded.\n- Batching — batch APIs (where latency permits) are often ~50% cheaper.\n- Shorter context — trim retrieved chunks and history; you pay for every input token every call.",
    technicalDeep: "The core identity: cost_per_request = (tok_in * rate_in + tok_out * rate_out + tok_cached * rate_cached) / 1e6. Because output is the priciest term, verbose responses hurt margin more than long prompts — capping max_output_tokens is a direct margin lever.\n\nScale it: monthly_cost = cost_per_request * requests_per_user * active_users. Put that beside revenue = price * paying_users to get margin. The trap is reasoning about AVERAGES — average cost per user can look fine while the distribution has a long, expensive tail. You must model the DISTRIBUTION: plot cost per user, find the users whose cost > their revenue, and size that tail. Median margin and mean margin can diverge sharply.\n\nCaching mechanics matter to the math: providers discount the cached-input rate steeply (often ~90% off) for a reused prompt prefix, but the FIRST call that writes the cache can cost slightly more. Caching pays off when the same prefix (system prompt, few-shot examples, a document) is reused across many calls — exactly the RAG/agent pattern. Model that as a blended input rate.\n\nCascading/routing changes the expected cost: E[cost] = p_cheap_resolves * cost_cheap + p_escalates * (cost_cheap + cost_expensive). If a cheap model resolves 80% of traffic, your blended cost collapses toward the cheap model's price even though you kept the expensive model for the hard 20%. The risk is the escalated requests pay BOTH bills, so cascading only wins when the cheap model resolves a high fraction.\n\nPer-user token budgets turn an unbounded liability into a bounded one: cap tokens/requests per user per period (enforced at the gateway). This directly defuses the whale trap by putting a ceiling on any single user's COGS — at the cost of possibly throttling your most engaged users, which is a product decision.",
    whatBreaks: "Reasoning from averages hides the whale trap — mean cost per user looks sustainable while a small tail of power users has negative margin and eats the profit. Ignoring the input/output/cached split — costing a request as if all tokens are equal understates it, since output is several times pricier. Forgetting input tokens are paid EVERY call — long system prompts, big RAG contexts, and full chat histories re-bill on every single request, so context bloat compounds. Flat-fee pricing with no per-user cap — an unbounded subscription is an unbounded liability the moment one user automates against it. Assuming a bigger model is 'worth it' without doing the margin math — the quality delta is often tiny while the cost is 10-30x. And celebrating a cache hit rate without modeling the write cost or the reuse fraction.",
    efficientWay: {
      title: 'Protecting gross margin on an AI feature',
      approaches: [
        { name: 'Routing/cascading + prompt caching + smaller models', verdict: 'best', reason: 'Attacks the biggest cost terms directly: a cheap model resolves most traffic, caching slashes repeated input cost, and a mini model handles the easy majority — often cutting COGS by an order of magnitude with little quality loss.' },
        { name: 'Per-user token/request caps (with usage-based overage pricing)', verdict: 'ok', reason: 'Bounds the whale liability and aligns price with cost, but caps can frustrate power users and usage-based pricing adds product/billing complexity — a policy lever, not a pure efficiency one.' },
        { name: 'Just use the biggest model everywhere and eat the cost', verdict: 'weak', reason: 'Simplest to build and maximizes quality, but gives you the worst margin and the highest whale-trap exposure — fine for a demo, dangerous at scale.' },
      ],
      recommendation: "First measure: instrument cost per request and plot cost PER USER to find the negative-margin tail — you can't manage what you don't attribute. Then pull the cost levers in order of leverage: cascade cheap-model-first and only escalate hard requests, cache reused prompt prefixes, trim context and cap output tokens, and pick the smallest model that passes your evals. Finally, protect the tail with per-user token budgets and consider usage-based (or hybrid) pricing so your revenue scales with your COGS instead of decoupling from it.",
    },
    commonMistakes: [
      "Reasoning about cost per user from the average instead of the distribution, so the negative-margin whale tail stays invisible until the bill arrives",
      "Costing requests as if input, output, and cached tokens are priced the same — output is typically several times more expensive",
      "Forgetting that every input token (system prompt, RAG context, chat history) is re-billed on every call, so context bloat multiplies cost",
      "Shipping a flat-fee subscription with no per-user token/request cap, turning one automating power user into an unbounded loss",
    ],
    seniorNotes: "Inference cost is COGS, and COGS is a product decision, not just an engineering one. The senior move is to treat margin as a first-class metric alongside latency and quality: instrument cost per request, attribute it per user/feature (this is a prime reason to route everything through an AI gateway), and watch the DISTRIBUTION, not the average — the whale trap lives in the tail. Understand that a flat subscription over a variable-cost backend is a structural mismatch; either cap usage, meter it, or price in the tail. And every quality-vs-cost choice — model size, context length, cascading, caching, max output tokens — is ultimately a margin lever, so the strongest AI engineers can quantify the dollar impact of each, not just the quality impact.",
    interviewQuestions: [
      "Walk me through computing the cost of a single LLM request and rolling it up to a monthly bill.",
      "How do you compute gross margin on an AI feature, and what is the 'whale trap'?",
      "What levers protect the margin on an AI product, and which would you pull first?",
    ],
    interviewAnswers: [
      "A request's cost is (input_tokens x input_rate + output_tokens x output_rate + cached_tokens x cached_rate) / 1,000,000, where rates are quoted per million tokens and output is usually several times pricier than input while cached input is discounted. Roll it up by multiplying cost-per-request by requests-per-user to get cost-per-user, then sum across active users for cost-per-feature: monthly_cost = cost_per_request x requests_per_user x active_users. That total is the COGS you put on the P&L for the feature.",
      "Gross margin = (revenue - COGS) / revenue, and for an AI feature COGS is dominated by inference cost — so if a user pays $20 and costs $4 in tokens, margin is (20-4)/20 = 80%. The whale trap is that a flat subscription charges everyone the same while usage is wildly unequal: a power user's inference cost can exceed their subscription price, giving them NEGATIVE margin, and a small tail of these whales can erase the profit from thousands of light users. It hides if you only look at the average — you have to model the per-user distribution.",
      "The levers are: use a smaller/cheaper model where quality allows (often 10-30x cheaper), prompt caching for reused prefixes, routing/cascading (cheap model first, escalate only hard requests), per-user token budgets/caps, batching where latency permits (~50% off), and shorter context. I'd pull them in leverage order: first cascade and cache because they cut the dominant cost terms with little quality loss, then trim context and cap output tokens, then pick the smallest model that passes evals — and put a per-user token cap in place to bound the whale tail regardless.",
    ],
    codeExamples: [
      {
        lang: 'typescript',
        label: 'Cost-per-request -> monthly cost -> gross margin, with the whale trap',
        code: "// Rates are dollars per 1,000,000 tokens (example numbers).\ntype Rates = { in: number; out: number; cached: number }\nconst GPT4O: Rates = { in: 5, out: 15, cached: 2.5 }\nconst MINI: Rates = { in: 0.15, out: 0.6, cached: 0.075 }\n\nfunction costPerRequest(r: Rates, tokIn: number, tokOut: number, tokCached = 0) {\n  return (tokIn * r.in + tokOut * r.out + tokCached * r.cached) / 1_000_000\n}\n\n// One request: 3k input, 700 output on GPT-4o\nconst perReq = costPerRequest(GPT4O, 3000, 700) // = (3000*5 + 700*15)/1e6 = $0.0255\n\n// Roll up to a user, then a feature\nfunction monthlyUserCost(perReqCost: number, reqsPerDay: number) {\n  return perReqCost * reqsPerDay * 30\n}\n\n// Gross margin for one user\nfunction grossMargin(monthlyRevenue: number, monthlyCost: number) {\n  return (monthlyRevenue - monthlyCost) / monthlyRevenue // fraction\n}\n\nconst PRICE = 20 // flat $20/mo subscription\n\n// Typical user: 10 requests/day\nconst typical = monthlyUserCost(perReq, 10)          // ~$7.65/mo COGS\nconsole.log(grossMargin(PRICE, typical))             // ~0.62  -> healthy 62%\n\n// WHALE: 400 requests/day -> the trap\nconst whale = monthlyUserCost(perReq, 400)           // ~$306/mo COGS\nconsole.log(grossMargin(PRICE, whale))               // ~ -14.3  -> NEGATIVE margin!\n// This one user loses ~$286/mo. A handful of whales erase thousands of light users' profit.\n\n// LEVER: cascade to MINI for the easy 80%, keep GPT-4o for the hard 20%\nfunction blendedPerReq(pCheapResolves: number) {\n  const cheap = costPerRequest(MINI, 3000, 700)                   // ~$0.00087\n  const escalated = cheap + costPerRequest(GPT4O, 3000, 700)      // pays both bills\n  return pCheapResolves * cheap + (1 - pCheapResolves) * escalated\n}\nconst blended = blendedPerReq(0.8)                   // ~ $0.0060/req vs $0.0255\nconsole.log(grossMargin(PRICE, monthlyUserCost(blended, 400)))   // whale now ~+64% margin",
      },
    ],
    resources: [
      { label: 'Anthropic pricing', url: 'https://www.anthropic.com/pricing', kind: 'docs' },
      { label: 'OpenAI API pricing', url: 'https://openai.com/api/pricing/', kind: 'docs' },
      { label: 'OpenRouter docs (models & pricing)', url: 'https://openrouter.ai/docs', kind: 'docs' },
    ],
  },
]

/**
 * Spaced-repetition flashcard decks for the advanced production-AI topics,
 * keyed by topic id. Each deck has 4-5 cards.
 */
export const AI_ADVANCED_FLASHCARDS: FlashcardData = {
  'ai-gateway': [
    {
      id: 'aigw_1',
      q: "What is an AI gateway?",
      a: "A single internal service that ALL of your app's LLM calls flow through instead of each service calling providers directly. It centralizes provider abstraction, routing/fallback, retries, key management, budgets, caching, cost attribution, and a hook point for observability and guardrails.",
      hint: "Think API gateway, but for model traffic.",
    },
    {
      id: 'aigw_2',
      q: "Name four cross-cutting concerns an AI gateway centralizes.",
      a: "Any four of: provider abstraction (swap providers without app changes), routing + automatic fallback/failover, retries with backoff, one place for API-key/secret management, rate limiting and per-user/team budgets, response caching, cost attribution & logging, observability/guardrail hook, model allow-lists.",
      hint: "Keys, fallback, budgets, caching, logging...",
    },
    {
      id: 'aigw_3',
      q: "What's the difference between OpenRouter and LiteLLM as gateways?",
      a: "OpenRouter is a HOSTED gateway (a public endpoint you route through — buy). LiteLLM (like Portkey OSS or Kong AI Gateway) lets you BUILD/RUN your own gateway inside your infrastructure — build. Same pattern, buy-vs-build for the chokepoint.",
      hint: "Buy vs build.",
    },
    {
      id: 'aigw_4',
      q: "What can go wrong with naive provider fallback?",
      a: "Failing over to a model with different capabilities — if the primary supported tool-calling or JSON mode and the backup doesn't, responses come back silently malformed. Fallback lists must be capability-compatible.",
      hint: "Not all models support the same features.",
    },
    {
      id: 'aigw_5',
      q: "Why must the gateway itself be treated as tier-0 infrastructure?",
      a: "Because 100% of AI traffic passes through it, a single instance is a company-wide single point of failure — if it goes down, every AI feature goes down at once. It needs redundancy, health checks, and SLOs like a load balancer.",
      hint: "One chokepoint = one failure point.",
    },
  ],
  'guardrails': [
    {
      id: 'grd_1',
      q: "What are guardrails in an AI system?",
      a: "A runtime validation LAYER that wraps the model and runs live on every request — before the model (input guardrails) and/or after it (output guardrails) — to enforce safety, format, and policy. Enforcement, not testing.",
      hint: "A live bouncer on each side of the model.",
    },
    {
      id: 'grd_2',
      q: "Guardrails vs evals?",
      a: "Evals = OFFLINE quality testing against a dataset (in CI/dev) that decides if you should ship. Guardrails = LIVE runtime enforcement on every production request that decides if THIS specific input/output is allowed right now. You need both; they run at different times for different purposes.",
      hint: "When do they run: offline vs on every request?",
    },
    {
      id: 'grd_3',
      q: "Give two input guardrails and two output guardrails.",
      a: "Input (before the model): PII detection/redaction, topic/allow-list restriction, jailbreak/prompt-injection filters, moderation. Output (after the model): schema/JSON validation (reject or repair), groundedness/hallucination checks, PII/toxicity/competitor filters, safe refusal handling.",
      hint: "Input gates what goes in; output gates what comes out.",
    },
    {
      id: 'grd_4',
      q: "Fail-open vs fail-closed for a guardrail?",
      a: "Fail-closed: if the guardrail trips OR errors, block/refuse — maximizes safety (use for medical, financial, child-facing). Fail-open: if the guardrail errors, let the request through — maximizes availability (use for low-risk features). Choose per guardrail by the cost of a miss.",
      hint: "Safety vs availability when the check itself fails.",
    },
    {
      id: 'grd_5',
      q: "Name two guardrail frameworks/tools.",
      a: "Any two of: Guardrails AI (validators + repair), NVIDIA NeMo Guardrails (programmable rails), Meta Llama Guard (LLM safe/unsafe classifier for input and output), and the OpenAI moderation API (hosted content classifier).",
      hint: "Guardrails AI, NeMo, Llama Guard, OpenAI moderation.",
    },
  ],
  'inference-economics': [
    {
      id: 'ecoi_1',
      q: "How do you compute the cost of a single LLM request?",
      a: "cost = (input_tokens x input_rate + output_tokens x output_rate + cached_tokens x cached_rate) / 1,000,000. Rates are quoted per million tokens; output is usually several times pricier than input, and cached input is discounted.",
      hint: "Input, output, and cached tokens are priced differently.",
    },
    {
      id: 'ecoi_2',
      q: "How do you compute gross margin on an AI feature?",
      a: "Gross margin = (revenue - COGS) / revenue, where COGS is dominated by inference (token) cost. E.g. a user paying $20 who costs $4 in tokens has margin (20-4)/20 = 80%.",
      hint: "Revenue minus token COGS, over revenue.",
    },
    {
      id: 'ecoi_3',
      q: "What is the 'whale trap'?",
      a: "A flat-fee/subscription charges every user the same, but usage is wildly unequal — a power user's inference cost can EXCEED their subscription price, giving negative gross margin. A small tail of whales can erase the profit from thousands of light users. It hides if you only look at the average.",
      hint: "Flat fee + a few very heavy users.",
    },
    {
      id: 'ecoi_4',
      q: "Which levers protect margin on an AI product?",
      a: "Cheaper/smaller models, prompt caching (discounted cached-input rate), routing/cascading (cheap model first, escalate hard requests), per-user token budgets/caps, batching (~50% off where latency permits), and shorter context.",
      hint: "Smaller model, cache, cascade, cap, batch, trim context.",
    },
    {
      id: 'ecoi_5',
      q: "Why does context bloat multiply cost, and why is output the priciest term?",
      a: "Every input token (system prompt, RAG context, chat history) is re-billed on EVERY call, so long context compounds across requests. Output tokens are typically 3-5x the input rate, so verbose responses hurt margin more than long prompts — capping max_output_tokens is a direct lever.",
      hint: "Input is paid every call; output rate is higher.",
    },
  ],
}
