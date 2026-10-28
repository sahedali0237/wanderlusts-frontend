"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import {
  AuthDivider,
  errorClass,
  iconClass,
  inputClass,
  labelClass,
  linkClass,
  primaryButtonClass,
} from "./auth-styles";
import PasswordField from "./password-field";
import SignUpWithGoogle from "./sign-up-with-google";

export default function SignInForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    const credentials = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    setPending(true);
    const { error: signInError } = await authClient.signIn.email({
      email: credentials.email.trim(),
      password: credentials.password,
      rememberMe,
    });
    setPending(false);

    if (signInError) {
      setError(signInError.message ?? "Unable to sign you in.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p role="alert" className={errorClass}>
            {error}
          </p>
        )}

        <div>
          <Label htmlFor="email" className={labelClass}>
            Email Address
          </Label>
          <div className="relative">
            <Mail className={iconClass} strokeWidth={1.6} />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              className={inputClass}
            />
          </div>
        </div>

        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 cursor-pointer rounded-sm border-neutral-300 accent-[#10a5c4]"
            />
            <Label
              htmlFor="rememberMe"
              className="cursor-pointer text-[13px] font-normal text-neutral-600"
            >
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-[13px] font-medium text-[#10a5c4] transition-colors hover:text-[#0e8ea9] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={pending}
          className={`mt-1 ${primaryButtonClass}`}
        >
          {pending ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <AuthDivider label="Or continue with" />
      {/* here will be the continue with google button */}

      <SignUpWithGoogle />

      <p className="mt-6 text-center text-[13px] text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/signUp" className={linkClass}>
          Sign Up
        </Link>
      </p>
    </>
  );
}
