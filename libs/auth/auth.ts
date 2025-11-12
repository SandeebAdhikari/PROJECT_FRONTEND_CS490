import { z } from "zod";

export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, { message: "Email or phone is required" })
    .refine(
      (val) => /\S+@\S+\.\S+/.test(val) || /^\+?[\d\s\-\(\)]+$/.test(val),
      { message: "Must be a valid email or phone number" }
    ),
  password: z.string().min(1, { message: "Password is required" }),
  keepSignedIn: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

const baseFields = {
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: "You must agree to the terms and conditions",
  }),
};

const customerSchema = z.object({
  userType: z.literal("customer"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone")
    .optional(),
  gender: z.enum(["male", "female", "prefer_not_to_say"]).optional(),
  zipcode: z
    .string()
    .regex(/^\d{5}$/, "Zip code must be 5 digits")
    .optional(),
  ...baseFields,
});

const ownerSchema = z.object({
  userType: z.literal("owner"),
  ownerName: z.string().min(1, "Owner name is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  businessEmail: z.string().email("Invalid business email"),
  businessPhone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid business phone"),
  businessWebsite: z.string().optional(),
  ...baseFields,
});

export const signUpSchema = z
  .discriminatedUnion("userType", [customerSchema, ownerSchema])
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
