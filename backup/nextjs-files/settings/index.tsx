import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  CogIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BellIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { LoadingButton } from '../../../components/common/Loading';
import { useToastHelpers } from '../../../components/common/Toast';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  logoUrl: string;
  faviconUrl: string;
  timezone: string;
  language: string;
  currency: string;
  maintenanceMode: boolean;
}

interface SecuritySettings {
  requireEmailVerification: boolean;
  enableTwoFactor: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  enableCaptcha: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  newBrokerNotifications: boolean;
  reviewNotifications: boolean;
  systemAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

interface AnalyticsSettings {
  googleAnalyticsId: string;
  enableHeatmaps: boolean;
  trackUserBehavior: boolean;
  enableABTesting: boolean;
  retentionDays: number;
}

const AdminSettings: React.FC = () => {
  const toast = useToastHelpers();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'Broker Analysis Platform',
    siteDescription: 'Your trusted source for broker reviews and comparisons',
    siteUrl: 'https://brokeranalysis.com',
    contactEmail: 'admin@brokeranalysis.com',
    logoUrl: '/images/logo.png',
    faviconUrl: '/images/favicon.ico',
    timezone: 'UTC',
    language: 'en',
    currency: 'USD',
    maintenanceMode: false
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    requireEmailVerification: true,
    enableTwoFactor: false,
    sessionTimeout: 1440, // minutes
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    enableCaptcha: true
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    newBrokerNotifications: true,
    reviewNotifications: true,
    systemAlerts: true,
    weeklyReports: false,
    monthlyReports: true
  });

  const [analyticsSettings, setAnalyticsSettings] = useState<AnalyticsSettings>({
    googleAnalyticsId: '',
    enableHeatmaps: false,
    trackUserBehavior: true,
    enableABTesting: false,
    retentionDays: 365
  });

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, make API calls to save settings
      console.log('Saving settings:', {
        site: siteSettings,
        security: securitySettings,
        notifications: notificationSettings,
        analytics: analyticsSettings
      });

      toast.success('Settings saved successfully!', 'Your changes have been applied.');
    } catch (error) {
      toast.error('Failed to save settings', 'Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Name</label>
            <input
              type="text"
              value={siteSettings.siteName}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              value={siteSettings.contactEmail}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Site Description</label>
            <textarea
              rows={3}
              value={siteSettings.siteDescription}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Site URL</label>
            <input
              type="url"
              value={siteSettings.siteUrl}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Timezone</label>
            <select
              value={siteSettings.timezone}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              value={siteSettings.language}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, language: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              value={siteSettings.currency}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, currency: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="maintenance-mode"
              type="checkbox"
              checked={siteSettings.maintenanceMode}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="maintenance-mode" className="ml-2 block text-sm text-gray-900">
              Maintenance Mode
            </label>
          </div>
          <p className="text-sm text-gray-500">
            When enabled, only administrators can access the site.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="email-verification"
              type="checkbox"
              checked={securitySettings.requireEmailVerification}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, requireEmailVerification: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="email-verification" className="ml-2 block text-sm text-gray-900">
              Require email verification for new accounts
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="two-factor"
              type="checkbox"
              checked={securitySettings.enableTwoFactor}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, enableTwoFactor: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="two-factor" className="ml-2 block text-sm text-gray-900">
              Enable two-factor authentication
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="captcha"
              type="checkbox"
              checked={securitySettings.enableCaptcha}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, enableCaptcha: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="captcha" className="ml-2 block text-sm text-gray-900">
              Enable CAPTCHA for forms
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
            <input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Login Attempts</label>
            <input
              type="number"
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Password Length</label>
            <input
              type="number"
              value={securitySettings.passwordMinLength}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="email-notifications"
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
              Enable email notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="new-broker-notifications"
              type="checkbox"
              checked={notificationSettings.newBrokerNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, newBrokerNotifications: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="new-broker-notifications" className="ml-2 block text-sm text-gray-900">
              New broker submissions
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="review-notifications"
              type="checkbox"
              checked={notificationSettings.reviewNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, reviewNotifications: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="review-notifications" className="ml-2 block text-sm text-gray-900">
              New reviews and ratings
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="system-alerts"
              type="checkbox"
              checked={notificationSettings.systemAlerts}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, systemAlerts: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="system-alerts" className="ml-2 block text-sm text-gray-900">
              System alerts and errors
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Reports</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="weekly-reports"
              type="checkbox"
              checked={notificationSettings.weeklyReports}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, weeklyReports: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="weekly-reports" className="ml-2 block text-sm text-gray-900">
              Weekly analytics reports
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="monthly-reports"
              type="checkbox"
              checked={notificationSettings.monthlyReports}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, monthlyReports: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="monthly-reports" className="ml-2 block text-sm text-gray-900">
              Monthly summary reports
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tracking Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Google Analytics ID</label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={analyticsSettings.googleAnalyticsId}
              onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Retention (days)</label>
            <input
              type="number"
              value={analyticsSettings.retentionDays}
              onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
              className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tracking Features</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="heatmaps"
              type="checkbox"
              checked={analyticsSettings.enableHeatmaps}
              onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, enableHeatmaps: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="heatmaps" className="ml-2 block text-sm text-gray-900">
              Enable heatmap tracking
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="user-behavior"
              type="checkbox"
              checked={analyticsSettings.trackUserBehavior}
              onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, trackUserBehavior: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="user-behavior" className="ml-2 block text-sm text-gray-900">
              Track user behavior
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="ab-testing"
              type="checkbox"
              checked={analyticsSettings.enableABTesting}
              onChange={(e) => setAnalyticsSettings(prev => ({ ...prev, enableABTesting: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="ab-testing" className="ml-2 block text-sm text-gray-900">
              Enable A/B testing
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'analytics':
        return renderAnalyticsSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <>
      <Head>
        <title>Settings - Admin Dashboard</title>
        <meta name="description" content="Configure system settings and preferences" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-4">
                    <li>
                      <Link href="/admin" className="text-gray-400 hover:text-gray-500">
                        Admin
                      </Link>
                    </li>
                    <li className="flex items-center">
                      <span className="text-gray-400 mx-4">/</span>
                      <span className="text-gray-900 font-medium">Settings</span>
                    </li>
                  </ol>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">System Settings</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow">
            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 border-r border-gray-200">
                <nav className="space-y-1 p-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="p-8">
                  {renderTabContent()}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-8 py-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Changes will be applied immediately after saving.
                    </p>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Reset
                      </button>
                      <LoadingButton
                        loading={saving}
                        onClick={handleSave}
                        loadingText="Saving..."
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;