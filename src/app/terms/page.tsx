import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Wanderlast",
  description: "Wanderlast Terms of Service.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl mb-6">
        Terms of Service
      </h1>
      <div className="prose prose-neutral max-w-none">
        <p>
          Welcome to Wanderlast. By using our website and services, you agree
          to these terms of service.
        </p>
        <p>
          These terms govern your use of our travel booking platform, including
          destination browsing, trip planning, and booking management.
        </p>
        <h2 className="mt-6 text-xl font-semibold text-neutral-800">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Wanderlast, you accept and agree to be bound by
          these terms. If you disagree with any part, you may not use the
          service.
        </p>
        <h2 className="mt-6 text-xl font-semibold text-neutral-800">2. User Accounts</h2>
        <p>
          You may create an account to manage your bookings. You are responsible
          for maintaining the confidentiality of your account credentials.
        </p>
        <h2 className="mt-6 text-xl font-semibold text-neutral-800">3. Bookings</h2>
        <p>
          All bookings are subject to availability and confirmation. We are not
          responsible for changes or cancellations made by third-party travel
          providers.
        </p>
        <h2 className="mt-6 text-xl font-semibold text-neutral-800">4. Limitation of Liability</h2>
        <p>
          Wanderlast is not liable for any indirect, incidental, or
          consequential damages arising from your use of the service.
        </p>
        <p className="mt-6 text-sm text-neutral-500">
          Last updated: October 29, 2026
        </p>
      </div>
    </div>
  );
}
