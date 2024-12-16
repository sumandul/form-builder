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
import { getDHMPrecipitationChartData, getStationList } from '@Services/common';
import Dropdown from '@Components/RadixComponents/Dropdown';
import Input from '@Components/RadixComponents/Input';
import hasErrorBoundary from '@Components/common/hasErrorBoundary';
import { IAnalyticsChartComponentProps } from '../types';

const sourceList = [
  {
    id: 1,
    label: 'DHM Forecast',
    value: 'dhm_forecast_hourly',
    color: 'blue',
    chartLabel: 'DHM (Forecast)',
    dataKey: 'dhm_forecast',
  },
];

interface IDHMChartProps {
  stationId: string;
  id: string;
}

const DHMHourlyPrecipitationChart = ({ stationId, id }: IDHMChartProps) => {
  const [selectedStation, setSelectedStation] = useState<string | number>('');
  const [chartData, setChartData] = useState<Record<string, any>[]>([]);
  const { data: stationsOptions } = useQuery({
    queryKey: ['get-stations-list'],
    queryFn: getStationList,
    select: res =>
      res.data?.data?.map((stations: Record<string, any>) => ({
        id: stations.station_series_id,
        label: stations.title,
        value: stations.station_series_id,
      })),
    onSuccess: res => setSelectedStation(res?.[0]?.value),
  });

  // Set station if stationId is available
  useEffect(() => {
    if (stationId && stationsOptions?.length) {
      const selectedStationFromParams = stationsOptions.find(
        (station: Record<string, any>) => station.id === stationId,
      );

      if (selectedStationFromParams) {
        setSelectedStation(selectedStationFromParams.value);
      } else {
        setSelectedStation(stationsOptions?.[0]?.value);
      }
    }
  }, [stationId, stationsOptions]);

  useQuery({
    queryKey: ['get-openweather-forecast', selectedStation],
    enabled: !!selectedStation,
    queryFn: () =>
      getDHMPrecipitationChartData({
        station_ids: selectedStation,
      }),
    select: res => {
      return res.data.data;
    },
    onSuccess: data => {
      const baseTimestamp = new Date(data[0].timestamp);
      const formattedPrecipitaionChartData = data[0].precipitation.map(
        (precip: any) => {
          // Increase time according to interval
          const updatedTimestamp = new Date(
            baseTimestamp.getTime() + precip.interval * 60 * 60 * 1000,
          ); // Add interval in hours
          return {
            value: precip.value,
            dateTime: format(new Date(updatedTimestamp), 'MMM dd p'),
          };
        },
      );
      setChartData(formattedPrecipitaionChartData);
    },
  });

  return (
    <div
      //   ref={chartRef}
      className="mt-10 rounded-lg border-[1px] border-grey-300 px-4 pb-3 pt-5"
      id={id}
    >
      <h6>DHM Forecast Precipitation </h6>
      <>
        <div className="my-3 flex justify-end gap-x-3 pl-10">
          {/* <div className="flex items-center gap-x-2">
            <div className="w-[7rem]">
              <Dropdown
                className="w-full"
                options={timeFilterList}
                dropDownSize="drop-md"
                value={selectedHour}
                choose="value"
                onChange={value => {
                  setSelectedHour(value);
                  if (typeof value === 'number') {
                    setCustomValue((value / 24).toString());
                  }
                }}
              />
            </div>
            {selectedHour === 'custom' && (
              <Input
                value={customValue}
                type="number"
                varientSize="sm"
                className="!w-[7rem]"
                placeholder="Days"
                onChange={e => setCustomValue(e.target.value)}
              />
            )}
          </div> */}

          <div className="mr-6 flex flex-col items-center justify-end space-x-2 md:flex-row ">
            {/* <label className="text-xs">Station</label> */}
            <div className="flex flex-row items-center  justify-center space-x-1">
              <div className="w-[8rem]">
                <ComboBox
                  options={stationsOptions}
                  value={selectedStation || ''}
                  onChange={value => setSelectedStation(value)}
                  choose="value"
                  className="!w-[8rem]"
                  dropDownSize="drop-md"
                  placeholder="Stations"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex gap-x-3">
            {sourceList.map(item => (
              <div key={item.id} className="flex items-center gap-x-2">
                {/* <input
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
                /> */}
                <label
                  htmlFor={item.value}
                  className="flex items-center gap-x-2"
                >
                  <div
                    className="h-4 w-4"
                    style={{
                      backgroundColor: item.color,
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
                  dataKey="dateTime"
                  tick={{ style: { fontSize: '12px', fontWeight: '400' } }}
                />
                <YAxis
                  tick={{ style: { fontSize: '12px', fontWeight: '400' } }}

                  // domain={[0, 60]}
                />
                <CartesianGrid strokeDasharray="6 6" />

                {/* <Line type="monotone" dataKey="Minimum Temperature" stroke="#00ff00" dot={false} /> */}

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="blue"
                  dot={false}
                  name="DHM Forecast"
                />

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

export default hasErrorBoundary(DHMHourlyPrecipitationChart);
