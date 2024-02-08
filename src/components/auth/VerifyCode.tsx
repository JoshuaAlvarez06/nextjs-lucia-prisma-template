"use client";

import { TextField } from "@/components";
import { VERIFICATION_CODE_LENGTH, redirects } from "@/constants";
import { useVerifyEmail, useSendVerificationCode } from "@/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function VerifyCode() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const onError = () => void toast.error("Something went wrong");
  const { mutate: verifyMutate, isPending: isPendingVerify } = useVerifyEmail({
    onSuccess: () => {
      toast.success("Email successfully verified!");
      window.location.href = redirects.afterVerify;
    },
    onError,
  });
  const { mutate: sendCodeMutate, isPending: isPendingSendCode } =
    useSendVerificationCode({
      onSuccess: () => {
        toast.success("Verification code sent!");
      },
      onError,
    });

  const onVerify = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!code) return;
      if (code.trim().length !== VERIFICATION_CODE_LENGTH) {
        toast.error("Invalid verification code");
        return;
      }
      verifyMutate({ code });
    } catch (e) {}
  };
  const onResend = (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      sendCodeMutate();
    } catch (e) {}
  };
  const isPending = isPendingVerify || isPendingSendCode;

  return (
    <>
      <form className="space-y-4" onSubmit={onVerify}>
        <TextField
          containerClassName="space-y-1"
          labelClassName="text-sm font-medium"
          label="Verification Code"
          id="verification-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replaceAll(" ", ""))}
          autoComplete="verification-code"
          disabled={isPending}
        />

        <button
          type="submit"
          className="w-full rounded-lg py-2 text-white font-semibold bg-brand-500 hover:opacity-70 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isPending || code.length !== VERIFICATION_CODE_LENGTH}
        >
          Verify
        </button>
        <button
          type="button"
          onClick={onResend}
          className="w-full rounded-lg py-2 text-black font-semibold bg-gray-200 hover:opacity-70 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          Resend Code
        </button>
      </form>
      <div className="text-sm flex items-center justify-center gap-1">
        <p>Change account?</p>
        <button
          className="text-brand-500 font-semibold hover:underline"
          onClick={() => {}}
        >
          Log out
        </button>
      </div>
    </>
  );
}
