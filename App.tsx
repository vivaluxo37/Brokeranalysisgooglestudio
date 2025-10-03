import React, { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { initializePerformanceOptimizations, lazyWithRetry } from './lib/performance';
import { PageSkeleton, AdminDashboardSkeleton, CountryPageSkeleton } from './components/ui/SkeletonLoaders';
import PerformanceMonitor from './components/ui/PerformanceMonitor';
import AdvancedScreeningPage from './pages/AdvancedScreeningPage';
import AiTutorPage from './pages/AiTutorPage';
import AllBrokersPage from './pages/AllBrokersPage';
import AuthorPage from './pages/AuthorPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import BrokerDetailPage from './pages/BrokerDetailPage';
import BrokerDuelPage from './pages/BrokerDuelPage';
import BrokerFeesQuizPage from './pages/BrokerFeesQuizPage';
import BrokerMatcherPage from './pages/BrokerMatcherPage';
import BrokerPromotionsPage from './pages/BrokerPromotionsPage';
import CalculatorsPage from './pages/CalculatorsPage';
import CandlestickPatternsQuizPage from './pages/CandlestickPatternsQuizPage';
import CarryTradeQuizPage from './pages/CarryTradeQuizPage';
import CategoryPage from './pages/CategoryPage';
import { categoryPages } from './pages/categoryPageData';
import CentralBanksQuizPage from './pages/CentralBanksQuizPage';
import ChartingIntroQuizPage from './pages/ChartingIntroQuizPage';
import ChartPatternsQuizPage from './pages/ChartPatternsQuizPage';
import Chatbot from './components/chatbot/Chatbot';
import ComparePage from './pages/ComparePage';
import CostAnalyzerPage from './pages/CostAnalyzerPage';
import CurrencyPairsQuizPage from './pages/CurrencyPairsQuizPage';
import DashboardPage from './pages/DashboardPage';
import SEOPage from './pages/SEOPage';
import DivergenceTradingQuizPage from './pages/DivergenceTradingQuizPage';
import EconomicCalendarPage from './pages/EconomicCalendarPage';
import EconomicIndicatorsQuizPage from './pages/EconomicIndicatorsQuizPage';
import EducationHubPage from './pages/EducationHubPage';
import ElliottWaveQuizPage from './pages/ElliottWaveQuizPage';
import FibonacciQuizPage from './pages/FibonacciQuizPage';
import ForexBasicsQuizPage from './pages/ForexBasicsQuizPage';
import ForexCorrelationQuizPage from './pages/ForexCorrelationQuizPage';
import ForexQuoteQuizPage from './pages/ForexQuoteQuizPage';
import HarmonicPatternsQuizPage from './pages/HarmonicPatternsQuizPage';
import HomePage from './pages/HomePage';
import Layout from './components/layout/Layout';
import LeverageMarginQuizPage from './pages/LeverageMarginQuizPage';
import LoginPage from './pages/LoginPage';
import LotSizesQuizPage from './pages/LotSizesQuizPage';
import MarketAnalysisTypesQuizPage from './pages/MarketAnalysisTypesQuizPage';
import MarketDataPage from './pages/MarketDataPage';
import MarketNewsPage from './pages/MarketNewsPage';
import MethodologyPage from './pages/MethodologyPage';
import MovingAveragesQuizPage from './pages/MovingAveragesQuizPage';
import NotFoundPage from './pages/NotFoundPage';
import OrderExecutionSimulatorPage from './pages/OrderExecutionSimulatorPage';
import OrderTypesQuizPage from './pages/OrderTypesQuizPage';
import PipQuizPage from './pages/PipQuizPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import QuizzesPage from './pages/QuizzesPage';
import RegisterPage from './pages/RegisterPage';
import RiskManagementQuizPage from './pages/RiskManagementQuizPage';
import RsiIndicatorQuizPage from './pages/RsiIndicatorQuizPage';
import SimulatorsPage from './pages/SimulatorsPage';
import SourcesPage from './pages/SourcesPage';
import SupportResistanceQuizPage from './pages/SupportResistanceQuizPage';
import TradingJournalPage from './pages/TradingJournalPage';
import TradingPsychologyQuizPage from './pages/TradingPsychologyQuizPage';
import WebinarsPage from './pages/WebinarsPage';
import DebugBrokersPage from './pages/DebugBrokersPage';
import CountriesPage from './pages/CountriesPage';
// Lazy load main pages
const BestBrokersPage = lazyWithRetry(() => import('./pages/BestBrokersPage'), 'BestBrokersPage');
const BestBrokersCategoryPage = lazyWithRetry(() => import('./pages/CategoryPage'), 'CategoryPage');
const BestBrokersCountryPage = lazyWithRetry(() => import('./pages/CountryPage'), 'CountryPage');

// Lazy load programmatic pages
const ProgrammaticCategoryPage = lazyWithRetry(() => import('./pages/best-brokers/[category]/index'), 'ProgrammaticCategoryPage');
const ProgrammaticCountryPage = lazyWithRetry(() => import('./pages/best-forex-brokers/[country]/index'), 'ProgrammaticCountryPage'); 
const ProgrammaticSEOPage = lazyWithRetry(() => import('./pages/brokers/[seoSlug]/index'), 'ProgrammaticSEOPage');
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
// Lazy load admin pages
const AdminLogin = lazyWithRetry(() => import('./pages/admin/AdminLogin'), 'AdminLogin');
const AdminDashboard = lazyWithRetry(() => import('./pages/admin/AdminDashboard'), 'AdminDashboard');
const VerificationManagement = lazyWithRetry(() => import('./pages/admin/VerificationManagement'), 'VerificationManagement');
const RankingWeights = lazyWithRetry(() => import('./pages/admin/RankingWeights'), 'RankingWeights');
const ActivityLogs = lazyWithRetry(() => import('./pages/admin/ActivityLogs'), 'ActivityLogs');

const App: React.FC = () => {
  useEffect(() => {
    // Initialize performance optimizations on app start
    initializePerformanceOptimizations();
  }, []);

  return (
    <AdminAuthProvider>
      <Layout>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/brokers" element={<AllBrokersPage />} />
        <Route path="/debug-brokers" element={<DebugBrokersPage />} />
        <Route path="/best-brokers" element={
          <Suspense fallback={<PageSkeleton />}>
            <BestBrokersPage />
          </Suspense>
        } />
        <Route path="/best-brokers/:category" element={
          <Suspense fallback={<PageSkeleton />}>
            <ProgrammaticCategoryPage />
          </Suspense>
        } />
        <Route path="/best-forex-brokers/:country" element={
          <Suspense fallback={<CountryPageSkeleton />}>
            <ProgrammaticCountryPage />
          </Suspense>
        } />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/best-brokers/:categorySlug" element={
          <Suspense fallback={<PageSkeleton />}>
            <BestBrokersCategoryPage />
          </Suspense>
        } />
        <Route path="/best-forex-brokers/:countrySlug" element={
          <Suspense fallback={<CountryPageSkeleton />}>
            <BestBrokersCountryPage />
          </Suspense>
        } />
        <Route path="/countries" element={<CountriesPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={
          <Suspense fallback={<PageSkeleton />}>
            <AdminLogin />
          </Suspense>
        } />
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <Suspense fallback={<AdminDashboardSkeleton />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/verification" element={
          <ProtectedAdminRoute>
            <Suspense fallback={<PageSkeleton />}>
              <VerificationManagement />
            </Suspense>
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/ranking-weights" element={
          <ProtectedAdminRoute>
            <Suspense fallback={<PageSkeleton />}>
              <RankingWeights />
            </Suspense>
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/logs" element={
          <ProtectedAdminRoute>
            <Suspense fallback={<PageSkeleton />}>
              <ActivityLogs />
            </Suspense>
          </ProtectedAdminRoute>
        } />
        <Route path="/brokers/advanced-screening" element={<AdvancedScreeningPage />} />
        <Route path="/brokers/promotions" element={<BrokerPromotionsPage />} />
        <Route path="/broker/:brokerId" element={<BrokerDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/compare/:brokerId1/vs/:brokerId2" element={<BrokerDuelPage />} />
        <Route path="/cost-analyzer" element={<CostAnalyzerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/market-news" element={<MarketNewsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/author/:authorSlug" element={<AuthorPage />} />

        {/* Education Routes */}
        <Route path="/education" element={<EducationHubPage />} />
        <Route path="/education/ai-tutor" element={<AiTutorPage />} />
        <Route path="/education/quizzes" element={<QuizzesPage />} />
        <Route path="/education/quizzes/broker-fees" element={<BrokerFeesQuizPage />} />
        <Route path="/education/quizzes/forex-basics" element={<ForexBasicsQuizPage />} />
        <Route path="/education/quizzes/charting-intro" element={<ChartingIntroQuizPage />} />
        <Route path="/education/quizzes/risk-management" element={<RiskManagementQuizPage />} />
        <Route path="/education/quizzes/order-types" element={<OrderTypesQuizPage />} />
        <Route path="/education/quizzes/currency-pairs" element={<CurrencyPairsQuizPage />} />
        <Route path="/education/quizzes/pips" element={<PipQuizPage />} />
        <Route path="/education/quizzes/lot-sizes" element={<LotSizesQuizPage />} />
        <Route path="/education/quizzes/forex-quote" element={<ForexQuoteQuizPage />} />
        <Route path="/education/quizzes/analysis-types" element={<MarketAnalysisTypesQuizPage />} />
        <Route path="/education/quizzes/candlestick-patterns" element={<CandlestickPatternsQuizPage />} />
        <Route path="/education/quizzes/support-resistance" element={<SupportResistanceQuizPage />} />
        <Route path="/education/quizzes/moving-averages" element={<MovingAveragesQuizPage />} />
        <Route path="/education/quizzes/chart-patterns" element={<ChartPatternsQuizPage />} />
        <Route path="/education/quizzes/rsi-indicator" element={<RsiIndicatorQuizPage />} />
        <Route path="/education/quizzes/economic-indicators" element={<EconomicIndicatorsQuizPage />} />
        <Route path="/education/quizzes/trading-psychology" element={<TradingPsychologyQuizPage />} />
        <Route path="/education/quizzes/central-banks" element={<CentralBanksQuizPage />} />
        <Route path="/education/quizzes/leverage-margin" element={<LeverageMarginQuizPage />} />
        <Route path="/education/quizzes/fibonacci-retracement" element={<FibonacciQuizPage />} />
        <Route path="/education/quizzes/elliott-wave" element={<ElliottWaveQuizPage />} />
        <Route path="/education/quizzes/divergence-trading" element={<DivergenceTradingQuizPage />} />
        <Route path="/education/quizzes/harmonic-patterns" element={<HarmonicPatternsQuizPage />} />
        <Route path="/education/quizzes/carry-trade" element={<CarryTradeQuizPage />} />
        <Route path="/education/quizzes/forex-correlation" element={<ForexCorrelationQuizPage />} />
        
        <Route path="/education/webinars" element={<WebinarsPage />} />
        <Route path="/education/simulators" element={<SimulatorsPage />} />
        <Route path="/education/simulators/order-execution" element={<OrderExecutionSimulatorPage />} />

        {/* Tools Routes */}
        <Route path="/tools/economic-calendar" element={<EconomicCalendarPage />} />
        <Route path="/tools/market-data" element={<MarketDataPage />} />
        <Route path="/tools/calculators" element={<CalculatorsPage />} />

        {/* Programmatic SEO Routes */}
        <Route path="/brokers/:seoSlug" element={
          <Suspense fallback={<PageSkeleton />}>
            <ProgrammaticSEOPage />
          </Suspense>
        } />
        <Route path="/:seoSlug" element={<SEOPage />} />

        {/* Dynamically create routes for all category pages */}
        {categoryPages.map(({ path, title, description, filterFn }) => (
          <Route 
            key={path}
            path={path}
            element={<CategoryPage title={title} description={description} filterFn={filterFn} />} 
          />
        ))}

        <Route path="/broker-matcher" element={
          <ProtectedRoute>
            <BrokerMatcherPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/trading-journal" element={
          <ProtectedRoute>
            <TradingJournalPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Chatbot />
        <PerformanceMonitor />
      </Layout>
    </AdminAuthProvider>
  );
};

export default App;