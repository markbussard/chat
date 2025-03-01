import "server-only";

import { notFound } from "next/navigation";

import { prisma } from "@repo/db";

import { ChatConversation, RecentChatListItem } from "~/types/chat";

export async function getChatById(
  id: string,
  userId: string
): Promise<ChatConversation> {
  const chat = await prisma.chat.findUnique({
    where: {
      id,
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      messages: {
        select: {
          id: true,
          text: true,
          sender: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });

  if (!chat) {
    notFound();
  }

  return chat;
}

export async function geRecentChatsByUserId(
  userId: string
): Promise<RecentChatListItem[]> {
  const chats = await prisma.chat.findMany({
    where: {
      user: {
        id: userId
      },
      deletedAt: null
    },
    orderBy: {
      updatedAt: "desc"
    },
    select: {
      id: true,
      name: true,
      updatedAt: true
    },
    take: 10
  });
  return chats;
}
