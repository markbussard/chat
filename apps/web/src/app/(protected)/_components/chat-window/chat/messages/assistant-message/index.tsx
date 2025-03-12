import { memo } from "react";

import { ChatConversationMessage } from "~/types/chat";
import { MarkdownRenderer, MessageLayout } from "../common";
import { AssistantMessageActions } from "./actions";

interface AssistantMessageProps {
  message: ChatConversationMessage;
  isLastMessage: boolean;
  onRegenerateMessage: (messageId: string) => void;
}

export const AssistantMessage = memo((props: AssistantMessageProps) => {
  const { message, isLastMessage, onRegenerateMessage } = props;

  return (
    <MessageLayout sender="ASSISTANT">
      <MarkdownRenderer message={message.text} />
      <AssistantMessageActions
        message={message}
        isLastMessage={isLastMessage}
        onRegenerateMessage={onRegenerateMessage}
      />
    </MessageLayout>
  );
});

AssistantMessage.displayName = "AssistantMessage";
