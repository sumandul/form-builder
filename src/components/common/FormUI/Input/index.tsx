import * as React from "react";
import {
  FieldError,
  FieldValues,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import { cn } from "../../../../utils/index";

export interface IInputProps<TFieldValues extends FieldValues = FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  register?: UseFormRegister<TFieldValues>; // Typed register from react-hook-form
  rules?: RegisterOptions; // Validation rules
  errors?: Record<string, FieldError | undefined>;
  placeholder?: string; // Errors from react-hook-form
}

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
      <div className="flex flex-col gap-2">
        {label && (
          <label className="capitalize text-base" htmlFor={name}>
            {label}
          </label>
        )}
        <div>
          <input
            type={type}
            id={name}
            placeholder={placeholder}
            {...(register && register(name, rules))} // Registering input with rules
            className={cn(
              `hover:border-primary-400 focus:border-primary-400 flex h-11 rounded-lg border-b-2
            border-grey-300 bg-transparent px-3 text-body-md file:font-medium 
            focus:bg-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
              className
            )}
            ref={ref}
            {...rest}
          />
          {errors?.[name] && (
            <p className="text-sm text-red-500 font-light capitalize">
              {errors[name]?.message}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
