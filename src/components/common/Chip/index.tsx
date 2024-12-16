import { ReactElement } from 'react';
import Icon from '@Components/common/Icon';
import capitalizeFirstLetter from '@Utils/capitalizeFirstLetter';

interface IChipProps {
  label: string | ReactElement;
  onClose: any;
}

export default function Chip({ label, onClose }: IChipProps) {
  return (
    <div
      className="flex h-8 cursor-pointer items-center gap-1
      rounded-lg border border-grey-300 bg-grey-100 px-2 text-sm"
    >
      <p>{capitalizeFirstLetter(label.toString())}</p>
      <Icon
        onClick={onClose}
        name="close"
        className="!text-icon-sm font-bold "
      />
    </div>
  );
}
