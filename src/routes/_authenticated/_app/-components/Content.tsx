import { fetchDataFromRealtimeDB } from '@/firebase/database';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import DateFilter from './DateFilter';
import Loader from './Loader';
import TablesRow from './TablesRow';
import WidgetsRow from './WidgetsRow';

export type Offtake = {
  county: string;
  date: string;
  gender: string;
  goats: {
    carcass: string;
    live: string;
    price: string;
  }[];
  idNumber: string;
  location: string;
  name: string;
  phone: string;
  subcounty: string;
  totalGoats: number;
  totalPrice: number;
};
export type OfftakeData = Record<string, Offtake>;

export type Farmer = {
  ageGroup: string;
  cattle: string;
  county: string;
  farmerId: string;
  gender: string;
  goats: string;
  idNumber: string;
  location: string;
  name: string;
  phone: string;
  registrationDate: string;
  sheep: string;
  subcounty: string;
  traceability: boolean;
  vaccinated: boolean;
  vaccineType: string;
};
export type FarmersData = Record<string, Farmer>;

const Content = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const farmersQuery = useQuery({
    queryKey: ['farmers-data'],
    queryFn: () => fetchFarmersData(),
  });
  const offtakeQuery = useQuery({
    queryKey: ['offtake-data'],
    queryFn: () => fetchDataFromRealtimeDB<OfftakeData>('offtakes'),
  });
  const fetchFarmersData = () =>
    fetchDataFromRealtimeDB<FarmersData>('farmers');

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthIndex = months.indexOf(selectedMonth); // 0-based month
  const year = parseInt(selectedYear, 10);
  const fromDate = new Date(Date.UTC(year, monthIndex, 1));
  const toDate = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

  const filteredOfftakes = useMemo(() => {
    const data = offtakeQuery.data;
    if (!data) return [];

    const allOfftakes = Object.values(data);

    // If month/year not selected, return all data
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return allOfftakes;
    }

    // Otherwise, filter between fromDate and toDate
    return allOfftakes.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  }, [offtakeQuery.data, fromDate, toDate]);

  if (offtakeQuery.isError) {
    console.log('Offtake Error:', offtakeQuery.error);
  }

  if (farmersQuery.isLoading || offtakeQuery.isLoading) {
    return <Loader />;
  }
  return (
    <div className="app-content">
      {/*begin::Container*/}
      <div className="container-fluid">
        <DateFilter
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <WidgetsRow
          farmers={farmersQuery.data}
          filteredOfftakes={filteredOfftakes}
        />
        <TablesRow
          farmers={farmersQuery.data}
          filteredOfftakes={filteredOfftakes}
        />
      </div>
      {/*end::Container*/}
    </div>
  );
};

export default Content;
