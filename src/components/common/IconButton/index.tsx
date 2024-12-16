interface IIconButtonProps {
  buttonText: string | number;
  name: string;
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}

export default function IconButton({
  buttonText,
  name,
  className,
  iconClassName,
  onClick,
}: IIconButtonProps) {
  return (
    <button
      type="button"
      className={`flex h-10 items-center
        justify-center ${className}`}
      onClick={onClick}
    >
      {buttonText}
      <i className={`material-icons-outlined ${iconClassName}`}>{name}</i>
    </button>
  );
}
