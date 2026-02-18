import { create } from "zustand";
import type { TimerConfig, TimerSection, TimerState } from "./types";
import { TimerConfigSchema } from "./types";
import { createDefaultConfig, createSection } from "./utils/config";
import { createInitialState, timerReducer } from "./hooks/use-timer";

const STORAGE_KEY = "pomodoro-timer-config";

function loadConfig(): TimerConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const result = TimerConfigSchema.safeParse(parsed);
      if (result.success) {
        return result.data;
      }
    }
  } catch {
    // JSONパース失敗の場合はデフォルトを返す
  }
  return createDefaultConfig();
}

function saveConfig(config: TimerConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

type TimerStore = {
  // State
  config: TimerConfig;
  timer: TimerState;

  // Config actions
  setConfig: (config: TimerConfig) => void;
  setSectionCount: (count: number) => void;
  updateSection: (
    id: string,
    updates: Partial<Omit<TimerSection, "id">>,
  ) => void;
  setMode: (mode: TimerConfig["mode"]) => void;

  // Timer actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => void;
};

/** idle状態ならconfigからtimer stateを再作成する */
function syncTimerIfIdle(
  timer: TimerState,
  newConfig: TimerConfig,
): TimerState {
  if (timer.status === "idle") {
    return createInitialState(newConfig);
  }
  return timer;
}

const initialConfig = loadConfig();

export const useTimerStore = create<TimerStore>((set, get) => {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const clearTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  return {
    config: initialConfig,
    timer: createInitialState(initialConfig),

    // --- Config actions ---

    setConfig: (newConfig) => {
      saveConfig(newConfig);
      set((state) => ({
        config: newConfig,
        timer: syncTimerIfIdle(state.timer, newConfig),
      }));
    },

    setSectionCount: (count) => {
      const { config } = get();
      const current = config.sections;
      let sections: TimerSection[];
      if (count <= current.length) {
        sections = current.slice(0, count);
      } else {
        const additional = Array.from({ length: count - current.length }, () =>
          createSection(
            current[0].workDurationSec,
            current[0].breakDurationSec,
          ),
        );
        sections = [...current, ...additional];
      }
      const newConfig = { ...config, sections };
      saveConfig(newConfig);
      set((state) => ({
        config: newConfig,
        timer: syncTimerIfIdle(state.timer, newConfig),
      }));
    },

    updateSection: (sectionId, updates) => {
      const { config } = get();
      const sections = config.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s,
      );
      const newConfig = { ...config, sections };
      saveConfig(newConfig);
      set((state) => ({
        config: newConfig,
        timer: syncTimerIfIdle(state.timer, newConfig),
      }));
    },

    setMode: (mode) => {
      const { config } = get();
      const newConfig = { ...config, mode };
      saveConfig(newConfig);
      set({ config: newConfig });
    },

    // --- Timer actions ---

    start: () => {
      set((state) => ({
        timer: { ...state.timer, status: "running" as const },
      }));
      clearTimer();
      intervalId = setInterval(() => get().tick(), 1000);
    },

    pause: () => {
      set((state) => ({
        timer: { ...state.timer, status: "paused" as const },
      }));
      clearTimer();
    },

    reset: () => {
      set((state) => ({
        timer: createInitialState(state.config),
      }));
      clearTimer();
    },

    skip: () => {
      set((state) => {
        if (state.timer.status === "idle") return state;
        return {
          timer: timerReducer(
            state.timer,
            { type: "SKIP" },
            state.config,
          ),
        };
      });
    },

    tick: () => {
      set((state) => ({
        timer: timerReducer(state.timer, { type: "TICK" }, state.config),
      }));
    },
  };
});
