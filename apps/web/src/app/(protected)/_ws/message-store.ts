import { create } from "zustand";

export interface StreamingMessage {
  id: string;
  content: string;
  isComplete: boolean;
  timestamp: number;
}

export interface MessageStore {
  activeStreams: Record<string, StreamingMessage>; // Indexed by chatId
  updateStream: (chatId: string, content: string, isComplete?: boolean) => void;
  startStream: (chatId: string, messageId: string) => void;
  endStream: (chatId: string) => void;
  getActiveStream: (chatId: string) => StreamingMessage | null;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  activeStreams: {},

  startStream: (chatId, messageId) =>
    set((state) => ({
      activeStreams: {
        ...state.activeStreams,
        [chatId]: {
          id: messageId,
          chatId,
          content: "",
          isComplete: false,
          timestamp: Date.now()
        }
      }
    })),

  updateStream: (chatId, content, isComplete = false) =>
    set((state) => {
      const currentStream = state.activeStreams[chatId];
      if (!currentStream) return state;

      return {
        activeStreams: {
          ...state.activeStreams,
          [chatId]: {
            ...currentStream,
            content: isComplete ? content : currentStream.content + content,
            isComplete
          }
        }
      };
    }),

  endStream: (chatId) =>
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [chatId]: removed, ...remaining } = state.activeStreams;
      return { activeStreams: remaining };
    }),

  getActiveStream: (chatId) => get().activeStreams[chatId] || null
}));
