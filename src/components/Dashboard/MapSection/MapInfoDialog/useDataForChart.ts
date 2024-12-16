/* eslint-disable no-nested-ternary */
import {
  getHiwatChartData,
  getPrecipitationChartData,
  getTemperatureChartData,
  riverData,
} from '@Services/common';
import { useQuery } from '@tanstack/react-query';
import { getStartDate } from '@Utils/getStartDate';

interface IUseDataForChart {
  municipalityCode: string;
  featureHasMunicipalCode: boolean;
  feature: Record<string, any>;
}

export default function useDataForChart({
  municipalityCode,
  featureHasMunicipalCode,
  feature,
}: IUseDataForChart) {
  const { data: weatherApiForecastPrecipitation } = useQuery({
    queryKey: ['get-weatherapi-forecast-chart', municipalityCode],
    enabled: !!featureHasMunicipalCode,
    queryFn: () =>
      getPrecipitationChartData({
        source: 'weatherapi_forecast',
        municipality_code: municipalityCode,
        // date: getStartDate(customValue),
        hours: '72',
        agg_hours: 24,
      }),
    select: res => res.data,
  });

  const { data: weatherApiCurrentPrecipitation } = useQuery({
    queryKey: [
      'get-weatherapi-current-chart',
      municipalityCode,
      // selectedDay,
      // customValue,
    ],
    enabled: featureHasMunicipalCode,
    queryFn: () =>
      getPrecipitationChartData({
        source: 'weatherapi_current',
        municipality_code: municipalityCode,
        // hours: selectedDay === 'custom' ? -customValue * 24 : -selectedDay,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  const { data: openWeatherForecastPrecipitation } = useQuery({
    queryKey: [
      'get-openweather-forecast-chart',
      municipalityCode,
      // selectedDay,
      // customValue,
    ],
    enabled: featureHasMunicipalCode,
    queryFn: () =>
      getPrecipitationChartData({
        source: 'openweather_forecast',
        municipality_code: municipalityCode,
        // date: getStartDate(customValue),
        // hours: +customValue * 24 * 2,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  const { data: openWeatherCurrentPrecipitation } = useQuery({
    queryKey: [
      'get-openweather-current-chart',
      municipalityCode,
      // selectedDay
    ],
    enabled: !!featureHasMunicipalCode,
    queryFn: () =>
      getPrecipitationChartData({
        source: 'openweather_current',
        municipality_code: municipalityCode,
        // hours: selectedDay === 'custom' ? -customValue : -selectedDay,
        hours: 1,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  const { data: weatherbitData } = useQuery({
    queryKey: [
      'get-weatherbit-forecast-chart',
      municipalityCode,
      // selectedDay,
      // customValue,
    ],
    enabled: featureHasMunicipalCode,
    queryFn: () =>
      getPrecipitationChartData({
        source: 'weatherbit',
        municipality_code: municipalityCode,
        // date: getStartDate(customValue),
        // hours: +customValue * 24 * 2,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  // const { data: windyData } = useQuery({
  //   queryKey: [
  //     'get-windy-forecast',
  //     municipalityCode,
  //     // selectedDay,
  //     // customValue,
  //   ],
  //   enabled: featureHasMunicipalCode,
  //   queryFn: () =>
  //     getPrecipitationChartData({
  //       source: 'windy',
  //       municipality_code: municipalityCode,
  //       // date: getStartDate(customValue),
  //       // hours: +customValue * 24 * 2,
  //       agg_hours: 24,
  //     }),
  //   select: res => res.data.data,
  // });

  const { data: windyData } = useQuery({
    queryKey: ['get-windy-chart', municipalityCode],
    enabled: !!municipalityCode,
    queryFn: () =>
      getTemperatureChartData({
        source: 'windy',
        municipality_code: municipalityCode,
        date: getStartDate(),
        // hours: +customValue * 24 * 2,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  const { data: windyDataForecast } = useQuery({
    queryKey: [
      'get-windy-forecast-chart',
      municipalityCode,
      // selectedDay,
      // customValue,
    ],
    enabled: !!municipalityCode,
    queryFn: () =>
      getPrecipitationChartData({
        source: 'windy',
        municipality_code: municipalityCode,
        // date: getStartDate(customValue),
        // hours: +customValue * 24 * 2,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  const { data: weatherApiForecastTemperature } = useQuery({
    queryKey: [
      'get-weatherapi-forecast-temp-chart',
      municipalityCode,
      // selectedDay,
      // customValue,
    ],
    enabled: !!municipalityCode,
    queryFn: () =>
      getTemperatureChartData({
        source: 'weatherapi_forecast',
        municipality_code: municipalityCode,
        date: getStartDate(),
        // date: new Date(),
        // hours: +customValue * 24 * 2,
        // hours: 144,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  const { data: weatherApiCurrentTemperature } = useQuery({
    queryKey: [
      'get-weatherapi-current-temp-chart',
      municipalityCode,
      // selectedDay,
      // customValue,
    ],
    enabled: !!municipalityCode,
    queryFn: () =>
      getTemperatureChartData({
        source: 'weatherapi_current',
        municipality_code: municipalityCode,
        hours: -72,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  const { data: hiwatPrecipitaionData } = useQuery({
    queryKey: [
      'get-hiwat-forecast-precipitation',
      municipalityCode,
      // selectedDay,
      // customValue,
    ],
    enabled: !!municipalityCode,
    queryFn: () => {
      const threeDaysAgoDate = new Date();
      const currentDate = new Date();
      threeDaysAgoDate.setDate(currentDate.getDate() - 4);
      return getHiwatChartData({
        source: 'hkh_weather_data',
        municipality_code: municipalityCode,
        date_time: threeDaysAgoDate,
      });
    },
    select: res => {
      return res.data.data?.map((hiwatData: any) => {
        const date = hiwatData?.timestamp_local_django.split('T');
        const formattedDate = `${date[0]} 00:00:00`;

        return {
          precipitation: hiwatData.tomorrow.precipitation,
          max_temperature: hiwatData.tomorrow.tempmax,
          min_temperature: hiwatData.tomorrow.tempmin,
          date: formattedDate,
        };
      });
    },
  });

  const { data: dhmRiverWatchChartData } = useQuery({
    // @ts-ignore
    queryKey: ['chart-data-river-wath', feature],
    enable: !!feature.properties.station,
    queryFn: () =>
      riverData({
        stationIndex: feature.properties.station,
        agg_hours: 24,
        hours: -72,
      }),
    select: res =>
      // @ts-ignore
      res?.data?.data?.map(dta => ({
        date: dta.timestamp,
        water_level: dta.average_water_level,
      })),
  });

  return {
    weatherApiForecastPrecipitation,
    windyData,
    weatherbitData,
    openWeatherForecastPrecipitation,
    weatherApiCurrentPrecipitation,
    openWeatherCurrentPrecipitation,
    weatherApiForecastTemperature,
    weatherApiCurrentTemperature,
    windyDataForecast,
    hiwatPrecipitaionData,
    dhmRiverWatchChartData,
  };
}
