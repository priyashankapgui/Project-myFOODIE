import { z } from "zod";

export const departmentSchema = z.object({
    name: z.string().min(1, "Department name is required"),
    totalemp: z.number().min(0, "Total employees must be a positive number"),
});



export type DepartmentFormData = z.infer<typeof departmentSchema>;