import type { CurriculumTopic } from '@/types'

/** Phase 8 — Security & Privacy. Concept-first, framework-agnostic mobile security. */
export const MOBILE_P8: CurriculumTopic[] = [
  {
    "id": "mobile-threat-model",
    "phase": 8,
    "phaseName": "Security & Privacy",
    "orderIndex": 1,
    "estimatedMins": 30,
    "prerequisites": [],
    "title": "The Mobile Threat Model",
    "eli5": "Your phone is a tiny computer that leaves your house every day, connects to strangers' WiFi, and can be lost or stolen. Before you can protect an app, you have to imagine all the ways a bad person could try to attack it.",
    "analogy": "A web server lives in a locked data centre with guards. A mobile app lives in the attacker's pocket. It is like the difference between defending a bank vault and defending a wallet you hand to a stranger and ask them to please not open.",
    "explanation": "A threat model is a structured list of who might attack you, what they want, and how they could get it. On mobile the defining fact is that the attacker owns the device. They can lose it, root/jailbreak it, run your app in a debugger, sniff its traffic, and pull it apart. The classic mobile threats are: device theft or loss (physical access to storage), hostile networks (public WiFi, rogue hotspots, TLS interception), malicious apps on the same device (trying to read your data), reverse engineering (unpacking your binary to steal secrets or logic), and insecure local storage (leaving tokens or PII in plain files).\n\nHow Android does it vs How iOS does it: Android runs each app in its own Linux UID sandbox with per-app data directories and a permission model; the ecosystem is open, so sideloading and rooted devices are common. iOS enforces a stricter sandbox, mandatory code signing, and a curated App Store, so the baseline is harder to tamper with but jailbreaks still exist. Both give you the same job: assume the OS protections can be bypassed and defend in depth.",
    "technicalDeep": "Model threats with STRIDE (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) mapped onto three mobile surfaces: data at rest (local DB, files, prefs, caches, logs), data in transit (every network call, including third-party SDKs you did not write), and the running app (memory, debugger hooks, instrumentation frameworks like Frida). For each asset, ask: what is its value, what is the trust boundary, and what happens if the device is fully compromised. The output is a ranked list that drives concrete controls: hardware-backed keystores for secrets, TLS with certificate/public-key pinning for transit, and a firm rule that the client is never a trusted enforcement point.\n\nHow Android does it vs How iOS does it: Android exposes the Network Security Config XML for trust anchors and cleartext policy; iOS exposes App Transport Security (ATS) which blocks plaintext HTTP by default. Both are declarative transit controls you should treat as a floor, not a ceiling.",
    "whatBreaks": "Teams model the server threats (SQL injection, auth) and forget the device is hostile. Symptoms: an API that trusts an isPremium flag sent by the client, secrets hard-coded in the binary and extracted in minutes, session tokens sitting in SharedPreferences/UserDefaults readable on a rooted phone, and analytics SDKs quietly shipping PII over plaintext. The break is rarely a single CVE; it is a missing trust boundary.",
    "efficientWay": {
      "title": "Building a mobile threat model",
      "approaches": [
        {
          "name": "Asset-and-trust-boundary model (STRIDE + MASVS)",
          "verdict": "best",
          "reason": "Enumerates assets, ranks by value, and maps each to a control. Repeatable and reviewable, and lines up with OWASP MASVS verification levels."
        },
        {
          "name": "Checklist-only security (run a scanner, fix findings)",
          "verdict": "ok",
          "reason": "Catches known issues but misses design-level trust-boundary mistakes a scanner cannot see."
        },
        {
          "name": "Trust the OS sandbox and app store review",
          "verdict": "weak",
          "reason": "Sandboxes are bypassed on rooted/jailbroken devices and store review is not a security audit. This is how secrets end up in binaries."
        }
      ],
      "recommendation": "Write a one-page threat model per app: assets, trust boundaries, top 5 threats, and the control for each. Revisit it every release. Treat the device as fully compromised and push all real enforcement to the server."
    },
    "commonMistakes": [
      "Treating the mobile client as a trusted part of the system and enforcing authorization on the device",
      "Modelling only server threats and ignoring device theft, rooted devices, and hostile WiFi",
      "Forgetting that third-party SDKs run inside your app with your permissions and network access",
      "Assuming app store review or the OS sandbox is a substitute for a threat model"
    ],
    "seniorNotes": "The single most valuable sentence you can put in a design doc is 'the client is untrusted'. Everything else follows: secrets belong on the server, authorization is re-checked server-side on every request, and anything shipped in the binary is considered public. Map your threat model to OWASP MASVS levels so 'how secure' becomes a checkable target rather than a vibe.",
    "interviewQuestions": [
      "Why is the mobile threat model fundamentally different from a server-side threat model?",
      "Walk me through how you would threat-model a banking app's login and token storage.",
      "What does 'the client is untrusted' mean in practice, and what design decisions follow from it?"
    ],
    "interviewAnswers": [
      "Because the attacker owns the runtime. On a server you control the machine; on mobile the device can be lost, rooted, debugged, and traffic-intercepted. So you assume full device compromise, treat anything in the binary as public, and move real enforcement to the server.",
      "Identify assets (credentials, session tokens, PII), boundaries (device vs network vs backend). Store tokens in the hardware-backed keystore/keychain, gate access with biometrics, pin TLS for transit, rotate refresh tokens, and re-authorize every sensitive API call server-side. Assume the device is stolen and rooted, and check nothing important survives that.",
      "It means no security decision can be trusted just because the client made it. Prices, entitlements, and permissions are validated server-side; secrets are never embedded; feature gates in the UI are convenience, not enforcement. The client can be fully rewritten by an attacker, so the server is the only authority."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "A minimal threat model table (pseudocode)",
        "code": "ASSET             THREAT                     CONTROL\n----------------  -------------------------  ------------------------------------\nsession token     device theft / rooted      hardware keystore + biometric gate\napi secret        reverse engineering        never on client; server-side only\nnetwork traffic   hostile WiFi / MITM        TLS + certificate/public-key pinning\nuser PII          malicious app on device    per-app sandbox + encrypted storage\nbusiness rules    tampered client            re-check ALL authz server-side\n\nRULE: assume device is lost, rooted, and running a debugger.\n      anything shipped in the binary == public knowledge."
      }
    ],
    "resources": [
      {
        "label": "OWASP Mobile Top 10",
        "url": "https://owasp.org/www-project-mobile-top-10/",
        "kind": "article"
      },
      {
        "label": "OWASP MASVS / MASTG (Mobile App Security)",
        "url": "https://mas.owasp.org/",
        "kind": "docs"
      },
      {
        "label": "Android Security Best Practices",
        "url": "https://developer.android.com/topic/security/best-practices",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "secure-storage-mobile",
    "phase": 8,
    "phaseName": "Security & Privacy",
    "orderIndex": 2,
    "estimatedMins": 35,
    "prerequisites": [
      "mobile-threat-model"
    ],
    "title": "Secure Storage: Keychain & Keystore",
    "eli5": "Your phone has a tiny locked safe built into the chip. You do not keep the safe's secrets in a notebook on your desk (regular app files). You put them in the safe, and even you can only ask the safe to use the secret, not read it out.",
    "analogy": "Regular app storage is a diary on your nightstand: anyone who grabs the phone and opens it can read it. The keystore is a bank safe-deposit box: the key material lives inside dedicated hardware, and you can ask it to sign or decrypt without ever taking the key out.",
    "explanation": "Mobile platforms provide a hardware-backed secure store for cryptographic keys and small secrets. The core idea: key material is generated and used inside a dedicated secure processor and never leaves it in plaintext. Your app asks the hardware to encrypt, decrypt, or sign; it does not receive the raw key. This means even a fully rooted device cannot simply copy the key out of a file.\n\nYou use it for: encryption keys that protect a local database, auth/session tokens, and anything sensitive that must persist. You must NOT put secrets in ordinary key-value preferences, plaintext files, logs, or unencrypted caches. Those are readable on a compromised device and sometimes backed up to the cloud.\n\nHow Android does it vs How iOS does it: Android uses the Android Keystore system, backed by a hardware-backed keystore (TEE) or a dedicated StrongBox secure element on newer devices; libraries like Jetpack Security (EncryptedSharedPreferences / EncryptedFile) wrap it for storing data. iOS uses the Keychain Services API, backed by the Secure Enclave for key operations, with per-item accessibility classes (for example, unlocked-this-device-only) and optional biometric access control. Same concept, two APIs: keys live in hardware, data is encrypted with keys you can only use, not extract.",
    "technicalDeep": "The pattern is envelope encryption. A key encryption key (KEK) is generated inside the secure hardware and never exported. Your app generates a data encryption key (DEK) or a random secret, encrypts your payload with it, then asks the hardware to wrap (encrypt) the DEK with the KEK, and stores only the wrapped blob in ordinary storage. To read, you hand the wrapped DEK back to the hardware to unwrap. You can bind key usage to conditions: require the device to be unlocked, require user authentication (biometric/PIN) within N seconds, or invalidate the key if biometrics change. Encryption at rest also comes for free at the OS/file level (file-based encryption tied to the user's passcode), but that protects data only while the device is locked; app-level keystore encryption protects specific secrets even while the app runs.\n\nHow Android does it vs How iOS does it: Android exposes KeyGenParameterSpec flags such as setUserAuthenticationRequired and setUnlockedDeviceRequired, and StrongBox for a discrete secure element. iOS exposes SecAccessControl flags such as biometryCurrentSet and kSecAttrAccessibleWhenUnlockedThisDeviceOnly, plus kSecAttrTokenIDSecureEnclave to force key operations into the Enclave. The knobs differ; the guarantees (non-exportable keys, auth-gated use) are equivalent.",
    "whatBreaks": "Storing a JWT or refresh token in SharedPreferences/UserDefaults 'because it was easy' — trivially dumped on a rooted phone or via device backup. Rolling your own AES with a key hard-coded in the app (the key is in the binary, so the encryption is theatre). Marking keychain items as accessible-always so they survive in backups and on locked devices. Not setting ThisDeviceOnly, so secrets migrate to a new device via cloud backup. Logging the decrypted secret right after reading it.",
    "efficientWay": {
      "title": "Storing a session token securely",
      "approaches": [
        {
          "name": "Hardware-backed keystore/keychain with auth-gated, device-only keys",
          "verdict": "best",
          "reason": "Key material is non-exportable, usage can require biometrics/unlock, and ThisDeviceOnly stops backup exfiltration. This is the platform's strongest guarantee."
        },
        {
          "name": "Platform crypto library (EncryptedSharedPreferences / Keychain wrapper) with defaults",
          "verdict": "ok",
          "reason": "Much better than plaintext and quick to adopt, but default accessibility/auth settings may be looser than you want. Review the flags."
        },
        {
          "name": "Plaintext prefs, or custom AES with a hard-coded key",
          "verdict": "weak",
          "reason": "A hard-coded key ships in the binary and plaintext prefs are readable on a rooted device. This provides no real protection."
        }
      ],
      "recommendation": "Use the hardware-backed store via the platform's security library. Bind sensitive keys to user authentication, mark them device-only so they never leave in a backup, and store only wrapped/encrypted blobs in ordinary storage."
    },
    "commonMistakes": [
      "Putting tokens or PII in SharedPreferences / UserDefaults or plaintext files",
      "Hard-coding an encryption key in the app and calling the result 'encrypted'",
      "Leaving keychain items accessible-always so they survive in cloud backups and while locked",
      "Logging or caching the decrypted secret immediately after reading it from the secure store"
    ],
    "seniorNotes": "Push key operations into the secure hardware rather than pulling raw keys into app memory — a Secure Enclave / StrongBox key that can sign but never be read defeats a whole class of memory-scraping attacks. Decide your accessibility class deliberately: device-only stops backup exfiltration but also means the secret cannot be restored, which is usually correct for session tokens (they should just be re-issued after a device swap). Treat OS file-based encryption as protection-while-locked, not protection-while-running.",
    "interviewQuestions": [
      "What guarantee does a hardware-backed keystore give that a plaintext file plus AES does not?",
      "Why is storing a hard-coded encryption key in the app pointless, and what do you do instead?",
      "What is the difference between OS-level encryption at rest and app-level keystore encryption?"
    ],
    "interviewAnswers": [
      "The key material is generated and used inside dedicated secure hardware and is non-exportable, so even root cannot copy it out. You can also require biometrics/unlock for each use. AES with a key sitting in a file just moves the problem to protecting that key, which the file does not do.",
      "A hard-coded key ships inside the binary, so anyone who unpacks the app has it and can decrypt everything — the encryption is theatre. Instead generate the key inside the keystore/enclave where it is non-exportable, and encrypt with a key you can use but never read.",
      "OS encryption at rest protects the whole filesystem while the device is locked and is tied to the passcode; it does nothing once the app is unlocked and running. App-level keystore encryption protects specific secrets with an auth-gated, non-exportable key even while the app is active."
    ],
    "codeExamples": [
      {
        "lang": "kotlin",
        "label": "Android Keystore: non-exportable, auth-gated key",
        "code": "// Generate a key that lives in hardware and requires the device unlocked\nval spec = KeyGenParameterSpec.Builder(\n    \"session_key\",\n    KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT\n)\n    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)\n    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)\n    .setUserAuthenticationRequired(true)   // gate use behind biometrics/PIN\n    .setUnlockedDeviceRequired(true)       // only usable while unlocked\n    .setIsStrongBoxBacked(true)            // dedicated secure element if present\n    .build()\n\nval kg = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, \"AndroidKeyStore\")\nkg.init(spec)\nkg.generateKey() // key never leaves the secure hardware in plaintext\n\n// DO NOT: prefs.edit().putString(\"token\", jwt).apply()  // readable on rooted device"
      },
      {
        "lang": "swift",
        "label": "iOS Keychain: device-only, biometry-gated item",
        "code": "// Store a token in the Keychain, bound to biometrics and this device only\nlet access = SecAccessControlCreateWithFlags(\n    nil,\n    kSecAttrAccessibleWhenUnlockedThisDeviceOnly, // not restored to a new device\n    .biometryCurrentSet,                          // invalidated if biometrics change\n    nil\n)!\n\nlet query: [String: Any] = [\n    kSecClass as String: kSecClassGenericPassword,\n    kSecAttrAccount as String: \"session_token\",\n    kSecValueData as String: tokenData,\n    kSecAttrAccessControl as String: access\n]\nSecItemAdd(query as CFDictionary, nil)\n\n// DO NOT: UserDefaults.standard.set(jwt, forKey: \"token\") // plaintext, in backups"
      }
    ],
    "resources": [
      {
        "label": "Android Security Best Practices",
        "url": "https://developer.android.com/topic/security/best-practices",
        "kind": "docs"
      },
      {
        "label": "Apple Security Framework (Keychain, Secure Enclave)",
        "url": "https://developer.apple.com/documentation/security",
        "kind": "docs"
      },
      {
        "label": "OWASP MASVS / MASTG",
        "url": "https://mas.owasp.org/",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "mobile-auth",
    "phase": 8,
    "phaseName": "Security & Privacy",
    "orderIndex": 3,
    "estimatedMins": 40,
    "prerequisites": [
      "secure-storage-mobile"
    ],
    "title": "Authentication & Token Storage on Mobile",
    "eli5": "When you log in, the app gets a special stamp that proves who you are so you do not have to type your password on every screen. The trick is keeping that stamp safe, and getting a fresh one before the old one expires, without ever letting a thief copy it.",
    "analogy": "Auth on mobile is like a theme-park wristband. Logging in is showing your ID once at the gate; the wristband (access token) gets you on rides for a few hours; a separate re-entry pass (refresh token) lets you get a new wristband without going back to the ID desk. You keep both in a zipped, locked pouch (the keystore), not clipped to your bag where anyone can grab them.",
    "explanation": "Mobile auth almost always uses OAuth2 / OpenID Connect (OIDC). The app does not handle the user's password directly; it hands off to an authorization server (often in a system browser), gets back an authorization code, and exchanges it for tokens: a short-lived access token used on API calls, and a longer-lived refresh token used to get new access tokens. The critical mobile rule is to use the Authorization Code flow with PKCE (Proof Key for Code Exchange), which protects the code exchange on a public client that cannot keep a client secret.\n\nOnce you have tokens you must store them in the hardware-backed keystore/keychain, never in plaintext prefs. You gate access to sensitive tokens behind biometrics, rotate refresh tokens on every use so a stolen one is quickly useless, and handle session state: silent refresh when the access token expires, forced re-auth when the refresh token is revoked or expired, and a clean logout that deletes tokens from secure storage and revokes them server-side.\n\nHow Android does it vs How iOS does it: Android uses Custom Tabs (a system browser surface) for the OAuth redirect plus AppAuth for the flow, and BiometricPrompt to gate token use. iOS uses ASWebAuthenticationSession for the redirect and LocalAuthentication (Face ID / Touch ID) to gate access. Both deliberately use a system browser, not an embedded WebView, so the app never sees the user's credentials.",
    "technicalDeep": "PKCE works by having the client generate a random code_verifier, send its SHA-256 hash (code_challenge) with the authorization request, and later present the raw verifier during the token exchange; the server checks they match, so an intercepted authorization code is useless without the verifier. Redirects come back via a claimed HTTPS App Link / Universal Link (preferred over custom URL schemes, which other apps can hijack). Refresh token rotation means each refresh returns a new refresh token and invalidates the old one; if an old (already-used) refresh token appears, the server treats it as theft and revokes the whole chain. Access tokens should be short-lived (minutes to an hour) so revocation is effectively fast even though access tokens are self-contained. Biometric gating binds the decryption of the stored refresh token to a fresh biometric check via the keystore's user-authentication requirement.\n\nHow Android does it vs How iOS does it: Android verifies redirect ownership with App Links (assetlinks.json on your domain); iOS uses Universal Links (apple-app-site-association). Both prove the app owns the redirect domain so a malicious app cannot register the same redirect.",
    "whatBreaks": "Using the Implicit flow or embedding login in a WebView (the app sees the password, and tokens leak into the URL/history). Skipping PKCE on a public client so an intercepted code can be redeemed. Storing the refresh token in plaintext so device theft = permanent account takeover. Never rotating refresh tokens, so one leaked token works forever. Access tokens that live for days, making server-side revocation meaningless. Not handling the refresh-failed case, so the app spins or shows stale data instead of prompting re-login.",
    "efficientWay": {
      "title": "Designing mobile login and token handling",
      "approaches": [
        {
          "name": "OAuth2 Authorization Code + PKCE, system browser, rotating refresh tokens in the keystore",
          "verdict": "best",
          "reason": "Standard, the app never touches the password, intercepted codes are useless, stolen refresh tokens are quickly invalidated, and secrets live in hardware."
        },
        {
          "name": "Authorization Code + PKCE but tokens in app-level encrypted prefs",
          "verdict": "ok",
          "reason": "Flow is correct and much safer than plaintext, but tokens not bound to hardware/biometrics are weaker against a rooted device. Acceptable for low-risk apps."
        },
        {
          "name": "Implicit flow or WebView login with plaintext token storage",
          "verdict": "weak",
          "reason": "The app can see credentials, tokens leak via URLs/history, and plaintext storage means theft is account takeover. Deprecated for good reason."
        }
      ],
      "recommendation": "Use Authorization Code + PKCE through the system browser, claim your redirect with App/Universal Links, store tokens in the hardware keystore gated by biometrics, rotate refresh tokens, keep access tokens short-lived, and always handle refresh failure by forcing a clean re-login."
    },
    "commonMistakes": [
      "Logging in inside an embedded WebView so the app sees the user's password",
      "Skipping PKCE, or using the deprecated Implicit flow on a public client",
      "Storing access/refresh tokens in plaintext prefs instead of the keystore/keychain",
      "Never rotating refresh tokens or using long-lived access tokens that make revocation useless"
    ],
    "seniorNotes": "Treat the refresh token as the crown jewel: it is the thing worth stealing, so it gets hardware storage, biometric gating, rotation, and reuse-detection server-side. Access tokens should be short enough that you rarely need explicit revocation. Use a claimed HTTPS redirect (App/Universal Links), never a custom scheme, or a malicious app can register the same scheme and intercept your code. On logout, revoke server-side AND wipe local storage — one without the other leaves a live session or a dangling token.",
    "interviewQuestions": [
      "Why does mobile OAuth use Authorization Code with PKCE instead of the Implicit flow?",
      "How does refresh token rotation limit the damage of a stolen token?",
      "Why should the login screen open in a system browser rather than an embedded WebView?"
    ],
    "interviewAnswers": [
      "A mobile app is a public client that cannot safely hold a client secret. PKCE binds the token exchange to a per-request verifier, so an attacker who intercepts the authorization code cannot redeem it. Implicit returns tokens directly in the redirect URL where they leak into history and logs, which is why it is deprecated.",
      "With rotation, every refresh issues a new refresh token and invalidates the previous one. If a stolen token is used, the legitimate app's next refresh presents an already-used token, the server detects reuse and revokes the entire chain, so the window of abuse is one cycle instead of forever.",
      "A system browser (Custom Tabs / ASWebAuthenticationSession) keeps credentials and cookies out of the app's process, so the app never sees the password, benefits from the browser's existing session and password manager, and cannot scrape the login form. An embedded WebView is controlled by the app and can read everything the user types."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Auth Code + PKCE flow (pseudocode)",
        "code": "// 1. Client prepares PKCE pair\nverifier  = random_string(64)\nchallenge = base64url(sha256(verifier))\n\n// 2. Open SYSTEM BROWSER (not WebView) to authorize\nopenSystemBrowser(authServer + \"?response_type=code\"\n    + \"&client_id=APP\"\n    + \"&redirect_uri=https://app.example.com/cb\"  // claimed App/Universal Link\n    + \"&code_challenge=\" + challenge\n    + \"&code_challenge_method=S256\")\n\n// 3. Redirect returns an authorization code -> exchange it\ntokens = POST(authServer + \"/token\", {\n    grant_type: \"authorization_code\",\n    code: authCode,\n    code_verifier: verifier        // proves this is the same client\n})\n\n// 4. Store in hardware keystore, gate refresh token behind biometrics\nkeystore.putGated(\"refresh_token\", tokens.refresh, requireBiometric = true)\nkeystore.put(\"access_token\", tokens.access) // short-lived\n\n// 5. On 401: silently refresh; if refresh fails -> wipe + force re-login"
      }
    ],
    "resources": [
      {
        "label": "OWASP MASVS / MASTG (auth & session management)",
        "url": "https://mas.owasp.org/",
        "kind": "docs"
      },
      {
        "label": "Android Security Best Practices",
        "url": "https://developer.android.com/topic/security/best-practices",
        "kind": "docs"
      },
      {
        "label": "Apple Security Framework",
        "url": "https://developer.apple.com/documentation/security",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "owasp-mobile-top10",
    "phase": 8,
    "phaseName": "Security & Privacy",
    "orderIndex": 4,
    "estimatedMins": 35,
    "prerequisites": [
      "mobile-threat-model",
      "secure-storage-mobile"
    ],
    "title": "OWASP Mobile Top 10",
    "eli5": "Security experts collected the ten mistakes that break mobile apps most often and wrote them down as a checklist. If you avoid these ten, you have dodged the majority of real-world breaches.",
    "analogy": "It is the 'top ten reasons houses get burgled' list: unlocked doors, spare key under the mat, windows left open. None are exotic; almost every break-in is one of these. The OWASP Mobile Top 10 is that list for apps.",
    "explanation": "The OWASP Mobile Top 10 is a community-maintained, ranked list of the most common and impactful mobile security risks. It is a shared vocabulary: when a security reviewer says 'this is an M2 issue', everyone knows they mean insecure storage. The categories cover the whole app surface — credential and config handling, local storage, network transit, cryptography, authentication/authorization, input/output handling, and platform misuse.\n\nRecurring themes across the list: secrets and business logic must not live on the client (improper credential usage, insufficient supply-chain and binary protection); data at rest must be encrypted in the keystore, not dumped in prefs (insecure data storage); data in transit must use strong, validated TLS (insecure communication); crypto must use vetted algorithms and hardware keys, never home-rolled ciphers or hard-coded keys (insufficient cryptography); and authentication/authorization must be enforced server-side (insecure auth/authz).\n\nHow Android does it vs How iOS does it: The risks are platform-agnostic, but the pitfalls differ in shape. On Android, exported components (Activities/Services/ContentProviders) and implicit intents are a classic input-handling hole; on iOS, insecure URL-scheme handling and pasteboard leakage play a similar role. Both platforms fail the same categories, just through different doors.",
    "technicalDeep": "OWASP pairs the Top 10 with the MASVS (verification standard) and MASTG (testing guide), so each risk maps to concrete, testable requirements. In practice you turn the list into a pipeline: static analysis of the binary for hard-coded secrets and weak crypto, dynamic analysis for cleartext traffic and insecure storage (dump the app's data directory on a test device and grep for tokens), and manual review of trust boundaries. The high-value categories for most apps are insecure data storage, insecure communication, insufficient cryptography, and insecure authentication — they are common, easy to introduce, and high impact. Lower-frequency categories (reverse engineering, code tampering) matter most for apps with real client-side assets to protect, like financial or DRM apps.\n\nHow Android does it vs How iOS does it: Verify insecure-communication controls with Network Security Config (Android) and App Transport Security (iOS); verify storage controls by inspecting the app sandbox on a rooted/jailbroken test device on both platforms.",
    "whatBreaks": "The list is a catalogue of breaks: API keys grep-able in the binary; JWTs in SharedPreferences; TLS with disabled certificate validation 'to make dev work'; MD5/DES or ECB-mode crypto; authorization enforced only in the UI; a debuggable release build; PII leaking into logs and crash reports. Every one of these is a Top 10 category and every one shows up repeatedly in real audits.",
    "efficientWay": {
      "title": "Using the Mobile Top 10 in a real project",
      "approaches": [
        {
          "name": "Map Top 10 to MASVS requirements and automate them in CI",
          "verdict": "best",
          "reason": "Turns a list into testable gates: static scan for secrets/crypto, dynamic checks for storage/transit, run on every build so regressions are caught early."
        },
        {
          "name": "Manual pre-release security review against the Top 10 checklist",
          "verdict": "ok",
          "reason": "Catches most issues and is better than nothing, but it is periodic and depends on the reviewer's diligence, so regressions slip in between reviews."
        },
        {
          "name": "Treat the Top 10 as background reading with no process behind it",
          "verdict": "weak",
          "reason": "Awareness without verification does not prevent the exact mistakes the list describes. Knowing about insecure storage does not stop a teammate shipping a token in prefs."
        }
      ],
      "recommendation": "Adopt the Top 10 as a checklist, bind each item to a MASVS requirement, and automate the high-frequency categories (storage, transit, crypto, auth) in CI. Reserve manual review for trust-boundary and business-logic risks a scanner cannot judge."
    },
    "commonMistakes": [
      "Treating the Top 10 as trivia to memorize instead of verifiable requirements to test",
      "Focusing on exotic risks (tampering, reverse engineering) while ignoring the common ones (storage, transit, crypto)",
      "Disabling TLS validation or shipping a debuggable build during development and forgetting to revert",
      "Enforcing authorization only in the client UI, which any modified client bypasses"
    ],
    "seniorNotes": "The Top 10 is a starting point, not a compliance certificate. Use it to prioritize, then go deeper with MASVS levels appropriate to your risk (a game and a bank do not need the same bar). The categories that quietly wreck apps are the boring ones — insecure storage and insecure communication — because they are easy to get wrong and easy to regress. Wire those into CI so a well-meaning refactor cannot reintroduce them.",
    "interviewQuestions": [
      "What is the OWASP Mobile Top 10 and how is it different from the MASVS and MASTG?",
      "Which Top 10 categories do you consider highest priority for a typical consumer app, and why?",
      "How would you operationalize the Top 10 in a CI/CD pipeline?"
    ],
    "interviewAnswers": [
      "The Top 10 is a ranked awareness list of the most common mobile risks. MASVS is the verification standard that defines testable security requirements at different assurance levels, and MASTG is the testing guide that shows how to verify them. You use the Top 10 to prioritize and MASVS/MASTG to actually check.",
      "Insecure data storage, insecure communication, insufficient cryptography, and insecure authentication — they are common, easy to introduce, and high impact for apps holding user accounts and data. Reverse engineering and tampering matter more for financial or DRM apps with real client-side assets.",
      "Map each category to a check: static analysis for hard-coded secrets and weak crypto, a dynamic test that inspects the app sandbox for plaintext tokens, a check that release builds are non-debuggable with TLS validation on, and a policy gate for permissions. Run them on every build so regressions fail the pipeline."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Top 10 categories mapped to a concrete check",
        "code": "RISK (theme)                     WHAT IT LOOKS LIKE          CI/REVIEW CHECK\n-------------------------------  --------------------------  -----------------------------\nImproper credential usage        api key in the binary       static scan for secrets\nInadequate supply chain          malicious/vuln SDK          dependency + SBOM scan\nInsecure auth / authz            authz only in the UI        server-side authz tests\nInsufficient input/output val.   exported component abuse    review intents/URL schemes\nInsecure communication           TLS validation disabled     assert ATS / NetSecConfig\nInadequate privacy controls      PII in logs/analytics       log + payload inspection\nInsufficient binary protection   debuggable release build    build-flag gate\nSecurity misconfiguration        world-readable files        sandbox permission check\nInsecure data storage            token in prefs              dump sandbox, grep secrets\nInsufficient cryptography        MD5 / ECB / hard-coded key  static crypto-usage scan"
      }
    ],
    "resources": [
      {
        "label": "OWASP Mobile Top 10",
        "url": "https://owasp.org/www-project-mobile-top-10/",
        "kind": "article"
      },
      {
        "label": "OWASP MASVS / MASTG",
        "url": "https://mas.owasp.org/",
        "kind": "docs"
      },
      {
        "label": "Android Security Best Practices",
        "url": "https://developer.android.com/topic/security/best-practices",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "reverse-engineering-defense",
    "phase": 8,
    "phaseName": "Security & Privacy",
    "orderIndex": 5,
    "estimatedMins": 35,
    "prerequisites": [
      "mobile-threat-model"
    ],
    "title": "Reverse Engineering, Obfuscation & Tamper Detection",
    "eli5": "Anyone can download your app and unzip it to peek at how it works and what secrets it hides. You cannot stop them, but you can make it slow and annoying, and you can make sure a tampered copy cannot fool your server.",
    "analogy": "Shipping an app is like handing out the blueprints to your house with every key labelled. Obfuscation smudges the labels and rearranges the rooms so a thief has to work harder; tamper detection is the alarm that trips if someone rebuilds the house slightly differently. Neither makes the house un-enterable — that is why the real valuables stay in the bank (the server).",
    "explanation": "A shipped mobile app is a distributable package (an APK/AAB or an IPA) that anyone can download and unpack. Tools can disassemble the bytecode, list your classes and strings, and pull out embedded resources. This is not a bug; it is the nature of shipping code to devices. So the foundational principle is: the client is never trusted with anything whose disclosure would hurt you. No API secrets, no encryption keys, no security-critical business rules that the server does not re-check.\n\nGiven that, you still raise the cost of attack. Obfuscation renames classes/methods/fields to meaningless symbols, strips unused code, and can encrypt strings, so the disassembly is harder to read. Code shrinking removes dead code and shrinks the attack surface. Integrity/tamper detection checks that the running app is the one you signed — verifying the app signature, detecting repackaging, and refusing to run (or degrading) if it has been modified. None of this is a wall; it is friction plus a tripwire.\n\nHow Android does it vs How iOS does it: Android uses R8 (which supersedes ProGuard) for shrinking and obfuscation, configured with keep rules, and can add Play Integrity API attestation to verify a genuine, unmodified app and device. iOS benefits from a compiled, signed, encrypted binary (Swift/Obj-C compiles to machine code, and App Store binaries are FairPlay-encrypted), plus App Attest / DeviceCheck for server-side attestation. Android ships bytecode that is easier to decompile, so obfuscation matters more there; iOS gets more from platform signing but is not immune to jailbreak-based tampering.",
    "technicalDeep": "Attestation is the strongest tamper control because it moves the trust decision to a place the attacker does not control. The device's OS vendor cryptographically signs a statement ('this is a genuine app package with signature X, on a non-tampered device') that your server verifies. Because the attacker cannot forge the vendor's signature, a repackaged or hooked app fails attestation server-side even though nothing on the client could have stopped the tampering. Local integrity checks (verify your own signing certificate hash, checksum critical assets, detect known instrumentation like Frida/Xposed) are useful defense-in-depth but are bypassable — the attacker can patch out the check. So local checks buy time and raise cost; server-side attestation is what actually gates access. String/asset encryption and control-flow obfuscation slow static analysis but never defeat a determined analyst.\n\nHow Android does it vs How iOS does it: Android's Play Integrity returns a verdict your backend validates before serving sensitive endpoints; iOS App Attest issues a hardware-backed key whose assertions your backend verifies. Both are server-verified, which is the whole point.",
    "whatBreaks": "Embedding an API key or signing secret in the app and assuming decompilers cannot find it (they find it in minutes via string search). Enforcing 'is this a paid user' purely in client code that a modified build flips to true. Relying on a local root/tamper check with no server-side attestation, so the attacker just patches the check. Over-aggressive obfuscation keep rules that break reflection or serialization at runtime. Believing obfuscation is encryption — it is not; it is only harder to read.",
    "efficientWay": {
      "title": "Protecting a shipped binary",
      "approaches": [
        {
          "name": "Keep secrets server-side + shrink/obfuscate + server-verified attestation",
          "verdict": "best",
          "reason": "Nothing valuable is in the binary, obfuscation raises analysis cost, and attestation lets the server reject tampered/repackaged clients — a control the attacker cannot patch out."
        },
        {
          "name": "Obfuscation plus local integrity/root checks only",
          "verdict": "ok",
          "reason": "Raises the cost of attack and deters casual tampering, but every local check is bypassable, so it delays rather than prevents. Fine as defense-in-depth, not as the only line."
        },
        {
          "name": "Hard-code secrets and enforce entitlements in client code",
          "verdict": "weak",
          "reason": "Secrets are extracted trivially and client-side gates are flipped by a modified build. This is the exact anti-pattern reverse engineering exploits."
        }
      ],
      "recommendation": "Assume the binary is fully readable. Put every secret and every real entitlement check on the server, enable shrinking/obfuscation to raise cost, and use platform attestation (Play Integrity / App Attest) so the server can refuse tampered clients. Treat local checks as friction, not enforcement."
    },
    "commonMistakes": [
      "Confusing obfuscation with encryption — obfuscated code is still fully functional and readable with effort",
      "Embedding API keys, signing secrets, or entitlement logic in the client",
      "Relying on local tamper/root checks with no server-side attestation to back them",
      "Writing obfuscation keep rules so loosely (or so tightly) that reflection/serialization breaks in release builds"
    ],
    "seniorNotes": "The mental model that saves you: obfuscation and local checks buy time; attestation buys a decision. Only server-verified attestation actually keeps a tampered client out, because it relies on a signature the attacker cannot forge. Budget your effort accordingly — spend it on getting secrets off the client and wiring attestation into sensitive endpoints, not on an arms race of client-side anti-tamper tricks that a skilled attacker patches in an afternoon. Also test obfuscated release builds thoroughly; shrinking bugs (missing keep rules) are a classic release-only crash.",
    "interviewQuestions": [
      "Why can you never fully prevent reverse engineering of a mobile app, and what follows from that?",
      "What is the difference between obfuscation and app attestation as tamper defenses?",
      "Why is a local root/tamper check weaker than server-side attestation?"
    ],
    "interviewAnswers": [
      "Because you ship the code to a device the attacker controls, so it can always be unpacked and analysed. It follows that the client is untrusted: no secrets in the binary, no security-critical logic that the server does not independently enforce, and anything shipped is treated as public.",
      "Obfuscation just makes the disassembly harder to read; the code still runs and can be analysed with effort. Attestation is a cryptographic statement from the OS vendor, verified by your server, that the app is genuine and unmodified. Obfuscation raises cost; attestation actually gates access.",
      "A local check runs inside the attacker's process, so they can hook or patch it out and force it to return 'clean'. Server-side attestation depends on a vendor signature the attacker cannot forge, and the decision is made on your server where they have no control, so a tampered client fails even after defeating every local check."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Local check vs server attestation (pseudocode)",
        "code": "// WEAK: local-only tamper check (attacker patches this to 'return true')\nfun isGenuine(): Boolean {\n    return verifyOwnSignature() && !isDebuggerAttached() && !isRooted()\n}\nif (!isGenuine()) refuseToRun()   // bypassed by patching isGenuine()\n\n// STRONG: server-verified attestation\n// client\ntoken = platformAttestation.request(nonce = serverNonce)\nsend(token) // Play Integrity verdict / App Attest assertion\n\n// server (attacker cannot control this)\nverdict = vendor.verify(token, expectedSignature, expectedNonce)\nif (!verdict.appIsGenuine || !verdict.deviceUntampered)\n    reject()   // tampered/repackaged client is denied here"
      }
    ],
    "resources": [
      {
        "label": "OWASP MASVS / MASTG (resilience & anti-tampering)",
        "url": "https://mas.owasp.org/",
        "kind": "docs"
      },
      {
        "label": "Android Security Best Practices",
        "url": "https://developer.android.com/topic/security/best-practices",
        "kind": "docs"
      },
      {
        "label": "OWASP Mobile Top 10",
        "url": "https://owasp.org/www-project-mobile-top-10/",
        "kind": "article"
      }
    ]
  },
  {
    "id": "root-jailbreak-detection",
    "phase": 8,
    "phaseName": "Security & Privacy",
    "orderIndex": 6,
    "estimatedMins": 25,
    "prerequisites": [
      "reverse-engineering-defense"
    ],
    "title": "Root / Jailbreak Detection",
    "eli5": "Some users unlock their phones to get superpowers over every app. That also means the phone's safety walls are down, so your app's secrets are easier to steal. You can try to notice when the walls are down and be more careful, but a clever user can hide it from you.",
    "analogy": "A rooted or jailbroken phone is a house with the security system disabled and the owner holding a master key to every room. Detection is like checking whether the alarm panel is switched off before you leave the jewels out — useful, but a smart intruder can make the panel light look green while it is really off.",
    "explanation": "Rooting (Android) and jailbreaking (iOS) remove the OS restrictions that normally keep apps sandboxed from each other and from the system. On such a device, the guarantees your secure storage and sandbox rely on are weakened: other processes may read your files, hook your code, or bypass permission prompts. Root/jailbreak detection tries to notice this condition so your app can react — for example, refuse to run for a high-risk banking feature, disable certain functionality, or flag the session for extra scrutiny server-side.\n\nThe crucial caveat: detection is a signal, not a guarantee. Because the detection code runs on the very device that is compromised, a determined attacker can hide the root, spoof the checks, or patch them out. So you treat detection as one layer of defense-in-depth, tune its response to the risk (warn vs block), and never rely on it as your only protection. The real protections remain hardware-backed storage, server-side enforcement, and attestation.\n\nHow Android does it vs How iOS does it: On Android you look for signs like the su binary, common root-management apps, writable system partitions, or a failed Play Integrity verdict (the platform's own, harder-to-fool signal). On iOS you look for the existence of jailbreak files/paths, the ability to write outside the sandbox, suspicious dynamic libraries, or a failed App Attest check. The concrete signals differ; the philosophy — collect signals, weigh them, do not trust any single one — is identical.",
    "technicalDeep": "Detection combines several weak signals into a risk score rather than a single boolean. Signals include: presence of known root/jailbreak binaries and paths, the ability to perform operations the sandbox should forbid (writing to system directories), detection of hooking/instrumentation frameworks (Frida, Xposed, Cydia Substrate) in the process, and — most reliably — platform attestation verdicts that are computed with vendor keys off-device. Local signals are individually spoofable, so you defense-in-depth by (a) checking multiple independent signals, (b) not centralizing the decision in one easily-patched function, and (c) reporting the verdict to your server so the enforcement decision happens off-device. The response should be graduated: for low-risk features, allow with monitoring; for high-risk actions (payments, key export), require a passing attestation and block otherwise.\n\nHow Android does it vs How iOS does it: Play Integrity (Android) and App Attest / DeviceCheck (iOS) both give a server-verifiable device-integrity verdict that is far harder to spoof than local file checks, because the verdict is signed by the OS vendor. Prefer these over hand-rolled local heuristics wherever the risk justifies it.",
    "whatBreaks": "Shipping a single isJailbroken() function that the attacker hooks to always return false. Hard-blocking every rooted device and alienating power users and security researchers who root for legitimate reasons, while still not stopping a determined attacker. Treating a passed local check as proof the device is safe and then storing secrets carelessly. Relying on outdated signal lists that miss new root-hiding tools. Doing all detection client-side with no server-side attestation, so the entire mechanism is one patch away from defeated.",
    "efficientWay": {
      "title": "Deciding how to handle rooted/jailbroken devices",
      "approaches": [
        {
          "name": "Server-verified attestation + multiple local signals, graduated response",
          "verdict": "best",
          "reason": "Attestation is hard to spoof and decided off-device; local signals add friction; a graduated response blocks only high-risk actions, so you protect the crown jewels without a blunt ban."
        },
        {
          "name": "Multiple local signals combined into a risk score, warn-then-restrict",
          "verdict": "ok",
          "reason": "Harder to bypass than a single check and avoids over-blocking, but with no server-side attestation it is still ultimately patchable. Reasonable for medium-risk apps."
        },
        {
          "name": "Single local isRooted() boolean that hard-blocks the app",
          "verdict": "weak",
          "reason": "Trivially patched to return false, and it punishes legitimate power users while stopping no serious attacker. Worst of both worlds."
        }
      ],
      "recommendation": "Use platform attestation as the authoritative signal, add several independent local signals for defense-in-depth, and respond in proportion to risk — monitor low-risk sessions, gate high-risk actions. Never make a single client-side boolean your only defense, and keep the real protections (hardware storage, server-side enforcement) regardless."
    },
    "commonMistakes": [
      "Centralizing detection in one function the attacker can hook and force to return 'clean'",
      "Treating detection as foolproof and relaxing real protections when it passes",
      "Hard-blocking all rooted/jailbroken devices, harming legitimate users without stopping determined attackers",
      "Doing only client-side checks with no server-side attestation to back the decision"
    ],
    "seniorNotes": "Be honest about what this buys you: root/jailbreak detection is friction and telemetry, not a security boundary. It is worth doing for high-value apps as one layer, but if it is load-bearing you have designed wrong — the assumption should already be that the device may be compromised. Prefer vendor attestation over local heuristics, respond proportionally rather than banning outright, and make sure your secure-storage and server-side controls would hold even if detection were entirely defeated.",
    "interviewQuestions": [
      "Why is root/jailbreak detection considered a signal rather than a guarantee?",
      "How would you respond to a detected rooted device, and does it depend on the app?",
      "Why is server-side attestation more trustworthy than a local isRooted() check?"
    ],
    "interviewAnswers": [
      "Because the detection code runs on the compromised device itself, so an attacker with root can hide the indicators, hook the checks, or patch them to report a clean device. It raises the cost of attack and gives telemetry, but it cannot be relied on as a hard boundary.",
      "It should be graduated and risk-based. For a low-risk app, allow the session but flag it and keep monitoring; for a banking or payments flow, require a passing attestation and block or degrade high-risk actions. A blanket ban tends to punish legitimate power users while a determined attacker gets around it anyway.",
      "The attestation verdict is computed and signed by the OS vendor with keys the attacker cannot forge, and it is verified on your server where the attacker has no control. A local isRooted() runs inside the attacker's process and can simply be made to return false."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Graduated, multi-signal response (pseudocode)",
        "code": "// Combine weak local signals into a score, prefer server attestation\nlocalScore = 0\nif (foundRootBinaries())        localScore += 1   // su, Cydia, etc.\nif (canWriteSystemPartition())  localScore += 1\nif (hookingFrameworkPresent())  localScore += 2   // Frida/Xposed\n\n// authoritative, off-device signal\nattestation = server.verify(platformAttestationToken)\n\nrisk = combine(localScore, attestation)\n\nwhen (risk) {\n    LOW    -> allow()                       // proceed, keep telemetry\n    MEDIUM -> allow(); flagSessionOnServer()\n    HIGH   -> if (action.isSensitive) block() else warnUser()\n}\n// NOTE: real secrets still live in hardware keystore + server enforces authz,\n//       so a defeated check does not expose the crown jewels."
      }
    ],
    "resources": [
      {
        "label": "OWASP MASVS / MASTG (device integrity & resilience)",
        "url": "https://mas.owasp.org/",
        "kind": "docs"
      },
      {
        "label": "Android Security Best Practices",
        "url": "https://developer.android.com/topic/security/best-practices",
        "kind": "docs"
      },
      {
        "label": "Apple Security Framework",
        "url": "https://developer.apple.com/documentation/security",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "mobile-privacy",
    "phase": 8,
    "phaseName": "Security & Privacy",
    "orderIndex": 7,
    "estimatedMins": 30,
    "prerequisites": [
      "mobile-threat-model"
    ],
    "title": "Privacy, Permissions & Tracking Transparency",
    "eli5": "Your app should ask for only what it truly needs, explain why, and not secretly follow the user around. Both app stores now make you tell users, up front, what data you collect and whether you track them across other apps.",
    "analogy": "Good privacy is like being a polite houseguest: you ask before opening a drawer, you only take what you were offered, and you do not photograph the house to sell the layout to strangers. Permissions are the asking; data minimization is taking only what you need; tracking transparency is being honest that you might share notes with others.",
    "explanation": "Privacy on mobile has three pillars. First, data minimization: collect the least data needed for the feature, keep it the shortest time, and do not hoard 'just in case'. Less data is less to leak, less to disclose, and less to regulate. Second, permission hygiene: request a permission only when the feature needs it (in context, not all at launch), explain why, prefer coarse over precise where possible (approximate location instead of exact), and degrade gracefully when denied. Third, transparency: the platforms require you to declare, at the store and at runtime, what you collect and whether you track users across apps and sites for advertising.\n\nHow Android does it vs How iOS does it: iOS requires App Tracking Transparency (ATT) — an explicit user prompt before you access the device advertising identifier or otherwise track across apps/sites — plus a privacy manifest declaring collected data types and 'required reason' APIs, surfaced as Privacy Nutrition Labels on the App Store. Android surfaces a Data Safety section on Play, provides runtime permission prompts, a distinction between approximate and precise location, one-time and 'while using the app' grants, and privacy features like the Privacy Dashboard. Both platforms have converged on the same message: be explicit, be minimal, and let the user say no.",
    "technicalDeep": "The advertising identifier is the linchpin of cross-app tracking; controlling access to it is how the platforms curb it. On iOS, calling the tracking APIs before the ATT prompt (or without authorization) returns a zeroed identifier, so tracking simply does not work unless the user opts in. Store submissions require a privacy manifest that enumerates collected data types, their linkage to identity, and whether they are used for tracking; certain APIs that can fingerprint users require a declared 'required reason'. On Android, dangerous permissions are granted at runtime and can be revoked or auto-reset if the app is unused; location has an approximate/precise toggle and background-location is a separate, more scrutinized grant. Practically, you audit every SDK: analytics and ad SDKs frequently collect more than you realize, and their data collection must appear in your store disclosures because you are responsible for what runs in your app.\n\nHow Android does it vs How iOS does it: iOS gates the ad identifier behind ATT authorization and enforces privacy manifests at submission; Android gates identifiers and sensitive data behind runtime permissions and Data Safety disclosures. Get either disclosure wrong and the store can reject or remove the app.",
    "whatBreaks": "Requesting every permission at first launch, tanking grant rates and trust. Collecting precise location when approximate would do. An ad SDK silently accessing the advertising ID before the ATT prompt, which both violates policy and returns nothing useful. Store rejections because the Data Safety form / privacy label does not match what the app actually collects (often because a third-party SDK collects data the team forgot about). Logging PII or shipping it to analytics in plaintext. Retaining data long after the feature that needed it is gone.",
    "efficientWay": {
      "title": "Designing for privacy and permissions",
      "approaches": [
        {
          "name": "Minimize data, request in context with rationale, accurate store disclosures",
          "verdict": "best",
          "reason": "Higher grant rates and user trust, less to leak or disclose, and store submissions pass because the labels match reality. Aligns with ATT and Data Safety requirements."
        },
        {
          "name": "Request permissions in context but collect broadly 'for analytics'",
          "verdict": "ok",
          "reason": "Good permission UX, but hoarding data increases breach exposure and disclosure burden, and risks mismatched store labels if SDKs collect more than declared."
        },
        {
          "name": "Request all permissions up front and track by default",
          "verdict": "weak",
          "reason": "Kills grant rates and trust, likely violates ATT, and invites store rejection when disclosures do not match behavior. The classic privacy anti-pattern."
        }
      ],
      "recommendation": "Collect the minimum, ask for each permission in context with a clear reason, prefer coarse data, show the ATT prompt only when you actually need to track and never before, and keep your privacy manifest / Data Safety disclosures exactly matching what the app and its SDKs collect."
    },
    "commonMistakes": [
      "Requesting all permissions at launch instead of in context when the feature needs them",
      "Accessing the advertising identifier or tracking before showing the ATT prompt",
      "Store disclosures (privacy label / Data Safety) that do not match what SDKs actually collect",
      "Collecting precise location or excess PII when coarse data would satisfy the feature"
    ],
    "seniorNotes": "The under-appreciated risk is third-party SDKs: you are accountable for every byte they collect, and they are the most common reason store privacy labels end up inaccurate. Inventory your SDKs' data collection as carefully as your own code. Treat data minimization as a security control, not just compliance — data you never collected cannot be breached, subpoenaed, or mis-disclosed. And request permissions in context: a well-timed, well-explained prompt dramatically outperforms a wall of prompts at launch, both for grant rate and for trust.",
    "interviewQuestions": [
      "What is App Tracking Transparency and when must you show its prompt?",
      "Why is data minimization a security measure and not just a compliance checkbox?",
      "How do privacy manifests / store Data Safety disclosures relate to the SDKs you embed?"
    ],
    "interviewAnswers": [
      "ATT is iOS's requirement to get explicit user consent before tracking them across other apps and websites or accessing the device advertising identifier. You must show the prompt before any such tracking; if the user declines (or you never prompt), the tracking APIs return a zeroed identifier and cross-app tracking does not function.",
      "Because data you do not hold cannot be stolen, leaked, subpoenaed, or mis-disclosed. Every field you collect expands the breach blast radius and the disclosure surface, so minimizing collection directly shrinks your risk, on top of the legal and store-policy benefits.",
      "You are responsible for everything running in your app, including third-party SDKs, so their data collection must appear in your privacy manifest and store Data Safety section. If an ad or analytics SDK collects data you did not declare, your disclosure is inaccurate and the store can reject or pull the app, which is why you must audit SDK data flows."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "In-context permission + ATT gating (pseudocode)",
        "code": "// GOOD: ask only when the feature runs, with a rationale, coarse first\non user taps \"Find restaurants near me\":\n    show rationale(\"We use your approximate location to show nearby places\")\n    result = requestPermission(LOCATION_APPROXIMATE)   // not precise, not at launch\n    if (result == DENIED) showManualCitySearch()       // degrade gracefully\n\n// iOS App Tracking Transparency: prompt BEFORE any cross-app tracking\nif (needToTrackForAds) {\n    status = ATT.requestAuthorization()      // must precede ad-ID access\n    if (status == AUTHORIZED) adId = getAdvertisingId()\n    else                      adId = null    // returns zeroed id anyway\n}\n\n// Store disclosure must match reality, including SDKs:\ndeclareCollectedData([\"approx_location\", \"crash_logs\"])\n// audit every SDK -> if analyticsSDK collects deviceId, it MUST be declared"
      }
    ],
    "resources": [
      {
        "label": "Apple App Tracking Transparency",
        "url": "https://developer.apple.com/documentation/apptrackingtransparency",
        "kind": "docs"
      },
      {
        "label": "Android Security Best Practices",
        "url": "https://developer.android.com/topic/security/best-practices",
        "kind": "docs"
      },
      {
        "label": "OWASP Mobile Top 10",
        "url": "https://owasp.org/www-project-mobile-top-10/",
        "kind": "article"
      }
    ]
  }
]
