import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: '',
    trace: 'on-first-retry',
    headless: true,
    screenshot: 'on',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
  },

  /* Configure projects for major browsers */
  projects: [
    // Chrome stable
    {
      name: 'chromium-latest',
      use: { ...devices['Desktop Chrome'], headless: false },
    },

    {
      name: 'chromium-beta',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome-beta',
        headless: false,
      },
    },

    // ---- firefox latest
    {
      name: 'firefox-latest',
      use: { ...devices['Desktop Firefox'] },
    },

    // --- 🦊 Firefox Developer Edition
    {
      name: 'firefox-dev',
      use: {
        ...devices['Desktop Firefox'],
        channel:  'firefox-beta',
        headless: true,
      },
    },

    // --- 🪟 Microsoft Edge Stable
    {
      name: 'edge-latest',
      use: { ...devices['Desktop Edge'], channel: 'msedge', headless: true },
    },

    // // --- 🪟 Microsoft Edge Beta
    {
      name: 'edge-beta',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge-beta',
        headless: true,
      },
    },

    // Microsoft Edge stable

    // // Microsoft Edge Dev (different build)
    // {
    //   name: 'edge-dev',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge-dev',
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
