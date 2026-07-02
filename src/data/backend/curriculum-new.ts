import type { CurriculumTopic } from '@/types'

/**
 * Newly-added, current (2025-2026) Backend topics kept separate from the base
 * curriculum so they can be woven into the correct learning sequence.
 */
export const BACKEND_NEW_TOPICS: CurriculumTopic[] = [
  {
    id: 'http-query-method',
    phase: 0,
    phaseName: 'Network & Internet Foundations',
    orderIndex: 99,
    estimatedMins: 30,
    prerequisites: ['http-protocol', 'rest-api-design'],
    title: 'The HTTP QUERY Method',
    eli5: "GET is like shouting your whole question in the doorway — fine for short questions, but it won't fit a paragraph. POST is like handing over a sealed envelope, but the receptionist assumes it might change things, so they can't safely re-open or copy it. QUERY is a new way to hand over an envelope that's clearly marked \"just a question, safe to copy\" — so it can hold a big question AND be cached and retried safely.",
    analogy: "Think of a library search desk. GET = you write your search on a tiny paper slip (URL) — quick, but there's only so much room and everyone can read it. POST = you fill out a full form, but it's stamped \"action request\" so the librarian files it and won't reuse the answer. QUERY = you fill out the full form but it's stamped \"read-only lookup\" — the librarian can cache the answer and hand the same result to the next person asking the same thing.",
    explanation: "QUERY is a new HTTP method (an IETF draft, `draft-ietf-httpbis-safe-method-w-body`, at draft-14 as of Nov 2025 — not yet a finalized RFC) that fills a real gap: a request that is SAFE and IDEMPOTENT like GET, but can carry a request BODY like POST.\n\nBefore QUERY, you had two imperfect options for complex searches:\n\n1. GET with a query string (`/search?q=...&filters=...`). Safe, idempotent, and cacheable — but URLs have practical length limits (proxies/servers often cap around 2–8KB), everything must be URL-encoded, and the query lands in logs, browser history, and referrer headers (bad for sensitive filters). Every parameter combination is also treated as a distinct URL.\n\n2. POST with a body. You can send an arbitrarily large, structured query (JSON), but POST semantics say \"this may change server state.\" So caches won't cache it, and clients/proxies won't automatically retry it — even though a search changes nothing.\n\n(People also tried \"GET with a body,\" but the spec says a GET body has no defined meaning, and many servers, proxies, and libraries silently drop or reject it. Don't rely on it.)\n\nQUERY gives you the best of both: the server is told \"process the query in the body; this is safe and idempotent,\" so responses can be cached and requests can be safely retried.",
    technicalDeep: "Semantics: QUERY asks the server to perform a query described by the request payload over data scoped to the request URI. It is SAFE (no state change) and IDEMPOTENT (repeating it has the same effect), which unlocks automatic retries and caching that POST cannot offer.\n\nRequest body: the body may be any content type with query semantics — a SQL-ish DSL, GraphQL, JSON filter object, etc. The `Content-Type` describes the query language.\n\nCaching via content-based keys: because the query is in the body, a cache key MUST incorporate the request content (a \"query fingerprint\"), not just the URL. Caches may normalize the body (strip content-encodings, apply media-type-suffix rules like `+json`) purely to compute the key — the request itself is unchanged.\n\nResponse patterns: (1) Direct — 200 OK with the results in the body. (2) Indirect — 303 See Other with a `Location` pointing at a results resource the client then GETs (good for long-running or paginated queries; that GET-able URL is itself cacheable/shareable).\n\nDiscovery & conditionals: a server can advertise supported query formats with the `Accept-Query` response header. Conditional requests (`If-Match`, `If-Modified-Since`) evaluate against the target resource's state, not the query result.\n\nStatus & reality: it's a draft, not yet an RFC, and support across servers, proxies, CDNs, and client libraries is still thin. Treat it as \"know it, watch it, adopt behind a feature flag\" rather than a default today.",
    whatBreaks: "Assuming universal support: many proxies, CDNs, WAFs, and HTTP libraries don't yet understand QUERY and may reject the method or strip the body — always have a POST fallback. Caching without a content-aware key: if your cache keys on URL only, two different QUERY bodies to the same URL will collide and serve wrong results — the cache MUST fingerprint the body. Treating QUERY like POST: putting side effects (writes) behind QUERY breaks the safe/idempotent contract and will bite you when a client or proxy legitimately retries. Confusing it with GraphQL: GraphQL famously tunnels everything over POST (losing HTTP caching) — QUERY is the transport-level fix that could let query APIs be cacheable again.",
    efficientWay: {
      title: 'Choosing how to send a complex read',
      approaches: [
        { name: 'QUERY method (where supported)', verdict: 'best', reason: 'Safe + idempotent + body: large structured reads that stay cacheable and retry-safe. The right long-term answer.' },
        { name: 'GET with query string', verdict: 'ok', reason: 'Perfect for small, non-sensitive filters. Universally supported and cacheable — just watch URL length and log exposure.' },
        { name: 'POST for search', verdict: 'weak', reason: 'Works everywhere today, but throws away caching and safe-retry semantics for something that is actually a read.' },
      ],
      recommendation: "For most APIs today: use GET for simple reads, and POST for complex searches but document them as read-only. Keep an eye on QUERY — when your stack (framework, CDN, proxies) supports it, adopt it behind a capability check with a POST fallback so you regain cacheability without breaking older clients.",
    },
    commonMistakes: [
      "Shipping QUERY to production assuming every proxy/CDN/library supports it — they largely don't yet",
      "Caching QUERY responses with a URL-only key instead of fingerprinting the request body",
      "Putting writes/side effects behind QUERY, violating the safe + idempotent contract",
      "Believing 'GET with a body' is a supported alternative — its body has no defined meaning and is often dropped",
    ],
    seniorNotes: "QUERY matters strategically because it could restore HTTP caching to query-style APIs. Today, GraphQL and many search endpoints run over POST, which makes them invisible to HTTP caches and CDNs — teams then rebuild caching in the application layer. A safe, idempotent method with a body means a CDN could cache query results again keyed on the body fingerprint. When evaluating adoption, the gating factor is rarely your own server (a route is easy) — it's the full path: client libraries, corporate proxies, WAFs, and your CDN. Roll it out with content negotiation and a POST fallback, and measure cache-hit ratio to justify it.",
    interviewQuestions: [
      "Why can't POST responses be cached the way GET responses can, and how does QUERY change that?",
      "What are the downsides of putting a large search in a GET query string?",
      "How must a cache compute its key for a QUERY request, and why?",
      "Is 'GET with a request body' a valid way to send a complex query? Why or why not?",
      "How would you roll out QUERY safely given uneven ecosystem support?",
    ],
    interviewAnswers: [
      "POST is defined as potentially unsafe and non-idempotent, so caches must assume it changes state and won't store the response; QUERY is explicitly safe and idempotent, so its responses are cacheable and its requests are safe to retry — while still allowing a request body.",
      "URLs have practical length caps (proxies/servers often reject beyond ~2–8KB), everything must be URL-encoded, and the query is exposed in logs, history, and referrer headers — bad for large or sensitive filters.",
      "The cache key MUST incorporate the request body (a content fingerprint), optionally normalized by media type, because with QUERY the query lives in the body — keying on URL alone would collide different queries to the same endpoint.",
      "No. The HTTP spec gives a GET request body no defined semantics, and many servers, proxies, and client libraries ignore or reject it, so it's unreliable — that's exactly the gap QUERY was created to fill.",
      "Feature-detect support (e.g. via Accept-Query or a capability flag), send QUERY where the whole path supports it, and fall back to POST otherwise; ensure any cache keys on the body fingerprint, and measure cache-hit improvements to justify wider rollout.",
    ],
    codeExamples: [
      {
        lang: 'bash',
        label: 'A QUERY request (body carries the search)',
        code: "# QUERY: safe + idempotent, but with a request body\nQUERY /contacts HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\nAccept: application/json\n\n{ \"select\": [\"name\", \"email\"], \"where\": { \"country\": \"IN\" }, \"limit\": 20 }\n\n# Direct response:\n#   HTTP/1.1 200 OK\n#   Content-Type: application/json\n#   [ { \"name\": \"...\", \"email\": \"...\" }, ... ]\n#\n# Or indirect (good for long/expensive queries):\n#   HTTP/1.1 303 See Other\n#   Location: /contacts/results/abc123   <- client GETs this (cacheable)",
      },
      {
        lang: 'javascript',
        label: 'GET vs POST vs QUERY — same search, different tradeoffs',
        code: "const body = JSON.stringify({ where: { country: 'IN' }, limit: 20 })\n\n// 1) GET — cacheable + safe, but limited & exposed in the URL\nawait fetch('/contacts?country=IN&limit=20')\n\n// 2) POST — any size body, but NOT cacheable and not auto-retryable\nawait fetch('/contacts/search', { method: 'POST', body })\n\n// 3) QUERY — big body AND cacheable + safe to retry (where supported)\ntry {\n  await fetch('/contacts', { method: 'QUERY', body,\n    headers: { 'Content-Type': 'application/json' } })\n} catch {\n  // Fallback until proxies/CDNs/libraries catch up:\n  await fetch('/contacts/search', { method: 'POST', body })\n}",
      },
    ],
  },
]
