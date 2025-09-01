import { z } from "zod";

export const foodItemSchema = z.object({
  name: z.string().min(1, "Food item name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be a positive number"),
  supplierId: z.string().min(1, "Supplier ID is required"),
  available: z.boolean(),
  imageUrl: z.string().optional(),
});

export type FoodItemFormData = z.infer<typeof foodItemSchema>;