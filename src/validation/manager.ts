import { z } from "zod";

export const ManagerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    position: z.string().min(2).max(100).nonempty({ message: "Please enter Employee Position" }),
    gender: z.enum(["male", "female", "other"]),
    role: z.enum(["management"]),
    departmentId: z.number().min(1, { message: "Please select a department" }),
    password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),

  
});

export const editManagerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    position: z.string().min(2).max(100).nonempty({ message: "Please enter Employee Position" }),
    gender: z.enum(["male", "female", "other"]),
    departmentId: z.number().min(1, { message: "Please select a department" }),

  
});

export type ManagerFormData = z.infer<typeof ManagerSchema>;
export type EditManagerFormData = z.infer<typeof editManagerSchema>;