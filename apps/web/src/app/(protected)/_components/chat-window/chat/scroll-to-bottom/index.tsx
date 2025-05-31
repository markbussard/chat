import { ArrowDown } from "lucide-react";
import { useStickToBottomContext } from "use-stick-to-bottom";

import { Button } from "~/components/ui/button";

export function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) {
    return null;
  }

  return (
    <Button
      className="absolute bottom-full left-1/2 mb-4 size-6 -translate-x-1/2 rounded-full animate-in fade-in-0 zoom-in-95"
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className="size-[18px]" />
    </Button>
  );
}
