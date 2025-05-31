import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { Toaster } from "~/components/ui/sonner";
import { META_THEME_COLORS } from "~/constants";
import { cn } from "~/lib/utils";

import "./globals.css";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Chat"
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.LIGHT
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.DARK}')
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body
        className={cn(
          "overscroll-none bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
