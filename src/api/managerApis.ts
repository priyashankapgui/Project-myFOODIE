import axiosAuth from "@/lib/axiosAuth";
import {ManagerResponse,userManager,EditManager,} from "@/types/httpResponseType";
import { toast } from "react-toastify";


export const getAllManagers = async () => {
    try{
    const res: ManagerResponse[] = await axiosAuth.get("/management-employees");
    console.log("All Managers:🚀",  res);
    return res;
    }catch{
        toast.error("Failed to fetch managers");
    }
};


export const createManager = async (data: userManager) => {
    try{
    const res: ManagerResponse = await axiosAuth.post("/auth/signup", data);
    console.log("Created Manager:🚀",  res);
    toast.success("Manager created successfully");
    return res;
    }catch{
        toast.error("Failed to create manager");
    }
};

export const getManagerById = async (id: string) => {
    try{
    console.log("Fetching Manager by ID:🚀",  id);
    const res: EditManager = await axiosAuth.get(`/management-employees/${id}`);
    console.log("Fetched Manager:🚀",  res);
    toast.success("Fetched manager details successfully");
    return res;
    } catch{
        toast.error("Failed to fetch manager details");
    }
};

export const updateManager = async (id: string, data: EditManager) => {
    try{
    console.log("Updating Manager:🚀",  { id, data });
    const res: EditManager = await axiosAuth.put(`/management-employees/${id}`, data);
    console.log("Updated Manager:🚀",  res);
    toast.success("Manager updated successfully");
    return res;
    }catch{
        toast.error("Failed to update manager");
    }
};

export const deleteManager = async (id: string) => {
    try{
    console.log("Deleting Manager:🚀",  id);
    await axiosAuth.delete(`/management-employees/${id}`);
    toast.success("Manager deleted successfully");
    }catch{
        toast.error("Failed to delete manager");
    }
};