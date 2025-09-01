/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Button from "@/components/ui/button/Button";
import { FiTrash, FiEye, FiEdit } from "react-icons/fi";
import { getAllFoodItems, getFoodItemsBySupplierId } from "@/api/foodItemsApi";
import { FoodItemAttributes } from "@/types/httpResponseType";
import Popup from "@/components/ui/popup/Popup";
import FoodItemForm from "./EditFoodItemForm";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import { toast } from "react-toastify";
import { getLocalUser } from "@/store/local_storage";

const DEFAULT_FOOD_IMAGE = "/images/user/owner.jpg";
type PopupMode = "add" | "edit" | "view";

export default function FoodItemsTable() {
    const [foodItems, setFoodItems] = useState<FoodItemAttributes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState<PopupMode>("add");
    const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItemAttributes | undefined>(undefined);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Get current user from localStorage
        const user = getLocalUser();
        setCurrentUser(user);
        fetchFoodItems(user);
    }, []);

    const fetchFoodItems = async (user: any) => {
        try {
            setLoading(true);
            let items: FoodItemAttributes[] = [];

            if (user.role === "management") {
                // Manager gets all food items
                items = await getAllFoodItems();
            } else if (user.role === "supplier" && user.id) {
                // Supplier gets only their food items
                items = await getFoodItemsBySupplierId(user.roleId);
            } else {
                throw new Error("Unauthorized access");
            }

            setFoodItems(items);
            setError(null);
        } catch (err) {
            setError("Failed to fetch food items. Please try again.");
            console.error("Error fetching food items:", err);
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

    const handleEdit = (id: number) => {
        setPopupMode("edit");
        const foodItem = foodItems.find(item => item.id === id);
        setSelectedFoodItem(foodItem);
        setIsPopupOpen(true);
    };

    const handleView = (id: number) => {
        setPopupMode("view");
        const foodItem = foodItems.find(item => item.id === id);
        setSelectedFoodItem(foodItem);
        setIsPopupOpen(true);
    };

    const handleDelete = (id: number) => {
        const foodItem = foodItems.find(item => item.id === id);
        if (foodItem) {
            setSelectedFoodItem(foodItem);
            setIsDeleteOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!selectedFoodItem) return;
        try {
            console.log("Deleting food item with ID:", selectedFoodItem.id);
            // await deleteFoodItem(selectedFoodItem.id);
            toast.success("Food item deleted successfully!");
            fetchFoodItems(currentUser); // refresh table
        } catch (err: unknown) {
            toast.error((err as { message?: string })?.message || "Failed to delete food item");
        }
    };

    // Check if current user is management (can't edit/delete)
    const isManagement = currentUser?.role === "management";
    const isSupplier = currentUser?.role === "supplier";

    if (loading) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading food items...
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
                    No food items found.
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
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
                                    Hospital Price
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Status
                                </TableCell>
                                {!isManagement && (
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Actions
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {currentItems.map((foodItem) => (
                                <TableRow key={foodItem.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {foodItem.id}
                                    </TableCell>

                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="w-10 h-10 overflow-hidden rounded-full">
                                            <Image
                                                width={40}
                                                height={40}
                                                src={foodItem.imageUrl || DEFAULT_FOOD_IMAGE}
                                                alt={foodItem.name}
                                                className="object-cover"
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
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {foodItem.category}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Rs.{foodItem.price}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Rs.{foodItem.employeeprice}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Rs.{foodItem.hospitalprice}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-start">
                                        <span className={`px-2 py-1 text-xs rounded-full ${foodItem.available
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                            }`}>
                                            {foodItem.available ? "Available" : "Unavailable"}
                                        </span>
                                    </TableCell>

                                    {/* Actions Column - Hidden for management */}
                                    {!isManagement && (
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="flex items-center gap-2">
                                                {/* View Button */}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => foodItem.id !== undefined && handleView(foodItem.id)}
                                                    className="p-1 border-transparent text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                                >
                                                    <FiEye size={16} />
                                                </Button>
                                                {/* Edit Button - Only for supplier */}
                                                {isSupplier && foodItem.id !== undefined && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => foodItem.id !== undefined && handleEdit(foodItem.id)}
                                                    >
                                                        <FiEdit size={16} />
                                                    </Button>
                                                )}
                                                {/* Delete Button - Only for supplier */}
                                                {isSupplier && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => foodItem.id !== undefined && handleDelete(foodItem.id)}
                                                        className="text-red-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                                    >
                                                        <FiTrash size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Component */}
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-white/[0.05]">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}

                title={
                    popupMode === "edit"
                        ? "Edit Food Item"
                        : "View Food Item"
                }
            >
                <FoodItemForm
                    mode={popupMode}
                    foodItemId={selectedFoodItem?.id}
                    onSubmit={async () => {
                        setIsPopupOpen(false);
                        fetchFoodItems(currentUser);
                    }}
                />
            </Popup>

            <DeleteConfirmation
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedFoodItem?.name}
            />
        </div>
    );
}