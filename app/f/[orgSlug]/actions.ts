"use server";

import { leadInputSchema } from "../../../lib/schemas/lead";
import { supabaseAdmin } from "../../../lib/supabase/admin";

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

  // 1. Honeypot. Silent fake success — never tell a bot it was caught.
  if (typeof raw._honey === "string" && raw._honey.trim() !== "") {
    return { ok: true, message: "Thanks — we'll be in touch." };
  }

  // 2. Timing, computed on OUR clock. A client-sent number is forgeable.
  const renderedAt = Number(raw.renderedAt);
  const elapsedMs = Number.isFinite(renderedAt) ? Date.now() - renderedAt : 0;

  // 3. Validate. HTML checkboxes arrive as "on" — coerce before parsing.
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

  // 4. Resolve the tenant. Never trust a client-supplied org id.
  const { data: org, error: orgError } = await supabaseAdmin
    .from("orgs")
    .select("id")
    .eq("slug", d.orgSlug)
    .maybeSingle();

  if (orgError || !org) {
    console.error("submitLead: unknown org slug", d.orgSlug, orgError);
    return { ok: false, message: "This form is no longer active." };
  }

  // 5. Insert.
  const { error: insertError } = await supabaseAdmin.from("leads").insert({
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
  });

  if (insertError) {
    console.error("submitLead: insert failed", insertError);
    return {
      ok: false,
      message: "Something went wrong on our end. Please email us directly.",
    };
  }

  return {
    ok: true,
    message: "We got your details and we'll be in touch within one business day.",
  };
}