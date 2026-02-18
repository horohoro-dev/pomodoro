import { createDefaultConfig } from "../utils/config";
import type { TimerState } from "../types";
import {
  createInitialState,
  timerReducer,
} from "./use-timer";

// --- reducer単体テスト ---

describe("createInitialState", () => {
  it("config からアイドル状態の初期stateを作成する", () => {
    const config = createDefaultConfig();
    const state = createInitialState(config);
    expect(state).toEqual({
      status: "idle",
      currentSectionIndex: 0,
      currentPhase: "work",
      remainingTimeSec: config.sections[0].workDurationSec,
      totalTimeSec: config.sections[0].workDurationSec,
      currentLoop: 1,
    });
  });
});

describe("timerReducer", () => {
  const config = createDefaultConfig();
  const initial = createInitialState(config);

  describe("START", () => {
    it("idle → running に遷移する", () => {
      const next = timerReducer(initial, { type: "START" }, config);
      expect(next.status).toBe("running");
    });

    it("paused → running に遷移する", () => {
      const paused: TimerState = { ...initial, status: "paused" };
      const next = timerReducer(paused, { type: "START" }, config);
      expect(next.status).toBe("running");
    });
  });

  describe("PAUSE", () => {
    it("running → paused に遷移する", () => {
      const running: TimerState = { ...initial, status: "running" };
      const next = timerReducer(running, { type: "PAUSE" }, config);
      expect(next.status).toBe("paused");
    });
  });

  describe("RESET", () => {
    it("初期状態に戻る", () => {
      const running: TimerState = {
        ...initial,
        status: "running",
        remainingTimeSec: 100,
        currentSectionIndex: 2,
      };
      const next = timerReducer(running, { type: "RESET" }, config);
      expect(next).toEqual(initial);
    });
  });

  describe("TICK", () => {
    it("残り時間を1秒減らす", () => {
      const running: TimerState = { ...initial, status: "running" };
      const next = timerReducer(running, { type: "TICK" }, config);
      expect(next.remainingTimeSec).toBe(initial.remainingTimeSec - 1);
    });

    it("running以外ではTICKを無視する", () => {
      const next = timerReducer(initial, { type: "TICK" }, config);
      expect(next).toEqual(initial);
    });

    it("workフェーズ終了後にbreakフェーズへ遷移する", () => {
      const atEnd: TimerState = {
        ...initial,
        status: "running",
        remainingTimeSec: 1,
        currentPhase: "work",
      };
      const next = timerReducer(atEnd, { type: "TICK" }, config);
      expect(next.currentPhase).toBe("break");
      expect(next.remainingTimeSec).toBe(config.sections[0].breakDurationSec);
    });

    it("breakフェーズ終了後に次のセクションのworkへ遷移する", () => {
      const atEnd: TimerState = {
        ...initial,
        status: "running",
        remainingTimeSec: 1,
        currentPhase: "break",
        currentSectionIndex: 0,
      };
      const next = timerReducer(atEnd, { type: "TICK" }, config);
      expect(next.currentPhase).toBe("work");
      expect(next.currentSectionIndex).toBe(1);
      expect(next.remainingTimeSec).toBe(config.sections[1].workDurationSec);
    });

    it("最終セクションのbreak終了後にlongBreakへ遷移する", () => {
      const lastSection = config.sections.length - 1;
      const atEnd: TimerState = {
        ...initial,
        status: "running",
        remainingTimeSec: 1,
        currentPhase: "break",
        currentSectionIndex: lastSection,
      };
      const next = timerReducer(atEnd, { type: "TICK" }, config);
      expect(next.currentPhase).toBe("longBreak");
      expect(next.remainingTimeSec).toBe(config.longBreakDurationSec);
    });

    it("longBreak終了後にループして最初に戻る", () => {
      const atEnd: TimerState = {
        ...initial,
        status: "running",
        remainingTimeSec: 1,
        currentPhase: "longBreak",
        currentSectionIndex: config.sections.length - 1,
        currentLoop: 1,
      };
      const next = timerReducer(atEnd, { type: "TICK" }, config);
      expect(next.currentPhase).toBe("work");
      expect(next.currentSectionIndex).toBe(0);
      expect(next.currentLoop).toBe(2);
      expect(next.remainingTimeSec).toBe(config.sections[0].workDurationSec);
    });
  });

  describe("SKIP", () => {
    it("workフェーズをスキップしてbreakへ遷移する", () => {
      const running: TimerState = {
        ...initial,
        status: "running",
        currentPhase: "work",
      };
      const next = timerReducer(running, { type: "SKIP" }, config);
      expect(next.currentPhase).toBe("break");
      expect(next.remainingTimeSec).toBe(config.sections[0].breakDurationSec);
    });

    it("breakフェーズをスキップして次のworkへ遷移する", () => {
      const running: TimerState = {
        ...initial,
        status: "running",
        currentPhase: "break",
        currentSectionIndex: 0,
      };
      const next = timerReducer(running, { type: "SKIP" }, config);
      expect(next.currentPhase).toBe("work");
      expect(next.currentSectionIndex).toBe(1);
    });

    it("idle状態ではスキップを無視する", () => {
      const next = timerReducer(initial, { type: "SKIP" }, config);
      expect(next).toEqual(initial);
    });
  });
});
