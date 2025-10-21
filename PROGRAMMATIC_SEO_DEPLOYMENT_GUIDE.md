# Programmatic SEO Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the programmatic SEO system to production with proper monitoring, scaling, and maintenance procedures.

## Deployment Architecture

### Production Environment Stack
- **Frontend**: Next.js with Vercel/Netlify
- **Backend API**: Node.js with Express
- **Database**: PostgreSQL (AWS RDS/Heroku Postgres)
- **Cache**: Redis (AWS ElastiCache/Upstash)
- **CDN**: Cloudflare/Vercel Edge Network
- **Monitoring**: DataDog/New Relic
- **Error Tracking**: Sentry
- **AI Service**: Google Gemini API

### Infrastructure Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Edge      │    │   Load Balancer │    │   Web Servers   │
│   (Cloudflare)  │───▶│   (AWS ALB)     │───▶│   (EC2/Vercel)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │   Monitoring    │◄────────────┤
                       │   (DataDog)     │             │
                       └─────────────────┘             │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External APIs │    │   Cache Layer   │    │   Database      │
│   (Gemini API)  │    │   (Redis)       │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 1. Environment Configuration

### Production Environment Variables

#### File: `.env.production`

```bash
# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/database
DATABASE_SSL=true
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis Configuration
REDIS_URL=redis://username:password@host:6379
REDIS_TLS=true
REDIS_CLUSTER=false

# Gemini AI Configuration
GEMINI_API_KEY=your_production_gemini_api_key
GEMINI_MODEL=gemini-pro
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=2048
GEMINI_TOP_P=0.8
GEMINI_TOP_K=40

# Content Generation Settings
CONTENT_GENERATION_ENABLED=true
CONTENT_GENERATION_BATCH_SIZE=5
CONTENT_GENERATION_RETRY_ATTEMPTS=3
CONTENT_GENERATION_RETRY_DELAY=1000
CONTENT_GENERATION_RATE_LIMIT=60

# Cache Configuration
CACHE_TTL_DEFAULT=3600
CACHE_TTL_CONTENT=86400
CACHE_TTL_API=1800
CACHE_MAX_SIZE=1000

# Security
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
CORS_ORIGIN=https://your-domain.com

# Monitoring and Logging
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn
DATADOG_API_KEY=your_datadog_api_key

# Performance
ENABLE_COMPRESSION=true
ENABLE_CACHING=true
ENABLE_RATE_LIMITING=true
MAX_REQUEST_SIZE=10485760

# SEO and Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
GOOGLE_SEARCH_CONSOLE_VERIFICATION=your_verification_code
BING_WEBMASTER_TOOLS_VERIFICATION=your_verification_code

# CDN Configuration
CDN_URL=https://cdn.your-domain.com
ASSET_PREFIX=/static
```

### Staging Environment Variables

#### File: `.env.staging`

```bash
# Application Configuration
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
NEXT_PUBLIC_API_URL=https://api-staging.your-domain.com

# Database Configuration (staging)
DATABASE_URL=postgresql://username:password@staging-host:5432/staging_db

# Redis Configuration (staging)
REDIS_URL=redis://username:password@staging-host:6379

# Gemini AI Configuration (staging)
GEMINI_API_KEY=your_staging_gemini_api_key

# Other configuration (inherited from production with overrides)
```

## 2. Deployment Scripts

### Build Script

#### File: `scripts/build.sh`

```bash
#!/bin/bash

set -e

echo "🚀 Starting build process..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
rm -rf build

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run type checking
echo "🔍 Running type checking..."
npm run type-check

# Run linting
echo "🔧 Running linting..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm run test:ci

# Build application
echo "🏗️ Building application..."
npm run build

# Optimize images
echo "🖼️ Optimizing images..."
npm run optimize:images

# Generate sitemap
echo "🗺️ Generating sitemap..."
npm run generate:sitemap

# Generate robots.txt
echo "🤖 Generating robots.txt..."
npm run generate:robots

echo "✅ Build completed successfully!"
```

