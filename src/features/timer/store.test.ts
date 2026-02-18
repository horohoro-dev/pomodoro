import { act } from "@testing-library/react";
import {
  DEFAULT_SECTION_COUNT,
  DEFAULT_WORK_DURATION_MIN,
} from "./constants";
import { useTimerStore } from "./store";
import { createDefaultConfig } from "./utils/config";
import { minutesToSeconds } from "./utils/time";

const STORAGE_KEY = "pomodoro-timer-config";

describe("useTimerStore", () => {
  beforeEach(() => {
    localStorage.clear();
    // ストアを初期状態にリセット
    const config = createDefaultConfig();
    useTimerStore.setState({
      config,
      timer: {
        status: "idle",
        currentSectionIndex: 0,
        currentPhase: "work",
        remainingTimeSec: config.sections[0].workDurationSec,
        totalTimeSec: config.sections[0].workDurationSec,
        currentLoop: 1,
      },
    });
  });

  // --- config ---

  describe("config", () => {
    it("デフォルト設定で初期化される", () => {
      const { config } = useTimerStore.getState();
      expect(config.sections).toHaveLength(DEFAULT_SECTION_COUNT);
      expect(config.mode).toBe("simple");
      expect(config.sections[0].workDurationSec).toBe(
        minutesToSeconds(DEFAULT_WORK_DURATION_MIN),
      );
    });

    it("setConfigで設定を更新しlocalStorageに保存する", () => {
      const { config, setConfig } = useTimerStore.getState();
      setConfig({ ...config, longBreakDurationSec: 1200 });

      expect(useTimerStore.getState().config.longBreakDurationSec).toBe(1200);
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
      expect(stored.longBreakDurationSec).toBe(1200);
    });

    it("setSectionCountでセクション数を変更できる", () => {
      useTimerStore.getState().setSectionCount(2);
      expect(useTimerStore.getState().config.sections).toHaveLength(2);

      useTimerStore.getState().setSectionCount(6);
      expect(useTimerStore.getState().config.sections).toHaveLength(6);
    });

    it("updateSectionで特定セクションを更新できる", () => {
      const sectionId = useTimerStore.getState().config.sections[0].id;
      useTimerStore.getState().updateSection(sectionId, { workDurationSec: 3000 });

      expect(
        useTimerStore.getState().config.sections[0].workDurationSec,
      ).toBe(3000);
    });

    it("setModeでモードを切り替えられる", () => {
      useTimerStore.getState().setMode("complex");
      expect(useTimerStore.getState().config.mode).toBe("complex");

      useTimerStore.getState().setMode("simple");
      expect(useTimerStore.getState().config.mode).toBe("simple");
    });
  });

  // --- timer ---

  describe("timer", () => {
    it("初期状態がidleである", () => {
      const { timer } = useTimerStore.getState();
      expect(timer.status).toBe("idle");
      expect(timer.currentPhase).toBe("work");
    });

    it("startでrunningに遷移する", () => {
      useTimerStore.getState().start();
      expect(useTimerStore.getState().timer.status).toBe("running");
    });

    it("pauseでpausedに遷移する", () => {
      useTimerStore.getState().start();
      useTimerStore.getState().pause();
      expect(useTimerStore.getState().timer.status).toBe("paused");
    });

    it("resetで初期状態に戻る", () => {
      useTimerStore.getState().start();
      useTimerStore.getState().tick();
      useTimerStore.getState().reset();

      const { timer } = useTimerStore.getState();
      expect(timer.status).toBe("idle");
      expect(timer.remainingTimeSec).toBe(
        useTimerStore.getState().config.sections[0].workDurationSec,
      );
    });

    it("tickで残り時間が1秒減る", () => {
      const before = useTimerStore.getState().timer.remainingTimeSec;
      useTimerStore.getState().start();
      useTimerStore.getState().tick();
      expect(useTimerStore.getState().timer.remainingTimeSec).toBe(before - 1);
    });

    it("skipで次のフェーズに進む", () => {
      useTimerStore.getState().start();
      useTimerStore.getState().skip();
      expect(useTimerStore.getState().timer.currentPhase).toBe("break");
    });
  });

  // --- config変更時のtimer同期（今回の不具合修正の核心） ---

  describe("config変更時のtimer同期", () => {
    it("idle時にsetConfigするとtimer stateも更新される", () => {
      const { config, setConfig } = useTimerStore.getState();
      const newConfig = {
        ...config,
        sections: config.sections.map((s) => ({
          ...s,
          workDurationSec: 600,
        })),
      };
      setConfig(newConfig);

      const { timer } = useTimerStore.getState();
      expect(timer.remainingTimeSec).toBe(600);
      expect(timer.totalTimeSec).toBe(600);
      expect(timer.status).toBe("idle");
    });

    it("idle時にupdateSectionするとtimer stateも更新される", () => {
      const sectionId = useTimerStore.getState().config.sections[0].id;
      useTimerStore.getState().updateSection(sectionId, { workDurationSec: 900 });

      expect(useTimerStore.getState().timer.remainingTimeSec).toBe(900);
    });

    it("running時にsetConfigしてもtimer stateは変わらない", () => {
      useTimerStore.getState().start();
      const before = useTimerStore.getState().timer.remainingTimeSec;

      const { config, setConfig } = useTimerStore.getState();
      setConfig({
        ...config,
        sections: config.sections.map((s) => ({
          ...s,
          workDurationSec: 600,
        })),
      });

      expect(useTimerStore.getState().timer.remainingTimeSec).toBe(before);
    });

    it("paused時にsetConfigしてもtimer stateは変わらない", () => {
      useTimerStore.getState().start();
      useTimerStore.getState().pause();
      const before = useTimerStore.getState().timer.remainingTimeSec;

      const { config, setConfig } = useTimerStore.getState();
      setConfig({
        ...config,
        sections: config.sections.map((s) => ({
          ...s,
          workDurationSec: 600,
        })),
      });

      expect(useTimerStore.getState().timer.remainingTimeSec).toBe(before);
    });
  });

  // --- interval管理 ---

  describe("interval管理", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      useTimerStore.getState().reset();
      vi.useRealTimers();
    });

    it("startでカウントダウンが自動で進む", () => {
      const before = useTimerStore.getState().timer.remainingTimeSec;
      useTimerStore.getState().start();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(useTimerStore.getState().timer.remainingTimeSec).toBe(before - 3);
    });

    it("pauseでカウントダウンが止まる", () => {
      useTimerStore.getState().start();
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      useTimerStore.getState().pause();
      const after = useTimerStore.getState().timer.remainingTimeSec;

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(useTimerStore.getState().timer.remainingTimeSec).toBe(after);
    });

    it("resetでカウントダウンが止まる", () => {
      useTimerStore.getState().start();
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      useTimerStore.getState().reset();

      const after = useTimerStore.getState().timer.remainingTimeSec;
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(useTimerStore.getState().timer.remainingTimeSec).toBe(after);
    });
  });
});
