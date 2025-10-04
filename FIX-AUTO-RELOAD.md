# Fix Auto-Reload Issues - Troubleshooting Guide

## Problem
The development server keeps reloading automatically, even when you haven't made any changes to your code.

## Common Causes
1. **Multiple Vite instances running** - Check if there are other dev servers running
2. **File watch issues** - Windows file system watchers triggering on non-code files
3. **Scripts generating files** - Background scripts creating JSON/log files that trigger reloads
4. **HMR port conflicts** - Multiple instances trying to use the same Hot Module Replacement port
5. **Vite cache corruption** - Stale cache causing issues

## Solutions (Try in this order)

### Solution 1: Run Diagnostics (RECOMMENDED FIRST STEP)
```powershell
cd Brokeranalysisgooglestudio
.\diagnose-reloads.ps1
```

This will:
- Check for running Vite processes
- Identify port conflicts
- Show recently modified files
- Check for problematic files in scripts directory
- Offer to clear Vite cache

### Solution 2: Use the Stable Configuration
Stop your current dev server (Ctrl+C), then run:

```bash
npm run dev:stable
```

This uses a new `vite.config.stable.ts` configuration that:
- Uses native file watching (more efficient on Windows)
- Ignores all scripts output files
- Uses a unique HMR port (24680) to avoid conflicts
- Has comprehensive ignore patterns

### Solution 3: Use the Fix Mode
If Solution 2 doesn't work:

```bash
npm run dev:fix
```

This is like dev:stable but with additional flags to prevent screen clearing.

### Solution 4: Disable HMR Completely
As a last resort:

```bash
npm run dev:no-hmr
```

This disables Hot Module Replacement entirely. You'll need to manually refresh your browser after code changes.

### Solution 5: Manual Cleanup
If none of the above work, try this complete cleanup:

```powershell
# Stop all dev servers first (Ctrl+C in all terminal windows)

# Kill any lingering Node processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Clean everything
npm run clean

# Clear Vite cache
Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue

# Reinstall dependencies
npm install

# Start with stable config
npm run dev:stable
```

## Prevention Tips

1. **Only run one dev server at a time**
   - Before starting a new server, make sure to stop the old one (Ctrl+C)
   - Check for orphaned processes: `Get-Process | Where-Object {$_.ProcessName -like "*node*"}`

2. **Avoid running scripts while dev server is running**
   - Don't run test scripts, audit scripts, or migration scripts while developing
   - If you must run them, use the `dev:no-hmr` mode

3. **Move output files to ignored directories**
   - Script outputs should go to `./reports/` or `./backups/` directories
   - These are already ignored in the new config

4. **Keep your scripts directory clean**
   - Don't let scripts generate files directly in `./scripts/`
   - Move old JSON reports to a separate folder

## Understanding the Configs

### `vite.config.ts` (Default)
- Standard configuration
- May have issues with certain file patterns

### `vite.config.stable.ts` (New - Recommended)
- Optimized for Windows
- Native file watching
- Comprehensive ignore patterns
- Unique HMR port

### `vite.config.no-hmr.ts` (Emergency)
- HMR completely disabled
- Use only if all else fails
- Requires manual browser refresh

### `vite.config.dev.ts` (Development)
- Enhanced debugging
- Uses polling (can be slower)
- More verbose logging

## What Files Are Ignored?

The stable config ignores:
- `node_modules`, `.git`, `dist`, `build`
- All `.log` files
- All files in `scripts/*.json`
- Reports and audit files (`*audit-report*.json`, `*migration*.json`, etc.)
- Lock files (`package-lock.json`, `yarn.lock`, etc.)
- Config files (`tsconfig.json`, `.env*`, etc.)
- IDE files (`.vscode`, `.idea`)
- Test results and coverage
- All markdown files (`.md`) - comment out if you're editing docs

## Still Having Issues?

If you're still experiencing problems after trying all solutions:

1. Run the diagnostic script again: `.\diagnose-reloads.ps1`
2. Check the terminal output for specific error messages
3. Look at the browser console for HMR errors
4. Check if any browser extensions might be refreshing the page
5. Try a different browser to rule out browser-specific issues

## Technical Details

The auto-reload issue on Windows is often caused by:
- **File System Events**: Windows generates different file system events than Linux/Mac
- **Polling vs Native Watching**: Different watching strategies have different reliability
- **HMR WebSocket**: The connection can have issues if ports conflict or multiple instances run
- **Vite Cache**: Sometimes gets corrupted and needs clearing

The stable config addresses these by:
- Using native file watching (more efficient on Windows)
- Having very comprehensive ignore patterns
- Using a unique HMR port
- Suppressing unnecessary warnings

## Quick Reference

```bash
# Diagnostics
.\diagnose-reloads.ps1

# Solutions (in order of preference)
npm run dev:stable      # Best option
npm run dev:fix         # If stable doesn't work
npm run dev:no-hmr      # Last resort

# Cleanup
npm run clean           # Clean dist and cache
npm run dev:clean       # Clean then start dev server
```

---

**Last Updated**: Created to fix auto-reload issues
**Config Files**: vite.config.stable.ts, vite.config.no-hmr.ts
