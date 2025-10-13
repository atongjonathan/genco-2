import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import ContentHeader from '../-components/ContentHeader';
import Loader from '../-components/Loader';
import Table from '../-components/Table';
import { fetchUsers } from '../../../../firebase/data';

export const Route = createFileRoute('/_authenticated/_app/user/')({
  component: RouteComponent,
});

function RouteComponent() {
  const usersQuery = useQuery({
    queryKey: ['users-data'],
    queryFn: fetchUsers,
  });

  const columns: ColumnDef<Object>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ getValue }) => {
        const rawDate = getValue() as string;
        const date = new Date(rawDate);
        if (isNaN(date.getTime())) return 'Invalid date';
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      },
    },
  ];

  const data = Object.values(usersQuery.data ?? []);

  console.log(data);

  if (usersQuery.isLoading) {
    return <Loader />;
  }

  if (usersQuery.isError) {
    return <div>Error loading data</div>;
  }
  return (
    <>
      <ContentHeader title="Users" heading="" />
      <div className="card p-4">
        <Table
          queryData={data}
          title="User Records"
          columns={columns}
          searchable={true}
        />
      </div>
    </>
  );
}
