"use client";

import { TextField } from "@/components";
import { VERIFICATION_CODE_LENGTH, redirects } from "@/constants";
import { useResetPassword } from "@/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const onError = () => void toast.error("Something went wrong");
  const { mutate, isPending } = useResetPassword({
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push(redirects.afterVerify);
    },
    onError,
  });

  const onVerify = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (password.trim().length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }
      mutate({ password });
    } catch (e) {}
  };

  return (
    <>
      <form className="space-y-4" onSubmit={onVerify}>
        <TextField
          containerClassName="space-y-1"
          labelClassName="text-sm font-medium"
          inputClassName="text-sm w-full rounded p-2 border-[1px] border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          label="New Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value.replaceAll(" ", ""))}
          autoComplete="new-password"
          disabled={isPending}
        />

        <button
          type="submit"
          className="w-full rounded-lg py-2 text-white font-semibold bg-brand-500 hover:opacity-70 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isPending || password.length < 8}
        >
          Reset
        </button>
      </form>
    </>
  );
}
