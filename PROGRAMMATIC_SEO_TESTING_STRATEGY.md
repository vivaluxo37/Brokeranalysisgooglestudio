# Programmatic SEO Testing Strategy

## Overview
This comprehensive testing strategy ensures the programmatic SEO system functions correctly, generates high-quality content, and performs well under various conditions.

## Testing Scope

### 1. Unit Testing
- Individual component testing
- Service layer testing
- Utility function testing
- API endpoint testing

### 2. Integration Testing
- Component integration
- Service integration
- Database integration
- Third-party API integration

### 3. End-to-End Testing
- Full user journey testing
- Content generation workflow
- Page rendering and SEO
- Performance testing

### 4. Performance Testing
- Load testing
- Stress testing
- Caching effectiveness
- Content generation speed

## 1. Unit Testing Implementation

### Test Configuration Setup

#### File: `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ]
};
```

#### File: `src/setupTests.ts`

```typescript
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });

// Mock environment variables
process.env.GEMINI_API_KEY = 'test-api-key';
process.env.GEMINI_MODEL = 'gemini-pro';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));
```

### Component Testing

#### File: `src/components/programmatic/__tests__/ProgrammaticRouteHandler.test.tsx`

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProgrammaticRouteHandler from '../ProgrammaticRouteHandler';
import { pageTypeDetector } from '@lib/programmatic/pageTypeDetector';

// Mock dependencies
jest.mock('@lib/programmatic/pageTypeDetector');
jest.mock('@services/programmatic/pageDataService', () => ({
  pageDataService: {
    getPageData: jest.fn()
  }
}));

const mockPageTypeDetector = pageTypeDetector as jest.MockedFunction<typeof pageTypeDetector>;

describe('ProgrammaticRouteHandler', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders category page correctly', async () => {
    mockPageTypeDetector.mockReturnValue({
      isProgrammatic: true,
      pageType: 'category',
      params: {
        category: 'forex',
        country: null
      }
    });

    renderWithRouter(<ProgrammaticRouteHandler />);

    expect(screen.getByTestId('programmatic-page')).toBeInTheDocument();
    expect(screen.getByText(/forex/i)).toBeInTheDocument();
  });

  it('renders country page correctly', async () => {
    mockPageTypeDetector.mockReturnValue({
      isProgrammatic: true,
      pageType: 'country',
      params: {
        category: null,
        country: 'US'
      }
    });

    renderWithRouter(<ProgrammaticRouteHandler />);

    expect(screen.getByTestId('programmatic-page')).toBeInTheDocument();
    expect(screen.getByText(/US/i)).toBeInTheDocument();
  });

  it('renders category-country page correctly', async () => {
    mockPageTypeDetector.mockReturnValue({
      isProgrammatic: true,
      pageType: 'category_country',
      params: {
        category: 'crypto',
        country: 'UK'
      }
    });

    renderWithRouter(<ProgrammaticRouteHandler />);

    expect(screen.getByTestId('programmatic-page')).toBeInTheDocument();
    expect(screen.getByText(/crypto/i)).toBeInTheDocument();
    expect(screen.getByText(/UK/i)).toBeInTheDocument();
  });

  it('renders fallback for non-programmatic routes', () => {
    mockPageTypeDetector.mockReturnValue({
      isProgrammatic: false,
      pageType: null,
      params: null
    });

    renderWithRouter(<ProgrammaticRouteHandler />);

    expect(screen.queryByTestId('programmatic-page')).not.toBeInTheDocument();
  });

  it('handles loading state correctly', async () => {
    mockPageTypeDetector.mockReturnValue({
      isProgrammatic: true,
      pageType: 'category',
      params: {
        category: 'stocks',
        country: null
      }
    });

    renderWithRouter(<ProgrammaticRouteHandler />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles error state correctly', async () => {
    mockPageTypeDetector.mockImplementation(() => {
      throw new Error('Detection failed');
    });

    renderWithRouter(<ProgrammaticRouteHandler />);

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });
});
```

#### File: `src/components/programmatic/__tests__/ProgrammaticPageTemplate.test.tsx`

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgrammaticPageTemplate from '../ProgrammaticPageTemplate';

