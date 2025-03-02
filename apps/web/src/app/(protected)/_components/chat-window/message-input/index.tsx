import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ChatFocusMode } from "~/types/chat";
import { AttachFiles } from "./attach-files";
import { Focus } from "./focus";

interface MessageInputProps {
  sendMessage: (message: string) => Promise<void>;
  focusMode: ChatFocusMode;
  onFocusModeChange: (focusMode: ChatFocusMode) => void;
}

export const MessageInput = (props: MessageInputProps) => {
  const { sendMessage, focusMode, onFocusModeChange } = props;

  const [currentMessage, setCurrentMessage] = useState("");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      const activeElement = document.activeElement;

      const isInputFocused = activeElement?.tagName === "TEXTAREA";

      if (e.key === "/" && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className="w-full max-w-3xl cursor-text"
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      <div className="flex h-full w-full min-w-0 flex-col">
        <form
          className="relative flex h-full min-h-0 w-full rounded-3xl border border-input transition-shadow focus-within:border-gray-600 dark:border-alpha-400 dark:focus-within:border-alpha-600"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(currentMessage);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !!currentMessage.trim()) {
              e.preventDefault();
              sendMessage(currentMessage);
            }
          }}
        >
          <div className="flex w-full min-w-full flex-col gap-2 px-3 py-2">
            <div className="flex-1 overflow-hidden">
              <Textarea
                ref={inputRef}
                autoFocus
                className="max-h-[96px] min-h-[4.5rem] w-full resize-none overflow-y-auto border-[0px] border-transparent px-2 ring-0 shadow-none outline-0 focus-visible:ring-0"
                placeholder="Ask anything"
                value={currentMessage}
                onChange={(e) => {
                  setCurrentMessage(e.target.value);

                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
                }}
                rows={1}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="mx-2 flex items-center">
                <Focus focusMode={focusMode} onChange={onFocusModeChange} />
              </div>
              <div className="flex items-center justify-center gap-2">
                <AttachFiles />
                <Button
                  disabled={!currentMessage.trim()}
                  type="submit"
                  size="icon"
                  className="h-8 w-8 rounded-3xl"
                >
                  <ArrowUp className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
