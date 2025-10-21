# MCP Servers Setup Guide

This guide explains how to use the installed Model Context Protocol (MCP) servers in this project.

## Installed MCP Servers

### 1. Context7 MCP (`@upstash/context7-mcp`)
**Purpose**: Provides up-to-date, version-specific documentation and code examples for libraries.
**Usage**: Include "use context7" in your prompts to get accurate, current documentation.

### 2. Supabase MCP (`@supabase/mcp-server-supabase`)
**Purpose**: Enables AI assistants to interact with Supabase databases and projects.
**Configuration**: Requires Supabase project credentials in `.mcp.env`

### 3. Playwright MCP (`@playwright/mcp`)
**Purpose**: Browser automation using Playwright for testing, scraping, and web interactions.
**Features**: Structured accessibility snapshots, deterministic tool application.

### 4. Chrome DevTools MCP (`chrome-devtools-mcp`)
**Purpose**: Control and inspect live Chrome browsers through DevTools Protocol.
**Features**: Performance insights, advanced debugging, browser automation.

### 5. Playwright Automation MCP (`@executeautomation/playwright-mcp-server`)
**Purpose**: Enhanced browser automation with additional testing capabilities.
**Features**: Screenshotting, test code generation, API testing.

### 6. Puppeteer MCP (`@hisma/server-puppeteer`)
**Purpose**: Browser automation using Puppeteer with headless/headed modes.
**Features**: PDF generation, screenshots, web scraping.

### 7. Fetch MCP (`@mokei/mcp-fetch`)
**Purpose**: Web fetching and content retrieval from URLs and APIs.
**Features**: HTTP requests, content extraction, API integration.

### 8. Clerk MCP (`@clerk/agent-toolkit`)
**Purpose**: User authentication and management through Clerk.
**Features**: User CRUD operations, session management, authentication flows.

## Configuration

### Claude Desktop/Cursor Configuration
Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7-mcp"]
    },
    "supabase": {
      "command": "npx",
      "args": ["@supabase/mcp-server-supabase"]
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    },
    "playwright-automation": {
      "command": "npx",
      "args": ["@executeautomation/playwright-mcp-server"]
    },
    "puppeteer": {
      "command": "npx",
      "args": ["@hisma/server-puppeteer"]
    },
    "fetch": {
      "command": "npx",
      "args": ["@mokei/mcp-fetch"]
    },
    "clerk": {
      "command": "npx",
      "args": ["-y", "@clerk/agent-toolkit", "-p=local-mcp"],
      "env": {
        "CLERK_SECRET_KEY": "your_clerk_secret_key_here"
      }
    }
  }
}
```

### Environment Variables
Copy `.mcp.env.example` to `.mcp.env` and configure the required variables:

```bash
# Supabase Configuration
SUPABASE_PERSONAL_ACCESS_TOKEN=your_supabase_personal_access_token_here
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_PROJECT_ID=your_project_id_here

# Optional: Context7 API Key (for increased rate limits)
CONTEXT7_API_KEY=your_context7_api_key_here

# Clerk Configuration
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_FRONTEND_API_URL=https://your-instance.clerk.accounts.dev
CLERK_BACKEND_API_URL=https://api.clerk.com
CLERK_JWKS_URL=https://your-instance.clerk.accounts.dev/.well-known/jwks.json
```

## Usage Examples

### Context7
```
How do I invalidate a query in React Query? use context7
```

### Supabase
```
List all tables in my Supabase project and show their schemas
```

### Playwright
```
Navigate to example.com and take a screenshot of the header
```

### Chrome DevTools
```
Connect to Chrome and analyze the performance metrics for my-app.com
```

### Puppeteer
```
Generate a PDF of the current page with specific margins
```

### Fetch
```
Fetch the content from https://api.example.com/data and parse it
```

### Clerk
```
List all users in the Clerk application
Create a new user with email user@example.com
Get user session information
```

## Security Notes

- **Supabase MCP**: Use environment variables for credentials
- **Clerk MCP**: Secret key provides full access - secure appropriately
- **Browser Automation**: Be cautious with sensitive data in browsers
- **Fetch MCP**: Validate URLs and implement proper error handling
- **Chrome DevTools**: Exposes browser content - avoid sensitive pages

## Troubleshooting

### Common Issues

1. **Server not found**: Ensure Node.js 18+ is installed
2. **Permission denied**: Check environment variables and file permissions
3. **Connection errors**: Verify server URLs and network connectivity
4. **Timeout issues**: Adjust timeout values in configuration

### Debug Mode

Set `DEBUG=*` environment variable for verbose logging:

```bash
DEBUG=* npx @playwright/mcp@latest --help
```

### Installation Issues

If npm installation fails, try:
```bash
npm cache clean --force
npm install <package-name>
```

## Requirements

- Node.js 18.0.0 or higher
- Chrome/Chromium browser (for browser automation servers)
- Supabase project (for Supabase MCP)
- MCP-compatible client (Claude Desktop, Cursor, Windsurf, etc.)

## Support

For server-specific issues:
- Context7: https://github.com/upstash/context7
- Supabase: https://github.com/supabase-community/supabase-mcp
- Playwright: https://github.com/microsoft/playwright
- Chrome DevTools: https://github.com/benjaminr/chrome-devtools-mcp
- Puppeteer: https://github.com/puppeteer/puppeteer
