import {
  DEFAULT_BREAK_DURATION_MIN,
  DEFAULT_LONG_BREAK_DURATION_MIN,
  DEFAULT_SECTION_COUNT,
  DEFAULT_WORK_DURATION_MIN,
} from "../constants";
import {
  createDefaultConfig,
  createSection,
  createSimpleConfig,
} from "./config";

describe("createSection", () => {
  it("デフォルト値でセクションを作成する", () => {
    const section = createSection();
    expect(section).toEqual({
      id: expect.any(String),
      workDurationSec: DEFAULT_WORK_DURATION_MIN * 60,
      breakDurationSec: DEFAULT_BREAK_DURATION_MIN * 60,
    });
  });

  it("指定した値でセクションを作成する", () => {
    const section = createSection(30 * 60, 10 * 60);
    expect(section.workDurationSec).toBe(1800);
    expect(section.breakDurationSec).toBe(600);
  });

  it("各セクションにユニークなIDが付与される", () => {
    const s1 = createSection();
    const s2 = createSection();
    expect(s1.id).not.toBe(s2.id);
  });
});

describe("createDefaultConfig", () => {
  it("デフォルト設定を作成する", () => {
    const config = createDefaultConfig();
    expect(config.sections).toHaveLength(DEFAULT_SECTION_COUNT);
    expect(config.longBreakDurationSec).toBe(
      DEFAULT_LONG_BREAK_DURATION_MIN * 60,
    );
    expect(config.mode).toBe("simple");
  });

  it("全セクションが同じデフォルト値を持つ", () => {
    const config = createDefaultConfig();
    for (const section of config.sections) {
      expect(section.workDurationSec).toBe(DEFAULT_WORK_DURATION_MIN * 60);
      expect(section.breakDurationSec).toBe(DEFAULT_BREAK_DURATION_MIN * 60);
    }
  });
});

describe("createSimpleConfig", () => {
  it("全セクションに同じ値を設定する", () => {
    const config = createDefaultConfig();
    const updated = createSimpleConfig(config, 30 * 60, 10 * 60);
    for (const section of updated.sections) {
      expect(section.workDurationSec).toBe(1800);
      expect(section.breakDurationSec).toBe(600);
    }
  });

  it("セクション数は変更しない", () => {
    const config = createDefaultConfig();
    const updated = createSimpleConfig(config, 30 * 60, 10 * 60);
    expect(updated.sections).toHaveLength(config.sections.length);
  });

  it("ロングブレークとモードは変更しない", () => {
    const config = createDefaultConfig();
    const updated = createSimpleConfig(config, 30 * 60, 10 * 60);
    expect(updated.longBreakDurationSec).toBe(config.longBreakDurationSec);
    expect(updated.mode).toBe(config.mode);
  });
});
