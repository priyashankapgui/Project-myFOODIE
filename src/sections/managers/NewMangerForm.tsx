/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon, EyeCloseIcon, EyeIcon } from "@/icons/";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { ManagerSchema, ManagerFormData } from "@/validation/manager"; // Create this
import { createManager } from "@/api/managerApis";
import { getDepartments } from "@/api/departmentApis";
import { toast } from "react-toastify";
import { DepartmentAttributes } from "@/types/httpResponseType";
import { z } from "zod";


export default function AddManagerForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<DepartmentAttributes[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<ManagerFormData>({
        name: "",
        email: "",
        password: "",
        gender: "male",
        position: "",
        role: "management",
        departmentId: 0,
    });

    const router = useRouter();

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

    // options
    const departmentOptions = (departments ?? []).map((department) => ({
        value: department.id.toString(),
        label: department.name,
    }));

    const handleChange = (field: keyof ManagerFormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validatedData = ManagerSchema.parse(formData);

            const payload = {
                ...validatedData,
                role: "management",
                imageUrl: "https://res.cloudinary.com/dnwnzdvxt/image/upload/v1757689466/aoslzjvtejiho5d3itt9.png",
            };

            const response = await createManager(payload);

            if (response?.success) {
                toast.success("Manager created successfully!");
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    gender: "male",
                    position: "",
                    role: "management",
                    departmentId: 0,
                });
                router.push("/users/managers");

            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                toast.error(err.issues.map(e => e.message).join(", "));
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label>Manager Name</Label>
                    <Input
                        type="text"
                        defaultValue={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Manager Name"
                    />
                </div>
                <div>
                    <Label>Manager Email</Label>
                    <Input
                        type="email"
                        defaultValue={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="manager@example.com"
                    />
                </div>
                <div>
                    <Label>Manager Position</Label>
                    <Input
                        type="text"
                        defaultValue={formData.position}
                        onChange={(e) => handleChange("position", e.target.value)}
                        placeholder="HR Manager"
                    />
                </div>
                <div>
                    <Label>Password</Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            defaultValue={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            placeholder="Enter password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                            {showPassword ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                            ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                            )}
                        </button>
                    </div>
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
                                    disabled={true}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </>
                        )}
                    </div>
                </div>

            </div>


            <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Add Manager"}
                </Button>
            </div>
        </form>
    );
}