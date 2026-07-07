import type { Cheatsheet } from '@/types'

/** Mobile development quick-reference cheat sheets — framework-agnostic, Android vs iOS side by side. */
export const MOBILE_CHEATSHEETS: Cheatsheet[] = [
  {
    id: 'app-lifecycle-reference',
    title: 'App & Screen Lifecycle',
    subtitle: 'The callbacks that fire as your app moves through its states — Android vs iOS',
    icon: '🔄',
    sections: [
      {
        heading: 'Android — Activity lifecycle callbacks',
        entries: [
          { label: 'onCreate()', value: 'Screen is being created — inflate UI, restore saved state. Runs once per instance.' },
          { label: 'onStart()', value: 'Screen becomes visible but not yet interactive.' },
          { label: 'onResume()', value: 'Screen is in the foreground and receiving input. The app is now "running".' },
          { label: 'onPause()', value: 'Something is partially covering the screen — pause animations, commit lightweight state. Keep it fast.' },
          { label: 'onStop()', value: 'Screen fully hidden — release heavier resources, persist data that must survive.' },
          { label: 'onDestroy()', value: 'Screen is being torn down (finish or config change). Final cleanup.' },
          { label: 'onSaveInstanceState()', value: 'Bundle out transient UI state before possible process death.' },
        ],
      },
      {
        heading: 'iOS — UIViewController / scene lifecycle',
        entries: [
          { label: 'viewDidLoad()', value: 'View hierarchy loaded into memory — one-time setup. The rough analog of onCreate.' },
          { label: 'viewWillAppear()', value: 'View is about to become visible — refresh data that may have changed.' },
          { label: 'viewDidAppear()', value: 'View is on screen and interactive — start animations, analytics timers.' },
          { label: 'viewWillDisappear()', value: 'View is about to leave — commit edits, pause work.' },
          { label: 'sceneDidEnterBackground()', value: 'App left the foreground — snapshot state, stop expensive work before suspension.' },
          { label: 'sceneWillEnterForeground()', value: 'Returning to foreground — undo backgrounding, refresh stale UI.' },
        ],
      },
      {
        heading: 'Mental model',
        entries: [
          { label: 'Foreground / Background / Suspended', value: 'Every mobile OS models the same three coarse states; the callbacks above are just the transitions between them.' },
          { label: 'Process death', value: 'A backgrounded app can be killed at any time to reclaim memory. Restoring feels seamless only if you saved state.' },
          { label: 'Golden rule', value: 'Never do slow work (disk, network) in a pause/background callback — the system may freeze or kill you mid-call.' },
          { label: 'Symmetry', value: 'Acquire in onStart/viewWillAppear, release in onStop/viewWillDisappear. Matched pairs prevent leaks.' },
        ],
      },
    ],
  },
  {
    id: 'performance-jank-checklist',
    title: 'Performance & Jank Checklist',
    subtitle: 'Hit the frame budget every frame or users feel it',
    icon: '⚡',
    sections: [
      {
        heading: 'The frame budget',
        entries: [
          { label: '60 fps = 16.67 ms', value: 'You have ~16 ms per frame to run input, layout, draw, and hand off to the GPU. 120 fps halves that to ~8 ms.' },
          { label: 'Jank', value: 'A dropped frame — work overran the budget so the screen shows the same frame twice. The eye reads it as a stutter.' },
          { label: 'Measure, do not guess', value: 'Use a frame profiler (Android GPU rendering bars, Instruments Core Animation) before optimizing anything.' },
        ],
      },
      {
        heading: 'Keep the main thread free',
        entries: [
          { label: 'Never block the UI thread', value: 'No disk reads, JSON parsing, image decoding, or network on the main thread. Move it to a background thread or coroutine.' },
          { label: 'Decode images off-thread', value: 'Decode and downsample to display size in the background; hand only the ready bitmap to the UI.' },
          { label: 'Debounce & batch', value: 'Coalesce rapid events (scroll, text change) so you do work once, not per event.' },
        ],
      },
      {
        heading: 'Lists that scroll smoothly',
        entries: [
          { label: 'Virtualize', value: 'Recycle views for only the visible window (RecyclerView, UICollectionView, virtualized lists) — never render the whole dataset.' },
          { label: 'Stable keys / IDs', value: 'Give each item a stable identity so the framework can diff and reuse instead of rebuilding.' },
          { label: 'Flatten hierarchy', value: 'Deep nested layouts cost measure/layout passes. Prefer flat, constraint-based layouts.' },
          { label: 'Avoid work in bind', value: 'No allocation, formatting, or I/O inside the per-row bind callback — precompute it.' },
        ],
      },
      {
        heading: 'Rendering discipline',
        entries: [
          { label: 'Reduce overdraw', value: 'Do not paint pixels that get covered. Remove redundant backgrounds; audit with overdraw debug tools.' },
          { label: 'Density independence', value: 'Size in dp/pt, not raw pixels, so layouts hold across screen densities.' },
          { label: 'Offload to the GPU', value: 'Animate transform/opacity (compositor-friendly) rather than properties that force relayout.' },
          { label: 'Cold-start budget', value: 'Defer non-critical init off the startup path; show first frame fast, hydrate the rest after.' },
        ],
      },
    ],
  },
  {
    id: 'permissions-reference',
    title: 'Permissions Quick Reference',
    subtitle: 'Request the minimum, at the right moment, and handle every answer',
    icon: '🔐',
    sections: [
      {
        heading: 'The request flow',
        entries: [
          { label: 'Declare', value: 'List the permission in the manifest / Info.plist with a clear usage string. No declaration, no prompt.' },
          { label: 'Check before use', value: 'Query current status right before the feature runs — users can revoke at any time.' },
          { label: 'Request in context', value: 'Ask only when the user triggers the feature (tapping the camera), never on first launch.' },
          { label: 'Handle denial', value: 'Degrade gracefully. Never dead-end; explain what the feature needs and offer a settings deep link.' },
        ],
      },
      {
        heading: 'Permission states',
        entries: [
          { label: 'Not determined', value: 'Never asked yet — the one chance to show the system prompt.' },
          { label: 'Granted', value: 'Allowed. May still be "while in use" only, not "always".' },
          { label: 'Denied', value: 'User said no. On many OSes a second system prompt will not appear — you must route to Settings.' },
          { label: 'Restricted / limited', value: 'Parental controls or partial access (e.g. limited photo selection). Handle the reduced scope.' },
        ],
      },
      {
        heading: 'Sensitive permissions',
        entries: [
          { label: 'Location', value: 'Prefer "while in use" over "always". Foreground precise vs coarse; background location triggers extra review.' },
          { label: 'Camera / Microphone', value: 'High-trust — show an in-app rationale first. Some OSes show a recording indicator you cannot hide.' },
          { label: 'Photos / Media', value: 'Prefer a system picker (no permission needed) over full-library access when you only need one file.' },
          { label: 'Notifications', value: 'Now runtime-prompted on both platforms. Ask after showing value, not on launch.' },
        ],
      },
      {
        heading: 'Anti-patterns',
        entries: [
          { label: 'Permission wall', value: 'Blocking the whole app behind a prompt on first open — the fastest way to a denial.' },
          { label: 'Over-asking', value: 'Requesting permissions you do not yet need. Each prompt spends user trust.' },
          { label: 'Ignoring revocation', value: 'Assuming a granted permission stays granted. Re-check every time.' },
        ],
      },
    ],
  },
  {
    id: 'background-execution-limits',
    title: 'Background Execution Limits',
    subtitle: 'The OS owns the battery — work with Doze, App Standby, and BGTask, not against them',
    icon: '🔋',
    sections: [
      {
        heading: 'Why limits exist',
        entries: [
          { label: 'Battery & memory', value: 'A backgrounded app competes with everything else. The OS aggressively throttles or suspends it to protect battery and RAM.' },
          { label: 'Suspended != running', value: 'Once backgrounded, your process may be frozen within seconds and killed without warning.' },
          { label: 'Design principle', value: 'Assume no background CPU by default. Ask the system for specific, bounded, deferrable windows.' },
        ],
      },
      {
        heading: 'Android limits',
        entries: [
          { label: 'Doze mode', value: 'Device idle and still: network and jobs are batched into rare maintenance windows. Deep Doze on prolonged idle.' },
          { label: 'App Standby buckets', value: 'Apps are bucketed by usage (active to rare); rarer buckets get fewer jobs and alarms.' },
          { label: 'Background service limits', value: 'You cannot freely start background services. Use WorkManager for deferrable work.' },
          { label: 'Foreground service', value: 'For user-visible ongoing work (playback, navigation) — requires a persistent notification and a declared type.' },
        ],
      },
      {
        heading: 'iOS limits',
        entries: [
          { label: 'Suspension', value: 'Apps are suspended shortly after backgrounding. No general background execution.' },
          { label: 'BGAppRefreshTask', value: 'Short, opportunistic refresh the system schedules based on usage patterns — not guaranteed timing.' },
          { label: 'BGProcessingTask', value: 'Longer maintenance work, typically while charging and idle.' },
          { label: 'Background modes', value: 'Explicit entitlements for audio, location, VoIP, etc. — only for genuinely qualifying apps.' },
        ],
      },
      {
        heading: 'Getting work done anyway',
        entries: [
          { label: 'Deferrable work', value: 'Use the OS job scheduler (WorkManager / BGTaskScheduler) with constraints (charging, unmetered, idle).' },
          { label: 'Time-critical delivery', value: 'Push notifications, not polling. Let the server wake the app when something actually changes.' },
          { label: 'Sync strategy', value: 'Coalesce syncs, set retry with backoff, and make every job idempotent — it may run late, twice, or after a restart.' },
        ],
      },
    ],
  },
  {
    id: 'mobile-security-checklist',
    title: 'Mobile Security Checklist (OWASP Mobile)',
    subtitle: 'Assume the device is hostile — protect data, credentials, and code',
    icon: '🛡️',
    sections: [
      {
        heading: 'Secure storage',
        entries: [
          { label: 'Use the keystore', value: 'Store secrets and keys in the hardware-backed Keystore / Keychain, never in plain files or SharedPreferences/UserDefaults.' },
          { label: 'No secrets in code', value: 'API keys and credentials in the binary are trivially extracted. Fetch scoped tokens from a backend instead.' },
          { label: 'Encrypt at rest', value: 'Encrypt local databases and sensitive files; tie the key to device credentials where possible.' },
          { label: 'Mind the clipboard & backups', value: 'Sensitive data can leak via clipboard, screenshots, and cloud backups. Exclude and flag accordingly.' },
        ],
      },
      {
        heading: 'Authentication & sessions',
        entries: [
          { label: 'Short-lived tokens', value: 'Use short-lived access tokens with refresh tokens; never store long-lived credentials on device.' },
          { label: 'Biometric gate', value: 'Gate sensitive actions behind biometrics, but treat biometrics as a local unlock, not server auth.' },
          { label: 'Revocation', value: 'Support server-side session revocation so a lost device can be cut off.' },
        ],
      },
      {
        heading: 'Network security',
        entries: [
          { label: 'TLS everywhere', value: 'No cleartext traffic. Enforce HTTPS and disable insecure fallback.' },
          { label: 'Certificate pinning', value: 'Pin to your cert/public key to defeat MITM via rogue CAs — with a rotation plan so pins do not brick the app.' },
          { label: 'Validate everything', value: 'Never trust client input server-side; the client is fully attacker-controlled.' },
        ],
      },
      {
        heading: 'OWASP Mobile Top 10 (themes)',
        entries: [
          { label: 'M: Improper credential usage', value: 'Hardcoded or poorly managed secrets and keys.' },
          { label: 'M: Insecure data storage', value: 'Sensitive data written unencrypted or to world-readable locations.' },
          { label: 'M: Insecure communication', value: 'Weak or missing TLS, no pinning, mixed content.' },
          { label: 'M: Insufficient binary protection', value: 'No obfuscation or tamper/root-jailbreak detection on high-risk apps.' },
          { label: 'M: Inadequate privacy controls', value: 'Collecting or leaking more personal data than the feature needs.' },
        ],
      },
    ],
  },
  {
    id: 'release-signing-checklist',
    title: 'Release & Signing Checklist',
    subtitle: 'From a signed build to a store listing without shipping a fire',
    icon: '🚀',
    sections: [
      {
        heading: 'Signing',
        entries: [
          { label: 'Android app signing', value: 'Sign the release build; enrol in Play App Signing so Google manages the upload-to-app key mapping.' },
          { label: 'iOS code signing', value: 'A distribution certificate plus a provisioning profile bind your app, team, and entitlements.' },
          { label: 'Protect the keys', value: 'Losing the signing key (or letting it leak) can lock you out of updating the app. Back it up securely, rotate carefully.' },
          { label: 'Version + build number', value: 'Bump the user-facing version and the monotonic build number every upload.' },
        ],
      },
      {
        heading: 'Build hygiene',
        entries: [
          { label: 'Release config', value: 'Strip debug flags, verbose logging, and test endpoints. Point at production config.' },
          { label: 'Shrink & obfuscate', value: 'Enable code shrinking / minification (R8, bitcode-era tooling) to cut size and raise the reversing bar.' },
          { label: 'Ship debug symbols', value: 'Upload mapping files / dSYMs so crash reports deobfuscate to readable stack traces.' },
          { label: 'App size', value: 'Use app bundles / thinning so each device downloads only the resources it needs.' },
        ],
      },
      {
        heading: 'Store submission',
        entries: [
          { label: 'Metadata & assets', value: 'Screenshots per device class, description, keywords, and a privacy policy URL.' },
          { label: 'Privacy nutrition labels', value: 'Declare exactly what data you collect and why — mismatches get apps rejected.' },
          { label: 'Review readiness', value: 'A demo account, working deep links, and no placeholder content. Explain any sensitive permissions.' },
          { label: 'Staged rollout', value: 'Release to a small percentage first; watch crash-free rate before ramping to 100%.' },
        ],
      },
      {
        heading: 'After release',
        entries: [
          { label: 'Watch crash-free rate', value: 'Set an alert threshold. A regression should halt the rollout automatically.' },
          { label: 'Have a kill switch', value: 'Feature flags or a remote config let you disable a broken feature without a new build.' },
          { label: 'Force-update path', value: 'A minimum-version gate for when a client is genuinely unsafe to keep running.' },
        ],
      },
    ],
  },
  {
    id: 'networking-resilience-patterns',
    title: 'Networking Resilience Patterns',
    subtitle: 'The network is flaky, slow, and metered — design for it',
    icon: '📶',
    sections: [
      {
        heading: 'Assume failure',
        entries: [
          { label: 'Every call can fail', value: 'Timeout, DNS failure, captive portal, dead zone, airplane mode. Handle it as the norm, not the exception.' },
          { label: 'Timeouts', value: 'Set explicit connect and read timeouts; never let a request hang the UX forever.' },
          { label: 'Retry with backoff', value: 'Retry idempotent requests with exponential backoff and jitter — never a tight retry loop.' },
          { label: 'Cancel on leave', value: 'Cancel in-flight requests when the user navigates away to save battery and avoid stale writes.' },
        ],
      },
      {
        heading: 'Perceived performance',
        entries: [
          { label: 'Optimistic UI', value: 'Apply the change locally immediately, reconcile with the server response, roll back on failure.' },
          { label: 'Skeletons over spinners', value: 'Show content-shaped placeholders so the screen feels fast and stable.' },
          { label: 'Cache-then-network', value: 'Render cached data instantly, then refresh in the background and diff.' },
          { label: 'Paginate', value: 'Cursor-based pagination and infinite scroll — never fetch an unbounded list.' },
        ],
      },
      {
        heading: 'Offline & sync',
        entries: [
          { label: 'Offline-first', value: 'Treat the local store as the source of truth for the UI; sync is a background reconciliation.' },
          { label: 'Outbox queue', value: 'Queue mutations locally and flush when connectivity returns; make each idempotent.' },
          { label: 'Conflict resolution', value: 'Decide a strategy up front — last-write-wins, version vectors, or field-level merge.' },
          { label: 'Respect metered networks', value: 'Defer large downloads to unmetered/charging; let users control cellular data use.' },
        ],
      },
      {
        heading: 'Efficiency',
        entries: [
          { label: 'Coalesce & batch', value: 'Combine requests and reuse connections; radio wakeups are expensive.' },
          { label: 'Compress & shrink payloads', value: 'gzip/brotli, request only needed fields (sparse fieldsets / GraphQL), and downscale images server-side.' },
          { label: 'Image caching', value: 'Memory + disk cache keyed by URL and size; downsample to the display resolution.' },
        ],
      },
    ],
  },
  {
    id: 'accessibility-checklist',
    title: 'Mobile Accessibility Checklist',
    subtitle: 'Usable by everyone — screen readers, large text, and one-handed reach',
    icon: '♿',
    sections: [
      {
        heading: 'Screen readers',
        entries: [
          { label: 'Label every control', value: 'Give interactive elements a meaningful accessibility label — TalkBack and VoiceOver read it aloud.' },
          { label: 'Describe, do not decorate', value: 'Mark purely decorative images as hidden from assistive tech so they are not announced.' },
          { label: 'Logical focus order', value: 'Reading order should follow the visual flow; group related content so it is announced together.' },
          { label: 'Announce changes', value: 'Use live-region / announcement APIs for async updates (errors, loaded results) the user cannot see.' },
        ],
      },
      {
        heading: 'Visual',
        entries: [
          { label: 'Dynamic type', value: 'Support the OS text-size setting; never hardcode font sizes or clip text that grows.' },
          { label: 'Contrast', value: 'Meet at least 4.5:1 for body text; do not rely on color alone to convey state.' },
          { label: 'Respect reduce-motion', value: 'Honor the system reduce-motion setting — swap large animations for fades.' },
          { label: 'Dark mode', value: 'Test both themes; ensure contrast and images hold up in each.' },
        ],
      },
      {
        heading: 'Motor & touch',
        entries: [
          { label: 'Touch target size', value: 'At least ~44-48 dp/pt hit area; add padding rather than shrinking controls.' },
          { label: 'One-handed reach', value: 'Keep primary actions in the thumb zone; do not bury them at the top on tall screens.' },
          { label: 'No timing traps', value: 'Avoid actions that require fast or precise gestures with no alternative.' },
        ],
      },
      {
        heading: 'Verify it',
        entries: [
          { label: 'Test with the real tools', value: 'Navigate the app end to end using only VoiceOver / TalkBack — not just an audit checklist.' },
          { label: 'Largest text setting', value: 'Crank system text to maximum and confirm nothing truncates or overlaps.' },
          { label: 'Automated scan + manual', value: 'Accessibility scanners catch labels and contrast; only manual testing catches broken flows.' },
        ],
      },
    ],
  },
]
