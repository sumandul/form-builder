import Icon from '@Components/common/Icon';
import React from 'react';

type InfoDialogProps = {
  status?: string;
  children?: React.ReactNode;
};

const getStatus = (status: string | undefined) => {
  switch (status) {
    case 'info':
      return { icon: 'info', bgColor: 'bg-primary-400' };
    case 'success':
      return { icon: 'check_circle', bgColor: 'bg-green-700' };
    case 'error':
      return { icon: 'cancel', bgColor: 'bg-red-600' };
    default:
      return { icon: 'info', bgColor: 'bg-primary-400' };
  }
};

const InfoDialog: React.FC<InfoDialogProps> = ({ status, children }) => {
  const infoStatus = getStatus(status);

  return (
    <div
      className={`${infoStatus.bgColor} mb-10 flex w-full items-center
      gap-2 rounded-md p-3 opacity-40`}
    >
      <Icon name={infoStatus.icon} className="text-grey-200" />
      <span className="text-base text-grey-200">{children}</span>
    </div>
  );
};

export default InfoDialog;
