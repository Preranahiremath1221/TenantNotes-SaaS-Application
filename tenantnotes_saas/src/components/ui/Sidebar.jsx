import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ 
  isOpen = false, 
  onClose, 
  user = { role: 'Member' }, 
  tenant = { name: 'TenantNotes' },
  subscription = { plan: 'Free', notesUsed: 15, notesLimit: 50 }
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      roles: ['Admin', 'Member']
    },
    {
      label: 'Notes',
      path: '/notes-management',
      icon: 'FileText',
      roles: ['Admin', 'Member']
    },
    {
      label: 'Users',
      path: '/user-management',
      icon: 'Users',
      roles: ['Admin']
    },
    {
      label: 'Subscription',
      path: '/subscription-management',
      icon: 'CreditCard',
      roles: ['Admin']
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  const isActive = (path) => location?.pathname === path;
  const hasAccess = (roles) => roles?.includes(user?.role);

  const SubscriptionIndicator = () => {
    if (subscription?.plan === 'Free' && subscription?.notesLimit) {
      const percentage = (subscription?.notesUsed / subscription?.notesLimit) * 100;
      const isNearLimit = percentage >= 80;
      
      return (
        <div className="px-4 py-3 mx-4 mb-4 bg-muted rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Notes Used</span>
            <span className="text-xs font-mono text-foreground">
              {subscription?.notesUsed}/{subscription?.notesLimit}
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isNearLimit ? 'bg-warning' : 'bg-accent'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          {isNearLimit && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleNavigation('/subscription-management')}
                className="w-full text-xs"
                iconName="ArrowUp"
                iconSize={12}
              >
                Upgrade Plan
              </Button>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-150 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-card border-r border-border z-200 lg:z-100
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">TenantNotes</h1>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
              iconName="X"
              iconSize={20}
            >
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Tenant Context */}
          <div className="px-6 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-secondary rounded flex items-center justify-center">
                <Icon name="Building" size={12} color="white" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {tenant?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.role} Access
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            <ul className="space-y-2 px-4">
              {navigationItems?.map((item) => {
                if (!hasAccess(item?.roles)) return null;
                
                const active = isActive(item?.path);
                
                return (
                  <li key={item?.path}>
                    <button
                      onClick={() => handleNavigation(item?.path)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-left
                        transition-micro font-medium text-sm
                        ${active 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-foreground hover:bg-muted hover:text-foreground'
                        }
                      `}
                    >
                      <Icon 
                        name={item?.icon} 
                        size={18} 
                        className={active ? 'text-primary-foreground' : 'text-muted-foreground'}
                      />
                      <span>{item?.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Subscription Indicator */}
          <SubscriptionIndicator />

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              © 2025 TenantNotes SaaS
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;