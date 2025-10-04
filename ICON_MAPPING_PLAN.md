# Icon Mapping Plan - QuickAccessWidget Style Consistency

## Target Style (from QuickAccessWidget)
- **Icon Library**: Heroicons (@heroicons/react/24/outline)
- **Color**: `text-blue-600`
- **Size**: `h-5 w-5` (standard), `h-6 w-6` (larger)
- **Background**: `bg-blue-100` for icon containers

## Current Icons vs. Heroicons Mapping

### Navigation & Action Icons
| Current Icon | Heroicon Replacement | Usage |
|--------------|---------------------|-------|
| Icons.chevronDown | ChevronDownIcon | Accordions, dropdowns |
| Icons.chevronRight | ChevronRightIcon | Navigation |
| Icons.close | XMarkIcon | Close buttons |
| Icons.externalLink | ArrowTopRightOnSquareIcon | External links |
| Icons.menu | Bars3Icon | Mobile menu |

### Content & Feature Icons
| Current Icon | Heroicon Replacement | Usage |
|--------------|---------------------|-------|
| Icons.star | StarIcon | Ratings, favorites |
| Icons.starFull | StarIcon (filled) | Filled ratings |
| Icons.compare | Squares2X2Icon | Compare feature |
| Icons.compareRemove | XMarkIcon | Remove from comparison |
| Icons.bot | CpuChipIcon | AI features |
| Icons.shield | ShieldCheckIcon | Security, regulation |
| Icons.shieldCheck | ShieldCheckIcon | Verified features |
| Icons.data | ServerIcon | Data, analytics |
| Icons.bookOpen | BookOpenIcon | Education, resources |
| Icons.video | PlayIcon | Videos, tutorials |
| Icons.calculator | CalculatorIcon | Cost calculator |
| Icons.grid | Squares2X2Icon | Grid view |
| Icons.list | Bars3Icon | List view |
| Icons.search | MagnifyingGlassIcon | Search |
| Icons.trash | TrashIcon | Delete actions |
| Icons.alert | ExclamationTriangleIcon | Alerts, warnings |
| Icons.checkCircle | CheckCircleIcon | Success states |
| Icons.xCircle | XCircleIcon | Error states |
| Icons.verified | CheckBadgeIcon | Verification |
| Icons.trendingUp | ArrowTrendingUpIcon | Trends, analytics |
| Icons.users | UserGroupIcon | Community, social |
| Icons.globe | GlobeAltIcon | Global, countries |
| Icons.newspaper | NewspaperIcon | News, articles |
| Icons.calendar | CalendarIcon | Events, dates |
| Icons.eye | EyeIcon | View, preview |
| Icons.zap | BoltIcon | Features, speed |
| Icons.coins | CurrencyDollarIcon | Costs, fees |
| Icons.target | TargetIcon | Goals, matching |
| Icons.play | PlayIcon | Start, begin |
| Icons.clock | ClockIcon | Time, history |
| Layers | Squares2X2Icon | Categories, layers |

## Pages Requiring Updates

### 1. AllBrokersPage.tsx
- Icons.chevronDown → ChevronDownIcon
- Icons.trash → TrashIcon
- Icons.alert → ExclamationTriangleIcon
- Icons.grid → Squares2X2Icon
- Icons.list → Bars3Icon
- Icons.bot → CpuChipIcon
- Icons.compare → Squares2X2Icon
- Icons.compareRemove → XMarkIcon

### 2. BrokerDetailPage.tsx
- Icons.shield → ShieldCheckIcon
- Icons.externalLink → ArrowTopRightOnSquareIcon
- Icons.verified → CheckBadgeIcon
- Icons.star → StarIcon
- Icons.checkCircle → CheckCircleIcon
- Icons.alertCircle → ExclamationTriangleIcon
- Icons.heart → HeartIcon
- Icons.barChart3 → BarChartIcon
- Icons.externalLink → ArrowTopRightOnSquareIcon
- Icons.shield → ShieldCheckIcon

### 3. ComparePage.tsx
- Icons.duel → TrophyIcon
- Icons.bot → CpuChipIcon
- Icons.compare → Squares2X2Icon

### 4. DashboardPage.tsx
- Icons.chevronDown → ChevronDownIcon
- Icons.bot → CpuChipIcon
- Icons.bookOpen → BookOpenIcon
- Icons.data → ServerIcon
- Icons.shieldCheck → ShieldCheckIcon
- Icons.verified → CheckBadgeIcon

### 5. CostAnalyzerPage.tsx
- Icons.bot → CpuChipIcon

### 6. Additional Pages Analyzed
- BrokerMatcherPage.tsx: Icons.bot → CpuChipIcon
- CategoryPage.tsx: No custom icons (uses BrokerCard)
- MarketNewsPage.tsx: Icons.chevronRight → ChevronRightIcon, Icons.bot → CpuChipIcon
- EducationHubPage.tsx: Icons.bot → CpuChipIcon, Icons.helpCircle → QuestionMarkCircleIcon, Icons.video → PlayIcon, Icons.cpu → CpuChipIcon
- QuizzesPage.tsx: Icons.chevronRight → ChevronRightIcon

