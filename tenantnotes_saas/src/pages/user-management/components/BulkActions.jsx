import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedUsers, users, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const actionOptions = [
    { value: '', label: 'Select action...', disabled: true },
    { value: 'changeRole', label: 'Change Role' },
    { value: 'deactivate', label: 'Deactivate Users' },
    { value: 'activate', label: 'Activate Users' },
    { value: 'export', label: 'Export Selected' }
  ];

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Member', label: 'Member' }
  ];

  const [targetRole, setTargetRole] = useState('Member');
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const selectedUserData = users?.filter(user => selectedUsers?.includes(user?.id));
  const selectedCount = selectedUsers?.length;

  const handleActionChange = (action) => {
    setSelectedAction(action);
    setShowRoleSelector(action === 'changeRole');
  };

  const handleExecuteAction = async () => {
    if (!selectedAction || selectedUsers?.length === 0) return;

    setIsLoading(true);
    
    try {
      const actionData = {
        action: selectedAction,
        userIds: selectedUsers,
        ...(selectedAction === 'changeRole' && { targetRole })
      };
      
      await onBulkAction(actionData);
      setSelectedAction('');
      setShowRoleSelector(false);
      onClearSelection();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionSummary = () => {
    if (selectedCount === 0) return null;

    const actionLabels = {
      changeRole: `Change ${selectedCount} user${selectedCount !== 1 ? 's' : ''} to ${targetRole}`,
      deactivate: `Deactivate ${selectedCount} user${selectedCount !== 1 ? 's' : ''}`,
      activate: `Activate ${selectedCount} user${selectedCount !== 1 ? 's' : ''}`,
      export: `Export ${selectedCount} user${selectedCount !== 1 ? 's' : ''}`
    };

    return actionLabels?.[selectedAction] || null;
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
            iconSize={14}
          >
            Clear Selection
          </Button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Select
            options={actionOptions}
            value={selectedAction}
            onChange={handleActionChange}
            placeholder="Select action..."
            className="w-full sm:w-48"
          />

          {showRoleSelector && (
            <Select
              options={roleOptions}
              value={targetRole}
              onChange={setTargetRole}
              className="w-full sm:w-32"
            />
          )}

          <Button
            onClick={handleExecuteAction}
            disabled={!selectedAction || isLoading}
            loading={isLoading}
            iconName="Play"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Execute
          </Button>
        </div>
      </div>
      {/* Action Summary */}
      {getActionSummary() && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md border-l-4 border-primary">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={16} className="text-primary" />
            <span className="text-sm text-foreground font-medium">
              Action Preview:
            </span>
            <span className="text-sm text-muted-foreground">
              {getActionSummary()}
            </span>
          </div>
        </div>
      )}
      {/* Selected Users Preview */}
      <div className="mt-4">
        <div className="text-sm text-muted-foreground mb-2">Selected users:</div>
        <div className="flex flex-wrap gap-2">
          {selectedUserData?.slice(0, 5)?.map((user) => (
            <div
              key={user?.id}
              className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-sm"
            >
              <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-foreground">{user?.name}</span>
            </div>
          ))}
          {selectedUserData?.length > 5 && (
            <div className="flex items-center px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
              +{selectedUserData?.length - 5} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkActions;