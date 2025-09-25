

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AllBrokersPage from './pages/AllBrokersPage';
import BrokerDetailPage from './pages/BrokerDetailPage';
import BrokerMatcherPage from './pages/BrokerMatcherPage';
import ComparePage from './pages/ComparePage';
import CostAnalyzerPage from './pages/CostAnalyzerPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Chatbot from './components/chatbot/Chatbot';
import BrokerDuelPage from './pages/BrokerDuelPage';
import MethodologyPage from './pages/MethodologyPage';
import SourcesPage from './pages/SourcesPage';
import CategoryPage from './pages/CategoryPage';
import { categoryPages } from './pages/categoryPageData';
import MarketNewsPage from './pages/MarketNewsPage';
import EducationHubPage from './pages/EducationHubPage';
import QuizzesPage from './pages/QuizzesPage';
import BrokerFeesQuizPage from './pages/BrokerFeesQuizPage';
import WebinarsPage from './pages/WebinarsPage';
import SimulatorsPage from './pages/SimulatorsPage';
import OrderExecutionSimulatorPage from './pages/OrderExecutionSimulatorPage';
import ForexBasicsQuizPage from './pages/ForexBasicsQuizPage';
import ChartingIntroQuizPage from './pages/ChartingIntroQuizPage';
import RiskManagementQuizPage from './pages/RiskManagementQuizPage';
import OrderTypesQuizPage from './pages/OrderTypesQuizPage';
import EconomicCalendarPage from './pages/EconomicCalendarPage';
import MarketDataPage from './pages/MarketDataPage';
import CalculatorsPage from './pages/CalculatorsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AuthorPage from './pages/AuthorPage';
import TradingJournalPage from './pages/TradingJournalPage';
import AiTutorPage from './pages/AiTutorPage';

// Import new quiz pages
import CurrencyPairsQuizPage from './pages/CurrencyPairsQuizPage';
import PipQuizPage from './pages/PipQuizPage';
import LotSizesQuizPage from './pages/LotSizesQuizPage';
import ForexQuoteQuizPage from './pages/ForexQuoteQuizPage';
import MarketAnalysisTypesQuizPage from './pages/MarketAnalysisTypesQuizPage';
import CandlestickPatternsQuizPage from './pages/CandlestickPatternsQuizPage';
import SupportResistanceQuizPage from './pages/SupportResistanceQuizPage';
import MovingAveragesQuizPage from './pages/MovingAveragesQuizPage';
import ChartPatternsQuizPage from './pages/ChartPatternsQuizPage';
import RsiIndicatorQuizPage from './pages/RsiIndicatorQuizPage';
import EconomicIndicatorsQuizPage from './pages/EconomicIndicatorsQuizPage';
import TradingPsychologyQuizPage from './pages/TradingPsychologyQuizPage';
import CentralBanksQuizPage from './pages/CentralBanksQuizPage';
import LeverageMarginQuizPage from './pages/LeverageMarginQuizPage';
import FibonacciQuizPage from './pages/FibonacciQuizPage';
import ElliottWaveQuizPage from './pages/ElliottWaveQuizPage';
import DivergenceTradingQuizPage from './pages/DivergenceTradingQuizPage';
import HarmonicPatternsQuizPage from './pages/HarmonicPatternsQuizPage';
import CarryTradeQuizPage from './pages/CarryTradeQuizPage';
import ForexCorrelationQuizPage from './pages/ForexCorrelationQuizPage';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/brokers" element={<AllBrokersPage />} />
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
        {/* New Quiz Routes */}
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
    </Layout>
  );
};

export default App;
