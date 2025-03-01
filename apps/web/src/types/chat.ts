import { Chat, Message } from "@repo/db";

export type ChatConversation = Pick<
  Chat,
  "id" | "name" | "createdAt" | "updatedAt"
> & { messages: ChatConversationMessage[] };

export type ChatConversationMessage = Pick<
  Message,
  "id" | "text" | "sender" | "updatedAt"
>;

export type RecentChatListItem = Pick<Chat, "id" | "name" | "updatedAt">;

export enum ChatFocusMode {
  WEB_SEARCH = "WEB_SEARCH",
  ACADEMIC_SEARCH = "ACADEMIC_SEARCH"
}
