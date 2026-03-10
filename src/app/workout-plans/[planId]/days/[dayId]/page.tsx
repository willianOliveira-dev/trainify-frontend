import { getSessionSets } from "@/actions/workout-session/get-session-sets";
import { NavigationBar } from "@/components/navigation-bar";
import { Badge } from "@/components/ui/badge";
import { ExerciseItem } from "@/components/workout-day/exercise-item";
import { WorkoutActions } from "@/components/workout-day/workout-actions";
import { WorkoutDetailsHeader } from "@/components/workout-day/workout-details-header";
import { WEEK_DAY_MAP } from "@/constants/week-day-map.constant";
import {
  getHomeData,
  getMe,
  getWorkoutPlanDayDetailsData,
  type GetSessionSets200Item,
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { WorkoutSessionProvider } from "@/providers/workout-session-provider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Calendar, Dumbbell, Timer } from "lucide-react";
import { headers } from "next/headers";
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

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data) {
    redirect("/auth");
  }

  const [workoutDayData, homeData, trainData] = await Promise.all([
    getWorkoutPlanDayDetailsData(planId, dayId),
    getHomeData(dayjs().format("YYYY-MM-DD")),
    getMe(),
  ]);

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect("/onboarding");

  if (workoutDayData.status !== 200) redirect("/");

  const {
    name,
    weekDay,
    estimatedDurationInSeconds,
    exercises,
    sessions,
    coverImageUrl,
  } = workoutDayData.data;

  const activeSession = sessions.find((s) => !s.completedAt);
  const isCompleted = sessions.some((s) => s.completedAt);
  const totalSetsInWorkout = exercises.reduce((acc, e) => acc + e.sets, 0);

  const completedSetsData: GetSessionSets200Item[] = [];

  if (activeSession) {
    const sessionSets = await getSessionSets(planId, dayId, activeSession.id);
    if (sessionSets.status === 200) {
      completedSetsData.push(...sessionSets.data);
    }
  }

  const progressPercent =
    totalSetsInWorkout > 0
      ? Math.round((completedSetsData.length / totalSetsInWorkout) * 100)
      : 0;

  const durationInMinutes = Math.floor(estimatedDurationInSeconds / 60);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:ml-64">
      <WorkoutDetailsHeader title={WEEK_DAY_MAP[weekDay].split("-")[0]} />
      {activeSession && (
        <div className="flex flex-col gap-1.5 px-5 pt-3 md:px-8">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <main
        className={cn(
          "flex flex-col gap-6 px-5 py-4 pb-28",
          "md:grid md:grid-cols-[minmax(280px,340px)_1fr] md:gap-8 md:px-8 md:py-8 md:pb-8 md:items-start",
          "lg:w-full lg:px-10",
        )}
      >
        <div className="flex flex-col gap-4 md:sticky md:top-6">
          <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-black shadow-lg md:h-64">
            <Image
              src={coverImageUrl || "/workout-placeholder.png"}
              alt={name}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="flex">
                <Badge
                  variant="secondary"
                  className="bg-white/10 backdrop-blur-md text-white border-none gap-1 uppercase font-semibold text-[10px] px-2.5 py-1"
                >
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
        </div>

        <WorkoutSessionProvider
          initialCompletedSetsCount={completedSetsData.length}
          totalSetsInWorkout={totalSetsInWorkout}
        >
          <div className="flex flex-col gap-3">
            {exercises.map((exercise) => (
              <ExerciseItem
                key={exercise.id}
                name={exercise.name}
                series={exercise.sets}
                reps={exercise.reps}
                restTimeInSeconds={exercise.restTimeInSeconds}
                youtubeVideoId={exercise.youtubeVideoId}
                exerciseId={exercise.id}
                planId={planId}
                dayId={dayId}
                sessionId={activeSession?.id}
                initialCompletedSets={completedSetsData
                  .filter((s) => s.exerciseId === exercise.id)
                  .map((s) => s.setNumber)}
                totalSetsInWorkout={totalSetsInWorkout}
              />
            ))}
          </div>

          <WorkoutActions
            planId={planId}
            dayId={dayId}
            activeSessionId={activeSession?.id}
            isCompleted={isCompleted}
            weekDay={weekDay}
          />
        </WorkoutSessionProvider>
      </main>

      <NavigationBar />
    </div>
  );
}
