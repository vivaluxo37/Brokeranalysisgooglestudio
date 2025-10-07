# Requirements Document

## Introduction

This feature enhances the existing broker promotions page to display comprehensive promotional offers including cashback programs, deposit bonuses, commission discounts, and other trading incentives. The system will allow users to discover and compare various promotional offers from different brokers, helping them make informed decisions about which broker promotions best suit their trading needs.

## Requirements

### Requirement 1

**User Story:** As a trader, I want to view detailed cashback and rebate programs from different brokers, so that I can choose the most profitable trading arrangement for my volume and style.

#### Acceptance Criteria

1. WHEN a user visits the promotions page THEN the system SHALL display a comprehensive list of available cashback programs
2. WHEN viewing cashback programs THEN the system SHALL show rebate percentages, cashback amounts per lot, and payment frequency for each broker
3. WHEN a cashback program has tiered rates THEN the system SHALL display the different tiers based on trading volume
4. WHEN a user clicks on a cashback program THEN the system SHALL provide detailed information about activation requirements and contact methods
5. IF a cashback program requires manual activation THEN the system SHALL clearly indicate the activation process and contact information

### Requirement 2

**User Story:** As a trader, I want to compare different types of promotional offers (cashback, bonuses, discounts), so that I can evaluate the total value proposition of each broker.

#### Acceptance Criteria

1. WHEN viewing promotions THEN the system SHALL categorize offers by type (cashback, deposit bonus, commission discount, copy trading, etc.)
2. WHEN comparing promotions THEN the system SHALL display key metrics like percentage rates, dollar amounts, and eligibility requirements
3. WHEN a promotion has specific account type requirements THEN the system SHALL clearly indicate which account types are eligible
4. WHEN promotions have expiration dates THEN the system SHALL display the validity period
5. IF a promotion requires minimum deposit or volume THEN the system SHALL show these requirements prominently

### Requirement 3

**User Story:** As a trader, I want to filter and search promotional offers based on my trading preferences, so that I can quickly find relevant opportunities.

#### Acceptance Criteria

1. WHEN a user accesses the promotions page THEN the system SHALL provide filter options for promotion type, broker, rebate amount, and account type
2. WHEN applying filters THEN the system SHALL update the displayed promotions in real-time
3. WHEN searching for specific brokers THEN the system SHALL return matching results with their available promotions
4. WHEN filtering by rebate amount THEN the system SHALL allow range selection (e.g., $1-5 per lot, $5-15 per lot, $15+ per lot)
5. IF no promotions match the selected filters THEN the system SHALL display an appropriate message with suggestions

### Requirement 4

**User Story:** As a trader, I want to see broker ratings and key advantages alongside promotional offers, so that I can assess both the promotion value and broker quality.

#### Acceptance Criteria

1. WHEN viewing a promotion THEN the system SHALL display the associated broker's rating (e.g., 4.6/5 stars)
2. WHEN showing broker promotions THEN the system SHALL list key advantages like "Ultra-Low Spreads", "Copy Trading Available", "Automated Rebates"
3. WHEN a broker has multiple account types THEN the system SHALL show which promotions apply to which account types
4. WHEN displaying broker information THEN the system SHALL include platform availability (MT4/MT5, TradingView, etc.)
5. IF a broker has special features THEN the system SHALL highlight these prominently (e.g., "Highest Rebate Offer", "24/7 Payouts")

### Requirement 5

**User Story:** As a trader, I want to access promotional offers through clear call-to-action buttons, so that I can easily sign up for programs that interest me.

#### Acceptance Criteria

1. WHEN viewing a promotion THEN the system SHALL provide a clear "Get Free Cashback" or similar action button
2. WHEN clicking a promotion action button THEN the system SHALL redirect to the appropriate broker signup or activation page
3. WHEN a promotion requires special activation THEN the system SHALL provide contact information (email, Telegram, etc.)
4. WHEN displaying contact methods THEN the system SHALL format them as clickable links where appropriate
5. IF a promotion has specific signup requirements THEN the system SHALL display these before the user clicks through

### Requirement 6

**User Story:** As a trader, I want to use a rebate calculator to estimate my potential earnings, so that I can make informed decisions about which programs to join.

#### Acceptance Criteria

1. WHEN accessing the promotions page THEN the system SHALL provide access to a rebate calculator tool
2. WHEN using the calculator THEN the system SHALL allow input of trading volume, broker selection, and account type
3. WHEN calculating rebates THEN the system SHALL show estimated monthly and yearly earnings based on the selected parameters
4. WHEN changing calculator inputs THEN the system SHALL update results in real-time
5. IF calculator results exceed certain thresholds THEN the system SHALL suggest contacting for custom VIP rates

### Requirement 7

**User Story:** As a site administrator, I want to manage promotional content through an admin interface, so that I can keep offers current and accurate.

#### Acceptance Criteria

1. WHEN accessing the admin panel THEN the system SHALL provide a promotions management section
2. WHEN adding new promotions THEN the system SHALL allow input of all relevant fields (broker, type, rates, requirements, etc.)
3. WHEN editing existing promotions THEN the system SHALL preserve data integrity and update timestamps
4. WHEN deactivating promotions THEN the system SHALL remove them from public display while preserving historical data
5. IF promotions have expiration dates THEN the system SHALL automatically flag or hide expired offers

### Requirement 8

**User Story:** As a mobile user, I want to browse and compare promotions on my mobile device, so that I can research opportunities while on the go.

#### Acceptance Criteria

1. WHEN accessing the promotions page on mobile THEN the system SHALL display content in a mobile-optimized layout
2. WHEN viewing promotion cards on mobile THEN the system SHALL stack information vertically for easy reading
3. WHEN using filters on mobile THEN the system SHALL provide a collapsible filter interface
4. WHEN viewing detailed promotion information THEN the system SHALL use expandable sections to manage screen space
5. IF the rebate calculator is accessed on mobile THEN the system SHALL provide a touch-friendly interface with appropriate input controls