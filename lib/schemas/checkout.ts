import { z } from "zod";

export const checkoutSchema = z.object({
  // Customer Info
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\+\-\(\)]+$/, "Invalid phone number format"),

  // Shipping Address
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  area: z.string().optional(),
  postalCode: z.string().optional(),

  // Payment Method
  paymentMethod: z.enum(["COD", "WHATSAPP"], {
    message: "Please select a payment method",
  }),

  // Optional Notes
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Pakistan cities for dropdown
export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Larkana",
  "Other",
] as const;
