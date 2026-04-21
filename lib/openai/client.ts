import OpenAI from "openai";

let openaiClient: OpenAI | undefined;

function getOpenAiApiKey() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing required environment variable: OPENAI_API_KEY");
  }

  return apiKey;
}

export function getOpenAiSummaryModel() {
  return process.env.OPENAI_SUMMARY_MODEL || "gpt-4.1-nano";
}

export function createOpenAiClient() {
  openaiClient ??= new OpenAI({
    apiKey: getOpenAiApiKey(),
  });

  return openaiClient;
}
