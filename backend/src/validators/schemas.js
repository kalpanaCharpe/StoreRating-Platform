import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Password must contain at least one special character"
  );

const nameSchema = z
  .string()
  .min(20, "Name must be at least 20 characters")
  .max(60, "Name must be at most 60 characters");

const addressSchema = z.string().max(400, "Address must be at most 400 characters");

export const registerSchema = z.object({
  name: nameSchema,
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  address: addressSchema.optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

export const createUserSchema = z.object({
  name: nameSchema,
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  address: addressSchema.optional(),
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"]).default("USER"),
});

export const createStoreSchema = z.object({
  name: nameSchema,
  email: z.string().email("Invalid email"),
  address: addressSchema,
  ownerId: z.string().optional(),
});

export const updateStoreSchema = createStoreSchema.partial();

export const ratingSchema = z.object({
  value: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});
