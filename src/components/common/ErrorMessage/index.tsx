import { cn } from '@Utils/index';
import { HTMLAttributes } from 'react';

interface IErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  disabled?: boolean;
}
export default function ErrorMessage({
  message = '',
  disabled,
  className,
}: IErrorMessageProps) {
  return (
    <p
      className={cn(
        `text-sm font-normal text-red-400 ${disabled ? 'text-grey-600' : ''}`,
        className,
      )}
    >
      {message}
    </p>
  );
}
