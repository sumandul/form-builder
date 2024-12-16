/* eslint-disable react/prop-types */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@Utils/index';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary-500 text-white hover:shadow hover:shadow-primary-900',
        // destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border text-primary-500 border-primary-500 border-input hover:bg-primary-500 hover:text-white',
        secondary:
          'bg-white text-primary-500 hover:shadow-primary-50 font-primary-font',
        ghost:
          'text-primary-500 font-[400] disabled:text-grey-600 hover:text-primary-600 pointer-events-null cursor-not-allowed border border-gray-400',
        drop: 'bg-white text-gray-900 font-[400] text-[14px] border border-gray-400 hover:bg-teal-green-50 focus:border-gray-900',
        link: 'text-primary-500 font-bold underline-offset-4 hover:no-underline text-primarycolor hover:shadow hover:shadow-primary-400',
        'icon-primary':
          'border-2  hover:bg-gray-50 font-[0.875rem] !border-primary-500',
      },
      size: {
        lg: 'h-[44px] px-8 rounded-md',
        sm: 'h-[36px] px-[16px] py-[18px] rounded-md',
        'lg-icon': 'p-[0.625rem] h-fit',
        'sm-icon': 'p-[0.375rem] h-fit',
        'drop-lg': 'h-[44px] px-[0.75rem] rounded-md',
        'drop-md': 'h-9 px-[0.75rem] rounded-md',
        'drop-sm': 'h-8 px-[0.75rem] rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
