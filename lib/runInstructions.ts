/**
 * Step-by-step instructions for running the downloaded Playwright test folder.
 * Used inside the ZIP and can be shown in-app.
 */
export const PLAYWRIGHT_RUN_STEPS = `
# How to run this Playwright test on your system

Follow these steps after extracting the ZIP.

---

## Step 1 — Prerequisites

- **Node.js** (v18 or newer). Check: \`node -v\`
- **npm** (comes with Node). Check: \`npm -v\`

---

## Step 2 — Open the project folder

\`\`\`bash
cd <folder-where-you-extracted-the-zip>
\`\`\`

Example: if you extracted to \`~/Downloads/playwright-my-site\`:

\`\`\`bash
cd ~/Downloads/playwright-my-site
\`\`\`

---

## Step 3 — Install dependencies

\`\`\`bash
npm install
\`\`\`

This installs \`@playwright/test\` and other dependencies from \`package.json\`.

---

## Step 4 — Install Playwright browsers (one-time)

\`\`\`bash
npm run install:browsers
\`\`\`

This runs \`playwright install\` (defined in \`package.json\`) and downloads Chromium, Firefox, and WebKit. You only need to do this once per machine.

---

## Step 5 — Run tests (choose one)

All of these are defined in \`package.json\`:

| What you want | Command | Description |
|----------------|---------|-------------|
| Run in background (no window) | \`npm test\` | Runs all test cases; output in terminal only. |
| **Open browser and see tests run** | \`npm run test:headed\` | **Opens a browser window; you watch each test case perform.** |
| Interactive UI (pick tests, debug) | \`npm run test:ui\` | Opens Playwright UI to run specific tests and debug. |

### Run all test cases with browser open (recommended to see execution)

\`\`\`bash
npm run test:headed
\`\`\`

A browser window will open and you will see each test case perform (clicks, navigation, etc.). Use this to watch your tests run step by step.

### Run all test cases in the background (headless)

\`\`\`bash
npm test
\`\`\`

Runs every test case without opening a browser. Pass/fail and logs appear in the terminal.

### Open Playwright UI to pick and run test cases

\`\`\`bash
npm run test:ui
\`\`\`

Opens an interactive UI where you can pick which tests to run, watch the browser, and debug. Good for running one test at a time or inspecting failures.

---

## Step 6 (optional) — Run a specific test file

\`\`\`bash
npx playwright test tests/generated.spec.js
\`\`\`

Or with browser visible:

\`\`\`bash
npm run test:headed -- tests/generated.spec.js
\`\`\`

---

## Summary (copy-paste)

**One-time setup:**

\`\`\`bash
cd <your-extracted-folder>
npm install
npm run install:browsers
\`\`\`

**Run test cases (choose one):**

\`\`\`bash
npm test
\`\`\`

or to **open the browser and watch test cases run:**

\`\`\`bash
npm run test:headed
\`\`\`

or to open the **interactive UI:**

\`\`\`bash
npm run test:ui
\`\`\`

---

## Scripts in package.json

| Script | Command | Use when |
|--------|---------|----------|
| \`test\` | \`npm test\` | Run all tests headless (terminal only). |
| \`test:headed\` | \`npm run test:headed\` | **Open browser and perform each test case (see clicks, navigation).** |
| \`test:ui\` | \`npm run test:ui\` | Open Playwright UI to pick tests and debug. |
| \`install:browsers\` | \`npm run install:browsers\` | One-time: download Chromium, Firefox, WebKit. |
`.trim();

/** Short copy-paste block for in-app display */
export const PLAYWRIGHT_RUN_STEPS_SUMMARY = `cd <your-extracted-folder>
npm install
npm run install:browsers
npm run test:headed   # open browser and watch test cases run`;
