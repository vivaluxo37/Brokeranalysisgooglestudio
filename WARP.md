# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview and architecture
- This repo contains a React/Vite single-page application (Brokeranalysisgooglestudio) with SSR prerendering, a serverless API (Brokeranalysisgooglestudio/api) deployed via Vercel, and a comprehensive Supabase/PostgreSQL schema defined by SQL scripts at the repo root. There is also a services module (Brokeranalysisgooglestudio/services) implementing a layered architecture for broker promotions. A large awesome-llm-apps directory contains example apps and is not part of the core broker analysis product.

Essential commands (Windows PowerShell)
- Frontend app (Brokeranalysisgooglestudio)
  - Install dependencies
    ```powershell path=null start=null
    npm install
    ```
  - Run dev server
    ```powershell path=null start=null
    npm run dev
    ```
  - Build (client + SSR + prerender)
    ```powershell path=null start=null
    npm run build
    ```
  - Preview production build
    ```powershell path=null start=null
    npm run preview
    ```
  - Generate sitemap / prerender manually
    ```powershell path=null start=null
    npm run sitemap
    npm run prerender
    ```
  - Tests (Vitest)
    ```powershell path=null start=null
    # run all tests once
    npm test

    # watch mode
    npm run test:watch

    # API-focused tests
    npm run test:api

    # run a single test file (examples)
    npx vitest run tests/services/promotionService.test.ts
    npx vitest run path\to\your.test.ts
    ```
  - Linting
    - No lint script is defined for the frontend. Use tests/type checking and your editor tooling.

- Serverless API (Brokeranalysisgooglestudio/api)
  - Install dependencies
    ```powershell path=null start=null
    npm install
    ```
  - Run dev server (Vercel)
    ```powershell path=null start=null
    npm run dev
    ```
  - Type-check build (no emit)
    ```powershell path=null start=null
    npm run build
    ```
  - Start (Vercel)
    ```powershell path=null start=null
    npm start
    ```
  - Notes: vercel is a devDependency; commands above use the local CLI.

- Database (Supabase/PostgreSQL, scripts at repo root)
  - Full migration (recommended)
    ```powershell path=null start=null
    # Replace placeholders with your values
    psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f database_migration_script.sql
    ```
  - Step-by-step setup
    ```powershell path=null start=null
    psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f enhanced_users_table.sql
    psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f broker_specialized_tables.sql
    psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f create_content_tables.sql
    psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f comprehensive_database_setup.sql
    psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f database_utilities_and_security.sql
    ```
  - Import sample/content data
    ```powershell path=null start=null
    # In psql, run the master import
    \i import_all_data.sql
    ```

Environment configuration
- Frontend (.env.local in Brokeranalysisgooglestudio)
  ```powershell path=null start=null
  GEMINI_API_KEY={{GEMINI_API_KEY}}
  VITE_CLERK_PUBLISHABLE_KEY={{VITE_CLERK_PUBLISHABLE_KEY}}
  ```
- Serverless API (.env in Brokeranalysisgooglestudio/api)
  ```powershell path=null start=null
  CLERK_SECRET_KEY={{CLERK_SECRET_KEY}}
  GOOGLE_AI_API_KEY={{GOOGLE_AI_API_KEY}}
  SUPABASE_URL={{SUPABASE_URL}}
  SUPABASE_SERVICE_ROLE_KEY={{SUPABASE_SERVICE_ROLE_KEY}}
  # Optional rate limits
  RATE_LIMIT_WINDOW_MS=60000
  RATE_LIMIT_MAX_REQUESTS_GENERAL=100
  RATE_LIMIT_MAX_REQUESTS_CHAT=20
  RATE_LIMIT_MAX_REQUESTS_AUTH=10
  ```

High-level architecture and structure
- Frontend (Brokeranalysisgooglestudio)
  - React 19 + Vite 5; TailwindCSS for styling.
  - Routing via react-router-dom (HashRouter).
  - Build pipeline (package.json):
    - vite build --outDir dist/client
    - vite build --ssr prerender-entry.tsx --outDir dist/server
    - scripts/prerender.js to prerender routes for SEO/perf.
  - State is managed via multiple React Context providers (Theme, Auth, Comparison, Favorites, Reviews, Alerts, Language, Discussion, TradingJournal, Education, Onboarding) as documented in Brokeranalysisgooglestudio/CLAUDE.md.
  - AI integration: Google Gemini via @google/genai; app-level service logic (see services/backendService.ts referenced in CLAUDE.md) powers chatbot, tutor, broker matcher, cost analysis, review summarization, and more.

