import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createChat } from "~/app/actions/chat";
import { ChatFocusMode } from "~/types/chat";
import { MessageInput } from "../message-input";
import { Suggestions } from "./suggestions";

export const DashboardView = () => {
  const router = useRouter();

  const [chatFocusMode, setChatFocusMode] = useState<ChatFocusMode>(
    ChatFocusMode.WEB_SEARCH
  );

  const handleChatFocusModeChange = (mode: ChatFocusMode) => {
    setChatFocusMode(mode);
  };

  const handleCreateNewChat = async (message: string) => {
    try {
      const res = await createChat(message);
      if (!res.success) {
        throw new Error("Error");
      }

      router.push(`/chat/${res.chatId}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error("Failed to create new chat");
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center gap-6 pt-20 pb-20">
      <h1 className="text-3xl font-semibold">How can I help you?</h1>
      <MessageInput
        sendMessage={handleCreateNewChat}
        focusMode={chatFocusMode}
        onFocusModeChange={handleChatFocusModeChange}
      />
      <Suggestions />
    </div>
  );
};
