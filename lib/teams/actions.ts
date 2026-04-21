"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/logs/actions";

function getStringField(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

export async function createTeamAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const teamName = getStringField(formData, "teamName");

  if (!teamName) return { error: "Team name is required." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_team", {
    team_name: teamName,
  });

  if (error) {
    return { error: error.message ?? "We could not create your team." };
  }

  revalidatePath("/dashboard");

  return { success: "Team created successfully." };
}
