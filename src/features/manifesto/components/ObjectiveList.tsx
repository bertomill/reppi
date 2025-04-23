'use client';

import { useState } from 'react';
import { Category, Objective } from '@/features/common/types';
import { manifestoApi } from '../api/manifestoApi';

interface ObjectiveListProps {
  objectives: Objective[];
  categories: Category[];
  onObjectiveToggled: () => void;
}

export default function ObjectiveList({ 
  objectives, 
  categories,
  onObjectiveToggled 
}: ObjectiveListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  // Group objectives by category
  const objectivesByCategory: Record<string, Objective[]> = {};
  
  for (const category of categories) {
    objectivesByCategory[category.id] = objectives.filter(
      (objective) => objective.categoryId === category.id
    );
  }
  
  const handleToggleObjective = async (id: string, completed: boolean) => {
    setLoading(id);
    try {
      await manifestoApi.toggleObjective(id, !completed);
      onObjectiveToggled();
    } catch (error) {
      console.error('Failed to toggle objective:', error);
    } finally {
      setLoading(null);
    }
  };

  if (objectives.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <p className="text-gray-500 text-center py-4">
          No objectives for today. Add some to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">Today's Objectives</h3>
      
      {Object.entries(objectivesByCategory).map(([categoryId, categoryObjectives]) => {
        if (categoryObjectives.length === 0) return null;
        
        const category = categories.find(c => c.id === categoryId);
        
        return (
          <div key={categoryId} className="mb-4 last:mb-0">
            <h4 className="font-medium text-gray-700 mb-2">{category?.name}</h4>
            <ul className="space-y-2">
              {categoryObjectives.map((objective) => (
                <li key={objective.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={objective.completed}
                    onChange={() => handleToggleObjective(objective.id, objective.completed)}
                    disabled={loading === objective.id}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span 
                    className={`flex-1 ${objective.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                  >
                    {objective.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
} 