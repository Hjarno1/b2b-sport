// src/app/(dashboard)/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  ShoppingBag,
  TruckIcon,
  PackageCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { getClubById, mockOrders } from '@/lib/data/mock-data';

// Order status type definition
type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';

// Order interface
interface Order {
  id: string;
  agreementId: string;
  clubId: string;
  createdAt: string;
  status: OrderStatus;
  completedBy?: string;
  items?: number; // Added for demo purposes
  total?: number; // Added for demo purposes
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, we would fetch from an API
        // For demo, we'll use the mock data and filter it
        let data = [...mockOrders];

        // Add some demo data
        data = data.map((order) => ({
          ...order,
          items: Math.floor(Math.random() * 20) + 1, // 1-20 items
          total: Math.floor(Math.random() * 10000) + 500, // 500-10500 DKK
        }));

        // Filter for current club admin
        if (user && user.clubId) {
          data = data.filter((order) => order.clubId === user.clubId);
        }

        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <ShoppingBag size={12} className="mr-1" /> Pending
            </span>
          ),
          icon: <ShoppingBag size={20} className="text-yellow-500" />,
        };
      case 'Processing':
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <ArrowUpRight size={12} className="mr-1" /> Processing
            </span>
          ),
          icon: <ArrowUpRight size={20} className="text-blue-500" />,
        };
      case 'Shipped':
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              <TruckIcon size={12} className="mr-1" /> Shipped
            </span>
          ),
          icon: <TruckIcon size={20} className="text-indigo-500" />,
        };
      case 'Delivered':
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle2 size={12} className="mr-1" /> Delivered
            </span>
          ),
          icon: <CheckCircle2 size={20} className="text-green-500" />,
        };
      case 'Canceled':
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <XCircle size={12} className="mr-1" /> Canceled
            </span>
          ),
          icon: <XCircle size={20} className="text-gray-500" />,
        };
      default:
        return {
          badge: null,
          icon: null,
        };
    }
  };

  const clubName = user?.clubId ? getClubById(user.clubId)?.name : 'Your Club';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your orders for {clubName}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Orders"
          value={orders.length.toString()}
          description="All time"
          icon={<ShoppingBag className="h-5 w-5 text-primary" />}
          color="bg-primary/10"
        />
        <StatsCard
          title="Pending"
          value={orders.filter((o) => o.status === 'Pending').length.toString()}
          description="Awaiting processing"
          icon={<ArrowUpRight className="h-5 w-5 text-yellow-500" />}
          color="bg-yellow-100"
        />
        <StatsCard
          title="In Transit"
          value={orders.filter((o) => o.status === 'Shipped').length.toString()}
          description="Currently shipping"
          icon={<TruckIcon className="h-5 w-5 text-indigo-500" />}
          color="bg-indigo-100"
        />
        <StatsCard
          title="Delivered"
          value={orders.filter((o) => o.status === 'Delivered').length.toString()}
          description="Successfully completed"
          icon={<PackageCheck className="h-5 w-5 text-green-500" />}
          color="bg-green-100"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by order ID..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[150px]">
          <select
            className="appearance-none border rounded-md px-4 py-2 pr-8 bg-white w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'All')}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Canceled">Canceled</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Filter size={18} className="text-gray-600" />
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ShoppingBag size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm || statusFilter !== 'All'
              ? 'Try adjusting your search or filter criteria'
              : 'You have no orders at the moment'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Items
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1.5 text-gray-400" />
                        {order.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{order.items} items</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {order.total?.toLocaleString()} DKK
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{statusConfig.badge}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary/80 transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

function StatsCard({ title, value, description, icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}
