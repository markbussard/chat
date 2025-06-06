"use server";

import { revalidatePath } from "next/cache";
import { permanentRedirect, redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@repo/db";

import { verifyUser } from "~/lib/dal";
import { UpdateChatNameDTO } from "~/schemas/chat";

type CreateChatResponse =
  | {
      success: true;
      chatId: string;
    }
  | {
      success: false;
      error: string;
    };

export async function createChat(): Promise<CreateChatResponse> {
  const user = await verifyUser();

  try {
    const chat = await prisma.chat.create({
      data: {
        name: "New Chat",
        user: {
          connect: {
            id: user.id
          }
        }
      },
      select: {
        id: true
      }
    });

    return {
      success: true,
      chatId: chat.id
    };
  } catch (error) {
    console.error("Error creating chat:", error);
    return {
      success: false,
      error: "Failed to create chat"
    };
  }
}

const updateChatNameSchema = z.object({
  chatId: z.string().cuid(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
});

export async function updateChatName(payload: UpdateChatNameDTO) {
  const user = await verifyUser();

  const validatedFields = updateChatNameSchema.safeParse(payload);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { data } = validatedFields;

  try {
    await prisma.chat.update({
      data: {
        name: data.name
      },
      where: {
        id: data.chatId,
        user: {
          id: user.id
        }
      }
    });
  } catch (error) {
    console.error("Error renaming chat", error);
    return {
      success: false,
      error: "Failed to rename chat"
    };
  }

  revalidatePath(`/chat/${data.chatId}`);
  return {
    success: true
  };
}

export async function deleteChat(chatId: string) {
  const user = await verifyUser();

  try {
    await prisma.chat.update({
      data: {
        deletedAt: new Date()
      },
      where: {
        id: chatId,
        user: {
          id: user.id
        }
      }
    });
  } catch (error) {
    console.error("Error deleting chat", error);
    return {
      success: false,
      error: "Failed to rename chat"
    };
  }

  redirect(`/`);
}
