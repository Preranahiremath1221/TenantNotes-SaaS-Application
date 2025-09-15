import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActions = ({ userRole, onCreateNote, onInviteUser, onUpgradeSubscription, onManageUsers }) => {
  const adminActions = [
    {
      title: 'Invite User',
      description: 'Add new team members to your workspace',
      icon: 'UserPlus',
      variant: 'outline',
      onClick: onInviteUser
    },
    {
      title: 'Manage Users',
      description: 'View and manage all workspace members',
      icon: 'Users',
      variant: 'outline',
      onClick: onManageUsers
    },
    {
      title: 'Upgrade Plan',
      description: 'Unlock unlimited notes and advanced features',
      icon: 'ArrowUp',
      variant: 'default',
      onClick: onUpgradeSubscription
    }
  ];

  const memberActions = [
    {
      title: 'Create Note',
      description: 'Start writing your thoughts and ideas',
      icon: 'Plus',
      variant: 'default',
      onClick: onCreateNote
    },
    {
      title: 'Browse Notes',
      description: 'View and organize your existing notes',
      icon: 'FileText',
      variant: 'outline',
      onClick: () => window.location.href = '/notes-management'
    }
  ];

  const actions = userRole === 'Admin' ? adminActions : memberActions;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions?.map((action, index) => (
          <div 
            key={index}
            className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-micro cursor-pointer group"
            onClick={action?.onClick}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-micro">
                <Button
                  variant="ghost"
                  size="icon"
                  iconName={action?.icon}
                  iconSize={20}
                  className="p-0 h-auto w-auto hover:bg-transparent"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground mb-1">
                  {action?.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {action?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;