import type { CurriculumTopic } from '@/types'

/** Mobile Development — Phase 5: Networking on Mobile (concept-first, framework-agnostic). */
export const MOBILE_P5: CurriculumTopic[] = [
  {
    "id": "mobile-request-lifecycle",
    "phase": 5,
    "phaseName": "Networking on Mobile",
    "orderIndex": 1,
    "estimatedMins": 35,
    "prerequisites": [],
    "title": "The Mobile Request Lifecycle",
    "eli5": "When your phone loads something from the internet, a lot happens before the data arrives: it looks up the address, opens a connection, locks it with a secret handshake, and only then asks for the data. On a phone, even waking up the radio antenna costs time and battery, so each step is more expensive than on a laptop with WiFi plugged into the wall.",
    "analogy": "Making a request is like phoning a business overseas. First you look up the number (DNS), then dial and wait for them to pick up (TCP), then you both agree on a private language (TLS), and finally you talk (HTTP). On a mobile phone, the antenna is like an operator who fell asleep — you first have to wake them up, which takes a moment and drains the battery, before any call can even start.",
    "explanation": "Every network request goes through the same stages: DNS resolution (turn a hostname into an IP), TCP connection setup (a handshake to establish a reliable link), TLS negotiation (a second handshake to encrypt it), then the actual HTTP request and response. Each stage is a round trip to a server, and round trips are slow — especially on mobile where signal is weaker and latency higher. Two mobile-specific costs dominate: connection reuse (keeping a connection open so you skip the handshakes next time) and radio wakeup (the cellular antenna powers down to save battery and must ramp back up for each burst of traffic, adding latency and draining power).\n\nAndroid vs iOS: On Android, the HTTP stack (OkHttp under most clients) maintains a connection pool that reuses keep-alive connections and supports HTTP/2 multiplexing, and the platform urges you to batch and schedule network work so the radio isn't woken repeatedly. On iOS, URLSession manages connection reuse, HTTP/2, and coalescing for you, and background/discretionary transfers let the system pick energy-efficient moments to use the radio. Both platforms optimize hardest around not waking the radio needlessly.",
    "technicalDeep": "The setup cost of a fresh HTTPS connection is roughly: 1 RTT for DNS (if uncached), 1 RTT for the TCP handshake, and 1-2 RTTs for TLS — so a cold request can cost 3-4 round trips before a single byte of data flows. On a high-latency mobile link (100-300ms RTT), that's easily half a second of pure setup. Connection reuse (HTTP keep-alive and HTTP/2 multiplexing over one connection) amortizes this: subsequent requests skip DNS, TCP, and TLS entirely. TLS 1.3 and QUIC/HTTP3 cut the handshake to 1-RTT or 0-RTT on resumption, which matters enormously on mobile. The radio state machine (RRC) is the mobile-unique cost: the cellular modem transitions between idle, low-power, and high-power states, and each burst of data forces a promotion that costs latency (the ramp-up) and keeps the radio in a high-power tail state for seconds afterward, burning battery. This is why many small, spread-out requests are far more expensive than one batched transfer.\n\nAndroid vs iOS: Android exposes this directly — docs quantify the radio 'tail' energy and recommend bundling requests and prefetching so the radio wakes once and does more. OkHttp's connection pool and HTTP/2 keep connections warm across requests. iOS URLSession similarly reuses connections and offers waitsForConnectivity and background sessions so transfers happen when connectivity and energy are favorable, and it coalesces requests to the same host. Both strongly prefer fewer, larger, well-timed transfers over chatty ones.",
    "whatBreaks": "Opening a fresh connection per request pays the full DNS+TCP+TLS handshake every time, multiplying latency on already-slow links. Chatty request patterns wake the radio repeatedly, draining battery via the high-power tail state and causing perceptible lag. Ignoring keep-alive/HTTP2 leaves you on HTTP/1.1 head-of-line blocking. Uncached DNS on captive-portal or flaky networks adds an unpredictable RTT. Not accounting for high RTT means UI timeouts fire on connections that would have succeeded a moment later. Long-held connections that the carrier silently drops cause stalls until a timeout.",
    "efficientWay": {
      "title": "Minimizing request cost on cellular",
      "approaches": [
        {
          "name": "Reuse pooled keep-alive/HTTP2 connections, batch and prefetch requests, and let the platform schedule transfers",
          "verdict": "best",
          "reason": "Amortizes handshakes across requests and wakes the radio once for more work — lowest latency and battery cost."
        },
        {
          "name": "Standard client defaults with connection reuse but no batching or scheduling",
          "verdict": "ok",
          "reason": "Connection pooling helps, but chatty, unbatched requests still wake the radio repeatedly and pay the tail-energy cost."
        },
        {
          "name": "A fresh connection per request with no pooling or scheduling",
          "verdict": "weak",
          "reason": "Full handshake every time and constant radio wakeups — worst latency and the fastest way to drain the battery."
        }
      ],
      "recommendation": "Use a client that pools and reuses HTTP/2 connections, prefer TLS 1.3/HTTP3 where available, and batch or prefetch requests so the radio wakes once and does meaningful work. Hand deferrable transfers to the platform scheduler so they run at energy-efficient moments."
    },
    "commonMistakes": [
      "Opening a new connection per request instead of reusing pooled keep-alive/HTTP2 connections",
      "Firing many small requests spread over time, repeatedly waking the radio and draining battery",
      "Setting timeouts as if on WiFi, so they fire prematurely on high-latency cellular links",
      "Ignoring the radio tail-energy cost and treating mobile networking like a wired connection"
    ],
    "seniorNotes": "The mental model to carry: on mobile, the connection setup and the radio state machine, not the payload size, often dominate cost. That reframes optimization from 'send fewer bytes' to 'wake the radio less and reuse warm connections.' Batching, prefetching during an already-active radio window, and coalescing background work are the highest-leverage moves. Know the handshake RTT budget so you can reason about why a cold first request feels slow and a warm one is instant. And treat timeouts as a distribution, not a constant — mobile RTT varies wildly, so aggressive timeouts cause false failures on connections that were about to succeed.",
    "interviewQuestions": [
      "Walk through everything that happens from a phone before the first byte of an HTTPS response arrives.",
      "What is radio wakeup / tail energy and how does it change how you design mobile networking?",
      "How does connection reuse reduce latency, and what enables it?"
    ],
    "interviewAnswers": [
      "First DNS resolves the hostname to an IP, costing a round trip if not cached. Then TCP does its three-way handshake to establish a reliable connection, another round trip. Then TLS negotiates encryption — one to two round trips depending on version and resumption. Only then does the HTTP request go out and the response come back. On a cellular link with 100-300ms RTT, that's often three to four round trips of setup, easily half a second, before any application data flows — plus waking the radio if it was idle.",
      "The cellular modem powers down to save battery and must ramp up to a high-power state to transmit; after a burst it lingers in a high-power tail state for seconds before powering down again. So every isolated request pays a wakeup latency and burns tail energy. It changes design by favoring batching and prefetching — waking the radio once to do a lot of work — over many small requests spread across time, which repeatedly pay the wakeup and tail cost and drain the battery.",
      "Connection reuse keeps a TCP+TLS connection open after a request (keep-alive), and HTTP/2 multiplexes many requests over that single connection. So subsequent requests skip DNS, the TCP handshake, and the TLS handshake entirely — eliminating several round trips of setup. It's enabled by connection pooling in the HTTP client plus keep-alive and HTTP/2 support on both client and server; the result is a warm connection where new requests start almost immediately."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Cold vs warm request cost (pseudocode)",
        "code": "// COLD request: full setup before any data\ncost(coldRequest) =\n    DNS_lookup        // ~1 RTT (if uncached)\n  + TCP_handshake     // ~1 RTT\n  + TLS_handshake     // ~1-2 RTT\n  + HTTP_round_trip   // ~1 RTT\n  + maybe radioWakeup // ramp-up latency + tail energy\n\n// WARM request over a reused HTTP/2 connection\ncost(warmRequest) = HTTP_round_trip   // skips DNS/TCP/TLS entirely\n\n// Strategy: keep the connection warm + wake the radio once\nclient = HttpClient(connectionPool = keepAlive, protocol = HTTP2)\nbatch = [reqA, reqB, reqC]\nclient.sendAll(batch)   // one radio window, multiplexed, reused connection"
      }
    ],
    "resources": [
      {
        "label": "Android: Optimize downloads for efficient network access",
        "url": "https://developer.android.com/training/efficient-downloads",
        "kind": "docs"
      },
      {
        "label": "Apple: URLSession",
        "url": "https://developer.apple.com/documentation/foundation/urlsession",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "flaky-network-design",
    "phase": 5,
    "phaseName": "Networking on Mobile",
    "orderIndex": 2,
    "estimatedMins": 40,
    "prerequisites": [
      "mobile-request-lifecycle"
    ],
    "title": "Designing for Flaky Networks",
    "eli5": "Phones lose signal constantly — in elevators, tunnels, and dead zones. A good app expects the network to fail and plans for it: it waits a sensible amount of time, tries again if something fails, remembers what it still needs to send, and makes sure trying twice never charges you twice.",
    "analogy": "It's like mailing an important letter when the post office is unreliable. You give it a reasonable deadline (timeout), resend if it bounces but wait a bit longer each time so you don't clog the mailbox (backoff), keep unsent letters in an outbox (offline queue), and number each letter so if two copies arrive the recipient knows to ignore the duplicate (idempotency).",
    "explanation": "Mobile networks are unreliable by nature: signal drops, switches between WiFi and cellular, and has high, variable latency. Robust apps treat failure as the normal case, not the exception. The core tools are: timeouts (don't wait forever for a response), retries with exponential backoff plus jitter (retry failures, but wait progressively longer and add randomness so many clients don't retry in sync), an offline queue (hold requests that can't be sent now and flush them later), and idempotency (design operations so retrying them is safe and never duplicates an effect). Together these make an app feel dependable on an undependable network.\n\nAndroid vs iOS: On Android, retry/backoff and queued work are commonly handled with WorkManager (constraint-aware, guaranteed-eventually, built-in exponential backoff) and OkHttp's retry/timeout configuration; the offline queue is usually a durable table drained by a worker. On iOS, URLSession offers configurable timeouts and waitsForConnectivity so a request waits for connectivity instead of failing immediately, and background sessions retry transfers opportunistically; the queue is again a durable local store. Both platforms encourage letting the system decide good moments to retry rather than tight client loops.",
    "technicalDeep": "Timeouts must be layered: a connect timeout (time to establish the connection), a read/request timeout (time to get a response), and often an overall deadline; on mobile these should be generous enough for high RTT but bounded so the UI can react. Retries only make sense for transient failures (network errors, 5xx, timeouts) — never for deterministic 4xx like 400/401/404, which will fail identically. Exponential backoff (delay doubles each attempt: 1s, 2s, 4s...) prevents hammering a struggling server; jitter (randomizing the delay) prevents the thundering-herd problem where thousands of clients retry at the same instant and synchronize into repeated spikes. A cap on max retries and total delay prevents infinite loops. The offline queue must be durable (survives process death) and drained by a background worker that respects connectivity. Idempotency is the linchpin of safe retries: because a request may succeed on the server but fail before the client sees the response, the client may retry an operation that already happened — so mutating requests carry an idempotency key (a client-generated id) that lets the server deduplicate and return the original result instead of applying it twice.\n\nAndroid vs iOS: WorkManager gives you exponential-vs-linear backoff policies and constraint gating for free, so you rarely hand-roll retry loops on Android. URLSession's waitsForConnectivity and background transfer daemon shift retry timing to the OS on iOS. Both leave idempotency to you and the server contract — the platform can retry, but only an idempotency key makes that retry safe for writes like payments or order creation.",
    "whatBreaks": "No timeout means a stalled request hangs the UI or a spinner forever when signal drops mid-flight. Retrying without backoff hammers a degraded server and worsens the outage; retrying without jitter synchronizes clients into repeated thundering-herd spikes. Retrying non-idempotent writes duplicates orders, messages, or charges. Retrying 4xx errors wastes battery on requests that can never succeed. An in-memory-only queue loses pending requests on process kill. Unbounded retries drain the battery and never give up on a truly dead endpoint. Treating a timeout as a definite failure (when the server may have succeeded) causes double-effects without idempotency keys.",
    "efficientWay": {
      "title": "Making requests resilient to bad networks",
      "approaches": [
        {
          "name": "Layered timeouts, retry only transient errors with capped exponential backoff + jitter, durable offline queue, and idempotency keys on writes",
          "verdict": "best",
          "reason": "Survives drops and switches, protects the server from stampedes, never double-applies writes, and never loses queued work."
        },
        {
          "name": "Fixed timeout with a small number of immediate retries",
          "verdict": "ok",
          "reason": "Better than nothing and simple, but immediate retries can hammer a struggling server and offer no protection against duplicated writes."
        },
        {
          "name": "No timeouts, unlimited instant retries, no queue or idempotency",
          "verdict": "weak",
          "reason": "Hangs the UI, stampedes the server, duplicates writes, drains the battery, and loses pending work on process death."
        }
      ],
      "recommendation": "Set layered, mobile-appropriate timeouts; retry only transient failures with capped exponential backoff and jitter; persist unsendable requests in a durable queue drained by a background worker; and attach an idempotency key to every mutating request so retries are always safe."
    },
    "commonMistakes": [
      "Retrying non-idempotent writes without an idempotency key, causing duplicate orders or charges",
      "Retrying with no backoff or no jitter, hammering the server and creating thundering-herd spikes",
      "Retrying deterministic 4xx errors that will always fail instead of only transient failures",
      "Keeping the pending-request queue in memory so it's lost when the OS kills the app"
    ],
    "seniorNotes": "The subtle, senior-level insight is that a timeout is ambiguous: the request may have reached and mutated the server even though the client saw a failure — so 'retry on timeout' is only safe for writes if the operation is idempotent via a client-supplied key. That single idea prevents a whole class of duplicate-charge incidents. Jitter is the other non-obvious must-have: pure exponential backoff still synchronizes clients that failed together, so you randomize. Prefer the platform's managed retry/scheduling (WorkManager, background URLSession) over bespoke loops — it handles constraints, backoff, and process death and cooperates with battery optimization. Finally, classify errors deliberately: retryable (transient network, 5xx, timeout) vs terminal (4xx), because retrying the wrong class either wastes battery or masks a real bug.",
    "interviewQuestions": [
      "Why do you need exponential backoff AND jitter on retries — what does each prevent?",
      "Why is idempotency essential when retrying requests over a flaky network?",
      "Which failures should you retry and which should you not, and how do timeouts fit in?"
    ],
    "interviewAnswers": [
      "Exponential backoff makes each retry wait progressively longer (1s, 2s, 4s...) so a struggling or overloaded server gets breathing room instead of being hammered by immediate repeats. Jitter adds randomness to those delays so that many clients which failed at the same moment don't all retry in lockstep — without it they synchronize into repeated coordinated spikes, the thundering-herd problem, that can keep an already-degraded server down. Backoff protects the server over time; jitter de-correlates clients so their retries spread out.",
      "On a flaky network a request can succeed on the server but the response never reaches the client — a timeout or dropped connection. The client then retries, and without protection the operation runs twice: two orders, two charges, two messages. Idempotency means each mutating request carries a client-generated key so the server recognizes a duplicate and returns the original result instead of applying it again. That makes retrying safe, which is the whole point of retries on an unreliable link.",
      "Retry transient failures — network errors, timeouts, and 5xx server errors — because they may succeed on a later attempt. Don't retry deterministic 4xx errors like 400, 401, or 404; they'll fail identically and just waste battery, and often signal a bug or auth issue to fix instead. Timeouts bound how long you wait before deciding a request failed; they're layered (connect, read, overall) and generous for mobile RTT, and a timeout is treated as retryable but ambiguous, which is exactly why writes need idempotency keys."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Retry with capped backoff + jitter and idempotency (pseudocode)",
        "code": "async sendWithRetry(request):\n  request.headers['Idempotency-Key'] = request.clientId   // safe retries\n  attempt = 0\n  maxAttempts = 5\n  baseDelay = 1s\n  while true:\n    try:\n      resp = http.send(request, connectTimeout = 10s, readTimeout = 30s)\n      if resp.status in 2xx: return resp\n      if resp.status in 4xx: throw Terminal(resp)   // do NOT retry\n      // 5xx -> fall through to retry\n    catch (NetworkError or Timeout or ServerError):\n      attempt += 1\n      if attempt >= maxAttempts:\n        enqueueOffline(request)      // durable queue, flush later\n        throw GaveUp\n      // exponential backoff + full jitter\n      delay = random(0, min(baseDelay * 2^attempt, 30s))\n      sleep(delay)"
      },
      {
        "lang": "swift",
        "label": "Let URLSession wait for connectivity (iOS example)",
        "code": "let config = URLSessionConfiguration.default\nconfig.waitsForConnectivity = true          // wait, don't fail instantly\nconfig.timeoutIntervalForRequest = 30        // per-request read timeout\nconfig.timeoutIntervalForResource = 300      // overall deadline\nlet session = URLSession(configuration: config)\n\nvar req = URLRequest(url: url)\nreq.httpMethod = \"POST\"\nreq.setValue(clientId, forHTTPHeaderField: \"Idempotency-Key\")  // safe retry\nlet task = session.dataTask(with: req) { data, response, error in\n    // retry transient errors with backoff; surface 4xx as terminal\n}\ntask.resume()"
      }
    ],
    "resources": [
      {
        "label": "Apple: URLSession",
        "url": "https://developer.apple.com/documentation/foundation/urlsession",
        "kind": "docs"
      },
      {
        "label": "Android: Optimize downloads for efficient network access",
        "url": "https://developer.android.com/training/efficient-downloads",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "rest-graphql-mobile",
    "phase": 5,
    "phaseName": "Networking on Mobile",
    "orderIndex": 3,
    "estimatedMins": 35,
    "prerequisites": [
      "mobile-request-lifecycle"
    ],
    "title": "REST vs GraphQL from the Client",
    "eli5": "Two ways to ask a server for data. With REST, the server decides what each request returns, so you sometimes get too much or have to ask several times. With GraphQL, you write a shopping list and get back exactly what you asked for in one trip. On a slow phone connection, asking once for exactly what you need really matters.",
    "analogy": "REST is a fixed-menu restaurant: each dish (endpoint) comes as the chef designed it, so you might order three dishes to assemble one meal, and some come with sides you won't eat. GraphQL is a build-your-own bowl: you list precisely the ingredients you want and get one bowl with exactly those — no more trips, no wasted food.",
    "explanation": "REST and GraphQL are two API styles the client consumes. REST exposes fixed endpoints that each return a server-defined shape; that's simple and cacheable, but from a mobile client it often causes over-fetching (getting fields you don't need) and under-fetching (needing several requests to assemble one screen). GraphQL exposes a single endpoint where the client sends a query describing exactly the fields it wants, so one round trip returns precisely the data for a screen — powerful on constrained networks where extra bytes and extra round trips are costly. The trade-off is caching: REST's per-URL responses are easy to cache at every layer, while GraphQL's single-endpoint POST queries need client-side normalized caching to get similar benefits.\n\nAndroid vs iOS: On Android, REST is typically consumed with Retrofit/OkHttp (with OkHttp's HTTP cache), and GraphQL with a client like Apollo that maintains a normalized in-memory/disk cache keyed by object ids. On iOS, REST goes through URLSession (leveraging URLCache), and GraphQL through Apollo iOS or URLSession with a normalized cache. On both, the platform's HTTP cache helps REST for free, whereas GraphQL requires a dedicated client cache to avoid re-fetching data you already have.",
    "technicalDeep": "The mobile pain REST creates is round trips and payload waste: a profile screen might need /user, /user/posts, and /user/followers — three sequential requests, each paying handshake/radio cost — and each may return more fields than the screen renders. GraphQL collapses that into one query returning a tailored tree, reducing both round trips and bytes, which directly improves latency and battery on cellular. But you lose HTTP-layer caching: GraphQL queries are usually POSTs to one URL, so intermediaries and URL-based caches can't help, and you must cache on the client by normalizing the response graph into an id-keyed store so overlapping queries share cached objects and mutations update every view. GraphQL also shifts risks: a client can request deeply nested/expensive queries, so servers add depth limits, complexity analysis, and persisted queries. REST counters over/under-fetching with sparse fieldsets, compound endpoints, or BFF (backend-for-frontend) layers that shape responses per client. The right lens for mobile is: minimize round trips and bytes for the actual screens, and make sure whatever you don't refetch is cached correctly.\n\nAndroid vs iOS: Apollo on both platforms gives you a normalized cache and cache policies (cache-first, network-only, cache-and-network) that map neatly onto stale-while-revalidate for mobile. REST clients lean on HTTP caching (ETag/Cache-Control) which the OS stacks honor automatically. Persisted GraphQL queries (sending a hash instead of the full query) reduce request size and can even be GET-cached, narrowing the caching gap on constrained networks.",
    "whatBreaks": "REST under-fetching forces sequential requests that stack up handshake and radio costs, making screens slow on cellular. REST over-fetching wastes bytes and battery downloading fields the UI ignores. Naive GraphQL usage loses HTTP caching, so without a normalized client cache you refetch the same objects repeatedly. Unbounded GraphQL queries let a client (or a bug) request enormous nested trees that time out or hammer the server. Mixing cache policies wrong shows stale data or defeats the cache. Chatty REST plus no client caching is the worst mobile combination: many round trips and no reuse.",
    "efficientWay": {
      "title": "Fetching screen data efficiently on mobile",
      "approaches": [
        {
          "name": "Request exactly what the screen needs in as few round trips as possible, backed by a normalized client cache (GraphQL, or REST + BFF/sparse fields)",
          "verdict": "best",
          "reason": "Minimizes round trips and bytes on cellular and reuses cached objects across screens — fast, cheap, and battery-friendly."
        },
        {
          "name": "Plain REST with well-designed compound endpoints and HTTP caching",
          "verdict": "ok",
          "reason": "Simple, leverages free HTTP caching, and fine when endpoints match screens well, but still risks over/under-fetching as UIs diverge."
        },
        {
          "name": "Chatty REST hitting many granular endpoints per screen with no client cache",
          "verdict": "weak",
          "reason": "Maximizes round trips and wasted bytes and refetches everything each visit — the slowest, most battery-hungry pattern on mobile."
        }
      ],
      "recommendation": "Optimize for the fewest round trips and least wasted data per screen: GraphQL with a normalized cache when payload shaping matters, or REST with compound/BFF endpoints, sparse fieldsets, and HTTP caching. Whichever you pick, cache on the client so revisiting a screen doesn't refetch what you already have."
    },
    "commonMistakes": [
      "Making several sequential REST calls to assemble one screen, stacking handshake and radio costs",
      "Over-fetching large REST payloads and rendering only a few fields, wasting bytes and battery",
      "Using GraphQL without a normalized client cache, so you lose the HTTP caching REST gave you for free",
      "Letting the client issue unbounded/deeply nested GraphQL queries with no depth or complexity limits"
    ],
    "seniorNotes": "The framing interviewers want is that REST vs GraphQL is a trade between caching simplicity and payload precision, and on mobile the deciding factors are round-trip count and bytes over metered links. GraphQL's superpower is one tailored round trip; its cost is that you must rebuild caching on the client via normalization. REST's superpower is that every layer caches responses by URL; its cost is over/under-fetching that grows as screens diverge from endpoints — often solved with a BFF that shapes responses per client. Persisted queries and cache-and-network policies narrow the gap. The senior move is choosing per product surface, not dogmatically: a data-dense, rapidly-evolving screen benefits from GraphQL; a simple, highly-cacheable content feed may be better on REST + CDN.",
    "interviewQuestions": [
      "What are over-fetching and under-fetching, and why do they hurt more on mobile?",
      "What caching advantage does REST have over GraphQL, and how do you get similar caching with GraphQL?",
      "How would you decide between REST and GraphQL for a mobile app's data layer?"
    ],
    "interviewAnswers": [
      "Over-fetching is when an endpoint returns more fields than the screen needs, wasting bytes; under-fetching is when one endpoint isn't enough so you make several requests to assemble a screen. Both hurt more on mobile because bytes cost metered data and battery, and each extra request pays the handshake and radio-wakeup cost on a high-latency link. So over-fetching burns data you throw away and under-fetching multiplies slow round trips — exactly the two things you want to minimize on cellular.",
      "REST responses are per-URL GETs, so every layer — the HTTP client, the OS cache, CDNs, proxies — can cache them by URL and revalidate cheaply with ETags. GraphQL usually POSTs queries to one endpoint, so URL-based caches can't help. To get similar benefits with GraphQL I use a client with a normalized cache that stores objects keyed by id so overlapping queries share cached data and mutations update all views, plus cache policies like cache-and-network; persisted queries can even restore GET-cacheability.",
      "I decide by the product surface. If screens are data-dense, vary a lot, or evolve quickly, GraphQL's one tailored round trip and precise fields win, and I pair it with a normalized cache. If the data maps cleanly to cacheable, mostly-static resources, REST plus HTTP/CDN caching is simpler and faster to serve. I weigh round-trip count and payload size on cellular, caching needs, team familiarity, and whether a backend-for-frontend could shape REST responses well enough to avoid GraphQL's added client complexity."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Round trips: REST vs GraphQL for one screen (pseudocode)",
        "code": "// REST: under-fetching -> 3 sequential round trips, some wasted fields\nuser      = GET /user/42            // returns 20 fields, screen uses 3\nposts     = GET /user/42/posts      // another handshake/radio cost\nfollowers = GET /user/42/followers  // and another\nrender(user, posts, followers)\n\n// GraphQL: one round trip, exactly the fields needed\nquery = '''\n  query Profile($id: ID!) {\n    user(id: $id) {\n      name avatarUrl                  # only what the screen renders\n      posts(first: 10) { id title }\n      followerCount\n    }\n  }\n'''\ndata = POST /graphql { query, variables: { id: 42 } }\nrender(data.user)\n\n// Client cache policy on mobile: show cached, refresh in background\napollo.watch(query, policy = 'cache-and-network')  // stale-while-revalidate"
      }
    ],
    "resources": [
      {
        "label": "Apple: URLSession",
        "url": "https://developer.apple.com/documentation/foundation/urlsession",
        "kind": "docs"
      },
      {
        "label": "Android: Optimize downloads for efficient network access",
        "url": "https://developer.android.com/training/efficient-downloads",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh: Android developer roadmap",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      }
    ]
  },
  {
    "id": "realtime-mobile",
    "phase": 5,
    "phaseName": "Networking on Mobile",
    "orderIndex": 4,
    "estimatedMins": 35,
    "prerequisites": [
      "mobile-request-lifecycle"
    ],
    "title": "Real-Time: WebSockets, SSE & Polling",
    "eli5": "Sometimes your app needs updates the instant they happen — a chat message, a live score. It can keep asking 'anything new?' over and over (polling), keep an open pipe the server pushes down (SSE), or hold a two-way phone line always open (WebSocket). Each choice trades off freshness against battery, because keeping a line open on a phone costs power.",
    "analogy": "Polling is texting 'any news?' every minute — annoying and wasteful. SSE is subscribing to a radio station that broadcasts to you when something happens. A WebSocket is an open phone call where both sides can talk anytime. The open call is the most responsive but keeps the line — and the battery — busy.",
    "explanation": "Real-time features need a way to get server updates promptly. Three patterns: polling (the client repeatedly asks for updates on a timer — simple but wasteful and laggy), Server-Sent Events (SSE) (a long-lived one-way stream where the server pushes text events to the client over HTTP), and WebSockets (a persistent, full-duplex connection where both sides send messages anytime). On mobile the extra dimension is cost: a persistent connection keeps the radio and CPU engaged and drains battery, and connections get dropped constantly as the network changes — so reconnection logic and choosing the lightest sufficient pattern matter as much as the feature itself.\n\nAndroid vs iOS: On Android, WebSockets are commonly used via OkHttp's WebSocket support, but for background push you typically hand off to FCM (Firebase Cloud Messaging) rather than holding a socket open, because the OS restricts background execution and kills long-lived connections to save battery. On iOS, URLSessionWebSocketTask provides native WebSocket support, but backgrounded apps can't keep sockets alive, so APNs (Apple Push Notification service) is the OS-blessed way to wake an app with new data. Both platforms strongly prefer OS push over app-held connections when the app isn't in the foreground.",
    "technicalDeep": "The patterns differ in direction, overhead, and freshness. Polling makes a full request each interval — short intervals waste radio wakeups and battery and still lag by up to the interval; long polling (hold the request open until data or timeout) improves freshness at the cost of a held connection. SSE is one-way server-to-client over a single long-lived HTTP response, auto-reconnects with a last-event-id for resumption, and is lighter than WebSockets when you only need downstream updates. WebSockets are full-duplex after an HTTP upgrade handshake, ideal for chat and collaboration where the client also sends frequently, but they carry connection-management burden. The mobile-critical realities: persistent connections don't survive backgrounding (the OS suspends the app and reclaims sockets), they drop on every network transition (WiFi to cellular, cell handoff), and they cost battery by keeping the radio warm — so you need robust reconnection with backoff, heartbeat/ping to detect dead connections, and, crucially, a switch to OS push (APNs/FCM) when the app isn't foregrounded. Message delivery guarantees and resumption (sequence numbers, last-event-id) matter because reconnects will drop or duplicate messages.\n\nAndroid vs iOS: Because both OSes suspend backgrounded apps and terminate their sockets, the correct architecture is foreground = live connection (WebSocket/SSE), background = push (FCM/APNs) that wakes the app or delivers the update. iOS is especially strict — a suspended app gets no socket time — so APNs is not optional for timely background delivery. Android's Doze and background limits push you the same direction with FCM. Both require reconnection with jittered backoff and a heartbeat to detect half-open connections the carrier silently dropped.",
    "whatBreaks": "Holding a WebSocket open in the background gets the connection killed by the OS and the app suspended, so updates silently stop — the fix is push notifications, not a longer timeout. Aggressive polling drains battery and data by waking the radio every interval. No reconnection logic means one network blip permanently breaks real-time until the app restarts. No heartbeat means half-open (silently dropped) connections look alive while delivering nothing. Reconnecting without resumption (last-event-id/sequence numbers) drops or duplicates messages across the gap. Every client reconnecting simultaneously after a server blip stampedes the server without jittered backoff.",
    "efficientWay": {
      "title": "Choosing a real-time transport on mobile",
      "approaches": [
        {
          "name": "Lightest sufficient transport in foreground (SSE for one-way, WebSocket for two-way) with reconnect+heartbeat+resumption, and OS push in background",
          "verdict": "best",
          "reason": "Fresh updates when visible, battery-safe when not, and resilient to the constant drops and backgrounding mobile imposes."
        },
        {
          "name": "Long polling with reasonable intervals and backoff",
          "verdict": "ok",
          "reason": "Simple, firewall-friendly, and works without persistent-connection infrastructure, but laggier and less efficient than push/streaming for high-frequency updates."
        },
        {
          "name": "A single always-open WebSocket kept alive in the foreground and background with tight polling as a fallback",
          "verdict": "weak",
          "reason": "The OS kills background sockets so updates stop anyway, and the connection plus tight polling drains battery fast."
        }
      ],
      "recommendation": "Match the transport to the direction and frequency: SSE for server-to-client streams, WebSockets for bidirectional, and polling only for low-frequency needs. Keep the live connection only in the foreground with reconnection, heartbeats, and resumption, and switch to APNs/FCM push for background delivery to protect the battery."
    },
    "commonMistakes": [
      "Trying to keep a WebSocket alive in the background instead of using APNs/FCM push",
      "Polling on a tight interval, waking the radio constantly and draining battery and data",
      "Omitting reconnection with backoff, so a single network transition permanently breaks real-time",
      "No heartbeat or resumption, so half-open connections stall and reconnects drop or duplicate messages"
    ],
    "seniorNotes": "The defining mobile constraint interviewers probe is that the OS owns your background lifecycle: a backgrounded app cannot hold a socket open, so the correct pattern is foreground streaming plus background push (APNs/FCM), not one heroic persistent connection. Pick the lightest transport that meets the need — SSE if updates are one-way, since it's simpler and lighter than WebSockets and resumes via last-event-id. Reconnection is not optional: assume connections drop on every network change, add jittered backoff to avoid reconnect stampedes, and use heartbeats to catch half-open connections the carrier dropped silently. Finally, design for at-least-once delivery with sequence numbers so a reconnect gap can be reconciled rather than losing or duplicating messages.",
    "interviewQuestions": [
      "Compare polling, SSE, and WebSockets — when would you choose each on mobile?",
      "Why can't you rely on a persistent WebSocket for real-time updates when the app is backgrounded?",
      "What do reconnection, heartbeats, and resumption each solve for a mobile real-time connection?"
    ],
    "interviewAnswers": [
      "Polling repeatedly asks the server on a timer — simplest and firewall-friendly but laggy and wasteful, good only for low-frequency updates. SSE is a one-way server-to-client stream over a long-lived HTTP response with automatic reconnection and event ids — ideal when only the server pushes, like live feeds or notifications, and lighter than WebSockets. WebSockets are full-duplex, best when the client also sends frequently, like chat or collaborative editing. On mobile I pick the lightest one that fits the direction and frequency, since persistent connections cost battery.",
      "Because the OS suspends backgrounded apps and reclaims their sockets to save battery — a backgrounded app gets little or no execution time, so a held WebSocket is torn down and updates silently stop. Keeping it alive fights the platform and drains the battery even if it worked. The correct approach is to use the OS push services, APNs on iOS and FCM on Android, which are allowed to wake the app or deliver the update in the background, and reserve the live socket for when the app is in the foreground.",
      "Reconnection handles the reality that mobile connections drop constantly on network transitions, so the app re-establishes the stream with jittered backoff instead of breaking permanently. Heartbeats (periodic pings) detect half-open connections that the carrier dropped silently but still look alive, so you can tear down and reconnect instead of waiting forever. Resumption — using a last-event-id or sequence numbers — lets the client tell the server where it left off so the gap during a reconnect is filled without losing or duplicating messages."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Foreground stream + background push + reconnect (pseudocode)",
        "code": "// Live connection ONLY while foregrounded\nonForeground():\n  connect()\nonBackground():\n  disconnect()          // OS would kill it anyway; rely on push instead\n  ensurePushRegistered()  // APNs (iOS) / FCM (Android) deliver in background\n\nconnect():\n  ws = openWebSocket(url, headers = { 'Last-Event-Id': lastSeq })  // resume\n  ws.onMessage(m => { lastSeq = m.seq; handle(m) })\n  ws.onClose(() => scheduleReconnect())\n  startHeartbeat(ws, every = 30s)   // detect half-open connections\n\nscheduleReconnect():\n  attempt += 1\n  delay = random(0, min(1s * 2^attempt, 60s))   // backoff + jitter\n  after(delay): if isForeground(): connect()\n\nstartHeartbeat(ws, every):\n  loop every:\n    ws.ping()\n    if not pongWithin(10s): ws.close()   // triggers reconnect"
      },
      {
        "lang": "swift",
        "label": "Native WebSocket in the foreground (iOS example)",
        "code": "// Foreground only; background delivery goes through APNs.\nlet task = URLSession.shared.webSocketTask(with: url)\ntask.resume()\n\nfunc receive() {\n    task.receive { result in\n        switch result {\n        case .success(let message):\n            handle(message)\n            self.receive()               // keep listening\n        case .failure:\n            self.scheduleReconnect()     // backoff + jitter, foreground only\n        }\n    }\n}\n// Heartbeat to catch half-open connections\ntask.sendPing { error in if error != nil { self.scheduleReconnect() } }"
      }
    ],
    "resources": [
      {
        "label": "Apple: URLSession",
        "url": "https://developer.apple.com/documentation/foundation/urlsession",
        "kind": "docs"
      },
      {
        "label": "Android: Optimize downloads for efficient network access",
        "url": "https://developer.android.com/training/efficient-downloads",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "pagination-mobile",
    "phase": 5,
    "phaseName": "Networking on Mobile",
    "orderIndex": 5,
    "estimatedMins": 30,
    "prerequisites": [
      "mobile-request-lifecycle"
    ],
    "title": "Pagination & Infinite Scroll",
    "eli5": "A feed might have millions of items, but your phone can't download them all. So the app grabs a small batch, and when you scroll near the bottom it quietly fetches the next batch. Doing that smoothly — without freezing or showing blank gaps — is the art of pagination.",
    "analogy": "It's like a waiter bringing food a few plates at a time instead of dumping the entire buffet on your table. A good waiter (prefetch) sees you're almost done and brings the next plates before you ask, and puts down empty plate-shaped placeholders so the table doesn't look bare while the kitchen works.",
    "explanation": "Pagination means fetching a long list in chunks (pages) instead of all at once, which is essential on mobile where memory and bandwidth are limited. Infinite scroll is the common UX: as the user nears the end of the loaded items, the app fetches the next page and appends it. There are two ways to ask for the next page. Offset-based (give me items 20-40) is simple but breaks when the list changes underneath you. Cursor-based (give me items after this id/token) is stable against inserts and deletes and is preferred for feeds. Good pagination also prefetches the next page before the user hits the bottom and shows placeholder/skeleton states so scrolling feels continuous rather than stuttering.\n\nAndroid vs iOS: On Android, the Paging library (Paging 3) handles page loading, prefetch distance, in-memory caching, and placeholder/loading states, and integrates with RecyclerView/Compose lists; it supports a RemoteMediator for network+DB paging. On iOS, you typically implement paging against UICollectionView/UITableView prefetching APIs or SwiftUI list onAppear triggers, tracking a cursor and appending pages. Both platforms provide list-prefetch hooks so you can start the next fetch before the user reaches the end.",
    "technicalDeep": "Offset pagination uses LIMIT/OFFSET semantics: it's easy and allows jumping to arbitrary pages, but it has two flaws on live data — items shifting (a new item at the top makes page 2 repeat an item from page 1, or skip one) and increasing cost, since the database must scan and discard OFFSET rows, getting slower deep into the list. Cursor (keyset) pagination instead says 'items where sort_key < last_seen_key', which is stable under inserts/deletes and stays fast at any depth because it seeks directly via an index — the trade-off is you can only go forward/backward sequentially, not jump to page N. For UX, prefetching means triggering the next-page load when the user is within a threshold (say a few screens) of the end, so data arrives before it's needed; the prefetch distance is tuned against scroll speed and network latency. Placeholder/skeleton states reserve layout space and signal loading so the list doesn't jump or flash blank, and stable item keys prevent the list from re-rendering or scrolling to the wrong spot when a page appends. Deduplication matters because overlapping pages (from concurrent inserts) can deliver the same item twice.\n\nAndroid vs iOS: Paging 3 encapsulates cursor/offset loading, configurable prefetchDistance, placeholders, and de-dup via item keys, and can layer a DB cache so scroll position survives config changes. On iOS, UICollectionViewDataSourcePrefetching / prefetchItemsAt and SwiftUI onAppear on the trailing items are the trigger points, and diffable data sources with stable identifiers keep appends smooth. Both benefit from cursor pagination for feeds to avoid the shifting-item duplicates that offset causes on live data.",
    "whatBreaks": "Offset pagination on a live feed duplicates or skips items when the list changes between page loads. Deep offset pagination gets progressively slower as the database scans and discards more rows. Fetching only when the user hits the very bottom causes a visible stall and spinner instead of smooth scroll. No placeholders makes the list flash blank or jump as pages load. Unstable item keys make the list re-render or jump the scroll position when appending. No dedup shows the same item twice across overlapping pages. Loading huge pages defeats the memory/bandwidth savings pagination was meant to provide.",
    "efficientWay": {
      "title": "Paging a long list smoothly",
      "approaches": [
        {
          "name": "Cursor-based pagination with prefetch ahead of the viewport, placeholders, and stable keys",
          "verdict": "best",
          "reason": "Stable against live changes, fast at any depth, and scrolls continuously without stalls, blank flashes, or duplicates."
        },
        {
          "name": "Offset-based pagination with prefetch and placeholders",
          "verdict": "ok",
          "reason": "Simple and supports jumping to arbitrary pages, but duplicates/skips items on live feeds and slows down deep into the list."
        },
        {
          "name": "Load-more only when the user reaches the very bottom, no placeholders",
          "verdict": "weak",
          "reason": "Every page boundary stalls with a spinner and the list flashes blank — choppy, especially on high-latency mobile networks."
        }
      ],
      "recommendation": "Use cursor-based pagination for feeds and changing lists, trigger the next fetch a few screens before the end so it arrives in time, render skeleton placeholders during load, and give items stable keys to keep scroll position and de-duplicate overlapping pages. Reserve offset pagination for small, static, jump-to-page lists."
    },
    "commonMistakes": [
      "Using offset pagination on a live feed, causing duplicated or skipped items as the list shifts",
      "Only fetching when the user hits the absolute bottom, producing a visible stall each page",
      "Rendering no placeholders so the list flashes blank or jumps while the next page loads",
      "Using unstable item keys so appending a page re-renders the list or moves the scroll position"
    ],
    "seniorNotes": "The core correctness point is that offset pagination is unstable on live data — new inserts shift the window and produce duplicates or gaps — so feeds should use cursor/keyset pagination, which is both stable and index-fast at any depth. The core UX point is that pagination should be invisible: prefetch ahead of the viewport so data is ready before the user arrives, and use placeholders with reserved layout so nothing flashes or jumps. Stable item identity is what keeps a diffable list from thrashing on append and what enables correct de-duplication. Tie it to the offline-first layer when you can: page into a local DB and let the UI read from the DB, so scroll position and loaded pages survive process death and work offline. Tune prefetch distance against real network latency, not a guess.",
    "interviewQuestions": [
      "What's the difference between offset and cursor pagination, and why is cursor preferred for feeds?",
      "How do you make infinite scroll feel smooth rather than stalling at each page boundary?",
      "Why does deep offset pagination get slow, and what problems do stable item keys solve?"
    ],
    "interviewAnswers": [
      "Offset pagination asks for a numeric range like items 40-60 using LIMIT/OFFSET; cursor pagination asks for items after a specific key or id. Cursor is preferred for feeds because it's stable when the list changes: if a new item is inserted at the top, offset paging shifts the window and repeats or skips an item, whereas a cursor anchored to the last-seen item keeps returning the correct next items. Cursor paging also stays fast at any depth because it seeks via an index instead of scanning and discarding rows.",
      "I prefetch the next page before the user reaches the end — triggering the load when they're within a few screens of the bottom — so the data arrives in time and scrolling never stalls. I render skeleton placeholders with reserved layout during loading so the list doesn't flash blank or jump. I use stable item keys so appending a page doesn't re-render everything or move the scroll position, and I de-duplicate overlapping items. Ideally I page into a local DB and read from it so scroll state survives and works offline.",
      "Deep offset pagination is slow because the database must scan past and discard all the OFFSET rows before returning the page, so the cost grows the further you scroll. Stable item keys solve list churn: with a consistent identity per item, the UI's diffing appends only the new page instead of re-rendering the whole list, keeps the scroll position anchored, and lets me detect and drop duplicate items that overlapping pages might deliver. Without stable keys, appends cause visible jumps and wasted re-renders."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Cursor pagination with prefetch (pseudocode)",
        "code": "state = { items: [], nextCursor: null, loading: false, end: false }\n\n// Ask for the page AFTER the last item -> stable under inserts/deletes\nasync loadNextPage():\n  if state.loading or state.end: return\n  state.loading = true\n  page = api.feed(after = state.nextCursor, limit = 20)\n  // stable keys let us de-dup overlapping items and keep scroll position\n  merged = dedupById(state.items + page.items)\n  state.items = merged\n  state.nextCursor = page.nextCursor\n  state.end = page.nextCursor == null\n  state.loading = false\n\n// Prefetch: trigger before the user hits the bottom, not at it\nonItemVisible(index):\n  if index >= state.items.length - PREFETCH_DISTANCE:  // e.g. 8 items early\n    loadNextPage()\n\n// While loading, render skeleton placeholders with reserved layout\nrender():\n  showItems(state.items)\n  if state.loading: showSkeletonRows(3)"
      },
      {
        "lang": "kotlin",
        "label": "PagingSource with a cursor key (Android example)",
        "code": "class FeedPagingSource(private val api: FeedApi) : PagingSource<String, Post>() {\n    override suspend fun load(params: LoadParams<String>): LoadResult<String, Post> {\n        return try {\n            val cursor = params.key                       // null on first load\n            val page = api.feed(after = cursor, limit = params.loadSize)\n            LoadResult.Page(\n                data = page.items,\n                prevKey = null,                           // forward-only feed\n                nextKey = page.nextCursor                 // stable cursor\n            )\n        } catch (e: IOException) {\n            LoadResult.Error(e)                           // Paging retries\n        }\n    }\n    override fun getRefreshKey(state: PagingState<String, Post>) = null\n}\n// Pager config sets prefetchDistance + placeholders for smooth scroll."
      }
    ],
    "resources": [
      {
        "label": "Android: Optimize downloads for efficient network access",
        "url": "https://developer.android.com/training/efficient-downloads",
        "kind": "docs"
      },
      {
        "label": "Apple: URLSession",
        "url": "https://developer.apple.com/documentation/foundation/urlsession",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh: Android developer roadmap",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      }
    ]
  },
  {
    "id": "image-loading-caching",
    "phase": 5,
    "phaseName": "Networking on Mobile",
    "orderIndex": 6,
    "estimatedMins": 35,
    "prerequisites": [
      "mobile-request-lifecycle",
      "pagination-mobile"
    ],
    "title": "Image Loading & Caching Pipelines",
    "eli5": "Photos are big and phones are small. If your app loads full-size images straight into a scrolling list, it stutters and runs out of memory. A good image pipeline shrinks each picture to the size actually shown, does the heavy work off the main thread, remembers images it already loaded, and shows a soft placeholder while a photo arrives.",
    "analogy": "It's like a photo lab. You don't hang the giant negative on the wall — the lab prints it at the exact frame size (downsampling), works in the back room so the front desk stays open (off-main-thread decode), keeps recent prints in a drawer so reprints are instant (cache), and puts a blurry proof in the frame until the real print is ready (blur-up placeholder).",
    "explanation": "Images are the heaviest thing most apps load, and mishandling them is the top cause of jank and out-of-memory crashes on mobile. A proper image pipeline does several things: it decodes images off the main thread (turning compressed JPEG/PNG bytes into a bitmap is CPU-heavy and must not block the UI thread), downsamples them to the display size (a 4000x3000 photo shown in a 200x200 thumbnail should be decoded at ~200x200, not full size — otherwise it wastes enormous memory), caches at two tiers (a memory cache of ready-to-draw bitmaps and a disk cache of downloaded bytes), and shows a placeholder or blur-up (a tiny blurred preview that sharpens when the full image loads) so the UI never sits blank. In practice you use a dedicated image-loading library rather than hand-rolling this.\n\nAndroid vs iOS: On Android, libraries like Coil or Glide handle async decode, downsampling to the target ImageView/Composable size, memory+disk caching, and placeholders/crossfade; they also cancel requests when a list item is recycled. On iOS, libraries like Kingfisher or SDWebImage (or Nuke) do the same over URLSession, and SwiftUI's AsyncImage covers simple cases; downsampling is done via ImageIO thumbnail generation. Both platforms make off-main-thread decode and size-appropriate bitmaps the central concern.",
    "technicalDeep": "The memory math is the crux: a decoded bitmap costs width x height x 4 bytes (ARGB_8888), independent of the compressed file size — so a 12-megapixel photo is ~48MB decoded regardless of being a 2MB JPEG. Loading a handful of those into a list blows past the per-app memory limit and triggers an OOM kill. Downsampling (decoding at a sample size / generating a thumbnail sized to the target view) is therefore non-negotiable, and it must use the actual display dimensions, not the source dimensions. Decoding is CPU-bound and off-main-thread by necessity; doing it on the UI thread drops frames. Caching is tiered and semantically different at each level: the memory cache holds decoded bitmaps keyed by URL+target-size (an LRU bounded by memory, cleared on pressure), while the disk cache holds the original compressed bytes (so you avoid the network re-download but still re-decode/resize). Placeholders reserve layout to prevent scroll jumps; blur-up (progressive: load a tiny blurred version first, then the full) improves perceived performance. In lists, request cancellation on recycle is critical — otherwise a fast scroll fires and completes dozens of decodes for cells no longer visible, wasting CPU and showing wrong images.\n\nAndroid vs iOS: Android's decoded bitmaps live in the app heap (or ashmem via the library), so memory-cache sizing against available heap and clearing on onTrimMemory is vital; Coil/Glide key the memory cache by size and cancel on view recycle. iOS decodes via ImageIO/Core Graphics; NSCache-backed memory caches auto-evict under pressure, and forced decoding (drawing into a context) moves the decode off the main thread so scrolling stays smooth. Both must key the memory cache by target size so a thumbnail and a full-screen render of the same URL don't collide.",
    "whatBreaks": "Decoding full-resolution images into small views exhausts memory and triggers OOM crashes, because decoded size depends on pixels not file size. Decoding on the main thread drops frames and stutters scrolling. No memory cache re-decodes the same image repeatedly; no disk cache re-downloads it, wasting data and battery. Not cancelling requests on list recycle floods the CPU during fast scroll and flashes wrong images into reused cells. No placeholder makes lists flash blank and jump. Caching by URL alone (ignoring target size) either wastes memory storing full-size bitmaps or serves a thumbnail where a full image is needed. Unbounded caches get the app killed under memory pressure.",
    "efficientWay": {
      "title": "Loading images in a scrolling UI",
      "approaches": [
        {
          "name": "Dedicated image library: off-main-thread decode, downsample to view size, tiered memory+disk cache, placeholders, and cancel-on-recycle",
          "verdict": "best",
          "reason": "Smooth scrolling, minimal memory, no redundant network/decoding, and no wrong-image flashes — the proven production approach."
        },
        {
          "name": "Manual async loading with basic downsampling and a simple cache",
          "verdict": "ok",
          "reason": "Workable for a few images and educational, but easy to get memory sizing, cancellation, and cache keys subtly wrong at list scale."
        },
        {
          "name": "Load full-resolution images synchronously on the main thread with no cache",
          "verdict": "weak",
          "reason": "Freezes the UI, blows the memory budget into OOM crashes, and re-downloads and re-decodes constantly — worst on every axis."
        }
      ],
      "recommendation": "Use a proven image-loading library and let it decode off the main thread, downsample to the actual display size, cache decoded bitmaps in a bounded memory tier plus original bytes on disk, show placeholders/blur-up, and cancel in-flight requests when list cells recycle. Key the memory cache by URL plus target size."
    },
    "commonMistakes": [
      "Decoding full-resolution images into small views, exhausting memory and causing OOM crashes",
      "Decoding on the main thread, dropping frames and stuttering scroll",
      "Not cancelling image requests when list items recycle, flooding the CPU and flashing wrong images",
      "Skipping placeholders or caching by URL only (ignoring target size), causing blank flashes or wasted memory"
    ],
    "seniorNotes": "The number that unlocks this topic is that decoded bitmap memory is width x height x 4, independent of the compressed file size — so downsampling to the display size is the single highest-leverage optimization and the reason full-res thumbnails cause OOMs. Off-main-thread decode is the second pillar; the two together are why you always reach for a dedicated library rather than the naive image-view assignment. In lists, request cancellation on recycle and cache keys that include the target size separate a smooth feed from a janky, wrong-image mess. Wire cache eviction to memory-pressure callbacks, since a large decoded-bitmap cache is often what tips the app over its memory limit. And prefer progressive/blur-up loading for perceived speed on slow connections — users forgive a blurry-then-sharp image far more than a long blank gap.",
    "interviewQuestions": [
      "Why does a 2MB JPEG cause memory problems, and how does downsampling fix it?",
      "Why must image decoding happen off the main thread, and what caching tiers does an image pipeline use?",
      "Why is cancelling image requests important in a scrolling list, and what do placeholders/blur-up solve?"
    ],
    "interviewAnswers": [
      "The 2MB is the compressed size on disk, but once decoded into a bitmap it costs width times height times 4 bytes in memory — a 12-megapixel image is roughly 48MB decoded regardless of the file size. Loading several of those into a list blows past the per-app memory limit and triggers an out-of-memory crash. Downsampling fixes it by decoding the image at the target display size — a 200x200 thumbnail is decoded at about 200x200, using a tiny fraction of the memory — so the bitmap matches what's actually shown, not the source resolution.",
      "Decoding turns compressed bytes into a raw bitmap, which is CPU-intensive; doing it on the main thread blocks rendering and drops frames, causing visible stutter while scrolling. So decode runs on a background thread and the finished bitmap is handed to the UI. The pipeline caches at two tiers: a memory cache of ready-to-draw decoded bitmaps keyed by URL plus target size and bounded by an LRU, and a disk cache of the original compressed bytes so you avoid re-downloading over the network even after the memory cache evicts.",
      "In a fast-scrolling list, cells are recycled quickly; if you don't cancel the in-flight request for a cell that scrolled away, you waste CPU decoding images no longer visible and risk the completed image flashing into a reused cell showing the wrong picture. Cancelling on recycle keeps CPU focused on visible cells and prevents wrong-image flashes. Placeholders reserve layout and show a neutral state so the list doesn't flash blank or jump, and blur-up shows a tiny blurred preview that sharpens when the full image arrives, improving perceived speed on slow networks."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Image pipeline with downsample, cache tiers, cancel (pseudocode)",
        "code": "memCache  = LruBitmapCache(maxBytes = fractionOfHeap())   // decoded bitmaps\ndiskCache = ByteCache(maxBytes = 200_MB)                  // original bytes\n\nasync loadImage(url, targetW, targetH, into view):\n  cancelPrevious(view)                    // cancel on recycle -> no wrong image\n  key = url + '@' + targetW + 'x' + targetH  // key includes TARGET size\n\n  bmp = memCache.get(key)\n  if bmp: return view.set(bmp)            // hot path, instant\n\n  view.set(placeholder())                 // reserve layout, blur-up preview\n  runOffMainThread(view.requestId, () => {\n    bytes = diskCache.get(url) or network.get(url)   // avoid re-download\n    diskCache.put(url, bytes)\n    // DOWNSAMPLE: decode at target size, not source size\n    bmp = decode(bytes, sampleTo = (targetW, targetH))   // off main thread\n    memCache.put(key, bmp)\n    onMainThread(() => if stillBound(view): view.crossfadeTo(bmp))\n  })\n\nonMemoryPressure(): memCache.clear()"
      }
    ],
    "resources": [
      {
        "label": "Android: Optimize downloads for efficient network access",
        "url": "https://developer.android.com/training/efficient-downloads",
        "kind": "docs"
      },
      {
        "label": "Android: Data and file storage overview",
        "url": "https://developer.android.com/training/data-storage",
        "kind": "docs"
      },
      {
        "label": "Apple: URLSession",
        "url": "https://developer.apple.com/documentation/foundation/urlsession",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "tls-cert-pinning",
    "phase": 5,
    "phaseName": "Networking on Mobile",
    "orderIndex": 7,
    "estimatedMins": 35,
    "prerequisites": [
      "mobile-request-lifecycle"
    ],
    "title": "TLS & Certificate Pinning",
    "eli5": "When your app talks to its server, it checks the server's ID card (certificate) to be sure it's really talking to the right server and not an impostor. Certificate pinning is your app carrying a photo of exactly which ID it expects, so even a forged-but-official-looking ID gets rejected. This matters most on sketchy public WiFi where someone might try to eavesdrop.",
    "analogy": "TLS is showing a passport at a border — any passport from a trusted country is accepted. Pinning is a bouncer with a photo of the one specific person allowed in: a perfectly valid passport for someone else won't get them through. Great security, but if that one person changes their appearance (rotates their certificate) and you forgot to update the photo, you lock out the right person too.",
    "explanation": "TLS is the encryption layer that secures HTTPS: during the handshake the server presents a certificate, and the client verifies it chains up to a trusted Certificate Authority (CA), proving the server's identity and setting up encryption. That normally protects you — but the trust rests on the whole set of CAs the device trusts, and a compromised or malicious CA (or a device with an attacker-installed root) could issue a fraudulent certificate for your domain, enabling a man-in-the-middle (MITM) attack. Certificate pinning hardens this: the app ships with a copy (a pin) of the expected certificate or, better, its public key, and rejects any connection whose certificate doesn't match — so even a technically-valid certificate from a different key is refused. The catch is rotation: certificates expire and get replaced, and if the app's pin doesn't include the new key, the app can't connect until updated.\n\nAndroid vs iOS: On Android, pinning is typically configured declaratively via the Network Security Configuration (pin sets with backup pins and expiration) or programmatically with OkHttp's CertificatePinner. On iOS, you use App Transport Security plus URLSession's authentication-challenge delegate to compare the server's public key/certificate against pinned values, or a library that wraps it. Both platforms recommend pinning the public key (Subject Public Key Info) rather than the full certificate, and always shipping backup pins for the next key.",
    "technicalDeep": "Standard TLS validation checks the certificate chain, hostname, and expiry against the device trust store. Its weakness is trust-store breadth: hundreds of CAs are trusted, and any of them (or a user/enterprise-installed root, or malware) could mint a valid-looking cert for your host, letting a proxy transparently intercept traffic — exactly what happens on hostile WiFi with an MITM proxy. Pinning narrows trust from 'any trusted CA' to 'this specific key,' so an attacker also needs your private key, which they don't have. Best practice is to pin the SPKI (public key) hash, not the leaf certificate: keys can be reused across certificate renewals, so key-pinning survives routine cert rotation that cert-pinning would break. The operational hazard is bricking: a hard pin with no matching backup means that when the server rotates to a new key the app rejects all connections and can only be fixed by an app update — which users may not install for weeks, and which you can't force. Mitigations: always ship at least one backup pin (the next key you'll rotate to), set pin expiration so pins fail open after a date rather than bricking forever, monitor pin failures, and have a kill-switch/remote-config path. Pinning also does not defend against a compromised endpoint or a malicious app-side actor — it specifically defends the transport against MITM.\n\nAndroid vs iOS: Android's Network Security Config lets you declare multiple pins and an expiration date, and it fails open after expiration to avoid permanent bricking; OkHttp's CertificatePinner does programmatic key-pinning. iOS's URLSessionDelegate urlSession(_:didReceive:) challenge handler is where you extract the server public key and compare against pinned hashes, calling the completion handler to accept or cancel. Both strongly advise SPKI pinning plus backup pins; both can brick the app if you pin a single leaf cert with no backup and then rotate.",
    "whatBreaks": "Pinning a single leaf certificate with no backup pin bricks every install the moment the server rotates its certificate, and only an app update fixes it — users on old versions are locked out. Pinning without an expiration means an outdated pin fails closed forever. Forgetting to update backup pins before a planned rotation causes an outage. Over-relying on pinning as total security ignores that it only protects the transport, not a compromised server or client. Skipping pinning entirely leaves users on hostile/public WiFi exposed to MITM via a rogue or compromised CA. Pinning to a CA that itself rotates can also break unexpectedly.",
    "efficientWay": {
      "title": "Hardening transport against MITM safely",
      "approaches": [
        {
          "name": "Pin the public key (SPKI) with backup pins and an expiration, plus monitoring and a remote kill-switch",
          "verdict": "best",
          "reason": "Blocks MITM even from a rogue CA while surviving routine cert rotation and avoiding permanent bricking if something goes wrong."
        },
        {
          "name": "Standard TLS validation with strong config and no pinning",
          "verdict": "ok",
          "reason": "Secure against typical attackers and zero rotation risk, but offers no defense if a trusted CA is compromised or a rogue root is installed."
        },
        {
          "name": "Pin a single leaf certificate with no backup pin or expiration",
          "verdict": "weak",
          "reason": "One certificate rotation bricks every install until users update, turning a security feature into a self-inflicted outage."
        }
      ],
      "recommendation": "For apps handling sensitive data on untrusted networks, pin the server's public key (SPKI) and always ship at least one backup pin for the next key, set a pin expiration so it fails open rather than bricking, monitor pin-validation failures in the field, and keep a remote config/kill-switch to disable pinning in an emergency."
    },
    "commonMistakes": [
      "Pinning a single leaf certificate with no backup pin, bricking the app when the cert rotates",
      "Pinning without an expiration, so an outdated pin fails closed forever with no recovery path",
      "Forgetting to add the new key's backup pin before a planned certificate rotation",
      "Treating pinning as complete security while ignoring that it only protects the transport layer"
    ],
    "seniorNotes": "The senior framing is a risk trade: pinning meaningfully reduces MITM risk from a compromised or coerced CA, but it introduces availability risk — a rotation mistake bricks the fleet with no server-side fix, only a client update you can't force. Manage that by pinning the public key (SPKI), not the leaf cert, so ordinary renewals don't break you; always carry a backup pin for the incoming key; set an expiration so pins fail open rather than locking users out indefinitely; and keep telemetry on pin failures plus a remote kill-switch. Be clear about the threat model in interviews: pinning defends the transport against network-position attackers, not a breached server, a malicious insider, or a rooted device where the attacker can also patch your app. For most apps, decide whether the marginal MITM protection justifies the operational burden — high-value/regulated apps yes, low-risk content apps often not.",
    "interviewQuestions": [
      "What attack does certificate pinning defend against that standard TLS validation does not?",
      "Why pin the public key instead of the certificate, and why are backup pins essential?",
      "What's the main operational risk of pinning and how do you avoid bricking your app?"
    ],
    "interviewAnswers": [
      "Standard TLS trusts any certificate that chains to one of the hundreds of CAs in the device trust store, so if a CA is compromised or coerced — or an attacker installs a rogue root on the device — they can mint a valid-looking certificate for your domain and run a man-in-the-middle, transparently decrypting traffic on hostile WiFi. Pinning defends against exactly that: the app only accepts the specific key it shipped, so a valid-but-different certificate is rejected. It narrows trust from 'any trusted CA' to 'our key,' which the attacker doesn't have.",
      "I pin the public key (the SPKI hash) because a server keeps the same key across routine certificate renewals — the cert gets a new expiry but the key is reused — so key-pinning survives normal rotation, whereas pinning the leaf certificate breaks every renewal. Backup pins are essential because certificates and keys do eventually rotate; shipping the next key's pin ahead of time means the app already trusts the new key when the server switches, avoiding an outage. Without a backup, a rotation locks out every install until an app update.",
      "The main risk is bricking: because the pin lives in the shipped app, a bad or outdated pin makes the app reject all connections and there's no server-side fix — only a client update, which you can't force and users may delay for weeks. I avoid it by pinning the public key rather than the leaf, always shipping a backup pin for the next key, setting a pin expiration so pins fail open after a date instead of locking out forever, monitoring pin-failure telemetry, and keeping a remote kill-switch to disable pinning in an emergency."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Public-key pinning with backup and expiry (pseudocode)",
        "code": "// Pin the PUBLIC KEY (SPKI hash), not the leaf certificate\npinnedKeys = [\n  'sha256/CURRENT_SERVER_KEY_HASH',   // key in use now\n  'sha256/BACKUP_NEXT_KEY_HASH'       // next key -> survives rotation\n]\npinExpiration = '2027-01-01'          // after this, fail OPEN not brick\n\nvalidate(serverChain):\n  standardTlsValidation(serverChain)  // chain, hostname, expiry first\n  if now() > pinExpiration:\n    return ALLOW                       // pins expired -> avoid bricking\n  serverKeyHash = sha256(spki(serverChain.leaf.publicKey))\n  if serverKeyHash in pinnedKeys:\n    return ALLOW\n  else:\n    reportPinFailure(serverKeyHash)    // telemetry + kill-switch check\n    return REJECT                      // blocks MITM cert from rogue CA"
      },
      {
        "lang": "swift",
        "label": "URLSession public-key pinning challenge (iOS example)",
        "code": "func urlSession(_ session: URLSession,\n                didReceive challenge: URLAuthenticationChallenge,\n                completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {\n    guard let trust = challenge.protectionSpace.serverTrust,\n          SecTrustEvaluateWithError(trust, nil),        // standard TLS first\n          let cert = SecTrustGetCertificateAtIndex(trust, 0),\n          let key = SecCertificateCopyKey(cert) else {\n        return completionHandler(.cancelAuthenticationChallenge, nil)\n    }\n    let serverPin = sha256(spki(key))\n    if pinnedKeys.contains(serverPin) {                 // includes backup pin\n        completionHandler(.useCredential, URLCredential(trust: trust))\n    } else {\n        reportPinFailure(serverPin)\n        completionHandler(.cancelAuthenticationChallenge, nil)  // block MITM\n    }\n}"
      }
    ],
    "resources": [
      {
        "label": "OWASP: Certificate and Public Key Pinning",
        "url": "https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning",
        "kind": "article"
      },
      {
        "label": "Apple: URLSession",
        "url": "https://developer.apple.com/documentation/foundation/urlsession",
        "kind": "docs"
      },
      {
        "label": "Android: Optimize downloads for efficient network access",
        "url": "https://developer.android.com/training/efficient-downloads",
        "kind": "docs"
      }
    ]
  }
]
