/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon, EyeCloseIcon, EyeIcon } from "@/icons/";
import Button from "@/components/ui/button/Button";
import { getDepartments } from "@/api/departmentApis";
import { DepartmentAttributes } from "@/types/httpResponseType";
import { useRouter } from "next/navigation";
import { employeeSchema, EmployeeFormData } from "@/validation/employee";
import { createNormalEmployee } from "@/api/normalEmployeeApis";
import { toast } from "react-toastify";

import { set, z } from "zod";

export default function EmployeeForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [departments, setDepartments] = useState<DepartmentAttributes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<EmployeeFormData>({
        name: "",
        email: "",
        password: "",
        gender: "male",
        position: "",
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

    // handle change
    const handleChange = (
        field: keyof EmployeeFormData,
        value: string | number
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Submit Function
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const validatedData = employeeSchema.parse(formData);

            //Default values
            const payload = {
                ...validatedData,
                role: "normalEmployee",
                imageUrl: "https://res.cloudinary.com/dnwnzdvxt/image/upload/v1757689466/aoslzjvtejiho5d3itt9.png",
            };

            const response = createNormalEmployee(payload)
            setFormData({
                name: "",
                email: "",
                password: "",
                gender: "male",
                position: "",
                departmentId: 0,
            });
            router.push("/users/employees");


        } catch (err) {
            if (err instanceof z.ZodError) {
                toast.error(err.issues.map(e => e.message).join(", "));
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
                    />
                </div>
                <div>
                    <Label>Employee Email</Label>
                    <Input
                        type="email"
                        defaultValue={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="info@gmail.com"
                    />
                </div>
                <div>
                    <Label>Employee Position</Label>
                    <Input
                        type="text"
                        defaultValue={formData.position}
                        onChange={(e) => handleChange("position", e.target.value)}
                        placeholder="Software Engineer"
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
                                    onChange={(value) =>
                                        handleChange("departmentId", parseInt(value))
                                    }
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Password */}
            <div>
                <Label>Password Input</Label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        defaultValue={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        placeholder="Enter your password"
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
                        className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </div>
        </form>
    );
}
