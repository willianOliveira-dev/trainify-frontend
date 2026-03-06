"use client";

import { toast } from "@/lib/toast-utils";
import { cn } from "@/lib/utils";
import { BarChart2, Calendar, Home, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavigationBarClientProps {
  calendarHref: string;
  hasActivePlan: boolean;
}

export function NavigationBarClient({ calendarHref, hasActivePlan }: NavigationBarClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const showPlanRequiredToast = () => {
    toast.info({
      title: "Ops! Plano necessário",
      description: "Você precisa de um plano de treino ativo para acessar esta funcionalidade.",
      action: {
        label: "Criar com IA",
        onClick: () => router.push("/ia-trainify"),
      },
      secondaryAction: {
        label: "Agora não",
        onClick: () => console.log("dispensado"),
      },
    });
  };
  const items = [
    { 
      id: "home", 
      icon: Home, 
      label: "Home", 
      href: "/",
      requiresPlan: false
    },
    { 
      id: "calendar", 
      icon: Calendar, 
      label: "Calendário", 
      href: calendarHref,
      requiresPlan: true
    },
    { 
      id: "ai-trainify", 
      icon: Sparkles, 
      label: "IA Trainify", 
      href: "/ia-trainify", 
      primary: true,
      requiresPlan: false
    },
    { 
      id: "stats", 
      icon: BarChart2, 
      label: "Evolução", 
      href: "/stats",
      requiresPlan: true
    },
    { 
      id: "profile", 
      icon: User, 
      label: "Perfil", 
      href: "/profile",
      requiresPlan: false
    },
  ];

  const handleClick = (e: React.MouseEvent, item: typeof items[0]) => {
    if (item.requiresPlan && !hasActivePlan) {
      e.preventDefault();
      e.stopPropagation();
      showPlanRequiredToast();
      return false;
    }
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-xl mx-auto">
      <div className="absolute inset-0 rounded-t-3xl bg-background border-t border-border" />
      <div className="relative flex items-end justify-between px-4 pt-3 pb-5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const disabled = item.requiresPlan && !hasActivePlan;

          if (item.primary) {
            return (
              <Link
                key={item.id}
                href={disabled ? "#" : item.href}
                onClick={(e) => handleClick(e, item)}
                className={cn(
                  "relative flex flex-col items-center gap-1 -mt-8 z-10 transition-all duration-200",
                  disabled && "opacity-50"
                )}
                aria-disabled={disabled}
              >
                {active && !disabled && (
                  <span className="absolute w-14 h-14 rounded-full bg-primary opacity-40 animate-ping" />
                )}
                <span
                  className={cn(
                    "relative flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg w-14 h-14 transition-transform duration-200",
                    active && !disabled && "-translate-y-1",
                    !disabled && "hover:scale-105 active:scale-95"
                  )}
                >
                  <Icon className="size-6 text-primary-foreground" strokeWidth={2.2} />
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold tracking-wide text-primary transition-opacity duration-200",
                    active && !disabled ? "opacity-100" : "opacity-60"
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
              href={disabled ? "#" : item.href}
              onClick={(e) => handleClick(e, item)}
              className={cn(
                "relative flex flex-col items-center gap-1 min-w-[48px] transition-all duration-150",
                disabled ? "opacity-50" : "active:scale-90"
              )}
              aria-disabled={disabled}
            >
              <span
                className={cn(
                  "relative z-10 transition-transform duration-200",
                  active && !disabled && "-translate-y-0.5"
                )}
              >
                <Icon
                  className={cn(
                    "size-5 transition-colors duration-200",
                    active && !disabled ? "text-primary" : "text-muted-foreground"
                  )}
                  strokeWidth={active && !disabled ? 2.5 : 1.8}
                />
              </span>
              <span
                className={cn(
                  "relative z-10 text-xs tracking-wide leading-none transition-all duration-200",
                  active && !disabled
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