### Deployment Script

#### File: `scripts/deploy.sh`

```bash
#!/bin/bash

set -e

ENVIRONMENT=${1:-production}
VERSION=${2:-latest}

echo "🚀 Deploying to $ENVIRONMENT environment (version: $VERSION)..."

# Load environment variables
if [ "$ENVIRONMENT" = "production" ]; then
    source .env.production
elif [ "$ENVIRONMENT" = "staging" ]; then
    source .env.staging
else
    echo "❌ Unknown environment: $ENVIRONMENT"
    exit 1
fi

# Run pre-deployment checks
echo "🔍 Running pre-deployment checks..."
npm run pre-deploy-check

# Backup database
echo "💾 Backing up database..."
npm run backup:database

# Run database migrations
echo "🗄️ Running database migrations..."
npm run migrate:prod

# Deploy application
echo "🚀 Deploying application..."
if [ "$ENVIRONMENT" = "production" ]; then
    # Production deployment
    vercel --prod
else
    # Staging deployment
    vercel
fi

# Warm up cache
echo "🔥 Warming up cache..."
npm run warm:cache

# Run post-deployment checks
echo "🔍 Running post-deployment checks..."
npm run post-deploy-check

# Notify team
echo "📢 Notifying team..."
npm run notify:deploy -- --env="$ENVIRONMENT" --version="$VERSION"

echo "✅ Deployment completed successfully!"
```

### Database Migration Script

#### File: `scripts/migrate.sh`

```bash
#!/bin/bash

set -e

ENVIRONMENT=${1:-production}
DIRECTION=${2:-up}

echo "🗄️ Running database migrations ($DIRECTION) for $ENVIRONMENT..."

# Load environment variables
if [ "$ENVIRONMENT" = "production" ]; then
    source .env.production
elif [ "$ENVIRONMENT" = "staging" ]; then
    source .env.staging
else
    echo "❌ Unknown environment: $ENVIRONMENT"
    exit 1
fi

# Check database connection
echo "🔍 Checking database connection..."
npm run db:check

# Run migrations
echo "🔄 Running migrations..."
if [ "$DIRECTION" = "up" ]; then
    npm run migrate:up
elif [ "$DIRECTION" = "down" ]; then
    npm run migrate:down
else
    echo "❌ Unknown direction: $DIRECTION"
    exit 1
fi

# Verify migration
echo "✅ Verifying migration..."
npm run migrate:verify

echo "✅ Database migration completed!"
```

## 3. Docker Configuration

### Dockerfile

#### File: `Dockerfile`

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

### Docker Compose

#### File: `docker-compose.yml`

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/broker_analysis
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=broker_analysis
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 256M

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## 4. CI/CD Pipeline

### GitHub Actions Workflow

#### File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Run E2E tests
        run: npm run test:e2e:ci

  build:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.image.outputs.image }}
      digest: ${{ steps.build.outputs.digest }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Output image
        id: image
        run: |
          echo "image=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.meta.outputs.version }}" >> $GITHUB_OUTPUT

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to staging
        run: |
          echo "Deploying ${{ needs.build.outputs.image }} to staging"
          # Add staging deployment commands here

      - name: Run staging tests
        run: |
          echo "Running staging tests"
          # Add staging test commands here

  deploy-production:
    needs: [build, deploy-staging]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to production
        run: |
          echo "Deploying ${{ needs.build.outputs.image }} to production"
          # Add production deployment commands here

      - name: Run smoke tests
        run: |
          echo "Running smoke tests"
          # Add smoke test commands here

      - name: Notify team
        if: always()
        run: |
          echo "Notifying team about deployment status"
          # Add notification commands here
```

## 5. Monitoring and Logging

### Monitoring Configuration

#### File: `config/monitoring.js`

```javascript
const { Datadog } = require('datadog-ci');
const Sentry = require('@sentry/node');

// DataDog configuration
const datadogConfig = {
  apiKey: process.env.DATADOG_API_KEY,
  site: 'datadoghq.com',
  service: 'broker-analysis-seo',
  env: process.env.NODE_ENV,
  version: process.env.APP_VERSION || 'latest'
};

// Sentry configuration
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app })
  ]
});

