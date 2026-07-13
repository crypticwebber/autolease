import { z } from "zod";

export const verifyEmailSchema = z.object({
  token: z.string().trim().length(64, "Invalid verification token"),
});

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .transform((email) => email.toLowerCase()),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
