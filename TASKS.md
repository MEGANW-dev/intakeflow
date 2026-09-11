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

# Days 3 & 4 (compressed) — Data Layer + Intake Form
Target: Day 5 Unblock Path only. 4h15m of GATE work.

## T1 — Six tables live in production Postgres  [Day 3 GATE]
DONE WHEN: Supabase table editor shows orgs, memberships, leads,
artifacts, workflow_runs, lead_events. Migration saved as a
numbered .sql file in supabase/migrations/ and committed.

## T2 — RLS on, verified, admin client wired  [Day 3 GATE]
DONE WHEN: a select on leads with the PUBLISHABLE key returns 0 rows
and the same select with the SECRET key returns all rows.
lib/supabase/admin.ts exists and imports "server-only".

## T3 — Form renders at /f/demo-law from real org data  [Day 4 GATE]
DONE WHEN: localhost:3000/f/demo-law shows the seeded org name and a
service dropdown populated from org.settings.services.
localhost:3000/f/nope returns a 404.

## T4 — A real lead row from my phone  [Day 4 GATE]
DONE WHEN: I submit the form from my phone on cellular data and see a
new row in the production leads table with status='received'.

## DEFERRED TO DAY 6 (Saturday Finish Debt)

- RLS policies + current_user_orgs() helper  (needs auth = Day 11)
- 3-step wizard UX, progress bar, per-step validation
- IP rate limiting, disposable-email deny-list
- memberships seeding, shadcn Form + react-hook-form
- Day 2 Stage 2 + LEARNED.md  (moved to Day 5 warm-up)

## BLOCKERS (90-minute rule)
