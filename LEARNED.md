
## L1
Next.js dynamic routes use square brackets in folder names: app/f/[orgSlug]. In PowerShell, [ and ] are wildcard characters. Every normal path command will fail or silently do nothing on a bracketed path. 


## L2
Config-over-code" is an architectural pattern where you store dynamic system behaviors and client settings as raw data inside the database rather than hardcoding them into your application logic

## L3 
- Think of params as a locked safe handed to your page, and orgSlug is the company name locked inside it. In old versions of Next.js, the safe arrived wide open so you could just grab params.orgSlug instantly. 
- In Next.js 15, the safe arrives locked, and you must use the await keyword as your key to unlock it (await params) or your app will crash with an undefined error. Older tutorials and Cursor will wrong-foot you by telling you to skip the key because they don't know the safe is locked now. 
- Next.js made this change for raw speed, allowing the website to load your background design instantly while unlocking the URL variables a millisecond later in the background.

- Every dynamic page you write for the rest of this project awaits its params.