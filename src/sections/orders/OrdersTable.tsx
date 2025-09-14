/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import { FiEye, FiEdit, } from "react-icons/fi";
import Badge from "@/components/ui/badge/Badge";
import {
    getAllOrders,
    getOrderByUserId,
    getOrderBySupplierId
} from "@/api/orderApi";
import { TableOrder, Order } from "@/types/httpResponseType";
import Popup from "@/components/ui/popup/Popup";

import { getLocalUser } from "@/store/local_storage";
import EditOrderForm from "./EditOrderForm";

type PopupMode = "view" | "edit" | "update";

export default function OrderTable() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState<PopupMode>("view");
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);
    const [userRole, setUserRole] = useState<string>("");
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        // Get user info from localStorage
        const user = getLocalUser();
        if (user && user.role && user.id) {
            setUserRole(user.role);
            setUserId(user.id);
            fetchOrders(user.role, user.id, user.roleId);
        } else {
            setError("User information not found. Please log in again.");
            setLoading(false);
        }
    }, []);

    const fetchOrders = async (role: string, id: string, roleId: string) => {
        try {
            setLoading(true);
            let ordersData: Order[] = [];

            // Fetch orders based on user role
            if (role === "normalEmployee") {
                ordersData = await getOrderByUserId(id) ?? [];
            } else if (role === "management") {
                ordersData = await getAllOrders() ?? [];
            } else if (role === "supplier") {
                ordersData = await getOrderBySupplierId(roleId) ?? [];
            } else {
                setError("Invalid user role");
                return;
            }

            setOrders(ordersData);
            setError(null);
        } catch (err) {
            setError("Failed to fetch orders. Please try again.");
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = orders.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle View
    const handleView = (id: string) => {
        setPopupMode("view");
        const order = orders.find(order => order.id === id);
        setSelectedOrder(order);
        setIsPopupOpen(true);
    };

    // Handle Update Status (for suppliers)
    const handleUpdateStatus = (id: string) => {
        setPopupMode("update");
        const order = orders.find(order => order.id === id);
        setSelectedOrder(order);
        setIsPopupOpen(true);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    type BadgeColor = 'warning' | 'info' | 'success' | 'error' | 'dark' | 'light';

    const getStatusColor = (status: string): BadgeColor => {
        switch (status) {
            case 'pending':
                return 'warning'; // Yellow/orange for pending
            case 'prepared':
                return 'info';    // Blue for prepared
            case 'collected':
                return 'light'; // Light green for collected
            case 'completed':
                return 'success'; // Green for completed
            case 'non-completed':
                return 'error';   // Red for non-completed
            case 'cancelled':
                return 'dark';    // Dark gray for cancelled
            default:
                return 'light';   // Default light gray
        }
    };


    if (loading) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading orders...
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

    if (orders.length === 0) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No orders found.
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
                                    Order ID
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Date
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Meal Type
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Items
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Total Employee Price
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Status
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {currentItems.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {order.id}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {formatDate(order.orderDate)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 capitalize">
                                        {order.mealType}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {order.totalRequestOrderItems}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        Rs. {order.totalOrderEmployeePrice.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Badge
                                            variant="light"
                                            color={getStatusColor(order.status)}
                                            size="sm"
                                        >
                                            {order.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    {/* Actions Column with Button Component */}
                                    <TableCell className="px-4 py-3 text-start">
                                        <div className="flex items-center gap-2">
                                            {/* View Button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleView(order.id)}
                                                className="p-1 border-transparent text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                            >
                                                <FiEye size={16} />
                                            </Button>

                                            {/* Update Status Button (for suppliers) */}

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleUpdateStatus(order.id)}

                                            >
                                                <FiEdit size={16} />
                                            </Button>

                                        </div>
                                    </TableCell>
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

            {/* Order Details Popup */}
            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={popupMode === "view"
                    ? "Order Details"
                    : "Update Order Status"}
            >
                <EditOrderForm mode={"update"} order={selectedOrder} onUpdate={function (): void {
                    throw new Error("Function not implemented.");
                }} />


            </Popup>
        </div>
    );
}