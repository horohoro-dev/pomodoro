import {
  clampMinutes,
  formatTime,
  minutesToSeconds,
  secondsToMinutes,
} from "./time";

describe("formatTime", () => {
  it("0秒を00:00にフォーマットする", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("60秒を01:00にフォーマットする", () => {
    expect(formatTime(60)).toBe("01:00");
  });

  it("90秒を01:30にフォーマットする", () => {
    expect(formatTime(90)).toBe("01:30");
  });

  it("1500秒（25分）を25:00にフォーマットする", () => {
    expect(formatTime(1500)).toBe("25:00");
  });

  it("5秒を00:05にフォーマットする", () => {
    expect(formatTime(5)).toBe("00:05");
  });

  it("3599秒を59:59にフォーマットする", () => {
    expect(formatTime(3599)).toBe("59:59");
  });
});

describe("minutesToSeconds", () => {
  it("分を秒に変換する", () => {
    expect(minutesToSeconds(25)).toBe(1500);
  });

  it("0分を0秒に変換する", () => {
    expect(minutesToSeconds(0)).toBe(0);
  });

  it("1分を60秒に変換する", () => {
    expect(minutesToSeconds(1)).toBe(60);
  });
});

describe("secondsToMinutes", () => {
  it("秒を分に変換する（切り捨て）", () => {
    expect(secondsToMinutes(1500)).toBe(25);
  });

  it("0秒を0分に変換する", () => {
    expect(secondsToMinutes(0)).toBe(0);
  });

  it("90秒を1分に変換する（切り捨て）", () => {
    expect(secondsToMinutes(90)).toBe(1);
  });
});

describe("clampMinutes", () => {
  it("範囲内の値はそのまま返す", () => {
    expect(clampMinutes(25, 1, 60)).toBe(25);
  });

  it("最小値より小さい場合は最小値を返す", () => {
    expect(clampMinutes(0, 1, 60)).toBe(1);
  });

  it("マイナス値は最小値を返す", () => {
    expect(clampMinutes(-5, 1, 60)).toBe(1);
  });

  it("最大値より大きい場合は最大値を返す", () => {
    expect(clampMinutes(100, 1, 60)).toBe(60);
  });

  it("最小値ちょうどはそのまま返す", () => {
    expect(clampMinutes(1, 1, 60)).toBe(1);
  });

  it("最大値ちょうどはそのまま返す", () => {
    expect(clampMinutes(60, 1, 60)).toBe(60);
  });

  it("NaNの場合は最小値を返す", () => {
    expect(clampMinutes(NaN, 1, 60)).toBe(1);
  });
});
