'use client';

import { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, ChevronRight, Users } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';

// Team Type for simplified view
interface Team {
  id: string;
  name: string;
  playerCount: number;
  kitRequestCount: number;
  pendingCount: number;
}

export default function TeamsSetupPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(
          `/api/kit-setup?view=teams${user?.clubId ? `&clubId=${user.clubId}` : ''}`,
        );
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, [user]);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Teams Setup</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage kit requests per team</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search teams..."
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-primary focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No Teams Found</h2>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search' : 'There are no teams to display.'}
            </p>
          </div>
        ) : (
          filteredTeams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-500">{team.playerCount} Players</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Kit Requests:</span>
                    <span className="font-medium text-gray-900">{team.kitRequestCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Tasks:</span>
                    <span className="font-medium text-gray-900">{team.pendingCount}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {team.pendingCount > 0 ? (
                    <span className="flex items-center text-yellow-600">
                      <AlertTriangle size={14} className="mr-1.5" />
                      {team.pendingCount} pending {team.pendingCount === 1 ? 'task' : 'tasks'}
                    </span>
                  ) : (
                    <span className="flex items-center text-green-600">
                      <CheckCircle size={14} className="mr-1.5" /> All tasks complete
                    </span>
                  )}
                </div>

                <Link
                  href="/player-roster"
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
                >
                  View Players
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
