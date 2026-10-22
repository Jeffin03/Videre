import { Track } from '../types';

/**
 * SOC Path track (id: track-6, lessons 6.1–6.10) — "The Watch Floor".
 *
 * Pedagogical arc: the SOC as a system (6.1) -> the telemetry it runs on
 * (6.2) -> triage discipline (6.3) -> a shared attacker language (6.4) ->
 * engineering the detections themselves (6.5) -> intel that feeds them
 * (6.6) -> containment under pressure (6.7) -> hunting what no rule caught
 * (6.8) -> phishing at speed (6.9) -> measuring and handing over (6.10).
 *
 * Custom widgets: LogHuntDemo (6.2), AlertTriageDemo (6.3) — both require
 * `case` entries in LessonViewer.renderDiscoveryWidget().
 */
export const SOC_TRACKS: Track[] = [
  {
    id: 'track-6',
    number: 6,
    title: 'The Watch Floor',
    shortDescription: 'Telemetry, triage, detection tuning, and containment — the blue team\'s daily craft under the pressure of the clock.',
    philosophyBadge: 'SOC Path',
    iconName: 'Radar',
    colorAccent: 'emerald',
    lessons: [
      /* ─────────────────────────── 6.1 ─────────────────────────── */
      {
        id: 'lesson-6-1',
        trackId: 'track-6',
        number: '6.1',
        title: 'Life Inside the SOC',
        tagline: 'Behind every breach headline is a person at 3 AM, working a queue of red icons, deciding which one matters.',
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        mentalModelConcept: 'A SOC exists to compress time: the gap between an attacker\'s first action and the defender\'s first meaningful response. An alert is a hypothesis, not a fact, and the alert lifecycle (tripwire, triage, escalate/close) is how a team converts raw signals into accountable decisions.',
        discoveryPrompt: 'The alert console below ("BeaconBoard") is itself a web app, and its escalation policy is served to the page over the wire. Open the Simulated DevTools, go to the Network tab, and read the queue API response: for a P1 alert, which tier gets paged immediately?',
        discoveryComponent: 'DevToolsInspection',
        noticeThisMoments: [
          'Notice the tiers: Tier 1 triages volume, Tier 2 scopes and hunts, Tier 3 engineers detections and tracks actors — the escalation policy is a written contract about who does what, in minutes.',
          'Notice that an alert is a hypothesis: the rule saw a pattern, not an intruder, and closing that gap is exactly the analyst\'s job.',
          'Notice how shift handover turns one person\'s memory into an artifact: what is open, what was decided, what to watch.'
        ],
        explanationMarkdown: `
### The Mental Model: An Air-Traffic Console for Bits

An air-traffic controller does not build airplanes and rarely meets the passengers. Their entire job is watching a screen full of moving dots and deciding, in seconds, which two dots are on a collision course.

A Security Operations Center is the same room, for networks. Analysts watch telemetry that other people's systems produce, under time pressure, and turn dots into decisions. They do not write the application, they rarely own the server, and they are measured on one thing: **the time between the attacker's first move and the team's first meaningful response.**

### Why SOCs Exist At All

Nothing about detection is automatic. Someone has to place the sensors, collect the logs, write the rules, and agree to watch them around the clock. SOCs exist because an intrusion unfolds in minutes while businesses operate in hours — waiting until Monday is a business decision, and a bad one.

### The Alert Lifecycle: Tripwire, Triage, Close

Every alert follows the same spine, no matter which tool screamed:

\`\`\`
tripwire -> a rule fires       signal:  "something happened here"
triage   -> an analyst judges  context: "does it matter on this asset?"
escalate -> the team acts      decision:"page the people who can fix it"
close    -> a note is written  memory:  "why this was not an incident"
\`\`\`

1. **Tripwire** — a detection rule fires (14 failed logons, an encoded PowerShell command). At this stage the alert is a *question*, not a finding.
2. **Triage** — a Tier 1 analyst gathers context: which asset, what hour, any change ticket, any intel match. Then the verdict: false positive, true positive, or needs more info.
3. **Escalate or close** — true positives move up with a written handoff; false positives are closed *with a note* so the tuning backlog can fix the rule itself.

> **The Habit to Build:** Never treat an alert as an incident, and never treat it as noise, before you have context. The alert is the tool asking you a question it cannot answer alone.

### Tiers, Shifts, and the Clock

- **Tier 1 — triage:** high volume, thin context; the SLA (acknowledge a P1 in five minutes) lives here.
- **Tier 2 — escalation and scoping:** deeper pivots, containment support, deciding blast radius.
- **Tier 3 — detection engineering and threat intel:** they make the machine better so Tier 1 drowns a little less each month.

Shift work means the ticket you write at 04:00 will be read by a stranger at 06:00 who was asleep for all of it. Write for the person who was not in the room.
        `,
        devTakeaway: 'Emit the logs your future defenders will need: structured events, correct timezones, and user-plus-host identity on every line. A SOC cannot triage what your application never said.',
        securityTakeaway: 'Treat every alert as a question. Triage with context — asset criticality, hour, change tickets, intel — before you escalate or close.',
        challenge: {
          id: 'chal-6-1',
          type: 'triage',
          prompt: 'Open the Simulated DevTools and inspect the alert-queue API response (Network tab, then the Response sub-tab). The escalation policy is written into the payload: for a P1 alert, which tier is paged immediately? Type the tier exactly as the policy spells it (one word, no spaces).',
          targetHint: 'Network tab -> select GET /api/v1/alerts/queue -> Response sub-tab -> look for "escalation_policy".',
          solution: (input: string) => /tier\s*2/i.test(String(input ?? '')),
          successMessage: 'Correct — the policy pages tier2 immediately for P1s, because five minutes of Tier-1 context-gathering is five minutes an attacker also gets.',
          explanation: 'Escalation policies are the SOC\'s service-level promises made machine-readable. Learning to read them off the wire is your first triage skill: the console is just a rendering of API data you can inspect directly.'
        },
        simulatedTarget: {
          appName: 'BeaconBoard — SOC Alert Console',
          targetUrl: 'https://beaconboard.corp.local/alerts',
          description: 'Tier-1 alert queue console used by the night shift.',
          htmlSource: `<div class="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-sans">
  <h1 class="text-xl font-bold mb-1">BeaconBoard — Tier-1 Alert Queue</h1>
  <p class="text-xs text-slate-400 mb-4">Shift: night-2026-03-02 | Analyst: a.reyes_tier1 | Open alerts: 27</p>
  <!-- SLA: P1 must be acknowledged within 5 minutes. Escalation policy is served by the queue API, not hardcoded here. -->
  <div class="p-3 bg-slate-950 border border-rose-900 rounded mb-2" data-alert-id="ALT-4472">
    <span class="text-xs uppercase text-slate-500">Medium | FIN-DC01</span>
    <p class="font-semibold text-sm">Member added to Domain Admins (4728)</p>
  </div>
  <div class="p-3 bg-slate-950 border border-amber-900 rounded mb-2" data-alert-id="ALT-4471">
    <span class="text-xs uppercase text-slate-500">High | MKT-WEB-01</span>
    <p class="font-semibold text-sm">Brute force: 14 failed logons in 60s</p>
  </div>
  <button type="button" class="px-3 py-1.5 bg-emerald-600 text-slate-950 rounded font-bold text-xs" disabled>Acknowledge All</button>
</div>`,
          storageItems: [
            { key: 'bb_shift', value: 'night-2026-03-02', type: 'localStorage' },
            { key: 'bb_analyst', value: 'a.reyes_tier1', type: 'localStorage' },
            { key: 'bb_ack_filter', value: 'open', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/v1/alerts/queue',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json', 'X-Shift': 'night-2026-03-02' },
              response: {
                queue: 'tier1-night',
                open_alerts: 27,
                escalation_policy: {
                  P1: 'page_tier2_immediately',
                  P2: 'tier2_queue_15m',
                  P3: 'tier1_queue_8h'
                },
                ack_sla_minutes: { P1: 5, P2: 15, P3: 480 },
                alerts: [
                  { id: 'ALT-4472', severity: 'medium', asset: 'FIN-DC01', rule: 'Member added to Domain Admins (4728)' },
                  { id: 'ALT-4471', severity: 'high', asset: 'MKT-WEB-01', rule: 'Brute force: 14 failed logons in 60s' }
                ]
              }
            },
            {
              url: '/api/v1/alerts/ALT-4471/ack',
              method: 'POST',
              status: 201,
              headers: { 'Content-Type': 'application/json' },
              body: { analyst: 'a.reyes_tier1', note: 'load test CHG-4471' },
              response: { status: 'acked', sla_breach: false, acked_in_seconds: 47 }
            }
          ]
        }
      },

      /* ─────────────────────────── 6.2 ─────────────────────────── */
      {
        id: 'lesson-6-2',
        trackId: 'track-6',
        number: '6.2',
        title: 'Telemetry: Where the Truth Lives',
        tagline: 'No log knows the whole story. Each one is a witness: precise about its small slice, silent about everything else.',
        estimatedMinutes: 11,
        difficulty: 'Beginner',
        mentalModelConcept: 'Logs are partial witnesses with different vantage points: security logs prove who got in, Sysmon proves which process spawned which, DNS proves who the host wanted to reach. A compromise becomes visible only when independent witnesses agree on a timeline.',
        discoveryPrompt: 'Below is a live slice of one workstation\'s night: Windows security events, Sysmon process rows, DNS queries, PowerShell script blocks, and flow records. Exactly three rows are evidence of a compromise — the rest is the sound of a healthy network breathing. Filter, read, and flag them; the lab completes at 3/3.',
        discoveryComponent: 'LogHuntDemo',
        noticeThisMoments: [
          'Notice Event ID 4625 (failed logon) beside 4624 (successful logon): failures are noise until one is followed by a success from the same source.',
          'Notice Sysmon Event ID 1 rows that record the *parent* process — a Word document spawning encoded PowerShell is a parent-child pair no baseline expects.',
          'Notice that DNS logs answer a question firewall flows cannot: not just what bytes moved, but who this host *wanted* to reach.'
        ],
        explanationMarkdown: `
### The Mental Model: Witnesses With Different Vantage Points

Think of a bank robbery investigation. The camera at the door saw a face. The ledger saw money move. The phone log heard a call. Each witness is reliable about its own small slice and silent about everything else — and a detective who interviews only one of them writes a wrong report.

Logs are witnesses. They are precise, partial, and timestamped. The craft of telemetry analysis is knowing which witness answers which question.

### The Core Windows Event IDs

- \`4624\` — successful logon, with a *logon type* that changes the story: type 2 is console, 3 is network (SMB, service), 10 is RDP.
- \`4625\` — failed logon: the tripwire for guessing and spraying.
- \`4688\` — process creation (command lines need an explicit opt-in).
- Sysmon \`1\` — process creation *with the parent image*, which is where "who spawned whom" lives.
- PowerShell \`4104\` — the decoded script block: the \`-enc\` blob, translated for you.

### Correlate By Time, Host, and Identity

One row rarely proves anything. The story appears when independent witnesses agree on a timeline:

\`\`\`
02:42:03  sysmon.1     parent=WINWORD.EXE   child=powershell.exe -enc ...
02:44:10  dns.query    xk4n-metricsync.top -> 45.129.98.7   (first in 180 days)
02:47:11  winsec.4624  type=10 RDP Administrator from 45.129.98.7
\`\`\`

Three rows, three log sources, one intrusion. The firewall flow log alone would show only quiet TLS; the security log alone would show an unremarkable RDP logon. **The joins are the detection.**

> **The Habit to Build:** When you open a log source, ask "what question does this witness answer?" Collect the set that answers *your* question, and alert on the agreement between them rather than on any single row.
        `,
        devTakeaway: 'Log the fields defenders will need later: process parents (Sysmon 1), logon types (4624/4625), decoded script blocks (4104), and DNS queries — all with synchronized clocks.',
        securityTakeaway: 'Correlate by time, host, and identity. One row is an anomaly; three independent rows agreeing on a timeline is an intrusion story.',
        challenge: {
          id: 'chal-6-2',
          type: 'triage',
          prompt: 'Work the Log Hunt lab above: flag the three telemetry rows that prove the compromise (the counter reads 3/3 when you have them). Then type the image name of the parent process that spawned the encoded PowerShell — the parent recorded in the Sysmon row.',
          targetHint: 'The Sysmon row at 02:42:03 records a parent-child pair — type the parent executable image (e.g. name.exe).',
          solution: (input: string) => /winword/i.test(String(input ?? '')),
          successMessage: 'Found it — WINWORD.EXE spawning encoded PowerShell at 02:42 is the whole hunt in one row: a document became a shell.',
          explanation: 'Office applications spawning command interpreters is one of the most reliable parent-child anomalies in endpoint telemetry. Alone it is suspicious; joined to a first-seen domain 90 seconds later and an external RDP logon 5 minutes later, it is a timeline.'
        },
        simulatedTarget: {
          appName: 'VectorPipe Log Pipeline Console',
          targetUrl: 'https://vectorpipe.corp.local/pipelines/eng-laptops',
          description: 'Collector configuration and source health for endpoint telemetry.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono text-xs">
  <h2 class="font-bold mb-2">Pipeline: eng-laptops-prod</h2>
  <p>sources: winsec, sysmon, dns, powershell, flow</p>
  <p>retention_days: 90</p>
  <p>alert_on: correlation joins (auth + dns + process)</p>
</div>`,
          storageItems: [
            { key: 'pipeline_mode', value: 'tail', type: 'localStorage' },
            { key: 'retention_days', value: '90', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/pipeline/sources',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                sources: [
                  { name: 'winsec', events: [4624, 4625, 4688] },
                  { name: 'sysmon', events: [1, 3, 11] },
                  { name: 'dns', events: ['query'] },
                  { name: 'powershell', events: [4103, 4104] },
                  { name: 'flow', events: ['netflow'] }
                ],
                correlation_enabled: true
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 6.3 ─────────────────────────── */
      {
        id: 'lesson-6-3',
        trackId: 'track-6',
        number: '6.3',
        title: 'Triaging the First Alert',
        tagline: 'Severity is what the rule thinks it found. Priority is what the business would lose if it is right.',
        estimatedMinutes: 10,
        difficulty: 'Beginner',
        mentalModelConcept: 'Triage is emergency-room logic applied to alerts: treat the patient whose condition deteriorates fastest, not the loudest one. Priority is computed from severity multiplied by asset criticality and context — a Medium alert on a domain controller outranks a High alert on a brochure site.',
        discoveryPrompt: 'Five real-shaped alerts are waiting in the queue. For each one, load its triage context panel, then choose True Positive, False Positive, or Needs More Info. Four correct verdicts clear the queue — and the context, not the severity badge, is what decides each one.',
        discoveryComponent: 'AlertTriageDemo',
        noticeThisMoments: [
          'Notice that severity comes from the *rule* ("this pattern is bad"), while priority comes from the *asset* ("bad things here hurt the most").',
          'Notice how a change ticket converts "attacker at the door" into "the delivery we approved" — context is not an excuse, it is evidence.',
          'Notice alerts that are technically true but operationally explainable: they still deserve a tuning note so the queue shrinks for the next shift.'
        ],
        explanationMarkdown: `
### The Mental Model: Emergency Room Triage

An emergency room does not treat the loudest patient first; it treats the patient whose condition will deteriorate fastest. A quiet case of sepsis in the corner outranks a shouting sprained ankle, every time.

The SOC queue works the same way. The alert that flashes "Critical" is not automatically the one you touch first — the one on the asset whose loss stops payroll is. Applied to forty queued alerts, the same principle becomes a habit: sort by consequence, not by arrival time or badge color.

### Severity vs Priority

**Severity** is a property of the rule: how bad this *pattern* is in general. **Priority** is a property of this organization, this asset, this hour:

\`\`\`
ALT-4471  High    MKT-WEB-01  (Standard)        -> P3  close as FP after change check
ALT-4472  Medium  FIN-DC01    (Crown Jewel)     -> P1  escalate now
\`\`\`

That inversion — Medium beating High — is not an exception to triage. It *is* triage.

### The Three Verdicts

- **True Positive:** the activity is real and unauthorized. Escalate, and support containment.
- **False Positive:** the rule was wrong about reality. Close it *with a note*, and file the tuning change — a documented FP is queue insurance for next month.
- **Needs More Info:** your ignorance, not the rule's fault. Name the enrichment that would resolve it: an intel lookup, a hash reputation check, a word with the asset owner. "Needs more info" is a verdict with homework attached — never a polite way to postpone deciding.

> **The Habit to Build:** An alert closed without a note teaches the machine nothing. Write the "why" every single time — your successor at 06:00 is you, minus the context.
        `,
        devTakeaway: 'Ship asset criticality and ownership inside the alert payload. If triage requires archaeology to find out what the box does, your MTTR is already lost.',
        securityTakeaway: 'Severity is what the rule found; priority is what the business would lose. Multiply, then decide — and when context is missing, ask for it instead of guessing.',
        challenge: {
          id: 'chal-6-3',
          type: 'triage',
          prompt: 'Clear the triage queue above — four of five verdicts correct. One alert must jump the queue despite carrying only Medium severity, because of the asset it sits on. Type that asset hostname exactly as it appears on its alert card.',
          targetHint: 'Sort by what the business would lose, not by the severity badge — the asset marked Crown Jewel is the tell.',
          solution: 'FIN-DC01',
          successMessage: 'Exactly — a new Domain Admin on the finance domain controller at 03:12 with no ticket is the night\'s real emergency, severity badge notwithstanding.',
          explanation: 'This is why triage is a human job. The rule correctly reported "medium-confidence pattern"; only a person (or a well-tuned enrichment layer) can weigh a domain controller against a marketing site and re-rank the queue.'
        },
        simulatedTarget: {
          appName: 'Aegis Alert Schema Reference',
          targetUrl: 'https://aegis.corp.local/schema/alert',
          description: 'Field definitions for the alert object that feeds the triage queue.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono text-xs">
  <h2 class="font-bold mb-2">alert object — v3</h2>
  <p class="text-slate-400">severity:      rule confidence (Critical/High/Medium/Low)</p>
  <p class="text-slate-400">asset_criticality: Crown Jewel | Business Critical | Standard</p>
  <p class="text-slate-400">priority:      computed = severity x asset_criticality x context</p>
  <p class="text-slate-400">verdicts:      true_positive | false_positive | needs_more_info</p>
</div>`,
          storageItems: [
            { key: 'queue_view', value: 'tier1-night', type: 'localStorage' }
          ],
          networkRequests: [
            {
              url: '/api/v1/schema/alert',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                fields: {
                  severity: 'rule confidence (Critical/High/Medium/Low)',
                  asset_criticality: 'Crown Jewel | Business Critical | Standard',
                  priority: 'computed: severity x asset_criticality x context',
                  verdicts: ['true_positive', 'false_positive', 'needs_more_info']
                }
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 6.4 ─────────────────────────── */
      {
        id: 'lesson-6-4',
        trackId: 'track-6',
        number: '6.4',
        title: 'Speaking MITRE ATT&CK',
        tagline: '"Malware detected" is a verdict. ATT&CK turns it into a sentence two teams can both repeat, compare, and act on.',
        estimatedMinutes: 9,
        difficulty: 'Intermediate',
        mentalModelConcept: 'A tactic is the attacker\'s goal (why they are doing this phase); a technique is the concrete how. ATT&CK is a public dictionary of both, and mapping alerts to it turns isolated detections into measurable coverage and comparable intelligence.',
        discoveryPrompt: 'The team\'s detection catalog maps every rule to a MITRE ATT&CK technique. Open the Simulated DevTools, go to the Network tab, select GET /api/v1/detections/catalog, and read its Response: which technique ID is the rule "Brute force via valid accounts" mapped to?',
        discoveryComponent: 'NetworkInspectorDemo',
        noticeThisMoments: [
          'Notice that ATT&CK IDs encode hierarchy: T1110 is "Brute Force" and T1110.001 is the "Password Guessing" sub-technique.',
          'Notice the split between tactic (Credential Access — what the attacker wants) and technique (guessing valid passwords — how they are getting it).',
          'Notice alerts with no technique mapping at all: they cannot be compared to intel reports, counted toward coverage, or noticed when they stop firing.'
        ],
        explanationMarkdown: `
### The Mental Model: A Shared Language for "How"

Two teams describing the same attack with different words cannot compare notes. "The bad guys did the login thing again" is not a report; it is a shrug in a trench coat.

MITRE ATT&CK is the dictionary. It is a public matrix of attacker **tactics** — the phases and goals (Initial Access, Execution, Persistence, Credential Access, Lateral Movement, Command and Control, Exfiltration) — and **techniques**, the concrete ways they achieve each goal.

### From Alert to Sentence

"Malware detected" is a verdict with no story. Rewritten in ATT&CK, each alert becomes a claim someone can check:

- 14 failed logons in a minute -> **T1110.001 Password Guessing** (tactic: Credential Access)
- Word document spawns encoded PowerShell -> **T1059.001 PowerShell** (tactic: Execution)
- HTTPS callbacks on a 60-second timer -> **T1071.001 Web Protocols** (tactic: Command and Control)

\`\`\`
alert -> technique -> "what does this step actually get the attacker?"
DET-0101 brute force  -> T1110.001 -> one more try at one valid password
\`\`\`

### Why Mapping Beats Adjectives

Once alerts carry technique IDs, questions that used to be vibes become arithmetic: "We detect 41% of the Credential Access techniques in our threat model — Exfiltration is uncovered." Threat intel reports also cite IDs, so external intel becomes *joinable* to your alert history: has this technique ever fired here, and when?

And "novel" attacks often turn out to be an old technique in a new costume — which you can only see if you are counting techniques.

> **The Habit to Build:** When you write, review, or receive an alert, demand its technique ID. If nobody can name one, the alert is a rumor wearing a red badge.
        `,
        devTakeaway: 'Tag detections with ATT&CK technique IDs at authoring time — the mapping is metadata, and once it exists, coverage becomes a computed metric instead of a feeling.',
        securityTakeaway: '"Malware detected" tells you nothing reusable. Map every alert to a technique so it can be compared with intel, counted toward coverage, and hunted when it goes quiet.',
        challenge: {
          id: 'chal-6-4',
          type: 'inspect',
          prompt: 'Inspect the detection catalog in the Simulated DevTools: Network tab -> select GET /api/v1/detections/catalog -> Response sub-tab. Type the ATT&CK technique ID mapped to the rule "Brute force via valid accounts", in the exact format shown (T####.###).',
          targetHint: 'Every rule in the response carries a mitre_technique field — copy the one attached to the brute force rule.',
          solution: 'T1110.001',
          successMessage: 'Mapped — T1110.001 (Password Guessing, under the Brute Force technique). You just translated an alert into the language the whole defense team shares.',
          explanation: 'The sub-technique level matters: T1110.001 (guessing) and T1110.003 (password spraying) demand different detections. Analysts who quote precise IDs write tickets that detection engineers can act on without a follow-up meeting.'
        },
        simulatedTarget: {
          appName: 'Aegis Detection Catalog',
          targetUrl: 'https://aegis.corp.local/detections',
          description: 'Rule catalog mapping every production detection to MITRE ATT&CK.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-sans text-xs">
  <h2 class="font-bold text-sm mb-2">Detection Catalog (37 active rules)</h2>
  <ul class="space-y-1 text-slate-400 font-mono">
    <li>DET-0101 — Brute force via valid accounts</li>
    <li>DET-0204 — Office application spawning shell</li>
    <li>DET-0311 — Beaconing over web protocols</li>
  </ul>
  <p class="text-[11px] text-slate-500 mt-3">Technique mappings are served by the catalog API — inspect the network response.</p>
</div>`,
          storageItems: [
            { key: 'catalog_view', value: 'matrix', type: 'localStorage' },
            { key: 'last_sync', value: '2026-03-02T04:00Z', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/v1/detections/catalog',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=300' },
              response: {
                rules: [
                  { id: 'DET-0101', name: 'Brute force via valid accounts', severity: 'high', mitre_tactic: 'Credential Access', mitre_technique: 'T1110.001' },
                  { id: 'DET-0204', name: 'Office application spawning shell', severity: 'critical', mitre_tactic: 'Execution', mitre_technique: 'T1059.001' },
                  { id: 'DET-0311', name: 'Beaconing over web protocols', severity: 'medium', mitre_tactic: 'Command and Control', mitre_technique: 'T1071.001' }
                ]
              }
            },
            {
              url: '/api/v1/detections/coverage',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                coverage_pct: 41,
                uncovered_tactics: ['Impact', 'Exfiltration'],
                note: 'coverage computed from technique mappings, not from rule count'
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 6.5 ─────────────────────────── */
      {
        id: 'lesson-6-5',
        trackId: 'track-6',
        number: '6.5',
        title: 'Detection Engineering & Tuning',
        tagline: 'A detection that cries wolf every night gets disabled — and then the house really does burn.',
        estimatedMinutes: 12,
        difficulty: 'Intermediate',
        mentalModelConcept: 'Detection is an engineering discipline with a budget: every rule spends analyst attention, so a rule\'s value is true positives found minus the noise it costs. Rules are tuned in measured loops and versioned like code — detection-as-code.',
        discoveryPrompt: 'The nightly "suspicious scheduled task" rule fired 1,204 times last night — a false-positive budget blown to pieces. Open the Simulated DevTools and read the Sigma rule config in the page source. Which service account does the analyst have to exclude to stop the 03:00 flood?',
        discoveryComponent: 'DevToolsInspection',
        noticeThisMoments: [
          'Notice the `false_positives:` list inside a Sigma rule: the author already predicted what would be misdetected — that list is the tuning backlog in disguise.',
          'Notice thresholds ("5 events in 60s"): they trade precision for recall. Raise one and slow attacks slip under it; lower one and the queue floods.',
          'Notice the TODO referencing a change ticket: detection-as-code means the tuning fix gets reviewed and versioned, not typed into a console at 3 AM and forgotten.'
        ],
        explanationMarkdown: `
### The Mental Model: A Smoke Detector Next To a Toaster

A smoke detector that screams at toast every morning gets disabled within a week — and then the house burns silently. False positives are not free annoyance; they are the mechanism by which detections die.

The unit of account is the **false-positive budget**: how many useless alerts an analyst will absorb per shift before habituation sets in. Spend it wisely, one scoped exclusion at a time.

### Signatures vs Behavioral Analytics

- **Signature detection** matches known-bad exactly: a hash, a CVE string, a specific command line. Cheap and precise — blind to anything new.
- **Behavioral / anomaly detection** describes a *shape*: a rare parent-child pair, an unusual hour, metronomic beaconing. Catches the new — invents novelty where there is none.

A production stack needs both: signatures for what you already know is coming, behavior for what you do not.

### The Tuning Loop

1. Deploy the rule in log-only mode and count alerts per hour for a week.
2. Sample twenty closed alerts and estimate precision honestly.
3. Exclude documented noise — scoped to the account, source, and time window, never a blanket wildcard.
4. Re-measure, commit the change with a version bump, and ship.

Each pass takes minutes of engineering and saves hundreds of analyst-minutes a month — which is why a quiet afternoon of tuning outperforms a heroic week of writing brand-new rules.

\`\`\`
rule v1.2 -> 1204 alerts/night -> 99.4% closed blind -> rule muted (dead)
rule v1.3 -> exclude svc_backup + threshold 3/10m   -> 9 alerts/night, 6 real -> kept
\`\`\`

> **The Habit to Build:** Before deleting a noisy rule, ask what *one scoped exclusion* would make it quiet while still catching the attacker who studied your allowlist and timed their work around it.
        `,
        devTakeaway: 'Manage detections as code: version control, peer review, staging, and tests — plus an explicit false-positive budget for every rule you own.',
        securityTakeaway: 'Noise is the enemy of detection. A rule with no tuned exclusions gets muted, and a muted rule never wakes anyone at 3 AM.',
        challenge: {
          id: 'chal-6-5',
          type: 'inspect',
          prompt: 'The scheduled-task rule fired 1,204 times last night. Read the Sigma rule config in the Simulated DevTools page source (Elements tab) and type the exact service account the analyst must exclude to stop the 03:00 noise (format svc_...).',
          targetHint: 'Look at the false_positives list and the TODO comment referencing change ticket CHG-4489.',
          solution: 'svc_backup',
          successMessage: 'Tuned — the nightly backup task\'s service account was the flood. One scoped exclusion turns a dead rule into nine useful alerts.',
          explanation: 'Real tuning is surgical: exclude the specific account on the specific hosts in the change window, keep the threshold, and re-measure. Blanket suppressions ("ignore EventID 4698") delete the detection along with the noise — a lesson attackers rely on.'
        },
        simulatedTarget: {
          appName: 'Sigma Studio (Detection-as-Code)',
          targetUrl: 'https://aegis.corp.local/detections/sigma-4698',
          description: 'Rule editor with versioned Sigma configs, stats, and tuning notes.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono text-xs">
  <h2 class="font-bold mb-2">rule_scheduled_task_noise — v1.2</h2>
  <p class="text-slate-400">Fired last night: 1,204 times | muted: false | owner: detection-eng</p>
  <pre class="mt-3 p-3 bg-slate-950 border border-slate-800 rounded text-cyan-200 overflow-x-auto">title: Scheduled Task Created Outside Change Window
id: 7c2a9f11-4b8e-4d19-a2c5-51d0a11e0042
status: experimental
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4698
  condition: selection
level: medium
false_positives:
  - "Nightly backup job rotating keys on APP-07"
  - "SCCM maintenance windows"
# TODO(CHG-4489): add the backup service account to the
# exclusion list once the scheduler logs it correctly.
exclusions:
  exclude_accounts:
    - "svc_sql_etl"</pre>
</div>`,
          storageItems: [
            { key: 'sigma_draft', value: 'v1.3-tuning', type: 'localStorage' },
            { key: 'rule_owner', value: 'detection-eng', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/detections/rules/sigma-4698/stats',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                fired_last_night: 1204,
                precision_last_30d: 0.004,
                muted: false,
                top_noisy_account: 'svc_backup',
                top_noisy_host: 'APP-07'
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 6.6 ─────────────────────────── */
      {
        id: 'lesson-6-6',
        trackId: 'track-6',
        number: '6.6',
        title: 'Threat Intel & IOC Handling',
        tagline: 'Intelligence is what changes a decision. Everything else is a list of strings with a confidence field.',
        estimatedMinutes: 9,
        difficulty: 'Intermediate',
        mentalModelConcept: 'Indicators of Compromise have a half-life: domains, IPs, and hashes rot as fast as attackers rotate them. Useful intel arrives actionable, enriched, aged, and scoped — and an allowlist entry is a production change because it silently suppresses alerts forever.',
        discoveryPrompt: 'Your feed relay caches each batch base64-wrapped so downstream proxies can transport it as plain text. Here is last night\'s cache blob: `eyJmZWVkIjoibmV4dXMtaW50ZWwtY2FjaGUiLCJnZW5lcmF0ZWQiOiIyMDI2LTAzLTAyVDA0OjE1OjAwWiIsInByb2R1Y2VyIjoiZmVlZC1yZWxheS0wMyIsImlvY3MiOlt7InR5cGUiOiJkb21haW4iLCJ2YWx1ZSI6InN5bmNwdWxzZS1hbmFseXRpY3MubmV0IiwiY29uZmlkZW5jZSI6ImhpZ2giLCJmaXJzdF9zZWVuIjoiMjAyNS0xMi0xOSIsImxhc3Rfc2VlbiI6IjIwMjYtMDItMjgiLCJ0YWdzIjpbImMyIiwiYmVhY29uIl19LHsidHlwZSI6ImlwdjQiLCJ2YWx1ZSI6IjE4NS4yNDQuMjEuNyIsImNvbmZpZGVuY2UiOiJoaWdoIiwiZmlyc3Rfc2VlbiI6IjIwMjUtMTItMTkiLCJ0YWdzIjpbImMyIl19LHsidHlwZSI6InNoYTI1NiIsInZhbHVlIjoiOWYyYzFkNDRlN2IwYTNjNWQ2MWY4ODI5YWIzNGU1YzdkMGIxYTJmM2M0ZDVlNmY3MDgxOWEyYjNjNGQ1ZTZmNyIsImNvbmZpZGVuY2UiOiJtZWRpdW0iLCJ0YWdzIjpbImxvYWRlciJdfV0sImFsbG93bGlzdCI6WyJ0ZWxlbWV0cnkudmVuZG9yLWNkbi5jb20iLCJ1cGRhdGVzLm1pY3Jvc29mdC5jb20iXSwidHRsX2RheXMiOjMwfQ==` — paste it into the decoder and read what your own intel pipeline is holding.',
        discoveryComponent: 'Base64DecodeDemo',
        noticeThisMoments: [
          'Notice `first_seen` and `ttl_days` in the decoded feed: an IOC without an age is a rumor, and stale indicators alert you about yesterday\'s attacker.',
          'Notice the `allowlist` array: one wrong entry can suppress a real C2 channel forever — which is why allowlist changes deserve the same review as detection rules.',
          'Notice the confidence field: high-confidence IOCs deserve blocking, medium ones deserve enrichment before anyone pages a human.'
        ],
        explanationMarkdown: `
### The Mental Model: Intelligence vs Information

A newspaper is information. A tip that a specific van will be at a specific corner at a specific hour is intelligence — because it changes what you were about to do. Threat intel earns the word "intelligence" only when it is actionable: it must alter a block, a hunt, or a detection you can actually deploy.

### The IOC Half-Life

Indicators rot. Domains are registered and abandoned within days. Payload hashes are mutated per victim. IP infrastructure is leased and swapped. So every IOC needs two companions: an age and a confidence.

- **Fresh and high confidence** — block or alert on it now.
- **Fresh and low confidence** — enrich it and watch for corroboration.
- **Stale (past TTL)** — archive it. Keep it for historical hunts, but do not page a human at 3 AM about it.

### Enrichment and the Allowlist Trap

Enrichment attaches the context that makes an indicator decidable: who registered the domain, which ASN hosts it, what a sandbox saw, when it was last spotted. In a good SOC, alerts arrive pre-enriched — otherwise Tier 1 re-derives the same context four hundred times a shift.

The allowlist is the quiet danger. The cache you just decoded carries one: every domain on it is invisible to detection, forever, until someone removes it. Treat allowlist edits like production code changes, with an owner and an expiry.

> **The Habit to Build:** Ask of every indicator: "what decision does this change, how old is it, and who would it annoy if I blocked it?" If it changes nothing, it is not intelligence — it is inventory.
        `,
        devTakeaway: 'Ship intel with age, confidence, and provenance attached, and keep transport encoding out of the security story — base64 wrapping is packaging, not protection.',
        securityTakeaway: 'Indicators rot: act on fresh, high-confidence IOCs, enrich the ambiguous ones, and audit allowlists as carefully as you audit firewall rules.',
        challenge: {
          id: 'chal-6-6',
          type: 'decode',
          prompt: 'Decode the cached feed blob from the discovery panel above (paste it into the decoder), then type the high-confidence C2 domain stored in it — exactly as its "value" field reads.',
          targetHint: 'The decoded JSON has an "iocs" array; the domain entry is the one with confidence "high" and the tag "c2".',
          solution: 'syncpulse-analytics.net',
          successMessage: 'Decoded — the relay was sitting on a high-confidence C2 domain all along. Base64 wrapping hid it from casual eyes and from no one else.',
          explanation: 'Feeds ship base64-wrapped for transport hygiene, never for secrecy — anyone between the relay and your SIEM can read it in one click. The real security work is the metadata around the value: age, confidence, and whether your detections actually use it.'
        },
        simulatedTarget: {
          appName: 'Intel Feed Relay — Cache Browser',
          targetUrl: 'https://intel.corp.local/relay/cache',
          description: 'Local cache of the last wrapped intel batch; IOC values stay inside the wrapped blob.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono text-xs">
  <h2 class="font-bold mb-2">Relay Cache — batch 2026-03-02T04:15Z</h2>
  <p class="text-slate-400">Batches arrive base64-wrapped for transport. Decode the blob (see the lesson panel) to read the IOCs inside.</p>
  <p class="mt-2 text-slate-300">ioc_count: 3 | ttl_days: 30 | producer: feed-relay-03</p>
</div>`,
          storageItems: [
            { key: 'relay_last_pull', value: '2026-03-02T04:15:00Z', type: 'localStorage' },
            { key: 'relay_ttl_days', value: '30', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/relay/batches/latest',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                batch_id: '2026-03-02T04:15Z',
                wrapped: true,
                transport: 'base64',
                ioc_count: 3,
                ttl_days: 30
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 6.7 ─────────────────────────── */
      {
        id: 'lesson-6-7',
        trackId: 'track-6',
        number: '6.7',
        title: 'Containment Playbooks',
        tagline: 'You will not win the incident at 3 AM. You buy time at 3 AM — and playbooks are how you pre-decide what "buying time" means.',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        mentalModelConcept: 'Containment is about shrinking the attacker\'s options before you fully understand what happened. Playbooks front-load the reversible actions (isolate, disable, revoke) so nobody freezes or improvises at 3 AM, and they attach the escalation comms that keep the political incident from eclipsing the technical one.',
        discoveryPrompt: 'INC-2291 is confirmed hands-on-keyboard on ENG-LAPTOP-221. Open the Simulated DevTools and read the incident runbook — it is loaded into the console from a client-side config file, so check the Sources tab. What is the VERY FIRST containment action the playbook orders?',
        discoveryComponent: 'SourcesInspectorDemo',
        noticeThisMoments: [
          'Notice that playbooks front-load *reversible* actions (isolate, disable, revoke) and reserve destructive ones (reimage) for later, once evidence is preserved.',
          'Notice that disabling a password does not end the session already issued — OAuth refresh tokens and VPN sessions must be revoked as a separate step.',
          'Notice the comms block: who may approve the trade-off, where the war room lives, and when the next executive update is due. Uncommunicated containment becomes a second incident.'
        ],
        explanationMarkdown: `
### The Mental Model: Buying Time, Not Winning

Firefighters do not investigate the arson before they stop the fire. Containment exists to shrink the blast radius *while* the investigation continues — because every minute the attacker keeps hands-on-keyboard, the evidence you want keeps changing.

The core trade-off: containment is disruptive, so the decision needs to be pre-authorized, not improvised. That is what a playbook is for — the argument about whether to pull the plug happens in a review room weeks earlier, not at 03:07.

### The Standard First Moves, In Order

1. **Isolate the host** — network quarantine via EDR or a VLAN cut, while keeping forensic console access.
2. **Disable the account** — starting with the identities the attacker demonstrably used, not every account in the directory.
3. **Revoke sessions and tokens** — passwords do not kill issued OAuth refresh tokens, API keys, or VPN sessions.
4. **Preserve evidence** — memory capture before any reimage, and write down timestamps with their timezone.

\`\`\`
03:04  confirmed hands-on-keyboard  analyst notes unknown process tree
03:07  host isolated                EDR network isolation, console kept
03:09  account disabled             svc_deploy disabled, password rotated
03:12  tokens revoked               OAuth refresh tokens invalidated tenant-wide
\`\`\`

### Escalation Comms Are Part of the Playbook

Containment breaks things: the account you disable at 03:09 may belong to a batch job that feeds payroll. The runbook therefore names, in advance, the incident commander who can approve that trade-off, the channel the war room lives in, and what executives hear first: facts, business impact, and the time of the next update.

> **The Habit to Build:** Rehearse containment while nothing is on fire. The worst possible moment to discover your EDR cannot isolate servers is during a ransomware event.
        `,
        devTakeaway: 'Pre-build the containment tooling itself — EDR isolation APIs, token revocation endpoints, account-disable runbooks — and rehearse them. A playbook that only exists as a document fails at 3 AM.',
        securityTakeaway: 'Containment buys time: isolate, disable, revoke — reversible steps first, evidence preserved, communications attached, and decisions written down while they are being made.',
        challenge: {
          id: 'chal-6-7',
          type: 'triage',
          prompt: 'Read the incident runbook in the Simulated DevTools (Sources tab — the config file the console loads). Type the FIRST containment action the playbook orders for a confirmed compromised workstation: the verb that means "pull the machine off the network while keeping forensics".',
          targetHint: 'Select the runbook .js file in the Sources tab and look at window.RUNBOOK.steps[0] — the "action" field.',
          solution: (input: string) => /isolat/i.test(String(input ?? '')),
          successMessage: 'Step 1: isolate host. Network first, questions later — every minute of attacker connectivity is a minute of evidence mutation and lateral spread.',
          explanation: 'Order matters. Isolation before account actions cuts the attacker off from remote control; disabling the account first can trigger a destructive "break glass" response from a hands-on operator. Reversible steps, then evidence, then restoration.'
        },
        simulatedTarget: {
          appName: 'IR Console — Incident INC-2291',
          targetUrl: 'https://ir.corp.local/incidents/INC-2291',
          description: 'Live incident console; the containment runbook is loaded from a client-side config file.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-sans text-xs">
  <h2 class="font-bold text-sm mb-2">INC-2291 — ENG-LAPTOP-221 (hands-on-keyboard)</h2>
  <p class="text-slate-400 mb-3">Runbook steps load from runbook.config.js — use the Sources tab to read the real thing.</p>
  <div class="p-2 bg-slate-950 border border-slate-800 rounded mb-1">Step 1: [loaded from bundle]</div>
  <div class="p-2 bg-slate-950 border border-slate-800 rounded mb-1">Step 2: [loaded from bundle]</div>
  <div class="p-2 bg-slate-950 border border-slate-800 rounded mb-1">Step 3: [loaded from bundle]</div>
</div>`,
          storageItems: [
            { key: 'ir_mode', value: 'live-fire', type: 'localStorage' },
            { key: 'ir_shift', value: 'night-b', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/assets/js/runbook.config.js',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-cache' },
              response: `// IR Console client runbook bundle (reviewed + versioned, like all detection assets)
window.RUNBOOK = {
  incident: "INC-2291",
  hands_on_keyboard: true,
  steps: [
    { order: 1, action: "isolate host", tool: "EDR network isolation", reversible: true, approver: "incident_commander" },
    { order: 2, action: "disable account", tool: "IDP admin console", reversible: true, approver: "incident_commander" },
    { order: 3, action: "revoke sessions", tool: "OAuth refresh token revocation", reversible: true },
    { order: 4, action: "preserve evidence", tool: "memory capture before reimage", reversible: false }
  ],
  comms: { war_room: "#ir-live", page: "oncall-ir", exec_update_minutes: 30 }
};`
            },
            {
              url: '/api/ir/containment/preview',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: { host: 'ENG-LAPTOP-221' },
              response: {
                host: 'ENG-LAPTOP-221',
                edr_status: 'online',
                actions_available: ['isolate host', 'disable account', 'revoke sessions'],
                requires_approval: 'incident_commander'
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 6.8 ─────────────────────────── */
      {
        id: 'lesson-6-8',
        trackId: 'track-6',
        number: '6.8',
        title: 'Hunting the Silent Threat',
        tagline: 'Alerts answer questions someone thought to ask. Hunting starts where the rule author ran out of imagination.',
        estimatedMinutes: 12,
        difficulty: 'Advanced',
        mentalModelConcept: 'Hunting is hypothesis-driven: imagine the trace an attacker cannot avoid leaving, then go look for exactly that trace across time and log sources. A hunt ends with a written verdict — including "no evidence found" — and a timeline, because a story has sequence and an anomaly list does not.',
        discoveryPrompt: 'No alert fired for ENG-LAPTOP-221 — yet the EDR recorded its outbound requests anyway. Open the Simulated DevTools Network tab and page through the traffic: one destination keeps appearing on a timer. Type the hostname it beacons to.',
        discoveryComponent: 'NetworkInspectorDemo',
        noticeThisMoments: [
          'Notice *regularity*: human traffic is bursty and irregular, while machine traffic ticks like a metronome — 60s, 60s, 60s, with barely any jitter.',
          'Notice that TLS does not hide the destination: SNI and DNS names tell you who is being contacted without decrypting a single byte.',
          'Notice that "no alert fired" describes your coverage, not the attacker\'s behavior — the absence of an alert is a question, not an answer.'
        ],
        explanationMarkdown: `
### The Mental Model: Fishing Where the Fish Aren't Stocked

Rules fish in known ponds. A hunt asks a sharper question: where would an attacker *have* to swim, even if they were careful?

They must resolve a name (DNS), retrieve tooling (HTTP), keep a channel alive (beacon), and move with credentials (authentication logs). Each requirement leaves a different witness, and no amount of discipline removes all of them — only slows them down.

### Hypothesis-Driven Hunting

1. **Hypothesis:** "A phishing document landed on this laptop and established a quiet channel."
2. **Evidence needed:** Office-spawned shells, first-seen domains from the host, off-hours authentication by its user, new scheduled tasks.
3. **Timeline:** rebuild the events *in order*. A story has sequence: execution, then callback, then logon. An unordered anomaly list cannot tell you who learned what, when.
4. **Verdict:** write it down — including "no evidence found". A negative hunt is not wasted work; it is the knowledge that lets the next hunt start higher up the hill.

\`\`\`
02:42  process  WINWORD -> powershell -enc ...
02:44  dns      first-seen domain resolves to 45.129.98.7
02:47  auth     RDP Administrator from 45.129.98.7
\`\`\`

### Why This Host, Of All Hosts

Hypotheses also come from data: this laptop belonged to the mailbox that received the lookalike-domain email, it skipped last month's EDR policy upgrade, and its user has domain-admin rights nobody has revisited since a project in 2024. Choosing *where* to hunt is half the skill.

> **The Habit to Build:** "The alert did not fire" is a question, not an answer. Hunt the gap between what your detections cover and what an attacker can do anyway — and write the timeline, not just the findings.
        `,
        devTakeaway: 'Make beacon-hunting cheap for future you: log DNS and TLS SNI with timestamps precise enough to measure intervals, and keep enough retention to look 60 days back.',
        securityTakeaway: 'Hunt from a hypothesis, not from a hunch: pick the trace the attacker cannot avoid, correlate it across sources, and reconstruct the timeline in order.',
        challenge: {
          id: 'chal-6-8',
          type: 'inspect',
          prompt: 'Walk the recorded requests in the Simulated DevTools Network tab and find the hostname that repeats on a ~60-second timer. Type the beacon domain exactly as it appears in the request URLs.',
          targetHint: 'Several GET requests share one hostname and differ only in their ?t= timestamp parameter — the regularity is the tell.',
          solution: 'syncpulse-analytics.net',
          successMessage: 'Beacon found — six callbacks, ~60 seconds apart, to the exact domain your intel cache flagged in the previous lesson. The rule never fired; the evidence was there anyway.',
          explanation: 'Beaconing is the trace attackers cannot avoid: persistence requires communication, and communication at fixed intervals is statistics, not style. Correlate it with DNS first-seen data and the login logs, and the "quiet" host writes its own confession.'
        },
        simulatedTarget: {
          appName: 'EDR Network Telemetry — ENG-LAPTOP-221',
          targetUrl: 'https://edr.corp.local/hosts/ENG-LAPTOP-221/network',
          description: 'Recorded outbound requests for a host that generated zero alerts.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-sans text-xs">
  <h2 class="font-bold text-sm mb-2">ENG-LAPTOP-221 — network telemetry</h2>
  <p class="text-slate-400">EDR policy: standard | Alerts fired: 0 | Last full scan: 2026-02-27</p>
  <p class="text-slate-500 mt-2">Hunts start where alerts end: read the recorded requests in the Network tab.</p>
</div>`,
          storageItems: [
            { key: 'edr_policy', value: 'standard', type: 'localStorage' },
            { key: 'last_full_scan', value: '2026-02-27', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: 'https://syncpulse-analytics.net/px.gif?sid=8f21c&t=024410',
              method: 'GET',
              status: 200,
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) SyncPulseUpdater/1.4', 'X-Client-Id': 'ENG-LAPTOP-221' },
              response: '<1x1 transparent gif>'
            },
            {
              url: 'https://syncpulse-analytics.net/px.gif?sid=8f21c&t=024511',
              method: 'GET',
              status: 200,
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) SyncPulseUpdater/1.4', 'X-Client-Id': 'ENG-LAPTOP-221' },
              response: '<1x1 transparent gif>'
            },
            {
              url: 'https://syncpulse-analytics.net/px.gif?sid=8f21c&t=024609',
              method: 'GET',
              status: 200,
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) SyncPulseUpdater/1.4', 'X-Client-Id': 'ENG-LAPTOP-221' },
              response: '<1x1 transparent gif>'
            },
            {
              url: 'https://syncpulse-analytics.net/px.gif?sid=8f21c&t=024712',
              method: 'GET',
              status: 200,
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) SyncPulseUpdater/1.4', 'X-Client-Id': 'ENG-LAPTOP-221' },
              response: '<1x1 transparent gif>'
            },
            {
              url: 'https://syncpulse-analytics.net/px.gif?sid=8f21c&t=024810',
              method: 'GET',
              status: 200,
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) SyncPulseUpdater/1.4', 'X-Client-Id': 'ENG-LAPTOP-221' },
              response: '<1x1 transparent gif>'
            },
            {
              url: 'https://syncpulse-analytics.net/px.gif?sid=8f21c&t=024911',
              method: 'GET',
              status: 200,
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) SyncPulseUpdater/1.4', 'X-Client-Id': 'ENG-LAPTOP-221' },
              response: '<1x1 transparent gif>'
            },
            {
              url: 'https://app.vendor-cdn.com/api/config',
              method: 'GET',
              status: 200,
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)' },
              response: { poll_minutes: 360, note: 'legitimate updater, irregular schedule' }
            },
            {
              url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: 'grant_type=refresh_token&client_id=office-desktop',
              response: { token_type: 'Bearer', expires_in: 3600 }
            },
            {
              url: 'https://slack.com/api/rtm.connect',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: { token: 'redacted' },
              response: { ok: true }
            }
          ]
        }
      },

      /* ─────────────────────────── 6.9 ─────────────────────────── */
      {
        id: 'lesson-6-9',
        trackId: 'track-6',
        number: '6.9',
        title: 'Phishing Triage at Speed',
        tagline: 'Four minutes, three gates: headers first, URLs second, attachments third. The prose is the last thing you read, not the first.',
        estimatedMinutes: 10,
        difficulty: 'Advanced',
        mentalModelConcept: 'Phishing triage is a funnel under a clock. Kill fakes with machine-verifiable facts in the fastest order: transport headers (SPF/DKIM/DMARC, Received chain), then URL verdicts on the final registrable domain, then attachment detonation — and always measure blast radius, because one mailbox and forty thousand mailboxes are different emergencies.',
        discoveryPrompt: 'A user reported a message at 09:41 and the four-minute clock is running. The gateway has preserved the raw message — open the Simulated DevTools Elements tab and start where the machines already did: the Authentication-Results header. What verdict did SPF receive? Type it exactly as written.',
        discoveryComponent: 'DevToolsInspection',
        noticeThisMoments: [
          'Notice Authentication-Results: SPF, DKIM, and DMARC are machine-checked verdicts sitting above the emotional parts of the email.',
          'Notice display-name spoofing: "IT Helpdesk" is decoration — the domain in the From address is the identity, and it is not your domain.',
          'Notice the Received chain: the top-most Received line tells you where the message truly entered from, regardless of what the body claims.'
        ],
        explanationMarkdown: `
### The Mental Model: Four Minutes, Three Gates

Phishing triage is not literary criticism of an email. It is checking machine-verifiable facts in the order that kills fakes fastest — because every mailbox that received the message is still waiting on your verdict. The clock is what forces the funnel: you are not judging one message, you are scoping an incident that may already be in fifty thousand mailboxes.

### The Funnel

1. **Headers, in seconds:** the SPF/DKIM/DMARC verdicts, the real sending IP, the Received chain, the registrable domain of the sender.
2. **URLs, under a minute:** expand redirects and judge the *final* destination. A link to a bank means nothing if it redirects to a domain registered eleven days ago.
3. **Attachment detonation, in minutes:** check the hash first (known-good software is known-good), then sandbox it. Excel spawning encoded PowerShell is the same shape you found in the log hunt — the payload simply moved from the endpoint to the inbox.
4. **Verdict plus blast radius:** was this delivered to one mailbox or forty thousand? Did anyone click? Containment scope comes from the delivery logs, not from the email's content.

\`\`\`
Authentication-Results: mx.example.com;
    spf=fail smtp.mailfrom=payrol1-secure.com;
    dkim=none header.d=payrol1-secure.com;
    dmarc=fail header.from=example.com
\`\`\`

A \`spf=fail\` on a message that claims to be from *your own* payroll helpdesk is not a discussion: the message is forged, the links are bait, and the only remaining question is who else received it.

### The Verdict, In Writing

A triage verdict with no ticket is a rumor with confidence. The note carries the evidence that made the call — the failing header, the final redirect target, the detonation verdict — plus the blast radius from the delivery logs and the list of clicked users if the gateway tracks them. Write it so the analyst who handles reply #400 tomorrow can skip your first three minutes of work entirely.

> **The Habit to Build:** Decide from headers and infrastructure first, prose last. Attackers write believable prose; they cannot as easily repair the transport record the receiving server stamped on the message.
        `,
        devTakeaway: 'Publish authentication results at the gateway and rewrite URLs so verdicts are a lookup, not a debate — and detonate attachments before delivery, not after the click.',
        securityTakeaway: 'Triage headers before prose: transport facts (SPF, Received hops, domain age) kill fakes faster than reading ever will — then measure blast radius from delivery logs.',
        challenge: {
          id: 'chal-6-9',
          type: 'triage',
          prompt: 'The four-minute clock is running. Read the raw message in the Simulated DevTools (Elements tab) and type the SPF verdict exactly as it appears in the Authentication-Results header (format spf=...).',
          targetHint: 'Search the raw message for "Authentication-Results" — the first line beneath it is the SPF verdict.',
          solution: 'spf=fail',
          successMessage: 'spf=fail — the envelope sender domain is payrol1-secure.com, not your domain, so the "IT Helpdesk" From address is a costume. Verdict: forged, deliver-blocking, hunt the delivery logs.',
          explanation: 'SPF checks whether the sending IP is allowed to speak for the envelope domain; DKIM checks a signature over the headers; DMARC aligns the two with the visible From domain. Any one of them failing loudly is faster evidence than any sentence in the email body.'
        },
        simulatedTarget: {
          appName: 'MailGuard Gateway — Raw Message 88213',
          targetUrl: 'https://mailgw.corp.local/queue/msg-88213',
          description: 'Quarantined message under triage; headers preserved verbatim.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono text-xs">
  <h2 class="font-bold mb-2">Message 88213 — reported by user (09:41)</h2>
  <pre class="p-3 bg-slate-950 border border-slate-800 rounded text-slate-300 overflow-x-auto whitespace-pre-wrap">Received: from mail.payrol1-secure.com (mail.payrol1-secure.com [185.244.21.7])
    by mx.example.com with ESMTPS id 4Yx2Qk1nPv;
    Mon, 02 Mar 2026 09:41:02 +0000
Return-Path: <bounce@payrol1-secure.com>
From: "IT Helpdesk" <helpdesk@example.com>
To: "Finance Distribution" <finance-all@example.com>
Subject: ACTION REQUIRED: March payroll discrepancy
Authentication-Results: mx.example.com;
    spf=fail smtp.mailfrom=payrol1-secure.com;
    dkim=none header.d=payrol1-secure.com;
    dmarc=fail header.from=example.com
Message-ID: <2f91c4e7@payrol1-secure.com>
X-Gateway-Verdict: suspicious-link</pre>
  <p class="text-slate-400 mt-2">Attachment: payroll_adjust.xlsm (detonation pending) | Link: hxxps://payrol1-secure[.]com/verify</p>
</div>`,
          storageItems: [
            { key: 'gw_policy', value: 'strict', type: 'localStorage' },
            { key: 'gw_triage_clock', value: '4m', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: 'https://urlscan.example/api/resolve?u=hxxps://payrol1-secure.com/verify',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                final_domain: 'payrol1-secure.com',
                registrable_domain: 'payrol1-secure.com',
                domain_age_days: 11,
                redirects: 0,
                verdict: 'suspicious'
              }
            },
            {
              url: '/api/gateway/detonate',
              method: 'POST',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: { attachment: 'payroll_adjust.xlsm' },
              response: {
                verdict: 'malicious',
                behaviors: ['Excel spawns powershell.exe -nop -w hidden -enc ...', 'reads Outlook address book'],
                sandbox: 'detonator-02'
              }
            }
          ]
        }
      },

      /* ─────────────────────────── 6.10 ─────────────────────────── */
      {
        id: 'lesson-6-10',
        trackId: 'track-6',
        number: '6.10',
        title: 'Metrics & Handovers',
        tagline: 'What a SOC measures is what a SOC becomes — and the handover note is where measurement meets memory.',
        estimatedMinutes: 8,
        difficulty: 'Advanced',
        mentalModelConcept: 'Metrics are steering, not scoring. MTTD measures your coverage, MTTR measures your playbooks and staffing, and naive targets (alerts closed per hour) invite gaming — Goodhart\'s Law in a ticket queue. The shift handover is the artifact that carries all of it forward.',
        discoveryPrompt: 'It is 06:00 and the handover note is due. Open the Simulated DevTools and read last night\'s handover payload in the Network tab: incident INC-2291 was first detected at 02:14 and contained at 02:52. Leadership wants the incident\'s MTTR in minutes on the note — do the arithmetic and type the number.',
        discoveryComponent: 'DevToolsInspection',
        noticeThisMoments: [
          'Notice the difference between MTTD and MTTR: catching an attack in two minutes and responding in two hours still loses to an attacker who works for three.',
          'Notice Goodhart\'s Law in a ticket queue: measure "alerts closed per hour" and you will get fast closes, not safe systems.',
          'Notice what a handover note must carry: open incidents, hypotheses, decisions taken and skipped, and explicit watch-items for the next shift.'
        ],
        explanationMarkdown: `
### The Mental Model: The SOC As a Feedback System

A SOC that cannot describe itself cannot improve itself. Two numbers anchor everything:

- **MTTD (mean time to detect):** attacker action -> your first *true* alert. It measures coverage and log quality.
- **MTTR (mean time to respond / contain):** first true alert -> containment applied. It measures playbooks, staffing, and authority.

\`\`\`
02:14  first true alert     (detection)
02:22  escalated to Tier 2  (analyst judgment)
02:52  host isolated        (containment)
MTTR for INC-2291 = 02:52 - 02:14 = 38 minutes
\`\`\`

Note what the arithmetic leaves out: a rolling seven-day *average* MTTR is a different number from this incident's MTTR, and leadership will ask for both. Copying the wrong one into the note is how dashboards quietly become fiction.

### The Metrics That Survive Contact With Reality

1. **Detection quality:** precision per rule, coverage of priority techniques, mute rates.
2. **Response:** MTTR by severity, percentage of incidents contained within SLA.
3. **Workload sanity:** alerts per analyst-hour, backlog age, overtime.
4. **Avoid pure volume targets:** "tickets closed" measures motion, not safety. What you measure is what you get — including the behavior you did not want.

### The Handover Note

A handover is a compressed state transfer to a colleague who is smart, uninformed, and tired: open incidents with their current hypothesis, actions taken and their observed effects, decisions deliberately *not* taken and why, and the explicit watch-items ("if ALT-4473 recurs, do not wait for enrichment — isolate"). If the oncoming analyst must re-derive your context from scratch, the handover failed.

> **The Habit to Build:** Write the handover before you leave, while the night is still fresh, for the one reader who was not in the room. Future you is that reader.
        `,
        devTakeaway: 'Instrument the SOC itself: record detect-to-contain intervals per incident and rule-level precision, so improvement is a graph instead of an argument.',
        securityTakeaway: 'Metrics shape behavior: closed-ticket counts breed hasty closes, while MTTD, MTTR, and ticket quality reveal whether you actually kept the business safe.',
        challenge: {
          id: 'chal-6-10',
          type: 'inspect',
          prompt: 'Read last night\'s handover payload in the Simulated DevTools (Network tab -> GET /api/metrics/handover -> Response). Incident INC-2291 was first detected at 02:14 and contained at 02:52. Type its MTTR in minutes (digits only).',
          targetHint: 'MTTR = containment time minus detection time. Do not copy the rolling-average KPI — that number describes the week, not this incident.',
          solution: (input: string) => {
            const m = String(input ?? '').match(/\d+/);
            return !!m && Number(m[0]) === 38;
          },
          successMessage: '38 minutes — detection to containment, not the 41-minute weekly average. The handover note now says what actually happened last night.',
          explanation: 'This is why SOC math is written with timestamps, not adjectives. An incident MTTR of 38 minutes against a weekly average of 41 tells the oncoming shift the night went roughly to plan — and gives leadership a trend instead of a vibe.'
        },
        simulatedTarget: {
          appName: 'Shift Handover Dashboard',
          targetUrl: 'https://soc.corp.local/handover/2026-03-02',
          description: 'End-of-shift metrics and open incident state for the oncoming team.',
          htmlSource: `<div class="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-sans text-xs">
  <h2 class="font-bold text-sm mb-2">Handover — night shift 2026-03-02</h2>
  <div class="grid grid-cols-3 gap-2 mb-3">
    <div class="p-2 bg-slate-950 border border-slate-800 rounded">MTTD (7d avg): 6m</div>
    <div class="p-2 bg-slate-950 border border-slate-800 rounded">MTTR (7d avg): 41m</div>
    <div class="p-2 bg-slate-950 border border-slate-800 rounded">Open incidents: 1</div>
  </div>
  <div class="p-2 bg-slate-950 border border-amber-800 rounded">INC-2291 (ENG-LAPTOP-221): detected 02:14, escalated 02:22, contained 02:52 — hand over to Tier 2 day shift</div>
</div>`,
          storageItems: [
            { key: 'handover_draft', value: '1 open incident, INC-2291 contained', type: 'localStorage' },
            { key: 'shift_end', value: '06:00', type: 'cookie' }
          ],
          networkRequests: [
            {
              url: '/api/metrics/handover?shift=2026-03-02',
              method: 'GET',
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              response: {
                shift: '2026-03-02-night',
                kpis: {
                  mttd_7d_avg_min: 6,
                  mttr_7d_avg_min: 41,
                  alerts_closed: 214,
                  alerts_per_analyst_hour: 9
                },
                incidents: [
                  {
                    id: 'INC-2291',
                    host: 'ENG-LAPTOP-221',
                    detected_at: '02:14',
                    escalated_at: '02:22',
                    contained_at: '02:52',
                    status: 'contained',
                    handover_to: 'tier2-day'
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
