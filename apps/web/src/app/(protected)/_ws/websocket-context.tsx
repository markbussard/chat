"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { toast } from "sonner";

import { safeParseJson } from "~/lib/utils";
import { ChatConversationHistoryMessage } from "~/types/chat";
import { useMessageStore } from "./message-store";
import { WebSocketMessageSchema } from "./schema";

interface SendMessageParams {
  chatId: string;
  message: string;
  messageId: string;
  history: ChatConversationHistoryMessage[];
}

interface WebSocketContextValue {
  isReady: boolean;
  isError: boolean;
  sendMessage: (params: SendMessageParams) => void;
  retryConnection: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

const MAX_RETRY_COUNT = 3;
const INITIAL_BACKOFF = 1000;

const getBackoffDelay = (retryCount: number) => {
  return Math.min(INITIAL_BACKOFF * Math.pow(2, retryCount), 10000);
};

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>(null);
  const retryCountRef = useRef(0);
  const isCleaningUpRef = useRef(false);
  const connectionEstablishedRef = useRef(false);

  const connectWsRef = useRef<() => void>(null);
  const attemptReconnectRef = useRef<() => void>(null);

  const [isReady, setIsReady] = useState(false);
  const [isError, setIsError] = useState(false);

  const setStream = useMessageStore((state) => state.setStream);
  const endStream = useMessageStore((state) => state.endStream);

  useEffect(() => {
    function connectWs() {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
      wsRef.current = ws;

      const timeoutId = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          setIsError(true);
        }
      }, 10000);

      ws.addEventListener("message", (event: MessageEvent<string>) => {
        const parsedWsMessage = WebSocketMessageSchema.safeParse(
          safeParseJson(event.data)
        );

        if (!parsedWsMessage.success) {
          console.error("Invalid WebSocket message:", parsedWsMessage.error);
          return;
        }

        const wsMessage = parsedWsMessage.data;

        if (wsMessage.type === "signal" && wsMessage.data.message === "open") {
          const interval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              setIsReady(true);
              setIsError(false);
              if (retryCountRef.current > 0) {
                toast.success("Connection restored");
              } else {
                toast("Web Socket connection established");
              }
              retryCountRef.current = 0;
              clearInterval(interval);
            }
          }, 5);
          clearTimeout(timeoutId);
          console.debug(new Date(), "ws:connected");
        } else {
          const { type, data } = wsMessage;
          switch (type) {
            case "content":
              setStream({
                chatId: data.chatId,
                content: data.content
              });
              break;
            case "end":
              setStream({
                chatId: data.chatId,
                content: data.content,
                assistantMessageId: data.messageId,
                isComplete: true
              });
              break;
            case "error":
              toast.error(data.error);
              endStream(data.chatId);
              break;
            default:
              console.error("Unknown message type:", type);
              break;
          }
        }
      });

      ws.onerror = () => {
        clearTimeout(timeoutId);
        setIsReady(false);
        if (!connectionEstablishedRef.current) {
          toast.dismiss();
          toast.error("Failed to establish connection to the server");
        }
      };

      ws.onclose = () => {
        clearTimeout(timeoutId);
        setIsReady(false);
        console.debug(new Date(), "ws:disconnected");
        attemptReconnect();
        if (!isCleaningUpRef.current && connectionEstablishedRef.current) {
          toast.error("Connection lost. Attempting to reconnect...");
          connectionEstablishedRef.current = false;
        }
      };
    }

    function attemptReconnect() {
      retryCountRef.current += 1;

      if (retryCountRef.current > 3) {
        console.debug(new Date(), "ws:max_retries_reached");
        setIsError(true);
        return;
      }

      const backOffDelay = getBackoffDelay(retryCountRef.current);
      console.debug(
        new Date(),
        `ws:retry_attempt=${retryCountRef.current}/${MAX_RETRY_COUNT} delay=${backOffDelay}`
      );

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      reconnectTimeoutRef.current = setTimeout(() => {
        connectWs();
      }, backOffDelay);
    }

    connectWsRef.current = connectWs;
    attemptReconnectRef.current = attemptReconnect;

    connectWs();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        isCleaningUpRef.current = true;
        console.debug(new Date(), "ws:cleanup");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isError) {
      toast("Failed to connect to the server", {
        duration: Infinity,
        action: {
          label: "Retry",
          onClick: () => {
            if (!connectWsRef.current) {
              return;
            }
            toast.dismiss();
            retryCountRef.current = 0;
            setIsError(false);
            connectWsRef.current();
          }
        }
      });
    }
  }, [isError]);

  const sendMessage = useCallback((params: SendMessageParams) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify(params);
      wsRef.current.send(message);
    }
  }, []);

  const retryConnection = useCallback(() => {
    if (!connectWsRef.current) {
      return;
    }

    retryCountRef.current = 0;
    setIsError(false);
    connectWsRef.current();
  }, []);

  const contextValue = useMemo(() => {
    return {
      isReady,
      isError,
      sendMessage,
      retryConnection
    };
  }, [isReady, isError, sendMessage, retryConnection]);

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
