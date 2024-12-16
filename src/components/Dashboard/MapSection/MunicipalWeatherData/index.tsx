/* eslint-disable react/no-array-index-key */
// import RadioButton from '@Components/RadixComponents/RadioButton';
// import React, { useState } from 'react';
// import { getIndividualMunicipalityWeatherData } from '@Services/common';
// import { useQuery } from '@tanstack/react-query';

// function MunicipalWeatherData(popupMunicipality: any) {
//   const [selectedSource, setSelectedSource] = useState<string | null>(null);
//   const [popUp, setPopUp] = useState(true);

//   const onPopupClose = () => {
//     setPopUp(false);
//     setSelectedSource(null);
//   };

//   const datas = Object.entries(popupMunicipality.popupMunicipality).map(
//     ([key, value]) => ({
//       key,
//       value,
//     }),
//   );

//   const municipalityCodeObj = datas.find(
//     item => item.key === 'municipality_code',
//   );
//   const municipalityCode = municipalityCodeObj ? municipalityCodeObj.value : '';

//   const { data: weatherData } = useQuery({
//     queryKey: selectedSource
//       ? ['openweather-data', selectedSource, datas]
//       : undefined,
//     queryFn: () =>
//       getIndividualMunicipalityWeatherData({
//         municipality_code: municipalityCode,
//       }),
//     enabled: selectedSource === 'openweather',
//   });

//   const data = weatherData?.data?.hits?.[0]?.fields
//     ? Object.entries(weatherData.data.hits[0].fields).map(([key, value]) => ({
//         key: key
//           .replace(/[._]/g, ' ')
//           .replace(/\b\w/g, char => char.toUpperCase()),
//         value,
//       }))
//     : [];

//   return (
//     <>
//       {popUp && (
//         <>
//           <div className="absolute right-14 top-14 z-10 h-3/4 w-[22%] rounded-lg bg-white pb-4">
//             <h5 className="pb-1 pl-3 pt-1">
//               {datas?.map((item, index) => {
//                 if (item.key === 'municipality_name') {
//                   return <div key={index}>{item.value}</div>;
//                 }
//                 return null;
//               })}
//             </h5>
//             <div className="w-11/12 overflow-hidden overflow-x-auto px-2">
//               <RadioButton
//                 bindvalue={selectedSource}
//                 options={[
//                   { id: 1, label: 'WeatherApi', value: 'weatherapi' },
//                   { id: 2, label: 'OpenWeather', value: 'openweather' },
//                   { id: 3, label: 'windy', value: 'windy' },
//                 ]}
//                 onChange={value => setSelectedSource(value)}
//                 buttonSize="lg"
//                 choose="value"
//               />
//             </div>
//             <div className="h-[86%] overflow-y-auto">
//               <div className="px-4">
//                 {data.map((item, index) => (
//                   <div key={index}>
//                     <div className="text-sm font-medium capitalize text-gray-500">
//                       {item.key}
//                     </div>
//                     <div className="pt-1 text-[14px]">
//                       {item.value}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <span
//               role="button"
//               tabIndex={0}
//               className="absolute right-3 top-2 text-grey-600"
//               onClick={onPopupClose}
//               onKeyDown={() => {}}
//             >
//               <i className="material-symbols-outlined">close</i>
//             </span>
//           </div>
//         </>
//       )}
//     </>
//   );
// }
// export default MunicipalWeatherData;

import React, { useState } from 'react';
import {
  getIndividualMunicipalityWeatherData,
  hcwaveForecastObservation,
} from '@Services/common';
import { useQuery } from '@tanstack/react-query';

interface PopupMunicipalityProps {
  popupMunicipality: {
    [key: string]: string | number | any;
  };
}

interface DataItem {
  key: string;
  value: string | number;
}

