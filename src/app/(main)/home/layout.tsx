import { HomeNav } from "@/components";
import { redirects } from "@/constants";
import { validateRequest } from "@/server";
import { redirect } from "next/navigation";
import * as React from "react";

interface Props {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: Props) {
  const { user } = await validateRequest();

  if (!user) redirect(redirects.toLogin);
  if (!user.emailVerified) redirect(redirects.toVerify);

  return (
    <div className="flex min-h-screen w-screen text-white">
      <HomeNav className="fixed left-0 inset-y-0 flex flex-shrink-0 gap-2 lg:gap-3 md:w-48 md:flex-col lg:w-64 bg-accent p-5 border-r border-gray-500 text-foreground" />
      <main className="w-full md:ml-48 lg:ml-64">{children}</main>
    </div>
  );
}
