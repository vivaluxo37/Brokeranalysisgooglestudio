# Data Mapping Baseline for Database Migration

## Overview
This document defines the definitive mapping between TypeScript data structures and Supabase database schema for the comprehensive migration of 60+ brokers and blog posts.

## Current Database Schema

### Brokers Table (Primary Columns)
```sql
- id (SERIAL PRIMARY KEY)
- name (TEXT NOT NULL)
- slug (TEXT UNIQUE NOT NULL)
- description (TEXT)
- website (TEXT)
- year_founded (INTEGER)
- headquarters (TEXT)
- regulation_status (TEXT)
- minimum_deposit (INTEGER)
- overall_rating (DECIMAL(3,2))
- trust_score (DECIMAL(3,2))
- is_active (BOOLEAN DEFAULT TRUE)
- is_featured (BOOLEAN DEFAULT FALSE)
- logo_url (TEXT)
- created_at (TIMESTAMP WITH TIME ZONE DEFAULT NOW())
- updated_at (TIMESTAMP WITH TIME ZONE DEFAULT NOW())
```

### Additional JSONB Columns for Complex Data
```sql
- detailed_info (JSONB) -- For nested broker data
- trading_conditions (JSONB) -- For trading specifics
- platform_features (JSONB) -- For platform information
- security_regulation (JSONB) -- For regulatory details
- fees_structure (JSONB) -- For fee breakdown
- supported_instruments (JSONB) -- For tradable assets
```

### Blogs Table Schema
```sql
- id (SERIAL PRIMARY KEY)
- slug (TEXT UNIQUE NOT NULL)
- title (TEXT NOT NULL)
- meta_title (TEXT)
- meta_description (TEXT)
- summary (TEXT)
- content (TEXT) -- Markdown content
- author_name (TEXT)
- author_slug (TEXT)
- author_avatar (TEXT)
- date (TIMESTAMP WITH TIME ZONE)
- last_updated (TIMESTAMP WITH TIME ZONE)
- tags (TEXT[]) -- PostgreSQL array
- image_url (TEXT)
- read_time_minutes (INTEGER)
- key_takeaways (JSONB) -- Array of strings
- reviewed_by (JSONB) -- Author info object
- created_at (TIMESTAMP WITH TIME ZONE DEFAULT NOW())
- updated_at (TIMESTAMP WITH TIME ZONE DEFAULT NOW())
```

## TypeScript to Database Field Mapping

### Broker Mapping

#### Primary Fields (Direct Column Mapping)
| TypeScript Field | Database Column | Transform Required | Notes |
|------------------|-----------------|-------------------|-------|
| `id` | `slug` | Yes - slugify string ID | Use broker ID as slug |
| `name` | `name` | No | Direct mapping |
| `description` | `description` | No | Direct mapping |
| `websiteUrl` | `website` | No | Direct mapping |
| `foundingYear` | `year_founded` | No | Direct mapping |
| `headquarters` | `headquarters` | No | Direct mapping |
| `score` | `overall_rating` | Yes - divide by 10 if > 10 | Normalize to 0-10 scale |
| `logoUrl` | `logo_url` | No | Direct mapping |

#### JSONB Field Mappings

##### detailed_info JSONB Structure
```typescript
{
  summary?: string;
  pros?: string[];
  cons?: string[];
  restrictedCountries?: string[];
  coreInfo: {
    brokerType: string;
    mobileTrading: boolean;
    demoAccount: boolean;
  };
  accountTypes?: AccountType[];
  transparency: {
    audited: boolean;
    yearsInBusiness: number;
    tradingVolumeDisclosed: boolean;
    clientBase?: string;
  };
}
```

##### trading_conditions JSONB Structure
```typescript
{
  tradingConditionsExtended: {
    minTradeSize: number;
    scalpingAllowed: boolean;
    hedgingAllowed: boolean;
    eaAllowed: boolean;
    negativeBalanceProtection: boolean;
    marginCallLevel: string;
    stopOutLevel: string;
  };
  legacy: {
    spreads: { eurusd: number; gbpusd: number; usdjpy: number; };
    commission: string;
    swapFeeCategory: string;
    maxLeverage: string;
    minLotSize?: number;
  };
}
```

##### platform_features JSONB Structure
```typescript
{
  platforms: string[];
  executionType: string;
  apiAccess?: boolean;
  eaSupport?: boolean;
  charting: {
    indicators: number;
    drawingTools: number;
  };
  automatedTrading: string[];
  copyTrading: {
    available: boolean;
    platforms: string[];
  };
  backtesting: boolean;
  newsIntegration: boolean;
}
```

