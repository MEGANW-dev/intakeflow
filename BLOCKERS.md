# Project Blockers Log & Infrastructure Mitigations

## [Tue, September 08, 2026] — Resolved: Node Corepack Loop & pnpm Lifecycle Crashes

### 🔍 Issue Diagnosis
When attempting to run the data sandbox scripts using `pnpm tsx scripts/lead-scorer.ts`, the local Windows environment entered a repeating crash cycle. Node Corepack was attempting to intercept script lifecycle hooks and force-load a cached pnpm binary (`11.25.0`). Because of an internal environment configuration path conflict under Windows 11, the shell executor threw repeating stack trace errors: `Command failed with exit code 1 ... bin\pnpm.js install`.

### 🛠️ Resolution Steps & Technical Workaround
To resolve the bottleneck and restore standard command workflows, the 90-minute fallback protocol from the plain-English Windows companion sheet was applied:

1. **Disabled Corepack Shims:** Removed the underlying intercept layers completely via the terminal:
   ```powershell
   corepack disable
   ```
2. **Deployed Standalone pnpm Engine:** Re-installed the package manager globally as an independent application layer via standard npm:
   ```powershell
   npm install --global pnpm
   ```
3. **Overrode Dependency Build Warnings:** Explicitly satisfied the localized package security layer by mapping required dependencies onto the project runtime environment configurations:
   ```powershell
   pnpm approve-builds
   ```

### 🎯 Verification Status
- `pnpm -v` successfully prints clean white text output: `11.25.0`
- `pnpm tsx scripts/lead-scorer.ts` executes flawlessly, bypassing error loops and returning a clean terminal prompt.
- **Status:** Closed / Resolved.
