"use client";

import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useMemo } from "react";

dayjs.locale("pt-br");

interface ConsistencyHeatmapProps {
  consistencyByDay: Record<string, { workoutDayCompleted: boolean; workoutDayStarted: boolean }>;
}

export function ConsistencyHeatmap({ consistencyByDay }: ConsistencyHeatmapProps) {
  const months = useMemo(() => {
    const now = dayjs();
    const currentMonth = now.startOf("month");
    const prev1Month = currentMonth.subtract(1, "month");
    const prev2Month = currentMonth.subtract(2, "month");

    return [prev2Month, prev1Month, currentMonth];
  }, []);

  const getWeekStatus = (date: dayjs.Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    const data = consistencyByDay[dateStr];
    
    if (!data) return "none";
    if (data.workoutDayCompleted) return "completed";
    if (data.workoutDayStarted) return "started";
    return "none";
  };

  const getMonthWeeks = (monthDate: dayjs.Dayjs) => {
    const weeks: dayjs.Dayjs[][] = [];
    const firstDayOfMonth = monthDate.startOf("month");
    const lastDayOfMonth = monthDate.endOf("month");
    let currentDay = firstDayOfMonth.startOf("week").add(1, "day");
    if (currentDay.day() !== 1) {
       currentDay = firstDayOfMonth.day(1);
       if (currentDay.isAfter(firstDayOfMonth)) {
         currentDay = currentDay.subtract(7, "days");
       }
    }
    
    let tempDay = firstDayOfMonth;
    const monthWeeks: dayjs.Dayjs[][] = [];
    
    while (tempDay.isBefore(lastDayOfMonth) || tempDay.isSame(lastDayOfMonth, "day")) {
      const monday = tempDay.startOf("week").add(1, "day");
      const lastWeekMonday = monthWeeks[monthWeeks.length - 1]?.[0];
      if (!lastWeekMonday || !monday.isSame(lastWeekMonday, "day")) {
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
          weekDays.push(monday.add(i, "day"));
        }
        monthWeeks.push(weekDays);
      }
      tempDay = tempDay.add(1, "day");
    }
    
    return monthWeeks;
  };

  return (
    <div className="border border-border flex gap-1 p-5 rounded-xl w-full overflow-x-auto no-scrollbar">
      {months.map((month, mIdx) => {
        const weeks = getMonthWeeks(month);
        
        return (
          <div key={mIdx} className="flex flex-col gap-1.5 shrink-0">
            <span className="font-tight text-xs text-muted-foreground capitalize ml-1">
              {month.format("MMM")}
            </span>
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => {
                    const status = getWeekStatus(day);
                    
                    return (
                      <div
                        key={dIdx}
                        className={cn(
                          "size-5 rounded-md transition-colors",
                          status === "completed" && "bg-primary",
                          status === "started" && "bg-primary/20",
                          status === "none" && "border border-border"
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
