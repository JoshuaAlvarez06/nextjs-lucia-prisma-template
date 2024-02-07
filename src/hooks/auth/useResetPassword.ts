"use client";

import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function useResetPassword(params?: {
  onSuccess?: () => void | Promise<void>;
  onMutate?: () => void | Promise<void>;
  onError?: () => void | Promise<void>;
  onSettled?: () => void | Promise<void>;
}) {
  const queryParams = useParams();
  const { token } = queryParams;
  const { onSuccess, onMutate, onError, onSettled } = params ?? {};
  return useMutation<
    Response,
    unknown,
    {
      password: string;
    }
  >({
    mutationFn: async (data) => {
      if (!token) throw new Error("Token not found");
      const response = await fetch("/api/reset-password/" + token, {
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
