import axiosAuth from "@/lib/axiosAuth";
import { OrderSummaryResponse,supllierMonthlyOrderSummary} from "@/types/httpResponseType";
import { toast } from "react-toastify";


export const getAllOrderSummary = async () => {
    try{
    const res: OrderSummaryResponse = await axiosAuth.get("/order-summary");
    console.log("All Order Summary:🚀",  res);
    return res;
    }catch{
        toast.error("Failed to fetch Order Summary");
    }
};

export const getSupplierMonthlyOrder = async (supplierId: string, year: number, month: number) => {
    try {
        const res: supllierMonthlyOrderSummary = await axiosAuth.get(`/order-summaries/monthly/${supplierId}/${year}/${month}`);
        console.log(`Supplier Monthly Order Summary for ${supplierId}:🚀`, res);
        return res;
    } catch {
        toast.error("Failed to fetch Supplier Monthly Order Summary");
    }
};


export const  getAllMonthlyOrderSummary = async () => {
    try {
        const res: supllierMonthlyOrderSummary = await axiosAuth.get(`/order-summaries/totals/monthly/`);
        console.log(`All Monthly Order Summary  :🚀`, res);
        return res;
    } catch {
        toast.error("Failed to fetch All Monthly Order Summary");
    }
};