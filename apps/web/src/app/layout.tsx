import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Geist_Mono as FontMono, Inter as FontSans } from "next/font/google";

import { cn } from "~/lib/utils";
import { Providers } from "./providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono"
});

const META_THEME_COLORS = {
  LIGHT: "#ffffff",
  DARK: "#09090b"
} as const;

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
