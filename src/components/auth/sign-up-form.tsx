"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, User } from "lucide-react";
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

export default function SignUpForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    const user = Object.fromEntries(formData.entries()) as {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    };

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (user.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setPending(true);
    const { error: signUpError } = await authClient.signUp.email({
      name: user.name.trim(),
      email: user.email.trim(),
      password: user.password,
    });
    setPending(false);

    if (signUpError) {
      setError(signUpError.message ?? "Unable to create your account.");
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
          <Label htmlFor="name" className={labelClass}>
            Full Name
          </Label>
          <div className="relative">
            <User className={iconClass} strokeWidth={1.6} />
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Enter your name"
              className={inputClass}
            />
          </div>
        </div>

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
          placeholder="Create a password"
          minLength={8}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          minLength={8}
        />

        <Button
          type="submit"
          disabled={pending}
          className={`mt-2 ${primaryButtonClass}`}
        >
          {pending ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <AuthDivider label="Or sign up with" />

      <SignUpWithGoogle />

      <p className="mt-6 text-center text-[13px] text-neutral-500">
        Already have an account?{" "}
        <Link href="/signIn" className={linkClass}>
          Sign In
        </Link>
      </p>
    </>
  );
}
