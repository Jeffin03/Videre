export interface WikiSection {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  content: string[];
  keyTakeaways?: string[];
  quotes?: string[];
}

export const VIDERE_WIKI: WikiSection[] = [
  {
    id: 'problem',
    title: "The Problem We're Solving",
    subtitle: "Why traditional security education falls flat for most people",
    badge: "The Motivation",
    content: [
      "Here's the honest observation that sparked this whole thing: most members of a cybersecurity society aren't actually engaging with the material. When recon techniques or network scanning comes up in a session, a good chunk of the room goes quiet — not because they aren't smart, but because they've never built the mental foundation that makes any of it click.",
      "Platforms like HackTheBox and TryHackMe are great, but they assume you already have a working mental model of how systems behave. They drop you into a challenge and expect you to pull a thread. If you've never been taught to notice that there's a thread to pull, you'll just stare at the screen.",
      "That gap — between someone who knows what security is and someone who can actually think like an attacker or a security-aware developer — is what this platform is designed to close.",
      "The audience isn't just the security enthusiasts. It's everyone: the developer who's never thought about what their login form leaks, the designer who doesn't know what's sitting in the browser's local storage, the person who joined the cybersecurity society because it sounded interesting but has never opened DevTools in their life. This platform meets all of them where they are."
    ],
    keyTakeaways: [
      "Zero prior assumptions: We don't assume you know Linux, networking, or how cookies work.",
      "Root cause over symptom: People don't freeze because security is too hard; they freeze because they don't know what 'normal' looks like.",
      "Universal relevance: Every software engineer, product builder, and designer needs this instinct."
    ]
  },
  {
    id: 'philosophy',
    title: "The Core Philosophy",
    subtitle: "Discovery first, explanation second. Recognition over technique.",
    badge: "Pedagogy",
    content: [
      "There's a meaningful difference between teaching tools and building intuition. A lot of security education gets this backwards — it teaches you how to run a command before you understand what you're looking for, or explains XSS with a definition before you've ever looked at what a browser actually renders.",
      "This platform flips that. Every concept is introduced through discovery first, explanation second. Before we tell someone what Base64 is, we hand them an encoded string that looks like gibberish, give them a decode button, and let them watch it become readable text. The moment of 'oh, this isn't actually encrypted at all' lands differently when you experience it than when you read it.",
      "The secondary philosophy is this: recognition is more valuable than technique. Someone who can run an SQLi payload but doesn't know when to look for injection points isn't that useful. Someone who looks at a URL parameter with a numeric ID and thinks 'I wonder if that validates server-side' — that instinct is what we're trying to grow. Every lesson, every interactive moment, every guided exercise builds that habit of noticing."
    ],
    quotes: [
      "The moment of 'oh, this isn't actually encrypted at all' lands differently when you experience it than when you read it.",
      "Recognition is more valuable than technique. Someone who looks at a numeric ID in a URL and questions server-side authorization already has the instinct."
    ],
    keyTakeaways: [
      "Discovery First: Touch the anomaly before reading the formal name.",
      "Recognition > Technique: Finding where systems are fragile matters 10x more than memorizing exploit scripts.",
      "The Habit of Noticing: Training your eyes to spot the unvalidated parameter, the leaked token, or the trust assumption."
    ]
  },
  {
    id: 'what-it-is',
    title: "What This Platform Is (and Isn't)",
    subtitle: "Defining the boundaries and clear mission of Videre",
    badge: "Boundaries",
    content: [
      "To build something truly effective, we must be brutally honest about what Videre is designed to do, and what it leaves to subsequent stages of training."
    ],
    keyTakeaways: [
      "WHAT IT IS: A structured, interactive learning environment for security literacy.",
      "WHAT IT IS: A foundation that prepares members to get real value out of HTB, THM, and eventually bug bounty platforms.",
      "WHAT IT IS: A resource built for developers and non-security people just as much as aspiring security researchers.",
      "WHAT IT IS: A bridge between 'I know what cybersecurity is' and 'I can actually think about security.'",
      "WHAT IT IS NOT: A CTF hosting platform (we have HTB and THM for that).",
      "WHAT IT IS NOT: A tool for exploitation or active attacks.",
      "WHAT IT IS NOT: Exclusively for security majors or people already in the field.",
      "WHAT IT IS NOT: A static collection of slides or reading material."
    ]
  },
  {
    id: 'ctf-vs-bugbounty',
    title: "The CTF and Bug Bounty Connection",
    subtitle: "The crucial mindset shift between gamified flags and real-world systems",
    badge: "Mindset Transition",
    content: [
      "This platform sits at the foundation of a larger learning pipeline. Once a student finishes the Foundations path, they have what HTB and THM assume you already have — a working mental model of how web systems expose themselves, and the habit of noticing things that deserve a second look.",
      "There's a distinction worth understanding that shapes how we'll eventually design our own HTB/THM rooms for the society:",
      "CTF mindset: Something is hidden. The challenge structure implies something exists. You work with hints and known boundaries to find the flag.",
      "Bug bounty mindset: Here is a system. There are no hints. You need to understand it well enough to find what the developer didn't think about. Severity is your responsibility to assess.",
      "The second one requires systems thinking, not just tool proficiency. That systems thinking is exactly what the Foundations path builds, and what the GRC, SOC, and Bug Bounty paths extend into professional practice. Every 'notice this' moment in the platform is training the same instinct you need when there's no flag to confirm you're on the right track.",
      "When we design HTB/THM rooms for the society, the good ones will ask students not just to find the vulnerability, but to classify it and explain it — what type of issue is it, what's the real-world impact, and what would a bug bounty report for this look like. That's the bridge between CTF and bug bounty thinking, and this platform is what prepares someone to walk across it."
    ],
    quotes: [
      "In a CTF, you hunt for a predetermined flag. In bug bounty, you hunt for the developer's unexamined assumptions."
    ],
    keyTakeaways: [
      "CTF trains puzzle solving; Bug Bounty trains systems comprehension.",
      "Real-world security requires classifying severity and communicating business impact, not just popping a shell.",
      "Videre acts as the on-ramp: you graduate with the eyes to see what rooms are asking of you."
    ]
  },
  {
    id: 'contributing',
    title: "Society Contributor Guide",
    subtitle: "How society members and developers can write new modules and expand tracks",
    badge: "Open Community",
    content: [
      "Videre is designed to be content-first and community-extensible. The most important quality of our codebase is that lessons and interactive moments can be authored by any society member who knows a bit of markdown and JSON.",
      "To add a new lesson to an existing track:",
      "1. Open the track's data file in `src/data/` (`tracks.ts` holds the Foundations tracks; `trackGrc.ts`, `trackSoc.ts`, and `trackBugBounty.ts` hold the career paths) and locate the relevant track array.",
      "2. Define the 'discovery moment' first: what does the student touch or see *before* they understand what it's called?",
      "3. Provide at least two 'Notice This' callouts highlighting subtle browser or network artifacts.",
      "4. Include dual takeaways: one for the builder (how to prevent it in production) and one for the investigator (what question to ask yourself next time you see this pattern).",
      "5. Pair it with an interactive challenge or simulated DevTools scenario so students practice immediately."
    ],
    keyTakeaways: [
      "Every lesson must start with an anomaly, not a definition.",
      "Never teach an exploit without teaching the defensive fix.",
      "Celebrate the 'aha!' moment of demystification."
    ]
  }
];
