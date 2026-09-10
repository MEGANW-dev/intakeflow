import { readFile } from "node:fs/promises";
import  path from "node:path";

type Urgency = "immediate" | "this_month" | "exploring";

type Industry = 
| "personal_injury_law"
| "hvac"
| "dental"
| "med_spa"
| "remodeling"
| "other";

interface Lead {
    id: string;
    name: string;
    email: string;
    company?: string;
    industry: Industry;
    budgetUsd?: number;
    urgency: Urgency;
    message: string;
    submittedAt: string;
}

interface ScoringConfig {
    weights: { budget: number; urgency: number; industry: number; intent: number };
    thresholds: { qualified: number; nurture: number }; 
    industryFit: Record<Industry, number>;
}

    const SCORING = { 
        weights: { budget: 4, urgency: 3, industry: 2, intent:1 },
        thresholds: { qualified: 7, nurture: 4 },
        industryFit: {
            personal_injury_law: 1.0,
            hvac: 0.8,
            dental: 0.8,
            med_spa: 0.6,
            remodeling: 0.6,
            other: 0.2, 
        },
    } satisfies ScoringConfig;

    const URGENCY_SCORE: Record<Urgency, number> = {
        immediate: 1.0,
        this_month: 0.7, 
        exploring: 0.2,
    };

    function scoreBudget (budgetUsd?: number): number {
        if (budgetUsd === undefined) return 0.3;
        if (budgetUsd >= 5000) return 1.0;
        if (budgetUsd >= 2000) return 0.75;
        if (budgetUsd >= 800) return 0.4;
        return 0.1;
    }

    function scoreIntent(message: string): number {
        const signals = ["quote", "asap", "urgent", "budget", "hire", "proposal" ,"cost" , "when can"];
        const text = message.toLowerCase();
        const hits = signals.filter ((signal) => text.includes(signal)).length;
        return Math.min (hits / 3, 1);
    }

function scorelead(lead: Lead): number {
    const w = SCORING.weights;
    const raw = 
        scoreBudget(lead.budgetUsd) * w.budget +
        URGENCY_SCORE[lead.urgency] * w.urgency +
        SCORING.industryFit[lead.industry] * w.industry +
        scoreIntent(lead.message) * w.intent;


    const max = w.budget + w.urgency + w.industry + w.intent;
    return Math.round((raw / max) * 100) / 10; 
}

type Tier = "qualified" | "nurture" | "disqualified";

function tierFor(score: number): Tier {
    if (score >= SCORING.thresholds.qualified) return "qualified";
    if (score >= SCORING.thresholds.nurture) return "nurture";
    return "disqualified";
}

interface ScoredLead {
    lead: Lead;
    score: number;
    tier: Tier;
}

function formatRow(item: ScoredLead): string {
    const name = item.lead.name.padEnd(20);
    const industry = item.lead.industry.padEnd(20);
    const score = item.score.toFixed(1).padStart(5);
    const budget = item.lead.budgetUsd === undefined
        ? "unkown".padStart(9)
        : `$${item.lead.budgetUsd.toLocaleString()}`.padStart(9);
        return `${name} ${industry} ${score} ${budget} ${item.tier}`;
}


async function main(): Promise<void> {
    const filePath = path.join(process.cwd(), "data", "leads.json");
    const fileContents = await readFile(filePath, "utf8");
    const rows = JSON.parse(fileContents) as Lead[];

    const scored: ScoredLead[] = rows.map((lead) => {
        const score = scorelead(lead);
        return { lead, score, tier: tierFor(score) };
    });

    const ranked = [...scored].sort((a, b) => b.score - a.score);


    console.log("");
    console.log(`${"NAME".padEnd(20)} ${"INDUSTRY".padEnd(20)} ${"SCORE".padStart(5)}  ${"BUDGET".padStart(9)}  TIER`);
    console.log("-".repeat(78));
    for (const item of ranked) {
      console.log(formatRow(item)); 
}

const qualified = ranked.filter((item) => item.tier === "qualified");
const totalScore = ranked.reduce((sum, item) => sum + item.score, 0);
const average = totalScore / ranked.length;

console.log("-".repeat(78));
console.log(`${ranked.length} leads · ${qualified.length} qualified · average score ${average.toFixed(1)}`);
console.log("");
}

main().catch((error: unknown) => {
console.error("Scorer failed:", error);
process.exit(1);
});
