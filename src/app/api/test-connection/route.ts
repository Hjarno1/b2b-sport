import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const client = await pool;
    // a trivial query to confirm connectivity
    const result = await client.request().query('SELECT 1 AS ok');
    return NextResponse.json({
      status: 'ok',
      row: result.recordset[0],
    });
  } catch (err) {
    console.error('Connection test failed:', err);
    return NextResponse.json({ status: 'error', message: (err as Error).message }, { status: 500 });
  }
}
