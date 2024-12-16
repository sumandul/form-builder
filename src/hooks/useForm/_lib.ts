/* eslint-disable no-unused-vars */
export interface IRegisterProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'onFocus' | 'onAbort'
  > {
  bindvalue: any;
  onFocus: (e?: any) => void;
  onChange: (e: any) => void;
  touched: boolean;
  error: string;
  pretoucherror: any;
  controlleddisabled: boolean | undefined;
  uniquename: string;
}
export interface IFormState {
  isSubmitting?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  error?: string;
}
export interface IYupError {
  message: string;
  path: string;
}
