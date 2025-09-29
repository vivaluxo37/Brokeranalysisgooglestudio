# 🏦 Broker Analysis - AI-Powered Forex Broker Reviews & Comparisons

> **Free, Fast & Trusted** - Find the safest and cheapest broker for your trading style with real-time cost analysis, AI safety alerts, and personalized recommendations.

## ✨ Features

- 📊 **80+ Broker Database** - Comprehensive analysis of major forex brokers
- 🤖 **AI-Powered Matching** - Intelligent broker recommendations based on your profile
- 📈 **Live Cost Analysis** - Real-time spread and commission comparisons
- 🛡️ **Safety Scoring** - AI-generated trust scores based on regulation data
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
   Create `.env.local` with required environment variables:
   ```env
   # Supabase Configuration (Optional - falls back to static data)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI Features
   GEMINI_API_KEY=your_gemini_api_key
   ```

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

```bash
npm run dev          # Start development server
npm run build        # Build for production with SSG
npm run preview      # Preview production build
npm run test         # Run test suite
npm run lint         # ESLint code quality checks
npm run type-check   # TypeScript validation
npm run sitemap      # Generate SEO sitemap
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
