/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
interface IMaterialIconProps {
  name: string;
  className?: string;
  iconSize?: string;
  onClick?: () => void;
  outlined?: boolean;
}

const largeIconSize = 'h-11 w-11 rounded-lg';
const smallIconSize = 'h-9 w-9 rounded-lg';
const tinyIconSize = 'h-6 w-6 rounded-lg';

function getClassName(size: string): string {
  switch (size) {
    case 'lg':
      return largeIconSize;
    case 'sm':
      return smallIconSize;
    case 'tiny':
      return tinyIconSize;
    default:
      return largeIconSize;
  }
}

const MaterialIcon = ({
  name,
  className,
  iconSize = 'lg',
  onClick,
  outlined = false,
}: IMaterialIconProps) => {
  return (
    <div
      className={`hover:bg-secondary-50 flex cursor-pointer items-center justify-center ${getClassName(
        iconSize,
      )}
        ${outlined ? 'border border-grey-300' : ''}
        `}
      onClick={onClick}
    >
      <span className={`material-icons ${className} text-[24px] text-white`}>
        {name}
      </span>
    </div>
  );
};

export default MaterialIcon;
