import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { Row } from '@tanstack/react-table';
import { useState } from 'react';
import type { OfftakeData } from '../-components/Content';
import ContentHeader from '../-components/ContentHeader';
import Loader from '../-components/Loader';
import Table from '../-components/Table';
import { fetchDataFromRealtimeDB } from '../../../../firebase/database';

export const Route = createFileRoute('/_authenticated/_app/offtake/')({
  component: RouteComponent,
});

function RouteComponent() {
  const offtakeQuery = useQuery({
    queryKey: ['offtake-data'],
    queryFn: () => fetchDataFromRealtimeDB<OfftakeData>('offtakes'),
  });
  const [filteredData, setFilteredData] = useState<Row<Record<string, any>>[]>(
    [],
  );

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'county', header: 'County' },
    { accessorKey: 'subcounty', header: 'Subcounty' },
    { accessorKey: 'idNumber', header: 'ID Number' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'totalGoats', header: 'Total Goats' },
    { accessorKey: 'totalPrice', header: 'Total Price' },
  ];

  if (offtakeQuery.isLoading) {
    return <Loader />;
  }

  if (offtakeQuery.isError) {
    return <div>Error loading data</div>;
  }

  const totalAmount = filteredData.reduce(
    (sum, row) => sum + row.original.totalPrice,
    0,
  );
  const totalGoats = filteredData.reduce(
    (sum, row) => sum + row.original.totalGoats,
    0,
  );
  const avgAmount = (totalAmount / filteredData.length).toFixed(2);
  const totalLW = filteredData.reduce((sum, row) => {
    const lW = row.original.goats.reduce(
      (
        sum: number,
        goat: {
          carcass: string;
          live: string;
          price: string;
        },
      ) => sum + parseInt(goat.live),
      0,
    );
    return sum + lW;
  }, 0);
  const totalCW = filteredData.reduce((sum, row) => {
    const lW = row.original.goats.reduce(
      (
        sum: number,
        goat: {
          carcass: string;
          live: string;
          price: string;
        },
      ) => sum + parseInt(goat.carcass),
      0,
    );
    return sum + lW;
  }, 0);
  const avgLW = (totalLW / filteredData.length).toFixed(2);
  const avgCW = (totalCW / filteredData.length).toFixed(2);
  return (
    <>
      <ContentHeader
        title="Offtake"
        heading={`| Total Amount: ${totalAmount} | Total Goats No: ${totalGoats} | Average Amount: ${avgAmount} | Average LW: ${avgLW} | Average CW: ${avgCW}`}
      />
      <div className="card p-4">
        <Table
          queryData={offtakeQuery.data as unknown as Record<string, any>[]}
          title="Offtake Records"
          columns={columns}
          dateColumnKey="date"
          setData={setFilteredData}
          searchable={false}
          exportFn={() => console.log('Export')}
        />
      </div>
    </>
  );
}
