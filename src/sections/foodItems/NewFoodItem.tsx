"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons/";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";
import FileInput from "@/components/form/input/FileInput";
import Image from "next/image";
import { FoodItemFormData, foodItemSchema } from "@/validation/foodItems";
import { createFoodItem } from "@/api/foodItemsApi";
import { getLocalUser } from "@/store/local_storage";
const DEFAULT_FOOD_IMAGE = "/images/food/default.jpg";

interface FoodItemCreateFormProps {
    onSuccess?: () => void;
}

export default function FoodItemCreateForm({ onSuccess }: FoodItemCreateFormProps) {
    const [formData, setFormData] = useState<FoodItemFormData>({
        name: "",
        description: "",
        category: "",
        price: 0,
        supplierId: "",
        available: true,
        imageUrl: "",
    });
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    // Get supplier/role ID from localStorage on component mount
    useEffect(() => {
        const user = getLocalUser();
        if (user && user.roleId) {
            setFormData((prev) => ({
                ...prev,
                supplierId: user.roleId,
            }));
        } else {
            toast.error("Could not retrieve user information. Please log in again.");
        }
    }, []);

    // Handle input changes
    const handleChange = (field: keyof FoodItemFormData, value: string | number | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: typeof value === "string" && field === "price" ? parseFloat(value) || 0 : value,
        }));
    };

    // Handle image upload
    const handleImageUploadSuccess = (fileUrl: string) => {
        setFormData((prev) => ({ ...prev, imageUrl: fileUrl }));
        toast.success("Image uploaded successfully!");
    };

    const handleImageUploadError = (error: Error) => {
        toast.error(`Image upload failed: ${error.message}`);
    };

    const handleImageUploadStart = () => {
        toast.info("Uploading image...");
    };

    // Submit Function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Validate form data
            const validatedData = foodItemSchema.parse(formData);

            console.log("Validated Data:", validatedData);
            // API call to create food item
            await createFoodItem(validatedData);

            toast.success("Food item created successfully!");

            // Call the onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            } else {
                // Fallback: redirect to food items page
                router.push("/food-items");
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                toast.error(err.issues.map((e) => e.message).join(", "));
            } else {
                toast.error("Failed to create food item. Please try again.");
                console.log(err)
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-h-[60vh] overflow-y-auto p-4">
            <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                {/* Grid for input fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>Food Item Name</Label>
                        <Input
                            type="text"
                            defaultValue={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Enter food item name"
                        />
                    </div>

                    <div>
                        <Label>Category</Label>
                        <div className="relative">
                            <Select
                                options={[
                                    { value: "Main Dish", label: "Main Dish" },
                                    { value: "Side Dish", label: "Side Dish" },
                                    { value: "Dessert", label: "Dessert" },
                                    { value: "Beverage", label: "Beverage" },
                                    { value: "Appetizer", label: "Appetizer" },
                                ]}
                                placeholder="Select Category"
                                onChange={(value) => handleChange("category", value)}
                                value={formData.category}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>

                    <div>
                        <Label>Price (Rs.)</Label>
                        <Input
                            type="number"
                            defaultValue={formData.price}
                            onChange={(e) => handleChange("price", e.target.value)}
                            placeholder="Enter price"
                            min="0"
                        />
                    </div>


                    <div>
                        <Label>Availability</Label>
                        <div className="relative">
                            <Select
                                options={[
                                    { value: "true", label: "Available" },
                                    { value: "false", label: "Unavailable" },
                                ]}
                                placeholder="Select Availability"
                                onChange={(value) => handleChange("available", value === "true")}
                                value={formData.available.toString()}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Enter food item description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        rows={3}
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <Label>Food Image</Label>
                    <FileInput
                        onUploadSuccess={handleImageUploadSuccess}
                        onUploadError={handleImageUploadError}
                        onUploadStart={handleImageUploadStart}
                        accept="image/*"
                        multiple={false}
                    />
                    {formData.imageUrl && (
                        <div className="mt-2">
                            <Image
                                src={formData.imageUrl || DEFAULT_FOOD_IMAGE}
                                alt="Food preview"
                                className="w-32 h-32 object-cover rounded-lg"
                                width={128}
                                height={128}
                            />
                            <p className="text-xs text-gray-500 mt-1">Uploaded image</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <Button variant="primary" type="submit" disabled={saving}>
                        {saving ? "Creating..." : "Create Food Item"}
                    </Button>
                </div>
            </form>
        </div>
    );
}