import type { FarmersData, Offtake } from './Content';
import Widget, { type WidgetProps } from './Widget';

type WidgetsRowProps = {
  farmers: FarmersData | undefined;
  filteredOfftakes: Offtake[];
};

const WidgetsRow = ({ farmers, filteredOfftakes }: WidgetsRowProps) => {
  if (!farmers) {
    return (
      <div className="text-center py-5">
        <span>Loading data...</span>
      </div>
    );
  }

  // --- Farmers Data ---
  const totalFarmers = Object.keys(farmers).length;
  const maleFarmers = Object.values(farmers).filter(
    (f) => f.gender === 'male',
  ).length;
  const femaleFarmers = Object.values(farmers).filter(
    (f) => f.gender === 'female',
  ).length;

  // --- Animals Data ---
  const totalAnimals = Object.values(farmers).reduce((total, f) => {
    return total + (parseInt(f.goats) || 0) + (parseInt(f.sheep) || 0);
  }, 0);

  const totalGoats = Object.values(farmers).reduce(
    (sum, f) => sum + (parseInt(f.goats) || 0),
    0,
  );
  const totalSheep = Object.values(farmers).reduce(
    (sum, f) => sum + (parseInt(f.sheep) || 0),
    0,
  );

  // --- Offtake-based Metrics (filtered by date) ---
  const totalRevenue = filteredOfftakes.reduce((total, offtake) => {
    const price = parseInt(offtake.goats?.[0]?.price ?? '0');
    const live = parseInt(offtake.goats?.[0]?.live ?? '0');
    return total + price * live;
  }, 0);

  const uniqueFarmersInOfftake = new Set(filteredOfftakes.map((o) => o.name))
    .size;

  // --- Widgets Configuration ---
  const widgets: WidgetProps[] = [
    {
      title: 'Farmers',
      backgroundColor: 'primary',
      icon: 'people-fill',
      link: '/orders',
      value: totalFarmers,
      description: `M: ${maleFarmers} | F: ${femaleFarmers}`,
    },
    {
      title: 'Animals',
      backgroundColor: 'success',
      icon: 'bar-chart-fill',
      link: '/analytics',
      value: totalAnimals,
      description: `G: ${totalGoats} | S: ${totalSheep}`,
    },
    {
      title: 'Offtake',
      backgroundColor: 'warning',
      icon: 'person-check-fill',
      link: '/users',
      value: uniqueFarmersInOfftake,
      description: `${filteredOfftakes.length} total offtakes`,
    },
    {
      title: 'Revenue',
      backgroundColor: 'danger',
      icon: 'currency-dollar',
      link: '/visitors',
      value: totalRevenue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
      }),
      description: `Per dates`,
    },
  ];

  return (
    <div className="row">
      {widgets.map((widget, index) => (
        <Widget key={index} {...widget} />
      ))}
    </div>
  );
};

export default WidgetsRow;
