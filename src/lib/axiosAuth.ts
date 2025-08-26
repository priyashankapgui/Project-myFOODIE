"use client";

import { getToken } from "@/store/local_storage";
import { useLoaderStore } from "@/store/useLoaderStore";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

const axiosAuth = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosAuth.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config : any) => {
    const setLoading = useLoaderStore.getState().setLoading;
    // Check if skipLoading is not true, then set loading
    if (!config?.skipLoading) {
      setLoading(true);
    }
    // setLoading(true);

    const token = getToken();

    if (!config.headers["Authorization"]) {
      config.headers["Authorization"] = token;
    }

    return config;
  },
  (error) => {
    const setLoading = useLoaderStore.getState().setLoading;
    setLoading(false);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosAuth.interceptors.response.use(
  (response) => {
    const setLoading = useLoaderStore.getState().setLoading;
    setLoading(false);
    return response?.data;
  },
  (error) => {
    console.log("🚀 ~ error:", error)
    const setLoading = useLoaderStore.getState().setLoading;
    setLoading(false);

    let errMessage = "";
    const { status } = error?.response;
    const { message } = error?.response?.data || "";

    if (status === 401) {
      console.log("Unauthorized, logging out ...");
      window.location.href = '/';
    } else if (status === 400) {
      errMessage = message || "Bad Request";
    } else if (status === 404) {
      errMessage = message || "Not Found";
    } else if (status === 403) {
      errMessage = message || "Forbidden";
    } else if (status === 500) {
      errMessage = message || "Internal Server Error";
    } else {
      errMessage = message || "An error occurred";
    }

    toast.error(errMessage);
    return Promise.reject({ code: status, message: errMessage });
  }
);

export default axiosAuth;
