/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import Icon from '@Components/common/Icon';
import { FlexColumn, FlexRow } from '@Components/common/Layouts';
// import Dropdown from '@Components/RadixComponents/Dropdown';
import DatePicker from '@Components/RadixComponents/DatePicker';
import { useRef, useState } from 'react';
import { handleDownloadPNG } from '@Utils/downloadChart';

interface IBarChartProps {
  header: string;
  chartData: Record<string, any>[];
  Xaxis: string;
  dataKey: string;
  threshold: number;
}

export default function CustomBarChart({
  header,
  chartData,
  Xaxis,
  dataKey,
  threshold,
}: IBarChartProps) {
  const chartRef = useRef(null);
  const Ydomain = [0, threshold ? Math.round(threshold + 2) : 10];
  const [download, showDownload] = useState(false);
  return (
    <div
      ref={chartRef}
      className="relative mt-10 rounded-lg border border-grey-300 px-4 pb-3 pt-5"
    >
      {download && (
        <div
          className="absolute right-10 top-5 z-10 h-[6.188rem] w-[9.25rem] rounded-lg border bg-grey-100"
          data-html2canvas-ignore="true"
        >
          <FlexColumn className="h-full items-center hover:cursor-pointer">
            <span
              className="h-1/2 w-full px-2.5 pt-2.5 font-primary text-body-md hover:bg-grey-200"
              onClick={() => handleDownloadPNG(chartRef, 'bar-chart')}
            >
              Download as PNG
            </span>
            <span className="h-1/2 w-full border-t px-2.5 pt-2.5 font-primary text-body-md hover:bg-grey-200">
              Download as CSV
            </span>
          </FlexColumn>
        </div>
      )}
      <FlexRow className="mb-6 justify-between">
        <h6 className="font-primary">{header}</h6>
        <div data-html2canvas-ignore="true" className="flex">
          <div className="flex items-center border-r px-4">
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
              onChange={() => {}}
              disabled
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
        <div data-html2canvas-ignore="true">
          <Icon
            onClick={() => {
              showDownload(!download);
            }}
            name={`${!download ? 'download' : 'close'}`}
            className="text-[1.35rem] text-[#757575]"
          />
        </div>
      </FlexRow>
      <ResponsiveContainer className="min-h-[13rem] w-full">
        <BarChart
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
            // domain={Ydomain}
            {...(threshold >= chartData?.[0]?.min && { domain: Ydomain })}
            tick={{ style: { fontSize: '12px', fontWeight: '400' } }}
          />
          <Tooltip />
          <Bar
            dataKey={dataKey}
            fill="#0E2E63"
            barSize={20}
            radius={[5, 5, 0, 0]}
          />
          <CartesianGrid vertical={false} strokeDasharray="5 5" />
          <ReferenceLine
            isFront
            y={threshold}
            stroke="#FF0000"
            strokeWidth={2}
            strokeDasharray="3 3"
            label="threshold"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
