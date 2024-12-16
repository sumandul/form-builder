import { FlexRow } from '@Components/common/Layouts';
import { useState } from 'react';
// import Icon from '@Components/common/Icon';
import AlertLogo from '@Assets/images/Alert.svg';
// import { setAlertVisibility } from '@Store/actions/mapActions';
// import { useTypedDispatch } from '@Store/hooks';

interface IAlertProps {
  // id: number;
  icon?: string;
  title: string;
  description: string;
  alertType: string;
  date: string;
}

export default function AlertCard({
  // id,
  icon,
  title,
  description,
  alertType,
  date,
}: IAlertProps) {
  // const dispatch = useTypedDispatch();
  const [hover, setHover] = useState<boolean>(false);

  function onAlertHover() {
    setHover(true);
  }

  function onAlertLeave() {
    setHover(false);
  }

  // Determine the border color based on alert type
  const getBorderColor = () => {
    if (alertType === 'critical') return 'border-[#D33A38]';
    if (alertType === 'warning') return 'border-[#f0e768]';
    return 'border-[#5fa7eb]';
  };

  // Determine the text class based on hover state
  const textClass = hover ? 'text-body-lg font-semibold' : 'text-button-md';

  // Determine the icon visibility class based on hover state
  // const iconVisibilityClass = hover ? 'visible' : 'invisible';

  // Determine the description visibility based on hover state
  const descriptionVisibilityClass = hover
    ? 'auto mt-4 max-h-[10rem]'
    : 'max-h-0';

  return (
    <div
      onMouseEnter={onAlertHover}
      onMouseLeave={onAlertLeave}
      className={`w-[17.5rem] rounded-lg border-[2px] ${getBorderColor()} bg-white px-3 py-[0.625rem] transition-all duration-300`}
    >
      <div className="flex justify-between">
        <FlexRow className="gap-2">
          <img src={icon || AlertLogo} alt="logo" className="w-[1.9rem]" />
          <span className={`${textClass} mt-1 font-primary`}>{title}</span>
        </FlexRow>
        {/* <Icon
          onClick={() => dispatch(setAlertVisibility(id))}
          name="close"
          className={`${iconVisibilityClass} mt-1 rounded-md text-[1.2rem] hover:bg-grey-200`}
        /> */}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${descriptionVisibilityClass}`}
      >
        <div className="text-body-sm font-primary">{description}</div>
        <div className="text-body-xs mt-2">{date}</div>
      </div>
    </div>
  );
}
