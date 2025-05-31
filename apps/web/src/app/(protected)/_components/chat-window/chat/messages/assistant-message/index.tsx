import { memo } from "react";

import { ChatConversationMessage } from "~/types/chat";
import { MarkdownText, MessageLayout } from "../common";
import { AssistantMessageActions } from "./actions";

interface AssistantMessageProps {
  message: ChatConversationMessage;
  isLastMessage: boolean;
  onRegenerateMessage: (messageId: string) => void;
}

export const AssistantMessage = memo((props: AssistantMessageProps) => {
  const { message, isLastMessage, onRegenerateMessage } = props;

  console.log("rendering assistant message", message);
  return (
    <MessageLayout sender="ASSISTANT">
      <MarkdownText>{message.text}</MarkdownText>
      <AssistantMessageActions
        message={message}
        isLastMessage={isLastMessage}
        onRegenerateMessage={onRegenerateMessage}
      />
    </MessageLayout>
  );
});

AssistantMessage.displayName = "AssistantMessage";
