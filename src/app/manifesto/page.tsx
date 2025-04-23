// Manifesto page component - Protected route that displays daily objectives with categories, allowing users to track and manage their goals
'use client';

import { useState, useEffect } from 'react';
import ProtectedLayout from '@/features/dashboard/components/ProtectedLayout';
import ManifestoText from '@/features/manifesto/components/ManifestoText';
import DateSelector from '@/features/manifesto/components/DateSelector';
import ObjectiveForm from '@/features/manifesto/components/ObjectiveForm';
import ObjectiveList from '@/features/manifesto/components/ObjectiveList';
import { Category, Objective } from '@/features/common/types';
import { manifestoApi } from '@/features/manifesto/api/manifestoApi';

export default function ManifestoPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [categories, setCategories] = useState<Category[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const categoriesData = await manifestoApi.getObjectiveCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories. Please try again later.');
    }
  };

  const fetchObjectives = async () => {
    setLoading(true);
    try {
      const objectivesData = await manifestoApi.getObjectives(date);
      setObjectives(objectivesData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch objectives:', err);
      setError('Failed to load objectives. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchObjectives();
    };
    
    loadData();
  }, []);

  // Refetch objectives when date changes
  useEffect(() => {
    fetchObjectives();
  }, [date]);

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleObjectiveAdded = () => {
    fetchObjectives();
  };

  const handleObjectiveToggled = () => {
    fetchObjectives();
  };

  const handleNewCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  return (
    <ProtectedLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ManifestoText />
        
        <h2 className="text-2xl font-bold mb-4">Daily Objectives</h2>
        
        <DateSelector date={date} onDateChange={handleDateChange} />
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">Loading objectives...</p>
          </div>
        ) : (
          <>
            <ObjectiveForm 
              categories={categories}
              date={date}
              onObjectiveAdded={handleObjectiveAdded}
              onNewCategory={handleNewCategory}
            />
            
            <ObjectiveList 
              objectives={objectives}
              categories={categories}
              onObjectiveToggled={handleObjectiveToggled}
            />
          </>
        )}
      </div>
    </ProtectedLayout>
  );
} 