/**
 * Database configuration utility
 * 
 * This file provides utilities for working with different database environments
 * (local SQLite and production PostgreSQL in Supabase)
 */

// Check if we're in production or development
export const isProd = process.env.NODE_ENV === 'production';

// Function to log database operations in development
export const logDatabaseOps = (operation: string, data: any) => {
  if (!isProd) {
    console.log(`[DB ${operation}]:`, data);
  }
};

// Get appropriate database URL based on environment
export const getDatabaseUrl = () => {
  // For Vercel production, use the PostgreSQL URL
  if (isProd) {
    return process.env.DATABASE_URL;
  }
  
  // For local development, use SQLite
  return 'file:./reppi.db';
}; 