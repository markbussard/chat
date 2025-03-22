"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { SidebarMenuButton } from "~/components/ui/sidebar";

export const StartNewChatButton = () => {
  const pathname = usePathname();

  const isRoot = pathname === "/";
  return (
    <SidebarMenuButton asChild>
      <Link
        href="/"
        onClick={(e) => {
          if (isRoot) {
            e.preventDefault();
          }
        }}
      >
        <Plus />
        <span>Start new chat</span>
      </Link>
    </SidebarMenuButton>
  );
};
