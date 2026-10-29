"use client";

/**
 * fetch() against the Next.js API routes (`/api/*`). Cookies are sent
 * automatically because these are same-origin, so no bearer token is needed.
 */
export async function apiFetch(
  path: string,
  init: Omit<RequestInit, "headers"> & { headers?: Record<string, string> } = {},
) {
  const { headers, ...rest } = init;

  return fetch(`/api${path}`, {
    ...rest,
    headers: {
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  });
}
