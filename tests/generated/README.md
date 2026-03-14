# Running Generated Playwright Tests Here

This project is configured so generated Playwright files can run directly from `tests/generated`.

## One-time setup

```bash
npm install
npm run test:generated:install
```

## Use a generated file

1. From the app results page, click **Download** for a Playwright result.
2. Move the downloaded file into `tests/generated/`.
3. Keep the filename as-is, for example:

```text
tests/generated/playwright-www-bacancytechnology-com.js
```

The Playwright config in this repo is already set up to detect that filename pattern.

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
