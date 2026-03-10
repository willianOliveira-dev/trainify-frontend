import { ConsistencyIndicators } from "@/components/consistency-indicators";
import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { WorkoutDayCard } from "@/components/workout-day/workout-day-card";
import { getHomeData, getMe } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Sparkles } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();

  const [homeData, trainData] = await Promise.all([
    getHomeData(today.format("YYYY-MM-DD")),
    getMe(),
  ]);

  if (homeData.status !== 200) {
    throw new Error("Failed to fetch home data");
  }

  const needsOnboarding =
    !homeData.data.activeWorkoutPlanId ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect("/onboarding");

  const { todayWorkoutDay, workoutStreak, consistencyByDay } = homeData.data;
  const userName = session.data.user.name?.split(" ")[0] ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:ml-64">
      <div className="relative h-72 w-full overflow-hidden md:h-80 md:rounded-b-3xl lg:h-96">
        <Image
          src="/home-banner.png"
          alt="Home Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-tr from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-8">
          <Image
            src="/logo.png"
            alt="Trainify Logo"
            width={95}
            height={50}
            className="object-contain md:hidden"
          />

          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="font-tight text-2xl font-semibold leading-tight text-white md:text-3xl lg:text-4xl">
                Olá, {userName}
              </h1>
              <p className="font-tight text-sm text-white/70 md:text-base">
                Bora treinar hoje?
              </p>
            </div>
            <Link href={`/workout-plans/${homeData.data.activeWorkoutPlanId}`}>
              <Button className="h-9 cursor-pointer rounded-full bg-primary px-6 text-sm font-semibold text-white hover:bg-primary/90 md:h-10 md:px-8">
                Bora!
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main
        className={cn(
          "flex flex-col gap-6 px-5 py-6 pb-28",

          "md:grid md:grid-cols-2 md:gap-8 md:px-8 md:py-8 md:pb-8",

          "lg:w-full lg:px-10",
        )}
      >
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-tight text-lg font-semibold md:text-xl">
              Consistência
            </h2>
            <Button
              variant="link"
              className="h-auto p-0 text-xs font-normal text-primary"
            >
              Ver histórico
            </Button>
          </div>
          <ConsistencyIndicators
            streak={workoutStreak}
            consistencyByDay={consistencyByDay ?? {}}
          />
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-tight text-lg font-semibold md:text-xl">
              Treino de Hoje
            </h2>
            <Button
              variant="link"
              className="h-auto p-0 text-xs font-normal text-primary"
            >
              Ver treinos
            </Button>
          </div>

          {todayWorkoutDay ? (
            <WorkoutDayCard
              planId={todayWorkoutDay.workoutPlanId}
              dayId={todayWorkoutDay.id}
              name={todayWorkoutDay.name}
              durationInSeconds={todayWorkoutDay.estimatedDurationInSeconds}
              exercisesCount={todayWorkoutDay.exercisesCount}
              weekDay={todayWorkoutDay.weekDay}
              coverImageUrl={todayWorkoutDay.coverImageUrl}
              isRest={todayWorkoutDay.isRest}
            />
          ) : (
            <div className="flex h-32 flex-col items-center justify-center gap-3 rounded-xl bg-muted text-muted-foreground">
              <p>Nenhum treino planejado para hoje.</p>
              <Button asChild size="sm" className="gap-2">
                <Link href="/ia-trainify" passHref>
                  <Sparkles className="size-4" />
                  Criar com IA
                </Link>
              </Button>
            </div>
          )}
        </section>
      </main>

      <NavigationBar activePage="home" />
    </div>
  );
}
