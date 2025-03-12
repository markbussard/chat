import { memo } from "react";

import { ChatConversationMessage } from "~/types/chat";

interface UserMessageProps {
  message: ChatConversationMessage;
}

export const UserMessage = memo((props: UserMessageProps) => {
  const { message } = props;

  return (
    <article className="flex justify-end py-4">
      <div className="max-w-[70%] rounded-2xl bg-zinc-800 px-4 py-3 text-white">
        {message.text}
      </div>
    </article>
  );
});

UserMessage.displayName = "UserMessage";
