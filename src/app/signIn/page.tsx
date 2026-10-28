import type { Metadata } from "next";
import SignInForm from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In | Wanderlast",
  description: "Resume your adventure with Wanderlast.",
};

export default function SignInPage() {
  return (
    <div className="flex w-full justify-center bg-[#f7f7f7] px-4 py-14 sm:py-20">
      <div className="w-full max-w-110">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
            Welcome Back
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Resume your adventure with Wanderlust
          </p>
        </div>

        <div className="mt-6 border border-neutral-100 bg-white px-7 py-8 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.18)]">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
