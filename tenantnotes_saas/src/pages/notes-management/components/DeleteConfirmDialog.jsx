import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DeleteConfirmDialog = ({ 
  isOpen, 
  note, 
  onConfirm, 
  onCancel, 
  isLoading 
}) => {
  if (!isOpen || !note) return null;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
      <div className="bg-card border border-border rounded-lg shadow-card-elevation-2 max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="Trash2" size={20} className="text-error" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Delete Note
              </h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-foreground mb-4">
              Are you sure you want to delete this note? This will permanently remove 
              the note and all its content from your account.
            </p>
            
            {/* Note Preview */}
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2 line-clamp-1">
                {note?.title}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {note?.content?.length > 100 
                  ? note?.content?.substring(0, 100) + '...' 
                  : note?.content}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Created: {formatDate(note?.createdAt)}</span>
                <span>{note?.content?.length} characters</span>
              </div>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-6">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning mb-1">
                  Warning: Permanent Deletion
                </p>
                <p className="text-xs text-muted-foreground">
                  Once deleted, this note cannot be recovered. Make sure you have 
                  saved any important information elsewhere.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              fullWidth
              className="sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => onConfirm(note?._id || note?.id)}
              disabled={isLoading}
              loading={isLoading}
              iconName="Trash2"
              iconPosition="left"
              fullWidth
              className="sm:flex-1"
            >
              Delete Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;