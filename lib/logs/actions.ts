"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  LOG_ATTACHMENT_ALLOWED_MIME_TYPES,
  LOG_ATTACHMENTS_BUCKET,
  LOG_ATTACHMENT_MAX_SIZE_BYTES,
} from "@/lib/logs/constants";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { success: string } | { error: string } | null;

function getStringField(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function getLogType(formData: FormData) {
  const type = getStringField(formData, "type");

  return type === "activity" || type === "error" || type === "incident"
    ? type
    : "activity";
}

function getLogSeverity(formData: FormData) {
  const severity = getStringField(formData, "severity");

  return (
    severity === "low" ||
    severity === "medium" ||
    severity === "high" ||
    severity === "critical"
  )
    ? severity
    : "low";
}

function getLogStatus(formData: FormData) {
  const status = getStringField(formData, "status");

  return (
    status === "open" ||
    status === "in_progress" ||
    status === "resolved" ||
    status === "done"
  )
    ? status
    : "open";
}

function getAttachmentFile(formData: FormData) {
  const value = formData.get("attachment");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(-120);
}

export async function createLogAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const teamId = getStringField(formData, "teamId");
  const title = getStringField(formData, "title");
  const description = getStringField(formData, "description");
  const type = getLogType(formData);
  const severity = getLogSeverity(formData);
  const status = getLogStatus(formData);
  const attachment = getAttachmentFile(formData);

  if (!teamId) return { error: "Team is required." };
  if (!title) return { error: "Log title is required." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?error=Please%20sign%20in%20again.");

  if (attachment && attachment.size > LOG_ATTACHMENT_MAX_SIZE_BYTES) {
    return { error: "Attachments must be 5MB or smaller." };
  }

  if (
    attachment &&
    !LOG_ATTACHMENT_ALLOWED_MIME_TYPES.includes(
      attachment.type as (typeof LOG_ATTACHMENT_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return { error: "This file type is not supported." };
  }

  let filePath: string | null = null;

  if (attachment) {
    const safeFileName = sanitizeFileName(attachment.name) || "attachment";
    filePath = `${teamId}/${user.id}/${crypto.randomUUID()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(LOG_ATTACHMENTS_BUCKET)
      .upload(filePath, attachment, {
        contentType: attachment.type,
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message ?? "We could not upload the attachment." };
    }
  }

  const { error } = await supabase.from("logs").insert({
    team_id: teamId,
    user_id: user.id,
    title,
    description,
    type,
    severity,
    status,
    file_url: filePath,
  });

  if (error) {
    if (filePath) {
      await supabase.storage.from(LOG_ATTACHMENTS_BUCKET).remove([filePath]);
    }

    return { error: error.message ?? "We could not create the log." };
  }

  revalidatePath("/dashboard");

  return { success: "Log created successfully." };
}

export async function updateLogStatusAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const logId = getStringField(formData, "logId");
  const status = getLogStatus(formData);

  if (!logId) return { error: "Log id is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("logs")
    .update({ status })
    .eq("id", logId);

  if (error) {
    return { error: error.message ?? "We could not update the log status." };
  }

  revalidatePath("/dashboard");

  return { success: "Log status updated." };
}
