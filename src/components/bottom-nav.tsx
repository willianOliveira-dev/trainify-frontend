"use client";

import { cn } from "@/lib/utils";
import { Calendar, ChartNoAxesColumn, House, UserRound } from "lucide-react";
import Link from "next/link";
import { ChatOpenButton } from "./chat-open-button";
import { Button } from "./ui/button";
import { Suspense } from "react";

interface BottomNavProps {
  activePage?: "home" | "calendar" | "stats" | "profile";
  calendarHref: string | null;
}

export function BottomNav({ activePage = "home", calendarHref }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 py-4">
      <Link href="/" className="p-3">
        <House
          className={cn(
            "size-6",
            activePage === "home" ? "text-foreground" : "text-muted-foreground",
          )}
        />
      </Link>

      {calendarHref ? (
        <Link href={calendarHref} className="p-3">
          <Calendar
            className={cn(
              "size-6",
              activePage === "calendar"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          />
        </Link>
      ) : (
        <span className="p-3 opacity-50 cursor-not-allowed">
          <Calendar className="size-6 text-muted-foreground" />
        </span>
      )}

      <Suspense fallback={<div className="size-14 animate-pulse bg-muted rounded-full" />}>
        <ChatOpenButton />
      </Suspense>

      <Link href="/stats" className="p-3">
        <ChartNoAxesColumn
          className={cn(
            "size-6",
            activePage === "stats"
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        />
      </Link>

      <Link href="/profile" className="p-3">
        <UserRound
          className={cn(
            "size-6",
            activePage === "profile"
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        />
      </Link>
    </nav>
  );
}