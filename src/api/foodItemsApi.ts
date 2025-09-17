import axiosAuth from "@/lib/axiosAuth";
import { FoodItemAttributes,FoodItemEdit ,TodaySpecial,Userdep} from "@/types/httpResponseType";
import { toast } from "react-toastify";

// GET all food items
export const getAllFoodItems = async () => {
    const res: FoodItemAttributes[] = await axiosAuth.get("/food-items");
    console.log("All Food Items:🚀",  res);
    return res;
};

// GET food items by supplier ID
export const getFoodItemsBySupplierId = async (supplierId: string) => {
    const res: FoodItemAttributes[] = await axiosAuth.get(`/food-items/supplier/${supplierId}`);
    console.log("Food Items by Supplier ID:🚀",  res);
    return res;
};

// CREATE a food item
export const createFoodItem = async (data: FoodItemEdit) => {
    try{
        console.log("Creating Food Item:👨🏽‍💻",  data);
    const res: FoodItemAttributes = await axiosAuth.post("/food-items", data);
    console.log("Created Food Item:🚀",  res);
    toast.success("Food Item created successfully");
    return res;
    }catch{
        toast.error("Failed to create food item");
    }
};

// GET food item by ID
export const getFoodItemById = async (id: number) => {
    const res: TodaySpecial = await axiosAuth.get(`/food-items/${id}`);
    console.log("Food Item by ID:🚀",  res);
    return res;
};

// UPDATE a food item
export const updateFoodItem = async (id: number, data: FoodItemEdit) => {
    try {
        console.log("Updating Food Item:👨🏽‍💻",  data);
        const res: FoodItemEdit = await axiosAuth.put(`/food-items/${id}`, data);
        console.log("Updated Food Item:🚀",  res);
        toast.success("Food Item updated successfully");
        return res;
    } catch {
        toast.error("Failed to update food item");
    }
};

// GET today's special food items
export const todaySpecial = async () => {
    const res: TodaySpecial[] = await axiosAuth.get("/food-items/foods/todayspecials");
    console.log("Today's Special Food Items:🚀",  res);
    return res;
};

// GET department users by department ID
export const getDepartmentUsers = async (departmentId: number) => {
    const res: Userdep = await axiosAuth.get(`/food-items/user/departmentUser/${departmentId}`);
    console.log("Department Users:🚀", res);
    return res;
};

// DELETE a food item
export const deleteFoodItem = async (id: number) => {
    try {
        console.log("Deleting Food Item:👨🏽‍💻", id);
        await axiosAuth.delete(`/food-items/${id}`);
        toast.success("Food Item deleted successfully");
    } catch {
        toast.error("Failed to delete food item");
    }
};