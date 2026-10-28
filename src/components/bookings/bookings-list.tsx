"use client";

import { useState } from "react";
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

  const handleDelete = (id: string) => {
    setBookings((prev) =>
      prev.filter((b) => (b._id ?? b.id ?? b.bookingId) !== id),
    );
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
