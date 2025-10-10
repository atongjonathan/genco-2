import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import Card from '../-components/Card';
import { DynamicForm } from '../-components/DynamicForm';
import Loader from '../-components/Loader';
import type { User } from '../../../../auth';
import { fetchUsers, updateDocWithId } from '../../../../firebase/data';

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

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, any>) =>
      updateDocWithId(docId, data, 'users'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users-data'] });
      toast.success('User updated successfully!');
    },
    onError: (err) => toast.error(err.message),
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
    <Card title={document.name} outline className="m-4">
      <DynamicForm
        document={document}
        exclude={['docId', 'createdAt', 'uid']}
        collection="users"
        isSubmitting={updateMutation.isPending}
        onSubmit={async (values) => {
          updateMutation.mutate(values);
        }}
      />
    </Card>
  );
}
