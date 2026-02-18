import { render, screen } from "@testing-library/react";
import { TimerPage } from "./timer-page";

describe("TimerPage", () => {
  it("タイマー表示が存在する", () => {
    render(<TimerPage />);
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  it("Startボタンが存在する", () => {
    render(<TimerPage />);
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });

  it("設定パネルが存在する", () => {
    render(<TimerPage />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("Startをクリックするとタイマーが開始する", async () => {
    render(<TimerPage />);
    const startButton = screen.getByRole("button", { name: "Start" });
    startButton.click();

    expect(
      await screen.findByRole("button", { name: "Pause" }),
    ).toBeInTheDocument();
  });

  it("Work フェーズのラベルが表示される", () => {
    render(<TimerPage />);
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("セクション情報が表示される", () => {
    render(<TimerPage />);
    expect(screen.getByText("Section 1 / 4")).toBeInTheDocument();
  });
});
