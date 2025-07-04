// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function POST(req: NextRequest) {
//   try {
//     const order = await req.json();

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ orders: [] });
}

//     /* Run EVERYTHING atomically so a size-lookup failure rolls the header back */
//     const created = await prisma.$transaction(async (tx) => {
//       /* 1️⃣  Header row ------------------------------------------------ */
//       const header = await tx.requests.create({
//         data: {
//           RequestDate: new Date(),
//           TrustPilot: false,
//           LegalAction: false,
//           CustomerId: order.customerId ?? null,
//           ExpressDelivery: false,
//           ExpressProduction: false,
//           OrderStatus: 0,
//         },
//       });

//       /* 2️⃣  Products and nested size rows ---------------------------- */
//       for (const p of order.products) {
//         /* -- real size PK --------------------------------------------- */
//         const sizeRow = await tx.b2BProductTextileSizes.findFirst({
//           where: { Name: p.size }, // ← **rename label → Name**
//           select: { Id: true },
//         });

//         await tx.requestProducts.create({
//           data: {
//             RequestId: header.Id,
//             Price: p.price,
//             Volume: p.quantity,
//             OrderDate: new Date(),
//             Comment: 'TEST - B2B Sport ',

//             RequestProductB2BTextileSizes: {
//               create: [
//                 {
//                   TextileSizeId: sizeRow?.Id, // undefined == NULL if not found
//                   Quantity: p.quantity ?? 1,
//                   CreationDate: new Date(),
//                   ModifiedDate: new Date(),
//                 },
//               ],
//             },
//           },
//         });
//       }

//       return header; // we could also gather product rows if the UI needs them
//     });

//     return NextResponse.json({ message: 'Order received', order }, { status: 201 });
//   } catch (err) {
//     console.error('POST /api/orders →', err);
//     return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
//   }
// }
