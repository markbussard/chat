import { StickToBottom } from "use-stick-to-bottom";

import { Message } from "@repo/db";

import { ChatConversationMessage } from "~/types/chat";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

interface MessagesProps {
  messages: ChatConversationMessage[];
  onRegenerateMessage: (messageId: string) => void;
}

export const Messages = (props: MessagesProps) => {
  const { messages, onRegenerateMessage } = props;

  return (
    <div className="relative flex h-full">
      <StickToBottom.Content className="flex w-full justify-center px-4 pb-8">
        <div className="w-full max-w-[1000px]">
          <div>
            {messages.map((message, index) => {
              return message.sender === "USER" ? (
                <UserMessage key={message.id} text={message.text} />
              ) : (
                <AssistantMessage
                  key={message.id}
                  message={message}
                  isLastMessage={index === messages.length - 1}
                  onRegenerateMessage={onRegenerateMessage}
                />
              );
            })}
          </div>
        </div>
      </StickToBottom.Content>
    </div>
  );
};
