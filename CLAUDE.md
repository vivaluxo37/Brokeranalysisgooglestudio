# CLAUDE.md

**IMPORTANT**: This file MUST be consulted before starting any new task. Always review this documentation first to understand the project structure, available tools, and development patterns.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production (client + server + prerender)
- `npm run preview` - Preview production build locally
- `npm run sitemap` - Generate sitemap
- `npm run prerender` - Run prerendering script

### Testing
- Tests use Vitest with React Testing Library
- Test setup in `setupTests.ts` (includes jest-dom matchers)
- No specific test script defined - run tests directly with `npx vitest` if needed

## Architecture Overview

### Application Structure
This is a React-based single-page application for forex broker comparison and analysis, built with:

- **Frontend**: React 19.1.1 with TypeScript
- **Routing**: React Router DOM 7.9.1 with HashRouter
- **Build Tool**: Vite 5.3.4
- **Styling**: Tailwind CSS 3.4.0 with custom themes
- **AI Integration**: Google Gemini AI via @google/genai
- **Charts**: Chart.js 4.5.0 for broker comparison visualizations

### Key Directories
- `/` - Root contains main app files (App.tsx, index.tsx, index.html)
- `/components` - Reusable UI components and feature-specific components
- `/pages` - Page components for each route
- `/contexts` - React contexts for state management (Theme, Auth, Comparison, etc.)
- `/services` - Backend service functions, primarily AI-powered features
- `/data` - Static data files (brokers, blog posts, etc.)
- `/hooks` - Custom React hooks
- `/scripts` - Build and utility scripts
- `/public` - Static assets

### State Management Architecture
Multiple React contexts provide global state:
- **ThemeContext**: Light/dark theme management with localStorage persistence
- **AuthProvider**: User authentication state
- **ComparisonProvider**: Broker comparison functionality
- **FavoritesProvider**: User favorite brokers
- **ReviewsProvider**: Broker review system
- **AlertsProvider**: User notifications
- **LanguageProvider**: Internationalization support
- **DiscussionProvider**: Community discussion features
- **TradingJournalProvider**: User trading journal
- **EducationProvider**: Educational content progress
- **OnboardingProvider**: User onboarding flow

### AI-Powered Features
The `services/backendService.ts` file contains extensive AI functionality using Google Gemini:
- **Chatbot**: Broker-specific Q&A with streaming responses
- **AI Tutor**: Educational content about forex trading
- **Broker Matcher**: Strategy-based broker recommendations
- **Cost Analysis**: Real-time trading cost analysis
- **Review Summarization**: AI-powered review analysis
- **Market Analysis**: News sentiment and market mood analysis
- **Regulatory Trust Scoring**: Automated broker trust assessment

### Data Architecture
- **Brokers Data**: Static broker data in `/data/brokers.ts` with detailed regulatory, trading, and fee information
- **Blog Content**: Educational content managed through TypeScript files
- **User Data**: Reviews, trading journals, and preferences stored in contexts
- **Real-time Data**: TradingView widgets for market data and charting

### Build and Deployment
- **Production Build**: Creates both client and server builds with SSR support
- **Prerendering**: Generates static HTML for better SEO and performance
- **Sitemap Generation**: Automated sitemap creation for all brokers and blog content
- **Environment Variables**: Uses Vite's `import.meta.env` for API keys (VITE_API_KEY)

### Styling System
- **Tailwind CSS**: Primary styling framework with custom theme configuration
- **Custom Properties**: CSS variables for light/dark theme switching
- **Component Library**: Reusable UI components in `/components/ui/`
- **Responsive Design**: Mobile-first approach with breakpoint utilities

### Key Features
- **Broker Comparison**: Side-by-side broker comparison with AI analysis
- **Educational Content**: Comprehensive forex trading education with quizzes
- **Trading Tools**: Calculators, simulators, and journaling features
- **Community Features**: Reviews, discussions, and user-generated content
- **Real-time Data**: Integration with TradingView for market data
- **AI-Powered Insights**: Automated analysis and recommendations

### File Structure Notes
- Main application files are in the root directory (not `/src`)
- CSS files are in `/src/index.css` with Tailwind directives
- Type definitions are centralized in `/types.ts`
- Constants and configuration are in `/constants.tsx`

## Clerk Authentication Integration

