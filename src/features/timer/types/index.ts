import { z } from "zod";

// セクション設定
export const TimerSectionSchema = z.object({
  id: z.string(),
  workDurationSec: z.number(),
  breakDurationSec: z.number(),
});

export type TimerSection = z.infer<typeof TimerSectionSchema>;

// 全体設定
export const TimerConfigSchema = z.object({
  sections: z.array(TimerSectionSchema).min(1),
  longBreakDurationSec: z.number(),
  mode: z.enum(["simple", "complex"]),
});

export type TimerConfig = z.infer<typeof TimerConfigSchema>;

// タイマー状態
export type TimerPhase = "work" | "break" | "longBreak";
export type TimerStatus = "idle" | "running" | "paused";
export type TimerState = {
  status: TimerStatus;
  currentSectionIndex: number;
  currentPhase: TimerPhase;
  remainingTimeSec: number;
  totalTimeSec: number;
  currentLoop: number;
};
