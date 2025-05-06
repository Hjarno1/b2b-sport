// src/app/(dashboard)/player-roster/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Calendar,
  Mail,
  Phone,
  User,
  Save,
  X,
  UserCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/context/auth-context';
import { getClubById, PlayerPosition } from '@/lib/data/mock-data';

// Player interface for roster management
interface Player {
  id: string;
  name: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  position: PlayerPosition;
  joinedDate: string;
  image?: string;
  notes?: string;
  isActive: boolean;
}

export default function PlayerRosterPage() {
  const { user } = useAuth();
  const [roster, setRoster] = useState<Player[]>([]);
  const [filteredRoster, setFilteredRoster] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('All');
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditingPlayer, setIsEditingPlayer] = useState<string | null>(null);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    position: PlayerPosition.Forward,
    joinedDate: new Date().toISOString().split('T')[0],
    isActive: true,
  });

  useEffect(() => {
    // In a real app, we would fetch the roster from an API
    const fetchRoster = async () => {
      try {
        // Fetch player roster for the current club
        const response = await fetch(
          `/api/player-roster${user?.clubId ? `?clubId=${user.clubId}` : ''}`,
        );
        const data = await response.json();
        setRoster(data);
        setFilteredRoster(data);
      } catch (error) {
        console.error('Error fetching roster data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoster();
  }, [user]);

  useEffect(() => {
    // Filter roster when search term or position filter changes
    const filtered = roster.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (player.email && player.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPosition = positionFilter === 'All' || player.position === positionFilter;
      return matchesSearch && matchesPosition;
    });

    setFilteredRoster(filtered);
  }, [searchTerm, positionFilter, roster]);

  const handleAddPlayer = () => {
    // Validate required fields
    if (!newPlayer.name || !newPlayer.dateOfBirth || !newPlayer.position) {
      alert('Please fill in all required fields');
      return;
    }

    // In a real app, you would save to the backend
    const player: Player = {
      id: `player-${Date.now()}`,
      name: newPlayer.name || '',
      dateOfBirth: newPlayer.dateOfBirth || '',
      email: newPlayer.email,
      phone: newPlayer.phone,
      position: newPlayer.position || PlayerPosition.Forward,
      joinedDate: newPlayer.joinedDate || new Date().toISOString().split('T')[0],
      isActive: newPlayer.isActive || true,
      notes: newPlayer.notes,
    };

    setRoster([...roster, player]);
    setIsAddingPlayer(false);
    setNewPlayer({
      name: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      position: PlayerPosition.Forward,
      joinedDate: new Date().toISOString().split('T')[0],
      isActive: true,
    });
  };

  const handleSaveEdit = (playerId: string) => {
    // In a real app, you would save to the backend
    const updatedRoster = roster.map((player) =>
      player.id === playerId ? { ...player, ...newPlayer } : player,
    );

    setRoster(updatedRoster);
    setIsEditingPlayer(null);
  };

  const handleDeletePlayer = (playerId: string) => {
    if (confirm('Are you sure you want to remove this player from the roster?')) {
      // In a real app, you would delete from the backend
      const updatedRoster = roster.filter((player) => player.id !== playerId);
      setRoster(updatedRoster);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Player Roster</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your player list for {clubName}</p>
        </div>

        <button
          onClick={() => setIsAddingPlayer(true)}
          className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Plus size={16} className="mr-2" /> Add Player
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search players..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[150px]">
          <select
            className="appearance-none border rounded-md px-4 py-2 pr-8 bg-white w-full"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="All">All Positions</option>
            {Object.values(PlayerPosition).map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Filter size={18} className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* Add Player Form */}
      {isAddingPlayer && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Add New Player</h2>
            <button
              onClick={() => setIsAddingPlayer(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newPlayer.name || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={newPlayer.dateOfBirth || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, dateOfBirth: e.target.value })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newPlayer.email || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={newPlayer.phone || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="+45 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <select
                value={newPlayer.position || PlayerPosition.Forward}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, position: e.target.value as PlayerPosition })
                }
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select position</option>
                {Object.values(PlayerPosition).map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
              <input
                type="date"
                value={newPlayer.joinedDate || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, joinedDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={newPlayer.notes || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                rows={3}
                placeholder="Additional information about the player"
              ></textarea>
            </div>

            <div className="col-span-full flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={newPlayer.isActive !== false}
                onChange={(e) => setNewPlayer({ ...newPlayer, isActive: e.target.checked })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active player (can be selected for kits)
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsAddingPlayer(false)}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPlayer}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Add Player
            </button>
          </div>
        </div>
      )}

      {/* Roster List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Player Roster</h2>
          <div className="text-sm text-gray-500">
            {filteredRoster.length} player{filteredRoster.length !== 1 ? 's' : ''}
          </div>
        </div>

        {filteredRoster.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <UserCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No players found</h3>
            <p className="text-gray-500">
              {searchTerm || positionFilter !== 'All'
                ? 'Try adjusting your filters.'
                : 'Add players to your roster.'}
            </p>
            {searchTerm === '' && positionFilter === 'All' && (
              <button
                onClick={() => setIsAddingPlayer(true)}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
              >
                <Plus size={16} className="mr-2" /> Add Your First Player
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRoster.map((player) => (
              <div key={player.id} className="p-6">
                {isEditingPlayer === player.id ? (
                  // Edit mode
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newPlayer.name || player.name}
                        onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={newPlayer.dateOfBirth || player.dateOfBirth}
                        onChange={(e) =>
                          setNewPlayer({ ...newPlayer, dateOfBirth: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={newPlayer.email !== undefined ? newPlayer.email : player.email || ''}
                        onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <select
                        value={newPlayer.position || player.position}
                        onChange={(e) =>
                          setNewPlayer({ ...newPlayer, position: e.target.value as PlayerPosition })
                        }
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      >
                        {Object.values(PlayerPosition).map((position) => (
                          <option key={position} value={position}>
                            {position}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex mt-4 md:col-span-2 gap-2">
                      <button
                        onClick={() => {
                          setIsEditingPlayer(null);
                          setNewPlayer({});
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(player.id)}
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                      >
                        <Save size={16} className="mr-2 inline-block" /> Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 mb-4 md:mb-0 flex items-start">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3">
                        {player.image ? (
                          <Image
                            src={player.image}
                            alt={player.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{player.name}</h3>
                        <p className="text-sm text-gray-500">{player.position}</p>
                        {!player.isActive && (
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded mt-1">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="md:w-2/4 mb-4 md:mb-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          Born: {new Date(player.dateOfBirth).toLocaleDateString()}
                        </div>
                        {player.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail size={14} className="mr-2 text-gray-400" />
                            {player.email}
                          </div>
                        )}
                        {player.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone size={14} className="mr-2 text-gray-400" />
                            {player.phone}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          Joined: {new Date(player.joinedDate).toLocaleDateString()}
                        </div>
                      </div>
                      {player.notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {player.notes}
                        </p>
                      )}
                    </div>

                    <div className="md:w-1/4 flex justify-end items-start space-x-2">
                      <button
                        onClick={() => {
                          setIsEditingPlayer(player.id);
                          setNewPlayer({});
                        }}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                        aria-label="Edit player"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                        aria-label="Delete player"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Tips for Managing Your Roster</h2>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
              1
            </span>
            <div>Keep your player list up-to-date to make kit setup easier.</div>
          </div>
          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
              2
            </span>
            <div>
              Set inactive players who are no longer with the club to avoid selecting them for kits.
            </div>
          </div>
          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
              3
            </span>
            <div>Include contact details for players to help with kit delivery confirmation.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
