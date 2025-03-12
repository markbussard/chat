import { StickToBottom } from "use-stick-to-bottom";

import { StreamingMessage } from "~/app/(protected)/_ws";
import { ChatConversationMessage } from "~/types/chat";
import { AssistantMessage } from "./assistant-message";
import { StreamingMessage as StreamingMessageComponent } from "./streaming-message";
import { UserMessage } from "./user-message";

interface MessagesProps {
  messages: ChatConversationMessage[];
  onRegenerateMessage: (messageId: string) => void;
  streamingMessage: StreamingMessage | null;
}

export const Messages = (props: MessagesProps) => {
  const { messages, onRegenerateMessage, streamingMessage } = props;

  return (
    <StickToBottom.Content className="mb-4 flex w-full flex-1 items-center justify-center px-4">
      <div className="flex w-full max-w-3xl flex-col">
        {messages.map((message, index) => {
          return message.sender === "USER" ? (
            <UserMessage key={message.messageId} message={message} />
          ) : (
            <AssistantMessage
              key={message.messageId}
              message={message}
              isLastMessage={index === messages.length - 1}
              onRegenerateMessage={onRegenerateMessage}
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
