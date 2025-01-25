import { defineConfig, devices } from "@playwright/test";
import dotenv from 'dotenv';
import path from "path";

dotenv.config({ path: path.join(__dirname, '.env') });

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  testDir: "././",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4173", // Adjust if your interface runs on a different port
    trace: "on-first-retry",
    screenshot: "on", // Take screenshots only on failure
    video: "on", // Record video only on failure
    permissions: ["clipboard-read"],
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Our app only needs to work on Chromium atm
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  webServer: [
    {
      command: process.env.PLAT === "win" ? "npx turbo dev:test:win": "npx turbo dev:test",
      cwd: path.join(__dirname, "../apps/server"),
      port: 3001,
      reuseExistingServer: true,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe'
    }, {
      command: "npx turbo build && npx pnpm preview",
      port: 4173, // both wait on the server port because it takes longer
      reuseExistingServer: true,
      cwd: path.join(__dirname, "../apps/interface"),
      timeout: 120000, // 2 minutes
      stdout: 'pipe',
      stderr: 'pipe'
    },],
});
