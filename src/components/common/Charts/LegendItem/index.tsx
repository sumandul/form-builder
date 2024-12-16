import { ILegendItemProps } from '../types';

export default function LegendItem({ color, name }: ILegendItemProps) {
  return (
    <button type="button" className="flex items-center justify-center gap-2">
      <span
        className="h-[16px] w-[16px] rounded "
        style={{
          background: color,
        }}
      />
      <p className="text-sm">{name}</p>
    </button>
  );
}
