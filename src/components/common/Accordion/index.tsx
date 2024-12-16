/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ReactNode, useEffect, useState } from 'react';

interface IAccordionProps {
  collapsed: boolean;
  header: ReactNode;
  body: ReactNode;
  className?: string;
  onToggle?: (data: boolean) => void;
}

export default function Accordion({
  collapsed: isCollapsed,
  header,
  body,
  className,
  onToggle = () => {},
}: IAccordionProps) {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  return (
    <div
      className={`rounded border border-grey-300 bg-white
        p-2 pb-3 ${className} hover:border-grey-800`}
    >
      <div className="">
        <div
          tabIndex={0}
          role="button"
          className="font-primaryfont text-body-btn flex w-full
            cursor-pointer items-center justify-between gap-3 "
          onClick={() => {
            setCollapsed(!collapsed);
            onToggle(collapsed);
          }}
        >
          {header}
          <span className="flex h-6 w-6">
            <button
              type="button"
              title={collapsed ? 'Expand' : 'Collapse'}
              className={`h-6 w-6 rounded-full  ${
                !collapsed
                  ? 'bg-secondary-50 text-secondary-400'
                  : 'hover:bg-grey-100'
              }`}
              onClick={() => {
                setCollapsed(!collapsed);
                onToggle(collapsed);
              }}
            >
              <i className="material-icons text-icon-md">
                {collapsed ? 'expand_more' : 'expand_less'}
              </i>
            </button>
          </span>
        </div>
      </div>
      <div className={`${collapsed ? 'hidden' : ''}`}>{body}</div>
    </div>
  );
}
