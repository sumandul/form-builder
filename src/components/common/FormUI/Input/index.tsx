import * as React from "react";

import { cn } from "../../../../utils";

export interface IInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      className,
      placeholder,
      label,
      type,
      register,
      rules,
      name,
      errors,
      ...rest
    },
    ref
  ) => {
    return (
      <>
        <div className=" flex flex-col gap-2">
          {label && (
            <label className=" capitalize text-base" htmlFor="input">
              {label}
            </label>
          )}
          <div>
            <input
              type={type}
              id=" input"
              placeholder={placeholder}
              {...(register && register(name, rules))}
              className={cn(
                `hover:border-primary-400 focus:border-primary-400 flex h-11 rounded-lg border-b-2
            border-grey-300 bg-transparent px-3
             text-body-md file:font-medium focus:bg-transparent
            focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
                className
              )}
              ref={ref}
              {...rest}
            />
            {errors && (
              <p className=" text-sm   text-red-500  font-light  capitalize ">
                {errors[name]?.message}
              </p>
            )}
          </div>
        </div>
      </>
    );
  }
);
Input.displayName = "Input";

export default Input;
