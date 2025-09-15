import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const UserTable = ({ users, onEditUser, onDeactivateUser, onRoleChange, selectedUsers, onUserSelect, onSelectAll }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Member', label: 'Member' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-success', text: 'text-success-foreground', label: 'Active' },
      pending: { bg: 'bg-warning', text: 'text-warning-foreground', label: 'Pending' },
      inactive: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Inactive' }
    };

    const config = statusConfig?.[status] || statusConfig?.inactive;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  const formatLastActivity = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return activityDate?.toLocaleDateString();
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedUsers?.length === users?.length && users?.length > 0}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                  className="rounded border-border focus:ring-2 focus:ring-ring"
                />
              </th>
              <th 
                className="text-left px-4 py-3 font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-micro"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Name</span>
                  <Icon 
                    name={sortField === 'name' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className={sortField === 'name' ? 'text-foreground' : 'text-muted-foreground'} 
                  />
                </div>
              </th>
              <th 
                className="text-left px-4 py-3 font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-micro"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center space-x-2">
                  <span>Email</span>
                  <Icon 
                    name={sortField === 'email' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className={sortField === 'email' ? 'text-foreground' : 'text-muted-foreground'} 
                  />
                </div>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Role</th>
              <th 
                className="text-left px-4 py-3 font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-micro"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-2">
                  <span>Status</span>
                  <Icon 
                    name={sortField === 'status' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className={sortField === 'status' ? 'text-foreground' : 'text-muted-foreground'} 
                  />
                </div>
              </th>
              <th 
                className="text-left px-4 py-3 font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-micro"
                onClick={() => handleSort('lastActivity')}
              >
                <div className="flex items-center space-x-2">
                  <span>Last Activity</span>
                  <Icon 
                    name={sortField === 'lastActivity' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className={sortField === 'lastActivity' ? 'text-foreground' : 'text-muted-foreground'} 
                  />
                </div>
              </th>
              <th className="text-right px-4 py-3 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedUsers?.map((user) => (
              <tr key={user?.id} className="hover:bg-muted/30 transition-micro">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers?.includes(user?.id)}
                    onChange={(e) => onUserSelect(user?.id, e?.target?.checked)}
                    className="rounded border-border focus:ring-2 focus:ring-ring"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {user?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user?.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-foreground">{user?.email}</td>
                <td className="px-4 py-4">
                  <Select
                    options={roleOptions}
                    value={user?.role}
                    onChange={(newRole) => onRoleChange(user?.id, newRole)}
                    className="w-32"
                  />
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(user?.status)}
                </td>
                <td className="px-4 py-4 text-muted-foreground">
                  {formatLastActivity(user?.lastActivity)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditUser(user)}
                      iconName="Edit"
                      iconSize={16}
                    >
                      <span className="sr-only">Edit user</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeactivateUser(user)}
                      iconName="UserX"
                      iconSize={16}
                      className="text-error hover:text-error"
                    >
                      <span className="sr-only">Deactivate user</span>
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
        {sortedUsers?.map((user) => (
          <div key={user?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedUsers?.includes(user?.id)}
                  onChange={(e) => onUserSelect(user?.id, e?.target?.checked)}
                  className="rounded border-border focus:ring-2 focus:ring-ring mt-1"
                />
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-foreground">{user?.name}</div>
                  <div className="text-sm text-muted-foreground">{user?.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditUser(user)}
                  iconName="Edit"
                  iconSize={16}
                >
                  <span className="sr-only">Edit user</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeactivateUser(user)}
                  iconName="UserX"
                  iconSize={16}
                  className="text-error hover:text-error"
                >
                  <span className="sr-only">Deactivate user</span>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Role:</span>
                <div className="mt-1">
                  <Select
                    options={roleOptions}
                    value={user?.role}
                    onChange={(newRole) => onRoleChange(user?.id, newRole)}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div className="mt-1">
                  {getStatusBadge(user?.status)}
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Last Activity:</span>
                <div className="mt-1 text-foreground">
                  {formatLastActivity(user?.lastActivity)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sortedUsers?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground">No users match your current search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;