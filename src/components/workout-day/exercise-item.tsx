"use client";

import { completeSet } from "@/actions/workout-session/complete-set";
import { undoSet } from "@/actions/workout-session/undo-set";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import {
  Check,
  HelpCircle,
  Pause,
  Play,
  PlayCircle,
  SkipForward,
  X,
  Zap,
} from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useCallback, useEffect, useRef, useState } from "react";

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
}

const formatTime = (seconds: number): string => {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}min ${s}s` : `${m}min`;
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
}: ExerciseItemProps) {
  const [completedSets, setCompletedSets] =
    useState<number[]>(initialCompletedSets);
  const [timer, setTimer] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { incrementSets, decrementSets } = useWorkoutSession();

  const [, setIsChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [, setInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString,
  );

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimer(null);
    setPaused(false);
  }, []);

  const startInterval = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === null || prev <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const startTimer = useCallback(
    (seconds: number) => {
      clearTimer();
      setTimer(seconds);
      setPaused(false);
      startInterval();
    },
    [clearTimer, startInterval],
  );

  const handleTogglePause = useCallback(() => {
    if (!paused) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setPaused(true);
    } else {
      setPaused(false);
      startInterval();
    }
  }, [paused, startInterval]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handleSetClick = async (setNumber: number) => {
    if (!sessionId) return;

    const isCompleted = completedSets.includes(setNumber);

    if (isCompleted) {
      setCompletedSets((prev) => prev.filter((s) => s !== setNumber));
      clearTimer();
      decrementSets();
      await undoSet(planId, dayId, sessionId, exerciseId, setNumber);
    } else {
      const newCompleted = [...completedSets, setNumber];
      setCompletedSets(newCompleted);
      incrementSets();
      if (newCompleted.length < series) {
        startTimer(restTimeInSeconds);
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

  const allSetsCompleted = completedSets.length === series;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border bg-card transition-colors duration-300 ${
        allSetsCompleted ? "border-primary/40" : "border-muted"
      }`}
    >
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-tight text-base font-semibold text-foreground">
              {name}
            </h3>
            {allSetsCompleted && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                <Check className="size-3 text-primary-foreground" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {youtubeVideoId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPlayer((p) => !p)}
                className="text-primary hover:text-primary/80"
                aria-label={showPlayer ? "Fechar vídeo" : "Ver vídeo"}
              >
                {showPlayer ? (
                  <X className="size-5" />
                ) : (
                  <PlayCircle className="size-5" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setInitialMessage(
                  `Como executar o exercício ${name} corretamente?`,
                );
                setIsChatOpen(true);
              }}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Como executar"
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
          {sessionId && (
            <Badge
              variant="secondary"
              className={`h-[22px] border-none px-2.5 text-[10px] font-semibold uppercase transition-colors ${
                allSetsCompleted
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {completedSets.length}/{series}
            </Badge>
          )}
        </div>

        {sessionId && (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: series }, (_, i) => i + 1).map(
              (setNumber) => {
                const isCompleted = completedSets.includes(setNumber);
                return (
                  <Button
                    key={setNumber}
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSetClick(setNumber)}
                    className={`h-9 w-9 rounded-full border text-xs font-semibold transition-all duration-200 ${
                      isCompleted
                        ? "scale-95 border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "border-muted text-muted-foreground hover:border-primary hover:bg-transparent hover:text-primary"
                    }`}
                    aria-label={`Série ${setNumber}`}
                  >
                    {isCompleted ? <Check className="size-4" /> : setNumber}
                  </Button>
                );
              },
            )}
          </div>
        )}

        {timer !== null && (
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
            <Zap
              className={`size-4 shrink-0 text-primary ${!paused && "animate-pulse"}`}
            />
            <span className="font-tight text-sm font-semibold text-primary">
              {paused ? "Pausado:" : "Descansando:"} {formatTime(timer)}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTogglePause}
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {paused ? (
                  <Play className="size-3.5" />
                ) : (
                  <Pause className="size-3.5" />
                )}
                {paused ? "Retomar" : "Pausar"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearTimer}
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <SkipForward className="size-3.5" />
                Pular
              </Button>
            </div>
          </div>
        )}
      </div>

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
