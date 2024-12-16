import Skeleton from '@Components/RadixComponents/Skeleton';
import { FlexColumn } from '@Components/common/Layouts';

export default function MapInfoDailogSkeleton() {
  return (
    <div className="px-4">
      <Skeleton className="my-4 h-[20px] w-3/5" />
      <FlexColumn className="my-4 gap-2 rounded-lg border-[1px] border-grey-300">
        <Skeleton className="h-[18px] w-[100%] bg-gray-100" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-200" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-100" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-200" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-100" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-200" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-100" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-200" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-100" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-200" />
      </FlexColumn>
      <FlexColumn className="my-6 gap-2 rounded-lg border-[1px] border-grey-300">
        <Skeleton className="h-[18px] w-[100%] bg-gray-100" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-200" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-100" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-200" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-100" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-200" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-100" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-200" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-100" />
        <Skeleton className="h-[18px] w-[100%] bg-gray-200" />
      </FlexColumn>
    </div>
  );
}