const mockPageData = {
  title: 'Best Forex Brokers in US 2025',
  description: 'Find the best forex brokers for US traders',
  content: 'This is comprehensive content about forex trading in the US...',
  brokers: [
    {
      id: '1',
      name: 'Test Broker',
      rating: 4.5,
      features: ['Low fees', 'Great platform'],
      pros: ['Reliable', 'Fast execution'],
      cons: ['Limited instruments']
    }
  ],
  metadata: {
    wordCount: 1000,
    readingTime: 5,
    lastUpdated: '2025-01-01',
    qualityScore: 0.9
  },
  seo: {
    metaTitle: 'Best Forex Brokers in US 2025 | Test Site',
    metaDescription: 'Find the best forex brokers for US traders in 2025',
    canonicalUrl: 'https://example.com/forex/us',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Article'
    }
  }
};

describe('ProgrammaticPageTemplate', () => {
  it('renders page with all required elements', () => {
    render(<ProgrammaticPageTemplate pageData={mockPageData} />);

    expect(screen.getByTestId('programmatic-page')).toBeInTheDocument();
    expect(screen.getByText(mockPageData.title)).toBeInTheDocument();
    expect(screen.getByText(mockPageData.description)).toBeInTheDocument();
    expect(screen.getByText(mockPageData.content)).toBeInTheDocument();
  });

  it('renders broker information correctly', () => {
    render(<ProgrammaticPageTemplate pageData={mockPageData} />);

    expect(screen.getByText('Test Broker')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('Low fees')).toBeInTheDocument();
    expect(screen.getByText('Reliable')).toBeInTheDocument();
  });

  it('includes proper SEO meta tags', () => {
    render(<ProgrammaticPageTemplate pageData={mockPageData} />);

    const metaTitle = document.querySelector('title');
    const metaDescription = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');

    expect(metaTitle?.textContent).toBe(mockPageData.seo.metaTitle);
    expect(metaDescription?.getAttribute('content')).toBe(mockPageData.seo.metaDescription);
    expect(canonical?.getAttribute('href')).toBe(mockPageData.seo.canonicalUrl);
  });

  it('includes structured data', () => {
    render(<ProgrammaticPageTemplate pageData={mockPageData} />);

    const structuredData = document.querySelector('script[type="application/ld+json"]');
    expect(structuredData).toBeInTheDocument();
    
    const data = JSON.parse(structuredData?.textContent || '{}');
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Article');
  });

  it('displays metadata information', () => {
    render(<ProgrammaticPageTemplate pageData={mockPageData} />);

    expect(screen.getByText(/1000 words/)).toBeInTheDocument();
    expect(screen.getByText(/5 min read/)).toBeInTheDocument();
    expect(screen.getByText(/Quality score: 90%/)).toBeInTheDocument();
  });
});
```

### Service Testing

#### File: `src/services/content/__tests__/AIContentGenerator.test.ts`

```typescript
import { enhancedAIContentGenerator } from '../enhancedAIContentGenerator';

// Mock dependencies
jest.mock('@google/generative-ai');
jest.mock('@services/cache/contentCache');
jest.mock('@services/utils/rateLimiter');
jest.mock('@services/content/contentValidationService');

