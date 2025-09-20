
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

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/brokers" element={<AllBrokersPage />} />
        <Route path="/broker/:brokerId" element={<BrokerDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/cost-analyzer" element={<CostAnalyzerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
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