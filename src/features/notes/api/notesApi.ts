import { Category, Note } from '@/features/common/types';

/**
 * API utilities for notes
 */
export const notesApi = {
  /**
   * Get all note categories
   */
  getNoteCategories: async (): Promise<Category[]> => {
    const response = await fetch('/api/categories?type=note');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch note categories');
    }
    
    return response.json();
  },
  
  /**
   * Create a new note category
   */
  createNoteCategory: async (name: string): Promise<Category> => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        type: 'note'
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create note category');
    }
    
    return response.json();
  },
  
  /**
   * Get all notes
   */
  getNotes: async (): Promise<Note[]> => {
    const response = await fetch('/api/notes');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch notes');
    }
    
    return response.json();
  },
  
  /**
   * Get notes by category
   */
  getNotesByCategory: async (categoryId: string): Promise<Note[]> => {
    const response = await fetch(`/api/notes?categoryId=${categoryId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch notes by category');
    }
    
    return response.json();
  },
  
  /**
   * Create a new note
   */
  createNote: async (data: {
    title: string;
    content: string;
    categoryId: string;
  }): Promise<Note> => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create note');
    }
    
    return response.json();
  },
  
  /**
   * Update a note
   */
  updateNote: async (id: string, data: {
    title?: string;
    content?: string;
    categoryId?: string;
  }): Promise<Note> => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update note');
    }
    
    return response.json();
  },
  
  /**
   * Delete a note
   */
  deleteNote: async (id: string): Promise<void> => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete note');
    }
  },
}; 