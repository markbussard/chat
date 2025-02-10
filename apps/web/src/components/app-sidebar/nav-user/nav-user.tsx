import { verifyUser } from "~/lib/dal";
import { UserProfileMenuButton } from "./user-profile-menu-button";

export async function NavUser() {
  const user = await verifyUser();

  return <UserProfileMenuButton user={user} />;
}
