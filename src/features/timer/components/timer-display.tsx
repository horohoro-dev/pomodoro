import { tv } from "tailwind-variants";
import type { TimerPhase, TimerState } from "../types";
import { formatTime } from "../utils/time";

const PHASE_LABELS: Record<TimerPhase, string> = {
  work: "Work",
  break: "Break",
  longBreak: "Long Break",
};

const phaseStyles = tv({
  base: "text-lg font-semibold uppercase tracking-wider",
  variants: {
    phase: {
      work: "text-red-500",
      break: "text-green-500",
      longBreak: "text-blue-500",
    },
  },
});

const progressBarStyles = tv({
  base: "h-2 rounded-full transition-all duration-1000 ease-linear",
  variants: {
    phase: {
      work: "bg-red-500",
      break: "bg-green-500",
      longBreak: "bg-blue-500",
    },
  },
});

type TimerDisplayProps = {
  state: TimerState;
  totalSections: number;
};

export function TimerDisplay({ state, totalSections }: TimerDisplayProps) {
  const progress =
    state.totalTimeSec > 0
      ? (state.remainingTimeSec / state.totalTimeSec) * 100
      : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className={phaseStyles({ phase: state.currentPhase })}>
        {PHASE_LABELS[state.currentPhase]}
      </p>

      <p className="font-mono text-7xl font-bold text-gray-900">
        {formatTime(state.remainingTimeSec)}
      </p>

      <div className="w-full max-w-md">
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            className={progressBarStyles({ phase: state.currentPhase })}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-6 text-sm text-gray-500">
        <span>
          Section {state.currentSectionIndex + 1} / {totalSections}
        </span>
        <span>Loop {state.currentLoop}</span>
      </div>
    </div>
  );
}
