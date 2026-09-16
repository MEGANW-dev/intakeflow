
import { notFound } from "next/navigation";
import { supabaseAdmin } from "../../../lib/supabase/admin";
import { LeadForm } from "./lead-form";

export const dynamic = "force-dynamic";

type OrgSettings = {
    brand?: { name?: string; primaryColor?: string };
    services?: string[];
};

export default async function IntakePage ({
    params,

}: {
    params: Promise<{orgSlug: string }>;
}) {
    const { orgSlug } = await params;
    
    const { data: org, error: orgError} = await supabaseAdmin
        .from("orgs")
        .select("id, slug, name, settings")
        .eq("slug", orgSlug)
        .maybeSingle();

        if (orgError) {
            console.error("[intake] org lookup failed for", orgSlug, orgError);
            throw new Error(`Org lookup failed: ${orgError.message}`);
          }
          
          if (!org) {
            console.warn("[intake] no org with slug", orgSlug);
            notFound();   // genuinely absent → a real 404
          }

    const settings = (org.settings ?? {}) as OrgSettings;
    const services = settings.services?.length
        ? settings.services
        : ["General Inquiry"];

    return (
        <main className="mx-auto max-w-xl px-4 py-12">
        <h1   className="text-2xl font-semibold tracking-tight text-neutral-900">
            {org.name}
        </h1>
        <p    className="mt-2 text-sm text-neutral-600">
            Tell us what you need and we&apos;ll get back to you within one business day. Takes about 90 seconds.
        </p>
        <LeadForm
            orgSlug={org.slug}
            services={services}
            renderedAt={Date.now()}
        />        
  </main> 
   );
}