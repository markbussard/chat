import { MessageSender } from "@repo/db";

interface MessageLayoutProps {
  sender: MessageSender;
  children: React.ReactNode;
}

export const MessageLayout = (props: MessageLayoutProps) => {
  const { sender, children } = props;

  return (
    <article className="w-full" dir="auto">
      <div className="mx-auto flex max-w-3xl flex-1 gap-4 md:gap-5 lg:gap-6">
        <div className="group/conversation-turn relative flex w-full min-w-0 flex-col">
          <div className="flex-col gap-1 md:gap-3">
            <div className="flex flex-col">
              <div
                data-message-author-role={
                  sender === "ASSISTANT" ? "assistant" : "user"
                }
                className="relative flex w-full flex-col items-end gap-2 text-start break-words whitespace-normal"
              >
                <div className="flex w-full flex-col gap-1 first:pt-[3px] empty:hidden">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
