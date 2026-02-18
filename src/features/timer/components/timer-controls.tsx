import { tv } from "tailwind-variants";
import type { TimerStatus } from "../types";

const buttonStyles = tv({
  base: "rounded-lg px-6 py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
  variants: {
    variant: {
      primary: "bg-gray-900 text-white hover:bg-gray-800",
      secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    },
  },
});

type TimerControlsProps = {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
};

export function TimerControls({
  status,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  const isIdle = status === "idle";
  const isRunning = status === "running";

  return (
    <div className="flex items-center gap-3">
      {isRunning ? (
        <button
          type="button"
          className={buttonStyles({ variant: "primary" })}
          onClick={onPause}
        >
          Pause
        </button>
      ) : (
        <button
          type="button"
          className={buttonStyles({ variant: "primary" })}
          onClick={onStart}
        >
          {isIdle ? "Start" : "Resume"}
        </button>
      )}

      <button
        type="button"
        className={buttonStyles({ variant: "secondary" })}
        onClick={onReset}
        disabled={isIdle}
      >
        Reset
      </button>

      <button
        type="button"
        className={buttonStyles({ variant: "secondary" })}
        onClick={onSkip}
        disabled={isIdle}
      >
        Skip
      </button>
    </div>
  );
}
