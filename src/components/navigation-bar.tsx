"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart2, Calendar, Home, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NavigationBarProps {
  activeTab?: "home" | "calendar" | "plans" | "stats" | "profile";
}

export function NavigationBar({ activeTab = "home" }: NavigationBarProps) {
  const [prevActive, setPrevActive] = useState(activeTab);
  const [ripple, setRipple] = useState<string | null>(null);

  useEffect(() => {
    if (prevActive !== activeTab) setPrevActive(activeTab);
  }, [activeTab]);

  const items = [
    { id: "home", icon: Home, label: "Home", href: "/" },
    { id: "calendar", icon: Calendar, label: "Calendário", href: "/calendar" },
    { id: "plans", icon: Sparkles, label: "IA Trainify", href: "/workout-plans", primary: true },
    { id: "stats", icon: BarChart2, label: "Evolução", href: "/stats" },
    { id: "profile", icon: User, label: "Perfil", href: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-xl mx-auto">
      <div className="absolute inset-0 rounded-t-3xl bg-background/80 backdrop-blur-xl border-t border-border" />
      <div className="relative flex items-end justify-between px-4 pt-3 pb-5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.primary) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="relative flex flex-col items-center gap-1 -mt-8 z-10"
                onTouchStart={() => setRipple(item.id)}
                onTouchEnd={() => setTimeout(() => setRipple(null), 600)}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary"
                  animate={
                    isActive
                      ? { scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }
                      : { scale: 1, opacity: 0 }
                  }
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 56, height: 56, top: 0, left: "50%", x: "-50%" }}
                />
                <motion.div
                  className="relative flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg overflow-hidden"
                  style={{ width: 56, height: 56 }}
                  whileTap={{ scale: 0.88 }}
                  animate={isActive ? { y: -4 } : { y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/20 to-transparent -skew-x-12"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />
                  <AnimatePresence>
                    {ripple === item.id && (
                      <motion.div
                        className="absolute rounded-full bg-primary-foreground/30"
                        initial={{ width: 0, height: 0, opacity: 1 }}
                        animate={{ width: 80, height: 80, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={isActive ? { rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="size-6 text-primary-foreground" strokeWidth={2.2} />
                  </motion.div>
                </motion.div>

                <motion.span
                  className="text-xs font-semibold tracking-wide text-primary"
                  animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className="relative flex flex-col items-center gap-1 min-w-[48px]"
              onTouchStart={() => setRipple(item.id)}
              onTouchEnd={() => setTimeout(() => setRipple(null), 400)}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeBlob"
                    className="absolute -inset-1 rounded-2xl"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
              </AnimatePresence>
              <motion.div
                className="relative z-10"
                whileTap={{ scale: 0.78 }}
                animate={isActive ? { y: -2 } : { y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <AnimatePresence>
                  {ripple === item.id && (
                    <motion.div
                      className="absolute rounded-full bg-primary/20"
                      initial={{ width: 0, height: 0, opacity: 1 }}
                      animate={{ width: 48, height: 48, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  animate={isActive ? { color: "var(--primary)" } : { color: "var(--muted-foreground)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon
                    className={cn("size-5 transition-none", isActive ? "text-primary" : "text-muted-foreground")}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </motion.div>
              </motion.div>

              {/* Label */}
              <motion.span
                className={cn(
                  "relative z-10 text-xs font-medium tracking-wide leading-none",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                animate={
                  isActive
                    ? { opacity: 1, y: 0, fontWeight: 600 }
                    : { opacity: 0.7, y: 1, fontWeight: 400 }
                }
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}