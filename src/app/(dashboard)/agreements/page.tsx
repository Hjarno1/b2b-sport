// src/app/(dashboard)/agreements/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Calendar,
  Clock,
  Download,
  CheckCircle,
  AlertCircle,
  XCircle,
  HourglassIcon,
  FileText,
} from 'lucide-react';
import { Agreement, AgreementStatus, getClubById } from '@/lib/data/mock-data';
import { useAuth } from '@/lib/context/auth-context';

export default function AgreementsPage() {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgreementStatus | 'All'>('All');

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await fetch('/api/agreements');
        let data = await response.json();

        // Filter agreements for the current club admin
        if (user && user.clubId) {
          data = data.filter((agreement: Agreement) => agreement.clubId === user.clubId);
        }

        setAgreements(data);
      } catch (error) {
        console.error('Error fetching agreements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgreements();
  }, [user]);

  // Filter agreements
  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch =
      agreement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || agreement.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: AgreementStatus) => {
    switch (status) {
      case AgreementStatus.Pending:
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <HourglassIcon size={12} className="mr-1" /> Pending
            </span>
          ),
          icon: <AlertCircle size={16} className="text-yellow-500" />,
        };
      case AgreementStatus.Active:
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle size={12} className="mr-1" /> Active
            </span>
          ),
          icon: <CheckCircle size={16} className="text-green-500" />,
        };
      case AgreementStatus.InProgress:
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Clock size={12} className="mr-1" /> In Progress
            </span>
          ),
          icon: <Clock size={16} className="text-blue-500" />,
        };
      case AgreementStatus.Completed:
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              <CheckCircle size={12} className="mr-1" /> Completed
            </span>
          ),
          icon: <CheckCircle size={16} className="text-indigo-500" />,
        };
      case AgreementStatus.Canceled:
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <XCircle size={12} className="mr-1" /> Canceled
            </span>
          ),
          icon: <XCircle size={16} className="text-gray-500" />,
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
          <h1 className="text-2xl font-semibold text-gray-800">Agreements</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your agreements for {clubName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search agreements..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[150px]">
          <select
            className="appearance-none border rounded-md px-4 py-2 pr-8 bg-white w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AgreementStatus | 'All')}
          >
            <option value="All">All Statuses</option>
            {Object.values(AgreementStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Filter size={18} className="text-gray-600" />
          </div>
        </div>
      </div>

      {filteredAgreements.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FileText size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No agreements found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm || statusFilter !== 'All'
              ? 'Try adjusting your search or filter criteria'
              : 'You have no active agreements at the moment'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAgreements.map((agreement) => {
            const statusConfig = getStatusConfig(agreement.status);

            return (
              <div
                key={agreement.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {agreement.id}
                    </div>
                    {statusConfig.badge}
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-2">{agreement.name}</h3>

                  <div className="space-y-2 mt-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2 text-gray-400" />
                      <span>Created: {agreement.createdAt}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-2 text-gray-400" />
                      <span>Valid until: {agreement.validUntil}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center text-gray-500 text-xs">
                      <div
                        className="w-2 h-2 rounded-full mr-1.5"
                        style={{
                          backgroundColor:
                            agreement.priority === 'High'
                              ? '#ef4444'
                              : agreement.priority === 'Normal'
                              ? '#3b82f6'
                              : '#9ca3af',
                        }}
                      ></div>
                      {agreement.priority} Priority
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="text-gray-600 hover:text-gray-900 transition-colors">
                      <Download size={16} />
                    </button>
                    <button className="text-primary hover:text-primary/80 transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
