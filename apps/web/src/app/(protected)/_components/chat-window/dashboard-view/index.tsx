"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { MessageSender } from "@repo/db";

import { useWebSocket } from "~/app/(protected)/_ws";
import { createChat } from "~/app/actions/chat";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { ChatConversationHistoryMessage, ChatFocusMode } from "~/types/chat";
import { MessageInput } from "../message-input";
import { Suggestions } from "./suggestions";

export const DashboardView = () => {
  const ws = useWebSocket();

  const router = useRouter();

  const [chatFocusMode, setChatFocusMode] = useState<ChatFocusMode>(
    ChatFocusMode.WEB_SEARCH
  );

  const handleChatFocusModeChange = (mode: ChatFocusMode) => {
    setChatFocusMode(mode);
  };

  const handleSendMessage = async (message: string) => {
    try {
      const res = await createChat();
      if (!res.success) {
        throw new Error(res.error);
      }

      const messageId = uuidv4();
      const history: ChatConversationHistoryMessage[] = [
        [MessageSender.USER, message]
      ];

      ws.sendMessage({
        chatId: res.chatId,
        message,
        messageId,
        history
      });

      router.push(`/chat/${res.chatId}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error("Failed to create new chat");
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-6 overflow-y-auto px-2 py-6">
      <div className="absolute top-[10px] left-2 z-1">
        <SidebarTrigger />
      </div>
      <h1 className="text-3xl font-semibold">How can I help you?</h1>
      <MessageInput
        sendMessage={handleSendMessage}
        focusMode={chatFocusMode}
        onFocusModeChange={handleChatFocusModeChange}
      />
      <Suggestions />
    </div>
  );
};
