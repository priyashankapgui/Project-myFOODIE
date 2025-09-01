import axiosAuth from "@/lib/axiosAuth";
import {SupplierResponse,userSupplier,EditSupplier,} from "@/types/httpResponseType";
import { toast } from "react-toastify";


export const getAllSuppliers = async () => {
    try{
    const res: SupplierResponse[] = await axiosAuth.get("/suppliers");
    console.log("All Suppliers:🚀",  res);
    return res;
    }catch{
        toast.error("Failed to fetch suppliers");
    }
};


export const createSupplier = async (data: userSupplier) => {
    try{
    const res: SupplierResponse = await axiosAuth.post("/auth/signup", data);
    console.log("Created Supplier:🚀",  res);
    toast.success("Supplier created successfully");
    return res;
    }catch{
        toast.error("Failed to create supplier");
    }
};

export const getSupplierById = async (id: string) => {
    try{
    console.log("Fetching Supplier by ID:🚀",  id);
    const res: EditSupplier = await axiosAuth.get(`/suppliers/${id}`);
    console.log("Fetched Supplier:🚀",  res);
    toast.success("Fetched supplier details successfully");
    return res;
    } catch{
        toast.error("Failed to fetch supplier details");
    }
};

export const updateSupplier = async (id: string, data: EditSupplier) => {
    try{
    console.log("Updating Supplier:🚀",  { id, data });
    const res: EditSupplier = await axiosAuth.put(`/suppliers/${id}`, data);
    console.log("Updated Supplier:🚀",  res);
    toast.success("Supplier updated successfully");
    return res;
    }catch{
        toast.error("Failed to update supplier")
    }
};

export const deleteSupplier = async (id: string) => {
    try{
    console.log("Deleting Supplier:🚀",  id);
    await axiosAuth.delete(`/suppliers/${id}`);
    toast.success(" Supplier deleted successfully");
    }catch{
        toast.error("Failed to delete supplier");
    }
};