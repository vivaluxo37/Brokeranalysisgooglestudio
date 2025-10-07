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
  ClockIcon,
  HeartIcon,
  QuestionMarkCircleIcon,
  TrophyIcon,
  ChartBarIcon,
  MagnifyingGlassIcon
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
    target: ChartBarIcon,
    play: PlayIcon,
    clock: ClockIcon,
    heart: HeartIcon,
    barChart3: ChartBarIcon,
    helpCircle: QuestionMarkCircleIcon,
    duel: TrophyIcon,
    search: MagnifyingGlassIcon,
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