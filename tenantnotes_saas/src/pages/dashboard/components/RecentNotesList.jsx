import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentNotesList = ({ notes, onViewNote, onEditNote, onCreateNote }) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content?.length <= maxLength) return content;
    return content?.substring(0, maxLength) + '...';
  };

  if (!notes || notes?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="FileText" size={24} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No notes yet</h3>
        <p className="text-muted-foreground mb-6">
          Get started by creating your first note to organize your thoughts and ideas.
        </p>
        <Button 
          variant="default" 
          onClick={onCreateNote}
          iconName="Plus"
          iconPosition="left"
        >
          Create Your First Note
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Notes</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCreateNote}
            iconName="Plus"
            iconPosition="left"
          >
            New Note
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {notes?.map((note) => (
          <div key={note?.id} className="p-6 hover:bg-muted/30 transition-micro">
            <div className="flex items-start justify-between space-x-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {note?.title}
                  </h3>
                  {note?.isPinned && (
                    <Icon name="Pin" size={14} color="var(--color-accent)" />
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {truncateContent(note?.content)}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{formatDate(note?.updatedAt)}</span>
                  </span>
                  {note?.tags && note?.tags?.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Tag" size={12} />
                      <span>{note?.tags?.slice(0, 2)?.join(', ')}</span>
                      {note?.tags?.length > 2 && <span>+{note?.tags?.length - 2}</span>}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewNote(note?.id)}
                  iconName="Eye"
                  iconSize={16}
                >
                  <span className="sr-only">View note</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditNote(note?.id)}
                  iconName="Edit"
                  iconSize={16}
                >
                  <span className="sr-only">Edit note</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border bg-muted/20">
        <Button 
          variant="ghost" 
          fullWidth
          onClick={() => window.location.href = '/notes-management'}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All Notes
        </Button>
      </div>
    </div>
  );
};

export default RecentNotesList;