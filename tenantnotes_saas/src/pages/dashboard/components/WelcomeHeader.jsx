import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = ({ user, tenant, currentTime }) => {
  const getGreeting = () => {
    const hour = new Date(currentTime)?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })?.format(new Date(currentTime));
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-border rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {getGreeting()}, {user?.name || 'User'}!
          </h1>
          <p className="text-muted-foreground mb-1">
            Welcome back to your {tenant?.name || 'TenantNotes'} workspace
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{formatDate()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="Shield" size={14} />
              <span>{user?.role || 'Member'} Access</span>
            </span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {tenant?.name || 'TenantNotes'}
            </div>
            <div className="text-xs text-muted-foreground">
              Secure Workspace
            </div>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Building" size={20} color="var(--color-primary)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;