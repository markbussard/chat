export interface WebSocketSignalMessage {
  type: "signal";
  data: {
    message: "open" | "close";
  };
}

export interface WebSocketStartMessage {
  type: "start";
  data: {
    chatId: string;
    messageId: string;
    content: string;
  };
}

export interface WebSocketContentMessage {
  type: "content";
  data: {
    chatId: string;
    content: string;
  };
}

export interface WebSocketEndMessage {
  type: "end";
  data: {
    chatId: string;
    messageId: string;
    content: string;
  };
}

export interface WebSocketErrorMessage {
  type: "error";
  data: {
    chatId: string;
    error: string;
  };
}

export type WebSocketMessage =
  | WebSocketSignalMessage
  | WebSocketStartMessage
  | WebSocketContentMessage
  | WebSocketEndMessage
  | WebSocketErrorMessage;
