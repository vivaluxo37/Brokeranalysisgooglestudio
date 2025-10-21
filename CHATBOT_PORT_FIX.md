# Chatbot Connection Issue - ROOT CAUSE AND FIX

## Problem
"Sorry, I'm having trouble connecting right now. Please try again. (Check browser console for details)"

## Root Cause
The proxy server port was misconfigured:
- **Expected Port**: 3001 (what the frontend tries to connect to)
- **Actual Port**: 3002 (what was set in proxy-server.js)

This mismatch caused the frontend to fail connecting to the proxy server, resulting in the error message.

## The Fix

### Changed in `api/proxy-server.js`:
```javascript
// BEFORE (WRONG):
const PORT = process.env.PORT || 3002;

// AFTER (CORRECT):
const PORT = process.env.PORT || 3001;
```

## Why This Happened
The port was accidentally changed from 3001 to 3002 in the proxy server configuration, but the frontend (`services/backendService.ts`) was still configured to connect to port 3001:

```typescript
// In backendService.ts
const PROXY_BASE_URL = import.meta.env.VITE_API_PROXY_URL || 'http://localhost:3001';
```

## Verification
After fixing the port configuration:

1. **Proxy Server Status**: ✅ Running on port 3001
2. **Health Check**: ✅ Responding at http://localhost:3001/health
3. **Chatbot API**: ✅ Working at http://localhost:3001/api/chatbot
4. **Frontend Connection**: ✅ Successfully connecting from port 3000

## How to Start the Services

### Quick Start (Recommended):
```bash
# Windows
start-dev-with-ai.bat

# Or manually:
cd api
node proxy-server.js

# In another terminal:
npm run dev
```

### Important Files:
- **Proxy Server**: `api/proxy-server.js` (must run on port 3001)
- **Frontend Service**: `services/backendService.ts` (connects to port 3001)
- **Startup Script**: `start-dev-with-ai.bat` (ensures clean start)

## Testing the Fix
```powershell
# Test proxy health
Invoke-WebRequest -Uri http://localhost:3001/health

# Test chatbot endpoint
$body = @{message="Test"} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3001/api/chatbot -Method POST -Body $body -ContentType "application/json"
```

## Prevention
- Always ensure proxy server PORT matches frontend configuration
- Use environment variables consistently
- Test the connection after any configuration changes

## Summary
The issue was a simple port mismatch: the proxy server was configured to use port 3002 while the frontend was trying to connect to port 3001. Changing the proxy server port back to 3001 resolved the issue immediately.
