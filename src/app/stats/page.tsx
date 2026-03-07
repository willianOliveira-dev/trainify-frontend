import { NavigationBar } from "@/components/navigation-bar";
import { ConsistencyHeatmap } from "@/components/stats/consistency-heatmap";
import { StatCard } from "@/components/stats/stat-card";
import { getStatsData } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data) {
    redirect("/auth");
  }

  const to = dayjs().format("YYYY-MM-DD");
  const from = dayjs().subtract(2, "month").startOf("month").format("YYYY-MM-DD");

  const response = await getStatsData({ from, to });

  if (response.status === 401) {
    redirect("/auth");
  }

  if (response.status !== 200) {
    return (
      <div className="flex min-h-screen items-center justify-center p-5 text-center">
        <p className="text-muted-foreground">Ocorreu um erro ao carregar as estatísticas.</p>
      </div>
    );
  }

  const {
    workoutStreak,
    consistencyByDay,
    completedWorkoutsCount,
    conclusionRate,
    totalTimeInSeconds,
  } = response.data;

  const formattedConclusionRate = `${Math.round(conclusionRate * 100)}%`;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h${minutes}m`;
  };


  const isStreakZero = workoutStreak === 0;

  return (
    <div className="flex min-h-screen w-full max-w-md mx-auto flex-col bg-background text-foreground pb-24">
      <header className="flex h-14 items-center px-5 py-2.5 shrink-0">
        <Image src="/logo.png" alt="Trainify Logo" width={95} height={50} className="object-contain" priority />
      </header>

      <main className="flex flex-col gap-6 px-5 py-4">
        
        <div className={cn(
          "relative overflow-hidden rounded-xl h-48 p-10 flex flex-col items-center justify-center text-center",
          !isStreakZero ? "bg-primary" : "bg-card border border-border"
        )}>
          <Image
            src={isStreakZero ? "/stats-banner-empty.png" : "/stats-banner-active.png"}
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
          <h2 className="font-tight text-lg font-semibold">Consistência</h2>
          <ConsistencyHeatmap consistencyByDay={consistencyByDay} />
        </section>

        <section className="grid grid-cols-2 gap-3">
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

      <NavigationBar />
    </div>
  );
}
