import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import Icon from '../common/Icon';

interface ToolTipProps {
  name: string;
  message: string;
  className?: string;
  messageStyle?: string;
  iconClick?: () => void;
}

export default function ToolTip({
  name,
  message,
  iconClick,
  className,
  messageStyle,
}: ToolTipProps) {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Icon
              onClick={iconClick}
              name={name}
              className={`hover:text-primary-400 text-grey-500 hover:animate-pulse ${className}`}
            />
          </TooltipTrigger>
          <TooltipContent sideOffset={5}>
            <div
              className={`message rounded-sm bg-black px-3 py-1 text-xs text-white ${messageStyle}`}
            >
              {message}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
