import React, { Suspense } from 'react';
import ClientWinnerPage from '../ClientWinnerPage';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return (
    <Suspense fallback={<p className="text-center mt-16">Loading...</p>}>
      <ClientWinnerPage code={code} />
    </Suspense>
  );
}
