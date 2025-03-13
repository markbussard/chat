import { create } from "zustand";

export interface StreamingMessage {
  messageId?: string;
  content: string;
  isComplete: boolean;
  timestamp: number;
}

export interface MessageStore {
  activeStreams: Record<string, StreamingMessage>;
  updateStream: (
    chatId: string,
    content: string,
    assistantMessageId?: string,
    isComplete?: boolean
  ) => void;
  startStream: (chatId: string, content: string) => void;
  endStream: (chatId: string) => void;
  getActiveStream: (chatId: string) => StreamingMessage | null;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  activeStreams: {},

  startStream: (chatId, content) =>
    set((state) => ({
      activeStreams: {
        ...state.activeStreams,
        [chatId]: {
          content,
          isComplete: false,
          timestamp: Date.now()
        }
      }
    })),

  updateStream: (chatId, content, assistantMessageId, isComplete = false) =>
    set((state) => {
      const currentStream = state.activeStreams[chatId];

      if (!currentStream) {
        return {
          activeStreams: {
            ...state.activeStreams,
            [chatId]: {
              content,
              isComplete,
              timestamp: Date.now()
            }
          }
        };
      }

      return {
        activeStreams: {
          ...state.activeStreams,
          [chatId]: {
            ...currentStream,
            messageId: assistantMessageId,
            content: isComplete ? content : currentStream.content + content,
            isComplete
          }
        }
      };
    }),

  endStream: (chatId) =>
    set((state) => {
      const { [chatId]: removed, ...remaining } = state.activeStreams;
      return { activeStreams: remaining };
    }),

  getActiveStream: (chatId) => get().activeStreams[chatId] || null
}));
