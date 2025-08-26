import axiosAuth from "@/lib/axiosAuth";
import {NormalEmployee} from "@/types/httpResponseType";

//Get All the NormalEmployees
export const getAllNormalEmployees = async () => {
    const res: NormalEmployee[] = await axiosAuth.get("/normal-employees");
    console.log("All Normal Employees:🚀",  res);
    return res;
};
