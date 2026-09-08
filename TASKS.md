# Day 1 — Windows (Environment & Accountability)

## T1 — Install and verify the toolchain
DONE WHEN: node -v, pnpm -v, py --version, git --version all return values,
and `ssh -T git@github.com` authenticates with no error.

## T2 — Create and fund every account
DONE WHEN: Vercel, Supabase, OpenAI (funded, $50 cap), Anthropic, Resend,
Cal.com, n8n, Beeminder, Loom all created; .env.local holds real keys and is
git-ignored; .env.local.example holds placeholders and is committed.

## T3 — Scaffold, install shadcn, and DEPLOY
DONE WHEN: a public vercel.app URL loads a page with a shadcn Button,
verified in an InPrivate window on my phone over cellular data.

## T4 — Activate all five accountability layers
DONE WHEN: Beeminder goal live with money attached, witness replied "yes" in
writing, build log post #1 public, meetup RSVP confirmed, Build Windows user
account created.

## BLOCKERS (90-minute rule — log and move on)
-

# DAY 2 — Four Atomic Tasks

Day 2 = Tue Sep 8, 2026
Deliverable: a working typed lead-scorer script + LEARNED.md with 10 entries
Gate: pnpm tsx scripts/lead-scorer.ts prints a sorted, tiered table · tsc --noEmit shows zero errors · LEARNED.md has 10 entries

---

## TASK 1 — Scaffold the files (10 min)

Done when: scripts/lead-scorer.ts, scripts/leads.json, and LEARNED.md exist, and `pnpm tsx scripts/lead-scorer.ts` runs without a "file not found" error (printing nothing is fine at this point).

---

## TASK 2 — Define the Lead type and write the data (30 min)


Done when: scoreLead returns a Tier for each lead, and Cursor shows no red squiggles under anything.

---

## TASK 3 — Read the file, score, and print the table (45 min)


Done when: pnpm tsx scripts/lead-scorer.ts prints a sorted, tiered table, and LEARNED.md has at least 5 entries.

---

## TASK 4 — Pass the gate and commit (15 min)


Done when: both gate commands pass clean, LEARNED.md has 10 entries, and the commit is pushed to GitHub.

---


pnpm tsx scripts/lead-scorer.ts prints a sorted, tiered table · pnpm tsc --noEmit shows zero errors · LEARNED.md has 10 entries