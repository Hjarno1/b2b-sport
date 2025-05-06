// src/app/(dashboard)/dashboard/club-staff-dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import {
  ClipboardList,
  ShoppingBag,
  Users,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Shirt,
  Gauge,
  FileText,
  CircleAlert,
  UserCircle,
} from 'lucide-react';
import { getClubById } from '@/lib/data/mock-data';

// Task status type
type TaskStatus = 'pending' | 'in-progress' | 'complete' | 'overdue';

// Task interface
interface Task {
  id: string;
  title: string;
  teamName: string;
  agreementId: string;
  dueDate: string;
  status: TaskStatus;
  completionPercentage: number;
  priority: 'high' | 'medium' | 'low';
}

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Complete First Team Kit Details',
    teamName: 'First Team',
    agreementId: 'AGR-001244',
    dueDate: 'Apr 20, 2025',
    status: 'in-progress',
    completionPercentage: 50,
    priority: 'high',
  },
  {
    id: 'task-002',
    title: 'Update Youth Team Roster',
    teamName: 'Youth Team',
    agreementId: 'AGR-001245',
    dueDate: 'Apr 22, 2025',
    status: 'pending',
    completionPercentage: 0,
    priority: 'medium',
  },
  {
    id: 'task-003',
    title: 'Check Order Delivery Status',
    teamName: "Women's Team",
    agreementId: 'AGR-001243',
    dueDate: 'Apr 18, 2025',
    status: 'overdue',
    completionPercentage: 25,
    priority: 'high',
  },
  {
    id: 'task-004',
    title: 'Review Training Gear Options',
    teamName: 'First Team',
    agreementId: 'AGR-001246',
    dueDate: 'May 1, 2025',
    status: 'pending',
    completionPercentage: 0,
    priority: 'low',
  },
  {
    id: 'task-005',
    title: 'Confirm Player Numbers',
    teamName: 'U16 Team',
    agreementId: 'AGR-001247',
    dueDate: 'Apr 15, 2025',
    status: 'complete',
    completionPercentage: 100,
    priority: 'medium',
  },
];

// Recent Activity interface
interface Activity {
  id: string;
  description: string;
  timestamp: string;
  type: 'order' | 'team' | 'agreement' | 'system';
}

// Mock activities
const mockActivities: Activity[] = [
  {
    id: 'act-001',
    description: 'First Team kit order shipped',
    timestamp: '2 hours ago',
    type: 'order',
  },
  {
    id: 'act-002',
    description: 'Added 2 new players to Youth Team',
    timestamp: 'Yesterday',
    type: 'team',
  },
  {
    id: 'act-003',
    description: "New kit request approved for Women's Team",
    timestamp: 'Apr 15, 2025',
    type: 'agreement',
  },
  {
    id: 'act-004',
    description: 'System maintenance scheduled for Apr 25',
    timestamp: 'Apr 14, 2025',
    type: 'system',
  },
];

