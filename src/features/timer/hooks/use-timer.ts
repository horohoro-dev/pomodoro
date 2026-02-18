import type { TimerConfig, TimerState } from "../types";

export type TimerAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "TICK" }
  | { type: "SKIP" };

export function createInitialState(config: TimerConfig): TimerState {
  return {
    status: "idle",
    currentSectionIndex: 0,
    currentPhase: "work",
    remainingTimeSec: config.sections[0].workDurationSec,
    totalTimeSec: config.sections[0].workDurationSec,
    currentLoop: 1,
  };
}

function nextPhase(
  state: TimerState,
  config: TimerConfig,
): TimerState {
  const { currentPhase, currentSectionIndex } = state;
  const isLastSection = currentSectionIndex >= config.sections.length - 1;

  if (currentPhase === "work") {
    // work → break
    const breakDuration = config.sections[currentSectionIndex].breakDurationSec;
    return {
      ...state,
      currentPhase: "break",
      remainingTimeSec: breakDuration,
      totalTimeSec: breakDuration,
    };
  }

  if (currentPhase === "break") {
    if (isLastSection) {
      // 最終セクションのbreak → longBreak
      return {
        ...state,
        currentPhase: "longBreak",
        remainingTimeSec: config.longBreakDurationSec,
        totalTimeSec: config.longBreakDurationSec,
      };
    }
    // break → 次のセクションのwork
    const nextIndex = currentSectionIndex + 1;
    const workDuration = config.sections[nextIndex].workDurationSec;
    return {
      ...state,
      currentPhase: "work",
      currentSectionIndex: nextIndex,
      remainingTimeSec: workDuration,
      totalTimeSec: workDuration,
    };
  }

  // longBreak → ループして最初に戻る
  const workDuration = config.sections[0].workDurationSec;
  return {
    ...state,
    currentPhase: "work",
    currentSectionIndex: 0,
    remainingTimeSec: workDuration,
    totalTimeSec: workDuration,
    currentLoop: state.currentLoop + 1,
  };
}

export function timerReducer(
  state: TimerState,
  action: TimerAction,
  config: TimerConfig,
): TimerState {
  switch (action.type) {
    case "START":
      return { ...state, status: "running" };

    case "PAUSE":
      return { ...state, status: "paused" };

    case "RESET":
      return createInitialState(config);

    case "TICK": {
      if (state.status !== "running") return state;
      if (state.remainingTimeSec <= 1) {
        return nextPhase(state, config);
      }
      return { ...state, remainingTimeSec: state.remainingTimeSec - 1 };
    }

    case "SKIP": {
      if (state.status === "idle") return state;
      return nextPhase(state, config);
    }

    default:
      return state;
  }
}
