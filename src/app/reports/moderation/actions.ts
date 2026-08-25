"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createHash } from "node:crypto";

import { moderateReport } from "@/lib/reports/store";

const MOD_COOKIE = "ss_mod";

/**
 * Dev fallback keeps the demo usable without configuration; production should
 * always set MODERATION_TOKEN in the environment.
 */
function expectedToken(): string {
  return process.env.MODERATION_TOKEN ?? "scamshield-demo";
}

/** Only a hash of the token is stored client-side. */
function tokenFingerprint(token: string): string {
  return createHash("sha256")
    .update(`scamshield:${token}`)
    .digest("hex")
    .slice(0, 24);
}

/** Session check shared by the page and the actions below. */
export async function isModerator(): Promise<boolean> {
  const cookieStore = await cookies();
  return (
    cookieStore.get(MOD_COOKIE)?.value === tokenFingerprint(expectedToken())
  );
}

export async function signInModerator(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  if (token !== expectedToken()) {
    redirect("/reports/moderation?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(MOD_COOKIE, tokenFingerprint(expectedToken()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  redirect("/reports/moderation");
}

export async function signOutModerator() {
  const cookieStore = await cookies();
  cookieStore.delete(MOD_COOKIE);
  redirect("/reports/moderation");
}

export async function moderateReportAction(
  formData: FormData
): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || (status !== "approved" && status !== "rejected")) {
    return;
  }

  // Re-verify the moderator session inside the action itself.
  if (!(await isModerator())) {
    redirect("/reports/moderation?error=expired");
  }

  await moderateReport(id, status);
  revalidatePath("/reports/moderation");
  revalidatePath("/reports");
}
