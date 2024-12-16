import { FlexRow } from '@Components/common/Layouts';
import RoundedContainer from '@Components/common/RoundedContainer';
import formatNumberWithCommas from '@Utils/formatNumberWithCommas';
import { StackedChartFills } from '../constants';

interface IStackedChartProps {
  title: string;
  data: Record<string, any>;
  className?: string;
  labelAlignment?: 'vertical' | 'horizontal';
}
type IUpdatedData = {
  name: string;
  color: string;
  width: string;
  value: number;
}[];

export default function StackedChart({
  title,
  data,
  className,
  labelAlignment,
}: IStackedChartProps) {
  const total =
    data.reduce(
      (sum: number, item: Record<string, any>) => sum + item.value,
      0,
    ) || 0;

  const updatedData: IUpdatedData = data.map(
    (item: Record<string, any>, index: number) => ({
      ...item,
      width: `${((item.value / total) * 100).toFixed(0)}%`,
      color: StackedChartFills[index],
    }),
  );

  return (
    <RoundedContainer
      className={`flex w-full flex-1 flex-col gap-2.5
      rounded-xl bg-primary-50 px-5 py-3 shadow-md md:!h-28 ${className}`}
    >
      <h5>{title}</h5>
      <FlexRow className="overflow-hidden rounded">
        {updatedData.map(({ name, color, width }) => (
          <div
            key={name}
            className="h-4"
            style={{
              width,
              backgroundColor: color,
            }}
          />
        ))}
      </FlexRow>
      <div
        className={`flex pt-1 ${
          labelAlignment === 'vertical'
            ? 'flex-col gap-2'
            : 'flex-col md:flex-row md:justify-between'
        }`}
      >
        {updatedData.map(({ name, value, color }) => (
          <FlexRow key={value} className="items-center gap-2">
            <div
              className={`h-3 w-3 ${
                labelAlignment === 'vertical' ? 'rounded' : 'rounded-full'
              } `}
              style={{
                backgroundColor: color,
              }}
            />
            <FlexRow
              className={` ${
                labelAlignment === 'vertical' ? ' gap-10' : 'w-full gap-0.5'
              }`}
            >
              <FlexRow
                className={`items-center text-sm capitalize text-grey-800
              ${labelAlignment === 'horizontal' ? 'pt-0.5' : 'w-40'} `}
              >
                {name}
              </FlexRow>
              <h5
                className={` ${
                  labelAlignment === 'vertical' ? 'text-sm' : 'ml-auto'
                }`}
              >
                {formatNumberWithCommas(value)}
              </h5>
            </FlexRow>
          </FlexRow>
        ))}
      </div>
    </RoundedContainer>
  );
}
