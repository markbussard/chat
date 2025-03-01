"use server";

import { revalidatePath } from "next/cache";
import { permanentRedirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@repo/db";

import { verifyUser } from "~/lib/dal";

export async function createChat(message: string) {
  const user = await verifyUser();

  try {
    const chat = await prisma.chat.create({
      data: {
        name: "New Chat",
        user: {
          connect: {
            id: user.id
          }
        },
        messages: {
          create: {
            text: message,
            sender: "USER"
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
      success: false
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

export async function updateChatName(formData: FormData) {
  const user = await verifyUser();

  const validatedFields = updateChatNameSchema.safeParse(formData);

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

  permanentRedirect(`/`);
}

export async function sendNewChatMessage(chatId: string, message: string) {
  await verifyUser();

  try {
    await prisma.message.create({
      data: {
        text: message,
        sender: "USER",
        chat: {
          connect: {
            id: chatId
          }
        }
      }
    });
    return {
      success: true
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false
    };
  }
}
