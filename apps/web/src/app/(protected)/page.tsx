import { verifyUser } from "~/lib/dal";
import { ChatWindow } from "./_components";

export default async function DashboardPage() {
  const user = await verifyUser();

  return <ChatWindow userName={user.name ?? user.email} />;
}
