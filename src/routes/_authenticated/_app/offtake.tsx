import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { fetchDataFromRealtimeDB } from '../../../firebase/database';
import type { OfftakeData } from './-components/Content';
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

  const exampleData = [
    {
      county: 'Samburu',
      date: '26 Sept 2025',
      gender: 'female',
      goats: [
        {
          carcass: '5.88',
          live: '14',
          price: '3300.00',
        },
        {
          carcass: '6.30',
          live: '15',
          price: '3600.00',
        },
        {
          carcass: '6.72',
          live: '16',
          price: '3800.00',
        },
        {
          carcass: '11.34',
          live: '27',
          price: '6400.00',
        },
        {
          carcass: '16.38',
          live: '39',
          price: '9300.00',
        },
        {
          carcass: '16.80',
          live: '40',
          price: '9500.00',
        },
        {
          carcass: '12.18',
          live: '29',
          price: '6900.00',
        },
        {
          carcass: '16.38',
          live: '39',
          price: '9300.00',
        },
      ],
      idNumber: '124567',
      location: 'Testing ',
      name: 'Martin KM',
      phone: '735229184',
      subcounty: 'Samburu East',
      totalGoats: 8,
      totalPrice: 52100,
    },
  ];

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'county', header: 'County' },
    { accessorKey: 'subcounty', header: 'Subcounty' },
    { accessorKey: 'idNumber', header: 'ID Number' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'date', header: 'Date' },
  ];

  const data = Object.values(offtakeQuery.data ?? exampleData);

  console.log('Offtake Data:', data);

  if (offtakeQuery.isLoading) {
    return <Loader />;
  }

  if (offtakeQuery.isError) {
    return <div>Error loading data</div>;
  }
  return (
    <>
      <div className="app-content-header">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="row">
            <div className="col-sm-6">
              <h4 className="mb-0">Offtake</h4>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link to="/">Offtake</Link>
                </li>
              </ol>
            </div>
          </div>
          {/*end::Row*/}
        </div>
        {/*end::Container*/}
      </div>
      <div className="card p-4">
        <Table data={data} title="Offtake Records" columns={columns} />
      </div>
    </>
  );
}
