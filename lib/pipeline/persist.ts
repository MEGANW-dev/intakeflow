import "server-only";
import { supabaseAdmin } from "../supabase/admin";
import { BUDGET_BAND, type Verdict }  from "../ai/verdict";
import type { Tier } from "./tier";
import type { UsageInfo } from "../ai/classify";
import { ErrorBoundaryHandler } from "next/dist/client/components/error-boundary";


export async function persistVerdict (
    leadId: string,
    orgId: string, 
    verdict: Verdict,
    tier: Tier, 
    usage: UsageInfo
) {
    const { error: updateError } =  await supabaseAdmin 
    .from("leads")
    .update({
        fit_score:      verdict.fit_score,
        tier, 
        service_type:   verdict.service_type,
        urgency:        verdict.urgency,
        budget_band:    verdict.budget_band,
        ai_summary:     verdict.summary,
        ai_reasoning:   verdict.reasoning,
        ai_flags:       verdict.flags,
        ai_model:       '${usage.model}/${usage.promptVersion}', 
        status:         "classified",
        processed_at:   new Date().toISOString(),
        updated_at:     new Date().toISOString(), 
    })
    .eq("id", leadId);

if (updateError) throw new Error('persistVerdict update failed:${updateError.message}');

await logRun(orgId, leadId, "classify", "success", usage);
}


export async function logRun(
    orgId: string,
    leadId: string | null,
    step: string, 
    status: "success" | "failure" | "skipped",
    usage: UsageInfo, 
    errorText? :string 
) {
    const { error } = await supabaseAdmin.from("workflow_runs").insert({
        org_id:       orgId,
        lead_id:      leadId,
        step,
        status,
        duration_ms:  usage.durationMs,
        tokens_in:    usage.tokensIn,
        tokens_out:   usage.tokensOut,
        cost_usd:     usage.costUsd,
        error:        errorText ?? null, 
    });
    // Never let a logging failure break the pipeline.
    if (error) console.error("[pipeline] failed to log workflow_run:S", error);
}
