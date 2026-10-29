"use client";

import { useState, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";
import BookingCard from "./booking-card";
import type { Booking } from "./booking-card";

export default function BookingsList({
  initialBookings,
  userEmail,
}: {
  initialBookings: Booking[];
  userEmail?: string;
}) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const refreshBookings = useCallback(async () => {
    try {
      const res = await apiFetch("/my-booking", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();

        let fetched: Booking[] = [];
        if (Array.isArray(json)) {
          fetched = json;
        } else if (Array.isArray(json?.bookings)) {
          fetched = json.bookings;
        } else if (Array.isArray(json?.data)) {
          fetched = json.data;
        }

        setBookings(fetched);
      }
    } catch {
      // On refetch failure, keep the current (optimistically updated) list.
    }
  }, []);

  const handleDelete = async (id: string) => {
    // Optimistic update so the booking disappears immediately.
    setBookings((prev) =>
      prev.filter((b) => (b._id ?? b.id ?? b.bookingId) !== id),
    );

    // Refetch from the server so the list stays in sync even if the
    // optimistic update and server state ever diverge.
    await refreshBookings();
  };

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
        <p className="text-neutral-500">
          You do not have any bookings yet. Start planning your next trip.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-neutral-200">
      {bookings.map((booking) => (
        <li key={booking._id || booking.id || booking.bookingId}>
          <BookingCard
            booking={booking}
            userEmail={userEmail}
            onDelete={handleDelete}
          />
        </li>
      ))}
    </ul>
  );
}
