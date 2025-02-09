"use client";

import { ThemeProvider } from "next-themes";

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
    </ThemeProvider>
  );
}
