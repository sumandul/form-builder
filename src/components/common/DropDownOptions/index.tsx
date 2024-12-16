/* eslint-disable react/no-array-index-key */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  //   DropdownMenuLabel,
  //   DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@Components/RadixComponents/DropDownMenu';

interface IDropdownOptionsProps {
  options: Record<string, any>[];
  data: Record<string, any>;
}

export default function DropdownOptions({
  options,
  data,
}: IDropdownOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title="Menu"
        className="group flex items-center rounded p-0.5 hover:bg-[#F5F5F5] data-[state=open]:bg-[#F5F5F5]"
      >
        <span className="material-icons -mr-1 group-hover:text-grey-600 ">
          more_vert
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator /> */}
        <div className="divide-y-2">
          {options.map((option, index: number) => {
            if (option.name === 'Zoom to Layer' && !data.bbox) return <></>;
            return (
              <DropdownMenuItem
                key={index}
                onClick={() => option.onClick(data)}
              >
                <div className="flex gap-x-3">
                  {option.icon ? option.icon : null}
                  {option.name}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
