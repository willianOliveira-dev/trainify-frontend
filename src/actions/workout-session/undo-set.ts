'use server';

import { undoSet as undoSetApi } from '@/lib/api/fetch-generated';
import { revalidatePath } from 'next/cache';

export async function undoSet(
    planId: string,
    dayId: string,
    sessionId: string,
    exerciseId: string,
    setNumber: number,
) {
    await undoSetApi(planId, dayId, sessionId, exerciseId, { setNumber });
    revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
}
