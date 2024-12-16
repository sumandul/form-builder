/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useRef, useState } from 'react';
import Icon from '@Components/common/Icon';
import Input from '../Input';

interface IMultiSelectProps {
  options: Record<string, any>[];
  selectedOptions?: string[];
  placeholder?: string;
  onChange?: (selectedOptions: string[]) => any;
  labelKey?: string;
  valueKey?: string;
  className?: string;
}

export default function MultiSelect({
  options,
  selectedOptions,
  onChange,
  placeholder = 'Select',
  labelKey = 'label',
  valueKey = 'value',
  className,
}: IMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState(selectedOptions || []);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setSelected(selectedOptions || []);
  }, [selectedOptions]);

  const toggleOption = (optionValue: string) => {
    const updatedSelected = selectedOptions?.includes(optionValue)
      ? selected.filter(item => item !== optionValue)
      : [...selected, optionValue];

    // setSelected(updatedSelected);
    onChange?.(updatedSelected);
  };

  function getPlaceholderText() {
    const selectedLength = selected.length;
    let placeholderText = '';
    if (!selectedLength) {
      placeholderText = placeholder;
    } else if (selectedLength === 1) {
      const selectedLabel = options.find(
        item => item[valueKey] === selected[0],
      )?.[labelKey];
      placeholderText = selectedLabel || '';
    } else {
      placeholderText = `${selectedLength} Selected`;
    }
    return placeholderText;
  }

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
  const filterOptions = options?.filter(
    opt =>
      opt[labelKey]
        ?.toString()
        ?.toLowerCase()
        .includes(searchText.toLowerCase()),
  );

  const showClearIcon = !!searchText.length;

  return (
    <div
      ref={dropdownRef}
      className={`group relative flex  h-11 w-full
       cursor-pointer  items-center justify-between ${className}`}
      onClick={() => {
        setIsOpen(true);
      }}
    >
      <Input
        type="text"
        placeholder={getPlaceholderText()}
        className={`w-full  ${
          selected.length ? 'placeholder:text-grey-800' : ''
        } focus:placeholder:text-grey-400 `}
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
          className="hover:text-primary-400 absolute right-0 
        items-center !text-base"
          onClick={() => setSearchText('')}
        />
      ) : (
        <Icon
          name={!isOpen ? 'expand_more' : 'search'}
          className="group-hover:text-primary-400 absolute right-0 items-center"
        />
      )}

      {isOpen && (
        <ul
          className="scrollbar animate-flip-down absolute top-[44px] z-20 flex
         max-h-[160px] w-full flex-col gap-1 overflow-auto border
         bg-white py-1 shadow-lg duration-300"
        >
          {options && filterOptions.length > 0 ? (
            filterOptions.map(option => (
              <li
                className="flex cursor-pointer list-none items-start 
                px-2 py-2 text-sm hover:bg-primary-50"
                key={option[valueKey]}
                onClick={e => {
                  e.stopPropagation();
                  toggleOption(option[valueKey]);
                }}
              >
                <input
                  type="checkbox"
                  className="mr-2 h-5"
                  value={option[valueKey]}
                  checked={selected.includes(option[valueKey])}
                  onChange={() => toggleOption(option[valueKey])}
                />
                <div>{option[labelKey]}</div>
              </li>
            ))
          ) : (
            <li className="cursor-default px-1 py-1 text-sm">
              No options available
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
