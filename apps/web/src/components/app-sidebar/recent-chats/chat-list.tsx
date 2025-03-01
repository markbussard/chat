"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/components/ui/sidebar";
import { RecentChatListItem } from "~/types/chat";

interface RecentChatListProps {
  initialChats: RecentChatListItem[];
}

export const RecentChatList = (props: RecentChatListProps) => {
  const { initialChats } = props;

  const pathname = usePathname();

  return (
    <SidebarMenu>
      {initialChats.map((chat) => {
        const href = `/chat/${chat.id}`;
        const isActive = pathname === href;
        return (
          <SidebarMenuItem key={chat.id}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link
                href={href}
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <div className="truncate overflow-hidden text-ellipsis">
                  {chat.name}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};
