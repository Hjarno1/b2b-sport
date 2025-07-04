// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/data/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = mockUsers.find((u) => u.email === email && u.password === password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
