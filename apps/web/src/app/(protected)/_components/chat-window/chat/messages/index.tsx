import { useMemo } from "react";
import { StickToBottom } from "use-stick-to-bottom";

import { StreamingMessage } from "~/app/(protected)/_ws";
import { ChatConversationMessage } from "~/types/chat";
import { AssistantMessage } from "./assistant-message";
import { StreamingMessage as StreamingMessageComponent } from "./streaming-message";
import { UserMessage } from "./user-message";

interface MessagesProps {
  messages: ChatConversationMessage[];
  streamingMessage: StreamingMessage | undefined;
  onRegenerateMessage: (messageId: string) => void;
}

export const Messages = (props: MessagesProps) => {
  const { messages, streamingMessage, onRegenerateMessage } = props;

  const memoizedMessage = useMemo(() => {
    console.log("memoizing messages", messages);
    return messages;
  }, [messages]);

  return (
    <StickToBottom.Content className="mb-4 flex w-full flex-1 items-center justify-center px-4">
      <div className="flex w-full max-w-3xl flex-col">
        {memoizedMessage.map((message, index) => {
          return message.sender === "USER" ? (
            <UserMessage key={message.messageId} message={message} />
          ) : (
            <AssistantMessage
              key={message.messageId}
              message={message}
              onRegenerateMessage={onRegenerateMessage}
              isLastMessage={index === messages.length - 1}
            />
          );
        })}
        {streamingMessage && (
          <StreamingMessageComponent message={streamingMessage} />
        )}
      </div>
    </StickToBottom.Content>
  );
};
