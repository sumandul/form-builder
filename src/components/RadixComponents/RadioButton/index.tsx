import { Tabs } from '@radix-ui/react-tabs';
import { IRadioData, IRadioDataProps } from './_lib';
import { TabsList, TabsTrigger } from '../ClickableTab';

function getTabSize(size: string) {
  switch (size) {
    case 'xs':
      return '!h-8';
    case 'sm':
      return 'h-9';
    case 'lg':
      return 'h-10';
    case 'cols-2':
      return 'h-10 !grid !grid-cols-3';
    default:
      return 'h-10';
  }
}

function getTriggerSize(size: string) {
  switch (size) {
    case 'xs':
      return '!py-0.5 !h-fit !px-1';
    default:
      return '';
  }
}

export default function RadioButton({
  id = 'input-form-control',
  className,
  bindvalue,
  options = [],
  choose = 'id',
  onChange,
  buttonSize = 'lg',
}: IRadioDataProps) {
  const handleClick = (val: string) => {
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <Tabs
      id={id}
      defaultValue={bindvalue}
      value={String(bindvalue)}
      className={`w-fit ${
        buttonSize === 'cols-2' ? 'n h-[80px] rounded-lg bg-gray-100' : ''
      } ${className}`}
    >
      <TabsList className={`${getTabSize(buttonSize)}`}>
        {options?.map((itm: IRadioData) => (
          <TabsTrigger
            key={itm?.label}
            value={String(itm[choose])}
            onClick={() => handleClick(String(itm[choose]))}
            className={`${getTriggerSize(buttonSize)} font-extrabold`}
          >
            {itm?.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
