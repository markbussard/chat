import { verifyUser } from "~/lib/dal";

export default async function RecentPage() {
  const user = await verifyUser();

  return <div>Recents: {user.email}</div>;
}
