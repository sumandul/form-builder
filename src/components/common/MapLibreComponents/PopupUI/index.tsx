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

const exceptions: string[] = [];

interface IPopupUIProps {
  data: Record<string, any> | null;
}
function PopupUI({ data = {} }: IPopupUIProps) {
  if (!data?.municipal) return <></>;

  const municipalData: Record<string, any> = data.municipal.hits[0].fields;

  function extractWeatherProperties(weatherData: Record<string, any>) {
    const requiredWeatherProperties: Record<string, any> = {
      'main.temp': 'Temperature',
      'main.temp_max': 'Max Temperature',
      'main.humidity': 'Humidity',
      'main.feels_like': 'Feels Like',
      'main.temp_min': 'Min Temperature',
      'wind.speed': 'Wind Speed',
    };

    return Object.entries(requiredWeatherProperties).reduce(
      (acc: Record<string, any>, [key, label]: any) => {
        acc[label] = weatherData[key]?.[0] || null;
        return acc;
      },
      {},
    );
  }
  const filterMunicipalData = municipalData
    ? extractWeatherProperties(municipalData)
    : {};

  return (
    <div
      className="scrollbar mt-2 flex h-[15rem] w-full flex-col
    overflow-y-auto  border-y-grey-500 text-grey-800"
    >
      {Object.entries(filterMunicipalData)?.map(([key, value]) => {
        // if (key === 'timestamp_local_django') {
        //   return (
        //     <div
        //       key={key}
        //       className="flex flex-col items-start justify-between gap-1"
        //     >
        //       <p className="text-xs text-[#757575]">{key}</p>
        //       <p className="text-sm text-[#333333]">
        //         {splitDateAndTime(value)[0]} | {splitDateAndTime(value)[1]}
        //       </p>
        //     </div>
        //   );
        // }
        return (
          <div
            key={key}
            className="flex flex-col items-start justify-between gap-1"
          >
            <p className="text-xs text-[#757575]">{key}</p>
            <p className="text-sm text-[#333333]">{value}</p>
          </div>
        );
      })}
    </div>
  );
}

export default hasErrorBoundary(PopupUI);
