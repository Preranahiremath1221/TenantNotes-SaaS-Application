import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NotesHeader = ({ 
  onCreateNote, 
  isCreateDisabled, 
  subscription,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange 
}) => {
  const sortOptions = [
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
    { value: 'modified_desc', label: 'Recently Modified' }
  ];

  const isNearLimit = subscription?.plan === 'Free' && 
    subscription?.notesUsed >= subscription?.notesLimit * 0.8;

  return (
    <div className="bg-card border-b border-border">
      <div className="p-6">
        {/* Title and Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Notes Management</h1>
            <p className="text-muted-foreground">
              Create, organize, and manage your notes
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Subscription Status */}
            {subscription?.plan === 'Free' && (
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${
                isNearLimit 
                  ? 'bg-warning/10 text-warning border border-warning/20' :'bg-muted text-muted-foreground'
              }`}>
                {subscription?.notesUsed}/{subscription?.notesLimit} notes used
              </div>
            )}
            
            <Button
              variant="default"
              onClick={onCreateNote}
              disabled={isCreateDisabled}
              iconName="Plus"
              iconPosition="left"
              className="sm:w-auto"
            >
              Create Note
            </Button>
          </div>
        </div>

        {/* Limit Warning */}
        {isCreateDisabled && subscription?.plan === 'Free' && (
          <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-warning mb-1">
                  Note Limit Reached
                </h3>
                <p className="text-sm text-muted-foreground">
                  You've reached your Free plan limit of {subscription?.notesLimit} notes. 
                  Upgrade to Pro for unlimited notes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search notes by title or content..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-micro"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e?.target?.value)}
              className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-micro"
            >
              {sortOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesHeader;