/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useEffect } from 'react';

interface ISearchbarProps {
  value: string | number;
  className?: string;
  placeholder?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: any) => void;
  isSmall?: boolean;
  isFocus?: boolean;
}
export default function Searchbar({
  className,
  placeholder = 'Search',
  value,
  onChange,
  isSmall,
  isFocus,
}: ISearchbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClearSearch = () => {
    onChange({ target: { value: '' } });
    inputRef?.current?.focus();
  };
  useEffect(() => {
    if (!isFocus) return;
    inputRef?.current?.focus();
  }, [isFocus]);
  return (
    <div className={`flex w-full items-center ${isSmall ? 'h-10' : 'h-12'} `}>
      <label htmlFor="simple-search" className="sr-only">
        {placeholder}
      </label>
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            aria-hidden="true"
            className="h-[22px] w-[22px] text-grey-800"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          className={`block w-full rounded-lg border  border-grey-300
            pl-[44px] pr-[40px] focus:border-[#484848] focus:outline-none ${
              isSmall ? 'h-[36px] py-2' : 'h-[40px] py-3'
            }
            ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
        {value && (
          <div
            className={`absolute right-3 top-1/2 flex -translate-y-1/2
        cursor-pointer items-center justify-center rounded-full bg-grey-200 p-1 hover:bg-gray-400`}
            onClick={handleClearSearch}
          >
            <span className="material-symbols-outlined text-[18px] text-grey-800">
              close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
