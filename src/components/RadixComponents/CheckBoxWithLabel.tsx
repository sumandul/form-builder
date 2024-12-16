import { IRegisterProps } from '@Hooks/useForm/_lib';
import hasErrorBoundary from '@Components/common/hasErrorBoundary';
import { cn } from '@Utils/index';
import Checkbox from './CheckBox';

export interface ICheckBoxWithLabelProps extends Partial<IRegisterProps> {
  checkBoxLabel: string;
  checkBoxWithLabelcClassName?: string;
}

function CheckBoxWithLabel({
  id,
  checkBoxLabel,
  onChange,
  bindvalue,
  checkBoxWithLabelcClassName,
}: ICheckBoxWithLabelProps) {
  return (
    <div
      className={cn(
        `box flex w-full items-center justify-end gap-2`,
        checkBoxWithLabelcClassName,
      )}
    >
      <Checkbox
        checked={bindvalue}
        id={id}
        onCheckedChange={(e: any) => {
          if (onChange) onChange(e);
        }}
      />
      <label
        htmlFor={id}
        className="inline-block cursor-pointer text-[0.875rem]"
      >
        {checkBoxLabel}
      </label>
    </div>
  );
}
export default hasErrorBoundary(CheckBoxWithLabel);
