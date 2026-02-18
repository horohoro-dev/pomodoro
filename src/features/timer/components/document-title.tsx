import type { TimerPhase, TimerState } from "../types";
import { formatTime } from "../utils/time";

const DEFAULT_TITLE = "Pomodoro Timer";

const PHASE_LABELS: Record<TimerPhase, string> = {
  work: "Work",
  break: "Break",
  longBreak: "Long Break",
};

export function DocumentTitle({ state }: { state: TimerState }) {
  const title =
    state.status === "idle"
      ? DEFAULT_TITLE
      : `${formatTime(state.remainingTimeSec)} ${PHASE_LABELS[state.currentPhase]} - ${DEFAULT_TITLE}`;

  return <title>{title}</title>;
}
