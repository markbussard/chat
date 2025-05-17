import { z } from "zod";

const WebsocketSignalMessageSchema = z.object({
  type: z.literal("signal"),
  data: z.object({
    message: z.enum(["open", "close"])
  })
});

export interface WebSocketSignalMessage {
  type: "signal";
  data: {
    message: "open" | "close";
  };
}

export interface WebSocketContentMessage {
  type: "content";
  data: {
    chatId: string;
    content: string;
  };
}

const WebsocketContentMessageSchema = z.object({
  type: z.literal("content"),
  data: z.object({
    chatId: z.string(),
    content: z.string()
  })
});

export interface WebSocketEndMessage {
  type: "end";
  data: {
    chatId: string;
    messageId: string;
    content: string;
  };
}

const WebsocketEndMessageSchema = z.object({
  type: z.literal("end"),
  data: z.object({
    chatId: z.string(),
    messageId: z.string(),
    content: z.string()
  })
});

export interface WebSocketErrorMessage {
  type: "error";
  data: {
    chatId: string;
    error: string;
  };
}

const WebsocketErrorMessageSchema = z.object({
  type: z.literal("error"),
  data: z.object({
    chatId: z.string(),
    error: z.string()
  })
});

export const WebSocketMessageSchema = z.discriminatedUnion("type", [
  WebsocketSignalMessageSchema,
  WebsocketContentMessageSchema,
  WebsocketEndMessageSchema,
  WebsocketErrorMessageSchema
]);

export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;
