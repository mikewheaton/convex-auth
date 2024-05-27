"use client";

import { useConvexAuthClient } from "@/app/ConvexAuthProvider";
import { CodeInput } from "@/app/auth/CodeInput";
import { ResetPasswordWithEmailCode } from "@/app/auth/ResetPasswordWithEmailCode";
import { SignInMethodDivider } from "@/app/auth/SignInMethodDivider";
import { SignInWithOAuth } from "@/app/auth/SignInWithOAuth";
import { SignInWithPassword } from "@/app/auth/SignInWithPassword";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

/**
 * Users choose between OAuth providers or email and password combo
 * with required email verification and optional password reset via OTP.
 */
export function SignInFormPasswordAndVerifyViaCode() {
  const { verifyCode } = useConvexAuthClient();
  const { toast } = useToast();
  const [step, setStep] = useState<"signIn" | "code" | "forgot">("signIn");
  return (
    <div className="max-w-[384px] mx-auto flex flex-col gap-4">
      {step === "signIn" ? (
        <>
          <h2 className="font-semibold text-2xl tracking-tight">
            Sign in or create an account
          </h2>
          <SignInWithOAuth />
          <SignInMethodDivider />
          <SignInWithPassword
            handleSent={() => setStep("code")}
            handlePasswordReset={() => setStep("forgot")}
            provider="password-code"
          />
        </>
      ) : step === "forgot" ? (
        <ResetPasswordWithEmailCode
          provider="password-code"
          handleCancel={() => setStep("signIn")}
        />
      ) : (
        <>
          <h2 className="font-semibold text-2xl tracking-tight">
            Check your email
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter the 8-digit code we sent to your email address.
          </p>
          <form
            className="flex flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              verifyCode("password-code", formData).catch(() => {
                toast({
                  title: "Code could not be verified, try again",
                  variant: "destructive",
                });
              });
            }}
          >
            <label htmlFor="email">Code</label>
            <CodeInput />
            <Button type="submit">Continue</Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setStep("signIn")}
            >
              Cancel
            </Button>
          </form>
        </>
      )}
      <Toaster />
    </div>
  );
}
