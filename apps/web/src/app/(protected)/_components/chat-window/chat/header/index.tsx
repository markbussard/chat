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

interface ChatHeaderProps {
  id: string;
  name: string;
}

export const ChatHeader = (props: ChatHeaderProps) => {
  const { id, name } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [openedDialog, setOpenDialog] = useState<"rename" | "delete">();

  return (
    <div className="sticky top-0 right-0 left-0 z-10 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-background pr-4 pl-12">
      <div className="flex items-center space-x-4">
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
    </div>
  );
};
