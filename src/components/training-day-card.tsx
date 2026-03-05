import { Badge } from "@/components/ui/badge";
import { Calendar, Dumbbell, Timer } from "lucide-react";
import Image from "next/image";
import { WEEK_DAY_MAP } from "@/constants/week-day-map.constant";


interface TrainingDayCardProps {
  name: string;
  durationInSeconds: number;
  exercisesCount: number;
  weekDay: keyof typeof WEEK_DAY_MAP;
  coverImageUrl?: string;
  isRest?: boolean;
}

export function TrainingDayCard({
  name,
  durationInSeconds,
  exercisesCount,
  weekDay,
  coverImageUrl,
  isRest = false,
}: TrainingDayCardProps) {
  const durationInMinutes = Math.floor(durationInSeconds / 60);

  if (isRest) {
    return (
      <div className="relative h-[200px] w-full overflow-hidden rounded-xl bg-muted flex items-center justify-center border border-border">
         <p className="text-muted-foreground font-semibold">Dia de Descanso</p>
      </div>
    );
  }

  return (
    <div className="group relative h-[200px] w-full overflow-hidden rounded-xl bg-black">
      <Image
        src={coverImageUrl || "/workout-placeholder.png"}
        alt={name}
        fill
        className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex justify-center">
          <Badge variant="secondary" className="bg-white/10 backdrop-blur-md text-white border-none gap-1 uppercase font-semibold text-[10px] px-2 py-1">
            <Calendar className="size-3" />
            {WEEK_DAY_MAP[weekDay]}
          </Badge>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-white leading-tight">
            {name}
          </h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <Timer className="size-3" />
              {durationInMinutes}min
            </div>
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <Dumbbell className="size-3" />
              {exercisesCount} exercícios
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
