import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from 'react';
import type { FarmersData } from '../-components/Content';
import ContentHeader from '../-components/ContentHeader';
import Loader from '../-components/Loader';
import Table from '../-components/Table';
import { fetchDataFromRealtimeDB } from '../../../../firebase/database';

export const Route = createFileRoute('/_authenticated/_app/farmer/')({
  component: RouteComponent,
});

function RouteComponent() {
  const farmerQuery = useQuery({
    queryKey: ['farmer-data'],
    queryFn: () => fetchDataFromRealtimeDB<FarmersData>('farmers'),
  });

  const [filteredData, setFilteredData] = useState<Row<Record<string, any>>[]>(
    [],
  );

  const columns: ColumnDef<FarmersData>[] = [
    { accessorKey: 'ageGroup', header: 'Age Group' },
    { accessorKey: 'cattle', header: 'Cattle' },
    { accessorKey: 'county', header: 'County' },
    { accessorKey: 'farmerId', header: 'Farmer ID' },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ getValue }) => {
        const raw = getValue();
        return typeof raw === 'number' ? String(raw) : (raw ?? '');
      },
    },
    { accessorKey: 'registrationDate', header: 'Reg Date' },
    { accessorKey: 'sheep', header: 'Sheep' },
    { accessorKey: 'subcounty', header: 'Sub County' },
    {
      accessorKey: 'traceability',
      header: 'Traceability',
      cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
    },
    {
      accessorKey: 'vaccinated',
      header: 'Traceability',
      cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
    },
    { accessorKey: 'vaccineType', header: 'Vaccine Type' },
  ];

  const data = Object.values(farmerQuery.data ?? []);

  if (farmerQuery.isLoading) {
    return <Loader />;
  }

  if (farmerQuery.isError) {
    return <div>Error loading data</div>;
  }

  const totalGoats = filteredData.reduce(
    (sum, row) => sum + parseInt(row.original.goats),
    0,
  );
  const maleFarmers = filteredData.filter(
    (row) => row.original.gender == 'male',
  ).length;
  const femaleFarmers = filteredData.filter(
    (row) => row.original.gender == 'female',
  ).length;
  const heading = `Livestock Farmers | Total Goats: ${totalGoats} | Total Farmers: ${data.length} | Male Farmers: ${maleFarmers} | Female Farmers: ${femaleFarmers}`;

  return (
    <>
      <ContentHeader title="Farmers" heading={heading} />
      <div className="card p-4">
        <Table
          queryData={farmerQuery.data as unknown as Record<string, any>[]}
          title={`Farmer Records`}
          columns={columns}
          setData={setFilteredData}
          exportFn={() => console.log('Export')}
          searchable={true}
        />
      </div>
    </>
  );
}
