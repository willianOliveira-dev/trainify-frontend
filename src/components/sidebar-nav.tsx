"use client";

import { cn } from "@/lib/utils";
import { Calendar, ChartNoAxesColumn, House, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ChatOpenButton } from "./chat-open-button";

interface SidebarNavProps {
  activePage?: "home" | "calendar" | "stats" | "profile";
  calendarHref: string | null;
}

const getNavItems = (calendarHref: string | null) => [
  {
    key: "home" as const,
    label: "Início",
    icon: House,
    href: "/",
  },
  {
    key: "calendar" as const,
    label: "Calendário",
    icon: Calendar,
    href: calendarHref,
  },
  {
    key: "stats" as const,
    label: "Estatísticas",
    icon: ChartNoAxesColumn,
    href: "/stats",
  },
  {
    key: "profile" as const,
    label: "Perfil",
    icon: UserRound,
    href: "/profile",
  },
];

export function SidebarNav({
  activePage = "home",
  calendarHref,
}: SidebarNavProps) {
  const items = getNavItems(calendarHref);

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col justify-between border-r border-border bg-background px-4 py-8 z-50">
      <div className="flex flex-col gap-8">
        <div className="px-2">
          <Image
            src="/logo.png"
            alt="Trainify Logo"
            width={95}
            height={50}
            className="object-contain"
          />
        </div>

        <nav className="flex flex-col gap-1">
          {items.map(({ key, label, icon: Icon, href }) => {
            const isActive = activePage === key;

            if (!href) {
              return (
                <span
                  key={key}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl cursor-not-allowed opacity-50",
                    "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {label}
                </span>
              );
            }

            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-3 px-2">
        <div className="h-px bg-border" />
        <div className="flex items-center gap-3 py-1">
          <ChatOpenButton />
          <span className="text-sm font-medium text-muted-foreground">
            IA Trainify
          </span>
        </div>
      </div>
    </aside>
  );
}
