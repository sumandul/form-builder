/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { format, isValid, parse } from 'date-fns';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@Utils/index';
import Icon from '@Components/common/Icon';
import { Calendar } from './Calendar';
import { IDatePickerProps } from './_lib_';
import { Popover, PopoverContent } from '../Popover';
import Input from '../Input';
import { Button } from '../Button';

// /**
//  *  This code exports a default function called `DatePicker` that takes an optional boolean prop
//  * `canType`. It uses React hooks to manage state for the selected date and a typed date input.
//  */
// export default function DatePicker({
//   canType = false,
//   onChange,
//   bindvalue,
//   id,
//   placeholder,
//   disabled = false,
// }: IDatePickerProps) {
//   const [date, setDate] = React.useState<Date>();
//   const [typedDate, setTypedDate] = React.useState<any>();

//   useEffect(() => {
//     setDate(bindvalue);
//     setTypedDate(bindvalue);
//   }, [bindvalue]);

//   const handleTypedDate = (e: any) => {
//     const passedTypedDate = e.target.value;
//     setTypedDate(passedTypedDate);
//     const parsedDate = parse(passedTypedDate, 'yyyy-MM-dd', new Date());

//     if (isValid(parsedDate)) setDate(parsedDate);
//     if (onChange) onChange(parsedDate);
//   };

//   const handleCalendarSelect = (data: any) => {
//     setDate(data);
//     setTypedDate((prev: any) =>
//       data ? format(new Date(data), 'yyyy-MM-dd') : prev,
//     );
//     if (onChange)
//       onChange(data ? format(new Date(data), 'yyyy-MM-dd') : typedDate);
//   };

//   return (
//     <Popover>
//       <PopoverTrigger asChild id={id} className="hover:bg-teal-green-50">
//         {canType ? (
//           <Input
//             type="text"
//             hasIcon
//             rightIconName="calendar_month"
//             leftIconName="arrow_drop_down"
//             value={typedDate}
//             onChange={handleTypedDate}
//             placeholder={placeholder}
//             disabled={disabled}
//           />
//         ) : (
//           <Button
//             variant="secondary"
//             className={cn(
//               'flex w-fit items-center justify-between gap-2 !px-[0.75rem] text-left font-normal',
//               !date && '',
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date ? (
//               <span className="flex-1">
//                 {format(new Date(date), 'yyyy-MM-dd')}
//               </span>
//             ) : (
//               <span className="flex-1">Pick a date</span>
//             )}
//             <Icon
//               name="arrow_drop_down"
//               // className={cn('text-2xl px-[12px]', iconStyle)}
//               // onClick={onClick}
//             />
//             {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
//           </Button>
//         )}
//       </PopoverTrigger>
//       <PopoverContent className="w-full bg-white !p-[0px]">
//         <Calendar
//           mode="single"
//           selected={date}
//           onSelect={handleCalendarSelect}
//           initialFocus
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }

/**
 *  This code exports a default function called `DatePicker` that takes an optional boolean prop
 * `canType`. It uses React hooks to manage state for the selected date and a typed date input.
 */
export default function DatePicker({
  className,
  canType = false,
  onChange,
  bindvalue,
  id,
  placeholder,
  disabled = false,
  mode = 'single',
  noIcon,
}: IDatePickerProps) {
  const [date, setDate] = React.useState<Date>();

  const [typedDate, setTypedDate] = React.useState<any>();
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  useEffect(() => {
    if (!bindvalue) {
      // reset calendar value on value reset
      setDate(
        // @ts-ignore
        mode === 'range' ? { from: undefined, to: undefined } : undefined,
      );
      if (onChange) onChange('');
      return;
    }
    const dateArray = bindvalue.split('/');

    if (dateArray.length > 1) {
      // @ts-ignore
      setDate({ from: new Date(dateArray[0]), to: new Date(dateArray[1]) });
    } else {
      setDate(new Date(bindvalue));
    }
    setTypedDate(bindvalue);
  }, [bindvalue]);

  const handleTypedDate = (e: any) => {
    const passedTypedDate = e.target.value;
    setTypedDate(passedTypedDate);
    const parsedDate = parse(passedTypedDate, 'yyyy-MM-dd', new Date());

    if (isValid(parsedDate)) setDate(parsedDate);
    if (onChange) onChange(parsedDate);
  };

  const handleCalendarSelect = (data: any) => {
    setDate(data);
    setTypedDate((prev: any) => (data ? format(data, 'yyyy-MM-dd') : prev));
    if (onChange) onChange(data ? format(data, 'yyyy-MM-dd') : typedDate);
  };

  const handleRangeSelect = (data: any) => {
    if (onChange)
      onChange(
        `${format(data.from, 'yyyy-MM-dd')}/${format(data.to, 'yyyy-MM-dd')}`,
      );
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger
        asChild
        id={id}
        className="hover:bg-teal-green-50"
        disabled={disabled}
      >
        {canType ? (
          <Input
            type="text"
            hasIcon
            rightIconName="calendar_month"
            leftIconName="arrow_drop_down"
            value={typedDate}
            onChange={handleTypedDate}
            placeholder={placeholder}
            disabled={disabled}
          />
        ) : (
          <Button
            variant={disabled ? 'ghost' : 'drop'}
            className={cn(
              `flex w-full items-center justify-between gap-2 !border-gray-400 bg-white !px-[0.75rem] text-left font-normal !text-gray-800 ${className}`,
              !date && '',
            )}
          >
            {!noIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
            {mode === 'range' && date ? (
              <span className="flex-1">
                {/*
// @ts-ignore */}
                {format(new Date(date?.from), 'yyyy/MM/dd')} <b>-</b>{' '}
                {/*
// @ts-ignore */}
                {date.to ? format(new Date(date?.to), 'yyyy/MM/dd') : ''}
              </span>
            ) : date ? (
              <span className="flex-1">
                {format(new Date(date), 'yyyy-MM-dd')}
              </span>
            ) : (
              <span className="flex-1">{placeholder || 'Pick a date'}</span>
            )}
            <Icon
              name="arrow_drop_down"
              // className={cn('text-2xl px-[12px]', iconStyle)}
              // onClick={onClick}
            />
            {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-full bg-white !p-[0px]">
        {mode === 'range' ? (
          <Calendar
            mode="range"
            selected={date}
            onSelect={(value: Date) => {
              // handleCalendarSelect(value);
              setDate(value);
              // @ts-ignore
              if (value?.to) {
                handleRangeSelect(value);
                // setIsCalendarOpen(false);
              }
            }}
          />
        ) : (
          <Calendar
            mode="single"
            selected={date}
            onSelect={(value: Date) => {
              handleCalendarSelect(value);
              setIsCalendarOpen(false);
            }}
            initialFocus
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
