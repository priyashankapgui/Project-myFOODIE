"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { BoxIconLine, DollarLineIcon } from "@/icons";
import { getSupplierMonthlyOrder } from "@/api/orderSummaryApi";
import { getAllMonthlyOrderSummary } from "@/api/orderSummaryApi";
import { getLocalUser } from "@/store/local_storage";
import { supllierMonthlyOrderSummary } from "@/types/httpResponseType";
import { toast } from "react-toastify";

export const EcommerceMetrics = () => {
  const [metrics, setMetrics] = useState<supllierMonthlyOrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);

        // Get user info from local storage
        const user = getLocalUser();
        const userId = user.roleId;
        const role = user.role; // Assuming the user object has a 'role' field

        if (!userId) {
          toast.error("User ID not found");
          return;
        }

        setUserRole(role);

        // Get current year and month
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        let response;

        // Fetch data based on user role
        if (role === "supplier") {
          // Fetch supplier-specific monthly order data
          response = await getSupplierMonthlyOrder(userId, year, month);
        } else if (role === "management") {
          // Fetch all monthly order summary for management
          response = await getAllMonthlyOrderSummary();
        } else {
          toast.error("Unauthorized role");
          return;
        }

        if (response) {
          setMetrics(response);
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
        toast.error("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
          <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
          <div className="mt-5 space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
          <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
          <div className="mt-5 space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Monthly Total Price Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          {userRole === "management" ? (
            <Badge color="info" >
              Manager View
            </Badge>
          ) : (
            <Badge color="success">
              Supplier View
            </Badge>
          )}
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Monthly Total Price
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics?.monthlyTotalPrice?.toLocaleString() || "0"}
            </h4>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {userRole === "supplier" ? "Hospital Price" : "Total Hospital Price"}
            </span>
            <Badge color="success">
              {metrics?.monthlyTotalHospitalPrice?.toLocaleString() || "0"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Monthly Total Orders Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 dark:text-white/90" />
          </div>
          {userRole === "management" ? (
            <Badge color="info" >
              Manager View
            </Badge>
          ) : (
            <Badge color="success">
              Supplier View
            </Badge>
          )}
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Monthly Total Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics?.monthlyTotalOrders?.toLocaleString() || "0"}
            </h4>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Total Items
            </span>
            <Badge color="warning">
              {metrics?.monthlyTotalItems?.toLocaleString() || "0"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};