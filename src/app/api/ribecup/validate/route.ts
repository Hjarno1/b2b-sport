import { NextResponse } from 'next/server';
import { winnerCodes } from '@/lib/data/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('code') ?? '';
  const entry = winnerCodes[token];
  return NextResponse.json({
    valid: Boolean(entry),
    used: entry?.used ?? false,
  });
}
