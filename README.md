# 🏦 Broker Analysis - AI-Powered Forex Broker Reviews & Comparisons

> **Free, Fast & Trusted** - Find the safest and cheapest broker for your trading style with real-time cost analysis, AI safety alerts, and personalized recommendations.

## ✨ Features

- 📊 **78+ Broker Database** - Comprehensive analysis of major forex brokers
- 🌍 **42 Country Pages** - Localized broker comparisons with unique SEO content
- 🤖 **AI-Powered Matching** - Intelligent broker recommendations based on your profile
- 📈 **Live Cost Analysis** - Real-time spread and commission comparisons
- 🛡️ **Safety Scoring** - AI-generated trust scores based on regulation data
- 🎯 **Programmatic SEO** - Auto-generated country pages with structured data
- 🌙 **Dark Mode Support** - Full dark/light theme with automatic switching
- ⚡ **High Performance** - Built with Vite + React + TypeScript for optimal speed

## 🚀 Quick Start

**Prerequisites:** Node.js 18+ and npm

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd Brokeranalysisgooglestudio
   npm install
   ```

2. **Environment Setup**
   Create `.env` with required environment variables:
   ```env
   # Google AI API (for chatbot assistant)
   VITE_API_KEY=your_google_ai_api_key_here
   
   # Supabase Configuration (Optional - falls back to static data)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
   
   Get your Google AI API key from: https://makersuite.google.com/app/apikey

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🏗️ Architecture

### Data Management
The application uses a **hybrid data architecture** for maximum reliability:

- **Primary**: Supabase database for dynamic broker data
- **Fallback**: Static JSON files in `data/brokers.ts` 
- **Service**: `UnifiedBrokerService` automatically handles failover

```typescript
// Unified data access - tries DB first, falls back to static
import { useBrokers } from './hooks/useBrokers';

const { brokers, loading, error } = useBrokers();
```

### Key Services
- `unifiedBrokerService.ts` - Single source of truth for broker data
- `useBrokers.ts` - React hooks with loading states and error handling
- `brokerDatabaseService.ts` - Supabase integration layer

## 📱 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production with SSG
npm run preview      # Preview production build
npm run test         # Run test suite
npm run lint         # ESLint code quality checks
npm run type-check   # TypeScript validation
```

### SEO & Validation
```bash
npm run sitemap:generate              # Generate sitemap.xml and robots.txt
node scripts/validateCountryMappings  # Validate broker mappings
node scripts/findMissingCountries     # Find missing country mappings
node scripts/extractBrokerIds         # List all broker IDs
```

## 🌐 Deployment

The app includes **Static Site Generation (SSG)** for optimal SEO:

```bash
npm run build        # Builds and pre-renders all broker pages
npm run preview      # Test the built app locally
```

Deploy the `dist/` folder to any static hosting service:
- Vercel, Netlify, GitHub Pages
- AWS S3 + CloudFront
- Any CDN or web server

## 🌐 Programmatic SEO

The platform features **42 auto-generated country pages** with unique, SEO-optimized content:

### Key Features
- ✅ **42 Countries** - Full geographic coverage from USA to Vietnam
- ✅ **630+ Unique Content Pieces** - No duplicate content
- ✅ **10+ Brokers per Country** - Minimum 10, average 12
- ✅ **4 Schema Types** - FAQ, Article, Breadcrumb, ItemList
- ✅ **51 URLs in Sitemap** - Optimized for search engines
- ✅ **AI Bot Support** - 2025-ready (Perplexity, ChatGPT, Claude)

### Country Page Structure
1. **Hero Section** - Unique 150-200 word intro with country flag
2. **Broker Listings** - 10+ verified brokers with ratings
3. **Local Relevance** - 4 sections (regulation, payments, tax, support)
4. **FAQ Section** - 10 country-specific Q&As with accordion UI
5. **Structured Data** - JSON-LD schemas for rich snippets

### Routes
```
/best-forex-brokers/united-states
/best-forex-brokers/united-kingdom
/best-forex-brokers/australia
... 39 more countries
```

### Documentation
See `docs/PROGRAMMATIC_SEO.md` for:
- Adding new countries
- Adding new brokers
- Content generation system
- SEO optimization guide
- Troubleshooting
