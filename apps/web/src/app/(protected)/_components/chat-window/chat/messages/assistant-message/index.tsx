import { ChatConversationMessage } from "~/types/chat";

interface AssistantMessageProps {
  message: ChatConversationMessage;
  isLastMessage: boolean;
  onRegenerateMessage: (messageId: string) => void;
}

export const AssistantMessage = (props: AssistantMessageProps) => {
  const { message, isLastMessage, onRegenerateMessage } = props;

  return (
    <article className="flex flex-col gap-2 py-4">
      <div className="mb-2 flex items-center gap-4">
        <div className="w-fit">{message.text}</div>
      </div>
    </article>
  );
};
