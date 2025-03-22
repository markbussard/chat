import { verifyUser } from "~/lib/dal";
import { ChatWindow } from "./_components";

export default async function DashboardPage() {
  await verifyUser();
  return <ChatWindow />;
}
