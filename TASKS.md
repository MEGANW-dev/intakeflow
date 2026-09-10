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
DONE WHEN: writing, build log post #1 public, meetup RSVP confirmed

## BLOCKERS (90-minute rule — log and move on)



# Day 2 — TypeScript Fluency By Building

## T1 — Data fixture + typed shape
DONE WHEN: data/leads.json has 10 leads and scripts/lead-scorer.ts defines
Lead, Urgency, and Industry types with no compiler errors.

## T2 — Scoring pipeline that runs
DONE WHEN: `pnpm tsx scripts/lead-scorer.ts` prints all 10 leads scored,
tiered, and sorted highest score first.

## T3 — The four hard concepts
DONE WHEN: the script uses a discriminated union for Tier, a type guard,
`satisfies` on the config, and a Result<T> return type instead of throwing.
`pnpm tsc --noEmit` passes with zero errors.

## T4 — LEARNED.md
DONE WHEN: 10 entries, each 3 sentences: what it is, why it exists, where it
lands in IntakeFlow.

## BLOCKERS (90-minute rule)
-
## Day 3 — IntakeFlow Data Layer Delivery Gates (PLACEHOLDER)

## T1  — Structural Table Architecture:** 
  All 6 required relational Postgres database tables are successfully initialized, mapped, and actively visible inside your hosted Supabase cloud dashboard panel.

## T2  — Row Level Security Verification:** 
  Executing a database table select script query passing your public `anon` key returns exactly `0 rows` (proving RLS rules are active and blocking unauthorized public extraction), while executing the exact same script query passing your server-side `service-role` key bypasses RLS filters completely to return all rows.
  
## T3  — Production Variable Rendering:** 
  Your live, deployed application production URL webpage loads up securely over HTTPS and successfully fetches, parses, and visually renders your seeded database organization name on the screen.