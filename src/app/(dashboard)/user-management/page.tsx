// src/app/(dashboard)/user-management/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Search, Building2, Edit, Mail, User } from 'lucide-react';
import { User as UserType, UserRole, UserStatus, mockClubs } from '@/lib/data/mock-data';

export default function UserManagementPage() {
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
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [activeTab]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClub = clubFilter === 'All' || user.clubId === clubFilter;

    return matchesSearch && matchesClub;
  });

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.Active:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        );
      case UserStatus.Inactive:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Inactive
          </span>
        );
      case UserStatus.Pending:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  // Helper to get club name
  const getClubName = (clubId?: string) => {
    if (!clubId) return 'N/A';
    const club = mockClubs.find((c) => c.id === clubId);
    return club ? club.name : 'Unknown Club';
  };

  const getButtonLabel = () => {
    switch (activeTab) {
      case UserRole.ClubAdmin:
        return 'Add Club Admin';
      case UserRole.ClubStaff:
        return 'Add Club Staff';
      case UserRole.B2BSportAdmin:
        return 'Add B2B Admin';
      default:
        return 'Add User';
    }
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
        <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center">
          <Plus size={18} className="mr-2" /> {getButtonLabel()}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex">
          <button
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === UserRole.ClubAdmin
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(UserRole.ClubAdmin)}
          >
            Club Admins
          </button>
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
              activeTab === UserRole.B2BSportAdmin
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(UserRole.B2BSportAdmin)}
          >
            B2B Admins
          </button>
        </nav>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab !== UserRole.B2BSportAdmin && (
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
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
              {activeTab !== UserRole.B2BSportAdmin && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Club
                </th>
              )}
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={activeTab !== UserRole.B2BSportAdmin ? 5 : 4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No users found matching your criteria
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={user?.avatar || '/faces/default-avatar.jpg'}
                            alt={user?.name || 'User Avatar'}
                            layout="fill"
                            objectFit="cover"
                            priority
                          />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <User size={14} className="mr-1" /> {user.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail size={14} className="mr-1 text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  {activeTab !== UserRole.B2BSportAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Building2 size={14} className="mr-1 text-gray-400" />
                        {getClubName(user.clubId)}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center ml-auto">
                      <Edit size={16} className="mr-1" /> Edit
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
