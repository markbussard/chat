import { ArrowDown } from "lucide-react";
import { useStickToBottomContext } from "use-stick-to-bottom";

import { Button } from "~/components/ui/button";

export function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <div className="relative">
        <Button
          className="absolute right-[50%] bottom-6 z-30 size-6 rounded-full"
          onClick={() => scrollToBottom()}
        >
          <ArrowDown className="size-[18px]" />
        </Button>
      </div>
    )
  );
}
