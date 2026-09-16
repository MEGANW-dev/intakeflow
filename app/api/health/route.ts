import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_SECRET_KEY: Boolean(process.env.SUPABASE_SECRET_KEY),
    OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
  };

  let db: unknown;
  try {
    const { data, error } = await supabaseAdmin.from("orgs").select("slug");
    db = error
      ? { ok: false, error: error.message, code: error.code }
      : { ok: true, slugs: data?.map((o) => o.slug) };
  } catch (e) {
    db = { ok: false, threw: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json({ env, db, host: process.env.NEXT_PUBLIC_SUPABASE_URL });
}