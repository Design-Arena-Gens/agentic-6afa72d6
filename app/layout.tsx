import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import PWARegister from "./pwa-register";

export const metadata: Metadata = {
  title: "Agentic Browser",
  description: "Lightweight mobile-friendly browser UI as a PWA",
  themeColor: "#111827",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="theme-color" content="#111827" />
      </head>
      <body>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
