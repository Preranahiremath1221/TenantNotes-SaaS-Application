import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const getUserFromStorage = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import RecentNotesList from './components/RecentNotesList';
import QuickActions from './components/QuickActions';
import WelcomeHeader from './components/WelcomeHeader';
import SubscriptionAlert from './components/SubscriptionAlert';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime] = useState(new Date('2025-09-13T08:45:42.794Z'));

  // Get user data from localStorage
  const user = getUserFromStorage();

  // Use real user data or fallback to mock data
  const mockTenant = {
    id: 1,
    name: "Acme Corporation",
    plan: "Free"
  };

  const mockSubscription = {
    plan: "Free",
    notesUsed: 2,
    notesLimit: 3,
    usersCount: 5,
    usersLimit: 10
  };

  const mockRecentNotes = [
    {
      id: 1,
      title: "Q4 Marketing Strategy",
      content: `Our Q4 marketing strategy focuses on digital transformation and customer engagement.\n\nKey initiatives include:\n- Social media campaign expansion\n- Email marketing automation\n- Content marketing optimization\n- Customer retention programs`,
      tags: ["marketing", "strategy", "q4"],
      isPinned: true,
      createdAt: new Date('2025-09-12T14:30:00Z'),
      updatedAt: new Date('2025-09-13T08:15:00Z'),
      authorId: 1
    },
    {
      id: 2,
      title: "Team Meeting Notes - Sept 12",
      content: `Weekly team sync meeting notes:\n\n- Project Alpha is on track for October release\n- Need to address performance issues in module B\n- Sarah to follow up with design team on UI mockups\n- Next sprint planning scheduled for Friday`,
      tags: ["meeting", "team", "weekly"],
      isPinned: false,
      createdAt: new Date('2025-09-12T10:00:00Z'),
      updatedAt: new Date('2025-09-12T16:45:00Z'),
      authorId: 2
    }
  ];

  const getMetricsData = () => {
    const baseMetrics = [
      {
        title: "Total Notes",
        value: mockSubscription?.notesUsed?.toString(),
        subtitle: `of ${mockSubscription?.notesLimit} used`,
        icon: "FileText",
        variant: "primary",
        progress: {
          current: mockSubscription?.notesUsed,
          total: mockSubscription?.notesLimit,
          percentage: (mockSubscription?.notesUsed / mockSubscription?.notesLimit) * 100
        }
      },
      {
        title: "Subscription",
        value: mockSubscription?.plan,
        subtitle: "Current plan",
        icon: "CreditCard",
        variant: mockSubscription?.plan === "Free" ? "warning" : "success",
        onClick: user?.role === 'Admin' ? () => navigate('/subscription-management') : undefined
      }
    ];

    if (user?.role === 'Admin') {
      baseMetrics?.push({
        title: "Team Members",
        value: mockSubscription?.usersCount?.toString(),
        subtitle: `of ${mockSubscription?.usersLimit} users`,
        icon: "Users",
        variant: "default",
        onClick: () => navigate('/user-management')
      });
    }

    return baseMetrics;
  };

  const handleCreateNote = () => {
    if (mockSubscription?.notesUsed >= mockSubscription?.notesLimit && mockSubscription?.plan === 'Free') {
      alert('Note limit reached! Upgrade to Pro for unlimited notes.');
      return;
    }
    navigate('/notes-management?action=create');
  };

  const handleViewNote = (noteId) => {
    navigate(`/notes-management?view=${noteId}`);
  };

  const handleEditNote = (noteId) => {
    navigate(`/notes-management?edit=${noteId}`);
  };

  const handleInviteUser = () => {
    navigate('/user-management?action=invite');
  };

  const handleUpgradeSubscription = () => {
    navigate('/subscription-management?action=upgrade');
  };

  const handleManageUsers = () => {
    navigate('/user-management');
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        tenant={mockTenant}
        onMenuToggle={handleSidebarToggle}
        isMenuOpen={isSidebarOpen}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        user={user}
        tenant={mockTenant}
        subscription={mockSubscription}
      />
      <div className="lg:ml-60 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <WelcomeHeader 
            user={user}
            tenant={mockTenant}
            currentTime={currentTime}
          />
          <SubscriptionAlert
            subscription={mockSubscription}
            userRole={user?.role}
            onUpgrade={handleUpgradeSubscription}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {getMetricsData()?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                subtitle={metric?.subtitle}
                icon={metric?.icon}
                variant={metric?.variant}
                progress={metric?.progress}
                onClick={metric?.onClick}
              />
            ))}
          </div>
          <div className="mb-8">
            <QuickActions
              userRole={user?.role}
              onCreateNote={handleCreateNote}
              onInviteUser={handleInviteUser}
              onUpgradeSubscription={handleUpgradeSubscription}
              onManageUsers={handleManageUsers}
            />
          </div>
          <div className="mb-8">
            <RecentNotesList
              notes={mockRecentNotes}
              onViewNote={handleViewNote}
              onEditNote={handleEditNote}
              onCreateNote={handleCreateNote}
            />
          </div>
          <div className="text-center text-sm text-muted-foreground py-8 border-t border-border">
            <p>© {new Date()?.getFullYear()} TenantNotes SaaS. All rights reserved.</p>
            <p className="mt-1">Secure multi-tenant notes management platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;