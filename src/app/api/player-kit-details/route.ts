// src/app/api/player-kit-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getPlayerKitDetailsViewModel,
  getAgreementRoster,
  getAgreementPlayerMappings,
} from '@/lib/data/mock-data';

export async function GET(request: NextRequest) {
  const agreementId = request.nextUrl.searchParams.get('agreementId');
  const requestType = request.nextUrl.searchParams.get('type') || 'details';

  if (!agreementId) {
    return NextResponse.json({ error: 'Agreement ID is required' }, { status: 400 });
  }

  try {
    // Return different data based on the request type
    if (requestType === 'details') {
      const details = getPlayerKitDetailsViewModel(agreementId);
      if (!details) {
        return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
      }
      return NextResponse.json(details);
    } else if (requestType === 'roster') {
      const roster = getAgreementRoster(agreementId);
      return NextResponse.json(roster);
    } else if (requestType === 'mappings') {
      const mappings = getAgreementPlayerMappings(agreementId);
      return NextResponse.json(mappings);
    } else {
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
