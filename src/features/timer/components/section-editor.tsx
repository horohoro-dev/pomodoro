import { MAX_DURATION_MIN, MIN_DURATION_MIN } from "../constants";
import type { TimerSection } from "../types";
import { minutesToSeconds, secondsToMinutes } from "../utils/time";

type SectionEditorProps = {
  section: TimerSection;
  index: number;
  onUpdate: (id: string, updates: Partial<Omit<TimerSection, "id">>) => void;
};

export function SectionEditor({
  section,
  index,
  onUpdate,
}: SectionEditorProps) {
  const workId = `work-${section.id}`;
  const breakId = `break-${section.id}`;

  return (
    <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-3">
      <span className="text-sm font-medium text-gray-700">
        Section {index + 1}
      </span>

      <div className="flex items-center gap-2">
        <label htmlFor={workId} className="text-sm text-gray-500">
          Work (min)
        </label>
        <input
          id={workId}
          type="number"
          min={MIN_DURATION_MIN}
          max={MAX_DURATION_MIN}
          value={secondsToMinutes(section.workDurationSec)}
          onChange={(e) =>
            onUpdate(section.id, {
              workDurationSec: minutesToSeconds(Number(e.target.value)),
            })
          }
          className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor={breakId} className="text-sm text-gray-500">
          Break (min)
        </label>
        <input
          id={breakId}
          type="number"
          min={MIN_DURATION_MIN}
          max={MAX_DURATION_MIN}
          value={secondsToMinutes(section.breakDurationSec)}
          onChange={(e) =>
            onUpdate(section.id, {
              breakDurationSec: minutesToSeconds(Number(e.target.value)),
            })
          }
          className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm"
        />
      </div>
    </div>
  );
}
