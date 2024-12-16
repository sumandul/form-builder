/* eslint-disable no-unsafe-optional-chaining */
import {
  getOpenWeatherForecastData,
  hcwaveForecastObservation,
  hiwat,
  rainfallData,
  riverData,
} from '@Services/common';
import { useQuery } from '@tanstack/react-query';
import { roundToNthDecimal } from '@Utils/index';
import {
  getPrecipitationColorForValue,
  getTempColorForValue,
} from '@Utils/map';

interface IUseMapSectionData {
  forecastInterval: string;
  rainInterval: number;
  selectedDay: string;
}

export default function useMapSectionData({
  forecastInterval,
  rainInterval,
  selectedDay,
}: IUseMapSectionData) {
  // Get the temperature data based on hours from the slider to plot the choropeth map
  const {
    data: forecastObservationData,
    isSuccess: isForecastObservationDataSuccess,
    isLoading: isOpenweatherForecastLoading,
  } = useQuery({
    queryKey: ['forecastObservation', forecastInterval],
    queryFn: () =>
      hcwaveForecastObservation({
        hour: forecastInterval,
        source: 'openweather_forecast',
      }),
    select: (res: Record<string, any>) => {
      const payload: Record<string, any>[] = res.data;
      return payload;
      // return [
      //   ...payload?.map((data: Record<string, any>) => {
      //     return {
      //       type: 'Feature',
      //       properties: {
      //         temperature: data['main.temp'],
      //         municipality_code: data.municipality_code,
      //         weathericon: data['weather.icon'],
      //         precipitation: data['rain.3h'],
      //         municipality_name: data.municipality_name,
      //         color: getTempColorForValue(data['main.temp']),
      //         precipitation_color: getColorForValue(data['rain.3h'] || 0),
      //       },

      //       geometry: {
      //         type: 'Point',
      //         coordinates: [data.long, data.lat],
      //       },
      //     };
      //   }),
      // ];
    },
    cacheTime: 0,
  });

  const {
    data: weatherapiForecastData,
    isSuccess: isWeatherapiForecastSuccess,
    isLoading: isWeatherapiForecastLoading,
  } = useQuery({
    queryKey: ['weatherapi-forecast-data', forecastInterval],
    queryFn: () =>
      hcwaveForecastObservation({
        hour: forecastInterval,
        source: 'weatherapi_forecast',
      }),
    select: (res: Record<string, any>) => {
      const payload: Record<string, any>[] = res.data;

      return payload;
    },
    cacheTime: 0,
  });

  const {
    data: dhmRiverData,
    isSuccess: dhmRiverSuccess,
    isLoading: isDhmRiverLoading,
  } = useQuery({
    queryKey: ['dhm-river-data'],
    queryFn: riverData,
    select: (res: Record<string, any>) => {
      const payload: Record<string, any> = res.data;
      return [
        // eslint-disable-next-line no-shadow
        ...payload?.data.map((data: Record<string, any>) => {
          return {
            type: 'Feature',
            properties: {
              name: data.name,
              waterLevel: roundToNthDecimal(data?.waterLevel?.value || 0),
              warning: data.warning_level,
              basin: data.basin,
              district: data.district,
              station: data.stationIndex,
              layer: 'dhm-rain-data-precipitation',
              key: 'forecast-temperature-weatherapi',
              type: 'precipitation',
              precipitation_color: getPrecipitationColorForValue(
                data?.waterLevel?.value || 0,
              ),
            },
            geometry: {
              type: 'Point',
              coordinates: [data?.longitude, data?.latitude],
            },
          };
        }),
      ];
    },
    cacheTime: 0,
  });

  const {
    data: dhmRainData,
    isSuccess: dhmRainSuccess,
    isLoading: isDhmRainLoading,
  } = useQuery({
    queryKey: ['dhm-rain-data', rainInterval],
    cacheTime: 0,
    queryFn: rainfallData,
    select: (res: Record<string, any>) => {
      const payload: Record<string, any> = res.data;
      return [
        // eslint-disable-next-line no-shadow
        ...payload?.data.map((data: Record<string, any>) => {
          const rain =
            data.averages.find(
              (avg: Record<string, any>) => avg.interval === rainInterval,
            )?.value || 0;

          return {
            type: 'Feature',
            properties: {
              name: data.title,
              basin: data.basin,
              rainValue: rain || 0,
              station: data.station_series_id,
              timestamp: data.timestamp,
              status: data.status,
              layer: 'dhm-rain-data-precipitation',
              code: data.district_code,
              type: 'precipitation',
              precipitation_color: getPrecipitationColorForValue(rain || 0),
            },
            geometry: {
              type: 'Point',
              coordinates: [data?.lat, data?.long],
            },
          };
        }),
      ];
    },
  });

  const {
    data: hiwatData,
    isSuccess: hiwatSuccess,
    isLoading: isHiwatLoading,
  } = useQuery({
    queryKey: ['hiwat-data', selectedDay, forecastInterval],
    cacheTime: 0,
    queryFn: () =>
      hiwat({
        source: 'hkh_weather_data',
        hour: forecastInterval,
      }),
    // hiwat({ source: 'hkh_weather_data', date_time: new Date() }),
    select: (res: Record<string, any>) => {
      const payload: Record<string, any>[] = res.data;

      return [
        // @ts-ignore
        // eslint-disable-next-line no-shadow
        ...payload?.data.map((data: Record<string, any>) => {
          return {
            type: 'Feature',
            properties: {
              temperature: data[selectedDay].tempmean,
              precipitation: data[selectedDay].precipitation,
              tempmin: data[selectedDay].tempmin,
              tempmax: data[selectedDay].tempmax,
              lightning: data[selectedDay].lightning,
              municipality_name: data.municipality_name,
              municipality_code: data.municipality_code,
              timestamp: data.timestamp_local_django,
              district: data.District,
              weathericon: '04n',
              key: 'forecast-temperature-hiwat',
            },
            geometry: {
              type: 'Point',
              coordinates: [data?.lon, data?.lat],
            },
          };
        }),
      ];
    },
  });

  const {
    data: windyForecastData,
    isSuccess: windyForecastSuccess,
    isLoading: isWindyForecastLoading,
  } = useQuery({
    queryKey: ['windy-forecast-data', forecastInterval],
    queryFn: () =>
      hcwaveForecastObservation({
        hour: forecastInterval,
        source: 'windy',
      }),
    select: (res: Record<string, any>) => {
      const payload: Record<string, any>[] = res.data;
      return payload;
      // return [
      //   ...payload?.map((data: Record<string, any>) => {
      //     return {
      //       type: 'Feature',
      //       properties: {
      //         temperature: roundToNthDecimal(data.temp),
      //         municipality_code: data.municipality_code,
      //         weathericon: '04n',
      //         municipality_name: data.municipality_name,
      //         precipitation: roundToNthDecimal(data.precip),
      //         color: getTempColorForValue(data.temp),
      //         precipitation_color: getColorForValue(data.precip),
      //       },

      //       geometry: {
      //         type: 'Point',
      //         coordinates: [data?.lon, data?.lat],
      //       },
      //     };
      //   }),
      // ];
    },
    cacheTime: 0,
  });

  const {
    data: openWeatherForecastData,
    isError: errorFetchingForecastData,
    isLoading: isOpenweatherCurrentLoading,
  } = useQuery({
    queryKey: ['openWeather-forecast-data'],
    queryFn: getOpenWeatherForecastData,
    select: (res: Record<string, any>) => {
      const payload: Record<string, any>[] = res.data;
      return [
        ...payload?.map((dta: Record<string, any>) => {
          return {
            type: 'Feature',
            properties: {
              temperature: roundToNthDecimal(dta.fields['main.temp']?.[0] || 0),
              municipality_code: dta.fields.municipality_code[0],
              weathericon: dta.fields['weather.icon'][0],
              municipality_name: dta.fields.municipality_name[0],
              precipitation: roundToNthDecimal(dta.fields['rain.3h']),
              color: getTempColorForValue(dta.fields['main.temp']?.[0] || 0),
              precipitation_color: getPrecipitationColorForValue(
                dta.fields['rain.3h'] || 0,
              ),
            },
            geometry: {
              type: 'Point',
              coordinates: [
                dta.fields['coord.lon'][0],
                dta.fields['coord.lat'][0],
              ],
            },
          };
        }),
      ];
    },
  });

  const {
    data: weatherapiCurrentData,
    isSuccess: isWeatherapiCurrentSuccess,
    isLoading: isWeatherapiCurrentLoading,
  } = useQuery({
    queryKey: ['openWwather-forecast-data'],
    queryFn: getOpenWeatherForecastData,
    select: (res: Record<string, any>) => {
      const payload: Record<string, any>[] = res.data;

      return [
        ...payload?.map((dta: Record<string, any>) => {
          return {
            type: 'Feature',
            properties: {
              temperature: dta.fields['main.temp'] || 0,
              municipality_code: dta.fields.municipality_code[0],
              weathericon: dta.fields['weather.icon'][0],
              color: getTempColorForValue(dta.fields['main.temp'] || 0),
              municipality_name: dta.fields.municipality_name[0],
            },
            geometry: {
              type: 'Point',
              coordinates: [
                dta.fields['coord.lon'][0],
                dta.fields['coord.lat'][0],
              ],
            },
          };
        }),
      ];
    },
  });

  return {
    forecastObservationData,
    weatherapiForecastData,
    hiwatData,
    windyForecastData,
    weatherapiCurrentData,
    openWeatherForecastData,
    errorFetchingForecastData,
    dhmRainData,
    dhmRiverData,
    dhmRainSuccess,
    dhmRiverSuccess,
    hiwatSuccess,
    windyForecastSuccess,
    isWeatherapiCurrentSuccess,
    isWeatherapiCurrentLoading,
    isDhmRainLoading,
    isWeatherapiForecastSuccess,
    isForecastObservationDataSuccess,
    isOpenweatherCurrentLoading,
    isHiwatLoading,
    isWindyForecastLoading,
    isWeatherapiForecastLoading,
    isOpenweatherForecastLoading,
    isDhmRiverLoading,
  };
}
