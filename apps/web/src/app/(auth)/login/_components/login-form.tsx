"use client";

import { Bot } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters")
    .email("Invalid email address")
});

export const LoginForm = () => {
  const form = useZodForm({
    schema: LoginFormSchema,
    defaultValues: {
      email: ""
    }
  });

  const handleEmailSignIn = async (values: z.infer<typeof LoginFormSchema>) => {
    try {
      await signIn("sendgrid", { email: values.email });
    } catch (error) {
      const { message } = parseError(error);
      toast.error(message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { redirectTo: "/" });
    } catch (error) {
      const { message } = parseError(error);
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <Bot className="size-10" strokeWidth={1} />
          <CardTitle className="text-2xl">Welcome</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Form {...form}>
            <form
              id="login-form"
              className="flex flex-col gap-4 [&_label]:hidden"
              onSubmit={form.handleSubmit(handleEmailSignIn)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Continue with email</Button>
            </form>
          </Form>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
          <Button variant="outline" onClick={handleGoogleSignIn}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
