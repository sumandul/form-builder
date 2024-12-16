/* eslint-disable react/display-name */
import { HtmlHTMLAttributes, ReactNode, forwardRef } from 'react';

interface IRoundedContainerProps extends HtmlHTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  ref?: React.RefObject<HTMLDivElement>;
}

const RoundedContainer = forwardRef<HTMLDivElement, IRoundedContainerProps>(
  ({ children, className, ...restProps }, ref) => {
    return (
      <div
        ref={ref}
        className={`h-fit w-fit rounded-xl border-[0.5px] transition-all duration-200 ${className}`}
        {...restProps}
      >
        {children}
      </div>
    );
  },
);

export default RoundedContainer;
