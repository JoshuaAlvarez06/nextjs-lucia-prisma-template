"use client";

import { useMutation } from "@tanstack/react-query";

export function useSendVerificationCode(params?: {
  onSuccess?: () => void | Promise<void>;
  onMutate?: () => void | Promise<void>;
  onError?: () => void | Promise<void>;
  onSettled?: () => void | Promise<void>;
}) {
  const { onSuccess, onMutate, onError, onSettled } = params ?? {};
  return useMutation<Response, unknown>({
    mutationFn: async () => {
      const response = await fetch("/api/email-verification/resend", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Something went wrong");
      return response;
    },
    onSuccess,
    onMutate,
    onError,
    onSettled,
  });
}
