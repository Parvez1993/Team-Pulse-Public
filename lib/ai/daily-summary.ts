import { createOpenAiClient, getOpenAiSummaryModel } from "@/lib/openai/client";

type SummaryLog = {
  title: string;
  description: string | null;
  type: "activity" | "error" | "incident";
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "done";
  created_at: string;
};

function formatLogLine(log: SummaryLog) {
  const createdAt = new Date(log.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const description = log.description?.replace(/\s+/g, " ").trim() || "";
  const trimmedDescription =
    description.length > 160 ? `${description.slice(0, 157)}...` : description;

  return [
    `- ${createdAt}`,
    `[${log.type} / ${log.severity} / ${log.status}]`,
    log.title,
    trimmedDescription ? `- ${trimmedDescription}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function generateDailySummary({
  teamName,
  logs,
}: {
  teamName: string;
  logs: SummaryLog[];
}) {
  if (!logs.length) {
    return "No team activity was logged in the last 24 hours.";
  }

  const openAi = createOpenAiClient();
  const model = getOpenAiSummaryModel();
  const condensedLogs = logs.slice(0, 20).map(formatLogLine).join("\n");

  const response = await openAi.responses.create({
    model,
    instructions:
      "You are summarizing the last 24 hours of team logs for an internal SaaS dashboard. " +
      "Write in easy business English. Be factual. Do not invent missing details. " +
      "Keep the result under 120 words. Start with one short overview sentence, then 3 short bullet points. " +
      "Prioritize critical or high severity items, repeated issues, and anything still open or in progress.",
    input: `Team: ${teamName}\nLast 24 hours logs (${logs.length} total, showing up to 20):\n${condensedLogs}`,
    max_output_tokens: 220,
  });

  return response.output_text.trim();
}
