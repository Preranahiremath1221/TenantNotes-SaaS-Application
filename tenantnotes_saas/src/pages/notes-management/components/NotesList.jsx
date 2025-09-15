import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NotesList = ({ 
  notes, 
  onEditNote, 
  onViewNote, 
  onDeleteNote,
  isLoading 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 120) => {
    if (content?.length <= maxLength) return content;
    return content?.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)]?.map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-5 bg-muted rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-16 bg-muted rounded"></div>
                    <div className="h-8 w-16 bg-muted rounded"></div>
                    <div className="h-8 w-16 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notes?.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No notes found</h3>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first note or try adjusting your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="space-y-4">
        {notes?.map((note) => (
          <div key={note?.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-card-elevation-1 transition-micro">
            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-foreground line-clamp-1 flex-1 mr-4">
                  {note?.title}
                </h3>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewNote(note)}
                    iconName="Eye"
                    iconSize={16}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditNote(note)}
                    iconName="Edit"
                    iconSize={16}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteNote(note)}
                    iconName="Trash2"
                    iconSize={16}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {truncateContent(note?.content)}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>Created: {formatDate(note?.createdAt)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>Modified: {formatDate(note?.updatedAt)}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Type" size={12} />
                  <span>{note?.content?.length} characters</span>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="mb-3">
                <h3 className="text-lg font-medium text-foreground mb-2 line-clamp-2">
                  {note?.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {truncateContent(note?.content, 100)}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>{formatDate(note?.createdAt)}</span>
                <span>{note?.content?.length} chars</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewNote(note)}
                  iconName="Eye"
                  iconSize={14}
                  className="flex-1"
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditNote(note)}
                  iconName="Edit"
                  iconSize={14}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteNote(note)}
                  iconName="Trash2"
                  iconSize={14}
                  className="text-error border-error hover:bg-error hover:text-error-foreground"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;