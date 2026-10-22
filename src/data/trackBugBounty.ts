import { Track } from '../types';

/**
 * Bug Bounty Mastery Path track (id: track-7, lessons 7.1–7.10).
 *
 * The advanced sequel to track-4 "The Bug Bounty Mindset": professional
 * scoping and rules of engagement, intent-driven recon, auth/session flaws,
 * SSRF, CSRF, race conditions, business logic abuse, chaining for impact,
 * polite automation, and the human side of disclosure.
 *
 * Widget wiring (central integration in LessonViewer.renderDiscoveryWidget):
 *   7.1  ScopeCheckDemo        (NEW widget — needs a `case` in the switch)
 *   7.2  TargetReconSandbox
 *   7.3  Base64DecodeDemo
 *   7.4  DevToolsInspection    (SSRF simulatedTarget)
 *   7.5  DevToolsInspection    (CSRF simulatedTarget)
 *   7.6  RaceConditionLab      (NEW widget — needs a `case` in the switch)
 *   7.7  FormBypassDemo
 *   7.8  CvssCalculatorDemo    (completes via the "Unauthenticated Mass IDOR" preset)
 *   7.9  NetworkInspectorDemo  (rate-limit simulatedTarget)
 *   7.10 ReportStudioDemo      (files a real report, +150 XP)
 *
 * Export name and track id MUST stay: `BUGBOUNTY_TRACKS` / `track-7`.
 */
