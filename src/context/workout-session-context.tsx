import { createContext } from "react";

interface WorkoutSessionContextValue {
  completedSetsCount: number;
  totalSetsInWorkout: number;
  incrementSets: () => void;
  decrementSets: () => void;
  onAllCompleted: () => void;
  registerOnAllCompleted: (fn: () => void) => void;
}

export const WorkoutSessionContext =
  createContext<WorkoutSessionContextValue | null>(null);
