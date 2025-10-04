import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchDataFromRealtimeDB } from '../../../../firebase/database';
import type { FarmersData, OfftakeData } from './Content';
import Widget, { type WidgetProps } from './Widget';

const WidgetsRow = () => {
  const getValueFromQuery = (
    query: UseQueryResult<any, Error>,
    getValue: (data: any) => { value: string | number; description?: string },
  ) => {
    if (query.isLoading) return '...';
    if (query.isError) return 'Error';
    if (query.isSuccess) return getValue(query.data);
    return 'N/A';
  };
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
  const farmerData = getValueFromQuery(farmersQuery, (data) => ({
    value: Object.keys(data).length,
    description: `M: ${Object.values(data as FarmersData).filter((farmer) => farmer.gender === 'male').length} F: ${Object.values(data as FarmersData).filter((farmer) => farmer.gender === 'female').length}`,
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
      Object.values(data as OfftakeData).map((offtake) => offtake.name),
    );
    return {
      value: uniqueNames.size,
      description: undefined,
    };
  });
  const widgets: WidgetProps[] = [
    {
      title: 'Farmers',
      backgroundColor: 'primary',
      icon: 'people-fill',
      link: '/orders',
      description: (farmerData as { description?: string }).description,
      value: (farmerData as { value: string | number }).value,
    },
    {
      title: 'Animals',
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
      title: 'Revenue',
      backgroundColor: 'danger',
      value: (revenueData as { value: string | number }).value,
      icon: 'currency-dollar',
      link: '/visitors',
      description: '' + (revenueData as { value: string | number }).value,
    },
  ];
  return (
    <>
      {/*begin::Row*/}
      <div className="row">
        {/*begin::Col*/}
        {widgets.map((widget, index) => (
          <Widget key={index} {...widget} />
        ))}
      </div>

      {/*end::Row*/}
    </>
  );
};

export default WidgetsRow;
