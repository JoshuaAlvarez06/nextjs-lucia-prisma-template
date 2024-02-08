import { Logo, ResetPassword } from "@/components";
import { redirects } from "@/constants";
import { validateRequest } from "@/server";
import { classNames } from "@/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Verify Email",
  description: "Verify your email",
};

export default async function ResetPasswordPage() {
  const { user } = await validateRequest();
  if (user) redirect(redirects.afterLogin);

  return (
    <div>
      <div className="fixed inset-0 bg-gray-200" aria-hidden="true" />
      <div className="fixed inset-0 flex flex-col gap-2 w-screen items-center justify-center p-4">
        <Link href="/">
          <Logo color="#000" width="80px" />
        </Link>
        <div
          className={classNames(
            "mx-auto w-screen max-w-md rounded bg-background text-foreground p-5 space-y-2 border-gray-200"
          )}
        >
          <h2 className="pt-3 font-bold text-3xl text-center">
            Reset Password
          </h2>
          <div className="space-y-4">
            <ResetPassword />
          </div>
        </div>
      </div>
    </div>
  );
}
