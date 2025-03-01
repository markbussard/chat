import { ChatConversationMessage } from "~/types/chat";

interface AssistantMessageMarkdownProps {
  message: ChatConversationMessage;
}

export const Markdown = (props: AssistantMessageMarkdownProps) => {
  const { message } = props;

  return (
    <article className="prose dark:prose-invert max-w-full">
      <div dangerouslySetInnerHTML={{ __html: message.text }} />
    </article>
  );
};
