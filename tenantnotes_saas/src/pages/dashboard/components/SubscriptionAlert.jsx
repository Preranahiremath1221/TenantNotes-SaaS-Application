import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubscriptionAlert = ({ subscription, userRole, onUpgrade }) => {
  if (!subscription || subscription?.plan !== 'Free') {
    return null;
  }

  const { notesUsed = 0, notesLimit = 3 } = subscription;
  const percentage = (notesUsed / notesLimit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = notesUsed >= notesLimit;

  if (!isNearLimit && !isAtLimit) {
    return null;
  }

  const getAlertVariant = () => {
    if (isAtLimit) return 'error';
    if (isNearLimit) return 'warning';
    return 'default';
  };

  const getAlertStyles = () => {
    const variant = getAlertVariant();
    switch (variant) {
      case 'error':
        return 'border-error/20 bg-error/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getIconName = () => {
    if (isAtLimit) return 'AlertCircle';
    if (isNearLimit) return 'AlertTriangle';
    return 'Info';
  };

  const getIconColor = () => {
    if (isAtLimit) return 'var(--color-error)';
    if (isNearLimit) return 'var(--color-warning)';
    return 'var(--color-primary)';
  };

  const getMessage = () => {
    if (isAtLimit) {
      return `You've reached your note limit (${notesLimit} notes). Upgrade to Pro for unlimited notes.`;
    }
    if (isNearLimit) {
      return `You're using ${notesUsed} of ${notesLimit} notes. Consider upgrading to Pro for unlimited access.`;
    }
    return '';
  };

  return (
    <div className={`p-4 rounded-lg border ${getAlertStyles()} mb-6`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <Icon name={getIconName()} size={20} color={getIconColor()} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground mb-1">
            {isAtLimit ? 'Note Limit Reached' : 'Approaching Note Limit'}
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {getMessage()}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-xs text-muted-foreground">
                Usage: {notesUsed}/{notesLimit}
              </div>
              <div className="w-24 bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isAtLimit ? 'bg-error' : isNearLimit ? 'bg-warning' : 'bg-accent'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
            
            {userRole === 'Admin' && (
              <Button
                variant={isAtLimit ? 'default' : 'outline'}
                size="sm"
                onClick={onUpgrade}
                iconName="ArrowUp"
                iconPosition="left"
              >
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAlert;