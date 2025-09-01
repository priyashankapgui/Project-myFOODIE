import axiosAuth from "@/lib/axiosAuth";
import {OrderAttributes,Order} from "@/types/httpResponseType";;
import { toast } from "react-toastify";


export const createOrder = async (data: OrderAttributes) => {
    try{
        console.log("Creating Department:👨🏽‍💻",  data);
    const res: OrderAttributes = await axiosAuth.post("/orders", data);
    console.log("Created Department:🚀",  res);
    toast.success("Department created successfully");
    return res;
    }catch{
        toast.error("Failed to create department");
    }
};


export const getOrderById = async (id: string) => {
    try {
        console.log("Fetching Order:👨🏽‍💻", id);
        const res: Order = await axiosAuth.get(`/orders/${id}`);
        console.log("Fetched Order:🚀", res);
        return res;
    } catch {
        toast.error("Failed to fetch order");
    }
};

export const updateOrder = async (id: string, data: Order) => {
    try {
        console.log("Updating Order:👨🏽‍💻", id, data);
        const res: Order = await axiosAuth.put(`/orders/${id}`, data);
        console.log("Updated Order:🚀", res);
        toast.success("Order updated successfully");
        return res;
    } catch {
        toast.error("Failed to update order");
    }
};

export const getAllOrders = async () => {
    try {
        console.log("Fetching All Orders:👨🏽‍💻");
        const res: Order[] = await axiosAuth.get("/orders");
        console.log("Fetched All Orders:🚀", res);
        return res;
    } catch {
        toast.error("Failed to fetch orders");
    }
};

export const getOrderByUserId = async (userId: string) => {
    try {
        console.log("Fetching Orders by User ID:👨🏽‍💻", userId);
        const res: Order[] = await axiosAuth.get(`/orders/userid/${userId}`);
        console.log("Fetched Orders by User ID:🚀", res);
        return res;
    } catch {
        toast.error("Failed to fetch orders by user");
    }
};


export const getOrderBySupplierId = async (supplierId: string) => {
    try {
        console.log("Fetching Orders by Supplier ID:👨🏽‍💻", supplierId);
        const res: Order[] = await axiosAuth.get(`/orders/supplier/${supplierId}`);
        console.log("Fetched Orders by Supplier ID:🚀", res);
        return res;
    } catch {
        toast.error("Failed to fetch orders by supplier");
    }
};

export const updateOrderStatus = async (orderId: string, data:Order) => {
    try {
        console.log("Updating Order:👨🏽‍💻", orderId, data .status);
        const res: Order = await axiosAuth.put(`/orders/updateOrderStatus/${orderId}`, data);
        console.log("Updated Order:🚀", res);
        toast.success("Order updated successfully");
    }catch{
         toast.error("Failed to Chage Status");
    }
}