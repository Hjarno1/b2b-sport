// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/data/mock-data';

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get('role');
  const clubId = request.nextUrl.searchParams.get('clubId');

  let filteredUsers = [...mockUsers];

  // Filter by role if specified
  if (role) {
    filteredUsers = filteredUsers.filter((user) => user.role === role);
  }

  // Filter by clubId if specified
  if (clubId) {
    filteredUsers = filteredUsers.filter((user) => user.clubId === clubId);
  }

  return NextResponse.json(filteredUsers);
}
