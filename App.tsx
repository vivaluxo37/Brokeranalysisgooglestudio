import React from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <Layout>
      <ReactRouterDOM.Routes>
        <ReactRouterDOM.Route path="/" element={<HomePage />} />
        <ReactRouterDOM.Route path="/brokers" element={<AllBrokersPage />} />
        <ReactRouterDOM.Route path="/broker/:brokerId" element={<BrokerDetailPage />} />
        <ReactRouterDOM.Route path="/compare" element={<ComparePage />} />
        <ReactRouterDOM.Route path="/compare/:brokerId1/vs/:brokerId2" element={<BrokerDuelPage />} />
        <ReactRouterDOM.Route path="/cost-analyzer" element={<CostAnalyzerPage />} />
        <ReactRouterDOM.Route path="/login" element={<LoginPage />} />
        <ReactRouterDOM.Route path="/register" element={<RegisterPage />} />
        <ReactRouterDOM.Route path="/methodology" element={<MethodologyPage />} />
        <ReactRouterDOM.Route path="/sources" element={<SourcesPage />} />
        <ReactRouterDOM.Route path="/market-news" element={<MarketNewsPage />} />

        {/* Education Routes */}
        <ReactRouterDOM.Route path="/education" element={<EducationHubPage />} />
        <ReactRouterDOM.Route path="/education/quizzes" element={<QuizzesPage />} />
        <ReactRouterDOM.Route path="/education/quizzes/broker-fees" element={<BrokerFeesQuizPage />} />
        <ReactRouterDOM.Route path="/education/quizzes/forex-basics" element={<ForexBasicsQuizPage />} />
        <ReactRouterDOM.Route path="/education/quizzes/charting-intro" element={<ChartingIntroQuizPage />} />
        <ReactRouterDOM.Route path="/education/quizzes/risk-management" element={<RiskManagementQuizPage />} />
        <ReactRouterDOM.Route path="/education/quizzes/order-types" element={<OrderTypesQuizPage />} />
        <ReactRouterDOM.Route path="/education/webinars" element={<WebinarsPage />} />
        <ReactRouterDOM.Route path="/education/simulators" element={<SimulatorsPage />} />
        <ReactRouterDOM.Route path="/education/simulators/order-execution" element={<OrderExecutionSimulatorPage />} />
        
        {/* Tools Routes */}
        <ReactRouterDOM.Route path="/tools/economic-calendar" element={<EconomicCalendarPage />} />
        <ReactRouterDOM.Route path="/tools/market-data" element={<MarketDataPage />} />
        <ReactRouterDOM.Route path="/tools/calculators" element={<CalculatorsPage />} />

        {/* Dynamically create routes for all category pages */}
        {categoryPages.map(({ path, title, description, filterFn }) => (
          <ReactRouterDOM.Route 
            key={path}
            path={path}
            element={<CategoryPage title={title} description={description} filterFn={filterFn} />} 
          />
        ))}

        <ReactRouterDOM.Route path="/broker-matcher" element={
          <ProtectedRoute>
            <BrokerMatcherPage />
          </ProtectedRoute>
        } />
        <ReactRouterDOM.Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        <ReactRouterDOM.Route path="*" element={<NotFoundPage />} />
      </ReactRouterDOM.Routes>
      <Chatbot />
    </Layout>
  );
};

export default App;