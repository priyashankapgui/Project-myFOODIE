import axiosAuth from "@/lib/axiosAuth";
import {AuthData} from "@/types/httpResponseType";
import { setToken, setLocalUser,logoutUser } from "@/store/local_storage";

export async function loginUser(email: string, password: string) {
    console.log("Logging in user with email:", email,password);
     const res: AuthData = await axiosAuth.post("/auth/login", { email, password });
    console.log("Login response:🚀",  res);
    setToken(res.token);
    setLocalUser(res.user);
    return res;
}

export async function signOutUser(userId?: string) {
    // logoutUser();
    console.log("aaa",userId)
    const res: AuthData = await axiosAuth.post("/auth/logout", { userId });
    console.log("Logout response:🚀",  res);
    logoutUser();
    window.location.href = '/';
    return res;
}
