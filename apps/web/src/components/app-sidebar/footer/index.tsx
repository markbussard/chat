import { SidebarFooter } from "~/components/ui/sidebar";
import { verifyUser } from "~/lib/dal";
import { UserProfileMenu } from "./user-profile-menu";

export async function AppSidebarFooter() {
  const user = await verifyUser();

  return (
    <SidebarFooter>
      <UserProfileMenu user={user} />
    </SidebarFooter>
  );
}
