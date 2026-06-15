import { z } from "zod";

export const addProductSchema = z.object({
  brandName: z
    .string()
    .min(3, "Product name must be at least 3 characters"),
  productType: z
    .string()
    .min(1, "Please select a product type"),
  quantityStock: z.coerce
    .number()
    .min(0, "Quantity cannot be negative"),
  mrp: z.coerce
    .number()
    .positive("MRP must be greater than 0"),
  sellingPrice: z.coerce
    .number()
    .positive("Selling price must be greater than 0"),
  productName: z
    .string()
    .min(2, "Brand name is required"),
  exchangeEligibility: z.enum(["yes", "no"]),
  images: z.array(z.string()).optional()
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone number is required"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type OtpFormData = z.infer<
  typeof otpSchema
>;

export type LoginFormData = z.infer<
  typeof loginSchema
>;

export type AddProductFormData = z.infer<
  typeof addProductSchema
>;

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Name is required"),

  email: z
    .string()
    .email("Invalid email"),

  phoneNumber: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Invalid phone number"
    ),
});

export type SignupFormData =
  z.infer<typeof signupSchema>;
