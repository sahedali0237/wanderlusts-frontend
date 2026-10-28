import type { Metadata } from "next";
import SignUpForm from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create Account | Wanderlast",
  description: "Start your adventure with Wanderlast.",
};

export default function SignUpPage() {
  return (
    <div className="flex w-full justify-center bg-[#f7f7f7] px-4 py-14 sm:py-20">
      <div className="w-full max-w-110">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-normal tracking-tight text-neutral-900">
            Create Account
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Start your adventure with Wanderlust
          </p>
        </div>

        <div className="mt-6 border border-neutral-100 bg-white px-7 py-8 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.18)]">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
