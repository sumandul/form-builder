/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { roundToNthDecimal } from '@Utils/index';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';
import { format } from 'date-fns';
import ComboBox from '@Components/RadixComponents/ComboBox';
import { useQuery } from '@tanstack/react-query';
import { getMunicipality, getPrecipitationChartData } from '@Services/common';
import {
  forecastPrecipitationHourlySourceList as sourceList,
  hourlyTimeFilterList as timeFilterList,
} from '@Constants/analyticsConstants';
import Dropdown from '@Components/RadixComponents/Dropdown';
import Input from '@Components/RadixComponents/Input';
import hasErrorBoundary from '@Components/common/hasErrorBoundary';

const PrecipitationChartHourly = () => {
  const [selectedSource, setSelectedSource] = useState<any>({
    openweather_forecast_hourly: true,
    weatherapi_forecast_hourly: true,
    windy_hourly: true,
  });

  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [selectedHour, setSelectedHour] = useState<string | number>(3);
  const [chartData, setChartData] = useState<Record<string, any>[]>([]);
  const [customValue, setCustomValue] = useState('');
  const { data: municipalOptions } = useQuery({
    queryKey: ['get-municipality-list'],
    queryFn: getMunicipality,
    select: res =>
      res.data.map((municipal: Record<string, any>) => ({
        id: municipal.id,
        label: municipal.name,
        value: municipal.code,
      })),
    onSuccess: res => setSelectedMunicipality(res?.[0]?.value),
  });

  const { data: weatherApiForecastPrecipitation } = useQuery({
    queryKey: [
      'get-weatherapi-forecast-hourly',
      selectedMunicipality,
      selectedHour,
      customValue,
    ],
    enabled: !!selectedMunicipality,
    queryFn: () =>
      getPrecipitationChartData({
        source: 'weatherapi_forecast',
        municipality_code: selectedMunicipality,
        hours: selectedHour === 'custom' ? +customValue : selectedHour,
        agg_hours: 1,
      }),
    select: res => res.data.data,
  });

  const { data: openWeatherForecastPrecipitation } = useQuery({
    queryKey: [
      'get-openweather-forecast-hourly',
      selectedMunicipality,
      selectedHour,
      customValue,
    ],
    enabled: !!selectedMunicipality,
    queryFn: () =>
      getPrecipitationChartData({
        source: 'openweather_forecast',
        municipality_code: selectedMunicipality,
        hours: selectedHour === 'custom' ? +customValue : selectedHour,
        agg_hours: 1,
      }),
    select: res => res.data.data,
  });

  const { data: windyData } = useQuery({
    queryKey: [
      'get-windy-forecast-hourly',
      selectedMunicipality,
      selectedHour,
      customValue,
    ],
    enabled: !!selectedMunicipality,
    queryFn: () =>
      getPrecipitationChartData({
        source: 'windy',
        municipality_code: selectedMunicipality,
        hours: selectedHour === 'custom' ? +customValue : selectedHour,
        agg_hours: 1,
      }),
    select: res => res.data.data,
  });

  useEffect(() => {
    if (
      !weatherApiForecastPrecipitation ||
      !openWeatherForecastPrecipitation ||
      !windyData
    )
      return;
    const datesArray = [
      // ...weatherApiCurrentPrecipitation.map(
      //   (precip: Record<string, any>) => precip.date,
      // ),
      ...weatherApiForecastPrecipitation.map(
        (precip: Record<string, any>) => precip.date,
      ),
    ];
    const uniqueDate = Array.from(new Set(datesArray));
    const collectiveChartData = uniqueDate.map(date => {
      const weatherapiForecast = weatherApiForecastPrecipitation.find(
        (precip: Record<string, any>) => precip.date === date,
      )?.precipitation;

      const openweatherForecast = openWeatherForecastPrecipitation.find(
        (precip: Record<string, any>) => precip.date === date,
      )?.precipitation;

      const windy = windyData?.find(
        (precip: Record<string, any>) => precip.date === date,
      )?.precipitation;

      return {
        name: 'A',
        weatherapi_forecast: weatherapiForecast
          ? roundToNthDecimal(weatherapiForecast, 1)
          : weatherapiForecast,

        openweather_forecast: openweatherForecast
          ? roundToNthDecimal(openweatherForecast, 1)
          : openweatherForecast,

        windy: windy ? roundToNthDecimal(windy, 1) : windy,
        datetime: format(new Date(date), 'MMM dd p'),
      };
    });
    setChartData(collectiveChartData);
  }, [
    weatherApiForecastPrecipitation,
    openWeatherForecastPrecipitation,
    windyData,
  ]);

  return (
    <div
      //   ref={chartRef}
      className="mt-10 rounded-lg border-[1px] border-grey-300 px-4 pb-3 pt-5"
    >
      <h6>Forecast Precipitation (Hourly) </h6>
      <>
        <div className="my-3 flex justify-end gap-x-3 pl-10">
          <div className="flex items-center gap-x-2">
            <div className="w-[7rem]">
              <Dropdown
                className="w-full"
                options={timeFilterList}
                dropDownSize="drop-md"
                value={selectedHour}
                choose="value"
                onChange={value => {
                  setSelectedHour(value);
                }}
              />
            </div>
            {selectedHour === 'custom' && (
              <Input
                value={customValue}
                type="number"
                varientSize="sm"
                className="!w-[7rem]"
                placeholder="Hours"
                onChange={e => setCustomValue(e.target.value)}
              />
            )}
          </div>

          <div className="mr-6 flex flex-col items-center justify-end space-x-2 md:flex-row ">
            {/* <label className="text-xs">Station</label> */}
            <div className="flex flex-row items-center  justify-center space-x-1">
              <div className="w-[8rem]">
                <ComboBox
                  options={municipalOptions}
                  value={selectedMunicipality || ''}
                  onChange={value => setSelectedMunicipality(value)}
                  choose="value"
                  className="!w-[8rem]"
                  dropDownSize="drop-md"
                  placeholder="Municipality"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex gap-x-3">
            {sourceList.map(item => (
              <div key={item.id} className="flex items-center gap-x-2">
                <input
                  id={item.value}
                  type="checkbox"
                  className="hidden"
                  name={item.value}
                  checked={selectedSource[item.value]}
                  onChange={e => {
                    setSelectedSource({
                      ...selectedSource,
                      [e.target.name]: e.target.checked,
                    });
                  }}
                />
                <label
                  htmlFor={item.value}
                  className="flex items-center gap-x-2"
                >
                  <div
                    className="h-4 w-4"
                    style={{
                      backgroundColor: selectedSource[item.value]
                        ? item.color
                        : 'gray',
                    }}
                  />
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mr-6  bg-white bg-opacity-50 p-2">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                width={730}
                height={250}
                data={chartData || []}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 0,
                }}
              >
                <XAxis
                  dataKey="datetime"
                  tick={{ style: { fontSize: '12px', fontWeight: '400' } }}
                />
                <YAxis
                  tick={{ style: { fontSize: '12px', fontWeight: '400' } }}

                  // domain={[0, 60]}
                />
                <CartesianGrid strokeDasharray="6 6" />

                {/* <Line type="monotone" dataKey="Minimum Temperature" stroke="#00ff00" dot={false} /> */}
                {sourceList.map(
                  source =>
                    selectedSource[source?.value] && (
                      <Line
                        key={source.id}
                        type="monotone"
                        dataKey={source?.dataKey}
                        stroke={source.color}
                        dot={false}
                        name={source.chartLabel}
                      />
                    ),
                )}

                {/* <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="black"
                  dot={false}
                  name="Threshold"
                /> */}

                <Tooltip />
                <Legend />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    </div>
  );
};

export default hasErrorBoundary(PrecipitationChartHourly);
