import { toast } from "sonner";

import { deleteChat } from "~/app/actions/chat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~/components/ui/alert-dialog";

interface DeleteChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatId: string;
}

export const DeleteChatAlertDialog = (props: DeleteChatDialogProps) => {
  const { open, onOpenChange, chatId } = props;

  const handleConfirmDelete = async () => {
    const response = await deleteChat(chatId);

    if (!response.success) {
      toast.error(response.error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this chat?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel autoFocus={false}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
