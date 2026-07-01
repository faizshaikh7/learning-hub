import type { ConceptMap } from '@/types'

/** How the big ideas of backend engineering connect. */
export const BACKEND_CONCEPT_MAP: ConceptMap = {
  title: 'Backend Concept Map',
  intro:
    'Backend engineering is a web of connected ideas: a request travels the network, hits your app, touches data, and must stay fast, secure, and observable under load. Tap any concept to see how it links to the rest.',
  clusters: [
    {
      id: 'networking',
      name: 'Network & Protocols',
      concepts: [
        { id: 'http', label: 'HTTP', summary: 'The request/response protocol your API speaks.', topicId: 'http-protocol', relatesTo: [{ id: 'rest', relation: 'is used by' }, { id: 'tls', relation: 'secured by' }] },
        { id: 'tls', label: 'TLS / HTTPS', summary: 'Encrypts traffic and proves server identity.', topicId: 'https-tls', relatesTo: [{ id: 'http', relation: 'protects' }] },
        { id: 'dns', label: 'DNS', summary: 'Resolves hostnames to IP addresses.', topicId: 'dns', relatesTo: [{ id: 'loadbalancer', relation: 'points to' }] },
        { id: 'loadbalancer', label: 'Load Balancer', summary: 'Spreads traffic across healthy instances.', topicId: 'load-balancing', relatesTo: [{ id: 'scaling', relation: 'enables' }] },
      ],
    },
    {
      id: 'api',
      name: 'API Layer',
      concepts: [
        { id: 'rest', label: 'REST', summary: 'Resource-based API style over HTTP.', topicId: 'rest-api-design', relatesTo: [{ id: 'http', relation: 'built on' }, { id: 'auth', relation: 'protected by' }] },
        { id: 'middleware', label: 'Middleware', summary: 'Ordered pipeline: auth, rate limit, parsing.', topicId: 'middlewares', relatesTo: [{ id: 'auth', relation: 'runs' }, { id: 'ratelimit', relation: 'runs' }] },
        { id: 'auth', label: 'Auth (JWT/OAuth)', summary: 'Proves identity and enforces permissions.', topicId: 'authentication', relatesTo: [{ id: 'rest', relation: 'guards' }] },
        { id: 'ratelimit', label: 'Rate Limiting', summary: 'Caps request volume to protect the system.', topicId: 'rate-limiting-deep', relatesTo: [{ id: 'caching', relation: 'often uses' }] },
      ],
    },
    {
      id: 'data',
      name: 'Data & Storage',
      concepts: [
        { id: 'sql', label: 'SQL Database', summary: 'Relational store with ACID transactions.', topicId: 'sql-deep-dive', relatesTo: [{ id: 'transactions', relation: 'provides' }, { id: 'index', relation: 'sped up by' }] },
        { id: 'transactions', label: 'Transactions (ACID)', summary: 'All-or-nothing units with isolation.', topicId: 'database-transactions', relatesTo: [{ id: 'sql', relation: 'run on' }] },
        { id: 'index', label: 'Indexing', summary: 'B-tree structures that make reads O(log n).', topicId: 'sql-deep-dive', relatesTo: [{ id: 'sql', relation: 'accelerates' }] },
        { id: 'caching', label: 'Caching (Redis)', summary: 'Keep hot data in memory to cut latency.', topicId: 'caching', relatesTo: [{ id: 'sql', relation: 'shields' }] },
        { id: 'nosql', label: 'NoSQL', summary: 'Document/KV/wide-column for scale & flexibility.', topicId: 'nosql-deep', relatesTo: [{ id: 'scaling', relation: 'enables' }] },
      ],
    },
    {
      id: 'scale',
      name: 'Scale & Reliability',
      concepts: [
        { id: 'scaling', label: 'Horizontal Scaling', summary: 'Add stateless instances behind a balancer.', topicId: 'horizontal-scaling', relatesTo: [{ id: 'loadbalancer', relation: 'needs' }, { id: 'queues', relation: 'often uses' }] },
        { id: 'queues', label: 'Message Queues', summary: 'Async work; decouple producers & consumers.', topicId: 'message-queues', relatesTo: [{ id: 'idempotency', relation: 'requires' }] },
        { id: 'idempotency', label: 'Idempotency', summary: 'Safe retries — same key, same effect.', topicId: 'idempotency-exactly-once', relatesTo: [{ id: 'queues', relation: 'makes safe' }] },
        { id: 'circuitbreaker', label: 'Circuit Breaker', summary: 'Stop calling a failing dependency.', topicId: 'circuit-breaker', relatesTo: [{ id: 'observability', relation: 'informs' }] },
      ],
    },
    {
      id: 'security',
      name: 'Security',
      concepts: [
        { id: 'owasp', label: 'OWASP Top 10', summary: 'The most common web vulnerabilities.', topicId: 'owasp-top10', relatesTo: [{ id: 'auth', relation: 'includes' }] },
        { id: 'injection', label: 'Injection', summary: 'SQLi/XSS — never trust user input.', topicId: 'injection-attacks', relatesTo: [{ id: 'owasp', relation: 'part of' }] },
        { id: 'secrets', label: 'Secrets Mgmt', summary: 'Keep keys out of code; rotate them.', topicId: 'secrets-management', relatesTo: [{ id: 'tls', relation: 'related to' }] },
      ],
    },
    {
      id: 'production',
      name: 'Production',
      concepts: [
        { id: 'observability', label: 'Observability', summary: 'Metrics, logs, and traces to see inside.', topicId: 'observability-stack', relatesTo: [{ id: 'incidents', relation: 'drives' }] },
        { id: 'cicd', label: 'CI/CD', summary: 'Automated build → test → deploy pipeline.', topicId: 'deployment-basics', relatesTo: [{ id: 'containers', relation: 'ships' }] },
        { id: 'containers', label: 'Containers (Docker/K8s)', summary: 'Package and orchestrate services.', topicId: 'docker-kubernetes', relatesTo: [{ id: 'scaling', relation: 'enables' }] },
        { id: 'incidents', label: 'Incident Response', summary: 'Detect → mitigate → resolve → learn.', topicId: 'incident-management', relatesTo: [{ id: 'observability', relation: 'depends on' }] },
      ],
    },
  ],
}
