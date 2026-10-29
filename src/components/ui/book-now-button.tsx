"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { authClient } from "@/lib/auth-client";
import { formatPrice, type Destination } from "@/lib/destinations";

const BOOKING_API_URL = "/api/booking";

interface BookNowButtonProps {
  destination: Destination;
  className?: string;
}

export default function BookNowButton({
  destination,
  className,
}: BookNowButtonProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = session?.user;
  const isAuthenticated = !!user;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated || !user) {
      setError("Please sign in to book this destination.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const departureDate = (formData.get("departureDate") as string) || "";

    if (!departureDate) {
      setError("Please select a departure date.");
      return;
    }

    const payload = {
      destinationId: destination._id,
      destination: {
        destinationName: destination.destinationName,
        country: destination.country,
        category: destination.category,
        price: destination.price,
        duration: destination.duration,
        imageUrl: destination.imageUrl,
        description: destination.description,
        departureDate: destination.departureDate,
      },
      departureDate,
      bookingDate: new Date().toISOString(),
      user: {
        username: user.name ?? "",
        email: user.email ?? "",
      },
    };

    setIsBooking(true);

    try {
      const res = await fetch(BOOKING_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert(`Booking confirmed for ${destination.destinationName}!`);
        router.push("/profile");
        router.refresh();
      } else if (res.status === 401) {
        setError("Your session has expired. Please sign in again.");
      } else {
        setError(
          data.error ||
            data.message ||
            "Failed to create booking. Please try again.",
        );
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Could not connect to the booking server.");
    } finally {
      setIsBooking(false);
    }
  };

  if (isPending) {
    return (
      <aside className={cn("h-fit rounded-sm border border-neutral-200 bg-white p-6", className)}>
        <p className="text-sm text-neutral-500">Loading session…</p>
      </aside>
    );
  }

  return (
    <aside className={cn("h-fit rounded-sm border border-neutral-200 bg-white p-6", className)}>
      <p className="text-[13px] text-neutral-500">Starting from</p>
      <p className="mt-1 text-3xl font-semibold text-[#10a5c4]">
        {formatPrice(destination.price)}
      </p>
      <p className="text-[13px] text-neutral-500">per person</p>

      {!isAuthenticated && (
        <div className="mt-4 p-3 rounded border border-amber-200 bg-amber-50 text-xs text-amber-800">
          Please sign in to book this destination.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500 mb-1">
          Departure date
        </label>
        <input
          type="date"
          name="departureDate"
          required
          className="mt-1 w-full rounded border border-neutral-200 bg-[#f9fafb] px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#10a5c4]"
        />
        {error && (
          <p className="mt-2 text-xs text-[#ef5350]" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isBooking || !isAuthenticated}
          className="mt-3 w-full rounded bg-[#10a5c4] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0e8ea9] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBooking ? "Booking…" : "Book Now"}
        </button>
      </form>
    </aside>
  );
}
