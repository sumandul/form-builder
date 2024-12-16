import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import Icon from '@Components/common/Icon';
import DatePicker from '@Components/RadixComponents/DatePicker';
// import Dropdown from '@Components/RadixComponents/Dropdown';
import { FlexRow } from '@Components/common/Layouts';
import { useRef } from 'react';
import { handleDownloadPNG } from '@Utils/downloadChart';
import ToolTip from '@Components/common/ToolTip';

interface ILineChartProps {
  header: string;
  chartData: Record<string, any>[];
  Xaxis: string;
  dataKey: string;
  threshold: number;
}

export default function CustomLineChart({
  header,
  chartData,
  Xaxis,
  dataKey,
  threshold,
}: ILineChartProps) {
  const chartRef = useRef(null);
  const Ydomain = [0, threshold ? Math.round(threshold + 2) : 10];
  return (
    <div
      ref={chartRef}
      className="mt-10 rounded-lg border-[1px] border-grey-300 px-4 pb-3 pt-5"
    >
      <FlexRow className="mb-6 justify-between">
        <h6 className="font-primary">{header}</h6>
        <div data-html2canvas-ignore="true" className="flex">
          <div className="flex items-center border-r-[1px] px-4">
            <span className="mr-2 font-primary text-tooltip">
              Threshold Value :
            </span>
            <span>25mm</span>
            {/* <Dropdown
              dropDownSize="sm"
              placeholder="25mm"
              options={[]}
              choose="value"
              className="!h-9 w-[7rem] !border-gray-300 !bg-white"
              disabled
              onChange={() => {}}
            /> */}
          </div>
          <div className="ml-4 w-[7rem]">
            <DatePicker noIcon placeholder="Sep 1" className="!h-10" />
          </div>
          <p className="ml-2.5 mt-3 font-primary text-tooltip">to</p>
          <div className="ml-4 w-[7rem]">
            <DatePicker noIcon placeholder="Sep 11" className="!h-10" />
          </div>
        </div>
        <div>
          <ToolTip content="Download the Chart" direction="down">
            <Icon
              onClick={() => handleDownloadPNG(chartRef, 'line-chart')}
              name="download"
              className="text-[1.35rem] text-[#757575]"
            />
          </ToolTip>
        </div>
      </FlexRow>
      <ResponsiveContainer className="min-h-[13rem] w-[100%]">
        <LineChart
          width={500}
          height={208}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey={Xaxis}
            tick={{ style: { fontSize: '12px', fontWeight: '400' } }}
          />
          <YAxis
            label={{
              value: header,
              angle: -90,
              position: 'insideBottomCenter',
              dy: 0,
              dx: -16,
              style: {
                fontSize: '14px',
                fontWeight: '600',
              },
            }}
            domain={Ydomain}
            tick={{ style: { fontSize: '12px', fontWeight: '400' } }}
          />
          <Tooltip />
          <Line dataKey={dataKey} fill="#0E2E63" />
          <CartesianGrid strokeDasharray="5 5" />
          <ReferenceLine
            isFront
            y={threshold}
            stroke="#FF0000"
            strokeWidth={2}
            strokeDasharray="3 3"
            label="threshold"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
