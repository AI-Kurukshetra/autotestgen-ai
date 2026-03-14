import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const RUN_TIMEOUT_MS = 60_000;
const MAX_LOG_CHARS = 12_000;
const DEFAULT_CHROME_PATH = "/usr/bin/google-chrome";

type CommandResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
};

export type TestRunOutcome = {
  status: "passed" | "failed";
  summary: string;
  logs: string;
  command: string;
};

function truncateLogs(input: string) {
  if (input.length <= MAX_LOG_CHARS) {
    return input;
  }

  return `${input.slice(0, MAX_LOG_CHARS)}\n\n[output truncated]`;
}

function looksLikeEsm(code: string) {
  return /^\s*import\s/m.test(code) || /^\s*export\s/m.test(code);
}

function ensurePlaywrightRuntime() {
  try {
    require.resolve("@playwright/test/package.json");
  } catch {
    throw new Error(
      "Playwright execution is not installed on this server. Run npm install -D @playwright/test first."
    );
  }
}

async function runCommand(args: string[]): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        CI: "1",
        PLAYWRIGHT_CHROME_PATH:
          process.env.PLAYWRIGHT_CHROME_PATH || DEFAULT_CHROME_PATH
      },
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, RUN_TIMEOUT_MS);

    child.stdout.on("data", (chunk: Buffer | string) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk: Buffer | string) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        exitCode: code ?? 1,
        stdout,
        stderr,
        timedOut
      });
    });
  });
}

export async function runGeneratedPlaywrightTest(
  code: string
): Promise<TestRunOutcome> {
  ensurePlaywrightRuntime();

  const tempDir = await mkdtemp(join(process.cwd(), ".autotestgen-run-"));
  const isEsm = looksLikeEsm(code);
  const testFile = join(tempDir, "generated.spec.js");
  const configFile = join(tempDir, "playwright.config.cjs");

  try {
    if (isEsm) {
      await writeFile(
        join(tempDir, "package.json"),
        JSON.stringify({ type: "module" }, null, 2),
        "utf8"
      );
    }

    await writeFile(testFile, code, "utf8");
    await writeFile(
      configFile,
      `const chromePath = process.env.PLAYWRIGHT_CHROME_PATH;

const use = {
  headless: true,
  ignoreHTTPSErrors: true,
  actionTimeout: 15000,
  navigationTimeout: 30000
};

if (chromePath) {
  use.launchOptions = { executablePath: chromePath };
}

module.exports = {
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  timeout: 45000,
  workers: 1,
  use
};
`,
      "utf8"
    );

    const command = `npx playwright test ${testFile} --config ${configFile} --reporter=line`;
    const result = await runCommand([
      "playwright",
      "test",
      testFile,
      "--config",
      configFile,
      "--reporter=line"
    ]);
    const combinedLogs = truncateLogs(
      [result.stdout.trim(), result.stderr.trim()].filter(Boolean).join("\n\n")
    );

    if (result.timedOut) {
      return {
        status: "failed",
        summary: "Run stopped after 60 seconds.",
        logs: combinedLogs || "Execution timed out before Playwright returned output.",
        command
      };
    }

    if (result.exitCode === 0) {
      return {
        status: "passed",
        summary: "Playwright finished successfully.",
        logs: combinedLogs || "Playwright completed without additional output.",
        command
      };
    }

    return {
      status: "failed",
      summary: "Playwright reported a failing or invalid suite.",
      logs: combinedLogs || "Playwright exited with a non-zero status.",
      command
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}
