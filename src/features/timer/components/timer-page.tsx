import { useTimerStore } from "../store";
import { DocumentTitle } from "./document-title";
import { TimerConfigPanel } from "./timer-config-panel";
import { TimerControls } from "./timer-controls";
import { TimerDisplay } from "./timer-display";

export function TimerPage() {
  const config = useTimerStore((s) => s.config);
  const timer = useTimerStore((s) => s.timer);
  const { start, pause, reset, skip } = useTimerStore.getState();
  const { setConfig, setSectionCount, updateSection, setMode } =
    useTimerStore.getState();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-100 p-8">
      <DocumentTitle state={timer} />
      <TimerDisplay state={timer} totalSections={config.sections.length} />

      <TimerControls
        status={timer.status}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
      />

      <TimerConfigPanel
        config={config}
        onSetConfig={setConfig}
        onSetSectionCount={setSectionCount}
        onUpdateSection={updateSection}
        onSetMode={setMode}
      />
    </div>
  );
}
