import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface StreamingMessage {
  messageId?: string | undefined;
  contentChunks: string[];
  content: string;
  isComplete: boolean;
  timestamp: number;
}

export interface SetStreamParams {
  chatId: string;
  content: string;
  assistantMessageId?: string;
  isComplete?: boolean;
}

export interface MessageState {
  activeStreams: Record<string, StreamingMessage>;
}

export interface MessageActions {
  setStream: (params: SetStreamParams) => void;
  startStream: (chatId: string, content: string) => void;
  endStream: (chatId: string) => void;
}

export type MessageStore = MessageState & MessageActions;

export const useMessageStore = create<MessageStore>()(
  immer((set) => ({
    activeStreams: {},

    startStream: (chatId, content) =>
      set((state) => {
        state.activeStreams[chatId] = {
          contentChunks: [content],
          get content() {
            return this.contentChunks.join("");
          },
          isComplete: false,
          timestamp: Date.now()
        };
      }),

    setStream: (params) =>
      set((state) => {
        const { chatId, content, assistantMessageId, isComplete } = params;

        if (!state.activeStreams[chatId]) {
          state.activeStreams[chatId] = {
            contentChunks: [content],
            get content() {
              return this.contentChunks.join("");
            },
            isComplete: false,
            timestamp: Date.now()
          };
        } else if (isComplete) {
          state.activeStreams[chatId].messageId = assistantMessageId;
          state.activeStreams[chatId].isComplete = true;
        } else {
          state.activeStreams[chatId].content += content;
        }
      }),

    endStream: (chatId) =>
      set((state) => {
        delete state.activeStreams[chatId];
      })
  }))
);
