// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@/lib/context/auth-context';
import { UserRole } from '@/lib/data/mock-data';

// Import the specific dashboard components for each role
import B2BAdminDashboardContent from './b2b-admin-dashboard';
import ClubAdminDashboardContent from './club-admin-dashboard';
import ClubStaffDashboardContent from './club-staff-dashboard';

// Main Dashboard component that renders the appropriate dashboard based on user role
export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  switch (user?.role) {
    case UserRole.ClubAdmin:
      return <ClubAdminDashboardContent />;
    case UserRole.B2BSportAdmin:
      return <B2BAdminDashboardContent />;
    case UserRole.ClubStaff:
      return <ClubStaffDashboardContent />;
    default:
      return (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Unknown Role</h1>
          <p className="text-gray-500">Please log out and log back in with a valid role.</p>
        </div>
      );
  }
}
