import axiosAuth from "@/lib/axiosAuth";
import { DepartmentAttributes,DepartmentEdit } from "@/types/httpResponseType";
import { toast } from "react-toastify";

// GET all departments
export const getDepartments = async () => {
    const res: DepartmentAttributes[] = await axiosAuth.get("/departments");
    console.log("All Departments:🚀",  res);
    return res;
};

// CREATE a department
export const createDepartment = async (data: DepartmentEdit) => {
    try{
        console.log("Creating Department:👨🏽‍💻",  data);
    const res: DepartmentAttributes = await axiosAuth.post("/departments", data);
    console.log("Created Department:🚀",  res);
    toast.success("Department created successfully");
    return res;
    }catch{
        toast.error("Failed to create department");
    }
};

// GET department by ID
export const getDepartmentById = async (id: number) => {
    try{
    console.log("Fetching Department by ID:🚀",  id);
    const res: DepartmentEdit = await axiosAuth.get(`/departments/${id}`);
    console.log("Fetched Department:🚀",  res);
    toast.success("Fetched department details successfully");
    return res;
    } catch{
        toast.error("Failed to fetch department details");
    }
};

// UPDATE a department
export const updateDepartment = async (id: number, data: DepartmentEdit) => {
    try{
    console.log("Updating Department:🚀",  { id, data });
    const res: DepartmentEdit = await axiosAuth.put(`/departments/${id}`, data);
    console.log("Updated Department:🚀",  res);
    toast.success("Department updated successfully");
    return res;
    }catch{
        toast.error("Failed to update department");
    }
};

// DELETE a department
export const deleteDepartment = async (id: number) => {
    try{
    console.log("Deleting Department:🚀",  id);
    await axiosAuth.delete(`/departments/${id}`);
    toast.success("Department deleted successfully");
    }catch{
        toast.error("Failed to delete department");
    }
};