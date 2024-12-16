interface IIconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  className?: string;
  onClick?: () => void;
}

export default function Icon({
  name,
  className,
  onClick,
}: IIconProps): JSX.Element {
  return (
    <span
      className=""
      role="button"
      tabIndex={0}
      onKeyUp={() => {}}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <i
        className={`material-symbols-outlined text-icon-sm lg:text-icon-md ${className}`}
      >
        {name}
      </i>
    </span>
  );
}
