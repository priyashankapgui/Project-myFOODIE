"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { getComplainById } from "@/api/complainApis";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ComplainsgetByID } from "@/types/httpResponseType";

interface ComplaintFormProps {
    feedbackId: number;
}

export default function ComplaintForm({ feedbackId }: ComplaintFormProps) {
    const [feedbackData, setFeedbackData] = useState<ComplainsgetByID | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch feedback data
    useEffect(() => {
        const fetchFeedback = async () => {
            if (feedbackId) {
                try {
                    setLoading(true);
                    const feedback = await getComplainById(feedbackId.toString());
                    setFeedbackData(feedback ?? null);
                } catch (err) {
                    toast.error("Failed to load complaint details");
                    console.error("Error fetching feedback:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchFeedback();
    }, [feedbackId]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                    Loading complaint details...
                </div>
            </div>
        );
    }

    if (!feedbackData) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-500 dark:text-red-400">
                    Complaint not found.
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
        <div className="h-full flex flex-col">
            {/* Scrollable content container */}
            <div className="flex-1 overflow-y-auto space-y-4 p-1">
                {/* Complaint Header */}

                {/* Three-column grid for complaint details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Column 1: Basic Information */}
                    <div className="space-y-4">

                        <div>
                            <Label>Complaint ID</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-gray-900 dark:text-white">
                                    {feedbackData.id}
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Submitted Date</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-gray-900 dark:text-white">
                                    {formatDate(feedbackData.feedbackDate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Supplier Information */}
                    <div className="space-y-4">

                        <div>
                            <Label>Supplier Name</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-gray-900 dark:text-white">
                                    {feedbackData.supplier.user.name}
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Supplier ID</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-gray-900 dark:text-white">
                                    {feedbackData.supplier.id}
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Food Type</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-gray-900 dark:text-white">
                                    {feedbackData.supplier.foodType}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Contact Information */}
                    <div className="space-y-4">

                        <div>
                            <Label>Phone Number</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-gray-900 dark:text-white">
                                    {feedbackData.supplier.phone}
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Address</Label>
                            <div className="p-3 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                                <span className="text-gray-900 dark:text-white">
                                    {feedbackData.supplier.address}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complaint Comment - Full width */}
                <div className="mt-6">
                    <Label>Complaint Details</Label>
                    <div className="p-4 mt-1 bg-gray-50 rounded-md dark:bg-gray-800">
                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                            {feedbackData.comment}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}