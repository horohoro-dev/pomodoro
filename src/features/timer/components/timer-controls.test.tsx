import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TimerStatus } from "../types";
import { TimerControls } from "./timer-controls";

describe("TimerControls", () => {
  const mockStart = vi.fn();
  const mockPause = vi.fn();
  const mockReset = vi.fn();
  const mockSkip = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderControls = (status: TimerStatus) =>
    render(
      <TimerControls
        status={status}
        onStart={mockStart}
        onPause={mockPause}
        onReset={mockReset}
        onSkip={mockSkip}
      />,
    );

  it("idle状態ではStartボタンを表示する", () => {
    renderControls("idle");
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });

  it("running状態ではPauseボタンを表示する", () => {
    renderControls("running");
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("paused状態ではResumeボタンを表示する", () => {
    renderControls("paused");
    expect(screen.getByRole("button", { name: "Resume" })).toBeInTheDocument();
  });

  it("StartボタンクリックでonStartが呼ばれる", async () => {
    const user = userEvent.setup();
    renderControls("idle");
    await user.click(screen.getByRole("button", { name: "Start" }));
    expect(mockStart).toHaveBeenCalledOnce();
  });

  it("PauseボタンクリックでonPauseが呼ばれる", async () => {
    const user = userEvent.setup();
    renderControls("running");
    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(mockPause).toHaveBeenCalledOnce();
  });

  it("ResetボタンクリックでonResetが呼ばれる", async () => {
    const user = userEvent.setup();
    renderControls("running");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(mockReset).toHaveBeenCalledOnce();
  });

  it("SkipボタンクリックでonSkipが呼ばれる", async () => {
    const user = userEvent.setup();
    renderControls("running");
    await user.click(screen.getByRole("button", { name: "Skip" }));
    expect(mockSkip).toHaveBeenCalledOnce();
  });

  it("idle状態ではResetとSkipが非活性である", () => {
    renderControls("idle");
    expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Skip" })).toBeDisabled();
  });
});