// Custom metrics
const metrics = {
  // Content generation metrics
  contentGenerationStarted: (type, category, country) => {
    return Datadog.metric.send('content.generation.started', 1, {
      type,
      category: category || 'none',
      country: country || 'none'
    });
  },

  contentGenerationCompleted: (type, duration, qualityScore) => {
    return Datadog.metric.send('content.generation.completed', 1, {
      type,
      duration,
      quality_score: qualityScore
    });
  },

  contentGenerationFailed: (type, error) => {
    return Datadog.metric.send('content.generation.failed', 1, {
      type,
      error: error.message
    });
  },

  // Performance metrics
  pageLoadTime: (url, loadTime) => {
    return Datadog.metric.send('page.load.time', loadTime, {
      url
    });
  },

  cacheHitRate: (cacheType, hit) => {
    return Datadog.metric.send('cache.hit', hit ? 1 : 0, {
      cache_type: cacheType
    });
  },

  // SEO metrics
  pageGenerated: (pageType, category, country) => {
    return Datadog.metric.send('seo.page.generated', 1, {
      page_type: pageType,
      category: category || 'none',
      country: country || 'none'
    });
  },

  rankingUpdated: (brokerId, newPosition) => {
    return Datadog.metric.send('broker.ranking.updated', 1, {
      broker_id: brokerId,
      new_position: newPosition
    });
  }
};

module.exports = {
  datadogConfig,
  metrics
};
```

### Health Check Endpoint

#### File: `api/health.ts`

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@lib/database';
import { contentCache } from '@services/cache/contentCache';
import { enhancedAIContentGenerator } from '@services/content/enhancedAIContentGenerator';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
      error?: string;
    };
    cache: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
      error?: string;
    };
    aiService: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
      error?: string;
    };
    memory: {
      status: 'healthy' | 'warning' | 'critical';
      usage: number;
      total: number;
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthStatus>
) {
  const startTime = Date.now();
  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || 'unknown',
    uptime: process.uptime(),
    checks: {
      database: { status: 'unhealthy', responseTime: 0 },
      cache: { status: 'unhealthy', responseTime: 0 },
      aiService: { status: 'unhealthy', responseTime: 0 },
      memory: { status: 'healthy', usage: 0, total: 0 }
    }
  };

  try {
    // Check database
    const dbStart = Date.now();
    try {
      await pool.query('SELECT 1');
      healthStatus.checks.database = {
        status: 'healthy',
        responseTime: Date.now() - dbStart
      };
    } catch (error) {
      healthStatus.checks.database = {
        status: 'unhealthy',
        responseTime: Date.now() - dbStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      healthStatus.status = 'unhealthy';
    }

    // Check cache
    const cacheStart = Date.now();
    try {
      await contentCache.set('health-check', 'ok', { ttl: 1000 });
      await contentCache.get('health-check');
      healthStatus.checks.cache = {
        status: 'healthy',
        responseTime: Date.now() - cacheStart
      };
    } catch (error) {
      healthStatus.checks.cache = {
        status: 'unhealthy',
        responseTime: Date.now() - cacheStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      healthStatus.status = 'degraded';
    }

    // Check AI service
    const aiStart = Date.now();
    try {
      const aiHealth = await enhancedAIContentGenerator.healthCheck();
      healthStatus.checks.aiService = {
        status: aiHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - aiStart
      };
    } catch (error) {
      healthStatus.checks.aiService = {
        status: 'unhealthy',
        responseTime: Date.now() - aiStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      healthStatus.status = 'degraded';
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    const totalMem = require('os').totalmem();
    const usedMem = memUsage.heapUsed;
    const memUsagePercent = (usedMem / totalMem) * 100;

    if (memUsagePercent > 90) {
      healthStatus.checks.memory = {
        status: 'critical',
        usage: usedMem,
        total: totalMem
      };
      healthStatus.status = 'unhealthy';
    } else if (memUsagePercent > 70) {
      healthStatus.checks.memory = {
        status: 'warning',
        usage: usedMem,
        total: totalMem
      };
      if (healthStatus.status === 'healthy') {
        healthStatus.status = 'degraded';
      }
    } else {
      healthStatus.checks.memory = {
        status: 'healthy',
        usage: usedMem,
        total: totalMem
      };
    }

    // Determine overall status
    const unhealthyChecks = Object.values(healthStatus.checks)
      .filter(check => check.status === 'unhealthy').length;
    
    if (unhealthyChecks > 0) {
      healthStatus.status = 'unhealthy';
    }

    // Set response status
    const statusCode = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'degraded' ? 200 : 503;

    res.status(statusCode).json(healthStatus);

  } catch (error) {
    res.status(503).json({
      ...healthStatus,
      status: 'unhealthy',
      checks: {
        ...healthStatus.checks,
        database: {
          status: 'unhealthy',
          responseTime: 0,
          error: 'Health check failed'
        }
      }
    });
  }
}
```

