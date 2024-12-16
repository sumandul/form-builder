import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteSelectedEmail } from '@Store/actions/emailChannel';
import Icon from '../Icon';

const Email = ({ name }: any) => {
  const dispatch = useDispatch();
  return (
    <div className="flex h-8 w-fit items-center justify-center gap-1 rounded-[40px] border border-[#D7D7D7] bg-[#F5F5F5] px-2 py-1">
      <div className="h-[1.25rem] w-[1.25rem] rounded-xl bg-[#757575]">{}</div>
      <div className="text-xs font-normal leading-4 text-[#484848]">{name}</div>

      <Icon
        onClick={() => {
          // selectedEmail(name);
          dispatch(deleteSelectedEmail(name));
        }}
        name="close"
        className="!text-lg font-normal leading-5"
      />
    </div>
  );
};

export default Email;
