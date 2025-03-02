"use client";

import Image from "next/image";
import {
  Check,
  ChevronsUpDown,
  LogOut,
  MonitorCheck,
  Moon,
  Sun
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "~/components/ui/sidebar";
import { META_THEME_COLORS } from "~/constants";
import { useMetaThemeColor } from "~/hooks/use-meta-theme-color";
import { parseError } from "~/lib/utils";
import { SessionUser } from "~/types/user";

interface UserProfileMenuButtonProps {
  user: SessionUser;
}

export function UserProfileMenuButton(props: UserProfileMenuButtonProps) {
  const { user } = props;

  const { isMobile } = useSidebar();

  const { theme, setTheme } = useTheme();
  const { setMetaThemeColor } = useMetaThemeColor();

  const toggleTheme = (value: "dark" | "light" | "system") => {
    setTheme(value);
    if (value === "light") {
      setMetaThemeColor(META_THEME_COLORS.LIGHT);
    } else if (value === "dark") {
      setMetaThemeColor(META_THEME_COLORS.DARK);
    } else if (value === "system") {
      // For system theme, check the preferred color scheme
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "DARK"
        : "LIGHT";
      setMetaThemeColor(META_THEME_COLORS[systemTheme]);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirectTo: "/login" });
    } catch (error) {
      const { message } = parseError(error);
      toast.error(message);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Image
                priority
                className="rounded-lg"
                src="/avatar-image.jpg"
                alt=""
                height={32}
                width={32}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Image
                  priority
                  className="rounded-lg"
                  src="/avatar-image.jpg"
                  alt=""
                  height={32}
                  width={32}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Appearance</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => toggleTheme("system")}>
                      <MonitorCheck />
                      <span>System</span>
                      {theme === "system" && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleTheme("light")}>
                      <Sun />
                      <span>Light</span>
                      {theme === "light" && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleTheme("dark")}>
                      <Moon />
                      <span>Dark</span>
                      {theme === "dark" && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
