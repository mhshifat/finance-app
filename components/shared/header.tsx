"use client";

import { cn } from "@/lib/utils";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTE_LINKS = [
  { href: "/", title: "Overview" },
  { href: "/transactions", title: "Transactions" },
  { href: "/accounts", title: "Accounts" },
  { href: "/categories", title: "Categories" },
  { href: "/settings", title: "Settings" },
]

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="py-3 shadow-sm">
      <div className="container flex items-center gap-10 ">
        <Link href="/" className="text-2xl text-primary font-sans uppercase font-bold">Logo</Link>

        <nav className="w-auto">
          <ul className="flex items-center gap-5 list-none p-0 m-0">
            {ROUTE_LINKS.map(route => (
              <li key={route.title}>
                <Link href={route.href} className={cn("text-slate-500 text-sm", {
                  "text-primary font-semibold": pathname === route.href
                })}>{route.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="ml-auto flex items-center justify-center">
            <ClerkLoaded>
              <UserButton afterSignOutUrl="/" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin text-muted-foreground" />
            </ClerkLoading>
        </nav>
      </div>
    </header>
  )
}