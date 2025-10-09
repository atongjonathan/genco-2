import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { fetchDataFromRealtimeDB } from '../../../firebase/database';
import type { OfftakeData } from './-components/Content';
import ContentHeader from './-components/ContentHeader';
import Loader from './-components/Loader';
import Table from './-components/Table';

export const Route = createFileRoute('/_authenticated/_app/offtake')({
  component: RouteComponent,
});

function RouteComponent() {
  const offtakeQuery = useQuery({
    queryKey: ['offtake-data'],
    queryFn: () => fetchDataFromRealtimeDB<OfftakeData>('offtakes'),
  });

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'county', header: 'County' },
    { accessorKey: 'subcounty', header: 'Subcounty' },
    { accessorKey: 'idNumber', header: 'ID Number' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'date', header: 'Date' },
  ];

  const data = Object.values(offtakeQuery.data ?? []);

  if (offtakeQuery.isLoading) {
    return <Loader />;
  }

  if (offtakeQuery.isError) {
    return <div>Error loading data</div>;
  }
  return (
    <>
      <ContentHeader title="Offtake" url="/offtake" />
      <div className="card p-4">
        <Table
          data={data}
          title="Offtake Records"
          columns={columns}
          dateColumnKey="date"
        />
      </div>
    </>
  );
}
