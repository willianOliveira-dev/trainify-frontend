import { NavigationBar } from "@/components/navigation-bar";
import { ConsistencyHeatmap } from "@/components/stats/consistency-heatmap";
import { StatCard } from "@/components/stats/stat-card";
import { getHomeData, getMe, getStatsData } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session?.data) {
    redirect("/auth");
  }

  const today = dayjs();
  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.endOf("month").format("YYYY-MM-DD");

  const [statsResponse, homeData, trainData] = await Promise.all([
    getStatsData({ from, to }),
    getHomeData(today.format("YYYY-MM-DD")),
    getMe(),
  ]);

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect("/onboarding");

  if (statsResponse.status !== 200) {
    throw new Error("Failed to fetch stats");
  }

  const {
    workoutStreak,
    consistencyByDay,
    completedWorkoutsCount,
    conclusionRate,
    totalTimeInSeconds,
  } = statsResponse.data;

  const formattedConclusionRate = `${Math.round(conclusionRate * 100)}%`;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h${minutes}m`;
  };

  const isStreakZero = workoutStreak === 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:ml-64">
      <header className="flex h-14 items-center px-5 py-2.5 shrink-0 md:hidden">
        <Image
          src="/logo.png"
          alt="Trainify Logo"
          width={95}
          height={50}
          className="object-contain"
          priority
        />
      </header>

      <main
        className={cn(
          "flex flex-col gap-6 px-5 py-4 pb-28",
          "md:grid md:grid-cols-2 md:gap-8 md:px-8 md:py-8 md:pb-8 md:items-start",
          "lg:max-w-5xl lg:px-10",
        )}
      >
        <div className="flex flex-col gap-6">
          <div
            className={cn(
              "relative overflow-hidden rounded-xl h-48 p-10 flex flex-col items-center justify-center text-center",
              !isStreakZero ? "bg-primary" : "bg-card border border-border",
            )}
          >
            <Image
              src={
                isStreakZero
                  ? "/stats-banner-empty.png"
                  : "/stats-banner-active.png"
              }
              alt="Streak Banner"
              fill
              className="object-cover transition-opacity duration-500"
              priority
            />

            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="bg-white/10 border border-white/10 backdrop-blur-md p-3 rounded-full size-14 flex items-center justify-center">
                <Image
                  src={isStreakZero ? "/flame-white.svg" : "/flame-orange.svg"}
                  alt="Streak"
                  width={32}
                  height={32}
                  className="size-8"
                />
              </div>
              <div className="flex flex-col gap-1 items-center justify-center text-white">
                <p className="font-tight text-5xl font-semibold leading-none">
                  {workoutStreak} {workoutStreak === 1 ? "dia" : "dias"}
                </p>
                <p className="font-tight text-base opacity-60">
                  Sequência Atual
                </p>
              </div>
            </div>
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="font-tight text-lg font-semibold md:text-xl">
              Consistência
            </h2>
            <ConsistencyHeatmap consistencyByDay={consistencyByDay} />
          </section>
        </div>

        <section className="grid grid-cols-2 gap-3 md:content-start">
          <div className="col-span-2 hidden md:block">
            <h2 className="font-tight text-lg font-semibold md:text-xl">
              Resumo
            </h2>
          </div>
          <StatCard
            label="Treinos Feitos"
            value={completedWorkoutsCount}
            iconSrc="/circle-check.svg"
          />
          <StatCard
            label="Taxa de conclusão"
            value={formattedConclusionRate}
            iconSrc="/circle-percent.svg"
          />
          <StatCard
            label="Tempo Total"
            value={formatDuration(totalTimeInSeconds)}
            iconSrc="/hourglass.svg"
            className="col-span-2"
          />
        </section>
      </main>

      <NavigationBar activePage="stats" />
    </div>
  );
}
