import type { Cheatsheet } from '@/types'

/** Backend quick-reference cheat sheets. */
export const BACKEND_CHEATSHEETS: Cheatsheet[] = [
  {
    id: 'http-status-codes',
    title: 'HTTP Status Codes',
    subtitle: 'The codes you set and debug every day',
    icon: '🌐',
    sections: [
      {
        heading: '2xx Success',
        entries: [
          { label: '200 OK', value: 'Standard success for GET/PUT/PATCH.' },
          { label: '201 Created', value: 'Resource created; return it + Location header (POST).' },
          { label: '202 Accepted', value: 'Accepted for async processing; not done yet.' },
          { label: '204 No Content', value: 'Success with empty body (common for DELETE).' },
        ],
      },
      {
        heading: '3xx Redirection',
        entries: [
          { label: '301 Moved Permanently', value: 'Permanent redirect; cached by clients.' },
          { label: '302 Found', value: 'Temporary redirect.' },
          { label: '304 Not Modified', value: 'Cache still valid (ETag/If-None-Match).' },
        ],
      },
      {
        heading: '4xx Client Errors',
        entries: [
          { label: '400 Bad Request', value: 'Malformed request the server can\'t parse.' },
          { label: '401 Unauthorized', value: 'Not authenticated (bad/missing credentials).' },
          { label: '403 Forbidden', value: 'Authenticated but not allowed.' },
          { label: '404 Not Found', value: 'Resource doesn\'t exist.' },
          { label: '409 Conflict', value: 'State conflict (e.g. duplicate, version mismatch).' },
          { label: '422 Unprocessable', value: 'Validation failed on well-formed input.' },
          { label: '429 Too Many Requests', value: 'Rate limited; send Retry-After.' },
        ],
      },
      {
        heading: '5xx Server Errors',
        entries: [
          { label: '500 Internal Error', value: 'Unhandled server exception.' },
          { label: '502 Bad Gateway', value: 'Upstream returned an invalid response.' },
          { label: '503 Unavailable', value: 'Overloaded or down for maintenance.' },
          { label: '504 Gateway Timeout', value: 'Upstream didn\'t respond in time.' },
        ],
      },
    ],
  },
  {
    id: 'sql-reference',
    title: 'SQL Quick Reference',
    subtitle: 'Common queries, joins, and performance',
    icon: '🗄️',
    sections: [
      {
        heading: 'Core queries',
        entries: [
          { label: 'Filter', value: 'SELECT * FROM users WHERE age > 18;', code: true },
          { label: 'Sort + limit', value: 'SELECT * FROM posts ORDER BY created_at DESC LIMIT 20;', code: true },
          { label: 'Aggregate', value: 'SELECT status, COUNT(*) FROM orders GROUP BY status;', code: true },
          { label: 'Having', value: 'GROUP BY user_id HAVING COUNT(*) > 5;', code: true },
          { label: 'Upsert', value: 'INSERT ... ON CONFLICT (id) DO UPDATE SET ...;', code: true },
        ],
      },
      {
        heading: 'Joins',
        entries: [
          { label: 'INNER JOIN', value: 'Only rows matching in both tables.' },
          { label: 'LEFT JOIN', value: 'All left rows + matches (NULLs if none).' },
          { label: 'RIGHT JOIN', value: 'All right rows + matches.' },
          { label: 'FULL OUTER', value: 'All rows from both, matched where possible.' },
        ],
      },
      {
        heading: 'Performance',
        entries: [
          { label: 'EXPLAIN ANALYZE', value: 'Show the real execution plan + timings.', code: true },
          { label: 'Index', value: 'CREATE INDEX idx_users_email ON users(email);', code: true },
          { label: 'Composite index', value: 'Order matters: (status, created_at) helps WHERE status=.. ORDER BY created_at.' },
          { label: 'Avoid', value: 'SELECT * , N+1 queries, functions on indexed columns in WHERE.' },
        ],
      },
    ],
  },
  {
    id: 'docker-k8s',
    title: 'Docker & Kubernetes',
    subtitle: 'Container and orchestration commands',
    icon: '🐳',
    sections: [
      {
        heading: 'Docker',
        entries: [
          { label: 'Build', value: 'docker build -t myapp:1.0 .', code: true },
          { label: 'Run', value: 'docker run -p 8080:80 --env-file .env myapp:1.0', code: true },
          { label: 'Logs', value: 'docker logs -f <container>', code: true },
          { label: 'Exec shell', value: 'docker exec -it <container> sh', code: true },
          { label: 'Prune', value: 'docker system prune -a  # reclaim space', code: true },
        ],
      },
      {
        heading: 'Dockerfile essentials',
        entries: [
          { label: 'Multi-stage', value: 'Build in one stage, copy only artifacts into a slim runtime image.' },
          { label: 'Layer cache', value: 'COPY package.json + install BEFORE COPY . — caches deps.' },
          { label: 'Non-root', value: 'USER node — don\'t run containers as root.' },
        ],
      },
      {
        heading: 'kubectl',
        entries: [
          { label: 'Pods', value: 'kubectl get pods -n <ns>', code: true },
          { label: 'Logs', value: 'kubectl logs -f <pod>', code: true },
          { label: 'Describe', value: 'kubectl describe pod <pod>  # events + status', code: true },
          { label: 'Rollout', value: 'kubectl rollout status deploy/<name>', code: true },
          { label: 'Rollback', value: 'kubectl rollout undo deploy/<name>', code: true },
        ],
      },
    ],
  },
  {
    id: 'git-linux',
    title: 'Git & Linux CLI',
    subtitle: 'Version control and shell survival',
    icon: '💻',
    sections: [
      {
        heading: 'Git',
        entries: [
          { label: 'Undo last commit (keep changes)', value: 'git reset --soft HEAD~1', code: true },
          { label: 'Discard local changes', value: 'git restore <file>', code: true },
          { label: 'Interactive rebase', value: 'git rebase -i HEAD~3', code: true },
          { label: 'Stash', value: 'git stash / git stash pop', code: true },
          { label: 'Who changed this line', value: 'git blame <file>', code: true },
        ],
      },
      {
        heading: 'Process & ports',
        entries: [
          { label: 'What\'s on a port', value: 'ss -tlnp | grep :8080  (or lsof -i :8080)', code: true },
          { label: 'Top processes', value: 'top / htop', code: true },
          { label: 'Kill', value: 'kill -9 <pid>', code: true },
        ],
      },
      {
        heading: 'Files & search',
        entries: [
          { label: 'Search text', value: 'grep -rn "TODO" src/', code: true },
          { label: 'Find files', value: 'find . -name "*.log" -mtime +7', code: true },
          { label: 'Tail logs', value: 'tail -f app.log', code: true },
          { label: 'Disk usage', value: 'du -sh * | sort -h', code: true },
        ],
      },
    ],
  },
]
