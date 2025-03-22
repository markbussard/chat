import { StreamingMessage as StreamingMessageType } from "~/app/(protected)/_ws";
import { MarkdownRenderer, MessageLayout } from "../common";

interface StreamingMessageProps {
  message: StreamingMessageType;
}

export const StreamingMessage = (props: StreamingMessageProps) => {
  const { message } = props;

  return (
    <MessageLayout sender="ASSISTANT">
      <MarkdownRenderer message={message.content} />
    </MessageLayout>
  );
};
