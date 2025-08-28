import { z } from "zod";

export const supplierSchema = z.object({
     name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    gender: z.enum(["male", "female", "other"]),
    foodType: z.enum(["breakfast", "lunch", "dinner", "snacks", "beverages"]),
    address: z.string().min(1, "Address is required"),
    phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number cannot exceed 15 digits")
        .refine((val) => /^[0-9+\-\s()]+$/.test(val), {
            message: "Please enter a valid phone number"
        }),
});


export const editSupplierSchema = z.object({
    name: z.string().min(2).max(100),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    foodType: z.enum(["breakfast", "lunch", "dinner", "snacks", "beverages"]),
    phone: z.string().min(10).max(15).nonempty({ message: "Please enter Supplier Phone Number" }),
    gender: z.enum(["male", "female", "other"]),
    address:z.string().min(5).max(200).nonempty({ message: "Please enter Supplier Address" }),

  
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
export type EditSupplierFormData = z.infer<typeof editSupplierSchema>;