import { toast } from "sonner";
import { z } from "zod";

import { updateChatName } from "~/app/actions/chat";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useZodForm } from "~/hooks/use-zod-form";
import { parseError } from "~/lib/utils";
import { UpdateChatNameSchema } from "~/schemas/chat";

const schema = UpdateChatNameSchema.omit({
  chatId: true
});

interface RenameChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatId: string;
  chatName: string;
  onSubmitSuccess: () => void;
}

export const RenameChatDialog = (props: RenameChatDialogProps) => {
  const { open, onOpenChange, chatId, chatName, onSubmitSuccess } = props;

  const form = useZodForm({
    schema,
    defaultValues: {
      name: chatName
    }
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const response = await updateChatName({
        name: values.name,
        chatId
      });

      if (!response.success) {
        throw new Error(
          "An error occurred while renaming the chat. Please try again."
        );
      }

      toast.success("Chat renamed successfully");
      onSubmitSuccess();
    } catch (error) {
      const { message } = parseError(error);
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild />
      <DialogContent aria-describedby="">
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel hidden>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