- Promotions services (Brokeranalysisgooglestudio/services)
  - Layered architecture per services/README.md:
    - Service layer (business logic/validation)
    - Repository layer (Supabase or in-memory implementations)
    - Calculation layer (tiered rebate computations, scenarios, cost reduction)
  - Factory: PromotionServiceFactory configures repository type and dependencies.
  - Tests are organized under tests/services/ with Vitest examples in services/README.md.

- Serverless API (Brokeranalysisgooglestudio/api)
  - Vercel-based serverless functions (Node + TypeScript) exposing REST endpoints for brokers, reviews, users, comparisons, favorites, and chat.
  - Integrations: Clerk (auth), Supabase (PostgreSQL + RLS), Google Generative AI.
  - Security features include rate limiting, CORS, input validation (zod), and RLS at the DB layer. See Brokeranalysisgooglestudio/api/README.md for endpoint details.

- Database (SQL scripts at repo root)
  - DATABASE_SETUP_GUIDE.md and comprehensive_database_setup.sql define an extensive schema with:
    - Core domain tables (users, brokers, reviews, comparisons, favorites, content, education, discussions).
    - Specialized tables (regulations, fees, platforms, account types, alerts, notifications).
    - RLS policies, indexes (composite/GIN/partial), materialized views, functions, and maintenance routines.
  - SQL_IMPORT_GUIDE.md explains importing alerts, news, quizzes, and user preference data, plus validation queries and performance indexes.

Important external rules and notes
- From Brokeranalysisgooglestudio/README.md
  - Prereqs: Node.js; install deps, set GEMINI_API_KEY in .env.local, run npm run dev.
- From Brokeranalysisgooglestudio/CLAUDE.md
  - Commands mirror package.json (install/dev/build/preview/sitemap/prerender; tests use Vitest and RTL).
  - MCP servers are defined (Supabase, Fetch, Context7, Playwright, Puppeteer, Z AI, Web Search Prime). When performing web searches, use both the Z AI server and Web Search Prime in tandem as specified. Do not commit or expose secrets; configure credentials via environment variables.
- Services module
  - See Brokeranalysisgooglestudio/services/README.md for the promotions subsystem’s layering, factory usage, data models, and testing patterns.

Working across projects in this repo
- Core development targets are the frontend app (Brokeranalysisgooglestudio), the serverless API (Brokeranalysisgooglestudio/api), and the DB scripts at the repo root. The awesome-llm-apps directory contains standalone examples and tutorials and is generally orthogonal to the broker analysis product.

# 🤖 INTELLIGENT AGENT ROUTING & AUTOMATION

## 📋 TASK ROUTING MATRIX

This section automatically routes tasks to the most appropriate specialized agent based on keywords, task type, and context. Each agent has specific expertise and tools optimized for their domain.

### 🎯 AUTO-ROUTING RULES

**Frontend Tasks** → Route to **Frontend Agent**
- Keywords: `UI`, `component`, `React`, `frontend`, `styling`, `TailwindCSS`, `build`, `test`, `accessibility`
- File patterns: `*.tsx`, `*.jsx`, `*.css`, `vite.config.*`, `package.json` (frontend)
- Tasks: Component development, styling, responsive design, testing, build optimization

**Authentication Tasks** → Route to **Authentication Agent**
- Keywords: `auth`, `login`, `signup`, `Clerk`, `JWT`, `session`, `token`, `user management`
- File patterns: Authentication components, protected routes, middleware
- Tasks: User authentication, session management, protected endpoints

**Backend/Database Tasks** → Route to **Backend & Database Agent**
- Keywords: `API`, `database`, `SQL`, `Supabase`, `PostgreSQL`, `endpoint`, `migration`, `schema`
- File patterns: `*.sql`, API routes, database models
- Tasks: API development, database operations, data modeling, migrations

**Web Automation Tasks** → Route to **Web Automation Agent**
- Keywords: `scraping`, `browser`, `automation`, `Playwright`, `testing`, `web interaction`
- File patterns: Test files, automation scripts
- Tasks: Web scraping, automated testing, browser interactions, data extraction

