"use server"
import { updateSessionData } from "@/lib/api/fetch-generated";
import { revalidatePath } from "next/cache";

export async function completeWorkoutSession(
  planId: string,
  dayId: string,
  sessionId: string
) {
  await updateSessionData(planId, dayId, sessionId, {
    completedAt: new Date().toISOString(),
  });
  revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
}