"use client";

import { authClient } from "@/lib/auth-client";

/**
 * Base URL of the Express API (`wanderlust-server`).
 * Read from NEXT_PUBLIC_API_URL in .env; there is intentionally no fallback.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class AuthTokenError extends Error {
  constructor(message = "Your session has expired. Please sign in again.") {
    super(message);
    this.name = "AuthTokenError";
  }
}

/**
 * Protected Express routes verify `Authorization: Bearer <jwt>` against this
 * app's JWKS endpoint. Cookies belong to localhost:3000, and CORS requests to
 * port 5000 do not carry them, so every protected call needs an explicit
 * token from the better-auth JWT plugin.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new AuthTokenError();
  }

  return { Authorization: `Bearer ${data.token}` };
}

/** fetch() against the Express API with a fresh bearer token attached. */
export async function apiFetch(
  path: string,
  init: Omit<RequestInit, "headers"> & { headers?: Record<string, string> } = {},
) {
  const { headers, ...rest } = init;

  return fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
      ...(await getAuthHeaders()),
    },
  });
}
