import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PageLayout } from "@/layout/PageLayout";
import ErrorsProvider from "@/providers/ErrorsProvider";
import { QueryProvider } from "@/providers/QueryProvider";
// import { taglogInit } from "taglog-nodejs-client";

const inter = Inter({ subsets: ["latin"] });

// const { captureInfo } = taglogInit({
//   accessKey: "9c7ed2c7-bbaf-4c14-ba18-337a932b0ed2",
//   defaultChannel: "server-logs",
//   serverURL: "http://localhost:3000/api",
//   options: {
//     captureConsole: true,
//   },
// });

export const metadata: Metadata = {
  title: "AI Tech Interview App",
  description: "Practice and get evaluated by AI.",
};

// captureInfo("test from server");

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
