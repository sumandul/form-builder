import { cn } from '@Utils/index';
import Dropdown, { IComboBoxProps } from '@Components/RadixComponents/Dropdown';
import Textarea from '@Components/RadixComponents/TextArea';
import DragAndDrop from '@Components/RadixComponents/DragAndDrop';
import hasErrorBoundary from '@Components/common/hasErrorBoundary';
import DatePicker from '@Components/RadixComponents/DatePicker';
import Input from '@Components/RadixComponents/Input';
import { IDatePickerProps } from '@Components/RadixComponents/DatePicker/_lib_';
import CheckBoxWithLabel, {
  ICheckBoxWithLabelProps,
} from '@Components/RadixComponents/CheckBoxWithLabel';
import Checkbox from '@Components/RadixComponents/CheckBox';
import RadioButton from '@Components/RadixComponents/RadioButton';
import { IRadioDataProps } from '@Components/RadixComponents/RadioButton/_lib';
import ComboBox from '@Components/RadixComponents/ComboBox';
import Toggle from '@Components/RadixComponents/Toggle';
import ErrorLabel from './ErrorLabel';
import { FormControlTypes, IInputLabelProps, IInputProps } from './lib';
import InputLabel from './InputLabel';
import MultiSelect from '../MultiSelect';

interface IFormControlProps
  extends Partial<IInputProps>,
    Partial<Omit<IInputLabelProps, 'astric'>>,
    Partial<IDatePickerProps>,
    Partial<IComboBoxProps>,
    Partial<ICheckBoxWithLabelProps>,
    Omit<Partial<IRadioDataProps>, 'choose'> {
  controlType: FormControlTypes;
  disabled?: boolean;
  requiredControl?: boolean;
  controlsize?: string;
  customFn?: () => void;
  error?: any;
  rows?: number;
  selectedOptions?: any;
  controlElementStyle?: string;
  valueKey?: string | number;
}

function FormControl({
  controlType,
  label = '',
  error,
  required,
  tooltipMessage,
  className,
  disabled,
  requiredControl = false,
  controlElementStyle,
  checked,

  ...props
}: IFormControlProps) {
  const controlElements: Record<string, any> = {
    input: Input,
    textArea: Textarea,
    dropDown: Dropdown,
    dragAndDrop: DragAndDrop,
    datePicker: DatePicker,
    checkBox: Checkbox,
    checkBoxWithLabel: CheckBoxWithLabel,
    radio: RadioButton,
    comboBox: ComboBox,
    toggle: Toggle,
    multiSelect: MultiSelect,
  };
  const ControlElement = controlElements[controlType];

  return (
    <div className={cn('form-control flex flex-col gap-[0.5rem] ', className)}>
      {label && controlType !== 'toggle' && (
        <InputLabel
          label={label}
          tooltipMessage={tooltipMessage}
          astric={requiredControl}
          disabled={disabled}
        />
      )}
      <ControlElement
        {...props}
        label={label}
        error={error}
        requiredControl={requiredControl}
        disabled={disabled}
        className={controlElementStyle}
        checked={checked}
      />
      {/* {touched && error && typeof error === 'string' ? <ErrorLabel message={error} disabled={disabled} /> : null} */}
      {error ? <ErrorLabel message={error} disabled={disabled} /> : null}
    </div>
  );
}
export default hasErrorBoundary(FormControl);
