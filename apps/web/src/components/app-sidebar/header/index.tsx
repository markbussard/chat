"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot } from "lucide-react";

import { SidebarHeader } from "~/components/ui/sidebar";

export const AppSidebarHeader = () => {
  const pathname = usePathname();

  const isRoot = pathname === "/";

  return (
    <SidebarHeader className="px-4 py-4">
      <div className="flex">
        <Link
          href="/"
          onClick={(e) => {
            if (isRoot) {
              e.preventDefault();
            }
          }}
        >
          <div className="flex aspect-square items-center justify-center rounded-lg">
            <Bot className="size-6" />
          </div>
        </Link>
      </div>
    </SidebarHeader>
  );
};
