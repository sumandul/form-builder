/* eslint-disable react/no-array-index-key */
import Skeleton from '@Components/RadixComponents/Skeleton';
import { FlexColumn, FlexRow } from '@Components/common/Layouts';

const numberOfRows = 9;
const numberOfColumns = 6;

export default function TableSkeleton() {
  return (
    <FlexColumn className="mt-3 h-[72vh] rounded-md border pt-6 shadow-lg">
      <FlexRow className="items-center space-x-20 border-b-[1px] px-10 pb-5 ">
        <Skeleton className="h-4 w-1/12 xl:h-6" />
        {Array.from({ length: numberOfColumns }).map((__, index) => (
          <Skeleton key={index} className="h-4 w-1/4 xl:h-6" />
        ))}
      </FlexRow>
      {Array.from({ length: numberOfRows }).map((_, idx) => (
        <FlexRow
          key={idx}
          className="space-x-20 border-b-[1px] px-10 py-3 xl:py-4"
        >
          <Skeleton className="h-4 w-1/12 " />
          {Array.from({ length: numberOfColumns }).map((__, index) => (
            <Skeleton key={index} className="h-4 w-1/4" />
          ))}
        </FlexRow>
      ))}
    </FlexColumn>
  );
}
