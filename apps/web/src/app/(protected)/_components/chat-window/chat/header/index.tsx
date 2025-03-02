import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { DeleteChatAlertDialog } from "~/components/chat-dialogs/delete-chat-dialog";
import { RenameChatDialog } from "~/components/chat-dialogs/rename-chat-dialog";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
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

  const [isOpen, setIsOpen] = useState(false);
  const [openedDialog, setOpenDialog] = useState<"rename" | "delete">();

  return (
    <header className="sticky inset-x-0 z-10 flex shrink-0 items-center border-b bg-background">
      <div className="flex h-14 w-full items-center gap-2 px-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-6"
        />
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                {name}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DialogTrigger asChild onClick={() => setOpenDialog("rename")}>
                <DropdownMenuItem>Rename</DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild onClick={() => setOpenDialog("delete")}>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[450px]">
            {openedDialog === "rename" && (
              <RenameChatDialog
                chatId={id}
                chatName={name}
                onSubmitSuccess={() => {
                  setIsOpen(false);
                }}
              />
            )}
            {openedDialog === "delete" && <DeleteChatAlertDialog chatId={id} />}
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};
