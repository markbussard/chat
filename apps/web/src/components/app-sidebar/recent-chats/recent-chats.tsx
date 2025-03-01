import { geRecentChatsByUserId } from "~/data/chat";
import { verifyUser } from "~/lib/dal";
import { RecentChatList } from "./chat-list";

export async function RecentChats() {
  const user = await verifyUser();
  const recentChats = await geRecentChatsByUserId(user.id);

  return <RecentChatList initialChats={recentChats} />;
}
