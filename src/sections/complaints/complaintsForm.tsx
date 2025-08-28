/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { IoIosArrowDown } from "react-icons/io";
import DatePicker from '@/components/form/date-picker';
import { getAllSuppliers } from "@/api/supplierApis";
import { createComplain } from "@/api/complainApis";
import { toast } from "react-toastify";
import { getLocalUser } from "@/store/local_storage";
import { FeedbackSchema } from "@/validation/feedback";

interface Supplier {
    id: string;
    user: {
        name: string;
    };
}

// Interface for form data that matches the Zod schema
interface FeedbackFormData {
    userId: string;
    supplierId: string;
    comment: string;
    feedbackDate: Date;
}

export default function ComplaintForm() {
    const [supplierId, setSupplierId] = useState("");
    const [userId, setUserId] = useState("");
    const [complaintDate, setComplaintDate] = useState<Date | null>(null);
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Get userId from localStorage on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = getLocalUser();
            if (user && user.id) {
                setUserId(user.id);
                console.log("User ID from localStorage:", user.id);
            } else {
                console.error("No user found in localStorage");
                toast.error("Please log in to submit a complaint");
            }
        }
    }, []);

    // Fetch suppliers on component mount
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const data = await getAllSuppliers();
                setSuppliers(data || []);
            } catch (error) {
                console.error("Error fetching suppliers:", error);
                toast.error("Failed to load suppliers");
            }
        };
        fetchSuppliers();
    }, []);

    // Prepare supplier options for Select component
    const supplierOptions = suppliers.map(supplier => ({
        value: supplier.id,
        label: supplier.user.name,
    }));

    // Validate form data using Zod schema
    const validateForm = (formData: Partial<FeedbackFormData>) => {
        try {
            FeedbackSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "issues" in error) {
                const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
                const newErrors: Record<string, string> = {};
                zodError.issues.forEach((issue: { path: (string | number)[]; message: string; }) => {
                    newErrors[issue.path[0]] = issue.message;
                });
                setErrors(newErrors);

                // Show first error in toast
                if (zodError.issues.length > 0) {
                    toast.error(zodError.issues[0].message);
                }
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            toast.error("User not authenticated. Please log in again.");
            return;
        }

        // Prepare form data for validation
        const formData: Partial<FeedbackFormData> = {
            userId,
            supplierId,
            comment: message,
            feedbackDate: complaintDate || new Date()
        };

        // Validate using Zod schema
        if (!validateForm(formData)) {
            return;
        }

        setLoading(true);

        try {
            // Ensure we have a valid date
            const finalFeedbackDate = complaintDate || new Date();

            const feedbackData = {
                userId: userId,
                supplierId: supplierId,
                comment: message,
                feedbackDate: finalFeedbackDate
            };

            console.log("Submitting complaint:", feedbackData);

            const response = await createComplain(feedbackData);

            if (response) {
                setSubmitted(true);
                toast.success("Complaint submitted successfully!");

                // Clear form data
                setSupplierId("");
                setComplaintDate(new Date());
                setMessage("");

                // Clear errors
                setErrors({});

                // Reset submitted status after 3 seconds
                setTimeout(() => setSubmitted(false), 3000);
            }
        } catch (err: any) {
            console.error("Error submitting complaint:", err);
            const errorMessage = err.response?.data?.message || "Failed to submit complaint";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    console.log("Success", submitted);

    function handleSelectChange(value: string): void {
        setSupplierId(value);
        // Clear error when user selects something
        if (errors.supplierId) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.supplierId;
                return newErrors;
            });
        }
    }

    const handleDateChange = (dates: any, dateString: string | string[]) => {
        const selectedDate = Array.isArray(dateString) ? dateString[0] : dateString;
        if (selectedDate) {
            const dateObj = new Date(selectedDate);
            setComplaintDate(dateObj);

            // Clear error when user selects a date
            if (errors.feedbackDate) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.feedbackDate;
                    return newErrors;
                });
            }
        }
    };

    const handleMessageChange = (value: string) => {
        setMessage(value);
        if (errors.comment) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.comment;
                return newErrors;
            });
        }
    };

    return (
        <ComponentCard
            title="Complaint Form"
            desc="Submit your complaints."
        >
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Supplier Selection Field */}
                <div>
                    <Label>Select Supplier *</Label>
                    <div className="relative">
                        <Select
                            options={supplierOptions}
                            placeholder="Select a supplier"
                            onChange={handleSelectChange}
                            value={supplierId}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-500">
                            <IoIosArrowDown />
                        </span>
                        {errors.supplierId && (
                            <p className="mt-1 text-sm text-red-600">{errors.supplierId}</p>
                        )}
                    </div>
                </div>

                {/* Date Picker Field */}
                <div>
                    <DatePicker
                        id="complaint-date-picker"
                        label="Complaint Date * (only today or past dates)"
                        placeholder="Select the complaint date"
                        onChange={handleDateChange}
                        defaultDate={complaintDate ? complaintDate.toISOString().split('T')[0] : ''}
                    />
                    {errors.feedbackDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.feedbackDate}</p>
                    )}
                </div>

                {/* Complaint Field */}
                <div>
                    <Label>Complaint *</Label>
                    <TextArea
                        value={message}
                        onChange={handleMessageChange}
                        rows={6}
                        placeholder="Enter your complaint"
                    />
                    {errors.comment && (
                        <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                    <button
                        type="submit"
                        disabled={loading || !userId}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting..." : "Submit Complaint"}
                    </button>
                </div>

                {!userId && (
                    <p className="text-sm text-red-600">
                        You must be logged in to submit a complaint.
                    </p>
                )}
            </form>
        </ComponentCard>
    );
}