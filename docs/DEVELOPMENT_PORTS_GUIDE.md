# Development Server Port Configuration Guide

This document explains the different development server configurations and their port assignments in the Broker Analysis project.

## Port Overview

### Main Development Ports

| Port | Configuration | Purpose | Command |
|------|---------------|---------|---------|
| **3000** | Main (`vite.config.ts`) | Standard development with full features | `npm run dev` or `npm run dev:3000` |
| **3001** | Stable (`vite.config.stable.ts`) | Stable config to prevent restart loops | `npm run dev:stable` or `npm run dev:3001` |
| **3001** | Proxy Server | Backend API proxy for AI services | Starts automatically with `npm run dev` |
| **3002** | Stable Alternative | Alternative stable configuration | `npm run dev:port` or `npm run dev:3002` |
| **3003** | Safe Mode | Maximum stability for troubleshooting | `npm run dev:safe` or `npm run dev:3003` |

### Port 5173 vs 3000

- **5173**: Vite's default port (not used in this project)
- **3000**: Configured port for the main development server
- **Why 3000**: The project overrides Vite's default for consistency and to avoid conflicts with other Vite projects

## Development Configurations

### 1. Standard Development (Port 3000)
```bash
npm run dev
# or
npm run dev:3000
```

**Features:**
- Full HMR (Hot Module Replacement)
- Comprehensive optimizations
- Error overlay disabled to prevent restart loops
- Complete development tooling

**Use when:**
- Normal day-to-day development
- Full feature set needed
- Server is stable

### 2. Stable Development (Port 3001)
```bash
npm run dev:stable
# or
npm run dev:3001
```

**Features:**
- Conservative configuration
- Reduced file watching
- Slower refresh intervals
- Prevents restart loops

**Use when:**
- Experiencing frequent server restarts
- Need more stable development environment
- Troubleshooting HMR issues

### 3. Safe Mode (Port 3003)
```bash
npm run dev:safe
# or
npm run dev:3003
```

**Features:**
- Maximum stability settings
- Host configured as `0.0.0.0`
- Most conservative file watching
- Minimal features to prevent crashes

**Use when:**
- Experiencing persistent development issues
- Need maximum uptime
- Debugging complex problems

### 4. Alternative Configuration (Port 3002)
```bash
npm run dev:port
# or
npm run dev:3002
```

**Features:**
- Stable configuration with different port
- Host as `0.0.0.0` for network access
- Alternative when other ports are occupied

## Proxy Server (Port 3001)

The proxy server runs on port 3001 and handles:
- AI API calls (Chatbot, Tutor, Broker Matcher)
- API key security
- Request validation and sanitization
- Rate limiting

**Note:** The proxy server automatically starts with any `npm run dev:*` command.

## Port Conflict Resolution

If you encounter port conflicts:

1. **Check what's running on the port:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001

   # macOS/Linux
   lsof -i :3000
   lsof -i :3001
   ```

2. **Kill the process (if needed):**
   ```bash
   # Windows
   taskkill /PID <PID> /F

   # macOS/Linux
   kill -9 <PID>
   ```

3. **Use an alternative port:**
   ```bash
   npm run dev:3002  # Uses port 3002
   npm run dev:3003  # Uses port 3003
   ```

## Development Workflow Recommendations

### Normal Development
```bash
npm run dev  # Port 3000
```

### When Experiencing Issues
1. Try stable mode: `npm run dev:stable` (Port 3001)
2. If still unstable: `npm run dev:safe` (Port 3003)
3. Check logs for specific error patterns
4. Consider running `npm run dev:clean` to clear caches

### Multiple Development Environments
If you need multiple development instances running:
- Instance 1: `npm run dev:3000`
- Instance 2: `npm run dev:3002`
- Instance 3: `npm run dev:3003`

## Configuration Files

| Configuration File | Port | Purpose |
|-------------------|------|---------|
| `vite.config.ts` | 3000 | Main development configuration |
| `vite.config.stable.ts` | 3001 | Stable configuration |
| `api/proxy-server.js` | 3001 | Proxy server backend |

## Environment Variables

- `PORT`: Sets proxy server port (defaults to 3001)
- `FRONTEND_URL`: Expected frontend URL (defaults to http://localhost:3000)
- `VITE_*`: Frontend environment variables

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Solution: Use alternative port commands (`dev:3002`, `dev:3003`)

2. **Frequent server restarts**
   - Solution: Switch to stable configuration (`dev:stable`)

3. **HMR not working**
   - Solution: Try no-HMR mode (`npm run dev:no-hmr`)

4. **Proxy server connection issues**
   - Check that proxy server is running on port 3001
   - Verify API keys are configured

### Debug Commands

```bash
# Verbose development output
npm run dev:verbose

# Debug configuration
npm run dev:debug

# No HMR (for testing)
npm run dev:no-hmr

# Clean start
npm run dev:clean
```

## Browser Access

Once running, access the application at:
- **Main**: http://localhost:3000
- **Stable**: http://localhost:3001 (if using stable config)
- **Alternative**: http://localhost:3002 or http://localhost:3003

**API Endpoints:**
- **Proxy Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/health