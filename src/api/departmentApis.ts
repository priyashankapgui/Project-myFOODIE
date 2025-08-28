import axiosAuth from "@/lib/axiosAuth";
import { DepartmentAttributes } from "@/types/httpResponseType";


export const getDepartments = async () => {
    const res: DepartmentAttributes[] = await axiosAuth.get("/departments");
    console.log("All Departments:🚀",  res);
    return res;
};

export const createDepartment = async (data: DepartmentAttributes): Promise<DepartmentAttributes> => {
    const response = await axiosAuth.post("/departments", data);
    return response.data;
};

export const updateDepartment = async (id: string, data: DepartmentAttributes): Promise<DepartmentAttributes> => {
    const response = await axiosAuth.put(`/departments/${id}`, data);
    return response.data;
};

export const deleteDepartment = async (id: string): Promise<void> => {
    await axiosAuth.delete(`/departments/${id}`);
};