function MunicipalWeatherData({ popupMunicipality }: PopupMunicipalityProps) {
  const [popUp, setPopUp] = useState(true);
  const municipalId = popupMunicipality?.id || {};

  const onPopupClose = () => {
    setPopUp(false);
  };

  const datas: DataItem[] = Object.entries(municipalId).map(([key, value]) => ({
    key,
    value: typeof value === 'string' || typeof value === 'number' ? value : '',
  }));

  const municipalityCodeObj = datas.find(
    item => item.key === 'municipality_code',
  );
  const municipalityCode = municipalityCodeObj ? municipalityCodeObj.value : '';

  const { data: weatherData } = useQuery({
    queryKey: ['openweather-data', datas],
    enabled: !!municipalityCode,
    queryFn: () =>
      getIndividualMunicipalityWeatherData({
        municipality_code: municipalityCode,
      }),
  });
  const temperature = weatherData?.data?.hits?.[0]?.fields?.['main.temp'] || [];

  const { data: windyData } = useQuery({
    queryKey: ['windy-data', datas],
    enabled: !!municipalityCode,
    queryFn: () =>
      hcwaveForecastObservation({
        source: 'windy',
        hours: 3,
        municipality_code: municipalityCode,
      }),
  });

  const temperature2 = windyData?.data?.map((item: any) => item.temp) || [];
  const precipitation2 = windyData?.data?.map((item: any) => item.precip) || [];

  const { data: weatherApiData } = useQuery({
    queryKey: ['weatherApi-data', datas],
    queryFn: () =>
      hcwaveForecastObservation({
        source: 'weatherapi_forecast',
        hours: 1,
        municipality_code: municipalityCode,
      }),
  });

  const temperature3 =
    weatherApiData?.data?.map((item: any) => item['current.temp_c']) || [];
  const precipitation3 =
    weatherApiData?.data?.map((item: any) => item['current.precip_mm']) || [];

  if (!Object.keys(municipalId).length) return <></>;

  return (
    <>
      {popUp && (
        <div className="scrollbar absolute right-6 top-14 z-10 h-fit max-h-[50vh] w-1/5 overflow-y-auto rounded-lg bg-white pb-4 ">
          <h5 className="pb-1 pl-3 pt-1">
            {datas?.map((item: DataItem, index: number) => {
              if (item.key === 'municipality_name') {
                return <div key={index}>{item.value.toString()}</div>;
              }
              return null;
            })}
          </h5>
          <h6 className="bg-white pb-1 pl-4">Temperature</h6>
          <div className="px-5 text-sm">
            {temperature.map((temp: any, index: number) => (
              <div key={index} className="flex justify-between">
                <div>Openweather :</div>
                <div className="text-right">{temp}°C</div>
              </div>
            ))}
          </div>

          <div className="px-5 text-sm">
            {temperature2.map((temp: any, index: number) => (
              <div key={index} className="flex justify-between">
                <div>Windy :</div>
                <div className="text-right">{temp}°C</div>
              </div>
            ))}
          </div>
          <div className="px-5 text-sm">
            {temperature3.map((temp: any, index: number) => (
              <div key={index} className="flex justify-between">
                <div>WeatherApi :</div>
                <div className="text-right">{temp}°C</div>
              </div>
            ))}
          </div>
          <h6 className="pb-1 pl-4 pt-2">Precipitation</h6>
          <div className="px-5 text-sm">
            {precipitation2.map((precip: any, index: number) => (
              <div key={index} className="flex justify-between">
                <div>Windy :</div>
                <div className="text-right">{precip} mm</div>
              </div>
            ))}
          </div>
          <div className="px-5 text-sm">
            {precipitation3.map((precip: any, index: number) => (
              <div key={index} className="flex justify-between">
                <div>WeatherApi :</div>
                <div className="text-right">{precip} mm</div>
              </div>
            ))}
          </div>
          <span
            role="button"
            tabIndex={0}
            className="absolute right-3 top-2 text-grey-600"
            onClick={onPopupClose}
            onKeyDown={() => {}}
          >
            <i className="material-symbols-outlined">close</i>
          </span>
        </div>
      )}
    </>
  );
}

export default MunicipalWeatherData;