##### security_regulation JSONB Structure
```typescript
{
  regulatedBy: { regulator: string; licenseNumber?: string }[];
  segregatedAccounts: boolean;
  investorCompensationScheme: {
    available: boolean;
    amount?: string;
  };
  twoFactorAuth: boolean;
  regulators: string[]; // Legacy field
}
```

##### fees_structure JSONB Structure
```typescript
{
  trading: {
    spreadType: string;
    averageSpreads: { pair: string; spread: string }[];
    commissionStructure: string;
    overnightSwapFees: string;
  };
  nonTrading: {
    inactivityFee: string;
    withdrawalFee: string;
    depositFee: string;
    conversionFee?: string;
  };
}
```

##### supported_instruments JSONB Structure
```typescript
{
  forexPairs: { total: number; details: string };
  commodities: { total: number; details: string };
  indices: { total: number; details: string };
  stocks: { total: number; details: string };
  cryptocurrencies: { total: number; details: string };
  etfs?: { total: number; details: string };
}
```

### Blog Post Mapping

#### Primary Fields (Direct Column Mapping)
| TypeScript Field | Database Column | Transform Required | Notes |
|------------------|-----------------|-------------------|-------|
| `slug` | `slug` | No | Direct mapping |
| `title` | `title` | No | Direct mapping |
| `metaTitle` | `meta_title` | No | Direct mapping |
| `metaDescription` | `meta_description` | No | Direct mapping |
| `summary` | `summary` | No | Direct mapping |
| `content` | `content` | No | Direct mapping (Markdown) |
| `author.name` | `author_name` | No | Extract from author object |
| `author.slug` | `author_slug` | No | Extract from author object |
| `author.avatarUrl` | `author_avatar` | No | Extract from author object |
| `date` | `date` | Yes - ISO string to timestamp | Parse ISO 8601 |
| `lastUpdated` | `last_updated` | Yes - ISO string to timestamp | Parse ISO 8601 if exists |
| `tags` | `tags` | No | Direct array mapping |
| `imageUrl` | `image_url` | No | Direct mapping |
| `readTimeMinutes` | `read_time_minutes` | No | Direct mapping |

#### JSONB Fields
| TypeScript Field | Database Column | Notes |
|------------------|-----------------|-------|
| `keyTakeaways` | `key_takeaways` | Array of strings in JSONB |
| `reviewedBy` | `reviewed_by` | Author object in JSONB |

## Data Transformation Rules

### 1. ID/Slug Generation
- Broker IDs from TypeScript (string) → slug column (TEXT)
- Generate numeric ID as PRIMARY KEY (auto-increment)
- Ensure slug uniqueness across all brokers

### 2. Rating Normalization
- If `score > 10`, divide by 10 to get 0-10 scale
- Round to 2 decimal places
- Set trust_score = overall_rating initially

### 3. Boolean Field Handling
- All boolean fields map directly
- Default `is_active = true` for all migrated brokers
- Set `is_featured` based on existing logic or default false

### 4. Date Handling
- Convert ISO 8601 strings to PostgreSQL timestamps
- Handle timezone conversion properly
- Set created_at/updated_at to current timestamp

### 5. JSONB Serialization
- Serialize complex TypeScript objects to JSONB
- Preserve all nested structures
- Handle null/undefined values appropriately

### 6. Array Handling
- Convert TypeScript arrays to PostgreSQL arrays for simple types
- Convert complex arrays to JSONB for objects

## Migration Strategy

### Phase 1: Data Parsing (Current Status: 5 brokers migrated)
- Parse all broker and blog TypeScript files
- Validate required fields
- Identify missing or malformed data

### Phase 2: Batch Processing
- Process in batches of 50 records
- Use transactional safety for each batch
- Implement exponential backoff for errors

### Phase 3: Data Verification
- Compare record counts
- Validate JSONB structure integrity
- Spot-check complex field mappings

### Phase 4: Finalization
- Update React hooks to use database
- Remove file-based fallbacks
- Generate completion report

## Edge Cases and Special Handling

### 1. Missing Required Fields
- Generate slug from name if ID missing
- Use default values for missing ratings
- Log all data coercion applied

### 2. Data Type Mismatches
- Convert numeric strings to integers
- Handle currency symbols in deposit amounts
- Normalize country codes and regulator names

### 3. Large Content Fields
- Blog content can be very large (Markdown)
- Handle memory efficiently during parsing
- Consider content compression if needed

### 4. Duplicate Detection
- Check for duplicate slugs across brokers
- Handle blog post slug conflicts
- Implement conflict resolution strategy

This mapping baseline serves as the authoritative reference for all migration operations.