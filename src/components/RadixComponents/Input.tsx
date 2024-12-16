/* eslint-disable react/jsx-props-no-spreading */
import Icon from '@Components/common/Icon';
import { cn } from '@Utils/index';
import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasIcon?: boolean;
  rightIconName?: string;
  leftIconName?: string;
  varientSize?: 'sm' | 'lg';
  iconStyle?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      hasIcon = false,
      rightIconName = '',
      leftIconName = '',
      varientSize = 'lg',
      iconStyle = '',
      onClick,
      ...props
    },
    ref,
  ) => {
    const sizeVarient = {
      sm: 'h-[2.25rem]',
      lg: 'h-[2.75rem]',
    };
    if (hasIcon)
      return (
        <div
          className={cn(
            `-[12px] group flex w-full items-center justify-center gap-[2px] rounded-md border bg-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-b-gray-600 disabled:opacity-5`,
            className,
            sizeVarient[varientSize],
          )}
        >
          {rightIconName && (
            <Icon
              name={rightIconName}
              className={cn(
                'group-hover:bg-teal-green-50 mt-[3px] p-0 px-1 text-2xl',
                iconStyle,
              )}
              onClick={onClick}
            />
          )}
          <input
            type={type}
            className={cn(
              'border-input hover:bg-teal-green-50 flex  h-full w-full bg-transparent pl-[8px] text-sm transition-all duration-200 file:border-0 file:bg-transparent  file:text-sm file:font-medium placeholder:text-gray-400 focus:border-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            )}
            ref={ref}
            onClick={onClick}
            {...props}
          />
          {leftIconName && (
            <Icon
              name={leftIconName}
              className={cn('mt-[3px] p-0 px-1 text-2xl', iconStyle)}
              onClick={onClick}
            />
          )}
        </div>
      );

    return (
      <input
        type={type}
        className={cn(
          'hover:bg-teal-green-50 flex h-10 w-full rounded-md border border-gray-400 bg-transparent bg-white px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50',
          className,
          sizeVarient[varientSize],
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export default Input;
