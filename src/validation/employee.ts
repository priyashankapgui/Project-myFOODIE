import { z } from "zod";

export const employeeSchema = z.object({
    name: z.string().min(2).max(100),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    position: z.string().min(2).max(100).nonempty({ message: "Please enter Employee Position" }),
    departmentId: z.number().min(1).max(100),
    gender: z.enum(["male", "female", "other"]),
    password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),

  
});


export const editEmployeeSchema = z.object({
    name: z.string().min(2).max(100),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    position: z.string().min(2).max(100).nonempty({ message: "Please enter Employee Position" }),
    departmentId: z.number().min(1).max(100),
    gender: z.enum(["male", "female", "other"]),

  
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;