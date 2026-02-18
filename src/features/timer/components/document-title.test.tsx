import { render } from "@testing-library/react";
import type { TimerState } from "../types";
import { DocumentTitle } from "./document-title";

describe("DocumentTitle", () => {
  it("idle状態ではデフォルトタイトルを表示する", () => {
    const state: TimerState = {
      status: "idle",
      currentSectionIndex: 0,
      currentPhase: "work",
      remainingTimeSec: 1500,
      totalTimeSec: 1500,
      currentLoop: 1,
    };
    render(<DocumentTitle state={state} />);
    expect(document.title).toBe("Pomodoro Timer");
  });

  it("running中にwork残り時間を表示する", () => {
    const state: TimerState = {
      status: "running",
      currentSectionIndex: 0,
      currentPhase: "work",
      remainingTimeSec: 1500,
      totalTimeSec: 1500,
      currentLoop: 1,
    };
    render(<DocumentTitle state={state} />);
    expect(document.title).toBe("25:00 Work - Pomodoro Timer");
  });

  it("paused中にbreak残り時間を表示する", () => {
    const state: TimerState = {
      status: "paused",
      currentSectionIndex: 0,
      currentPhase: "break",
      remainingTimeSec: 300,
      totalTimeSec: 300,
      currentLoop: 1,
    };
    render(<DocumentTitle state={state} />);
    expect(document.title).toBe("05:00 Break - Pomodoro Timer");
  });

  it("longBreakフェーズを表示する", () => {
    const state: TimerState = {
      status: "running",
      currentSectionIndex: 3,
      currentPhase: "longBreak",
      remainingTimeSec: 900,
      totalTimeSec: 900,
      currentLoop: 1,
    };
    render(<DocumentTitle state={state} />);
    expect(document.title).toBe("15:00 Long Break - Pomodoro Timer");
  });
});
