/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useRef, useState } from 'react';
import Icon from '@Components/common/Icon';
import Input from '../Input';

interface ISelectProps {
  options: Record<string, any>[];
  selectedOption?: string | number;
  placeholder?: string;
  onChange?: (selectedOption: any) => void;
  labelKey?: string;
  valueKey?: string;
  direction?: string;
  className?: string;
}

function getPosition(direction: string) {
  switch (direction) {
    case 'top':
      return 'bottom-[2.4rem]';
    case 'bottom':
      return 'top-[2.8rem]';
    default:
      return 'top-[3rem]';
  }
}

export default function Select({
  options,
  selectedOption,
  onChange,
  placeholder = 'Select',
  labelKey = 'label',
  valueKey = 'value',
  direction = 'bottom',
  className,
}: ISelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedOption);
  const [position, setPosition] = useState(direction);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setSelected(selectedOption);
  }, [selectedOption]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      dropdownRef?.current?.focus();
    } else {
      setSearchText('');
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (value: string) => {
    setSelected(value);
    // @ts-ignore
    onChange(value);
  };

  const getPlaceholderText = () => {
    if (selected)
      // @ts-ignore
      return options.find(item => item[valueKey] === selected)?.[labelKey];
    return placeholder;
  };

  const filterOptions = options?.filter(opt =>
    opt[labelKey].toLowerCase().includes(searchText.toLowerCase()),
  );

  const showClearIcon = !!searchText.length;

  return (
    <div className="relative">
      <div
        ref={dropdownRef}
        className={`group relative flex h-11 w-full
        cursor-pointer items-center justify-between border-b-2
        hover:border-blue-400
        ${className}`}
        onClick={toggleDropdown}
      >
        <Input
          type="text"
          placeholder={getPlaceholderText()}
          className={`w-full border-none ${
            selected ? 'placeholder:text-grey-800' : ''
          } focus:placeholder:text-grey-400`}
          value={searchText}
          onClick={e => {
            setIsOpen(true);
          }}
          onChange={e => {
            setSearchText(e.target.value);
          }}
        />

        {showClearIcon ? (
          <Icon
            name="clear"
            className="hover:text-primary-400 absolute right-0 top-1/2 -translate-y-1/2
              items-center !text-base"
            onClick={() => setSearchText('')}
          />
        ) : (
          <Icon
            name={!isOpen ? 'expand_more' : 'search'}
            className="group-hover:text-primary-400 absolute right-0 top-1/2 -translate-y-1/2 items-center"
          />
        )}
      </div>

      {isOpen && (
        <ul
          className={`scrollbar absolute  z-40 flex max-h-[150px]
           w-full flex-col overflow-auto rounded-md border
            bg-white shadow-lg ${getPosition(position)} `}
        >
          {options && filterOptions.length > 0 ? (
            filterOptions.map(option => (
              <li
                className="flex cursor-pointer list-none items-start px-4 py-2.5
                text-sm text-grey-800 hover:bg-primary-50"
                key={option[valueKey]}
                onClick={() => handleOptionClick(option[valueKey])}
              >
                <div>{option[labelKey]}</div>
              </li>
            ))
          ) : (
            <li className="cursor-default px-4 py-2.5 text-sm">
              No options available
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
