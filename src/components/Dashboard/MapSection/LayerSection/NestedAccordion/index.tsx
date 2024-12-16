/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import { ReactNode, useState, useEffect } from 'react';
import LayerAccordion from './LayerAccordion';

interface INestedAccordionProps {
  collapsed: boolean;
  header: ReactNode;
  subcategory: Record<string, any>[];
  onToggle?: (data: boolean) => void;
}

export default function NestedAccordion({
  collapsed: isCollapsed,
  header,
  subcategory,
  onToggle = () => {},
}: INestedAccordionProps) {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);
  return (
    <div
      key={JSON.stringify(subcategory)}
      className={`rounded border border-grey-300 bg-white
        p-4 hover:border-grey-800`}
    >
      <div>
        <div
          tabIndex={0}
          role="button"
          className="flex w-full cursor-pointer
            items-center justify-between gap-4 font-primary "
          onClick={() => {
            setCollapsed(!collapsed);
            onToggle(collapsed);
          }}
        >
          <h6>{header}</h6>
          <span className="flex h-6 w-6">
            <button
              type="button"
              title={collapsed ? 'Expand' : 'Collapse'}
              className={`h-8 w-8 rounded-md border border-grey-300 ${
                !collapsed ? 'bg-secondary-50 text-secondary-400' : ''
              }`}
              onClick={() => {
                setCollapsed(!collapsed);
                onToggle(collapsed);
              }}
            >
              <i className="material-icons text-icon-md text-[1.9rem]">
                {collapsed ? 'expand_more' : 'expand_less'}
              </i>
            </button>
          </span>
        </div>
      </div>
      <div className={`${collapsed ? 'hidden' : 'mt-3'}`}>
        {subcategory?.map((layers: Record<string, any>) => {
          return (
            <div
              key={`${layers.id}-${JSON.stringify(layers.style)}`}
              className="my-3"
            >
              <LayerAccordion
                collapsed={false}
                header={layers.name_en}
                layers={layers.layers}
                tooltipmessage={layers.details}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
