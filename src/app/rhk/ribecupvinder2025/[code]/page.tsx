import ClientWinnerPage from '../ClientWinnerPage';

export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { code: string } }) {
  return <ClientWinnerPage code={params.code} />;
}
