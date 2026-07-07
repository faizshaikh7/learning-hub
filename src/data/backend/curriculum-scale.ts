import type { CurriculumTopic, FlashcardData } from '@/types'

/**
 * Staff-level distributed-systems & scaling topics for the Backend Engineering
 * course. Promoted from passing mentions to first-class lessons for system-design
 * interviews. orderIndex is 99 here and auto-renumbered when merged into Phase 3.
 */
export const BACKEND_SCALE_TOPICS: CurriculumTopic[] = [
  {
    id: 'db-replication',
    phase: 3,
    phaseName: 'Scale & Performance',
    orderIndex: 99,
    estimatedMins: 40,
    prerequisites: ['cap-theorem', 'horizontal-scaling'],
    title: 'Database Replication & Read Replicas',
    eli5: "Imagine one librarian who has the only copy of every book. If a thousand people show up asking to read, they all queue behind that one person. Replication is photocopying the whole library into several rooms: now many people can read at once. But there's a catch — when the original gets a new book, it takes a moment for the photocopies to get it too, so a copy-room might briefly be one book behind.",
    analogy: "Think of a head chef (the primary) who writes every new recipe in the master cookbook. Sous-chefs (replicas) each keep a copy so diners can ask any of them what's on the menu. All recipe CHANGES go through the head chef, who then shouts them out; the sous-chefs copy them down. Reads scale because any sous-chef can answer. But if you ask a sous-chef about a recipe the head chef added two seconds ago, they might not have written it down yet — that's replication lag.",
    explanation: "Replication means keeping copies of your database on multiple machines so reads can be spread across them and so you survive a machine dying. The dominant model is primary-replica (also called leader-follower or master-slave): ONE node accepts writes (the primary), applies them, and streams its change log to one or more replicas that apply the same changes in the same order.\n\nWhy do it? Two reasons that get conflated but are different:\n\n1. SCALING READS. Most apps read far more than they write (often 10:1 or 100:1). You can point read-heavy traffic (product pages, search, analytics) at replicas and keep the primary for writes. Ten replicas roughly means ~10x read capacity.\n\n2. HIGH AVAILABILITY / DURABILITY. If the primary dies, a replica already has (almost) all the data and can be promoted to take over. You also get a live off-box backup.\n\nThe crucial subtlety is WHEN a write is considered done. In ASYNCHRONOUS replication the primary commits and replies to the client immediately, then ships the change to replicas in the background — fast writes, but replicas lag and a crash can lose the not-yet-shipped tail. In SYNCHRONOUS replication the primary waits for a replica to acknowledge before telling the client 'done' — no data loss on failover, but every write pays the round-trip and stalls if the replica is slow. Most real systems use a middle ground: semi-synchronous, where the primary waits for AT LEAST ONE replica to ack and lets the rest follow asynchronously.",
    technicalDeep: "Replication mechanics: the primary produces an ordered stream of changes — Postgres ships WAL (write-ahead log) records, MySQL ships binlog events. Replicas replay that stream. Statement-based replication ships the SQL (compact but dangerous with NOW(), RAND(), triggers); row-based ships the actual changed rows (bigger, deterministic) — modern defaults favor row-based.\n\nReplication lag is the time between a write committing on the primary and it being visible on a replica. Under async replication lag is usually milliseconds but spikes under write bursts, long-running replica queries, or network hiccups. Lag creates read-your-writes anomalies: a user updates their profile (write -> primary), the next page reads from a replica that hasn't caught up, and their change appears to vanish. Fixes: (a) route a user's reads to the primary for a few seconds after they write; (b) 'read-your-writes' by tracking the write's log position (LSN/GTID) and only reading from a replica that has reached it; (c) sticky-route a session to a single replica for monotonic reads.\n\nFailover & promotion: when the primary dies, an orchestrator (Patroni, Orchestrator, or a managed service like RDS) detects it, picks the most caught-up replica, promotes it to primary, and repoints the others. The danger is SPLIT-BRAIN: the old primary comes back thinking it's still leader while a new one exists — two primaries accepting conflicting writes. Fencing (STONITH), leases, and quorum-based election prevent this.\n\nMulti-primary (multi-leader) lets more than one node accept writes — useful for multi-region write locality or offline clients — but you inherit WRITE CONFLICTS (two regions edit the same row) that need conflict resolution: last-write-wins (lossy), version vectors, or CRDTs. Most teams avoid multi-primary unless geography forces it.\n\nReplication vs sharding: replication copies the WHOLE dataset to every node — it scales READS and availability, not writes or storage, because every node still holds everything and every node still applies every write. When your WRITE throughput or DATA SIZE exceeds one machine, you need sharding (partitioning) to split the data. They compose: shard for write/size scale, replicate each shard for read scale and HA.",
    whatBreaks: "Reading your own writes from a lagging replica: user saves a change, immediately reloads, sees stale data — classic and infuriating. Route post-write reads to the primary or track log position. Treating replicas as free write capacity: they are NOT — every write still hits every replica, so replication scales reads only. Silent failover data loss: async failover promotes a replica missing the last few writes; those writes are gone. Use semi-sync if you can't lose them. Split-brain after a network partition: two primaries accept divergent writes and you get an unmergeable mess — you need fencing/quorum. Replica lag from a single slow query: one long analytical query on a replica can stall replay and balloon lag for everyone. Failing over to a cold replica: promoting a replica that was far behind means a big catch-up stall and possibly lost data.",
    efficientWay: {
      title: 'Scaling a read-heavy database that is outgrowing one node',
      approaches: [
        { name: 'Primary + async read replicas (with read-your-writes handling)', verdict: 'best', reason: 'Matches the common 10:1+ read/write ratio, cheap to add capacity, and the lag anomalies are solvable by routing recent-writer reads to the primary or tracking LSN. The default for the vast majority of apps.' },
        { name: 'Semi-synchronous replication', verdict: 'ok', reason: 'Right when you cannot lose acknowledged writes on failover (payments, ledgers). You trade a little write latency for durability — worth it for the data that matters, overkill everywhere else.' },
        { name: 'Multi-primary replication', verdict: 'weak', reason: 'Only justified by genuine multi-region write locality or offline-first clients. You inherit write-conflict resolution, which is hard to get right; most teams regret reaching for it early.' },
      ],
      recommendation: "Start with one primary and one or two async replicas; send analytics and heavy reads to replicas and keep the primary for writes plus reads that must be fresh. Add explicit read-your-writes handling (route a user to the primary for a few seconds after they write, or gate replica reads on log position). Reserve synchronous/semi-sync for the small set of writes you truly cannot lose, and only reach for multi-primary when geography forces it. When writes or data size — not reads — become the wall, that is your signal to shard, not to add more replicas.",
    },
    commonMistakes: [
      "Believing read replicas add write capacity — every write is applied on every replica, so they scale reads and availability only",
      "Ignoring replication lag and reading a user's just-written data from a stale replica (broken read-your-writes)",
      "Using async replication for money/ledger writes, then silently losing the last few writes during a failover",
      "Not planning for split-brain, so a returning old primary and a freshly promoted one both accept conflicting writes",
    ],
    seniorNotes: "The senior instinct is to separate the two reasons you replicate — read scaling versus availability — because they lead to different topologies and SLAs. For read scaling you care about lag and routing; for availability you care about failover time (RTO) and data loss (RPO), and those come from your sync mode, not your replica count. Push back when someone proposes replicas to fix write saturation: that is a sharding problem. Make read-your-writes an explicit product decision — for a comment box, primary-routing for a few seconds is plenty; for a bank balance, you may need synchronous reads. And treat failover as a tested runbook, not a hope: unrehearsed promotions are where split-brain and data loss actually happen. Finally, remember replication and sharding compose — real large systems shard for write/size scale and replicate each shard for read scale and HA.",
    interviewQuestions: [
      "Why do read replicas scale reads but not writes, and what do you do when writes become the bottleneck?",
      "A user updates their profile and immediately sees the old value on reload. What's happening and how do you fix it?",
      "Walk me through synchronous vs asynchronous replication and when you'd accept the latency cost of synchronous.",
      "What is split-brain during failover and how do you prevent it?",
      "When would you choose multi-primary replication, and what new problem does it force you to solve?",
    ],
    interviewAnswers: [
      "Every replica must apply every write to stay consistent, so adding replicas multiplies read capacity but each node still does the full write workload and holds the full dataset — writes and storage don't scale. When writes or data size exceed one machine you shard (partition the data across nodes), and typically replicate each shard for read scale and HA.",
      "It's replication lag with a read-your-writes violation: the write hit the primary but the reload read from a replica that hadn't caught up. Fix it by routing that user's reads to the primary for a few seconds after a write, or by tracking the write's log position (LSN/GTID) and only serving the read from a replica that has reached it.",
      "Async: the primary commits and replies immediately, shipping changes to replicas in the background — fast writes but replicas lag and a crash can lose the untransmitted tail. Sync: the primary waits for a replica to acknowledge before confirming the write — no data loss on failover but every write pays a round-trip and stalls if the replica is slow. I accept synchronous (usually semi-sync, waiting for at least one replica) for writes I cannot lose, like payments or ledgers.",
      "Split-brain is when a network partition or a returning old primary leaves two nodes both believing they're the leader, so both accept conflicting writes that can't be cleanly merged. You prevent it with quorum-based leader election, fencing/STONITH to forcibly demote the old primary, and leases so a leader that can't renew its lease steps down before a new one is elected.",
      "I choose multi-primary only when I genuinely need low-latency writes in multiple regions or offline-first clients that write locally and sync later. The problem it forces on me is write-conflict resolution when two primaries edit the same data — I have to pick a strategy like last-write-wins (lossy), version vectors, or CRDTs, and that complexity is why I avoid it unless geography demands it.",
    ],
    codeExamples: [
      {
        lang: 'typescript',
        label: 'Read/write routing with read-your-writes protection',
        code: "// Split traffic: writes -> primary, reads -> replicas.\n// Guarantee a user sees their own recent writes by pinning them to the\n// primary for a short window after any write.\n\ntype Pool = { query: (sql: string, args?: unknown[]) => Promise<any> }\n\nconst primary: Pool = makePool(process.env.PRIMARY_URL!)\nconst replicas: Pool[] = [makePool(process.env.REPLICA_1!), makePool(process.env.REPLICA_2!)]\nconst pickReplica = () => replicas[Math.floor(Math.random() * replicas.length)]\n\n// Remember, per user, the last time they wrote (e.g. in Redis).\nconst RECENT_WRITE_MS = 3000\nasync function wroteRecently(userId: string): Promise<boolean> {\n  const t = await cache.get('lw:' + userId)\n  return !!t && Date.now() - Number(t) < RECENT_WRITE_MS\n}\n\nasync function write(userId: string, sql: string, args: unknown[]) {\n  const res = await primary.query(sql, args)\n  await cache.set('lw:' + userId, String(Date.now()), 'PX', RECENT_WRITE_MS)\n  return res\n}\n\nasync function read(userId: string, sql: string, args: unknown[]) {\n  // If the user just wrote, read from the primary so they see their change.\n  const pool = (await wroteRecently(userId)) ? primary : pickReplica()\n  return pool.query(sql, args)\n}",
      },
      {
        lang: 'sql',
        label: 'Measuring replication lag on a Postgres replica',
        code: "-- On the replica: how far behind is it, in seconds?\n-- NULL means the replica is fully caught up (or idle).\nSELECT\n  CASE\n    WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() THEN 0\n    ELSE EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp()))\n  END AS lag_seconds;\n\n-- On the primary: bytes each replica is behind (byte lag, not time).\nSELECT\n  client_addr,\n  state,                                   -- streaming / catchup\n  sync_state,                              -- sync / async / potential\n  pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS replay_lag_bytes\nFROM pg_stat_replication;\n\n-- Alert when lag_seconds crosses your read-your-writes budget\n-- (e.g. > 1s) so routing can shed replica reads onto the primary.",
      },
    ],
  },
  {
    id: 'consistent-hashing',
    phase: 3,
    phaseName: 'Scale & Performance',
    orderIndex: 99,
    estimatedMins: 40,
    prerequisites: ['database-sharding', 'load-balancing'],
    title: 'Consistent Hashing',
    eli5: "Say you spread a huge pile of letters across 4 mailboxes by taking the address number and dividing by 4 to pick a box. It works — until you add a 5th mailbox. Now you divide by 5 instead, and almost EVERY letter has to move to a different box. Consistent hashing is a smarter way to assign letters so that when you add a 5th box, only about a fifth of the letters move, not all of them.",
    analogy: "Picture a big round clock face. You scatter your servers at positions around the clock, and you also place each piece of data at a position around the clock (based on its hash). Each data item belongs to the first server you reach walking CLOCKWISE from its spot. Now remove a server: only the data that used to land on it slides to the NEXT server clockwise — everything else stays put. Add a server: it only steals the slice of data sitting just behind it. The clock barely reshuffles.",
    explanation: "Consistent hashing solves a specific, painful problem: how do you distribute keys (cache entries, database rows, sessions) across N servers so that adding or removing a server moves as FEW keys as possible?\n\nThe naive approach is modulo hashing: server = hash(key) % N. It distributes evenly and is dead simple. The disaster is what happens when N changes. Go from 4 servers to 5 and the divisor changes from 4 to 5, so hash(key) % 5 lands somewhere different for almost every key — roughly (N-1)/N of ALL keys move. For a cache that means a near-total cache miss storm the instant you scale; for a sharded database it means re-copying nearly the entire dataset. Adding capacity should not blow up your whole cluster.\n\nConsistent hashing fixes this with a RING. Imagine the output of the hash function as a circle, say 0 to 2^32-1 wrapping around. You hash each SERVER to a point on the ring, and you hash each KEY to a point on the ring. A key is owned by the first server you meet going clockwise from the key's point. Now the magic: when you remove a server, only the keys that mapped to it move — to the next server clockwise. When you add a server, it only takes over the keys in the arc between it and the previous server. On average only K/N keys move when you add or remove one node, instead of nearly all of them.\n\nThe one wrinkle: with just one point per server, the arcs are uneven — one server might own a huge slice and another a tiny one, and removing a server dumps its entire load onto a single neighbor. The fix is VIRTUAL NODES: hash each physical server to many points on the ring (say 100-200 'vnodes' each). Now each server owns many small arcs scattered around the ring, load evens out, and when a server leaves, its arcs are absorbed by MANY different neighbors instead of one.",
    technicalDeep: "The ring is typically a sorted structure of hash points -> node. Lookup = hash the key, then binary-search for the first node point >= the key's hash (wrapping to the first point if you run off the end). That's O(log V) where V is the total number of (virtual) points. A TreeMap/sorted array of vnode hashes is the standard implementation.\n\nHash function choice matters: you want good avalanche/uniformity and speed — MD5/SHA are used for distribution quality (not security here), but non-cryptographic hashes like MurmurHash or xxHash are faster and fine. Uniformity keeps arcs balanced.\n\nVirtual nodes: replicating each server to R points reduces load variance. With R around 100-200 per node the standard deviation of load drops to a few percent. More vnodes = smoother balance but more memory and slightly slower lookups. Weighted nodes (a bigger server gets more vnodes) let heterogeneous hardware carry proportional load.\n\nReplication for availability: systems place each key on the next K DISTINCT physical nodes clockwise (skipping vnodes of a server already chosen) to store K replicas. This is exactly how Dynamo-style systems build their preference list.\n\nWhere it's used: Amazon Dynamo and Cassandra partition data with consistent hashing; Riak too. Memcached client libraries (ketama) use it so a dead cache node only invalidates its own slice. Load balancers use it for session/backend affinity (and 'consistent hashing with bounded loads' caps any node's share). CDNs use it to map objects to cache servers. Discord, and many sharded systems, lean on it.\n\nAlternatives worth knowing: RENDEZVOUS (highest-random-weight) hashing computes hash(key, node) for every node and picks the max — also moves only K/N keys on change, needs no ring, and gives naturally even distribution, at O(N) per lookup. JUMP consistent hash is a tiny, allocation-free algorithm that maps a key to one of N buckets with minimal movement, but it only supports appending/removing the LAST bucket, so it fits elastic numbered shards, not arbitrary node churn.",
    whatBreaks: "Using modulo hashing and then scaling: the moment you change N, almost every key remaps — cache hit rate collapses to near zero and every request stampedes the origin, or a resharding job re-copies the whole dataset. Skipping virtual nodes: with one point per server, load is lopsided and losing a node dumps its entire share onto a single neighbor, which then falls over — a cascading failure. Too few vnodes: still visibly uneven ('hot shards'). A weak/biased hash function: clumps keys, defeating the even-distribution goal. Forgetting distinct-node replica placement: naively taking the next K ring points can put multiple replicas of a key on vnodes of the SAME physical server, so one machine failing loses a replica you thought was redundant. Assuming it fixes hot KEYS: consistent hashing balances the KEYSPACE, but a single viral key (one celebrity's timeline) still lands on one node — you need per-key replication or caching for that.",
    efficientWay: {
      title: 'Mapping keys to a changing set of nodes (sharded cache / DB / LB)',
      approaches: [
        { name: 'Consistent hashing with virtual nodes', verdict: 'best', reason: 'Only ~K/N keys move when a node joins or leaves, vnodes keep load even and spread a failed node across many neighbors, and it scales to large clusters with simple O(log V) lookups. The industry-standard answer.' },
        { name: 'Rendezvous (HRW) hashing', verdict: 'ok', reason: 'Same minimal-movement property with naturally even load and no ring to maintain, and it makes replica selection trivial (top-K by weight). The catch is O(N) per lookup, so it fits smaller node counts or when you already iterate nodes.' },
        { name: 'Modulo hashing (hash % N)', verdict: 'weak', reason: 'Trivial and perfectly balanced while N is fixed, but any change to N remaps ~(N-1)/N of all keys — catastrophic for caches and sharded stores. Only acceptable when the node set truly never changes.' },
      ],
      recommendation: "Reach for consistent hashing with virtual nodes whenever the node set can change under you — sharded caches, distributed databases, or hash-based load balancing. Use ~100-200 vnodes per physical node (weight them by capacity for mixed hardware), pick a fast well-distributing hash like MurmurHash/xxHash, and place replicas on the next K DISTINCT physical nodes. If your cluster is small or you want dead-simple replica selection, rendezvous hashing is a clean alternative. Keep modulo hashing only for a genuinely fixed set of buckets, and remember neither approach fixes a single hot KEY — that needs replication or caching of that key.",
    },
    commonMistakes: [
      "Defaulting to hash % N for a cache or shard set that will grow, then suffering a full remap and cache-miss storm the first time you add a node",
      "Implementing the ring with one point per server and no virtual nodes, causing lopsided load and a single-neighbor overload when a node dies",
      "Placing K replicas on the next K ring points without skipping vnodes of the same physical server, so replicas secretly share a machine",
      "Assuming consistent hashing balances hot KEYS — it balances the keyspace, but one viral key still overloads its single owning node",
    ],
    seniorNotes: "The signal you understand this at a senior level is separating three things: distributing the KEYSPACE (consistent hashing does this well), balancing per-node LOAD (needs vnodes, and 'consistent hashing with bounded loads' if you need a hard cap), and handling hot KEYS (needs replication/caching, not hashing). Know the alternatives and their tradeoffs — rendezvous hashing gives even distribution and trivial top-K replica selection at O(N), and jump hash is beautifully compact but only supports numbered buckets. In interviews, the moment you propose sharding, be ready to explain why you'd never use modulo across a changing cluster and how vnodes both smooth load and turn a node failure into many small reassignments instead of one big one. And always flag the distinct-physical-node replica placement detail — it's the subtle correctness bug that separates people who've built this from people who've only read about it.",
    interviewQuestions: [
      "Why does hash(key) % N fall apart when N changes, and what does consistent hashing do differently?",
      "What problem do virtual nodes solve, and what goes wrong without them?",
      "How would you store K replicas of each key on the ring, and what's the subtle bug to avoid?",
      "Does consistent hashing solve a single hot key? If not, what does?",
      "When might you pick rendezvous hashing over a hash ring?",
    ],
    interviewAnswers: [
      "With modulo hashing the bucket is hash(key) % N, so changing N changes the divisor and remaps roughly (N-1)/N of ALL keys — a near-total reshuffle that causes a cache-miss storm or a full resharding copy. Consistent hashing places nodes and keys on a ring and assigns each key to the next node clockwise, so adding or removing a node only moves the keys in that node's arc — on average K/N keys — leaving everything else untouched.",
      "Virtual nodes give each physical server many points on the ring instead of one. Without them the arcs between nodes are uneven, so load is lopsided (hot shards), and when a node dies its entire arc dumps onto a single clockwise neighbor, which can then overload and cascade. With ~100-200 vnodes per node, each server owns many small scattered arcs, load evens out, and a failed node's work is absorbed by many different neighbors.",
      "I walk clockwise from the key and place it on the next K nodes — but I must skip vnodes that belong to a physical server I've already chosen, taking the next K DISTINCT physical nodes. The subtle bug is naively taking the next K ring points: multiple of them can be virtual nodes of the SAME machine, so two 'replicas' actually live on one server and a single failure loses redundancy you thought you had.",
      "No. Consistent hashing balances the KEYSPACE across nodes, but a single hot key hashes to exactly one point and lands on one node, so a viral key still overloads its owner. You fix hot keys separately — replicate that key across multiple nodes and read from any, or put it behind a local/edge cache, or split it into sub-keys.",
      "Rendezvous hashing when the node count is modest or I want dead-simple replica selection: it computes hash(key, node) for every node and picks the highest, giving even distribution and minimal movement with no ring to maintain, and the top-K nodes by weight are naturally the K replicas. The tradeoff is O(N) per lookup, so for very large clusters a hash ring's O(log V) lookup wins.",
    ],
    codeExamples: [
      {
        lang: 'typescript',
        label: 'A consistent hash ring with virtual nodes',
        code: "import { createHash } from 'crypto'\n\n// 32-bit hash point on the ring from any string.\nfunction hash(key: string): number {\n  const h = createHash('md5').update(key).digest()\n  return h.readUInt32BE(0) // first 4 bytes -> 0 .. 2^32-1\n}\n\nclass HashRing {\n  private ring = new Map<number, string>()  // point -> physical node\n  private points: number[] = []             // sorted ring points\n\n  constructor(private vnodes = 150) {}\n\n  addNode(node: string) {\n    for (let i = 0; i < this.vnodes; i++) {\n      const p = hash(node + '#' + i)          // many points per node\n      this.ring.set(p, node)\n      this.points.push(p)\n    }\n    this.points.sort((a, b) => a - b)\n  }\n\n  removeNode(node: string) {\n    this.points = this.points.filter(p => this.ring.get(p) !== node)\n    for (const p of [...this.ring.keys()]) if (this.ring.get(p) === node) this.ring.delete(p)\n  }\n\n  // First node clockwise from the key's hash (wrapping around the ring).\n  getNode(key: string): string {\n    if (this.points.length === 0) throw new Error('empty ring')\n    const h = hash(key)\n    let lo = 0, hi = this.points.length - 1\n    while (lo < hi) {                          // binary search: first point >= h\n      const mid = (lo + hi) >> 1\n      if (this.points[mid] < h) lo = mid + 1; else hi = mid\n    }\n    const point = this.points[lo] >= h ? this.points[lo] : this.points[0] // wrap\n    return this.ring.get(point)!\n  }\n\n  // K replicas = next K DISTINCT physical nodes clockwise (skip same machine).\n  getNodes(key: string, k: number): string[] {\n    const start = this.points.findIndex(p => p >= hash(key))\n    const out: string[] = []\n    for (let i = 0; i < this.points.length && out.length < k; i++) {\n      const node = this.ring.get(this.points[(start + i) % this.points.length])!\n      if (!out.includes(node)) out.push(node)   // distinct physical nodes only\n    }\n    return out\n  }\n}",
      },
      {
        lang: 'text',
        label: 'Worked example: adding a 5th node moves ~1/5 of keys, not ~4/5',
        code: "Setup: 4 nodes, 12 keys. Compare modulo vs consistent hashing.\n\n--- MODULO: node = hash(key) % N ---\nN=4:  k1->1  k2->2  k3->3  k4->0  k5->1  k6->2  k7->3  k8->0  k9->1  k10->2 k11->3 k12->0\nAdd a 5th node, now N=5 (divisor changed 4 -> 5):\nN=5:  k1->? recompute EVERY key with %5. In practice ~ (N-1)/N = 4/5 of the\n      12 keys land on a different node. ~9-10 keys move. Cache: near-total miss.\n\n--- CONSISTENT HASHING: ring of points 0..2^32 ---\nNodes A,B,C,D hashed to ring points. Each key owned by next node clockwise.\n  A owns arc (D..A],  B owns (A..B],  C owns (B..C],  D owns (C..D]\nAdd node E; suppose E hashes into the middle of B's arc:\n  E now owns (A..E];  B keeps only (E..B].\nONLY the keys that fell in (A..E] move (from B to E). Keys owned by A, C, D are\nuntouched. On average with N->N+1 that is ~ 1/(N+1) of keys ≈ 1/5. ~2-3 keys move.\n\nTakeaway: modulo reshuffles ~4/5 of keys on a resize; consistent hashing ~1/5.\nWith virtual nodes, E's new share is drawn evenly from ALL existing nodes\n(not just B), so no single neighbor gets slammed.",
      },
    ],
  },
  {
    id: 'distributed-coordination',
    phase: 3,
    phaseName: 'Scale & Performance',
    orderIndex: 99,
    estimatedMins: 45,
    prerequisites: ['cap-theorem', 'db-replication'],
    title: 'Distributed Consensus & Coordination',
    eli5: "Imagine a group of friends who can only pass notes, notes sometimes get lost, and any friend might fall asleep at any moment. Now the whole group has to agree on ONE thing — say, who's paying the bill — and never disagree, even if someone wakes up late. That's shockingly hard. Consensus is the careful note-passing protocol that guarantees they all end up agreeing on the same answer, as long as more than half of them are awake.",
    analogy: "Think of a committee that must have exactly one chairperson. If two people both think they're chair and start giving conflicting orders, chaos (split-brain). So the committee votes: you only become chair if a MAJORITY of members vote for you, and there can only be one majority at a time — so there can only be one chair. The chair records every decision in a logbook and reads it aloud so everyone copies it in the same order. If the chair goes silent, the members hold a new vote. That majority-vote-plus-shared-logbook is basically Raft.",
    explanation: "Coordination is the problem of getting independent machines that talk over an unreliable network to AGREE — on who is the leader, what the current config is, who holds a lock, or the order of operations. It's hard because in a distributed system you cannot tell the difference between a node that has CRASHED and one that is merely SLOW or unreachable. That ambiguity is the root of most distributed bugs.\n\nThe scariest failure is SPLIT-BRAIN: a network partition cuts the cluster in two, and each side, unable to see the other, decides IT is in charge. Now you have two leaders accepting conflicting writes, or two holders of the same lock. When the partition heals you have divergent, unmergeable state. Coordination protocols exist to make split-brain impossible.\n\nThe core tool is CONSENSUS: a protocol by which a set of nodes agrees on a value (or a sequence of values) such that they never disagree, even across crashes and message loss. Raft and Paxos are the two famous algorithms. Conceptually, Raft (the easier one to reason about) works like this: nodes elect a LEADER by majority vote; only the leader accepts writes; the leader appends each write to a LOG and replicates it to followers; an entry is COMMITTED once a majority (quorum) have stored it; if the leader dies, followers time out and elect a new leader, and the majority rule guarantees the new leader already has every committed entry. The magic number is the MAJORITY: because any two majorities of the same cluster must overlap in at least one node, you can never elect two leaders or commit two conflicting values at once.\n\nQUORUMS generalize this to reads and writes without a single leader. If you have N replicas and require W nodes to acknowledge a write and R nodes to serve a read, then as long as R + W > N, every read is guaranteed to see at least one node that saw the latest write — because the read set and write set must overlap. That single inequality, R + W > N, is the heart of tunable consistency in Dynamo-style systems.",
    technicalDeep: "Raft in a bit more depth: time is divided into TERMS (monotonic election epochs). Each term has at most one leader. A follower that hears nothing for an election timeout becomes a CANDIDATE, increments the term, and requests votes; a node grants at most one vote per term and only to a candidate whose log is at least as up-to-date as its own — so the winner has all committed entries. The leader sends AppendEntries (also the heartbeat); an entry commits once replicated to a majority, and commitment is monotonic. Paxos reaches the same guarantee via prepare/promise then accept/accepted phases with proposal numbers; Multi-Paxos and Raft both optimize the steady state to a stable leader streaming entries.\n\nQuorum math: with N=3, W=2, R=2, R+W=4>3, so reads and writes overlap and you tolerate one node down while staying strongly consistent. Set W=N for read-optimized (cheap reads R=1 but writes need everyone), or W=1,R=N for write-optimized. Sloppy quorums + hinted handoff (Dynamo) relax this for availability at the cost of temporary inconsistency reconciled later via version vectors.\n\nDistributed locks & leases: a naive 'SETNX in Redis' lock is unsafe under failures because the holder can pause (GC, VM freeze) past the lock's expiry while still believing it holds it, and act on stale ownership. Two mitigations: LEASES (time-bounded ownership that must be renewed, so a dead holder auto-releases) and FENCING TOKENS (a monotonically increasing number handed out with the lock; the protected resource rejects any operation carrying a token lower than the highest it has seen, so a paused old holder's writes are refused). REDLOCK is Redis's multi-node lock algorithm (acquire on a majority of independent Redis nodes); it's debated — Martin Kleppmann's critique is that without fencing tokens it isn't safe for correctness-critical work, only for efficiency (avoiding duplicate work).\n\nCoordination services — etcd, ZooKeeper, Consul — are purpose-built consensus systems (etcd and Consul use Raft; ZooKeeper uses Zab, a Paxos-like protocol). You don't implement Raft yourself; you delegate leader election, config, service discovery, and locks to them. They give you strongly consistent small-data primitives: compare-and-swap keys, ephemeral nodes that vanish when a session dies (perfect for locks/leader election), and watches. Kubernetes stores all cluster state in etcd; Kafka historically used ZooKeeper (now its own Raft-based KRaft).",
    whatBreaks: "Assuming crashed and slow are distinguishable: they aren't, so timeouts are guesses — too short and you get false failovers, too long and you're slow to recover. Rolling your own leader election with a database flag or a single Redis key: it split-brains under partition because there's no quorum guaranteeing a single leader. Redis SETNX locks without fencing: a GC pause or VM freeze lets the holder's lease expire while it still 'thinks' it holds the lock, and its late write corrupts data another holder already changed. Even-sized clusters: a 2-node or 4-node cluster has no clean majority on a 50/50 split — always use ODD numbers (3, 5) so a majority exists. Ignoring R+W>N: reading from too few replicas returns stale data even though a write 'succeeded.' Running consensus on the hot path for everything: consensus needs a round-trip to a majority per decision, so putting every request through it tanks throughput — use it for the small, rare, must-agree decisions, not bulk data. Treating Redlock as correctness-safe: for correctness-critical mutual exclusion you still need fencing tokens.",
    efficientWay: {
      title: 'Getting nodes to agree on a leader / lock / critical value',
      approaches: [
        { name: 'Delegate to a proven consensus service (etcd/ZooKeeper/Consul)', verdict: 'best', reason: 'They implement Raft/Zab correctly, give you leader election, fencing-friendly CAS, ephemeral session locks and watches, and are battle-tested — you get split-brain safety without writing consensus yourself. Right for almost every team.' },
        { name: 'Quorum reads/writes (R+W>N) for tunable consistency', verdict: 'ok', reason: 'The right tool when you want strong-ish consistency over replicated DATA without a single leader (Dynamo/Cassandra style). You dial R and W per operation, but you own conflict handling and it is not full linearizable consensus.' },
        { name: 'Home-grown lock via a single Redis key or a DB flag', verdict: 'weak', reason: 'Trivial and fine only for efficiency (avoiding duplicate work), never for correctness: it split-brains under partition and lets a paused holder act on an expired lease. If used, it needs leases plus fencing tokens — at which point a real service is easier and safer.' },
      ],
      recommendation: "Don't implement consensus yourself. For leader election, config, service discovery, and locks, delegate to etcd, ZooKeeper, or Consul — they're Raft/Zab-based and give you ephemeral session locks and compare-and-swap that make split-brain impossible. Run an ODD cluster size (3 or 5) so a majority always exists. When you need distributed mutual exclusion for CORRECTNESS, insist on fencing tokens so a paused old holder's writes are rejected; a bare Redis lock is only acceptable for efficiency. For replicated data where you want to trade consistency against availability, use quorums with R+W>N and pick R/W per operation. Above all, keep consensus off the hot path: use it for the small, rare, must-agree decisions and let bulk traffic flow around it.",
    },
    commonMistakes: [
      "Rolling your own leader election with a DB boolean or single Redis key, which split-brains under a network partition because nothing guarantees a single leader",
      "Using a Redis/DB lock for correctness without fencing tokens, so a GC-paused holder acts on an expired lease and corrupts data",
      "Choosing an even cluster size (2 or 4), leaving no majority on a 50/50 partition and stalling all progress",
      "Forgetting R+W>N, so a read hits a stale replica set and returns data older than an acknowledged write",
    ],
    seniorNotes: "The mark of seniority here is knowing when you DON'T need consensus. Consensus is expensive — a majority round-trip per decision — so the goal is to shrink the set of things that must be globally agreed to the smallest possible core (who's leader, the config version, cluster membership) and let everything else be eventually consistent or partitioned so it scales. Push hard against home-grown coordination: 'we'll just use a Redis lock' is where correctness bugs are born; either it's efficiency-only (duplicate work is fine) or it needs fencing tokens and you should reach for etcd. Understand the safety-vs-liveness framing (FLP says you can't have both guaranteed under async + failures — real systems keep safety always and use timeouts/randomization for liveness) and be able to explain why majority overlap makes split-brain impossible. And know the operational cost: an odd-sized quorum, cross-AZ latency on every commit, and the blast radius when your coordination service itself has a bad day (in Kubernetes, etcd IS the cluster).",
    interviewQuestions: [
      "Why is distributed coordination fundamentally hard — what can't a node tell?",
      "Explain how Raft prevents two leaders from existing at once.",
      "What does R + W > N guarantee, and how would you tune R and W for a read-heavy workload?",
      "Why is a plain Redis lock unsafe for correctness, and what makes it safe?",
      "When do you actually need consensus, and when should you avoid it?",
    ],
    interviewAnswers: [
      "A node can't distinguish a peer that has CRASHED from one that is merely SLOW or on the far side of a network partition — in an asynchronous network a missing response could mean either. Because failure detection is only ever a timeout-based guess, you can't safely assume a silent node is dead, which is exactly why naive designs split-brain: each side assumes the other is gone and both take charge.",
      "Raft uses terms and majority voting: to become leader a candidate must win votes from a MAJORITY of the cluster, and each node votes at most once per term. Since any two majorities of the same cluster must share at least one node, and that node won't vote twice in a term, you can never assemble two majorities for two leaders in the same term — so at most one leader exists. A new leader also must have an up-to-date log to win, so it already holds every committed entry.",
      "R + W > N guarantees the read quorum and write quorum overlap in at least one replica, so every read sees at least one node that acknowledged the latest write — no stale-read past an acknowledged write. For a read-heavy workload I push reads to be cheap by lowering R (even R=1) and raising W toward N, so writes cost more but reads are fast; e.g. N=3, W=3, R=1 still satisfies R+W>N while making reads single-node.",
      "A plain Redis lock is unsafe because the holder can pause — a GC pause or VM freeze — past the lock's TTL while still believing it holds it; the lock expires, another client acquires it, and now the paused client wakes and writes, so two clients act as holder and corrupt state. It becomes safe with fencing tokens: the lock hands out a monotonically increasing number, and the protected resource rejects any write carrying a token lower than the highest it has seen, so the stale holder's write is refused.",
      "I need consensus for the small set of decisions that must be globally agreed and never diverge — leader election, cluster membership, config/version, distributed locks for correctness — because there split-brain is catastrophic. I avoid it for bulk data and the hot path, since each consensus decision costs a majority round-trip and kills throughput; there I prefer eventual consistency, quorum reads/writes, or partitioning, and keep the truly-must-agree core as small as possible.",
    ],
    codeExamples: [
      {
        lang: 'typescript',
        label: 'Quorum read/write: R + W > N gives read-your-writes across replicas',
        code: "// N replicas. A write must be acked by W of them; a read gathers R of them.\n// If R + W > N the read set and write set OVERLAP, so a read always sees the\n// newest acknowledged write. Each value carries a version to pick the latest.\n\ntype Versioned = { value: string; version: number }\ntype Replica = {\n  put: (k: string, v: Versioned) => Promise<void>\n  get: (k: string) => Promise<Versioned | null>\n}\n\nasync function quorumWrite(replicas: Replica[], W: number, k: string, v: Versioned) {\n  const acks = replicas.map(r => r.put(k, v).then(() => true).catch(() => false))\n  let ok = 0\n  for (const a of acks) if (await a) ok++\n  if (ok < W) throw new Error('write failed to reach quorum W=' + W)\n}\n\nasync function quorumRead(replicas: Replica[], R: number, k: string): Promise<Versioned | null> {\n  const results = await Promise.all(replicas.slice(0, R).map(r => r.get(k).catch(() => null)))\n  // Overlap guarantee (R+W>N) means the freshest version is somewhere in here.\n  return results.reduce<Versioned | null>((best, cur) =>\n    cur && (!best || cur.version > best.version) ? cur : best, null)\n}\n\n// Example: N=3, W=2, R=2 -> R+W=4 > 3. Tolerates 1 node down, stays consistent.",
      },
      {
        lang: 'text',
        label: 'Raft leader election & why fencing tokens make locks safe',
        code: "RAFT ELECTION (why there is never more than one leader)\n  term 4: node C times out (heard no heartbeat), becomes CANDIDATE,\n          bumps term -> 4, asks A and B for votes.\n  A votes yes (C's log is up-to-date). B votes yes. C has 2/3 = MAJORITY.\n  -> C is leader for term 4. A second candidate would also need 2/3, but the\n     two majorities must share a node, and no node votes twice per term,\n     so a second leader in term 4 is impossible. No split-brain.\n\nDISTRIBUTED LOCK WITHOUT vs WITH FENCING\n  UNSAFE:\n    client-1 acquires lock (TTL 10s)\n    client-1 STOP-THE-WORLD GC pause for 15s ...\n    lock expires at 10s; client-2 acquires it, writes to storage\n    client-1 resumes, still thinks it holds the lock, writes -> CORRUPTION\n\n  SAFE (fencing token = monotonically increasing number):\n    client-1 acquires lock, gets token 33\n    client-1 pauses; lock expires\n    client-2 acquires lock, gets token 34, writes with token 34\n    storage now remembers highest token = 34\n    client-1 resumes, writes with token 33  ->  33 < 34, storage REJECTS it\n  The stale holder's write is fenced out. This is why Redlock alone (no token)\n  is fine for efficiency but not for correctness-critical mutual exclusion.",
      },
    ],
  },
  {
    id: 'capacity-planning',
    phase: 3,
    phaseName: 'Scale & Performance',
    orderIndex: 99,
    estimatedMins: 40,
    prerequisites: ['horizontal-scaling', 'performance-profiling'],
    title: 'Capacity Planning & Back-of-Envelope Estimation',
    eli5: "Before you cook dinner for a party, you guess: how many people, how hungry, how many plates and how much rice? You don't weigh every grain — you estimate in your head and buy a bit extra. Capacity planning is the same for computers: roughly how many requests per second, how much storage, how much memory — so you know how many servers to buy and where it'll choke, WITHOUT building it first.",
    analogy: "It's like a road engineer sizing a highway. They don't wait for the traffic jam; they estimate: how many cars per day, what's the rush-hour PEAK (way higher than the average), how many lanes does that need, and where's the bottleneck — a narrow bridge, an off-ramp? Back-of-envelope estimation is doing that arithmetic on a napkin: turning 'a million daily users' into 'so this needs about N servers and a database this big, and the bottleneck will be writes.'",
    explanation: "Capacity planning is estimating the resources a system needs — requests/second, storage, bandwidth, memory, servers — from the requirements, BEFORE you build it. In system-design interviews it's the arithmetic that turns a vague prompt ('design Twitter') into concrete numbers that justify your architecture. In the real world it's how you avoid both falling over on launch day and burning money on 10x the servers you need.\n\nThe method is always the same four moves:\n\n1. START FROM USERS. You're usually given (or you assume) Daily Active Users. Turn DAU into actions: reads and writes per user per day. E.g. 100M DAU, each reads 20 items and posts 0.1 items/day.\n\n2. CONVERT TO PER-SECOND. There are ~100,000 seconds in a day (86,400, round to 1e5 for mental math). Divide total daily actions by 1e5 to get AVERAGE QPS.\n\n3. ACCOUNT FOR PEAK. Traffic isn't flat — it clusters. Multiply average by a peak factor (commonly 2-3x, higher for spiky events) to size for the worst normal moment, not the average. You provision for peak.\n\n4. SIZE EACH RESOURCE and find the BOTTLENECK. From QPS and per-item sizes, derive storage/day and /year, bandwidth (QPS x payload), memory for caches (fit the hot set), and server count (peak QPS / per-server capacity). The resource that runs out FIRST is your bottleneck — that's what the design must attack.\n\nThe skill rides on a handful of memorized numbers: ~1e5 seconds/day; powers of two as sizes (2^10 KB, 2^20 MB, 2^30 GB, 2^40 TB); and the classic LATENCY NUMBERS (memory read ~100ns, SSD ~100us, network round-trip within a datacenter ~0.5ms, disk seek ~10ms, packet round-trip across the world ~150ms). These let you sanity-check any design in your head.",
    technicalDeep: "Numbers to memorize (Jeff Dean's 'Numbers Everyone Should Know', rounded):\n  L1 cache reference           ~1 ns\n  Branch mispredict            ~5 ns\n  L2 cache reference           ~7 ns\n  Mutex lock/unlock            ~25 ns\n  Main memory reference        ~100 ns\n  Compress 1KB (fast)          ~1-3 us\n  Send 1KB over 1Gbps net      ~10 us\n  SSD random read              ~100 us  (~16us on NVMe today)\n  Read 1MB sequentially, RAM   ~10-30 us\n  Round trip within a datacenter ~0.5 ms\n  Read 1MB sequentially, SSD   ~200 us - 1 ms\n  Disk seek (spinning)         ~10 ms\n  Read 1MB sequentially, disk  ~5-20 ms\n  Packet CA -> Netherlands -> CA ~150 ms\nThe key ratios: memory is ~100-1000x faster than SSD, SSD ~100x faster than a disk seek, and a cross-continent round trip dwarfs everything — which is WHY caching, locality, and avoiding chatty cross-region calls matter.\n\nUnits & powers of two: 2^10 = 1 thousand (KB), 2^20 = 1 million (MB), 2^30 = 1 billion (GB), 2^40 = 1 trillion (TB), 2^50 = PB. A char/ASCII byte = 1B; a typical UUID = 16B; an int = 4B; a timestamp = 8B; a short tweet = ~200-300B; a small JSON record = ~1KB. Time: 86,400 s/day ≈ 1e5; ~2.6e6 s/month; ~3.15e7 s/year.\n\nEstimation discipline: round aggressively to one significant figure — you want an answer that's right within an order of magnitude, fast. Always compute AVERAGE then PEAK (peak = average x peak-factor, 2-10x). Distinguish READ QPS from WRITE QPS (read/write ratio drives replica vs shard decisions). For storage, multiply record size x records/day x retention, then add indexes/replication overhead (x3 for 3 replicas). For memory, apply the 80/20 rule: cache the hot 20% that serves 80% of reads. For servers: peak QPS / (per-server QPS capacity), then add headroom (never plan to run at 100%; target ~50-70%).\n\nWhere it's really used: this is not interview theater — SREs do exactly this for provisioning and autoscaling limits, and it's the sanity check that catches 'wait, that's 40 petabytes a day, that can't be right' before it becomes a design.",
    whatBreaks: "Sizing for AVERAGE instead of PEAK: you provision for the mean, then rush hour hits at 3x and everything queues and times out. Forgetting replication/index overhead in storage: your '1TB' of raw data is 3TB+ with 3x replication and another chunk for indexes — you under-buy disks. Mixing bits and bytes, or fumbling powers of two: an off-by-1000 (KB vs MB) or bits/bytes error throws the whole estimate off by orders of magnitude. Ignoring the read/write ratio: a 100:1 read-heavy system and a write-heavy one need completely different architectures (replicas vs sharding); a single 'QPS' number hides that. Over-precision: agonizing over 86,400 vs 100,000, or carrying five significant figures, wastes interview time and adds false confidence — round hard. Not identifying the bottleneck: computing every number but never saying which resource runs out first, so the design doesn't actually target the real constraint. Assuming linear scaling: doubling servers rarely doubles capacity once a shared database or lock becomes the ceiling.",
    efficientWay: {
      title: 'Estimating what a system needs before building it',
      approaches: [
        { name: 'DAU -> QPS -> peak -> per-resource -> bottleneck, rounded to 1 sig fig', verdict: 'best', reason: 'The standard disciplined method: it starts from the one number you actually know (users), separates average from peak, sizes every resource, and ends by naming the bottleneck the design must attack. Fast, defensible, and what interviewers and SREs expect.' },
        { name: 'Load testing / measuring a prototype', verdict: 'ok', reason: 'The most accurate answer when you already have code or a similar system to measure — real numbers beat guesses. But it needs something built and time to run, so it can not replace the up-front napkin math that shapes the design in the first place.' },
        { name: 'Guessing a server count with no arithmetic', verdict: 'weak', reason: 'Pulling numbers out of the air with no chain from users to resources gives an answer you can not defend or adjust, and it hides the bottleneck entirely. It is the thing this whole skill exists to replace.' },
      ],
      recommendation: "Anchor every estimate to users and work forward: DAU -> actions/day -> average QPS (divide by ~1e5 s/day) -> peak QPS (x a 2-10x peak factor) -> size storage, bandwidth, memory, and server count -> name the bottleneck. Round to a single significant figure and memorize the anchors (1e5 s/day, powers of two, the latency numbers) so the arithmetic is instant. Always split read QPS from write QPS, and always add replication and index overhead to storage. When you have a real prototype, validate the napkin math with a load test — but do the math first, because it's what tells you where to even point the test.",
    },
    commonMistakes: [
      "Provisioning for average traffic and getting crushed at peak because no peak factor (2-10x) was applied",
      "Forgetting replication and index overhead, so real storage is 3x+ the raw data estimate and disks are under-bought",
      "Confusing bits vs bytes or KB vs MB (powers of two), throwing the estimate off by orders of magnitude",
      "Computing every number but never stating which resource is the bottleneck, so the design doesn't target the real constraint",
    ],
    seniorNotes: "Seniors treat estimation as a thinking tool, not a party trick: the point isn't the exact number, it's discovering the BOTTLENECK and the read/write shape early so the architecture is aimed at the real constraint. Two habits separate strong candidates. First, they state assumptions out loud and round hard ('call it 100M DAU, 10 reads each, ~1e5 seconds/day, so ~1e4 read QPS average, ~3e4 peak') so the interviewer can correct an input rather than watch them chase precision. Second, they immediately translate numbers into DECISIONS: '30k read QPS but only 100 write QPS means read replicas and heavy caching, not sharding — yet' or 'this hot set is 50GB, fits in RAM, so cache it and the DB is barely touched.' They also know the failure mode of linear extrapolation — capacity flattens once a shared DB, lock, or single-writer becomes the ceiling — so they plan for the resource that saturates first. And they keep headroom: nobody sane provisions for 100% utilization; you target ~50-70% and let autoscaling absorb the rest.",
    interviewQuestions: [
      "Roughly how many seconds are in a day, and why does that number matter for estimation?",
      "Walk me through estimating QPS and storage for a URL shortener with 100M new URLs/day.",
      "Why do you size for peak instead of average, and how do you pick the peak factor?",
      "Give me the rough latency numbers for memory, SSD, a datacenter round trip, and a cross-continent round trip — and why they matter.",
      "You estimate a system's resource needs. How do you find and use the bottleneck?",
    ],
    interviewAnswers: [
      "About 86,400, which I round to ~1e5 (100,000) for mental math. It matters because it's the constant that converts daily volume into per-second load: total actions per day divided by ~1e5 gives average QPS, which is the number that actually sizes servers and databases. Rounding 86,400 to 1e5 keeps the arithmetic instant and the answer stays within an order of magnitude.",
      "100M new URLs/day / ~1e5 s/day = ~1,000 write QPS average, so ~2-3k at peak. Reads dominate a shortener — assume ~100:1 read/write, so ~100k read QPS average, a few hundred thousand at peak. Storage: each record is a short code + long URL + metadata, call it ~500 bytes; 100M/day x 500B = ~50GB/day, ~18TB/year raw, and ~50TB+/year with 3x replication and indexes. So the design needs heavy read caching (the hot set easily fits in RAM), and writes are modest — the bottleneck is read throughput and cache hit rate, not write capacity.",
      "Because traffic isn't flat — it clusters at peak hours, launches, and events — and if I provision for the average, the peak (often 2-3x, more for spiky workloads) overwhelms the system and requests queue and time out. So I size for the worst normal moment: peak QPS = average x peak factor. I pick the factor from the traffic shape: ~2-3x for steady consumer apps, higher (5-10x) for event-driven spikes like ticket sales or a viral moment, and I add headroom on top so I'm not running at 100%.",
      "Roughly: main memory reference ~100ns, SSD random read ~100us (so SSD is ~1000x slower than RAM), a round trip within a datacenter ~0.5ms, and a cross-continent round trip ~150ms. They matter because they set the ceiling on any design: memory is orders of magnitude faster than SSD which is orders faster than a disk seek, and a cross-region round trip dwarfs local work — which is exactly why we cache in RAM, keep data local, and avoid chatty cross-region calls. If a design implies a cross-continent hop per request, those 150ms are a red flag.",
      "I size each resource — read QPS, write QPS, storage/day, bandwidth, memory for the hot set, server count — and the bottleneck is whichever one saturates first at peak. Then I point the architecture at THAT: if read QPS is the ceiling, add replicas and caching; if write throughput or data size is, shard; if memory for the hot set is, size the cache tier. Naming the bottleneck is the whole payoff of the estimate — it turns arithmetic into an architectural decision instead of a pile of numbers.",
    ],
    codeExamples: [
      {
        lang: 'text',
        label: 'Worked estimation: a Twitter-style news feed',
        code: "PROMPT: design a news feed. Assume 100M DAU.\n\nSTEP 1 - USERS -> ACTIONS\n  Reads:  each user opens the feed ~10x/day        -> 100M x 10  = 1e9 reads/day\n  Writes: each user posts ~0.1 tweets/day          -> 100M x 0.1 = 1e7 writes/day\n  Read/write ratio ~ 100:1  (READ-HEAVY -> caching + fan-out on write)\n\nSTEP 2 - PER-SECOND (divide by ~1e5 s/day)\n  Read QPS  (avg) = 1e9 / 1e5 = 10,000 QPS\n  Write QPS (avg) = 1e7 / 1e5 = 100 QPS\n\nSTEP 3 - PEAK (x3 peak factor)\n  Read QPS  (peak) ~ 30,000\n  Write QPS (peak) ~ 300\n\nSTEP 4 - STORAGE (tweets)\n  Tweet size: text ~200B + metadata (ids, ts) ~100B  = ~300B\n  Per day : 1e7 x 300B = 3e9 B = ~3 GB/day (raw text)\n  Per year: ~1.1 TB/year raw;  x3 replication + indexes ~ 3-4 TB/year\n  (Media is stored in blob storage/CDN, not the tweet DB - size that separately.)\n\nSTEP 5 - MEMORY (cache the hot feeds)\n  Hot set = ~active users' recent timelines. Say cache 200 tweets x 300B\n  per active user for the top 20M users: 20M x 200 x 300B = 1.2e12 B ~ 1.2 TB.\n  Too big for one box -> a distributed cache tier (sharded Redis), not one node.\n\nSTEP 6 - SERVERS (app tier)\n  Assume ~1,000 QPS/app-server. Peak read 30k / 1,000 = ~30 servers,\n  target ~60% utilization -> ~50 servers + headroom.\n\nBOTTLENECK: read throughput + feed cache, NOT writes or raw storage.\n  -> Design: fan-out-on-write into per-user timeline caches, heavy Redis\n     caching, read replicas. Writes (300 QPS) are trivial; don't shard for them\n     yet. Media offloaded to CDN. Revisit sharding when data/writes grow 10x.",
      },
      {
        lang: 'typescript',
        label: 'The estimation formulas as reusable helpers',
        code: "// The four-move method, in code you can sanity-check any design with.\nconst SECONDS_PER_DAY = 1e5      // 86,400 rounded for mental math\nconst KB = 2 ** 10, MB = 2 ** 20, GB = 2 ** 30, TB = 2 ** 40\n\nfunction averageQps(actionsPerDay: number): number {\n  return actionsPerDay / SECONDS_PER_DAY\n}\n\nfunction peakQps(avgQps: number, peakFactor = 3): number {\n  return avgQps * peakFactor    // provision for peak, never the average\n}\n\nfunction storagePerYear(recordsPerDay: number, bytesPerRecord: number, replicas = 3): number {\n  const rawPerYear = recordsPerDay * bytesPerRecord * 365\n  return rawPerYear * replicas  // + index overhead on top in practice\n}\n\nfunction serversNeeded(peakQps: number, qpsPerServer: number, targetUtil = 0.6): number {\n  return Math.ceil(peakQps / (qpsPerServer * targetUtil)) // headroom baked in\n}\n\n// News feed, 100M DAU, 10 reads/user/day:\nconst readsPerDay = 100e6 * 10                 // 1e9\nconst rAvg = averageQps(readsPerDay)           // 10,000 read QPS\nconst rPeak = peakQps(rAvg)                     // 30,000 read QPS\nconst yearlyBytes = storagePerYear(1e7, 300)   // ~3.3 TB/yr with 3x replicas\nconst appServers = serversNeeded(rPeak, 1000)  // ~50 servers at 60% util\n// Bottleneck check: rPeak (30k) dwarfs write peak (~300) -> optimize reads.",
      },
    ],
  },
]

