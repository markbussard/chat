import EventEmitter from "events";
import { WebSocket } from "ws";

import { Prisma, prisma } from "@repo/db";

import { createOpenAIStream } from "~/lib/openai";
import { ErrorMessageCode } from "~/types";
import {
  createContentMessage,
  createEndMessage,
  createErrorMessage,
  safeParseMessageJSON
} from "~/utils/messages";
import { validateMessage } from "~/utils/validate-message";

function handleEmitterEvents(
  emitter: EventEmitter,
  ws: WebSocket,
  messageId: string,
  chatId: string
) {
  let receivedMessage = "";

  emitter.on("data", (data) => {
    const parsedData = safeParseMessageJSON(data);
    if (parsedData.content) {
      receivedMessage += parsedData.content;
      const contentMessage = createContentMessage(
        chatId,
        messageId,
        parsedData.content
      );
      ws.send(contentMessage);
    }
  });

  emitter.on("end", () => {
    const endMessage = createEndMessage(chatId, messageId);
    ws.send(endMessage);
    prisma.message.upsert({
      create: {
        text: receivedMessage,
        chat: {
          connect: {
            id: chatId
          }
        },
        id: messageId,
        sender: "ASSISTANT"
      },
      update: {
        text: receivedMessage
      },
      where: {
        id: messageId
      }
    });
  });

  emitter.on("error", (error) => {
    console.error("Error:", error);
    const errorMessage = createErrorMessage(
      ErrorMessageCode.UNEXPECTED_ERROR,
      "An unexpected error occurred."
    );
    ws.send(errorMessage);
  });
}

export async function handleMessage(message: string, ws: WebSocket) {
  const validatedMessage = validateMessage(message);

  if (!validatedMessage) {
    return ws.send(
      createErrorMessage(
        ErrorMessageCode.INVALID_MESSAGE,
        "Message contains invalid JSON"
      )
    );
  }

  if (!validatedMessage.success) {
    return ws.send(
      createErrorMessage(
        ErrorMessageCode.INVALID_MESSAGE,
        "Invalid message format."
      )
    );
  }

  const messageData = validatedMessage.data.message;

  let assistantMessageId = messageData.messageId;

  try {
    const eventEmitter = await createOpenAIStream(messageData.content);

    handleEmitterEvents(
      eventEmitter,
      ws,
      messageData.messageId ?? "",
      messageData.chatId
    );
  } catch (e) {
    console.error(e);
  }
}
