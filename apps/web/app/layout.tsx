import type { Metadata, Viewport } from "next";
import { APP_CONFIG } from "@/config/app.config";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: [
    "interview preparation",
    "AI interview coach",
    "job interview training",
    "IBM watsonx",
    "interview simulator",
    "career coaching",
  ],
  authors: [{ name: "InterviewIQ" }],
  creator: "InterviewIQ",
  metadataBase: new URL(APP_CONFIG.url),
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: APP_CONFIG.url,
    title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
    siteName: APP_CONFIG.name,
  },
  robots: {
    index: APP_CONFIG.env === "production",
    follow: APP_CONFIG.env === "production",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-surface antialiased">{children}</body>
    </html>
  );
}
