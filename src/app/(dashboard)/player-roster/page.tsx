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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('player_roster');
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
    position: PlayerPosition.Markspiller,
    joinedDate: new Date().toISOString().split('T')[0],
    isActive: true,
  });

  useEffect(() => {
    const fetchRoster = async () => {
      try {
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
    if (!newPlayer.name || !newPlayer.dateOfBirth || !newPlayer.position) {
      alert(t('please_fill_required'));
      return;
    }
    const player: Player = {
      id: `player-${Date.now()}`,
      name: newPlayer.name || '',
      dateOfBirth: newPlayer.dateOfBirth || '',
      email: newPlayer.email,
      phone: newPlayer.phone,
      position: newPlayer.position || PlayerPosition.Markspiller,
      joinedDate: newPlayer.joinedDate || new Date().toISOString().split('T')[0],
      isActive: newPlayer.isActive ?? true,
      notes: newPlayer.notes,
    };
    setRoster([...roster, player]);
    setIsAddingPlayer(false);
    setNewPlayer({
      name: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      position: PlayerPosition.Markspiller,
      joinedDate: new Date().toISOString().split('T')[0],
      isActive: true,
    });
  };

  const handleSaveEdit = (playerId: string) => {
    const updatedRoster = roster.map((player) =>
      player.id === playerId ? { ...player, ...newPlayer } : player,
    );
    setRoster(updatedRoster);
    setIsEditingPlayer(null);
  };

  const handleDeletePlayer = (playerId: string) => {
    if (!confirm(t('confirm_delete'))) return;
    const updatedRoster = roster.filter((player) => player.id !== playerId);
    setRoster(updatedRoster);
  };

  const clubName = user?.clubId ? getClubById(user.clubId)?.name : t('default_club');

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
          <h1 className="text-2xl font-semibold text-gray-800">{t('player_roster.pageTitle')}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {t('player_roster.pageSubtitle', { club: clubName })}
          </p>
        </div>

        <button
          onClick={() => setIsAddingPlayer(true)}
          className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Plus size={16} className="mr-2" /> {t('player_roster.addButton')}
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
            placeholder={t('player_roster.searchPlaceholder')}
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
            <option value="All">{t('player_roster.positionFilterAll')}</option>
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
            <h2 className="text-lg font-medium text-gray-800">{t('player_roster.addFormTitle')}</h2>
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
                {t('player_roster.labelName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newPlayer.name || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder={t('player_roster.labelName')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('player_roster.labelDOB')} <span className="text-red-500">*</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('player_roster.labelEmail')}
              </label>
              <input
                type="email"
                value={newPlayer.email || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('player_roster.labelPhone')}
              </label>
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
                {t('player_roster.labelPosition')} <span className="text-red-500">*</span>
              </label>
              <select
                value={newPlayer.position || PlayerPosition.Markspiller}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, position: e.target.value as PlayerPosition })
                }
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                required
              >
                <option value="">{t('player_roster.positionPlaceholder')}</option>
                {Object.values(PlayerPosition).map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('player_roster.labelJoinedDate')}
              </label>
              <input
                type="date"
                value={newPlayer.joinedDate || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, joinedDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('player_roster.labelNotes')}
              </label>
              <textarea
                value={newPlayer.notes || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                rows={3}
                placeholder={t('player_roster.labelNotes')}
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
                {t('player_roster.labelActive')}
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsAddingPlayer(false)}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {t('player_roster.buttonCancel')}
            </button>
            <button
              onClick={handleAddPlayer}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
            >
              {t('player_roster.buttonAddPlayer')}
            </button>
          </div>
        </div>
      )}

      {/* Roster List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">{t('player_roster.pageTitle')}</h2>
          <div className="text-sm text-gray-500">
            {t('player_roster.rosterCount', { count: filteredRoster.length })}
          </div>
        </div>

        {filteredRoster.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <UserCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {t('player_roster.noPlayersFoundTitle')}
            </h3>
            <p className="text-gray-500">
              {searchTerm || positionFilter !== 'All'
                ? t('noPlayersFoundDescFiltered')
                : t('noPlayersFoundDescEmpty')}
            </p>
            {searchTerm === '' && positionFilter === 'All' && (
              <button
                onClick={() => setIsAddingPlayer(true)}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
              >
                <Plus size={16} className="mr-2" /> {t('player_roster.addFirstPlayer')}
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRoster.map((player) => (
              <div key={player.id} className="p-6">
                {isEditingPlayer === player.id ? (
                  /* Edit mode (unchanged) */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ... */}
                    <div className="flex mt-4 md:col-span-2 gap-2">
                      <button
                        onClick={() => {
                          setIsEditingPlayer(null);
                          setNewPlayer({});
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        {t('player_roster.buttonCancel')}
                      </button>
                      <button
                        onClick={() => handleSaveEdit(player.id)}
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                      >
                        <Save size={16} className="mr-2 inline-block" />{' '}
                        {t('player_roster.buttonSave')}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 mb-4 md:mb-0 flex items-start">{/* avatar */}</div>

                    <div className="md:w-2/4 mb-4 md:mb-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          {t('player_roster.viewBirth', {
                            date: new Date(player.dateOfBirth).toLocaleDateString(),
                          })}
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
                          {t('player_roster.viewJoined', {
                            date: new Date(player.joinedDate).toLocaleDateString(),
                          })}
                        </div>
                      </div>
                      {player.notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">{t('player_roster.notesLabel')}:</span>{' '}
                          {player.notes}
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
                        aria-label={t('player_roster.editAria')}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                        aria-label={t('player_roster.deleteAria')}
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
        <h2 className="text-lg font-medium text-gray-800 mb-4">{t('player_roster.tipsHeading')}</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
              1
            </span>
            <div>{t('player_roster.tip1')}</div>
          </div>
          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
              2
            </span>
            <div>{t('player_roster.tip2')}</div>
          </div>
          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
              3
            </span>
            <div>{t('player_roster.tip3')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
