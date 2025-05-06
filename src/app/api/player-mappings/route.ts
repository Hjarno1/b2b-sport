// src/app/api/player-mappings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockPlayerMappings } from '@/lib/data/mock-data';

export async function GET(request: NextRequest) {
  const agreementId = request.nextUrl.searchParams.get('agreementId');
  const playerId = request.nextUrl.searchParams.get('playerId');

  try {
    let mappings = [...mockPlayerMappings];

    // Filter by agreementId if provided
    if (agreementId) {
      mappings = mappings.filter((mapping) => mapping.agreementId === agreementId);
    }

    // Filter by playerId if provided
    if (playerId) {
      mappings = mappings.filter((mapping) => mapping.playerId === playerId);
    }

    return NextResponse.json(mappings);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
