describe('Broker Comparison Flow', () => {
  beforeEach(() => {
    // Set up test data - this would typically be done through API calls
    cy.intercept('GET', '/api/brokers', { fixture: 'brokers.json' }).as('getBrokers');
    cy.intercept('GET', '/api/categories', { fixture: 'categories.json' }).as('getCategories');
    cy.intercept('GET', '/api/countries', { fixture: 'countries.json' }).as('getCountries');
    
    cy.visit('/');
  });

  describe('Home Page to Broker Selection', () => {
    it('should navigate from home page to broker listing', () => {
      // Home page should load
      cy.get('[data-testid="hero-section"]').should('be.visible');
      cy.contains('Find Your Perfect Forex Broker').should('be.visible');

      // Click on "Compare Brokers" CTA
      cy.get('[data-testid="compare-brokers-cta"]').click();

      // Should navigate to brokers page
      cy.url().should('include', '/brokers');
      cy.wait('@getBrokers');
    });

    it('should display broker cards after loading', () => {
      cy.visit('/brokers');
      cy.wait('@getBrokers');

      // Should show broker cards
      cy.get('[data-testid="broker-card"]').should('have.length.greaterThan', 0);
      
      // Each card should have essential information
      cy.get('[data-testid="broker-card"]').first().within(() => {
        cy.get('[data-testid="broker-name"]').should('be.visible');
        cy.get('[data-testid="broker-rating"]').should('be.visible');
        cy.get('[data-testid="broker-regulation"]').should('be.visible');
      });
    });
  });

  describe('Broker Search and Filtering', () => {
    beforeEach(() => {
      cy.visit('/brokers');
      cy.wait('@getBrokers');
    });

    it('should filter brokers by search term', () => {
      // Get initial broker count
      cy.get('[data-testid="broker-card"]').then(($cards) => {
        const initialCount = $cards.length;

        // Search for specific broker
        cy.get('[data-testid="search-input"]').type('IG');

        // Should show fewer results
        cy.get('[data-testid="broker-card"]').should('have.length.lessThan', initialCount);
        
        // Results should contain search term
        cy.get('[data-testid="broker-card"]').each(($card) => {
          cy.wrap($card).should('contain.text', 'IG');
        });
      });
    });

    it('should filter brokers by regulation', () => {
      // Select FCA regulation filter
      cy.get('[data-testid="regulation-filter"]').select('FCA');

      // Should show only FCA regulated brokers
      cy.get('[data-testid="broker-card"]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('[data-testid="broker-regulation"]').should('contain.text', 'FCA');
        });
      });
    });

    it('should filter by minimum deposit range', () => {
      // Select low deposit filter (0-100)
      cy.get('[data-testid="min-deposit-filter"]').select('0-100');

      // Should show brokers with deposits in range
      cy.get('[data-testid="broker-card"]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('[data-testid="min-deposit"]').invoke('text').then((text) => {
            // Extract numeric value and check it's <= 100
            const deposit = parseInt(text.replace(/[^\d]/g, ''));
            expect(deposit).to.be.at.most(100);
          });
        });
      });
    });

    it('should combine multiple filters', () => {
      // Apply multiple filters
      cy.get('[data-testid="regulation-filter"]').select('FCA');
      cy.get('[data-testid="platform-filter"]').select('MT4');
      cy.get('[data-testid="min-deposit-filter"]').select('0-250');

      // Should show results matching all filters
      cy.get('[data-testid="broker-card"]').should('have.length.greaterThan', 0);
      
      cy.get('[data-testid="broker-card"]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('[data-testid="broker-regulation"]').should('contain.text', 'FCA');
          cy.get('[data-testid="broker-platforms"]').should('contain.text', 'MT4');
        });
      });
    });

    it('should clear all filters', () => {
      // Apply some filters first
      cy.get('[data-testid="regulation-filter"]').select('FCA');
      cy.get('[data-testid="search-input"]').type('test');

      // Get filtered count
      cy.get('[data-testid="broker-card"]').then(($filteredCards) => {
        const filteredCount = $filteredCards.length;

        // Clear filters
        cy.get('[data-testid="clear-filters"]').click();

        // Should show all brokers again
        cy.get('[data-testid="broker-card"]').should('have.length.greaterThan', filteredCount);
        
        // Filters should be reset
        cy.get('[data-testid="search-input"]').should('have.value', '');
        cy.get('[data-testid="regulation-filter"]').should('have.value', '');
      });
    });
  });

  describe('Broker Comparison Feature', () => {
    beforeEach(() => {
      cy.visit('/brokers');
      cy.wait('@getBrokers');
    });

    it('should add brokers to comparison', () => {
      // Select first two brokers for comparison
      cy.get('[data-testid="compare-checkbox"]').first().check();
      cy.get('[data-testid="compare-checkbox"]').eq(1).check();

      // Comparison bar should appear
      cy.get('[data-testid="comparison-bar"]').should('be.visible');
      cy.get('[data-testid="comparison-count"]').should('contain.text', '2');

      // Should show selected broker names
      cy.get('[data-testid="selected-broker"]').should('have.length', 2);
    });

    it('should navigate to comparison page', () => {
      // Add brokers to comparison
      cy.get('[data-testid="compare-checkbox"]').first().check();
      cy.get('[data-testid="compare-checkbox"]').eq(1).check();

      // Click compare button
      cy.get('[data-testid="compare-button"]').click();

      // Should navigate to comparison page
      cy.url().should('include', '/compare');
      
      // Should show comparison table
      cy.get('[data-testid="comparison-table"]').should('be.visible');
      cy.get('[data-testid="broker-column"]').should('have.length', 2);
    });

    it('should remove broker from comparison', () => {
      // Add three brokers
      cy.get('[data-testid="compare-checkbox"]').first().check();
      cy.get('[data-testid="compare-checkbox"]').eq(1).check();
      cy.get('[data-testid="compare-checkbox"]').eq(2).check();

      cy.get('[data-testid="comparison-count"]').should('contain.text', '3');

      // Remove one broker
      cy.get('[data-testid="remove-from-comparison"]').first().click();

      // Should have 2 brokers left
      cy.get('[data-testid="comparison-count"]').should('contain.text', '2');
      cy.get('[data-testid="selected-broker"]').should('have.length', 2);
    });

    it('should prevent adding more than 4 brokers', () => {
      // Try to add 5 brokers
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="compare-checkbox"]').eq(i).check({ force: true });
      }

      // Should only allow 4
      cy.get('[data-testid="comparison-count"]').should('contain.text', '4');
      cy.get('[data-testid="selected-broker"]').should('have.length', 4);

      // 5th checkbox should be disabled
      cy.get('[data-testid="compare-checkbox"]').eq(4).should('be.disabled');
    });
  });

  describe('Broker Details Page', () => {
    beforeEach(() => {
      cy.visit('/brokers');
      cy.wait('@getBrokers');
    });

    it('should navigate to broker details', () => {
      // Click on first broker card
      cy.get('[data-testid="broker-card"]').first().click();

      // Should navigate to broker details page
      cy.url().should('include', '/brokers/');
      
      // Should show broker details
      cy.get('[data-testid="broker-details"]').should('be.visible');
      cy.get('[data-testid="broker-hero"]').should('be.visible');
    });

    it('should display comprehensive broker information', () => {
      // Navigate to broker details
      cy.get('[data-testid="broker-card"]').first().click();

      // Check all sections are present
      cy.get('[data-testid="broker-overview"]').should('be.visible');
      cy.get('[data-testid="trading-conditions"]').should('be.visible');
      cy.get('[data-testid="account-types"]').should('be.visible');
      cy.get('[data-testid="platforms"]').should('be.visible');
      cy.get('[data-testid="regulation-info"]').should('be.visible');
      
      // Check key information is displayed
      cy.get('[data-testid="min-deposit"]').should('be.visible');
      cy.get('[data-testid="spreads"]').should('be.visible');
      cy.get('[data-testid="leverage"]').should('be.visible');
    });

    it('should show country availability', () => {
      cy.get('[data-testid="broker-card"]').first().click();

      // Should show countries section
      cy.get('[data-testid="countries-section"]').should('be.visible');
      
      // Should have country list or message
      cy.get('[data-testid="country-list"]').should('exist');
    });

    it('should allow adding to comparison from details page', () => {
      cy.get('[data-testid="broker-card"]').first().click();

      // Should have add to compare button
      cy.get('[data-testid="add-to-compare-btn"]').should('be.visible').click();

      // Should show in comparison bar
      cy.get('[data-testid="comparison-bar"]').should('be.visible');
      cy.get('[data-testid="comparison-count"]').should('contain.text', '1');
    });
  });

  describe('Comparison Page Functionality', () => {
    beforeEach(() => {
      cy.visit('/brokers');
      cy.wait('@getBrokers');

      // Add two brokers to comparison
      cy.get('[data-testid="compare-checkbox"]').first().check();
      cy.get('[data-testid="compare-checkbox"]').eq(1).check();
      cy.get('[data-testid="compare-button"]').click();
    });

    it('should display comparison table with all relevant data', () => {
      // Should show comparison table
      cy.get('[data-testid="comparison-table"]').should('be.visible');
      
      // Check table structure
      cy.get('[data-testid="broker-column"]').should('have.length', 2);
      
      // Check comparison rows
      cy.get('[data-testid="regulation-row"]').should('be.visible');
      cy.get('[data-testid="spreads-row"]').should('be.visible');
      cy.get('[data-testid="deposit-row"]').should('be.visible');
      cy.get('[data-testid="platforms-row"]').should('be.visible');
    });

    it('should highlight differences between brokers', () => {
      // Better values should be highlighted
      cy.get('[data-testid="highlight-best"]').should('have.length.greaterThan', 0);
      
      // Or differences should be clearly visible through styling
      cy.get('[data-testid="comparison-table"]').within(() => {
        cy.get('.bg-green-100, .text-green-600, .font-bold').should('exist');
      });
    });

    it('should allow removing brokers from comparison', () => {
      // Remove one broker
      cy.get('[data-testid="remove-broker-btn"]').first().click();

      // Should show only one broker
      cy.get('[data-testid="broker-column"]').should('have.length', 1);
    });

    it('should allow adding more brokers to comparison', () => {
      // Should have add broker button
      cy.get('[data-testid="add-more-brokers"]').should('be.visible').click();

      // Should navigate back to brokers page with existing selection
      cy.url().should('include', '/brokers');
      cy.get('[data-testid="comparison-bar"]').should('be.visible');
      cy.get('[data-testid="comparison-count"]').should('contain.text', '2');
    });
  });

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
      cy.visit('/brokers');
      cy.wait('@getBrokers');
    });

    it('should display properly on mobile devices', () => {
      // Should show mobile-friendly layout
      cy.get('[data-testid="mobile-filter-toggle"]').should('be.visible');
      
      // Broker cards should stack vertically
      cy.get('[data-testid="broker-grid"]').should('have.class', 'grid-cols-1');
    });

    it('should show mobile filter menu', () => {
      // Open mobile filter menu
      cy.get('[data-testid="mobile-filter-toggle"]').click();
      
      // Should show filter panel
      cy.get('[data-testid="mobile-filter-panel"]').should('be.visible');
      
      // Should have all filter options
      cy.get('[data-testid="regulation-filter"]').should('be.visible');
      cy.get('[data-testid="platform-filter"]').should('be.visible');
    });

    it('should handle comparison on mobile', () => {
      // Add brokers to comparison
      cy.get('[data-testid="compare-checkbox"]').first().check();
      cy.get('[data-testid="compare-checkbox"]').eq(1).check();

      // Mobile comparison bar should appear
      cy.get('[data-testid="mobile-comparison-bar"]').should('be.visible');
      
      // Should be able to navigate to comparison
      cy.get('[data-testid="mobile-compare-button"]').click();
      cy.url().should('include', '/compare');
    });
  });

  describe('Performance and Accessibility', () => {
    it('should load quickly and be accessible', () => {
      cy.visit('/brokers');

      // Check page loads within reasonable time
      cy.get('[data-testid="broker-grid"]').should('be.visible', { timeout: 3000 });

      // Check basic accessibility
      cy.get('[data-testid="search-input"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="broker-card"]').should('have.attr', 'role', 'article');
      
      // Check keyboard navigation
      cy.get('[data-testid="search-input"]').focus().type('{tab}');
      cy.focused().should('exist');
    });

    it('should handle network errors gracefully', () => {
      // Simulate network error
      cy.intercept('GET', '/api/brokers', { forceNetworkError: true }).as('getBrokersError');
      
      cy.visit('/brokers');
      cy.wait('@getBrokersError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should('be.visible');
      
      // Should have retry button
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });

    it('should show loading states appropriately', () => {
      // Simulate slow network
      cy.intercept('GET', '/api/brokers', (req) => {
        req.reply((res) => {
          res.delay(1000);
          res.send({ fixture: 'brokers.json' });
        });
      }).as('getSlowBrokers');

      cy.visit('/brokers');

      // Should show loading state
      cy.get('[data-testid="loading-skeleton"]').should('be.visible');
      
      cy.wait('@getSlowBrokers');
      
      // Loading should disappear
      cy.get('[data-testid="loading-skeleton"]').should('not.exist');
      cy.get('[data-testid="broker-card"]').should('be.visible');
    });
  });
});