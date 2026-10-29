import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getApiBaseUrl } from "@/lib/destinations";
import BookingsList from "@/components/bookings/bookings-list";
import type { Booking } from "@/components/bookings/booking-card";

const pulse = "animate-pulse rounded-lg bg-neutral-200";

function BookingsSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <div className="h-32 w-48 shrink-0 rounded-lg bg-neutral-200" />
          <div className="flex flex-1 flex-col gap-3">
            <div className={`${pulse} h-5 w-20`} />
            <div className={`${pulse} h-6 w-2/3`} />
            <div className={`${pulse} h-4 w-1/2`} />
            <div className="mt-auto flex items-center justify-between">
              <div className={`${pulse} h-7 w-24`} />
              <div className={`${pulse} h-9 w-40`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function BookingsContent() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  const user = session?.user;
  let bookings: Booking[] = [];

  if (user?.email) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/my-booking`, {
        cache: "no-store",
        headers: requestHeaders,
      });

      if (res.ok) {
        const json = await res.json();

        if (Array.isArray(json)) {
          bookings = json;
        } else if (Array.isArray(json?.bookings)) {
          bookings = json.bookings;
        } else if (Array.isArray(json?.data)) {
          bookings = json.data;
        }
      }
    } catch {
      bookings = [];
    }
  }

  return (
    <BookingsList
      initialBookings={bookings}
      userEmail={user?.email ?? undefined}
    />
  );
}

export default function MyBookingsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl">
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Manage and view your upcoming travel plans
        </p>
      </div>

      <Suspense fallback={<BookingsSkeleton />}>
        <BookingsContent />
      </Suspense>
    </div>
  );
}
