import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .max(16, "At most 16 characters")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Must include a special character");

const nameSchema = z
  .string()
  .min(20, "Name must be at least 20 characters")
  .max(60, "Name must be at most 60 characters");

const addressSchema = z.string().max(400, "Address must be at most 400 characters").optional();

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: z.string().email("Enter a valid email"),
  password: passwordSchema,
  address: addressSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const createUserSchema = z.object({
  name: nameSchema,
  email: z.string().email("Enter a valid email"),
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"]),
});

export const storeSchema = z.object({
  name: nameSchema,
  email: z.string().email("Enter a valid email"),
  address: z.string().min(1, "Address is required").max(400, "Max 400 characters"),
  ownerId: z.string().optional(),
});
