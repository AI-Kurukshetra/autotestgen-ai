import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

import type { AiProvider, DomScanResult, Framework, Language } from "@/lib/types";
import { getAppSettings } from "@/lib/appSettings";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.3-70b-versatile";

/** gemini-1.5-flash is retired on many API keys; prefer 2.5 / 2.0. Override with GEMINI_MODEL. */
const GEMINI_MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite"
] as const;

// Rough limit to keep Groq under TPM for very large pages.
// Tokens ~= characters / 4, so 12000 tokens ~= 48000 chars.
// We stay well under that per request.
const MAX_DOM_CHARACTERS = 20000;

function stripCodeFence(input: string) {
  return input.replace(/^```[\w-]*\n?/, "").replace(/\n?```$/, "").trim();
}

function buildDomSnippet(domStructure: DomScanResult): string {
  const json = JSON.stringify(domStructure, null, 2);
  if (json.length <= MAX_DOM_CHARACTERS) {
    return json;
  }

  const truncated = json.slice(0, MAX_DOM_CHARACTERS);
  return `${truncated}\n\n/* DOM summary truncated for length. The page is large; focus on primary interactive flows and stable selectors only. */`;
}

const systemPrompt =
  "You generate production-ready UI automation tests. Output only the final source code with no markdown fences, explanations, or commentary. Use resilient selectors from the DOM scan when possible. Include a small happy-path flow, simple assertions when the framework supports them, and at least one sensible edge-case or negative-path check when the available DOM structure makes that possible.";

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
  const { ai_provider: provider } = await getAppSettings();
  const groqApiKey = process.env.GROQ_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const domSnippet = buildDomSnippet(domStructure);
  const userMessage = `Generate a ${framework} test suite in ${language} for ${url} using this DOM summary. Prefer stable selectors, cover the main user flow, and add one realistic failure or validation scenario when the page elements support it.\n${domSnippet}`;

  if (provider === "gemini" && geminiApiKey) {
    const explicit = process.env.GEMINI_MODEL?.trim();
    const modelsToTry = explicit
      ? [explicit]
      : [...GEMINI_MODEL_FALLBACKS];
    const apiVersions = ["v1", "v1beta"] as const;
    let lastErr: unknown;

    for (const modelName of modelsToTry) {
      for (const apiVersion of apiVersions) {
        try {
          const genAI = new GoogleGenerativeAI(geminiApiKey);
          const model = genAI.getGenerativeModel(
            { model: modelName, systemInstruction: systemPrompt },
            { apiVersion }
          );
          const result = await model.generateContent(userMessage);
          const raw = result.response.text()?.trim() ?? "";
          const output = stripCodeFence(raw);
          if (output) {
            return output;
          }
        } catch (e) {
          lastErr = e;
          const msg = e instanceof Error ? e.message : String(e);
          const isNotFound =
            msg.includes("404") ||
            /not found|not supported for generateContent/i.test(msg);
          if (isNotFound) {
            continue;
          }
          throw e;
        }
      }
    }

    throw new Error(
      lastErr instanceof Error
        ? lastErr.message
        : "Gemini: no model worked. Set GEMINI_MODEL to an ID from https://ai.google.dev/gemini-api/docs/models (e.g. gemini-2.5-flash)."
    );
  }

  if (provider === "groq" && groqApiKey) {
    const client = new OpenAI({
      apiKey: groqApiKey,
      baseURL: GROQ_BASE_URL
    });
    const response = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });
    const raw =
      response.choices?.[0]?.message?.content?.trim() ?? "";
    const output = stripCodeFence(raw);
    if (!output) {
      throw new Error("Groq returned an empty response.");
    }
    return output;
  }

  if (provider === "openai" && openaiApiKey) {
    const client = new OpenAI({ apiKey: openaiApiKey });
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userMessage }]
        }
      ]
    });

    const output = stripCodeFence(response.output_text || "");

    if (!output) {
      throw new Error("OpenAI returned an empty response.");
    }

    return output;
  }

  throw new Error(
    "AI provider is not fully configured. Set the API key for the selected provider in .env (GROQ_API_KEY, GEMINI_API_KEY, or OPENAI_API_KEY) or switch provider in Admin → App settings."
  );
}
