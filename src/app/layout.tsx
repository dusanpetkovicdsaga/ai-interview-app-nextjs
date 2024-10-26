import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PageLayout } from "@/layout/PageLayout";
import ErrorsProvider from "@/providers/ErrorsProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { taglogInit } from "taglog-nextjs-client";

const inter = Inter({ subsets: ["latin"] });

if (process.env.TAGLOG_ACCESS_KEY) {
  const logger = taglogInit({
    accessKey: process.env.TAGLOG_ACCESS_KEY,
    defaultChannel: "default-channel",
    options: { captureConsole: true },
  });
  logger.captureInfo("Hello from server");
}

export const metadata: Metadata = {
  title: "AI Tech Interview App",
  description: "Practice and get evaluated by AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("RootLayout");
  return (
    <html lang="en">
      <body className={inter.className}>
        <PageLayout>
          <ErrorsProvider>
            <QueryProvider>{children}</QueryProvider>
          </ErrorsProvider>
        </PageLayout>
      </body>
    </html>
  );
}
