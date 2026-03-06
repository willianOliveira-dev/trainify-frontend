import { NavigationBar } from "@/components/navigation-bar";
import { Badge } from "@/components/ui/badge";
import { WorkoutDayItem } from "@/components/workout-plan/workout-day-item";
import { getWorkoutPlanDetailsdData } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/auth-client";
import { Target } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{
    planId: string;
  }>;
}

export default async function WorkoutPlanDetailsPage({ params }: PageProps) {
  const { planId } = await params;
  
  const session = await authClient.getSession({
    fetchOptions: {
    headers: await headers()
  }});
  
  if (!session) {
    toast.error("Usuário não autenticado")
    redirect("/auth");
  }

  const response = await getWorkoutPlanDetailsdData(planId);

  if (response.status !== 200) {
    return (
      <div className="flex min-h-screen items-center justify-center p-5 text-center">
        <p className="text-muted-foreground">Plano de treino não encontrado.</p>
      </div>
    );
  }

  const { name, workoutDays } = response.data;
    

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
          style={{ backgroundImage: "linear-gradient(238.089deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)" }} 
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
              <Badge className="bg-[#8585f9] hover:bg-[#8585f9]/90 text-white border-none gap-1.5 uppercase font-semibold text-[12px] px-3 py-1.5 rounded-full h-auto">
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
        {workoutDays.map((day) => (
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

      <NavigationBar/>
    </div>
  );
}
