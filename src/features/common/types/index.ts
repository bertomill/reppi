export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  targetReps: number;
  currentReps: number;
  startDate: Date;
  endDate: Date | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface RepLog {
  id: string;
  count: number;
  notes: string | null;
  createdAt: Date;
  goalId: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'objective' | 'note';
  createdAt: Date;
  userId: string;
}

export interface Objective {
  id: string;
  title: string;
  completed: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  userId: string;
  category?: Category;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  userId: string;
  category?: Category;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
} 