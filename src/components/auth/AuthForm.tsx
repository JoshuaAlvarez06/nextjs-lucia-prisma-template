"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Logo, TextField } from "@/components";
import { useLogin, useSendResetPassword } from "@/hooks";
import { toast } from "react-toastify";
import Link from "next/link";
import { useSignUp } from "@/hooks";
import { useRouter } from "next/navigation";
import { classNames } from "@/utils";
import { redirects } from "@/constants";
import { APP_NAME } from "@/constants/branding";

export type AuthModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  isPage?: boolean;
};

type Action = "login" | "signup" | "forgot-password";

export function AuthForm({ isOpen, onClose, isPage }: AuthModalProps) {
  const router = useRouter();
  const [action, setAction] = useState<Action>("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSuccess = async () => {
    if (isPage) window.location.href = redirects.afterLogin;
    else router.refresh();
    onClose?.();
  };
  const { mutate: loginMutate, isPending: isPendingLogin } = useLogin({
    onError: () => void toast.error("Invalid email or password"),
    onSuccess,
  });
  const { mutate: signUpMutate, isPending: isPendingSignUp } = useSignUp({
    onError: () => void toast.error("Something went wrong. Please try again."),
    onSuccess,
  });
  const { mutate: resetPasswordMutate, isPending: isPendingReset } =
    useSendResetPassword({
      onError: () =>
        void toast.error("Something went wrong. Please try again."),
      onSuccess: () =>
        void toast.success("Password reset link sent to your email"),
    });
  const isPending = isPendingLogin || isPendingSignUp || isPendingReset;

  const onAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    try {
      (action === "login" ? loginMutate : signUpMutate)(form);
    } catch (e) {}
  };

  const onForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    try {
      resetPasswordMutate(form);
    } catch (e) {}
  };

  const close = () => {
    if (isPending || isPage) return;
    setForm({ email: "", password: "" });
    onClose?.();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog onClose={close} className="relative z-50">
        {!isPage && (
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
        )}
        {isPage && (
          <div className="fixed inset-0 bg-gray-200" aria-hidden="true" />
        )}
        <div className="fixed inset-0 flex flex-col gap-2 w-screen items-center justify-center p-4">
          {isPage && (
            <>
              <div>
                <Logo color="#000" width="80px" />
              </div>
            </>
          )}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel
              className={classNames(
                "mx-auto w-screen max-w-sm sm:max-w-md md:max-w-lg rounded-md bg-white p-5 space-y-2",
                isPage ? "border-gray-200" : ""
              )}
            >
              <Dialog.Title className="pt-5 font-bold text-3xl text-center">
                {getTitle(action)}
              </Dialog.Title>
              <div className="space-y-4">
                <form
                  className="space-y-4"
                  onSubmit={
                    action === "forgot-password" ? onForgotPassword : onAuth
                  }
                >
                  <TextField
                    containerClassName="space-y-1"
                    labelClassName="text-sm font-medium"
                    inputClassName="text-sm w-full rounded p-2 border-[1px] border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    label="Email"
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((c) => ({ ...c, email: e.target.value }))
                    }
                    autoComplete="email"
                    disabled={isPending}
                  />

                  {isAuth(action) && (
                    <TextField
                      containerClassName="space-y-1"
                      labelClassName="text-sm font-medium"
                      inputClassName="text-sm w-full rounded p-2 border-[1px] border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      label="Password"
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((c) => ({ ...c, password: e.target.value }))
                      }
                      autoComplete="current-password"
                      disabled={isPending}
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="w-full rounded-lg py-2 text-white font-semibold bg-brand-500 hover:opacity-70 disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={isPending}
                    >
                      {getButtonText(action)}
                    </button>
                  </div>
                  {isAuth(action) && (
                    <p className="text-xs font-light text-center">
                      By continuing, you agree to {APP_NAME}&apos;s{" "}
                      <Link
                        href="/terms"
                        className="text-brand-500 font-semibold hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-brand-500 font-semibold hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  )}
                </form>
                <div className="h-px bg-gray-200 w-full" />
                <div
                  className={classNames(
                    "text-sm flex items-center gap-2",
                    action === "login" ? "justify-between" : "justify-center"
                  )}
                >
                  {isAuth(action) && (
                    <div className="flex items-center gap-1">
                      <p className="hidden sm:block">
                        {action === "login"
                          ? "Don't have an account?"
                          : "Already have an account?"}
                      </p>
                      <button
                        className="text-brand-500 font-semibold hover:underline"
                        onClick={() =>
                          setAction((c) => (c === "login" ? "signup" : "login"))
                        }
                      >
                        {action === "login" ? "Sign up" : "Log in"}
                      </button>
                    </div>
                  )}
                  {(action === "login" || action === "forgot-password") && (
                    <button
                      className="text-brand-500 font-semibold hover:underline"
                      onClick={() =>
                        setAction((c) =>
                          c === "login" ? "forgot-password" : "login"
                        )
                      }
                    >
                      {getFooterActionText(action)}
                    </button>
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const getTitle = (action: Action) => {
  switch (action) {
    case "login":
      return `Log in to ${APP_NAME}`;
    case "signup":
      return `Sign up for ${APP_NAME}`;
    case "forgot-password":
      return "Forgot password";
  }
};

const getButtonText = (action: Action) => {
  switch (action) {
    case "login":
      return "Log in";
    case "signup":
      return "Sign up";
    case "forgot-password":
      return "Reset password";
  }
};

const isAuth = (action: Action) => action === "login" || action === "signup";

const getFooterActionText = (action: Action) => {
  switch (action) {
    case "login":
      return "Forgot password?";
    case "forgot-password":
      return "Remember your password?";
  }
};
