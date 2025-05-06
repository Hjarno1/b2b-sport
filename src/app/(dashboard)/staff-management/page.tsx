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

export default function StaffManagementPage() {
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // In a real app, we'd fetch only the staff for the current user's club
    const fetchStaff = async () => {
      try {
        const response = await fetch(`/api/users?role=${UserRole.ClubStaff}`);
        let data = await response.json();

        // Filter staff members for the current admin's club
        if (user && user.clubId) {
          data = data.filter((staff: UserType) => staff.clubId === user.clubId);
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

  // Filter staff members based on search term
  const filteredStaff = staffMembers.filter((member) => {
    return (
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.Active:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <UserCheck size={12} className="mr-1" /> Active
          </span>
        );
      case UserStatus.Inactive:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <UserX size={12} className="mr-1" /> Inactive
          </span>
        );
      case UserStatus.Pending:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <CalendarClock size={12} className="mr-1" /> Pending
          </span>
        );
      default:
        return null;
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
          <h1 className="text-2xl font-semibold text-gray-800">Staff Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your staff members at {clubName}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Plus size={16} className="mr-2" /> Add Staff Member
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
            placeholder="Search staff by name or email..."
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
          <h3 className="text-lg font-medium text-gray-900 mb-1">No staff members found</h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchTerm ? 'Try adjusting your search' : "You haven't added any staff members yet"}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus size={16} className="mr-2" /> Add Your First Staff Member
          </button>
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
                  Staff Member
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Login
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
                        <div className="text-xs text-gray-500">{member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail size={14} className="text-gray-400 mr-1" /> {member.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Phone size={14} className="text-gray-400 mr-1" /> +45 12 34 56 78
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(member.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.lastLogin || 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit size={16} />
                      </button>
                      {member.status === UserStatus.Active ? (
                        <button className="text-red-600 hover:text-red-900">
                          <X size={16} />
                        </button>
                      ) : (
                        <button className="text-green-600 hover:text-green-900">
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

      {/* Add Staff Modal - In a real implementation, we would create a proper modal component */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Staff Member</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Enter staff member's name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to Team
                  </label>
                  <select
                    id="team"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select a team</option>
                    <option value="team1">First Team</option>
                    <option value="team2">Youth Team</option>
                    <option value="team3">Womens Team</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // In a real app, we would save the new staff member here
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  Add Staff Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
