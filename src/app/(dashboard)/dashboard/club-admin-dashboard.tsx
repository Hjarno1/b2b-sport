// src/app/(dashboard)/dashboard/club-admin-dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import {
  FileText,
  ShoppingBag,
  Users,
  ArrowUpRight,
  Building2,
  Calendar,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { getClubById, mockAgreements, mockOrders, mockActivities } from '@/lib/data/mock-data';

interface ClubDashboardStats {
  activeAgreements: number;
  pendingOrders: number;
  staffMembers: number;
  upcomingDeliveries: number;
}

interface Activity {
  id: string;
  description: string;
  timestamp: string;
  userId?: string;
  clubId?: string;
  agreementId?: string;
  orderId?: string;
}

export default function ClubAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ClubDashboardStats>({
    activeAgreements: 0,
    pendingOrders: 0,
    staffMembers: 0,
    upcomingDeliveries: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, we would fetch from an API
        // For demo, we'll filter the mock data for this club

        if (user?.clubId) {
          // Filter agreements for this club
          const clubAgreements = mockAgreements.filter((a) => a.clubId === user.clubId);
          const activeAgreements = clubAgreements.filter(
            (a) => a.status === 'Active' || a.status === 'In Progress',
          ).length;

          // Filter orders for this club
          const clubOrders = mockOrders.filter((o) => o.clubId === user.clubId);
          const pendingOrders = clubOrders.filter((o) => o.status === 'Pending').length;
          const upcomingDeliveries = clubOrders.filter((o) => o.status === 'Shipped').length;

          // Count staff members (mock value)
          const staffMembers = Math.floor(Math.random() * 8) + 3; // 3-10 staff members

          setStats({
            activeAgreements,
            pendingOrders,
            staffMembers,
            upcomingDeliveries,
          });

          // Filter activities for this club
          const clubActivities = mockActivities
            .filter((a) => a.clubId === user.clubId || !a.clubId)
            .slice(0, 5);
          setActivities(clubActivities);
        }
      } catch (error) {
        console.error('Error processing dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const club = user?.clubId ? getClubById(user.clubId) : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Club Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden mr-4 bg-gray-100">
            {club?.logo ? (
              <div className="relative w-full h-full">
                <Image src={club.logo} alt={club.name} layout="fill" objectFit="cover" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-bold">
                {club?.abbreviation || 'CB'}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Welcome to {club?.name || 'Your Club'} Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your clubs staff, agreements, and orders in one place
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Agreements"
          value={stats.activeAgreements}
          icon={<FileText className="h-5 w-5 text-primary" />}
          color="bg-primary/10"
          href="/agreements"
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<ShoppingBag className="h-5 w-5 text-orange-500" />}
          color="bg-orange-100"
          href="/orders"
        />
        <StatsCard
          title="Staff Members"
          value={stats.staffMembers}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          color="bg-blue-100"
          href="/staff-management"
        />
        <StatsCard
          title="Upcoming Deliveries"
          value={stats.upcomingDeliveries}
          icon={<Calendar className="h-5 w-5 text-green-600" />}
          color="bg-green-100"
          href="/orders"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-100">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No recent activity found</div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 flex items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="rounded-full bg-gray-100 p-2 mr-3">
                    <ActivityIcon activity={activity} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <QuickActionCard
              title="Add staff member"
              description="Add new staff to your club"
              icon={<UserPlus className="h-5 w-5 text-primary" />}
              href="/staff-management"
            />
            <QuickActionCard
              title="View agreements"
              description="Check your active agreements"
              icon={<FileText className="h-5 w-5 text-primary" />}
              href="/agreements"
            />
            <QuickActionCard
              title="Track orders"
              description="Check your order status"
              icon={<ShoppingBag className="h-5 w-5 text-primary" />}
              href="/orders"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityIcon({ activity }: { activity: Activity }) {
  if (activity.agreementId) {
    return <FileText size={16} className="text-primary" />;
  } else if (activity.orderId) {
    return <ShoppingBag size={16} className="text-orange-500" />;
  } else if (activity.userId) {
    return <Users size={16} className="text-blue-600" />;
  } else {
    return <Building2 size={16} className="text-gray-500" />;
  }
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  href: string;
}

function StatsCard({ title, value, icon, color, href }: StatsCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
          <ArrowUpRight className="h-4 w-4 text-gray-400" />
        </div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
      </div>
    </Link>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function QuickActionCard({ title, description, icon, href }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center p-4 border border-gray-100 rounded-lg hover:border-primary hover:shadow-sm transition-all"
    >
      <div className="p-2 mr-4 rounded-full bg-primary/10">{icon}</div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </Link>
  );
}
