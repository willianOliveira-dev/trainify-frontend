"use client";

import { Sparkles } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { Button } from "./ui/button";

export function ChatOpenButton() {
  const [, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  return (
    <Button
      onClick={() => setChatParams({ chat_open: true })}
      size="icon"
      className="size-14 aspect-square rounded-full
        shadow-[0_0_0_4px_hsl(var(--primary)/0.15),0_8px_32px_hsl(var(--primary)/0.35)]
        hover:shadow-[0_0_0_6px_hsl(var(--primary)/0.2),0_12px_40px_hsl(var(--primary)/0.45)]
        transition-all duration-300 ease-out
        hover:scale-110 active:scale-95"
      aria-label="Abrir chat"
    >
      <Sparkles className="size-5" />
    </Button>
  );
}