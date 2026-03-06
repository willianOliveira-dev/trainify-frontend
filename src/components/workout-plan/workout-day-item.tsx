import { Badge } from "@/components/ui/badge";
import { WEEK_DAY_MAP } from "@/constants/week-day-map.constant";
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
  const weekDayLabel = WEEK_DAY_MAP[weekDay as keyof typeof WEEK_DAY_MAP] || weekDay;

  if (isRest) {
    return (
      <div className="bg-[#f1f1f1] flex flex-col h-[110px] items-start justify-between p-5 relative rounded-xl shrink-0 w-full overflow-hidden">
        <div className="flex items-center justify-center relative shrink-0">
          <Badge variant="secondary" className="bg-black/5 text-black border-none gap-1 uppercase font-semibold text-[10px] px-2.5 py-1.5 h-auto">
            <Calendar className="size-3.5" />
            {weekDayLabel}
          </Badge>
        </div>
        <div className="flex gap-2 items-center justify-center relative shrink-0">
          <div className="relative shrink-0 size-5 text-primary">
            <Zap className="size-5 fill-primary" />
          </div>
          <h3 className="font-tight text-2xl font-semibold text-black leading-none">
            {name}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <Link 
      href={`/workout-plans/${planId}/days/${id}`}
      className="group relative h-[200px] w-full overflow-hidden rounded-xl bg-black block"
    >
      <Image
        src={coverImageUrl || "/workout-placeholder.png"}
        alt={name}
        fill
        className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex justify-start">
          <Badge variant="secondary" className="bg-white/10 backdrop-blur-md text-white border-none gap-1 uppercase font-semibold text-[10px] px-2.5 py-1.5 h-auto">
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
