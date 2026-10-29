export type Destination = {
  _id: string;
  destinationName: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

const DESTINATIONS_PATH = "/api/destination";

/**
 * Absolute base URL for self-fetching our own API routes from Server
 * Components. On Vercel this must be set to the production origin
 * (e.g. https://wanderlusts-frontend.vercel.app); locally it falls back to
 * http://localhost:3000.
 */
function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export { getApiBaseUrl };

/**
 * Next.js aborts in-flight `fetch()` calls once a prerender pass completes.
 * During `next build` that rejection is expected — the real request re-runs the
 * fetch — so it must not be reported as an application error.
 */
function isPrerenderAbort(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const digest = (error as Error & { digest?: string }).digest;

  return (
    digest === "HANGING_PROMISE_REJECTION" ||
    error.message.includes("During prerendering, fetch() rejects")
  );
}

function logFetchError(label: string, error: unknown): void {
  if (isPrerenderAbort(error)) return;

  // Log error.message (string) instead of raw Error object to avoid Next.js Turbopack CodeFrameColorMode bug
  console.error(
    label,
    error instanceof Error ? error.message : String(error),
  );
}

function normalizeDestination(destination: Destination): Destination {
  return {
    ...destination,
    destinationName: String(destination.destinationName ?? "").trim(),
    country: String(destination.country ?? "").trim(),
    category: String(destination.category ?? "").trim(),
    price: String(destination.price ?? "").trim(),
    duration: String(destination.duration ?? "").trim(),
    departureDate: String(destination.departureDate ?? "").trim(),
    imageUrl: String(destination.imageUrl ?? "").trim(),
    description: String(destination.description ?? "").trim(),
  };
}

export async function getDestinations(): Promise<Destination[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}${DESTINATIONS_PATH}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`Failed to load destinations (${res.status})`);
      return [];
    }

    const destinations: Destination[] = await res.json();

    return destinations.map(normalizeDestination);
  } catch (error) {
    logFetchError("Unable to fetch destinations:", error);
    return [];
  }
}

export async function getDestination(
  id: string,
): Promise<Destination | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(
      `${baseUrl}${DESTINATIONS_PATH}/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );

    // A missing (or malformed) id should render the not-found page rather than
    // breaking the route.
    if (!res.ok) return null;

    const destination: Destination = await res.json();

    if (!destination?._id) return null;

    return normalizeDestination(destination);
  } catch (error) {
    logFetchError(`Unable to fetch destination ${id}:`, error);
    return null;
  }
}

export function toPriceNumber(price: string | number) {
  const value = Number(String(price ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

export function formatPrice(price: string | number) {
  const value = toPriceNumber(price);
  return value > 0 ? `$${value.toLocaleString("en-US")}` : `$${price}`;
}

export function formatCategory(category: string) {
  if (!category) return "";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function formatDepartureDate(date: string) {
  if (!date) return "Flexible departure";

  // Date-only values are parsed as local time so the rendered day does not
  // shift with the server timezone.
  const parsed = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00` : date,
  );

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Ask Unsplash for an already-resized image. The raw uploads are several
 * megabytes, which makes the Next.js image optimizer time out.
 */
export function withImageParams(url: string, width = 1200) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "images.unsplash.com") return url;

    parsed.searchParams.set("auto", "format");
    parsed.searchParams.set("fit", "crop");
    parsed.searchParams.set("w", String(width));
    parsed.searchParams.set("q", "75");

    return parsed.toString();
  } catch {
    return url;
  }
}