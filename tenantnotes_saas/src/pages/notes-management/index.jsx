import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import NotesHeader from './components/NotesHeader';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';

const NotesManagement = () => {
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, note: null });

  // Filter and Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_desc');

  // Get user from localStorage
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [subscription, setSubscription] = useState({ plan: 'Free', notesUsed: 0, notesLimit: 3 });

  // Notes Data
  const [notes, setNotes] = useState([]);

  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setTenant(parsed.tenant);
      // For now, set subscription based on tenant, but in future fetch from API
      setSubscription({ plan: 'Free', notesUsed: 0, notesLimit: 3 });
    }
  }, []);

  // Fetch notes
  const fetchNotes = async () => {
    if (!user?.token) return;
    try {
      const response = await axios.get('/api/notes', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  // Filtered and Sorted Notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = notes?.filter(note => 
        note?.title?.toLowerCase()?.includes(query) ||
        note?.content?.toLowerCase()?.includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered]?.sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'created_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title_asc':
          return a?.title?.localeCompare(b?.title);
        case 'title_desc':
          return b?.title?.localeCompare(a?.title);
        case 'modified_desc':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        default:
          return 0;
      }
    });

    return sorted;
  }, [notes, searchQuery, sortBy]);

  // Check if user can create new notes
  const canCreateNote = subscription?.plan === 'Pro' || notes.length < subscription?.notesLimit;

  // Handlers
  const handleCreateNote = () => {
    if (!canCreateNote) return;
    setSelectedNote(null);
    setCurrentView('create');
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setCurrentView('edit');
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setCurrentView('view');
  };

  const handleDeleteNote = (note) => {
    setDeleteDialog({ isOpen: true, note });
  };

  const handleSaveNote = async (noteData) => {
    if (!user || !user.token) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      const headers = { Authorization: `Bearer ${user.token}` };

      if (currentView === 'create') {
        await axios.post('/api/notes', {
          title: noteData.title,
          content: noteData.content,
        }, { headers });
      } else if (currentView === 'edit') {
        await axios.put(`/api/notes/${noteData.id}`, {
          title: noteData.title,
          content: noteData.content,
        }, { headers });
      }

      await fetchNotes();
      setCurrentView('list');
      setSelectedNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
      alert(error.response?.data?.message || 'Failed to save note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setCurrentView('list');
    setSelectedNote(null);
  };

  const handleConfirmDelete = async (noteId) => {
    setIsLoading(true);

    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.delete(`/api/notes/${noteId}`, { headers });

      await fetchNotes();
      setDeleteDialog({ isOpen: false, note: null });
    } catch (error) {
      console.error('Error deleting note:', error);
      alert(error.response?.data?.message || 'Failed to delete note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ isOpen: false, note: null });
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        tenant={tenant}
        subscription={subscription}
      />
      {/* Main Content */}
      <div className="lg:ml-60">
        {/* Header */}
        <Header
          user={user}
          tenant={tenant}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isMenuOpen={isSidebarOpen}
        />

        {/* Page Content */}
        <main className="pt-16 min-h-screen flex flex-col">
          {currentView === 'list' ? (
            <>
              {/* Notes Header */}
              <NotesHeader
                onCreateNote={handleCreateNote}
                isCreateDisabled={!canCreateNote}
                subscription={subscription}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {/* Notes List */}
              <NotesList
                notes={filteredAndSortedNotes}
                onEditNote={handleEditNote}
                onViewNote={handleViewNote}
                onDeleteNote={handleDeleteNote}
                isLoading={false}
              />
            </>
          ) : (
            /* Note Editor */
            (<NoteEditor
              note={selectedNote}
              onSave={handleSaveNote}
              onCancel={handleCancelEdit}
              isLoading={isLoading}
              mode={currentView}
            />)
          )}
        </main>
      </div>
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog?.isOpen}
        note={deleteDialog?.note}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default NotesManagement;