## 6. Performance Optimization

### CDN Configuration

#### File: `config/cdn.js`

```javascript
const cdnConfig = {
  // Cloudflare configuration
  cloudflare: {
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    apiKey: process.env.CLOUDFLARE_API_KEY,
    email: process.env.CLOUDFLARE_EMAIL,
    
    // Cache rules
    cacheRules: [
      {
        name: 'Programmatic Pages',
        target: 'http.request.uri.path matches "^/(forex|crypto|stocks|commodities)/"',
        settings: {
          cache_ttl: 3600,
          browser_cache_ttl: 300,
          edge_cache_ttl: 3600
        }
      },
      {
        name: 'Country Pages',
        target: 'http.request.uri.path matches "^/country/"',
        settings: {
          cache_ttl: 7200,
          browser_cache_ttl: 600,
          edge_cache_ttl: 7200
        }
      },
      {
        name: 'Static Assets',
        target: 'http.request.uri.path matches "^/static/"',
        settings: {
          cache_ttl: 86400,
          browser_cache_ttl: 86400,
          edge_cache_ttl: 86400
        }
      }
    ],

    // Page rules
    pageRules: [
      {
        pattern: '*/api/*',
        settings: {
          cache_level: 'bypass',
          security_level: 'high'
        }
      },
      {
        pattern: '*/admin/*',
        settings: {
          cache_level: 'bypass',
          security_level: 'high',
          waf: 'on'
        }
      }
    ]
  },

  // Vercel Edge configuration
  vercel: {
    regions: ['iad1', 'hnd1', 'fra1'],
    functions: {
      'pages/api/**/*.ts': {
        maxDuration: 30,
        memory: 1024
      }
    }
  }
};

module.exports = cdnConfig;
```

### Performance Monitoring

