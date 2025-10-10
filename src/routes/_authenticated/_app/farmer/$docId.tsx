import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { Farmer, FarmersData } from '../-components/Content';
import Loader from '../-components/Loader';
import { fetchDataFromRealtimeDB } from '../../../../firebase/database';

export const Route = createFileRoute('/_authenticated/_app/farmer/$docId')({
  component: RouteComponent,
});
type RowData = Record<string, any>;

function RouteComponent() {
  const { docId } = Route.useParams();

  const offtakeQuery = useQuery({
    queryKey: ['farmer-data'],
    queryFn: () => fetchDataFromRealtimeDB<FarmersData>('farmers'),
  });

  // Find document by ID
  const data: RowData = Object.entries(offtakeQuery.data ?? {}).map(
    ([docId, value]) => ({
      docId,
      ...value,
    }),
  );
  const document = data?.find(
    (doc: Farmer & { docId: string }) => doc.docId === docId,
  );

  if (offtakeQuery.isLoading) {
    return <Loader />;
  }
  if (!document) return <div>Document not found</div>;

  return (
    <div>
      <h1>{document.docId}</h1>
      <pre>{JSON.stringify(document, null, 2)}</pre>
    </div>
  );
}
