import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PageLayout } from "@/layout/PageLayout";
import ErrorsProvider from "@/providers/ErrorsProvider";
import { QueryProvider } from "@/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Tech Interview App",
  description: "Practice and get evaluated by AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
