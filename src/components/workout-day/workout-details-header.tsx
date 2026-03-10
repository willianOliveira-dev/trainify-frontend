"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface WorkoutDetailsHeaderProps {
  title: string;
}

export function WorkoutDetailsHeader({ title }: WorkoutDetailsHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background/80 px-5 backdrop-blur-md">
      <Button
        variant={"ghost"}
        onClick={() => router.back()}
        className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
      >
        <ChevronLeft className="size-6" />
      </Button>
      <h1 className="font-tight text-lg font-semibold text-foreground">
        {title}
      </h1>
      <div className="size-10" />
    </header>
  );
}
