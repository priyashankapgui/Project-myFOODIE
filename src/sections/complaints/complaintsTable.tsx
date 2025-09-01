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
import { FiEye } from "react-icons/fi";
import { getAllComplains, getComplainBySupplierId } from "@/api/complainApis"; // Create this API
import Popup from "@/components/ui/popup/Popup";
import ComplaintForm from "./complaintsViewForm";
import { ComplainsAttributes } from "@/types/httpResponseType";
import { getLocalUser } from "@/store/local_storage";
import { toast } from "react-toastify";

export default function FeedbacksTable() {
    const [feedbacks, setFeedbacks] = useState<ComplainsAttributes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<ComplainsAttributes | undefined>(undefined);


    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);

            const user = getLocalUser();

            if (user && user.role) {
                console.log("User role from localStorage:", user.role);

                if (user.role === "supplier" && user.roleId) {
                    // Call API for supplier-specific complaints
                    console.log("Fetching complaints for supplier ID:", user.roleId);
                    const supplierFeedbacks = await getComplainBySupplierId(user.roleId);
                    setFeedbacks(supplierFeedbacks ?? []);
                } else {
                    // Call API for all complaints
                    const apiFeedbacks = await getAllComplains();
                    setFeedbacks(apiFeedbacks ?? []);
                }

                setError(null);
            } else {
                console.error("No user found in localStorage");
                toast.error("Please log in to submit a complaint");
            }
        } catch (err) {
            setError("Failed to fetch feedbacks. Please try again.");
            console.error("Error fetching feedbacks:", err);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = feedbacks.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleView = (id: number) => {
        const feedback = feedbacks.find(fb => fb.id === id);
        setSelectedFeedback(feedback);
        setIsPopupOpen(true);
    };

    const formatDate = (date: string | Date) => {
        const d = typeof date === "string" ? new Date(date) : date;
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading feedbacks...
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

    if (feedbacks.length === 0) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No feedbacks found.
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[800px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    ID
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Feedback Date
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Supplier ID
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {currentItems.map((feedback) => (
                                <TableRow key={feedback.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {feedback.id}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {formatDate(feedback.feedbackDate)}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {feedback.supplierId}
                                    </TableCell>

                                    {/* Actions Column - View Only */}
                                    <TableCell className="px-4 py-3 text-start">
                                        <div className="flex items-center gap-2">
                                            {/* View Button Only */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => feedback.id !== undefined && handleView(feedback.id)}
                                                className="p-1 border-transparent text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                            >
                                                <FiEye size={16} />
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

            {/* View Popup */}
            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="View Feedback Details"
            >
                <ComplaintForm
                    feedbackId={selectedFeedback?.id ?? 0}
                />
            </Popup>
        </div>
    );
}