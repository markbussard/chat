import { verifyUser } from "~/lib/dal";
import { ChatWindow } from "./_components";

export default async function Dashboard() {
  await verifyUser();

  return <ChatWindow />;
}
