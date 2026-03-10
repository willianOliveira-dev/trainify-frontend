import { Badge } from "@/components/ui/badge";
import { WEEK_DAY_MAP } from "@/constants/week-day-map.constant";
import { cn } from "@/lib/utils";
import { Calendar, Dumbbell, Timer, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WorkoutDayItemProps {
  planId: string;
  id: string;
  name: string;
  weekDay: string;
  isRest: boolean;
  durationInSeconds?: number;
  exercisesCount?: number;
  coverImageUrl?: string;
}

export function WorkoutDayItem({
  planId,
  id,
  name,
  weekDay,
  isRest,
  durationInSeconds = 0,
  exercisesCount = 0,
  coverImageUrl,
}: WorkoutDayItemProps) {
  const durationInMinutes = Math.floor(durationInSeconds / 60);
  const weekDayLabel =
    WEEK_DAY_MAP[weekDay as keyof typeof WEEK_DAY_MAP] || weekDay;

  if (isRest) {
    return (
      <div
        className={cn(
          "flex flex-col h-28 md:h-50 items-start justify-between p-5 relative rounded-xl shrink-0 w-full overflow-hidden",
          !coverImageUrl && "bg-muted",
        )}
      >
        {coverImageUrl && (
          <Image src={coverImageUrl} alt={name} fill className="object-cover" />
        )}
        <div
          className="absolute inset-0 bg-black/30"
          style={{ display: coverImageUrl ? "block" : "none" }}
        />
        <div className="flex items-center justify-center relative shrink-0 z-10">
          <Badge
            variant="secondary"
            className={cn(
              "border-none gap-1 uppercase font-semibold text-[10px] px-2.5 py-1.5 h-auto",
              coverImageUrl
                ? "bg-white/10 backdrop-blur-md text-white"
                : "bg-black/5 text-black",
            )}
          >
            <Calendar className="size-3.5" />
            {weekDayLabel}
          </Badge>
        </div>
        <div className="flex gap-2 items-center justify-center relative shrink-0 z-10">
          <div className="relative shrink-0 size-5 text-primary">
            <Zap
              className={cn(
                "size-5",
                coverImageUrl ? "fill-white" : "fill-primary",
              )}
            />
          </div>
          <h3
            className={cn(
              "font-tight text-2xl font-semibold leading-none",
              coverImageUrl ? "text-white" : "text-foreground",
            )}
          >
            {name}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/workout-plans/${planId}/days/${id}`}
      className="group relative h-50 w-full overflow-hidden rounded-xl bg-black block"
    >
      <Image
        src={coverImageUrl || "/workout-placeholder.png"}
        alt={name}
        fill
        className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex justify-start">
          <Badge
            variant="secondary"
            className="bg-white/10 backdrop-blur-md text-white border-none gap-1 uppercase font-semibold text-[10px] px-2.5 py-1.5 h-auto"
          >
            <Calendar className="size-3.5" />
            {weekDayLabel}
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-white leading-tight">
            {name}
          </h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <Timer className="size-3.5" />
              {durationInMinutes}min
            </div>
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <Dumbbell className="size-3.5" />
              {exercisesCount} exercícios
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}