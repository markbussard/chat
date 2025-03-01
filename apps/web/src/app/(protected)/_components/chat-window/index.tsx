"use client";

import { ChatConversation } from "~/types/chat";
import { Chat } from "./chat";
import { DashboardView } from "./dashboard-view";

interface ChatWindowProps {
  chat?: ChatConversation;
  userName: string | null;
}

export const ChatWindow = (props: ChatWindowProps) => {
  const { chat } = props;

  if (!chat) {
    return <DashboardView />;
  }

  return <Chat chat={chat} />;
};
