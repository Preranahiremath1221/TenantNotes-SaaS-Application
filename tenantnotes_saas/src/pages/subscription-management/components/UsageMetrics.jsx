import React from 'react';
import Icon from '../../../components/AppIcon';

const UsageMetrics = ({ subscription, tenant }) => {
  const { plan, notesUsed, notesLimit, billingCycle } = subscription;
  
  const usagePercentage = notesLimit ? (notesUsed / notesLimit) * 100 : 0;
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = usagePercentage >= 100;

  const getUsageColor = () => {
    if (isAtLimit) return 'bg-error';
    if (isNearLimit) return 'bg-warning';
    return 'bg-success';
  };

  const getUsageTextColor = () => {
    if (isAtLimit) return 'text-error';
    if (isNearLimit) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Current Usage
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {tenant?.name}
          </span>
        </div>
      </div>
      {/* Plan Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground mb-1">
            {plan}
          </div>
          <div className="text-sm text-muted-foreground">
            Current Plan
          </div>
        </div>

        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className={`text-2xl font-bold mb-1 ${getUsageTextColor()}`}>
            {notesUsed}
          </div>
          <div className="text-sm text-muted-foreground">
            Notes Created
          </div>
        </div>

        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground mb-1">
            {notesLimit === null ? '∞' : notesLimit}
          </div>
          <div className="text-sm text-muted-foreground">
            Notes Limit
          </div>
        </div>
      </div>
      {/* Usage Progress Bar */}
      {notesLimit && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Notes Usage
            </span>
            <span className={`text-sm font-medium ${getUsageTextColor()}`}>
              {Math.round(usagePercentage)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getUsageColor()}`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              0 notes
            </span>
            <span className="text-xs text-muted-foreground">
              {notesLimit} notes
            </span>
          </div>
        </div>
      )}
      {/* Usage Alerts */}
      {isAtLimit && (
        <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg mb-4">
          <Icon name="AlertTriangle" size={16} className="text-error" />
          <div className="flex-1">
            <p className="text-sm font-medium text-error">
              Note limit reached
            </p>
            <p className="text-xs text-error/80">
              Upgrade to Pro to create unlimited notes
            </p>
          </div>
        </div>
      )}
      {isNearLimit && !isAtLimit && (
        <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg mb-4">
          <Icon name="AlertCircle" size={16} className="text-warning" />
          <div className="flex-1">
            <p className="text-sm font-medium text-warning">
              Approaching limit
            </p>
            <p className="text-xs text-warning/80">
              You're using {Math.round(usagePercentage)}% of your note limit
            </p>
          </div>
        </div>
      )}
      {/* Billing Information */}
      {billingCycle && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Billing Cycle:</span>
            <span className="font-medium text-foreground">
              {billingCycle}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageMetrics;