/**
 * API utilities for RepLog related operations
 */
export const repLogApi = {
  /**
   * Create a new rep log entry
   */
  createRepLog: async (data: {
    goalId: string;
    count: number;
    notes?: string;
  }) => {
    const response = await fetch('/api/repLogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create rep log');
    }
    
    return response.json();
  },
  
  /**
   * Get all rep logs for a specific goal
   */
  getRepLogsForGoal: async (goalId: string) => {
    const response = await fetch(`/api/goals/${goalId}/repLogs`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch rep logs');
    }
    
    return response.json();
  },
  
  /**
   * Get a single rep log by ID
   */
  getRepLog: async (id: string) => {
    const response = await fetch(`/api/repLogs/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch rep log');
    }
    
    return response.json();
  },
  
  /**
   * Update a rep log
   */
  updateRepLog: async (id: string, data: {
    count?: number;
    notes?: string;
  }) => {
    const response = await fetch(`/api/repLogs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update rep log');
    }
    
    return response.json();
  },
  
  /**
   * Delete a rep log
   */
  deleteRepLog: async (id: string) => {
    const response = await fetch(`/api/repLogs/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete rep log');
    }
    
    return response.json();
  },
}; 