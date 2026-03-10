'use server';

import { completeSet as completeSetApi } from '@/lib/api/fetch-generated';
import { revalidatePath } from 'next/cache';

export async function completeSet(
    planId: string,
    dayId: string,
    sessionId: string,
    exerciseId: string,
    setNumber: number,
    totalSetsInWorkout: number,
) {
    const result = await completeSetApi(planId, dayId, sessionId, exerciseId, {
        setNumber,
        totalSetsInWorkout,
    });
    revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
    return result;
}
