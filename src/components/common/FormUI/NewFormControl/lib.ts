/* eslint-disable no-unused-vars */
export interface IInputLabelProps {
  label: string;
  tooltipMessage?: string;
  astric?: boolean;
  id?: string;
  disabled?: boolean;
}

export interface IInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'onFocus'
  > {
  onChange?: (e: any) => void;
  onFocus?: (e?: any) => void;
  hasIcon?: boolean;
  iconName?: string;
  varientSize?: 'sm' | 'lg';
  iconStyle?: string;
}

export type FormControlTypes =
  | 'dropDown'
  | 'input'
  | 'textArea'
  | 'dragAndDrop'
  | 'datePicker'
  | 'checkBox'
  | 'checkBoxWithLabel'
  | 'radio'
  | 'comboBox'
  | 'toggle'
  | 'multiSelect';
