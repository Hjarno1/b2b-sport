// // src/app/api/products/route.ts
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import type { Product } from '@/types/product';

// export const runtime = 'nodejs';

export async function GET() {
  return new Response(JSON.stringify({ message: 'Temporary response' }), {
    status: 200,
  });
}

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const skuPrefix = searchParams.get('skuPrefix') || 'B2B';
//   const page = parseInt(searchParams.get('page') || '1', 10);
//   const limit = parseInt(searchParams.get('limit') || '20', 10);
//   const offset = (page - 1) * limit;

//   // 1) fetch your rows—TS knows the return type
//   //add type to rows cannot be ANY
//   const rows = await prisma.b2BParrentProducts.findMany({
//     where: { parrentProduct_parrentSku: { startsWith: skuPrefix } },
//     include: {
//       B2BProductPrices: {
//         take: 1,
//       },
//       ParentProductB2BProductTextileSizes: {
//         include: { B2BProductTextileSizes: true },
//       },
//     },
//     skip: offset,
//     take: limit,
//   });

//   // 2) alias the row type for clarity
//   type Row = (typeof rows)[number];
//   type SizeRel = Row['ParentProductB2BProductTextileSizes'][number];
//   type PriceRel = Row['B2BProductPrices'][number];

//   // 3) map into your UI Product[]
//   const data: Product[] = rows.map(
//     (r: Row): Product => ({
//       id: r.parrentProduct_id,
//       parrentSku: r.parrentProduct_parrentSku ?? '',
//       name: r.parrentProduct_productName ?? '',
//       shortDescription: r.parrentProduct_shortDescription ?? '',
//       longDescription: r.parrentProduct_longDescription ?? '',
//       width: r.parrentProduct_width ?? undefined,
//       height: r.parrentProduct_height ?? undefined,
//       length: r.parrentProduct_length ?? undefined,
//       material: r.parrentProduct_material ?? undefined,
//       seoUrl: r.SeoUrl ?? undefined,
//       price: (r.B2BProductPrices[0] as PriceRel | undefined)?.PriceP1 ?? 0,
//       images: [],

//       sizes: ((r.ParentProductB2BProductTextileSizes as SizeRel[] | undefined) ?? [])
//         .map((p: SizeRel): string | undefined => p.B2BProductTextileSizes?.Name ?? undefined)
//         .filter((n: string | undefined): n is string => Boolean(n)),

//       customizable:
//         ((r.ParentProductB2BProductTextileSizes as SizeRel[] | undefined)?.length ?? 0) > 0,
//     }),
//   );

//   return NextResponse.json({ data, page, limit });
// }
