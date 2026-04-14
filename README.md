# Videre

> *From Latin — "to see."*
> Because security doesn't start with tools. It starts with learning to see what was always there.

A Security Literacy platform built for the cybersecurity society at our department designed to give members (and anyone else, really) the foundational mental model they need before diving into CTFs, bug bounties, or security research.
 
---
 
## What This Is
 
Most security learning platforms drop you into challenges and assume you already know how to think. This one takes a step back. It's structured to build intuition first: how systems expose themselves, what encoding and encryption actually mean, where to look on a web application, and how to read code for red flags.
 
The goal isn't to produce CTF grinders. It's to produce people who notice things.
 
---
 
## Learning Tracks
 
| Track | Topic |
|---|---|
| 1 | The Browser as a Security Tool |
| 2 | Encoding, Encryption, and Hashing |
| 3 | Mapping the Attack Surface |
| 4 | Static Analysis Basics |
 
Each track is built around interactive lessons — not just reading, but hands-on exploration at every step.
 
---
 
## Stack
 
- **Frontend** — Next.js + Tailwind CSS + shadcn/ui
- **Content** — MDX (lessons as files, interactive React components embedded inline)
- **Auth + DB** — Supabase
- **Deployment** — Vercel
 
---
 
## Getting Started
 
```bash
git clone https://github.com/your-org/platform.git
cd platform
npm install
cp .env.example .env.local   # fill in your Supabase credentials
npm run dev
```
 
---
 
## Contributing
 
Lessons live in `/content` as MDX files. If you want to add or improve a lesson, that's the place to start. Check the wiki for content writing guidelines before you do.
 
---
 
## Wiki
 
The full vision, architecture breakdown, and build plan lives in the [Recon Notes](../../wiki) wiki page.
 
---
 
## Related Projects
 
- [CyberChef Recreation](#) — the encoding tool that powers Track 2's interactive widgets
 
