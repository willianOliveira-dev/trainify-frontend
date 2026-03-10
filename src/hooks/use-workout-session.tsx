import { useContext } from "react";
import { WorkoutSessionContext } from "../context/workout-session-context";

export function useWorkoutSession() {
  const ctx = useContext(WorkoutSessionContext);
  if (!ctx)
    throw new Error(
      "useWorkoutSession must be used within WorkoutSessionProvider",
    );
  return ctx;
}
