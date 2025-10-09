import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { fetchDataFromRealtimeDB } from '../../../firebase/database';
import type { FarmersData } from './-components/Content';
import ContentHeader from './-components/ContentHeader';
import Loader from './-components/Loader';
import Table from './-components/Table';

export const Route = createFileRoute('/_authenticated/_app/farmer')({
  component: RouteComponent,
});

function RouteComponent() {
  const offtakeQuery = useQuery({
    queryKey: ['farmer-data'],
    queryFn: () => fetchDataFromRealtimeDB<FarmersData>('farmers'),
  });
  const ex = {
    ageGroup: '7-12',
    cattle: '25',
    county: 'Samburu',
    farmerId: 'SAM0004',
    gender: 'female',
    goats: '25',
    idNumber: '234677',
    location: 'Testing ',
    name: 'Testing ',
    phone: '735229184',
    registrationDate: '26 Sept 2025',
    sheep: '25',
    subcounty: 'Samburu East',
    traceability: true,
    vaccinated: true,
    vaccineType: 'PPR',
  };

  const columns = [
    { accessorKey: 'ageGroup', header: 'Age Group' },
    { accessorKey: 'cattle', header: 'Cattle' },
    { accessorKey: 'county', header: 'County' },
    { accessorKey: 'farmerId', header: 'Farmer ID' },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'registrationDate', header: 'Registration Date' },
    { accessorKey: 'sheep', header: 'Sheep' },
    { accessorKey: 'subcounty', header: 'Sub County' },
    { accessorKey: 'traceability', header: 'Traceability' },
    { accessorKey: 'vaccinated', header: 'Traceability' },
    { accessorKey: 'vaccineType', header: 'Vaccine Type' },
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
      <ContentHeader title="Farmers" url="/farmer" />
      <div className="card p-4">
        <Table data={data} title="Farmers Records" columns={columns} />
      </div>
    </>
  );
}
