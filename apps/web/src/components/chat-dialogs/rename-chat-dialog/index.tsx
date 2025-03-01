import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";

import { updateChatName } from "~/app/actions/chat";
import { Button } from "~/components/ui/button";
import { DialogFooter, DialogHeader } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface RenameChatDialogProps {
  chatId: string;
  chatName: string;
  onSubmitSuccess: () => void;
}

export const RenameChatDialog = (props: RenameChatDialogProps) => {
  const { chatId, chatName, onSubmitSuccess } = props;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Rename chat</DialogTitle>
      </DialogHeader>
      <form
        className="flex flex-col gap-6"
        action={async (formData) => {
          const res = await updateChatName(formData);
          if (res.success) {
            onSubmitSuccess();
          }
        }}
      >
        <div className="grid flex-1 gap-2">
          <Label htmlFor="name" className="sr-only">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={chatName}
            autoComplete="off"
          />
        </div>
        <Input id="chatId" name="chatId" defaultValue={chatId} hidden />
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </>
  );
};
