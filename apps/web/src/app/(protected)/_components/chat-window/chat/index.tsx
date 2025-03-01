import { toast } from "sonner";
import { StickToBottom } from "use-stick-to-bottom";

import { sendNewChatMessage } from "~/app/actions/chat";
import { ChatConversation, ChatFocusMode } from "~/types/chat";
import { MessageInput } from "../message-input";
import { ChatHeader } from "./header";
import { Messages } from "./messages";

interface ChatProps {
  chat: ChatConversation;
}

export const Chat = (props: ChatProps) => {
  const { chat } = props;

  const handleSendMessage = async (message: string) => {
    try {
      const res = await sendNewChatMessage(chat.id, message);
      if (!res.success) {
        throw new Error("Error");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <>
      <div className="flex-1 overflow-auto">
        <ChatHeader id={chat.id} name={chat.name} />

        <StickToBottom
          resize="smooth"
          initial="instant"
          className="flex w-full flex-col"
        >
          <Messages
            messages={chat.messages}
            onRegenerateMessage={handleSendMessage}
          />
        </StickToBottom>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="mx-6 mb-6 flex w-full max-w-2xl">
          <MessageInput
            sendMessage={handleSendMessage}
            focusMode={ChatFocusMode.WEB_SEARCH}
            onFocusModeChange={() => {}}
          />
        </div>
      </div>
    </>
  );
};
