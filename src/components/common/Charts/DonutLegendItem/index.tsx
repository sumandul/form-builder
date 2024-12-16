import { IDonutLegendItemProps } from '../types';

export default function DonutLegendItem({
  color,
  name,
  percentage,
}: IDonutLegendItemProps) {
  return (
    <div className="flex items-start justify-between text-sm text-grey-800">
      <div className="legend-box-name flex flex-grow items-start justify-items-start gap-2">
        <div
          className="my-[2px] min-h-[16px] min-w-[16px] rounded"
          style={{
            backgroundColor: color,
          }}
        />
        <div className="name button text-start font-normal ">{name}</div>
      </div>
      <div className="value-percentage flex min-w-[2rem] items-center justify-end gap-2 font-bold">
        <div className="button min-w-[60px] max-w-[60px] whitespace-nowrap text-start ">
          {Number(percentage)?.toFixed(1)} %
        </div>
      </div>
    </div>
  );
}
