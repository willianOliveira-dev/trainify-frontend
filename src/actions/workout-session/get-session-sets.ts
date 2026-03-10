"use server";

import { getSessionSets as getSessionSetsApi } from "@/lib/api/fetch-generated";

export async function getSessionSets(planId: string, dayId: string, sessionId: string) {
    const result = await getSessionSetsApi(planId, dayId, sessionId);
    return result;
}