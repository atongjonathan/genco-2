import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import Card from '../-components/Card';
import type { Farmer, FarmersData } from '../-components/Content';
import { DynamicForm } from '../-components/DynamicForm';
import Loader from '../-components/Loader';
import {
  fetchDataFromRealtimeDB,
  updateDataInRealtimeDB,
} from '../../../../firebase/database';

export const Route = createFileRoute('/_authenticated/_app/farmer/$docId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { docId } = Route.useParams();

  const offtakeQuery = useQuery({
    queryKey: ['farmer-data'],
    queryFn: () => fetchDataFromRealtimeDB<FarmersData>('farmers'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, any>) =>
      updateDataInRealtimeDB('farmers/' + docId, data),
    onSuccess: async () => {
      await offtakeQuery.refetch();
      toast.success('Farmer updated successfully!');
    },
    onError: (err) => toast.error(err.message),
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
    <Card title={document.name} outline className="m-4">
      <DynamicForm
        document={document}
        collection="farmers"
        exclude={['docId']}
        onSubmit={async (values) => {
          updateMutation.mutate(values);
        }}
      />
    </Card>
  );
}
