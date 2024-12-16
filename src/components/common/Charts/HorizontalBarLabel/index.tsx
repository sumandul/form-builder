interface IHorizontalLabelProps {
  width: number;
  value: string;
  label: string;
}

export default function HorizontalBarLabel({
  width,
  value,
  label,
}: IHorizontalLabelProps) {
  return (
    <div className="bar group relative h-8 w-full">
      <div
        className="fill h-full  rounded-r-lg bg-blue-200 bg-opacity-50
         transition-all duration-500 ease-in-out group-hover:border "
        style={{ width: `${width}%` }}
      />
      <div className="content absolute  top-1/2 -translate-y-1/2 translate-x-2">
        <div className="cover flex h-full items-center justify-center gap-4">
          <p className="value text-sm font-semibold text-grey-800">{value}</p>
          <p className="label line-clamp-1 text-sm text-grey-800">{label}</p>
        </div>
      </div>
    </div>
  );
}
