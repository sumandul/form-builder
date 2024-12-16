import ToolTip from '@Components/RadixComponents/ToolTip';
import CaptureComponent from '../CaptureComponent';

export interface IChartHeaderProps {
  chartTitle: string;
  hasDownloadBtn?: boolean;
  downloadComponentRef: React.RefObject<any>;
}

export default function ChartHeader({
  chartTitle,
  hasDownloadBtn,
  downloadComponentRef,
}: IChartHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <h3 className="relative pr-5 text-lg font-bold text-grey-800">
        {chartTitle}
      </h3>

      <div className="flex items-center justify-end gap-3">
        {hasDownloadBtn && (
          <div
            className="actions w-40px flex cursor-pointer
           rounded-lg p-1"
          >
            <ToolTip
              name="download"
              message="Download chart"
              className="!text-2xl"
              messageStyle="font-normal"
              iconClick={() =>
                CaptureComponent({
                  componentRef: downloadComponentRef,
                  captureName: chartTitle,
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
