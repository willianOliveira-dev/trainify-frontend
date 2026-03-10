"use client";

import { completeSet } from "@/actions/workout-session/complete-set";
import { undoSet } from "@/actions/workout-session/undo-set";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle, Pause, PlayCircle, X, Zap } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState, useCallback, useRef } from "react";

interface ExerciseItemProps {
  name: string;
  series: number;
  reps: number;
  restTimeInSeconds: number;
  youtubeVideoId?: string | null;
  exerciseId: string;
  planId: string;
  dayId: string;
  sessionId?: string;
  initialCompletedSets?: number[];
  totalSetsInWorkout: number;
  onSetsChange?: (completedCount: number) => void;
}

interface TimerState {
  timeRemaining: number;
  isPaused: boolean;
}

const formatTime = (seconds: number): string => {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds > 0) {
      return `${minutes}min ${remainingSeconds}s`;
    }
    return `${minutes}min`;
  }
  return `${seconds}s`;
};

export function ExerciseItem({
  name,
  series,
  reps,
  restTimeInSeconds,
  youtubeVideoId,
  exerciseId,
  planId,
  dayId,
  sessionId,
  initialCompletedSets = [],
  totalSetsInWorkout,
  onSetsChange,
}: ExerciseItemProps) {
  const [completedSets, setCompletedSets] = useState<number[]>(initialCompletedSets);
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [, setIsChatOpen] = useQueryState("chat_open", parseAsBoolean.withDefault(false));
  const [, setInitialMessage] = useQueryState("chat_initial_message", parseAsString);

  useEffect(() => {
    onSetsChange?.(completedSets.length);
  }, [completedSets, onSetsChange]);

  const clearTimerInterval = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback((initialTime: number) => {
    clearTimerInterval();
    
    setTimerState({
      timeRemaining: initialTime,
      isPaused: false
    });

    timerIntervalRef.current = setInterval(() => {
      setTimerState((prev) => {
        if (!prev || prev.isPaused) return prev;
        
        const newTime = prev.timeRemaining - 1;
        
        if (newTime <= 0) {
          clearTimerInterval();
          return null;
        }
        
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);
  }, [clearTimerInterval]);

  useEffect(() => {
    return () => clearTimerInterval();
  }, [clearTimerInterval]);

  const handleSetClick = async (setNumber: number) => {
    if (!sessionId) return;

    const isCompleted = completedSets.includes(setNumber);

    if (isCompleted) {
      setCompletedSets((prev) => prev.filter((s) => s !== setNumber));
      await undoSet(planId, dayId, sessionId, exerciseId, setNumber);
      
      clearTimerInterval();
      setTimerState(null);
    } else {
      setCompletedSets((prev) => [...prev, setNumber]);
      
      if (completedSets.length + 1 < series) {
        startTimer(restTimeInSeconds);
      } else {
        clearTimerInterval();
        setTimerState(null);
      }
      
      await completeSet(
        planId,
        dayId,
        sessionId,
        exerciseId,
        setNumber,
        totalSetsInWorkout,
      );
    }
  };

  const handleTogglePause = () => {
    setTimerState((prev) => 
      prev ? { ...prev, isPaused: !prev.isPaused } : null
    );
  };

  const handleSkipTimer = () => {
    clearTimerInterval();
    setTimerState(null);
  };

  const handleAskHelp = () => {
    setInitialMessage(`Como executar o exercício ${name} corretamente?`);
    setIsChatOpen(true);
  };

  // const isAllSetsCompleted = completedSets.length === series;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-muted bg-card">
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-tight text-base font-semibold text-foreground">
            {name}
          </h3>
          
          <div className="flex items-center gap-2">
            {youtubeVideoId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPlayer((p) => !p)}
                className="text-primary transition-all hover:text-primary/80"
                aria-label={showPlayer ? "Fechar vídeo" : "Abrir vídeo"}
              >
                {showPlayer ? <X className="size-5" /> : <PlayCircle className="size-5" />}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAskHelp}
              className="text-muted-foreground transition-all hover:text-foreground"
              aria-label="Ajuda com o exercício"
            >
              <HelpCircle className="size-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-1.5">
          <Badge
            variant="secondary"
            className="h-[22px] border-none bg-muted px-2.5 text-[10px] font-semibold uppercase text-muted-foreground"
          >
            {reps} reps
          </Badge>
          
          <Badge
            variant="secondary"
            className="h-[22px] gap-1 border-none bg-muted px-2.5 text-[10px] font-semibold uppercase text-muted-foreground"
          >
            <Zap className="size-3" />
            {restTimeInSeconds}s
          </Badge>

          <Badge
            variant="secondary"
            className="h-[22px] border-none bg-primary/10 px-2.5 text-[10px] font-semibold uppercase text-primary"
          >
            {completedSets.length}/{series}
          </Badge>
        </div>

        {sessionId && (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: series }, (_, i) => i + 1).map((setNumber) => {
              const isCompleted = completedSets.includes(setNumber);
              
              return (
                <Button
                  key={setNumber}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSetClick(setNumber)}
                  className={`h-9 w-9 rounded-full border text-xs font-semibold transition-all duration-200 ${
                    isCompleted
                      ? "scale-95 border-primary bg-primary text-primary-foreground"
                      : "border-muted text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                  aria-label={`Série ${setNumber} ${isCompleted ? "concluída" : "pendente"}`}
                >
                  {isCompleted ? <Check className="size-4" /> : setNumber}
                </Button>
              );
            })}
          </div>
        )}

        {timerState && timerState.timeRemaining > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
            <Zap className="size-4 animate-pulse text-primary" />
            
            <span className="font-tight text-sm font-semibold text-primary">
              Descansando: {formatTime(timerState.timeRemaining)}
            </span>

            <div className="ml-auto flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTogglePause}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                aria-label={timerState.isPaused ? "Retomar" : "Pausar"}
              >
                {timerState.isPaused ? <PlayCircle className="mr-1 size-4" /> : <Pause className="mr-1 size-4" />}
                {timerState.isPaused ? "Retomar" : "Pausar"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipTimer}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                aria-label="Pular descanso"
              >
                Pular
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* YouTube Player */}
      {showPlayer && youtubeVideoId && (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
            title={name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      )}
    </div>
  );
}