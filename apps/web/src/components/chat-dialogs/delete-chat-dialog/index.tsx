import { deleteChat } from "~/app/actions/chat";
import { Button } from "~/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";

interface DeleteChatDialogProps {
  chatId: string;
}

export const DeleteChatAlertDialog = (props: DeleteChatDialogProps) => {
  const { chatId } = props;
  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete chat?</DialogTitle>
        <DialogDescription>Are you want to delete this chat?</DialogDescription>
      </DialogHeader>
      <form
        action={async () => {
          await deleteChat(chatId);
        }}
      >
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" type="submit">
            Delete
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
