import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PlanCard = ({ 
  plan, 
  isCurrentPlan = false, 
  onUpgrade, 
  isUpgrading = false 
}) => {
  const planFeatures = {
    free: [
      { feature: "Up to 3 notes", included: true },
      { feature: "Basic note editing", included: true },
      { feature: "Tenant isolation", included: true },
      { feature: "Mobile access", included: true },
      { feature: "Email support", included: false },
      { feature: "Advanced search", included: false },
      { feature: "File attachments", included: false },
      { feature: "Priority support", included: false }
    ],
    pro: [
      { feature: "Unlimited notes", included: true },
      { feature: "Advanced note editing", included: true },
      { feature: "Tenant isolation", included: true },
      { feature: "Mobile access", included: true },
      { feature: "Email support", included: true },
      { feature: "Advanced search", included: true },
      { feature: "File attachments", included: true },
      { feature: "Priority support", included: true }
    ]
  };

  const features = planFeatures?.[plan?.type] || [];

  return (
    <div className={`
      relative bg-card border rounded-lg p-6 transition-all duration-300
      ${isCurrentPlan 
        ? 'border-primary shadow-lg ring-2 ring-primary/20' 
        : 'border-border hover:border-primary/50 hover:shadow-md'
      }
    `}>
      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
            Current Plan
          </span>
        </div>
      )}
      {/* Plan Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {plan?.name}
        </h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-foreground">
            ${plan?.price}
          </span>
          <span className="text-muted-foreground">
            {plan?.type === 'free' ? '/forever' : '/month'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {plan?.description}
        </p>
      </div>
      {/* Features List */}
      <div className="space-y-3 mb-6">
        {features?.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`
              w-5 h-5 rounded-full flex items-center justify-center
              ${item?.included 
                ? 'bg-success text-success-foreground' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              <Icon 
                name={item?.included ? "Check" : "X"} 
                size={12} 
              />
            </div>
            <span className={`
              text-sm
              ${item?.included ? 'text-foreground' : 'text-muted-foreground'}
            `}>
              {item?.feature}
            </span>
          </div>
        ))}
      </div>
      {/* Action Button */}
      <div className="mt-auto">
        {isCurrentPlan ? (
          <Button 
            variant="outline" 
            fullWidth 
            disabled
            iconName="Check"
            iconPosition="left"
          >
            Current Plan
          </Button>
        ) : (
          <Button 
            variant={plan?.type === 'pro' ? 'default' : 'outline'}
            fullWidth
            onClick={() => onUpgrade(plan)}
            loading={isUpgrading}
            iconName={plan?.type === 'pro' ? "ArrowUp" : "Eye"}
            iconPosition="left"
          >
            {plan?.type === 'pro' ? 'Upgrade Now' : 'Current Plan'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlanCard;