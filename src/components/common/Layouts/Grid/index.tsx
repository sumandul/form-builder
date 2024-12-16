/* eslint-disable react/jsx-props-no-spreading */
import { cn } from '@Utils/index';
import { IGridContainerProps } from '../types';

export default function Grid({
  className = '',
  children,
  cols,
  gap,
  ...rest
}: IGridContainerProps) {
  return (
    <div
      className={cn(
        `grid  md:grid-cols-2 ${gap ? `gap-x-2` : ''} ${className}`,
      )}
      style={{
        gridTemplateColumns: cols ? `repeat(${cols}, minmax(0, 1fr))` : '',
        gap: gap ? `${gap * 0.25}rem` : '',
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
