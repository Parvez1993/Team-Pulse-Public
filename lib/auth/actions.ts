"use server";

import { redirect } from "next/navigation";

import { getAppUrl } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function getStringField(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function withMessage(
  pathname: string,
  key: "error" | "success",
  value: string,
) {
  const searchParams = new URLSearchParams({ [key]: value });

  return `${pathname}?${searchParams.toString()}`;
}

export async function registerAction(formData: FormData) {
  const name = getStringField(formData, "name");
  const workspace = getStringField(formData, "workspace");
  const email = getStringField(formData, "email");
  const password = getStringField(formData, "password");

  if (!name || !email || !password) {
    redirect(withMessage("/register", "error", "Name, email, and password are required."));
  }

  const supabase = await createClient();
  const appUrl = getAppUrl();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback?next=/dashboard`,
      data: {
        full_name: name,
        name,
        workspace_name: workspace,
      },
    },
  });

  if (error) {
    redirect(withMessage("/register", "error", error.message));
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirect(
    withMessage(
      "/register",
      "success",
      "Check your email to confirm your account.",
    ),
  );
}

export async function loginAction(formData: FormData) {
  const email = getStringField(formData, "email");
  const password = getStringField(formData, "password");

  if (!email || !password) {
    redirect(withMessage("/login", "error", "Email and password are required."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(withMessage("/login", "error", error.message));
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function githubOAuthAction(formData: FormData) {
  const authView = getStringField(formData, "authView");
  const fallbackPath = authView === "register" ? "/register" : "/login";

  const supabase = await createClient();
  const appUrl = getAppUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${appUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error || !data.url) {
    redirect(
      withMessage(
        fallbackPath,
        "error",
        error?.message ?? "We could not start GitHub sign in.",
      ),
    );
  }

  redirect(data.url);
}
