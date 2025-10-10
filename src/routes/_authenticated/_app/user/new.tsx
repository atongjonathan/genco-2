import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import Card from '../-components/Card';
import { DynamicForm } from '../-components/DynamicForm';
import type { User } from '../../../../auth';
import { registerUser } from '../../../../firebase/data';

export const Route = createFileRoute('/_authenticated/_app/user/new')({
  component: RouteComponent,
});

export type NewUser = User & { password: string };

function RouteComponent() {
  const createMutation = useMutation({
    mutationKey: ['create-user'],
    mutationFn: (data: NewUser) => registerUser(data),
    onSuccess: () => toast.success('User created successfully!'),
    onError: (err) => toast.error(err.message),
  });

  const handleCreate = (values: NewUser) => {
    createMutation.mutate(values);
  };

  return (
    <Card title="Create User" outline className="m-4">
      <DynamicForm
        onSubmit={handleCreate}
        collection="users"
        title="New User"
        isSubmitting={createMutation.isPending}
        document={{
          name: '',
          email: '',
          role: '',
          password: '',
        }}
      />
    </Card>
  );
}
