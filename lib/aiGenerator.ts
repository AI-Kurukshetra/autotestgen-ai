import OpenAI from "openai";

import type { DomScanResult, Framework, Language } from "@/lib/types";

function stripCodeFence(input: string) {
  return input.replace(/^```[\w-]*\n?/, "").replace(/\n?```$/, "").trim();
}

export async function generateAutomationTest({
  url,
  framework,
  language,
  domStructure
}: {
  url: string;
  framework: Framework;
  language: Language;
  domStructure: DomScanResult;
}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY.");
  }

  const client = new OpenAI({ apiKey });

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You generate production-ready UI automation tests. Output only the final source code with no markdown fences, explanations, or commentary. Use resilient selectors from the DOM scan when possible. Include a small happy-path flow plus simple assertions when the framework supports it."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Generate a ${framework} test suite in ${language} for ${url} using this DOM summary:\n${JSON.stringify(
              domStructure,
              null,
              2
            )}`
          }
        ]
      }
    ]
  });

  const output = stripCodeFence(response.output_text || "");

  if (!output) {
    throw new Error("OpenAI returned an empty response.");
  }

  return output;
}
