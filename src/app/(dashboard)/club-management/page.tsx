// src/app/(dashboard)/club-management/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  MoreHorizontal,
} from 'lucide-react';
import Image from 'next/image';
import { Club, ClubStatus } from '@/lib/data/mock-data';

export default function ClubManagementPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('/api/clubs');
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          <h1 className="text-2xl font-semibold text-gray-800">Club Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your sports clubs and their admins</p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Plus size={16} className="mr-2" /> Add Club
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search clubs by name..."
              className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="inline-flex">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white rounded-md text-sm text-gray-700 hover:bg-gray-50">
              <Filter size={16} className="mr-2 text-gray-500" /> Filter
              <svg
                className="ml-2 h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No clubs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
}

function ClubCard({ club }: { club: Club }) {
  const getStatusConfig = (status: ClubStatus) => {
    switch (status) {
      case ClubStatus.Active:
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          icon: <CheckCircle size={14} className="text-green-500 mr-1.5" />,
        };
      case ClubStatus.Inactive:
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          icon: <XCircle size={14} className="text-red-500 mr-1.5" />,
        };
      case ClubStatus.Setup:
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          icon: <Clock size={14} className="text-amber-500 mr-1.5" />,
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          icon: null,
        };
    }
  };

  const statusConfig = getStatusConfig(club.status);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center">
          <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden mr-4">
            {club.logo ? (
              <div className="relative w-full h-full">
                <Image src={club.logo} alt={club.name} layout="fill" objectFit="cover" />
              </div>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white"
                style={{ backgroundColor: club.color }}
              >
                {club.abbreviation}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">{club.name}</h3>
            <p className="text-sm text-gray-500">Created: {club.createdAt}</p>
          </div>
          <div className="ml-4">
            <button className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="flex items-center">
                <Users size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Club Admin: </span>
                <span className="text-sm font-medium text-gray-900 ml-1">
                  {club.adminId ? 'Assigned' : 'Pending'}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <FileText size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Active Agreements:</span>
                <span className="text-sm font-medium text-gray-900 ml-1">
                  {club.activeAgreements}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <Users size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Staff:</span>
                <span className="text-sm font-medium text-gray-900 ml-1">{club.staffCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
        <div
          className={`flex items-center ${statusConfig.bg} ${statusConfig.text} py-1 px-2.5 rounded-full text-xs font-medium`}
        >
          {statusConfig.icon}
          {club.status}
        </div>

        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Manage
        </button>
      </div>
    </div>
  );
}
