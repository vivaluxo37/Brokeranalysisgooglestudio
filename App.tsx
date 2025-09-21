



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