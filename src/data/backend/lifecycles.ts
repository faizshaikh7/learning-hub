import type { Lifecycle } from '@/types'

/** Backend engineering lifecycles every backend engineer must know cold. */
export const BACKEND_LIFECYCLES: Lifecycle[] = [
  {
    id: 'http-request-lifecycle',
    title: 'HTTP Request Lifecycle',
    subtitle: 'What really happens between the browser and your handler',
    icon: '🌐',
    flow: 'linear',
    overview:
      'The classic "what happens when you type a URL and hit Enter" — but from the backend engineer\'s seat. A request crosses DNS, TCP, TLS, load balancers, and middleware before your handler ever runs, and the response retraces that path. Knowing every hop is how you debug latency, timeouts, and mysterious 502s.',
    stages: [
      {
        name: 'DNS resolution',
        shortLabel: 'DNS',
        description: 'The hostname is resolved to an IP address via recursive DNS lookups.',
        durationHint: '~0-100ms',
        details: [
          'Resolver checks caches (browser → OS → recursive resolver) before hitting authoritative servers',
          'TTL controls how long records are cached — low TTL = faster failover, more lookups',
        ],
        gotchas: ['Stale DNS caches during a failover send traffic to a dead host until TTL expires'],
      },
      {
        name: 'TCP handshake',
        shortLabel: 'TCP',
        description: 'A connection is established with the three-way handshake (SYN, SYN-ACK, ACK).',
        durationHint: '1 RTT',
        details: [
          'Costs one round trip before any data flows',
          'Connection reuse (keep-alive) and pooling avoid repeating this per request',
        ],
      },
      {
        name: 'TLS handshake',
        shortLabel: 'TLS',
        description: 'For HTTPS, keys are negotiated and the server certificate is verified.',
        durationHint: '1-2 RTT',
        details: [
          'TLS 1.3 cuts this to one round trip; session resumption makes repeats nearly free',
          'Certificate validation failures surface here as connection errors',
        ],
      },
      {
        name: 'Load balancer / reverse proxy',
        shortLabel: 'LB',
        description: 'The request hits an LB/proxy that routes it to a healthy backend instance.',
        durationHint: 'ms',
        details: [
          'Terminates TLS, applies routing rules, does health checks, adds/forwards headers',
          'This is where a lot of 502/504s originate when the backend is slow or down',
        ],
        gotchas: ['Forgetting to forward X-Forwarded-For makes every client look like the proxy'],
      },
      {
        name: 'Middleware pipeline',
        shortLabel: 'middleware',
        description: 'The request flows through ordered middleware before reaching your handler.',
        durationHint: 'ms',
        details: [
          'Typical order: logging → CORS → auth → rate limit → body parse → route',
          'Order matters: authenticate before you do expensive work, rate-limit before auth for abuse',
          'Middleware can short-circuit (401, 429) without ever hitting the handler',
        ],
      },
      {
        name: 'Handler / business logic',
        shortLabel: 'handler',
        description: 'Your route handler runs: validate input, call services, touch the database.',
        durationHint: 'the real work',
        details: [
          'Validate and sanitize input first — never trust the client',
          'Most latency lives here: DB queries, downstream API calls, serialization',
          'Use connection pools and timeouts on every external call',
        ],
        gotchas: ['A missing timeout on a downstream call can hang the request (and a whole worker) indefinitely'],
      },
      {
        name: 'Response & teardown',
        shortLabel: 'response',
        description: 'The response is serialized and sent back through the same path to the client.',
        durationHint: 'ms',
        details: [
          'Set correct status codes, content-type, cache-control, and security headers',
          'The connection may stay open (keep-alive) for the next request',
          'Structured access logs here are your first debugging tool',
        ],
      },
    ],
    keyTakeaways: [
      'A request crosses DNS → TCP → TLS → LB → middleware before your code runs — each hop adds latency',
      'Connection reuse (keep-alive, pooling) eliminates repeated TCP/TLS handshakes',
      'Middleware order is a design decision: auth, rate limiting, and parsing must be sequenced deliberately',
      'Most real latency is in the handler — DB and downstream calls — so put timeouts on everything',
      'Access logs + correct status codes are how you debug the whole chain',
    ],
    interviewNotes: [
      'Walk me through everything that happens when a request reaches your API.',
      'Why does connection pooling matter and what does it save?',
      'In what order should logging, auth, and rate limiting middleware run, and why?',
      'What commonly causes a 502 vs a 504?',
      'Why must every downstream call have a timeout?',
    ],
    relatedTopics: ['how-internet-works', 'http-protocol', 'middlewares', 'reverse-proxy-nginx', 'connection-pooling'],
  },

  {
    id: 'cicd-deployment-lifecycle',
    title: 'CI/CD Deployment Lifecycle',
    subtitle: 'From git push to production, safely',
    icon: '🚀',
    flow: 'linear',
    overview:
      'Continuous Integration and Continuous Deployment turn a git push into a running production change through an automated pipeline. The goal is to make deployment boring: small, frequent, reversible changes with fast feedback. A strong pipeline is your biggest lever on both velocity and reliability.',
    stages: [
      {
        name: 'Commit & trigger',
        shortLabel: 'commit',
        description: 'A push or merged PR triggers the pipeline via a webhook.',
        durationHint: 'on push',
        details: [
          'Trunk-based development with short-lived branches keeps changes small',
          'The pipeline runs on the exact commit SHA for traceability',
        ],
      },
      {
        name: 'Build',
        shortLabel: 'build',
        description: 'Code is compiled and packaged into an immutable artifact (usually a container image).',
        durationHint: 'minutes',
        details: [
          'Build once, promote the SAME artifact through every environment',
          'Tag the image with the commit SHA so prod is traceable to source',
          'Cache dependencies to keep builds fast',
        ],
        gotchas: ['Rebuilding per environment means prod runs code that was never tested — always promote one artifact'],
      },
      {
        name: 'Test',
        shortLabel: 'test',
        description: 'Automated tests run: unit, integration, then linting and security scans.',
        durationHint: 'minutes',
        details: [
          'Fast unit tests first (fail early), then slower integration/e2e',
          'Include SAST/dependency scanning and secret detection',
          'A red pipeline blocks the deploy — this is the quality gate',
        ],
      },
      {
        name: 'Deploy to staging',
        shortLabel: 'staging',
        description: 'The artifact is deployed to a production-like environment for final checks.',
        durationHint: 'minutes',
        details: [
          'Run smoke tests and migrations against staging first',
          'Staging should mirror prod config as closely as possible',
        ],
      },
      {
        name: 'Release to production',
        shortLabel: 'release',
        description: 'The change reaches users via a progressive strategy that limits blast radius.',
        durationHint: 'gradual',
        details: [
          'Blue-green: switch traffic between two identical environments for instant rollback',
          'Canary: send 1% → 10% → 100% while watching metrics',
          'Feature flags decouple deploy (shipping code) from release (turning it on)',
        ],
        gotchas: ['Big-bang deploys to 100% at once turn a small bug into a full outage'],
      },
      {
        name: 'Verify & monitor',
        shortLabel: 'verify',
        description: 'Health checks and dashboards confirm the release is healthy.',
        durationHint: 'continuous',
        details: [
          'Watch error rate, latency, and saturation immediately after release',
          'Automated rollback on SLO breach beats waiting for a human',
        ],
      },
      {
        name: 'Rollback path',
        shortLabel: 'rollback',
        description: 'If metrics regress, revert to the previous artifact fast.',
        durationHint: 'seconds-minutes',
        details: [
          'Rollback = redeploy the last good image or flip the blue-green switch / feature flag',
          'Database migrations must be backward compatible so rollback is safe',
        ],
        gotchas: ['A non-backward-compatible migration makes rollback impossible — expand/contract instead'],
      },
    ],
    keyTakeaways: [
      'Build one immutable artifact and promote it unchanged through staging to prod',
      'The test stage is the quality gate — fast tests first, security scans included',
      'Release progressively (canary/blue-green) and separate deploy from release with feature flags',
      'Every release needs a fast, rehearsed rollback — and backward-compatible migrations to make it safe',
      'Small, frequent, reversible changes are safer than large infrequent ones',
    ],
    interviewNotes: [
      'Describe a CI/CD pipeline from commit to production.',
      'What is the difference between blue-green and canary deployments?',
      'Why separate "deploy" from "release," and how do feature flags help?',
      'How do you make a database migration safe to roll back?',
      'Why promote a single artifact instead of rebuilding per environment?',
    ],
    relatedTopics: ['deployment-basics', 'docker-kubernetes', 'twelve-factor-app', 'strangler-fig', 'observability-stack'],
  },

  {
    id: 'db-transaction-lifecycle',
    title: 'Database Transaction Lifecycle',
    subtitle: 'BEGIN, work, COMMIT — and what ACID guarantees',
    icon: '💾',
    flow: 'linear',
    overview:
      'A transaction groups multiple operations into a single all-or-nothing unit. ACID (Atomicity, Consistency, Isolation, Durability) is the contract the database makes. Understanding the transaction lifecycle — and isolation levels — is how you avoid lost updates, deadlocks, and corrupt data under concurrency.',
    stages: [
      {
        name: 'BEGIN',
        shortLabel: 'begin',
        description: 'A transaction starts; the database gives it a consistent snapshot to work against.',
        durationHint: 'start',
        details: [
          'Keep transactions short — long ones hold locks and bloat the database',
          'The isolation level chosen here decides what concurrent transactions can see',
        ],
        code: {
          lang: 'sql',
          label: 'a transaction',
          code: 'BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;  -- both apply, or neither does',
        },
      },
      {
        name: 'Read / write with locks',
        shortLabel: 'work',
        description: 'Statements execute, acquiring locks (or MVCC snapshots) to isolate concurrent work.',
        durationHint: 'the work',
        details: [
          'Atomicity: all statements succeed together or none do',
          'Isolation: concurrent transactions don\'t step on each other (per isolation level)',
          'MVCC lets readers not block writers by versioning rows',
        ],
        gotchas: [
          'Two transactions locking the same rows in opposite order → deadlock',
          'Holding locks while calling an external API keeps rows locked for seconds',
        ],
      },
      {
        name: 'Isolation level in effect',
        shortLabel: 'isolation',
        description: 'The chosen level determines which anomalies are possible.',
        durationHint: 'throughout',
        details: [
          'Read Committed: no dirty reads (default in Postgres)',
          'Repeatable Read: same rows read twice are identical; prevents non-repeatable reads',
          'Serializable: behaves as if transactions ran one at a time — strongest, most conflicts',
        ],
        gotchas: ['Higher isolation = fewer anomalies but more aborts/retries — pick per use case'],
      },
      {
        name: 'COMMIT',
        shortLabel: 'commit',
        description: 'Changes are made permanent and durably written; locks are released.',
        durationHint: 'end',
        details: [
          'Durability: once committed, the change survives a crash (WAL/redo log flushed to disk)',
          'Other transactions can now see the committed data',
        ],
      },
      {
        name: 'ROLLBACK (on error)',
        shortLabel: 'rollback',
        description: 'Any failure undoes every change in the transaction, restoring the prior state.',
        durationHint: 'on failure',
        details: [
          'Atomicity guarantees partial work never persists',
          'Wrap multi-step business operations so a mid-way failure can\'t leave inconsistent data',
        ],
      },
    ],
    keyTakeaways: [
      'A transaction is all-or-nothing: COMMIT applies everything, ROLLBACK undoes everything',
      'ACID = Atomicity, Consistency, Isolation, Durability — the database\'s core contract',
      'Isolation level is a tradeoff: stronger levels prevent more anomalies but cause more retries',
      'Keep transactions short and never do I/O (API calls) while holding locks',
      'Deadlocks come from inconsistent lock ordering — acquire locks in a consistent order',
    ],
    interviewNotes: [
      'Explain ACID with a concrete example.',
      'What is the difference between Read Committed, Repeatable Read, and Serializable?',
      'What causes a deadlock and how do you prevent it?',
      'Why should transactions be short?',
      'What is MVCC and how does it help concurrency?',
    ],
    relatedTopics: ['database-transactions', 'sql-deep-dive', 'connection-pooling', 'database-design'],
  },

  {
    id: 'incident-response-lifecycle',
    title: 'Incident Response Lifecycle',
    subtitle: 'Detect → mitigate → resolve → learn',
    icon: '🚨',
    flow: 'cyclic',
    overview:
      'When production breaks, a calm, repeatable process beats heroics. The incident lifecycle takes you from detection to a blameless postmortem whose action items make the next incident less likely. Senior engineers are measured as much by how they handle incidents as by the code they write.',
    stages: [
      {
        name: 'Detect',
        shortLabel: 'detect',
        description: 'Monitoring/alerting (or a user report) surfaces that something is wrong.',
        durationHint: 'MTTD',
        details: [
          'Alert on symptoms users feel (error rate, latency, availability), not just CPU',
          'Good alerts are actionable — page on things a human must act on now',
        ],
        gotchas: ['Alert fatigue from noisy alerts means the real one gets ignored'],
      },
      {
        name: 'Triage & declare',
        shortLabel: 'triage',
        description: 'Assess severity, declare an incident, and assign an incident commander.',
        durationHint: 'minutes',
        details: [
          'Severity drives response: SEV1 (full outage) pages everyone; low sev can wait',
          'One incident commander coordinates; others execute — avoid everyone debugging blindly',
          'Open a dedicated channel and a running timeline',
        ],
      },
      {
        name: 'Mitigate (stop the bleeding)',
        shortLabel: 'mitigate',
        description: 'Restore service FAST — rollback, feature-flag off, scale up, or fail over.',
        durationHint: 'MTTR priority',
        details: [
          'Mitigation ≠ root cause fix — restore users first, understand later',
          'Rollback the recent deploy is the most common and fastest mitigation',
          'Communicate status to stakeholders on a regular cadence',
        ],
        gotchas: ['Chasing root cause while users are down wastes the minutes that matter most'],
      },
      {
        name: 'Resolve',
        shortLabel: 'resolve',
        description: 'Confirm service is fully healthy and the fix is stable.',
        durationHint: 'until green',
        details: [
          'Verify with the same dashboards that detected the issue',
          'Close the incident only when metrics are back to baseline',
        ],
      },
      {
        name: 'Postmortem (learn)',
        shortLabel: 'postmortem',
        description: 'Write a blameless postmortem with timeline, root cause, and action items.',
        durationHint: 'within days',
        details: [
          'Blameless: focus on systems and gaps, not individuals',
          'Every action item has an owner and a due date — and actually gets done',
          'Ask "why" repeatedly (5 Whys) to reach the systemic cause',
        ],
        gotchas: ['A postmortem with no tracked action items guarantees the same incident returns'],
      },
    ],
    keyTakeaways: [
      'Mitigate before you diagnose — restore service first, find root cause after',
      'One incident commander coordinates; a clear severity drives the response',
      'Rollback is usually the fastest mitigation, which is why fast rollback is a feature',
      'Blameless postmortems with owned, tracked action items are how the system actually improves',
      'Optimize for MTTD (detect) and MTTR (recover), not for never failing',
    ],
    interviewNotes: [
      'Walk me through how you handle a production outage.',
      'What is the difference between mitigation and resolution?',
      'What makes a postmortem "blameless" and why does it matter?',
      'What is an incident commander\'s role?',
      'How do you avoid alert fatigue?',
    ],
    relatedTopics: ['incident-management', 'observability-stack', 'chaos-engineering', 'distributed-tracing'],
  },
]
