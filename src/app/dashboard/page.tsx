// Main dashboard page component - Protected route that displays the dashboard content
'use client';

import ProtectedLayout from '@/features/dashboard/components/ProtectedLayout';
import DashboardContent from '@/features/dashboard/components/DashboardContent';

export default function Dashboard() {
  return (
    <ProtectedLayout>
      <DashboardContent />
    </ProtectedLayout>
  );
} 