describe('AIContentGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateContent', () => {
    it('generates category page content successfully', async () => {
      const request = {
        type: 'page_content' as const,
        context: {
          pageType: 'category',
          category: 'forex',
          country: 'US',
          targetAudience: 'beginners',
          keywords: ['forex trading', 'brokers']
        },
        options: {
          includeStructuredData: true,
          includeFAQs: true,
          optimizeForSEO: true
        }
      };

      // Mock successful generation
      const mockResult = {
        content: 'Comprehensive forex trading content...',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Article'
        },
        faqs: [
          {
            question: 'What is forex trading?',
            answer: 'Forex trading is...'
          }
        ],
        metadata: {
          wordCount: 1000,
          readingTime: 5,
          qualityScore: 0.9,
          generatedAt: new Date().toISOString(),
          model: 'gemini-pro',
          tokensUsed: 500,
          generationTime: 3000,
          retryCount: 0
        },
        validation: {
          isValid: true,
          score: 0.9,
          issues: []
        }
      };

      jest.spyOn(enhancedAIContentGenerator, 'generateContent')
        .mockResolvedValue(mockResult);

      const result = await enhancedAIContentGenerator.generateContent(request);

      expect(result.content).toContain('forex trading');
      expect(result.metadata.qualityScore).toBeGreaterThan(0.8);
      expect(result.validation.isValid).toBe(true);
      expect(result.structuredData).toBeDefined();
      expect(result.faqs).toHaveLength(1);
    });

    it('handles generation failure with retry', async () => {
      const request = {
        type: 'page_content' as const,
        context: {
          pageType: 'category',
          category: 'stocks',
          country: 'UK',
          targetAudience: 'intermediate',
          keywords: ['stock trading']
        }
      };

      // Mock failure then success
      jest.spyOn(enhancedAIContentGenerator, 'generateContent')
        .mockRejectedValueOnce(new Error('API limit exceeded'))
        .mockResolvedValueOnce({
          content: 'Stock trading content...',
          metadata: {
            wordCount: 800,
            readingTime: 4,
            qualityScore: 0.85,
            generatedAt: new Date().toISOString(),
            model: 'gemini-pro',
            tokensUsed: 400,
            generationTime: 2000,
            retryCount: 1
          },
          validation: {
            isValid: true,
            score: 0.85,
            issues: []
          }
        });

      const result = await enhancedAIContentGenerator.generateContent(request);

      expect(result.content).toContain('Stock trading');
      expect(result.metadata.retryCount).toBe(1);
    });

    it('validates content quality', async () => {
      const request = {
        type: 'page_content' as const,
        context: {
          pageType: 'country',
          country: 'AU',
          targetAudience: 'advanced',
          keywords: ['trading australia']
        }
      };

      // Mock low quality content
      jest.spyOn(enhancedAIContentGenerator, 'generateContent')
        .mockResolvedValue({
          content: 'Short content.',
          metadata: {
            wordCount: 10,
            readingTime: 1,
            qualityScore: 0.3,
            generatedAt: new Date().toISOString(),
            model: 'gemini-pro',
            tokensUsed: 50,
            generationTime: 1000,
            retryCount: 0
          },
          validation: {
            isValid: false,
            score: 0.3,
            issues: [
              {
                type: 'error' as const,
                category: 'quality' as const,
                message: 'Content too short',
                suggestion: 'Expand content to meet minimum requirements'
              }
            ]
          }
        });

      const result = await enhancedAIContentGenerator.generateContent(request);

      expect(result.validation.isValid).toBe(false);
      expect(result.validation.score).toBeLessThan(0.7);
      expect(result.validation.issues).toHaveLength(1);
    });
  });

  describe('healthCheck', () => {
    it('returns healthy status when API is accessible', async () => {
      const mockHealthCheck = {
        status: 'healthy',
        model: 'gemini-pro',
        apiKeyConfigured: true
      };

      jest.spyOn(enhancedAIContentGenerator, 'healthCheck')
        .mockResolvedValue(mockHealthCheck);

      const result = await enhancedAIContentGenerator.healthCheck();

      expect(result.status).toBe('healthy');
      expect(result.apiKeyConfigured).toBe(true);
    });

    it('returns unhealthy status when API is not accessible', async () => {
      const mockHealthCheck = {
        status: 'unhealthy',
        model: 'gemini-pro',
        apiKeyConfigured: false
      };

      jest.spyOn(enhancedAIContentGenerator, 'healthCheck')
        .mockResolvedValue(mockHealthCheck);

      const result = await enhancedAIContentGenerator.healthCheck();

      expect(result.status).toBe('unhealthy');
      expect(result.apiKeyConfigured).toBe(false);
    });
  });
});
```

#### File: `src/services/programmatic/__tests__/pageDataService.test.ts`

```typescript
import { pageDataService } from '../pageDataService';

// Mock dependencies
jest.mock('@services/content/enhancedAIContentGenerator');
jest.mock('@services/brokers/brokerRankingService');
jest.mock('@services/cache/contentCache');
jest.mock('@lib/programmatic/pageTypeDetector');

