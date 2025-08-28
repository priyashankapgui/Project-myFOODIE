/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon, EyeCloseIcon, EyeIcon } from "@/icons/";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { supplierSchema, SupplierFormData } from "@/validation/supplier";
import { createSupplier } from "@/api/supplierApis";
import { toast } from "react-toastify";
import { z } from "zod";

// Add onSuccess prop to the component
interface NewSupplierFormProps {
    onSuccess?: () => void;
}

export default function NewSupplierForm({ onSuccess }: NewSupplierFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<SupplierFormData>({
        name: "",
        email: "",
        password: "",
        gender: "male",
        foodType: "breakfast",
        address: "",
        phone: "",
    });

    // handle change
    const handleChange = (
        field: keyof SupplierFormData,
        value: string
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Submit Function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validatedData = supplierSchema.parse(formData);

            // Prepare payload with default values
            const payload = {
                ...validatedData,
                role: "supplyer",
                imageUrl: "default-supplier-image.jpg",
            };

            const response = await createSupplier(payload);

            if (response?.success) {
                toast.success("Supplier created successfully!");
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    gender: "male",
                    foodType: "breakfast",
                    address: "",
                    phone: "",
                });

                // Call the onSuccess callback if provided
                if (onSuccess) {
                    onSuccess();
                }
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
            {/* Grid for input fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label>Supplier Name</Label>
                    <Input
                        type="text"
                        defaultValue={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="H.G.Saman"
                    />
                </div>
                <div>
                    <Label>Supplier Email</Label>
                    <Input
                        type="email"
                        defaultValue={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="info@gmail.com"
                    />
                </div>
                <div>
                    <Label>Phone Number</Label>
                    <Input
                        type="text"
                        defaultValue={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="0713654153"
                    />
                </div>
                <div>
                    <Label>Select Food Type</Label>
                    <div className="relative">
                        <Select
                            options={[
                                { value: "breakfast", label: "Breakfast" },
                                { value: "lunch", label: "Lunch" },
                                { value: "dinner", label: "Dinner" },
                                { value: "snacks", label: "Snacks" },
                                { value: "beverages", label: "Beverages" },
                            ]}
                            placeholder="Select Food Type"
                            onChange={(value) => handleChange("foodType", value)}
                            value={formData.foodType}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>
            </div>

            {/* Address */}
            <div>
                <Label>Address</Label>
                <Input
                    type="text"
                    defaultValue={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="No/03, Colombo, Kuruduwatta"
                />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label>Password</Label>
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
                            value={formData.gender}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Add Supplier"}
                </Button>
            </div>
        </form>
    );
}