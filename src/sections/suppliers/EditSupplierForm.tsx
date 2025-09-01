/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons/";
import Button from "@/components/ui/button/Button";
import { getSupplierById, updateSupplier } from "@/api/supplierApis"; // Create these APIs
import { useRouter } from "next/navigation";
import { editSupplierSchema, EditSupplierFormData } from "@/validation/supplier"; // Create this validation
import { toast } from "react-toastify";
import { z } from "zod";

type SupplierFormProps = {
    mode: "add" | "edit" | "view";
    supId?: string;
    onSubmit?: (data: EditSupplierFormData) => Promise<void>;
};

export default function EditSupplierForm({ mode, supId, onSubmit }: SupplierFormProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<EditSupplierFormData>({
        name: "",
        email: "",
        gender: "male",
        phone: "",
        address: "",
        foodType: "lunch",
    });

    const [userId, setUserId] = useState<string>("");
    const router = useRouter();
    const isReadOnly = mode === "view";

    // fetch supplier data if editing or viewing
    useEffect(() => {
        const fetchSupplier = async () => {
            if ((mode === "edit" || mode === "view") && supId) {
                try {
                    console.log("Fetching Supplier with ID:🚀", supId);
                    const sup = await getSupplierById(supId);
                    if (sup) {
                        setFormData({
                            name: sup.user?.name ?? "",
                            email: sup.user?.email ?? "",
                            gender: ["male", "female", "other"].includes(sup.user?.gender)
                                ? (sup.user.gender as "male" | "female" | "other")
                                : "male",
                            phone: sup.phone ?? "",
                            address: sup.address ?? "",
                            foodType: sup.foodType.toLowerCase() as "breakfast" | "lunch" | "dinner" | "snacks" | "beverages",
                        });

                        setUserId(sup.userId ?? "");
                    }
                } catch (err) {
                    toast.error("Failed to load supplier details");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchSupplier();
    }, [mode, supId]);

    const handleChange = (field: keyof EditSupplierFormData, value: string) => {
        if (isReadOnly) return;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;

        try {
            const validatedData = editSupplierSchema.parse(formData);
            if (mode === "edit" && supId) {
                const payload = {
                    id: supId,
                    userId: userId,
                    foodType: validatedData.foodType,
                    phone: validatedData.phone,
                    address: validatedData.address,
                    user: {
                        name: validatedData.name,
                        email: validatedData.email,
                        gender: validatedData.gender,
                    },
                };

                const res = await updateSupplier(supId, payload);
                if (res?.success) {
                    toast.success("Supplier updated successfully!");
                    router.push("/suppliers"); // Update with your supplier route
                }
            } else if (mode === "add" && onSubmit) {
                await onSubmit(validatedData);
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                toast.error(err.issues.map((e) => e.message).join(", "));
            } else {
                toast.error("Failed to save supplier");
            }
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading supplier data...</div>;
    }

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
                        disabled={isReadOnly}
                    />
                </div>
                <div>
                    <Label>Supplier Email</Label>
                    <Input
                        type="email"
                        defaultValue={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="info@gmail.com"
                        disabled={isReadOnly}
                    />
                </div>
                <div>
                    <Label>Supplier Phone Number</Label>
                    <Input
                        type="text"
                        defaultValue={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="0771234567"
                        disabled={isReadOnly}
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
                            disabled={isReadOnly}
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <Label>Address</Label>
                <Input
                    type="text"
                    defaultValue={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="123 Main Street, Colombo"
                    disabled={isReadOnly}
                />
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
                        {mode === "add" ? "Add Supplier" : "Update Supplier"}
                    </Button>
                </div>
            )}
        </form>
    );
}