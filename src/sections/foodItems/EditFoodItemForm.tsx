/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons/";
import Button from "@/components/ui/button/Button";
import { getFoodItemById, updateFoodItem } from "@/api/foodItemsApi";
import { FoodItemAttributes } from "@/types/httpResponseType";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { z } from "zod";
import FileInput from "@/components/form/input/FileInput";
const DEFAULT_FOOD_IMAGE = "/images/user/owner.jpg";
import { EditFoodItemFormData, EditfoodItemSchema } from "@/validation/foodItems";



type FoodItemFormProps = {
    mode: "add" | "edit" | "view";
    foodItemId?: number;
    onSubmit?: (data: EditFoodItemFormData) => Promise<void>;
};

export default function FoodItemForm({ mode, foodItemId, onSubmit }: FoodItemFormProps) {
    const [formData, setFormData] = useState<EditFoodItemFormData>({
        name: "",
        description: "",
        category: "",
        price: 0,
        employeeprice: 0,
        hospitalprice: 0,
        available: true,
        imageUrl: "",
        dietType: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const isReadOnly = mode === "view";

    // Fetch food item data if editing or viewing
    useEffect(() => {
        const fetchFoodItem = async () => {
            if ((mode === "edit" || mode === "view") && foodItemId) {
                try {
                    setLoading(true);
                    const foodItem = await getFoodItemById(foodItemId);
                    if (foodItem) {
                        setFormData({
                            name: foodItem.name || "",
                            description: foodItem.description || "",
                            category: foodItem.category || "",
                            price: foodItem.price || 0,
                            employeeprice: foodItem.employeeprice || 0,
                            hospitalprice: foodItem.hospitalprice || 0,
                            available: foodItem.available || true,
                            imageUrl: foodItem.imageUrl || "",
                            dietType: foodItem.dietType || "",
                        });
                    }
                } catch (err) {
                    setError("Failed to load food item details");
                    toast.error("Failed to load food item details");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchFoodItem();
    }, [mode, foodItemId]);

    // Handle input changes
    const handleChange = (field: keyof EditFoodItemFormData, value: string | number | boolean) => {
        if (isReadOnly) return;
        setFormData((prev) => ({
            ...prev,
            [field]: typeof value === 'string' &&
                (field === 'price' || field === 'employeeprice' || field === 'hospitalprice')
                ? parseFloat(value) || 0
                : value
        }));
    };

    // Handle image upload
    const handleImageUploadSuccess = (fileUrl: string) => {
        setFormData(prev => ({ ...prev, imageUrl: fileUrl }));
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
        if (isReadOnly) return;

        setSaving(true);

        try {
            // Validate form data
            const validatedData = EditfoodItemSchema.parse(formData);

            if (mode === "edit" && foodItemId) {
                // Update existing food item
                await updateFoodItem(foodItemId, validatedData);
                toast.success("Food item updated successfully!");
                router.push("/food-items");
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
                toast.error("Failed to save food item. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading food item details...</div>
            </div>
        );
    }

    return (
        <div className="max-h-[60vh] overflow-y-auto p-4">
            <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                {/* Grid for input fields */}
                <div className="flex flex-row md:grid md:grid-cols-2 md:gap-6">
                    <div>
                        <Label>Food Item Name</Label>
                        <Input
                            type="text"
                            defaultValue={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Enter food item name"
                            disabled={isReadOnly}
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
                                disabled={isReadOnly}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>

                    <div>
                        <Label>Diet Type</Label>
                        <div className="relative">
                            <Select
                                options={[
                                    { value: "Non-Veg", label: "Non-Vegetarian" },
                                    { value: "Veg", label: "Vegetarian" },

                                ]}
                                placeholder="Select Diet Type"
                                onChange={(value) => handleChange("dietType", value)}
                                value={formData.dietType}
                                className="dark:bg-dark-900"
                                disabled={isReadOnly}
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
                            disabled={isReadOnly}
                        />
                    </div>

                    <div>
                        <Label>Employee Price (Rs.)</Label>
                        <Input
                            type="number"
                            defaultValue={formData.employeeprice}
                            onChange={(e) => handleChange("employeeprice", e.target.value)}
                            placeholder="Enter employee price"
                            min="0"
                            disabled={true}
                        />
                    </div>

                    <div>
                        <Label>Hospital Price (Rs.)</Label>
                        <Input
                            type="number"
                            defaultValue={formData.hospitalprice}
                            onChange={(e) => handleChange("hospitalprice", e.target.value)}
                            placeholder="Enter hospital price"
                            min="0"
                            disabled={true}
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
                                disabled={isReadOnly}
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
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        rows={3}
                    />
                </div>

                {/* Image Upload (only for edit mode) */}
                {mode === "edit" && (
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
                                <p className="text-xs text-gray-500 mt-1">Current image</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Image View (only for view mode) */}
                {mode === "view" && formData.imageUrl && (
                    <div>
                        <Label>Food Image</Label>
                        <div className="mt-2">
                            <Image
                                src={formData.imageUrl || DEFAULT_FOOD_IMAGE}
                                alt="Food preview"
                                width={128}
                                height={128}
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                        </div>
                    </div>
                )}

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
                            {saving ? "Saving..." : (mode === "add" ? "Add Food Item" : "Update Food Item")}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}