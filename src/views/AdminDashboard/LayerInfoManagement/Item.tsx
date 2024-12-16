/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Icon from '@Components/common/Icon';
import { useState } from 'react';

interface IItemProps {
  label: string;
  id: any;
  checked: boolean;
  onClick?: () => void;
}

export default function Item({ onClick, label, id, checked }: IItemProps) {
  return (
    <span
      className={`flex cursor-pointer items-center justify-between p-3 hover:bg-blue-50 ${
        checked ? 'bg-blue-50' : ''
      }`}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <p>{label}</p>
      {checked && (
        <Icon
          className="flex h-5 w-5 items-center justify-center text-blue-500"
          name="check"
        />
      )}
    </span>
  );
}
