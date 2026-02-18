import { render, screen } from "@testing-library/react";
import type { TimerState } from "../types";
import { TimerDisplay } from "./timer-display";

describe("TimerDisplay", () => {
  const defaultState: TimerState = {
    status: "idle",
    currentSectionIndex: 0,
    currentPhase: "work",
    remainingTimeSec: 1500,
    totalTimeSec: 1500,
    currentLoop: 1,
  };

  it("残り時間を表示する", () => {
    render(<TimerDisplay state={defaultState} totalSections={4} />);
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  it("workフェーズのラベルを表示する", () => {
    render(<TimerDisplay state={defaultState} totalSections={4} />);
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("breakフェーズのラベルを表示する", () => {
    const state: TimerState = {
      ...defaultState,
      currentPhase: "break",
      remainingTimeSec: 300,
    };
    render(<TimerDisplay state={state} totalSections={4} />);
    expect(screen.getByText("Break")).toBeInTheDocument();
  });

  it("longBreakフェーズのラベルを表示する", () => {
    const state: TimerState = {
      ...defaultState,
      currentPhase: "longBreak",
      remainingTimeSec: 900,
    };
    render(<TimerDisplay state={state} totalSections={4} />);
    expect(screen.getByText("Long Break")).toBeInTheDocument();
  });

  it("セクション番号を表示する", () => {
    const state: TimerState = { ...defaultState, currentSectionIndex: 2 };
    render(<TimerDisplay state={state} totalSections={4} />);
    expect(screen.getByText("Section 3 / 4")).toBeInTheDocument();
  });

  it("ループ数を表示する", () => {
    const state: TimerState = { ...defaultState, currentLoop: 3 };
    render(<TimerDisplay state={state} totalSections={4} />);
    expect(screen.getByText("Loop 3")).toBeInTheDocument();
  });

  it("プログレスバーが表示される", () => {
    render(<TimerDisplay state={defaultState} totalSections={4} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
