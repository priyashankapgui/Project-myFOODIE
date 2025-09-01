/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons/";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getLocalUser } from "@/store/local_storage";
import { updateOrderStatus } from "@/api/orderApi";
import { Order, OrderItem } from "@/types/httpResponseType";

type OrderFormProps = {
    mode: "update";
    order: Order | undefined;
    onUpdate: () => void;
};

type StatusUpdateData = {
    status: string;
    collectedByUserId?: string;
    receivedItems?: {
        orderItemId: number;
        receivedQuantity: number;
    }[];
    reason?: string;
};

export default function EditOrderForm({ mode, order, onUpdate }: OrderFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<StatusUpdateData>({
        status: "",
        collectedByUserId: "",
        receivedItems: [],
        reason: ""
    });
    const [userRole, setUserRole] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        // Get user info from localStorage
        const user = getLocalUser();
        if (user && user.role && user.id) {
            setUserRole(user.role);
            setUserId(user.id);

            // Set default collectedByUserId to current user for collected status
            setFormData(prev => ({
                ...prev,
                collectedByUserId: user.id
            }));
        }

        // Initialize received items but don't set status by default
        if (order) {
            setFormData(prev => ({
                ...prev,
                receivedItems: order.orderItems.map(item => ({
                    orderItemId: item.id,
                    receivedQuantity: item.quantity
                }))
            }));
        }
    }, [order]);

    const handleStatusChange = (value: string) => {
        setFormData(prev => ({ ...prev, status: value }));
    };

    const handleQuantityChange = (orderItemId: number, quantity: number) => {
        setFormData(prev => ({
            ...prev,
            receivedItems: prev.receivedItems?.map(item =>
                item.orderItemId === orderItemId
                    ? { ...item, receivedQuantity: quantity }
                    : item
            )
        }));
    };

    const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, reason: e.target.value }));
    };

    const getStatusOptions = () => {
        if (userRole === "supplier") {
            return [
                { value: "pending", label: "Pending" },
                { value: "prepared", label: "Prepared" },
                { value: "collected", label: "Collected" }
            ];
        } else if (userRole === "normalEmployee" || userRole === "manager") {
            return [
                { value: "completed", label: "Completed" },
                { value: "non-completed", label: "Non-Completed" },
            ];
        }
        return [];
    };

    const validateForm = (): boolean => {
        if (!formData.status) {
            toast.error("Please select a status");
            return false;
        }

        if (formData.status === "non-completed" && !formData.reason) {
            toast.error("Please provide a reason for non-completion");
            return false;
        }

        if (formData.status === "collected" && !formData.collectedByUserId) {
            toast.error("Please provide collector information");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!order || !validateForm()) return;

        try {
            setLoading(true);

            // Prepare the payload based on status
            let payload: any = { status: formData.status };

            if (formData.status === "non-completed") {
                payload = {
                    status: formData.status,
                    receivedItems: formData.receivedItems,
                    reason: formData.reason
                };
            } else if (formData.status === "collected") {
                payload.collectedByUserId = formData.collectedByUserId;
            }

            console.log("Payload for updating order status:", payload);
            await updateOrderStatus(order.id, payload);
            toast.success("Order status updated successfully!");
            onUpdate();
        } catch (err: any) {
            console.error("Error updating order status:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!order) {
        return <div className="p-4 text-center">Order not found</div>;
    }

    return (
        <div className="max-h-[60vh] overflow-y-auto p-4">
            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Current Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <div>
                        <Label className="font-semibold">Order ID</Label>
                        <p className="text-theme-base">{order.id}</p>
                    </div>
                    <div>
                        <Label className="font-semibold">Current Status</Label>
                        <p className="text-theme-base capitalize">{order.status}</p>
                    </div>
                    <div>
                        <Label className="font-semibold">Meal Type</Label>
                        <p className="text-theme-base capitalize">{order.mealType}</p>
                    </div>
                    <div>
                        <Label className="font-semibold">Total Items</Label>
                        <p className="text-theme-base">{order.totalRequestOrderItems}</p>
                    </div>
                    <div>
                        <Label className="font-semibold">Total Employee Price</Label>
                        <p className="text-theme-base">{order.totalOrderEmployeePrice}</p>
                    </div>
                    <div>
                        <Label className="font-semibold">Total Hospital Price</Label>
                        <p className="text-theme-base">{order.totalOrderHospitalPrice}</p>
                    </div>
                    <div>
                        <Label className="font-semibold">Total Order Price</Label>
                        <p className="text-theme-base">{order.totalOrderPrice}</p>
                    </div>
                    <div>
                        <Label className="font-semibold">Ordered By (User ID)</Label>
                        <p className="text-theme-base">{order.orderCreatorUserId}</p>
                    </div>
                </div>

                {/* Status Selection */}
                <div>
                    <Label>Update Status</Label>
                    <div className="relative">
                        <Select
                            options={getStatusOptions()}
                            placeholder="Select Status"
                            onChange={handleStatusChange}
                            value={formData.status}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>

                {/* Collector Information (for collected status) */}
                {formData.status === "collected" && (
                    <div>
                        <Label>Collected By (User ID)</Label>
                        <Input
                            type="text"
                            defaultValue={formData.collectedByUserId || ""}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                collectedByUserId: e.target.value
                            }))}
                            placeholder="Enter collector user ID"

                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Current user ID will be used as collector
                        </p>
                    </div>
                )}

                {/* Received Items (for non-completed status) */}
                {formData.status === "non-completed" && (
                    <div>
                        <Label>Received Items</Label>
                        <div className="space-y-3 p-3 border rounded-lg dark:border-gray-700">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <span className="text-sm">Item {item.foodItemId}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">
                                            Ordered: {item.quantity}
                                        </span>
                                        <Input
                                            type="number"
                                            min="0"

                                            defaultValue={
                                                formData.receivedItems?.find(
                                                    ri => ri.orderItemId === item.id
                                                )?.receivedQuantity || 0
                                            }
                                            onChange={(e) =>
                                                handleQuantityChange(item.id, parseInt(e.target.value) || 0)
                                            }
                                            className="w-20"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reason (for non-completed status) */}
                {formData.status === "non-completed" && (
                    <div>
                        <Label>Reason for Non-Completion</Label>
                        <textarea
                            value={formData.reason || ""}
                            onChange={handleReasonChange}
                            placeholder="Explain why the order couldn't be completed..."
                            className="w-full p-3 border rounded-lg resize-none dark:bg-dark-900 dark:border-gray-700"
                            rows={3}
                            required
                        />
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={loading}
                        variant="primary"
                    >
                        {loading ? "Updating..." : "Update Status"}
                    </Button>
                </div>
            </form>
        </div>
    );
}