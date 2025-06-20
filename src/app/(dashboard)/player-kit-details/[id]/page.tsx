// src/app/(dashboard)/player-kit-details/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Search,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  X,
  Check,
  Users,
  ShoppingBag,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { getClubById, AgreementStatus } from '@/lib/data/mock-data';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

// Player from roster
interface Player {
  id: string;
  name: string;
  position: string;
  isActive: boolean;
  image?: string;
}

// Agreement field definition (defined by B2B admin in the agreement template)
interface AgreementField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[];
  description?: string;
}

// Player mapping for an agreement
interface PlayerMapping {
  playerId: string;
  values: Record<string, string>; // field id -> value
  isComplete: boolean;
}

// Agreement details with template fields
interface AgreementDetails {
  id: string;
  name: string;
  clubId: string;
  teamId: string;
  teamName: string;
  status: AgreementStatus;
  validUntil: string;
  dueDate: string;
  fields: AgreementField[];
  playerMappings: PlayerMapping[];
}

export default function PlayerKitDetailsPage() {
  const { t } = useTranslation('player_kit_details');
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [agreementDetails, setAgreementDetails] = useState<AgreementDetails | null>(null);
  const [roster, setRoster] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [playerMappings, setPlayerMappings] = useState<Record<string, PlayerMapping>>({});
  const [expandedPlayers, setExpandedPlayers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Get the agreement ID from the URL
  const agreementId = params?.id as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailsResponse = await fetch(
          `/api/player-kit-details?agreementId=${agreementId}&type=details`,
        );
        if (!detailsResponse.ok) {
          throw new Error('Failed to fetch agreement details');
        }
        const detailsData = await detailsResponse.json();

        const rosterResponse = await fetch(
          `/api/player-kit-details?agreementId=${agreementId}&type=roster`,
        );
        const rosterData = await rosterResponse.json();

        const mappings = detailsData.playerMappings || [];
        const mappingsRecord: Record<string, PlayerMapping> = {};
        const selected: string[] = [];

        mappings.forEach((mapping: PlayerMapping) => {
          mappingsRecord[mapping.playerId] = mapping;
          selected.push(mapping.playerId);
        });

        setAgreementDetails(detailsData);
        setRoster(rosterData);
        setSelectedPlayers(selected);
        setPlayerMappings(mappingsRecord);

        const incompleteMapping = mappings.find(
          (m: PlayerMapping) => !isPlayerMappingComplete(m, detailsData.fields),
        );
        if (incompleteMapping) {
          setExpandedPlayers([incompleteMapping.playerId]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [agreementId]);

  // Filter roster by search term
  const filteredRoster = roster.filter(
    (player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()) && player.isActive,
  );

  const handleInvitePlayer = (playerId: string) => {
    const token = uuidv4();
    const playerData = {
      playerId,
      fields: agreementDetails?.fields,
      agreementId: agreementDetails?.id,
    };
    const invites = JSON.parse(localStorage.getItem('playerInvites') || '{}');
    invites[token] = playerData;
    localStorage.setItem('playerInvites', JSON.stringify(invites));

    const inviteUrl = `${window.location.origin}/player-kit-details-invite/${token}`;
    navigator.clipboard.writeText(inviteUrl);
    alert(t('invite_alert', { url: inviteUrl }));
  };

  // Function to check if a player mapping is complete
  const isPlayerMappingComplete = (
    mapping: PlayerMapping,
    fields: AgreementField[] | undefined,
  ): boolean => {
    if (!Array.isArray(fields) || fields.length === 0) {
      return true;
    }
    for (const field of fields) {
      if (field.required && (!mapping.values[field.id] || mapping.values[field.id].trim() === '')) {
        return false;
      }
    }
    return true;
  };

  // Toggle player selection
  const togglePlayerSelection = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
      const newMappings = { ...playerMappings };
      delete newMappings[playerId];
      setPlayerMappings(newMappings);
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
      if (!playerMappings[playerId]) {
        setPlayerMappings({
          ...playerMappings,
          [playerId]: { playerId, values: {}, isComplete: false },
        });
      }
      if (!expandedPlayers.includes(playerId)) {
        setExpandedPlayers([...expandedPlayers, playerId]);
      }
    }
  };

  // Toggle player expansion
  const togglePlayerExpansion = (playerId: string) => {
    if (expandedPlayers.includes(playerId)) {
      setExpandedPlayers(expandedPlayers.filter((id) => id !== playerId));
    } else {
      setExpandedPlayers([...expandedPlayers, playerId]);
    }
  };

  // Update player mapping
  const updatePlayerMapping = (playerId: string, fieldId: string, value: string) => {
    const mapping = playerMappings[playerId];
    if (!mapping) return;

    const updatedMapping: PlayerMapping = {
      ...mapping,
      values: { ...mapping.values, [fieldId]: value },
    };
    updatedMapping.isComplete = isPlayerMappingComplete(
      updatedMapping,
      agreementDetails?.fields || [],
    );
    setPlayerMappings({ ...playerMappings, [playerId]: updatedMapping });
  };

  // Save player mappings
  const savePlayerMappings = async () => {
    setSaveStatus('saving');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mappingsArray = Object.values(playerMappings);
      if (agreementDetails) {
        setAgreementDetails({ ...agreementDetails, playerMappings: mappingsArray });
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Submit completed mappings and create order
  const submitMappings = async () => {
    const allComplete = selectedPlayers.every((playerId) => playerMappings[playerId]?.isComplete);
    if (!allComplete && !confirm(t('confirm_submit'))) return;
    alert(t('kit_details_summary.all_complete'));
    router.push('/order-tracking');
  };

  // Calculate completion percentage
  const calculateCompletionPercentage = (): number => {
    if (selectedPlayers.length === 0) return 0;
    const completeCount = selectedPlayers.filter((id) => playerMappings[id]?.isComplete).length;
    return Math.round((completeCount / selectedPlayers.length) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();
  const clubName = user?.clubId ? getClubById(user.clubId)?.name : 'Your Club';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!agreementDetails) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {t('player_kit_details.agreement_not_found.title')}
        </h1>
        <p className="text-gray-500 mb-6">{t('player_kit_details.agreement_not_found.desc')}</p>
        <Link
          href="/kit-setup"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <ArrowLeft size={16} className="mr-2" />{' '}
          {t('player_kit_details.agreement_not_found.back')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/kit-setup"
          className="inline-flex items-center text-primary hover:underline mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> {t('player_kit_details.back')}
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {t('player_kit_details.title', { name: agreementDetails.name })}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {t('player_kit_details.subtitle', { club: clubName })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {t('player_kit_details.due', { date: agreementDetails.dueDate })}
            </div>

            <div className="relative h-8 w-32 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {t('player_kit_details.completion', { pct: completionPercentage })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Agreement and player selection */}
        <div>
          {/* Agreement Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              {t('player_kit_details.agreement_summary.heading')}
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">
                  {t('player_kit_details.agreement_summary.id')}
                </div>
                <div className="font-medium">{agreementDetails.id}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  {t('player_kit_details.agreement_summary.team')}
                </div>
                <div className="font-medium">{agreementDetails.teamName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  {t('player_kit_details.agreement_summary.status')}
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {agreementDetails.status}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  {t('player_kit_details.agreement_summary.valid_until')}
                </div>
                <div className="font-medium">{agreementDetails.validUntil}</div>
              </div>
            </div>
          </div>

          {/* Player Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                {t('player_kit_details.select_players.heading')}
              </h2>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('player_kit_details.select_players.search_placeholder')}
                  className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-primary focus:border-primary text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-500 mb-2">
                {t('player_kit_details.select_players.selected', { count: selectedPlayers.length })}
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {filteredRoster.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="text-lg font-semibold mb-2">
                    {t('player_kit_details.no_players_selected.title')}
                  </div>
                  <div>{t('no_players_selected.desc')}</div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredRoster.map((player) => (
                    <div key={player.id} className="p-4 flex items-center">
                      <input
                        type="checkbox"
                        id={`select-${player.id}`}
                        checked={selectedPlayers.includes(player.id)}
                        onChange={() => togglePlayerSelection(player.id)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`select-${player.id}`}
                        className="ml-3 flex items-center cursor-pointer flex-1"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3">
                          {player.image ? (
                            <Image
                              src={player.image}
                              alt={player.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                              <Users size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{player.name}</div>
                          <div className="text-xs text-gray-500">{player.position}</div>
                        </div>
                      </label>
                      {selectedPlayers.includes(player.id) && (
                        <div className="ml-2">
                          {playerMappings[player.id]?.isComplete ? (
                            <CheckCircle2 size={16} className="text-green-500" />
                          ) : (
                            <AlertTriangle size={16} className="text-yellow-500" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Player details */}
        <div className="lg:col-span-2">
          {selectedPlayers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {t('no_players_selected.title')}
              </h2>
              <p className="text-gray-500 mb-4">{t('no_players_selected.desc')}</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">
                    {t('player_kit_details.player_details.heading')}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('player_kit_details.player_details.desc')}
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {selectedPlayers.map((playerId) => {
                    const player = roster.find((p) => p.id === playerId);
                    if (!player) return null;

                    const mapping = playerMappings[playerId] || {
                      playerId,
                      values: {},
                      isComplete: false,
                    };
                    const isExpanded = expandedPlayers.includes(playerId);

                    return (
                      <div key={playerId} className="p-6">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => togglePlayerExpansion(playerId)}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                              {player.image ? (
                                <Image
                                  src={player.image}
                                  alt={player.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                                  <Users size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{player.name}</div>
                              <div className="text-sm text-gray-500">{player.position}</div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            {mapping.isComplete ? (
                              <span className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle2 size={12} className="mr-1" />{' '}
                                {t('player_kit_details.player_details.complete')}
                              </span>
                            ) : (
                              <span className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <AlertTriangle size={12} className="mr-1" />{' '}
                                {t('player_kit_details.player_details.incomplete')}
                              </span>
                            )}

                            {isExpanded ? (
                              <ChevronDown size={20} className="text-gray-400" />
                            ) : (
                              <ChevronRight size={20} className="text-gray-400" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            {agreementDetails.fields.map((field) => (
                              <div key={field.id}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {field.name}{' '}
                                  {field.required && <span className="text-red-500">*</span>}
                                </label>

                                {field.type === 'select' ? (
                                  <select
                                    value={mapping.values[field.id] || ''}
                                    onChange={(e) =>
                                      updatePlayerMapping(playerId, field.id, e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                  >
                                    <option value="">
                                      {t('player_kit_details.select_players.search_placeholder')}
                                    </option>
                                    {field.options?.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                ) : field.type === 'number' ? (
                                  <input
                                    type="number"
                                    value={mapping.values[field.id] || ''}
                                    onChange={(e) =>
                                      updatePlayerMapping(playerId, field.id, e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    placeholder={field.description}
                                    min="1"
                                    max="99"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={mapping.values[field.id] || ''}
                                    onChange={(e) =>
                                      updatePlayerMapping(playerId, field.id, e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    placeholder={field.description}
                                  />
                                )}

                                {field.description && (
                                  <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                                )}
                              </div>
                            ))}
                            {/* 🚀 Invite Player Button */}
                            <div className="md:col-span-2 flex justify-end mt-4">
                              <button
                                onClick={() => handleInvitePlayer(playerId)}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition"
                              >
                                ✉️ {t('player_kit_details.buttons.invite')}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">
                      {t('player_kit_details.kit_details_summary.heading')}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {completionPercentage === 100
                        ? t('player_kit_details.kit_details_summary.all_complete')
                        : t('player_kit_details.kit_details_summary.still_need', {
                            count:
                              selectedPlayers.length -
                              selectedPlayers.filter((id) => playerMappings[id]?.isComplete).length,
                          })}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={savePlayerMappings}
                      disabled={saveStatus === 'saving'}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      {saveStatus === 'saving' && t('player_kit_details.buttons.saving')}
                      {saveStatus === 'saved' && (
                        <>
                          <Check size={16} className="mr-2 text-green-500" />
                          {t('player_kit_details.buttons.saved')}
                        </>
                      )}
                      {saveStatus === 'error' && (
                        <>
                          <X size={16} className="mr-2 text-red-500" />
                          {t('player_kit_details.buttons.error')}
                        </>
                      )}
                      {saveStatus === 'idle' && t('buttons.save_progress')}
                    </button>

                    <button
                      onClick={submitMappings}
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      <ShoppingBag size={16} className="mr-2" />
                      {t('player_kit_details.buttons.submit')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  {t('player_kit_details.instructions.heading')}
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>{t('player_kit_details.instructions.step1')}</li>
                  <li>{t('player_kit_details.instructions.step2')}</li>
                  <li>{t('player_kit_details.instructions.step3')}</li>
                  <li>{t('player_kit_details.instructions.step4')}</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
