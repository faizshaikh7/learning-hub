import type { InterviewBank } from '@/types'

/** Backend Engineering interview bank: roles + 3-round question set. */
export const BACKEND_INTERVIEW: InterviewBank = {
  roles: [
    {
      id: 'backend-engineer',
      title: 'Backend Engineer',
      seniority: 'Junior → Senior',
      icon: '⚙️',
      description:
        'Builds and maintains the server-side systems, APIs, and databases that power applications. Owns correctness, performance, and reliability of the services behind the product.',
      focus: ['API design', 'Databases & SQL', 'Auth & security', 'Caching', 'Testing'],
      demandNote: 'The highest-volume backend role — every product company hires these.',
    },
    {
      id: 'platform-engineer',
      title: 'Platform / Infrastructure Engineer',
      seniority: 'Mid → Senior',
      icon: '🏗️',
      description:
        'Builds the internal platforms, CI/CD, and infrastructure other engineers build on. Thinks in terms of reliability, deployment safety, and developer experience.',
      focus: ['Docker & Kubernetes', 'CI/CD', 'Observability', 'IaC', 'Scaling'],
      demandNote: 'High comp, high leverage — fewer roles but strong demand at scale-ups.',
    },
    {
      id: 'sre',
      title: 'Site Reliability Engineer (SRE)',
      seniority: 'Mid → Senior',
      icon: '🛡️',
      description:
        'Keeps production running. Owns SLOs, on-call, incident response, and the automation that makes systems self-healing. Software engineer who applies engineering to operations.',
      focus: ['Monitoring & SLOs', 'Incident response', 'Distributed systems', 'Automation', 'Capacity'],
      demandNote: 'Premium comp; expects strong systems fundamentals and calm under fire.',
    },
    {
      id: 'api-architect',
      title: 'API / Systems Architect',
      seniority: 'Senior → Staff',
      icon: '🧩',
      description:
        'Designs how services communicate and how the system scales. Makes the high-leverage decisions: service boundaries, data flow, consistency models, and API contracts.',
      focus: ['System design', 'Microservices', 'Event-driven arch', 'Data modeling', 'Tradeoffs'],
      demandNote: 'Senior+ role — the system design interview is the whole game here.',
    },
  ],

  questions: [
    // ── Round 1: Phone Screen (fundamentals, breadth) ──────────────────────────
    {
      id: 'be-s1',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'What is the difference between TCP and UDP, and when would you choose each?',
      modelAnswer:
        'TCP is connection-oriented and reliable — it guarantees ordered, complete delivery via handshakes, acknowledgements, and retransmission. UDP is connectionless and fire-and-forget: no ordering or delivery guarantees, but far lower overhead. Choose TCP when correctness matters (APIs, databases, file transfer) and UDP when speed matters more than perfection (video/voice streaming, gaming, DNS).',
      keyPoints: [
        'TCP = reliable, ordered, connection + handshake overhead',
        'UDP = unreliable, unordered, minimal overhead',
        'Maps choice to a concrete use case, not just definitions',
      ],
      followUp: 'Why does HTTP/3 move to UDP (QUIC) after decades of TCP?',
      topicId: 'tcp-ip-model',
    },
    {
      id: 'be-s2',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'Walk me through what happens when a request hits your API, from the load balancer to the response.',
      modelAnswer:
        'The load balancer picks a healthy instance and forwards the request. It flows through the middleware pipeline — typically logging, CORS, authentication, rate limiting, and body parsing — any of which can short-circuit with a 401 or 429. It then reaches the route handler, which validates input, runs business logic, and queries the database via a connection pool. The response is serialized to JSON, headers and status code are set, and it travels back through the same path.',
      keyPoints: [
        'Names the middleware pipeline and its ordering',
        'Mentions auth/rate-limit short-circuiting',
        'Connection pool for DB, serialization, status codes',
      ],
      topicId: 'middlewares',
    },
    {
      id: 'be-s3',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'What are the differences between authentication and authorization? How does JWT fit in?',
      modelAnswer:
        'Authentication is proving who you are (login); authorization is what you are allowed to do (permissions). A JWT typically handles authentication: after login the server signs a token containing the user id and claims, the client sends it on each request, and the server verifies the signature statelessly. Authorization is then enforced by checking claims/roles in the token against the resource being accessed.',
      keyPoints: [
        'Authn = identity, Authz = permissions — clearly separated',
        'JWT is signed, not encrypted; verified statelessly',
        'Short-lived access token + refresh token pattern',
      ],
      followUp: 'Why can\'t you revoke a stateless JWT, and how do teams work around that?',
      topicId: 'authentication',
    },
    {
      id: 'be-s4',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'Explain database indexing. Why does an index speed up reads but slow down writes?',
      modelAnswer:
        'An index is a separate sorted data structure (usually a B-tree) that maps column values to row locations, turning a full O(n) table scan into an O(log n) lookup. Reads get faster because the database can seek directly instead of scanning. Writes slow down because every INSERT/UPDATE/DELETE must also update every affected index to keep it sorted, adding write amplification and storage cost.',
      keyPoints: [
        'B-tree, O(log n) vs O(n) scan',
        'Write amplification: indexes must be maintained on write',
        'Mentions covering indexes or composite indexes as a bonus',
      ],
      followUp: 'You have a query filtering on (status, created_at). How would you index it?',
      topicId: 'sql-deep-dive',
    },
    {
      id: 'be-s5',
      level: 'screen',
      difficulty: 'mid',
      category: 'concept',
      question: 'What is caching and what are the main pitfalls of introducing a cache?',
      modelAnswer:
        'Caching stores a copy of expensive-to-compute or slow-to-fetch data closer to where it is needed, to cut latency and load. The classic pitfalls are cache invalidation (serving stale data), cache stampede (many requests recompute the same expired key at once), and cache penetration (misses for keys that never exist hammering the DB). Mitigations include TTLs, versioned keys, request coalescing, and negative caching.',
      keyPoints: [
        'States the goal: reduce latency and backend load',
        'Names invalidation, stampede, and staleness',
        'Offers concrete mitigations (TTL, coalescing)',
      ],
      topicId: 'caching',
    },
    {
      id: 'be-s6',
      level: 'screen',
      difficulty: 'beginner',
      category: 'concept',
      question: 'What makes an API RESTful? Name a few conventions you follow.',
      modelAnswer:
        'REST models resources addressed by URLs and manipulated with HTTP verbs: GET reads, POST creates, PUT/PATCH updates, DELETE removes. It is stateless — each request carries everything needed. Good conventions: plural nouns for collections, proper status codes (201 for create, 404 for missing, 422 for validation), consistent error shapes, pagination for lists, and versioning.',
      keyPoints: [
        'Resources + verbs + statelessness',
        'Correct status codes and consistent errors',
        'Pagination and versioning mentioned',
      ],
      topicId: 'rest-api-design',
    },

    // ── Round 2: Technical Deep Dive (depth, problem-solving) ──────────────────
    {
      id: 'be-t1',
      level: 'technical',
      difficulty: 'mid',
      category: 'debugging',
      question: 'Your API\'s p99 latency suddenly jumped from 50ms to 2s while p50 stayed flat. How do you investigate?',
      modelAnswer:
        'p50 flat but p99 spiking means most requests are fine and a tail is suffering — a resource-contention or dependency signature. I\'d check: connection pool exhaustion (requests queuing for a DB connection), a slow downstream dependency with no timeout, GC pauses, lock contention on a hot row, or an N+1 query on certain code paths. I\'d use tracing to find where the tail time is spent, look at pool saturation metrics, and check for a specific slow endpoint or tenant.',
      keyPoints: [
        'Interprets p50 vs p99 divergence as a tail/contention problem',
        'Names pool exhaustion, missing timeouts, locks, GC, N+1',
        'Reaches for distributed tracing and saturation metrics',
      ],
      followUp: 'The tail traces back to one DB query. Now what?',
      topicId: 'performance-profiling',
    },
    {
      id: 'be-t2',
      level: 'technical',
      difficulty: 'senior',
      category: 'tradeoff',
      question: 'How do you make a POST endpoint that creates a payment safe to retry (idempotent)?',
      modelAnswer:
        'The client generates an idempotency key (a UUID) and sends it in a header. On the server, before processing, I check a store keyed by that idempotency key. If it exists, I return the saved response instead of charging again. If not, I record the key, process the payment, and store the result — ideally in the same transaction as the charge so a crash can\'t leave the key without a result. Keys expire after a window (e.g. 24h).',
      keyPoints: [
        'Client-supplied idempotency key',
        'Check-then-store, returning the prior response on replay',
        'Atomicity between recording the key and the side effect',
      ],
      redFlags: [
        'Relying on "check if a payment exists" heuristics instead of an explicit key',
        'Storing the key and doing the charge in two non-atomic steps',
      ],
      topicId: 'database-transactions',
    },
    {
      id: 'be-t3',
      level: 'technical',
      difficulty: 'senior',
      category: 'concept',
      question: 'Explain database isolation levels. Which anomalies does each prevent?',
      modelAnswer:
        'Read Uncommitted allows dirty reads. Read Committed (Postgres default) prevents dirty reads but allows non-repeatable and phantom reads. Repeatable Read prevents non-repeatable reads — the same row read twice is identical — but phantoms can still appear (Postgres actually prevents most via snapshot isolation). Serializable makes transactions behave as if run one at a time, preventing all anomalies at the cost of more conflicts and retries. You pick the lowest level that is correct for the workload.',
      keyPoints: [
        'Maps each level to the anomalies it does/does not prevent',
        'Knows Read Committed is the common default',
        'Frames it as a correctness-vs-throughput tradeoff',
      ],
      followUp: 'Where would you actually need Serializable in a real product?',
      topicId: 'database-transactions',
    },
    {
      id: 'be-t4',
      level: 'technical',
      difficulty: 'mid',
      category: 'design',
      question: 'A user uploads a video and wants a thumbnail. How do you design this so the request doesn\'t block?',
      modelAnswer:
        'The upload handler stores the file (object storage), enqueues a "generate thumbnail" job with the file reference, and immediately returns 202 Accepted. A pool of workers consumes the queue, generates the thumbnail, writes it back, and updates status. The client polls or gets notified (webhook/websocket) when ready. The queue gives retries with backoff and a dead-letter queue for permanent failures.',
      keyPoints: [
        'Offload to a queue + workers; return 202 immediately',
        'Object storage for the file, reference in the message',
        'Retries, backoff, DLQ, and status/notification back to client',
      ],
      topicId: 'message-queues',
    },
    {
      id: 'be-t5',
      level: 'technical',
      difficulty: 'senior',
      category: 'debugging',
      question: 'Two background jobs occasionally deadlock in the database. What causes this and how do you fix it?',
      modelAnswer:
        'A deadlock happens when two transactions lock the same resources in opposite order — A locks row 1 then waits for row 2, while B locks row 2 then waits for row 1. The database detects the cycle and kills one. Fixes: acquire locks in a consistent, deterministic order across all code paths; keep transactions short; reduce lock scope; and add retry-on-deadlock with backoff since deadlocks are expected under concurrency.',
      keyPoints: [
        'Explains the cyclic lock-ordering cause',
        'Fix: consistent lock ordering + short transactions',
        'Adds deadlock-retry as a pragmatic safety net',
      ],
      topicId: 'database-transactions',
    },
    {
      id: 'be-t6',
      level: 'technical',
      difficulty: 'mid',
      category: 'tradeoff',
      question: 'Offset pagination vs cursor pagination — what breaks with offset at scale?',
      modelAnswer:
        'Offset pagination (LIMIT 20 OFFSET 10000) forces the database to scan and discard all skipped rows, so deep pages get progressively slower, and rows shifting between requests cause items to be skipped or duplicated. Cursor (keyset) pagination uses a stable sort key — WHERE created_at < last_seen ORDER BY created_at LIMIT 20 — which stays fast at any depth and is stable under inserts. The tradeoff is you lose random page access.',
      keyPoints: [
        'Offset scans+discards → slow deep pages',
        'Offset is unstable under concurrent inserts',
        'Cursor/keyset is O(limit) and stable; loses jump-to-page',
      ],
      topicId: 'rest-api-design',
    },

    // ── Round 3: System Design / Senior (architecture, tradeoffs) ──────────────
    {
      id: 'be-d1',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['backend-engineer', 'api-architect', 'platform-engineer'],
      question: 'Design a URL shortener (like bit.ly) that handles 100M redirects/day. Walk me through it.',
      modelAnswer:
        'Core: a service that maps a short code to a long URL. Generation: base62-encode an auto-increment id or a hash, checking for collisions. Storage: the mapping is read-heavy and simple — a key-value store or indexed SQL table, heavily cached in Redis since the same links are hit repeatedly. Redirects are a cache-first lookup returning a 301/302. Scale via stateless app servers behind a load balancer, a CDN in front, and read replicas or a KV store for the mapping. Add analytics asynchronously via a queue so counting clicks never slows the redirect.',
      keyPoints: [
        'Short-code generation strategy (base62 / hash) + collision handling',
        'Read-heavy → cache-first (Redis) and CDN',
        'Stateless app tier, async analytics via queue',
        'Discusses 301 vs 302 and capacity estimation',
      ],
      followUp: 'How do you guarantee the same long URL isn\'t stored twice, and does it matter?',
      topicId: 'system-design-prep',
    },
    {
      id: 'be-d2',
      level: 'design',
      difficulty: 'senior',
      category: 'design',
      roleIds: ['backend-engineer', 'api-architect', 'sre'],
      question: 'Design a rate limiter for an API gateway serving thousands of clients. What algorithm and where does state live?',
      modelAnswer:
        'I\'d use a token-bucket or sliding-window-counter algorithm keyed by client/API key. Each request checks and decrements a counter; if empty, return 429 with a Retry-After header. State must be shared across gateway instances, so it lives in a fast central store like Redis, using atomic operations (INCR with expiry, or a Lua script) to avoid race conditions. For extreme scale, do approximate local limiting per node plus periodic sync to reduce Redis round-trips.',
      keyPoints: [
        'Names a concrete algorithm (token bucket / sliding window)',
        'Shared state in Redis with atomic ops',
        'Returns 429 + Retry-After',
        'Considers the accuracy-vs-latency tradeoff of local vs central',
      ],
      topicId: 'rate-limiting-deep',
    },
    {
      id: 'be-d3',
      level: 'design',
      difficulty: 'senior',
      category: 'tradeoff',
      roleIds: ['api-architect', 'platform-engineer', 'sre'],
      question: 'When would you split a monolith into microservices, and what problems does that create?',
      modelAnswer:
        'Split when teams are blocked on each other, when parts of the system have very different scaling or reliability needs, or when the codebase is too large to reason about. But microservices trade in-process calls for network calls, which introduces latency, partial failure, and the need for retries, timeouts, and circuit breakers. You also get distributed data (no easy joins or transactions — often sagas), harder debugging (distributed tracing becomes mandatory), and deployment/operational overhead. Most teams should start with a modular monolith and extract services only when a real pressure justifies it.',
      keyPoints: [
        'Split for team autonomy / independent scaling, not fashion',
        'Names distributed-systems costs: partial failure, no distributed txns, tracing',
        'Recommends modular monolith first — maturity signal',
      ],
      redFlags: ['Advocating microservices by default with no cost awareness'],
      topicId: 'microservices-design',
    },
    {
      id: 'be-d4',
      level: 'design',
      difficulty: 'senior',
      category: 'behavioral',
      question: 'Tell me about a production incident you were part of. How did you handle it and what changed afterward?',
      modelAnswer:
        'A strong answer follows the incident lifecycle: how it was detected (alert/metric), how severity was assessed, how the bleeding was stopped first (rollback/feature-flag/failover) before root-causing, and clear communication throughout. It ends with a blameless postmortem producing concrete, owned action items — and honesty about what the candidate personally did and learned. Interviewers want calm prioritization of recovery over blame.',
      keyPoints: [
        'Mitigate first, root-cause second',
        'Structured: detect → triage → mitigate → resolve → postmortem',
        'Blameless culture + concrete follow-up actions',
        'Honest ownership of their specific role',
      ],
      topicId: 'incident-management',
    },
  ],
}
