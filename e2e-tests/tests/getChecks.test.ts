import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:4173/");
  await page.getByRole("link", { name: "Posts" }).click();
  await page.getByRole("link", { name: "First Demo Post" }).click();
  await page.getByRole("link", { name: "Second Demo Post" }).click();
  await page.getByRole("link", { name: "Third Demo Post" }).click();
  await page.getByText("And here's one more post to").dblclick();
  await expect(page.locator("#app")).toContainText("And here's one more post to demonstrate the app.");
});
