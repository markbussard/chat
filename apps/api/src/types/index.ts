export interface Message {
  chatId: string;
  messageId?: string;
  content: string;
}

export interface WebSocketMessage {
  message: Message;
  history: Array<[string, string]>;
}

export interface OpenSignalMessage {
  type: "signal";
  data: {
    message: "open";
  };
}

export interface ContentMessage {
  type: "content";
  data: {
    chatId: string;
    messageId: string;
    content: string;
  };
}

export interface EndMessage {
  type: "end";
  data: {
    chatId: string;
    messageId: string;
    content: string;
  };
}

export interface ErrorMessage {
  type: "error";
  data: {
    chatId: string;
    error: string;
  };
}

export enum ErrorMessageCode {
  INVALID_MESSAGE = "INVALID_MESSAGE",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
  NOT_AUTHORIZED = "NOT_AUTHORIZED",
  INACTIVE_SUBSCRIPTION = "INACTIVE_SUBSCRIPTION",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR"
}

export type ServerMessage =
  | OpenSignalMessage
  | ContentMessage
  | EndMessage
  | ErrorMessage;
