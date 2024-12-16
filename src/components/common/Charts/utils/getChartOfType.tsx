import CustomDonutChart from '../DonutChart';
import CustomBarChart from '../BarChart';
import CustomHorizontalBarChart from '../HorizontalBarChart';
import { ChartTypes } from '../types';

export default function getChartOfType(type: ChartTypes) {
  switch (type) {
    case 'bar':
      return CustomBarChart;
    case 'donut':
      return CustomDonutChart;
    case 'horizontalBar':
      return CustomHorizontalBarChart;
    default:
      return null;
  }
}
