import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const NoteEditor = ({ 
  note, 
  onSave, 
  onCancel, 
  isLoading,
  mode = 'create' // 'create', 'edit', 'view'
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'

  useEffect(() => {
    if (note && mode !== 'create') {
      setTitle(note?.title || '');
      setContent(note?.content || '');
      setHasChanges(false);
    } else {
      setTitle('');
      setContent('');
      setHasChanges(false);
    }
  }, [note, mode]);

  useEffect(() => {
    if (mode !== 'view' && (title || content)) {
      setHasChanges(true);
    }
  }, [title, content, mode]);

  // Auto-save simulation
  useEffect(() => {
    if (hasChanges && mode === 'edit') {
      setAutoSaveStatus('saving');
      const timer = setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasChanges, mode]);

  const handleSave = () => {
    if (!title?.trim()) {
      alert('Please enter a title for your note');
      return;
    }
    
    if (mode === 'edit' && !note?._id) {
      alert('Note ID is missing. Cannot save the note.');
      return;
    }
    
    const noteData = {
      id: note?._id || Date.now(),
      title: title?.trim(),
      content: content?.trim(),
      createdAt: note?.createdAt || new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString()
    };
    
    onSave(noteData);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const getCharacterCount = () => content?.length;
  const getWordCount = () => content?.trim() ? content?.trim()?.split(/\s+/)?.length : 0;

  const AutoSaveIndicator = () => {
    if (mode === 'view') return null;
    
    return (
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        {autoSaveStatus === 'saving' && (
          <>
            <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Saving...</span>
          </>
        )}
        {autoSaveStatus === 'saved' && mode === 'edit' && (
          <>
            <Icon name="Check" size={12} className="text-success" />
            <span>Auto-saved</span>
          </>
        )}
        {autoSaveStatus === 'error' && (
          <>
            <Icon name="AlertCircle" size={12} className="text-error" />
            <span>Save failed</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              iconName="ArrowLeft"
              iconSize={20}
            >
              <span className="sr-only">Back to notes</span>
            </Button>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {mode === 'create' ? 'Create New Note' : 
                 mode === 'edit' ? 'Edit Note' : 'View Note'}
              </h2>
              <div className="flex items-center space-x-4 mt-1">
                <AutoSaveIndicator />
                {mode !== 'create' && note && (
                  <span className="text-xs text-muted-foreground">
                    Created: {new Date(note.createdAt)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {mode !== 'view' && (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={isLoading || !title?.trim()}
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
              >
                {mode === 'create' ? 'Create Note' : 'Save Changes'}
              </Button>
            </div>
          )}
          
          {mode === 'view' && (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => window.print()}
                iconName="Printer"
                iconSize={16}
              >
                Print
              </Button>
              <Button
                variant="default"
                onClick={() => onCancel()}
                iconName="Edit"
                iconPosition="left"
              >
                Edit Note
              </Button>
            </div>
          )}
        </div>

        {/* Editor Form */}
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <Input
              label="Note Title"
              type="text"
              placeholder="Enter a descriptive title for your note..."
              value={title}
              onChange={(e) => setTitle(e?.target?.value)}
              disabled={mode === 'view'}
              required
              className="text-lg font-medium"
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content
            </label>
            <div className="relative">
              <textarea
                placeholder={mode === 'view' ? '' : "Start writing your note content here...\n\nYou can write as much as you need. The editor will expand automatically."}
                value={content}
                onChange={(e) => setContent(e?.target?.value)}
                disabled={mode === 'view'}
                className={`w-full min-h-[400px] p-4 text-sm bg-background border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-micro ${
                  mode === 'view' ? 'cursor-default' : ''
                }`}
                style={{ 
                  fontFamily: 'Inter, system-ui, sans-serif',
                  lineHeight: '1.6'
                }}
              />
              
              {/* Character and Word Count */}
              <div className="absolute bottom-3 right-3 flex items-center space-x-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                <span className="flex items-center space-x-1">
                  <Icon name="Type" size={12} />
                  <span>{getCharacterCount()} chars</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="FileText" size={12} />
                  <span>{getWordCount()} words</span>
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Save Actions */}
          {mode !== 'view' && (
            <div className="md:hidden flex flex-col space-y-3 pt-4 border-t border-border">
              <Button
                variant="default"
                onClick={handleSave}
                disabled={isLoading || !title?.trim()}
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
                fullWidth
              >
                {mode === 'create' ? 'Create Note' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                fullWidth
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;