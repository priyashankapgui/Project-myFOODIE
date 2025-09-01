/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons/";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getDepartments } from "@/api/departmentApis";
import { todaySpecial } from "@/api/foodItemsApi";
import { createOrder } from "@/api/orderApi";
import { getDepartmentUsers } from "@/api/foodItemsApi";
import { getLocalUser } from "@/store/local_storage";
import { Userdep } from "@/types/httpResponseType";
import { User, Department, FoodItem, OrderItem } from "@/types/orderTypes";



export default function AddNewOrderForm() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [departmentUsers, setDepartmentUsers] = useState<User[]>([]);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<string>("");
    const [mealType, setMealType] = useState<string>("");

    const router = useRouter();

    // Get current user from localStorage
    const currentUser = getLocalUser();
    const currentDepartmentId = currentUser.departmentId ? parseInt(currentUser.departmentId) : null;

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch departments
                const deptData = await getDepartments();
                setDepartments(deptData ?? []);

                if (currentDepartmentId) {
                    try {
                        const userDep = await getDepartmentUsers(currentDepartmentId) as Userdep;
                        const usersData: User[] = userDep?.users ?? [];
                        setDepartmentUsers(usersData.filter(user => user.id && user.name));
                        console.log("Fetched users:", usersData);
                    } catch (error) {
                        toast.error("Failed to fetch department users");
                        console.error("Error fetching department users:", error);
                    }
                } else {
                    toast.error("User department not found");
                }
                // Fetch today's special food items
                const foodItemsData = await todaySpecial();
                setFoodItems(foodItemsData ?? []);
                setMealType(foodItemsData && foodItemsData.length > 0 ? foodItemsData[0].supplier?.foodType ?? "" : "");

            } catch (err) {
                toast.error("Failed to load form data");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentDepartmentId]);

    // Add new order item
    const addOrderItem = () => {
        setOrderItems(prev => [
            ...prev,
            { foodItemId: 0, userId: "", quantity: 1 }
        ]);
    };

    // Update order item
    const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
        setOrderItems(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: field === 'quantity' ? Number(value) : value } : item
        ));
    };

    // Remove order item
    const removeOrderItem = (index: number) => {
        setOrderItems(prev => prev.filter((_, i) => i !== index));
    };

    // Get unique suppliers from food items
    const suppliers = Array.from(new Set(foodItems.map(item => item.supplierId)))
        .filter(supplierId => supplierId) // Remove undefined values
        .map(supplierId => ({
            value: supplierId as string,
            label: `Supplier ${supplierId}`
        }));

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSupplier) {
            toast.error("Please select a supplier");
            return;
        }

        if (orderItems.length === 0) {
            toast.error("Please add at least one order item");
            return;
        }

        // Validate all order items
        const invalidItems = orderItems.filter(item =>
            !item.foodItemId || !item.userId || item.quantity <= 0
        );

        if (invalidItems.length > 0) {
            toast.error("Please fill all fields for each order item");
            return;
        }

        try {
            const orderData = {
                orderData: {
                    orderCreatorUserId: currentUser.id || "U002",
                    status: "pending",
                    supplierId: selectedSupplier,
                    departmentId: currentDepartmentId,
                    mealType: mealType
                },
                items: orderItems
            };

            await createOrder(orderData);
            toast.success("Order created successfully!");
            router.push("/orders");

        } catch (err) {
            toast.error("Failed to create order");
            console.error("Error creating order:", err);
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                    Loading form data...
                </div>
            </div>
        );
    }

    if (!currentDepartmentId) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-500 dark:text-red-400">
                    User department not found. Please contact administrator.
                </div>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Department Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    Ordering for <strong>{currentUser.departmentId ? `Department ${currentUser.departmentId}` : 'your department'}</strong>
                </p>
            </div>

            {/* Supplier Selection */}
            <div>
                <Label>Select Supplier</Label>
                <div className="relative">
                    <Select
                        options={suppliers}
                        placeholder="Select a supplier"
                        onChange={setSelectedSupplier}
                        className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                    </span>
                </div>
            </div>

            {/* Order Items */}
            <div>
                <Label>Order Items</Label>
                <div className="space-y-4">
                    {orderItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                            {/* Food Item Selection */}
                            <div>
                                <Label>Food Item</Label>
                                <Select
                                    options={foodItems.map(item => ({
                                        value: item.id.toString(),
                                        label: `${item.name} - Rs. ${item.price}`
                                    }))}
                                    placeholder="Select food item"
                                    onChange={(value) => updateOrderItem(index, "foodItemId", parseInt(value))}
                                    className="dark:bg-dark-900"
                                />
                            </div>

                            {/* User Selection (Department users only) */}

                            <div>
                                <Label>For User</Label>
                                <Select
                                    options={departmentUsers.map(user => ({
                                        value: user.id,
                                        label: user.name
                                    }))}
                                    placeholder="Select user"
                                    onChange={(value) => updateOrderItem(index, "userId", value)}
                                    className="dark:bg-dark-900"
                                />
                            </div>

                            {/* Quantity */}
                            <div>
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    defaultValue={item.quantity}
                                    onChange={(e) => updateOrderItem(index, "quantity", e.target.value)}
                                    placeholder="Quantity"
                                />
                            </div>

                            {/* Remove Button */}
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => removeOrderItem(index)}
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Add Item Button */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addOrderItem}
                        className="w-full"
                    >
                        + Add Item
                    </Button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Create Order
                </Button>
            </div>
        </form>
    );
}