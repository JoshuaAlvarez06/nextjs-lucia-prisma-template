"use client";

import { useMutation } from "@tanstack/react-query";

export function useVerifyEmail(params?: {
  onSuccess?: () => void | Promise<void>;
  onMutate?: () => void | Promise<void>;
  onError?: () => void | Promise<void>;
  onSettled?: () => void | Promise<void>;
}) {
  const { onSuccess, onMutate, onError, onSettled } = params ?? {};
  return useMutation<
    Response,
    unknown,
    {
      code: string;
    }
  >({
    mutationFn: async (data) => {
      const response = await fetch("/api/email-verification", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
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
