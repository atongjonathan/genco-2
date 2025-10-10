import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Loader from '../-components/Loader';
import type { User } from '../../../../auth';
import { fetchUsers } from '../../../../firebase/data';

export const Route = createFileRoute('/_authenticated/_app/user/$docId')({
  component: RouteComponent,
});

type RowData = Record<string, any>;

function RouteComponent() {
  const { docId } = Route.useParams();

  const usersQuery = useQuery({
    queryKey: ['users-data'],
    queryFn: fetchUsers,
  });

  // Find document by ID
  const data: RowData = Object.entries(usersQuery.data ?? {}).map(
    ([docId, value]) => ({
      docId,
      ...value,
    }),
  );
  const document = data?.find(
    (doc: User & { docId: string }) => doc.docId === docId,
  );

  if (usersQuery.isLoading) {
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
