import LegendItem from '../LegendItem';
import DonutLegendItem from '../DonutLegendItem';
import { ILegendProps, PieChartDataItem } from '../types';
import {
  calculatePercentage,
  removeKeyFromObject,
  getSumOfKey,
} from '../utils';

export default function ChartLegend<T>({
  data,
  type = 'bar',
  fills = ['#418FDE', '#FF671F'],
}: ILegendProps<T>) {
  if (type === 'donut') {
    const maxValue = getSumOfKey(data as PieChartDataItem[], 'value');
    return (
      <div className="w-full ">
        <div className="cover scrollbar flex max-h-[140px] flex-col justify-start gap-4 overflow-y-auto">
          {data.map((key: any, index: any) => (
            <DonutLegendItem
              key={key.name}
              color={fills[index] || '#0088F8'}
              name={key.name}
              value={key.value}
              percentage={calculatePercentage(
                maxValue || 0,
                key.value ? key.value : 0,
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  const keys: string[] = Object.keys(
    removeKeyFromObject(data[0], 'name' as keyof (typeof data)[0]),
  );
  return (
    <div className="flex w-full justify-center ">
      <div className="cover flex gap-4 ">
        {keys.map((key, index) => (
          <LegendItem key={key} color={fills[index] || '#0088F8'} name={key} />
        ))}
      </div>
    </div>
  );
}
