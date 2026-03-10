"use server";

import { completeSet as completeSetApi } from "@/lib/api/fetch-generated";

export async function completeSet(
    planId: string,
    dayId: string,
    sessionId: string,
    exerciseId: string,
    setNumber: number,
    totalSetsInWorkout: number,
) {
    return await completeSetApi(planId, dayId, sessionId, exerciseId, {
        setNumber,
        totalSetsInWorkout,
    });
}