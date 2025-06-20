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
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/context/auth-context';
import { getClubById, mockOrders, Order } from '@/lib/data/mock-data';
import OrderDetailsModal from '@/app/components/orders/orderDetailsModal';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';

export default function OrdersPage() {
  const { t } = useTranslation('orders');
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const stored = localStorage.getItem('submittedOrders');
        const submittedOrders: Order[] = stored ? JSON.parse(stored) : [];
        let data = [...mockOrders, ...submittedOrders];

        if (user?.clubId) {
          data = data.filter((o) => o.clubId === user.clubId);
        }

        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: OrderStatus) => {
    const common = {
      Pending: {
        badgeIcon: <ShoppingBag size={12} className="mr-1" />,
        icon: <ShoppingBag size={20} className="text-yellow-500" />,
      },
      Processing: {
        badgeIcon: <ArrowUpRight size={12} className="mr-1" />,
        icon: <ArrowUpRight size={20} className="text-blue-500" />,
      },
      Shipped: {
        badgeIcon: <TruckIcon size={12} className="mr-1" />,
        icon: <TruckIcon size={20} className="text-indigo-500" />,
      },
      Delivered: {
        badgeIcon: <CheckCircle2 size={12} className="mr-1" />,
        icon: <CheckCircle2 size={20} className="text-green-500" />,
      },
      Canceled: {
        badgeIcon: <XCircle size={12} className="mr-1" />,
        icon: <XCircle size={20} className="text-gray-500" />,
      },
    }[status];

    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-indigo-100 text-indigo-800',
      Delivered: 'bg-green-100 text-green-800',
      Canceled: 'bg-gray-100 text-gray-800',
    }[status];

    return {
      badge: (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}
        >
          {common.badgeIcon} {t(`orders.filter.${status.toLowerCase()}`)}
        </span>
      ),
      icon: common.icon,
    };
  };

  const clubName = user?.clubId ? getClubById(user.clubId)?.name : '';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{t('orders.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('orders.subtitle', { club: clubName })}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {(['total_orders', 'pending', 'in_transit', 'delivered'] as const).map((key) => (
          <StatsCard
            key={key}
            title={t(`orders.stats.${key}`)}
            value={{
              total_orders: orders.length,
              pending: orders.filter((o) => o.status === 'Pending').length,
              in_transit: orders.filter((o) => o.status === 'Shipped').length,
              delivered: orders.filter((o) => o.status === 'Delivered').length,
            }[key].toString()}
            description={t(`orders.stats.${key}_desc`)}
            icon={
              {
                total_orders: <ShoppingBag className="h-5 w-5 text-primary" />,
                pending: <ArrowUpRight className="h-5 w-5 text-yellow-500" />,
                in_transit: <TruckIcon className="h-5 w-5 text-indigo-500" />,
                delivered: <PackageCheck className="h-5 w-5 text-green-500" />,
              }[key]
            }
            color={
              {
                total_orders: 'bg-primary/10',
                pending: 'bg-yellow-100',
                in_transit: 'bg-indigo-100',
                delivered: 'bg-green-100',
              }[key]
            }
          />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('orders.search_placeholder')}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[150px]">
          <select
            className="appearance-none border rounded-md px-4 py-2 pr-8 bg-white w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="All">{t('orders.filter.all_statuses')}</option>
            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled'].map((s) => (
              <option key={s} value={s}>
                {t(`orders.filter.${s.toLowerCase()}`)}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Filter size={18} className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* Orders Table or Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ShoppingBag size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t('orders.no_orders.title')}</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm || statusFilter !== 'All' ? t('no_orders.filtered') : t('no_orders.empty')}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {(['order_id', 'date', 'items', 'total', 'status', 'actions'] as const).map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t(`orders.table.${h}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const cfg = getStatusConfig(order.status as OrderStatus);
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
                      <span className="text-sm text-gray-900">
                        {order.items} {t('orders.table.items')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {order.total?.toLocaleString()} DKK
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{cfg.badge}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-primary hover:text-primary/80 transition-colors"
                        onClick={() => openModal(order)}
                      >
                        <Eye size={16} /> {t('orders.modal.view')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} isOpen={isModalOpen} onClose={closeModal} />
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
