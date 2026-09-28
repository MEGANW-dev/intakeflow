
## L1
Next.js dynamic routes use square brackets in folder names: app/f/[orgSlug]. In PowerShell, [ and ] are wildcard characters. Every normal path command will fail or silently do nothing on a bracketed path. 


## L2
Config-over-code" is an architectural pattern where you store dynamic system behaviors and client settings as raw data inside the database rather than hardcoding them into your application logic

## L3 PowerShell brackets need -LiteralPath
Next.js dynamic routes are folders like app/f/[orgSlug]. PowerShell treats
[ and ] as wildcards, so -Path silently misbehaves. Any bracketed path
needs -LiteralPath. Only affects PowerShell's own path cmdlets — git,
pnpm, and Cursor are fine.

## L4 NEXT_PUBLIC_ is a security boundary, not a naming style
Next inlines NEXT_PUBLIC_* into the browser bundle. SUPABASE_SECRET_KEY
has no prefix on purpose. Adding one would publish root database access.
No bug's correct fix is adding that prefix.

## L5 RLS enabled with zero policies = default deny
Postgres requires a matching policy to permit row access. No policies
means nothing is visible to the public key. This is the MOST locked-down
state, not an unfinished one. The secret key bypasses RLS by design,
which is how server-side writes work.

## L6 params is a Promise in Next.js 15
params: Promise<{ orgSlug: string }> and const { orgSlug } = await params.
Older tutorials (and Cursor) suggest the sync object; that yields
undefined. Async so Next can render the shell before params resolve.

## L7 Everything from FormData is a string
Unchecked checkboxes are absent entirely; checked ones send "on".
z.literal(true) rejects both. Coerce at the boundary (consent === "on"),
then work with real types inside. Same discipline as Result<T>: parse
once at the edge, trust the types after.

## L8 - *IMPORTANT* Model Cost 
Why gpt-4o-mini and not the best model available. Per the spec's cost model, classification runs about $0.0004 per lead — roughly $1.50/month at 100 leads against a $400/month retainer.

Model spend is about two dollars a month. The retainer is for the system, the monitoring, and the changes.

## L9 - Database failure lesson
when you see fetch failed, Internal Server Error, something went wrong, or any other vague message, scroll up in the terminal and look for Caused by, cause:, or the first line that names a specific system like a hostname, a file path, an error code, or a port. That's where the answer is almost every time.

## Rubric calibration: classify.v1.0.0 (Sept 26)

| Fixture | My score | Model | Agree? | Why we differ |
|----------|---------|-------|--------|---------------|
| 1 furnace emergency | 9-10 | 9/10  |  Yes  |   |
| 2 out-of-area commercial | 0 |  1/10 |  Yes  |   |
| 3 heat pump research | 5-6 | 4/10 | Yes  |   |
| 4 vague AC | 4-5 |  6/10 | No | Vauge but has an emergency request to call asap, should not have landed in nuture |
| 5 SEO spam | 0 | 4/10 | No  | This is an intentional scam message and it scored nuture, this should have received an automatic disqualification  |