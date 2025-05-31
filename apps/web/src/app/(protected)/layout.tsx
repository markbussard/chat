import { cookies } from "next/headers";

import { AppSidebar } from "~/components/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { SIDEBAR_COOKIE_NAME } from "~/constants";
import { WebSocketProvider } from "./_ws";

export default async function ProtectedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const sidebarDefaultOpen = cookieStore.has(SIDEBAR_COOKIE_NAME)
    ? cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true"
    : true;

  return (
    <SidebarProvider defaultOpen={sidebarDefaultOpen}>
      <AppSidebar />
      <WebSocketProvider>
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </WebSocketProvider>
    </SidebarProvider>
  );
}
