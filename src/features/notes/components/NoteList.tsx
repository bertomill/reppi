'use client';

import { useState } from 'react';
import { Category, Note } from '@/features/common/types';
import { notesApi } from '../api/notesApi';

interface NoteListProps {
  notes: Note[];
  categories: Category[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onNoteDeleted: () => void;
}

export default function NoteList({
  notes,
  categories,
  selectedCategoryId,
  onCategorySelect,
  onNoteDeleted,
}: NoteListProps) {
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleToggleNote = (noteId: string) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const handleDeleteNote = async (noteId: string) => {
    setDeletingNoteId(noteId);
    try {
      await notesApi.deleteNote(noteId);
      onNoteDeleted();
      setError(null);
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Failed to delete note. Please try again.');
    } finally {
      setDeletingNoteId(null);
    }
  };

  // Group notes by category for easy filtering
  const notesByCategory: Record<string, Note[]> = {};
  
  for (const category of categories) {
    notesByCategory[category.id] = notes.filter(
      (note) => note.categoryId === category.id
    );
  }

  // Filter notes based on selected category
  const filteredNotes = selectedCategoryId
    ? notesByCategory[selectedCategoryId] || []
    : notes;

  if (notes.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No notes yet. Add your first note above!</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedCategoryId === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategoryId === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {filteredNotes.map((note) => {
          const category = categories.find((c) => c.id === note.categoryId);
          
          return (
            <div key={note.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div
                onClick={() => handleToggleNote(note.id)}
                className="p-4 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {category?.name}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500">
                  {formatDate(note.createdAt)}
                </div>
              </div>
              
              {expandedNoteId === note.id && (
                <div className="border-t border-gray-200 p-4">
                  <p className="whitespace-pre-wrap">{note.content}</p>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={deletingNoteId === note.id}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {deletingNoteId === note.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 