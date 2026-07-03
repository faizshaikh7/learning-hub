import type { InterviewQuestion } from '@/types'

/**
 * Backend & System Design scenario bank: production-incident style questions
 * that complement the core BACKEND_INTERVIEW set. Every model answer follows
 * the framework: root cause → short-term fix → long-term architecture →
 * key trade-off → what to monitor.
 */
export const BACKEND_SCENARIO_QUESTIONS: InterviewQuestion[] = [
  // ── Screen: fundamentals asked through a practical lens ────────────────────
  {
    id: 'be-sc-1',
    level: 'screen',
    difficulty: 'beginner',
    category: 'concept',
    question: 'A teammate uses POST for every write in your API. Explain PUT vs PATCH vs POST — the semantics and idempotency of each.',
    modelAnswer:
      'POST creates a new resource (or triggers an action) and is not idempotent — sending it twice creates two things, which is exactly why retries on POST are dangerous. PUT fully replaces a resource at a known URL and is idempotent: applying the same complete representation twice leaves the same state, so clients can safely retry. PATCH applies a partial update and is not guaranteed idempotent — an increment-style patch applied twice gives a different result, though a set-field patch happens to be. The practical consequence is retry policy: proxies and clients may auto-retry idempotent verbs, so using POST where PUT fits forfeits free retry safety. A senior answer also notes that idempotency is about resulting server state, not about getting the identical response body every time.',
    keyPoints: [
      'POST = create/action, not idempotent; PUT = full replace, idempotent; PATCH = partial, not guaranteed idempotent',
      'Connects idempotency to retry safety, not just definitions',
      'Knows idempotency means same end state, not same response',
      'Mentions PUT requires the client to know the resource URL/id',
    ],
    followUp: 'Your client must retry a POST that creates an order. How do you make that safe?',
    redFlags: [
      'Saying PATCH is always idempotent',
      'Defining idempotency as "returns the same response"',
    ],
    topicId: 'rest-api-design',
  },
  {
    id: 'be-sc-2',
    level: 'screen',
    difficulty: 'mid',
    category: 'concept',
    question: 'Your app must show a user their private invoice PDF stored in object storage. Why not just return the storage URL, and what do you do instead?',
    modelAnswer:
      'A raw storage URL is either public — meaning anyone who obtains the link can read the invoice forever — or private and unusable by the browser, so exposing it directly is a data leak waiting to happen. The standard fix is a signed URL: the backend authorizes the user, then generates a short-lived cryptographically signed link (minutes, not days) that grants read access to exactly that object. The alternative is proxying the file through the backend, which gives per-request access checks, full audit logging, and instant revocation, at the cost of your servers carrying the bandwidth and latency. Most teams use signed URLs for scale and proxying when they need watermarking, strict auditing, or immediate revocation, since a signed URL cannot be recalled before it expires. Either way, log every access grant and alert on unusual download patterns.',
    keyPoints: [
      'Never expose bucket URLs; authorize in the backend first',
      'Signed URLs: short expiry, scoped to one object and operation',
      'Proxying trades bandwidth for logging and instant revocation',
      'Knows a signed URL cannot be revoked before expiry — expiry is the control',
    ],
    followUp: 'The security team asks for an audit trail of every invoice view. Which approach do you pick now?',
    redFlags: [
      'Suggesting a public bucket with unguessable filenames as security',
      'Signed URLs with multi-day expiries "for convenience"',
    ],
    topicId: 'object-storage',
  },
  {
    id: 'be-sc-3',
    level: 'screen',
    difficulty: 'beginner',
    category: 'concept',
    question: 'Walk me through the HTTP status codes a well-behaved API uses: 200/201/202/204, 400 vs 422, 401 vs 403, 409, 429, and 502 vs 503 vs 504.',
    modelAnswer:
      'For success: 200 is a generic OK with a body, 201 means a resource was created (with a Location header), 202 means accepted for async processing, and 204 means success with no body — typical for DELETE. For client errors: 400 is a malformed request the server cannot parse, while 422 is well-formed but semantically invalid (validation failures); 401 means unauthenticated (who are you?), 403 means authenticated but forbidden (you cannot do this); 409 signals a conflict with current state like a duplicate or version clash, and 429 means rate limited, ideally with Retry-After. For the 5xx gateway family: 502 means an upstream returned a bad response, 503 means the service itself is unavailable or shedding load, and 504 means an upstream timed out. Getting these right matters operationally because clients, retry logic, and monitoring all key off status codes — a 4xx spike points at callers, a 5xx spike pages you.',
    keyPoints: [
      '401 = unauthenticated vs 403 = unauthorized, stated crisply',
      '400 = malformed vs 422 = semantically invalid',
      '202 for async work, 409 for state conflicts, 429 with Retry-After',
      '502/503/504 distinguish upstream failure, own unavailability, upstream timeout',
    ],
    followUp: 'A payment provider times out behind your API. Which status do you return to your client and why?',
    topicId: 'http-protocol',
  },
  {
    id: 'be-sc-4',
    level: 'screen',
    difficulty: 'mid',
    category: 'concept',
    question: 'Explain the web attack triad: SQL injection vs XSS vs CSRF. What is each attack and what is the canonical defense for each?',
    modelAnswer:
      'SQL injection is attacker-controlled input being concatenated into a query so it executes as SQL — the canonical defense is parameterized queries or prepared statements, which keep data and code separate; ORMs give you this by default. XSS is attacker-controlled content executing as JavaScript in another user\'s browser, and the defense is context-aware output encoding/escaping (frameworks like React do this automatically) plus a Content-Security-Policy as defense in depth. CSRF exploits the browser automatically attaching cookies: a malicious site triggers a state-changing request to your app using the victim\'s session, and the defense is anti-CSRF tokens and SameSite cookies — note that pure token-in-header auth is inherently immune because nothing is attached automatically. The unifying mental model is trust boundaries: injection is the server trusting input as code, XSS is the browser trusting output as code, CSRF is the server trusting that a cookie implies user intent. Each defense should be enforced centrally (query layer, template engine, middleware) rather than per-endpoint, and you monitor with WAF alerts and CSP violation reports.',
    keyPoints: [
      'SQLi → parameterized queries, never string concatenation',
      'XSS → output encoding per context + CSP',
      'CSRF → SameSite cookies + anti-CSRF tokens; header-based auth is immune',
      'Frames all three as trust-boundary failures, defended centrally',
    ],
    followUp: 'Your API uses Bearer tokens in a header, no cookies. Which of the three still applies?',
    redFlags: [
      'Proposing input sanitization/blacklists as the primary SQLi defense',
      'Confusing XSS (browser executes script) with CSRF (browser sends request)',
    ],
    topicId: 'injection-attacks',
  },
  {
    id: 'be-sc-5',
    level: 'screen',
    difficulty: 'mid',
    category: 'concept',
    question: 'Users need to upload large files (hundreds of MB) from flaky mobile connections. Compare multipart vs chunked/resumable uploads, and uploading through your backend vs direct-to-storage with presigned URLs.',
    modelAnswer:
      'A single multipart POST works for small files but fails badly at size: one dropped packet at 95% restarts the whole upload, and the request ties up a server connection for minutes. Chunked resumable uploads split the file into parts uploaded independently, so a failure only retries one chunk and the client can resume after reconnecting — object stores support this natively via multipart upload APIs. Routing bytes through your backend doubles bandwidth and makes your app servers the bottleneck, so the scalable pattern is direct-to-storage: the backend authorizes the user and issues presigned upload URLs (per chunk), the client uploads straight to object storage, then notifies the backend to finalize. The trade-off is losing inline validation — you must verify size, type, and scan the file asynchronously after upload rather than as it streams through you. Monitor upload success rate, resume rate, and abandoned multipart uploads, which silently accrue storage cost until cleaned up.',
    keyPoints: [
      'Resumable chunks: retry only the failed part, resume after disconnect',
      'Presigned URLs move bandwidth off app servers; backend only authorizes and finalizes',
      'Post-upload validation/virus scan since bytes bypass the backend',
      'Lifecycle cleanup for abandoned partial uploads',
    ],
    followUp: 'How do you verify the client actually uploaded what it claimed (size, checksum, content type)?',
    redFlags: [
      'Buffering the whole file in app-server memory',
      'Handing out presigned URLs without authorization or size limits',
    ],
    topicId: 'object-storage',
  },

  // ── Technical: production incidents and trade-offs ─────────────────────────
  {
    id: 'be-sc-6',
    level: 'technical',
    difficulty: 'senior',
    category: 'debugging',
    question: 'A user taps Pay twice after a timeout and gets charged twice. Walk me through the client behavior, the idempotency key flow, the source of truth, and how gateway webhooks fit in.',
    modelAnswer:
      'The root cause is a retry without idempotency: the first charge succeeded but the response was lost to the timeout, so the second tap created a second charge — the fix is that the client generates one idempotency key per payment intent (not per request) and reuses it on every retry, while the button disables optimistically. Server-side, the key is checked and recorded atomically with creating the payment record, and the same key is forwarded to the gateway, which enforces its own idempotency, so replays return the original result at both layers. Short term you refund the duplicate and add the key flow; long term the source of truth is your payment record reconciled against gateway webhooks — and crucially the webhook can arrive before the client callback, so the handler must upsert by payment id rather than assume the client finished first. The trade-off is added state and key-expiry policy versus exactly-once user experience over an at-least-once network. Monitor duplicate-charge rate, idempotent-replay hits, and webhook-before-response occurrences to prove the fix works.',
    keyPoints: [
      'One idempotency key per payment intent, reused across retries',
      'Key recorded atomically with the charge; key also passed to the gateway',
      'Webhooks may arrive before the client callback — handlers upsert, order-independent',
      'Reconciliation against the gateway as the settlement source of truth',
    ],
    followUp: 'The gateway webhook and your DB disagree about a payment\'s status. Which wins, and what does the reconciliation job do?',
    redFlags: [
      'Fixing it only client-side by disabling the button',
      'Deduplicating by amount+user+time heuristics instead of an explicit key',
      'Assuming client callback always precedes the webhook',
    ],
    topicId: 'idempotency-exactly-once',
  },
  {
    id: 'be-sc-7',
    level: 'technical',
    difficulty: 'senior',
    category: 'debugging',
    question: 'During a flash sale you oversold: inventory went negative and 300 customers bought items you don\'t have. What went wrong and how do you prevent it?',
    modelAnswer:
      'The root cause is a read-then-write race: many requests read stock=1 concurrently, each decided it could sell, and each decremented — the check and the write were not atomic. The immediate fix is a conditional atomic update, UPDATE inventory SET stock = stock - 1 WHERE id = ? AND stock > 0, treating zero rows affected as sold out; alternatively SELECT FOR UPDATE pessimistically locks the row. At flash-sale scale a single hot row becomes the bottleneck, so the long-term architecture is a reservation model: requests enqueue, a serialized consumer (or atomic Redis counter as gatekeeper) allocates stock, and buyers get a short-lived reservation that expires if unpaid. The trade-off is optimistic vs pessimistic: optimistic concurrency wastes work under high contention, pessimistic locking serializes throughput — and the queue approach trades immediate confirmation for an eventual-consistency UX where the customer sees "reserving..." briefly. Monitor negative-stock assertions, reservation expiry rate, and lock wait time on the inventory rows.',
    keyPoints: [
      'Names the check-then-act race explicitly',
      'Atomic conditional decrement or row lock as the correctness fix',
      'Reservation + queue serialization for hot-item scale',
      'Optimistic vs pessimistic contention trade-off, and the UX consequence',
    ],
    followUp: 'The product team wants a live "23 left!" counter on the page. What consistency do you promise it?',
    redFlags: [
      'Proposing an application-level check before an unconditional UPDATE',
      'Caching stock counts and decrementing the cache as the source of truth',
    ],
    topicId: 'database-transactions',
  },
  {
    id: 'be-sc-8',
    level: 'technical',
    difficulty: 'mid',
    category: 'tradeoff',
    question: 'A user changes their password and expects to be logged out of all devices. Your auth uses JWTs. How do you actually do that?',
    modelAnswer:
      'The root problem is that a signed stateless JWT is valid until expiry no matter what happened since — the server has no per-token off switch. The standard architecture is short-lived access tokens (5-15 minutes) paired with long-lived revocable refresh tokens stored server-side: on password change you delete all the user\'s refresh sessions, so every device dies within one access-token lifetime. If even minutes of validity is unacceptable, add a token-version claim (or jti denylist) checked against Redis on each request — bump the user\'s version on password change and older tokens fail instantly. The trade-off is admitting some state back into "stateless" auth: the version check adds a fast Redis lookup per request, but only a tiny denylist/version map lives there, not full sessions. Monitor refresh-token reuse (a stolen-token signal), revocation-to-effect latency, and Redis availability since auth now depends on it.',
    keyPoints: [
      'Short-lived access + revocable server-side refresh tokens as the base pattern',
      'Token versioning or jti denylist in Redis for instant revocation',
      'Honest about the trade-off: revocation reintroduces state',
      'Bounds the exposure window by access-token TTL',
    ],
    followUp: 'What happens to auth if that Redis instance goes down — fail open or fail closed?',
    redFlags: [
      'Claiming JWTs simply cannot be revoked, full stop',
      'Storing entire sessions in Redis and calling them JWTs',
      'Access tokens with multi-day expiries',
    ],
    topicId: 'jwt-deep',
  },
  {
    id: 'be-sc-9',
    level: 'technical',
    difficulty: 'mid',
    category: 'debugging',
    question: 'Product search is timing out now that the catalog hit 10M rows. The query uses WHERE name LIKE \'%term%\'. Why is it slow and what is the real fix?',
    modelAnswer:
      'A leading-wildcard LIKE cannot use a B-tree index because B-trees are sorted left-to-right — with an unknown prefix there is no place to seek, so every query is a full table scan over 10M rows. The short-term relief is Postgres trigram (pg_trgm GIN) indexes or a materialized prefix search, which can rescue LIKE for a while. The long-term architecture is a real full-text engine — Postgres tsvector for moderate needs, Elasticsearch/OpenSearch when you need relevance ranking, typo tolerance, and faceting — treating the search index as a derived read model fed from the primary database. The hard part is index sync: dual-writing from application code drifts when one write fails, so senior engineers use CDC or the outbox pattern to stream changes, accepting seconds of indexing lag as the trade-off for consistency of the pipeline. Monitor indexing lag, search p95 latency, and a periodic count reconciliation between the DB and the index to catch drift.',
    keyPoints: [
      'Explains why a leading wildcard defeats B-tree seeking',
      'Full-text search as a derived read model, not a second source of truth',
      'CDC/outbox over dual-write, and why dual-write drifts',
      'Names indexing lag as the accepted trade-off',
    ],
    followUp: 'A product is updated but still shows the old price in search results for 30 seconds. Is that a bug?',
    redFlags: [
      'Suggesting "just add an index on name" without addressing the wildcard',
      'Dual-writing to DB and search with no drift story',
    ],
    topicId: 'elasticsearch',
  },
  {
    id: 'be-sc-10',
    level: 'technical',
    difficulty: 'senior',
    category: 'debugging',
    question: 'Your primary database crashes during peak traffic. Walk me through your first 15 minutes.',
    modelAnswer:
      'First declare the incident: page the on-call, open a channel, assign an incident commander, and post a status update — coordination failures cost more than the outage itself. Mitigation before diagnosis: promote a replica to primary via your failover mechanism (ideally automated with a proxy or DNS switch), while degrading gracefully in the meantime — serve reads from replicas or cache, put writes in read-only mode with a clear user message rather than hard-failing everything. The critical risk is that async replication means the replica may lag the crashed primary, so promotion can lose the last seconds of committed writes — you must know your replication lag at failover time and later reconcile, with PITR from WAL/backups as the recovery floor. The trade-off at the moment of promotion is availability versus those lost transactions: for most systems you promote and reconcile, for money movement you may choose read-only until the primary is recoverable. Throughout, monitor replication lag, error rates, and connection storms when the new primary comes up — thundering reconnects can knock it over again — then run a blameless postmortem covering why failover was not automatic.',
    keyPoints: [
      'Incident process first: declare, IC role, communicate',
      'Replica promotion + graceful degradation (read-only mode, cached reads)',
      'Async replication lag = potential data loss on promotion; PITR as backstop',
      'Reconnect/thundering-herd risk on the new primary',
    ],
    followUp: 'Replication lag was 8 seconds at crash time. What do you tell the payments team?',
    redFlags: [
      'Jumping straight to root-cause analysis while the site is down',
      'Assuming failover is lossless without mentioning replication mode',
      'No mention of communicating status',
    ],
    topicId: 'incident-management',
  },
  {
    id: 'be-sc-11',
    level: 'technical',
    difficulty: 'mid',
    category: 'debugging',
    question: 'Customers report receiving the same marketing email 3-4 times. The emails are sent by workers consuming a queue. What is happening and how do you fix it?',
    modelAnswer:
      'The root cause is an at-least-once queue paired with a non-idempotent consumer: the worker sent the email but crashed (or timed out) before acking, so the message was redelivered and sent again — the broker did exactly what it promises. The short-term fix is a deduplication check: derive a dedup key like campaign_id:user_id, record it (with the send) in a store with a unique constraint or SETNX, and skip if already present — making the side effect idempotent even though delivery is not. Long term, structure every consumer as check-dedup-key, do work, record key, ack — with the key write and business record in one transaction where possible — and route messages that repeatedly fail to a dead-letter queue so one poison message cannot loop forever inflicting duplicates. The trade-off is you cannot get true exactly-once across a queue and an external email API; you get at-least-once delivery plus idempotent processing, and the dedup store needs a retention window. Monitor duplicate-send rate via the dedup-hit counter, redelivery counts, and DLQ depth.',
    keyPoints: [
      'At-least-once delivery + non-idempotent side effect = duplicates, by design',
      'Dedup key with unique constraint / SETNX before the side effect',
      'DLQ for poison messages instead of infinite redelivery',
      'Exactly-once is idempotency layered on at-least-once, not a broker setting',
    ],
    followUp: 'The worker crashes after sending the email but before recording the dedup key. Now what?',
    redFlags: [
      'Blaming the queue and looking for an exactly-once broker mode',
      'Acking before doing the work to avoid redelivery (silent message loss)',
    ],
    topicId: 'message-queues',
  },
  {
    id: 'be-sc-12',
    level: 'technical',
    difficulty: 'mid',
    category: 'debugging',
    question: 'Your payment provider\'s webhook for order.completed fired three times for the same order and your fulfillment code shipped three boxes. Why do providers do this and what does a correct webhook handler look like?',
    modelAnswer:
      'Providers deliberately deliver at-least-once: if your endpoint is slow, times out, or returns non-2xx, they retry, because dropping a payment event is worse than repeating one — duplicates are the contract, not a bug. A correct handler does four things: verify the signature so you know it is really the provider, deduplicate by the provider\'s event id (insert into a processed_events table with a unique constraint — a conflict means already handled), respond 2xx within a couple of seconds, and do the real work asynchronously by enqueueing the event rather than shipping boxes inline. The slow-inline-work part is what caused the triple ship: fulfillment took longer than the provider\'s timeout, so it retried while attempt one was still running — which also means dedup must be atomic (claim the event id first), not check-then-act. The trade-off of ack-then-process is you own durability after acking, so the queue and DLQ must be reliable. Monitor duplicate-event rate, webhook handler latency, signature failures, and provider retry counts.',
    keyPoints: [
      'At-least-once is intentional; handlers must be idempotent',
      'Verify signature, dedup by event id with a unique constraint, atomically',
      'Return 2xx fast; enqueue heavy work async',
      'Slow inline processing causes retry storms — the timeout feedback loop',
    ],
    followUp: 'Events can also arrive out of order — order.completed before order.created. How do you handle that?',
    redFlags: [
      'No signature verification (anyone can POST to the endpoint)',
      'Dedup via a non-atomic check-then-insert',
      'Doing fulfillment synchronously inside the webhook request',
    ],
    topicId: 'webhooks',
  },
  {
    id: 'be-sc-13',
    level: 'technical',
    difficulty: 'senior',
    category: 'debugging',
    question: 'Two problems hit your cache in one week: users saw stale prices for an hour, and when a hot key expired the database fell over. Diagnose both and fix them.',
    modelAnswer:
      'These are the two classic cache failure modes: staleness from invalidation that never happened (the price update wrote the DB but nothing touched the cached key, so it lived out its long TTL), and a stampede where thousands of concurrent requests all missed the same expired hot key and recomputed it against the database simultaneously. Short term: shorten TTLs on price data and explicitly delete keys on write; for the stampede, put a single-flight lock around recomputation so one request rebuilds the value while the rest briefly serve the stale copy or wait. Long term, choose an invalidation strategy per data class — write-through or versioned keys (embed a version in the key so updates naturally miss to fresh data) for correctness-sensitive values, plain TTL for tolerant ones — and defend hot keys with jittered TTLs so expiries do not align, plus early probabilistic refresh that rebuilds popular keys before expiry. The trade-off is the eternal one: aggressive invalidation and short TTLs buy freshness at the cost of hit rate and DB load, and serving stale-while-revalidate buys availability at the cost of brief staleness. Monitor hit rate, per-key recompute concurrency, DB QPS spikes correlated with expiries, and staleness age on critical keys.',
    keyPoints: [
      'Separates the two failure modes: invalidation vs stampede',
      'Versioned keys / write-through / explicit delete-on-write for freshness',
      'Single-flight lock, jittered TTLs, early refresh for hot keys',
      'Stale-while-revalidate as an availability-vs-freshness dial',
    ],
    followUp: 'Delete-on-write still races: a reader can repopulate the cache with the old value just after your delete. How?',
    redFlags: [
      'Only answer is "lower the TTL" — trades one problem for the other',
      'Never mentions that concurrent misses on one key multiply DB load',
    ],
    topicId: 'caching',
  },
  {
    id: 'be-sc-14',
    level: 'technical',
    difficulty: 'senior',
    category: 'tradeoff',
    question: 'Redis goes down and your whole site goes down with it. Should a cache outage take the site out? Design for the next time.',
    modelAnswer:
      'No — a cache is an optimization, and the root cause here is treating it as a hard dependency: every request that needed Redis threw instead of falling back. The fix is graceful degradation: wrap cache access in a circuit breaker with tight timeouts so when Redis is unhealthy you skip it quickly and read from the database — but the DB is only sized for miss traffic, so pair the fallback with load shedding (serve the most important routes, return cheap defaults or 503s for the rest) rather than forwarding 100% of traffic to a DB that expects 10%. Recovery is its own trap: when Redis returns empty, a cold cache means a miss storm, so warm critical keys before rejoining and let the circuit breaker close gradually, avoiding the thundering herd. The honest trade-off is cost and complexity: true cache-independence requires a DB provisioned well above steady-state, so most teams choose degraded-but-up (shed low-priority load) over fully-up. Also separate concerns — if sessions or rate-limit state live in the same Redis, you have made it a database, and it needs HA (replica + failover) accordingly. Monitor cache hit rate, circuit-breaker state, DB load headroom, and fallback-path latency, and actually game-day the failure.',
    keyPoints: [
      'Cache must be a soft dependency: circuit breaker + short timeouts + DB fallback',
      'Fallback needs load shedding — the DB cannot take full traffic',
      'Cold-cache recovery: warm keys, gradual ramp, avoid thundering herd',
      'Distinguishes cache data from state (sessions) that makes Redis a real database',
    ],
    followUp: 'Rate limiting state also lived in that Redis. What happened to your rate limits during the outage, and is fail-open acceptable?',
    redFlags: [
      'Answer is only "make Redis highly available" — no degradation story',
      'Falling back 100% of traffic to the DB with no shedding',
    ],
    topicId: 'redis-patterns',
  },
  {
    id: 'be-sc-15',
    level: 'technical',
    difficulty: 'mid',
    category: 'debugging',
    question: 'Your background job queue backlog has grown from near-zero to 2 million messages over six hours and is still climbing. How do you diagnose and fix it?',
    modelAnswer:
      'A growing backlog means arrival rate exceeds processing rate, so first determine which side moved: did producers spike (a new feature, a retry storm, a batch import) or did consumers slow down (a slow downstream dependency, a deploy that made handlers slower, workers crashing, or a poison message being redelivered forever)? Consumer lag plus per-message processing time tells you: if handler latency jumped, chase the dependency; if it is flat, you need throughput. Short term: scale out consumers (up to the partition/ordering limit), batch work where the handler allows it, and move any poison messages to a DLQ so they stop clogging retries. Long term: autoscale consumers on queue depth or age, apply backpressure or shed load at the producer for low-value work, and split one queue into priority queues so a backfill can never starve password-reset emails. The trade-off is ordering and cost — more consumers means less ordering guarantee and paying for burst capacity — and the right SLO is queue age (oldest message wait time), not depth, because depth alone does not say whether users are hurting. Monitor age, depth, consumer throughput, handler latency, and redelivery/DLQ rates.',
    keyPoints: [
      'Frames it as arrival rate vs service rate, then isolates which changed',
      'Poison messages + retries as a hidden consumer-throughput killer',
      'Priority queues and backpressure so critical work never starves',
      'SLO on queue age, not just depth',
    ],
    followUp: 'Scaling consumers 4x barely helped. What does that tell you?',
    redFlags: [
      'Only answer is "add more workers" without diagnosing the bottleneck',
      'No mention of DLQ when retries are amplifying load',
    ],
    topicId: 'kafka',
  },
  {
    id: 'be-sc-16',
    level: 'technical',
    difficulty: 'mid',
    category: 'debugging',
    question: 'After a deploy, half your users see the new UI broken: the HTML is new but the CDN keeps serving last week\'s JavaScript. What went wrong and what is the durable fix?',
    modelAnswer:
      'The root cause is mutable asset URLs: app.js kept the same path across deploys, so CDN edges (and browsers) kept serving cached old bytes against new HTML that expected new code — and different edges expire at different times, which is why only some users broke. The immediate mitigation is purging the CDN cache via its invalidation API, but purges are slow to propagate and easy to forget, so they are a band-aid. The durable fix is content-hashed filenames: the build emits app.4f3a9c.js, HTML references the exact hash, and assets become immutable — served with Cache-Control: public, max-age=31536000, immutable — while the HTML itself gets a short TTL or no-cache so it always points at the current manifest. This inverts the problem: you never invalidate assets, you just publish new names, and old assets must remain available during the rollout so users holding old HTML still resolve their files. The trade-off is negligible; the discipline is deploy ordering — upload new assets before switching HTML. Monitor 404 rates on asset paths, cache hit ratio, and JS error spikes correlated with deploys.',
    keyPoints: [
      'Cache busting via content-hashed filenames, not purges',
      'Immutable + long max-age for assets; short TTL/no-cache for HTML',
      'Assets first, HTML second — and keep old assets serving during rollout',
      'Purge APIs as emergency tooling, not the strategy',
    ],
    followUp: 'A user keeps a tab open across your deploy and their old JS calls an API you just changed. Whose problem is that?',
    redFlags: [
      'Relying on manual CDN purges every deploy',
      'Setting long TTLs on HTML',
    ],
    topicId: 'cdn-edge',
  },
  {
    id: 'be-sc-17',
    level: 'technical',
    difficulty: 'senior',
    category: 'tradeoff',
    question: 'Your checkout calls a third-party tax-calculation API. Today that provider is down and your entire checkout is down with it. Fix the design.',
    modelAnswer:
      'The root cause is an unguarded synchronous dependency: no timeout (or a 30-second one), so requests piled up holding threads and connections until your own service exhausted itself — a classic cascading failure. First line of defense is aggressive timeouts (hundreds of milliseconds to low seconds, informed by the provider\'s p99) and retries with exponential backoff plus jitter, capped tightly, because uncoordinated retries against a struggling provider are a self-inflicted DDoS. Around that goes a circuit breaker: after a failure threshold it opens and fails fast without calling the provider, periodically letting a half-open probe through to detect recovery — protecting both your latency and their recovery. The senior move is asking the business what checkout should do when tax is unavailable: fall back to cached/estimated tax rates and reconcile later, or queue the order for delayed confirmation — almost anything beats being down. Add bulkheads (a dedicated, bounded connection/thread pool for this dependency) so tax slowness can never starve the rest of checkout. The trade-off is correctness versus availability — estimated tax may be slightly wrong and needs reconciliation. Monitor the breaker state, provider p99, fallback activation rate, and retry amplification.',
    keyPoints: [
      'Timeouts + capped exponential backoff with jitter; retries can DDoS',
      'Circuit breaker states: closed → open → half-open probe',
      'Business-level fallback (estimate/queue) beats hard failure',
      'Bulkheads isolate the dependency\'s resource consumption',
    ],
    followUp: 'The provider recovers, and your circuit closes — and instantly re-opens. Why might that happen?',
    redFlags: [
      'Retrying immediately in a tight loop with no backoff or cap',
      'No answer for what the user experiences during the outage',
    ],
    topicId: 'circuit-breaker',
  },
  {
    id: 'be-sc-18',
    level: 'technical',
    difficulty: 'mid',
    category: 'debugging',
    question: 'Alerts fire: API latency has tripled and every app server is at 100% CPU. You are on call. Walk me through your runbook.',
    modelAnswer:
      'Mitigate before you diagnose: check what changed first — a deploy in the last hour gets rolled back immediately, a traffic spike gets more instances (if the work is legitimate) or rate limiting (if it is abusive) — because users do not care about root cause while the site burns. Diagnosis runs on the RED dashboard (rate, errors, duration): is request rate up, meaning demand-driven, or flat, meaning each request got more expensive? If flat, profile: a flame graph or continuous profiler shows where CPU goes — common culprits are an accidental O(n²) on a growing dataset, JSON serialization of huge payloads, a hot loop from a bad feature flag, runaway GC, or a regex catastrophically backtracking. Check the slow query log and connection pool saturation too, since CPU-starved event loops and pool waits masquerade as each other in latency graphs. The trade-off in the moment is rollback speed versus losing the diagnostic state — grab a profile and a heap snapshot from one instance before restarting it, and take that instance out of the balancer instead of restarting everything. Afterward, monitor CPU utilization per endpoint, add a canary stage, and turn whatever you found into an alert that fires before saturation.',
    keyPoints: [
      'Mitigate first: rollback/scale/shed, then root-cause',
      'RED metrics to split demand-driven vs cost-per-request regressions',
      'Profiling/flame graphs to find the hot path; slow query log and pool saturation',
      'Preserve one sick instance for forensics instead of restarting all',
    ],
    followUp: 'CPU is 100% but the flame graph shows mostly idle/syscall time. What does that suggest?',
    redFlags: [
      'Starting a deep investigation while refusing to roll back',
      'Restarting everything and calling it fixed with no forensic capture',
    ],
    topicId: 'observability-stack',
  },
  {
    id: 'be-sc-19',
    level: 'technical',
    difficulty: 'mid',
    category: 'debugging',
    question: 'Requests are failing with "timeout acquiring connection from pool" errors while the database itself looks healthy. Explain what is happening, likely causes, and the fix.',
    modelAnswer:
      'The bottleneck is upstream of the database: every pooled connection is checked out, so new requests queue waiting for one and time out — the DB looks idle precisely because work cannot reach it. The usual causes, in order of likelihood: connection leaks (code paths that error out without releasing, missing finally/using blocks), transactions held open across slow work like an HTTP call inside a transaction, one slow query hogging connections while trafic backs up, or simple undersizing after traffic growth. Short term, restart to reclaim leaked connections and raise the pool a little; the real fix is finding the leak via pool instrumentation (acquire wait time, checkout duration, and which code path holds connections longest) and enforcing keep-transactions-short discipline. The sizing math matters and is fleet-wide: pool_size × instance_count must stay under the database\'s max_connections with headroom for admin and failover — autoscaling app instances with a fixed per-instance pool is a classic way to blow past DB limits, which argues for modest pools or a shared pooler like PgBouncer. The trade-off is that bigger pools do not add DB throughput — beyond roughly core-count-based limits they just move queuing into the database. Monitor acquire-wait p95, active vs idle connections, checkout duration, and DB-side connection counts.',
    keyPoints: [
      'Symptom is queueing for connections; DB idle is consistent with that',
      'Leaks and long transactions (I/O inside a txn) as top causes',
      'Fleet math: pool × instances vs DB max_connections; PgBouncer at scale',
      'Bigger pool ≠ more throughput; it can make the DB worse',
    ],
    followUp: 'Your platform autoscaled to 40 instances with a pool of 20 each. The DB allows 500 connections. What happens?',
    redFlags: [
      'Reflexively raising pool size without finding the leak',
      'Not knowing that transactions hold a connection for their entire duration',
    ],
    topicId: 'connection-pooling',
  },
  {
    id: 'be-sc-20',
    level: 'technical',
    difficulty: 'senior',
    category: 'debugging',
    question: 'A celebrity joins your platform. One shard now takes 100x the traffic of the others and is melting — reads pile up on their profile and every post fans out to millions. How do you handle the hot partition?',
    modelAnswer:
      'The root cause is that hash-by-user sharding assumes uniform key popularity, and a celebrity breaks that assumption: one shard owns all reads and writes for the hottest key, and no amount of adding shards helps because a single key cannot be split by rehashing. Short term: cache the hot object aggressively (their profile and recent posts belong in Redis and CDN, not the shard), enable request coalescing so a thousand concurrent readers become one backend fetch, and apply per-key rate limits to shed abusive load. Long term, treat hot keys as a first-class case: salt the key for write-heavy counters (split likes into N sub-counters, e.g. key#1..key#N, summed on read) so writes spread across shards, replicate read-hot data to multiple shards or replicas, and switch fan-out strategy for celebrity posts from push (write to millions of follower feeds) to pull (followers fetch at read time) — the classic hybrid. The trade-off is complexity and consistency: salted counters make reads more expensive and slightly stale, and hybrid fan-out means two code paths. Monitor per-shard load skew, top-K hot keys (via sampling), cache hit rate on the hot objects, and p99 on the affected shard.',
    keyPoints: [
      'Resharding cannot fix a single hot key — names why',
      'Cache + request coalescing + per-key limits as immediate relief',
      'Key salting / split counters for hot writes; replication for hot reads',
      'Push vs pull fan-out hybrid for celebrity accounts',
    ],
    followUp: 'How do you even detect which keys are hot before they melt a shard?',
    redFlags: [
      'Proposing "add more shards" as the fix for a single hot key',
      'No distinction between read-hot and write-hot mitigation',
    ],
    topicId: 'database-sharding',
  },
  {
    id: 'be-sc-21',
    level: 'technical',
    difficulty: 'senior',
    category: 'tradeoff',
    question: 'You must rename a column and change its type on a 500M-row table with zero downtime. The naive ALTER TABLE locked production for 40 seconds in staging. What is your migration plan?',
    modelAnswer:
      'The core principle is expand/contract: never make a change that breaks the code currently running, because during any deploy old and new code run simultaneously against one schema. Expand first: add the new column (nullable, no default that rewrites the table), deploy code that writes both columns (dual-write) while still reading the old one, then backfill historical rows in small batches — thousands of rows per transaction with pauses, never one giant UPDATE that locks and bloats. Once backfill is verified (counts and checksums comparing old vs new), flip reads to the new column behind a config or deploy, run that way long enough to trust it, and only then contract: stop dual-writing and drop the old column in a later release. For engines where even the ADD COLUMN or index build locks, use online tools of the gh-ost/pt-online-schema-change family, which build a shadow table and replay changes from the log before a near-instant cutover. The trade-off is time and discipline — a one-line change becomes a multi-day, multi-deploy sequence — bought in exchange for every step being individually safe and reversible. Monitor replication lag and lock waits during backfill, dual-write divergence counts, and keep an abort path at every stage.',
    keyPoints: [
      'Expand/contract: every step backward-compatible with running code',
      'Dual-write + batched backfill + verified flip + delayed drop',
      'Knows which DDL locks and reaches for gh-ost-style shadow-table tools',
      'Rollback safety at each stage; drop is last and separate',
    ],
    followUp: 'During dual-write, a bug wrote the new column for only 90% of rows. How do you detect and repair that?',
    redFlags: [
      'Running one big ALTER + UPDATE in a maintenance window they claim is zero-downtime',
      'Dropping the old column in the same deploy that flips reads',
    ],
    topicId: 'data-migrations',
  },
  {
    id: 'be-sc-22',
    level: 'technical',
    difficulty: 'senior',
    category: 'debugging',
    question: 'In your chat app, a user with a phone and a laptop reports that messages received while the laptop was offline never appear on it. Design the server side so no device ever misses a message.',
    modelAnswer:
      'The root cause is delivering messages only to currently-connected sockets: the phone was online and got the message, the laptop was not, and nothing remembered that it still owed the laptop anything. The fix is a server-side inbox per device (or a per-device cursor into a per-conversation log): every message is durably appended with a server-assigned, monotonically increasing sequence number, and each device tracks the last sequence it has acknowledged. Online devices get pushes; when the laptop reconnects it sends its last-acked sequence and the server replays everything after it — delivery is complete when the device acks, and unacked messages are retried, which means devices may see duplicates and must dedup by message id, making the whole path at-least-once plus idempotent. Ordering comes from the server-assigned sequence per conversation (the server\'s arrival order is the truth — client timestamps are unreliable), so all devices converge on the same order. The trade-offs are storage for inboxes/logs with a retention policy, and acks adding chattiness; the sequence-per-conversation approach also serializes writes per conversation, which is fine because a single chat is rarely a throughput bottleneck. Monitor per-device ack lag, replay volume on reconnect, undelivered-message age, and duplicate-suppression rate.',
    keyPoints: [
      'Durable per-device inbox or per-device cursor over a conversation log',
      'Delivery acks + retry = at-least-once; client dedup by message id',
      'Server-assigned per-conversation sequence numbers for ordering',
      'Reconnect protocol: send last-acked cursor, replay the gap',
    ],
    followUp: 'The user now installs a third device. What does it sync, and from where?',
    redFlags: [
      'Pushing only to connected sockets with no durable queue',
      'Ordering by client-generated timestamps',
    ],
    topicId: 'message-queues',
  },
  {
    id: 'be-sc-23',
    level: 'technical',
    difficulty: 'mid',
    category: 'tradeoff',
    question: 'A rolling deployment fails halfway: 4 of 10 instances run the new version, which turns out to be broken, and the rollout has stalled. How should the system have been set up, and what do you do now?',
    modelAnswer:
      'Right now: halt the rollout and roll the 4 instances back to the last known-good version — instance count and health matter more than figuring out the bug while users hit broken pods. The system should have caught this itself: deep health/readiness checks gate each batch, and the orchestrator only proceeds when the new instances pass real dependency-aware checks (not just "port is open"), with automatic rollback when error rates or latency regress — canary analysis formalizes this by comparing one new instance\'s metrics against the fleet before ramping. Two architectural rules make halfway states survivable: first, old and new versions will always coexist mid-rollout, so schema changes must be backward-compatible (expand/contract) and API changes tolerant in both directions; second, decouple deploy from release with feature flags, so shipping the binary is routine and risky behavior turns on gradually per cohort — and turning it off is an instant flag flip, not a redeploy. The trade-off is process overhead: flags accumulate as tech debt needing cleanup, and canary gates slow every deploy slightly — the price of never having a halfway-broken fleet page you. Monitor per-version error rate and latency (sliced by build id), rollout progress, and flag-exposure metrics.',
    keyPoints: [
      'Roll back first; do not debug on a half-broken fleet',
      'Meaningful health checks + automated canary analysis gating each batch',
      'Old and new coexist: backward-compatible schema and APIs are mandatory',
      'Feature flags decouple deploy from release; kill switch beats redeploy',
    ],
    followUp: 'The bad version also ran a database migration. How does that change your rollback?',
    redFlags: [
      'Debugging forward on production while half the fleet serves errors',
      'Health checks that only verify the process is listening',
    ],
    topicId: 'deployment-basics',
  },

  // ── Design: senior system design scenarios ─────────────────────────────────
  {
    id: 'be-sc-24',
    level: 'design',
    difficulty: 'senior',
    category: 'design',
    roleIds: ['backend-engineer', 'api-architect'],
    question: 'Design a WhatsApp-style chat system supporting 1:1 and group conversations. Cover the connection layer, message storage, delivery states, offline delivery, fan-out, ordering, and encryption at a high level.',
    modelAnswer:
      'Clients hold persistent WebSocket connections to a stateless gateway tier, with a connection registry (user/device → gateway node) in a fast store so any server can route a message to the right socket. A send flows: client → gateway → chat service, which durably persists the message to the message store (a wide-column store like Cassandra partitioned by conversation id, ordered by a server-assigned sequence) before acking — durability first, then fan-out to recipient devices via their gateways, with offline devices served from per-device queues drained on reconnect. Delivery states are per-recipient acks flowing backward: sent (server persisted), delivered (device acked receipt), read (user opened) — in groups these are per-member and aggregated. For group fan-out at WhatsApp group sizes (hundreds), fan-out-on-write to member queues is fine; ordering is per-conversation via the server sequence, since global ordering is unnecessary and expensive. End-to-end encryption (Signal-style) means the server routes ciphertext it cannot read, which is the key trade-off: you gain privacy but lose server-side search, abuse scanning of content, and multi-device becomes harder (per-device session keys). Monitor connection churn, message delivery latency p99, per-device queue depth and age, and reconnect replay volume.',
    keyPoints: [
      'Stateless WebSocket gateways + connection registry for routing',
      'Persist before ack; per-device offline queues; per-conversation sequence for ordering',
      'Delivery receipts as per-recipient acks (sent/delivered/read)',
      'E2E encryption trade-off: server routes ciphertext, loses search/scanning',
      'Fan-out-on-write to member inboxes for bounded group sizes',
    ],
    followUp: 'A group grows to 200k members (a channel). What breaks in your fan-out and how do you change it?',
    redFlags: [
      'No story for offline devices or reconnect',
      'Relying on client clocks for message ordering',
      'Hand-waving encryption as "use HTTPS"',
    ],
    topicId: 'system-design-prep',
  },
  {
    id: 'be-sc-25',
    level: 'design',
    difficulty: 'senior',
    category: 'design',
    roleIds: ['backend-engineer', 'api-architect'],
    question: 'Design an Instagram-style home feed. Walk through fan-out on write vs fan-out on read, the celebrity problem, feed caching, ranking, and pagination.',
    modelAnswer:
      'The core decision is where the work happens: fan-out-on-write pushes each new post id into every follower\'s precomputed feed (a Redis list/sorted set per user), making reads cheap — one fetch — at the cost of write amplification; fan-out-on-read computes the feed at request time by merging recent posts from everyone you follow, cheap on write but expensive on every read. Normal users are read-heavy so push wins, but a celebrity with 50M followers would trigger 50M feed writes per post, so the standard answer is hybrid: push for regular accounts, pull for high-follower accounts, and merge the pulled celebrity posts into the pushed feed at read time. The feed cache stores post ids (hydrated from a post-metadata cache on read), sized to a few hundred entries per user with the full history reconstructable from the source of truth. Ranking replaces pure recency: candidates from the feed are scored by a model (affinity, recency, engagement) at read time, which pairs naturally with cursor-based pagination — cursors must be stable snapshot tokens (position in a materialized ranked list) rather than offsets, or refreshes will duplicate and skip items as ranking shifts. The key trade-offs are write amplification vs read latency and feed freshness vs cost — inactive users should not get eager fan-out (lazy rebuild on return). Monitor feed-build latency, fan-out queue lag (posts appearing late in feeds), cache hit rate, and ranking service p99.',
    keyPoints: [
      'Push vs pull trade-off framed as write amplification vs read cost',
      'Hybrid fan-out for the celebrity problem',
      'Feed cache holds post ids; hydration and lazy rebuild for inactive users',
      'Stable cursors over a snapshot — offsets break under ranking/inserts',
    ],
    followUp: 'A user unfollows someone. Do you rewrite their cached feed? What about a deleted post already fanned out?',
    redFlags: [
      'Choosing pure fan-out-on-write with no celebrity answer',
      'Offset pagination over a ranked, changing feed',
    ],
    topicId: 'system-design-prep',
  },
  {
    id: 'be-sc-26',
    level: 'design',
    difficulty: 'senior',
    category: 'design',
    roleIds: ['backend-engineer', 'platform-engineer', 'api-architect'],
    question: 'Design a notification service that sends push, email, and SMS to millions of users. Cover ingestion, user preferences, batching, per-channel rate limiting, provider webhooks, dedup, and retries.',
    modelAnswer:
      'Producers (other services) publish notification events to an ingestion queue (Kafka) rather than calling providers directly — this decouples bursts from send capacity and gives one place for validation and dedup by event id, so a retried producer cannot double-notify. A preference service is consulted next: per-user channel opt-ins, quiet hours, and frequency caps (max N per day) — enforcing this centrally is what keeps the product from spamming users when five teams all send. Routing fans events into per-channel queues, each with its own worker pool, because channels fail independently and have wildly different throughput: email workers batch (providers accept thousands per API call and digests coalesce low-priority events), while SMS is rate-limited per provider contract and push is comparatively free — token-bucket limiters per channel and per provider protect your sender reputation and their limits. Sends are recorded with an idempotency key (event id + user + channel) before dispatch; failures retry with exponential backoff into a DLQ after N attempts, and provider webhooks (delivered, bounced, complained) flow back through the same ingestion path to update per-message status and feed suppression lists — repeatedly bouncing addresses get suppressed automatically. The key trade-off is latency vs efficiency: batching and digests save cost and user annoyance but delay delivery, so priority tiers (OTP now, digest later) split the pipeline. Monitor end-to-end delivery latency per tier, per-channel failure and bounce rates, DLQ depth, provider webhook lag, and duplicate-send rate.',
    keyPoints: [
      'Queue-first ingestion decouples producers from provider capacity',
      'Central preference/frequency-cap enforcement before routing',
      'Per-channel queues, batching for email, token-bucket limits per provider',
      'Idempotent sends + retries with DLQ; webhooks drive status and suppression',
      'Priority tiers: transactional (OTP) never queues behind digests',
    ],
    followUp: 'An OTP SMS must arrive in under 10 seconds but your SMS queue has a 5-minute backlog of marketing sends. How does your design guarantee the OTP gets through?',
    redFlags: [
      'Services calling email/SMS providers synchronously and directly',
      'No frequency capping or suppression-list story',
    ],
    topicId: 'message-queues',
  },
  {
    id: 'be-sc-27',
    level: 'design',
    difficulty: 'senior',
    category: 'design',
    roleIds: ['backend-engineer', 'api-architect'],
    question: 'Design a payment service for your platform: accepting charges via an external gateway, keeping balances correct, and never losing or double-counting money. Cover the ledger, idempotency, webhooks, and reconciliation.',
    modelAnswer:
      'The heart is a double-entry ledger: money is never a mutable balance column but an append-only journal where every transaction writes balanced debit and credit entries (customer receivable vs platform revenue, fees, refunds) — balances are derived sums, history is immutable and auditable, and an unbalanced write is structurally impossible to commit. Every state-changing operation is idempotent end to end: clients send an idempotency key per payment intent, the service records intent + key atomically, and the same key is passed to the gateway so a retry at any layer replays instead of re-charging. The gateway is integrated asynchronously: you record a pending payment, call the gateway, and treat its webhooks (signature-verified, deduped by event id, processed idempotently and order-independently) as the driver of state transitions — pending → succeeded/failed — because webhooks may arrive before your synchronous call returns, or instead of it. Reconciliation is the safety net that acknowledges two systems always drift: a daily job compares the gateway\'s settlement reports against your ledger, surfacing charges you missed, statuses that diverged, and amounts that differ, with discrepancies queued for automated repair or human review. The key trade-off is consistency over latency — payment state transitions run in serializable-leaning transactions and everything is written before acknowledged, accepting slower writes for correctness. Monitor reconciliation discrepancy counts (the north-star metric), webhook lag, stuck-pending payments by age, and ledger imbalance assertions that should never fire.',
    keyPoints: [
      'Append-only double-entry ledger; balances derived, never mutated',
      'Idempotency keys threaded through client → service → gateway',
      'Webhook-driven state machine: verified, deduped, order-independent',
      'Daily reconciliation against gateway settlement as the safety net',
      'Chooses consistency over latency and says so explicitly',
    ],
    followUp: 'A refund webhook arrives for a payment your DB says is still pending. What does your state machine do?',
    redFlags: [
      'A mutable balance column updated in place with no journal',
      'Trusting the synchronous gateway response as final with no webhook/reconciliation path',
    ],
    topicId: 'idempotency-exactly-once',
  },
  {
    id: 'be-sc-28',
    level: 'design',
    difficulty: 'senior',
    category: 'design',
    roleIds: ['backend-engineer', 'platform-engineer'],
    question: 'Design the pipeline for users uploading 5GB videos that must end up streamable worldwide: upload, storage, transcoding, and delivery.',
    modelAnswer:
      'Upload: the client requests an upload session, the backend authorizes and returns presigned multipart-upload URLs, and the client uploads chunks (say 10MB) directly to object storage with per-chunk retry and resume — a 5GB file through your app servers would monopolize connections and double bandwidth, so direct-to-storage is non-negotiable at this size. On completion the storage event (or client finalize call) enqueues a transcoding job; workers (GPU/CPU fleet, autoscaled on queue depth) pull jobs, validate and virus-scan the file, then transcode into an adaptive-bitrate ladder (multiple resolutions in HLS/DASH segments) — long jobs checkpoint per rendition/segment so a worker crash resumes rather than restarts, and poison files land in a DLQ. Outputs are written back to object storage, and the video record transitions through a status machine (uploading → processing → ready/failed) that the client polls or gets pushed, since the whole pipeline is asynchronous by design. Delivery is CDN in front of object storage: segment files are immutable and infinitely cacheable, players fetch a manifest and switch bitrates by measured bandwidth; private videos use signed cookies/URLs at the CDN edge. The key trade-offs are cost vs startup latency (eager-transcode every rendition vs lazily transcoding rarely-watched high resolutions) and pipeline complexity vs resilience. Monitor upload success/resume rates, queue age, transcode failure rate and duration per GB, time-to-ready, and CDN hit ratio.',
    keyPoints: [
      'Resumable chunked upload via presigned URLs, bytes never through app servers',
      'Event-driven transcoding queue with autoscaled workers, checkpoints, DLQ',
      'Adaptive-bitrate ladder (HLS/DASH) with immutable segments on CDN',
      'Status state machine because everything is async',
      'Eager vs lazy rendition transcoding as a cost trade-off',
    ],
    followUp: 'A creator uploads and their audience arrives in 60 seconds, but full transcoding takes 20 minutes. What do you do?',
    redFlags: [
      'Streaming the 5GB upload through the API service',
      'Transcoding synchronously in the request path',
    ],
    topicId: 'object-storage',
  },
  {
    id: 'be-sc-29',
    level: 'design',
    difficulty: 'senior',
    category: 'design',
    roleIds: ['backend-engineer', 'api-architect'],
    question: 'Design secure file sharing for a B2B product: users share sensitive documents via links with expiry, revocation, virus scanning, and a full audit trail.',
    modelAnswer:
      'Files live encrypted in private object storage, and a share is a first-class database record — share id, file, grantee (specific users, domain, or link-holder), permissions, expiry, and revoked flag — never just a URL, because the record is what makes revocation and auditing possible. Access flows through the backend: a share link hits your service, which authenticates (or applies link policy plus optional password), checks the share record is live and unexpired, writes an audit event, and only then issues a very short-lived signed URL (seconds to minutes) for the actual bytes — the signed URL is a one-time delivery detail, while the share link is the durable, revocable thing; revoking flips the record and takes effect on the next access check, with the tiny signed-URL window as the only exposure. Uploads are quarantined until an async virus-scanning pipeline clears them — a scan-pending file can be shared but not downloaded — and infected files are blocked with the owner notified. The audit log is append-only (who uploaded, shared, viewed, downloaded, revoked, from what IP, when) because in B2B the audit trail is a compliance product feature, not ops nicety. The key trade-off is proxy-vs-signed-URL again, resolved by the hybrid: authorization, logging, and revocation live in your service on every access, while object storage serves bandwidth. Monitor access-denied vs granted rates per share, scan queue latency, signed-URL TTL violations, anomalous download patterns (mass export), and audit-log write failures, which should page.',
    keyPoints: [
      'Share = revocable DB record; the link points at your service, not storage',
      'Every access re-checks policy, writes audit, then mints a seconds-lived signed URL',
      'Quarantine-until-scanned pipeline for uploads',
      'Append-only audit log as a compliance feature',
      'Instant revocation bounded only by the tiny signed-URL window',
    ],
    followUp: 'Legal asks you to prove nobody accessed a document after its revocation timestamp. Can your design prove that?',
    redFlags: [
      'Long-lived signed URLs handed out as the share link itself',
      'Security-through-unguessable-URL with no revocation path',
    ],
    topicId: 'api-security',
  },
  {
    id: 'be-sc-30',
    level: 'design',
    difficulty: 'senior',
    category: 'design',
    roleIds: ['backend-engineer', 'api-architect', 'sre'],
    question: 'Design an inventory service that survives flash sales: 500k people trying to buy 1,000 units in the first minute, with no overselling and a site that stays up.',
    modelAnswer:
      'Correctness first: stock allocation must be a single serialized decision point per SKU — an atomic conditional decrement (in the database or an atomic Redis counter as the fast gatekeeper, backed by the DB as truth) so overselling is structurally impossible, with purchases holding a short-TTL reservation that returns stock if payment does not complete. Survival second: 500k requests must not all reach that decision point, so layer the funnel — CDN and cache absorb product-page reads, a queue or virtual waiting room admits buyers at a controlled rate, and once inventory hits zero a cached sold-out flag short-circuits the remaining traffic at the edge instead of hammering the allocator. Architecture: separate the read path (availability display, cached, eventually consistent — a "23 left" counter may lie slightly and that is fine) from the write path (reserve → pay → commit as a small state machine with expiring reservations), and shard by SKU so one hot product cannot starve the rest of the catalog — though within a single SKU the counter is intentionally serialized, since 1,000 units means only 1,000 successful decrements matter. The key trade-off is fairness and UX versus throughput: a queue gives first-come-first-served and backpressure but shows users a wait; pure racing is "fair" only to the fastest connections and melts under load. Monitor reservation conversion and expiry rates, allocator latency, oversell assertions (must be zero), queue depth, and cache hit rate on product reads.',
    keyPoints: [
      'One atomic allocation point per SKU; reservations with TTL returning stock',
      'Funnel design: cache/CDN absorb reads, admission control before the allocator',
      'Read path eventually consistent, write path strictly consistent — split deliberately',
      'Sold-out short-circuit at the edge to shed the losing 499k requests',
      'Fairness (queue) vs raw throughput trade-off, stated explicitly',
    ],
    followUp: 'Marketing wants to run 50 flash sales on 50 SKUs simultaneously. What changes?',
    redFlags: [
      'Checking stock in application code then decrementing unconditionally',
      'Letting all 500k requests reach the database',
      'No reservation expiry, so abandoned carts strand inventory',
    ],
    topicId: 'horizontal-scaling',
  },
  {
    id: 'be-sc-31',
    level: 'design',
    difficulty: 'senior',
    category: 'design',
    roleIds: ['platform-engineer', 'sre'],
    question: 'Design a logging and analytics platform for all your company\'s services: ingestion at high volume, buffering, hot vs cold storage, and querying. Engineers need to debug incidents and analysts need to run aggregations.',
    modelAnswer:
      'Services emit structured JSON logs (with trace ids and service metadata) through a lightweight local agent that batches and ships them — never blocking the application on log delivery, and dropping DEBUG before ERROR under pressure. Everything lands in Kafka as the ingestion buffer, which is the load-bearing decision: it absorbs bursts, decouples producers from every downstream consumer, and lets you replay when a consumer breaks — its retention window is your at-most-N-hours-behind guarantee during downstream outages. Consumers fan out to a hot store and a cold store because the two workloads differ fundamentally: hot is the last 7-30 days in a search-optimized store (Elasticsearch/OpenSearch or Loki) for incident debugging — fast filtered search by service/trace/level — while cold is everything, compressed as Parquet in object storage, queried by engines like Athena/Trino for analyst aggregations, at a tiny fraction of hot-storage cost. Lifecycle policies tier data automatically (hot → cold → delete per retention/compliance), and sampling or aggregation on high-volume low-value logs keeps cost sane — the trade-off throughout is cost versus completeness and query speed, with cold queries taking seconds-to-minutes versus hot milliseconds, which is acceptable because analysts are not on call. The platform must monitor itself out-of-band: ingestion lag (consumer offset behind), dropped log rate at agents, indexing latency (the time until a log is searchable, critical during incidents), storage growth per team, and query p95 per store.',
    keyPoints: [
      'Local agent, structured logs, never block the app on logging',
      'Kafka buffer: burst absorption, consumer decoupling, replay',
      'Hot (search-optimized, days) vs cold (Parquet + object storage, years) split by workload',
      'Lifecycle tiering, sampling, and per-team cost attribution',
      'Time-to-searchable as a key SLO — logs you cannot see during an incident are worthless',
    ],
    followUp: 'During a major incident, log volume goes 20x and your pipeline is now 10 minutes behind — exactly when engineers need fresh logs. What in your design saves you?',
    redFlags: [
      'Services writing directly to Elasticsearch with no buffer',
      'One store for both search and analytics with no tiering or cost story',
    ],
    topicId: 'observability-stack',
  },
]
