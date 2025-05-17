"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { StickToBottom } from "use-stick-to-bottom";
import { v4 as uuidv4 } from "uuid";
import { useShallow } from "zustand/react/shallow";

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

  const [messages, setMessages] = useState<ChatConversationMessage[]>(
    chat.messages
  );

  const ws = useWebSocket();

  const { streamingMessage, endStream } = useMessageStore(
    useShallow((state) => ({
      streamingMessage: state.activeStreams[chat.id],
      endStream: state.endStream
    }))
  );

  useEffect(() => {
    if (streamingMessage && streamingMessage.isComplete) {
      console.log("streamingMessage", streamingMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          messageId: streamingMessage.messageId as string,
          text: streamingMessage.content,
          sender: "ASSISTANT",
          updatedAt: new Date()
        }
      ]);
      endStream(chat.id);
    }
  }, [streamingMessage, chat.id, endStream]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!ws || !ws.isReady) {
        toast.error("Cannot send message while disconnected");
        return;
      }

      const history = [
        ...messages.map((message) => [message.sender, message.text]),
        [MessageSender.USER, message]
      ] as [MessageSender, string][];

      const messageId = uuidv4();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          messageId,
          text: message,
          sender: "USER",
          updatedAt: new Date()
        }
      ]);

      try {
        ws.sendMessage({
          chatId: chat.id,
          message,
          messageId,
          history
        });
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
      }
    },
    [ws, chat.id, messages]
  );

  const handleRegenerateMessage = useCallback(
    (messageId: string) => {
      if (!ws || !ws.isReady) {
        toast.error("Cannot regenerate message while disconnected");
        return;
      }

      const index = messages.findIndex((msg) => msg.messageId === messageId);
      const message = messages[index - 1];
      if (index === -1 || !message) {
        return;
      }

      const history = [
        ...messages
          .map((message) => [message.sender, message.text])
          .slice(0, index - 1),
        [MessageSender.USER, message.text]
      ] as [MessageSender, string][];

      setMessages((prev) => {
        return [...prev.slice(0, index - 1)];
      });

      ws.sendMessage({
        chatId: chat.id,
        message: message.text,
        messageId,
        history: [...history, [MessageSender.USER, message.text]]
      });
    },
    [chat.id, messages, ws]
  );

  return (
    <>
      <div>
        <ChatHeader id={chat.id} name={chat.name} />
      </div>
      <StickToBottom
        className="relative flex w-full flex-1 flex-col items-center justify-center overflow-x-hidden pl-3"
        resize="smooth"
        initial="instant"
      >
        <Messages
          messages={messages}
          streamingMessage={streamingMessage}
          onRegenerateMessage={handleRegenerateMessage}
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
