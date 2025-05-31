import { useCallback, useEffect, useRef, useState } from "react";
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

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const message = currentMessage.trim();

      if (message) {
        sendMessage(currentMessage);
        setCurrentMessage("");
      }
    },
    [currentMessage, sendMessage]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLFormElement>) => {
      const clipboardData = e.clipboardData;
      const pastedData = clipboardData.getData("text/plain");
      setCurrentMessage((prev) => prev + pastedData.trim());
      e.preventDefault();
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (
        e.key === "Enter" &&
        !e.shiftKey &&
        !e.metaKey &&
        !e.nativeEvent.isComposing
      ) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentMessage(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 240)}px`;
    },
    []
  );

  return (
    <div
      className="relative mx-auto mb-6 w-full max-w-3xl cursor-text flex-col gap-2 rounded-2xl border border-input bg-transparent px-3 py-2 transition-shadow focus-within:border-gray-600 dark:border-alpha-400 dark:bg-input/30 dark:focus-within:border-alpha-600"
      onClick={() => inputRef.current?.focus()}
    >
      <form
        className="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2"
        onSubmit={handleSubmit}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
      >
        <Textarea
          ref={inputRef}
          autoFocus
          className={cn(
            "max-h-60 w-full resize-none overflow-y-auto border-[0px] border-transparent px-2 ring-0 shadow-none outline-0 placeholder:text-muted-foreground focus-visible:ring-0 dark:bg-transparent",
            isChatPage ? "min-h-12" : "min-h-16"
          )}
          placeholder="Ask anything..."
          value={currentMessage}
          onChange={handleTextareaChange}
          rows={1}
        />
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
      </form>
    </div>
  );
};
