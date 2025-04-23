// Home page component - Redirects authenticated users to dashboard and unauthenticated users to login
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/api/authOptions';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // If user is logged in, redirect to dashboard, otherwise to login
  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
  
  // This won't render, but Next.js requires a component to return JSX
  return null;
}
