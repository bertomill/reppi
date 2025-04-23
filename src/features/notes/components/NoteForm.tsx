'use client';

import { useState } from 'react';
import { Category } from '@/features/common/types';
import { notesApi } from '../api/notesApi';

interface NoteFormProps {
  categories: Category[];
  onNoteAdded: () => void;
  onNewCategory: (category: Category) => void;
}

export default function NoteForm({ 
  categories, 
  onNoteAdded,
  onNewCategory
}: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !categoryId) {
      setError('Please provide a title, content, and category');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await notesApi.createNote({
        title,
        content,
        categoryId,
      });
      
      setTitle('');
      setContent('');
      onNoteAdded();
    } catch (err) {
      setError('Failed to add note');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName) {
      setError('Please provide a category name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const newCategory = await notesApi.createNoteCategory(newCategoryName);
      
      setNewCategoryName('');
      setShowCategoryInput(false);
      onNewCategory(newCategory);
      setCategoryId(newCategory.id);
    } catch (err) {
      setError('Failed to add category');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Note</h3>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Note title"
            disabled={loading}
          />
        </div>
        
        {!showCategoryInput ? (
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <button
                type="button"
                onClick={() => setShowCategoryInput(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                + Add new category
              </button>
            </div>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="new-category" className="block text-sm font-medium text-gray-700">
                New Category
              </label>
              <button
                type="button"
                onClick={() => setShowCategoryInput(false)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Cancel
              </button>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                id="new-category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Category name"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={loading}
              >
                Add
              </button>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your note here..."
            disabled={loading}
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </form>
    </div>
  );
} 