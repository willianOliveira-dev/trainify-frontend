import { ConsistencyIndicators } from "@/components/consistency-indicators"
import { ErrorState } from "@/components/error-state"
import { NavigationBar } from "@/components/navigation-bar"
import { Button } from "@/components/ui/button"
import { WorkoutDayCard } from "@/components/workout-day/workout-day-card"
import { getHomeData } from "@/lib/api/fetch-generated"
import { authClient } from "@/lib/auth-client"
import dayjs from "dayjs"
import { Sparkles } from "lucide-react"; // ← Ícone para o botão
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Home() {
  const today = dayjs().format("YYYY-MM-DD")
  const response = await getHomeData(today)

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });
  
  if (response.status !== 200 || !session.data) {
    if (response.status === 401) {
      redirect("/auth")
    }
    return <>
        <ErrorState />
        <NavigationBar />
      </>
  }

  const { todayWorkoutDay, workoutStreak, consistencyByDay } = response.data

  return (
    <div className="flex min-h-screen w-full max-w-md mx-auto flex-col bg-background text-foreground pb-24">
      <div className="relative h-72 w-full overflow-hidden rounded-b-3xl">
        <Image
          src="/home-banner.png"
          alt="Home Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-tr from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <Image
            src="/logo.png"
            alt="Trainify Logo"
            width={95}
            height={50}
            className="object-contain"
          />
          
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="font-tight text-2xl font-semibold leading-tight text-white">
                Olá, {session.data.user.name}
              </h1>
              <p className="font-tight text-sm text-white/70">
                Bora treinar hoje?
              </p>
            </div>
            <Link href="/ia-trainify" passHref>
              <Button 
                className="h-9 cursor-pointer rounded-full bg-primary px-6 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Bora!
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-6 px-5 py-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-tight text-lg font-semibold">Consistência</h2>
            <Button variant="link" className="h-auto p-0 text-xs font-normal text-primary">
              Ver histórico
            </Button>
          </div>
          <ConsistencyIndicators 
            streak={workoutStreak} 
            consistencyByDay={consistencyByDay} 
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-tight text-lg font-semibold">Treino de Hoje</h2>
            <Button variant="link" className="h-auto p-0 text-xs font-normal text-primary">
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
            <div className="flex flex-col h-32 items-center justify-center rounded-xl bg-muted text-muted-foreground gap-3">
              <p>Nenhum treino planejado para hoje.</p>
                <Button asChild size="sm" className="gap-2">
                  <Link href="/ia-trainify" passHref>
                      <Sparkles className="size-4" />
                      Criar com IA
                  </Link>
                </Button>
            </div>
          )}
        </div>
      </main>

      <NavigationBar/>
    </div>
  )
}