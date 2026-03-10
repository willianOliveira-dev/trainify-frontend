"use client";

import { useCallback, useState } from "react";
import { WorkoutSessionContext } from "../context/workout-session-context";

export function WorkoutSessionProvider({
  children,
  initialCompletedSetsCount,
  totalSetsInWorkout,
}: {
  children: React.ReactNode;
  initialCompletedSetsCount: number;
  totalSetsInWorkout: number;
}) {
  const [completedSetsCount, setCompletedSetsCount] = useState(
    initialCompletedSetsCount,
  );
  const [allCompletedCallback, setAllCompletedCallback] = useState<
    (() => void) | null
  >(null);

  const registerOnAllCompleted = useCallback((fn: () => void) => {
    setAllCompletedCallback(() => fn);
  }, []);

  const onAllCompleted = useCallback(() => {
    allCompletedCallback?.();
  }, [allCompletedCallback]);

  const incrementSets = useCallback(() => {
    setCompletedSetsCount((prev) => {
      const next = prev + 1;
      if (next >= totalSetsInWorkout) {
        setTimeout(() => allCompletedCallback?.(), 0);
      }
      return next;
    });
  }, [totalSetsInWorkout, allCompletedCallback]);

  const decrementSets = useCallback(() => {
    setCompletedSetsCount((prev) => Math.max(0, prev - 1));
  }, []);

  return (
    <WorkoutSessionContext.Provider
      value={{
        completedSetsCount,
        totalSetsInWorkout,
        incrementSets,
        decrementSets,
        onAllCompleted,
        registerOnAllCompleted,
      }}
    >
      {children}
    </WorkoutSessionContext.Provider>
  );
}
