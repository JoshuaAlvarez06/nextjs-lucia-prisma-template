"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "@/utils";
import { HiSparkles } from "react-icons/hi2";
import { FaMagnifyingGlass, FaPeopleGroup } from "react-icons/fa6";
import { FaCog } from "react-icons/fa";
import { Logo, ThemeToggle } from "@/components";
import Image from "next/image";

const items = [
  {
    title: "Recent",
    href: "/home",
    icon: HiSparkles,
  },

  {
    title: "Find",
    href: "/find",
    icon: FaMagnifyingGlass,
  },
  {
    title: "Community",
    href: "/community",
    icon: FaPeopleGroup,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: FaCog,
  },
];

interface Props {
  className?: string;
}

export function HomeNav({ className }: Props) {
  const path = usePathname();

  return (
    <nav className={classNames(className)}>
      <Link href="/home">
        <Logo
          width="36px"
          className="hidden md:block md:mb-4 fill-accent-foreground"
        />
      </Link>
      {items.map((item) => {
        const isActive = path === item.href;
        return (
          <Link href={item.href} key={item.href}>
            <span
              className={classNames(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-black/50 hover:text-white gap-3",
                isActive ? "bg-black/50 rounded-md text-white" : "transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden md:inline-block font-semibold">
                {item.title}
              </span>
            </span>
          </Link>
        );
      })}
      <div className="hidden md:flex flex-col mt-auto items-start gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full border bg-gray-500"
            src="/images/avatars/avatar-1.jpg"
            alt="avatar"
            width={34}
            height={34}
          />
          <div className="text-sm">
            <p className="font-bold">No Name</p>
            <p className="text-gray-400 text-xs">Member</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
