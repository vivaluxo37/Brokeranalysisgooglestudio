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
        <Route path="/education/quizzes" element={<QuizzesPage />} />
        <Route path="/education/quizzes/broker-fees" element={<BrokerFeesQuizPage />} />
        <Route path="/education/quizzes/forex-basics" element={<ForexBasicsQuizPage />} />
        <Route path="/education/quizzes/charting-intro" element={<ChartingIntroQuizPage />} />
        <Route path="/education/quizzes/risk-management" element={<RiskManagementQuizPage />} />
        <Route path="/education/quizzes/order-types" element={<OrderTypesQuizPage />} />
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

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Chatbot />
    </Layout>
  );
};

export default App;