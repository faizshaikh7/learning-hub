import type { CurriculumTopic } from '@/types'

/**
 * Advanced "senior/CTO-level" React topics that extend the core curriculum.
 * Same shape as REACT_CURRICULUM — merged into the track at load time.
 */
export const REACT_EXTRA_TOPICS: CurriculumTopic[] = [

  /* ── Accessibility (a11y) — Phase 5: React Ecosystem ──────────────────────── */
  {
    id: 'react-accessibility', phase: 5, phaseName: 'React Ecosystem',
    orderIndex: 99, estimatedMins: 45, prerequisites: ['forms-controlled', 'react-router'],
    title: 'Accessibility (a11y) in React',
    eli5: 'Some people use the web without a mouse or without seeing the screen — they use the keyboard and a program that reads the page out loud. Accessibility means building your app so those tools can understand it. Mostly you do this by using the right HTML tags (a real <button>, not a clickable <div>) and adding labels, so everyone can use what you built.',
    analogy: 'A screen reader is a blind person walking through a building using only the signs. Semantic HTML is putting up correct signs — "Exit", "Stairs", "Restroom". ARIA is a label maker you use ONLY when the building has a weird custom door with no standard sign. If you slap wrong labels everywhere, you make the building more confusing, not less.',
    explanation: 'Accessibility (a11y) means your UI works for people using screen readers, keyboard-only navigation, voice control, magnification, and reduced-motion settings. In React the golden rule is "semantic HTML first, ARIA last". A native <button>, <a href>, <label>, <input>, <nav>, <main> come with keyboard behavior, focus, and screen-reader roles for free. The moment you build a <div onClick> you have thrown all of that away and now owe the browser a role, a tabindex, keydown handlers, and focus styles. React adds specific challenges: it does not manage focus for you across route changes and modal openings, and dynamic content (toasts, validation errors, live search results) is invisible to screen readers unless you announce it through a live region. About 15% of users have some disability, and in many jurisdictions (ADA, EU EAA 2025, Section 508) accessible software is a legal requirement — this is a shipping-blocker, not a nice-to-have.',
    technicalDeep: 'The accessibility tree is a parallel tree the browser builds from the DOM and exposes to assistive tech via platform APIs (UIA on Windows, AX on macOS). Each node has a role (button, dialog, alert), a name (computed from label/aria-label/aria-labelledby/text content), a state (aria-expanded, aria-checked, aria-disabled), and a value. Semantic elements populate this automatically; <div>/<span> are role="generic" and invisible to navigation. ARIA does exactly three things: overrides/sets role, adds accessible name/description, and communicates state — it changes NOTHING about behavior or focus. First rule of ARIA: don\'t use ARIA if a native element exists. Keyboard support: interactive things must be reachable with Tab (natural for links/buttons/inputs; needs tabIndex={0} for custom widgets) and operable with Enter/Space (buttons) or Arrow keys (menus, tabs, radios per the WAI-ARIA Authoring Practices patterns). Focus management is the React-specific hard part: on route change move focus to the new page\'s <h1> (or a skip target); when a modal opens, move focus into it, trap Tab within it, restore focus to the trigger on close, and set aria-modal="true" plus focus the dialog. Live regions: aria-live="polite" (announce when idle) or "assertive" (interrupt) on a container that is already in the DOM at mount — screen readers only announce mutations to a live region that existed before the change; injecting the region and the text at once is often missed. role="alert" and role="status" are implicit assertive/polite live regions. WCAG 2.2 AA is the standard target: 4.5:1 text contrast, visible focus indicators (2.4.7), target size 24×24 (2.5.8), no keyboard traps, respect prefers-reduced-motion.',
    whatBreaks: 'The classic failure: <div onClick={...}> as a button — not tabbable, no Enter/Space, no role, invisible to screen readers. Modals that do not trap focus let Tab wander to the page behind them so a blind user "escapes" the dialog without knowing. Toasts and form-validation errors rendered without a live region are completely silent. Icon-only buttons with no aria-label read as "button" with no name. Auto-focusing or moving focus on every render throws the user\'s cursor around. Removing focus outlines (`outline: none`) with no replacement makes the app unusable by keyboard. Placeholder-as-label disappears on typing and is not a real label.',
    efficientWay: {
      title: 'Building accessibility into a React app',
      approaches: [
        { name: 'Semantic HTML + a headless a11y library (Radix / React Aria) for complex widgets', verdict: 'best', reason: 'Native elements give you 80% for free; Radix UI and React Aria (Adobe) implement the hard WAI-ARIA patterns — focus trap, roving tabindex, dismissable layers — correctly and battle-tested. You stop reinventing accessible comboboxes.' },
        { name: 'Hand-roll ARIA on divs following the WAI-ARIA Authoring Practices', verdict: 'ok', reason: 'Educational and sometimes necessary, but you will get focus order, live-region timing, and mobile screen-reader quirks wrong before you get them right. Fine for simple one-offs.' },
        { name: 'Add ARIA attributes everywhere to "make it accessible"', verdict: 'weak', reason: 'More ARIA is not more accessible — wrong roles and redundant labels actively break screen readers. "No ARIA is better than bad ARIA." This is the most common well-intentioned mistake.' }
      ],
      recommendation: 'Default to semantic HTML and reach for Radix UI / React Aria for menus, dialogs, comboboxes, and tabs. Add eslint-plugin-jsx-a11y to catch issues at author time, jest-axe in component tests, and do a real keyboard + screen-reader (VoiceOver/NVDA) pass on critical flows before launch. Treat WCAG 2.2 AA as the acceptance bar.'
    },
    commonMistakes: [
      'Clickable <div>/<span> instead of <button> — loses keyboard operability, focus, and role. Use a real button and style it.',
      'Removing focus outlines with `outline: none` and providing no `:focus-visible` replacement — instant keyboard-inaccessibility.',
      'Modals that do not trap focus, do not set aria-modal, or do not restore focus to the trigger on close.',
      'Injecting a toast/alert and its aria-live container at the same time — the region must pre-exist in the DOM for the mutation to be announced.',
      'Icon-only buttons with no aria-label, and images with no meaningful alt (decorative images should have alt="").',
      'Using placeholder text as the only label — it is not a programmatic label and vanishes on input.',
      'Redundant/incorrect ARIA (role="button" on a <button>, aria-label duplicating visible text) that confuses the accessibility tree.',
      'Not associating <label> with its input via htmlFor/id (React uses htmlFor, not for).'
    ],
    seniorNotes: 'As a lead, bake a11y into the definition of done and CI, not a "cleanup sprint" that never happens. Wire eslint-plugin-jsx-a11y into the linter and jest-axe into the component test template so regressions fail the build. Standardize on one headless primitive library (Radix or React Aria) so every dialog/menu in the app shares the same audited focus and keyboard logic instead of 20 bespoke buggy versions. Automated tools (axe) only catch ~30-40% of issues — budget for manual keyboard and screen-reader testing on core flows and, for regulated products, a third-party audit. Know the legal surface: ADA Title III, EU European Accessibility Act (enforced June 2025), Section 508. In App Router / RSC, remember focus management is inherently client-side: route-change focus and modals need "use client" components.',
    interviewQuestions: [
      'Why is "semantic HTML first, ARIA last" the guiding rule, and when is ARIA actually the right tool?',
      'Walk me through everything a fully accessible modal dialog must do.',
      'How do you announce dynamically inserted content (a toast, async search results) to a screen reader?',
      'What does a keyboard-only user need from a custom dropdown that a native <select> gives for free?',
      'How do you handle focus on client-side route changes in a SPA / Next.js App Router app?',
      'How do you test accessibility in a React codebase, and what can automated tools NOT catch?'
    ],
    interviewAnswers: [
      'Native elements (button, a, input, nav) come with correct role, name, keyboard operability, and focus behavior built in and consistent across browsers/AT. ARIA changes only semantics (role/name/state) — never behavior or focus — so if you use ARIA on a div you still owe tabindex, key handlers, and focus styles yourself, and it is easy to get wrong. Bad ARIA is worse than none because it lies to the accessibility tree. ARIA is right when there is genuinely no native equivalent (a tablist, a combobox, a live region, aria-expanded/controls on a disclosure) — you augment semantics you cannot express in HTML.',
      'On open: move focus into the dialog (the dialog container or first focusable element), set role="dialog" (or "alertdialog") with aria-modal="true" and an accessible name via aria-labelledby pointing at the title. While open: trap Tab/Shift+Tab so focus cycles within the dialog and cannot reach the page behind it, and hide the background from AT (aria-hidden or the inert attribute on the rest of the app). Support Escape to close and a visible close button. On close: return focus to the element that opened it. Respect click-outside/backdrop dismissal semantics. I would normally use Radix Dialog or React Aria rather than hand-roll all of this.',
      'Use an ARIA live region. Render a container with aria-live="polite" (or role="status") that is already mounted in the DOM before any change, then update its text content when the event happens — screen readers announce mutations to a pre-existing live region. Use "polite"/role=status for non-urgent updates and "assertive"/role=alert for errors that must interrupt. The mistake is mounting the region and the message together; also avoid spamming the region on every keystroke — debounce and announce a summary like "5 results".',
      'Tab to reach it and a visible focus indicator; Enter/Space or Arrow-down to open; Arrow keys to move between options with a roving tabindex (only one item tabbable at a time), Home/End to jump; Enter to select; Escape to close and return focus to the trigger; typeahead to jump by first letter; and correct ARIA wiring (role="listbox"/"option", aria-expanded, aria-activedescendant or focus management, aria-selected). A native <select> gives all of this for free, which is why you prefer it unless design forces a custom widget.',
      'By default SPAs leave focus on the clicked link and screen-reader users are never told the page changed. On navigation I move focus to a logical landing point — usually the new page\'s <h1> (given tabIndex={-1}) or a dedicated skip target — and often announce the new page title via a live region or update document.title. In Next.js App Router this is client-side work: a small "use client" component that listens to pathname changes (usePathname) and refocuses on route change. I also provide a "skip to main content" link as the first focusable element.',
      'Layered: (1) eslint-plugin-jsx-a11y catches static issues (missing alt, label-less inputs, invalid ARIA) at author time; (2) jest-axe / @axe-core runs in component and E2E tests to fail the build on violations; (3) manual keyboard-only testing (unplug the mouse, Tab through everything); (4) real screen readers — VoiceOver on Mac/iOS, NVDA on Windows. Automated tools only find ~30-40% of problems — they cannot judge whether focus order is logical, whether an alt text is meaningful, or whether an interaction is understandable. So automation is the floor, manual and AT testing on critical flows is mandatory, and regulated products get a third-party audit against WCAG 2.2 AA.'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'Accessible modal with focus trap + restore (React 19)',
        code: `'use client';
import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = 'modal-title';

  useEffect(() => {
    if (!isOpen) return;
    // Remember what was focused so we can restore it on close.
    triggerRef.current = document.activeElement as HTMLElement;

    const dialog = dialogRef.current!;
    const focusables = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      );

    // Move focus into the dialog.
    (focusables()[0] ?? dialog).focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      // Focus trap: keep Tab/Shift+Tab inside the dialog.
      const items = focusables();
      if (items.length === 0) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // Restore focus to the trigger when the modal closes.
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      {/* aria-modal hides the background from AT; role=dialog + labelledby names it */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId}>{title}</h2>
        {children}
        <button type="button" onClick={onClose} aria-label="Close dialog">×</button>
      </div>
    </div>
  );
}`
      },
      {
        lang: 'tsx',
        label: 'Live region hook — announce async updates to screen readers',
        code: `'use client';
import { useCallback, useRef, useState } from 'react';

/**
 * The live region container is rendered ONCE at app root and stays mounted.
 * announce() updates its text; screen readers only speak mutations to a
 * region that already existed in the DOM — hence the persistent container.
 */
export function LiveRegionProvider() {
  const [politeMsg, setPoliteMsg] = useState('');
  const [assertiveMsg, setAssertiveMsg] = useState('');

  // expose globally / via context in a real app
  (globalThis as any).__announce = (msg: string, assertive = false) =>
    assertive ? setAssertiveMsg(msg) : setPoliteMsg(msg);

  return (
    <>
      <div aria-live="polite" role="status" className="sr-only">{politeMsg}</div>
      <div aria-live="assertive" role="alert" className="sr-only">{assertiveMsg}</div>
    </>
  );
}

// Usage inside a component after an async action:
export function useAnnounce() {
  const timer = useRef<number>();
  return useCallback((msg: string, assertive = false) => {
    // clear then set so identical consecutive messages re-announce
    (globalThis as any).__announce('', assertive);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => (globalThis as any).__announce(msg, assertive),
      60
    );
  }, []);
}

// e.g. after search: announce(\`\${results.length} results found\`);
// after save error: announce('Could not save changes', true);

// .sr-only visually hides but keeps it in the accessibility tree:
// position:absolute; width:1px; height:1px; overflow:hidden;
// clip:rect(0 0 0 0); white-space:nowrap; border:0;`
      },
      {
        lang: 'tsx',
        label: 'Accessible form field: real label, error wiring, no ARIA abuse',
        code: `function EmailField({ value, onChange, error }: {
  value: string; onChange: (v: string) => void; error?: string;
}) {
  const id = 'email';
  const errorId = 'email-error';
  return (
    <div>
      {/* htmlFor (not "for") ties the label to the input for click + AT */}
      <label htmlFor={id}>Email address</label>
      <input
        id={id}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // announce the input as invalid and point to the message
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        autoComplete="email"
        required
      />
      {/* role=alert => the error is announced the moment it appears */}
      {error && <p id={errorId} role="alert">{error}</p>}
    </div>
  );
}`
      }
    ]
  },

  /* ── Internationalization (i18n) — Phase 5: React Ecosystem ───────────────── */
  {
    id: 'react-i18n', phase: 5, phaseName: 'React Ecosystem',
    orderIndex: 99, estimatedMins: 45, prerequisites: ['react-router', 'context-api'],
    title: 'Internationalization (i18n)',
    eli5: 'Internationalization means making your app speak many languages — not just swapping English words for Spanish words, but also writing dates, numbers, and money the way each country does, and knowing that "1 message" and "5 messages" need different words. Some languages even read right-to-left, so the whole layout has to flip.',
    analogy: 'Translating an app is like dubbing a movie. Amateur dubbing just replaces the words and the mouth movements look wrong. Professional localization re-times everything: jokes, units, the direction people read, how you count things. i18n is building the app so it can be professionally dubbed into any language without re-shooting the film.',
    explanation: 'Internationalization (i18n — "i", 18 letters, "n") is engineering your app so it CAN be adapted to any locale; localization (l10n) is the actual translation/adaptation for a specific one. The rookie assumption is "i18n = swap strings from a dictionary." Real i18n is much more: pluralization rules differ wildly (English has 2 forms, Polish has 4, Arabic has 6); grammatical gender changes surrounding words; dates (MM/DD/YYYY vs DD.MM.YYYY), number formats (1,000.50 vs 1.000,50 vs 1 000,50), and currency all vary; and RTL languages (Arabic, Hebrew) mirror the entire layout. The core practice is: never concatenate strings ("You have " + n + " messages") — that is untranslatable because word order and plural rules differ per language. Instead you use message catalogs with named keys and the ICU MessageFormat syntax, and you delegate dates/numbers/currency to the built-in Intl API. In React you pick a library — react-i18next, FormatJS (react-intl), or next-intl for the Next.js App Router — that provides a translation function/component, a locale provider, lazy-loading of catalogs, and ICU support.',
    technicalDeep: 'The browser ships the Intl object — use it, do not reinvent it: Intl.NumberFormat (currency, units, grouping), Intl.DateTimeFormat (locale dates/times), Intl.PluralRules (maps a number to a CLDR plural category: zero/one/two/few/many/other), Intl.RelativeTimeFormat ("3 days ago"), Intl.ListFormat, Intl.Collator (locale-correct sorting). ICU MessageFormat is the industry-standard string syntax that encodes plurals, selects (gender), and number/date args in one message, e.g. `{count, plural, =0 {No items} one {# item} other {# items}}` and `{gender, select, male {He} female {She} other {They}} liked this`. The `#` is the formatted count; CLDR categories (one/other/few/many...) let translators supply the right forms per language without you branching in code. Libraries: react-i18next is framework-agnostic, uses t(\'key\', { count }) with i18next\'s own interpolation/plural backend (v4 uses CLDR categories via suffixes like key_one/key_other) and supports namespaces + lazy backends; FormatJS/react-intl is ICU-native (<FormattedMessage>, useIntl, intl.formatNumber) and pairs with @formatjs/cli to extract/compile catalogs; next-intl is built for the Next.js App Router — it works in Server Components (getTranslations) and Client Components (useTranslations), integrates with middleware-based locale routing, and is fully ICU. Message catalogs are per-locale JSON keyed by message id (en.json, ar.json...). Lazy-loading: split catalogs by locale (and often by route/namespace) and load only the active locale\'s file so you do not ship every language to every user — react-i18next has i18next-http-backend / dynamic import backends; react-intl loads the JSON then passes it as `messages`; next-intl imports the locale file in the request config. RTL: set <html dir="rtl" lang="ar">, use CSS logical properties (margin-inline-start not margin-left) so layout mirrors automatically. Next.js App Router locale routing: the modern pattern is a [locale] dynamic segment (app/[locale]/...) with middleware that detects the locale (from the path, a cookie, or the Accept-Language header) and rewrites/redirects; next-intl ships this middleware plus generateStaticParams for statically rendering each locale.',
    whatBreaks: 'String concatenation for sentences with variables — "Deleted " + n + " files" is untranslatable and gets plurals wrong in every non-English language. Hardcoding plural logic (`n === 1 ? "item" : "items"`) breaks for Polish/Russian/Arabic which have 3-6 forms. Formatting dates/numbers/currency by hand instead of using Intl produces wrong separators and formats. Baking text into images (no way to translate). Fixed-width buttons that overflow when German text is 40% longer than English. Assuming LTR layout so Arabic looks broken. Shipping all locale catalogs in the main bundle, bloating load time. In Next.js, calling a client-only i18n hook in a Server Component, or forgetting the middleware so /es routes 404.',
    efficientWay: {
      title: 'Choosing and structuring an i18n stack',
      approaches: [
        { name: 'next-intl (Next.js App Router) or react-i18next (SPA/other), ICU + Intl for formatting', verdict: 'best', reason: 'next-intl is purpose-built for RSC/App Router with server + client translations, locale middleware, and full ICU. For non-Next React, react-i18next is the most mature ecosystem (namespaces, lazy backends, huge plugin set). Both delegate dates/numbers to Intl — no custom formatting.' },
        { name: 'FormatJS / react-intl', verdict: 'ok', reason: 'Excellent, standards-first (ICU-native) and great for large orgs with a translation pipeline, but more boilerplate (<FormattedMessage>, extract/compile build step) and less turnkey for App Router than next-intl.' },
        { name: 'Roll your own context + a strings.js dictionary', verdict: 'weak', reason: 'Fine for a two-language marketing page, but you will reimplement plurals, ICU, lazy-loading, and locale routing badly. Does not scale past simple string swaps.' }
      ],
      recommendation: 'On Next.js App Router use next-intl with a [locale] segment and its middleware; elsewhere use react-i18next. Store messages as per-locale ICU JSON, lazy-load only the active locale, always format dates/numbers/currency through Intl, use CSS logical properties for RTL, and give translators ICU messages with context — never concatenate.'
    },
    commonMistakes: [
      'Concatenating strings with variables instead of using a parameterized ICU message — untranslatable and grammatically wrong per language.',
      'Hardcoding `n === 1 ? singular : plural` — only correct for English/a few languages; use ICU plural / Intl.PluralRules.',
      'Formatting dates, numbers, and currency manually instead of Intl.DateTimeFormat / Intl.NumberFormat.',
      'Shipping every locale catalog in the main bundle instead of lazy-loading the active locale.',
      'Ignoring RTL — using margin-left/right instead of logical properties, so Arabic/Hebrew layouts break.',
      'Text baked into images or fixed-width containers that clip longer translations (German, Finnish).',
      'In Next.js App Router: using a client i18n hook in a Server Component, or missing the locale middleware so localized routes 404.',
      'Using English keys as the message ("Save") so a copy tweak silently orphans every translation — prefer stable semantic ids.'
    ],
    seniorNotes: 'Treat translations as a pipeline, not a code change: extract keys from source (formatjs extract / i18next-parser), push to a TMS (Crowdin, Lokalise, Phrase), pull back compiled catalogs in CI. Enforce "no hardcoded strings" with eslint (i18next/no-literal-string or formatjs rules). Give translators context and screenshots — ICU without context yields wrong genders/plurals. Budget for pseudolocalization (accented, +30% length "Ṕŕö__" strings) early to surface truncation and hardcoded text before real translation. On App Router, decide server vs client rendering of copy: next-intl lets Server Components translate at request time (getTranslations) so you do not ship a runtime i18n library to the client for static text — good for bundle size. Currency is a data problem, not just formatting: store money in minor units + ISO code, format with Intl.NumberFormat at the edge. Locale is more than language — es-MX ≠ es-ES; key off BCP-47 tags. Time zones bite: format timestamps in the user\'s zone with Intl and store UTC.',
    interviewQuestions: [
      'Why is "i18n is just swapping strings from a dictionary" wrong? What else does it involve?',
      'Why must you never build a sentence by concatenating a variable, and what do you use instead?',
      'Explain ICU MessageFormat plural/select and why CLDR plural categories matter.',
      'How do you format dates, numbers, and currency correctly for a locale in the browser?',
      'How would you structure locale routing and translation loading in the Next.js App Router?',
      'How do you handle RTL languages, and what changes beyond flipping text direction?'
    ],
    interviewAnswers: [
      'Because localization is grammatical and cultural, not lexical. Pluralization rules differ (English 2 forms, Arabic 6), grammatical gender changes surrounding words, and dates/numbers/currency/units have locale-specific formats (1,000.50 vs 1.000,50; MM/DD vs DD.MM). Layout changes too — RTL languages mirror the whole UI, and translated text can be 30-40% longer, breaking fixed layouts. Word order differs, so you cannot assemble sentences from pieces. Real i18n means externalizing all copy into catalogs, using ICU messages for plurals/gender/variables, delegating formatting to Intl, and supporting RTL and dynamic layout — the string dictionary is the smallest part.',
      'Because word order, pluralization, and gender agreement differ per language, so "You have " + n + " new " + noun cannot be reordered or pluralized correctly by any translator — they only see fragments. Instead you use a single parameterized message with ICU MessageFormat: `{count, plural, one {You have # new message} other {You have # new messages}}`. The translator gets the whole sentence and supplies the correct forms for their language\'s plural categories; the code just passes count. This keeps grammar in the catalog, not in JavaScript.',
      'ICU MessageFormat embeds logic in the message string. plural picks a branch by number: `{n, plural, =0 {none} one {# item} other {# items}}`, where `#` is the locale-formatted number and one/other are CLDR plural categories. select branches on an arbitrary value, typically gender: `{g, select, male {He} female {She} other {They}}`. CLDR categories (zero, one, two, few, many, other) matter because languages have different sets — English uses one/other, Polish uses one/few/many/other, Arabic uses all six. By keying on categories rather than hardcoded numbers, one message works in every language and translators fill in each category their language actually uses; Intl.PluralRules is the underlying API that maps a number to its category.',
      'Use the built-in Intl API, never hand-rolled formatting. Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(amount) gives correct grouping, decimal separators, and currency placement per locale; style:"unit" handles units. Intl.DateTimeFormat(locale, { dateStyle, timeStyle, timeZone }).format(date) produces locale-correct dates/times in a given time zone. Intl.RelativeTimeFormat handles "3 days ago", Intl.ListFormat joins lists, Intl.Collator sorts. i18n libraries wrap these (react-intl\'s formatNumber, next-intl\'s useFormatter), but it is all CLDR-backed Intl underneath, which is why you never manually insert commas or slashes.',
      'I use a [locale] dynamic segment: app/[locale]/... with middleware that detects the locale from the URL, a cookie, or Accept-Language and redirects/rewrites accordingly, plus generateStaticParams to prerender each locale. With next-intl, its middleware handles detection and routing, request config loads only the active locale\'s catalog, Server Components translate via getTranslations (so static copy needs no client i18n runtime — smaller bundles) and Client Components via useTranslations. Catalogs are per-locale JSON, lazy-loaded per request, ideally split by route/namespace. I set <html lang> and dir per locale in the layout. This gives SEO-friendly localized URLs (/en, /es) and per-locale static generation.',
      'RTL is more than text alignment — the entire layout mirrors: navigation, icons (a back arrow flips), progress direction, and paddings/margins. I set <html dir="rtl" lang="ar"> so the browser handles text direction, and I write CSS with logical properties (margin-inline-start, padding-inline-end, inset-inline) instead of left/right so the layout flips automatically for RTL and stays correct for LTR. Directional icons need mirroring (transform or logical assets); some things (numbers, embedded LTR text, phone numbers) stay LTR within RTL via bidi handling. I test with a real RTL locale, not just dir toggling, because bidi text and mirrored components surface bugs a language swap alone hides.'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'next-intl in the Next.js App Router (Server + Client)',
        code: `// middleware.ts — locale detection + routing
import createMiddleware from 'next-intl/middleware';
export default createMiddleware({
  locales: ['en', 'es', 'ar'],
  defaultLocale: 'en'
});
export const config = { matcher: ['/((?!api|_next|.*\\\\..*).*)'] };

// app/[locale]/layout.tsx — set lang/dir + provide messages
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children, params
}: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages();          // loads only this locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={locale} dir={dir}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// A Server Component — translates at request time, no client i18n runtime
import { getTranslations } from 'next-intl/server';
export async function Greeting() {
  const t = await getTranslations('home');
  return <h1>{t('title')}</h1>;
}

// A Client Component — same catalog via a hook
'use client';
import { useTranslations } from 'next-intl';
export function Cart({ count }: { count: number }) {
  const t = useTranslations('cart');
  // ICU plural resolved with the active locale's CLDR rules
  return <span>{t('items', { count })}</span>;
}

// messages/en.json
// { "home": { "title": "Welcome" },
//   "cart": { "items": "{count, plural, =0 {Your cart is empty} one {# item} other {# items}}" } }
// messages/ar.json supplies zero/one/two/few/many/other forms.`
      },
      {
        lang: 'tsx',
        label: 'react-i18next setup + pluralized ICU-style message (SPA)',
        code: `// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ICU from 'i18next-icu';                 // adds full ICU MessageFormat
import HttpBackend from 'i18next-http-backend'; // lazy-load catalogs

i18n
  .use(ICU)
  .use(HttpBackend)                 // fetch /locales/{{lng}}/{{ns}}.json on demand
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'pl'],
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false }, // React already escapes
  });
export default i18n;

// public/locales/en/common.json
// { "cart_items": "{count, plural, =0 {No items} one {# item} other {# items}}",
//   "liked": "{gender, select, male {He} female {She} other {They}} liked this" }
// public/locales/pl/common.json uses one/few/many for Polish plural categories.

// Component
import { useTranslation } from 'react-i18next';

export function Cart({ count, gender }: { count: number; gender: string }) {
  const { t, i18n } = useTranslation();
  const price = new Intl.NumberFormat(i18n.language, {
    style: 'currency', currency: 'USD',
  }).format(1999.5); // -> $1,999.50 / 1.999,50 $ depending on locale

  return (
    <div>
      <p>{t('cart_items', { count })}</p>
      <p>{t('liked', { gender })}</p>
      <p>{price}</p>
      <button onClick={() => i18n.changeLanguage('pl')}>Polski</button>
    </div>
  );
}`
      }
    ]
  },

  /* ── Real-Time UIs — Phase 3: React Architecture ─────────────────────────── */
  {
    id: 'react-realtime', phase: 3, phaseName: 'React Architecture',
    orderIndex: 99, estimatedMins: 50, prerequisites: ['data-fetching-patterns', 'suspense-lazy'],
    title: 'Real-Time UIs: WebSockets & SSE',
    eli5: 'Normally your app asks the server "any news?" over and over (polling). Real-time flips it: the server keeps an open phone line and speaks the instant something happens. WebSockets are a two-way call (both sides talk). Server-Sent Events are a one-way radio (server broadcasts, you listen). You use these for chat, live scores, notifications, and dashboards that update themselves.',
    analogy: 'Polling is texting "you there yet?" every 10 seconds. Server-Sent Events is a live radio station — the DJ (server) talks and you just listen, and if the signal drops your radio auto-tunes back in. WebSockets is a phone call — either side can talk any time. A phone call is more powerful but costs more to keep open and is harder to run at scale.',
    explanation: 'Real-time UIs push data to the client the instant it changes instead of waiting for the user to refetch. There are three transports. Polling (or long-polling) repeatedly asks the server — simplest, works everywhere, but wastes requests and adds latency. Server-Sent Events (SSE) is a single long-lived HTTP response over which the server streams text events; it is one-directional (server→client), runs over plain HTTP/2, auto-reconnects via the browser\'s EventSource, and is perfect for feeds, notifications, and AI token streaming. WebSockets upgrade the connection to a full-duplex TCP channel where both sides send messages any time — the right tool for chat, collaborative editing, multiplayer, and anything with frequent client→server messages. The React-specific work is the same regardless of transport: you open the connection in useEffect, subscribe to messages and update state, and — critically — clean up on unmount so you do not leak sockets or set state after teardown. Production real-time also needs reconnection with backoff (networks drop), optimistic updates (show the user\'s action immediately, reconcile when the server confirms), and integration with your existing data layer (React Query cache or a store) so real-time messages and normal fetches share one source of truth.',
    technicalDeep: 'WebSocket: new WebSocket(url) opens ws:// or wss:// (always wss in prod); events are onopen, onmessage (e.data — parse JSON yourself), onerror, onclose (with code/reason — 1000 is normal). It is full-duplex over one TCP connection, low overhead per message, but stateful/sticky, so it complicates load balancing and horizontal scaling. SSE: new EventSource(url) over HTTP; the server responds with Content-Type: text/event-stream and writes "data: ...\\n\\n" frames; the browser fires onmessage (or addEventListener for named events) and AUTO-RECONNECTS, resuming from the Last-Event-ID header if you send ids. Limits: SSE is text-only, one-directional, and over HTTP/1.1 is capped at ~6 connections per domain (HTTP/2 multiplexes and removes this). Choosing: use SSE when data flows mostly one way (notifications, live feeds, LLM streaming) — it is simpler, reconnects for free, and traverses proxies as normal HTTP; use WebSockets when you need frequent bidirectional or binary traffic (chat, presence, games, collab). Polling is the fallback when neither is available or updates are infrequent. React lifecycle: create the connection inside useEffect, attach handlers, and return a cleanup that closes it — under React 18/19 StrictMode the effect runs twice in dev, so your cleanup MUST fully tear down or you leak a socket. Avoid re-opening on every render: keep the socket in a ref and list only stable deps (url). Reconnection: WebSocket does NOT auto-reconnect — you implement it in onclose with exponential backoff + jitter (e.g. min(1000·2^n, 30000) + random), capped, and reset the counter on a successful open; libraries (socket.io, reconnecting-websocket, Ably/Pusher SDKs) do this for you. Optimistic updates: apply the change to local/React Query state immediately, send to the server, and roll back if the ack/message says it failed. Integration: with TanStack Query, use queryClient.setQueryData in the message handler to patch the cache (or invalidateQueries to refetch), so the socket feeds the same cache your components already read. Scaling — the reason "the server side matters": WebSockets are stateful long-lived connections pinned to one server instance, so scaling out needs sticky sessions and a pub/sub backplane (Redis, NATS, Kafka) to fan messages across instances; a single Node process caps around 10k-65k concurrent sockets (file descriptors, memory). That is why teams often offload to managed real-time (Pusher, Ably, Supabase Realtime, PartyKit) or use SSE where possible. On serverless/edge (Vercel), long-lived WebSockets are awkward — SSE streaming or a managed WS provider is usually the pragmatic choice.',
    whatBreaks: 'Forgetting the useEffect cleanup — the socket stays open after unmount, handlers fire on a dead component, and you get "setState on unmounted component" plus a slow leak of connections. Re-creating the WebSocket on every render because it is not in a ref / deps are unstable — connection storm. Assuming WebSockets auto-reconnect (they do not) — a single Wi-Fi blip permanently kills real-time until refresh. Reconnecting with no backoff hammers a recovering server (thundering herd). StrictMode double-invoke in dev leaking a socket because cleanup is incomplete. Not parsing e.data (it is always a string/blob). Optimistic updates with no rollback so a failed send leaves the UI lying. Scaling WebSockets across multiple servers without sticky sessions + a pub/sub backplane, so users on different instances do not see each other\'s messages.',
    efficientWay: {
      title: 'Adding real-time to a React app',
      approaches: [
        { name: 'SSE for one-way streams; a managed WS provider (Ably/Pusher/Supabase/PartyKit) for bidirectional', verdict: 'best', reason: 'SSE gives you push + free auto-reconnect over plain HTTP for feeds, notifications, and AI streaming with almost no server complexity. For true bidirectional/presence, a managed provider handles reconnection, fan-out, scaling, and auth so you do not run a stateful socket fleet with a Redis backplane yourself.' },
        { name: 'Raw WebSocket / socket.io with your own server + Redis pub/sub', verdict: 'ok', reason: 'Full control and no per-message vendor cost; correct for large scale or strict data-residency, but you now own reconnection, sticky sessions, horizontal fan-out, and connection limits. Real engineering effort.' },
        { name: 'Short-interval polling everywhere', verdict: 'weak', reason: 'Trivial to build and sometimes right for infrequent, non-urgent updates, but wasteful and laggy for chat/live data — N clients × frequent requests crushes the server and still feels slow.' }
      ],
      recommendation: 'Match the transport to the data flow: SSE for server→client streams, WebSockets (ideally managed) for bidirectional. Wrap the connection in a custom hook (useWebSocket/useEventSource) with ref-stored socket, exponential-backoff reconnect, and useEffect cleanup. Feed messages into React Query / your store rather than parallel state, and do optimistic updates with rollback. Plan the server (sticky sessions + pub/sub) before you scale past one instance.'
    },
    commonMistakes: [
      'No useEffect cleanup closing the socket — leaks connections and fires setState after unmount.',
      'Creating the WebSocket in render or with unstable deps so it reconnects on every render.',
      'Assuming WebSockets auto-reconnect — they do not; you must handle onclose with backoff.',
      'Reconnecting immediately in a tight loop with no exponential backoff/jitter — thundering herd on a recovering server.',
      'Ignoring React StrictMode double-mount in dev and leaking a socket because cleanup is partial.',
      'Optimistic updates with no rollback path when the server rejects the change.',
      'Keeping real-time data in state parallel to React Query, so the socket and the cache disagree.',
      'Scaling WebSockets horizontally with no sticky sessions and no pub/sub backplane — messages do not fan out across instances.'
    ],
    seniorNotes: 'The hard part of real-time is the server, not the React hook. WebSockets are stateful and pinned to one instance, so horizontal scaling needs sticky sessions + a pub/sub backplane (Redis/NATS/Kafka) to broadcast across nodes, plus a plan for tens of thousands of file descriptors and heartbeats to detect dead peers. That operational cost is why I default to SSE for one-way flows and a managed provider (Ably, Pusher, Supabase Realtime, PartyKit) for bidirectional unless scale/cost/residency justifies self-hosting. On Vercel/serverless, long-lived WS do not fit the function model — use SSE streaming (works great, including for AI token streams) or a managed WS. Always design for the disconnect: exponential backoff with jitter and a cap, resume via Last-Event-ID (SSE) or a since-cursor (WS) so a reconnect backfills missed events instead of losing them, and surface connection state in the UI. Authenticate the connection (token in the upgrade/first message, not just the URL), rate-limit inbound messages, and validate every payload — an open socket is an attack surface. Finally, wire real-time into the existing cache (queryClient.setQueryData) so there is one source of truth, and prefer server-authoritative optimistic updates so the UI never permanently diverges.',
    interviewQuestions: [
      'Compare polling, SSE, and WebSockets — when do you reach for each?',
      'Walk through the useEffect lifecycle for a WebSocket connection and why cleanup matters (including StrictMode).',
      'WebSockets do not auto-reconnect. How do you implement robust reconnection?',
      'How do optimistic updates work with a real-time channel, and how do you avoid a lying UI?',
      'How do you integrate real-time messages with React Query / your state layer?',
      'Why does scaling WebSockets require more than a bigger React app — what happens on the server?'
    ],
    interviewAnswers: [
      'Polling is repeated HTTP requests — simplest and universally supported, but wasteful and laggy; good only for infrequent, non-urgent updates. SSE is a single long-lived HTTP response the server streams events over: one-directional (server→client), text-only, auto-reconnecting via EventSource, resumable with Last-Event-ID — ideal for notifications, live feeds, and LLM token streaming, and it plays nicely with HTTP infra and serverless. WebSockets upgrade to a full-duplex TCP channel where both sides send any time, including binary — the right choice for chat, presence, collaborative editing, and games where the client talks back frequently. Rule of thumb: mostly-download → SSE; frequent bidirectional → WebSockets; neither available or rare updates → polling.',
      'Open the connection inside useEffect (not in render), attach onopen/onmessage/onerror/onclose, and store the socket in a ref so renders do not recreate it; depend only on stable values like the URL. Return a cleanup function that removes handlers and calls socket.close() — this runs on unmount and before the effect re-runs. Cleanup matters because otherwise the socket outlives the component: handlers fire on a torn-down component (setState-after-unmount warnings) and connections leak. Under React 18/19 StrictMode in development the effect mounts, cleans up, and mounts again to surface exactly this bug, so the cleanup must fully close the socket; if it does, the double-invoke is harmless.',
      'WebSockets fire onclose on any drop and never reconnect themselves, so I implement it: in onclose (unless it was a deliberate close) schedule a reconnect after a delay computed with exponential backoff plus jitter — delay = min(base·2^attempt, maxCap) + random — increment the attempt counter each failure, and reset it to zero on a successful onopen. Cap the delay (e.g. 30s) so it keeps trying gently, optionally stop after N attempts and surface "disconnected" in the UI. On reconnect I resume from a cursor/last-event id so I backfill missed messages. Jitter prevents a thundering herd where every client reconnects simultaneously and re-crashes a recovering server. In practice I use a library (reconnecting-websocket, socket.io, or a managed SDK) that encodes this.',
      'Optimistic update: when the user acts (send message, like), I immediately apply the change to local/cache state and render it as pending, then send it over the channel. When the server acks or broadcasts the confirmed state, I reconcile — replace the temp item with the server version (real id/timestamp). If the server rejects or the send fails, I roll back to the pre-update state and show an error. The keys to not lying to the user are: keep the prior state to restore, mark optimistic items visually as pending, make the server authoritative on conflict, and dedupe when my own optimistic item also arrives via the broadcast (match on a client-generated id). With React Query I do this in onMutate/onError/onSettled.',
      'I treat the socket as another writer to the same cache rather than parallel state. In the message handler I call queryClient.setQueryData for the relevant query key to patch it in place (append a message, update a record), or queryClient.invalidateQueries to trigger a refetch when a targeted patch is hard. Components keep reading via useQuery, so they re-render from one source of truth and real-time updates and normal fetches never diverge. I set up the subscription in a useEffect (or a small provider) that has access to queryClient, and I key patches by the same query keys the fetches use. This also gives me caching, dedupe, and devtools for free instead of hand-managing socket state.',
      'Because WebSockets are stateful, long-lived connections pinned to a single server instance, unlike stateless HTTP you can spray across a pool. To scale out you need sticky sessions so a client stays on its instance, and a pub/sub backplane (Redis, NATS, Kafka) so a message received on one node is fanned out to subscribers connected to other nodes — without it, users on different servers cannot see each other. Each process is also bounded by file descriptors and memory (~10k-65k sockets), needs heartbeats/ping-pong to reap dead connections, and complicates deploys (draining thousands of live connections). That server-side burden is why real-time is an architecture decision, and why teams often use SSE or a managed provider (Ably, Pusher, Supabase Realtime, PartyKit) instead of running the socket fleet themselves.'
    ],
    codeExamples: [
      {
        lang: 'tsx',
        label: 'useWebSocket hook with reconnect (exponential backoff + jitter)',
        code: `'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type Status = 'connecting' | 'open' | 'closed';

export function useWebSocket<T = unknown>(url: string) {
  const [status, setStatus] = useState<Status>('connecting');
  const [last, setLast] = useState<T | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const attemptRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const closedByUs = useRef(false);

  const connect = useCallback(() => {
    setStatus('connecting');
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      attemptRef.current = 0;          // reset backoff on success
      setStatus('open');
    };
    ws.onmessage = (e) => {
      try { setLast(JSON.parse(e.data) as T); }
      catch { setLast(e.data as unknown as T); }
    };
    ws.onerror = () => ws.close();     // let onclose drive reconnect
    ws.onclose = () => {
      setStatus('closed');
      if (closedByUs.current) return;  // intentional teardown → stop
      const n = attemptRef.current++;
      const delay = Math.min(1000 * 2 ** n, 30_000)   // cap at 30s
        + Math.random() * 1000;                        // jitter
      timerRef.current = setTimeout(connect, delay);
    };
  }, [url]);

  useEffect(() => {
    closedByUs.current = false;
    connect();
    // Cleanup MUST fully tear down — StrictMode double-invokes this in dev.
    return () => {
      closedByUs.current = true;
      clearTimeout(timerRef.current);
      socketRef.current?.close(1000, 'unmount');
    };
  }, [connect]);

  const send = useCallback((data: unknown) => {
    const ws = socketRef.current;
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
  }, []);

  return { status, lastMessage: last, send };
}

// Feed messages into TanStack Query for one source of truth:
// const { lastMessage } = useWebSocket<ChatMsg>('wss://api.app/chat');
// useEffect(() => {
//   if (lastMessage) queryClient.setQueryData(['messages'],
//     (old: ChatMsg[] = []) => [...old, lastMessage]);
// }, [lastMessage]);`
      },
      {
        lang: 'tsx',
        label: 'useEventSource hook — SSE (auto-reconnect built in)',
        code: `'use client';
import { useEffect, useRef, useState } from 'react';

type Status = 'connecting' | 'open' | 'error';

export function useEventSource<T = unknown>(url: string) {
  const [status, setStatus] = useState<Status>('connecting');
  const [events, setEvents] = useState<T[]>([]);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // EventSource reconnects automatically and resumes via Last-Event-ID.
    const es = new EventSource(url, { withCredentials: true });
    esRef.current = es;

    es.onopen = () => setStatus('open');
    es.onmessage = (e) => {
      try { setEvents((prev) => [...prev, JSON.parse(e.data) as T]); }
      catch { /* ignore keep-alive comments */ }
    };
    // Named events: server writes "event: price\\ndata: {...}\\n\\n"
    es.addEventListener('price', (e) => {
      setEvents((prev) => [...prev, JSON.parse((e as MessageEvent).data)]);
    });
    es.onerror = () => setStatus('error'); // browser will retry on its own

    return () => es.close(); // cleanup on unmount / StrictMode re-run
  }, [url]);

  return { status, events };
}

// Server (Next.js App Router route handler) streaming SSE:
// export async function GET() {
//   const stream = new ReadableStream({
//     start(controller) {
//       const enc = new TextEncoder();
//       const id = setInterval(() => {
//         controller.enqueue(enc.encode(
//           \`id: \${Date.now()}\\nevent: price\\ndata: \${JSON.stringify({ v: Math.random() })}\\n\\n\`
//         ));
//       }, 1000);
//       // clear on cancel in a real handler
//     },
//   });
//   return new Response(stream, {
//     headers: { 'Content-Type': 'text/event-stream',
//                'Cache-Control': 'no-cache', Connection: 'keep-alive' },
//   });
// }`
      }
    ]
  }

]
