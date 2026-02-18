import { tv } from "tailwind-variants";
import {
  MAX_DURATION_MIN,
  MAX_SECTION_COUNT,
  MIN_DURATION_MIN,
  MIN_SECTION_COUNT,
} from "../constants";
import type { TimerConfig, TimerSection } from "../types";
import { createSimpleConfig } from "../utils/config";
import { clampMinutes, minutesToSeconds, secondsToMinutes } from "../utils/time";
import { SectionEditor } from "./section-editor";

const modeButtonStyles = tv({
  base: "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
  variants: {
    active: {
      true: "bg-gray-900 text-white",
      false: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    },
  },
});

type TimerConfigPanelProps = {
  config: TimerConfig;
  onSetConfig: (config: TimerConfig) => void;
  onSetSectionCount: (count: number) => void;
  onUpdateSection: (
    id: string,
    updates: Partial<Omit<TimerSection, "id">>,
  ) => void;
  onSetMode: (mode: TimerConfig["mode"]) => void;
};

export function TimerConfigPanel({
  config,
  onSetConfig,
  onSetSectionCount,
  onUpdateSection,
  onSetMode,
}: TimerConfigPanelProps) {
  const isSimple = config.mode === "simple";

  const handleSimpleWorkChange = (minutes: number) => {
    const clamped = clampMinutes(minutes, MIN_DURATION_MIN, MAX_DURATION_MIN);
    const updated = createSimpleConfig(
      config,
      minutesToSeconds(clamped),
      config.sections[0].breakDurationSec,
    );
    onSetConfig(updated);
  };

  const handleSimpleBreakChange = (minutes: number) => {
    const clamped = clampMinutes(minutes, MIN_DURATION_MIN, MAX_DURATION_MIN);
    const updated = createSimpleConfig(
      config,
      config.sections[0].workDurationSec,
      minutesToSeconds(clamped),
    );
    onSetConfig(updated);
  };

  const handleLongBreakChange = (minutes: number) => {
    const clamped = clampMinutes(minutes, MIN_DURATION_MIN, MAX_DURATION_MIN);
    onSetConfig({ ...config, longBreakDurationSec: minutesToSeconds(clamped) });
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Settings</h2>

      {/* モード切替 */}
      <div className="flex gap-2">
        <button
          type="button"
          className={modeButtonStyles({ active: isSimple })}
          onClick={() => onSetMode("simple")}
        >
          Simple
        </button>
        <button
          type="button"
          className={modeButtonStyles({ active: !isSimple })}
          onClick={() => onSetMode("complex")}
        >
          Complex
        </button>
      </div>

      {/* セクション数 */}
      <div className="flex items-center gap-3">
        <label htmlFor="section-count" className="text-sm text-gray-600">
          Sections
        </label>
        <select
          id="section-count"
          value={config.sections.length}
          onChange={(e) => onSetSectionCount(Number(e.target.value))}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          {Array.from(
            { length: MAX_SECTION_COUNT - MIN_SECTION_COUNT + 1 },
            (_, i) => i + MIN_SECTION_COUNT,
          ).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* 時間設定 */}
      {isSimple ? (
        <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <label htmlFor="simple-work" className="text-sm text-gray-500">
              Work (min)
            </label>
            <input
              id="simple-work"
              type="number"
              min={MIN_DURATION_MIN}
              max={MAX_DURATION_MIN}
              value={secondsToMinutes(config.sections[0].workDurationSec)}
              onChange={(e) => handleSimpleWorkChange(Number(e.target.value))}
              className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="simple-break" className="text-sm text-gray-500">
              Break (min)
            </label>
            <input
              id="simple-break"
              type="number"
              min={MIN_DURATION_MIN}
              max={MAX_DURATION_MIN}
              value={secondsToMinutes(config.sections[0].breakDurationSec)}
              onChange={(e) => handleSimpleBreakChange(Number(e.target.value))}
              className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {config.sections.map((section, i) => (
            <SectionEditor
              key={section.id}
              section={section}
              index={i}
              onUpdate={onUpdateSection}
            />
          ))}
        </div>
      )}

      {/* ロングブレーク */}
      <div className="flex items-center gap-2">
        <label htmlFor="long-break" className="text-sm text-gray-500">
          Long Break (min)
        </label>
        <input
          id="long-break"
          type="number"
          min={MIN_DURATION_MIN}
          max={MAX_DURATION_MIN}
          value={secondsToMinutes(config.longBreakDurationSec)}
          onChange={(e) => handleLongBreakChange(Number(e.target.value))}
          className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm"
        />
      </div>
    </div>
  );
}
