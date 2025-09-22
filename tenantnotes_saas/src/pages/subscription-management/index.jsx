import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PlanCard from './components/PlanCard';
import UsageMetrics from './components/UsageMetrics';
import BillingHistory from './components/BillingHistory';
import UpgradeModal from './components/UpgradeModal';
import PaymentMethods from './components/PaymentMethods';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const SubscriptionManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [upgradeError, setUpgradeError] = useState(null);

  // Get user from localStorage
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);

  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      console.log('Loaded user data:', parsed);
      setUser(parsed);
      setTenant({ slug: parsed.tenantSlug || 'acme', name: 'Acme' }); // Fallback to 'acme' if tenantSlug is undefined
    }
  }, []);

  // Mock subscription data
  const [subscription, setSubscription] = useState({
    id: 'sub_001',
    plan: 'Free',
    notesUsed: 2,
    notesLimit: 3,
    billingCycle: null,
    nextBillingDate: null,
    status: 'active'
  });

  const [billingHistory, setBillingHistory] = useState([]);
  const [billingHistoryError, setBillingHistoryError] = useState(null);

  // Fetch billing history from backend
  useEffect(() => {
    const fetchBillingHistory = async () => {
      console.log('Fetching billing history, tenant:', tenant);
      if (!user || !tenant || !tenant.slug) {
        console.warn('User or tenant or tenant.slug not defined, skipping fetch');
        return;
      }
      try {
        setBillingHistoryError(null); // Clear previous errors
        const token = localStorage.getItem('authToken');
        console.log('Using token for billing history fetch:', token);
        const response = await fetch(`/api/tenants/${tenant.slug}/billing-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBillingHistory(data);
        } else {
          console.error('Failed to fetch billing history:', response.status, response.statusText);
          let errorMessage = 'Failed to load billing history';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error('Could not parse error response');
          }
          setBillingHistoryError(errorMessage);
        }
      } catch (error) {
        console.error('Error fetching billing history:', error);
        setBillingHistoryError('Network error while loading billing history');
      }
    };
    fetchBillingHistory();
  }, [user, tenant]);

  // Available plans
  const plans = [
    {
      type: 'free',
      name: 'Free Plan',
      price: 0,
      description: 'Perfect for getting started with basic note-taking needs',
      features: ['Up to 3 notes', 'Basic editing', 'Tenant isolation', 'Mobile access']
    },
    {
      type: 'pro',
      name: 'Pro Plan',
      price: 29.99,
      description: 'Unlimited notes and advanced features for growing teams',
      features: ['Unlimited notes', 'Advanced editing', 'Priority support', 'File attachments']
    }
  ];

  // Check user role access
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      // In a real app, this would redirect to unauthorized page
      console.warn('Access denied: Admin role required for subscription management');
    }
  }, [user]);

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setIsUpgradeModalOpen(true);
  };

  const handleConfirmUpgrade = async (plan, paymentData) => {
    setIsUpgrading(true);
    setUpgradeError(null); // Clear any previous errors

    try {
      console.log('Upgrading plan for tenant:', tenant);
      if (!tenant || !tenant.slug) {
        throw new Error('Tenant slug is undefined');
      }
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/tenants/${tenant.slug}/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upgrade failed' }));
        throw new Error(errorData.message || 'Upgrade failed');
      }

      // Update subscription state
      setSubscription(prev => ({
        ...prev,
        plan: 'Pro',
        notesLimit: null, // Unlimited
        billingCycle: 'monthly',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)?.toISOString()
      }));

      // Refresh billing history from backend
      const billingResponse = await fetch(`/api/tenants/${tenant.slug}/billing-history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (billingResponse.ok) {
        const updatedBillingHistory = await billingResponse.json();
        setBillingHistory(updatedBillingHistory);
      }

      setIsUpgradeModalOpen(false);
      setShowSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);

    } catch (error) {
      console.error('Upgrade failed:', error);
      setUpgradeError(error.message || 'Upgrade failed. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCloseModal = () => {
    if (!isUpgrading) {
      setIsUpgradeModalOpen(false);
      setSelectedPlan(null);
    }
  };

  // Access control check
  if (user?.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          user={user} 
          tenant={tenant}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isMenuOpen={isSidebarOpen}
        />
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          user={user}
          tenant={tenant}
          subscription={subscription}
        />
        <main className="lg:ml-60 pt-16">
          <div className="p-6">
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Lock" size={24} className="text-error" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Access Denied
              </h1>
              <p className="text-muted-foreground mb-6">
                You need Admin privileges to access subscription management.
              </p>
              <Button
                variant="outline"
                onClick={() => window.history?.back()}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Go Back
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        tenant={tenant}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      />
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        tenant={tenant}
        subscription={subscription}
      />
      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center space-x-3">
              <Icon name="CheckCircle" size={20} className="text-success" />
              <div className="flex-1">
                <p className="font-medium text-success">
                  Subscription upgraded successfully!
                </p>
                <p className="text-sm text-success/80">
                  Your Pro plan is now active with unlimited notes.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuccess(false)}
                iconName="X"
                iconSize={16}
                className="text-success hover:text-success"
              >
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          )}
          {/* Upgrade Error Message */}
          {upgradeError && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-center space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error" />
              <div className="flex-1">
                <p className="font-medium text-error">
                  {upgradeError}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUpgradeError(null)}
                iconName="X"
                iconSize={16}
                className="text-error hover:text-error"
              >
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="CreditCard" size={24} className="text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                Subscription Management
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage your subscription plan and billing information for {tenant?.name}
            </p>
          </div>

          {/* Current Usage Section */}
          <div className="mb-8">
            <UsageMetrics subscription={subscription} tenant={tenant} />
          </div>

          {/* Plans Comparison */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Available Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans?.map((plan) => (
                <PlanCard
                  key={plan?.type}
                  plan={plan}
                  isCurrentPlan={subscription?.plan?.toLowerCase() === plan?.type}
                  onUpgrade={handleUpgrade}
                  isUpgrading={isUpgrading}
                />
              ))}
            </div>
          </div>

          {/* Payment Methods and Billing History */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <PaymentMethods subscription={subscription} />
          <BillingHistory subscription={subscription} billingHistory={billingHistory} error={billingHistoryError} />
        </div>

          {/* Additional Information */}
          <div className="bg-muted/30 border border-border rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-2">
                  Subscription Information
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• You can upgrade or downgrade your plan at any time</p>
                  <p>• Changes take effect immediately for upgrades</p>
                  <p>• Downgrades take effect at the end of your current billing cycle</p>
                  <p>• All data remains secure during plan changes</p>
                  <p>• Contact support for any billing questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={handleCloseModal}
        selectedPlan={selectedPlan}
        onConfirmUpgrade={handleConfirmUpgrade}
        isProcessing={isUpgrading}
      />
    </div>
  );
};

export default SubscriptionManagement;