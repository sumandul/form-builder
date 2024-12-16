import { IRegisterProps } from '@Hooks/useForm/_lib';
import InputLabel from '@Components/common/FormUI/NewFormControl/InputLabel';
import Switch from './Switch';

interface ISwitchProps extends Partial<IRegisterProps> {
  label: string;
  tooltipMessage: string;
  requiredControl: boolean;
  disabled: boolean;
  // checked: boolean;
}

export default function Toggle({
  label,
  tooltipMessage,
  requiredControl,
  disabled,
  id,
  // checked,
  bindvalue,
  onChange,
}: ISwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <InputLabel
        label={label}
        tooltipMessage={tooltipMessage}
        astric={requiredControl}
        disabled={disabled}
      />
      <Switch
        checked={!!bindvalue}
        id={id}
        onCheckedChange={e => {
          // @ts-ignore
          if (onChange) onChange(e);
        }}
        // value={value}
      />
    </div>
  );
}
