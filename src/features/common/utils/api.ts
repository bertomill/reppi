import { ApiResponse } from '../types';
import { getSession } from 'next-auth/react';

/**
 * Generic fetch utility with error handling and authentication
 */
export async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Get the session for authentication
    const session = await getSession();
    
    // Set up headers with auth if session exists
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Parse the response
    const data = await response.json();
    
    // Return a standardized response
    return {
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.error || 'An error occurred',
      status: response.status,
    };
  } catch (error) {
    // Handle network or parsing errors
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500,
    };
  }
} 