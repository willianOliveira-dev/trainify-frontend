"use server";

import { revalidatePath } from "next/cache";
import { startSession } from "@/lib/api/fetch-generated";

export async function startWorkoutSession(planId: string, dayId: string) {
  const result = await startSession(planId, dayId);
  revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
  return result
}

