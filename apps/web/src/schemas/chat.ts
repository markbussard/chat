import { z } from "zod";

export const ChatNameSchema = z
  .string()
  .min(1, {
    message: "Name is required"
  })
  .max(255, {
    message: "Name must be less than 255 characters"
  });

export const UpdateChatNameSchema = z
  .object({
    name: ChatNameSchema,
    chatId: z.string().uuid({
      message: "Invalid chat ID"
    })
  })
  .strict();

export type UpdateChatNameDTO = z.infer<typeof UpdateChatNameSchema>;
