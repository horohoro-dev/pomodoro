import {
  DEFAULT_BREAK_DURATION_MIN,
  DEFAULT_LONG_BREAK_DURATION_MIN,
  DEFAULT_SECTION_COUNT,
  DEFAULT_WORK_DURATION_MIN,
} from "../constants";
import type { TimerConfig, TimerSection } from "../types";
import { minutesToSeconds } from "./time";

let sectionIdCounter = 0;

export function createSection(
  workDurationSec = minutesToSeconds(DEFAULT_WORK_DURATION_MIN),
  breakDurationSec = minutesToSeconds(DEFAULT_BREAK_DURATION_MIN),
): TimerSection {
  sectionIdCounter += 1;
  return {
    id: `section-${sectionIdCounter}-${Date.now()}`,
    workDurationSec,
    breakDurationSec,
  };
}

export function createDefaultConfig(): TimerConfig {
  return {
    sections: Array.from({ length: DEFAULT_SECTION_COUNT }, () =>
      createSection(),
    ),
    longBreakDurationSec: minutesToSeconds(DEFAULT_LONG_BREAK_DURATION_MIN),
    mode: "simple",
  };
}

export function createSimpleConfig(
  config: TimerConfig,
  workDurationSec: number,
  breakDurationSec: number,
): TimerConfig {
  return {
    ...config,
    sections: config.sections.map((section) => ({
      ...section,
      workDurationSec,
      breakDurationSec,
    })),
  };
}
