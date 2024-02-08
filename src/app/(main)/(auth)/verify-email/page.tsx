import { Logo, VerifyCode } from "@/components";
import { redirects } from "@/constants";
import { validateRequest } from "@/server";
import { classNames } from "@/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Verify Email",
  description: "Verify your email",
};

export default async function VerifyEmailPage() {
  const { user } = await validateRequest();
  if (!user) redirect(redirects.toLogin);

  return (
    <div>
      <div className="fixed inset-0 bg-accent" aria-hidden="true" />
      <div className="fixed inset-0 flex flex-col gap-2 w-screen items-center justify-center p-4">
        <Link href="/">
          <Logo
            className="text-accent-foreground fill-accent-foreground"
            width="80px"
          />
        </Link>
        <div
          className={classNames(
            "mx-auto w-screen max-w-md rounded bg-background text-foreground p-5 space-y-2 border-gray-200"
          )}
        >
          <h2 className="pt-3 font-bold text-3xl text-center">Verify Email</h2>
          <p className="text-sm">
            Verification code was sent to{" "}
            <span className="font-bold">{user.email}</span>. Check your spam
            folder if you can&apos;t find the email
          </p>
          <div className="space-y-4">
            <VerifyCode />
          </div>
        </div>
      </div>
    </div>
  );
}