**Data Analysis Tasks** → Route to **AI Research Agent**
- Keywords: `analysis`, `research`, `data`, `AI`, `machine learning`, `insights`, `trends`
- File patterns: Data files, analysis scripts, research documents
- Tasks: Data analysis, market research, AI/ML implementations, trend analysis

**Content & Documentation Tasks** → Route to **Content Management Agent**
- Keywords: `content`, `documentation`, `blog`, `SEO`, `copywriting`, `markdown`
- File patterns: `*.md`, content files, documentation
- Tasks: Content creation, documentation, SEO optimization, copywriting

**DevOps & Infrastructure Tasks** → Route to **DevOps Agent**
- Keywords: `deployment`, `CI/CD`, `infrastructure`, `monitoring`, `performance`, `scaling`
- File patterns: Config files, deployment scripts, infrastructure code
- Tasks: Deployment automation, monitoring setup, performance optimization

**Project Management Tasks** → Route to **Project Coordinator Agent**
- Keywords: `planning`, `coordination`, `workflow`, `task management`, `architecture`
- File patterns: Project files, planning documents
- Tasks: Project planning, task coordination, architecture decisions

## 🎛️ MCP SERVERS & AUTOMATION TOOLS

### Active MCP Servers
- **Context7**: AI-powered context management and memory (`ctx7sk-2f61bb6a-138b-40ee-92c7-bb8e832bc59b`)
- **Playwright**: Browser automation and testing
- **Supabase**: Database operations and management
- **Fetch**: HTTP requests and API interactions
- **Clerk**: Authentication and user management
- **Puppeteer**: Alternative browser automation

### MCP Server Routing
- **Web scraping/automation** → Use Playwright or Puppeteer
- **Database operations** → Use Supabase MCP server
- **API testing/requests** → Use Fetch MCP server
- **Authentication** → Use Clerk MCP server
- **Context/memory management** → Use Context7 MCP server

## 👥 SPECIALIZED AGENT PROFILES

### 🎨 Frontend Agent
**File:** `AGENT.frontend.md`
**Expertise:** React 19 + Vite 5, TailwindCSS, SSR, Testing
**Tools:** npm, Vite, Vitest, React Testing Library
**Responsibilities:**
- UI/UX development and optimization
- Component library maintenance
- Build pipeline optimization
- Testing and quality assurance
- Performance optimization

### 🔐 Authentication Agent
**File:** `AGENT.auth.md`
**Expertise:** Clerk integration, JWT, Session management
**Tools:** Clerk SDK, JWT validation
**Responsibilities:**
- User authentication flows
- Protected route implementation
- Token validation and refresh
- Security policy enforcement

### 🗄️ Backend & Database Agent
**File:** `AGENT.backend-database.md`
**Expertise:** Vercel serverless, PostgreSQL, Supabase, API design
**Tools:** Vercel CLI, psql, Supabase CLI
**Responsibilities:**
- REST API development
- Database schema design
- Data migrations and imports
- Performance optimization

### 🌐 Web Automation Agent
**MCP Servers:** Playwright, Puppeteer
**Expertise:** Browser automation, Web scraping, E2E testing
**Tools:** Playwright, Puppeteer, Chromium
**Responsibilities:**
- Automated web interactions
- Data extraction and scraping
- End-to-end testing
- Browser performance testing

### 🧠 AI Research Agent
**MCP Servers:** Context7, Perplexity, Web Search
**Expertise:** AI/ML, Data analysis, Market research
**Tools:** Google Gemini API, Context7, Research APIs
**Responsibilities:**
- Market research and analysis
- AI model integration
- Data insights and reporting
- Trend analysis and forecasting

### 📝 Content Management Agent
**MCP Servers:** Notion, GitHub, Context7
**Expertise:** Content strategy, SEO, Documentation
**Tools:** Notion API, GitHub API, Content management
**Responsibilities:**
- Content creation and optimization
- SEO strategy implementation
- Documentation management
- Blog and marketing content

### ⚙️ DevOps Agent
**MCP Servers:** GitHub, Filesystem, Calendar
**Expertise:** CI/CD, Monitoring, Infrastructure
**Tools:** Vercel, GitHub Actions, Monitoring tools
**Responsibilities:**
- Deployment automation
- Monitoring and alerting
- Performance optimization
- Infrastructure management

