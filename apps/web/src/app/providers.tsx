"use client";

import { ThemeProvider } from "next-themes";

import { Toaster } from "~/components/ui/sonner";

type ProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

export function Providers(props: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {props.children}
      <Toaster />
    </ThemeProvider>
  );
}
