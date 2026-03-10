import { NavigationBar } from "@/components/navigation-bar";
import { Badge } from "@/components/ui/badge";
import { WorkoutDayItem } from "@/components/workout-plan/workout-day-item";
import { WEEKDAY_ORDER } from "@/constants/week-order.constant";
import {
  getHomeData,
  getMe,
  getWorkoutPlanDetailsdData,
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/auth-client";
import dayjs from "dayjs";
import { Target } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    planId: string;
  }>;
}

export default async function WorkoutPlanDetailsPage({ params }: PageProps) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { planId } = await params;
  const [workoutPlanData, homeData, trainData] = await Promise.all([
    getWorkoutPlanDetailsdData(planId),
    getHomeData(dayjs().format("YYYY-MM-DD")),
    getMe(),
  ]);

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect("/onboarding");

  if (workoutPlanData.status !== 200) redirect("/");

  const { name, workoutDays } = workoutPlanData.data;

  const sortedDays = [...workoutDays].sort(
    (a, b) =>
      WEEKDAY_ORDER.indexOf(a.weekDay) - WEEKDAY_ORDER.indexOf(b.weekDay),
  );

  return (
    <div className="flex min-h-screen w-full max-w-md mx-auto flex-col bg-background text-foreground pb-24">
      <div className="relative h-[296px] w-full overflow-hidden rounded-b-3xl shrink-0">
        <Image
          src="/plan-details-banner.png"
          alt="Plan Banner"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(238.089deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-between p-5 pt-10">
          <Image
            src="/logo.png"
            alt="Trainify Logo"
            width={95}
            height={50}
            className="object-contain"
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <Badge className="bg-primary hover:bg-primary/90 text-white border-none gap-1.5 uppercase font-semibold text-[12px] px-3 py-1.5 rounded-full h-auto">
                <Target className="size-4" />
                {name}
              </Badge>
            </div>
            <h1 className="font-tight text-white text-[24px] font-semibold leading-[1.05]">
              Plano de Treino
            </h1>
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-3 px-5 py-6">
        {sortedDays.map((day) => (
          <WorkoutDayItem
            key={day.id}
            id={day.id}
            planId={planId}
            name={day.name}
            weekDay={day.weekDay}
            isRest={day.isRest}
            durationInSeconds={day.estimatedDurationInSeconds}
            exercisesCount={day.exercisesCount}
            coverImageUrl={day.coverImageUrl}
          />
        ))}
      </main>

      <NavigationBar activePage="calendar" />
    </div>
  );
}
