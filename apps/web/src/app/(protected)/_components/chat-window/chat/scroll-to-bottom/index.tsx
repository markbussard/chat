import { ArrowDown } from "lucide-react";
import { useStickToBottomContext } from "use-stick-to-bottom";

import { Button } from "~/components/ui/button";

export function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <div>
        <Button
          className="relative z-30 mb-4 size-7 rounded-full"
          onClick={() => scrollToBottom()}
        >
          <ArrowDown className="size-[18px]" />
        </Button>
      </div>
    )
  );
}
