import  "server-only";
import  { createClient } from "@supabase/supabase-js";


const url= process.env.NEXT_PUBLIC_SUPABASE_URL;
const sercretKey= process.env.SUPABASE_SECRET_KEY;

if (!url) throw new Error ("Missing env: NEXT_PUBLIC_SUPABASE_URL");
if (!sercretKey) throw new Error ("Missing env: SUPABASE_SECRET_KEY");

/**
 * BYPASSES ROW LEVEL SECURITY. Server-side only, forever.
 * The `server-only` import above is a build-time tripwire: importing this
 * file from any Client Component fails the build instead of leaking the key.
 */

export const supabaseAdmin = createClient(url, sercretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
});