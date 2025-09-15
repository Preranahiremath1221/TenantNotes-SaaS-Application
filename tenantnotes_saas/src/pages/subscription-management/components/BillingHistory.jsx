import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BillingHistory = ({ subscription, billingHistory, error }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedHistory = showAll ? billingHistory : billingHistory?.slice(0, 3);

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: {
        bg: 'bg-success/10',
        text: 'text-success',
        border: 'border-success/20',
        label: 'Paid'
      },
      failed: {
        bg: 'bg-error/10',
        text: 'text-error',
        border: 'border-error/20',
        label: 'Failed'
      },
      pending: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        border: 'border-warning/20',
        label: 'Pending'
      }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span className={`
        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
        ${config?.bg} ${config?.text} ${config?.border}
      `}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  if (subscription?.plan === 'Free') {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Billing History
          </h3>
          <Icon name="Receipt" size={20} className="text-muted-foreground" />
        </div>
        
        <div className="text-center py-8">
          <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">
            No billing history available
          </p>
          <p className="text-sm text-muted-foreground">
            You're currently on the Free plan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Billing History
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Receipt" size={20} className="text-muted-foreground" />
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <p className="text-sm text-error">{error}</p>
          </div>
        </div>
      )}

      {/* Billing Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                Date
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                Description
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                Amount
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                Payment
              </th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedHistory?.map((invoice) => (
              <tr key={invoice?.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-4 px-2">
                  <div className="text-sm font-medium text-foreground">
                    {formatDate(invoice?.date)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {invoice?.id}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-foreground">
                    {invoice?.description}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-foreground">
                    {invoice?.name}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm font-medium text-foreground">
                    {formatAmount(invoice?.amount)}
                  </div>
                </td>
                <td className="py-4 px-2">
                  {getStatusBadge(invoice?.status)}
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="CreditCard" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {invoice?.paymentMethod}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    iconSize={14}
                  >
                    <span className="sr-only">Download invoice</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Show More/Less Button */}
      {billingHistory?.length > 3 && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            iconName={showAll ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showAll ? 'Show Less' : `Show All (${billingHistory?.length})`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BillingHistory;
