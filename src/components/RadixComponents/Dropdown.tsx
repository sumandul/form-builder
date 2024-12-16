/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef } from 'react';
import { cn } from '@Utils/index';
import { IRegisterProps } from '@Components/common/MapComponents/Schemas';
import Icon from '@Components/common/Icon';
import hasErrorBoundary from '@Components/common/hasErrorBoundary';
import { Button } from './Button';
import { Command, CommandGroup, CommandItem } from './Command';
import { PopoverTrigger, Popover, PopoverContent } from './Popover';

export interface IDropDownData {
  label: string;
  value: string | boolean | number;
  id?: string | number;
  code?: string;
}

export interface IComboBoxProps extends Partial<IRegisterProps> {
  options: IDropDownData[];
  choose?: string;
  multiple?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  dropDownSize?:
    | 'lg'
    | 'sm'
    | 'lg-icon'
    | 'sm-icon'
    | 'drop-lg'
    | 'drop-sm'
    | 'drop-md';
  triggerClassName?: string;
}
function Dropdown({
  options = [],
  multiple = false,
  choose = 'id',
  // bindvalue,
  value,
  placeholder,
  onChange,
  onFocus,
  id,
  className,
  disabled,
  isLoading = false,
  dropDownSize = 'drop-lg',
}: IComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState(bindvalue);
  const [dropDownWidth, setDropDownWidth] = React.useState<number | undefined>(
    0,
  );
  const handleSelect = (currentValue: any) => {
    if (onFocus) onFocus();

    if (multiple) {
      const selectedValues = Array.isArray(value) ? [...value] : [];
      const selectedIndex = selectedValues.indexOf(currentValue);
      if (selectedIndex === -1) {
        selectedValues.push(currentValue);
      } else {
        selectedValues.splice(selectedIndex, 1);
      }
      if (onChange) {
        onChange(selectedValues);
      }
      // setValue(selectedValues);
    } else {
      const selectedValue = currentValue === value ? '' : currentValue;
      // setValue(selectedValue);
      if (onChange) {
        onChange(selectedValue);
      }
      setOpen(false);
    }
  };

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    setDropDownWidth(triggerRef.current?.clientWidth);
  }, [triggerRef.current?.clientWidth]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild ref={triggerRef} disabled={disabled}>
        <Button
          id={id}
          variant={disabled ? 'ghost' : 'drop'}
          size={dropDownSize}
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex items-center justify-between gap-1 bg-white',
            className,
          )}
          onClick={() => setOpen(true)}
        >
          {multiple ? (
            <div className="flex flex-wrap">
              {Array.isArray(value) && value.length > 0 ? (
                <p className=" line-clamp-1 font-medium text-gray-500">
                  {value.length} Selected
                </p>
              ) : (
                <p className=" body-md line-clamp-1 px-0  text-left text-gray-400">
                  {placeholder || 'Choose'}
                </p>
              )}
            </div>
          ) : (
            <>
              {value ? (
                <p className=" body-md  line-clamp-1 text-left font-medium text-gray-800">
                  {options.find(
                    (option: IDropDownData) =>
                      option[choose as keyof IDropDownData] === value,
                  )?.label || 'No Name Found'}
                </p>
              ) : (
                <p className=" body-md  line-clamp-1 px-0 text-left text-gray-400">
                  {placeholder || 'Choose'}
                </p>
              )}
            </>
          )}
          <Icon
            name="arrow_drop_down"
            className="flex h-4 w-4 shrink-0 items-center justify-center text-gray-800 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="scrollbar block max-h-[10rem] overflow-y-auto bg-white p-[0px]"
        style={{ width: `${dropDownWidth}px` }}
      >
        <Command className="m-0 p-0">
          {isLoading && <p>Loading ...</p>}
          <CommandGroup className="">
            {options.length ? (
              options.map((option: IDropDownData) => (
                <CommandItem
                  key={option.value?.toString()}
                  onSelect={() =>
                    handleSelect(option[choose as keyof IDropDownData])
                  }
                  className="cursor-pointer"
                >
                  {/* {multiple ? (
                  <Icon
                    iconName={`${
                      Array.isArray(value) && value.includes(option[choose] as T)
                        ? 'check_box'
                        : 'check_box_outline_blank'
                    }`}
                    className={`mr-[1px] text-[20px]
                    ${
                      Array.isArray(value) && value.includes(option[choose] as T)
                        ? 'text-green-600'
                        : 'text-gray-600'
                    } `}
                  />
                ) : (
                  <Icon
                    iconName="done"
                    className={`mr-[1px] text-[20px] ${
                      value === option[choose] ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )} */}
                  <Icon
                    name="done"
                    className={`mr-[1px] text-[20px] ${
                      !multiple
                        ? value === option[choose as keyof IDropDownData]
                          ? 'opacity-100'
                          : 'opacity-0'
                        : Array.isArray(value) &&
                          value.includes(option[choose as keyof IDropDownData])
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  />
                  {option.label}
                </CommandItem>
              ))
            ) : (
              <div className="flex h-[4.25rem] items-center justify-center text-gray-400">
                No Data Found.
              </div>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export default hasErrorBoundary(Dropdown);
