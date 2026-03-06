"use client";

import { completeWorkoutSession } from "@/actions/workout-session/complete-workout-session";
import { startWorkoutSession } from "@/actions/workout-session/start-workout-session";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SuccessDialog } from "../success-dialog";

interface WorkoutActionsProps {
  planId: string;
  dayId: string;
  activeSessionId?: string;
  isCompleted?: boolean;
}

export function WorkoutActions({
  planId,
  dayId,
  activeSessionId,
  isCompleted,
}: WorkoutActionsProps) {
  const router = useRouter();
  const [isStartLoading, setIsStartLoading] = useState(false);
  const [isCompleteLoading, setIsCompleteLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localActiveSessionId, setLocalActiveSessionId] = useState<string | undefined>(activeSessionId);

  useEffect(() => {
    setLocalActiveSessionId(activeSessionId);
  }, [activeSessionId]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleStart = async () => {
    setIsStartLoading(true);
    try {
      const result = await startWorkoutSession(planId, dayId);
  
      if (result.status === 201) {
        setLocalActiveSessionId(result.data.id);
      }
  
      router.refresh();
    } catch (error) {
      console.error("Failed to start session:", error);
      setIsStartLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!localActiveSessionId) return;
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
    }
  };

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

      <div className="px-5 flex flex-col gap-4 items-center z-40">
        {localActiveSessionId ? (
          <Button
            onClick={handleComplete}
            disabled={isCompleteLoading}
            className="w-full h-12 rounded-full border border-muted bg-background text-foreground font-semibold hover:bg-muted transition-all shadow-sm"
          >
            {isCompleteLoading ? "Concluindo..." : "Marcar como concluído"}
          </Button>
        ) : isCompleted ? (
          <Button
            variant="ghost"
            disabled
            className="w-full h-12 rounded-full border border-muted text-muted-foreground font-semibold"
          >
            Concluído
          </Button>
        ) : (
          <Button
            onClick={handleStart}
            disabled={isStartLoading}
            className="w-full h-12 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            {isStartLoading ? "Iniciando..." : "Iniciar Treino"}
          </Button>
        )}
      </div>
    </>
  );
}