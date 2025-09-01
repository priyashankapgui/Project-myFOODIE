
"use client";
import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Pagination from "@/components/tables/Pagination";
import { FiEye } from "react-icons/fi";
import { TodaySpecial } from "@/types/httpResponseType";
import Popup from "@/components/ui/popup/Popup";
import FoodItemForm from "./ViewTodaySpecialForm";
import { toast } from "react-toastify";
import { todaySpecial } from "@/api/foodItemsApi"; // Assuming you'll add this to your API

const DEFAULT_FOOD_IMAGE = "/images/user/owner.jpg";


export default function TodaySpecialsTable() {
    const [foodItems, setFoodItems] = useState<TodaySpecial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [selectedFoodItem, setSelectedFoodItem] = useState<TodaySpecial | undefined>(undefined);

    useEffect(() => {
        fetchTodaySpecials();
    }, []);

    const fetchTodaySpecials = async () => {
        try {
            setLoading(true);
            const items = await todaySpecial();
            setFoodItems(items);
            setError(null);
        } catch (err) {
            setError("Failed to fetch today's specials. Please try again.");
            console.error("Error fetching today's specials:", err);
            toast.error("Failed to load today's specials");
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(foodItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = foodItems.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleView = (id: number) => {
        const foodItem = foodItems.find(item => item.id === id);
        setSelectedFoodItem(foodItem);
        setIsPopupOpen(true);
    };

    if (loading) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading today&apos;s specials...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-red-500 dark:text-red-400">
                    {error}
                </div>
            </div>
        );
    }

    if (foodItems.length === 0) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No specials available today.
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    {/* Table Header */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                            Today&apos;s Specials
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Discover our featured dishes for today
                        </p>
                    </div>

                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    ID
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Image
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Name
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Category
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Price
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Employee Price
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {currentItems.map((foodItem) => (
                                <TableRow key={foodItem.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {foodItem.id}
                                    </TableCell>

                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="w-12 h-12 overflow-hidden rounded-lg">
                                            <Image
                                                width={48}
                                                height={48}
                                                src={foodItem.imageUrl || DEFAULT_FOOD_IMAGE}
                                                alt={foodItem.name}
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = DEFAULT_FOOD_IMAGE;
                                                }}
                                            />
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <span className="font-medium text-gray-800 dark:text-white/90">
                                            {foodItem.name}
                                        </span>
                                        {foodItem.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {foodItem.description}
                                            </p>
                                        )}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {foodItem.category}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <span className="font-semibold text-green-600 dark:text-green-400">
                                            Rs.{foodItem.price}
                                        </span>
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Rs.{foodItem.employeeprice}
                                    </TableCell>


                                    <TableCell className="px-4 py-3 text-start">
                                        <div className="flex items-center gap-2">
                                            {/* View Button */}
                                            <button
                                                onClick={() => foodItem.id !== undefined && handleView(foodItem.id)}
                                                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <FiEye size={18} />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Component */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/[0.05]">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* View Popup */}
            {selectedFoodItem?.id !== undefined && (
                <Popup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    title="View Food Item Details"
                >
                    <FoodItemForm
                        foodItemId={selectedFoodItem.id}
                    />
                </Popup>
            )}
        </div>
    );
}