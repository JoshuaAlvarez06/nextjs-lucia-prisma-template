"use client";

import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from "@tanstack/react-query";
import { Session, User } from "lucia";
import dynamic from "next/dynamic";
import { createContext } from "react";

const ToastContainer = dynamic(
  () => import("react-toastify").then((module) => module.ToastContainer),
  {
    ssr: false,
  }
);

import "react-toastify/dist/ReactToastify.css";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * (1000 * 60),
      retry: false,
    },
  },
});

export function Providers({
  children,
  sessionData,
}: {
  children: React.ReactNode;
  sessionData: { user: User | null; session: Session | null };
}) {
  const dehydratedState = dehydrate(client);

  return (
    <QueryClientProvider client={client}>
      <HydrationBoundary state={dehydratedState}>
        <>
          <AuthContext.Provider
            value={{ state: sessionData, dispatch: () => null }}
          >
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              className="text-sm"
            />

            {children}
          </AuthContext.Provider>
        </>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

const initialState = {
  user: null,
  session: null,
} as { user: User | null; session: Session | null };

export const AuthContext = createContext({
  state: initialState,
  dispatch: () => null,
});
