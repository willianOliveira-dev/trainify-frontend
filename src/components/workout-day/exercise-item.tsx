"use client"
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Zap } from "lucide-react";

interface ExerciseItemProps {
  name: string;
  series: number;
  reps: number;
  restTimeInSeconds: number;
}

export function ExerciseItem({
  name,
  series,
  reps,
  restTimeInSeconds,
}: ExerciseItemProps) {
  return (
    <div className="flex h-24 items-center justify-between rounded-xl border border-muted p-5 bg-card">
      <div className="flex flex-col gap-3 justify-center h-full">
        <div className="flex items-center justify-between w-full min-w-[280px]">
          <h3 className="font-tight text-base font-semibold text-foreground">
            {name}
          </h3>
          <button className="text-muted-foreground hover:text-foreground transition-all">
            <HelpCircle className="size-5" />
          </button>
        </div>
        
        <div className="flex gap-1.5">
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-semibold text-[10px] uppercase h-[22px] px-2.5">
            {series} séries
          </Badge>
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-semibold text-[10px] uppercase h-[22px] px-2.5">
            {reps} reps
          </Badge>
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-semibold text-[10px] uppercase h-[22px] px-2.5 gap-1">
            <Zap className="size-3" />
            {restTimeInSeconds}S
          </Badge>
        </div>
      </div>
    </div>
  );
}
