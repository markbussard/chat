"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

type ProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

export function Providers(props: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
      {props.children}
      <Toaster />
    </ThemeProvider>
  );
}
