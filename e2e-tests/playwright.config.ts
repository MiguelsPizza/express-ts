import path from "path";
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, ".env") });
console.log("path:" + path.join(__dirname, "tests"));

export default defineConfig({
  globalSetup: require.resolve("./global-setup"),
  testDir: path.join(__dirname, "tests"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  timeout: 5000,
  workers: 1,
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
      command: "turbo start",
      cwd: path.join(__dirname, "../example/express-server"),
      port: 8888,
      reuseExistingServer: true,
      timeout: 120000,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      command: "turbo start",
      port: 4173, // both wait on the server port because it takes longer
      reuseExistingServer: true,
      cwd: path.join(__dirname, "../example/react-spa"),
      timeout: 120000, // 2 minutes
      stdout: "pipe",
      stderr: "pipe",
    },
  ],
});
