"use client";
import React, { useState } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";
import { createDepartment } from "@/api/departmentApis";
import { departmentSchema, DepartmentFormData } from "@/validation/departments";

interface DepartmentFormProps {
    onSuccess?: () => void; // Add this prop
}

export default function DepartmentForm({ onSuccess }: DepartmentFormProps) {
    const [formData, setFormData] = useState<DepartmentFormData>({
        name: "",
        totalemp: 0,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Handle input changes
    const handleChange = (field: keyof DepartmentFormData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: typeof value === 'string' && field === 'totalemp' ? parseInt(value) || 0 : value
        }));
    };

    // Submit Function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Submitting form data:", formData);
            // Validate form data
            const validatedData = departmentSchema.parse(formData);

            // Create department
            await createDepartment(validatedData);

            toast.success("Department created successfully!");

            // Reset form
            setFormData({
                name: "",
                totalemp: 0,
            });

            // Call the onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            } else {
                // Fallback: redirect to departments page
                router.push("/departments");
            }

        } catch (err) {
            if (err instanceof z.ZodError) {
                toast.error(err.issues.map(e => e.message).join(", "));
            } else {
                toast.error("Failed to create department. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Department Name */}
            <div>
                <Label>Department Name</Label>
                <Input
                    type="text"
                    defaultValue={formData.name} // Changed to value instead of defaultValue
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter department name"
                />
            </div>

            {/* Total Employees */}
            <div>
                <Label>Total Employees</Label>
                <Input
                    type="number"
                    defaultValue={formData.totalemp} // Changed to value instead of defaultValue
                    onChange={(e) => handleChange("totalemp", e.target.value)}
                    placeholder="Enter total employees"
                    min="0"
                />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Department"}
                </Button>
            </div>
        </form>
    );
}