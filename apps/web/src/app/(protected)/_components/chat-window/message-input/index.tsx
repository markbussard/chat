import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { ChatFocusMode } from "~/types/chat";
import { AttachFiles } from "./attach-files";
import { Focus } from "./focus";

interface MessageInputProps {
  isChatPage?: boolean;
  sendMessage: (message: string) => Promise<void>;
  focusMode: ChatFocusMode;
  onFocusModeChange: (focusMode: ChatFocusMode) => void;
}

export const MessageInput = (props: MessageInputProps) => {
  const {
    isChatPage = false,
    sendMessage,
    focusMode,
    onFocusModeChange
  } = props;

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
    <div className="w-full max-w-3xl" onClick={() => inputRef.current?.focus()}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(currentMessage);
          setCurrentMessage("");
        }}
        onPaste={(e) => {
          const clipboardData = e.clipboardData;
          const pastedData = clipboardData.getData("text/plain");
          setCurrentMessage((prev) => prev + pastedData.trim());
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !!currentMessage.trim()) {
            e.preventDefault();
            sendMessage(currentMessage);
            setCurrentMessage("");
          }
        }}
      >
        <div className="relative flex w-full max-w-3xl min-w-full flex-grow cursor-text flex-col gap-2 rounded-3xl border border-input bg-transparent px-3 py-2 transition-shadow focus-within:border-gray-600 dark:border-alpha-400 dark:bg-zinc-900 dark:focus-within:border-alpha-600">
          <div className="flex-1 overflow-hidden">
            <Textarea
              ref={inputRef}
              autoFocus
              className={cn(
                "max-h-60 w-full resize-none overflow-y-auto border-[0px] border-transparent px-2 ring-0 shadow-none outline-0 placeholder:text-muted-foreground focus-visible:ring-0",
                isChatPage ? "min-h-12" : "min-h-16"
              )}
              placeholder="Ask anything..."
              value={currentMessage}
              onChange={(e) => {
                setCurrentMessage(e.target.value);

                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 240)}px`;
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
  );
};
