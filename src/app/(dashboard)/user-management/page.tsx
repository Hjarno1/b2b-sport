// src/app/(dashboard)/user-management/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Search, Building2, Edit, Mail, User } from 'lucide-react';
import { User as UserType, UserRole, UserStatus, mockClubs } from '@/lib/data/mock-data';
import { useTranslation } from 'react-i18next';

export default function UserManagementPage() {
  const { t } = useTranslation('user_management');
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.ClubAdmin);
  const [clubFilter, setClubFilter] = useState<string>('All');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/users?role=${activeTab}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [activeTab]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClub = clubFilter === 'All' || u.clubId === clubFilter;
    return matchesSearch && matchesClub;
  });

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.Active:
        return <span className="badge-green">{t('user_management.status.active')}</span>;
      case UserStatus.Inactive:
        return <span className="badge-red">{t('user_management.status.inactive')}</span>;
      case UserStatus.Pending:
        return <span className="badge-yellow">{t('user_management.status.pending')}</span>;
      default:
        return null;
    }
  };

  const getClubName = (clubId?: string) => {
    if (!clubId) return t('club.na');
    const club = mockClubs.find((c) => c.id === clubId);
    return club ? club.name : t('club.unknown');
  };

  const getButtonLabel = () => {
    switch (activeTab) {
      case UserRole.ClubAdmin:
        return t('buttons.addAdmin');
      case UserRole.ClubStaff:
<<<<<<< HEAD
        return t('buttons.addStaff');
      case UserRole.ClubFinance:
        return t('buttons.addFinance');
=======
        return 'Add Club Staff';
      case UserRole.ClubFinance:
        return 'Add Club Finance';
>>>>>>> main
      default:
        return t('buttons.addUser');
    }
  };

  if (isLoading) {
    return <div className="center-spinner">{t('user_management.loading')}</div>;
  }

  return (
    <div>
      <header className="flex justify-between mb-6">
        <h1 className="text-2xl">{t('user_management.pageTitle')}</h1>
        <button className="btn-primary">
          <Plus size={18} className="mr-2" /> {getButtonLabel()}
        </button>
      </header>

      <nav className="tabs mb-6">
        {['admins', 'staff', 'finance'].map((tab) => (
          <button
            key={tab}
            className={
              activeTab ===
              UserRole[(tab.charAt(0).toUpperCase() + tab.slice(1)) as keyof typeof UserRole]
                ? 'tab-active'
                : 'tab'
            }
            onClick={() =>
              setActiveTab(
                UserRole[(tab.charAt(0).toUpperCase() + tab.slice(1)) as keyof typeof UserRole],
              )
            }
          >
            {t(`user_management.tabs.${tab}`)}
          </button>
<<<<<<< HEAD
        ))}
      </nav>
=======
          <button
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === UserRole.ClubStaff
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(UserRole.ClubStaff)}
          >
            Club Staff
          </button>
          <button
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === UserRole.ClubFinance
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(UserRole.ClubFinance)}
          >
            Club Finance
          </button>
        </nav>
      </div>
>>>>>>> main

      <div className="filters mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={t('user_management.placeholders.search')}
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
<<<<<<< HEAD

        <div className="relative">
          <select
            className="select"
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
          >
            <option value="All">{t('user_management.placeholders.allClubs')}</option>
            {mockClubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Building2
            size={18}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none"
          />
=======
        <div className="relative">
          <select
            className="appearance-none border rounded-md px-4 py-2 pr-8 bg-white"
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
          >
            <option value="All">All Clubs</option>
            {mockClubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Building2 size={18} className="text-gray-600" />
          </div>
>>>>>>> main
        </div>
      </div>

      <div className="card overflow-auto">
        <table className="table">
          <thead>
            <tr>
<<<<<<< HEAD
              <th>{t('user_management.table.name')}</th>
              <th>{t('user_management.table.email')}</th>
              <th>{t('user_management.table.club')}</th>
              <th>{t('user_management.table.status')}</th>
              <th className="text-right">{t('user_management.table.actions')}</th>
=======
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Club
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
>>>>>>> main
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
<<<<<<< HEAD
                <td colSpan={5} className="text-center py-4">
                  {t('user_management.noResults')}
=======
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found matching your criteria
>>>>>>> main
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center">
                      <div className="avatar mr-4">
                        <Image
                          src={u.avatar || '/faces/default-avatar.jpg'}
                          alt={u.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-sm text-gray-500">
                          <User size={14} className="inline mr-1" />{' '}
                          {t(`user_management.roles.${u.role}`)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Mail size={14} className="inline mr-1 text-gray-400" />
                    {u.email}
                  </td>
<<<<<<< HEAD
                  <td>
                    <Building2 size={14} className="inline mr-1 text-gray-400" />
                    {getClubName(u.clubId)}
                  </td>
                  <td>{getStatusBadge(u.status)}</td>
                  <td className="text-right">
=======
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Building2 size={14} className="mr-1 text-gray-400" />
                      {getClubName(user.clubId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
>>>>>>> main
                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center ml-auto">
                      <Edit size={16} className="mr-1" /> {t('user_management.actions.edit')}
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
