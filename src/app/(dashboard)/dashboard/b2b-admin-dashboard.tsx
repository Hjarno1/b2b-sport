// src/app/(dashboard)/dashboard/b2b-admin-dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import Image from 'next/image';
import {
  Building2,
  FileText,
  ShoppingBag,
  Users,
  ArrowUpRight,
  MessageSquareMoreIcon,
} from 'lucide-react';
import { getClubById } from '@/lib/data/mock-data';

interface DashboardStats {
  activeClubs: number;
  pendingAgreements: number;
  totalClubAdmins: number;
  ordersThisMonth: number;
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

// B2B Admin Dashboard Component
export default function B2BAdminDashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeClubs: 0,
    pendingAgreements: 0,
    totalClubAdmins: 0,
    ordersThisMonth: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        setStats(data.stats);
        setActivities(data.recentActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Here&apos;s what&apos;s happening across your platform today
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Clubs"
          value={stats.activeClubs}
          trend="+2 this week"
          icon={<Building2 className="h-5 w-5 text-primary" />}
          color="bg-primary/10"
        />
        <StatsCard
          title="Pending Agreements"
          value={stats.pendingAgreements}
          trend="+3 today"
          icon={<FileText className="h-5 w-5 text-orange-500" />}
          color="bg-orange-100"
        />
        <StatsCard
          title="Club Admins"
          value={stats.totalClubAdmins}
          trend="No change"
          icon={<Users className="h-5 w-5 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatsCard
          title="Orders This Month"
          value={stats.ordersThisMonth}
          trend="+5 this week"
          icon={<ShoppingBag className="h-5 w-5 text-green-600" />}
          color="bg-green-100"
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
            {activities.map((activity) => {
              const club = activity.clubId ? getClubById(activity.clubId) : null;
              return (
                <div
                  key={activity.id}
                  className="p-4 flex items-center hover:bg-gray-50 transition-colors"
                >
                  {club && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                      <Image
                        src={club.logo || '/default-club.png'}
                        alt={club.name}
                        width={32}
                        height={32}
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm">
                      {club ? <span className="font-semibold">{club.name}: </span> : null}
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <QuickActionCard
              title="Add new club"
              description="Create a new club profile"
              icon={<Building2 className="h-5 w-5 text-primary" />}
              href="/club-management"
            />
            <QuickActionCard
              title="Create agreement"
              description="Design a new agreement template"
              icon={<FileText className="h-5 w-5 text-primary" />}
              href="/agreement-templates"
            />
            <QuickActionCard
              title="Help center"
              description="Visit our support resources"
              icon={<MessageSquareMoreIcon className="h-5 w-5 text-primary" />}
              href="/help"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  trend: string;
  icon: React.ReactNode;
  color: string;
}

function StatsCard({ title, value, trend, icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        <span className="text-xs flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          {trend}
        </span>
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
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
    <a
      href={href}
      className="flex items-center p-4 border border-gray-100 rounded-lg hover:border-primary hover:shadow-sm transition-all"
    >
      <div className="p-2 mr-4 rounded-full bg-primary/10">{icon}</div>
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
    </a>
  );
}
