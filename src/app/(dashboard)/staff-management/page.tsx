// src/app/(dashboard)/staff-management/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Mail,
  User,
  UserCheck,
  UserX,
  Check,
  X,
  Phone,
  CalendarClock,
} from 'lucide-react';
import { User as UserType, UserRole, UserStatus, getClubById } from '@/lib/data/mock-data';
import { useAuth } from '@/lib/context/auth-context';
import { useTranslation } from 'react-i18next';

export default function StaffManagementPage() {
  const { t } = useTranslation('staff_management');
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`/api/users?role=${UserRole.ClubStaff}`);
        let data: UserType[] = await response.json();
        if (user?.clubId) {
          data = data.filter((staff) => staff.clubId === user.clubId);
        }
        setStaffMembers(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, [user]);

  const filteredStaff = staffMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.Active:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <UserCheck size={12} className="mr-1" /> {t('staff_management.status.active')}
          </span>
        );
      case UserStatus.Inactive:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <UserX size={12} className="mr-1" /> {t('staff_management.status.inactive')}
          </span>
        );
      case UserStatus.Pending:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <CalendarClock size={12} className="mr-1" /> {t('staff_management.status.pending')}
          </span>
        );
      default:
        return null;
    }
  };

  const clubName = user?.clubId
    ? getClubById(user.clubId)?.name
    : t('staff_management.defaultClub');

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {t('staff_management.pageTitle')}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t('staff_management.pageSubtitle', { club: clubName })}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Plus size={16} className="mr-2" /> {t('staff_management.addButton')}
        </button>
      </div>

      {/* Search Box */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('staff_management.searchPlaceholder')}
            className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Staff List */}
      {filteredStaff.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <User size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {t('staff_management.noResultsTitle')}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchTerm ? t('noResultsDescFiltered') : t('noResultsDescEmpty')}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus size={16} className="mr-2" /> {t('staff_management.addFirst')}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff_management.colStaff')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff_management.colContact')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff_management.colStatus')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff_management.colLastLogin')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff_management.colActions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                        <Image
                          src={member.avatar || '/faces/default-avatar.jpg'}
                          alt={member.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail size={14} className="text-gray-400 mr-1" /> {member.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Phone size={14} className="text-gray-400 mr-1" /> {member.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(member.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.lastLogin || t('never')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        aria-label={t('staff_management.aria.edit')}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={16} />
                      </button>
                      {member.status === UserStatus.Active ? (
                        <button
                          aria-label={t('staff_management.aria.deactivate')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X size={16} />
                        </button>
                      ) : (
                        <button
                          aria-label={t('staff_management.aria.activate')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('staff_management.modalTitle')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('staff_management.labelName')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder={t('staff_management.labelName')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('staff_management.labelEmail')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder={t('staff_management.labelEmail')}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('staff_management.labelPhone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder={t('staff_management.labelPhone')}
                  />
                </div>
                <div>
                  <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('staff_management.labelTeam')}
                  </label>
                  <select
                    id="team"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="">{t('staff_management.teamPlaceholder')}</option>
                    <option value="team1">{t('staff_management.team1')}</option>
                    <option value="team2">{t('staff_management.team2')}</option>
                    <option value="team3">{t('staff_management.team3')}</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {t('staff_management.buttonCancel')}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  {t('staff_management.buttonAdd')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
