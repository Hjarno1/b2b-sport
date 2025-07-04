// src/app/(dashboard)/order-tracking/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  TruckIcon,
  Package,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarClock,
  ChevronRight,
  FileText,
  Eye,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/context/auth-context';
import { getClubById, OrderStatus } from '@/lib/data/mock-data';

interface DetailedOrder {
  id: string;
  agreementId: string;
  clubId: string;
  teamId: string;
  teamName: string;
  kitName: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  completedBy?: string;
  items: number;
  estimatedDelivery?: string;
  trackingNumber?: string;
  playerCount: number;
  progress: number;
}

export default function OrderTrackingPage() {
  const { t } = useTranslation('order_tracking');
  const { user } = useAuth();
  const [orders, setOrders] = useState<DetailedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(
          `/api/order-tracking${user?.clubId ? `?clubId=${user.clubId}` : ''}`,
        );
        setOrders(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (!selectedOrder) return;
    async function fetchDetails() {
      try {
        if (!selectedOrder) return;
        const res = await fetch(`/api/order-tracking?orderId=${selectedOrder.id}`);
        setSelectedOrder(await res.json());
      } catch (e) {
        console.error(e);
      }
    }
    fetchDetails();
  }, [selectedOrder?.id]);

  const filteredOrders = orders.filter((o) => {
    const matchText =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.kitName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchText && matchStatus;
  });

  const getStatusConfig = (status: OrderStatus) => ({
    badge: (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          {
            Pending: 'bg-yellow-100 text-yellow-800',
            Processing: 'bg-blue-100 text-blue-800',
            Shipped: 'bg-indigo-100 text-indigo-800',
            Delivered: 'bg-green-100 text-green-800',
            Canceled: 'bg-gray-100 text-gray-800',
          }[status]
        }`}
      >
        {
          {
            Pending: (
              <>
                <Clock size={12} className="mr-1" />
                {t('order_tracking.status_badge.pending')}
              </>
            ),
            Processing: (
              <>
                <Package size={12} className="mr-1" />
                {t('order_tracking.status_badge.processing')}
              </>
            ),
            Shipped: (
              <>
                <TruckIcon size={12} className="mr-1" />
                {t('order_tracking.status_badge.shipped')}
              </>
            ),
            Delivered: (
              <>
                <CheckCircle2 size={12} className="mr-1" />
                {t('order_tracking.status_badge.delivered')}
              </>
            ),
            Canceled: (
              <>
                <XCircle size={12} className="mr-1" />
                {t('order_tracking.status_badge.canceled')}
              </>
            ),
          }[status]
        }
      </span>
    ),
    icon: {
      Pending: <Clock size={20} />,
      Processing: <Package size={20} />,
      Shipped: <TruckIcon size={20} />,
      Delivered: <CheckCircle2 size={20} />,
      Canceled: <XCircle size={20} />,
    }[status],
    description: t(`status_desc.${status.toLowerCase()}`),
  });

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
      {!selectedOrder ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{t('order_tracking.title')}</h1>
              <p className="text-gray-500 text-sm mt-1">
                {t('order_tracking.subtitle', { club: clubName })}
              </p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {(['all_orders', 'pending', 'processing', 'shipped', 'delivered'] as const).map(
              (key) => (
                <StatusCard
                  key={key}
                  title={t(`order_tracking.status_cards.${key}`)}
                  count={
                    {
                      all_orders: orders.length,
                      pending: orders.filter((o) => o.status === OrderStatus.Pending).length,
                      processing: orders.filter((o) => o.status === OrderStatus.Processing).length,
                      shipped: orders.filter((o) => o.status === OrderStatus.Shipped).length,
                      delivered: orders.filter((o) => o.status === OrderStatus.Delivered).length,
                    }[key]
                  }
                  icon={
                    {
                      all_orders: <ShoppingBag size={18} />,
                      pending: <Clock size={18} />,
                      processing: <Package size={18} />,
                      shipped: <TruckIcon size={18} />,
                      delivered: <CheckCircle2 size={18} />,
                    }[key]
                  }
                  color={
                    {
                      all_orders: 'bg-primary/10',
                      pending: 'bg-yellow-100',
                      processing: 'bg-blue-100',
                      shipped: 'bg-indigo-100',
                      delivered: 'bg-green-100',
                    }[key]
                  }
                />
              ),
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('order_tracking.search_placeholder')}
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
                <option value="All">{t('order_tracking.filter.all_statuses')}</option>
                {Object.values(OrderStatus).map((s) => (
                  <option key={s} value={s}>
                    {t(`order_tracking.status_cards.${s.toLowerCase()}`)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Filter size={18} className="text-gray-600" />
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {t('order_tracking.no_orders.title')}
              </h2>
              <p className="text-gray-500 text-sm">
                {searchTerm || statusFilter !== 'All'
                  ? t('no_orders.filtered')
                  : t('no_orders.empty')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const cfg = getStatusConfig(order.status);
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded mr-3">
                              {order.id}
                            </div>
                            {cfg.badge}
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {order.kitName}
                          </h3>
                          <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarClock size={14} className="mr-1.5" />
                              {order.createdAt}
                            </div>
                            <div className="flex items-center">
                              <Package size={14} className="mr-1.5" />
                              {order.items} Items
                            </div>
                            <div className="flex items-center">
                              <ShoppingBag size={14} className="mr-1.5" />
                              {order.teamName}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {order.estimatedDelivery &&
                            order.status !== OrderStatus.Delivered &&
                            order.status !== OrderStatus.Canceled && (
                              <div className="text-sm text-gray-500 mb-2">
                                {order.estimatedDelivery}
                              </div>
                            )}
                          <div className="w-full max-w-[200px] h-2 bg-gray-100 rounded-full mb-1">
                            <div
                              className={`h-full ${
                                order.status === OrderStatus.Canceled ? 'bg-gray-400' : 'bg-primary'
                              }`}
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.status === OrderStatus.Canceled
                              ? t('status_badge.canceled')
                              : `${order.progress}% ${t('order_tracking.complete')}`}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {cfg.icon}
                        <span className="text-sm text-gray-600">{cfg.description}</span>
                      </div>
                      <button className="flex items-center text-primary text-sm">
                        {t('order_tracking.view_details')}{' '}
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Detail View Header */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-primary text-sm mb-2 flex items-center"
            >
              {t('order_tracking.back')}
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {t('order_tracking.detail.heading', { id: selectedOrder.id })}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {t('order_tracking.detail.subheading', {
                    kitName: selectedOrder.kitName,
                    teamName: selectedOrder.teamName,
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                {selectedOrder.status === OrderStatus.Shipped && selectedOrder.trackingNumber && (
                  <button className="px-3 py-1.5 border border-primary text-primary rounded flex items-center text-sm">
                    <TruckIcon size={14} className="mr-1.5" />
                    {t('order_tracking.buttons.track_package')}
                  </button>
                )}
                <button className="px-3 py-1.5 border border-gray-300 rounded flex items-center text-sm">
                  <Download size={14} className="mr-1.5" />
                  {t('order_tracking.buttons.download_order_details')}
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              {t('order_tracking.detail.status_section')}
            </h2>
            <div className="relative">
              <div className="absolute left-3.5 top-1 h-full w-0.5 bg-gray-200" />
              <div className="space-y-6">
                {/* Submitted */}
                <TimelineItem
                  title={t('order_tracking.timeline.submitted.title')}
                  date={selectedOrder.createdAt}
                  description={t('order_tracking.timeline.submitted.desc')}
                  status={selectedOrder.status === OrderStatus.Canceled ? 'canceled' : 'completed'}
                />
                {/* Production */}
                <TimelineItem
                  title={t('order_tracking.timeline.production.title')}
                  date={selectedOrder.status === OrderStatus.Pending ? '' : selectedOrder.updatedAt}
                  description={t('order_tracking.timeline.production.desc')}
                  status={
                    selectedOrder.status === OrderStatus.Pending
                      ? 'upcoming'
                      : selectedOrder.status === OrderStatus.Canceled
                      ? 'canceled'
                      : 'completed'
                  }
                />
                {/* Shipping */}
                <TimelineItem
                  title={t('order_tracking.timeline.shipping.title')}
                  date={
                    [OrderStatus.Shipped, OrderStatus.Delivered].includes(selectedOrder.status)
                      ? selectedOrder.updatedAt
                      : ''
                  }
                  description={
                    selectedOrder.trackingNumber
                      ? t('order_tracking.timeline.shipping.desc_shipped', {
                          trackingNumber: selectedOrder.trackingNumber,
                        })
                      : t('order_tracking.timeline.shipping.desc_upcoming')
                  }
                  status={
                    [OrderStatus.Pending, OrderStatus.Processing].includes(selectedOrder.status)
                      ? 'upcoming'
                      : selectedOrder.status === OrderStatus.Canceled
                      ? 'canceled'
                      : 'completed'
                  }
                />
                {/* Delivery */}
                <TimelineItem
                  title={t('order_tracking.timeline.delivery.title')}
                  date={
                    selectedOrder.status === OrderStatus.Delivered ? selectedOrder.updatedAt : ''
                  }
                  description={
                    selectedOrder.status === OrderStatus.Delivered
                      ? t('order_tracking.timeline.delivery.desc_delivered')
                      : t('order_tracking.timeline.delivery.desc_upcoming', {
                          date: selectedOrder.estimatedDelivery || '',
                        })
                  }
                  status={
                    selectedOrder.status === OrderStatus.Delivered
                      ? 'completed'
                      : selectedOrder.status === OrderStatus.Canceled
                      ? 'canceled'
                      : 'upcoming'
                  }
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              {t('order_tracking.detail.summary_section')}
            </h2>
            <div className="space-y-4">
              {(
                [
                  ['order_id', selectedOrder.id],
                  ['kit_name', selectedOrder.kitName],
                  ['team', selectedOrder.teamName],
                  ['date_ordered', selectedOrder.createdAt],
                  ['total_items', selectedOrder.items.toString()],
                  ['player_count', selectedOrder.playerCount.toString()],
                ] as const
              ).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center border-b py-2 border-gray-100"
                >
                  <div className="text-gray-600">{t(`order_tracking.summary.${key}`)}</div>
                  <div className="font-medium">{value}</div>
                </div>
              ))}
              <div className="flex justify-between items-center border-b py-2 border-gray-100">
                <div className="text-gray-600">{t('order_tracking.summary.status')}</div>
                <div>{getStatusConfig(selectedOrder.status).badge}</div>
              </div>
              {selectedOrder.estimatedDelivery && (
                <div className="flex justify-between items-center border-b py-2 border-gray-100">
                  <div className="text-gray-600">
                    {t('order_tracking.summary.estimated_delivery')}
                  </div>
                  <div className="font-medium">{selectedOrder.estimatedDelivery}</div>
                </div>
              )}
              {selectedOrder.trackingNumber && (
                <div className="flex justify-between items-center py-2">
                  <div className="text-gray-600">{t('order_tracking.summary.tracking_number')}</div>
                  <div className="font-medium">{selectedOrder.trackingNumber}</div>
                </div>
              )}
            </div>
          </div>

          {/* Kit Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                {t('order_tracking.detail.kit_details_section')}
              </h2>
              <button className="flex items-center text-primary text-sm">
                <Eye size={14} className="mr-1.5" />
                {t('order_tracking.buttons.view_all_items')}
              </button>
            </div>
            <table className="min-w-full divide-y divide-gray-200 mb-4">
              <thead className="bg-gray-50">
                <tr>
                  {(['player', 'jersey_number', 'name_on_jersey', 'sizes'] as const).map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t(`order_tracking.table.${h}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* ...render rows dynamically as before... */}
              </tbody>
            </table>
            <button className="w-full py-2 border border-gray-300 rounded text-sm text-gray-700 flex items-center justify-center">
              <FileText size={14} className="mr-1.5" />
              {t('order_tracking.buttons.download_kit_list')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}
function StatusCard({ title, count, icon, color }: StatusCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${color} mr-3`}>{icon}</div>
        <div>
          <div className="text-xl font-semibold">{count}</div>
          <div className="text-xs text-gray-500">{title}</div>
        </div>
      </div>
    </div>
  );
}

interface TimelineItemProps {
  title: string;
  date: string;
  description: string;
  status: 'completed' | 'upcoming' | 'canceled';
}
function TimelineItem({ title, date, description, status }: TimelineItemProps) {
  const cfg = {
    completed: {
      iconBg: 'bg-green-500 text-white',
      icon: <CheckCircle2 size={14} />,
      textClass: 'text-gray-900',
    },
    upcoming: {
      iconBg: 'bg-gray-200 text-gray-500',
      icon: <Clock size={14} />,
      textClass: 'text-gray-400',
    },
    canceled: {
      iconBg: 'bg-gray-200 text-gray-500',
      icon: <XCircle size={14} />,
      textClass: 'text-gray-400',
    },
  }[status];

  return (
    <div className="relative flex gap-4">
      <div className={`w-7 h-7 rounded-full ${cfg.iconBg} flex items-center justify-center z-10`}>
        {cfg.icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className={`font-medium ${cfg.textClass}`}>{title}</h3>
          {date && <div className="text-sm text-gray-500">{date}</div>}
        </div>
        <p className={`text-sm ${cfg.textClass} mt-1`}>{description}</p>
      </div>
    </div>
  );
}
