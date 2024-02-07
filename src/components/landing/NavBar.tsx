"use client";

import { NAVBAR_HEIGHT } from "@/constants";
import Link from "next/link";
import { useState } from "react";
import { AuthForm } from "..";
import { useSession } from "@/hooks";
import { APP_NAME } from "@/constants/branding";
import { LuLayoutDashboard } from "react-icons/lu";

export function NavBar() {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          height: `${NAVBAR_HEIGHT}px`,
        }}
        className="w-screen max-w-[1240px] mx-auto px-6 flex items-center justify-between gap-3 text-white"
      >
        <Link href="/">
          <h1 className="text-3xl font-bold">{APP_NAME.toUpperCase()}</h1>
        </Link>
        <div>
          {!user && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-full px-4 py-2 text-medium text-white font-semibold bg-brand-500 hover:opacity-70"
            >
              Log in
            </button>
          )}
          {!!user && (
            <Link
              href="/dashboard"
              className="rounded-full px-4 py-2 text-medium text-white font-semibold bg-brand-500 hover:opacity-70 flex items-center gap-1.5"
            >
              <LuLayoutDashboard color="#fff" />
              <span className="inline-flex items-center">Dashboard</span>
            </Link>
          )}
        </div>
      </nav>
      {!user && <AuthForm isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
