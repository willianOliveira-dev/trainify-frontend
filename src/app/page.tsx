import { ConsistencyIndicators } from "@/components/consistency-indicators"
import { NavigationBar } from "@/components/navigation-bar"
import { TrainingDayCard } from "@/components/training-day-card"
import { Button } from "@/components/ui/button"
import { getHomeData } from "@/lib/api/fetch-generated"
import { getSession } from "@/lib/get-session"
import dayjs from "dayjs"
import Image from "next/image"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await getSession()
  const today = dayjs().format("YYYY-MM-DD")
  const response = await getHomeData(today)

  if (response.status !== 200 || !user) {
    if (response.status === 401) {
      redirect("/auth")
    }
    redirect('/auth')
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
                Olá, {user.name}
              </h1>
              <p className="font-tight text-sm text-white/70">
                Bora treinar hoje?
              </p>
            </div>
            <Button className="h-9 cursor-pointer rounded-full bg-primary px-6 text-sm font-semibold text-white hover:bg-primary/90">
              Bora!
            </Button>
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
            <TrainingDayCard
              name={todayWorkoutDay.name}
              durationInSeconds={todayWorkoutDay.estimatedDurationInSeconds}
              exercisesCount={todayWorkoutDay.exercisesCount}
              weekDay={todayWorkoutDay.weekDay}
              coverImageUrl={todayWorkoutDay.coverImageUrl}
              isRest={todayWorkoutDay.isRest}
            />
          ) : (
            <div className="flex h-32 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              Nenhum treino planejado para hoje.
            </div>
          )}
        </div>
      </main>

      <NavigationBar activeTab="home" />
    </div>
  )
}
