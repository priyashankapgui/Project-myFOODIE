import axiosAuth from "@/lib/axiosAuth";
import {OrderAttributes} from "@/types/httpResponseType";
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