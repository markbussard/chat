import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip";

export type TooltipIconButtonProps = ButtonProps & {
  tooltip: string;
  side?: "top" | "bottom" | "left" | "right";
};

export const TooltipIconButton = (props: TooltipIconButtonProps) => {
  const { children, tooltip, side = "top", className, ...rest } = props;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            {...rest}
            className={cn("size-6 p-1", className)}
          >
            {children}
            <span className="sr-only">{tooltip}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
