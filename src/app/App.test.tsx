import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
  it("タイマー表示をレンダリングする", () => {
    render(<App />);
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  it("Startボタンをレンダリングする", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });
});
