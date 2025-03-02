import { cookies } from "next/headers";

import { AppSidebar } from "~/components/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { SIDEBAR_COOKIE_NAME } from "~/constants";

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
      <main className="relative flex h-screen max-w-full flex-1 flex-col overflow-hidden">
        <div className="relative h-full w-full flex-1 overflow-auto">
          <div className="flex h-full flex-col">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
