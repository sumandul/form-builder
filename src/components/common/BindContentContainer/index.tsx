import { cn } from '@Utils/index';
import { HTMLAttributes } from 'react';

export default function BindContentContainer({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('max-w-[73.5rem]', className)}>{children}</div>;
}
