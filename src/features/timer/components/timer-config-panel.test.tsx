import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createDefaultConfig } from "../utils/config";
import { TimerConfigPanel } from "./timer-config-panel";

describe("TimerConfigPanel", () => {
  const config = createDefaultConfig();
  const mockSetConfig = vi.fn();
  const mockSetSectionCount = vi.fn();
  const mockUpdateSection = vi.fn();
  const mockSetMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPanel = (overrides = {}) =>
    render(
      <TimerConfigPanel
        config={config}
        onSetConfig={mockSetConfig}
        onSetSectionCount={mockSetSectionCount}
        onUpdateSection={mockUpdateSection}
        onSetMode={mockSetMode}
        {...overrides}
      />,
    );

  it("Settingsヘッダーを表示する", () => {
    renderPanel();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("モード切替ボタンを表示する", () => {
    renderPanel();
    expect(screen.getByRole("button", { name: "Simple" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Complex" })).toBeInTheDocument();
  });

  it("Complexモードに切り替えるとonSetModeが呼ばれる", async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole("button", { name: "Complex" }));
    expect(mockSetMode).toHaveBeenCalledWith("complex");
  });

  it("セクション数セレクタを表示する", () => {
    renderPanel();
    expect(screen.getByLabelText("Sections")).toBeInTheDocument();
  });

  it("セクション数を変更するとonSetSectionCountが呼ばれる", async () => {
    const user = userEvent.setup();
    renderPanel();
    const select = screen.getByLabelText("Sections");
    await user.selectOptions(select, "2");
    expect(mockSetSectionCount).toHaveBeenCalledWith(2);
  });

  it("ロングブレーク入力を表示する", () => {
    renderPanel();
    expect(screen.getByLabelText("Long Break (min)")).toBeInTheDocument();
  });

  it("simpleモードではセクション1つ分の設定のみ表示する", () => {
    renderPanel();
    expect(screen.getByLabelText("Work (min)")).toBeInTheDocument();
    expect(screen.getByLabelText("Break (min)")).toBeInTheDocument();
  });

  it("complexモードでは全セクションのエディタを表示する", () => {
    const complexConfig = { ...config, mode: "complex" as const };
    renderPanel({ config: complexConfig });
    const sectionHeaders = screen.getAllByText(/Section \d/);
    expect(sectionHeaders).toHaveLength(config.sections.length);
  });
});
