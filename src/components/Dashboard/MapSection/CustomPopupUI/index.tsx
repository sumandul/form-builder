/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from 'react';
import { getIndividualMunicipalityWeatherData } from '@Services/common';
import Skeleton from '@Components/RadixComponents/Skeleton';
import hasErrorBoundary from '@Components/common/hasErrorBoundary';
import { splitDateAndTime } from '@Utils/index';
import { Label } from 'recharts';
// import { popupExceptionKeys } from '@src/constants/map';

const exceptions: string[] = [
  'precipitation_color',
  'weathericon',
  'color',
  'layer',
];

interface IPopupUIProps {
  data: Record<string, any> | null;
}
function CustomPopupUI({ data = {} }: IPopupUIProps) {
  const filteredData = Object.fromEntries(
    Object.entries(data || {}).filter(([key]) => !exceptions.includes(key)),
  );

  return (
    <div
      className="scrollbar mt-2 flex h-[15rem] w-full flex-col
    overflow-y-auto  border-y-grey-500 text-grey-800"
    >
      {Object.entries(filteredData)?.map(([key, value]) => (
        <div
          key={key}
          className="flex flex-col items-start justify-between gap-1"
        >
          <p className="text-xs capitalize text-[#757575]">{key}</p>
          <p className="text-sm text-[#333333]">{value}</p>
        </div>
      ))}
    </div>
  );
}

export default hasErrorBoundary(CustomPopupUI);
