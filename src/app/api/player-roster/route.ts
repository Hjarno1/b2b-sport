// src/app/api/player-roster/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockPlayers, PlayerPosition } from '@/lib/data/mock-data';

export async function GET(request: NextRequest) {
  const clubId = request.nextUrl.searchParams.get('clubId');
  const teamId = request.nextUrl.searchParams.get('teamId');
  const playerId = request.nextUrl.searchParams.get('playerId');
  const position = request.nextUrl.searchParams.get('position');

  try {
    let players = [...mockPlayers];

    // Filter by playerId if provided
    if (playerId) {
      players = players.filter((player) => player.id === playerId);
    }

    // Filter by clubId if provided
    if (clubId) {
      players = players.filter((player) => player.clubId === clubId);
    }

    // Filter by teamId if provided
    if (teamId) {
      players = players.filter((player) => player.teamId === teamId);
    }

    // Filter by position if provided
    if (position && Object.values(PlayerPosition).includes(position as PlayerPosition)) {
      players = players.filter((player) => player.position === position);
    }

    return NextResponse.json(players);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // In a real app, we would validate the data and save to database
    // For demo, we'll just return success

    return NextResponse.json({
      success: true,
      message: 'Player added successfully',
      player: {
        id: `player-${Date.now()}`,
        ...data,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const playerId = data.id;

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    // In a real app, we would update the player in the database
    // For demo, we'll just return success

    return NextResponse.json({
      success: true,
      message: 'Player updated successfully',
      player: data,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const playerId = request.nextUrl.searchParams.get('playerId');

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
  }

  try {
    // In a real app, we would delete the player from the database
    // For demo, we'll just return success

    return NextResponse.json({
      success: true,
      message: 'Player deleted successfully',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
