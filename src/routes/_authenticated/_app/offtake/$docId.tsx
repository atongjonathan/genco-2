import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Card from '../-components/Card';
import type { Offtake, OfftakeData } from '../-components/Content';
import { DynamicForm } from '../-components/DynamicForm';
import Loader from '../-components/Loader';
import { fetchDataFromRealtimeDB } from '../../../../firebase/database';

export const Route = createFileRoute('/_authenticated/_app/offtake/$docId')({
  component: RouteComponent,
});

type RowData = Record<string, any>;

function RouteComponent() {
  const { docId } = Route.useParams();

  const offtakeQuery = useQuery({
    queryKey: ['offtake-data'],
    queryFn: () => fetchDataFromRealtimeDB<OfftakeData>('offtakes'),
  });

  // Find document by ID
  const data: RowData = Object.entries(offtakeQuery.data ?? {}).map(
    ([docId, value]) => ({
      docId,
      ...value,
    }),
  );
  const document = data?.find(
    (doc: Offtake & { docId: string }) => doc.docId === docId,
  );

  if (offtakeQuery.isLoading) {
    return <Loader />;
  }

  if (!document) return <div>Document not found</div>;

  return (
    <Card
      title={document.name}
      outline
      footer={
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => alert('TODO: delete logic')}
        >
          Delete
        </button>
      }
      className="m-4"
    >
      <DynamicForm
        document={document}
        exclude={['docId']}
        onSubmit={async (values) => {
          console.log('Saving farmer:', values);
          alert('Saved!');
        }}
      />
    </Card>
  );
}
