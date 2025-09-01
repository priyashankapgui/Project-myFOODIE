/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons/";
import Button from "@/components/ui/button/Button";
import { getManagerById, updateManager } from "@/api/managerApis"; // Create these APIs
import { useRouter } from "next/navigation";
import { editManagerSchema, EditManagerFormData } from "@/validation/manager";
import { DepartmentAttributes, NormalEmployee } from "@/types/httpResponseType";
import { getDepartments } from "@/api/departmentApis";
import { toast } from "react-toastify";
import { z } from "zod";

type ManagerFormProps = {
    mode: "add" | "edit" | "view";
    managerId?: string;
    onSubmit?: (data: EditManagerFormData) => Promise<void>;
};

export default function ManagerForm({ mode, managerId, onSubmit }: ManagerFormProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [departments, setDepartments] = useState<DepartmentAttributes[]>([]);
    const [formData, setFormData] = useState<EditManagerFormData>({
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

    // fetch manager data if editing or viewing
    useEffect(() => {
        const fetchManager = async () => {
            if ((mode === "edit" || mode === "view") && managerId) {
                try {
                    const manager = await getManagerById(managerId);
                    if (manager) {
                        setFormData({
                            name: manager.user?.name ?? "",
                            email: manager.user?.email ?? "",
                            gender: ["male", "female", "other"].includes(manager.user?.gender)
                                ? (manager.user.gender as "male" | "female" | "other")
                                : "male",
                            position: manager.position ?? "",
                            departmentId: manager.departmentId ?? 0,
                        });

                        setUserId(manager.userId ?? "");
                    }
                } catch (err) {
                    toast.error("Failed to load manager details");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchManager();
    }, [mode, managerId]);

    const departmentOptions = (departments ?? []).map((department) => ({
        value: department.id.toString(),
        label: department.name,
    }));

    const handleChange = (field: keyof EditManagerFormData, value: string | number) => {
        if (isReadOnly) return;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;

        try {
            const validatedData = editManagerSchema.parse(formData);
            if (mode === "edit" && managerId) {
                // update existing manager
                const payload = {
                    id: managerId,
                    userId: userId,
                    position: validatedData.position,
                    departmentId: validatedData.departmentId,
                    user: {
                        name: validatedData.name,
                        email: validatedData.email,
                        gender: validatedData.gender,
                        imageUrl: "", // Provide a default or fetched imageUrl as needed
                    },
                };

                const res = await updateManager(managerId, payload);
                // Assuming updateManager returns a truthy value on success, otherwise adjust as needed
                if (res) {
                    toast.success("Manager updated successfully!");
                    router.push("/users/managers");
                }
            } else if (mode === "add" && onSubmit) {
                await onSubmit(validatedData);
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                toast.error(err.issues.map((e) => e.message).join(", "));
            }
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading manager data...</div>;
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Grid for input fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label>Manager Name</Label>
                    <Input
                        type="text"
                        defaultValue={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        disabled={isReadOnly}
                    />
                </div>
                <div>
                    <Label>Manager Email</Label>
                    <Input
                        type="email"
                        defaultValue={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="info@gmail.com"
                        disabled={isReadOnly}
                    />
                </div>
                <div>
                    <Label>Manager Position</Label>
                    <Input
                        type="text"
                        defaultValue={formData.position}
                        onChange={(e) => handleChange("position", e.target.value)}
                        placeholder="HR Manager"
                        disabled={isReadOnly}
                    />
                </div>
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

            {/* Actions */}
            {mode !== "view" && (
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <Button variant="primary" type="submit">
                        {mode === "add" ? "Add Manager" : "Update Manager"}
                    </Button>
                </div>
            )}
        </form>
    );
}