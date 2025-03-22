import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";

import { prisma } from "@repo/db";

import { createOpenAIStream } from "~/lib/openai";
import { ErrorMessageCode } from "~/types";
import {
  createContentMessage,
  createEndMessage,
  createErrorMessage
} from "~/utils/messages";
import { validateMessage } from "~/utils/validate-message";

function handleEmitterEvents(
  emitter: EventEmitter,
  ws: WebSocket,
  assistantMessageId: string,
  chatId: string
) {
  let receivedMessage = "";
  emitter.on("data", (data) => {
    if (data.content) {
      receivedMessage += data.content;
      const contentMessage = createContentMessage(
        chatId,
        assistantMessageId,
        data.content
      );
      ws.send(contentMessage);
    }
  });

  emitter.on("end", async () => {
    const endMessage = createEndMessage(
      chatId,
      assistantMessageId,
      receivedMessage
    );
    ws.send(endMessage);
    await prisma.message.create({
      data: {
        messageId: assistantMessageId,
        text: receivedMessage,
        chat: {
          connect: {
            id: chatId
          }
        },
        sender: "ASSISTANT"
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
  const parsedMessage = validatedMessage.data;

  const humanMessageId = parsedMessage.messageId;
  const assistantMessageId = uuidv4();

  try {
    const eventEmitter = await createOpenAIStream(
      parsedMessage.message,
      parsedMessage.history
    );

    handleEmitterEvents(
      eventEmitter,
      ws,
      assistantMessageId,
      parsedMessage.chatId
    );

    const messageExists = await prisma.message.findFirst({
      where: {
        id: humanMessageId,
        chat: {
          id: parsedMessage.chatId
        }
      }
    });

    if (!messageExists) {
      await prisma.message.create({
        data: {
          messageId: humanMessageId,
          text: parsedMessage.message,
          chat: {
            connect: {
              id: parsedMessage.chatId
            }
          },
          sender: "USER"
        }
      });
    } else {
      // delete all messages after this message
      await prisma.message.deleteMany({
        where: {
          chat: {
            id: parsedMessage.chatId
          },
          id: {
            gt: humanMessageId
          }
        }
      });
    }
  } catch (e) {
    console.error(e);
    return ws.send(
      createErrorMessage(
        ErrorMessageCode.UNEXPECTED_ERROR,
        "An unexpected error occurred."
      )
    );
  }
}
