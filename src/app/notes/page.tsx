// Notes page component - Protected route that displays a form for creating notes with categories and a filterable list of existing notes
'use client';

import { useState, useEffect } from 'react';
import ProtectedLayout from '@/features/dashboard/components/ProtectedLayout';
import NoteForm from '@/features/notes/components/NoteForm';
import NoteList from '@/features/notes/components/NoteList';
import { Category, Note } from '@/features/common/types';
import { notesApi } from '@/features/notes/api/notesApi';

export default function NotesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const categoriesData = await notesApi.getNoteCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories. Please try again later.');
    }
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      let notesData;
      
      if (selectedCategoryId) {
        notesData = await notesApi.getNotesByCategory(selectedCategoryId);
      } else {
        notesData = await notesApi.getNotes();
      }
      
      setNotes(notesData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError('Failed to load notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchNotes();
    };
    
    loadData();
  }, []);

  // Refetch notes when selected category changes
  useEffect(() => {
    fetchNotes();
  }, [selectedCategoryId]);

  const handleNoteAdded = () => {
    fetchNotes();
  };

  const handleNoteDeleted = () => {
    fetchNotes();
  };

  const handleNewCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <ProtectedLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Notes</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <NoteForm 
          categories={categories}
          onNoteAdded={handleNoteAdded}
          onNewCategory={handleNewCategory}
        />
        
        {loading ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">Loading notes...</p>
          </div>
        ) : (
          <NoteList 
            notes={notes}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
            onNoteDeleted={handleNoteDeleted}
          />
        )}
      </div>
    </ProtectedLayout>
  );
} 