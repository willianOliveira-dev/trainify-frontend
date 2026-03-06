import { NavigationBar } from "@/components/navigation-bar";
import { Badge } from "@/components/ui/badge";
import { ExerciseItem } from "@/components/workout-day/exercise-item";
import { WorkoutActions } from "@/components/workout-day/workout-actions";
import { WorkoutDetailsHeader } from "@/components/workout-day/workout-details-header";
import { WEEK_DAY_MAP } from "@/constants/week-day-map.constant";
import { getWorkoutPlanDayDetailsData } from "@/lib/api/fetch-generated";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Calendar, Dumbbell, Timer } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

dayjs.extend(utc);

interface PageProps {
  params: Promise<{
    planId: string;
    dayId: string;
  }>;
}

export default async function WorkoutDayDetailsPage({ params }: PageProps) {
  const { planId, dayId } = await params;

  const response = await getWorkoutPlanDayDetailsData(planId, dayId);

  if (response.status !== 200) {
    redirect("/");
  }

  const {
    name,
    coverImageUrl,
    estimatedDurationInSeconds,
    weekDay,
    exercises,
    sessions,
  } = response.data;

  const today = dayjs.utc().startOf('day');
  const todaySessions = sessions.filter(session => {
    if (!session.startedAt) return false;
    const sessionDate = dayjs.utc(session.startedAt).startOf('day');
    return sessionDate.isSame(today);
  });

  const activeSession = todaySessions.find((s) => !s.completedAt);
  const isCompleted = todaySessions.some((s) => s.completedAt);
  const durationInMinutes = Math.floor(estimatedDurationInSeconds / 60);
  
  return (
    <div className="flex min-h-screen w-full max-w-md mx-auto flex-col bg-background text-foreground pb-25">
      <WorkoutDetailsHeader title={WEEK_DAY_MAP[weekDay].split("-")[0]} />

      <main className="flex flex-col gap-6 px-5 py-4">
        <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-black shadow-lg">
          <Image
            src={coverImageUrl || "/workout-placeholder.png"}
            alt={name}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div className="flex">
              <Badge variant="secondary" className="bg-white/10 backdrop-blur-md text-white border-none gap-1 uppercase font-semibold text-[10px] px-2.5 py-1">
                <Calendar className="size-3" />
                {WEEK_DAY_MAP[weekDay]}
              </Badge>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-tight text-3xl font-bold text-white leading-tight">
                {name}
              </h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium">
                  <Timer className="size-3.5" />
                  {durationInMinutes}min
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium">
                  <Dumbbell className="size-3.5" />
                  {exercises.length} exercícios
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              name={exercise.name}
              series={exercise.sets}
              reps={exercise.reps}
              restTimeInSeconds={exercise.restTimeInSeconds}
            />
          ))}
        </div>

        <WorkoutActions
          planId={planId}
          dayId={dayId}
          activeSessionId={activeSession?.id}
          isCompleted={isCompleted}
        />
      </main>

      <NavigationBar/>
    </div>
  );
}