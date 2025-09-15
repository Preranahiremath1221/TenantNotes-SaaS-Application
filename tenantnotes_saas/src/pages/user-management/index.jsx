import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserTable from './components/UserTable';
import InviteUserModal from './components/InviteUserModal';
import PendingInvitations from './components/PendingInvitations';
import BulkActions from './components/BulkActions';
import ConfirmationDialog from './components/ConfirmationDialog';
import UserFilters from './components/UserFilters';

const UserManagement = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', user: null });

  // Get user from localStorage
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [subscription, setSubscription] = useState({ plan: 'Free', notesUsed: 0, notesLimit: 3 });
  const [isLoading, setIsLoading] = useState(true);

  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setCurrentUser(parsed);
      setCurrentTenant(parsed.tenant);
      // For now, set subscription based on tenant, but in future fetch from API
      setSubscription({ plan: 'Free', notesUsed: 0, notesLimit: 3 });
    }
    setIsLoading(false);
  }, []);

  // Mock users data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@acme.com",
      role: "Admin",
      status: "active",
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@acme.com",
      role: "Member",
      status: "active",
      lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@acme.com",
      role: "Member",
      status: "active",
      lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@acme.com",
      role: "Member",
      status: "inactive",
      lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: 5,
      name: "Lisa Thompson",
      email: "lisa.thompson@acme.com",
      role: "Admin",
      status: "active",
      lastActivity: new Date(Date.now() - 30 * 60 * 1000)
    }
  ]);

  // Mock pending invitations
  const [pendingInvitations, setPendingInvitations] = useState([
    {
      id: 1,
      email: "john.doe@acme.com",
      role: "Member",
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      message: "Welcome to our team! Looking forward to working with you."
    },
    {
      id: 2,
      email: "jane.smith@acme.com",
      role: "Admin",
      sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      message: ""
    }
  ]);

  // Check if user has admin access
  useEffect(() => {
    if (!isLoading && currentUser && currentUser.role !== 'Admin') {
      navigate('/dashboard');
    }
  }, [isLoading, currentUser, navigate]);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users?.filter(user => {
      const matchesSearch = !searchQuery || 
        user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      
      const matchesRole = !roleFilter || user?.role === roleFilter;
      const matchesStatus = !statusFilter || user?.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleInviteUser = async (inviteData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newInvitation = {
      id: Date.now(),
      email: inviteData?.email,
      role: inviteData?.role,
      sentAt: new Date(),
      message: inviteData?.message
    };
    
    setPendingInvitations(prev => [...prev, newInvitation]);
  };

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
    // Implement edit user functionality
  };

  const handleDeactivateUser = (user) => {
    setConfirmDialog({
      isOpen: true,
      type: 'danger',
      user: user,
      title: 'Deactivate User',
      message: `Are you sure you want to deactivate ${user?.name}? They will lose access to their account immediately.`,
      confirmText: 'Deactivate',
      action: 'deactivate'
    });
  };

  const handleRoleChange = async (userId, newRole) => {
    const user = users?.find(u => u?.id === userId);
    setConfirmDialog({
      isOpen: true,
      type: 'warning',
      user: { ...user, newRole },
      title: 'Change User Role',
      message: `Change ${user?.name}'s role from ${user?.role} to ${newRole}? This will immediately update their access permissions.`,
      confirmText: 'Change Role',
      action: 'roleChange'
    });
  };

  const handleConfirmAction = async () => {
    const { action, user } = confirmDialog;
    
    if (action === 'deactivate') {
      setUsers(prev => prev?.map(u => 
        u?.id === user?.id ? { ...u, status: 'inactive' } : u
      ));
    } else if (action === 'roleChange') {
      setUsers(prev => prev?.map(u => 
        u?.id === user?.id ? { ...u, role: user?.newRole } : u
      ));
    }
    
    setConfirmDialog({ isOpen: false, type: '', user: null });
  };

  const handleUserSelect = (userId, isSelected) => {
    setSelectedUsers(prev => 
      isSelected 
        ? [...prev, userId]
        : prev?.filter(id => id !== userId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedUsers(isSelected ? filteredUsers?.map(user => user?.id) : []);
  };

  const handleBulkAction = async (actionData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { action, userIds, targetRole } = actionData;
    
    if (action === 'changeRole' && targetRole) {
      setUsers(prev => prev?.map(user => 
        userIds?.includes(user?.id) ? { ...user, role: targetRole } : user
      ));
    } else if (action === 'deactivate') {
      setUsers(prev => prev?.map(user => 
        userIds?.includes(user?.id) ? { ...user, status: 'inactive' } : user
      ));
    } else if (action === 'activate') {
      setUsers(prev => prev?.map(user => 
        userIds?.includes(user?.id) ? { ...user, status: 'active' } : user
      ));
    }
    
    console.log('Bulk action executed:', actionData);
  };

  const handleResendInvitation = async (invitation) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setPendingInvitations(prev => prev?.map(inv => 
      inv?.id === invitation?.id 
        ? { ...inv, sentAt: new Date() }
        : inv
    ));
    
    console.log('Invitation resent:', invitation);
  };

  const handleCancelInvitation = async (invitation) => {
    setPendingInvitations(prev => prev?.filter(inv => inv?.id !== invitation?.id));
    console.log('Invitation cancelled:', invitation);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setRoleFilter('');
    setStatusFilter('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading user management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={currentUser}
        tenant={currentTenant}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      />
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={currentUser}
        tenant={currentTenant}
        subscription={subscription}
      />
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage users and invitations for {currentTenant?.name}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button
                  onClick={() => setIsInviteModalOpen(true)}
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Invite User
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{users?.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">
                    {users?.filter(u => u?.status === 'active')?.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="UserCheck" size={24} className="text-success" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Invites</p>
                  <p className="text-2xl font-bold text-foreground">{pendingInvitations?.length}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Mail" size={24} className="text-warning" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold text-foreground">
                    {users?.filter(u => u?.role === 'Admin')?.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-secondary" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <UserFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={handleClearFilters}
            totalUsers={users?.length}
            filteredCount={filteredUsers?.length}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedUsers={selectedUsers}
            users={filteredUsers}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedUsers([])}
          />

          {/* Users Table */}
          <div className="mb-8">
            <UserTable
              users={filteredUsers}
              onEditUser={handleEditUser}
              onDeactivateUser={handleDeactivateUser}
              onRoleChange={handleRoleChange}
              selectedUsers={selectedUsers}
              onUserSelect={handleUserSelect}
              onSelectAll={handleSelectAll}
            />
          </div>

          {/* Pending Invitations */}
          {pendingInvitations?.length > 0 && (
            <PendingInvitations
              invitations={pendingInvitations}
              onResendInvitation={handleResendInvitation}
              onCancelInvitation={handleCancelInvitation}
            />
          )}
        </div>
      </main>
      {/* Modals */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
      />
      <ConfirmationDialog
        isOpen={confirmDialog?.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: '', user: null })}
        onConfirm={handleConfirmAction}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        confirmText={confirmDialog?.confirmText}
        type={confirmDialog?.type}
        user={confirmDialog?.user}
      />
    </div>
  );
};

export default UserManagement;