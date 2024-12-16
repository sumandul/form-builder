/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
export default function SectionTrigger({
  active,
  onClick,
  name,
  className,
  disabled = false,
}: {
  active: boolean;
  onClick: () => void;
  name: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div
      onClick={(e: any) => {
        if (disabled) return;
        e.stopPropagation();
        onClick();
      }}
      className={`"section-1 text-center" flex h-full min-w-[7rem] max-w-[8rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl lg:h-[4.25rem] lg:w-[9.5rem] lg:min-w-[9.5rem] ${
        active ? 'bg-blue-50' : 'bg-gray-100'
      }  px-2 py-2 ${className} ${
        disabled ? '!cursor-not-allowed opacity-90' : ''
      }`}
    >
      <div className="dot flex w-full items-center justify-end">
        <div className="circle h-4 w-4 rounded-full border-2 border-[#E2E8F0] p-[2px]">
          <div
            className={`bluepoint h-full w-full rounded-full ${
              active ? 'bg-blue-500' : null
            } `}
          />
        </div>
      </div>
      <div className="text">{name}</div>
    </div>
  );
}
