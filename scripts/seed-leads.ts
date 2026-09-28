/**
 * Seeds 5 test leads designed to probe different parts of the scoring rubric,
 * runs the real pipeline on each, and prints the results.
 *
 *   New leads:     pnpm seed
 *   Re-score only: pnpm seed -- --rescore   (after you change the prompt)
 */
import { supabaseAdmin } from "../lib/supabase/admin";
import { runPipeline } from "../lib/pipeline/run";

const ORG_SLUG = "demo-hvac";

type Fixture = {
  label: string;
  expect: string;
  full_name: string;
  email: string;
  company: string | null;
  service_wanted: string;
  budget_stated: string;
  timeline_stated: string;
  description: string;
};

const FIXTURES: Fixture[] = [
  {
    label: "1-obvious-qualified",
    expect: "qualified, 8-10, maybe urgent_opportunity",
    full_name: "Jenna Morales",
    email: "jenna.seed@example.com",
    company: null,
    service_wanted: "Furnace Repair",
    budget_stated: "5k_25k",
    timeline_stated: "asap",
    description:
      "Our furnace quit last night and the house in Old Town Fort Collins is down to 54 degrees. " +
      "We have two young kids. The unit is 22 years old and the last repair guy said it was on " +
      "borrowed time, so we want a full replacement, not another repair. Can someone come out tomorrow?",
  },
  {
    label: "2-high-budget-but-out-of-area",
    expect: "disqualified despite big budget (out_of_service_area)",
    full_name: "Rob Castellano",
    email: "rob.seed@example.com",
    company: "Castellano Logistics",
    service_wanted: "AC Installation",
    budget_stated: "25k_plus",
    timeline_stated: "1_3_months",
    description:
      "Looking for bids to replace six rooftop units on our 40,000 sq ft warehouse in Colorado Springs. " +
      "Budget is approved. Need someone who can handle commercial permitting in El Paso County.",
  },
  {
    label: "3-nurture-researching",
    expect: "nurture, 4-6",
    full_name: "Priya Shah",
    email: "priya.seed@example.com",
    company: null,
    service_wanted: "Heat Pump Installation",
    budget_stated: "not_sure",
    timeline_stated: "just_exploring",
    description:
      "We live in Windsor and are thinking about switching from gas to a heat pump sometime next year. " +
      "Mostly trying to understand what it would cost and whether the rebates are worth it.",
  },
  {
    label: "4-vague",
    expect: "low-to-mid, vague_request flag",
    full_name: "T",
    email: "t.seed@example.com",
    company: null,
    service_wanted: "Duct Cleaning",
    budget_stated: "not_sure",
    timeline_stated: "asap",
    description: "ac not working need someone asap please call",
  },
  {
    label: "5-spam-vendor",
    expect: "disqualified, possible_scam or competitor_or_vendor",
    full_name: "Growth Team",
    email: "growth.seed@example.com",
    company: "LeadRocket Marketing",
    service_wanted: "Preventative Maintenance Plan",
    budget_stated: "not_sure",
    timeline_stated: "just_exploring",
    description:
      "We help HVAC companies get 10x more booked jobs with our SEO and Google Ads packages. " +
      "Reply to this message for a free marketing audit of your website!",
  },
];

async function main() {
  const rescore = process.argv.includes("--rescore");

  const { data: org, error: orgError } = await supabaseAdmin
    .from("orgs").select("id").eq("slug", ORG_SLUG).maybeSingle();
  if (orgError) throw new Error(`org lookup failed: ${orgError.message}`);
  if (!org) throw new Error(`no org with slug ${ORG_SLUG}`);

  let ids: string[];

  if (rescore) {
    const { data, error } = await supabaseAdmin
      .from("leads").select("id")
      .eq("org_id", org.id).eq("source", "seed")
      .order("created_at", { ascending: false }).limit(FIXTURES.length);
    if (error) throw new Error(error.message);
    ids = (data ?? []).map((r) => r.id);
    console.log(`Re-scoring ${ids.length} existing seed leads...\n`);
  } else {
    ids = [];
    for (const f of FIXTURES) {
      const { label, expect, ...fields } = f;
      const { data, error } = await supabaseAdmin
        .from("leads")
        .insert({ ...fields, org_id: org.id, source: "seed", status: "received",
                  raw_payload: { fixture: label, expect } })
        .select("id").single();
      if (error || !data) throw new Error(`insert ${label} failed: ${error?.message}`);
      ids.push(data.id);
    }
    console.log(`Inserted ${ids.length} seed leads. Classifying...\n`);
  }

  // One at a time: easier to read the logs, and kind to rate limits.
  for (const id of ids) await runPipeline(id);

  const { data: results } = await supabaseAdmin
    .from("leads")
    .select("full_name, fit_score, tier, ai_flags, raw_payload")
    .in("id", ids);

  console.log("");
  console.table(
    (results ?? []).map((r) => ({
      fixture: (r.raw_payload as { fixture?: string })?.fixture ?? "",
      score: r.fit_score,
      tier: r.tier,
      flags: (r.ai_flags ?? []).join(", "),
      expected: (r.raw_payload as { expect?: string })?.expect ?? "",
    }))
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});