import { useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  DeleteChatAlertDialog,
  RenameChatDialog
} from "~/components/chat-dialogs";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";

interface ChatHeaderProps {
  id: string;
  name: string;
}

export const ChatHeader = (props: ChatHeaderProps) => {
  const { id, name } = props;

  const [openedDialog, setOpenDialog] = useState<"rename" | "delete">();

  const closeDialog = () => {
    setOpenDialog(undefined);
  };

  return (
    <header className="relative z-10 flex items-center bg-background">
      <div className="relative flex h-12 items-center gap-2 px-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-6"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              {name}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setOpenDialog("rename")}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenDialog("delete")}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <RenameChatDialog
          open={openedDialog === "rename"}
          onOpenChange={closeDialog}
          chatId={id}
          chatName={name}
          onSubmitSuccess={closeDialog}
        />
        <DeleteChatAlertDialog
          open={openedDialog === "delete"}
          onOpenChange={closeDialog}
          chatId={id}
        />
      </div>
      <div className="absolute inset-x-0 top-full h-5 bg-gradient-to-b from-background to-background/0" />
    </header>
  );
};
