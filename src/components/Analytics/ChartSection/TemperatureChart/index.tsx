/* eslint-disable prettier/prettier */
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
import { getMunicipality, getTemperatureChartData } from '@Services/common';
import {
  forecastTemperatureSourceList as sourceList,
  timeFilterList,
} from '@Constants/analyticsConstants';
import Dropdown from '@Components/RadixComponents/Dropdown';
import { useNavigate } from 'react-router-dom';
import Input from '@Components/RadixComponents/Input';
import { getStartDate } from '@Utils/getStartDate';
import { IAnalyticsChartComponentProps } from '../types';

const TemperatureChart = ({
  municipalityCode,
  id,
}: IAnalyticsChartComponentProps) => {
  const [selectedSource, setSelectedSource] = useState<any>({
    openweather_forecast: true,
    weatherapi_forecast: true,
    windy: true,
  });
  const navigate = useNavigate();

  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [selectedDay, setSelectedDay] = useState<string | number>(72);
  const [chartData, setChartData] = useState<Record<string, any>[]>([]);
  const [customValue, setCustomValue] = useState('');
  const { data: municipalOptions } = useQuery({
    queryKey: ['get-municipality-list-temp'],
    queryFn: getMunicipality,
    select: res =>
      res.data.map((municipal: Record<string, any>) => ({
        id: municipal.id,
        label: municipal.name,
        value: municipal.code,
      })),
    onSuccess: res => setSelectedMunicipality(res?.[0]?.value),
  });

  const { data: weatherApiForecastTemperature } = useQuery({
    queryKey: [
      'get-weatherapi-forecast-temp',
      selectedMunicipality,
      selectedDay,
      customValue,
    ],
    enabled: !!selectedMunicipality,
    queryFn: () =>
      getTemperatureChartData({
        source: 'weatherapi_forecast',
        municipality_code: selectedMunicipality,
        date: getStartDate(),
        // date: new Date(),
        hours: +customValue * 24 * 2,
        // hours: 144,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  const { data: openWeatherForecastTemperature } = useQuery({
    queryKey: [
      'get-openweather-forecast-temp',
      selectedMunicipality,
      selectedDay,
      customValue,
    ],
    enabled: !!selectedMunicipality,
    queryFn: () =>
      getTemperatureChartData({
        source: 'openweather_forecast',
        municipality_code: selectedMunicipality,
        date: getStartDate(),
        hours: +customValue * 24 * 2,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  const { data: windyData } = useQuery({
    queryKey: ['get-windy', selectedMunicipality, selectedDay, customValue],
    enabled: !!selectedMunicipality,
    queryFn: () =>
      getTemperatureChartData({
        source: 'windy',
        municipality_code: selectedMunicipality,
        date: getStartDate(),
        hours: +customValue * 24 * 2,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  useEffect(() => {
    if (
      !weatherApiForecastTemperature ||
      !openWeatherForecastTemperature ||
      !windyData
    )
      return;

    const datesArray = [
      // ...weatherApiCurrentTemperature.map(
      //   (temp: Record<string, any>) => temp.date,
      // ),
      ...weatherApiForecastTemperature.map(
        (temp: Record<string, any>) => temp.date,
      ),
    ];

    const uniqueDate = Array.from(new Set(datesArray));

    const collectiveChartData = uniqueDate.map(date => {
      const weatherapiForecast = weatherApiForecastTemperature.find(
        (temp: Record<string, any>) => temp.date === date,
      );

      const openweatherForecast = openWeatherForecastTemperature.find(
        (temp: Record<string, any>) => temp.date === date,
      );

      const windy = windyData.find(
        (temp: Record<string, any>) => temp.date === date,
      );

      return {
        name: 'Temperature',
        weatherapi_forecast_avg: weatherapiForecast?.avg_temperature
          ? roundToNthDecimal(weatherapiForecast.avg_temperature, 1)
          : weatherapiForecast?.avg_temperature,
        weatherapi_forecast_min: weatherapiForecast?.min_temperature
          ? roundToNthDecimal(weatherapiForecast.min_temperature, 1)
          : weatherapiForecast?.min_temperature,
        weatherapi_forecast_max: weatherapiForecast?.max_temperature
          ? roundToNthDecimal(weatherapiForecast.max_temperature, 1)
          : weatherapiForecast?.max_temperature,

        openweather_forecast_avg: openweatherForecast?.avg_temperature
          ? roundToNthDecimal(openweatherForecast.avg_temperature, 1)
          : openweatherForecast?.avg_temperature,
        openweather_forecast_min: openweatherForecast?.min_temperature
          ? roundToNthDecimal(openweatherForecast.min_temperature, 1)
          : openweatherForecast?.min_temperature,
        openweather_forecast_max: openweatherForecast?.max_temperature
          ? roundToNthDecimal(openweatherForecast.max_temperature, 1)
          : openweatherForecast?.max_temperature,

        windy_avg: windy?.avg_temperature
          ? roundToNthDecimal(windy.avg_temperature, 1)
          : windy?.avg_temperature,
        windy_min: windy?.min_temperature
          ? roundToNthDecimal(windy.min_temperature, 1)
          : windy?.min_temperature,
        windy_max: windy?.max_temperature
          ? roundToNthDecimal(windy.max_temperature, 1)
          : windy?.max_temperature,
        datetime: format(new Date(date), 'LLL dd'),
      };
    });
    setChartData(collectiveChartData);
  }, [
    weatherApiForecastTemperature,
    openWeatherForecastTemperature,
    windyData,
  ]);

  return (
    <div
      className="mt-10 rounded-lg border-[1px] border-grey-300 px-4 pb-3 pt-5"
      id={id}
    >
      <>
        <h6>Forecast Temperature </h6>
        <div className="my-3 flex justify-end gap-x-3 pl-10">
          <div className="flex items-center gap-x-2">
            <div className="w-[7rem]">
              <Dropdown
                className="w-full"
                options={timeFilterList}
                dropDownSize="drop-md"
                value={selectedDay}
                choose="value"
                onChange={value => {
                  setSelectedDay(value);
                  if (typeof value === 'number') {
                    setCustomValue((value / 24).toString());
                  }
                }}
              />
            </div>
            {selectedDay === 'custom' && (
              <Input
                value={customValue}
                type="number"
                varientSize="sm"
                className="!w-[7rem]"
                placeholder="Days"
                onChange={e => setCustomValue(e.target.value)}
              />
            )}
          </div>

          <div className="mr-6 flex flex-col items-center justify-end space-x-2 md:flex-row ">
            <div className="flex flex-row items-center  justify-center space-x-1">
              <div className="w-[8rem]">
                <ComboBox
                  options={municipalOptions}
                  value={+municipalityCode || selectedMunicipality || ''}
                  onChange={value => {
                    navigate(`/analytics?chart_type=temperature`);
                    setSelectedMunicipality(value);
                  }}
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
                />
                <CartesianGrid strokeDasharray="6 6" />

                {sourceList.map(
                  source =>
                    selectedSource[source?.value] && (
                      <Line
                        key={`${source.dataKey}_avg`}
                        type="monotone"
                        dataKey={`${source?.dataKey}_avg`}
                        stroke={source.color}
                        dot={false}
                        name={`${source.chartLabel}`}
                      />
                    ),
                )}
                {sourceList.map(
                  source =>
                    selectedSource[source?.value] && (
                      <Line
                        key={`${source.dataKey}_min`}
                        type="monotone"
                        dataKey={`${source?.dataKey}_min`}
                        stroke={source.color}
                        strokeDasharray="5 5"
                        dot={false}
                        legendType="none"
                        name={`${source.chartLabel} (Min)`}
                      />
                    ),
                )}
                {sourceList.map(
                  source =>
                    selectedSource[source?.value] && (
                      <Line
                        key={`${source.dataKey}_max`}
                        type="monotone"
                        dataKey={`${source?.dataKey}_max`}
                        stroke={source.color}
                        strokeDasharray="5 5"
                        dot={false}
                        legendType="none"
                        name={`${source.chartLabel}(Max)`}
                      />
                    ),
                )}

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
export default TemperatureChart;
