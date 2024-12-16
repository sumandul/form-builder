import { IChartProps } from '../types';
import HorizontalBarLabel from '../HorizontalBarLabel';
import { calculatePercentageAndInjectValue } from '../utils';

export default function HorizontalBarChart({ data }: IChartProps) {
  const finalData = data
    ? calculatePercentageAndInjectValue(data, 'value')
    : [];
  return (
    <div className="in-label scrollbar h-full w-full overflow-auto">
      <div className="cover flex w-full flex-col gap-2  pr-2">
        {finalData?.map((item: any) => (
          <HorizontalBarLabel
            key=""
            width={item?.percentage}
            value={item?.value}
            label={item?.name}
          />
        ))}
      </div>
    </div>
  );
}