#### File: `middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { metrics } from './config/monitoring';

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const url = request.nextUrl.pathname;

  // Add performance tracking
  const response = NextResponse.next();

  // Track page load time
  if (url.startsWith('/forex') || url.startsWith('/crypto') || 
      url.startsWith('/stocks') || url.startsWith('/country')) {
    response.headers.set('x-start-time', startTime.toString());
  }

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add caching headers for static assets
  if (url.startsWith('/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## 7. Backup and Recovery

### Database Backup Script

#### File: `scripts/backup.sh`

```bash
#!/bin/bash

set -e

ENVIRONMENT=${1:-production}
BACKUP_TYPE=${2:-full}

echo "💾 Starting database backup for $ENVIRONMENT ($BACKUP_TYPE)..."

# Load environment variables
if [ "$ENVIRONMENT" = "production" ]; then
    source .env.production
elif [ "$ENVIRONMENT" = "staging" ]; then
    source .env.staging
else
    echo "❌ Unknown environment: $ENVIRONMENT"
    exit 1
fi

# Create backup directory
BACKUP_DIR="backups/$(date +%Y/%m/%d)"
mkdir -p "$BACKUP_DIR"

# Generate backup filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_${ENVIRONMENT}_${BACKUP_TYPE}_${TIMESTAMP}.sql"

echo "📁 Backup file: $BACKUP_FILE"

# Perform backup based on type
if [ "$BACKUP_TYPE" = "full" ]; then
    echo "🔄 Creating full backup..."
    pg_dump $DATABASE_URL > "$BACKUP_FILE"
elif [ "$BACKUP_TYPE" = "schema" ]; then
    echo "🔄 Creating schema backup..."
    pg_dump $DATABASE_URL --schema-only > "$BACKUP_FILE"
elif [ "$BACKUP_TYPE" = "data" ]; then
    echo "🔄 Creating data backup..."
    pg_dump $DATABASE_URL --data-only > "$BACKUP_FILE"
else
    echo "❌ Unknown backup type: $BACKUP_TYPE"
    exit 1
fi

# Compress backup
echo "🗜️ Compressing backup..."
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
echo "☁️ Uploading to cloud storage..."
aws s3 cp "$BACKUP_FILE" "s3://your-backup-bucket/database/"

# Clean up old backups (keep last 30 days)
echo "🧹 Cleaning up old backups..."
find backups/ -type f -name "*.gz" -mtime +30 -delete

# Verify backup
echo "✅ Verifying backup..."
gunzip -t "$BACKUP_FILE"

echo "✅ Backup completed successfully!"
echo "📍 Location: $BACKUP_FILE"
```

### Recovery Script

#### File: `scripts/restore.sh`

```bash
#!/bin/bash

set -e

ENVIRONMENT=${1:-production}
BACKUP_FILE=${2}

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Backup file is required"
    echo "Usage: ./scripts/restore.sh [environment] [backup_file]"
    exit 1
fi

echo "🔄 Starting database restore for $ENVIRONMENT..."
echo "📁 Backup file: $BACKUP_FILE"

# Load environment variables
if [ "$ENVIRONMENT" = "production" ]; then
    source .env.production
elif [ "$ENVIRONMENT" = "staging" ]; then
    source .env.staging
else
    echo "❌ Unknown environment: $ENVIRONMENT"
    exit 1
fi

# Download backup from cloud storage if needed
if [[ ! "$BACKUP_FILE" =~ ^s3:// ]]; then
    echo "☁️ Downloading backup from cloud storage..."
    aws s3 cp "s3://your-backup-bucket/database/$BACKUP_FILE" "/tmp/$BACKUP_FILE"
    BACKUP_FILE="/tmp/$BACKUP_FILE"
fi

# Create backup of current database before restore
echo "💾 Creating backup of current database..."
./scripts/backup.sh "$ENVIRONMENT" "pre-restore"

# Restore database
echo "🔄 Restoring database..."
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | psql $DATABASE_URL
else
    psql $DATABASE_URL < "$BACKUP_FILE"
fi

# Verify restore
echo "✅ Verifying restore..."
psql $DATABASE_URL -c "SELECT COUNT(*) FROM programmatic_pages;"

echo "✅ Database restore completed successfully!"
```

## 8. Maintenance Procedures

### Content Refresh Job

#### File: `scripts/refresh-content.sh`

```bash
#!/bin/bash

set -e

echo "🔄 Starting content refresh job..."

# Load environment variables
source .env.production

# Get list of pages to refresh
PAGES_TO_REFRESH=$(psql $DATABASE_URL -t -c "
  SELECT id, type, category, country 
  FROM programmatic_pages 
  WHERE updated_at < NOW() - INTERVAL '7 days'
  ORDER BY updated_at ASC
  LIMIT 50;
")

# Refresh each page
echo "$PAGES_TO_REFRESH" | while read -r id type category country; do
  if [ -n "$id" ]; then
    echo "🔄 Refreshing page $id ($type, $category, $country)..."
    
    # Call API to refresh page
    curl -X POST \
      -H "Authorization: Bearer $INTERNAL_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"pageId\": \"$id\"}" \
      "$NEXT_PUBLIC_API_URL/api/programmatic/pages/refresh"
    
    echo "✅ Page $id refreshed"
  fi
done

echo "✅ Content refresh job completed!"
```

### Cache Cleanup Job

#### File: `scripts/cleanup-cache.sh`

```bash
#!/bin/bash

set -e

echo "🧹 Starting cache cleanup job..."

# Load environment variables
source .env.production

# Clear expired cache entries
echo "🗑️ Clearing expired cache entries..."
redis-cli -u $REDIS_URL --scan --pattern "cache:*" | \
  xargs -I {} redis-cli -u $REDIS_URL --eval scripts/check-cache-expiry.js {}

# Clear orphaned cache entries
echo "🗑️ Clearing orphaned cache entries..."
redis-cli -u $REDIS_URL --scan --pattern "page:*" | \
  xargs -I {} redis-cli -u $REDIS_URL --eval scripts/check-page-exists.js {}

# Optimize memory usage
echo "🔧 Optimizing memory usage..."
redis-cli -u $REDIS_URL MEMORY PURGE

# Get cache statistics
echo "📊 Cache statistics:"
redis-cli -u $REDIS_URL INFO memory | grep used_memory_human
redis-cli -u $REDIS_URL INFO stats | grep keyspace

echo "✅ Cache cleanup job completed!"
```

## 9. Deployment Checklist

### Pre-Deployment Checklist

```markdown
## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] Code coverage > 80%
- [ ] No linting errors
- [ ] TypeScript compilation successful
- [ ] Security scan passed

### Database
- [ ] Database backup created
- [ ] Migration scripts tested
- [ ] Rollback plan prepared
- [ ] Schema changes reviewed

### Performance
- [ ] Load testing completed
- [ ] Performance benchmarks met
- [ ] Cache configuration verified
- [ ] CDN configuration updated

### Security
- [ ] Environment variables secured
- [ ] SSL certificates valid
- [ ] Security headers configured
- [ ] Access controls reviewed

### Monitoring
- [ ] Monitoring dashboards configured
- [ ] Alert rules set up
- [ ] Log aggregation working
- [ ] Health checks configured

### Documentation
- [ ] Deployment guide updated
- [ ] Runbook prepared
- [ ] Team notified
- [ ] Release notes prepared
```

### Post-Deployment Checklist

```markdown
## Post-Deployment Checklist

### Verification
- [ ] Application responding correctly
- [ ] Database connectivity verified
- [ ] Cache system working
- [ ] AI service accessible

### Monitoring
- [ ] Error rates normal
- [ ] Response times acceptable
- [ ] Memory usage stable
- [ ] Database performance good

### SEO
- [ ] Sitemap generated
- [ ] Robots.txt updated
- [ ] Meta tags correct
- [ ] Structured data valid

### User Testing
- [ ] Key user journeys tested
- [ ] Programmatic pages loading
- [ ] Search functionality working
- [ ] Mobile responsive

### Rollback Plan
- [ ] Rollback procedure tested
- [ ] Backup verified
- [ ] Team on standby
- [ ] Communication plan ready
```

This comprehensive deployment guide ensures the programmatic SEO system can be deployed reliably to production with proper monitoring, backup, and maintenance procedures in place.