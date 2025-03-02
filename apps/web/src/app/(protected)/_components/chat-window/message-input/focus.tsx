import { ChevronDown, Globe, ListFilter, Newspaper } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { ChatFocusMode } from "~/types/chat";

interface FocusProps {
  focusMode: ChatFocusMode;
  onChange: (focusMode: ChatFocusMode) => void;
}

export const Focus = (props: FocusProps) => {
  const { focusMode, onChange } = props;

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-[-10px]">
                <ListFilter />
                Focus
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Set a focus for your sources</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="flex w-96 gap-2">
        <DropdownMenuItem
          className="flex w-1/2 cursor-pointer flex-col items-start"
          onClick={() => onChange(ChatFocusMode.WEB_SEARCH)}
        >
          <div
            className={cn("flex items-center gap-2", {
              "text-blue-400": focusMode === ChatFocusMode.WEB_SEARCH
            })}
          >
            <Globe />
            Web{" "}
          </div>

          <span className="text-muted-foreground">
            Search across the entire internet
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex w-1/2 cursor-pointer flex-col items-start"
          onClick={() => onChange(ChatFocusMode.ACADEMIC_SEARCH)}
        >
          <div
            className={cn("flex items-center gap-2", {
              "text-blue-400": focusMode === ChatFocusMode.ACADEMIC_SEARCH
            })}
          >
            <Newspaper />
            Academic{" "}
          </div>
          <span className="text-muted-foreground">
            Search for published academic papers
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
