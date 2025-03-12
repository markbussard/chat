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
    console.log("Received data:", data);
    if (data.content) {
      receivedMessage += data.content;
      const contentMessage = createContentMessage(
        chatId,
        messageId,
        data.content
      );
      ws.send(contentMessage);
    }
  });

  emitter.on("end", async () => {
    const endMessage = createEndMessage(
      chatId,
      "randomMessageId",
      receivedMessage
    );
    ws.send(endMessage);
    await prisma.message.upsert({
      create: {
        text: receivedMessage,
        chat: {
          connect: {
            id: chatId
          }
        },
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

  const messageData = validatedMessage.data;

  let assistantMessageId = messageData.messageId;
  console.log("assistantMessageId", assistantMessageId);
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
