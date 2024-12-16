/* eslint-disable camelcase */

// import warningIcon from '@Assets/images/warning.png';
import syrenIcon from '@Assets/images/syren.png';
import Skeleton from '@Components/RadixComponents/Skeleton';
import { format } from 'date-fns';

export default function LogCard({
  description,
  title,
  date_created,
  icon,
}: {
  title: string;
  description: string;
  date_created: string;
  icon: string;
}) {
  return (
    <div className="flex h-fit items-start justify-between gap-5 rounded-lg border-2 p-2 ">
      <img alt="alert-icons" src={icon || syrenIcon} className="h-14 w-14" />
      <div className="content flex flex-1 flex-col gap-2 ">
        <h6 className="line-clamp-1">{title}</h6>
        <p className="body-md">{description}</p>
      </div>
      <p>
        {format(
          date_created ? new Date(date_created) : new Date(),
          "yyyy-MM-dd | hh:mm aaaaa'm'",
        )}
      </p>
    </div>
  );
}

export function LogCardSkeleton() {
  return (
    <div className="flex h-fit items-start justify-between gap-5 rounded-lg border-2 p-2 ">
      <Skeleton className="h-8 w-8" />
      <div className="content flex h-10 flex-1 flex-col gap-2 ">
        <Skeleton className="line-clamp-1 h-2 w-[10rem] flex-1" />
        <Skeleton className="body-md h-4 w-full flex-1" />
      </div>
      <Skeleton className="body-md h-4 w-20" />
    </div>
  );
}
