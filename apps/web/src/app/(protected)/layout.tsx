import { cookies } from "next/headers";

import { AppSidebar } from "~/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { SIDEBAR_COOKIE_NAME } from "~/constants";

type ProtectedLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function ProtectedLayout(props: ProtectedLayoutProps) {
  const cookieStore = await cookies();

  const sidebarDefaultOpen = cookieStore.has(SIDEBAR_COOKIE_NAME)
    ? cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true"
    : true;

  return (
    <SidebarProvider defaultOpen={sidebarDefaultOpen}>
      <AppSidebar />
      <div className="absolute top-4 left-4 z-1">
        <SidebarTrigger />
      </div>
      <div className="relative flex h-screen max-w-full flex-1 flex-col overflow-hidden">
        <main className="relative h-full w-full flex-1 overflow-auto">
          <div className="flex h-full flex-col">{props.children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