### 🎯 Project Coordinator Agent
**MCP Servers:** Notion, GitHub, Calendar, Context7
**Expertise:** Project management, Architecture, Coordination
**Tools:** Project management APIs, Planning tools
**Responsibilities:**
- Cross-agent task coordination
- Architecture decision making
- Project planning and tracking
- Resource allocation

## 🔄 AUTOMATED WORKFLOWS

### 🚀 Development Workflow Automation

**Feature Development Pipeline:**
1. **Planning** (Project Coordinator) → Create feature specification
2. **Frontend** (Frontend Agent) → Implement UI components
3. **Backend** (Backend Agent) → Create API endpoints
4. **Auth** (Auth Agent) → Add security measures
5. **Testing** (Web Automation) → Automated E2E tests
6. **Deployment** (DevOps) → Deploy and monitor

**Bug Fix Workflow:**
1. **Analysis** (Project Coordinator) → Analyze and categorize bug
2. **Route** → Forward to appropriate specialist agent
3. **Fix** (Specialist Agent) → Implement solution
4. **Test** (Web Automation) → Verify fix
5. **Deploy** (DevOps) → Push to production

### 📊 Content & Research Automation

**Market Research Pipeline:**
1. **Research** (AI Research) → Gather market data
2. **Analysis** (AI Research) → Process and analyze
3. **Content** (Content Management) → Create reports
4. **Distribution** (Content Management) → Publish content

**Broker Analysis Automation:**
1. **Data Collection** (Web Automation) → Scrape broker data
2. **Processing** (Backend) → Store and process data
3. **Analysis** (AI Research) → Generate insights
4. **Presentation** (Frontend) → Display results

## 🎛️ AGENT SELECTION LOGIC

```
IF task contains ["UI", "component", "React", "frontend"]
  THEN route_to("Frontend Agent")
  
ELSE IF task contains ["auth", "login", "Clerk", "JWT"]
  THEN route_to("Authentication Agent")
  
ELSE IF task contains ["API", "database", "SQL", "backend"]
  THEN route_to("Backend & Database Agent")
  
ELSE IF task contains ["scraping", "automation", "browser"]
  THEN route_to("Web Automation Agent")
  
ELSE IF task contains ["research", "analysis", "AI", "data"]
  THEN route_to("AI Research Agent")
  
ELSE IF task contains ["content", "SEO", "documentation"]
  THEN route_to("Content Management Agent")
  
ELSE IF task contains ["deployment", "CI/CD", "infrastructure"]
  THEN route_to("DevOps Agent")
  
ELSE
  THEN route_to("Project Coordinator Agent")
```

## 🔧 AGENT COORDINATION PROTOCOLS

### Cross-Agent Communication
- **Context Sharing**: Use Context7 MCP for shared memory
- **Task Handoffs**: Structured handoff protocols between agents
- **Progress Tracking**: Centralized progress monitoring
- **Conflict Resolution**: Escalation to Project Coordinator

### Quality Assurance
- **Code Reviews**: Automated code quality checks
- **Testing Integration**: Automated testing across all changes
- **Performance Monitoring**: Continuous performance tracking
- **Security Validation**: Automated security scanning

## 📈 PERFORMANCE OPTIMIZATION

### Agent Efficiency Metrics
- Task completion time by agent type
- Error rates and resolution times
- Cross-agent collaboration effectiveness
- User satisfaction with agent responses

### Continuous Improvement
- Regular agent capability updates
- Feedback loop implementation
- Performance baseline tracking
- Optimization recommendations

Agent profiles
- Eight specialized agents work together to provide comprehensive project support:
  - AGENT.frontend.md — Frontend Agent (React/Vite UI development, testing, build optimization)
  - AGENT.auth.md — Authentication Agent (Clerk integration, JWT, security)
  - AGENT.backend-database.md — Backend & Database Agent (Vercel API, PostgreSQL, Supabase)
  - Web Automation Agent (Playwright/Puppeteer, browser automation, testing)
  - AI Research Agent (Context7, data analysis, market research, AI integration)
  - Content Management Agent (Notion, documentation, SEO, content strategy)
  - DevOps Agent (deployment, monitoring, infrastructure, CI/CD)
  - Project Coordinator Agent (planning, architecture, cross-agent coordination)
- Tasks are automatically routed to the most appropriate agent based on keywords and context
- Agents collaborate through MCP servers for seamless workflows and shared context
