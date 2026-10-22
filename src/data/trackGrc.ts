import { Track } from '../types';

/**
 * GRC Path track (id: track-5, lessons 5.1–5.10).
 *
 * "The Governance Layer" — translating security engineering into the
 * language of the business: risk, frameworks, evidence, and policy.
 *
 * Integration note: lessons 5.3 and 5.8 reference the new widgets
 * `RiskRegisterDemo` and `ControlGapAuditDemo`, which need `case` entries
 * in LessonViewer's renderDiscoveryWidget() switch. Lessons 5.2, 5.4, 5.7,
 * 5.9 and 5.10 are DevTools-driven (no widget by design) and are solved
 * through the Simulated DevTools panel + the Phase-3 text box.
 */
export const GRC_TRACKS: Track[] = [
  {
    id: 'track-5',
    number: 5,
    title: 'The Governance Layer',
    shortDescription: 'Risk, frameworks, audits, and policy — the language that connects security to the business.',
    philosophyBadge: 'GRC Path',
    iconName: 'Scale',
    colorAccent: 'amber',
    lessons: [
      /* ─────────────────────────── 5.1 ─────────────────────────── */
      {
        id: 'lesson-5-1',
        trackId: 'track-5',
        number: '5.1',
        title: 'Why GRC Exists',
        tagline: 'Your engineering report says "CVSS 9.8". The board hears nothing. GRC is the translation layer.',
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        mentalModelConcept:
          'Security is funded, prioritized, and governed as business risk — not as technical severity. GRC exists to convert technical exposure into the language decision-makers already spend: money, liability, and likelihood.',
        discoveryPrompt:
          'Two bugs sit in the triage queue: a self-XSS in a profile bio, and an unauthenticated IDOR that exports the entire customer database. Run both through the severity matrix below (try the preset scenarios). Watch how fast the "business story" changes even though both are "bugs in a web app".',
        discoveryComponent: 'CvssCalculatorDemo',
        noticeThisMoments: [
          'Notice that the same underlying flaw (an insecure direct object reference) swings from P4/Low to P1/Critical purely on WHAT it exposes and WHO can trigger it — severity is a business property, not a technical one.',
          'Notice how the CIA triad maps to money: leaked contracts become lawsuits, tampered invoices become refunds and fraud losses, downtime becomes lost revenue per minute.',
          'Notice that no board in history has approved a budget after reading a CVSS vector string — but "$4.2M in potential GDPR exposure" gets a decision in one meeting.'
        ],
        explanationMarkdown: `
### The Mental Model: The Mechanic and the Fleet Manager

Imagine you manage a taxi fleet, and a mechanic hands you a report that says: *"Front-left wheel bearing has 0.3mm of lateral play, exceeding the OEM tolerance of 0.2mm."* You nod politely and change nothing.

Now the same mechanic says: *"Two of these vans will likely strand passengers on the highway next month. Each incident costs us roughly $4,000 in refunds, roadside fees, and lost contracts."* You schedule the repair that afternoon.

**Nothing technical changed. Only the unit of measurement.** GRC — Governance, Risk, and Compliance — is the discipline of doing that translation on purpose, repeatably, and at organizational scale.

### Who Actually Reads Security Output

Different audiences consume security information in different currencies:

- The **security engineer** reads CVSS vectors, payload traces, and log lines.
- The **CISO** reads risk registers, control gaps, and program budgets.
- The **board and regulators** read exposure: dollars, liability, likelihood, and reputation.

Most failures of *influence* happen one layer up: a report written for the first audience is forwarded unchanged to the second and third, which file it under "technical noise".

### The CIA Triad Is a Business Statement

The confidentiality/integrity/availability triad sounds academic until you cash it out:

\`\`\`text
Confidentiality breach -> customer PII leaked  -> GDPR fines + breach lawsuits
Integrity breach       -> invoice data altered -> refunds, disputes, fraud loss
Availability breach    -> checkout offline 6h  -> lost revenue + SLA penalties
\`\`\`

> **The Habit to Build:** Before you file any security report, finish this sentence for a non-technical reader: *"If this is exploited, the business loses ___ because ___."* If you cannot fill in the blanks, you have not found the risk yet — you have found a fact.
        `,
        devTakeaway:
          'Frame every finding with a blast radius and a business consequence. "Unauthenticated export of 500k customer records" gets funded; "missing object-level authorization on /export" gets a backlog ticket.',
        securityTakeaway:
          'When someone reports a severity without a business impact, push for the dollar-and-liability story — and when leadership dismisses a P1, ask which number they doubt: the likelihood or the impact.',
        challenge: {
          id: 'chal-5-1',
          type: 'inspect',
          prompt:
            'Apply the "Scenario: Unauthenticated Mass IDOR" preset in the severity matrix above. It leaks the email and phone records of 500,000 customers with no login required. Type the priority tier the matrix assigns to this scenario (for example, P4).',
          targetHint:
            'Click the "Scenario: Unauthenticated Mass IDOR" preset button and read the tier badge on the calculated rating card.',
          solution: 'P1',
          successMessage:
            'Correct — P1/Critical. A mass, unauthenticated leak of customer PII is exactly the scenario that turns a technical bug into a board-level, multi-million-dollar conversation.',
          explanation:
            'Priority tiers are business statements: P1 means "drop everything, this can end the company quarter." The technical CVSS inputs are just the evidence behind that judgment — translate them, and the budget conversation finally happens.'
        },
        simulatedTarget: {
          appName: 'Nexus Quarterly Risk Briefing',
          targetUrl: 'https://board.nexuscorp.example/q4/risk',
          description: 'Executive slide builder fed by the security triage queue.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-100">
  <h2 class="text-xl font-bold mb-2">Q4 Security Findings — Top Open Items</h2>
  <p class="text-xs text-slate-400">Slides are generated from live triage data. Business owners: review before Thursday.</p>
  <div class="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-xs">
    Slide 2 renders from GET /api/findings/triage/top
  </div>
</div>`,
          storageItems: [{ key: 'deck_mode', value: 'presenter', type: 'localStorage' }],
          networkRequests: [
            {
              url: '/api/findings/triage/top',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                findings: [
                  { id: 'F-221', title: 'IDOR on /api/invoices', cvss: 8.8, tier: 'P2', exposure_usd: 40000 },
                  {
                    id: 'F-230',
                    title: 'Unauthenticated customer export endpoint',
                    cvss: 9.8,
                    tier: 'P1',
                    exposure_usd: 4200000
                  }
                ]
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 5.2 ─────────────────────────── */
      {
        id: 'lesson-5-2',
        trackId: 'track-5',
        number: '5.2',
        title: 'The Framework Zoo',
        tagline: 'ISO 27001, NIST CSF, SOC 2, PCI DSS — four different products sold in one aisle. Only one is actually a certificate.',
        estimatedMinutes: 10,
        difficulty: 'Beginner',
        mentalModelConcept:
          'Frameworks are not interchangeable: ISO 27001 is a certifiable standard, SOC 2 is an attestation report written by an auditor, NIST CSF is a voluntary shared vocabulary, and PCI DSS is a contract you cannot opt out of if you touch card data.',
        discoveryPrompt:
          'CloudPay just sent your procurement team a trust-page link claiming "ISO 27001 Certified • SOC 2 Type II • PCI DSS Level 1". Open the simulated page in DevTools and read the fine print the marketing team buried in the source. Which claim does the evidence actually support?',
        discoveryComponent: 'DevToolsInspection',
        noticeThisMoments: [
          'Notice how the headline says "SOC 2 Type II" while the audit firm metadata in the HTML comment says Type I — Type I audits the DESIGN of controls at a point in time; Type II tests whether they OPERATED over 6-12 months.',
          'Notice the ISO 27001 certificate scope field: a certificate covers an organization scope, and "London Sales Office" does not cover the production platform you are buying.',
          'Notice how the PCI DSS "Level 1" badge quietly points at the payment processor — under shared responsibility, this vendor may handle almost no card data themselves.'
        ],
        explanationMarkdown: `
### The Mental Model: Four Different Stores in One Aisle

People say "we're ISO" the way they say "we're insured" — as one vague comfort. But these frameworks are four different *products*:

- **ISO 27001** — a certifiable management-system standard. An accredited auditor issues a certificate with an *expiry date* and a *scope statement*.
- **SOC 2** — an *attestation report* written by a CPA firm about a service organization's controls over a period. Type I = design at a point in time. Type II = operating effectiveness across months.
- **NIST CSF 2.0** — a voluntary framework and shared vocabulary (Govern, Identify, Protect, Detect, Respond, Recover). **There is no such thing as a NIST CSF certificate.** Maturity is self-assessed.
- **PCI DSS** — a contractual obligation enforced by the card brands. If you store, process, or transmit cardholder data, you cannot opt out by choosing a different philosophy.

### The Buyer's Cheat Sheet

Ask "prove it" and see what actually arrives:

\`\`\`text
ISO 27001 -> a certificate, with an expiry date and a SCOPE statement
SOC 2     -> a 100+ page report; check TYPE (I vs II) and the PERIOD covered
NIST CSF  -> a maturity self-assessment; levels are opinions, not audits
PCI DSS   -> an Attestation of Compliance; check WHOSE AoC it actually is
\`\`\`

### Why the Distinction Is Money

A vendor who "has SOC 2" but produces only a Type I report has proven their controls were *designed* — not that they ever *worked*. During an incident, "designed but unproven" is precisely the comfort that evaporates. Procurement decisions worth millions routinely turn on one Roman numeral.

> **The Habit to Build:** When a vendor or employer brags about a framework, ask three questions: *Which one? What scope or period? Who assessed it?* Vague claims dissolve instantly under those three questions.
        `,
        devTakeaway:
          'Treat frameworks as evidence schedules: pick one primary framework, map your real controls to its requirements, and keep the artifacts (policies, logs, dated reviews) it expects. Frameworks are logistics, not vibes.',
        securityTakeaway:
          'Certification badges are marketing graphics. Trust only the underlying artifact: the certificate scope, the report type and period, the AoC entity. Logos never expire — certificates do.',
        challenge: {
          id: 'chal-5-2',
          type: 'inspect',
          prompt:
            'The CloudPay trust page headline claims "SOC 2 Type II". In the simulated page source, the audit firm\'s report metadata tells a different story. Type the report type exactly as the source states it (for example, "Type 2").',
          targetHint:
            'Open the Elements tab and search the source for the comment block near the footer: SOC2_REPORT: ...',
          solution: (input: string) => /type\s*i(?!i)/i.test(String(input)) || /type\s*1\b/i.test(String(input)),
          successMessage:
            'Exactly — Type I. CloudPay proved its controls were designed on audit day; nobody proved they operated. Type II is the one that required months of evidence.',
          explanation:
            'Report types are not marketing details. A Type I is a snapshot of intent; a Type II is a movie of operation. The gap between them is where "we are SOC 2" quietly means less than the buyer thinks.'
        },
        simulatedTarget: {
          appName: 'CloudPay Trust Center',
          targetUrl: 'https://trust.cloudpay.io/compliance',
          description: 'Vendor trust page marketing three framework claims to enterprise buyers.',
          htmlSource: `<!DOCTYPE html>
<html>
  <head><title>CloudPay — Trust Center</title></head>
  <body class="bg-slate-900 text-slate-100 p-6 font-sans">
    <h1 class="text-2xl font-bold">CloudPay Compliance</h1>
    <div class="mt-4 flex gap-2 text-xs">
      <span class="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded">ISO 27001 Certified</span>
      <span class="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded">SOC 2 Type II</span>
      <span class="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded">PCI DSS Level 1</span>
    </div>
    <!-- SOC2_REPORT: Type I (design-only, point-in-time 2026-01-15). Type II NOT performed. firm: Alderman & Pike LLP -->
    <!-- ISO27001_SCOPE: "CloudPay Ltd - London Sales Office" only. cert 2024-ISO-8871, expires 2027-02-01. Platform NOT in scope. -->
    <div class="hidden">
      <input type="hidden" name="pci_scope" value="shared - card data handled by processor; CloudPay stores last4 only" />
    </div>
    <p class="text-[10px] text-slate-500 mt-6">Report copies available under NDA via procurement.</p>
  </body>
</html>`,
          storageItems: [
            { key: 'trust_page_variant', value: 'enterprise-buyer', type: 'localStorage' },
            { key: 'buyer_session', value: 'proc_review_4471', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/trust/claims',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                iso_27001: { certificate: '2024-ISO-8871', scope: 'London Sales Office', expires: '2027-02-01' },
                soc_2: { type: 'I', performed_by: 'Alderman & Pike LLP', period: 'point-in-time 2026-01-15' },
                pci_dss: { level: '1', aoc_entity: 'Stripe (processor)', cloudpay_scope: 'last4 only' }
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 5.3 ─────────────────────────── */
      {
        id: 'lesson-5-3',
        trackId: 'track-5',
        number: '5.3',
        title: 'Risk Registers & Scoring',
        tagline: 'Risk = Likelihood x Impact. The multiplication is the easy part; the arguments about the inputs are the actual job.',
        estimatedMinutes: 11,
        difficulty: 'Beginner',
        mentalModelConcept:
          'A risk register turns vague worry into comparable numbers: score inherent risk (before controls), choose a treatment, then record the residual risk someone has formally accepted.',
        discoveryPrompt:
          'You are handed four real scenarios and asked to "assess the risk". Score each row: pick a Likelihood (1-5) and an Impact (1-5) that fit the scenario card, then apply a treatment control to watch the residual score move. Submit the register and compare your judgments with the reference assessment.',
        discoveryComponent: 'RiskRegisterDemo',
        noticeThisMoments: [
          'Notice that Inherent risk is scored as if the control does not exist — scoring the "after" world and calling it "before" is the most common fudge in every real register.',
          'Notice that controls usually change HOW LIKELY trouble is, not HOW BAD it is: MFA drops likelihood from 4 to 1, but the impact of a database leak stays a 5. Encryption does not shrink your customer list.',
          'Notice the treatment options are a closed set: accept, reduce, transfer, avoid. "Ignore" is not in the set — it is "accept" without a signature.'
        ],
        explanationMarkdown: `
### The Mental Model: The Weather Station

A risk register is a weather station. It does not stop the hurricane; it measures it early enough to act. A good register makes risks *comparable*, so that a $2M remediation budget can be argued about with numbers instead of volume.

### The Two-Stage Score

Every entry gets scored twice:

- **Inherent risk** — the score *before* the control, as if the control does not exist. This is what justifies the control's budget.
- **Residual risk** — the score *after* the control. This is what the business formally accepts.

\`\`\`text
score = likelihood (1-5) x impact (1-5)      # range 1..25

inherent:  admin panel on the open internet, no MFA  = 4 x 5 = 20
control:   move the panel behind the VPN, enforce MFA
residual:  reachable only by staff on managed devices = 1 x 5 = 5
\`\`\`

Notice the impact stayed 5. Most controls reduce likelihood; only structural changes (don't collect the data, don't run the service) reduce impact.

### The Four Treatments

There are exactly four ways to treat a risk, and every entry on a healthy register carries one plus a named owner:

- **Reduce** — implement a control (the MFA example above).
- **Transfer** — shift the financial consequence (cyber insurance, contractual penalties).
- **Avoid** — stop doing the risky thing (kill the feature, don't collect the data).
- **Accept** — knowingly tolerate it, with a signature and an expiry date, usually because the residual score times the cost of reduction is a bad trade.

> **The Habit to Build:** Never present a risk without its treatment and its owner. "We found 40 risks" is weather; "here are the 6 risks nobody has accepted yet, with their owners" is governance.
        `,
        devTakeaway:
          'Log decisions, not just findings. A closed ticket says "fixed"; a register entry says who accepted what, on what date, until when — that record is what survives staff turnover and audits.',
        securityTakeaway:
          'When someone hands you a register where every inherent score looks suspiciously low, they probably scored the post-control world twice. Re-score it bare and watch the priorities rearrange themselves.',
        challenge: {
          id: 'chal-5-3',
          type: 'triage',
          prompt:
            'The register is only half the artifact: every scored row still needs a formal treatment decision. Type the four risk treatment options as a comma-separated list (the four verbs are named in the lesson).',
          targetHint: 'The four verbs that close a register line: accept, reduce, transfer, avoid.',
          solution: (input: string) => {
            const s = String(input ?? '').toLowerCase();
            return s.includes('accept') && s.includes('reduce') && s.includes('transfer') && s.includes('avoid');
          },
          successMessage:
            'All four treatments locked in: accept, reduce, transfer, avoid. A register line without one of these is an open worry, not a managed risk.',
          explanation:
            'The four options are exhaustive because each answers the only question a register exists to force: "so, what are we going to do about it?" — including the deliberate decision to do nothing, which must be signed and dated.'
        },
        simulatedTarget: {
          appName: 'Nexus GRC Register',
          targetUrl: 'https://grc.nexuscorp.example/register/q3',
          description: 'Enterprise risk register with the Q3 intake cycle open.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-100">
  <h2 class="text-lg font-bold">Risk Register — 2026 Q3</h2>
  <p class="text-xs text-slate-400 mt-1">27 open risks · 6 awaiting a treatment owner · next review 2026-10-15</p>
</div>`,
          storageItems: [{ key: 'register_period', value: '2026-Q3', type: 'localStorage' }],
          networkRequests: [
            {
              url: '/api/grc/register/summary',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                open_risks: 27,
                unaccepted: 6,
                top: { id: 'R-01', title: 'Customer DB admin panel exposed', inherent: 20, treatment: null }
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 5.4 ─────────────────────────── */
      {
        id: 'lesson-5-4',
        trackId: 'track-5',
        number: '5.4',
        title: 'Assets & Classification',
        tagline: 'You cannot protect what you have never met. Most "security programs" are actually guessing programs with good branding.',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        mentalModelConcept:
          'Asset inventory and data classification are the Identify function everything else stands on: you cannot pick controls, assign owners, or notify regulators about data you did not know you held.',
        discoveryPrompt:
          'Meridian Logistics ships a "Compliance Dashboard" claiming 100% of data stores are inventoried and classified. Open it in DevTools and hunt for the exception the dashboard forgot to mention — the data store that the discovery scan found but nobody classified.',
        discoveryComponent: 'DevToolsInspection',
        noticeThisMoments: [
          'Notice how the dashboard headline counts only stores with an owner assigned — unowned stores are excluded from the denominator, so "100%" is arithmetically true and organizationally false.',
          'Notice the discovery-scan network response listing a bucket with classification: null and owner: unassigned — the most dangerous asset in any company is the one nobody is responsible for.',
          'Notice the company\'s own classification legend in the page source: Public / Internal / Confidential / Restricted — with Restricted defined as "regulated PII or cardholder data", which is exactly what the unclassified bucket holds.'
        ],
        explanationMarkdown: `
### The Mental Model: The Warehouse With No Inventory

A retailer with 40,000 items and no inventory system does not have a shop; it has a rumble. Security programs fail the same way: firewalls and training pile up, but nobody can answer *"what are we protecting, where does it live, and who owns it?"*

### Classification: Rules With Teeth

Classification is not a labeling exercise; it is a routing system. Each tier pulls specific handling requirements:

- **Public** — marketing site copy. Integrity controls only.
- **Internal** — org charts, roadmaps. Access by employment.
- **Confidential** — contracts, financials. Need-to-know, encryption, logging.
- **Restricted** — cardholder data, health records, government IDs. The regulation shelf: PCI DSS, HIPAA, GDPR special categories.

\`\`\`text
finding: storage bucket "nexus-customer-exports-2026"
  contents: full-name, email, phone, shipping-address (4.1M rows)
  owner:           unassigned
  classification:  null
  -> per the company's own legend this is RESTRICTED data,
     sitting unowned, with no retention limit and no controls routed to it
\`\`\`

The label determines the controls; without it, the data inherits whatever controls drifted its way — often none.

### The Inventory Is a Living Process

Static inventories rot within a quarter. The modern answer is discovery automation: cloud APIs enumerate buckets, config scans flag public ACLs, and data-loss tooling tags PII at write time. Governance's job is to demand that the exceptions surface on the same dashboard as the victories — not in a separate spreadsheet nobody opens.

> **The Habit to Build:** When you see a compliance dashboard showing a perfect percentage, ask what the denominator excludes. The most dangerous asset in any company is the one with no owner — nothing fails there, because nothing is responsible for it.
        `,
        devTakeaway:
          'Automate asset discovery and require a classification tag at creation time — make "unclassified" an invalid state in your storage APIs, not a status someone fixes after the auditor asks.',
        securityTakeaway:
          'Attackers inventory your company for free (subdomains, bucket names, JS bundles). If your own register is thinner than their recon, the register is the vulnerability.',
        challenge: {
          id: 'chal-5-4',
          type: 'inspect',
          prompt:
            'Inspect the simulated compliance dashboard in DevTools. Find the unclassified data store in the discovery-scan response, note what it holds, then type the classification tier the company\'s own legend requires for that data (for example, "Internal").',
          targetHint:
            'Open the Network tab, inspect the /api/discovery/stores response, then match the bucket contents against the classification legend embedded in the page source.',
          solution: 'Restricted',
          successMessage:
            'Classified correctly — Restricted. 4.1M rows of names, emails, and addresses with no owner is exactly the "regulated PII" tier that pulls GDPR-scale handling requirements onto it.',
          explanation:
            'Data without a classification inherits no controls, no retention limit, and no notification duty. When — not if — that bucket leaks, the regulator will ask for the classification, and "null" is not a defense.'
        },
        simulatedTarget: {
          appName: 'Meridian Compliance Dashboard',
          targetUrl: 'https://grc.meridian-logistics.example/assets',
          description: 'Asset inventory dashboard claiming full classification coverage.',
          htmlSource: `<!DOCTYPE html>
<html>
  <head><title>Meridian GRC — Asset Inventory</title></head>
  <body class="bg-slate-900 text-slate-100 p-6 font-sans">
    <h1 class="text-xl font-bold">Data Store Inventory</h1>
    <p class="mt-2 text-3xl font-black text-emerald-400">100% inventoried &amp; classified (312/312)</p>
    <!-- denominator counts only stores WITH an owner; unassigned stores are hidden per SEC-889 -->
    <div class="hidden mt-4 text-xs" id="classification-legend">
      <h3>Classification Legend (policy GRC-004)</h3>
      <ul>
        <li>Public — intended for the world</li>
        <li>Internal — employees only</li>
        <li>Confidential — need-to-know; contracts, financials</li>
        <li>Restricted — regulated PII or cardholder data; the regulation shelf</li>
      </ul>
    </div>
    <script src="/api/discovery/stores"></script>
  </body>
</html>`,
          storageItems: [
            { key: 'grc_filter_scope', value: 'owned-stores', type: 'localStorage' },
            { key: 'last_scan', value: '2026-10-19T04:00Z', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/discovery/stores',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                scan_id: 'disc-2026-412',
                stores: [
                  { bucket: 'meridian-invoices-prod', owner: 'billing-team', classification: 'Confidential', rows: 8100000 },
                  { bucket: 'meridian-hr-docs', owner: 'people-team', classification: 'Restricted', rows: 62000 },
                  {
                    bucket: 'nexus-customer-exports-2026',
                    contents: 'full_name,email,phone,shipping_address',
                    rows: 4100000,
                    owner: 'unassigned',
                    classification: null,
                    public_acl: false,
                    created: '2026-03-02'
                  }
                ],
                unassigned_hidden_from_dashboard: true
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 5.5 ─────────────────────────── */
      {
        id: 'lesson-5-5',
        trackId: 'track-5',
        number: '5.5',
        title: 'Policy vs Standard vs Procedure',
        tagline: 'A policy nobody enforces is a wish. The checkout form below is your company\'s password policy in miniature.',
        estimatedMinutes: 9,
        difficulty: 'Intermediate',
        mentalModelConcept:
          'Policy states intent, standards state measurable requirements, procedures state steps — and none of them are controls until something technical enforces them. A rule that lives only on the client is policy theater.',
        discoveryPrompt:
          'Policies fail the same way this checkout form fails: the rule lives on the client, and nothing on the server ever checks it. In the lab below, tamper the hidden unit_price to 1.00 and submit — then notice the deeper lesson. The "price policy" was decorative because no enforcement point existed.',
        discoveryComponent: 'FormBypassDemo',
        noticeThisMoments: [
          'Notice that the price rule LOOKED enforced — a locked-looking UI, quantity limits, a disabled voucher button — and one hidden parameter defeated all of it, because enforcement lived only in the browser.',
          'Notice the three document layers: a POLICY says what and why ("customer data is Confidential"), a STANDARD says how much ("Confidential data encrypted with AES-256 at rest"), a PROCEDURE says who performs which steps (the quarterly key-rotation runbook).',
          'Notice that every audit finding phrased as "policy not enforced" really means: no technical control, no log, no evidence — the document was load-bearing only in the wiki.'
        ],
        explanationMarkdown: `
### The Mental Model: The Sign vs The Turnstile

A policy is a sign on the wall. A control is a turnstile. Organizations love signs because they are cheap: you write "All customer data must be encrypted," publish it to the wiki, and everyone nods. The auditor later discovers the turnstile was never installed.

The checkout lab is this failure in miniature. The form *declared* rules — a locked price, quantity limits, a disabled voucher button — and the moment one hidden parameter changed, the server accepted a $1.00 order. The "price policy" had zero enforcement points.

### The Three Document Layers

Healthy programs keep three distinct artifacts, and confusion between them is where theater hides:

1. **Policy** — executive intent. "All access to Confidential data requires MFA." Owner: leadership.
2. **Standard** — the measurable requirement that makes the policy testable. "MFA = FIDO2 or TOTP push; no SMS; enforced at the IdP for every group with Confidential access."
3. **Procedure** — the repeatable steps. "Quarterly access recertification: export group membership, owners sign off within 10 business days, evidence filed to the audit drive."

\`\`\`text
untestable:  "Employees must not share passwords"
                -> vibes; no test, no log, no finding-proof

testable:    "Shared vault accounts are forbidden; human logins
              require SSO + MFA (exception: break-glass, ticketed)"
                -> enforceable at the IdP, auditable from its logs
\`\`\`

### Enforcement Is the Only Proof

When an auditor asks "how do you know?", the only acceptable answers end in evidence: a config export, an access log, a signed review. "Because the policy says so" earns a finding faster than silence would.

> **The Habit to Build:** Read any internal policy and ask: *"Where is this enforced, and where is the log?"* If both answers are "nowhere," you have found a wish — and that is exactly what a compliance gap looks like.
        `,
        devTakeaway:
          'Enforce rules at the server or the IdP, and emit an audit event when they fire. If your rule cannot produce a log line, it cannot be audited — and in a compliance sense, it does not exist.',
        securityTakeaway:
          'When testing a client, treat every disabled button and hidden field as a claim, not a rule. The gap between the claim and the server check is your finding — and, quietly, your company\'s next audit finding too.',
        challenge: {
          id: 'chal-5-5',
          type: 'tamper',
          prompt:
            'Demonstrate enforcement-free policy in the checkout lab: set the hidden unit_price to 1.00 and submit the order. Then type the single word that describes a rule that exists on paper but is never technically enforced — "____ theater" (the term from the lesson).',
          targetHint: 'Use the "Set to $1.00" button on the hidden unit_price input, submit, then answer with the one-word term.',
          solution: (input: string) => /theat/i.test(String(input)),
          successMessage:
            'Exactly — theater. The price rule looked ironclad in the UI and had no enforcement point at all, which is precisely what "policy theater" means in a compliance program.',
          explanation:
            'Auditors call this "control implemented on paper." The fix is never a better document; it is an enforcement point — server check, IdP policy, firewall rule — that emits evidence every time it acts.'
        },
        simulatedTarget: {
          appName: 'DataMin Employee Portal',
          targetUrl: 'https://datamin.example/settings/password',
          description: 'Employee portal with a documented password standard the server does not enforce.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 max-w-md">
  <h2 class="font-bold text-lg">Change Your Password</h2>
  <p class="text-xs text-amber-300 mt-2">Policy GRC-011: minimum 12 characters, one symbol, rotated quarterly.</p>
  <form id="pw-form" class="mt-4 space-y-3">
    <input type="hidden" name="password_policy" value="enforced-client-side" />
    <input type="password" id="pw" class="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded" />
    <button type="submit" class="w-full bg-emerald-600 py-2 rounded font-semibold">Update Password</button>
  </form>
</div>`,
          storageItems: [{ key: 'policy_doc_version', value: 'GRC-011 v4.2', type: 'localStorage' }],
          networkRequests: [
            {
              url: '/api/auth/password',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: { username: 'jordan', password: 'abc', password_policy: 'enforced-client-side' },
              response: { ok: true, server_min_length: 4, mfa: 'optional', audit_log: 'not implemented' }
            }
          ]
        }
      },

      /* ─────────────────────────── 5.6 ─────────────────────────── */
      {
        id: 'lesson-5-6',
        trackId: 'track-5',
        number: '5.6',
        title: 'Identity Governance',
        tagline: 'The joiner/mover/leaver process is boring — until you realize nobody ever played "leaver" for the intern who left in 2023.',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        mentalModelConcept:
          'Identity governance is the lifecycle of access: joiner provisions, mover adjusts, leaver revokes — and periodic access reviews exist because every one of those steps eventually fails silently.',
        discoveryPrompt:
          'SaaS Pulse still trusts whatever account_tier the browser reports — no server-side authorization, no access review. Escalate your own account to superadmin in the storage panel. Now put on your auditor hat: which process failure let a client-side value act like an entitlement?',
        discoveryComponent: 'StorageTamperDemo',
        noticeThisMoments: [
          'Notice that the "entitlement" (account_tier) lives in the user\'s own browser — the digital equivalent of letting every employee write their own job title on their badge, forever.',
          'Notice there is no last_reviewed date anywhere near the role: access that is never recertified only ever grows, like a closet nobody ever cleans out.',
          'Notice the difference between authentication (the server knows who you are) and authorization (the server decides what you may do) — this app does the first and silently skips the second.'
        ],
        explanationMarkdown: `
### The Mental Model: The Keycard That Grades Itself

Imagine a building where HR issues keycards on day one — and then nobody ever deactivates them. Ex-employees' cards still open the server room; the intern who left in 2023 still opens the finance floor. This is not a movie plot; it appears in a majority of breach post-mortems under the polite name *"excessive privileges."*

### The Lifecycle: Joiner, Mover, Leaver

Access governance is built on three boring events done reliably:

- **Joiner** — day-one access matches the role, and nothing more. Least privilege starts at provisioning, not at review time.
- **Mover** — changing teams *removes* the old access before adding the new. Most insider incidents are mover failures: the engineer who moved to a harmless team kept the production database grants.
- **Leaver** — revocation is automated and same-day, ideally triggered by the HR termination event rather than by someone remembering.

### Why Access Reviews Exist

Even a perfect lifecycle drifts: vendors change scope, groups get merged, break-glass accounts multiply. So programs add a circuit breaker — **periodic access recertification**: every quarter (or before every audit), owners examine each entitlement and answer one question: *"does this person still need this?"* — with a signature and a date attached.

\`\`\`text
what an auditor wants to see for one entitlement:
  user:          jRivera@meridian.example
  role:          db-admin (grants: prod-customer-db read/write)
  approved_by:   sOkafor (data owner)
  approved_at:   2026-09-30
  last_reviewed: 2026-09-30   <- missing in most organizations
\`\`\`

The SaaS Pulse demo fails every test at once: the role is self-asserted by the client, no review record exists, and the server never re-checks authorization. In audit language that is a *pervasive* finding — not one bad setting, but a missing control family.

> **The Habit to Build:** For any role or tier you hold, ask: *"who approved this, when, and when is it next reviewed?"* If nobody can answer, you have found a governance gap worth reporting — technically, and politely.
        `,
        devTakeaway:
          'Store entitlements server-side, derive them from an authoritative source (your IdP), and emit an audit event on every grant, change, and revocation. The browser may display roles; it must never define them.',
        securityTakeaway:
          'Self-asserted role flags in cookies, storage, or trusted JWT claims are the client-side mirror of a missing access-review program. Escalate both as one finding: no defense in depth, and no evidence trail.',
        challenge: {
          id: 'chal-5-6',
          type: 'tamper',
          prompt:
            'Escalate your account_tier to superadmin in the storage panel to demonstrate the gap. Then type the name of the control process — two words, named in the lesson — that would have exposed this over-privileged, never-reviewed account.',
          targetHint:
            'Select the key "account_tier" and change its value to "superadmin". The process is the quarterly circuit breaker for entitlements.',
          solution: (input: string) => /access\s*(review|recertification)/i.test(String(input)),
          successMessage:
            'Right — the access review (recertification). A quarterly owner sign-off would have flagged a role that nobody approved and nothing has examined since the day it was created.',
          explanation:
            'Technical fixes stop today\'s exploit; access reviews stop the whole category. A register of entitlements with dated approvals is the evidence auditors actually accept — and the mechanism that catches the mover and leaver failures.'
        },
        simulatedTarget: {
          appName: 'SaaS Pulse Analytics',
          targetUrl: 'https://pulse.app/account',
          description: 'Account settings page with a client-declared entitlement and no review trail.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-100">
  <h2 class="font-bold text-lg">Your Account</h2>
  <p class="text-xs text-slate-400 mt-1">Plan features are provisioned from your account tier.</p>
  <div class="mt-3 p-3 bg-slate-950 border border-slate-800 rounded text-xs">
    Current tier: <span class="text-amber-300 font-mono">basic</span>
    <p class="text-[10px] text-slate-500 mt-1">No last_reviewed field is stored client-side or server-side.</p>
  </div>
</div>`,
          storageItems: [
            { key: 'account_tier', value: 'basic', type: 'localStorage' },
            { key: 'user_display_name', value: 'contractor_jordan', type: 'localStorage' }
          ],
          networkRequests: [
            {
              url: '/api/billing/upgrade',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: { account_tier: 'basic' },
              response: { granted: true, server_side_check: 'none — client-declared tier trusted', audit_event: null }
            }
          ]
        }
      },

      /* ─────────────────────────── 5.7 ─────────────────────────── */
      {
        id: 'lesson-5-7',
        trackId: 'track-5',
        number: '5.7',
        title: 'Vendor / Third-Party Risk',
        tagline: 'Your security posture now includes every SaaS tool your marketing team bought with a credit card.',
        estimatedMinutes: 11,
        difficulty: 'Intermediate',
        mentalModelConcept:
          'Third-party risk management is the same risk cycle applied to entities you do not control: due diligence before signing, contractual controls, then ongoing monitoring — because a vendor\'s day-one posture decays daily.',
        discoveryPrompt:
          'Meridian is onboarding "DataStream Analytics", which handles customer behavioral data. Its trust portal looks immaculate. Open the Network tab and inspect the certification records the portal itself fetches. What has the vendor quietly stopped mentioning since the sales call?',
        discoveryComponent: 'NetworkInspectorDemo',
        noticeThisMoments: [
          'Notice the certification record in the network response: iso_27001 shows status "expired" with an expiry date — trust portals display the logo forever; the API shows the truth.',
          'Notice the sub-processor list has grown since the questionnaire was signed: three new processors, one in a region the DPA\'s data-residency clause never covered.',
          'Notice that questionnaire answers are client-side claims — nothing automatically re-verifies them, which is exactly why "ongoing monitoring" exists as a discipline.'
        ],
        explanationMarkdown: `
### The Mental Model: Renting a Room in Your Security Perimeter

Every vendor integration is a pipe drilled through your firewall with somebody else's plumber on the other end. The recent breach record is heavily *fourth-party*: your SaaS provider gets breached, and your customer data leaves through a door you signed the lease for.

### The Third-Party Risk Cycle

1. **Due diligence** — before signature: security questionnaire (SIG, CAIQ, or the vendor's own trust center), independent report review (SOC 2 Type II, ISO certificate with scope), and a data-protection impact check.
2. **Contractual controls** — the Data Processing Agreement (who is processor, who is controller), breach-notification deadlines (72 hours is the market-standard clause), audit rights, and sub-processor consent.
3. **Ongoing monitoring** — because a day-one assessment has a shelf life: continuous rating services, annual re-assessment, and for critical vendors, re-collected evidence.

\`\`\`text
the decay curve nobody puts on the sales slide:

day 0    "We are ISO 27001 certified and SOC 2 Type II!"
day 400  certificate expired, report period ended,
         sub-processors grew from 4 to 9, and the signed
         questionnaire belongs to someone who left the company
\`\`\`

### Tiering Is the Whole Game

You cannot do deep diligence on 900 vendors, and you do not need to. Classify vendors by what they touch — **critical** (handles Restricted data or sits in an availability-critical path), **significant**, **low** — and match assessment depth to tier. Spend the deep review where the blast radius is.

> **The Habit to Build:** When onboarding any tool, ask four questions: *what data does it touch, who else can see it (sub-processors), what happens when it breaks, and what did independent auditors verify — and when?*
        `,
        devTakeaway:
          'Vendor SDKs and integrations inherit your attack surface: scope their tokens, isolate their runtime, and monitor their traffic. Your sub-processor list is part of your security architecture, not a legal footnote.',
        securityTakeaway:
          'Read vendor trust pages like an auditor, not a buyer: report type, period, certificate scope, sub-processor list. Logos never expire; certifications do — and the gap between them is a live finding.',
        challenge: {
          id: 'chal-5-7',
          type: 'inspect',
          prompt:
            'Inspect the /api/vendors/datastream/certifications response in the Network tab. The ISO 27001 certificate advertised on the trust page has quietly lapsed. Type the exact expiry date stored in the record (format YYYY-MM-DD).',
          targetHint:
            'Open the Network tab, select the certifications request, and copy the value of the expires field inside the iso_27001 object.',
          solution: '2025-08-31',
          successMessage:
            'Found it — 2025-08-31. The logo is still on the page; the certificate is over a year stale, and nobody re-ran the due diligence after the sales call.',
          explanation:
            'Point-in-time assessments decay. That is why the "M" in TPRM is monitoring: certifications, report periods, and sub-processor lists must be re-checked on a schedule, not once at signature.'
        },
        simulatedTarget: {
          appName: 'DataStream Vendor Portal',
          targetUrl: 'https://vendors.meridian-logistics.example/onboarding/datastream',
          description: 'Vendor onboarding portal with a live certification feed behind an immaculate trust page.',
          htmlSource: `<!DOCTYPE html>
<html>
  <head><title>DataStream Analytics — Security</title></head>
  <body class="bg-slate-900 text-slate-100 p-6 font-sans">
    <h1 class="text-xl font-bold">DataStream Analytics</h1>
    <div class="mt-3 flex gap-2 text-xs">
      <span class="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded">ISO 27001 Certified</span>
      <span class="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded">SOC 2 Type II</span>
      <span class="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded">GDPR Compliant</span>
    </div>
    <!-- certification details are rendered live from /api/vendors/datastream/certifications — do not hardcode -->
    <p class="text-xs text-slate-400 mt-4">Sub-processor list and DPA available in the due-diligence package.</p>
  </body>
</html>`,
          storageItems: [
            { key: 'questionnaire_draft', value: 'SIG-lite 2026: 88 of 92 answers complete', type: 'localStorage' },
            { key: 'onboarding_stage', value: 'security-review', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/vendors/datastream/certifications',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                iso_27001: {
                  status: 'expired',
                  certified_on: '2023-08-31',
                  expires: '2025-08-31',
                  scope: 'Analytics platform + UK office'
                },
                soc_2: { type: 'II', period_end: '2026-01-31', next_report: 'not scheduled' },
                pci_dss: { via: 'processor (shared responsibility)' }
              }
            },
            {
              url: '/api/vendors/datastream/subprocessors',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                dpa_signed: '2024-06-10',
                subprocessors_at_signature: 4,
                current_count: 9,
                additions: [
                  { name: 'Helix Cloud', region: 'eu-central-1', consent: 'yes' },
                  { name: 'Northbeam ML Ops', region: 'us-east-1', consent: 'yes' },
                  { name: 'Sable Analytics resale', region: 'ap-southeast-2', consent: 'NOT on the signed DPA' }
                ]
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 5.8 ─────────────────────────── */
      {
        id: 'lesson-5-8',
        trackId: 'track-5',
        number: '5.8',
        title: 'Audit Evidence',
        tagline: 'An auditor does not ask "is it secure?" — they ask "show me the artifact." Controls that produce no evidence effectively do not exist.',
        estimatedMinutes: 12,
        difficulty: 'Advanced',
        mentalModelConcept:
          'A control is only real in three parts: it exists (design), it operates (execution), and it leaves proof (evidence). Continuous control monitoring exists because the proof part is what actually fails.',
        discoveryPrompt:
          'Audit day at Meridian Logistics. You hold the evidence packet for the customer database: ten controls, ten claimed artifacts. Classify each control\'s evidence as Present or Missing — remembering that evidence must also be CURRENT (cover the audit period) and prove OPERATION, not just intent. Run the gap analysis and see which three controls fail.',
        discoveryComponent: 'ControlGapAuditDemo',
        noticeThisMoments: [
          'Notice the three distinct failure modes hiding in one packet: evidence that is STALE (a 2024 access review in a 2026 audit), evidence that is ABSENT (no restore-test record at all), and a POLICY filed as evidence (a disposal procedure with no execution log).',
          'Notice that a signed policy answers "is it designed?" — it never answers "did it operate?" Evidence of operation is always an artifact of time: a log, a dated report, a signed approval.',
          'Notice how quickly three gaps among ten controls become three audit findings — each with a severity, an owner, and a remediation date you now have to negotiate.'
        ],
        explanationMarkdown: `
### The Mental Model: The Photocopier Test

Auditing is closer to tax preparation than to hacking. The auditor does not attack your database; they open your evidence folder and test whether the controls you claim exist actually operated during the audit period. If the folder is empty, the control might be perfectly real — and it still fails, because *unverifiable = non-compliant*.

### Evidence Has a Shape

Valid evidence of operation has three properties:

- **It is an artifact of time** — a log export, a dated report, a signed approval record. A policy PDF is an artifact of *intent*.
- **It covers the audit period** — last year's access review says nothing about this year's access.
- **It is attributable** — produced by the named system or owner, not hand-typed for the auditor.

\`\`\`text
control: quarterly access review (AR-04)
  claimed:      "access reviews are performed quarterly"
  artifact:     access_review_2024Q4.xlsx
  audit period: 2026-01-01 .. 2026-09-30
  verdict:      MISSING (stale — zero coverage of the period)
\`\`\`

### What Happens to Gaps

Each missing artifact becomes a **finding** — ISO language grades them *nonconformities* (a requirement was not met) versus opportunities for improvement (advice). Findings get owners and due dates, and a pile of them at the next audit is how certificates get suspended and SOC 2 reports come back qualified.

### Continuous Control Monitoring

The mature response is to stop treating evidence as an annual scavenger hunt. Controls that emit their own proof — automated config checks, IdP review workflows that store sign-offs, backup systems that log restore tests — shift evidence collection from *remembering* to *observing*. That is continuous control monitoring: the control generates its own audit trail every day it operates.

> **The Habit to Build:** For any control someone claims exists, ask three questions in order: *where is it enforced, when did it last operate, and where is the artifact?* The third question is where programs actually fail.
        `,
        devTakeaway:
          'Emit evidence as a side effect of doing the work: signed review records, automated config snapshots, logged restore tests. Evidence collection designed as a separate annual project always loses to deadlines.',
        securityTakeaway:
          'Read evidence packets adversarially: check dates against the audit period, check that the artifact proves operation and not just intent, and check it covers the system in scope — not the estate that happened to be convenient.',
        challenge: {
          id: 'chal-5-8',
          type: 'triage',
          prompt:
            'Complete the gap analysis in the widget above — classify all ten controls. Each gap you confirm becomes an audit outcome. Type the single word the lesson uses for a control that fails at audit time (a ____ ; ISO calls it a nonconformity).',
          targetHint: 'Both the general term and the ISO term appear in the lesson text; either earns the badge.',
          solution: (input: string) => /finding|non[\s-]?conform/i.test(String(input)),
          successMessage:
            'Audit vocabulary locked in. Every missing artifact you found converts into a finding with an owner, a severity, and a due date — and next year, into the first question the auditor asks.',
          explanation:
            'Audits do not measure security; they measure provable security. Three evidence gaps in ten controls can qualify an entire SOC 2 report — which customers then read in their own vendor reviews as "exceptions noted".'
        },
        simulatedTarget: {
          appName: 'Meridian Audit Evidence Drive',
          targetUrl: 'https://grc.meridian-logistics.example/audit/fy2026/customer-db',
          description: 'Evidence packet index for the customer database audit.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-100">
  <h2 class="font-bold text-lg">FY2026 Evidence Packet — Customer Database</h2>
  <p class="text-xs text-slate-400 mt-1">Audit period 2026-01-01 → 2026-09-30 · frameworks: SOC 2 Type II, ISO 27001</p>
  <p class="text-xs text-amber-300 mt-2">Use the interactive packet in the lesson to classify each control.</p>
</div>`,
          storageItems: [{ key: 'packet_version', value: 'draft-3-uploaded-by-audit-lead', type: 'localStorage' }],
          networkRequests: [
            {
              url: '/api/audit/fy2026/customer-db/controls',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: { controls_claimed: 10, artifacts_uploaded: 10, gap_analysis: 'not yet run' }
            }
          ]
        }
      },

      /* ─────────────────────────── 5.9 ─────────────────────────── */
      {
        id: 'lesson-5-9',
        trackId: 'track-5',
        number: '5.9',
        title: 'The Incident Notification Clock',
        tagline: 'The breach starts a stopwatch. Regulators gave you 72 hours; most organizations spend them deciding whether they have a breach.',
        estimatedMinutes: 11,
        difficulty: 'Advanced',
        mentalModelConcept:
          'Post-breach, compliance becomes a clock problem: notification duties (regulator, customers, contracts), evidence preservation, and a blameless review — the timeline you can PROVE matters as much as the incident itself.',
        discoveryPrompt:
          'It is 02:41 on September 14. Sentinel\'s detection pipeline just flagged bulk reads from the customer export API. Open the simulated IR console in DevTools and read the incident record: when was the organization "aware", when was the notification draft finally circulated — and did they beat the clock?',
        discoveryComponent: 'DevToolsInspection',
        noticeThisMoments: [
          'Notice the incident record carries an aware_at timestamp of 2026-09-14T02:41Z, while the notification draft in the network log is dated 2026-09-18T10:05Z — "aware" is defined by detection, not by executive acceptance.',
          'Notice the legal-hold flag in storage: from the moment litigation is reasonably anticipated, routine log rotation and auto-deletion quietly become spoliation risk.',
          'Notice how thin the post-incident note is ("root cause: overly permissive IAM role; action items: TBD") — the incident is contained, but the governance failure is just beginning to compound.'
        ],
        explanationMarkdown: `
### The Mental Model: The Regulatory Stopwatch

Breach response runs two clocks at once. The *technical* clock measures containment: hours to revoke keys, patch, and stop the bleeding. The *compliance* clock measures obligations: regulators, customers, and contracts, each with its own deadline and its own audience. Teams that only run the first clock routinely blow the second — and the second one is measured in fines and court evidence.

### The Big Three Duties

- **Regulator notification** — under GDPR Article 33, the supervisory authority must be notified within **72 hours** of becoming *aware* of a personal data breach, with the facts known so far; missing details can follow. Many US states run 30–45 day statutes; finance and health sectors run faster specialized rules.
- **Customer notification** — GDPR requires it when the risk to individuals is high; contracts often require it faster (the classic vendor clause: "72 hours to notify the controller").
- **Evidence preservation** — the moment litigation or investigation is anticipated, preserve logs, images, and tickets. Legal hold overrides retention schedules.

\`\`\`text
timeline reconstructed from the IR console:

2026-09-14T02:41Z  detection: bulk reads on /api/exports/customers
2026-09-14T03:10Z  INC-2291 opened (P1), service keys revoked
2026-09-16T15:22Z  scope confirmed: 4.1M records, PII classes A-D
2026-09-17T02:41Z  <- 72-hour deadline for the regulator notice
2026-09-18T10:05Z  notification draft circulated to legal
\`\`\`

### The Part Everyone Skips: The Review

Once the dust settles, the post-incident review is the only place the organization converts suffering into control improvements. Done blamelessly, it asks: *what did we believe, what was actually true, and which register entry, standard, or procedure changes as a result?* An incident whose review produces no register update will visit again — usually with worse timing.

> **The Habit to Build:** During any incident, keep two logs in parallel: the technical timeline and the obligation timeline. When someone says "we'll notify once we're sure," reply: "aware means aware — the clock started at detection."
        `,
        devTakeaway:
          'Instrument detection and keep tamper-evident, retention-protected logs; your first regulator filing is written from whatever your logging captured in the first hour — nothing else.',
        securityTakeaway:
          'In an investigation, establish the "aware" timestamp first and preserve evidence immediately — the gap between detection and disclosure is exactly where legal and regulatory risk concentrates.',
        challenge: {
          id: 'chal-5-9',
          type: 'inspect',
          prompt:
            'Read the incident record and the notification timestamps in the simulated IR console. Under GDPR Article 33, a controller must notify the supervisory authority within a fixed number of hours of becoming aware. Type that number.',
          targetHint:
            'Check the incident JSON in the Storage tab and the draft-notification request in the Network tab, then recall the deadline named in the lesson.',
          solution: (input: string) => /\b72\b/.test(String(input)),
          successMessage:
            '72 hours — and this incident missed it. Awareness was 02:41 on the 14th; the draft reached legal on the 18th, roughly 103 hours later. The missed clock is now a second violation stacked on top of the breach.',
          explanation:
            '"Aware" means the moment the organization has a reasonable degree of certainty that a breach occurred — detection, not the executive meeting that accepts it. Late notification is charged separately from the breach itself.'
        },
        simulatedTarget: {
          appName: 'Sentinel IR Console',
          targetUrl: 'https://ir.sentinel.example/incidents/INC-2291',
          description: 'Incident response console for a live P1 customer-data incident.',
          htmlSource: `<!DOCTYPE html>
<html>
  <head><title>INC-2291 — Sentinel IR</title></head>
  <body class="bg-slate-900 text-slate-100 p-6 font-sans">
    <h1 class="text-xl font-bold">INC-2291: Bulk reads on customer export API</h1>
    <span class="mt-2 inline-block px-3 py-1 bg-rose-950 border border-rose-800 rounded text-rose-300 text-xs">P1 — Containing</span>
    <div class="mt-3 p-3 bg-amber-950/40 border border-amber-800/60 rounded text-amber-200 text-xs">
      Regulator notification status: DRAFT PENDING LEGAL REVIEW
    </div>
    <p class="text-[10px] text-slate-500 mt-4">Legal hold active. Retention auto-deletion disabled for all evidence sources.</p>
  </body>
</html>`,
          storageItems: [
            {
              key: 'inc_2291',
              value:
                '{"detected_at":"2026-09-14T02:41Z","aware_at":"2026-09-14T02:41Z","severity":"P1","scope":"4.1M records, PII classes A-D","status":"containing"}',
              type: 'localStorage'
            },
            { key: 'legal_hold', value: 'active-since-2026-09-15', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/detections/bulk-read-alerts/9912',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                alert: 'bulk export on /api/exports/customers',
                rows_read: 4100333,
                first_seen: '2026-09-14T02:41Z',
                actor: 'svc-reporting (key used from a new ASN)'
              }
            },
            {
              url: '/api/incidents/INC-2291/timeline',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                events: [
                  { at: '2026-09-14T02:41Z', event: 'detection acknowledged; aware_at set' },
                  { at: '2026-09-14T03:10Z', event: 'INC-2291 opened (P1); service keys revoked' },
                  { at: '2026-09-16T15:22Z', event: 'scope confirmed: 4.1M records, PII classes A-D' },
                  { at: '2026-09-17T02:41Z', event: 'automatic marker: 72h regulator deadline' },
                  { at: '2026-09-18T10:05Z', event: 'notification draft circulated to legal' }
                ]
              }
            },
            {
              url: '/api/legal/draft-notification',
              method: 'POST',
              status: 201,
              headers: { 'Content-Type': 'application/json' },
              body: { incident: 'INC-2291', authority: 'lead supervisory authority', draft_version: 1 },
              response: { filed: false, note: 'draft only — awaiting legal sign-off' }
            }
          ]
        }
      },

      /* ─────────────────────────── 5.10 ─────────────────────────── */
      {
        id: 'lesson-5-10',
        trackId: 'track-5',
        number: '5.10',
        title: 'Maturity Models & Board Reporting',
        tagline: 'Boards do not buy "we patched 400 things." They buy a trajectory — which makes the honesty of your maturity number the whole product.',
        estimatedMinutes: 12,
        difficulty: 'Advanced',
        mentalModelConcept:
          'Maturity models rate how repeatable and measured a capability is (not whether it is perfect); boards consume that rating plus KPIs and KRIs — so the moment the number is fudged, every downstream decision is fiction.',
        discoveryPrompt:
          'The Q4 board deck says "Security Program Maturity: Level 4". The dashboard is rendered by a small script in the Sources tab. Read the code that produces that number and compare it with the raw metrics the same script fetches. What level does the evidence actually support?',
        discoveryComponent: 'SourcesInspectorDemo',
        noticeThisMoments: [
          'Notice the bundle computes a maturity level from real metrics and then applies a literal + 2 adjustment "to align with peer benchmarks" — the fudge factor is one line of code, not a conspiracy.',
          'Notice the difference between the two board metrics: a KPI (control coverage trending 21% to 38% — good direction) and a KRI (critical vulnerabilities open over 90 days: 17 against an appetite of 5 — breached). Boards steer on both: progress and appetite.',
          'Notice that maturity models never rate whether a control is "secure" — they rate whether the capability is repeatable, measured, and improving. A Level 4 without evidence is a contradiction in terms.'
        ],
        explanationMarkdown: `
### The Mental Model: Flying the Plane by Instruments

A board does not want a list of patches; it wants to know whether the plane is more controllable this quarter than last. Maturity models are the instrument panel: a small ordered scale describing how *deliberate* a capability is, from heroic ad-hoc effort to measured, self-improving operation. A common 5-level shape:

1. **Initial** — ad hoc, person-dependent, heroic.
2. **Repeatable / Managed** — documented enough to repeat, lightly measured.
3. **Defined** — standardized across the org, owned, trained.
4. **Measured** — quantitatively controlled; metrics drive decisions.
5. **Optimizing** — the capability improves itself from its own data.

### Ratings Measure Behavior, Not Perfection

The trap: Level 5 does not mean "no vulnerabilities." It means the vulnerability-management capability *predictably* finds, prioritizes, and fixes them — and tunes itself from the trend. A startup can be Level 3 in patching with a small attack surface; a bank can be Level 1 in vendor reviews with a thousand vendors. That combination is exactly what gets exploited.

### The Board Vocabulary: KPIs and KRIs

- **KPI (performance):** "control coverage 38%, up from 21%; target 80% by Q3." Direction plus plan.
- **KRI (risk appetite):** "critical vulns open over 90 days: 17; appetite: 5." A red line, with a stated consequence when crossed.

\`\`\`text
honest computation (from the fetched metrics):

control_coverage: 0.38   vulns_over_90d: 17 (appetite 5)   reviews: 1/4
computed_level: 2   <- "repeatable at best", not "measured"
displayed_level: computed_level + 2   ->   "Level 4" on the slide
\`\`\`

### Translate Into Money, Then Ask for a Decision

Maturity numbers are read-throughs: they exist to make an ask legible. *"We are Level 2 in third-party risk, KRIs breached, and $400K moves us to Level 3 in four quarters — decision requested"* is a board sentence. "We need more security" is not. The honesty of the number is the product: one discovered fudge degrades every metric the program has ever shown.

> **The Habit to Build:** Before any leadership readout, trace each headline number to its raw data and ask: *"if a skeptical director opened the script, would this number survive?"* If not, fix the number — never the slide.
        `,
        devTakeaway:
          'Compute program metrics from source systems with versioned logic, and never adjust them in presentation code. Dashboards should be able to show the formula next to the number.',
        securityTakeaway:
          'When you are shown a maturity rating, ask for the level definitions in writing and the evidence behind each scored domain. Mature programs keep that mapping; theater cannot.',
        challenge: {
          id: 'chal-5-10',
          type: 'inspect',
          prompt:
            'Open the board report script in the Sources tab. The displayed maturity level is the computed level plus a hardcoded adjustment. Type the honest level — the value before the adjustment (for example, "Level 3").',
          targetHint: 'Search the script for computed_level and for the adjustment applied to it before the slide text is rendered.',
          solution: (input: string) => {
            const s = String(input ?? '').trim();
            return /^\s*2\s*$/.test(s) || /^level\s*2\b/i.test(s);
          },
          successMessage:
            'Level 2 — the evidence supports "repeatable at best", not "quantitatively managed". The slide said Level 4 because of a literal +2 in the render code.',
          explanation:
            'Fudged maturity numbers are a governance vulnerability of their own: once one slide is caught inflating, the board discounts every KPI the program produces — including the accurate ones. The number is the product; keep it honest.'
        },
        simulatedTarget: {
          appName: 'RiskBoard Q4 Deck Builder',
          targetUrl: 'https://board.meridian-logistics.example/q4/build',
          description: 'Board deck generator that renders maturity slides from live program metrics.',
          htmlSource: `<!DOCTYPE html>
<html>
  <head><title>RiskBoard — Q4 Deck</title></head>
  <body class="bg-slate-900 text-slate-100 p-6 font-sans">
    <h1 class="text-xl font-bold">Q4 Board Deck — Draft 7</h1>
    <div class="mt-4 p-6 bg-slate-950 border border-slate-800 rounded-lg text-center">
      <p class="text-xs text-slate-400 uppercase tracking-widest">Slide 3</p>
      <p class="text-3xl font-black text-emerald-400 mt-2">Security Program Maturity: Level 4</p>
      <p class="text-xs text-slate-400 mt-1">Quantitatively Managed — "in line with peer benchmarks"</p>
    </div>
    <script src="/static/js/board_report.js"></script>
  </body>
</html>`,
          storageItems: [
            { key: 'deck_version', value: 'draft-7', type: 'localStorage' },
            { key: 'metric_export_note', value: 'do-not-circulate-until-cfo-signoff', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/program/metrics',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                control_coverage: 0.38,
                coverage_prev_quarter: 0.21,
                vulns_over_90d: 17,
                vulns_appetite: 5,
                access_reviews_complete: 1,
                access_reviews_planned: 4
              }
            },
            {
              url: '/static/js/board_report.js',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/javascript' },
              response: `// RiskBoard Q4 deck generator v2.1
fetch('/api/program/metrics').then(r => r.json()).then(m => {
  const coverageScore = Math.round(m.control_coverage * 10); // 0-10
  const kriPenalty = m.vulns_over_90d > m.vulns_appetite ? 1 : 0;
  const computed_level = Math.max(1, Math.min(5, Math.round(coverageScore / 2) + 1 - kriPenalty));
  // Q3 note from leadership: display level adjusted to sit with peer benchmarks
  const displayed_level = computed_level + 2;
  renderSlide("Security Program Maturity: Level " + displayed_level);
  publishMetric('maturity_level', displayed_level); // feeds the KPI trend chart
});`
            }
          ]
        }
      }
    ]
  }
];
