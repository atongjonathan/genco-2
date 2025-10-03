import { fetchDataFromRealtimeDB } from '@/firebase/database';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import Table from './Table';
import type { WidgetProps } from './Widget';
import Widget from './Widget';

const Content = () => {
  const farmersQuery = useQuery({
    queryKey: ['farmers-data'],
    queryFn: () => fetchFarmersData(),
  });

  type Farmer = {
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
  type FarmersData = Record<string, Farmer>;

  const fetchFarmersData = () =>
    fetchDataFromRealtimeDB<FarmersData>('farmers');

  const getValueFromQuery = (
    query: UseQueryResult<any, Error>,
    getValue: (data: any) => { value: string | number; description?: string },
  ) => {
    if (query.isLoading) return '...';
    if (query.isError) return 'Error';
    if (query.isSuccess) return getValue(query.data);
    return 'N/A';
  };
  const farmerData = getValueFromQuery(farmersQuery, (data) => ({
    value: Object.keys(data).length,
    description: `M: ${Object.values(data as FarmersData).filter((farmer: Farmer) => farmer.gender === 'male').length} F: ${Object.values(data as FarmersData).filter((farmer: Farmer) => farmer.gender === 'female').length}`,
  }));

  const animalsData = getValueFromQuery(farmersQuery, (data) => ({
    value: Object.values(data as FarmersData).reduce(
      (total, farmer) =>
        total + (parseInt(farmer.goats) || 0) + (parseInt(farmer.sheep) || 0),
      0,
    ),
    description: `G: ${Object.values(data as FarmersData).reduce(
      (total, farmer) => total + (parseInt(farmer.goats) || 0),
      0,
    )} S: ${Object.values(data as FarmersData).reduce(
      (total, farmer) => total + (parseInt(farmer.sheep) || 0),
      0,
    )}`,
  }));

  const offtakeQuery = useQuery({
    queryKey: ['offtake-data'],
    queryFn: () => fetchDataFromRealtimeDB('offtakes'),
  });

  console.log('Offtake Error:', offtakeQuery.error);

  type Offtake = {
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
  };
  type OfftakeData = Record<string, Offtake>;

  const revenueData = getValueFromQuery(offtakeQuery, (data) => ({
    value: Object.values(data as OfftakeData)
      .reduce(
        (total, offtake) =>
          total +
          (parseInt(offtake.goats[0].price) || 0) *
            (parseInt(offtake.goats[0].live) || 0),
        0,
      )
      .toLocaleString('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
  }));

  const farmerInOfftakeData = getValueFromQuery(offtakeQuery, (data) => {
    const uniqueNames = new Set(
      Object.values(data as OfftakeData).map(
        (offtake: Offtake) => offtake.name,
      ),
    );
    return {
      value: uniqueNames.size,
      description: undefined,
    };
  });

  const revDistributionPerCounty = () => {
    const countyRevenue: Record<string, number> = {};

    Object.values(offtakeQuery.data as OfftakeData)?.forEach(
      (offtake: Offtake) => {
        const county = offtake.county;
        const revenue =
          (parseInt(offtake.goats[0].price) || 0) *
          (parseInt(offtake.goats[0].live) || 0);

        countyRevenue[county] = (countyRevenue[county] || 0) + revenue;
      },
    );

    // Convert to array of { county, totalRev }
    const result = Object.entries(countyRevenue).map(([county, totalRev]) => ({
      county,
      totalRev,
    }));

    return result;
  };

  // console.log('Revenue by County:', revDistributionPerCounty());

  const animalCensusPerCounty = () => {
    const census: Record<
      string,
      { goats: number; cattle: number; sheep: number }
    > = {};

    Object.values(farmersQuery.data as FarmersData).forEach(
      (farmer: Farmer) => {
        const county = farmer.county;
        if (!census[county]) {
          census[county] = { goats: 0, cattle: 0, sheep: 0 };
        }
        census[county].goats += parseInt(farmer.goats) || 0;
        census[county].cattle += parseInt(farmer.cattle) || 0;
        census[county].sheep += parseInt(farmer.sheep) || 0;
      },
    );

    return census;
  };

  // console.log('Animal Census by County:', animalCensusPerCounty());

  const farmersInOfftakePerCounty = () => {
    const countyFarmers: Record<string, Set<string>> = {};

    Object.values(offtakeQuery.data as OfftakeData).forEach(
      (offtake: Offtake) => {
        const county = offtake.county;
        if (!countyFarmers[county]) {
          countyFarmers[county] = new Set();
        }
        countyFarmers[county].add(offtake.name);
      },
    );

    // Convert to array of { county, farmers }
    const result = Object.entries(countyFarmers).map(
      ([county, farmersSet]) => ({
        county,
        farmers: (farmersSet as Set<string>).size,
      }),
    );

    return result;
  };

  // console.log('Farmers in Offtake by County:', farmersInOfftakePerCounty());

  const widgets: WidgetProps[] = [
    {
      title: 'Total farmers',
      backgroundColor: 'primary',
      icon: 'people-fill',
      link: '/orders',
      description: (farmerData as { description?: string }).description,
      value: (farmerData as { value: string | number }).value,
    },
    {
      title: 'Total animals',
      backgroundColor: 'success',
      icon: 'bar-chart-fill',
      link: '/analytics',
      description: (animalsData as { description?: string }).description,
      value: (animalsData as { value: string | number }).value,
    },
    {
      title: 'Farmers in offtake',
      backgroundColor: 'warning',
      icon: 'person-check-fill',
      link: '/users',
      description: (farmerInOfftakeData as { description?: string })
        .description,
      value: (farmerInOfftakeData as { value: string | number }).value,
    },
    {
      title: 'Total Revenue',
      backgroundColor: 'danger',
      value: (revenueData as { value: string | number }).value,
      icon: 'currency-dollar',
      link: '/visitors',
      description: '' + (revenueData as { value: string | number }).value,
    },
  ];

  const revDistributionPerCountyTable = {
    title: 'Revenue Distribution Per County',
    columns: [
      { header: 'County', accessorKey: 'county' },
      {
        header: 'Total Revenue (KES)',
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
        header: 'Total Farmers',
        accessorKey: 'farmers',
        cell: (info: any) => parseInt(info.getValue()),
      },
    ],
    data: offtakeQuery.isSuccess ? farmersInOfftakePerCounty() : [],
  };

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
  return (
    <div className="app-content">
      {/*begin::Container*/}
      <div className="container-fluid">
        {/*begin::Row*/}
        <div className="row">
          {/*begin::Col*/}
          {widgets.map((widget, index) => (
            <Widget key={index} {...widget} />
          ))}
          <div className="col-md-4">
            <Table {...revDistributionPerCountyTable} />
          </div>
          <div className="col-md-4">
            <Table {...farmersInOfftakePerCountyTable} />
          </div>
          <div className="col-md-4">
            <Table {...animalCensusPerCountyTable} />
          </div>
          {/*end::Col*/}
        </div>

        {/*end::Row*/}
      </div>
      {/*end::Container*/}
    </div>
  );
};

export default Content;
