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
import {
  observedTemperatureSourceList as sourceList,
  timeFilterList,
} from '@Constants/analyticsConstants';
import ComboBox from '@Components/RadixComponents/ComboBox';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getHiwatChartData,
  getMunicipality,
  getTemperatureChartData,
} from '@Services/common';
import Dropdown from '@Components/RadixComponents/Dropdown';
import Input from '@Components/RadixComponents/Input';
import { IAnalyticsChartComponentProps } from '../types';

const ObservedTemperatureChart = ({
  municipalityCode,
  id,
}: IAnalyticsChartComponentProps) => {
  const [selectedSource, setSelectedSource] = useState<any>({
    openweather_current: true,
    weatherapi_current: true,
    hiwat_current: true,
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

  function getStartDate(dateValue: any) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - Number(dateValue));
    return `${currentDate.toISOString().split('T')[0]} 00:00:00`;
  }

  const { data: weatherApiCurrentTemperature } = useQuery({
    queryKey: [
      'get-weatherapi-current-temp',
      selectedMunicipality,
      selectedDay,
      customValue,
    ],
    enabled: !!selectedMunicipality,
    queryFn: () =>
      getTemperatureChartData({
        source: 'weatherapi_current',
        municipality_code: selectedMunicipality,
        hours: selectedDay === 'custom' ? -customValue * 24 : -selectedDay,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });

  const { data: openWeatherCurrentTemperature } = useQuery({
    queryKey: [
      'get-openweather-current-temp',
      selectedMunicipality,
      selectedDay,
      customValue,
    ],
    enabled: !!selectedMunicipality,
    queryFn: () =>
      getTemperatureChartData({
        source: 'openweather_current',
        municipality_code: selectedMunicipality,
        hours: selectedDay === 'custom' ? -customValue * 24 : -selectedDay,
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
        date: getStartDate(customValue),
        hours: +customValue * 24,
        agg_hours: 24,
      }),
    select: res => res.data.data,
  });
  const { data: hiwatTemperatureData } = useQuery({
    queryKey: [
      'get-hiwat-current-temperature',
      selectedMunicipality,
      selectedDay,
      customValue,
    ],
    enabled: !!selectedMunicipality,
    queryFn: () => {
      const threeDaysAgoDate = new Date();
      const currentDate = new Date();
      threeDaysAgoDate.setDate(currentDate.getDate() - 4);
      return getHiwatChartData({
        source: 'hkh_weather_data',
        municipality_code: selectedMunicipality,
        date_time: customValue
          ? new Date(getStartDate(customValue))
          : threeDaysAgoDate,
      });
    },
    select: res => {
      return res.data.data?.map((hiwatData: any) => {
        const date = hiwatData?.timestamp_local_django.split('T');
        const formattedDate = `${date[0]} 00:00:00`;

        return {
          max_temperature: hiwatData.today.tempmax,
          min_temperature: hiwatData.today.tempmin,
          avg_temperature: hiwatData.today.tempmean,
          date: formattedDate,
        };
      });
    },
  });

  useEffect(() => {
    if (
      !weatherApiCurrentTemperature ||
      !hiwatTemperatureData ||
      !openWeatherCurrentTemperature ||
      !windyData
    )
      return;

    const datesArray = [
      ...weatherApiCurrentTemperature.map(
        (temp: Record<string, any>) => temp.date,
      ),
      //   ...weatherApiForecastTemperature.map(
      //     (temp: Record<string, any>) => temp.date,
      //   ),
    ];

    const uniqueDate = Array.from(new Set(datesArray));

    const collectiveChartData = uniqueDate.map(date => {
      const weatherapiCurrent = weatherApiCurrentTemperature.find(
        (temp: Record<string, any>) => temp.date === date,
      );
      const openweatherCurrent = openWeatherCurrentTemperature.find(
        (temp: Record<string, any>) => temp.date === date,
      );

      const hiwatCurrent = hiwatTemperatureData.find(
        (temp: Record<string, any>) => temp.date === date,
      );
      const windy = windyData.find(
        (temp: Record<string, any>) => temp.date === date,
      );

      return {
        name: 'Temperature',

        weatherapi_current_avg: weatherapiCurrent?.avg_temperature
          ? roundToNthDecimal(weatherapiCurrent.avg_temperature, 1)
          : weatherapiCurrent?.avg_temperature,
        weatherapi_current_min: weatherapiCurrent?.min_temperature
          ? roundToNthDecimal(weatherapiCurrent.min_temperature, 1)
          : weatherapiCurrent?.min_temperature,
        weatherapi_current_max: weatherapiCurrent?.max_temperature
          ? roundToNthDecimal(weatherapiCurrent.max_temperature, 1)
          : weatherapiCurrent?.max_temperature,

        openweather_current_avg: openweatherCurrent?.avg_temperature
          ? roundToNthDecimal(openweatherCurrent.avg_temperature, 1)
          : openweatherCurrent?.avg_temperature,
        openweather_current_min: openweatherCurrent?.min_temperature
          ? roundToNthDecimal(openweatherCurrent.min_temperature, 1)
          : openweatherCurrent?.min_temperature,
        openweather_current_max: openweatherCurrent?.max_temperature
          ? roundToNthDecimal(openweatherCurrent.max_temperature, 1)
          : openweatherCurrent?.max_temperature,

        windy_avg: windy?.avg_temperature
          ? roundToNthDecimal(windy.avg_temperature, 1)
          : windy?.avg_temperature,
        windy_min: windy?.min_temperature
          ? roundToNthDecimal(windy.min_temperature, 1)
          : windy?.min_temperature,
        windy_max: windy?.max_temperature
          ? roundToNthDecimal(windy.max_temperature, 1)
          : windy?.max_temperature,
        hiwat_current_avg: hiwatCurrent?.avg_temperature
          ? roundToNthDecimal(Number(hiwatCurrent.avg_temperature), 1)
          : hiwatCurrent?.avg_temperature,
        hiwat_current_min: hiwatCurrent?.min_temperature
          ? roundToNthDecimal(Number(hiwatCurrent.min_temperature), 1)
          : hiwatCurrent?.min_temperature,
        hiwat_current_max: hiwatCurrent?.max_temperature
          ? roundToNthDecimal(Number(hiwatCurrent.max_temperature), 1)
          : hiwatCurrent?.max_temperature,
        datetime: format(new Date(date), 'LLL dd'),
      };
    });
    setChartData(collectiveChartData);
  }, [
    weatherApiCurrentTemperature,
    openWeatherCurrentTemperature,
    windyData,
    hiwatTemperatureData,
  ]);

  return (
    <div
      className="mt-10 rounded-lg border-[1px] border-grey-300 px-4 pb-3 pt-5"
      id={id}
    >
      <>
        <h6>Observed Temperature </h6>
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
                    navigate('/analytics?chart_type=temperature');
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
export default ObservedTemperatureChart;
