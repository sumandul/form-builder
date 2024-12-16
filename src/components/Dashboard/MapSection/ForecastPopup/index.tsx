/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from 'react';
import { getIndividualMunicipalityWeatherData } from '@Services/common';
import Skeleton from '@Components/RadixComponents/Skeleton';
import hasErrorBoundary from '@Components/common/hasErrorBoundary';
import { splitDateAndTime } from '@Utils/index';
// import { popupExceptionKeys } from '@src/constants/map';

const exceptions: string[] = [];

interface IForecastPopupProps {
  data: Record<string, any> | null;
}
function ForecastPopup({ data = {} }: IForecastPopupProps) {
  if (!data?.weather) return <></>;
  const weatherData: Record<string, any> = data.weather;

  function titledWeatherProperties(forecastData: Record<string, any>) {
    const requiredWeatherProperties: Record<string, any> = {
      temperature: 'Temperature',
      description: 'Description',
      feels_like: 'Feels Like',
      humidity: 'Humidity',
      precipitation: 'Precipitation',
    };

    return Object.entries(requiredWeatherProperties).reduce(
      (acc: Record<string, any>, [key, label]: any) => {
        acc[label] = forecastData[key] || null;
        return acc;
      },
      {},
    );
  }
  const filterForecastMunicipalData = weatherData
    ? titledWeatherProperties(weatherData)
    : {};

  return (
    <div
      className="scrollbar mt-2 flex h-[15rem] w-full flex-col
    overflow-y-auto  border-y-grey-500 text-grey-800"
    >
      {Object.keys(filterForecastMunicipalData).length ? (
        Object.entries(filterForecastMunicipalData).map(([key, value]) => {
          return (
            <div
              key={key}
              className="flex flex-col items-start justify-between gap-1"
            >
              <p className="text-xs text-[#757575]">{key}</p>
              <p className="text-sm text-[#333333]">{value || '-'}</p>
            </div>
          );
        })
      ) : (
        <p>No Data Available</p>
      )}
    </div>
  );
}

export default hasErrorBoundary(ForecastPopup);