### Setup Instructions
1. **Install Clerk React SDK**: `npm install @clerk/clerk-react@latest`
2. **Environment Variable**: Set `VITE_CLERK_PUBLISHABLE_KEY` in `.env` or `.env.local`
3. **Provider Setup**: App wrapped in `<ClerkProvider>` in `index.tsx`
4. **Components**: Use `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<SignUpButton>`, `<UserButton>`

### Environment Configuration
```bash
VITE_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

### Authentication Components
- **Authentication.tsx**: Pre-built auth components with modal sign-in/up
- **ProtectedRoute.tsx**: Route wrapper for authenticated content only

### Usage Examples
```typescript
import { Authentication, ProtectedRoute } from './components/Authentication';

// In header/navigation
<Authentication />

// For protected routes
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

### Important Notes
- Real keys should only be stored in `.env.local`
- `.gitignore` should exclude `.env*` files
- Use placeholder values in documentation only
- Always use `publishableKey` (not `frontendApi`)

## MCP (Model Context Protocol) Configuration

### Available MCP Servers
This project has the following MCP servers configured for enhanced development capabilities:

#### Supabase (`supabase`)
- **Package**: `@supabase/mcp-server-supabase`
- **Purpose**: Database operations and data management
- **Configuration**: Read-only access to project `sdanjzsxwczlwsgspihb`
- **Usage**: Query brokers, reviews, users, and trading data

#### Fetch (`fetch`)
- **Package**: `@mokei/mcp-fetch`
- **Purpose**: Web fetching and content retrieval
- **Capabilities**: API calls, web scraping, content extraction
- **Usage**: Fetch external data, scrape websites, make HTTP requests

#### Context7 (`context7`)
- **Package**: `@upstash/context7-mcp`
- **Purpose**: Documentation and context management
- **Capabilities**: Documentation search, codebase analysis
- **Usage**: Search documentation, analyze code patterns, get context-aware suggestions

#### Playwright (`playwright`)
- **Package**: `@playwright/mcp`
- **Purpose**: Browser automation and testing
- **Capabilities**: E2E testing, web interactions, browser automation
- **Usage**: Automated testing, UI testing, web form interactions

#### Puppeteer (`puppeteer`)
- **Package**: `@hisma/server-puppeteer`
- **Purpose**: Headless browser automation
- **Capabilities**: PDF generation, screenshots, headless browsing
- **Usage**: Generate PDFs, take screenshots, run headless browser tasks

#### Z AI Server (`zai-mcp-server`)
- **Package**: `@z_ai/mcp-server`
- **Purpose**: General Z AI capabilities and services
- **Capabilities**: AI-powered development assistance, code analysis, and intelligent suggestions
- **Environment Variables**:
  - `Z_AI_API_KEY`: `a07915db87b34f96aa53f89fab692b20.2bW7A4gPqZMAnfgb`
  - `Z_AI_MODE`: `ZAI`
- **Usage**: AI-powered development tasks, code optimization, and intelligent assistance

#### Web Search Prime (`web-search-prime`)
- **Package**: HTTP-based MCP server
- **Purpose**: Enhanced web search functionality
- **Capabilities**: Real-time web search, current information retrieval, web data integration
- **Authentication**: Bearer token authentication
- **URL**: `https://api.z.ai/api/mcp/web_search_prime/mcp`
- **Usage**: Web searches, fetching current data, researching latest trends and information

### MCP Configuration File
- **Location**: `mcp-config.json`
- **Environment**: Windows (using `cmd`)
- **Setup**: All servers configured to run with `npx`

### Using MCP Servers
1. Copy the configuration from `mcp-config.json` to your Claude Code MCP settings
2. Servers are available for development, testing, and automation tasks
3. Each server provides specific capabilities for different types of tasks

### MCP Development Workflow
- **Database Operations**: Use Supabase MCP for data queries and management
- **Web Content**: Use Fetch MCP for external API calls and web scraping
- **Documentation**: Use Context7 MCP for codebase analysis and documentation
- **Testing**: Use Playwright MCP for E2E testing and browser automation
- **Automation**: Use Puppeteer MCP for headless browser tasks and PDF generation
- **AI Assistance**: Use Z AI MCP Server for intelligent development assistance and code analysis
- **Web Search**: **IMPORTANT RULE** - When performing web searches, ALWAYS use both MCP servers:
  1. **Z AI Server** (`zai-mcp-server`) for AI-powered search and analysis
  2. **Web Search Prime** (`web-search-prime`) for comprehensive web search functionality
  - Both servers should be utilized simultaneously for comprehensive web search results
  - This ensures maximum coverage and accuracy for web-based research tasks