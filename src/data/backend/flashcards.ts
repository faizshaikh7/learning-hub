import type { FlashcardData } from '@/types'

/** Backend Engineering flashcard deck keyed by topic id. */
export const BACKEND_FLASHCARDS: FlashcardData = {
  'how-internet-works': [
    { id: 'hiw_1', q: 'What is the internet at its most fundamental level?', a: 'A global network of computers connected via physical infrastructure (cables, routers), communicating by sending packets of data using standardized protocols.' },
    { id: 'hiw_2', q: 'What is a packet?', a: 'A small chunk of data. Large messages are split into packets, each routed independently across the network, then reassembled at the destination.' },
    { id: 'hiw_3', q: 'What is the role of a router?', a: 'Reads the destination IP in each packet and forwards it toward that destination by choosing the best next hop (outgoing interface). Routers make the internet self-healing — packets reroute around failures.' },
    { id: 'hiw_4', q: 'What is the difference between the internet and the web?', a: 'Internet = the global infrastructure (cables, routers, protocols). The web = one application layer on top of it, using HTTP to serve documents and resources.' },
    { id: 'hiw_5', q: 'What is latency vs bandwidth?', a: 'Latency = time for one packet to travel from A to B (ms). Bandwidth = how much data per second can flow. A satellite link can have high bandwidth but terrible latency (600ms RTT to geostationary orbit).' }
  ],
  'networking-terminology': [
    { id: 'nt_1', q: 'What is a port? Give 5 examples.', a: 'A number (0-65535) identifying a specific service. HTTP=80, HTTPS=443, SSH=22, PostgreSQL=5432, Redis=6379.' },
    { id: 'nt_2', q: 'What is a socket?', a: 'An IP address + port combination identifying one endpoint of a network connection. A unique connection is a 5-tuple: (protocol, srcIP, srcPort, dstIP, dstPort).' },
    { id: 'nt_3', q: 'What does "connection refused" mean vs "connection timed out"?', a: 'Refused = host received SYN but rejected it (no process listening). Timed out = packet never arrived or was silently dropped (firewall, unreachable host).' },
    { id: 'nt_4', q: 'What port range does the OS use for outgoing ephemeral connections?', a: '49152-65535. When your app connects to a server, the OS assigns a random port from this range as the source port.' },
    { id: 'nt_5', q: 'What does binding a server to 0.0.0.0 mean?', a: 'Accept connections on ALL network interfaces. Contrast with 127.0.0.1 (localhost only) which rejects external connections.' }
  ],
  'osi-model': [
    { id: 'osi_1', q: 'Name the 7 OSI layers from Application down to Physical.', a: 'Application (7) → Presentation (6) → Session (5) → Transport (4) → Network (3) → Data Link (2) → Physical (1). Mnemonic: "All People Seem To Need Data Processing"' },
    { id: 'osi_2', q: 'At which OSI layer does HTTP operate?', a: 'Layer 7 — Application. HTTP defines request/response format and semantics.' },
    { id: 'osi_3', q: 'At which OSI layer does TCP/UDP operate?', a: 'Layer 4 — Transport. Provides ports, segmentation, reliability (TCP) or speed (UDP).' },
    { id: 'osi_4', q: 'What is the key difference between L4 and L7 load balancers?', a: 'L4 routes by IP/port only (fast, cannot inspect content). L7 reads HTTP headers, URLs, cookies — can route by path (/api vs /static), host header, or do SSL termination.' },
    { id: 'osi_5', q: 'At which OSI layer does TLS encryption operate?', a: 'Layer 6 — Presentation. TLS encrypts before the Application layer sees data.' }
  ],
  'tcp-ip-model': [
    { id: 'tcp_1', q: 'Describe the TCP 3-way handshake.', a: 'Client SYN → Server SYN-ACK → Client ACK. Three messages, establishes sequence numbers. Adds ~1.5×RTT before any data flows.' },
    { id: 'tcp_2', q: 'Why is TCP reliable but UDP not?', a: 'TCP sends ACKs for every segment and retransmits on loss. Sequence numbers ensure ordering. UDP has no ACKs, retransmission, or ordering guarantee.' },
    { id: 'tcp_3', q: 'What is TCP head-of-line blocking?', a: 'If one TCP packet is lost, all subsequent data in the stream waits until that packet is retransmitted — even if later packets have already arrived. HTTP/2 multiplexes but still hits this.' },
    { id: 'tcp_4', q: 'How does HTTP/3 solve TCP head-of-line blocking?', a: 'HTTP/3 uses QUIC (over UDP). Lost packets only stall their own stream, not all streams. Each stream handles its own loss recovery independently.' },
    { id: 'tcp_5', q: 'Why is UDP used for DNS?', a: 'DNS queries are tiny (<512 bytes), responses are fast, and clients retry on timeout. UDP avoids TCP handshake overhead for what is essentially a one-shot question-answer.' }
  ],
  'ip-addressing': [
    { id: 'ip_1', q: 'What are the three private IP ranges?', a: '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Not internet-routable. Your home network is usually 192.168.x.x.' },
    { id: 'ip_2', q: 'What does a /24 subnet mean?', a: '24 bits = network address, 8 bits = host. 256 addresses total, 254 usable. Common in home routers and cloud subnets.' },
    { id: 'ip_3', q: 'What is NAT and why does it exist?', a: 'Network Address Translation — maps many private IPs to one public IP. Exists because IPv4 (4B addresses) was exhausted. Your router NATs your devices to share your ISP-assigned public IP.' },
    { id: 'ip_4', q: 'What does binding a server to 127.0.0.1 mean?', a: 'Loopback address — only accepts connections from the same machine. Traffic to 127.0.0.1 never leaves the host. Use 0.0.0.0 to accept external connections.' }
  ],
  'dns': [
    { id: 'dns_1', q: 'What DNS record maps a hostname to IPv4?', a: 'A record. Example: api.example.com → 93.184.216.34. AAAA maps to IPv6. CNAME maps to another hostname (adds an extra lookup).' },
    { id: 'dns_2', q: 'What is DNS TTL?', a: 'Time To Live — seconds that DNS resolvers cache a record. Low TTL = faster propagation after changes but more queries. Before migrating servers, lower TTL to 60-300s.' },
    { id: 'dns_3', q: 'What is the difference between a recursive resolver and authoritative nameserver?', a: 'Recursive resolver (e.g. 8.8.8.8) does the lookup work, querying multiple servers. Authoritative nameserver holds the actual records for the domain and gives the definitive answer.' },
    { id: 'dns_4', q: 'What DNS records are required for email deliverability?', a: 'MX (mail server), SPF TXT (authorized sending IPs), DKIM TXT (signature key), DMARC TXT (policy for failed checks). Missing these = email goes to spam.' },
    { id: 'dns_5', q: 'How do you bypass DNS cache when debugging?', a: 'dig +trace yourdomain.com — queries authoritative servers directly, bypassing all caches at OS, browser, and resolver levels.' }
  ],
  'http-protocol': [
    { id: 'http_1', q: 'What HTTP status code means a resource was successfully created?', a: '201 Created. Include a Location header pointing to the new resource URL. 200 means existing resource found/returned — not created.' },
    { id: 'http_2', q: 'What is the difference between 401 and 403?', a: '401 = not authenticated (no/bad credentials — log in first). 403 = authenticated but not authorized (you are logged in but do not have permission). Note: 401 is confusingly named "Unauthorized".' },
    { id: 'http_3', q: 'Which HTTP methods are idempotent?', a: 'GET, PUT, DELETE, HEAD, OPTIONS. Calling them multiple times has the same effect as once. POST and PATCH are not idempotent.' },
    { id: 'http_4', q: 'What is the difference between PUT and PATCH?', a: 'PUT replaces the ENTIRE resource with the request body. PATCH applies a partial update — only the fields sent are changed.' },
    { id: 'http_5', q: 'What status code for rate limiting and what header should accompany it?', a: '429 Too Many Requests. Include Retry-After: <seconds> so the client knows when to retry.' },
    { id: 'http_6', q: 'What does Content-Type header do?', a: 'Tells the receiver the format of the message body. Common: application/json, text/html, multipart/form-data (file uploads), application/x-www-form-urlencoded.' },
    { id: 'http_7', q: 'What does HTTP 304 Not Modified mean?', a: 'Used with conditional requests (ETag / If-None-Match). Tells the client: "your cached version is still valid, use it." Saves bandwidth and round-trip time.' }
  ],
  'middlewares': [
    { id: 'mw_1', q: 'What happens if Express middleware never calls next() and never sends a response?', a: 'The request hangs indefinitely — client waits for a response that never comes, eventually times out.' },
    { id: 'mw_2', q: 'What is the signature of an Express error-handling middleware?', a: '(err, req, res, next) — four parameters. Express identifies it as an error handler by the 4-param signature. Must be registered AFTER all routes.' },
    { id: 'mw_3', q: 'What causes "Cannot set headers after they are sent to the client"?', a: 'next() or res.send() was called after a response was already sent. Usually from calling next() then also calling res.json() without a return statement.' },
    { id: 'mw_4', q: 'What is the asyncWrapper pattern?', a: 'const wrap = fn => (req, res, next) => fn(req, res, next).catch(next). Catches async errors and passes them to Express error middleware automatically.' }
  ],
  'error-handling': [
    { id: 'eh_1', q: 'What is the difference between an operational error and a programming error?', a: 'Operational: expected failure (DB timeout, invalid input, 3rd party down) — handle gracefully, return 4xx/503. Programming: unexpected bug (null reference, wrong type) — log full stack, return 500, fix the code.' },
    { id: 'eh_2', q: 'What should an error response include and exclude?', a: 'Include: HTTP status, error code (machine-readable), human message, requestId. Exclude: stack traces, SQL queries, file paths, internal details.' },
    { id: 'eh_3', q: 'How do you handle unhandled promise rejections in Node.js?', a: 'process.on("unhandledRejection", (reason) => { logger.error(reason); process.exit(1); }). Log and exit — a process manager (PM2) restarts it.' }
  ],
  'client-server-architecture': [
    { id: 'cs_1', q: 'Why should business logic (pricing, discounts) always live server-side?', a: 'Clients are untrusted — any user can intercept and modify requests. Server is the source of truth. Client-side pricing = fraud vector.' },
    { id: 'cs_2', q: 'What problem does stateless server design solve?', a: 'Enables horizontal scaling — any server can handle any request since no session state is stored locally. Stateful servers require sticky sessions or shared session storage.' }
  ],
  'rest-api-design': [
    { id: 'rest_1', q: 'What is wrong with these URLs: /getUsers, /createOrder, /deleteProduct?', a: 'URLs should be nouns (resources), not verbs. The HTTP method is the verb. Correct: GET /users, POST /orders, DELETE /products/:id.' },
    { id: 'rest_2', q: 'What is the difference between cursor pagination and offset pagination?', a: 'Offset: LIMIT x OFFSET y — simple but slow on large datasets (DB scans and discards all offset rows). Cursor: WHERE id > last_seen_id — consistent and fast regardless of dataset size.' },
    { id: 'rest_3', q: 'Why use UUIDs instead of sequential IDs in public APIs?', a: 'Sequential IDs are enumerable (user can try /users/1, /users/2) enabling scraping and IDOR attacks. UUIDs are non-guessable.' }
  ],
  'authentication': [
    { id: 'auth_1', q: 'What is the structure of a JWT?', a: 'base64url(header) . base64url(payload) . signature. Anyone can decode header and payload — never put secrets in JWT. Only the signature requires the secret to verify.' },
    { id: 'auth_2', q: 'Why store JWT in memory (not localStorage)?', a: 'localStorage is accessible to any JS on the page (XSS can steal it). Memory (JS variable) is not accessible outside the current execution context.' },
    { id: 'auth_3', q: 'What is the standard access/refresh token strategy?', a: 'Access token: short-lived (15min), in memory. Refresh token: long-lived (7-30 days), in HttpOnly cookie. On 401, use refresh token to get a new access token silently.' },
    { id: 'auth_4', q: 'What is the algorithm confusion attack on JWTs?', a: 'Setting alg: "none" in the header bypasses signature verification in libraries that do not enforce algorithm. Always specify allowed algorithms: jwt.verify(token, secret, { algorithms: [\'HS256\'] }).' }
  ],
  'databases': [
    { id: 'db_1', q: 'What does ACID stand for?', a: 'Atomicity (all-or-nothing transaction), Consistency (rules enforced), Isolation (concurrent transactions do not interfere), Durability (committed data survives crashes).' },
    { id: 'db_2', q: 'What is the N+1 query problem?', a: 'Fetching N records then issuing one query per record = N+1 total queries. Fix: JOIN to get all data in one query, or batch load with IN (id1, id2, ...).' },
    { id: 'db_3', q: 'What does EXPLAIN ANALYZE show in PostgreSQL?', a: 'The query execution plan with actual timing. Look for Seq Scan (missing index = slow) vs Index Scan (using index = fast). Shows actual rows vs estimated rows.' },
    { id: 'db_4', q: 'Why use a connection pool instead of creating connections per request?', a: 'New DB connection takes 20-50ms. Pool pre-creates connections (5-20) reused across requests. Connection acquisition from pool is ~0.1ms.' }
  ],
  'caching': [
    { id: 'cache_1', q: 'What is the cache-aside pattern?', a: 'Check cache first. If miss, query DB, store result in cache with TTL, return result. On write: update DB and invalidate (delete) cache entry.' },
    { id: 'cache_2', q: 'What is cache stampede (thundering herd)?', a: 'Many requests hit a cache key simultaneously on expiry — all miss and all query the DB at once. Fix: probabilistic early expiration or a distributed lock to let only one request refresh.' },
    { id: 'cache_3', q: 'When should you NOT cache data?', a: 'User-specific data (include userId in key or avoid caching). Errors (do not cache DB-down errors). High-frequency writes (cache is invalidated constantly, no benefit). Financial/payment data (always needs real-time accuracy).' }
  ],
  'async-programming': [
    { id: 'async_1', q: 'What is the difference between Promise.all() and Promise.allSettled()?', a: 'Promise.all() fails immediately if any promise rejects. Promise.allSettled() waits for all to complete regardless of outcome, returning {status, value/reason} for each.' },
    { id: 'async_2', q: 'What is the event loop in Node.js?', a: 'A loop that processes events from a queue. Async I/O operations are offloaded to libuv, and their callbacks are queued when complete. The loop processes callbacks between I/O operations, enabling single-threaded concurrency.' },
    { id: 'async_3', q: 'What blocks the event loop?', a: 'CPU-intensive synchronous operations: large array sorts, complex string manipulation, crypto operations (use built-in async versions), image processing. These prevent other requests from being handled.' }
  ],
  'api-security': [
    { id: 'sec_1', q: 'How do you prevent SQL injection?', a: 'Parameterized queries (prepared statements). Never concatenate user input into SQL strings. In Node.js: db.query("SELECT * FROM users WHERE id = $1", [userId]).' },
    { id: 'sec_2', q: 'What is IDOR (Insecure Direct Object Reference)?', a: 'Accessing resources by ID without verifying ownership. Example: GET /invoices/456 should check invoice.userId === req.user.id — otherwise any user can access any invoice.' },
    { id: 'sec_3', q: 'What is mass assignment vulnerability?', a: 'Blindly spreading req.body to a DB update allows users to set fields they should not (e.g., role: "admin"). Always whitelist allowed fields explicitly.' }
  ],
  'environment-config': [
    { id: 'conf_1', q: 'Why must .env files never be committed to Git?', a: 'They contain secrets (DB passwords, API keys, JWT secrets). Once committed, they are in git history forever, even if later deleted. Use .gitignore and rotate any accidentally committed secrets immediately.' },
    { id: 'conf_2', q: 'What is "fail fast" config validation?', a: 'Check for required environment variables at startup and exit immediately with a clear error if any are missing. Better than discovering a missing config at runtime when a user triggers the affected feature.' }
  ],
  'logging-monitoring': [
    { id: 'log_1', q: 'What are the four golden signals?', a: 'Latency (how long requests take), Traffic (requests per second), Errors (error rate), Saturation (how full is the system — CPU, memory, queue depth).' },
    { id: 'log_2', q: 'What are the three pillars of observability?', a: 'Logs (what happened), Metrics (how much / how many), Traces (how long did each part take across services). Together they allow debugging any system state.' },
    { id: 'log_3', q: 'What is a correlation ID / request ID?', a: 'A unique ID assigned to each request, attached to all logs for that request. Allows you to find all log lines for a specific request across multiple services or log lines.' }
  ],
  'testing': [
    { id: 'test_1', q: 'What is the testing pyramid?', a: 'Many unit tests (fast, cheap), fewer integration tests (medium), few E2E tests (slow, expensive). Optimizes for fast feedback — unit tests run in <1s, E2E can take minutes.' },
    { id: 'test_2', q: 'Why should integration tests use a real database?', a: 'Mocks diverge from real DB behavior. They cannot catch index issues, constraint violations, or query plan problems. Use test containers or an in-memory SQLite/PostgreSQL for realistic testing.' },
    { id: 'test_3', q: 'What is the difference between a mock and a stub?', a: 'Stub: replacement with preset return values (no assertions). Mock: replacement that also records calls and asserts they happened correctly. Both are test doubles.' }
  ],
  'deployment-basics': [
    { id: 'dep_1', q: 'What is the difference between blue-green and canary deployments?', a: 'Blue-green: full new version (green) spun up alongside old (blue), traffic switched instantly. Canary: route small % (5-10%) of traffic to new version, monitor, then gradually increase.' },
    { id: 'dep_2', q: 'What is graceful shutdown?', a: 'On SIGTERM: stop accepting new connections, wait for in-flight requests to complete, close DB connections, then exit. Prevents dropped requests during deployments.' },
  ],

  // Phase 2
'sql-deep-dive': [
    {
      id: 'sql_1',
      q: 'What is the difference between WHERE and HAVING, and when can you NOT use WHERE?',
      a: 'WHERE filters rows BEFORE grouping occurs; HAVING filters groups AFTER GROUP BY aggregates them. You cannot use WHERE with aggregate functions (COUNT, SUM, AVG, MAX, MIN) because the aggregation has not happened yet at the WHERE stage. Example: WHERE salary > 50000 filters individual rows. HAVING COUNT(*) > 5 filters the resulting groups.'
    },
    {
      id: 'sql_2',
      q: 'What is a window function and how does it differ from GROUP BY?',
      a: 'A window function performs a calculation across a set of rows related to the current row WITHOUT collapsing them into a single group. GROUP BY reduces N rows to fewer summary rows. Window functions keep all original rows and add a calculated column. Example: SELECT name, salary, AVG(salary) OVER (PARTITION BY department) AS dept_avg FROM employees — every row is preserved with the department average added alongside.'
    },
    {
      id: 'sql_3',
      q: 'Why is OFFSET pagination slow on large tables, and what is the alternative?',
      a: 'OFFSET N tells the database to scan and discard the first N rows before returning results. OFFSET 50000 still reads 50,000 rows — it just throws them away. At scale this is O(N). The alternative is keyset (cursor) pagination: record the last row\'s sort values (e.g., created_at + id) and use WHERE (created_at, id) < (last_seen_at, last_seen_id) to jump directly to the next page in O(log N) via the index.'
    },
    {
      id: 'sql_4',
      q: 'What is the "leftmost prefix" rule for composite indexes?',
      a: 'A composite index on columns (a, b, c) can only be used by queries that filter on a, on a+b, or on a+b+c — always starting from the leftmost column. A query filtering only on b or only on c cannot use this index. This is because B-tree indexes sort rows by the first column, then by the second within each first-column group, and so on. To serve a query on column b alone, you need a separate index on b.'
    },
    {
      id: 'sql_5',
      q: 'How do you diagnose a slow query in Postgres?',
      a: 'Run EXPLAIN (ANALYZE, BUFFERS) before the slow query. Key things to look for: "Seq Scan" on large tables means a missing index. "rows=100 actual rows=500000" means stale statistics — run ANALYZE table_name. High "Buffers: read" means disk I/O (slow). "Nested Loop" on large result sets can indicate a better join strategy exists. Use pg_stat_statements to find the slowest queries by total execution time across all calls, not just one-off EXPLAIN runs.'
    }
  ],

  'database-design': [
    {
      id: 'dbdesign_1',
      q: 'Explain 1NF, 2NF, and 3NF — what violation does each level fix?',
      a: '1NF: Every column must hold atomic (indivisible) values and every row must be unique. Violation: storing "101,102,103" (array) in a tags column. 2NF (applies to composite PKs): every non-key column must depend on the WHOLE primary key, not just part of it (no partial dependencies). Violation: a table with PK (order_id, product_id) that also stores customer_name — customer_name depends only on order_id. 3NF: every non-key column must depend directly on the primary key, not on another non-key column (no transitive dependencies). Violation: storing both zip_code and city — city depends on zip_code, not on order_id.'
    },
    {
      id: 'dbdesign_2',
      q: 'What is a many-to-many relationship and how do you model it in a relational database?',
      a: 'A many-to-many relationship exists when each row in Table A can relate to multiple rows in Table B AND each row in Table B can relate to multiple rows in Table A. Example: Students and Courses — a student takes many courses, a course has many students. You model it with a junction table (also called a bridge or associative table): CREATE TABLE enrollments (student_id UUID REFERENCES students(id), course_id UUID REFERENCES courses(id), PRIMARY KEY (student_id, course_id)). The junction table turns one many-to-many into two one-to-many relationships.'
    },
    {
      id: 'dbdesign_3',
      q: 'What are the tradeoffs between UUID and auto-increment integer as a primary key?',
      a: 'Auto-increment (SERIAL/BIGSERIAL): compact (4-8 bytes vs 16 bytes), excellent index locality (inserts always go to end of B-tree), simple. Downsides: exposes record counts, problematic in distributed systems (requires central sequence), merge conflicts between databases. UUID v4: globally unique, safe to generate client-side, no count exposure. Downside: random v4 UUIDs cause B-tree fragmentation (inserts land randomly). UUID v7 solves fragmentation with time-ordered generation. Use UUID for user-facing IDs, BIGSERIAL for internal join tables.'
    },
    {
      id: 'dbdesign_4',
      q: 'What is a foreign key ON DELETE action, and what are the options?',
      a: 'The ON DELETE action controls what happens to child rows when the referenced parent row is deleted. Options: RESTRICT (default) — prevents deletion if child rows exist, raises an error; CASCADE — automatically deletes all child rows when the parent is deleted; SET NULL — sets the FK column to NULL in child rows; SET DEFAULT — sets the FK column to its default value; NO ACTION — similar to RESTRICT but checked at end of transaction (allows circular FK resolution). Always specify an explicit ON DELETE behavior — relying on defaults leads to confusing errors in production.'
    }
  ],

  'orm-patterns': [
    {
      id: 'orm_1',
      q: 'What is the N+1 query problem? Give a concrete example.',
      a: 'N+1 occurs when fetching a list of N records executes 1 query for the list then 1 additional query per record to load related data — N+1 total queries. Example: fetch 100 blog posts (1 query), then in a loop call post.author for each one (100 queries) = 101 total queries. The fix is eager loading: include the author in the initial query using a JOIN or batched IN, so it is always 1-2 queries regardless of how many posts are returned.'
    },
    {
      id: 'orm_2',
      q: 'What is the difference between eager loading and lazy loading in an ORM?',
      a: 'Eager loading fetches related data upfront in the same query (or in a follow-up batched query) when you explicitly request it. Example: prisma.post.findMany({ include: { author: true } }). Lazy loading fetches related data only when you actually access the property on the object — looks like a simple property access in code but triggers a hidden database query. Lazy loading is convenient but makes N+1 invisible and nearly impossible to detect without query logging. Always prefer eager loading for list endpoints.'
    },
    {
      id: 'orm_3',
      q: 'When should you drop down to raw SQL instead of using ORM query methods?',
      a: 'Use raw SQL when: (1) the ORM cannot express the query efficiently or at all (complex window functions, CTEs, LATERAL joins, upserts with complex conflict resolution); (2) bulk operations — inserting 10,000 rows via ORM one-by-one is 100x slower than a single INSERT ... VALUES; (3) database-specific features like PostgreSQL NOTIFY, full-text search ranking, or COPY for bulk loads; (4) query performance is critical and the ORM-generated SQL is suboptimal. Most ORMs provide a raw query escape hatch — use it without guilt when it is the right tool.'
    },
    {
      id: 'orm_4',
      q: 'What is the DataLoader pattern and when would you use it?',
      a: 'DataLoader is a batching and caching utility that collects all .load(id) calls made during a single event loop tick and issues one batched database query (WHERE id IN (...)) instead of one query per ID. It is the standard solution for N+1 in GraphQL resolvers where you cannot statically declare what related data you need upfront — each resolver calls loader.load(parentId) and DataLoader automatically batches all calls from the same request into one query. It also deduplicates identical IDs within a request.'
    }
  ],

  'nosql-deep': [
    {
      id: 'nosql_1',
      q: 'What is the difference between embedding and referencing in MongoDB? When do you use each?',
      a: 'Embedding means nesting a related document inside the parent document (e.g., order line items inside an order document). Best when: data is always accessed together, the array is bounded in size, the child is "owned" by the parent, and you want atomic updates. Referencing means storing an ID and using $lookup (like a JOIN) to fetch related data separately. Best when: related data is large or unbounded (a user\'s thousands of comments), data is accessed independently, or the same data is referenced from multiple parents (many-to-many).'
    },
    {
      id: 'nosql_2',
      q: 'How does DynamoDB\'s partition key and sort key work together?',
      a: 'The partition key determines which physical server/partition stores the item — DynamoDB hashes it to route requests. All items with the same partition key are stored together and can be queried together. The sort key organizes items within a partition — you can use range conditions (BETWEEN, begins_with) on it. A common pattern: PK = USER#userId, SK = ORDER#orderId allows one Query to return all orders for a user sorted by order ID. You must define all access patterns upfront and design your keys to serve them — there is no ad-hoc filtering like SQL\'s WHERE clause.'
    },
    {
      id: 'nosql_3',
      q: 'When would you choose MongoDB over PostgreSQL?',
      a: 'Choose MongoDB when: your data is genuinely document-shaped with variable or unpredictable schemas (product catalogs with different attributes per category, CMS content types); you need to store and query deeply nested hierarchical data that maps naturally to JSON; you are prototyping quickly and schema flexibility reduces iteration time. Choose PostgreSQL for: structured relational data with complex queries, financial data requiring ACID transactions, anything with many-to-many relationships that benefit from JOINs. Note: PostgreSQL\'s JSONB column type gives you document flexibility within a relational database, often making the choice unnecessary.'
    },
    {
      id: 'nosql_4',
      q: 'What is the CAP theorem and which properties does MongoDB sacrifice vs. guarantee?',
      a: 'CAP theorem states a distributed system can only guarantee two of three properties simultaneously: Consistency (all nodes see the same data at the same time), Availability (every request gets a response), and Partition Tolerance (system works despite network partitions between nodes). MongoDB prioritizes Consistency and Partition Tolerance (CP). During a network partition, MongoDB will refuse writes to maintain consistency rather than allow potentially inconsistent writes. This means MongoDB can become temporarily unavailable during network issues — an acceptable tradeoff for most use cases that need reliable data.'
    }
  ],

  'redis-patterns': [
    {
      id: 'redis_1',
      q: 'How would you implement a real-time leaderboard using Redis? What data structure and commands?',
      a: 'Use a Sorted Set (ZSET). The member is the user ID and the score is the user\'s point total. Commands: ZADD leaderboard 1500 "user:42" (add/update score), ZINCRBY leaderboard 100 "user:42" (increment score atomically), ZREVRANGE leaderboard 0 9 WITHSCORES (top 10 players with scores), ZREVRANK leaderboard "user:42" (get a user\'s rank, 0-indexed). Sorted Sets maintain O(log N) insertion and ranking — perfect for leaderboards that update constantly under high concurrency.'
    },
    {
      id: 'redis_2',
      q: 'What is a cache stampede and how do you prevent it?',
      a: 'A cache stampede (also called "thundering herd") happens when a popular cached key expires simultaneously, causing hundreds or thousands of requests to all miss the cache and simultaneously query the database to rebuild it — overwhelming the DB and making response times spike. Prevention strategies: (1) Probabilistic early expiration — randomly refresh the cache slightly before it expires; (2) Distributed lock — the first request to miss the cache acquires a lock and rebuilds it, other requests wait for the lock to release and then read the newly populated cache; (3) Background refresh — a scheduled job refreshes the cache before expiry so it never truly expires under traffic.'
    },
    {
      id: 'redis_3',
      q: 'What is the difference between Redis Pub/Sub and Redis Streams?',
      a: 'Pub/Sub is fire-and-forget: messages are broadcast to all current subscribers but NOT persisted — if a subscriber is offline when a message is published, it is lost forever. Streams (added in Redis 5.0) are a persistent, ordered log: messages are stored and can be consumed by consumer groups with acknowledgment, replayed from any point, and processed at-least-once even if the consumer crashes. Use Pub/Sub for ephemeral real-time events (live dashboard updates, chat). Use Streams for durable event processing where message loss is unacceptable (order events, audit logs).'
    },
    {
      id: 'redis_4',
      q: 'How do you implement a distributed lock in Redis? What is the correct atomic command?',
      a: 'The correct command is: SET lock_key unique_value NX EX 30 — this atomically sets the key only if it does not exist (NX) with a 30-second expiration (EX). The unique_value (e.g., a UUID) identifies the lock owner so only the holder can release it. To release: use a Lua script that checks the value matches before deleting (prevents accidental release of someone else\'s lock). Never use SETNX + EXPIRE as two separate commands — there is a race condition if the process crashes between the two commands, leaving the lock without an expiration (permanent deadlock).'
    },
    {
      id: 'redis_5',
      q: 'Why should you never use KEYS * in production Redis, and what is the alternative?',
      a: 'Redis is single-threaded for command processing. KEYS * scans every key in the database synchronously, blocking ALL other Redis commands for the entire duration. On an instance with 1 million keys, this can take seconds — during which every other client request times out. The alternative is SCAN cursor MATCH pattern COUNT 100 — it iterates the keyspace in small increments, returning a cursor each call. Multiple SCAN calls may return some keys multiple times, but it never blocks for more than a few milliseconds. Always use SCAN in loops for any key enumeration operation in production.'
    }
  ],

  'database-transactions': [
    {
      id: 'tx_1',
      q: 'Explain the four ACID properties with a concrete example of what breaks if each is violated.',
      a: 'Atomicity: all operations succeed or all are rolled back. Violation: money deducted from account A but power cut before crediting account B — money disappears. Consistency: the database moves from one valid state to another. Violation: a transaction reduces inventory to -5, violating a CHECK constraint. Isolation: concurrent transactions do not interfere with each other. Violation: two threads both read balance=$100, both deduct $80, account goes to $20 instead of failing (lost update). Durability: committed data survives crashes. Violation: database confirms a write but power failure before flushing WAL means data is lost on restart.'
    },
    {
      id: 'tx_2',
      q: 'What is the difference between READ COMMITTED and REPEATABLE READ isolation levels?',
      a: 'READ COMMITTED (default in Postgres/Oracle): each individual SQL statement within a transaction sees the latest committed data at the moment that statement executes. Two reads of the same row within one transaction can return different values if another transaction commits in between (non-repeatable read). REPEATABLE READ: all reads within a transaction see a consistent snapshot taken at the start of the transaction. A second read of the same row always returns the same value regardless of concurrent commits. REPEATABLE READ prevents non-repeatable reads but in some databases may still allow phantom reads (new rows added by others appearing in range queries). Postgres\'s REPEATABLE READ implementation prevents phantoms too.'
    },
    {
      id: 'tx_3',
      q: 'What is SELECT FOR UPDATE and when do you need it?',
      a: 'SELECT FOR UPDATE acquires a row-level exclusive lock on the selected rows at read time, preventing any other transaction from updating or locking those rows until the current transaction commits or rolls back. You need it when you have a "read-then-write" pattern where the write depends on the value you just read — the classic example is deducting inventory or transferring money. Without FOR UPDATE, two concurrent transactions can both read the same balance, both determine "there is enough to proceed," and both deduct — causing the balance to go negative. FOR UPDATE serializes access so only one transaction proceeds at a time.'
    },
    {
      id: 'tx_4',
      q: 'What causes a deadlock and how do you prevent and handle it?',
      a: 'A deadlock occurs when Transaction A holds Lock 1 and waits for Lock 2, while Transaction B holds Lock 2 and waits for Lock 1 — both wait forever. Prevention: always acquire locks in a consistent order across all transactions (e.g., always lock the lower user_id before the higher one). Handling: the database automatically detects deadlocks and aborts one transaction with an error (Postgres error code 40P01). Your application must catch this error and retry the transaction. Implement retry with exponential backoff — deadlocks are expected and recoverable, not exceptional errors that should crash the request.'
    }
  ],

  'full-text-search': [
    {
      id: 'fts_1',
      q: 'How does PostgreSQL full-text search work internally (tsvector, tsquery, GIN)?',
      a: 'tsvector is the pre-processed searchable form of a document: text is tokenized (split into words), stemmed (running → run), stop words removed (the, a), and stored as a list of lexemes with position info. tsquery is the processed form of a search query (same stemming/normalization). The @@ operator checks if a tsquery matches a tsvector. GIN (Generalized Inverted Index) indexes a tsvector column by creating an inverted index: for each lexeme, it stores the list of rows containing that lexeme. This enables O(log n) lookup rather than scanning every row. ts_rank() scores matches by term frequency and proximity to rank results by relevance.'
    },
    {
      id: 'fts_2',
      q: 'What is the difference between to_tsquery and websearch_to_tsquery in Postgres?',
      a: 'to_tsquery requires properly formatted query syntax: operators like & (AND), | (OR), ! (NOT), and <-> (phrase). Raw user input will throw errors on special characters. websearch_to_tsquery parses natural language input — it handles user-typed search strings like "web development" (treats spaces as AND, quotes as phrases, minus as NOT) and never throws errors on malformed input. Always use websearch_to_tsquery for user-facing search inputs and to_tsquery / phraseto_tsquery for programmatic queries where you control the format.'
    },
    {
      id: 'fts_3',
      q: 'When would you use Elasticsearch instead of PostgreSQL FTS?',
      a: 'Choose Elasticsearch when you need: (1) Relevance tuning — custom boosting, field weights, synonym dictionaries, and complex scoring models; (2) Autocomplete / search-as-you-type — edge n-gram analyzers for prefix completion; (3) Faceted search with aggregations — counts by category, date histogram, numeric ranges; (4) Scale beyond PostgreSQL\'s single-node limits — Elasticsearch shards horizontally across many nodes; (5) Multi-language support with per-language analyzers. Start with Postgres FTS — it handles most use cases with zero extra infrastructure. Graduate to Elasticsearch when FTS limitations become real pain points.'
    },
    {
      id: 'fts_4',
      q: 'How do you keep an Elasticsearch index in sync with your primary database?',
      a: 'The standard approach is "dual write with async sync": (1) Postgres is the source of truth for all writes; (2) After writing to Postgres, publish an event (via a message queue, Postgres NOTIFY/listen, or outbox pattern) that triggers an Elasticsearch index update; (3) A worker consumes the event and updates the ES document. Alternatively, use Change Data Capture (CDC) — tools like Debezium read Postgres WAL logs and publish every row change to Kafka, which ES connectors consume. For simpler setups, a periodic bulk reindex (full rebuild from DB every N minutes) works for non-critical near-real-time search.'
    }
  ],

  'data-migrations': [
    {
      id: 'migrate_1',
      q: 'Explain the expand-contract pattern. Walk through renaming a column without downtime.',
      a: 'The expand-contract (parallel change) pattern makes schema changes across 3 deployments: Phase 1 (Expand): add the new column display_name alongside the existing full_name. Backfill display_name = full_name for all existing rows. Deploy code that writes to BOTH columns. Phase 2 (Migrate): deploy code that reads from display_name (new column). Both columns still exist and are being written. Phase 3 (Contract): once 100% of traffic uses the new code, drop the old full_name column. At no point is there a window where code expects a column that does not exist.'
    },
    {
      id: 'migrate_2',
      q: 'How do you safely backfill a new column on a 100-million-row table without impacting production?',
      a: 'Never run UPDATE on all 100M rows in a single statement — this creates one massive transaction that holds row locks for minutes, blocking all production writes on those rows. Instead, process in small batches: loop through IDs in chunks of 1,000-10,000 rows, run a targeted UPDATE with a WHERE id BETWEEN batch_start AND batch_end clause, then sleep 50-100ms between batches to give other transactions time to proceed. Run this during off-peak hours. Monitor replication lag and slow down or pause if the replica falls behind. The backfill may take hours — that is fine as long as production traffic is unaffected.'
    },
    {
      id: 'migrate_3',
      q: 'What is the difference between CREATE INDEX and CREATE INDEX CONCURRENTLY in Postgres?',
      a: 'CREATE INDEX acquires a ShareLock on the table that blocks all writes (INSERT, UPDATE, DELETE) for the entire duration of the index build. On a large table this can take minutes or hours. CREATE INDEX CONCURRENTLY builds the index without blocking writes — it scans the table multiple times while allowing normal traffic. It takes longer to complete and uses more resources, but the table remains fully writable throughout. CONCURRENTLY can fail if a duplicate violation is detected during the build (the index is created but marked invalid — check pg_indexes for indisvalid). Always use CONCURRENTLY for index creation on production tables with live traffic.'
    },
    {
      id: 'migrate_4',
      q: 'What should you do before running a migration on a production database?',
      a: 'Before running in production: (1) Test on a production-sized data copy — restore a recent backup to a staging environment; migrations that take 200ms in development may take 45 minutes on real data. (2) Measure lock duration — use EXPLAIN to estimate, and test that CONCURRENTLY flags are used correctly. (3) Write a rollback plan — document exact SQL to reverse the migration and verify the down migration works. (4) Check for long-running transactions before running — use SELECT pid, query, now() - query_start AS duration FROM pg_stat_activity WHERE state != \'idle\' to identify transactions that would block your migration. (5) Schedule during lowest-traffic period and alert the team.'
    }
  ],

  // Phase 3
'load-balancing': [
    {
      id: 'lb_1',
      q: 'What is the difference between Layer 4 and Layer 7 load balancing?',
      a: 'Layer 4 (Transport) operates on IP/TCP/UDP — it sees source/destination address and port but not the HTTP content. It is faster but cannot make content-based routing decisions. Layer 7 (Application) terminates the TCP connection, inspects the full HTTP request (headers, URL, body), makes a routing decision, then opens a new connection to the backend. Layer 7 enables routing /api/* to API servers and /static/* to asset servers, but costs more CPU. AWS NLB is Layer 4; AWS ALB is Layer 7.'
    },
    {
      id: 'lb_2',
      q: 'What are sticky sessions, why are they used, and why are they an anti-pattern?',
      a: 'Sticky sessions (session affinity) route a client to the same backend server on every request, typically via a cookie or IP hash. They are used to support stateful server-side sessions (e.g., in-memory session data) without shared state. They are an anti-pattern because: (1) a server failure drops all its pinned users, (2) they create uneven load distribution, (3) they prevent true horizontal scaling. The correct fix is to externalize session state to Redis so any server can handle any request.'
    },
    {
      id: 'lb_3',
      q: 'Explain the Least Connections algorithm and when it is better than Round Robin.',
      a: 'Least Connections routes each new request to the server with the fewest currently active connections. Round Robin rotates through servers evenly, ignoring current load. Least Connections is better when request durations vary significantly — for example, if some requests take 5ms and others take 5 seconds, Round Robin sends the same number of requests to each server regardless of whether it is busy. Least Connections naturally load-balances based on actual server utilization.'
    },
    {
      id: 'lb_4',
      q: 'What is connection draining (deregistration delay) in a load balancer?',
      a: 'Connection draining is a grace period when a backend server is being removed from a load balancer. Instead of immediately closing existing connections, the load balancer stops routing new requests to that server but allows in-flight requests to complete (typically for 30-300 seconds). This enables zero-downtime deployments and graceful scale-in operations. Without it, removing a server mid-request causes errors for active users. AWS ALB calls this "deregistration delay."'
    },
    {
      id: 'lb_5',
      q: 'What is consistent hashing and why is it valuable in a load balancing context?',
      a: 'Consistent hashing maps both servers and request keys (e.g., URLs, user IDs) onto a circular ring. A request routes to the nearest server clockwise on the ring. When a server is added or removed, only the keys mapped to that server\'s arc are remapped — all other keys remain on their existing servers. In a cache cluster, this means adding one server invalidates only ~1/N of cached keys instead of all of them. Standard modulo-based hashing (key % N) remaps virtually everything when N changes.'
    }
  ],

  'horizontal-scaling': [
    {
      id: 'hs_1',
      q: 'What does "stateless" mean for a web service, and why does statelessness enable horizontal scaling?',
      a: 'A stateless service stores no client-specific state in local memory or disk between requests. Each request contains all information needed to process it (or references external state like a database/Redis). This enables horizontal scaling because any server instance can handle any request — there is no affinity between a client and a specific server. You can add or remove instances freely, and instance failures do not affect other users. If any instance holds unique state, losing that instance loses that state, and load balancing becomes complex.'
    },
    {
      id: 'hs_2',
      q: 'You have an in-memory rate limiter in your Node.js app. You scale to 10 instances. What breaks?',
      a: 'Each instance maintains its own in-memory counter. A user can make 100 requests to each of the 10 instances, for an effective rate of 1,000 requests instead of the intended 100. The rate limiter is silently broken. Fix: store rate limit counters in a shared external store (Redis) using atomic operations (INCR) so all instances share the same counter. This applies to any per-user or per-IP state: sessions, counters, locks — all must be external for horizontal scaling to work correctly.'
    },
    {
      id: 'hs_3',
      q: 'A cron job sends a daily digest email. After scaling to 5 instances, users receive 5 emails. How do you fix this?',
      a: 'Use a distributed lock. Before running the job, attempt to acquire a Redis lock with SET key instanceId NX EX 300 (atomic: only sets if not already exists, with 5-minute expiry). Only the instance that successfully sets the key runs the job; the others see the key exists and skip. Release the lock using a Lua script to ensure only the owner releases it. Alternatively, use a dedicated scheduler (Kubernetes CronJob, AWS EventBridge) that runs the job in a separate single process rather than on all app instances.'
    },
    {
      id: 'hs_4',
      q: 'What is graceful shutdown and why is it important for horizontally scaled services?',
      a: 'Graceful shutdown is the process of allowing a service to finish handling in-flight requests before exiting, rather than terminating abruptly. When an auto-scaler or deploy system sends SIGTERM, the server should: (1) stop accepting new connections, (2) return 503 on health checks so the load balancer stops routing new traffic, (3) wait for all in-progress requests to complete, (4) close database connections and flush buffers, then exit. Without graceful shutdown, requests in flight at scale-in time return errors, causing transient 500s during deployments and scale-in events.'
    },
    {
      id: 'hs_5',
      q: 'What is the difference between vertical scaling and horizontal scaling? What are the limits of each?',
      a: 'Vertical scaling (scaling up) means making a single machine more powerful — more CPU, RAM, faster disk. It is simpler (no code changes) but has hard physical limits (you cannot buy an infinitely large server), is expensive at high specs, and leaves a single point of failure. Horizontal scaling (scaling out) means adding more machine instances. It has virtually no theoretical upper limit and provides redundancy. The requirement is that the application must be stateless (or state must be external) so any instance can handle any request. Most modern cloud architectures favor horizontal scaling with stateless services.'
    }
  ],

  'message-queues': [
    {
      id: 'mq_1',
      q: 'What are the three message delivery guarantees, and what does each require from consumers?',
      a: 'At-most-once: message sent once, may be lost if delivery fails. No consumer action needed — but no data loss protection. At-least-once: message redelivered if consumer fails to acknowledge. Consumers MUST be idempotent — processing the same message twice must produce the same result as processing it once (use idempotency keys). Exactly-once: delivered and processed exactly once. Requires coordination (Kafka transactions, SQS FIFO with deduplication IDs). Hardest to achieve; adds complexity and reduces throughput. Most production systems use at-least-once with idempotent consumers.'
    },
    {
      id: 'mq_2',
      q: 'When would you choose Kafka over SQS or RabbitMQ?',
      a: 'Choose Kafka when you need: (1) Event replay — Kafka retains messages for days/weeks; you can re-process historical events. (2) Multiple independent consumer groups — each group reads the full stream independently without affecting others. (3) Event sourcing — the Kafka log is the source of truth; state is derived by replaying the log. (4) High-throughput streaming — Kafka handles millions of messages/second. (5) Ordered delivery at scale — partition keys guarantee order within a partition. Use SQS/RabbitMQ for simpler task queues where you just need work distributed to workers and don\'t need replay or multiple consumers.'
    },
    {
      id: 'mq_3',
      q: 'What is a Dead Letter Queue (DLQ) and why is it essential?',
      a: 'A DLQ is a separate queue where messages are sent after failing to be processed N times. Without a DLQ, a "poison message" (one that always causes the consumer to crash or error) will be redelivered indefinitely, blocking other messages from being processed. With a DLQ, after 3-5 failed attempts the message is moved to the DLQ, processing of the main queue continues, and the failing message is preserved for manual inspection and debugging. Always configure a DLQ on every queue and set an alert on DLQ message count > 0.'
    },
    {
      id: 'mq_4',
      q: 'Explain the Outbox Pattern. What problem does it solve?',
      a: 'The Outbox Pattern solves the dual-write problem: writing to a database AND publishing to a message queue are two separate operations that can fail independently, leaving them out of sync. Solution: in the same database transaction that writes your business data, also write the event to an "outbox" table. A separate relay process reads the outbox table and publishes events to the message broker, marking them as published on success. This guarantees that if the DB write succeeds, the event will eventually be published — and if the DB write fails, neither the data nor the event is persisted. Atomic local transaction + eventual message publication.'
    },
    {
      id: 'mq_5',
      q: 'What is the SQS visibility timeout and what happens if it is set too short?',
      a: 'When a consumer receives an SQS message, it becomes invisible to other consumers for the visibility timeout duration (default 30 seconds). The consumer must process the message and delete it before the timeout expires. If the timeout is too short and processing takes longer than expected, the message becomes visible again and other consumers pick it up — causing duplicate processing. Set the visibility timeout to at least 1.5× your maximum expected processing time. Extend the visibility timeout dynamically for long jobs using ChangeMessageVisibility. Always pair with idempotent consumers to handle the unavoidable duplicates from at-least-once delivery.'
    }
  ],

  'websockets-sse': [
    {
      id: 'ws_1',
      q: 'What is the WebSocket handshake and how does a WebSocket connection differ from HTTP?',
      a: 'A WebSocket connection starts as an HTTP GET with the headers Upgrade: websocket and Sec-WebSocket-Key. The server responds with HTTP 101 Switching Protocols and Sec-WebSocket-Accept (a SHA1 hash of the key + a magic GUID). After this, the connection is no longer HTTP — it becomes a raw TCP socket where both parties send framed binary/text messages at any time without request/response cycles. Unlike HTTP, the connection persists until explicitly closed. Both client and server can initiate messages independently. This makes WebSocket ideal for real-time bidirectional communication: chat, gaming, collaborative editing, live dashboards.'
    },
    {
      id: 'ws_2',
      q: 'You have 3 WebSocket server instances. User A (connected to server 1) sends a message to User B (connected to server 3). How do you deliver it?',
      a: 'Use Redis pub/sub as a message bus between servers. When User A sends a message, server 1 publishes it to a Redis channel (e.g., user:B:messages). All three servers subscribe to relevant channels. Server 3 receives the Redis message and delivers it to User B\'s WebSocket connection. Socket.IO\'s Redis Adapter implements this pattern automatically. The key insight: each server only knows about connections on its own instance, but Redis pub/sub creates a shared communication layer across all instances without requiring sticky sessions.'
    },
    {
      id: 'ws_3',
      q: 'Why do WebSocket connections drop when sitting idle behind a proxy, and how do you prevent it?',
      a: 'Many proxies, load balancers, and firewalls have idle connection timeout policies (typically 60-90 seconds). A WebSocket connection with no messages appears "idle" and gets silently terminated by the proxy. The client does not discover the connection is dead until it tries to send a message. Prevention: implement application-level heartbeats — send a WebSocket ping frame every 25-30 seconds from server to client. The client\'s WebSocket library responds with a pong frame automatically. If no pong is received within a timeout window, the connection is terminated intentionally. This also keeps the TCP connection alive through NAT tables.'
    },
    {
      id: 'ws_4',
      q: 'When would you choose SSE over WebSockets?',
      a: 'Choose SSE when the communication is one-directional: server sends data to clients, but clients do not send data back over the same channel. SSE advantages: built on HTTP/1.1 — works through standard HTTP proxies without special configuration; automatic browser reconnection with last-event-ID resume; simpler to implement (just a chunked HTTP response); works with HTTP/2 multiplexing. WebSocket advantages: bidirectional (both parties can send at any time), lower per-message overhead after handshake, supports binary frames natively. Use SSE for: live notifications, dashboards, progress feeds. Use WebSocket for: chat, collaborative editing, live gaming.'
    },
    {
      id: 'ws_5',
      q: 'How do you authenticate a WebSocket connection?',
      a: 'Standard HTTP cookie authentication works for WebSocket upgrades if the cookie is set on the same domain (browser sends cookies on the initial HTTP Upgrade request). More commonly for APIs: pass a JWT as a query parameter in the WebSocket URL (wss://api.example.com/ws?token=xxx). Validate the token in the connection handler before allowing the upgrade to complete. If invalid, close with code 1008 (Policy Violation). Do NOT rely on headers sent after the handshake — validate authentication before the WebSocket is established. For reconnects, require re-authentication or use short-lived tokens.'
    }
  ],

  'rate-limiting-deep': [
    {
      id: 'rl_1',
      q: 'What is the boundary attack on a fixed window rate limiter and which algorithm prevents it?',
      a: 'The fixed window counter resets at a hard boundary (e.g., every minute at :00). An attacker can send 100 requests at :59 (end of window 1) and 100 requests at :01 (start of window 2) — effectively 200 requests in 2 seconds while staying under the 100/minute limit. The sliding window counter prevents this: it calculates the request count over a continuously moving window of the last N seconds, eliminating boundary spikes. The sliding window counter approximation (used in practice) weights the current and previous window counts by how much of the window each covers, giving an O(1) memory accurate approximation.'
    },
    {
      id: 'rl_2',
      q: 'How does a token bucket differ from a leaky bucket, and what use case suits each?',
      a: 'Token Bucket: tokens accrue in a bucket at a fixed rate (up to a maximum). Each request consumes tokens. If tokens are available, requests are served immediately — including bursts up to the bucket size. Use for: APIs that want to allow short bursts but enforce a long-term average rate. Leaky Bucket: requests enter a queue and are processed at a constant rate regardless of input rate — bursts are smoothed into a steady output stream. Use for: traffic shaping (ensuring downstream systems receive a constant rate), not just limiting. Token bucket allows bursting; leaky bucket smooths it away.'
    },
    {
      id: 'rl_3',
      q: 'Why must a distributed rate limiter use atomic Redis operations, and how do you achieve this?',
      a: 'A non-atomic check-then-increment has a race condition: two requests simultaneously read count=99, both pass the limit check, both increment to 100 — but two requests got through when only one should have. With N concurrent servers, this race is nearly guaranteed under load. Atomicity guarantees the check and increment happen as a single indivisible operation. Achieve atomicity with: (1) Redis Lua scripts — the entire script runs atomically on a single Redis server, no other commands can interleave. (2) Redis INCR command — the increment and return is inherently atomic. Combine INCR with EXPIRE in a Lua script to avoid the separate EXPIRE race as well.'
    },
    {
      id: 'rl_4',
      q: 'What HTTP headers should a rate-limited API return and why?',
      a: 'Include rate limit metadata on every response (not just 429s) so clients can implement proactive backoff: X-RateLimit-Limit (maximum requests allowed in the window), X-RateLimit-Remaining (requests remaining in the current window), X-RateLimit-Reset (Unix timestamp when the window resets and remaining resets to limit). On 429 Too Many Requests: Retry-After (seconds to wait before retrying — required for correct client behavior). Without Retry-After, clients without custom backoff immediately retry, creating a thundering herd that re-triggers the rate limit instantly and amplifies load.'
    },
    {
      id: 'rl_5',
      q: 'Your API allows 100 requests/minute per user. A large enterprise user is hitting the limit, but their usage is legitimate. How do you handle this architecturally?',
      a: 'Implement tiered rate limits keyed to the user\'s subscription tier stored in the user record or API key metadata. For example: free tier = 100 req/min, pro = 1000 req/min, enterprise = 10,000 req/min or unlimited. At request time, look up the user\'s tier to determine their limit (cache this lookup in Redis or a local cache to avoid DB hits on every request). For enterprise customers with unique traffic patterns (batch jobs, high-volume integrations), consider separate rate limit dimensions: requests/minute for interactive use and a separate daily quota for batch. Document limits clearly in your API and surface remaining quota in response headers.'
    }
  ],

  'circuit-breaker': [
    {
      id: 'cb_1',
      q: 'Describe the three states of a circuit breaker and the events that cause transitions.',
      a: 'CLOSED (normal): requests pass through to the remote service. Failure rate is tracked in a rolling window. Transition to OPEN when failure rate exceeds threshold (e.g., 50% in last 10 requests). OPEN (tripped): requests are blocked immediately — no calls to the remote service. A fallback is returned instead. After a configured wait time (e.g., 30 seconds), transitions to HALF_OPEN. HALF_OPEN (probing): a limited number of test requests are allowed through to check if the remote service has recovered. If probes succeed → CLOSED. If any probe fails → OPEN again with reset timer.'
    },
    {
      id: 'cb_2',
      q: 'How does a circuit breaker prevent cascading failures in a microservices chain?',
      a: 'In a chain A → B → C, if C becomes slow, B\'s threads block waiting for C. A\'s threads block waiting for B. Without circuit breakers, thread pools in both A and B exhaust — all services stop handling any requests, even ones that don\'t involve C. With circuit breakers: after C fails consistently, B\'s breaker for C opens and immediately returns a fallback instead of waiting. A gets a fast response (or fallback) from B instead of hanging. Thread pools in A and B remain free to handle other requests. The failure is contained at the B→C boundary and does not propagate further.'
    },
    {
      id: 'cb_3',
      q: 'What is the difference between a retry and a circuit breaker? Why do you need both?',
      a: 'Retries handle transient failures: a request fails once but the remote service is generally healthy — retrying succeeds. They are optimistic about service availability. Circuit breakers handle sustained failures: the remote service is persistently unhealthy — continuing to call it wastes resources and delays your response. They are pessimistic and fail fast. You need both: retries recover from transient glitches (network blip, brief overload) while circuit breakers protect you from sustained outages. Without circuit breakers, retries under a prolonged outage make things worse — each caller retries 3 times, tripling the already-failing load on the downstream service.'
    },
    {
      id: 'cb_4',
      q: 'What is the bulkhead pattern and how does it complement a circuit breaker?',
      a: 'The bulkhead pattern isolates resources (connection pools, thread pools, semaphores) per downstream dependency. If the payment service is slow and consuming all 100 threads, the inventory service (in a separate thread pool of 50 threads) is unaffected. Without bulkheads, one slow dependency exhausts shared resources and takes down the entire application even before the circuit breaker trips. With bulkheads, each service has bounded resource consumption — even if the circuit breaker hasn\'t tripped yet, the blast radius of a slow service is contained to its own resource pool.'
    },
    {
      id: 'cb_5',
      q: 'What should a circuit breaker fallback return for a payment processing call?',
      a: 'The fallback should provide the best possible degraded experience rather than simply throwing an error. For payment processing: (1) Queue the charge for asynchronous processing — save the payment request to a database, return a "payment pending" status to the user, and process it once the payment service recovers. This requires idempotency keys to prevent double charges when the queued payment is retried. (2) If queueing is not acceptable for the business case, return a clear user-facing error with a retry button and do not charge the user. The key principle: the fallback is intentional degraded behavior, not an unhandled exception.'
    },
    { id: 'cb_6', q: 'Circuit breaker opened but the downstream service recovered and it stays open. Why?', a: 'The resetTimeout has not elapsed yet, or the half-open test request also failed (perhaps the service is intermittently recovering). Check your resetTimeout value — if set too high, recovery is slow. Also ensure your health-check probe in half-open state is lightweight and representative of real traffic, not a heavier operation that hits a different timeout.' },
    { id: 'cb_7', q: 'Circuit Breaker vs Bulkhead: what is the difference?', a: 'Circuit Breaker detects failure and stops sending requests to a degraded service. Bulkhead isolates resources (thread pools, connection pools) for different services so one service\'s failure cannot consume all resources and affect other callers. Use both: bulkheads limit blast radius, circuit breakers stop sending traffic to failing services.' },
    { id: 'cb_8', q: 'What metrics should you monitor for a circuit breaker in production?', a: 'Circuit state transitions (open/close events — each open is an incident indicator). Failure rate per time window. Fallback invocation rate. Success rate in half-open state. Request volume to distinguish meaningful failure rates from noise (a 50% failure rate on 2 requests is not significant). Alert on any circuit opening.' }
  ],

  'cdn-edge': [
    {
      id: 'cdn_1',
      q: 'How does a CDN work at a technical level? What is a PoP?',
      a: 'A CDN is a globally distributed network of servers. PoP (Point of Presence) is a CDN data center in a specific geographic location (e.g., Frankfurt, Singapore, São Paulo). When a user requests a resource, DNS resolves the CDN domain to the nearest PoP via Anycast routing or GeoDNS. The edge server checks its cache: hit → serve immediately from local cache (<20ms latency). Miss → the edge server fetches from the origin server, caches the response according to Cache-Control headers, then serves the user. Subsequent requests from the same region hit the cache. This reduces origin load and dramatically lowers latency for global users.'
    },
    {
      id: 'cdn_2',
      q: 'What Cache-Control headers should a production app set for: a hashed JS bundle, an HTML index file, and an authenticated API endpoint?',
      a: 'Hashed JS bundle (e.g., main.abc123.js): Cache-Control: public, max-age=31536000, immutable — cache for 1 year permanently. The hash in the filename means the URL changes when content changes, so the old cached version is never stale; it simply becomes unused. HTML index file: Cache-Control: public, max-age=300, stale-while-revalidate=3600 — short cache (5 minutes), allow stale delivery while background revalidation happens. Must be short because it references hashed asset filenames that change on deploy. Authenticated API endpoint: Cache-Control: private, no-store — never cache at CDN or any shared cache; each user\'s response is personal and must come from origin.'
    },
    {
      id: 'cdn_3',
      q: 'What are surrogate keys (cache tags) and why are they useful for cache invalidation?',
      a: 'Surrogate keys (called Cache-Tag in Cloudflare, Surrogate-Key in Fastly) are metadata tags attached to cached responses. A response can have multiple tags (e.g., article-42, author-7, category-sports). When content changes, you call the CDN API to invalidate by tag — all cached objects with that tag are purged simultaneously, regardless of URL. This solves the "purge all pages that show article 42" problem, which would otherwise require knowing and purging every URL that renders that article (homepage, category page, author page, article page). One tag purge call invalidates all of them atomically.'
    },
    {
      id: 'cdn_4',
      q: 'What is edge computing and how does it differ from traditional CDN caching?',
      a: 'Traditional CDN: serves static cached content from servers close to users — purely data delivery, no computation. Edge computing: runs application code (JavaScript, WebAssembly) at the same globally distributed PoPs. Edge code can: inspect and modify requests/responses, perform authentication (JWT validation), run A/B tests, personalize content, fetch from edge key-value stores, make decisions based on geolocation — all within 50ms of every user globally without a round-trip to the origin. Examples: Cloudflare Workers (V8 isolates), AWS Lambda@Edge (Node.js), Fastly Compute@Edge. The shift: from "cache and serve data" to "compute close to users."'
    },
    {
      id: 'cdn_5',
      q: 'What is a CDN cache stampede and how do CDNs prevent it?',
      a: 'A cache stampede (also called thundering herd) occurs when a popular cached object expires and thousands of simultaneous requests all miss the cache and hit the origin at once — potentially overwhelming it. CDN prevention strategies: (1) Request collapsing (coalescing): when the cache misses, the CDN holds all pending requests for that URL and makes only ONE request to the origin. All waiting requests receive the same response. (2) Stale-while-revalidate: serve the stale cached response to the user immediately while one background request revalidates it from origin — no stampede and no latency spike. (3) Proactive cache warming: pre-populate caches before they expire using CDN APIs.'
    }
  ],

  'connection-pooling': [
    {
      id: 'cp_1',
      q: 'What is connection pooling and why is it essential for database-backed web services?',
      a: 'Connection pooling maintains a set of pre-established database connections that requests borrow and return, rather than creating a new connection for each request. Opening a database connection involves TCP handshake, TLS negotiation, and authentication — taking 20-100ms. Without pooling, a service handling 1,000 req/s would spend 20-100 seconds per second just on connection setup — impossible. A pool of 10 connections can serve thousands of short queries per second because connections are reused. The pool handles queuing when all connections are in use and destroys unhealthy connections automatically.'
    },
    {
      id: 'cp_2',
      q: 'How do you determine the right max pool size for a PostgreSQL connection pool?',
      a: 'The HikariCP formula (widely applicable): max_pool_size = (num_cpu_cores * 2) + 1. For a 4-core Postgres server: 9 connections. This counterintuitive small number is because Postgres connections are CPU-bound at execution time — too many concurrent queries cause CPU contention and lock contention that slows everything down. Empirically: load test with increasing pool sizes and find where throughput peaks and latency stabilizes. Also consider: total connections = instances × pool.max must be less than Postgres\'s max_connections (default 100). With 10 app instances, pool.max = 10 each → 100 total, right at the Postgres limit → add PgBouncer.'
    },
    {
      id: 'cp_3',
      q: 'What is a connection leak and how do you detect and prevent one?',
      a: 'A connection leak occurs when a connection is acquired from the pool but never returned — typically from a code path that returns early, throws an exception, or forgets to release the connection. Over time, all pool connections are leaked and new requests queue forever or timeout. Detection: monitor pool.waitingCount and pool.idleCount — if idleCount trends toward zero and waitingCount grows, you have a leak. Enable pg-pool\'s allowExitOnIdle: false and log connection creation/destruction to spot asymmetry. Prevention: always release connections in a finally block, or use query builder APIs (knex, pg\'s Pool.query()) that handle connection lifecycle automatically.'
    },
    {
      id: 'cp_4',
      q: 'What is PgBouncer and when would you use it instead of relying only on application-level pooling?',
      a: 'PgBouncer is a dedicated PostgreSQL connection pooler that sits between application servers and Postgres. It multiplexes many application connections into a smaller number of actual Postgres server connections. Use it when: you have many application instances each with their own pool (10 instances × pool.max=20 = 200 connections, exceeding Postgres max_connections). Postgres connections are expensive — each holds 8-10MB RAM. PgBouncer in transaction mode allows thousands of app connections with only 20-50 server connections. Use application-level pooling (pg.Pool) alongside PgBouncer — they serve different purposes: app pool reduces connection overhead per process; PgBouncer reduces total server-side connections across all instances.'
    },
    {
      id: 'cp_5',
      q: 'What happens to queued database requests when your database server goes down and then recovers?',
      a: 'During the outage, the pool\'s health checks detect dead connections and mark the pool as depleted. New requests queue at the connectionTimeoutMillis limit, then fail with "connection timeout" errors — this is correct fail-fast behavior. When the DB recovers, the pool begins creating new connections. If connectionTimeoutMillis is long and many requests queued (because the circuit breaker was not configured), the DB recovery triggers a "connection storm" — all queued requests simultaneously try to acquire connections and fire queries, potentially re-overloading the recovering DB. Mitigate with: circuit breakers to fail fast during outage, bounded queue sizes (rejectConnectionTimeout), and staggered connection creation at pool startup.'
    }
  ],

  'performance-profiling': [
    {
      id: 'pp_1',
      q: 'What is a flame graph and how do you read one?',
      a: 'A flame graph visualizes a CPU profiler\'s call stack data. The x-axis represents cumulative time (not time sequence — functions are sorted alphabetically, not chronologically). The y-axis represents call stack depth (bottom = entry point, top = deepest call at that moment). Each box is a function; its width represents the proportion of total CPU time spent in that function and all functions it called. Reading technique: look for wide boxes in the middle/upper layers — these are "hot" functions consuming the most CPU. A wide box with narrow children means the function itself is slow. A wide box with one wide child means the child is the real bottleneck. Generated by 0x for Node.js or by Linux perf + flamegraph.pl.'
    },
    {
      id: 'pp_2',
      q: 'What is the N+1 query problem and how do you solve it?',
      a: 'N+1 occurs when code fetches N records and then executes one additional query for each record. Example: fetch 100 users (1 query), then for each user fetch their latest order (100 queries) = 101 queries total. This scales linearly with data size. Solutions: (1) Eager loading with JOIN: fetch users and their orders in a single JOIN query. (2) DataLoader batching (for GraphQL/complex cases): accumulate all .load(userId) calls made within a single event loop tick, then execute one batched query for all IDs simultaneously — 2 total queries regardless of N. (3) For ORMs: use .include() or .with() to specify eager loading. The pattern is detectable in slow query logs as many identical queries with different parameter values.'
    },
    {
      id: 'pp_3',
      q: 'Your Node.js service has high CPU usage under load but each individual request looks fast. What could be causing this?',
      a: 'Possible causes: (1) Garbage collection pressure — high object allocation rate causes frequent GC pauses that consume CPU without appearing in request profiling. Check V8 GC metrics (--expose-gc, clinic.js). (2) JSON.parse/stringify of large payloads blocking the event loop — each call appears fast in isolation but at high concurrency they pile up. (3) Inefficient regular expressions (ReDoS) — certain inputs trigger catastrophic backtracking. (4) Synchronous cryptography operations (bcrypt) — run on the main thread and block the event loop. (5) Missing indexes causing full table scans — high DB CPU, not app CPU but symptoms look similar. Use clinic.js doctor/flame to profile under load to find the actual hot path.'
    },
    {
      id: 'pp_4',
      q: 'What is the observer effect in profiling, and how do you minimize it?',
      a: 'The observer effect is the performance overhead introduced by the profiling tool itself, which can distort measurements — making fast functions appear slow (amplified by profiler instrumentation) or hiding bottlenecks that manifest only at full speed. Instrumentation profilers (trace every function call) have high overhead (10-30%). Sampling profilers (take stack snapshots at fixed intervals, e.g., every 1ms) have much lower overhead (1-5%) and are safe for production use. To minimize: use sampling profilers (clinic.js, pyroscope) for production profiling; reserve instrumentation profilers for local development with production-scale data. Profile under realistic load — profiling an idle service produces misleading results.'
    },
    {
      id: 'pp_5',
      q: 'A deployment caused p99 API latency to increase from 200ms to 800ms. Describe your investigation steps.',
      a: 'Step 1: Confirm scope — is it all endpoints or specific ones? Check your APM/distributed tracing dashboard for per-route p99 latency breakdown. Step 2: Identify which component is slow — for the slow endpoint, trace a sample request: how much time in app code vs DB queries vs external API calls? Step 3: If DB queries are slow, check slow query log and run EXPLAIN ANALYZE on the top offenders — look for missing indexes or changed query plans after the deployment. Step 4: If app code, compare flame graphs before and after deployment to identify new hot functions. Step 5: Check for common deployment-related issues: new ORM query generating N+1, missing index on new WHERE clause, new synchronous operation added to request path, connection pool misconfiguration. Step 6: Roll back if impact is severe while investigating; fix in a branch and verify locally before re-deploying.'
    }
  ],

  // Phase 4
'oauth2-openid': [
    {
      id: 'oauth_1',
      q: 'What is the fundamental difference between OAuth 2.0 and OpenID Connect?',
      a: 'OAuth 2.0 is an authorization framework — it delegates access to resources (e.g., "this app can read your Google Drive"). It does NOT verify who the user is. OpenID Connect (OIDC) is an identity layer built on top of OAuth 2.0 that adds authentication: it issues an ID Token (a JWT) containing verified claims about the user (sub, email, name). Use OAuth alone for access delegation; use OIDC when you need to know who the user is.',
    },
    {
      id: 'oauth_2',
      q: 'What is PKCE and what attack does it prevent?',
      a: 'PKCE (Proof Key for Code Exchange) prevents authorization code interception attacks in public clients (SPAs, mobile apps). Without PKCE, a malicious app on the same device could intercept the authorization code (e.g., via a custom URI scheme) and exchange it for tokens. PKCE works by: (1) client generates a random code_verifier, (2) hashes it to produce code_challenge (SHA-256), (3) sends code_challenge with the auth request, (4) sends the original code_verifier during token exchange. The auth server verifies the hash matches — only the original client can complete the exchange.',
    },
    {
      id: 'oauth_3',
      q: 'Why should access tokens be short-lived (15–60 min) and how do refresh tokens compensate?',
      a: 'Short-lived access tokens limit the blast radius of theft: a stolen token is only usable until it expires. Refresh tokens compensate by allowing the client to silently obtain new access tokens without user re-authentication. The refresh token is long-lived but stored securely (httpOnly cookie server-side, never in JS memory). Refresh token rotation — issuing a new refresh token and revoking the old one on each use — further limits risk: if a refresh token is stolen and used, the legitimate client\'s next refresh attempt will fail (invalid token), alerting the system to a possible reuse attack.',
    },
    {
      id: 'oauth_4',
      q: 'What claims must a resource server validate when verifying a JWT access token?',
      a: 'A resource server must validate: (1) Signature — verify using the auth server\'s public key from its JWKS endpoint; (2) iss (issuer) — must match the expected auth server URL; (3) aud (audience) — must include your API\'s identifier, preventing cross-service token use; (4) exp (expiry) — current time must be before exp; (5) iat (issued-at) — should not be in the future beyond clock skew tolerance (±5s); (6) jti — optionally check against a revocation denylist. Failing to check aud means a token issued for Service A can be used against Service B.',
    },
    {
      id: 'oauth_5',
      q: 'Where should access tokens and refresh tokens be stored in a SPA, and why?',
      a: 'Access tokens: store in JavaScript memory (a module-scoped variable or React state) — not in localStorage or sessionStorage, which are accessible to any JS on the page (XSS risk). Refresh tokens: store in an httpOnly, Secure, SameSite=Strict cookie — JavaScript cannot access httpOnly cookies, so XSS cannot steal them. The SameSite=Strict attribute prevents CSRF-based token use. The tradeoff: memory storage loses the token on page refresh, requiring a silent re-auth flow (use an iframe or redirect) or a backend-for-frontend (BFF) session pattern.',
    },
  ],

  'jwt-deep': [
    {
      id: 'jwt_1',
      q: 'Explain the "algorithm confusion" JWT attack and how to prevent it.',
      a: 'In the algorithm confusion attack, an attacker changes the JWT header\'s alg field from RS256 to HS256. If the server naively uses the algorithm specified in the token header, and the HS256 verification uses the server\'s RSA public key as the HMAC secret, an attacker who knows the public key (it\'s public!) can forge valid tokens. Prevention: never infer the algorithm from the token — configure your JWT library to accept only a specific algorithm (e.g., algorithms: [\'ES256\']). The library should reject any token whose header specifies a different algorithm.',
    },
    {
      id: 'jwt_2',
      q: 'JWTs are supposed to be stateless, but you need to support immediate revocation (logout). How do you implement this efficiently?',
      a: 'Use a JTI (JWT ID) denylist in Redis. Each token contains a unique jti claim. On logout or password change: store the jti in Redis with a TTL equal to the token\'s remaining lifetime (exp - now). On each API request: after verifying the signature and standard claims, do a single Redis GET for the jti. If found → token is revoked, return 401. Redis GET is O(1) and sub-millisecond, so this adds minimal latency. The denylist is self-cleaning because Redis auto-expires entries, keeping memory bounded to only currently-valid-but-revoked tokens.',
    },
    {
      id: 'jwt_3',
      q: 'When should you choose RS256 over HS256 for JWT signing?',
      a: 'Choose RS256 (or ES256) when multiple services need to verify tokens but only one service should issue them. With RS256, the auth server holds the private signing key; all resource servers get only the public key (via JWKS endpoint). A compromised resource server cannot forge tokens — it only has the public key. With HS256 (symmetric), every service that verifies tokens also has the power to forge them. Use HS256 only in a true monolith where a single process both issues and verifies tokens. For any multi-service architecture, use RS256/ES256.',
    },
    {
      id: 'jwt_4',
      q: 'What data should NEVER be placed in a JWT payload, and why?',
      a: 'Never store sensitive PII (SSNs, credit card numbers, health data), passwords or password hashes, or internal system details in JWT payloads. Reason: JWT payloads are base64url-encoded, not encrypted — any party with the token can decode and read the payload (base64 is trivially reversible). JWTs are often logged, stored in browser memory, and transmitted in Authorization headers that may appear in access logs. If you need confidential claims, use JWE (JSON Web Encryption) or put sensitive data behind an authenticated /userinfo endpoint that the client fetches separately.',
    },
    {
      id: 'jwt_5',
      q: 'How do you handle JWT signing key rotation without downtime?',
      a: 'Use a JWKS (JSON Web Key Set) endpoint that publishes multiple public keys, each identified by a kid (key ID) header claim. Rotation procedure: (1) Generate new key pair, add it to the JWKS with a new kid. (2) Update the auth server to sign new tokens with the new private key (new kid in token header). (3) Resource servers fetch JWKS and now hold both old and new public keys. (4) Wait until all tokens signed with the old key have expired (at most one access token TTL — 15–60 min). (5) Remove the old public key from JWKS. (6) Destroy the old private key. Zero downtime because both keys are simultaneously valid during the transition window.',
    },
  ],

  'cryptography-basics': [
    {
      id: 'crypto_1',
      q: 'Why is bcrypt or Argon2 required for passwords instead of SHA-256 with a salt?',
      a: 'SHA-256 (even salted) is designed to be fast — it can compute billions of hashes per second on a GPU. This makes brute-force and dictionary attacks feasible: a high-end GPU can try hundreds of millions of SHA-256 passwords per second. Bcrypt and Argon2 are specifically designed to be slow and resource-intensive (CPU/memory-hard). Argon2id with 64MB memory and 3 iterations takes ~200ms — an attacker can only attempt ~5 guesses/second per GPU thread. The salt prevents precomputed rainbow tables; the cost factor prevents brute force. Argon2id is the current best choice: it resists both side-channel (Argon2i) and GPU (Argon2d) attacks.',
    },
    {
      id: 'crypto_2',
      q: 'What is authenticated encryption and why is it critical for AES?',
      a: 'Authenticated encryption combines confidentiality (ciphertext reveals nothing about plaintext) with integrity (any modification to the ciphertext is detected). AES-256-GCM is the standard: it encrypts the data AND produces a 16-byte authentication tag computed over both the ciphertext and any associated data. When decrypting, if the tag doesn\'t match, decryption fails immediately — the data is rejected before being used. Without authentication (e.g., AES-CBC without a MAC), an attacker can flip specific bits in the ciphertext to predictably modify the decrypted plaintext (bit-flipping attack) or exploit padding oracle vulnerabilities to decrypt data without the key.',
    },
    {
      id: 'crypto_3',
      q: 'Why must the IV/nonce never be reused with the same AES-GCM key?',
      a: 'AES-GCM is a stream cipher mode: it generates a keystream by encrypting successive counter values, then XORs that keystream with the plaintext. If the same key+IV combination is used twice, both ciphertexts are XORed with the identical keystream. An attacker who has both ciphertexts can XOR them together to cancel the keystream: C1 XOR C2 = P1 XOR P2. With known cribs (common words/patterns in plaintext), both plaintexts become recoverable. Additionally, GCM authentication key reuse allows authentication tag forgery. Solution: generate a fresh 12-byte random IV for every encryption operation using a CSPRNG.',
    },
    {
      id: 'crypto_4',
      q: 'What is a timing side-channel attack in the context of HMAC verification?',
      a: 'A timing side-channel attack exploits the fact that a naive string comparison (===) returns false as soon as it finds the first non-matching byte — meaning it runs faster for strings that differ in early bytes. By sending many candidate HMACs and measuring response times, an attacker can determine the correct HMAC one byte at a time (each correct byte makes the comparison run slightly longer before failing). This allows HMAC forgery without knowing the secret key. Prevention: use crypto.timingSafeEqual() which always compares all bytes in constant time regardless of where the first difference occurs. This is mandatory for any security-sensitive comparison.',
    },
    {
      id: 'crypto_5',
      q: 'What is envelope encryption and why is it used in production key management?',
      a: 'Envelope encryption uses two layers of keys: a Data Encryption Key (DEK) that encrypts the actual data, and a Key Encryption Key (KEK) stored in a KMS (Key Management Service, e.g., AWS KMS) that encrypts the DEK. The encrypted DEK is stored alongside the encrypted data. To decrypt: (1) send the encrypted DEK to KMS, which decrypts it using the KEK (the raw KEK never leaves the HSM); (2) use the decrypted DEK to decrypt the data; (3) discard the decrypted DEK from memory. Benefits: the KMS key never leaves the hardware, key rotation only re-encrypts DEKs (not all data), different datasets can have different DEKs, and audit logs track all KMS decrypt calls.',
    },
  ],

  'injection-attacks': [
    {
      id: 'inject_1',
      q: 'How does a parameterized query fundamentally prevent SQL injection at a structural level?',
      a: 'In a parameterized query, the SQL statement structure is sent to the database engine first and compiled into an execution plan. The parameter values are sent separately in a second step. The database treats parameters as pure data values — they are never parsed as SQL syntax. There is no mechanism by which a parameter value containing SQL keywords, quotes, or semicolons can change the query structure. In contrast, string concatenation builds the SQL statement with user data already embedded, so the database parser cannot distinguish attacker-controlled syntax from intended SQL. Parameterized queries make injection structurally impossible, whereas escaping/sanitization attempts to prevent it through pattern matching — which can be bypassed.',
    },
    {
      id: 'inject_2',
      q: 'What is NoSQL injection in MongoDB and how does it differ from SQL injection?',
      a: 'MongoDB queries are JavaScript objects, not strings. NoSQL injection occurs when user input is used directly as a query object, allowing an attacker to inject MongoDB query operators. Example: if login is db.users.findOne({ username: req.body.username, password: req.body.password }), an attacker sends { username: "admin", password: { "$ne": null } }. The $ne operator causes the password field to match anything non-null, bypassing authentication without knowing the password. Unlike SQL injection (string-based), NoSQL injection is object-based. Prevention: strictly type-check all inputs (typeof === \'string\'), use Mongoose schema validation which rejects operator objects for schema-typed string fields, and never pass raw request body objects directly as query filters.',
    },
    {
      id: 'inject_3',
      q: 'What is second-order SQL injection? Why is it more dangerous than first-order?',
      a: 'Second-order injection: an attacker stores a malicious payload in the database (perhaps through a safely-parameterized INSERT). Later, the application retrieves that data and uses it in a subsequent query — but without parameterization, assuming stored data is "safe." For example: username stored as admin\'-- is later used in: SELECT * FROM logs WHERE user = \'+username+\'. The payload executes at this second use. It\'s more dangerous because: (1) automated scanners focus on direct input→query paths and miss it; (2) developers assume data from their own DB is trusted; (3) the attack can be stealthy, with payload sitting dormant until triggered. Defense: parameterize ALL queries, regardless of data source.',
    },
    {
      id: 'inject_4',
      q: 'Why is child_process.exec() dangerous with user input, and what is the safe alternative?',
      a: 'exec() passes the entire command to a shell (e.g., /bin/sh -c "command"). The shell interprets metacharacters: semicolons (;), pipes (|), backticks, $(), redirects (>, >>), and logical operators (&&, ||). An attacker who controls part of the command string can inject these to run arbitrary commands. Example: exec(`ping ${host}`) with host = "8.8.8.8; cat /etc/passwd" executes both commands. Safe alternative: execFile(\'ping\', [\'-c\', \'4\', host]) — no shell is invoked, so the entire host string is passed as a literal argument to the ping binary. Shell metacharacters in the argument are never interpreted. Combined with input validation (whitelist valid hostname characters), this is safe.',
    },
    {
      id: 'inject_5',
      q: 'What is the principle of least privilege in database access and how does it limit injection impact?',
      a: 'Least privilege means the database user your application connects as should have only the permissions it actually needs — nothing more. A typical web app needs SELECT, INSERT, UPDATE, DELETE on its own tables. It should NOT have: DROP TABLE, CREATE TABLE, GRANT, or access to system tables. If SQL injection occurs despite parameterization failures, the blast radius is constrained: the attacker can only perform the operations your DB user is authorized for. Without least privilege, injection on a DB admin user allows schema destruction, data exfiltration of all tables, and in some databases (like MSSQL with xp_cmdshell), OS command execution. Implement per-service DB users with table-level GRANT statements.',
    },
  ],

  'cors-deep': [
    {
      id: 'cors_1',
      q: 'CORS is a browser security mechanism. What does it protect against and what does it NOT protect against?',
      a: 'CORS protects against cross-origin requests made by browser-based JavaScript — specifically, it prevents a malicious website (evil.com) from using a victim\'s browser to make authenticated requests to another site (bank.com) and read the responses. Without CORS, an XSS payload or malicious site could exfiltrate data from APIs using the victim\'s session cookies. CORS does NOT protect against: server-to-server requests (no browser involved), curl/Postman/API clients (no browser), non-GET requests from forms (forms can still POST cross-origin — CORS only controls whether JS can read the response). The real API security comes from authentication tokens and authorization logic, not from CORS.',
    },
    {
      id: 'cors_2',
      q: 'When is a CORS preflight request triggered and what does it accomplish?',
      a: 'A preflight OPTIONS request is sent before "non-simple" requests. It\'s triggered when the method is PUT, PATCH, or DELETE, the Content-Type is application/json (or anything other than text/plain, application/x-www-form-urlencoded, multipart/form-data), or any custom headers are present (like Authorization, X-Request-ID). The preflight asks the server: "Will you accept a [METHOD] request from [Origin] with these headers?" The server responds with Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers, and optionally Access-Control-Max-Age (to cache the preflight result and avoid repeating it). If the server\'s response doesn\'t permit the request, the browser blocks the actual request entirely.',
    },
    {
      id: 'cors_3',
      q: 'Why are Access-Control-Allow-Origin: * and Access-Control-Allow-Credentials: true mutually exclusive?',
      a: 'When credentials (cookies, Authorization header) are included in a cross-origin request, the browser enforces that the response must specify the exact requesting origin — not a wildcard. This prevents a wildcard configuration from accidentally granting every website on the internet the ability to make credentialed requests to your API using victims\' sessions. If a server returns both headers, the browser ignores the response and treats it as a CORS failure. The correct approach: maintain an origin allowlist, and when credentials are needed, dynamically echo the specific requesting origin (after validating it against the allowlist) and set Access-Control-Allow-Credentials: true.',
    },
    {
      id: 'cors_4',
      q: 'Why is Vary: Origin critical when you dynamically set Access-Control-Allow-Origin?',
      a: 'When you dynamically echo the requesting origin in Access-Control-Allow-Origin (instead of using a static wildcard), the response is specific to that origin. Without Vary: Origin, a CDN or reverse proxy may cache the response and serve it to subsequent requests from different origins — but with the first origin\'s CORS headers. This causes CORS failures for other allowed origins (they see someone else\'s origin in the header) or security issues (a disallowed origin might get an allowed origin\'s cached headers). The Vary: Origin header tells caches: "this response varies based on the Origin request header — cache separately per origin."',
    },
    {
      id: 'cors_5',
      q: 'What is the "null origin" CORS vulnerability and how do you prevent it?',
      a: 'The Origin: null value is sent by browsers in certain contexts: sandboxed iframes (<iframe sandbox>), redirects from data: URIs, and local file:// pages. If a CORS policy reflects or allows Origin: null (either by echoing unvalidated origins or by having null in the allowlist), attackers can craft a sandboxed iframe that sends requests with Origin: null and receives the CORS-allowed response. Prevention: never reflect an origin without validating it against an explicit allowlist of known-good strings. Your allowlist should contain only real domain origins (e.g., \'https://app.example.com\') — null should never appear in it. Validate with an exact-match Set lookup, not loose regex or truthy checks.',
    },
  ],

  'security-headers': [
    {
      id: 'secheader_1',
      q: 'What is Content Security Policy and how does it mitigate XSS?',
      a: 'CSP is an HTTP response header that tells the browser which sources are trusted to load scripts, styles, images, fonts, and other resources. When a browser with an active CSP encounters an inline script or a script from an unlisted source, it blocks execution and logs a violation. For XSS: even if an attacker injects <script>malicious()</script> into your HTML, the browser won\'t execute it if your CSP lacks \'unsafe-inline\' in script-src. A nonce-based policy (script-src \'nonce-abc123\' \'strict-dynamic\') goes further: only scripts with the matching nonce attribute execute, and the nonce changes per request — a static injected script can never have a valid nonce. CSP does not prevent XSS injection itself; it prevents injected scripts from executing.',
    },
    {
      id: 'secheader_2',
      q: 'What does HTTP Strict Transport Security (HSTS) protect against, and what is the risk of the preload directive?',
      a: 'HSTS prevents SSL stripping attacks: a network attacker intercepts your HTTP request (before it\'s upgraded to HTTPS) and acts as a man-in-the-middle. With HSTS, the browser remembers that a site must always use HTTPS for the specified max-age duration — subsequent visits automatically use HTTPS without a first HTTP request. The preload directive makes this work even on the first visit by including your domain in a hardcoded list shipped with browsers. Risk: preload is a one-way commitment. Once on the preload list, your domain AND all subdomains must have valid HTTPS certificates for the max-age period. If any subdomain loses its certificate, users cannot access it until the HSTS max-age expires. Removal from the preload list takes months to propagate.',
    },
    {
      id: 'secheader_3',
      q: 'What is clickjacking and which headers prevent it?',
      a: 'Clickjacking embeds your site in an invisible iframe on an attacker\'s page. The attacker overlays a deceptive UI (e.g., "Win a prize!") over your UI. When the victim clicks the deceptive element, they actually click a button on your site (e.g., "Confirm Transfer") while thinking they\'re interacting with the attacker\'s page. Prevention headers: (1) X-Frame-Options: DENY — prevents the page from being loaded in any frame or iframe. SAMEORIGIN allows same-origin framing. (2) Content-Security-Policy: frame-ancestors \'none\' — CSP directive that supersedes X-Frame-Options, with more granular control (e.g., frame-ancestors \'self\' https://trusted-partner.com). Include both for compatibility with older browsers that don\'t support CSP.',
    },
    {
      id: 'secheader_4',
      q: 'What does X-Content-Type-Options: nosniff prevent?',
      a: 'MIME sniffing: browsers historically tried to detect the actual content type of a response by inspecting its bytes, even if the server declared a different Content-Type. An attacker could upload a file containing JavaScript but with a .jpg extension and text/plain Content-Type. Without nosniff, a browser might sniff it as script and execute it when embedded. nosniff instructs the browser to strictly honor the declared Content-Type and never try to sniff or override it. This prevents: script execution from non-script MIME types, CSS execution from non-CSS MIME types, and cross-site script inclusion (XSSI) attacks. It also causes browsers to block requests where the MIME type doesn\'t match the destination (e.g., loading a text/html file as a script).',
    },
    {
      id: 'secheader_5',
      q: 'How do you roll out a Content Security Policy to a production app without breaking it?',
      a: 'Use a phased approach with CSP Report-Only mode: (1) Start with Content-Security-Policy-Report-Only instead of Content-Security-Policy — the policy is evaluated but violations are only logged, not blocked. (2) Configure report-uri or report-to to collect violations to an endpoint (or use a service like Report URI). (3) Analyze violations to identify all legitimate sources that need to be in the allowlist. (4) Add missing sources to the policy and fix inline scripts (replace \'unsafe-inline\' with nonces or move scripts to external files). (5) Once violations drop to near zero, switch from Report-Only to enforcing Content-Security-Policy. (6) Keep report-uri active to catch regressions from future code changes.',
    },
  ],

  'input-validation-deep': [
    {
      id: 'validate_1',
      q: 'What is the difference between input validation, sanitization, and output encoding? When should each be used?',
      a: 'Validation: check that input conforms to expected schema, type, format, and business rules. Reject invalid input with a 400 error. Use at API boundaries for all untrusted input. Sanitization: transform input to remove or neutralize potentially harmful content. Use for rich text/HTML input that users are explicitly allowed to submit (e.g., a blog editor). Not a primary injection defense — use structural defenses (parameterized queries) for that. Output encoding: transform data for safe rendering in a specific context. Use when displaying data in HTML (HTML-encode), JSON in a script tag (JSON.stringify), or URLs (encodeURIComponent). Output encoding is context-specific and is the correct defense against XSS. Key principle: validate input, encode output, use structural defenses for injection.',
    },
    {
      id: 'validate_2',
      q: 'What is a ReDoS attack and how do you prevent it in an API that uses regex for validation?',
      a: 'ReDoS (Regular Expression Denial of Service) exploits catastrophic backtracking in certain regex patterns. Naive patterns like (a+)+ or (a|aa)+ can take exponential time to determine a non-match on specially crafted input. In Node.js (single-threaded event loop), a regex that takes 30 seconds to evaluate blocks ALL requests. Prevention: (1) Use simple, linear-time regex patterns — avoid nested quantifiers (e.g., (a+)+) and alternation with overlapping patterns; (2) Set a maximum input length before applying regex: if the input is 10,000 chars and valid inputs are max 100, reject immediately; (3) Use a ReDoS-safe regex library or linter (safe-regex npm package, eslint-plugin-security); (4) Test regex with adversarial inputs before deployment.',
    },
    {
      id: 'validate_3',
      q: 'What validations are required for a URL parameter (e.g., a redirect URL) to prevent open redirect and XSS attacks?',
      a: 'An open redirect allows attackers to use your trusted domain to redirect users to malicious sites (phishing). For a redirect URL parameter: (1) Parse as a URL object and validate the scheme — only allow http: and https:, reject javascript:, data:, vbscript:, and any other scheme; (2) Validate the hostname is on an explicit allowlist of your own domains (or use a relative path only approach — reject any URL with a host component); (3) Reject URLs with credentials (user:pass@host); (4) If relative paths are acceptable, check the value starts with / but not // (// allows protocol-relative URLs pointing to other hosts). For XSS: encode the URL when embedding it in href attributes; never use the URL in innerHTML. A javascript: href executes script even without inline script tags.',
    },
    {
      id: 'validate_4',
      q: 'How do you safely handle file uploads to prevent MIME type spoofing and path traversal?',
      a: 'MIME type spoofing: never trust the Content-Type header or file extension — both are attacker-controlled. Read the first few bytes of the file (magic bytes) and use a library like file-type to determine the actual format. Compare detected MIME type against an allowlist of permitted types. Path traversal: never use the user-supplied filename as a filesystem path. Generate a random UUID-based filename for storage. If the display name must be preserved, sanitize it: use path.basename() to strip directory components, replace dangerous characters ([/\\\\:*?"<>|]), and enforce a maximum length. Store uploads outside the web root (not in public/) and serve them through your application after access checks, not directly via the web server.',
    },
    {
      id: 'validate_5',
      q: 'Your input validation code checks req.body thoroughly. What other input sources are commonly forgotten?',
      a: 'Teams often validate req.body but forget: (1) req.params — URL path parameters (e.g., /users/:id) can contain injection payloads; (2) req.query — URL query string parameters, often used directly in filters/sorting/pagination; (3) req.headers — custom headers like X-Forwarded-For, X-User-ID, Referer are sometimes used in business logic and can be spoofed; (4) req.cookies — cookie values are user-controlled despite feeling "internal"; (5) File upload metadata — filename, Content-Type, size; (6) Deserialized data from message queues — data from Kafka/RabbitMQ may have originated from untrusted sources; (7) Data retrieved from the database if it originated from user input and was stored without validation (second-order injection path). Validate at every trust boundary.',
    },
  ],

  'secrets-management': [
    {
      id: 'secrets_1',
      q: 'A developer accidentally committed an API key to a public GitHub repository 3 days ago and then deleted it. Is the key compromised? What do you do?',
      a: 'Yes, the key must be treated as compromised immediately. Reasons: (1) GitHub indexes commits almost immediately — search engines and secret-scanning bots (GitGuardian, truffleHog) crawl public repos continuously; (2) Anyone who cloned or forked the repo in those 3 days has the key in their local git history; (3) Deleting a file from HEAD does not remove it from git history — git log and git show still expose it. Immediate actions: (1) Revoke/rotate the key NOW — do not wait; (2) Check audit logs for the key to see if unauthorized use occurred; (3) Investigate and remediate any unauthorized access; (4) Clean git history using BFG Repo Cleaner or git filter-repo (though this is secondary to revocation); (5) Conduct a postmortem and add pre-commit secret scanning hooks.',
    },
    {
      id: 'secrets_2',
      q: 'What are dynamic secrets and why are they more secure than static credentials?',
      a: 'Dynamic secrets are credentials generated on-demand by a secrets manager (like HashiCorp Vault\'s database secrets engine) that automatically expire after a TTL. When a service needs database access: (1) it authenticates to Vault using its identity (IAM role, Kubernetes service account); (2) Vault creates a new database user with appropriate permissions and returns the credentials; (3) the service uses those credentials for its work; (4) after the TTL (e.g., 1 hour), Vault revokes the DB user automatically. Advantages over static: no long-lived credentials to rotate manually or leak; each access request produces unique credentials traceable to a specific service/time; a compromised credential expires quickly; no shared secrets between services — each gets its own ephemeral credential.',
    },
    {
      id: 'secrets_3',
      q: 'How do you rotate a database password in production without downtime?',
      a: 'Zero-downtime rotation procedure: (1) Create a new DB user (or change the password on the secondary if using dual-credential rotation); (2) Update the secret in your secrets manager with the new credentials; (3) Deploy application instances configured to accept BOTH old and new credentials — a dual-read approach where the app tries the new credential first, falls back to old on auth failure; (4) Monitor until all app instances are successfully using the new credential; (5) Remove the old credential fallback from the application; (6) Revoke/delete the old DB user or password. AWS Secrets Manager handles this automatically for RDS using a Lambda rotation function that implements exactly this two-step pattern. The key principle: never hard-cut over; always have a fallback during the rotation window.',
    },
    {
      id: 'secrets_4',
      q: 'What is the difference between AWS Secrets Manager and AWS SSM Parameter Store for secrets?',
      a: 'AWS Secrets Manager: designed specifically for secrets. Supports automatic rotation via Lambda functions (native integration for RDS, Redshift, DocumentDB). Fine-grained IAM per secret. Cross-region replication. Costs ~$0.40/secret/month. Best for database credentials and other rotating secrets. AWS SSM Parameter Store: general-purpose configuration store. SecureString type uses KMS encryption (similar security to Secrets Manager). Free tier for standard parameters ($0.05/10,000 API calls for advanced). No built-in rotation, but can trigger Lambda via EventBridge. Best for non-rotating config values, feature flags, and app configuration alongside secrets. Use Secrets Manager when you need rotation; use Parameter Store when cost matters and rotation is not required or is handled externally.',
    },
    {
      id: 'secrets_5',
      q: 'How should a Kubernetes pod authenticate to AWS services without a hardcoded access key?',
      a: 'Use IRSA (IAM Roles for Service Accounts) — the modern, keyless approach: (1) Create an IAM role with the permissions the pod needs (e.g., s3:GetObject on specific buckets); (2) Configure the IAM role\'s trust policy to allow the Kubernetes service account to assume it (via OIDC federation between your EKS cluster and AWS IAM); (3) Annotate the Kubernetes ServiceAccount with the IAM role ARN; (4) Kubernetes injects a projected service account token into the pod; (5) The AWS SDK in the pod automatically exchanges this token for temporary AWS credentials via STS AssumeRoleWithWebIdentity. No access keys are stored anywhere — credentials are short-lived (1 hour), scoped to exactly the role\'s permissions, and automatically rotated by the SDK. This is the zero-secret approach to cloud authentication.',
    },
  ],

  // Phase 5
'microservices-design': [
    {
      id: 'ms_1',
      q: 'What is the single most important rule of microservices data architecture, and why?',
      a: 'Each service must own its own database and no other service should query it directly. Shared databases create deployment coupling (both services must be deployed together when the schema changes), tight coupling (one service can break another\'s data), and prevent independent scaling. If two services share a database, they are not truly independent microservices — they are a distributed monolith.'
    },
    {
      id: 'ms_2',
      q: 'What is a "distributed monolith" and how does it form?',
      a: 'A distributed monolith is a system split into multiple services that are still tightly coupled — sharing databases, requiring coordinated deployments, or chaining synchronous calls such that deploying one service requires deploying others simultaneously. It forms when services are split by technical layer instead of by business capability, when services share a database, or when synchronous call chains make services co-dependent on each other\'s availability.'
    },
    {
      id: 'ms_3',
      q: 'What is Conway\'s Law and how does it apply to microservices?',
      a: 'Conway\'s Law states that organizations design systems that mirror their communication structure. In microservices, this means service boundaries naturally reflect team boundaries. A team owning 8 services will unconsciously create coupling between them. The correct approach is the Inverse Conway Maneuver: design your team structure to match the architecture you want, not the other way around. One team → one service.'
    },
    {
      id: 'ms_4',
      q: 'Why is observability (distributed tracing, centralized logging, metrics) more critical in microservices than in a monolith?',
      a: 'In a monolith, a bug produces a stack trace in one process with one log stream. In microservices, a single user request may fan out to 8 services across different hosts. Without distributed tracing (Jaeger/Zipkin with a shared trace ID propagated through headers), you cannot reconstruct which service caused a failure or where latency came from. Without centralized logging (ELK/Loki), you\'d need to SSH into each service pod separately. Observability is not optional in microservices — it\'s foundational.'
    },
    {
      id: 'ms_5',
      q: 'When should you NOT use microservices?',
      a: 'Avoid microservices when: (1) Your team is fewer than ~10 engineers — operational overhead (CI/CD, Kubernetes, service mesh, distributed tracing) will consume all productivity. (2) You don\'t fully understand the domain yet — premature decomposition draws wrong boundaries requiring expensive rework. (3) You lack DevOps maturity (Kubernetes, CI/CD pipelines, monitoring). Instead, start with a well-structured modular monolith. Extract services only when you have a proven need: team scale, independent deployment friction, or drastically different scaling requirements.'
    }
  ],

  'api-gateway': [
    {
      id: 'ag_1',
      q: 'What is the difference between an API Gateway and a load balancer?',
      a: 'A load balancer distributes traffic across multiple instances of the SAME service (round-robin, least-connections). It operates at Layer 4 (TCP) or Layer 7 (HTTP) and doesn\'t understand business routing rules. An API Gateway routes traffic to DIFFERENT services based on the request path, applies cross-cutting concerns (auth, rate limiting, SSL termination), and may transform requests/responses. A load balancer handles scale; an API Gateway handles routing and policy. In production you use both: a load balancer in front of multiple API Gateway instances, and the Gateway routing to services.'
    },
    {
      id: 'ag_2',
      q: 'What is the Backend-for-Frontend (BFF) pattern and when does it provide value over a generic gateway?',
      a: 'A BFF is a gateway instance customized for a specific client type (mobile app, web app, partner API). Instead of one gateway that serves all clients with the same API shape, each client has its own BFF that returns data optimized for that client\'s needs — mobile gets leaner payloads and aggregated endpoints, web gets richer data, partner API gets a stable v1 contract. Value when: clients have substantially different data needs, different teams own different client types, or mobile bandwidth/performance is critical. The BFF is owned by the client team, not a shared platform team.'
    },
    {
      id: 'ag_3',
      q: 'How does an API Gateway handle authentication, and how does it forward user identity to downstream services?',
      a: 'The gateway validates the JWT (or API key, OAuth token) in the Authorization header using the public key or secret. If valid, it extracts the user identity (sub, roles, email) from the token payload and injects them as trusted headers (x-user-id, x-user-roles) before forwarding the request to the service. The gateway strips the original Authorization header. Downstream services trust these headers (they\'re internal-only, not reachable from outside the gateway) and don\'t re-validate tokens. This ensures auth logic is centralized once instead of duplicated in every service.'
    },
    {
      id: 'ag_4',
      q: 'What would cause an API Gateway to become a system bottleneck, and how do you prevent it?',
      a: 'Bottlenecks occur when the gateway performs CPU-intensive work: decrypting JWTs with slow DB lookups, aggregating responses from 10 services synchronously, or running heavy transformation logic. Prevention: (1) Keep the gateway "thin" — route, auth, rate limit, forward. No business logic. (2) Use public key JWT verification (fast, no DB call). (3) Run multiple gateway instances behind a load balancer. (4) Avoid synchronous fan-out aggregation in the gateway — use GraphQL or a dedicated BFF service for that. (5) Cache rate-limit counters in Redis, not in-memory per instance.'
    }
  ],

  'event-driven-arch': [
    {
      id: 'eda_1',
      q: 'What is the difference between a message queue (e.g., RabbitMQ/SQS) and an event stream (e.g., Kafka)?',
      a: 'Message queue: messages are consumed once and deleted. Consumer acknowledges receipt → message is gone. Designed for task distribution (work queues). Good for: job processing, command-style messages, point-to-point delivery. Event stream (Kafka): events are persisted to a durable log, retained for a configurable period (days, weeks, forever). Multiple consumer groups can independently read the same stream. Events can be replayed. Good for: event sourcing, audit logs, fan-out to multiple services, rebuilding derived data. Key question: do you need replay? If yes, Kafka. If messages are consumed once and discarded, a queue suffices.'
    },
    {
      id: 'eda_2',
      q: 'What is "at-least-once delivery" and why does it require consumers to be idempotent?',
      a: 'At-least-once delivery means the broker guarantees every message will be delivered to the consumer at least one time, but may deliver it more than once (due to network timeouts, consumer crashes after processing but before acknowledgment, or broker-side retries). Idempotency means processing the same message N times produces the same result as processing it once. Required because any non-idempotent operation (send email, charge payment, debit account) will have duplicate effects. Implementation: maintain a set of processed event IDs (in Redis or a DB table with a unique constraint). Before processing, check if the event ID was already processed. If yes, skip.'
    },
    {
      id: 'eda_3',
      q: 'What is a Dead Letter Queue (DLQ) and why is it essential?',
      a: 'A DLQ is a secondary queue or topic where messages go when they repeatedly fail processing. Without a DLQ, a poison message (one that always causes a consumer exception) would be retried forever, blocking the queue and preventing processing of subsequent messages. With a DLQ: after N retries (e.g., 3-5), the message moves to the DLQ. The consumer continues processing other messages. An engineer investigates the DLQ messages manually or via an automated reprocessor. DLQs are a signal: high DLQ depth = a bug in the consumer or malformed messages. Always alert on DLQ depth > 0.'
    },
    {
      id: 'eda_4',
      q: 'How does Kafka guarantee message ordering, and what is the limitation?',
      a: 'Kafka guarantees ordering within a single partition. A topic is divided into N partitions, and each message is assigned to a partition based on its key (hash of the key % partition count). All messages with the same key go to the same partition, in order. Limitation: ordering is NOT guaranteed across partitions. If OrderPlaced and OrderCancelled for order-123 have different keys (or no key), they could land in different partitions and be processed out of order. Solution: always use a consistent partition key (order ID, user ID) for messages that must be processed in order relative to each other.'
    },
    {
      id: 'eda_5',
      q: 'When should you choose synchronous (REST/gRPC) over asynchronous (events) for service communication?',
      a: 'Choose synchronous when: (1) The client needs an immediate result before proceeding (user submits a form, payment authorization). (2) The operation requires strong consistency (checking inventory before confirming). (3) The call is simple and failure should surface immediately to the user. Choose async events when: (1) The operation can complete in the background (email notifications, analytics, warehouse picking). (2) Multiple services need to react to the same trigger (fan-out). (3) You want to decouple service lifecycles (one service can be down without affecting the producer). Most systems use both: sync for the request-response path, async for side effects.'
    }
  ],

  'cqrs-event-sourcing': [
    {
      id: 'cqrs_1',
      q: 'What problem does CQRS solve, and what new problems does it introduce?',
      a: 'Problem solved: in systems with complex queries or high read/write imbalance, a single shared model can\'t be optimized for both. Complex reporting queries degrade write performance. CQRS separates read and write models, letting each be optimized independently — write side is normalized and transactionally consistent, read side is denormalized and query-optimized. New problems introduced: (1) Eventual consistency between write model and read projections. (2) Complexity — two models, synchronization logic, projection management. (3) Harder debugging — tracing a command through to its effect on the read model. Only adopt CQRS when the complexity tradeoff is justified by real, experienced pain.'
    },
    {
      id: 'cqrs_2',
      q: 'In Event Sourcing, what is an aggregate and why is it the unit of consistency?',
      a: 'An aggregate is a cluster of domain objects (e.g., Order with its LineItems) treated as a single unit for transactional consistency. All changes to an aggregate are made via commands processed by the aggregate root. The aggregate validates business rules and emits events. Events for a single aggregate are loaded and applied in sequence to reconstruct current state. The aggregate is the consistency boundary: operations within one aggregate are strongly consistent (same transaction/event sequence). Operations across aggregates are eventually consistent (via events). This is why aggregates should be as small as possible — to minimize the scope of locking and consistency guarantees required.'
    },
    {
      id: 'cqrs_3',
      q: 'How do you handle backward-incompatible schema changes in Event Sourcing when events are stored permanently?',
      a: 'Use event upcasting (also called event versioning). When you need to change an event\'s schema (e.g., split a "fullName" field into "firstName" + "lastName"): (1) Never modify or delete old events. (2) Create a new event version: OrderPlacedV2 with the new schema. (3) Write an upcaster function that transforms V1 → V2 during event replay. (4) The event store or application loads events and pipes them through registered upcasters before applying to aggregates. The upcaster sits between loading events from the store and applying them to the aggregate. Old events remain V1 on disk but are presented as V2 to the application.'
    },
    {
      id: 'cqrs_4',
      q: 'What are snapshots in Event Sourcing and when do you need them?',
      a: 'A snapshot is a captured copy of an aggregate\'s state at a specific version, stored alongside the event log. Instead of replaying 10,000 events to reconstruct an aggregate, you load the latest snapshot (say, at version 9,800) and replay only the 200 events after it. When needed: when replaying events for a frequently-accessed aggregate becomes noticeably slow (typically 500+ events per aggregate). Implementation: after every N events (e.g., every 100 or 500), serialize the aggregate\'s current state and save it with the current version number. On load, find the latest snapshot, hydrate the aggregate from it, then apply only events after the snapshot version.'
    }
  ],

  'grpc-protobuf': [
    {
      id: 'grpc_1',
      q: 'What are the four gRPC communication patterns and when do you use each?',
      a: '(1) Unary: single request, single response. Same as REST. Use for standard CRUD operations. (2) Server streaming: single request, server sends a stream of responses. Use for: real-time feed, watching order status, returning a large dataset in chunks. (3) Client streaming: client sends a stream of requests, server responds once. Use for: uploading bulk data, streaming metrics from IoT devices. (4) Bidirectional streaming: both sides send streams independently. Use for: real-time chat, collaborative editing, live gaming. HTTP/2 enables all four patterns on a single connection.'
    },
    {
      id: 'grpc_2',
      q: 'What rules must you follow when evolving a Protocol Buffer schema to maintain backward compatibility?',
      a: '(1) Never change a field number — the wire format uses numbers, not names. Changing a number corrupts existing serialized data. (2) Never reuse a field number from a removed field — use "reserved 5; reserved old_field_name;" to prevent accidental reuse. (3) Adding new fields is backward compatible (old consumers ignore unknown fields, new fields default to zero/empty for old messages). (4) Removing fields: mark them reserved but don\'t reuse the number. (5) Never change a field\'s type in incompatible ways (e.g., string to int32). (6) In proto3, all fields are optional — absence means the zero value (0, "", false, null).'
    },
    {
      id: 'grpc_3',
      q: 'Why is gRPC preferred over REST for internal service-to-service communication at scale?',
      a: '(1) Binary encoding (protobuf) produces 3-10x smaller payloads than JSON, reducing bandwidth and serialization/deserialization CPU cost. (2) HTTP/2 multiplexing allows many concurrent requests on one connection, eliminating the connection overhead of HTTP/1.1. (3) Generated type-safe clients and servers eliminate integration bugs from incorrect field names or types. (4) Built-in deadlines propagate automatically across service calls — if the top-level request has 500ms left, all downstream calls receive a reduced deadline automatically. (5) Streaming: bidirectional streaming is impossible in standard REST. At Google scale, these optimizations matter enormously; at startup scale, REST is usually fine.'
    },
    {
      id: 'grpc_4',
      q: 'What is gRPC context cancellation and why is it important for system health?',
      a: 'When a gRPC client cancels a call (deadline exceeded, client disconnected, explicitly cancelled), the server receives a cancellation signal via the context (ctx.Done() in Go, call.cancelled in Node.js). If servers don\'t check for cancellation, they continue consuming resources (DB queries, downstream calls) for requests whose results will never be used. In a busy system, cancelled requests piling up can exhaust DB connection pools and downstream service capacity. Always check ctx.cancelled in long-running handlers and pass contexts to all downstream calls so cancellation propagates through the entire call chain.'
    }
  ],

  'graphql-deep': [
    {
      id: 'gql_1',
      q: 'What is the N+1 problem in GraphQL and exactly how does DataLoader solve it?',
      a: 'N+1: when resolving a list of N items where each item has a relationship (e.g., 100 posts, each with an author), the naive resolver fires one DB query per author lookup = 101 queries total. DataLoader solves this by batching: it collects all load(userId) calls made during a single event loop tick, then fires a single batched query (SELECT * FROM users WHERE id IN (...)) with all the IDs. It then distributes the results back to each individual promise. The key insight: DataLoader.load() returns a Promise, and by coalescing all loads within one tick, it transforms N queries into 1. Critically, DataLoader instances must be created per-request (not as a singleton) to prevent user data leaking across requests.'
    },
    {
      id: 'gql_2',
      q: 'Why is caching harder with GraphQL than REST, and what are the solutions?',
      a: 'REST: each resource has a unique URL (GET /products/123), enabling HTTP cache headers (Cache-Control, ETag) and CDN caching by URL. GraphQL: everything is a POST to /graphql, so HTTP-level and CDN caching are disabled by default. Solutions: (1) Persisted queries — hash each query client-side, send only the hash. Server maps hash → query. Now GET requests by hash can be CDN-cached. (2) Apollo Cache Control — resolvers annotate fields with cache hints (maxAge, scope). Apollo Server generates Cache-Control headers from the most restrictive hint in the query. (3) Application-level caching — cache resolver results in Redis (e.g., cache the product catalog for 60 seconds). (4) Use GET for queries (allowed by spec) — enables CDN caching with full query in URL.'
    },
    {
      id: 'gql_3',
      q: 'How do you implement field-level authorization in GraphQL (i.e., some users can see certain fields, others can\'t)?',
      a: 'Three approaches: (1) In resolver logic: check the context user\'s role in each resolver field. Simple, explicit, but verbose across large schemas. (2) graphql-shield: a middleware library that declaratively defines permission rules per type and field using a rule tree. Rules are composable (and, or, not). Evaluated before resolvers run. Cleaner than in-resolver checks. (3) Custom directives (@auth, @hasRole): add schema directives that wrap resolvers with auth logic. Keeps permissions visible in the schema SDL. Best practice: never return errors for unauthorized fields — return null. Throwing an authorization error leaks information about field existence. Define your authorization model before building the schema, not after.'
    },
    {
      id: 'gql_4',
      q: 'What is Apollo Federation and what problem does it solve?',
      a: 'Apollo Federation solves the "who owns the schema" problem in large organizations. Without federation, all teams contribute to one monolithic GraphQL schema owned by one platform team — a bottleneck. Federation allows each service (subgraph) to define its own portion of the schema using @key and @extends directives. The Inventory service owns the Product type with stock fields; the Reviews service extends Product with review fields. The Apollo Router composes these into a unified supergraph at runtime. A client query for "product name, stock level, and reviews" is automatically split into queries to the right subgraphs and the results are merged. Each team ships their subgraph independently. Used by Expedia, The New York Times, Wayfair, and many others at scale.'
    },
    {
      id: 'gql_5',
      q: 'What query depth limiting and complexity analysis prevent, and how do you implement them?',
      a: 'A malicious or naive client can send a deeply recursive query (users → friends → friends → friends → posts → comments → authors → ...) that causes exponential DB calls. Depth limiting rejects queries exceeding a max nesting depth (typically 7-10). Complexity analysis assigns a "cost" to each field and rejects queries exceeding a total budget. Implementation: (1) graphql-depth-limit: install as a validationRule in ApolloServer. (2) graphql-query-complexity or graphql-validation-complexity: assign cost multipliers to fields and list resolvers (a list of 100 items costs more than a single item). Applied at query parsing time, before any resolver runs. Both are essential for public-facing GraphQL APIs — never expose a GraphQL endpoint without them.'
    }
  ],

  'saga-pattern': [
    {
      id: 'saga_1',
      q: 'Why can\'t you use a database transaction (ACID) for a multi-service operation, and what does the Saga pattern do instead?',
      a: 'ACID transactions require all operations to happen within a single database connection context. Microservices each own separate databases (potentially different DB technologies). There is no shared transaction context across network boundaries. 2PC (two-phase commit) theoretically solves this but requires all databases to support the XA protocol, locks resources for the duration of the protocol, and causes indefinite blocking if the coordinator crashes. The Saga pattern instead uses a sequence of local transactions, each committed independently. If a step fails, compensating transactions undo prior steps. Consistency is eventual (not immediate), but the system converges to a consistent state without distributed locking.'
    },
    {
      id: 'saga_2',
      q: 'What is the key difference between choreography and orchestration sagas?',
      a: 'Choreography: each service listens for events and reacts by performing its step and publishing the next event. Decentralized — no single coordinator. Pro: simple, loosely coupled. Con: the saga flow is implicit and distributed across multiple services\' codebases, making it hard to understand, debug, or modify. Orchestration: a dedicated saga orchestrator service explicitly commands each step ("ReserveInventory", "ChargePayment"), receives responses, and commands compensations on failure. The full saga flow is in one place. Pro: explicit, readable, easy to monitor state. Con: the orchestrator is a new service to maintain and a logical central point. Orchestration wins for complex sagas (>3 steps). Choreography is fine for simple 2-step flows.'
    },
    {
      id: 'saga_3',
      q: 'What is the Transactional Outbox Pattern and what problem does it solve in Sagas?',
      a: 'Problem: you need to write to your DB AND publish an event atomically. If you write to DB and the process crashes before publishing, the saga stalls. If you publish first and then crash before writing to DB, you have a phantom event. Solution: write the event to an "outbox" table in the SAME database transaction as your business write. Both commit or both rollback together. A separate relay process (or Debezium CDC reading the DB transaction log) reads from the outbox table and publishes to Kafka/SQS. If the relay fails mid-publish, it retries from the outbox — the event is at-least-once delivered. This guarantees that a DB commit and its event always happen together, which is the foundation of reliable saga coordination.'
    },
    {
      id: 'saga_4',
      q: 'How do you handle the situation where a compensating transaction itself fails?',
      a: 'Compensating transactions can fail (the refund API is down, the inventory service is unavailable). Strategies: (1) Retry with exponential backoff — most transient failures resolve. Use a saga engine like Temporal that handles retries automatically. (2) Manual intervention queue — after N retries, move the saga to a "needs manual review" state. Alert an engineer. Most financial and order systems have a manual reconciliation process for edge cases. (3) Idempotent compensations — ensure the compensation operation is safe to retry (a refund with the same idempotency key won\'t double-refund). (4) Business-level recovery — in some cases, the business accepts the inconsistency and handles it out-of-band (customer service issues manual refund). Design your compensation failure handling as part of the initial saga design, not as an afterthought.'
    }
  ],

  'service-discovery': [
    {
      id: 'sd_1',
      q: 'What is the difference between client-side and server-side service discovery?',
      a: 'Client-side: the service client queries the registry directly (e.g., calls Consul API), receives a list of healthy instances, and picks one (applying its own load balancing strategy). The client is registry-aware. Pro: client controls load balancing algorithm. Con: every service needs a registry client library, and registry coupling is in application code. Server-side: the client sends requests to a stable address (a load balancer, service mesh sidecar, or Kubernetes ClusterIP). The infrastructure component queries the registry and routes the request. The client is registry-unaware. Pro: no application code changes for service discovery. Con: adds a network hop, load balancing strategy is less flexible. Kubernetes DNS is server-side — clients use stable DNS names, kube-proxy handles actual routing to pod IPs.'
    },
    {
      id: 'sd_2',
      q: 'How does Kubernetes service discovery work under the hood?',
      a: 'A Kubernetes Service resource selects pods via label selectors. kube-dns creates a DNS record for the Service (e.g., order-service.backend.svc.cluster.local) that resolves to the Service\'s ClusterIP — a stable virtual IP that doesn\'t change even as pods come and go. kube-proxy runs on every node and maintains iptables (or IPVS) rules that intercept traffic to the ClusterIP and forward it to one of the healthy pod IPs using round-robin. When a pod passes its readiness probe, its IP is added to the Endpoints object for the Service. When a pod fails or is deleted, its IP is removed. DNS resolution always returns the ClusterIP; actual load balancing happens in the kernel via iptables.'
    },
    {
      id: 'sd_3',
      q: 'What is a "headless service" in Kubernetes and why do you need one for gRPC?',
      a: 'A headless service (clusterIP: None) returns all pod IPs from DNS instead of a single ClusterIP. With a regular ClusterIP service, DNS resolves to one IP (the ClusterIP), and kube-proxy distributes connections per TCP connection. gRPC uses HTTP/2, which multiplexes many requests over a single long-lived TCP connection. If that connection always goes to the same ClusterIP, all gRPC traffic routes through one pod — no actual load balancing. With a headless service, DNS returns multiple pod IPs. The gRPC client library (e.g., using pick_first or round_robin balancer) distributes requests across multiple connections to different pods. Client-side load balancing in gRPC requires pod IPs, not a ClusterIP.'
    },
    {
      id: 'sd_4',
      q: 'How do you handle the "stale registry" problem where a crashed service instance is still registered?',
      a: 'Prevention: (1) Short health check intervals (Consul: check every 5-10 seconds, mark critical after 1-2 failures, deregister after 30s of critical status). (2) TTL-based heartbeats: service must send a heartbeat every N seconds or the registration expires. (3) Graceful deregistration: on SIGTERM, service calls the registry API to deregister before shutting down. Mitigation: (4) Client-side retry: if a request to a discovered instance fails with connection refused, retry on a different instance and optionally report the failure to the registry. (5) Circuit breaker: after repeated failures to one instance, stop routing to it even if the registry still lists it as healthy. Defense in depth: multiple layers catching failures at different speeds.'
    }
  ],

  'strangler-fig': [
    {
      id: 'sf_1',
      q: 'Describe the Strangler Fig migration pattern step by step.',
      a: '(1) Deploy a routing proxy (Nginx, API Gateway) in front of the monolith. All traffic initially passes through to the monolith unchanged — zero risk. (2) Identify the first bounded context to extract: choose low coupling, small blast radius. (3) Build and deploy the new microservice. Test in staging. (4) Configure the proxy to route only the affected endpoints (e.g., /api/v1/orders/*) to the new service. Route everything else to the monolith. (5) Monitor error rates and latency closely. Feature flags enable routing 1% → 10% → 100%. If problems, flip the proxy back to monolith in seconds. (6) Migrate the service\'s data ownership (separate database, stop the monolith writing to those tables). (7) Repeat for the next bounded context. Continue until the monolith handles no traffic and can be decommissioned.'
    },
    {
      id: 'sf_2',
      q: 'What are the four types of feature toggles and when do you use each?',
      a: '(1) Release toggle: code is deployed but hidden behind a flag. Enables "dark launches" — deploy code to production without activating it. Use to decouple deployment from release. (2) Canary toggle: progressively roll out to % of users or specific segments (beta users, internal employees). Use to validate new features in production with limited blast radius. (3) Kill switch: instantly disable a feature in production without deploying. Use for features that could have dangerous side effects (new payment flow, data migration) or to react to production incidents. (4) A/B test toggle: route different user segments to different code paths for experimentation. Use to validate business hypotheses. All flags should have a defined owner, a planned expiry date, and be audited quarterly to prevent flag accumulation.'
    },
    {
      id: 'sf_3',
      q: 'What is the "big bang rewrite" and why does it almost always fail?',
      a: 'A big bang rewrite involves stopping all work on the existing system and rewriting it from scratch before deploying the new version. It fails because: (1) The existing system keeps evolving during the rewrite (new features, bug fixes), so the new system never reaches feature parity. (2) The team underestimates complexity — the existing system encodes years of edge cases and business rules not visible in the surface API. (3) The rewrite takes 3-5x longer than estimated, exhausting team and leadership patience. (4) The new system introduces new bugs (the old system\'s bugs were known; the new system has unknown bugs). (5) There\'s no incremental validation — the first real-world test is the full cutover. Joel Spolsky called it "the single worst strategic mistake a software company can make."'
    },
    {
      id: 'sf_4',
      q: 'How do you handle data ownership during a Strangler Fig migration when the new service needs data currently in the monolith\'s database?',
      a: 'Three strategies with increasing data isolation: (1) Temporary shared database access: the new service reads from the monolith\'s DB (breaking microservices rule, but acceptable during migration). Use read-only access. Plan a hard deadline to migrate off. (2) Dual-write + sync: both monolith and new service write to their respective DBs. A sync job or CDC (Debezium) keeps them in sync bidirectionally. Validate data consistency before cutting over reads to the new DB. (3) Strangler + event sync: monolith publishes events for all mutations. New service consumes events and maintains its own read model. When confident the read model is accurate, switch reads to the new service\'s DB and writes to the new service\'s API. Gradually eliminate dual-write. Each strategy has more complexity but more isolation. Choose based on your migration timeline and risk tolerance.'
    },
    {
      id: 'sf_5',
      q: 'Why do strangler fig migrations often stall at 70-80% completion, and how do you prevent it?',
      a: 'Stall reasons: (1) Easy wins extracted first; remaining bounded contexts are the most complex and coupled (auth, billing, core domain logic). (2) Team capacity redirected to new features — "the monolith still works, migration can wait." (3) Leadership considers the migration "done enough" after major services are extracted. (4) Technical debt of maintaining proxy + partial migration state is underestimated. Prevention: (1) Define "done" explicitly before starting (monolith decommissioned, all tables migrated, proxy removed). (2) Assign a dedicated migration team not responsible for monolith maintenance. (3) Set a hard monolith decommission date — creates urgency. (4) Track migration progress as a KPI (% of endpoints migrated, % of DB tables owned by new services). (5) Make the monolith progressively more painful to use as services are extracted — stop adding features to the monolith.'
    }
  ],

  // Phase 6
'docker-kubernetes': [
    {
      id: 'dk_1',
      q: 'What is the difference between a Kubernetes Deployment and a StatefulSet? Give an example use case for each.',
      a: 'A Deployment manages stateless pods: all replicas are interchangeable, have random names, and can be rescheduled to any node. Use for API servers, workers, and any service that stores no local state. A StatefulSet gives each pod a stable network identity (pod-0, pod-1, etc.), ordered startup/shutdown, and persistent volume claims that follow the pod. Use for databases, distributed caches with cluster membership (Redis Cluster, Kafka), and any app that requires stable identity or ordered initialization.'
    },
    {
      id: 'dk_2',
      q: 'What is the difference between a Kubernetes liveness probe and a readiness probe? What happens if each fails?',
      a: 'Liveness probe detects if a container is stuck and needs to be restarted. If it fails, kubelet kills and restarts the container. Use for detecting deadlocks or hung processes. Readiness probe detects if a container is ready to accept traffic. If it fails, the pod is removed from the Service\'s endpoint list — no traffic is sent — but the container is NOT restarted. Use during startup (waiting for DB connection, cache warm-up) or under load (temporarily stop sending traffic instead of cascading failure). Confusing the two causes either unnecessary restarts or traffic sent to unhealthy pods.'
    },
    {
      id: 'dk_3',
      q: 'What is the difference between resource requests and resource limits in Kubernetes, and how do they affect scheduling?',
      a: 'Resource requests are what the scheduler uses to determine if a node has enough capacity to run the pod — they are a reservation guarantee. Resource limits are the maximum a container can use at runtime, enforced by cgroups. A container using more CPU than its limit is throttled (not killed); a container exceeding its memory limit is OOMKilled. Best practice: set requests based on average utilization, set limits at ~2x requests to allow burst. Without requests, the scheduler cannot bin-pack nodes efficiently. Without limits, a runaway process can starve other pods on the same node.'
    },
    {
      id: 'dk_4',
      q: 'Explain what a PodDisruptionBudget (PDB) does and why it is important for production deployments.',
      a: 'A PodDisruptionBudget defines the minimum number of pods (or maximum disruption percentage) that must remain available during voluntary disruptions — node drains, cluster upgrades, or Deployment rollouts. Example: minAvailable: 2 on a 3-replica Deployment ensures at least 2 pods are running before a node is drained. Without a PDB, a node drain can kill all pods of a service simultaneously (e.g., if all 3 replicas happened to land on the same node being drained), causing a complete outage. PDBs protect against operator error during maintenance.'
    },
    {
      id: 'dk_5',
      q: 'What is a multi-stage Docker build and what problem does it solve?',
      a: 'A multi-stage Dockerfile uses multiple FROM instructions. Earlier stages compile/build the application; only the artifacts are copied to the final minimal stage. This solves image bloat: a Node.js app with a build stage might produce a 1.2GB image containing dev dependencies, build tools, and source maps. With a multi-stage build, the final image contains only the production node_modules and compiled output — typically 80-150MB. Smaller images mean faster pulls, faster pod startup, smaller attack surface (no build tools for an attacker to exploit), and reduced registry storage costs.'
    }
  ],

  'observability-stack': [
    {
      id: 'obs_1',
      q: 'What are the three pillars of observability and what question does each one best answer?',
      a: 'Metrics (time-series numbers) answer "Is the system healthy right now and over time?" — e.g., error rate, p99 latency, request rate. Best for alerting and dashboards. Logs (discrete events) answer "What happened at this specific moment?" — e.g., error messages, audit trails, debugging specific failures. Best for forensic investigation. Traces (request journeys across services) answer "Why is this specific request slow or failing?" — they show the full execution path including which service and operation added latency. All three are needed for complete observability; each alone has blind spots.'
    },
    {
      id: 'obs_2',
      q: 'Why are Prometheus histograms preferred over summaries for tracking latency in a multi-replica service?',
      a: 'Histograms store bucket counts on the server side and can be aggregated across all replicas using PromQL (e.g., histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))). Summaries compute quantiles on the client side inside each replica and cannot be meaningfully aggregated — summing p99 values from 10 replicas does not give you the actual p99 across all requests. In a 10-replica deployment, only histograms give you the true fleet-wide latency percentile.'
    },
    {
      id: 'obs_3',
      q: 'What is cardinality in the context of Prometheus, and what causes cardinality explosion?',
      a: 'Cardinality is the total number of unique time series in Prometheus — determined by the number of unique label value combinations. Each unique combination creates a separate time series that is indexed and stored. Cardinality explosion happens when a label has unbounded unique values: using user_id, request_id, or IP address as a label creates millions of time series, making the TSDB slow or OOM. Fix: never use high-cardinality identifiers as metric labels. Aggregate by business-meaningful low-cardinality dimensions (status_code, endpoint, region, customer_tier) instead.'
    },
    {
      id: 'obs_4',
      q: 'What is the difference between the RED and USE methods for alerting? When do you apply each?',
      a: 'RED (Rate, Errors, Duration) is for SERVICE-level observability: alert on request rate (are we receiving expected traffic?), error rate (are requests failing?), and duration/latency (are responses slow?). Apply RED to any service that handles requests. USE (Utilization, Saturation, Errors) is for RESOURCE-level observability: alert on how busy a resource is (utilization), whether requests are queueing up (saturation), and whether the resource is failing (errors). Apply USE to infrastructure: CPUs, memory, disks, network interfaces, and connection pools. Most production systems need both — RED alerts tell you the user is affected; USE alerts tell you which resource is causing it.'
    },
    {
      id: 'obs_5',
      q: 'What is an SLO error budget, and how does it influence engineering prioritization?',
      a: 'An SLO (Service Level Objective) is a reliability target, e.g., 99.9% availability. The error budget is the allowed failure budget: 0.1% of time = ~43 minutes/month of allowable downtime. The error budget burn rate tracks how quickly the budget is consumed. When burn rate is high (e.g., "at this rate we\'ll exhaust the monthly budget in 2 days"), it triggers a reliability response — stop shipping new features, focus on stability. When the budget has plenty of remaining margin, teams have confidence to ship faster. Error budgets replace the subjective argument "should we ship or stabilize?" with a data-driven answer tied to customer impact.'
    }
  ],

  'distributed-tracing': [
    {
      id: 'dt_1',
      q: 'What is the W3C traceparent header format, and what information does it carry?',
      a: 'The traceparent header format is: 00-{traceId}-{parentSpanId}-{traceFlags}. The version (00) is fixed. The traceId is a 32-character hex string (128-bit) that uniquely identifies the entire trace across all services. The parentSpanId is a 16-character hex string (64-bit) identifying the calling span — the receiving service creates a child span with this as its parent. The traceFlags is an 8-bit field where bit 0 (0x01) indicates the trace is sampled (all downstream services should record spans). Every service must forward this header unchanged to downstream HTTP calls for trace continuity.'
    },
    {
      id: 'dt_2',
      q: 'What is the difference between head-based and tail-based sampling in distributed tracing?',
      a: 'Head-based sampling decides whether to record a trace at the entry point (first service) before the outcome is known — e.g., sample 5% of all incoming requests. Simple and low-memory but may miss the 0.1% of requests that are slow or errored, which are exactly the ones you need to debug. Tail-based sampling buffers all spans for a trace window (e.g., 10 seconds) and makes the sampling decision after the trace completes — allowing "always sample errors" and "always sample traces > 2 seconds" policies. Much better signal quality but requires significant collector memory to buffer incomplete traces. OpenTelemetry Collector supports tail-based sampling via the tail_sampling processor.'
    },
    {
      id: 'dt_3',
      q: 'A distributed trace shows a 3-second gap between two spans with no child spans during that gap. What are possible causes?',
      a: 'Possible causes: (1) An async operation — the code awaited a setTimeout, a message queue consumer delay, or a scheduled job with no instrumented child span. (2) A missing span — a library or function that performs significant work was not instrumented (e.g., a crypto operation, a compression step). (3) Thread/event loop blocking — CPU-intensive synchronous work paused the event loop without creating a span. (4) An uninstrumented external call — a third-party HTTP client or driver that was not auto-instrumented. (5) Clock skew — the gap is an artifact of time drift between services, not real elapsed time. Debug by adding manual spans around suspected operations and checking NTP sync between services.'
    },
    {
      id: 'dt_4',
      q: 'How do you maintain trace continuity through an asynchronous Kafka message boundary?',
      a: 'Trace context must be serialized into the Kafka message headers when producing and deserialized when consuming. The producer extracts the current span context using the OTEL propagation API and injects it into a message header (e.g., W3C traceparent). The consumer extracts the trace context from the header and creates a new span with that context as its parent using context.with(extractedContext, ...). This creates a "linked" trace — the consumer span is a child of the producer span — maintaining the logical trace chain across the async boundary. The OpenTelemetry Kafka instrumentation handles this automatically, but the consumer must use the correct context when creating child spans.'
    },
    {
      id: 'dt_5',
      q: 'What is the OpenTelemetry Collector and why is it recommended over direct SDK-to-backend export?',
      a: 'The OpenTelemetry Collector is a vendor-agnostic proxy for telemetry data. Apps export to the local Collector via OTLP; the Collector pipelines data through processors and exports to one or more backends. Benefits over direct export: (1) Vendor portability — change the backend (Jaeger, Datadog, Tempo) without touching application code. (2) Tail-based sampling — the Collector buffers spans and samples by outcome; the SDK alone cannot do this. (3) Attribute enrichment — add k8s metadata (pod name, namespace) from the environment. (4) PII scrubbing — redact sensitive attributes before they leave the cluster. (5) Batching and retry — the Collector handles backpressure more reliably than per-process SDK export.'
    }
  ],

  'chaos-engineering': [
    {
      id: 'ce_1',
      q: 'What is the scientific method as applied to chaos engineering? Describe the key steps.',
      a: 'The chaos engineering scientific method: (1) Define steady state — identify measurable metrics that represent normal system behavior (e.g., p99 latency < 200ms, error rate < 0.1%). (2) Hypothesize — "The system will maintain steady state even if one availability zone goes offline." (3) Design the experiment — choose the fault type, scope (which services, what percentage of traffic), and duration. Set up a kill switch. (4) Introduce chaos — inject the fault in a controlled way (kill AZ, inject latency, terminate pods). (5) Observe — did the system maintain steady state? What metrics changed? (6) Fix and learn — if steady state was broken, identify the gap (missing circuit breaker, insufficient replicas) and fix it before running again.'
    },
    {
      id: 'ce_2',
      q: 'What is blast radius in chaos engineering and how do you control it?',
      a: 'Blast radius is the scope of potential impact of a chaos experiment — how many users, services, or data could be affected if the experiment goes wrong. Control strategies: (1) Scope by namespace or label selector — target only specific pods rather than all pods of a service. (2) Percentage-based mode — affect 10% of instances instead of all. (3) Start in staging — run experiments against a staging environment that mirrors production before touching production. (4) Time-box experiments — auto-terminate after N minutes (Chaos Mesh duration field). (5) Kill switch — have a one-click abort mechanism that removes all chaos faults immediately. (6) Off-peak timing — run first production experiments during lowest traffic periods. (7) Runbook readiness — ensure you have a tested recovery procedure before starting.'
    },
    {
      id: 'ce_3',
      q: 'How does Toxiproxy enable resilience testing in integration test suites?',
      a: 'Toxiproxy is a TCP proxy that sits between your service and its dependencies (databases, downstream APIs). It injects network faults — latency, bandwidth limits, connection resets, and timeouts — programmatically via an HTTP API. In integration tests: spin up Toxiproxy, point your service at the proxy instead of the real dependency, then use the API to inject faults and assert that your service handles them correctly (circuit opens, retries succeed, fallback is returned). This validates that your timeouts, retries, and circuit breakers actually work before you go to production. Unlike production chaos, Toxiproxy tests are repeatable, isolated, and run in CI without any risk.'
    },
    {
      id: 'ce_4',
      q: 'Why must you implement observability BEFORE running chaos experiments?',
      a: 'Chaos experiments are only useful if you can measure the system\'s steady state before, during, and after the experiment. Without observability: you cannot define the steady state baseline (what is "normal" for this system?), you cannot detect whether the experiment actually affected behavior, and you cannot distinguish "the chaos had no effect" from "we had no visibility into the effect." Additionally, chaos experiments can uncover failure modes that surface as cascading failures in unexpected parts of the system — you need distributed tracing and metrics across the full system to identify what broke and why. Chaos without observability is just breaking things randomly.'
    },
    {
      id: 'ce_5',
      q: 'What is the difference between chaos engineering and traditional fault tolerance testing?',
      a: 'Traditional fault tolerance testing validates known failure modes against expected behaviors (e.g., "when the primary DB fails, the replica takes over in < 30 seconds"). It is narrow, scripted, and tests what you already anticipated. Chaos engineering explores unknown failure modes by deliberately inducing random and complex failures to discover emergent weaknesses — failure modes you did not anticipate during design. It is exploratory and scientific, not just validation. Chaos engineering also continuously runs in production to build ongoing confidence, not just as a pre-launch gate. The key insight from Netflix and others is that complex distributed systems have failure modes that cannot be predicted by analysis alone — they must be discovered empirically.'
    }
  ],

  'incident-management': [
    {
      id: 'im_1',
      q: 'What is the role of an Incident Commander and why should they not do hands-on technical work during an incident?',
      a: 'The Incident Commander (IC) owns the incident response: they declare severity, coordinate responders, make decisions (to roll back or not), manage escalations, and ensure the team is unblocked. They do NOT personally diagnose or fix the issue because: (1) Cognitive load — debugging a complex system failure requires deep focus; context-switching between debugging and coordination degrades both. (2) Blind spots — the person most likely to fix it may also be most likely to be wrong about the diagnosis; an IC who is an outside observer asks better clarifying questions. (3) Communication gap — while the IC is heads-down in code, stakeholders get no updates, anxiety escalates, and managers start interfering. The IC\'s job is to maximize the team\'s throughput, not to be the hero.'
    },
    {
      id: 'im_2',
      q: 'Explain blameless postmortems. What does "blameless" actually mean in practice?',
      a: 'Blameless postmortems operate on the assumption that engineers are intelligent professionals who made reasonable decisions given the information, tools, and time pressure they had at the moment of the incident. "Blameless" does not mean no accountability — it means the system (processes, tooling, monitoring gaps, architectural weaknesses) is held accountable, not the individual. In practice: postmortem language describes what happened, not who failed. Example: "The deploy proceeded without triggering an alert" not "Bob deployed without testing." The question "why did the engineer not know X?" leads to action items for better tooling, runbooks, or training — not disciplinary action. Blameless culture produces honest postmortems; blame culture produces cover-ups and repeated incidents.'
    },
    {
      id: 'im_3',
      q: 'What is MTTR and MTTD, and what investment does each metric guide?',
      a: 'MTTD (Mean Time To Detect) measures the average time from when an incident starts to when the team is aware of it. High MTTD indicates gaps in monitoring, alerting, or alert routing — invest in better metrics, alert tuning, and synthetic monitoring. MTTR (Mean Time To Restore) measures the average time from incident detection to full service restoration. High MTTR indicates gaps in runbooks, tooling, access permissions, or deployment velocity — invest in automated rollback, better runbooks, faster deploys, and on-call training. Tracking both separately helps direct investment: a team with good MTTD but poor MTTR needs better incident response tooling, not better alerting.'
    },
    {
      id: 'im_4',
      q: 'What is the key principle of incident response: "mitigate first, fix later"? Give a concrete example.',
      a: '"Mitigate first, fix later" means your first priority is restoring service to users, even if the fix is a crude workaround, not the correct root cause fix. Example: A bad database migration caused a column to go null, crashing the API for all users. Option A: spend 2 hours tracing through the migration code to write a corrective migration. Option B: roll back the release in 5 minutes and restore service. The correct answer in an active incident is always Option B. Rollback first, restore users, then diagnose and fix the root cause properly with no time pressure. This principle prevents engineers from letting perfect be the enemy of good during incidents when every minute of downtime has user and business impact.'
    },
    {
      id: 'im_5',
      q: 'What makes a good postmortem action item vs a poor one? Give an example of each.',
      a: 'Poor action item: "Improve monitoring." — Vague, unassigned, no deadline, no way to know when it is done. Poor action item: "Engineers should be more careful with migrations." — This is blame, not a systemic fix; it will not prevent recurrence. Good action item: "Add a CI check that blocks database migrations which execute a DROP INDEX or DROP COLUMN on tables > 1M rows. Owner: @alice. Due: 2025-01-20. P0." — This is specific (what exactly will be built), assigned (who is accountable), time-bound (when), prioritized, and measurable (the CI check either passes or fails). Good postmortem action items are first-class engineering tickets that compete in sprint planning, not footnotes that get forgotten.'
    }
  ],

  'cloud-cost-optimization': [
    {
      id: 'cc_1',
      q: 'Explain the three main Compute purchasing models in AWS (on-demand, reserved, spot) and when to use each.',
      a: 'On-demand: Pay per second with no commitment. Use for unpredictable workloads, testing, and new services where utilization patterns are unknown. Full price — most expensive. Reserved Instances / Savings Plans: 1-3 year commitment for 30-60% discount. Use for steady baseline workloads with predictable utilization (e.g., your API servers that run 24/7). Buy after 3 months of production data to avoid committing to the wrong size. Spot Instances: Use spare AWS capacity at 60-90% discount; can be interrupted with 2-minute notice. Use for stateless, fault-tolerant workloads: batch jobs, CI/CD workers, stateless API replicas (with graceful shutdown). Never use for stateful systems or single-replica deployments without a fallback strategy.'
    },
    {
      id: 'cc_2',
      q: 'What is FinOps and how does it differ from traditional IT cost management?',
      a: 'FinOps (Financial Operations) is a cultural and organizational practice that brings financial accountability to cloud spending by creating collaboration between engineering, finance, and business teams. Traditional IT cost management treats infrastructure as a capital expenditure with fixed budgets, managed by a central IT department. Cloud cost is operational expenditure that scales with usage, generated by individual engineering decisions in real time. FinOps shifts cost visibility to engineers (they see the cost impact of their choices) and creates a feedback loop: tagging resources enables attribution, attribution creates team ownership, and ownership drives optimization. The key shift: from "the finance team manages costs" to "every engineer considers cost a metric alongside latency and reliability."'
    },
    {
      id: 'cc_3',
      q: 'How does Karpenter differ from the Kubernetes Cluster Autoscaler, and how does it reduce costs?',
      a: 'Cluster Autoscaler adds or removes nodes based on Pending pods and underutilization, but uses pre-defined node groups (ASGs) with fixed instance types. It cannot choose which instance type is cheapest for a given workload. Karpenter directly provisions EC2 instances (bypassing ASGs) by evaluating pending pods and selecting the cheapest available instance type that satisfies the pod requirements — choosing from hundreds of instance types and sizes. It also consolidates (bin-packs) existing workloads: if two pods could fit on one node instead of two, Karpenter migrates and terminates the underutilized node. Additionally, Karpenter can interrupt and replace running spot instances with cheaper ones as spot prices fluctuate. Result: 20-40% cost reduction vs Cluster Autoscaler through better instance selection and continuous consolidation.'
    },
    {
      id: 'cc_4',
      q: 'What are the most common sources of hidden cloud cost waste that teams discover during a cost audit?',
      a: 'Most common sources: (1) Unattached EBS volumes — created by terminated EC2 instances, keep billing at $0.10/GB/month. (2) Idle/oversized RDS instances — provisioned for a peak that never arrived, running at 5% CPU. (3) NAT Gateway data processing charges — $0.045/GB processed; a chatty microservice can generate hundreds of GB/day. (4) Unused Elastic IPs — billed when not attached to a running instance. (5) Old S3 buckets with no lifecycle policies — log archives accumulating for years. (6) Dev/staging environments running 24/7 at production-scale — should be ephemeral (on-demand) or scaled down overnight. (7) Cross-region data transfer — services in different regions communicating frequently at $0.02/GB each way. (8) GP2 EBS volumes that should be GP3 — GP3 is cheaper AND more performant.'
    },
    {
      id: 'cc_5',
      q: 'How does Infracost shift cost awareness "left" in the development process?',
      a: 'Infracost integrates with CI/CD to analyze Terraform or Pulumi plans and post a cost diff on every pull request — showing the exact monthly cost change before infrastructure is provisioned. Example: a PR adding a new RDS instance shows "+$243.20/month" as a PR comment, visible to the author and reviewers at review time. This shifts cost visibility to the moment the decision is made (the PR) rather than weeks later on a cloud bill. Engineers develop an intuitive sense of what infrastructure costs, leading to architectural choices that consider cost alongside performance. It also enables cost thresholds in CI: fail the PR if it increases costs by > $X without explicit approval, similar to how test failures gate deploys.'
    }
  ],

  'system-design-prep': [
    {
      id: 'sd_1',
      q: 'What is consistent hashing and why is it important for distributed caches?',
      a: 'Consistent hashing places both cache nodes and keys on a virtual ring (based on hash values). A key is assigned to the first node clockwise from its position on the ring. The critical property: when a node is added or removed, only 1/N keys need to be remapped (where N is the number of nodes) — compared to modular hashing (key % N) which remaps nearly all keys when N changes. This matters for distributed caches because: (1) Adding a cache node during scale-up does not cause a cache stampede on all existing data. (2) Removing a node (failure) only invalidates the keys that were on that node. (3) Virtual nodes (assigning each physical node multiple positions) balance load more evenly across heterogeneous nodes.'
    },
    {
      id: 'sd_2',
      q: 'Explain the fan-out on write vs fan-out on read tradeoff for a social media news feed.',
      a: 'Fan-out on write: when a user posts, immediately write the post ID into every follower\'s feed cache. Reads are O(1) — just fetch pre-computed feed. Writes are O(followers) — for a celebrity with 10M followers, one tweet causes 10M cache writes. Fan-out on read: store posts in a single place; at read time, fetch all followed users\' recent posts and merge them. Writes are O(1). Reads are O(following count) and require merging N sorted lists. Production solution is hybrid: fan-out on write for users with fewer than ~10,000 followers (fast reads, manageable write cost); fan-out on read for celebrities (avoid the millions of writes per tweet). The celebrity\'s posts are fetched at read time and merged with the pre-computed feed of regular followees.'
    },
    {
      id: 'sd_3',
      q: 'How would you design a distributed rate limiter that works across multiple API gateway instances?',
      a: 'A local in-process rate limiter (sliding window counter in memory) does not work when multiple gateway instances handle the same user\'s requests. Distributed solutions: (1) Redis Sliding Window: use a Redis sorted set per user key (ZADD timestamp, ZREMRANGEBYSCORE to evict old entries, ZCARD to count). Atomic with Lua script or Redis pipelines. Handles ~100k ops/sec per Redis node. (2) Redis Cell (Redis module): implements GCRA (Generic Cell Rate Algorithm) with a single INCR-like command — most efficient. (3) Token Bucket in Redis: store {tokens, last_refill_time} per user; Lua script atomically refills and decrements. Considerations: Redis must be HA (Sentinel or Cluster). For multi-region, use a fixed window approximation across regions rather than a globally synchronized counter to avoid cross-region latency on every API call.'
    },
    {
      id: 'sd_4',
      q: 'When designing a system, how do you choose between SQL and NoSQL databases? What are the key decision factors?',
      a: 'Choose SQL when: you need ACID transactions (financial data, inventory), your data has complex relational structure with many joins, your schema is well-defined and relatively stable, or you need strong consistency. Choose NoSQL when: you need horizontal write scaling beyond what a single SQL primary can handle (> ~50k writes/sec), your access patterns are key-based (DynamoDB, Redis), your data is naturally document-shaped with variable schema (MongoDB), you need geographic distribution with tunable consistency (Cassandra, DynamoDB Global Tables), or you need time-series performance (InfluxDB, TimescaleDB). Key factors: consistency model needed (ACID vs BASE), read/write patterns, schema flexibility, scale requirements, and operational expertise. Note: PostgreSQL handles most use cases well up to very high scale — evaluate NoSQL only when you have a concrete limitation SQL cannot address.'
    },
    {
      id: 'sd_5',
      q: 'What are the latency numbers every backend engineer should know for system design estimation?',
      a: 'Critical numbers (approximate): L1 cache ~0.5ns, L2 cache ~7ns, RAM read ~100ns, mutex lock/unlock ~25ns. SSD sequential read ~1GB/s (1ns/byte), SSD random read ~150μs. HDD random seek ~10ms. Network: same datacenter ~500μs RTT, same region ~1ms, cross-region US ~50ms, cross-continent ~150ms. Memory is ~1,000x faster than SSD; SSD is ~100x faster than HDD; network (cross-DC) is ~100x slower than SSD. Implications: avoid cross-region synchronous calls in the hot path; use caching to serve reads from RAM instead of SSD/disk; batch small disk reads. At 10ms per HDD read, you can only do 100 reads/second per disk — sequential access and caching are not optional at scale.'
    }
  ],

  'career-backend': [
    {
      id: 'cb_1',
      q: 'What distinguishes a Senior Engineer from a Mid-level Engineer, and what distinguishes Staff from Senior?',
      a: 'Mid → Senior: A senior engineer handles ambiguous problems without needing requirements pre-specified. They own features end-to-end including production behavior (on-call, postmortems). They design systems, not just implement them. They proactively identify technical risks and gaps. They mentor junior engineers and improve team practices. Senior → Staff: A staff engineer\'s scope extends beyond their immediate team. They drive cross-team technical initiatives (a platform migration, an API redesign affecting 5 teams). They write the RFC that sets technical direction for the org. They operate at 6-12 month horizons. Their impact multiplies other engineers\' output — by improving tooling, establishing standards, and unblocking architectural decisions. The key shift: senior engineers make their team more effective; staff engineers make multiple teams more effective.'
    },
    {
      id: 'cb_2',
      q: 'What is the STAR method for behavioral interviews and how should you use it?',
      a: 'STAR = Situation, Task, Action, Result. Situation: brief context (1-2 sentences, enough to understand the problem). Task: what was YOUR responsibility in this situation? Action: what did YOU specifically do? (Not "we" — use "I"; describe your specific decisions and actions, not what the team did collectively.) Result: what was the measurable outcome? Include numbers where possible (reduced latency by 40%, reduced incident count by 3x, onboarded 2 engineers). Common mistakes: spending too long on Situation, not enough on Action; using "we" throughout (interviewers cannot assess your individual contribution); no Result or a vague one ("things improved"). Prepare 8-10 stories covering conflict, failure/recovery, influencing without authority, technical mentorship, and ambiguous initiative.'
    },
    {
      id: 'cb_3',
      q: 'What is a Technical Design Document (TDD/RFC) and why is writing one a key senior+ skill?',
      a: 'A Technical Design Document is a written proposal for a significant technical change — a new service, a database migration, an API redesign. It describes the problem, proposed solution, alternatives considered, tradeoffs, and success metrics. Writing TDDs is a key senior+ skill because: (1) It forces structured thinking — the act of writing reveals assumptions and gaps that whiteboard discussions miss. (2) It creates async alignment — stakeholders review and comment without requiring a synchronous meeting. (3) It builds organizational knowledge — a searchable archive of why decisions were made. (4) It demonstrates leadership — driving the document means driving the decision. At staff level, your ability to write a clear, comprehensive RFC that achieves org-wide alignment is a primary signal of scope and impact. Interviewers assess TDD quality as a proxy for communication and technical breadth.'
    },
    {
      id: 'cb_4',
      q: 'How should you negotiate a job offer as a software engineer? What are the key principles?',
      a: 'Key principles: (1) Always negotiate — first offers are rarely best offers; recruiters expect negotiation. (2) Negotiate total compensation, not just base: RSU grant size AND vesting schedule (4-year with 1-year cliff is standard but negotiable), sign-on bonus, and performance review timing all matter. (3) Use data — research Levels.fyi for your target level at the target company; "based on market data for this level, I was expecting $X" is stronger than "I want more." (4) Compete offers — a competing offer is the strongest negotiating tool; even a competing interview process (not offer) can justify a 10-day decision extension. (5) Be specific — "I was hoping for $X in base and $Y in RSUs" is better than "can you do better?" (6) Respond in writing after verbal negotiation to create a clear record. The recruiter is not your adversary — they often have budget flexibility and want to close.'
    },
    {
      id: 'cb_5',
      q: 'How do you balance technical depth and breadth as a backend engineer across your career?',
      a: 'Junior/mid engineers should invest heavily in depth — become genuinely excellent at one or two core areas (e.g., distributed systems + databases). This builds the credibility and problem-solving foundation for everything else. Senior engineers maintain depth in 2-3 areas while developing working knowledge of the full backend stack — you do not need to be an expert in Kubernetes, but you need to understand it well enough to design systems that run on it. Staff/principal engineers need broad systemic understanding — knowing enough about each domain to identify cross-cutting concerns, evaluate tradeoffs, and ask the right questions, even if specialists on the team go deeper. The T-shaped engineer (deep in one area, wide across others) is the target model. Breadth without depth is trivia; depth without breadth creates blind spots in architecture decisions.'
    }
  ],

  // Phase 3
  'serialization': [
    {
      id: 'ser_1',
      q: 'What is the difference between serialization and deserialization?',
      a: 'Serialization converts an in-memory data structure (object, class instance) into a format that can be transmitted or stored — JSON string, binary bytes, XML. Deserialization is the reverse: parsing that format back into a live data structure. Every API request and response involves both operations.'
    },
    {
      id: 'ser_2',
      q: 'What are the key limitations of JSON.stringify / JSON.parse?',
      a: 'JSON does not support: undefined values (they are omitted), Date objects (serialized as strings, not re-hydrated on parse), Map/Set, circular references (throws an error), BigInt, or binary data. Always validate the output of JSON.parse — it returns any, not a typed object, so schema validation is required before trusting the data.'
    },
    {
      id: 'ser_3',
      q: 'What is the difference between JSON, MessagePack, and Protocol Buffers?',
      a: 'JSON is human-readable text, universally supported, but verbose (field names repeated in every message). MessagePack is a binary format that mirrors JSON\'s type system but is 20-50% smaller and faster to parse. Protocol Buffers (protobuf) use a schema (.proto file) to assign integer field IDs — field names are not transmitted at all, making it much more compact and faster, but requiring the schema on both sides. Use JSON for public APIs; protobuf for internal microservice communication at scale.'
    },
    {
      id: 'ser_4',
      q: 'Why is schema validation critical during deserialization, and what tool do Node.js engineers use?',
      a: 'JSON.parse returns an untyped value — you have no guarantee the payload has the expected shape. A missing required field or wrong type will cause a runtime crash deep in business logic, far from the entry point. Schema validation (Zod, Joi, ajv) should happen at the API boundary, immediately after parsing, returning a 400 with clear field-level errors before the data ever reaches a service layer.'
    },
    {
      id: 'ser_5',
      q: 'What is a custom toJSON() method in JavaScript and when would you use it?',
      a: 'JSON.stringify calls toJSON() on an object if it exists, using the return value instead of the raw object. Use cases: exclude sensitive fields (password, internalId) from serialization, format Date objects consistently, serialize class instances that have methods you don\'t want exposed. Example: UserModel.prototype.toJSON = function() { const { password, ...safe } = this; return safe; }.'
    },
    {
      id: 'ser_6',
      q: 'What is the performance cost of JSON serialization and how can you reduce it?',
      a: 'JSON.stringify and JSON.parse are CPU-intensive — parsing a 1 MB JSON body at 1000 req/s means serializing 1 GB/s of text. Optimizations: use a fast serializer like fast-json-stringify (compiles a schema into a serialization function, 3-5x faster than JSON.stringify); limit payload sizes with pagination; use binary protocols (protobuf/msgpack) for internal services; stream large responses with JSON streaming instead of building a giant string in memory.'
    },
    {
      id: 'ser_7',
      q: 'What is the difference between deep copy and shallow copy, and how does JSON help?',
      a: 'A shallow copy duplicates the top-level object but nested objects are still shared references. A deep copy creates independent copies at every level. JSON round-trip (JSON.parse(JSON.stringify(obj))) is the simplest deep clone — but it loses undefined values, Date objects, functions, and circular references. For production use, structuredClone() (Node 17+) handles more types correctly and is significantly faster.'
    },
    {
      id: 'ser_8',
      q: 'What is the reviver parameter in JSON.parse and when would you use it?',
      a: 'JSON.parse(text, reviver) calls the reviver function for each key-value pair during parsing, allowing you to transform values. The most common use: revive ISO date strings back into Date objects. Example: JSON.parse(data, (key, val) => key === "createdAt" ? new Date(val) : val). Without a reviver, all JSON dates arrive as strings and require manual conversion throughout your code.'
    },
    {
      id: 'ser_9',
      q: 'What is data envelope pattern in API responses and why does it matter for versioning?',
      a: 'An envelope wraps the actual payload in a consistent outer structure: { "data": {...}, "meta": { "page": 1, "total": 50 }, "error": null }. This matters for versioning because it gives you a stable container to add metadata, pagination, or error details without breaking clients that read only the data field. It also distinguishes successful responses from errors at the structural level, not just via HTTP status code.'
    }
  ],

  'request-context': [
    {
      id: 'reqctx_1',
      q: 'What is request context and why is it needed in a backend service?',
      a: 'Request context is data tied to a specific incoming request — the authenticated user, request ID, tracing headers, locale — that needs to be accessible throughout the call stack without explicitly passing it as a function argument through every layer. Without request context, every function from controller to service to repository would need an extra ctx parameter, or you risk accidentally sharing state between concurrent requests.'
    },
    {
      id: 'reqctx_2',
      q: 'What is AsyncLocalStorage in Node.js and how does it solve request context propagation?',
      a: 'AsyncLocalStorage (built-in since Node 12.17) is a store that is automatically inherited by all async operations spawned within a run() callback. You call store.run({ requestId, userId }, () => handler(req, res)) at the middleware layer. Any function called within that async chain — even nested promises and callbacks — can call store.getStore() to read the context without it being passed as an argument. It is Node\'s implementation of thread-local storage for the async world.'
    },
    {
      id: 'reqctx_3',
      q: 'What is a request ID (trace ID), and what are the two places it must appear?',
      a: 'A request ID is a unique identifier (UUID v4 or nanoid) generated per incoming request. It must appear in: (1) every log line emitted during that request\'s lifecycle, so you can grep all logs for a single request; and (2) the response headers (X-Request-Id: <id>), so clients and support teams can report the ID when filing a bug. Without it, debugging a specific user\'s failure in a high-traffic log stream is nearly impossible.'
    },
    {
      id: 'reqctx_4',
      q: 'How do you propagate request context across microservice boundaries?',
      a: 'Inject context values as HTTP headers in outbound requests. The W3C Trace Context standard defines two headers: traceparent (trace-id + span-id + flags) and tracestate (vendor-specific data). In practice: extract the trace ID from the incoming request, attach it as a header on every downstream HTTP call, and have each service log with that trace ID. This creates a distributed trace across services that tools like Jaeger, Zipkin, or Datadog can visualize end-to-end.'
    },
    {
      id: 'reqctx_5',
      q: 'What are the risks of using a global variable or module-level object for request context?',
      a: 'Node.js handles requests concurrently on a single thread. A global variable is shared across ALL concurrent requests — request A\'s data will be overwritten by request B\'s data mid-flight. This causes subtle data leaks: users seeing another user\'s data in logs or responses. AsyncLocalStorage avoids this because each async execution context gets its own store, even though they run on the same thread.'
    },
    {
      id: 'reqctx_6',
      q: 'What user data should always be available in request context for a typical REST API?',
      a: 'At minimum: requestId (for log correlation), userId / tenantId (for authorization checks and audit logs), userRole / permissions (to avoid re-fetching from DB on every authorization check), and startTime (to compute request duration for metrics). Some services also store the authentication token, locale, and feature flags in context so downstream functions can make decisions without additional I/O.'
    },
    {
      id: 'reqctx_7',
      q: 'How would you implement request context in Express without a third-party library?',
      a: 'Create an AsyncLocalStorage instance, export it as a module singleton. Add early middleware: app.use((req, res, next) => { store.run({ requestId: req.headers["x-request-id"] || uuid(), userId: null }, next); }). After authentication middleware resolves the user, update the store: store.getStore().userId = req.user.id. Any function in the call chain calls store.getStore() to read context. The logger reads requestId from store.getStore() automatically on every log call.'
    },
    {
      id: 'reqctx_8',
      q: 'What is the difference between request context and session?',
      a: 'Request context is transient — it exists only for the duration of a single HTTP request/response cycle and is stored in memory. Session is persistent across multiple requests — stored server-side (DB, Redis) or client-side (signed cookie/JWT). Context is for intra-request data flow; session is for state that spans multiple requests from the same user over time (e.g., shopping cart, authentication state).'
    }
  ],

  'mvc-architecture': [
    {
      id: 'mvc_1',
      q: 'What are the three layers in MVC and what is each responsible for?',
      a: 'Model: data access and persistence (database queries, ORM models, data validation). View: presentation layer — in REST APIs this is the JSON serializer/response formatter; in server-rendered apps it is the template. Controller: receives the HTTP request, delegates to services, and returns the response. The controller is thin — it orchestrates but does not contain business logic.'
    },
    {
      id: 'mvc_2',
      q: 'What is the difference between a Controller and a Service?',
      a: 'A Controller handles HTTP concerns: parsing req.body, calling services, setting status codes, sending res.json(). It knows about HTTP. A Service contains business logic: calculating prices, enforcing business rules, coordinating multiple data sources. It knows nothing about HTTP — it takes plain arguments and returns plain values. This separation means the same service can be called from an HTTP handler, a queue worker, a cron job, or a test without modification.'
    },
    {
      id: 'mvc_3',
      q: 'What is the "fat controller" anti-pattern?',
      a: 'A fat controller contains business logic directly in the route handler — DB queries, calculations, conditional business rules all mixed together. Problems: untestable (must make real HTTP requests to test logic), not reusable (another entry point like a worker cannot call this logic), violates single responsibility. Fix: extract the logic into a service, leaving the controller responsible only for HTTP input/output.'
    },
    {
      id: 'mvc_4',
      q: 'What is the Repository pattern and how does it fit into MVC layering?',
      a: 'The Repository pattern abstracts data access behind an interface — instead of calling db.query() directly in a service, the service calls userRepository.findById(id). The repository implementation handles the SQL/ORM details. Benefits: services become testable by injecting a mock repository, switching databases only requires changing the repository implementation, and complex query building is isolated in one place. In layered architecture: Controller → Service → Repository → Database.'
    },
    {
      id: 'mvc_5',
      q: 'Why should validation happen in the Controller layer, not the Service layer?',
      a: 'Validation of HTTP input (field presence, type checking, format constraints) is an HTTP concern — it determines whether the request is well-formed enough to process. The Service layer should receive already-validated, trusted data and focus on business rules. If validation lived in services, every caller (HTTP handler, queue worker, test) would need to handle HTTP-specific error formats. The controller validates with a schema (Zod/Joi), returns 400 on failure, then passes clean data to the service.'
    },
    {
      id: 'mvc_6',
      q: 'What is "separation of concerns" and why does it matter in production codebases?',
      a: 'Separation of concerns means each module/layer has one well-defined responsibility and does not reach into the concerns of other layers. It matters because: code is independently testable (test the service without HTTP), changes are localized (swapping the ORM only affects the repository layer), onboarding is faster (engineers know where each type of logic belongs), and bugs are easier to find (HTTP issue → controller, business rule bug → service, data issue → repository).'
    },
    {
      id: 'mvc_7',
      q: 'How does dependency injection improve testability in an MVC service layer?',
      a: 'Dependency injection means passing collaborators (database clients, external API clients, mailers) into a service constructor rather than importing them directly. Example: class UserService { constructor(userRepo, emailService) {...} } instead of importing them at the top. In tests, you inject mock implementations. In production, you inject real ones. Without DI, services have hardwired dependencies that cannot be replaced in tests without monkey-patching module internals, which is fragile and difficult.'
    },
    {
      id: 'mvc_8',
      q: 'What is a DTO (Data Transfer Object) and where in the MVC stack does it belong?',
      a: 'A DTO is a plain object that defines the shape of data flowing between layers — typically the validated input entering a service and the shaped output leaving it. DTOs live at layer boundaries: the controller validates req.body into a CreateUserDto before passing it to the service; the service returns a UserResponseDto (which excludes password) that the controller serializes to JSON. They make the contract between layers explicit and type-safe without coupling layers to the full database model shape.'
    },
    {
      id: 'mvc_9',
      q: 'How do you handle cross-cutting concerns (logging, auth checks) in MVC without duplicating code?',
      a: 'Use middleware (Express) or decorators/guards (NestJS) to apply cross-cutting concerns at the framework level before the controller executes. Authentication check as middleware runs before all protected routes. Logging middleware wraps all requests. Rate limiting is a middleware. This ensures the concerns are applied consistently, are individually testable, and do not pollute controller or service code. For more granular control (per-method auth), use middleware at the router level or guard decorators on individual controller methods.'
    }
  ],

  'crud-deep-dive': [
    {
      id: 'crud_1',
      q: 'What is the difference between PATCH and PUT, and which is safer for partial updates?',
      a: 'PUT replaces the entire resource — if you omit a field, it is set to null or its default. PATCH applies a partial update — only the fields included in the request body are changed. PATCH is safer for partial updates because a client only needs to send the fields it wants to change, not the full resource. PUT is only safe when the client has the full current state of the resource and intentionally wants to replace it entirely.'
    },
    {
      id: 'crud_2',
      q: 'What is cursor-based pagination and why is it preferred over offset pagination at scale?',
      a: 'Cursor pagination uses a pointer to the last seen item (usually encoded as an opaque base64 string containing id + timestamp) as the starting point for the next page: WHERE created_at < :cursor ORDER BY created_at DESC LIMIT 20. This is O(log N) via the index. Offset pagination (LIMIT 20 OFFSET 1000) scans and discards 1000 rows before returning 20 — O(N). At 1M rows, offset pagination for page 50,000 reads 1 million rows. Cursor pagination always reads exactly the page size, regardless of depth.'
    },
    {
      id: 'crud_3',
      q: 'What is a soft delete and what are the tradeoffs of using it?',
      a: 'A soft delete marks a record as deleted (deleted_at IS NOT NULL or is_deleted = true) instead of removing it from the database. Advantages: data is recoverable, audit trail is preserved, foreign key relationships remain intact. Disadvantages: every query must include WHERE deleted_at IS NULL (easily forgotten, causing deleted records to reappear), indexes bloat with deleted rows, and UNIQUE constraints no longer prevent "deleted" duplicates (e.g., a deleted email can block re-registration). Mitigations: use a partial index on deleted_at, use a DB view that filters deleted records, or archive soft-deleted records to a separate table.'
    },
    {
      id: 'crud_4',
      q: 'How should you implement filtering and sorting in a REST API safely?',
      a: 'Never interpolate query parameters directly into SQL strings (SQL injection). Use an allowlist: define exactly which fields are filterable and sortable, validate the request against that list, then build the query programmatically. Example: const SORTABLE = ["created_at", "name"]; if (!SORTABLE.includes(req.query.sort)) throw 400. For complex filtering, consider a structured query parameter format (filter[status]=active&filter[role]=admin) that maps to parameterized SQL predicates. Never let the client pass arbitrary SQL expressions.'
    },
    {
      id: 'crud_5',
      q: 'What does "upsert" mean and when would you use it over a separate insert/update?',
      a: 'Upsert (INSERT ... ON CONFLICT ... DO UPDATE in PostgreSQL, upsert in Prisma) inserts a new record if it does not exist, or updates it if it does — in a single atomic operation. Use it when: syncing external data (a webhook event that may arrive more than once), ensuring exactly one record exists for a unique key (user settings), or idempotent write operations. The alternative — check if exists, then insert or update — is not atomic and creates a race condition window in concurrent environments.'
    },
    {
      id: 'crud_6',
      q: 'What should a DELETE endpoint return? What HTTP status codes are appropriate?',
      a: '204 No Content is the standard for a successful deletion with no response body. 200 OK is acceptable if you return metadata (e.g., { "deleted": true, "id": "..." }). 404 Not Found if the resource does not exist. Important edge case: decide if DELETE is idempotent — deleting an already-deleted resource should typically return 204 (not 404) to make it safe to retry without error handling on the client.'
    },
    {
      id: 'crud_7',
      q: 'How do you handle bulk operations (bulk create / bulk delete) in a REST API?',
      a: 'For bulk create: POST /resources/bulk with an array body, returning 207 Multi-Status with per-item results ({ id: "...", status: "created" } or { id: "...", error: "..." }). Use a database transaction so either all succeed or all fail, unless partial success is intentional. For bulk delete: DELETE /resources with an array of IDs in the body (or query string for smaller sets). Always set a maximum batch size (e.g., 100 items) to prevent memory exhaustion and overly long-running transactions.'
    },
    {
      id: 'crud_8',
      q: 'What is the difference between 404 Not Found and 403 Forbidden when a resource is not accessible?',
      a: 'If a user requests a resource that exists but belongs to another user, returning 404 is often the correct choice — it does not reveal that the resource exists at all, preventing enumeration attacks. Returning 403 confirms that the resource exists but the user cannot access it, which leaks information. The rule: if the resource existence itself is sensitive (private user data, unpublished content), use 404. If the resource is publicly known to exist but requires elevated permissions (admin endpoint), use 403.'
    },
    {
      id: 'crud_9',
      q: 'What is optimistic locking and when should you use it in a CRUD API?',
      a: 'Optimistic locking prevents lost updates in concurrent edits without holding a database lock. The resource includes a version field (or updated_at timestamp). On update, the client sends the version it read: UPDATE items SET name=:name, version=version+1 WHERE id=:id AND version=:expectedVersion. If another update happened between read and write, version won\'t match, the UPDATE affects 0 rows, and you return 409 Conflict. Use it for: shared document editing, inventory updates, any resource that users may concurrently modify and where last-write-wins would cause data loss.'
    }
  ],

  'business-logic-layer': [
    {
      id: 'bll_1',
      q: 'What is the business logic layer and what types of code belong in it?',
      a: 'The business logic layer (service layer) contains the domain rules of your application — the "what your app does" independent of how it is triggered or how data is stored. It includes: price calculations, discount eligibility, order state machines, access control rules, notification triggers, and complex validation that involves domain knowledge (e.g., "a user can only have 3 active subscriptions"). It does NOT contain HTTP parsing, SQL queries, or response formatting.'
    },
    {
      id: 'bll_2',
      q: 'Why is it a mistake to put business logic directly in database queries?',
      a: 'Embedding business rules in SQL (triggers, stored procedures, complex conditional queries) makes them invisible to application code, untestable without a real database, version-controlled separately from the rest of the codebase, and inaccessible to other callers. If the rule "a free-tier user cannot create more than 3 projects" lives in a stored procedure, it cannot be unit tested, cannot be applied from a queue worker, and is difficult to change or audit. Keep business rules in the service layer where they are visible, testable, and deployable with the application code.'
    },
    {
      id: 'bll_3',
      q: 'What is the difference between domain validation and input validation?',
      a: 'Input validation checks that request data is structurally correct: required fields are present, types match, strings are not too long. This belongs in the controller/middleware layer and returns 400. Domain validation enforces business rules that require context: "a user cannot downgrade their plan if they have active enterprise features", "an order cannot be cancelled after it has shipped". This belongs in the service layer and typically returns a domain-specific error (409 Conflict, 422 Unprocessable Entity) with a business-meaningful message.'
    },
    {
      id: 'bll_4',
      q: 'What is an anemic domain model and why is it considered an anti-pattern?',
      a: 'An anemic domain model is when domain objects (User, Order, Product) are plain data containers with no behavior — all logic lives in service classes that operate on those dumb structs. The anti-pattern: services like OrderService.calculateDiscount(order, user) contain all the rules. The alternative (rich domain model) puts behavior on the objects: order.applyDiscount(user) contains the rule. Anemia scatters related logic across many service classes, making it hard to find all rules that govern an entity and easy to forget to apply them.'
    },
    {
      id: 'bll_5',
      q: 'How do you handle complex multi-step business operations that must be atomic?',
      a: 'Wrap the entire operation in a database transaction. For operations that span multiple services or external systems (charge card, create order, send email), use the Saga pattern: each step is a local transaction with a compensating transaction (refund, cancel order) that runs if a later step fails. The service layer orchestrates the steps and compensations. Never let partial completion of a multi-step operation leave data in an inconsistent state without a recovery path.'
    },
    {
      id: 'bll_6',
      q: 'What is the "use case" pattern and how does it relate to service classes?',
      a: 'The use case pattern models each distinct business operation as its own class or function: CreateUserUseCase, PlaceOrderUseCase, RefundPaymentUseCase. Each has a single execute(input) method. This is finer-grained than a UserService with many methods. Benefits: each use case is independently testable, easy to find (folder structure mirrors business operations), and has a single reason to change. Drawback: more files. Large codebases prefer use cases; smaller ones use service classes with grouped methods (UserService.create, UserService.updateProfile).'
    },
    {
      id: 'bll_7',
      q: 'How do you test business logic in isolation from the database?',
      a: 'Inject repository interfaces (not concrete implementations) into your services. In tests, inject in-memory mock repositories that implement the same interface with fake data stored in a Map. The service never makes a real DB call — it only calls repository methods. This makes business logic tests extremely fast (no DB setup/teardown), deterministic, and able to simulate edge cases (DB returning zero results, constraint violations) without data setup. Integration tests still use a real DB to verify the full stack.'
    },
    {
      id: 'bll_8',
      q: 'What is the "feature flag" pattern and where should feature flag checks live?',
      a: 'A feature flag is a boolean condition that enables/disables a feature for a specific user, percentage of users, or environment without deploying new code. Feature flag checks should live in the service layer (or a dedicated feature flag service), not scattered across controllers. The check asks "is this feature enabled for this user in this context?" and gates the business logic accordingly. This allows gradual rollout (canary), A/B testing, emergency kill switches for buggy features, and dark launches (code deployed but not yet active).'
    }
  ],

  'concurrency-parallelism': [
    {
      id: 'conc_1',
      q: 'What is the difference between concurrency and parallelism?',
      a: 'Concurrency means multiple tasks are in progress at the same time but not necessarily executing simultaneously — they interleave on a single CPU core by context-switching. Parallelism means multiple tasks execute simultaneously on multiple CPU cores. Node.js is concurrent (single-threaded event loop handles many I/O operations "at the same time") but not parallel by default. Worker threads enable true parallelism in Node.js for CPU-bound tasks.'
    },
    {
      id: 'conc_2',
      q: 'What is the Node.js event loop and what does it enable?',
      a: 'The event loop is a single-threaded loop that continuously checks the event queue for callbacks to execute. When Node performs async I/O (reading a file, making a DB query), it hands off the work to libuv (which uses OS-level async or a thread pool), and the event loop continues processing other callbacks. When the I/O completes, its callback is queued. This enables a single thread to handle thousands of concurrent connections because most time is spent waiting for I/O, not executing CPU instructions.'
    },
    {
      id: 'conc_3',
      q: 'What is the difference between I/O-bound and CPU-bound workloads in Node.js?',
      a: 'I/O-bound tasks (DB queries, HTTP calls, file reads) spend most of their time waiting for external responses. Node.js handles these efficiently with async I/O — the event loop handles other requests during the wait. CPU-bound tasks (image processing, cryptography, large JSON parsing, video encoding) keep the CPU busy in JavaScript. These block the event loop — no other requests can be handled until the operation completes. CPU-bound work should be offloaded to worker threads or a separate process/service.'
    },
    {
      id: 'conc_4',
      q: 'What are Worker Threads in Node.js and when should you use them?',
      a: 'Worker Threads (built-in since Node 12) run JavaScript in parallel OS threads. Each worker has its own V8 instance and event loop. Communication happens via message passing (postMessage / on("message")). Use them for CPU-bound operations that would otherwise block the event loop: image resizing, PDF generation, complex calculations, large in-memory data processing. Do NOT use them for I/O-bound work — async I/O is already efficient. Creating workers has overhead (~50ms) so use a worker pool for repeated tasks.'
    },
    {
      id: 'conc_5',
      q: 'What is a race condition and how can it occur in a Node.js backend despite single-threading?',
      a: 'A race condition occurs when the outcome depends on the timing of operations. In Node.js, despite single-threaded JS, race conditions occur in async code: two concurrent requests both read a balance (100), both decide the user can afford a $50 purchase, both deduct $50 — result is -$50 or $50 (should be $0 after both succeed, or one should fail). This happens because there is a gap between the read and write across await points. Fix: use database-level locks (SELECT FOR UPDATE), atomic operations, or optimistic locking.'
    },
    {
      id: 'conc_6',
      q: 'What does Promise.all() do for concurrency, and when should you use it vs sequential awaits?',
      a: 'Promise.all([p1, p2, p3]) starts all promises simultaneously and waits for all to complete. Total time ≈ slowest individual promise. Sequential awaits run one after another — total time = sum of all. Use Promise.all when operations are independent (fetching user + fetching their org in parallel). Use sequential awaits when each operation depends on the previous result, or when you must not overwhelm an external service with concurrent requests (add a concurrency limiter like p-limit).'
    },
    {
      id: 'conc_7',
      q: 'What is the cluster module in Node.js and how does it achieve parallelism?',
      a: 'The cluster module forks multiple Node.js processes (workers), each with its own event loop and V8 instance, all sharing the same server port. The master process distributes incoming connections across workers. On an 8-core machine, 8 workers utilize all cores. Unlike worker threads, cluster workers are separate processes (full memory isolation, higher overhead, independent crash recovery). For CPU-bound work, worker threads are more efficient; for scaling request handling capacity, clustering (or horizontal scaling with multiple containers) is the standard approach.'
    },
    {
      id: 'conc_8',
      q: 'What is backpressure in streaming and why does it matter for concurrency?',
      a: 'Backpressure is the mechanism by which a slow consumer signals a fast producer to slow down, preventing the consumer from being overwhelmed. In Node.js streams, writable.write() returns false when the internal buffer is full — the producer should stop writing and wait for the "drain" event. Without backpressure handling, data piles up in memory (memory leak) and the producer may outrun the consumer. This matters in high-concurrency systems: if you read a DB cursor faster than you can write to a response stream, the Node process will run out of memory under load.'
    }
  ],

  'object-storage': [
    {
      id: 'objst_1',
      q: 'What is object storage and how does it differ from a filesystem or block storage?',
      a: 'Object storage (S3, GCS, Azure Blob) stores files as flat objects — each identified by a key (path-like string) with arbitrary metadata, stored in a bucket. Unlike a filesystem, there is no real directory hierarchy (prefixes simulate folders), no in-place editing (you replace the whole object), and no file locking. It is infinitely scalable, globally durable (11 9s with S3 Standard), and accessed via HTTP APIs. Block storage (EBS, GCP Persistent Disk) is raw disk attached to a VM. Filesystems sit on top of block storage. Object storage is for large, infrequently mutated assets; block for OS, databases, and transactional data.'
    },
    {
      id: 'objst_2',
      q: 'What is a presigned URL and why should you use it for file uploads?',
      a: 'A presigned URL is a time-limited, pre-authenticated URL that grants temporary access to a specific S3 operation (GetObject or PutObject) without exposing your AWS credentials. For uploads: the client requests a presigned PUT URL from your server, then uploads the file directly to S3 — the file never passes through your server. Benefits: your server does not handle large file payloads (reduces memory pressure and bandwidth costs), S3 handles bandwidth and multipart chunking, and you can control who can upload what by generating URLs only for authorized requests.'
    },
    {
      id: 'objst_3',
      q: 'What is multipart upload in S3 and when is it required?',
      a: 'Multipart upload splits a large file into parts (minimum 5 MB each, up to 10,000 parts), uploads them in parallel, then S3 assembles them. Benefits: faster upload (parallel parts), resumable (failed parts can be retried without restarting), required for objects over 5 GB (single PUT is limited to 5 GB). AWS recommends using multipart for files over 100 MB. The process: initiate upload (get UploadId), upload each part (get ETags), complete upload (send UploadId + ETag list). Always abort incomplete multipart uploads on failure to avoid storage costs.'
    },
    {
      id: 'objst_4',
      q: 'How should you name S3 keys to avoid performance bottlenecks?',
      a: 'Old S3 (pre-2018) partitioned by key prefix — all keys starting with the same prefix landed on the same shard, creating hot spots. Best practice was to add a hash prefix (e.g., key = hashPrefix + "/userId/filename"). Since 2018, S3 automatically partitions on any key pattern at 3,500 PUT/s and 5,500 GET/s per prefix. Modern practice: use logical prefixes (userId/uploads/filename.jpg) without artificial hashing. Avoid putting thousands of objects at the same prefix depth for UI listing performance.'
    },
    {
      id: 'objst_5',
      q: 'What is S3 eventual consistency vs strong consistency, and does it matter today?',
      a: 'In December 2020, AWS upgraded S3 to strong read-after-write consistency for all operations — PUT, DELETE, LIST. Previously, S3 had eventual consistency for overwrite PUTs and DELETEs, meaning a GET immediately after a DELETE might still return the old object. Today, you can rely on: a GET immediately after a PUT will return the new object; a LIST after a PUT will include the new key; a GET after a DELETE will return 404. The old workarounds (adding delays or version checks) are no longer needed.'
    },
    {
      id: 'objst_6',
      q: 'What are S3 storage classes and when would you use each?',
      a: 'S3 Standard: frequent access, low latency, highest cost (~$0.023/GB/month). S3 Intelligent-Tiering: automatically moves objects between tiers based on access patterns — ideal when access is unpredictable. S3 Standard-IA (Infrequent Access): lower storage cost but per-retrieval fee — for backups accessed rarely. S3 Glacier: archival storage, retrieval takes minutes to hours, very cheap ($0.004/GB). S3 Glacier Deep Archive: cheapest ($0.00099/GB), 12-hour retrieval. Use lifecycle policies to automatically transition objects between classes (e.g., move logs to IA after 30 days, Glacier after 90 days).'
    },
    {
      id: 'objst_7',
      q: 'How do you stream a large file from S3 to an HTTP response without loading it all into memory?',
      a: 'Use the S3 SDK\'s streaming API: the GetObject command returns a Body that is a Readable stream. Pipe it directly to the HTTP response: s3.send(new GetObjectCommand({...})).then(({ Body }) => Body.pipe(res)). This streams chunks from S3 directly to the client without buffering the entire file in Node\'s memory. For range requests (video seeking), use the Range header in the GetObjectCommand to fetch only the requested byte range, and set Content-Range in the response — this enables media players to seek within large video files.'
    },
    {
      id: 'objst_8',
      q: 'What S3 security settings should every production bucket have?',
      a: 'Block all public access (unless the bucket is intentionally a public CDN). Use bucket policies to restrict access to specific IAM roles or services — principle of least privilege. Enable versioning for critical data buckets (recovers from accidental deletes). Enable server-side encryption (SSE-S3 or SSE-KMS). Enable access logging to an audit bucket. For public-facing file serving, use CloudFront in front of S3 (CDN + signed URLs) rather than making the bucket publicly readable. Enable MFA delete for buckets holding critical data.'
    }
  ],

  'graceful-shutdown': [
    {
      id: 'grace_1',
      q: 'What is graceful shutdown and why does it matter during deployments?',
      a: 'Graceful shutdown means stopping a server in a way that completes all in-flight requests before exiting, rather than terminating immediately. During a rolling deployment, the old container receives SIGTERM when a new one is ready. If the old container exits immediately, any requests it is currently processing will return an error or a dropped connection to the client. Graceful shutdown prevents this by refusing new connections but finishing existing ones before exiting, making deployments invisible to users.'
    },
    {
      id: 'grace_2',
      q: 'What is SIGTERM and how should a Node.js server respond to it?',
      a: 'SIGTERM is the standard Unix signal to request a process terminate gracefully (as opposed to SIGKILL, which forces immediate termination). In Node.js: process.on("SIGTERM", async () => { server.close(async () => { await db.end(); process.exit(0); }); }). server.close() stops accepting new HTTP connections but allows existing connections to finish. The process should exit within a timeout (typically 30 seconds) — after which the orchestrator sends SIGKILL anyway. Always clean up: close DB connections, flush logs, release distributed locks.'
    },
    {
      id: 'grace_3',
      q: 'What is the difference between health check endpoints /health and /ready?',
      a: '/health (liveness probe): "is the process alive?" — returns 200 if the Node.js process is running and not deadlocked. Kubernetes uses this to decide whether to restart the container. /ready (readiness probe): "is the service ready to receive traffic?" — returns 200 only if the service has completed startup (DB connected, caches warm, migrations done) and is not shutting down. During graceful shutdown, /ready returns 503 to tell the load balancer to stop routing traffic to this instance while /health remains 200 (process is alive but draining).'
    },
    {
      id: 'grace_4',
      q: 'What is connection draining in a load balancer context?',
      a: 'Connection draining is the period after a backend instance is marked unhealthy or deregistered, during which the load balancer stops sending new requests to that instance but waits for in-flight requests to complete before fully removing it. AWS ALB calls this "deregistration delay" (default 300 seconds). Your graceful shutdown timeout should be set to less than this value — so the process exits cleanly before the load balancer forcibly removes it. The sequence: instance starts shutting down → sets /ready to 503 → load balancer stops routing to it → existing requests drain → process exits.'
    },
    {
      id: 'grace_5',
      q: 'How do you handle long-running background jobs during graceful shutdown?',
      a: 'Background jobs (queue workers, scheduled tasks) need their own shutdown logic. Use a shutdown flag: when SIGTERM is received, stop picking up new jobs and allow the current job to complete. If jobs can be long (>30s), make them checkpointable — save progress to the DB periodically so a restart can resume rather than restart. Return the job to the queue instead of abandoning it. Set a max shutdown timeout (e.g., 30s) after which you exit regardless — the job will be re-queued by the message broker\'s visibility timeout mechanism.'
    },
    {
      id: 'grace_6',
      q: 'Why does Kubernetes wait terminationGracePeriodSeconds before sending SIGKILL?',
      a: 'Kubernetes first sends SIGTERM and then waits terminationGracePeriodSeconds (default 30 seconds) for the process to exit on its own. If the process has not exited by then, Kubernetes sends SIGKILL, which the process cannot catch — it is immediately terminated. This 30-second window is the budget for your graceful shutdown. If your shutdown takes longer (e.g., slow DB connection close), increase terminationGracePeriodSeconds. The best practice is to set the app\'s shutdown timeout to 25 seconds and terminationGracePeriodSeconds to 30, giving a 5-second buffer.'
    },
    {
      id: 'grace_7',
      q: 'What should you do after catching SIGTERM but before the server.close() callback fires?',
      a: 'Immediately set the readiness endpoint to return 503 — this tells the load balancer to stop routing new traffic to this instance. Without this, the load balancer may continue sending requests to a server that has already called server.close() and is refusing new connections, causing brief errors. The sequence: receive SIGTERM → set isShuttingDown = true → /ready returns 503 → wait for load balancer deregistration delay → server.close() → cleanup DB/cache connections → process.exit(0).'
    },
    {
      id: 'grace_8',
      q: 'How does keep-alive connection handling complicate graceful shutdown?',
      a: 'HTTP keep-alive connections persist after a response, waiting for the next request. server.close() stops accepting NEW connections but does not close existing idle keep-alive connections — they remain open, and the process never reaches its close callback. Fix: set the Connection: close header on responses during shutdown (res.setHeader("Connection", "close")), or use a library like http-terminator that actively destroys idle keep-alive connections while waiting for in-flight requests to complete. Without this, graceful shutdown can stall indefinitely on lingering idle connections.'
    }
  ],

  'webhooks': [
    {
      id: 'wh_1',
      q: 'What is a webhook and how does it differ from polling?',
      a: 'A webhook is an HTTP POST that a provider sends to your endpoint when an event occurs — push-based. Polling is when your server repeatedly requests "have any events happened?" on a schedule — pull-based. Webhooks are more efficient (no wasted requests), lower latency (event delivered within seconds vs next poll interval), and scale better. Polling is simpler to implement and more reliable when your endpoint may be temporarily unavailable. Real-time event needs → webhooks; batch/scheduled data sync → polling is fine.'
    },
    {
      id: 'wh_2',
      q: 'How do you verify that a webhook came from a legitimate provider?',
      a: 'Providers sign webhook payloads with HMAC-SHA256 using a shared secret. Stripe example: the provider sends the raw body + timestamp and a signature header (Stripe-Signature). You compute HMAC-SHA256(rawBody + timestamp, yourWebhookSecret) and compare to the signature. IMPORTANT: compute the HMAC on the raw request body bytes, not a re-serialized JSON object — any whitespace difference will produce a different signature. Use a constant-time comparison (crypto.timingSafeEqual) instead of ===, to prevent timing attacks.'
    },
    {
      id: 'wh_3',
      q: 'What does "at-least-once delivery" mean for webhooks, and how do you handle it?',
      a: 'Webhook providers guarantee delivery but cannot guarantee exactly-once delivery — your endpoint may receive the same event multiple times due to provider retries after timeouts or network errors. Handle this with idempotency: store the event ID in a database. On each webhook receipt, check if event ID already processed — if yes, return 200 immediately without re-processing. If no, process it and save the event ID atomically (in the same transaction as the business logic). This ensures duplicate deliveries have no side effects.'
    },
    {
      id: 'wh_4',
      q: 'Why should webhook handlers return 200 immediately and process the event asynchronously?',
      a: 'Providers retry webhooks when they do not receive a 2xx response within their timeout (typically 10-30 seconds). If your handler does DB writes, external API calls, or sends emails synchronously, any one of these can exceed the timeout, causing the provider to retry — even though your code did complete the work, causing duplicate processing. The pattern: accept the webhook, validate the signature, write the raw event to a queue or DB, return 200 immediately. A separate worker processes events asynchronously without time pressure.'
    },
    {
      id: 'wh_5',
      q: 'What is webhook retry logic and how should you handle provider retries?',
      a: 'Providers retry failed deliveries (non-2xx or timeout) with exponential backoff — e.g., Stripe retries over 3 days with increasing intervals. Your endpoint must be idempotent (idempotency key = event ID) so retries do not double-process. Return 2xx for events you have already processed. Return 2xx even for event types you do not handle — returning 400 may cause retries and noise. Only return 5xx if there was a genuine server error that justifies a retry. Log all received event IDs for debugging delivery gaps.'
    },
    {
      id: 'wh_6',
      q: 'What is webhook secret rotation and how do you rotate without downtime?',
      a: 'Webhook secrets must be rotatable when compromised or as part of routine security hygiene. Zero-downtime rotation: (1) generate a new secret in the provider dashboard; (2) update your handler to accept signatures from BOTH old and new secrets for a transition period; (3) verify with new secret first, fall back to old if it fails; (4) once all in-flight webhooks use the new secret (typically 24-48 hours after rotation), remove the old secret from your code. Never just swap secrets instantly — there will be a window of in-flight webhooks signed with the old secret.'
    },
    {
      id: 'wh_7',
      q: 'What is the replay attack risk with webhooks and how does timestamp validation mitigate it?',
      a: 'A replay attack is when an attacker captures a valid signed webhook request and replays it later. Since the signature is valid, a naive handler would process it again. Mitigation: providers include a timestamp in the signed payload (e.g., Stripe\'s t= in the Stripe-Signature header). Your handler checks: if Math.abs(Date.now() - webhookTimestamp) > 300000 (5 minutes), reject with 400. This limits the replay window to 5 minutes. The timestamp is included in the HMAC, so an attacker cannot change it without invalidating the signature.'
    },
    {
      id: 'wh_8',
      q: 'How should you test webhook handling in development without a public URL?',
      a: 'Use a tunneling tool to expose localhost publicly: ngrok (most common — ngrok http 3000 gives you a public HTTPS URL), cloudflared tunnel, or localtunnel. Configure the provider\'s webhook URL to the tunnel URL. Some providers offer a CLI for local testing (Stripe CLI: stripe listen --forward-to localhost:3000/webhooks). For integration tests, call your webhook endpoint directly with test payloads and a computed HMAC signature — no tunnel needed. Store test fixture payloads of real webhook events for repeatable testing.'
    }
  ],

  'openapi-standards': [
    {
      id: 'oapi_1',
      q: 'What is OpenAPI and what is the difference between OpenAPI 3.0 and Swagger 2.0?',
      a: 'OpenAPI is a language-agnostic specification for describing REST APIs in JSON or YAML — endpoints, request/response schemas, authentication methods, and examples. Swagger 2.0 was the predecessor (and gave the name "Swagger UI"). OpenAPI 3.0 (2017) renamed to OpenAPI, improved schema composition (oneOf, anyOf, not), replaced Swagger\'s basePath with multiple server URLs, improved component reuse with $ref, and cleaned up security scheme definitions. OpenAPI 3.1 aligns fully with JSON Schema draft 2020-12. "Swagger" now typically refers to the tooling (Swagger UI, Swagger Editor) rather than the spec version.'
    },
    {
      id: 'oapi_2',
      q: 'What is API-first design and what are its benefits?',
      a: 'API-first means writing the OpenAPI specification BEFORE writing any implementation code. Benefits: frontend and backend teams can work in parallel (frontend mocks against the spec while backend builds); the spec serves as a contract that both sides agree on; tools generate server stubs and client SDKs from the spec; breaking changes are visible in spec diffs during code review; documentation is always accurate (it IS the spec). API-first prevents the common problem of auto-generated docs that lag behind the implementation or are never updated.'
    },
    {
      id: 'oapi_3',
      q: 'What is the structure of an OpenAPI 3.0 document?',
      a: 'Top-level fields: openapi (version string), info (title, version, description), servers (array of base URLs), paths (endpoint definitions keyed by path), components (reusable schemas, parameters, responses, security schemes), security (global auth requirements), tags (for grouping endpoints). Each path object contains HTTP method objects (get, post, etc.), each containing: summary, operationId, parameters, requestBody, responses, security (per-operation override), and tags. Components/$ref avoids repeating schema definitions.'
    },
    {
      id: 'oapi_4',
      q: 'What is code generation in the OpenAPI ecosystem? Name the key tools.',
      a: 'OpenAPI generators create code from a spec: server stubs (route skeletons you fill in), client SDKs (typed API clients for many languages), and request/response validation middleware. Key tools: openapi-generator (Java-based, supports 50+ languages); orval (TypeScript — generates React Query / SWR hooks + types from spec); swagger-codegen (original generator); oapi-codegen (Go). Client SDK generation is extremely valuable: frontend teams get type-safe API clients automatically updated when the spec changes, eliminating manual API integration code.'
    },
    {
      id: 'oapi_5',
      q: 'What are the two main approaches to generating OpenAPI docs in Node.js?',
      a: 'Code-first: you write the implementation and annotate it (JSDoc comments, decorators in NestJS/tsoa) — the spec is generated from code. Tools: swagger-jsdoc, tsoa, NestJS @nestjs/swagger. Spec-first (API-first): write the YAML spec manually, validate it, and optionally generate server stubs. Code-first is faster to start but risks docs drifting from reality if annotations are neglected. Spec-first requires more upfront discipline but guarantees the spec is always authoritative. Production recommendation: spec-first with contract testing to verify the implementation matches the spec.'
    },
    {
      id: 'oapi_6',
      q: 'How do you handle API versioning in an OpenAPI spec?',
      a: 'Common strategies: (1) URL path versioning (/v1/users, /v2/users) — put each version in a separate spec file or use the servers array with versioned base URLs; (2) Header versioning (Accept: application/vnd.api+json; version=2) — harder to represent in Swagger UI; (3) Multiple spec files per major version — maintain v1.yaml and v2.yaml separately, allowing each to evolve independently. Document deprecation with the deprecated: true field on operations or parameters. The info.version field is the spec version, not the API version — use the servers array or path prefix for API versioning.'
    },
    {
      id: 'oapi_7',
      q: 'What are the $ref and component reuse features in OpenAPI?',
      a: '$ref allows you to reference a reusable component defined in the components section instead of duplicating schema definitions. Example: { "$ref": "#/components/schemas/User" }. Components can define: schemas (data models), parameters (query/path/header params), responses (standard error responses like 404), requestBodies, headers, and securitySchemes. Good practice: define Error schemas, pagination metadata, and common parameters once in components and reference them everywhere. This keeps specs DRY, ensures consistency, and makes global changes (adding a field to all 404 responses) a single edit.'
    },
    {
      id: 'oapi_8',
      q: 'How do you validate that your implementation actually conforms to your OpenAPI spec?',
      a: 'Contract testing (also called spec testing) automatically validates that your running API matches the spec. Tools: dredd (sends example requests from the spec, checks responses match declared schemas), schemathesis (property-based testing — generates hundreds of inputs from the spec and fuzzes the API), express-openapi-validator (middleware that validates every request/response against the spec at runtime in tests). The key is running these in your CI pipeline so spec deviations fail the build. Without this, API-first docs drift from reality quickly as the implementation evolves.'
    },
    {
      id: 'oapi_9',
      q: 'What is the operationId field and why is it important for code generation?',
      a: 'operationId is a unique string identifier for an API operation (e.g., "getUserById", "createOrder"). It is optional in the spec but critical for code generation — generators use it as the function/method name in generated clients. Without operationId, generators create names from path + method (e.g., "getApiV1UsersUserId"), which are verbose and unstable. Best practices: use camelCase verb + noun ("listOrders", "createUser", "deleteAccount"), keep them unique across the entire spec, and treat them as stable public identifiers — renaming an operationId is a breaking change for generated clients.'
    }
  ],

  'twelve-factor-app': [
    {
      id: 'tf_1',
      q: 'What is the 12-Factor App methodology and why was it created?',
      a: 'The 12-Factor App is a set of 12 principles for building web applications that are portable, scalable, and maintainable, created by Heroku engineers in 2012. It was created to address common problems in modern web apps: configuration scattered in code, non-reproducible builds, differing dev/prod environments, difficulty scaling, and tight coupling to OS-level services. Following these factors enables apps to run on any cloud platform, scale horizontally, and be maintained by different developers over time.'
    },
    {
      id: 'tf_2',
      q: 'What are Factors I (Codebase) and II (Dependencies)?',
      a: 'I — Codebase: one codebase tracked in version control, many deploys. Never share code between apps by copying files — use packages (npm, pip). If multiple codebases are needed, it\'s a distributed system (multiple apps). II — Dependencies: explicitly declare all dependencies in a manifest (package.json, requirements.txt) and use an isolation tool (node_modules, virtualenv) so no system-wide packages are assumed. Never rely on implicit existence of system tools (curl, imagemagick) — declare them or bundle them. This ensures any developer can onboard with a single install command.'
    },
    {
      id: 'tf_3',
      q: 'What are Factors III (Config) and IV (Backing Services)?',
      a: 'III — Config: store everything that varies between deploys (dev/staging/prod) in environment variables — database URLs, API keys, feature flags. Never hardcode or commit configuration. Test: can you open-source the codebase right now without exposing credentials? IV — Backing Services: treat all attached resources (databases, caches, queues, email services) as attached services accessed via URL/config. You should be able to swap a local PostgreSQL for a cloud-hosted one by changing one env var — no code changes. This treats backing services as commodities, enabling environment parity and resilience.'
    },
    {
      id: 'tf_4',
      q: 'What are Factors V (Build/Release/Run) and VI (Processes)?',
      a: 'V — Build/Release/Run: strictly separate these three stages. Build: compile code + bundle dependencies into a build artifact. Release: combine build artifact with config (env vars) to create an immutable release. Run: execute processes from a release. Never modify code at runtime; every change requires a new build. This enables rollbacks (redeploy a previous release). VI — Processes: execute the app as one or more stateless processes. Store no in-process state that must survive a restart — all persistent data in a backing service (DB, Redis). Two processes must be interchangeable — enabling horizontal scaling by adding more processes.'
    },
    {
      id: 'tf_5',
      q: 'What are Factors VII (Port Binding) and VIII (Concurrency)?',
      a: 'VII — Port Binding: the app is self-contained and exports HTTP by binding to a port, rather than relying on a web server injecting it (Apache mod_php). The app includes a web server library (Express, Kestrel). The runtime sets the PORT env var; the app binds to it. This makes the app a portable building block. VIII — Concurrency: scale out via the process model. Different process types (web, worker, clock) run independently and can be scaled separately. Add more web processes for traffic spikes; add more workers for queue backlogs. This is possible because processes are stateless (Factor VI).'
    },
    {
      id: 'tf_6',
      q: 'What are Factors IX (Disposability) and X (Dev/Prod Parity)?',
      a: 'IX — Disposability: processes should start fast (< a few seconds) and shut down gracefully on SIGTERM. This enables elastic scaling, rapid deployments, and resilience to hardware failures. Avoid slow startup (minimize initialization work; warm caches lazily). X — Dev/Prod Parity: keep development, staging, and production as similar as possible. Gaps cause bugs that only appear in production. Use the same backing services locally (Docker Compose with real PostgreSQL, not SQLite). Avoid the "works on my machine" problem. Use the same infrastructure-as-code for all environments. The time gap (hours not months), personnel gap (dev deploys own code), and tools gap (same DB, same OS) should all be minimized.'
    },
    {
      id: 'tf_7',
      q: 'What are Factors XI (Logs) and XII (Admin Processes)?',
      a: 'XI — Logs: treat logs as event streams. The app should write unbuffered logs to stdout; the execution environment captures and routes them to their destination (log aggregation service, file). The app should know nothing about log routing or storage. This separates concerns — the app logs, infrastructure manages logs. XII — Admin Processes: run admin/maintenance tasks (database migrations, one-time data fixes, REPL sessions) as one-off processes in the same environment as the app (same codebase, same config). Never SSH into production and run scripts manually. Migrations should run as part of deployment, not ad hoc. Admin code ships in the same release as app code.'
    },
    {
      id: 'tf_8',
      q: 'Which 12-factor principles are most commonly violated and what are the consequences?',
      a: 'Most violated: Factor III (Config) — hardcoded secrets or config in code causes security breaches and requires code deploys for config changes. Factor VI (Processes) — storing sessions, uploads, or state in the local filesystem means adding a second server breaks the app. Factor X (Dev/Prod Parity) — using SQLite locally but PostgreSQL in production hides bugs (JSON column behavior, query plan differences, constraint enforcement). Factor IX (Disposability) — slow startups mean deployments take minutes and scaling events are slow to respond. These violations typically surface during the first horizontal scaling attempt or first production incident.'
    }
  ],

  'transactional-emails': [
    {
      id: 'txemail_1',
      q: 'What is the difference between transactional emails and marketing emails?',
      a: 'Transactional emails are triggered by a user action and expected by the recipient: welcome emails, password resets, order confirmations, invoice receipts, notification alerts. They must arrive immediately and reliably. Marketing emails are bulk promotional messages sent to opt-in lists: newsletters, promotions, re-engagement campaigns. The critical difference: transactional emails can be sent to anyone who has an account (no explicit marketing consent required in most jurisdictions); marketing emails require explicit opt-in under GDPR/CAN-SPAM. Use separate sending domains and IP pools for each — a spam complaint on marketing email should not affect transactional email deliverability.'
    },
    {
      id: 'txemail_2',
      q: 'What are the major transactional email providers and what differentiates them?',
      a: 'AWS SES: cheapest ($0.10/1000 emails), good deliverability, minimal features — requires more setup (suppression lists, bounce handling). Postmark: best deliverability for transactional email, excellent bounce/spam management, higher cost ($1.50/1000). SendGrid: feature-rich, good for both transactional and marketing, free tier available. Resend: modern developer-focused API with React email template support. Mailgun: competitive pricing, good developer API. Choice criteria: deliverability track record, API quality, bounce/complaint handling automation, template support, and cost at your volume.'
    },
    {
      id: 'txemail_3',
      q: 'What is SPF and how does it protect against email spoofing?',
      a: 'SPF (Sender Policy Framework) is a DNS TXT record that lists which servers are authorized to send email on behalf of your domain. Example: v=spf1 include:amazonses.com ~all. When a receiving mail server gets an email claiming to be from your domain, it checks your SPF record — if the sending server\'s IP is not in the list, the email fails SPF. ~all means soft fail (mark as suspicious), -all means hard fail (reject). SPF alone is insufficient because it only covers the envelope sender (MAIL FROM), not the From: header visible to users.'
    },
    {
      id: 'txemail_4',
      q: 'What is DKIM and how does it work?',
      a: 'DKIM (DomainKeys Identified Mail) adds a cryptographic signature to outgoing emails. Your email provider signs each email with a private key; the public key is published in a DNS TXT record (e.g., selector._domainkey.yourdomain.com). Receiving servers verify the signature using the public key — proving the email content was not modified in transit and originated from an authorized sender. DKIM signs the From: header and body, making it stronger than SPF. Setting it up: your email provider gives you a CNAME or TXT record to add to DNS, then signs automatically.'
    },
    {
      id: 'txemail_5',
      q: 'What is DMARC and how does it use SPF and DKIM?',
      a: 'DMARC (Domain-based Message Authentication, Reporting & Conformance) is a DNS TXT policy record that tells receiving servers what to do with emails that fail SPF or DKIM checks. Example: v=DMARC1; p=reject; rua=mailto:reports@yourdomain.com. p=none (monitor only), p=quarantine (send to spam), p=reject (discard). DMARC also requires "alignment" — the domain in DKIM/SPF must match the From: header domain. The rua address receives aggregate reports showing which servers send on your behalf, helping you discover unauthorized senders or misconfigured systems. Implement DMARC in monitor mode first, then move to reject after verifying all legitimate senders pass.'
    },
    {
      id: 'txemail_6',
      q: 'What are email bounces and complaints, and why must you handle them?',
      a: 'Hard bounce: the email address is permanently invalid (no such user, domain does not exist). You must immediately remove hard-bounced addresses and never email them again. Soft bounce: temporary failure (mailbox full, server down) — retry with backoff, hard-remove after several attempts. Complaint: the recipient clicks "Mark as Spam". This is the most damaging signal for deliverability. ISPs track complaint rates — above 0.08% (Gmail threshold) causes deliverability degradation; above 0.3% can get you blocklisted. Use your provider\'s webhooks to receive bounce/complaint events and update your suppression list automatically in real time.'
    },
    {
      id: 'txemail_7',
      q: 'What are the best practices for transactional email templates?',
      a: 'Use a template engine (Handlebars, MJML, React Email) with a pre-tested responsive base layout. Always include both HTML and plain text versions (multipart/alternative) — some clients render only plain text; missing it hurts deliverability. Keep subject lines under 60 characters (truncated in most clients). Include clear, physical mailing address in the footer (CAN-SPAM/GDPR requirement). Never use deceptive subject lines. Test rendering in major clients (Gmail, Outlook, Apple Mail) with tools like Litmus or Email on Acid — Outlook uses a Word rendering engine that breaks many CSS rules.'
    },
    {
      id: 'txemail_8',
      q: 'What is email deliverability and what are the main factors that affect it?',
      a: 'Deliverability is the rate at which emails reach the inbox vs. the spam folder or being rejected. Key factors: (1) Sender reputation — ISPs score your sending domain and IP based on bounce rates, complaint rates, and sending patterns. (2) Authentication — properly configured SPF, DKIM, and DMARC are required; missing them = spam. (3) Content — spam trigger words, excessive links, image-only emails, broken HTML. (4) List hygiene — regularly remove bounced and unengaged addresses. (5) IP warming — new dedicated IPs must build reputation gradually (start with low volume, ramp up over weeks). (6) Engagement — recipients opening and clicking your emails signals legitimacy to ISPs.'
    },
    {
      id: 'txemail_9',
      q: 'How should transactional email sending be architected in a backend system?',
      a: 'Do not call the email provider\'s API synchronously in the request handler — if the email service is down, it blocks or fails the user\'s action. Decouple with a queue: the handler publishes a "send email" job to a queue (Redis/BullMQ, SQS); a background worker consumes the job and calls the email provider. This makes the main request fast and independent of email delivery. Implement retry logic with exponential backoff in the worker. Store email events (sent, bounced, complained) in your database for audit trails and suppression list management. Use idempotency keys to prevent duplicate sends if the worker crashes and retries.'
    }
  ],

  'https-tls': [
    {
      id: 'tls_1',
      q: 'What are the main steps of the TLS handshake?',
      a: 'The TLS handshake establishes a secure session before any application data is sent. The client sends a ClientHello (supported cipher suites, TLS version, random bytes); the server replies with a ServerHello (chosen cipher, its certificate, and its own random bytes). The client verifies the certificate, they exchange key material to derive a shared symmetric session key, then both sides send a Finished message encrypted with that key. All subsequent data uses the fast symmetric cipher rather than the slow asymmetric one.',
      hint: 'ClientHello then symmetric key derivation'
    },
    {
      id: 'tls_2',
      q: 'What is a certificate chain and why does it matter?',
      a: 'A certificate chain links a server\'s leaf certificate back to a trusted root CA through one or more intermediate CAs. Browsers and OS trust stores ship a list of root CAs; they cannot trust a leaf cert directly, so they walk the chain — root CA signs the intermediate, intermediate signs the leaf. If any link is missing or untrusted the connection is rejected. Servers should send the full chain (leaf + intermediates) in the TLS handshake so clients can verify it without fetching extra certificates.',
      hint: 'root CA -> intermediate -> leaf'
    },
    {
      id: 'tls_3',
      q: 'How does TLS use both asymmetric and symmetric cryptography?',
      a: 'Asymmetric cryptography (RSA, ECDH) is used only during the handshake to authenticate the server and safely exchange a shared secret — it is computationally expensive. Once both sides agree on a shared secret they derive symmetric session keys (AES-GCM is common) that encrypt the actual data stream. Symmetric encryption is orders of magnitude faster and is suitable for bulk data transfer. TLS therefore uses asymmetric crypto for key exchange and symmetric crypto for everything after.',
      hint: 'handshake is asymmetric, data is symmetric'
    },
    {
      id: 'tls_4',
      q: 'What are the key differences between TLS 1.2 and TLS 1.3?',
      a: 'TLS 1.3 reduces the handshake from 2 round trips to 1 (1-RTT), cutting connection latency significantly. It removes weak cipher suites (RC4, 3DES, RSA key exchange) and mandates forward secrecy via ephemeral Diffie-Hellman. It also introduces 0-RTT resumption for reconnecting clients, though 0-RTT has replay-attack caveats. TLS 1.2 is still widely deployed but TLS 1.3 is the modern standard and is required by newer compliance frameworks.',
      hint: '1-RTT, forward secrecy mandatory'
    },
    {
      id: 'tls_5',
      q: 'What does the HSTS header do and why is it important?',
      a: 'HTTP Strict Transport Security (HSTS) is a response header — "Strict-Transport-Security: max-age=31536000; includeSubDomains" — that tells browsers to only connect to this domain over HTTPS for the specified duration. Once a browser sees HSTS it will internally redirect http:// requests to https:// without ever hitting the network, eliminating the window for SSL-stripping attacks. The "preload" flag and submission to the HSTS preload list bakes HTTPS-only behavior into browsers before the first visit.',
      hint: 'forces HTTPS in the browser cache'
    },
    {
      id: 'tls_6',
      q: 'What is mTLS and when would a backend use it?',
      a: 'Mutual TLS (mTLS) means both the server and the client present certificates and verify each other, unlike standard TLS where only the server is verified. This makes it suitable for service-to-service authentication inside a microservices cluster — no API keys or tokens needed because the certificate itself is the identity. Service meshes like Istio automatically issue and rotate short-lived certificates and enforce mTLS between pods. It is also used by payment processors and financial APIs that require strong client authentication.',
      hint: 'both sides present certs'
    },
    {
      id: 'tls_7',
      q: 'How does Let\'s Encrypt / the ACME protocol issue certificates automatically?',
      a: 'ACME (Automatic Certificate Management Environment) is the protocol Let\'s Encrypt uses to prove domain ownership and issue free TLS certificates. Your ACME client (e.g., Certbot, acme.sh) requests a challenge from Let\'s Encrypt — typically HTTP-01 (serve a specific file at /.well-known/acme-challenge/) or DNS-01 (add a specific TXT record). Let\'s Encrypt verifies the challenge, confirming you control the domain, then issues a 90-day certificate. Renewal is automated; the short lifetime encourages automation and limits exposure from compromised keys.',
      hint: 'HTTP-01 or DNS-01 domain challenge'
    },
    {
      id: 'tls_8',
      q: 'Why does a self-signed certificate trigger a browser warning, and when is it acceptable?',
      a: 'A self-signed certificate is signed by its own private key rather than by a trusted CA, so browsers cannot verify the chain of trust — anyone could generate one claiming to be any domain. Browsers show a scary "Your connection is not private" warning to protect users from MITM attacks. Self-signed certs are acceptable in local development environments (where you control the machine and can add the cert to the OS trust store) or in internal networks where clients are configured to trust a private CA. Never use them in production facing real users.',
      hint: 'no CA vouches for it'
    }
  ],

  'http2-http3': [
    {
      id: 'h2_1',
      q: 'What is head-of-line blocking in HTTP/1.1 and why is it a problem?',
      a: 'In HTTP/1.1, a TCP connection processes requests serially: the next response cannot be sent until the current one is fully delivered. If a large resource stalls, all following requests on that connection are blocked. Browsers work around this by opening 6-8 parallel TCP connections per origin, but each connection still has its own HOL blocking, and more connections mean more overhead. This is the fundamental limitation HTTP/2 was designed to solve.',
      hint: 'serial responses block the queue'
    },
    {
      id: 'h2_2',
      q: 'How does HTTP/2 multiplexing solve head-of-line blocking?',
      a: 'HTTP/2 introduces streams: multiple request/response pairs are sent concurrently over a single TCP connection as independent frames interleaved on the wire. Each stream has an ID so the receiver can reassemble the frames into the correct response. A slow response no longer blocks others because their frames keep flowing. This eliminates the need for connection pooling hacks and reduces latency, especially on high-latency connections where TCP connection setup is expensive.',
      hint: 'concurrent streams on one TCP connection'
    },
    {
      id: 'h2_3',
      q: 'What is binary framing in HTTP/2 and why does it matter?',
      a: 'HTTP/1.x is a text protocol — headers and body are plain ASCII/text, parsed character by character. HTTP/2 encodes everything in binary frames with fixed fields for type, flags, stream ID, and payload. Binary parsing is faster and less error-prone than text parsing, and it enables the multiplexing, flow control, and prioritization features that depend on knowing exact frame boundaries. It is not human-readable, which is why browser DevTools show a decoded view rather than raw bytes.',
      hint: 'fixed-format binary frames, not text'
    },
    {
      id: 'h2_4',
      q: 'What is HPACK header compression in HTTP/2?',
      a: 'HPACK reduces header overhead by maintaining a shared compression table on both client and server. Common headers like "content-type: application/json" or ":method: GET" are encoded as a single index number instead of being re-sent as full strings every request. HPACK was designed carefully to avoid the CRIME/BREACH attacks that broke SPDY\'s gzip compression — it uses a static table of common headers plus a dynamic table that both sides update in sync.',
      hint: 'header index table shared by both sides'
    },
    {
      id: 'h2_5',
      q: 'What is HTTP/2 server push and is it still used?',
      a: 'Server push lets a server proactively send resources the client has not yet requested — e.g., push the CSS and JS alongside the initial HTML response, before the browser parses the HTML and discovers them. In theory this reduces round trips. In practice it proved difficult to implement correctly (servers often pushed resources already in the browser cache), caused wasted bandwidth, and had complex interactions with cache. Major browsers and Chrome in particular removed support for HTTP/2 server push in 2022; the use case is now handled better by HTTP Early Hints (103 status).',
      hint: 'proactive resource push, mostly deprecated'
    },
    {
      id: 'h2_6',
      q: 'What is QUIC and how does it underpin HTTP/3?',
      a: 'QUIC is a transport protocol built on UDP, developed by Google and standardized by the IETF. It reimplements many features of TCP (reliability, flow control, congestion control) plus integrates TLS 1.3 directly into the handshake — reducing connection setup to 1-RTT or 0-RTT. HTTP/3 runs over QUIC instead of TCP. Because QUIC multiplexes streams at the transport layer, a lost UDP packet only stalls the stream it belongs to, not all streams — solving the TCP-level HOL blocking that HTTP/2 still suffers.',
      hint: 'UDP-based transport with built-in TLS'
    },
    {
      id: 'h2_7',
      q: 'What is 0-RTT connection resumption and what is its security caveat?',
      a: '0-RTT (zero round-trip time) resumption lets a client that has previously connected to a server send application data in the very first packet of a reconnection, with no handshake round trip. The server can process that data immediately using a pre-shared session ticket. The security caveat is replay attacks: a network attacker who captures the 0-RTT data can re-send it, potentially replaying a non-idempotent request (e.g., a payment). Safe usage limits 0-RTT to idempotent requests (GET reads) and never uses it for state-changing operations.',
      hint: 'send data before handshake, replay risk'
    },
    {
      id: 'h2_8',
      q: 'Where do backend developers actually encounter HTTP/2 behavior day-to-day?',
      a: 'gRPC runs exclusively over HTTP/2 and relies on its multiplexed streams for bidirectional streaming RPCs — you need HTTP/2 support end-to-end for gRPC to work. Server-Sent Events and streaming APIs benefit from HTTP/2 multiplexing because multiple streams share one connection. When configuring Nginx or a load balancer in front of a Node.js app, note that the backend connection from proxy to app is often HTTP/1.1 even if the client-facing side is HTTP/2 — this is usually fine because the proxy handles multiplexing. Debugging HTTP/2 requires browser DevTools Protocol tab or tools like Wireshark with QUIC decryption.',
      hint: 'gRPC requires HTTP/2 end-to-end'
    }
  ],

  'reverse-proxy-nginx': [
    {
      id: 'rprx_1',
      q: 'What is the difference between a reverse proxy and a forward proxy?',
      a: 'A forward proxy sits in front of clients and makes requests to the internet on their behalf — the server sees the proxy\'s IP, not the client\'s. It is used for corporate content filtering, anonymity, or caching outbound traffic. A reverse proxy sits in front of servers and accepts client requests on behalf of those servers — the client connects to the proxy, which forwards to the appropriate backend. It handles SSL termination, load balancing, caching, and routing. Nginx is almost always deployed as a reverse proxy.',
      hint: 'forward hides client, reverse hides server'
    },
    {
      id: 'rprx_2',
      q: 'What is SSL termination and why do you do it at the proxy layer?',
      a: 'SSL termination means the TLS connection from the client is decrypted at the proxy (Nginx, load balancer) rather than at the application server. The proxy handles the expensive TLS handshake, certificate management, and encryption/decryption; traffic between the proxy and the backend servers travels over plain HTTP inside a trusted private network. This centralizes certificate management (one cert, one renewal point), offloads CPU-intensive crypto from app servers, and lets backend developers focus on application logic rather than TLS configuration.',
      hint: 'proxy decrypts, backend gets plain HTTP'
    },
    {
      id: 'rprx_3',
      q: 'What does the Nginx proxy_pass directive do?',
      a: 'proxy_pass tells Nginx to forward matching requests to a specified upstream address. For example, "proxy_pass http://localhost:3000;" inside a location block sends all matching requests to the Node.js process on port 3000. Nginx rewrites the request, adds proxy headers (X-Real-IP, X-Forwarded-For), sends it upstream, waits for the response, and returns it to the client. The backend app sees Nginx\'s internal IP as the remote address, which is why reading X-Forwarded-For is important for logging real client IPs.',
      hint: 'forwards matching request to upstream'
    },
    {
      id: 'rprx_4',
      q: 'What is an Nginx upstream block and why use it?',
      a: 'An upstream block defines a named group of backend servers that Nginx load-balances across. Instead of hardcoding "proxy_pass http://10.0.0.1:3000;" you write "upstream myapp { server 10.0.0.1:3000; server 10.0.0.2:3000; }" and then "proxy_pass http://myapp;". The upstream block supports load-balancing directives, health checks, and weight parameters. Using a named upstream makes the config readable and lets you change the backend pool without touching every proxy_pass directive.',
      hint: 'named pool of backend servers'
    },
    {
      id: 'rprx_5',
      q: 'How does Nginx location block priority work?',
      a: 'Nginx evaluates location blocks in a specific order. Exact match (location = /path) has highest priority and stops evaluation immediately. Preferential prefix match (location ^~ /path) beats regex if matched. Then regex locations (location ~ /pattern or location ~* /pattern case-insensitive) are tested in order of appearance. Finally, plain prefix matches (location /path) are used, with the longest prefix winning. A common bug is placing a broad prefix block before a more specific one and wondering why the specific one is never reached.',
      hint: 'exact > ^~ prefix > regex > longest prefix'
    },
    {
      id: 'rprx_6',
      q: 'What are the round_robin, least_conn, and ip_hash load-balancing methods in Nginx?',
      a: 'round_robin (the default) distributes requests evenly to each server in turn — simple but ignores server load or request duration. least_conn sends the next request to the server with the fewest active connections, which is better when requests have variable processing time. ip_hash hashes the client IP to always route the same client to the same backend — useful for sticky sessions when your app stores session state in memory rather than a shared store. For stateless apps, least_conn is generally the best choice.',
      hint: 'round_robin, least_conn, ip_hash = sticky'
    },
    {
      id: 'rprx_7',
      q: 'How are a reverse proxy, load balancer, API gateway, and CDN different?',
      a: 'A reverse proxy forwards requests to one or more backends and returns the response — it is the base concept. A load balancer is a reverse proxy focused on distributing traffic across multiple backend instances for availability and scale. An API gateway is a reverse proxy that also handles cross-cutting concerns specific to APIs: authentication, rate limiting, request transformation, analytics, and routing by path or version. A CDN is a geographically distributed reverse-proxy cache network that serves static assets (and sometimes full pages) from edge nodes close to end users, reducing latency and origin load.',
      hint: 'each layer adds responsibilities on top'
    },
    {
      id: 'rprx_8',
      q: 'What is the key difference between Nginx and HAProxy?',
      a: 'Nginx started as a web server and added reverse-proxy and load-balancing features on top of its ability to serve static files and run application code (via PHP-FPM etc.). HAProxy is a dedicated TCP/HTTP load balancer and proxy with no static-file serving capability — it does one thing and does it extremely well, with richer health-check options, more detailed stats, and lower latency under high connection counts. In practice: use Nginx when you also need to serve files, handle SSL termination, and proxy to a backend. Use HAProxy when you need a high-performance, feature-rich layer-4/7 load balancer and nothing else.',
      hint: 'Nginx = server + proxy, HAProxy = pure load balancer'
    }
  ],
  'cors': [
    { id: 'cors_1', q: 'What is CORS and why does the browser enforce it?', a: 'Cross-Origin Resource Sharing is a browser security mechanism that blocks JavaScript from reading responses from a different origin (protocol + domain + port). The Same-Origin Policy prevents a malicious site from using your authenticated session to steal data from another site — CORS is the controlled way to relax that restriction.' },
    { id: 'cors_2', q: 'What is a CORS preflight request and when is it triggered?', a: 'An OPTIONS request the browser sends automatically before the actual request to ask if the cross-origin call is allowed. It is triggered when the request uses a non-simple method (PUT, DELETE, PATCH) or includes non-simple headers (Authorization, Content-Type: application/json). The server must respond with the appropriate Access-Control-Allow-* headers.' },
    { id: 'cors_3', q: 'What HTTP headers does a server need to send to allow CORS?', a: 'At minimum: Access-Control-Allow-Origin: <origin> (or *). For credentialed requests: Access-Control-Allow-Credentials: true — but you must then specify the exact origin, not *. For preflights: also Access-Control-Allow-Methods and Access-Control-Allow-Headers.' },
    { id: 'cors_4', q: 'How do you configure CORS in Express using the cors package?', a: 'const cors = require("cors"); app.use(cors({ origin: "https://yourfrontend.com", credentials: true })); For multiple origins, pass an array or a function. Call app.options("*", cors()) to handle preflight for all routes when using method-specific routes.' },
    { id: 'cors_5', q: 'Your frontend fetch call works in Postman but fails in the browser with a CORS error. Why?', a: 'CORS is enforced only by browsers, not by Postman or server-to-server calls. The server is not returning Access-Control-Allow-Origin header (or it does not match your frontend origin). Add the correct CORS headers on the server — do not try to fix this on the client.' },
    { id: 'cors_6', q: 'You enabled CORS with credentials: true but the browser still blocks the request. Why?', a: 'When credentials (cookies, Authorization headers) are involved, Access-Control-Allow-Origin cannot be the wildcard *. You must echo back the exact requesting origin. Also ensure the fetch/XHR call includes credentials: "include" on the client side.' },
    { id: 'cors_7', q: 'What is the difference between a simple request and a preflighted request?', a: 'A simple request (GET/POST/HEAD with standard headers and allowed content types) does not trigger a preflight — the browser sends it directly and checks the response headers. A preflighted request first sends an OPTIONS probe; if that is rejected, the real request is never sent.' },
    { id: 'cors_8', q: 'CORS vs CSRF — what is the difference?', a: 'CORS prevents a malicious script from reading cross-origin responses. CSRF tricks a user\'s browser into making a state-changing request that the server accepts because the browser automatically attaches cookies. CORS does not stop CSRF — use SameSite cookie attributes and CSRF tokens for that.' }
  ],
  'grpc': [
    { id: 'grpc_1', q: 'What is gRPC and how does it differ from REST?', a: 'gRPC is a high-performance RPC framework using HTTP/2 and Protocol Buffers. Unlike REST (text-based JSON over HTTP/1.1), gRPC uses binary serialization, strongly-typed contracts defined in .proto files, and supports bidirectional streaming. It is typically 5-10x faster than REST for inter-service communication.' },
    { id: 'grpc_2', q: 'What is a Protocol Buffer (.proto) file?', a: 'A language-neutral schema file defining service methods and message types. The protoc compiler generates client and server code in your target language. This contract-first approach eliminates API drift between services and provides type safety across language boundaries.' },
    { id: 'grpc_3', q: 'What are the four types of gRPC communication?', a: 'Unary (one request, one response — like REST). Server streaming (one request, stream of responses — e.g. live feed). Client streaming (stream of requests, one response — e.g. file upload). Bidirectional streaming (both sides stream simultaneously — e.g. chat).' },
    { id: 'grpc_4', q: 'How do you implement a simple gRPC server in Node.js?', a: 'Load the .proto with @grpc/proto-loader, create a gRPC server with grpc.Server(), implement the service methods defined in the proto, bind to a port with server.bindAsync(), and call server.start(). The client uses the same .proto to generate a stub and calls methods like regular async functions.' },
    { id: 'grpc_5', q: 'Your gRPC service is slow. What are common causes?', a: 'Missing connection reuse — gRPC clients should be singletons, not created per request. Large messages exceeding the 4MB default limit causing fragmentation. Synchronous blocking code inside async handlers. Missing compression (use gzip for large payloads). Also check if you should be streaming instead of making repeated unary calls.' },
    { id: 'grpc_6', q: 'gRPC client is getting "UNAVAILABLE" errors intermittently. How do you diagnose?', a: 'This usually means the server crashed or a load balancer closed the connection. Implement retry logic with exponential backoff using the built-in retryPolicy in service config. Enable keepalive pings (keepaliveTimeMs) to detect dead connections. Check if your load balancer has an idle timeout shorter than gRPC connection lifetime.' },
    { id: 'grpc_7', q: 'gRPC vs REST: when would you choose each?', a: 'Choose gRPC for internal microservice communication where performance matters, you control both sides, and need streaming. Choose REST for public APIs, browser clients (gRPC-Web is limited), third-party integrations, and when developer ergonomics and tooling (curl, Postman) matter more than raw performance.' },
    { id: 'grpc_8', q: 'What is gRPC metadata and how is it used?', a: 'Metadata is key-value pairs sent with a gRPC call, equivalent to HTTP headers. Used for authentication tokens, request tracing IDs, and deadlines. Pass metadata from client via the call options object; read it on the server from call.metadata.get("key"). Prefer metadata over embedding auth in request messages.' }
  ],
  'graphql': [
    { id: 'gql_1', q: 'What problem does GraphQL solve that REST does not?', a: 'Over-fetching (getting more fields than needed) and under-fetching (needing multiple round trips to get related data). GraphQL lets the client specify exactly what fields it needs in a single query, reducing payload size and request count. This is especially valuable for mobile clients on slow networks.' },
    { id: 'gql_2', q: 'What are the three GraphQL operation types?', a: 'Query (read data — equivalent to GET), Mutation (write data — equivalent to POST/PUT/DELETE), and Subscription (real-time updates over WebSocket — client subscribes to server-pushed events).' },
    { id: 'gql_3', q: 'What is a GraphQL resolver?', a: 'A function that fetches the data for a specific field in your schema. Each field can have a resolver; if none is provided, the default resolver reads the property of the same name from the parent object. The resolver signature is (parent, args, context, info).' },
    { id: 'gql_4', q: 'How do you implement authentication in a GraphQL API?', a: 'Parse and verify the JWT/session in server middleware before the resolver runs, then attach the user to the context object. Resolvers access context.user to check permissions. Never put auth logic inside individual resolvers — use a shared context and middleware/directive approach.' },
    { id: 'gql_5', q: 'What is the N+1 problem in GraphQL and how do you fix it?', a: 'When fetching a list of N items and each item triggers a separate DB query for related data, you get N+1 total queries. Fix it with DataLoader: it batches all the individual loads within one event loop tick into a single query, then distributes results back to each resolver.' },
    { id: 'gql_6', q: 'Your GraphQL API is slow for deep nested queries. How do you address it?', a: 'Implement query depth limiting (graphql-depth-limit) and query complexity analysis to reject expensive queries before execution. Use DataLoader for batching. Consider persisted queries to whitelist known safe queries in production. Also check if your schema design is forcing clients to over-nest.' },
    { id: 'gql_7', q: 'GraphQL vs REST: when would you choose GraphQL?', a: 'Choose GraphQL when clients have diverse data needs (mobile vs desktop), you want a single endpoint, or you are building a BFF (Backend for Frontend). Choose REST when you have simple CRUD operations, caching is critical (REST responses cache easily by URL, GraphQL POST requests do not), or your team is unfamiliar with GraphQL tooling.' },
    { id: 'gql_8', q: 'What is schema stitching vs schema federation?', a: 'Schema stitching manually merges multiple GraphQL schemas into one gateway. Federation (Apollo Federation) is the modern approach where each microservice defines its own schema with @key directives, and the gateway automatically composes them. Federation is preferred because each service remains independently deployable.' }
  ],
  'n-plus-one-problem': [
    { id: 'np1_1', q: 'What is the N+1 query problem?', a: 'When code fetches a list of N records and then issues an additional query per record to fetch related data, resulting in N+1 total database queries. Fetching 100 posts and then loading the author for each post causes 101 queries instead of 2.' },
    { id: 'np1_2', q: 'How does N+1 manifest differently in SQL ORMs vs GraphQL?', a: 'In ORMs (like Sequelize/TypeORM), it appears when you access a lazy-loaded association in a loop. In GraphQL, it occurs when a resolver for a child field runs once per parent result. Both root causes are the same: loading related data one-at-a-time inside an iteration.' },
    { id: 'np1_3', q: 'How do you fix N+1 in a SQL ORM (e.g. Sequelize)?', a: 'Use eager loading: include the related model in the initial query (findAll({ include: [User] })). This generates a JOIN or a single additional IN (...) query. Never access associations inside loops without eager loading.' },
    { id: 'np1_4', q: 'How does DataLoader solve N+1 in GraphQL/Node.js?', a: 'DataLoader collects all individual load(id) calls made during a single event loop tick and batches them into one call to your batch function (which does a single SELECT ... WHERE id IN (...)). It also caches results within a request. You create one DataLoader instance per request.' },
    { id: 'np1_5', q: 'Your API endpoint takes 2 seconds but the query looks simple. How would you detect N+1?', a: 'Enable query logging in your ORM or database to count queries per request. Use a profiler like the Sequelize query counter or pg-query-observer. In production, tools like Datadog APM or New Relic show query count per trace. A high query count (dozens or hundreds) for a single request is the signature.' },
    { id: 'np1_6', q: 'You fix an N+1 by adding an eager load, but performance gets worse. Why?', a: 'Eager loading with a JOIN on a large table can be slower than N individual indexed lookups if the join produces a large intermediate result set. Also, loading unnecessary related data wastes memory. Use pagination, select only needed columns, and consider a separate IN-query instead of a JOIN for very large sets.' },
    { id: 'np1_7', q: 'N+1 vs Cartesian Product: what is the difference?', a: 'N+1 is too many queries. Cartesian product happens with eager-loading multiple has-many associations simultaneously (e.g. posts with comments AND tags) — one JOIN multiplies rows, inflating the result set. ORMs like Sequelize split these into separate queries by default to avoid this.' },
    { id: 'np1_8', q: 'What is the difference between eager loading, lazy loading, and explicit loading?', a: 'Eager loading fetches related data in the same query via JOIN or secondary query. Lazy loading fetches it automatically on first access (triggers a query on property access — root cause of N+1). Explicit loading is a deliberate separate call to load related data after the fact. Prefer eager or explicit to avoid accidental lazy N+1.' }
  ],
  'database-migrations': [
    { id: 'dbmig_1', q: 'What is a database migration and why is it necessary?', a: 'A versioned, incremental script that transforms the database schema from one state to the next. Migrations are necessary because the schema must evolve alongside code changes, and changes must be applied consistently across dev, staging, and production environments without manual intervention.' },
    { id: 'dbmig_2', q: 'What is the difference between an up migration and a down migration?', a: 'The up function applies the change (create table, add column). The down function reverses it (drop table, drop column). Down migrations enable rollback. Many teams skip implementing down migrations for destructive changes since reverting a DROP is impossible without a backup.' },
    { id: 'dbmig_3', q: 'How do migration tools (Flyway, Liquibase, Knex) track which migrations have run?', a: 'They maintain a migrations history table in the database (schema_migrations or flyway_schema_history). Each migration has a unique version number or timestamp. On startup, the tool compares what\'s in the table against migration files and runs only the unapplied ones in order.' },
    { id: 'dbmig_4', q: 'How do you add a NOT NULL column to a table with millions of existing rows without causing downtime?', a: 'Expand-contract pattern: (1) Add the column as nullable. (2) Backfill existing rows in batches. (3) Add application code to write to the new column. (4) Once all rows are populated, add the NOT NULL constraint. Adding NOT NULL directly locks the entire table while the database validates all rows.' },
    { id: 'dbmig_5', q: 'What is a backward-compatible migration?', a: 'A schema change that the current version of application code can run against without breaking. Examples: adding a nullable column (old code ignores it), renaming a column using a view alias, or adding a new table. Non-backward-compatible changes (dropping a column still used by code) require coordinated deployment.' },
    { id: 'dbmig_6', q: 'Your migration fails halfway through in production. What happens and how do you recover?', a: 'With transactional DDL (PostgreSQL), the migration rolls back automatically — no partial state. Without it (MySQL DDL is non-transactional), you get a half-applied migration. Recovery requires manually applying the remainder or reverting, then fixing the migration file. Always wrap DDL in transactions where the database supports it.' },
    { id: 'dbmig_7', q: 'Migration-based vs state-based schema management: what is the difference?', a: 'Migration-based (Flyway, Knex): you write incremental change scripts, applied in sequence. State-based (Prisma, TypeORM sync): the tool compares your schema definition to the current DB and generates the diff to apply. Migration-based gives more control and is safer for production; state-based is faster for development but riskier in prod.' },
    { id: 'dbmig_8', q: 'How should migrations be handled in a CI/CD pipeline?', a: 'Run migrations as a separate step before deploying the new application version. Use a migration lock (e.g. advisory lock) to prevent multiple instances from running migrations simultaneously during scaled deployments. Test migrations on a staging database with production-like data size to catch performance issues before production.' }
  ],
  'websockets': [
    { id: 'ws_1', q: 'What is a WebSocket and how is it different from HTTP?', a: 'WebSocket is a persistent, full-duplex communication protocol over a single TCP connection. Unlike HTTP where the client must initiate every request, WebSockets allow the server to push data to clients at any time. After an initial HTTP upgrade handshake, both sides can send messages independently.' },
    { id: 'ws_2', q: 'Describe the WebSocket handshake.', a: 'Client sends an HTTP GET with Upgrade: websocket and Sec-WebSocket-Key headers. Server responds with 101 Switching Protocols and Sec-WebSocket-Accept (a hash of the key + GUID). After this exchange, the connection is "upgraded" — no more HTTP, raw WebSocket frames flow.' },
    { id: 'ws_3', q: 'What are WebSocket frames and what types exist?', a: 'The WebSocket protocol transfers data as frames. Types: text (UTF-8 payload), binary (arbitrary bytes), ping/pong (keepalive), and close (graceful shutdown). Fragmentation allows splitting large messages across multiple frames.' },
    { id: 'ws_4', q: 'How do you implement a WebSocket server in Node.js with the ws library?', a: 'const wss = new WebSocket.Server({ port: 8080 }); wss.on("connection", ws => { ws.on("message", msg => ws.send(reply)); }); To broadcast: wss.clients.forEach(client => { if (client.readyState === WebSocket.OPEN) client.send(data); }).' },
    { id: 'ws_5', q: 'Your WebSocket connections drop randomly after a few minutes. What is the likely cause?', a: 'Idle connection timeout from a load balancer or proxy (AWS ALB defaults to 60s). Fix: implement ping/pong keepalive (ws.ping() every 30s on server). Also check if the client has reconnect logic. Another cause: server-side memory pressure causing the process to recycle.' },
    { id: 'ws_6', q: 'How do you scale WebSocket servers horizontally?', a: 'WebSocket connections are stateful and pinned to one server instance. Use a pub/sub broker (Redis pub/sub or a message bus) so that when server A receives a message for a user connected to server B, it publishes to Redis and server B delivers it. Socket.IO has a Redis adapter that handles this automatically.' },
    { id: 'ws_7', q: 'WebSockets vs Server-Sent Events (SSE): when would you use each?', a: 'Use SSE when data flows only server-to-client (live feeds, notifications, progress bars) — SSE is simpler, uses plain HTTP, and auto-reconnects. Use WebSockets when you need bidirectional communication (chat, live collaboration, multiplayer games). SSE works through HTTP/2 multiplexing natively; WebSockets require separate infrastructure.' },
    { id: 'ws_8', q: 'How do you authenticate a WebSocket connection?', a: 'Option 1: Pass a token as a query parameter in the WebSocket URL (ws://host?token=xxx) — readable in the upgrade request on the server. Option 2: Authenticate the HTTP session before the upgrade (cookie-based auth). Do NOT wait for the first message to authenticate — reject unauthenticated upgrades immediately.' }
  ],
  'kafka': [
    { id: 'kfk_1', q: 'What is Apache Kafka and what problem does it solve?', a: 'Kafka is a distributed, append-only log used as a high-throughput message broker and event streaming platform. It decouples producers from consumers, provides durable buffering during consumer lag or downtime, enables event replay, and handles millions of messages per second — far beyond what traditional message queues can manage.' },
    { id: 'kfk_2', q: 'What are topics, partitions, and consumer groups in Kafka?', a: 'A topic is a named log of messages. Topics are split into partitions for parallelism — each partition is an ordered, immutable sequence. A consumer group is a set of consumers that collectively read all partitions of a topic, with each partition assigned to exactly one consumer in the group at a time, enabling horizontal scaling.' },
    { id: 'kfk_3', q: 'What is a Kafka offset and why is it important?', a: 'The offset is a sequential number identifying a message\'s position within a partition. Consumers track their offset to know where they left off. Committing the offset marks messages as processed. If a consumer crashes before committing, it replays from the last committed offset — giving at-least-once delivery semantics.' },
    { id: 'kfk_4', q: 'How do you produce and consume messages in Node.js with kafkajs?', a: 'Producer: const producer = kafka.producer(); await producer.connect(); await producer.send({ topic: "orders", messages: [{ key: orderId, value: JSON.stringify(order) }] }). Consumer: await consumer.subscribe({ topic: "orders" }); await consumer.run({ eachMessage: async ({ message }) => { /* process */ } }).' },
    { id: 'kfk_5', q: 'Consumer lag is growing. What does this mean and how do you address it?', a: 'Consumer lag means the consumer is falling behind the producer — unconsumed messages are accumulating. Causes: slow processing per message, single consumer overwhelmed, downstream database bottleneck. Fix: increase consumer group members (up to partition count), optimize message processing, batch DB writes, or increase partition count to allow more parallelism.' },
    { id: 'kfk_6', q: 'Messages are being processed out of order. Why and how do you fix it?', a: 'Kafka only guarantees order within a partition. If messages are spread across multiple partitions, different consumers process them independently. Fix: use a message key (e.g. user ID or order ID) so all related messages hash to the same partition. This ensures ordering for a given entity.' },
    { id: 'kfk_7', q: 'Kafka vs RabbitMQ: when would you choose each?', a: 'Choose Kafka for high-throughput event streaming, event sourcing, audit logs, or when consumers need to replay past events — Kafka retains messages by time/size. Choose RabbitMQ for traditional task queues with complex routing, acknowledgments, dead-letter queues, and lower operational overhead. Kafka is overkill for simple job queues.' },
    { id: 'kfk_8', q: 'What is exactly-once semantics in Kafka and what does it require?', a: 'Messages are processed exactly once, not duplicated or lost. Requires: idempotent producers (enable.idempotence=true) to deduplicate retried produces, and transactional APIs to atomically produce and commit consumer offsets together. Exactly-once adds latency and complexity; most systems use idempotent consumers with at-least-once delivery as a simpler alternative.' }
  ],
  'elasticsearch': [
    { id: 'es_1', q: 'What is Elasticsearch and what is it designed for?', a: 'Elasticsearch is a distributed, document-oriented search and analytics engine built on Apache Lucene. It is optimized for full-text search, log aggregation, and near-real-time analytics. Unlike relational databases, it uses inverted indexes to find documents by content rather than by row identity.' },
    { id: 'es_2', q: 'What is an inverted index?', a: 'A data structure mapping each unique term to the list of documents containing it. When you search for "payment failed", Elasticsearch looks up both terms in the inverted index, finds matching document IDs, and scores them by relevance. This makes full-text search orders of magnitude faster than scanning rows.' },
    { id: 'es_3', q: 'What are indices, shards, and replicas in Elasticsearch?', a: 'An index is a collection of documents (analogous to a DB table). Each index is divided into primary shards for horizontal scaling — each shard is a complete Lucene index. Replicas are copies of primary shards for fault tolerance and read scalability. More shards = more parallelism; more replicas = more redundancy and read throughput.' },
    { id: 'es_4', q: 'How do you perform a full-text search query in Elasticsearch?', a: 'POST /products/_search with a match query: { "query": { "match": { "description": "wireless headphones" } } }. Use multi_match to search across multiple fields. Use bool queries to combine must (AND), should (OR), and must_not (NOT) clauses for complex filtering.' },
    { id: 'es_5', q: 'Search results are missing relevant documents. How do you diagnose?', a: 'Check the mapping — if the field is keyword type, it is not analyzed and only supports exact matches. Use the Analyze API to see how text is tokenized. Verify the query type: term queries require exact match, match queries use the analyzer. Also check if documents were indexed after your query\'s index refresh interval (default 1s).' },
    { id: 'es_6', q: 'Your Elasticsearch cluster is slow. What are the common causes?', a: 'Too many shards per node (shard overhead scales with count regardless of data size — aim for shard size 10-50GB). Heap pressure causing frequent GC — allocate no more than 50% of RAM to heap. Hot-spot shards from uneven routing. Expensive wildcard or leading-wildcard queries. Enable slow query logging to identify culprits.' },
    { id: 'es_7', q: 'Elasticsearch vs PostgreSQL full-text search: when would you choose each?', a: 'Choose Elasticsearch for relevance-ranked search, autocomplete, faceted navigation, large-scale log analysis, or when you need advanced analyzers (synonyms, stemming, language-specific tokenization). Choose PostgreSQL FTS for simpler search on data already in Postgres — fewer moving parts, ACID consistency, no sync complexity.' },
    { id: 'es_8', q: 'How do you keep Elasticsearch in sync with your primary database?', a: 'Common patterns: (1) Dual-write: application writes to both DB and ES — risks inconsistency if one write fails. (2) Change Data Capture: use Debezium to stream DB change logs (binlog/WAL) to Kafka, then consume into ES — more reliable. (3) Periodic re-index: simple but causes lag. CDC is the most robust for production.' }
  ],
  'cap-theorem': [
    { id: 'cap_1', q: 'What does CAP theorem state?', a: 'A distributed system can only guarantee two of three properties simultaneously: Consistency (every read returns the most recent write or an error), Availability (every request receives a non-error response), and Partition Tolerance (the system operates despite network partitions). Since partitions are unavoidable in distributed systems, you actually choose between CP and AP.' },
    { id: 'cap_2', q: 'What is a network partition?', a: 'A scenario where network failures prevent some nodes from communicating with each other — the cluster splits into two or more groups that cannot exchange messages. Partitions happen due to hardware failures, misconfigured firewalls, or network congestion. CAP says you must choose whether to sacrifice consistency or availability during a partition.' },
    { id: 'cap_3', q: 'Give a real-world example of a CP system and an AP system.', a: 'CP: HBase, Zookeeper, etcd — they refuse requests or block during a partition to maintain consistency. Banking transaction ledgers prioritize consistency. AP: Cassandra, CouchDB, DynamoDB (default) — they continue serving requests during partitions, accepting potential stale reads. Shopping cart availability > perfect consistency.' },
    { id: 'cap_4', q: 'What is eventual consistency?', a: 'A consistency model where, given no new updates, all replicas will eventually converge to the same value. In the interim, reads may return stale data. Used by DNS, Cassandra, S3. The key question is: "How long is eventually?" — acceptable for social feeds, not acceptable for account balances.' },
    { id: 'cap_5', q: 'Your distributed cache is returning stale data after a write. Why and how do you fix it?', a: 'Likely cause: the write hit one node but your read is served by a replica that has not yet synced. Fix options: use synchronous replication (CP, higher latency), read from the primary/leader node for critical reads, implement read-your-writes consistency by routing a user\'s reads to the same node as their writes, or cache-bust by key after write.' },
    { id: 'cap_6', q: 'Why is PACELC considered an improvement over CAP theorem?', a: 'CAP only considers behavior during partitions (P). PACELC extends it: even when the system is running normally (Else, no partition), you still face a latency vs consistency tradeoff. Systems that replicate synchronously have better consistency but higher latency; async replication is faster but risks stale reads. PACELC captures this everyday tradeoff.' },
    { id: 'cap_7', q: 'CAP vs ACID: what is the relationship?', a: 'ACID (Atomicity, Consistency, Isolation, Durability) is a set of properties for individual transactions in a single database. CAP applies to distributed systems with multiple nodes. A single-node ACID database is trivially CP. When you distribute an ACID system, you must choose: sacrifice availability (CP like distributed PostgreSQL) or weaken consistency (AP).' },
    { id: 'cap_8', q: 'What is quorum read/write and how does it relate to CAP?', a: 'A quorum requires a majority of nodes (N/2 + 1) to acknowledge a write or agree on a read before it succeeds. With replication factor 3, quorum = 2. This allows one node to be down while maintaining consistency. It is a CP tradeoff — you sacrifice availability (if 2 nodes are down, requests fail) to guarantee you are reading the most recent write.' }
  ],
  'database-sharding': [
    { id: 'shrd_1', q: 'What is database sharding?', a: 'Horizontal partitioning of a database across multiple physical servers (shards), where each shard holds a subset of the total data. Unlike vertical scaling (bigger server), sharding scales linearly by adding more servers. Each shard is an independent database instance; together they form the complete dataset.' },
    { id: 'shrd_2', q: 'What is a shard key and what makes a good one?', a: 'The shard key is the field used to determine which shard a record belongs to. A good shard key has high cardinality (many distinct values), distributes data evenly across shards, and is accessed in most queries to avoid cross-shard scatter. User ID or tenant ID are common choices. Avoid monotonically increasing keys (like timestamps) which create hotspots.' },
    { id: 'shrd_3', q: 'What is hash sharding vs range sharding?', a: 'Hash sharding applies a hash function to the shard key and assigns records to shards by hash bucket — achieves even distribution but makes range queries span all shards. Range sharding assigns contiguous key ranges to each shard — efficient for range queries but can create hotspots if data is not evenly distributed across ranges (e.g. most users have recent IDs).' },
    { id: 'shrd_4', q: 'What application-level changes are needed to support sharding?', a: 'Queries must include the shard key so the routing layer sends them to the correct shard. Cross-shard JOINs are no longer possible natively — denormalize or move JOIN logic to the application. Transactions spanning multiple shards require distributed transaction protocols (2PC) or redesigned business logic to avoid them.' },
    { id: 'shrd_5', q: 'One shard is getting far more traffic than others. What is this called and how do you fix it?', a: 'This is a hot shard (hotspot). Caused by a poor shard key choice where a small number of keys receive disproportionate traffic. Fix: re-shard with a better key (costly, requires data migration), add a secondary shard key with a random suffix to spread the hotkey, or introduce a caching layer in front of the hot shard.' },
    { id: 'shrd_6', q: 'How do you add a new shard to an existing sharded database?', a: 'Rebalancing requires migrating a portion of data from existing shards to the new one, updating the routing map, and then removing that data from the old shards. Consistent hashing minimizes the amount of data moved when adding shards. During migration, use dual-write (write to old and new shard) to avoid downtime.' },
    { id: 'shrd_7', q: 'Database sharding vs table partitioning: what is the difference?', a: 'Table partitioning splits a single table into multiple physical partitions on the same database server — transparent to the application, no cross-shard query issues, limited to vertical scaling. Sharding splits data across multiple separate database servers — application must be shard-aware, enables true horizontal scale, but adds significant operational complexity.' },
    { id: 'shrd_8', q: 'What are the alternatives to sharding before you actually shard?', a: 'In order of complexity: vertical scaling (bigger server), adding read replicas to offload reads, effective indexing and query optimization, caching frequently-read data, archiving/deleting old data, and using a more appropriate database type (columnar DB for analytics). Sharding is a last resort due to its operational and query complexity costs.' }
  ],
  'owasp-top10': [
    { id: 'owsp_1', q: 'What is SQL injection and how do you prevent it?', a: 'An attacker inserts SQL syntax into user input that gets executed by the database. Prevention: always use parameterized queries / prepared statements — never concatenate user input into SQL strings. ORMs parameterize by default. Also apply least-privilege database users and validate/sanitize inputs as defense-in-depth.' },
    { id: 'owsp_2', q: 'What is Broken Access Control and give two examples?', a: 'When users can act beyond their intended permissions. Examples: (1) IDOR — changing /invoices/123 to /invoices/124 exposes another user\'s data because the server does not verify ownership. (2) Privilege escalation — a regular user modifying their role to "admin" via a request parameter. Fix: enforce server-side authorization checks on every request.' },
    { id: 'owsp_3', q: 'What is XSS (Cross-Site Scripting) and what are its three types?', a: 'Attacker injects malicious scripts into pages viewed by other users. Stored XSS: script persisted in DB, served to all viewers. Reflected XSS: script in URL parameter echoed in response. DOM-based XSS: script executed via client-side JS. Prevention: escape output when rendering HTML, use Content-Security-Policy headers, avoid innerHTML with user data.' },
    { id: 'owsp_4', q: 'What is insecure direct object reference (IDOR)?', a: 'When an API exposes a direct reference to an internal object (like a database ID) without verifying the requesting user has access to that object. Example: GET /api/orders/5432 returns data regardless of who is logged in. Fix: always verify that the authenticated user owns or has permission to access the requested resource before returning it.' },
    { id: 'owsp_5', q: 'What is a security misconfiguration and name three common examples?', a: 'Insecure default settings left in place. Examples: (1) Debug mode or stack traces enabled in production. (2) Default credentials not changed (admin/admin). (3) Unnecessary ports or services exposed. (4) S3 bucket with public read/write access. (5) CORS set to * in production APIs. Automate config hardening with infrastructure-as-code.' },
    { id: 'owsp_6', q: 'What is sensitive data exposure and how do you prevent it?', a: 'Storing or transmitting sensitive data (passwords, PII, card numbers) without adequate protection. Prevention: hash passwords with bcrypt/Argon2 (never MD5/SHA1). Encrypt sensitive fields at rest. Always use HTTPS/TLS. Never log sensitive data. Return only the minimum necessary fields in API responses. Check for accidental exposure in error messages.' },
    { id: 'owsp_7', q: 'Your API returns a JWT. A user modifies the payload and the server accepts it. What went wrong?', a: 'The server is not validating the JWT signature, or someone used the "none" algorithm attack (setting alg to "none" to bypass signature verification). Fix: always explicitly specify allowed algorithms when verifying JWTs (reject "none"). Use a well-maintained library (jsonwebtoken) and never trust the alg header from the token itself.' },
    { id: 'owsp_8', q: 'What is the difference between authentication and authorization vulnerabilities?', a: 'Authentication vulnerabilities let attackers log in as someone else or bypass login entirely (weak passwords, brute-force, credential stuffing, broken session management). Authorization vulnerabilities let authenticated users access resources or actions they should not have (IDOR, privilege escalation, missing access checks). Both require separate defenses.' }
  ],
  'kubernetes': [
    { id: 'k8s_1', q: 'What problem does Kubernetes solve?', a: 'Kubernetes automates deployment, scaling, and management of containerized applications. It solves: manual container orchestration across servers, self-healing (restarting failed containers), rolling updates without downtime, service discovery between containers, resource scheduling, and horizontal autoscaling based on load.' },
    { id: 'k8s_2', q: 'What is the difference between a Pod, Deployment, and Service?', a: 'A Pod is the smallest deployable unit — one or more containers sharing network and storage. A Deployment manages a desired count of identical Pod replicas, handles rolling updates, and self-heals by replacing crashed Pods. A Service provides a stable IP and DNS name to reach a set of Pods (using label selectors), enabling load balancing and discovery.' },
    { id: 'k8s_3', q: 'What is a ConfigMap and Secret and when would you use each?', a: 'ConfigMap stores non-sensitive configuration (environment variables, config files). Secret stores sensitive data (passwords, API keys, TLS certs) — encoded in base64 and stored more securely (can be encrypted at rest, access-controlled via RBAC). Both are injected into Pods as environment variables or mounted volumes. Never store secrets in ConfigMaps or Docker images.' },
    { id: 'k8s_4', q: 'How does a Kubernetes rolling update work and how do you configure it?', a: 'During a rolling update, Kubernetes gradually replaces old Pods with new ones. Configure in Deployment spec: strategy.type: RollingUpdate with maxUnavailable (max Pods that can be down) and maxSurge (extra Pods created during update). New Pods must pass readinessProbe before old ones are terminated. Use kubectl rollout undo to revert.' },
    { id: 'k8s_5', q: 'Pod is stuck in CrashLoopBackOff. How do you diagnose?', a: 'kubectl describe pod <name> to see events and last exit reason. kubectl logs <pod> --previous to see logs from the crashed container. Common causes: application startup crash (check app logs), failed readinessProbe misconfiguration, missing environment variables or secrets, out-of-memory (OOMKilled in describe), or wrong container image/command.' },
    { id: 'k8s_6', q: 'Pods are getting OOMKilled. What does this mean and how do you fix it?', a: 'The container exceeded its memory limit and the kernel killed it. Check limits in the Deployment spec. Fix: increase memory limit if the limit is too low, or fix a memory leak in the application. Set requests accurately for the scheduler, and set limits slightly above peak usage. Use Vertical Pod Autoscaler to get resource recommendations based on actual usage.' },
    { id: 'k8s_7', q: 'Kubernetes vs Docker Compose: when would you use each?', a: 'Docker Compose is for running multi-container applications on a single machine — simple, great for local development and small deployments. Kubernetes is for production-grade orchestration across multiple nodes — it adds self-healing, autoscaling, rolling updates, and multi-node scheduling. The operational complexity of Kubernetes is only justified at production scale.' },
    { id: 'k8s_8', q: 'What is a readinessProbe vs livenessProbe?', a: 'readinessProbe determines if a Pod is ready to receive traffic — if it fails, the Pod is removed from Service endpoints but not restarted. Use for indicating "I am still starting" or "I am temporarily overloaded." livenessProbe determines if a Pod is alive — if it fails, Kubernetes restarts the container. Never set liveness too aggressively or you will cause unnecessary restarts under load.' }
  ],
  'domain-driven-design': [
    { id: 'ddd_1', q: 'What is Domain-Driven Design and what problem does it address?', a: 'DDD is a software design approach where the structure and language of code matches the business domain. It addresses the problem of complex business logic becoming buried in technical layers or scattered across the codebase, making the system hard to understand, change, and extend as the domain grows.' },
    { id: 'ddd_2', q: 'What is a Bounded Context?', a: 'An explicit boundary within which a domain model applies consistently. The same term can mean different things in different bounded contexts (a "customer" in billing context vs. in the support context). Each bounded context has its own model, language, and ideally its own service or module. They communicate through well-defined interfaces.' },
    { id: 'ddd_3', q: 'What is the difference between an Entity and a Value Object?', a: 'An Entity has a unique identity that persists over time (User ID 42 is the same user even if they change their name). A Value Object is defined by its attributes, has no identity, and is immutable (a Money { amount: 50, currency: "USD" } is equal to any other Money with the same values). Value Objects should be replaced, not mutated.' },
    { id: 'ddd_4', q: 'What is an Aggregate and what is an Aggregate Root?', a: 'An Aggregate is a cluster of domain objects treated as a single unit for data changes. The Aggregate Root is the single entry point to the cluster — external objects may only reference the root, never internal members directly. All changes must go through the root, which enforces invariants and consistency rules for the entire cluster.' },
    { id: 'ddd_5', q: 'What is a Domain Event?', a: 'A record that something significant happened in the domain: OrderPlaced, PaymentFailed, UserRegistered. Domain events are immutable, named in past tense, and capture what happened and when. They decouple the triggering action from downstream reactions — other parts of the system (or other services) subscribe to events and react independently.' },
    { id: 'ddd_6', q: 'How do you implement DDD in a Node.js/Express application without a framework?', a: 'Organize code by domain concept, not technical layer: /order/, /payment/, /user/ each containing their entity, repository, and service. Keep business logic in domain objects, not in controllers or route handlers. Use repository interfaces to abstract persistence. Emit domain events via a simple event bus (EventEmitter or a message broker) instead of direct coupling.' },
    { id: 'ddd_7', q: 'DDD vs CRUD: what is the fundamental difference?', a: 'CRUD models data as tables and exposes create/read/update/delete operations — the API mirrors the database schema. DDD models behavior and business intent — operations are named after domain actions (placeOrder, processRefund, suspendAccount) and hide implementation details. CRUD is fine for simple apps; DDD pays off when business rules are complex and changing.' },
    { id: 'ddd_8', q: 'What is the Ubiquitous Language in DDD?', a: 'A shared vocabulary between developers and domain experts (business stakeholders) that is used consistently in all conversations, documentation, and code. If the business says "invoice" and the code says "bill_record", that disconnect causes misunderstanding. Ubiquitous Language means the code\'s class names, method names, and variable names match exactly what the domain experts say.' }
  ],

  'linux-terminal': [
    { id: 'lnx_1', q: 'What is the difference between SIGTERM and SIGKILL?', a: 'SIGTERM (kill) politely asks a process to shut down — it can finish in-flight work, close connections, and clean up. SIGKILL (kill -9) terminates immediately with no cleanup chance. Always try SIGTERM first; SIGKILL is the last resort.' },
    { id: 'lnx_2', q: 'What does chmod 755 mean?', a: 'Permissions in octal: owner=7 (read+write+execute), group=5 (read+execute), others=5 (read+execute). Each digit is r(4)+w(2)+x(1). 755 is standard for directories and executables; 644 for regular files.' },
    { id: 'lnx_3', q: 'How do you follow a log file in real time and filter for errors?', a: 'tail -f /var/log/app.log | grep --line-buffered ERROR. tail -f streams new lines as they are written; grep filters them. This is the most common production debugging pattern.' },
    { id: 'lnx_4', q: 'What does the pipe operator | do?', a: 'It connects the stdout of one command to the stdin of the next, letting you chain small tools into powerful pipelines: cat access.log | grep 500 | wc -l counts how many 500 errors are in a log.' },
    { id: 'lnx_5', q: 'How do you find which process is using port 3000?', a: 'lsof -i :3000 or ss -tlnp | grep 3000. Essential when a server fails to start with EADDRINUSE — find the PID holding the port, then decide whether to stop it.' },
    { id: 'lnx_6', q: 'What is the difference between > and >> redirection?', a: '> overwrites the target file with the command output; >> appends to it. 2>&1 additionally merges stderr into stdout so errors land in the same file: node app.js > app.log 2>&1.' },
    { id: 'lnx_7', q: 'What is SSH and why do backend developers use it constantly?', a: 'Secure Shell — an encrypted protocol for logging into remote machines (ssh user@server). Production servers have no GUI; SSH plus the terminal is how you deploy, inspect logs, and debug on real infrastructure.' },
    { id: 'lnx_8', q: 'A server is "out of disk" — what commands diagnose it?', a: 'df -h shows usage per filesystem (find the full mount). du -sh /* | sort -rh | head finds the biggest directories. The usual culprits are unrotated log files and old build artifacts. Full disks are a top cause of mystery production outages.' }
  ],

  'git-version-control': [
    { id: 'git_1', q: 'What are the three areas of Git?', a: 'Working directory (your actual files) → staging area (changes marked with git add) → repository (snapshots saved with git commit). This separation lets you compose a commit from only some of your changes.' },
    { id: 'git_2', q: 'What is a branch in Git, technically?', a: 'Just a movable pointer to a commit — creating one is instant and free. Commits form a DAG; the branch pointer advances as you commit. HEAD points to the branch (or commit) you currently have checked out.' },
    { id: 'git_3', q: 'Merge vs rebase — what is the difference?', a: 'Merge joins two histories with a merge commit, preserving the true timeline. Rebase replays your commits on top of another base, producing linear history but rewriting commit hashes. Never rebase commits that are already pushed and shared.' },
    { id: 'git_4', q: 'How do you undo a commit that was already pushed to a shared branch?', a: 'git revert <sha> — it creates a new commit that reverses the change, keeping history intact. Never git reset + force-push on shared branches: that erases teammates\' work.' },
    { id: 'git_5', q: 'You committed an API key. What now?', a: '1) Rotate the key immediately — it is compromised forever once pushed. 2) Remove it from history (git filter-repo or BFG) and force-push. 3) Add the file to .gitignore. Deleting the file in a new commit is NOT enough — it remains in history.' },
    { id: 'git_6', q: 'What is git stash for?', a: 'Temporarily shelving uncommitted changes so you can switch context (git stash), then restoring them later (git stash pop). Useful when you need to pull, switch branches, or hotfix mid-task.' },
    { id: 'git_7', q: 'What is git reflog and why does it remove fear?', a: 'A local log of every position HEAD has been at — even after reset --hard or a deleted branch, the commits still exist and reflog shows their hashes. Almost nothing in Git is truly lost for ~90 days.' },
    { id: 'git_8', q: 'What makes a good commit?', a: 'Atomic (one logical change), with a message stating what and why: "fix: prevent duplicate order on double-click". Small atomic commits make review, revert, bisect, and cherry-pick trivial.' }
  ],

  'github-collaboration': [
    { id: 'gh_1', q: 'Walk through the standard PR workflow.', a: 'Branch from main → commit changes → push branch → open a pull request → CI runs tests/lint automatically → teammates review and comment → you address feedback with new commits → merge (usually squash) → delete the branch.' },
    { id: 'gh_2', q: 'What is branch protection?', a: 'Repository rules that block direct pushes to main, require approving reviews and passing CI before merge, and forbid force-pushes. Every serious project enables it — it makes the review workflow mandatory rather than optional.' },
    { id: 'gh_3', q: 'Merge commit vs squash merge vs rebase merge?', a: 'Merge commit keeps every branch commit plus a merge node (full history, noisy). Squash collapses the whole PR into one clean commit (most common choice). Rebase merge replays each commit onto main for linear history without a merge node.' },
    { id: 'gh_4', q: 'What makes a PR easy to review?', a: 'Small (under ~400 lines), single-purpose, descriptive title, a description explaining what/why with test evidence, and self-review comments answering predictable questions. Reviewers rubber-stamp giant PRs — small ones get real review.' },
    { id: 'gh_5', q: 'What is the difference between origin and upstream?', a: 'origin is the remote you cloned from and push to (often your fork). upstream conventionally points at the original source repo when you work from a fork — you pull updates from upstream and push your work to origin.' },
    { id: 'gh_6', q: 'How does the open-source contribution flow differ from team flow?', a: 'You fork the repo (no push access to the original), branch on your fork, push there, then open a PR from your fork to the upstream repo. Maintainers review and merge. Team flow skips the fork since you have repo access.' },
    { id: 'gh_7', q: 'Why should CI run on every PR?', a: 'Machines should catch what machines can catch — failing tests, lint, type errors — before any human spends review time. GitHub Actions runs these automatically on push; branch protection blocks merging until they pass.' },
    { id: 'gh_8', q: 'A teammate requests changes you disagree with. What do you do?', a: 'Discuss in the PR thread with technical reasoning — review is about the code, not the person. If you still disagree, a quick call or a third opinion settles it. Silently ignoring comments or merging anyway destroys team trust.' }
  ]
}
