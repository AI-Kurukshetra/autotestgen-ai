type ExecutionSupport = {
  supported: boolean;
  message: string;
};

export function getExecutionSupport(
  framework: string,
  language: string
): ExecutionSupport {
  if (framework !== "Playwright" || language !== "JavaScript") {
    return {
      supported: false,
      message:
        "Live execution is currently available for Playwright JavaScript suites only."
    };
  }

  return {
    supported: true,
    message:
      "Runs server-side with Playwright in headless Chrome and returns logs here."
  };
}
