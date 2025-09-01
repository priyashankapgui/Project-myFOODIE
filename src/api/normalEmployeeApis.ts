import axiosAuth from "@/lib/axiosAuth";
import {NormalEmployee,userEmp,EditEmployees,EdituserEmp} from "@/types/httpResponseType";
import { toast } from "react-toastify";

//Get All the NormalEmployees
export const getAllNormalEmployees = async () => {
    const res: NormalEmployee[] = await axiosAuth.get("/normal-employees");
    console.log("All Normal Employees:🚀",  res);
    return res;
};

export const createNormalEmployee = async (data: userEmp) => {
    const res: NormalEmployee = await axiosAuth.post("/auth/signup", data);
    console.log("Created Normal Employee:🚀",  res);
    toast.success("✅ Employee created successfully");
    return res;
};

export const getEmployeeById = async (id: string) => {
    const res: EditEmployees = await axiosAuth.get(`/normal-employees/${id}`);
    console.log("Fetched Normal Employee:🚀",  res);
    return res;
};

export const updateEmployee = async (id: string, data: EdituserEmp) => {
    console.log("Updating Normal Employee:🚀",  { id, data });
    const res: EditEmployees = await axiosAuth.put(`/normal-employees/${id}`, data);
    console.log("Updated Normal Employee:🚀",  res);
    toast.success("✅ Employee updated successfully");
    return res;
};

export const deleteEmployee = async (id: string) => {
    console.log("Deleting Normal Employee:🚀",  id);
    await axiosAuth.delete(`/normal-employees/${id}`);
    toast.success("✅ Employee deleted successfully");
};
