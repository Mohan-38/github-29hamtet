import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  CreditCard, 
  Send, 
  DollarSign, 
  Mail, 
  CheckCircle, 
  AlertTriangle,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Briefcase,
  ShoppingCart
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useSettings } from '../../context/SettingsContext';

const AdminSettingsPage = () => {
  const { settings, updateSettings, loading, error } = useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  // Update local settings when context settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = !localSettings[key];
    const updatedSettings = { ...localSettings, [key]: newValue };
    
    setLocalSettings(updatedSettings);
    
    try {
      setIsSaving(true);
      await updateSettings({ [key]: newValue });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Error updating settings:', error);
      // Revert local state on error
      setLocalSettings(settings);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      await updateSettings(localSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving all settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isMarketplaceMode = localSettings.marketplaceMode;
  const isPortfolioMode = !isMarketplaceMode;

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    disabled = false 
  }: { 
    enabled: boolean; 
    onChange: () => void; 
    disabled?: boolean;
  }) => (
    <button
      onClick={onChange}
      disabled={disabled || isSaving}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled 
          ? 'bg-blue-600' 
          : 'bg-gray-200 dark:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const SettingCard = ({ 
    icon: Icon, 
    title, 
    description, 
    enabled, 
    onChange, 
    disabled = false,
    warning = false
  }: {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    enabled: boolean;
    onChange: () => void;
    disabled?: boolean;
    warning?: boolean;
  }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
      warning 
        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' 
        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
    } ${disabled ? 'opacity-60' : ''}`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          warning 
            ? 'bg-amber-100 dark:bg-amber-800' 
            : 'bg-white dark:bg-slate-600'
        }`}>
          <Icon className={`h-5 w-5 ${
            warning 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-slate-600 dark:text-slate-300'
          }`} />
        </div>
        <div>
          <h3 className="font-medium text-slate-900 dark:text-slate-200">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <ToggleSwitch 
        enabled={enabled} 
        onChange={onChange} 
        disabled={disabled}
      />
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="px-4 sm:px-6 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-slate-600 dark:text-slate-400">Loading settings...</span>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-200">Settings</h1>
            <p className="text-slate-500 dark:text-slate-400">Configure your website's marketplace and portfolio settings.</p>
          </div>
          
          {saveSuccess && (
            <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Settings saved successfully!</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-800 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {/* Marketplace Configuration Header */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-2">
                  Marketplace Configuration
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Control how your website operates - as a marketplace with payments and automatic delivery, or as a traditional portfolio site.
                </p>
              </div>

              {/* Master Toggle - Marketplace Mode */}
              <div className="mb-8 p-6 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">
                        Marketplace Mode
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300">
                        Enable full marketplace functionality with payments, orders, and automatic delivery
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch 
                    enabled={isMarketplaceMode}
                    onChange={() => handleToggle('marketplaceMode')}
                  />
                </div>
              </div>

              {/* Individual Controls */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-4">
                  Individual Controls
                </h3>
                
                <div className="space-y-4">
                  <SettingCard
                    icon={CreditCard}
                    title="Payment Processing"
                    description="Enable checkout and payment functionality"
                    enabled={localSettings.paymentProcessingEnabled}
                    onChange={() => handleToggle('paymentProcessingEnabled')}
                    disabled={isPortfolioMode}
                  />

                  <SettingCard
                    icon={Send}
                    title="Automatic Document Delivery"
                    description="Automatically send documents after successful payment"
                    enabled={localSettings.automaticDeliveryEnabled}
                    onChange={() => handleToggle('automaticDeliveryEnabled')}
                    disabled={isPortfolioMode}
                  />

                  <SettingCard
                    icon={DollarSign}
                    title="Show Prices on Projects"
                    description="Display pricing information on project cards"
                    enabled={localSettings.showPricesOnProjects}
                    onChange={() => handleToggle('showPricesOnProjects')}
                    disabled={isPortfolioMode}
                  />

                  <SettingCard
                    icon={Mail}
                    title="Email Notifications"
                    description="Send order confirmations and delivery emails"
                    enabled={localSettings.emailNotificationsEnabled}
                    onChange={() => handleToggle('emailNotificationsEnabled')}
                  />

                  <SettingCard
                    icon={CheckCircle}
                    title="Order Auto-Confirmation"
                    description="Automatically confirm orders after payment"
                    enabled={localSettings.orderAutoConfirmation}
                    onChange={() => handleToggle('orderAutoConfirmation')}
                    disabled={isPortfolioMode}
                  />
                </div>
              </div>

              {/* Portfolio Mode Warning */}
              {isPortfolioMode && (
                <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                        Portfolio Mode Active
                      </h4>
                      <p className="text-amber-700 dark:text-amber-400 text-sm">
                        Your website is currently operating as a portfolio. Projects will be displayed without pricing or purchase options. 
                        Visitors can view your work and contact you for custom projects.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Configuration Summary */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-4">
                  Current Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Mode:</span>
                    <div className="flex items-center space-x-2">
                      {isMarketplaceMode ? (
                        <>
                          <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-slate-900 dark:text-slate-200">Marketplace</span>
                        </>
                      ) : (
                        <>
                          <Briefcase className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <span className="font-medium text-slate-900 dark:text-slate-200">Portfolio</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Payments:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      {localSettings.paymentProcessingEnabled && isMarketplaceMode ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Auto Delivery:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      {localSettings.automaticDeliveryEnabled && isMarketplaceMode ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Show Prices:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      {localSettings.showPricesOnProjects && isMarketplaceMode ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Last updated: {new Date(localSettings.lastUpdated).toLocaleString()}
                    </span>
                    <button
                      onClick={handleSaveAll}
                      disabled={isSaving}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1.5" />
                          Save All
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;