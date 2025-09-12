import axiosAuth from "@/lib/axiosAuth";
import { AuthData } from "@/types/httpResponseType";
import { setToken, setLocalUser, logoutUser } from "@/store/local_storage";
import { ProfileEdit } from "@/types/httpResponseType";
import { toast } from "react-toastify";

//* LOGIN
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

//* LOGOUT
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

//* Request the otp code
export async function requestPasswordReset(email: string) {
  try {
    const res = await axiosAuth.post("/auth/forgot-password", { email });
   
    toast.success("Password reset email sent successfully!");
    return res;
  } catch (err: unknown) {
    toast.error("Failed to send password reset email.");
    throw err;
  }
}

//* Change the  password with otp
export async function  changePasswordwithOtp(email:string,password:string,otp:string) {
  try {
    const res = await axiosAuth.post("/auth/reset-password", { email,password,otp });
    toast.success("Password reset successfully!");
    return res;
  } catch (err: unknown) {
    toast.error("Failed to reset password.");
    throw err;
  }
  
}

//* Get user profile data
export async function getProfileData() {
  try {
    const res = await axiosAuth.get(`/auth/profile/`);
    console.log("Profile data fetched successfully:🚀", res);
    return res;
  } catch (err: unknown) {
    toast.error("Failed to fetch profile data.");
    throw err;
  }
}

//* Update user profile data
export async function updateProfileData(data: ProfileEdit) {
  try {
    console.log("Updating profile data with:", data);
    const res = await axiosAuth.put(`/auth/update-profile/`, data);
    console.log("Profile data updated successfully:🚀", res.data);
    return res.data;
  } catch (err: unknown) {
    toast.error("Failed to update profile data.");
    throw err;
  }
}
