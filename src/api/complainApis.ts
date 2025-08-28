 import axiosAuth from "@/lib/axiosAuth";
import {ComplainsAttributes} from "@/types/httpResponseType";
import { toast } from "react-toastify";


export const getAllComplains = async () => {
    try{
    const res: ComplainsAttributes[] = await axiosAuth.get("/feedbacks");
    console.log("All Complains:🚀",  res);
    return res;
    }catch{
        toast.error("Failed to fetch Complains");
    }
};


export const createComplain = async (data: ComplainsAttributes) => {
    try{
    const res: ComplainsAttributes = await axiosAuth.post("/feedbacks", data);
    console.log("Created Complain:🚀",  res);
    return res;
    }catch{
        toast.error("Failed to create Complain");
    }
};

export const getComplainById = async (id: string) => {
    try{
    const res: ComplainsAttributes = await axiosAuth.get(`/feedbacks/${id}`);
    console.log("Complain Details:🚀",  res);
    return res;
    }catch{
        toast.error("Failed to fetch Complain");
    }
};

export const getComplainBySupplierId = async (supplierId: string) => {
    try{
    const res: ComplainsAttributes[] = await axiosAuth.get(`/feedbacks/${supplierId}`);
    console.log("Complains by Supplier ID:🚀",  res);
    return res;
    }catch{
        toast.error("Failed to fetch Complains by Supplier ID");
    }
};
