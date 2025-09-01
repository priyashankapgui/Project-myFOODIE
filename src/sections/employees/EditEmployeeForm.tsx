/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon, EyeCloseIcon, EyeIcon } from "@/icons/";
import Button from "@/components/ui/button/Button";
import { getDepartments } from "@/api/departmentApis";
import { getEmployeeById, updateEmployee } from "@/api/normalEmployeeApis"; // 👈 import APIs
import { DepartmentAttributes, NormalEmployee } from "@/types/httpResponseType";
import { useRouter } from "next/navigation";
import { editEmployeeSchema, EditEmployeeFormData } from "@/validation/employee";
import { toast } from "react-toastify";
import { z } from "zod";

type EmployeeFormProps = {
    mode: "add" | "edit" | "view";
    empId?: string; // 👈 employee id passed as prop
    onSubmit?: (data: EditEmployeeFormData) => Promise<void>;
};

export default function EmployeeForm({ mode, empId, onSubmit }: EmployeeFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [departments, setDepartments] = useState<DepartmentAttributes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<EditEmployeeFormData>({
        name: "",
        email: "",
        gender: "male",
        position: "",
        departmentId: 0,
    });

    const [userId, setUserId] = useState<string>("");
    const router = useRouter();
    const isReadOnly = mode === "view";

    // fetch departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setLoading(true);
                const data = await getDepartments();
                setDepartments(data ?? []);
            } catch (err) {
                setError("Failed to load departments");
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    // fetch employee data if editing or viewing
    useEffect(() => {
        const fetchEmployee = async () => {
            if ((mode === "edit" || mode === "view") && empId) {
                try {
                    const emp = await getEmployeeById(empId);
                    if (emp) {
                        setFormData({
                            name: emp.user?.name ?? "",
                            email: emp.user?.email ?? "",
                            gender: ["male", "female", "other"].includes(emp.user?.gender)
                                ? (emp.user.gender as "male" | "female" | "other")
                                : "male",
                            position: emp.position ?? "",
                            departmentId: emp.departmentId ?? 0,

                        });

                        setUserId(emp.userId ?? "");
                    }
                } catch (err) {
                    toast.error("Failed to load employee details");
                }
            }
        };
        fetchEmployee();
    }, [mode, empId]);


    const departmentOptions = (departments ?? []).map((department) => ({
        value: department.id.toString(),
        label: department.name,
    }));

    const handleChange = (field: keyof EditEmployeeFormData, value: string | number) => {
        if (isReadOnly) return;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;

        try {
            const validatedData = editEmployeeSchema.parse(formData);
            if (mode === "edit" && empId) {
                // update existing

                const payload = {
                    id: empId, // employee id
                    userId: userId, // optional, or fetch from somewhere if needed
                    departmentId: validatedData.departmentId,
                    position: validatedData.position,
                    user: {
                        name: validatedData.name,
                        email: validatedData.email,
                        gender: validatedData.gender,
                    },

                };

                const res = await updateEmployee(empId, payload);
                if (res?.success) {
                    toast.success("Employee updated successfully!");
                    router.push("/users/employees");
                }
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                toast.error(err.issues.map((e) => e.message).join(", "));
            }
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Grid for input fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label>Employee Name</Label>
                    <Input
                        type="text"
                        defaultValue={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        disabled={isReadOnly}
                    />
                </div>
                <div>
                    <Label>Employee Email</Label>
                    <Input
                        type="email"
                        defaultValue={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="info@gmail.com"
                        disabled={isReadOnly}
                    />
                </div>
                <div>
                    <Label>Employee Position</Label>
                    <Input
                        type="text"
                        defaultValue={formData.position}
                        onChange={(e) => handleChange("position", e.target.value)}
                        placeholder="Software Engineer"
                        disabled={isReadOnly}
                    />
                </div>
                <div>
                    <Label>Select Department</Label>
                    <div className="relative">
                        {loading ? (
                            <div className="p-2 text-gray-500">Loading departments...</div>
                        ) : error ? (
                            <div className="p-2 text-red-500">{error}</div>
                        ) : (
                            <>
                                <Select
                                    options={departmentOptions}
                                    placeholder="Select a department"
                                    onChange={(value) => handleChange("departmentId", parseInt(value))}
                                    value={formData.departmentId.toString()}
                                    className="dark:bg-dark-900"
                                    disabled={isReadOnly}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Password (hide in view mode) */}


            {/* Gender */}
            <div>
                <Label htmlFor="gender">Gender</Label>
                <div className="relative">
                    <Select
                        options={[
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                            { value: "other", label: "Other" },
                        ]}
                        placeholder="Select Gender"
                        onChange={(value) => handleChange("gender", value)}
                        value={formData.gender}
                        className="dark:bg-dark-900"
                        disabled={isReadOnly}
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                    </span>
                </div>
            </div>

            {/* Actions */}
            {mode !== "view" && (
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <Button variant="primary" type="submit">
                        {mode === "add" ? "Add Employee" : "Update Employee"}
                    </Button>
                </div>
            )}
        </form>
    );
}
