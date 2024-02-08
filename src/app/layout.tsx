import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components";
import { validateRequest } from "@/server";
import { APP_NAME } from "@/constants/branding";
import "@radix-ui/themes/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Create and share loops with friends and the world",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await validateRequest();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers sessionData={sessionData}>{children}</Providers>
      </body>
    </html>
  );
}
