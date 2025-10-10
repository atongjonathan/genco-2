import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import Card from '../-components/Card';
import type { Offtake, OfftakeData } from '../-components/Content';
import { DynamicForm } from '../-components/DynamicForm';
import Loader from '../-components/Loader';
import {
  fetchDataFromRealtimeDB,
  updateDataInRealtimeDB,
} from '../../../../firebase/database';

export const Route = createFileRoute('/_authenticated/_app/offtake/$docId')({
  component: RouteComponent,
});

type RowData = Record<string, any>;

function RouteComponent() {
  const { docId } = Route.useParams();

  const offtakeQuery = useQuery({
    queryKey: ['offtakes-data'],
    queryFn: () => fetchDataFromRealtimeDB<OfftakeData>('offtakes'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, any>) =>
      updateDataInRealtimeDB('offtakes/' + docId, data),
    onSuccess: async () => {
      await offtakeQuery.refetch();
      toast.success('Offtake updated successfully!');
    },
    onError: (err) => toast.error(err.message),
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
    <Card title={document.name} outline className="m-4">
      <DynamicForm
        document={document}
        exclude={['docId']}
        collection="offtakes"
        onSubmit={async (values) => {
          updateMutation.mutate(values);
        }}
      />
    </Card>
  );
}