export const BUGBOUNTY_TRACKS: Track[] = [
  {
    id: 'track-7',
    number: 7,
    title: "The Hunter's Craft",
    shortDescription:
      'Professional-grade hunting: scoping and rules of engagement, intent-driven recon, advanced exploitation, chaining findings for real impact, and the human side of disclosure.',
    philosophyBadge: 'Bug Bounty Path',
    iconName: 'Bug',
    colorAccent: 'purple',
    lessons: [
      /* ─────────────────────────── 7.1 — Scoping ─────────────────────────── */
      {
        id: 'lesson-7-1',
        trackId: 'track-7',
        number: '7.1',
        title: 'Scoping & Rules of Engagement',
        tagline: 'A critical bug found in the wrong place is just a rejected report. Scope is the contract that keeps your safe harbor intact.',
        estimatedMinutes: 8,
        difficulty: 'Beginner',
        mentalModelConcept:
          'A bug bounty program is a written contract, not a treasure hunt: it defines which systems you may touch, which techniques are permitted, and exactly what legal protection (safe harbor) you receive in return.',
        discoveryPrompt:
          'You just joined the "ExampleCo VDP" program. Read the brief on the left, then classify all 8 target cards as In-Scope, Out-of-Scope, or Needs Written Approval. Each answer is graded instantly with the real rationale — score 7/8 or better to internalize the scope.',
        discoveryComponent: 'ScopeCheckDemo',
        noticeThisMoments: [
          'Notice that the wildcard `*.example.com` covers every subdomain — even ones you discover yourself in certificate transparency logs — but it never crosses a domain boundary into `.net`.',
          'Notice that some assets technically match the wildcard yet still require written approval (third-party vendors, Internal/staging hosts): policy text overrides pattern matching.',
          'Notice that DoS and social engineering stay out of scope no matter how much damage they demonstrate — testing them voids your safe harbor before triage ever sees the report.'
        ],
        explanationMarkdown: `
### The Mental Model: Scope Is a Permission Slip

Think of a bug bounty program like a national park. The map marks the trails you may walk, the fences you may not cross, and the seasons when hunting is allowed. A ranger does not care that you *found* a rare animal off-trail — you were off-trail.

Programs work the same way. Before you send a single request, two documents decide everything: the **scope table** (which assets and techniques are authorized) and the **policy page** (how reports are handled, what safe harbor you get). Test outside that boundary — even brilliantly — and your report can be rejected before anyone reads the technical detail. Out-of-scope findings are not "extra credit"; they are unauthorized access in the eyes of the law the safe harbor was written to protect you from.

### Three Buckets Every Brief Sorts Assets Into

1. **In scope** — the assets the program invites you to attack, plus any technique not explicitly excluded.
2. **Out of scope** — excluded assets (partner domains, other customers) and excluded techniques (DoS, brute force, social engineering).
3. **Needs written approval** — gray zones: third-party services embedded in the product, internal/staging hosts, newly launched assets. One email to the program manager turns gray into green.

### What Gets a Report Rejected Before Triage

- Findings gathered with an excluded technique, regardless of severity
- Vulnerabilities in a third party the program does not own (they cannot fix it)
- Anything touching an out-of-scope asset, including "I only poked it once"
- Stale scope: assets dropped from the program between your recon and your report

\`\`\`
# a professional hunter's scope note, written before touching anything
program: ExampleCo VDP
scope_checked_at: 2026-10-22
in_scope: *.example.com, api.example.com/v1/*
excluded: partners.example.net, DoS, social engineering
approval_needed: pay.flowpath.com, staging.example.com
safe_harbor: yes - policy section 4
\`\`\`

> **The Habit to Build:** Re-read the scope table the day you start testing, and paste a dated copy into your notes. When a target is genuinely ambiguous, the professional move is to ask *before* testing — never to argue afterward.
        `,
        devTakeaway:
          'Publish an asset inventory and a machine-readable scope list (VDP/BBP programs do). If your security policy cannot answer "is this host in scope?", testers and incident responders will both guess.',
        securityTakeaway:
          'Scope compliance is part of the exploit chain, not paperwork around it: verify the asset is authorized, log the date you checked, and treat approval-required gray zones as out-of-scope until an approval email exists.',
        challenge: {
          id: 'chal-7-1',
          type: 'triage',
          prompt:
            'Classify all 8 targets in the Scope Lab (7/8 correct unlocks the lab). Then type the one hostname the brief explicitly excludes — the partner domain — exactly as written in the brief.',
          targetHint: 'It is listed under the rose "Out of Scope" bullet in the program brief panel.',
          solution: 'partners.example.net',
          successMessage:
            'Scope locked in. `partners.example.net` is the explicit carve-out — the wildcard `*.example.com` never reaches across into `.net`, so testing that portal would void your safe harbor even if you found a critical flaw.',
          explanation:
            'Professional hunters lose more money to scope mistakes than to missed bugs. The brief is the authorization; everything outside it is someone else\'s system.'
        },
        simulatedTarget: {
          appName: 'ExampleCo Program Portal',
          targetUrl: 'https://bounty.exampleco.com/programs/exampleco-vdp',
          description: 'The disclosure program page: scope table, policy, and safe-harbor terms.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100">
  <h3 class="font-bold">ExampleCo Responsible Disclosure</h3>
  <p class="text-xs text-slate-400 mt-1">Safe harbor: testing inside the written scope below is authorized (Policy §4).</p>
  <ul class="text-xs mt-3 space-y-1 text-slate-300">
    <li>IN: *.example.com (web app + all subdomains)</li>
    <li>IN: api.example.com/v1/* (test accounts provided)</li>
    <li>OUT: partners.example.net and *.example.net</li>
    <li>OUT: DoS, brute force, social engineering, physical</li>
    <li>APPROVAL: third-party iframes, Internal/staging hosts</li>
  </ul>
</div>`,
          storageItems: [{ key: 'bounty_session', value: 'hunter_9c11', type: 'cookie' }],
          networkRequests: [
            {
              url: '/api/programs/exampleco-vdp/scope',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                in_scope: ['*.example.com', 'api.example.com/v1/*'],
                out_of_scope: ['partners.example.net', '*.example.net', 'dos', 'social_engineering'],
                approval_required: ['pay.flowpath.com', 'staging.example.com'],
                safe_harbor: true
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 7.2 — Recon ───────────────────────────── */
      {
        id: 'lesson-7-2',
        trackId: 'track-7',
        number: '7.2',
        title: 'Recon With Intent',
        tagline: 'Scanners find forgotten doors. Hunters map the building, then decide which doors deserve a hypothesis.',
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        mentalModelConcept:
          'Recon is not enumeration volume — it is building a model of the attack surface (subdomains, endpoints, parameters, hidden verbs, third-party callbacks) and forming hypotheses about where developer assumptions break.',
        discoveryPrompt:
          'Return to the ShopNova sandbox. This time reconnoiter like a professional: open every tab, feed the endpoints unusual inputs, verify the coupon, and pull at least 2 anomalies into your notebook. The sandbox tracks what you noticed.',
        discoveryComponent: 'TargetReconSandbox',
        noticeThisMoments: [
          'Notice how the order endpoint trusts a sequential ID: fetching `8820` returns another customer\'s receipt — reconnaissance already found an IDOR before you wrote a single exploit.',
          'Notice what the coupon verification API leaks back (`max_uses_remaining`, `internal_salt`): responses often describe the very logic you could subvert.',
          'Notice the error path: a single quote in the order ID dumps a database driver stack trace — verbose errors are recon gifts that reveal technology, versions, and table names.'
        ],
        explanationMarkdown: `
### The Mental Model: Map the Territory Before You Knock

A locksmith surveying a building does not try every door at random. They count the doors, note which are propped open, look for the service entrances the architect forgot, and *then* decide which lock deserves their tools. Recon is that survey.

In bug bounty, the attack surface is the complete list of things that accept input: subdomains, endpoints, parameters, file uploads, webhooks, hidden verbs sitting in JavaScript bundles. Track 4 taught you to notice anomalies. This track asks a harder question: **which anomaly is worth your next hour?**

### The Recon Order That Saves Weeks

1. **Passive** — the program's asset list, certificate transparency logs, DNS history. Zero traffic, zero risk.
2. **Content discovery** — download the JavaScript bundles and search for \`/api/\`, \`/internal\`, \`/admin\`, \`/export\`. Endpoints with no UI button are free recon.
3. **Authenticated sweep** — log in with a test account, click every feature exactly once, and keep DevTools open the whole time.
4. **Hypothesis** — from the notes above: "the coupon logic leaks its salt; maybe codes are derivable."

### Secrets Hide in Responses, Not Pages

\`\`\`
GET /api/coupons/verify?code=WELCOME10
{ "valid": true, "discount_percent": 10,
  "max_uses_remaining": 9999,
  "internal_salt": "sec_88a" }
\`\`\`

The page rendered one green checkmark. The response handed you the coupon system's internal salt and an unlimited use counter. That single observation is a hypothesis about forgery and unlimited redemptions — a thread worth pulling.

> **The Habit to Build:** Recon is measured by *notes*, not by requests. End every session with a written list of "things the developer assumed", and rank them by blast radius before you test anything.
        `,
        devTakeaway:
          'Assume every response your API returns will be read by someone building a map of your system. Serialize only what the client needs; move salts, counters, and algorithm hints server-side.',
        securityTakeaway:
          'Recon with intent means ranking anomalies by the assumption they violate — ID ownership, counter integrity, error verbosity — and testing the highest-blast-radius hypothesis first.',
        challenge: {
          id: 'chal-7-2',
          type: 'inspect',
          prompt:
            'In the recon sandbox, open the Catalog tab and verify coupon code WELCOME10. The API response leaks two internal values. Type the one called `internal_salt`.',
          targetHint: 'Catalog tab → coupon box → enter WELCOME10 → Verify Coupon. The leak appears in the feedback line.',
          solution: 'sec_88a',
          successMessage:
            'Thread pulled. The coupon verify endpoint leaked `internal_salt: sec_88a` — the exact value a hunter would feed into a "can I derive other codes?" hypothesis next.',
          explanation:
            'Pages show you what developers intended you to see. Responses show what the server actually said. Recon with intent reads responses.'
        },
        simulatedTarget: {
          appName: 'ShopNova Marketplace (Recon Sandbox)',
          targetUrl: 'https://shopnova.io/store',
          description: 'The e-commerce store from the foundations path — anomalies included, nobody pointing at them.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100">
  <h3 class="font-bold text-purple-400">ShopNova</h3>
  <p class="text-xs text-slate-400 mt-1">Logged in as: buyer_alex (#8821)</p>
  <div class="mt-3 text-xs text-slate-300">Coupon box, order lookup, and account tabs available.</div>
</div>`,
          storageItems: [
            { key: 'shopnova_cart_token', value: 'tok_cart_guest_99', type: 'cookie' },
            { key: 'user_permission_level', value: 'standard_customer', type: 'localStorage' }
          ],
          networkRequests: [
            {
              url: '/api/orders/8820',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { order_id: 8820, customer: 'Dr. Evelyn Reed', total: 3850.0, note: 'neighbor ID returned without auth check' }
            },
            {
              url: '/api/coupons/verify?code=WELCOME10',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { valid: true, discount_percent: 10, max_uses_remaining: 9999, internal_salt: 'sec_88a' }
            }
          ]
        }
      },

      /* ─────────────────────── 7.3 — Auth & Sessions ────────────────────── */
      {
        id: 'lesson-7-3',
        trackId: 'track-7',
        number: '7.3',
        title: 'Auth & Session Weaknesses',
        tagline: 'Login forms get the attention. Password-reset emails, session cookies, and token handling get the bounties.',
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        mentalModelConcept:
          'Identity is a conversation, not a badge: sessions must rotate when privilege changes, reset tokens must be single-use and short-lived, and a token the client can read is a token the client can forge — encoding is not encryption.',
        discoveryPrompt:
          'The Base64 decoder below holds a session token from a "logged-in" browser. Click "Load JWT Token", decode both halves, and read what the app lets any user inspect — and forge. What role does the server apparently believe in?',
        discoveryComponent: 'Base64DecodeDemo',
        noticeThisMoments: [
          'Notice the token\'s structure: `header.payload.signature` — the loaded token has only TWO segments. A claim with no signature is not a session, it is a rumour someone typed.',
          'Notice the decoded payload contains `role: "admin"` in plain sight: Base64 is an encoding alphabet, not encryption — anyone holding the token holds the claims.',
          'Notice the password-reset response in DevTools: a token with `single_use: false` and no expiry means a leaked email grants permanent access.'
        ],
        explanationMarkdown: `
### The Mental Model: The Keycard and the Front Desk

A hotel keycard is plastic. The *authority* lives in the front desk's records: which room it opens, until when, and whether it was revoked. Sessions work the same way — the cookie or token is just a pointer to server-side (or cryptographically signed) state. Most auth bugs are bugs in the *lifecycle* of that pointer, not in the login form everyone tests.

### The Three Families of Auth Bugs

1. **Password-reset flaws** — tokens that never expire, can be used twice, arrive in a URL that leaks through the \`Referer\` header, or whose host is taken from a poisoned \`Host\` header ("send the reset link to attacker-controlled.example").
2. **Token handling** — JWTs decoded (and trusted) client-side, \`alg: none\` accepted, secrets embedded in claims, tokens stored where scripts can reach them.
3. **Session lifecycle** — **fixation**: a session ID issued before login survives into the authenticated session, so an attacker who planted it rides along; **missing rotation**: elevating to admin does not change the ID.

### Read the Token Yourself

\`\`\`
segment 1 -> {"alg":"HS256","typ":"JWT"}          // header
segment 2 -> {"userId":892,"role":"admin"}        // payload
segment 3 -> (missing!)                           // signature
\`\`\`

That third segment is the whole security model. Without a signature the server cannot distinguish your claims from anyone else's — and even *with* one, a token whose session ID never rotates after login means a stolen pre-auth cookie still works.

> **The Habit to Build:** After any privilege change — login, password change, role upgrade — ask "did the session identifier change?" Then ask the same question about reset tokens: single-use, short expiry, constant-time comparison.
        `,
        devTakeaway:
          'Rotate session IDs on every privilege transition, make reset tokens single-use with short TTLs stored server-side, and sign tokens the server actually verifies — never roll your own crypto from Base64.',
        securityTakeaway:
          'Treat every token as readable by its holder. The questions that pay: what does the payload claim, when does it die, how many times can it be used, and does anything re-check it server-side?',
        challenge: {
          id: 'chal-7-3',
          type: 'decode',
          prompt:
            'Click "Load JWT Token" in the decoder and press "Decode Raw Bytes". The payload JSON contains a `role` claim. Type the exact value of that claim.',
          targetHint: 'The second (payload) segment decodes to {"userId":892,"role":"..."}. Type just the role value.',
          solution: 'admin',
          successMessage:
            'Decoded. `role: "admin"` was sitting in plaintext the whole time — no key, no cipher, just Base64. And with no signature segment attached, the server has nothing to verify that claim against.',
          explanation:
            'Security literacy means never confusing encoding with encryption, and never trusting a claim the server did not itself sign, verify, and expire.'
        },
        simulatedTarget: {
          appName: 'ExampleCo Auth Service',
          targetUrl: 'https://auth.example.com/login',
          description: 'Login and password-reset flows, plus the session token the browser stores after sign-in.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100 max-w-sm">
  <h3 class="font-bold">Sign in to ExampleCo</h3>
  <input class="w-full bg-slate-950 border border-slate-700 rounded p-1.5 mt-3 text-xs" placeholder="email" />
  <input class="w-full bg-slate-950 border border-slate-700 rounded p-1.5 mt-2 text-xs" type="password" placeholder="password" />
  <button class="w-full mt-3 py-1.5 bg-cyan-600 rounded text-xs font-bold">Log In</button>
  <a class="text-[11px] text-cyan-400 underline mt-2 block">Forgot password?</a>
</div>`,
          storageItems: [
            {
              key: 'session_token',
              value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg5Miwicm9sZSI6ImFkbWluIn0',
              type: 'cookie'
            },
            { key: 'pre_auth_session_id', value: 'sess_33a1b2', type: 'localStorage' }
          ],
          networkRequests: [
            {
              url: '/auth/login',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json', 'Set-Cookie': 'session_token=...; Path=/; HttpOnly' },
              body: { email: 'alex@example.com', password: '***' },
              response: { ok: true, role: 'user', rotated_session: false, reused_pre_auth_id: 'sess_33a1b2' }
            },
            {
              url: '/auth/password-reset/request',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: { email: 'alex@example.com' },
              response: {
                ok: true,
                reset_url_preview: 'https://auth.example.com/reset?token=rt_9f21c7',
                token_expires_in: null,
                single_use: false
              }
            }
          ]
        }
      },

      /* ───────────────────────────── 7.4 — SSRF ──────────────────────────── */
      {
        id: 'lesson-7-4',
        trackId: 'track-7',
        number: '7.4',
        title: 'SSRF: Borrowing the Server\'s Seat',
        tagline: 'You cannot reach the internal network — but the server can, and it will happily fetch any URL you ask it to.',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        mentalModelConcept:
          'SSRF exists wherever the server turns attacker-controlled input into an outbound request: the attacker cannot walk the internal corridor themselves, but they can ask the receptionist to walk over and read the sign aloud.',
        discoveryPrompt:
          '"LinkPreview Pro" fetches any URL you submit and returns the page title plus a body excerpt. Open the Simulated DevTools Network tab and inspect the recorded POST /api/preview calls — where did the server actually go, and what did it read back for you?',
        discoveryComponent: 'DevToolsInspection',
        noticeThisMoments: [
          'Notice the request payloads: the `url` parameter points at `169.254.169.254` — the cloud metadata service, only reachable from inside the victim\'s network. The fetcher went there for you.',
          'Notice that the responses come back 200 OK with a `body_excerpt`: this is *full-read* SSRF, the most generous kind — the internal content is reflected straight to the attacker.',
          'Notice the `127.0.0.1:8080/admin/jobs` entry: localhost admin panels are the second-most common SSRF prize, right after metadata credentials.'
        ],
        explanationMarkdown: `
### The Mental Model: The Server as Your Proxy

Imagine a locked office corridor you can never enter. But the building has a receptionist who fetches any sign you point at and reads it back to you. You never crossed the boundary — you weaponized someone who was already inside.

That is SSRF (Server-Side Request Forgery). Any feature that "fetches a URL for you" — link previews, webhook testers, URL importers, PDF renderers, PDF-to-image converters, image proxy caches — is a candidate. The attacker controls the destination; the request comes from the server's trusted network position.

### Why the Metadata Endpoint Is Famous

\`\`\`
POST /api/preview
{"url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/videre-preview-role"}

HTTP/1.1 200 OK
{"body_excerpt": "{\\"Code\\":\\"Success\\",\\"AccessKeyId\\":\\"ASIA4Z7Q...\\",
 \\"SecretAccessKey\\":\\"wJalrXUtnFEMI/K7MDENG...\\",\\"Token\\":\\"IQoJb3JpZ2luX2Vj...\\"}"}
\`\`\`

\`169.254.169.254\` is the address cloud instances use to fetch their own IAM credentials. A server with an over-eager URL fetcher hands those credentials to anyone who asks — turning a preview button into full cloud account takeover.

### Full-Read vs Blind SSRF

- **Full-read:** the response (or an error message) returns the fetched content. Easiest to exploit, as above.
- **Blind:** nothing comes back — the request still fires. You prove it with an out-of-band callback domain you control ("did my server see the hit?") or by timing.

### Bypasses Worth Knowing

When a naive filter blocks the obvious payloads, hunters reach for the alphabet: redirects that bounce through an allowed domain, decimal or hex spellings of the same IP (\`2852039166\` is also \`169.254.169.254\`), IPv6's \`[::ffff:169.254.169.254]\` form, and DNS names that resolve to internal addresses after the allowlist check ran. Each one is a different flavor of the same question: "which address does the *connection* use, not the string?"

> **The Habit to Build:** Any "paste a URL" feature gets three tests: a callback domain you own, \`http://127.0.0.1\` variants, and the metadata IP. Fixes are layered: URL allowlists, scheme restrictions, DNS resolution before connect (no rebinding), and an egress firewall that refuses link-local destinations.
        `,
        devTakeaway:
          'Resolve and validate the destination server-side against an allowlist, pin the connection to the resolved IP, block private/link-local ranges and non-HTTP schemes, and enforce egress filtering at the network layer as a second net.',
        securityTakeaway:
          'SSRF is "the server goes where I cannot". Test every URL-taking feature with callbacks first (blind) and metadata/IP literals second (full-read) — the internal network is the real target, not the preview text.',
        challenge: {
          id: 'chal-7-4',
          type: 'inspect',
          prompt:
            'Open the Simulated DevTools Network tab and inspect the recorded POST /api/preview entries. One of them reached the cloud metadata service. Type the IP address of that metadata service.',
          targetHint: 'Look at the `url` field inside the request payloads — the internal address that only the server could reach.',
          solution: (input: string) => /169\.254\.169\.254/.test(String(input ?? '')),
          successMessage:
            'You followed the fetcher home. `169.254.169.254` is the link-local metadata address; the preview service reached it from inside the network and read IAM credentials back to you — a button that became cloud account takeover.',
          explanation:
            'Where the server can go and you cannot, SSRF is the difference. Internal IPs, localhost admin panels, and metadata endpoints are the three prizes worth memorizing.'
        },
        simulatedTarget: {
          appName: 'LinkPreview Pro (Webhook Fetcher)',
          targetUrl: 'https://linkpreview.internal/dashboard/new',
          description: 'A URL preview service that fetches arbitrary links server-side and returns the title and a body excerpt.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100 max-w-lg">
  <h3 class="font-bold">Generate Link Preview</h3>
  <p class="text-xs text-slate-400 mt-1">Paste any URL — our renderer will fetch it and show a title + excerpt.</p>
  <input class="w-full bg-slate-950 border border-slate-700 rounded p-1.5 mt-3 text-xs font-mono"
         value="http://169.254.169.254/latest/meta-data/" />
  <button class="mt-3 px-3 py-1.5 bg-cyan-600 rounded text-xs font-bold">Fetch Preview</button>
  <input type="hidden" name="callback_id" value="cb_8821" />
</div>`,
          storageItems: [
            { key: 'preview_session', value: 'sess_7c1e9f2a', type: 'cookie' },
            { key: 'last_preview_url', value: 'http://169.254.169.254/latest/meta-data/', type: 'localStorage' }
          ],
          networkRequests: [
            {
              url: '/api/health',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { status: 'ok', version: '2.4.1', fetcher: 'internal' }
            },
            {
              url: '/api/preview',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json', 'Server-Timing': 'fetch;dur=41' },
              body: { url: 'http://169.254.169.254/latest/meta-data/' },
              response: {
                fetched: 'http://169.254.169.254/latest/meta-data/',
                title: 'meta-data/',
                status_fetched: 200,
                body_excerpt: 'ami-id\nhostname\niam/\ninstance-id\nlocal-ipv4\nsecurity-groups\n'
              }
            },
            {
              url: '/api/preview',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json', 'Server-Timing': 'fetch;dur=68' },
              body: { url: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/videre-preview-role' },
              response: {
                fetched: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/videre-preview-role',
                title: 'videre-preview-role',
                status_fetched: 200,
                body_excerpt:
                  '{"Code":"Success","AccessKeyId":"ASIA4Z7QEXAMPLE","SecretAccessKey":"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY","Token":"IQoJb3JpZ2luX2VjEEXAMPLE..."}'
              }
            },
            {
              url: '/api/preview',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: { url: 'http://127.0.0.1:8080/admin/jobs' },
              response: {
                fetched: 'http://127.0.0.1:8080/admin/jobs',
                title: 'Internal Job Runner',
                status_fetched: 200,
                body_excerpt:
                  '[{"job":"db-backup","schedule":"0 * * * *","status":"running"},{"job":"purge-audit-logs","status":"paused"}]'
              }
            }
          ]
        }
      },

      /* ──────────────────────────── 7.5 — CSRF ───────────────────────────── */
      {
        id: 'lesson-7-5',
        trackId: 'track-7',
        number: '7.5',
        title: 'CSRF & Modern Defenses',
        tagline: 'The browser attaches your session to requests you never made. Modern defenses exist — the bug is which ones are missing.',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        mentalModelConcept:
          'Cookies are ambient authority: the browser will happily staple your session to a request initiated by another site, so every state-changing action needs proof it came from your own origin — and one XSS hole makes all of these defenses moot.',
        discoveryPrompt:
          'Nimbus Bank lets logged-in users change their recovery email. Open the Simulated DevTools Network tab: inspect the Set-Cookie header on GET /settings/email, then the cross-site POST /api/account/email that follows. What proof did the server demand before changing a security-critical field?',
        discoveryComponent: 'DevToolsInspection',
        noticeThisMoments: [
          'Notice the `Set-Cookie` header: `nimbus_session` ships with `HttpOnly` but NO `SameSite` attribute — so the browser still attaches it to cross-site POSTs.',
          'Notice the POST payload: just `{"email": ...}` — no CSRF token, no nonce. The only proof of origin the server had was a cookie any site can trigger.',
          'Notice `csrf_validated: false` in the response and the attacker `Referer`: the server literally documents that it never checked where the request came from.'
        ],
        explanationMarkdown: `
### The Mental Model: A Forged Letter With a Real Signature

Imagine the mailroom staples your signature to every letter it delivers, no questions asked. An attacker writes the letter; the mailroom signs it as you. CSRF (Cross-Site Request Forgery) works exactly like that: cookies are attached by the browser based on *domain*, not on *intent* — a form or image tag on \`evil-pocs.example\` that posts to \`nimbus.example.com\` carries your session along for free.

### Defenses, in Order of Modern Strength

1. **\`SameSite=Lax\` (or \`Strict\`) on session cookies** — the browser stops attaching the cookie to cross-site POSTs entirely. Lax still allows top-level GET navigation, so logout links keep working.
2. **CSRF tokens / double-submit** — a random value bound to the session, sent in the form or header, compared server-side. A cross-site attacker cannot read it (same-origin policy) so cannot forge it.
3. **Verifying \`Origin\` / \`Sec-Fetch-Site\`** — cheap server-side check that the request was same-site.
4. **Step-up auth** — re-authentication or WebAuthn for destructive actions, so a forged request still fails.

### When XSS Makes CSRF Moot

An attacker who can run JavaScript on your origin can read the CSRF token straight out of the DOM and \`fetch()\` with it — every token defense evaporates. This is why XSS is rated higher than CSRF almost everywhere: fix the XSS and you also killed CSRF, but the reverse is not true.

\`\`\`
Set-Cookie: nimbus_session=s%3A9f2ab1c4; Path=/; HttpOnly   # no SameSite

POST /api/account/email   (Origin: https://evil-pocs.example)
-> 200 {"ok":true,"message":"Recovery email updated","csrf_validated":false}
\`\`\`

> **The Habit to Build:** Every state-changing endpoint should answer one question before it acts: "what proves this came from our own page?" If the answer is "nothing", you are one evil iframe away from an account takeover chain.
        `,
        devTakeaway:
          'Set `SameSite=Lax` (or `Strict`) on session cookies, require a per-session CSRF token on every state-changing route, verify `Origin`, and never accept security changes from bare cookie authentication alone.',
        securityTakeaway:
          'Check Set-Cookie for the SameSite attribute and POST bodies for tokens: missing SameSite plus a tokenless state-changing endpoint plus email/password change equals an account takeover chain.',
        challenge: {
          id: 'chal-7-5',
          type: 'inspect',
          prompt:
            'Inspect the Set-Cookie header on GET /settings/email in the Network tab — the session cookie has no SameSite attribute, so the browser sends it on cross-site POSTs. Type the missing attribute\'s defensive value: `lax`.',
          targetHint: 'Type exactly `lax`. (`strict` is also accepted — it blocks the cookie even on top-level GET navigation.)',
          solution: (input: string) => /^(same[-_ ]?site[=: ]*)?(lax|strict)$/i.test(String(input ?? '').trim()),
          successMessage:
            '`SameSite=Lax` would have stopped this cold: the browser refuses to attach the session cookie to a POST initiated by another site, and the forged email change never authenticates.',
          explanation:
            'CSRF defenses fail by absence, not by cleverness. SameSite is one attribute; the token is one field. The Network tab shows you both in seconds.'
        },
        simulatedTarget: {
          appName: 'Nimbus Bank — Account Settings',
          targetUrl: 'https://nimbus.example.com/settings/email',
          description: 'A cookie-authenticated settings page whose email change endpoint demands no CSRF proof at all.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100 max-w-md">
  <h3 class="font-bold">Recovery Email</h3>
  <p class="text-xs text-slate-400 mt-1">We use this address to restore account access.</p>
  <form action="/api/account/email" method="POST" class="mt-3 space-y-2">
    <input name="email" class="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs" />
    <button class="px-3 py-1.5 bg-cyan-600 rounded text-xs font-bold">Save Email</button>
    <!-- no csrf input anywhere in this form -->
  </form>
</div>`,
          storageItems: [
            { key: 'nimbus_session', value: 's%3A9f2ab1c4d5e6a7b8; Path=/; HttpOnly', type: 'cookie' },
            { key: 'nimbus_theme', value: 'dark', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/settings/email',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'nimbus_session=s%3A9f2ab1c4d5e6a7b8; Path=/; HttpOnly' },
              response: '<!doctype html> <form action="/api/account/email" method="POST"> ... </form>  <!-- no csrf token -->'
            },
            {
              url: '/api/account/email',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json', 'Referer': 'https://evil-pocs.example/cross-site.html' },
              body: { email: 'recovery-update@evil-pocs.example' },
              response: {
                ok: true,
                previous_email: 'alex@example.com',
                new_email: 'recovery-update@evil-pocs.example',
                csrf_validated: false
              }
            },
            {
              url: '/api/account',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { userId: 892, email: 'recovery-update@evil-pocs.example', mfa: 'off' }
            }
          ]
        }
      },

      /* ─────────────────────── 7.6 — Race Conditions ─────────────────────── */
      {
        id: 'lesson-7-6',
        trackId: 'track-7',
        number: '7.6',
        title: 'Race Conditions: Beating the Check',
        tagline: 'The server checked. The server acted. Nothing said those two moments had to be about the same state.',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        mentalModelConcept:
          'A race condition (TOCTOU — time-of-check to time-of-use) exploits the gap between reading a condition and acting on it: parallel requests all observe the same "valid" state before any of them writes the consequences.',
        discoveryPrompt:
          'The lab simulates POST /api/giftcards/redeem: the gift card holds 80 credits, each license costs 80, and the handler checks the balance before deducting. Fire a single serial request to see why it loses — then raise the burst and watch the read/write timeline until the lab flags DOUBLE-SPEND ACHIEVED.',
        discoveryComponent: 'RaceConditionLab',
        noticeThisMoments: [
          'Notice the gap in the server code: CHECK (read balance) → ~60ms of audit logging → ACT (deduct). Any request whose check lands inside that window reads the same stale "80 credits left".',
          'Notice the timeline: requests that CHECK before the first write commits turn green (200 OK); requests after it turn rose (409 Conflict). The race is won or lost in a window of milliseconds, not skill.',
          'Notice the ledger: 4 parallel requests turn a wallet that could afford exactly one license into two grants and a balance of -80. The bank does not round this off.'
        ],
        explanationMarkdown: `
### The Mental Model: One Apple, Two Customers

The shelf holds one apple. Two customers ask the stocker simultaneously. Both are told "yes, there is one" before either reaches the shelf — and both walk away with it. Nothing lied; the two moments of *checking* and the single moment of *taking* simply overlapped.

In code this is **TOCTOU** — time-of-check to time-of-use. The handler reads a condition, does something slow (logging, a network call, a cache write), and only then acts — on the copy it read long ago.

### Where Hunters Find the Gap

- **Double-spend** — gift cards, wallet balances, referral credits (the lab above)
- **Coupon / reward abuse** — a "one per user" flag set *after* the reward is granted
- **Limit bypass** — "max 2 tickets per account" enforced by reading a counter instead of locking the row
- **Workflow skipping** — refund-before-capture, withdraw-before-balance-check, upvote-then-downvote spam

Scanners can never find these: a race is not a bad *input*, it is bad *timing*. You need concurrency, and you need to look at what two in-flight responses both claimed was true.

### How the Win Is Proven (and the Fix)

\`\`\`
serial : 1 request  -> balance 80 -> 0        (as designed)
burst  : 4 requests -> 2 pass the stale check
ledger : 80 -> 80 - 80 - 80 = -80             DOUBLE-SPEND
\`\`\`

The fix is to erase the gap, not to shorten it: a database transaction with a row lock, an atomic conditional update (\`UPDATE wallets SET balance = balance - 80 WHERE id = ? AND balance >= 80\`), or idempotency keys that make the second identical request a no-op.

> **The Habit to Build:** Any endpoint that checks a balance, quota, or "one-per-user" flag before acting deserves one burst test: 4–20 parallel requests, then compare the responses. If two of them both say "granted", you found money.
        `,
        devTakeaway:
          'Make check-and-act atomic: lock the row, use conditional UPDATEs that re-verify the invariant, or deduplicate with idempotency keys. Audit logs belong inside the transaction, not in the gap.',
        securityTakeaway:
          'Races are invisible to scanners and to serial testing. Burst anything that spends, counts, or limits — and treat "two 200 OKs where one should have been a 409" as direct financial impact.',
        challenge: {
          id: 'chal-7-6',
          type: 'tamper',
          prompt:
            'In the Race Lab, fire a burst of at least 4 parallel redeems until the ledger flags DOUBLE-SPEND ACHIEVED. Then type the final wallet balance shown in the ledger — it will be a negative number (e.g. -80).',
          targetHint: 'Serial (1 request) always fails. Push the slider to 4 or higher, hit Fire, and read the "Wallet After" figure.',
          solution: (input: string) => {
            const match = String(input ?? '')
              .replace(/[$,\s]/g, '')
              .match(/-?\d+(\.\d+)?/);
            if (!match) return false;
            return parseFloat(match[0]) <= -80;
          },
          successMessage:
            'Double-spend achieved — the wallet went negative because every winning request checked before the first deduction committed. That is a P1-grade financial bug found with timing instead of injection.',
          explanation:
            'The gap between reading a condition and acting on it is where money disappears. Transactions, row locks, and atomic conditional updates erase it; hopeful reads extend it.'
        },
        simulatedTarget: {
          appName: 'GiftCard Redemption Flow',
          targetUrl: 'https://wallet.example.com/redeem',
          description: 'The gift-card page behind the lab: 80 credits on the card, 80 credits per license.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100 max-w-md">
  <h3 class="font-bold">Redeem Gift Card GC-4471</h3>
  <p class="text-xs text-slate-400 mt-1">Balance: 80 credits — enough for one Pro Year license.</p>
  <button class="mt-3 px-3 py-1.5 bg-purple-600 rounded text-xs font-bold">Redeem for Pro Year (80 credits)</button>
</div>`,
          storageItems: [{ key: 'wallet_session', value: 'wal_5a2f', type: 'cookie' }],
          networkRequests: [
            {
              url: '/api/wallet',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { balance: 80, currency: 'credits', card_id: 'GC-4471' }
            },
            {
              url: '/api/giftcards/redeem',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: { license: 'pro-year', request_id: 'req_01' },
              response: { ok: true, license_granted: 'pro-year', balance_after: 0 }
            },
            {
              url: '/api/giftcards/redeem',
              method: 'POST',
              status: 409,
              headers: { 'Content-Type': 'application/json' },
              body: { license: 'pro-year', request_id: 'req_02' },
              response: { ok: false, error: 'insufficient_balance', balance: 0 }
            }
          ]
        }
      },

      /* ─────────────────── 7.7 — Business Logic Abuse ───────────────────── */
      {
        id: 'lesson-7-7',
        trackId: 'track-7',
        number: '7.7',
        title: 'Business Logic Abuse',
        tagline: 'The request was perfectly valid. The price was simply untrue — and the server believed it anyway.',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        mentalModelConcept:
          'Business logic bugs have perfect syntax and wrong truth: the client sends a well-formed value the server should have known itself, and the server trusts the letter over its own source of truth.',
        discoveryPrompt:
          'DevGear\'s checkout form carries the unit price in a hidden field. In the lab below, tamper `unit_price` down to 1.00, submit the order, and watch what the simulated payment gateway bills you — the catalog says the keyboard costs 120.00.',
        discoveryComponent: 'FormBypassDemo',
        noticeThisMoments: [
          'Notice that nothing about the tampered request is malformed: correct types, valid session, sane quantity. No scanner rule in the world flags it — only your understanding of what the price *should* be.',
          'Notice the client-side quantity cap (`min=1 max=5`): a UI constraint is a suggestion. Ask what the server does with quantity `-1` or `100000`.',
          'Notice the server receipt echoing `billed_unit_price: 1.00`: the money path used the client\'s number instead of re-reading the catalog — that is the whole vulnerability.'
        ],
        explanationMarkdown: `
### The Mental Model: The Expense Form That Filled Itself Out

A perfectly formatted expense claim can still be fiction. If the accounting system only checks that the *form* is well formed — fields present, numbers are numbers — it will happily reimburse a taxi ride priced at four thousand dollars.

Scanners are that accounting system. They verify **well-formedness**: is the input a valid string, a valid enum, a valid ID? They cannot verify **truth**: was 1.00 ever the real price? Only a human who understands the business flow can spot the difference — which is why logic bugs are the highest-paying class in bug bounty that no tool will ever find for you.

### The Usual Suspects

1. **Price / quantity tampering** — hidden or client-computed prices, negative quantities that turn a purchase into a refund, discount codes stacked past their intent.
2. **Workflow skipping** — calling "ship" before "pay", reusing a coupon after a refund, jumping to step 4 of a wizard via a direct URL.
3. **Limit and quota tampering** — a \`max_seats\` or \`plan_tier\` field read from the request instead of the subscription record.

\`\`\`
POST /api/orders
{"sku":"KB-RGB-PRO","unit_price":1.00,"quantity":1}
-> 200 {"totalCharged":"1.00","price_source":"client_payload"}
     catalog price was 120.00
\`\`\`

### Why These Reports Pay Well

There is no CVE, no exotic payload, and nothing to "exploit" in the classical sense — and yet it is direct, provable revenue loss at any scale. A single tampered number is often worth more to a program than a stored XSS.

> **The Habit to Build:** For every field the client sends, ask one question: "could the server have known this itself?" If yes, ignore the client's copy and re-read the source of truth — and file the report against whoever didn't.
        `,
        devTakeaway:
          'Never accept money-relevant values (price, tier, quota, discount, ownership) from the client. Recompute them server-side from your own catalog and subscription records on every state change.',
        securityTakeaway:
          'Well-formed is not true. Hunt the fields the server trusts but should already know — then test the negative, zero, huge, and stacked variants that no scanner models.',
        challenge: {
          id: 'chal-7-7',
          type: 'tamper',
          prompt:
            'In the checkout lab, set the hidden `unit_price` to 1.00 and submit the order. Type the total the server charged you (for example: 1.00).',
          targetHint: 'Use the "Set to $1.00" shortcut or edit the hidden field, then Submit Order. Read the total on the server receipt.',
          solution: (input: string) => {
            const match = String(input ?? '')
              .replace(/[$,\s]/g, '')
              .match(/-?\d+(\.\d+)?/);
            if (!match) return false;
            return Math.abs(Math.abs(parseFloat(match[0])) - 1) < 0.005;
          },
          successMessage:
            'The gateway billed 1.00 for a 120.00 keyboard because it multiplied YOUR number. Client-side prices are wishes; the catalog is the truth.',
          explanation:
            'Logic abuse needs no exploit string — just a value the server should never have trusted. That is also why it pays: direct money loss, no tooling, pure intuition.'
        },
        simulatedTarget: {
          appName: 'DevGear Checkout',
          targetUrl: 'https://devgear.example.com/checkout',
          description: 'A checkout page that ships the unit price to the server inside a hidden form field.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100 max-w-md">
  <h3 class="font-bold">Mechanical Keyboard - RGB Pro</h3>
  <form action="/api/orders" method="POST" class="mt-3 space-y-2">
    <input type="hidden" name="sku" value="KB-RGB-PRO" />
    <input type="hidden" name="unit_price" value="120.00" />
    <input type="number" name="quantity" value="1" min="1" max="5" class="bg-slate-950 border border-slate-700 rounded p-1.5 text-xs w-24" />
    <button class="px-3 py-1.5 bg-emerald-600 rounded text-xs font-bold">Submit Order</button>
  </form>
</div>`,
          storageItems: [{ key: 'cart_id', value: 'cart_7712', type: 'localStorage' }],
          networkRequests: [
            {
              url: '/api/catalog/KB-RGB-PRO',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { sku: 'KB-RGB-PRO', price: 120.0, currency: 'USD' }
            },
            {
              url: '/api/orders',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: { sku: 'KB-RGB-PRO', unit_price: 1.0, quantity: 1 },
              response: {
                order: 'ORD-52219',
                billed_unit_price: 1.0,
                catalog_price: 120.0,
                total_charged: 1.0,
                price_source: 'client_payload'
              }
            }
          ]
        }
      },

      /* ─────────────────────── 7.8 — Chaining for Impact ────────────────── */
      {
        id: 'lesson-7-8',
        trackId: 'track-7',
        number: '7.8',
        title: 'Chaining for Impact',
        tagline: 'Three P4s do not add up to a P1 by arithmetic. They add up to one by story.',
        estimatedMinutes: 11,
        difficulty: 'Advanced',
        mentalModelConcept:
          'Severity is a narrative: chaining individually-low findings removes each other\'s prerequisites (login, interaction, scale) until the combined story reaches the blast radius that CVSS and triage teams actually reward.',
        discoveryPrompt:
          'You filed three low findings against ExampleCo: user enumeration (P4), an authenticated IDOR on invoice metadata (P3), and a missing rate limit (P4). Now chain them: press the "Scenario: Unauthenticated Mass IDOR" preset in the CVSS lab to score the combined story — every prerequisite has just evaporated.',
        discoveryComponent: 'CvssCalculatorDemo',
        noticeThisMoments: [
          'Notice which single switch moves the score the most: Privileges Required going from Low to None. Removing a login requirement is the most powerful link in any chain.',
          'Notice that each finding alone is defensible as P3/P4 — the chain is what turns "a researcher can see invoices" into "the entire customer table can be downloaded by anyone, tonight".',
          'Notice that the business context (500,000 customers, GDPR, credit-card-adjacent billing data) is not in the CVSS number at all — programs pay for blast radius, not for the vector string.'
        ],
        explanationMarkdown: `
### The Mental Model: Severity Is a Story, Not a Score

Three separate minor traffic violations are fines. The same three, committed in one continuous chase through a school zone, are a news story. Severity compounds with narrative, not with addition.

A triage team reads your report asking one question: **what can actually be reached, by whom, at what scale?** Low findings are often fragments of a bigger picture that only you can assemble.

### Anatomy of a Chain

\`\`\`
finding A:  user enumeration on /api/v1/users      P4  (info)
finding B:  authenticated IDOR on /invoices/:id    P3  (login needed)
finding C:  no rate limit on /api/v1/invoices      P4  (slow to matter)

A + B + C = enumerate ids -> fetch invoices -> dump at speed
             NO login, NO throttle, 500,000 customers
             combined: P1 CRITICAL
\`\`\`

Each link removes the previous one's prerequisite: enumeration feeds IDs to the IDOR; the missing rate limit removes the only thing keeping the IDOR quiet.

### CVSS Is the Floor, Business Context Is the Ceiling

CVSS measures the technical chain — attack vector, privileges, interaction, impact. It does not know your customers count half a million, that the invoices carry home addresses, or that the same data triggers GDPR breach notification. That sentence belongs in your report's impact section, in plain business language.

### What Chaining Is Not

Chaining is not stapling unrelated P4s together and calling it Critical — triage teams see through that instantly, and it costs credibility. A real chain shows *causality*: finding A hands the attacker the input that finding B consumes, and finding C removes the brake on both. Every link must survive a hostile reading: "so what can an attacker actually do with this, end to end, tonight?"

> **The Habit to Build:** Write the chain into the report *title* ("Chained: unauthenticated mass invoice scrape via enumeration + IDOR + missing rate limit"), document both the individual findings and the combination, and let triage see the whole picture in the first paragraph.
        `,
        devTakeaway:
          'Defend in depth but assume links fall: rate-limit the enumeration surfaces, enforce ownership on every object fetch, and remember that three "minor" gaps in one flow are one critical gap.',
        securityTakeaway:
          'Always ask what your finding combines with. The multiplier is almost always "unauthenticated" plus "automated at scale" — chain your own low findings before an attacker chains them for you.',
        challenge: {
          id: 'chal-7-8',
          type: 'triage',
          prompt:
            'Press the "Scenario: Unauthenticated Mass IDOR" preset in the CVSS lab. The score card shows a P-tier label (like P3 or P1). Type the exact P-tier the chained scenario lands on.',
          targetHint: 'The preset sets Network / None / None / High / High — the worst possible combination. Read the tier label under the big score.',
          solution: 'P1',
          successMessage:
            'P1 — Critical. Unauthenticated, zero user interaction, high confidentiality AND integrity impact. The three original P3/P4 fragments became a headline the moment their prerequisites vanished.',
          explanation:
            'Chaining is how professionals convert observation into impact: remove prerequisites, multiply by scale, then describe the loss in business language.'
        },
        simulatedTarget: {
          appName: 'Finding Chain Board',
          targetUrl: 'https://bounty.exampleco.com/reports/chain',
          description: 'Three low-severity reports and the critical chain they compose.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100">
  <h3 class="font-bold">Chain Builder — ExampleCo</h3>
  <div class="mt-3 space-y-2 text-xs">
    <div class="p-2 bg-slate-950 border border-slate-800 rounded">#1142 User enumeration (P4)</div>
    <div class="p-2 bg-slate-950 border border-slate-800 rounded">#1143 Authenticated invoice IDOR (P3)</div>
    <div class="p-2 bg-slate-950 border border-slate-800 rounded">#1144 No rate limit on /invoices (P4)</div>
    <div class="p-2 bg-rose-950/40 border border-rose-800 rounded font-bold">CHAIN-21 Unauthenticated mass scrape (P1)</div>
  </div>
</div>`,
          storageItems: [],
          networkRequests: [
            {
              url: '/api/reports/1142',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { id: 1142, title: 'User enumeration on /api/v1/users', severity: 'P4' }
            },
            {
              url: '/api/reports/1143',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { id: 1143, title: 'Authenticated IDOR on /api/v1/invoices/:id', severity: 'P3' }
            },
            {
              url: '/api/reports/1144',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { id: 1144, title: 'No rate limit on /api/v1/invoices', severity: 'P4' }
            },
            {
              url: '/api/reports/chain-21',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                id: 'chain-21',
                title: 'Chained: unauthenticated mass invoice scrape',
                links: [1142, 1143, 1144],
                prerequisites_remaining: [],
                combined_severity: 'P1',
                cvss: 10.0,
                customers_exposed: 500000
              }
            }
          ]
        }
      },

      /* ───────────────────── 7.9 — Automation Without Wreckage ──────────── */
      {
        id: 'lesson-7-9',
        trackId: 'track-7',
        number: '7.9',
        title: 'Automation Without Wreckage',
        tagline: 'Your scanner just DDoS\'d the target, got the office IP banned, and turned a friendly program into a legal email.',
        estimatedMinutes: 11,
        difficulty: 'Advanced',
        mentalModelConcept:
          'Automation multiplies behavior — including bad behavior: polite, scope-bounded, rate-aware tooling preserves your access and your reputation, while reckless concurrency gets you throttled, blocked, and reported.',
        discoveryPrompt:
          'The AssetHarvester crawler is sweeping in-scope hosts. Open the Simulated DevTools Network tab and walk its request log: notice the pagination headers on the 200s, then select the 429 entry and read exactly what the API demands before you may continue.',
        discoveryComponent: 'NetworkInspectorDemo',
        noticeThisMoments: [
          'Notice the `X-RateLimit-Limit` / `X-RateLimit-Remaining` / `X-RateLimit-Reset` headers on the 200 responses: the API tells you your remaining budget on every single call — most hunters never read it.',
          'Notice the `Link` header with `rel="next"`: pagination is a chain the server hands you. Re-fetching page 1 in a loop is both rude and wrong.',
          'Notice the 429 carries `Retry-After: 30` and a 900s IP throttle note — and that the crawler\'s wandering request to an out-of-scope host came back 403 from the WAF. Scope-safe tooling is a configuration problem you control.'
        ],
        explanationMarkdown: `
### The Mental Model: The Intern With a Megaphone

Automation is a helpful intern who works a million times faster than you — including at making noise. Rate limits exist to protect the application from exactly that. Blow past them and the program does not see "keen researcher"; it sees an incident, and the incident response is your IP getting throttled, then blocked, then a polite-but-cold email from the program manager.

### Read the Traffic Lights

- **200 + \`X-RateLimit-*\`** — your budget. \`Remaining: 41\` of 60 per minute is an instruction, not decoration.
- **\`Link: <...page=2>; rel="next"\`** — the server hands you the next page. Follow the chain; do not regenerate URLs or re-sweep page 1.
- **429 + \`Retry-After\`** — you already pushed too hard. Wait the exact number of seconds given; retrying sooner converts a warning into a ban.
- **403 from a WAF** — often "you left the sandbox". Check scope before you check your payload.

\`\`\`
HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
{"error":"rate_limit_exceeded","note":"client IP throttled, ban expires in 900s"}
\`\`\`

### The Scope-Safe Tooling Checklist

1. Target list generated from the written scope — nothing hand-added later.
2. Concurrency 1–2, randomized delays, and a global requests-per-minute ceiling.
3. A kill switch: any streak of 429/503 pauses the run automatically.
4. An allowlist of hosts inside the tool itself, so a misconfigured scan cannot wander.

> **The Habit to Build:** Automate the *analysis* — parsing responses, diffing pages, spotting anomalies — and keep the request rate human. The fastest way to lose program access is to look like a denial-of-service with better documentation.
        `,
        devTakeaway:
          'Serve rate-limit headers on every endpoint, paginate with stable cursors and `Link` headers, and give testers a documented sandbox: your abuse protection is also your incident response.',
        securityTakeaway:
          'Automation is part of your attack surface behavior: honor Retry-After, respect pagination, keep concurrency low and hosts allowlisted — a banned IP cannot demonstrate impact, and a hostile-looking scan ends the conversation.',
        challenge: {
          id: 'chal-7-9',
          type: 'inspect',
          prompt:
            'Select the 429 Too Many Requests entry in the Network tab. Type the exact response header that tells your crawler how many seconds to wait before retrying.',
          targetHint: 'It is a standard response header listed under "Response Headers" on the 429 entry — the one naming a duration in seconds.',
          solution: 'Retry-After',
          successMessage:
            '`Retry-After: 30` — the API literally told the crawler when to come back. Polite tooling reads it, waits, and keeps its access; rude tooling ignores it and earns a 900-second ban.',
          explanation:
            'Automation survives on the same currency as reports: professionalism. Read the headers the server sends you, and your tools become invisible instead of infamous.'
        },
        simulatedTarget: {
          appName: 'AssetHarvester — Bounty Crawler',
          targetUrl: 'https://crawler.example.com/runs/new',
          description: 'A recon crawler sweeping in-scope assets — watch how the API throttles it and what the headers say.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100 max-w-lg">
  <h3 class="font-bold">New Crawl Run</h3>
  <p class="text-xs text-slate-400 mt-1">Allowlist: *.example.com, api.example.com (auto-filled from program scope)</p>
  <div class="mt-3 flex items-center space-x-2 text-xs">
    <span class="px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">concurrency: 2</span>
    <span class="px-2 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">delay: 1200ms</span>
    <button class="px-3 py-1.5 bg-cyan-600 rounded text-xs font-bold">Start Crawl</button>
  </div>
</div>`,
          storageItems: [
            { key: 'crawler_token', value: 'cr_5f11a9', type: 'localStorage' },
            { key: 'scope_allowlist', value: '*.example.com,api.example.com', type: 'localStorage' }
          ],
          networkRequests: [
            {
              url: 'https://assets.example.com/api/v1/assets?page=1&limit=100',
              method: 'GET',
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'X-RateLimit-Limit': '60',
                'X-RateLimit-Remaining': '41',
                'X-RateLimit-Reset': '1792419600',
                'Link': '<https://assets.example.com/api/v1/assets?page=2&limit=100>; rel="next"'
              },
              response: { page: 1, limit: 100, total: 4812, assets: [{ id: 1, host: 'app.example.com' }, { id: 2, host: 'api.example.com' }] }
            },
            {
              url: 'https://assets.example.com/api/v1/assets?page=2&limit=100',
              method: 'GET',
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'X-RateLimit-Limit': '60',
                'X-RateLimit-Remaining': '40',
                'X-RateLimit-Reset': '1792419600',
                'Link': '<https://assets.example.com/api/v1/assets?page=3&limit=100>; rel="next"'
              },
              response: { page: 2, limit: 100, total: 4812, assets: [{ id: 101, host: 'auth.example.com' }] }
            },
            {
              url: 'https://assets.example.com/api/v1/assets?page=3&limit=100',
              method: 'GET',
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'Retry-After': '30',
                'X-RateLimit-Limit': '60',
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': '1792419600'
              },
              response: {
                error: 'rate_limit_exceeded',
                message: '60 requests/min reached; client IP throttled',
                retry_after_seconds: 30,
                ban_expires_in_seconds: 900
              }
            },
            {
              url: 'https://partners.example.net/api/partner-assets',
              method: 'GET',
              status: 403,
              headers: { 'Content-Type': 'application/json', 'X-WAF': 'blocked-out-of-scope' },
              response: { error: 'forbidden', note: 'host not present in program scope allowlist' }
            }
          ]
        }
      },

      /* ───────────────────── 7.10 — The Human Side ──────────────────────── */
      {
        id: 'lesson-7-10',
        trackId: 'track-7',
        number: '7.10',
        title: 'The Human Side of Disclosure',
        tagline: 'Duplicates, rejections, and polite emails are not obstacles to the craft — they ARE the craft.',
        estimatedMinutes: 12,
        difficulty: 'Advanced',
        mentalModelConcept:
          'Triage is a relationship, not a courtroom: reputation compounds over years, so handling duplicates and rejections with grace is as career-critical as finding the bug in the first place.',
        discoveryPrompt:
          'File your flagship report in the Report Studio below — the triage simulator grades clarity, reproducibility, and impact, and your report enters your portfolio (+150 XP). Then study the three hard messages every hunter eventually receives, and how professionals answer them.',
        discoveryComponent: 'ReportStudioDemo',
        noticeThisMoments: [
          'Notice how the studio forces structure — title, asset, steps, impact, fix — because that is the exact shape triage teams read first when queue depth is 200 reports deep.',
          'Notice the comment thread in DevTools: triage asks "does this require a paid tier?" — a real report is a conversation, and fast, factual answers move your report up the queue.',
          'Notice that a duplicate verdict rewards nothing but costs nothing: the finding stands, the timeline is noted, and your hit rate is measured over years, not weeks.'
        ],
        explanationMarkdown: `
### The Mental Model: A Relationship, Not a Courtroom

Two hunters find the same leaking endpoint on the same Tuesday. The first report wins the bounty; the second gets "duplicate". That verdict is not a judgment on your skill — it is arithmetic on arrival time, and it happens to *everyone*, including the top earners. Ask politely for the original timeline, note what your approach missed, and move on.

Your name is a 10-year asset. Programs remember researchers who write clean reports, answer questions within a day, disclose politely, and disappear gracefully after patching — and they reward them with faster triage, higher signal scores, and private program invites.

### The Three Hard Messages

1. **Duplicate** — never argue. Thank them, ask if the original report's severity/date can be shared, and keep hunting. Some programs pay partial duplicates; none pay sore losers.
2. **Informative / NAB (not a bug)** — re-read the scope and the intended behavior. If you are wrong, say thanks and learn; if you are right, add one precise proof — a single clean PoC beats three paragraphs of insistence.
3. **Rejected** — verify their claim once, respond once with facts, and stop. Public tantrums and disclosure threats burn exactly one bridge each, permanently.

### The Long Game

- Give reasonable remediation windows (90 days is typical) and coordinate disclosure instead of announcing it.
- Minimize data access in proofs: show you *can* read one record, not that you exported the database.
- Report platform bugs (the bounty platform itself) with the same care as product bugs.

\`\`\`
re: [example.com] IDOR on /api/invoices - duplicate of #48213
hi - thanks for the fast turnaround. could you share the
original submission date? my chain also adds unauthenticated
mass enumeration; happy to merge the details if useful.
\`\`\`

> **The Habit to Build:** Write every message to triage as if it will be read by the engineer who fixes the bug — because it will. Clarity, gratitude, and facts are the entire personality of a professional hunter.
        `,
        devTakeaway:
          'Treat inbound reports as free expert QA: acknowledge fast, ask precise questions, share timelines, and credit researchers in release notes. Programs with good reputations attract better hunters — it compounds.',
        securityTakeaway:
          'Reputation is exploit capital: handle duplicates without ego, prove impact without overstepping (one record, not the whole table), and keep disclosure coordinated — the human layer decides whether your technical work ever ships a fix.',
        challenge: {
          id: 'chal-7-10',
          type: 'triage',
          prompt:
            'File your report in the Report Studio (it grades and files it into your portfolio), or write it directly in the box below. Include three things: reproduction steps, the business impact, and a suggested fix.',
          targetHint: 'The studio\'s pre-filled draft already contains all three — submit it, or describe your own finding with steps, impact, and a fix.',
          solution: (input: string) => {
            const text = String(input ?? '').toLowerCase();
            const hasSteps =
              /(steps?|reproduc)/.test(text) &&
              /(1\.|1\)|first|log in|navigate|request|send|open|click|then)/.test(text);
            const hasImpact =
              /(impact|expose|leak|unauthor|any (registered )?user|cross-tenant|other tenant|customer|financial|takeover|mass|scrap)/.test(
                text
              );
            const hasFix = /(fix|remediat|patch|add|enforce|validat|server-?side|lock|should|rotate|expire)/.test(text);
            return hasSteps && hasImpact && hasFix;
          },
          successMessage:
            'Triage approved — steps a junior engineer can follow, impact stated in business terms, and a fix that names the missing check. That report gets patched. That career gets invited back.',
          explanation:
            'The report is the deliverable. Reproducible steps buy trust, business impact buys priority, and a suggested fix buys goodwill — the three currencies of a professional hunter.'
        },
        simulatedTarget: {
          appName: 'Disclosure Submission Portal',
          targetUrl: 'https://bounty.exampleco.com/reports/new',
          description: 'Where the polished report goes after the studio — and where triage talks back.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100 max-w-lg">
  <h3 class="font-bold">Submit Report — ExampleCo VDP</h3>
  <p class="text-xs text-slate-400 mt-1">Required: title, asset, severity, steps to reproduce, impact, remediation.</p>
  <div class="mt-3 space-y-2 text-xs text-slate-300">
    <div class="p-2 bg-slate-950 border border-slate-800 rounded">SLA: first response within 72 hours</div>
    <div class="p-2 bg-slate-950 border border-slate-800 rounded">Disclosure: coordinated, 90-day window</div>
  </div>
</div>`,
          storageItems: [{ key: 'draft_report_id', value: 'draft_2041', type: 'localStorage' }],
          networkRequests: [
            {
              url: '/api/reports',
              method: 'POST',
              status: 201,
              headers: { 'Content-Type': 'application/json' },
              body: {
                title: 'IDOR on /api/v1/invoices/:id allows cross-tenant billing access',
                severity: 'High',
                steps_count: 4
              },
              response: { id: 'RPT-2041', status: 'submitted', triage_sla_hours: 72, duplicate_check: 'clear' }
            },
            {
              url: '/api/reports/RPT-2041/comments',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                comments: [
                  {
                    author: 'triage_maria',
                    age_hours: 5,
                    body: 'Thanks — reproducing now. One question: does this require a paid tier, or is a free account enough?'
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
];
