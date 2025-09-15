import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      label: 'SSL Encrypted',
      description: '256-bit encryption'
    },
    {
      icon: 'Lock',
      label: 'Data Isolation',
      description: 'Tenant-specific security'
    },
    {
      icon: 'CheckCircle',
      label: 'Enterprise Ready',
      description: 'SOC 2 compliant'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-center space-x-8">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center mb-1">
                <Icon name={feature?.icon} size={16} className="text-success" />
              </div>
              <div className="text-xs">
                <div className="font-medium text-foreground">{feature?.label}</div>
                <div className="text-muted-foreground">{feature?.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Trust Statement */}
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Your data is protected with enterprise-grade security
        </p>
      </div>
    </div>
  );
};

export default SecurityBadges;