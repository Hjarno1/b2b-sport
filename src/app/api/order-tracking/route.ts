// src/app/api/order-tracking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getClubOrderViewModels, getOrderViewModel } from '@/lib/data/mock-data';

export async function GET(request: NextRequest) {
  const clubId = request.nextUrl.searchParams.get('clubId');
  const orderId = request.nextUrl.searchParams.get('orderId');

  try {
    // If orderId is provided, return specific order details
    if (orderId) {
      const order = getOrderViewModel(orderId);
      if (order) {
        return NextResponse.json(order);
      } else {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
    }

    // Otherwise return orders for the club
    if (clubId) {
      return NextResponse.json(getClubOrderViewModels(clubId));
    } else {
      // In a real app, we'd restrict this to admins only
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
