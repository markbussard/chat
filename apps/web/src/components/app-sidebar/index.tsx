import { Suspense } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem
} from "~/components/ui/sidebar";
import { AppSidebarFooter } from "./footer";
import { AppSidebarHeader } from "./header";
import { RecentChats, RecentChatsSkeleton } from "./recent-chats";
import { StartNewChatButton } from "./start-new-chat-button";

export async function AppSidebar() {
  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <StartNewChatButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recents</SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<RecentChatsSkeleton />}>
              <RecentChats />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
}
