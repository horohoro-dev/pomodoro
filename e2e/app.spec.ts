import { expect, test } from "@playwright/test";

test("タイマー表示が見える", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("25:00")).toBeVisible();
});

test("Start/Pauseでタイマーを制御できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();

  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
});

test("Resetで初期状態に戻る", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Start" }).click();
  await page.getByRole("button", { name: "Reset" }).click();

  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  await expect(page.getByText("25:00")).toBeVisible();
});

test("設定パネルが表示される", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Settings")).toBeVisible();
  await expect(page.getByLabel("Sections")).toBeVisible();
});
