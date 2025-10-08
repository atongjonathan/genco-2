import { useMemo } from 'react';
import type { FarmersData, Offtake } from './Content';
import Table from './Table';

type TablesRowProps = {
  farmers: FarmersData | undefined;
  filteredOfftakes: Offtake[];
};

const TablesRow = ({ farmers, filteredOfftakes }: TablesRowProps) => {
  if (!farmers) {
    return (
      <div className="text-center py-5">
        <span>Loading data...</span>
      </div>
    );
  }

  // --- Revenue Distribution Per County ---
  const revDistributionPerCounty = () => {
    const countyRevenue: Record<string, number> = {};

    filteredOfftakes.forEach((offtake) => {
      const county = offtake.county;
      const revenue =
        (parseInt(offtake.goats?.[0]?.price ?? '0') || 0) *
        (parseInt(offtake.goats?.[0]?.live ?? '0') || 0);

      countyRevenue[county] = (countyRevenue[county] || 0) + revenue;
    });

    return Object.entries(countyRevenue).map(([county, totalRev]) => ({
      county,
      totalRev,
    }));
  };

  // --- Farmers in Offtake Per County ---
  const farmersInOfftakePerCounty = () => {
    const countyFarmers: Record<string, Set<string>> = {};

    filteredOfftakes.forEach((offtake) => {
      const county = offtake.county;
      if (!countyFarmers[county]) {
        countyFarmers[county] = new Set();
      }
      countyFarmers[county].add(offtake.name);
    });

    return Object.entries(countyFarmers).map(([county, farmersSet]) => ({
      county,
      farmers: farmersSet.size,
    }));
  };

  // --- Farmers Registered Per County ---
  const farmersRegisteredPerCounty = () => {
    const countyFarmers: Record<string, Set<string>> = {};

    Object.values(farmers).forEach((farmer) => {
      const county = farmer.county;
      if (!countyFarmers[county]) {
        countyFarmers[county] = new Set();
      }
      countyFarmers[county].add(farmer.name);
    });

    return Object.entries(countyFarmers).map(([county, farmersSet]) => ({
      county,
      farmers: farmersSet.size,
    }));
  };

  // --- Animal Census Per County ---
  const animalCensusPerCounty = () => {
    const census: Record<
      string,
      { goats: number; cattle: number; sheep: number }
    > = {};

    Object.values(farmers).forEach((farmer) => {
      const county = farmer.county;
      if (!census[county]) {
        census[county] = { goats: 0, cattle: 0, sheep: 0 };
      }
      census[county].goats += parseInt(farmer.goats) || 0;
      census[county].cattle += parseInt(farmer.cattle) || 0;
      census[county].sheep += parseInt(farmer.sheep) || 0;
    });

    return Object.entries(census).map(([county, animals]) => ({
      county,
      totalGoats: animals.goats,
      totalCattle: animals.cattle,
      totalSheep: animals.sheep,
    }));
  };

  // --- Counties Per Revenue ---
  const countiesPerRevenue = () => {
    const countyRevenue: Record<string, number> = {};

    filteredOfftakes.forEach((offtake) => {
      const county = offtake.county;
      const revenue = offtake.goats.reduce(
        (total, goat) => total + (parseInt(goat.price) || 0),
        0,
      );
      countyRevenue[county] = (countyRevenue[county] || 0) + revenue;
    });

    return Object.entries(countyRevenue).map(([county, revenue]) => ({
      county,
      revenue,
    }));
  };

  const revDistributionPerCountyData = useMemo(
    () => revDistributionPerCounty(),
    [filteredOfftakes],
  );
  const farmersInOfftakeData = useMemo(
    () => farmersInOfftakePerCounty(),
    [filteredOfftakes],
  );
  const farmersRegisteredData = useMemo(
    () => farmersRegisteredPerCounty(),
    [farmers],
  );
  const animalCensusData = useMemo(() => animalCensusPerCounty(), [farmers]);
  const countiesPerRevenueData = useMemo(
    () => countiesPerRevenue(),
    [filteredOfftakes],
  );

  // --- Table Definitions ---
  const tables = [
    {
      title: 'Revenue Distribution Per County',
      columns: [
        { header: 'County', accessorKey: 'county' },
        { header: 'Revenue (KES)', accessorKey: 'totalRev' },
      ],
      data: revDistributionPerCountyData,
    },
    {
      title: 'Farmers in Offtake Per County',
      columns: [
        { header: 'County', accessorKey: 'county' },
        { header: 'Farmers', accessorKey: 'farmers' },
      ],
      data: farmersInOfftakeData,
    },
    {
      title: 'Animal Census Per County',
      columns: [
        { header: 'County', accessorKey: 'county' },
        { header: 'Goats', accessorKey: 'totalGoats' },
        { header: 'Cattle', accessorKey: 'totalCattle' },
        { header: 'Sheep', accessorKey: 'totalSheep' },
      ],
      data: animalCensusData,
    },
    {
      title: 'Farmers Registered Per County',
      columns: [
        { header: 'County', accessorKey: 'county' },
        { header: 'Total Farmers', accessorKey: 'farmers' },
      ],
      data: farmersRegisteredData,
    },
    {
      title: 'Counties Per Revenue',
      columns: [
        { header: 'County', accessorKey: 'county' },
        { header: 'Revenue (KES)', accessorKey: 'revenue' },
      ],
      data: countiesPerRevenueData,
    },
  ];

  return (
    <div className="row">
      {tables.map((table, index) => (
        <div className="col-md-4 mb-4" key={index}>
          <Table {...table} searchable={false} />
        </div>
      ))}
    </div>
  );
};

export default TablesRow;
