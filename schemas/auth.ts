import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, { message: "Email or phone is required" })
    .refine(
      (val) => /\S+@\S+\.\S+/.test(val) || /^\+?[\d\s\-\(\)]+$/.test(val),
      {
        message: "Must be a valid email or phone number",
      }
    ),
  password: z.string().min(1, { message: "Password is required" }),
  keepSignedIn: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Sign up schema
export const signUpSchema = z
  .object({
    userType: z.enum(["customer", "owner"]),

    // Customer
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    email: z.string().email("Invalid email").optional(),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone")
      .optional(),

    // Owner
    ownerName: z.string().min(1, "Owner name is required").optional(),
    businessName: z.string().min(1, "Business name is required").optional(),
    businessEmail: z.string().email("Invalid business email").optional(),
    businessPhone: z
      .string()
      .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid business phone")
      .optional(),

    // Shared
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
