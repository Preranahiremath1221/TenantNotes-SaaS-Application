import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PendingInvitations = ({ invitations, onResendInvitation, onCancelInvitation }) => {
  const formatInviteDate = (date) => {
    const inviteDate = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now - inviteDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return inviteDate?.toLocaleDateString();
  };

  const getRoleColor = (role) => {
    return role === 'Admin' ?'bg-primary/10 text-primary border-primary/20' :'bg-secondary/10 text-secondary border-secondary/20';
  };

  if (invitations?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <Icon name="Mail" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No pending invitations</h3>
        <p className="text-muted-foreground">
          All sent invitations have been accepted or expired.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pending Invitations</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {invitations?.length} invitation{invitations?.length !== 1 ? 's' : ''} awaiting response
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Expires in 7 days</span>
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-foreground">Email</th>
              <th className="text-left px-6 py-3 font-medium text-foreground">Role</th>
              <th className="text-left px-6 py-3 font-medium text-foreground">Invited</th>
              <th className="text-left px-6 py-3 font-medium text-foreground">Status</th>
              <th className="text-right px-6 py-3 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invitations?.map((invitation) => (
              <tr key={invitation?.id} className="hover:bg-muted/30 transition-micro">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                      <Icon name="Mail" size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{invitation?.email}</div>
                      {invitation?.message && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {invitation?.message}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(invitation?.role)}`}>
                    {invitation?.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {formatInviteDate(invitation?.sentAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-sm text-foreground">Pending</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResendInvitation(invitation)}
                      iconName="RefreshCw"
                      iconPosition="left"
                      iconSize={14}
                    >
                      Resend
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancelInvitation(invitation)}
                      iconName="X"
                      iconPosition="left"
                      iconSize={14}
                      className="text-error hover:text-error"
                    >
                      Cancel
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {invitations?.map((invitation) => (
          <div key={invitation?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                  <Icon name="Mail" size={18} />
                </div>
                <div>
                  <div className="font-medium text-foreground">{invitation?.email}</div>
                  <div className="text-sm text-muted-foreground">
                    Invited {formatInviteDate(invitation?.sentAt)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-xs text-foreground">Pending</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(invitation?.role)}`}>
                {invitation?.role}
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onResendInvitation(invitation)}
                  iconName="RefreshCw"
                  iconSize={14}
                >
                  Resend
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCancelInvitation(invitation)}
                  iconName="X"
                  iconSize={14}
                  className="text-error hover:text-error"
                >
                  Cancel
                </Button>
              </div>
            </div>
            
            {invitation?.message && (
              <div className="mt-3 p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">{invitation?.message}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingInvitations;