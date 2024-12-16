import { IRegisterProps } from '@Hooks/useForm/_lib';
import { IDropDownData } from '../Dropdown';

export interface IRadioData {
  label: string;
  value: string | boolean | number;
  id?: string | number;
  code?: string;
}

export interface IRadioDataProps extends Partial<IRegisterProps> {
  options: IDropDownData[];
  choose?: keyof IDropDownData;
  disabled?: boolean;
  buttonSize: string;
}
