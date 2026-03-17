# Running Generated Playwright Tests Here

This project is configured so generated Playwright files can run directly from `tests/generated`.

## Option A — Download as ZIP (recommended)

1. From the app **results** page, click **Download as ZIP**.
2. Extract the ZIP on your machine.
3. Open a terminal in the extracted folder and run:

```bash
npm install
npm run install:browsers
npm test
```

To **open the browser and watch test cases run:** `npm run test:headed`  
To open the **interactive UI:** `npm run test:ui`

The ZIP includes a full runnable project and a **README.md** with step-by-step Playwright instructions.

## Option B — Single file into this repo

1. From the app results page, click **Download** for a Playwright result.
2. Move the downloaded file into `tests/generated/`.
3. Keep the filename as-is, for example:

```text
tests/generated/playwright-www-bacancytechnology-com.js
```

The Playwright config in this repo is already set up to detect that filename pattern.

## One-time setup (for Option B)

```bash
npm install
npm run test:generated:install
```

## Run all generated Playwright tests

```bash
npm run test:generated
```

## Run a specific generated file

```bash
npx playwright test tests/generated/playwright-www-bacancytechnology-com.js
```

## Run with browser visible

```bash
npm run test:generated:headed
```

## Open Playwright UI mode

```bash
npm run test:generated:ui
```
