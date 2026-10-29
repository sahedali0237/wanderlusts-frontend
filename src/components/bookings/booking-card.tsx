"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle, MapPin, Trash2, Eye } from "lucide-react";
import { cn } from "cn";
import { apiFetch } from "@/lib/api-client";
import {
  formatDepartureDate,
  formatPrice,
  withImageParams,
} from "@/lib/destinations";

export type Booking = {
  _id?: string;
  id?: string;
  bookingId?: string;
  status?: string;
  destinationId?: string;
  destination?: {
    _id?: string;
    destinationName?: string;
    country?: string;
    category?: string;
    price?: string | number;
    duration?: string;
    departureDate?: string;
    imageUrl?: string;
  };
  departureDate?: string;
  price?: string | number;
  destinationName?: string;
  country?: string;
  imageUrl?: string;
};

function getDestinationId(booking: Booking) {
  return booking.destination?._id ?? booking.destinationId;
}

function getDestinationName(booking: Booking) {
  return (
    booking.destination?.destinationName ??
    booking.destinationName ??
    "Untitled Trip"
  );
}

function getPrice(booking: Booking) {
  return booking.destination?.price ?? booking.price;
}

function getImageUrl(booking: Booking) {
  return booking.destination?.imageUrl ?? booking.imageUrl;
}

function getDepartureDate(booking: Booking) {
  return booking.departureDate ?? booking.destination?.departureDate;
}

function getBookingId(booking: Booking) {
  return booking._id ?? booking.id ?? booking.bookingId;
}

export default function BookingCard({
  booking,
  userEmail,
  onDelete,
}: {
  booking: Booking;
  userEmail?: string;
  onDelete?: (id: string) => void;
}) {
  const destinationId = getDestinationId(booking);
  const name = getDestinationName(booking);
  const price = getPrice(booking);
  const departure = getDepartureDate(booking);
  const imageUrl = getImageUrl(booking);
  const bookingId = getBookingId(booking);
  const status = booking.status;

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!bookingId) return;
    if (!userEmail) {
      setDeleteError("You must be signed in to cancel a booking.");
      return;
    }
    if (!window.confirm("Cancel this booking?")) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await apiFetch(
        `/booking/${encodeURIComponent(bookingId)}`,
        {
          method: "DELETE",
          body: JSON.stringify({ email: userEmail }),
        },
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        onDelete?.(bookingId);
      } else if (res.status === 403) {
        setDeleteError("You cannot delete someone else's booking.");
      } else if (res.status === 404) {
        setDeleteError("Booking not found.");
      } else if (res.status === 401) {
        setDeleteError("Your session has expired. Please sign in again.");
      } else {
        setDeleteError(data.message || "Failed to cancel booking.");
      }
    } catch (err) {
      console.error("Delete booking error:", err);
      setDeleteError("Could not reach the booking server.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article
      className={cn(
        "flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm",
        "hover:shadow-md transition-all duration-200",
      )}
    >
      <div className="shrink-0 relative w-48 h-32 rounded-lg overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <Image
            src={withImageParams(imageUrl)}
            alt={name}
            fill
            unoptimized
            sizes="(max-width: 768px) 120px, 200px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200" />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-sm bg-[#dcfce7] px-2 py-0.5 text-[11px] font-semibold text-[#166534] shadow-sm">
            <CheckCircle className="h-3 w-3" strokeWidth={1.8} aria-hidden="true" />
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Confirmed"}
          </span>
        </div>

        <h3 className="text-lg font-medium text-neutral-900 leading-snug">
          {name}
        </h3>

        <div className="flex items-center gap-3 text-[12px] text-neutral-500">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
            <span>Departure: {departure ? formatDepartureDate(departure) : "TBD"}</span>
          </div>
          <div className="h-3.5 w-px bg-neutral-300" aria-hidden="true" />
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
            <span>Booking ID: {bookingId ?? "—"}</span>
          </div>
        </div>

        <div className="mt-auto flex items-baseline justify-between gap-2">
          <span className="text-2xl font-semibold text-[#10a5c4]">
            {formatPrice(price ?? "0")}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "border-[#ef5350] bg-transparent text-[#ef5350] hover:bg-[#ef5350]/5",
                "focus-visible:ring-[#ef5350]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              disabled={!bookingId || isDeleting}
            >
              {isDeleting ? (
                <span className="flex items-center gap-1.5">Deleting…</span>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                  Cancel
                </>
              )}
            </button>
            {destinationId ? (
              <Link
                href={`/destinations/${destinationId}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  "bg-[#10a5c4] hover:bg-[#0e8ea9]",
                  "focus-visible:ring-[#10a5c4]",
                )}
              >
                <Eye className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                View
              </Link>
            ) : (
              <button
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm font-medium text-neutral-500 cursor-not-allowed opacity-50"
                disabled
              >
                <Eye className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                View
              </button>
            )}
          </div>
        </div>

        {deleteError && (
          <p className="mt-2 text-[11px] text-[#ef5350]">{deleteError}</p>
        )}
      </div>
    </article>
  );
}
