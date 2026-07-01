import type { CurriculumTopic } from '@/types'

/**
 * Advanced senior/CTO-level AI Engineering topics that extend the core
 * AI_CURRICULUM. Kept in a separate file so the base curriculum stays stable.
 */
export const AI_EXTRA_TOPICS: CurriculumTopic[] = [
  {
    "id": "fine-tuning-lora",
    "phase": 2,
    "phaseName": "AI APIs & Platforms",
    "orderIndex": 99,
    "estimatedMins": 55,
    "prerequisites": [
      "llm-fundamentals",
      "llm-terminology"
    ],
    "title": "Fine-Tuning: SFT, LoRA & QLoRA",
    "eli5": "Imagine you hired a brilliant generalist who has read the whole internet. Fine-tuning is like giving them a week of training on YOUR company's specific way of doing things — so they stop sounding generic and start sounding exactly like your team. You are not re-teaching them language; you are nudging their habits.",
    "analogy": "A base model is a concert pianist who can play anything. Full fine-tuning is retraining every muscle in their hands — slow, expensive, and risky (they might forget other pieces). LoRA is handing them a small cheat-sheet of sticky notes taped to the sheet music: tiny, cheap, removable, and it steers their playing without touching the muscle memory underneath.",
    "explanation": "Fine-tuning adapts a pretrained model's weights on your own labeled examples so it learns a behaviour, format, or style that prompting alone cannot reliably produce. The first decision is whether you should fine-tune at all. In 2025 the honest default order is: prompt engineering first, then RAG for knowledge, and only then fine-tuning for behaviour. Prompting and RAG are cheap, instantly editable, and require no ML infrastructure. Fine-tuning shines when you need a consistent output style/format, want to compress a huge system prompt into the weights (lower latency and cost per call), need to teach a narrow skill (classification, extraction, tool-call formatting, a domain tone), or want a small cheap model to match a big model on ONE task. Fine-tuning does NOT reliably teach new facts — that is what RAG is for. A fine-tuned model can still hallucinate facts it was fine-tuned on; it learns the shape of answers, not a reliable knowledge store.",
    "technicalDeep": "Supervised Fine-Tuning (SFT) trains on (prompt, ideal-completion) pairs using the same next-token cross-entropy loss as pretraining, but only on your curated data — typically with the loss masked so it is computed on the assistant/completion tokens, not the prompt tokens. Full fine-tuning updates all N billion parameters: it needs optimizer state (Adam keeps 2 momentum tensors) plus gradients plus weights, so for a 7B model in mixed precision you need roughly 16 bytes/param → ~112GB of GPU memory, out of reach for a single consumer GPU. Parameter-Efficient Fine-Tuning (PEFT) freezes the base weights and trains a tiny number of new parameters. LoRA (Low-Rank Adaptation) is the dominant PEFT method: for a weight matrix W (d×k), instead of learning a full delta ΔW, it learns two small matrices B (d×r) and A (r×k) with rank r ≪ d, so the update is W + (α/r)·B·A. You train only A and B — often <1% of parameters. r (rank, commonly 8–64), alpha (scaling, often 2×r), dropout, and which modules to target (q_proj, k_proj, v_proj, o_proj, and often the MLP gate/up/down projections) are the key hyperparameters. QLoRA goes further: it loads the frozen base model in 4-bit (NF4, a normal-float quantization) using bitsandbytes, keeps LoRA adapters in bf16, and uses double-quantization plus paged optimizers to fit a 7B–13B fine-tune on a single 24GB consumer GPU (e.g. a 4090) with minimal quality loss versus 16-bit LoRA. Adapters are tiny (tens of MB) and can be merged into the base (merge_and_unload) for zero inference overhead, or served separately and hot-swapped (multi-LoRA serving in vLLM/TGI lets one base model serve many tenants' adapters).",
    "whatBreaks": "Catastrophic forgetting: fine-tuning too hard or too long on a narrow dataset degrades the model's general abilities — it gets great at your task and worse at everything else, including instruction-following. Overfitting on a tiny dataset (a few hundred noisy examples) memorizes quirks and produces brittle, repetitive outputs. Data quality dominates: 500 clean, consistent, on-distribution examples beat 50,000 scraped inconsistent ones — garbage labels teach garbage behaviour, and the model faithfully learns your annotators' mistakes. Format drift: if your training format (chat template, special tokens, system prompt) does not exactly match how you call the model at inference, quality collapses. Teaching facts via SFT instead of RAG produces a confident model that still hallucinates and is now expensive to update (a fact change means retraining). And crucially: shipping a fine-tune with no eval harness — you literally cannot tell if you improved anything or quietly regressed.",
    "efficientWay": {
      "title": "Choosing a fine-tuning approach",
      "approaches": [
        {
          "name": "QLoRA on an open model (Unsloth / Axolotl / TRL)",
          "verdict": "best",
          "reason": "4-bit base + LoRA adapters trains a 7B–13B model on a single 24GB GPU cheaply, keeps ~full-quality results, produces a tiny portable adapter, and you fully own the weights. Unsloth roughly 2x speed and lower memory; Axolotl/TRL give production-grade config and multi-GPU scaling."
        },
        {
          "name": "OpenAI / managed fine-tuning API",
          "verdict": "ok",
          "reason": "Zero infra — upload a JSONL of chat examples and get a hosted fine-tuned endpoint. Great for teams without GPUs, but you cannot export weights, you pay a per-token premium at inference, and you are locked to the provider and its base-model deprecations."
        },
        {
          "name": "Full fine-tuning of all weights",
          "verdict": "weak",
          "reason": "For the vast majority of application tasks it is wasteful: 10–100x the compute and memory of LoRA, far higher catastrophic-forgetting risk, and negligible quality gain over LoRA/QLoRA. Justified only for deep domain adaptation or continued-pretraining scale efforts."
        }
      ],
      "recommendation": "Exhaust prompting + RAG first. When you genuinely need a behaviour baked in, start with QLoRA on the smallest open model that could plausibly work, using 500–5,000 hand-checked examples in the model's exact chat template. Build the eval set BEFORE training. Only reach for full fine-tuning or a managed API if QLoRA provably falls short or you have no GPUs."
    },
    "commonMistakes": [
      "Fine-tuning to add knowledge (facts, docs, product catalog) — use RAG; SFT teaches format and behaviour, not a reliable fact store.",
      "Skipping the eval harness: no held-out test set means you cannot prove the fine-tune helped or detect regressions on general ability.",
      "Training on a dirty, inconsistent dataset — the model faithfully learns your labeling errors and stylistic contradictions.",
      "Mismatched chat template / special tokens between training and inference, which silently tanks quality.",
      "Cranking rank and epochs 'to be safe' — that drives overfitting and catastrophic forgetting; start small (r=8–16, 1–3 epochs).",
      "Not comparing against the honest baseline: a well-prompted bigger model may beat your fine-tuned small one at similar total cost."
    ],
    "seniorNotes": "The senior instinct is to treat fine-tuning as a cost/latency optimization, not a capability unlock. The usual play: prove the behaviour works with a big model + rich prompt + few-shot, capture those production traces as a distilled dataset, then fine-tune a small cheap model to reproduce it — collapsing a 2,000-token system prompt into the weights so every call is shorter, faster, and cheaper. Always keep a frozen eval suite that measures both the target task AND general instruction-following, so you can quantify catastrophic forgetting. Version datasets and adapters like code (they are artifacts you must reproduce and roll back). Prefer detached LoRA adapters over merged weights when you serve multiple tenants/behaviours — multi-LoRA serving amortizes one base model across many adapters. And write down the exit criteria before you start: what metric, what threshold, what it costs to maintain — otherwise fine-tuning becomes an expensive science project with no owner.",
    "interviewQuestions": [
      "Walk me through your decision framework for prompt engineering vs RAG vs fine-tuning.",
      "Explain how LoRA works mathematically and why it is so memory-efficient.",
      "What does QLoRA add on top of LoRA, and what makes it fit on a single 24GB GPU?",
      "What is catastrophic forgetting and how do you detect and mitigate it?",
      "Why is fine-tuning a poor way to add up-to-date factual knowledge to a model?"
    ],
    "interviewAnswers": [
      "Start cheap and reversible: prompt engineering first (instructions, few-shot, output schema) because it is instant to change and needs no infra. If the gap is missing or changing knowledge, use RAG — retrieve authoritative context at query time so facts stay editable and citable. Only fine-tune when the need is a consistent behaviour, format, tone, or a narrow skill that prompting can't reliably hold, or when you want to compress a long prompt into a small fast model to cut latency and cost. The tell: knowledge problem → RAG; behaviour/format/style/cost problem → fine-tune; everything else → prompt. And fine-tuning presupposes you already have an eval set.",
      "LoRA freezes the pretrained weight matrix W and learns a low-rank update. Instead of a full delta ΔW of shape d×k, it factorizes the update as B·A where B is d×r and A is r×k with rank r much smaller than d and k. The forward pass becomes W·x + (alpha/r)·B·(A·x). Only A and B are trained — often under 1% of parameters — so you store gradients and optimizer state for just those, slashing memory. It works because task adaptations empirically live in a low-rank subspace, so a small r captures most of the useful change. At inference you can merge B·A back into W for zero overhead, or keep it separate to hot-swap adapters.",
      "QLoRA quantizes the frozen base model to 4-bit using NF4 (a normal-float format matched to weight distributions) via bitsandbytes, while the LoRA adapters stay in bf16 and are the only trainable params. It adds double quantization (quantizing the quantization constants) to save more memory, and paged optimizers that offload optimizer state to CPU RAM to survive memory spikes. Because the huge base weights now take ~4 bits each instead of 16, a 7B–13B model plus adapters and activations fits in ~24GB, so a single 4090 can fine-tune it. Quality stays close to 16-bit LoRA because gradients only flow into the higher-precision adapters.",
      "Catastrophic forgetting is when fine-tuning on a narrow dataset overwrites general capabilities — the model gets better at your task but worse at instruction-following, reasoning, or other domains. You detect it by keeping a frozen general-ability eval (held-out instruction-following, reasoning, safety prompts) and running it before and after training, not just your task metric. Mitigations: use PEFT/LoRA (base weights stay frozen, so far less drift), fewer epochs and a lower learning rate, mix in some general/instruction data with your task data, keep rank modest, and early-stop on the general eval, not just training loss.",
      "Because SFT teaches the model the shape and style of answers, not a reliable, queryable fact store. Facts learned in weights are lossy, entangled, and un-citable — the model may still confidently hallucinate details, and there is no way to point to a source. Worse, updating a fact means collecting data and retraining, which is slow and expensive, whereas the real world changes constantly. RAG keeps facts in an external index you can update instantly, retrieve the exact passage, and cite. So knowledge belongs in retrieval; fine-tuning is for behaviour, format, and skills."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "QLoRA fine-tune with PEFT + TRL SFTTrainer",
        "code": "from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig\nfrom peft import LoraConfig, prepare_model_for_kbit_training\nfrom trl import SFTTrainer, SFTConfig\nimport torch\n\nmodel_id = \"meta-llama/Llama-3.1-8B-Instruct\"\n\n# 1) Load the base model in 4-bit (QLoRA): frozen NF4 weights, bf16 compute\nbnb = BitsAndBytesConfig(\n    load_in_4bit=True,\n    bnb_4bit_quant_type=\"nf4\",\n    bnb_4bit_use_double_quant=True,\n    bnb_4bit_compute_dtype=torch.bfloat16,\n)\nmodel = AutoModelForCausalLM.from_pretrained(\n    model_id, quantization_config=bnb, device_map=\"auto\"\n)\nmodel = prepare_model_for_kbit_training(model)\n\ntok = AutoTokenizer.from_pretrained(model_id)\ntok.pad_token = tok.eos_token\n\n# 2) LoRA adapters: only these train. Start small to avoid overfitting.\npeft_cfg = LoraConfig(\n    r=16, lora_alpha=32, lora_dropout=0.05, bias=\"none\",\n    task_type=\"CAUSAL_LM\",\n    target_modules=[\"q_proj\", \"k_proj\", \"v_proj\", \"o_proj\",\n                    \"gate_proj\", \"up_proj\", \"down_proj\"],\n)\n\n# 3) Data must already be in the model's chat template.\n#    dataset rows: {\"messages\": [{\"role\": \"user\", ...}, {\"role\": \"assistant\", ...}]}\ntrainer = SFTTrainer(\n    model=model,\n    peft_config=peft_cfg,\n    train_dataset=train_ds,\n    eval_dataset=eval_ds,\n    processing_class=tok,\n    args=SFTConfig(\n        output_dir=\"./llama-lora\",\n        num_train_epochs=2,          # 1-3 is plenty; more => forgetting\n        per_device_train_batch_size=2,\n        gradient_accumulation_steps=8,\n        learning_rate=2e-4,          # higher LR is fine for LoRA adapters\n        bf16=True,\n        logging_steps=10,\n        eval_strategy=\"steps\",\n        eval_steps=50,\n        max_length=2048,\n        packing=True,\n    ),\n)\ntrainer.train()\ntrainer.save_model(\"./llama-lora\")   # saves the tiny adapter only (~tens of MB)"
      },
      {
        "lang": "python",
        "label": "Format data to the chat template + load adapter for inference",
        "code": "# --- Correct data formatting: apply the SAME chat template used at inference ---\nfrom transformers import AutoTokenizer\ntok = AutoTokenizer.from_pretrained(\"meta-llama/Llama-3.1-8B-Instruct\")\n\nexample = {\"messages\": [\n    {\"role\": \"system\", \"content\": \"You are a terse SQL assistant.\"},\n    {\"role\": \"user\", \"content\": \"Users older than 30, newest first.\"},\n    {\"role\": \"assistant\",\n     \"content\": \"SELECT * FROM users WHERE age > 30 ORDER BY created_at DESC;\"},\n]}\n# add_generation_prompt=False for training (we include the assistant turn)\ntext = tok.apply_chat_template(example[\"messages\"], tokenize=False,\n                              add_generation_prompt=False)\n\n# --- Inference: load base + attach the trained adapter (or merge it) ---\nfrom peft import PeftModel\nfrom transformers import AutoModelForCausalLM\n\nbase = AutoModelForCausalLM.from_pretrained(\n    \"meta-llama/Llama-3.1-8B-Instruct\", device_map=\"auto\")\nmodel = PeftModel.from_pretrained(base, \"./llama-lora\")   # hot-swappable adapter\n# For zero inference overhead in single-tenant serving:\n# model = model.merge_and_unload()"
      },
      {
        "lang": "python",
        "label": "Managed fine-tuning via the OpenAI API (JSONL chat format)",
        "code": "# training.jsonl — one chat example per line:\n# {\"messages\": [{\"role\": \"system\", \"content\": \"...\"},\n#               {\"role\": \"user\", \"content\": \"...\"},\n#               {\"role\": \"assistant\", \"content\": \"...\"}]}\nfrom openai import OpenAI\nclient = OpenAI()\n\nf = client.files.create(file=open(\"training.jsonl\", \"rb\"), purpose=\"fine-tune\")\n\njob = client.fine_tuning.jobs.create(\n    training_file=f.id,\n    model=\"gpt-4.1-mini-2025-04-14\",\n    # a held-out validation file lets you watch for overfitting\n    validation_file=None,\n    hyperparameters={\"n_epochs\": 3},\n)\nprint(job.id)  # poll jobs.retrieve(job.id); use the returned model id at inference"
      }
    ]
  },
  {
    "id": "quantization-distillation",
    "phase": 7,
    "phaseName": "Production AI & Observability",
    "orderIndex": 99,
    "estimatedMins": 50,
    "prerequisites": [
      "llm-fundamentals",
      "fine-tuning-lora"
    ],
    "title": "Quantization & Model Distillation",
    "eli5": "A giant AI model is like a huge, heavy encyclopedia — accurate but slow and expensive to carry around. Quantization is printing it on thinner paper with slightly smaller type: almost all the same content, but far lighter and cheaper to ship. Distillation is hiring a bright student to read the encyclopedia and write a pocket guide that answers the questions people actually ask — much smaller, much faster, and good enough for the job.",
    "analogy": "Quantization is compressing a RAW photo to a high-quality JPEG: you drop bits you can barely perceive to make the file a quarter of the size. Distillation is a master chef teaching an apprentice their signature dishes — the apprentice never reads the original cookbooks, they just learn to reproduce the master's results, and they cook far faster in a smaller kitchen.",
    "explanation": "Model size directly drives your serving bill and your latency. Inference cost is dominated by GPU memory and memory bandwidth: bigger weights mean more expensive GPUs, fewer requests per GPU, and slower token generation (decoding is memory-bandwidth bound). Making a model smaller and faster without meaningfully hurting quality is one of the highest-leverage things a production AI team does — it can cut serving cost several-fold and shrink tail latency. Two families of techniques do this. Quantization keeps the same model but stores its numbers in fewer bits (16-bit → 8-bit → 4-bit), shrinking memory and speeding up memory-bound decoding. Distillation trains a smaller student model to imitate a larger teacher, producing a genuinely smaller network. They are complementary: you often distill to a small model AND quantize it for serving.",
    "technicalDeep": "Precision ladder: models train in FP32/BF16 (BF16 keeps FP32's exponent range with fewer mantissa bits, which is why it dominates training). Serving usually starts at FP16/BF16 (2 bytes/param → ~14GB for 7B). Quantizing to INT8 halves that; INT4 quarters FP16 to ~4GB for 7B. Two regimes: (1) Post-Training Quantization (PTQ) — quantize an already-trained model, no retraining. GPTQ uses second-order (approximate Hessian) information to quantize weights layer-by-layer while minimizing output error, great for 4-bit weight-only. AWQ (Activation-aware Weight Quantization) protects the small fraction of salient weight channels that correspond to large activations, often beating GPTQ on accuracy at 4-bit and is fast on GPU. bitsandbytes NF4 is the QLoRA-style 4-bit format, convenient but generally slower for pure serving than GPTQ/AWQ kernels. GGUF is the llama.cpp file format with many quant levels (Q4_K_M, Q5_K_M, Q8_0, etc.) optimized for CPU and Apple-Silicon/Metal inference — the standard for local/edge and Ollama. (2) Quantization-Aware Training (QAT) simulates quantization during training so the model adapts to it, recovering more accuracy at very low bit-widths, at the cost of a training run. Weight-only quantization (INT4 weights, FP16 activations) is the common LLM sweet spot; full INT8 weight+activation (W8A8) helps compute-bound prefill. Knowledge distillation trains a student on the teacher's soft targets — the full probability distribution (logits), not just the hard label — using a temperature-scaled KL-divergence loss, so the student learns the teacher's 'dark knowledge' about how classes relate. In the LLM era distillation is often done as data distillation: generate high-quality (prompt, completion) traces from a strong teacher and SFT a small student on them (this is how many small instruct models are built). Serving stacks: vLLM (PagedAttention, continuous batching, prefix caching, tensor parallelism, multi-LoRA, and native GPTQ/AWQ/FP8 support) and TGI are the production standard for GPU serving; llama.cpp/GGUF and Ollama for CPU/edge/local.",
    "whatBreaks": "Accuracy vs size is a real tradeoff, not a free lunch: 8-bit is usually near-lossless, 4-bit weight-only with GPTQ/AWQ is typically a small, acceptable hit for most tasks, but pushing to 3-bit or 2-bit often falls off a cliff — especially for reasoning, math, and coding, which are sensitive to precision. Smaller quantized models degrade first on long-context, multi-step reasoning, and rare/edge inputs, and the damage may not show up in average benchmarks while being obvious on your hard cases. Naive round-to-nearest quantization ignores outlier activations and tanks quality — that is exactly why GPTQ/AWQ exist. Distillation only transfers what the teacher demonstrates: a student distilled on a narrow dataset inherits the teacher's blind spots and cannot exceed it on unseen distributions, and it can amplify the teacher's biases. Mismatched or unfused quant kernels can be slower than FP16 despite smaller weights. And the classic trap: quantize, watch perplexity barely move, ship it — then discover in production that your agent's tool-calling or JSON formatting silently got flakier because you never evaluated the behaviours that actually matter.",
    "efficientWay": {
      "title": "Making a model cheap and fast to serve",
      "approaches": [
        {
          "name": "4-bit weight-only PTQ (AWQ/GPTQ) served on vLLM",
          "verdict": "best",
          "reason": "No retraining, ~4x smaller weights, big throughput and cost wins, and AWQ/GPTQ keep accuracy close to FP16 for most tasks. vLLM's continuous batching + paged attention + optimized quant kernels turn the memory savings into real tokens/sec and lower cost per request."
        },
        {
          "name": "Distill to a smaller student, then quantize it",
          "verdict": "ok",
          "reason": "Biggest long-term win when you have one dominant task and traffic to justify it — a distilled small model plus 4-bit quantization can be an order of magnitude cheaper. Costs a data/training pipeline and an eval investment, and the student inherits the teacher's blind spots."
        },
        {
          "name": "Push to 2–3 bit or W8A8 everywhere without task evals",
          "verdict": "weak",
          "reason": "Sub-4-bit and aggressive activation quantization frequently break reasoning/coding/long-context, and gains are format- and kernel-dependent. Doing it blind (only checking perplexity) ships silent quality regressions."
        }
      ],
      "recommendation": "For GPU serving, default to 4-bit AWQ (or GPTQ) weight-only on vLLM and measure quality on YOUR task evals, not just perplexity. Use FP8 on Hopper/Blackwell-class GPUs when supported for a strong quality/throughput balance. For local/edge, use GGUF Q4_K_M via llama.cpp/Ollama. Reach for distillation only when a single high-volume task justifies building the data + training + eval pipeline — and quantize the resulting student too."
    },
    "commonMistakes": [
      "Evaluating a quantized model only on perplexity or an average benchmark, missing regressions on reasoning, tool-calling, and JSON formatting that surface in production.",
      "Pushing to 3-bit/2-bit to save a bit more memory and destroying quality on hard cases for marginal savings.",
      "Using naive round-to-nearest quantization instead of outlier-aware methods (GPTQ/AWQ) and blaming the model for the quality drop.",
      "Assuming smaller weights automatically mean faster inference — without fused/optimized quant kernels it can be slower than FP16.",
      "Distilling a student on a narrow dataset and expecting it to generalize beyond what the teacher demonstrated.",
      "Confusing quantization (same model, fewer bits) with distillation (new smaller model) — they solve overlapping problems differently and are best combined.",
      "Ignoring the KV cache: at long context the KV cache, not the weights, dominates memory — weight quantization alone won't save you (consider KV-cache quantization / paged attention)."
    ],
    "seniorNotes": "Frame this as unit economics. The metrics that matter are tokens/sec/GPU, cost per 1K tokens, p50/p95/p99 latency, and quality on YOUR eval suite — optimize the whole curve, not a single number. Decode is memory-bandwidth bound, so weight quantization's biggest win is faster generation and fitting more concurrent requests per GPU (higher batch → better throughput). Prefill is more compute-bound, so activation quantization (W8A8/FP8) and good batching help there. Remember the KV cache: for long contexts it can dwarf weights, so pair weight quantization with paged attention, prefix caching, and possibly KV-cache quantization. The senior playbook is a cascade: route easy/high-volume traffic to a small quantized (often distilled) model, and escalate only the hard cases to a big model — capturing the big model's traces to distill the next-gen small model. Always keep a frozen eval gate in CI that blocks any quant/distill change that regresses the behaviours users depend on; 'it saves 40% cost' is worthless if it quietly breaks tool-calling. Finally, weigh build-vs-buy: for spiky or low volume, a hosted API is often cheaper than owning GPUs; self-hosting quantized models pays off at sustained high throughput or for data-residency/latency requirements.",
    "interviewQuestions": [
      "Why does quantization reduce serving cost and latency — what is actually the bottleneck at inference?",
      "Compare INT8 vs INT4 quantization and explain the accuracy-vs-size tradeoff.",
      "What do GPTQ and AWQ do differently from naive round-to-nearest quantization?",
      "Explain knowledge distillation and when you would distill instead of (or in addition to) quantizing.",
      "How would you decide between serving a big model, a quantized model, and a distilled model in production?"
    ],
    "interviewAnswers": [
      "LLM inference is dominated by GPU memory and memory bandwidth, not raw FLOPs, during the decode phase — you generate one token at a time and must stream the weights (and KV cache) through the memory system each step, so it's memory-bandwidth bound. Quantization stores weights in fewer bits, so there is less data to move and less memory to hold. That means faster per-token generation, and because the model occupies less memory you can fit a bigger batch or more concurrent requests on the same GPU, which raises throughput and cuts cost per token. You may also fit the model on a cheaper/smaller GPU entirely.",
      "INT8 roughly halves memory versus FP16 and is usually near-lossless — a safe default. INT4 quarters FP16 (a 7B model drops from ~14GB to ~4GB) and gives bigger throughput and cost wins, but with a small, task-dependent accuracy hit that is acceptable for many workloads when done with GPTQ/AWQ. The tradeoff is monotone: fewer bits, smaller and faster, but more quality loss, and it isn't linear — 8-bit is cheap insurance, 4-bit is the common sweet spot, and 3-bit/2-bit often fall off a cliff on reasoning, math, and coding. You pick the lowest bit-width that still passes your task-specific evals, not a generic benchmark.",
      "Naive round-to-nearest quantizes every weight independently to the closest representable value, which ignores that a few outlier weights/activations carry disproportionate importance — so error accumulates and quality drops, especially at 4-bit. GPTQ quantizes layer-by-layer using approximate second-order (Hessian) information to choose quantized values that minimize the layer's output error, compensating remaining weights as it goes. AWQ observes that the salient weight channels are the ones multiplied by large activations, and scales/protects those channels so quantization error lands on unimportant weights instead. Both preserve far more accuracy at 4-bit than naive RTN; AWQ is often more accurate and has fast GPU kernels.",
      "Distillation trains a small student model to imitate a large teacher. Classic distillation matches the teacher's soft output distribution (temperature-scaled logits) via KL divergence, so the student learns the teacher's 'dark knowledge' — how likely other answers were — not just the top label. In the LLM era it's often data distillation: generate high-quality completions from a strong teacher and supervised-fine-tune a small student on them. You distill (rather than only quantize) when you want a fundamentally smaller/faster network for one dominant task and have the traffic to justify building the data + training + eval pipeline. Quantization keeps the same model with fewer bits; distillation produces a new smaller model — and you typically do both: distill, then quantize the student.",
      "Decide by task difficulty, volume, latency SLO, and quality bar, measured on your own evals. Start with the smallest option that passes your quality gate. In practice I'd run a cascade/router: send easy, high-volume requests to a small quantized (often distilled) model for cheap low latency, and escalate only hard or high-stakes requests to the big model. Quantization is nearly always worth it for self-hosted serving because it's free quality-wise up to ~4-bit with AWQ/GPTQ. Distillation is worth it when one task dominates traffic and justifies the pipeline. And I'd weigh build-vs-buy: for spiky/low volume a hosted API often beats owning GPUs; self-hosting quantized/distilled models wins at sustained high throughput or when data residency and latency demand it. Whatever I choose, a frozen eval gate in CI blocks any change that regresses the behaviours users depend on."
    ],
    "codeExamples": [
      {
        "lang": "python",
        "label": "Load a 4-bit quantized model with bitsandbytes",
        "code": "from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig\nimport torch\n\n# NF4 4-bit weights, bf16 compute — ~4x smaller than fp16\nbnb = BitsAndBytesConfig(\n    load_in_4bit=True,\n    bnb_4bit_quant_type=\"nf4\",\n    bnb_4bit_use_double_quant=True,\n    bnb_4bit_compute_dtype=torch.bfloat16,\n)\n\nmodel = AutoModelForCausalLM.from_pretrained(\n    \"meta-llama/Llama-3.1-8B-Instruct\",\n    quantization_config=bnb,\n    device_map=\"auto\",   # fits on a single ~8-10GB GPU instead of ~16GB fp16\n)\ntok = AutoTokenizer.from_pretrained(\"meta-llama/Llama-3.1-8B-Instruct\")\n\nmsgs = [{\"role\": \"user\", \"content\": \"Give me one tip for cheaper LLM serving.\"}]\ninputs = tok.apply_chat_template(msgs, add_generation_prompt=True,\n                                 return_tensors=\"pt\").to(model.device)\nout = model.generate(inputs, max_new_tokens=128)\nprint(tok.decode(out[0][inputs.shape[1]:], skip_special_tokens=True))"
      },
      {
        "lang": "python",
        "label": "Serve a 4-bit AWQ model on vLLM (production GPU serving)",
        "code": "# vLLM auto-detects AWQ/GPTQ from the checkpoint and uses optimized kernels.\n# Continuous batching + PagedAttention turn smaller weights into real throughput.\nfrom vllm import LLM, SamplingParams\n\nllm = LLM(\n    model=\"TheBloke/Llama-3.1-8B-Instruct-AWQ\",  # a 4-bit AWQ checkpoint\n    quantization=\"awq\",\n    gpu_memory_utilization=0.90,\n    max_model_len=8192,\n)\n\nparams = SamplingParams(temperature=0.0, max_tokens=256)\nprompts = [\"Summarize why AWQ helps serving cost in two sentences.\"]\nfor o in llm.generate(prompts, params):\n    print(o.outputs[0].text)\n\n# Or run the OpenAI-compatible server:\n#   vllm serve TheBloke/Llama-3.1-8B-Instruct-AWQ --quantization awq"
      },
      {
        "lang": "bash",
        "label": "Run a GGUF quantized model locally with llama.cpp / Ollama",
        "code": "# --- llama.cpp: Q4_K_M is the popular 4-bit sweet spot for CPU / Apple Silicon ---\n# Download a GGUF (e.g. from Hugging Face), then run the OpenAI-compatible server:\nllama-server -m ./Llama-3.1-8B-Instruct-Q4_K_M.gguf \\\n  -c 8192 -ngl 99            # -ngl offloads layers to GPU/Metal if available\n\n# Quantize an FP16 GGUF down yourself:\nllama-quantize ./model-f16.gguf ./model-Q4_K_M.gguf Q4_K_M\n\n# --- Ollama wraps GGUF for one-command local serving ---\nollama run llama3.1:8b-instruct-q4_K_M \"One tip for cheap local inference?\"\n# Q8_0 ~= near-lossless/bigger, Q5_K_M ~= balanced, Q4_K_M ~= smallest sane default"
      }
    ]
  }
]
