import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user, tenant, onMenuToggle, isMenuOpen = false }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-100">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Mobile Menu Toggle */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden mr-2"
            iconName="Menu"
            iconSize={20}
          >
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          {/* Tenant Context - Mobile */}
          <div className="lg:hidden">
            <span className="text-sm font-medium text-foreground">
              {tenant?.name || 'TenantNotes'}
            </span>
          </div>
        </div>

        {/* Center Section - Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-micro"
            />
          </div>
        </div>

        {/* Right Section - User Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            iconName="Bell"
            iconSize={18}
          >
            <span className="sr-only">Notifications</span>
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </Button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-foreground">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.role || 'Member'}
                </div>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
              />
            </Button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-md shadow-card-elevated z-150">
                <div className="p-3 border-b border-border">
                  <div className="text-sm font-medium text-popover-foreground">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {tenant?.name || 'Default Tenant'}
                  </div>
                </div>
                
                <div className="py-2">
                  <button className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro">
                    <Icon name="User" size={16} className="mr-3" />
                    Profile Settings
                  </button>
                  <button className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro">
                    <Icon name="Settings" size={16} className="mr-3" />
                    Preferences
                  </button>
                  <button className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro">
                    <Icon name="HelpCircle" size={16} className="mr-3" />
                    Help & Support
                  </button>
                </div>
                
                <div className="border-t border-border py-2">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-error hover:bg-muted transition-micro"
                  >
                    <Icon name="LogOut" size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-micro"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;