import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton
} from "~/components/ui/sidebar";

export const RecentChatsSkeleton = () => {
  return (
    <SidebarMenu>
      {Array.from({ length: 8 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
