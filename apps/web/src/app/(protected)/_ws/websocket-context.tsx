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

import { ChatConversationHistoryMessage } from "~/types/chat";
import { useMessageStore } from "./message-store";
import { WebSocketMessage } from "./types";

interface WebSocketContextValue {
  isReady: boolean;
  isError: boolean;
  sendMessage: ({
    chatId,
    message,
    messageId,
    history
  }: {
    chatId: string;
    message: string;
    messageId: string;
    history: ChatConversationHistoryMessage[];
  }) => void;
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

  const [isReady, setIsReady] = useState(false);
  const [isError, setIsError] = useState(false);

  const updateStream = useMessageStore((state) => state.updateStream);
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
        const wsMessage = JSON.parse(event.data) as WebSocketMessage;
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
              updateStream(data.chatId, data.content);
              break;
            case "end":
              updateStream(data.chatId, data.content, data.messageId, true);
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
        toast.error("Server connection error");
      };

      ws.onclose = () => {
        clearTimeout(timeoutId);
        setIsReady(false);
        console.debug(new Date(), "ws:disconnected");
        if (!isCleaningUpRef.current) {
          toast.error("Connection lost. Attempting to reconnect...");
          attemptReconnect();
        }
      };
    }

    const attemptReconnect = () => {
      retryCountRef.current += 1;

      if (retryCountRef.current > 3) {
        console.debug(new Date(), "ws:max_retries_reached");
        setIsError(true);
        toast.error("Unable to connect to server after multiple attempts.");
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
    };

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
  }, []);

  const sendMessage = useCallback(
    (payload: {
      chatId: string;
      message: string;
      messageId: string;
      history: ChatConversationHistoryMessage[];
    }) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const message = JSON.stringify(payload);
        wsRef.current.send(message);
      }
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      webSocket: wsRef.current,
      isReady,
      isError,
      sendMessage
    }),
    [isReady, isError, sendMessage]
  );

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
