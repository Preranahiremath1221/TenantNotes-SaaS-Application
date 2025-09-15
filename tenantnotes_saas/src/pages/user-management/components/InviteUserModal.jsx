import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InviteUserModal = ({ isOpen, onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'Member',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'Admin', label: 'Admin', description: 'Full access to all features and user management' },
    { value: 'Member', label: 'Member', description: 'Can create and manage notes within limits' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await onInvite(formData);
      setFormData({ email: '', role: 'Member', message: '' });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to send invitation. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', role: 'Member', message: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Invite User</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Send an invitation to join your organization
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            iconName="X"
            iconSize={20}
          >
            <span className="sr-only">Close modal</span>
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors?.submit && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <span className="text-sm text-error">{errors?.submit}</span>
              </div>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            description="The user will receive an invitation email at this address"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />

          <Select
            label="Role"
            description="Choose the access level for this user"
            options={roleOptions}
            value={formData?.role}
            onChange={(value) => handleInputChange('role', value)}
            error={errors?.role}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              placeholder="Add a personal message to the invitation..."
              value={formData?.message}
              onChange={(e) => handleInputChange('message', e?.target?.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This message will be included in the invitation email
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="Send"
              iconPosition="left"
            >
              Send Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;