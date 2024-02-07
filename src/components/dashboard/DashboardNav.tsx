"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "@/utils";
import { FaRegFileAlt, FaRegCreditCard } from "react-icons/fa";
import { GoGear } from "react-icons/go";

const items = [
  {
    title: "Posts",
    href: "/dashboard",
    icon: FaRegFileAlt,
  },

  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: FaRegCreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: GoGear,
  },
];

interface Props {
  className?: string;
}

export function DashboardNav({ className }: Props) {
  const path = usePathname();

  return (
    <nav className={classNames(className)}>
      {items.map((item) => (
        <Link href={item.href} key={item.href}>
          <span
            className={classNames(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === item.href ? "bg-accent" : "transparent"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
