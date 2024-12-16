import {
  getImpactDataDetail,
  getIndividualMunicipalityWeatherData,
  // getLandSlideData,
  getLandSlideDataDetail,
  hcwaveForecastObservation,
  hiwat,
  rainfallData,
  riverData,
} from '@Services/common';
import { getVectorLayerPopUp } from '@Services/unAuthenticatedAPIs';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface IUsePopupForChart {
  feature: Record<string, any>;
  isCurrentPopupDataEnabled?: boolean;
  municipalityCode: string;
  featureId: string;
  day: string;
  timeInterval: number;
  sliderValue: string;
}

export default function useDataForPopup({
  feature,
  featureId,
  municipalityCode,
  day,
  timeInterval,
  sliderValue,
}: IUsePopupForChart) {
  const {
    data: realtimeCurrentPopUpData,
    isLoading: isCurrentPopupDataLoading,
    isError: isCurrentPopupDataError,
  } = useQuery({
    queryKey: ['pop-up-data-realtime-current', feature],
    enabled: !!municipalityCode,
    queryFn: () =>
      getIndividualMunicipalityWeatherData({
        municipality_code: municipalityCode,
      }),
    select: res => {
      const payload = res.data.hits?.[0]?.fields;
      return {
        temperature: payload['main.temp'],
        municipality_code: payload.municipality_code,
        weathericon: payload['weather.icon'],
        municipality_name: payload.municipality_name,
        humidity: payload?.['main.humidity'],
        // precipitation: payload['rain.3h'],
      };
    },
  });
  // console.log(realtimeCurrentPopUpData, 'realtimeCurrentPopUpData');

  const {
    data: dhmRainfallWatchPopupData,
    isLoading: isDhmRainfallWatchLoading,
    isError: isDhmRainfallWatchError,
  } = useQuery({
    // @ts-ignore
    queryKey: ['pop-up-data-rainfall-wath', feature],
    enable: Boolean(feature.properties.station),
    queryFn: () =>
      rainfallData({
        station_series_id: feature.properties.station,
      }),
    select: res => {
      const payload = res?.data?.data?.[0];
      // return {
      const data = payload?.averages?.filter(
        (interval: { interval: number; value: string }) =>
          interval.interval === timeInterval, // Convert interval.interval to a string
      );

      const obj = data?.reduce((acc: { interval: string }, item: {}) => {
        return { ...acc, ...item }; // Merging all properties into a single object
      }, {});
      const objUnit = Object.keys(obj).reduce<Record<string, string | number>>(
        (acc, key) => {
          if (key === 'interval') {
            acc[key] = `${obj[key]} hrs`; // Adding "hrs" for interval
          } else if (key === 'value') {
            acc[key] = `${obj[key]} mm`; // Adding "mm" for values like rainfall, etc.
          } else {
            acc[key] = obj[key]; // Keep other properties unchanged
          }
          return acc;
        },
        {},
      );
      // eslint-disable-next-line no-multi-assign
      const { averages, ...remainingPayload } = payload;
      const dataSet = { ...remainingPayload, ...objUnit };
      return dataSet;
    },
  });

  const {
    data: dhmRiverWatchPopupData,
    isLoading: isDhmRiverWatchLoading,
    isError: isDhmRiverWatchError,
  } = useQuery({
    // @ts-ignore
    queryKey: ['pop-up-data-river-wath', feature],
    enable: !!feature.properties.station,
    queryFn: () =>
      riverData({
        stationIndex: feature.properties.station,
      }),
    select: res => res?.data?.data[0],
  });

  const {
    data: weatherapiForecastPrecipitationPopupData,
    isLoading: isWeatherapiForecastPopupLoading,
    isError: isWeatherapiForecastPopupError,
  } = useQuery({
    queryKey: [
      'weatherapi-forecast-data-popup',
      // '15',
      municipalityCode,
      feature,
      sliderValue,
    ],
    enabled: !!municipalityCode,
    queryFn: () =>
      hcwaveForecastObservation({
        hour: sliderValue,
        source: 'weatherapi_forecast',
        municipality_code: municipalityCode,
      }),
    select: (res: Record<string, any>) => {
      const payload: Record<string, any>[] = res.data;
      // console.log(payload, 'payload');
      return payload;
    },
    cacheTime: 0,
  });

  const {
    data: windyForecastPopupData,
    isError: isWindyForecastPopupError,
    isLoading: isWindyForecastPopupLoading,
  } = useQuery({
    queryKey: [
      'windy-forecast-data-popup',
      municipalityCode,
      feature,
      sliderValue,
    ],
    enabled: !!municipalityCode,
    queryFn: () =>
      hcwaveForecastObservation({
        hour: sliderValue,
        source: 'windy',
        municipality_code: municipalityCode,
      }),
    select: (res: Record<string, any>) => {
      const payload: Record<string, any>[] = res.data;
      return payload;
    },
    cacheTime: 0,
  });

  const {
    data: hiwatPopupData,
    isLoading: isHiwatDataLoading,
    isError: isHiwatDataError,
  } = useQuery({
    queryKey: ['hiwat-data-popup', municipalityCode, feature, day, sliderValue],
    enabled: !!municipalityCode,
    cacheTime: 0,
    queryFn: () =>
      hiwat({
        source: 'hkh_weather_data',
        date_time: format(new Date(), 'yyyy-MM-dd'),
        municipality_code: municipalityCode,
        hour: sliderValue,
      }),

    select: (res: Record<string, any>) => {
      const payload: Record<string, any> = res?.data?.data?.[0];

      if (payload) {
        const filteredObject = Object.fromEntries(
          Object.entries(payload || {}).filter(([key]) =>
            key.includes(`${day}`),
          ),
        );

        // Remove the destructuring of `time`, just assign it directly from `timestamp_local_django`
        const { today, tomorrow, ...resData } = payload;

        const obj = {
          ...filteredObject,
          ...resData,
          // time: payload.timestamp_local_django, // Correctly assign time here
        };
        return {
          ...obj,
          lat: obj.lat,
          lon: obj.lon,
          timestamp_local_django: obj.timestamp_local_django,
        };
      }
      return {};
    },
  });

  const {
    data: popUpData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['pop-up-data', featureId, feature, sliderValue],
    enabled: !!featureId,
    queryFn: () =>
      getVectorLayerPopUp({
        feature_id: featureId,
        hour: sliderValue,
      }),
    select: res => res.data.data,
  });
  const {
    data: landslideDetail,
    isLoading: isLoadingLandSlideData,
    isError: isLandSlideDataError,
  } = useQuery({
    queryKey: ['landslideDetail-data', feature],
    // eslint-disable-next-line no-underscore-dangle
    queryFn: () => getLandSlideDataDetail(feature.properties._id),
    select: res => {
      const result = res?.data.reduce((acc: any, item: any) => {
        acc[item.label] = item.answer === null ? '__' : item.answer;
        return acc;
      }, {});
      return result;
    },
    enabled:
      // eslint-disable-next-line no-underscore-dangle
      feature.properties._id !== undefined && feature.properties._id !== null,
  });
  const {
    data: impactDetail,
    isLoading: isLoadingImpactData,
    isError: isErrorlandslideDetail,
  } = useQuery({
    queryKey: ['impactDetail-data', feature],
    // eslint-disable-next-line no-underscore-dangle
    queryFn: () => getImpactDataDetail(feature.properties._id),
    select: res => {
      const result = res?.data.reduce((acc: any, item: any) => {
        acc[item.label] = item.answer === null ? '__' : item.answer;
        return acc;
      }, {});
      return result;
    },
    enabled:
      // eslint-disable-next-line no-underscore-dangle
      feature.properties._id !== undefined && feature.properties._id !== null, //
  });

  const isLoadingx =
    isCurrentPopupDataLoading &&
    isLoading &&
    isDhmRainfallWatchLoading &&
    isWeatherapiForecastPopupLoading &&
    isWindyForecastPopupLoading &&
    isHiwatDataLoading &&
    isDhmRiverWatchLoading &&
    isLoadingLandSlideData &&
    isLoadingImpactData;

  const isErrorX =
    isCurrentPopupDataError &&
    isError &&
    isDhmRainfallWatchError &&
    isWeatherapiForecastPopupError &&
    isWindyForecastPopupError &&
    isHiwatDataError &&
    isDhmRiverWatchError &&
    isLandSlideDataError &&
    isErrorlandslideDetail;

  return {
    realtimeCurrentPopUpData,
    popUpData,
    dhmRainfallWatchPopupData,
    dhmRiverWatchPopupData,
    weatherapiForecastPrecipitationPopupData,
    windyForecastPopupData,
    hiwatPopupData,
    isLoadingx,
    isErrorX,
    landslideDetail,
    impactDetail,
  };
}
