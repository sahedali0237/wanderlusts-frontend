"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { iconClass, inputClass, labelClass } from "./auth-styles";

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  autoComplete?: "current-password" | "new-password";
  minLength?: number;
};

export default function PasswordField({
  id,
  label,
  placeholder,
  autoComplete = "new-password",
  minLength,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Label htmlFor={id} className={labelClass}>
        {label}
      </Label>
      <div className="relative">
        <Lock className={iconClass} strokeWidth={1.6} />
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          placeholder={placeholder}
          className={cn(inputClass, "pr-10")}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-sm p-1 text-neutral-400 transition-colors hover:text-neutral-600 focus-visible:text-neutral-600 focus-visible:ring-2 focus-visible:ring-[#10a5c4]/40 focus-visible:outline-none"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" strokeWidth={1.6} />
          ) : (
            <Eye className="h-4 w-4" strokeWidth={1.6} />
          )}
        </button>
      </div>
    </div>
  );
}
