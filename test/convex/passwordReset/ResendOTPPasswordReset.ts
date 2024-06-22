import Resend from "@auth/core/providers/resend";
import { ConvexError } from "convex/values";
import { Resend as ResendAPI } from "resend";
import { PasswordResetEmail } from "./PasswordResetEmail";
import { alphabet, generateRandomString } from "oslo/crypto";

export const ResendOTPPasswordReset = Resend({
  id: "resend-otp-password-reset",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({
    identifier: email,
    provider,
    token,
    expires,
  }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "My App <onboarding@resend.dev>",
      to: [email],
      subject: `Reset password in My App`,
      react: PasswordResetEmail({ code: token, expires }),
    });

    if (error) {
      throw new ConvexError("Could not send password reset email");
    }
  },
});
