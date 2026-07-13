import { z } from "zod";

import { RoleName } from "../../users/entities/role.enums";

const allowedRegistrationRoles = [
  RoleName.CUSTOMER,
  RoleName.CAR_OWNER,
] as const;

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must contain at least 2 characters")
      .max(100, "First name cannot exceed 100 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must contain at least 2 characters")
      .max(100, "Last name cannot exceed 100 characters"),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .max(255)
      .transform((email) => email.toLowerCase()),

    phone: z
      .string()
      .trim()
      .min(7, "Phone number is too short")
      .max(30, "Phone number is too long")
      .optional(),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(128, "Password cannot exceed 128 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/\d/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),

    confirmPassword: z.string(),

    role: z.enum(allowedRegistrationRoles).default(RoleName.CUSTOMER),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
