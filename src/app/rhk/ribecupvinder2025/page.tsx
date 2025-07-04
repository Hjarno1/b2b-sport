import React, { Suspense } from 'react';
export const dynamic = 'force-dynamic';

import ClientWinnerPage from './ClientWinnerPage';

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-16">Loading...</p>}>
      <ClientWinnerPage />
    </Suspense>
  );
}
