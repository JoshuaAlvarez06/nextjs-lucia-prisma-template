import { AuthForm } from "@/components";
import { redirects } from "@/constants";
import { uncachedValidateRequest } from "@/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { user } = await uncachedValidateRequest();
  if (user) redirect(redirects.afterLogin);

  return (
    <main className="flex items-center justify-center">
      <AuthForm isOpen isPage />
    </main>
  );
}
