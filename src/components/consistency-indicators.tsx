import { cn } from "@/lib/utils";
import Image from "next/image";

interface ConsistencyIndicatorsProps {
  streak: number;
  consistencyByDay: Record<
    string,
    { workoutDayCompleted: boolean; workoutDayStarted: boolean }
  >;
}

export function ConsistencyIndicators({
  streak,
  consistencyByDay,
}: ConsistencyIndicatorsProps) {
  const daysOfWeek = ["D", "S", "T", "Q", "Q", "S", "S"];

  const sortedDates = Object.keys(consistencyByDay).sort();

  return (
    <div className="flex gap-3 w-full items-center justify-center">
      <div className="flex flex-1 items-center justify-between border border-border p-5 rounded-xl">
        {daysOfWeek.map((day, index) => {
          const date = sortedDates[index];
          const data = date ? consistencyByDay[date] : null;

          let bgColor = "bg-white border border-border";
          if (data?.workoutDayCompleted) {
            bgColor = "bg-primary border-primary";
          } else if (data?.workoutDayStarted) {
            bgColor = "bg-[#d5dffe] border-[#d5dffe]";
          }

          return (
            <div
              key={date || `empty-${index}`}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={cn("size-5 rounded-md transition-colors", bgColor)}
              />
              <span className="text-xs text-muted-foreground font-medium">
                {day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center self-stretch justify-center px-5 py-2 bg-[rgba(240,97,0,0.08)] rounded-xl gap-2">
        <div className="flex items-center gap-2">
          <Image
            src="/flame.svg"
            alt="Flame"
            width={16}
            height={20}
            className="shrink-0"
          />
          <span className="text-lg font-bold text-black">{streak}</span>
        </div>
      </div>
    </div>
  );
}
