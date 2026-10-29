import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center | Wanderlast",
  description: "Wanderlast Help Center and support.",
};

export default function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl mb-6">
        Help Center
      </h1>
      <div className="space-y-6">
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            How do I book a trip?
          </h2>
          <p className="text-neutral-600">
            Browse our destinations, select one you like, and complete the
            booking form. You&rsquo;ll need to be signed in to create a booking.
          </p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            How do I view my bookings?
          </h2>
          <p className="text-neutral-600">
            Go to <strong>My Bookings</strong> from the navigation menu to see
            all your upcoming and past trips.
          </p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            How do I cancel a booking?
          </h2>
          <p className="text-neutral-600">
            Open your booking in My Bookings and click <strong>Cancel</strong>.
            You can only cancel bookings tied to your own account.
          </p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            Still need help?
          </h2>
          <p className="text-neutral-600">
            Contact us at <a href="mailto:info@wanderlast.com" className="text-[#10a5c4] hover:underline">
              info@wanderlast.com
            </a> or call <a href="tel:+17869011622" className="text-[#10a5c4] hover:underline">
              786 901 1622
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
