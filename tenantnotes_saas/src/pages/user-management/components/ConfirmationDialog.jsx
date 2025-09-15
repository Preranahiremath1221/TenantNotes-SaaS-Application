import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'default',
  isLoading = false,
  user = null
}) => {
  if (!isOpen) return null;

  const getTypeConfig = () => {
    const configs = {
      danger: {
        icon: 'AlertTriangle',
        iconColor: 'text-error',
        confirmVariant: 'destructive'
      },
      warning: {
        icon: 'AlertCircle',
        iconColor: 'text-warning',
        confirmVariant: 'warning'
      },
      default: {
        icon: 'HelpCircle',
        iconColor: 'text-primary',
        confirmVariant: 'default'
      }
    };
    
    return configs?.[type] || configs?.default;
  };

  const config = getTypeConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-md">
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${config?.iconColor}`}>
              <Icon name={config?.icon} size={20} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-foreground mb-3">{message}</p>
            
            {user && (
              <div className="p-3 bg-muted/50 rounded-md border border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{user?.name}</div>
                    <div className="text-sm text-muted-foreground">{user?.email}</div>
                    <div className="text-xs text-muted-foreground">Role: {user?.role}</div>
                  </div>
                </div>
              </div>
            )}

            {type === 'danger' && (
              <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-md">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
                  <div className="text-sm text-error">
                    <strong>Warning:</strong> This action cannot be undone. The user will lose access to their account and all associated data.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={config?.confirmVariant}
              onClick={onConfirm}
              loading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;