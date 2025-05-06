// src/app/api/kit-setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  mockKitRequests,
  mockTeamViewModels,
  getClubKitRequests,
  getClubTeamViewModels,
} from '@/lib/data/mock-data';

export async function GET(request: NextRequest) {
  const clubId = request.nextUrl.searchParams.get('clubId');
  const view = request.nextUrl.searchParams.get('view') || 'requests'; // "requests" or "teams"

  try {
    if (view === 'requests') {
      // Return kit requests (agreements with user-friendly data)
      if (clubId) {
        return NextResponse.json(getClubKitRequests(clubId));
      } else {
        return NextResponse.json(mockKitRequests);
      }
    } else if (view === 'teams') {
      // Return teams view data
      if (clubId) {
        return NextResponse.json(getClubTeamViewModels(clubId));
      } else {
        return NextResponse.json(mockTeamViewModels);
      }
    } else {
      return NextResponse.json({ error: 'Invalid view parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
