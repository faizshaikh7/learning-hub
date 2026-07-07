import type { CurriculumTopic } from '@/types'

/** Phase 10 — Build, Release & Distribution (framework-agnostic mobile). */
export const MOBILE_P10: CurriculumTopic[] = [
  {
    "id": "build-systems-signing",
    "phase": 10,
    "phaseName": "Build, Release & Distribution",
    "orderIndex": 1,
    "estimatedMins": 35,
    "prerequisites": [],
    "title": "Build Systems & Code Signing",
    "eli5": "Before an app can go on a phone, it has to be packaged into a box and sealed with a wax stamp that only you own. The box is the build; the stamp is the signature. If the stamp does not match, the phone refuses to open the box.",
    "analogy": "Signing is like a tamper-evident seal on medicine. The store trusts the seal because only the real manufacturer has the mold. Anyone can copy the pills (your code), but they cannot forge the seal (your private key), so the phone knows the app really came from you and was not swapped on the way.",
    "explanation": "A mobile build turns your source code and assets into an installable artifact for one target configuration. The same codebase usually produces several variants: a debug build for development and a release build for the store, plus optional flavors (free vs paid, staging vs production) that swap icons, API URLs, and feature flags. Every release artifact must be cryptographically signed so the operating system and the store can verify who built it and that nobody altered it after signing.\n\nHow Android does it vs How iOS does it: Android builds with Gradle, defines buildTypes (debug/release) and productFlavors, and produces an APK or AAB signed with a keystore file holding your private key. iOS builds with Xcode/xcodebuild using schemes and build configurations, and signs with an Apple-issued certificate plus a provisioning profile that ties your app ID, certificate, and allowed devices together.",
    "technicalDeep": "Signing uses asymmetric crypto: a private key signs a digest of the artifact, and the public key (embedded in the certificate) verifies it. On Android the APK Signing Block holds v1/v2/v3 signatures; Play App Signing lets Google hold the final app signing key while you keep an upload key, so a leaked upload key can be rotated. An AAB (Android App Bundle) is not installed directly — Google generates optimized, device-specific APKs from it via split APKs. On iOS the code signature is embedded in the Mach-O binary and the embedded.mobileprovision lists entitlements, the team, and (for development/ad-hoc) allowed device UDIDs; the OS refuses to launch a binary whose signature or entitlements do not match.\n\nHow Android does it vs How iOS does it: Android identity = keystore (one or more key aliases, password-protected), and consistency of the signing key across updates is what lets an update replace an existing install. iOS identity = a certificate in your Apple Developer account plus a provisioning profile; distribution profiles have no device list because the App Store re-signs, while development profiles pin specific devices.",
    "whatBreaks": "Lose your Android keystore (and you are not on Play App Signing) and you can never update that app again — you must publish a brand-new listing. On iOS an expired certificate or a provisioning profile missing a device causes cryptic 'unable to install' or 'no matching provisioning profile' failures. Signing a release with the debug key ships an insecure build. Mismatched signing keys between an installed app and its update trigger 'signatures do not match' install errors.",
    "efficientWay": {
      "title": "Managing signing identities safely",
      "approaches": [
        {
          "name": "Managed/cloud signing (Play App Signing + Xcode automatic signing or match)",
          "verdict": "best",
          "reason": "The platform or a shared vault holds keys, enables rotation, and removes the single-point-of-failure of a laptop keystore."
        },
        {
          "name": "Manually managed keystore/certs committed to a secrets manager",
          "verdict": "ok",
          "reason": "Works and is explicit, but requires disciplined backup, rotation, and access control that teams often get wrong."
        },
        {
          "name": "Keys living only on one developer's machine",
          "verdict": "weak",
          "reason": "One lost laptop or departing employee and you can lose the ability to ship updates forever."
        }
      ],
      "recommendation": "Enroll in Play App Signing and keep only a rotatable upload key; on iOS use a shared, encrypted certificate store (or Xcode-managed signing) so no identity depends on one machine. Back up everything in a secrets manager, never in git."
    },
    "commonMistakes": [
      "Committing a keystore or .p12 certificate to the git repository",
      "Not enrolling in Play App Signing and keeping the only keystore copy on a laptop",
      "Shipping an APK instead of an AAB and missing Google's per-device size optimization",
      "Letting iOS certificates or provisioning profiles expire and discovering it only at release time"
    ],
    "seniorNotes": "Treat signing keys as top-tier secrets with the same rigor as production database credentials: escrow them, restrict access, and document rotation. Standardize flavors/schemes so staging and production differ only by config, never by code paths. In CI, inject keys from a secrets manager at build time and scrub them after — never bake them into images. Understand that AAB + Play App Signing decouples your upload identity from the final app identity, which is what makes key rotation possible.",
    "interviewQuestions": [
      "Why does mobile code signing exist, and what attack does it prevent?",
      "What is the difference between an APK and an AAB, and why did Google push bundles?",
      "How do Android keystores and iOS provisioning profiles differ in what they authorize?"
    ],
    "interviewAnswers": [
      "Signing binds an artifact to a private key nobody else holds, so the OS and store can verify authenticity and integrity — proving the app came from the real publisher and was not tampered with after build. It prevents an attacker from injecting malicious code into an app and passing it off as a legitimate update, and it enforces that only the original signer can publish updates to an existing install.",
      "An APK is a directly installable, universal package containing every architecture and density. An AAB is an upload format: Google uses it to generate per-device split APKs so users download only the code and resources their device needs, shrinking install size. Google made AAB mandatory for new Play apps to cut download sizes and centralize signing via Play App Signing.",
      "An Android keystore holds your private signing key(s); consistency of that key across releases is what authorizes an update to replace an install. An iOS provisioning profile authorizes a specific app ID with specific entitlements, signed by a specific certificate, and (for non-store builds) only on listed devices — it is an authorization document, whereas the keystore is purely the identity."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Neutral build + sign pipeline (pseudocode)",
        "code": "# One codebase, many variants\nbuild(target = release, flavor = production):\n    compile source + bundle assets\n    apply config for flavor            # API_URL, icon, feature flags\n    package into artifact              # Android: AAB | iOS: .ipa\n    sign(artifact, privateKey)         # digest -> signature\n    verify(artifact, publicCert)       # store/OS will redo this\n\n# Verification the OS runs on install\ninstall(artifact):\n    if not signatureValid(artifact): reject\n    if installedApp.signer != artifact.signer: reject  # updates must match\n    if entitlements not permitted: reject              # iOS profile check"
      },
      {
        "lang": "bash",
        "label": "Android: generate an upload key and build a signed bundle",
        "code": "# Create an upload keystore (store this in a secrets manager, NOT git)\nkeytool -genkeypair -v -keystore upload.jks \\\n  -alias upload -keyalg RSA -keysize 2048 -validity 10000\n\n# Build a signed Android App Bundle for release\n./gradlew bundleRelease\n# Output: app/build/outputs/bundle/release/app-release.aab\n# Google re-signs with the app signing key via Play App Signing"
      }
    ],
    "resources": [
      {
        "label": "Android app signing (official docs)",
        "url": "https://developer.android.com/studio/publish/app-signing",
        "kind": "docs"
      },
      {
        "label": "Android app bundles (AAB)",
        "url": "https://developer.android.com/guide/app-bundle",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh Android",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      }
    ]
  },
  {
    "id": "app-store-submission",
    "phase": 10,
    "phaseName": "Build, Release & Distribution",
    "orderIndex": 2,
    "estimatedMins": 35,
    "prerequisites": [
      "build-systems-signing"
    ],
    "title": "App Store Submission & Review",
    "eli5": "You cannot just put your app on phones yourself. You hand your sealed box to a shop (the store), fill out a form describing it, add photos, and a reviewer checks it follows the rules before it goes on the shelf.",
    "analogy": "Submission is like getting a food product onto supermarket shelves. You provide labeling (metadata), packaging photos (screenshots), ingredient disclosures (privacy labels), and an inspector checks it meets safety rules. Fail inspection and you get a note listing exactly what to fix before you can shelve it.",
    "explanation": "Once you have a signed release artifact, you submit it to a store where humans and automated systems review it against a set of guidelines before it becomes downloadable. You also provide a listing: title, description, keywords, category, screenshots for each device size, an icon, a privacy policy, and disclosures about what data you collect. Review can approve, reject with reasons, or ask for more information.\n\nHow Android does it vs How iOS does it: Google Play review is mostly automated with lighter human touch, so approval is often hours; policy enforcement frequently happens post-publish. Apple's App Store review is more hands-on and stricter, typically a day or so, and rejections are common on a first submission — Apple checks functionality on real devices and enforces its Human Interface and business-model rules closely.",
    "technicalDeep": "Each store has a console (Google Play Console, App Store Connect) where you create the app record, upload the artifact, set the listing, and pick a release type. Metadata is localized per market. Stores require declared content ratings, target-audience and data-safety/privacy questionnaires, and export-compliance answers. Review evaluates for crashes, broken flows, deceptive behavior, private-API use, security, and business-model compliance (especially payments). A rejection references specific guideline sections; you fix and resubmit, or appeal.\n\nHow Android does it vs How iOS does it: Google's Data safety section and Play policies are declared in the console and spot-checked; violations often lead to takedowns rather than pre-launch blocks. Apple enforces the App Store Review Guidelines up front — common triggers include using external payment for digital goods, incomplete apps, missing privacy details, and mimicking system UI. Apple also runs Nutrition-label-style privacy disclosures that must match actual behavior.",
    "whatBreaks": "A guideline violation (e.g., collecting data you did not disclose, or routing digital purchases outside in-app billing) gets you rejected or removed. Screenshots that do not match the real app, placeholder content, or a demo account that does not work stall review. Crashes on the reviewer's device are an instant reject. Getting a real app pulled post-launch for a policy breach can freeze your entire release pipeline.",
    "efficientWay": {
      "title": "Getting through review the first time",
      "approaches": [
        {
          "name": "Pre-flight against the guidelines with a submission checklist",
          "verdict": "best",
          "reason": "Most rejections are predictable — reading the guidelines and using the store's launch checklist catches them before a reviewer does."
        },
        {
          "name": "Submit early and iterate on rejections",
          "verdict": "ok",
          "reason": "You learn the rules, but each round costs review-cycle days and delays launch."
        },
        {
          "name": "Assume Android success means iOS will pass",
          "verdict": "weak",
          "reason": "Apple enforces business-model and UI rules Google ignores; the same build routinely passes Play and fails the App Store."
        }
      ],
      "recommendation": "Run the store's official launch/pre-launch checklist, provide a working demo account and clear review notes, and read the Apple guidelines sections on payments and privacy before your first iOS submission. Treat Android and iOS review as separate gates."
    },
    "commonMistakes": [
      "Not disclosing data collection accurately in the privacy/data-safety section",
      "Using external payment links for digital goods instead of in-app billing (Apple reject)",
      "Submitting with a broken or missing reviewer demo account for gated features",
      "Uploading screenshots or descriptions that misrepresent what the app actually does"
    ],
    "seniorNotes": "Bake review requirements into the definition of done, not the end of the release: privacy disclosures, content ratings, and demo credentials should be tracked like features. Keep review notes and a test account current in the pipeline. Know your appeal path and expected review SLAs so you can commit to launch dates. For payments especially, decide early whether your business model even fits store rules — retrofitting IAP after building a web-payment flow is expensive.",
    "interviewQuestions": [
      "What are the most common reasons an app gets rejected from the App Store?",
      "How does Google Play review differ from Apple App Store review?",
      "What metadata and disclosures must you provide beyond the binary itself?"
    ],
    "interviewAnswers": [
      "Frequent rejects: crashes or broken flows on the reviewer's device, using non-store payment for digital goods, incomplete/placeholder content, missing or inaccurate privacy disclosures, requesting permissions without justification, and imitating system UI or misleading metadata. Most are avoidable by testing on-device and reading the payments and privacy sections of the guidelines first.",
      "Play review is largely automated and fast (often hours) with much enforcement happening after publish via policy scans and takedowns. Apple review is stricter and more manual — reviewers run the app on devices, enforce Human Interface and business rules up front, and reject commonly on a first pass, so you should expect a day-plus turnaround and design for its rules deliberately.",
      "Beyond the signed binary you provide localized title/description/keywords, a category, per-device screenshots and an icon, a privacy policy URL, content-rating and target-audience answers, data-collection/privacy disclosures, export-compliance answers, and (for gated apps) reviewer demo credentials and notes."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Submission review state machine (pseudocode)",
        "code": "submit(artifact, listing, disclosures):\n    state = IN_REVIEW\n    checks = run(automated_scan + human_review)\n    if checks.hasBlockingViolation():\n        state = REJECTED\n        return reasons -> fix -> resubmit   # cite guideline sections\n    if checks.needsInfo():\n        state = METADATA_REJECTED           # e.g. broken demo account\n        return provide_more_info\n    state = APPROVED\n    # APPROVED != live: you still choose when to release\n    return ready_to_release"
      }
    ],
    "resources": [
      {
        "label": "Apple App Store Review Guidelines",
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "kind": "docs"
      },
      {
        "label": "Google Play launch checklist",
        "url": "https://developer.android.com/distribute/best-practices/launch",
        "kind": "docs"
      },
      {
        "label": "roadmap.sh iOS",
        "url": "https://roadmap.sh/ios",
        "kind": "course"
      }
    ]
  },
  {
    "id": "release-management",
    "phase": 10,
    "phaseName": "Build, Release & Distribution",
    "orderIndex": 3,
    "estimatedMins": 35,
    "prerequisites": [
      "app-store-submission"
    ],
    "title": "Release Management & Staged Rollout",
    "eli5": "Instead of giving your new app to everyone at once, you give it to a few friends first, then a bigger group, then everyone. If something breaks, you stop before most people ever get it.",
    "analogy": "A staged rollout is like opening a new bridge lane by lane. You let a trickle of cars through first and watch for cracks. If the deck holds, you open more lanes; if you see stress, you close it again before rush hour — far cheaper than recalling every car already across.",
    "explanation": "Release management is how you get a reviewed build to users in a controlled way. You assign a version, ship it first to testers on internal and closed tracks, promote to an open/beta audience, and finally to production — often as a staged rollout that starts at a small percentage and increases as metrics stay healthy. Crucially, you can halt or roll back a rollout if crash rates or bad reviews spike.\n\nHow Android does it vs How iOS does it: Play offers explicit testing tracks (internal, closed, open) and a native staged/percentage rollout with the ability to halt at any percent. iOS uses TestFlight for internal (up to 100 team testers, no review) and external (up to 10,000, light review) beta testing, and App Store Connect offers Phased Release that ramps to 100% over about a week, which you can pause.",
    "technicalDeep": "Versioning has two parts: a user-facing version name (semantic, e.g., 2.4.0) and a monotonically increasing build/version code that the store uses to order releases. You cannot ship a build code lower than what is already live. A staged rollout serves the new build to a slice of the install base and holds the rest on the previous version, so you can compare crash-free-rate and ANR/hang metrics between cohorts. Halting freezes new upgrades; because stores do not auto-downgrade already-updated users, a rollback usually means shipping a fixed higher build code fast.\n\nHow Android does it vs How iOS does it: Play lets you set an arbitrary rollout percentage, pause it, and resume, and testing tracks each hold their own release. Apple's Phased Release follows a fixed 7-day daily ramp (1/2/5/10/20/50/100%) that you can pause but not fine-tune, and it applies only to automatic updates — users can always manually pull the latest.",
    "whatBreaks": "Forgetting to bump the build/version code makes the upload rejected as a duplicate. Rolling out to 100% immediately turns a bad build into a mass incident with no containment. Because you cannot force a downgrade, a broken release that already reached users can only be fixed forward — so a slow build/review pipeline turns a small bug into a long outage. Misreading cohort metrics (comparing the new slice against all users instead of the old cohort) hides regressions.",
    "efficientWay": {
      "title": "Rolling out a new version",
      "approaches": [
        {
          "name": "Tracks + staged percentage rollout with metric gates",
          "verdict": "best",
          "reason": "Testers catch obvious breakage; a small first percentage caps blast radius and lets crash-free-rate gate each step up."
        },
        {
          "name": "Straight to 100% after internal testing only",
          "verdict": "ok",
          "reason": "Fine for tiny apps or trivial changes, but any real regression hits your whole base at once."
        },
        {
          "name": "No versioning discipline, ship whenever",
          "verdict": "weak",
          "reason": "Duplicate build codes, unclear what is live, and no cohort to compare against when something breaks."
        }
      ],
      "recommendation": "Use internal and closed tracks (TestFlight on iOS) to catch obvious issues, then a staged rollout starting at a few percent with crash-free-rate and ANR/hang gates before each increase. Keep the pipeline fast enough that fixing forward is a same-day option, since you cannot downgrade users."
    },
    "commonMistakes": [
      "Not incrementing the build/version code, causing an upload rejection",
      "Going straight to 100% and turning a bug into a full-fleet incident",
      "Assuming halting a rollout downgrades already-updated users (it does not)",
      "Skipping beta tracks and letting real users be your first testers"
    ],
    "seniorNotes": "Because mobile has no instant rollback, your real safety net is a fast fix-forward pipeline plus server-side feature flags/kill-switches that let you disable a broken feature without a new build. Pair staged rollout with real-time crash and ANR dashboards and pre-agreed halt thresholds. Decouple release (the binary is live) from launch (the feature is on) using remote config so marketing dates do not force risky big-bang enables. Track version adoption because you must support a long tail of users who never update.",
    "interviewQuestions": [
      "How do you safely release a new mobile version to millions of users?",
      "Why can't you 'roll back' a mobile release the way you roll back a server deploy?",
      "What is the difference between internal, closed, and open testing tracks?"
    ],
    "interviewAnswers": [
      "Ship first to internal and closed testers (or TestFlight), then start a staged/percentage rollout at a small slice of production. Watch crash-free rate, ANR/hang rate, and reviews per cohort, and only increase the percentage while metrics stay healthy. Gate the big steps on those metrics and have a halt threshold agreed in advance, plus server-side flags to disable features independently of the binary.",
      "Stores do not downgrade users who already installed the new version — there is no push-button revert to the prior binary. Halting a rollout only stops further upgrades. So the practical recovery is to fix the bug and ship a higher build code fast, which is why fix-forward speed and remote kill-switches matter more than any 'rollback' button.",
      "Internal is a tiny trusted group (fast, minimal or no review) for smoke-testing a build. Closed is a larger invited/allowlisted beta for wider feedback before public exposure. Open is a public beta anyone can join. You promote a build up the tracks to progressively increase audience and confidence before production."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Staged rollout with halt gate (pseudocode)",
        "code": "release(version = \"2.4.0\", buildCode = 240):\n    assert buildCode > liveBuildCode          # stores reject duplicates/lower\n    promote(internalTrack -> closedTrack -> openTrack)\n\n    for pct in [1, 5, 10, 25, 50, 100]:\n        rolloutTo(pct)\n        wait(bakeTime)\n        newCohort = metrics(version = \"2.4.0\")\n        oldCohort = metrics(version = \"2.3.x\")\n        if newCohort.crashFreeRate < oldCohort.crashFreeRate - threshold:\n            halt()                            # stops further upgrades\n            fixForward()                      # ship higher buildCode; no downgrade\n            break"
      }
    ],
    "resources": [
      {
        "label": "Apple TestFlight / distribution",
        "url": "https://developer.apple.com/testflight/",
        "kind": "docs"
      },
      {
        "label": "Google Play launch checklist",
        "url": "https://developer.android.com/distribute/best-practices/launch",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "mobile-cicd",
    "phase": 10,
    "phaseName": "Build, Release & Distribution",
    "orderIndex": 4,
    "estimatedMins": 40,
    "prerequisites": [
      "build-systems-signing",
      "release-management"
    ],
    "title": "CI/CD for Mobile",
    "eli5": "Instead of a person building, signing, and uploading the app by hand every time, a robot does it. You push your code, and the robot tests it, seals it, and hands it to the store automatically.",
    "analogy": "Mobile CI/CD is a factory conveyor belt. Raw code enters one end; automated stations test it, package it, stamp it with the signing seal, and place it on the store's loading dock. No human touches the product in the middle, so every unit comes out identical and traceable.",
    "explanation": "Continuous Integration/Continuous Delivery for mobile automates the path from a code commit to a build in testers' or users' hands. A pipeline checks out code, installs dependencies, runs unit and UI tests, builds the release artifact, signs it, and uploads it to a testing track or the store. Automation removes manual, error-prone steps and makes releases repeatable and auditable.\n\nHow Android does it vs How iOS does it: Android CI runs on ordinary Linux runners with the Android SDK and Gradle, and signing keys are injected from CI secrets. iOS CI historically requires macOS runners with Xcode, and signing is trickier because it needs certificates and provisioning profiles present on the build machine — tools like Fastlane match sync those from an encrypted store into CI.",
    "technicalDeep": "A typical pipeline is triggered by a push or tag, runs in ephemeral runners, and uses cached dependencies for speed. Secrets (keystore, .p12, App Store Connect API key, service-account JSON) are injected from the CI secret store at runtime and never persisted. Fastlane provides cross-platform 'lanes' that wrap gym/build, sign, and deliver/supply/upload_to_play_store steps; GitHub Actions (or similar) orchestrates the jobs and matrix. Cloud signing services can hold keys so the runner never sees raw private keys. Build numbers are often auto-incremented from CI to guarantee monotonic version codes.\n\nHow Android does it vs How iOS does it: Android jobs run cheaply on Linux; you base64-decode the keystore from a secret and pass credentials to Gradle, then use Fastlane supply or the Play Developer API to upload to a track. iOS needs a macOS runner (costlier), uses Fastlane match to install certs/profiles or App Store Connect API key-based automatic signing, and uploads via Fastlane deliver/pilot or Transporter. The iOS credential dance is the main source of flaky mobile pipelines.",
    "whatBreaks": "Expired certificates or profiles break iOS builds overnight with no code change. Secrets printed in logs leak your signing keys. Non-ephemeral runners that cache credentials become a security hole. Flaky UI tests block releases or, worse, get disabled and let regressions through. Forgetting to auto-increment the build number fails the upload. macOS runner shortages or Xcode version mismatches stall the whole pipeline.",
    "efficientWay": {
      "title": "Structuring a mobile pipeline",
      "approaches": [
        {
          "name": "Fastlane lanes orchestrated by CI with cloud/managed signing",
          "verdict": "best",
          "reason": "Fastlane abstracts the fiddly build/sign/upload steps cross-platform, and cloud signing keeps private keys off the runner."
        },
        {
          "name": "Hand-written CI scripts calling Gradle/xcodebuild directly",
          "verdict": "ok",
          "reason": "Full control and fewer dependencies, but you re-implement signing and upload logic Fastlane already solved, and it drifts over time."
        },
        {
          "name": "Manual builds from a developer laptop",
          "verdict": "weak",
          "reason": "Not reproducible, not auditable, keys live on a laptop, and the release depends on one person being available."
        }
      ],
      "recommendation": "Use Fastlane lanes for build/sign/deliver, drive them from GitHub Actions (Linux for Android, macOS for iOS), inject secrets from the CI vault into ephemeral runners, and prefer managed/cloud signing so raw keys never touch the runner. Auto-increment build numbers in CI."
    },
    "commonMistakes": [
      "Storing signing keys or API keys in the repo instead of the CI secret store",
      "Echoing secrets into build logs where they become permanently exposed",
      "Not auto-incrementing the build number, causing upload rejections",
      "Neglecting iOS certificate/profile expiry until a release breaks"
    ],
    "seniorNotes": "The hardest part of mobile CI/CD is credential management, not the build. Standardize on Fastlane match or App Store Connect API keys, keep runners ephemeral, and rotate secrets. Cache dependencies and split test/build stages so a red test does not waste macOS minutes. Treat the pipeline itself as code and review changes to it. For scale, keep separate lanes for beta (fast, testers) and production (staged rollout), and wire the pipeline to your crash dashboards so a bad build can be halted from one place.",
    "interviewQuestions": [
      "Walk me through a CI/CD pipeline that takes a commit to the store.",
      "Why is iOS CI harder to set up than Android CI?",
      "How do you handle signing secrets securely in an automated pipeline?"
    ],
    "interviewAnswers": [
      "A push or tag triggers an ephemeral runner: checkout, restore dependency cache, run unit and UI tests, build the release artifact (AAB/.ipa), sign it with keys injected from the secret store, then upload to a testing track via Fastlane (supply for Play, deliver/pilot for TestFlight). Build numbers auto-increment for monotonicity, and promotion to a staged production rollout is a separate gated job wired to crash metrics.",
      "iOS needs macOS runners with the right Xcode, which are costlier and scarcer, and its signing requires certificates and provisioning profiles physically present on the build machine with matching entitlements. Syncing those into ephemeral CI (usually via Fastlane match or an App Store Connect API key) is fiddly and expiry-prone, whereas Android just needs a keystore file and Gradle on cheap Linux.",
      "Keep all keys in the CI secret manager, never in the repo. Inject them into ephemeral runners at runtime (e.g., base64-decode a keystore, install certs via match), never echo them to logs, and prefer cloud/managed signing so the raw private key never lands on the runner at all. Rotate credentials and scope API keys to least privilege."
    ],
    "codeExamples": [
      {
        "lang": "yaml",
        "label": "GitHub Actions: build, sign, ship to a beta track (sketch)",
        "code": "name: mobile-release\non:\n  push:\n    tags: [ 'v*' ]\njobs:\n  android:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: echo \"$KEYSTORE_B64\" | base64 -d > upload.jks\n        env: { KEYSTORE_B64: '${{ secrets.KEYSTORE_B64 }}' }\n      - run: bundle exec fastlane android beta   # test, build AAB, sign, upload\n        env:\n          PLAY_JSON_KEY: '${{ secrets.PLAY_JSON_KEY }}'\n  ios:\n    runs-on: macos-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: bundle exec fastlane ios beta        # match signs, uploads to TestFlight\n        env:\n          ASC_API_KEY: '${{ secrets.ASC_API_KEY }}'"
      },
      {
        "lang": "text",
        "label": "Fastlane lane concept (pseudocode)",
        "code": "lane :beta do\n    run_tests\n    increment_build_number(from = ci_run_number)\n    sync_signing_credentials(source = encrypted_store)   # match / ASC key\n    artifact = build_release()                           # gym | gradle\n    upload_to_beta_track(artifact)                       # pilot | supply\n    notify(team, \"beta build ready\")\nend"
      }
    ],
    "resources": [
      {
        "label": "Fastlane",
        "url": "https://fastlane.tools/",
        "kind": "docs"
      },
      {
        "label": "Android app signing",
        "url": "https://developer.android.com/studio/publish/app-signing",
        "kind": "docs"
      },
      {
        "label": "Apple TestFlight / distribution",
        "url": "https://developer.apple.com/testflight/",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "app-updates",
    "phase": 10,
    "phaseName": "Build, Release & Distribution",
    "orderIndex": 5,
    "estimatedMins": 30,
    "prerequisites": [
      "release-management"
    ],
    "title": "App Updates: In-App & OTA",
    "eli5": "There are three ways to change an app after it ships: the store pushes a whole new version, the app itself pops up asking you to update, or the app quietly swaps out part of its own code over the internet without a store visit.",
    "analogy": "Think of a video game console. A store update is buying a new disc. An in-app update prompt is the console reminding you a new disc exists and offering to fetch it. An OTA/hot update is a small downloadable patch that tweaks the game without a new disc — great for quick fixes, but the console maker limits how much a patch may change.",
    "explanation": "After launch you keep changing the app, and there are distinct update channels. Store updates deliver a new signed binary through the normal store flow. In-app update prompts detect that a newer store version exists and nudge (or force) the user to update, optionally installing it without leaving the app. OTA/hot updates apply to JavaScript-based frameworks (React Native, Ionic) that can download a new JS bundle at runtime and swap the app's logic without a store release — but stores restrict this so you cannot ship substantially new native behavior around review.\n\nHow Android does it vs How iOS does it: Android's In-App Updates API supports flexible (background download, update in-app) and immediate (blocking) modes. iOS has no official in-app binary-update API, so apps implement a soft/forced-upgrade prompt that deep-links to the App Store. Both platforms allow OTA JS-bundle updates within limits; Apple's guideline 3.3.1/2.5.2 forbids downloaded code that changes the app's primary purpose or bypasses review.",
    "technicalDeep": "A forced-upgrade check usually calls a config/version endpoint on launch: the server returns a minimum supported version, and if the installed version is below it the app blocks with an update wall. Soft prompts are dismissible. OTA works because interpreted JS bundles are data, not native machine code — a service (e.g., CodePush-style) hosts bundle versions keyed to a binary version, and the app fetches and applies the newest compatible bundle on launch or resume, with rollback if the new bundle crashes on boot. Native code, entitlements, and permissions still require a store binary update and re-review.\n\nHow Android does it vs How iOS does it: Android in-app immediate updates can hard-block until the new binary installs; flexible updates download in the background then prompt to restart. iOS relies on your own version-gate UI plus a store deep link. For OTA, both stores permit bug fixes and content to JS bundles but prohibit using OTA to sneak features that should have been reviewed — Apple enforces this more actively.",
    "whatBreaks": "Skipping a min-version gate leaves old clients calling APIs you have since removed, causing silent breakage for the long tail that never updates. An OTA bundle incompatible with the installed native binary crashes on launch — you need a boot check and automatic rollback to the last-good bundle. Abusing OTA to change core behavior risks app removal. Forced-update walls with a broken store link can lock users out entirely.",
    "efficientWay": {
      "title": "Choosing an update strategy",
      "approaches": [
        {
          "name": "Server-driven min-version gate + store updates, OTA only for JS fixes",
          "verdict": "best",
          "reason": "You control the floor of supported versions, use the store for anything native, and reserve OTA for fast, low-risk bundle fixes within store rules."
        },
        {
          "name": "Store updates only, no version gate",
          "verdict": "ok",
          "reason": "Simplest and fully compliant, but you must support every old version forever and cannot hotfix quickly."
        },
        {
          "name": "Ship most changes via OTA to dodge review",
          "verdict": "weak",
          "reason": "Fragile bundle/native mismatches, and it violates store rules — a fast path to app removal."
        }
      ],
      "recommendation": "Always implement a server-driven minimum-version check so you can force-upgrade clients that break your backend contract. Use store updates for native changes, and if you are on a JS framework, use OTA only for compliant bug fixes with a boot-time rollback to the last good bundle."
    },
    "commonMistakes": [
      "No minimum-version gate, so removed APIs silently break old installs",
      "Using OTA to ship native-scope features and risking app removal",
      "Shipping an OTA bundle incompatible with the installed native runtime (crash on launch)",
      "A forced-update wall whose store link or logic can trap users with no way forward"
    ],
    "seniorNotes": "Treat the minimum-supported-version endpoint as core backend infrastructure — it is your only lever over the un-updating long tail, and it must fail safe (never accidentally lock everyone out). Version your API and coordinate deprecations with the min-version gate. For OTA, pin each bundle to a compatible native binary range and always keep a last-known-good bundle for automatic rollback. Understand the store rules well enough to know exactly what OTA may and may not change, because getting pulled halts every channel.",
    "interviewQuestions": [
      "What are the ways to update a shipped mobile app, and when do you use each?",
      "How do OTA/hot updates work and what are their limits under store rules?",
      "How would you force users off a broken old version?"
    ],
    "interviewAnswers": [
      "Store updates deliver a new signed native binary and are required for any native, permission, or entitlement change. In-app update prompts detect a newer store version and nudge or block users to update (Android has an API; iOS is a custom prompt deep-linking to the store). OTA/hot updates swap a JS bundle at runtime for JS-based apps — used only for fast, low-risk fixes within store rules. Pick the lightest channel the change legitimately allows.",
      "OTA works because a JS bundle is interpreted data, so a service hosts bundle versions keyed to a native binary and the app downloads and applies the newest compatible one on launch, with rollback if it crashes on boot. Limits: stores forbid using downloaded code to change the app's primary purpose or bypass review, so OTA is only for bug fixes and content — native code, permissions, and entitlements still need a reviewed store release.",
      "Add a launch-time call to a config endpoint returning the minimum supported version. If the installed version is below it, show a blocking upgrade wall that deep-links to the store; softer cases get a dismissible prompt. The gate must fail safe so a config error never locks out everyone, and it lets you retire old API versions confidently since sub-floor clients cannot proceed."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Launch-time update decision (pseudocode)",
        "code": "on app launch:\n    cfg = fetch(\"/config/version\")           # { minVersion, latestVersion, otaBundle }\n    if installedVersion < cfg.minVersion:\n        showBlockingUpgradeWall(storeLink)    # forced: cannot proceed\n    else if installedVersion < cfg.latestVersion:\n        showDismissibleUpdatePrompt(storeLink)\n\n    # OTA for JS-based apps only\n    if cfg.otaBundle.compatibleWith(nativeBinary) and cfg.otaBundle.newer():\n        bundle = download(cfg.otaBundle)\n        if bootTest(bundle) == OK: apply(bundle)\n        else: rollbackTo(lastGoodBundle)      # never brick on a bad bundle"
      }
    ],
    "resources": [
      {
        "label": "Apple App Store Review Guidelines (3.3/2.5 on downloaded code)",
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "kind": "docs"
      },
      {
        "label": "Google Play launch checklist",
        "url": "https://developer.android.com/distribute/best-practices/launch",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "monetization-basics",
    "phase": 10,
    "phaseName": "Build, Release & Distribution",
    "orderIndex": 6,
    "estimatedMins": 35,
    "prerequisites": [
      "app-store-submission"
    ],
    "title": "Monetization: IAP, Subscriptions & Ads",
    "eli5": "Apps make money in a few ways: you buy something inside the app, you pay every month for it, or you watch ads. When you buy digital things, the store handles the payment and takes a cut, and your server should double-check the receipt so nobody cheats.",
    "analogy": "In-app purchases are like a theme park: you cannot bring your own cash register for rides (digital goods) — you must use the park's tickets (store billing), and the park keeps a percentage. But food you consume off-site (physical goods/services) can be paid however you like. Either way, the ride operator scans your ticket (receipt validation) to be sure it is real.",
    "explanation": "The main mobile revenue models are one-time in-app purchases, recurring subscriptions, and advertising. For digital goods and subscriptions consumed inside the app, both stores require you to use their billing systems and take a commission (commonly around 15-30%). Physical goods and real-world services are exempt and can use any payment processor. Ads are integrated via ad SDKs that show banners, interstitials, or rewarded videos.\n\nHow Android does it vs How iOS does it: Android uses Google Play Billing and provides purchase tokens you verify server-side via the Play Developer API. iOS uses StoreKit and issues signed transactions/receipts you validate with the App Store Server API. Both mandate their billing for digital goods; Apple is especially strict about not linking out to external payment for in-app digital purchases.",
    "technicalDeep": "A purchase flow: the client requests products from the store, the user pays through the store UI, and the store returns a signed proof (a receipt or purchase token / signed JWS transaction). You must validate that proof on your server against the store's API before granting entitlements — never trust the client, which can be tampered with or replayed. For subscriptions you also handle renewals, grace periods, billing retries, upgrades/downgrades, and refunds, driven by server-to-server notifications (RTDN on Play, App Store Server Notifications) so entitlement state stays correct even when the app is closed.\n\nHow Android does it vs How iOS does it: Play sends Real-time Developer Notifications to your backend and you acknowledge/consume purchases within a window or they auto-refund. iOS sends App Store Server Notifications v2 as signed JWS and models the subscription lifecycle via the App Store Server API. Both require idempotent server handling keyed on the transaction/order ID to avoid double-granting.",
    "whatBreaks": "Granting entitlements based only on a client-side 'purchase succeeded' callback lets attackers fake purchases — you must validate server-side. Ignoring renewal notifications leaves cancelled users with access or paying users locked out. Not acknowledging a Play purchase in time auto-refunds it. Non-idempotent receipt handling double-grants on retries. Linking to external payment for digital goods gets an iOS rejection. Aggressive ads or undisclosed ad tracking can breach store policy and privacy rules.",
    "efficientWay": {
      "title": "Building a reliable purchase system",
      "approaches": [
        {
          "name": "Store billing + server-side validation + webhook-driven entitlements",
          "verdict": "best",
          "reason": "The server is the source of truth: validated receipts and lifecycle webhooks keep entitlements correct even offline, and idempotency prevents double-grants."
        },
        {
          "name": "Store billing with client-side entitlement checks only",
          "verdict": "ok",
          "reason": "Fast to build and works for low-value cosmetic unlocks, but it is spoofable and drifts out of sync on renewals/refunds."
        },
        {
          "name": "External payment links to dodge the store cut",
          "verdict": "weak",
          "reason": "Violates store rules for digital goods and gets you rejected or removed — the commission is not optional here."
        }
      ],
      "recommendation": "Use the platform billing for digital goods, always validate the receipt/token server-side against the store API, and drive entitlement state from server-to-server notifications with idempotent, transaction-ID-keyed handlers. Treat your backend, not the app, as the source of truth for who owns what."
    },
    "commonMistakes": [
      "Trusting the client's purchase callback and skipping server-side receipt validation",
      "Ignoring renewal/refund webhooks so entitlements drift out of sync",
      "Non-idempotent receipt handling that double-grants on retries",
      "Using external payment for digital goods and getting rejected by Apple"
    ],
    "seniorNotes": "Model entitlements in your backend as the canonical state and treat store notifications as the event stream that mutates it; the app merely reflects that state. Make every validation and webhook handler idempotent on the transaction/order ID, and reconcile periodically against the store's server API to catch missed webhooks. Plan for edge cases: grace periods, billing retries, family sharing, refunds, and cross-platform accounts where a user subscribes on iOS but uses Android. Factor the ~15-30% store fee into unit economics from day one, and keep ad SDKs behind consent for privacy compliance.",
    "interviewQuestions": [
      "Why must in-app purchase receipts be validated on the server, not the client?",
      "How do you keep subscription entitlements in sync over their lifecycle?",
      "When are you allowed to use a payment processor other than the store's billing?"
    ],
    "interviewAnswers": [
      "The client is untrusted — a tampered or replayed 'purchase succeeded' callback can fake ownership. The store returns a signed receipt/token that only its servers can vouch for, so you send it to your backend, validate it against the store's server API, and only then grant entitlements. The server becomes the source of truth, and validation must be idempotent on the transaction ID so retries do not double-grant.",
      "Drive entitlement state from server-to-server notifications (Play RTDN, App Store Server Notifications): renewals, cancellations, grace periods, billing retries, and refunds each update the canonical record in your backend. Handle them idempotently keyed on order/transaction ID, and periodically reconcile against the store's server API to recover from any missed webhook, so a closed app never leaves state stale.",
      "Store billing is mandatory for digital goods and subscriptions consumed in the app, and the store takes its commission. You may use an outside processor for physical goods and real-world services (rides, food delivery, physical retail) since those fall outside the digital-goods rule. Trying to route in-app digital purchases through external payment violates the guidelines, especially Apple's."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Server-side receipt validation (pseudocode)",
        "code": "# Client: never grant access here\npurchase = store.buy(productId)          # returns signed receipt/token\nPOST /purchases  { receipt: purchase.proof }\n\n# Server: source of truth\nhandle POST /purchases (receipt):\n    result = storeApi.validate(receipt)  # Play Developer API | App Store Server API\n    if not result.valid: return 400\n    if seen(result.transactionId): return 200   # idempotent\n    grantEntitlement(user, result.product)\n    ack(result)                          # Play requires timely acknowledge\n\n# Async lifecycle keeps state correct\nwebhook /store-notifications (event):    # RTDN / App Store Server Notifications\n    if event.type in [RENEWED, CANCELLED, REFUNDED, GRACE]:\n        updateEntitlement(event, idempotentKey = event.transactionId)"
      }
    ],
    "resources": [
      {
        "label": "Apple App Store Review Guidelines (business / payments)",
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "kind": "docs"
      },
      {
        "label": "Google Play launch checklist",
        "url": "https://developer.android.com/distribute/best-practices/launch",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "choosing-your-stack",
    "phase": 10,
    "phaseName": "Build, Release & Distribution",
    "orderIndex": 7,
    "estimatedMins": 40,
    "prerequisites": [
      "build-systems-signing",
      "mobile-cicd",
      "monetization-basics"
    ],
    "title": "Choosing Your Stack & Mobile Career",
    "eli5": "There are several toolkits for building phone apps. Some talk to the phone directly, others let you write once and run on both phones. Picking one is about your team, your app, and how much you care about being close to the metal. The good news: everything you learned about building, signing, releasing, and monetizing works no matter which toolkit you pick.",
    "analogy": "Choosing a stack is like choosing how to build a house across two plots (Android and iOS). Native is hiring two specialist crews, one per plot, for the best possible fit. Cross-platform (Flutter, React Native) is one crew with a clever system that builds both houses from shared blueprints. KMP is sharing the plumbing and wiring blueprints (business logic) while each crew still finishes its own interior. The permits, foundations, and utility hookups (signing, review, releases) are the same paperwork whichever crew you hire.",
    "explanation": "The concepts in this course — build variants and signing, store submission and review, staged rollout, CI/CD, updates, and monetization — are framework-agnostic. What changes with your stack is how you write UI and access platform features, not the release lifecycle. The main options: fully native (Kotlin/Swift) for maximum platform fidelity; Flutter, which draws its own UI for consistency and speed; React Native, which uses native views driven by JavaScript and enables OTA; and Kotlin Multiplatform (KMP), which shares business logic while keeping native UI. Choose based on team skills, performance and platform-integration needs, time-to-market, and long-term maintenance.\n\nHow Android does it vs How iOS does it: Native means two codebases and two skill sets (Kotlin + Jetpack Compose vs Swift + SwiftUI), maximum control, most duplication. Cross-platform collapses UI work into one codebase but you still drop to native for deep platform features, and you still sign, submit, and release through each platform's store exactly as a native app does.",
    "technicalDeep": "The real trade-off axes are: performance and animation fidelity, access to the latest platform APIs on day one, binary size and startup, hiring pool, and code-sharing ratio. Native wins on immediacy of new-OS features and raw performance. Flutter ships a rendering engine so UI is pixel-consistent and fast but the app is heavier and diverges from native look unless themed. React Native reuses platform widgets and unlocks OTA JS updates, at the cost of a JS-native bridge boundary that can bottleneck. KMP shares Kotlin business logic across platforms while UI stays native, maximizing correctness reuse without giving up native UX. Whatever you pick, the deployment substrate — Gradle/Xcode builds, keystore/cert signing, store review, tracks and staged rollout, Fastlane CI, receipt validation — is identical, which is why those are the durable skills.\n\nHow Android does it vs How iOS does it: A cross-platform app still produces an AAB signed by a keystore for Play and a signed .ipa with a provisioning profile for the App Store; it still faces Apple's stricter review and Google's automated one; it still uses TestFlight and Play tracks. The framework changes the inside of the box, not the box or the loading dock.",
    "whatBreaks": "Picking a stack for hype rather than team skills leads to a codebase nobody can maintain. Assuming cross-platform means zero native code — you always need some for platform features, and underestimating that blows timelines. Choosing native for a small team doubles the release, test, and on-call surface. Ignoring that new OS features may lag in cross-platform frameworks can block a must-have integration. Career-wise, learning only one framework's syntax and not the underlying lifecycle leaves you stranded when the framework falls out of favor.",
    "efficientWay": {
      "title": "Deciding native vs cross-platform (and growing as a mobile engineer)",
      "approaches": [
        {
          "name": "Decision framework: match stack to team, app needs, and time-to-market",
          "verdict": "best",
          "reason": "There is no universally right stack; scoring against your real constraints picks the one you can actually ship and maintain."
        },
        {
          "name": "Default to cross-platform for a small team / MVP",
          "verdict": "ok",
          "reason": "One codebase and faster launch fits most early products, but you must budget for the native code deep features still require."
        },
        {
          "name": "Always go native for everything",
          "verdict": "weak",
          "reason": "Best fidelity but two codebases, two skill sets, and double the release/test/on-call load — rarely justified for a small team or simple app."
        }
      ],
      "recommendation": "Score candidates against team expertise, performance and platform-integration needs, time-to-market, and maintenance cost — not popularity. Small teams shipping standard apps usually win with cross-platform; performance-critical or deeply platform-integrated apps lean native; large orgs sharing logic like KMP. Then invest your own learning in the framework-agnostic lifecycle (build, sign, release, monetize, observe), because that is what transfers across any stack and any job."
    },
    "commonMistakes": [
      "Choosing a framework by hype instead of team skills and app requirements",
      "Believing cross-platform means never writing native code",
      "Going fully native with a small team and drowning in duplicated release/test work",
      "Learning only framework syntax and not the underlying build/release/system-design lifecycle"
    ],
    "seniorNotes": "Senior mobile engineers are judged less on one framework and more on system design: offline-first sync, caching, background work, push/notification architecture, release safety (staged rollout + kill-switches), observability (crash-free rate, ANR/hang, adoption), and secure client-server contracts including receipt validation and API versioning for the un-updating long tail. The stack decision is a reversible-cost trade-off you should be able to defend with constraints, not preferences. Career path runs from building features to owning the release pipeline, mobile platform/architecture, and cross-team standards. Because the lifecycle is identical across stacks, deep lifecycle mastery is what compounds and travels between jobs.",
    "interviewQuestions": [
      "How would you choose between native, Flutter, React Native, and KMP for a new app?",
      "Which parts of the mobile release lifecycle change when you switch frameworks, and which stay the same?",
      "What separates a senior mobile engineer from a mid-level one?"
    ],
    "interviewAnswers": [
      "Score each option against concrete constraints: team skills and hiring pool, required performance and animation fidelity, how deeply you need bleeding-edge platform APIs, time-to-market, binary size, and maintenance cost. Native fits performance-critical, deeply integrated apps and larger teams; Flutter fits UI-consistent, fast-to-build apps; React Native fits JS-heavy teams wanting OTA; KMP fits orgs wanting shared business logic with native UI. There is no universal winner — I would justify the pick from those constraints, not popularity.",
      "The UI layer and platform-feature access change — how you write screens and call native APIs. Everything downstream stays the same: you still produce a signed AAB and .ipa, submit to each store, pass Apple's stricter and Google's automated review, use TestFlight and Play tracks, run staged rollouts, wire Fastlane CI/CD, handle updates and min-version gates, and validate purchase receipts server-side. The framework changes the inside of the box, not the release pipeline around it.",
      "A mid-level engineer ships features in one framework; a senior owns the lifecycle and system design — offline-first sync, caching, background/push architecture, release safety with staged rollout and kill-switches, observability on crash-free and ANR rates, secure client-server contracts with API versioning and receipt validation, and defensible stack decisions. Seniority shows in reasoning about the un-updating long tail, blast-radius control, and trade-offs, not in framework trivia."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Stack decision framework (pseudocode)",
        "code": "score(stack) =\n      w1 * teamFamiliarity(stack)\n    + w2 * performanceFit(stack, app)\n    + w3 * platformApiImmediacy(stack)     # day-one new-OS features\n    + w4 * timeToMarket(stack)\n    + w5 * codeShareRatio(stack)\n    - w6 * maintenanceCost(stack)\n\nchoose = argmax over { native, flutter, reactNative, kmp } of score\n\n# Invariant across every choice:\nrelease(app):\n    build + sign(keystore | cert+profile)\n    submit(playReview, appStoreReview)\n    stagedRollout(tracks/testflight)\n    validateReceiptsServerSide()\n# -> lifecycle mastery transfers to any stack and any job"
      }
    ],
    "resources": [
      {
        "label": "roadmap.sh Android",
        "url": "https://roadmap.sh/android",
        "kind": "course"
      },
      {
        "label": "roadmap.sh iOS",
        "url": "https://roadmap.sh/ios",
        "kind": "course"
      },
      {
        "label": "Fastlane",
        "url": "https://fastlane.tools/",
        "kind": "docs"
      },
      {
        "label": "Android app bundles (AAB)",
        "url": "https://developer.android.com/guide/app-bundle",
        "kind": "docs"
      }
    ]
  }
]
