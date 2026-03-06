"use client";

import { cn } from "@/lib/utils";
import { BarChart2, Calendar, Home, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationBarClientProps {
  calendarHref: string;
}

export function NavigationBarClient({ calendarHref }: NavigationBarClientProps) {
  const pathname = usePathname();

  const items = [
    { id: "home", icon: Home, label: "Home", href: "/" },
    { id: "calendar", icon: Calendar, label: "Calendário", href: calendarHref },
    { id: "ai-trainify", icon: Sparkles, label: "IA Trainify", href: "/ia-trainify", primary: true },
    { id: "stats", icon: BarChart2, label: "Evolução", href: "/stats" },
    { id: "profile", icon: User, label: "Perfil", href: "/profile" },
  ];

  const isActive = (item: (typeof items)[0]) => {
    if (item.id === "calendar") return pathname.startsWith("/workout-plans");
    if (item.id === "home") return pathname === "/";
    return pathname.startsWith(item.href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-xl mx-auto">
      <div className="absolute inset-0 rounded-t-3xl bg-background/80 backdrop-blur-xl border-t border-border" />
      <div className="relative flex items-end justify-between px-4 pt-3 pb-5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          if (item.primary) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="relative flex flex-col items-center gap-1 -mt-8 z-10"
              >
                {active && (
                  <span className="absolute w-14 h-14 rounded-full bg-primary opacity-40 animate-ping" />
                )}
                <span
                  className={cn(
                    "relative flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg w-14 h-14 transition-transform duration-200 active:scale-90",
                    active && "-translate-y-1"
                  )}
                >
                  <Icon className="size-6 text-primary-foreground" strokeWidth={2.2} />
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold tracking-wide text-primary transition-opacity duration-200",
                    active ? "opacity-100" : "opacity-60"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className="relative flex flex-col items-center gap-1 min-w-[48px] active:scale-90 transition-transform duration-150"
            >
              <span
                className={cn(
                  "relative z-10 transition-transform duration-200",
                  active && "-translate-y-0.5"
                )}
              >
                <Icon
                  className={cn(
                    "size-5 transition-colors duration-200",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </span>
              <span
                className={cn(
                  "relative z-10 text-xs tracking-wide leading-none transition-all duration-200",
                  active
                    ? "text-primary font-semibold opacity-100"
                    : "text-muted-foreground font-medium opacity-70"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}