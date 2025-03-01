import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "~/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { RecentChats, RecentChatsSkeleton } from "./recent-chats";

export async function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4">
        <div className="flex items-center justify-between">
          <Image priority src="/logo.jpg" alt="" height={40} width={40} />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Plus />
                <span>Start new chat</span>
              </Link>
            </SidebarMenuButton>
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
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
