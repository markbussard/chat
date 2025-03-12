import { Metadata } from "next";

import { getChatById } from "~/data/chat";
import { verifyUser } from "~/lib/dal";
import { ChatWindow } from "../../_components";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  props: ChatPageProps
): Promise<Metadata> {
  const user = await verifyUser();

  const { id } = await props.params;
  const chat = await getChatById(id, user.id);

  return {
    title: chat.name
  };
}

export default async function ChatPage(props: ChatPageProps) {
  const user = await verifyUser();

  const { id } = await props.params;
  const chat = await getChatById(id, user.id);

  return <ChatWindow chat={chat} />;
}
