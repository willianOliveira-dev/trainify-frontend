"use client";

import { completeWorkoutSession } from "@/actions/workout-session/complete-workout-session";
import { startWorkoutSession } from "@/actions/workout-session/start-workout-session";
import { Button } from "@/components/ui/button";
import { WEEK_DAY_INDEX } from "@/constants/week-day-index.constant";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SuccessDialog } from "../success-dialog";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');


interface WorkoutActionsProps {
  planId: string;
  dayId: string;
  activeSessionId?: string;
  isCompleted?: boolean;
  weekDay: string;
}

export function WorkoutActions({
  planId,
  dayId,
  activeSessionId,
  isCompleted,
  weekDay,
}: WorkoutActionsProps) {
  const router = useRouter();
  const { completedSetsCount, totalSetsInWorkout, registerOnAllCompleted } =
    useWorkoutSession();
  const [isStartLoading, setIsStartLoading] = useState(false);
  const [isCompleteLoading, setIsCompleteLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localActiveSessionId, setLocalActiveSessionId] = useState<
    string | undefined
  >(activeSessionId);
  const completingRef = useRef(false);

  useEffect(() => {
    setLocalActiveSessionId(activeSessionId);
  }, [activeSessionId]);

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 10000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  useEffect(() => {
    if (!localActiveSessionId) return;

    registerOnAllCompleted(async () => {
      if (completingRef.current) return;
      completingRef.current = true;
      try {
        await completeWorkoutSession(planId, dayId, localActiveSessionId);
        setShowSuccess(true);
        setLocalActiveSessionId(undefined);
        router.refresh();
      } finally {
        completingRef.current = false;
      }
    });
  }, [localActiveSessionId, planId, dayId, registerOnAllCompleted, router]);

  const allSetsCompleted =
    totalSetsInWorkout > 0 && completedSetsCount >= totalSetsInWorkout;

  const handleStart = async () => {
    setIsStartLoading(true);
    try {
      const result = await startWorkoutSession(planId, dayId);
      if (result.status === 201) setLocalActiveSessionId(result.data.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to start session:", error);
      setIsStartLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!localActiveSessionId || completingRef.current) return;
    completingRef.current = true;
    setIsCompleteLoading(true);
    try {
      await completeWorkoutSession(planId, dayId, localActiveSessionId);
      setShowSuccess(true);
      setLocalActiveSessionId(undefined);
      router.refresh();
    } catch (error) {
      console.error("Failed to complete session:", error);
    } finally {
      setIsCompleteLoading(false);
      completingRef.current = false;
    }
  };

  const isTodaysWorkout = WEEK_DAY_INDEX[weekDay] === new Date().getDay();

  return (
    <>
      <AnimatePresence>
        {showSuccess && (
          <SuccessDialog
            isOpen={showSuccess}
            onClose={() => setShowSuccess(false)}
            autoCloseDelayMs={10000}
            title="Parabéns! 🎉"
            message="Treino concluído com sucesso. Continue assim!"
          />
        )}
      </AnimatePresence>

      <div className="px-5 flex flex-col gap-2 items-center z-40">
        {localActiveSessionId ? (
          <>
            {!allSetsCompleted && (
              <p className="text-xs text-muted-foreground">
                Complete todas as séries para concluir ({completedSetsCount}/
                {totalSetsInWorkout})
              </p>
            )}
            <Button
              onClick={handleComplete}
              disabled={isCompleteLoading || !allSetsCompleted}
              className="w-full h-12 rounded-full border border-muted bg-background text-foreground font-semibold hover:bg-muted transition-all shadow-sm disabled:opacity-40"
            >
              {isCompleteLoading ? "Concluindo..." : "Marcar como concluído"}
            </Button>
          </>
        ) : isCompleted ? (
          <Button
            variant="ghost"
            disabled
            className="w-full h-12 rounded-full border border-muted text-muted-foreground font-semibold"
          >
            Concluído
          </Button>
        ) : (
          <>
            <Button
              onClick={handleStart}
              disabled={isStartLoading || !isTodaysWorkout}
              className="w-full h-12 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-40"
            >
              {isStartLoading ? "Iniciando..." : "Iniciar Treino"}
            </Button>
            {!isTodaysWorkout && (
              <p className="text-xs text-muted-foreground text-center">
                Esse treino está programado para{" "}
                {dayjs(new Date(2024, 0, WEEK_DAY_INDEX[weekDay])).format('dddd')}
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
