import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const UserFilters = ({ 
  searchQuery, 
  onSearchChange, 
  roleFilter, 
  onRoleFilterChange, 
  statusFilter, 
  onStatusFilterChange,
  onClearFilters,
  totalUsers,
  filteredCount
}) => {
  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Member', label: 'Member' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const hasActiveFilters = searchQuery || roleFilter || statusFilter;

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-micro"
            />
          </div>

          {/* Role Filter */}
          <Select
            options={roleOptions}
            value={roleFilter}
            onChange={onRoleFilterChange}
            className="w-full sm:w-32"
          />

          {/* Status Filter */}
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="w-full sm:w-32"
          />

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} />
            <span>
              {filteredCount === totalUsers 
                ? `${totalUsers} user${totalUsers !== 1 ? 's' : ''}` 
                : `${filteredCount} of ${totalUsers} user${totalUsers !== 1 ? 's' : ''}`
              }
            </span>
          </div>
        </div>
      </div>
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {searchQuery && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                <Icon name="Search" size={12} />
                <span>"{searchQuery}"</span>
                <button
                  onClick={() => onSearchChange('')}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-micro"
                >
                  <Icon name="X" size={10} />
                </button>
              </div>
            )}
            
            {roleFilter && (
              <div className="flex items-center space-x-1 bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs">
                <Icon name="Shield" size={12} />
                <span>{roleFilter}</span>
                <button
                  onClick={() => onRoleFilterChange('')}
                  className="hover:bg-secondary/20 rounded-full p-0.5 transition-micro"
                >
                  <Icon name="X" size={10} />
                </button>
              </div>
            )}
            
            {statusFilter && (
              <div className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs">
                <Icon name="Activity" size={12} />
                <span className="capitalize">{statusFilter}</span>
                <button
                  onClick={() => onStatusFilterChange('')}
                  className="hover:bg-accent/20 rounded-full p-0.5 transition-micro"
                >
                  <Icon name="X" size={10} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;