### 7. Remaining Pages (to be analyzed)
- SimulatorsPage.tsx
- TradingJournalPage.tsx
- WebinarsPage.tsx
- CalculatorsPage.tsx
- EconomicCalendarPage.tsx
- MarketDataPage.tsx
- BestBrokersPage.tsx
- AiTutorPage.tsx
- BlogPage.tsx
- BlogPostPage.tsx
- BrokerDuelPage.tsx
- BrokerFeesQuizPage.tsx
- BrokerPromotionsPage.tsx
- CountriesPage.tsx
- CountryPage.tsx
- LoginPage.tsx
- RegisterPage.tsx
- NotFoundPage.tsx
- MethodologyPage.tsx
- SEOPage.tsx
- SourcesPage.tsx

## Implementation Strategy

### Phase 1: Core Pages
1. Update AllBrokersPage.tsx
2. Update BrokerDetailPage.tsx
3. Update ComparePage.tsx
4. Update DashboardPage.tsx
5. Update CostAnalyzerPage.tsx

### Phase 2: Additional Pages
6. Update remaining broker-related pages
7. Update tool and resource pages
8. Update dashboard and user pages

### Phase 3: Components
9. Update common components
10. Update UI components
11. Update layout components

## Code Changes Required

### 1. Import Statements
```typescript
// Replace custom Icons import
import { Icons } from '../constants';

// With Heroicons imports
import { 
  ChevronDownIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  Squares2X2Icon,
  Bars3Icon,
  CpuChipIcon,
  XMarkIcon,
  // ... other icons
} from '@heroicons/react/24/outline';
```

### 2. Icon Usage
```typescript
// Replace custom icon usage
<Icons.chevronDown className="h-5 w-5" />

// With Heroicon usage
<ChevronDownIcon className="h-5 w-5 text-blue-600" />
```

### 3. Background Colors
```typescript
// Update icon backgrounds to blue
<div className="p-3 bg-blue-100 rounded-lg">
  <IconName className="h-6 w-6 text-blue-600" />
</div>
```

## Standardized Icon Component

### New Icon Component Specification
Create a standardized icon component at `components/ui/Icon.tsx`:

```typescript
import React from 'react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  StarIcon,
  Squares2X2Icon,
  CpuChipIcon,
  ShieldCheckIcon,
  ServerIcon,
  BookOpenIcon,
  PlayIcon,
  CalculatorIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CheckBadgeIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  GlobeAltIcon,
  NewspaperIcon,
  CalendarIcon,
  EyeIcon,
  BoltIcon,
  CurrencyDollarIcon,
  TargetIcon,
  ClockIcon,
  HeartIcon,
  BarChartIcon,
  QuestionMarkCircleIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className = '',
  color = 'text-blue-600'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const iconMap: Record<string, React.ElementType> = {
    chevronDown: ChevronDownIcon,
    chevronRight: ChevronRightIcon,
    close: XMarkIcon,
    externalLink: ArrowTopRightOnSquareIcon,
    menu: Bars3Icon,
    star: StarIcon,
    compare: Squares2X2Icon,
    bot: CpuChipIcon,
    shield: ShieldCheckIcon,
    shieldCheck: ShieldCheckIcon,
    data: ServerIcon,
    bookOpen: BookOpenIcon,
    video: PlayIcon,
    calculator: CalculatorIcon,
    trash: TrashIcon,
    alert: ExclamationTriangleIcon,
    checkCircle: CheckCircleIcon,
    xCircle: XCircleIcon,
    verified: CheckBadgeIcon,
    trendingUp: ArrowTrendingUpIcon,
    users: UserGroupIcon,
    globe: GlobeAltIcon,
    newspaper: NewspaperIcon,
    calendar: CalendarIcon,
    eye: EyeIcon,
    zap: BoltIcon,
    coins: CurrencyDollarIcon,
    target: TargetIcon,
    play: PlayIcon,
    clock: ClockIcon,
    heart: HeartIcon,
    barChart3: BarChartIcon,
    helpCircle: QuestionMarkCircleIcon,
    duel: TrophyIcon,
    // Add more mappings as needed
  };

  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  return (
    <IconComponent
      className={`${sizeClasses[size]} ${color} ${className}`}
      aria-hidden="true"
    />
  );
};

export default Icon;
```

### Usage Examples
```typescript
// Basic usage
<Icon name="star" />

// With custom size
<Icon name="bot" size="lg" />

// With custom color
<Icon name="shield" color="text-green-600" />

// With additional classes
<Icon name="chevronDown" className="transition-transform" />
```

### 4. Updated Import Pattern
```typescript
// Replace multiple Heroicon imports with single Icon component
import Icon from '../components/ui/Icon';

// Usage
<Icon name="chevronDown" size="md" />
<Icon name="bot" size="lg" color="text-blue-600" />
```

## Testing Checklist
- [ ] All icons render correctly
- [ ] Icons have consistent blue color (`text-blue-600`)
- [ ] Icons have consistent sizing (`h-5 w-5` or `h-6 w-6`)
- [ ] Icon backgrounds use `bg-blue-100`
- [ ] No console errors related to icons
- [ ] Responsive design maintained
- [ ] Accessibility preserved (alt text, ARIA labels)
- [ ] Standardized Icon component implemented
- [ ] All pages use the Icon component instead of direct Heroicon imports