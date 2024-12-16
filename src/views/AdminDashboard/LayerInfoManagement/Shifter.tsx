/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@Components/RadixComponents/Button';
import Icon from '@Components/common/Icon';
import { IRegisterProps } from '@Hooks/useForm/_lib';
import { toggleObjectInArray } from '@xmanscript/utils';
import { useEffect, useState } from 'react';
// import { toggleStringInArray } from '@xmanscript/utils';
import ErrorLabel from '@Components/common/FormUI/NewFormControl/ErrorLabel';
import Item from './Item';

interface IShifterProps extends Partial<IRegisterProps> {
  title: string;
  right?: boolean;
  left?: boolean;
}
export default function Shifter({
  right,
  left,
  title,
  bindvalue,
  onChange,
  placeholder,
  error,
  disabled,
}: IShifterProps) {
  const [checkedList, setCheckedList] = useState<string[]>([]);
  useEffect(() => {
    setCheckedList(() => {
      return bindvalue?.value?.reduce(
        (acc: string[], item: Record<string, any>) => {
          if (item.checked) return [...acc, item];
          return acc;
        },
        [],
      );
    });
  }, [bindvalue]);

  return (
    <div className="w-full">
      <div className="cover flex h-[18rem] min-w-[21rem] max-w-full items-start gap-4 ">
        {left && (
          <div className="left-actions flex h-full flex-col items-center justify-end gap-2">
            <Button
              type="button"
              variant="icon-primary"
              className="!h-9 !w-9 !border !border-[#d7d7d7] !p-0"
              onClick={() => {
                if (onChange)
                  onChange({
                    tag: 'left_one',
                    value: bindvalue.value,
                    selected: checkedList,
                  });
              }}
            >
              <Icon name="chevron_left" className=" mt-1 " />
            </Button>
            <Button
              type="button"
              variant="icon-primary"
              className="!h-9 !w-9 !border !border-[#d7d7d7] !p-0"
              onClick={() => {
                if (onChange)
                  onChange({
                    tag: 'left_all',
                    value: bindvalue.value,
                    selected: bindvalue?.value?.reduce(
                      (acc: string[], item: Record<string, any>) => [
                        ...acc,
                        item,
                      ],
                      [],
                    ),
                  });
              }}
            >
              <Icon name="keyboard_double_arrow_left" className=" mt-1" />
            </Button>
          </div>
        )}
        <div
          className="content flex h-full min-w-[18.25rem] max-w-full flex-1 flex-col gap-2 rounded-lg p-3"
          style={{
            boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.16)',
          }}
        >
          <p className="text-button-md">{title}</p>
          <div className="list scrollbar flex h-full flex-col overflow-y-auto">
            {(bindvalue?.value as Record<string, any>[])?.length ? (
              (bindvalue?.value as Record<string, any>[])?.map((item: any) => (
                <Item
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  checked={checkedList?.includes(item || '')}
                  onClick={() => {
                    setCheckedList(prev => {
                      const newList = toggleObjectInArray(prev, item);
                      return [...newList];
                    });
                  }}
                />
              ))
            ) : (
              <div className="flex h-[30%] items-center justify-center bg-gray-100 p-2 text-center text-xs text-gray-700">
                <p>{placeholder || 'No Items'}</p>
              </div>
            )}
          </div>
          <div className="flex w-full items-center justify-center">
            {error ? <ErrorLabel message={error} disabled={disabled} /> : null}
          </div>
        </div>
        {right && (
          <div className="right-actions flex h-full flex-col items-center justify-start gap-2">
            <Button
              type="button"
              variant="icon-primary"
              className="!h-9 !w-9 !border !border-[#d7d7d7] !p-0"
              onClick={() => {
                if (onChange)
                  onChange({
                    tag: 'right_one',
                    value: bindvalue.value,
                    selected: checkedList,
                  });
              }}
            >
              <Icon name="chevron_right" className=" mt-1" />
            </Button>
            <Button
              type="button"
              variant="icon-primary"
              className="!h-9 !w-9 !border !border-[#d7d7d7] !p-0"
              onClick={() => {
                if (onChange)
                  onChange({
                    tag: 'right_all',
                    value: bindvalue.value,
                    selected: bindvalue?.value?.reduce(
                      (acc: string[], item: Record<string, any>) => [
                        ...acc,
                        item,
                      ],
                      [],
                    ),
                  });
              }}
            >
              <Icon name="keyboard_double_arrow_right" className=" mt-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
