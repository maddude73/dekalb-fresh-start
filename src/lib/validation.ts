import { z } from 'zod';

export const leadSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100, "Full name cannot exceed 100 characters"),
  phone: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Property address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be a 2-letter abbreviation"),
  zip: z.string().regex(/^\d{5}$/, "Invalid zip code format"),
  freshStartAmount: z.string().min(1, "Fresh start amount is required"),
});