import { DashboardNav } from "@/components";
import { redirects } from "@/constants";
import { validateRequest } from "@/server";
import { redirect } from "next/navigation";
import * as React from "react";

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const { user } = await validateRequest();

  if (!user) redirect(redirects.toLogin);
  if (!user.emailVerified) redirect(redirects.toVerify);

  return (
    <div className="flex min-h-screen w-screen flex-col gap-6 px-2 pt-6 md:flex-row md:px-4 lg:gap-10 bg-gray-900 text-white">
      <DashboardNav className="flex flex-shrink-0 gap-2 md:w-48 md:flex-col lg:w-80" />
      <main className="w-full">{children}</main>
    </div>
  );
}