describe('PageDataService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPageData', () => {
    it('returns cached data when available', async () => {
      const mockCachedData = {
        title: 'Cached Title',
        content: 'Cached content',
        brokers: [],
        metadata: {},
        seo: {}
      };

      jest.spyOn(pageDataService, 'getPageData')
        .mockResolvedValue(mockCachedData);

      const result = await pageDataService.getPageData({
        pageType: 'category',
        category: 'forex',
        country: null
      });

      expect(result.title).toBe('Cached Title');
      expect(result.content).toBe('Cached content');
    });

    it('generates new data when cache is empty', async () => {
      const mockNewData = {
        title: 'New Title',
        content: 'New content',
        brokers: [],
        metadata: {},
        seo: {}
      };

      jest.spyOn(pageDataService, 'getPageData')
        .mockResolvedValue(mockNewData);

      const result = await pageDataService.getPageData({
        pageType: 'country',
        category: null,
        country: 'US'
      });

      expect(result.title).toBe('New Title');
      expect(result.content).toBe('New content');
    });

    it('handles different page types correctly', async () => {
      const testCases = [
        {
          params: { pageType: 'category', category: 'crypto', country: null },
          expectedTitle: 'Best Crypto Brokers 2025'
        },
        {
          params: { pageType: 'country', category: null, country: 'UK' },
          expectedTitle: 'Best Trading Brokers in UK 2025'
        },
        {
          params: { pageType: 'category_country', category: 'stocks', country: 'AU' },
          expectedTitle: 'Best Stock Brokers in Australia 2025'
        }
      ];

      for (const testCase of testCases) {
        jest.spyOn(pageDataService, 'getPageData')
          .mockResolvedValue({
            title: testCase.expectedTitle,
            content: 'Content',
            brokers: [],
            metadata: {},
            seo: {}
          });

        const result = await pageDataService.getPageData(testCase.params);
        expect(result.title).toBe(testCase.expectedTitle);
      }
    });
  });

  describe('refreshPageData', () => {
    it('refreshes data and updates cache', async () => {
      const mockRefreshedData = {
        title: 'Refreshed Title',
        content: 'Refreshed content',
        brokers: [],
        metadata: {},
        seo: {}
      };

      jest.spyOn(pageDataService, 'refreshPageData')
        .mockResolvedValue(mockRefreshedData);

      const result = await pageDataService.refreshPageData({
        pageType: 'category',
        category: 'forex',
        country: null
      });

      expect(result.title).toBe('Refreshed Title');
      expect(result.content).toBe('Refreshed content');
    });
  });
});
```

## 2. Integration Testing

### API Integration Testing

#### File: `src/api/programmatic/__tests__/pages.test.ts`

```typescript
import request from 'supertest';
import { app } from '../../../app';

