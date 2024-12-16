/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
import CustomBarChart from '@Components/common/Charts/BarChart';
import { FlexColumn } from '@Components/common/Layouts';
import { useQuery } from '@tanstack/react-query';
import { getAnalyticsData } from '@Services/adminDashboard';
import ExploreHeader from '@Components/common/SwitchHeader';
// import { chartData } from '@Constants/map';
import { useTypedSelector } from '@Store/hooks';
import { useEffect } from 'react';
// import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomLineChart from '@Components/common/Charts/LineChart';
import PrecipitationChart from './PrecipitationChart';
import PrecipitationChartHourly from './PrecipitationChartHourly';
import TemperatureChart from './TemperatureChart';
import TemperatureChartHourly from './TemperatureChartHourly';
import ObservedPrecipitationChart from './ObservedPrecipitationChart';
import ObservedTemperatureChart from './ObservedTemperatureChart';
import ObservedPrecipitationChartHourly from './ObservedPrecipitationHourlyChart';
import ObservedTemperatureChartHourly from './ObservedTemperatureChartHourly';
import HourlyPrecipitaionChartDHM from './HourlyPrecipitaionChartDHM';
import ComparisonTemperatureChart from './TemperatureComparisonChart';
import ComparisonPrecipitationChart from './PrecipitsionComparisonChart';

export default function ChartSection() {
  const [searchParams] = useSearchParams();
  const chartType = searchParams.get('chart_type');
  const municipalityCode = searchParams.get('municipality_code');
  const chartId = searchParams.get('chartId');
  const stationId = searchParams.get('stationId');

  const selectedStatistic = useTypedSelector(
    state => state.analytics.statistics,
  );
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { data: analyticsChartData } = useQuery({
    queryKey: ['analytics-data'],
    queryFn: getAnalyticsData,
    select: res => res.data,
  });

  function handleTabChange(tab: string) {
    navigate(`/analytics?chart_type=${tab}`);
  }
  const headerOptions = [
    { id: 1, title: 'Precipitaition', value: 'precipitation' },
    { id: 2, title: 'Temperature', value: 'temperature' },
    { id: 3, title: 'Observed vs Forecast', value: 'compare' },
  ];

  useEffect(() => {
    if (chartId) {
      const element = document.getElementById(chartId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [chartId]);

  function handleSectionChange(tab: string) {
    switch (tab) {
      case 'precipitation':
        return (
          <>
            <PrecipitationChart
              municipalityCode={municipalityCode || ''}
              id="forecast-precipitation"
            />
            <ObservedPrecipitationChart
              municipalityCode={municipalityCode || ''}
              id="current-precipitation"
            />
            <HourlyPrecipitaionChartDHM
              stationId={stationId || ''}
              id="dhmChart"
            />
            <PrecipitationChartHourly />
            <ObservedPrecipitationChartHourly />
          </>
        );
      case 'temperature':
        return (
          <>
            <TemperatureChart
              municipalityCode={municipalityCode || ''}
              id="temperature"
            />
            <ObservedTemperatureChart
              municipalityCode={municipalityCode || ''}
              id="current-temperature"
            />
            <TemperatureChartHourly />
            <ObservedTemperatureChartHourly />
          </>
        );
      case 'compare':
        // setSelectedTab('precipitaition');
        return (
          <>
            <ComparisonTemperatureChart />
            <ComparisonPrecipitationChart />
          </>
        );
      default:
        return <> </>;
    }
  }

  return (
    <>
      <ExploreHeader
        headerOptions={headerOptions}
        selectedTab={chartType || ''}
        onClick={tab => handleTabChange(tab)}
      />
      <FlexColumn className="gap-8">
        {handleSectionChange(chartType || '')}
        {analyticsChartData?.map((data: Record<string, any>, index: number) => {
          if (data.graph_type === 'bar') {
            return (
              <CustomBarChart
                key={`${data.id}-${index}`}
                header={data?.analytics}
                chartData={data?.data || []}
                Xaxis="date"
                dataKey={selectedStatistic}
                threshold={data.threshold}
              />
            );
          }
          if (data.graph_type === 'line') {
            return (
              <CustomLineChart
                key={`${data.id}-${index}`}
                header={data?.analytics}
                chartData={data?.data || []}
                Xaxis="date"
                dataKey={selectedStatistic}
                threshold={data.threshold}
              />
            );
          }
          return null;
        })}
      </FlexColumn>
    </>
  );
}
