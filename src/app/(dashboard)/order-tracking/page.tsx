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
import { useAuth } from '@/lib/context/auth-context';
import { getClubById, OrderStatus } from '@/lib/data/mock-data';

// Extended Order interface for more details
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
  const { user } = useAuth();
  const [orders, setOrders] = useState<DetailedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders from API
        const response = await fetch(
          `/api/order-tracking${user?.clubId ? `?clubId=${user.clubId}` : ''}`,
        );
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Get specific order details if an order is selected
  useEffect(() => {
    if (selectedOrder) {
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`/api/order-tracking?orderId=${selectedOrder.id}`);
          const data = await response.json();
          setSelectedOrder(data);
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      };

      fetchOrderDetails();
    }
  }, [selectedOrder?.id]);

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.kitName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Clock size={12} className="mr-1" /> Being Prepared
            </span>
          ),
          icon: <Clock size={20} className="text-yellow-500" />,
          color: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          description: 'Your order is being prepared',
        };
      case OrderStatus.Processing:
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Package size={12} className="mr-1" /> In Production
            </span>
          ),
          icon: <Package size={20} className="text-blue-500" />,
          color: 'bg-blue-100',
          textColor: 'text-blue-800',
          description: 'Your order is in production',
        };
      case OrderStatus.Shipped:
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              <TruckIcon size={12} className="mr-1" /> Shipped
            </span>
          ),
          icon: <TruckIcon size={20} className="text-indigo-500" />,
          color: 'bg-indigo-100',
          textColor: 'text-indigo-800',
          description: 'Your order is on the way',
        };
      case OrderStatus.Delivered:
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle2 size={12} className="mr-1" /> Delivered
            </span>
          ),
          icon: <CheckCircle2 size={20} className="text-green-500" />,
          color: 'bg-green-100',
          textColor: 'text-green-800',
          description: 'Your order has been delivered',
        };
      case OrderStatus.Canceled:
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <XCircle size={12} className="mr-1" /> Canceled
            </span>
          ),
          icon: <XCircle size={20} className="text-gray-500" />,
          color: 'bg-gray-100',
          textColor: 'text-gray-800',
          description: 'Your order has been canceled',
        };
      default:
        return {
          badge: null,
          icon: null,
          color: 'bg-gray-100',
          textColor: 'text-gray-800',
          description: 'Unknown status',
        };
    }
  };

  const clubName = user?.clubId ? getClubById(user.clubId)?.name : 'Your Club';

  // Count orders by status
  const countByStatus = {
    total: orders.length,
    pending: orders.filter((o) => o.status === OrderStatus.Pending).length,
    processing: orders.filter((o) => o.status === OrderStatus.Processing).length,
    shipped: orders.filter((o) => o.status === OrderStatus.Shipped).length,
    delivered: orders.filter((o) => o.status === OrderStatus.Delivered).length,
    canceled: orders.filter((o) => o.status === OrderStatus.Canceled).length,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {!selectedOrder ? (
        // Orders List View
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Order Tracking</h1>
              <p className="text-gray-500 text-sm mt-1">
                Track and manage your kit orders for {clubName}
              </p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <StatusCard
              title="All Orders"
              count={countByStatus.total}
              icon={<ShoppingBag size={18} className="text-primary" />}
              color="bg-primary/10"
            />
            <StatusCard
              title="Being Prepared"
              count={countByStatus.pending}
              icon={<Clock size={18} className="text-yellow-500" />}
              color="bg-yellow-100"
            />
            <StatusCard
              title="In Production"
              count={countByStatus.processing}
              icon={<Package size={18} className="text-blue-500" />}
              color="bg-blue-100"
            />
            <StatusCard
              title="Shipped"
              count={countByStatus.shipped}
              icon={<TruckIcon size={18} className="text-indigo-500" />}
              color="bg-indigo-100"
            />
            <StatusCard
              title="Delivered"
              count={countByStatus.delivered}
              icon={<CheckCircle2 size={18} className="text-green-500" />}
              color="bg-green-100"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
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
                <option value={OrderStatus.Pending}>Being Prepared</option>
                <option value={OrderStatus.Processing}>In Production</option>
                <option value={OrderStatus.Shipped}>Shipped</option>
                <option value={OrderStatus.Delivered}>Delivered</option>
                <option value={OrderStatus.Canceled}>Canceled</option>
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
              <h2 className="text-lg font-semibold text-gray-800 mb-2">No Orders Found</h2>
              <p className="text-gray-500 text-sm">
                {searchTerm || statusFilter !== 'All'
                  ? 'Try adjusting your search or filter criteria'
                  : 'You have no orders at the moment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded mr-3">
                              {order.id}
                            </div>
                            {statusConfig.badge}
                          </div>

                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {order.kitName}
                          </h3>

                          <div className="flex flex-col sm:flex-row sm:gap-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarClock size={14} className="mr-1.5 text-gray-400" />
                              Ordered: {order.createdAt}
                            </div>
                            <div className="flex items-center">
                              <Package size={14} className="mr-1.5 text-gray-400" />
                              {order.items} Items
                            </div>
                            <div className="flex items-center">
                              <ShoppingBag size={14} className="mr-1.5 text-gray-400" />
                              Team: {order.teamName}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          {order.estimatedDelivery &&
                            order.status !== OrderStatus.Delivered &&
                            order.status !== OrderStatus.Canceled && (
                              <div className="text-sm text-gray-500 mb-2">
                                Expected delivery: {order.estimatedDelivery}
                              </div>
                            )}

                          {/* Progress bar */}
                          <div className="w-full max-w-[200px] h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                            <div
                              className={`h-full ${
                                order.status === OrderStatus.Canceled ? 'bg-gray-400' : 'bg-primary'
                              }`}
                              style={{ width: `${order.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.status === OrderStatus.Canceled
                              ? 'Canceled'
                              : `${order.progress}% Complete`}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center">
                        {statusConfig.icon}
                        <span className="ml-2 text-sm text-gray-600">
                          {statusConfig.description}
                        </span>
                      </div>

                      <button className="text-sm text-primary flex items-center">
                        View Details <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        // Order Detail View
        <>
          <div className="mb-6">
            <button
              className="text-primary hover:underline flex items-center text-sm mb-2"
              onClick={() => setSelectedOrder(null)}
            >
              &larr; Back to all orders
            </button>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Order Details: {selectedOrder.id}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedOrder.kitName} - {selectedOrder.teamName}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {selectedOrder.status === OrderStatus.Shipped && selectedOrder.trackingNumber && (
                  <button className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary/5 flex items-center text-sm">
                    <TruckIcon size={14} className="mr-1.5" /> Track Package
                  </button>
                )}

                <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center text-sm">
                  <Download size={14} className="mr-1.5" /> Download Order Details
                </button>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Order Status</h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3.5 top-1 h-full w-0.5 bg-gray-200"></div>

              <div className="space-y-6">
                <TimelineItem
                  title="Order Submitted"
                  date={selectedOrder.createdAt}
                  description="Your order has been received and is being processed."
                  status={selectedOrder.status === OrderStatus.Canceled ? 'canceled' : 'completed'}
                />

                <TimelineItem
                  title="In Production"
                  date={selectedOrder.status === OrderStatus.Pending ? '' : selectedOrder.updatedAt}
                  description="Your kit items are being produced and customized."
                  status={
                    selectedOrder.status === OrderStatus.Pending
                      ? 'upcoming'
                      : selectedOrder.status === OrderStatus.Canceled
                      ? 'canceled'
                      : 'completed'
                  }
                />

                <TimelineItem
                  title="Shipping"
                  date={
                    selectedOrder.status === OrderStatus.Shipped ||
                    selectedOrder.status === OrderStatus.Delivered
                      ? selectedOrder.updatedAt
                      : ''
                  }
                  description={
                    selectedOrder.trackingNumber
                      ? `Your order has been shipped. Tracking number: ${selectedOrder.trackingNumber}`
                      : 'Your order will be shipped soon.'
                  }
                  status={
                    selectedOrder.status === OrderStatus.Pending ||
                    selectedOrder.status === OrderStatus.Processing
                      ? 'upcoming'
                      : selectedOrder.status === OrderStatus.Canceled
                      ? 'canceled'
                      : 'completed'
                  }
                />

                <TimelineItem
                  title="Delivery"
                  date={
                    selectedOrder.status === OrderStatus.Delivered ? selectedOrder.updatedAt : ''
                  }
                  description={
                    selectedOrder.status === OrderStatus.Delivered
                      ? 'Your order has been delivered successfully.'
                      : `Estimated delivery date: ${
                          selectedOrder.estimatedDelivery || 'To be determined'
                        }`
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

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="text-gray-600">Order ID:</div>
                <div className="font-medium">{selectedOrder.id}</div>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="text-gray-600">Kit Name:</div>
                <div className="font-medium">{selectedOrder.kitName}</div>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="text-gray-600">Team:</div>
                <div className="font-medium">{selectedOrder.teamName}</div>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="text-gray-600">Date Ordered:</div>
                <div className="font-medium">{selectedOrder.createdAt}</div>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="text-gray-600">Total Items:</div>
                <div className="font-medium">{selectedOrder.items}</div>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="text-gray-600">Player Count:</div>
                <div className="font-medium">{selectedOrder.playerCount}</div>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="text-gray-600">Status:</div>
                <div>{getStatusConfig(selectedOrder.status).badge}</div>
              </div>

              {selectedOrder.estimatedDelivery && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="text-gray-600">Estimated Delivery:</div>
                  <div className="font-medium">{selectedOrder.estimatedDelivery}</div>
                </div>
              )}

              {selectedOrder.trackingNumber && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="text-gray-600">Tracking Number:</div>
                  <div className="font-medium">{selectedOrder.trackingNumber}</div>
                </div>
              )}
            </div>
          </div>

          {/* Kit Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Kit Details</h2>

              <button className="flex items-center text-sm text-primary hover:underline">
                <Eye size={14} className="mr-1.5" /> View All Items
              </button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Player
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Jersey #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name on Jersey
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sizes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Alex Johnson
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">JOHNSON</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Jersey: M, Shorts: M, Socks: M
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sam Lee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">LEE</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Jersey: L, Shorts: M, Socks: L
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Taylor Martinez
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MARTINEZ</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Jersey: S, Shorts: S, Socks: S
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic"
                      colSpan={4}
                    >
                      + {selectedOrder.playerCount - 3} more players
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <button className="w-full py-2 border border-gray-300 rounded-md text-sm text-gray-700 flex items-center justify-center hover:bg-gray-50">
                <FileText size={14} className="mr-1.5" /> Download Complete Kit List
              </button>
            </div>
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
  status: 'completed' | 'pending' | 'upcoming' | 'canceled';
}

function TimelineItem({ title, date, description, status }: TimelineItemProps) {
  // Define status colors and icons
  const statusConfig = {
    completed: {
      iconClass: 'bg-green-500 text-white',
      icon: <CheckCircle2 size={14} />,
      textClass: 'text-gray-900',
    },
    pending: {
      iconClass: 'bg-yellow-500 text-white',
      icon: <Clock size={14} />,
      textClass: 'text-gray-900',
    },
    upcoming: {
      iconClass: 'bg-gray-200 text-gray-500',
      icon: <Clock size={14} />,
      textClass: 'text-gray-400',
    },
    canceled: {
      iconClass: 'bg-gray-200 text-gray-500',
      icon: <XCircle size={14} />,
      textClass: 'text-gray-400',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="relative flex gap-4">
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full ${config.iconClass} flex items-center justify-center z-10`}
      >
        {config.icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className={`font-medium ${config.textClass}`}>{title}</h3>
          {date && <div className="text-sm text-gray-500">{date}</div>}
        </div>
        <p
          className={`text-sm ${
            status === 'upcoming' || status === 'canceled' ? 'text-gray-400' : 'text-gray-600'
          } mt-1`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
