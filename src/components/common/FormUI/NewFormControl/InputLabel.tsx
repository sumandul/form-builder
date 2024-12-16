import ToolTip from '@Components/RadixComponents/ToolTip';
import { IInputLabelProps } from './lib';

export default function InputLabel({
  label,
  tooltipMessage,
  astric,
  id,
  disabled,
}: IInputLabelProps) {
  return (
    <div
      className={`label flex h-5 items-center text-tooltip ${
        disabled ? 'text-gray-400' : 'text-gray-800'
      }`}
    >
      <p id={id} className="body-sm">
        {label}
      </p>
      {astric ? <span className="text-red-600">&nbsp;*</span> : null}
      <div className="tooltip ml-1  ">
        {tooltipMessage ? (
          <ToolTip name="info" message={tooltipMessage || 'tooltip'} />
        ) : null}
      </div>
    </div>
  );
}
