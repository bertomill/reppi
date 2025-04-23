import { Category, Objective } from '@/features/common/types';

/**
 * API utilities for objectives and categories
 */
export const manifestoApi = {
  /**
   * Get all objective categories
   */
  getObjectiveCategories: async (): Promise<Category[]> => {
    const response = await fetch('/api/categories?type=objective');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch objective categories');
    }
    
    return response.json();
  },
  
  /**
   * Create a new objective category
   */
  createObjectiveCategory: async (name: string): Promise<Category> => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        type: 'objective'
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create objective category');
    }
    
    return response.json();
  },
  
  /**
   * Get objectives for a specific date
   */
  getObjectives: async (date: Date): Promise<Objective[]> => {
    const formattedDate = date.toISOString().split('T')[0];
    const response = await fetch(`/api/objectives?date=${formattedDate}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch objectives');
    }
    
    return response.json();
  },
  
  /**
   * Create a new objective
   */
  createObjective: async (data: {
    title: string;
    categoryId: string;
    date: Date;
  }): Promise<Objective> => {
    const response = await fetch('/api/objectives', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create objective');
    }
    
    return response.json();
  },
  
  /**
   * Update an objective (toggle completion)
   */
  toggleObjective: async (id: string, completed: boolean): Promise<Objective> => {
    const response = await fetch(`/api/objectives/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update objective');
    }
    
    return response.json();
  },
  
  /**
   * Delete an objective
   */
  deleteObjective: async (id: string): Promise<void> => {
    const response = await fetch(`/api/objectives/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete objective');
    }
  },
}; 