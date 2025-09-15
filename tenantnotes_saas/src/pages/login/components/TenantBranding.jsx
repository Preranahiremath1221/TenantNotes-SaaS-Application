import React from 'react';
import Icon from '../../../components/AppIcon';

const TenantBranding = ({ tenant }) => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <Icon name="FileText" size={32} color="white" />
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="text-3xl font-bold text-foreground mb-2">
        TenantNotes
      </h1>
      
      {/* Tagline */}
      <p className="text-muted-foreground text-lg">
        Secure Multi-Tenant Notes Management
      </p>

      {/* Tenant Context */}
      {tenant && (
        <div className="mt-4 inline-flex items-center px-3 py-1.5 bg-muted rounded-full">
          <Icon name="Building" size={14} className="mr-2 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {typeof tenant === 'string' ? tenant : tenant?.name || 'Default Tenant'}
          </span>
        </div>
      )}
    </div>
  );
};

export default TenantBranding;