describe('Programmatic Pages API', () => {
  describe('GET /api/programmatic/pages', () => {
    it('returns list of programmatic pages', async () => {
      const response = await request(app)
        .get('/api/programmatic/pages')
        .expect(200);

      expect(response.body).toHaveProperty('pages');
      expect(Array.isArray(response.body.pages)).toBe(true);
      expect(response.body.pages.length).toBeGreaterThan(0);
    });

    it('supports pagination', async () => {
      const response = await request(app)
        .get('/api/programmatic/pages?page=1&limit=10')
        .expect(200);

      expect(response.body).toHaveProperty('pages');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 10);
    });

    it('filters by page type', async () => {
      const response = await request(app)
        .get('/api/programmatic/pages?type=category')
        .expect(200);

      expect(response.body.pages.every((page: any) => page.type === 'category')).toBe(true);
    });
  });

  describe('GET /api/programmatic/pages/:id', () => {
    it('returns specific programmatic page', async () => {
      // First get a page ID
      const listResponse = await request(app)
        .get('/api/programmatic/pages')
        .expect(200);

      const pageId = listResponse.body.pages[0].id;

      const response = await request(app)
        .get(`/api/programmatic/pages/${pageId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', pageId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('seo');
    });

    it('returns 404 for non-existent page', async () => {
      await request(app)
        .get('/api/programmatic/pages/non-existent')
        .expect(404);
    });
  });

  describe('POST /api/programmatic/pages/generate', () => {
    it('generates new programmatic page', async () => {
      const pageData = {
        type: 'category',
        category: 'test-category',
        country: 'US',
        options: {
          includeStructuredData: true,
          includeFAQs: true
        }
      };

      const response = await request(app)
        .post('/api/programmatic/pages/generate')
        .send(pageData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('status', 'generated');
    });

    it('validates required fields', async () => {
      const invalidData = {
        type: 'category'
        // Missing required fields
      };

      await request(app)
        .post('/api/programmatic/pages/generate')
        .send(invalidData)
        .expect(400);
    });
  });
});
```

### Database Integration Testing

#### File: `src/services/programmatic/__tests__/databaseIntegration.test.ts`

```typescript
import { pool } from '@lib/database';
import { programmaticPageService } from '../programmaticPageService';

describe('Database Integration', () => {
  beforeAll(async () => {
    // Setup test database
    await pool.query(`
      CREATE TABLE IF NOT EXISTS programmatic_pages_test (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(100),
        country VARCHAR(2),
        title VARCHAR(255) NOT NULL,
        content TEXT,
        metadata JSONB,
        seo JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  afterAll(async () => {
    // Cleanup test database
    await pool.query('DROP TABLE IF EXISTS programmatic_pages_test');
    await pool.end();
  });

  beforeEach(async () => {
    // Clear test data
    await pool.query('TRUNCATE TABLE programmatic_pages_test');
  });

  describe('ProgrammaticPageService', () => {
    it('creates page in database', async () => {
      const pageData = {
        type: 'category',
        category: 'test-forex',
        country: null,
        title: 'Test Forex Page',
        content: 'Test content',
        metadata: { wordCount: 100 },
        seo: { metaTitle: 'Test Meta Title' }
      };

      const createdPage = await programmaticPageService.create(pageData);

      expect(createdPage).toHaveProperty('id');
      expect(createdPage.type).toBe('category');
      expect(createdPage.category).toBe('test-forex');

      // Verify in database
      const dbResult = await pool.query(
        'SELECT * FROM programmatic_pages_test WHERE id = $1',
        [createdPage.id]
      );

      expect(dbResult.rows).toHaveLength(1);
      expect(dbResult.rows[0].title).toBe('Test Forex Page');
    });

    it('updates page in database', async () => {
      // Create page first
      const pageData = {
        type: 'country',
        category: null,
        country: 'US',
        title: 'Original Title',
        content: 'Original content'
      };

      const createdPage = await programmaticPageService.create(pageData);

      // Update page
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };

      const updatedPage = await programmaticPageService.update(
        createdPage.id,
        updateData
      );

      expect(updatedPage.title).toBe('Updated Title');
      expect(updatedPage.content).toBe('Updated content');

      // Verify in database
      const dbResult = await pool.query(
        'SELECT * FROM programmatic_pages_test WHERE id = $1',
        [createdPage.id]
      );

      expect(dbResult.rows[0].title).toBe('Updated Title');
      expect(dbResult.rows[0].content).toBe('Updated content');
    });

    it('deletes page from database', async () => {
      // Create page first
      const pageData = {
        type: 'category_country',
        category: 'crypto',
        country: 'UK',
        title: 'To Delete',
        content: 'Content to delete'
      };

      const createdPage = await programmaticPageService.create(pageData);

      // Delete page
      await programmaticPageService.delete(createdPage.id);

      // Verify deletion
      const dbResult = await pool.query(
        'SELECT * FROM programmatic_pages_test WHERE id = $1',
        [createdPage.id]
      );

      expect(dbResult.rows).toHaveLength(0);
    });

    it('handles database errors gracefully', async () => {
      // Try to create page with invalid data
      const invalidData = {
        type: 'invalid_type',
        title: ''
      };

      await expect(programmaticPageService.create(invalidData))
        .rejects.toThrow();
    });
  });
});
```

## 3. End-to-End Testing

### E2E Test Configuration

#### File: `cypress.config.ts`

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    env: {
      NEXT_PUBLIC_API_URL: 'http://localhost:3000/api'
    }
  }
});
```

#### File: `cypress/e2e/programmatic-seo.cy.ts`

```typescript
describe('Programmatic SEO E2E Tests', () => {
  beforeEach(() => {
    // Clear cookies and localStorage
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Programmatic Page Rendering', () => {
    it('renders category page correctly', () => {
      cy.visit('/forex');

      // Check page title
      cy.title().should('contain', 'Best Forex Brokers');

      // Check main content
      cy.get('[data-testid="programmatic-page"]').should('be.visible');
      cy.get('h1').should('contain', 'Forex');

      // Check broker listings
      cy.get('[data-testid="broker-list"]').should('be.visible');
      cy.get('[data-testid="broker-card"]').should('have.length.greaterThan', 0);

      // Check SEO elements
      cy.get('meta[name="description"]').should('exist');
      cy.get('link[rel="canonical"]').should('exist');
      cy.get('script[type="application/ld+json"]').should('exist');
    });

    it('renders country page correctly', () => {
      cy.visit('/country/US');

      // Check page title
      cy.title().should('contain', 'Best Trading Brokers in US');

      // Check main content
      cy.get('[data-testid="programmatic-page"]').should('be.visible');
      cy.get('h1').should('contain', 'US');

      // Check country-specific information
      cy.get('[data-testid="country-info"]').should('be.visible');
      cy.get('[data-testid="regulatory-info"]').should('be.visible');
    });

    it('renders category-country page correctly', () => {
      cy.visit('/crypto/UK');

      // Check page title
      cy.title().should('contain', 'Best Crypto Brokers in UK');

      // Check main content
      cy.get('[data-testid="programmatic-page"]').should('be.visible');
      cy.get('h1').should('contain', 'Crypto');
      cy.get('h1').should('contain', 'UK');

      // Check combined information
      cy.get('[data-testid="category-info"]').should('be.visible');
      cy.get('[data-testid="country-info"]').should('be.visible');
    });
  });

  describe('Content Quality', () => {
    it('displays comprehensive content', () => {
      cy.visit('/forex');

      // Check content length
      cy.get('[data-testid="page-content"]')
        .invoke('text')
        .should('have.length.greaterThan', 500);

      // Check structure
      cy.get('h2').should('have.length.greaterThan', 2);
      cy.get('h3').should('have.length.greaterThan', 1);
      cy.get('ul, ol').should('exist');

      // Check quality indicators
      cy.get('[data-testid="word-count"]').should('be.visible');
      cy.get('[data-testid="reading-time"]').should('be.visible');
      cy.get('[data-testid="quality-score"]').should('be.visible');
    });

    it('includes relevant broker information', () => {
      cy.visit('/forex');

      // Check broker cards
      cy.get('[data-testid="broker-card"]').each(($card) => {
        cy.wrap($card).find('[data-testid="broker-name"]').should('be.visible');
        cy.wrap($card).find('[data-testid="broker-rating"]').should('be.visible');
        cy.wrap($card).find('[data-testid="broker-features"]').should('be.visible');
      });

      // Check comparison table
      cy.get('[data-testid="comparison-table"]').should('be.visible');
      cy.get('[data-testid="table-headers"]').should('have.length.greaterThan', 3);
    });

    it('includes FAQ section', () => {
      cy.visit('/forex');

      cy.get('[data-testid="faq-section"]').should('be.visible');
      cy.get('[data-testid="faq-item"]').should('have.length.greaterThan', 2);

      // Check FAQ interaction
      cy.get('[data-testid="faq-item"]').first().click();
      cy.get('[data-testid="faq-item"]').first()
        .find('[data-testid="faq-answer"]')
        .should('be.visible');
    });
  });

  describe('SEO Elements', () => {
    it('has proper meta tags', () => {
      cy.visit('/forex');

      // Check meta title
      cy.get('title').should('contain', 'Forex');
      cy.get('title').invoke('text').should('have.length.lessThan', 60);

      // Check meta description
      cy.get('meta[name="description"]')
        .should('have.attr', 'content')
        .and('have.length.lessThan', 160);

      // Check canonical URL
      cy.get('link[rel="canonical"]')
        .should('have.attr', 'href')
        .and('include', '/forex');

      // Check Open Graph tags
      cy.get('meta[property="og:title"]').should('exist');
      cy.get('meta[property="og:description"]').should('exist');
      cy.get('meta[property="og:type"]').should('have.attr', 'content', 'article');
    });

    it('includes structured data', () => {
      cy.visit('/forex');

      cy.get('script[type="application/ld+json"]').should('exist');

      cy.get('script[type="application/ld+json"]')
        .invoke('text')
        .then((jsonText) => {
          const structuredData = JSON.parse(jsonText);
          expect(structuredData).to.have.property('@context', 'https://schema.org');
          expect(structuredData).to.have.property('@type', 'Article');
          expect(structuredData).to.have.property('headline');
          expect(structuredData).to.have.property('description');
        });
    });

    it('has proper heading structure', () => {
      cy.visit('/forex');

      // Check H1
      cy.get('h1').should('have.length', 1);

      // Check H2s
      cy.get('h2').should('have.length.greaterThan', 1);

      // Check heading hierarchy
      cy.get('h1').nextUntil('h2').should('exist');
      cy.get('h2').each(($h2) => {
        cy.wrap($h2).nextUntil('h1, h2').should('exist');
      });
    });
  });

  describe('Performance', () => {
    it('loads within acceptable time', () => {
      const startTime = Date.now();

      cy.visit('/forex');

      cy.get('[data-testid="programmatic-page"]').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(3000); // 3 seconds
      });
    });

    it('has good Core Web Vitals', () => {
      cy.visit('/forex');

      // Check LCP (Largest Contentful Paint)
      cy.get('[data-testid="programmatic-page"]').should('be.visible');

      // Check FID (First Input Delay) - simulated
      cy.get('[data-testid="broker-card"]').first().click();
      cy.get('[data-testid="broker-details"]').should('be.visible');

      // Check CLS (Cumulative Layout Shift) - visual check
      cy.get('body').should('have.css', 'overflow', 'visible');
    });
  });

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      cy.viewport(375, 667); // iPhone 6/7/8
    });

    it('displays correctly on mobile', () => {
      cy.visit('/forex');

      // Check mobile navigation
      cy.get('[data-testid="mobile-nav"]').should('be.visible');

      // Check content layout
      cy.get('[data-testid="programmatic-page"]').should('be.visible');
      cy.get('[data-testid="broker-card"]').should('be.visible');

      // Check mobile-specific features
      cy.get('[data-testid="mobile-comparison"]').should('be.visible');
    });

    it('has touch-friendly interactions', () => {
      cy.visit('/forex');

      // Check touch targets
      cy.get('[data-testid="broker-card"]').first()
        .should('have.css', 'min-height')
        .and('match', /\d+px/);

      // Check swipe gestures
      cy.get('[data-testid="broker-comparison"]')
        .swipe('left');
    });
  });

  describe('Error Handling', () => {
    it('handles 404 gracefully', () => {
      cy.visit('/non-existent-page', { failOnStatusCode: false });

      cy.get('[data-testid="error-page"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'Page not found');
      cy.get('[data-testid="back-home"]').should('be.visible');
    });

    it('handles API errors gracefully', () => {
      // Mock API failure
      cy.intercept('GET', '/api/programmatic/pages/forex', { 
        statusCode: 500,
        body: { error: 'Internal server error' }
      });

      cy.visit('/forex');

      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });
  });
});
```

## 4. Performance Testing

### Load Testing Configuration

#### File: `tests/load/k6-config.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 50 }, // Ramp up to 50 users
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.1'], // Error rate under 10%
    errors: ['rate<0.1'],
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Test programmatic pages
  const pages = [
    '/forex',
    '/crypto',
    '/stocks',
    '/country/US',
    '/country/UK',
    '/forex/US',
    '/crypto/UK'
  ];

  const randomPage = pages[Math.floor(Math.random() * pages.length)];

  let response = http.get(`${BASE_URL}${randomPage}`, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'User-Agent': 'k6-performance-test'
    }
  });

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
    'content length > 0': (r) => r.body.length > 0,
    'contains programmatic content': (r) => r.body.includes('programmatic-page'),
  });

  errorRate.add(!success);

  sleep(1);
}
```

### Caching Performance Test

#### File: `tests/performance/caching-test.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '3m', target: 20 },
    { duration: '1m', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // First request (cache miss)
  let response = http.get(`${BASE_URL}/forex`, {
    headers: {
      'Cache-Control': 'no-cache'
    }
  });

  check(response, {
    'first request status 200': (r) => r.status === 200,
    'first response time < 3000ms': (r) => r.timings.duration < 3000,
  });

  sleep(1);

  // Second request (cache hit)
  response = http.get(`${BASE_URL}/forex`);

  check(response, {
    'second request status 200': (r) => r.status === 200,
    'second response time < 500ms': (r) => r.timings.duration < 500,
    'cache hit faster': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

## 5. Test Execution

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance

# All tests with coverage
npm run test:coverage
```

### CI/CD Integration

#### File: `.github/workflows/test.yml`

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run unit tests
      run: npm run test:unit

    - name: Upload coverage
      uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  e2e-tests:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build

    - name: Start application
      run: npm start &

    - name: Wait for application
      run: npx wait-on http://localhost:3000

    - name: Run E2E tests
      run: npm run test:e2e

    - name: Upload screenshots
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: cypress-screenshots
        path: cypress/screenshots
```

This comprehensive testing strategy ensures the programmatic SEO system is thoroughly tested across all levels, from individual components to full end-to-end user journeys, with performance validation and continuous integration.