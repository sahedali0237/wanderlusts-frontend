import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Wanderlast",
  description: "Wanderlast Privacy Policy.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl mb-6">
        Privacy Policy
      </h1>
      <div className="prose prose-neutral max-w-none">
        <p>
          At Wanderlast, we respect your privacy and are committed to protecting
          your personal information.
        </p>
        <h2 className="mt-6 text-xl font-semibold text-neutral-800">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as your name,
          email address, and booking details when you create an account or make
          a booking.
        </p>
        <h2 className="mt-6 text-xl font-semibold text-neutral-800">2. How We Use Your Information</h2>
        <p>
          We use your information to process bookings, manage your account, and
          communicate with you about your travel plans.
        </p>
        <h2 className="mt-6 text-xl font-semibold text-neutral-800">3. Information Sharing</h2>
        <p>
          We do not sell or share your personal information with third parties
          except as necessary to fulfill your bookings or as required by law.
        </p>
        <h2 className="mt-6 text-xl font-semibold text-neutral-800">4. Cookies</h2>
        <p>
          We use cookies for authentication and session management to keep you
          signed in while using Wanderlast.
        </p>
        <p className="mt-6 text-sm text-neutral-500">
          Last updated: October 29, 2026
        </p>
      </div>
    </div>
  );
}
