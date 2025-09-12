import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  gender: z.enum(["male", "female", "other"], {
    error: "Please select a gender",
  }),
  
  email: z.string()
    .email("Please enter a valid email address"),
  
  phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[0-9]{10,15}$/.test(val), {
      message: "Please enter a valid phone number (10-15 digits)"
    }),
  
  address: z.string()
    .max(200, "Address must be less than 200 characters")
    .optional(),
  
  imageUrl: z.string()
    .url("Please enter a valid URL for the image")
    .refine((val) => !val || val.startsWith("https://"), {
      message: "Image URL must start with https://"
    })
    .optional()
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;