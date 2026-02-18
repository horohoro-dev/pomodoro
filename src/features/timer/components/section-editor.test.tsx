import { fireEvent, render, screen } from "@testing-library/react";
import type { TimerSection } from "../types";
import { SectionEditor } from "./section-editor";

describe("SectionEditor", () => {
  const section: TimerSection = {
    id: "s1",
    workDurationSec: 1500,
    breakDurationSec: 300,
  };
  const mockUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("セクション番号を表示する", () => {
    render(<SectionEditor section={section} index={0} onUpdate={mockUpdate} />);
    expect(screen.getByText("Section 1")).toBeInTheDocument();
  });

  it("作業時間を分で表示する", () => {
    render(<SectionEditor section={section} index={0} onUpdate={mockUpdate} />);
    const workInput = screen.getByLabelText("Work (min)");
    expect(workInput).toHaveValue(25);
  });

  it("休憩時間を分で表示する", () => {
    render(<SectionEditor section={section} index={0} onUpdate={mockUpdate} />);
    const breakInput = screen.getByLabelText("Break (min)");
    expect(breakInput).toHaveValue(5);
  });

  it("作業時間を変更するとonUpdateが呼ばれる", () => {
    render(<SectionEditor section={section} index={0} onUpdate={mockUpdate} />);
    const workInput = screen.getByLabelText("Work (min)");
    fireEvent.change(workInput, { target: { value: "30" } });
    expect(mockUpdate).toHaveBeenCalledWith("s1", { workDurationSec: 1800 });
  });

  it("休憩時間を変更するとonUpdateが呼ばれる", () => {
    render(<SectionEditor section={section} index={0} onUpdate={mockUpdate} />);
    const breakInput = screen.getByLabelText("Break (min)");
    fireEvent.change(breakInput, { target: { value: "10" } });
    expect(mockUpdate).toHaveBeenCalledWith("s1", { breakDurationSec: 600 });
  });
});
