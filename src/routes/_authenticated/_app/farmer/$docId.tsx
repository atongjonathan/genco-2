import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Card from '../-components/Card';
import type { Farmer, FarmersData } from '../-components/Content';
import { DynamicForm } from '../-components/DynamicForm';
import Loader from '../-components/Loader';
import { fetchDataFromRealtimeDB } from '../../../../firebase/database';

export const Route = createFileRoute('/_authenticated/_app/farmer/$docId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { docId } = Route.useParams();

  const offtakeQuery = useQuery({
    queryKey: ['farmer-data'],
    queryFn: () => fetchDataFromRealtimeDB<FarmersData>('farmers'),
  });

  const data = Object.entries(offtakeQuery.data ?? {}).map(([id, value]) => ({
    docId: id,
    ...value,
  }));

  const document = data.find((doc) => doc.docId === docId) as
    | (Farmer & { docId: string })
    | undefined;

  if (offtakeQuery.isLoading) return <Loader />;
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
