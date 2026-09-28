"use server";

import { after } from "next/server";
import { leadInputSchema } from "../../../lib/schemas/lead";
import { supabaseAdmin } from "../../../lib/supabase/admin";
import { runPipeline } from "../../../lib/pipeline/run";

export type SubmitState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function submitLead(
  _prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const raw = Object.fromEntries(formData.entries());

  // 1. Honeypot. Silent fake success. Never tell a bot it was caught.
  if (typeof raw._honey === "string" && raw._honey.trim() !== "") {
    return { ok: true, message: "Thanks, we'll be in touch." };
  }

  // 2. Timing, measured on OUR clock (a number sent by the browser could be faked).
  const renderedAt = Number(raw.renderedAt);
  const elapsedMs = Number.isFinite(renderedAt) ? Date.now() - renderedAt : 0;

  // 3. Validate. Checkboxes arrive as the string "on", so convert before parsing.
  const parsed = leadInputSchema.safeParse({
    ...raw,
    consent: raw.consent === "on",
    _elapsedMs: elapsedMs,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const d = parsed.data;

  // 4. Find the business this form belongs to. Never trust an org id from the browser.
  const { data: org, error: orgError } = await supabaseAdmin
    .from("orgs")
    .select("id")
    .eq("slug", d.orgSlug)
    .maybeSingle();

  if (orgError) {
    console.error("[submitLead] org lookup failed", d.orgSlug, orgError);
    return { ok: false, message: "Something went wrong on our end. Please try again shortly." };
  }
  if (!org) {
    return { ok: false, message: "This form is no longer active." };
  }

  // 5. Save the lead and get back its id, which the pipeline needs.
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("leads")
    .insert({
      org_id:          org.id,
      full_name:       d.fullName,
      email:           d.email,
      phone:           d.phone || null,
      company:         d.company || null,
      service_wanted:  d.serviceWanted,
      budget_stated:   d.budgetStated,
      timeline_stated: d.timelineStated,
      description:     d.description,
      source:          "web_form",
      raw_payload:     { foundVia: d.foundVia || null, elapsedMs },
      status:          "received",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("[submitLead] insert failed", insertError);
    return { ok: false, message: "Something went wrong on our end. Please email us directly." };
  }

  // 6. Run the AI AFTER the visitor gets their thank-you screen.
  //    They never wait on OpenAI.
  after(async () => {
    try {
      await runPipeline(inserted.id);
    } catch (e) {
      console.error("[pipeline] unhandled error for lead", inserted.id, e);
    }
  });

  return {
    ok: true,
    message: "We got your details and we'll be in touch within one business day.",
  };
}