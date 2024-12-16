import { IRegisterProps } from '@Hooks/useForm/_lib';

export interface IDatePickerProps extends Partial<IRegisterProps> {
  className?: string;
  canType?: boolean;
  mode?: string;
  noIcon?: boolean;
  selected?: Date | null;
  dateFormat?: string;
  selectsStart?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  placeholder?: string;
  disabled?: boolean;
  maxDate?: Date | null;
  placeholderText?: string;
  selectsEnd?: boolean;
  minDate?: Date | null;
}
