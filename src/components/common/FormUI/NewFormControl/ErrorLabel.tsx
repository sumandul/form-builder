import { cn } from '@Utils/index';
import { HTMLAttributes } from 'react';

interface IErrorLabelProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  disabled?: boolean;
}
export default function ErrorLabel({
  message = '',
  disabled,
  className,
}: IErrorLabelProps) {
  return (
    <p
      className={cn(
        `text-[12px] font-normal text-others-rejected ${
          disabled ? 'text-gray-600' : ''
        }`,
        className,
      )}
    >
      {message}
    </p>
  );
}
