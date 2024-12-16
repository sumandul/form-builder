/* eslint-disable no-nested-ternary */
import Icon from '@Components/common/Icon';
import hasErrorBoundary from '@Components/common/hasErrorBoundary';
import { cn } from '@Utils/index';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './Command';
import { IComboBoxProps, IDropDownData } from './Dropdown';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

function Combobox({
  options = [],
  value,
  choose = 'id',
  multiple = false,
  onChange,
  onFocus,
  disabled,
  placeholder = 'Choose',
  dropDownSize = 'drop-lg',
  triggerClassName,
}: IComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [dropDownWidth, setDropDownWidth] = React.useState<number | undefined>(
    0,
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredData, setFilteredData] = useState(options);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    setDropDownWidth(triggerRef.current?.clientWidth);
  }, [triggerRef.current?.clientWidth]);

  useEffect(() => {
    const debounceInstance = setTimeout(() => {
      setFilteredData([...options]);
      if (searchQuery.length) {
        const newOptions = options.filter(
          item =>
            // @ts-ignore
            item.value?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            item.label?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
        );
        setFilteredData(newOptions);
      } else setFilteredData(options);
    }, 300);

    return () => clearTimeout(debounceInstance);
  }, [searchQuery, options]);

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
    } else {
      const selectedValue = currentValue === value ? '' : currentValue;
      if (onChange) onChange(selectedValue);
      setOpen(false);
    }
    setSearchQuery('');
  };

  // useEffect(() => {
  //   if(options.length <)
  //   handleSelect();
  // }, [options]);

  const hanldeselectall = (event: React.ChangeEvent<HTMLInputElement>) => {
    const munipalityCode = options
      .filter((item: any) => item.value !== undefined)
      .map((item: any) => item.value);

    const isChecked = event.target.checked; // Get the checked value of the checkbox
    if (isChecked) {
      const indices = [];
      for (let index = 1; index < options.length; index++) {
        indices.push(munipalityCode); // Collect indices from 1 to length - 1
      }
      onChange?.(munipalityCode); // Send the array of indices
    } else {
      onChange?.([]); // Send an empty array to clear the selection
    }
  };

  // console.log(options);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        ref={triggerRef}
        disabled={disabled}
        className={cn('w-full', triggerClassName)}
      >
        <Button
          variant={disabled ? 'ghost' : 'drop'}
          size={dropDownSize}
          role="combobox"
          aria-expanded={open}
          // className="flex items-center justify-between pr-3"
          className={cn(
            'flex items-center justify-between gap-1 bg-white',
            triggerClassName,
          )}
        >
          {multiple ? (
            <div className="flex flex-wrap">
              {Array.isArray(value) && value.length > 0 ? (
                <span>
                  {value.length} {placeholder} selected
                </span>
              ) : (
                <span className="opacity-50">Select options...</span>
              )}
            </div>
          ) : (
            <p className="line-clamp-1">
              {value ? (
                options.find(
                  (option: IDropDownData) =>
                    option[choose as keyof IDropDownData] === value,
                )?.label
              ) : (
                <span className="opacity-50">{placeholder}</span>
              )}
            </p>
          )}
          <Icon
            name="arrow_drop_down"
            className=" flex h-4 w-4 shrink-0 items-center justify-center opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-[15rem] w-full bg-white p-[0px] "
        style={{ width: `${dropDownWidth}px` }}
      >
        <Command className="m-0 p-0">
          <CommandInput
            placeholder="Search data..."
            value={searchQuery}
            onChangeCapture={(e: ChangeEvent<any>) => {
              setSearchQuery(e.target.value);
            }}
          />
          {/* {!filteredData.length && (
            <div className="px-2 py-1 text-gray-500 font-extralight">No match found!</div>
          )} */}
          <CommandEmpty>No match found.</CommandEmpty>
          <CommandGroup className="scrollbar max-h-[12rem] overflow-y-auto">
            {filteredData.map((option: IDropDownData) => {
              return (
                <>
                  {option.label !== 'All' ? (
                    <CommandItem
                      key={option.label}
                      onSelect={() =>
                        handleSelect(option[choose as keyof IDropDownData])
                      }
                      // @ts-ignore
                      value={option.value}
                      className="cursor-pointer"
                    >
                      {/* <input type="checkbox" className=" mr-1" /> */}
                      <input
                        type="checkbox"
                        className=" mr-2 accent-blue-700"
                        checked={
                          multiple
                            ? Array.isArray(value) &&
                              value.includes(
                                option[choose as keyof IDropDownData],
                              )
                            : value === option[choose as keyof IDropDownData]
                        }
                        onChange={() =>
                          handleSelect(option[choose as keyof IDropDownData])
                        }
                      />

                      {option.label}
                    </CommandItem>
                  ) : (
                    <CommandItem
                      key={option.label}
                      // value={option.value}
                      className="cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        onChange={hanldeselectall}
                        className=" mr-2 accent-blue-700"
                      />
                      {option.label}
                    </CommandItem>
                  )}
                </>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default hasErrorBoundary(Combobox);
