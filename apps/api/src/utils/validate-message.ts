import z from "zod";

import { safeParseMessageJSON } from "./messages";

const WebSocketMessageSchema = z.object({
  chatId: z.string().cuid(),
  messageId: z.string().cuid().optional(),
  content: z.string().min(1).max(5000)
});

export function validateMessage(message: string) {
  const parsedMessage = safeParseMessageJSON(message);
  if (!parsedMessage) {
    return null;
  }

  return WebSocketMessageSchema.safeParse(parsedMessage);
}
