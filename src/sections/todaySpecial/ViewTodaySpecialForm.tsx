"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { TodaySpecial } from "@/types/httpResponseType";
import { getFoodItemById } from "@/api/foodItemsApi";
import Image from "next/image";

interface TodaySpecialFormProps {
    foodItemId: number;
}

const DEFAULT_FOOD_IMAGE = "/images/user/owner.jpg";

export default function TodaySpecialForm({ foodItemId }: TodaySpecialFormProps) {
    const [foodItemData, setFoodItemData] = useState<TodaySpecial | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch food item data
    useEffect(() => {
        const fetchFoodItem = async () => {
            if (foodItemId) {
                try {
                    setLoading(true);
                    const foodItem = await getFoodItemById(foodItemId);
                    setFoodItemData(foodItem);
                } catch (err) {
                    toast.error("Failed to load food item details");
                    console.error("Error fetching food item:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchFoodItem();
    }, [foodItemId]);


    const formatCurrency = (amount: number) => {
        return `Rs. ${amount.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                    Loading food item details...
                </div>
            </div>
        );
    }

    if (!foodItemData) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-500 dark:text-red-400">
                    Food item not found.
                </div>
                <Button
                    variant="primary"
                    onClick={() => router.back()}
                    className="mt-4"
                >
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="h-[60vh] flex flex-col">
            {/* Scrollable content container */}
            <div className="flex-1 overflow-y-auto space-y-6 p-1">
                {/* Header with image and basic info */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Food Image */}
                    <div className="w-full md:w-64 h-64 relative rounded-lg overflow-hidden">
                        <Image
                            src={foodItemData.imageUrl || DEFAULT_FOOD_IMAGE}
                            alt={foodItemData.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = DEFAULT_FOOD_IMAGE;
                            }}
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="p-1 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {foodItemData.name}
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Category</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-gray-900 dark:text-white">
                                    {foodItemData.category}
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Status</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className={`px-2 py-1 text-xs rounded-full ${foodItemData.available
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                    }`}>
                                    {foodItemData.available ? "Available" : "Unavailable"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Three-column grid for food item details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Column 1: Pricing Information */}
                    <div className="space-y-4">
                        <div>
                            <Label>Regular Price</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(foodItemData.price)}
                                </span>
                            </div>
                        </div>


                        <div>
                            <Label>Supplier Name</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-gray-900 dark:text-white">
                                    {foodItemData.supplierName || "N/A"}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Column 2: Supplier Information */}
                    <div className="space-y-4">
                        <div>
                            <Label>Employee Price</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                    {formatCurrency(foodItemData.employeeprice)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <Label>Food Type</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-gray-900 dark:text-white">
                                    {foodItemData.supplier?.foodType
                                        ? foodItemData.supplier.foodType.charAt(0).toUpperCase() +
                                        foodItemData.supplier.foodType.slice(1).toLowerCase()
                                        : "N/A"}
                                </span>
                            </div>
                        </div>


                    </div>

                </div>

                {/* Description  - Full width */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <Label>Description</Label>
                        <div className="p-4 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                {foodItemData.description || "No description available"}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Back button at the bottom */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto"
                >
                    Back to Today &apos; s Specials
                </Button>
            </div>
        </div>
    );
}