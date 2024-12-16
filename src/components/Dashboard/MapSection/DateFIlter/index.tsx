/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { daysButtonLists } from '@Constants/map';
import { setFilterValue } from '@Store/actions/mapActions';
import Spinner from '@Components/common/Spinner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@Components/RadixComponents/Popover';
import { useDispatch } from 'react-redux';
import NewFormControl from '@Components/common/FormUI/NewFormControl';

export type ParamsType = { start_date: string; end_date: string };
export default function DateToolBar({
  islandSlideValuesLoading,
  impactValuesLoading,
}: any) {
  const dispatch = useDispatch();
  const [selectedButton, setSelectedButton] = useState('All');
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [params, setParams] = useState<ParamsType>({
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (selectedButton === 'All') {
      dispatch(setFilterValue({ all_data: true }));
    }
  }, [dispatch, selectedButton]);

  const handleButtonClick = (button: any) => {
    setSelectedButton(button.label);
    if (button.all) {
      dispatch(setFilterValue({ all_data: true }));
    } else {
      dispatch(setFilterValue({ days: button.daysAgo }));
    }
  };

  const handleApplyDates = () => {
    dispatch(setFilterValue(params));
    setIsCalendarOpen(false);
  };

  return (
    <div className="z-50 flex w-fit  rounded-[0.56181rem] bg-white p-0.5">
      {daysButtonLists?.map((button, index) => (
        <button
          key={index}
          type="button"
          className={`relative px-3 py-2    ${
            selectedButton === button.label
              ? 'rounded-lg bg-[#1D49A7] text-sm font-semibold leading-5 text-white'
              : 'naxatw-leading-5 rounded-[0.56181rem] bg-white  text-sm  text-gray-800 transition hover:bg-gray-200'
          }`}
          onClick={() => {
            handleButtonClick(button);
          }}
        >
          {button.label}
        </button>
      ))}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger>
          <button
            type="button"
            className={`relative px-3 py-2    ${
              selectedButton === 'Custom Date'
                ? 'rounded-lg bg-[#1D49A7] text-sm font-semibold leading-5 text-white'
                : 'naxatw-leading-5 rounded-[0.56181rem] bg-white  text-sm  text-gray-800 transition hover:bg-gray-200'
            }`}
            onClick={() => {
              setSelectedButton('Custom Date');
            }}
          >
            Custom Date
          </button>
        </PopoverTrigger>
        <PopoverContent className="bg-white">
          <div>
            <div className="relative rounded-xl ">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="naxatw-mb-1 text-xs text-gray-700">
                    Start Date
                  </label>

                  <NewFormControl
                    noIcon
                    controlType="datePicker"
                    placeholder="Start Date"
                    className="min-w-[9rem]"
                    value={params.start_date}
                    bindvalue={params.start_date}
                    onChange={date =>
                      setParams((prev: any) => ({ ...prev, start_date: date }))
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-xs text-gray-700">End Date</label>

                  <NewFormControl
                    noIcon
                    controlType="datePicker"
                    placeholder="End Date"
                    className="min-w-[9rem]"
                    value={params.end_date}
                    bindvalue={params.end_date}
                    onChange={date =>
                      setParams(prev => ({ ...prev, end_date: date }))
                    }
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-2 text-sm">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-md border border-[#1D49A7] bg-white px-4 py-1 font-medium text-[#1D49A7] transition hover:bg-gray-200"
                  onClick={() =>
                    setParams(prev => ({
                      ...prev,
                      start_date: '',
                      end_date: '',
                    }))
                  }
                >
                  <span className="material-symbols-outlined m-0 pb-0.5 text-lg">
                    replay
                  </span>{' '}
                  Clear Date
                </button>

                <button
                  type="button"
                  className="gap-1justify-center flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-md bg-[#1D49A7] px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                  onClick={handleApplyDates}
                >
                  Apply Date{' '}
                  {islandSlideValuesLoading || impactValuesLoading ? (
                    <Spinner className="!h-4 !w-4" />
                  ) : (
                    ''
                  )}
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* )} */}
    </div>
  );
}
