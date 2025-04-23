/**
 * API utilities for Goal related operations
 */
export const goalApi = {
  /**
   * Create a new goal
   */
  createGoal: async (data: {
    title: string;
    description?: string;
    targetReps: number;
    endDate?: Date;
  }) => {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create goal');
    }
    
    return response.json();
  },
  
  /**
   * Get all goals for the current user
   */
  getGoals: async () => {
    const response = await fetch('/api/goals');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch goals');
    }
    
    return response.json();
  },
  
  /**
   * Get a single goal by ID
   */
  getGoal: async (id: string) => {
    const response = await fetch(`/api/goals/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch goal');
    }
    
    return response.json();
  },
  
  /**
   * Update a goal
   */
  updateGoal: async (id: string, data: {
    title?: string;
    description?: string;
    targetReps?: number;
    currentReps?: number;
    endDate?: Date;
    completed?: boolean;
  }) => {
    const response = await fetch(`/api/goals/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update goal');
    }
    
    return response.json();
  },
  
  /**
   * Delete a goal
   */
  deleteGoal: async (id: string) => {
    const response = await fetch(`/api/goals/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete goal');
    }
    
    return response.json();
  },
}; 