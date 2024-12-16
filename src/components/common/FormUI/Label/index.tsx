import { cn } from '@Utils/index';
import { ReactNode } from 'react';

interface ILabelProps {
  className?: string;
  children: ReactNode;
  htmlFor?: string | number;
  required?: boolean;
}

export default function Label({
  className,
  children,
  htmlFor,
  required,
}: ILabelProps) {
  return (
    <label
      className={cn('font-primary text-tooltip text-grey-800', className)}
      htmlFor={htmlFor?.toString()}
    >
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
}
