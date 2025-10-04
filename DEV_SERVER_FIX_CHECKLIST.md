# ✅ Dev Server Reload Fix Checklist

## 📋 Files to Modify

### 1. vite.config.ts (Lines 40-47)
- [ ] Change HMR port from 3005 to 24678
- [ ] Ensure clientPort also set to 24678

### 2. .env.local (Add at end)
- [ ] Add `VITE_CHOKIDAR_USEPOLLING=false`
- [ ] Add `GENERATE_SOURCEMAP=false`
- [ ] Add `NODE_OPTIONS="--max-old-space-size=4096"`

### 3. src/utils/vite-hmr-helper.ts (Replace entire file)
- [ ] Remove the `throw new Error` line that prevents reloads
- [ ] Keep the monitoring but allow normal HMR operation
- [ ] Update console log message

### 4. start-dev.ps1 (Line 44)
- [ ] Verify HMR port message shows 24678

### 5. start-dev.bat (Line 27)
- [ ] Verify HMR port message shows 24678

## 🚀 Quick Fix Commands

After applying all changes:

```bash
# Stop any running dev server (Ctrl+C)

# Clean and restart
npm run clean
./start-dev.ps1
```

Or on Windows CMD:
```bash
npm run clean
start-dev.bat
```

## 🔍 Verification

- [ ] Console shows: `🔧 Vite HMR Helper loaded - Monitoring for reload issues`
- [ ] No continuous reloads for 30+ seconds
- [ ] HMR works when making code changes
- [ ] No WebSocket errors in console

## 🆘 If Still Having Issues

### Option A: Use No-HMR Mode
```bash
npm run dev:no-hmr
```

### Option B: Check Port Conflicts
```powershell
netstat -ano | findstr :24678
```

### Option C: Try Different Port
- Change HMR port to 3006 in vite.config.ts
- Update startup scripts accordingly

## 📞 Need Help?

If issues persist after applying all fixes:
1. Check browser console for specific error messages
2. Try the alternative configurations listed above
3. Ensure no antivirus is blocking file operations
4. Verify all changes were applied correctly

---

**Status**: Ready to apply fixes
**Next Step**: Follow the checklist and test the dev server