/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { getDepartmentById, updateDepartment } from "@/api/departmentApis";
import { Department } from "@/types/httpResponseType";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { departmentSchema } from "@/validation/departments";
import { z } from "zod";



export type DepartmentFormData = z.infer<typeof departmentSchema>;

type DepartmentFormProps = {
    mode: "add" | "edit" | "view";
    departmentId?: number;
    onSubmit?: (data: DepartmentFormData) => Promise<void>;
};

export default function DepartmentForm({ mode, departmentId, onSubmit }: DepartmentFormProps) {
    const [formData, setFormData] = useState<DepartmentFormData>({
        name: "",
        totalemp: 0,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const isReadOnly = mode === "view";

    // Fetch department data if editing or viewing
    useEffect(() => {
        const fetchDepartment = async () => {
            if ((mode === "edit" || mode === "view") && departmentId) {
                try {
                    setLoading(true);
                    const department = await getDepartmentById(departmentId);
                    console.log("Fetched department:", department);
                    if (department) {
                        setFormData({
                            name: department.name || "",
                            totalemp: department.totalemp || 0,
                        });
                    }
                } catch (err) {
                    setError("Failed to load department details");
                    toast.error("Failed to load department details");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchDepartment();
    }, [mode, departmentId]);

    // Handle input changes
    const handleChange = (field: keyof DepartmentFormData, value: string | number) => {
        if (isReadOnly) return;
        setFormData((prev) => ({
            ...prev,
            [field]: typeof value === 'string' && field === 'totalemp' ? parseInt(value) || 0 : value
        }));
    };

    // Submit Function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;

        setSaving(true);

        try {
            // Validate form data
            const validatedData = departmentSchema.parse(formData);

            if (mode === "edit" && departmentId) {
                // Update existing department - convert departmentId to string for the API call
                await updateDepartment(departmentId, validatedData);
                toast.success("Department updated successfully!");
                router.push("/departments");
            } else if (mode === "add") {
                // For add mode, use the onSubmit prop if provided
                if (onSubmit) {
                    await onSubmit(validatedData);
                }
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                toast.error(err.issues.map(e => e.message).join(", "));
            } else {
                toast.error("Failed to save department. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading department details...</div>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Department Name */}
            <div>
                <Label>Department Name</Label>
                <Input
                    type="text"
                    defaultValue={formData.name} // Changed from defaultValue to value
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter department name"
                    disabled={isReadOnly}
                />
            </div>

            {/* Total Employees */}
            <div>
                <Label>Total Employees</Label>
                <Input
                    type="number"
                    defaultValue={formData.totalemp} // Changed from defaultValue to value
                    onChange={(e) => handleChange("totalemp", e.target.value)}
                    placeholder="Enter total employees"
                    min="0"
                    disabled={isReadOnly}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 text-red-600 bg-red-50 rounded-md dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Actions */}
            {mode !== "view" && (
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : (mode === "add" ? "Add Department" : "Update Department")}
                    </Button>
                </div>
            )}
        </form>
    );
}