/**
 * Spaced-repetition flashcards for the scale & performance topics, keyed by
 * topic id. Prefixes: repl_ / chash_ / coord_ / cap_.
 */
export const BACKEND_SCALE_FLASHCARDS: FlashcardData = {
  'db-replication': [
    {
      id: 'repl_reads_not_writes',
      q: "Do read replicas scale writes? Why or why not?",
      a: "No. Every write must be applied on every replica to keep them consistent, so adding replicas multiplies READ capacity only. When writes (or data size) exceed one machine, you shard, not replicate.",
      hint: "Every replica still applies every write.",
    },
    {
      id: 'repl_sync_vs_async',
      q: "Synchronous vs asynchronous replication — the core tradeoff?",
      a: "Async: primary commits and replies immediately, ships changes in the background — fast writes but replicas lag and a crash can lose the untransmitted tail. Sync: primary waits for a replica's ack before confirming — no data loss on failover but slower writes. Semi-sync (wait for at least one) is the common middle ground.",
      hint: "Latency vs durability.",
    },
    {
      id: 'repl_read_your_writes',
      q: "A user saves a change then reloads and sees the OLD value. What is it and one fix?",
      a: "Replication lag causing a read-your-writes violation: the write hit the primary but the reload read a not-yet-caught-up replica. Fix: route that user's reads to the primary for a few seconds after a write, or gate replica reads on the write's log position (LSN/GTID).",
      hint: "The replica hadn't caught up yet.",
    },
    {
      id: 'repl_split_brain',
      q: "What is split-brain in failover and how do you prevent it?",
      a: "A partition (or a returning old primary) leaves two nodes both thinking they're leader, both accepting conflicting writes. Prevent it with quorum-based election, fencing/STONITH to demote the old primary, and leases so a leader that can't renew steps down.",
      hint: "Two primaries at once.",
    },
    {
      id: 'repl_vs_sharding',
      q: "Replication vs sharding — when each?",
      a: "Replication copies the WHOLE dataset to every node: scales reads and availability. Sharding partitions the data across nodes: scales writes and storage. They compose — shard for write/size scale, replicate each shard for read scale and HA.",
      hint: "Copy everything vs split the data.",
    },
  ],
  'consistent-hashing': [
    {
      id: 'chash_modulo_problem',
      q: "Why does hash(key) % N break when N changes?",
      a: "Changing N changes the divisor, so almost every key remaps — about (N-1)/N of ALL keys move. For a cache that's a near-total miss storm; for a sharded DB it's re-copying the whole dataset.",
      hint: "The divisor changes for every key.",
    },
    {
      id: 'chash_ring',
      q: "How does the hash ring minimize key movement on add/remove?",
      a: "Nodes and keys hash to points on a circle; each key belongs to the next node clockwise. Adding or removing a node only moves the keys in that node's arc — on average K/N keys — leaving all others untouched.",
      hint: "Walk clockwise to the next node.",
    },
    {
      id: 'chash_vnodes',
      q: "What problem do virtual nodes solve?",
      a: "One point per server gives uneven arcs (hot shards) and dumps a dead node's whole load onto one neighbor. Virtual nodes give each server many scattered points (~100-200), evening out load and spreading a failed node's work across many neighbors.",
      hint: "Many small arcs per server.",
    },
    {
      id: 'chash_replica_bug',
      q: "Placing K replicas on the ring — the subtle bug?",
      a: "Naively taking the next K ring POINTS can pick several virtual nodes of the SAME physical server, so 'replicas' secretly share a machine. Fix: walk clockwise and take the next K DISTINCT physical nodes.",
      hint: "Skip vnodes of a machine you already picked.",
    },
    {
      id: 'chash_hot_key',
      q: "Does consistent hashing fix a single hot key?",
      a: "No. It balances the KEYSPACE, but one viral key hashes to a single point and overloads its one owner. Hot keys need separate handling: replicate that key across nodes, cache it, or split it into sub-keys.",
      hint: "Keyspace balance, not per-key balance.",
    },
  ],
  'distributed-coordination': [
    {
      id: 'coord_hard',
      q: "Why is distributed coordination fundamentally hard?",
      a: "A node can't tell a CRASHED peer from a merely SLOW or partitioned one — a missing response could mean either. Failure detection is only a timeout guess, which is why naive designs split-brain: each side assumes the other is gone and both take charge.",
      hint: "Crashed vs slow are indistinguishable.",
    },
    {
      id: 'coord_raft_majority',
      q: "How does Raft guarantee at most one leader?",
      a: "A candidate needs votes from a MAJORITY, and each node votes at most once per term. Any two majorities of the same cluster overlap in at least one node, and that node won't vote twice — so two leaders can't both get a majority in one term.",
      hint: "Two majorities must overlap.",
    },
    {
      id: 'coord_quorum',
      q: "What does R + W > N guarantee?",
      a: "The read quorum and write quorum overlap in at least one replica, so every read sees at least one node that has the latest acknowledged write — no stale read past an acknowledged write. Tune R and W per workload (e.g. N=3,W=3,R=1 for cheap reads).",
      hint: "Read set and write set must overlap.",
    },
    {
      id: 'coord_fencing',
      q: "Why is a plain Redis lock unsafe, and what fixes it?",
      a: "A holder can pause (GC/VM freeze) past the lock's TTL while still thinking it holds it; the lock expires, another client acquires it, and the paused client wakes and writes — corruption. Fix: fencing tokens — a monotonically increasing number; the resource rejects any write with a token lower than the highest it has seen.",
      hint: "A monotonically increasing number the resource checks.",
    },
    {
      id: 'coord_when_needed',
      q: "When do you need consensus vs avoid it?",
      a: "Need it for the small set of must-agree decisions where split-brain is catastrophic: leader election, membership, config, correctness locks. Avoid it on the hot path and for bulk data — each decision costs a majority round-trip — using eventual consistency, quorums, or partitioning instead. Keep the must-agree core as small as possible.",
      hint: "Small rare decisions, not bulk throughput.",
    },
  ],
  'capacity-planning': [
    {
      id: 'cap_seconds_per_day',
      q: "Seconds in a day for estimation, and why it matters?",
      a: "~86,400, rounded to ~1e5 (100,000) for mental math. It converts daily volume into per-second load: daily actions / ~1e5 = average QPS, the number that sizes servers and databases.",
      hint: "Round 86,400 up to 1e5.",
    },
    {
      id: 'cap_peak',
      q: "Why size for peak, not average, and how to pick the factor?",
      a: "Traffic clusters, so provisioning for the mean gets crushed at rush hour. Peak QPS = average x peak factor: ~2-3x for steady consumer apps, 5-10x for spiky events — plus headroom so you're not at 100% utilization.",
      hint: "Provision for the worst normal moment.",
    },
    {
      id: 'cap_latency_numbers',
      q: "Rough latency: memory, SSD, datacenter RTT, cross-continent RTT?",
      a: "Main memory ~100ns; SSD random read ~100us (~1000x slower than RAM); datacenter round trip ~0.5ms; cross-continent round trip ~150ms. They set the ceiling — why we cache in RAM, keep data local, and avoid chatty cross-region calls.",
      hint: "ns -> us -> sub-ms -> ~150ms.",
    },
    {
      id: 'cap_storage_overhead',
      q: "Estimating storage — what's commonly forgotten?",
      a: "Replication and index overhead. Raw = record size x records/day x retention, but real usage is ~3x for 3 replicas plus extra for indexes. A '1TB' dataset is really 3TB+ on disk.",
      hint: "Multiply raw by replica count, add indexes.",
    },
    {
      id: 'cap_bottleneck',
      q: "The whole payoff of an estimate is what?",
      a: "Naming the BOTTLENECK — whichever resource (read QPS, write QPS, storage, memory, servers) saturates first at peak — then pointing the architecture at it: replicas+caching for read ceilings, sharding for write/size ceilings, a bigger cache tier for hot-set memory.",
      hint: "Whichever resource runs out first.",
    },
  ],
}
