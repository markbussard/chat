import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Paperclip } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider
} from "~/components/ui/tooltip";

export const AttachFiles = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Paperclip />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Attach text or PDF files</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
