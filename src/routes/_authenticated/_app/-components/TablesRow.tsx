import { useQuery } from '@tanstack/react-query';
import { fetchDataFromRealtimeDB } from '../../../../firebase/database';
import type { FarmersData, OfftakeData } from './Content';
import Table from './Table';

const TablesRow = () => {
  const fetchFarmersData = () =>
    fetchDataFromRealtimeDB<FarmersData>('farmers');
  const farmersQuery = useQuery({
    queryKey: ['farmers-data'],
    queryFn: () => fetchFarmersData(),
  });
  const offtakeQuery = useQuery({
    queryKey: ['offtake-data'],
    queryFn: () => fetchDataFromRealtimeDB('offtakes'),
  });
  const revDistributionPerCounty = () => {
    const countyRevenue: Record<string, number> = {};

    Object.values(offtakeQuery.data as OfftakeData)?.forEach((offtake) => {
      const county = offtake.county;
      const revenue =
        (parseInt(offtake.goats[0].price) || 0) *
        (parseInt(offtake.goats[0].live) || 0);

      countyRevenue[county] = (countyRevenue[county] || 0) + revenue;
    });

    // Convert to array of { county, totalRev }
    const result = Object.entries(countyRevenue).map(([county, totalRev]) => ({
      county,
      totalRev,
    }));

    return result;
  };

  const animalCensusPerCounty = () => {
    const census: Record<
      string,
      { goats: number; cattle: number; sheep: number }
    > = {};

    Object.values(farmersQuery.data as FarmersData).forEach((farmer) => {
      const county = farmer.county;
      if (!census[county]) {
        census[county] = { goats: 0, cattle: 0, sheep: 0 };
      }
      census[county].goats += parseInt(farmer.goats) || 0;
      census[county].cattle += parseInt(farmer.cattle) || 0;
      census[county].sheep += parseInt(farmer.sheep) || 0;
    });

    return census;
  };

  const farmersInOfftakePerCounty = () => {
    const countyFarmers: Record<string, Set<string>> = {};

    Object.values(offtakeQuery.data as OfftakeData).forEach((offtake) => {
      const county = offtake.county;
      if (!countyFarmers[county]) {
        countyFarmers[county] = new Set();
      }
      countyFarmers[county].add(offtake.name);
    });

    // Convert to array of { county, farmers }
    const result = Object.entries(countyFarmers).map(
      ([county, farmersSet]) => ({
        county,
        farmers: (farmersSet as Set<string>).size,
      }),
    );

    return result;
  };

  const farmersRegisteredPerCounty = () => {
    const countyFarmers: Record<string, Set<string>> = {};
    Object.values(farmersQuery.data as FarmersData).forEach((farmer) => {
      const county = farmer.county;
      if (!countyFarmers[county]) {
        countyFarmers[county] = new Set();
      }
      countyFarmers[county].add(farmer.name);
    });

    // Convert to array of { county, farmers }
    const result = Object.entries(countyFarmers).map(
      ([county, farmersSet]) => ({
        county,
        farmers: (farmersSet as Set<string>).size,
      }),
    );

    return result;
  };

  const countiesPerRevenue = () => {
    const countyRevenue: Record<string, number> = {};
    Object.values(offtakeQuery.data as OfftakeData).forEach((revenue) => {
      const county = revenue.county;
      if (!countyRevenue[county]) {
        countyRevenue[county] = 0;
      }
      countyRevenue[county] += revenue.goats.reduce(
        (total, goat) => total + (parseInt(goat.price) || 0),
        0,
      );
    });
    // Convert to array of { county, revenue }
    return Object.entries(countyRevenue).map(([county, revenue]) => ({
      county,
      revenue,
    }));
  };

  const revDistributionPerCountyTable = {
    title: 'Revenue Distribution Per County',
    columns: [
      { header: 'County', accessorKey: 'county' },
      {
        header: 'Revenue (KES)',
        accessorKey: 'totalRev',
        cell: (info: any) => parseInt(info.getValue()),
      },
    ],
    data: offtakeQuery.isSuccess ? revDistributionPerCounty() : [],
  };

  const farmersInOfftakePerCountyTable = {
    title: 'Farmers in Offtake  Per County',
    columns: [
      { header: 'County', accessorKey: 'county' },
      {
        header: 'Farmers',
        accessorKey: 'farmers',
        cell: (info: any) => parseInt(info.getValue()),
      },
    ],
    data: offtakeQuery.isSuccess ? farmersInOfftakePerCounty() : [],
  };

  const farmersRegisteredPerCountyTable = {
    title: 'Farmers Registered Per County',
    columns: [
      { header: 'County', accessorKey: 'county' },
      {
        header: 'Total Farmers',
        accessorKey: 'farmers',
        cell: (info: any) => parseInt(info.getValue()),
      },
    ],
    data: farmersQuery.isSuccess ? farmersRegisteredPerCounty() : [],
  };

  // console.log('Offtake Data:', offtakeQuery.data);

  const animalCensusPerCountyTable = {
    title: 'Animal Census Per County',
    columns: [
      { header: 'County', accessorKey: 'county' },
      {
        header: 'Goats',
        accessorKey: 'totalGoats',
        cell: (info: any) => parseInt(info.getValue()),
      },
      {
        header: 'Cattle',
        accessorKey: 'totalCattle',
        cell: (info: any) => parseInt(info.getValue()),
      },
      {
        header: 'Sheep',
        accessorKey: 'totalSheep',
        cell: (info: any) => parseInt(info.getValue()),
      },
    ],
    data: farmersQuery.isSuccess
      ? Object.entries(animalCensusPerCounty()).map(([county, animals]) => ({
          county,
          totalGoats: animals.goats,
          totalCattle: animals.cattle,
          totalSheep: animals.sheep,
        }))
      : [],
  };

  const countiesPerRevenueTable = {
    title: 'Counties Per Revenue',
    columns: [
      { header: 'County', accessorKey: 'county' },
      {
        header: 'Revenue (KES)',
        accessorKey: 'revenue',
        cell: (info: any) => info.getValue(),
      },
    ],
    data: offtakeQuery.isSuccess ? countiesPerRevenue() : [],
  };
  return (
    <div className="row">
      <div className="col-md-4">
        <Table {...revDistributionPerCountyTable} />
      </div>
      <div className="col-md-4">
        <Table {...farmersInOfftakePerCountyTable} />
      </div>
      <div className="col-md-4">
        <Table {...animalCensusPerCountyTable} />
      </div>
      <div className="col-md-4">
        <Table {...farmersRegisteredPerCountyTable} />
      </div>
      <div className="col-md-4">
        <Table {...countiesPerRevenueTable} />
      </div>
      {/*end::Col*/}
    </div>
  );
};

export default TablesRow;
