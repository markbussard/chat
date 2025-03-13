import { use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { StickToBottom } from "use-stick-to-bottom";
import { v4 as uuidv4 } from "uuid";

import { MessageSender } from "@repo/db";

import { useMessageStore, useWebSocket } from "~/app/(protected)/_ws";
import {
  ChatConversation,
  ChatConversationMessage,
  ChatFocusMode
} from "~/types/chat";
import { MessageInput } from "../message-input";
import { ChatHeader } from "./header";
import { Messages } from "./messages";
import { ScrollToBottom } from "./scroll-to-bottom";

interface ChatProps {
  chat: ChatConversation;
}

export const Chat = (props: ChatProps) => {
  const { chat } = props;

  const [chatHistory, setChatHistory] = useState<[MessageSender, string][]>(
    chat.messages.map((message) => [message.sender, message.text])
  );
  const [messages, setMessages] = useState<ChatConversationMessage[]>(
    chat.messages
  );

  const ws = useWebSocket();

  const { getActiveStream, endStream } = useMessageStore();

  const streamingMessage = getActiveStream(chat.id);

  useEffect(() => {
    if (streamingMessage && streamingMessage.isComplete) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          messageId: streamingMessage.messageId as string,
          text: streamingMessage.content,
          sender: "ASSISTANT",
          updatedAt: new Date()
        }
      ]);
      setChatHistory((prev) => [
        ...prev,
        [MessageSender.ASSISTANT, streamingMessage.content]
      ]);
      endStream(chat.id);
    }
  }, [streamingMessage, chat.id, endStream]);

  const handleSendMessage = async (message: string, messageId?: string) => {
    if (streamingMessage) {
      return;
    }

    if (!ws || !ws.isReady) {
      toast.error("Cannot send message while disconnected");
      return;
    }

    messageId = messageId ?? uuidv4();

    try {
      ws.sendMessage({
        chatId: chat.id,
        message,
        messageId,
        history: [...chatHistory, [MessageSender.USER, message]]
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          messageId,
          text: message,
          sender: "USER",
          updatedAt: new Date()
        }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleRegenerateMessage = (messageId: string) => {
    const index = messages.findIndex((msg) => msg.messageId === messageId);
    const message = messages[index - 1];
    if (index === -1 || !message) {
      return;
    }

    setMessages((prev) => {
      return [...prev.slice(0, messages.length > 2 ? index - 1 : 0)];
    });
    setChatHistory((prev) => {
      return [...prev.slice(0, messages.length > 2 ? index - 1 : 0)];
    });

    handleSendMessage(message.text, messageId);
  };

  const memoizedMessages = useMemo(() => {
    return messages;
  }, [messages]);

  return (
    <>
      <div>
        <ChatHeader id={chat.id} name={chat.name} />
      </div>
      <StickToBottom
        className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden pl-3"
        resize="smooth"
        initial="instant"
      >
        <Messages
          messages={memoizedMessages}
          onRegenerateMessage={handleRegenerateMessage}
          streamingMessage={streamingMessage}
        />
        <ScrollToBottom />
        <div className="sticky bottom-0 z-20 flex w-full bg-background pr-3">
          <div className="mx-6 mb-4 flex w-full items-center justify-center">
            <MessageInput
              isChatPage
              sendMessage={handleSendMessage}
              focusMode={ChatFocusMode.WEB_SEARCH}
              onFocusModeChange={() => {}}
            />
          </div>
        </div>
      </StickToBottom>
    </>
  );
};
