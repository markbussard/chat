import {
  ContentMessage,
  EndMessage,
  ErrorMessage,
  ErrorMessageCode,
  OpenSignalMessage,
  WebSocketMessage
} from "~/types";

export function createOpenSignalMessage() {
  const message = {
    type: "signal",
    data: {
      message: "open"
    }
  } satisfies OpenSignalMessage;
  return JSON.stringify(message);
}

export function createContentMessage(
  chatId: string,
  messageId: string,
  content: string
) {
  const message = {
    type: "content",
    data: {
      chatId,
      messageId,
      content
    }
  } satisfies ContentMessage;
  return JSON.stringify(message);
}

export function createEndMessage(chatId: string, messageId: string) {
  const message = {
    type: "end",
    data: {
      chatId,
      messageId
    }
  } satisfies EndMessage;
  return JSON.stringify(message);
}

export function createErrorMessage(code: ErrorMessageCode, message: string) {
  const errorMessage = {
    type: "error",
    data: {
      code,
      message
    }
  } satisfies ErrorMessage;
  return JSON.stringify(errorMessage);
}

export function safeParseMessageJSON(message: string) {
  try {
    return JSON.parse(message);
  } catch (e) {
    return null;
  }
}
