/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable camelcase */
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from '@radix-ui/react-tooltip';
import syrenIcon from '@Assets/images/syren.png';
import Icon from '@Components/common/Icon';
import { convertSnakeCaseToTitleCase } from '@Utils/index';
import { useState } from 'react';

type IThresholdValue =
  | number
  | {
      duration_in_hr: number;
      id: number;
      value: number;
      weather_alert: number;
    }[];

interface IThresholdCardProps {
  alert_icon: string;
  title: string;
  description: string;
  layer: string;
  weather_source: string;
  threshold_value: IThresholdValue; // Updated type
  onDeleteClick: () => void;
  onEditClick: () => void;
}

export default function ThresholdCard({
  alert_icon,
  title,
  description,
  layer,
  weather_source,
  threshold_value,
  onEditClick,
  onDeleteClick,
}: IThresholdCardProps) {
  const [expand, setExpnad] = useState(false);
  const renderThresholdValues = (values: IThresholdValue) => {
    if (!Array.isArray(values)) {
      // Handle single value
      return <span>{values}</span>;
    }
    // Handle array of values
    const valuesString = values.map(({ value }: any) => value).join(', ');
    return (
      <div className="pl-4">
        <div className="text-gray-800">
          <div className="flex flex-row">
            <div className="font-semibold">{valuesString}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex h-fit items-start justify-between gap-5 rounded-lg border-2 p-2"
      onMouseOver={() => setExpnad(true)}
      onMouseOut={() => setExpnad(false)}
    >
      <img
        alt="alert-icons"
        src={alert_icon || syrenIcon}
        className="h-14 w-14"
      />
      <div className="content flex w-[25%] flex-col gap-2 transition-all duration-1000">
        <h6 className="line-clamp-1 text-xs text-gray-600">{title}</h6>
        <p
          className={`line-clamp-${expand ? '0' : '1'} text-left text-gray-800`}
        >
          {description}
        </p>
      </div>
      <div className="inner-cover flex flex-1 gap-4">
        <div className="content flex w-[60%] flex-col gap-2 ">
          <h6 className="line-clamp-1 text-xs text-gray-600">Layers</h6>
          <p className="font-semibold text-gray-800">
            {convertSnakeCaseToTitleCase(weather_source || '') || layer}
          </p>
        </div>
        {/* <div className="content flex w-1/3 flex-col gap-2 ">
          <h6 className="line-clamp-1 text-xs text-gray-600">Statistics</h6>
          <p className="font-semibold text-gray-800">{statistics}</p>
        </div> */}
        <div className="content flex w-1/2 flex-col gap-2 ">
          <h6 className="line-clamp-1 text-xs text-gray-600">
            Threshold Value
          </h6>
          <p className="font-semibold text-gray-800">
            {renderThresholdValues(threshold_value)}
          </p>
        </div>
      </div>
      <div className="content flex h-full items-center justify-end gap-2">
        <Icon
          name="edit"
          className="text-gray-600"
          onClick={() => {
            if (onEditClick) onEditClick();
          }}
        />
        <Icon
          name="delete"
          className="text-others-rejected"
          onClick={() => {
            if (onDeleteClick) onDeleteClick();
          }}
        />
      </div>
    </div>
  );
}
