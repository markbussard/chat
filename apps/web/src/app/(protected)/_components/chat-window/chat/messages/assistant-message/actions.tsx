import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~/components/ui/tooltip";
import { ChatConversationMessage } from "~/types/chat";

interface AssistantMessageActionsProps {
  message: ChatConversationMessage;
  isLastMessage: boolean;
  onRegenerateMessage: (messageId: string) => void;
}

export const AssistantMessageActions = (
  props: AssistantMessageActionsProps
) => {
  const { message, isLastMessage, onRegenerateMessage } = props;

  const [isCopySuccess, setIsCopySuccess] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setIsCopySuccess(true);

      setTimeout(() => {
        setIsCopySuccess(false);
      }, 3000);
    } catch {
      toast.error("Failed to copy message");
    }
  };

  const handleRegenerateClick = () => {
    onRegenerateMessage(message.messageId);
  };

  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="size-8"
              variant="ghost"
              onClick={handleCopyClick}
            >
              {isCopySuccess ? <Check /> : <Copy />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Copy</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isLastMessage && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="size-8"
                variant="ghost"
                onClick={handleRegenerateClick}
              >
                <RefreshCw />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Regenerate</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
