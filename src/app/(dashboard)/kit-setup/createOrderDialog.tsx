'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  AgreementStatus,
  mockPlayers,
  mockAgreementFields,
  mockProducts,
} from '@/lib/data/mock-data';

interface TeamOption {
  id: string;
  name: string;
}

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: TeamOption[];
}

export default function CreateOrderDialog({ open, onOpenChange, teams }: CreateOrderDialogProps) {
  const [agreementId] = useState(() => `agr-${Date.now()}`);
  const [teamId, setTeamId] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [playerKitData, setPlayerKitData] = useState<Record<string, any>>({});

  const teamPlayers = useMemo(
    () => mockPlayers.filter((p) => p.teamId === 'team-001'),
    ['team-001'],
  );

  const shirtSizes = mockAgreementFields.find((f) => f.id === 'jersey-size')?.options || [];
  const shortsSizes = mockAgreementFields.find((f) => f.id === 'shorts-size')?.options || [];

  const additionalProductOptions = mockProducts.filter(
    (p) => !['Handball Shirt', 'Handball Shorts'].includes(p.name),
  );

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId],
    );
  };

  const updatePlayerKitField = (playerId: string, field: string, value: any) => {
    setPlayerKitData((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value },
    }));
  };

  const toggleAdditionalProduct = (playerId: string, productId: number) => {
    const current = playerKitData[playerId]?.additionalProducts ?? [];
    const updated = current.includes(productId)
      ? current.filter((id: number) => id !== productId)
      : [...current, productId];

    updatePlayerKitField(playerId, 'additionalProducts', updated);
  };

  const handleCreate = () => {
    const payload = {
      agreementId,
      status: AgreementStatus.Active,
      validUntil,
      teamId,
      players: selectedPlayerIds.map((id) => ({
        playerId: id,
        ...playerKitData[id],
      })),
    };
    console.log('CREATE ORDER PAYLOAD', payload);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Create Order</h2>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Agreement ID</label>
            <input className="border p-2 w-full" value={agreementId} readOnly />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Team</label>
            <select
              className="border p-2 w-full"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            >
              <option value="">Select team…</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <input className="border p-2 w-full bg-gray-100" value="Active" readOnly />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valid Until</label>
            <input
              type="date"
              className="border p-2 w-full"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>
        </div>

        {/* Players Section */}
        {teamId && (
          <div className="border rounded p-4 max-h-64 overflow-y-auto space-y-4 mb-6">
            {teamPlayers.length === 0 && (
              <p className="text-sm text-gray-500">No players found for this team.</p>
            )}
            {teamPlayers.map((player) => (
              <div key={player.id} className="border rounded p-2">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedPlayerIds.includes(player.id)}
                    onChange={() => togglePlayerSelection(player.id)}
                  />
                  {player.image && (
                    <Image
                      src={player.image}
                      alt={player.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span>{player.name}</span>
                </label>

                {selectedPlayerIds.includes(player.id) && (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2">
                    <input
                      placeholder="Kit #"
                      className="border p-2"
                      onChange={(e) =>
                        updatePlayerKitField(player.id, 'jerseyNumber', e.target.value)
                      }
                    />
                    <input
                      placeholder="Name on kit"
                      className="border p-2"
                      onChange={(e) =>
                        updatePlayerKitField(player.id, 'jerseyName', e.target.value)
                      }
                    />
                    <select
                      className="border p-2"
                      onChange={(e) => updatePlayerKitField(player.id, 'shirtSize', e.target.value)}
                    >
                      <option value="">Shirt size</option>
                      {shirtSizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <select
                      className="border p-2"
                      onChange={(e) =>
                        updatePlayerKitField(player.id, 'shortsSize', e.target.value)
                      }
                    >
                      <option value="">Shorts size</option>
                      {shortsSizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <div className="border p-2 rounded bg-gray-50 text-sm">
                      <label className="block mb-1 font-medium text-gray-700">Add-ons</label>
                      <div className="space-y-1 max-h-28 overflow-y-auto">
                        {additionalProductOptions.map((product) => (
                          <label key={product.id} className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={
                                playerKitData[player.id]?.additionalProducts?.includes(
                                  product.id,
                                ) ?? false
                              }
                              onChange={() => toggleAdditionalProduct(player.id, product.id)}
                            />
                            {product.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            onClick={handleCreate}
            disabled={!teamId || !validUntil || selectedPlayerIds.length === 0}
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}
