import axiosAuth from "@/lib/axiosAuth";
import { AuthData } from "@/types/httpResponseType";
import { setToken, setLocalUser, logoutUser } from "@/store/local_storage";
import { toast } from "react-toastify";

// LOGIN
export async function loginUser(email: string, password: string) {
  try {
    console.log("Logging in user with email:", email, password);

    const res: AuthData = await axiosAuth.post("/auth/login", { email, password });

    console.log("Login response:🚀", res);

    // store in localStorage
    setToken(res.token);
    setLocalUser(res.user);

    toast.success(" Login successful!");

    return res;
  } catch (err: unknown) {
    toast.error("Login failed. Please try again.");
    throw err;
  }
}

// LOGOUT
export async function signOutUser( userId: string ) {
  try {
    const res: AuthData = await axiosAuth.post("/auth/logout", { userId });

    console.log("Logout response:🚀", res);

    logoutUser(); 

    toast.success(" Logged out successfully!");

    return res;
  } catch (err: unknown) {
    toast.error(" Logout failed. Please try again.");
    throw err;
  }
}


