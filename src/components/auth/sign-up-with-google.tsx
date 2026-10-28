import React from "react";
import { Button } from "@/components/ui/button";
import GoogleLogo from "./google-logo";
import { googleButtonClass } from "./auth-styles";
import { authClient } from "@/lib/auth-client";

const SignUpWithGoogle = () => {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleGoogleSignIn() {
    setError(null);
    setPending(true);
    const { error: socialError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    setPending(false);

    if (socialError) {
      setError(
        socialError.message ?? "Google sign in is not available right now.",
      );
    }
  }
  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={pending}
        className={googleButtonClass}
      >
        <GoogleLogo />
        Continue With Google
      </Button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
};

export default SignUpWithGoogle;
