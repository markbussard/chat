import z from "zod";

import { MessageSender } from "@repo/db";

import { safeParseMessageJSON } from "./messages";

const WebSocketMessageSchema = z.object({
  chatId: z.string().cuid(),
  message: z.string().min(1).max(5000),
  messageId: z.string().uuid(),
  history: z.array(z.tuple([z.nativeEnum(MessageSender), z.string()]))
});

export function validateMessage(message: string) {
  const parsedMessage = safeParseMessageJSON(message);
  if (!parsedMessage) {
    return null;
  }

  return WebSocketMessageSchema.safeParse(parsedMessage);
}
