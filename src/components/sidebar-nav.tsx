"use client";

import { cn } from "@/lib/utils";
import {
  Calendar,
  ChartNoAxesColumn,
  House,
  Sparkles,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { Suspense } from "react";

interface SidebarNavProps {
  activePage?: "home" | "calendar" | "stats" | "profile";
  calendarHref: string | null;
}

const getNavItems = (calendarHref: string | null) => [
  { key: "home" as const, label: "Início", icon: House, href: "/" },
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

function SidebarChatButton() {
  const [, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  return (
    <button
      type="button"
      onClick={() => setChatParams({ chat_open: true })}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl p-4",
        "bg-primary text-primary-foreground",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30",
        "active:scale-[0.98]",
      )}
    >
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

      <div className="relative flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">
          <Sparkles className="size-4" />
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-sm font-semibold leading-none">
            IA Trainify
          </span>
          <span className="text-[11px] leading-none text-primary-foreground/70">
            Treino personalizado
          </span>
        </div>
      </div>
    </button>
  );
}

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
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl cursor-not-allowed opacity-50 text-muted-foreground"
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
        <Suspense fallback={<div className="h-14 animate-pulse bg-muted rounded-xl" />}>
          <SidebarChatButton />
        </Suspense>
      </div>
    </aside>
  );
}
