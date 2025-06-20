// src/app/(dashboard)/kit-setup/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronRight,
  Shirt,
  CalendarCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/context/auth-context';
import { getClubById, AgreementStatus } from '@/lib/data/mock-data';

// Kit Request data structure
interface KitRequest {
  id: string;
  name: string;
  teamName: string;
  status: AgreementStatus;
  dueDate: string;
  progress: number;
  playerCount: number;
  completedCount: number;
  isRequired: boolean;
}

export default function KitSetupPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [kitRequests, setKitRequests] = useState<KitRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch kit requests on mount or user change
  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch(
          `/api/kit-setup?view=requests${user?.clubId ? `&clubId=${user.clubId}` : ''}`,
        );
        const data: KitRequest[] = await res.json();
        setKitRequests(data);
      } catch (err) {
        console.error('Failed to load kit requests', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRequests();
  }, [user]);

  // Filtered list based on search term
  const filteredKitRequests = useMemo(
    () =>
      kitRequests.filter((r) =>
        [r.name, r.teamName].join(' ').toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [kitRequests, searchTerm],
  );

  // Render status badge
  const getStatusBadge = (status: AgreementStatus) => {
    switch (status) {
      case AgreementStatus.Pending:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" /> {t('status.pending')}
          </span>
        );
      case AgreementStatus.Active:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" /> {t('status.active')}
          </span>
        );
      case AgreementStatus.InProgress:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock size={12} className="mr-1" /> {t('status.in_progress')}
          </span>
        );
      case AgreementStatus.Completed:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <CheckCircle size={12} className="mr-1" /> {t('status.completed')}
          </span>
        );
      case AgreementStatus.Canceled:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertTriangle size={12} className="mr-1" /> {t('status.canceled')}
          </span>
        );
      default:
        return null;
    }
  };

  const clubName = user?.clubId ? getClubById(user.clubId)?.name : t('subtitle', { club: '' });

  // Compute overall progress percentage
  const overallProgress = useMemo(() => {
    if (kitRequests.length === 0) return 0;
    const totalPlayers = kitRequests.reduce((sum, r) => sum + r.playerCount, 0);
    const totalCompleted = kitRequests.reduce((sum, r) => sum + r.completedCount, 0);
    return totalPlayers > 0 ? Math.round((totalCompleted / totalPlayers) * 100) : 0;
  }, [kitRequests]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{t('kit_setup.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {t('kit_setup.subtitle', { club: clubName })}
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-800">{t('kit_setup.overall_progress')}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {overallProgress === 100
                ? t('kit_setup.overall_subtitle_complete')
                : t('kit_setup.overall_subtitle_incomplete')}
            </p>
          </div>
          <div className="flex items-center">
            <div className="mr-4 text-sm font-medium">
              <span className="text-primary">{overallProgress}%</span> {t('kit_setup.complete')}
            </div>
            <div className="relative h-4 w-32 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={t('kit_setup.search_placeholder')}
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-primary focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Kit Requests List */}
      {filteredKitRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Shirt size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {t('kit_setup.no_requests.title')}
          </h2>
          <p className="text-gray-500">
            {searchTerm
              ? t('kit_setup.no_requests.desc_with_search')
              : t('kit_setup.no_requests.desc_without_search')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredKitRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded mr-2">
                        {request.id}
                      </div>
                      {getStatusBadge(request.status)}
                      {request.isRequired && (
                        <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded">
                          {t('kit_setup.required_label')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{request.name}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Users size={14} className="mr-1.5 text-gray-400" />
                        {request.teamName}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1.5 text-gray-400" />
                        {t('kit_setup.due', { date: request.dueDate })}
                      </div>
                      <div className="flex items-center">
                        <Shirt size={14} className="mr-1.5 text-gray-400" />
                        {t('kit_setup.players_completed', {
                          completed: request.completedCount,
                          total: request.playerCount,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      {t('kit_setup.progress_label')}:{' '}
                      <span className="font-medium ml-1">{request.progress}%</span>
                    </div>
                    <div className="w-full md:w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          request.progress === 100
                            ? 'bg-green-500'
                            : request.progress > 0
                            ? 'bg-primary'
                            : 'bg-gray-300'
                        }`}
                        style={{ width: `${request.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {request.status === AgreementStatus.Completed ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle size={14} className="mr-1.5" />
                      {t('kit_setup.status.completed')}
                    </span>
                  ) : request.status === AgreementStatus.Pending ? (
                    <span className="flex items-center text-yellow-600">
                      <Clock size={14} className="mr-1.5" />
                      {t('kit_setup.not_started')}
                    </span>
                  ) : request.status === AgreementStatus.InProgress ? (
                    <span className="flex items-center text-blue-600">
                      <CalendarCheck size={14} className="mr-1.5" />
                      {request.dueDate < new Date().toISOString().split('T')[0]
                        ? t('kit_setup.overdue')
                        : t('kit_setup.due', { date: request.dueDate })}
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-600">
                      <CalendarCheck size={14} className="mr-1.5" />
                      {t('kit_setup.ready_to_start')}
                    </span>
                  )}
                </div>
                <Link
                  href={`/player-kit-details/${request.id}`}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
                >
                  {request.progress === 100
                    ? t('kit_setup.view_details')
                    : t('kit_setup.complete_kit_details')}
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions Card */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-medium text-gray-800">{t('kit_setup.how_it_works')}</h2>
        <div className="space-y-4 text-sm text-gray-600">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-start">
              <span className="flex items-center justify-center h-6 w-6 bg-primary/10 text-primary rounded-full text-xs font-medium mr-3 mt-0.5">
                {step}
              </span>
              <div>
                <p className="font-medium text-gray-800">{t(`kit_setup.step${step}_title`)}</p>
                <p>{t(`kit_setup.step${step}_desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
