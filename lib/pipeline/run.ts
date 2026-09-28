import "server-only";
import { supabaseAdmin } from "../supabase/admin";
import { classify } from "../ai/classify";
import { tierFor } from "./tier";
import { persistVerdict, logRun } from "./persist"; 

type Qualification = {
    qualifiedThreshold?: number;
    nurtureThreshold?: number;
    minBudget?: number;
    servedAreas?: string[];
    disqualifiers?: string[];
};


export async function runPipeline(leadId: string): Promise<void> {
    const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads").select("*").eq("id", leadId).maybeSingle();

    if (leadError || !lead) {
      console.error("[pipeline] lead not found", leadId, leadError);
      return;
    }

    const { data: org } = await supabaseAdmin
    .from("orgs").select("id, name, industry, settings").eq("id", lead.org_id).maybeSingle();

     if (!org) {
       console.error("[pipeline] org not found for lead", leadId);
       return;
     }

     const settings = (org.settings ?? {}) as { services?: string[]; qualification?: Qualification };
     const q = settings.qualification ?? {};

     const result = await classify(lead, {
        name:           org.name,
        industry:       org.industry,
        services:       settings.services ?? [],
        servedAreas:    q.servedAreas ?? [],
        minBudget:      q.minBudget ?? 0,
        disqualifiers:  q.disqualifiers ?? [],
   });
   

    if (!result.ok) {
        console.error("[pipeline] classify failed", leadId, result.error);
        await supabaseAdmin.from("leads")
            .update({ status: "error", updated_at: new Date().toISOString() })
            .eq("id", leadId);
        await logRun(org.id, leadId, "classify", "failure", result.usage, result.error);
        return;
    }

    const tier = tierFor(result.verdict, {
        qualifiedThreshold:     q.qualifiedThreshold ?? 7,
        nurtureThreshold:       q.nurtureThreshold ?? 4,
    });

    await persistVerdict(leadId, org.id, result.verdict, tier, result.usage);
    console.log(`[pipeline] lead ${leadId} ${result.verdict.fit_score}/10 ${tier}`);
}