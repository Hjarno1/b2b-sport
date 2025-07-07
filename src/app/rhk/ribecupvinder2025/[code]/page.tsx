import React, { Suspense } from 'react';
import ClientWinnerPage from '../ClientWinnerPage';

export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { code: string } }) {
  return (
    <Suspense fallback={<p className="text-center mt-16">Loading...</p>}>
      <ClientWinnerPage code={params.code} />
    </Suspense>
  );
}
