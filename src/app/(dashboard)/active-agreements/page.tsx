'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Eye, Calendar, Building2 } from 'lucide-react';
import {
  Agreement,
  AgreementStatus,
  mockClubs,
  mockAgreementTemplates,
} from '@/lib/data/mock-data';
import { useTranslation } from 'react-i18next';

export default function ActiveAgreementsPage() {
  const { t } = useTranslation('active_agreements');
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgreementStatus | 'All'>('All');
  const [clubFilter, setClubFilter] = useState<string>('All');

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await fetch('/api/agreements');
        const data = await response.json();
        setAgreements(data);
      } catch (error) {
        console.error('Error fetching agreements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgreements();
  }, []);

  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch =
      agreement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || agreement.status === statusFilter;
    const matchesClub = clubFilter === 'All' || agreement.clubId === clubFilter;
    return matchesSearch && matchesStatus && matchesClub;
  });

  const getStatusBadge = (status: AgreementStatus) => {
    const label = t(`status.${status.toLowerCase()}`);
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

    switch (status) {
      case AgreementStatus.Pending:
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{label}</span>;
      case AgreementStatus.Active:
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>{label}</span>;
      case AgreementStatus.InProgress:
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{label}</span>;
      case AgreementStatus.Completed:
        return <span className={`${baseClasses} bg-indigo-100 text-indigo-800`}>{label}</span>;
      case AgreementStatus.Canceled:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{label}</span>;
      default:
        return null;
    }
  };

  const getClubName = (clubId: string) => {
    const club = mockClubs.find((c) => c.id === clubId);
    return club ? club.name : 'Unknown Club';
  };

  const getTemplateName = (templateId: string) => {
    const template = mockAgreementTemplates.find((t) => t.id === templateId);
    return template ? template.name : 'Unknown Template';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">{t('title')}</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center">
          <Plus size={18} className="mr-2" /> {t('create_new')}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('search_placeholder')}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[150px]">
          <select
            className="appearance-none border rounded-md px-4 py-2 pr-8 bg-white w-full"
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
          >
            <option value="All">{t('filter_all_clubs')}</option>
            {mockClubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Building2 size={18} className="text-gray-600" />
          </div>
        </div>
        <div className="relative min-w-[150px]">
          <select
            className="appearance-none border rounded-md px-4 py-2 pr-8 bg-white w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AgreementStatus | 'All')}
          >
            <option value="All">{t('filter_all_statuses')}</option>
            {Object.values(AgreementStatus).map((status) => (
              <option key={status} value={status}>
                {t(`status.${status.toLowerCase()}`)}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Filter size={18} className="text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('table.agreement_id')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('table.club')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('table.template')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('table.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('table.valid_until')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAgreements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  {t('no_results')}
                </td>
              </tr>
            ) : (
              filteredAgreements.map((agreement) => (
                <tr key={agreement.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {agreement.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getClubName(agreement.clubId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getTemplateName(agreement.templateId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(agreement.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-gray-400" />
                      {agreement.validUntil}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center ml-auto">
                      <Eye size={16} className="mr-1" /> {t('view')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