export default function ClubStaffDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, we would fetch from an API
        // For demo, we'll use the mock data
        setTasks(mockTasks);
        setActivities(mockActivities);

        // Calculate stats
        const totalTasks = mockTasks.length;
        const completedTasks = mockTasks.filter((t) => t.status === 'complete').length;
        const pendingTasks = mockTasks.filter(
          (t) => t.status === 'pending' || t.status === 'in-progress' || t.status === 'overdue',
        ).length;

        setStats({
          totalTasks,
          completedTasks,
          pendingTasks,
          pendingOrders: 2, // Mocked value
        });
      } catch (error) {
        console.error('Error processing dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const club = user?.clubId ? getClubById(user.clubId) : null;

  // Get priority tasks (overdue or high priority)
  const priorityTasks = tasks.filter(
    (t) => t.status === 'overdue' || (t.priority === 'high' && t.status !== 'complete'),
  );

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
            <h1 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your teams kit information and track orders
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Tasks"
          value={stats.totalTasks}
          icon={<ClipboardList className="h-5 w-5 text-primary" />}
          color="bg-primary/10"
        />
        <StatsCard
          title="Completed"
          value={stats.completedTasks}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          color="bg-green-100"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingTasks}
          icon={<Clock className="h-5 w-5 text-orange-500" />}
          color="bg-orange-100"
        />
        <StatsCard
          title="Orders"
          value={stats.pendingOrders}
          icon={<ShoppingBag className="h-5 w-5 text-blue-600" />}
          color="bg-blue-100"
        />
      </div>

      {/* Priority Tasks Alert */}
      {priorityTasks.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-800">Attention Needed</h3>
            <p className="text-sm text-yellow-700 mt-1">
              You have {priorityTasks.length} high priority or overdue{' '}
              {priorityTasks.length === 1 ? 'task' : 'tasks'} that need your attention.
            </p>
          </div>
          <Link
            href="#priority-tasks"
            className="ml-auto bg-white text-yellow-700 px-3 py-1 text-sm rounded border border-yellow-300 hover:bg-yellow-50"
          >
            View Tasks
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Your Tasks</h2>
              <Link href="/kit-setup" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {tasks.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No tasks found</div>
              ) : (
                tasks.slice(0, 3).map((task) => (
                  <div
                    id={
                      task.status === 'overdue' || task.priority === 'high'
                        ? 'priority-tasks'
                        : undefined
                    }
                    key={task.id}
                    className="p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <TaskStatusBadge status={task.status} />
                          {task.priority === 'high' && (
                            <div className="ml-2 bg-red-100 text-red-800 text-xs py-0.5 px-1.5 rounded">
                              High Priority
                            </div>
                          )}
                        </div>

                        <h3 className="font-medium text-gray-800 mt-1">{task.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Team: {task.teamName} | Due: {task.dueDate}
                        </p>
                      </div>

                      <Link
                        href={
                          task.title.includes('Kit Details')
                            ? '/kit-setup'
                            : task.title.includes('Order')
                            ? '/order-tracking'
                            : task.title.includes('Roster')
                            ? '/player-roster'
                            : '/kit-setup'
                        }
                        className="text-primary hover:text-primary/80"
                      >
                        <ChevronRight size={20} />
                      </Link>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{task.completionPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            task.status === 'complete'
                              ? 'bg-green-500'
                              : task.status === 'overdue'
                              ? 'bg-red-500'
                              : 'bg-primary'
                          }`}
                          style={{ width: `${task.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {tasks.length > 3 && (
              <div className="px-6 py-3 bg-gray-50 text-center">
                <Link href="/kit-setup" className="text-sm text-primary hover:underline">
                  View All {tasks.length} Tasks
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <QuickActionCard
                title="Update Player Roster"
                description="Add or edit player information"
                icon={<UserCircle className="h-5 w-5 text-primary" />}
                href="/player-roster"
              />
              <QuickActionCard
                title="Set Up Team Kits"
                description="Complete player kit details"
                icon={<Shirt className="h-5 w-5 text-primary" />}
                href="/kit-setup"
              />
              <QuickActionCard
                title="Track Orders"
                description="Check order status and updates"
                icon={<ShoppingBag className="h-5 w-5 text-primary" />}
                href="/order-tracking"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm mt-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 flex items-start">
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3
                    ${
                      activity.type === 'order'
                        ? 'bg-blue-100 text-blue-600'
                        : activity.type === 'team'
                        ? 'bg-green-100 text-green-600'
                        : activity.type === 'agreement'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}
                  >
                    {activity.type === 'order' ? (
                      <ShoppingBag size={16} />
                    ) : activity.type === 'team' ? (
                      <Users size={16} />
                    ) : activity.type === 'agreement' ? (
                      <FileText size={16} />
                    ) : (
                      <CircleAlert size={16} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks
              .filter((task) => task.status !== 'complete')
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 3)
              .map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg 
                    ${
                      task.status === 'overdue'
                        ? 'border-red-200 bg-red-50'
                        : new Date(task.dueDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-200'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800">{task.title}</h3>
                    <TaskStatusBadge status={task.status} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Team: {task.teamName}</p>
                  <div className="flex items-center text-sm mt-2">
                    <Calendar size={14} className="text-gray-400 mr-1.5" />
                    <span
                      className={`
                      ${
                        task.status === 'overdue'
                          ? 'text-red-600 font-medium'
                          : new Date(task.dueDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                          ? 'text-yellow-600 font-medium'
                          : 'text-gray-500'
                      }
                    `}
                    >
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
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

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  switch (status) {
    case 'pending':
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Clock size={10} className="mr-1" /> Not Started
        </div>
      );
    case 'in-progress':
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Gauge size={10} className="mr-1" /> In Progress
        </div>
      );
    case 'complete':
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={10} className="mr-1" /> Completed
        </div>
      );
    case 'overdue':
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle size={10} className="mr-1" /> Overdue
        </div>
      );
    default:
      return null;
  }
}
