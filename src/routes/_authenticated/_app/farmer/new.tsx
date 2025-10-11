import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import Card from '../-components/Card';
import type { Farmer } from '../-components/Content';
import { DynamicForm } from '../-components/DynamicForm';
import { createDataInRealtimeDB } from '../../../../firebase/database';

export const Route = createFileRoute('/_authenticated/_app/farmer/new')({
  component: RouteComponent,
});

function RouteComponent() {
  const createMutation = useMutation({
    mutationKey: ['create-user'],
    mutationFn: (data: Farmer) => createDataInRealtimeDB('farmers', data),
    onSuccess: async () => {
      toast.success('User created successfully!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCreate = (values: Farmer) => {
    createMutation.mutate(values);
  };

  return (
    <Card title="Create User" outline className="m-4">
      <DynamicForm
        collection="farmers"
        onSubmit={handleCreate}
        title="New Farmer"
        isSubmitting={createMutation.isPending}
        document={{
          ageGroup: '',
          cattle: '',
          county: '',
          farmerId: '',
          gender: '',
          goats: '',
          idNumber: '',
          location: '',
          name: '',
          phone: '',
          registrationDate: '',
          sheep: '',
          subcounty: '',
          traceability: true,
          vaccinated: true,
          vaccineType: '',
        }}
      />
    </Card>
  );
}
