"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/logs/actions";

function getStringField(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function getInviteRole(formData: FormData) {
  const role = getStringField(formData, "role");

  return role === "admin" || role === "member" || role === "viewer"
    ? role
    : "member";
}

export async function createInvitationAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const teamId = getStringField(formData, "teamId");
  const email = getStringField(formData, "email").toLowerCase();
  const role = getInviteRole(formData);

  if (!teamId) return { error: "Team id is required." };
  if (!email) return { error: "Invite email is required." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?error=Please%20sign%20in%20again.");

  const { error } = await supabase.from("invitations").insert({
    team_id: teamId,
    email,
    role,
    invited_by: user.id,
  });

  if (error) {
    return { error: error.message ?? "We could not create the invitation." };
  }

  revalidatePath("/dashboard");

  return { success: `Invitation sent to ${email}.` };
}

export async function removeInvitationAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const invitationId = getStringField(formData, "invitationId");
  const email = getStringField(formData, "email");

  if (!invitationId) return { error: "Invitation id is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("invitations")
    .delete()
    .eq("id", invitationId)
    .eq("status", "pending");

  if (error) {
    return { error: error.message ?? "We could not remove the invitation." };
  }

  revalidatePath("/dashboard");

  return { success: email ? `Invitation removed for ${email}.` : "Invitation removed." };
}

export async function acceptInvitationAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const invitationId = getStringField(formData, "invitationId");

  if (!invitationId) return { error: "Invitation id is required." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_invitation", {
    invitation_id: invitationId,
  });

  if (error) {
    return { error: error.message ?? "We could not accept the invitation." };
  }

  revalidatePath("/dashboard");

  return { success: "Invitation accepted successfully." };
}
