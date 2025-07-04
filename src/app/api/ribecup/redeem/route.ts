import { NextResponse } from 'next/server';
import { winnerCodes } from '@/lib/data/mock-data';

export async function POST(request: Request) {
  const body = await request.json();
  const { code, productId, clubName, firstName, lastName, printName } = body;
  const entry = winnerCodes[code];
  if (!entry || entry.used) {
    return NextResponse.json(
      { success: false, message: 'Invalid or already used code' },
      { status: 400 },
    );
  }
  // Mark as used and store redemption data
  entry.used = true;
  entry.redeemed = {
    token: code,
    productId,
    clubName,
    firstName,
    lastName,
    printName,
    date: new Date().toISOString(),
  };
  return NextResponse.json({ success: true });
}
