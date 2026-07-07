import type { CurriculumTopic } from '@/types'

/** Mobile Development — Phase 7: Device Capabilities & Native Integration (7 topics). */
export const MOBILE_P7: CurriculumTopic[] = [
  {
    "id": "permission-model",
    "phase": 7,
    "phaseName": "Device Capabilities & Native Integration",
    "orderIndex": 1,
    "estimatedMins": 30,
    "prerequisites": [
      "threading-models"
    ],
    "title": "The Runtime Permission Model",
    "eli5": "Your app can't just grab the camera, your location, or your contacts. It has to ask, right when it needs them, and you can say yes, no, or 'only this once'. And you can change your mind later in Settings, so the app must always be ready to hear 'no'.",
    "analogy": "It's like a houseguest who must knock and ask before entering each room, explaining why ('I need the kitchen to cook dinner'). You can grant access to just the kitchen, deny the bedroom, or later revoke the key you gave them. A good guest never assumes a door is unlocked.",
    "explanation": "Sensitive capabilities — location, camera, microphone, contacts, notifications — are guarded by runtime permissions the user grants explicitly. The modern rules: ask at the point of use (not all at startup), show a clear rationale for why you need it, and handle every outcome — granted, denied, denied-permanently, or granted with reduced scope. Crucially, permission is revocable at any time from Settings, so your app must re-check before each use rather than assuming a past 'yes' still holds.\n\n[Android vs iOS] Android declares permissions in the manifest and requests dangerous ones at runtime; the user can pick 'while using the app', 'only this time', or deny, and repeated denials become permanent (you must send them to Settings). iOS shows a system prompt exactly once per permission — if the user denies, you can't prompt again and must deep-link to Settings; iOS also supports scoped grants like approximate location and limited photo-library access.",
    "technicalDeep": "Permissions are enforced by the OS, not your app: the API call itself fails or returns empty if the grant is missing, so you check-then-call and handle denial gracefully. Grants have states beyond yes/no: 'ask every time' (one-shot), 'while in use' vs 'always' (background), and 'partial/approximate' scopes. The first prompt is a scarce resource — especially on iOS where you get exactly one system dialog — so you show an in-app pre-permission rationale first to avoid burning it on a confused 'no'. Because grants can be revoked externally, permission state is not something you cache; you query it right before use.\n\n[Android vs iOS] Android: shouldShowRequestPermissionRationale tells you whether to show an explainer; two denials lock out the dialog, routing users to app settings. Background location and notifications are now separate, later-stage requests. iOS: each capability has its own Info.plist usage-description string (missing it crashes the app on request), authorization status is queried per API (e.g. AVCaptureDevice, CLLocationManager), and reduced scopes (approximate location, limited photos) return partial data your code must handle.",
    "whatBreaks": "Requesting everything at launch: users deny in bulk before understanding why, permanently locking features. Assuming a past grant holds: the user revoked it in Settings, so the next call fails or returns empty and the feature crashes or misbehaves. Missing usage-description on iOS: requesting a permission without the Info.plist string crashes the app immediately. Not handling reduced scope: treating approximate location as precise, or limited photo access as full-library, produces wrong results. Re-prompting after permanent denial: nothing happens (Android) or was never allowed (iOS), so the user is stuck with no path forward.",
    "efficientWay": {
      "title": "Requesting Permissions the Right Way",
      "approaches": [
        {
          "name": "Just-in-time request with a pre-permission rationale, handling every outcome",
          "verdict": "best",
          "reason": "Asking at point-of-use with context maximizes grant rates and keeps the one-shot iOS prompt for a moment the user understands; handling denial/partial scope keeps the app robust."
        },
        {
          "name": "Request the minimum scope and upgrade later",
          "verdict": "ok",
          "reason": "Asking for approximate location or limited photos first respects privacy and raises acceptance, but you must design flows that work with reduced data and only escalate when truly needed."
        },
        {
          "name": "Request all permissions upfront at first launch",
          "verdict": "weak",
          "reason": "Users deny without context, burn the one-shot prompt, and permanently block features. It reads as invasive and tanks grant rates."
        }
      ],
      "recommendation": "Ask only when the feature is invoked, precede the system dialog with an in-app explanation, request the narrowest scope that works, and always handle granted/denied/permanently-denied/partial — re-checking before each use since grants are revocable."
    },
    "commonMistakes": [
      "Requesting all permissions at app launch instead of at the point of use with a rationale",
      "Caching a past grant and skipping the re-check, then crashing when the user revoked it in Settings",
      "Forgetting the iOS Info.plist usage-description string and crashing on the permission request",
      "Treating approximate location or limited photo access as if it were full precise/library access",
      "Re-prompting after permanent denial instead of deep-linking the user to app Settings"
    ],
    "seniorNotes": "Treat the permission dialog as a UX conversion funnel, not a checkbox: the pre-permission primer, timing, and copy directly move grant rates, and on iOS the single system prompt is irreplaceable once spent. Senior engineers design features to degrade gracefully under reduced scope (approximate location, limited photos, denied notifications) and always query authorization state at the call site because it can flip in Settings between sessions. Build the 'go to Settings' recovery path for permanent denial as a first-class flow.",
    "interviewQuestions": [
      "Why should you request permissions at the point of use rather than at app launch?",
      "How does the iOS one-shot permission prompt change your strategy compared to Android?",
      "How do you handle a permission that was granted before but has since been revoked?"
    ],
    "interviewAnswers": [
      "At the point of use the user has context — they just tapped 'attach photo' or 'find near me' — so the request makes sense and grant rates are much higher. Asking at launch strips that context, so users deny in bulk, which on iOS permanently spends the one system prompt and on Android quickly leads to permanent denial. Just-in-time requests, ideally preceded by an in-app rationale, convert far better and don't lock out features.",
      "iOS shows the system permission dialog exactly once; if the user denies, you cannot prompt again and must deep-link them to Settings. So the strategy is to never waste that prompt — show an in-app primer explaining the value first, and only trigger the real dialog when the user is clearly ready and in context. Android is more forgiving (you can re-ask until two denials), but the same primer approach helps there too.",
      "You never assume a past grant still holds — permissions are revocable from Settings at any time. Before each use you query the current authorization status; if it's now denied you skip the API call (which would fail or return empty) and either show an inline explanation or deep-link the user to Settings to re-enable it. Permission state is checked at the call site, never cached across sessions."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: just-in-time permission flow",
        "code": "function onAttachPhotoTapped():\n    status = permissions.check(CAMERA)      // re-check every time\n    switch status:\n        case GRANTED:\n            openCamera()\n        case NOT_ASKED:\n            showPrimer(\"We use the camera to attach a photo\")  // rationale\n            if user.acceptsPrimer():\n                result = permissions.request(CAMERA)  // the real system dialog\n                if result == GRANTED: openCamera()\n        case DENIED_PERMANENTLY:\n            showSettingsDeepLink(\"Enable Camera in Settings\")\n        case GRANTED_PARTIAL:                 // e.g. limited photo access\n            openLimitedPicker()"
      }
    ],
    "resources": [
      {
        "label": "Android Permissions Overview",
        "url": "https://developer.android.com/guide/topics/permissions/overview",
        "kind": "docs"
      },
      {
        "label": "Apple UserNotifications (permission model)",
        "url": "https://developer.apple.com/documentation/usernotifications",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "location-maps",
    "phase": 7,
    "phaseName": "Device Capabilities & Native Integration",
    "orderIndex": 2,
    "estimatedMins": 35,
    "prerequisites": [
      "permission-model"
    ],
    "title": "Location & Maps",
    "eli5": "Your phone can figure out where it is using GPS, Wi-Fi, and cell towers. Finding your exact spot is like turning on a bright flashlight — accurate but battery-hungry. Sometimes the app only needs to know 'which city', which is much cheaper. And apps must ask before watching where you go.",
    "analogy": "Precise GPS is a sniper scope: exact but power-hungry and slow to focus. Approximate location is glancing at a map — 'somewhere in this neighborhood', instant and cheap. Background location is leaving a trail of breadcrumbs even when you're not looking at the app, which is why the OS guards it especially tightly.",
    "explanation": "Location comes at different precisions and costs. Precise location (GPS) pins you to meters but drains battery and takes time to lock; approximate/coarse location (Wi-Fi and cell-based) gives a rough area cheaply and instantly. There's also a big divide between foreground location (only while you're using the app) and background location (tracked even when the app is closed) — the latter is heavily gated because it's the most privacy-sensitive capability on the device. Geofencing lets the OS watch for you entering/leaving a region and wake your app only then, far cheaper than continuous tracking.\n\n[Android vs iOS] Android splits ACCESS_FINE_LOCATION (precise) from ACCESS_COARSE_LOCATION (approximate) and makes ACCESS_BACKGROUND_LOCATION a separate, later request; it offers a fused location provider that blends GPS/Wi-Fi/cell and a Geofencing API. iOS uses CLLocationManager with 'when in use' vs 'always' authorization, offers reduced-accuracy mode (the user can grant approximate only), significant-location-change monitoring, and region monitoring (geofences) plus visit monitoring — all designed to minimize the GPS duty cycle.",
    "technicalDeep": "Battery cost scales with how often and how precisely you sample: continuous high-accuracy GPS is the worst case; requesting the lowest accuracy that satisfies the use case, the largest acceptable update interval, and stopping updates when idle are the main levers. Fused/blended providers pick the cheapest sensor that meets your accuracy request. Geofencing and significant-change monitoring flip the model from polling to interrupts — the OS uses low-power signals (cell/Wi-Fi transitions) to detect region crossings and wakes you only on events, so you get background awareness without holding GPS on. Reduced-accuracy grants return deliberately fuzzed coordinates, so code must not assume meter-level precision.\n\n[Android vs iOS] Android: setPriority (high accuracy vs balanced vs low power) and update interval control the duty cycle; background location requires the separate permission plus often a foreground service for continuous tracking. iOS: desiredAccuracy and distanceFilter tune sampling, allowsBackgroundLocationUpdates plus 'always' authorization enable background, and significant-change / region monitoring keep the app updated at near-zero power. Both let the user downgrade you to approximate at any time.",
    "whatBreaks": "Continuous high-accuracy GPS: leaving precise updates running drains the battery fast and gets the app flagged as a power hog. Assuming precise when granted approximate: the user chose reduced accuracy, so meter-level logic (turn-by-turn, geofence at 10m) misbehaves on fuzzed coordinates. Skipping the separate background grant: requesting background location bundled with foreground, or forgetting it entirely, means background tracking silently fails. Polling instead of geofencing: manually sampling location to detect arrival wastes power versus letting the OS interrupt you. No graceful stop: not stopping updates when the feature closes leaks battery indefinitely.",
    "efficientWay": {
      "title": "Getting Location Without Killing the Battery",
      "approaches": [
        {
          "name": "Request the minimum accuracy/frequency and use geofencing for background events",
          "verdict": "best",
          "reason": "Matching accuracy to need and switching from polling to OS-driven region events gives the awareness you need at a fraction of the battery cost."
        },
        {
          "name": "Balanced-power foreground updates with a coarse fallback",
          "verdict": "ok",
          "reason": "Fine for a map screen open in the foreground, but continuous updates still cost power — stop them when the screen closes and drop to coarse when precision isn't needed."
        },
        {
          "name": "Continuous high-accuracy GPS in the background",
          "verdict": "weak",
          "reason": "Maximum battery drain, maximum privacy exposure, and the OS/user will flag or restrict it. Only justified for active navigation with a visible indicator."
        }
      ],
      "recommendation": "Ask for the coarsest accuracy that works, the longest acceptable update interval, and stop updates when idle. Use geofencing/significant-change monitoring for background awareness, request background location as its own step, and always handle reduced-accuracy grants."
    },
    "commonMistakes": [
      "Running continuous high-accuracy GPS when coarse or infrequent updates would do, draining battery",
      "Assuming precise coordinates when the user granted only approximate/reduced accuracy",
      "Forgetting that background location is a separate, later permission and letting background tracking silently fail",
      "Polling location to detect arrival instead of using geofencing/region monitoring",
      "Not stopping location updates when the feature is closed, leaking battery"
    ],
    "seniorNotes": "Location is a duty-cycle optimization: every design decision (accuracy, interval, foreground vs background, poll vs geofence) trades precision for battery and privacy. Senior engineers pick the cheapest sensor mode that satisfies the actual UX, lean on OS interrupt-style APIs (geofences, significant-change) instead of polling, and treat background location as a privilege that needs a clear user benefit and its own consent step. Always handle the approximate-only grant path — a growing share of users choose it — and instrument real-world battery impact, not just correctness.",
    "interviewQuestions": [
      "What's the difference between precise and approximate location, and how does each affect battery?",
      "Why is background location gated more heavily than foreground, and how do you request it?",
      "How does geofencing save power compared to continuously polling location?"
    ],
    "interviewAnswers": [
      "Precise location uses GPS to pin you to meters but is slow to lock and battery-intensive; approximate location derives a rough area from Wi-Fi and cell signals, which is instant and cheap. The more precise and more frequent your sampling, the higher the battery cost, so you request the lowest accuracy and longest interval that satisfies the feature, and let a fused/blended provider pick the cheapest sensor that meets that bar.",
      "Background location tracks the user even when they're not in the app, which is the most privacy-sensitive signal on the device, so both platforms require an explicit, separate grant ('always' on iOS, ACCESS_BACKGROUND_LOCATION requested after foreground on Android) and often a visible indicator or foreground service. You request foreground location first, establish the value, then ask for background as its own step — bundling them or skipping it makes background tracking silently fail.",
      "Geofencing flips polling into interrupts: instead of your app repeatedly sampling GPS to check whether the user arrived, you register a region and the OS uses low-power signals (cell/Wi-Fi transitions) to detect the crossing and wakes your app only on the enter/exit event. The expensive GPS stays off almost all the time, so you get background location awareness at near-zero battery cost."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: geofence instead of polling",
        "code": "// EXPENSIVE: poll GPS forever to detect arrival\nwhile true:\n    loc = gps.getPreciseLocation()     // GPS on continuously = battery drain\n    if distance(loc, store) < 100m: notifyArrived()\n    sleep(30s)\n\n// CHEAP: let the OS watch the region and wake you\ngeofence = { center: store, radius: 100m }\nlocationManager.addGeofence(geofence, on = [ENTER, EXIT])\nonGeofenceEvent(event):               // OS interrupts you only on crossing\n    if event.type == ENTER: notifyArrived()\n\n// Respect reduced accuracy\nif locationManager.accuracy == APPROXIMATE:\n    useCityLevelLogic()               // don't assume meter precision"
      }
    ],
    "resources": [
      {
        "label": "Android Permissions Overview",
        "url": "https://developer.android.com/guide/topics/permissions/overview",
        "kind": "docs"
      },
      {
        "label": "Android Guide to Background Work",
        "url": "https://developer.android.com/guide/background",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "camera-media",
    "phase": 7,
    "phaseName": "Device Capabilities & Native Integration",
    "orderIndex": 3,
    "estimatedMins": 35,
    "prerequisites": [
      "permission-model"
    ],
    "title": "Camera, Media & the Gallery",
    "eli5": "Apps can take photos and pick pictures from your gallery, but they shouldn't get to rummage through all your photos just to let you attach one. Modern phones hand the app only the single photo you picked. Also, big photos and videos are huge, so apps must handle them carefully or they run out of memory.",
    "analogy": "The old way was giving a repairman the keys to your whole house to fix one faucet. The new way is a photo picker: you hand them exactly the one item they need through a slot, and they never see the rest. And moving a giant couch (a 4K video) through a narrow doorway needs planning, or it gets stuck (out-of-memory).",
    "explanation": "Two capabilities: capturing new media with the camera, and accessing existing media in the gallery. The modern, privacy-first approach is scoped access — instead of granting blanket read access to the entire photo library, the app uses a system photo picker that returns only the item(s) the user explicitly chose, often with no permission prompt at all. Beyond access, media is heavy: a single photo carries EXIF metadata (orientation, GPS, timestamp), and full-resolution images and videos are large enough to exhaust memory if loaded naively, so you must downsample, stream, and respect orientation.\n\n[Android vs iOS] Android offers the Photo Picker (returns chosen items without full-storage permission) and scoped storage that walls off the shared media store; capturing uses CameraX/Camera2 or an intent to the camera app. iOS provides PHPickerViewController (out-of-process, returns only selected assets, no library permission needed) and 'limited' photo-library access when you do need the framework; capture uses AVFoundation/UIImagePickerController. Both strip or gate location EXIF unless the user allows it.",
    "technicalDeep": "Scoped/photo-picker access decouples 'let the user pick a photo' from 'grant access to all photos' — the picker runs in a separate process, so your app only ever receives the chosen asset's data, minimizing the permission surface. EXIF orientation is the classic footgun: the raw pixel buffer may be sideways and only the EXIF orientation tag says which way is up, so you must apply it or images render rotated. Large-file handling means never decoding a full-resolution bitmap into memory when you only display a thumbnail — you request a downsampled/target-size decode, and for video you stream rather than load. Uploads of large media should be chunked/resumable and done off the main thread. Content URIs/asset identifiers are references, not file paths — you resolve them through the platform's provider, and access may be temporary.\n\n[Android vs iOS] Android: the picker returns a content URI you read via ContentResolver; BitmapFactory inSampleSize downsamples at decode time; EXIF is read via ExifInterface. iOS: PHPicker returns item providers you load as downscaled images; PHImageManager requests a target size so the system delivers an appropriately scaled asset; orientation is carried on UIImage. On both, GPS EXIF is withheld unless the user grants location metadata.",
    "whatBreaks": "Requesting full library access: asking for blanket photo permission when the picker would do is invasive, lowers grant rates, and is increasingly discouraged by stores. Ignoring EXIF orientation: images display rotated 90/180 degrees because the app painted raw pixels without applying the orientation tag. Loading full-res into memory: decoding a 12MP photo (or several) to show thumbnails triggers out-of-memory crashes, especially in a scrolling list. Treating content URIs as file paths: assuming a stable filesystem path fails under scoped storage and after the temporary grant expires. Blocking the UI thread: decoding or uploading large media on the main thread janks or freezes the app.",
    "efficientWay": {
      "title": "Handling Photos and Video Safely",
      "approaches": [
        {
          "name": "System photo picker + downsampled decode + off-thread upload",
          "verdict": "best",
          "reason": "The picker returns only the chosen item with no library permission, downsampling avoids out-of-memory, and off-thread work keeps the UI fluid. Privacy-first and robust."
        },
        {
          "name": "Full library permission with careful memory management",
          "verdict": "ok",
          "reason": "Necessary only when the app genuinely needs to browse or manage the whole library (a gallery app); otherwise it's excess permission. If used, you still must downsample and respect EXIF."
        },
        {
          "name": "Blanket storage access, load full-resolution bitmaps on the main thread",
          "verdict": "weak",
          "reason": "Over-permissioned, out-of-memory-prone, and janky. Rotated images and crashes on large files are near-guaranteed."
        }
      ],
      "recommendation": "Default to the system photo picker (no permission, only the chosen asset), decode to the display size you actually need, apply EXIF orientation, and do decoding/uploads off the main thread with chunked/resumable transfers for large files."
    },
    "commonMistakes": [
      "Requesting full photo-library permission when the system picker would return the chosen item without it",
      "Rendering images without applying EXIF orientation, so photos appear rotated",
      "Decoding full-resolution images into memory for thumbnails and crashing with out-of-memory",
      "Treating content URIs / asset identifiers as permanent file paths under scoped storage",
      "Decoding or uploading large media on the main thread and freezing the UI"
    ],
    "seniorNotes": "The privacy trend is unmistakable: the platform picker is becoming the default and blanket library access the exception you must justify. Senior engineers treat media as a memory-and-bandwidth problem — always decode to target size, apply EXIF, stream video, and make uploads chunked/resumable and cancelable. They also handle the reference-not-path reality of scoped storage (resolve through the provider, don't cache file paths) and the temporary nature of grants. Test with real multi-megapixel photos and long 4K videos on a low-RAM device, where the naive path falls apart.",
    "interviewQuestions": [
      "What is scoped media access / the system photo picker, and why is it preferred over full library permission?",
      "Why do images sometimes appear rotated, and how do you fix it?",
      "How do you display and upload large photos/videos without running out of memory or freezing the UI?"
    ],
    "interviewAnswers": [
      "The system photo picker (Android Photo Picker, iOS PHPickerViewController) runs out-of-process and returns only the specific asset(s) the user selected, typically with no permission prompt at all. It's preferred because it minimizes the permission surface — the app never gains access to the whole library — which respects privacy, raises grant rates, and aligns with store policies. You only request full library access for apps that genuinely need to browse or manage all media.",
      "The camera often stores pixels in a fixed sensor orientation and records the intended 'up' direction in the EXIF orientation tag rather than rotating the pixels. If you paint the raw buffer without reading that tag, the image renders sideways or upside down. The fix is to read the EXIF orientation and apply the corresponding transform (or use an image API that honors it) before display or upload.",
      "You never load full resolution when you only need a smaller size: decode with downsampling to the target display dimensions (inSampleSize on Android, a target-size PHImageManager request on iOS), and for video stream rather than load it whole. All decoding and uploading happens off the main thread, and large uploads are chunked/resumable and cancelable. This keeps memory bounded and the UI responsive even with many multi-megapixel assets."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: pick, downsample, respect EXIF, upload off-thread",
        "code": "function onAttachTapped():\n    // System picker: no library permission, returns ONLY the chosen item\n    asset = await systemPhotoPicker.pick(type = IMAGE)\n\n    runOnBackground(() => {\n        // Decode to the size we actually display (avoid out-of-memory)\n        thumb = decode(asset, targetWidth = 1080, downsample = true)\n        thumb = applyExifOrientation(thumb, asset.exif.orientation)\n        runOnMain(() => preview.show(thumb))\n\n        // Large-file upload: chunked + resumable, cancelable\n        upload.chunked(asset.uri, chunkSize = 1MB, resumable = true)\n    })"
      }
    ],
    "resources": [
      {
        "label": "Android Permissions Overview",
        "url": "https://developer.android.com/guide/topics/permissions/overview",
        "kind": "docs"
      },
      {
        "label": "Android Guide to Background Work",
        "url": "https://developer.android.com/guide/background",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "sensors-biometrics",
    "phase": 7,
    "phaseName": "Device Capabilities & Native Integration",
    "orderIndex": 4,
    "estimatedMins": 35,
    "prerequisites": [
      "permission-model"
    ],
    "title": "Sensors & Biometrics",
    "eli5": "Your phone can feel how it's tilted and moving (accelerometer, gyroscope) and recognize your face or fingerprint to unlock things. The clever part about the fingerprint: the app never actually sees your fingerprint — a secure chip checks it and just tells the app 'yes, it's them'.",
    "analogy": "Biometrics are like a trusted bouncer at a private vault. You show your face to the bouncer (the secure hardware), not to the app. The bouncer never describes your face to anyone — it just nods 'verified' or shakes its head. The app trusts the nod; it never handles your biometric data itself.",
    "explanation": "Two related capabilities. Motion sensors — the accelerometer (linear acceleration/tilt) and gyroscope (rotation) — stream continuous data for things like step counting, orientation, and gestures; they're cheap but constant sampling adds up, so you register only while needed and pick an appropriate sampling rate. Biometric authentication — Face ID / Touch ID / fingerprint — lets the user prove identity, but the key design fact is that biometric matching happens inside dedicated secure hardware; your app only receives a success/failure result and, ideally, a cryptographic key released on success. The raw biometric never touches your code or your servers.\n\n[Android vs iOS] Android uses the BiometricPrompt API (a system-drawn dialog) backed by fingerprint/face, and the hardware-backed Keystore/StrongBox stores keys that unlock only on successful auth. iOS uses LocalAuthentication (Face ID / Touch ID) with the Secure Enclave — a separate coprocessor that performs the match and gatekeeps Keychain items via access control flags. On both, the biometric template never leaves the secure hardware.",
    "technicalDeep": "The security model is 'authenticate to release a key', not 'app checks a boolean'. A naive design that just reads a true/false from the biometric API can be bypassed (hooking, replay); the robust pattern binds a hardware-backed cryptographic key to biometric authentication, so a successful match unlocks the key inside the secure element and the app performs a crypto operation it otherwise couldn't. The Secure Enclave / StrongBox is isolated silicon: keys are generated and used there and never exported, so even a compromised app process can't extract them. Motion sensors, by contrast, are a streaming/duty-cycle concern: you choose a delivery rate (UI, game, fastest), unregister listeners when the screen backgrounds, and fuse accelerometer+gyroscope for stable orientation (sensor fusion) rather than integrating a single noisy sensor.\n\n[Android vs iOS] Android: CryptoObject ties a Keystore key to BiometricPrompt so auth gates the key; StrongBox uses a dedicated secure chip when present; sensor rates set via SensorManager. iOS: SecAccessControl with biometryCurrentSet binds a Keychain item to the enrolled biometrics (and invalidates it if biometrics change); the Secure Enclave holds the private key; Core Motion delivers sensor data with configurable update intervals.",
    "whatBreaks": "Trusting a boolean: treating biometric auth as a simple true/false with no key binding lets attackers bypass it (hooking/replay), so sensitive actions gain no real protection. Handling raw biometrics: any attempt to receive or store the actual fingerprint/face is impossible-by-design and a red flag — you only get results. Not invalidating on enrollment change: if a new fingerprint/face is added, a key not bound to the current biometric set can be misused; you must invalidate keys when enrollment changes. Sensor battery leaks: leaving high-rate sensor listeners registered in the background drains battery and wastes CPU. Integrating one noisy sensor: deriving orientation from the accelerometer alone drifts; you need fusion.",
    "efficientWay": {
      "title": "Using Biometrics and Sensors Correctly",
      "approaches": [
        {
          "name": "Bind a hardware-backed key to biometric auth; register sensors only while needed",
          "verdict": "best",
          "reason": "Key-release-on-auth gives real, hardware-enforced security no app-level bypass defeats, and lifecycle-scoped sensor listeners keep battery cost minimal."
        },
        {
          "name": "System biometric prompt gating access, with a secure fallback",
          "verdict": "ok",
          "reason": "Acceptable when paired with a proper credential fallback (device passcode) and used to unlock server-side or keychain secrets, but weaker if it's only a UI gate without key binding."
        },
        {
          "name": "Read a success boolean from the biometric API and unlock the feature",
          "verdict": "weak",
          "reason": "No cryptographic binding means the check can be hooked or replayed; it provides the appearance of security without the substance."
        }
      ],
      "recommendation": "Gate sensitive operations by releasing a Secure Enclave / Keystore key on successful biometric auth (not a boolean), invalidate keys when biometric enrollment changes, and register motion sensors at an appropriate rate only while the relevant screen is active."
    },
    "commonMistakes": [
      "Treating biometric authentication as a true/false gate instead of binding it to a hardware-backed key",
      "Trying to access or store the raw biometric data, which the secure hardware never exposes by design",
      "Not invalidating keys when the user's enrolled fingerprints/faces change",
      "Leaving high-frequency sensor listeners registered in the background and draining battery",
      "Deriving orientation from a single noisy sensor instead of fusing accelerometer and gyroscope"
    ],
    "seniorNotes": "The mental model that separates seniors: biometrics authenticate to unlock cryptographic material in isolated hardware; they are not a login boolean. Design so that a successful match releases a key from the Secure Enclave/StrongBox that performs an operation the app couldn't otherwise do, and tie that key to the current biometric enrollment so re-enrollment invalidates it. For sensors, think duty cycle — choose the lowest rate that works, unregister on background, and fuse sensors for stable signals. Always provide a secure non-biometric fallback (device credential) for accessibility and failure cases.",
    "interviewQuestions": [
      "Why should biometric authentication release a cryptographic key rather than just return a success boolean?",
      "What is the Secure Enclave / StrongBox and why does the biometric template never reach your app?",
      "How do you use motion sensors without draining the battery, and why fuse accelerometer and gyroscope?"
    ],
    "interviewAnswers": [
      "A boolean result can be hooked, replayed, or spoofed at the app layer, so it provides no real protection for sensitive data. Binding auth to a hardware-backed key means a successful biometric match unlocks a key held inside the secure element, and the app then performs a cryptographic operation (decrypt a token, sign a request) it literally cannot do without that match. Security is enforced by the hardware, not by trusting app-level code.",
      "The Secure Enclave (iOS) and StrongBox/hardware Keystore (Android) are isolated secure coprocessors that generate, store, and use cryptographic keys without ever exporting them. Biometric matching happens inside this hardware and only a match/no-match result crosses out; the fingerprint/face template stays in the secure element and is never delivered to your app or servers. So even a fully compromised app process can't extract the biometric or the protected keys.",
      "You register sensor listeners only while the relevant screen is active, unregister on background, and choose the lowest sampling rate that meets the need — high rates deliver far more callbacks and cost more power. You fuse accelerometer and gyroscope because each alone is flawed: the accelerometer is noisy and the gyroscope drifts over time; combining them (sensor fusion) yields a stable, low-drift orientation estimate."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: biometric-gated key, not a boolean",
        "code": "// WEAK: app trusts a boolean\nif biometrics.authenticate() == SUCCESS:\n    unlockSecretFeature()          // hookable / replayable\n\n// STRONG: auth releases a hardware key\nkey = keystore.getKey(\"vault\",\n    requireBiometricAuth = true,\n    invalidateOnEnrollmentChange = true)   // new face/finger -> key dies\nresult = biometrics.authenticate(bindTo = key)   // match unlocks key IN hardware\nif result == SUCCESS:\n    token = crypto.decrypt(storedToken, key)      // impossible without the match\n    api.call(token)\n\n// Sensors: register only while visible, unregister on background\nonScreenVisible():  sensors.register(GYROSCOPE, rate = UI)\nonScreenHidden():   sensors.unregister(GYROSCOPE)"
      }
    ],
    "resources": [
      {
        "label": "Android Permissions Overview",
        "url": "https://developer.android.com/guide/topics/permissions/overview",
        "kind": "docs"
      },
      {
        "label": "Swift Concurrency",
        "url": "https://developer.apple.com/documentation/swift/concurrency",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "connectivity-hardware",
    "phase": 7,
    "phaseName": "Device Capabilities & Native Integration",
    "orderIndex": 5,
    "estimatedMins": 35,
    "prerequisites": [
      "permission-model"
    ],
    "title": "Bluetooth, NFC & Connectivity",
    "eli5": "Phones talk to nearby gadgets wirelessly: Bluetooth for things like headphones and fitness bands, and NFC for the tap-to-pay or tap-a-sticker trick that works only when things almost touch. The app also needs to know if you're online and on Wi-Fi or mobile data, and it must ask permission to use these radios.",
    "analogy": "Bluetooth Low Energy is like a lighthouse quietly blinking its name and a few numbers to anyone nearby (advertising), and you tune in to read them (scanning). NFC is a secret handshake that only works when two hands nearly touch — its tiny range is the security feature. Connectivity APIs are the app checking whether the road (network) is open and how wide it is.",
    "explanation": "Three connectivity capabilities. Bluetooth Low Energy (BLE) connects to nearby low-power devices — wearables, beacons, sensors — using a model of peripherals that advertise services and characteristics, and centrals (your phone) that scan, connect, and read/write/subscribe. NFC (Near-Field Communication) works only at a few centimeters, which makes it ideal for tap interactions (payments, transit, reading tags) where the short range is itself a security property. Connectivity APIs let the app observe network state — online/offline, Wi-Fi vs cellular, metered vs unmetered — so it can adapt (defer big downloads off cellular, react when connectivity returns). All of these are permission-gated.\n\n[Android vs iOS] Android exposes BLE via the Bluetooth GATT APIs and requires runtime permissions (BLUETOOTH_SCAN/CONNECT, and historically location for scanning); NFC via the NFC APIs and foreground dispatch; network state via ConnectivityManager/NetworkCallback. iOS uses Core Bluetooth (CBCentralManager/CBPeripheral) with a Bluetooth usage permission, Core NFC for tag reading (session-based, user-initiated), and NWPathMonitor to observe connectivity — with tight background limits on all radios.",
    "technicalDeep": "BLE's data model is GATT: a peripheral exposes services, each containing characteristics (values you read, write, or subscribe to for notifications). Connection setup has real latency and power cost, so you scan briefly with filters (by service UUID) rather than continuously, and you batch reads. Background BLE is heavily restricted — scanning and advertising are throttled or require specific entitlements — so continuous background scanning is not a reliable design. NFC operates in a tiny field (~4cm); on iOS it's session-based and user-initiated (the app starts a scan session, the user taps a tag), never silent background polling. Connectivity monitoring is event-driven: you subscribe to a path/network callback and react to transitions (gained/lost, metered change) instead of polling reachability, which is both cheaper and avoids the classic 'reachability lies' race where a check passes but the very next request fails.\n\n[Android vs iOS] Android: BLE scanning historically needed location permission because BLE can infer location; newer APIs add neverForLocation flags; NFC supports foreground dispatch and some background tag reading; NetworkCallback reports capabilities (metered, validated). iOS: Core Bluetooth state-restoration allows limited background reconnection to known peripherals; Core NFC is foreground and session-scoped; NWPathMonitor reports interface type and constrained/expensive flags for adapting to metered links.",
    "whatBreaks": "Continuous BLE scanning: scanning without filters or duration drains battery and, in the background, is throttled so you miss devices; assuming reliable background scanning breaks. Missing scan permissions: on newer Android, not requesting BLUETOOTH_SCAN/CONNECT (or the location basis) yields empty results with no obvious error. Expecting NFC in the background: designing for silent NFC polling fails on iOS where sessions are user-initiated and foreground. Polling reachability: checking 'am I online' once and trusting it causes failures when state changes a moment later, and wastes cycles; you must observe transitions. Ignoring metered state: downloading large payloads on a metered cellular link burns the user's data and may be throttled by the OS.",
    "efficientWay": {
      "title": "Using Radios and Reacting to Connectivity",
      "approaches": [
        {
          "name": "Filtered, time-bounded BLE scans + event-driven connectivity observation",
          "verdict": "best",
          "reason": "Scanning by service UUID for a bounded window finds the right device cheaply, and subscribing to connectivity transitions lets the app adapt in real time without polling or false 'online' assumptions."
        },
        {
          "name": "Foreground-only BLE/NFC sessions with a clear user action",
          "verdict": "ok",
          "reason": "Reliable and battery-friendly for tap/connect flows the user initiates, but can't support always-on background awareness — fine when the interaction is inherently foreground."
        },
        {
          "name": "Continuous background scanning + one-shot reachability check",
          "verdict": "weak",
          "reason": "Background scanning is throttled and battery-hungry, and a single reachability check goes stale immediately, causing missed devices and failed requests."
        }
      ],
      "recommendation": "Scan BLE with service-UUID filters for a bounded time and connect on demand; drive NFC from an explicit user-initiated session; observe connectivity via callbacks/path monitoring and adapt to metered state, requesting the correct radio permissions up front."
    },
    "commonMistakes": [
      "Scanning BLE continuously and without filters, draining battery and getting throttled in the background",
      "Forgetting the newer Bluetooth scan/connect runtime permissions and getting silent empty results",
      "Designing for silent/background NFC when sessions are user-initiated and foreground (especially on iOS)",
      "Doing a one-shot reachability check instead of observing connectivity transitions",
      "Downloading large payloads on a metered cellular link without checking network capabilities"
    ],
    "seniorNotes": "Radios are the battery's biggest discretionary cost, so the senior default is bounded, on-demand, foreground-initiated use: filtered short BLE scans, user-triggered NFC sessions, and event-driven connectivity handling rather than polling. Understand the platform-specific gotchas — Android's location-for-BLE-scanning legacy, iOS's session-based NFC and restricted background BLE — because they shape what architectures are even possible. Treat connectivity as a stream of transitions to react to (with metered/expensive flags driving download decisions), never a boolean you check once; the 'is it online' race is a perennial source of flaky bugs.",
    "interviewQuestions": [
      "How does the BLE GATT model (peripheral, services, characteristics, central) work, and why scan with filters?",
      "Why is NFC's very short range considered a security feature, and how do NFC sessions differ from BLE?",
      "Why should you observe connectivity transitions instead of doing a one-shot reachability check?"
    ],
    "interviewAnswers": [
      "In GATT, a peripheral (a wearable, beacon) advertises and exposes services, each containing characteristics — values the central (your phone) can read, write, or subscribe to for notifications. The central scans for advertisements, connects, discovers services/characteristics, then exchanges data. You scan with filters (by service UUID) and for a bounded time because unfiltered continuous scanning is battery-expensive and, in the background, throttled — filtering finds the target device quickly and cheaply.",
      "NFC only works within a few centimeters, so an attacker essentially has to be in physical contact to interact — the tiny range makes eavesdropping and relay much harder, which is why it's trusted for payments and access. NFC on mobile (especially iOS Core NFC) is session-based and user-initiated: the app opens a short scan session and the user taps a tag, rather than the always-connected, subscribe-to-notifications model of BLE. There's no reliable silent background NFC polling.",
      "Network state changes constantly — Wi-Fi drops, cellular comes and goes, links become metered — so a single check is stale the instant after it returns, producing the classic race where reachability says 'online' but the next request fails. Observing transitions via a network/path callback lets the app react precisely when connectivity is gained, lost, or changes cost, so it can retry, defer large downloads on metered links, and update UI without wasteful polling."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: filtered BLE scan + connectivity observation",
        "code": "// BLE: filtered, time-bounded scan, connect on demand\nble.startScan(\n    filter = { serviceUUID: HEART_RATE },   // only devices we care about\n    timeout = 10s                            // bounded -> saves battery\n)\nonDeviceFound(peripheral):\n    ble.stopScan()\n    conn = ble.connect(peripheral)\n    conn.subscribe(HEART_RATE_CHARACTERISTIC, onValue = updateUi)\n\n// Connectivity: react to transitions, don't poll a boolean\nnetwork.observe((state) => {\n    if state.online and state.unmetered:\n        downloads.resumeLarge()      // safe on Wi-Fi\n    else if state.online and state.metered:\n        downloads.deferLarge()       // don't burn cellular data\n    else:\n        downloads.pauseAll()         // offline\n})"
      }
    ],
    "resources": [
      {
        "label": "Android Permissions Overview",
        "url": "https://developer.android.com/guide/topics/permissions/overview",
        "kind": "docs"
      },
      {
        "label": "Android Guide to Background Work",
        "url": "https://developer.android.com/guide/background",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "native-interop",
    "phase": 7,
    "phaseName": "Device Capabilities & Native Integration",
    "orderIndex": 6,
    "estimatedMins": 40,
    "prerequisites": [
      "async-concurrency",
      "permission-model"
    ],
    "title": "Native Interop: Channels, Bridges & FFI",
    "eli5": "Cross-platform apps (one codebase for Android and iOS) sometimes need something only the real native code can do. So they build a little translator that passes messages back and forth between the shared code and the platform's own code — like two people who speak different languages sending notes through an interpreter.",
    "analogy": "Your cross-platform code and the native OS code are two countries speaking different languages. A platform channel is a diplomatic mail service: you write a message, it's translated (serialized) at the border, carried across, and translated back. FFI is more like hiring a bilingual employee who works directly in both languages with no mail service — faster, but you must handle the border crossing yourself.",
    "explanation": "Cross-platform frameworks run your app logic in their own runtime (Dart for Flutter, JavaScript for React Native), but the device's real capabilities live in native code (Kotlin/Java on Android, Swift/Objective-C on iOS). To reach them you cross a boundary using one of two mechanisms. A message channel/bridge serializes a call and its arguments, hands them to the native side, runs native code, and serializes a result back — asynchronous and safe, but every crossing has serialization cost. FFI (Foreign Function Interface) instead calls native library functions directly through the runtime without a message layer — lower overhead, but you manage memory and types across the boundary yourself.\n\n[Android vs iOS] The framework matters more than the OS here. Flutter uses platform channels (MethodChannel/EventChannel) that pass serialized messages between Dart and native Kotlin/Swift, plus dart:ffi to call C ABIs directly. React Native historically used the async 'bridge' (JSON messages over a queue) and now uses the JSI-based TurboModules/Fabric for synchronous, lower-overhead native calls. Underneath, both eventually call the platform's Kotlin/Swift APIs — often via JNI on Android and Objective-C/Swift interop on iOS.",
    "technicalDeep": "Two axes define the boundary: synchronicity and marshaling. Channels/bridges are typically asynchronous and message-based — arguments are serialized (to a binary or JSON codec), queued, and the result returns via a future/callback — which keeps the UI thread free and the boundary safe, at the cost of per-call serialization and a thread hop. This makes them ideal for coarse-grained calls (do one native operation, get one result) and bad for chatty, high-frequency calls where serialization dominates. FFI (dart:ffi, JSI) binds directly to native function symbols/C ABIs, so calls can be synchronous with near-zero marshaling — but you own type mapping, pointer lifetimes, and memory safety, and a mistake crashes the whole process. Threading is a constant hazard: native platform APIs often must run on the main thread, while the framework runtime may call from another, so you marshal onto the right thread explicitly.\n\n[Android vs iOS] Flutter: MethodChannel calls hop to the platform main thread and back to Dart via async; EventChannel streams native events (sensor data) to Dart; dart:ffi calls C directly (great for existing native libs). React Native: the old bridge batched async JSON messages (a bottleneck for high-frequency work); TurboModules via JSI expose native methods as directly-callable JS functions, enabling synchronous calls and lazy loading. On Android the native side frequently bottoms out in JNI to reach Kotlin/C; on iOS it's Swift/Objective-C interop.",
    "whatBreaks": "Chatty channel calls: crossing the boundary in a tight loop (per-frame, per-pixel) makes serialization and thread hops dominate, tanking performance — you must batch into coarse calls. Blocking the UI thread: doing heavy native work synchronously on the platform main thread janks; long work must run off-thread and return via the channel asynchronously. Threading violations: calling a main-thread-only native UI API from a background thread crashes; you must marshal to the correct thread on the native side. FFI memory bugs: mismatched types, freed pointers, or leaked native memory across the FFI boundary corrupt memory and crash the whole app with no framework safety net. Serialization limits: passing large binary blobs or non-codec-supported types over a channel is slow or fails; use shared buffers or FFI for big data.",
    "efficientWay": {
      "title": "Crossing the Native Boundary Efficiently",
      "approaches": [
        {
          "name": "Coarse-grained async channels for platform APIs; FFI for hot paths / existing native libs",
          "verdict": "best",
          "reason": "Async channels keep the boundary safe and the UI free for normal capability calls, while FFI/JSI handles performance-critical or C-library work without per-call serialization. Right tool per workload."
        },
        {
          "name": "Async bridge/channel for everything",
          "verdict": "ok",
          "reason": "Simple and safe, and fine for most feature work, but high-frequency or large-data calls suffer from serialization and thread-hop overhead — acceptable only when call volume is low."
        },
        {
          "name": "Fine-grained synchronous FFI calls everywhere for 'speed'",
          "verdict": "weak",
          "reason": "You inherit manual memory management and threading hazards across the whole app; a single pointer mistake crashes the process, and synchronous calls can block the UI. Overkill and dangerous for ordinary features."
        }
      ],
      "recommendation": "Use asynchronous, coarse-grained channels for most native capability access (keeping heavy work off the main thread and results returning via futures), and reserve FFI/JSI for genuine hot paths or reusing existing native/C libraries — where you accept the manual memory and threading responsibility."
    },
    "commonMistakes": [
      "Making chatty, high-frequency channel calls where serialization and thread hops dominate performance",
      "Running heavy native work synchronously on the platform main thread and freezing the UI",
      "Calling a main-thread-only native API from a background thread and crashing",
      "Mismanaging memory or types across an FFI boundary, corrupting memory with no safety net",
      "Passing large binary payloads over a serialized channel instead of using FFI or a shared buffer"
    ],
    "seniorNotes": "The boundary is where cross-platform apps win or lose: model it as an expensive, async RPC and design coarse, batched interfaces rather than chatty ones. Senior engineers profile the crossing (how many calls, how much data, which thread) and reach for FFI/JSI only when serialization is a proven bottleneck or an existing native library must be reused — accepting the manual memory/threading burden deliberately. They also handle the threading contract explicitly (marshal to the platform main thread for UI APIs, run heavy work off-thread) and keep the native surface small and well-typed so the boundary stays maintainable across framework upgrades (e.g. RN's bridge-to-TurboModules migration).",
    "interviewQuestions": [
      "What's the difference between a message channel/bridge and FFI for calling native code?",
      "Why are chatty, high-frequency calls across a platform channel a performance problem, and how do you fix it?",
      "What threading hazards arise at the native boundary and how do you handle them?"
    ],
    "interviewAnswers": [
      "A message channel/bridge serializes the call and its arguments, passes them to the native side (usually asynchronously via a queue/codec), runs native code, and serializes a result back — safe and UI-friendly but with per-call serialization and a thread hop. FFI binds directly to native function symbols / a C ABI, so calls are synchronous with almost no marshaling and much lower overhead, but you take on manual memory management and type mapping, and mistakes crash the whole process. Channels suit ordinary capability calls; FFI suits hot paths and reusing native libraries.",
      "Every crossing pays serialization of arguments/results plus a hop between the framework runtime thread and the native thread. In a tight, high-frequency loop (per frame, per data point) that fixed cost dominates and destroys throughput. The fix is to make the interface coarse-grained: batch many operations into a single call, push the loop to the native side and return one aggregated result, or use FFI/a shared buffer for high-frequency or large-data exchange so you cross the boundary rarely.",
      "The framework runtime often calls from a non-main thread, while many native platform APIs (especially UI ones) must run on the main thread — calling them off-thread crashes. Conversely, doing heavy native work on the main thread janks the UI. So you marshal explicitly: dispatch main-thread-only native calls onto the platform main thread, run expensive work on a background thread, and return the result asynchronously over the channel so the framework's UI thread stays free."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: coarse async channel vs chatty calls",
        "code": "// CHATTY (bad): serialize + hop per item -> overhead dominates\nfor id in ids:                          // thousands of crossings\n    name = await channel.invoke(\"lookup\", { id })\n\n// COARSE (good): one crossing, native side does the loop\nnames = await channel.invoke(\"lookupBatch\", { ids })   // one serialize/hop\n\n// NATIVE SIDE: run heavy work off-thread, marshal UI to main\nchannel.handle(\"lookupBatch\", (args, reply) => {\n    runOnBackground(() => {\n        result = db.lookupAll(args.ids)     // heavy work off the UI thread\n        runOnMain(() => reply(result))      // main-thread-only reply\n    })\n})\n\n// FFI: direct call, but YOU own memory\nptr = native.alloc(size)\nnative.compute(ptr)      // synchronous, no serialization\ncopyOut(ptr); native.free(ptr)   // must free or leak/crash"
      }
    ],
    "resources": [
      {
        "label": "Flutter Platform Channels",
        "url": "https://docs.flutter.dev/platform-integration/platform-channels",
        "kind": "docs"
      },
      {
        "label": "Kotlin Coroutines Overview",
        "url": "https://kotlinlang.org/docs/coroutines-overview.html",
        "kind": "docs"
      },
      {
        "label": "Swift Concurrency",
        "url": "https://developer.apple.com/documentation/swift/concurrency",
        "kind": "docs"
      }
    ]
  },
  {
    "id": "ipc-app-integration",
    "phase": 7,
    "phaseName": "Device Capabilities & Native Integration",
    "orderIndex": 7,
    "estimatedMins": 35,
    "prerequisites": [
      "permission-model",
      "native-interop"
    ],
    "title": "IPC: Intents, URL Schemes & Sharing",
    "eli5": "Apps on your phone can talk to each other — that's how tapping 'Share' sends a photo to your chat app, or tapping a link opens the right app instead of the browser. The phone has agreed-upon ways for one app to say 'hey, can any app handle this?' and for another to answer.",
    "analogy": "Inter-app communication is like a town's public services. An intent/URL is calling out 'I need someone who can print photos!' and any qualified shop (app) can raise its hand. The share sheet is a bulletin board where you post an item and pick who receives it. A universal link is a specific street address that always leads to the same shop, verified so no impostor can claim it.",
    "explanation": "Apps are sandboxed — they can't reach into each other's memory or files — so the OS provides controlled channels for app-to-app communication (IPC). The main patterns: launching another app or component with a request (Android Intents, iOS URL schemes / universal links), sharing content to whichever app the user picks (the share sheet), and exposing data for other apps to read through a mediated provider. The recurring theme is indirection and consent: an app declares what it can handle, the OS matches requests to handlers, and the user often chooses the target — no app silently reaches into another.\n\n[Android vs iOS] Android is intent-centric: explicit intents target a specific component, implicit intents describe an action ('ACTION_SEND this image') and the system offers matching apps; ContentProviders expose queryable data across apps with permissions; the system share sheet (ACTION_SEND/CHOOSER) picks a target. iOS uses custom URL schemes (myapp://) and, preferably, Universal Links (regular https links that open your app if installed, verified via a domain association file); UIActivityViewController is the share sheet, and app extensions (Share/Action extensions) let apps offer functionality to others.",
    "technicalDeep": "The dispatch model is 'declare capabilities, match at runtime'. Android manifests declare intent filters (action + category + data type); the system resolves an implicit intent to matching activities and, when ambiguous, shows a chooser — this late binding is powerful but a security surface (any app can register a filter, so sensitive intents must be explicit or permission-protected). iOS URL schemes are first-come registration and thus spoofable (two apps can claim myapp://), which is exactly why Universal Links exist: they use a real https domain plus a server-hosted association file the OS verifies, so only the domain owner's app can claim those links — no impersonation, and graceful web fallback if the app isn't installed. Sharing passes data by reference/URI with a temporary grant rather than copying, and receiving apps must handle arbitrary/untrusted input. Deep links (into a specific screen) require validating and sanitizing parameters because they originate outside your app.\n\n[Android vs iOS] Android: intent extras carry data; FLAG_GRANT_READ_URI_PERMISSION shares a content URI temporarily; App Links (verified https, like Universal Links) avoid the disambiguation dialog; exported components must be guarded. iOS: universal links carry the path/query you route on; custom schemes remain for legacy/simple cases; the share sheet and extensions run out-of-process; the receiving app validates incoming URLs.",
    "whatBreaks": "Trusting incoming data: treating intent extras or deep-link/URL parameters as safe lets a malicious app trigger unintended actions or inject bad input — you must validate and authorize. URL-scheme spoofing: relying on custom schemes for anything sensitive fails because another app can register the same scheme and intercept; universal/app links solve this. Unguarded exported components: an Android component with an intent filter but no permission check is callable by any app, a classic vulnerability. Assuming a handler exists: firing an implicit intent/URL with no installed app to handle it throws or does nothing if you don't check/handle the no-handler case. Copying large data: passing big payloads by value over IPC is slow or hits size limits; share by URI with a temporary grant instead.",
    "efficientWay": {
      "title": "Wiring Apps Together Safely",
      "approaches": [
        {
          "name": "Verified deep links (Universal/App Links) + system share sheet + validated inputs",
          "verdict": "best",
          "reason": "Domain-verified links can't be spoofed and fall back to the web gracefully, the system share sheet gives user consent and reach, and validating every incoming parameter keeps the app secure against hostile callers."
        },
        {
          "name": "Explicit intents / custom URL schemes with input validation",
          "verdict": "ok",
          "reason": "Fine for internal or non-sensitive app-to-app calls, but custom schemes are spoofable and explicit intents require you to know the target — acceptable when the link isn't security-critical and you still sanitize inputs."
        },
        {
          "name": "Implicit intents / exported components with no permission or validation",
          "verdict": "weak",
          "reason": "Any app can invoke or spoof them and feed untrusted data, creating real vulnerabilities. Sensitive actions exposed this way are a security hole."
        }
      ],
      "recommendation": "Prefer verified Universal/App Links for inbound deep links, use the system share sheet for outbound sharing (share by URI with a temporary grant), guard exported components with permissions, and validate and authorize every piece of externally-supplied data."
    },
    "commonMistakes": [
      "Trusting intent extras or deep-link/URL parameters without validating and authorizing them",
      "Relying on spoofable custom URL schemes for sensitive flows instead of verified universal/app links",
      "Exposing an exported Android component via an intent filter with no permission check",
      "Firing an implicit intent or URL without handling the case where no app can handle it",
      "Copying large payloads by value over IPC instead of sharing a URI with a temporary access grant"
    ],
    "seniorNotes": "Treat every inbound intent, URL, or shared item as untrusted input from a potentially hostile app — validate, authorize, and sanitize before acting, exactly as you would an HTTP request. The universal/app-link vs custom-scheme distinction is a security decision, not a convenience one: domain verification is what stops impersonation and enables safe web fallback. Senior engineers keep the exported surface minimal and permission-guarded, share data by reference with scoped temporary grants, and design deep-link routing to degrade gracefully (app-not-installed, missing handler, malformed parameters). The whole model is consent and indirection — never assume the caller is friendly.",
    "interviewQuestions": [
      "How do implicit Android intents and iOS URL schemes/universal links let apps communicate, and how are handlers chosen?",
      "Why are custom URL schemes spoofable, and how do Universal/App Links fix it?",
      "What are the security risks of receiving intents/deep links, and how do you mitigate them?"
    ],
    "interviewAnswers": [
      "Apps declare what they can handle — Android components register intent filters (action/category/data), iOS apps register URL schemes or associate with https domains. An implicit intent or a URL describes what's needed rather than naming a target, and the OS matches it to registered handlers, presenting a chooser/share sheet when several qualify. On iOS, universal links are ordinary https URLs the system routes to the owning app if installed (else the website). This late binding lets independent apps interoperate through OS-mediated dispatch with user consent.",
      "Custom schemes (myapp://) are claimed on a first-come basis with no ownership verification, so a malicious app can register the same scheme and intercept links meant for you. Universal/App Links fix this by tying the link to a real https domain plus a server-hosted association file that the OS verifies against the app's signature — only the verified domain owner's app can claim those links. That prevents impersonation and adds graceful web fallback when the app isn't installed.",
      "An incoming intent or deep link comes from another, possibly malicious, app, so its parameters are untrusted: blindly acting on them can trigger unauthorized actions, leak data, or inject bad input. Mitigations: validate and sanitize every parameter, authorize the action against the current user/session rather than trusting the caller, keep exported components minimal and permission-guarded, prefer verified links over spoofable schemes, and never perform sensitive operations purely because an external request asked you to."
    ],
    "codeExamples": [
      {
        "lang": "text",
        "label": "Pseudocode: share out, and safely handle inbound deep links",
        "code": "// OUTBOUND: share by URI via the system share sheet (user picks target)\nfunction onShareTapped(photo):\n    uri = mediaStore.contentUri(photo)          // reference, not a copy\n    shareSheet.present(\n        items = [ uri ],\n        grant = TEMPORARY_READ                    // scoped, revocable access\n    )                                             // OS shows chooser -> consent\n\n// INBOUND: treat deep link as UNTRUSTED input\nfunction onDeepLink(url):                         // e.g. from a universal link\n    if not links.isVerifiedDomain(url): reject()  // no spoofed schemes\n    route = parse(url)\n    if not validate(route.params): reject()       // sanitize everything\n    if not session.authorized(route.action): reject()  // authorize, don't trust caller\n    navigateTo(route)                             // only now act"
      }
    ],
    "resources": [
      {
        "label": "Android Permissions Overview",
        "url": "https://developer.android.com/guide/topics/permissions/overview",
        "kind": "docs"
      },
      {
        "label": "Flutter Platform Channels",
        "url": "https://docs.flutter.dev/platform-integration/platform-channels",
        "kind": "docs"
      }
    ]
  }
]
