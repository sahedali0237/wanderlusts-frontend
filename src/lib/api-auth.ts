import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Validates the session cookie/JWT and returns the full session with user data.
 * Returns null if invalid/missing.
 */
export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}